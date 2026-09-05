import { describe, it, expect } from 'vitest';
import { ADMIN_ZONES, gridRowGroups } from '@/lib/admin-zones';
import type { AdminZone, ZoneSection, ZoneSectionField } from '@/lib/admin-zones';
import type { SiteConfigCategory, SiteConfigRecord } from '@/lib/site-config.types';

// ---------------------------------------------------------------------------
// Expected field map — authoritative mapping from spec (cms-admin-fase2).
// Type-checked against the real category interfaces: if site-config.types.ts
// gains/renames a field, this literal stops compiling (compile-time coverage).
// ---------------------------------------------------------------------------

type CategoryFieldMap = {
  // section_visibility is excluded — its 7 booleans are toggled via the
  // visibilityKey mechanism on each Inicio section, not as form fields in
  // any ZoneSection. So it has no entries in ADMIN_ZONES coverage.
  // social_list is excluded — it stores a JSON blob (items array), not
  // individual typed fields. The admin zone uses a single JSON field.
  [C in Exclude<SiteConfigCategory, 'theme_colors' | 'header_colors' | 'menu_colors' | 'features' | 'section_visibility' | 'social_list' | 'social'>]: readonly (keyof SiteConfigRecord[C])[];
} & {
  // theme_colors adds 1 heading row (_heading_tarjetas) + full 152 color/opacity fields
  theme_colors: readonly (
    | keyof SiteConfigRecord['theme_colors']
    | '_heading_tarjetas'
  )[];
  // header_colors adds full 52 color/opacity fields
  header_colors: readonly (keyof SiteConfigRecord['header_colors'])[];
  // menu_colors adds full 36 color/opacity fields
  menu_colors: readonly (keyof SiteConfigRecord['menu_colors'])[];
  // features adds content fields + 36 color/opacity fields
  features: readonly (
    | keyof SiteConfigRecord['features']
    | 'feclr1' | 'fedclr1' | 'feclr1_opacity' | 'fedclr1_opacity'
    | 'feclr2' | 'fedclr2' | 'feclr2_opacity' | 'fedclr2_opacity'
    | 'feclr3' | 'fedclr3' | 'feclr3_opacity' | 'fedclr3_opacity'
    | 'feclr4' | 'fedclr4' | 'feclr4_opacity' | 'fedclr4_opacity'
    | 'feclr5' | 'fedclr5' | 'feclr5_opacity' | 'fedclr5_opacity'
    | 'feclr6' | 'fedclr6' | 'feclr6_opacity' | 'fedclr6_opacity'
    | 'feclr7' | 'fedclr7' | 'feclr7_opacity' | 'fedclr7_opacity'
    | 'feclr8' | 'fedclr8' | 'feclr8_opacity' | 'fedclr8_opacity'
    | 'feclr9' | 'fedclr9' | 'feclr9_opacity' | 'fedclr9_opacity'
  )[];
};

