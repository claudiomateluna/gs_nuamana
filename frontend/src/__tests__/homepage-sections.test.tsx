import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SiteConfigProvider } from '@/contexts/site-config-context';
import type { SiteConfigRecord } from '@/lib/site-config.types';

// ---------------------------------------------------------------------------
// Mocks — Header pulls in ui/menu (supabase + matchMedia + useRouter) and
// ThemeProvider deps; next/link renders as a plain <a> in jsdom. DEFAULT_SITE_CONFIG
// is imported from '@/lib/site-config' (server module) so next/cache and
// @supabase/supabase-js are stubbed first (pattern from site-config.test.ts).
// ---------------------------------------------------------------------------

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children?: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
}));

vi.mock('@/contexts/theme-context', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn(), setTheme: vi.fn() }),
}));

const supabaseMock = vi.hoisted(() => {
  const getSession = vi.fn(
    async (): Promise<{ data: { session: null }; error: null }> => ({
      data: { session: null },
      error: null,
    }),
  );
  const onAuthStateChange = vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  }));
  // Chainable query for the unit-slideshow unidades fetch: no rows so the
  // hardcoded fallback units stay rendered in these tests.
  const from = vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(async () => ({ data: [], error: null })),
    })),
  }));
  return { supabase: { auth: { getSession, onAuthStateChange }, from } };
});
vi.mock('@/lib/supabase', () => ({ supabase: supabaseMock.supabase }));

vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => Promise<unknown>) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }));

// ---------------------------------------------------------------------------
// Imports — components under test + the canonical defaults oracle
// ---------------------------------------------------------------------------

import Hero from '@/components/hero';
import FeaturesSection from '@/components/features-section';
import FAQ from '@/components/faq';
import Testimonials from '@/components/testimonials';
import VisitSection from '@/components/visit-section';
import Header from '@/components/Header';
import NuaManaFooter from '@/components/footer';
import { DEFAULT_SITE_CONFIG } from '@/lib/site-config';

