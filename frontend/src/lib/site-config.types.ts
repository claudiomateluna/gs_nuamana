/**
 * Site Configuration Types
 * TypeScript interfaces for the configuracion_sitio table categories
 */

export type SiteConfigCategory =
  | 'branding'
  | 'social'
  | 'contact'
  | 'hero'
  | 'features'
  | 'faq'
  | 'testimonials'
  | 'visit'
  | 'seo'
  | 'pwa'
  | 'navigation'
  | 'theme_colors';

export interface ConfigEntry {
  id: string;
  categoria: SiteConfigCategory;
  clave: string;
  valor: unknown;
  descripcion: string | null;
}

// --- Category-specific types ---

export interface BrandingConfig {
  nombre_grupo: string;
  nombre_corto: string;
  pretitulo: string;
  slogan: string;
  mision: string;
  motto: string;
  logo_header: string;
  logo_footer: string;
  copyright: string;
}

export interface SocialConfig {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  google: string;
  whatsapp: string;
  email: string;
}

export interface ContactConfig {
  sede_nombre: string;
  direccion: string;
  maps_embed: string;
}

export interface HeroConfig {
  frases: string[];
  fondo: string;
  intervalo: number;
  imagenes_pool: string[];
  top_count: number;
  bottom_count: number;
}

export interface FeatureItem {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface FeaturesConfig {
  titulo_seccion: string;
  subtitulo: string;
  items: FeatureItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
  image: string;
}

export interface FaqConfig {
  titulo_seccion: string;
  subtitulo: string;
  items: FaqItem[];
}

export interface TestimonialsConfig {
  titulo_seccion: string;
  widget_url: string;
}

export interface VisitConfig {
  titulo: string;
  fecha_fundacion: string;
  email: string;
  email_href: string;
  horario: string;
  cta_texto: string;
  imagen: string;
}

export interface SeoConfig {
  title: string;
  description: string;
}

export interface PwaConfig {
  name: string;
  short_name: string;
  description: string;
  lang: string;
  icon_192: string;
  icon_512: string;
  icon_1024: string;
}

export interface NavigationConfig {
  label_panel: string;
  label_login: string;
}

export interface ThemeColorsConfig {
  // 24 hex color fields (clr1..clr12, dclr1..dclr12)
  clr1: string;
  clr2: string;
  clr3: string;
  clr4: string;
  clr5: string;
  clr6: string;
  clr7: string;
  clr8: string;
  clr9: string;
  clr10: string;
  clr11: string;
  clr12: string;
  dclr1: string;
  dclr2: string;
  dclr3: string;
  dclr4: string;
  dclr5: string;
  dclr6: string;
  dclr7: string;
  dclr8: string;
  dclr9: string;
  dclr10: string;
  dclr11: string;
  dclr12: string;
  // 24 opacity fields (0-100, default 100)
  clr1_opacity: number;
  clr2_opacity: number;
  clr3_opacity: number;
  clr4_opacity: number;
  clr5_opacity: number;
  clr6_opacity: number;
  clr7_opacity: number;
  clr8_opacity: number;
  clr9_opacity: number;
  clr10_opacity: number;
  clr11_opacity: number;
  clr12_opacity: number;
  dclr1_opacity: number;
  dclr2_opacity: number;
  dclr3_opacity: number;
  dclr4_opacity: number;
  dclr5_opacity: number;
  dclr6_opacity: number;
  dclr7_opacity: number;
  dclr8_opacity: number;
  dclr9_opacity: number;
  dclr10_opacity: number;
  dclr11_opacity: number;
  dclr12_opacity: number;
}

// --- Mapped config record ---

export interface SiteConfigRecord {
  branding: BrandingConfig;
  social: SocialConfig;
  contact: ContactConfig;
  hero: HeroConfig;
  features: FeaturesConfig;
  faq: FaqConfig;
  testimonials: TestimonialsConfig;
  visit: VisitConfig;
  seo: SeoConfig;
  pwa: PwaConfig;
  navigation: NavigationConfig;
  theme_colors: ThemeColorsConfig;
}
