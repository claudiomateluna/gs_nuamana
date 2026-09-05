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
  | 'theme_colors'
  | 'header_colors'
  | 'menu_colors'
  | 'promo_colors'
  | 'slideshow_colors'
  | 'testimonials_colors'
  | 'visit_colors'
  | 'faq_colors'
  | 'secondary_header_colors'
  | 'footer_colors'
  | 'section_visibility'
  | 'social_list';

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
  logo_sidebar?: string;
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

export interface SocialItem {
  id?: string;
  icon: string;
  label: string;
  url: string;
  enabled: boolean;
  order: number;
  /** Where this network appears: 'header', 'menu', 'footer', or combinations like 'header,menu' */
  placement: string;
}

export interface SocialListConfig {
  items: SocialItem[];
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
  // Border colors — light (8)
  heclr6?: string;
  heclr7?: string;
  heclr8?: string;
  heclr9?: string;
  heclr10?: string;
  heclr11?: string;
  heclr12?: string;
  heclr13?: string;
  // Border colors — dark (8)
  hedclr6?: string;
  hedclr7?: string;
  hedclr8?: string;
  hedclr9?: string;
  hedclr10?: string;
  hedclr11?: string;
  hedclr12?: string;
  hedclr13?: string;
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
  // Opacities — dark borders (8)
  hedclr6_opacity?: number;
  hedclr7_opacity?: number;
  hedclr8_opacity?: number;
  hedclr9_opacity?: number;
  hedclr10_opacity?: number;
  hedclr11_opacity?: number;
  hedclr12_opacity?: number;
  hedclr13_opacity?: number;
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
  // 9 color roles × light + dark (18 hex fields) + 9 light opacities + 9 dark opacities = 36
  feclr1?: string;
  fedclr1?: string;
  feclr1_opacity?: number;
  fedclr1_opacity?: number;
  feclr2?: string;
  fedclr2?: string;
  feclr2_opacity?: number;
  fedclr2_opacity?: number;
  feclr3?: string;
  fedclr3?: string;
  feclr3_opacity?: number;
  fedclr3_opacity?: number;
  feclr4?: string;
  fedclr4?: string;
  feclr4_opacity?: number;
  fedclr4_opacity?: number;
  feclr5?: string;
  fedclr5?: string;
  feclr5_opacity?: number;
  fedclr5_opacity?: number;
  feclr6?: string;
  fedclr6?: string;
  feclr6_opacity?: number;
  fedclr6_opacity?: number;
  feclr7?: string;
  fedclr7?: string;
  feclr7_opacity?: number;
  fedclr7_opacity?: number;
  feclr8?: string;
  fedclr8?: string;
  feclr8_opacity?: number;
  fedclr8_opacity?: number;
  feclr9?: string;
  fedclr9?: string;
  feclr9_opacity?: number;
  fedclr9_opacity?: number;
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
  // 76 hex color fields (38 light + 38 dark). All optional: pre-migration rows
  // and partial DB writes may omit some; callers fall back to DEFAULT_SITE_CONFIG.
  // Base (10 light + 10 dark)
  clr1?: string;
  clr2?: string;
  clr3?: string;
  clr4?: string;
  clr5?: string;
  clr6?: string;
  clr7?: string;
  clr8?: string;
  clr9?: string;
  clr10?: string;
  dclr1?: string;
  dclr2?: string;
  dclr3?: string;
  dclr4?: string;
  dclr5?: string;
  dclr6?: string;
  dclr7?: string;
  dclr8?: string;
  dclr9?: string;
  dclr10?: string;
  // Tarjetas (6 light + 6 dark)
  tclr1?: string;
  tclr2?: string;
  tclr3?: string;
  tclr4?: string;
  tclr5?: string;
  tclr6?: string;
  tdclr1?: string;
  tdclr2?: string;
  tdclr3?: string;
  tdclr4?: string;
  tdclr5?: string;
  tdclr6?: string;
  // Header (13 light + 13 dark)
  hclr1?: string;
  hclr2?: string;
  hclr3?: string;
  hclr4?: string;
  hclr5?: string;
  hclr6?: string;
  hclr7?: string;
  hclr8?: string;
  hclr9?: string;
  hclr10?: string;
  hclr11?: string;
  hclr12?: string;
  hclr13?: string;
  hdclr1?: string;
  hdclr2?: string;
  hdclr3?: string;
  hdclr4?: string;
  hdclr5?: string;
  hdclr6?: string;
  hdclr7?: string;
  hdclr8?: string;
  hdclr9?: string;
  hdclr10?: string;
  hdclr11?: string;
  hdclr12?: string;
  hdclr13?: string;
  // Menú (9 light + 9 dark)
  mclr1?: string;
  mclr2?: string;
  mclr3?: string;
  mclr4?: string;
  mclr5?: string;
  mclr6?: string;
  mclr7?: string;
  mclr8?: string;
  mclr9?: string;
  mclr10?: string;
  mclr11?: string;
  mdclr1?: string;
  mdclr2?: string;
  mdclr3?: string;
  mdclr4?: string;
  mdclr5?: string;
  mdclr6?: string;
  mdclr7?: string;
  mdclr8?: string;
  mdclr9?: string;
  mdclr10?: string;
  mdclr11?: string;
  // 76 opacity fields (0-100, default 100). Each pairs with its color: light
  // color → light opacity, dark color → dark opacity.
  // Base opacity
  clr1_opacity?: number;
  clr2_opacity?: number;
  clr3_opacity?: number;
  clr4_opacity?: number;
  clr5_opacity?: number;
  clr6_opacity?: number;
  clr7_opacity?: number;
  clr8_opacity?: number;
  clr9_opacity?: number;
  clr10_opacity?: number;
  dclr1_opacity?: number;
  dclr2_opacity?: number;
  dclr3_opacity?: number;
  dclr4_opacity?: number;
  dclr5_opacity?: number;
  dclr6_opacity?: number;
  dclr7_opacity?: number;
  dclr8_opacity?: number;
  dclr9_opacity?: number;
  dclr10_opacity?: number;
  // Tarjetas opacity
  tclr1_opacity?: number;
  tclr2_opacity?: number;
  tclr3_opacity?: number;
  tclr4_opacity?: number;
  tclr5_opacity?: number;
  tclr6_opacity?: number;
  tdclr1_opacity?: number;
  tdclr2_opacity?: number;
  tdclr3_opacity?: number;
  tdclr4_opacity?: number;
  tdclr5_opacity?: number;
  tdclr6_opacity?: number;
  // Header opacity
  hclr1_opacity?: number;
  hclr2_opacity?: number;
  hclr3_opacity?: number;
  hclr4_opacity?: number;
  hclr5_opacity?: number;
  hclr6_opacity?: number;
  hclr7_opacity?: number;
  hclr8_opacity?: number;
  hclr9_opacity?: number;
  hclr10_opacity?: number;
  hclr11_opacity?: number;
  hclr12_opacity?: number;
  hclr13_opacity?: number;
  hdclr1_opacity?: number;
  hdclr2_opacity?: number;
  hdclr3_opacity?: number;
  hdclr4_opacity?: number;
  hdclr5_opacity?: number;
  hdclr6_opacity?: number;
  hdclr7_opacity?: number;
  hdclr8_opacity?: number;
  hdclr9_opacity?: number;
  hdclr10_opacity?: number;
  hdclr11_opacity?: number;
  hdclr12_opacity?: number;
  hdclr13_opacity?: number;
  // Menú opacity
  mclr1_opacity?: number;
  mclr2_opacity?: number;
  mclr3_opacity?: number;
  mclr4_opacity?: number;
  mclr5_opacity?: number;
  mclr6_opacity?: number;
  mclr7_opacity?: number;
  mclr8_opacity?: number;
  mclr9_opacity?: number;
  mclr10_opacity?: number;
  mclr11_opacity?: number;
  mdclr1_opacity?: number;
  mdclr2_opacity?: number;
  mdclr3_opacity?: number;
  mdclr4_opacity?: number;
  mdclr5_opacity?: number;
  mdclr6_opacity?: number;
  mdclr7_opacity?: number;
  mdclr8_opacity?: number;
  mdclr9_opacity?: number;
  mdclr10_opacity?: number;
  mdclr11_opacity?: number;
}

