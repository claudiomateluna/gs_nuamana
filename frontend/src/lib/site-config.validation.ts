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
const socialUrlOrEmpty = z.string().url('URL inválida').or(z.string().length(0));
// The social email is stored as a mailto: URI in the seed/DEFAULT_SITE_CONFIG
// (e.g. "mailto:contacto@nuamana.cl"), so it must accept a plain email, a
// mailto: URI, or the empty string.
const socialEmailOrEmpty = z
  .string()
  .email('Email inválido')
  .or(z.string().startsWith('mailto:', 'Email inválido'))
  .or(z.string().length(0));

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

// ---------------------------------------------------------------------------
// schemaResolver — resolves a SchemaId to { category, schema } (PR1b).
// Covers all 15 ids: the 11 plain categories (full schemas, unchanged) plus
// the 4 per-card partial schemas bound to their base category.
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
  features: { category: 'features', schema: featuresSchema },
  faq: { category: 'faq', schema: faqSchema },
  testimonials: { category: 'testimonials', schema: testimonialsSchema },
  visit: { category: 'visit', schema: visitSchema },
  seo: { category: 'seo', schema: seoSchema },
  pwa: { category: 'pwa', schema: pwaSchema },
  navigation: { category: 'navigation', schema: navigationSchema },
};
