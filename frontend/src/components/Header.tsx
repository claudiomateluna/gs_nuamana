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
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

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
          <div className="border-r-2 border-clr8/30 pr-4">
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
              src="/images/logos/logo-nuamana.webp"
              alt="Logo"
              style={{ height: '60px', width: 'auto' }}
              className="object-contain group-hover:scale-110 transition-transform duration-500"
            />
            <div className="sm:flex flex-col ml-3 justify-center">
              <div className="text-[0.8em] text-clr2 uppercase font-black tracking-widest leading-none mb-[-1px]">Guías y Scouts</div>
              <div className="text-[1.5em] text-white font-black uppercase leading-none tracking-tighter font-inika">Nua Mana</div>
              <div className="text-[0.85em] text-clr8 italic leading-none mt-[-6px]">una nueva aventura</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {/* Social Links Desktop */}
          <div className="hidden lg:flex items-center gap-3 border-r border-white/10 pr-6">
            <a href="https://instagram.com/gruponuamana/" target="_blank" className="text-white/70 hover:text-clr8 transition-colors"><IconoRRSSInstagram className="w-5 h-5" /></a>
            <a href="https://facebook.com/gruponuamana" target="_blank" className="text-white/70 hover:text-clr8 transition-colors"><IconoRRSSFacebook className="w-5 h-5" /></a>
            <a href="https://wa.me/56966896001" target="_blank" className="text-white/70 hover:text-clr8 transition-colors"><IconoRRSSWhatsApp className="w-5 h-5" /></a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-clr8 font-black uppercase text-[0.8em] tracking-widest hover:text-white transition-colors">
                <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_panel.svg)', maskImage: 'url(/images/iconos/icono_panel.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
                <span>Mi Panel</span>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-clr8 font-black uppercase text-xs tracking-widest hover:text-white transition-colors">
                <IconoAcceso className="w-5 h-5" />
                <span>Acceder</span>
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2.5 bg-white/10 dark:bg-clr4 rounded-2xl text-clr8 hover:bg-clr7 hover:text-white transition-all shadow-lg"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
