import type {
  CampamentoMenu,
  CampamentoReceta,
  CampamentoPlantillaComida,
  InsumoCotizadoCatalogo,
  ItemCompraConsolidado,
  CategoriaInsumo
} from '@/types/campamento-menu'
import {
  DEFAULT_INSUMOS_CATALOGO,
  DEFAULT_RECETAS,
  DEFAULT_PLANTILLAS
} from '@/lib/campamento-menu-presets'

export interface ResumenProveedor {
  proveedor: string
  items_cantidad: number
  costo_subtotal: number
  porcentaje_del_total: number
}

export interface ResumenCategoria {
  categoria: CategoriaInsumo
  items_cantidad: number
  costo_subtotal: number
  porcentaje_del_total: number
}

export interface CalculoMenuResultado {
  itemsConsolidados: ItemCompraConsolidado[]
  resumenPorProveedor: ResumenProveedor[]
  resumenPorCategoria: ResumenCategoria[]
  costoTotal: number
  costoPorPersona: number
  costoPorDia: number
  totalPanesCampamento: number
  costoPanTotal: number
}

/**
 * Normaliza nombres para matching flexible entre recetas y catálogo de insumos
 */
function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Busca el insumo más afín en el catálogo de referencias
 */
function buscarEnCatalogo(
  nombreIngrediente: string,
  catalogo: InsumoCotizadoCatalogo[]
): InsumoCotizadoCatalogo | undefined {
  const norm = normalizarTexto(nombreIngrediente)

  // 1. Coincidencia exacta
  const exacto = catalogo.find(c => normalizarTexto(c.nombre) === norm)
  if (exacto) return exacto

  // 2. Coincidencia de inclusión
  return catalogo.find(c => {
    const cNorm = normalizarTexto(c.nombre)
    return norm.includes(cNorm) || cNorm.includes(norm)
  })
}

/**
 * Calcula la lista consolidada de compras, agrupada por proveedor y categoría,
 * considerando comensales, días, margen de seguridad y rendimientos comerciales reales.
 */
