import { describe, it, expect, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mock — loadSiteConfig returns the canonical defaults with DISTINCT palette
// values so the manifest colors can only come from theme_colors, never from a
// hardcoded pwa/seo fallback. Same importActual pattern as layout.test.tsx.
// ---------------------------------------------------------------------------

vi.mock('@/lib/site-config', async () => {
  const actual = await vi.importActual<typeof import('@/lib/site-config')>('@/lib/site-config');
  return {
    ...actual,
    loadSiteConfig: async () => ({
      ...actual.DEFAULT_SITE_CONFIG,
      theme_colors: {
        ...actual.DEFAULT_SITE_CONFIG.theme_colors,
        clr1: '#112233',
        clr7: '#445566',
      },
    }),
  };
});

import manifest from '@/app/manifest';

describe('PWA manifest colors derive from the theme palette', () => {
  it('maps background_color to theme_colors.clr1 (page background) and theme_color to theme_colors.clr7 (accent)', async () => {
    const result = await manifest();

    expect(result.background_color).toBe('#112233');
    expect(result.theme_color).toBe('#445566');
  });

  it('keeps the PWA name, display and icons from config.pwa', async () => {
    const result = await manifest();

    expect(result.name).toBe('Guías y Scouts Nua Mana');
    expect(result.short_name).toBe('Nua Mana');
    expect(result.display).toBe('standalone');
    expect(result.start_url).toBe('/');
    expect(result.icons?.map((i) => i.src)).toEqual(['/icon-192x192.png', '/icon-512x512.png', '/icon-1024x1024.png']);
  });
});
