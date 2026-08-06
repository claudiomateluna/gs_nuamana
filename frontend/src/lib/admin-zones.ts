/**
 * Admin Zone Metadata — CMS Admin Fase 2 (PR1a)
 *
 * Pure metadata describing how site configuration is organized into admin
 * zones (tabs) and sections (per-card forms). Every field of the 11 config
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
  | 'contact.visit';

export interface ZoneSectionField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'color' | 'number' | 'json';
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
  for (let i = 0; i < fields.length; i += 4) {
    groups.push(fields.slice(i, i + 4));
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Zones
// ---------------------------------------------------------------------------

export const ADMIN_ZONES: AdminZone[] = [
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
        fields: [
          {
            key: 'frases',
            label: 'Frases (una por línea)',
            type: 'json',
            tooltip: 'Frases que rotan en el centro del hero. Formato: "Título, subtítulo" por línea',
          },
          {
            key: 'fondo',
            label: 'Imagen de Fondo',
            type: 'text',
            tooltip: 'Ruta de la imagen de fondo del hero',
          },
          {
            key: 'intervalo',
            label: 'Intervalo (ms)',
            type: 'number',
            tooltip: 'Tiempo en milisegundos entre cada frase. Recomendado: 5000 (5 segundos)',
          },
          {
            key: 'imagenes_pool',
            label: 'Pool de Imágenes (JSON array)',
            type: 'json',
            tooltip:
              'Lista de rutas de imágenes que se barajan al azar como overlay del hero. Formato JSON: ["/images/foto1.webp", ...]',
          },
          {
            key: 'top_count',
            label: 'Imágenes superiores',
            type: 'number',
            tooltip: 'Cuántas imágenes aleatorias mostrar arriba del texto en el hero (0-6)',
          },
          {
            key: 'bottom_count',
            label: 'Imágenes inferiores',
            type: 'number',
            tooltip: 'Cuántas imágenes aleatorias mostrar abajo del texto en el hero (0-6)',
          },
        ],
      },
      {
        id: 'features',
        title: 'Features',
        category: 'features',
        schemaId: 'features',
        fields: [
          {
            key: 'titulo_seccion',
            label: 'Título de Sección',
            type: 'text',
            tooltip: 'Título grande de la sección "¿Qué hacemos?"',
          },
          {
            key: 'subtitulo',
            label: 'Subtítulo',
            type: 'text',
            tooltip: 'Texto debajo del título de la sección',
          },
          {
            key: 'items',
            label: 'Items (JSON array)',
            type: 'json',
            tooltip: 'Cards de features. Cada item: { "title", "description", "image", "link" }. Un item por objeto JSON',
          },
        ],
      },
      {
        id: 'testimonials',
        title: 'Testimonios',
        category: 'testimonials',
        schemaId: 'testimonials',
        fields: [
          {
            key: 'titulo_seccion',
            label: 'Título de Sección',
            type: 'text',
            tooltip: 'Título de la sección de testimonios',
          },
          {
            key: 'widget_url',
            label: 'Widget URL',
            type: 'url',
            tooltip: 'URL del widget de TaggBox o servicio similar que muestra los testimonios',
          },
        ],
      },
      {
        id: 'visit',
        title: 'Visítanos',
        category: 'visit',
        schemaId: 'visit',
        fields: [
          {
            key: 'titulo',
            label: 'Título',
            type: 'text',
            tooltip: 'Título de la sección "¡Únete Ahora!"',
          },
          {
            key: 'fecha_fundacion',
            label: 'Fecha de Fundación',
            type: 'text',
            tooltip: 'Fecha usada para calcular los años de historia. Formato: YYYY-MM-DD',
          },
          {
            key: 'email',
            label: 'Email',
            type: 'text',
            tooltip: 'Correo que se muestra en la sección de visita',
          },
          {
            key: 'email_href',
            label: 'Email Href',
            type: 'text',
            tooltip: 'Link del botón de email. Formato: "mailto:correo@dominio.cl"',
          },
          {
            key: 'horario',
            label: 'Horario',
            type: 'text',
            tooltip: 'Horario que se muestra junto al reloj. Ej: "Sábados 3 a 6 PM"',
          },
          {
            key: 'cta_texto',
            label: 'Texto CTA',
            type: 'text',
            tooltip: 'Texto del botón/círculo de llamada a la acción. Ej: "VEN A VISITARNOS"',
          },
          {
            key: 'imagen',
            label: 'Imagen',
            type: 'text',
            tooltip: 'Ruta de la imagen del círculo de visita',
          },
        ],
      },
      {
        id: 'direccion-mapa',
        title: 'Dirección y Mapa',
        category: 'contact',
        schemaId: 'contact.visit',
        fields: [
          {
            key: 'direccion',
            label: 'Dirección (HTML permitido)',
            type: 'textarea',
            tooltip: 'Dirección física. Se permite HTML como <br/> para saltos de línea. Compartido con Footer → Contacto',
          },
          {
            key: 'maps_embed',
            label: 'Maps Embed URL',
            type: 'url',
            tooltip: 'URL de incrustación de Google Maps. Compartido con Footer → Contacto',
          },
        ],
      },
      {
        id: 'faq',
        title: 'FAQ',
        category: 'faq',
        schemaId: 'faq',
        fields: [
          {
            key: 'titulo_seccion',
            label: 'Título de Sección',
            type: 'text',
            tooltip: 'Título de la sección de Preguntas Frecuentes',
          },
          {
            key: 'subtitulo',
            label: 'Subtítulo',
            type: 'text',
            tooltip: 'Texto debajo del título del FAQ',
          },
          {
            key: 'items',
            label: 'Items (JSON array)',
            type: 'json',
            tooltip: 'Preguntas frecuentes. Cada item: { "question", "answer", "image" }. El answer acepta HTML',
          },
        ],
      },
    ],
  },
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
          {
            key: 'logo_header',
            label: 'Logo Header (path)',
            type: 'text',
            tooltip: 'Ruta de la imagen del logo en el header. Ej: "/images/logos/logo.webp"',
          },
          {
            key: 'pretitulo',
            label: 'Pretitulo',
            type: 'text',
            tooltip: 'Texto pequeño arriba del nombre en el header. Ej: "Guías y Scouts"',
          },
          {
            key: 'nombre_corto',
            label: 'Nombre Corto',
            type: 'text',
            tooltip: 'Nombre corto en header y título del sitio. Ej: "Nua Mana"',
          },
          {
            key: 'slogan',
            label: 'Slogan',
            type: 'text',
            tooltip: 'Frase corta debajo del nombre. Ej: "una nueva aventura"',
          },
        ],
      },
      {
        id: 'redes',
        title: 'Redes',
        category: 'social',
        schemaId: 'social.header',
        fields: [
          {
            key: 'instagram',
            label: 'Instagram URL',
            type: 'url',
            tooltip: 'Link completo al perfil de Instagram. Se muestra como ícono en header y footer',
          },
          {
            key: 'facebook',
            label: 'Facebook URL',
            type: 'url',
            tooltip: 'Link completo a la página de Facebook',
          },
          {
            key: 'whatsapp',
            label: 'WhatsApp URL',
            type: 'text',
            tooltip: 'Link de WhatsApp. Formato: "https://wa.me/569XXXXXXX"',
          },
        ],
      },
      {
        id: 'navegacion',
        title: 'Navegación',
        category: 'navigation',
        schemaId: 'navigation',
        fields: [
          {
            key: 'label_panel',
            label: 'Label Panel',
            type: 'text',
            tooltip: 'Texto del botón que lleva al panel de usuario. Ej: "Mi Panel"',
          },
          {
            key: 'label_login',
            label: 'Label Login',
            type: 'text',
            tooltip: 'Texto del botón de inicio de sesión. Ej: "Acceder"',
          },
        ],
      },
    ],
  },
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
          {
            key: 'logo_footer',
            label: 'Logo Footer (path)',
            type: 'text',
            tooltip: 'Ruta de la imagen del logo en el footer',
          },
          {
            key: 'nombre_grupo',
            label: 'Nombre del Grupo',
            type: 'text',
            tooltip: 'Nombre completo que aparece en footer y metadata. Ej: "Guías y Scouts Nua Mana"',
          },
          {
            key: 'mision',
            label: 'Misión',
            type: 'textarea',
            tooltip: 'Texto largo en el footer que describe la misión del grupo',
          },
          {
            key: 'motto',
            label: 'Lema',
            type: 'text',
            tooltip: 'Frase del pie de página junto al copyright. Ej: "Educación para la vida"',
          },
          {
            key: 'copyright',
            label: 'Copyright',
            type: 'text',
            tooltip: 'Texto de copyright en el pie. Ej: "Guías y Scouts Nua Mana"',
          },
        ],
      },
      {
        id: 'redes',
        title: 'Redes',
        category: 'social',
        schemaId: 'social.footer',
        fields: [
          {
            key: 'youtube',
            label: 'YouTube URL',
            type: 'url',
            tooltip: 'Link al canal de YouTube',
          },
          {
            key: 'tiktok',
            label: 'TikTok URL',
            type: 'url',
            tooltip: 'Link al perfil de TikTok',
          },
          {
            key: 'google',
            label: 'Google URL',
            type: 'url',
            tooltip: 'Link a la reseña de Google del grupo',
          },
          {
            key: 'email',
            label: 'Email',
            type: 'url',
            tooltip: 'Correo de contacto. Formato: "mailto:correo@dominio.cl"',
          },
        ],
      },
      {
        id: 'contacto',
        title: 'Contacto',
        category: 'contact',
        schemaId: 'contact',
        fields: [
          {
            key: 'sede_nombre',
            label: 'Nombre de la Sede',
            type: 'text',
            tooltip: 'Nombre de la sede que aparece en footer y sección de visita',
          },
          {
            key: 'direccion',
            label: 'Dirección (HTML permitido)',
            type: 'textarea',
            tooltip: 'Dirección física. Se permite HTML como <br/> para saltos de línea',
          },
          {
            key: 'maps_embed',
            label: 'Maps Embed URL',
            type: 'url',
            tooltip: 'URL de incrustación de Google Maps. Se usa en footer y sección "Visítanos"',
          },
        ],
      },
    ],
  },
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
          {
            key: 'title',
            label: 'Title',
            type: 'text',
            tooltip: 'Título SEO del sitio. Aparece en la pestaña del navegador y Google',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            tooltip: 'Descripción SEO. Aparece en los resultados de Google (max ~160 caracteres)',
          },
          {
            key: 'theme_color',
            label: 'Theme Color',
            type: 'color',
            tooltip: 'Color de tema del navegador móvil. Formato: #RRGGBB',
          },
        ],
      },
      {
        id: 'pwa',
        title: 'PWA',
        category: 'pwa',
        schemaId: 'pwa',
        fields: [
          {
            key: 'name',
            label: 'Name',
            type: 'text',
            tooltip: 'Nombre completo de la app PWA. Aparece al instalar en el escritorio',
          },
          {
            key: 'short_name',
            label: 'Short Name',
            type: 'text',
            tooltip: 'Nombre corto de la app PWA. Aparece en el icono del home screen',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            tooltip: 'Descripción de la app PWA para stores y metadata',
          },
          {
            key: 'background_color',
            label: 'Background Color',
            type: 'color',
            tooltip: 'Color de fondo de la splash screen de la PWA',
          },
          {
            key: 'theme_color',
            label: 'Theme Color',
            type: 'color',
            tooltip: 'Color de la barra del navegador en la PWA',
          },
          {
            key: 'lang',
            label: 'Idioma',
            type: 'text',
            tooltip: 'Idioma de la app PWA. Ej: "es"',
          },
          {
            key: 'icon_192',
            label: 'Icon 192 (path)',
            type: 'text',
            tooltip: 'Ruta del icono 192x192 para PWA',
          },
          {
            key: 'icon_512',
            label: 'Icon 512 (path)',
            type: 'text',
            tooltip: 'Ruta del icono 512x512 para PWA',
          },
          {
            key: 'icon_1024',
            label: 'Icon 1024 (path)',
            type: 'text',
            tooltip: 'Ruta del icono 1024x1024 para PWA',
          },
        ],
      },
      {
        id: 'colores-tema',
        title: 'Colores del Tema',
        category: 'theme_colors',
        schemaId: 'theme_colors',
        layout: 'grid',
        // Row-major grid: 12 roles × 4 fields (clrN, clrN_opacity, dclrN,
        // dclrN_opacity). gridRowGroups chunks by 4 → one table row per role.
        fields: [
          // 1. Color de Fondo
          { key: 'clr1', label: 'Color de Fondo', type: 'color', tooltip: 'Fondo principal del sitio en modo claro (var(--clr1))' },
          { key: 'clr1_opacity', label: 'Transparencia Color de Fondo', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr1', label: 'Color de Fondo Oscuro', type: 'color', tooltip: 'Fondo principal en modo oscuro (var(--dclr1))' },
          { key: 'dclr1_opacity', label: 'Transparencia Color de Fondo Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 2. Texto Secundario
          { key: 'clr2', label: 'Texto Secundario', type: 'color', tooltip: 'Gris de acento para bordes y separadores (var(--clr2))' },
          { key: 'clr2_opacity', label: 'Transparencia Texto Secundario', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr2', label: 'Texto Secundario Oscuro', type: 'color', tooltip: 'Texto e íconos en modo oscuro (var(--dclr2))' },
          { key: 'dclr2_opacity', label: 'Transparencia Texto Secundario Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 3. Borde 2
          { key: 'clr3', label: 'Borde 2', type: 'color', tooltip: 'Texto secundario y bordes en modo claro (var(--clr3))' },
          { key: 'clr3_opacity', label: 'Transparencia Borde 2', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr3', label: 'Borde 2 Oscuro', type: 'color', tooltip: 'Superficie de tarjetas en modo oscuro (var(--dclr3))' },
          { key: 'dclr3_opacity', label: 'Transparencia Borde 2 Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 4. Texto Principal
          { key: 'clr4', label: 'Texto Principal', type: 'color', tooltip: 'Fondo de header/footer y texto principal en claro (var(--clr4))' },
          { key: 'clr4_opacity', label: 'Transparencia Texto Principal', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr4', label: 'Texto Principal Oscuro', type: 'color', tooltip: 'Fondo más oscuro del modo oscuro (var(--dclr4))' },
          { key: 'dclr4_opacity', label: 'Transparencia Texto Principal Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 5. Degradado Inicial
          { key: 'clr5', label: 'Degradado Inicial', type: 'color', tooltip: 'Azul profundo para encabezados y secciones (var(--clr5))' },
          { key: 'clr5_opacity', label: 'Transparencia Degradado Inicial', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr5', label: 'Degradado Inicial Oscuro', type: 'color', tooltip: 'Encabezados y secciones en modo oscuro (var(--dclr5))' },
          { key: 'dclr5_opacity', label: 'Transparencia Degradado Inicial Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 6. Enlaces (Hover)
          { key: 'clr6', label: 'Enlaces (Hover)', type: 'color', tooltip: 'Verde de éxito y acentos positivos (var(--clr6))' },
          { key: 'clr6_opacity', label: 'Transparencia Enlaces (Hover)', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr6', label: 'Enlaces (Hover) Oscuro', type: 'color', tooltip: 'Verde de éxito en modo oscuro (var(--dclr6))' },
          { key: 'dclr6_opacity', label: 'Transparencia Enlaces (Hover) Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 7. Énfasis
          { key: 'clr7', label: 'Énfasis', type: 'color', tooltip: 'Color de acento principal (rojo), botones y scrollbars (var(--clr7))' },
          { key: 'clr7_opacity', label: 'Transparencia Énfasis', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr7', label: 'Énfasis Oscuro', type: 'color', tooltip: 'Color de acento principal en modo oscuro (var(--dclr7))' },
          { key: 'dclr7_opacity', label: 'Transparencia Énfasis Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 8. Énfasis 2 (Dorado)
          { key: 'clr8', label: 'Énfasis 2 (Dorado)', type: 'color', tooltip: 'Dorado para destacados y badges (var(--clr8))' },
          { key: 'clr8_opacity', label: 'Transparencia Énfasis 2 (Dorado)', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr8', label: 'Énfasis 2 (Dorado) Oscuro', type: 'color', tooltip: 'Dorado para destacados en modo oscuro (var(--dclr8))' },
          { key: 'dclr8_opacity', label: 'Transparencia Énfasis 2 (Dorado) Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 9. Superficie
          { key: 'clr9', label: 'Superficie', type: 'color', tooltip: 'Fondo de tarjetas y secciones alternas (var(--clr9))' },
          { key: 'clr9_opacity', label: 'Transparencia Superficie', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr9', label: 'Superficie Oscura', type: 'color', tooltip: 'Superficie de tarjetas elevadas en modo oscuro (var(--dclr9))' },
          { key: 'dclr9_opacity', label: 'Transparencia Superficie Oscura', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 10. Bordes
          { key: 'clr10', label: 'Bordes', type: 'color', tooltip: 'Bordes y fondos tenues en modo claro (var(--clr10))' },
          { key: 'clr10_opacity', label: 'Transparencia Bordes', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr10', label: 'Bordes Oscuros', type: 'color', tooltip: 'Bordes y separadores en modo oscuro (var(--dclr10))' },
          { key: 'dclr10_opacity', label: 'Transparencia Bordes Oscuros', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 11. Degradado Intermedio (Opcional)
          { key: 'clr11', label: 'Degradado Intermedio (Opcional)', type: 'color', tooltip: 'Punto medio del degradado de 3 paradas en modo claro (var(--clr11))' },
          { key: 'clr11_opacity', label: 'Transparencia Degradado Intermedio', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr11', label: 'Degradado Intermedio Oscuro', type: 'color', tooltip: 'Punto medio del degradado de 3 paradas en modo oscuro (var(--dclr11))' },
          { key: 'dclr11_opacity', label: 'Transparencia Degradado Intermedio Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
          // 12. Degradado Término
          { key: 'clr12', label: 'Degradado Término', type: 'color', tooltip: 'Parada final del degradado de 3 paradas en modo claro (var(--clr12))' },
          { key: 'clr12_opacity', label: 'Transparencia Degradado Término', type: 'number', tooltip: 'Opacidad del color claro (0-100). Menos de 100 emite rgba' },
          { key: 'dclr12', label: 'Degradado Término Oscuro', type: 'color', tooltip: 'Parada final del degradado de 3 paradas en modo oscuro (var(--dclr12))' },
          { key: 'dclr12_opacity', label: 'Transparencia Degradado Término Oscuro', type: 'number', tooltip: 'Opacidad del color oscuro (0-100). Menos de 100 emite rgba' },
        ],
      },
    ],
  },
  {
    id: 'menu',
    label: 'Menú de Navegación',
    icon: '📋',
    tabOnly: true,
    sections: [],
  },
];
