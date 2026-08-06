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
}

export interface AdminZone {
  id: string;
  label: string;
  icon: string;
  sections: ZoneSection[];
  tabOnly?: boolean;
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
        fields: [
          { key: 'clr1', label: 'Claro 1 — Blanco', type: 'color', tooltip: 'Fondo principal del sitio en modo claro (var(--clr1))' },
          { key: 'clr2', label: 'Claro 2 — Gris Claro', type: 'color', tooltip: 'Gris de acento para bordes y separadores (var(--clr2))' },
          { key: 'clr3', label: 'Claro 3 — Gris Oscuro', type: 'color', tooltip: 'Texto secundario y bordes en modo claro (var(--clr3))' },
          { key: 'clr4', label: 'Claro 4 — Negro', type: 'color', tooltip: 'Fondo de header/footer y texto principal en claro (var(--clr4))' },
          { key: 'clr5', label: 'Claro 5 — Azul Noche', type: 'color', tooltip: 'Azul profundo para encabezados y secciones (var(--clr5))' },
          { key: 'clr6', label: 'Claro 6 — Verde', type: 'color', tooltip: 'Verde de éxito y acentos positivos (var(--clr6))' },
          { key: 'clr7', label: 'Claro 7 — Acento (Rojo)', type: 'color', tooltip: 'Color de acento principal (rojo), botones y scrollbars (var(--clr7))' },
          { key: 'clr8', label: 'Claro 8 — Dorado', type: 'color', tooltip: 'Dorado para destacados y badges (var(--clr8))' },
          { key: 'clr9', label: 'Claro 9 — Gris Muy Claro', type: 'color', tooltip: 'Fondo de tarjetas y secciones alternas (var(--clr9))' },
          { key: 'clr10', label: 'Claro 10 — Gris Borde', type: 'color', tooltip: 'Bordes y fondos tenues en modo claro (var(--clr10))' },
          { key: 'dclr1', label: 'Oscuro 1 — Fondo Oscuro', type: 'color', tooltip: 'Fondo principal en modo oscuro (var(--dclr1))' },
          { key: 'dclr2', label: 'Oscuro 2 — Gris Claro Oscuro', type: 'color', tooltip: 'Texto e íconos en modo oscuro (var(--dclr2))' },
          { key: 'dclr3', label: 'Oscuro 3 — Gris Oscuro Profundo', type: 'color', tooltip: 'Superficie de tarjetas en modo oscuro (var(--dclr3))' },
          { key: 'dclr4', label: 'Oscuro 4 — Negro Profundo', type: 'color', tooltip: 'Fondo más oscuro del modo oscuro (var(--dclr4))' },
          { key: 'dclr5', label: 'Oscuro 5 — Azul Noche Oscuro', type: 'color', tooltip: 'Encabezados y secciones en modo oscuro. Corregido por contraste (var(--dclr5))' },
          { key: 'dclr6', label: 'Oscuro 6 — Verde Oscuro', type: 'color', tooltip: 'Verde de éxito en modo oscuro. Corregido por contraste (var(--dclr6))' },
          { key: 'dclr7', label: 'Oscuro 7 — Acento (Rojo Oscuro)', type: 'color', tooltip: 'Color de acento principal en modo oscuro. Corregido por contraste WCAG (var(--dclr7))' },
          { key: 'dclr8', label: 'Oscuro 8 — Dorado Oscuro', type: 'color', tooltip: 'Dorado para destacados en modo oscuro. Corregido por contraste (var(--dclr8))' },
          { key: 'dclr9', label: 'Oscuro 9 — Superficie Oscura', type: 'color', tooltip: 'Superficie de tarjetas elevadas en modo oscuro (var(--dclr9))' },
          { key: 'dclr10', label: 'Oscuro 10 — Borde Oscuro', type: 'color', tooltip: 'Bordes y separadores en modo oscuro (var(--dclr10))' },
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
