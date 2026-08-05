/**
 * Site Configuration Reader
 * Reads from configuracion_sitio table with fallback to hardcoded defaults.
 * Uses React unstable_cache for cross-request caching with tag-based invalidation.
 */

import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import type {
  SiteConfigRecord,
  SiteConfigCategory,
  ConfigEntry,
  BrandingConfig,
  SocialConfig,
  ContactConfig,
  HeroConfig,
  FeaturesConfig,
  FaqConfig,
  TestimonialsConfig,
  VisitConfig,
  SeoConfig,
  PwaConfig,
  NavigationConfig,
  FeatureItem,
  FaqItem,
} from './site-config.types';

// ---------------------------------------------------------------------------
// Supabase client (server-side only — uses service role for admin writes,
// anon key for public reads). For reads we use the anon key since RLS allows
// public SELECT.
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ---------------------------------------------------------------------------
// Hardcoded defaults (current values from the codebase)
// ---------------------------------------------------------------------------

export const DEFAULT_SITE_CONFIG: SiteConfigRecord = {
  branding: {
    nombre_grupo: 'Guías y Scouts Nua Mana',
    nombre_corto: 'Nua Mana',
    pretitulo: 'Guías y Scouts',
    slogan: 'una nueva aventura',
    mision: 'Nuestra misión es contribuir a la educación de jóvenes para que participen en la construcción de un mundo mejor, donde las personas se desarrollen plenamente y jueguen un papel constructivo en la sociedad.',
    motto: 'Educación para la vida • Empoderamiento juvenil • Un mundo mejor',
    logo_header: '/images/logos/logo-nuamana.webp',
    logo_footer: '/images/logos/Iconos-logo.svg',
    copyright: 'Guías y Scouts Nua Mana',
  },
  social: {
    instagram: 'https://instagram.com/gruponuamana/',
    facebook: 'https://facebook.com/gruponuamana',
    youtube: 'https://youtube.com/@gruponuamana',
    tiktok: 'https://tiktok.com/@gruponuamana',
    google: 'https://google.com/search?q=Guías+y+Scouts+Nua+Mana',
    whatsapp: 'https://wa.me/56966896001',
    email: 'mailto:contacto@nuamana.cl',
  },
  contact: {
    sede_nombre: 'Sede San José',
    direccion: 'San José de la Estrella 1004<br/>La Granja, Santiago, Chile',
    maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.382796811922!2d-70.6096195!3d-33.569409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d0a6e457520d%3A0xc3892aa7fa7d74b!2sGuias%20y%20Scouts%20Nua%20Mana!5e0!1ses!2scl!4v1763171854990!5m2!1ses!2scl',
  },
  hero: {
    frases: [
      'SCOUTS, Educación para la Vida',
      'Empoderamos a niñas niños y jovenes, Con Habilidades para Crear un Mundo Mejor',
      'Vivimos en una Aventura, Transformadora y Llena de Crecimiento Personal',
    ],
    fondo: '/images/inicio/fondo.webp',
    intervalo: 5000,
    imagenes_pool: Array.from({ length: 20 }, (_, i) => `/images/fotos/fotos_${String(i + 1).padStart(2, '0')}_.webp`),
    top_count: 3,
    bottom_count: 3,
  },
  features: {
    titulo_seccion: '¿Qué hacemos?',
    subtitulo: 'Descubre las actividades que realizamos en Nua Mana para el desarrollo integral de las niñas, niños y jóvenes.',
    items: [
      { title: 'LOGRAMOS', description: 'Empoderamiento Juvenil', image: '/images/inicio/pag_Logramos.jpg', link: '/lo-que-hacemos/sistema-de-equipos' },
      { title: 'CREAMOS', description: 'Ciudadan@s Activ@s', image: '/images/inicio/pag_Creamos.jpg', link: '/lo-que-hacemos/programa-y-actividades' },
      { title: 'CULTIVAMOS', description: 'Valores y Habilidades', image: '/images/inicio/pag_Cultivamos.jpg', link: '/lo-que-hacemos/habilidades-y-tecnicas' },
      { title: 'ABRAZAMOS', description: 'Educación para la Paz', image: '/images/inicio/pag_Abrazamos.jpg', link: '/lo-que-hacemos/aprender-haciendo' },
    ],
  },
  faq: {
    titulo_seccion: 'Preguntas Frecuentes',
    subtitulo: 'Encuentra respuestas a las dudas más comunes',
    items: [
      { question: '¿PUEDO SER SCOUT?', answer: 'Sí, <b>todos pueden ser scouts</b>, nuestro grupo es abierto a toda la comunidad, para poder ser parte de los scouts, sólo tienes que ser mayor de 7 años y tener ganas de divertirte y jugar junto a otras personas.', image: 'https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-puedoSerScout.png' },
      { question: '¿CÓMO PUEDO PARTICIPAR?', answer: 'Para nosotros es muy importante que niñas, niños y jóvenes se sientan cómodos siendo Scout, para poder participar lo primero es ver si te gusta, por eso tenemos las puertas abiertas a todos y todas las y los que quieran asistir, entonces, ¿Cómo puedes participar? <b>sólo ven un sábado de 3 a 6 de la tarde</b> y ve si te gusta.', image: 'https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-comoPuedoParticipar.png' },
      { question: '¿HASTA QUÉ EDAD PUEDO SER SCOUT?', answer: 'Las y los niños, niñas y jóvenes que participan de las actividades <b>van desde los 7 a los 21 años</b>.', image: 'https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-hastaQueEdadPuedoSerScout.png' },
      { question: '¿HAY QUE PAGAR ALGO?', answer: 'Cómo dijimos antes lo más importante es que te guste, por lo mismo, para ir sábado a sábado a las actividades de 3 a 6 de la tarde, no hay que pagar nada.<br><br>Sin embargo, también nos preocupamos por la salud de las y los scouts, es por ello que tenemos un <b>seguro de accidentes scouts</b> que está incluido dentro de nuestra inscripción. Hay que pagar una inscripción, pero sólo una vez que estás seguro de que te sientes cómodo y que te gusta estar en los Scouts, por otra parte, las salidas por el día, los campamentos y otras actividades tienen un costo que se destina completamente a cubrir los gastos de esas actividades.<br><br>Finalmente, no queremos que el dinero sea un factor por el que no seas Scout, es por lo mismo que como grupo hacemos muchas actividades económicas durante el año, para poder financiar los campamentos y salidas, y depende de tu colaboración en esas actividades el costo que tendrán las salidas y campamentos para tí, ya que la recaudación de las actividades económicas se destina a cubrir esos gastos.', image: 'https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-hayQuePagarAlgo.png' },
      { question: '¿QUÉ INCLUYE LA INSCRIPCIÓN?', answer: 'La inscripción incluye:<br><br><b>• Seguro scout</b> (es un seguro complementario de salud, que se cobra como reembolso posterior a los gastos médicos y descuentos propios de cada niño, niña o joven)<br><b>• Credencial scout</b><br><b>• Insignia del año</b>', image: 'https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-queIncluyeLaInscripcion.png' },
    ],
  },
  testimonials: {
    titulo_seccion: 'Lo que dicen de nosotros',
    widget_url: 'https://widget.taggbox.com/307862?website=1',
  },
  visit: {
    titulo: '¡Únete Ahora!',
    fecha_fundacion: '2005-09-23',
    email: 'contacto@nuamana.cl',
    email_href: 'mailto:contacto@nuamana.cl',
    horario: 'Sábados 3 a 6 PM',
    cta_texto: 'VEN A VISITARNOS',
    imagen: '/images/inicio/AndysShow.png',
  },
  seo: {
    title: 'Guías y Scouts Nua Mana - Una Nueva Aventura',
    description: 'Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre.',
    theme_color: '#cb3327',
  },
  pwa: {
    name: 'Guías y Scouts Nua Mana',
    short_name: 'Nua Mana',
    description: 'Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre.',
    background_color: '#ffffff',
    theme_color: '#cb3327',
    lang: 'es',
    icon_192: '/icon-192x192.png',
    icon_512: '/icon-512x512.png',
    icon_1024: '/icon-1024x1024.png',
  },
  navigation: {
    label_panel: 'Mi Panel',
    label_login: 'Acceder',
  },
};

