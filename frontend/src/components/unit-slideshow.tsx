'use client';

import { useState, useEffect } from 'react';

const UnitSlideShow = () => {
  const units = [
    {
      name: 'Manada',
      displayName: 'Ahi Niho Vaenga',
      image: '/images/logos/iconos_UnidadesManada.webp',
      alt: 'Manada Ahi Niho Vaenga'
    },
    {
      name: 'Compañía',
      displayName: 'Po Nui Vaicava',
      image: '/images/logos/iconos_UnidadesCia.webp',
      alt: 'Compañía Po Nui Vaicava'
    },
    {
      name: 'Tropa',
      displayName: "A'ata",
      image: '/images/logos/iconos_UnidadesTropa.webp',
      alt: "Tropa A'ata"
    },
    {
      name: 'Avanzada',
      displayName: 'Rapahango',
      image: '/images/logos/iconos_UnidadesAvanzada.webp',
      alt: 'Avanzada Rapahango'
    },
    {
      name: 'Clan',
      displayName: 'Ahu Akivi',
      image: '/images/logos/iconos_UnidadesClan.webp',
      alt: 'Clan Ahu Akivi'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % units.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [units.length]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div 
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {units.map((unit, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-full flex flex-col items-center justify-center p-4"
          >
            <img
              src={unit.image}
              alt={unit.alt}
              className="w-48 h-48 object-contain mb-4"
            />
            <div className="text-center">
              <p className="font-display font-black text-clr1 uppercase tracking-tighter text-[2em] leading-none">{unit.name}</p>
              <p className="font-display text-clr5 dark:text-clr8 font-bold text-lg">{unit.displayName}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {units.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-clr8 w-4' : 'bg-white/20'}`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default UnitSlideShow;
