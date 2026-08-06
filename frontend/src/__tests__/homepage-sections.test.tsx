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
  return { supabase: { auth: { getSession, onAuthStateChange } } };
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
  seo: { title: 'Título Test', description: 'Descripción Test', theme_color: '#123456' },
  pwa: {
    name: 'PWA Test',
    short_name: 'PWAT',
    description: 'Descripción Test',
    background_color: '#ffffff',
    theme_color: '#123456',
    lang: 'es',
    icon_192: '/icon-192.png',
    icon_512: '/icon-512.png',
    icon_1024: '/icon-1024.png',
  },
  navigation: { label_panel: 'Panel Test', label_login: 'Login Test' },
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

    // Social (desktop block) — hrefs come from the config, not the hardcoded strings
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain(SAVED.social.instagram);
    expect(hrefs).toContain(SAVED.social.facebook);
    expect(hrefs).toContain(SAVED.social.whatsapp);
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

    // 7 social links from the config
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    for (const expected of [
      SAVED.social.instagram,
      SAVED.social.facebook,
      SAVED.social.youtube,
      SAVED.social.tiktok,
      SAVED.social.google,
      SAVED.social.email,
      SAVED.social.whatsapp,
    ]) {
      expect(hrefs).toContain(expected);
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
  it('renders saved section title and widget iframe URL', () => {
    const { container } = renderInProvider(<Testimonials />);

    expect(screen.getByText(SAVED.testimonials.titulo_seccion)).toBeInTheDocument();
    expect(container.querySelector('iframe')).toHaveAttribute('src', SAVED.testimonials.widget_url);
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
