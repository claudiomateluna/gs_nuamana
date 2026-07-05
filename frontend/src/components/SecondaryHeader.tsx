'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Menubar from './ui/menu';
import { IconoMenu, IconoAcceso } from './ui/iconos';
import { useTheme } from '@/contexts/theme-context';
import { supabase } from '@/lib/supabase';

const SecondaryHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [title, setTitle] = useState('');

  // Notificaciones
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      '/acerca-de': 'Acerca de',
      '/acerca-de/quienes-somos': 'Quiénes Somos',
      '/acerca-de/nuestra-historia': 'Nuestra Historia',
      '/acerca-de/mision-y-vision': 'Misión y Visión',
      '/acerca-de/nuestro-equipo': 'Nuestro Equipo',
      '/acerca-de/nuestros-apoderados': 'Nuestros Apoderados',
      '/acerca-de/institucion-patrocinante': 'Institución Patrocinante',
      '/lo-que-hacemos': 'Lo que Hacemos',
      '/lo-que-hacemos/ley-y-promesa': 'Ley y Promesa',
      '/lo-que-hacemos/metodo-scout': 'Método Scout',
      '/lo-que-hacemos/aprender-haciendo': 'Aprender Haciendo',
      '/lo-que-hacemos/sistema-de-equipos': 'Sistema de Equipos',
      '/lo-que-hacemos/vida-al-aire-libre': 'Vida al Aire Libre',
      '/lo-que-hacemos/habilidades-y-tecnicas': 'Habilidades y Técnicas',
      '/lo-que-hacemos/vida-reflexiva': 'Vida Reflexiva',
      '/lo-que-hacemos/programa-y-actividades': 'Programa y Actividades',
      '/blog': 'Bitácora Scout',
    };
    
    if (pathname.startsWith('/blog')) {
      setTitle(pageTitles[pathname] || 'Bitácora Scout');
    } else {
      setTitle(pageTitles[pathname] || '');
    }
  }, [pathname]);

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('perfil_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.leido).length);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchNotifications(currentUser.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) fetchNotifications(currentUser.id);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    }
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from('notificaciones').update({ leido: true }).eq('id', id);
    if (user) fetchNotifications(user.id);
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notificaciones').delete().eq('id', id);
    if (user) fetchNotifications(user.id);
  };

  const handleNotifClick = async (notif: any) => {
    if (!notif.leido) {
      await supabase.from('notificaciones').update({ leido: true }).eq('id', notif.id);
      if (user) fetchNotifications(user.id);
    }
    setIsNotificationsOpen(false);
    if (notif.link_url) {
      window.location.href = notif.link_url;
    }
  };

  const getTipoEmoji = (tipo: string) => {
    switch(tipo) {
      case 'progresion': return '🐾';
      case 'inventario': return '📦';
      case 'tesoreria': return '💰';
      case 'ceremonia_etapa': return '🎉';
      case 'ceremonia_promesa': return '⛪';
      case 'ceremonia_paso': return '👣';
      case 'ceremonia': return '🏆';
      case 'perfil': return (
        <div className="w-4 h-4 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_panel.svg)', maskImage: 'url(/images/iconos/icono_panel.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
      );
      default: return '🔔';
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-[90] transition-all duration-500 ${
          isScrolled
            ? 'bg-gradient-to-br from-white/30 via-clr5/20 to-clr7/40 dark:from-clr4 dark:via-clr5 dark:to-clr7/20 backdrop-blur-lg shadow-xl py-1'
            : 'bg-white/60 dark:bg-clr4 py-4'
        }`}
      >
        <div className="max-w-[1080px] mx-auto px-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="border-r-2 border-clr7/30 pr-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-clr7 dark:text-white hover:bg-clr7/10 rounded-xl transition-colors focus:outline-none"
              >
                <IconoMenu className="h-7 w-7" />
              </button>
            </div>
            
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/images/logos/logo-nuamana.webp"
                alt="Logo"
                style={{ height: '60px', width: 'auto' }}
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
              <div className="sm:flex flex-col justify-center">
                <div className="text-[0.8em] md:text-[0.8em] text-clr2 uppercase tracking-widest leading-none mb-[-3px]">Guías y Scouts</div>
                <div className="text-[1em] md:text-[1.5em] text-clr7 dark:text-dclr7 font-black uppercase leading-none tracking-tighter font-inika">Nua Mana</div>
                <div className="text-[0.7em] md:text-[0.85em] text-clr4 dark:text-dclr8 italic leading-none mt-[-6px]">una nueva aventura</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden lg:block text-right">
              <h2 className="text-lg font-black font-display text-clr5 dark:text-clr1 uppercase tracking-widest leading-none">{title}</h2>
            </div>

            <div className="flex items-center gap-1 md:gap-4 border-l border-clr10 dark:border-clr4 pl-6">
              
              {user && (
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-1 bg-clr7/30 dark:bg-clr3 rounded-2xl text-clr5 dark:text-clr8 hover:bg-clr7 hover:text-white transition-all shadow-md group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {user ? (
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-clr5 dark:text-clr8 font-black uppercase text-[0.8em] tracking-widest hover:text-clr7 transition-colors">
                  <div className="w-6 h-6 bg-current" style={{ WebkitMaskImage: 'url(/images/iconos/icono_panel.svg)', maskImage: 'url(/images/iconos/icono_panel.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskPosition: 'center' }}></div>
                  <span>Mi Panel</span>
                </Link>
              ) : (
                <Link href="/login" className="hidden sm:flex items-center gap-2 text-clr5 dark:text-clr8 font-black uppercase text-xs tracking-widest hover:text-clr7 transition-colors">
                  <IconoAcceso className="w-5 h-5" />
                  <span>Acceder</span>
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className="p-1 bg-clr7/30 dark:bg-clr3 rounded-2xl text-clr5 dark:text-clr8 hover:bg-clr7 hover:text-white transition-all shadow-md"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Menubar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </header>

      {/* Drawer de Notificaciones */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNotificationsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="relative w-full max-w-sm bg-zinc-50 dark:bg-clr4 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center bg-white dark:bg-clr5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <h2 className="text-[1.2em] font-black uppercase text-clr5 dark:text-white tracking-widest">Notificaciones</h2>
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-black/20 text-clr5 dark:text-white hover:bg-clr7 hover:text-white transition-all font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center p-10 opacity-50">
                  <span className="text-4xl block mb-2">📭</span>
                  <p className="font-bold uppercase text-[0.8em] tracking-widest">No hay notificaciones</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    onClick={() => handleNotifClick(notif)}
                    className={`p-4 rounded-2xl border-l-4 transition-all cursor-pointer hover:bg-zinc-100 dark:hover:bg-black/20 hover:scale-[1.01] ${
                      notif.leido 
                        ? 'bg-white/50 dark:bg-black/10 border-zinc-300 dark:border-white/10 opacity-70' 
                        : 'bg-white dark:bg-black/30 border-clr7 shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getTipoEmoji(notif.tipo)}</span>
                        <h4 className="font-black text-[0.9em] text-clr5 dark:text-white leading-tight">{notif.titulo}</h4>
                      </div>
                    </div>
                    <p className="text-[0.85em] text-clr2 dark:text-zinc-300 mb-3 leading-snug">{notif.mensaje}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[0.8em] font-bold uppercase opacity-50">
                        {new Date(notif.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                      </span>
                      <div className="flex gap-2">
                        {!notif.leido && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Marcar como leída"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecondaryHeader;
