'use client';

import * as React from 'react';
import Link from 'next/link';

const FeaturesSection = () => {
  const features = [
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
  ];

  return (
    <section className="py-24 bg-white dark:bg-clr4 transition-colors">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black font-display text-clr7 dark:text-clr8 uppercase tracking-tighter">¿Qué hacemos?</h2>
          <p className="text-xl text-clr5 dark:text-clr2 max-w-3xl mx-auto font-body font-bold italic leading-relaxed">
            Descubre las actividades que realizamos en Nua Mana para el desarrollo integral de las niñas, niños y jóvenes.
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
              <div className="absolute inset-0 bg-gradient-to-t from-clr4 via-clr4/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center space-y-2">
                <h3 className="text-3xl font-black font-display text-clr8 dark:text-clr8 group-hover:scale-110 transition-transform tracking-tighter">{item.title}</h3>
                <p className="text-sm font-bold font-body text-white dark:text-clr2 uppercase tracking-widest">{item.description}</p>
                <div className="w-12 h-1 bg-clr7 mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
