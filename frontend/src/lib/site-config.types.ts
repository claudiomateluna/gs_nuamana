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
  | 'navigation';

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
  theme_color: string;
}

export interface PwaConfig {
  name: string;
  short_name: string;
  description: string;
  background_color: string;
  theme_color: string;
  lang: string;
  icon_192: string;
  icon_512: string;
  icon_1024: string;
}

export interface NavigationConfig {
  label_panel: string;
  label_login: string;
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
}
