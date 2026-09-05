import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — @supabase/supabase-js (chainable builder) and next/cache (server-only)
// ---------------------------------------------------------------------------

const supabaseMocks = vi.hoisted(() => {
  const createClient = vi.fn();
  const upsertCalls: Array<{ table: string; payload: Record<string, unknown> }> = [];
  const fromCalls: string[] = [];
  let perfilRolId: number | null = 1;
  let currentTable = '';

  const chain = {
    select: vi.fn(function (this: unknown) {
      return this;
    }),
    eq: vi.fn(function (this: unknown) {
      return this;
    }),
    single: vi.fn(async () => ({ data: { rol_id: perfilRolId }, error: null })),
    upsert: vi.fn(async function (this: unknown, payload: Record<string, unknown>) {
      upsertCalls.push({ table: currentTable, payload });
      return { data: null, error: null };
    }),
  };

  const client = {
    auth: {
      getUser: vi.fn(async () => ({ data: { user: { id: 'admin-1' } }, error: null })),
    },
    from: vi.fn((table: string) => {
      fromCalls.push(table);
      currentTable = table;
      return chain;
    }),
  };

  createClient.mockReturnValue(client);

  return {
    createClient,
    upsertCalls,
    fromCalls,
    setPerfilRolId: (rolId: number | null) => {
      perfilRolId = rolId;
    },
  };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: supabaseMocks.createClient,
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports — under test
// ---------------------------------------------------------------------------

import { revalidateTag, revalidatePath } from 'next/cache';
import {
  schemaResolver,
  brandingHeaderSchema,
  brandingFooterSchema,
  socialHeaderSchema,
  socialFooterSchema,
  contactVisitSchema,
} from '@/lib/site-config.validation';
import { saveSiteConfig } from '@/app/(admin)/actions/save-site-config';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_HERO = {
  frases: ['Manada unida', 'Siempre listos'],
  fondo: '/images/hero.webp',
  intervalo: 5000,
  imagenes_pool: ['/images/foto1.webp'],
  top_count: 2,
  bottom_count: 1,
};

const VALID_HERO_COLORS = {
  heclr1: '#cb3327', heclr2: '#cb3327', heclr3: '#cb3327',
  hedclr1: '#121212', hedclr2: '#1e1e1e', hedclr3: '#121212',
  heclr4: '#ffd700', heclr5: '#ffffff',
  hedclr4: '#ffd700', hedclr5: '#ffffff',
  heclr6: '#fca5a5', heclr7: '#93c5fd', heclr8: '#86efac', heclr9: '#d8b4fe',
  heclr10: '#fde047', heclr11: '#fdba74', heclr12: '#a5b4fc', heclr13: '#f9a8d4',
  hedclr6: '#fca5a5', hedclr7: '#93c5fd', hedclr8: '#86efac', hedclr9: '#d8b4fe',
  hedclr10: '#fde047', hedclr11: '#fdba74', hedclr12: '#a5b4fc', hedclr13: '#f9a8d4',
  heclr1_opacity: 100, heclr2_opacity: 100, heclr3_opacity: 100,
  hedclr1_opacity: 100, hedclr2_opacity: 100, hedclr3_opacity: 100,
  heclr4_opacity: 100, heclr5_opacity: 100,
  hedclr4_opacity: 100, hedclr5_opacity: 100,
  heclr6_opacity: 100, heclr7_opacity: 100, heclr8_opacity: 100, heclr9_opacity: 100,
  heclr10_opacity: 100, heclr11_opacity: 100, heclr12_opacity: 100, heclr13_opacity: 100,
  hedclr6_opacity: 100, hedclr7_opacity: 100, hedclr8_opacity: 100, hedclr9_opacity: 100,
  hedclr10_opacity: 100, hedclr11_opacity: 100, hedclr12_opacity: 100, hedclr13_opacity: 100,
};

const SOCIAL_FOOTER_SUBSET = {
  youtube: 'https://youtube.com/@nuamana',
  tiktok: 'https://tiktok.com/@nuamana',
  google: 'https://g.page/r/nuamana',
  email: 'hola@nuamana.cl',
};

beforeEach(() => {
  supabaseMocks.upsertCalls.length = 0;
  supabaseMocks.fromCalls.length = 0;
  supabaseMocks.setPerfilRolId(1);
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// schemaResolver — 30 ids (12 plain categories + 5 splits + theme_colors + hero_colors + features_colors + promo_colors + slideshow_colors + testimonials_colors + visit_colors + faq_colors + secondary_header_colors + footer_colors + header_colors + menu_colors + section_visibility + social_list)
// ---------------------------------------------------------------------------

describe('schemaResolver', () => {
  it('covers exactly the 30 schema ids', () => {
    expect(Object.keys(schemaResolver).sort()).toEqual([
      'branding',
      'branding.footer',
      'branding.header',
      'contact',
      'contact.visit',
      'faq',
      'faq_colors',
      'features',
      'features_colors',
      'footer_colors',
      'header_colors',
      'hero',
      'hero_colors',
      'menu_colors',
      'navigation',
      'promo_colors',
      'pwa',
      'secondary_header_colors',
      'section_visibility',
      'seo',
      'slideshow_colors',
      'social',
      'social.footer',
      'social.header',
      'social_list',
      'testimonials',
      'testimonials_colors',
      'theme_colors',
      'visit',
      'visit_colors',
    ]);
  });

  it('maps partial ids to their base categories and plain ids to themselves, each with a parseable schema', () => {
    expect(schemaResolver['branding.header']).toEqual({ category: 'branding', schema: brandingHeaderSchema });
    expect(schemaResolver['branding.footer']).toEqual({ category: 'branding', schema: brandingFooterSchema });
    expect(schemaResolver['social.header']).toEqual({ category: 'social', schema: socialHeaderSchema });
    expect(schemaResolver['social.footer']).toEqual({ category: 'social', schema: socialFooterSchema });
    expect(schemaResolver['contact.visit']).toEqual({ category: 'contact', schema: contactVisitSchema });

    for (const [id, resolved] of Object.entries(schemaResolver)) {
      if (id === 'branding.header' || id === 'branding.footer') {
        expect(resolved.category).toBe('branding');
      } else if (id === 'social.header' || id === 'social.footer') {
        expect(resolved.category).toBe('social');
      } else if (id === 'contact.visit') {
        expect(resolved.category).toBe('contact');
      } else if (id === 'hero_colors') {
        expect(resolved.category).toBe('hero');
      } else if (id === 'features_colors') {
        expect(resolved.category).toBe('features');
      } else if (id === 'promo_colors') {
        expect(resolved.category).toBe('promo_colors');
      } else if (id === 'slideshow_colors') {
        expect(resolved.category).toBe('slideshow_colors');
      } else if (id === 'testimonials_colors') {
        expect(resolved.category).toBe('testimonials_colors');
      } else if (id === 'visit_colors') {
        expect(resolved.category).toBe('visit_colors');
      } else if (id === 'faq_colors') {
        expect(resolved.category).toBe('faq_colors');
      } else if (id === 'secondary_header_colors') {
        expect(resolved.category).toBe('secondary_header_colors');
      } else if (id === 'footer_colors') {
        expect(resolved.category).toBe('footer_colors');
      } else if (id === 'social_list') {
        expect(resolved.category).toBe('social_list');
      } else {
        expect(resolved.category, `${id} must resolve to itself`).toBe(id);
      }
      expect(typeof resolved.schema.safeParse).toBe('function');
    }
  });
});

// ---------------------------------------------------------------------------
// Partial Zod schemas — accept partial objects, reject wrong types
// ---------------------------------------------------------------------------

describe('partial schemas', () => {
  it('branding.header accepts a partial object and rejects wrong types', () => {
    expect(brandingHeaderSchema.safeParse({ pretitulo: 'Guías y Scouts' }).success).toBe(true);
    expect(brandingHeaderSchema.safeParse({}).success).toBe(true);
    expect(brandingHeaderSchema.safeParse({ pretitulo: 42 }).success).toBe(false);
  });

  it('branding.footer accepts a footer-subset partial', () => {
    expect(brandingFooterSchema.safeParse({ mision: 'Educar para la vida', copyright: 'Nua Mana' }).success).toBe(
      true,
    );
    expect(brandingFooterSchema.safeParse({ mision: 7 }).success).toBe(false);
  });

  it('social.header accepts the header subset and rejects an empty submitted whatsapp', () => {
    expect(
      socialHeaderSchema.safeParse({
        instagram: 'https://instagram.com/nuamana',
        facebook: 'https://facebook.com/nuamana',
        whatsapp: 'https://wa.me/56912345678',
      }).success,
    ).toBe(true);
    expect(socialHeaderSchema.safeParse({ whatsapp: '' }).success).toBe(false);
  });

  it('social.footer accepts youtube/tiktok/google/email while missing instagram is accepted', () => {
    expect(socialFooterSchema.safeParse(SOCIAL_FOOTER_SUBSET).success).toBe(true);
    expect(socialFooterSchema.safeParse({ youtube: 'not-a-url' }).success).toBe(false);
  });

  it('social.footer email accepts the mailto: URI seed format and a plain email, and rejects malformed values', () => {
    const mailtoFooter = {
      youtube: 'https://youtube.com/@nuamana',
      tiktok: 'https://tiktok.com/@nuamana',
      google: 'https://g.page/r/nuamana',
      email: 'mailto:contacto@nuamana.cl',
    };
    expect(socialFooterSchema.safeParse(mailtoFooter).success).toBe(true);
    expect(socialFooterSchema.safeParse({ email: '' }).success).toBe(true);
    expect(socialFooterSchema.safeParse({ email: 'no-es-mail' }).success).toBe(false);
  });

  it('contact.visit accepts a partial subset (direccion only), both fields, and rejects wrong types + unexpected keys', () => {
    // Partial subset — only direccion
    expect(contactVisitSchema.safeParse({ direccion: 'Av. 1 #2' }).success).toBe(true);
    // Both fields
    expect(
      contactVisitSchema.safeParse({ direccion: 'Av. 1 #2', maps_embed: 'https://maps.google.com/embed' }).success,
    ).toBe(true);
    // Empty object accepted (all keys optional via .partial())
    expect(contactVisitSchema.safeParse({}).success).toBe(true);
    // Wrong type for maps_embed rejected
    expect(contactVisitSchema.safeParse({ maps_embed: 42 }).success).toBe(false);
    // Unexpected key rejected (sede_nombre is a contact key but NOT a contact.visit key)
    expect(contactVisitSchema.safeParse({ sede_nombre: 'X' }).success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// saveSiteConfig action — schemaId resolution, subset upsert, unchanged paths
// ---------------------------------------------------------------------------

describe('saveSiteConfig action', () => {
  it('partial submit (Header→Marca, only pretitulo edited) upserts ONLY the submitted key', async () => {
    const result = await saveSiteConfig('branding.header', { pretitulo: 'Nuevo pretitulo' }, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(1);
    expect(supabaseMocks.upsertCalls[0].payload).toEqual(
      expect.objectContaining({
        categoria: 'branding',
        clave: 'pretitulo',
        valor: 'Nuevo pretitulo',
        updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      }),
    );
    // logo_header and slogan rows must NOT be touched by a Marca partial save
    expect(supabaseMocks.upsertCalls.map((c) => c.payload.clave)).not.toContain('logo_header');
    expect(supabaseMocks.upsertCalls.map((c) => c.payload.clave)).not.toContain('slogan');
  });

  it('full-category path unchanged: hero saves every key under categoria hero', async () => {
    const result = await saveSiteConfig('hero', VALID_HERO, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(6);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'hero')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'frases')?.payload.valor,
    ).toEqual(VALID_HERO.frases);
  });

  it('hero_colors grid saves every key under categoria hero (52 fields)', async () => {
    const result = await saveSiteConfig('hero_colors', VALID_HERO_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(52);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'hero')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'heclr1')?.payload.valor,
    ).toBe('#cb3327');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'hedclr6')?.payload.valor,
    ).toBe('#fca5a5');
  });

  it('features_colors grid saves every key under categoria features (36 fields)', async () => {
    const VALID_FEATURES_COLORS = {
      feclr1: '#2d3748', fedclr1: '#f7fafc', feclr1_opacity: 100, fedclr1_opacity: 100,
      feclr2: '#4a5568', fedclr2: '#e2e8f0', feclr2_opacity: 100, fedclr2_opacity: 100,
      feclr3: '#edf2f7', fedclr3: '#1a202c', feclr3_opacity: 100, fedclr3_opacity: 100,
      feclr4: '#e2e8f0', fedclr4: '#2d3748', feclr4_opacity: 100, fedclr4_opacity: 100,
      feclr5: '#cbd5e0', fedclr5: '#4a5568', feclr5_opacity: 100, fedclr5_opacity: 100,
      feclr6: '#2d3748', fedclr6: '#f7fafc', feclr6_opacity: 100, fedclr6_opacity: 100,
      feclr7: '#4a5568', fedclr7: '#e2e8f0', feclr7_opacity: 100, fedclr7_opacity: 100,
      feclr8: '#ed8936', fedclr8: '#f6ad55', feclr8_opacity: 100, fedclr8_opacity: 100,
      feclr9: '#edf2f7', fedclr9: '#1a202c', feclr9_opacity: 100, fedclr9_opacity: 100,
    };
    const result = await saveSiteConfig('features_colors', VALID_FEATURES_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(36);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'features')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'feclr1')?.payload.valor,
    ).toBe('#2d3748');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'fedclr8')?.payload.valor,
    ).toBe('#f6ad55');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'fedclr9')?.payload.valor,
    ).toBe('#1a202c');
  });

  it('promo_colors grid saves every key under categoria promo_colors (36 fields)', async () => {
    const VALID_PROMO_COLORS = {
      cbclr1: '#edf2f7', cbdclr1: '#1a202c', cbclr1_opacity: 100, cbdclr1_opacity: 100,
      cbclr2: '#e2e8f0', cbdclr2: '#2d3748', cbclr2_opacity: 100, cbdclr2_opacity: 100,
      cbclr3: '#cbd5e0', cbdclr3: '#4a5568', cbclr3_opacity: 100, cbdclr3_opacity: 100,
      cbclr4: '#2c3e50', cbdclr4: '#f7fafc', cbclr4_opacity: 100, cbdclr4_opacity: 100,
      cbclr5: '#4a5568', cbdclr5: '#e2e8f0', cbclr5_opacity: 100, cbdclr5_opacity: 100,
      cbclr6: '#cb3327', cbdclr6: '#ef4b3a', cbclr6_opacity: 100, cbdclr6_opacity: 100,
      cbclr7: '#2c3e50', cbdclr7: '#33506f', cbclr7_opacity: 100, cbdclr7_opacity: 100,
      cbclr8: '#e9ecef', cbdclr8: '#3c3c3c', cbclr8_opacity: 100, cbdclr8_opacity: 100,
      cbclr9: '#FFFFFF', cbdclr9: '#121212', cbclr9_opacity: 100, cbdclr9_opacity: 100,
    };
    const result = await saveSiteConfig('promo_colors', VALID_PROMO_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(36);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'promo_colors')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'cbclr1')?.payload.valor,
    ).toBe('#edf2f7');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'cbdclr6')?.payload.valor,
    ).toBe('#ef4b3a');
  });

  it('slideshow_colors grid saves every key under categoria slideshow_colors (36 fields)', async () => {
    const VALID_SLIDESHOW_COLORS = {
      bsclr1: '#e9ecef', bsdclr1: '#121212', bsclr1_opacity: 100, bsdclr1_opacity: 100,
      bsclr2: '#b0b0b0', bsdclr2: '#b0b0b0', bsclr2_opacity: 100, bsdclr2_opacity: 100,
      bsclr3: '#95a5a6', bsdclr3: '#95a5a6', bsclr3_opacity: 100, bsdclr3_opacity: 100,
      bsclr4: '#cb3327', bsdclr4: '#cb3327', bsclr4_opacity: 100, bsdclr4_opacity: 100,
      bsclr5: '#1d1d1d', bsdclr5: '#121212', bsclr5_opacity: 100, bsdclr5_opacity: 100,
      bsclr6: '#1d1d1d', bsdclr6: '#121212', bsclr6_opacity: 20, bsdclr6_opacity: 20,
      bsclr7: '#cb3327', bsdclr7: '#ef4b3a', bsclr7_opacity: 100, bsdclr7_opacity: 100,
      bsclr8: '#FFFFFF', bsdclr8: '#FFFFFF', bsclr8_opacity: 100, bsdclr8_opacity: 100,
      bsclr9: '#e9ecef', bsdclr9: '#3c3c3c', bsclr9_opacity: 100, bsdclr9_opacity: 100,
    };
    const result = await saveSiteConfig('slideshow_colors', VALID_SLIDESHOW_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(36);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'slideshow_colors')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'bsclr1')?.payload.valor,
    ).toBe('#e9ecef');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'bsdclr9')?.payload.valor,
    ).toBe('#3c3c3c');
  });

  it('testimonials_colors grid saves every key under categoria testimonials_colors (32 fields)', async () => {
    const VALID_TESTIMONIALS_COLORS = {
      tsclr1: '#e9ecef', tsdclr1: '#3c3c3c', tsclr1_opacity: 100, tsdclr1_opacity: 100,
      tsclr2: '#cb3327', tsdclr2: '#ef4b3a', tsclr2_opacity: 100, tsdclr2_opacity: 100,
      tsclr3: '#1d1d1d', tsdclr3: '#b0b0b0', tsclr3_opacity: 100, tsdclr3_opacity: 100,
      tsclr4: '#FFFFFF', tsdclr4: '#121212', tsclr4_opacity: 100, tsdclr4_opacity: 100,
      tsclr5: '#1d1d1d', tsdclr5: '#b0b0b0', tsclr5_opacity: 100, tsdclr5_opacity: 100,
      tsclr6: '#95a5a6', tsdclr6: '#8a8a8a', tsclr6_opacity: 100, tsdclr6_opacity: 100,
      tsclr7: '#cb3327', tsdclr7: '#ef4b3a', tsclr7_opacity: 100, tsdclr7_opacity: 100,
      tsclr8: '#e9ecef', tsdclr8: '#3c3c3c', tsclr8_opacity: 100, tsdclr8_opacity: 100,
    };
    const result = await saveSiteConfig('testimonials_colors', VALID_TESTIMONIALS_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(32);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'testimonials_colors')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'tsclr1')?.payload.valor,
    ).toBe('#e9ecef');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'tsdclr8')?.payload.valor,
    ).toBe('#3c3c3c');
  });

  it('visit_colors grid saves every key under categoria visit_colors (36 fields)', async () => {
    const VALID_VISIT_COLORS = {
      vsclr1: '#FFFFFF', vsdclr1: '#121212', vsclr1_opacity: 100, vsdclr1_opacity: 100,
      vsclr2: '#cb3327', vsdclr2: '#ef4b3a', vsclr2_opacity: 100, vsdclr2_opacity: 100,
      vsclr3: '#FFFFFF', vsdclr3: '#1e1e1e', vsclr3_opacity: 100, vsdclr3_opacity: 100,
      vsclr4: '#f8f9fa', vsdclr4: '#26262b', vsclr4_opacity: 100, vsdclr4_opacity: 100,
      vsclr5: '#33a345', vsdclr5: '#33a345', vsclr5_opacity: 100, vsdclr5_opacity: 100,
      vsclr6: '#333333', vsdclr6: '#b0b0b0', vsclr6_opacity: 100, vsdclr6_opacity: 100,
      vsclr7: '#FFFFFF', vsdclr7: '#121212', vsclr7_opacity: 100, vsdclr7_opacity: 100,
      vsclr8: '#e9ecef', vsdclr8: '#3c3c3c', vsclr8_opacity: 100, vsdclr8_opacity: 100,
      vsclr9: '#ffc41d', vsdclr9: '#ffcf33', vsclr9_opacity: 100, vsdclr9_opacity: 100,
    };
    const result = await saveSiteConfig('visit_colors', VALID_VISIT_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(36);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'visit_colors')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'vsclr1')?.payload.valor,
    ).toBe('#FFFFFF');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'vsdclr9')?.payload.valor,
    ).toBe('#ffcf33');
  });

  it('faq_colors grid saves every key under categoria faq_colors (32 fields)', async () => {
    const VALID_FAQ_COLORS = {
      fclr1: '#e9ecef', fdclr1: '#3c3c3c', fclr1_opacity: 100, fdclr1_opacity: 100,
      fclr2: '#cb3327', fdclr2: '#ef4b3a', fclr2_opacity: 100, fdclr2_opacity: 100,
      fclr3: '#95a5a6', fdclr3: '#8a8a8a', fclr3_opacity: 100, fdclr3_opacity: 100,
      fclr4: '#FFFFFF', fdclr4: '#121212', fclr4_opacity: 100, fdclr4_opacity: 100,
      fclr5: '#cb3327', fdclr5: '#ef4b3a', fclr5_opacity: 100, fdclr5_opacity: 100,
      fclr6: '#1d1d1d', fdclr6: '#b0b0b0', fclr6_opacity: 100, fdclr6_opacity: 100,
      fclr7: '#e9ecef', fdclr7: '#3c3c3c', fclr7_opacity: 100, fdclr7_opacity: 100,
      fclr8: '#cb3327', fdclr8: '#ef4b3a', fclr8_opacity: 100, fdclr8_opacity: 100,
    };
    const result = await saveSiteConfig('faq_colors', VALID_FAQ_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(32);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'faq_colors')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'fclr1')?.payload.valor,
    ).toBe('#e9ecef');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'fdclr8')?.payload.valor,
    ).toBe('#ef4b3a');
  });

  it('footer_colors grid saves every key under categoria footer_colors (40 fields)', async () => {
    const VALID_FOOTER_COLORS = {
      foclr1: '#FFFFFF', fodclr1: '#121212', foclr1_opacity: 100, fodclr1_opacity: 100,
      foclr2: '#cb3327', fodclr2: '#ef4b3a', foclr2_opacity: 100, fodclr2_opacity: 100,
      foclr3: '#cb3327', fodclr3: '#ef4b3a', foclr3_opacity: 100, fodclr3_opacity: 100,
      foclr4: '#cb3327', fodclr4: '#b0b0b0', foclr4_opacity: 100, fodclr4_opacity: 100,
      foclr5: '#cb3327', fodclr5: '#ffcf33', foclr5_opacity: 100, fodclr5_opacity: 100,
      foclr6: '#1d1d1d', fodclr6: '#b0b0b0', foclr6_opacity: 100, fodclr6_opacity: 100,
      foclr7: '#cb3327', fodclr7: '#121212', foclr7_opacity: 100, fodclr7_opacity: 100,
      foclr8: '#FFFFFF', fodclr8: '#FFFFFF', foclr8_opacity: 100, fodclr8_opacity: 100,
      foclr9: '#cb3327', fodclr9: '#ef4b3a', foclr9_opacity: 100, fodclr9_opacity: 100,
      foclr10: '#cb3327', fodclr10: '#ef4b3a', foclr10_opacity: 100, fodclr10_opacity: 100,
    };
    const result = await saveSiteConfig('footer_colors', VALID_FOOTER_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(40);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'footer_colors')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'foclr1')?.payload.valor,
    ).toBe('#FFFFFF');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'fodclr10')?.payload.valor,
    ).toBe('#ef4b3a');
  });

  it('secondary_header_colors grid saves every key under categoria secondary_header_colors (56 fields)', async () => {
    const VALID_SECONDARY_HEADER_COLORS = {
      shclr1: '#cb3327', shdclr1: '#FFFFFF', shclr1_opacity: 100, shdclr1_opacity: 100,
      shclr2: '#ffc41d', shdclr2: '#ffcf33', shclr2_opacity: 100, shdclr2_opacity: 100,
      shclr3: '#95a5a6', shdclr3: '#8a8a8a', shclr3_opacity: 100, shdclr3_opacity: 100,
      shclr4: '#cb3327', shdclr4: '#ef4b3a', shclr4_opacity: 100, shdclr4_opacity: 100,
      shclr5: '#1d1d1d', shdclr5: '#ffcf33', shclr5_opacity: 100, shdclr5_opacity: 100,
      shclr6: '#f8f9fa', shdclr6: '#26262b', shclr6_opacity: 100, shdclr6_opacity: 100,
      shclr7: '#cb3327', shdclr7: '#ffcf33', shclr7_opacity: 100, shdclr7_opacity: 100,
      shclr8: '#333333', shdclr8: '#b0b0b0', shclr8_opacity: 100, shdclr8_opacity: 100,
      shclr9: '#cb3327', shdclr9: '#ef4b3a', shclr9_opacity: 100, shdclr9_opacity: 100,
      shclr10: '#2c3e50', shdclr10: '#b0b0b0', shclr10_opacity: 100, shdclr10_opacity: 100,
      shclr11: '#cb3327', shdclr11: '#ef4b3a', shclr11_opacity: 100, shdclr11_opacity: 100,
      shclr12: '#2c3e50', shdclr12: '#33506f', shclr12_opacity: 100, shdclr12_opacity: 100,
      shclr13: '#cb3327', shdclr13: '#ef4b3a', shclr13_opacity: 100, shdclr13_opacity: 100,
      shclr14: '#cb3327', shdclr14: '#ef4b3a', shclr14_opacity: 100, shdclr14_opacity: 100,
    };
    const result = await saveSiteConfig('secondary_header_colors', VALID_SECONDARY_HEADER_COLORS, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(56);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'secondary_header_colors')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'shclr1')?.payload.valor,
    ).toBe('#cb3327');
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'shdclr13')?.payload.valor,
    ).toBe('#ef4b3a');
  });

  it('wrong type for intervalo returns a validation error and writes 0 rows', async () => {
    const result = await saveSiteConfig('hero', { ...VALID_HERO, intervalo: 'abc' }, 'token-123');

    expect(result.success).toBe(false);
    expect(result.errors?.length ?? 0).toBeGreaterThan(0);
    expect(supabaseMocks.upsertCalls).toHaveLength(0);
    // Only the admin check queried perfiles — configuracion_sitio was never touched
    expect(supabaseMocks.fromCalls).toEqual(['perfiles']);
  });

  it('footer social subset saves while missing instagram is accepted', async () => {
    const result = await saveSiteConfig('social.footer', SOCIAL_FOOTER_SUBSET, 'token-123');

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(4);
    expect(supabaseMocks.upsertCalls.map((c) => c.payload.clave).sort()).toEqual([
      'email',
      'google',
      'tiktok',
      'youtube',
    ]);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'social')).toBe(true);
  });

  it('rejects non-admin users before any row is written (verification unchanged)', async () => {
    supabaseMocks.setPerfilRolId(2);

    const result = await saveSiteConfig('hero', VALID_HERO, 'token-123');

    expect(result.success).toBe(false);
    expect(result.errors?.[0]).toContain('No autorizado');
    expect(supabaseMocks.upsertCalls).toHaveLength(0);
  });

  it('revalidates the site-config cache and the root layout after a successful save', async () => {
    const result = await saveSiteConfig('social.footer', SOCIAL_FOOTER_SUBSET, 'token-123');

    expect(result.success).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith('site-config', { expire: 60 });
    // The footer (contact consumer) renders on EVERY route via the root layout
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    expect(revalidatePath).not.toHaveBeenCalledWith('/');
  });

  it('contact.visit with only direccion upserts the same contact.direccion row as the contact schemaId (mirror)', async () => {
    // Save via the contact.visit partial (Inicio → Dirección y Mapa)
    const partialResult = await saveSiteConfig('contact.visit', { direccion: 'Nueva dirección 99' }, 'token-123');

    expect(partialResult.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(1);
    expect(supabaseMocks.upsertCalls[0].payload).toEqual(
      expect.objectContaining({
        categoria: 'contact',
        clave: 'direccion',
        valor: 'Nueva dirección 99',
        updated_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      }),
    );

    // Triangulation: saving via the contact schemaId (full category) lands on
    // the SAME (categoria, clave) row identity — the DB key is (contact, direccion).
    // contactSchema requires all 3 fields, so submit a full valid object.
    supabaseMocks.upsertCalls.length = 0;
    const fullResult = await saveSiteConfig(
      'contact',
      { sede_nombre: 'Sede Nua Mana', direccion: 'Nueva dirección 99', maps_embed: '' },
      'token-123',
    );

    expect(fullResult.success).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'direccion')?.payload.categoria,
    ).toBe('contact');
  });

  it('contact.visit with only maps_embed does NOT modify contact.direccion (partial upsert isolation)', async () => {
    const result = await saveSiteConfig(
      'contact.visit',
      { maps_embed: 'https://maps.google.com/new-embed' },
      'token-123',
    );

    expect(result.success).toBe(true);
    expect(supabaseMocks.upsertCalls).toHaveLength(1);
    expect(supabaseMocks.upsertCalls[0].payload.clave).toBe('maps_embed');
    expect(supabaseMocks.upsertCalls[0].payload.categoria).toBe('contact');
    // direccion row must NOT be touched by a maps_embed-only partial save
    expect(supabaseMocks.upsertCalls.map((c) => c.payload.clave)).not.toContain('direccion');
  });
});
