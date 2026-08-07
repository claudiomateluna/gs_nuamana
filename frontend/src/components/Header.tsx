'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Menubar from './ui/menu';
import { 
  IconoRRSSInstagram, 
  IconoRRSSFacebook, 
  IconoRRSSYoutube, 
  IconoRRSSTiktok, 
  IconoRRSSGoogle, 
  IconoRRSSEmail, 
  IconoRRSSWhatsApp, 
  IconoMenu, 
  IconoAcceso 
} from './ui/iconos';
import { useTheme } from '@/contexts/theme-context';
import { useSiteConfigSafe } from '@/contexts/site-config-context';
import { supabase } from '@/lib/supabase';

const FALLBACK = {
  logo_header: '/images/logos/logo-nuamana.webp',
  pretitulo: 'Guías y Scouts',
  nombre_corto: 'Nua Mana',
  slogan: 'una nueva aventura',
  instagram: 'https://instagram.com/gruponuamana/',
  facebook: 'https://facebook.com/gruponuamana',
  whatsapp: 'https://wa.me/56966896001',
  label_panel: 'Mi Panel',
  label_login: 'Acceder',
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const config = useSiteConfigSafe();
  const logoHeader = config?.branding.logo_header ?? FALLBACK.logo_header;
  const pretitulo = config?.branding.pretitulo ?? FALLBACK.pretitulo;
  const nombreCorto = config?.branding.nombre_corto ?? FALLBACK.nombre_corto;
  const slogan = config?.branding.slogan ?? FALLBACK.slogan;
  const instagram = config?.social.instagram ?? FALLBACK.instagram;
  const facebook = config?.social.facebook ?? FALLBACK.facebook;
  const whatsapp = config?.social.whatsapp ?? FALLBACK.whatsapp;
  const labelPanel = config?.navigation.label_panel ?? FALLBACK.label_panel;
  const labelLogin = config?.navigation.label_login ?? FALLBACK.label_login;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escuchar cambios en auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    }
  }, []);

  return (
    <header
      aria-label="Encabezado de Sitio"
      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-500 ${
        isScrolled
          ? 'bg-gradient-to-r from-clr7 via-clr7/90 to-clr5 backdrop-blur-lg shadow-2xl py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-[1080px] mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="border-r-2 border-clr8/30 pr-2 md:pr-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white hover:text-clr8 transition-colors focus:outline-none"
              aria-label="Abrir menú"
            >
              <IconoMenu className="h-7 w-7" />
            </button>
          </div>
          
          <Link href="/" className="flex items-center group">
            <img
              src={logoHeader}
              alt="Logo"
              style={{ height: '60px', width: 'auto' }}
              className="object-contain group-hover:scale-110 transition-transform duration-500"
            />
            <div className="sm:flex flex-col ml-1 md:ml-3 justify-center">
              <div className="text-[0.7em] md:text-[0.8em] text-clr10 uppercase tracking-widest leading-none mb-[-1px] md:mb-[-3px]">{pretitulo}</div>
              <div className="text-[1.2em] md:text-[1.5em] text-clr1 dark:text-dclr2 font-black uppercase leading-none tracking-tighter font-inika">{nombreCorto}</div>
              <div className="text-[0.7em] md:text-[0.85em] text-clr8 dark:text-dclr8 italic leading-none mt-[-3px] md:mt-[-6px]">{slogan}</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          {/* Social Links Desktop */}
          <div className="hidden lg:flex items-center gap-3 border-r border-white/10 pr-6">
            {instagram && <a href={instagram} target="_blank" className="text-white/70 hover:text-clr8 transition-colors"><IconoRRSSInstagram className="w-5 h-5" /></a>}
            {facebook && <a href={facebook} target="_blank" className="text-white/70 hover:text-clr8 transition-colors"><IconoRRSSFacebook className="w-5 h-5" /></a>}
            {whatsapp && <a href={whatsapp} target="_blank" className="text-white/70 hover:text-clr8 transition-colors"><IconoRRSSWhatsApp className="w-5 h-5" /></a>}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <Link href="/panel" className="hidden sm:flex items-center gap-2 text-clr8 font-black uppercase text-[0.8em] tracking-widest hover:text-white transition-colors">
                <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_panel.svg)', maskImage: 'url(/images/iconos/icono_panel.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
                <span>{labelPanel}</span>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-clr8 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
                <IconoAcceso className="w-6 h-6" />
                <span>{labelLogin}</span>
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-1 bg-white/10 dark:bg-dclr1 rounded-2xl text-clr8 hover:bg-clr7 hover:text-white transition-all shadow-lg"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <Menubar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
