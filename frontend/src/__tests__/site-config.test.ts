import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
// @supabase/supabase-js: chainable builder returning injectable rows/errors.
// next/cache: unstable_cache pass-through WITH memoization keyed by the cache
// key list — a second call within the TTL must NOT hit the database again
// (proves cache identity instead of merely asserting call args).

type ConfigRow = { categoria: string; clave: string; valor: unknown };

const supabaseMocks = vi.hoisted(() => {
  const createClient = vi.fn();
  const fromCalls: string[] = [];
  let selectResult: { data: ConfigRow[] | null; error: { message: string } | null } = {
    data: [],
    error: null,
  };

  const chain = {
    select: vi.fn(function (this: unknown) {
      return this;
    }),
    order: vi.fn(async function (this: unknown) {
      return selectResult;
    }),
  };

  const client = {
    from: vi.fn((table: string) => {
      fromCalls.push(table);
      return chain;
    }),
  };

  createClient.mockReturnValue(client);

  return {
    createClient,
    fromCalls,
    setData: (rows: ConfigRow[]) => {
      selectResult = { data: rows, error: null };
    },
    setError: (message: string) => {
      selectResult = { data: null, error: { message } };
    },
    reset: () => {
      fromCalls.length = 0;
      selectResult = { data: [], error: null };
    },
  };
});

const cacheMocks = vi.hoisted(() => {
  const unstableCache = vi.fn();
  const memo = new Map<string, unknown>();
  unstableCache.mockImplementation(
    (
      fn: (...args: unknown[]) => Promise<unknown>,
      keys: string[],
      _opts?: { tags?: string[]; revalidate?: number },
    ) => {
      return async (...args: unknown[]) => {
        const key = keys.join('::');
        if (memo.has(key)) return memo.get(key);
        const result = await fn(...args);
        memo.set(key, result);
        return result;
      };
    },
  );
  return {
    unstableCache,
    // The cache wrapper is created ONCE at module scope (unstable_cache call
    // must not be cleared — assertions target that import-time call). Only the
    // memo needs resetting for per-test isolation.
    reset: () => {
      memo.clear();
    },
  };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: supabaseMocks.createClient,
}));

vi.mock('next/cache', () => ({
  unstable_cache: cacheMocks.unstableCache,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Imports — under test
// ---------------------------------------------------------------------------

import { loadSiteConfig, loadConfigCategory, DEFAULT_SITE_CONFIG } from '@/lib/site-config';

beforeEach(() => {
  supabaseMocks.reset();
  cacheMocks.reset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Cache identity — unstable_cache wrapper (tags + TTL) and memoized reads
// ---------------------------------------------------------------------------

describe('loadSiteConfig cache identity (unstable_cache)', () => {
  it('wraps fetchAllConfig with cache key site-config-all, tags site-config and revalidate 60', async () => {
    supabaseMocks.setData([{ categoria: 'branding', clave: 'pretitulo', valor: 'Nuevo pretitulo' }]);

    await loadSiteConfig();

    expect(cacheMocks.unstableCache).toHaveBeenCalledTimes(1);
    expect(cacheMocks.unstableCache).toHaveBeenCalledWith(
      expect.any(Function),
      ['site-config-all'],
      expect.objectContaining({ tags: ['site-config'], revalidate: 60 }),
    );
  });

  it('serves the second request from cache — only one Supabase fetch within the 60s TTL', async () => {
    supabaseMocks.setData([{ categoria: 'branding', clave: 'pretitulo', valor: 'Nuevo pretitulo' }]);

    const first = await loadSiteConfig();
    const second = await loadSiteConfig();

    // Without unstable_cache the current code fetches twice — this is the RED.
    expect(supabaseMocks.fromCalls).toHaveLength(1);
    expect(second).toEqual(first);
    expect(second.branding.pretitulo).toBe('Nuevo pretitulo');
  });
});

// ---------------------------------------------------------------------------
// Fetch error → defaults + warning log
// ---------------------------------------------------------------------------

describe('fetch error falls back to defaults', () => {
  it('returns DEFAULT_SITE_CONFIG and logs a warning when Supabase fails', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    supabaseMocks.setError('connection refused');

    const config = await loadSiteConfig();

    expect(config).toEqual(DEFAULT_SITE_CONFIG);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[site-config]'),
      expect.stringContaining('connection refused'),
    );
  });
});

// ---------------------------------------------------------------------------
// DB merge overrides defaults (keys present in DB win; defaults fill gaps)
// ---------------------------------------------------------------------------

describe('DB merge overrides defaults', () => {
  it('overrides only keys present in the DB; defaults fill the rest', async () => {
    supabaseMocks.setData([
      { categoria: 'branding', clave: 'pretitulo', valor: 'Nuevo pretitulo' },
      { categoria: 'seo', clave: 'title', valor: 'Título desde la BD' },
      { categoria: 'hero', clave: 'intervalo', valor: 7500 },
    ]);

    const config = await loadSiteConfig();

    expect(config.branding.pretitulo).toBe('Nuevo pretitulo');
    // Key not present in the DB must keep its default
    expect(config.branding.nombre_grupo).toBe(DEFAULT_SITE_CONFIG.branding.nombre_grupo);
    expect(config.seo.title).toBe('Título desde la BD');
    expect(config.hero.intervalo).toBe(7500);
    expect(config.hero.fondo).toBe(DEFAULT_SITE_CONFIG.hero.fondo);
  });

  it('loadConfigCategory merges a single category over its defaults', async () => {
    supabaseMocks.setData([{ categoria: 'hero', clave: 'intervalo', valor: 7500 }]);

    const hero = await loadConfigCategory('hero', DEFAULT_SITE_CONFIG.hero);

    expect(hero.intervalo).toBe(7500);
    expect(hero.fondo).toBe(DEFAULT_SITE_CONFIG.hero.fondo);
    expect(hero.top_count).toBe(DEFAULT_SITE_CONFIG.hero.top_count);
  });
});