const EXPECTED_FIELDS = {
  branding: [
    'nombre_grupo',
    'nombre_corto',
    'pretitulo',
    'slogan',
    'mision',
    'motto',
    'logo_header',
    'logo_sidebar',
    'logo_footer',
    'copyright',
  ],
  contact: ['sede_nombre', 'direccion', 'maps_embed'],
  hero: [
    // Content fields (6 existing)
    'frases', 'fondo', 'intervalo', 'imagenes_pool', 'top_count', 'bottom_count',
    // Gradient overlay — light (3 hex + 3 opacity)
    'heclr1', 'heclr2', 'heclr3',
    // Gradient overlay — dark (3 hex + 3 opacity)
    'hedclr1', 'hedclr2', 'hedclr3',
    // Texts — light (2 hex + 2 opacity)
    'heclr4', 'heclr5',
    // Texts — dark (2 hex + 2 opacity)
    'hedclr4', 'hedclr5',
    // Border colors — light (8 hex + 8 opacity)
    'heclr6', 'heclr7', 'heclr8', 'heclr9', 'heclr10', 'heclr11', 'heclr12', 'heclr13',
    // Border colors — dark (8 hex + 8 opacity)
    'hedclr6', 'hedclr7', 'hedclr8', 'hedclr9', 'hedclr10', 'hedclr11', 'hedclr12', 'hedclr13',
    // Light opacities (13)
    'heclr1_opacity', 'heclr2_opacity', 'heclr3_opacity',
    'heclr4_opacity', 'heclr5_opacity',
    'heclr6_opacity', 'heclr7_opacity', 'heclr8_opacity', 'heclr9_opacity',
    'heclr10_opacity', 'heclr11_opacity', 'heclr12_opacity', 'heclr13_opacity',
    // Dark opacities (13)
    'hedclr1_opacity', 'hedclr2_opacity', 'hedclr3_opacity',
    'hedclr4_opacity', 'hedclr5_opacity',
    'hedclr6_opacity', 'hedclr7_opacity', 'hedclr8_opacity', 'hedclr9_opacity',
    'hedclr10_opacity', 'hedclr11_opacity', 'hedclr12_opacity', 'hedclr13_opacity',
  ],
  features: [
    'titulo_seccion', 'subtitulo', 'items',
    // feclr1-9 (9 hex) + fedclr1-9 (9 hex) + feclr1_opacity-9 (9) + fedclr1_opacity-9 (9) = 36
    'feclr1', 'fedclr1', 'feclr1_opacity', 'fedclr1_opacity',
    'feclr2', 'fedclr2', 'feclr2_opacity', 'fedclr2_opacity',
    'feclr3', 'fedclr3', 'feclr3_opacity', 'fedclr3_opacity',
    'feclr4', 'fedclr4', 'feclr4_opacity', 'fedclr4_opacity',
    'feclr5', 'fedclr5', 'feclr5_opacity', 'fedclr5_opacity',
    'feclr6', 'fedclr6', 'feclr6_opacity', 'fedclr6_opacity',
    'feclr7', 'fedclr7', 'feclr7_opacity', 'fedclr7_opacity',
    'feclr8', 'fedclr8', 'feclr8_opacity', 'fedclr8_opacity',
    'feclr9', 'fedclr9', 'feclr9_opacity', 'fedclr9_opacity',
  ],
  faq: ['titulo_seccion', 'subtitulo', 'items'],
  testimonials: ['titulo_seccion', 'widget_url'],
  visit: ['titulo', 'fecha_fundacion', 'email', 'email_href', 'horario', 'cta_texto', 'imagen'],
  seo: ['title', 'description'],
  pwa: [
    'name',
    'short_name',
    'description',
    'lang',
    'icon_192',
    'icon_512',
    'icon_1024',
  ],
  navigation: ['label_panel', 'label_login'],
  theme_colors: [
    // Section heading (1 sub-section row in colores-tema)
    '_heading_tarjetas',
    // Base light (10)
    'clr1',
    'clr2',
    'clr3',
    'clr4',
    'clr5',
    'clr6',
    'clr7',
    'clr8',
    'clr9',
    'clr10',
    // Base dark (10)
    'dclr1',
    'dclr2',
    'dclr3',
    'dclr4',
    'dclr5',
    'dclr6',
    'dclr7',
    'dclr8',
    'dclr9',
    'dclr10',
    // Tarjetas light (6)
    'tclr1',
    'tclr2',
    'tclr3',
    'tclr4',
    'tclr5',
    'tclr6',
    // Tarjetas dark (6)
    'tdclr1',
    'tdclr2',
    'tdclr3',
    'tdclr4',
    'tdclr5',
    'tdclr6',
    // Base opacity
    'clr1_opacity',
    'clr2_opacity',
    'clr3_opacity',
    'clr4_opacity',
    'clr5_opacity',
    'clr6_opacity',
    'clr7_opacity',
    'clr8_opacity',
    'clr9_opacity',
    'clr10_opacity',
    'dclr1_opacity',
    'dclr2_opacity',
    'dclr3_opacity',
    'dclr4_opacity',
    'dclr5_opacity',
    'dclr6_opacity',
    'dclr7_opacity',
    'dclr8_opacity',
    'dclr9_opacity',
    'dclr10_opacity',
    // Tarjetas opacity
    'tclr1_opacity',
    'tclr2_opacity',
    'tclr3_opacity',
    'tclr4_opacity',
    'tclr5_opacity',
    'tclr6_opacity',
    'tdclr1_opacity',
    'tdclr2_opacity',
    'tdclr3_opacity',
    'tdclr4_opacity',
    'tdclr5_opacity',
    'tdclr6_opacity',
  ],
  promo_colors: [
    // 9 roles × 4 fields = 36
    'cbclr1', 'cbdclr1', 'cbclr1_opacity', 'cbdclr1_opacity',
    'cbclr2', 'cbdclr2', 'cbclr2_opacity', 'cbdclr2_opacity',
    'cbclr3', 'cbdclr3', 'cbclr3_opacity', 'cbdclr3_opacity',
    'cbclr4', 'cbdclr4', 'cbclr4_opacity', 'cbdclr4_opacity',
    'cbclr5', 'cbdclr5', 'cbclr5_opacity', 'cbdclr5_opacity',
    'cbclr6', 'cbdclr6', 'cbclr6_opacity', 'cbdclr6_opacity',
    'cbclr7', 'cbdclr7', 'cbclr7_opacity', 'cbdclr7_opacity',
    'cbclr8', 'cbdclr8', 'cbclr8_opacity', 'cbdclr8_opacity',
    'cbclr9', 'cbdclr9', 'cbclr9_opacity', 'cbdclr9_opacity',
  ],
  slideshow_colors: [
    // 9 roles × 4 fields = 36
    'bsclr1', 'bsdclr1', 'bsclr1_opacity', 'bsdclr1_opacity',
    'bsclr2', 'bsdclr2', 'bsclr2_opacity', 'bsdclr2_opacity',
    'bsclr3', 'bsdclr3', 'bsclr3_opacity', 'bsdclr3_opacity',
    'bsclr4', 'bsdclr4', 'bsclr4_opacity', 'bsdclr4_opacity',
    'bsclr5', 'bsdclr5', 'bsclr5_opacity', 'bsdclr5_opacity',
    'bsclr6', 'bsdclr6', 'bsclr6_opacity', 'bsdclr6_opacity',
    'bsclr7', 'bsdclr7', 'bsclr7_opacity', 'bsdclr7_opacity',
    'bsclr8', 'bsdclr8', 'bsclr8_opacity', 'bsdclr8_opacity',
    'bsclr9', 'bsdclr9', 'bsclr9_opacity', 'bsdclr9_opacity',
  ],
  testimonials_colors: [
    // 8 roles × 4 fields = 32
    'tsclr1', 'tsdclr1', 'tsclr1_opacity', 'tsdclr1_opacity',
    'tsclr2', 'tsdclr2', 'tsclr2_opacity', 'tsdclr2_opacity',
    'tsclr3', 'tsdclr3', 'tsclr3_opacity', 'tsdclr3_opacity',
    'tsclr4', 'tsdclr4', 'tsclr4_opacity', 'tsdclr4_opacity',
    'tsclr5', 'tsdclr5', 'tsclr5_opacity', 'tsdclr5_opacity',
    'tsclr6', 'tsdclr6', 'tsclr6_opacity', 'tsdclr6_opacity',
    'tsclr7', 'tsdclr7', 'tsclr7_opacity', 'tsdclr7_opacity',
    'tsclr8', 'tsdclr8', 'tsclr8_opacity', 'tsdclr8_opacity',
  ],
  visit_colors: [
    // 9 roles × 4 fields = 36
    'vsclr1', 'vsdclr1', 'vsclr1_opacity', 'vsdclr1_opacity',
    'vsclr2', 'vsdclr2', 'vsclr2_opacity', 'vsdclr2_opacity',
    'vsclr3', 'vsdclr3', 'vsclr3_opacity', 'vsdclr3_opacity',
    'vsclr4', 'vsdclr4', 'vsclr4_opacity', 'vsdclr4_opacity',
    'vsclr5', 'vsdclr5', 'vsclr5_opacity', 'vsdclr5_opacity',
    'vsclr6', 'vsdclr6', 'vsclr6_opacity', 'vsdclr6_opacity',
    'vsclr7', 'vsdclr7', 'vsclr7_opacity', 'vsdclr7_opacity',
    'vsclr8', 'vsdclr8', 'vsclr8_opacity', 'vsdclr8_opacity',
    'vsclr9', 'vsdclr9', 'vsclr9_opacity', 'vsdclr9_opacity',
  ],
  faq_colors: [
    // 8 roles × 4 fields = 32
    'fclr1', 'fdclr1', 'fclr1_opacity', 'fdclr1_opacity',
    'fclr2', 'fdclr2', 'fclr2_opacity', 'fdclr2_opacity',
    'fclr3', 'fdclr3', 'fclr3_opacity', 'fdclr3_opacity',
    'fclr4', 'fdclr4', 'fclr4_opacity', 'fdclr4_opacity',
    'fclr5', 'fdclr5', 'fclr5_opacity', 'fdclr5_opacity',
    'fclr6', 'fdclr6', 'fclr6_opacity', 'fdclr6_opacity',
    'fclr7', 'fdclr7', 'fclr7_opacity', 'fdclr7_opacity',
    'fclr8', 'fdclr8', 'fclr8_opacity', 'fdclr8_opacity',
  ],
  secondary_header_colors: [
    // 14 roles × 4 fields = 56
    'shclr1', 'shdclr1', 'shclr1_opacity', 'shdclr1_opacity',
    'shclr2', 'shdclr2', 'shclr2_opacity', 'shdclr2_opacity',
    'shclr3', 'shdclr3', 'shclr3_opacity', 'shdclr3_opacity',
    'shclr4', 'shdclr4', 'shclr4_opacity', 'shdclr4_opacity',
    'shclr5', 'shdclr5', 'shclr5_opacity', 'shdclr5_opacity',
    'shclr6', 'shdclr6', 'shclr6_opacity', 'shdclr6_opacity',
    'shclr7', 'shdclr7', 'shclr7_opacity', 'shdclr7_opacity',
    'shclr8', 'shdclr8', 'shclr8_opacity', 'shdclr8_opacity',
    'shclr9', 'shdclr9', 'shclr9_opacity', 'shdclr9_opacity',
    'shclr10', 'shdclr10', 'shclr10_opacity', 'shdclr10_opacity',
    'shclr11', 'shdclr11', 'shclr11_opacity', 'shdclr11_opacity',
    'shclr12', 'shdclr12', 'shclr12_opacity', 'shdclr12_opacity',
    'shclr13', 'shdclr13', 'shclr13_opacity', 'shdclr13_opacity',
    'shclr14', 'shdclr14', 'shclr14_opacity', 'shdclr14_opacity',
  ],
  footer_colors: [
    // 10 roles × 4 fields = 40
    'foclr1', 'fodclr1', 'foclr1_opacity', 'fodclr1_opacity',
    'foclr2', 'fodclr2', 'foclr2_opacity', 'fodclr2_opacity',
    'foclr3', 'fodclr3', 'foclr3_opacity', 'fodclr3_opacity',
    'foclr4', 'fodclr4', 'foclr4_opacity', 'fodclr4_opacity',
    'foclr5', 'fodclr5', 'foclr5_opacity', 'fodclr5_opacity',
    'foclr6', 'fodclr6', 'foclr6_opacity', 'fodclr6_opacity',
    'foclr7', 'fodclr7', 'foclr7_opacity', 'fodclr7_opacity',
    'foclr8', 'fodclr8', 'foclr8_opacity', 'fodclr8_opacity',
    'foclr9', 'fodclr9', 'foclr9_opacity', 'fodclr9_opacity',
    'foclr10', 'fodclr10', 'foclr10_opacity', 'fodclr10_opacity',
  ],
  header_colors: [
    // 13 roles × 4 fields = 52
    'hclr1', 'hdclr1', 'hclr1_opacity', 'hdclr1_opacity',
    'hclr2', 'hdclr2', 'hclr2_opacity', 'hdclr2_opacity',
    'hclr3', 'hdclr3', 'hclr3_opacity', 'hdclr3_opacity',
    'hclr4', 'hdclr4', 'hclr4_opacity', 'hdclr4_opacity',
    'hclr5', 'hdclr5', 'hclr5_opacity', 'hdclr5_opacity',
    'hclr6', 'hdclr6', 'hclr6_opacity', 'hdclr6_opacity',
    'hclr7', 'hdclr7', 'hclr7_opacity', 'hdclr7_opacity',
    'hclr8', 'hdclr8', 'hclr8_opacity', 'hdclr8_opacity',
    'hclr9', 'hdclr9', 'hclr9_opacity', 'hdclr9_opacity',
    'hclr10', 'hdclr10', 'hclr10_opacity', 'hdclr10_opacity',
    'hclr11', 'hdclr11', 'hclr11_opacity', 'hdclr11_opacity',
    'hclr12', 'hdclr12', 'hclr12_opacity', 'hdclr12_opacity',
    'hclr13', 'hdclr13', 'hclr13_opacity', 'hdclr13_opacity',
  ],
  menu_colors: [
    // 11 roles × 4 fields = 44
    'mclr1', 'mdclr1', 'mclr1_opacity', 'mdclr1_opacity',
    'mclr2', 'mdclr2', 'mclr2_opacity', 'mdclr2_opacity',
    'mclr3', 'mdclr3', 'mclr3_opacity', 'mdclr3_opacity',
    'mclr4', 'mdclr4', 'mclr4_opacity', 'mdclr4_opacity',
    'mclr5', 'mdclr5', 'mclr5_opacity', 'mdclr5_opacity',
    'mclr6', 'mdclr6', 'mclr6_opacity', 'mdclr6_opacity',
    'mclr7', 'mdclr7', 'mclr7_opacity', 'mdclr7_opacity',
    'mclr8', 'mdclr8', 'mclr8_opacity', 'mdclr8_opacity',
    'mclr9', 'mdclr9', 'mclr9_opacity', 'mdclr9_opacity',
    'mclr10', 'mdclr10', 'mclr10_opacity', 'mdclr10_opacity',
    'mclr11', 'mdclr11', 'mclr11_opacity', 'mdclr11_opacity',
  ],
  panel_colors: [
    // 14 roles × 4 fields = 56
    'pclr1', 'pdclr1', 'pclr1_opacity', 'pdclr1_opacity',
    'pclr2', 'pdclr2', 'pclr2_opacity', 'pdclr2_opacity',
    'pclr3', 'pdclr3', 'pclr3_opacity', 'pdclr3_opacity',
    'pclr4', 'pdclr4', 'pclr4_opacity', 'pdclr4_opacity',
    'pclr5', 'pdclr5', 'pclr5_opacity', 'pdclr5_opacity',
    'pclr6', 'pdclr6', 'pclr6_opacity', 'pdclr6_opacity',
    'pclr7', 'pdclr7', 'pclr7_opacity', 'pdclr7_opacity',
    'pclr8', 'pdclr8', 'pclr8_opacity', 'pdclr8_opacity',
    'pclr9', 'pdclr9', 'pclr9_opacity', 'pdclr9_opacity',
    'pclr10', 'pdclr10', 'pclr10_opacity', 'pdclr10_opacity',
    'pclr11', 'pdclr11', 'pclr11_opacity', 'pdclr11_opacity',
    'pclr12', 'pdclr12', 'pclr12_opacity', 'pdclr12_opacity',
    'pclr13', 'pdclr13', 'pclr13_opacity', 'pdclr13_opacity',
    'pclr14', 'pdclr14', 'pclr14_opacity', 'pdclr14_opacity',
  ],
} as const satisfies CategoryFieldMap;

