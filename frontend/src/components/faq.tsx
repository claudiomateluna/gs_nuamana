'use client';

import React, { useState } from 'react';
import { IconoChevronUp, IconoChevronDown } from './ui/iconos';
import DOMPurify from 'dompurify';

const FAQ_DATA = [
  {
    question: "¿PUEDO SER SCOUT?",
    answer: "Sí, <b>todos pueden ser scouts</b>, nuestro grupo es abierto a toda la comunidad, para poder ser parte de los scouts, sólo tienes que ser mayor de 7 años y tener ganas de divertirte y jugar junto a otras personas.",
    image: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-puedoSerScout.png"
  },
  {
    question: "¿CÓMO PUEDO PARTICIPAR?",
    answer: "Para nosotros es muy importante que niñas, niños y jóvenes se sientan cómodos siendo Scout, para poder participar lo primero es ver si te gusta, por eso tenemos las puertas abiertas a todos y todas las y los que quieran asistir, entonces, ¿Cómo puedes participar? <b>sólo ven un sábado de 3 a 6 de la tarde</b> y ve si te gusta.",
    image: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-comoPuedoParticipar.png"
  },
  {
    question: "¿HASTA QUÉ EDAD PUEDO SER SCOUT?",
    answer: "Las y los niños, niñas y jóvenes que participan de las actividades <b>van desde los 7 a los 21 años</b>.",
    image: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-hastaQueEdadPuedoSerScout.png"
  },
  {
    question: "¿HAY QUE PAGAR ALGO?",
    answer: "Cómo dijimos antes lo más importante es que te guste, por lo mismo, para ir sábado a sábado a las actividades de 3 a 6 de la tarde, no hay que pagar nada.<br><br>Sin embargo, también nos preocupamos por la salud de las y los scouts, es por ello que tenemos un <b>seguro de accidentes scouts</b> que está incluido dentro de nuestra inscripción. Hay que pagar una inscripción, pero sólo una vez que estás seguro de que te sientes cómodo y que te gusta estar en los Scouts, por otra parte, las salidas por el día, los campamentos y otras actividades tienen un costo que se destina completamente a cubrir los gastos de esas actividades.<br><br>Finalmente, no queremos que el dinero sea un factor por el que no seas Scout, es por lo mismo que como grupo hacemos muchas actividades económicas durante el año, para poder financiar los campamentos y salidas, y depende de tu colaboración en esas actividades el costo que tendrán las salidas y campamentos para tí, ya que la recaudación de las actividades económicas se destina a cubrir esos gastos.",
    image: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-hayQuePagarAlgo.png"
  },
  {
    question: "¿QUÉ INCLUYE LA INSCRIPCIÓN?",
    answer: "La inscripción incluye:<br><br><b>• Seguro scout</b> (es un seguro complementario de salud, que se cobra como reembolso posterior a los gastos médicos y descuentos propios de cada niño, niña o joven)<br><b>• Credencial scout</b><br><b>• Insignia del año</b>",
    image: "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-queIncluyeLaInscripcion.png"
  }
];

const FAQItem = ({ question, answer, isOpen, toggleOpen, image }: {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  image: string;
}) => {
  return (
    <div className="border border-clr10 dark:border-clr4 rounded-3xl overflow-hidden mb-4 shadow-md bg-white dark:bg-zinc-900 transition-all hover:shadow-xl">
      <button
        className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-50 dark:hover:bg-clr5/10 transition-colors group"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-black font-display text-clr5 dark:text-clr1 group-hover:text-clr7 transition-colors uppercase tracking-tight">{question}</h3>
        <div className={`p-2 rounded-full transition-all duration-500 ${isOpen ? 'bg-clr7 text-white rotate-180' : 'bg-clr10 dark:bg-clr4 text-clr7'}`}>
          <IconoChevronDown className="h-5 w-5" />
        </div>
      </button>
      {isOpen && (
        <div className="p-8 pt-0 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col md:flex-row gap-8 items-center border-t border-clr10 dark:border-clr4 pt-8">
            <div className="shrink-0 w-48 h-48 overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-clr4">
              <img
                src={image}
                alt={question}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="text-clr4/80 dark:text-clr2 flex-grow font-body text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer) }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-zinc-50 dark:bg-black transition-colors">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black font-display text-clr5 dark:text-clr8 uppercase tracking-tighter">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-clr2 font-body font-bold italic">
            Encuentra respuestas a las dudas más comunes
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {FAQ_DATA.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              image={faq.image}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
