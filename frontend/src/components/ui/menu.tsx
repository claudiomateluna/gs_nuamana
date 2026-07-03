'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  IconoInicio, 
  IconoAcercaDe, 
  IconoAcercaDeQuienesSomos, 
  IconoAcercaDeNuestraHistoria, 
  IconoAcercaDeMisionVision, 
  IconoAcercaDeNuestroEquipo, 
  IconoAcercaDeNuestrosApoderados, 
  IconoAcercaDeInstitucionPatrocinante, 
  IconoLoQueHacemos, 
  IconoLoQueHacemosMetodoScout, 
  IconoLoQueHacemosAireLibre, 
  IconoLoQueHacemosAprenderHaciendo, 
  IconoLoQueHacemosHabilidadesTecnicas, 
  IconoLoQueHacemosProgramasActividades, 
  IconoLoQueHacemosSistemaEquipos, 
  IconoLoQueHacemosVidaReflexiva, 
  ArrowLeftIcon, 
  IconoRRSSInstagram, 
  IconoRRSSFacebook, 
  IconoRRSSYoutube, 
  IconoRRSSTiktok, 
  IconoRRSSGoogle, 
  IconoRRSSEmail, 
  IconoRRSSWhatsApp, 
  IconoCerrar 
} from './iconos';
import { supabase } from '@/lib/supabase';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarDrawer = ({ isOpen, onClose }: SidebarDrawerProps) => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'main' | 'acerca-de' | 'lo-que-hacemos' | 'unidades'>('main');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    // Obtener sesión
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const acercaDeItems = [
    { title: "Quiénes Somos", action: () => router.push('/acerca-de/quienes-somos'), icon: IconoAcercaDeQuienesSomos },
    { title: "Nuestra Historia", action: () => router.push('/acerca-de/nuestra-historia'), icon: IconoAcercaDeNuestraHistoria },
    { title: "Misión y Visión", action: () => router.push('/acerca-de/mision-y-vision'), icon: IconoAcercaDeMisionVision },
    { title: "Nuestro Equipo", action: () => router.push('/acerca-de/nuestro-equipo'), icon: IconoAcercaDeNuestroEquipo },
    { title: "Nuestros Apoderados", action: () => router.push('/acerca-de/nuestros-apoderados'), icon: IconoAcercaDeNuestrosApoderados },
    { title: "Institución Patrocinante", action: () => router.push('/acerca-de/institucion-patrocinante'), icon: IconoAcercaDeInstitucionPatrocinante },
  ];

  const loQueHacemosItems = [
    { title: "Ley y Promesa", action: () => router.push('/lo-que-hacemos/ley-y-promesa'), icon: IconoLoQueHacemos },
    { title: "El Método Scout", action: () => router.push('/lo-que-hacemos/el-metodo-scout'), icon: IconoLoQueHacemosMetodoScout },
    { title: "Aprender Haciendo", action: () => router.push('/lo-que-hacemos/aprender-haciendo'), icon: IconoLoQueHacemosAprenderHaciendo },
    { title: "Sistema de Equipos", action: () => router.push('/lo-que-hacemos/sistema-de-equipos'), icon: IconoLoQueHacemosSistemaEquipos },
    { title: "Vida al Aire Libre", action: () => router.push('/lo-que-hacemos/vida-al-aire-libre'), icon: IconoLoQueHacemosAireLibre },
    { title: "Habilidades y Técnicas", action: () => router.push('/lo-que-hacemos/habilidades-y-tecnicas'), icon: IconoLoQueHacemosHabilidadesTecnicas },
    { title: "Vida Reflexiva", action: () => router.push('/lo-que-hacemos/vida-reflexiva'), icon: IconoLoQueHacemosVidaReflexiva },
    { title: "Programa y Actividades", action: () => router.push('/lo-que-hacemos/programa-y-actividades'), icon: IconoLoQueHacemosProgramasActividades },
  ];

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className={`bg-gradient-to-b from-clr1 dark:from-clr5 to-clr2/80 dark:to-clr7/80 fixed top-0 left-0 h-screen w-[280px] sm:w-[320px] z-[10000] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-2 border-b border-clr10 dark:border-clr4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {currentView !== 'main' && (
                  <button onClick={() => setCurrentView('main')} className="mr-1 p-1 rounded-full hover:bg-clr10/50 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5 text-clr5 dark:text-clr2" />
                  </button>
                )}
                <div className="flex items-center">
                  <Link href="/" className="flex items-center" onClick={onClose}>
                    <img
                      src="/images/logos/LogoColor.svg"
                      alt="Logo"
                      style={{ height: '60px', width: 'auto' }}
                      className="h-10 w-auto mr-2" />
                    <div>
                      <div className="text-clr4 dark:text-clr2 text-[0.85em] uppercase leading-none mb-[-2px]">Guías y Scouts</div>
                      <div className="text-clr7 dark:text-clr7 text-[1.25em] font-black uppercase leading-none font-inika">Nua Mana</div>
                      <div className="text-clr4 dark:text-dclr8 italic text-[0.8em] leading-none mt-[-4px]">una nueva aventura</div>
                    </div>
                  </Link>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-clr7 hover:bg-clr7/10 rounded-full transition-colors">
                <IconoCerrar className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {currentView === 'main' && (
              <nav className="space-y-2">
                <button onClick={() => { router.push('/'); onClose(); }} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                  <IconoInicio className="w-8 h-8 mr-4 text-clr7" />
                  <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">Inicio</span>
                </button>
                <button onClick={() => setCurrentView('acerca-de')} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                  <IconoAcercaDe className="w-8 h-8 mr-4 text-clr7" />
                  <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">Acerca de</span>
                </button>
                <button onClick={() => setCurrentView('lo-que-hacemos')} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                  <IconoLoQueHacemos className="w-8 h-8 mr-4 text-clr7" />
                  <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">Lo que hacemos</span>
                </button>
                <button onClick={() => { router.push('/blog'); onClose(); }} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                  <div className="w-8 h-8 mr-4 flex items-center justify-center text-clr7">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">Blog</span>
                </button>
                <button onClick={() => setCurrentView('unidades')} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                  <div className="w-8 h-8 mr-4 flex items-center justify-center text-clr7">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">Nuestras Unidades</span>
                </button>
              </nav>
            )}

            {currentView === 'acerca-de' && (
              <nav className="space-y-1">
                <h3 className="px-3 mb-4 text-[0.8em] font-black uppercase tracking-widest text-clr2">Acerca de Nua Mana</h3>
                {acercaDeItems.map((item, i) => (
                  <button key={i} onClick={() => { item.action(); onClose(); }} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                    {React.createElement(item.icon, { className: "w-8 h-8 mr-4 text-clr7" })}
                    <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">{item.title}</span>
                  </button>
                ))}
              </nav>
            )}

            {currentView === 'lo-que-hacemos' && (
              <nav className="space-y-1">
                <h3 className="px-3 mb-4 text-[0.8em] font-black uppercase tracking-widest text-clr2">Nuestra Propuesta</h3>
                {loQueHacemosItems.map((item, i) => (
                  <button key={i} onClick={() => { item.action(); onClose(); }} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                    {React.createElement(item.icon, { className: "w-8 h-8 mr-4 text-clr7" })}
                    <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">{item.title}</span>
                  </button>
                ))}
              </nav>
            )}

            {currentView === 'unidades' && (
              <nav className="space-y-1">
                <h3 className="px-3 mb-4 text-[0.8em] font-black uppercase tracking-widest text-clr2">Nuestras Unidades</h3>
                {[
                  { title: "Manada (Ahi Niho Vænga)", slug: "manada", icon: "/images/logos/iconos_lobatos.svg" },
                  { title: "Compañía (Põ Vui Vaikava)", slug: "compania", icon: "/images/logos/iconos_guias.svg" },
                  { title: "Tropa (A'ata)", slug: "tropa", icon: "/images/logos/iconos_scouts.svg" },
                  { title: "Avanzada (Rapahango)", slug: "avanzada", icon: "/images/logos/iconos_pioneres.svg" },
                  { title: "Clan (Ahu Akivi)", slug: "clan", icon: "/images/logos/iconos_caminantes.svg" }
                ].map((item, i) => (
                  <button key={i} onClick={() => { router.push(`/unidad/${item.slug}`); onClose(); }} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                    <img src={item.icon} alt="" className="w-8 h-8 mr-4 object-contain" />
                    <span className="font-bold text-clr5 dark:text-clr1 group-hover:text-clr7">{item.title}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>

          <div className="p-6 border-t border-clr10 dark:border-clr4 bg-white/50 dark:bg-black/20">
            {user ? (
              <button onClick={() => { router.push('/dashboard'); onClose(); }} className="w-full p-2 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 transition-all mb-6 flex items-center justify-between gap-2">
                <div className="w-12 h-12 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_mi_panel.svg)', maskImage: 'url(/images/iconos/icono_mi_panel.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
                 Mi Panel Personal
              </button>
            ) : (
              <button onClick={() => { router.push('/login'); onClose(); }} className="w-full py-4 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 transition-all mb-6">
                Acceder
              </button>
            )}
            <div className="flex justify-between px-2">
              <a href="https://instagram.com/gruponuamana" className="text-clr5 dark:text-clr2 hover:text-clr7 transition-colors"><IconoRRSSInstagram className="w-5 h-5" /></a>
              <a href="https://facebook.com/gruponuamana" className="text-clr5 dark:text-clr2 hover:text-clr7 transition-colors"><IconoRRSSFacebook className="w-5 h-5" /></a>
              <a href="https://youtube.com/@gruponuamana" className="text-clr5 dark:text-clr2 hover:text-clr7 transition-colors"><IconoRRSSYoutube className="w-5 h-5" /></a>
              <a href="https://tiktok.com/@gruponuamana" className="text-clr5 dark:text-clr2 hover:text-clr7 transition-colors"><IconoRRSSTiktok className="w-5 h-5" /></a>
              <a href="https://wa.me/+56966896001" className="text-clr5 dark:text-clr2 hover:text-clr7 transition-colors"><IconoRRSSWhatsApp className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDrawer;
