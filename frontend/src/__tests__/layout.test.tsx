import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Infra mocks — fonts, providers, Footer and Toaster are IO/infra boundaries,
// not the logic under test. The logic (CSS string generation) is extracted and
// unit-tested in theme-css.test.ts; this integration test only proves the
// wiring: RootLayout renders a <style> tag from config.theme_colors as the
// first child of <body> before ThemeProvider.
// ---------------------------------------------------------------------------

vi.mock('next/font/google', () => ({
  Inika: () => ({ variable: '--font-inika' }),
  Quicksand: () => ({ variable: '--font-quicksand' }),
  Roboto_Slab: () => ({ variable: '--font-roboto-slab' }),
}));

vi.mock('@/contexts/theme-context', () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/contexts/site-config-context', () => ({
  SiteConfigProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/footer', () => ({ default: () => <div data-testid="footer-mock" /> }));
vi.mock('sonner', () => ({ Toaster: () => null }));

vi.mock('@/lib/site-config', async () => {
  const actual = await vi.importActual<typeof import('@/lib/site-config')>('@/lib/site-config');
  return {
    ...actual,
    loadSiteConfig: async () => ({
      ...actual.DEFAULT_SITE_CONFIG,
      theme_colors: { ...actual.DEFAULT_SITE_CONFIG.theme_colors, clr7: '#ff0000' },
    }),
  };
});

import RootLayout from '@/app/layout';

describe('RootLayout SSR theme style injection', () => {
  it('renders a <style> tag as the first child of <body> containing config theme vars', async () => {
    const ui = await RootLayout({ children: <div data-testid="page-child">page</div> });
    const { container } = render(ui as React.ReactElement);

    const style = container.querySelector('style');
    expect(style, 'body must contain a <style> tag').not.toBeNull();
    if (!style) throw new Error('expected a <style> tag in the rendered layout');

    // The <style> is the first child of its parent (<body>), rendered BEFORE
    // ThemeProvider/children — jsdom does not expose a nested <body> reliably,
    // so we assert against the style's real parent element instead.
    const styleParent = style.parentElement;
    if (!styleParent) throw new Error('expected <style> to have a parent element');
    expect(styleParent.firstElementChild).toBe(style);

    const css = style.textContent ?? '';
    // Config-driven override wins (clr7 saved as #ff0000, not the default #cb3327)
    expect(css).toContain('--clr7:#ff0000');
    expect(css).not.toContain('--clr7:#cb3327');
    // Other defaults still present
    expect(css).toContain('--clr1:#FFFFFF');
    expect(css).toContain('--dclr8:#ffcf33');
    // Gradient stop roles (R1) are emitted too
    expect(css).toContain('--clr11:#2c3e50');
    expect(css).toContain('--dclr12:#ef4b3a');

    // All 24 palette variables emitted exactly once (declaration form `${var}:`)
    const vars = [
      ...Array.from({ length: 12 }, (_, i) => `--clr${i + 1}`),
      ...Array.from({ length: 12 }, (_, i) => `--dclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} declaration should appear once`).toBe(1);
    }
  });
});