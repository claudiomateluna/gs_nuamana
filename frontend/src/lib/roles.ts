/**
 * Roles y permisos centralizados para Grupo Scout Nua Mana.
 *
 * ANTES: magic numbers dispersos en 101+ ubicaciones.
 * AHORA: una sola fuente de verdad.
 *
 * Para migrar un archivo existente:
 * 1. Reemplazar `[1, 2, 3].includes(perfil.rol_id)` → `isDirectivo(perfil)`
 * 2. Reemplazar `[9, 10, 11, 12, 13].includes(...)` → `isNNJ(perfil)`
 * 3. Reemplazar `rol_id === 1` → `hasRole(perfil, Rol.Admin)`
 * 4. Reemplazar `rol_id <= 8` → `canSeeTreasury(perfil)`
 */

// ── IDs de rol ──────────────────────────────────────────────────────────────

export enum Rol {
  Admin = 1,
  Dirigente = 2,
  Guiadora = 3,
  DirectivaPadres4 = 4,
  DirectivaPadres5 = 5,
  DirectivaPadres6 = 6,
  DirectivaPadres7 = 7,
  Apoderado = 8,
  NNJ1 = 9,
  NNJ2 = 10,
  NNJ3 = 11,
  NNJ4 = 12,
  NNJ5 = 13,
  Restringido = 14,
}

// ── Helpers de verificación de rol ──────────────────────────────────────────

/** Verifica si un perfil tiene un rol específico. */
export function hasRole(perfil: { rol_id: number | null }, rol: Rol): boolean {
  return perfil.rol_id === rol
}

/** Verifica si un perfil tiene alguno de los roles indicados. */
export function hasAnyRole(perfil: { rol_id: number | null }, roles: Rol[]): boolean {
  return roles.includes(perfil.rol_id as Rol)
}

// ── Grupos de permisos (reemplazan los includes mágicos) ───────────────────

/**
 * Admin + Dirigente + Guiadora.
 * Pueden ver: unidad, grupo, actas, inventario, ciclo, artículos, tally.
 */
export function isDirectivo(perfil: { rol_id: number | null }): boolean {
  return hasAnyRole(perfil, [Rol.Admin, Rol.Dirigente, Rol.Guiadora])
}

/**
 * Niños, Niñas y Jóvenes (roles 9-13).
 * Ven: ciclo, artículos, tally, progresión propia.
 */
export function isNNJ(perfil: { rol_id: number | null }): boolean {
  return hasAnyRole(perfil, [
    Rol.NNJ1, Rol.NNJ2, Rol.NNJ3, Rol.NNJ4, Rol.NNJ5,
  ])
}

/** Dirigente o Guiadora (roles 2-3). */
export function isDirigenteOrGuiadora(perfil: { rol_id: number | null }): boolean {
  return hasAnyRole(perfil, [Rol.Dirigente, Rol.Guiadora])
}

/** Directiva de Padres (roles 4-7). */
export function isDirectivaPadres(perfil: { rol_id: number | null }): boolean {
  return hasAnyRole(perfil, [
    Rol.DirectivaPadres4, Rol.DirectivaPadres5,
    Rol.DirectivaPadres6, Rol.DirectivaPadres7,
  ])
}

/**
 * Adultos que pueden ver pupilos (roles 2-8).
 * Incluye Dirigentes, Guiadoras, Directiva y Apoderados.
 */
export function isAdultoConPupilos(perfil: { rol_id: number | null }): boolean {
  return hasAnyRole(perfil, [
    Rol.Dirigente, Rol.Guiadora,
    Rol.DirectivaPadres4, Rol.DirectivaPadres5,
    Rol.DirectivaPadres6, Rol.DirectivaPadres7,
    Rol.Apoderado,
  ])
}

/** NNJ con agenda (roles 12-13 — beneficiaries mayores). */
export function isNNJConAgenda(perfil: { rol_id: number | null }): boolean {
  return hasAnyRole(perfil, [Rol.NNJ4, Rol.NNJ5])
}

// ── Permisos de funcionalidad ──────────────────────────────────────────────

/** Puede ver el modulo de Tesoreria (roles <= 8). */
export function canSeeTreasury(perfil: { rol_id: number | null }): boolean {
  return (perfil.rol_id ?? 0) <= Rol.Apoderado
}