// ---------------------------------------------------------------------------
// Config reader with caching
// ---------------------------------------------------------------------------

const CACHE_TAG = 'site-config';

/**
 * Fetches all config entries from the database and groups them by category.
 * Wrapped in unstable_cache for cross-request caching.
 */
async function fetchAllConfig(): Promise<Map<SiteConfigCategory, Map<string, unknown>>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('configuracion_sitio')
    .select('categoria, clave, valor')
    .order('categoria');

  if (error || !data) {
    console.warn('[site-config] Failed to fetch config, using defaults:', error?.message);
    return new Map();
  }

  const grouped = new Map<SiteConfigCategory, Map<string, unknown>>();

  for (const row of data as ConfigEntry[]) {
    const cat = row.categoria;
    if (!grouped.has(cat)) {
      grouped.set(cat, new Map());
    }
    const catMap = grouped.get(cat)!;

    // Parse JSONB value: if it's a JSON string, parse it; otherwise use as-is
    let parsed = row.valor;
    if (typeof row.valor === 'string') {
      try {
        parsed = JSON.parse(row.valor);
      } catch {
        parsed = row.valor; // keep as string if not valid JSON
      }
    }

    catMap.set(row.clave, parsed);
  }

  return grouped;
}

// Cached version — invalidates when revalidateTag('site-config') is called
// NOTE: unstable_cache disabled for debugging — re-enable after confirming flow works
// const getCachedConfig = unstable_cache(
//   fetchAllConfig,
//   ['site-config-all'],
//   { tags: [CACHE_TAG], revalidate: 60 }
// );

