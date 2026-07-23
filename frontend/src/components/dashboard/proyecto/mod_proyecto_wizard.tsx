'use client'

import { useState, useEffect, useRef } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { projectService } from '@/services/projectService'
import { UNIT_IDS } from '@/lib/unit-constants'
import type { Perfil, Unidad, CicloUnidad, CicloPropuesta } from '@/types'
import { parseJsonField } from '@/utils/format-utils'

interface Actividad {
  id: string
  nombre: string
  descripcion: string
  articulo_id: string
  fecha: string
}

interface ParticipanteManual {
  nombre: string
  telefono: string
  email: string
  usuario_vinculado_id: string | null
  tarea_asignada: string
}

interface PresupuestoItem {
  descripcion: string
  cantidad: number
  costo_unitario: number
  tipo: 'gasto' | 'ingreso'
  fuente: 'donacion' | 'compra' | 'ingreso_propio'
  actividad_nombre: string
}

interface FinanciamientoItem {
  nombre: string
  lugar: string
  recursos: string
  fecha: string
}

interface CicloActividad {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  tipo: string
}

interface OtroProyectoActividad {
  id: string
  nombre: string
  fecha: string
  proyectoTitulo: string
  esGrupal: boolean
}
import ProyectoPaso1Que from './ProyectoPaso1Que'
import ProyectoPaso2PorQue from './ProyectoPaso2PorQue'
import ProyectoPaso3ParaQue from './ProyectoPaso3ParaQue'
import ProyectoPaso4ParaQuienes from './ProyectoPaso4ParaQuienes'
import ProyectoPaso5Donde from './ProyectoPaso5Donde'
import ProyectoPaso6Como from './ProyectoPaso6Como'
import ProyectoPaso7Cuales from './ProyectoPaso7Cuales'
import ProyectoPaso8Cuando from './ProyectoPaso8Cuando'
import ProyectoPaso9Quienes from './ProyectoPaso9Quienes'
import ProyectoPaso10Cuanto from './ProyectoPaso10Cuanto'
import ProyectoPaso11ConQue from './ProyectoPaso11ConQue'
import ProyectoPaso12ComoLoHicimos from './ProyectoPaso12ComoLoHicimos'
import { toast } from 'sonner';

interface ProyectoData {
  id?: string
  titulo?: string
  campo_prioritario?: string
  fase?: string
  paso1_que_haremos?: string
  paso2_por_que_diagnostico?: string
  paso2_por_que_justificacion?: string
  paso3_para_que_general?: string
  paso3_para_que_especificos?: string
  paso4_para_quienes?: string
  paso5_donde?: string
  paso6_como_lo_haremos?: string
  paso7_cuales_actividades?: string
  participantes_manuales?: string
  paso10_cuanto_presupuesto?: string
  paso11_con_que_financiamiento?: string
  paso12_como_lo_hicimos?: string
  competencias_asociadas?: string
}

interface ProyectoWizardProps {
  isOpen: boolean
  onClose: () => void
  perfil: Perfil
  proyecto?: ProyectoData | null
  esGrupal: boolean
  onSuccess: () => void
  initialStep?: number
}

