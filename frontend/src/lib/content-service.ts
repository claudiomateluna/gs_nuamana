import fs from 'fs';
import path from 'path';

export interface ContentMetadata {
  title?: string;
  description?: string;
  image?: string;
  [key: string]: any;
}

export interface ContentFile {
  content: string;
  metadata: ContentMetadata;
}

export interface ContentItem {
  slug: string;
  metadata: ContentMetadata;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

export async function readContentFile(folder: string, slug: string): Promise<ContentFile> {
  const filePath = path.join(CONTENT_DIR, folder, `${slug}.md`);
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

export async function getAllContentMetadata(folder: string): Promise<ContentItem[]> {
  const folderPath = path.join(CONTENT_DIR, folder);
  try {
    const fileNames = fs.readdirSync(folderPath);
    const contentItems: ContentItem[] = [];
    for (const fileName of fileNames) {
      if (path.extname(fileName) === '.md') {
        const slug = path.parse(fileName).name;
        try {
          const fileContents = fs.readFileSync(path.join(folderPath, fileName), 'utf8');
          let metadata: ContentMetadata = {};
          const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
          const frontmatterMatch = fileContents.match(frontmatterRegex);
          if (frontmatterMatch) {
            metadata = parseFrontmatter(frontmatterMatch[1]);
          }
          contentItems.push({ slug, metadata });
        } catch (error) {
          contentItems.push({ slug, metadata: {} });
        }
      }
    }
    return contentItems;
  } catch (error) {
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
