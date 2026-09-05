'use client';

import { useState, useEffect } from 'react';
import { useSiteConfigSafe } from '@/contexts/site-config-context';
import {
  buildHeroGradient,
  heroTitleColor,
  heroSubtitleColor,
  pickHeroBorderColor,
  type HeroColorConfig,
} from '@/lib/hero-colors';

const FALLBACK = {
  phrases: [
    "SCOUTS, Educación para la Vida",
    "Empoderamos a niñas niños y jovenes, Con Habilidades para Crear un Mundo Mejor",
    "Vivimos en una Aventura, Transformadora y Llena de Crecimiento Personal"
  ],
  fondo: '/images/inicio/fondo.webp',
  intervalo: 5000,
  allImages: Array.from({ length: 20 }, (_, i) => `/images/fotos/fotos_${String(i + 1).padStart(2, '0')}_.webp`),
  topCount: 3,
  bottomCount: 3,
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topImages, setTopImages] = useState<string[]>([]);
  const [bottomImages, setBottomImages] = useState<string[]>([]);
  const [borderColors, setBorderColors] = useState<string[]>([]);
  const [screenWidth, setScreenWidth] = useState(1024);
  const [isClient, setIsClient] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const config = useSiteConfigSafe();
  const phrases = config?.hero.frases ?? FALLBACK.phrases;
  const fondo = config?.hero.fondo ?? FALLBACK.fondo;
  const intervalo = config?.hero.intervalo ?? FALLBACK.intervalo;
  const allImages = config?.hero.imagenes_pool ?? FALLBACK.allImages;
  const topCount = config?.hero.top_count ?? FALLBACK.topCount;
  const bottomCount = config?.hero.bottom_count ?? FALLBACK.bottomCount;

  // Hero color config — pass full hero config to color utilities
  const heroColorCfg: HeroColorConfig = config?.hero ?? {};

  useEffect(() => {
    setIsClient(true);
    setIsDark(document.documentElement.classList.contains('dark'));
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    setScreenWidth(window.innerWidth);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track dark mode changes via MutationObserver
  useEffect(() => {
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

  useEffect(() => {
    const shuffledImages = [...allImages].sort(() => Math.random() - 0.5);

    setTopImages(shuffledImages.slice(0, topCount));
    setBottomImages(shuffledImages.slice(topCount, topCount + bottomCount));
    setBorderColors(
      Array.from({ length: topCount + bottomCount }, (_, i) =>
        pickHeroBorderColor(heroColorCfg, i),
      ),
    );
  }, [allImages, topCount, bottomCount, screenWidth, heroColorCfg.heclr6, heroColorCfg.heclr7, heroColorCfg.heclr8, heroColorCfg.heclr9, heroColorCfg.heclr10, heroColorCfg.heclr11, heroColorCfg.heclr12, heroColorCfg.heclr13, heroColorCfg.heclr6_opacity, heroColorCfg.heclr7_opacity, heroColorCfg.heclr8_opacity, heroColorCfg.heclr9_opacity, heroColorCfg.heclr10_opacity, heroColorCfg.heclr11_opacity, heroColorCfg.heclr12_opacity, heroColorCfg.heclr13_opacity]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % phrases.length);
    }, intervalo);
    return () => clearInterval(interval);
  }, [phrases.length, intervalo]);

  if (!isClient) return null;

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-clr4">
      {/* Fondo y Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url('${fondo}')` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: buildHeroGradient(heroColorCfg, isDark) }}
      />

      {/* BLOQUE SUPERIOR: Imágenes fijas arriba */}
      <div className="absolute top-34 left-0 right-0 z-10 flex justify-center gap-4 px-6">
        {topImages.map((image, idx) => (
          <div
            key={`top-${idx}`}
            className="w-40 sm:w-64 border-4 rounded-[1.8em] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-110"
            style={{
              transform: `rotate(${(Math.random() * 6) - 3}deg)`,
              animation: `fadeIn 1s ease-out forwards ${idx * 0.2}s`,
              opacity: 0,
              borderColor: borderColors[idx],
            }}
          >
            <img src={image} alt="Nua Mana" className="w-full aspect-[4/3] object-cover" />
          </div>
        ))}
      </div>

      {/* BLOQUE CENTRAL: Texto siempre en el centro del viewport */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="text-center space-y-4 px-6 max-w-[1080px] pointer-events-auto">
          <h2
            className="text-4xl md:text-7xl font-black font-display uppercase leading-none tracking-wide drop-shadow-2xl animate-in slide-in-from-bottom duration-1000 mb-[-0.1em]"
            style={{ color: heroTitleColor(heroColorCfg, isDark) }}
          >
            {phrases[currentSlide].split(',')[0]}
          </h2>
          <p
            className="text-xl md:text-3xl font-body font-bold italic opacity-90 drop-shadow-lg"
            style={{ color: heroSubtitleColor(heroColorCfg, isDark) }}
          >
            {phrases[currentSlide].split(',')[1] || ''}
          </p>
        </div>
      </div>

      {/* BLOQUE INFERIOR: Imágenes fijas abajo */}
      <div className="absolute bottom-32 left-0 right-0 z-10 flex justify-center gap-4 px-6">
        {bottomImages.map((image, idx) => (
          <div
            key={`bottom-${idx}`}
            className="w-40 sm:w-64 border-4 rounded-[1.8em] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-110"
            style={{
              transform: `rotate(${(Math.random() * 6) - 3}deg)`,
              animation: `fadeIn 1s ease-out forwards ${0.5 + idx * 0.2}s`,
              opacity: 0,
              borderColor: borderColors[idx + topImages.length],
            }}
          >
            <img src={image} alt="Nua Mana" className="w-full aspect-[4/3] object-cover" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
