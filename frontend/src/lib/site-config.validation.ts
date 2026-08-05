/**
 * Site Configuration Validation Schemas
 * Zod v4 schemas per category for the admin form.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Helper: non-empty string
// ---------------------------------------------------------------------------

const nonEmpty = z.string().min(1, 'Este campo es obligatorio');

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
  instagram: z.string().url('URL inválida').or(z.string().length(0)),
  facebook: z.string().url('URL inválida').or(z.string().length(0)),
  youtube: z.string().url('URL inválida').or(z.string().length(0)),
  tiktok: z.string().url('URL inválida').or(z.string().length(0)),
  google: z.string().url('URL inválida').or(z.string().length(0)),
  whatsapp: z.string().min(1, 'WhatsApp es obligatorio'),
  email: z.string().email('Email inválido').or(z.string().length(0)),
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
  theme_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Formato: #RRGGBB'),
});

export type SeoFormData = z.infer<typeof seoSchema>;

// ---------------------------------------------------------------------------
// PWA
// ---------------------------------------------------------------------------

export const pwaSchema = z.object({
  name: nonEmpty,
  short_name: nonEmpty,
  description: nonEmpty,
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Formato: #RRGGBB'),
  theme_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Formato: #RRGGBB'),
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
};