const FIELD_TYPES = ['text', 'textarea', 'url', 'color', 'number', 'json', 'heading'] as const;

// Mirrors reserved for content the user wants editable across multiple admin
// zones. Currently only contact.direccion / contact.maps_embed (Inicio
// "Dirección y Mapa" mirrors Footer → Contacto). Do NOT add keys here for
// convenience — each entry is an intentional, documented cross-zone mirror.
const EXPECTED_DUPLICATES: Set<string> = new Set(['contact.direccion', 'contact.maps_embed']);

// ---------------------------------------------------------------------------
// Helpers — every helper asserts on real metadata from ADMIN_ZONES
// ---------------------------------------------------------------------------

function zoneOf(zoneId: string): AdminZone {
  const zone = ADMIN_ZONES.find((z) => z.id === zoneId);
  expect(zone, `zone ${zoneId} must exist in ADMIN_ZONES`).toBeDefined();
  return zone!;
}

function sectionOf(zoneId: string, sectionId: string): ZoneSection {
  const section = zoneOf(zoneId).sections.find((s) => s.id === sectionId);
  expect(section, `section ${zoneId}.${sectionId} must exist`).toBeDefined();
  return section!;
}

function fieldIn(zoneId: string, sectionId: string, key: string): ZoneSectionField {
  const field = sectionOf(zoneId, sectionId).fields.find((f) => f.key === key);
  expect(field, `field ${zoneId}.${sectionId}.${key} must exist`).toBeDefined();
  return field!;
}

