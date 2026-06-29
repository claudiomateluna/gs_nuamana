'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface DashModPerfilProps {
  isOpen: boolean
  onClose: () => void
  editingPupilo: any
  perfil: any
  editData: any
  setEditData: (data: any) => void
  editContactos: any[]
  setEditContactos: (contacts: any[]) => void
  roles: any[]
  unidades: any[]
  onSuccess: () => void
}

const COMUNAS = ['Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Padre Hurtado', 'Pedro Aguirre Cerda', 'Peñaflor', 'Peñalolén', 'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 'San José de Maipo', 'San Miguel', 'San Ramón', 'Santiago', 'Vitacura']
const RELIGIONES = ['no-conocido', 'no-especifica', 'no-tiene', 'agnostico', 'catolico', 'evangelico', 'protestante', 'bautista', 'ultimos-dias', 'testigo-jehova', 'budista', 'cristiana', 'luterana', 'creyente', 'anglicana', 'adventista', 'metodista', 'ortodoxo', 'are-krishna', 'musulman', 'bahai', 'rastafari', 'deista', 'hinduista', 'sijes', 'taoista', 'sintoista', 'jainista', 'confusiano', 'zoroastriano', 'sunita', 'chiita', 'vedista', 'brahmanista', 'wicca', 'druida', 'asatru', 'judio', 'otra']
const TIPOS_SANGRE = ['No Aplica', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-', 'No Sabe']
const DIETAS = ['No Aplica', 'Menú general', 'Menú vegetariano', 'Menú vegano', 'Menú celíaco', 'Intolerante a la lactosa']
const PARENTESCOS = ['No Aplica', 'Madre', 'Padre', 'Hermana (o)', 'Tía (o)', 'Abuela (o)', 'Sobrina (o)', 'Hija (o)', 'Otra']

export default function DashModPerfil({ 
  isOpen, onClose, editingPupilo, perfil, editData, setEditData, 
  editContactos, setEditContactos, roles, unidades, onSuccess 
}: DashModPerfilProps) {
  const [saving, setSaving] = useState(false)
  const [adultos, setAdultos] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const formatInitialDate = (isoDate: string) => {
    if (!isoDate) return ''
    const datePart = isoDate.split('T')[0]
    const parts = datePart.split('-')
    if (parts.length !== 3) return isoDate
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 8) val = val.substring(0, 8)
    
    let formatted = val
    if (val.length > 2) {
      formatted = val.substring(0, 2) + '/' + val.substring(2)
    }
    if (val.length > 4) {
      formatted = formatted.substring(0, 5) + '/' + formatted.substring(5)
    }
    
    setEditData((prev: any) => ({ ...prev, fecha_nacimiento_display: formatted }))
  }

  // Cargar lista de adultos potenciales para ser apoderados
  useEffect(() => {
    if (isOpen) {
      const fetchAdultos = async () => {
        const { data } = await supabase
          .from('perfiles')
          .select('id, nombres, apellidos, rut')
          .in('rol_id', [2, 3, 4, 5, 6, 7, 8])
          .order('nombres')
        setAdultos(data || [])
      }
      fetchAdultos()
    }
  }, [isOpen])

  // Filtrar adultos según el término de búsqueda
  const adultosFiltrados = adultos.filter(a => {
    const full = `${a.nombres} ${a.apellidos} ${a.rut}`.toLowerCase()
    return full.includes(searchTerm.toLowerCase())
  })

  const apoderadoSeleccionado = adultos.find(a => a.id === editData.apoderado_id)

  const handleSelectApoderado = (a: any) => {
    setEditData({...editData, apoderado_id: a.id})
    setSearchTerm(`${a.nombres} ${a.apellidos}`)
    setShowDropdown(false)
  }

  // Inicializar el término de búsqueda con el apoderado actual
  useEffect(() => {
    if (isOpen && editData.apoderado_id && adultos.length > 0) {
      const found = adultos.find(a => a.id === editData.apoderado_id)
      if (found) setSearchTerm(`${found.nombres} ${found.apellidos}`)
    }
  }, [isOpen, editData.apoderado_id, adultos])

  // Effect to initialize display date when profile is loaded or modal opens
  useEffect(() => {
    if (isOpen && editData?.fecha_nacimiento && !editData?.fecha_nacimiento_display) {
      setEditData((prev: any) => ({ 
        ...prev, 
        fecha_nacimiento_display: formatInitialDate(prev.fecha_nacimiento) 
      }))
    }
  }, [isOpen, editData?.fecha_nacimiento])

  if (!isOpen) return null

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const targetId = editingPupilo ? editingPupilo.id : perfil.id
    
    // Convert display date back to ISO for DB
    let isoDate = editData.fecha_nacimiento
    if (editData.fecha_nacimiento_display && editData.fecha_nacimiento_display.length === 10) {
      const parts = editData.fecha_nacimiento_display.split('/')
      if (parts.length === 3) {
        isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }

    try {
      const { data, error } = await supabase.from('perfiles').update({
        nombres: editData.nombres,
        apellidos: editData.apellidos,
        email: editData.email,
        fecha_nacimiento: isoDate,
        rol_id: editData.rol_id,
        unidad_id: editData.unidad_id,
        estado: editData.estado,
        apoderado_id: editData.apoderado_id, // Añadido vínculo formal
        telefono: editData.telefono ? editData.telefono.replace(/[`']/g, '').trim() : null,
        direccion: editData.direccion,
        comuna: editData.comuna,
        religion: editData.religion,
        sexo: editData.sexo,
        colegio: editData.colegio,
        nivel_educacional: editData.nivel_educacional,
        sistema_salud: editData.sistema_salud,
        detalle_sistema_salud: editData.detalle_sistema_salud,
        tipo_sangre: editData.tipo_sangre,
        alergias: editData.alergias,
        antecedentes_medicos: editData.antecedentes_medicos,
        tratamientos_medicos: editData.tratamientos_medicos,
        medicamentos: editData.medicamentos,
        autoriza_fotos: editData.autoriza_fotos,
        fe_publica: editData.fe_publica,
        dieta_alimentaria: Array.isArray(editData.dieta_alimentaria) ? editData.dieta_alimentaria : [],
        nombre_apoderado_contacto: editData.nombre_apoderado_contacto,
        relacion_apoderado_contacto: editData.relacion_apoderado_contacto,
        telefono_apoderado_contacto: editData.telefono_apoderado_contacto ? editData.telefono_apoderado_contacto.replace(/[`']/g, '').trim() : null
      }).eq('id', targetId).select()

      if (error) throw error
      
      // Si data está vacío, es porque el RLS bloqueó la actualización de esa fila específica
      if (!data || data.length === 0) {
        throw new Error('No tienes permisos suficientes para modificar este perfil o no pertenece a tu unidad.')
      }

      // 2. Actualizar contactos de emergencia (Borrar y re-insertar)
      const { error: delError } = await supabase.from('contactos_emergencia').delete().eq('perfil_id', targetId)
      if (delError) throw new Error('Error al limpiar contactos: ' + delError.message)

      const validContacts = editContactos.filter(c => c.nombre && c.telefono)
      if (validContacts.length > 0) {
        const { error: contactsError } = await supabase.from('contactos_emergencia').insert(
          validContacts.map(c => ({ 
            perfil_id: targetId,
            nombre: c.nombre,
            relacion: c.relacion,
            telefono: c.telefono ? c.telefono.replace(/[`']/g, '').trim() : null
          }))
        )
        if (contactsError) throw contactsError
      }

      alert('¡Ficha actualizada correctamente!')
      onSuccess()
      onClose()
    } catch (err: any) { 
      console.error('Error detallado al guardar perfil:', JSON.stringify(err, null, 2))
      alert('Error al guardar: ' + (err.message || 'Error desconocido del servidor')) 
    } finally { 
      setSaving(false) 
    }
  }

  const toggleDieta = (dieta: string) => {
    let current = Array.isArray(editData.dieta_alimentaria) ? [...editData.dieta_alimentaria] : []
    current = current.includes(dieta) ? current.filter(d => d !== dieta) : [...current, dieta]
    setEditData({ ...editData, dieta_alimentaria: current })
  }

  const addEditContacto = () => setEditContactos([...editContactos, { nombre: '', relacion: '', telefono: '' }])
  const removeEditContacto = (index: number) => setEditContactos(editContactos.filter((_, i) => i !== index))
  const updateEditContacto = (index: number, field: string, value: string) => {
    const next = [...editContactos]; next[index] = { ...next[index], [field]: value }; setEditContactos(next)
  }

  const isAdmin = perfil?.rol_id === 1

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-5xl rounded-[1rem] p-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold font-display uppercase text-clr6 mb-8 border-b pb-1">
          {editingPupilo ? `Ficha de Socio: ${editingPupilo.nombres}` : 'Actualizar Mis Datos'}
        </h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. IDENTIDAD Y CARGOS */}
            <div className="space-y-4">
              <h3 className="text-[0.9em] font-black uppercase text-clr3 dark:text-clr9 tracking-widest border-b border-clr3 dark:border-clr10 pb-2">Identidad y Cargos</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-[0.8em] uppercase opacity-40 font-black">R.U.T.</label><input type="text" value={editData.rut || ''} disabled className="w-full p-3 rounded-xl border bg-zinc-100 dark:bg-black/40 text-[0.9em] opacity-60 cursor-not-allowed" /></div>
                <div className="space-y-1"><label className="text-[0.8em] uppercase opacity-40 font-black">Email</label><input type="email" value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-[0.8em] uppercase opacity-40 font-black">Nombres</label><input type="text" value={editData.nombres || ''} onChange={(e) => setEditData({...editData, nombres: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]" /></div>
                <div className="space-y-1"><label className="text-[0.8em] uppercase opacity-40 font-black">Apellidos</label><input type="text" value={editData.apellidos || ''} onChange={(e) => setEditData({...editData, apellidos: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-[0.8em] uppercase opacity-40 font-black">Nacimiento</label><input type="text" placeholder="DD/MM/AAAA" value={editData.fecha_nacimiento_display || ''} onChange={handleDateChange} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em] font-black tracking-widest text-center" /></div>
                <div className="space-y-1">
                  <label className="text-[0.8em] uppercase opacity-40 font-black">Cargo / Rol</label>
                  <select 
                    value={editData.rol_id || ''} 
                    onChange={(e) => setEditData({...editData, rol_id: parseInt(e.target.value)})} 
                    disabled={editData.rol_id === 1 && !isAdmin}
                    className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr5 text-[0.9em] disabled:opacity-50"
                  >
                    {roles.map(r => {
                      const isOptionAdmin = r.id === 1;
                      const isDirigenteOrGuiadora = [2, 3].includes(perfil?.rol_id || 0);
                      const canManage = isAdmin || isDirigenteOrGuiadora;
                      const isDisabled = (isOptionAdmin && !isAdmin) || (!canManage && r.id !== editData.rol_id);
                      return <option key={r.id} value={r.id} disabled={isDisabled}>{r.name.toUpperCase()}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[0.8em] uppercase opacity-40 font-black">Unidad de Pertenencia</label>
                  <select 
                    value={editData.unidad_id || ''} 
                    onChange={(e) => setEditData({...editData, unidad_id: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr5 text-[0.9em]"
                  >
                    <option value="">SIN UNIDAD / GRUPO GENERAL</option>
                    {unidades?.map(u => (
                      <option key={u.id} value={u.id}>{u.nombre.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                {(perfil?.rol_id === 1 || [2, 3].includes(perfil?.rol_id || 0)) ? (
                  <div className="space-y-1">
                    <label className="text-[0.8em] uppercase opacity-40 font-black">Estado de Cuenta</label>
                    <select 
                      value={editData.estado || 'activo'} 
                      onChange={(e) => setEditData({...editData, estado: e.target.value})} 
                      className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-clr5 text-[0.9em] font-bold"
                    >
                      <option value="activo">ACTIVO</option>
                      <option value="pendiente">PENDIENTE</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[0.8em] uppercase opacity-40 font-black">Estado de Cuenta</label>
                    <input 
                      type="text" 
                      value={(editData.estado || 'activo').toUpperCase()} 
                      disabled 
                      className="w-full p-3 rounded-xl border bg-zinc-100 dark:bg-black/40 text-[0.9em] opacity-60 cursor-not-allowed uppercase font-bold" 
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Colegio</label><input type="text" value={editData.colegio || ''} onChange={(e) => setEditData({...editData, colegio: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]" /></div>
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Nivel Ed.</label><select value={editData.nivel_educacional || ''} onChange={(e) => setEditData({...editData, nivel_educacional: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]"><option value="">S/I</option><option value="Educación Básica">Educación Básica</option><option value="Educación Media">Educación Media</option><option value="Educación Superior">Educación Superior</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Teléfono</label><input type="text" value={editData.telefono ? editData.telefono.replace(/[`']/g, '') : ''} onChange={(e) => setEditData({...editData, telefono: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]" /></div>
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Comuna</label><select value={editData.comuna || ''} onChange={(e) => setEditData({...editData, comuna: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]"><option value="">Seleccionar...</option>{COMUNAS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Dirección</label><input type="text" value={editData.direccion || ''} onChange={(e) => setEditData({...editData, direccion: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Sexo</label><select value={editData.sexo || ''} onChange={(e) => setEditData({...editData, sexo: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]"><option value="">Seleccionar...</option><option value="masculina">Masculino</option><option value="femenina">Femenino</option></select></div>
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Religión</label><select value={editData.religion || ''} onChange={(e) => setEditData({...editData, religion: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]"><option value="">Seleccionar...</option>{RELIGIONES.map(r => <option key={r} value={r}>{r.replace('-', ' ')}</option>)}</select></div>
              </div>
            </div>

            {/* 2. FICHA MEDICA BASE */}
            <div className="space-y-4">
              <h3 className="text-[0.9em] font-black uppercase text-clr7 tracking-widest border-b border-dclr7 pb-2">Ficha Médica</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Salud</label><select value={editData.sistema_salud || ''} onChange={(e) => setEditData({...editData, sistema_salud: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]"><option value="Fonasa">Fonasa</option><option value="Isapre">Isapre</option><option value="Otro">Otro</option></select></div>
                <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Sangre</label><select value={editData.tipo_sangre || ''} onChange={(e) => setEditData({...editData, tipo_sangre: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]"><option value="">S/I</option>{TIPOS_SANGRE.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Detalle Previsión</label><input type="text" value={editData.detalle_sistema_salud || ''} onChange={(e) => setEditData({...editData, detalle_sistema_salud: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em]" /></div>
              <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-80 font-black text-clr7">Alergias</label><textarea value={editData.alergias || ''} onChange={(e) => setEditData({...editData, alergias: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em] h-20 font-bold text-red-600" /></div>
              <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Medicamentos</label><textarea value={editData.medicamentos || ''} onChange={(e) => setEditData({...editData, medicamentos: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em] h-20" /></div>
              <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Antecedentes</label><textarea value={editData.antecedentes_medicos || ''} onChange={(e) => setEditData({...editData, antecedentes_medicos: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em] h-20" /></div>
              <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Tratamientos</label><textarea value={editData.tratamientos_medicos || ''} onChange={(e) => setEditData({...editData, tratamientos_medicos: e.target.value})} className="w-full p-3 rounded-xl border bg-zinc-50 dark:bg-black/20 text-[0.9em] h-20" /></div>
            </div>

            {/* 3. CONTACTOS Y AUTORIZA */}
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-[0.9em] uppercase opacity-40 font-black">Dietas</label>
                <div className="grid grid-cols-2 gap-1 p-3 bg-zinc-50 dark:bg-black/20 rounded-xl border border-dclr7 overflow-y-auto max-h-32">
                  {DIETAS.map(d => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer font-bold"><input type="checkbox" checked={Array.isArray(editData.dieta_alimentaria) && editData.dieta_alimentaria.includes(d)} onChange={() => toggleDieta(d)} className="w-3 h-3 rounded text-clr7" /><span className="text-[0.8em] uppercase">{d}</span></label>
                  ))}
                </div>
              </div>

              {/* VÍNCULO FORMAL DE APODERADO (Solo para NNJ y Clan) */}
              {editData.rol_id >= 9 && (
                <div className="space-y-2 p-1 bg-clr7/5 dark:bg-clr7/10 rounded-xl border border-clr7/30 shadow-sm animate-in zoom-in-95 duration-300 mt-4 relative">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <label className="text-[0.9em] font-black uppercase text-clr7 dark:text-clr1 tracking-wider">Apoderado</label>
                    </div>
                    <Link 
                      href="/registro" 
                      target="_blank"
                      className="text-[0.9em] uppercase p-2 my-1 rounded-[1rem] bg-clr6 text-clr1 hover:underline"
                    >
                      + Registrar Nuevo
                    </Link>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Buscar por Nombre o RUT..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full p-3 rounded-xl border bg-white dark:bg-black/40 text-[0.9em] font-bold border-clr7/20 focus:border-clr7 outline-none transition-all"
                    />
                    
                    {showDropdown && searchTerm.length > 0 && (
                      <div className="absolute z-[110] left-0 right-0 top-full mt-1 bg-white dark:bg-clr5 border border-zinc-200 dark:border-clr3 rounded-xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                        {adultosFiltrados.length > 0 ? (
                          adultosFiltrados.map(a => (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => handleSelectApoderado(a)}
                              className="w-full text-left p-3 hover:bg-zinc-50 dark:hover:bg-black/20 border-b border-zinc-100 last:border-0 transition-colors"
                            >
                              <p className="text-[0.85em] font-bold uppercase">{a.nombres} {a.apellidos}</p>
                              <p className="text-[0.8em] opacity-50 font-black tracking-widest">RUT: {a.rut}</p>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-[0.8em] italic opacity-40 mb-2">No se encontraron rastros...</p>
                            <Link href="/registro" target="_blank" className="text-[0.8em] font-black uppercase text-clr7 hover:underline">Crear Perfil de Apoderado →</Link>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Botón para limpiar selección */}
                    {editData.apoderado_id && (
                      <button 
                        type="button"
                        onClick={() => { setEditData({...editData, apoderado_id: null}); setSearchTerm(''); }}
                        className="absolute right-3 top-3 text-zinc-300 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-[0.9em] text-center italic opacity-60 leading-tight">Vínculo técnico para permisos y autorizaciones digitales.</p>
                </div>
              )}

              <h3 className="text-[0.9em] font-black uppercase text-dclr6 tracking-widest border-b border-dclr6 mt-6 pb-2">Contactos y Autoriza</h3>
              <div className="space-y-2 p-4 bg-blue-50/10 dark:bg-black/20 rounded-xl border border-blue-200/30 shadow-inner">
                <p className="text-[0.8em] font-black uppercase text-clr2 mb-2">Apoderado Contacto (Paso 13)</p>
                <input placeholder="Nombre Completo" value={editData.nombre_apoderado_contacto || ''} onChange={(e) => setEditData({...editData, nombre_apoderado_contacto: e.target.value})} className="w-full p-3 rounded-xl border bg-white dark:bg-black/20 text-[0.9em] font-bold" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <select value={editData.relacion_apoderado_contacto || ''} onChange={(e) => setEditData({...editData, relacion_apoderado_contacto: e.target.value})} className="w-full p-3 rounded-xl border bg-white dark:bg-black/20 text-[0.9em] font-bold">{PARENTESCOS.map(p => <option key={p} value={p}>{p}</option>)}</select>
                  <input placeholder="Teléfono" value={editData.telefono_apoderado_contacto ? editData.telefono_apoderado_contacto.replace(/[`']/g, '') : ''} onChange={(e) => setEditData({...editData, telefono_apoderado_contacto: e.target.value})} className="w-full p-3 rounded-xl border bg-white dark:bg-black/20 text-[0.9em] font-bold" />
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center"><label className="text-[0.8em] uppercase opacity-40 font-black">Contactos de Emergencia</label><button type="button" onClick={addEditContacto} className="text-[0.8em] font-black uppercase text-clr6 hover:underline">+ Añadir</button></div>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                  {editContactos.map((c, i) => (
                    <div key={i} className="p-4 bg-zinc-50 dark:bg-black/20 rounded-xl border border-zinc-200 dark:border-white/5 relative">
                      <button type="button" onClick={() => removeEditContacto(i)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[12px] shadow-lg">×</button>
                      <input placeholder="Nombre" value={c.nombre || ''} onChange={(e) => updateEditContacto(i, 'nombre', e.target.value)} className="w-full bg-transparent text-[0.9em] font-bold mb-2 border-b border-zinc-200 dark:border-white/10" />
                      <div className="grid grid-cols-2 gap-2">
                        <input placeholder="Relación" value={c.relacion || ''} onChange={(e) => updateEditContacto(i, 'relacion', e.target.value)} className="w-full bg-transparent text-[0.9em] border-b border-zinc-200 dark:border-white/10" />
                        <input placeholder="Teléfono" value={c.telefono ? c.telefono.replace(/[`']/g, '') : ''} onChange={(e) => updateEditContacto(i, 'telefono', e.target.value)} className="w-full bg-transparent text-[0.9em] border-b border-zinc-200 dark:border-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-zinc-50 dark:bg-black/20 rounded-2xl space-y-4 mt-4 border-2 border-zinc-100 dark:border-white/5">
                <label className="flex items-center gap-4 cursor-pointer"><input type="checkbox" checked={!!editData.autoriza_fotos} onChange={(e) => setEditData({...editData, autoriza_fotos: e.target.checked})} className="w-5 h-5 rounded-lg text-clr7" /><span className="text-[0.9em] font-bold">Autorizo Imagen/Voz</span></label>
                <label className="flex items-center gap-4 cursor-pointer"><input type="checkbox" checked={!!editData.fe_publica} onChange={(e) => setEditData({...editData, fe_publica: e.target.checked})} className="w-5 h-5 rounded-lg text-clr7" /><span className="text-[0.9em] font-bold">Fe Pública de Datos</span></label>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-8 border-t-2 mt-6">
            <button type="submit" disabled={saving} className="flex-1 py-5 bg-[#1a2a44] text-white font-black uppercase rounded-2xl shadow-2xl tracking-widest text-[0.9em] hover:scale-[1.02] transition-all disabled:opacity-50">
              {saving ? '⌛ Guardando...' : '💾 Guardar Ficha Permanente'}
            </button>
            <button type="button" onClick={onClose} className="px-12 py-5 bg-zinc-100 text-clr2 font-black uppercase rounded-2xl tracking-widest text-[0.9em]">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