export default function DashModProyectoWizard({ isOpen, onClose, perfil, proyecto, esGrupal, onSuccess, initialStep }: ProyectoWizardProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [miembros, setMiembros] = useState<Perfil[]>([])
  const [unidades, setUnidades] = useState<Unidad[]>([])
  const [articulosActividades, setArticulosActividades] = useState<Record<string, unknown>[]>([])
  const [activeCiclo, setActiveCiclo] = useState<CicloUnidad | null>(null)
  const [cicloActividades, setCicloActividades] = useState<CicloActividad[]>([])
  const [otrosProyectosActividades, setOtrosProyectosActividades] = useState<OtroProyectoActividad[]>([])

  // Colores de la Unidad
  const miUnidad = unidades.find(u => u.id === perfil?.unidad_id)
  const rawColores: Record<string, string> | null | undefined = typeof (miUnidad?.colores) === 'object' && miUnidad?.colores !== null
    ? miUnidad.colores as Record<string, string>
    : typeof (perfil?.unidades?.colores) === 'object' && perfil?.unidades?.colores !== null
      ? perfil.unidades.colores as Record<string, string>
      : null
  const themePrimary = rawColores?.primario || '#cb3327'
  const themeSecondary = rawColores?.secundario || '#ffffff'
  const themeTextDark = rawColores?.textoDark || '#1b1b1b'

  // Referencia y navegación para la barra de pasos (flechas laterales)
  const stepsContainerRef = useRef<HTMLDivElement>(null)

  const scrollStepsLeft = () => {
    if (stepsContainerRef.current) {
      stepsContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' })
    }
  }

  const scrollStepsRight = () => {
    if (stepsContainerRef.current) {
      stepsContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' })
    }
  }

  const [calendarMonth, setCalendarMonth] = useState(new Date())

  const renderProyectoCalendar = () => {
    const monthStart = startOfMonth(calendarMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
    
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="bg-white dark:bg-zinc-950/20 rounded-3xl p-4 border border-zinc-150 dark:border-white/5 shadow-inner w-full">
        <div className="flex justify-between items-center mb-4">
          <button 
            type="button"
            onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))} 
            className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-[0.9em] font-bold text-zinc-500"
          >
            ❮
          </button>
          <h5 className="font-black uppercase tracking-wider text-[0.8em] text-zinc-700 dark:text-zinc-300 capitalize">
            {format(calendarMonth, 'MMMM yyyy', { locale: es })}
          </h5>
          <button 
            type="button"
            onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))} 
            className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-[0.9em] font-bold text-zinc-500"
          >
            ❯
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(d => (
            <div key={d} className="text-center text-[0.8em] font-black uppercase opacity-40 text-zinc-500">{d}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            
            // Actividades del proyecto actual
            const currentActs = actividades.filter(act => act.fecha === dateStr).map(act => ({
              ...act,
              tipoItem: 'actual',
              color: themePrimary,
              label: act.nombre || '(Sin Nombre)'
            }))
            
            // Actividades del ciclo / acuerdos de acta
            const cycleActs = cicloActividades.filter(act => act.fecha === dateStr).map(act => ({
              ...act,
              tipoItem: 'ciclo',
              color: '#16a34a', // Verde
              label: act.titulo
            }))
            
            // Actividades de otros proyectos (individuales o colectivos)
            const otherProjActs = otrosProyectosActividades.filter(act => act.fecha === dateStr).map(act => ({
              ...act,
              tipoItem: 'otro_proyecto',
              color: '#4f46e5', // Indigo
              label: `${act.proyectoTitulo}: ${act.nombre}`
            }))
            
            const allDayItems = [...currentActs, ...cycleActs, ...otherProjActs]
            
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isToday = isSameDay(day, new Date())
            
            let bgClass = ''
            let borderClass = 'border-transparent'
            
            if (allDayItems.length > 0) {
              const hasActual = currentActs.length > 0
              const hasCiclo = cycleActs.length > 0
              const hasOtro = otherProjActs.length > 0
              
              if (hasActual) {
                bgClass = 'bg-red-500/10 dark:bg-red-500/5'
                borderClass = 'border-red-500/30 dark:border-red-500/20'
              } else if (hasCiclo) {
                bgClass = 'bg-green-500/10 dark:bg-green-500/5'
                borderClass = 'border-green-500/30 dark:border-green-500/20'
              } else if (hasOtro) {
                bgClass = 'bg-indigo-500/10 dark:bg-indigo-500/5'
                borderClass = 'border-indigo-500/30 dark:border-indigo-500/20'
              }
            }
            
            return (
              <div 
                key={day.toString()} 
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[0.8em] relative group transition-all ${
                  !isCurrentMonth ? 'text-zinc-300 dark:text-zinc-600' : 'font-bold text-zinc-800 dark:text-zinc-200'
                } ${isToday ? 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-white/10' : `border ${borderClass} hover:border-zinc-100 dark:hover:border-white/5`} ${bgClass}`}
              >
                <span>{format(day, 'd')}</span>
                {allDayItems.length > 0 && (
                  <div className="absolute bottom-1 flex gap-0.5 justify-center flex-wrap px-0.5 max-w-full">
                    {allDayItems.map((a, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 h-1.5 rounded-full shrink-0" 
                        style={{ backgroundColor: a.color }} 
                      />
                    ))}
                  </div>
                )}
                {allDayItems.length > 0 && (
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-zinc-950 text-white text-[0.8em] rounded-xl shadow-xl z-[100] animate-in fade-in zoom-in duration-200 pointer-events-none text-left">
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-950 rotate-45" />
                    {allDayItems.map((a, idx) => (
                      <div key={idx} className="mb-1.5 last:mb-0 border-l-2 pl-1.5" style={{ borderColor: a.color }}>
                        <span className="text-[0.8em] font-black uppercase tracking-wider block opacity-70">
                          {a.tipoItem === 'actual' ? 'Este Proyecto' : a.tipoItem === 'ciclo' ? 'Ciclo / Acta' : 'Otro Proyecto'}
                        </span>
                        <strong className="block leading-tight text-white">
                          {a.label}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-4 pt-3 border-t border-zinc-150 dark:border-white/5 flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-[0.8em] font-black uppercase tracking-wider text-zinc-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themePrimary }} />
            <span>Este Proyecto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
            <span>Ciclo / Acta Grupal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Otros Proyectos</span>
          </div>
        </div>
      </div>
    )
  }

  // Filtros para miembros en Paso 9
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('')

  // Datos del formulario desagregados
  const [formData, setFormData] = useState({
    titulo: '',
    campo_prioritario: 'servicio', // servicio | naturaleza | trabajo | viaje (Solo Clan)
    paso1_que_haremos: '',
    paso2_por_que_diagnostico: '',
    paso2_por_que_justificacion: '',
    paso3_para_que_general: '',
    paso3_para_que_especificos: '',
    paso4_para_quienes: '',
    paso5_donde: '',
    paso6_como_lo_haremos: '',
    fase: 'seleccion'
  })

  // Subelementos estructurados en JSONB
  // Paso 7: Actividades [{ id, nombre, descripcion, articulo_id, fecha }]
  const [actividades, setActividades] = useState<Actividad[]>([])
  // Paso 9: Participantes manuales [{ nombre, telefono, email, usuario_vinculado_id }]
  const [participantesManuales, setParticipantesManuales] = useState<ParticipanteManual[]>([])
  // Paso 9: Participantes registrados [{ perfil_id, rol_en_proyecto }]
  const [participantesReg, setParticipantesReg] = useState<{ perfil_id: string; rol_en_proyecto: string; tarea_asignada?: string }[]>([])
  // Paso 10: Presupuesto [{ descripcion, cantidad, costo_unitario, tipo: 'gasto'|'ingreso', fuente: 'donacion'|'compra'|'ingreso_propio', actividad_nombre }]
  const [presupuestoItems, setPresupuestoItems] = useState<PresupuestoItem[]>([])
  // Paso 11: Financiamiento [{ nombre, lugar, recursos, fecha }]
  const [financiamientoItems, setFinanciamientoItems] = useState<FinanciamientoItem[]>([])
  // Paso 12: Evaluaciones de actividades { [nombreActividad]: string }
  const [evaluacionesAct, setEvaluacionesAct] = useState<Record<string, string>>({})
  // Competencias asociadas (Solo Avanzada)
  const [competenciasAsociadas, setCompetenciasAsociadas] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchInitialData()
      if (proyecto) {
        setFormData({
          titulo: proyecto.titulo || '',
          campo_prioritario: proyecto.campo_prioritario || 'servicio',
          paso1_que_haremos: proyecto.paso1_que_haremos || '',
          paso2_por_que_diagnostico: proyecto.paso2_por_que_diagnostico || '',
          paso2_por_que_justificacion: proyecto.paso2_por_que_justificacion || '',
          paso3_para_que_general: proyecto.paso3_para_que_general || '',
          paso3_para_que_especificos: proyecto.paso3_para_que_especificos || '',
          paso4_para_quienes: proyecto.paso4_para_quienes || '',
          paso5_donde: proyecto.paso5_donde || '',
          paso6_como_lo_haremos: proyecto.paso6_como_lo_haremos || '',
          fase: proyecto.fase || 'seleccion'
        })
        
        // Cargar subelementos
        setActividades(parseJsonField(proyecto.paso7_cuales_actividades, []))
        setParticipantesManuales(parseJsonField(proyecto.participantes_manuales, []))
        setPresupuestoItems(parseJsonField(proyecto.paso10_cuanto_presupuesto, []))
        setFinanciamientoItems(parseJsonField(proyecto.paso11_con_que_financiamiento, []))
        setEvaluacionesAct(parseJsonField(proyecto.paso12_como_lo_hicimos, {}))
        setCompetenciasAsociadas(parseJsonField(proyecto.competencias_asociadas, []))
        fetchParticipantesReg(proyecto.id!)
        setStep(initialStep || 1)
      } else {
        setFormData({
          titulo: '',
          campo_prioritario: 'servicio',
          paso1_que_haremos: '',
          paso2_por_que_diagnostico: '',
          paso2_por_que_justificacion: '',
          paso3_para_que_general: '',
          paso3_para_que_especificos: '',
          paso4_para_quienes: '',
          paso5_donde: '',
          paso6_como_lo_haremos: '',
          fase: 'seleccion'
        })
        setActividades([])
        setParticipantesManuales([])
        setPresupuestoItems([])
        setFinanciamientoItems([])
        setEvaluacionesAct({})
        setCompetenciasAsociadas([])
        setParticipantesReg([{ perfil_id: perfil.id, rol_en_proyecto: 'coordinador' }])
        setStep(1)
      }
    }
  }, [isOpen, proyecto, initialStep])

  const fetchInitialData = async () => {
    try {
      // 1. Miembros de todo el grupo
      const profiles = await projectService.getProfiles() as unknown as Perfil[]
      setMiembros(profiles)

      // 2. Unidades
      const units = await projectService.getUnits()
      setUnidades(units)
      if (perfil.unidad_id) {
        setSelectedUnitFilter(perfil.unidad_id!.toString())
      }

      // 3. Artículos tipo Actividad (Categoría 1 y sus hijas)
      const articles = await projectService.getArticlesForWizard()
      setArticulosActividades(articles)
    } catch (err) {
      console.error('Error fetching basic metadata for project wizard:', err)
    }

    // 4. Ciclo activo de la unidad
    let cycle = null
    try {
      if (perfil.unidad_id) {
        cycle = await projectService.getActiveCycleForUnit(perfil.unidad_id)
        setActiveCiclo(cycle)
      }
    } catch (err) {
      console.error('Error fetching active cycle for project wizard:', err)
    }

    // 5. Cargar actividades grupales y del ciclo de programa
    try {
      const [grupalesList, cyclePropsList] = await Promise.all([
        projectService.getGroupAgreements(perfil.unidad_id!),
        cycle ? projectService.getCycleProposals(cycle.id) : Promise.resolve([])
      ])

      const listGrupales = grupalesList.map(g => ({
        id: g.id,
        titulo: g.titulo,
        descripcion: g.descripcion,
        fecha: g.fecha_compromiso,
        tipo: 'acuerdo_grupal'
      }))

      const listCycleProps = cyclePropsList.map(p => ({
        id: p.id,
        titulo: p.titulo,
        descripcion: p.descripcion,
        fecha: p.fecha_programada,
        tipo: 'actividad_ciclo'
      }))

      setCicloActividades([...listGrupales, ...listCycleProps])
    } catch (e) {
      console.error('Error fetching cycle/group activities:', e)
    }

    // 6. Cargar actividades de otros proyectos (individuales y colectivos) de la unidad
    try {
      const otherProjs = await projectService.getOtherProjects(perfil.unidad_id!)
      const currentProjId = proyecto?.id || '00000000-0000-0000-0000-000000000000'
      const filteredProjs = otherProjs.filter(p => p.id !== currentProjId)

      const otherActs: OtroProyectoActividad[] = []
      filteredProjs.forEach(p => {
        const acts = parseJsonField(p.paso7_cuales_actividades, [] as Actividad[])
        acts.forEach((a: Actividad) => {
          if (a.fecha) {
            otherActs.push({
              id: a.id || crypto.randomUUID(),
              nombre: a.nombre,
              fecha: a.fecha,
              proyectoTitulo: p.titulo,
              esGrupal: p.es_grupal
            })
          }
        })
      })
      setOtrosProyectosActividades(otherActs)
    } catch (e) {
      console.error('Error fetching other projects activities:', e)
    }
  }

  const fetchParticipantesReg = async (proyectoId: string) => {
    try {
      const data = await projectService.getProjectParticipants(proyectoId)
      if ((!data || data.length === 0) && !esGrupal) {
        setParticipantesReg([{ perfil_id: perfil.id, rol_en_proyecto: 'coordinador', tarea_asignada: '' }])
      } else {
        setParticipantesReg(data)
      }
    } catch (err: unknown) {
      console.error('Error fetching project participants:', err)
    }
  }

  // --- Manejo de Actividades (Paso 7 & 8) ---
  const addActividad = () => {
    const newAct = {
      id: crypto.randomUUID(),
      nombre: '',
      descripcion: '',
      articulo_id: '',
      fecha: ''
    }
    setActividades([...actividades, newAct])
  }

  const removeActividad = (id: string) => {
    const act = actividades.find(a => a.id === id)
    if (act) {
      // Eliminar también del presupuesto y evaluaciones
      setPresupuestoItems(presupuestoItems.filter(p => p.actividad_nombre !== act.nombre))
      const newEvals = { ...evaluacionesAct }
      delete newEvals[act.nombre]
      setEvaluacionesAct(newEvals)
    }
    setActividades(actividades.filter(a => a.id !== id))
  }

  const updateActividad = (id: string, field: string, value: string) => {
    setActividades(actividades.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  // --- Manejo de Participantes Registrados (Paso 9) ---
  const handleToggleParticipanteReg = (perfilId: string) => {
    const exists = participantesReg.find(p => p.perfil_id === perfilId)
    if (exists) {
      setParticipantesReg(participantesReg.filter(p => p.perfil_id !== perfilId))
    } else {
      setParticipantesReg([...participantesReg, { perfil_id: perfilId, rol_en_proyecto: 'participante', tarea_asignada: '' }])
    }
  }

  const handleUpdateParticipanteRegRol = (perfilId: string, rol: string) => {
    setParticipantesReg(participantesReg.map(p => p.perfil_id === perfilId ? { ...p, rol_en_proyecto: rol } : p))
  }

  const handleUpdateParticipanteRegTarea = (perfilId: string, tarea: string) => {
    setParticipantesReg(participantesReg.map(p => p.perfil_id === perfilId ? { ...p, tarea_asignada: tarea } : p))
  }

  // --- Manejo de Participantes Manuales (Paso 9) ---
  const addParticipanteManual = () => {
    setParticipantesManuales([...participantesManuales, { nombre: '', telefono: '', email: '', usuario_vinculado_id: null, tarea_asignada: '' }])
  }

  const removeParticipanteManual = (index: number) => {
    setParticipantesManuales(participantesManuales.filter((_, idx) => idx !== index))
  }

  const updateParticipanteManual = (index: number, field: string, value: string) => {
    setParticipantesManuales(participantesManuales.map((p, idx) => idx === index ? { ...p, [field]: value } : p))
  }

  // --- Manejo de Presupuesto (Paso 10) ---
  const addPresupuestoItem = () => {
    setPresupuestoItems([...presupuestoItems, {
      descripcion: '',
      cantidad: 1,
      costo_unitario: 0,
      tipo: 'gasto', // gasto | ingreso
      fuente: 'compra', // donacion | compra | ingreso_propio
      actividad_nombre: ''
    }])
  }

  const removePresupuestoItem = (index: number) => {
    setPresupuestoItems(presupuestoItems.filter((_, idx) => idx !== index))
  }

  const updatePresupuestoItem = (index: number, field: string, value: string | number) => {
    setPresupuestoItems(presupuestoItems.map((item, idx) => idx === index ? { ...item, [field]: value } : item))
  }

  // --- Manejo de Financiamiento (Paso 11) ---
  const addFinanciamiento = () => {
    setFinanciamientoItems([...financiamientoItems, { nombre: '', lugar: '', recursos: '', fecha: '' }])
  }

  const removeFinanciamiento = (index: number) => {
    const item = financiamientoItems[index]
    if (item) {
      const newEvals = { ...evaluacionesAct }
      delete newEvals[item.nombre]
      setEvaluacionesAct(newEvals)
    }
    setFinanciamientoItems(financiamientoItems.filter((_, idx) => idx !== index))
  }

  const updateFinanciamiento = (index: number, field: string, value: string) => {
    setFinanciamientoItems(financiamientoItems.map((item, idx) => idx === index ? { ...item, [field]: value } : item))
  }

  // --- Manejo de Competencias (Avanzada) ---
  const handleToggleCompetencia = (comp: string) => {
    if (competenciasAsociadas.includes(comp)) {
      setCompetenciasAsociadas(competenciasAsociadas.filter(c => c !== comp))
    } else {
      setCompetenciasAsociadas([...competenciasAsociadas, comp])
    }
  }

  // --- Guardar Proyecto ---
  const handleSave = async (concluir = false) => {
    if (!formData.titulo) { toast.warning('Por favor, ingresa el título del proyecto.'); return; }
    setLoading(true)

    try {
      const payload: Record<string, unknown> = {
        titulo: formData.titulo,
        unidad_id: perfil.unidad_id,
        es_grupal: esGrupal,
        campo_prioritario: perfil.unidad_id === UNIT_IDS.CLAN ? formData.campo_prioritario : null,
        paso1_que_haremos: formData.paso1_que_haremos,
        paso2_por_que_diagnostico: formData.paso2_por_que_diagnostico,
        paso2_por_que_justificacion: formData.paso2_por_que_justificacion,
        paso3_para_que_general: formData.paso3_para_que_general,
        paso3_para_que_especificos: formData.paso3_para_que_especificos,
        paso4_para_quienes: formData.paso4_para_quienes,
        paso5_donde: formData.paso5_donde,
        paso6_como_lo_haremos: formData.paso6_como_lo_haremos,
        paso7_cuales_actividades: JSON.stringify(actividades),
        participantes_manuales: JSON.stringify(participantesManuales),
        paso10_cuanto_presupuesto: JSON.stringify(presupuestoItems),
        paso11_con_que_financiamiento: JSON.stringify(financiamientoItems),
        paso12_como_lo_hicimos: JSON.stringify(evaluacionesAct),
        competencias_asociadas: JSON.stringify(competenciasAsociadas),
        fase: concluir ? 'completado' : (proyecto?.fase || 'seleccion')
      }

      if (!esGrupal) {
        payload.perfil_id = perfil.id
      }

      let savedProject = null
      if (proyecto) {
        payload.id = proyecto.id
        savedProject = await projectService.saveProject(payload, false)
      } else {
        savedProject = await projectService.saveProject(payload, true)
      }

      // Sincronizar participantes registrados
      if (savedProject) {
        const insertParts = participantesReg.map(p => ({
          proyecto_id: savedProject.id,
          perfil_id: p.perfil_id,
          rol_en_proyecto: p.rol_en_proyecto,
          tarea_asignada: p.tarea_asignada || ''
        }))
        await projectService.updateParticipants(savedProject.id, insertParts)
      }

      // Sincronizar actividades al Calendario del Ciclo de la Unidad (sólo si es grupal y hay ciclo activo)
      if (esGrupal && savedProject && activeCiclo) {
        // Para cada actividad que tiene fecha, sincronizarla con ciclo_propuestas
        for (const act of actividades) {
          if (act.fecha && act.nombre) {
            // Verificar si ya existe una propuesta con el mismo ciclo_id y título en la base de datos
            const existingProp = await projectService.getProposalByCycleAndTitle(activeCiclo.id, `Proyecto: ${act.nombre}`)

            const propPayload = {
              ciclo_id: activeCiclo.id,
              titulo: `Proyecto: ${act.nombre}`,
              descripcion: act.descripcion || `Actividad del proyecto ${savedProject.titulo}`,
              seleccionada: true,
              fecha_programada: act.fecha,
              articulo_id: act.articulo_id || null
            }

            await projectService.saveCycleProposal(propPayload, !existingProp, existingProp?.id)
          }
        }
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Error desconocido'
      toast.error('Error al guardar el proyecto: ' + message)
    } finally {
      setLoading(false)
    }
  }

  // --- Renderizado de Imágenes Decorativas / Fallback ---
  const StepImage = ({ num, emoji }: { num: number; emoji: string }) => {
    const [imgErr, setImgErr] = useState(false)
    if (imgErr) {
      return (
        <div className="w-full h-36 rounded-3xl bg-gradient-to-r from-red-600/10 to-orange-500/10 flex items-center justify-center border border-red-500/20 mb-6">
          <span className="text-5xl">{emoji}</span>
        </div>
      )
    }
    return (
      <div className="w-full h-36 rounded-3xl overflow-hidden mb-6 relative border border-zinc-100 dark:border-white/5 shadow-inner">
        <img
          src={`/images/progresion/paso${num}.png`}
          alt={`Ilustración Paso ${num}`}
          className="w-full h-full object-cover"
          onError={() => setImgErr(true)}
        />
      </div>
    )
  }

  // Filtrar miembros en Paso 9
  const filteredMiembros = miembros.filter(m => {
    const matchesSearch = `${m.nombres} ${m.apellidos}`.toLowerCase().includes(memberSearch.toLowerCase())
    const matchesUnit = selectedUnitFilter === '' || (m.unidad_id != null && m.unidad_id.toString() === selectedUnitFilter)
    return matchesSearch && matchesUnit
  }).sort((a, b) => (a.unidad_id === perfil.unidad_id ? -1 : 1)) // Mostrar miembros de la propia unidad primero

  const totalGastos = presupuestoItems.filter(i => i.tipo === 'gasto').reduce((acc, curr) => acc + (curr.cantidad * curr.costo_unitario), 0)
  const totalIngresos = presupuestoItems.filter(i => i.tipo === 'ingreso').reduce((acc, curr) => acc + (curr.cantidad * curr.costo_unitario), 0)
  const balance = totalIngresos - totalGastos

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[150] flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-full lg:max-w-[1024px] rounded-[1rem] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh] border-2 border-white/5 transition-all duration-300">
        
        {/* Cabecera */}
        <div className="relative overflow-hidden p-6 shadow-2xl border-b-4 flex flex-col md:flex-row items-center gap-6 transition-all shrink-0" style={{ backgroundColor: themePrimary, borderColor: themeSecondary }}>
          {/* Background Unit Logo Watermark */}
          {(miUnidad?.logo_unidad_url || perfil?.unidades?.logo_unidad_url) && (
            <img 
              src={miUnidad?.logo_unidad_url || perfil?.unidades?.logo_unidad_url || undefined} 
              alt="" 
              className="absolute right-[-2rem] bottom-[-2rem] w-64 h-64 opacity-15 pointer-events-none select-none object-contain"
            />
          )}

          {/* Icon Badge */}
          <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 overflow-hidden shrink-0" style={{ borderColor: themeSecondary }}>
            <span className="text-3xl">{esGrupal ? '👥' : '🚀'}</span>
          </div>

          {/* Text Area */}
          <div className="relative z-10 text-center md:text-left flex-1 w-full pr-8">
            <span className="text-[0.8em] font-black uppercase tracking-[0.2em] opacity-80" style={{ color: themeSecondary }}>
              {esGrupal ? 'Proyecto Colectivo' : 'Proyecto Individual'}
            </span>
            <h2 className="text-[2em] font-black uppercase tracking-tighter leading-none mb-1" style={{ color: themeSecondary }}>
              {formData.titulo || 'Formulación del Proyecto'}
            </h2>
            <p className="text-[1em] font-bold opacity-90 uppercase tracking-tight mb-2" style={{ color: themeSecondary }}>
              {perfil.nombres} {perfil.apellidos}
            </p>
            <div className="inline-block px-4 py-1 rounded-full text-[0.8em] font-black uppercase tracking-widest" style={{ backgroundColor: themeSecondary, color: themePrimary }}>
              {formData.fase ? (formData.fase.charAt(0).toUpperCase() + formData.fase.slice(1)) : 'Formulación'}
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center font-bold transition-all shadow-md"
            style={{ color: themeSecondary }}
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Pasos */}
        <div className="relative border-b border-zinc-100 dark:border-white/5 bg-zinc-100/50 dark:bg-zinc-950/20 flex items-center shrink-0">
          <button 
            type="button"
            onClick={scrollStepsLeft}
            className="w-8 h-full min-h-[44px] flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold transition-all z-10 select-none border-r border-zinc-150 dark:border-white/5 text-[1.2em]"
            title="Deslizar izquierda"
          >
            ‹
          </button>

          <div 
            ref={stepsContainerRef}
            className="flex-1 p-2 flex gap-2 overflow-x-auto scrollbar-none scroll-smooth"
          >
            {Array.from({ length: 11 }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setStep(num)}
                style={step === num ? {
                  '--primario': themePrimary,
                  '--secundario': themeSecondary,
                } as React.CSSProperties : undefined}
                className={`p-2 rounded-[0.6rem] text-[0.8em] font-bold uppercase whitespace-nowrap transition-all border ${
                  step === num 
                    ? 'bg-[var(--secundario)] text-[var(--primario)] border-[var(--primario)] dark:bg-[var(--primario)] dark:text-[var(--secundario)] dark:border-[var(--secundario)]' 
                    : 'bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-500 hover:bg-zinc-200 border-transparent'
                }`}
              >
                {num}. {num === 1 ? '¿Qué Haremos?' : num === 2 ? '¿Por Qué?' : num === 3 ? '¿Para Qué?' : num === 4 ? '¿Para Quiénes?' : num === 5 ? '¿Dónde?' : num === 6 ? '¿Cómo Lo Haremos?' : num === 7 ? '¿Cuáles?' : num === 8 ? '¿Cuándo?' : num === 9 ? '¿Quiénes?' : num === 10 ? '¿Cuánto?' : '¿Con Qué?'}
              </button>
            ))}
            {proyecto && (
              <button
                onClick={() => setStep(12)}
                className={`px-4 py-2 rounded-2xl text-[0.8em] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  step === 12 ? 'text-white bg-green-600' : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                12. ¿Cómo Lo Hicimos?
              </button>
            )}
          </div>

          <button 
            type="button"
            onClick={scrollStepsRight}
            className="w-8 h-full min-h-[44px] flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold transition-all z-10 select-none border-l border-zinc-150 dark:border-white/5 text-[1.2em]"
            title="Deslizar derecha"
          >
            ›
          </button>
        </div>

        {/* Content Area */}
        <div 
          className="p-1 overflow-y-auto flex-1 space-y-2 unit-scrollbar"
          style={{ '--scrollbar-thumb': themePrimary } as React.CSSProperties}
        >

          {/* Paso 1: Qué Haremos */}
          {step === 1 && (
            <ProyectoPaso1Que
              formData={formData}
              setFormData={setFormData}
              competenciasAsociadas={competenciasAsociadas}
              setCompetenciasAsociadas={setCompetenciasAsociadas}
              perfil={perfil}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 2: Por Qué */}
          {step === 2 && (
            <ProyectoPaso2PorQue
              formData={formData}
              setFormData={setFormData}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 3: Para Qué */}
          {step === 3 && (
            <ProyectoPaso3ParaQue
              formData={formData}
              setFormData={setFormData}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 4: Para Quiénes */}
          {step === 4 && (
            <ProyectoPaso4ParaQuienes
              formData={formData}
              setFormData={setFormData}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 5: Dónde */}
          {step === 5 && (
            <ProyectoPaso5Donde
              formData={formData}
              setFormData={setFormData}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 6: Cómo lo haremos */}
          {step === 6 && (
            <ProyectoPaso6Como
              formData={formData}
              setFormData={setFormData}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 7: Cuáles (Actividades) */}
          {step === 7 && (
            <ProyectoPaso7Cuales
              actividades={actividades}
              addActividad={addActividad}
              removeActividad={removeActividad}
              updateActividad={updateActividad}
              articulosActividades={articulosActividades}
              setArticulosActividades={setArticulosActividades}
              miUnidad={miUnidad}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 8: Cuándo */}
          {step === 8 && (
            <ProyectoPaso8Cuando
              actividades={actividades}
              updateActividad={updateActividad}
              cicloActividades={cicloActividades}
              otrosProyectosActividades={otrosProyectosActividades}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 9: Quiénes (Equipo) */}
          {step === 9 && (
            <ProyectoPaso9Quienes
              perfil={perfil}
              actividades={actividades}
              unidades={unidades}
              filteredMiembros={filteredMiembros}
              participantesReg={participantesReg}
              handleToggleParticipanteReg={handleToggleParticipanteReg}
              handleUpdateParticipanteRegRol={handleUpdateParticipanteRegRol}
              handleUpdateParticipanteRegTarea={handleUpdateParticipanteRegTarea}
              participantesManuales={participantesManuales}
              addParticipanteManual={addParticipanteManual}
              removeParticipanteManual={removeParticipanteManual}
              updateParticipanteManual={updateParticipanteManual}
              memberSearch={memberSearch}
              setMemberSearch={setMemberSearch}
              selectedUnitFilter={selectedUnitFilter}
              setSelectedUnitFilter={setSelectedUnitFilter}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 10: Cuánto */}
          {step === 10 && (
            <ProyectoPaso10Cuanto
              actividades={actividades}
              presupuestoItems={presupuestoItems}
              addPresupuestoItem={addPresupuestoItem}
              removePresupuestoItem={removePresupuestoItem}
              updatePresupuestoItem={updatePresupuestoItem}
              totalIngresos={totalIngresos}
              totalGastos={totalGastos}
              balance={balance}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 11: Con Qué (Financiamiento) */}
          {step === 11 && (
            <ProyectoPaso11ConQue
              financiamientoItems={financiamientoItems}
              addFinanciamiento={addFinanciamiento}
              removeFinanciamiento={removeFinanciamiento}
              updateFinanciamiento={updateFinanciamiento}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

          {/* Paso 12: Cómo lo hicimos (Evaluación) */}
          {step === 12 && (
            <ProyectoPaso12ComoLoHicimos
              actividades={actividades}
              financiamientoItems={financiamientoItems}
              evaluacionesAct={evaluacionesAct}
              setEvaluacionesAct={setEvaluacionesAct}
              themePrimary={themePrimary}
              themeSecondary={themeSecondary}
            />
          )}

        </div>

        {/* Footer */}
        <div className="p-1 bg-zinc-50 dark:bg-black/20 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between shrink-0">
          
          
          <div className="flex gap-2">
            <button 
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-[1rem] font-bold uppercase tracking-tight text-[1em] disabled:opacity-50 transition-all"
            >
              ← Anterior
            </button>
            <button 
              type="button"
              onClick={() => handleSave(false)}
              disabled={loading}
              className="p-2 bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-zinc-100 rounded-[1rem] font-bold uppercase tracking-widest text-[1em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              style={{ backgroundColor: themeSecondary, color: themePrimary }}
            >
              {loading ? '⌛ Guardando...' : '💾 Guardar Proyecto'}
            </button>

            {proyecto && step === 12 && (
              <button 
                type="button"
                onClick={() => {
                  if(confirm('¿Concluir este proyecto de forma definitiva?')) {
                    handleSave(true)
                  }
                }}
                disabled={loading}
                className="p-2 bg-green-600 text-white rounded-[1rem] font-black uppercase tracking-tight text-[0.8em] hover:brightness-110 shadow-lg"
              >
                🏁 Concluir Proyecto
              </button>
            )}

            {step < (proyecto ? 12 : 11) && (
              <button 
                type="button"
                onClick={() => setStep(step + 1)}
                className="p-2 text-white rounded-[1rem] font-black uppercase tracking-tight text-[1em] hover:brightness-110 shadow-lg"
                style={{ backgroundColor: themePrimary, color: themeSecondary }}
              >
                Siguiente →
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