export interface PromoColorsConfig {
  // 9 color roles × light + dark (18 hex) + 9 light opacities + 9 dark opacities = 36
  // 1. Fondo Sección
  cbclr1?: string;
  cbdclr1?: string;
  cbclr1_opacity?: number;
  cbdclr1_opacity?: number;
  // 2. Gradiente Inicial
  cbclr2?: string;
  cbdclr2?: string;
  cbclr2_opacity?: number;
  cbdclr2_opacity?: number;
  // 3. Gradiente Terminal
  cbclr3?: string;
  cbdclr3?: string;
  cbclr3_opacity?: number;
  cbdclr3_opacity?: number;
  // 4. Título
  cbclr4?: string;
  cbdclr4?: string;
  cbclr4_opacity?: number;
  cbdclr4_opacity?: number;
  // 5. Texto
  cbclr5?: string;
  cbdclr5?: string;
  cbclr5_opacity?: number;
  cbdclr5_opacity?: number;
  // 6. Número/Acento
  cbclr6?: string;
  cbdclr6?: string;
  cbclr6_opacity?: number;
  cbdclr6_opacity?: number;
  // 7. Enlaces
  cbclr7?: string;
  cbdclr7?: string;
  cbclr7_opacity?: number;
  cbdclr7_opacity?: number;
  // 8. Bordes
  cbclr8?: string;
  cbdclr8?: string;
  cbclr8_opacity?: number;
  cbdclr8_opacity?: number;
  // 9. Fondo de Sección
  cbclr9?: string;
  cbdclr9?: string;
  cbclr9_opacity?: number;
  cbdclr9_opacity?: number;
}