/**
 * Loads the full site configuration.
 * Merges database values with hardcoded defaults.
 * Database values override defaults where present.
 */
export async function loadSiteConfig(): Promise<SiteConfigRecord> {
  const grouped = await fetchAllConfig();
  const defaults = DEFAULT_SITE_CONFIG;

  // Helper to get a category map, falling back to default keys
  function getCat<T extends object>(cat: SiteConfigCategory, defaultObj: T): T {
    const dbMap = grouped.get(cat);
    if (!dbMap || dbMap.size === 0) return defaultObj;

    const result = { ...defaultObj } as T;
    for (const key of Object.keys(defaultObj) as (keyof T)[]) {
      if (dbMap.has(key as string)) {
        result[key] = dbMap.get(key as string) as T[keyof T];
      }
    }
    return result;
  }

  return {
    branding: getCat('branding', defaults.branding),
    social: getCat('social', defaults.social),
    contact: getCat('contact', defaults.contact),
    hero: getCat('hero', defaults.hero),
    features: getCat('features', defaults.features),
    faq: getCat('faq', defaults.faq),
    testimonials: getCat('testimonials', defaults.testimonials),
    visit: getCat('visit', defaults.visit),
    seo: getCat('seo', defaults.seo),
    pwa: getCat('pwa', defaults.pwa),
    navigation: getCat('navigation', defaults.navigation),
  };
}

/**
 * Loads a single category from config.
 * Useful when a component only needs one category.
 */
export async function loadConfigCategory<T extends object>(
  category: SiteConfigCategory,
  defaultObj: T
): Promise<T> {
  const grouped = await fetchAllConfig();
  const dbMap = grouped.get(category);
  if (!dbMap || dbMap.size === 0) return defaultObj;

  const result = { ...defaultObj } as T;
  for (const key of Object.keys(defaultObj) as (keyof T)[]) {
    if (dbMap.has(key as string)) {
      result[key] = dbMap.get(key as string) as T[keyof T];
    }
  }
  return result;
}

/**
 * Invalidates the site config cache.
 * Call this after saving config changes.
 */
export { CACHE_TAG as SITE_CONFIG_CACHE_TAG };
