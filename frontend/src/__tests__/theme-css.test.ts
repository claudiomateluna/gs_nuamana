import { describe, it, expect } from 'vitest';
import { generateThemeCSS, generatePromoColorsCSS, generateSlideshowColorsCSS, generateTestimonialsColorsCSS, generateVisitColorsCSS, generateFAQColorsCSS, generateSecondaryHeaderColorsCSS, generateFooterColorsCSS } from '@/lib/theme-css';
import { DEFAULT_SITE_CONFIG } from '@/lib/site-config';
import type { ThemeColorsConfig } from '@/lib/site-config.types';

const DEFAULTS: ThemeColorsConfig = { ...DEFAULT_SITE_CONFIG.theme_colors };

describe('generateThemeCSS', () => {
  it('emits a minified :root block with all 80 default variables in VAR_ORDER', () => {
    const css = generateThemeCSS(DEFAULTS);
    expect(css).toBe(
      ':root{--clr1:#FFFFFF;--clr2:#1d1d1d;--clr3:#95a5a6;--clr4:#cb3327;--clr5:#ffc41d;--clr6:#3eb34b;--clr7:#e9ecef;--clr8:#d4d4d8;--clr9:#FFFFFF;--clr10:#cb3327;--dclr1:#121212;--dclr2:#b0b0b0;--dclr3:#8a8a8a;--dclr4:#ef4b3a;--dclr5:#ffcf33;--dclr6:#33a345;--dclr7:#3c3c3c;--dclr8:#2a2a2a;--dclr9:#121212;--dclr10:#ef4b3a;--tclr1:#FFFFFF;--tclr2:#f8f9fa;--tclr3:#2c3e50;--tclr4:#cb3327;--tclr5:#2c3e50;--tclr6:#333333;--tdclr1:#1e1e1e;--tdclr2:#26262b;--tdclr3:#d0d0d0;--tdclr4:#ef4b3a;--tdclr5:#33506f;--tdclr6:#b0b0b0;--hclr1:#cb3327;--hclr2:#ffc41d;--hclr3:#95a5a6;--hclr4:#cb3327;--hclr5:#1d1d1d;--hclr6:#f8f9fa;--hclr7:#cb3327;--hclr8:#333333;--hclr9:#cb3327;--hclr10:#2c3e50;--hclr11:#cb3327;--hclr12:#2c3e50;--hclr13:#cb3327;--hdclr1:#FFFFFF;--hdclr2:#ffcf33;--hdclr3:#8a8a8a;--hdclr4:#ef4b3a;--hdclr5:#ffcf33;--hdclr6:#26262b;--hdclr7:#ffcf33;--hdclr8:#b0b0b0;--hdclr9:#ef4b3a;--hdclr10:#33506f;--hdclr11:#ef4b3a;--hdclr12:#33506f;--hdclr13:#ef4b3a;--mclr1:#FFFFFF;--mclr2:#95a5a6;--mclr3:#2c3e50;--mclr4:#cb3327;--mclr5:#cb3327;--mclr6:#cb3327;--mclr7:#1d1d1d;--mclr8:#cb3327;--mclr9:#1d1d1d;--mclr10:#e9ecef;--mclr11:#cb3327;--mdclr1:#33506f;--mdclr2:#ef4b3a;--mdclr3:#b0b0b0;--mdclr4:#ef4b3a;--mdclr5:#ef4b3a;--mdclr6:#ef4b3a;--mdclr7:#b0b0b0;--mdclr8:#ef4b3a;--mdclr9:#ffcf33;--mdclr10:#3c3c3c;--mdclr11:#ef4b3a;}',
    );
  });

  it('reflects a custom clr4 override instead of the default', () => {
    const custom = { ...DEFAULTS, clr4: '#ff0000' };
    const css = generateThemeCSS(custom);
    expect(css).toContain('--clr4:#ff0000');
    expect(css).not.toContain('--clr4:#cb3327');
    // All other vars remain unchanged
    expect(css).toContain('--dclr8:#2a2a2a');
    expect(css).toContain('--clr1:#FFFFFF');
  });

  it('always wraps the block in :root{...} and emits each of the 80 variable names exactly once', () => {
    const css = generateThemeCSS(DEFAULTS);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 10 }, (_, i) => `--clr${i + 1}`),
      ...Array.from({ length: 10 }, (_, i) => `--dclr${i + 1}`),
      ...Array.from({ length: 6 }, (_, i) => `--tclr${i + 1}`),
      ...Array.from({ length: 6 }, (_, i) => `--tdclr${i + 1}`),
      ...Array.from({ length: 13 }, (_, i) => `--hclr${i + 1}`),
      ...Array.from({ length: 13 }, (_, i) => `--hdclr${i + 1}`),
      ...Array.from({ length: 11 }, (_, i) => `--mclr${i + 1}`),
      ...Array.from({ length: 11 }, (_, i) => `--mdclr${i + 1}`),
    ];
    for (const v of vars) {
      // Append ':' so '--clr1:' does not match inside '--clr10:'.
      // '--clr4-opacity:' does not match '--clr4:' either — opacity vars are additive.
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });

  // --- opacity → rgba emission ---

  it('emits plain hex when opacity is 100 (no rgba)', () => {
    const theme = { ...DEFAULTS, clr5_opacity: 100 } as ThemeColorsConfig;
    const css = generateThemeCSS(theme);
    expect(css).toContain('--clr5:#ffc41d');
    expect(css).not.toContain('rgba(255, 196, 29, 1)');
  });

  it('emits rgba(255, 196, 29, 0.9) when clr5_opacity is 90', () => {
    const theme = { ...DEFAULTS, clr5_opacity: 90 } as ThemeColorsConfig;
    const css = generateThemeCSS(theme);
    expect(css).toContain('--clr5:rgba(255, 196, 29, 0.9)');
    expect(css).not.toContain('--clr5:#ffc41d');
    expect(css).not.toContain('--clr5-opacity');
  });

  it('emits rgba(255, 196, 29, 0) when clr5_opacity is 0', () => {
    const theme = { ...DEFAULTS, clr5_opacity: 0 } as ThemeColorsConfig;
    const css = generateThemeCSS(theme);
    expect(css).toContain('--clr5:rgba(255, 196, 29, 0)');
    expect(css).not.toContain('--clr5-opacity');
  });

  it('emits plain hex when opacity is undefined (pre-migration rows)', () => {
    const theme = { ...DEFAULTS } as ThemeColorsConfig;
    delete (theme as unknown as Record<string, unknown>).clr5_opacity;
    const css = generateThemeCSS(theme);
    expect(css).toContain('--clr5:#ffc41d');
    expect(css).not.toContain('rgba');
  });

  it('passes lowercase hex through rgba conversion', () => {
    const theme = { ...DEFAULTS, tclr3: '#2c3e50', tclr3_opacity: 50 } as ThemeColorsConfig;
    const css = generateThemeCSS(theme);
    expect(css).toContain('--tclr3:rgba(44, 62, 80, 0.5)');
    expect(css).not.toContain('--tclr3-opacity');
  });

  it('opacity < 100 emits rgba directly in the CSS variable', () => {
    // 50 → rgba(203, 51, 39, 0.5)
    const fifty = generateThemeCSS({ ...DEFAULTS, clr4_opacity: 50 } as ThemeColorsConfig);
    expect(fifty).toContain('--clr4:rgba(203, 51, 39, 0.5)');
    expect(fifty).not.toContain('--clr4-opacity');
    expect(fifty).not.toContain('--clr4:#cb3327');

    // 0 → rgba(203, 51, 39, 0)
    const zero = generateThemeCSS({ ...DEFAULTS, clr4_opacity: 0 } as ThemeColorsConfig);
    expect(zero).toContain('--clr4:rgba(203, 51, 39, 0)');
    expect(zero).not.toContain('--clr4-opacity');

    // undefined → hex only
    const undef = { ...DEFAULTS } as ThemeColorsConfig;
    delete (undef as unknown as Record<string, unknown>).clr4_opacity;
    const undefCss = generateThemeCSS(undef);
    expect(undefCss).toContain('--clr4:#cb3327');
    expect(undefCss).not.toContain('rgba');
    expect(undefCss).not.toContain('--clr4-opacity');

    // 100 → hex only
    const hundred = generateThemeCSS({ ...DEFAULTS, clr4_opacity: 100 } as ThemeColorsConfig);
    expect(hundred).toContain('--clr4:#cb3327');
    expect(hundred).not.toContain('rgba');
    expect(hundred).not.toContain('--clr4-opacity');
  });

  it('admin opacity emits rgba in the CSS variable (consumed by Tailwind utilities)', () => {
    const css = generateThemeCSS({ ...DEFAULTS, clr4: '#cb3327', clr4_opacity: 50 } as ThemeColorsConfig);
    expect(css).toContain('--clr4:rgba(203, 51, 39, 0.5)');
    expect(css).not.toContain('--clr4:#cb3327');
    expect(css).not.toContain('--clr4-opacity');
  });

  it('exposes the rgba custom property through getComputedStyle', () => {
    const css = generateThemeCSS({ ...DEFAULTS, clr4: '#cb3327', clr4_opacity: 50 } as ThemeColorsConfig);
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    try {
      const computed = getComputedStyle(document.documentElement);
      expect(computed.getPropertyValue('--clr4').trim()).toBe('rgba(203,51,39,0.5)');
    } finally {
      document.head.removeChild(style);
    }
  });
});

