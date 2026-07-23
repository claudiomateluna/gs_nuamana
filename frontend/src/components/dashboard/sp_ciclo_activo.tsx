'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { differenceInYears } from 'date-fns'
import DashModCicloCrear from './ciclo/mod_ciclo_crear'
import DashModPropuestaCrear from './ciclo/mod_lluvia_propuesta_crear'
import DashModVincularJuego from './ciclo/mod_votacion_vincular_juego'
import DashModAgendar from './ciclo/mod_planeacion_agendar'
import DashModVincularArticulo from './ciclo/mod_planeacion_vincular_articulo'
import DashModBitacoraCrear from './tally/mod_tally_crear'
import DashModAsistencia from './ciclo/mod_ciclo_asistencia'
import DashModEvaluarObjetivo from './progresion/mod_progresion_evaluar'
import DashModResena from './ciclo/mod_ciclo_resena'
import DashModProyectoWizard from './proyecto/mod_proyecto_wizard'
import DashModReagendar from './ciclo/mod_ejecucion_reagendar'
import DashModCrearActividadFase4 from './ciclo/mod_ejecucion_crear_actividad'
import { cycleService } from '@/services/cycleService'
import { projectService } from '@/services/projectService'
import { isDirectivo as isDirectivoRole, isAdmin } from '@/lib/roles'
import { UNIT_IDS } from '@/lib/unit-constants'
import type { Perfil, CicloUnidad, CicloPropuesta, ObjetivoMetadata, BitacoraPreData } from '@/types'

type CicloActivo = CicloUnidad
import RadarProgresion from './progresion/radar_progresion'

import CicloFase1Lluvia from './ciclo/CicloFase1Lluvia'
import CicloFase2Votacion from './ciclo/CicloFase2Votacion'
import CicloFase3Planeacion from './ciclo/CicloFase3Planeacion'
import CicloFase4Ejecucion from './ciclo/CicloFase4Ejecucion'
import CicloFase5Evaluacion from './ciclo/CicloFase5Evaluacion'
import { toast } from 'sonner';

interface DashCicloProps {
  perfil: Perfil
  cicloIdOverride?: string
  readOnlyOverride?: boolean
}

const FASES = [
  { id: 1, nombre: 'Diagnóstico y Énfasis', icono: '🔍' },
  { id: 2, nombre: 'Juego Democrático', icono: '🗳️' },
  { id: 3, nombre: 'Organización y Diseño', icono: '📅' },
  { id: 4, nombre: 'Ejecución de Actividades', icono: '⚜️' },
  { id: 5, nombre: 'Evaluación y Progresión', icono: '📊' }
]

