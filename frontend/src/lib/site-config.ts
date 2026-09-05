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
  SocialListConfig,
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
import type { PromoColorsConfig } from './site-config.types';
import type { SlideshowColorsConfig } from './site-config.types';
import type { TestimonialsColorsConfig } from './site-config.types';
import type { VisitColorsConfig } from './site-config.types';
import type { FAQColorsConfig } from './site-config.types';
import type { SectionVisibilityConfig } from './site-config.types';
import type { SecondaryHeaderColorsConfig } from './site-config.types';
import type { FooterColorsConfig } from './site-config.types';

// ---------------------------------------------------------------------------
// Supabase client (server-side only — uses service role for admin writes,
// anon key for public reads). For reads we use the anon key since RLS allows
// public SELECT.
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
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
    logo_sidebar: '/images/logos/LogoColor.svg',
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
    // Gradient overlay (3 light + 3 dark)
    heclr1: '#cb3327',
    heclr2: '#cb3327',
    heclr3: '#cb3327',
    hedclr1: '#121212',
    hedclr2: '#1e1e1e',
    hedclr3: '#121212',
    // Texts (2 light + 2 dark)
    heclr4: '#ffd700',
    heclr5: '#ffffff',
    hedclr4: '#ffd700',
    hedclr5: '#ffffff',
    // Border colors (8 light + 8 dark — Tailwind 300 palette matching the original array)
    heclr6: '#fca5a5', // red-300
    heclr7: '#93c5fd', // blue-300
    heclr8: '#86efac', // green-300
    heclr9: '#d8b4fe', // purple-300
    heclr10: '#fde047', // yellow-300
    heclr11: '#fdba74', // orange-300
    heclr12: '#a5b4fc', // indigo-300
    heclr13: '#f9a8d4', // pink-300
    hedclr6: '#fca5a5',
    hedclr7: '#93c5fd',
    hedclr8: '#86efac',
    hedclr9: '#d8b4fe',
    hedclr10: '#fde047',
    hedclr11: '#fdba74',
    hedclr12: '#a5b4fc',
    hedclr13: '#f9a8d4',
    // Overlay opacities (translucent by design — let the background image show through)
    heclr1_opacity: 90, heclr2_opacity: 40, heclr3_opacity: 70,
    hedclr1_opacity: 80, hedclr2_opacity: 40, hedclr3_opacity: 80,
    heclr4_opacity: 100, heclr5_opacity: 100,
    hedclr4_opacity: 100, hedclr5_opacity: 100,
    heclr6_opacity: 100, heclr7_opacity: 100, heclr8_opacity: 100, heclr9_opacity: 100,
    heclr10_opacity: 100, heclr11_opacity: 100, heclr12_opacity: 100, heclr13_opacity: 100,
    hedclr6_opacity: 100, hedclr7_opacity: 100, hedclr8_opacity: 100, hedclr9_opacity: 100,
    hedclr10_opacity: 100, hedclr11_opacity: 100, hedclr12_opacity: 100, hedclr13_opacity: 100,
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
    // Color roles (9 light + 9 dark + 9 light opacity + 9 dark opacity = 36)
    // 1. Título Sección
    feclr1: '#2d3748', fedclr1: '#f7fafc',
    feclr1_opacity: 100, fedclr1_opacity: 100,
    // 2. Subtítulo Sección
    feclr2: '#4a5568', fedclr2: '#e2e8f0',
    feclr2_opacity: 100, fedclr2_opacity: 100,
    // 3. Fondo Inicial (from- gradiente)
    feclr3: '#edf2f7', fedclr3: '#1a202c',
    feclr3_opacity: 100, fedclr3_opacity: 100,
    // 4. Fondo Intermedio (via- gradiente)
    feclr4: '#e2e8f0', fedclr4: '#2d3748',
    feclr4_opacity: 100, fedclr4_opacity: 100,
    // 5. Fondo Terminal (to- gradiente)
    feclr5: '#cbd5e0', fedclr5: '#4a5568',
    feclr5_opacity: 100, fedclr5_opacity: 100,
    // 6. Títulos de Elementos
    feclr6: '#2d3748', fedclr6: '#f7fafc',
    feclr6_opacity: 100, fedclr6_opacity: 100,
    // 7. Descripciones de Elementos
    feclr7: '#4a5568', fedclr7: '#e2e8f0',
    feclr7_opacity: 100, fedclr7_opacity: 100,
    // 8. Barra Enlace
    feclr8: '#ed8936', fedclr8: '#f6ad55',
    feclr8_opacity: 100, fedclr8_opacity: 100,
    // 9. Fondo de Sección
    feclr9: '#edf2f7', fedclr9: '#1a202c',
    feclr9_opacity: 100, fedclr9_opacity: 100,
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
  },
  pwa: {
    name: 'Guías y Scouts Nua Mana',
    short_name: 'Nua Mana',
    description: 'Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre.',
    lang: 'es',
    icon_192: '/icon-192x192.png',
    icon_512: '/icon-512x512.png',
    icon_1024: '/icon-1024x1024.png',
  },
  navigation: {
    label_panel: 'Mi Panel',
    label_login: 'Acceder',
  },
  theme_colors: {
    // Base light (10)
    clr1: '#FFFFFF',
    clr2: '#1d1d1d',
    clr3: '#95a5a6',
    clr4: '#cb3327',
    clr5: '#ffc41d',
    clr6: '#3eb34b',
    clr7: '#e9ecef',
    clr8: '#d4d4d8',
    clr9: '#FFFFFF',
    clr10: '#cb3327',
    // Base dark (10)
    dclr1: '#121212',
    dclr2: '#b0b0b0',
    dclr3: '#8a8a8a',
    dclr4: '#ef4b3a',
    dclr5: '#ffcf33',
    dclr6: '#33a345',
    dclr7: '#3c3c3c',
    dclr8: '#2a2a2a',
    dclr9: '#121212',
    dclr10: '#ef4b3a',
    // Tarjetas light (6)
    tclr1: '#FFFFFF',
    tclr2: '#f8f9fa',
    tclr3: '#2c3e50',
    tclr4: '#cb3327',
    tclr5: '#2c3e50',
    tclr6: '#333333',
    // Tarjetas dark (6)
    tdclr1: '#1e1e1e',
    tdclr2: '#26262b',
    tdclr3: '#d0d0d0',
    tdclr4: '#ef4b3a',
    tdclr5: '#33506f',
    tdclr6: '#b0b0b0',
    // Header light (13)
    hclr1: '#cb3327',
    hclr2: '#ffc41d',
    hclr3: '#95a5a6',
    hclr4: '#cb3327',
    hclr5: '#1d1d1d',
    hclr6: '#f8f9fa',
    hclr7: '#cb3327',
    hclr8: '#333333',
    hclr9: '#cb3327',
    hclr10: '#2c3e50',
    hclr11: '#cb3327',
    hclr12: '#2c3e50',
    hclr13: '#cb3327',
    // Header dark (13)
    hdclr1: '#FFFFFF',
    hdclr2: '#ffcf33',
    hdclr3: '#8a8a8a',
    hdclr4: '#ef4b3a',
    hdclr5: '#ffcf33',
    hdclr6: '#26262b',
    hdclr7: '#ffcf33',
    hdclr8: '#b0b0b0',
    hdclr9: '#ef4b3a',
    hdclr10: '#33506f',
    hdclr11: '#ef4b3a',
    hdclr12: '#33506f',
    hdclr13: '#ef4b3a',
    // Menú light (9)
    mclr1: '#FFFFFF',
    mclr2: '#95a5a6',
    mclr3: '#2c3e50',
    mclr4: '#cb3327',
    mclr5: '#cb3327',
    mclr6: '#cb3327',
    mclr7: '#1d1d1d',
    mclr8: '#cb3327',
    mclr9: '#1d1d1d',
    mclr10: '#e9ecef',
    mclr11: '#cb3327',
    // Menú dark (11)
    mdclr1: '#33506f',
    mdclr2: '#ef4b3a',
    mdclr3: '#b0b0b0',
    mdclr4: '#ef4b3a',
    mdclr5: '#ef4b3a',
    mdclr6: '#ef4b3a',
    mdclr7: '#b0b0b0',
    mdclr8: '#ef4b3a',
    mdclr9: '#ffcf33',
    mdclr10: '#3c3c3c',
    mdclr11: '#ef4b3a',
    // Opacidades — todas 100 (80 entradas)
    // Base
    clr1_opacity: 100,
    clr2_opacity: 100,
    clr3_opacity: 100,
    clr4_opacity: 100,
    clr5_opacity: 100,
    clr6_opacity: 100,
    clr7_opacity: 100,
    clr8_opacity: 100,
    clr9_opacity: 100,
    clr10_opacity: 100,
    dclr1_opacity: 100,
    dclr2_opacity: 100,
    dclr3_opacity: 100,
    dclr4_opacity: 100,
    dclr5_opacity: 100,
    dclr6_opacity: 100,
    dclr7_opacity: 100,
    dclr8_opacity: 100,
    dclr9_opacity: 100,
    dclr10_opacity: 100,
    // Tarjetas
    tclr1_opacity: 100,
    tclr2_opacity: 100,
    tclr3_opacity: 100,
    tclr4_opacity: 100,
    tclr5_opacity: 100,
    tclr6_opacity: 100,
    tdclr1_opacity: 100,
    tdclr2_opacity: 100,
    tdclr3_opacity: 100,
    tdclr4_opacity: 100,
    tdclr5_opacity: 100,
    tdclr6_opacity: 100,
    // Header
    hclr1_opacity: 100,
    hclr2_opacity: 100,
    hclr3_opacity: 100,
    hclr4_opacity: 100,
    hclr5_opacity: 100,
    hclr6_opacity: 100,
    hclr7_opacity: 100,
    hclr8_opacity: 100,
    hclr9_opacity: 100,
    hclr10_opacity: 100,
    hclr11_opacity: 100,
    hclr12_opacity: 100,
    hclr13_opacity: 100,
    hdclr1_opacity: 100,
    hdclr2_opacity: 100,
    hdclr3_opacity: 100,
    hdclr4_opacity: 100,
    hdclr5_opacity: 100,
    hdclr6_opacity: 100,
    hdclr7_opacity: 100,
    hdclr8_opacity: 100,
    hdclr9_opacity: 100,
    hdclr10_opacity: 100,
    hdclr11_opacity: 100,
    hdclr12_opacity: 100,
    hdclr13_opacity: 100,
    // Menú
    mclr1_opacity: 100,
    mclr2_opacity: 100,
    mclr3_opacity: 100,
    mclr4_opacity: 100,
    mclr5_opacity: 100,
    mclr6_opacity: 100,
    mclr7_opacity: 100,
    mclr8_opacity: 100,
    mclr9_opacity: 100,
    mclr10_opacity: 100,
    mclr11_opacity: 100,
    mdclr1_opacity: 100,
    mdclr2_opacity: 100,
    mdclr3_opacity: 100,
    mdclr4_opacity: 100,
    mdclr5_opacity: 100,
    mdclr6_opacity: 100,
    mdclr7_opacity: 100,
    mdclr8_opacity: 100,
    mdclr9_opacity: 100,
    mdclr10_opacity: 100,
    mdclr11_opacity: 100,
  },
  header_colors: {
    // Header light (13)
    hclr1: '#cb3327',
    hclr2: '#ffc41d',
    hclr3: '#95a5a6',
    hclr4: '#cb3327',
    hclr5: '#1d1d1d',
    hclr6: '#f8f9fa',
    hclr7: '#cb3327',
    hclr8: '#333333',
    hclr9: '#cb3327',
    hclr10: '#2c3e50',
    hclr11: '#cb3327',
    hclr12: '#2c3e50',
    hclr13: '#cb3327',
    // Header dark (13)
    hdclr1: '#FFFFFF',
    hdclr2: '#ffcf33',
    hdclr3: '#8a8a8a',
    hdclr4: '#ef4b3a',
    hdclr5: '#ffcf33',
    hdclr6: '#26262b',
    hdclr7: '#ffcf33',
    hdclr8: '#b0b0b0',
    hdclr9: '#ef4b3a',
    hdclr10: '#33506f',
    hdclr11: '#ef4b3a',
    hdclr12: '#33506f',
    hdclr13: '#ef4b3a',
    // Header opacity (26)
    hclr1_opacity: 100, hclr2_opacity: 100, hclr3_opacity: 100, hclr4_opacity: 100, hclr5_opacity: 100,
    hclr6_opacity: 100, hclr7_opacity: 100, hclr8_opacity: 100, hclr9_opacity: 100, hclr10_opacity: 100,
    hclr11_opacity: 100, hclr12_opacity: 100, hclr13_opacity: 100,
    hdclr1_opacity: 100, hdclr2_opacity: 100, hdclr3_opacity: 100, hdclr4_opacity: 100, hdclr5_opacity: 100,
    hdclr6_opacity: 100, hdclr7_opacity: 100, hdclr8_opacity: 100, hdclr9_opacity: 100, hdclr10_opacity: 100,
    hdclr11_opacity: 100, hdclr12_opacity: 100, hdclr13_opacity: 100,
  },
  menu_colors: {
    // Menú light (11)
    mclr1: '#FFFFFF',
    mclr2: '#95a5a6',
    mclr3: '#2c3e50',
    mclr4: '#cb3327',
    mclr5: '#cb3327',
    mclr6: '#cb3327',
    mclr7: '#1d1d1d',
    mclr8: '#cb3327',
    mclr9: '#1d1d1d',
    mclr10: '#e9ecef',
    mclr11: '#cb3327',
    // Menú dark (11)
    mdclr1: '#33506f',
    mdclr2: '#ef4b3a',
    mdclr3: '#b0b0b0',
    mdclr4: '#ef4b3a',
    mdclr5: '#ef4b3a',
    mdclr6: '#ef4b3a',
    mdclr7: '#b0b0b0',
    mdclr8: '#ef4b3a',
    mdclr9: '#ffcf33',
    mdclr10: '#3c3c3c',
    mdclr11: '#ef4b3a',
    // Menú opacity (22)
    mclr1_opacity: 100, mclr2_opacity: 100, mclr3_opacity: 100, mclr4_opacity: 100, mclr5_opacity: 100,
    mclr6_opacity: 100, mclr7_opacity: 100, mclr8_opacity: 100, mclr9_opacity: 100, mclr10_opacity: 100, mclr11_opacity: 100,
    mdclr1_opacity: 100, mdclr2_opacity: 100, mdclr3_opacity: 100, mdclr4_opacity: 100, mdclr5_opacity: 100,
    mdclr6_opacity: 100, mdclr7_opacity: 100, mdclr8_opacity: 100, mdclr9_opacity: 100, mdclr10_opacity: 100, mdclr11_opacity: 100,
  },
  promo_colors: {
    // 1. Fondo Sección
    cbclr1: '#edf2f7', cbdclr1: '#1a202c',
    cbclr1_opacity: 100, cbdclr1_opacity: 100,
    // 2. Gradiente Inicial
    cbclr2: '#e2e8f0', cbdclr2: '#2d3748',
    cbclr2_opacity: 100, cbdclr2_opacity: 100,
    // 3. Gradiente Terminal
    cbclr3: '#cbd5e0', cbdclr3: '#4a5568',
    cbclr3_opacity: 100, cbdclr3_opacity: 100,
    // 4. Título
    cbclr4: '#2c3e50', cbdclr4: '#f7fafc',
    cbclr4_opacity: 100, cbdclr4_opacity: 100,
    // 5. Texto
    cbclr5: '#4a5568', cbdclr5: '#e2e8f0',
    cbclr5_opacity: 100, cbdclr5_opacity: 100,
    // 6. Número/Acento
    cbclr6: '#cb3327', cbdclr6: '#ef4b3a',
    cbclr6_opacity: 100, cbdclr6_opacity: 100,
    // 7. Enlaces
    cbclr7: '#2c3e50', cbdclr7: '#33506f',
    cbclr7_opacity: 100, cbdclr7_opacity: 100,
    // 8. Bordes
    cbclr8: '#e9ecef', cbdclr8: '#3c3c3c',
    cbclr8_opacity: 100, cbdclr8_opacity: 100,
    // 9. Fondo de Sección
    cbclr9: '#FFFFFF', cbdclr9: '#121212',
    cbclr9_opacity: 100, cbdclr9_opacity: 100,
  },
  slideshow_colors: {
    // 1. Fondo de Sección
    bsclr1: '#e9ecef', bsdclr1: '#121212',
    bsclr1_opacity: 100, bsdclr1_opacity: 100,
    // 2. Título
    bsclr2: '#b0b0b0', bsdclr2: '#b0b0b0',
    bsclr2_opacity: 100, bsdclr2_opacity: 100,
    // 3. Subtítulo
    bsclr3: '#95a5a6', bsdclr3: '#95a5a6',
    bsclr3_opacity: 100, bsdclr3_opacity: 100,
    // 4. Enlace
    bsclr4: '#cb3327', bsdclr4: '#cb3327',
    bsclr4_opacity: 100, bsdclr4_opacity: 100,
    // 5. Gradiente Inicial
    bsclr5: '#1d1d1d', bsdclr5: '#121212',
    bsclr5_opacity: 100, bsdclr5_opacity: 100,
    // 6. Gradiente Intermedio
    bsclr6: '#1d1d1d', bsdclr6: '#121212',
    bsclr6_opacity: 20, bsdclr6_opacity: 20,
    // 7. Badge Categoría
    bsclr7: '#cb3327', bsdclr7: '#ef4b3a',
    bsclr7_opacity: 100, bsdclr7_opacity: 100,
    // 8. Título Card
    bsclr8: '#FFFFFF', bsdclr8: '#FFFFFF',
    bsclr8_opacity: 100, bsdclr8_opacity: 100,
    // 9. Bordes
    bsclr9: '#e9ecef', bsdclr9: '#3c3c3c',
    bsclr9_opacity: 100, bsdclr9_opacity: 100,
  },
  testimonials_colors: {
    // 1. Fondo de Sección
    tsclr1: '#e9ecef', tsdclr1: '#3c3c3c',
    tsclr1_opacity: 100, tsdclr1_opacity: 100,
    // 2. Título
    tsclr2: '#cb3327', tsdclr2: '#ef4b3a',
    tsclr2_opacity: 100, tsdclr2_opacity: 100,
    // 3. Subtítulo
    tsclr3: '#1d1d1d', tsdclr3: '#b0b0b0',
    tsclr3_opacity: 100, tsdclr3_opacity: 100,
    // 4. Fondo Tarjeta
    tsclr4: '#FFFFFF', tsdclr4: '#121212',
    tsclr4_opacity: 100, tsdclr4_opacity: 100,
    // 5. Texto Tarjeta
    tsclr5: '#1d1d1d', tsdclr5: '#b0b0b0',
    tsclr5_opacity: 100, tsdclr5_opacity: 100,
    // 6. Texto Secundario
    tsclr6: '#95a5a6', tsdclr6: '#8a8a8a',
    tsclr6_opacity: 100, tsdclr6_opacity: 100,
    // 7. Énfasis
    tsclr7: '#cb3327', tsdclr7: '#ef4b3a',
    tsclr7_opacity: 100, tsdclr7_opacity: 100,
    // 8. Bordes
    tsclr8: '#e9ecef', tsdclr8: '#3c3c3c',
    tsclr8_opacity: 100, tsdclr8_opacity: 100,
  },
  visit_colors: {
    // 1. Fondo de Sección
    vsclr1: '#FFFFFF', vsdclr1: '#121212',
    vsclr1_opacity: 100, vsdclr1_opacity: 100,
    // 2. Título
    vsclr2: '#cb3327', vsdclr2: '#ef4b3a',
    vsclr2_opacity: 100, vsdclr2_opacity: 100,
    // 3. Gradiente Inicial
    vsclr3: '#FFFFFF', vsdclr3: '#1e1e1e',
    vsclr3_opacity: 100, vsdclr3_opacity: 100,
    // 4. Gradiente Final
    vsclr4: '#f8f9fa', vsdclr4: '#26262b',
    vsclr4_opacity: 100, vsdclr4_opacity: 100,
    // 5. Número/Acento
    vsclr5: '#33a345', vsdclr5: '#33a345',
    vsclr5_opacity: 100, vsdclr5_opacity: 100,
    // 6. Texto
    vsclr6: '#333333', vsdclr6: '#b0b0b0',
    vsclr6_opacity: 100, vsdclr6_opacity: 100,
    // 7. CTA Texto
    vsclr7: '#FFFFFF', vsdclr7: '#121212',
    vsclr7_opacity: 100, vsdclr7_opacity: 100,
    // 8. Bordes
    vsclr8: '#e9ecef', vsdclr8: '#3c3c3c',
    vsclr8_opacity: 100, vsdclr8_opacity: 100,
    // 9. Hover Email
    vsclr9: '#ffc41d', vsdclr9: '#ffcf33',
    vsclr9_opacity: 100, vsdclr9_opacity: 100,
  },
  faq_colors: {
    // 1. Fondo de Sección
    fclr1: '#e9ecef', fdclr1: '#3c3c3c',
    fclr1_opacity: 100, fdclr1_opacity: 100,
    // 2. Título
    fclr2: '#cb3327', fdclr2: '#ef4b3a',
    fclr2_opacity: 100, fdclr2_opacity: 100,
    // 3. Subtítulo
    fclr3: '#95a5a6', fdclr3: '#8a8a8a',
    fclr3_opacity: 100, fdclr3_opacity: 100,
    // 4. Fondo Tarjeta
    fclr4: '#FFFFFF', fdclr4: '#121212',
    fclr4_opacity: 100, fdclr4_opacity: 100,
    // 5. Pregunta
    fclr5: '#cb3327', fdclr5: '#ef4b3a',
    fclr5_opacity: 100, fdclr5_opacity: 100,
    // 6. Respuesta
    fclr6: '#1d1d1d', fdclr6: '#b0b0b0',
    fclr6_opacity: 100, fdclr6_opacity: 100,
    // 7. Bordes
    fclr7: '#e9ecef', fdclr7: '#3c3c3c',
    fclr7_opacity: 100, fdclr7_opacity: 100,
    // 8. Icono Toggle
    fclr8: '#cb3327', fdclr8: '#ef4b3a',
    fclr8_opacity: 100, fdclr8_opacity: 100,
  },
  secondary_header_colors: {
    // 14 roles × light + dark (28 hex) + 28 opacities = 56
    // Independent palette for SecondaryHeader (same role layout as hclr/hdclr)
    // 1. Botón Menú
    shclr1: '#cb3327', shdclr1: '#FFFFFF',
    shclr1_opacity: 100, shdclr1_opacity: 100,
    // 2. Separador
    shclr2: '#ffc41d', shdclr2: '#ffcf33',
    shclr2_opacity: 100, shdclr2_opacity: 100,
    // 3. Pretitulo
    shclr3: '#95a5a6', shdclr3: '#8a8a8a',
    shclr3_opacity: 100, shdclr3_opacity: 100,
    // 4. Nombre Corto
    shclr4: '#cb3327', shdclr4: '#ef4b3a',
    shclr4_opacity: 100, shdclr4_opacity: 100,
    // 5. Slogan
    shclr5: '#1d1d1d', shdclr5: '#ffcf33',
    shclr5_opacity: 100, shdclr5_opacity: 100,
    // 6. Fondo Botones
    shclr6: '#f8f9fa', shdclr6: '#26262b',
    shclr6_opacity: 100, shdclr6_opacity: 100,
    // 7. Fondo Botones Hover
    shclr7: '#cb3327', shdclr7: '#ffcf33',
    shclr7_opacity: 100, shdclr7_opacity: 100,
    // 8. Texto Botones
    shclr8: '#333333', shdclr8: '#b0b0b0',
    shclr8_opacity: 100, shdclr8_opacity: 100,
    // 9. Texto Botones Hover
    shclr9: '#cb3327', shdclr9: '#ef4b3a',
    shclr9_opacity: 100, shdclr9_opacity: 100,
    // 10. Texto Header
    shclr10: '#2c3e50', shdclr10: '#b0b0b0',
    shclr10_opacity: 100, shdclr10_opacity: 100,
    // 11. Texto Hover
    shclr11: '#cb3327', shdclr11: '#ef4b3a',
    shclr11_opacity: 100, shdclr11_opacity: 100,
    // 12. Fondo Inicial
    shclr12: '#2c3e50', shdclr12: '#33506f',
    shclr12_opacity: 100, shdclr12_opacity: 100,
    // 13. Fondo Intermedio
    shclr13: '#cb3327', shdclr13: '#ef4b3a',
    shclr13_opacity: 100, shdclr13_opacity: 100,
    // 14. Fondo Final
    shclr14: '#cb3327', shdclr14: '#ef4b3a',
    shclr14_opacity: 100, shdclr14_opacity: 100,
  },
  footer_colors: {
    // 10 roles × light + dark (20 hex) + 20 opacities = 40
    // 1. Fondo Inicial
    foclr1: '#FFFFFF', fodclr1: '#121212',
    foclr1_opacity: 100, fodclr1_opacity: 100,
    // 2. Fondo Intermedio
    foclr2: '#cb3327', fodclr2: '#ef4b3a',
    foclr2_opacity: 100, fodclr2_opacity: 100,
    // 3. Fondo Final
    foclr3: '#cb3327', fodclr3: '#ef4b3a',
    foclr3_opacity: 100, fodclr3_opacity: 100,
    // 4. Texto Principal
    foclr4: '#cb3327', fodclr4: '#b0b0b0',
    foclr4_opacity: 100, fodclr4_opacity: 100,
    // 5. Texto Secundario
    foclr5: '#cb3327', fodclr5: '#ffcf33',
    foclr5_opacity: 100, fodclr5_opacity: 100,
    // 6. Texto Misión
    foclr6: '#1d1d1d', fodclr6: '#b0b0b0',
    foclr6_opacity: 100, fodclr6_opacity: 100,
    // 7. Fondo Iconos
    foclr7: '#cb3327', fodclr7: '#121212',
    foclr7_opacity: 100, fodclr7_opacity: 100,
    // 8. Texto Iconos
    foclr8: '#FFFFFF', fodclr8: '#FFFFFF',
    foclr8_opacity: 100, fodclr8_opacity: 100,
    // 9. Encabezados
    foclr9: '#cb3327', fodclr9: '#ef4b3a',
    foclr9_opacity: 100, fodclr9_opacity: 100,
    // 10. Bordes
    foclr10: '#cb3327', fodclr10: '#ef4b3a',
    foclr10_opacity: 100, fodclr10_opacity: 100,
  },
  section_visibility: {
    hero: true,
    features: true,
    promo: true,
    slideshow: true,
    testimonials: true,
    visit: true,
    faq: true,
  },
  social_list: {
    items: [
      { icon: 'instagram', label: 'Instagram', url: 'https://instagram.com/gruponuamana/', enabled: true, order: 1, placement: 'header,menu,footer' },
      { icon: 'facebook', label: 'Facebook', url: 'https://facebook.com/gruponuamana', enabled: true, order: 2, placement: 'header,menu,footer' },
      { icon: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/56966896001', enabled: true, order: 3, placement: 'header,menu,footer' },
      { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com/@gruponuamana', enabled: true, order: 4, placement: 'menu,footer' },
      { icon: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/@gruponuamana', enabled: true, order: 5, placement: 'menu,footer' },
      { icon: 'google', label: 'Google', url: 'https://google.com/search?q=Guías+y+Scouts+Nua+Mana', enabled: true, order: 6, placement: 'menu,footer' },
      { icon: 'email', label: 'Email', url: 'mailto:contacto@nuamana.cl', enabled: true, order: 7, placement: 'footer' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Config reader with caching
// ---------------------------------------------------------------------------

const CACHE_TAG = 'site-config';

/**
 * Grouped config rows as a plain nested object (category -> key -> value).
 * MUST stay JSON-serializable: unstable_cache persists the cached value as
 * JSON (JSON.stringify on write, JSON.parse on read), so Map/Set instances are
 * destroyed — a Map comes back as `{}` on cache hits and `grouped.get` blows
 * up on the second call within a render (metadata -> viewport -> layout).
 */
type GroupedConfig = Partial<Record<SiteConfigCategory, Record<string, unknown>>>;

/**
 * Fetches all config entries from the database and groups them by category.
 * Wrapped in unstable_cache for cross-request caching.
 */
async function fetchAllConfig(): Promise<GroupedConfig> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('configuracion_sitio')
    .select('categoria, clave, valor')
    .order('categoria');

  if (error || !data) {
    console.warn('[site-config] Failed to fetch config, using defaults:', error?.message);
    return {};
  }

  const grouped: GroupedConfig = {};

  for (const row of data as ConfigEntry[]) {
    const cat = row.categoria;
    const catMap = (grouped[cat] ??= {});

    // Parse JSONB value: if it's a JSON string, parse it; otherwise use as-is
    let parsed = row.valor;
    if (typeof row.valor === 'string') {
      try {
        parsed = JSON.parse(row.valor);
      } catch {
        parsed = row.valor; // keep as string if not valid JSON
      }
    }

    catMap[row.clave] = parsed;
  }

  return grouped;
}

// Cached version — invalidates when revalidateTag('site-config') is called.
// Errors are handled INSIDE fetchAllConfig (defaults fallback), so the cached
// wrapper never propagates a rejected promise or caches an error state.
const getCachedConfig = unstable_cache(
  fetchAllConfig,
  ['site-config-all'],
  { tags: [CACHE_TAG], revalidate: 60 }
);

/**
 * Loads the full site configuration.
 * Merges database values with hardcoded defaults.
 * Database values override defaults where present.
 */
export async function loadSiteConfig(): Promise<SiteConfigRecord> {
  const grouped = await getCachedConfig();
  const defaults = DEFAULT_SITE_CONFIG;

  // Helper to get a category record, falling back to default keys
  function getCat<T extends object>(cat: SiteConfigCategory, defaultObj: T): T {
    const dbMap = grouped[cat];
    if (!dbMap || Object.keys(dbMap).length === 0) return defaultObj;

    const result = { ...defaultObj } as T;
    for (const key of Object.keys(defaultObj) as (keyof T)[]) {
      if (Object.prototype.hasOwnProperty.call(dbMap, key as string)) {
        result[key] = dbMap[key as string] as T[keyof T];
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
    theme_colors: getCat('theme_colors', defaults.theme_colors),
    header_colors: getCat('header_colors', defaults.header_colors),
    menu_colors: getCat('menu_colors', defaults.menu_colors),
    promo_colors: getCat('promo_colors', defaults.promo_colors),
    slideshow_colors: getCat('slideshow_colors', defaults.slideshow_colors),
    testimonials_colors: getCat('testimonials_colors', defaults.testimonials_colors),
    visit_colors: getCat('visit_colors', defaults.visit_colors),
    faq_colors: getCat('faq_colors', defaults.faq_colors),
    secondary_header_colors: getCat('secondary_header_colors', defaults.secondary_header_colors),
    footer_colors: getCat('footer_colors', defaults.footer_colors),
    section_visibility: getCat('section_visibility', defaults.section_visibility),
    social_list: getCat('social_list', defaults.social_list),
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
  const grouped = await getCachedConfig();
  const dbMap = grouped[category];
  if (!dbMap || Object.keys(dbMap).length === 0) return defaultObj;

  const result = { ...defaultObj } as T;
  for (const key of Object.keys(defaultObj) as (keyof T)[]) {
    if (Object.prototype.hasOwnProperty.call(dbMap, key as string)) {
      result[key] = dbMap[key as string] as T[keyof T];
    }
  }
  return result;
}

/**
 * Invalidates the site config cache.
 * Call this after saving config changes.
 */
export { CACHE_TAG as SITE_CONFIG_CACHE_TAG };
