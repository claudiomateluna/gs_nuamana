'use client';

import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topImages, setTopImages] = useState<string[]>([]);
  const [bottomImages, setBottomImages] = useState<string[]>([]);
  const [borderColors, setBorderColors] = useState<string[]>([]);
  const [screenWidth, setScreenWidth] = useState(1024);
  const [isClient, setIsClient] = useState(false);

  const phrases = [
    "SCOUTS, Educación para la Vida",
    "Empoderamos a niñas niños y jovenes, Con Habilidades para Crear un Mundo Mejor",
    "Vivimos en una Aventura, Transformadora y Llena de Crecimiento Personal"
  ];

  const allImages = Array.from({ length: 20 }, (_, i) => `/images/fotos/fotos_${String(i + 1).padStart(2, '0')}_.webp`);

  const colors = [
    'border-red-300', 'border-blue-300', 'border-green-300', 'border-purple-300', 
    'border-yellow-300', 'border-orange-300', 'border-indigo-300', 'border-pink-300'
  ];

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    setScreenWidth(window.innerWidth);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const shuffledImages = [...allImages].sort(() => Math.random() - 0.5);
    const numImages = screenWidth < 460 ? 1 : (screenWidth < 1024 ? 2 : 3);

    setTopImages(shuffledImages.slice(0, numImages));
    setBottomImages(shuffledImages.slice(numImages, numImages * 2));

    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    setBorderColors(shuffledColors.slice(0, numImages * 2));
  }, [screenWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % phrases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-clr5">
      {/* Fondo y Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: "url('/images/inicio/fondo.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-clr5/90 via-clr5/40 to-clr7/70 dark:from-black/80 dark:to-clr4/80" />

      {/* BLOQUE SUPERIOR: Imágenes fijas arriba */}
      <div className="absolute top-34 left-0 right-0 z-10 flex justify-center gap-4 px-6">
        {topImages.map((image, idx) => (
          <div
            key={`top-${idx}`}
            className={`w-40 sm:w-64 border-4 ${borderColors[idx] || 'border-white'} rounded-[1.8em] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-110`}
            style={{
              transform: `rotate(${(Math.random() * 6) - 3}deg)`,
              animation: `fadeIn 1s ease-out forwards ${idx * 0.2}s`,
              opacity: 0
            }}
          >
            <img src={image} alt="Nua Mana" className="w-full aspect-[4/3] object-cover" />
          </div>
        ))}
      </div>

      {/* BLOQUE CENTRAL: Texto siempre en el centro del viewport */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="text-center space-y-4 px-6 max-w-[1080px] pointer-events-auto">
          <h2 className="text-4xl md:text-7xl font-black font-display text-clr8 uppercase leading-none tracking-wide drop-shadow-2xl animate-in slide-in-from-bottom duration-1000 mb-[-0.1em]">
            {phrases[currentSlide].split(',')[0]}
          </h2>
          <p className="text-xl md:text-3xl font-body text-white font-bold italic opacity-90 drop-shadow-lg">
            {phrases[currentSlide].split(',')[1] || ''}
          </p>
        </div>
      </div>

      {/* BLOQUE INFERIOR: Imágenes fijas abajo */}
      <div className="absolute bottom-32 left-0 right-0 z-10 flex justify-center gap-4 px-6">
        {bottomImages.map((image, idx) => (
          <div
            key={`bottom-${idx}`}
            className={`w-40 sm:w-64 border-4 ${borderColors[idx + topImages.length] || 'border-white'} rounded-[1.8em] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-110`}
            style={{
              transform: `rotate(${(Math.random() * 6) - 3}deg)`,
              animation: `fadeIn 1s ease-out forwards ${0.5 + idx * 0.2}s`,
              opacity: 0
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
