import { describe, it, expect } from 'vitest';
import {
  heroHexToCSS,
  heroResolve,
  buildHeroGradient,
  heroTitleColor,
  heroSubtitleColor,
  pickHeroBorderColor,
  type HeroColorConfig,
} from '@/lib/hero-colors';

// ---------------------------------------------------------------------------
// Default config for tests — matches DEFAULT_SITE_CONFIG.heroColor defaults
// ---------------------------------------------------------------------------

const DEFAULT: HeroColorConfig = {
  heclr1: '#cb3327', heclr2: '#cb3327', heclr3: '#cb3327',
  hedclr1: '#121212', hedclr2: '#1e1e1e', hedclr3: '#121212',
  heclr4: '#ffd700', hedclr4: '#ffd700',
  heclr5: '#ffffff', hedclr5: '#ffffff',
  heclr6: '#fca5a5', heclr7: '#93c5fd', heclr8: '#86efac', heclr9: '#d8b4fe',
  heclr10: '#fde047', heclr11: '#fdba74', heclr12: '#a5b4fc', heclr13: '#f9a8d4',
};

// ---------------------------------------------------------------------------
// heroHexToCSS
// ---------------------------------------------------------------------------

describe('heroHexToCSS', () => {
  it('returns plain hex when opacity is undefined', () => {
    expect(heroHexToCSS('#cb3327', undefined, '#000000')).toBe('#cb3327');
  });

  it('returns plain hex when opacity is 100', () => {
    expect(heroHexToCSS('#cb3327', 100, '#000000')).toBe('#cb3327');
  });

  it('returns rgba when opacity is 50', () => {
    expect(heroHexToCSS('#cb3327', 50, '#000000')).toBe('rgba(203,51,39,0.5)');
  });

  it('returns transparent rgba when opacity is 0', () => {
    expect(heroHexToCSS('#cb3327', 0, '#000000')).toBe('rgba(203,51,39,0)');
  });

  it('returns rgba with 90% opacity', () => {
    expect(heroHexToCSS('#cb3327', 90, '#000000')).toBe('rgba(203,51,39,0.9)');
  });

  it('uses fallback hex when hex is undefined', () => {
    expect(heroHexToCSS(undefined, undefined, '#ff0000')).toBe('#ff0000');
  });

  it('returns fallback as-is when hex is invalid (not 6-char)', () => {
    expect(heroHexToCSS('#fff', 50, '#000000')).toBe('#fff');
  });

  it('handles uppercase hex', () => {
    expect(heroHexToCSS('#CB3327', 50, '#000000')).toBe('rgba(203,51,39,0.5)');
  });

  // Triangulation: different color values
  it('returns correct rgba for a green color', () => {
    expect(heroHexToCSS('#3eb34b', 70, '#000000')).toBe('rgba(62,179,75,0.7)');
  });

  it('returns correct rgba for white', () => {
    expect(heroHexToCSS('#ffffff', 100, '#000000')).toBe('#ffffff');
  });

  it('returns rgba for white at 50%', () => {
    expect(heroHexToCSS('#ffffff', 50, '#000000')).toBe('rgba(255,255,255,0.5)');
  });
});

// ---------------------------------------------------------------------------
// heroResolve
// ---------------------------------------------------------------------------

describe('heroResolve', () => {
  it('returns light hex in light mode', () => {
    expect(heroResolve('#cb3327', 100, '#121212', 100, false, '#000000')).toBe('#cb3327');
  });

  it('returns dark hex in dark mode', () => {
    expect(heroResolve('#cb3327', 100, '#121212', 100, true, '#000000')).toBe('#121212');
  });

  it('applies light opacity in light mode', () => {
    expect(heroResolve('#cb3327', 50, '#121212', 80, false, '#000000')).toBe('rgba(203,51,39,0.5)');
  });

  it('applies dark opacity in dark mode', () => {
    expect(heroResolve('#cb3327', 50, '#121212', 80, true, '#000000')).toBe('rgba(18,18,18,0.8)');
  });

  it('uses fallback when hex is undefined', () => {
    expect(heroResolve(undefined, undefined, undefined, undefined, false, '#ff0000')).toBe('#ff0000');
  });
});

// ---------------------------------------------------------------------------
// buildHeroGradient
// ---------------------------------------------------------------------------

describe('buildHeroGradient', () => {
  it('builds light gradient with default config (all opacity 100)', () => {
    const g = buildHeroGradient(DEFAULT, false);
    expect(g).toBe('linear-gradient(to bottom, #cb3327, #cb3327, #cb3327)');
  });

  it('builds dark gradient with default config', () => {
    const g = buildHeroGradient(DEFAULT, true);
    expect(g).toBe('linear-gradient(to bottom, #121212, #1e1e1e, #121212)');
  });

  it('uses rgba when light gradient opacity is 90/40/70', () => {
    const cfg: HeroColorConfig = {
      heclr1: '#cb3327', heclr1_opacity: 90,
      heclr2: '#cb3327', heclr2_opacity: 40,
      heclr3: '#cb3327', heclr3_opacity: 70,
    };
    const g = buildHeroGradient(cfg, false);
    expect(g).toBe(
      'linear-gradient(to bottom, rgba(203,51,39,0.9), rgba(203,51,39,0.4), rgba(203,51,39,0.7))',
    );
  });

  it('uses rgba when dark gradient has custom opacities', () => {
    const cfg: HeroColorConfig = {
      hedclr1: '#121212', hedclr1_opacity: 80,
      hedclr2: '#1e1e1e', hedclr2_opacity: 40,
      hedclr3: '#121212', hedclr3_opacity: 80,
    };
    const g = buildHeroGradient(cfg, true);
    expect(g).toBe(
      'linear-gradient(to bottom, rgba(18,18,18,0.8), rgba(30,30,30,0.4), rgba(18,18,18,0.8))',
    );
  });

  it('falls back to default colors when config is empty', () => {
    const g = buildHeroGradient({}, false);
    expect(g).toBe('linear-gradient(to bottom, #cb3327, #cb3327, #cb3327)');
  });

  it('falls back to default dark colors when config is empty', () => {
    const g = buildHeroGradient({}, true);
    expect(g).toBe('linear-gradient(to bottom, #121212, #1e1e1e, #121212)');
  });

  it('handles mixed defined/undefined stops gracefully', () => {
    const cfg: HeroColorConfig = {
      heclr1: '#ff0000',
      heclr3: '#0000ff',
      // heclr2 undefined → falls back to #cb3327
    };
    const g = buildHeroGradient(cfg, false);
    expect(g).toBe('linear-gradient(to bottom, #ff0000, #cb3327, #0000ff)');
  });
});