// ---------------------------------------------------------------------------
// generatePromoColorsCSS — CategoryPromoBanner (cbclr1-9 / cbdclr1-9)
// ---------------------------------------------------------------------------

describe('generatePromoColorsCSS', () => {
  const PROMO = DEFAULT_SITE_CONFIG.promo_colors;

  it('emits a minified :root block with all 18 default promo variables in role order', () => {
    const css = generatePromoColorsCSS(PROMO);
    expect(css).toBe(
      ':root{--cbclr1:#edf2f7;--cbclr2:#e2e8f0;--cbclr3:#cbd5e0;--cbclr4:#2c3e50;--cbclr5:#4a5568;--cbclr6:#cb3327;--cbclr7:#2c3e50;--cbclr8:#e9ecef;--cbclr9:#FFFFFF;--cbdclr1:#1a202c;--cbdclr2:#2d3748;--cbdclr3:#4a5568;--cbdclr4:#f7fafc;--cbdclr5:#e2e8f0;--cbdclr6:#ef4b3a;--cbdclr7:#33506f;--cbdclr8:#3c3c3c;--cbdclr9:#121212;}',
    );
  });

  it('reflects a custom cbclr6 override instead of the default', () => {
    const css = generatePromoColorsCSS({ ...PROMO, cbclr6: '#ff0000' });
    expect(css).toContain('--cbclr6:#ff0000');
    expect(css).not.toContain('--cbclr6:#cb3327');
  });

  it('always wraps in :root{...} and emits each of the 18 variable names exactly once', () => {
    const css = generatePromoColorsCSS(PROMO);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 9 }, (_, i) => `--cbclr${i + 1}`),
      ...Array.from({ length: 9 }, (_, i) => `--cbdclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });

  it('emits an empty declaration per missing hex (partial DB row keeps the count honest)', () => {
    const expected =
      ':root{' +
      ['cbclr1','cbclr2','cbclr3','cbclr4','cbclr5','cbclr6','cbclr7','cbclr8','cbclr9',
       'cbdclr1','cbdclr2','cbdclr3','cbdclr4','cbdclr5','cbdclr6','cbdclr7','cbdclr8','cbdclr9']
        .map((k) => `--${k}:`)
        .join(';') +
      ';}';
    expect(generatePromoColorsCSS({})).toBe(expected);
  });

  it('emits rgba when opacity < 100 (admin transparency applied to the CSS variable)', () => {
    const css = generatePromoColorsCSS({ ...PROMO, cbclr6_opacity: 50 });
    expect(css).toContain('--cbclr6:rgba(203, 51, 39, 0.5)');
    expect(css).not.toContain('--cbclr6-opacity');
    // opacity 100 → hex
    expect(generatePromoColorsCSS(PROMO)).not.toContain('rgba');
  });
});

// ---------------------------------------------------------------------------
// generateSlideshowColorsCSS — BlogSlideshow (bsclr1-9 / bsdclr1-9)
// ---------------------------------------------------------------------------

describe('generateSlideshowColorsCSS', () => {
  const SLIDESHOW = DEFAULT_SITE_CONFIG.slideshow_colors;

  it('emits a minified :root block with all 18 default slideshow variables in role order', () => {
    const css = generateSlideshowColorsCSS(SLIDESHOW);
    expect(css).toBe(
      ':root{--bsclr1:#e9ecef;--bsclr2:#b0b0b0;--bsclr3:#95a5a6;--bsclr4:#cb3327;--bsclr5:#1d1d1d;--bsclr6:rgba(29, 29, 29, 0.2);--bsclr7:#cb3327;--bsclr8:#FFFFFF;--bsclr9:#e9ecef;--bsdclr1:#121212;--bsdclr2:#b0b0b0;--bsdclr3:#95a5a6;--bsdclr4:#cb3327;--bsdclr5:#121212;--bsdclr6:rgba(18, 18, 18, 0.2);--bsdclr7:#ef4b3a;--bsdclr8:#FFFFFF;--bsdclr9:#3c3c3c;}',
    );
  });

  it('reflects a custom bsclr4 override instead of the default', () => {
    const css = generateSlideshowColorsCSS({ ...SLIDESHOW, bsclr4: '#ff0000' });
    expect(css).toContain('--bsclr4:#ff0000');
    expect(css).not.toContain('--bsclr4:#cb3327');
  });

  it('always wraps in :root{...} and emits each of the 18 variable names exactly once', () => {
    const css = generateSlideshowColorsCSS(SLIDESHOW);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 9 }, (_, i) => `--bsclr${i + 1}`),
      ...Array.from({ length: 9 }, (_, i) => `--bsdclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });

  it('emits an empty declaration per missing hex (partial DB row keeps the count honest)', () => {
    const expected =
      ':root{' +
      ['bsclr1','bsclr2','bsclr3','bsclr4','bsclr5','bsclr6','bsclr7','bsclr8','bsclr9',
       'bsdclr1','bsdclr2','bsdclr3','bsdclr4','bsdclr5','bsdclr6','bsdclr7','bsdclr8','bsdclr9']
        .map((k) => `--${k}:`)
        .join(';') +
      ';}';
    expect(generateSlideshowColorsCSS({})).toBe(expected);
  });

  it('emits rgba when opacity < 100 (admin transparency applied to the CSS variable)', () => {
    const css = generateSlideshowColorsCSS({ ...SLIDESHOW, bsclr5_opacity: 50 });
    expect(css).toContain('--bsclr5:rgba(29, 29, 29, 0.5)');
    expect(css).not.toContain('--bsclr5-opacity');
    // opacity 100 → hex (check a var that has opacity 100)
    const defaultCss = generateSlideshowColorsCSS(SLIDESHOW);
    expect(defaultCss).toContain('--bsclr1:#e9ecef');
    expect(defaultCss).not.toContain('--bsclr1:rgba');
  });
});

