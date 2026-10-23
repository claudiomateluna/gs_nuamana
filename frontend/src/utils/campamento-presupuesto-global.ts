import type {
  CampamentoPreparacion,
  CotizacionBusItem,
  CotizacionLugarItem,
  InspeccionBusData
} from '@/types/campamento-preparacion'

export interface CalculoPresupuestoGlobalResultado {
  totalAsistentes: number
  totalPagantes: number
  costoAlimentacion: number
  costoTransporte: number
  costoEstadia: number
  costoOtros: number
  subtotal: number
  montoImprevistos: number
  granTotal: number
  cuotaPorPersona: number
  cuotaSiTodosPagaran: number
  subsidioVoluntariosPorPersona: number
  busAdjudicado?: CotizacionBusItem
  lugarAdjudicado?: CotizacionLugarItem
  porcentajeAlimentacion: number
  porcentajeTransporte: number
  porcentajeEstadia: number
  porcentajeOtros: number
}

/**
 * Calcula el presupuesto consolidado global de un campamento integrando
 * alimentación, bus adjudicado, terreno adjudicado, otros gastos y la cuota
 * considerando o eximiendo a voluntarios (dirigentes y apoderados).
 */
export function calcularPresupuestoGlobal(
  campamento: CampamentoPreparacion,
  costoAlimentacion: number = 0
): CalculoPresupuestoGlobalResultado {
  const nnj = Math.max(0, campamento.asistentes_nnj || 0)
  const jefatura = Math.max(0, campamento.asistentes_jefatura || 0)
  const apoderados = Math.max(0, campamento.asistentes_apoderados || 0)

  const totalAsistentes = Math.max(1, nnj + jefatura + apoderados)

  // Participantes pagantes según configuración de subsidio voluntario
  let totalPagantes = nnj
  if (!campamento.eximir_jefatura) {
    totalPagantes += jefatura
  }
  if (!campamento.eximir_apoderados) {
    totalPagantes += apoderados
  }
  totalPagantes = Math.max(1, totalPagantes)

  // 1. Transporte (Bus adjudicado)
  const busAdjudicado = campamento.cotizaciones_bus.find(
    b => b.id === campamento.bus_adjudicado_id || b.adjudicada
  )
  const costoTransporte = busAdjudicado ? busAdjudicado.monto_total_clp : 0

  // 2. Estadía (Lugar adjudicado)
  const lugarAdjudicado = campamento.cotizaciones_lugar.find(
    l => l.id === campamento.lugar_adjudicado_id || l.adjudicada
  )
  let costoEstadia = 0
  if (lugarAdjudicado) {
    if (lugarAdjudicado.modalidad_cobro === 'por_persona_dia') {
      const dias = Math.max(1, campamento.dias_totales || 1)
      costoEstadia = totalAsistentes * dias * lugarAdjudicado.valor_unitario_clp
    } else {
      costoEstadia = lugarAdjudicado.valor_unitario_clp
    }
  }

  // 3. Otros Costos
  const costoOtros = (campamento.otros_costos || []).reduce(
    (sum, c) => sum + (c.monto_clp || 0),
    0
  )

  // 4. Subtotal y Gran Total
  const subtotal = costoAlimentacion + costoTransporte + costoEstadia + costoOtros
  const pctImprevistos = Math.max(0, campamento.margen_imprevistos_pct || 0)
  const montoImprevistos = Math.round(subtotal * (pctImprevistos / 100))
  const granTotal = subtotal + montoImprevistos

  // 5. Cuotas
  const cuotaPorPersona = Math.round(granTotal / totalPagantes)
  const cuotaSiTodosPagaran = Math.round(granTotal / totalAsistentes)
  const subsidioVoluntariosPorPersona = Math.max(0, cuotaPorPersona - cuotaSiTodosPagaran)

  // 6. Porcentajes de distribución
  const pctAlim = granTotal > 0 ? Number(((costoAlimentacion / granTotal) * 100).toFixed(1)) : 0
  const pctTrans = granTotal > 0 ? Number(((costoTransporte / granTotal) * 100).toFixed(1)) : 0
  const pctEstad = granTotal > 0 ? Number(((costoEstadia / granTotal) * 100).toFixed(1)) : 0
  const pctOtr = granTotal > 0 ? Number((((costoOtros + montoImprevistos) / granTotal) * 100).toFixed(1)) : 0

  return {
    totalAsistentes,
    totalPagantes,
    costoAlimentacion,
    costoTransporte,
    costoEstadia,
    costoOtros,
    subtotal,
    montoImprevistos,
    granTotal,
    cuotaPorPersona,
    cuotaSiTodosPagaran,
    subsidioVoluntariosPorPersona,
    busAdjudicado,
    lugarAdjudicado,
    porcentajeAlimentacion: pctAlim,
    porcentajeTransporte: pctTrans,
    porcentajeEstadia: pctEstad,
    porcentajeOtros: pctOtr
  }
}

/**
 * Formatea una fecha YYYY-MM-DD o ISO a dd-mm-yyyy.
 * Evita desfasajes de zona horaria parseando directamente la cadena.
 */
export function formatearFechaDDMMYYYY(fechaStr?: string | null): string {
  if (!fechaStr) return ''
  const soloFecha = fechaStr.split('T')[0]
  const partes = soloFecha.split('-')
  if (partes.length === 3) {
    const [yyyy, mm, dd] = partes
    return `${dd.padStart(2, '0')}-${mm.padStart(2, '0')}-${yyyy}`
  }
  return fechaStr
}
