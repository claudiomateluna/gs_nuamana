import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ADMIN_ZONES } from '@/lib/admin-zones';
import type { AdminZone } from '@/lib/admin-zones';
import type { SiteConfigRecord } from '@/lib/site-config.types';

// ---------------------------------------------------------------------------
// Mocks — same pattern as zone-config-form.test.tsx (chainable supabase,
// save-site-config server action, sonner toasts).
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

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// ---------------------------------------------------------------------------
// Imports — component under test + fixtures
// ---------------------------------------------------------------------------

import ZoneConfigForm from '@/components/admin/ZoneConfigForm';

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
  seo: { title: 'Nua Mana', description: 'Portal oficial', theme_color: '#cb3327' },
  pwa: {
    name: 'Guías y Scouts Nua Mana',
    short_name: 'Nua Mana',
    description: 'Portal oficial',
    background_color: '#ffffff',
    theme_color: '#cb3327',
    lang: 'es',
    icon_192: '/icon-192x192.png',
    icon_512: '/icon-512x512.png',
    icon_1024: '/icon-1024x1024.png',
  },
  navigation: { label_panel: 'Mi Panel', label_login: 'Acceder' },
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

function zone(id: string): AdminZone {
  const z = ADMIN_ZONES.find((z) => z.id === id);
  if (!z) throw new Error(`zone ${id} missing from ADMIN_ZONES`);
  return z;
}

beforeEach(() => {
  saveSiteConfigMock.mockClear();
  supabaseMocks.setSession({ access_token: 'token-123' });
});

// ---------------------------------------------------------------------------
// Grid layout (R5): colores-tema renders as a 5-column × 12-row table,
// every other section keeps the default card stack.
// ---------------------------------------------------------------------------

describe('ZoneConfigForm grid layout', () => {
  it('renders the colores-tema section as a table with a 5-column header and 12 rows', () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('global')} />);

    // The Global zone has 3 cards; colores-tema is the grid one.
    const colores = screen.getByRole('heading', { name: 'Colores del Tema' }).closest('form');
    expect(colores, 'colores-tema card must exist').not.toBeNull();
    if (!colores) throw new Error('expected colores-tema card');

    const table = within(colores as HTMLElement).getByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent)).toEqual(['Nombre', 'Claro', 'Transp. Claro', 'Oscuro', 'Transp. Oscuro']);

    // 12 rows (one per role) + 1 header row
    expect(within(table).getAllByRole('row')).toHaveLength(13);
    const bodyRows = within(table).getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(12);
  });

  it('renders role labels and 4 inputs per row (2 color + 2 number)', () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('global')} />);

    const colores = screen.getByRole('heading', { name: 'Colores del Tema' }).closest('form');
    if (!colores) throw new Error('expected colores-tema card');
    const table = within(colores as HTMLElement).getByRole('table');
    const bodyRows = within(table).getAllByRole('row').slice(1);

    // First row: role label + inputs bound to clr1 / clr1_opacity / dclr1 / dclr1_opacity
    const firstRow = bodyRows[0];
    expect(within(firstRow).getAllByRole('cell')).toHaveLength(5);
    expect(within(firstRow).getAllByRole('cell')[0]).toHaveTextContent('Color de Fondo');
    const firstRowInputs = within(firstRow).getAllByRole('textbox');
    expect(firstRowInputs.length).toBeGreaterThanOrEqual(2); // hex text companion inputs
    expect(within(firstRow).getAllByRole('spinbutton')).toHaveLength(2); // number inputs

    // Last row: Degradado Término
    const lastRow = bodyRows[11];
    expect(within(lastRow).getAllByRole('cell')[0]).toHaveTextContent('Degradado Término');
    expect(within(lastRow).getAllByRole('spinbutton')).toHaveLength(2);

    // Role label set — the 12 semantic role labels from the spec
    const roleLabels = bodyRows.map((row) => within(row).getAllByRole('cell')[0].textContent);
    expect(roleLabels).toEqual([
      'Color de Fondo',
      'Texto Secundario',
      'Borde 2',
      'Texto Principal',
      'Degradado Inicial',
      'Enlaces (Hover)',
      'Énfasis',
      'Énfasis 2 (Dorado)',
      'Superficie',
      'Bordes',
      'Degradado Intermedio (Opcional)',
      'Degradado Término',
    ]);
  });

  it('keeps non-grid sections (SEO) as the default card stack with no table', () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('global')} />);

    // The SEO section still renders its fields as stacked inputs — no table inside its card
    const seo = screen.getByRole('heading', { name: 'SEO' }).closest('form');
    if (!seo) throw new Error('expected SEO card');
    expect(within(seo as HTMLElement).queryByRole('table')).toBeNull();
    expect(within(seo as HTMLElement).getByLabelText('Title')).toBeInTheDocument();

    // PWA section (non-grid) renders as a stack too
    const pwa = screen.getByRole('heading', { name: 'PWA' }).closest('form');
    if (!pwa) throw new Error('expected PWA card');
    expect(within(pwa as HTMLElement).queryByRole('table')).toBeNull();
  });
});
