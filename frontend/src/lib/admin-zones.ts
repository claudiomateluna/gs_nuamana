/**
 * Admin Zone Metadata — CMS Admin Fase 2 (PR1a)
 *
 * Pure metadata describing how site configuration is organized into admin
 * zones (tabs) and sections (per-card forms). Every field of the 17 config
 * categories appears in EXACTLY ONE section — enforced by
 * src/__tests__/admin-zones.test.ts (coverage exactly-once invariant).
 *
 * The MENU zone is a top-level tab marker only: its content is the existing
 * MenuManager CRUD, so it carries no field metadata (tabOnly).
 */

import type { SiteConfigCategory } from '@/lib/site-config.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SchemaId =
  | SiteConfigCategory
  | 'branding.header'
  | 'branding.footer'
  | 'social.header'
  | 'social.footer'
  | 'contact.visit'
  | 'hero_colors'
  | 'features_colors'
  | 'header_colors'
  | 'menu_colors'
  | 'social_list';

export interface ZoneSectionField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'color' | 'number' | 'json' | 'heading';
  tooltip?: string;
}

export interface ZoneSection {
  id: string;
  title: string;
  category: SiteConfigCategory;
  schemaId: SchemaId;
  fields: ZoneSectionField[];
  /** 'grid' renders fields in a row-major table (groups of 4); default 'cards'. */
  layout?: 'grid' | 'cards';
  /** Section visibility toggle key — links to section_visibility config. */
  visibilityKey?: string;
}

export interface AdminZone {
  id: string;
  label: string;
  icon: string;
  sections: ZoneSection[];
  tabOnly?: boolean;
}

// ---------------------------------------------------------------------------
// Grid layout helper — row-major convention for grid sections.
// Grid sections order their fields as [clrN, clrN_opacity, dclrN,
// dclrN_opacity] (4 per role), so gridRowGroups chunks them by 4: each group
// is one table row with label + color + opacity + color + opacity.
// ---------------------------------------------------------------------------

