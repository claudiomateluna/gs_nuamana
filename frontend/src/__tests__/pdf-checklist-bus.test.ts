import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  crearInspeccionOficialVacia,
  rellenarPdfChecklistBus,
  PUNTOS_CHECKLIST_OFICIAL
} from '@/utils/pdf-checklist-bus'

describe('PDF Checklist Bus Service', () => {
  it('crea una inspección oficial con los 23 puntos del PDF', () => {
    const inspeccion = crearInspeccionOficialVacia('cot-123', 'Pullman del Sur')

    expect(inspeccion.empresa).toBe('Pullman del Sur')
    expect(inspeccion.puntos.length).toBe(23)
    expect(PUNTOS_CHECKLIST_OFICIAL.length).toBe(23)
    expect(inspeccion.permiso_circulacion).toBe(true)
    expect(inspeccion.revision_tecnica).toBe(true)
    expect(inspeccion.seguro_obligatorio).toBe(true)
  })

  it('rellena el PDF oficial sin errores usando pdf-lib', async () => {
    const pdfPath = path.resolve(__dirname, '../../public/autorizacion/docs_FichaCheckListBuses_digital.pdf')
    expect(fs.existsSync(pdfPath)).toBe(true)

    const templateBytes = new Uint8Array(fs.readFileSync(pdfPath))
    const inspeccion = crearInspeccionOficialVacia('cot-1', 'Buses JM')
    inspeccion.patente = 'ABCD-12'
    inspeccion.nombre_chofer_1 = 'Carlos Silva'
    inspeccion.rut_chofer_1 = '14.123.456-7'
    inspeccion.destino_viaje = 'Coñaripe'
    inspeccion.numero_pasajeros = 52
    inspeccion.kilometraje_inicial = '145200'
    inspeccion.puntos[0].estado = 'bien'
    inspeccion.puntos[0].observaciones = 'Carrocería en óptimo estado'
    inspeccion.puntos[1].estado = 'mal'
    inspeccion.puntos[1].observaciones = 'Neumático delantero derecho gastado'

    const outputPdfBytes = await rellenarPdfChecklistBus(templateBytes, inspeccion)
    expect(outputPdfBytes).toBeInstanceOf(Uint8Array)
    expect(outputPdfBytes.length).toBeGreaterThan(100000)
  })
})
