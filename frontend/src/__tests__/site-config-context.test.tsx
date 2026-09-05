import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteConfigProvider, useSiteConfig } from '@/contexts/site-config-context';
import type { SiteConfigRecord } from '@/lib/site-config.types';

// Full typed fixture — provider accepts a complete SiteConfigRecord from the
// server (SSR contract: values passed as props, never fetched on the client).
const FIXTURE: SiteConfigRecord = {
  branding: {
    nombre_grupo: 'Guías y Scouts Nua Mana',
    nombre_corto: 'Nua Mana',
    pretitulo: 'Guías y Scouts',
    slogan: 'una nueva aventura',
    mision: 'mision',
    motto: 'motto',
    logo_header: '/logo.png',
    logo_footer: '/logo.svg',
    copyright: 'Nua Mana',
  },
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    google: '',
    whatsapp: '',
    email: '',
  },
  contact: { sede_nombre: '', direccion: '', maps_embed: '' },
  hero: {
    frases: [],
    fondo: '',
    intervalo: 0,
    imagenes_pool: [],
    top_count: 0,
    bottom_count: 0,
  },
  features: { titulo_seccion: '', subtitulo: '', items: [] },
  faq: { titulo_seccion: '', subtitulo: '', items: [] },
  testimonials: { titulo_seccion: '', widget_url: '' },
  visit: {
    titulo: '',
    fecha_fundacion: '',
    email: '',
    email_href: '',
    horario: '',
    cta_texto: '',
    imagen: '',
  },
  seo: { title: '', description: '' },
  pwa: {
    name: '',
    short_name: '',
    description: '',
    lang: '',
    icon_192: '',
    icon_512: '',
    icon_1024: '',
  },
  navigation: { label_panel: '', label_login: '' },
  theme_colors: {
    // Base light (10) + base dark (10)
    clr1: '', clr2: '', clr3: '', clr4: '', clr5: '', clr6: '', clr7: '', clr8: '', clr9: '', clr10: '',
    dclr1: '', dclr2: '', dclr3: '', dclr4: '', dclr5: '', dclr6: '', dclr7: '', dclr8: '', dclr9: '', dclr10: '',
    // Tarjetas light (6) + dark (6)
    tclr1: '', tclr2: '', tclr3: '', tclr4: '', tclr5: '', tclr6: '',
    tdclr1: '', tdclr2: '', tdclr3: '', tdclr4: '', tdclr5: '', tdclr6: '',
    // Header light (12) + dark (12)
    hclr1: '', hclr2: '', hclr3: '', hclr4: '', hclr5: '', hclr6: '', hclr7: '', hclr8: '', hclr9: '', hclr10: '',
    hclr11: '', hclr12: '',
    hdclr1: '', hdclr2: '', hdclr3: '', hdclr4: '', hdclr5: '', hdclr6: '', hdclr7: '', hdclr8: '', hdclr9: '', hdclr10: '',
    hdclr11: '', hdclr12: '',
    // Menú light (11) + dark (11)
    mclr1: '', mclr2: '', mclr3: '', mclr4: '', mclr5: '', mclr6: '', mclr7: '', mclr8: '', mclr9: '', mclr10: '', mclr11: '',
    mdclr1: '', mdclr2: '', mdclr3: '', mdclr4: '', mdclr5: '', mdclr6: '', mdclr7: '', mdclr8: '', mdclr9: '', mdclr10: '', mdclr11: '',
    // Opacities — all default to 100
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

function BrandNameConsumer() {
  const config = useSiteConfig();
  return <p>{config.branding.nombre_corto}</p>;
}

describe('SiteConfigProvider / useSiteConfig', () => {
  it('throws when useSiteConfig is used outside the provider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<BrandNameConsumer />)).toThrow(
      'useSiteConfig must be used within a SiteConfigProvider',
    );

    errorSpy.mockRestore();
  });

  it('exposes the server-provided config to children inside the provider', () => {
    render(
      <SiteConfigProvider config={FIXTURE}>
        <BrandNameConsumer />
      </SiteConfigProvider>,
    );

    expect(screen.getByText('Nua Mana')).toBeInTheDocument();
  });
});