export function gridRowGroups(fields: ZoneSectionField[]): ZoneSectionField[][] {
  const groups: ZoneSectionField[][] = [];
  for (let i = 0; i < fields.length; ) {
    if (fields[i].type === 'heading') {
      // Heading fields get their own single-field row
      groups.push([fields[i]]);
      i++;
    } else {
      // Regular fields chunk by 4
      groups.push(fields.slice(i, i + 4));
      i += 4;
    }
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Color grid helper — generates [light, light_opacity, dark, dark_opacity]
// fields for each role in row-major order.
// ---------------------------------------------------------------------------

function colorGrid(
  prefix: string,
  count: number,
  labelAt: (n: number) => string,
  lightTooltipAt: (n: number) => string,
): ZoneSectionField[] {
  const fields: ZoneSectionField[] = [];
  for (let n = 1; n <= count; n++) {
    const lk = `${prefix}${n}`;
    const dk = lk.replace('clr', 'dclr');
    const label = labelAt(n);
    const lt = lightTooltipAt(n);
    const dt = lt
      .replace(`(--${lk})`, `(--${dk})`)
      .replace('modo claro', 'modo oscuro');
    fields.push(
      { key: lk, label, type: 'color', tooltip: lt },
      { key: `${lk}_opacity`, label: `Transparencia ${label}`, type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
      { key: dk, label: `${label} Oscuro`, type: 'color', tooltip: dt },
      { key: `${dk}_opacity`, label: `Transparencia ${label} Oscuro`, type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
    );
  }
  return fields;
}

// ---------------------------------------------------------------------------
// Color role data — labels and light-mode tooltips for each semantic group.
// ---------------------------------------------------------------------------

const BASE_LABELS = ['Fondo', 'Texto Principal', 'Texto Secundario', 'Énfasis Principal', 'Énfasis Secundario', 'Énfasis Terciario', 'Bordes Principal', 'Bordes Secundario', 'Fondo Scrollbar', 'Scrollbar'];
const BASE_TOOLTIPS = [
  'Fondo principal del sitio en modo claro (var(--clr1))',
  'Texto e íconos principales en modo claro (var(--clr2))',
  'Texto secundario y bordes tenues en modo claro (var(--clr3))',
  'Color de énfasis principal en modo claro (var(--clr4))',
  'Color de énfasis secundario en modo claro (var(--clr5))',
  'Color de énfasis terciario en modo claro (var(--clr6))',
  'Bordes, separadores e inputs en modo claro (var(--clr7))',
  'Bordes secundarios y detalles en modo claro (var(--clr8))',
  'Color de fondo de la scrollbar en modo claro (var(--clr9))',
  'Color de la scrollbar en modo claro (var(--clr10))',
];

const TARJETAS_LABELS = ['Fondo Inicial', 'Fondo Final', 'Énfasis', 'Categoría', 'Enlaces', 'Texto'];
const TARJETAS_TOOLTIPS = [
  'Color de inicio del degradado de la tarjeta en modo claro (var(--tclr1))',
  'Color final del degradado de la tarjeta en modo claro (var(--tclr2))',
  'Color de énfasis de la tarjeta en modo claro (var(--tclr3))',
  'Color de categoría de la tarjeta en modo claro (var(--tclr4))',
  'Color de enlaces de la tarjeta en modo claro (var(--tclr5))',
  'Color de texto de la tarjeta en modo claro (var(--tclr6))',
];

const HEADER_LABELS = ['Botón Menú', 'Separador', 'Pretitulo', 'Nombre Corto', 'Slogan', 'Fondo Botones', 'Fondo Botones Hover', 'Texto Botones', 'Texto Botones Hover', 'Texto Header', 'Texto Hover', 'Fondo Inicial', 'Fondo Final'];
const HEADER_TOOLTIPS = [
  'Color del botón hamburguesa del header (var(--hclr1))',
  'Color del separador entre secciones del header (var(--hclr2))',
  'Color del texto pretítulo del header (var(--hclr3))',
  'Color del nombre corto del header (var(--hclr4))',
  'Color del slogan del header (var(--hclr5))',
  'Color de fondo de los botones del header (var(--hclr6))',
  'Color de fondo de los botones del header en hover (var(--hclr7))',
  'Color del texto de los botones del header (var(--hclr8))',
  'Color del texto de los botones del header en hover (var(--hclr9))',
  'Color del texto principal del header (var(--hclr10))',
  'Color del texto en hover del header (var(--hclr11))',
  'Color de inicio del degradado del header (var(--hclr12))',
  'Color final del degradado del header (var(--hclr13))',
];

const SECONDARY_HEADER_LABELS = ['Botón Menú', 'Separador', 'Pretitulo', 'Nombre Corto', 'Slogan', 'Fondo Botones', 'Fondo Botones Hover', 'Texto Botones', 'Texto Botones Hover', 'Texto Header', 'Texto Hover', 'Fondo Inicial', 'Fondo Intermedio', 'Fondo Final'];
const SECONDARY_HEADER_TOOLTIPS = [
  'Color del botón hamburguesa del header secundario (var(--shclr1))',
  'Color del separador entre secciones del header secundario (var(--shclr2))',
  'Color del texto pretítulo del header secundario (var(--shclr3))',
  'Color del nombre corto del header secundario (var(--shclr4))',
  'Color del slogan del header secundario (var(--shclr5))',
  'Color de fondo de los botones del header secundario (var(--shclr6))',
  'Color de fondo de los botones del header secundario en hover (var(--shclr7))',
  'Color del texto de los botones del header secundario (var(--shclr8))',
  'Color del texto de los botones del header secundario en hover (var(--shclr9))',
  'Color del texto principal del header secundario (var(--shclr10))',
  'Color del texto en hover del header secundario (var(--shclr11))',
  'Color de inicio del degradado del header secundario (var(--shclr12))',
  'Color intermedio del degradado del header secundario (var(--shclr13))',
  'Color final del degradado del header secundario (var(--shclr14))',
];

const HERO_LABELS = ['Degradado Inicio', 'Degradado Intermedio', 'Degradado Final', 'Texto H2', 'Texto P', 'Borde 1', 'Borde 2', 'Borde 3', 'Borde 4', 'Borde 5', 'Borde 6', 'Borde 7', 'Borde 8'];
const HERO_TOOLTIPS = [
  'Color de inicio del degradado del hero (var(--heclr1))',
  'Color intermedio del degradado del hero (var(--heclr2))',
  'Color final del degradado del hero (var(--heclr3))',
  'Color del texto H2 del hero (var(--heclr4))',
  'Color del texto P del hero (var(--heclr5))',
  'Color de borde 1 del hero (var(--heclr6))',
  'Color de borde 2 del hero (var(--heclr7))',
  'Color de borde 3 del hero (var(--heclr8))',
  'Color de borde 4 del hero (var(--heclr9))',
  'Color de borde 5 del hero (var(--heclr10))',
  'Color de borde 6 del hero (var(--heclr11))',
  'Color de borde 7 del hero (var(--heclr12))',
  'Color de borde 8 del hero (var(--heclr13))',
];

const FEATURES_LABELS = ['Título Sección', 'Subtítulo', 'Degradado Inicio', 'Degradado Intermedio', 'Degradado Final', 'Título Item', 'Descripción Item', 'Barra Enlace', 'Fondo Sección'];
const FEATURES_TOOLTIPS = [
  'Color del título de la sección features (var(--feclr1))',
  'Color del subtítulo de la sección features (var(--feclr2))',
  'Color de inicio del degradado de features (var(--feclr3))',
  'Color intermedio del degradado de features (var(--feclr4))',
  'Color final del degradado de features (var(--feclr5))',
  'Color del título de cada item de features (var(--feclr6))',
  'Color de la descripción de cada item de features (var(--feclr7))',
  'Color de la barra de enlace de features (var(--feclr8))',
  'Color de fondo de la sección features (var(--feclr9))',
];

const PROMO_LABELS = ['Fondo Contenedor', 'Degradado Inicio', 'Degradado Final', 'Título', 'Texto', 'Número/Acento', 'Enlace', 'Borde', 'Fondo Exterior'];
const PROMO_TOOLTIPS = [
  'Color de fondo del contenedor promo (var(--cbclr1))',
  'Color de inicio del degradado del promo (var(--cbclr2))',
  'Color final del degradado del promo (var(--cbclr3))',
  'Color del título del promo (var(--cbclr4))',
  'Color del texto del promo (var(--cbclr5))',
  'Color de números y acentos del promo (var(--cbclr6))',
  'Color de enlaces del promo (var(--cbclr7))',
  'Color de borde del promo (var(--cbclr8))',
  'Color de fondo exterior del promo (var(--cbclr9))',
];

const SLIDESHOW_LABELS = ['Fondo Tarjeta', 'Texto Secundario', 'Texto Terciario', 'Acento', 'Texto Principal', 'Overlay', 'Enlace', 'Fondo Exterior', 'Borde'];
const SLIDESHOW_TOOLTIPS = [
  'Color de fondo de las tarjetas del slideshow (var(--bsclr1))',
  'Color de texto secundario del slideshow (var(--bsclr2))',
  'Color de texto terciario del slideshow (var(--bsclr3))',
  'Color de acento del slideshow (var(--bsclr4))',
  'Color de texto principal del slideshow (var(--bsclr5))',
  'Color de overlay del slideshow (var(--bsclr6))',
  'Color de enlaces del slideshow (var(--bsclr7))',
  'Color de fondo exterior del slideshow (var(--bsclr8))',
  'Color de borde del slideshow (var(--bsclr9))',
];

const TESTIMONIALS_LABELS = ['Fondo Sección', 'Título', 'Texto', 'Comillas', 'Nombre', 'Estrellas', 'Borde', 'Fondo Tarjeta'];
const TESTIMONIALS_TOOLTIPS = [
  'Color de fondo de la sección testimonios (var(--tsclr1))',
  'Color del título de la sección testimonios (var(--tsclr2))',
  'Color del texto de testimonios (var(--tsclr3))',
  'Color de las comillas de testimonios (var(--tsclr4))',
  'Color del nombre del testimonio (var(--tsclr5))',
  'Color de las estrellas de valoración (var(--tsclr6))',
  'Color de borde de testimonios (var(--tsclr7))',
  'Color de fondo de las tarjetas de testimonios (var(--tsclr8))',
];

const VISIT_LABELS = ['Fondo Sección', 'Título', 'Texto', 'Fondo Tarjeta', 'Acento', 'Texto Secundario', 'Fondo Botón', 'Borde', 'Resaltado'];
const VISIT_TOOLTIPS = [
  'Color de fondo de la sección visítanos (var(--vsclr1))',
  'Color del título de la sección visítanos (var(--vsclr2))',
  'Color del texto de la sección visítanos (var(--vsclr3))',
  'Color de fondo de las tarjetas de visita (var(--vsclr4))',
  'Color de acento de la sección visítanos (var(--vsclr5))',
  'Color de texto secundario de visita (var(--vsclr6))',
  'Color de fondo del botón de visita (var(--vsclr7))',
  'Color de borde de la sección visítanos (var(--vsclr8))',
  'Color de resaltado de la sección visítanos (var(--vsclr9))',
];

const MENU_LABELS = ['Fondo Inicial', 'Fondo Final', 'Texto', 'Énfasis', 'Enlaces', 'Cuadro Enlace', 'Pretitulo Menú', 'Nombre Corto Menú', 'Slogan Menú', 'Bordes', 'Texto Hover'];
const MENU_TOOLTIPS = [
  'Color de inicio del degradado del menú lateral (var(--mclr1))',
  'Color final del degradado del menú lateral (var(--mclr2))',
  'Color del texto del menú lateral (var(--mclr3))',
  'Color de énfasis del menú lateral (var(--mclr4))',
  'Color de los enlaces del menú lateral (var(--mclr5))',
  'Color del cuadro de enlace del menú lateral (var(--mclr6))',
  'Color del texto pretítulo del menú lateral (var(--mclr7))',
  'Color del nombre corto del menú lateral (var(--mclr8))',
  'Color del slogan del menú lateral (var(--mclr9))',
  'Color de los bordes y divisores del menú lateral (var(--mclr10))',
  'Color del texto del menú lateral al pasar el cursor (var(--mclr11))',
];

const PANEL_LABELS = [
  'Fondo Inicial', 'Fondo Final', 'Fondo Cajas e Inputs',
  'Título Principal', 'Subtítulo Rol/Unidad', 'Texto Estado/Metadatos',
  'Pestaña Inactiva', 'Pestaña Activa / Acento', 'Pestaña Hover',
  'Acción Primaria', 'Acción Neutra', 'Acción Secundaria / Peligro',
  'Separadores Internos', 'Bordes / Focus',
];
const PANEL_TOOLTIPS = [
  'Color de fondo inicial del contenedor del panel (var(--pclr1))',
  'Color de fondo final del degradado del panel (var(--pclr2))',
  'Color de fondo para cajas, tarjetas e inputs del panel (var(--pclr3))',
  'Color del título principal del usuario (var(--pclr4))',
  'Color del subtítulo de rol y unidad (var(--pclr5))',
  'Color de texto para estado y metadatos (var(--pclr6))',
  'Color de la pestaña inactiva (var(--pclr7))',
  'Color de la pestaña activa o acento (var(--pclr8))',
  'Color de la pestaña al pasar el cursor (var(--pclr9))',
  'Color de botones para acción primaria (var(--pclr10))',
  'Color de botones para acción neutra (var(--pclr11))',
  'Color de botones para acción secundaria / peligro (var(--pclr12))',
  'Color de separadores e hitos internos del panel (var(--pclr13))',
  'Color de bordes y estado focus del panel (var(--pclr14))',
];

// ---------------------------------------------------------------------------
// Zones
// ---------------------------------------------------------------------------

export const ADMIN_ZONES: AdminZone[] = [
  // =========================================================================
  // INICIO
  // =========================================================================
  {
    id: 'inicio',
    label: 'Inicio',
    icon: '🏠',
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        category: 'hero',
        schemaId: 'hero',
        visibilityKey: 'hero',
        fields: [
          { key: 'frases', label: 'Frases (una por línea)', type: 'json', tooltip: 'Frases que rotan en el centro del hero. Formato: "Título, subtítulo" por línea' },
          { key: 'fondo', label: 'Imagen de Fondo', type: 'text', tooltip: 'Ruta de la imagen de fondo del hero' },
          { key: 'intervalo', label: 'Intervalo (ms)', type: 'number', tooltip: 'Tiempo en milisegundos entre cada frase. Recomendado: 5000 (5 segundos)' },
          { key: 'imagenes_pool', label: 'Pool de Imágenes (JSON array)', type: 'json', tooltip: 'Lista de rutas de imágenes que se barajan al azar como overlay del hero. Formato JSON: ["/images/foto1.webp", ...]' },
          { key: 'top_count', label: 'Imágenes superiores', type: 'number', tooltip: 'Cuántas imágenes aleatorias mostrar arriba del texto en el hero (0-6)' },
          { key: 'bottom_count', label: 'Imágenes inferiores', type: 'number', tooltip: 'Cuántas imágenes aleatorias mostrar abajo del texto en el hero (0-6)' },
        ],
      },
      {
        id: 'hero-colors',
        title: 'Colores del Hero',
        category: 'hero',
        schemaId: 'hero_colors',
        layout: 'grid',
        fields: colorGrid('heclr', 13, (n) => HERO_LABELS[n - 1], (n) => HERO_TOOLTIPS[n - 1]),
      },
      {
        id: 'features',
        title: 'Features',
        category: 'features',
        schemaId: 'features',
        visibilityKey: 'features',
        fields: [
          { key: 'titulo_seccion', label: 'Título de Sección', type: 'text', tooltip: 'Título grande de la sección "¿Qué hacemos?"' },
          { key: 'subtitulo', label: 'Subtítulo', type: 'text', tooltip: 'Texto debajo del título de la sección' },
          { key: 'items', label: 'Items (JSON array)', type: 'json', tooltip: 'Cards de features. Cada item: { "title", "description", "image", "link" }. Un item por objeto JSON' },
        ],
      },
      {
        id: 'features-colors',
        title: 'Colores de Features',
        category: 'features',
        schemaId: 'features_colors',
        layout: 'grid',
        fields: colorGrid('feclr', 9, (n) => FEATURES_LABELS[n - 1], (n) => FEATURES_TOOLTIPS[n - 1]),
      },
      {
        id: 'promo-colors',
        title: 'Colores del Promo',
        category: 'promo_colors',
        schemaId: 'promo_colors',
        layout: 'grid',
        visibilityKey: 'promo',
        fields: colorGrid('cbclr', 9, (n) => PROMO_LABELS[n - 1], (n) => PROMO_TOOLTIPS[n - 1]),
      },
      {
        id: 'slideshow-colors',
        title: 'Colores del Slideshow',
        category: 'slideshow_colors',
        schemaId: 'slideshow_colors',
        layout: 'grid',
        visibilityKey: 'slideshow',
        fields: colorGrid('bsclr', 9, (n) => SLIDESHOW_LABELS[n - 1], (n) => SLIDESHOW_TOOLTIPS[n - 1]),
      },
      {
        id: 'testimonials',
        title: 'Testimonios',
        category: 'testimonials',
        schemaId: 'testimonials',
        visibilityKey: 'testimonials',
        fields: [
          { key: 'titulo_seccion', label: 'Título de Sección', type: 'text', tooltip: 'Título de la sección de testimonios' },
          { key: 'widget_url', label: 'Widget URL', type: 'url', tooltip: 'URL del widget de TaggBox o servicio similar que muestra los testimonios' },
        ],
      },
      {
        id: 'testimonials-colors',
        title: 'Colores de Testimonios',
        category: 'testimonials_colors',
        schemaId: 'testimonials_colors',
        layout: 'grid',
        fields: colorGrid('tsclr', 8, (n) => TESTIMONIALS_LABELS[n - 1], (n) => TESTIMONIALS_TOOLTIPS[n - 1]),
      },
      {
        id: 'visit',
        title: 'Visítanos',
        category: 'visit',
        schemaId: 'visit',
        visibilityKey: 'visit',
        fields: [
          { key: 'titulo', label: 'Título', type: 'text', tooltip: 'Título de la sección "¡Únete Ahora!"' },
          { key: 'fecha_fundacion', label: 'Fecha de Fundación', type: 'text', tooltip: 'Fecha usada para calcular los años de historia. Formato: YYYY-MM-DD' },
          { key: 'email', label: 'Email', type: 'text', tooltip: 'Correo que se muestra en la sección de visita' },
          { key: 'email_href', label: 'Email Href', type: 'text', tooltip: 'Link del botón de email. Formato: "mailto:correo@dominio.cl"' },
          { key: 'horario', label: 'Horario', type: 'text', tooltip: 'Horario que se muestra junto al reloj. Ej: "Sábados 3 a 6 PM"' },
          { key: 'cta_texto', label: 'Texto CTA', type: 'text', tooltip: 'Texto del botón/círculo de llamada a la acción. Ej: "VEN A VISITARNOS"' },
          { key: 'imagen', label: 'Imagen', type: 'text', tooltip: 'Ruta de la imagen del círculo de visita' },
        ],
      },
      {
        id: 'visit-colors',
        title: 'Colores de Visítanos',
        category: 'visit_colors',
        schemaId: 'visit_colors',
        layout: 'grid',
        fields: colorGrid('vsclr', 9, (n) => VISIT_LABELS[n - 1], (n) => VISIT_TOOLTIPS[n - 1]),
      },
      {
        id: 'direccion-mapa',
        title: 'Dirección y Mapa',
        category: 'contact',
        schemaId: 'contact.visit',
        fields: [
          { key: 'direccion', label: 'Dirección (HTML permitido)', type: 'textarea', tooltip: 'Dirección física. Se permite HTML como <br/> para saltos de línea. Compartido con Footer → Contacto' },
          { key: 'maps_embed', label: 'Maps Embed URL', type: 'url', tooltip: 'URL de incrustación de Google Maps. Compartido con Footer → Contacto' },
        ],
      },
      {
        id: 'faq',
        title: 'FAQ',
        category: 'faq',
        schemaId: 'faq',
        visibilityKey: 'faq',
        fields: [
          { key: 'titulo_seccion', label: 'Título de Sección', type: 'text', tooltip: 'Título de la sección de Preguntas Frecuentes' },
          { key: 'subtitulo', label: 'Subtítulo', type: 'text', tooltip: 'Texto debajo del título del FAQ' },
          { key: 'items', label: 'Items (JSON array)', type: 'json', tooltip: 'Preguntas frecuentes. Cada item: { "question", "answer", "image" }. El answer acepta HTML' },
        ],
      },
      {
        id: 'faq-colors',
        title: 'Colores de FAQ',
        category: 'faq_colors',
        schemaId: 'faq_colors',
        layout: 'grid',
        fields: colorGrid('fclr', 8, (n) => `Color ${n}`, (n) => `Color del rol ${n} de FAQ en modo claro (var(--fclr${n}))`),
      },
    ],
  },
  // =========================================================================
  // HEADER
  // =========================================================================
  {
    id: 'header',
    label: 'Header',
    icon: '📰',
    sections: [
      {
        id: 'marca',
        title: 'Marca',
        category: 'branding',
        schemaId: 'branding.header',
        fields: [
          { key: 'logo_header', label: 'Logo Header (path)', type: 'text', tooltip: 'Ruta de la imagen del logo en el header. Ej: "/images/logos/logo.webp"' },
          { key: 'logo_sidebar', label: 'Logo Sidebar (path)', type: 'text', tooltip: 'Ruta de la imagen del logo en el sidebar del menú. Ej: "/images/logos/LogoColor.svg"' },
          { key: 'pretitulo', label: 'Pretitulo', type: 'text', tooltip: 'Texto pequeño arriba del nombre en el header. Ej: "Guías y Scouts"' },
          { key: 'nombre_corto', label: 'Nombre Corto', type: 'text', tooltip: 'Nombre corto en header y título del sitio. Ej: "Nua Mana"' },
          { key: 'slogan', label: 'Slogan', type: 'text', tooltip: 'Frase corta debajo del nombre. Ej: "una nueva aventura"' },
        ],
      },
      {
        id: 'secondary-header-colors',
        title: 'Colores del Header Secundario',
        category: 'secondary_header_colors',
        schemaId: 'secondary_header_colors',
        layout: 'grid',
        fields: colorGrid('shclr', 14, (n) => SECONDARY_HEADER_LABELS[n - 1], (n) => SECONDARY_HEADER_TOOLTIPS[n - 1]),
      },
      {
        id: 'header-colors',
        title: 'Colores del Header',
        category: 'header_colors',
        schemaId: 'header_colors',
        layout: 'grid',
        fields: colorGrid('hclr', 13, (n) => HEADER_LABELS[n - 1], (n) => HEADER_TOOLTIPS[n - 1]),
      },
      {
        id: 'menu-colors',
        title: 'Colores del Menú',
        category: 'menu_colors',
        schemaId: 'menu_colors',
        layout: 'grid',
        fields: colorGrid('mclr', 11, (n) => MENU_LABELS[n - 1], (n) => MENU_TOOLTIPS[n - 1]),
      },
      {
        id: 'navegacion',
        title: 'Navegación',
        category: 'navigation',
        schemaId: 'navigation',
        fields: [
          { key: 'label_panel', label: 'Label Panel', type: 'text', tooltip: 'Texto del botón que lleva al panel de usuario. Ej: "Mi Panel"' },
          { key: 'label_login', label: 'Label Login', type: 'text', tooltip: 'Texto del botón de inicio de sesión. Ej: "Acceder"' },
        ],
      },
    ],
  },
  // =========================================================================
  // FOOTER
  // =========================================================================
  {
    id: 'footer',
    label: 'Footer',
    icon: '🏁',
    sections: [
      {
        id: 'marca',
        title: 'Marca',
        category: 'branding',
        schemaId: 'branding.footer',
        fields: [
          { key: 'logo_footer', label: 'Logo Footer (path)', type: 'text', tooltip: 'Ruta de la imagen del logo en el footer' },
          { key: 'nombre_grupo', label: 'Nombre del Grupo', type: 'text', tooltip: 'Nombre completo que aparece en footer y metadata. Ej: "Guías y Scouts Nua Mana"' },
          { key: 'mision', label: 'Misión', type: 'textarea', tooltip: 'Texto largo en el footer que describe la misión del grupo' },
          { key: 'motto', label: 'Lema', type: 'text', tooltip: 'Frase del pie de página junto al copyright. Ej: "Educación para la vida"' },
          { key: 'copyright', label: 'Copyright', type: 'text', tooltip: 'Texto de copyright en el pie. Ej: "Guías y Scouts Nua Mana"' },
        ],
      },
      {
        id: 'contacto',
        title: 'Contacto',
        category: 'contact',
        schemaId: 'contact',
        fields: [
          { key: 'sede_nombre', label: 'Nombre de la Sede', type: 'text', tooltip: 'Nombre de la sede que aparece en footer y sección de visita' },
          { key: 'direccion', label: 'Dirección (HTML permitido)', type: 'textarea', tooltip: 'Dirección física. Se permite HTML como <br/> para saltos de línea' },
          { key: 'maps_embed', label: 'Maps Embed URL', type: 'url', tooltip: 'URL de incrustación de Google Maps. Se usa en footer y sección "Visítanos"' },
        ],
      },
      {
        id: 'footer-colors',
        title: 'Colores del Footer',
        category: 'footer_colors',
        schemaId: 'footer_colors',
        layout: 'grid',
        fields: colorGrid('foclr', 10, (n) => `Color ${n}`, (n) => `Color del rol ${n} del footer en modo claro (var(--foclr${n}))`),
      },
    ],
  },
  // =========================================================================
  // GLOBAL
  // =========================================================================
  {
    id: 'global',
    label: 'Global',
    icon: '🌐',
    sections: [
      {
        id: 'seo',
        title: 'SEO',
        category: 'seo',
        schemaId: 'seo',
        fields: [
          { key: 'title', label: 'Title', type: 'text', tooltip: 'Título SEO del sitio. Aparece en la pestaña del navegador y Google' },
          { key: 'description', label: 'Description', type: 'textarea', tooltip: 'Descripción SEO. Aparece en los resultados de Google (max ~160 caracteres)' },
        ],
      },
      {
        id: 'pwa',
        title: 'PWA',
        category: 'pwa',
        schemaId: 'pwa',
        fields: [
          { key: 'name', label: 'Name', type: 'text', tooltip: 'Nombre completo de la app PWA. Aparece al instalar en el escritorio' },
          { key: 'short_name', label: 'Short Name', type: 'text', tooltip: 'Nombre corto de la app PWA. Aparece en el icono del home screen' },
          { key: 'description', label: 'Description', type: 'textarea', tooltip: 'Descripción de la app PWA para stores y metadata' },
          { key: 'lang', label: 'Idioma', type: 'text', tooltip: 'Idioma de la app PWA. Ej: "es"' },
          { key: 'icon_192', label: 'Icon 192 (path)', type: 'text', tooltip: 'Ruta del icono 192x192 para PWA' },
          { key: 'icon_512', label: 'Icon 512 (path)', type: 'text', tooltip: 'Ruta del icono 512x512 para PWA' },
          { key: 'icon_1024', label: 'Icon 1024 (path)', type: 'text', tooltip: 'Ruta del icono 1024x1024 para PWA' },
        ],
      },
      {
        id: 'colores-tema',
        title: 'Colores del Tema',
        category: 'theme_colors',
        schemaId: 'theme_colors',
        layout: 'grid',
        fields: [
          ...colorGrid('clr', 10, (n) => BASE_LABELS[n - 1], (n) => BASE_TOOLTIPS[n - 1]),
          { key: '_heading_tarjetas', label: 'Tarjetas', type: 'heading', tooltip: 'Sección de colores de tarjetas' },
          ...colorGrid('tclr', 6, (n) => TARJETAS_LABELS[n - 1], (n) => TARJETAS_TOOLTIPS[n - 1]),
        ],
      },
      {
        id: 'panel-colors',
        title: 'Colores del Panel',
        category: 'panel_colors',
        schemaId: 'panel_colors',
        layout: 'grid',
        fields: colorGrid('pclr', 14, (n) => PANEL_LABELS[n - 1], (n) => PANEL_TOOLTIPS[n - 1]),
      },
    ],
  },
  // =========================================================================
  // REDES SOCIALES
  // =========================================================================
  {
    id: 'social',
    label: 'Redes Sociales',
    icon: '🔗',
    tabOnly: true,
    sections: [],
  },
  // =========================================================================
  // MENÚ (tab-only marker)
  // =========================================================================
  {
    id: 'menu',
    label: 'Menú de Navegación',
    icon: '📋',
    tabOnly: true,
    sections: [],
  },
  // =========================================================================
  // CONTENIDO (tab-only marker)
  // =========================================================================
  {
    id: 'contenido',
    label: 'Contenido',
    icon: '📄',
    tabOnly: true,
    sections: [],
  },
];
