import { PDFDocument } from 'pdf-lib'
import type { InspeccionBusData, PuntoInspeccionBusItem } from '@/types/campamento-preparacion'

export interface PuntoConfig {
  id: string
  label: string
  campoBien: string
  campoMal: string
  campoObs: string
}

export const PUNTOS_CHECKLIST_OFICIAL: PuntoConfig[] = [
  {
    id: 'p-1',
    label: 'Inspección Visual General',
    campoBien: 'Inspección Visual Bien',
    campoMal: 'Inspección Visual Mal',
    campoObs: 'OBSERVACIONES - inspección visual general'
  },
  {
    id: 'p-2',
    label: 'Estado de los Neumáticos',
    campoBien: 'Neumáticos Bien',
    campoMal: 'Neumáticos Mal',
    campoObs: 'OBSERVACIONES - estado de los neumáticos'
  },
  {
    id: 'p-3',
    label: 'Neumáticos de Repuesto',
    campoBien: 'Neumáticos Repuesto Bien',
    campoMal: 'Neumáticos Repuesto Mal',
    campoObs: 'OBSERVACIONES - neumáticos de repuesto'
  },
  {
    id: 'p-4',
    label: 'Fuga de Líquidos',
    campoBien: 'Fuga de Liquidos Bien',
    campoMal: 'Fuga de Liquidos Mal',
    campoObs: 'OBSERVACIONES - fuga de líquidos'
  },
  {
    id: 'p-5',
    label: 'Luces Bajas del Bus',
    campoBien: 'Luces Bajas Bien',
    campoMal: 'Luces Bajas Mal',
    campoObs: 'OBSERVACIONES - luces bajas del bus'
  },
  {
    id: 'p-6',
    label: 'Luces Altas del Bus',
    campoBien: 'Luces Altas Bien',
    campoMal: 'Luces Altas Mal',
    campoObs: 'OBSERVACIONES - luces altas del bus'
  },
  {
    id: 'p-7',
    label: 'Luces Marcha Atrás del Bus',
    campoBien: 'Luces Marcha Atras Bien',
    campoMal: 'Luces Marcha Atras Mal',
    campoObs: 'OBSERVACIONES - luces marcha atrás del bus'
  },
  {
    id: 'p-8',
    label: 'Luces de Posicionamiento del Bus',
    campoBien: 'Luces Posicionamiento Bien',
    campoMal: 'Luces Posicionamiento Mal',
    campoObs: 'OBSERVACIONES - luces de posicionamiento del bus'
  },
  {
    id: 'p-9',
    label: 'Luces de Freno del Bus',
    campoBien: 'Luces Freno Bien',
    campoMal: 'Luces Freno Mal',
    campoObs: 'OBSERVACIONES - luces de freno del bus'
  },
  {
    id: 'p-10',
    label: 'Luces Intermitentes del Bus',
    campoBien: 'Luces Intermitentes Bien',
    campoMal: 'Luces Intermitentes Mal',
    campoObs: 'OBSERVACIONES - luces intermitentes del bus'
  },
  {
    id: 'p-11',
    label: 'Parabrisas',
    campoBien: 'Parabrisas Bien',
    campoMal: 'Parabrisas Mal',
    campoObs: 'OBSERVACIONES - Parabrisas'
  },
  {
    id: 'p-12',
    label: 'Limpiaparabrisas y sus Plumillas',
    campoBien: 'Limpiaparabrisas Bien',
    campoMal: 'Limpiaparabrisas Mal',
    campoObs: 'OBSERVACIONES - limpiaparabrisas y sus plumillas'
  },
  {
    id: 'p-13',
    label: 'Ventanas del Bus',
    campoBien: 'Ventanas Bien',
    campoMal: 'Ventanas Mal',
    campoObs: 'OBSERVACIONES - ventanas del bus'
  },
  {
    id: 'p-14',
    label: 'Salida de Emergencia del Bus',
    campoBien: 'Salida de Emergencia Bien',
    campoMal: 'Salida de Emergencia Mal',
    campoObs: 'OBSERVACIONES - Salida de emergencia del bus'
  },
  {
    id: 'p-15',
    label: 'Asientos Anclados Firmemente',
    campoBien: 'Asientos anclados firmes Bien',
    campoMal: 'Asientos anclados firmes Mal',
    campoObs: 'OBSERVACIONES - asientos anclados firmemente'
  },
  {
    id: 'p-16',
    label: 'Todos los Cinturones de Seguridad Presentes',
    campoBien: 'Todos los Cinturones de Seguridad Bien',
    campoMal: 'Todos los Cinturones de Seguridad Mal',
    campoObs: 'OBSERVACIONES - cinturones de seguridad'
  },
  {
    id: 'p-17',
    label: 'Funcionamiento Operativo de los Cinturones',
    campoBien: 'Cinturones de Seguridad funcionan Bien',
    campoMal: 'Cinturones de Seguridad funcionan Mal',
    campoObs: 'OBSERVACIONES - funcionamiento de los cinturones de seguridad'
  },
  {
    id: 'p-18',
    label: 'Iluminación Interior del Bus',
    campoBien: 'Iluminación Interior Bien',
    campoMal: 'Iluminación Interior Mal',
    campoObs: 'OBSERVACIONES - iluminación interior del bus'
  },
  {
    id: 'p-19',
    label: 'Baño Operativo y Limpio',
    campoBien: 'Baño Bien',
    campoMal: 'Baño Mal',
    campoObs: 'OBSERVACIONES - baño está operativo y limpio'
  },
  {
    id: 'p-20',
    label: 'Portamaletas y Cierre Adecuado',
    campoBien: 'Portamaletas Bien',
    campoMal: 'Portamaletas Mal',
    campoObs: 'OBSERVACIONES - portamaletas y el cierre adecuado de sus puertas'
  },
  {
    id: 'p-21',
    label: 'Niveles de Líquidos Correspondientes',
    campoBien: 'Niveles de liquidos Bien',
    campoMal: 'Niveles de liquidos Mal',
    campoObs: 'OBSERVACIONES - niveles de líquido correspondientes'
  },
  {
    id: 'p-22',
    label: 'Revisión de los Frenos del Bus',
    campoBien: 'Revisión de Frenos Bien',
    campoMal: 'Revisión de Frenos Mal',
    campoObs: 'OBSERVACIONES - revisión de los frenos del bus'
  },
  {
    id: 'p-23',
    label: 'Capacidad Máxima de Pasajeros del Bus',
    campoBien: 'Capacidad Máxima de Pasajeros Bien',
    campoMal: 'Capacidad Máxima de Pasajeros Mal',
    campoObs: 'OBSERVACIONES - capacidad máxima de pasajeros del bus'
  }
]

