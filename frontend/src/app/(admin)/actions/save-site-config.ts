'use server';

/**
 * Server Action: Save Site Config
 * Validates input with Zod schema, verifies admin role via passed token,
 * upserts into configuracion_sitio, and revalidates the site-config cache.
 */

import { revalidateTag, revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import type { SchemaId } from '@/lib/admin-zones';
import { schemaResolver } from '@/lib/site-config.validation';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getSupabaseAnon(accessToken?: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}

function getSupabaseAdmin() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

export interface SaveSiteConfigResult {
  success: boolean;
  errors?: string[];
}

/**
 * Verifies the current user is an admin (rol_id = 1) using the passed access token.
 */
async function verifyAdmin(accessToken: string): Promise<{ userId: string } | null> {
  const supabase = getSupabaseAnon(accessToken);

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) return null;

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol_id')
    .eq('id', user.id)
    .single();

  if (!perfil || perfil.rol_id !== 1) return null;

  return { userId: user.id };
}

/**
 * Saves site configuration for a schema id (a plain category or a per-card
 * partial subset). Resolves the category + Zod schema via schemaResolver and
 * upserts ONLY the submitted keys into configuracion_sitio.
 * @param schemaId - Schema id to save; plain category ids keep the full-category
 *   behavior, the 4 partial ids validate only the submitted keys of their card.
 * @param accessToken - The user's Supabase access token (passed from client)
 */
export async function saveSiteConfig(
  schemaId: SchemaId,
  data: Record<string, unknown>,
  accessToken: string
): Promise<SaveSiteConfigResult> {
  // 1. Verify admin role server-side using the passed token
  const admin = await verifyAdmin(accessToken);
  if (!admin) {
    return { success: false, errors: ['No autorizado: solo administradores pueden cambiar la configuración'] };
  }

  // 2. Resolve the schema + category for this schema id
  const resolved = schemaResolver[schemaId];
  if (!resolved) {
    return { success: false, errors: ['Categoría inválida'] };
  }
  const { category, schema } = resolved;

  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e: { message: string }) => e.message);
    return { success: false, errors };
  }

  // 3. Upsert each submitted key into configuracion_sitio using service role (bypasses RLS)
  const supabase = getSupabaseAdmin();
  const validatedData = result.data as Record<string, unknown>;
  const errors: string[] = [];

  for (const [clave, valor] of Object.entries(validatedData)) {
    const { error } = await supabase
      .from('configuracion_sitio')
      .upsert(
        {
          categoria: category,
          clave,
          valor: JSON.parse(JSON.stringify(valor)),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'categoria,clave' }
      );

    if (error) {
      console.error(`[save-site-config] Error upserting ${category}.${clave}:`, error.message);
      errors.push(`Error al guardar ${clave}: ${error.message}`);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 4. Revalidate the site-config cache so all pages see the new values.
  //    revalidatePath('/', 'layout') re-renders the root-layout footer, which
  //    consumes contact.* on EVERY route (not just '/').
  revalidateTag('site-config', { expire: 60 });
  revalidatePath('/', 'layout');

  return { success: true };
}
