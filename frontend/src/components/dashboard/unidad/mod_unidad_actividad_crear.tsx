'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { supabase } from '@/lib/supabase'
import type { Perfil, Unidad } from '@/types'
import { toast } from 'sonner'
import { useSiteConfigSafe } from '@/contexts/site-config-context'

interface EditingActividad {
  id: string
  tipo: string
  nombre: string
  lugar: string
  fecha_inicio: string
  fecha_fin: string
}

interface DashModActividadCrearProps {
  isOpen: boolean
  onClose: () => void
  perfil: Partial<Perfil> & { id: string; unidad_id?: number | null }
  unidades?: Unidad[]
  onSuccess: () => void
  editingActividad?: EditingActividad | null
}

const COMUNAS_RM = [
  'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí', 'El Bosque', 'Estación Central',
  'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana',
  'La Reina', 'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul',
  'Maipú', 'Ñuñoa', 'Padre Hurtado', 'Pedro Aguirre Cerda', 'Peñaflor', 'Peñalolén',
  'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal',
  'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 'San José de Maipo', 'San Miguel',
  'San Ramón', 'Santiago', 'Vitacura'
].sort()

const ZONAS_DISTRITOS: Record<string, string[]> = {
  'La Florida': ['Mapurayen', 'Bellavista', 'Peñimahuida'],
  'Cajón del Maipo': ['Camilo Henríquez', 'Las Vizcachas', 'Puente Alto Poniente'],
  'Santiago Centro': ['Cerro Huelén', 'Santiago Centro', 'Providencia'],
  'Santiago Cordillera': ['Apoquindo', 'Los Leones', 'Manquehue', 'Vitacura'],
  'Maipo': ['San Bernardo', 'El Bosque', 'Valle del Maipo'],
  'Santiago Norte': ['Chacabuco', 'Conchalí', 'La Cañadilla', 'Quilicura', 'Renca'],
  'Santiago Oeste': ['Cerrillos', 'Maipú Nuevo Extremo', 'Melipilla', 'Pila del Ganso', 'Quilamapu', 'Quinta Normal-Cerro Navia', 'Talakanta'],
  'Santiago Oriente': ['La Reina', 'Macul', 'Ñuñoa', 'Pedro de Valdivia', 'Peñalolén'],
  'Santiago Sur': ['La Cisterna', 'La Granja', 'Pedro Aguirre Cerda', 'San Joaquín', 'San Miguel', 'Santa Rosa']
}