export function crearInspeccionOficialVacia(busCotizacionId?: string, empresa?: string): InspeccionBusData {
  return {
    id: `insp-bus-${Date.now()}`,
    bus_cotizacion_id: busCotizacionId,
    patente: '',
    empresa: empresa || '',
    nombre_chofer_1: '',
    rut_chofer_1: '',
    nombre_chofer_2: '',
    rut_chofer_2: '',
    nombre_auxiliar: '',
    rut_auxiliar: '',
    datos_dueno: '',
    destino_viaje: '',
    numero_pasajeros: 45,
    kilometraje_inicial: '',
    hora_salida: '',
    fecha_salida: new Date().toISOString().split('T')[0],
    kilometraje_final: '',
    hora_llegada: '',
    fecha_llegada: '',
    permiso_circulacion: true,
    revision_tecnica: true,
    seguro_obligatorio: true,
    puntos: PUNTOS_CHECKLIST_OFICIAL.map(p => ({
      id: p.id,
      label: p.label,
      estado: 'bien' as const,
      observaciones: ''
    })),
    fotos: [],
    aprobado_final: true,
    observaciones_generales: ''
  }
}

/**
 * Rellena el PDF oficial con los 89 campos interactivos usando pdf-lib
 */
export async function rellenarPdfChecklistBus(
  templateBytes: Uint8Array | ArrayBuffer | Buffer,
  data: InspeccionBusData
): Promise<Uint8Array> {
  const bytes = templateBytes instanceof Uint8Array
    ? templateBytes
    : new Uint8Array(templateBytes as ArrayBuffer)
  const pdfDoc = await PDFDocument.load(bytes)
  const form = pdfDoc.getForm()

  const safeSetText = (fieldName: string, value?: string | number) => {
    if (value === undefined || value === null) return
    try {
      const field = form.getTextField(fieldName)
      field.setText(String(value))
    } catch {
      // Ignorar campos no existentes
    }
  }

  const safeSetCheckbox = (fieldName: string, checked: boolean) => {
    try {
      const field = form.getCheckBox(fieldName)
      if (checked) {
        field.check()
      } else {
        field.uncheck()
      }
    } catch {
      // Ignorar checkboxes no existentes
    }
  }

  // 1. Datos de conductores y vehículo
  safeSetText('Nombre del 1er conductor', data.nombre_chofer_1)
  safeSetText('RUN', data.rut_chofer_1)
  safeSetText('Nombre del 2do conductor', data.nombre_chofer_2)
  safeSetText('RUN_2', data.rut_chofer_2)
  safeSetText('Nombre de auxiliar o acompañante', data.nombre_auxiliar)
  safeSetText('RUN_3', data.rut_auxiliar)
  safeSetText('Empresa', data.empresa)
  safeSetText('Patente', data.patente)
  safeSetText('Destino del Viaje', data.destino_viaje)
  safeSetText('Número de Pasajeros', data.numero_pasajeros)
  safeSetText('Datos del Dueño', data.datos_dueno)

  // 2. Kilometrajes y horarios
  safeSetText('Kilometraje Inicial', data.kilometraje_inicial)
  safeSetText('Hora Salida', data.hora_salida)
  safeSetText('Fecha Salida', data.fecha_salida)
  safeSetText('Kilometraje Final', data.kilometraje_final)
  safeSetText('Hora Llegada', data.hora_llegada)
  safeSetText('Fecha Llegada', data.fecha_llegada)

  // 3. Documentos obligatorios
  safeSetCheckbox('Permiso de Circulación', !!data.permiso_circulacion)
  safeSetCheckbox('Revisión Técnica', !!data.revision_tecnica)
  safeSetCheckbox('Seguro Obligatorio', !!data.seguro_obligatorio)

  // 4. Los 23 Puntos de Control
  const puntosMap = new Map<string, PuntoInspeccionBusItem>()
  for (const p of data.puntos || []) {
    puntosMap.set(p.id, p)
  }

  for (const cfg of PUNTOS_CHECKLIST_OFICIAL) {
    const item = puntosMap.get(cfg.id)
    if (!item) continue

    if (item.estado === 'bien') {
      safeSetCheckbox(cfg.campoBien, true)
      safeSetCheckbox(cfg.campoMal, false)
    } else if (item.estado === 'mal') {
      safeSetCheckbox(cfg.campoBien, false)
      safeSetCheckbox(cfg.campoMal, true)
    }

    if (item.observaciones) {
      safeSetText(cfg.campoObs, item.observaciones)
    }
  }

  return await pdfDoc.save()
}

/**
 * Carga el template oficial desde /autorizacion/docs_FichaCheckListBuses_digital.pdf
 * y descarga el PDF generado en el navegador del usuario.
 */
export async function descargarPdfChecklistBus(data: InspeccionBusData): Promise<void> {
  const response = await fetch('/autorizacion/docs_FichaCheckListBuses_digital.pdf')
  if (!response.ok) {
    throw new Error('No se pudo cargar la plantilla PDF oficial de checklist de buses')
  }

  const templateBytes = await response.arrayBuffer()
  const pdfBytes = await rellenarPdfChecklistBus(templateBytes, data)

  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const patenteLimpia = (data.patente || 'BUS').replace(/[^a-zA-Z0-9]/g, '_')
  a.download = `Checklist_Bus_${patenteLimpia}_${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
