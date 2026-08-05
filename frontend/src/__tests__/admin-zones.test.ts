import { describe, it, expect } from 'vitest';
import { ADMIN_ZONES } from '@/lib/admin-zones';
import type { AdminZone, ZoneSection, ZoneSectionField } from '@/lib/admin-zones';
import type { SiteConfigCategory, SiteConfigRecord } from '@/lib/site-config.types';

// ---------------------------------------------------------------------------
// Expected field map — authoritative mapping from spec (cms-admin-fase2).
// Type-checked against the real category interfaces: if site-config.types.ts
// gains/renames a field, this literal stops compiling (compile-time coverage).
// ---------------------------------------------------------------------------

type CategoryFieldMap = { [C in SiteConfigCategory]: readonly (keyof SiteConfigRecord[C])[] };

const EXPECTED_FIELDS = {
  branding: [
    'nombre_grupo',
    'nombre_corto',
    'pretitulo',
    'slogan',
    'mision',
    'motto',
    'logo_header',
    'logo_footer',
    'copyright',
  ],
  social: ['instagram', 'facebook', 'youtube', 'tiktok', 'google', 'whatsapp', 'email'],
  contact: ['sede_nombre', 'direccion', 'maps_embed'],
  hero: ['frases', 'fondo', 'intervalo', 'imagenes_pool', 'top_count', 'bottom_count'],
  features: ['titulo_seccion', 'subtitulo', 'items'],
  faq: ['titulo_seccion', 'subtitulo', 'items'],
  testimonials: ['titulo_seccion', 'widget_url'],
  visit: ['titulo', 'fecha_fundacion', 'email', 'email_href', 'horario', 'cta_texto', 'imagen'],
  seo: ['title', 'description', 'theme_color'],
  pwa: [
    'name',
    'short_name',
    'description',
    'background_color',
    'theme_color',
    'lang',
    'icon_192',
    'icon_512',
    'icon_1024',
  ],
  navigation: ['label_panel', 'label_login'],
} as const satisfies CategoryFieldMap;

const FIELD_TYPES = ['text', 'textarea', 'url', 'color', 'number', 'json'] as const;

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
// Coverage invariant: every field of the 11 categories in EXACTLY one section
// ---------------------------------------------------------------------------

describe('ADMIN_ZONES coverage', () => {
  it('contains exactly the 5 zones with ids, labels and icons', () => {
    expect(ADMIN_ZONES.map((z) => z.id)).toEqual(['inicio', 'header', 'footer', 'global', 'menu']);
    expect(ADMIN_ZONES.map((z) => z.label)).toEqual([
      'Inicio',
      'Header',
      'Footer',
      'Global',
      'Menú de Navegación',
    ]);
    expect(ADMIN_ZONES.every((z) => z.icon.length > 0)).toBe(true);
  });

  it('covers every field of every category exactly once — none missing, none duplicated, none extra', () => {
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

    // None missing
    for (const id of expected) {
      expect(seen.get(id), `expected ${id} to appear exactly once`).toBe(1);
    }

    // No duplicates
    for (const [id, count] of seen) {
      expect(count, `${id} must not be duplicated across sections`).toBe(1);
    }

    // No extra fields beyond the 11 categories (exact set equality)
    expect(placements.sort()).toEqual([...expected].sort());
    expect(placements.length).toBe(expected.length);
  });

  it('keeps the Inicio section order Hero → Features → Testimonios → Visítanos → FAQ', () => {
    const inicio = zoneOf('inicio');
    expect(inicio.sections.map((s) => s.id)).toEqual(['hero', 'features', 'testimonials', 'visit', 'faq']);
    expect(inicio.sections.map((s) => s.title)).toEqual(['Hero', 'Features', 'Testimonios', 'Visítanos', 'FAQ']);
  });

  it('marks the Menú de Navegación zone as tab-only with no field metadata', () => {
    const menu = zoneOf('menu');
    // Precondition: menu is a tab marker (MenuManager CRUD) — so it carries no sections
    expect(menu.tabOnly).toBe(true);
    expect(menu.sections).toEqual([]);

    // Triangulation: every other zone carries real sections
    const otherZones = ADMIN_ZONES.filter((z) => z.id !== 'menu');
    expect(otherZones.every((z) => z.tabOnly !== true)).toBe(true);
    expect(otherZones.map((z) => z.sections.length)).toEqual([5, 3, 3, 2]);
  });

  it('maps each zone to its exact sections and categories', () => {
    expect(zoneOf('inicio').sections.map((s) => s.category)).toEqual([
      'hero',
      'features',
      'testimonials',
      'visit',
      'faq',
    ]);
    expect(zoneOf('header').sections.map((s) => s.category)).toEqual(['branding', 'social', 'navigation']);
    expect(zoneOf('footer').sections.map((s) => s.category)).toEqual(['branding', 'social', 'contact']);
    expect(zoneOf('global').sections.map((s) => s.category)).toEqual(['seo', 'pwa']);
  });

  it('uses split schemaIds for header/footer branding+social sections and plain category elsewhere', () => {
    expect(sectionOf('header', 'marca').schemaId).toBe('branding.header');
    expect(sectionOf('footer', 'marca').schemaId).toBe('branding.footer');
    expect(sectionOf('header', 'redes').schemaId).toBe('social.header');
    expect(sectionOf('footer', 'redes').schemaId).toBe('social.footer');

    const split = new Set(['branding.header', 'branding.footer', 'social.header', 'social.footer']);
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
    expect(fieldIn('header', 'redes', 'instagram').type).toBe('url');
    expect(fieldIn('header', 'redes', 'whatsapp').type).toBe('text');
    expect(fieldIn('footer', 'redes', 'email').type).toBe('url');
    expect(fieldIn('global', 'seo', 'theme_color').type).toBe('color');
    expect(fieldIn('global', 'pwa', 'background_color').type).toBe('color');
    expect(fieldIn('global', 'seo', 'description').type).toBe('textarea');
    expect(fieldIn('global', 'pwa', 'description').type).toBe('textarea');
    expect(fieldIn('footer', 'contacto', 'direccion').type).toBe('textarea');
    expect(fieldIn('footer', 'marca', 'mision').type).toBe('textarea');

    // Branding/social split fields land in their spec sections
    expect(fieldIn('header', 'marca', 'logo_header').label).toBe('Logo Header (path)');
    expect(fieldIn('header', 'marca', 'slogan').label).toBe('Slogan');
    expect(fieldIn('footer', 'marca', 'logo_footer').label).toBe('Logo Footer (path)');
    expect(fieldIn('footer', 'marca', 'copyright').label).toBe('Copyright');
    expect(fieldIn('footer', 'redes', 'youtube').label).toBe('YouTube URL');
    expect(fieldIn('footer', 'redes', 'tiktok').label).toBe('TikTok URL');
    expect(fieldIn('header', 'navegacion', 'label_panel').label).toBe('Label Panel');
    expect(fieldIn('header', 'navegacion', 'label_login').label).toBe('Label Login');
  });
});
