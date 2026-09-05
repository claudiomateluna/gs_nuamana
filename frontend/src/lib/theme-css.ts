/**
 * Theme CSS generator — emits a minified `:root` block overriding the 76
 * globals.css color variables from DB-driven site config. The palette is
 * organized in 4 domain groups (38 roles), each with light + dark variants:
 *   - Base (10 light + 10 dark):    clr1..clr10 / dclr1..dclr10
 *   - Tarjetas (6 light + 6 dark):  tclr1..tclr6 / tdclr1..tdclr6
 *   - Header (13 light + 13 dark):  hclr1..hclr13 / hdclr1..hdclr13
 *   - Menú (9 light + 9 dark):      mclr1..mclr9 / mdclr1..mdclr9
 *
 * Opacity strategy (unified across ALL generators in this file):
 *   - opacity 100 or undefined → emit `--key:HEX` (backwards-compatible with
 *     pre-migration rows).
 *   - opacity < 100 → emit `--key:rgba(r,g,b,opacity/100)` directly. The alpha
 *     is baked into the variable value so Tailwind utilities like `bg-clr4`
 *     resolve the translucent color without any `/NN` modifier (those modifiers
 *     have been stripped from the components).
 *   - missing hex → `--key:` (empty declaration, keeps the count invariant
 *     honest).
 *
 * globals.css consumes two base tokens as semantic roots:
 *   `.dark { --background: var(--dclr1); --foreground: var(--dclr2); }`.
 *
 * Additional generators below emit their own `:root` blocks for the
 * CategoryPromoBanner, BlogSlideshow, Testimonials, VisitSection, FAQ, and
 * SecondaryHeader color configs — all sharing the same opacity strategy and
 * the private `hexToRgb` helper.
 *
 * Rendered server-side via `<style>` as the first child of `<body>` in
 * `RootLayout` so utilities consume the overrides with zero FOUC.
 */

import type { ThemeColorsConfig, HeaderColorsConfig, MenuColorsConfig, PanelColorsConfig } from './site-config.types';
import type { PromoColorsConfig } from './promo-colors';
import type { SlideshowColorsConfig } from './site-config.types';
import type { TestimonialsColorsConfig } from './site-config.types';
import type { VisitColorsConfig } from './site-config.types';
import type { FAQColorsConfig } from './site-config.types';
import type { SecondaryHeaderColorsConfig } from './site-config.types';
import type { FooterColorsConfig } from './site-config.types';

/**
 * Convert a `#RRGGBB` hex string to its `[r, g, b]` integer components.
 * Private to this module — shared by every generator below.
 */
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

const VAR_ORDER = [
  'clr1', 'clr2', 'clr3', 'clr4', 'clr5', 'clr6', 'clr7', 'clr8', 'clr9', 'clr10',
  'dclr1', 'dclr2', 'dclr3', 'dclr4', 'dclr5', 'dclr6', 'dclr7', 'dclr8', 'dclr9', 'dclr10',
  'tclr1', 'tclr2', 'tclr3', 'tclr4', 'tclr5', 'tclr6',
  'tdclr1', 'tdclr2', 'tdclr3', 'tdclr4', 'tdclr5', 'tdclr6',
  'hclr1', 'hclr2', 'hclr3', 'hclr4', 'hclr5', 'hclr6', 'hclr7', 'hclr8', 'hclr9', 'hclr10', 'hclr11', 'hclr12', 'hclr13',
  'hdclr1', 'hdclr2', 'hdclr3', 'hdclr4', 'hdclr5', 'hdclr6', 'hdclr7', 'hdclr8', 'hdclr9', 'hdclr10', 'hdclr11', 'hdclr12', 'hdclr13',
  'mclr1', 'mclr2', 'mclr3', 'mclr4', 'mclr5', 'mclr6', 'mclr7', 'mclr8', 'mclr9', 'mclr10', 'mclr11',
  'mdclr1', 'mdclr2', 'mdclr3', 'mdclr4', 'mdclr5', 'mdclr6', 'mdclr7', 'mdclr8', 'mdclr9', 'mdclr10', 'mdclr11',
] as const;

