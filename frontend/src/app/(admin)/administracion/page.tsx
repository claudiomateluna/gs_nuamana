/**
 * Administracion Page
 * Client component with auth guard (same pattern as /panel).
 * Only rol_id = 1 (Admin) can access.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Rol } from '@/lib/roles';
import { loadSiteConfig, DEFAULT_SITE_CONFIG } from '@/lib/site-config';
import SecondaryHeader from '@/components/SecondaryHeader';
import SiteConfigForm from '@/components/admin/SiteConfigForm';
import MenuManager from '@/components/admin/MenuManager';
import type { SiteConfigRecord, SiteConfigCategory } from '@/lib/site-config.types';
import type { MenuItem } from '@/lib/menu-items.types';

type AdminTab = 'config' | 'menu';

const CATEGORIES = [
  { id: 'branding' as SiteConfigCategory, label: 'Branding', icon: '🎨' },
  { id: 'social' as SiteConfigCategory, label: 'Social', icon: '📱' },
  { id: 'contact' as SiteConfigCategory, label: 'Contacto', icon: '📍' },
  { id: 'hero' as SiteConfigCategory, label: 'Hero', icon: '🖼️' },
  { id: 'features' as SiteConfigCategory, label: 'Features', icon: '⭐' },
  { id: 'faq' as SiteConfigCategory, label: 'FAQ', icon: '❓' },
  { id: 'testimonials' as SiteConfigCategory, label: 'Testimonios', icon: '💬' },
  { id: 'visit' as SiteConfigCategory, label: 'Visita', icon: '🚪' },
  { id: 'seo' as SiteConfigCategory, label: 'SEO', icon: '🔍' },
  { id: 'pwa' as SiteConfigCategory, label: 'PWA', icon: '📲' },
  { id: 'navigation' as SiteConfigCategory, label: 'Navegacion', icon: '🧭' },
];

export default function AdministracionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [config, setConfig] = useState<SiteConfigRecord>(DEFAULT_SITE_CONFIG);
  const [adminTab, setAdminTab] = useState<AdminTab>('config');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenuItems = async () => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .order('orden');
    if (data) setMenuItems(data as MenuItem[]);
  };

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol_id')
        .eq('id', session.user.id)
        .single();

      if (!perfil || perfil.rol_id !== Rol.Admin) { router.push('/panel'); return; }

      try {
        const loaded = await loadSiteConfig();
        setConfig(loaded);
      } catch { setConfig(DEFAULT_SITE_CONFIG); }

      await fetchMenuItems();
      setAuthorized(true);
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body transition-colors">
        <SecondaryHeader />
        <div className="max-w-[1080px] mx-auto px-4 pt-32 pb-16 text-center font-body text-clr2 italic tracking-widest uppercase text-[0.8em]">
          Cargando administración...
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body transition-colors">
      <SecondaryHeader />
      <main className="max-w-[1080px] mx-auto px-4 pt-32 pb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black font-display text-clr5 dark:text-clr1 uppercase tracking-tighter">
            Administración del Sitio
          </h1>
          <p className="text-sm text-clr2 font-bold uppercase tracking-widest mt-2">
            Configuración general de la plataforma
          </p>
        </div>

        {/* Top-level tabs: Config / Menu */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAdminTab('config')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              adminTab === 'config'
                ? 'bg-clr7 text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-zinc-800 text-clr2 hover:text-clr5'
            }`}
          >
            ⚙️ Configuración
          </button>
          <button
            onClick={() => setAdminTab('menu')}
            className={`px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              adminTab === 'menu'
                ? 'bg-clr7 text-white shadow-lg'
                : 'bg-zinc-100 dark:bg-zinc-800 text-clr2 hover:text-clr5'
            }`}
          >
            📋 Menú de Navegación
          </button>
        </div>

        {/* Tab content */}
        {adminTab === 'config' && (
          <SiteConfigForm config={config} categories={CATEGORIES} />
        )}

        {adminTab === 'menu' && (
          <div className="bg-gradient-to-br from-white/30 via-clr5/20 to-clr7/40 dark:from-clr4 dark:via-clr5 dark:to-clr7/20 rounded-[1rem] p-4 md:p-6 shadow-2xl border border-clr10 dark:border-clr4">
            <h2 className="text-xl font-black font-display text-clr5 dark:text-clr1 uppercase tracking-tighter mb-4">
              Menú de Navegación
            </h2>
            <p className="text-xs text-clr2 mb-6">
              Administra los ítems del menú lateral. Los cambios se reflejan inmediatamente en el sitio.
            </p>
            <MenuManager items={menuItems} onUpdate={fetchMenuItems} />
          </div>
        )}
      </main>
    </div>
  );
}
