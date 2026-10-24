'use client'

import React, { useState } from 'react'
import type { CampamentoReceta, RecetaIngredienteItem, TiempoComidaTipo, CategoriaInsumo, CategoriaPlatoReceta } from '@/types/campamento-menu'
import { obtenerCategoriasReceta } from '@/types/campamento-menu'

interface Props {
  recetas: CampamentoReceta[]
  isOpen: boolean
  onClose: () => void
  onSaveReceta: (receta: CampamentoReceta) => void
  onDeleteReceta?: (recetaId: string) => void
}

const CATEGORIAS_INSUMO: CategoriaInsumo[] = [
  'Abarrotes',
  'Panadería',
  'Verdulería',
  'Carnicería',
  'Lácteos',
  'Condimentos y Aceites',
  'Bebidas',
  'Aseo y Cocina'
]

const CATEGORIAS_PLATO: CategoriaPlatoReceta[] = [
  'Bebida',
  'Liquido',
  'Plato Principal',
  'Agregado',
  'Agregado para Pan',
  'Alternativa',
  'Ensalada',
  'Fruta',
  'Postre',
  'Sopa'
]

const TIEMPOS_COMIDA: { id: TiempoComidaTipo; label: string }[] = [
  { id: 'desayuno', label: '🌅 Desayuno' },
  { id: 'almuerzo', label: '🍲 Almuerzo' },
  { id: 'bano_fruta', label: '🍎 Colación / Fruta' },
  { id: 'once', label: '☕ Once' },
  { id: 'cena', label: '🥣 Cena' }
]

