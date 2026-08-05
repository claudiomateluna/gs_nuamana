'use client';

/**
 * SiteConfigForm — Client component for editing site configuration.
 *
 * Category tabs with react-hook-form, Zod validation, and server action save.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { SiteConfigCategory, SiteConfigRecord } from '@/lib/site-config.types';
import { categorySchemaMap } from '@/lib/site-config.validation';
import { saveSiteConfig } from '@/app/(admin)/actions/save-site-config';

// ---------------------------------------------------------------------------
// Field metadata — controls how each key is rendered
// ---------------------------------------------------------------------------

interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'url' | 'color' | 'number';
  rows?: number; // for textarea
  tooltip?: string; // help text shown on hover
}

const categoryFields: Record<SiteConfigCategory, FieldDef[]> = {
  branding: [
    { key: 'nombre_grupo', label: 'Nombre del Grupo', tooltip: 'Nombre completo que aparece en footer y metadata. Ej: "Guías y Scouts Nua Mana"' },
    { key: 'nombre_corto', label: 'Nombre Corto', tooltip: 'Nombre corto en header y título del sitio. Ej: "Nua Mana"' },
    { key: 'pretitulo', label: 'Pretitulo', tooltip: 'Texto pequeño arriba del nombre en el header. Ej: "Guías y Scouts"' },
    { key: 'slogan', label: 'Slogan', tooltip: 'Frase corta debajo del nombre. Ej: "una nueva aventura"' },
    { key: 'mision', label: 'Misión', type: 'textarea', rows: 3, tooltip: 'Texto largo en el footer que describe la misión del grupo' },
    { key: 'motto', label: 'Lema', tooltip: 'Frase del pie de página junto al copyright. Ej: "Educación para la vida"' },
    { key: 'logo_header', label: 'Logo Header (path)', type: 'text', tooltip: 'Ruta de la imagen del logo en el header. Ej: "/images/logos/logo.webp"' },
    { key: 'logo_footer', label: 'Logo Footer (path)', type: 'text', tooltip: 'Ruta de la imagen del logo en el footer' },
    { key: 'copyright', label: 'Copyright', tooltip: 'Texto de copyright en el pie. Ej: "Guías y Scouts Nua Mana"' },
  ],
  social: [
    { key: 'instagram', label: 'Instagram URL', type: 'url', tooltip: 'Link completo al perfil de Instagram. Se muestra como ícono en header y footer' },
    { key: 'facebook', label: 'Facebook URL', type: 'url', tooltip: 'Link completo a la página de Facebook' },
    { key: 'youtube', label: 'YouTube URL', type: 'url', tooltip: 'Link al canal de YouTube' },
    { key: 'tiktok', label: 'TikTok URL', type: 'url', tooltip: 'Link al perfil de TikTok' },
    { key: 'google', label: 'Google URL', type: 'url', tooltip: 'Link a la reseña de Google del grupo' },
    { key: 'whatsapp', label: 'WhatsApp URL', tooltip: 'Link de WhatsApp. Formato: "https://wa.me/569XXXXXXX"' },
    { key: 'email', label: 'Email', type: 'url', tooltip: 'Correo de contacto. Formato: "mailto:correo@dominio.cl"' },
  ],
  contact: [
    { key: 'sede_nombre', label: 'Nombre de la Sede', tooltip: 'Nombre de la sede que aparece en footer y sección de visita' },
    { key: 'direccion', label: 'Dirección (HTML permitido)', type: 'textarea', rows: 2, tooltip: 'Dirección física. Se permite HTML como <br/> para saltos de línea' },
    { key: 'maps_embed', label: 'Maps Embed URL', type: 'url', tooltip: 'URL de incrustación de Google Maps. Se usa en footer y sección "Visítanos"' },
  ],
  hero: [
    { key: 'frases', label: 'Frases (una por línea)', type: 'textarea', rows: 5, tooltip: 'Frases que rotan en el centro del hero. Formato: "Título, subtítulo" por línea' },
    { key: 'fondo', label: 'Imagen de Fondo', tooltip: 'Ruta de la imagen de fondo del hero' },
    { key: 'intervalo', label: 'Intervalo (ms)', type: 'number', tooltip: 'Tiempo en milisegundos entre cada frase. Recomendado: 5000 (5 segundos)' },
    { key: 'imagenes_pool', label: 'Pool de Imágenes (JSON array)', type: 'textarea', rows: 6, tooltip: 'Lista de rutas de imágenes que se barajan al azar como overlay del hero. Formato JSON: ["/images/foto1.webp", ...]' },
    { key: 'top_count', label: 'Imágenes superiores', type: 'number', tooltip: 'Cuántas imágenes aleatorias mostrar arriba del texto en el hero (0-6)' },
    { key: 'bottom_count', label: 'Imágenes inferiores', type: 'number', tooltip: 'Cuántas imágenes aleatorias mostrar abajo del texto en el hero (0-6)' },
  ],
  features: [
    { key: 'titulo_seccion', label: 'Título de Sección', tooltip: 'Título grande de la sección "¿Qué hacemos?"' },
    { key: 'subtitulo', label: 'Subtítulo', tooltip: 'Texto debajo del título de la sección' },
    { key: 'items', label: 'Items (JSON array)', type: 'textarea', rows: 10, tooltip: 'Cards de features. Cada item: { "title", "description", "image", "link" }. Un item por objeto JSON' },
  ],
  faq: [
    { key: 'titulo_seccion', label: 'Título de Sección', tooltip: 'Título de la sección de Preguntas Frecuentes' },
    { key: 'subtitulo', label: 'Subtítulo', tooltip: 'Texto debajo del título del FAQ' },
    { key: 'items', label: 'Items (JSON array)', type: 'textarea', rows: 10, tooltip: 'Preguntas frecuentes. Cada item: { "question", "answer", "image" }. El answer acepta HTML' },
  ],
  testimonials: [
    { key: 'titulo_seccion', label: 'Título de Sección', tooltip: 'Título de la sección de testimonios' },
    { key: 'widget_url', label: 'Widget URL', type: 'url', tooltip: 'URL del widget de TaggBox o servicio similar que muestra los testimonios' },
  ],
  visit: [
    { key: 'titulo', label: 'Título', tooltip: 'Título de la sección "¡Únete Ahora!"' },
    { key: 'fecha_fundacion', label: 'Fecha de Fundación', tooltip: 'Fecha usada para calcular los años de historia. Formato: YYYY-MM-DD' },
    { key: 'email', label: 'Email', tooltip: 'Correo que se muestra en la sección de visita' },
    { key: 'email_href', label: 'Email Href', tooltip: 'Link del botón de email. Formato: "mailto:correo@dominio.cl"' },
    { key: 'horario', label: 'Horario', tooltip: 'Horario que se muestra junto al reloj. Ej: "Sábados 3 a 6 PM"' },
    { key: 'cta_texto', label: 'Texto CTA', tooltip: 'Texto del botón/círculo de llamada a la acción. Ej: "VEN A VISITARNOS"' },
    { key: 'imagen', label: 'Imagen', tooltip: 'Ruta de la imagen del círculo de visita' },
  ],
  seo: [
    { key: 'title', label: 'Title', tooltip: 'Título SEO del sitio. Aparece en la pestaña del navegador y Google' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 2, tooltip: 'Descripción SEO. Aparece en los resultados de Google (max ~160 caracteres)' },
    { key: 'theme_color', label: 'Theme Color', type: 'color', tooltip: 'Color de tema del navegador móvil. Formato: #RRGGBB' },
  ],
  pwa: [
    { key: 'name', label: 'Name', tooltip: 'Nombre completo de la app PWA. Aparece al instalar en el escritorio' },
    { key: 'short_name', label: 'Short Name', tooltip: 'Nombre corto de la app PWA. Aparece en el icono del home screen' },
    { key: 'description', label: 'Description', type: 'textarea', rows: 2, tooltip: 'Descripción de la app PWA para stores y metadata' },
    { key: 'background_color', label: 'Background Color', type: 'color', tooltip: 'Color de fondo de la splash screen de la PWA' },
    { key: 'theme_color', label: 'Theme Color', type: 'color', tooltip: 'Color de la barra del navegador en la PWA' },
    { key: 'lang', label: 'Idioma', tooltip: 'Idioma de la app PWA. Ej: "es"' },
    { key: 'icon_192', label: 'Icon 192 (path)', tooltip: 'Ruta del icono 192x192 para PWA' },
    { key: 'icon_512', label: 'Icon 512 (path)', tooltip: 'Ruta del icono 512x512 para PWA' },
    { key: 'icon_1024', label: 'Icon 1024 (path)', tooltip: 'Ruta del icono 1024x1024 para PWA' },
  ],
  navigation: [
    { key: 'label_panel', label: 'Label Panel', tooltip: 'Texto del botón que lleva al panel de usuario. Ej: "Mi Panel"' },
    { key: 'label_login', label: 'Label Login', tooltip: 'Texto del botón de inicio de sesión. Ej: "Acceder"' },
  ],
};

// ---------------------------------------------------------------------------
// Category tab type
// ---------------------------------------------------------------------------

interface CategoryTab {
  id: SiteConfigCategory;
  label: string;
  icon: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SiteConfigFormProps {
  config: SiteConfigRecord;
  categories: CategoryTab[];
}

export default function SiteConfigForm({ config, categories }: SiteConfigFormProps) {
  const [activeCategory, setActiveCategory] = useState<SiteConfigCategory>(categories[0].id);
  const [saving, setSaving] = useState(false);

  const fields = categoryFields[activeCategory];
  const schema = categorySchemaMap[activeCategory];

  // Build default values from current config
  const defaultValues = fields.reduce<Record<string, unknown>>((acc, field) => {
    const value = (config[activeCategory] as unknown as Record<string, unknown>)[field.key];
    // For arrays (frases, items), serialize to JSON string for the textarea
    if (Array.isArray(value)) {
      acc[field.key] = JSON.stringify(value, null, 2);
    } else {
      acc[field.key] = value ?? '';
    }
    return acc;
  }, {});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: 'onBlur',
  });

  // Reset form when switching categories
  const handleCategoryChange = (cat: SiteConfigCategory) => {
    setActiveCategory(cat);
    const catFields = categoryFields[cat];
    const catDefaults = catFields.reduce<Record<string, unknown>>((acc, field) => {
      const value = (config[cat] as unknown as Record<string, unknown>)[field.key];
      if (Array.isArray(value)) {
        acc[field.key] = JSON.stringify(value, null, 2);
      } else {
        acc[field.key] = value ?? '';
      }
      return acc;
    }, {});
    reset(catDefaults);
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);

    // Get current session token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      toast.error('Sesión expirada. Recargá la página.');
      setSaving(false);
      return;
    }

    // Parse JSON fields back to arrays for features/faq/hero
    const processedData = { ...data };
    if (activeCategory === 'hero' && typeof processedData.frases === 'string') {
      try {
        processedData.frases = JSON.parse(processedData.frases as string);
      } catch {
        processedData.frases = (processedData.frases as string)
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
    if (activeCategory === 'hero' && typeof processedData.imagenes_pool === 'string') {
      try {
        processedData.imagenes_pool = JSON.parse(processedData.imagenes_pool as string);
      } catch {
        processedData.imagenes_pool = (processedData.imagenes_pool as string)
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
    if ((activeCategory === 'features' || activeCategory === 'faq') && typeof processedData.items === 'string') {
      try {
        processedData.items = JSON.parse(processedData.items as string);
      } catch {
        // leave as string — Zod will catch the validation error
      }
    }

    // Convert number fields
    if (activeCategory === 'hero') {
      if (typeof processedData.intervalo === 'string') processedData.intervalo = Number(processedData.intervalo);
      if (typeof processedData.top_count === 'string') processedData.top_count = Number(processedData.top_count);
      if (typeof processedData.bottom_count === 'string') processedData.bottom_count = Number(processedData.bottom_count);
    }

    const result = await saveSiteConfig(activeCategory, processedData, token);

    setSaving(false);

    if (result.success) {
      toast.success(`Configuracion de ${activeCategory} guardada correctamente`);
    } else {
      toast.error(`Error al guardar: ${result.errors?.join(', ')}`);
    }
  };

  const renderField = (field: FieldDef) => {
    const error = errors[field.key];

    const labelWithTooltip = (
      <label className="flex items-center gap-2 text-[0.8em] font-black uppercase tracking-widest text-clr2 ml-2">
        {field.label}
        {field.tooltip && (
          <span className="group relative">
            <svg className="w-4 h-4 text-clr2/50 hover:text-clr7 cursor-help transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4m0-4h.01" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 text-xs font-normal normal-case tracking-normal text-left bg-clr7 text-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
              {field.tooltip}
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-clr7" />
            </span>
          </span>
        )}
      </label>
    );

    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-2">
          {labelWithTooltip}
          <textarea
            {...register(field.key)}
            rows={field.rows ?? 3}
            className="w-full bg-zinc-50 dark:bg-black/20 border-2 border-transparent focus:border-clr7 rounded-2xl p-4 text-clr4 dark:text-clr1 outline-none transition-all font-bold text-sm shadow-inner font-mono"
          />
          {error && (
            <p className="text-clr7 text-[0.8em] ml-2 font-black uppercase tracking-wider">
              {error.message as string}
            </p>
          )}
        </div>
      );
    }

    if (field.type === 'color') {
      return (
        <div key={field.key} className="space-y-2">
          {labelWithTooltip}
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register(field.key)}
              className="w-12 h-12 rounded-xl border-2 border-transparent focus:border-clr7 cursor-pointer"
            />
            <input
              type="text"
              {...register(field.key)}
              className="flex-1 bg-zinc-50 dark:bg-black/20 border-2 border-transparent focus:border-clr7 rounded-2xl p-4 text-clr4 dark:text-clr1 outline-none transition-all font-bold text-sm shadow-inner font-mono"
            />
          </div>
          {error && (
            <p className="text-clr7 text-[0.8em] ml-2 font-black uppercase tracking-wider">
              {error.message as string}
            </p>
          )}
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        {labelWithTooltip}
        <input
          type={field.type ?? 'text'}
          {...register(field.key)}
          className="w-full bg-zinc-50 dark:bg-black/20 border-2 border-transparent focus:border-clr7 rounded-2xl p-4 text-clr4 dark:text-clr1 outline-none transition-all font-bold text-sm shadow-inner"
        />
        {error && (
          <p className="text-clr7 text-[0.8em] ml-2 font-black uppercase tracking-wider">
            {error.message as string}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white/30 via-clr5/20 to-clr7/40 dark:from-clr4 dark:via-clr5 dark:to-clr7/20 rounded-[1rem] p-2 md:p-4 shadow-2xl border border-clr10 dark:border-clr4">
      {/* Category Tabs */}
      <div className="flex border-b border-zinc-100 dark:border-clr4 mb-5 mt-2 overflow-x-auto scrollbar-hide text-[0.85em]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex items-center gap-1 px-3 py-2 uppercase font-slab border-b-2 whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'border-clr7 text-clr7 font-bold'
                : 'border-transparent text-clr2 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        {fields.map(renderField)}

        <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-clr4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-5 bg-clr7 text-white font-black font-display uppercase rounded-[2rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-sm disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
