'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type {
  CampamentoMenu,
  CampamentoReceta,
  CampamentoPlantillaComida,
  CampamentoMenuBloque
} from '@/types/campamento-menu'
import { distribuirRecetasEnSlots } from '@/types/campamento-menu'
import {
  DEFAULT_RECETAS,
  DEFAULT_PLANTILLAS,
  DEFAULT_INSUMOS_CATALOGO,
  DEFAULT_PROVEEDORES,
  DEFAULT_PROVEEDORES_URLS,
  generarMenuPredeterminado,
  generarMenuEnBlanco
} from '@/lib/campamento-menu-presets'
import {
  calcularPresupuestoYCompras
} from '@/utils/campamento-menu-calculator'
import { db, type ActividadProgramadaOffline } from '@/lib/db'
import { CampamentoCronogramaMenu } from './CampamentoCronogramaMenu'
import { CampamentoListaCompras } from './CampamentoListaCompras'
import { CampamentoPresupuestoResumen } from './CampamentoPresupuestoResumen'
import { CampamentoRecetasModal } from './CampamentoRecetasModal'
import { CampamentoPlantillasModal } from './CampamentoPlantillasModal'
import { CampamentoProveedoresModal } from './CampamentoProveedoresModal'

interface Props {
  actividadIdInicial?: string | null
  unidadId?: number | null
  diasCampamento?: number
  personasCampamento?: number
}

