/**
 * Hero Color Roles — pure utility functions for applying 13 configurable
 * color roles to the Hero component (gradient overlay, text, border colors).
 *
 * Design:
 *   - heclr1..heclr3 = light gradient stops
 *   - hedclr1..hedclr3 = dark gradient stops
 *   - heclr4 = light h2 text, hedclr4 = dark h2 text
 *   - heclr5 = light p text, hedclr5 = dark p text
 *   - heclr6..heclr13 = light-only border colors (8 roles, same in dark)
 *   - *_opacity = 0-100, default 100 → 100% opacity; <100 → rgba
 *
 * Dark mode is determined by the .dark class on <html>, NOT
 * prefers-color-scheme. The component reads it; these helpers accept
 * a resolved hex/opacity pair and return the CSS color string.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HeroColorConfig {
  // Gradient overlay — light (3)
  heclr1?: string;
  heclr2?: string;
  heclr3?: string;
  // Gradient overlay — dark (3)
  hedclr1?: string;
  hedclr2?: string;
  hedclr3?: string;
  // Texts — light (2)
  heclr4?: string;
  heclr5?: string;
  // Texts — dark (2)
  hedclr4?: string;
  hedclr5?: string;
  // Border colors — light only (8)
  heclr6?: string;
  heclr7?: string;
  heclr8?: string;
  heclr9?: string;
  heclr10?: string;
  heclr11?: string;
  heclr12?: string;
  heclr13?: string;
  // Opacities — light gradient (3)
  heclr1_opacity?: number;
  heclr2_opacity?: number;
  heclr3_opacity?: number;
  // Opacities — dark gradient (3)
  hedclr1_opacity?: number;
  hedclr2_opacity?: number;
  hedclr3_opacity?: number;
  // Opacities — light text (2)
  heclr4_opacity?: number;
  heclr5_opacity?: number;
  // Opacities — dark text (2)
  hedclr4_opacity?: number;
  hedclr5_opacity?: number;
  // Opacities — light borders (8)
  heclr6_opacity?: number;
  heclr7_opacity?: number;
  heclr8_opacity?: number;
  heclr9_opacity?: number;
  heclr10_opacity?: number;
  heclr11_opacity?: number;
  heclr12_opacity?: number;
  heclr13_opacity?: number;
}

// ---------------------------------------------------------------------------
// Hex-to-CSS helpers
// ---------------------------------------------------------------------------

const HEX6 = /^#([0-9a-fA-F]{6})$/;

/**
 * Converts a #RRGGBB hex + opacity (0-100) to a CSS color string.
 * - opacity undefined or 100 → plain hex (e.g. "#cb3327")
 * - 0 < opacity < 100 → rgba(r, g, b, opacity/100)
 * - opacity 0 → fully transparent rgba (r, g, b, 0)
 * - missing hex → fallback hex string
 */
export function heroHexToCSS(
  hex: string | undefined,
  opacity: number | undefined,
  fallback: string,
): string {
  const h = hex ?? fallback;
  if (opacity === undefined || opacity >= 100) return h;

  const match = HEX6.exec(h);
  if (!match) return h; // invalid hex — return as-is, will render in browser

  const r = parseInt(match[1].slice(0, 2), 16);
  const g = parseInt(match[1].slice(2, 4), 16);
  const b = parseInt(match[1].slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

/**
 * Resolves a dark/light hex+opacity pair based on isDark flag.
 */
export function heroResolve(
  lightHex: string | undefined,
  lightOpacity: number | undefined,
  darkHex: string | undefined,
  darkOpacity: number | undefined,
  isDark: boolean,
  fallback: string,
): string {
  if (isDark) {
    return heroHexToCSS(darkHex, darkOpacity, fallback);
  }
  return heroHexToCSS(lightHex, lightOpacity, fallback);
}

// ---------------------------------------------------------------------------
// Gradient builder
// ---------------------------------------------------------------------------

/**
 * Builds the CSS linear-gradient string for the hero overlay.
 *
 * Light:  from heclr1, via heclr2, to heclr3
 * Dark:   from hedclr1, via hedclr2, to hedclr3
 */
export function buildHeroGradient(config: HeroColorConfig, isDark: boolean): string {
  const [c1, c2, c3] = isDark
    ? [
        heroHexToCSS(config.hedclr1, config.hedclr1_opacity, '#121212'),
        heroHexToCSS(config.hedclr2, config.hedclr2_opacity, '#1e1e1e'),
        heroHexToCSS(config.hedclr3, config.hedclr3_opacity, '#121212'),
      ]
    : [
        heroHexToCSS(config.heclr1, config.heclr1_opacity, '#cb3327'),
        heroHexToCSS(config.heclr2, config.heclr2_opacity, '#cb3327'),
        heroHexToCSS(config.heclr3, config.heclr3_opacity, '#cb3327'),
      ];

  return `linear-gradient(to bottom, ${c1}, ${c2}, ${c3})`;
}

// ---------------------------------------------------------------------------
// Text color resolver
// ---------------------------------------------------------------------------

/**
 * Returns the h2 (title) color based on isDark mode.
 */
export function heroTitleColor(config: HeroColorConfig, isDark: boolean): string {
  return heroResolve(
    config.heclr4, config.heclr4_opacity,
    config.hedclr4, config.hedclr4_opacity,
    isDark, '#ffd700',
  );
}

/**
 * Returns the p (subtitle) color based on isDark mode.
 */
export function heroSubtitleColor(config: HeroColorConfig, isDark: boolean): string {
  return heroResolve(
    config.heclr5, config.heclr5_opacity,
    config.hedclr5, config.hedclr5_opacity,
    isDark, '#ffffff',
  );
}

// ---------------------------------------------------------------------------
// Border color pool
// ---------------------------------------------------------------------------

const BORDER_KEYS: Array<{ hex: string | undefined; opacity: number | undefined }> = [];

function borderEntries(config: HeroColorConfig) {
  return [
    { hex: config.heclr6, opacity: config.heclr6_opacity },
    { hex: config.heclr7, opacity: config.heclr7_opacity },
    { hex: config.heclr8, opacity: config.heclr8_opacity },
    { hex: config.heclr9, opacity: config.heclr9_opacity },
    { hex: config.heclr10, opacity: config.heclr10_opacity },
    { hex: config.heclr11, opacity: config.heclr11_opacity },
    { hex: config.heclr12, opacity: config.heclr12_opacity },
    { hex: config.heclr13, opacity: config.heclr13_opacity },
  ];
}

/**
 * Returns the CSS color for image border index `idx`, cycling through
 * the 8 configured border colors. Empty/undefined entries are skipped.
 * Falls back to the hex fallback for that role when hex is missing.
 */
const BORDER_DEFAULTS = [
  '#fca5a5', '#93c5fd', '#86efac', '#d8b4fe',
  '#fde047', '#fdba74', '#a5b4fc', '#f9a8d4',
];

export function pickHeroBorderColor(
  config: HeroColorConfig,
  idx: number,
): string {
  const entries = borderEntries(config);
  // Filter out entries where hex is empty/undefined
  const validEntries = entries.filter((e) => e.hex);
  if (validEntries.length === 0) return BORDER_DEFAULTS[idx % BORDER_DEFAULTS.length];
  const entry = validEntries[idx % validEntries.length];
  return heroHexToCSS(entry.hex, entry.opacity, BORDER_DEFAULTS[0]);
}
