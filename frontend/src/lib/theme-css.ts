/**
 * Theme CSS generator — emits a minified `:root` block overriding the 24
 * `globals.css` color variables (`--clr1`..`--clr12`, `--dclr1`..`--dclr12`)
 * from DB-driven site config. When a color has opacity < 100, the var is
 * emitted as `rgba(r, g, b, opacity/100)`; when opacity is 100 or undefined,
 * the hex value is emitted as-is (backwards-compatible with pre-migration rows).
 *
 * The 12 `--dclrN` (dark) variables are the dark-mode palette the admin edits
 * under "Colores del Tema". globals.css consumes two of them as semantic
 * roots: `.dark { --background: var(--dclr1); --foreground: var(--dclr2); }`.
 *
 * Rendered server-side via `<style>` as the first child of `<body>` in
 * `RootLayout` so utilities consume the overrides with zero FOUC.
 */

import type { ThemeColorsConfig } from './site-config.types';

const VAR_ORDER = [
  'clr1', 'clr2', 'clr3', 'clr4', 'clr5', 'clr6', 'clr7', 'clr8', 'clr9', 'clr10', 'clr11', 'clr12',
  'dclr1', 'dclr2', 'dclr3', 'dclr4', 'dclr5', 'dclr6', 'dclr7', 'dclr8', 'dclr9', 'dclr10', 'dclr11', 'dclr12',
] as const;

/**
 * Parse a #RRGGBB hex string into [r, g, b] integers.
 * Case-insensitive — accepts both #FFFFFF and #ffffff.
 */
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function generateThemeCSS(theme: ThemeColorsConfig): string {
  const declarations = VAR_ORDER.map((key) => {
    const hex = theme[key];
    const opacityKey = `${key}_opacity` as keyof ThemeColorsConfig;
    const opacity = theme[opacityKey] as number | undefined;

    // Undefined or 100 → emit plain hex (backwards-compatible with pre-migration rows)
    if (opacity === undefined || opacity >= 100) {
      return `--${key}:${hex}`;
    }

    // Less than 100 → emit rgba with opacity/100
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}
