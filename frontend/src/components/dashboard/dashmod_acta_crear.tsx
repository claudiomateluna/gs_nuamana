'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModActaCrearProps {
  isOpen: boolean
  onClose: () => void
  perfil: any
  miembrosUnidad: any[]
  onSuccess: () => void
  editingActa?: any 
}

const TIPOS_ACTA = [
  'Consejo de Unidad', 
  'Reunión de Sábado', 
  'Comité de Padres', 
  'Reunión de Apoderados', 
  'Consejo de Grupo'
]

const NIVELES_CONFIDENCIALIDAD = ['Pública', 'Pública Interna', 'Restringida', 'Confidencial']
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Urgente']
const ROLES_REUNION = ['Asistente', 'Invitado', 'Tomador de Notas', 'Owner']

export default function DashModActaCrear({ isOpen, onClose, perfil, miembrosUnidad, onSuccess, editingActa }: DashModActaCrearProps) {
  const [saving, setSaving] = useState(false)
  const [participantes, setParticipantes] = useState<any[]>([])
  const [allMiembros, setAllMiembros] = useState<any[]>([]) 

  const getTiposDisponibles = () => {
    const rol = perfil?.rol_id || 0
    if ([1, 2, 3].includes(rol)) return TIPOS_ACTA
    if ([9, 10, 11, 12, 13].includes(rol)) return ['Consejo de Unidad']
    if ([4, 5, 6, 7].includes(rol)) return ['Comité de Padres', 'Reunión de Apoderados', 'Consejo de Grupo']
    return []
  }

  const tiposDisponibles = getTiposDisponibles()
  
  const [actaData, setActaData] = useState<any>({
    tipo: '',
    fecha: new Date().toISOString().split('T')[0],
    resumen: '',
    confidencialidad: 'Pública Interna',
    proxima_reunion: '',
    observaciones_finales: '',
    asistencia: {}, 
    roles_participantes: {}, 
    temas: [{ titulo: '', descripcion: '', conclusiones: '', duracion_estimada: 15, duracion_real: 15 }],
    acuerdos: []
  })

  // 1. Cargar perfiles globales
  useEffect(() => {
    if (!isOpen) return
    const loadGlobal = async () => {
      const { data } = await supabase.from('perfiles').select('id, nombres, apellidos').filter('rol_id', 'not.in', '(9,10,11,12,13)').order('nombres')
      setAllMiembros(data || [])
    }
    loadGlobal()
  }, [isOpen])

  // 2. Cargar datos iniciales (Solo al abrir)
  useEffect(() => {
    if (!isOpen || !perfil) return
    
    const loadData = async () => {
      if (editingActa) {
        // --- MODO EDICIÓN ---
        const [p, t, a] = await Promise.all([
          supabase.from('acta_participantes').select('*, perfiles(*)').eq('acta_id', editingActa.id),
          supabase.from('acta_temas').select('*').eq('acta_id', editingActa.id).order('orden'),
          supabase.from('acta_acuerdos').select('*').eq('acta_id', editingActa.id)
        ])

        const asisMap: any = {}
        const rolesMap: any = {}
        const listP: any[] = []

        p.data?.forEach(part => {
          asisMap[part.perfil_id] = part.asistencia
          rolesMap[part.perfil_id] = part.rol_en_reunion
          if (part.perfiles) listP.push(part.perfiles)
        })

        // Deduplicar lista por si la base de datos tenía duplicados
        const uniqueP = Array.from(new Map(listP.map(m => [m.id, m])).values())

        setParticipantes(uniqueP)
        setActaData({
          tipo: editingActa.tipo,
          fecha: editingActa.fecha,
          resumen: editingActa.resumen || '',
          confidencialidad: editingActa.confidencialidad,
          proxima_reunion: editingActa.proxima_reunion || '',
          observaciones_finales: editingActa.observaciones_finales || '',
          asistencia: asisMap,
          roles_participantes: rolesMap,
          temas: t.data?.length ? t.data : [{ titulo: '', descripcion: '', conclusiones: '', duracion_estimada: 15, duracion_real: 15 }],
          acuerdos: a.data || []
        })
      } else {
        // --- MODO NUEVA ACTA ---
        const defaultType = tiposDisponibles[0] || 'Consejo de Unidad'
        setActaData((prev: any) => ({
          ...prev,
          tipo: defaultType,
          fecha: new Date().toISOString().split('T')[0],
          resumen: '',
          proxima_reunion: '',
          observaciones_finales: '',
          temas: [{ titulo: '', descripcion: '', conclusiones: '', duracion_estimada: 15, duracion_real: 15 }],
          acuerdos: []
        }))
        // Forzamos la carga manual inmediata para el tipo por defecto
        await updateParticipantsByType(defaultType)
      }
    }
    loadData()
  }, [isOpen, editingActa?.id])

  // Función núcleo de carga de participantes
  const updateParticipantsByType = async (tipo: string) => {
    if (!perfil) return
    let p: any[] = []
    const { data: admins } = await supabase.from('perfiles').select('*, roles(name)').eq('rol_id', 1)
    const listAdmins = admins || []

    if (tipo === 'Consejo de Unidad') {
      if (!perfil.unidad_id) {
        p = []
      } else {
        const { data } = await supabase.from('perfiles').select('*, roles(name)').eq('unidad_id', perfil.unidad_id)
        p = data || []
      }
    } else if (tipo === 'Reunión de Sábado') {
      const { data } = await supabase.from('perfiles').select('*, roles(name)').in('rol_id', [1, 2, 3])
      p = data || []
    } else if (tipo === 'Comité de Padres') {
      const { data } = await supabase.from('perfiles').select('*, roles(name)').in('rol_id', [4, 5, 6, 7])
      p = data || []
    } else if (tipo === 'Reunión de Apoderados') {
      const { data } = await supabase.from('perfiles').select('*, roles(name)').in('rol_id', [4, 5, 6, 7, 8])
      p = data || []
    } else if (tipo === 'Consejo de Grupo') {
      const { data } = await supabase.from('perfiles').select('*, roles(name)').in('rol_id', [2, 3, 4, 5, 6, 7])
      p = data || []
    }

    const up = Array.from(new Map([...p, ...listAdmins].map(m => [m.id, m])).values())
    setParticipantes(up)
    const asis: any = {}; const rolesP: any = {};
    up.forEach(m => { asis[m.id] = 'Ausente'; rolesP[m.id] = 'Asistente'; })
    setActaData((prev: any) => ({ ...prev, asistencia: asis, roles_participantes: rolesP }))
  }

  // Manejar cambios de TIPO manuales (Solo creación)
  useEffect(() => {
    if (!isOpen || editingActa || !perfil || !actaData.tipo) return
    updateParticipantsByType(actaData.tipo)
  }, [actaData.tipo])

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const algunPresente = Object.values(actaData.asistencia).some(v => v === 'Presente' || v === 'Remoto')
    const estadoActa = algunPresente ? 'Aprobada' : 'Borrador'

    setSaving(true)

    if (typeof window !== 'undefined' && !navigator.onLine) {
      if (editingActa) {
        alert('La edición offline de actas no está soportada todavía. Por favor, edita cuando tengas conexión.')
        setSaving(false)
        return
      }

      const actaPayload = {
        tipo: actaData.tipo,
        fecha: actaData.fecha,
        resumen: actaData.resumen,
        confidencialidad: actaData.confidencialidad,
        unidad_id: actaData.tipo === 'Consejo de Unidad' ? perfil.unidad_id : null,
        proxima_reunion: actaData.proxima_reunion || null,
        observaciones_finales: actaData.observaciones_finales,
        estado: estadoActa,
        ingresado_por: perfil.id
      }

      const temasPayload = actaData.temas
        .filter((t: any) => (t.titulo && t.titulo.trim() !== '') || (t.descripcion && t.descripcion.trim() !== '') || (t.conclusiones && t.conclusiones.trim() !== ''))
        .map((t: any) => ({
          titulo: t.titulo?.trim() || 'Sin título',
          descripcion: t.descripcion || '',
          conclusiones: t.conclusiones || '',
          duracion_estimada: parseInt(t.duracion_estimada) || 0,
          duracion_real: parseInt(t.duracion_real) || 0
        }))

      const partPayload = participantes.map(m => ({
        perfil_id: m.id,
        rol_en_reunion: actaData.roles_participantes[m.id] || 'Asistente',
        asistencia: actaData.asistencia[m.id] || 'Ausente'
      }))

      const acPayload = actaData.acuerdos
        .filter((a: any) => a.titulo && a.titulo.trim() !== '')
        .map((a: any) => ({
          titulo: a.titulo.trim(),
          descripcion: a.descripcion || '',
          responsable_id: (a.responsable_id && a.responsable_id !== '') ? a.responsable_id : null,
          fecha_compromiso: (a.fecha_compromiso && a.fecha_compromiso !== '') ? a.fecha_compromiso : null,
          prioridad: a.prioridad || 'Media',
          estado: a.estado || 'Abierta',
          es_actividad_grupal: !!a.es_actividad_grupal
        }))

      try {
        const { outboxService } = await import('@/lib/outbox-service')
        await outboxService.enqueue('actas_completo', 'INSERT', {
          payload: actaPayload,
          temas: temasPayload,
          participantes: partPayload,
          acuerdos: acPayload
        })
        alert('Sin conexión: El acta se guardó en la cola local de pendientes y se sincronizará automáticamente al recuperar internet.')
        onSuccess()
        onClose()
      } catch (err: any) {
        alert('Error al encolar acta offline: ' + err.message)
      } finally {
        setSaving(false)
      }
      return
    }
    
    try {
      let currentActaId = editingActa?.id
      // 1. Guardar Acta
      const payload = {
        tipo: actaData.tipo,
        fecha: actaData.fecha,
        resumen: actaData.resumen,
        confidencialidad: actaData.confidencialidad,
        unidad_id: actaData.tipo === 'Consejo de Unidad' ? perfil.unidad_id : null,
        proxima_reunion: actaData.proxima_reunion || null,
        observaciones_finales: actaData.observaciones_finales,
        estado: estadoActa
      }

      if (!currentActaId) {
        const codigo = `ACT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        const { data: acta, error } = await supabase.from('actas').insert({ ...payload, codigo, ingresado_por: perfil.id }).select().single()
        if (error) throw error
        currentActaId = acta.id
      } else {
        const { error } = await supabase.from('actas').update(payload).eq('id', currentActaId)
        if (error) throw error
      }

      // 2. Temas
      const temasParaGuardar = actaData.temas
        .filter((t: any) => (t.titulo && t.titulo.trim() !== '') || (t.descripcion && t.descripcion.trim() !== '') || (t.conclusiones && t.conclusiones.trim() !== ''))
        .map((t: any, i: number) => ({
          acta_id: currentActaId,
          titulo: t.titulo?.trim() || 'Sin título',
          descripcion: t.descripcion || '',
          conclusiones: t.conclusiones || '',
          duracion_estimada: parseInt(t.duracion_estimada) || 0,
          duracion_real: parseInt(t.duracion_real) || 0,
          orden: i
        }))

      await supabase.from('acta_temas').delete().eq('acta_id', currentActaId)
      if (temasParaGuardar.length > 0) {
        const { error: teErr } = await supabase.from('acta_temas').insert(temasParaGuardar)
        if (teErr) throw new Error('Temas: ' + teErr.message)
      }

      // 3. Participantes
      await supabase.from('acta_participantes').delete().eq('acta_id', currentActaId)
      const pToIns = participantes.map(m => ({
        acta_id: currentActaId, perfil_id: m.id,
        rol_en_reunion: actaData.roles_participantes[m.id] || 'Asistente',
        asistencia: actaData.asistencia[m.id] || 'Ausente'
      }))
      const { error: pErr } = await supabase.from('acta_participantes').insert(pToIns)
      if (pErr) throw new Error('Asistencia: ' + pErr.message)

      // 4. Firmas
      const { data: oldF } = await supabase.from('acta_firmas').select('*').eq('acta_id', currentActaId)
      const signed = new Map(oldF?.filter(f => f.firmado).map(f => [f.perfil_id, f.fecha_firma]) || [])
      await supabase.from('acta_firmas').delete().eq('acta_id', currentActaId)
      
      const invitadosObligatorios = participantes.filter(m => actaData.asistencia[m.id] !== 'No Invitado')
      if (invitadosObligatorios.length > 0) {
        const fToIns = invitadosObligatorios.map(m => ({
          acta_id: currentActaId, perfil_id: m.id,
          firmado: signed.has(m.id),
          fecha_firma: signed.get(m.id) || null
        }))
        const { error: fErr } = await supabase.from('acta_firmas').insert(fToIns)
        if (fErr) throw new Error('Firmas: ' + fErr.message)
      }

      // 5. Acuerdos
      console.log('Iniciando guardado de acuerdos. Acta ID:', currentActaId)
      
      const acToIns = actaData.acuerdos
        .filter((a: any) => a.titulo && a.titulo.trim() !== '')
        .map((a: any) => ({
          acta_id: currentActaId, 
          titulo: a.titulo.trim(), 
          descripcion: a.descripcion || '',
          responsable_id: (a.responsable_id && a.responsable_id !== '') ? a.responsable_id : null,
          fecha_compromiso: (a.fecha_compromiso && a.fecha_compromiso !== '') ? a.fecha_compromiso : null,
          prioridad: a.prioridad || 'Media', 
          estado: a.estado || 'Abierta',
          es_actividad_grupal: !!a.es_actividad_grupal
        }))
      
      if (acToIns.length > 0) {
        // Borrar anteriores
        await supabase.from('acta_acuerdos').delete().eq('acta_id', currentActaId)
        
        const { data: insData, error: acErr } = await supabase.from('acta_acuerdos').insert(acToIns).select()
        if (acErr) throw new Error('Error en Acuerdos: ' + acErr.message)
        
        console.log('Acuerdos guardados OK:', insData)
        alert(`ÉXITO: Se guardaron ${insData?.length} acuerdos para esta sesión.`)
      } else {
        console.log('No hay acuerdos válidos para guardar. Lista original:', actaData.acuerdos)
        alert('AVISO: No se detectaron acuerdos con título. La lista de compromisos quedará vacía.')
      }

      // 6. Enviar Notificaciones a los asistentes
      if (invitadosObligatorios.length > 0) {
        let msg = ''
        if (!editingActa) {
          msg = `Se ha creado el acta (${actaData.tipo}) del ${actaData.fecha}. Revisa y firma en el panel.`
        } else {
          const changedFields: string[] = []
          if (editingActa.tipo !== actaData.tipo) changedFields.push('Tipo')
          if (editingActa.fecha !== actaData.fecha) changedFields.push('Fecha')
          if (editingActa.resumen !== actaData.resumen) changedFields.push('Resumen')
          if (editingActa.confidencialidad !== actaData.confidencialidad) changedFields.push('Confidencialidad')
          if (editingActa.observaciones_finales !== actaData.observaciones_finales) changedFields.push('Observaciones finales')
          const changesText = changedFields.length > 0 ? changedFields.join(', ') : 'Detalles'
          msg = `Se ha editado el acta ${editingActa.codigo} (${actaData.tipo}) del ${actaData.fecha}. Cambios realizados en: ${changesText}.`
        }

        const notifs = invitadosObligatorios.map(m => ({
          perfil_id: m.id,
          mensaje: msg,
          tipo: 'sistema',
          link_url: '/dashboard'
        }))

        await supabase.from('notificaciones').insert(notifs)
      }

      alert('¡Todo listo! El acta y sus componentes se guardaron correctamente.')
      onSuccess(); onClose();
    } catch (err: any) {
      const isNetworkError = err.message?.includes('fetch') || err.message?.includes('Network') || err.status === 0;
      if (isNetworkError && !editingActa) {
        console.warn("Fallo el guardado online del acta por error de red. Encolando en outbox...", err)
        try {
          const actaPayload = {
            tipo: actaData.tipo,
            fecha: actaData.fecha,
            resumen: actaData.resumen,
            confidencialidad: actaData.confidencialidad,
            unidad_id: actaData.tipo === 'Consejo de Unidad' ? perfil.unidad_id : null,
            proxima_reunion: actaData.proxima_reunion || null,
            observaciones_finales: actaData.observaciones_finales,
            estado: estadoActa,
            ingresado_por: perfil.id
          }

          const temasPayload = actaData.temas
            .filter((t: any) => (t.titulo && t.titulo.trim() !== '') || (t.descripcion && t.descripcion.trim() !== '') || (t.conclusiones && t.conclusiones.trim() !== ''))
            .map((t: any) => ({
              titulo: t.titulo?.trim() || 'Sin título',
              descripcion: t.descripcion || '',
              conclusiones: t.conclusiones || '',
              duracion_estimada: parseInt(t.duracion_estimada) || 0,
              duracion_real: parseInt(t.duracion_real) || 0
            }))

          const partPayload = participantes.map(m => ({
            perfil_id: m.id,
            rol_en_reunion: actaData.roles_participantes[m.id] || 'Asistente',
            asistencia: actaData.asistencia[m.id] || 'Ausente'
          }))

          const acPayload = actaData.acuerdos
            .filter((a: any) => a.titulo && a.titulo.trim() !== '')
            .map((a: any) => ({
              titulo: a.titulo.trim(),
              descripcion: a.descripcion || '',
              responsable_id: (a.responsable_id && a.responsable_id !== '') ? a.responsable_id : null,
              fecha_compromiso: (a.fecha_compromiso && a.fecha_compromiso !== '') ? a.fecha_compromiso : null,
              prioridad: a.prioridad || 'Media',
              estado: a.estado || 'Abierta',
              es_actividad_grupal: !!a.es_actividad_grupal
            }))

          const { outboxService } = await import('@/lib/outbox-service')
          await outboxService.enqueue('actas_completo', 'INSERT', {
            payload: actaPayload,
            temas: temasPayload,
            participantes: partPayload,
            acuerdos: acPayload
          })
          alert('Error de conexión: El acta se guardó localmente en la cola de pendientes y se sincronizará automáticamente al recuperar internet.')
          onSuccess(); onClose();
          return
        } catch (e: any) {
          alert('FALLO CRÍTICO: ' + e.message)
        }
      } else {
        alert('FALLO CRÍTICO: ' + err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-2 animate-in fade-in duration-300 text-[1em]">
      <div className="bg-white dark:bg-clr5 w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg rounded-l-[1rem] p-4 shadow-2xl overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-3xl font-bold font-display uppercase text-clr6 tracking-tighter">
            {editingActa ? `Editando: ${editingActa.codigo}` : 'Nueva Acta de Sesión'}
          </h2>
          <button onClick={onClose} className="text-2xl opacity-40 hover:opacity-100 hover:text-clr7 font-bold">✕</button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-bold uppercase text-[1em] opacity-40 border-b pb-2 tracking-widest font-slab">Encabezado</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[0.8em] uppercase font-bold opacity-60">Tipo</label>
                  <select value={actaData.tipo} onChange={e => setActaData({...actaData, tipo: e.target.value})} className="w-full p-2 rounded-[0.6em] border dark:border-clr4 bg-zinc-50 dark:bg-clr3 uppercase text-[1em] font-bold">
                    {tiposDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[0.8em] uppercase font-bold opacity-60">Fecha</label>
                  <input type="date" value={actaData.fecha} onChange={e => setActaData({...actaData, fecha: e.target.value})} className="w-full p-2 rounded-[0.6em] border dark:border-clr4 bg-zinc-50 dark:bg-clr3 text-[1em] font-bold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[0.8em] uppercase font-bold opacity-60">Confidencialidad</label>
                <select value={actaData.confidencialidad} onChange={e => setActaData({...actaData, confidencialidad: e.target.value})} className="w-full p-2 rounded-[0.6em] border dark:border-clr4 bg-zinc-50 dark:bg-clr3 text-[1em] uppercase font-bold">
                  {NIVELES_CONFIDENCIALIDAD.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[0.8em] uppercase font-bold opacity-60">Resumen (Agenda General)</label>
                <textarea placeholder="Propósito de la sesión..." value={actaData.resumen} onChange={e => setActaData({...actaData, resumen: e.target.value})} className="w-full p-2 rounded-[0.6em] border dark:border-clr4 bg-zinc-50 dark:bg-clr3 h-24 text-[1em] font-bold" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold uppercase text-[1em] opacity-40 tracking-widest font-slab">Asistentes</h3>
                <div className="relative">
                  <select 
                    onChange={(e) => {
                      const selected = allMiembros.find(m => m.id === e.target.value)
                      if (selected) {
                        if (participantes.some(p => p.id === selected.id)) {
                          alert('Esta persona ya está en la lista.')
                        } else {
                          setParticipantes([...participantes, selected])
                          setActaData((prev: any) => ({
                            ...prev,
                            asistencia: { ...prev.asistencia, [selected.id]: 'Ausente' },
                            roles_participantes: { ...prev.roles_participantes, [selected.id]: 'Asistente' }
                          }))
                        }
                      }
                      e.target.value = ''
                    }}
                    className="p-2 bg-clr6 text-white rounded-xl text-[0.8em] font-bold uppercase cursor-pointer hover:brightness-110 shadow-md outline-none"
                  >
                    <option value="">➕ INVITAR PERSONA</option>
                    {allMiembros
                      .filter(m => !participantes.some(p => p.id === m.id))
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.nombres} {m.apellidos}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2">
                {participantes.map(m => (
                  <div key={m.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-zinc-50 dark:bg-clr3 rounded-[0.6em] border border-transparent hover:border-clr6/20 relative group">
                    <button 
                      type="button" 
                      onClick={() => setParticipantes(participantes.filter(p => p.id !== m.id))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[0.8em] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      ✕
                    </button>
                    <span className="truncate text-[1em] self-center font-bold">{m.nombres} {m.apellidos}</span>
                    <select value={actaData.roles_participantes[m.id] || 'Asistente'} onChange={e => setActaData({...actaData, roles_participantes: {...actaData.roles_participantes, [m.id]: e.target.value}})} className="text-[0.8em] rounded-[0.6em] px-2 py-1 bg-zinc-50 dark:bg-clr3 border dark:border-clr4 font-bold">
                      {ROLES_REUNION.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <select value={actaData.asistencia[m.id] || 'Ausente'} onChange={e => setActaData({...actaData, asistencia: {...actaData.asistencia, [m.id]: e.target.value}})} className={`text-[0.8em] font-bold rounded-[0.6em] px-2 py-1 border-none uppercase ${
                      actaData.asistencia[m.id] === 'Presente' ? 'bg-green-100 text-green-700' : 
                      actaData.asistencia[m.id] === 'No Invitado' ? 'bg-zinc-200 text-zinc-500' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <option value="Ausente">Ausente</option>
                      <option value="Presente">Presente</option>
                      <option value="Remoto">Remoto</option>
                      <option value="Justificado">Justificado</option>
                      <option value="No Invitado">No Invitado</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold uppercase text-[1em] opacity-40 border-b pb-2 tracking-widest font-slab">Agenda y Desarrollo</h3>
            <div className="space-y-3">
              {actaData.temas.map((t: any, i: number) => (
                <div key={i} className="p-2 bg-zinc-50 dark:bg-clr3 rounded-[1rem] border dark:border-clr4 shadow-sm relative group">
                  <button type="button" onClick={() => setActaData((v: any) => ({ ...v, temas: v.temas.filter((_:any,idx:number)=>idx!==i)}))} className="absolute top-3 right-2 text-red-500 font-bold opacity-60 hover:opacity-100">✕</button>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="md:col-span-3 space-y-2">
                      <input placeholder="TÍTULO DEL TEMA" value={t.titulo} onChange={e => { const nt = [...actaData.temas]; nt[i].titulo = e.target.value; setActaData({...actaData, temas: nt}); }} className="w-full bg-transparent border-b-2 border-zinc-400 font-bold text-[1.1em] pb-1 uppercase outline-none" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <textarea placeholder="Descripción / Agenda..." value={t.descripcion} onChange={e => { const nt = [...actaData.temas]; nt[i].descripcion = e.target.value; setActaData({...actaData, temas: nt}); }} className="w-full p-3 rounded-[0.5em] border dark:border-clr4 bg-clr1 dark:bg-clr3 h-24 text-[1em] font-bold" />
                        <textarea placeholder="Conclusiones / Decisiones..." value={t.conclusiones} onChange={e => { const nt = [...actaData.temas]; nt[i].conclusiones = e.target.value; setActaData({...actaData, temas: nt}); }} className="w-full p-3 rounded-[0.5em] border dark:border-clr4 bg-clr6/5 h-24 text-[1em] font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-white dark:bg-clr3 rounded-[0.5em] border dark:border-clr4">
                        <label className="text-[0.8em] uppercase opacity-60 font-bold">Duración Est.</label>
                        <input type="number" value={t.duracion_estimada} onChange={e => { const nt = [...actaData.temas]; nt[i].duracion_estimada = parseInt(e.target.value) || 0; setActaData({...actaData, temas: nt}); }} className="w-full bg-transparent dark:bg-clr3 font-bold" />
                      </div>
                      <div className="p-2 bg-white dark:bg-clr3 rounded-[0.5em] border dark:border-clr4">
                        <label className="text-[0.8em] uppercase opacity-60 font-bold">Duración Real</label>
                        <input type="number" value={t.duracion_real} onChange={e => { const nt = [...actaData.temas]; nt[i].duracion_real = parseInt(e.target.value) || 0; setActaData({...actaData, temas: nt}); }} className="w-full bg-transparent dark:bg-clr3 font-bold" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setActaData((v: any) => ({ ...v, temas: [...v.temas, { titulo: '', descripcion: '', conclusiones: '', duracion_estimada: 15, duracion_real: 15 }] }))} className="w-full py-3 border-2 border-dashed border-clr6/50 text-clr6 rounded-[1rem] font-bold uppercase text-[1em] hover:bg-clr6/5">+ Añadir Punto de Tabla</button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold uppercase text-[1em] opacity-40 border-b pb-2 tracking-widest font-slab text-blue-600 dark:text-blue-300">Acuerdos y Tareas</h3>
            <div className="space-y-4">
              {actaData.acuerdos.map((a: any, i: number) => (
                <div key={i} className="p-3 bg-blue-50/20 dark:bg-clr3/60 rounded-[1rem] border border-blue-100 dark:border-clr4 relative group grid grid-cols-1 md:grid-cols-4 gap-2">
                  <button type="button" onClick={() => setActaData((v: any) => ({ ...v, acuerdos: v.acuerdos.filter((_:any,idx:number)=>idx!==i)}))} className="absolute top-4 right-6 text-red-500 dark:text-clr7 font-bold opacity-40 dark:opacity-80 hover:opacity-100 font-display">✕</button>
                  <div className="md:col-span-2 space-y-3 font-bold">
                    <input placeholder="¿QUÉ SE HARÁ?" value={a.titulo} onChange={e => { const na = [...actaData.acuerdos]; na[i].titulo = e.target.value; setActaData({...actaData, acuerdos: na}); }} className="w-full bg-transparent border-b border-blue-200 font-bold text-[1em] pb-1 uppercase outline-none" />
                    <textarea placeholder="Detalles de la tarea..." value={a.descripcion} onChange={e => { const na = [...actaData.acuerdos]; na[i].descripcion = e.target.value; setActaData({...actaData, acuerdos: na}); }} className="w-full p-2 rounded-lg border dark:border-clr4 bg-white dark:bg-clr3 text-[1em] font-bold h-16" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[0.8em] uppercase opacity-40 font-bold">Responsable</label>
                      <select value={a.responsable_id || ''} onChange={e => { const na = [...actaData.acuerdos]; na[i].responsable_id = e.target.value; setActaData({...actaData, acuerdos: na}); }} className="w-full p-2 rounded-[0.5em] dark:border-clr4 bg-white dark:bg-clr3 border text-[0.8em] uppercase font-bold">
                        <option value="">Seleccionar...</option>
                        {allMiembros.map(m => (<option key={m.id} value={m.id}>{m.nombres} {m.apellidos}</option>))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-[0.8em] uppercase opacity-40 font-bold">Plazo</label><input type="date" value={a.fecha_compromiso} onChange={e => { const na = [...actaData.acuerdos]; na[i].fecha_compromiso = e.target.value; setActaData({...actaData, acuerdos: na}); }} className="w-full p-2 dark:bg-clr3 rounded-[0.5em] border dark:border-clr4 text-[0.8em] font-bold" /></div>
                      <div><label className="text-[0.8em] uppercase font-bold">Prioridad</label><select value={a.prioridad} onChange={e => { const na = [...actaData.acuerdos]; na[i].prioridad = e.target.value; setActaData({...actaData, acuerdos: na}); }} className="w-full p-2 dark:bg-clr3 rounded-[0.5em] border dark:border-clr4 text-[0.8em] uppercase font-bold">{PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="checkbox" 
                        id={`grupal-${i}`}
                        checked={!!a.es_actividad_grupal} 
                        onChange={e => { const na = [...actaData.acuerdos]; na[i].es_actividad_grupal = e.target.checked; setActaData({...actaData, acuerdos: na}); }} 
                        className="w-4 h-4 rounded border-gray-300 text-clr7 focus:ring-clr7"
                      />
                      <label htmlFor={`grupal-${i}`} className="text-[0.8em] font-black uppercase text-red-600 dark:text-red-400 cursor-pointer">
                        ¿Actividad Grupal? 👥
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setActaData((v: any) => ({ ...v, acuerdos: [...v.acuerdos, { titulo: '', descripcion: '', responsable_id: '', fecha_compromiso: '', prioridad: 'Media' }] }))} className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 dark:text-blue-400 rounded-[1rem] font-bold uppercase text-[1em] hover:bg-blue-50">+ Añadir Compromiso</button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold uppercase text-[0.8em] opacity-40 border-b pb-2 tracking-widest font-slab">Cierre de Sesión</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <label className="text-[0.8em] uppercase font-bold opacity-60">Próxima Reunión</label>
                <input type="date" value={actaData.proxima_reunion} onChange={e => setActaData({...actaData, proxima_reunion: e.target.value})} className="w-full p-3 rounded-xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 font-bold" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[0.8em] uppercase font-bold opacity-60">Observaciones Finales</label>
                <textarea placeholder="Comentarios de cierre..." value={actaData.observaciones_finales} onChange={e => setActaData({...actaData, observaciones_finales: e.target.value})} className="w-full p-2 rounded-xl border dark:border-clr4 bg-zinc-50 dark:bg-clr3 h-24 text-[1em] font-bold" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-8 border-t">
            <button type="submit" disabled={saving} className="flex-1 py-4 bg-clr6 text-white uppercase rounded-2xl shadow-xl font-inika font-bold tracking-widest text-[1em] hover:brightness-110">
              {saving ? '⌛ PROCESANDO...' : editingActa ? '💾 ACTUALIZAR LIBRO' : '💾 GUARDAR ACTA'}
            </button>
            <button type="button" onClick={onClose} className="px-10 py-4 bg-zinc-100 dark:bg-clr7/80 rounded-[1em] font-bold uppercase tracking-widest text-[1em]">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
  )
}
