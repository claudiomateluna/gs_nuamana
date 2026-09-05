'use server';

/**
 * migrate-content.ts
 * Server action: imports .md files from content/ into paginas_contenido table.
 * Links each page to its existing menu_item by matching titulo + parent_id.
 *
 * Run once: migrateContent()
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CONTENT_DIR = path.join(process.cwd(), 'frontend', 'content');

// Fixed parent UUIDs from menu_items seed
const PARENT_IDS: Record<string, string> = {
  'acerca-de': 'a0000000-0000-0000-0000-000000000002',
  'lo-que-hacemos': 'a0000000-0000-0000-0000-000000000003',
};

// Default icons per category (parent pages)
const CATEGORY_ICONS: Record<string, string> = {
  'acerca-de': 'IconoAcercaDe',
  'lo-que-hacemos': 'IconoLoQueHacemos',
};

// Map slug → menu_item icon (from menu_items seed)
const SLUG_TO_ICON: Record<string, string> = {
  'quienes-somos': 'IconoAcercaDeQuienesSomos',
  'nuestra-historia': 'IconoAcercaDeNuestraHistoria',
  'mision-y-vision': 'IconoAcercaDeMisionVision',
  'nuestro-equipo': 'IconoAcercaDeNuestroEquipo',
  'nuestros-apoderados': 'IconoAcercaDeNuestrosApoderados',
  'institucion-patrocinante': 'IconoAcercaDeInstitucionPatrocinante',
  'ley-y-promesa': 'IconoLoQueHacemos',
  'el-metodo-scout': 'IconoLoQueHacemosMetodoScout',
  'aprender-haciendo': 'IconoLoQueHacemosAprenderHaciendo',
  'sistema-de-equipos': 'IconoLoQueHacemosSistemaEquipos',
  'vida-al-aire-libre': 'IconoLoQueHacemosAireLibre',
  'habilidades-y-tecnicas': 'IconoLoQueHacemosHabilidadesTecnicas',
  'vida-reflexiva': 'IconoLoQueHacemosVidaReflexiva',
  'programa-y-actividades': 'IconoLoQueHacemosProgramasActividades',
};

interface Frontmatter {
  title?: string;
  description?: string;
  image?: string;
}

function parseFrontmatter(raw: string): { metadata: Frontmatter; body: string } {
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = raw.match(fmRegex);
  if (!match) return { metadata: {}, body: raw };

  const metadata: Frontmatter = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon > 0) {
      const key = line.slice(0, colon).trim();
      const val = line.slice(colon + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key in metadata || ['title', 'description', 'image'].includes(key)) {
        (metadata as Record<string, string>)[key] = val;
      }
    }
  }
  return { metadata, body: raw.replace(fmRegex, '') };
}

export interface MigrateResult {
  success: boolean;
  pagesCreated: number;
  menuLinksCreated: number;
  errors: string[];
}

export async function migrateContent(): Promise<MigrateResult> {
  const errors: string[] = [];
  let pagesCreated = 0;
  let menuLinksCreated = 0;

  for (const categoria of ['acerca-de', 'lo-que-hacemos'] as const) {
    const folder = path.join(CONTENT_DIR, categoria);
    if (!fs.existsSync(folder)) {
      errors.push(`Folder not found: ${folder}`);
      continue;
    }

    const files = fs.readdirSync(folder).filter(f => f.endsWith('.md'));
    const parentId = PARENT_IDS[categoria];

    for (const file of files) {
      const slug = path.parse(file).name;
      const raw = fs.readFileSync(path.join(folder, file), 'utf8');
      const { metadata, body } = parseFrontmatter(raw);

      const titulo = metadata.title || slug;
      const esPadre = slug === categoria; // acerca-de.md / lo-que-hacemos.md = parent

      // Find matching menu_item by titulo + parent_id
      const { data: menuItem } = await supabase
        .from('menu_items')
        .select('id')
        .eq('titulo', titulo)
        .eq('parent_id', esPadre ? null : parentId)
        .single();

      const menuItemId = menuItem?.id || null;

      // Upsert page
      const { error: upsertErr } = await supabase
        .from('paginas_contenido')
        .upsert({
          categoria,
          slug,
          titulo,
          descripcion: metadata.description || null,
          imagen: metadata.image || null,
          contenido: body,
          icono: SLUG_TO_ICON[slug] || CATEGORY_ICONS[categoria],
          orden: esPadre ? 0 : (files.indexOf(file)),
          visible: true,
          es_padre: esPadre,
          menu_item_id: menuItemId,
        }, { onConflict: 'categoria,slug' });

      if (upsertErr) {
        errors.push(`Error upserting ${categoria}/${slug}: ${upsertErr.message}`);
        continue;
      }

      pagesCreated++;
      if (menuItemId) menuLinksCreated++;
    }
  }

  return {
    success: errors.length === 0,
    pagesCreated,
    menuLinksCreated,
    errors,
  };
}