export function generateThemeCSS(theme: ThemeColorsConfig): string {
  const declarations = VAR_ORDER.map((key) => {
    const hex = theme[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof ThemeColorsConfig;
    const opacity = theme[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// CategoryPromoBanner — promo_colors → CSS variables (cbclr1-9 / cbdclr1-9)
// ---------------------------------------------------------------------------
//
// The banner consumes its 9 role pairs through Tailwind utilities
// (`text-cbclr4`, `dark:bg-cbdclr1`, `from-cbclr2`, ...) compiled against the
// `@theme` bindings in globals.css. This generator emits a dedicated minified
// `:root` block overriding those 18 variables from the DB-driven promo_colors
// config — rendered as a second `<style>` tag in RootLayout right after the
// theme block so the utilities resolve the DB values with zero FOUC.
//
// Opacity strategy: same unified strategy as the theme generator — admin
// `*_opacity` fields are honored. When < 100, the variable emits
// `rgba(r,g,b,opacity/100)` directly. Missing hex → empty declaration.

const PROMO_VAR_ORDER = [
  'cbclr1', 'cbclr2', 'cbclr3', 'cbclr4', 'cbclr5', 'cbclr6', 'cbclr7', 'cbclr8', 'cbclr9',
  'cbdclr1', 'cbdclr2', 'cbdclr3', 'cbdclr4', 'cbdclr5', 'cbdclr6', 'cbdclr7', 'cbdclr8', 'cbdclr9',
] as const;

export function generatePromoColorsCSS(promo: PromoColorsConfig): string {
  const declarations = PROMO_VAR_ORDER.map((key) => {
    const hex = promo[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof PromoColorsConfig;
    const opacity = promo[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// BlogSlideshow — slideshow_colors → CSS variables (bsclr1-9 / bsdclr1-9)
// ---------------------------------------------------------------------------
//
// The slideshow consumes its 9 role pairs through Tailwind utilities
// (`text-bsclr2`, `dark:bg-bsdclr1`, `from-bsclr5`, ...) compiled against the
// `@theme` bindings in globals.css. This generator emits a dedicated minified
// `:root` block overriding those 18 variables from the DB-driven slideshow_colors
// config — rendered as a third `<style>` tag in RootLayout right after the
// promo block so the utilities resolve the DB values with zero FOUC.
//
// Opacity strategy: same unified strategy — admin `*_opacity` fields are
// honored. When < 100, the variable emits `rgba(r,g,b,opacity/100)` directly.
// Missing hex → empty declaration.

const SLIDESHOW_VAR_ORDER = [
  'bsclr1', 'bsclr2', 'bsclr3', 'bsclr4', 'bsclr5', 'bsclr6', 'bsclr7', 'bsclr8', 'bsclr9',
  'bsdclr1', 'bsdclr2', 'bsdclr3', 'bsdclr4', 'bsdclr5', 'bsdclr6', 'bsdclr7', 'bsdclr8', 'bsdclr9',
] as const;

export function generateSlideshowColorsCSS(slideshow: SlideshowColorsConfig): string {
  const declarations = SLIDESHOW_VAR_ORDER.map((key) => {
    const hex = slideshow[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof SlideshowColorsConfig;
    const opacity = slideshow[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// Testimonials — testimonials_colors → CSS variables (tsclr1-8 / tsdclr1-8)
// ---------------------------------------------------------------------------
//
// The Testimonials section consumes its 8 role pairs through Tailwind utilities
// (`bg-tsclr1`, `dark:bg-tsdclr4`, `text-tsclr2`, `border-tsclr8`, ...) compiled
// against the `@theme` bindings in globals.css. This generator emits a dedicated
// minified `:root` block overriding those 16 variables from the DB-driven
// testimonials_colors config — rendered as a fourth `<style>` tag in RootLayout
// right after the slideshow block so the utilities resolve the DB values with
// zero FOUC.
//
// Opacity strategy: same unified strategy — admin `*_opacity` fields are
// honored. When < 100, the variable emits `rgba(r,g,b,opacity/100)` directly.
// Missing hex → empty declaration.

const TESTIMONIALS_VAR_ORDER = [
  'tsclr1', 'tsclr2', 'tsclr3', 'tsclr4', 'tsclr5', 'tsclr6', 'tsclr7', 'tsclr8',
  'tsdclr1', 'tsdclr2', 'tsdclr3', 'tsdclr4', 'tsdclr5', 'tsdclr6', 'tsdclr7', 'tsdclr8',
] as const;

export function generateTestimonialsColorsCSS(testimonials: TestimonialsColorsConfig): string {
  const declarations = TESTIMONIALS_VAR_ORDER.map((key) => {
    const hex = testimonials[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof TestimonialsColorsConfig;
    const opacity = testimonials[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// VisitSection — visit_colors → CSS variables (vsclr1-9 / vsdclr1-9)
// ---------------------------------------------------------------------------
//
// The VisitSection consumes its 9 role pairs through Tailwind utilities
// (`bg-vsclr1`, `dark:bg-vsdclr1`, `text-vsclr2`, `from-vsclr3`, ...) compiled
// against the `@theme` bindings in globals.css. This generator emits a
// dedicated minified `:root` block overriding those 18 variables from the
// DB-driven visit_colors config — rendered as a fifth `<style>` tag in
// RootLayout right after the testimonials block so the utilities resolve the
// DB values with zero FOUC.
//
// Opacity strategy: same unified strategy — admin `*_opacity` fields are
// honored. When < 100, the variable emits `rgba(r,g,b,opacity/100)` directly.
// Missing hex → empty declaration.

const VISIT_VAR_ORDER = [
  'vsclr1', 'vsclr2', 'vsclr3', 'vsclr4', 'vsclr5', 'vsclr6', 'vsclr7', 'vsclr8', 'vsclr9',
  'vsdclr1', 'vsdclr2', 'vsdclr3', 'vsdclr4', 'vsdclr5', 'vsdclr6', 'vsdclr7', 'vsdclr8', 'vsdclr9',
] as const;

export function generateVisitColorsCSS(visit: VisitColorsConfig): string {
  const declarations = VISIT_VAR_ORDER.map((key) => {
    const hex = visit[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof VisitColorsConfig;
    const opacity = visit[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// FAQ — faq_colors → CSS variables (fclr1-8 / fdclr1-8)
// ---------------------------------------------------------------------------
//
// The FAQ section consumes its 8 role pairs through Tailwind utilities
// (`bg-fclr1`, `dark:bg-fdclr4`, `text-fclr2`, `border-fclr7`, ...) compiled
// against the `@theme` bindings in globals.css. This generator emits a
// dedicated minified `:root` block overriding those 16 variables from the
// DB-driven faq_colors config — rendered as a sixth `<style>` tag in RootLayout
// right after the visit block so the utilities resolve the DB values with
// zero FOUC.
//
// Opacity strategy: same unified strategy — admin `*_opacity` fields are
// honored. When < 100, the variable emits `rgba(r,g,b,opacity/100)` directly.
// Missing hex → empty declaration.

const FAQ_VAR_ORDER = [
  'fclr1', 'fclr2', 'fclr3', 'fclr4', 'fclr5', 'fclr6', 'fclr7', 'fclr8',
  'fdclr1', 'fdclr2', 'fdclr3', 'fdclr4', 'fdclr5', 'fdclr6', 'fdclr7', 'fdclr8',
] as const;

export function generateFAQColorsCSS(faq: FAQColorsConfig): string {
  const declarations = FAQ_VAR_ORDER.map((key) => {
    const hex = faq[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof FAQColorsConfig;
    const opacity = faq[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// SecondaryHeader — secondary_header_colors → CSS variables (shclr1-14 / shdclr1-14)
// ---------------------------------------------------------------------------
//
// The SecondaryHeader consumes its 14 role pairs through Tailwind utilities
// (`text-shclr4`, `dark:bg-shdclr1`, `from-shclr12`, ...) compiled against the
// `@theme` bindings in globals.css. This generator emits a dedicated minified
// `:root` block overriding those 28 variables from the DB-driven
// secondary_header_colors config — rendered as a seventh `<style>` tag in
// RootLayout right after the FAQ block so the utilities resolve the DB values
// with zero FOUC.
//
// Opacity strategy: same unified strategy — admin `*_opacity` fields are
// honored. When < 100, the variable emits `rgba(r,g,b,opacity/100)` directly.
// Missing hex → empty declaration.

const SECONDARY_HEADER_VAR_ORDER = [
  'shclr1', 'shclr2', 'shclr3', 'shclr4', 'shclr5', 'shclr6',
  'shclr7', 'shclr8', 'shclr9', 'shclr10', 'shclr11', 'shclr12', 'shclr13', 'shclr14',
  'shdclr1', 'shdclr2', 'shdclr3', 'shdclr4', 'shdclr5', 'shdclr6',
  'shdclr7', 'shdclr8', 'shdclr9', 'shdclr10', 'shdclr11', 'shdclr12', 'shdclr13', 'shdclr14',
] as const;

export function generateSecondaryHeaderColorsCSS(sh: SecondaryHeaderColorsConfig): string {
  const declarations = SECONDARY_HEADER_VAR_ORDER.map((key) => {
    const hex = sh[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof SecondaryHeaderColorsConfig;
    const opacity = sh[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// Footer — footer_colors → CSS variables (foclr1-10 / fodclr1-10)
// ---------------------------------------------------------------------------
//
// The Footer consumes its 10 role pairs through Tailwind utilities
// (`bg-foclr7`, `dark:bg-fodclr7`, `text-foclr4`, `from-foclr1`, ...) compiled
// against the `@theme` bindings in globals.css. This generator emits a
// dedicated minified `:root` block overriding those 20 variables from the
// DB-driven footer_colors config — rendered as an eighth `<style>` tag in
// RootLayout right after the SecondaryHeader block so the utilities resolve
// the DB values with zero FOUC.
//
// Opacity strategy: same unified strategy — admin `*_opacity` fields are
// honored. When < 100, the variable emits `rgba(r,g,b,opacity/100)` directly.
// Missing hex → empty declaration.

const FOOTER_VAR_ORDER = [
  'foclr1', 'foclr2', 'foclr3', 'foclr4', 'foclr5', 'foclr6', 'foclr7', 'foclr8', 'foclr9', 'foclr10',
  'fodclr1', 'fodclr2', 'fodclr3', 'fodclr4', 'fodclr5', 'fodclr6', 'fodclr7', 'fodclr8', 'fodclr9', 'fodclr10',
] as const;

export function generateFooterColorsCSS(footer: FooterColorsConfig): string {
  const declarations = FOOTER_VAR_ORDER.map((key) => {
    const hex = footer[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof FooterColorsConfig;
    const opacity = footer[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// Header — header_colors → CSS variables (hclr1-13 / hdclr1-13)
// ---------------------------------------------------------------------------

const HEADER_VAR_ORDER = [
  'hclr1', 'hclr2', 'hclr3', 'hclr4', 'hclr5', 'hclr6', 'hclr7', 'hclr8', 'hclr9', 'hclr10', 'hclr11', 'hclr12', 'hclr13',
  'hdclr1', 'hdclr2', 'hdclr3', 'hdclr4', 'hdclr5', 'hdclr6', 'hdclr7', 'hdclr8', 'hdclr9', 'hdclr10', 'hdclr11', 'hdclr12', 'hdclr13',
] as const;

export function generateHeaderColorsCSS(header: HeaderColorsConfig): string {
  const declarations = HEADER_VAR_ORDER.map((key) => {
    const hex = header[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof HeaderColorsConfig;
    const opacity = header[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// Menú — menu_colors → CSS variables (mclr1-11 / mdclr1-11)
// ---------------------------------------------------------------------------

const MENU_VAR_ORDER = [
  'mclr1', 'mclr2', 'mclr3', 'mclr4', 'mclr5', 'mclr6', 'mclr7', 'mclr8', 'mclr9', 'mclr10', 'mclr11',
  'mdclr1', 'mdclr2', 'mdclr3', 'mdclr4', 'mdclr5', 'mdclr6', 'mdclr7', 'mdclr8', 'mdclr9', 'mdclr10', 'mdclr11',
] as const;

export function generateMenuColorsCSS(menu: MenuColorsConfig): string {
  const declarations = MENU_VAR_ORDER.map((key) => {
    const hex = menu[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof MenuColorsConfig;
    const opacity = menu[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

// ---------------------------------------------------------------------------
// Panel — panel_colors → CSS variables (pclr1-14 / pdclr1-14)
// ---------------------------------------------------------------------------
//
// The Panel area consumes its 14 role pairs through Tailwind utilities
// (`text-pclr4`, `dark:text-pdclr4`, `bg-pclr1`, `dark:bg-pdclr1`, ...) compiled
// against the `@theme` bindings in globals.css. This generator emits a dedicated
// minified `:root` block overriding those 28 variables from the DB-driven
// panel_colors config — rendered as a ninth `<style>` tag in RootLayout.

const PANEL_VAR_ORDER = [
  'pclr1', 'pclr2', 'pclr3', 'pclr4', 'pclr5', 'pclr6', 'pclr7', 'pclr8', 'pclr9', 'pclr10', 'pclr11', 'pclr12', 'pclr13', 'pclr14',
  'pdclr1', 'pdclr2', 'pdclr3', 'pdclr4', 'pdclr5', 'pdclr6', 'pdclr7', 'pdclr8', 'pdclr9', 'pdclr10', 'pdclr11', 'pdclr12', 'pdclr13', 'pdclr14',
] as const;

export function generatePanelColorsCSS(panel: PanelColorsConfig): string {
  const declarations = PANEL_VAR_ORDER.map((key) => {
    const hex = panel[key];
    if (!hex) return `--${key}:`;
    const opacityKey = `${key}_opacity` as keyof PanelColorsConfig;
    const opacity = panel[opacityKey] as number | undefined;
    if (opacity === undefined || opacity >= 100) return `--${key}:${hex}`;
    const [r, g, b] = hexToRgb(hex);
    return `--${key}:rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }).join(';');
  return `:root{${declarations};}`;
}

