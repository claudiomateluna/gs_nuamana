/**
 * Features Color Roles — pure utility functions for applying 9 configurable
 * color roles to the Features section (section background, title, subtitle,
 * gradient, item text, description, link bar).
 *
 * Design:
 *   - feclr1..feclr9 = light colors (section bg, titles, gradient stops, item text, link)
 *   - fedclr1..fedclr9 = dark variants
 *   - *_opacity = 0-100, default 100 → plain hex; <100 → rgba
 *
 * Dark mode is determined by the .dark class on <html>, NOT
 * prefers-color-scheme.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeaturesColorConfig {
  // Section background — light (1)
  feclr9?: string;
  // Section background — dark (1)
  fedclr9?: string;
  // Section title + subtitle — light (2)
  feclr1?: string;
  feclr2?: string;
  // Section title + subtitle — dark (2)
  fedclr1?: string;
  fedclr2?: string;
  // Gradient stops — light (3)
  feclr3?: string;
  feclr4?: string;
  feclr5?: string;
  // Gradient stops — dark (3)
  fedclr3?: string;
  fedclr4?: string;
  fedclr5?: string;
  // Item text — light (3)
  feclr6?: string;
  feclr7?: string;
  feclr8?: string;
  // Item text — dark (3)
  fedclr6?: string;
  fedclr7?: string;
  fedclr8?: string;
  // Opacities — light (9)
  feclr1_opacity?: number;
  feclr2_opacity?: number;
  feclr3_opacity?: number;
  feclr4_opacity?: number;
  feclr5_opacity?: number;
  feclr6_opacity?: number;
  feclr7_opacity?: number;
  feclr8_opacity?: number;
  feclr9_opacity?: number;
  // Opacities — dark (9)
  fedclr1_opacity?: number;
  fedclr2_opacity?: number;
  fedclr3_opacity?: number;
  fedclr4_opacity?: number;
  fedclr5_opacity?: number;
  fedclr6_opacity?: number;
  fedclr7_opacity?: number;
  fedclr8_opacity?: number;
  fedclr9_opacity?: number;
}

// ---------------------------------------------------------------------------
// Hex-to-CSS helpers (mirrors hero-hexToCSS)
// ---------------------------------------------------------------------------

const HEX6 = /^#([0-9a-fA-F]{6})$/;

/**
 * Converts a #RRGGBB hex + opacity (0-100) to a CSS color string.
 * - opacity undefined or 100 → plain hex (e.g. "#2d3748")
 * - 0 < opacity < 100 → rgba(r, g, b, opacity/100)
 * - opacity 0 → fully transparent rgba (r, g, b, 0)
 * - missing hex → fallback hex string
 */
export function featuresHexToCSS(
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
export function featuresResolve(
  lightHex: string | undefined,
  lightOpacity: number | undefined,
  darkHex: string | undefined,
  darkOpacity: number | undefined,
  isDark: boolean,
  fallback: string,
): string {
  if (isDark) {
    return featuresHexToCSS(darkHex, darkOpacity, fallback);
  }
  return featuresHexToCSS(lightHex, lightOpacity, fallback);
}

// ---------------------------------------------------------------------------
// Section title color (feclr1 / fedclr1)
// ---------------------------------------------------------------------------

export function featuresTitleColor(config: FeaturesColorConfig, isDark: boolean): string {
  return featuresResolve(
    config.feclr1, config.feclr1_opacity,
    config.fedclr1, config.fedclr1_opacity,
    isDark,
    isDark ? '#f7fafc' : '#2d3748',
  );
}

// ---------------------------------------------------------------------------
// Section subtitle color (feclr2 / fedclr2)
// ---------------------------------------------------------------------------

export function featuresSubtitleColor(config: FeaturesColorConfig, isDark: boolean): string {
  return featuresResolve(
    config.feclr2, config.feclr2_opacity,
    config.fedclr2, config.fedclr2_opacity,
    isDark,
    isDark ? '#e2e8f0' : '#4a5568',
  );
}

// ---------------------------------------------------------------------------
// Gradient builder (feclr3-5 / fedclr3-5)
// ---------------------------------------------------------------------------

/**
 * Builds the CSS linear-gradient string for the features card overlay.
 * Light:  from feclr3, via feclr4, to feclr5
 * Dark:   from fedclr3, via fedclr4, to fedclr5
 */
export function buildFeaturesGradient(config: FeaturesColorConfig, isDark: boolean): string {
  const [c1, c2, c3] = isDark
    ? [
        featuresHexToCSS(config.fedclr3, config.fedclr3_opacity, '#1a202c'),
        featuresHexToCSS(config.fedclr4, config.fedclr4_opacity, '#2d3748'),
        featuresHexToCSS(config.fedclr5, config.fedclr5_opacity, '#4a5568'),
      ]
    : [
        featuresHexToCSS(config.feclr3, config.feclr3_opacity, '#edf2f7'),
        featuresHexToCSS(config.feclr4, config.feclr4_opacity, '#e2e8f0'),
        featuresHexToCSS(config.feclr5, config.feclr5_opacity, '#cbd5e0'),
      ];

  return `linear-gradient(to bottom, ${c1}, ${c2}, ${c3})`;
}

// ---------------------------------------------------------------------------
// Item title color (feclr6 / fedclr6)
// ---------------------------------------------------------------------------

export function featuresItemTitleColor(config: FeaturesColorConfig, isDark: boolean): string {
  return featuresResolve(
    config.feclr6, config.feclr6_opacity,
    config.fedclr6, config.fedclr6_opacity,
    isDark,
    isDark ? '#f7fafc' : '#2d3748',
  );
}

// ---------------------------------------------------------------------------
// Item description color (feclr7 / fedclr7)
// ---------------------------------------------------------------------------

export function featuresItemDescColor(config: FeaturesColorConfig, isDark: boolean): string {
  return featuresResolve(
    config.feclr7, config.feclr7_opacity,
    config.fedclr7, config.fedclr7_opacity,
    isDark,
    isDark ? '#e2e8f0' : '#4a5568',
  );
}

// ---------------------------------------------------------------------------
// Link bar color (feclr8 / fedclr8)
// ---------------------------------------------------------------------------

export function featuresLinkBarColor(config: FeaturesColorConfig, isDark: boolean): string {
  return featuresResolve(
    config.feclr8, config.feclr8_opacity,
    config.fedclr8, config.fedclr8_opacity,
    isDark,
    isDark ? '#f6ad55' : '#ed8936',
  );
}

// ---------------------------------------------------------------------------
// Section background color (feclr9 / fedclr9)
// ---------------------------------------------------------------------------

export function featuresSectionBgColor(config: FeaturesColorConfig, isDark: boolean): string {
  return featuresResolve(
    config.feclr9, config.feclr9_opacity,
    config.fedclr9, config.fedclr9_opacity,
    isDark,
    isDark ? '#1a202c' : '#edf2f7',
  );
}
