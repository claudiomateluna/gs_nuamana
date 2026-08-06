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
// schemaResolver — 15 ids (11 plain categories + 4 partials)
// ---------------------------------------------------------------------------

describe('schemaResolver', () => {
  it('covers exactly the 15 schema ids — 11 plain categories plus 4 partials', () => {
    expect(Object.keys(schemaResolver).sort()).toEqual([
      'branding',
      'branding.footer',
      'branding.header',
      'contact',
      'faq',
      'features',
      'hero',
      'navigation',
      'pwa',
      'seo',
      'social',
      'social.footer',
      'social.header',
      'testimonials',
      'visit',
    ]);
  });

  it('maps partial ids to their base categories and plain ids to themselves, each with a parseable schema', () => {
    expect(schemaResolver['branding.header']).toEqual({ category: 'branding', schema: brandingHeaderSchema });
    expect(schemaResolver['branding.footer']).toEqual({ category: 'branding', schema: brandingFooterSchema });
    expect(schemaResolver['social.header']).toEqual({ category: 'social', schema: socialHeaderSchema });
    expect(schemaResolver['social.footer']).toEqual({ category: 'social', schema: socialFooterSchema });

    for (const [id, resolved] of Object.entries(schemaResolver)) {
      if (id === 'branding.header' || id === 'branding.footer') {
        expect(resolved.category).toBe('branding');
      } else if (id === 'social.header' || id === 'social.footer') {
        expect(resolved.category).toBe('social');
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
    expect(supabaseMocks.upsertCalls.map((c) => c.payload.clave).sort()).toEqual([
      'bottom_count',
      'fondo',
      'frases',
      'imagenes_pool',
      'intervalo',
      'top_count',
    ]);
    expect(supabaseMocks.upsertCalls.every((c) => c.payload.categoria === 'hero')).toBe(true);
    expect(
      supabaseMocks.upsertCalls.find((c) => c.payload.clave === 'frases')?.payload.valor,
    ).toEqual(VALID_HERO.frases);
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
});