const DashCiclo = React.memo(function DashCiclo({ perfil, cicloIdOverride, readOnlyOverride = false }: DashCicloProps) {
  const [cicloActivo, setCicloActivo] = useState<CicloActivo | null>(null)
  const [faseVisualizada, setFaseVisualizada] = useState<number>(1)
  const [propuestas, setPropuestas] = useState<CicloPropuesta[]>([])
  const [loading, setLoading] = useState(true)
  const [isModCicloOpen, setIsModCicloOpen] = useState(false)
  const [isModPropuestaOpen, setIsModPropuestaOpen] = useState(false)
  const [isModVincularJuegoOpen, setIsModVincularJuegoOpen] = useState(false)
  const [isModAgendarOpen, setIsModAgendarOpen] = useState(false)
  const [isModVincularArticuloOpen, setIsModVincularArticuloOpen] = useState(false)
  const [isModBitacoraOpen, setIsModBitacoraOpen] = useState(false)
  const [isModAsistenciaOpen, setIsModAsistenciaOpen] = useState(false)
  const [isModEvalActividadOpen, setIsModEvalActividadOpen] = useState(false)
  const [isModEvalNNJOpen, setIsModEvalNNJOpen] = useState(false)
  const [isModRadarOpen, setIsModRadarOpen] = useState(false)
  const [isModResenaOpen, setIsModResenaOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isModReagendarOpen, setIsModReagendarOpen] = useState(false)
  const [isModCrearActividadFase4Open, setIsModCrearActividadFase4Open] = useState(false)
  const [propuestaParaReagendar, setPropuestaParaReagendar] = useState<CicloPropuesta | null>(null)
  const [wizardProyecto, setWizardProyecto] = useState<Record<string, unknown> | null>(null)
  const [wizardEsGrupal, setWizardEsGrupal] = useState(true)
  const [actividadesAsistidas, setActividadesAsistidas] = useState<CicloPropuesta[]>([])
  const [evalActividadText, setEvalActividadText] = useState('')
  const [selectedPropuesta, setSelectedPropuesta] = useState<CicloPropuesta | null>(null)
  const [selectedNNJ, setSelectedNNJ] = useState<{ id: string; nombres: string; apellidos: string; unidad_id?: number | null; actividades: CicloPropuesta[] } | null>(null)
  const [bitacoraPreData, setBitacoraPreData] = useState<BitacoraPreData | null>(null)
  const [votos, setVotos] = useState<Array<{ propuesta_id: string; perfil_id: string; cantidad: number }>>([])
  const [objetivosTrabajados, setObjetivosTrabajados] = useState<ObjetivoMetadata[]>([])
  const [nnjEvaluables, setNnjEvaluables] = useState<Array<{ id: string; nombres: string; apellidos: string; unidad_id?: number | null; actividades: CicloPropuesta[] }>>([])
  const [evaluacionGeneral, setEvaluacionGeneral] = useState('')
  const [evaluacionEnfasis, setEvaluacionEnfasis] = useState('')
  const [savingEval, setSavingEval] = useState(false)
  const [savingEvalActividad, setSavingEvalActividad] = useState(false)
  
  const [error, setError] = useState<string | null>(null)
  const [votosTotales, setVotosTotales] = useState(1)
  const [votosMax, setVotosMax] = useState(1)
  const [votosIlimitados, setVotosIlimitados] = useState(false)
  const [savingRules, setSavingRules] = useState(false)
  
  const isDirectivo = isDirectivoRole(perfil)
  const canManage = isDirectivo && !readOnlyOverride
  const canDeleteCycle = canManage && (isAdmin(perfil) || (cicloActivo && cicloActivo.creado_por === perfil?.id))
  
  // Cuando es un ciclo ajeno, intentamos usar el color de esa unidad, si no el del perfil
  const unitColor = (typeof cicloActivo?.unidades?.colores === 'object' ? cicloActivo?.unidades?.colores?.primario : null) || (typeof perfil?.unidades?.colores === 'object' ? perfil?.unidades?.colores?.primario : null) || '#cb3327'

  const fetchCiclo = useCallback(async (silent: boolean = false) => {
    if (!perfil) {
      return
    }
    if (!perfil.unidad_id && !cicloIdOverride) {
      setCicloActivo(null)
      if (!silent) setLoading(false)
      return
    }
    if (!silent) setLoading(true)
    try {
      // 1. Cargar el Ciclo Activo
      const currentCiclo = await cycleService.getActiveCycle(
        perfil.unidad_id,
        cicloIdOverride,
        isAdmin(perfil))
      setCicloActivo(currentCiclo)
      
      if (currentCiclo) {
        setVotosTotales(currentCiclo.votos_totales_por_persona || 1)
        setVotosMax(currentCiclo.votos_max_por_propuesta || 1)
        setVotosIlimitados(currentCiclo.votos_ilimitados || false)
        setFaseVisualizada(currentCiclo.fase_actual)
        setEvaluacionGeneral(currentCiclo.evaluacion_general || '')
        setEvaluacionEnfasis(currentCiclo.evaluacion_enfasis || '')

        // 2. Cargar Propuestas de la Unidad + Actividades Grupales de Actas + Actividades Programadas de la Unidad
        const [proposalsList, grupalesList, progList] = await Promise.all([
          cycleService.getProposals(currentCiclo.id),
          cycleService.getGroupAgreements(currentCiclo.unidad_id),
          cycleService.getProgrammedActivities(currentCiclo.unidad_id)
        ])

        // Transformar acuerdos grupales al formato de propuestas para el calendario
        // Filtrar: descartar acuerdos cuya fecha de compromiso ya pasó antes de la creación del ciclo
        const parseLocal = (s: string) => { const parts = s.split('-'); if (parts.length < 3) return new Date(0); const [y, m, d] = parts.map(Number); return new Date(y, m - 1, d) }
        const fechaCreacionCiclo = currentCiclo.created_at ? parseLocal(currentCiclo.created_at.split('T')[0]) : null
        const grupalesMapped = grupalesList
          .filter(g => {
            if (!g.fecha_compromiso || !fechaCreacionCiclo) return true
            const fechaCompromiso = parseLocal(g.fecha_compromiso)
            return fechaCompromiso >= fechaCreacionCiclo
          })
          .map(g => ({
            id: g.id,
            titulo: g.titulo,
            descripcion: g.descripcion,
            fecha_programada: g.fecha_compromiso,
            seleccionada: true,
            es_grupal_global: true, // Flag para identificar en el calendario
            fichas_vinculadas: g.fichas_vinculadas || [],
            autor: { nombres: 'Consejo', apellidos: 'de Grupo' }
          }))

        // Transformar actividades programadas para el calendario
        const progMapped = progList.map(p => ({
          id: p.id,
          titulo: p.nombre,
          descripcion: `Tipo: ${p.tipo} | Lugar: ${p.lugar}`,
          fecha_programada: p.fecha_inicio,
          seleccionada: true,
          es_actividad_programada: true,
          actividad_programada_estado: p.estado,
          es_especialidad: p.tipo === 'Especialidad',
          tipo: p.tipo,
          lugar: p.lugar,
          autor: p.creador ? { nombres: p.creador.nombres, apellidos: p.creador.apellidos } : { nombres: 'Sistema', apellidos: '' }
        }))

        const allPropuestas = [...proposalsList, ...grupalesMapped, ...progMapped]
        setPropuestas(allPropuestas)

        if (currentCiclo.fase_actual >= 2) {
          const v = await cycleService.getVotes()
          setVotos(v)
        }

        if (currentCiclo.fase_actual >= 4) {
          const allObjs = []
          const unitName = currentCiclo.unidades?.nombre
          const normalizeStr = (str: string) => 
            str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";
          
          for (const p of allPropuestas) {
            if (p.seleccionada && p.articulo?.metadata?.objetivos_educativos) {
              const objs = p.articulo.metadata.objetivos_educativos
              const filtered = unitName 
                ? objs.filter((o: ObjetivoMetadata) => normalizeStr(o.unidad) === normalizeStr(unitName))
                : objs
              allObjs.push(...filtered)
            }
          }

          let filteredObjs = allObjs

          if (!isDirectivo) {
            // NNJ: Resolver etapa y rango etáreo
            let etapaRango = null
            let etapaUnidadId = null

            if (perfil.progresion_etapa_id) {
              const stageData = await cycleService.getEtapaProgresion(String(perfil.progresion_etapa_id))
              if (stageData) {
                etapaRango = stageData.rango_edad
                etapaUnidadId = stageData.unidad_id
              }
            }
            
            if (!etapaRango && perfil.unidad_id && perfil.fecha_nacimiento) {
              const birthDate = new Date(perfil.fecha_nacimiento)
              const age = differenceInYears(new Date(), birthDate)
              etapaUnidadId = perfil.unidad_id

              if (perfil.unidad_id === UNIT_IDS.MANADA) {
                etapaRango = age >= 9 ? "Infancia Tardía" : "Infancia Media"
              } else if (perfil.unidad_id === UNIT_IDS.COMPANIA || perfil.unidad_id === UNIT_IDS.TROPA) {
                etapaRango = age >= 13 ? "13 a 15 años" : "11 a 13 años"
              } else if (perfil.unidad_id === UNIT_IDS.AVANZADA) {
                etapaRango = "15 a 17 años"
              } else if (perfil.unidad_id === UNIT_IDS.CLAN) {
                etapaRango = "17 a 20 años"
              }
            }

            if (allObjs.length > 0 && etapaRango) {
              const dbObjs = await cycleService.getDbObjetivosFiltrados(allObjs.map((o: ObjetivoMetadata) => o.id))
              if (dbObjs) {
                filteredObjs = allObjs.filter((o: ObjetivoMetadata) => {
                  const dbObj = dbObjs.find((d: { id: string; rango_edad: string; unidad_id: number }) => d.id === o.id)
                  if (!dbObj) return false
                  return dbObj.unidad_id === etapaUnidadId && dbObj.rango_edad === etapaRango
                })
              }
            }
          }

          setObjetivosTrabajados(filteredObjs)

          if (isDirectivo) {
            // Dirigentes: Obtener lista de NNJ con sus asistencias para evaluar
            const users = await cycleService.getNnjForEvaluation(perfil.unidad_id ?? null)
            
            if (users && users.length > 0) {
              const selectedPropsIds = allPropuestas.filter(p => p.seleccionada).map(p => p.id)
              const assists = await cycleService.getAsistencias(selectedPropsIds)
              
              setNnjEvaluables(users.map(u => ({
                ...u,
                actividades: allPropuestas.filter(p => assists.some(a => a.perfil_id === u.id && a.propuesta_id === p.id))
              })))
            }
          } else {
            // NNJ: Obtener sus propias asistencias
            const selectedPropsIds = allPropuestas.map(p => p.id)
            const asistencias = await cycleService.getAsistencias(selectedPropsIds, perfil.id)
            
            if (asistencias) {
              const ids = asistencias.map(a => a.propuesta_id)
              setActividadesAsistidas(allPropuestas.filter(p => ids.includes(p.id)))
            }
          }
        }
      }
    } catch (err: unknown) {
      console.error('Error fetching ciclo:', (err as Error).message)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [perfil?.unidad_id, cicloIdOverride, perfil?.id])

  const guardarEvaluacionActividad = async () => {
    if (!selectedPropuesta) return
    setSavingEvalActividad(true)
    try {
      // 1. Guardar en la propuesta
      await cycleService.updateProposalEvaluation(selectedPropuesta.id, evalActividadText)
      
      // 2. Buscar si hay una bitácora para esta actividad y agregar comentario
      const bitacora = await cycleService.getLatestBitacoraWithTitle(perfil.unidad_id ?? null, selectedPropuesta.titulo)

      if (bitacora) {
        const nuevaHistoria = `${bitacora.historia}\n\n--- EVALUACIÓN DE ACTIVIDAD ---\n${evalActividadText}`
        await cycleService.updateBitacoraHistory(bitacora.id, nuevaHistoria)
      }

      toast.success('Evaluación de actividad guardada.')
      setIsModEvalActividadOpen(false)
      fetchCiclo(false)
    } catch (err: unknown) {
      toast.error('Error: ' + (err as Error).message)
    } finally {
      setSavingEvalActividad(false)
    }
  }

  useEffect(() => {
    fetchCiclo()
  }, [perfil?.unidad_id, cicloIdOverride])

  const togglePreseleccion = async (propId: string, valor: boolean) => {
    try {
      await cycleService.toggleProposalPreselection(propId, valor)
      fetchCiclo()
    } catch (error: unknown) {
      console.error('Error in togglePreseleccion:', error)
      toast.error('Error al preseleccionar: ' + (error as Error).message)
    }
  }

  const eliminarPropuesta = async (propId: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta propuesta?')) return
    try {
      await cycleService.deleteProposal(propId)
      fetchCiclo()
    } catch (error: unknown) {
      toast.error('Error al eliminar propuesta: ' + (error as Error).message)
    }
  }

  const avanzarFase = async () => {
    if (!confirm('¿Seguro que deseas avanzar a la siguiente fase? Esta acción no se puede deshacer fácilmente.')) return
    
    const nuevaFase = (cicloActivo!.fase_actual || 1) + 1
    if (nuevaFase > 5) { toast.info('El ciclo ya está en su fase final.'); return; }

    try {
      await cycleService.advanceStage(cicloActivo!.id, nuevaFase)
      fetchCiclo()
    } catch (error: unknown) {
      toast.error('Error al avanzar de fase: ' + (error as Error).message)
    }
  }

  const guardarReglasVotacion = async () => {
    if (!cicloActivo) return
    setSavingRules(true)
    try {
      await cycleService.updateVotingRules(
        cicloActivo.id,
        votosTotales,
        votosMax,
        votosIlimitados
      )
      toast.success('Reglas de votación actualizadas.')
      fetchCiclo(true)
    } catch (err: unknown) {
      toast.error('Error al guardar reglas: ' + (err as Error).message)
    } finally {
      setSavingRules(false)
    }
  }

  const guardarEvaluacion = async () => {
    setSavingEval(true)
    try {
      await cycleService.updateGeneralEvaluation(
        cicloActivo!.id,
        evaluacionGeneral,
        evaluacionEnfasis
      )
      toast.success('Evaluación guardada correctamente.')
      fetchCiclo()
    } catch (err: unknown) {
      toast.error('Error al guardar la evaluación: ' + (err as Error).message)
    } finally {
      setSavingEval(false)
    }
  }

  const cerrarCiclo = async () => {
    if (!confirm('¿Estás seguro de cerrar este Ciclo de Programa? Al cerrarlo, ya no podrás modificarlo y deberás crear uno nuevo.')) return
    
    setLoading(true)
    try {
      await cycleService.closeCycle(cicloActivo!.id)
      fetchCiclo()
    } catch (err: unknown) {
      toast.error('Error al cerrar el ciclo: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const eliminarCicloActivo = async () => {
    if (!cicloActivo) return
    const confirmMessage = `¿Seguro que deseas eliminar el ciclo activo "${cicloActivo.nombre}"? Se borrarán de forma permanente todas las propuestas, votos y asistencias asociadas. Esta acción es irreversible.`
    if (!confirm(confirmMessage)) return

    setLoading(true)
    try {
      await cycleService.deleteActiveCycle(cicloActivo.id)
      toast.success('Ciclo activo eliminado correctamente.')
      fetchCiclo()
    } catch (err: unknown) {
      toast.error('Error al eliminar el ciclo: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }



  if (loading) return <div className="p-20 text-center animate-pulse uppercase tracking-widest text-[0.8em]">Sincronizando Ciclo...</div>

  if (error) return (
    <div className="p-10 bg-red-50 border-2 border-red-200 rounded-[2rem] text-center space-y-4">
      <span className="text-4xl">⚠️</span>
      <h3 className="text-xl font-black text-red-900 uppercase">Error al cargar el ciclo</h3>
      <p className="text-red-700 font-medium italic">{error}</p>
      <button onClick={() => fetchCiclo()} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold uppercase text-xs">Reintentar</button>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {cicloActivo ? (
        <>
          {/* HEADER DEL CICLO */}
          <div 
            className="relative p-4 rounded-[1rem] text-white shadow-2xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, #1b1b1b 0%, ${unitColor} 100%)` }}
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none select-none">
              <span className="text-[8rem] leading-none font-black uppercase font-display">{cicloActivo.nombre}</span>
              {(cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url) && (
                <img 
                  src={cicloActivo?.unidades?.logo_unidad_url ?? perfil.unidades?.logo_unidad_url ?? ''} 
                  alt="" 
                  className="absolute right-0 -bottom-20 w-[28rem] h-[28rem] object-contain"
                />
              )}
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[0.8em] font-black uppercase tracking-widest border border-white/30">
                  {cicloActivo?.unidades?.nombre || perfil.unidades?.nombre} • Fase {cicloActivo.fase_actual}
                </span>
                <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter leading-none drop-shadow-lg">
                  {cicloActivo.nombre}
                </h2>
                {cicloActivo.enfasis && (
                  <p className="text-lg font-body italic font-medium text-white/90 max-w-2xl bg-black/10 p-4 rounded-2xl border-l-4 border-white/50">
                    "{cicloActivo.enfasis}"
                  </p>
                )}
              </div>
              {canManage && !readOnlyOverride && (
                <div className="flex flex-wrap gap-3">
                  {canDeleteCycle && (
                    <button 
                      onClick={eliminarCicloActivo}
                      className="px-6 py-3 bg-red-650 hover:bg-red-700 text-white font-black uppercase rounded-xl shadow-xl hover:scale-105 transition-all text-[0.8em] tracking-widest"
                    >
                      🗑️ Eliminar Ciclo
                    </button>
                  )}
                  <button 
                    onClick={avanzarFase}
                    className="px-6 py-3 bg-white text-clr5 font-black uppercase rounded-xl shadow-xl hover:scale-105 transition-all text-[0.8em] tracking-widest"
                  >
                    ⏭️ Siguiente Fase
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* LÍNEA DE TIEMPO DE FASES */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {FASES.map((fase) => {
              const isCurrent = cicloActivo.fase_actual === fase.id
              const isPast = cicloActivo.fase_actual > fase.id
              const isVisualized = faseVisualizada === fase.id
              
              return (
                <div 
                  key={fase.id} 
                  onClick={() => setFaseVisualizada(fase.id)}
                  style={{ borderColor: isVisualized ? unitColor : (isCurrent ? unitColor : undefined) }}
                  className={`p-2 rounded-[1rem] border-2 transition-all flex flex-col items-center text-center gap-2 relative cursor-pointer hover:scale-105 active:scale-95 ${
                    isVisualized ? 'bg-white dark:bg-clr3 shadow-xl z-10' : 
                    isPast ? 'bg-zinc-50 dark:bg-black/10 border-green-500/30 opacity-60' : 
                    isCurrent ? 'bg-zinc-50 dark:bg-black/10 opacity-80' :
                    'bg-zinc-50 dark:bg-black/10 border-zinc-100 dark:border-clr4 opacity-30'
                  }`}
                >
                  <span className="text-3xl mt-3">{fase.icono}</span>
                  <p className="text-[1em] font-black uppercase tracking-widest leading-tight">
                    {fase.nombre}
                  </p>
                  {isCurrent && (
                    <div 
                      className="absolute -top-4 px-3 py-1 text-white text-[0.9em] font-bold rounded-full uppercase"
                      style={{ backgroundColor: unitColor }}
                    >
                      Actual
                    </div>
                  )}
                  {isPast && !isVisualized && (
                    <div className="absolute -top-3 px-3 py-1 bg-green-500 text-white text-[8px] font-black rounded-full uppercase">
                      Completada
                    </div>
                  )}
                  {isVisualized && !isCurrent && !isPast && (
                    <div className="absolute -top-3 px-3 py-1 bg-zinc-400 text-white text-[8px] font-black rounded-full uppercase">
                      Viendo
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CONTENIDO SEGÚN FASE */}
          {faseVisualizada === 1 && (
            <CicloFase1Lluvia
              perfil={perfil}
              cicloActivo={cicloActivo}
              propuestas={propuestas}
              readOnlyOverride={readOnlyOverride}
              canManage={canManage}
              unitColor={unitColor}
              setIsModPropuestaOpen={setIsModPropuestaOpen}
              togglePreseleccion={togglePreseleccion}
              eliminarPropuesta={eliminarPropuesta}
            />
          )}

          {faseVisualizada === 2 && (
            <CicloFase2Votacion
              perfil={perfil}
              cicloActivo={cicloActivo}
              propuestas={propuestas}
              votos={votos}
              readOnlyOverride={readOnlyOverride}
              isDirectivo={isDirectivo}
              canManage={canManage}
              unitColor={unitColor}
              votosTotales={votosTotales}
              setVotosTotales={setVotosTotales}
              votosMax={votosMax}
              setVotosMax={setVotosMax}
              votosIlimitados={votosIlimitados}
              setVotosIlimitados={setVotosIlimitados}
              savingRules={savingRules}
              guardarReglasVotacion={guardarReglasVotacion}
              setIsModVincularJuegoOpen={setIsModVincularJuegoOpen}
              onVoteClick={async (propId, currentQty, delta) => {
                const nuevaCant = currentQty + delta
                try {
                  await cycleService.registerVote(propId, perfil.id, nuevaCant)
                  fetchCiclo(true)
                } catch (err: unknown) {
                  toast.error('Error al votar: ' + (err as Error).message)
                }
              }}
            />
          )}

          {faseVisualizada === 3 && (
            <CicloFase3Planeacion
              perfil={perfil}
              cicloActivo={cicloActivo}
              propuestas={propuestas}
              votos={votos}
              canManage={canManage}
              unitColor={unitColor}
              setSelectedPropuesta={setSelectedPropuesta}
              setIsModAgendarOpen={setIsModAgendarOpen}
              setIsModVincularArticuloOpen={setIsModVincularArticuloOpen}
              setWizardProyecto={setWizardProyecto}
              setWizardEsGrupal={setWizardEsGrupal}
              setIsWizardOpen={setIsWizardOpen}
              onUnscheduleProposal={async (propId) => {
                if (!confirm('¿Quitar del calendario? Volverá a los resultados.')) return
                try {
                  await cycleService.unscheduleProposal(propId)
                  fetchCiclo()
                } catch (err: unknown) {
                  toast.error('Error al desagendar: ' + (err as Error).message)
                }
              }}
            />
          )}

          {faseVisualizada === 4 && (
            <CicloFase4Ejecucion
              perfil={perfil}
              cicloActivo={cicloActivo}
              propuestas={propuestas}
              unitColor={unitColor}
              canManage={canManage}
              isDirectivo={isDirectivo}
              readOnlyOverride={readOnlyOverride}
              actividadesAsistidas={actividadesAsistidas}
              setSelectedPropuesta={setSelectedPropuesta}
              setEvalActividadText={setEvalActividadText}
              setIsModEvalActividadOpen={setIsModEvalActividadOpen}
              setIsModAsistenciaOpen={setIsModAsistenciaOpen}
              setIsModResenaOpen={setIsModResenaOpen}
              setIsModEvalNNJOpen={setIsModEvalNNJOpen}
              setBitacoraPreData={setBitacoraPreData}
              setIsModBitacoraOpen={setIsModBitacoraOpen}
              setWizardProyecto={setWizardProyecto}
              setWizardEsGrupal={setWizardEsGrupal}
              setIsWizardOpen={setIsWizardOpen}
              onMover={(p) => { setPropuestaParaReagendar(p); setIsModReagendarOpen(true) }}
              onNuevaActividad={() => setIsModCrearActividadFase4Open(true)}
            />
          )}

          {faseVisualizada === 5 && (
            <CicloFase5Evaluacion
              perfil={perfil}
              cicloActivo={cicloActivo}
              propuestas={propuestas}
              votos={votos}
              objetivosTrabajados={objetivosTrabajados}
              unitColor={unitColor}
              canManage={canManage}
              isDirectivo={isDirectivo}
              readOnlyOverride={readOnlyOverride}
              actividadesAsistidas={actividadesAsistidas}
              nnjEvaluables={nnjEvaluables}
              evaluacionGeneral={evaluacionGeneral}
              setEvaluacionGeneral={setEvaluacionGeneral}
              evaluacionEnfasis={evaluacionEnfasis}
              setEvaluacionEnfasis={setEvaluacionEnfasis}
              setSelectedPropuesta={setSelectedPropuesta}
              setIsModEvalNNJOpen={setIsModEvalNNJOpen}
              setSelectedNNJ={setSelectedNNJ}
              setIsModRadarOpen={setIsModRadarOpen}
              cerrarCiclo={cerrarCiclo}
              guardarEvaluacion={guardarEvaluacion}
            />
          )}

          {/* PLACEHOLDER PARA OTRAS FASES */}
          {cicloActivo.fase_actual > 5 && (
            <div className="bg-white dark:bg-black/10 p-10 rounded-[1rem] border border-zinc-100 dark:border-clr4 min-h-[400px] flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
               <div className="max-w-md space-y-4">
                 <span className="text-6xl">🚧</span>
                 <h3 className="text-2xl font-black font-display uppercase tracking-tight">Fase {cicloActivo.fase_actual}: {FASES[cicloActivo.fase_actual-1].nombre}</h3>
                 <p className="font-body text-clr2 dark:text-clr8 leading-relaxed italic">
                   Estamos construyendo las herramientas interactivas para esta fase. 
                   El Juego Democrático y la Planificación estarán listos pronto.
                 </p>
               </div>
            </div>
          )}
        </>
      ) : (
        /* VISTA CUANDO NO HAY CICLO ACTIVO O NO SE ENCONTRÓ EL HISTÓRICO */
        <div className="py-32 text-center border-4 border-dashed border-zinc-100 dark:border-clr4 rounded-[2rem] space-y-6 animate-in zoom-in duration-700">
          <span className="text-8xl block opacity-40">
            {!perfil.unidad_id && !cicloIdOverride ? '🚫' : cicloIdOverride ? '📜' : '🌑'}
          </span>
          <div className="space-y-2 opacity-40">
            <h2 className="text-3xl font-black font-display uppercase tracking-widest">
              {!perfil.unidad_id && !cicloIdOverride 
                ? 'No tienes unidad asignada' 
                : cicloIdOverride ? 'Ciclo no encontrado' : 'No hay un Ciclo de Programa activo'}
            </h2>
            <p className="font-body text-xl max-w-lg mx-auto">
              {!perfil.unidad_id && !cicloIdOverride
                ? 'Para visualizar o gestionar un ciclo de programa, debes tener una unidad asignada en tu perfil.'
                : cicloIdOverride 
                  ? 'El ciclo que buscas no existe o no tienes permisos para visualizarlo.' 
                  : isDirectivo 
                    ? 'Es momento de iniciar un nuevo viaje pedagógico con tu unidad.' 
                    : 'Tu equipo de dirigentes iniciará pronto un nuevo ciclo de aventuras.'}
            </p>
          </div>
          {canManage && !readOnlyOverride && perfil.unidad_id && (
            <button 
              onClick={() => setIsModCicloOpen(true)}
              className="px-10 py-5 bg-clr6 text-white font-black uppercase rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all tracking-[0.2em] text-sm"
            >
              ✨ Iniciar Nuevo Ciclo
            </button>
          )}
        </div>
      )}

      {/* MODALES */}
      <DashModCicloCrear 
        isOpen={isModCicloOpen}
        onClose={() => setIsModCicloOpen(false)}
        perfil={perfil}
        onSuccess={fetchCiclo}
      />

      {cicloActivo && (
        <DashModPropuestaCrear 
          isOpen={isModPropuestaOpen}
          onClose={() => setIsModPropuestaOpen(false)}
          perfil={perfil}
          cicloId={cicloActivo.id}
          onSuccess={fetchCiclo}
        />
      )}
      {cicloActivo && (
        <DashModVincularJuego
          isOpen={isModVincularJuegoOpen}
          onClose={() => setIsModVincularJuegoOpen(false)}
          cicloActivo={cicloActivo}
          onSuccess={fetchCiclo}
        />
      )}
      {cicloActivo && selectedPropuesta && (
        <DashModAgendar
          isOpen={isModAgendarOpen}
          onClose={() => setIsModAgendarOpen(false)}
          propuesta={selectedPropuesta}
          onSuccess={fetchCiclo}
        />
      )}
      {cicloActivo && (
        <DashModVincularArticulo
          isOpen={isModVincularArticuloOpen}
          onClose={() => setIsModVincularArticuloOpen(false)}
          propuestaId={selectedPropuesta?.id ?? ''}
          onSuccess={fetchCiclo}
          unidadNombre={cicloActivo?.unidades?.nombre}
        />
      )}
      {cicloActivo && selectedPropuesta && (
        <DashModAsistencia
          isOpen={isModAsistenciaOpen}
          onClose={() => setIsModAsistenciaOpen(false)}
          propuesta={selectedPropuesta}
          perfil={perfil}
          cicloActivo={cicloActivo}
          onSuccess={fetchCiclo}
        />
      )}
            {cicloActivo && isModEvalActividadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-clr3 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border-2 border-white dark:border-clr4 animate-in zoom-in duration-300">
            <div className="p-4 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-4xl block mb-2">📝</span>
                <h2 className="text-2xl font-black uppercase text-clr5 dark:text-white">Evaluar Actividad</h2>
                <p className="text-[1em] text-zinc-500 dark:text-zinc-400 italic">¿Cómo resultó "{selectedPropuesta?.titulo}"?</p>
              </div>

              <div className="space-y-2">
                <label className="text-[1em] font-black uppercase tracking-widest opacity-60">Resumen y Observaciones</label>
                <textarea
                  value={evalActividadText}
                  onChange={(e) => setEvalActividadText(e.target.value)}
                  placeholder="La actividad resultó un éxito porque..."
                  className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-black/20 font-bold min-h-[150px]"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-100 dark:border-clr4">
                <button
                  type="button"
                  onClick={() => setIsModEvalActividadOpen(false)}
                  className="flex-1 py-4 bg-zinc-100 dark:bg-black/20 font-black uppercase rounded-2xl tracking-widest text-[0.9em]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarEvaluacionActividad}
                  disabled={savingEvalActividad}
                  className="flex-1 py-4 bg-clr7 text-white font-black uppercase rounded-2xl tracking-widest text-[0.9em] shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  {savingEvalActividad ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <DashModEvaluarObjetivo
        isOpen={isModEvalNNJOpen}
        onClose={() => setIsModEvalNNJOpen(false)}
        perfil={perfil}
        propuesta={selectedPropuesta!}
        perfilNNJ={selectedNNJ as unknown as Perfil | undefined}
        onSuccess={fetchCiclo}
      />

      {/* MODAL RADAR PROGRESIÓN */}
      {isModRadarOpen && selectedNNJ && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-clr3 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white dark:border-clr4 animate-in zoom-in duration-300 flex flex-col">
            <div className="p-8 pb-4 space-y-2 border-b border-zinc-50 dark:border-clr4 text-center">
              <span className="text-[0.8em] font-black uppercase tracking-[0.2em] text-clr7">Radar de Desarrollo 360º</span>
              <h3 className="text-2xl font-black uppercase text-clr5 dark:text-white leading-tight">
                {selectedNNJ.nombres} {selectedNNJ.apellidos}
              </h3>
            </div>
            <div className="p-8">
              <RadarProgresion perfilId={selectedNNJ.id} unidadColor={unitColor} />
            </div>
            <div className="p-8 pt-0 text-center">
              <button 
                onClick={() => setIsModRadarOpen(false)}
                className="px-8 py-4 bg-zinc-900 text-white text-xs font-black uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest"
              >
                Cerrar Vista
              </button>
            </div>
          </div>
        </div>
      )}

      <DashModResena
        isOpen={isModResenaOpen}
        onClose={() => setIsModResenaOpen(false)}
        propuesta={selectedPropuesta!}
        perfil={perfil}
        onSuccess={fetchCiclo}
      />

      {isModReagendarOpen && propuestaParaReagendar && (
        <DashModReagendar
          isOpen={isModReagendarOpen}
          onClose={() => { setIsModReagendarOpen(false); setPropuestaParaReagendar(null) }}
          propuesta={propuestaParaReagendar}
          onSuccess={() => { fetchCiclo(); setIsModReagendarOpen(false); setPropuestaParaReagendar(null) }}
        />
      )}

      {isModCrearActividadFase4Open && cicloActivo && (
        <DashModCrearActividadFase4
          isOpen={isModCrearActividadFase4Open}
          onClose={() => setIsModCrearActividadFase4Open(false)}
          cicloId={cicloActivo.id}
          perfilId={perfil.id}
          unidadNombre={cicloActivo?.unidades?.nombre}
          onSuccess={() => { fetchCiclo(); setIsModCrearActividadFase4Open(false) }}
        />
      )}

      <DashModBitacoraCrear
        isOpen={isModBitacoraOpen}
        onClose={() => { setIsModBitacoraOpen(false); setBitacoraPreData(null); }}
        perfil={perfil}
        onSuccess={() => { setIsModBitacoraOpen(false); setBitacoraPreData(null); }}
        defaultData={bitacoraPreData || undefined}
      />
      <DashModProyectoWizard
        isOpen={isWizardOpen}
        onClose={() => { setIsWizardOpen(false); setWizardProyecto(null); }}
        perfil={perfil}
        proyecto={wizardProyecto}
        esGrupal={wizardEsGrupal}
        onSuccess={fetchCiclo}
      />
    </div>
  )
});

export default DashCiclo;
