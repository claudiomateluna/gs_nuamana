'use server';

/**
 * Server Action: Upload an SVG icon to public/images/iconos/
 * Validates that the file is an SVG and saves it to the filesystem.
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const ICONS_DIR = path.join(process.cwd(), 'public', 'images', 'iconos');

export async function uploadMenuIcon(
  formData: FormData,
  token: string
): Promise<{ success: boolean; path?: string; error?: string }> {
  // Verify auth
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return { success: false, error: 'No autenticado' };

  // Verify admin role
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol_id')
    .eq('id', user.id)
    .single();

  if (!perfil || perfil.rol_id !== 1) {
    return { success: false, error: 'Sin permisos de admin' };
  }

  // Get file from FormData
  const file = formData.get('file') as File | null;
  if (!file) return { success: false, error: 'No se proporcionó archivo' };

  // Validate SVG
  if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
    return { success: false, error: 'Solo se permiten archivos .svg' };
  }

  if (file.size > 500 * 1024) {
    return { success: false, error: 'El archivo no puede superar 500KB' };
  }

  // Sanitize filename
  const baseName = file.name
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const filename = baseName.endsWith('.svg') ? baseName : `${baseName}.svg`;
  const filePath = path.join(ICONS_DIR, filename);

  // Ensure directory exists
  if (!existsSync(ICONS_DIR)) {
    await mkdir(ICONS_DIR, { recursive: true });
  }

  // Write file
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return {
    success: true,
    path: `/images/iconos/${filename}`,
  };
}
