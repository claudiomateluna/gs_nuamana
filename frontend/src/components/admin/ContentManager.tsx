'use client';

/**
 * ContentManager — Admin component for CRUD on paginas_contenido.
 * Features: list pages by category, create/edit/delete, visibility toggle,
 * reorder, WYSIWYG content editing (SunEditor), and automatic menu sync.
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
import { supabase } from '@/lib/supabase';
import type { PaginaContenido } from '@/lib/paginas-contenido.types';

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

// Icon options for pages (matching menu-fallback.ts)
const ICON_OPTIONS: Record<string, { value: string; label: string }[]> = {
  'acerca-de': [
    { value: 'IconoAcercaDe', label: 'ℹ️ Acerca de' },
    { value: 'IconoAcercaDeQuienesSomos', label: '🤝 Quiénes Somos' },
    { value: 'IconoAcercaDeNuestraHistoria', label: '📖 Historia' },
    { value: 'IconoAcercaDeMisionVision', label: '🎯 Misión' },
    { value: 'IconoAcercaDeNuestroEquipo', label: '👨‍👩‍👧‍👦 Equipo' },
    { value: 'IconoAcercaDeNuestrosApoderados', label: '👪 Apoderados' },
    { value: 'IconoAcercaDeInstitucionPatrocinante', label: '🏛️ Institución' },
  ],
  'lo-que-hacemos': [
    { value: 'IconoLoQueHacemos', label: '📋 Lo que hacemos' },
    { value: 'IconoLoQueHacemosMetodoScout', label: '🧭 Método Scout' },
    { value: 'IconoLoQueHacemosAireLibre', label: '🌲 Aire Libre' },
    { value: 'IconoLoQueHacemosAprenderHaciendo', label: '🔨 Aprender Haciendo' },
    { value: 'IconoLoQueHacemosHabilidadesTecnicas', label: '🔧 Habilidades' },
    { value: 'IconoLoQueHacemosProgramasActividades', label: '🎯 Programas' },
    { value: 'IconoLoQueHacemosSistemaEquipos', label: '⚔️ Sistema Equipos' },
    { value: 'IconoLoQueHacemosVidaReflexiva', label: '🧘 Vida Reflexiva' },
  ],
};

// Parent menu_item IDs (from seed)
const PARENT_MENU_IDS: Record<string, string> = {
  'acerca-de': 'a0000000-0000-0000-0000-000000000002',
  'lo-que-hacemos': 'a0000000-0000-0000-0000-000000000003',
};

// Slug → icon mapping (from menu_items seed)
const SLUG_TO_ICON: Record<string, string> = {
  'quienes-somos': 'IconoAcercaDeQuienesSomos',
  'nuestra-historia': 'IconoAcercaDeNuestraHistoria',
  'mision-y-vision': 'IconoAcercaDeMisionVision',
  'nuestro-equipo': 'IconoAcercaDeNuestroEquipo',
  'nuestros-apoderados': 'IconoAcercaDeNuestrosApoderados',
  'institucion-patrocinante': 'IconoAcercaDeInstitucionPatrocinante',
  'ley-y-promesa': 'IconoLoQueHacemos',
  'el-metodo-scout': 'IconoLoQueHacemosMetodoScout',
  'aprender-haciendo': 'IconoLoQueHacemosAprenderHaciendo',
  'sistema-de-equipos': 'IconoLoQueHacemosSistemaEquipos',
  'vida-al-aire-libre': 'IconoLoQueHacemosAireLibre',
  'habilidades-y-tecnicas': 'IconoLoQueHacemosHabilidadesTecnicas',
  'vida-reflexiva': 'IconoLoQueHacemosVidaReflexiva',
  'programa-y-actividades': 'IconoLoQueHacemosProgramasActividades',
};

// Generate slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface ContentManagerProps {
  pages: PaginaContenido[];
  onUpdate: () => void;
}

export default function ContentManager({ pages, onUpdate }: ContentManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formCategoria, setFormCategoria] = useState<string>('acerca-de');
  const [formTitulo, setFormTitulo] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formImagen, setFormImagen] = useState('');
  const [formIcono, setFormIcono] = useState('');
  const [formContenido, setFormContenido] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && formTitulo) {
      setFormSlug(slugify(formTitulo));
    }
  }, [formTitulo, slugManuallyEdited]);

  // Group pages by category
  const pagesByCategory = {
    'acerca-de': pages.filter(p => p.categoria === 'acerca-de'),
    'lo-que-hacemos': pages.filter(p => p.categoria === 'lo-que-hacemos'),
  };

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // --- CRUD Operations ---
  const handleAdd = async () => {
    if (!formTitulo.trim()) { toast.error('El título es obligatorio'); return; }
    if (!formSlug.trim()) { toast.error('El slug es obligatorio'); return; }
    setSaving(true);
    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); setSaving(false); return; }

    const categoria = formCategoria;
    const esPadre = formSlug === categoria;
    const parentId = PARENT_MENU_IDS[categoria];
    const href = esPadre ? null : `/${categoria}/${formSlug}`;

    // 1. Create menu_item
    const siblings = pages.filter(p => p.categoria === categoria && !p.es_padre);
    const newOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.orden)) + 1 : 1;

    const { data: menuItem, error: menuErr } = await supabase
      .from('menu_items')
      .insert({
        titulo: formTitulo.trim(),
        href,
        icono: formIcono || SLUG_TO_ICON[formSlug] || null,
        parent_id: esPadre ? null : parentId,
        orden: newOrder,
        visible: true,
        roles_permitidos: [],
      })
      .select('id')
      .single();

    if (menuErr) {
      toast.error('Error al crear menú: ' + menuErr.message);
      setSaving(false);
      return;
    }

    // 2. Create page
    const { error: pageErr } = await supabase
      .from('paginas_contenido')
      .insert({
        categoria,
        slug: formSlug.trim(),
        titulo: formTitulo.trim(),
        descripcion: formDescripcion.trim() || null,
        imagen: formImagen.trim() || null,
        contenido: formContenido || null,
        formato: 'html',
        icono: formIcono || SLUG_TO_ICON[formSlug] || null,
        orden: newOrder,
        visible: true,
        es_padre: esPadre,
        menu_item_id: menuItem?.id || null,
      });

    setSaving(false);
    if (pageErr) {
      toast.error('Error al crear página: ' + pageErr.message);
      return;
    }

    toast.success('Página creada');
    resetForm();
    onUpdate();
  };

  const handleUpdate = async (id: string) => {
    if (!formTitulo.trim()) { toast.error('El título es obligatorio'); return; }
    setSaving(true);
    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); setSaving(false); return; }

    const page = pages.find(p => p.id === id);
    if (!page) { setSaving(false); return; }

    // Update page
    const { error: pageErr } = await supabase
      .from('paginas_contenido')
      .update({
        titulo: formTitulo.trim(),
        slug: formSlug.trim(),
        descripcion: formDescripcion.trim() || null,
        imagen: formImagen.trim() || null,
        contenido: formContenido || null,
        formato: 'html',
        icono: formIcono || null,
      })
      .eq('id', id);

    if (pageErr) {
      toast.error('Error al actualizar: ' + pageErr.message);
      setSaving(false);
      return;
    }

    // Sync menu_item if linked
    if (page.menu_item_id) {
      const href = page.es_padre ? null : `/${page.categoria}/${formSlug.trim()}`;
      await supabase
        .from('menu_items')
        .update({
          titulo: formTitulo.trim(),
          href,
          icono: formIcono || null,
        })
        .eq('id', page.menu_item_id);
    }

    toast.success('Página actualizada');
    resetForm();
    onUpdate();
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return;
    setSaving(true);
    const token = await getToken();
    if (!token) { toast.error('Sesión expirada'); setSaving(false); return; }

    const page = pages.find(p => p.id === id);

    // Delete menu_item if linked (cascade will handle children)
    if (page?.menu_item_id) {
      await supabase.from('menu_items').delete().eq('id', page.menu_item_id);
    }

    // Delete page
    const { error } = await supabase.from('paginas_contenido').delete().eq('id', id);
    setSaving(false);
    if (error) { toast.error('Error al eliminar: ' + error.message); return; }
    toast.success('Página eliminada');
    onUpdate();
  };

  const handleToggleVisible = async (id: string, currentVisible: boolean) => {
    const page = pages.find(p => p.id === id);

    // Toggle page visibility
    const { error } = await supabase
      .from('paginas_contenido')
      .update({ visible: !currentVisible })
      .eq('id', id);

    if (error) { toast.error('Error al cambiar visibilidad'); return; }

    // Sync menu_item visibility
    if (page?.menu_item_id) {
      await supabase
        .from('menu_items')
        .update({ visible: !currentVisible })
        .eq('id', page.menu_item_id);
    }

    onUpdate();
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const page = pages.find(p => p.id === id);
    if (!page) return;

    const siblings = pages
      .filter(p => p.categoria === page.categoria && !p.es_padre)
      .sort((a, b) => a.orden - b.orden);
    const idx = siblings.findIndex(p => p.id === id);

    if (direction === 'up' && idx > 0) {
      const other = siblings[idx - 1];
      await swapOrder(id, other.id, page.orden, other.orden);
    } else if (direction === 'down' && idx < siblings.length - 1) {
      const other = siblings[idx + 1];
      await swapOrder(id, other.id, page.orden, other.orden);
    }
  };

  const swapOrder = async (id1: string, id2: string, order1: number, order2: number) => {
    const page1 = pages.find(p => p.id === id1);
    const page2 = pages.find(p => p.id === id2);

    // Swap page order
    await supabase.from('paginas_contenido').update({ orden: order2 }).eq('id', id1);
    await supabase.from('paginas_contenido').update({ orden: order1 }).eq('id', id2);

    // Swap menu_item order if linked
    if (page1?.menu_item_id && page2?.menu_item_id) {
      await supabase.from('menu_items').update({ orden: order2 }).eq('id', page1.menu_item_id);
      await supabase.from('menu_items').update({ orden: order1 }).eq('id', page2.menu_item_id);
    }

    onUpdate();
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(null);
    setFormCategoria('acerca-de');
    setFormTitulo('');
    setFormSlug('');
    setFormDescripcion('');
    setFormImagen('');
    setFormIcono('');
    setFormContenido('');
    setSlugManuallyEdited(false);
  };

  const startEdit = (page: PaginaContenido) => {
    setEditingId(page.id);
    setShowAddForm(null);
    setFormCategoria(page.categoria);
    setFormTitulo(page.titulo);
    setFormSlug(page.slug);
    setFormDescripcion(page.descripcion || '');
    setFormImagen(page.imagen || '');
    setFormIcono(page.icono || '');
    setFormContenido(page.contenido || '');
    setSlugManuallyEdited(true);
  };

  const startAdd = (categoria: string) => {
    setShowAddForm(categoria);
    setEditingId(null);
    setFormCategoria(categoria);
    setFormTitulo('');
    setFormSlug('');
    setFormDescripcion('');
    setFormImagen('');
    setFormIcono('');
    setFormContenido('');
    setSlugManuallyEdited(false);
  };

  const renderForm = (mode: 'add' | 'update') => (
    <div className="mb-4 p-4 bg-clr1 dark:bg-dclr1 rounded-2xl border border-clr7 dark:border-dclr7 space-y-3">
      {/* Category selector (only for add) */}
      {mode === 'add' && (
        <div className="flex gap-2">
          <button
            onClick={() => setFormCategoria('acerca-de')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              formCategoria === 'acerca-de'
                ? 'bg-clr4 text-clr1'
                : 'bg-clr7 dark:bg-dclr7 text-clr3 hover:text-clr4'
            }`}
          >
            Acerca De
          </button>
          <button
            onClick={() => setFormCategoria('lo-que-hacemos')}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              formCategoria === 'lo-que-hacemos'
                ? 'bg-clr4 text-clr1'
                : 'bg-clr7 dark:bg-dclr7 text-clr3 hover:text-clr4'
            }`}
          >
            Lo Que Hacemos
          </button>
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        placeholder="Título *"
        value={formTitulo}
        onChange={e => {
          setFormTitulo(e.target.value);
          if (slugManuallyEdited) setSlugManuallyEdited(false);
        }}
        className="w-full bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-clr4"
      />

      {/* Slug */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-clr3">/{formCategoria}/</span>
        <input
          type="text"
          placeholder="slug-automatico"
          value={formSlug}
          onChange={e => {
            setFormSlug(e.target.value);
            setSlugManuallyEdited(true);
          }}
          className="flex-1 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm outline-none focus:border-clr4"
        />
      </div>

      {/* Description */}
      <input
        type="text"
        placeholder="Descripción (opcional)"
        value={formDescripcion}
        onChange={e => setFormDescripcion(e.target.value)}
        className="w-full bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm outline-none focus:border-clr4"
      />

      {/* Image URL */}
      <input
        type="text"
        placeholder="URL de imagen (opcional)"
        value={formImagen}
        onChange={e => setFormImagen(e.target.value)}
        className="w-full bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm outline-none focus:border-clr4"
      />

      {/* Icon selector */}
      <select
        value={formIcono}
        onChange={e => setFormIcono(e.target.value)}
        className="w-full bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl px-3 py-2 text-sm outline-none focus:border-clr4"
      >
        <option value="">Sin ícono</option>
        {(ICON_OPTIONS[formCategoria] || []).map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* WYSIWYG content editor */}
      <div className="space-y-1">
        <label className="text-xs font-black uppercase tracking-widest text-clr3">
          Contenido
        </label>
        <div className="border border-clr7 dark:border-dclr7 rounded-xl overflow-hidden">
          <SunEditor
            setContents={formContenido}
            onChange={setFormContenido}
            setOptions={{
              height: '400',
              buttonList: [
                ['undo', 'redo'],
                ['formatBlock', 'font', 'fontSize'],
                ['bold', 'underline', 'italic', 'strike'],
                ['fontColor', 'hiliteColor'],
                ['outdent', 'indent'],
                ['align', 'list', 'lineHeight'],
                ['table', 'link', 'image'],
                ['fullScreen', 'codeView'],
                ['preview'],
              ],
              defaultStyle: 'font-family: var(--font-body); font-size: 1rem; line-height: 1.8;',
            }}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-2">
        <button
          onClick={() => mode === 'add' ? handleAdd() : handleUpdate(editingId!)}
          disabled={saving}
          className="flex-1 py-2 bg-clr4 text-clr1 font-black text-xs uppercase rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
        >
          {saving ? 'Guardando...' : mode === 'add' ? 'Crear Página' : 'Guardar'}
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

  const renderPageRow = (page: PaginaContenido) => {
    const isEditing = editingId === page.id;

    return (
      <div key={page.id} className={`${!page.visible ? 'opacity-40' : ''}`}>
        <div className={`flex items-center gap-2 p-2 rounded-xl mb-1 group transition-all ${isEditing ? 'bg-clr4 ring-1 ring-clr4' : 'hover:bg-clr1 dark:hover:bg-clr1'}`}>
          {/* Reorder buttons */}
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => handleMove(page.id, 'up')} className="text-clr3 hover:text-clr4 text-xs" title="Subir">▲</button>
            <button onClick={() => handleMove(page.id, 'down')} className="text-clr3 hover:text-clr4 text-xs" title="Bajar">▼</button>
          </div>

          {/* Icon */}
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            {page.icono ? (
              <span className="text-xs text-clr3" title={page.icono}>⬡</span>
            ) : (
              <span className="text-xs text-clr3">—</span>
            )}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm text-clr2 dark:text-dclr2">
              {page.titulo}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-clr3 truncate">/{page.categoria}/{page.slug}</span>
              {page.es_padre && (
                <span className="text-[0.65em] text-clr4 bg-clr7 px-1.5 py-0.5 rounded-full font-bold">
                  PADRE
                </span>
              )}
              {page.formato === 'html' && (
                <span className="text-[0.65em] text-clr6 bg-clr6/10 px-1.5 py-0.5 rounded-full font-bold">
                  WYSIWYG
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleToggleVisible(page.id, page.visible)}
              className={`p-1 rounded-lg text-xs transition-colors ${page.visible ? 'text-clr6 hover:bg-clr6' : 'text-clr3 hover:bg-clr7'}`}
              title={page.visible ? 'Ocultar' : 'Mostrar'}
            >
              {page.visible ? '👁️' : '🚫'}
            </button>
            <button
              onClick={() => startEdit(page)}
              className="p-1 rounded-lg text-clr3 hover:text-clr4 hover:bg-clr7 text-xs"
              title="Editar"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(page.id, page.titulo)}
              className="p-1 rounded-lg text-clr3 hover:text-clr4 hover:bg-clr4 text-xs"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Inline edit form */}
        {isEditing && renderForm('update')}
      </div>
    );
  };

  const renderCategory = (categoria: string, label: string) => {
    const categoryPages = pagesByCategory[categoria as keyof typeof pagesByCategory];
    const isAdding = showAddForm === categoria;

    return (
      <div key={categoria} className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black font-display text-clr4 dark:text-dclr4 uppercase tracking-tighter">
            {label}
          </h3>
          <button
            onClick={() => startAdd(categoria)}
            className="px-3 py-1.5 bg-clr4 text-clr1 font-black text-xs uppercase rounded-xl hover:brightness-110 transition-all"
          >
            + Crear
          </button>
        </div>

        {isAdding && renderForm('add')}

        <div className="bg-clr1 dark:bg-dclr1 rounded-2xl border border-clr7 dark:border-dclr7 p-3">
          {categoryPages.length === 0 ? (
            <p className="text-xs text-clr3 text-center py-4">No hay páginas</p>
          ) : (
            categoryPages
              .sort((a, b) => a.orden - b.orden)
              .map(page => renderPageRow(page))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-clr3">
          {pages.length} páginas · ▲▼ reordenar · 👁️ ocultar · Edición inline
        </p>
      </div>

      {renderCategory('acerca-de', 'Acerca De')}
      {renderCategory('lo-que-hacemos', 'Lo Que Hacemos')}
    </div>
  );
}
