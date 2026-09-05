import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ADMIN_ZONES } from '@/lib/admin-zones';
import type { AdminZone } from '@/lib/admin-zones';
import type { SiteConfigRecord } from '@/lib/site-config.types';

// ---------------------------------------------------------------------------
// Mocks — chainable supabase (builder pattern from save-site-config.test.ts),
// the save-site-config server action, and sonner toasts.
// ---------------------------------------------------------------------------

const supabaseMocks = vi.hoisted(() => {
  const getSession = vi.fn(
    async (): Promise<{
      data: { session: { access_token: string } | null };
      error: null;
    }> => ({ data: { session: { access_token: 'token-123' } }, error: null }),
  );
  const supabase = { auth: { getSession } };
  return {
    supabase,
    getSession,
    setSession: (session: { access_token: string } | null) => {
      getSession.mockResolvedValue({ data: { session }, error: null });
    },
  };
});

vi.mock('@/lib/supabase', () => ({ supabase: supabaseMocks.supabase }));

const saveSiteConfigMock = vi.hoisted(() =>
  vi.fn(
    async (
      _schemaId: string,
      _data: Record<string, unknown>,
      _token: string,
    ): Promise<{ success: boolean; errors?: string[] }> => ({ success: true }),
  ),
);
vi.mock('@/app/(admin)/actions/save-site-config', () => ({
  saveSiteConfig: saveSiteConfigMock,
}));

const toastMocks = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast: toastMocks }));

// ---------------------------------------------------------------------------
// Imports — component under test + fixtures
// ---------------------------------------------------------------------------

import ZoneConfigForm from '@/components/admin/ZoneConfigForm';

