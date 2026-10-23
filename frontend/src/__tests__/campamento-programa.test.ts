import { describe, it, expect } from 'vitest'
import {
  generarMomentosGrupalesPredeterminados,
  obtenerCronogramaCombinadoUnidad
} from '@/utils/campamento-programa-presets'
import type { CampamentoProgramaData } from '@/types/campamento-programa'

describe('Campamento Programa y Actividades Service', () => {
  it('genera los momentos grupales tradicionales para un campamento de 4 días', () => {
    const momentos = generarMomentosGrupalesPredeterminados(4)
    expect(momentos.length).toBeGreaterThan(5)

    // Debe incluir Inauguración en Día 1
    const d1Inauguracion = momentos.find(m => m.dia_numero === 1 && m.titulo.includes('Inauguración'))
    expect(d1Inauguracion).toBeDefined()

    // Debe incluir Gran Juego Grupal
    const granJuego = momentos.find(m => m.titulo.includes('Gran Juego'))
    expect(granJuego).toBeDefined()
    expect(granJuego?.es_dia_completo).toBe(true)

    // Debe incluir Fogón y Clausura
    expect(momentos.some(m => m.titulo.includes('Fogón'))).toBe(true)
    expect(momentos.some(m => m.titulo.includes('Clausura'))).toBe(true)
  })

  it('fusiona momentos grupales como invariables y actividades de unidad en el cronograma', () => {
    const programa: CampamentoProgramaData = {
      momentos_grupales: [
        {
          id: 'mg-1',
          dia_numero: 2,
          hora_inicio: '08:30',
          hora_fin: '09:00',
          es_dia_completo: false,
          titulo: 'Izamiento General',
          responsable: 'Jefatura'
        },
        {
          id: 'mg-2',
          dia_numero: 2,
          hora_inicio: '20:00',
          hora_fin: '20:30',
          es_dia_completo: false,
          titulo: 'Arriamiento',
          responsable: 'Jefatura'
        }
      ],
      actividades_unidades: [
        {
          id: 'act-1',
          unidad_nombre: 'Tropa',
          dia_numero: 2,
          hora_inicio: '10:00',
          hora_fin: '12:30',
          titulo: 'Construcción de Rincón de Patrulla',
          responsable: 'Jefe de Tropa',
          objetivo_progresion: 'Corporalidad - Cabuyería'
        },
        {
          id: 'act-2',
          unidad_nombre: 'Manada',
          dia_numero: 2,
          hora_inicio: '10:00',
          hora_fin: '11:30',
          titulo: 'Caza de Mowgli',
          responsable: 'Akela'
        }
      ]
    }

    // Cronograma para Tropa Día 2
    const cronogramaTropa = obtenerCronogramaCombinadoUnidad(programa, 'Tropa', 2)

    // Debe tener 3 bloques: Izamiento (mg), Construcción Tropa (act), Arriamiento (mg)
    expect(cronogramaTropa.length).toBe(3)

    // Izamiento debe ser invariable
    expect(cronogramaTropa[0].titulo).toBe('Izamiento General')
    expect(cronogramaTropa[0].es_invariable).toBe(true)
    expect(cronogramaTropa[0].tipo).toBe('momento_grupal')

    // Construcción de Patrulla debe ser editable/propia de Tropa
    expect(cronogramaTropa[1].titulo).toBe('Construcción de Rincón de Patrulla')
    expect(cronogramaTropa[1].es_invariable).toBe(false)
    expect(cronogramaTropa[1].tipo).toBe('actividad_unidad')

    // Arriamiento debe ser invariable
    expect(cronogramaTropa[2].titulo).toBe('Arriamiento')
    expect(cronogramaTropa[2].es_invariable).toBe(true)

    // Cronograma para Manada Día 2 no debe incluir la actividad de Tropa
    const cronogramaManada = obtenerCronogramaCombinadoUnidad(programa, 'Manada', 2)
    expect(cronogramaManada.length).toBe(3)
    expect(cronogramaManada.some(b => b.titulo === 'Caza de Mowgli')).toBe(true)
    expect(cronogramaManada.some(b => b.titulo === 'Construcción de Rincón de Patrulla')).toBe(false)
  })
})
