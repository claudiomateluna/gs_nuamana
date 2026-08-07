'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';
import { supabase } from '@/lib/supabase';
import { getMenuItems } from '@/app/(admin)/actions/get-menu-items';
import { HARDCODED_MENU_TREE } from '@/lib/menu-fallback';
import type { MenuItemNode } from '@/lib/menu-items.types';
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
  IconoRRSSWhatsApp,
  IconoCerrar
} from './iconos';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Minimal shape of the native beforeinstallprompt event (not in lib.dom). */
interface BeforeInstallPromptEventLike {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

/**
 * Icon resolution contract (spec: menu-public-wiring).
 * - `icono` is an iconos.tsx export name → ICON_MAP component.
 * - `icono` is one of the special string values (IconoBlog/IconoUnidades, used by
 *   the MenuManager options and the DB seed but NOT exported from iconos.tsx)
 *   → SPECIAL_ICONS component.
 * - `icono` starts with '/' → rendered as <img> (unit badges).
 * - anything else / null → DefaultIcon.
 */
export const ICON_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
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
};

const BlogIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

const UnidadesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const SPECIAL_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  IconoBlog: BlogIcon,
  IconoUnidades: UnidadesIcon,
};

const DefaultIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

/**
 * Renders a menu item's icon from its `icono` value per the resolution contract.
 * The wrapper carries data-icon-name so tests (and tooling) can assert which
 * icon variant rendered; paths render as <img> with the badge artwork.
 */
function MenuIcon({ icono }: { icono: string | null }) {
  if (icono && icono.startsWith('/')) {
    return <img src={icono} alt="" className="w-8 h-8 mr-4 object-contain" />;
  }
  const Icon = (icono ? SPECIAL_ICONS[icono] ?? ICON_MAP[icono] : null) ?? DefaultIcon;
  return (
    <span data-icon-name={icono ?? 'default'} className="w-8 h-8 mr-4 flex items-center justify-center text-clr7">
      <Icon className="w-8 h-8" />
    </span>
  );
}