// Minimal but complete SiteConfigRecord fixture (self-contained — avoids
// pulling site-config.ts / next/cache into the component test).
const CONFIG: SiteConfigRecord = {
  branding: {
    nombre_grupo: 'Guías y Scouts Nua Mana',
    nombre_corto: 'Nua Mana',
    pretitulo: 'Guías y Scouts',
    slogan: 'una nueva aventura',
    mision: 'Educar para la vida',
    motto: 'Educación para la vida',
    logo_header: '/images/logos/logo.webp',
    logo_footer: '/images/logos/logo-footer.webp',
    copyright: 'Guías y Scouts Nua Mana',
  },
  social: {
    instagram: 'https://instagram.com/gruponuamana',
    facebook: 'https://facebook.com/gruponuamana',
    youtube: 'https://youtube.com/@gruponuamana',
    tiktok: 'https://tiktok.com/@gruponuamana',
    google: 'https://google.com/search?q=nuamana',
    whatsapp: 'https://wa.me/56912345678',
    email: 'mailto:contacto@nuamana.cl',
  },
  contact: {
    sede_nombre: 'Sede San José',
    direccion: 'San José de la Estrella 1004<br/>La Granja',
    maps_embed: 'https://www.google.com/maps/embed?pb=',
  },
  hero: {
    frases: ['Frase A', 'Frase B'],
    fondo: '/images/inicio/fondo.webp',
    intervalo: 5000,
    imagenes_pool: ['/images/fotos/fotos_01_.webp'],
    top_count: 3,
    bottom_count: 3,
    heclr1: '#cb3327', heclr2: '#cb3327', heclr3: '#cb3327',
    hedclr1: '#121212', hedclr2: '#1e1e1e', hedclr3: '#121212',
    heclr4: '#ffd700', heclr5: '#ffffff',
    hedclr4: '#ffd700', hedclr5: '#ffffff',
    heclr6: '#fca5a5', heclr7: '#93c5fd', heclr8: '#86efac', heclr9: '#d8b4fe',
    heclr10: '#fde047', heclr11: '#fdba74', heclr12: '#a5b4fc', heclr13: '#f9a8d4',
    heclr1_opacity: 100, heclr2_opacity: 100, heclr3_opacity: 100,
    hedclr1_opacity: 100, hedclr2_opacity: 100, hedclr3_opacity: 100,
    heclr4_opacity: 100, heclr5_opacity: 100,
    hedclr4_opacity: 100, hedclr5_opacity: 100,
    heclr6_opacity: 100, heclr7_opacity: 100, heclr8_opacity: 100, heclr9_opacity: 100,
    heclr10_opacity: 100, heclr11_opacity: 100, heclr12_opacity: 100, heclr13_opacity: 100,
    hedclr6: '#fca5a5', hedclr7: '#93c5fd', hedclr8: '#86efac', hedclr9: '#d8b4fe',
    hedclr10: '#fde047', hedclr11: '#fdba74', hedclr12: '#a5b4fc', hedclr13: '#f9a8d4',
    hedclr6_opacity: 100, hedclr7_opacity: 100, hedclr8_opacity: 100, hedclr9_opacity: 100,
    hedclr10_opacity: 100, hedclr11_opacity: 100, hedclr12_opacity: 100, hedclr13_opacity: 100,
  },
  features: {
    titulo_seccion: '¿Qué hacemos?',
    subtitulo: 'Descubre nuestras actividades',
    items: [{ title: 'LOGRAMOS', description: 'Empoderamiento', image: '/i.jpg', link: '/lo-que-hacemos' }],
  },
  faq: {
    titulo_seccion: 'Preguntas Frecuentes',
    subtitulo: 'Respuestas',
    items: [{ question: '¿PUEDO SER SCOUT?', answer: 'Sí', image: '' }],
  },
  testimonials: {
    titulo_seccion: 'Lo que dicen',
    widget_url: 'https://widget.taggbox.com/307862',
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
    title: 'Nua Mana',
    description: 'Portal oficial',
  },
  pwa: {
    name: 'Guías y Scouts Nua Mana',
    short_name: 'Nua Mana',
    description: 'Portal oficial',
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
    clr1: '#FFFFFF', clr2: '#1d1d1d', clr3: '#95a5a6', clr4: '#cb3327',
    clr5: '#ffc41d', clr6: '#3eb34b', clr7: '#e9ecef', clr8: '#d4d4d8',
    clr9: '#FFFFFF', clr10: '#cb3327',
    dclr1: '#121212', dclr2: '#b0b0b0', dclr3: '#8a8a8a', dclr4: '#ef4b3a',
    dclr5: '#ffcf33', dclr6: '#33a345', dclr7: '#3c3c3c', dclr8: '#2a2a2a',
    dclr9: '#121212', dclr10: '#ef4b3a',
    tclr1: '#FFFFFF', tclr2: '#f8f9fa', tclr3: '#2c3e50', tclr4: '#cb3327', tclr5: '#2c3e50', tclr6: '#333333',
    tdclr1: '#1e1e1e', tdclr2: '#26262b', tdclr3: '#d0d0d0', tdclr4: '#ef4b3a', tdclr5: '#33506f', tdclr6: '#b0b0b0',
    hclr1: '#cb3327', hclr2: '#ffc41d', hclr3: '#95a5a6', hclr4: '#cb3327', hclr5: '#1d1d1d', hclr6: '#f8f9fa',
    hclr7: '#cb3327', hclr8: '#333333', hclr9: '#2c3e50', hclr10: '#cb3327',
    hclr11: '#2c3e50', hclr12: '#cb3327',
    hdclr1: '#FFFFFF', hdclr2: '#ffcf33', hdclr3: '#8a8a8a', hdclr4: '#ef4b3a', hdclr5: '#ffcf33', hdclr6: '#26262b',
    hdclr7: '#ffcf33', hdclr8: '#b0b0b0', hdclr9: '#33506f', hdclr10: '#ef4b3a',
    hdclr11: '#33506f', hdclr12: '#ef4b3a',
    mclr1: '#FFFFFF', mclr2: '#95a5a6', mclr3: '#2c3e50', mclr4: '#cb3327', mclr5: '#cb3327', mclr6: '#cb3327',
    mclr7: '#1d1d1d', mclr8: '#cb3327', mclr9: '#1d1d1d',
    mdclr1: '#33506f', mdclr2: '#ef4b3a', mdclr3: '#b0b0b0', mdclr4: '#ef4b3a', mdclr5: '#ef4b3a', mdclr6: '#ef4b3a',
    mdclr7: '#b0b0b0', mdclr8: '#ef4b3a', mdclr9: '#ffcf33',
    // Opacities (todas 100)
    clr1_opacity: 100, clr2_opacity: 100, clr3_opacity: 100, clr4_opacity: 100,
    clr5_opacity: 100, clr6_opacity: 100, clr7_opacity: 100, clr8_opacity: 100,
    clr9_opacity: 100, clr10_opacity: 100,
    dclr1_opacity: 100, dclr2_opacity: 100, dclr3_opacity: 100, dclr4_opacity: 100,
    dclr5_opacity: 100, dclr6_opacity: 100, dclr7_opacity: 100, dclr8_opacity: 100,
    dclr9_opacity: 100, dclr10_opacity: 100,
    tclr1_opacity: 100, tclr2_opacity: 100, tclr3_opacity: 100, tclr4_opacity: 100, tclr5_opacity: 100, tclr6_opacity: 100,
    tdclr1_opacity: 100, tdclr2_opacity: 100, tdclr3_opacity: 100, tdclr4_opacity: 100, tdclr5_opacity: 100, tdclr6_opacity: 100,
    hclr1_opacity: 100, hclr2_opacity: 100, hclr3_opacity: 100, hclr4_opacity: 100, hclr5_opacity: 100, hclr6_opacity: 100,
    hclr7_opacity: 100, hclr8_opacity: 100, hclr9_opacity: 100, hclr10_opacity: 100,
    hclr11_opacity: 100, hclr12_opacity: 100,
    hdclr1_opacity: 100, hdclr2_opacity: 100, hdclr3_opacity: 100, hdclr4_opacity: 100, hdclr5_opacity: 100, hdclr6_opacity: 100,
    hdclr7_opacity: 100, hdclr8_opacity: 100, hdclr9_opacity: 100, hdclr10_opacity: 100,
    hdclr11_opacity: 100, hdclr12_opacity: 100,
    mclr1_opacity: 100, mclr2_opacity: 100, mclr3_opacity: 100, mclr4_opacity: 100, mclr5_opacity: 100, mclr6_opacity: 100,
    mclr7_opacity: 100, mclr8_opacity: 100, mclr9_opacity: 100,
    mdclr1_opacity: 100, mdclr2_opacity: 100, mdclr3_opacity: 100, mdclr4_opacity: 100, mdclr5_opacity: 100, mdclr6_opacity: 100,
    mdclr7_opacity: 100, mdclr8_opacity: 100, mdclr9_opacity: 100,
  },
  header_colors: {} as any,
  menu_colors: {} as any,
  promo_colors: {},
  slideshow_colors: {},
  testimonials_colors: {},
  visit_colors: {},
  faq_colors: {},
  secondary_header_colors: {},
  footer_colors: {},
  panel_colors: {},
  section_visibility: {
    hero: true,
    features: true,
    promo: true,
    slideshow: true,
    testimonials: true,
    visit: true,
    faq: true,
  },
  social_list: { items: [] },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function zone(id: string): AdminZone {
  const z = ADMIN_ZONES.find((z) => z.id === id);
  if (!z) throw new Error(`zone ${id} missing from ADMIN_ZONES`);
  return z;
}

function cardOf(heading: string): HTMLElement {
  const headingEl = screen.getByRole('heading', { name: heading });
  const card = headingEl.closest('form');
  if (!card) throw new Error(`no form card found for heading "${heading}"`);
  return card as HTMLElement;
}

beforeEach(() => {
  saveSiteConfigMock.mockClear();
  toastMocks.success.mockClear();
  toastMocks.error.mockClear();
  supabaseMocks.setSession({ access_token: 'token-123' });
});

// ---------------------------------------------------------------------------
// Rendering — sections per zone from ADMIN_ZONES metadata
// ---------------------------------------------------------------------------

describe('ZoneConfigForm rendering', () => {
  it('renders one card per section of the Inicio zone with its field labels and a Guardar button each', () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('inicio')} />);

    // Inicio keeps its metadata order: Hero → Colores del Hero → Features → Colores de Features → Colores del Promo → Colores del Slideshow → Testimonios → Colores de Testimonios → Visítanos → Colores de Visítanos → Dirección y Mapa → FAQ → Colores de FAQ
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Hero',
      'Colores del Hero',
      'Features',
      'Colores de Features',
      'Colores del Promo',
      'Colores del Slideshow',
      'Testimonios',
      'Colores de Testimonios',
      'Visítanos',
      'Colores de Visítanos',
      'Dirección y Mapa',
      'FAQ',
      'Colores de FAQ',
    ]);

    // Field labels land inside their own section card
    expect(within(cardOf('Hero')).getByLabelText('Frases (una por línea)')).toBeInTheDocument();
    expect(within(cardOf('Hero')).getByLabelText('Intervalo (ms)')).toBeInTheDocument();
    expect(within(cardOf('Features')).getByLabelText('Título de Sección')).toBeInTheDocument();
    expect(within(cardOf('Testimonios')).getByLabelText('Widget URL')).toBeInTheDocument();
    expect(within(cardOf('Visítanos')).getByLabelText('Texto CTA')).toBeInTheDocument();
    expect(within(cardOf('Dirección y Mapa')).getByLabelText('Dirección (HTML permitido)')).toBeInTheDocument();
    expect(within(cardOf('Dirección y Mapa')).getByLabelText('Maps Embed URL')).toBeInTheDocument();
    expect(within(cardOf('FAQ')).getByLabelText('Items (JSON array)')).toBeInTheDocument();

    // One Guardar per card — 13 cards
    expect(screen.getAllByRole('button', { name: 'Guardar' })).toHaveLength(13);
  });

  it('drives the rendered sections from the zone prop — footer renders 3 cards, global 4 (not hardcoded)', () => {
    const { unmount } = render(<ZoneConfigForm config={CONFIG} zone={zone('footer')} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Marca',
      'Contacto',
      'Colores del Footer',
    ]);
    expect(screen.getAllByRole('button', { name: 'Guardar' })).toHaveLength(3);

    unmount();
    render(<ZoneConfigForm config={CONFIG} zone={zone('global')} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'SEO',
      'PWA',
      'Colores del Tema',
      'Colores del Panel',
    ]);
    expect(screen.getAllByRole('button', { name: 'Guardar' })).toHaveLength(4);
  });

  it('renders no cards for the tab-only Menú zone (companion to the non-empty cases above)', () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('menu')} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /guardar/i })).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Submit behavior — per-card Guardar → saveSiteConfig(schemaId, data, token)
