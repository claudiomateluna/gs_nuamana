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
};

describe('themeColorsSchema', () => {
  it('accepts all 20 valid #RRGGBB fields', () => {
    const parsed = themeColorsSchema.parse(VALID);
    expect(parsed.clr7).toBe('#cb3327');
    expect(parsed.dclr8).toBe('#ffcf33');
    expect(Object.keys(parsed)).toHaveLength(20);
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