// ---------------------------------------------------------------------------
// heroTitleColor
// ---------------------------------------------------------------------------

describe('heroTitleColor', () => {
  it('returns light h2 color (heclr4) in light mode', () => {
    expect(heroTitleColor(DEFAULT, false)).toBe('#ffd700');
  });

  it('returns dark h2 color (hedclr4) in dark mode', () => {
    expect(heroTitleColor(DEFAULT, true)).toBe('#ffd700');
  });

  it('falls back to #ffd700 when no config', () => {
    expect(heroTitleColor({}, false)).toBe('#ffd700');
  });

  it('applies opacity', () => {
    const cfg: HeroColorConfig = { heclr4: '#ff0000', heclr4_opacity: 50 };
    expect(heroTitleColor(cfg, false)).toBe('rgba(255,0,0,0.5)');
  });

  it('dark mode applies different opacity independently', () => {
    const cfg: HeroColorConfig = {
      heclr4: '#ff0000', heclr4_opacity: 50,
      hedclr4: '#00ff00', hedclr4_opacity: 80,
    };
    expect(heroTitleColor(cfg, false)).toBe('rgba(255,0,0,0.5)');
    expect(heroTitleColor(cfg, true)).toBe('rgba(0,255,0,0.8)');
  });
});

// ---------------------------------------------------------------------------
// heroSubtitleColor
// ---------------------------------------------------------------------------

describe('heroSubtitleColor', () => {
  it('returns light p color (heclr5) in light mode', () => {
    expect(heroSubtitleColor(DEFAULT, false)).toBe('#ffffff');
  });

  it('returns dark p color (hedclr5) in dark mode', () => {
    expect(heroSubtitleColor(DEFAULT, true)).toBe('#ffffff');
  });

  it('falls back to #ffffff when no config', () => {
    expect(heroSubtitleColor({}, false)).toBe('#ffffff');
  });

  it('applies opacity', () => {
    const cfg: HeroColorConfig = { heclr5: '#111111', heclr5_opacity: 75 };
    expect(heroSubtitleColor(cfg, false)).toBe('rgba(17,17,17,0.75)');
  });
});

// ---------------------------------------------------------------------------
// pickHeroBorderColor
// ---------------------------------------------------------------------------

describe('pickHeroBorderColor', () => {
  it('cycles through 8 border colors by index', () => {
    expect(pickHeroBorderColor(DEFAULT, 0)).toBe('#fca5a5');
    expect(pickHeroBorderColor(DEFAULT, 1)).toBe('#93c5fd');
    expect(pickHeroBorderColor(DEFAULT, 2)).toBe('#86efac');
    expect(pickHeroBorderColor(DEFAULT, 3)).toBe('#d8b4fe');
    expect(pickHeroBorderColor(DEFAULT, 4)).toBe('#fde047');
    expect(pickHeroBorderColor(DEFAULT, 5)).toBe('#fdba74');
    expect(pickHeroBorderColor(DEFAULT, 6)).toBe('#a5b4fc');
    expect(pickHeroBorderColor(DEFAULT, 7)).toBe('#f9a8d4');
  });

  it('wraps around index (mod 8)', () => {
    expect(pickHeroBorderColor(DEFAULT, 8)).toBe('#fca5a5');
    expect(pickHeroBorderColor(DEFAULT, 9)).toBe('#93c5fd');
  });

  it('skips undefined entries and cycles through remaining', () => {
    const cfg: HeroColorConfig = {
      heclr6: '#ff0000',
      heclr8: '#00ff00',
      // heclr7, heclr9-13 undefined
    };
    // Only 2 valid entries: idx 0 → #ff0000, idx 1 → #00ff00, idx 2 → #ff0000
    expect(pickHeroBorderColor(cfg, 0)).toBe('#ff0000');
    expect(pickHeroBorderColor(cfg, 1)).toBe('#00ff00');
    expect(pickHeroBorderColor(cfg, 2)).toBe('#ff0000');
  });

  it('applies opacity to border colors', () => {
    const cfg: HeroColorConfig = { heclr6: '#ff0000', heclr6_opacity: 50 };
    expect(pickHeroBorderColor(cfg, 0)).toBe('rgba(255,0,0,0.5)');
  });

  it('falls back to Tailwind palette defaults when config is empty', () => {
    const defaults = ['#fca5a5', '#93c5fd', '#86efac', '#d8b4fe', '#fde047', '#fdba74', '#a5b4fc', '#f9a8d4'];
    for (let i = 0; i < 8; i++) {
      expect(pickHeroBorderColor({}, i)).toBe(defaults[i]);
    }
  });

  it('falls back to defaults when all 8 are undefined', () => {
    const cfg: HeroColorConfig = {};
    for (let i = 0; i < 8; i++) {
      expect(pickHeroBorderColor(cfg, i)).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});
