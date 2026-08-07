'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import { useSiteConfigSafe } from '@/contexts/site-config-context';

const FALLBACK = {
  titulo_seccion: 'Lo que dicen de nosotros',
  widget_url: 'https://widget.taggbox.com/307862?website=1',
};

const Testimonials = () => {
  const { theme } = useTheme();
  const config = useSiteConfigSafe();
  const tituloSeccion = config?.testimonials.titulo_seccion ?? FALLBACK.titulo_seccion;
  const widgetUrl = config?.testimonials.widget_url ?? FALLBACK.widget_url;

  return (
    <section className="py-24 bg-zinc-100 dark:bg-zinc-950 transition-colors">
      <div className="max-w-[1080px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black font-display text-center text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-16">
          {tituloSeccion}
        </h2>

        <div
          className="flex justify-center rounded-[1rem] overflow-hidden shadow-2xl bg-white dark:bg-zinc-900"
          style={{
            filter: theme === 'dark' ? 'invert(90%)' : 'none',
          }}
        >
          <iframe 
            className="w-full h-[450px] max-w-full" 
            src={widgetUrl} 
            title="Testimonios Nua Mana"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
