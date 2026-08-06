import { describe, it, expect } from 'vitest';
import { themeColorsSchema, schemaResolver } from '@/lib/site-config.validation';

const VALID = {
  clr1: '#FFFFFF',
  clr2: '#95a5a6',
  clr3: '#333333',
  clr4: '#1d1d1d',
  clr5: '#2c3e50',
  clr6: '#3eb34b',
  clr7: '#cb3327',
  clr8: '#ffc41d',
  clr9: '#f8f9fa',
  clr10: '#e9ecef',
  clr11: '#2c3e50',
  clr12: '#cb3327',
  dclr1: '#121212',
  dclr2: '#b0b0b0',
  dclr3: '#1e1e1e',
  dclr4: '#0a0a0a',
  dclr5: '#33506f',
  dclr6: '#33a345',
  dclr7: '#ef4b3a',
  dclr8: '#ffcf33',
  dclr9: '#26262b',
  dclr10: '#3c3c3c',
  dclr11: '#33506f',
  dclr12: '#ef4b3a',
  clr1_opacity: 100,
  clr2_opacity: 100,
  clr3_opacity: 100,
  clr4_opacity: 100,
  clr5_opacity: 100,
  clr6_opacity: 100,
  clr7_opacity: 100,
  clr8_opacity: 100,
  clr9_opacity: 100,
  clr10_opacity: 100,
  clr11_opacity: 100,
  clr12_opacity: 100,
  dclr1_opacity: 100,
  dclr2_opacity: 100,
  dclr3_opacity: 100,
  dclr4_opacity: 100,
  dclr5_opacity: 100,
  dclr6_opacity: 100,
  dclr7_opacity: 100,
  dclr8_opacity: 100,
  dclr9_opacity: 100,
  dclr10_opacity: 100,
  dclr11_opacity: 100,
  dclr12_opacity: 100,
};

describe('themeColorsSchema', () => {
  it('accepts all 48 fields (24 hex + 24 opacity) and the parsed result has 48 keys', () => {
    const parsed = themeColorsSchema.parse(VALID);
    expect(parsed.clr7).toBe('#cb3327');
    expect(parsed.dclr8).toBe('#ffcf33');
    expect(parsed.clr11).toBe('#2c3e50');
    expect(parsed.clr12).toBe('#cb3327');
    expect(parsed.dclr11).toBe('#33506f');
    expect(parsed.dclr12).toBe('#ef4b3a');
    expect(parsed.clr5_opacity).toBe(100);
    expect(parsed.dclr10_opacity).toBe(100);
    expect(Object.keys(parsed)).toHaveLength(48);
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
    const bad = { ...VALID, clr7: '#fff' };
    const result = themeColorsSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Formato: #RRGGBB');
    }
  });

  it('accepts lowercase hex equally', () => {
    const lower = { ...VALID, clr7: '#cb3327', dclr1: '#121212' };
    expect(themeColorsSchema.safeParse(lower).success).toBe(true);
  });

  // --- Opacity field tests (R2) ---

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

  it('validates all 24 opacity fields — dclr12_opacity also accepts 50', () => {
    const parsed = themeColorsSchema.parse({ ...VALID, dclr12_opacity: 50 });
    expect(parsed.dclr12_opacity).toBe(50);
  });
});

describe('schemaResolver theme_colors', () => {
  it('maps theme_colors to its category and schema', () => {
    expect(schemaResolver['theme_colors'].category).toBe('theme_colors');
    expect(schemaResolver['theme_colors'].schema).toBe(themeColorsSchema);
  });

  it('registers exactly 17 resolvable schema ids (11 categories + 5 splits + theme_colors)', () => {
    expect(Object.keys(schemaResolver)).toHaveLength(17);
  });
});