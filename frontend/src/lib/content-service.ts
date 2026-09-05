import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

export interface ContentMetadata {
  title?: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
}

export interface ContentFile {
  content: string;
  metadata: ContentMetadata;
  format?: 'markdown' | 'html';
}

export interface ContentItem {
  slug: string;
  metadata: ContentMetadata;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Read a single content page.
 * Tries DB first; falls back to filesystem if no DB row exists.
 */
export async function readContentFile(folder: string, slug: string): Promise<ContentFile> {
  // --- DB first ---
  try {
    const { data, error } = await supabase
      .from('paginas_contenido')
      .select('contenido, titulo, descripcion, imagen, formato')
      .eq('categoria', folder)
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return {
        content: data.contenido || '',
        metadata: {
          title: data.titulo,
          description: data.descripcion,
          image: data.imagen,
        },
        format: data.formato || 'markdown',
      };
    }
  } catch {
    // DB not available or table doesn't exist — fall through
  }

  // --- Filesystem fallback ---
  const filePath = path.join(CONTENT_DIR, folder, `${slug}.md`);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(CONTENT_DIR))) {
    throw new Error('Invalid path');
  }
  try {
    let fileContents = fs.readFileSync(filePath, 'utf8');
    let metadata: ContentMetadata = {};
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const frontmatterMatch = fileContents.match(frontmatterRegex);
    if (frontmatterMatch) {
      metadata = parseFrontmatter(frontmatterMatch[1]);
      fileContents = fileContents.replace(frontmatterRegex, '');
    }
    return { content: fileContents, metadata };
  } catch (error) {
    console.error(`Error reading content file ${filePath}:`, error);
    throw new Error(`Could not read content file: ${folder}/${slug}.md`);
  }
}

/**
 * List all content pages for a category (for card grids).
 * Tries DB first; falls back to filesystem.
 */
export async function getAllContentMetadata(folder: string): Promise<ContentItem[]> {
  // --- DB first ---
  try {
    const { data, error } = await supabase
      .from('paginas_contenido')
      .select('slug, titulo, descripcion, imagen')
      .eq('categoria', folder)
      .eq('visible', true)
      .neq('es_padre', true)
      .order('orden');

    if (!error && data && data.length > 0) {
      return data.map(row => ({
        slug: row.slug,
        metadata: {
          title: row.titulo,
          description: row.descripcion,
          image: row.imagen,
        },
      }));
    }
  } catch {
    // DB not available — fall through
  }

  // --- Filesystem fallback ---
  const folderPath = path.join(CONTENT_DIR, folder);
  try {
    const fileNames = fs.readdirSync(folderPath);
    const contentItems: ContentItem[] = [];
    for (const fileName of fileNames) {
      if (path.extname(fileName) === '.md') {
        const slug = path.parse(fileName).name;
        // Skip parent pages from listing
        if (slug === folder) continue;
        try {
          const fileContents = fs.readFileSync(path.join(folderPath, fileName), 'utf8');
          let metadata: ContentMetadata = {};
          const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
          const frontmatterMatch = fileContents.match(frontmatterRegex);
          if (frontmatterMatch) {
            metadata = parseFrontmatter(frontmatterMatch[1]);
          }
          contentItems.push({ slug, metadata });
        } catch {
          contentItems.push({ slug, metadata: {} });
        }
      }
    }
    return contentItems;
  } catch {
    return [];
  }
}

function parseFrontmatter(frontmatter: string): ContentMetadata {
  const metadata: ContentMetadata = {};
  const lines = frontmatter.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      const cleanedValue = value.replace(/^['"]|['"]$/g, '');
      metadata[key] = cleanedValue;
    }
  }
  return metadata;
}