// --- Mapped config record ---

export interface SlideshowColorsConfig {
  // 9 color roles × light + dark (18 hex) + 9 light opacities + 9 dark opacities = 36
  // 1. Fondo de Sección
  bsclr1?: string;
  bsdclr1?: string;
  bsclr1_opacity?: number;
  bsdclr1_opacity?: number;
  // 2. Título
  bsclr2?: string;
  bsdclr2?: string;
  bsclr2_opacity?: number;
  bsdclr2_opacity?: number;
  // 3. Subtítulo
  bsclr3?: string;
  bsdclr3?: string;
  bsclr3_opacity?: number;
  bsdclr3_opacity?: number;
  // 4. Enlace
  bsclr4?: string;
  bsdclr4?: string;
  bsclr4_opacity?: number;
  bsdclr4_opacity?: number;
  // 5. Gradiente Inicial
  bsclr5?: string;
  bsdclr5?: string;
  bsclr5_opacity?: number;
  bsdclr5_opacity?: number;
  // 6. Gradiente Intermedio
  bsclr6?: string;
  bsdclr6?: string;
  bsclr6_opacity?: number;
  bsdclr6_opacity?: number;
  // 7. Badge Categoría
  bsclr7?: string;
  bsdclr7?: string;
  bsclr7_opacity?: number;
  bsdclr7_opacity?: number;
  // 8. Título Card
  bsclr8?: string;
  bsdclr8?: string;
  bsclr8_opacity?: number;
  bsdclr8_opacity?: number;
  // 9. Bordes
  bsclr9?: string;
  bsdclr9?: string;
  bsclr9_opacity?: number;
  bsdclr9_opacity?: number;
}

export interface TestimonialsColorsConfig {
  // 8 color roles × light + dark (16 hex fields) + 8 light opacities + 8 dark opacities = 32
  // 1. Fondo de Sección
  tsclr1?: string;
  tsdclr1?: string;
  tsclr1_opacity?: number;
  tsdclr1_opacity?: number;
  // 2. Título
  tsclr2?: string;
  tsdclr2?: string;
  tsclr2_opacity?: number;
  tsdclr2_opacity?: number;
  // 3. Subtítulo
  tsclr3?: string;
  tsdclr3?: string;
  tsclr3_opacity?: number;
  tsdclr3_opacity?: number;
  // 4. Fondo Tarjeta
  tsclr4?: string;
  tsdclr4?: string;
  tsclr4_opacity?: number;
  tsdclr4_opacity?: number;
  // 5. Texto Tarjeta
  tsclr5?: string;
  tsdclr5?: string;
  tsclr5_opacity?: number;
  tsdclr5_opacity?: number;
  // 6. Texto Secundario
  tsclr6?: string;
  tsdclr6?: string;
  tsclr6_opacity?: number;
  tsdclr6_opacity?: number;
  // 7. Énfasis
  tsclr7?: string;
  tsdclr7?: string;
  tsclr7_opacity?: number;
  tsdclr7_opacity?: number;
  // 8. Bordes
  tsclr8?: string;
  tsdclr8?: string;
  tsclr8_opacity?: number;
  tsdclr8_opacity?: number;
}

