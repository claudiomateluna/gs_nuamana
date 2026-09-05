'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  // Empieza con los datos hardcoded (fallback inmediato, sin flash vacío);
  // la DB (corregida) siempre los sobreescribe cuando el fetch responde.
  const [unitNames, setUnitNames] = useState(units);

  useEffect(() => {
    supabase.from('unidades')
      .select('id, nombre, nombre_unidad, logo_unidad_url')
      .order('id')
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setUnitNames(data.map((row, i) => ({
          name: row.nombre,
          displayName: row.nombre_unidad || row.nombre,
          image: row.logo_unidad_url || units[i]?.image || '',
          alt: row.nombre_unidad ? `${row.nombre} ${row.nombre_unidad}` : row.nombre,
        })));
      });
  }, []);

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
        {unitNames.map((unit, index) => (
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
              <p className="font-display font-black text-foclr4 dark:text-fodclr4 uppercase tracking-tighter text-[2em] leading-none">{unit.name}</p>
              <p className="font-display text-foclr5 dark:text-fodclr5 font-bold text-lg">{unit.displayName}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {unitNames.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${currentIndex === index ? 'bg-foclr5 w-4' : 'bg-foclr1 dark:bg-fodclr1'}`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default UnitSlideShow;