export function calcularPresupuestoYCompras(
  menu: CampamentoMenu,
  recetas: CampamentoReceta[],
  catalogoPersonalizado?: InsumoCotizadoCatalogo[],
  plantillas?: CampamentoPlantillaComida[]
): CalculoMenuResultado {
  const catalogo = catalogoPersonalizado && catalogoPersonalizado.length > 0
    ? catalogoPersonalizado
    : DEFAULT_INSUMOS_CATALOGO

  const recetasMap = new Map<string, CampamentoReceta>()
  DEFAULT_RECETAS.forEach(r => recetasMap.set(r.id, r))
  if (Array.isArray(recetas)) {
    recetas.forEach(r => recetasMap.set(r.id, r))
  }

  const plantillasMap = new Map<string, CampamentoPlantillaComida>()
  DEFAULT_PLANTILLAS.forEach(p => plantillasMap.set(p.id, p))
  if (Array.isArray(plantillas)) {
    plantillas.forEach(p => plantillasMap.set(p.id, p))
  }

  const margenFactor = 1 + (Math.max(0, menu.margen_seguridad_pct || 0) / 100)
  const personas = Math.max(1, menu.numero_personas || 1)
  const dias = Math.max(1, menu.dias_totales || 1)
  const panesPorDia = menu.consumo_pan_diario ?? 3
  
  // Soporte para precio personalizado de Pan
  const precioPanCustom = menu.precios_personalizados?.['Pan batido / Marraqueta fresca']
    ?? menu.precios_personalizados?.['Pan fresco diario']
    ?? menu.precios_personalizados?.['Pan']
  const precioPan = precioPanCustom !== undefined ? precioPanCustom : (menu.precio_pan_unitario || 150)
  const totalPanesCampamento = Math.ceil(personas * dias * panesPorDia * margenFactor)
  const costoPanTotal = totalPanesCampamento * precioPan

  // Mapa temporal de acumulación: key = ingrediente_nombre normalizado
  interface AcumuladorItem {
    nombreOriginal: string
    categoria: CategoriaInsumo
    unidadMedida: string
    cantidadNetaTotal: number
    proveedor: string
    precioUnitario: number
    precioModificado: boolean
    formatoEnvase: string
    porcionesPorEnvase: number
    detallesUso: string[]
    vecesUsado: number
    urlCompra?: string
    modalidadCompra?: 'online' | 'presencial'
  }

  const mapaItems = new Map<string, AcumuladorItem>()

  // 1. Iterar sobre todos los bloques del menú (Resolviendo Slots Culinarios y Plantillas -> Recetas -> Insumos)
  for (const bloque of menu.bloques) {
    const recetasBloqueSet = new Set<string>()

    // Agregar recetas desde los slots culinarios tipificados
    const slotsBloque = [
      bloque.bebidas_ids,
      bloque.plato_principal_ids,
      bloque.agregados_ids,
      bloque.alternativas_ids,
      bloque.ensaladas_ids,
      bloque.postres_ids,
      bloque.sopas_ids
    ]
    let tieneSlotsDefinidos = false
    slotsBloque.forEach(slot => {
      if (Array.isArray(slot)) {
        tieneSlotsDefinidos = true
        slot.forEach(id => recetasBloqueSet.add(id))
      }
    })

    // Si no tenía slots explícitos pero tiene recetas_ids consolidadas
    if (!tieneSlotsDefinidos && Array.isArray(bloque.recetas_ids) && bloque.recetas_ids.length > 0) {
      bloque.recetas_ids.forEach(id => recetasBloqueSet.add(id))
    }

    // Si el bloque no tiene ninguna receta (y no tiene slots definidos) y tiene plantilla_id asignada,
    // hereda de la plantilla como respaldo (ej: menús legacy o unit tests)
    if (!tieneSlotsDefinidos && recetasBloqueSet.size === 0 && bloque.plantilla_id && plantillasMap.has(bloque.plantilla_id)) {
      const plt = plantillasMap.get(bloque.plantilla_id)!
      if (Array.isArray(plt.recetas_ids)) {
        plt.recetas_ids.forEach(id => recetasBloqueSet.add(id))
      }
      const slotsPlantilla = [
        plt.bebidas_ids,
        plt.plato_principal_ids,
        plt.agregados_ids,
        plt.alternativas_ids,
        plt.ensaladas_ids,
        plt.postres_ids,
        plt.sopas_ids
      ]
      slotsPlantilla.forEach(slot => {
        if (Array.isArray(slot)) {
          slot.forEach(id => recetasBloqueSet.add(id))
        }
      })
    }

    if (recetasBloqueSet.size === 0) continue

    for (const recId of recetasBloqueSet) {
      const receta = recetasMap.get(recId)
      if (!receta) continue

      const baseReceta = Math.max(1, receta.porciones_base || 10)
      const ratioEscala = personas / baseReceta

      for (const ing of receta.ingredientes) {
        const normKey = normalizarTexto(ing.ingrediente_nombre)

        // Si el menú ya gestiona el pan de forma global diaria (ej: 3 panes/persona/día),
        // evitamos duplicarlo en las recetas individuales de desayuno u once
        if (panesPorDia > 0 && (normKey.includes('pan batido') || normKey.includes('marraqueta') || normKey === 'pan')) {
          continue
        }

        const catItem = buscarEnCatalogo(ing.ingrediente_nombre, catalogo)
        const cantidadRacion = ing.cantidad_base * ratioEscala * margenFactor

        const detalleTexto = `Día ${bloque.numero_dia} (${bloque.tiempo_comida}): ${receta.nombre} (${Number((ing.cantidad_base * ratioEscala).toFixed(1))} ${ing.unidad_medida})`

        // Soporte para precio personalizado del insumo
        let customPrice = menu.precios_personalizados?.[ing.ingrediente_nombre]
          ?? menu.precios_personalizados?.[normKey]
          ?? (catItem ? (menu.precios_personalizados?.[catItem.nombre] ?? menu.precios_personalizados?.[normalizarTexto(catItem.nombre)]) : undefined)

        if (customPrice === undefined && menu.precios_personalizados) {
          const matchEntry = Object.entries(menu.precios_personalizados).find(([k]) => {
            const kNorm = normalizarTexto(k)
            return normKey.includes(kNorm) || kNorm.includes(normKey)
          })
          if (matchEntry) {
            customPrice = matchEntry[1]
          }
        }

        const precioFinal = customPrice !== undefined
          ? Math.max(0, customPrice)
          : (catItem?.precio_referencia ?? (ing.precio_referencia_unitario || 1000))

        // Proveedor asignado (personalizado por ítem o por defecto del catálogo)
        const proveedorFinal = menu.proveedores_personalizados?.[ing.ingrediente_nombre]
          ?? menu.proveedores_personalizados?.[normKey]
          ?? (catItem ? (menu.proveedores_personalizados?.[catItem.nombre] ?? menu.proveedores_personalizados?.[normalizarTexto(catItem.nombre)]) : undefined)
          ?? catItem?.proveedor
          ?? ing.proveedor
          ?? 'Super Bodega aCuenta'

        // URL de compra / referencia del producto y modalidad (Online vs Presencial)
        const urlFinal = menu.urls_personalizadas?.[ing.ingrediente_nombre]
          ?? menu.urls_personalizadas?.[normKey]
          ?? (catItem ? (menu.urls_personalizadas?.[catItem.nombre] ?? menu.urls_personalizadas?.[normalizarTexto(catItem.nombre)]) : undefined)
          ?? catItem?.url_referencia

        const modalidadFinal = menu.modalidades_compra?.[ing.ingrediente_nombre]
          ?? menu.modalidades_compra?.[normKey]
          ?? (catItem ? (menu.modalidades_compra?.[catItem.nombre] ?? menu.modalidades_compra?.[normalizarTexto(catItem.nombre)]) : undefined)
          ?? (urlFinal ? 'online' : 'presencial')

        if (!mapaItems.has(normKey)) {
          mapaItems.set(normKey, {
            nombreOriginal: ing.ingrediente_nombre,
            categoria: catItem?.categoria || ing.categoria || 'Abarrotes',
            unidadMedida: ing.unidad_medida,
            cantidadNetaTotal: cantidadRacion,
            proveedor: proveedorFinal,
            precioUnitario: precioFinal,
            precioModificado: customPrice !== undefined,
            formatoEnvase: catItem?.formato_envase || `Formato ${ing.unidad_medida}`,
            porcionesPorEnvase: catItem?.porciones_por_envase || 1,
            detallesUso: [detalleTexto],
            vecesUsado: 1,
            urlCompra: urlFinal,
            modalidadCompra: modalidadFinal
          })
        } else {
          const acumulado = mapaItems.get(normKey)!
          acumulado.cantidadNetaTotal += cantidadRacion
          acumulado.detallesUso.push(detalleTexto)
          acumulado.vecesUsado += 1
          acumulado.proveedor = proveedorFinal
          if (customPrice !== undefined) {
            acumulado.precioUnitario = precioFinal
            acumulado.precioModificado = true
          }
          if (urlFinal) acumulado.urlCompra = urlFinal
          if (modalidadFinal) acumulado.modalidadCompra = modalidadFinal
        }
      }
    }
  }

  // 2. Incorporar el Pan Fresco Diario (Panadería Local)
  // (Variables calculadas previamente)

  // 3. Generar la lista de Items Consolidados
  const itemsConsolidados: ItemCompraConsolidado[] = []

  // Proveedor asignado para el Pan
  const proveedorPan = menu.proveedores_personalizados?.['Pan batido / Marraqueta fresca']
    ?? menu.proveedores_personalizados?.['Pan']
    ?? 'Panadería local'

  const urlPanCustom = menu.urls_personalizadas?.['Pan batido / Marraqueta fresca']
    ?? menu.urls_personalizadas?.['Pan batido / Marraqueta']
    ?? menu.urls_personalizadas?.['Pan']

  const modalidadPan = menu.modalidades_compra?.['Pan batido / Marraqueta fresca']
    ?? menu.modalidades_compra?.['Pan']
    ?? (urlPanCustom ? 'online' : 'presencial')

  // Agregar Pan como ítem de compra consolidado si hay consumo previsto
  if (totalPanesCampamento > 0) {
    itemsConsolidados.push({
      ingrediente_nombre: 'Pan batido / Marraqueta fresca',
      categoria: 'Panadería',
      proveedor: proveedorPan,
      cantidad_requerida_neta: totalPanesCampamento,
      unidad_medida: 'unidad',
      formato_envase: 'Unidad fresca diaria',
      porciones_por_envase: 1,
      envases_a_comprar: totalPanesCampamento,
      precio_unitario_envase: precioPan,
      costo_total: costoPanTotal,
      detalles_uso: [
        `Días 1 a ${dias}: ${panesPorDia} panes/persona/día para ${personas} personas (Retiro diario fresco)`
      ],
      comprado: false,
      precio_modificado: precioPanCustom !== undefined,
      url_compra: urlPanCustom,
      modalidad_compra: modalidadPan
    })
  }

  // Procesar el resto de los ingredientes
  for (const [, item] of mapaItems.entries()) {
    let envasesRequeridos = 1

    if (item.porcionesPorEnvase > 1) {
      // Si el envase tiene rendimiento declarado por porciones (ej: 1 paquete tallarines = 4 porciones)
      // Multiplicamos por la cantidad de veces que se sirve la comida a todos los asistentes
      const totalPorcionesRequeridas = personas * item.vecesUsado * margenFactor
      envasesRequeridos = Math.ceil(totalPorcionesRequeridas / item.porcionesPorEnvase)
    } else {
      // Rendimiento por unidad métrica directa (kg, litros, unidades)
      envasesRequeridos = Math.max(1, Math.ceil(item.cantidadNetaTotal))
    }

    const costoTotalItem = envasesRequeridos * item.precioUnitario

    itemsConsolidados.push({
      ingrediente_nombre: item.nombreOriginal,
      categoria: item.categoria,
      proveedor: item.proveedor,
      cantidad_requerida_neta: Number(item.cantidadNetaTotal.toFixed(2)),
      unidad_medida: item.unidadMedida,
      formato_envase: item.formatoEnvase,
      porciones_por_envase: item.porcionesPorEnvase,
      envases_a_comprar: envasesRequeridos,
      precio_unitario_envase: item.precioUnitario,
      costo_total: costoTotalItem,
      detalles_uso: item.detallesUso,
      comprado: false,
      precio_modificado: item.precioModificado,
      url_compra: item.urlCompra,
      modalidad_compra: item.modalidadCompra || (item.urlCompra ? 'online' : 'presencial')
    })
  }

  // Ordenar por proveedor y luego por categoría
  itemsConsolidados.sort((a, b) => {
    if (a.proveedor !== b.proveedor) return a.proveedor.localeCompare(b.proveedor)
    return a.categoria.localeCompare(b.categoria)
  })

  // 4. Totales y KPIs
  const costoTotal = itemsConsolidados.reduce((sum, it) => sum + it.costo_total, 0)
  const costoPorPersona = Math.round(costoTotal / personas)
  const costoPorDia = Math.round(costoTotal / dias)

  // 5. Agrupaciones por Proveedor
  const provMap = new Map<string, { count: number; subtotal: number }>()
  for (const item of itemsConsolidados) {
    const prev = provMap.get(item.proveedor) || { count: 0, subtotal: 0 }
    provMap.set(item.proveedor, {
      count: prev.count + 1,
      subtotal: prev.subtotal + item.costo_total
    })
  }

  const resumenPorProveedor: ResumenProveedor[] = Array.from(provMap.entries())
    .map(([proveedor, data]) => ({
      proveedor,
      items_cantidad: data.count,
      costo_subtotal: data.subtotal,
      porcentaje_del_total: costoTotal > 0 ? Number(((data.subtotal / costoTotal) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.costo_subtotal - a.costo_subtotal)

  // 6. Agrupaciones por Categoría
  const catMap = new Map<CategoriaInsumo, { count: number; subtotal: number }>()
  for (const item of itemsConsolidados) {
    const prev = catMap.get(item.categoria) || { count: 0, subtotal: 0 }
    catMap.set(item.categoria, {
      count: prev.count + 1,
      subtotal: prev.subtotal + item.costo_total
    })
  }

  const resumenPorCategoria: ResumenCategoria[] = Array.from(catMap.entries())
    .map(([categoria, data]) => ({
      categoria,
      items_cantidad: data.count,
      costo_subtotal: data.subtotal,
      porcentaje_del_total: costoTotal > 0 ? Number(((data.subtotal / costoTotal) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.costo_subtotal - a.costo_subtotal)

  return {
    itemsConsolidados,
    resumenPorProveedor,
    resumenPorCategoria,
    costoTotal,
    costoPorPersona,
    costoPorDia,
    totalPanesCampamento,
    costoPanTotal
  }
}

/**
 * Genera contenido CSV formateado para abrir directamente en Excel con UTF-8 BOM
 */
export function exportarListaComprasCSV(resultado: CalculoMenuResultado, nombreMenu: string): string {
  const lineas: string[] = []

  lineas.push(`PRESUPUESTO Y LISTA DE COMPRAS - ${nombreMenu.toUpperCase()}`)
  lineas.push(`Costo Total:;$${resultado.costoTotal.toLocaleString('es-CL')}`)
  lineas.push(`Costo por Persona:;$${resultado.costoPorPersona.toLocaleString('es-CL')}`)
  lineas.push(`Costo por Día:;$${resultado.costoPorDia.toLocaleString('es-CL')}`)
  lineas.push('')
  lineas.push('Proveedor;Categoría;Ingrediente / Producto;Modalidad;Formato Envase;Cant. Neta;Envases a Comprar;Precio Unitario CLP;Costo Total CLP;URL de Compra / Referencia;Detalle de Uso')

  for (const it of resultado.itemsConsolidados) {
    const det = it.detalles_uso.join(' | ').replace(/"/g, '""')
    const mod = it.modalidad_compra === 'online' ? 'Online' : 'Presencial'
    const url = (it.url_compra || '').replace(/"/g, '""')
    lineas.push(
      `"${it.proveedor}";"${it.categoria}";"${it.ingrediente_nombre}";"${mod}";"${it.formato_envase}";${it.cantidad_requerida_neta} ${it.unidad_medida};${it.envases_a_comprar};$${it.precio_unitario_envase};$${it.costo_total};"${url}";"${det}"`
    )
  }

  lineas.push('')
  lineas.push('RESUMEN POR PROVEEDOR')
  lineas.push('Proveedor;Cantidad Ítems;Subtotal CLP;% del Presupuesto')
  for (const prov of resultado.resumenPorProveedor) {
    lineas.push(`"${prov.proveedor}";${prov.items_cantidad};$${prov.costo_subtotal};${prov.porcentaje_del_total}%`)
  }

  return '\uFEFF' + lineas.join('\r\n')
}