// ---------------------------------------------------------------------------
// Coverage invariant: every field of the 17 categories in EXACTLY one section
// ---------------------------------------------------------------------------

describe('ADMIN_ZONES coverage', () => {
  it('contains exactly the 7 zones with ids, labels and icons', () => {
    expect(ADMIN_ZONES.map((z) => z.id)).toEqual(['inicio', 'header', 'footer', 'global', 'social', 'menu', 'contenido']);
    expect(ADMIN_ZONES.map((z) => z.label)).toEqual([
      'Inicio',
      'Header',
      'Footer',
      'Global',
      'Redes Sociales',
      'Menú de Navegación',
      'Contenido',
    ]);
    expect(ADMIN_ZONES.every((z) => z.icon.length > 0)).toBe(true);
  });

  it('covers every field of every category — none missing, no unintended duplicates, none extra', () => {
    // Flatten metadata into (category, key) placements
    const seen = new Map<string, number>();
    const placements: string[] = [];
    for (const zone of ADMIN_ZONES) {
      for (const section of zone.sections) {
        for (const field of section.fields) {
          const id = `${section.category}.${field.key}`;
          seen.set(id, (seen.get(id) ?? 0) + 1);
          placements.push(id);
        }
      }
    }

    // Build the expected (category, key) pairs from the authoritative map
    const expected: string[] = [];
    for (const [category, fields] of Object.entries(EXPECTED_FIELDS)) {
      for (const key of fields) expected.push(`${category}.${key}`);
    }
    // None missing — mirrors must appear exactly twice, everything else once
    for (const id of expected) {
      const expectedCount = EXPECTED_DUPLICATES.has(id) ? 2 : 1;
      expect(seen.get(id), `expected ${id} to appear ${expectedCount} time(s)`).toBe(expectedCount);
    }

    // No unintended duplicates — mirrors allowed exactly twice, everything else once
    for (const [id, count] of seen) {
      const expectedCount = EXPECTED_DUPLICATES.has(id) ? 2 : 1;
      expect(count, `${id} must appear ${expectedCount} time(s), not ${count}`).toBe(expectedCount);
    }

    // No extra fields beyond the 12 categories (exact set equality on deduped placements)
    expect([...new Set(placements)].sort()).toEqual([...expected].sort());
  });

  it('keeps the Inicio section order Hero → Colores del Hero → Features → Colores de Features → Colores del Promo → Colores del Slideshow → Testimonios → Colores de Testimonios → Visítanos → Colores de Visítanos → Dirección y Mapa → FAQ → Colores de FAQ', () => {
    const inicio = zoneOf('inicio');
    expect(inicio.sections.map((s) => s.id)).toEqual([
      'hero',
      'hero-colors',
      'features',
      'features-colors',
      'promo-colors',
      'slideshow-colors',
      'testimonials',
      'testimonials-colors',
      'visit',
      'visit-colors',
      'direccion-mapa',
      'faq',
      'faq-colors',
    ]);
    expect(inicio.sections.map((s) => s.title)).toEqual([
      'Hero',
      'Colores del Hero',
      'Features',
      'Colores de Features',
      'Colores del Promo',
      'Colores del Slideshow',
      'Testimonios',
      'Colores de Testimonios',
      'Visítanos',
      'Colores de Visítanos',
      'Dirección y Mapa',
      'FAQ',
      'Colores de FAQ',
    ]);
  });

  it('marks the Menú de Navegación, Redes Sociales, and Contenido zones as tab-only with no field metadata', () => {
    const tabOnlyZones = ADMIN_ZONES.filter((z) => z.tabOnly === true);
    expect(tabOnlyZones.map((z) => z.id)).toEqual(['social', 'menu', 'contenido']);
    for (const zone of tabOnlyZones) {
      expect(zone.sections).toEqual([]);
    }

    // Triangulation: zones with real sections
    const otherZones = ADMIN_ZONES.filter((z) => z.tabOnly !== true);
    expect(otherZones.map((z) => z.sections.length)).toEqual([13, 5, 3, 4]);
  });

  it('maps each zone to its exact sections and categories', () => {
    expect(zoneOf('inicio').sections.map((s) => s.category)).toEqual([
      'hero',
      'hero',
      'features',
      'features',
      'promo_colors',
      'slideshow_colors',
      'testimonials',
      'testimonials_colors',
      'visit',
      'visit_colors',
      'contact',
      'faq',
      'faq_colors',
    ]);
    expect(zoneOf('header').sections.map((s) => s.category)).toEqual(['branding', 'secondary_header_colors', 'header_colors', 'menu_colors', 'navigation']);
    expect(zoneOf('footer').sections.map((s) => s.category)).toEqual(['branding', 'contact', 'footer_colors']);
    expect(zoneOf('global').sections.map((s) => s.category)).toEqual(['seo', 'pwa', 'theme_colors', 'panel_colors']);
  });

  it('exposes a colores-tema section in Global with 65 fields (32 color + 32 number + 1 heading) and layout=grid', () => {
    const section = sectionOf('global', 'colores-tema');
    expect(section.title).toBe('Colores del Tema');
    expect(section.category).toBe('theme_colors');
    expect(section.schemaId).toBe('theme_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(65);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 32 color-type fields + 32 number-type fields (*_opacity) + 1 heading row
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    const headingFields = section.fields.filter((f) => f.type === 'heading');
    expect(colorFields).toHaveLength(32);
    expect(numberFields).toHaveLength(32);
    expect(headingFields).toHaveLength(1);

    // Row-major order: base clr1/dclr1..clr10/dclr10, then heading, then
    // tarjetas tclr1/tdclr1..tclr6/tdclr6
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = [
      ...Array.from({ length: 10 }, (_, i) => [`clr${i + 1}`, `clr${i + 1}_opacity`, `dclr${i + 1}`, `dclr${i + 1}_opacity`]).flat(),
      '_heading_tarjetas',
      ...Array.from({ length: 6 }, (_, i) => [`tclr${i + 1}`, `tclr${i + 1}_opacity`, `tdclr${i + 1}`, `tdclr${i + 1}_opacity`]).flat(),
    ];
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks fields into 16 role-groups of 4 plus 1 heading row', () => {
    const section = sectionOf('global', 'colores-tema');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(17);
    const roleGroups = groups.filter((g) => g.length === 4);
    const headingGroups = groups.filter((g) => g.length === 1 && g[0].type === 'heading');
    expect(roleGroups).toHaveLength(16);
    expect(headingGroups).toHaveLength(1);
    for (const group of roleGroups) {
      // Each role group: [colorField (color), light opacity (number), dark field (color), dark opacity (number)]
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row → clr1, clr1_opacity, dclr1, dclr1_opacity
    expect(groups[0].map((f) => f.key)).toEqual(['clr1', 'clr1_opacity', 'dclr1', 'dclr1_opacity']);
    // Last role row → tclr6, tclr6_opacity, tdclr6, tdclr6_opacity
    expect(groups[16].map((f) => f.key)).toEqual(['tclr6', 'tclr6_opacity', 'tdclr6', 'tdclr6_opacity']);
    // Heading key → Tarjetas
    expect(headingGroups.map((g) => g[0].key)).toEqual(['_heading_tarjetas']);
  });

  it('exposes a header-colors section in Header with 52 fields (26 color + 26 number) and layout=grid', () => {
    const section = sectionOf('header', 'header-colors');
    expect(section.title).toBe('Colores del Header');
    expect(section.category).toBe('header_colors');
    expect(section.schemaId).toBe('header_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(52);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 26 color-type fields + 26 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(26);
    expect(numberFields).toHaveLength(26);

    // Row-major order: 13 roles × 4 (hclrN, hclrN_opacity, hdclrN, hdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 13 }, (_, i) => {
      const n = i + 1;
      return [`hclr${n}`, `hclr${n}_opacity`, `hdclr${n}`, `hdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks header-colors into 13 role-groups of 4', () => {
    const section = sectionOf('header', 'header-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(13);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: hclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['hclr1', 'hclr1_opacity', 'hdclr1', 'hdclr1_opacity']);
    // Last row: hclr13 role
    expect(groups[12].map((f) => f.key)).toEqual(['hclr13', 'hclr13_opacity', 'hdclr13', 'hdclr13_opacity']);
  });

  it('exposes a menu-colors section in Header with 44 fields (22 color + 22 number) and layout=grid', () => {
    const section = sectionOf('header', 'menu-colors');
    expect(section.title).toBe('Colores del Menú');
    expect(section.category).toBe('menu_colors');
    expect(section.schemaId).toBe('menu_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(44);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 22 color-type fields + 22 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(22);
    expect(numberFields).toHaveLength(22);

    // Row-major order: 11 roles × 4 (mclrN, mclrN_opacity, mdclrN, mdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 11 }, (_, i) => {
      const n = i + 1;
      return [`mclr${n}`, `mclr${n}_opacity`, `mdclr${n}`, `mdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks menu-colors into 11 role-groups of 4', () => {
    const section = sectionOf('header', 'menu-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(11);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: mclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['mclr1', 'mclr1_opacity', 'mdclr1', 'mdclr1_opacity']);
    // Last row: mclr11 role
    expect(groups[10].map((f) => f.key)).toEqual(['mclr11', 'mclr11_opacity', 'mdclr11', 'mdclr11_opacity']);
  });

  it('Dirección y Mapa section mirrors Footer → Contacto via a contact.visit split card', () => {
    const section = sectionOf('inicio', 'direccion-mapa');
    expect(section.title).toBe('Dirección y Mapa');
    expect(section.category).toBe('contact');
    expect(section.schemaId).toBe('contact.visit');
    expect(section.fields.map((f) => f.key)).toEqual(['direccion', 'maps_embed']);
  });

  it('exposes a hero-colors section in Inicio with 52 fields (26 color + 26 number) and layout=grid', () => {
    const section = sectionOf('inicio', 'hero-colors');
    expect(section.title).toBe('Colores del Hero');
    expect(section.category).toBe('hero');
    expect(section.schemaId).toBe('hero_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(52);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 26 color-type fields + 26 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(26);
    expect(numberFields).toHaveLength(26);

    // Row-major order: 13 roles × 4 (heclrN, heclrN_opacity, hedclrN, hedclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 13 }, (_, i) => {
      const n = i + 1;
      return [`heclr${n}`, `heclr${n}_opacity`, `hedclr${n}`, `hedclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks hero-colors into 13 role-groups of 4', () => {
    const section = sectionOf('inicio', 'hero-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(13);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: heclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['heclr1', 'heclr1_opacity', 'hedclr1', 'hedclr1_opacity']);
    // Last row: heclr13 role
    expect(groups[12].map((f) => f.key)).toEqual(['heclr13', 'heclr13_opacity', 'hedclr13', 'hedclr13_opacity']);
  });

  it('exposes a features-colors section in Inicio with 36 fields (18 color + 18 number) and layout=grid', () => {
    const section = sectionOf('inicio', 'features-colors');
    expect(section.title).toBe('Colores de Features');
    expect(section.category).toBe('features');
    expect(section.schemaId).toBe('features_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(36);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 18 color-type fields + 18 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(18);
    expect(numberFields).toHaveLength(18);

    // Row-major order: 9 roles × 4 (feclrN, feclrN_opacity, fedclrN, fedclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      return [`feclr${n}`, `feclr${n}_opacity`, `fedclr${n}`, `fedclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks features-colors into 9 role-groups of 4', () => {
    const section = sectionOf('inicio', 'features-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(9);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: feclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['feclr1', 'feclr1_opacity', 'fedclr1', 'fedclr1_opacity']);
    // Last row: feclr9 role
    expect(groups[8].map((f) => f.key)).toEqual(['feclr9', 'feclr9_opacity', 'fedclr9', 'fedclr9_opacity']);
  });

  it('exposes a promo-colors section in Inicio with 36 fields (18 color + 18 number) and layout=grid', () => {
    const section = sectionOf('inicio', 'promo-colors');
    expect(section.title).toBe('Colores del Promo');
    expect(section.category).toBe('promo_colors');
    expect(section.schemaId).toBe('promo_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(36);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 18 color-type fields + 18 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(18);
    expect(numberFields).toHaveLength(18);

    // Row-major order: 9 roles × 4 (cbclrN, cbclrN_opacity, cbdclrN, cbdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      return [`cbclr${n}`, `cbclr${n}_opacity`, `cbdclr${n}`, `cbdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks promo-colors into 9 role-groups of 4', () => {
    const section = sectionOf('inicio', 'promo-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(9);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: cbclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['cbclr1', 'cbclr1_opacity', 'cbdclr1', 'cbdclr1_opacity']);
    // Last row: cbclr9 role
    expect(groups[8].map((f) => f.key)).toEqual(['cbclr9', 'cbclr9_opacity', 'cbdclr9', 'cbdclr9_opacity']);
  });

  it('exposes a slideshow-colors section in Inicio with 36 fields (18 color + 18 number) and layout=grid', () => {
    const section = sectionOf('inicio', 'slideshow-colors');
    expect(section.title).toBe('Colores del Slideshow');
    expect(section.category).toBe('slideshow_colors');
    expect(section.schemaId).toBe('slideshow_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(36);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 18 color-type fields + 18 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(18);
    expect(numberFields).toHaveLength(18);

    // Row-major order: 9 roles × 4 (bsclrN, bsclrN_opacity, bsdclrN, bsdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      return [`bsclr${n}`, `bsclr${n}_opacity`, `bsdclr${n}`, `bsdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks slideshow-colors into 9 role-groups of 4', () => {
    const section = sectionOf('inicio', 'slideshow-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(9);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: bsclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['bsclr1', 'bsclr1_opacity', 'bsdclr1', 'bsdclr1_opacity']);
    // Last row: bsclr9 role
    expect(groups[8].map((f) => f.key)).toEqual(['bsclr9', 'bsclr9_opacity', 'bsdclr9', 'bsdclr9_opacity']);
  });

  it('exposes a testimonials-colors section in Inicio with 32 fields (16 color + 16 number) and layout=grid', () => {
    const section = sectionOf('inicio', 'testimonials-colors');
    expect(section.title).toBe('Colores de Testimonios');
    expect(section.category).toBe('testimonials_colors');
    expect(section.schemaId).toBe('testimonials_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(32);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 16 color-type fields + 16 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(16);
    expect(numberFields).toHaveLength(16);

    // Row-major order: 8 roles × 4 (tsclrN, tsclrN_opacity, tsdclrN, tsdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 8 }, (_, i) => {
      const n = i + 1;
      return [`tsclr${n}`, `tsclr${n}_opacity`, `tsdclr${n}`, `tsdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks testimonials-colors into 8 role-groups of 4', () => {
    const section = sectionOf('inicio', 'testimonials-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(8);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: tsclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['tsclr1', 'tsclr1_opacity', 'tsdclr1', 'tsdclr1_opacity']);
    // Last row: tsclr8 role
    expect(groups[7].map((f) => f.key)).toEqual(['tsclr8', 'tsclr8_opacity', 'tsdclr8', 'tsdclr8_opacity']);
  });

  it('exposes a visit-colors section in Inicio with 36 fields (18 color + 18 number) and layout=grid', () => {
    const section = sectionOf('inicio', 'visit-colors');
    expect(section.title).toBe('Colores de Visítanos');
    expect(section.category).toBe('visit_colors');
    expect(section.schemaId).toBe('visit_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(36);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 18 color-type fields + 18 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(18);
    expect(numberFields).toHaveLength(18);

    // Row-major order: 9 roles × 4 (vsclrN, vsclrN_opacity, vsdclrN, vsdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 9 }, (_, i) => {
      const n = i + 1;
      return [`vsclr${n}`, `vsclr${n}_opacity`, `vsdclr${n}`, `vsdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks visit-colors into 9 role-groups of 4', () => {
    const section = sectionOf('inicio', 'visit-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(9);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: vsclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['vsclr1', 'vsclr1_opacity', 'vsdclr1', 'vsdclr1_opacity']);
    // Last row: vsclr9 role
    expect(groups[8].map((f) => f.key)).toEqual(['vsclr9', 'vsclr9_opacity', 'vsdclr9', 'vsdclr9_opacity']);
  });

  it('exposes a faq-colors section in Inicio with 32 fields (16 color + 16 number) and layout=grid', () => {
    const section = sectionOf('inicio', 'faq-colors');
    expect(section.title).toBe('Colores de FAQ');
    expect(section.category).toBe('faq_colors');
    expect(section.schemaId).toBe('faq_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(32);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 16 color-type fields + 16 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(16);
    expect(numberFields).toHaveLength(16);

    // Row-major order: 8 roles × 4 (fclrN, fclrN_opacity, fdclrN, fdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 8 }, (_, i) => {
      const n = i + 1;
      return [`fclr${n}`, `fclr${n}_opacity`, `fdclr${n}`, `fdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks faq-colors into 8 role-groups of 4', () => {
    const section = sectionOf('inicio', 'faq-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(8);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: fclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['fclr1', 'fclr1_opacity', 'fdclr1', 'fdclr1_opacity']);
    // Last row: fclr8 role
    expect(groups[7].map((f) => f.key)).toEqual(['fclr8', 'fclr8_opacity', 'fdclr8', 'fdclr8_opacity']);
  });

  it('exposes a secondary-header-colors section in Header with 56 fields (28 color + 28 number) and layout=grid', () => {
    const section = sectionOf('header', 'secondary-header-colors');
    expect(section.title).toBe('Colores del Header Secundario');
    expect(section.category).toBe('secondary_header_colors');
    expect(section.schemaId).toBe('secondary_header_colors');
    expect(section.layout).toBe('grid');
    expect(section.fields).toHaveLength(56);

    // Every field has a non-empty label and tooltip
    for (const f of section.fields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }

    // 28 color-type fields + 28 number-type fields (*_opacity)
    const colorFields = section.fields.filter((f) => f.type === 'color');
    const numberFields = section.fields.filter((f) => f.type === 'number');
    expect(colorFields).toHaveLength(28);
    expect(numberFields).toHaveLength(28);

    // Row-major order: 14 roles × 4 (shclrN, shclrN_opacity, shdclrN, shdclrN_opacity)
    const orderedKeys = section.fields.map((f) => f.key);
    const expectedOrder: string[] = Array.from({ length: 14 }, (_, i) => {
      const n = i + 1;
      return [`shclr${n}`, `shclr${n}_opacity`, `shdclr${n}`, `shdclr${n}_opacity`];
    }).flat();
    expect(orderedKeys).toEqual(expectedOrder);
  });

  it('gridRowGroups chunks secondary-header-colors into 14 role-groups of 4', () => {
    const section = sectionOf('header', 'secondary-header-colors');
    const groups = gridRowGroups(section.fields);
    expect(groups).toHaveLength(14);
    for (const group of groups) {
      expect(group).toHaveLength(4);
      expect(group[0].type).toBe('color');
      expect(group[1].type).toBe('number');
      expect(group[2].type).toBe('color');
      expect(group[3].type).toBe('number');
    }
    // First row: shclr1 role
    expect(groups[0].map((f) => f.key)).toEqual(['shclr1', 'shclr1_opacity', 'shdclr1', 'shdclr1_opacity']);
    // Last row: shclr14 role
    expect(groups[13].map((f) => f.key)).toEqual(['shclr14', 'shclr14_opacity', 'shdclr14', 'shdclr14_opacity']);
  });

  it('marks the social zone as tab-only with Redes Sociales label', () => {
    const social = zoneOf('social');
    expect(social.label).toBe('Redes Sociales');
    expect(social.tabOnly).toBe(true);
    expect(social.sections).toEqual([]);
  });

  it('uses split schemaIds for header/footer branding sections and plain category elsewhere', () => {
    expect(sectionOf('header', 'marca').schemaId).toBe('branding.header');
    expect(sectionOf('footer', 'marca').schemaId).toBe('branding.footer');

    const split = new Set(['branding.header', 'branding.footer', 'contact.visit', 'hero_colors', 'features_colors', 'promo_colors', 'slideshow_colors', 'testimonials_colors', 'visit_colors', 'faq_colors', 'footer_colors', 'theme_colors']);
    for (const zone of ADMIN_ZONES) {
      for (const section of zone.sections) {
        if (!split.has(section.schemaId)) {
          expect(section.schemaId, `${zone.id}.${section.id} must fall back to its category`).toBe(
            section.category,
          );
        }
      }
    }
  });

  it('sets visibilityKey on the 7 Inicio parent sections and leaves color sub-cards + Dirección y Mapa without it', () => {
    const expected: Record<string, string> = {
      hero: 'hero',
      features: 'features',
      'promo-colors': 'promo',
      'slideshow-colors': 'slideshow',
      testimonials: 'testimonials',
      visit: 'visit',
      faq: 'faq',
    };
    for (const [sectionId, key] of Object.entries(expected)) {
      expect(sectionOf('inicio', sectionId).visibilityKey, `inicio.${sectionId}`).toBe(key);
    }

    // Color sub-cards and Dirección y Mapa must NOT carry a visibilityKey —
    // their parent (or nothing) controls visibility.
    const noVisibility = ['hero-colors', 'features-colors', 'testimonials-colors', 'visit-colors', 'faq-colors', 'direccion-mapa'];
    for (const sectionId of noVisibility) {
      expect(sectionOf('inicio', sectionId).visibilityKey, `inicio.${sectionId} must NOT have visibilityKey`).toBeUndefined();
    }

    // No non-Inicio zone carries visibilityKey
    for (const zone of ADMIN_ZONES) {
      if (zone.id === 'inicio') continue;
      for (const section of zone.sections) {
        expect(section.visibilityKey, `${zone.id}.${section.id} must NOT have visibilityKey`).toBeUndefined();
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Field metadata: label/type/tooltip moved from the old SiteConfigForm
// ---------------------------------------------------------------------------

describe('ADMIN_ZONES field metadata', () => {
  it('gives every field a non-empty label, a valid type and a non-empty tooltip', () => {
    const allFields = ADMIN_ZONES.flatMap((z) => z.sections.flatMap((s) => s.fields));
    expect(allFields.length).toBeGreaterThan(0);

    for (const f of allFields) {
      expect(f.label.length, `label of ${f.key}`).toBeGreaterThan(0);
      expect(FIELD_TYPES, `type of ${f.key}`).toContain(f.type);
      expect(f.tooltip?.length ?? 0, `tooltip of ${f.key}`).toBeGreaterThan(0);
    }
  });

  it('moves labels and types from the old SiteConfigForm into the zones', () => {
    // Hero: JSON array fields, numbers, plain text
    expect(fieldIn('inicio', 'hero', 'frases').label).toBe('Frases (una por línea)');
    expect(fieldIn('inicio', 'hero', 'frases').type).toBe('json');
    expect(fieldIn('inicio', 'hero', 'imagenes_pool').type).toBe('json');
    expect(fieldIn('inicio', 'hero', 'intervalo').type).toBe('number');
    expect(fieldIn('inicio', 'hero', 'top_count').type).toBe('number');
    expect(fieldIn('inicio', 'hero', 'fondo').type).toBe('text');

    // Features/FAQ: items are JSON arrays
    expect(fieldIn('inicio', 'features', 'items').type).toBe('json');
    expect(fieldIn('inicio', 'faq', 'items').type).toBe('json');

    // URLs, colors and textareas
    expect(fieldIn('inicio', 'testimonials', 'widget_url').type).toBe('url');
    expect(fieldIn('global', 'seo', 'description').type).toBe('textarea');
    expect(fieldIn('global', 'pwa', 'description').type).toBe('textarea');
    expect(fieldIn('footer', 'contacto', 'direccion').type).toBe('textarea');
    expect(fieldIn('footer', 'marca', 'mision').type).toBe('textarea');

    // Branding/social split fields land in their spec sections
    expect(fieldIn('header', 'marca', 'logo_header').label).toBe('Logo Header (path)');
    expect(fieldIn('header', 'marca', 'slogan').label).toBe('Slogan');
    expect(fieldIn('footer', 'marca', 'logo_footer').label).toBe('Logo Footer (path)');
    expect(fieldIn('footer', 'marca', 'copyright').label).toBe('Copyright');
    expect(fieldIn('header', 'navegacion', 'label_panel').label).toBe('Label Panel');
    expect(fieldIn('header', 'navegacion', 'label_login').label).toBe('Label Login');
  });
});

// ---------------------------------------------------------------------------
// colores-tema semantic role labels: the admin describes FUNCTION, not index.
// The 38 roles group by domain: Base (clr1..clr10 / dclr1..dclr10), Tarjetas
// (tclr1..tclr6 / tdclr1..tdclr6), Header (hclr1..hclr13 / hdclr1..hdclr13)
// and Menú (mclr1..mclr9 / mdclr1..mdclr9). The Base maps below cover
// clr1..clr8; the clr9/clr10 scrollbar roles are covered by globals-css.test.ts.
// ---------------------------------------------------------------------------

describe('ADMIN_ZONES colores-tema semantic role labels', () => {
  it('maps every Base light clrN label to its semantic role', () => {
    const expectedBase: Record<string, string> = {
      clr1: 'Fondo',
      clr2: 'Texto Principal',
      clr3: 'Texto Secundario',
      clr4: 'Énfasis Principal',
      clr5: 'Énfasis Secundario',
      clr6: 'Énfasis Terciario',
      clr7: 'Bordes Principal',
      clr8: 'Bordes Secundario',
    };
    for (const [key, label] of Object.entries(expectedBase)) {
      expect(fieldIn('global', 'colores-tema', key).label, `label of ${key}`).toBe(label);
    }
  });

  it('maps every Base dark dclrN label to its semantic role (light label + "Oscuro")', () => {
    const expectedBaseDark: Record<string, string> = {
      dclr1: 'Fondo Oscuro',
      dclr2: 'Texto Principal Oscuro',
      dclr3: 'Texto Secundario Oscuro',
      dclr4: 'Énfasis Principal Oscuro',
      dclr5: 'Énfasis Secundario Oscuro',
      dclr6: 'Énfasis Terciario Oscuro',
      dclr7: 'Bordes Principal Oscuro',
      dclr8: 'Bordes Secundario Oscuro',
    };
    for (const [key, label] of Object.entries(expectedBaseDark)) {
      expect(fieldIn('global', 'colores-tema', key).label, `label of ${key}`).toBe(label);
    }
  });

  it('maps Tarjetas light role labels (tclr1..tclr6)', () => {
    const expectedTarjetas: Record<string, string> = {
      tclr1: 'Fondo Inicial',
      tclr2: 'Fondo Final',
      tclr3: 'Énfasis',
      tclr4: 'Categoría',
      tclr5: 'Enlaces',
      tclr6: 'Texto',
    };
    for (const [key, label] of Object.entries(expectedTarjetas)) {
      expect(fieldIn('global', 'colores-tema', key).label, `label of ${key}`).toBe(label);
    }
  });

  it('maps Header light role labels (hclr1..hclr13)', () => {
    const expectedHeader: Record<string, string> = {
      hclr1: 'Botón Menú',
      hclr2: 'Separador',
      hclr3: 'Pretitulo',
      hclr4: 'Nombre Corto',
      hclr5: 'Slogan',
      hclr6: 'Fondo Botones',
      hclr7: 'Fondo Botones Hover',
      hclr8: 'Texto Botones',
      hclr9: 'Texto Botones Hover',
      hclr10: 'Texto Header',
      hclr11: 'Texto Hover',
      hclr12: 'Fondo Inicial',
      hclr13: 'Fondo Final',
    };
    for (const [key, label] of Object.entries(expectedHeader)) {
      expect(fieldIn('header', 'header-colors', key).label, `label of ${key}`).toBe(label);
    }
  });

  it('maps Menú light role labels (mclr1..mclr11)', () => {
    const expectedMenu: Record<string, string> = {
      mclr1: 'Fondo Inicial',
      mclr2: 'Fondo Final',
      mclr3: 'Texto',
      mclr4: 'Énfasis',
      mclr5: 'Enlaces',
      mclr6: 'Cuadro Enlace',
      mclr7: 'Pretitulo Menú',
      mclr8: 'Nombre Corto Menú',
      mclr9: 'Slogan Menú',
      mclr10: 'Bordes',
      mclr11: 'Texto Hover',
    };
    for (const [key, label] of Object.entries(expectedMenu)) {
      expect(fieldIn('header', 'menu-colors', key).label, `label of ${key}`).toBe(label);
    }
  });

  it('keeps opacity labels derived from the renamed roles (Transparencia + label)', () => {
    expect(fieldIn('global', 'colores-tema', 'clr1_opacity').label).toBe('Transparencia Fondo');
    expect(fieldIn('global', 'colores-tema', 'clr3_opacity').label).toBe('Transparencia Texto Secundario');
    expect(fieldIn('global', 'colores-tema', 'dclr2_opacity').label).toBe('Transparencia Texto Principal Oscuro');
    expect(fieldIn('global', 'colores-tema', 'dclr7_opacity').label).toBe('Transparencia Bordes Principal Oscuro');
    expect(fieldIn('header', 'menu-colors', 'mclr9_opacity').label).toBe('Transparencia Slogan Menú');
  });

  it('updates tooltips to describe the semantic role for representative keys', () => {
    expect(fieldIn('global', 'colores-tema', 'dclr2').tooltip).toBe(
      'Texto e íconos principales en modo oscuro (var(--dclr2))',
    );
    expect(fieldIn('global', 'colores-tema', 'dclr7').tooltip).toBe(
      'Bordes, separadores e inputs en modo oscuro (var(--dclr7))',
    );
    expect(fieldIn('global', 'colores-tema', 'tclr1').tooltip).toBe(
      'Color de inicio del degradado de la tarjeta en modo claro (var(--tclr1))',
    );
    expect(fieldIn('header', 'header-colors', 'hclr1').tooltip).toBe(
      'Color del botón hamburguesa del header (var(--hclr1))',
    );
    expect(fieldIn('header', 'menu-colors', 'mclr1').tooltip).toBe(
      'Color de inicio del degradado del menú lateral (var(--mclr1))',
    );
  });
});