/** Puede crear/editar en Tesoreria (roles <= 7). */
export function canActionTreasury(perfil: { rol_id: number | null }): boolean {
  return (perfil.rol_id ?? 0) <= Rol.DirectivaPadres7
}

/** No tiene restricciones de pestanas (excluido: role 14). */
export function canSeeAllTabs(perfil: { rol_id: number | null }): boolean {
  return perfil.rol_id !== Rol.Restringido
}

/** Es Administrador (rol 1). */
export function isAdmin(perfil: { rol_id: number | null }): boolean {
  return perfil.rol_id === Rol.Admin
}

/** Es Apoderado (rol 8). */
export function isApoderado(perfil: { rol_id: number | null }): boolean {
  return perfil.rol_id === Rol.Apoderado
}

/** Verifica si un perfil tiene estado 'inactivo'. */
export function isInactive(perfil: { estado?: string | null }): boolean {
  return perfil?.estado === 'inactivo'
}

/**
 * Puede ver la progresion de otro miembro.
 * Directivos (1-3) siempre. Apoderados (8) solo de sus pupilos.
 * NNJ (9-13) y Restringido (14) ven solo la suya.
 */
export function canViewOthersProgression(perfil: { rol_id: number | null }): boolean {
  return isDirectivo(perfil) || isApoderado(perfil)
}

/**
 * Puede sincronizar datos offline (preparar campamento).
 * Solo Directivos.
 */
export function canSyncOffline(perfil: { rol_id: number | null }): boolean {
  return isDirectivo(perfil)
}

/**
 * Puede programar actividades.
 * Solo Directivos.
 */
export function canProgramActivity(perfil: { rol_id: number | null }): boolean {
  return isDirectivo(perfil)
}

/**
 * Puede eliminar usuarios.
 * Solo Admin.
 */
export function canDeleteUser(perfil: { rol_id: number | null }): boolean {
  return isAdmin(perfil)
}

/**
 * Puede ver miembros del grupo completo.
 * Solo Directivos.
 */
export function canSeeGroupMembers(perfil: { rol_id: number | null }): boolean {
  return isDirectivo(perfil)
}

/**
 * Puede ver articulos propios (NNJ) o todos (Directivo).
 */
export function canSeeAllArticles(perfil: { rol_id: number | null }): boolean {
  return isDirectivo(perfil)
}

/**
 * Puede cerrar recaudaciones.
 * Solo roles <= 7 (no Apoderados ni NNJ).
 */
export function canCloseRecaudacion(perfil: { rol_id: number | null }): boolean {
  return canActionTreasury(perfil)
}

/**
 * Puede gestionar inventario (crear, editar, eliminar).
 * Solo Directivos.
 */
export function canManageInventory(perfil: { rol_id: number | null }): boolean {
  return isDirectivo(perfil)
}

/**
 * Puede crear actas.
 * Solo Directivos (roles 1-3).
 */
export function canCreateActa(perfil: { rol_id: number | null }): boolean {
  return isDirectivo(perfil)
}

/**
 * Obtiene el array de IDs de rol para un grupo de permisos.
 * Util para queries Supabase: `.in('rol_id', getRoleIds('directivos'))`
 */
export function getRoleIds(group: 'directivos' | 'nnj' | 'directivaPadres' | 'adultos' | 'dirigentes'): number[] {
  switch (group) {
    case 'directivos':
      return [Rol.Admin, Rol.Dirigente, Rol.Guiadora]
    case 'nnj':
      return [Rol.NNJ1, Rol.NNJ2, Rol.NNJ3, Rol.NNJ4, Rol.NNJ5]
    case 'directivaPadres':
      return [Rol.DirectivaPadres4, Rol.DirectivaPadres5, Rol.DirectivaPadres6, Rol.DirectivaPadres7]
    case 'adultos':
      return [Rol.Dirigente, Rol.Guiadora, Rol.DirectivaPadres4, Rol.DirectivaPadres5, Rol.DirectivaPadres6, Rol.DirectivaPadres7, Rol.Apoderado]
    case 'dirigentes':
      return [Rol.Dirigente, Rol.Guiadora]
  }
}
