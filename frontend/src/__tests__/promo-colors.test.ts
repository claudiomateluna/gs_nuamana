import { describe, it, expect } from 'vitest';
import {
  promoHexToCSS,
  promoResolve,
  buildPromoContainerGradient,
  promoTitleColor,
  promoTextColor,
  promoNumberColor,
  promoLinkColor,
  promoBorderColor,
  promoContainerBgColor,
  type PromoColorsConfig,
} from '@/lib/promo-colors';

// ---------------------------------------------------------------------------
// Default config for tests — matches DEFAULT_SITE_CONFIG.promo_colors defaults
// ---------------------------------------------------------------------------

const DEFAULT: PromoColorsConfig = {
  cbclr1: '#edf2f7', cbdclr1: '#1a202c',
  cbclr2: '#e2e8f0', cbdclr2: '#2d3748',
  cbclr3: '#cbd5e0', cbdclr3: '#4a5568',
  cbclr4: '#2c3e50', cbdclr4: '#f7fafc',
  cbclr5: '#4a5568', cbdclr5: '#e2e8f0',
  cbclr6: '#cb3327', cbdclr6: '#ef4b3a',
  cbclr7: '#2c3e50', cbdclr7: '#33506f',
  cbclr8: '#e9ecef', cbdclr8: '#3c3c3c',
  cbclr9: '#FFFFFF', cbdclr9: '#121212',
  cbclr1_opacity: 100, cbdclr1_opacity: 100,
  cbclr2_opacity: 100, cbdclr2_opacity: 100,
  cbclr3_opacity: 100, cbdclr3_opacity: 100,
  cbclr4_opacity: 100, cbdclr4_opacity: 100,
  cbclr5_opacity: 100, cbdclr5_opacity: 100,
  cbclr6_opacity: 100, cbdclr6_opacity: 100,
  cbclr7_opacity: 100, cbdclr7_opacity: 100,
  cbclr8_opacity: 100, cbdclr8_opacity: 100,
  cbclr9_opacity: 100, cbdclr9_opacity: 100,
};

// ---------------------------------------------------------------------------
// promoHexToCSS
// ---------------------------------------------------------------------------

describe('promoHexToCSS', () => {
  it('returns plain hex when opacity is undefined', () => {
    expect(promoHexToCSS('#edf2f7', undefined, '#000000')).toBe('#edf2f7');
  });

  it('returns plain hex when opacity is 100', () => {
    expect(promoHexToCSS('#edf2f7', 100, '#000000')).toBe('#edf2f7');
  });

  it('returns rgba when opacity is 50', () => {
    expect(promoHexToCSS('#edf2f7', 50, '#000000')).toBe('rgba(237,242,247,0.5)');
  });

  it('returns transparent rgba when opacity is 0', () => {
    expect(promoHexToCSS('#edf2f7', 0, '#000000')).toBe('rgba(237,242,247,0)');
  });

  it('returns rgba with 90% opacity', () => {
    expect(promoHexToCSS('#cb3327', 90, '#000000')).toBe('rgba(203,51,39,0.9)');
  });

  it('uses fallback hex when hex is undefined', () => {
    expect(promoHexToCSS(undefined, undefined, '#ff0000')).toBe('#ff0000');
  });

  it('returns fallback as-is when hex is invalid (not 6-char)', () => {
    expect(promoHexToCSS('#fff', 50, '#000000')).toBe('#fff');
  });

  it('handles uppercase hex', () => {
    expect(promoHexToCSS('#CB3327', 50, '#000000')).toBe('rgba(203,51,39,0.5)');
  });

  it('returns correct rgba for a green color', () => {
    expect(promoHexToCSS('#3eb34b', 70, '#000000')).toBe('rgba(62,179,75,0.7)');
  });

  it('returns rgba for white at 50%', () => {
    expect(promoHexToCSS('#ffffff', 50, '#000000')).toBe('rgba(255,255,255,0.5)');
  });
});

// ---------------------------------------------------------------------------
// promoResolve
// ---------------------------------------------------------------------------

describe('promoResolve', () => {
  it('returns light hex in light mode', () => {
    expect(promoResolve('#cb3327', 100, '#121212', 100, false, '#000000')).toBe('#cb3327');
  });

  it('returns dark hex in dark mode', () => {
    expect(promoResolve('#cb3327', 100, '#121212', 100, true, '#000000')).toBe('#121212');
  });

  it('applies light opacity in light mode', () => {
    expect(promoResolve('#cb3327', 50, '#121212', 80, false, '#000000')).toBe('rgba(203,51,39,0.5)');
  });

  it('applies dark opacity in dark mode', () => {
    expect(promoResolve('#cb3327', 50, '#121212', 80, true, '#000000')).toBe('rgba(18,18,18,0.8)');
  });

  it('uses fallback when hex is undefined', () => {
    expect(promoResolve(undefined, undefined, undefined, undefined, false, '#ff0000')).toBe('#ff0000');
  });
});

// ---------------------------------------------------------------------------
// buildPromoContainerGradient
// ---------------------------------------------------------------------------

