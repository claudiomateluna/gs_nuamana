# Proposal: Link Activity Fichas to Acta Compromisos

## Intent
Allow users to link "Fichas de Actividad" (articles from the "Actividades" category, ID 1) to group acuerdos (compromisos) in actas. When a grupal acuerdo is linked to fichas, those activities appear in the cycle calendar for scheduling.

## Scope
- Frontend only (Supabase schema change is pre-existing)
- New junction table `acta_acuerdo_fichas` (acuerdo_id, articulo_id)
- Modify acta creation/viewing modals
- Modify cycle calendar to display linked fichas
- Offline support via outbox queue

## Affected Areas
- Types: `ActaAcuerdo` interface extension
- Components: `dashmod_acta_crear.tsx`, `dashmod_acta_ver.tsx`
- Services: `cycleService.ts` (batched fetch), `outbox-service.ts` (offline enqueue)
- IndexedDB: new `acta_acuerdo_fichas_offline` table
- Cycle: `CicloFase3Planeacion.tsx`, `CicloFase4Ejecucion.tsx`

## Capabilities
- **Ficha Selector**: Inline search/select widget for activity fichas
- **Acuerdo-Ficha Linking**: CRUD on junction table
- **Calendar Integration**: Linked fichas appear in cycle calendar
- **Offline Sync**: Ficha links queued in outbox when offline
