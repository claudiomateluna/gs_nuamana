/**
 * Menu Items Reader
 * Fetches menu structure from the menu_items table and builds a tree.
 */

import { createClient } from '@supabase/supabase-js';
import type { MenuItem, MenuItemNode } from './menu-items.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Fetches all visible menu items from DB and returns them as a tree.
 * Items with parent_id = null are top-level.
 * Items with a parent_id are nested inside their parent's `children` array.
 */
export async function getMenuItems(): Promise<MenuItemNode[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('visible', true)
    .order('orden');

  if (error || !data) {
    console.warn('[menu-items] Failed to fetch menu items:', error?.message);
    return [];
  }

  return buildTree(data as MenuItem[]);
}

/**
 * Fetches ALL menu items (including hidden) for the admin panel.
 */
export async function getAllMenuItems(): Promise<MenuItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('orden');

  if (error || !data) {
    console.warn('[menu-items] Failed to fetch all menu items:', error?.message);
    return [];
  }

  return data as MenuItem[];
}

/**
 * Builds a tree from a flat array of menu items.
 */
function buildTree(items: MenuItem[]): MenuItemNode[] {
  const map = new Map<string, MenuItemNode>();
  const roots: MenuItemNode[] = [];

  // Create nodes
  for (const item of items) {
    map.set(item.id, {
      ...item,
      children: [],
    });
  }

  // Link children to parents
  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
