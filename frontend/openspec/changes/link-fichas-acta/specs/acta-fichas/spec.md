# Acta-Fichas Linking Specification

## Purpose
Enable linking of activity fichas (articulos in "Actividades" category) to group acuerdos in actas, surfacing linked activities in the cycle calendar for scheduling and tracking.

## Data Model

### New Interface: `ActaAcuerdoFicha`
```typescript
interface ActaAcuerdoFicha {
  acuerdo_id: string
  articulo_id: string
  created_at?: string
}
```

### Extended Interface: `ActaAcuerdo`
Add optional field:
```typescript
fichas_vinculadas?: Articulo[]  // Joined from acta_acuerdo_fichas → articulos
```

### IndexedDB Table: `acta_acuerdo_fichas_offline`
```typescript
interface AcuerdoFichaOffline {
  acuerdo_id: string
  articulo_id: string
  titulo: string        // Denormalized for offline display
  slug: string
  pending_sync: boolean
}
```

## Requirements

### Requirement: Ficha Selector Widget

The system MUST display an inline ficha selector when the "Actividad Grupal" checkbox is checked on an acuerdo in the acta creation form.

#### Scenario: Selector appears on grupal check

- GIVEN the user is creating or editing an acta
- WHEN the user checks "Actividad Grupal" on an acuerdo
- THEN a collapsible ficha selector section appears below the acuerdo fields
- AND the selector is collapsed by default when no fichas are linked

#### Scenario: Selector hidden when not grupal

- GIVEN the user unchecks "Actividad Grupal" on an acuerdo
- WHEN the checkbox state changes to unchecked
- THEN the ficha selector section is hidden
- AND any previously selected fichas are NOT deleted (preserved for re-check)

#### Scenario: Ficha search

- GIVEN the ficha selector is visible
- WHEN the user types in the search input
- THEN the list filters to show only fichas whose `titulo` or `extracto` matches the search term (case-insensitive, substring match)

#### Scenario: Filter by area

- GIVEN the ficha selector is visible
- WHEN the user selects an area from the filter dropdown
- THEN only fichas with that area in `metadata.areas` are shown
- AND the area dropdown is populated from `progresion_areas` table

#### Scenario: Select ficha

- GIVEN the ficha selector shows available fichas
- WHEN the user clicks on a ficha card
- THEN the ficha is marked as selected (visual toggle)
- AND the selected ficha appears in a "Linked" summary above the selector

#### Scenario: Deselect ficha

- GIVEN a ficha is currently selected
- WHEN the user clicks the ficha card again or clicks a remove button
- THEN the ficha is deselected
- AND the visual toggle reverts to unselected

#### Scenario: No fichas available

- GIVEN the ficha selector is visible
- WHEN there are no articulos in category ID 1
- THEN a message "No hay fichas de actividad disponibles" is displayed
- AND the selector does not show an empty list

---

### Requirement: Ficha Linking Persistence

The system MUST persist selected ficha links to the `acta_acuerdo_fichas` junction table when the acta is saved.

#### Scenario: Save with linked fichas

- GIVEN the user has selected fichas for a grupal acuerdo
- WHEN the user saves the acta
- THEN the system inserts records into `acta_acuerdo_fichas` for each selected ficha
- AND old links for that acuerdo are deleted first (delete-then-insert pattern)

#### Scenario: Save with no fichas

- GIVEN the user has a grupal acuerdo with no fichas selected
- WHEN the user saves the acta
- THEN no records are inserted into `acta_acuerdo_fichas` for that acuerdo
- AND existing links for other acuerdos are preserved

#### Scenario: Edit acta with existing links

- GIVEN an acta is being edited and has existing ficha links
- WHEN the acta form loads
- THEN the ficha selector shows previously linked fichas as selected
- AND the user can add or remove links

---

### Requirement: Offline Ficha Linking

The system MUST queue ficha link operations in the outbox when offline.

#### Scenario: Offline save enqueues links

- GIVEN the user is offline
- WHEN the user saves an acta with ficha links
- THEN the ficha link data is included in the outbox payload
- AND the payload type is `actas_completo` with an `acuerdo_fichas` array
- AND a toast notification confirms offline save

#### Scenario: Online sync processes links

- GIVEN the outbox queue has a pending `actas_completo` item with `acuerdo_fichas`
- WHEN the device comes online and `processQueue` runs
- THEN the system first inserts the acta and acuerdos
- THEN for each acuerdo with fichas, inserts into `acta_acuerdo_fichas`
- AND deletes the outbox item on success

---

### Requirement: View Linked Fichas in Acta

The system MUST display linked fichas under each acuerdo when viewing an acta.

#### Scenario: Display linked fichas

- GIVEN an acta is being viewed
- WHEN an acuerdo has linked fichas
- THEN each ficha is shown as a card with title, extracto, and a link to `/blog/{slug}`
- AND the fichas section is visually grouped under the acuerdo