// jsdom lacks matchMedia — ui/menu (rendered by Header) calls it on mount even
// when the drawer is closed.
beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Fixture — full SiteConfigRecord with DISTINCT saved values (each value can
// only come from the provider, never from a hardcoded fallback).
// ---------------------------------------------------------------------------

const SAVED: SiteConfigRecord = {
  branding: {
    nombre_grupo: 'Grupo Guardián Test',
    nombre_corto: 'TestMana',
    pretitulo: 'Scouts Test',
    slogan: 'test aventura',
    mision: 'mision test',
    motto: 'motto test',
    logo_header: '/logos/test-header.png',
    logo_footer: '/logos/test-footer.png',
    copyright: 'Copyright Test',
  },
  social: {
    instagram: 'https://instagram.com/test',
    facebook: 'https://facebook.com/test',
    youtube: 'https://youtube.com/test',
    tiktok: 'https://tiktok.com/test',
    google: 'https://google.com/test',
    whatsapp: 'https://wa.me/56900000000',
    email: 'mailto:test@nuamana.cl',
  },
  contact: {
    sede_nombre: 'Sede Test',
    direccion: 'Calle Test 123<br/>Comuna Test',
    maps_embed: 'https://maps.example/embed',
  },
  hero: {
    frases: ['FRASE TEST,Subtitulo Test'],
    fondo: '/images/inicio/fondo-test.webp',
    // Large interval — the slider must not rotate during the test.
    intervalo: 60000,
    imagenes_pool: ['/images/fotos/fotos_01_test_.webp', '/images/fotos/fotos_02_test_.webp'],
    top_count: 1,
    bottom_count: 1,
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
  },
  features: {
    titulo_seccion: 'Sección Test',
    subtitulo: 'Subtítulo Test',
    items: [
      {
        title: 'TITULO TEST',
        description: 'Descripción Test',
        image: '/img-test.jpg',
        link: '/test',
      },
    ],
  },
  faq: {
    titulo_seccion: 'FAQ Test',
    subtitulo: 'FAQ Subtítulo Test',
    items: [
      { question: 'PREGUNTA UNO', answer: 'Respuesta con <b>negrita</b> uno', image: '/faq-1.png' },
      { question: 'PREGUNTA DOS', answer: 'Respuesta dos', image: '/faq-2.png' },
      { question: 'PREGUNTA TRES', answer: 'Respuesta tres', image: '/faq-3.png' },
      { question: 'PREGUNTA CUATRO', answer: 'Respuesta cuatro', image: '/faq-4.png' },
      { question: 'PREGUNTA CINCO', answer: 'Respuesta cinco', image: '/faq-5.png' },
    ],
  },
  testimonials: {
    titulo_seccion: 'Testimonios Test',
    widget_url: 'https://widget.test/123',
  },
  visit: {
    titulo: 'Visita Test',
    fecha_fundacion: '2005-09-23',
    email: 'visita@test.cl',
    email_href: 'mailto:visita@test.cl',
    horario: 'Domingos 9 AM',
    cta_texto: 'CTA TEST',
    imagen: '/images/inicio/img-test.png',
  },
  seo: { title: 'Título Test', description: 'Descripción Test' },
  pwa: {
    name: 'PWA Test',
    short_name: 'PWAT',
    description: 'Descripción Test',
    lang: 'es',
    icon_192: '/icon-192.png',
    icon_512: '/icon-512.png',
    icon_1024: '/icon-1024.png',
  },
  navigation: { label_panel: 'Panel Test', label_login: 'Login Test' },
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
    mclr7: '#1d1d1d', mclr8: '#cb3327', mclr9: '#1d1d1d', mclr10: '#e9ecef', mclr11: '#cb3327',
    mdclr1: '#33506f', mdclr2: '#ef4b3a', mdclr3: '#b0b0b0', mdclr4: '#ef4b3a', mdclr5: '#ef4b3a', mdclr6: '#ef4b3a',
    mdclr7: '#b0b0b0', mdclr8: '#ef4b3a', mdclr9: '#ffcf33', mdclr10: '#3c3c3c', mdclr11: '#ef4b3a',
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
    mclr7_opacity: 100, mclr8_opacity: 100, mclr9_opacity: 100, mclr10_opacity: 100, mclr11_opacity: 100,
    mdclr1_opacity: 100, mdclr2_opacity: 100, mdclr3_opacity: 100, mdclr4_opacity: 100, mdclr5_opacity: 100, mdclr6_opacity: 100,
    mdclr7_opacity: 100, mdclr8_opacity: 100, mdclr9_opacity: 100, mdclr10_opacity: 100, mdclr11_opacity: 100,
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
      { icon: 'instagram', label: 'Instagram', url: 'https://instagram.com/test', enabled: true, order: 1, placement: 'header,menu,footer' },
      { icon: 'facebook', label: 'Facebook', url: 'https://facebook.com/test', enabled: true, order: 2, placement: 'header,menu,footer' },
      { icon: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/56900000000', enabled: true, order: 3, placement: 'header,menu,footer' },
      { icon: 'youtube', label: 'YouTube', url: 'https://youtube.com/test', enabled: true, order: 4, placement: 'menu,footer' },
      { icon: 'tiktok', label: 'TikTok', url: 'https://tiktok.com/test', enabled: true, order: 5, placement: 'menu,footer' },
      { icon: 'google', label: 'Google', url: 'https://google.com/test', enabled: true, order: 6, placement: 'menu,footer' },
      { icon: 'email', label: 'Email', url: 'mailto:test@nuamana.cl', enabled: true, order: 7, placement: 'footer' },
    ],
  },
};

function renderInProvider(ui: ReactNode, config: SiteConfigRecord = SAVED) {
  return render(<SiteConfigProvider config={config}>{ui}</SiteConfigProvider>);
}

// ---------------------------------------------------------------------------
// Header — branding / social / navigation from the provider
// ---------------------------------------------------------------------------