// ---------------------------------------------------------------------------
// generateTestimonialsColorsCSS — Testimonials (tsclr1-8 / tsdclr1-8)
// ---------------------------------------------------------------------------

describe('generateTestimonialsColorsCSS', () => {
  const TESTIMONIALS = DEFAULT_SITE_CONFIG.testimonials_colors;

  it('emits a minified :root block with all 16 default testimonials variables in role order', () => {
    const css = generateTestimonialsColorsCSS(TESTIMONIALS);
    expect(css).toBe(
      ':root{--tsclr1:#e9ecef;--tsclr2:#cb3327;--tsclr3:#1d1d1d;--tsclr4:#FFFFFF;--tsclr5:#1d1d1d;--tsclr6:#95a5a6;--tsclr7:#cb3327;--tsclr8:#e9ecef;--tsdclr1:#3c3c3c;--tsdclr2:#ef4b3a;--tsdclr3:#b0b0b0;--tsdclr4:#121212;--tsdclr5:#b0b0b0;--tsdclr6:#8a8a8a;--tsdclr7:#ef4b3a;--tsdclr8:#3c3c3c;}',
    );
  });

  it('reflects a custom tsclr2 override instead of the default', () => {
    const css = generateTestimonialsColorsCSS({ ...TESTIMONIALS, tsclr2: '#ff0000' });
    expect(css).toContain('--tsclr2:#ff0000');
    expect(css).not.toContain('--tsclr2:#cb3327');
  });

  it('always wraps in :root{...} and emits each of the 16 variable names exactly once', () => {
    const css = generateTestimonialsColorsCSS(TESTIMONIALS);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 8 }, (_, i) => `--tsclr${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `--tsdclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });

  it('emits an empty declaration per missing hex (partial DB row keeps the count honest)', () => {
    const expected =
      ':root{' +
      ['tsclr1','tsclr2','tsclr3','tsclr4','tsclr5','tsclr6','tsclr7','tsclr8',
       'tsdclr1','tsdclr2','tsdclr3','tsdclr4','tsdclr5','tsdclr6','tsdclr7','tsdclr8']
        .map((k) => `--${k}:`)
        .join(';') +
      ';}';
    expect(generateTestimonialsColorsCSS({})).toBe(expected);
  });

  it('emits rgba when opacity < 100 (admin transparency applied to the CSS variable)', () => {
    const css = generateTestimonialsColorsCSS({ ...TESTIMONIALS, tsclr2_opacity: 50 });
    expect(css).toContain('--tsclr2:rgba(203, 51, 39, 0.5)');
    expect(css).not.toContain('--tsclr2-opacity');
    // opacity 100 → hex
    expect(generateTestimonialsColorsCSS(TESTIMONIALS)).not.toContain('rgba');
  });
});