export const DashCampamentoMenuManager: React.FC<Props> = ({
  actividadIdInicial,
  diasCampamento = 4,
  personasCampamento = 40
}) => {
  const [activeTab, setActiveTab] = useState<'cronograma' | 'compras' | 'presupuesto'>('cronograma')
  const [menu, setMenu] = useState<CampamentoMenu>(() =>
    generarMenuEnBlanco(actividadIdInicial ? `menu-${actividadIdInicial}` : 'menu-nuevo', diasCampamento, personasCampamento)
  )
  const [recetas, setRecetas] = useState<CampamentoReceta[]>(DEFAULT_RECETAS)
  const [plantillas, setPlantillas] = useState<CampamentoPlantillaComida[]>(DEFAULT_PLANTILLAS)
  const [actividades, setActividades] = useState<ActividadProgramadaOffline[]>([])
  const [isRecetasModalOpen, setIsRecetasModalOpen] = useState(false)
  const [isPlantillasModalOpen, setIsPlantillasModalOpen] = useState(false)
  const [isProveedoresModalOpen, setIsProveedoresModalOpen] = useState(false)
  const [guardadoStatus, setGuardadoStatus] = useState<string | null>(null)

  // Cargar datos desde Dexie Offline
  useEffect(() => {
    async function cargarDatosOffline() {
      try {
        // Cargar actividades programadas
        const acts = await db.actividades_programadas.toArray()
        setActividades(acts)

        // Cargar recetas personalizadas si existen y sincronizar clasificaciones
        const recetasGuardadas = await db.campamento_recetas.toArray()
        let recetasActuales = DEFAULT_RECETAS
        if (recetasGuardadas && recetasGuardadas.length > 0) {
          recetasActuales = recetasGuardadas.map(r => {
            const preset = DEFAULT_RECETAS.find(d => d.id === r.id)
            if (preset) {
              const cats = r.categorias_plato && r.categorias_plato.length > 0
                ? r.categorias_plato
                : preset.categorias_plato || (preset.categoria_plato ? [preset.categoria_plato] : [])
              return {
                ...r,
                categoria_plato: r.categoria_plato || preset.categoria_plato,
                categorias_plato: cats
              }
            }
            if (!r.categorias_plato && r.categoria_plato) {
              return { ...r, categorias_plato: [r.categoria_plato] }
            }
            return r
          })
          setRecetas(recetasActuales)
          await db.campamento_recetas.bulkPut(recetasActuales)
        } else {
          // Inicializar recetas por defecto en Dexie
          await db.campamento_recetas.bulkPut(DEFAULT_RECETAS)
        }

        // Cargar plantillas de comida (Nivel 2) si existen y sincronizar slots
        const plantillasGuardadas = await db.campamento_plantillas.toArray()
        let plantillasActuales = DEFAULT_PLANTILLAS
        if (plantillasGuardadas && plantillasGuardadas.length > 0) {
          plantillasActuales = plantillasGuardadas.map(p => {
            const preset = DEFAULT_PLANTILLAS.find(d => d.id === p.id)
            if (preset) {
              return {
                ...p,
                bebidas_ids: preset.bebidas_ids,
                plato_principal_ids: preset.plato_principal_ids,
                agregados_ids: preset.agregados_ids,
                alternativas_ids: preset.alternativas_ids,
                ensaladas_ids: preset.ensaladas_ids,
                postres_ids: preset.postres_ids,
                sopas_ids: preset.sopas_ids,
                recetas_ids: preset.recetas_ids
              }
            }
            const slots = distribuirRecetasEnSlots(p.recetas_ids || [], recetasActuales, p)
            return {
              ...p,
              ...slots
            }
          })
          setPlantillas(plantillasActuales)
          await db.campamento_plantillas.bulkPut(plantillasActuales)
        } else {
          await db.campamento_plantillas.bulkPut(DEFAULT_PLANTILLAS)
        }

        const plantillasMap = new Map(plantillasActuales.map(p => [p.id, p]))

        // Función para asegurar que bloques existentes tengan sus slots poblados desde sus recetas
        const normalizarBloquesMenu = (blqs: CampamentoMenuBloque[]): CampamentoMenuBloque[] => {
          return blqs.map(b => {
            const slotsVacios = (!b.bebidas_ids || b.bebidas_ids.length === 0) &&
              (!b.plato_principal_ids || b.plato_principal_ids.length === 0) &&
              (!b.agregados_ids || b.agregados_ids.length === 0) &&
              (!b.alternativas_ids || b.alternativas_ids.length === 0) &&
              (!b.ensaladas_ids || b.ensaladas_ids.length === 0) &&
              (!b.postres_ids || b.postres_ids.length === 0) &&
              (!b.sopas_ids || b.sopas_ids.length === 0)

            if (slotsVacios && ((b.recetas_ids && b.recetas_ids.length > 0) || (b.plantilla_id && plantillasMap.has(b.plantilla_id)))) {
              const plt = b.plantilla_id ? plantillasMap.get(b.plantilla_id) : undefined
              const recIds = (b.recetas_ids && b.recetas_ids.length > 0)
                ? b.recetas_ids
                : (plt?.recetas_ids || [])
              const slots = distribuirRecetasEnSlots(recIds, recetasActuales, plt)
              return {
                ...b,
                ...slots
              }
            }
            return b
          })
        }

        // Cargar menú asociado al campamento/actividad
        if (actividadIdInicial) {
          // Buscar por actividad_id o por id exacto del campamento
          let menuActividad = await db.campamento_menus
            .where('actividad_id')
            .equals(actividadIdInicial)
            .first()

          if (!menuActividad) {
            menuActividad = await db.campamento_menus.get(`menu-${actividadIdInicial}`)
          }

          if (menuActividad) {
            const menuNormalizado = {
              ...menuActividad,
              bloques: normalizarBloquesMenu(menuActividad.bloques)
            }
            setMenu(menuNormalizado)
            return
          } else {
            // Inicializar menú en blanco exclusivo para este campamento
            const nuevoBlanco = generarMenuEnBlanco(
              `menu-${actividadIdInicial}`,
              diasCampamento,
              personasCampamento
            )
            nuevoBlanco.actividad_id = actividadIdInicial
            setMenu(nuevoBlanco)
            await db.campamento_menus.put(nuevoBlanco)
            return
          }
        }

        const ultimoMenu = await db.campamento_menus.orderBy('updated_at').reverse().first()
        if (ultimoMenu) {
          const ultimoNormalizado = {
            ...ultimoMenu,
            bloques: normalizarBloquesMenu(ultimoMenu.bloques)
          }
          setMenu(ultimoNormalizado)
        }
      } catch (err) {
        console.warn('Error cargando datos offline de menú:', err)
      }
    }

    cargarDatosOffline()
  }, [actividadIdInicial, diasCampamento, personasCampamento])

  // Cálculo en tiempo real de presupuesto e insumos
  const calculoResultado = useMemo(() => {
    return calcularPresupuestoYCompras(menu, recetas, DEFAULT_INSUMOS_CATALOGO, plantillas)
  }, [menu, recetas, plantillas])

  // Auto-guardado en Dexie
  const persistirMenu = async (nuevoMenu: CampamentoMenu) => {
    try {
      const menuConFecha = {
        ...nuevoMenu,
        costo_total_estimado: calculoResultado.costoTotal,
        costo_por_persona: calculoResultado.costoPorPersona,
        updated_at: new Date().toISOString()
      }
      setMenu(menuConFecha)
      await db.campamento_menus.put(menuConFecha)
      setGuardadoStatus('Guardado offline ✓')
      setTimeout(() => setGuardadoStatus(null), 2500)
    } catch (err) {
      console.error('Error guardando menú en Dexie:', err)
    }
  }

  // Actualizar un bloque del cronograma
  const handleUpdateBloque = (bloqueActualizado: CampamentoMenuBloque) => {
    const nuevosBloques = menu.bloques.map(b =>
      b.id === bloqueActualizado.id ? bloqueActualizado : b
    )
    persistirMenu({ ...menu, bloques: nuevosBloques })
  }

  // Actualizar todos los bloques (para reordenar, agregar o eliminar comidas del día)
  const handleUpdateAllBloques = (nuevosBloques: CampamentoMenuBloque[]) => {
    persistirMenu({ ...menu, bloques: nuevosBloques })
  }

  // Actualizar configuración general del campamento
  const handleUpdateConfig = (cambios: Partial<CampamentoMenu>) => {
    let nuevosBloques = [...menu.bloques]

    // Si cambian los días totales, expandir o recortar cronograma
    if (cambios.dias_totales && cambios.dias_totales !== menu.dias_totales) {
      const nuevoPreset = generarMenuPredeterminado(
        menu.id,
        cambios.dias_totales,
        cambios.numero_personas || menu.numero_personas
      )
      nuevosBloques = nuevoPreset.bloques
    }

    persistirMenu({
      ...menu,
      ...cambios,
      bloques: nuevosBloques
    })
  }

  // Cargar preset de 4 días (Callejones) o 9 días (Coñaripe)
  const cargarPreset = (dias: number, nombre: string) => {
    if (confirm(`¿Cargar plantilla predeterminada de ${dias} días (${nombre})? Se reiniciará el cronograma de comidas.`)) {
      const nuevo = generarMenuPredeterminado(`menu-${Date.now()}`, dias, menu.numero_personas)
      nuevo.nombre = `Menú de Campamento: ${nombre}`
      persistirMenu(nuevo)
    }
  }

  // Guardar receta nueva o editada
  const handleSaveReceta = async (recetaGuardar: CampamentoReceta) => {
    try {
      const index = recetas.findIndex(r => r.id === recetaGuardar.id)
      let nuevasRecetas: CampamentoReceta[]
      if (index >= 0) {
        nuevasRecetas = [...recetas]
        nuevasRecetas[index] = recetaGuardar
      } else {
        nuevasRecetas = [recetaGuardar, ...recetas]
      }
      setRecetas(nuevasRecetas)
      await db.campamento_recetas.put(recetaGuardar)
    } catch (err) {
      console.error('Error guardando receta:', err)
    }
  }

  const handleDeleteReceta = async (recetaId: string) => {
    try {
      const filtradas = recetas.filter(r => r.id !== recetaId)
      setRecetas(filtradas)
      await db.campamento_recetas.delete(recetaId)
    } catch (err) {
      console.error('Error eliminando receta:', err)
    }
  }

  // Guardar plantilla nueva o editada (Nivel 2)
  const handleSavePlantilla = async (plantillaGuardar: CampamentoPlantillaComida) => {
    try {
      const index = plantillas.findIndex(p => p.id === plantillaGuardar.id)
      let nuevasPlantillas: CampamentoPlantillaComida[]
      if (index >= 0) {
        nuevasPlantillas = [...plantillas]
        nuevasPlantillas[index] = plantillaGuardar
      } else {
        nuevasPlantillas = [plantillaGuardar, ...plantillas]
      }
      setPlantillas(nuevasPlantillas)
      await db.campamento_plantillas.put(plantillaGuardar)
    } catch (err) {
      console.error('Error guardando plantilla de comida:', err)
    }
  }

  const handleDeletePlantilla = async (plantillaId: string) => {
    try {
      const filtradas = plantillas.filter(p => p.id !== plantillaId)
      setPlantillas(filtradas)
      await db.campamento_plantillas.delete(plantillaId)
    } catch (err) {
      console.error('Error eliminando plantilla de comida:', err)
    }
  }

  // Proveedores disponibles (unión de presets chilenos y los personalizados de este menú)
  const proveedoresDisponibles = useMemo(() => {
    const set = new Set<string>(menu.proveedores && menu.proveedores.length > 0 ? menu.proveedores : DEFAULT_PROVEEDORES)
    // Añadir proveedores de compras si hay alguno no listado
    calculoResultado.itemsConsolidados.forEach(it => {
      if (it.proveedor) set.add(it.proveedor)
    })
    return Array.from(set)
  }, [menu.proveedores, calculoResultado.itemsConsolidados])

  // Conteo de ítems por proveedor para el modal
  const conteoPorProveedor = useMemo(() => {
    const map: Record<string, number> = {}
    calculoResultado.itemsConsolidados.forEach(it => {
      map[it.proveedor] = (map[it.proveedor] || 0) + 1
    })
    return map
  }, [calculoResultado.itemsConsolidados])

  // Modificar precio unitario cotizado de un insumo en la lista de compras
  const handleUpdatePrecioItem = (ingredienteNombre: string, nuevoPrecio: number) => {
    const nuevosPrecios = {
      ...(menu.precios_personalizados || {}),
      [ingredienteNombre]: nuevoPrecio
    }
    const esPan = ingredienteNombre.toLowerCase().includes('pan')
    persistirMenu({
      ...menu,
      precios_personalizados: nuevosPrecios,
      precio_pan_unitario: esPan ? nuevoPrecio : menu.precio_pan_unitario
    })
  }

  // Modificar proveedor asignado a un producto específico
  const handleUpdateProveedorItem = (ingredienteNombre: string, nuevoProveedor: string) => {
    const nuevosProveedoresPersonalizados = {
      ...(menu.proveedores_personalizados || {}),
      [ingredienteNombre]: nuevoProveedor
    }
    persistirMenu({
      ...menu,
      proveedores_personalizados: nuevosProveedoresPersonalizados
    })
  }

  // Modificar URL de compra online / precio de referencia de un insumo
  const handleUpdateUrlItem = (ingredienteNombre: string, nuevaUrl: string) => {
    const nuevasUrls = { ...(menu.urls_personalizadas || {}) }
    if (nuevaUrl.trim()) {
      nuevasUrls[ingredienteNombre] = nuevaUrl.trim()
    } else {
      delete nuevasUrls[ingredienteNombre]
    }
    persistirMenu({
      ...menu,
      urls_personalizadas: nuevasUrls
    })
  }

  // Modificar modalidad de compra ('online' | 'presencial')
  const handleUpdateModalidadItem = (ingredienteNombre: string, modalidad: 'online' | 'presencial') => {
    const nuevasModalidades = {
      ...(menu.modalidades_compra || {}),
      [ingredienteNombre]: modalidad
    }
    persistirMenu({
      ...menu,
      modalidades_compra: nuevasModalidades
    })
  }

  // CRUD Proveedores
  const handleCrearProveedor = (nombre: string, url?: string) => {
    const listaActual = menu.proveedores && menu.proveedores.length > 0 ? menu.proveedores : [...DEFAULT_PROVEEDORES]
    const nuevasUrls = { ...(menu.proveedores_urls || DEFAULT_PROVEEDORES_URLS) }
    if (url) {
      nuevasUrls[nombre] = url
    }
    if (!listaActual.includes(nombre)) {
      persistirMenu({
        ...menu,
        proveedores: [...listaActual, nombre],
        proveedores_urls: nuevasUrls
      })
    } else if (url) {
      persistirMenu({
        ...menu,
        proveedores_urls: nuevasUrls
      })
    }
  }

  const handleEditarProveedor = (viejoNombre: string, nuevoNombre: string, url?: string) => {
    const listaActual = menu.proveedores && menu.proveedores.length > 0 ? menu.proveedores : [...DEFAULT_PROVEEDORES]
    const nuevaLista = listaActual.map(p => (p === viejoNombre ? nuevoNombre : p))
    
    // Migrar mapeos personalizados que apuntaban al viejo nombre
    const nuevosMapeos: Record<string, string> = {}
    Object.entries(menu.proveedores_personalizados || {}).forEach(([ing, prov]) => {
      nuevosMapeos[ing] = prov === viejoNombre ? nuevoNombre : prov
    })

    const nuevasUrls: Record<string, string> = { ...(menu.proveedores_urls || DEFAULT_PROVEEDORES_URLS) }
    if (url) {
      nuevasUrls[nuevoNombre] = url
    } else if (nuevasUrls[viejoNombre] && viejoNombre !== nuevoNombre) {
      nuevasUrls[nuevoNombre] = nuevasUrls[viejoNombre]
      delete nuevasUrls[viejoNombre]
    }

    persistirMenu({
      ...menu,
      proveedores: nuevaLista,
      proveedores_personalizados: nuevosMapeos,
      proveedores_urls: nuevasUrls
    })
  }

  const handleEliminarProveedor = (nombre: string, reasignarA: string) => {
    const listaActual = menu.proveedores && menu.proveedores.length > 0 ? menu.proveedores : [...DEFAULT_PROVEEDORES]
    const nuevaLista = listaActual.filter(p => p !== nombre)

    // Reasignar los productos que tenían asignado este proveedor
    const nuevosMapeos: Record<string, string> = { ...(menu.proveedores_personalizados || {}) }
    
    // Asignar explícitamente a 'reasignarA' todos los ítems actuales que tenían este proveedor
    calculoResultado.itemsConsolidados.forEach(it => {
      if (it.proveedor === nombre) {
        nuevosMapeos[it.ingrediente_nombre] = reasignarA
      }
    })

    persistirMenu({
      ...menu,
      proveedores: nuevaLista,
      proveedores_personalizados: nuevosMapeos
    })
  }

  const handleRestaurarProveedoresPorDefecto = () => {
    if (confirm('¿Restaurar la lista de comercios y mayoristas a los proveedores estándar por defecto?')) {
      persistirMenu({
        ...menu,
        proveedores: [...DEFAULT_PROVEEDORES],
        proveedores_personalizados: {}
      })
    }
  }

  // Restaurar todos los precios al catálogo de referencia chileno
  const handleRestaurarPrecios = () => {
    if (confirm('¿Restaurar todos los precios a los valores estándar de referencia del catálogo chileno?')) {
      persistirMenu({
        ...menu,
        precios_personalizados: {},
        precio_pan_unitario: 150
      })
    }
  }

  return (
    <div className="space-y-6 text-[1em]">
      {/* Barra superior de Campamento y Acciones */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[1.3em]">🍲</span>
              <input
                type="text"
                value={menu.nombre}
                onChange={e => handleUpdateConfig({ nombre: e.target.value })}
                className="text-[1.25em] font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-[#cb3327] outline-hidden px-1"
                placeholder="Nombre del Menú..."
              />
            </div>
            <p className="text-[0.85em] text-zinc-500">
              {menu.numero_personas} comensales • {menu.dias_totales} días de campamento • Panadería y mayoristas chilenos
            </p>
          </div>

          {/* Plantillas y Estado Offline */}
          <div className="flex flex-wrap items-center gap-2">
            {guardadoStatus && (
              <span className="text-[0.85em] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {guardadoStatus}
              </span>
            )}

            <div className="flex gap-1.5">
              <button
                onClick={() => cargarPreset(4, 'Callejones (4 Días)')}
                className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-[0.85em] font-medium transition"
              >
                🏕️ Preset 4 Días
              </button>
              <button
                onClick={() => cargarPreset(9, 'Coñaripe (9 Días)')}
                className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 text-[0.85em] font-medium transition"
              >
                🏔️ Preset 9 Días
              </button>
            </div>
          </div>
        </div>

        {/* Asociación con Actividad Oficial si existe */}
        {actividades.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[0.9em]">
            <span className="text-zinc-500 font-medium">Vincular a Campamento Oficial:</span>
            <select
              value={menu.actividad_id || ''}
              onChange={e => {
                const act = actividades.find(a => a.id === e.target.value)
                handleUpdateConfig({
                  actividad_id: e.target.value || null,
                  actividad_nombre: act?.nombre || undefined
                })
              }}
              className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="">(Ninguno / Menú independiente)</option>
              {actividades.map(act => (
                <option key={act.id} value={act.id}>
                  {act.nombre} ({act.lugar})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pestañas de Navegación del Módulo */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('cronograma')}
            className={`pb-1 px-2 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 ${
              activeTab === 'cronograma'
                ? 'border-[#cb3327] text-[#cb3327]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Cronograma
          </button>
          <button
            onClick={() => setActiveTab('compras')}
            className={`pb-1 px-2 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 ${
              activeTab === 'compras'
                ? 'border-[#cb3327] text-[#cb3327]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Compras ({calculoResultado.itemsConsolidados.length})
          </button>
          <button
            onClick={() => setActiveTab('presupuesto')}
            className={`pb-1 px-2 font-semibold text-[1em] border-b-2 transition flex items-center gap-2 ${
              activeTab === 'presupuesto'
                ? 'border-[#cb3327] text-[#cb3327]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Presupuesto
          </button>
        </div>
      </div>

      {/* Vista de la Pestaña Activa */}
      {activeTab === 'cronograma' && (
        <CampamentoCronogramaMenu
          bloques={menu.bloques}
          diasTotales={menu.dias_totales}
          recetas={recetas}
          plantillas={plantillas}
          onUpdateBloque={handleUpdateBloque}
          onUpdateAllBloques={handleUpdateAllBloques}
          onOpenRecetasModal={() => setIsRecetasModalOpen(true)}
          onOpenPlantillasModal={() => setIsPlantillasModalOpen(true)}
        />
      )}

      {activeTab === 'compras' && (
        <CampamentoListaCompras
          calculoResultado={calculoResultado}
          nombreMenu={menu.nombre}
          proveedoresDisponibles={proveedoresDisponibles}
          proveedoresUrls={menu.proveedores_urls || DEFAULT_PROVEEDORES_URLS}
          preciosPersonalizados={menu.precios_personalizados}
          urlsPersonalizadas={menu.urls_personalizadas}
          modalidadesCompra={menu.modalidades_compra}
          onUpdatePrecioItem={handleUpdatePrecioItem}
          onUpdateProveedorItem={handleUpdateProveedorItem}
          onUpdateUrlItem={handleUpdateUrlItem}
          onUpdateModalidadItem={handleUpdateModalidadItem}
          onOpenProveedoresModal={() => setIsProveedoresModalOpen(true)}
          onRestaurarPrecios={handleRestaurarPrecios}
        />
      )}

      {activeTab === 'presupuesto' && (
        <CampamentoPresupuestoResumen
          menu={menu}
          recetas={recetas}
          calculoResultado={calculoResultado}
          onUpdateMenuConfig={handleUpdateConfig}
        />
      )}

      {/* Modal de Proveedores y Comercios (CRUD) */}
      <CampamentoProveedoresModal
        isOpen={isProveedoresModalOpen}
        onClose={() => setIsProveedoresModalOpen(false)}
        proveedores={proveedoresDisponibles}
        proveedoresUrls={menu.proveedores_urls || DEFAULT_PROVEEDORES_URLS}
        conteoPorProveedor={conteoPorProveedor}
        onCrearProveedor={handleCrearProveedor}
        onEditarProveedor={handleEditarProveedor}
        onEliminarProveedor={handleEliminarProveedor}
        onRestaurarProveedoresPorDefecto={handleRestaurarProveedoresPorDefecto}
      />

      {/* Modal de Plantillas de Menú (Nivel 2) */}
      <CampamentoPlantillasModal
        plantillas={plantillas}
        recetas={recetas}
        isOpen={isPlantillasModalOpen}
        onClose={() => setIsPlantillasModalOpen(false)}
        onSavePlantilla={handleSavePlantilla}
        onDeletePlantilla={handleDeletePlantilla}
      />

      {/* Modal de Recetas Atómicas (Nivel 1) */}
      <CampamentoRecetasModal
        recetas={recetas}
        isOpen={isRecetasModalOpen}
        onClose={() => setIsRecetasModalOpen(false)}
        onSaveReceta={handleSaveReceta}
        onDeleteReceta={handleDeleteReceta}
      />
    </div>
  )
}