// ---------------------------------------------------------------------------

describe('ZoneConfigForm submit', () => {
  it('submits ONLY the edited field of a split card with {schemaId, data} (Header→Marca partial save)', async () => {
    const user = userEvent.setup();
    render(<ZoneConfigForm config={CONFIG} zone={zone('header')} />);

    const marca = cardOf('Marca');
    const pretitulo = within(marca).getByLabelText('Pretitulo');
    await user.clear(pretitulo);
    await user.type(pretitulo, 'Nuevo pretitulo');
    await user.click(within(marca).getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(saveSiteConfigMock).toHaveBeenCalledTimes(1));
    expect(saveSiteConfigMock).toHaveBeenCalledWith(
      'branding.header',
      { pretitulo: 'Nuevo pretitulo' },
      'token-123',
    );
    // logo_header / slogan must NOT be part of a partial save payload
    const payload = saveSiteConfigMock.mock.calls[0][1] as Record<string, unknown>;
    expect(payload).not.toHaveProperty('logo_header');
    expect(payload).not.toHaveProperty('slogan');
  });

  it('serializes JSON array fields to arrays and number fields to numbers before submitting (Inicio→Hero)', async () => {
    const user = userEvent.setup();
    render(<ZoneConfigForm config={CONFIG} zone={zone('inicio')} />);

    const hero = cardOf('Hero');
    const frases = within(hero).getByLabelText('Frases (una por línea)');
    // fireEvent.change: JSON contains [ and " which userEvent.type would parse
    // as keyboard descriptors, and jsdom lacks clipboardData for user.paste
    fireEvent.change(frases, { target: { value: '["Una frase","Otra frase"]' } });

    const intervalo = within(hero).getByLabelText('Intervalo (ms)');
    await user.clear(intervalo);
    await user.type(intervalo, '7500');

    await user.click(within(hero).getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(saveSiteConfigMock).toHaveBeenCalledTimes(1));
    const [schemaId, payload, token] = saveSiteConfigMock.mock.calls[0] as [
      string,
      Record<string, unknown>,
      string,
    ];
    expect(schemaId).toBe('hero');
    expect(token).toBe('token-123');
    expect(payload).toMatchObject({ frases: ['Una frase', 'Otra frase'], intervalo: 7500 });
    expect(Array.isArray(payload.frases)).toBe(true);
    expect(typeof payload.intervalo).toBe('number');
  });

  it('shows an expired-session error and never calls the action when there is no session', async () => {
    const user = userEvent.setup();
    supabaseMocks.setSession(null);
    render(<ZoneConfigForm config={CONFIG} zone={zone('header')} />);

    await user.click(within(cardOf('Marca')).getByRole('button', { name: 'Guardar' }));

    expect(saveSiteConfigMock).not.toHaveBeenCalled();
    expect(toastMocks.error).toHaveBeenCalledWith(expect.stringContaining('Sesión'));
  });
});
