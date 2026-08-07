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
    clr1: '', clr2: '', clr3: '', clr4: '', clr5: '', clr6: '', clr7: '', clr8: '', clr9: '', clr10: '',
    clr11: '', clr12: '',
    dclr1: '', dclr2: '', dclr3: '', dclr4: '', dclr5: '', dclr6: '', dclr7: '', dclr8: '', dclr9: '', dclr10: '',
    dclr11: '', dclr12: '',
    clr1_opacity: 100, clr2_opacity: 100, clr3_opacity: 100, clr4_opacity: 100, clr5_opacity: 100,
    clr6_opacity: 100, clr7_opacity: 100, clr8_opacity: 100, clr9_opacity: 100, clr10_opacity: 100,
    clr11_opacity: 100, clr12_opacity: 100,
    dclr1_opacity: 100, dclr2_opacity: 100, dclr3_opacity: 100, dclr4_opacity: 100, dclr5_opacity: 100,
    dclr6_opacity: 100, dclr7_opacity: 100, dclr8_opacity: 100, dclr9_opacity: 100, dclr10_opacity: 100,
    dclr11_opacity: 100, dclr12_opacity: 100,
  },
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