describe('buildPromoContainerGradient', () => {
  it('builds light gradient with default config', () => {
    const g = buildPromoContainerGradient(DEFAULT, false);
    expect(g).toBe('linear-gradient(to bottom right, #e2e8f0, #cbd5e0)');
  });

  it('builds dark gradient with default config', () => {
    const g = buildPromoContainerGradient(DEFAULT, true);
    expect(g).toBe('linear-gradient(to bottom right, #2d3748, #4a5568)');
  });

  it('uses rgba when light gradient opacity is custom', () => {
    const cfg: PromoColorsConfig = {
      cbclr2: '#e2e8f0', cbclr2_opacity: 80,
      cbclr3: '#cbd5e0', cbclr3_opacity: 60,
    };
    const g = buildPromoContainerGradient(cfg, false);
    expect(g).toBe(
      'linear-gradient(to bottom right, rgba(226,232,240,0.8), rgba(203,213,224,0.6))',
    );
  });

  it('uses rgba when dark gradient has custom opacities', () => {
    const cfg: PromoColorsConfig = {
      cbdclr2: '#2d3748', cbdclr2_opacity: 70,
      cbdclr3: '#4a5568', cbdclr3_opacity: 50,
    };
    const g = buildPromoContainerGradient(cfg, true);
    expect(g).toBe(
      'linear-gradient(to bottom right, rgba(45,55,72,0.7), rgba(74,85,104,0.5))',
    );
  });

  it('falls back to default colors when config is empty', () => {
    expect(buildPromoContainerGradient({}, false)).toBe('linear-gradient(to bottom right, #e2e8f0, #cbd5e0)');
    expect(buildPromoContainerGradient({}, true)).toBe('linear-gradient(to bottom right, #2d3748, #4a5568)');
  });
});

// ---------------------------------------------------------------------------
// promoTitleColor
// ---------------------------------------------------------------------------

describe('promoTitleColor', () => {
  it('returns light title color in light mode', () => {
    expect(promoTitleColor(DEFAULT, false)).toBe('#2c3e50');
  });

  it('returns dark title color in dark mode', () => {
    expect(promoTitleColor(DEFAULT, true)).toBe('#f7fafc');
  });

  it('falls back to defaults when no config', () => {
    expect(promoTitleColor({}, false)).toBe('#2c3e50');
    expect(promoTitleColor({}, true)).toBe('#f7fafc');
  });

  it('applies opacity', () => {
    const cfg: PromoColorsConfig = { cbclr4: '#ff0000', cbclr4_opacity: 50 };
    expect(promoTitleColor(cfg, false)).toBe('rgba(255,0,0,0.5)');
  });
});

// ---------------------------------------------------------------------------
// promoTextColor
// ---------------------------------------------------------------------------

describe('promoTextColor', () => {
  it('returns light text color in light mode', () => {
    expect(promoTextColor(DEFAULT, false)).toBe('#4a5568');
  });

  it('returns dark text color in dark mode', () => {
    expect(promoTextColor(DEFAULT, true)).toBe('#e2e8f0');
  });

  it('falls back to defaults when no config', () => {
    expect(promoTextColor({}, false)).toBe('#4a5568');
    expect(promoTextColor({}, true)).toBe('#e2e8f0');
  });

  it('applies opacity', () => {
    const cfg: PromoColorsConfig = { cbclr5: '#111111', cbclr5_opacity: 75 };
    expect(promoTextColor(cfg, false)).toBe('rgba(17,17,17,0.75)');
  });
});

// ---------------------------------------------------------------------------
// promoNumberColor
// ---------------------------------------------------------------------------

describe('promoNumberColor', () => {
  it('returns light accent color in light mode', () => {
    expect(promoNumberColor(DEFAULT, false)).toBe('#cb3327');
  });

  it('returns dark accent color in dark mode', () => {
    expect(promoNumberColor(DEFAULT, true)).toBe('#ef4b3a');
  });

  it('falls back to defaults when no config', () => {
    expect(promoNumberColor({}, false)).toBe('#cb3327');
    expect(promoNumberColor({}, true)).toBe('#ef4b3a');
  });

  it('applies opacity', () => {
    const cfg: PromoColorsConfig = { cbclr6: '#ff0000', cbclr6_opacity: 60 };
    expect(promoNumberColor(cfg, false)).toBe('rgba(255,0,0,0.6)');
  });
});

// ---------------------------------------------------------------------------
// promoLinkColor
// ---------------------------------------------------------------------------

describe('promoLinkColor', () => {
  it('returns light link color in light mode', () => {
    expect(promoLinkColor(DEFAULT, false)).toBe('#2c3e50');
  });

  it('returns dark link color in dark mode', () => {
    expect(promoLinkColor(DEFAULT, true)).toBe('#33506f');
  });

  it('falls back to defaults when no config', () => {
    expect(promoLinkColor({}, false)).toBe('#2c3e50');
    expect(promoLinkColor({}, true)).toBe('#33506f');
  });
});

// ---------------------------------------------------------------------------
// promoBorderColor
// ---------------------------------------------------------------------------

describe('promoBorderColor', () => {
  it('returns light border color in light mode', () => {
    expect(promoBorderColor(DEFAULT, false)).toBe('#e9ecef');
  });

  it('returns dark border color in dark mode', () => {
    expect(promoBorderColor(DEFAULT, true)).toBe('#3c3c3c');
  });

  it('falls back to defaults when no config', () => {
    expect(promoBorderColor({}, false)).toBe('#e9ecef');
    expect(promoBorderColor({}, true)).toBe('#3c3c3c');
  });
});

// ---------------------------------------------------------------------------
// promoContainerBgColor
// ---------------------------------------------------------------------------

describe('promoContainerBgColor', () => {
  it('returns light bg color in light mode', () => {
    expect(promoContainerBgColor(DEFAULT, false)).toBe('#edf2f7');
  });

  it('returns dark bg color in dark mode', () => {
    expect(promoContainerBgColor(DEFAULT, true)).toBe('#1a202c');
  });

  it('falls back to defaults when no config', () => {
    expect(promoContainerBgColor({}, false)).toBe('#edf2f7');
    expect(promoContainerBgColor({}, true)).toBe('#1a202c');
  });
});