export const CampamentoRecetasModal: React.FC<Props> = ({
  recetas,
  isOpen,
  onClose,
  onSaveReceta,
  onDeleteReceta
}) => {
  const [filtroTiempo, setFiltroTiempo] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [recetaEditando, setRecetaEditando] = useState<CampamentoReceta | null>(null)
  const [busqueda, setBusqueda] = useState('')

  if (!isOpen) return null

  const recetasFiltradas = recetas.filter(r => {
    const coincideTiempo = filtroTiempo === 'todos' || r.tipo_comida === filtroTiempo
    const rCats = obtenerCategoriasReceta(r)
    const coincideCategoria = filtroCategoria === 'todas' || rCats.includes(filtroCategoria)
    const coincideBusqueda =
      !busqueda ||
      r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.ingredientes.some(i => i.ingrediente_nombre.toLowerCase().includes(busqueda.toLowerCase()))
    return coincideTiempo && coincideCategoria && coincideBusqueda
  })

  const iniciarNuevaReceta = () => {
    setRecetaEditando({
      id: `rec-custom-${Date.now()}`,
      nombre: '',
      tipo_comida: 'almuerzo',
      categoria_plato: 'Plato Principal',
      categorias_plato: ['Plato Principal'],
      porciones_base: 10,
      instrucciones: '',
      es_vegetariano: false,
      es_sin_lactosa: false,
      es_sin_gluten: false,
      ingredientes: [
        {
          id: `ing-${Date.now()}-1`,
          ingrediente_nombre: '',
          categoria: 'Abarrotes',
          cantidad_base: 1,
          unidad_medida: 'kg',
          precio_referencia_unitario: 1000
        }
      ]
    })
  }

  const toggleCategoriaReceta = (cat: CategoriaPlatoReceta) => {
    if (!recetaEditando) return
    const actuales = obtenerCategoriasReceta(recetaEditando)
    const nuevas = actuales.includes(cat)
      ? actuales.filter(c => c !== cat)
      : [...actuales, cat]
    setRecetaEditando({
      ...recetaEditando,
      categoria_plato: (nuevas[0] as CategoriaPlatoReceta) || undefined,
      categorias_plato: nuevas as CategoriaPlatoReceta[]
    })
  }

  const agregarIngredienteFila = () => {
    if (!recetaEditando) return
    setRecetaEditando({
      ...recetaEditando,
      ingredientes: [
        ...recetaEditando.ingredientes,
        {
          id: `ing-${Date.now()}-${Math.random()}`,
          ingrediente_nombre: '',
          categoria: 'Verdulería',
          cantidad_base: 1,
          unidad_medida: 'unidad',
          precio_referencia_unitario: 500
        }
      ]
    })
  }

  const eliminarIngredienteFila = (index: number) => {
    if (!recetaEditando) return
    const nuevos = [...recetaEditando.ingredientes]
    nuevos.splice(index, 1)
    setRecetaEditando({ ...recetaEditando, ingredientes: nuevos })
  }

  const actualizarIngrediente = (
    index: number,
    campo: keyof RecetaIngredienteItem,
    valor: any
  ) => {
    if (!recetaEditando) return
    const nuevos = [...recetaEditando.ingredientes]
    nuevos[index] = { ...nuevos[index], [campo]: valor }
    setRecetaEditando({ ...recetaEditando, ingredientes: nuevos })
  }

  const guardarReceta = (e: React.FormEvent) => {
    e.preventDefault()
    if (!recetaEditando) return
    if (!recetaEditando.nombre.trim()) {
      alert('Debes ingresar un nombre para la preparación o plato.')
      return
    }
    const cats = obtenerCategoriasReceta(recetaEditando)
    if (cats.length === 0) {
      alert('Debes seleccionar al menos una clasificación o categoría para la receta.')
      return
    }
    onSaveReceta({
      ...recetaEditando,
      categoria_plato: (cats[0] as CategoriaPlatoReceta) || undefined,
      categorias_plato: cats as CategoriaPlatoReceta[]
    })
    setRecetaEditando(null)
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-5xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-[1em]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2">
          <div>
            <h2 className="text-[1.2em] font-semibold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
              <span>📖</span> Catálogo de Fichas de Comida y Recetas
            </h2>
            <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
              Define los ingredientes con sus cantidades de rendimiento para la base de comensales.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 p-2 text-[1.2em]"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {recetaEditando ? (
            /* Formulario de Edición de Ficha */
            <form onSubmit={guardarReceta} className="space-y-6">
              <div className="flex items-center justify-between border-b border-pclr13 dark:border-pdclr13 pb-3">
                <h3 className="text-[1.1em] font-semibold text-pclr4 dark:text-pdclr4">
                  {recetaEditando.id.includes('custom') ? '✨ Nueva Ficha de Preparación' : `✏️ Editar: ${recetaEditando.nombre}`}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRecetaEditando(null)}
                    className="px-4 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr4 dark:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3 transition"
                  >
                    Volver a la lista
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg shadow-sm transition"
                  >
                    Guardar Ficha
                  </button>
                </div>
              </div>

              {/* Datos generales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Nombre del Plato / Preparación
                  </label>
                  <input
                    type="text"
                    required
                    value={recetaEditando.nombre}
                    onChange={e => setRecetaEditando({ ...recetaEditando, nombre: e.target.value })}
                    placeholder="Ej: Charquicán Campesino, Tomaticán, etc."
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 text-[1em]"
                  />
                </div>

                <div>
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Tiempo de Comida Base
                  </label>
                  <select
                    value={recetaEditando.tipo_comida}
                    onChange={e => setRecetaEditando({ ...recetaEditando, tipo_comida: e.target.value as TiempoComidaTipo })}
                    className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 text-[1em]"
                  >
                    {TIEMPOS_COMIDA.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                    Base de Comensales (Rendimiento estándar)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={recetaEditando.porciones_base}
                      onChange={e => setRecetaEditando({ ...recetaEditando, porciones_base: Number(e.target.value) || 10 })}
                      className="w-full max-w-[150px] px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 text-[1em]"
                    />
                    <span className="text-pclr7 dark:text-pdclr7 text-[0.9em] whitespace-nowrap">personas</span>
                  </div>
                </div>

                {/* Selección Múltiple de Clasificaciones */}
                <div className="md:col-span-3 pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[0.9em] font-medium text-pclr4 dark:text-pdclr4">
                      Clasificación del Alimento (puedes seleccionar más de una opción) *
                    </label>
                    <span className="text-[0.8em] text-pclr7 dark:text-pdclr7">
                      {obtenerCategoriasReceta(recetaEditando).length} seleccionadas
                    </span>
                  </div>
                  <p className="text-[0.8em] text-pclr7 dark:text-pdclr7 mb-2">
                    Determina en cuáles slots del menú se podrá buscar y elegir esta receta (ej: una preparación puede ser Plato Principal y Agregado a la vez).
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIAS_PLATO.map(cat => {
                      const seleccionada = obtenerCategoriasReceta(recetaEditando).includes(cat)
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategoriaReceta(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition border ${
                            seleccionada
                              ? 'bg-[#cb3327] text-white border-[#b02920] shadow-xs'
                              : 'bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 border-pclr13 dark:border-pdclr13 hover:bg-pclr3 dark:hover:bg-pdclr3'
                          }`}
                        >
                          {seleccionada ? '✓ ' : '+ '}{cat}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-pclr4 dark:text-pdclr4">
                    <input
                      type="checkbox"
                      checked={recetaEditando.es_vegetariano || false}
                      onChange={e => setRecetaEditando({ ...recetaEditando, es_vegetariano: e.target.checked })}
                      className="rounded border-pclr13 dark:border-pdclr13 text-[#cb3327] focus:ring-[#cb3327]"
                    />
                    <span>🌱 Apto Vegetariano</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-pclr4 dark:text-pdclr4">
                    <input
                      type="checkbox"
                      checked={recetaEditando.es_sin_lactosa || false}
                      onChange={e => setRecetaEditando({ ...recetaEditando, es_sin_lactosa: e.target.checked })}
                      className="rounded border-pclr13 dark:border-pdclr13 text-[#cb3327] focus:ring-[#cb3327]"
                    />
                    <span>🥛 Sin Lactosa</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-pclr4 dark:text-pdclr4">
                    <input
                      type="checkbox"
                      checked={recetaEditando.es_sin_gluten || false}
                      onChange={e => setRecetaEditando({ ...recetaEditando, es_sin_gluten: e.target.checked })}
                      className="rounded border-pclr13 dark:border-pdclr13 text-[#cb3327] focus:ring-[#cb3327]"
                    />
                    <span>🌾 Sin Gluten</span>
                  </label>
                </div>
              </div>

              {/* Desglose de Ingredientes con Formato de Contenedor y Rendimiento Oficial */}
              <div className="border border-pclr13 dark:border-pdclr13 rounded-xl p-4 bg-pclr2 dark:bg-pdclr2/50 dark:bg-pdclr3/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="font-semibold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
                      <span>🥗</span> Ingredientes para base de {recetaEditando.porciones_base} personas
                    </h4>
                    <p className="text-[0.8em] text-pclr7 dark:text-pdclr7">
                      Indica la cantidad neta de la receta, el contenedor comercial (ej: Malla 1kg, Cajón 18kg), para cuántas personas alcanza y el valor referencial de internet.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={agregarIngredienteFila}
                    className="px-3 py-1.5 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 hover:bg-pclr3/80 rounded-lg text-[0.9em] font-medium transition whitespace-nowrap self-start sm:self-auto"
                  >
                    + Agregar Ingrediente
                  </button>
                </div>

                <div className="space-y-3">
                  {recetaEditando.ingredientes.map((ing, idx) => {
                    const cant = Number(ing.cantidad_base) || 0
                    const valRef = Number(ing.valor_referencia_contenedor || ing.precio_referencia_unitario) || 0
                    const costoEst = cant * valRef

                    return (
                      <div
                        key={ing.id || idx}
                        className="bg-pclr1 dark:bg-pdclr1 p-3 rounded-xl border border-pclr13 dark:border-pdclr13 space-y-2 shadow-xs"
                      >
                        <div className="grid grid-cols-12 gap-2 items-center">
                          {/* 1. Nombre Ingrediente */}
                          <div className="col-span-12 sm:col-span-4">
                            <label className="block text-[0.8em] font-semibold text-pclr7 dark:text-pdclr7 mb-0.5">Ingrediente</label>
                            <input
                              type="text"
                              required
                              value={ing.ingrediente_nombre}
                              onChange={e => actualizarIngrediente(idx, 'ingrediente_nombre', e.target.value)}
                              placeholder="Ej: Zanahoria, Arroz, Papas"
                              className="w-full px-2.5 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                            />
                          </div>

                          {/* 2. Categoría */}
                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-[0.8em] font-semibold text-pclr7 dark:text-pdclr7 mb-0.5">Categoría</label>
                            <select
                              value={ing.categoria}
                              onChange={e => actualizarIngrediente(idx, 'categoria', e.target.value)}
                              className="w-full px-2 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                            >
                              {CATEGORIAS_INSUMO.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          {/* 3. Cantidad neta en la receta */}
                          <div className="col-span-3 sm:col-span-2">
                            <label className="block text-[0.8em] font-semibold text-pclr7 dark:text-pdclr7 mb-0.5">Cantidad</label>
                            <input
                              type="number"
                              step="0.05"
                              min="0.01"
                              required
                              value={ing.cantidad_base}
                              onChange={e => actualizarIngrediente(idx, 'cantidad_base', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                            />
                          </div>

                          {/* 4. Unidad de Medida */}
                          <div className="col-span-3 sm:col-span-2">
                            <label className="block text-[0.8em] font-semibold text-pclr7 dark:text-pdclr7 mb-0.5">Unidad</label>
                            <select
                              value={ing.unidad_medida}
                              onChange={e => actualizarIngrediente(idx, 'unidad_medida', e.target.value)}
                              className="w-full px-2 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                            >
                              <option value="unidad">unidad(es)</option>
                              <option value="kg">kg</option>
                              <option value="litro">litro(s)</option>
                              <option value="paquete">paquete(s)</option>
                              <option value="sobre">sobre(s)</option>
                              <option value="lata">lata(s)</option>
                              <option value="bolsa">bolsa(s)</option>
                            </select>
                          </div>

                          {/* Botón Eliminar */}
                          <div className="col-span-12 sm:col-span-1 flex justify-end sm:justify-center">
                            <button
                              type="button"
                              onClick={() => eliminarIngredienteFila(idx)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                              title="Eliminar ingrediente"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Fila secundaria: Contenedor comercial, Rendimiento comensales y Valor Ref */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 p-2 rounded-lg text-[0.9em]">
                          <div>
                            <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 font-semibold block">Contenedor de... (Formato de compra)</span>
                            <input
                              type="text"
                              value={ing.contenedor_formato || ''}
                              onChange={e => actualizarIngrediente(idx, 'contenedor_formato', e.target.value)}
                              placeholder="Ej: Malla 1kg / Cajón 18kg"
                              className="w-full px-2 py-1 border border-pclr13 dark:border-pdclr13 rounded bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                            />
                          </div>

                          <div>
                            <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 font-semibold block">Alcanza para... (Personas)</span>
                            <input
                              type="number"
                              min="1"
                              value={ing.rendimiento_personas_por_contenedor || ''}
                              onChange={e => actualizarIngrediente(idx, 'rendimiento_personas_por_contenedor', Number(e.target.value) || undefined)}
                              placeholder="Ej: 10 personas"
                              className="w-full px-2 py-1 border border-pclr13 dark:border-pdclr13 rounded bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                            />
                          </div>

                          <div>
                            <span className="text-[0.8em] text-pclr7 dark:text-pdclr7 font-semibold block">Valor Ref. ($ CLP internet)</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-pclr7 dark:text-pdclr7 font-bold">$</span>
                              <input
                                type="number"
                                min="0"
                                value={ing.valor_referencia_contenedor || ing.precio_referencia_unitario || 0}
                                onChange={e => {
                                  const val = Number(e.target.value) || 0
                                  actualizarIngrediente(idx, 'valor_referencia_contenedor', val)
                                  actualizarIngrediente(idx, 'precio_referencia_unitario', val)
                                }}
                                className="w-full px-2 py-1 border border-pclr13 dark:border-pdclr13 rounded bg-pclr3 dark:bg-pdclr3 text-[0.9em] font-bold text-emerald-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Instrucciones */}
              <div>
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Instrucciones o Recomendaciones de Cocina para la Unidad de Turno
                </label>
                <textarea
                  rows={3}
                  value={recetaEditando.instrucciones || ''}
                  onChange={e => setRecetaEditando({ ...recetaEditando, instrucciones: e.target.value })}
                  placeholder="Detalla cómo cocer, sofreír o servir la preparación en el campamento..."
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 text-[0.9em]"
                />
              </div>
            </form>
          ) : (
            /* Vista de Lista de Recetas */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-[0.9em] font-medium text-pclr7 dark:text-pdclr7">Filtrar por:</span>
                  <button
                    onClick={() => setFiltroTiempo('todos')}
                    className={`px-3 py-1 rounded-full text-[0.8em] transition ${
                      filtroTiempo === 'todos'
                        ? 'bg-[#cb3327] text-white font-medium'
                        : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7'
                    }`}
                  >
                    Todos ({recetas.length})
                  </button>
                  {TIEMPOS_COMIDA.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setFiltroTiempo(t.id)}
                      className={`px-3 py-1 rounded-full text-[0.8em] transition ${
                        filtroTiempo === t.id
                          ? 'bg-[#cb3327] text-white font-medium'
                          : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar plato o ingrediente..."
                    className="px-3 py-1.5 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em] w-full sm:w-60"
                  />
                  <button
                    onClick={iniciarNuevaReceta}
                    className="px-4 py-1.5 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg text-[0.9em] whitespace-nowrap shadow-sm transition"
                  >
                    + Nueva Ficha
                  </button>
                </div>
              </div>

              {/* Filtro por Categorías Literales */}
              <div className="flex gap-1.5 flex-wrap items-center pt-2 border-t border-pclr13 dark:border-pdclr13">
                <span className="text-[0.8em] font-medium text-pclr7 dark:text-pdclr7">Categoría:</span>
                <button
                  type="button"
                  onClick={() => setFiltroCategoria('todas')}
                  className={`px-2.5 py-0.5 rounded-md text-[0.8em] transition ${
                    filtroCategoria === 'todas'
                      ? 'bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-medium shadow-xs'
                      : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
                  }`}
                >
                  Todas
                </button>
                {CATEGORIAS_PLATO.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFiltroCategoria(cat)}
                    className={`px-2.5 py-0.5 rounded-md text-[0.8em] transition ${
                      filtroCategoria === cat
                        ? 'bg-pclr10 dark:bg-pdclr10 text-pclr12 dark:text-pdclr12 font-medium shadow-xs'
                        : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid de Fichas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {recetasFiltradas.map(rec => (
                  <div
                    key={rec.id}
                    className="border border-pclr13 dark:border-pdclr13 rounded-xl p-4 bg-pclr1 dark:bg-pdclr1 hover:border-pclr8 dark:hover:border-pdclr8 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[0.8em] uppercase font-semibold text-[#cb3327] tracking-wider">
                              {rec.tipo_comida}
                            </span>
                            {obtenerCategoriasReceta(rec).map(cat => (
                              <span
                                key={cat}
                                className="px-1.5 py-0.2 rounded bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 text-[0.8em] font-medium border border-pclr13 dark:border-pdclr13"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                          <h4 className="font-semibold text-pclr4 dark:text-pdclr4 text-[1.05em] mt-0.5">
                            {rec.nombre}
                          </h4>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setRecetaEditando(rec)}
                            className="p-1.5 hover:bg-pclr3 dark:hover:bg-pdclr3 rounded text-pclr7 dark:text-pdclr7 text-[0.9em]"
                            title="Editar preparación"
                          >
                            ✏️ Editar
                          </button>
                          {onDeleteReceta && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar la ficha "${rec.nombre}"?`)) {
                                  onDeleteReceta(rec.id)
                                }
                              }}
                              className="p-1.5 hover:bg-pclr3 dark:hover:bg-pdclr3 rounded text-red-500 text-[0.9em]"
                              title="Eliminar preparación"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-pclr3 dark:bg-pdclr3 rounded text-[0.8em] text-pclr7 dark:text-pdclr7">
                          Base: {rec.porciones_base} personas
                        </span>
                        {rec.es_vegetariano && (
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded text-[0.8em]">
                            🌱 Veg
                          </span>
                        )}
                        {rec.es_sin_lactosa && (
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded text-[0.8em]">
                            🥛 Sin Lactosa
                          </span>
                        )}
                      </div>

                      {/* Lista resumida de ingredientes */}
                      <div className="mt-3 pt-3 border-t border-pclr13 dark:border-pdclr13">
                        <p className="text-[0.8em] font-medium text-pclr7 dark:text-pdclr7 mb-1">
                          Ingredientes ({rec.ingredientes.length}):
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.ingredientes.map(i => (
                            <span
                              key={i.id}
                              className="px-2 py-0.5 bg-pclr2 dark:bg-pdclr2 border border-pclr13 dark:border-pdclr13 rounded text-[0.8em] text-pclr4 dark:text-pdclr4"
                            >
                              {i.ingrediente_nombre} ({i.cantidad_base} {i.unidad_medida})
                            </span>
                          ))}
                        </div>
                      </div>

                      {rec.instrucciones && (
                        <p className="mt-2 text-[0.8em] text-pclr7 dark:text-pdclr7 italic line-clamp-2">
                          "{rec.instrucciones}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-pclr3 dark:bg-pdclr3 hover:bg-pclr3 dark:hover:bg-pdclr3 text-pclr4 dark:text-pdclr4 font-medium rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

