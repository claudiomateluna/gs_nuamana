import { describe, it, expect } from 'vitest';
import { generateThemeCSS } from '@/lib/theme-css';
import type { ThemeColorsConfig } from '@/lib/site-config.types';

const DEFAULTS: ThemeColorsConfig = {
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

describe('generateThemeCSS', () => {
  it('emits a minified :root block with all 20 default variables in order', () => {
    const css = generateThemeCSS(DEFAULTS);
    expect(css).toBe(
      ':root{--clr1:#FFFFFF;--clr2:#95a5a6;--clr3:#333333;--clr4:#1d1d1d;--clr5:#2c3e50;--clr6:#3eb34b;--clr7:#cb3327;--clr8:#ffc41d;--clr9:#f8f9fa;--clr10:#e9ecef;--dclr1:#121212;--dclr2:#b0b0b0;--dclr3:#1e1e1e;--dclr4:#0a0a0a;--dclr5:#33506f;--dclr6:#33a345;--dclr7:#ef4b3a;--dclr8:#ffcf33;--dclr9:#26262b;--dclr10:#3c3c3c;}',
    );
  });

  it('reflects a custom clr7 override instead of the default', () => {
    const custom = { ...DEFAULTS, clr7: '#ff0000' };
    const css = generateThemeCSS(custom);
    expect(css).toContain('--clr7:#ff0000');
    expect(css).not.toContain('--clr7:#cb3327');
    // All other vars remain unchanged
    expect(css).toContain('--dclr8:#ffcf33');
    expect(css).toContain('--clr1:#FFFFFF');
  });

  it('always wraps the block in :root{...} and emits each of the 20 variable names exactly once', () => {
    const css = generateThemeCSS(DEFAULTS);
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
    const vars = [
      ...Array.from({ length: 10 }, (_, i) => `--clr${i + 1}`),
      ...Array.from({ length: 10 }, (_, i) => `--dclr${i + 1}`),
    ];
    for (const v of vars) {
      // Append ':' so '--clr1:' does not match inside '--clr10:'.
      expect(css.split(`${v}:`).length - 1, `${v} should appear exactly once`).toBe(1);
    }
  });
});