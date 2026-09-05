'use client';

/**
 * MenuManager — Admin component for CRUD on menu_items.
 * Features: hierarchical list, reorder, edit, delete, visibility toggle,
 * SVG icon upload, and role-based access control.
 */

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { uploadMenuIcon } from '@/app/(admin)/actions/upload-menu-icon';
import type { MenuItem } from '@/lib/menu-items.types';
import { MENU_ROLE_OPTIONS } from '@/lib/menu-items.types';

// Available icon identifiers (matching iconos.tsx exports)
const ICON_OPTIONS = [
  { value: 'IconoInicio', label: '🏠 Inicio' },
  { value: 'IconoAcercaDe', label: 'ℹ️ Acerca de' },
  { value: 'IconoLoQueHacemos', label: '📋 Lo que hacemos' },
  { value: 'IconoBlog', label: '📰 Blog' },
  { value: 'IconoUnidades', label: '👥 Unidades' },
  { value: 'IconoAcercaDeQuienesSomos', label: '🤝 Quiénes Somos' },
  { value: 'IconoAcercaDeNuestraHistoria', label: '📖 Historia' },
  { value: 'IconoAcercaDeMisionVision', label: '🎯 Misión' },
  { value: 'IconoAcercaDeNuestroEquipo', label: '👨‍👩‍👧‍👦 Equipo' },
  { value: 'IconoAcercaDeNuestrosApoderados', label: '👪 Apoderados' },
  { value: 'IconoAcercaDeInstitucionPatrocinante', label: '🏛️ Institución' },
  { value: 'IconoLoQueHacemosMetodoScout', label: '🧭 Método Scout' },
  { value: 'IconoLoQueHacemosAireLibre', label: '🌲 Aire Libre' },
  { value: 'IconoLoQueHacemosAprenderHaciendo', label: '🔨 Aprender Haciendo' },
  { value: 'IconoLoQueHacemosHabilidadesTecnicas', label: '🔧 Habilidades' },
  { value: 'IconoLoQueHacemosProgramasActividades', label: '🎯 Programas' },
  { value: 'IconoLoQueHacemosSistemaEquipos', label: '⚔️ Sistema Equipos' },
  { value: 'IconoLoQueHacemosVidaReflexiva', label: '🧘 Vida Reflexiva' },
];

// Images for Unidades icons
const UNIDAD_ICONS = [
  { value: '/images/logos/iconos_lobatos.svg', label: '🐾 Lobatos' },
  { value: '/images/logos/iconos_guias.svg', label: '🦋 Guías' },
  { value: '/images/logos/iconos_scouts.svg', label: '🏕️ Scouts' },
  { value: '/images/logos/iconos_pioneres.svg', label: '⛰️ Pioneros' },
  { value: '/images/logos/iconos_caminantes.svg', label: '🥾 Caminantes' },
];

interface MenuManagerProps {
  items: MenuItem[];
  onUpdate: () => void;
}

