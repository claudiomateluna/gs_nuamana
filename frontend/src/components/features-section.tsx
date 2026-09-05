'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSiteConfigSafe } from '@/contexts/site-config-context';
import {
  featuresTitleColor,
  featuresSubtitleColor,
  buildFeaturesGradient,
  featuresItemTitleColor,
  featuresItemDescColor,
  featuresLinkBarColor,
  featuresSectionBgColor,
  type FeaturesColorConfig,
} from '@/lib/features-colors';

const FALLBACK = {
  titulo_seccion: '¿Qué hacemos?',
  subtitulo: 'Descubre las actividades que realizamos en Nua Mana para el desarrollo integral de las niñas, niños y jóvenes.',
  items: [
    {
      title: "LOGRAMOS",
      description: "Empoderamiento Juvenil",
      image: "/images/inicio/pag_Logramos.jpg",
      link: "/lo-que-hacemos/sistema-de-equipos"
    },
    {
      title: "CREAMOS",
      description: "Ciudadan@s Activ@s",
      image: "/images/inicio/pag_Creamos.jpg",
      link: "/lo-que-hacemos/programa-y-actividades"
    },
    {
      title: "CULTIVAMOS",
      description: "Valores y Habilidades",
      image: "/images/inicio/pag_Cultivamos.jpg",
      link: "/lo-que-hacemos/habilidades-y-tecnicas"
    },
    {
      title: "ABRAZAMOS",
      description: "Educación para la Paz",
      image: "/images/inicio/pag_Abrazamos.jpg",
      link: "/lo-que-hacemos/aprender-haciendo"
    }
  ]
};

const FeaturesSection = () => {
  const config = useSiteConfigSafe();
  const tituloSeccion = config?.features.titulo_seccion ?? FALLBACK.titulo_seccion;
  const subtitulo = config?.features.subtitulo ?? FALLBACK.subtitulo;
  const features = config?.features.items ?? FALLBACK.items;

  const [isClient, setIsClient] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Track dark mode changes via MutationObserver (same pattern as hero.tsx)
  React.useEffect(() => {
    if (!isClient) return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, [isClient]);

  const colorCfg: FeaturesColorConfig = config?.features ?? {};

  return (
    <section
      className="py-24 transition-colors"
      style={{ backgroundColor: featuresSectionBgColor(colorCfg, isDark) }}
    >
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2
            className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter"
            style={{ color: featuresTitleColor(colorCfg, isDark) }}
          >
            {tituloSeccion}
          </h2>
          <p
            className="text-xl max-w-3xl mx-auto font-body font-bold italic leading-relaxed"
            style={{ color: featuresSubtitleColor(colorCfg, isDark) }}
          >
            {subtitulo}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {features.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative h-[450px] overflow-hidden rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div
                className="absolute inset-0"
                style={{ background: buildFeaturesGradient(colorCfg, isDark) }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center space-y-2">
                <h3
                  className="text-3xl font-black font-display group-hover:scale-110 transition-transform tracking-tighter"
                  style={{ color: featuresItemTitleColor(colorCfg, isDark) }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm font-bold font-body uppercase tracking-widest"
                  style={{ color: featuresItemDescColor(colorCfg, isDark) }}
                >
                  {item.description}
                </p>
                <div
                  className="w-12 h-1 mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: featuresLinkBarColor(colorCfg, isDark) }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