export interface VisitColorsConfig {
  // 9 color roles × light + dark (18 hex fields) + 9 light opacities + 9 dark opacities = 36
  // 1. Fondo de Sección
  vsclr1?: string;
  vsdclr1?: string;
  vsclr1_opacity?: number;
  vsdclr1_opacity?: number;
  // 2. Título
  vsclr2?: string;
  vsdclr2?: string;
  vsclr2_opacity?: number;
  vsdclr2_opacity?: number;
  // 3. Gradiente Inicial
  vsclr3?: string;
  vsdclr3?: string;
  vsclr3_opacity?: number;
  vsdclr3_opacity?: number;
  // 4. Gradiente Final
  vsclr4?: string;
  vsdclr4?: string;
  vsclr4_opacity?: number;
  vsdclr4_opacity?: number;
  // 5. Número/Acento
  vsclr5?: string;
  vsdclr5?: string;
  vsclr5_opacity?: number;
  vsdclr5_opacity?: number;
  // 6. Texto
  vsclr6?: string;
  vsdclr6?: string;
  vsclr6_opacity?: number;
  vsdclr6_opacity?: number;
  // 7. CTA Texto
  vsclr7?: string;
  vsdclr7?: string;
  vsclr7_opacity?: number;
  vsdclr7_opacity?: number;
  // 8. Bordes
  vsclr8?: string;
  vsdclr8?: string;
  vsclr8_opacity?: number;
  vsdclr8_opacity?: number;
  // 9. Hover Email
  vsclr9?: string;
  vsdclr9?: string;
  vsclr9_opacity?: number;
  vsdclr9_opacity?: number;
}

export interface FAQColorsConfig {
  // 8 color roles × light + dark (16 hex fields) + 8 light opacities + 8 dark opacities = 32
  // 1. Fondo de Sección
  fclr1?: string;
  fdclr1?: string;
  fclr1_opacity?: number;
  fdclr1_opacity?: number;
  // 2. Título
  fclr2?: string;
  fdclr2?: string;
  fclr2_opacity?: number;
  fdclr2_opacity?: number;
  // 3. Subtítulo
  fclr3?: string;
  fdclr3?: string;
  fclr3_opacity?: number;
  fdclr3_opacity?: number;
  // 4. Fondo Tarjeta
  fclr4?: string;
  fdclr4?: string;
  fclr4_opacity?: number;
  fdclr4_opacity?: number;
  // 5. Pregunta
  fclr5?: string;
  fdclr5?: string;
  fclr5_opacity?: number;
  fdclr5_opacity?: number;
  // 6. Respuesta
  fclr6?: string;
  fdclr6?: string;
  fclr6_opacity?: number;
  fdclr6_opacity?: number;
  // 7. Bordes
  fclr7?: string;
  fdclr7?: string;
  fclr7_opacity?: number;
  fdclr7_opacity?: number;
  // 8. Icono Toggle
  fclr8?: string;
  fdclr8?: string;
  fclr8_opacity?: number;
  fdclr8_opacity?: number;
}