export default function MenuManager({ items, onUpdate }: MenuManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formTitulo, setFormTitulo] = useState('');
  const [formHref, setFormHref] = useState('');
  const [formIcono, setFormIcono] = useState('');
  const [formParentId, setFormParentId] = useState<string | null>(null);
  const [formRoles, setFormRoles] = useState<string[]>([]);

  // Build tree for display
  const roots = items.filter(i => !i.parent_id).sort((a, b) => a.orden - b.orden);
  const getChildren = (parentId: string) =>
    items.filter(i => i.parent_id === parentId).sort((a, b) => a.orden - b.orden);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // --- SVG Upload ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); setUploading(false); return; }

    const result = await uploadMenuIcon(formData, token);
    setUploading(false);

    if (result.success && result.path) {
      setFormIcono(result.path);
      toast.success('Ícono subido: ' + result.path);
    } else {
      toast.error(result.error || 'Error al subir');
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Role toggles ---
  const toggleRole = (role: string) => {
    setFormRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  // --- CRUD Operations ---
  const handleAdd = async () => {
    if (!formTitulo.trim()) { toast.error('El título es obligatorio'); return; }
    setSaving(true);
    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); setSaving(false); return; }

    const siblings = formParentId
      ? items.filter(i => i.parent_id === formParentId)
      : items.filter(i => !i.parent_id);

    const newOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.orden)) + 1 : 1;

    const { error } = await supabase
      .from('menu_items')
      .insert({
        titulo: formTitulo.trim(),
        href: formHref.trim() || null,
        icono: formIcono || null,
        parent_id: formParentId || null,
        orden: newOrder,
        visible: true,
        roles_permitidos: formRoles,
      });

    setSaving(false);
    if (error) { toast.error('Error al crear: ' + error.message); return; }
    toast.success('Item creado');
    resetForm();
    onUpdate();
  };

  const handleUpdate = async (id: string) => {
    if (!formTitulo.trim()) { toast.error('El título es obligatorio'); return; }
    setSaving(true);
    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); setSaving(false); return; }

    const { error } = await supabase
      .from('menu_items')
      .update({
        titulo: formTitulo.trim(),
        href: formHref.trim() || null,
        icono: formIcono || null,
        roles_permitidos: formRoles,
      })
      .eq('id', id);

    setSaving(false);
    if (error) { toast.error('Error al actualizar: ' + error.message); return; }
    toast.success('Item actualizado');
    resetForm();
    onUpdate();
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar "${titulo}" y todos sus sub-items?`)) return;
    setSaving(true);
    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); setSaving(false); return; }

    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    setSaving(false);
    if (error) { toast.error('Error al eliminar: ' + error.message); return; }
    toast.success('Item eliminado');
    onUpdate();
  };

  const handleToggleVisible = async (id: string, currentVisible: boolean) => {
    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); return; }

    const { error } = await supabase
      .from('menu_items')
      .update({ visible: !currentVisible })
      .eq('id', id);

    if (error) { toast.error('Error al cambiar visibilidad'); return; }
    onUpdate();
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const siblings = item.parent_id
      ? items.filter(i => i.parent_id === item.parent_id)
      : items.filter(i => !i.parent_id);

    const sorted = [...siblings].sort((a, b) => a.orden - b.orden);
    const idx = sorted.findIndex(i => i.id === id);

    if (direction === 'up' && idx > 0) {
      const other = sorted[idx - 1];
      await swapOrder(id, other.id, item.orden, other.orden);
    } else if (direction === 'down' && idx < sorted.length - 1) {
      const other = sorted[idx + 1];
      await swapOrder(id, other.id, item.orden, other.orden);
    }
  };

  const swapOrder = async (id1: string, id2: string, order1: number, order2: number) => {
    const token = await getToken();
    if (!token) return;

    await supabase.from('menu_items').update({ orden: order2 }).eq('id', id1);
    await supabase.from('menu_items').update({ orden: order1 }).eq('id', id2);
    onUpdate();
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(null);
    setFormTitulo('');
    setFormHref('');
    setFormIcono('');
    setFormParentId(null);
    setFormRoles([]);
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setShowAddForm(null);
    setFormTitulo(item.titulo);
    setFormHref(item.href || '');
    setFormIcono(item.icono || '');
    setFormParentId(item.parent_id);
    setFormRoles(item.roles_permitidos || []);
  };

  const startAdd = (parentId: string | null) => {
    setShowAddForm(parentId === null ? 'root' : parentId);
    setEditingId(null);
    setFormTitulo('');
    setFormHref('');
    setFormIcono('');
    setFormParentId(parentId);
    setFormRoles([]);
  };

  // Group role options by group
  const groupedRoles = MENU_ROLE_OPTIONS.reduce((acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = [];
    acc[opt.group].push(opt);
    return acc;
  }, {} as Record<string, typeof MENU_ROLE_OPTIONS>);

  // Format roles for display
  const formatRoles = (roles: string[]) => {
    if (!roles || roles.length === 0) return '🌐 Todos';
    return roles.map(r => MENU_ROLE_OPTIONS.find(o => o.value === r)?.label || r).join(', ');
  };

  // Render a single item row
  const renderItem = (item: MenuItem, depth: number = 0) => {
    const children = getChildren(item.id);
    const isEditing = editingId === item.id;
    const isAddingChild = showAddForm === item.id;
    const hasRoles = item.roles_permitidos && item.roles_permitidos.length > 0;

    return (
      <div key={item.id} className={`${depth > 0 ? 'ml-6 border-l-2 border-clr7 dark:border-dclr7 pl-3' : ''}`}>
        <div className={`flex items-center gap-2 p-2 rounded-xl mb-1 group transition-all ${!item.visible ? 'opacity-40' : ''} ${isEditing ? 'bg-clr4 ring-1 ring-clr4' : 'hover:bg-clr1 dark:hover:bg-clr1'}`}>
          {/* Reorder buttons */}
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => handleMove(item.id, 'up')} className="text-clr3 hover:text-clr4 text-xs" title="Subir">▲</button>
            <button onClick={() => handleMove(item.id, 'down')} className="text-clr3 hover:text-clr4 text-xs" title="Bajar">▼</button>
          </div>

          {/* Icon */}
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            {item.icono ? (
              item.icono.startsWith('/') ? (
                <img src={item.icono} alt="" className="w-5 h-5 object-contain" />
              ) : (
                <span className="text-xs text-clr3" title={item.icono}>⬡</span>
              )
            ) : (
              <span className="text-xs text-clr3">—</span>
            )}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <span className={`font-bold text-sm ${depth === 0 ? 'text-clr4 dark:text-dclr2 uppercase' : 'text-clr2 dark:text-dclr2'}`}>
              {item.titulo}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              {item.href && (
                <span className="text-xs text-clr3 truncate">{item.href}</span>
              )}
              {hasRoles && (
                <span className="text-[0.65em] text-clr4 bg-clr4 px-1.5 py-0.5 rounded-full font-bold truncate max-w-[200px]" title={formatRoles(item.roles_permitidos)}>
                  🔒 {formatRoles(item.roles_permitidos)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleToggleVisible(item.id, item.visible)}
              className={`p-1 rounded-lg text-xs transition-colors ${item.visible ? 'text-clr6 hover:bg-clr6' : 'text-clr3 hover:bg-clr7'}`}
              title={item.visible ? 'Ocultar' : 'Mostrar'}
            >
              {item.visible ? '👁️' : '🚫'}
            </button>
            <button
              onClick={() => startAdd(item.id)}
              className="p-1 rounded-lg text-clr3 hover:text-clr4 hover:bg-clr7 text-xs"
              title="Agregar sub-item"
            >
              ➕
            </button>
            <button
              onClick={() => startEdit(item)}
              className="p-1 rounded-lg text-clr3 hover:text-clr4 hover:bg-clr7 text-xs"
              title="Editar"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(item.id, item.titulo)}
              className="p-1 rounded-lg text-clr3 hover:text-clr4 hover:bg-clr4 text-xs"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Inline edit/add form */}
        {isEditing && renderForm('update')}
        {isAddingChild && renderForm('add')}

        {/* Children */}
        {children.length > 0 && (
          <div>
            {children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderForm = (mode: 'add' | 'update') => (
    <div className="ml-8 mb-3 p-4 bg-clr1 dark:bg-dclr1 rounded-2xl border border-clr7 dark:border-dclr7 space-y-3">
      {/* Title */}
      <input
        type="text"
        placeholder="Título *"
        value={formTitulo}
        onChange={e => setFormTitulo(e.target.value)}
        className="w-full bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-clr4"
      />

      {/* Href */}
      <input
        type="text"
        placeholder="Ruta (href) — ej: /acerca-de/nueva-pagina"
        value={formHref}
        onChange={e => setFormHref(e.target.value)}
        className="w-full bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm outline-none focus:border-clr4"
      />

      {/* Icon selector */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-clr3">Ícono</label>
        <select
          value={formIcono.startsWith('/images/') ? '__custom__' : formIcono}
          onChange={e => {
            if (e.target.value !== '__custom__') {
              setFormIcono(e.target.value);
            }
          }}
          className="w-full bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm outline-none focus:border-clr4"
        >
          <option value="">Sin ícono</option>
          <optgroup label="Íconos SVG">
            {ICON_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
          <optgroup label="Íconos de Unidades">
            {UNIDAD_ICONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </optgroup>
          {formIcono.startsWith('/images/') && !UNIDAD_ICONS.some(u => u.value === formIcono) && (
            <option value="__custom__">📤 Personalizado: {formIcono}</option>
          )}
        </select>

        {/* SVG Upload */}
        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-clr1 dark:bg-dclr1 border border-dashed border-clr7 dark:border-dclr7 rounded-xl text-xs font-bold text-clr3 hover:border-clr4 hover:text-clr4 cursor-pointer transition-all">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            {uploading ? '⏳ Subiendo...' : '📤 Subir SVG personalizado'}
          </label>
          {formIcono && (
            <button
              onClick={() => setFormIcono('')}
              className="px-2 py-2 text-xs text-clr3 hover:text-clr4"
              title="Quitar ícono"
            >
              ✕
            </button>
          )}
        </div>
        {formIcono && (
          <div className="flex items-center gap-2 p-2 bg-clr1 dark:bg-dclr1 rounded-xl">
            {formIcono.startsWith('/') ? (
              <img src={formIcono} alt="" className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-sm">⬡</span>
            )}
            <span className="text-xs text-clr3 truncate">{formIcono}</span>
          </div>
        )}
      </div>

      {/* Role restrictions */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-clr3">
          Restricción por rol {formRoles.length === 0 && <span className="font-normal">(vacío = visible para todos)</span>}
        </label>
        <div className="bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl p-3 space-y-3 max-h-48 overflow-y-auto">
          {Object.entries(groupedRoles).map(([group, options]) => (
            <div key={group}>
              <div className="text-[0.65em] font-black uppercase tracking-widest text-clr3 mb-1">{group}</div>
              <div className="flex flex-wrap gap-1">
                {options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => toggleRole(opt.value)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                      formRoles.includes(opt.value)
                        ? 'bg-clr4 text-clr1'
                        : 'bg-clr1 dark:bg-dclr1 text-clr3 hover:text-clr4'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {formRoles.length > 0 && (
          <p className="text-[0.65em] text-clr3">
            Visible solo para: {formRoles.map(r => MENU_ROLE_OPTIONS.find(o => o.value === r)?.label).join(', ')}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-2">
        <button
          onClick={() => mode === 'add' ? handleAdd() : handleUpdate(editingId!)}
          disabled={saving}
          className="flex-1 py-2 bg-clr4 text-clr1 font-black text-xs uppercase rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : mode === 'add' ? 'Agregar' : 'Guardar'}
        </button>
        <button
          onClick={resetForm}
          className="px-4 py-2 bg-clr1 dark:bg-dclr1 text-clr4 dark:text-dclr4 font-bold text-xs uppercase rounded-xl hover:bg-clr3 transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-clr3">
          {items.length} items · ▲▼ reordenar · 👁️ ocultar · 🔒 restringir por rol
        </p>
        <button
          onClick={() => startAdd(null)}
          className="px-4 py-2 bg-clr4 text-clr1 font-black text-xs uppercase rounded-xl hover:brightness-110 transition-all"
        >
          + Agregar al menú
        </button>
      </div>

      {/* Add form at root level */}
      {showAddForm === 'root' && renderForm('add')}

      {/* Menu tree */}
      <div className="bg-clr1 dark:bg-dclr1 rounded-2xl border border-clr7 dark:border-dclr7 p-4">
        {roots.map(item => renderItem(item))}
      </div>

      {/* Available icons reference */}
      <details className="text-xs text-clr3">
        <summary className="cursor-pointer hover:text-clr4 font-bold uppercase tracking-widest">
          Íconos disponibles
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-1 pl-4">
          {[...ICON_OPTIONS, ...UNIDAD_ICONS].map(opt => (
            <code key={opt.value} className="truncate">{opt.value}</code>
          ))}
        </div>
      </details>
    </div>
  );
}
