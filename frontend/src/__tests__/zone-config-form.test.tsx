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
    clr1: '#FFFFFF',
    clr2: '#95a5a6',
    clr3: '#333333',
    clr4: '#1d1d1d',
    clr5: '#2c3e50',
    clr6: '#3eb34b',
    clr7: '#cb3327',
    clr8: '#ffc41d',
    clr9: '#f8f9fa',
    clr10: '#e9ecef',
    clr11: '#2c3e50',
    clr12: '#cb3327',
    dclr1: '#121212',
    dclr2: '#b0b0b0',
    dclr3: '#1e1e1e',
    dclr4: '#0a0a0a',
    dclr5: '#33506f',
    dclr6: '#33a345',
    dclr7: '#ef4b3a',
    dclr8: '#ffcf33',
    dclr9: '#26262b',
    dclr10: '#3c3c3c',
    dclr11: '#33506f',
    dclr12: '#ef4b3a',
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
    clr11_opacity: 100,
    clr12_opacity: 100,
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
    dclr11_opacity: 100,
    dclr12_opacity: 100,
  },
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

    // Inicio keeps its metadata order: Hero → Features → Testimonios → Visítanos → Dirección y Mapa → FAQ
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Hero',
      'Features',
      'Testimonios',
      'Visítanos',
      'Dirección y Mapa',
      'FAQ',
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

    // One Guardar per card — 6 cards
    expect(screen.getAllByRole('button', { name: 'Guardar' })).toHaveLength(6);
  });

  it('drives the rendered sections from the zone prop — footer renders 3 cards, global 3 (not hardcoded)', () => {
    const { unmount } = render(<ZoneConfigForm config={CONFIG} zone={zone('footer')} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Marca',
      'Redes',
      'Contacto',
    ]);
    expect(screen.getAllByRole('button', { name: 'Guardar' })).toHaveLength(3);

    unmount();
    render(<ZoneConfigForm config={CONFIG} zone={zone('global')} />);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'SEO',
      'PWA',
      'Colores del Tema',
    ]);
    expect(screen.getAllByRole('button', { name: 'Guardar' })).toHaveLength(3);
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

  it('Footer→Redes submits when the seed mailto: email is present (whole-card validation accepts it)', async () => {
    const user = userEvent.setup();
    render(<ZoneConfigForm config={CONFIG} zone={zone('footer')} />);

    // The card's default email is the seed format "mailto:contacto@nuamana.cl".
    // Editing ANY field of the card triggers whole-card validation; the mailto:
    // value must pass (previously it failed with "Email inválido" and
    // saveSiteConfig was never called).
    const redes = cardOf('Redes');
    const youtube = within(redes).getByLabelText('YouTube URL');
    await user.clear(youtube);
    await user.type(youtube, 'https://youtube.com/@nuevocanal');

    await user.click(within(redes).getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(saveSiteConfigMock).toHaveBeenCalledTimes(1));
    const [schemaId, payload, token] = saveSiteConfigMock.mock.calls[0] as [
      string,
      Record<string, unknown>,
      string,
    ];
    expect(schemaId).toBe('social.footer');
    expect(token).toBe('token-123');
    // Only the edited field is submitted (partial card), after the mailto:
    // email passed validation.
    expect(payload).toEqual({ youtube: 'https://youtube.com/@nuevocanal' });
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