export interface SecondaryHeaderColorsConfig {
  // 14 color roles × light + dark (28 hex fields) + 14 light opacities + 14 dark opacities = 56
  // Independent from theme_colors hclr/hdclr — drives the SecondaryHeader component.
  // 1. Botón Menú
  shclr1?: string;
  shdclr1?: string;
  shclr1_opacity?: number;
  shdclr1_opacity?: number;
  // 2. Separador
  shclr2?: string;
  shdclr2?: string;
  shclr2_opacity?: number;
  shdclr2_opacity?: number;
  // 3. Pretitulo
  shclr3?: string;
  shdclr3?: string;
  shclr3_opacity?: number;
  shdclr3_opacity?: number;
  // 4. Nombre Corto
  shclr4?: string;
  shdclr4?: string;
  shclr4_opacity?: number;
  shdclr4_opacity?: number;
  // 5. Slogan
  shclr5?: string;
  shdclr5?: string;
  shclr5_opacity?: number;
  shdclr5_opacity?: number;
  // 6. Fondo Botones
  shclr6?: string;
  shdclr6?: string;
  shclr6_opacity?: number;
  shdclr6_opacity?: number;
  // 7. Fondo Botones Hover
  shclr7?: string;
  shdclr7?: string;
  shclr7_opacity?: number;
  shdclr7_opacity?: number;
  // 8. Texto Botones
  shclr8?: string;
  shdclr8?: string;
  shclr8_opacity?: number;
  shdclr8_opacity?: number;
  // 9. Texto Botones Hover
  shclr9?: string;
  shdclr9?: string;
  shclr9_opacity?: number;
  shdclr9_opacity?: number;
  // 10. Texto Header
  shclr10?: string;
  shdclr10?: string;
  shclr10_opacity?: number;
  shdclr10_opacity?: number;
  // 11. Texto Hover
  shclr11?: string;
  shdclr11?: string;
  shclr11_opacity?: number;
  shdclr11_opacity?: number;
  // 12. Fondo Inicial
  shclr12?: string;
  shdclr12?: string;
  shclr12_opacity?: number;
  shdclr12_opacity?: number;
  // 13. Fondo Intermedio
  shclr13?: string;
  shdclr13?: string;
  shclr13_opacity?: number;
  shdclr13_opacity?: number;
  // 14. Fondo Final
  shclr14?: string;
  shdclr14?: string;
  shclr14_opacity?: number;
  shdclr14_opacity?: number;
}

export interface HeaderColorsConfig {
  // 13 color roles × light + dark (26 hex fields) + 13 light opacities + 13 dark opacities = 52
  // Independent from theme_colors — drives the Header component.
  // 1. Botón Menú
  hclr1?: string;
  hdclr1?: string;
  hclr1_opacity?: number;
  hdclr1_opacity?: number;
  // 2. Separador
  hclr2?: string;
  hdclr2?: string;
  hclr2_opacity?: number;
  hdclr2_opacity?: number;
  // 3. Pretitulo
  hclr3?: string;
  hdclr3?: string;
  hclr3_opacity?: number;
  hdclr3_opacity?: number;
  // 4. Nombre Corto
  hclr4?: string;
  hdclr4?: string;
  hclr4_opacity?: number;
  hdclr4_opacity?: number;
  // 5. Slogan
  hclr5?: string;
  hdclr5?: string;
  hclr5_opacity?: number;
  hdclr5_opacity?: number;
  // 6. Fondo Botones
  hclr6?: string;
  hdclr6?: string;
  hclr6_opacity?: number;
  hdclr6_opacity?: number;
  // 7. Fondo Botones Hover
  hclr7?: string;
  hdclr7?: string;
  hclr7_opacity?: number;
  hdclr7_opacity?: number;
  // 8. Texto Botones
  hclr8?: string;
  hdclr8?: string;
  hclr8_opacity?: number;
  hdclr8_opacity?: number;
  // 9. Texto Botones Hover
  hclr9?: string;
  hdclr9?: string;
  hclr9_opacity?: number;
  hdclr9_opacity?: number;
  // 10. Texto Header
  hclr10?: string;
  hdclr10?: string;
  hclr10_opacity?: number;
  hdclr10_opacity?: number;
  // 11. Texto Hover
  hclr11?: string;
  hdclr11?: string;
  hclr11_opacity?: number;
  hdclr11_opacity?: number;
  // 12. Fondo Inicial
  hclr12?: string;
  hdclr12?: string;
  hclr12_opacity?: number;
  hdclr12_opacity?: number;
  // 13. Fondo Final
  hclr13?: string;
  hdclr13?: string;
  hclr13_opacity?: number;
  hdclr13_opacity?: number;
}