// ---------------------------------------------------------------------------
// generateVisitColorsCSS — VisitSection (vsclr1-9 / vsdclr1-9)
// ---------------------------------------------------------------------------

describe('generateVisitColorsCSS', () => {
  const VISIT = DEFAULT_SITE_CONFIG.visit_colors;

  it('emits a minified :root block with all 18 default visit variables in role order', () => {
    const css = generateVisitColorsCSS(VISIT);
    expect(css).toBe(
      ':root{--vsclr1:#FFFFFF;--vsclr2:#cb3327;--vsclr3:#FFFFFF;--vsclr4:#f8f9fa;--vsclr5:#33a345;--vsclr6:#333333;--vsclr7:#FFFFFF;--vsclr8:#e9ecef;--vsclr9:#ffc41d;--vsdclr1:#121212;--vsdclr2:#ef4b3a;--vsdclr3:#1e1e1e;--vsdclr4:#26262b;--vsdclr5:#33a345;--vsdclr6:#b0b0b0;--vsdclr7:#121212;--vsdclr8:#3c3c3c;--vsdclr9:#ffcf33;}',
    );
  });

  it('reflects a custom vsclr2 override instead of the default', () => {
    const css = generateVisitColorsCSS({ ...VISIT, vsclr2: '#ff0000' });
    expect(css).toContain('--vsclr2:#ff0000');
    expect(css).not.toContain('--vsclr2:#cb3327');
  });

  it('always wraps in :root{...} and emits each of the 18 variable names exactly once', () => {
    const css = generateVisitColorsCSS(VISIT);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 9 }, (_, i) => `--vsclr${i + 1}`),
      ...Array.from({ length: 9 }, (_, i) => `--vsdclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });

  it('emits an empty declaration per missing hex (partial DB row keeps the count honest)', () => {
    const expected =
      ':root{' +
      ['vsclr1','vsclr2','vsclr3','vsclr4','vsclr5','vsclr6','vsclr7','vsclr8','vsclr9',
       'vsdclr1','vsdclr2','vsdclr3','vsdclr4','vsdclr5','vsdclr6','vsdclr7','vsdclr8','vsdclr9']
        .map((k) => `--${k}:`)
        .join(';') +
      ';}';
    expect(generateVisitColorsCSS({})).toBe(expected);
  });

  it('emits rgba when opacity < 100 (admin transparency applied to the CSS variable)', () => {
    const css = generateVisitColorsCSS({ ...VISIT, vsclr2_opacity: 50 });
    expect(css).toContain('--vsclr2:rgba(203, 51, 39, 0.5)');
    expect(css).not.toContain('--vsclr2-opacity');
    // opacity 100 → hex
    expect(generateVisitColorsCSS(VISIT)).not.toContain('rgba');
  });
});

// ---------------------------------------------------------------------------
// generateFAQColorsCSS — FAQ (fclr1-8 / fdclr1-8)
// ---------------------------------------------------------------------------

describe('generateFAQColorsCSS', () => {
  const FAQ = DEFAULT_SITE_CONFIG.faq_colors;

  it('emits a minified :root block with all 16 default FAQ variables in role order', () => {
    const css = generateFAQColorsCSS(FAQ);
    expect(css).toBe(
      ':root{--fclr1:#e9ecef;--fclr2:#cb3327;--fclr3:#95a5a6;--fclr4:#FFFFFF;--fclr5:#cb3327;--fclr6:#1d1d1d;--fclr7:#e9ecef;--fclr8:#cb3327;--fdclr1:#3c3c3c;--fdclr2:#ef4b3a;--fdclr3:#8a8a8a;--fdclr4:#121212;--fdclr5:#ef4b3a;--fdclr6:#b0b0b0;--fdclr7:#3c3c3c;--fdclr8:#ef4b3a;}',
    );
  });

  it('reflects a custom fclr2 override instead of the default', () => {
    const css = generateFAQColorsCSS({ ...FAQ, fclr2: '#ff0000' });
    expect(css).toContain('--fclr2:#ff0000');
    expect(css).not.toContain('--fclr2:#cb3327');
  });

  it('always wraps in :root{...} and emits each of the 16 variable names exactly once', () => {
    const css = generateFAQColorsCSS(FAQ);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 8 }, (_, i) => `--fclr${i + 1}`),
      ...Array.from({ length: 8 }, (_, i) => `--fdclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });

  it('emits an empty declaration per missing hex (partial DB row keeps the count honest)', () => {
    const expected =
      ':root{' +
      ['fclr1','fclr2','fclr3','fclr4','fclr5','fclr6','fclr7','fclr8',
       'fdclr1','fdclr2','fdclr3','fdclr4','fdclr5','fdclr6','fdclr7','fdclr8']
        .map((k) => `--${k}:`)
        .join(';') +
      ';}';
    expect(generateFAQColorsCSS({})).toBe(expected);
  });

  it('emits rgba when opacity < 100 (admin transparency applied to the CSS variable)', () => {
    const css = generateFAQColorsCSS({ ...FAQ, fclr2_opacity: 50 });
    expect(css).toContain('--fclr2:rgba(203, 51, 39, 0.5)');
    expect(css).not.toContain('--fclr2-opacity');
    // opacity 100 → hex
    expect(generateFAQColorsCSS(FAQ)).not.toContain('rgba');
  });
});

