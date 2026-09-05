import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
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
import { DEFAULT_SITE_CONFIG } from '@/lib/site-config';

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
  seo: { title: 'Nua Mana', description: 'Portal oficial' },
  pwa: {
    name: 'Guías y Scouts Nua Mana',
    short_name: 'Nua Mana',
    description: 'Portal oficial',
    lang: 'es',
    icon_192: '/icon-192x192.png',
    icon_512: '/icon-512x512.png',
    icon_1024: '/icon-1024x1024.png',
  },
  navigation: { label_panel: 'Mi Panel', label_login: 'Acceder' },
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
    hclr7: '#cb3327', hclr8: '#333333', hclr9: '#cb3327', hclr10: '#2c3e50',
    hclr11: '#cb3327', hclr12: '#2c3e50', hclr13: '#cb3327',
    hdclr1: '#FFFFFF', hdclr2: '#ffcf33', hdclr3: '#8a8a8a', hdclr4: '#ef4b3a', hdclr5: '#ffcf33', hdclr6: '#26262b',
    hdclr7: '#ffcf33', hdclr8: '#b0b0b0', hdclr9: '#ef4b3a', hdclr10: '#33506f',
    hdclr11: '#ef4b3a', hdclr12: '#33506f', hdclr13: '#ef4b3a',
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
    hclr11_opacity: 100, hclr12_opacity: 100, hclr13_opacity: 100,
    hdclr1_opacity: 100, hdclr2_opacity: 100, hdclr3_opacity: 100, hdclr4_opacity: 100, hdclr5_opacity: 100, hdclr6_opacity: 100,
    hdclr7_opacity: 100, hdclr8_opacity: 100, hdclr9_opacity: 100, hdclr10_opacity: 100,
    hdclr11_opacity: 100, hdclr12_opacity: 100, hdclr13_opacity: 100,
    mclr1_opacity: 100, mclr2_opacity: 100, mclr3_opacity: 100, mclr4_opacity: 100, mclr5_opacity: 100, mclr6_opacity: 100,
    mclr7_opacity: 100, mclr8_opacity: 100, mclr9_opacity: 100,
    mdclr1_opacity: 100, mdclr2_opacity: 100, mdclr3_opacity: 100, mdclr4_opacity: 100, mdclr5_opacity: 100, mdclr6_opacity: 100,
    mdclr7_opacity: 100, mdclr8_opacity: 100, mdclr9_opacity: 100,
  },
  header_colors: DEFAULT_SITE_CONFIG.header_colors,
  menu_colors: DEFAULT_SITE_CONFIG.menu_colors,
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
// Grid layout (R5): colores-tema renders as a 5-column × 17-row table
// (16 roles + 1 heading row), every other section keeps the default card
// stack.
// ---------------------------------------------------------------------------

describe('ZoneConfigForm grid layout', () => {
  it('renders the colores-tema section as a table with a 5-column header and 17 rows (16 roles + 1 heading)', () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('global')} />);

    // The Global zone has 3 cards; colores-tema is the grid one.
    const colores = screen.getByRole('heading', { name: 'Colores del Tema' }).closest('form');
    expect(colores, 'colores-tema card must exist').not.toBeNull();
    if (!colores) throw new Error('expected colores-tema card');

    const table = within(colores as HTMLElement).getByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers.map((h) => h.textContent)).toEqual(['Nombre', 'Claro', 'Transp. Claro', 'Oscuro', 'Transp. Oscuro']);

    // 17 rows (16 roles + 1 heading row) + 1 header row
    expect(within(table).getAllByRole('row')).toHaveLength(18);
    const bodyRows = within(table).getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(17);
  });

  it('renders role labels and 4 inputs per row (2 color + 2 number)', () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('global')} />);

    const colores = screen.getByRole('heading', { name: 'Colores del Tema' }).closest('form');
    if (!colores) throw new Error('expected colores-tema card');
    const table = within(colores as HTMLElement).getByRole('table');
    const bodyRows = within(table).getAllByRole('row').slice(1);

    // First row: role label + inputs bound to clr1 / clr1_opacity / dclr1 / dclr1_opacity
    const roleRows = bodyRows.filter((row) => within(row).getAllByRole('cell').length === 5);
    expect(roleRows).toHaveLength(16);
    const firstRow = roleRows[0];
    expect(within(firstRow).getAllByRole('cell')).toHaveLength(5);
    expect(within(firstRow).getAllByRole('cell')[0]).toHaveTextContent('Fondo');
    const firstRowInputs = within(firstRow).getAllByRole('textbox');
    expect(firstRowInputs.length).toBeGreaterThanOrEqual(2); // hex text companion inputs
    expect(within(firstRow).getAllByRole('spinbutton')).toHaveLength(2); // number inputs

    // Last row: Texto (tclr6 / tdclr6)
    const lastRow = roleRows[15];
    expect(within(lastRow).getAllByRole('cell')[0]).toHaveTextContent('Texto');
    expect(within(lastRow).getAllByRole('spinbutton')).toHaveLength(2);

    // Role label set — the 16 semantic role labels from admin-zones.ts
    // (10 Base + 6 Tarjetas).
    const roleLabels = roleRows.map((row) => within(row).getAllByRole('cell')[0].textContent);
    expect(roleLabels).toEqual([
      // Base (10)
      'Fondo',
      'Texto Principal',
      'Texto Secundario',
      'Énfasis Principal',
      'Énfasis Secundario',
      'Énfasis Terciario',
      'Bordes Principal',
      'Bordes Secundario',
      'Fondo Scrollbar',
      'Scrollbar',
      // Tarjetas (6)
      'Fondo Inicial',
      'Fondo Final',
      'Énfasis',
      'Categoría',
      'Enlaces',
      'Texto',
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

  it('regression: empty opacity fields submit as number 100 (no expected-number error)', async () => {
    render(<ZoneConfigForm config={CONFIG} zone={zone('header')} />);

    const colores = screen.getByRole('heading', { name: 'Colores del Header' }).closest('form');
    if (!colores) throw new Error('expected header-colors card');

    // Clear the light opacity input (Fondo row)
    const opacityInput = within(colores as HTMLElement).getByLabelText('Transparencia Botón Menú');
    fireEvent.change(opacityInput, { target: { value: '' } });

    // Submit the grid card
    const saveButton = within(colores as HTMLElement).getByRole('button', { name: /guardar/i });
    fireEvent.click(saveButton);

    await waitFor(() => expect(saveSiteConfigMock).toHaveBeenCalled());

    const [, payload] = saveSiteConfigMock.mock.calls[0];
    const opacity = (payload as Record<string, unknown>).hclr1_opacity;
    expect(opacity).toBe(100);
    expect(typeof opacity).toBe('number');
  });
});