const SidebarDrawer = ({ isOpen, onClose }: SidebarDrawerProps) => {
  const router = useRouter();
  // null = main view; a root node = its sub-view (drawer UX preserved).
  const [currentView, setCurrentView] = useState<MenuItemNode | null>(null);
  // Start from today's sidebar; the DB tree replaces it once loaded (if any),
  // otherwise the fallback stays (empty DB → HARDCODED_MENU_TREE).
  const [menuItems, setMenuItems] = useState<MenuItemNode[]>(HARDCODED_MENU_TREE);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEventLike | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIOSHelper, setShowIOSHelper] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as BeforeInstallPromptEventLike);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar si es iOS y no está instalado
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone;
    
    if (isIOS && !isStandalone) {
      setShowIOSHelper(true);
    }

    if (isStandalone) {
      setIsInstallable(false);
    }

    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    // Obtener sesión y menú filtrado por rol (solo al abrir el drawer)
    if (isOpen) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        // The action derives the rol server-side from the access token; the
        // client never sends a role. Fallback to HARDCODED_MENU_TREE ONLY on a
        // truly empty DB — a DB with rows but nothing visible to this rol must
        // render an empty menu, never the hardcoded tree.
        const result = await getMenuItems(session?.access_token ?? null);
        setMenuItems(result.items.length > 0 ? result.items : result.dbEmpty ? HARDCODED_MENU_TREE : []);
        setCurrentView(null);
      });
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleRootClick = (item: MenuItemNode) => {
    if (item.children.length > 0) {
      setCurrentView(item);
    } else if (item.href) {
      router.push(item.href);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className={`bg-gradient-to-b from-clr1 dark:from-dclr5 to-clr2/80 dark:to-dclr7/80 fixed top-0 left-0 h-screen w-[280px] sm:w-[320px] z-[10000] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-2 border-b border-clr10 dark:border-dclr10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {currentView !== null && (
                  <button onClick={() => setCurrentView(null)} aria-label="Volver al menú principal" className="mr-1 p-1 rounded-full hover:bg-clr10/50 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5 text-clr5 dark:text-dclr2" />
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
                      <div className="text-clr4 dark:text-dclr2 text-[0.85em] uppercase leading-none mb-[-2px]">Guías y Scouts</div>
                      <div className="text-clr7 dark:text-dclr7 text-[1.25em] font-black uppercase leading-none font-inika">Nua Mana</div>
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
            {currentView === null ? (
              <nav className="space-y-2" aria-label="Menú principal">
                {menuItems.map((item) => (
                  <button key={item.id} onClick={() => handleRootClick(item)} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                    <MenuIcon icono={item.icono} />
                    <span className="font-bold text-clr5 dark:text-dclr2 group-hover:text-clr7">{item.titulo}</span>
                  </button>
                ))}
              </nav>
            ) : (
              <nav className="space-y-1" aria-label={currentView.titulo}>
                <h3 className="px-3 mb-4 text-[0.8em] font-black uppercase tracking-widest text-clr2">{currentView.titulo}</h3>
                {currentView.children.map((item) => (
                  <button key={item.id} onClick={() => { router.push(item.href ?? '/'); onClose(); }} className="flex items-center w-full p-3 rounded-2xl hover:bg-clr7/5 transition-all group">
                    <MenuIcon icono={item.icono} />
                    <span className="font-bold text-clr5 dark:text-dclr2 group-hover:text-clr7">{item.titulo}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>

          <div className="p-6 border-t border-clr10 dark:border-dclr10 bg-white/50 dark:bg-black/20">
            {isInstallable && (
              <button 
                onClick={handleInstallClick} 
                className="w-full py-3 mb-4 bg-clr6 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 text-[0.9em]"
              >
                Instalar Aplicación
              </button>
            )}
            {showIOSHelper && (
              <div className="w-full p-4 mb-4 bg-white/40 dark:bg-black/20 border border-clr10 dark:border-dclr10 rounded-2xl text-[0.85em] text-clr5 dark:text-dclr2 flex flex-col gap-2 shadow-inner">
                <div className="font-black text-clr7 flex items-center gap-1.5 uppercase tracking-wide">📲 Instalar en tu iPhone</div>
                <p className="text-clr2 dark:text-dclr8 leading-snug">
                  Presioná el botón de <strong>Compartir</strong> <span className="inline-block px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">📤</span> en Safari y seleccioná <strong>&quot;Agregar al inicio&quot;</strong> ➕.
                </p>
              </div>
            )}
            {user ? (
              <button onClick={() => { router.push('/panel'); onClose(); }} className="w-full p-2 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 transition-all mb-6 flex items-center justify-between gap-2">
                <div className="w-12 h-12 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_mi_panel.svg)', maskImage: 'url(/images/iconos/icono_mi_panel.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
                 Mi Panel Personal
              </button>
            ) : (
              <button onClick={() => { router.push('/login'); onClose(); }} className="w-full py-4 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 transition-all mb-6">
                Acceder
              </button>
            )}
            <div className="flex justify-between px-2">
              <a href="https://instagram.com/gruponuamana" className="text-clr5 dark:text-dclr2 hover:text-clr7 transition-colors"><IconoRRSSInstagram className="w-5 h-5" /></a>
              <a href="https://facebook.com/gruponuamana" className="text-clr5 dark:text-dclr2 hover:text-clr7 transition-colors"><IconoRRSSFacebook className="w-5 h-5" /></a>
              <a href="https://youtube.com/@gruponuamana" className="text-clr5 dark:text-dclr2 hover:text-clr7 transition-colors"><IconoRRSSYoutube className="w-5 h-5" /></a>
              <a href="https://tiktok.com/@gruponuamana" className="text-clr5 dark:text-dclr2 hover:text-clr7 transition-colors"><IconoRRSSTiktok className="w-5 h-5" /></a>
              <a href="https://wa.me/+56966896001" className="text-clr5 dark:text-dclr2 hover:text-clr7 transition-colors"><IconoRRSSWhatsApp className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDrawer;
