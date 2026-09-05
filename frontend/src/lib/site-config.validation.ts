/**
 * Site Configuration Validation Schemas
 * Zod v4 schemas per category for the admin form.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Helper: non-empty string
// ---------------------------------------------------------------------------

const nonEmpty = z.string().min(1, 'Este campo es obligatorio');

// Shared social field validators (URL/email or explicitly empty)
const socialUrlOrEmpty = z.string().url('URL inválida').refine(val => val !== 'https://', 'Ingresá una URL válida').or(z.string().length(0));
// The social email is stored as a mailto: URI in the seed/DEFAULT_SITE_CONFIG
// (e.g. "mailto:contacto@nuamana.cl"), so it must accept a plain email, a
// mailto: URI, or the empty string.
const socialEmailOrEmpty = z
  .string()
  .email('Email inválido')
  .or(z.string().startsWith('mailto:', 'Email inválido'))
  .or(z.string().length(0));

// ---------------------------------------------------------------------------
// Shared hex color + opacity validators (used by hero + theme_colors)
// ---------------------------------------------------------------------------

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Formato: #RRGGBB');
const opacity = z.number().int().min(0, 'Mínimo 0').max(100, 'Máximo 100').default(100);

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------

export const brandingSchema = z.object({
  nombre_grupo: nonEmpty,
  nombre_corto: nonEmpty,
  pretitulo: nonEmpty,
  slogan: nonEmpty,
  mision: nonEmpty,
  motto: nonEmpty,
  logo_header: nonEmpty,
  logo_footer: nonEmpty,
  copyright: nonEmpty,
});

export type BrandingFormData = z.infer<typeof brandingSchema>;

// ---------------------------------------------------------------------------
// Social
// ---------------------------------------------------------------------------

export const socialSchema = z.object({
  instagram: socialUrlOrEmpty,
  facebook: socialUrlOrEmpty,
  youtube: socialUrlOrEmpty,
  tiktok: socialUrlOrEmpty,
  google: socialUrlOrEmpty,
  whatsapp: nonEmpty,
  email: socialEmailOrEmpty,
});

export type SocialFormData = z.infer<typeof socialSchema>;

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contactSchema = z.object({
  sede_nombre: nonEmpty,
  direccion: nonEmpty,
  maps_embed: z.string().url('URL inválida').or(z.string().length(0)),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export const heroSchema = z.object({
  frases: z.array(z.string().min(1, 'La frase no puede estar vacía')).min(1, 'Al menos una frase'),
  fondo: nonEmpty,
  intervalo: z.coerce.number().int().min(1000, 'Mínimo 1000ms').max(30000, 'Máximo 30000ms'),
  imagenes_pool: z.array(z.string().min(1)).min(1, 'Al menos una imagen en el pool'),
  top_count: z.coerce.number().int().min(0, 'Mínimo 0').max(6, 'Máximo 6'),
  bottom_count: z.coerce.number().int().min(0, 'Mínimo 0').max(6, 'Máximo 6'),
});

export type HeroFormData = z.infer<typeof heroSchema>;

// ---------------------------------------------------------------------------
// Features Colors (36 fields: 18 hex + 18 opacity) — 9 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity).
// ---------------------------------------------------------------------------

export const featuresColorsSchema = z.object({
  feclr1: hexColor, fedclr1: hexColor,
  feclr1_opacity: opacity, fedclr1_opacity: opacity,
  feclr2: hexColor, fedclr2: hexColor,
  feclr2_opacity: opacity, fedclr2_opacity: opacity,
  feclr3: hexColor, fedclr3: hexColor,
  feclr3_opacity: opacity, fedclr3_opacity: opacity,
  feclr4: hexColor, fedclr4: hexColor,
  feclr4_opacity: opacity, fedclr4_opacity: opacity,
  feclr5: hexColor, fedclr5: hexColor,
  feclr5_opacity: opacity, fedclr5_opacity: opacity,
  feclr6: hexColor, fedclr6: hexColor,
  feclr6_opacity: opacity, fedclr6_opacity: opacity,
  feclr7: hexColor, fedclr7: hexColor,
  feclr7_opacity: opacity, fedclr7_opacity: opacity,
  feclr8: hexColor, fedclr8: hexColor,
  feclr8_opacity: opacity, fedclr8_opacity: opacity,
  feclr9: hexColor, fedclr9: hexColor,
  feclr9_opacity: opacity, fedclr9_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Hero Colors (52 fields: 26 hex + 26 opacity) — 13 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity).
// ---------------------------------------------------------------------------

export const heroColorsSchema = z.object({
  // Degradado — Fondo Inicial (1)
  heclr1: hexColor, hedclr1: hexColor,
  heclr1_opacity: opacity, hedclr1_opacity: opacity,
  // Degradado — Fondo Intermedio (2)
  heclr2: hexColor, hedclr2: hexColor,
  heclr2_opacity: opacity, hedclr2_opacity: opacity,
  // Degradado — Fondo Terminal (3)
  heclr3: hexColor, hedclr3: hexColor,
  heclr3_opacity: opacity, hedclr3_opacity: opacity,
  // Textos — Texto Grande (4)
  heclr4: hexColor, hedclr4: hexColor,
  heclr4_opacity: opacity, hedclr4_opacity: opacity,
  // Textos — Texto Pequeño (5)
  heclr5: hexColor, hedclr5: hexColor,
  heclr5_opacity: opacity, hedclr5_opacity: opacity,
  // Borde 1 (6)
  heclr6: hexColor, hedclr6: hexColor,
  heclr6_opacity: opacity, hedclr6_opacity: opacity,
  // Borde 2 (7)
  heclr7: hexColor, hedclr7: hexColor,
  heclr7_opacity: opacity, hedclr7_opacity: opacity,
  // Borde 3 (8)
  heclr8: hexColor, hedclr8: hexColor,
  heclr8_opacity: opacity, hedclr8_opacity: opacity,
  // Borde 4 (9)
  heclr9: hexColor, hedclr9: hexColor,
  heclr9_opacity: opacity, hedclr9_opacity: opacity,
  // Borde 5 (10)
  heclr10: hexColor, hedclr10: hexColor,
  heclr10_opacity: opacity, hedclr10_opacity: opacity,
  // Borde 6 (11)
  heclr11: hexColor, hedclr11: hexColor,
  heclr11_opacity: opacity, hedclr11_opacity: opacity,
  // Borde 7 (12)
  heclr12: hexColor, hedclr12: hexColor,
  heclr12_opacity: opacity, hedclr12_opacity: opacity,
  // Borde 8 (13)
  heclr13: hexColor, hedclr13: hexColor,
  heclr13_opacity: opacity, hedclr13_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Promo Colors (36 fields: 18 hex + 18 opacity) — 9 roles × 4 fields each
// (light hex, light opacity, dark hex, dark opacity).
// ---------------------------------------------------------------------------

export const promoColorsSchema = z.object({
  cbclr1: hexColor, cbdclr1: hexColor,
  cbclr1_opacity: opacity, cbdclr1_opacity: opacity,
  cbclr2: hexColor, cbdclr2: hexColor,
  cbclr2_opacity: opacity, cbdclr2_opacity: opacity,
  cbclr3: hexColor, cbdclr3: hexColor,
  cbclr3_opacity: opacity, cbdclr3_opacity: opacity,
  cbclr4: hexColor, cbdclr4: hexColor,
  cbclr4_opacity: opacity, cbdclr4_opacity: opacity,
  cbclr5: hexColor, cbdclr5: hexColor,
  cbclr5_opacity: opacity, cbdclr5_opacity: opacity,
  cbclr6: hexColor, cbdclr6: hexColor,
  cbclr6_opacity: opacity, cbdclr6_opacity: opacity,
  cbclr7: hexColor, cbdclr7: hexColor,
  cbclr7_opacity: opacity, cbdclr7_opacity: opacity,
  cbclr8: hexColor, cbdclr8: hexColor,
  cbclr8_opacity: opacity, cbdclr8_opacity: opacity,
  cbclr9: hexColor, cbdclr9: hexColor,
  cbclr9_opacity: opacity, cbdclr9_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Slideshow Colors (36 fields: 18 hex + 18 opacity) — 9 roles × 4 fields each
// (light hex, light opacity, dark hex, dark opacity).
// ---------------------------------------------------------------------------

export const slideshowColorsSchema = z.object({
  bsclr1: hexColor, bsdclr1: hexColor,
  bsclr1_opacity: opacity, bsdclr1_opacity: opacity,
  bsclr2: hexColor, bsdclr2: hexColor,
  bsclr2_opacity: opacity, bsdclr2_opacity: opacity,
  bsclr3: hexColor, bsdclr3: hexColor,
  bsclr3_opacity: opacity, bsdclr3_opacity: opacity,
  bsclr4: hexColor, bsdclr4: hexColor,
  bsclr4_opacity: opacity, bsdclr4_opacity: opacity,
  bsclr5: hexColor, bsdclr5: hexColor,
  bsclr5_opacity: opacity, bsdclr5_opacity: opacity,
  bsclr6: hexColor, bsdclr6: hexColor,
  bsclr6_opacity: opacity, bsdclr6_opacity: opacity,
  bsclr7: hexColor, bsdclr7: hexColor,
  bsclr7_opacity: opacity, bsdclr7_opacity: opacity,
  bsclr8: hexColor, bsdclr8: hexColor,
  bsclr8_opacity: opacity, bsdclr8_opacity: opacity,
  bsclr9: hexColor, bsdclr9: hexColor,
  bsclr9_opacity: opacity, bsdclr9_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Testimonials Colors (32 fields: 16 hex + 16 opacity) — 8 roles × 4 fields each
// (light hex, light opacity, dark hex, dark opacity).
// ---------------------------------------------------------------------------

export const testimonialsColorsSchema = z.object({
  tsclr1: hexColor, tsdclr1: hexColor,
  tsclr1_opacity: opacity, tsdclr1_opacity: opacity,
  tsclr2: hexColor, tsdclr2: hexColor,
  tsclr2_opacity: opacity, tsdclr2_opacity: opacity,
  tsclr3: hexColor, tsdclr3: hexColor,
  tsclr3_opacity: opacity, tsdclr3_opacity: opacity,
  tsclr4: hexColor, tsdclr4: hexColor,
  tsclr4_opacity: opacity, tsdclr4_opacity: opacity,
  tsclr5: hexColor, tsdclr5: hexColor,
  tsclr5_opacity: opacity, tsdclr5_opacity: opacity,
  tsclr6: hexColor, tsdclr6: hexColor,
  tsclr6_opacity: opacity, tsdclr6_opacity: opacity,
  tsclr7: hexColor, tsdclr7: hexColor,
  tsclr7_opacity: opacity, tsdclr7_opacity: opacity,
  tsclr8: hexColor, tsdclr8: hexColor,
  tsclr8_opacity: opacity, tsdclr8_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Visit Colors (36 fields: 18 hex + 18 opacity) — 9 roles × 4 fields each
// (light hex, light opacity, dark hex, dark opacity).
// ---------------------------------------------------------------------------

export const visitColorsSchema = z.object({
  vsclr1: hexColor, vsdclr1: hexColor,
  vsclr1_opacity: opacity, vsdclr1_opacity: opacity,
  vsclr2: hexColor, vsdclr2: hexColor,
  vsclr2_opacity: opacity, vsdclr2_opacity: opacity,
  vsclr3: hexColor, vsdclr3: hexColor,
  vsclr3_opacity: opacity, vsdclr3_opacity: opacity,
  vsclr4: hexColor, vsdclr4: hexColor,
  vsclr4_opacity: opacity, vsdclr4_opacity: opacity,
  vsclr5: hexColor, vsdclr5: hexColor,
  vsclr5_opacity: opacity, vsdclr5_opacity: opacity,
  vsclr6: hexColor, vsdclr6: hexColor,
  vsclr6_opacity: opacity, vsdclr6_opacity: opacity,
  vsclr7: hexColor, vsdclr7: hexColor,
  vsclr7_opacity: opacity, vsdclr7_opacity: opacity,
  vsclr8: hexColor, vsdclr8: hexColor,
  vsclr8_opacity: opacity, vsdclr8_opacity: opacity,
  vsclr9: hexColor, vsdclr9: hexColor,
  vsclr9_opacity: opacity, vsdclr9_opacity: opacity,
});

// ---------------------------------------------------------------------------
// FAQ Colors (32 fields: 16 hex + 16 opacity) — 8 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity).
// ---------------------------------------------------------------------------

export const faqColorsSchema = z.object({
  fclr1: hexColor, fdclr1: hexColor,
  fclr1_opacity: opacity, fdclr1_opacity: opacity,
  fclr2: hexColor, fdclr2: hexColor,
  fclr2_opacity: opacity, fdclr2_opacity: opacity,
  fclr3: hexColor, fdclr3: hexColor,
  fclr3_opacity: opacity, fdclr3_opacity: opacity,
  fclr4: hexColor, fdclr4: hexColor,
  fclr4_opacity: opacity, fdclr4_opacity: opacity,
  fclr5: hexColor, fdclr5: hexColor,
  fclr5_opacity: opacity, fdclr5_opacity: opacity,
  fclr6: hexColor, fdclr6: hexColor,
  fclr6_opacity: opacity, fdclr6_opacity: opacity,
  fclr7: hexColor, fdclr7: hexColor,
  fclr7_opacity: opacity, fdclr7_opacity: opacity,
  fclr8: hexColor, fdclr8: hexColor,
  fclr8_opacity: opacity, fdclr8_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Secondary Header Colors (56 fields: 28 hex + 28 opacity) — 14 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity). Independent from theme_colors
// hclr/hdclr — drives the SecondaryHeader component.
// ---------------------------------------------------------------------------

export const secondaryHeaderColorsSchema = z.object({
  // 1. Botón Menú
  shclr1: hexColor, shdclr1: hexColor,
  shclr1_opacity: opacity, shdclr1_opacity: opacity,
  // 2. Separador
  shclr2: hexColor, shdclr2: hexColor,
  shclr2_opacity: opacity, shdclr2_opacity: opacity,
  // 3. Pretitulo
  shclr3: hexColor, shdclr3: hexColor,
  shclr3_opacity: opacity, shdclr3_opacity: opacity,
  // 4. Nombre Corto
  shclr4: hexColor, shdclr4: hexColor,
  shclr4_opacity: opacity, shdclr4_opacity: opacity,
  // 5. Slogan
  shclr5: hexColor, shdclr5: hexColor,
  shclr5_opacity: opacity, shdclr5_opacity: opacity,
  // 6. Fondo Botones
  shclr6: hexColor, shdclr6: hexColor,
  shclr6_opacity: opacity, shdclr6_opacity: opacity,
  // 7. Fondo Botones Hover
  shclr7: hexColor, shdclr7: hexColor,
  shclr7_opacity: opacity, shdclr7_opacity: opacity,
  // 8. Texto Botones
  shclr8: hexColor, shdclr8: hexColor,
  shclr8_opacity: opacity, shdclr8_opacity: opacity,
  // 9. Texto Botones Hover
  shclr9: hexColor, shdclr9: hexColor,
  shclr9_opacity: opacity, shdclr9_opacity: opacity,
  // 10. Texto Header
  shclr10: hexColor, shdclr10: hexColor,
  shclr10_opacity: opacity, shdclr10_opacity: opacity,
  // 11. Texto Hover
  shclr11: hexColor, shdclr11: hexColor,
  shclr11_opacity: opacity, shdclr11_opacity: opacity,
  // 12. Fondo Inicial
  shclr12: hexColor, shdclr12: hexColor,
  shclr12_opacity: opacity, shdclr12_opacity: opacity,
  // 13. Fondo Intermedio
  shclr13: hexColor, shdclr13: hexColor,
  shclr13_opacity: opacity, shdclr13_opacity: opacity,
  // 14. Fondo Final
  shclr14: hexColor, shdclr14: hexColor,
  shclr14_opacity: opacity, shdclr14_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Panel Colors (56 fields: 28 hex + 28 opacity) — 14 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity).
// ---------------------------------------------------------------------------

export const panelColorsSchema = z.object({
  // 1. Fondo Inicial
  pclr1: hexColor, pdclr1: hexColor,
  pclr1_opacity: opacity, pdclr1_opacity: opacity,
  // 2. Fondo Final
  pclr2: hexColor, pdclr2: hexColor,
  pclr2_opacity: opacity, pdclr2_opacity: opacity,
  // 3. Fondo Cajas e Inputs
  pclr3: hexColor, pdclr3: hexColor,
  pclr3_opacity: opacity, pdclr3_opacity: opacity,
  // 4. Título Principal
  pclr4: hexColor, pdclr4: hexColor,
  pclr4_opacity: opacity, pdclr4_opacity: opacity,
  // 5. Subtítulo Rol/Unidad
  pclr5: hexColor, pdclr5: hexColor,
  pclr5_opacity: opacity, pdclr5_opacity: opacity,
  // 6. Texto Estado/Metadatos
  pclr6: hexColor, pdclr6: hexColor,
  pclr6_opacity: opacity, pdclr6_opacity: opacity,
  // 7. Pestaña Inactiva
  pclr7: hexColor, pdclr7: hexColor,
  pclr7_opacity: opacity, pdclr7_opacity: opacity,
  // 8. Pestaña Activa / Acento
  pclr8: hexColor, pdclr8: hexColor,
  pclr8_opacity: opacity, pdclr8_opacity: opacity,
  // 9. Pestaña Hover
  pclr9: hexColor, pdclr9: hexColor,
  pclr9_opacity: opacity, pdclr9_opacity: opacity,
  // 10. Acción Primaria
  pclr10: hexColor, pdclr10: hexColor,
  pclr10_opacity: opacity, pdclr10_opacity: opacity,
  // 11. Acción Neutra
  pclr11: hexColor, pdclr11: hexColor,
  pclr11_opacity: opacity, pdclr11_opacity: opacity,
  // 12. Acción Secundaria / Peligro
  pclr12: hexColor, pdclr12: hexColor,
  pclr12_opacity: opacity, pdclr12_opacity: opacity,
  // 13. Separadores Internos
  pclr13: hexColor, pdclr13: hexColor,
  pclr13_opacity: opacity, pdclr13_opacity: opacity,
  // 14. Bordes / Focus
  pclr14: hexColor, pdclr14: hexColor,
  pclr14_opacity: opacity, pdclr14_opacity: opacity,
}).partial();

// ---------------------------------------------------------------------------
// Footer Colors (40 fields: 20 hex + 20 opacity) — 10 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity).
// ---------------------------------------------------------------------------

export const footerColorsSchema = z.object({
  // 1. Fondo Inicial
  foclr1: hexColor, fodclr1: hexColor,
  foclr1_opacity: opacity, fodclr1_opacity: opacity,
  // 2. Fondo Intermedio
  foclr2: hexColor, fodclr2: hexColor,
  foclr2_opacity: opacity, fodclr2_opacity: opacity,
  // 3. Fondo Final
  foclr3: hexColor, fodclr3: hexColor,
  foclr3_opacity: opacity, fodclr3_opacity: opacity,
  // 4. Texto Principal
  foclr4: hexColor, fodclr4: hexColor,
  foclr4_opacity: opacity, fodclr4_opacity: opacity,
  // 5. Texto Secundario
  foclr5: hexColor, fodclr5: hexColor,
  foclr5_opacity: opacity, fodclr5_opacity: opacity,
  // 6. Texto Misión
  foclr6: hexColor, fodclr6: hexColor,
  foclr6_opacity: opacity, fodclr6_opacity: opacity,
  // 7. Fondo Iconos
  foclr7: hexColor, fodclr7: hexColor,
  foclr7_opacity: opacity, fodclr7_opacity: opacity,
  // 8. Texto Iconos
  foclr8: hexColor, fodclr8: hexColor,
  foclr8_opacity: opacity, fodclr8_opacity: opacity,
  // 9. Encabezados
  foclr9: hexColor, fodclr9: hexColor,
  foclr9_opacity: opacity, fodclr9_opacity: opacity,
  // 10. Bordes
  foclr10: hexColor, fodclr10: hexColor,
  foclr10_opacity: opacity, fodclr10_opacity: opacity,
});

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

const featureItemSchema = z.object({
  title: nonEmpty,
  description: nonEmpty,
  image: nonEmpty,
  link: nonEmpty,
});

export const featuresSchema = z.object({
  titulo_seccion: nonEmpty,
  subtitulo: nonEmpty,
  items: z.array(featureItemSchema).min(1, 'Al menos un feature'),
});

export type FeaturesFormData = z.infer<typeof featuresSchema>;

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

const faqItemSchema = z.object({
  question: nonEmpty,
  answer: nonEmpty,
  image: z.string().url('URL inválida').or(z.string().length(0)),
});

export const faqSchema = z.object({
  titulo_seccion: nonEmpty,
  subtitulo: nonEmpty,
  items: z.array(faqItemSchema).min(1, 'Al menos una pregunta'),
});

export type FaqFormData = z.infer<typeof faqSchema>;

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export const testimonialsSchema = z.object({
  titulo_seccion: nonEmpty,
  widget_url: z.string().url('URL inválida').or(z.string().length(0)),
});

export type TestimonialsFormData = z.infer<typeof testimonialsSchema>;

// ---------------------------------------------------------------------------
// Visit
// ---------------------------------------------------------------------------

export const visitSchema = z.object({
  titulo: nonEmpty,
  fecha_fundacion: nonEmpty,
  email: z.string().email('Email inválido').or(z.string().length(0)),
  email_href: nonEmpty,
  horario: nonEmpty,
  cta_texto: nonEmpty,
  imagen: nonEmpty,
});

export type VisitFormData = z.infer<typeof visitSchema>;

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const seoSchema = z.object({
  title: nonEmpty,
  description: nonEmpty,
});

export type SeoFormData = z.infer<typeof seoSchema>;

// ---------------------------------------------------------------------------
// PWA
// ---------------------------------------------------------------------------

export const pwaSchema = z.object({
  name: nonEmpty,
  short_name: nonEmpty,
  description: nonEmpty,
  lang: nonEmpty,
  icon_192: nonEmpty,
  icon_512: nonEmpty,
  icon_1024: nonEmpty,
});

export type PwaFormData = z.infer<typeof pwaSchema>;

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navigationSchema = z.object({
  label_panel: nonEmpty,
  label_login: nonEmpty,
});

export type NavigationFormData = z.infer<typeof navigationSchema>;

// ---------------------------------------------------------------------------
// Theme Colors (152 fields: 76 hex + 76 opacity) — 4 domain groups
// (Base / Tarjetas / Header / Menú), 38 roles × light + dark.
// ---------------------------------------------------------------------------

export const themeColorsSchema = z.object({
  // Base light (10)
  clr1: hexColor,
  clr2: hexColor,
  clr3: hexColor,
  clr4: hexColor,
  clr5: hexColor,
  clr6: hexColor,
  clr7: hexColor,
  clr8: hexColor,
  clr9: hexColor,
  clr10: hexColor,
  // Base dark (10)
  dclr1: hexColor,
  dclr2: hexColor,
  dclr3: hexColor,
  dclr4: hexColor,
  dclr5: hexColor,
  dclr6: hexColor,
  dclr7: hexColor,
  dclr8: hexColor,
  dclr9: hexColor,
  dclr10: hexColor,
  // Tarjetas light (6)
  tclr1: hexColor,
  tclr2: hexColor,
  tclr3: hexColor,
  tclr4: hexColor,
  tclr5: hexColor,
  tclr6: hexColor,
  // Tarjetas dark (6)
  tdclr1: hexColor,
  tdclr2: hexColor,
  tdclr3: hexColor,
  tdclr4: hexColor,
  tdclr5: hexColor,
  tdclr6: hexColor,
  // Header light (13)
  hclr1: hexColor,
  hclr2: hexColor,
  hclr3: hexColor,
  hclr4: hexColor,
  hclr5: hexColor,
  hclr6: hexColor,
  hclr7: hexColor,
  hclr8: hexColor,
  hclr9: hexColor,
  hclr10: hexColor,
  hclr11: hexColor,
  hclr12: hexColor,
  hclr13: hexColor,
  // Header dark (13)
  hdclr1: hexColor,
  hdclr2: hexColor,
  hdclr3: hexColor,
  hdclr4: hexColor,
  hdclr5: hexColor,
  hdclr6: hexColor,
  hdclr7: hexColor,
  hdclr8: hexColor,
  hdclr9: hexColor,
  hdclr10: hexColor,
  hdclr11: hexColor,
  hdclr12: hexColor,
  hdclr13: hexColor,
  // Menú light (9)
  mclr1: hexColor,
  mclr2: hexColor,
  mclr3: hexColor,
  mclr4: hexColor,
  mclr5: hexColor,
  mclr6: hexColor,
  mclr7: hexColor,
  mclr8: hexColor,
  mclr9: hexColor,
  mclr10: hexColor,
  mclr11: hexColor,
  // Menú dark (11)
  mdclr1: hexColor,
  mdclr2: hexColor,
  mdclr3: hexColor,
  mdclr4: hexColor,
  mdclr5: hexColor,
  mdclr6: hexColor,
  mdclr7: hexColor,
  mdclr8: hexColor,
  mdclr9: hexColor,
  mdclr10: hexColor,
  mdclr11: hexColor,
  // Opacities (80)
  // Base opacity
  clr1_opacity: opacity,
  clr2_opacity: opacity,
  clr3_opacity: opacity,
  clr4_opacity: opacity,
  clr5_opacity: opacity,
  clr6_opacity: opacity,
  clr7_opacity: opacity,
  clr8_opacity: opacity,
  clr9_opacity: opacity,
  clr10_opacity: opacity,
  dclr1_opacity: opacity,
  dclr2_opacity: opacity,
  dclr3_opacity: opacity,
  dclr4_opacity: opacity,
  dclr5_opacity: opacity,
  dclr6_opacity: opacity,
  dclr7_opacity: opacity,
  dclr8_opacity: opacity,
  dclr9_opacity: opacity,
  dclr10_opacity: opacity,
  // Tarjetas opacity
  tclr1_opacity: opacity,
  tclr2_opacity: opacity,
  tclr3_opacity: opacity,
  tclr4_opacity: opacity,
  tclr5_opacity: opacity,
  tclr6_opacity: opacity,
  tdclr1_opacity: opacity,
  tdclr2_opacity: opacity,
  tdclr3_opacity: opacity,
  tdclr4_opacity: opacity,
  tdclr5_opacity: opacity,
  tdclr6_opacity: opacity,
  // Header opacity
  hclr1_opacity: opacity,
  hclr2_opacity: opacity,
  hclr3_opacity: opacity,
  hclr4_opacity: opacity,
  hclr5_opacity: opacity,
  hclr6_opacity: opacity,
  hclr7_opacity: opacity,
  hclr8_opacity: opacity,
  hclr9_opacity: opacity,
  hclr10_opacity: opacity,
  hclr11_opacity: opacity,
  hclr12_opacity: opacity,
  hclr13_opacity: opacity,
  hdclr1_opacity: opacity,
  hdclr2_opacity: opacity,
  hdclr3_opacity: opacity,
  hdclr4_opacity: opacity,
  hdclr5_opacity: opacity,
  hdclr6_opacity: opacity,
  hdclr7_opacity: opacity,
  hdclr8_opacity: opacity,
  hdclr9_opacity: opacity,
  hdclr10_opacity: opacity,
  hdclr11_opacity: opacity,
  hdclr12_opacity: opacity,
  hdclr13_opacity: opacity,
  // Menú opacity
  mclr1_opacity: opacity,
  mclr2_opacity: opacity,
  mclr3_opacity: opacity,
  mclr4_opacity: opacity,
  mclr5_opacity: opacity,
  mclr6_opacity: opacity,
  mclr7_opacity: opacity,
  mclr8_opacity: opacity,
  mclr9_opacity: opacity,
  mclr10_opacity: opacity,
  mclr11_opacity: opacity,
  mdclr1_opacity: opacity,
  mdclr2_opacity: opacity,
  mdclr3_opacity: opacity,
  mdclr4_opacity: opacity,
  mdclr5_opacity: opacity,
  mdclr6_opacity: opacity,
  mdclr7_opacity: opacity,
  mdclr8_opacity: opacity,
  mdclr9_opacity: opacity,
  mdclr10_opacity: opacity,
  mdclr11_opacity: opacity,
}).partial();

export type ThemeColorsFormData = z.infer<typeof themeColorsSchema>;

// ---------------------------------------------------------------------------
// Header Colors (52 fields: 26 hex + 26 opacity) — 13 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity).
// ---------------------------------------------------------------------------

export const headerColorsSchema = z.object({
  // Header light (13)
  hclr1: hexColor, hclr2: hexColor, hclr3: hexColor, hclr4: hexColor, hclr5: hexColor,
  hclr6: hexColor, hclr7: hexColor, hclr8: hexColor, hclr9: hexColor, hclr10: hexColor,
  hclr11: hexColor, hclr12: hexColor, hclr13: hexColor,
  // Header dark (13)
  hdclr1: hexColor, hdclr2: hexColor, hdclr3: hexColor, hdclr4: hexColor, hdclr5: hexColor,
  hdclr6: hexColor, hdclr7: hexColor, hdclr8: hexColor, hdclr9: hexColor, hdclr10: hexColor,
  hdclr11: hexColor, hdclr12: hexColor, hdclr13: hexColor,
  // Header opacity (26)
  hclr1_opacity: opacity, hclr2_opacity: opacity, hclr3_opacity: opacity, hclr4_opacity: opacity, hclr5_opacity: opacity,
  hclr6_opacity: opacity, hclr7_opacity: opacity, hclr8_opacity: opacity, hclr9_opacity: opacity, hclr10_opacity: opacity,
  hclr11_opacity: opacity, hclr12_opacity: opacity, hclr13_opacity: opacity,
  hdclr1_opacity: opacity, hdclr2_opacity: opacity, hdclr3_opacity: opacity, hdclr4_opacity: opacity, hdclr5_opacity: opacity,
  hdclr6_opacity: opacity, hdclr7_opacity: opacity, hdclr8_opacity: opacity, hdclr9_opacity: opacity, hdclr10_opacity: opacity,
  hdclr11_opacity: opacity, hdclr12_opacity: opacity, hdclr13_opacity: opacity,
}).partial();

// ---------------------------------------------------------------------------
// Menu Colors (36 fields: 18 hex + 18 opacity) — 9 roles × 4 fields each
// (light hex, dark hex, light opacity, dark opacity).
// ---------------------------------------------------------------------------

export const menuColorsSchema = z.object({
  // Menú light (11)
  mclr1: hexColor, mclr2: hexColor, mclr3: hexColor, mclr4: hexColor, mclr5: hexColor,
  mclr6: hexColor, mclr7: hexColor, mclr8: hexColor, mclr9: hexColor, mclr10: hexColor, mclr11: hexColor,
  // Menú dark (11)
  mdclr1: hexColor, mdclr2: hexColor, mdclr3: hexColor, mdclr4: hexColor, mdclr5: hexColor,
  mdclr6: hexColor, mdclr7: hexColor, mdclr8: hexColor, mdclr9: hexColor, mdclr10: hexColor, mdclr11: hexColor,
  // Menú opacity (22)
  mclr1_opacity: opacity, mclr2_opacity: opacity, mclr3_opacity: opacity, mclr4_opacity: opacity, mclr5_opacity: opacity,
  mclr6_opacity: opacity, mclr7_opacity: opacity, mclr8_opacity: opacity, mclr9_opacity: opacity, mclr10_opacity: opacity, mclr11_opacity: opacity,
  mdclr1_opacity: opacity, mdclr2_opacity: opacity, mdclr3_opacity: opacity, mdclr4_opacity: opacity, mdclr5_opacity: opacity,
  mdclr6_opacity: opacity, mdclr7_opacity: opacity, mdclr8_opacity: opacity, mdclr9_opacity: opacity, mdclr10_opacity: opacity, mdclr11_opacity: opacity,
}).partial();

// ---------------------------------------------------------------------------
// Partial schemas — per-card subsets for the zone admin (PR1b).
// Each card (Header→Marca, Footer→Marca, Header→Redes, Footer→Redes) validates
// ONLY its own field subset and accepts partial objects (.partial()).
// ---------------------------------------------------------------------------

export const brandingHeaderSchema = z
  .object({
    logo_header: nonEmpty,
    pretitulo: nonEmpty,
    nombre_corto: nonEmpty,
    slogan: nonEmpty,
  })
  .partial();

export const brandingFooterSchema = z
  .object({
    logo_footer: nonEmpty,
    nombre_grupo: nonEmpty,
    mision: nonEmpty,
    motto: nonEmpty,
    copyright: nonEmpty,
  })
  .partial();

export const socialHeaderSchema = z
  .object({
    instagram: socialUrlOrEmpty,
    facebook: socialUrlOrEmpty,
    whatsapp: nonEmpty,
  })
  .partial();

export const socialFooterSchema = z
  .object({
    youtube: socialUrlOrEmpty,
    tiktok: socialUrlOrEmpty,
    google: socialUrlOrEmpty,
    email: socialEmailOrEmpty,
  })
  .partial();

// contact.visit — partial mirror of contactSchema, exposes only direccion +
// maps_embed so Inicio → "Dirección y Mapa" can edit the same
// configuracion_sitio rows as Footer → Contacto (DB remains single source of truth).
// strictObject rejects keys outside {direccion, maps_embed} (e.g. sede_nombre);
// .partial() makes both keys optional to accept non-empty subsets.
export const contactVisitSchema = z
  .strictObject({
    direccion: nonEmpty,
    maps_embed: z.string().url('URL inválida').or(z.string().length(0)),
  })
  .partial();

// ---------------------------------------------------------------------------
// Section Visibility (7 boolean fields — Inicio section toggles)
// ---------------------------------------------------------------------------

export const sectionVisibilitySchema = z.object({
  hero: z.boolean(),
  features: z.boolean(),
  promo: z.boolean(),
  slideshow: z.boolean(),
  testimonials: z.boolean(),
  visit: z.boolean(),
  faq: z.boolean(),
}).partial();

export type SectionVisibilityFormData = z.infer<typeof sectionVisibilitySchema>;

// ---------------------------------------------------------------------------
// Social List (centralized social media list)
// ---------------------------------------------------------------------------

export const socialListSchema = z.object({
  items: z.array(z.object({
    icon: z.string(),
    label: z.string(),
    url: z.string()
      .url('URL inválida')
      .refine(val => val !== 'https://', 'Ingresá una URL válida')
      .or(z.string().startsWith('mailto:', 'Email inválido')),
    enabled: z.boolean(),
    order: z.number().int().min(0),
    placement: z.string().optional(),
  })),
}).partial();

export type SocialListFormData = z.infer<typeof socialListSchema>;

// ---------------------------------------------------------------------------
// Category-to-schema map (for the server action)
// ---------------------------------------------------------------------------

import type { SiteConfigCategory } from '@/lib/site-config.types';

export const categorySchemaMap: Record<SiteConfigCategory, z.ZodType> = {
  branding: brandingSchema,
  social: socialSchema,
  contact: contactSchema,
  hero: heroSchema,
  features: featuresSchema,
  faq: faqSchema,
  testimonials: testimonialsSchema,
  visit: visitSchema,
  seo: seoSchema,
  pwa: pwaSchema,
  navigation: navigationSchema,
  theme_colors: themeColorsSchema,
  header_colors: headerColorsSchema,
  menu_colors: menuColorsSchema,
  promo_colors: promoColorsSchema,
  slideshow_colors: slideshowColorsSchema,
  testimonials_colors: testimonialsColorsSchema,
  visit_colors: visitColorsSchema,
  faq_colors: faqColorsSchema,
  secondary_header_colors: secondaryHeaderColorsSchema,
  footer_colors: footerColorsSchema,
  panel_colors: panelColorsSchema,
  section_visibility: sectionVisibilitySchema,
  social_list: socialListSchema,
};

// ---------------------------------------------------------------------------
// schemaResolver — resolves a SchemaId to { category, schema } (PR1b).
// Covers all 23 ids: the 11 plain categories (full schemas) plus the 5
// per-card partial schemas bound to their base category plus the 7 color-grid
// schemas (theme_colors, hero_colors, features_colors, promo_colors,
// slideshow_colors, testimonials_colors, visit_colors).
// ---------------------------------------------------------------------------

import type { SchemaId } from '@/lib/admin-zones';

export const schemaResolver: Record<SchemaId, { category: SiteConfigCategory; schema: z.ZodType }> = {
  'branding.header': { category: 'branding', schema: brandingHeaderSchema },
  'branding.footer': { category: 'branding', schema: brandingFooterSchema },
  'social.header': { category: 'social', schema: socialHeaderSchema },
  'social.footer': { category: 'social', schema: socialFooterSchema },
  'contact.visit': { category: 'contact', schema: contactVisitSchema },
  branding: { category: 'branding', schema: brandingSchema },
  social: { category: 'social', schema: socialSchema },
  contact: { category: 'contact', schema: contactSchema },
  hero: { category: 'hero', schema: heroSchema },
  'hero_colors': { category: 'hero', schema: heroColorsSchema },
  features: { category: 'features', schema: featuresSchema },
  'features_colors': { category: 'features', schema: featuresColorsSchema },
  'promo_colors': { category: 'promo_colors', schema: promoColorsSchema },
  'slideshow_colors': { category: 'slideshow_colors', schema: slideshowColorsSchema },
  'testimonials_colors': { category: 'testimonials_colors', schema: testimonialsColorsSchema },
  'visit_colors': { category: 'visit_colors', schema: visitColorsSchema },
  'faq_colors': { category: 'faq_colors', schema: faqColorsSchema },
  'secondary_header_colors': { category: 'secondary_header_colors', schema: secondaryHeaderColorsSchema },
  'footer_colors': { category: 'footer_colors', schema: footerColorsSchema },
  'panel_colors': { category: 'panel_colors', schema: panelColorsSchema },
  'header_colors': { category: 'header_colors', schema: headerColorsSchema },
  'menu_colors': { category: 'menu_colors', schema: menuColorsSchema },
  faq: { category: 'faq', schema: faqSchema },
  testimonials: { category: 'testimonials', schema: testimonialsSchema },
  visit: { category: 'visit', schema: visitSchema },
  seo: { category: 'seo', schema: seoSchema },
  pwa: { category: 'pwa', schema: pwaSchema },
  navigation: { category: 'navigation', schema: navigationSchema },
  theme_colors: { category: 'theme_colors', schema: themeColorsSchema },
  section_visibility: { category: 'section_visibility', schema: sectionVisibilitySchema },
  social_list: { category: 'social_list', schema: socialListSchema },
};
