/**
 * Article JSON-LD Builder
 * Builds the single multi-type node the blog route injects. Kind and properties
 * come only from the category hierarchy and the article metadata: nothing is
 * invented. A HowTo is a HowTo only when the body really yields enough complete
 * steps (Google rejects a HowTo without steps), a game only when the metadata
 * says so, and every empty value is dropped before the graph is returned so the
 * JSON-LD never trips a validator on '', [] or null.
 */

import type { ArticuloMetadata } from '@/types';
import { chainPath, deepestChain } from './chains';
import {
  areasThings,
  cantidadPlayers,
  duracionIso,
  lugaresPlaces,
  objetivosQuest,
  stringsAThing,
  toStringArray,
  unidadRango,
} from './mappings';
import { stripHtml } from './normalize';
import type { ArticleKind, ArticleSchemaInput, CategoriaRow } from './types';

const ABOUT_LIMIT = 6;
const DESCRIPTION_CLIP = 160;
const SITE_URL = 'https://nuamana.cl';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/**
 * Minimum complete steps for a valid HowTo. Google requires `step`, and a
 * heading without body text is not a step — below this the article is published
 * as a plain Article instead of a HowTo with holes in it.
 */
export const MIN_HOWTO_STEPS = 2;

const GAME_SLUGS = ['juegos', 'juegos-nocturnos', 'juegos-democraticos', 'dinamicas'];

/**
 * Every metadata key applyGame() reads — the SINGLE source of truth for the
 * "is this a game?" gate. Keeping gate and consumer together means an article
 * can never hold game data that the classifier silently throws away.
 */
export const GAME_METADATA_KEYS = [
  'unidades',
  'areas',
  'areas_desarrollo',
  'lugares',
  'lugar',
  'duracion',
  'cantidad',
  'materiales',
  'objetivos',
  'variaciones',
  'recomendaciones',
  'objetivos_educativos',
] as const;

