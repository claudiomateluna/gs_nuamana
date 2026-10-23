import { describe, it, expect } from 'vitest'
import {
  calcularPresupuestoGlobal,
  formatearFechaDDMMYYYY
} from '@/utils/campamento-presupuesto-global'
import {
  crearInspeccionOficialVacia,
  PUNTOS_CHECKLIST_OFICIAL
} from '@/utils/pdf-checklist-bus'
import type { CampamentoPreparacion } from '@/types/campamento-preparacion'

describe('Campamento Presupuesto Global & Logística', () => {
  const campamentoMock: CampamentoPreparacion = {
    id: 'camp-test-1',
    nombre: 'Campamento Verano Coñaripe 2025',
    tipo_campamento: 'verano',
    lugar_nombre: 'Camping Los Coigües, Coñaripe',
    fecha_inicio: '2025-01-10',
    fecha_fin: '2025-01-18',
    dias_totales: 9,
    asistentes_nnj: 40,
    asistentes_jefatura: 8,
    asistentes_apoderados: 4,
    eximir_jefatura: true,
    eximir_apoderados: true,
    margen_imprevistos_pct: 5,
    menu_id: 'menu-conaripe-9d',
    cotizaciones_bus: [
      {
        id: 'bus-1',
        empresa_nombre: 'Buses del Sur',
        capacidad_asientos: 55,
        monto_total_clp: 1800000,
        incluye_peajes: true,
        incluye_combustible: true,
        incluye_viatico_chofer: true,
        adjudicada: false
      },
      {
        id: 'bus-2',
        empresa_nombre: 'Transportes Cordillera',
        capacidad_asientos: 52,
        monto_total_clp: 1650000,
        incluye_peajes: true,
        incluye_combustible: true,
        incluye_viatico_chofer: true,
        adjudicada: true
      }
    ],
    bus_adjudicado_id: 'bus-2',
    cotizaciones_lugar: [
      {
        id: 'lug-1',
        nombre_lugar: 'Fundo Pellines',
        comuna_region: 'Panguipulli, Los Ríos',
        modalidad_cobro: 'por_persona_dia',
        valor_unitario_clp: 2000, // 2000 por persona por día
        monto_total_calculado_clp: 0,
        tiene_agua_potable: true,
        tiene_banos_letrinas: true,
        tiene_luz_electrica: true,
        adjudicada: true
      }
    ],
    lugar_adjudicado_id: 'lug-1',
    otros_costos: [
      { id: 'otr-1', descripcion: 'Leña y gas para cocina', categoria: 'combustible_gas', monto_clp: 120000 },
      { id: 'otr-2', descripcion: 'Botiquín general y sueros', categoria: 'salud_botiquin', monto_clp: 80000 }
    ],
    created_at: '2025-01-01',
    updated_at: '2025-01-01'
  }

  it('calcula presupuesto con voluntarios exentos (solo pagan los 40 NNJ)', () => {
    const costoAlimentacion = 1200000
    const resultado = calcularPresupuestoGlobal(campamentoMock, costoAlimentacion)

    // Total comensales = 40 + 8 + 4 = 52
    expect(resultado.totalAsistentes).toBe(52)
    // Total pagantes = 40 NNJ
    expect(resultado.totalPagantes).toBe(40)

    // Bus adjudicado: bus-2 (1.650.000)
    expect(resultado.costoTransporte).toBe(1650000)

    // Estadía adjudicada: 52 personas * 9 días * $2.000 = $936.000
    expect(resultado.costoEstadia).toBe(52 * 9 * 2000)

    // Otros costos: 120.000 + 80.000 = 200.000
    expect(resultado.costoOtros).toBe(200000)

    // Subtotal: 1.200.000 + 1.650.000 + 936.000 + 200.000 = 3.986.000
    expect(resultado.subtotal).toBe(3986000)

    // Margen 5%: 3.986.000 * 0.05 = 199.300
    expect(resultado.montoImprevistos).toBe(199300)

    // Gran Total: 3.986.000 + 199.300 = 4.185.300
    expect(resultado.granTotal).toBe(4185300)

    // Cuota por NNJ (40 pagantes): 4.185.300 / 40 = 104.633 (redondeado)
    expect(resultado.cuotaPorPersona).toBe(Math.round(4185300 / 40))

    // Si todos pagaran (52 personas): 4.185.300 / 52 = 80.487
    expect(resultado.cuotaSiTodosPagaran).toBe(Math.round(4185300 / 52))

    // El subsidio a voluntarios por persona es la diferencia
    expect(resultado.subsidioVoluntariosPorPersona).toBeGreaterThan(0)
  })

  it('recalcula la cuota cuando nadie está exento (todos pagan)', () => {
    const campamentoSinExenciones = {
      ...campamentoMock,
      eximir_jefatura: false,
      eximir_apoderados: false
    }

    const resultado = calcularPresupuestoGlobal(campamentoSinExenciones, 1200000)
    expect(resultado.totalPagantes).toBe(52)
    expect(resultado.cuotaPorPersona).toBe(resultado.cuotaSiTodosPagaran)
    expect(resultado.subsidioVoluntariosPorPersona).toBe(0)
  })

  it('permite alternar el bus definitivo y actualiza el costo de transporte', () => {
    const campamentoBus1 = {
      ...campamentoMock,
      bus_adjudicado_id: 'bus-1'
    }

    const resultado = calcularPresupuestoGlobal(campamentoBus1, 1000000)
    expect(resultado.costoTransporte).toBe(1800000)
  })

  it('inicializa un checklist de inspección técnica oficial con los 23 puntos reglamentarios', () => {
    const inspeccion = crearInspeccionOficialVacia('bus-1', 'Buses del Sur')
    expect(inspeccion.puntos.length).toBe(23)
    expect(PUNTOS_CHECKLIST_OFICIAL.length).toBe(23)
    expect(inspeccion.puntos[0].estado).toBe('bien')
    expect(inspeccion.aprobado_final).toBe(true)
  })

  it('formatea fechas estrictamente en formato dd-mm-yyyy evitando desfasajes de huso horario', () => {
    expect(formatearFechaDDMMYYYY('2025-01-10')).toBe('10-01-2025')
    expect(formatearFechaDDMMYYYY('2025-12-31')).toBe('31-12-2025')
    expect(formatearFechaDDMMYYYY('2024-10-31T00:00:00Z')).toBe('31-10-2024')
    expect(formatearFechaDDMMYYYY('')).toBe('')
    expect(formatearFechaDDMMYYYY(null)).toBe('')
  })
})
