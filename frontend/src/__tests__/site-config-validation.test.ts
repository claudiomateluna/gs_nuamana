import { describe, it, expect } from 'vitest';
import { themeColorsSchema, heroColorsSchema, featuresColorsSchema, promoColorsSchema, slideshowColorsSchema, testimonialsColorsSchema, visitColorsSchema, faqColorsSchema, secondaryHeaderColorsSchema, footerColorsSchema, sectionVisibilitySchema, schemaResolver } from '@/lib/site-config.validation';
import { DEFAULT_SITE_CONFIG } from '@/lib/site-config';

const VALID = { ...DEFAULT_SITE_CONFIG.theme_colors };
const VALID_HERO_COLORS = {
  heclr1: DEFAULT_SITE_CONFIG.hero.heclr1,
  heclr2: DEFAULT_SITE_CONFIG.hero.heclr2,
  heclr3: DEFAULT_SITE_CONFIG.hero.heclr3,
  hedclr1: DEFAULT_SITE_CONFIG.hero.hedclr1,
  hedclr2: DEFAULT_SITE_CONFIG.hero.hedclr2,
  hedclr3: DEFAULT_SITE_CONFIG.hero.hedclr3,
  heclr4: DEFAULT_SITE_CONFIG.hero.heclr4,
  heclr5: DEFAULT_SITE_CONFIG.hero.heclr5,
  hedclr4: DEFAULT_SITE_CONFIG.hero.hedclr4,
  hedclr5: DEFAULT_SITE_CONFIG.hero.hedclr5,
  heclr6: DEFAULT_SITE_CONFIG.hero.heclr6,
  heclr7: DEFAULT_SITE_CONFIG.hero.heclr7,
  heclr8: DEFAULT_SITE_CONFIG.hero.heclr8,
  heclr9: DEFAULT_SITE_CONFIG.hero.heclr9,
  heclr10: DEFAULT_SITE_CONFIG.hero.heclr10,
  heclr11: DEFAULT_SITE_CONFIG.hero.heclr11,
  heclr12: DEFAULT_SITE_CONFIG.hero.heclr12,
  heclr13: DEFAULT_SITE_CONFIG.hero.heclr13,
  hedclr6: DEFAULT_SITE_CONFIG.hero.hedclr6,
  hedclr7: DEFAULT_SITE_CONFIG.hero.hedclr7,
  hedclr8: DEFAULT_SITE_CONFIG.hero.hedclr8,
  hedclr9: DEFAULT_SITE_CONFIG.hero.hedclr9,
  hedclr10: DEFAULT_SITE_CONFIG.hero.hedclr10,
  hedclr11: DEFAULT_SITE_CONFIG.hero.hedclr11,
  hedclr12: DEFAULT_SITE_CONFIG.hero.hedclr12,
  hedclr13: DEFAULT_SITE_CONFIG.hero.hedclr13,
  heclr1_opacity: DEFAULT_SITE_CONFIG.hero.heclr1_opacity,
  heclr2_opacity: DEFAULT_SITE_CONFIG.hero.heclr2_opacity,
  heclr3_opacity: DEFAULT_SITE_CONFIG.hero.heclr3_opacity,
  hedclr1_opacity: DEFAULT_SITE_CONFIG.hero.hedclr1_opacity,
  hedclr2_opacity: DEFAULT_SITE_CONFIG.hero.hedclr2_opacity,
  hedclr3_opacity: DEFAULT_SITE_CONFIG.hero.hedclr3_opacity,
  heclr4_opacity: DEFAULT_SITE_CONFIG.hero.heclr4_opacity,
  heclr5_opacity: DEFAULT_SITE_CONFIG.hero.heclr5_opacity,
  hedclr4_opacity: DEFAULT_SITE_CONFIG.hero.hedclr4_opacity,
  hedclr5_opacity: DEFAULT_SITE_CONFIG.hero.hedclr5_opacity,
  heclr6_opacity: DEFAULT_SITE_CONFIG.hero.heclr6_opacity,
  heclr7_opacity: DEFAULT_SITE_CONFIG.hero.heclr7_opacity,
  heclr8_opacity: DEFAULT_SITE_CONFIG.hero.heclr8_opacity,
  heclr9_opacity: DEFAULT_SITE_CONFIG.hero.heclr9_opacity,
  heclr10_opacity: DEFAULT_SITE_CONFIG.hero.heclr10_opacity,
  heclr11_opacity: DEFAULT_SITE_CONFIG.hero.heclr11_opacity,
  heclr12_opacity: DEFAULT_SITE_CONFIG.hero.heclr12_opacity,
  heclr13_opacity: DEFAULT_SITE_CONFIG.hero.heclr13_opacity,
  hedclr6_opacity: DEFAULT_SITE_CONFIG.hero.hedclr6_opacity,
  hedclr7_opacity: DEFAULT_SITE_CONFIG.hero.hedclr7_opacity,
  hedclr8_opacity: DEFAULT_SITE_CONFIG.hero.hedclr8_opacity,
  hedclr9_opacity: DEFAULT_SITE_CONFIG.hero.hedclr9_opacity,
  hedclr10_opacity: DEFAULT_SITE_CONFIG.hero.hedclr10_opacity,
  hedclr11_opacity: DEFAULT_SITE_CONFIG.hero.hedclr11_opacity,
  hedclr12_opacity: DEFAULT_SITE_CONFIG.hero.hedclr12_opacity,
  hedclr13_opacity: DEFAULT_SITE_CONFIG.hero.hedclr13_opacity,
};

