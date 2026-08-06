/**
 * Theme CSS generator — emits a minified `:root` block overriding the 20
 * `globals.css` color variables (`--clr1`..`--clr10`, `--dclr1`..`--dclr10`)
 * from DB-driven site config. Rendered server-side via `<style>` as the first
 * child of `<body>` in `RootLayout` so utilities consume the overrides with
 * zero FOUC. Only the 20 palette vars are emitted — the `--background` /
 * `--foreground` aliases reference `--clr1` / `--clr4` and update implicitly.
 */

import type { ThemeColorsConfig } from './site-config.types';

const VAR_ORDER = [
  'clr1', 'clr2', 'clr3', 'clr4', 'clr5', 'clr6', 'clr7', 'clr8', 'clr9', 'clr10',
  'dclr1', 'dclr2', 'dclr3', 'dclr4', 'dclr5', 'dclr6', 'dclr7', 'dclr8', 'dclr9', 'dclr10',
] as const;

export function generateThemeCSS(theme: ThemeColorsConfig): string {
  const declarations = VAR_ORDER.map((key) => `--${key}:${theme[key]}`).join(';');
  return `:root{${declarations};}`;
}