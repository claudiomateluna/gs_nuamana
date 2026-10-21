import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as XLSX from 'xlsx'
import {
  mapearAsistenteSalidaRow,
  exportarSalidaAutorizacionesExcel,
  COLUMNAS_SALIDA_EXCEL,
  type AsistenteSalidaData,
  type ActividadSalidaHeader
} from '../utils/excel-export'
import type { Perfil } from '../types'

vi.mock('xlsx', async (importOriginal) => {
  const actual = await importOriginal<typeof import('xlsx')>()
  return {
    ...actual,
    writeFile: vi.fn(),
  }
})

describe('Exportación Excel de Salidas y Autorizaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockPerfil: Perfil = {
    id: 'perfil-123',
    nombres: 'Pedro',
    apellidos: 'Pascal Balmaceda',
    rut: '12.345.678-9',
    fecha_nacimiento: '2010-05-15',
    unidad_id: 2,
    rol_id: 5,
    unidades: { id: 2, nombre: 'Tropa San Jorge' } as any,
    roles: { id: 5, name: 'Scout' } as any,
    sistema_salud: 'FONASA',
    tipo_sangre: 'O+',
    alergias: 'Penicilina',
    contactos_emergencia: [
      {
        id: 'c1',
        perfil_id: 'perfil-123',
        nombre: 'Maria Balmaceda',
        telefono: '+56911223344',
        parentesco: 'Madre',
        es_primario: true
      }
    ]
  }

  const mockAsistente: AsistenteSalidaData = {
    perfil: mockPerfil,
    autorizacion: {
      fecha_firma: '2026-10-18T14:30:00Z',
      nombre_firmante: 'Maria Balmaceda',
      rut_firmante: '9.876.543-2',
      estado: 'Vigente'
    }
  }

  const mockActividad: ActividadSalidaHeader = {
    nombre: 'Campamento Primavera 2026',
    tipo: 'Campamento',
    lugar: 'Parque El Trapiche',
    fecha_inicio: '2026-11-01',
    fecha_fin: '2026-11-03'
  }

  it('mapea los datos de un asistente a las columnas oficiales de la salida', () => {
    const row = mapearAsistenteSalidaRow(mockAsistente, 0)

    expect(row['N°']).toBe(1)
    expect(row['R.U.T.']).toBe('12.345.678-9')
    expect(row['Participante']).toBe('Pedro Pascal Balmaceda')
    expect(row['Unidad']).toBe('Tropa San Jorge')
    expect(row['Firmante (Apoderado)']).toBe('Maria Balmaceda')
    expect(row['RUT Firmante']).toBe('9.876.543-2')
    expect(row['Contacto Emergencia']).toBe('Maria Balmaceda')
    expect(row['Teléfono Emergencia']).toBe('+56911223344')
    expect(row['Previsión / Salud']).toBe('FONASA')
    expect(row['Alergias']).toBe('Penicilina')
  })

  it('llama a XLSX.writeFile con el nombre de archivo limpio conteniendo el nombre de la actividad', () => {
    exportarSalidaAutorizacionesExcel(mockActividad, [mockAsistente])

    expect(XLSX.writeFile).toHaveBeenCalledTimes(1)
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/^Nomina_Campamento_Primavera_2026_\d{4}-\d{2}-\d{2}\.xlsx$/)
    )
  })

  it('define todas las columnas requeridas para el reporte oficial', () => {
    expect(COLUMNAS_SALIDA_EXCEL).toContain('R.U.T.')
    expect(COLUMNAS_SALIDA_EXCEL).toContain('Participante')
    expect(COLUMNAS_SALIDA_EXCEL).toContain('Firmante (Apoderado)')
    expect(COLUMNAS_SALIDA_EXCEL).toContain('Contacto Emergencia')
    expect(COLUMNAS_SALIDA_EXCEL).toContain('Previsión / Salud')
    expect(COLUMNAS_SALIDA_EXCEL).toContain('Alergias')
  })
})
