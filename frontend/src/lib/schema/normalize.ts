/**
 * Text Normalization for Structured Data
 * schema.org gets plain text, never markup: tags are stripped and entities are
 * decoded exactly the way the article body is cleaned for display and for
 * editing, so `articleBody` matches what a reader actually sees on the page
 * (no stray &nbsp;, soft hyphens or zero-width spaces).
 */

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  // Non-breaking space collapses to a plain space like the UI does.
  '&nbsp;': ' ',
};

const ENTITY_RE = /&(?:amp|lt|gt|quot|nbsp);|&#39;/g;
/** Invisible characters the editor and the renderer both delete — so do we. */
const INVISIBLE_RE = /&shy;|&#173;|[\u00AD\u200B]/g;
const SCRIPT_STYLE_RE = /<(script|style)\b[\s\S]*?(?:<\/\1\s*>|$)/gi;
/** Block tags become a space so adjacent elements never glue words together. */
const BLOCK_TAG_RE =
  /<\/?(?:p|div|br|hr|h[1-6]|ul|ol|li|dl|dt|dd|section|article|header|footer|main|nav|aside|blockquote|pre|figure|figcaption|table|thead|tbody|tfoot|tr|td|th|form|fieldset|details|summary)\b[^>]*>/gi;
const TAG_RE = /<[^>]*>/g;

/** Drop script/style blocks plus every remaining tag, decode entities, collapse whitespace. */
export function stripHtml(html: string | null | undefined): string {
  if (html == null) return '';
  const text = String(html)
    .replace(SCRIPT_STYLE_RE, ' ')
    .replace(BLOCK_TAG_RE, ' ')
    .replace(TAG_RE, '');
  const decoded = text
    .replace(INVISIBLE_RE, '')
    .replace(ENTITY_RE, (match) => ENTITIES[match] ?? match);
  // \s also covers U+00A0, so remaining non-breaking spaces normalize here.
  return decoded.replace(/\s+/g, ' ').trim();
}

/** Lowercase accent-free form so 'compañía' and 'compania' collide. */
export function sinAcentos(s: string | null | undefined): string {
  if (s == null) return '';
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** Capitalize every word while keeping accents: 'campo abierto' -> 'Campo Abierto'. */
export function titleCase(s: string | null | undefined): string {
  if (s == null) return '';
  const lowered = s.toLowerCase().trim();
  if (!lowered) return '';
  return lowered
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
