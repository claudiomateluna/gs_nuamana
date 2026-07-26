# Design: Link Activity Fichas to Acta Compromisos

## Technical Approach

Create a junction table `acta_acuerdo_fichas` to link group activity compromises (`acta_acuerdos.es_actividad_grupal = true`) to activity fichas (articles from "Actividades" category). Extend the acta creation flow with an inline multi-select, display linked fichas in acta view and cycle calendar, and handle offline sync via the outbox service.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Junction table PK | `(acuerdo_id, articulo_id)` composite | Separate UUID PK | Matches existing pattern, avoids extra columns, natural uniqueness |
| Selector component | Inline in acuerdo card, conditional on `es_actividad_grupal` | Separate modal | Keeps context, no extra navigation, follows existing checkbox pattern |
| Ficha fetch | Lazy load via `dashboardService` with Supabase join | Eager load all actas | Reduces payload, only fetches when acta is opened for editing |
| Offline sync | Extend `actas_completo` outbox payload with `fichas` array | Separate outbox entry | Atomicity — all or nothing for acta creation |
| Calendar display | Extend `getGroupAgreements()` to return ficha metadata | Separate service call | Single query, follows existing pattern |

## Data Flow

```
User checks "¿Actividad Grupal?" on acuerdo
         │
         ▼
SelectorFichasActividad renders inline
         │
         ▼
Fetches activitites from articulos (categoria=Actividades)
         │
         ▼
User selects fichas → stored in AcuerdoData.fichas_vinculadas[]
         │
         ▼
On save:
  1. Insert acta_acuerdos (with es_actividad_grupal)
  2. For each acuerdo with fichas: INSERT INTO acta_acuerdo_fichas
         │
         ▼
On load (dashboardService):
  1. Fetch acta_acuerdos with join to acta_acuerdo_fichas → articulos
  2. Enrich ActaAcuerdo with fichas_vinculadas[]
         │
         ▼
cycleService.getGroupAgreements():
  1. JOIN acta_acuerdo_fichas → articulos for ficha metadata
  2. Return enriched grupal agreements
         │
         ▼
dash_ciclo.tsx → CicloFase3Planeacion shows ficha links
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `types/index.ts` | Modify | Add `fichas_vinculadas` to `ActaAcuerdo`, add `ActaAcuerdoFicha` interface |
| `components/dashboard/SelectorFichasActividad.tsx` | Create | Multi-select component for activity fichas |
| `components/dashboard/dashmod_acta_crear.tsx` | Modify | Integrate `SelectorFichasActividad` when `es_actividad_grupal` checked, save junction rows |
| `components/dashboard/dashmod_acta_ver.tsx` | Modify | Display linked fichas in acuerdo cards |
| `services/dashboardService.ts` | Modify | Fetch linked fichas when loading actas |
| `services/cycleService.ts` | Modify | Extend `getGroupAgreements()` to include ficha metadata |
| `components/dashboard/ciclo/CicloFase3Planeacion.tsx` | Modify | Show ficha links for grupal items in calendar |
| `lib/outbox-service.ts` | Modify | Handle offline sync of ficha links in `actas_completo` payload |

## Type Definitions

```typescript
// New interface for junction table
export interface ActaAcuerdoFicha {
  acuerdo_id: string
  articulo_id: string
  created_at?: string
}

// Updated ActaAcuerdo with linked fichas
export interface ActaAcuerdo {
  id: string
  acta_id: string
  descripcion: string
  responsable?: string | null
  fecha_limite?: string | null
  cumplido?: boolean
  es_actividad_grupal?: boolean
  // NEW: linked activity fichas
  fichas_vinculadas?: Pick<Articulo, 'id' | 'titulo' | 'slug' | 'extracto' | 'imagen_destacada'>[]
}

// Updated AcuerdoData in dashmod_acta_crear.tsx
interface AcuerdoData {
  titulo: string
  descripcion: string
  responsable_id: string
  fecha_compromiso: string
  prioridad: string
  estado?: string
  es_actividad_grupal?: boolean
  // NEW: selected ficha IDs for saving
  fichas_seleccionadas?: string[]
}

// Updated outbox Acuerdo payload
interface Acuerdo {
  titulo: string
  descripcion?: string
  responsable_id?: string | null
  fecha_compromiso?: string | null
  prioridad?: string
  estado?: string
  es_actividad_grupal?: boolean
  // NEW
  fichas_seleccionadas?: string[]
}