#### Scenario: No linked fichas

- GIVEN an acta is being viewed
- WHEN an acuerdo has no linked fichas
- THEN no ficha section is shown for that acuerdo
- AND the acuerdo displays normally without placeholder

#### Scenario: Grupal badge

- GIVEN an acuerdo is marked as grupal
- WHEN the acta is viewed
- THEN a "Grupal" badge is displayed on the acuerdo card
- AND if fichas are linked, a count badge shows the number of linked fichas

---

### Requirement: Calendar Integration

The system MUST display linked fichas in the cycle calendar for grupal acuerdos.

#### Scenario: Batched fetch of ficha links

- GIVEN the cycle calendar is loading grupal acuerdos
- WHEN `getGroupAgreements` is called
- THEN the system fetches all ficha links for grupal acuerdos in a single batched query using `acta_acuerdo_fichas` join
- AND each acuerdo includes `fichas_vinculadas` array

#### Scenario: Calendar item shows ficha links

- GIVEN a grupal acuerdo has linked fichas
- WHEN the cycle calendar renders the item
- THEN each linked ficha is shown as a clickable link to `/blog/{slug}`
- AND the ficha titles are displayed in the calendar card

#### Scenario: Grupal without fichas

- GIVEN a grupal acuerdo has no linked fichas
- WHEN the cycle calendar renders the item
- THEN the item displays normally without ficha links
- AND no empty state is shown

---

### Requirement: Role-Based Access

Any role (1, 2, or 3) MUST be able to link fichas when opening an acta.

#### Scenario: Admin can link fichas

- GIVEN a user with role 1 (Admin) opens an acta
- WHEN they check "Actividad Grupal" on an acuerdo
- THEN the ficha selector is available

#### Scenario: Dirigente can link fichas

- GIVEN a user with role 2 (Dirigente) opens an acta
- WHEN they check "Actividad Grupal" on an acuerdo
- THEN the ficha selector is available

#### Scenario: Directiva can link fichas

- GIVEN a user with role 3 (Directiva) opens an acta
- WHEN they check "Actividad Grupal" on an acuerdo
- THEN the ficha selector is available

## Edge Cases

### Edge Case: Ficha deleted while linked
- GIVEN a ficha is linked to an acuerdo
- WHEN the ficha article is deleted from the database
- THEN the link record remains but the ficha is not displayed
- AND no error is thrown; the stale link is silently ignored

### Edge Case: Acta with mixed grupal and non-grupal acuerdos
- GIVEN an acta has both grupal and non-grupal acuerdos
- WHEN the acta is saved
- THEN only grupal acuerdos can have ficha links
- AND non-grupal acuerdos have no ficha selector

### Edge Case: Large number of fichas
- GIVEN there are 100+ activity fichas
- WHEN the ficha selector opens
- THEN results are paginated or virtualized (max 50 visible at once)
- AND search narrows results before rendering full list

### Edge Case: Concurrent offline edits
- GIVEN two devices edit the same acta offline
- WHEN both come online and sync
- THEN the last write wins for acuerdo-ficha links
- AND no data corruption occurs (delete-then-insert is idempotent)

## Error Handling

| Error | Handling |
|-------|----------|
| Ficha fetch fails | Show selector with "Error al cargar fichas" and retry button |
| Save fails (network) | Auto-enqueue to outbox with toast warning |
| Save fails (validation) | Show inline error, prevent save |
| Outbox sync fails | Retry up to 3 times, then log and skip |
| Junction table insert fails | Roll back acta save, show error toast |

## Acceptance Criteria

1. [ ] Checking "Actividad Grupal" reveals the ficha selector
2. [ ] Fichas can be searched by title/extracto
3. [ ] Fichas can be filtered by area
4. [ ] Selected fichas persist across form re-renders
5. [ ] Saving acta with fichas creates junction table records
6. [ ] Editing acta loads existing ficha links into selector
7. [ ] Acta view shows linked fichas under each acuerdo
8. [ ] Cycle calendar shows ficha links for grupal items
9. [ ] Offline save enqueues ficha links in outbox
10. [ ] All roles (1, 2, 3) can access the selector
11. [ ] Backward compat: existing grupal acuerdos without fichas work unchanged
12. [ ] Performance: ficha fetch for all grupales uses single batched query

## User Stories

1. **As a Dirigente**, I want to link activity fichas to grupal acuerdos so that activities appear in the cycle calendar for scheduling.

2. **As an Admin**, I want to search and filter fichas by area so that I can quickly find the right activity to link.

3. **As a Directiva member**, I want to see linked fichas when viewing an acta so I understand which activities are planned.

4. **As any user**, I want offline support so I can link fichas without connectivity and have them sync later.

5. **As a cycle planner**, I want linked fichas to appear in the calendar so I can see grupal activities alongside other scheduled items.