export default function DashModActividadCrear({
  isOpen,
  onClose,
  perfil,
  unidades = [],
  onSuccess,
  editingActividad
}: DashModActividadCrearProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const siteConfig = useSiteConfigSafe()
  const defaultZona = siteConfig?.branding?.zona || 'La Florida'
  const defaultDistrito = siteConfig?.branding?.distrito || 'Mapurayen'
  const defaultComuna = siteConfig?.contact?.ciudad || 'La Granja'
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [firmaCapturada, setFirmaCapturada] = useState(false)

  const isEditing = !!editingActividad?.id
  const nombreUsuario = [perfil?.nombres, perfil?.apellidos].filter(Boolean).join(' ') || ''
  const telefonoUsuario = perfil?.telefono || ''

  // Form State
  const [tipo, setTipo] = useState(editingActividad?.tipo || 'Salida')
  const [nombre, setNombre] = useState(editingActividad?.nombre || '')
  const [lugar, setLugar] = useState(editingActividad?.lugar || '')
  const [fechaInicio, setFechaInicio] = useState(editingActividad?.fecha_inicio || '')
  const [fechaFin, setFechaFin] = useState(editingActividad?.fecha_fin || '')
  
  // Unidades seleccionadas
  const [unidadesSel, setUnidadesSel] = useState({
    manada: true,
    cia: true,
    tropa: true,
    avanzada: true,
    clan: true,
  })

  // Paso 2: Aforo y Ubicación
  const [zona, setZona] = useState(defaultZona)
  const [distrito, setDistrito] = useState(defaultDistrito)
  const [comuna, setComuna] = useState(defaultComuna)
  const [localidad, setLocalidad] = useState('')
  const [numDirigentes, setNumDirigentes] = useState('')
  const [numNnj, setNumNnj] = useState('')
  const [numApoderados, setNumApoderados] = useState('')
  const [rangoEdad1, setRangoEdad1] = useState('7')
  const [rangoEdad2, setRangoEdad2] = useState('19')

  // Paso 3: Contactos de Emergencia
  const [emergencia1Nombre, setEmergencia1Nombre] = useState(nombreUsuario)
  const [emergencia1Fono, setEmergencia1Fono] = useState(telefonoUsuario)
  const [emergencia2Nombre, setEmergencia2Nombre] = useState('')
  const [emergencia2Fono, setEmergencia2Fono] = useState('')

  // Paso 4: Responsable y Firma
  const [responsable, setResponsable] = useState(nombreUsuario)
  const [telefonoResp, setTelefonoResp] = useState(telefonoUsuario)
  const [emailDistrito, setEmailDistrito] = useState('')
  const [firmaB64, setFirmaB64] = useState<string | null>(null)

  // Sincronizar autocompletado si perfil carga o cambia
  useEffect(() => {
    if (nombreUsuario && !responsable) {
      setResponsable(nombreUsuario)
      setEmergencia1Nombre(nombreUsuario)
    }
    if (telefonoUsuario && !telefonoResp) {
      setTelefonoResp(telefonoUsuario)
      setEmergencia1Fono(telefonoUsuario)
    }
  }, [nombreUsuario, telefonoUsuario])

  // Sincronizar autocompletado y configuración de marca/contacto al abrir el modal o cambiar siteConfig
  useEffect(() => {
    if (!isOpen) return

    // 1. Aplicar primero desde siteConfig si está disponible
    if (siteConfig?.branding?.zona) {
      setZona(siteConfig.branding.zona)
      if (siteConfig.branding.distrito) {
        setDistrito(siteConfig.branding.distrito)
      }
    }
    if (siteConfig?.contact?.ciudad) {
      setComuna(siteConfig.contact.ciudad)
    }

    // 2. Consultar directamente a configuracion_sitio para garantizar los datos más frescos en tiempo real
    const fetchLatestConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracion_sitio')
          .select('categoria, clave, valor')
          .in('categoria', ['branding', 'contact'])

        if (!error && data && data.length > 0) {
          let bZona = ''
          let bDistrito = ''
          let cCiudad = ''

          for (const row of data) {
            let val = row.valor
            if (typeof val === 'string') {
              try { val = JSON.parse(val) } catch { /* valor ya deserializado */ }
            }
            if (row.categoria === 'branding' && row.clave === 'zona' && typeof val === 'string') {
              bZona = val
            }
            if (row.categoria === 'branding' && row.clave === 'distrito' && typeof val === 'string') {
              bDistrito = val
            }
            if (row.categoria === 'contact' && row.clave === 'ciudad' && typeof val === 'string') {
              cCiudad = val
            }
          }

          if (bZona) {
            setZona(bZona)
            if (bDistrito && ZONAS_DISTRITOS[bZona]?.includes(bDistrito)) {
              setDistrito(bDistrito)
            } else if (ZONAS_DISTRITOS[bZona]?.[0]) {
              setDistrito(ZONAS_DISTRITOS[bZona][0])
            }
          }
          if (cCiudad && COMUNAS_RM.includes(cCiudad)) {
            setComuna(cCiudad)
          }
        }
      } catch (err) {
        console.error('Error al sincronizar configuración de marca para salidas:', err)
      }
    }

    fetchLatestConfig()
  }, [isOpen, siteConfig?.branding?.zona, siteConfig?.branding?.distrito, siteConfig?.contact?.ciudad])

  // Máscara de teléfono Chileno
  const aplicarMascaraFono = (val: string) => {
    let d = val.replace(/\D/g, '')
    if (d.startsWith('56')) d = d.slice(2)
    d = d.slice(0, 9)
    if (d.length > 0) {
      let f = '+56 ' + d.substring(0, 1)
      if (d.length > 1) f += ' ' + d.substring(1, 5)
      if (d.length > 5) f += ' ' + d.substring(5, 9)
      return f
    }
    return ''
  }

  const toggleTodoGrupo = () => {
    const todosMarcados = Object.values(unidadesSel).every(Boolean)
    const nuevoValor = !todosMarcados
    setUnidadesSel({
      manada: nuevoValor,
      cia: nuevoValor,
      tropa: nuevoValor,
      avanzada: nuevoValor,
      clan: nuevoValor,
    })
  }

  const limpiarFirma = () => {
    sigCanvas.current?.clear()
    setFirmaB64(null)
    setFirmaCapturada(false)
  }

  const confirmarFirma = useCallback(() => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getCanvas().toDataURL('image/png')
      setFirmaB64(dataUrl)
      setFirmaCapturada(true)
      toast.success('Firma digital capturada')
    } else {
      toast.error('Por favor dibuja tu firma antes de confirmar')
    }
  }, [])

  if (!isOpen) return null

  // Total de adultos calculado
  const totalAdultos = (Number(numDirigentes) || 0) + (Number(numApoderados) || 0)

  // Validación por paso
  const validarPasoActual = (): boolean => {
    if (step === 1) {
      if (!nombre.trim()) { toast.error('Ingresa el nombre de la actividad'); return false; }
      if (!lugar.trim()) { toast.error('Ingresa el lugar de la actividad'); return false; }
      if (tipo !== 'Especialidad' && !localidad.trim()) {
        toast.error('Ingresa la localidad o sector referencial');
        return false;
      }
      if (!fechaInicio) { toast.error('Selecciona la fecha de inicio'); return false; }
      if (!fechaFin) { toast.error('Selecciona la fecha de término'); return false; }
      if (tipo !== 'Especialidad' && !Object.values(unidadesSel).some(Boolean)) {
        toast.error('Selecciona al menos una unidad participante');
        return false;
      }
      return true
    }
    if (step === 2) {
      if (!numDirigentes) { toast.error('Indica el número estimado de dirigentes'); return false; }
      if (!numNnj) { toast.error('Indica el número estimado de NNJ'); return false; }
      const e1 = Number(rangoEdad1)
      const e2 = Number(rangoEdad2)
      if (isNaN(e1) || e1 < 5 || e1 > 22 || isNaN(e2) || e2 < 5 || e2 > 22) {
        toast.error('Los rangos de edad deben estar entre 5 y 22 años');
        return false;
      }
      return true
    }
    if (step === 3) {
      if (!emergencia1Nombre.trim() || !emergencia1Fono.trim()) {
        toast.error('El Contacto de Emergencia 1 es obligatorio');
        return false;
      }
      return true
    }
    if (step === 4) {
      if (!responsable.trim()) { toast.error('Indica el nombre del responsable'); return false; }
      if (!telefonoResp.trim()) { toast.error('Indica el teléfono de contacto'); return false; }
      if (!firmaB64) {
        // Intentar capturar del canvas si el usuario dibujó pero no dio clic en "Confirmar"
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
          const dataUrl = sigCanvas.current.getCanvas().toDataURL('image/png')
          setFirmaB64(dataUrl)
        } else {
          toast.error('Debes dibujar y confirmar tu firma digital para formalizar los documentos');
          return false;
        }
      }
      return true
    }
    return true
  }

  const avanzarPaso = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    if (validarPasoActual()) {
      setStep(s => Math.min(s + 1, 4))
    }
  }

  const retrocederPaso = () => {
    setStep(s => Math.max(s - 1, 1))
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarPasoActual()) return

    setLoading(true)
    try {
      // 1. Guardar o actualizar en base de datos `actividades_programadas`
      const todosMarcados = Object.values(unidadesSel).every(Boolean)
      const actividadData = {
        tipo,
        nombre,
        lugar,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        unidad_id: todosMarcados ? null : perfil.unidad_id || null,
        creado_por: perfil.id,
        estado: 'borrador',
      }

      if (isEditing) {
        const { error: updErr } = await supabase
          .from('actividades_programadas')
          .update(actividadData)
          .eq('id', editingActividad.id)
        if (updErr) throw updErr
        toast.success('¡Actividad actualizada exitosamente!')
      } else {
        const { error: insErr } = await supabase
          .from('actividades_programadas')
          .insert(actividadData)
        if (insErr) throw insErr
        toast.success('¡Actividad programada exitosamente!')
      }

      // 2. Si no es Especialidad, generar documentos oficiales y despachar correos
      if (tipo !== 'Especialidad') {
        toast.info('Generando y despachando documentos oficiales...');
        const payload = {
          salidaData: {
            distrito,
            fecha_inicio: fechaInicio,
            fecha_termino: fechaFin,
            tipo_actividad: tipo,
            lugar,
            localidad,
            comuna,
            numero_dirigentes: Number(numDirigentes) || 0,
            numero_nnj: Number(numNnj) || 0,
            numero_apoderados: Number(numApoderados) || 0,
            unidades_seleccionadas: unidadesSel,
            responsable,
            telefono: telefonoResp,
            nombre_emergencia_1: emergencia1Nombre,
            fono_emergencia_1: emergencia1Fono,
            nombre_emergencia_2: emergencia2Nombre,
            fono_emergencia_2: emergencia2Fono,
            rango_edad_1: rangoEdad1,
            rango_edad_2: rangoEdad2,
            firma_responsable_b64: firmaB64,
          },
          emailDistrito: emailDistrito.trim(),
        }

        const res = await fetch('/api/salidas/notificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errData = await res.json()
          console.warn('Advertencia en el envío de correos:', errData)
          toast.warning('Actividad creada, pero hubo un detalle al despachar los correos.')
        } else {
          toast.success('¡Documentos oficiales generados y enviados por correo!')
        }
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar la actividad')
    } finally {
      setLoading(false)
    }
  }

  // Estilos UI armonizados con el tema
  const inputStyle = "w-full p-3.5 bg-clr1 dark:bg-dclr1 text-clr2 dark:text-dclr2 border-2 border-clr7 dark:border-dclr7 focus:border-clr4 dark:focus:border-dclr4 rounded-2xl font-bold text-sm outline-none transition-all shadow-inner placeholder:text-clr3/50 dark:placeholder:text-dclr3/50"
  const labelStyle = "text-[0.8em] font-black uppercase text-clr4 dark:text-dclr4 tracking-widest block ml-2 mb-1"

  return (
    <div className="fixed inset-0 bg-clr2/60 dark:bg-dclr1/80 backdrop-blur-sm z-[150] flex items-center justify-center p-3 animate-in fade-in duration-300">
      <div className="bg-clr1 dark:bg-dclr1 w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-clr7 dark:border-dclr7 overflow-y-auto max-h-[92vh]">
        
        {/* Cabecera del Wizard */}
        <div className="flex justify-between items-center border-b border-clr7 dark:border-dclr7 pb-4 mb-6">
          <div>
            <span className="text-[0.75em] font-black uppercase tracking-widest text-clr4 dark:text-dclr4 bg-clr4/10 px-3 py-1 rounded-full">
              {tipo === 'Especialidad' ? 'Especialidad' : `Paso ${step} de 4`}
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase text-clr4 dark:text-dclr4 tracking-tight mt-2">
              {isEditing ? 'Editar Actividad' : 'Programar Salida / Campamento'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-clr7 dark:bg-dclr7 text-clr2 dark:text-dclr2 flex items-center justify-center font-bold hover:brightness-110 transition-all"
            title="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Barra de Progreso (si no es Especialidad) */}
        {tipo !== 'Especialidad' && (
          <div className="w-full bg-clr7 dark:bg-dclr7 h-2 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-clr4 dark:bg-dclr4 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        <form onSubmit={handleFinalSubmit} className="space-y-6">

          {/* PASO 1: Datos Generales y Unidades */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Tipo de Actividad</label>
                  {editingActividad?.tipo === 'Especialidad' ? (
                    <div className="p-3.5 bg-clr7 dark:bg-dclr7 text-clr4 font-black rounded-2xl uppercase">
                      🎓 Especialidad
                    </div>
                  ) : (
                    <select
                      value={tipo}
                      onChange={e => setTipo(e.target.value)}
                      className={inputStyle}
                    >
                      <option value="Salida">🚶 Salida por el día</option>
                      <option value="Campamento">⛺ Campamento (más de 1 día)</option>
                      <option value="Especialidad">🎓 Especialidad</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className={labelStyle}>Nombre de la Actividad</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Salida al Parque Mahuida"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Lugar Exacto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Camping San Alfonso, Camino al Volcán 1234"
                    value={lugar}
                    onChange={e => setLugar(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                {tipo !== 'Especialidad' && (
                  <div>
                    <label className={labelStyle}>Localidad / Área Referencial</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: San Alfonso / Cajón del Maipo"
                      value={localidad}
                      onChange={e => setLocalidad(e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Fecha Término</label>
                  <input
                    type="date"
                    required
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Selector de Unidades Participantes (sólo para salidas/campamentos) */}
              {tipo !== 'Especialidad' && (
                <div className="p-4 bg-clr7/40 dark:bg-dclr7/40 rounded-2xl border border-clr7 dark:border-dclr7 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.8em] font-black uppercase text-clr4 dark:text-dclr4 tracking-widest">
                      Unidades que Participarán:
                    </span>
                    <button
                      type="button"
                      onClick={toggleTodoGrupo}
                      className="text-xs font-black uppercase px-3 py-1 bg-clr4/10 text-clr4 dark:text-dclr4 rounded-lg hover:bg-clr4 hover:text-clr1 transition-all"
                    >
                      {Object.values(unidadesSel).every(Boolean) ? 'Deseleccionar Todo' : '⚜️ Todo el Grupo'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { key: 'manada', label: '🐾 Manada' },
                      { key: 'cia', label: '🌻 Compañía' },
                      { key: 'tropa', label: '🏕️ Tropa' },
                      { key: 'avanzada', label: '🚀 Avanzada' },
                      { key: 'clan', label: '⚜️ Clan' },
                    ].map(u => (
                      <label
                        key={u.key}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-xs font-bold uppercase cursor-pointer transition-all ${
                          unidadesSel[u.key as keyof typeof unidadesSel]
                            ? 'bg-clr4/15 border-clr4 text-clr4 dark:text-dclr4'
                            : 'bg-clr1 dark:bg-dclr1 border-clr7 dark:border-dclr7 text-clr3 opacity-70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={unidadesSel[u.key as keyof typeof unidadesSel]}
                          onChange={e =>
                            setUnidadesSel({ ...unidadesSel, [u.key]: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-clr4 focus:ring-clr4"
                        />
                        <span>{u.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: Aforo y Ubicación */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Zona Scout</label>
                  <select
                    value={zona}
                    onChange={e => {
                      const nuevaZona = e.target.value
                      setZona(nuevaZona)
                      const primerDistrito = ZONAS_DISTRITOS[nuevaZona]?.[0] || ''
                      setDistrito(primerDistrito)
                    }}
                    className={inputStyle}
                  >
                    {Object.keys(ZONAS_DISTRITOS).map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelStyle}>Distrito Scout</label>
                  <select
                    value={distrito}
                    onChange={e => setDistrito(e.target.value)}
                    className={inputStyle}
                  >
                    {ZONAS_DISTRITOS[zona]?.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelStyle}>Comuna Base del Grupo</label>
                <select
                  value={comuna}
                  onChange={e => setComuna(e.target.value)}
                  className={inputStyle}
                >
                  {COMUNAS_RM.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Aforos */}
              <div className="p-4 bg-clr7/40 dark:bg-dclr7/40 rounded-2xl border border-clr7 dark:border-dclr7 space-y-3">
                <span className="text-[0.8em] font-black uppercase text-clr4 dark:text-dclr4 tracking-widest block">
                  Estimación de Asistentes:
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[0.75em] font-black uppercase text-clr3 block mb-1">Dirigentes (máx 2 dígitos)</label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="0"
                      value={numDirigentes}
                      onInput={e => {
                        const v = e.currentTarget.value.replace(/\D/g, '').slice(0, 2)
                        setNumDirigentes(v)
                      }}
                      className={`${inputStyle} text-center text-lg`}
                    />
                  </div>

                  <div>
                    <label className="text-[0.75em] font-black uppercase text-clr3 block mb-1">NNJ (máx 3 dígitos)</label>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder="0"
                      value={numNnj}
                      onInput={e => {
                        const v = e.currentTarget.value.replace(/\D/g, '').slice(0, 3)
                        setNumNnj(v)
                      }}
                      className={`${inputStyle} text-center text-lg`}
                    />
                  </div>

                  <div>
                    <label className="text-[0.75em] font-black uppercase text-clr3 block mb-1">Apoderados (máx 2 dígitos)</label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="0"
                      value={numApoderados}
                      onInput={e => {
                        const v = e.currentTarget.value.replace(/\D/g, '').slice(0, 2)
                        setNumApoderados(v)
                      }}
                      className={`${inputStyle} text-center text-lg`}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 text-xs font-bold text-clr2 dark:text-dclr2">
                  <span>Total Adultos (Dirigentes + Apoderados):</span>
                  <span className="font-black text-clr4 dark:text-dclr4 text-sm">{totalAdultos}</span>
                </div>
              </div>

              {/* Rango de Edad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Rango Edad Mínima (5 a 22)</label>
                  <input
                    type="number"
                    min={5}
                    max={22}
                    value={rangoEdad1}
                    onChange={e => setRangoEdad1(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Rango Edad Máxima (5 a 22)</label>
                  <input
                    type="number"
                    min={5}
                    max={22}
                    value={rangoEdad2}
                    onChange={e => setRangoEdad2(e.target.value)}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Contactos de Emergencia */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-clr7/40 dark:bg-dclr7/40 rounded-2xl border border-clr7 dark:border-dclr7 space-y-4">
                <span className="text-[0.8em] font-black uppercase text-clr4 dark:text-dclr4 tracking-widest block">
                  Contacto de Emergencia 1 (Obligatorio)
                </span>
                <div>
                  <label className={labelStyle}>Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Claudio Mateluna"
                    value={emergencia1Nombre}
                    onChange={e => setEmergencia1Nombre(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Teléfono (+56 9 ...)</label>
                  <input
                    type="text"
                    required
                    placeholder="+56 9 1234 5678"
                    value={emergencia1Fono}
                    onInput={e => {
                      const f = aplicarMascaraFono(e.currentTarget.value)
                      setEmergencia1Fono(f)
                    }}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="p-4 bg-clr7/40 dark:bg-dclr7/40 rounded-2xl border border-clr7 dark:border-dclr7 space-y-4">
                <span className="text-[0.8em] font-black uppercase text-clr4 dark:text-dclr4 tracking-widest block">
                  Contacto de Emergencia 2 (Opcional / Respaldo)
                </span>
                <div>
                  <label className={labelStyle}>Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej: María José Fernández"
                    value={emergencia2Nombre}
                    onChange={e => setEmergencia2Nombre(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Teléfono (+56 9 ...)</label>
                  <input
                    type="text"
                    placeholder="+56 9 8765 4321"
                    value={emergencia2Fono}
                    onInput={e => {
                      const f = aplicarMascaraFono(e.currentTarget.value)
                      setEmergencia2Fono(f)
                    }}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Responsable y Firma Digital */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Responsable de la Actividad</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={responsable}
                    onChange={e => setResponsable(e.target.value)}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Teléfono Responsable (+56 9 ...)</label>
                  <input
                    type="text"
                    required
                    placeholder="+56 9 1234 5678"
                    value={telefonoResp}
                    onInput={e => {
                      const f = aplicarMascaraFono(e.currentTarget.value)
                      setTelefonoResp(f)
                    }}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Correo Director de Distrito (Opcional)</label>
                <input
                  type="email"
                  placeholder="ejemplo@guiasyscoutsdechile.cl"
                  value={emailDistrito}
                  onChange={e => setEmailDistrito(e.target.value)}
                  className={inputStyle}
                />
                <p className="text-[0.75em] text-clr3 dark:text-dclr3 italic mt-1 ml-2">
                  Si lo ingresas, recibirá la comunicación oficial en PDF con copia a contacto@nuamana.cl
                </p>
              </div>

              {/* Canvas de Firma Digital */}
              <div className="p-4 bg-clr7/40 dark:bg-dclr7/40 rounded-2xl border border-clr7 dark:border-dclr7 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={labelStyle}>Firma Digital del Responsable</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={limpiarFirma}
                      className="text-xs font-bold uppercase px-3 py-1 bg-clr7 text-clr2 rounded-lg hover:brightness-95 transition-all"
                    >
                      Borrar
                    </button>
                    <button
                      type="button"
                      onClick={confirmarFirma}
                      className="text-xs font-black uppercase px-3 py-1 bg-clr4 text-clr1 rounded-lg hover:brightness-110 transition-all"
                    >
                      Confirmar Trazo
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-dashed border-clr4/50 p-1 flex justify-center">
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="#1b1b1b"
                    canvasProps={{
                      className: 'w-full h-36 rounded-xl cursor-crosshair touch-none',
                    }}
                  />
                </div>
                <p className="text-[0.75em] text-center text-clr3 dark:text-dclr3 italic">
                  {firmaCapturada ? '✅ Firma digital registrada y lista para estampar en los PDFs.' : 'Dibuja tu firma arriba usando el mouse o tu pantalla táctil.'}
                </p>
              </div>
            </div>
          )}

          {/* Botonera de Navegación del Wizard */}
          <div className="flex gap-3 pt-4 border-t border-clr7 dark:border-dclr7 mt-6">
            {step > 1 && tipo !== 'Especialidad' && (
              <button
                type="button"
                onClick={retrocederPaso}
                disabled={loading}
                className="py-4 px-6 bg-clr7 dark:bg-dclr7 text-clr2 dark:text-dclr2 font-bold uppercase rounded-2xl text-xs tracking-wider hover:brightness-110 transition-all"
              >
                ← Anterior
              </button>
            )}

            {step < 4 && tipo !== 'Especialidad' ? (
              <button
                type="button"
                onClick={avanzarPaso}
                className="flex-1 py-4 bg-clr7 dark:bg-dclr7 text-clr1 dark:text-dclr1 font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-display"
              >
                Siguiente Paso →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-clr7 dark:bg-dclr7 text-clr1 dark:text-dclr1 font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-xs font-display disabled:opacity-50"
              >
                {loading
                  ? '⌛ Guardando y Enviando Documentos...'
                  : isEditing
                  ? '💾 Actualizar Actividad'
                  : '🚀 Finalizar y Generar Documentos'}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-4 px-6 bg-transparent text-clr3 dark:text-dclr3 font-bold uppercase rounded-2xl text-xs hover:text-clr4 transition-all"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
