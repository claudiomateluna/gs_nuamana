/**
 * CategoryPromoBanner Color Roles — pure utility functions for applying 9
 * configurable color roles to the CategoryPromoBanner component (section
 * background, container background, gradient, title, text, number/accent,
 * link, border).
 *
 * Design:
 *   - cbclr1..cbclr9 = light colors
 *   - cbdclr1..cbdclr9 = dark variants
 *   - *_opacity = 0-100, default 100 → plain hex; <100 → rgba
 *
 * Dark mode is determined by the .dark class on <html>, NOT
 * prefers-color-scheme.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PromoColorsConfig {
  // Container bg — light (1)
  cbclr1?: string;
  // Container bg — dark (1)
  cbdclr1?: string;
  // Gradient from — light (2)
  cbclr2?: string;
  // Gradient from — dark (2)
  cbdclr2?: string;
  // Gradient to — light (3)
  cbclr3?: string;
  // Gradient to — dark (3)
  cbdclr3?: string;
  // Title — light (4)
  cbclr4?: string;
  // Title — dark (4)
  cbdclr4?: string;
  // Text — light (5)
  cbclr5?: string;
  // Text — dark (5)
  cbdclr5?: string;
  // Number/accent — light (6)
  cbclr6?: string;
  // Number/accent — dark (6)
  cbdclr6?: string;
  // Links — light (7)
  cbclr7?: string;
  // Links — dark (7)
  cbdclr7?: string;
  // Border — light (8)
  cbclr8?: string;
  // Border — dark (8)
  cbdclr8?: string;
  // Section background — light (9)
  cbclr9?: string;
  // Section background — dark (9)
  cbdclr9?: string;
  // Opacities — light (9)
  cbclr1_opacity?: number;
  cbclr2_opacity?: number;
  cbclr3_opacity?: number;
  cbclr4_opacity?: number;
  cbclr5_opacity?: number;
  cbclr6_opacity?: number;
  cbclr7_opacity?: number;
  cbclr8_opacity?: number;
  cbclr9_opacity?: number;
  // Opacities — dark (9)
  cbdclr1_opacity?: number;
  cbdclr2_opacity?: number;
  cbdclr3_opacity?: number;
  cbdclr4_opacity?: number;
  cbdclr5_opacity?: number;
  cbdclr6_opacity?: number;
  cbdclr7_opacity?: number;
  cbdclr8_opacity?: number;
  cbdclr9_opacity?: number;
}

// ---------------------------------------------------------------------------
// Hex-to-CSS helpers (mirrors featuresHexToCSS)
// ---------------------------------------------------------------------------

const HEX6 = /^#([0-9a-fA-F]{6})$/;

/**
 * Converts a #RRGGBB hex + opacity (0-100) to a CSS color string.
 * - opacity undefined or 100 → plain hex (e.g. "#edf2f7")
 * - 0 < opacity < 100 → rgba(r, g, b, opacity/100)
 * - opacity 0 → fully transparent rgba (r, g, b, 0)
 * - missing hex → fallback hex string
 */
export function promoHexToCSS(
  hex: string | undefined,
  opacity: number | undefined,
  fallback: string,
): string {
  const h = hex ?? fallback;
  if (opacity === undefined || opacity >= 100) return h;

  const match = HEX6.exec(h);
  if (!match) return h;

  const r = parseInt(match[1].slice(0, 2), 16);
  const g = parseInt(match[1].slice(2, 4), 16);
  const b = parseInt(match[1].slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

/**
 * Resolves a light/dark hex+opacity pair based on isDark flag.
 */
export function promoResolve(
  lightHex: string | undefined,
  lightOpacity: number | undefined,
  darkHex: string | undefined,
  darkOpacity: number | undefined,
  isDark: boolean,
  fallback: string,
): string {
  if (isDark) {
    return promoHexToCSS(darkHex, darkOpacity, fallback);
  }
  return promoHexToCSS(lightHex, lightOpacity, fallback);
}

// ---------------------------------------------------------------------------
// Container background color (cbclr1 / cbdclr1)
// ---------------------------------------------------------------------------

export function promoContainerBgColor(config: PromoColorsConfig, isDark: boolean): string {
  return promoResolve(
    config.cbclr1, config.cbclr1_opacity,
    config.cbdclr1, config.cbdclr1_opacity,
    isDark,
    isDark ? '#1a202c' : '#edf2f7',
  );
}

// ---------------------------------------------------------------------------
// Container gradient builder (cbclr2-3 / cbdclr2-3)
// ---------------------------------------------------------------------------

/**
 * Builds the CSS linear-gradient string for the promo container.
 * Light:  from cbclr2, to cbclr3
 * Dark:   from cbdclr2, to cbdclr3
 */
export function buildPromoContainerGradient(config: PromoColorsConfig, isDark: boolean): string {
  const [c1, c2] = isDark
    ? [
        promoHexToCSS(config.cbdclr2, config.cbdclr2_opacity, '#2d3748'),
        promoHexToCSS(config.cbdclr3, config.cbdclr3_opacity, '#4a5568'),
      ]
    : [
        promoHexToCSS(config.cbclr2, config.cbclr2_opacity, '#e2e8f0'),
        promoHexToCSS(config.cbclr3, config.cbclr3_opacity, '#cbd5e0'),
      ];

  return `linear-gradient(to bottom right, ${c1}, ${c2})`;
}

// ---------------------------------------------------------------------------
// Title color (cbclr4 / cbdclr4)
// ---------------------------------------------------------------------------

export function promoTitleColor(config: PromoColorsConfig, isDark: boolean): string {
  return promoResolve(
    config.cbclr4, config.cbclr4_opacity,
    config.cbdclr4, config.cbdclr4_opacity,
    isDark,
    isDark ? '#f7fafc' : '#2c3e50',
  );
}

// ---------------------------------------------------------------------------
// Text color (cbclr5 / cbdclr5)
// ---------------------------------------------------------------------------

export function promoTextColor(config: PromoColorsConfig, isDark: boolean): string {
  return promoResolve(
    config.cbclr5, config.cbclr5_opacity,
    config.cbdclr5, config.cbdclr5_opacity,
    isDark,
    isDark ? '#e2e8f0' : '#4a5568',
  );
}

// ---------------------------------------------------------------------------
// Number/accent color (cbclr6 / cbdclr6)
// ---------------------------------------------------------------------------

export function promoNumberColor(config: PromoColorsConfig, isDark: boolean): string {
  return promoResolve(
    config.cbclr6, config.cbclr6_opacity,
    config.cbdclr6, config.cbdclr6_opacity,
    isDark,
    isDark ? '#ef4b3a' : '#cb3327',
  );
}

// ---------------------------------------------------------------------------
// Link color (cbclr7 / cbdclr7)
// ---------------------------------------------------------------------------

export function promoLinkColor(config: PromoColorsConfig, isDark: boolean): string {
  return promoResolve(
    config.cbclr7, config.cbclr7_opacity,
    config.cbdclr7, config.cbdclr7_opacity,
    isDark,
    isDark ? '#33506f' : '#2c3e50',
  );
}

// ---------------------------------------------------------------------------
// Border color (cbclr8 / cbdclr8)
// ---------------------------------------------------------------------------

export function promoBorderColor(config: PromoColorsConfig, isDark: boolean): string {
  return promoResolve(
    config.cbclr8, config.cbclr8_opacity,
    config.cbdclr8, config.cbdclr8_opacity,
    isDark,
    isDark ? '#3c3c3c' : '#e9ecef',
  );
}