// ---------------------------------------------------------------------------
// generateSecondaryHeaderColorsCSS — SecondaryHeader (shclr1-14 / shdclr1-14)
// ---------------------------------------------------------------------------

describe('generateSecondaryHeaderColorsCSS', () => {
  const SH = DEFAULT_SITE_CONFIG.secondary_header_colors;

  it('emits a minified :root block with all 28 default SecondaryHeader variables in role order', () => {
    const css = generateSecondaryHeaderColorsCSS(SH);
    expect(css).toBe(
      ':root{--shclr1:#cb3327;--shclr2:#ffc41d;--shclr3:#95a5a6;--shclr4:#cb3327;--shclr5:#1d1d1d;--shclr6:#f8f9fa;--shclr7:#cb3327;--shclr8:#333333;--shclr9:#cb3327;--shclr10:#2c3e50;--shclr11:#cb3327;--shclr12:#2c3e50;--shclr13:#cb3327;--shclr14:#cb3327;--shdclr1:#FFFFFF;--shdclr2:#ffcf33;--shdclr3:#8a8a8a;--shdclr4:#ef4b3a;--shdclr5:#ffcf33;--shdclr6:#26262b;--shdclr7:#ffcf33;--shdclr8:#b0b0b0;--shdclr9:#ef4b3a;--shdclr10:#b0b0b0;--shdclr11:#ef4b3a;--shdclr12:#33506f;--shdclr13:#ef4b3a;--shdclr14:#ef4b3a;}',
    );
  });

  it('reflects a custom shclr4 override instead of the default', () => {
    const css = generateSecondaryHeaderColorsCSS({ ...SH, shclr4: '#ff0000' });
    expect(css).toContain('--shclr4:#ff0000');
    expect(css).not.toContain('--shclr4:#cb3327');
  });

  it('always wraps in :root{...} and emits each of the 28 variable names exactly once', () => {
    const css = generateSecondaryHeaderColorsCSS(SH);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 14 }, (_, i) => `--shclr${i + 1}`),
      ...Array.from({ length: 14 }, (_, i) => `--shdclr${i + 1}`),
    ];
    for (const v of vars) {
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });

  it('emits plain hex when opacity is 100 (no rgba)', () => {
    const css = generateSecondaryHeaderColorsCSS({ ...SH, shclr5_opacity: 100 });
    expect(css).toContain('--shclr5:#1d1d1d');
    expect(css).not.toContain('rgba');
  });

  it('emits rgba(29, 29, 29, 0.9) when shclr5_opacity is 90', () => {
    const css = generateSecondaryHeaderColorsCSS({ ...SH, shclr5_opacity: 90 });
    expect(css).toContain('--shclr5:rgba(29, 29, 29, 0.9)');
    expect(css).not.toContain('--shclr5-opacity');
  });

  it('emits rgba(38, 38, 43, 0) when shdclr6_opacity is 0', () => {
    const css = generateSecondaryHeaderColorsCSS({ ...SH, shdclr6_opacity: 0 });
    expect(css).toContain('--shdclr6:rgba(38, 38, 43, 0)');
    expect(css).not.toContain('--shdclr6-opacity');
  });

  it('emits an empty declaration per missing hex (partial DB row keeps the count honest)', () => {
    const expected =
      ':root{' +
       ['shclr1','shclr2','shclr3','shclr4','shclr5','shclr6','shclr7','shclr8','shclr9','shclr10','shclr11','shclr12','shclr13','shclr14',
        'shdclr1','shdclr2','shdclr3','shdclr4','shdclr5','shdclr6','shdclr7','shdclr8','shdclr9','shdclr10','shdclr11','shdclr12','shdclr13','shdclr14']
        .map((k) => `--${k}:`)
        .join(';') +
      ';}';
    expect(generateSecondaryHeaderColorsCSS({})).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// generateFooterColorsCSS
// ---------------------------------------------------------------------------

const FOOTER_DEFAULTS = DEFAULT_SITE_CONFIG.footer_colors;

describe('generateFooterColorsCSS', () => {
  it('emits a :root block with all 20 Footer variables', () => {
    const css = generateFooterColorsCSS(FOOTER_DEFAULTS);
    expect(css).toMatch(/^:root\{.*;\}$/);
    for (let i = 1; i <= 10; i++) {
      expect(css).toContain(`--foclr${i}`);
      expect(css).toContain(`--fodclr${i}`);
    }
  });

  it('emits hex values for default opacity (100) — no rgba', () => {
    const css = generateFooterColorsCSS(FOOTER_DEFAULTS);
    expect(css).not.toContain('rgba');
    expect(css).toContain('--foclr1:#FFFFFF');
    expect(css).toContain('--fodclr1:#121212');
  });

  it('emits rgba when foclr1_opacity < 100', () => {
    const css = generateFooterColorsCSS({ ...FOOTER_DEFAULTS, foclr1_opacity: 50 });
    // #FFFFFF → rgb(255, 255, 255)
    expect(css).toContain('--foclr1:rgba(255, 255, 255, 0.5)');
  });

  it('emits rgba when fodclr1_opacity < 100', () => {
    const css = generateFooterColorsCSS({ ...FOOTER_DEFAULTS, fodclr1_opacity: 0 });
    // #121212 → rgb(18, 18, 18)
    expect(css).toContain('--fodclr1:rgba(18, 18, 18, 0)');
  });

  it('emits rgba for all opacity keys', () => {
    const partial = { ...FOOTER_DEFAULTS, foclr1_opacity: 10, fodclr1_opacity: 20, foclr2_opacity: 30, fodclr2_opacity: 40, foclr3_opacity: 50, fodclr3_opacity: 60, foclr4_opacity: 70, fodclr4_opacity: 80, foclr5_opacity: 90, fodclr5_opacity: 95, foclr6_opacity: 10, fodclr6_opacity: 20, foclr7_opacity: 30, fodclr7_opacity: 40, foclr8_opacity: 50, fodclr8_opacity: 60, foclr9_opacity: 70, fodclr9_opacity: 80, foclr10_opacity: 90, fodclr10_opacity: 95 };
    const css = generateFooterColorsCSS(partial);
    // Verify at least one rgba was emitted per variable
    for (let i = 1; i <= 10; i++) {
      expect(css).toContain(`--foclr${i}:rgba(`);
      expect(css).toContain(`--fodclr${i}:rgba(`);
    }
  });

  it('emits an empty declaration per missing hex (partial DB row keeps the count honest)', () => {
    const expected =
      ':root{' +
       ['foclr1','foclr2','foclr3','foclr4','foclr5','foclr6','foclr7','foclr8','foclr9','foclr10',
        'fodclr1','fodclr2','fodclr3','fodclr4','fodclr5','fodclr6','fodclr7','fodclr8','fodclr9','fodclr10']
        .map((k) => `--${k}:`)
        .join(';') +
      ';}';
    expect(generateFooterColorsCSS({})).toBe(expected);
  });

  it('preserves count invariant: 20 variable declarations', () => {
    const css = generateFooterColorsCSS(FOOTER_DEFAULTS);
    const body = css.replace(':root{', '').replace(/}$/, '');
    const decls = body.split(';').filter(Boolean);
    expect(decls.length).toBe(20);
  });
});
