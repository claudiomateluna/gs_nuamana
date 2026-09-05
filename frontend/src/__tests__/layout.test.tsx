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

import RootLayout, { generateViewport } from '@/app/layout';

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
    // Config-driven override wins (clr7 saved as #ff0000, not the default #e9ecef)
    expect(css).toContain('--clr7:#ff0000');
    expect(css).not.toContain('--clr7:#e9ecef');
    // Other defaults still present
    expect(css).toContain('--clr1:#FFFFFF');
    expect(css).toContain('--dclr8:#2a2a2a');
    // Domain tokens (Tarjetas / Header) are emitted too
    expect(css).toContain('--tclr3:#2c3e50');
    expect(css).toContain('--hdclr11:#ef4b3a');

    // R1 dark roles: the .dark block of globals.css consumes these exact
    // defaults as --background (dclr1) and --foreground (dclr2). If a future
    // change re-bases the SSR values, this pin documents the approved values.
    expect(css).toContain('--dclr1:#121212');
    expect(css).toContain('--dclr2:#b0b0b0');

    // All 72 palette variables emitted exactly once (declaration form `${var}:`)
    const vars = [
      ...Array.from({ length: 8 }, (_, i) => `--clr${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `--dclr${i + 1}`),
      ...Array.from({ length: 6 }, (_, i) => `--tclr${i + 1}`),
      ...Array.from({ length: 6 }, (_, i) => `--tdclr${i + 1}`),
      ...Array.from({ length: 13 }, (_, i) => `--hclr${i + 1}`),
      ...Array.from({ length: 13 }, (_, i) => `--hdclr${i + 1}`),
      ...Array.from({ length: 11 }, (_, i) => `--mclr${i + 1}`),
      ...Array.from({ length: 11 }, (_, i) => `--mdclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} declaration should appear once`).toBe(1);
    }
  });

  it('renders eleven <style> tags: theme, header, menu, promo, slideshow, testimonials, visit, FAQ, SecondaryHeader, Footer and Panel color vars', async () => {
    const ui = await RootLayout({ children: <div data-testid="page-child">page</div> });
    const { container } = render(ui as React.ReactElement);

    const styles = container.querySelectorAll('style');
    expect(styles).toHaveLength(11);

    const themeCss = styles[0].textContent ?? '';
    const headerCss = styles[1].textContent ?? '';
    const menuCss = styles[2].textContent ?? '';
    const promoCss = styles[3].textContent ?? '';
    const slideshowCss = styles[4].textContent ?? '';
    const testimonialsCss = styles[5].textContent ?? '';
    const visitCss = styles[6].textContent ?? '';
    const faqCss = styles[7].textContent ?? '';
    const secondaryHeaderCss = styles[8].textContent ?? '';
    const footerCss = styles[9].textContent ?? '';
    const panelCss = styles[10].textContent ?? '';

    // Promo vars live exclusively in the second style, not the theme style
    expect(themeCss).not.toContain('--cbclr1');
    expect(promoCss).toContain(':root{');
    expect(promoCss).toContain('--cbclr1:#edf2f7');
    expect(promoCss).toContain('--cbclr6:#cb3327');
    expect(promoCss).toContain('--cbdclr8:#3c3c3c');
    // Promo block must not leak theme vars
    expect(promoCss).not.toContain('--clr7');
    // Slideshow vars live in the third style
    expect(slideshowCss).toContain(':root{');
    expect(slideshowCss).toContain('--bsclr1:#e9ecef');
    expect(slideshowCss).toContain('--bsdclr9:#3c3c3c');
    // Slideshow block must not leak theme or promo vars
    expect(slideshowCss).not.toContain('--clr7');
    expect(slideshowCss).not.toContain('--cbclr1');
    // Testimonials vars live in the fourth style
    expect(testimonialsCss).toContain(':root{');
    expect(testimonialsCss).toContain('--tsclr1:#e9ecef');
    expect(testimonialsCss).toContain('--tsdclr8:#3c3c3c');
    // Testimonials block must not leak theme, promo or slideshow vars
    expect(testimonialsCss).not.toContain('--clr7');
    expect(testimonialsCss).not.toContain('--cbclr1');
    expect(testimonialsCss).not.toContain('--bsclr1');
    // Visit vars live in the fifth style
    expect(visitCss).toContain(':root{');
    expect(visitCss).toContain('--vsclr1:#FFFFFF');
    expect(visitCss).toContain('--vsdclr9:#ffcf33');
    // Visit block must not leak theme, promo, slideshow or testimonials vars
    expect(visitCss).not.toContain('--clr7');
    expect(visitCss).not.toContain('--cbclr1');
    expect(visitCss).not.toContain('--bsclr1');
    expect(visitCss).not.toContain('--tsclr1');
    // FAQ vars live in the sixth style
    expect(faqCss).toContain(':root{');
    expect(faqCss).toContain('--fclr1:#e9ecef');
    expect(faqCss).toContain('--fclr2:#cb3327');
    expect(faqCss).toContain('--fdclr8:#ef4b3a');
    // FAQ block must not leak theme, promo, slideshow, testimonials or visit vars
    expect(faqCss).not.toContain('--clr7');
    expect(faqCss).not.toContain('--cbclr1');
    expect(faqCss).not.toContain('--bsclr1');
    expect(faqCss).not.toContain('--tsclr1');
    expect(faqCss).not.toContain('--vsclr1');
    // SecondaryHeader vars live in the seventh style
    expect(secondaryHeaderCss).toContain(':root{');
    expect(secondaryHeaderCss).toContain('--shclr1:#cb3327');
    expect(secondaryHeaderCss).toContain('--shclr13:#cb3327');
    expect(secondaryHeaderCss).toContain('--shdclr1:#FFFFFF');
    expect(secondaryHeaderCss).toContain('--shdclr13:#ef4b3a');
    // SecondaryHeader block must not leak theme, promo, slideshow, testimonials, visit or FAQ vars
    expect(secondaryHeaderCss).not.toContain('--clr7');
    expect(secondaryHeaderCss).not.toContain('--cbclr1');
    expect(secondaryHeaderCss).not.toContain('--bsclr1');
    expect(secondaryHeaderCss).not.toContain('--tsclr1');
    expect(secondaryHeaderCss).not.toContain('--vsclr1');
    expect(secondaryHeaderCss).not.toContain('--fclr1');
    // Footer vars live in the eighth style
    expect(footerCss).toContain(':root{');
    expect(footerCss).toContain('--foclr1:#FFFFFF');
    expect(footerCss).toContain('--foclr4:#cb3327');
    expect(footerCss).toContain('--fodclr1:#121212');
    expect(footerCss).toContain('--fodclr4:#b0b0b0');
    // Footer block must not leak theme, promo, slideshow, testimonials, visit, FAQ or SecondaryHeader vars
    expect(footerCss).not.toContain('--clr7');
    expect(footerCss).not.toContain('--cbclr1');
    expect(footerCss).not.toContain('--bsclr1');
    expect(footerCss).not.toContain('--tsclr1');
    expect(footerCss).not.toContain('--vsclr1');
    expect(footerCss).not.toContain('--fclr1');
    expect(footerCss).not.toContain('--shclr1');
    // Panel vars live in the eleventh style
    expect(panelCss).toContain(':root{');
    expect(panelCss).toContain('--pclr1:#FFFFFF');
    expect(panelCss).toContain('--pdclr1:#1e1e1e');
    expect(panelCss).not.toContain('--clr7');
    expect(panelCss).not.toContain('--cbclr1');
    expect(panelCss).not.toContain('--bsclr1');
    expect(panelCss).not.toContain('--tsclr1');
    expect(panelCss).not.toContain('--vsclr1');
    expect(panelCss).not.toContain('--fclr1');
    expect(panelCss).not.toContain('--shclr1');
    expect(panelCss).not.toContain('--foclr1');
  });

  it('derives the viewport themeColor from config.theme_colors.clr7 (no loose hardcoded color)', async () => {
    const vp = await generateViewport();

    expect(vp.themeColor).toBe('#ff0000');
    expect(vp.width).toBe('device-width');
  });
});