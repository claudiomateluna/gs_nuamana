'use client'

import React, { useState } from 'react'
import type {
  CampamentoPlantillaComida,
  CampamentoReceta,
  TiempoComidaTipo
} from '@/types/campamento-menu'
import { RecetaMultiBuscador } from './RecetaMultiBuscador'

interface Props {
  plantillas: CampamentoPlantillaComida[]
  recetas: CampamentoReceta[]
  isOpen: boolean
  onClose: () => void
  onSavePlantilla: (plantilla: CampamentoPlantillaComida) => void
  onDeletePlantilla: (plantillaId: string) => void
}

const TIEMPO_ETIQUETAS: Record<TiempoComidaTipo, { label: string; icon: string }> = {
  desayuno: { label: 'Desayuno', icon: '🌅' },
  almuerzo: { label: 'Almuerzo', icon: '🍲' },
  bano_fruta: { label: 'Baños y Fruta', icon: '🍎' },
  once: { label: 'Once', icon: '☕' },
  cena: { label: 'Cena', icon: '🥣' }
}

export const CampamentoPlantillasModal: React.FC<Props> = ({
  plantillas,
  recetas,
  isOpen,
  onClose,
  onSavePlantilla,
  onDeletePlantilla
}) => {
  const [filtroTipo, setFiltroTipo] = useState<TiempoComidaTipo | 'todos'>('todos')
  const [plantillaEditando, setPlantillaEditando] = useState<CampamentoPlantillaComida | null>(null)

  if (!isOpen) return null

  const plantillasFiltradas = plantillas.filter(p =>
    filtroTipo === 'todos' ? true : p.tipo_comida === filtroTipo
  )

  const handleCrearNueva = () => {
    const nueva: CampamentoPlantillaComida = {
      id: `plt-custom-${Date.now()}`,
      nombre: '',
      tipo_comida: filtroTipo === 'todos' ? 'once' : filtroTipo,
      descripcion: '',
      bebidas_ids: [],
      plato_principal_ids: [],
      agregados_ids: [],
      alternativas_ids: [],
      ensaladas_ids: [],
      postres_ids: [],
      sopas_ids: [],
      recetas_ids: [],
      is_custom: true
    }
    setPlantillaEditando(nueva)
  }

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!plantillaEditando) return
    if (!plantillaEditando.nombre.trim()) {
      alert('Por favor indica un nombre descriptivo para la plantilla.')
      return
    }

    // Consolidar todos los slots en recetas_ids
    const todasLasRecetas = Array.from(
      new Set([
        ...(plantillaEditando.bebidas_ids || []),
        ...(plantillaEditando.plato_principal_ids || []),
        ...(plantillaEditando.agregados_ids || []),
        ...(plantillaEditando.alternativas_ids || []),
        ...(plantillaEditando.ensaladas_ids || []),
        ...(plantillaEditando.postres_ids || []),
        ...(plantillaEditando.sopas_ids || [])
      ])
    )

    if (todasLasRecetas.length === 0) {
      alert('Debes agregar al menos una receta en alguno de los slots de la plantilla.')
      return
    }

    onSavePlantilla({
      ...plantillaEditando,
      recetas_ids: todasLasRecetas,
      updated_at: new Date().toISOString()
    })
    setPlantillaEditando(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[1em]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2">
          <div>
            <h2 className="text-[1.25em] font-bold text-pclr4 dark:text-pdclr4 flex items-center gap-2">
              <span>🍱</span> Catálogo de Plantillas de Menú
            </h2>
            <p className="text-[0.85em] text-pclr7 dark:text-pdclr7">
              Predefine todos los alimentos en sus slots correspondientes para autocompletar el cronograma con un clic.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 dark:hover:text-pdclr4 text-[1.2em] p-1"
          >
            ✕
          </button>
        </div>

        {/* Contenido / Vista Lista o Editor */}
        {!plantillaEditando ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Filtros por tiempo de comida y botón Crear */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setFiltroTipo('todos')}
                  className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition ${
                    filtroTipo === 'todos'
                      ? 'bg-[#cb3327] text-white shadow-sm'
                      : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
                  }`}
                >
                  Todas ({plantillas.length})
                </button>
                {(['desayuno', 'almuerzo', 'once', 'cena'] as TiempoComidaTipo[]).map(t => {
                  const count = plantillas.filter(p => p.tipo_comida === t).length
                  const info = TIEMPO_ETIQUETAS[t]
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFiltroTipo(t)}
                      className={`px-3 py-1.5 rounded-lg text-[0.85em] font-medium transition ${
                        filtroTipo === t
                          ? 'bg-[#cb3327] text-white shadow-sm'
                          : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 dark:text-pdclr7 hover:bg-pclr3 dark:hover:bg-pdclr3'
                      }`}
                    >
                      {info.icon} {info.label} ({count})
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={handleCrearNueva}
                className="px-4 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg text-[0.9em] shadow-sm transition flex items-center gap-2"
              >
                <span>➕</span> Crear Plantilla de Menú
              </button>
            </div>

            {/* Listado de Plantillas en Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plantillasFiltradas.map(plantilla => {
                const todasIds = Array.from(
                  new Set([
                    ...(plantilla.bebidas_ids || []),
                    ...(plantilla.plato_principal_ids || []),
                    ...(plantilla.agregados_ids || []),
                    ...(plantilla.alternativas_ids || []),
                    ...(plantilla.ensaladas_ids || []),
                    ...(plantilla.postres_ids || []),
                    ...(plantilla.sopas_ids || []),
                    ...(plantilla.recetas_ids || [])
                  ])
                )

                const recetasAsignadas = todasIds
                  .map(id => recetas.find(r => r.id === id))
                  .filter(Boolean) as CampamentoReceta[]

                const info = TIEMPO_ETIQUETAS[plantilla.tipo_comida]

                return (
                  <div
                    key={plantilla.id}
                    className="border border-pclr13 dark:border-pdclr13 rounded-xl p-4 bg-pclr1 dark:bg-pdclr1 hover:shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.8em] font-semibold bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4">
                            <span>{info?.icon}</span> {info?.label || plantilla.tipo_comida}
                          </span>
                          <h4 className="text-[1.05em] font-bold text-pclr4 dark:text-pdclr4 mt-1">
                            {plantilla.nombre}
                          </h4>
                        </div>
                        {plantilla.is_custom && (
                          <span className="px-1.5 py-0.5 text-[0.8em] rounded bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-medium">
                            Personalizada
                          </span>
                        )}
                      </div>

                      {plantilla.descripcion && (
                        <p className="text-[0.85em] text-pclr7 dark:text-pdclr7 line-clamp-2">
                          {plantilla.descripcion}
                        </p>
                      )}

                      {/* Recetas Atómicas Vinculadas */}
                      <div className="pt-2 border-t border-pclr13 dark:border-pdclr13">
                        <span className="text-[0.8em] font-semibold uppercase tracking-wider text-pclr7 dark:text-pdclr7 block mb-1">
                          Alimentos predefinidos ({recetasAsignadas.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {recetasAsignadas.length > 0 ? (
                            recetasAsignadas.map(rec => (
                              <span
                                key={rec.id}
                                className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/40 text-[0.8em] font-medium"
                              >
                                {rec.nombre}
                              </span>
                            ))
                          ) : (
                            <span className="text-[0.8em] text-rose-500 italic">
                              Sin recetas asignadas
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-pclr13 dark:border-pdclr13">
                      <button
                        type="button"
                        onClick={() => setPlantillaEditando(plantilla)}
                        className="px-3 py-1 text-[0.85em] border border-pclr13 dark:border-pdclr13 rounded-lg hover:bg-pclr3 dark:hover:bg-pdclr3 font-medium transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Eliminar la plantilla "${plantilla.nombre}"?`)) {
                            onDeletePlantilla(plantilla.id)
                          }
                        }}
                        className="px-2.5 py-1 text-[0.85em] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Editor de Plantilla Estructurada */
          <form onSubmit={handleGuardar} className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-pclr13 dark:border-pdclr13">
              <h3 className="text-[1.15em] font-bold text-pclr4 dark:text-pdclr4">
                {plantillaEditando.nombre ? `Editar: ${plantillaEditando.nombre}` : 'Nueva Plantilla de Menú'}
              </h3>
              <button
                type="button"
                onClick={() => setPlantillaEditando(null)}
                className="text-[0.85em] text-pclr7 dark:text-pdclr7 hover:underline"
              >
                ← Volver al listado
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Nombre de la Plantilla *
                </label>
                <input
                  type="text"
                  required
                  value={plantillaEditando.nombre}
                  onChange={e => setPlantillaEditando({ ...plantillaEditando, nombre: e.target.value })}
                  placeholder="Ej: Once Scout: Té con Pan y Huevos Revueltos"
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em]"
                />
              </div>

              <div>
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Tiempo de Comida
                </label>
                <select
                  value={plantillaEditando.tipo_comida}
                  onChange={e => setPlantillaEditando({ ...plantillaEditando, tipo_comida: e.target.value as TiempoComidaTipo })}
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[1em]"
                >
                  <option value="desayuno">🌅 Desayuno</option>
                  <option value="almuerzo">🍲 Almuerzo</option>
                  <option value="bano_fruta">🍎 Baños y Fruta</option>
                  <option value="once">☕ Once</option>
                  <option value="cena">🥣 Cena</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[0.9em] font-medium text-pclr4 dark:text-pdclr4 mb-1">
                  Descripción o Recomendación de Servicio
                </label>
                <textarea
                  rows={2}
                  value={plantillaEditando.descripcion || ''}
                  onChange={e => setPlantillaEditando({ ...plantillaEditando, descripcion: e.target.value })}
                  placeholder="Ej: Servir el té bien caliente en fondo de campamento..."
                  className="w-full px-3 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg bg-pclr3 dark:bg-pdclr3 text-[0.9em]"
                />
              </div>
            </div>

            {/* Configuración de Slots Culinarios con Nombres Literales */}
            <div className="space-y-4 pt-3 border-t border-pclr13 dark:border-pdclr13">
              <h4 className="text-[1.05em] font-bold text-pclr4 dark:text-pdclr4">
                Predefinir Alimentos en los Slots
              </h4>

              {/* Slot 1: Bebida o Liquido */}
              <RecetaMultiBuscador
                label="Bebida o Liquido"
                subtitulo="Recetas categorizadas como Bebida o Liquido (ej: Leche, Leche con Chocolate, Té, Jugo, Bebida Carbonada, Agua, etc.)"
                placeholder="Buscar Leche, Leche con Chocolate, Té, Jugo, Bebida Carbonada, Agua..."
                recetasDisponibles={recetas}
                categoriasPermitidas={['Bebida', 'Liquido']}
                seleccionadosIds={plantillaEditando.bebidas_ids || []}
                onChange={ids => setPlantillaEditando({ ...plantillaEditando, bebidas_ids: ids })}
              />

              {/* Slot 2: Plato Principal */}
              <RecetaMultiBuscador
                label="Plato Principal"
                subtitulo="Recetas categorizadas como Plato Principal o Agregado"
                placeholder="Buscar Plato Principal o Agregado..."
                recetasDisponibles={recetas}
                categoriasPermitidas={['Plato Principal', 'Agregado']}
                seleccionadosIds={plantillaEditando.plato_principal_ids || []}
                onChange={ids => setPlantillaEditando({ ...plantillaEditando, plato_principal_ids: ids })}
              />

              {/* Slot 3: Agregado */}
              <RecetaMultiBuscador
                label="Agregado"
                subtitulo="Recetas categorizadas como Agregado o Agregado para Pan"
                placeholder="Buscar Agregado o Agregado para Pan..."
                recetasDisponibles={recetas}
                categoriasPermitidas={['Agregado', 'Agregado para Pan']}
                seleccionadosIds={plantillaEditando.agregados_ids || []}
                onChange={ids => setPlantillaEditando({ ...plantillaEditando, agregados_ids: ids })}
              />

              {/* Slot 4: Alternativa */}
              <RecetaMultiBuscador
                label="Alternativa"
                subtitulo="Recetas categorizadas como Alternativa, Plato Principal, Agregado o Agregado para Pan"
                placeholder="Buscar Alternativa, Plato Principal, Agregado o Agregado para Pan..."
                recetasDisponibles={recetas}
                categoriasPermitidas={['Alternativa', 'Plato Principal', 'Agregado', 'Agregado para Pan']}
                seleccionadosIds={plantillaEditando.alternativas_ids || []}
                onChange={ids => setPlantillaEditando({ ...plantillaEditando, alternativas_ids: ids })}
              />

              {/* Slot 5: Ensalada */}
              <RecetaMultiBuscador
                label="Ensalada"
                subtitulo="Recetas categorizadas como Ensalada o Fruta"
                placeholder="Buscar Ensalada o Fruta..."
                recetasDisponibles={recetas}
                categoriasPermitidas={['Ensalada', 'Fruta']}
                seleccionadosIds={plantillaEditando.ensaladas_ids || []}
                onChange={ids => setPlantillaEditando({ ...plantillaEditando, ensaladas_ids: ids })}
              />

              {/* Slot 6: Postre (Almuerzo, Cena, Fruta o plantilla libre) */}
              {(plantillaEditando.tipo_comida === 'almuerzo' ||
                plantillaEditando.tipo_comida === 'cena' ||
                plantillaEditando.tipo_comida === 'bano_fruta') && (
                <RecetaMultiBuscador
                  label="Postre"
                  subtitulo="Recetas categorizadas como Fruta o Postre"
                  placeholder="Buscar Fruta o Postre..."
                  recetasDisponibles={recetas}
                  categoriasPermitidas={['Fruta', 'Postre']}
                  seleccionadosIds={plantillaEditando.postres_ids || []}
                  onChange={ids => setPlantillaEditando({ ...plantillaEditando, postres_ids: ids })}
                />
              )}

              {/* Slot 7: Sopa (Cena) */}
              {plantillaEditando.tipo_comida === 'cena' && (
                <RecetaMultiBuscador
                  label="Sopa"
                  subtitulo="Recetas categorizadas como Sopa"
                  placeholder="Buscar Sopa..."
                  recetasDisponibles={recetas}
                  categoriasPermitidas={['Sopa']}
                  seleccionadosIds={plantillaEditando.sopas_ids || []}
                  onChange={ids => setPlantillaEditando({ ...plantillaEditando, sopas_ids: ids })}
                />
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-pclr13 dark:border-pdclr13">
              <button
                type="button"
                onClick={() => setPlantillaEditando(null)}
                className="px-4 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr4 dark:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3 transition text-[0.9em]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#cb3327] hover:bg-[#b02920] text-white font-medium rounded-lg shadow-sm transition text-[0.9em]"
              >
                Guardar Plantilla
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-pclr13 dark:border-pdclr13 bg-pclr2 dark:bg-pdclr2 flex items-center justify-between text-[0.85em] text-pclr7 dark:text-pdclr7">
          <span>Las plantillas guardadas autocompletan todos los slots en el cronograma.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-pclr7 dark:text-pdclr7 hover:underline"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  )
}