export interface MenuColorsConfig {
  // 9 color roles × light + dark (18 hex fields) + 9 light opacities + 9 dark opacities = 36
  // Independent from theme_colors — drives the Menu component.
  // 1. Fondo
  mclr1?: string;
  mdclr1?: string;
  mclr1_opacity?: number;
  mdclr1_opacity?: number;
  // 2. Texto Principal
  mclr2?: string;
  mdclr2?: string;
  mclr2_opacity?: number;
  mdclr2_opacity?: number;
  // 3. Texto Secundario
  mclr3?: string;
  mdclr3?: string;
  mclr3_opacity?: number;
  mdclr3_opacity?: number;
  // 4. Énfasis
  mclr4?: string;
  mdclr4?: string;
  mclr4_opacity?: number;
  mdclr4_opacity?: number;
  // 5. Hover
  mclr5?: string;
  mdclr5?: string;
  mclr5_opacity?: number;
  mdclr5_opacity?: number;
  // 6. Borde
  mclr6?: string;
  mdclr6?: string;
  mclr6_opacity?: number;
  mdclr6_opacity?: number;
  // 7. Icono
  mclr7?: string;
  mdclr7?: string;
  mclr7_opacity?: number;
  mdclr7_opacity?: number;
  // 8. Fondo Hover
  mclr8?: string;
  mdclr8?: string;
  mclr8_opacity?: number;
  mdclr8_opacity?: number;
  // 9. Slogan Menú
  mclr9?: string;
  mdclr9?: string;
  mclr9_opacity?: number;
  mdclr9_opacity?: number;
  // 10. Bordes
  mclr10?: string;
  mdclr10?: string;
  mclr10_opacity?: number;
  mdclr10_opacity?: number;
  // 11. Texto Hover
  mclr11?: string;
  mdclr11?: string;
  mclr11_opacity?: number;
  mdclr11_opacity?: number;
}

export interface FooterColorsConfig {
  // 10 color roles × light + dark (20 hex fields) + 10 light opacities + 10 dark opacities = 40
  // 1. Fondo Inicial
  foclr1?: string;
  fodclr1?: string;
  foclr1_opacity?: number;
  fodclr1_opacity?: number;
  // 2. Fondo Intermedio
  foclr2?: string;
  fodclr2?: string;
  foclr2_opacity?: number;
  fodclr2_opacity?: number;
  // 3. Fondo Final
  foclr3?: string;
  fodclr3?: string;
  foclr3_opacity?: number;
  fodclr3_opacity?: number;
  // 4. Texto Principal
  foclr4?: string;
  fodclr4?: string;
  foclr4_opacity?: number;
  fodclr4_opacity?: number;
  // 5. Texto Secundario
  foclr5?: string;
  fodclr5?: string;
  foclr5_opacity?: number;
  fodclr5_opacity?: number;
  // 6. Texto Misión
  foclr6?: string;
  fodclr6?: string;
  foclr6_opacity?: number;
  fodclr6_opacity?: number;
  // 7. Fondo Iconos
  foclr7?: string;
  fodclr7?: string;
  foclr7_opacity?: number;
  fodclr7_opacity?: number;
  // 8. Texto Iconos
  foclr8?: string;
  fodclr8?: string;
  foclr8_opacity?: number;
  fodclr8_opacity?: number;
  // 9. Encabezados
  foclr9?: string;
  fodclr9?: string;
  foclr9_opacity?: number;
  fodclr9_opacity?: number;
  // 10. Bordes
  foclr10?: string;
  fodclr10?: string;
  foclr10_opacity?: number;
  fodclr10_opacity?: number;
}

export interface SectionVisibilityConfig {
  hero: boolean;
  features: boolean;
  promo: boolean;
  slideshow: boolean;
  testimonials: boolean;
  visit: boolean;
  faq: boolean;
}

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
  header_colors: HeaderColorsConfig;
  menu_colors: MenuColorsConfig;
  promo_colors: PromoColorsConfig;
  slideshow_colors: SlideshowColorsConfig;
  testimonials_colors: TestimonialsColorsConfig;
  visit_colors: VisitColorsConfig;
  faq_colors: FAQColorsConfig;
  secondary_header_colors: SecondaryHeaderColorsConfig;
  footer_colors: FooterColorsConfig;
  section_visibility: SectionVisibilityConfig;
  social_list: SocialListConfig;
}