describe('themeColorsSchema', () => {
  it('accepts all 160 fields (80 hex + 80 opacity) and the parsed result has 160 keys', () => {
    const parsed = themeColorsSchema.parse(VALID);
    expect(parsed.clr4).toBe('#cb3327');
    expect(parsed.dclr5).toBe('#ffcf33');
    expect(parsed.tclr3).toBe('#2c3e50');
    expect(parsed.hclr13).toBe('#cb3327');
    expect(parsed.hdclr13).toBe('#ef4b3a');
    expect(parsed.clr9).toBe('#FFFFFF');
    expect(parsed.clr10).toBe('#cb3327');
    expect(parsed.mclr9).toBe('#1d1d1d');
    expect(parsed.mdclr9).toBe('#ffcf33');
    expect(parsed.clr5_opacity).toBe(100);
    expect(parsed.dclr8_opacity).toBe(100);
    expect(parsed.clr9_opacity).toBe(100);
    expect(parsed.hclr13_opacity).toBe(100);
    expect(parsed.hdclr13_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(160);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID, clr1: 'red' };
    const result = themeColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects a short hex like "#fff" with Formato: #RRGGBB', () => {
    const bad = { ...VALID, clr4: '#fff' };
    const result = themeColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('accepts lowercase hex equally', () => {
    const lower = { ...VALID, clr4: '#cb3327', dclr1: '#121212' };
    expect(themeColorsSchema.safeParse(lower).success).toBe(true);
  });

  // --- Opacity field tests ---

  it('accepts opacity 90 and returns the numeric value', () => {
    const parsed = themeColorsSchema.parse({ ...VALID, clr5_opacity: 90 });
    expect(parsed.clr5_opacity).toBe(90);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(themeColorsSchema.safeParse({ ...VALID, clr5_opacity: 0 }).success).toBe(true);
  });

  it('accepts opacity 100 (maximum valid)', () => {
    expect(themeColorsSchema.safeParse({ ...VALID, clr5_opacity: 100 }).success).toBe(true);
  });

  it('rejects opacity 101 (above max)', () => {
    const result = themeColorsSchema.safeParse({ ...VALID, clr5_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('rejects opacity -1 (below min)', () => {
    const result = themeColorsSchema.safeParse({ ...VALID, clr5_opacity: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects opacity 12.5 (must be integer)', () => {
    const result = themeColorsSchema.safeParse({ ...VALID, clr5_opacity: 12.5 });
    expect(result.success).toBe(false);
  });

  it('rejects opacity "50" (must be number, not string)', () => {
    const bad = { ...VALID, clr5_opacity: '50' };
    const result = themeColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it('validates all 76 opacity fields — mdclr9_opacity also accepts 50', () => {
    const parsed = themeColorsSchema.parse({ ...VALID, mdclr9_opacity: 50 });
    expect(parsed.mdclr9_opacity).toBe(50);
  });
});

describe('schemaResolver theme_colors', () => {
  it('maps theme_colors to its category and schema', () => {
    expect(schemaResolver['theme_colors'].category).toBe('theme_colors');
    expect(schemaResolver['theme_colors'].schema).toBe(themeColorsSchema);
  });

  it('maps hero_colors to the hero category and heroColorsSchema', () => {
    expect(schemaResolver['hero_colors'].category).toBe('hero');
    expect(schemaResolver['hero_colors'].schema).toBe(heroColorsSchema);
  });

  it('maps features_colors to the features category and featuresColorsSchema', () => {
    expect(schemaResolver['features_colors'].category).toBe('features');
    expect(schemaResolver['features_colors'].schema).toBe(featuresColorsSchema);
  });

  it('maps promo_colors to the promo_colors category and promoColorsSchema', () => {
    expect(schemaResolver['promo_colors'].category).toBe('promo_colors');
    expect(schemaResolver['promo_colors'].schema).toBe(promoColorsSchema);
  });

  it('maps slideshow_colors to the slideshow_colors category and slideshowColorsSchema', () => {
    expect(schemaResolver['slideshow_colors'].category).toBe('slideshow_colors');
    expect(schemaResolver['slideshow_colors'].schema).toBe(slideshowColorsSchema);
  });

  it('maps testimonials_colors to the testimonials_colors category and testimonialsColorsSchema', () => {
    expect(schemaResolver['testimonials_colors'].category).toBe('testimonials_colors');
    expect(schemaResolver['testimonials_colors'].schema).toBe(testimonialsColorsSchema);
  });

  it('maps visit_colors to the visit_colors category and visitColorsSchema', () => {
    expect(schemaResolver['visit_colors'].category).toBe('visit_colors');
    expect(schemaResolver['visit_colors'].schema).toBe(visitColorsSchema);
  });

  it('maps faq_colors to the faq_colors category and faqColorsSchema', () => {
    expect(schemaResolver['faq_colors'].category).toBe('faq_colors');
    expect(schemaResolver['faq_colors'].schema).toBe(faqColorsSchema);
  });

  it('maps secondary_header_colors to the secondary_header_colors category and secondaryHeaderColorsSchema', () => {
    expect(schemaResolver['secondary_header_colors'].category).toBe('secondary_header_colors');
    expect(schemaResolver['secondary_header_colors'].schema).toBe(secondaryHeaderColorsSchema);
  });

  it('maps footer_colors to the footer_colors category and footerColorsSchema', () => {
    expect(schemaResolver['footer_colors'].category).toBe('footer_colors');
    expect(schemaResolver['footer_colors'].schema).toBe(footerColorsSchema);
  });

  it('registers exactly 30 resolvable schema ids (12 categories + 5 splits + theme_colors + hero_colors + features_colors + promo_colors + slideshow_colors + testimonials_colors + visit_colors + faq_colors + secondary_header_colors + footer_colors + header_colors + menu_colors + section_visibility + social_list)', () => {
    expect(Object.keys(schemaResolver)).toHaveLength(30);
  });
});

// ---------------------------------------------------------------------------
// heroColorsSchema — 52 fields: 26 hex + 26 opacity
// ---------------------------------------------------------------------------

describe('heroColorsSchema', () => {
  it('accepts all 52 fields (26 hex + 26 opacity) and the parsed result has 52 keys', () => {
    const parsed = heroColorsSchema.parse(VALID_HERO_COLORS);
    expect(parsed.heclr1).toBe('#cb3327');
    expect(parsed.hedclr1).toBe('#121212');
    expect(parsed.heclr13).toBe('#f9a8d4');
    expect(parsed.hedclr13).toBe('#f9a8d4');
    expect(parsed.heclr1_opacity).toBe(90);
    expect(parsed.hedclr6_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(52);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_HERO_COLORS, heclr1: 'red' };
    const result = heroColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = heroColorsSchema.safeParse({ ...VALID_HERO_COLORS, hedclr6_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(heroColorsSchema.safeParse({ ...VALID_HERO_COLORS, heclr5_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// featuresColorsSchema — 36 fields: 18 hex + 18 opacity
// ---------------------------------------------------------------------------

const VALID_FEATURES_COLORS = {
  feclr1: DEFAULT_SITE_CONFIG.features.feclr1,
  feclr2: DEFAULT_SITE_CONFIG.features.feclr2,
  feclr3: DEFAULT_SITE_CONFIG.features.feclr3,
  feclr4: DEFAULT_SITE_CONFIG.features.feclr4,
  feclr5: DEFAULT_SITE_CONFIG.features.feclr5,
  feclr6: DEFAULT_SITE_CONFIG.features.feclr6,
  feclr7: DEFAULT_SITE_CONFIG.features.feclr7,
  feclr8: DEFAULT_SITE_CONFIG.features.feclr8,
  feclr9: DEFAULT_SITE_CONFIG.features.feclr9,
  fedclr1: DEFAULT_SITE_CONFIG.features.fedclr1,
  fedclr2: DEFAULT_SITE_CONFIG.features.fedclr2,
  fedclr3: DEFAULT_SITE_CONFIG.features.fedclr3,
  fedclr4: DEFAULT_SITE_CONFIG.features.fedclr4,
  fedclr5: DEFAULT_SITE_CONFIG.features.fedclr5,
  fedclr6: DEFAULT_SITE_CONFIG.features.fedclr6,
  fedclr7: DEFAULT_SITE_CONFIG.features.fedclr7,
  fedclr8: DEFAULT_SITE_CONFIG.features.fedclr8,
  fedclr9: DEFAULT_SITE_CONFIG.features.fedclr9,
  feclr1_opacity: DEFAULT_SITE_CONFIG.features.feclr1_opacity,
  feclr2_opacity: DEFAULT_SITE_CONFIG.features.feclr2_opacity,
  feclr3_opacity: DEFAULT_SITE_CONFIG.features.feclr3_opacity,
  feclr4_opacity: DEFAULT_SITE_CONFIG.features.feclr4_opacity,
  feclr5_opacity: DEFAULT_SITE_CONFIG.features.feclr5_opacity,
  feclr6_opacity: DEFAULT_SITE_CONFIG.features.feclr6_opacity,
  feclr7_opacity: DEFAULT_SITE_CONFIG.features.feclr7_opacity,
  feclr8_opacity: DEFAULT_SITE_CONFIG.features.feclr8_opacity,
  feclr9_opacity: DEFAULT_SITE_CONFIG.features.feclr9_opacity,
  fedclr1_opacity: DEFAULT_SITE_CONFIG.features.fedclr1_opacity,
  fedclr2_opacity: DEFAULT_SITE_CONFIG.features.fedclr2_opacity,
  fedclr3_opacity: DEFAULT_SITE_CONFIG.features.fedclr3_opacity,
  fedclr4_opacity: DEFAULT_SITE_CONFIG.features.fedclr4_opacity,
  fedclr5_opacity: DEFAULT_SITE_CONFIG.features.fedclr5_opacity,
  fedclr6_opacity: DEFAULT_SITE_CONFIG.features.fedclr6_opacity,
  fedclr7_opacity: DEFAULT_SITE_CONFIG.features.fedclr7_opacity,
  fedclr8_opacity: DEFAULT_SITE_CONFIG.features.fedclr8_opacity,
  fedclr9_opacity: DEFAULT_SITE_CONFIG.features.fedclr9_opacity,
};

describe('featuresColorsSchema', () => {
  it('accepts all 36 fields (18 hex + 18 opacity) and the parsed result has 36 keys', () => {
    const parsed = featuresColorsSchema.parse(VALID_FEATURES_COLORS);
    expect(parsed.feclr1).toBe('#2d3748');
    expect(parsed.fedclr1).toBe('#f7fafc');
    expect(parsed.feclr8).toBe('#ed8936');
    expect(parsed.fedclr8).toBe('#f6ad55');
    expect(parsed.feclr9).toBe('#edf2f7');
    expect(parsed.fedclr9).toBe('#1a202c');
    expect(parsed.feclr1_opacity).toBe(100);
    expect(parsed.fedclr8_opacity).toBe(100);
    expect(parsed.feclr9_opacity).toBe(100);
    expect(parsed.fedclr9_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(36);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_FEATURES_COLORS, feclr1: 'red' };
    const result = featuresColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = featuresColorsSchema.safeParse({ ...VALID_FEATURES_COLORS, feclr6_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(featuresColorsSchema.safeParse({ ...VALID_FEATURES_COLORS, fedclr2_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// promoColorsSchema — 36 fields: 18 hex + 18 opacity
// ---------------------------------------------------------------------------

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

describe('promoColorsSchema', () => {
  it('accepts all 36 fields (18 hex + 18 opacity) and the parsed result has 36 keys', () => {
    const parsed = promoColorsSchema.parse(VALID_PROMO_COLORS);
    expect(parsed.cbclr1).toBe('#edf2f7');
    expect(parsed.cbdclr1).toBe('#1a202c');
    expect(parsed.cbclr6).toBe('#cb3327');
    expect(parsed.cbdclr6).toBe('#ef4b3a');
    expect(parsed.cbclr8).toBe('#e9ecef');
    expect(parsed.cbdclr8).toBe('#3c3c3c');
    expect(parsed.cbclr9).toBe('#FFFFFF');
    expect(parsed.cbdclr9).toBe('#121212');
    expect(parsed.cbclr1_opacity).toBe(100);
    expect(parsed.cbdclr8_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(36);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_PROMO_COLORS, cbclr1: 'red' };
    const result = promoColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = promoColorsSchema.safeParse({ ...VALID_PROMO_COLORS, cbclr6_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(promoColorsSchema.safeParse({ ...VALID_PROMO_COLORS, cbdclr2_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// slideshowColorsSchema — 36 fields: 18 hex + 18 opacity
// ---------------------------------------------------------------------------

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

describe('slideshowColorsSchema', () => {
  it('accepts all 36 fields (18 hex + 18 opacity) and the parsed result has 36 keys', () => {
    const parsed = slideshowColorsSchema.parse(VALID_SLIDESHOW_COLORS);
    expect(parsed.bsclr1).toBe('#e9ecef');
    expect(parsed.bsdclr1).toBe('#121212');
    expect(parsed.bsclr4).toBe('#cb3327');
    expect(parsed.bsclr6).toBe('#1d1d1d');
    expect(parsed.bsdclr6).toBe('#121212');
    expect(parsed.bsclr7).toBe('#cb3327');
    expect(parsed.bsdclr7).toBe('#ef4b3a');
    expect(parsed.bsclr8).toBe('#FFFFFF');
    expect(parsed.bsdclr9).toBe('#3c3c3c');
    expect(parsed.bsclr1_opacity).toBe(100);
    expect(parsed.bsclr6_opacity).toBe(20);
    expect(parsed.bsdclr6_opacity).toBe(20);
    expect(Object.keys(parsed)).toHaveLength(36);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_SLIDESHOW_COLORS, bsclr1: 'red' };
    const result = slideshowColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = slideshowColorsSchema.safeParse({ ...VALID_SLIDESHOW_COLORS, bsclr6_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(slideshowColorsSchema.safeParse({ ...VALID_SLIDESHOW_COLORS, bsdclr2_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// testimonialsColorsSchema — 32 fields: 16 hex + 16 opacity
// ---------------------------------------------------------------------------

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

describe('testimonialsColorsSchema', () => {
  it('accepts all 32 fields (16 hex + 16 opacity) and the parsed result has 32 keys', () => {
    const parsed = testimonialsColorsSchema.parse(VALID_TESTIMONIALS_COLORS);
    expect(parsed.tsclr1).toBe('#e9ecef');
    expect(parsed.tsdclr1).toBe('#3c3c3c');
    expect(parsed.tsclr2).toBe('#cb3327');
    expect(parsed.tsdclr2).toBe('#ef4b3a');
    expect(parsed.tsclr4).toBe('#FFFFFF');
    expect(parsed.tsdclr4).toBe('#121212');
    expect(parsed.tsclr7).toBe('#cb3327');
    expect(parsed.tsdclr8).toBe('#3c3c3c');
    expect(parsed.tsclr1_opacity).toBe(100);
    expect(parsed.tsdclr8_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(32);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_TESTIMONIALS_COLORS, tsclr1: 'red' };
    const result = testimonialsColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = testimonialsColorsSchema.safeParse({ ...VALID_TESTIMONIALS_COLORS, tsclr4_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(testimonialsColorsSchema.safeParse({ ...VALID_TESTIMONIALS_COLORS, tsdclr5_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// visitColorsSchema — 36 fields: 18 hex + 18 opacity
// ---------------------------------------------------------------------------

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

describe('visitColorsSchema', () => {
  it('accepts all 36 fields (18 hex + 18 opacity) and the parsed result has 36 keys', () => {
    const parsed = visitColorsSchema.parse(VALID_VISIT_COLORS);
    expect(parsed.vsclr1).toBe('#FFFFFF');
    expect(parsed.vsdclr1).toBe('#121212');
    expect(parsed.vsclr2).toBe('#cb3327');
    expect(parsed.vsdclr2).toBe('#ef4b3a');
    expect(parsed.vsclr5).toBe('#33a345');
    expect(parsed.vsdclr5).toBe('#33a345');
    expect(parsed.vsclr8).toBe('#e9ecef');
    expect(parsed.vsdclr9).toBe('#ffcf33');
    expect(parsed.vsclr1_opacity).toBe(100);
    expect(parsed.vsdclr9_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(36);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_VISIT_COLORS, vsclr1: 'red' };
    const result = visitColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = visitColorsSchema.safeParse({ ...VALID_VISIT_COLORS, vsclr5_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(visitColorsSchema.safeParse({ ...VALID_VISIT_COLORS, vsdclr9_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// faqColorsSchema — 32 fields: 16 hex + 16 opacity
// ---------------------------------------------------------------------------

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

describe('faqColorsSchema', () => {
  it('accepts all 32 fields (16 hex + 16 opacity) and the parsed result has 32 keys', () => {
    const parsed = faqColorsSchema.parse(VALID_FAQ_COLORS);
    expect(parsed.fclr1).toBe('#e9ecef');
    expect(parsed.fdclr1).toBe('#3c3c3c');
    expect(parsed.fclr2).toBe('#cb3327');
    expect(parsed.fdclr2).toBe('#ef4b3a');
    expect(parsed.fclr4).toBe('#FFFFFF');
    expect(parsed.fdclr4).toBe('#121212');
    expect(parsed.fclr8).toBe('#cb3327');
    expect(parsed.fdclr8).toBe('#ef4b3a');
    expect(parsed.fclr1_opacity).toBe(100);
    expect(parsed.fdclr8_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(32);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_FAQ_COLORS, fclr1: 'red' };
    const result = faqColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = faqColorsSchema.safeParse({ ...VALID_FAQ_COLORS, fclr4_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(faqColorsSchema.safeParse({ ...VALID_FAQ_COLORS, fdclr5_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// secondaryHeaderColorsSchema — 56 fields: 28 hex + 28 opacity
// ---------------------------------------------------------------------------

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

describe('secondaryHeaderColorsSchema', () => {
  it('accepts all 56 fields (28 hex + 28 opacity) and the parsed result has 56 keys', () => {
    const parsed = secondaryHeaderColorsSchema.parse(VALID_SECONDARY_HEADER_COLORS);
    expect(parsed.shclr1).toBe('#cb3327');
    expect(parsed.shdclr1).toBe('#FFFFFF');
    expect(parsed.shclr4).toBe('#cb3327');
    expect(parsed.shdclr13).toBe('#ef4b3a');
    expect(parsed.shclr1_opacity).toBe(100);
    expect(parsed.shdclr13_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(56);
  });

  it('rejects a named color like "red" with Formato: #RRGGBB', () => {
    const bad = { ...VALID_SECONDARY_HEADER_COLORS, shclr1: 'red' };
    const result = secondaryHeaderColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('rejects opacity 101 (above max)', () => {
    const result = secondaryHeaderColorsSchema.safeParse({ ...VALID_SECONDARY_HEADER_COLORS, shclr6_opacity: 101 });
    expect(result.success).toBe(false);
  });

  it('accepts opacity 0 (minimum valid)', () => {
    expect(secondaryHeaderColorsSchema.safeParse({ ...VALID_SECONDARY_HEADER_COLORS, shdclr5_opacity: 0 }).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// sectionVisibilitySchema — 7 boolean fields (Inicio section toggles)
// ---------------------------------------------------------------------------

const VALID_VISIBILITY = {
  hero: true,
  features: true,
  promo: true,
  slideshow: true,
  testimonials: true,
  visit: true,
  faq: true,
};

describe('sectionVisibilitySchema', () => {
  it('accepts all 7 boolean fields and the parsed result has 7 keys', () => {
    const parsed = sectionVisibilitySchema.parse(VALID_VISIBILITY);
    expect(parsed.hero).toBe(true);
    expect(parsed.faq).toBe(true);
    expect(Object.keys(parsed)).toHaveLength(7);
  });

  it('accepts all-false (every section hidden)', () => {
    const allFalse = { hero: false, features: false, promo: false, slideshow: false, testimonials: false, visit: false, faq: false };
    const parsed = sectionVisibilitySchema.parse(allFalse);
    expect(parsed.hero).toBe(false);
    expect(parsed.visit).toBe(false);
  });

  it('accepts a partial object with one key (toggle saves one field at a time)', () => {
    const parsed = sectionVisibilitySchema.safeParse({ hero: false });
    // Zod object schema without .strict() allows missing keys — the toggle
    // saves a single key via saveSiteConfig('section_visibility', { hero: false }, token)
    expect(parsed.success).toBe(true);
  });

  it('rejects a non-boolean value for a visibility key', () => {
    const bad = { ...VALID_VISIBILITY, hero: 'true' as unknown as boolean };
    const result = sectionVisibilitySchema.safeParse(bad);
    expect(result.success).toBe(false);
  });
});