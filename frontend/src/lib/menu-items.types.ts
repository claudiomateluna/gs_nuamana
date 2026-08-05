/**
 * Menu Items Types
 * TypeScript interfaces for the menu_items table
 */

export interface MenuItem {
  id: string;
  parent_id: string | null;
  titulo: string;
  href: string | null;
  icono: string | null;
  orden: number;
  visible: boolean;
  roles_permitidos: string[];
  created_at: string;
  updated_at: string;
}

/**
 * MenuItemNode — hierarchical shape used by the Menubar component.
 * Children are nested inside their parent.
 */
export interface MenuItemNode extends Omit<MenuItem, 'created_at' | 'updated_at'> {
  children: MenuItemNode[];
}

/**
 * Flat item used by the admin form (no nesting, parent_id reference).
 */
export interface MenuItemFlat {
  id: string;
  parent_id: string | null;
  titulo: string;
  href: string | null;
  icono: string | null;
  orden: number;
  visible: boolean;
  roles_permitidos: string[];
}

/**
 * Role option for the admin form checkboxes.
 */
export interface RoleOption {
  value: string;
  label: string;
  group: string;
}

/**
 * All available role options for menu visibility.
 */
export const MENU_ROLE_OPTIONS: RoleOption[] = [
  { value: 'public', label: 'Todos (público)', group: 'General' },
  { value: 'authenticated', label: 'Autenticados', group: 'General' },
  { value: 'admin', label: 'Admin', group: 'Directivos' },
  { value: 'dirigente', label: 'Dirigente', group: 'Directivos' },
  { value: 'guiadora', label: 'Guiadora', group: 'Directivos' },
  { value: 'directiva', label: 'Directiva de Padres', group: 'Directivos' },
  { value: 'apoderado', label: 'Apoderado', group: 'Directivos' },
  { value: 'nnj1', label: 'NNJ1 (Lobatos)', group: 'NNJ' },
  { value: 'nnj2', label: 'NNJ2 (Guías)', group: 'NNJ' },
  { value: 'nnj3', label: 'NNJ3 (Scouts)', group: 'NNJ' },
  { value: 'nnj4', label: 'NNJ4 (Pioneros)', group: 'NNJ' },
  { value: 'nnj5', label: 'NNJ5 (Caminantes)', group: 'NNJ' },
];