// Enriched group agreement from cycleService
interface GroupAgreementWithFichas {
  id: string
  titulo: string
  descripcion: string
  fecha_compromiso: string | null
  fichas?: Pick<Articulo, 'id' | 'titulo' | 'slug' | 'imagen_destacada'>[]
}
```

## Service Layer Changes

### dashboardService.ts — `fetchDashboardData()`

Current actas query (line 73):
```typescript
supabase.from('actas').select('*, unidades(nombre), acta_temas(*), mi_firma:acta_firmas!acta_firmas_acta_id_fkey(*)')
```

Updated query — add join to acuerdos with fichas:
```typescript
supabase.from('actas').select(`
  *, unidades(nombre), acta_temas(*),
  mi_firma:acta_firmas!acta_firmas_acta_id_fkey(*),
  acta_acuerdos(*, fichas:acta_acuerdo_fichas(articulo:articulos(id, titulo, slug, extracto, imagen_destacada)))
`)
```

### cycleService.ts — `getGroupAgreements()`

Current (line 109-118):
```typescript
async getGroupAgreements(unidadId: number) {
  const { data, error } = await supabase
    .from('acta_acuerdos')
    .select('id, titulo, descripcion, fecha_compromiso')
    .eq('es_actividad_grupal', true)
    .not('fecha_compromiso', 'is', null)
  if (error) throw error
  return data || []
}
```

Updated:
```typescript
async getGroupAgreements(unidadId: number) {
  const { data, error } = await supabase
    .from('acta_acuerdos')
    .select(`
      id, titulo, descripcion, fecha_compromiso,
      fichas:acta_acuerdo_fichas(
        articulo:articulos(id, titulo, slug, imagen_destacada)
      )
    `)
    .eq('es_actividad_grupal', true)
    .not('fecha_compromiso', 'is', null)
  if (error) throw error

  // Flatten fichas for easier consumption
  return (data || []).map(a => ({
    ...a,
    fichas: (a.fichas || []).map((f: any) => f.articulo).filter(Boolean)
  }))
}
```

## Component Architecture

### SelectorFichasActividad.tsx

```
SelectorFichasActividad
├── Props: { selectedIds, onChange, disabled }
├── State: fichas (Articulo[]), loading, search
├── Fetch: supabase.from('articulos').select('*')
│          .eq('categoria', 'Actividades')
│          .eq('estado', 'publicado')
├── Render: searchable multi-select grid
│   ├── Search input
│   └── Grid of ficha cards (toggle selection)
└── Output: selectedIds[] → parent AcuerdoData.fichas_seleccionadas
```

### Integration in dashmod_acta_crear.tsx

```
Acuerdo card (line 588-619)
├── Existing: titulo, descripcion, responsable, plazo, prioridad
├── Existing: checkbox "¿Actividad Grupal?"
└── NEW (conditional on es_actividad_grupal):
    └── <SelectorFichasActividad
          selectedIds={a.fichas_seleccionadas || []}
          onChange={(ids) => updateAcuerdoFichas(i, ids)}
        />
```

### dashmod_acta_ver.tsx — Ficha Display

In the acuerdos section (line 75-94), after the existing responsable/plazo/estado row, add:
```tsx
{a.fichas_vinculadas?.length > 0 && (
  <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-100/50">
    <span className="text-[0.8em] font-bold uppercase opacity-60">Fichas:</span>
    {a.fichas_vinculadas.map(f => (
      <a key={f.id} href={`/blog/actividades/${f.slug}`}
         target="_blank"
         className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[0.8em] font-bold hover:bg-green-200">
        📄 {f.titulo}
      </a>
    ))}
  </div>
)}
```

## Offline Strategy

### outbox-service.ts — `actas_completo` handler

Extend the `ActaCompletoPayload` interface and the INSERT handler:

```typescript
// In processQueue(), case 'actas_completo':
// After step 5 (insert acuerdos), add step 5.5:

// 5.5. Insertar fichas vinculadas
if (!error && acToIns.length > 0) {
  // We need the newly created acuerdo IDs
  const { data: insertedAcuerdos } = await supabase
    .from('acta_acuerdos')
    .select('id, titulo')
    .eq('acta_id', newActaId)

  if (insertedAcuerdos) {
    const fichasToIns: Array<{acuerdo_id: string, articulo_id: string}> = []
    for (const acuerdo of acuerdos) {
      if (acuerdo.fichas_seleccionadas?.length) {
        const dbAcuerdo = insertedAcuerdos.find(a => a.titulo === acuerdo.titulo.trim())
        if (dbAcuerdo) {
          for (const artId of acuerdo.fichas_seleccionadas) {
            fichasToIns.push({ acuerdo_id: dbAcuerdo.id, articulo_id: artId })
          }
        }
      }
    }
    if (fichasToIns.length > 0) {
      const { error: fichasErr } = await supabase
        .from('acta_acuerdo_fichas')
        .insert(fichasToIns)
      if (fichasErr) error = fichasErr
    }
  }
}
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| Ficha fetch fails (articulos query) | Show empty selector with toast warning, allow saving acta without fichas |
| Junction insert fails (online) | Rollback acta_acuerdos delete, show error toast |
| Junction insert fails (offline outbox) | Outbox retry logic handles it (3 attempts, then delete) |
| Ficha deleted after linking | Display fallback "Ficha no disponible" in acta_ver and calendar |
| Network error during save | Existing outbox fallback includes fichas_seleccionadas in payload |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | SelectorFichasActividad renders, filters, toggles | React Testing Library, mock Supabase |
| Unit | cycleService.getGroupAgreements returns fichas | Mock Supabase, assert enriched data |
| Integration | Acta save with fichas creates junction rows | Supabase test client, verify DB state |
| Integration | Offline outbox syncs ficha links | Mock navigator.onLine=false, process queue |
| E2E | Full flow: create acta → link fichas → view in calendar | Playwright/Cypress, happy path |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

DB migration required before frontend deployment:
```sql
CREATE TABLE IF NOT EXISTS acta_acuerdo_fichas (
  acuerdo_id UUID REFERENCES acta_acuerdos(id) ON DELETE CASCADE,
  articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (acuerdo_id, articulo_id)
);
```

No data migration needed — existing acuerdos with `es_actividad_grupal = true` will simply have empty fichas lists until users link them.

## Open Questions

- [ ] Should ficha links be editable after acta is signed? (Current plan: yes, but only for unsigned acuerdos)
- [ ] Maximum number of fichas per acuerdo? (Suggest: no hard limit, UI handles gracefully)