describe('Header consumes useSiteConfig', () => {
  it('renders saved branding, social links and navigation labels inside the provider', () => {
    const { container } = renderInProvider(<Header />);

    // Branding
    expect(screen.getByAltText('Logo')).toHaveAttribute('src', SAVED.branding.logo_header);
    expect(screen.getByText(SAVED.branding.pretitulo)).toBeInTheDocument();
    expect(screen.getByText(SAVED.branding.nombre_corto)).toBeInTheDocument();
    expect(screen.getByText(SAVED.branding.slogan)).toBeInTheDocument();

    // Social (desktop block) — first 3 from social_list (header limit=3)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain(SAVED.social_list.items[0].url); // instagram
    expect(hrefs).toContain(SAVED.social_list.items[1].url); // facebook
    expect(hrefs).toContain(SAVED.social_list.items[2].url); // whatsapp
    expect(hrefs).not.toContain('https://instagram.com/gruponuamana/');

    // Navigation labels (no session → login label)
    expect(screen.getByText(SAVED.navigation.label_login)).toBeInTheDocument();
  });

  it('falls back to DEFAULT_SITE_CONFIG when rendered outside the provider', () => {
    render(<Header />);

    expect(screen.getByText(DEFAULT_SITE_CONFIG.branding.pretitulo)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_SITE_CONFIG.branding.nombre_corto)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_SITE_CONFIG.navigation.label_login)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Footer — branding / social / contact from the provider
// ---------------------------------------------------------------------------

describe('Footer consumes useSiteConfig', () => {
  it('renders saved branding, social links and contact info inside the provider', () => {
    const { container } = renderInProvider(<NuaManaFooter />);

    // Branding
    expect(screen.getByAltText('Logo Nua Mana')).toHaveAttribute('src', SAVED.branding.logo_footer);
    expect(screen.getByText(SAVED.branding.nombre_grupo)).toBeInTheDocument();
    expect(screen.getByText(SAVED.branding.slogan)).toBeInTheDocument();
    expect(screen.getByText(SAVED.branding.mision)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(SAVED.branding.copyright))).toBeInTheDocument();
    expect(screen.getByText(SAVED.branding.motto)).toBeInTheDocument();

    // 7 social links from the config (footer has no limit)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    for (const item of SAVED.social_list.items) {
      expect(hrefs).toContain(item.url);
    }

    // Contact
    expect(screen.getByText(SAVED.contact.sede_nombre)).toBeInTheDocument();
    expect(screen.getByText('Calle Test 123')).toBeInTheDocument();
    expect(screen.getByText('Comuna Test')).toBeInTheDocument();
    expect(container.querySelector('iframe')).toHaveAttribute('src', SAVED.contact.maps_embed);
  });
});

// ---------------------------------------------------------------------------
// Hero — frases / fondo / imagenes_pool / top_count / bottom_count / intervalo
// ---------------------------------------------------------------------------

describe('Hero consumes useSiteConfig', () => {
  it('renders saved phrases, fondo and image pool after client init', async () => {
    const { container } = renderInProvider(<Hero />);

    // isClient-gated: phrase from the saved frases (split on comma)
    expect(await screen.findByText('FRASE TEST')).toBeInTheDocument();
    expect(screen.getByText('Subtitulo Test')).toBeInTheDocument();

    // Fondo background image
    const bg = container.querySelector<HTMLElement>('[style*="background-image"]');
    expect(bg?.style.backgroundImage).toContain(SAVED.hero.fondo);

    // 1 top + 1 bottom image from the saved imagenes_pool (order is shuffled)
    await waitFor(() => expect(container.querySelectorAll('img')).toHaveLength(2));
    const srcs = Array.from(container.querySelectorAll('img'))
      .map((img) => img.getAttribute('src'))
      .sort();
    expect(srcs).toEqual([...SAVED.hero.imagenes_pool].sort());
  });
});

// ---------------------------------------------------------------------------
// Features — titulo_seccion / subtitulo / items
// ---------------------------------------------------------------------------

describe('FeaturesSection consumes useSiteConfig', () => {
  it('renders saved section title, subtitle and item cards', () => {
    const { container } = renderInProvider(<FeaturesSection />);

    expect(screen.getByText(SAVED.features.titulo_seccion)).toBeInTheDocument();
    expect(screen.getByText(SAVED.features.subtitulo)).toBeInTheDocument();
    expect(screen.getByText(SAVED.features.items[0].title)).toBeInTheDocument();
    expect(screen.getByText(SAVED.features.items[0].description)).toBeInTheDocument();

    // Item card links to the saved link
    expect(container.querySelector('a[href="/test"]')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// FAQ — titulo_seccion / subtitulo / items (exact count) + DOMPurify kept
// ---------------------------------------------------------------------------

describe('FAQ consumes useSiteConfig', () => {
  it('renders exactly 5 saved items and sanitizes the HTML answer on open', () => {
    renderInProvider(<FAQ />);

    expect(screen.getByText(SAVED.faq.titulo_seccion)).toBeInTheDocument();
    expect(screen.getByText(SAVED.faq.subtitulo)).toBeInTheDocument();

    // Exactly 5 items render when 5 are saved
    const questions = screen.getAllByRole('heading', { level: 3 });
    expect(questions).toHaveLength(5);

    // Open the first item — sanitized HTML answer renders
    fireEvent.click(screen.getByRole('button', { name: 'PREGUNTA UNO' }));
    expect(screen.getByText(/Respuesta con/)).toBeInTheDocument();
    expect(screen.getByText(/negrita/)).toBeInTheDocument();
  });

  it('renders DEFAULT_SITE_CONFIG items when rendered outside the provider', () => {
    render(<FAQ />);

    expect(screen.getByText(DEFAULT_SITE_CONFIG.faq.titulo_seccion)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
      DEFAULT_SITE_CONFIG.faq.items.length,
    );
  });
});

// ---------------------------------------------------------------------------
// Testimonials — titulo_seccion / widget_url
// ---------------------------------------------------------------------------

describe('Testimonials consumes useSiteConfig', () => {
  it('renders the saved section title from the provider', async () => {
    // The component fetches /api/google-reviews on mount (no iframe is rendered
    // since the Google Reviews refactor). Stub fetch so the mount effect
    // resolves cleanly and the config-driven title is the assertion target.
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          rating: 5,
          userRatingsTotal: 10,
          reviews: [
            { authorName: 'Ana', profilePhoto: '', rating: 5, text: 'Genial', relativeTime: 'hace 2 semanas' },
          ],
        }),
      } as Response);

    renderInProvider(<Testimonials />);

    expect(await screen.findByText(SAVED.testimonials.titulo_seccion)).toBeInTheDocument();

    fetchSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// VisitSection — titulo / fecha / email / horario / cta / imagen
// ---------------------------------------------------------------------------

describe('VisitSection consumes useSiteConfig', () => {
  it('renders saved values after client init', async () => {
    const { container } = renderInProvider(<VisitSection />);

    expect(await screen.findByText(SAVED.visit.titulo)).toBeInTheDocument();
    expect(screen.getByText(SAVED.visit.horario)).toBeInTheDocument();
    expect(screen.getByText(SAVED.visit.cta_texto)).toBeInTheDocument();
    expect(screen.getByText(SAVED.visit.email)).toBeInTheDocument();

    // mailto link uses the saved email_href
    expect(container.querySelector('a[href="mailto:visita@test.cl"]')).toBeInTheDocument();

    // Visit circle background image
    const circle = container.querySelector<HTMLElement>('[style*="background-image"]');
    expect(circle?.style.backgroundImage).toContain(SAVED.visit.imagen);
  });

  it('falls back to DEFAULT_SITE_CONFIG when a saved key is absent', async () => {
    const partial: SiteConfigRecord = {
      ...SAVED,
      visit: { ...SAVED.visit, cta_texto: undefined as unknown as string },
    };

    renderInProvider(<VisitSection />, partial);

    expect(await screen.findByText(DEFAULT_SITE_CONFIG.visit.cta_texto)).toBeInTheDocument();
  });

  // R1-S1 — saved contact values render instead of the hardcoded address/iframe
  it('renders the saved contact.direccion lines and maps_embed iframe from the provider', async () => {
    const { container } = renderInProvider(<VisitSection />);

    // isClient-gated — address appears only after client init
    expect(await screen.findByText('Calle Test 123')).toBeInTheDocument();
    expect(screen.getByText('Comuna Test')).toBeInTheDocument();

    // The hardcoded address must not render anywhere
    expect(container.textContent).not.toContain('San José de la Estrella');

    // The iframe src comes from the saved maps_embed, not the hardcoded embed URL
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveAttribute('src', SAVED.contact.maps_embed);
    expect(iframe?.getAttribute('src') ?? '').not.toContain('4v1763411447730');
  });

  // R1-S2 — per-field fallback outside the provider renders the DEFAULT literals
  it('falls back to DEFAULT contact.direccion/maps_embed when rendered outside the provider', async () => {
    const { container } = render(<VisitSection />);

    const expectedLines = DEFAULT_SITE_CONFIG.contact.direccion.split(/<br\s*\/?>/i);
    for (const line of expectedLines) {
      expect(await screen.findByText(line)).toBeInTheDocument();
    }

    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveAttribute('src', DEFAULT_SITE_CONFIG.contact.maps_embed);
  });

  // R1-S3 — XSS-safe: a <script> payload inside direccion renders as TEXT
  it('renders a <script> inside direccion as plain text (XSS-safe)', async () => {
    const xssConfig: SiteConfigRecord = {
      ...SAVED,
      contact: {
        ...SAVED.contact,
        direccion: 'OK<br/><script>alert(1)</script>',
      },
    };
    const { container } = renderInProvider(<VisitSection />, xssConfig);

    expect(await screen.findByText('OK')).toBeInTheDocument();

    // The script payload is TEXT content — no DOM script element is created
    expect(container.textContent).toContain('<script>alert(1)</script>');
    expect(container.querySelector('script')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// R2-S1 — same-source regression: footer + VisitSection render identical values
// ---------------------------------------------------------------------------

describe('Address & map single source (footer + VisitSection)', () => {
  it('renders the same config-driven address lines and iframe src in one provider', async () => {
    const { container } = renderInProvider(
      <>
        <NuaManaFooter />
        <VisitSection />
      </>,
    );

    // Footer renders immediately; VisitSection is isClient-gated — wait for both
    const addressMatches = await screen.findAllByText('Calle Test 123');
    expect(addressMatches).toHaveLength(2);
    expect(screen.getAllByText('Comuna Test')).toHaveLength(2);

    // Both iframes carry the SAVED maps_embed src — the same source
    const iframes = container.querySelectorAll('iframe');
    expect(iframes).toHaveLength(2);
    for (const iframe of iframes) {
      expect(iframe).toHaveAttribute('src', SAVED.contact.maps_embed);
    }
  });
});
