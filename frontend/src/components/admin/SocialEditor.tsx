'use client';

/**
 * SocialEditor — Interactive social media network editor.
 *
 * Card-based UI: each social network shows icon, editable name, editable URL,
 * placement checkboxes (Header / Menú / Footer), toggle, and delete.
 * Adding a network offers an icon grid picker + name/URL fields.
 * Changes save immediately via saveSiteConfig.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSiteConfigSafe } from '@/contexts/site-config-context';
import { supabase } from '@/lib/supabase';
import { saveSiteConfig } from '@/app/(admin)/actions/save-site-config';
import { toast } from 'sonner';
import {
  IconoRRSSInstagram,
  IconoRRSSFacebook,
  IconoRRSSWhatsApp,
  IconoRRSSYoutube,
  IconoRRSSTiktok,
  IconoRRSSGoogle,
  IconoRRSSEmail,
} from '@/components/ui/iconos';
import React from 'react';
import type { SocialItem } from '@/lib/site-config.types';

// ---------------------------------------------------------------------------
// Available icon presets
// ---------------------------------------------------------------------------

const ICON_PRESETS: { icon: string; label: string; defaultUrl: string }[] = [
  { icon: 'instagram', label: 'Instagram', defaultUrl: 'https://instagram.com/' },
  { icon: 'facebook', label: 'Facebook', defaultUrl: 'https://facebook.com/' },
  { icon: 'whatsapp', label: 'WhatsApp', defaultUrl: 'https://wa.me/' },
  { icon: 'youtube', label: 'YouTube', defaultUrl: 'https://youtube.com/' },
  { icon: 'tiktok', label: 'TikTok', defaultUrl: 'https://tiktok.com/' },
  { icon: 'google', label: 'Google', defaultUrl: 'https://google.com/search?q=' },
  { icon: 'email', label: 'Email', defaultUrl: 'mailto:' },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: IconoRRSSInstagram,
  facebook: IconoRRSSFacebook,
  whatsapp: IconoRRSSWhatsApp,
  youtube: IconoRRSSYoutube,
  tiktok: IconoRRSSTiktok,
  google: IconoRRSSGoogle,
  email: IconoRRSSEmail,
};

const ZONES = [
  { key: 'header', label: 'Header', color: 'blue' as const },
  { key: 'menu', label: 'Menú', color: 'green' as const },
  { key: 'footer', label: 'Footer', color: 'purple' as const },
] as const;

/** Sensible placement defaults for items that don't have one yet (migration). */
function defaultPlacement(icon: string): string {
  const defaults: Record<string, string> = {
    instagram: 'header,menu,footer',
    facebook: 'header,menu,footer',
    whatsapp: 'header,menu,footer',
    youtube: 'menu,footer',
    tiktok: 'menu,footer',
    google: 'menu,footer',
    email: 'footer',
  };
  return defaults[icon] ?? 'footer';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SocialEditor() {
  const config = useSiteConfigSafe();
  const configItems: SocialItem[] = config?.social_list?.items ?? [];

  // Local state — initialized from config, updated optimistically
  const [items, setItems] = useState<SocialItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  // New-item form state
  const [newIcon, setNewIcon] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPlacement, setNewPlacement] = useState('footer');

  // Sync from config when it arrives/changes
  useEffect(() => {
    setItems(
      configItems.map((it) => ({
        ...it,
        placement: it.placement || defaultPlacement(it.icon),
      })),
    );
  }, [JSON.stringify(configItems)]);

  /** Persist the full items array to social_list.items (debounced, single-flight) */
  const pendingItemsRef = useRef<SocialItem[] | null>(null);
  const savingRef = useRef(false);

  const persist = useCallback(async (nextItems: SocialItem[]) => {
    pendingItemsRef.current = nextItems;
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    try {
      while (pendingItemsRef.current) {
        const itemsToSave = pendingItemsRef.current;
        pendingItemsRef.current = null;

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) {
          toast.error('Sesión expirada. Recargá la página.');
          return;
        }
        const result = await saveSiteConfig('social_list', { items: itemsToSave }, token);
        if (!result.success) {
          toast.error('Error al guardar: ' + (result.errors?.join(', ') || 'Error desconocido'));
          setItems(configItems.map(it => ({
            ...it,
            placement: it.placement || defaultPlacement(it.icon),
          })));
        }
      }
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [configItems]);

  // ---- Item handlers ----

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const item: SocialItem = {
      id: crypto.randomUUID(),
      icon: newIcon || 'link',
      label: newLabel.trim(),
      url: newUrl.trim() || 'https://',
      enabled: true,
      order: items.length + 1,
      placement: newPlacement,
    };
    const next = [...items, item];
    setItems(next);
    persist(next);
    resetNewForm();
  };

  const resetNewForm = () => {
    setShowAdd(false);
    setNewIcon('');
    setNewLabel('');
    setNewUrl('');
    setNewPlacement('footer');
  };

  const handleRemove = (index: number) => {
    const next = items
      .filter((_, i) => i !== index)
      .map((it, i) => ({ ...it, order: i + 1 }));
    setItems(next);
    persist(next);
  };

  const handleToggle = (index: number) => {
    const next = items.map((it, i) =>
      i === index ? { ...it, enabled: !it.enabled } : it,
    );
    setItems(next);
    persist(next);
  };

  const handleLabelChange = (index: number, label: string) => {
    setItems(items.map((it, i) => (i === index ? { ...it, label } : it)));
  };

  const handleUrlChange = (index: number, url: string) => {
    setItems(items.map((it, i) => (i === index ? { ...it, url } : it)));
  };

  const commitEdits = () => persist(items);

  const handlePlacementToggle = (index: number, zone: string) => {
    const item = items[index];
    const current = (item.placement || '').split(',').filter(Boolean);
    const next = current.includes(zone)
      ? current.filter((z) => z !== zone)
      : [...current, zone];
    const nextItems = items.map((it, i) =>
      i === index ? { ...it, placement: next.join(',') } : it,
    );
    setItems(nextItems);
    persist(nextItems);
  };

  // Pick icon from preset grid
  const handlePickIcon = (icon: string, label: string, defaultUrl: string) => {
    setNewIcon(icon);
    setNewLabel(label);
    setNewUrl(defaultUrl);
  };

  return (
    <div className="space-y-3">
      {/* Legend */}
      <p className="px-1 text-xs text-gray-500 dark:text-gray-400">
        Seleccioná en qué secciones aparece cada red social.
      </p>

      {/* ---- Item cards ---- */}
      {items.map((item, index) => {
        const IconComp = ICON_MAP[item.icon];
        const placement = (item.placement || '').split(',').filter(Boolean);
        return (
          <div
            key={item.id || `${item.icon}-${index}`}
            className={`rounded-xl border p-3 transition-opacity ${
              item.enabled
                ? 'bg-clr1 dark:bg-dclr1 border-clr7 dark:border-dclr7'
                : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 opacity-50'
            }`}
          >
            {/* Row 1: Icon + Name + Toggle + Delete */}
            <div className="flex items-center gap-3">
              {/* Order */}
              <div className="w-8 h-8 flex items-center justify-center bg-clr7 dark:bg-dclr7 text-clr2 dark:text-dclr2 rounded-lg text-xs font-bold shrink-0">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-10 h-10 flex items-center justify-center bg-tclr1 dark:bg-tdclr1 rounded-lg shrink-0">
                {IconComp ? (
                  <IconComp className="w-5 h-5 text-clr3 dark:text-dclr3" />
                ) : (
                  <span className="text-lg">🔗</span>
                )}
              </div>

              {/* Name (editable) */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  onBlur={commitEdits}
                  className="w-full text-sm font-bold text-clr2 dark:text-dclr2 bg-transparent border-b border-transparent hover:border-clr4 focus:border-clr4 outline-none uppercase tracking-wider"
                  placeholder="Nombre de la red"
                />
              </div>

              {/* Toggle ON/OFF */}
              <button
                type="button"
                onClick={() => handleToggle(index)}
                disabled={saving}
                aria-label={`${item.enabled ? 'Desactivar' : 'Activar'} ${item.label}`}
                aria-pressed={item.enabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                  item.enabled ? 'bg-green-500' : 'bg-clr7 dark:bg-dclr7'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    item.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={saving}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                title={`Eliminar ${item.label}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Row 2: URL */}
            <div className="mt-2 ml-[3.25rem]">
              <input
                type="url"
                value={item.url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                onBlur={commitEdits}
                className="w-full text-sm text-clr2 dark:text-dclr2 bg-clr1 dark:bg-dclr1 border border-clr4 dark:border-dclr4 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-clr4 focus:border-transparent outline-none"
                placeholder="https://..."
              />
            </div>

            {/* Row 3: Placement checkboxes */}
            {item.enabled && (
              <div className="mt-2 ml-[3.25rem] flex items-center gap-2">
                {ZONES.map((zone) => {
                  const active = placement.includes(zone.key);
                  return (
                    <button
                      key={zone.key}
                      type="button"
                      onClick={() => handlePlacementToggle(index, zone.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors select-none ${
                        active
                          ? zone.color === 'blue'
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : zone.color === 'green'
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                              : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                          : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {active ? '✓' : '○'} {zone.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ---- Add form ---- */}
      {!showAdd ? (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="w-full p-3 border-2 border-dashed border-clr7 dark:border-dclr7 rounded-xl text-clr3 dark:text-dclr3 hover:border-clr4 hover:text-clr4 transition-colors text-sm font-black uppercase tracking-widest"
        >
          + Agregar Red Social
        </button>
      ) : (
        <div className="rounded-xl border border-clr7 dark:border-dclr7 bg-clr1 dark:bg-dclr1 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-clr2 dark:text-dclr2 uppercase">Nueva red social</span>
            <button type="button" onClick={resetNewForm} className="text-clr3 hover:text-red-500 text-sm">✕ Cancelar</button>
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Icono</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {ICON_PRESETS.map((preset) => {
                const Comp = ICON_MAP[preset.icon];
                return (
                  <button
                    key={preset.icon}
                    type="button"
                    onClick={() => handlePickIcon(preset.icon, preset.label, preset.defaultUrl)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                      newIcon === preset.icon
                        ? 'border-clr4 dark:border-dclr4 bg-tclr1 dark:bg-tdclr1 ring-2 ring-clr4'
                        : 'border-clr7 dark:border-dclr7 hover:border-clr4'
                    }`}
                    title={preset.label}
                  >
                    {Comp && <Comp className="w-5 h-5 text-clr2 dark:text-dclr2" />}
                  </button>
                );
              })}
              {/* Custom icon */}
              <button
                type="button"
                onClick={() => { setNewIcon('link'); setNewLabel(''); setNewUrl('https://'); }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors text-lg ${
                  newIcon === 'link'
                    ? 'border-clr4 dark:border-dclr4 bg-tclr1 dark:bg-tdclr1 ring-2 ring-clr4'
                    : 'border-clr7 dark:border-dclr7 hover:border-clr4'
                }`}
                title="Icono personalizado"
              >
                🔗
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nombre</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full text-sm text-clr2 dark:text-dclr2 bg-clr1 dark:bg-dclr1 border border-clr4 dark:border-dclr4 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-clr4 outline-none mt-1"
              placeholder="Nombre de la red"
            />
          </div>

          {/* URL */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">URL</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full text-sm text-clr2 dark:text-dclr2 bg-clr1 dark:bg-dclr1 border border-clr4 dark:border-dclr4 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-clr4 outline-none mt-1"
              placeholder="https://..."
            />
          </div>

          {/* Placement */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mostrar en</label>
            <div className="flex items-center gap-2 mt-1">
              {ZONES.map((zone) => {
                const active = newPlacement.split(',').includes(zone.key);
                return (
                  <button
                    key={zone.key}
                    type="button"
                    onClick={() => {
                      const current = newPlacement.split(',').filter(Boolean);
                      const next = active ? current.filter((z) => z !== zone.key) : [...current, zone.key];
                      setNewPlacement(next.join(','));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors select-none ${
                      active
                        ? zone.color === 'blue'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : zone.color === 'green'
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                            : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {active ? '✓' : '○'} {zone.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newLabel.trim()}
            className="w-full py-2 rounded-lg bg-clr4 dark:bg-dclr4 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Agregar
          </button>
        </div>
      )}
    </div>
  );
}
