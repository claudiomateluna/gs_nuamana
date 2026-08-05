/**
 * Menu Permissions
 * Centralized role → menu visibility logic for the public navigation menu.
 * Consumed by the get-menu-items server action; rendered by ui/menu.tsx (PR4b).
 */

/**
 * Maps perfiles.rol_id values to the rol keys used in
 * menu_items.roles_permitidos (see MENU_ROLE_OPTIONS in menu-items.types.ts).
 * Rols 4-7 (Directiva de Padres) all share the 'directiva' key.
 * Rol 14 (Restringido) intentionally maps to NO key: restricted users only see
 * public or 'authenticated' items.
 */
export const ROL_ID_TO_KEY: Record<number, string> = {
  1: 'admin',
  2: 'dirigente',
  3: 'guiadora',
  4: 'directiva',
  5: 'directiva',
  6: 'directiva',
  7: 'directiva',
  8: 'apoderado',
  9: 'nnj1',
  10: 'nnj2',
  11: 'nnj3',
  12: 'nnj4',
  13: 'nnj5',
};

/**
 * Returns whether a menu item (defined by its roles_permitidos) is visible to
 * a user with the given rol_id.
 *
 * Rules:
 * - Empty roles_permitidos SHALL mean public: visible to everyone.
 * - The explicit 'public' key also grants access to everyone.
 * - Anonymous users (null rolId) only see public items.
 * - The 'authenticated' key grants access to any logged-in user.
 * - Otherwise the user's rol key (ROL_ID_TO_KEY) must be in the list.
 */
export function canSeeItem(rolesPermitidos: string[], userRolId: number | null): boolean {
  if (rolesPermitidos.length === 0) return true; // empty = public
  if (rolesPermitidos.includes('public')) return true; // explicit public
  if (userRolId === null) return false; // anonymous: nothing else visible
  if (rolesPermitidos.includes('authenticated')) return true; // any logged-in user
  const rolKey = ROL_ID_TO_KEY[userRolId];
  return rolKey !== undefined && rolesPermitidos.includes(rolKey);
}