const PUBLISHER: Record<string, unknown> = {
  '@id': ORGANIZATION_ID,
  '@type': 'Organization',
  name: 'Guías y Scouts Nua Mana',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/logos/logo-nuamana.webp`,
    width: 512,
    height: 512,
  },
};

// ---------------------------------------------------------------------------
// Kind detection
// ---------------------------------------------------------------------------

function categorySets(chains: CategoriaRow[][]): { slugs: Set<string>; roots: Set<string> } {
  const slugs = new Set<string>();
  const roots = new Set<string>();
  for (const chain of Array.isArray(chains) ? chains : []) {
    if (!Array.isArray(chain) || !chain.length) continue;
    for (const cat of chain) {
      if (typeof cat?.slug === 'string') slugs.add(cat.slug);
    }
    if (typeof chain[0]?.slug === 'string') roots.add(chain[0].slug);
  }
  return { slugs, roots };
}

/**
 * Article kind, decided by the category ancestors (first matching rule wins):
 * biography → history → technique/howto → game slug → game metadata → plain article.
 */
export function detectarTipo(input: ArticleSchemaInput): ArticleKind {
  const { slugs, roots } = categorySets(input.chains);

  if (slugs.has('biografias')) return 'biografia';
  if (slugs.has('historia-scout') || slugs.has('historias-scouts')) return 'historia';
  if (roots.has('tecnicas') || slugs.has('talleres')) return 'howto';
  if (GAME_SLUGS.some((slug) => slugs.has(slug))) return 'game';
  if (roots.has('actividades') && hasGameMetadata(input.metadata)) return 'game';
  return 'article';
}

/**
 * The gate reads exactly GAME_METADATA_KEYS. Objects count too (array rows like
 * objetivos_educativos), blank strings and arrays of blanks do not — the same
 * criterion firstFilled() applies, so gate and consumer always agree.
 */
function hasGameMetadata(meta: ArticuloMetadata | null | undefined): boolean {
  if (!meta) return false;
  const source = meta as Record<string, unknown>;
  return GAME_METADATA_KEYS.some((key) => hasValue(source[key]));
}

function hasValue(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.some((item) => hasValue(item));
  if (isPlainRecord(value)) return Object.keys(value).length > 0;
  return false;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function asText(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return undefined;
}

function htmlText(value: unknown): string {
  return typeof value === 'string' ? stripHtml(value) : '';
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function setIf(target: Record<string, unknown>, key: string, value: unknown): void {
  if (isEmptyValue(value)) return;
  target[key] = value;
}

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (isPlainRecord(value)) return Object.keys(value).length === 0;
  return false;
}

/** Recursively drop empty strings, nulls, arrays and objects. */
function limpiar(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => limpiar(item)).filter((item) => !isEmptyValue(item));
  }
  if (isPlainRecord(value)) {
    const cleaned: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      const result = limpiar(entry);
      if (isEmptyValue(result)) continue;
      cleaned[key] = result;
    }
    return cleaned;
  }
  return value;
}

function typeFor(kind: ArticleKind, hasHowToSteps: boolean): string | string[] {
  switch (kind) {
    case 'game':
      return ['Article', 'Game'];
    case 'howto':
      // A HowTo without steps is what got these articles flagged: only claim the
      // type when there is real step data behind it.
      return hasHowToSteps ? ['Article', 'HowTo'] : 'Article';
    case 'historia':
      return ['Article', 'ShortStory'];
    default:
      return 'Article';
  }
}

function clip(text: string, max: number): string | undefined {
  if (!text) return undefined;
  return text.length > max ? text.slice(0, max).trimEnd() : text;
}

function imageNode(url: string | null): Record<string, unknown> | undefined {
  const value = asText(url);
  if (!value) return undefined;
  return {
    '@type': 'ImageObject',
    // Schema.org requires an absolute URL — resolve relative uploads
    url: value.startsWith('http') ? value : `${SITE_URL}${value}`,
    width: 1200,
    height: 630,
  };
}

function authorNode(author: ArticleSchemaInput['autor']): Record<string, unknown> {
  const name = author ? `${author.nombres ?? ''} ${author.apellidos ?? ''}`.trim() : '';
  return name
    ? { '@type': 'Person', name }
    : { '@id': ORGANIZATION_ID };
}

/** Section = the name of the chain the canonical URL points at (leaf category). */
function articleSectionName(chain: CategoriaRow[]): string | undefined {
  const leaf = chain[chain.length - 1];
  return leaf ? asText(leaf.nombre) : undefined;
}

function keywordsFor(input: ArticleSchemaInput, chains: CategoriaRow[][]): string | undefined {
  // Defensive: legacy rows can hold a comma string instead of an array.
  const tags = toStringArray(input.etiquetas);
  if (tags.length) return tags.join(', ');

  const names = new Set<string>();
  for (const chain of chains) {
    for (const cat of chain) {
      const name = asText(cat.nombre);
      if (name) names.add(name);
    }
  }
  return names.size ? [...names].join(', ') : undefined;
}

/** DefinedTerm per reachable category, capped and deduped by slug, with root→leaf URL. */
function aboutTerms(chains: CategoriaRow[][]): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  const terms: Array<Record<string, unknown>> = [];
  for (const chain of chains) {
    for (let i = 0; i < chain.length; i++) {
      const cat = chain[i];
      if (seen.has(cat.slug)) continue;
      seen.add(cat.slug);
      terms.push({
        '@type': 'DefinedTerm',
        name: cat.nombre,
        url: `${SITE_URL}/blog/${chain.slice(0, i + 1).map((c) => c.slug).join('/')}`,
      });
      if (terms.length >= ABOUT_LIMIT) return terms;
    }
  }
  return terms;
}

function placeName(...values: unknown[]): string | undefined {
  const parts = values.map((value) => asText(value)).filter((part): part is string => Boolean(part));
  return parts.length ? parts.join(', ') : undefined;
}

/**
 * AlignmentObject per objective row — every kind emits this, because the article
 * page renders the objectives for any article type. Empty input yields [] so the
 * graph is cleaned of the key instead of publishing an empty array.
 */
function educationalAlignment(list: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(list)) return [];
  const items: Array<Record<string, unknown>> = [];
  for (const raw of list) {
    if (!isPlainRecord(raw)) continue;
    const item: Record<string, unknown> = {
      '@type': 'AlignmentObject',
      educationalFramework: 'Progresión Educativa Nua Mana',
    };
    const level = asText(raw.unidad);
    if (level) item.educationalLevel = level;
    // 122 of 1855 rows only carry texto_terminal — fall back instead of dropping.
    const target = asText(raw.texto) ?? asText(raw.texto_terminal) ?? asText(raw.texto_infantil);
    if (target) item.targetDescription = target;
    const description = asText(raw.como_se_cumple);
    if (description) item.description = description;
    items.push(item);
  }
  return items;
}

/**
 * Chains ready to use: malformed entries are dropped and the rest is sorted by
 * path so about[] and keywords never depend on DB row order.
 */
function resolveChains(input: ArticleSchemaInput): CategoriaRow[][] {
  const chains = (Array.isArray(input.chains) ? input.chains : []).filter(
    (chain): chain is CategoriaRow[] => Array.isArray(chain) && chain.length > 0,
  );
  return chains.sort((a, b) => {
    const left = chainPath(a);
    const right = chainPath(b);
    return left < right ? -1 : left > right ? 1 : 0;
  });
}

/** The chain the canonical URL was built from; deepest chain as a safety net. */
function resolveChain(input: ArticleSchemaInput, chains: CategoriaRow[][]): CategoriaRow[] {
  const chosen = Array.isArray(input.chain) ? input.chain.filter((cat) => cat != null) : [];
  return chosen.length ? chosen : deepestChain(chains);
}

// ---------------------------------------------------------------------------
// Kind-specific blocks
// ---------------------------------------------------------------------------

function applyGame(node: Record<string, unknown>, input: ArticleSchemaInput): void {
  const meta = input.metadata ?? undefined;
  setIf(node, 'typicalAgeRange', unidadRango(meta?.unidades));
  setIf(node, 'gameItem', areasThings(firstFilled(meta?.areas, meta?.areas_desarrollo)));
  setIf(node, 'gameLocation', lugaresPlaces(firstFilled(meta?.lugares, meta?.lugar)));
  setIf(node, 'timeRequired', duracionIso(asText(meta?.duracion)));
  setIf(node, 'numberOfPlayers', cantidadPlayers(asText(meta?.cantidad)));
  setIf(node, 'material', stringsAThing(meta?.materiales));
  setIf(node, 'quest', objetivosQuest(meta?.objetivos));

  const variaciones = htmlText(meta?.variaciones);
  if (variaciones) {
    node.workExample = { '@type': 'Thing', name: 'Variaciones', description: variaciones };
  }

  const recomendaciones = htmlText(meta?.recomendaciones);
  if (recomendaciones) node.disambiguatingDescription = recomendaciones;
}

/** First list holding REAL text wins — `areas` with its legacy `areas_desarrollo` alias. */
function firstFilled(...lists: Array<string[] | null | undefined>): string[] | undefined {
  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    const items = list.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    if (items.length) return items;
  }
  return undefined;
}

/**
 * H2/H3 headings → step candidates. Incomplete steps (no heading text or no
 * body text) are dropped first; the result is empty unless at least
 * MIN_HOWTO_STEPS survive, so callers only check `length > 0`.
 */
export function headingSteps(html: string): Array<{ name: string; text: string }> {
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h\1\s*>/gi;
  const headings: Array<{ index: number; contentStart: number; title: string }> = [];
  let match: RegExpExecArray | null = re.exec(html);
  while (match !== null) {
    headings.push({ index: match.index, contentStart: match.index + match[0].length, title: match[2] });
    match = re.exec(html);
  }
  if (headings.length < MIN_HOWTO_STEPS) return [];

  const steps = headings
    .map((heading, i) => {
      const end = i + 1 < headings.length ? headings[i + 1].index : html.length;
      return {
        name: stripHtml(heading.title),
        text: stripHtml(html.slice(heading.contentStart, end)),
      };
    })
    .filter((step) => step.name.length > 0 && step.text.length > 0);

  return steps.length >= MIN_HOWTO_STEPS ? steps : [];
}

function applyHowTo(
  node: Record<string, unknown>,
  meta: ArticuloMetadata | undefined,
  steps: Array<{ name: string; text: string }>,
): void {
  setIf(node, 'supply', stringsAThing(meta?.materiales));

  // Preventive only: no article stores equipo_necesario today, the field is
  // accepted so the tool appears if it ever shows up in metadata.
  const equipo: unknown = meta?.equipo_necesario;
  if (typeof equipo === 'string' || Array.isArray(equipo)) {
    setIf(node, 'tool', stringsAThing(equipo as string[] | string));
  }

  setIf(node, 'totalTime', duracionIso(asText(meta?.duracion)));

  if (steps.length) {
    node.step = steps.map((step) => ({ '@type': 'HowToStep', name: step.name, text: step.text }));
  }
}

function applyHistoria(node: Record<string, unknown>, meta?: ArticuloMetadata): void {
  node.genre = 'Historia Scout';
  const lugar = asText(meta?.lugar_hecho);
  if (lugar) node.spatialCoverage = { '@type': 'Place', name: lugar };
  const ano = asText(meta?.ano_hecho);
  if (ano) node.temporal = ano;
}

function biographyAbout(input: ArticleSchemaInput, meta?: ArticuloMetadata): Record<string, unknown> {
  const person: Record<string, unknown> = { '@type': 'Person', name: asText(input.titulo) };

  const birthPlace = placeName(meta?.lugar_nacimiento, meta?.pais_nacimiento);
  if (birthPlace) person.birthPlace = { '@type': 'Place', name: birthPlace };

  const birthDate = asText(meta?.fecha_nacimiento);
  if (birthDate) person.birthDate = birthDate;

  const deathDate = asText(meta?.fecha_defuncion);
  if (deathDate) person.deathDate = deathDate;

  const deathPlace = placeName(meta?.lugar_defuncion, meta?.pais_defuncion);
  if (deathPlace) person.deathPlace = { '@type': 'Place', name: deathPlace };

  return person;
}

// ---------------------------------------------------------------------------
// Graph
// ---------------------------------------------------------------------------

/** Single multi-type JSON-LD node for the article, already cleaned of empty values. */
export function buildArticleGraph(input: ArticleSchemaInput): Record<string, unknown> {
  const meta = input.metadata ?? undefined;
  const chains = resolveChains(input);
  const chain = resolveChain(input, chains);
  const kind = detectarTipo(input);
  const html = input.contenido ?? '';
  const body = stripHtml(html);
  const steps = kind === 'howto' ? headingSteps(html) : [];

  // Assigned once: a biography's about is the Person, everyone else gets terms.
  const about = kind === 'biografia' ? biographyAbout(input, meta) : aboutTerms(chains);

  // Relational rows win: they are what the article page renders.
  const objetivos =
    Array.isArray(input.objetivosEducativos) && input.objetivosEducativos.length
      ? input.objetivosEducativos
      : meta?.objetivos_educativos;

  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': typeFor(kind, steps.length > 0),
    headline: asText(input.titulo),
    description: asText(input.extracto) ?? clip(body, DESCRIPTION_CLIP),
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.canonicalUrl },
    datePublished: input.created_at,
    dateModified: input.updated_at || input.created_at,
    author: authorNode(input.autor),
    publisher: PUBLISHER,
    image: imageNode(input.imagen_destacada),
    isFamilyFriendly: true,
    inLanguage: 'es',
    articleSection: articleSectionName(chain),
    articleBody: body || undefined,
    keywords: keywordsFor(input, chains),
    about,
    educationalAlignment: educationalAlignment(objetivos),
  };

  if (kind === 'game') applyGame(node, input);
  if (kind === 'howto') applyHowTo(node, meta, steps);
  if (kind === 'historia') applyHistoria(node, meta);

  return limpiar(node) as Record<string, unknown>;
}
