'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/storage-utils';
import type { Unidad, UnidadCicloData, UnidadSimbolosData, UnidadSimboloItem, UnidadCicloFase } from '@/types';

type UnitSubTab = 'general' | 'colores' | 'ciclo' | 'simbolos' | 'medios';

function ColorField({
  label,
  value,
  fallback,
  onChange,
  placeholder = 'Por defecto del sistema',
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[0.8em] font-semibold uppercase tracking-wider text-clr3">
          {label}
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[0.8em] font-bold text-clr4 hover:underline"
            title="Restablecer a color por defecto"
          >
            Restablecer
          </button>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || fallback}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-xl cursor-pointer border border-clr7 dark:border-dclr7 shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-mono font-bold text-clr2 dark:text-dclr2"
        />
      </div>
    </div>
  );
}

export default function UnitManager() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [activeSubTab, setActiveSubTab] = useState<UnitSubTab>('general');

  // Form state
  const [formData, setFormData] = useState<{
    nombre: string;
    nombre_unidad: string;
    lema: string;
    rango_edad: string;
    marco_simbolico: string;
    descripcion: string;
    descripcion_larga: string;
    primario: string;
    secundario: string;
    fondo: string;
    fondo_oscuro: string;
    hero_gradient_from: string;
    hero_gradient_via: string;
    hero_gradient_to: string;
    borde: string;
    borde_oscuro: string;
    tab_inactivo_bg: string;
    tab_inactivo_bg_oscuro: string;
    tab_hover_bg: string;
    tab_hover_bg_oscuro: string;
    hero_desc_texto: string;
    hero_desc_texto_oscuro: string;
    tarjeta_bg: string;
    tarjeta_bg_oscuro: string;
    tarjeta_b_bg: string;
    tarjeta_b_bg_oscuro: string;
    texto: string;
    texto_oscuro: string;
    logo_unidad_url: string;
    logo_rama_url: string;
    bandera_url: string;
    ciclo_data: UnidadCicloData;
    simbolos_data: UnidadSimbolosData;
  }>({
    nombre: '',
    nombre_unidad: '',
    lema: '',
    rango_edad: '',
    marco_simbolico: '',
    descripcion: '',
    descripcion_larga: '',
    primario: '#cb3327',
    secundario: '#1b1b1b',
    fondo: '',
    fondo_oscuro: '',
    hero_gradient_from: 'rgba(27, 27, 27, 0.95)',
    hero_gradient_via: 'rgba(27, 27, 27, 0.8)',
    hero_gradient_to: 'rgba(203, 51, 39, 0.4)',
    borde: '',
    borde_oscuro: '',
    tab_inactivo_bg: '',
    tab_inactivo_bg_oscuro: '',
    tab_hover_bg: '',
    tab_hover_bg_oscuro: '',
    hero_desc_texto: '',
    hero_desc_texto_oscuro: '',
    tarjeta_bg: '',
    tarjeta_bg_oscuro: '',
    tarjeta_b_bg: '',
    tarjeta_b_bg_oscuro: '',
    texto: '',
    texto_oscuro: '',
    logo_unidad_url: '',
    logo_rama_url: '',
    bandera_url: '',
    ciclo_data: {
      titulo: '',
      subtitulo: '',
      descripcion: '',
      fases: [],
      extra_info: '',
    },
    simbolos_data: {
      titulo: '',
      descripcion: '',
      promesa_titulo: '',
      promesa_texto: '',
      promesa_puntos: [],
      ley_titulo: '',
      ley_articulos: [],
      elementos: [],
    },
  });

  const fetchUnidades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('unidades')
      .select('*')
      .order('id');

    if (error) {
      toast.error('Error al cargar la información de unidades');
      console.error(error);
    } else if (data) {
      setUnidades(data as Unidad[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnidades();
  }, []);

  // Sync form when selectedId or unidades change
  useEffect(() => {
    const unit = unidades.find((u) => u.id === selectedId);
    if (unit) {
      let primario = '#cb3327';
      let secundario = '#1b1b1b';
      let fondo = '';
      let fondo_oscuro = '';
      let hero_gradient_from = 'rgba(27, 27, 27, 0.95)';
      let hero_gradient_via = 'rgba(27, 27, 27, 0.8)';
      let hero_gradient_to = 'rgba(203, 51, 39, 0.4)';
      let borde = '';
      let borde_oscuro = '';
      let tab_inactivo_bg = '';
      let tab_inactivo_bg_oscuro = '';
      let tab_hover_bg = '';
      let tab_hover_bg_oscuro = '';
      let hero_desc_texto = '';
      let hero_desc_texto_oscuro = '';
      let tarjeta_bg = '';
      let tarjeta_bg_oscuro = '';
      let tarjeta_b_bg = '';
      let tarjeta_b_bg_oscuro = '';
      let texto = '';
      let texto_oscuro = '';

      if (unit.colores) {
        let parsed: any = unit.colores;
        if (typeof unit.colores === 'string') {
          try {
            parsed = JSON.parse(unit.colores);
          } catch (e) {
            console.warn('Error parsing colores JSON:', e);
            parsed = {};
          }
        }
        if (parsed && typeof parsed === 'object') {
          primario = parsed.primario || primario;
          secundario = parsed.secundario || secundario;
          fondo = parsed.fondo || '';
          fondo_oscuro = parsed.fondo_oscuro || '';
          hero_gradient_from = parsed.hero_gradient_from || hero_gradient_from;
          hero_gradient_via = parsed.hero_gradient_via || hero_gradient_via;
          hero_gradient_to = parsed.hero_gradient_to || hero_gradient_to;
          borde = parsed.borde || '';
          borde_oscuro = parsed.borde_oscuro || '';
          tab_inactivo_bg = parsed.tab_inactivo_bg || '';
          tab_inactivo_bg_oscuro = parsed.tab_inactivo_bg_oscuro || '';
          tab_hover_bg = parsed.tab_hover_bg || '';
          tab_hover_bg_oscuro = parsed.tab_hover_bg_oscuro || '';
          hero_desc_texto = parsed.hero_desc_texto || '';
          hero_desc_texto_oscuro = parsed.hero_desc_texto_oscuro || '';
          tarjeta_bg = parsed.tarjeta_bg || '';
          tarjeta_bg_oscuro = parsed.tarjeta_bg_oscuro || '';
          tarjeta_b_bg = parsed.tarjeta_b_bg || '';
          tarjeta_b_bg_oscuro = parsed.tarjeta_b_bg_oscuro || '';
          texto = parsed.texto || '';
          texto_oscuro = parsed.texto_oscuro || '';
        }
      }

      setFormData({
        nombre: unit.nombre || '',
        nombre_unidad: unit.nombre_unidad || '',
        lema: unit.lema || '',
        rango_edad: unit.rango_edad || '',
        marco_simbolico: unit.marco_simbolico || '',
        descripcion: unit.descripcion || '',
        descripcion_larga: unit.descripcion_larga || '',
        primario,
        secundario,
        fondo,
        fondo_oscuro,
        hero_gradient_from,
        hero_gradient_via,
        hero_gradient_to,
        borde,
        borde_oscuro,
        tab_inactivo_bg,
        tab_inactivo_bg_oscuro,
        tab_hover_bg,
        tab_hover_bg_oscuro,
        hero_desc_texto,
        hero_desc_texto_oscuro,
        tarjeta_bg,
        tarjeta_bg_oscuro,
        tarjeta_b_bg,
        tarjeta_b_bg_oscuro,
        texto,
        texto_oscuro,
        logo_unidad_url: unit.logo_unidad_url || '',
        logo_rama_url: unit.logo_rama_url || '',
        bandera_url: unit.bandera_url || '',
        ciclo_data: unit.ciclo_data || {
          titulo: '',
          subtitulo: '',
          descripcion: '',
          fases: [],
          extra_info: '',
        },
        simbolos_data: unit.simbolos_data || {
          titulo: '',
          descripcion: '',
          promesa_titulo: '',
          promesa_texto: '',
          promesa_puntos: [],
          ley_titulo: '',
          ley_articulos: [],
          elementos: [],
        },
      });
    }
  }, [selectedId, unidades]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logo_unidad_url' | 'logo_rama_url' | 'bandera_url'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(field);
      const publicUrl = await uploadToStorage(file, 'publicidad', 'unidades', {
        compress: true,
        fileNamePrefix: `unidad_${selectedId}_${field}`,
      });

      setFormData((prev) => ({ ...prev, [field]: publicUrl }));
      toast.success('Imagen subida correctamente');
    } catch (err: any) {
      toast.error(`Error al subir la imagen: ${err.message || err}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSimboloImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(`simbolo_${index}`);
      const publicUrl = await uploadToStorage(file, 'publicidad', 'unidades/simbolos', {
        compress: false,
        fileNamePrefix: `simbolo_${selectedId}_${index}`,
      });

      const updatedElementos = [...(formData.simbolos_data.elementos || [])];
      updatedElementos[index] = { ...updatedElementos[index], imagen_url: publicUrl };

      setFormData((prev) => ({
        ...prev,
        simbolos_data: { ...prev.simbolos_data, elementos: updatedElementos },
      }));
      toast.success('Imagen o SVG de símbolo subido correctamente');
    } catch (err: any) {
      toast.error(`Error al subir imagen: ${err.message || err}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        nombre_unidad: formData.nombre_unidad,
        lema: formData.lema,
        rango_edad: formData.rango_edad,
        marco_simbolico: formData.marco_simbolico,
        descripcion: formData.descripcion,
        descripcion_larga: formData.descripcion_larga,
        colores: {
          primario: formData.primario,
          secundario: formData.secundario,
          fondo: formData.fondo || null,
          fondo_oscuro: formData.fondo_oscuro || null,
          hero_gradient_from: formData.hero_gradient_from,
          hero_gradient_via: formData.hero_gradient_via,
          hero_gradient_to: formData.hero_gradient_to,
          borde: formData.borde || null,
          borde_oscuro: formData.borde_oscuro || null,
          tab_inactivo_bg: formData.tab_inactivo_bg || null,
          tab_inactivo_bg_oscuro: formData.tab_inactivo_bg_oscuro || null,
          tab_hover_bg: formData.tab_hover_bg || null,
          tab_hover_bg_oscuro: formData.tab_hover_bg_oscuro || null,
          hero_desc_texto: formData.hero_desc_texto || null,
          hero_desc_texto_oscuro: formData.hero_desc_texto_oscuro || null,
          tarjeta_bg: formData.tarjeta_bg || null,
          tarjeta_bg_oscuro: formData.tarjeta_bg_oscuro || null,
          tarjeta_b_bg: formData.tarjeta_b_bg || null,
          tarjeta_b_bg_oscuro: formData.tarjeta_b_bg_oscuro || null,
          texto: formData.texto || null,
          texto_oscuro: formData.texto_oscuro || null,
        },
        logo_unidad_url: formData.logo_unidad_url,
        logo_rama_url: formData.logo_rama_url,
        bandera_url: formData.bandera_url,
        ciclo_data: formData.ciclo_data,
        simbolos_data: formData.simbolos_data,
      };

      const { error } = await supabase
        .from('unidades')
        .update(payload)
        .eq('id', selectedId);

      if (error) throw error;

      toast.success(`Unidad "${formData.nombre}" actualizada con éxito`);
      await fetchUnidades();
    } catch (err: any) {
      toast.error(`Error al guardar: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for Fases
  const addFase = () => {
    const fases = [...(formData.ciclo_data.fases || [])];
    fases.push({ nombre: 'Nueva Fase', descripcion: '' });
    setFormData({
      ...formData,
      ciclo_data: { ...formData.ciclo_data, fases },
    });
  };

  const removeFase = (index: number) => {
    const fases = (formData.ciclo_data.fases || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      ciclo_data: { ...formData.ciclo_data, fases },
    });
  };

  const updateFase = (index: number, field: keyof UnidadCicloFase, value: string) => {
    const fases = [...(formData.ciclo_data.fases || [])];
    fases[index] = { ...fases[index], [field]: value };
    setFormData({
      ...formData,
      ciclo_data: { ...formData.ciclo_data, fases },
    });
  };

  // Helper functions for Símbolos
  const addElemento = () => {
    const elementos = [...(formData.simbolos_data.elementos || [])];
    elementos.push({ titulo: 'Nuevo Símbolo', descripcion: '', imagen_url: '', icono: '' });
    setFormData({
      ...formData,
      simbolos_data: { ...formData.simbolos_data, elementos },
    });
  };

  const removeElemento = (index: number) => {
    const elementos = (formData.simbolos_data.elementos || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      simbolos_data: { ...formData.simbolos_data, elementos },
    });
  };

  const updateElemento = (index: number, field: keyof UnidadSimboloItem, value: string) => {
    const elementos = [...(formData.simbolos_data.elementos || [])];
    elementos[index] = { ...elementos[index], [field]: value };
    setFormData({
      ...formData,
      simbolos_data: { ...formData.simbolos_data, elementos },
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-bold uppercase tracking-wider text-clr3 animate-pulse">
        Cargando unidades...
      </div>
    );
  }

  const activeUnit = unidades.find((u) => u.id === selectedId);

  return (
    <div className="space-y-6">
      {/* Selector de Unidad Superior */}
      <div className="flex gap-2 flex-wrap border-b border-clr7 dark:border-dclr7 pb-4">
        {unidades.map((u) => {
          const isActive = u.id === selectedId;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => setSelectedId(u.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-clr4 text-clr1 shadow-md scale-105'
                  : 'bg-clr1 dark:bg-dclr1 text-clr3 hover:text-clr4 border border-clr7 dark:border-dclr7'
              }`}
            >
              {u.nombre} {u.nombre_unidad ? `"${u.nombre_unidad}"` : ''}
            </button>
          );
        })}
      </div>

      {activeUnit && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sub-Tabs de navegación interna */}
          <div className="flex gap-2 flex-wrap bg-clr7/20 dark:bg-dclr7/20 p-1.5 rounded-2xl border border-clr7 dark:border-dclr7">
            <button
              type="button"
              onClick={() => setActiveSubTab('general')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeSubTab === 'general'
                  ? 'bg-clr4 text-clr1 shadow-sm'
                  : 'text-clr3 hover:text-clr4'
              }`}
            >
              ⚜️ Identificación & Textos
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('colores')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeSubTab === 'colores'
                  ? 'bg-clr4 text-clr1 shadow-sm'
                  : 'text-clr3 hover:text-clr4'
              }`}
            >
              🎨 Colores, Fondo & Hero
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('ciclo')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeSubTab === 'ciclo'
                  ? 'bg-clr4 text-clr1 shadow-sm'
                  : 'text-clr3 hover:text-clr4'
              }`}
            >
              🔄 Ciclo de Programa
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('simbolos')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeSubTab === 'simbolos'
                  ? 'bg-clr4 text-clr1 shadow-sm'
                  : 'text-clr3 hover:text-clr4'
              }`}
            >
              🌟 Símbolos & Mística
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('medios')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeSubTab === 'medios'
                  ? 'bg-clr4 text-clr1 shadow-sm'
                  : 'text-clr3 hover:text-clr4'
              }`}
            >
              🖼️ Insignias & Bandera
            </button>
          </div>

          {/* Sub-Tab 1: Identificación y Textos */}
          {activeSubTab === 'general' && (
            <div className="bg-clr1 dark:bg-dclr1 p-6 rounded-2xl border border-clr7 dark:border-dclr7 shadow-sm space-y-4">
              <h3 className="text-lg font-black font-display uppercase tracking-tight text-clr4 dark:text-dclr4 flex items-center gap-2">
                <span>⚜️</span> Identificación & Mística de la Unidad
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Rama / Tipo de Unidad (Fijo)
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    disabled
                    className="w-full p-3 bg-clr7/20 dark:bg-dclr7/20 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2 opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Nombre del Grupo / Nombre Propio
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_unidad}
                    onChange={(e) => setFormData({ ...formData, nombre_unidad: e.target.value })}
                    placeholder="Ej: Seonee, Kuyen, A'ata..."
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2 focus:outline-none focus:border-clr4"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Lema de la Unidad
                  </label>
                  <input
                    type="text"
                    value={formData.lema}
                    onChange={(e) => setFormData({ ...formData, lema: e.target.value })}
                    placeholder="Ej: ¡Siempre Mejor!, Servir..."
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2 focus:outline-none focus:border-clr4"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Rango de Edades
                  </label>
                  <input
                    type="text"
                    value={formData.rango_edad}
                    onChange={(e) => setFormData({ ...formData, rango_edad: e.target.value })}
                    placeholder="Ej: 7 a 11 años"
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2 focus:outline-none focus:border-clr4"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Marco Simbólico Principal
                  </label>
                  <input
                    type="text"
                    value={formData.marco_simbolico}
                    onChange={(e) => setFormData({ ...formData, marco_simbolico: e.target.value })}
                    placeholder="Ej: El Libro de las Tierras Vírgenes (Mowgli)"
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2 focus:outline-none focus:border-clr4"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Descripción Corta (Portada / Hero)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-medium text-clr2 dark:text-dclr2 focus:outline-none focus:border-clr4"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Descripción Larga (Propuesta Pedagógica General)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.descripcion_larga}
                    onChange={(e) => setFormData({ ...formData, descripcion_larga: e.target.value })}
                    placeholder="Escribe la descripción de la propuesta pedagógica..."
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-medium text-clr2 dark:text-dclr2 focus:outline-none focus:border-clr4 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Colores, Fondo & Hero */}
          {activeSubTab === 'colores' && (
            <div className="bg-clr1 dark:bg-dclr1 p-6 rounded-2xl border border-clr7 dark:border-dclr7 shadow-sm space-y-8">
              <div className="border-b border-clr7 dark:border-dclr7 pb-4">
                <h3 className="text-lg font-black font-display uppercase tracking-tight text-clr4 dark:text-dclr4 flex items-center gap-2">
                  <span>🎨</span> Paleta Cromática y Personalización Visual de la Unidad
                </h3>
                <p className="text-[0.85em] text-clr3 mt-1">
                  Configura los colores específicos para esta unidad en modos claro y oscuro. Si dejas un campo vacío, se utilizará automáticamente el token visual estándar del sistema.
                </p>
              </div>

              {/* 1. Colores de Identidad */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-clr2 dark:text-dclr2 flex items-center gap-2">
                  <span>🏷️</span> Identidad Institucional
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.8em] font-semibold uppercase tracking-wider text-clr3 mb-1">
                      Color Primario de Unidad (Insignia / Acento)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.primario}
                        onChange={(e) => setFormData({ ...formData, primario: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-clr7 dark:border-dclr7 shrink-0"
                      />
                      <input
                        type="text"
                        value={formData.primario}
                        onChange={(e) => setFormData({ ...formData, primario: e.target.value })}
                        className="flex-1 p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-mono font-bold text-clr2 dark:text-dclr2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.8em] font-semibold uppercase tracking-wider text-clr3 mb-1">
                      Color Secundario de Unidad (Contraste)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.secundario}
                        onChange={(e) => setFormData({ ...formData, secundario: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-clr7 dark:border-dclr7 shrink-0"
                      />
                      <input
                        type="text"
                        value={formData.secundario}
                        onChange={(e) => setFormData({ ...formData, secundario: e.target.value })}
                        className="flex-1 p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-mono font-bold text-clr2 dark:text-dclr2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Fondo y Textos Generales */}
              <div className="space-y-3 border-t border-clr7 dark:border-dclr7 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-clr2 dark:text-dclr2 flex items-center gap-2">
                  <span>📄</span> Superficie de Página y Tipografía
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField
                    label="Fondo de Página (Modo Claro)"
                    value={formData.fondo}
                    fallback="#ffffff"
                    onChange={(val) => setFormData({ ...formData, fondo: val })}
                    placeholder="Ej: #f3faf6 (vacío: color global)"
                  />
                  <ColorField
                    label="Fondo de Página (Modo Oscuro)"
                    value={formData.fondo_oscuro}
                    fallback="#121212"
                    onChange={(val) => setFormData({ ...formData, fondo_oscuro: val })}
                    placeholder="Ej: #0b1c15 (vacío: color global)"
                  />
                  <ColorField
                    label="Color de Texto General (Modo Claro)"
                    value={formData.texto}
                    fallback="#1b1b1b"
                    onChange={(val) => setFormData({ ...formData, texto: val })}
                    placeholder="Ej: #1b1b1b (vacío: color global)"
                  />
                  <ColorField
                    label="Color de Texto General (Modo Oscuro)"
                    value={formData.texto_oscuro}
                    fallback="#f5f5f5"
                    onChange={(val) => setFormData({ ...formData, texto_oscuro: val })}
                    placeholder="Ej: #f5f5f5 (vacío: color global)"
                  />
                </div>
              </div>

              {/* 3. Bordes y Contornos */}
              <div className="space-y-3 border-t border-clr7 dark:border-dclr7 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-clr2 dark:text-dclr2 flex items-center gap-2">
                  <span>🔲</span> Bordes y Separadores Estructurales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField
                    label="Color de Bordes (Modo Claro)"
                    value={formData.borde}
                    fallback="#e5e7eb"
                    onChange={(val) => setFormData({ ...formData, borde: val })}
                    placeholder="Ej: #e2e8f0 (vacío: borde estándar)"
                  />
                  <ColorField
                    label="Color de Bordes (Modo Oscuro)"
                    value={formData.borde_oscuro}
                    fallback="#333333"
                    onChange={(val) => setFormData({ ...formData, borde_oscuro: val })}
                    placeholder="Ej: #2a2a2a (vacío: borde estándar)"
                  />
                </div>
              </div>

              {/* 4. Tarjetas de Contenido (Superficies A y B) */}
              <div className="space-y-3 border-t border-clr7 dark:border-dclr7 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-clr2 dark:text-dclr2 flex items-center gap-2">
                  <span>🃏</span> Fondos de Tarjetas de Contenido
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField
                    label="Tarjetas A - Principal (Modo Claro - Etapas, Ley, Símbolos)"
                    value={formData.tarjeta_bg}
                    fallback="#ffffff"
                    onChange={(val) => setFormData({ ...formData, tarjeta_bg: val })}
                    placeholder="Ej: #ffffff (vacío: fondo estándar)"
                  />
                  <ColorField
                    label="Tarjetas A - Principal (Modo Oscuro)"
                    value={formData.tarjeta_bg_oscuro}
                    fallback="#1b1b1b"
                    onChange={(val) => setFormData({ ...formData, tarjeta_bg_oscuro: val })}
                    placeholder="Ej: #1b1b1b (vacío: fondo estándar)"
                  />
                  <ColorField
                    label="Tarjetas B - Secundaria (Modo Claro - Subfases, Citas, Cajas)"
                    value={formData.tarjeta_b_bg}
                    fallback="#f3f4f6"
                    onChange={(val) => setFormData({ ...formData, tarjeta_b_bg: val })}
                    placeholder="Ej: #f8fafc (vacío: fondo secundario)"
                  />
                  <ColorField
                    label="Tarjetas B - Secundaria (Modo Oscuro)"
                    value={formData.tarjeta_b_bg_oscuro}
                    fallback="#262626"
                    onChange={(val) => setFormData({ ...formData, tarjeta_b_bg_oscuro: val })}
                    placeholder="Ej: #262626 (vacío: fondo secundario)"
                  />
                </div>
              </div>

              {/* 5. Pestañas / Tabs de Navegación */}
              <div className="space-y-3 border-t border-clr7 dark:border-dclr7 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-clr2 dark:text-dclr2 flex items-center gap-2">
                  <span>📑</span> Pestañas de Navegación (Tabs)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField
                    label="Fondo Tabs Inactivos (Modo Claro)"
                    value={formData.tab_inactivo_bg}
                    fallback="#f3f4f6"
                    onChange={(val) => setFormData({ ...formData, tab_inactivo_bg: val })}
                    placeholder="Ej: #f1f5f9 (vacío: estándar)"
                  />
                  <ColorField
                    label="Fondo Tabs Inactivos (Modo Oscuro)"
                    value={formData.tab_inactivo_bg_oscuro}
                    fallback="#262626"
                    onChange={(val) => setFormData({ ...formData, tab_inactivo_bg_oscuro: val })}
                    placeholder="Ej: #1e293b (vacío: estándar)"
                  />
                  <ColorField
                    label="Fondo Tabs en Hover (Modo Claro)"
                    value={formData.tab_hover_bg}
                    fallback="#e5e7eb"
                    onChange={(val) => setFormData({ ...formData, tab_hover_bg: val })}
                    placeholder="Ej: #e2e8f0 (vacío: estándar)"
                  />
                  <ColorField
                    label="Fondo Tabs en Hover (Modo Oscuro)"
                    value={formData.tab_hover_bg_oscuro}
                    fallback="#333333"
                    onChange={(val) => setFormData({ ...formData, tab_hover_bg_oscuro: val })}
                    placeholder="Ej: #334155 (vacío: estándar)"
                  />
                </div>
              </div>

              {/* 6. Hero Banner, Degradado y Texto de Descripción Corta */}
              <div className="space-y-4 border-t border-clr7 dark:border-dclr7 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-clr2 dark:text-dclr2 flex items-center gap-2">
                  <span>🌅</span> Portada Hero y Descripción Corta
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorField
                    label="Texto Descripción Corta (Modo Claro)"
                    value={formData.hero_desc_texto}
                    fallback="#e5e7eb"
                    onChange={(val) => setFormData({ ...formData, hero_desc_texto: val })}
                    placeholder="Ej: #ffffff o #e5e7eb"
                  />
                  <ColorField
                    label="Texto Descripción Corta (Modo Oscuro)"
                    value={formData.hero_desc_texto_oscuro}
                    fallback="#e5e7eb"
                    onChange={(val) => setFormData({ ...formData, hero_desc_texto_oscuro: val })}
                    placeholder="Ej: #ffffff o #e5e7eb"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[0.8em] font-semibold uppercase tracking-wider text-clr3">
                    Degradado y Filtro sobre la Bandera del Hero (RGBA o Hex)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[0.75em] text-clr3 mb-1">Inicio (Arriba)</span>
                      <input
                        type="text"
                        value={formData.hero_gradient_from}
                        onChange={(e) => setFormData({ ...formData, hero_gradient_from: e.target.value })}
                        placeholder="rgba(27, 27, 27, 0.95)"
                        className="w-full p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-mono font-bold text-clr2 dark:text-dclr2"
                      />
                    </div>
                    <div>
                      <span className="block text-[0.75em] text-clr3 mb-1">Punto Medio</span>
                      <input
                        type="text"
                        value={formData.hero_gradient_via}
                        onChange={(e) => setFormData({ ...formData, hero_gradient_via: e.target.value })}
                        placeholder="rgba(27, 27, 27, 0.8)"
                        className="w-full p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-mono font-bold text-clr2 dark:text-dclr2"
                      />
                    </div>
                    <div>
                      <span className="block text-[0.75em] text-clr3 mb-1">Fin (Abajo)</span>
                      <input
                        type="text"
                        value={formData.hero_gradient_to}
                        onChange={(e) => setFormData({ ...formData, hero_gradient_to: e.target.value })}
                        placeholder="rgba(203, 51, 39, 0.4)"
                        className="w-full p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-mono font-bold text-clr2 dark:text-dclr2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Previsualización en Vivo del Hero */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-clr3">
                  Previsualización en Vivo del Hero de la Unidad
                </label>
                <div className="relative w-full h-56 rounded-3xl overflow-hidden border border-clr7 dark:border-dclr7 flex items-center justify-center p-6 text-white shadow-xl">
                  {/* Bandera de fondo */}
                  <img
                    src={formData.bandera_url || '/images/unidades/bandera_grupo.webp'}
                    alt="Bandera"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Degradado en vivo */}
                  <div
                    className="absolute inset-0 transition-all duration-300 pointer-events-none"
                    style={{
                      background: `linear-gradient(to bottom, ${formData.hero_gradient_from || 'rgba(0,0,0,0.8)'}, ${formData.hero_gradient_via || 'rgba(0,0,0,0.6)'}, ${formData.hero_gradient_to || 'rgba(0,0,0,0.3)'})`,
                    }}
                  />
                  {/* Contenido en vivo */}
                  <div className="relative z-10 flex items-center gap-6 text-left">
                    <div
                      className="w-20 h-20 rounded-full p-2 border-2 shadow-lg flex items-center justify-center shrink-0"
                      style={{ 
                        backgroundColor: formData.primario,
                        borderColor: formData.secundario 
                      }}
                    >
                      <img
                        src={formData.logo_unidad_url || '/images/logos/LogoColor.svg'}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <span
                        className="text-xs font-bold uppercase tracking-widest px-3 py-0.5 rounded-lg border shadow-sm inline-block mb-1"
                        style={{
                          backgroundColor: formData.secundario,
                          color: formData.primario,
                          borderColor: `${formData.secundario}80`,
                        }}
                      >
                        {formData.nombre} {formData.lema ? `• ${formData.lema}` : ''}
                      </span>
                      <h4
                        className="text-2xl font-black uppercase tracking-tight p-2 rounded-xl leading-none"
                        style={{
                          backgroundColor: formData.primario,
                          color: formData.secundario,
                        }}
                      >
                        {formData.nombre_unidad || formData.nombre}
                      </h4>
                      <p
                        className="text-xs font-semibold mt-1 opacity-90 max-w-sm drop-shadow"
                        style={{
                          color: formData.hero_desc_texto || undefined,
                        }}
                      >
                        {formData.descripcion || 'Sin descripción asignada aún.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Ciclo de Programa */}
          {activeSubTab === 'ciclo' && (
            <div className="bg-clr1 dark:bg-dclr1 p-6 rounded-2xl border border-clr7 dark:border-dclr7 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black font-display uppercase tracking-tight text-clr4 dark:text-dclr4 flex items-center gap-2">
                  <span>🔄</span> Ciclo de Programa y Metodología
                </h3>
                <button
                  type="button"
                  onClick={addFase}
                  className="px-3 py-1.5 bg-clr4 hover:bg-clr4/90 text-clr1 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  + Agregar Fase
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Título de la Metodología / Proyecto
                  </label>
                  <input
                    type="text"
                    value={formData.ciclo_data?.titulo || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ciclo_data: { ...formData.ciclo_data, titulo: e.target.value },
                      })
                    }
                    placeholder="Ej: Las Cacerías de la Manada, Aventuras y Ciclo..."
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={formData.ciclo_data?.subtitulo || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ciclo_data: { ...formData.ciclo_data, subtitulo: e.target.value },
                      })
                    }
                    placeholder="Ej: Metodología de Ciclo en la Rama"
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Descripción Pedagógica del Ciclo
                  </label>
                  <textarea
                    rows={3}
                    value={formData.ciclo_data?.descripcion || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ciclo_data: { ...formData.ciclo_data, descripcion: e.target.value },
                      })
                    }
                    placeholder="Describe cómo se vive el ciclo en la unidad..."
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-medium text-clr2 dark:text-dclr2"
                  />
                </div>
              </div>

              {/* Fases Dinámicas */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-black uppercase tracking-wider text-clr2 dark:text-dclr2">
                  Fases del Ciclo ({formData.ciclo_data?.fases?.length || 0})
                </h4>

                <div className="space-y-3">
                  {(formData.ciclo_data?.fases || []).map((fase, i) => (
                    <div
                      key={i}
                      className="p-4 bg-clr7/20 dark:bg-dclr7/20 rounded-2xl border border-clr7 dark:border-dclr7 flex flex-col md:flex-row gap-4 items-start"
                    >
                      <span className="w-8 h-8 rounded-full bg-clr4 text-clr1 font-black flex items-center justify-center text-xs shrink-0 mt-1">
                        0{i + 1}
                      </span>
                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={fase.nombre}
                          onChange={(e) => updateFase(i, 'nombre', e.target.value)}
                          placeholder="Nombre de la fase (ej: Planificación)"
                          className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-bold text-clr2 dark:text-dclr2"
                        />
                        <textarea
                          rows={2}
                          value={fase.descripcion}
                          onChange={(e) => updateFase(i, 'descripcion', e.target.value)}
                          placeholder="Descripción detallada de la fase..."
                          className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFase(i)}
                        className="px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg font-bold uppercase transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Símbolos & Mística */}
          {activeSubTab === 'simbolos' && (
            <div className="bg-clr1 dark:bg-dclr1 p-6 rounded-2xl border border-clr7 dark:border-dclr7 shadow-sm space-y-6">
              <h3 className="text-lg font-black font-display uppercase tracking-tight text-clr4 dark:text-dclr4 flex items-center gap-2">
                <span>🌟</span> Símbolos, Promesa, Ley y Mística
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Título de la Sección de Mística
                  </label>
                  <input
                    type="text"
                    value={formData.simbolos_data?.titulo || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        simbolos_data: { ...formData.simbolos_data, titulo: e.target.value },
                      })
                    }
                    placeholder="Ej: Marco Simbólico de la Manada"
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-bold text-clr2 dark:text-dclr2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3 mb-1">
                    Descripción del Marco Simbólico
                  </label>
                  <textarea
                    rows={2}
                    value={formData.simbolos_data?.descripcion || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        simbolos_data: { ...formData.simbolos_data, descripcion: e.target.value },
                      })
                    }
                    placeholder="Explicación general de los símbolos..."
                    className="w-full p-3 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-sm font-medium text-clr2 dark:text-dclr2"
                  />
                </div>
              </div>

              {/* Promesa y Ley */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-clr7 dark:border-dclr7 pt-4">
                {/* Promesa */}
                <div className="space-y-3 p-4 bg-clr7/10 rounded-2xl border border-clr7 dark:border-dclr7">
                  <h4 className="text-xs font-black uppercase tracking-wider text-clr2 dark:text-dclr2">
                    Compromiso / Promesa
                  </h4>
                  <input
                    type="text"
                    value={formData.simbolos_data?.promesa_titulo || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        simbolos_data: { ...formData.simbolos_data, promesa_titulo: e.target.value },
                      })
                    }
                    placeholder="Título (ej: La Promesa Scout)"
                    className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-bold text-clr2 dark:text-dclr2"
                  />
                  <textarea
                    rows={3}
                    value={formData.simbolos_data?.promesa_texto || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        simbolos_data: { ...formData.simbolos_data, promesa_texto: e.target.value },
                      })
                    }
                    placeholder='Texto de la promesa (ej: "Yo prometo...")'
                    className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2 italic"
                  />
                  <div>
                    <label className="block text-[0.7em] font-bold uppercase tracking-wider text-clr3 mb-1">
                      Puntos o significado (uno por línea)
                    </label>
                    <textarea
                      rows={3}
                      value={(formData.simbolos_data?.promesa_puntos || []).join('\n')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          simbolos_data: {
                            ...formData.simbolos_data,
                            promesa_puntos: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                          },
                        })
                      }
                      placeholder="Punto 1&#10;Punto 2"
                      className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2"
                    />
                  </div>
                </div>

                {/* Ley */}
                <div className="space-y-3 p-4 bg-clr7/10 rounded-2xl border border-clr7 dark:border-dclr7">
                  <h4 className="text-xs font-black uppercase tracking-wider text-clr2 dark:text-dclr2">
                    Código de Conducta / Ley
                  </h4>
                  <input
                    type="text"
                    value={formData.simbolos_data?.ley_titulo || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        simbolos_data: { ...formData.simbolos_data, ley_titulo: e.target.value },
                      })
                    }
                    placeholder="Título (ej: La Ley Scout)"
                    className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-bold text-clr2 dark:text-dclr2"
                  />
                  <div>
                    <label className="block text-[0.7em] font-bold uppercase tracking-wider text-clr3 mb-1">
                      Artículos o Reglas (uno por línea)
                    </label>
                    <textarea
                      rows={6}
                      value={(formData.simbolos_data?.ley_articulos || []).join('\n')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          simbolos_data: {
                            ...formData.simbolos_data,
                            ley_articulos: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                          },
                        })
                      }
                      placeholder="1. Es digno de confianza&#10;2. Es leal"
                      className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2"
                    />
                  </div>
                </div>
              </div>

              {/* Elementos Simbólicos Dinámicos */}
              <div className="space-y-4 border-t border-clr7 dark:border-dclr7 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-clr2 dark:text-dclr2">
                      Elementos Simbólicos e Insignias ({formData.simbolos_data?.elementos?.length || 0})
                    </h4>
                    <p className="text-xs text-clr3 dark:text-dclr3 font-medium">
                      Personaliza los símbolos de la unidad con imágenes o vectores en formato SVG.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addElemento}
                    className="px-3.5 py-2 bg-clr4 hover:bg-clr4/90 text-clr1 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                  >
                    + Agregar Símbolo
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {(formData.simbolos_data?.elementos || []).map((elem, i) => (
                    <div
                      key={i}
                      className="p-4 bg-clr7/15 dark:bg-dclr7/20 rounded-2xl border border-clr7 dark:border-dclr7 space-y-3 relative flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        {/* Caja de previsualización y subida de SVG */}
                        <div className="shrink-0 flex flex-col items-center gap-1.5">
                          <div className="w-20 h-20 rounded-2xl bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 p-2 flex items-center justify-center relative overflow-hidden shadow-inner group">
                            {elem.imagen_url ? (
                              <img
                                src={elem.imagen_url}
                                alt={elem.titulo || 'Símbolo'}
                                className="w-full h-full object-contain filter drop-shadow-sm"
                              />
                            ) : elem.icono ? (
                              <span className="text-3xl">{elem.icono}</span>
                            ) : (
                              <div className="text-center text-clr3 dark:text-dclr3">
                                <span className="text-2xl block">⚜️</span>
                                <span className="text-[0.65em] font-bold uppercase">Sin SVG</span>
                              </div>
                            )}
                          </div>

                          <label className="px-2 py-1 bg-clr4/10 hover:bg-clr4/20 text-clr4 rounded-lg text-[0.7em] font-black uppercase tracking-wider cursor-pointer transition-colors text-center w-full">
                            {uploadingField === `simbolo_${i}` ? 'Subiendo...' : '📁 Subir SVG'}
                            <input
                              type="file"
                              accept=".svg,image/svg+xml,image/*"
                              onChange={(e) => handleSimboloImageUpload(e, i)}
                              className="hidden"
                            />
                          </label>
                          {elem.imagen_url && (
                            <button
                              type="button"
                              onClick={() => updateElemento(i, 'imagen_url', '')}
                              className="text-[0.65em] text-red-500 hover:underline uppercase font-bold"
                            >
                              Quitar SVG
                            </button>
                          )}
                        </div>

                        {/* Campos de texto del símbolo */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={elem.titulo}
                              onChange={(e) => updateElemento(i, 'titulo', e.target.value)}
                              placeholder="Título del símbolo (ej: La Flor de Lis)"
                              className="flex-1 p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-bold text-clr2 dark:text-dclr2"
                            />
                            <button
                              type="button"
                              onClick={() => removeElemento(i)}
                              className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg font-bold"
                              title="Eliminar símbolo"
                            >
                              ✕
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={elem.descripcion}
                            onChange={(e) => updateElemento(i, 'descripcion', e.target.value)}
                            placeholder="Significado y mística del símbolo..."
                            className="w-full p-2 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2"
                          />

                          <input
                            type="text"
                            value={elem.imagen_url || ''}
                            onChange={(e) => updateElemento(i, 'imagen_url', e.target.value)}
                            placeholder="URL o ruta del SVG (ej: /images/logos/iconos_scouts.svg)"
                            className="w-full p-1.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-lg text-[0.75em] font-mono text-clr2 dark:text-dclr2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 5: Insignias & Bandera */}
          {activeSubTab === 'medios' && (
            <div className="bg-clr1 dark:bg-dclr1 p-6 rounded-2xl border border-clr7 dark:border-dclr7 shadow-sm space-y-4">
              <h3 className="text-lg font-black font-display uppercase tracking-tight text-clr4 dark:text-dclr4 flex items-center gap-2">
                <span>🖼️</span> Insignias, Escudos y Bandera de la Unidad
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo Unidad */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3">
                    Logo / Insignia de Unidad
                  </label>
                  {formData.logo_unidad_url && (
                    <div className="w-24 h-24 mx-auto p-2 bg-clr7/20 rounded-xl border border-clr7 flex items-center justify-center">
                      <img src={formData.logo_unidad_url} alt="Logo Unidad" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.logo_unidad_url}
                    onChange={(e) => setFormData({ ...formData, logo_unidad_url: e.target.value })}
                    placeholder="URL del logo"
                    className="w-full p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2"
                  />
                  <label className="block w-full text-center py-2 bg-clr7/30 hover:bg-clr7/50 dark:bg-dclr7/30 rounded-xl text-xs font-bold uppercase tracking-wider text-clr4 cursor-pointer transition-colors">
                    {uploadingField === 'logo_unidad_url' ? 'Subiendo...' : '📁 Subir Archivo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo_unidad_url')}
                      disabled={uploadingField === 'logo_unidad_url'}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Logo Rama */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3">
                    Insignia de Rama
                  </label>
                  {formData.logo_rama_url && (
                    <div className="w-24 h-24 mx-auto p-2 bg-clr7/20 rounded-xl border border-clr7 flex items-center justify-center">
                      <img src={formData.logo_rama_url} alt="Logo Rama" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.logo_rama_url}
                    onChange={(e) => setFormData({ ...formData, logo_rama_url: e.target.value })}
                    placeholder="URL del logo de rama"
                    className="w-full p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2"
                  />
                  <label className="block w-full text-center py-2 bg-clr7/30 hover:bg-clr7/50 dark:bg-dclr7/30 rounded-xl text-xs font-bold uppercase tracking-wider text-clr4 cursor-pointer transition-colors">
                    {uploadingField === 'logo_rama_url' ? 'Subiendo...' : '📁 Subir Archivo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo_rama_url')}
                      disabled={uploadingField === 'logo_rama_url'}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Bandera */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-clr3">
                    Imagen de Bandera (Hero Background)
                  </label>
                  {formData.bandera_url && (
                    <div className="w-full h-24 rounded-xl border border-clr7 overflow-hidden">
                      <img src={formData.bandera_url} alt="Bandera Unidad" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.bandera_url}
                    onChange={(e) => setFormData({ ...formData, bandera_url: e.target.value })}
                    placeholder="URL de la bandera"
                    className="w-full p-2.5 bg-clr1 dark:bg-dclr1 border border-clr7 dark:border-dclr7 rounded-xl text-xs font-medium text-clr2 dark:text-dclr2"
                  />
                  <label className="block w-full text-center py-2 bg-clr7/30 hover:bg-clr7/50 dark:bg-dclr7/30 rounded-xl text-xs font-bold uppercase tracking-wider text-clr4 cursor-pointer transition-colors">
                    {uploadingField === 'bandera_url' ? 'Subiendo...' : '📁 Subir Archivo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'bandera_url')}
                      disabled={uploadingField === 'bandera_url'}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Botón Guardar Cambios */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-clr4 hover:bg-clr4/90 text-clr1 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Guardando Cambios...' : `💾 Guardar Todo de ${formData.nombre}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
