'use server';

/**
 * Server Action: Get Menu Items
 * Returns the navigation menu tree filtered by the current user's rol, derived
 * SERVER-SIDE from the session access token (never from a client-supplied rol).
 *
 * - No token → anonymous (public items only).
 * - The token is verified with supabase.auth.getUser; a failed/invalid token
 *   degrades to anonymous (never throws).
 * - The rol is then looked up in `perfiles` by the verified user id.
 *
 * The result distinguishes an EMPTY menu_items table (dbEmpty) from "DB has
 * rows but zero are visible to this rol" so the consumer only falls back to
 * HARDCODED_MENU_TREE on a truly empty DB (ui/menu.tsx renders nothing
 * otherwise — role-gated items must never leak through the fallback).
 */

import { createClient } from '@supabase/supabase-js';
import { buildTree } from '@/lib/menu-items';
import { canSeeItem } from '@/lib/menu-permissions';
import { enhanceMenuTitles, buildUnitNameMap } from '@/lib/unit-title';
import type { UnitNameRow } from '@/lib/unit-title';
import type { MenuItem, MenuItemNode } from '@/lib/menu-items.types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export interface GetMenuItemsResult {
  items: MenuItemNode[];
  dbEmpty: boolean;
}

function getSupabaseAnon(accessToken?: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}

type AnonClient = ReturnType<typeof getSupabaseAnon>;

/**
 * Resolves the user's rol from a verified access token.
 * Returns null for anonymous (no token), invalid/failed tokens, or when the
 * user has no perfiles row / rol_id.
 */
async function resolveRolId(
  supabase: AnonClient,
  accessToken: string | null,
): Promise<number | null> {
  if (!accessToken) return null;

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return null;

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol_id')
    .eq('id', user.id)
    .single();

  if (!perfil) return null;
  return perfil.rol_id ?? null;
}

/**
 * Fetches menu items and returns the tree of items visible to the user derived
 * from the passed access token.
 * @param accessToken - The session access_token, or null when not logged in.
 */
export async function getMenuItems(accessToken: string | null): Promise<GetMenuItemsResult> {
  const supabase = getSupabaseAnon(accessToken ?? undefined);
  const rolId = await resolveRolId(supabase, accessToken);

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('orden');

  if (error || !data) {
    console.warn('[get-menu-items] Failed to fetch menu items:', error?.message);
    return { items: [], dbEmpty: true };
  }

  const dbEmpty = data.length === 0;
  const visibleItems = (data as MenuItem[]).filter(
    (item) => item.visible && canSeeItem(item.roles_permitidos, rolId),
  );
  const menuTree = buildTree(visibleItems);

  // Enriquecer los títulos de las unidades con unidades.nombre_unidad
  // (fuente única de verdad). Lectura pública y de solo 5 filas.
  const { data: unidades, error: unidadesError } = await supabase
    .from('unidades')
    .select('id, nombre, nombre_unidad')
    .order('id');

  if (unidadesError) {
    console.warn('[get-menu-items] Failed to fetch unidades:', unidadesError.message);
    return { items: menuTree, dbEmpty };
  }

  const unidadesMap = buildUnitNameMap((unidades || []) as UnitNameRow[]);
  return { items: enhanceMenuTitles(menuTree, unidadesMap), dbEmpty };
}
