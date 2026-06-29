'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/theme-context';
import { IconoRRSSEmail, IconoMapPin } from './ui/iconos';

const VisitSection = () => {
  const [years, setYears] = useState(0);
  const [isMailHovered, setIsMailHovered] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const foundationDate = new Date(2005, 8, 23);
    const today = new Date();
    let yearsDiff = today.getFullYear() - foundationDate.getFullYear();
    const monthDiff = today.getMonth() - foundationDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < foundationDate.getDate())) {
      yearsDiff--;
    }

    const duration = 2000;
    const increment = yearsDiff / (duration / 16);
    let current = 0;

    const startAnimation = () => {
      current = 0;
      setYears(0);
      const timer = setInterval(() => {
        current += increment;
        if (current >= yearsDiff) {
          setYears(yearsDiff);
          clearInterval(timer);
        } else {
          setYears(Math.floor(current));
        }
      }, 16);
      return timer;
    };

    let timer = startAnimation();
    const resetInterval = setInterval(() => {
      clearInterval(timer);
      timer = startAnimation();
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(resetInterval);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isClient) return null;

  return (
    <section className="py-24 bg-white dark:bg-clr4 transition-colors">
      <div className="max-w-[1080px] mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-black font-display text-center mb-16 text-clr7 dark:text-clr8 uppercase tracking-tighter">¡Únete Ahora!</h2>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Dashboard Left */}
          <div className="w-full lg:w-1/3 grid grid-cols-1 gap-4">
            
            {/* Years & Mail */}
            <div className="flex h-40 shadow-2xl rounded-[2rem] overflow-hidden">
              <div className="w-1/2 bg-gradient-to-br from-clr6/50 via-clr5/50 to-clr5/50 p-2 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black text-dclr6 dark:text-dclr2 leading-none">+{years}</span>
                <span className="text-[0.8em] font-black uppercase text-clr4 dark:text-white mt-2 animate-bounce drop-shadow-lg">Años de Historias</span>
              </div>
              <div className="w-1/2 bg-gradient-to-br from-clr5/50 via-clr5/50 to-clr7/50 p-2 flex flex-col items-center justify-center text-center">
                <a 
                  href="mailto:contacto@nuamana.cl"
                  className={`p-3 rounded-full transition-all duration-500 mb-2 ${isMailHovered ? 'bg-clr8 scale-110 shadow-lg' : 'bg-white/10'}`}
                  onMouseEnter={() => setIsMailHovered(true)}
                  onMouseLeave={() => setIsMailHovered(false)}
                >
                  <IconoRRSSEmail className={`w-8 h-8 ${isMailHovered ? 'text-clr5' : 'text-clr4 dark:text-white'}`} />
                </a>
                <span className="text-[0.8em] font-black text-clr4 dark:text-white uppercase opacity-80 drop-shadow-lg">contacto@nuamana.cl</span>
              </div>
            </div>

            {/* Visit Circle */}
            <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-clr8 dark:from-clr5 via-clr6 dark:via-clr5 to-dclr6 dark:to-clr7 rounded-[2em] shadow-xl group overflow-hidden">
              <div 
                className="absolute inset-4 bg-contain bg-center bg-no-repeat opacity-60 group-hover:scale-110 transition-transform duration-1000"
                style={{ backgroundImage: "url('/images/inicio/AndysShow.png')" }}
              />
              <div className="relative z-10 text-center p-4">
                <span className="block text-3xl font-black text-white dark:text-clr8 font-display leading-tight uppercase tracking-tighter drop-shadow-lg">VEN A VISITARNOS</span>
              </div>
            </div>

            {/* Clock & Pin */}
            <div className="flex h-40 shadow-2xl rounded-[2em] overflow-hidden">
              <div className="w-1/2 bg-gradient-to-br from-clr7/50 via-clr5/50 to-clr5/50 p-2 flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 mb-2 border-4 border-clr10 rounded-full">
                  <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-clr10 rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
                  {/* Hands */}
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-clr10 origin-top -translate-x-1/2" style={{ transform: `rotate(${180 + (time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)` }} />
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-clr10 origin-top -translate-x-1/2" style={{ transform: `rotate(${180 + time.getMinutes() * 6}deg)` }} />
                  <div className="absolute top-1/2 left-1/2 w-px h-8 bg-clr7 origin-top -translate-x-1/2 animate-pulse" style={{ transform: `rotate(${180 + time.getSeconds() * 6}deg)` }} />
                </div>
                <div className="text-[0.9em] font-black uppercase text-clr1 text-center leading-tight drop-shadow-lg">Sábados 3 a 6 PM</div>
              </div>
              <div className="w-1/2 bg-gradient-to-br from-clr5/50 via-clr5/50 to-clr7/50 p-4 flex flex-col items-center justify-center text-center">
                <div className="relative mb-2">
                  <IconoMapPin className="w-16 h-16 text-white" />
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                </div>
                <span className="text-[0.8em] font-black text-white uppercase leading-tight">San José de la Estrella<br/>1004, La Granja</span>
              </div>
            </div>
          </div>

          {/* Map Right */}
          <div className="w-full lg:w-2/3 min-h-[500px] rounded-[2rem] overflow-hidden shadow-2xl dark:grayscale hover:grayscale-0 transition-all duration-700">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.382796811922!2d-70.6096195!3d-33.569409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d0a6e457520d%3A0xc3892aa7fa7d74b!2sGuias%20y%20Scouts%20Nua%20Mana!5e0!3m2!1ses!2scl!4v1763411447730!5m2!1ses!2scl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitSection;
