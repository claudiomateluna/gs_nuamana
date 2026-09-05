'use client'

interface ProyectoPaso9QuienesProps {
  perfil: any
  actividades: any[]
  unidades: any[]
  filteredMiembros: any[]
  participantesReg: any[]
  handleToggleParticipanteReg: (id: string) => void
  handleUpdateParticipanteRegRol: (id: string, rol: string) => void
  handleUpdateParticipanteRegTarea: (id: string, tareas: string) => void
  participantesManuales: any[]
  addParticipanteManual: () => void
  removeParticipanteManual: (idx: number) => void
  updateParticipanteManual: (idx: number, field: string, val: string) => void
  memberSearch: string
  setMemberSearch: (val: string) => void
  selectedUnitFilter: string
  setSelectedUnitFilter: (val: string) => void
  themePrimary: string
  themeSecondary: string
}

export default function ProyectoPaso9Quienes({
  perfil,
  actividades,
  unidades,
  filteredMiembros,
  participantesReg,
  handleToggleParticipanteReg,
  handleUpdateParticipanteRegRol,
  handleUpdateParticipanteRegTarea,
  participantesManuales,
  addParticipanteManual,
  removeParticipanteManual,
  updateParticipanteManual,
  memberSearch,
  setMemberSearch,
  selectedUnitFilter,
  setSelectedUnitFilter,
  themePrimary,
  themeSecondary
}: ProyectoPaso9QuienesProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 opacity-60 rounded-[0.8rem]" style={{ backgroundColor: themePrimary }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-clr1 text-[0.9em] font-bold" style={{ color: themeSecondary }}>9</span>
        <h3 className="text-xl font-black uppercase tracking-tight text-clr2 dark:text-dclr2" style={{ color: themeSecondary }}>¿Quiénes lo Haremos?</h3>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 min-h-[420px] p-1 font-body">
        {/* Left Column (Desktop) / Top Row (Mobile) */}
        <div className="w-full flex items-center justify-center lg:items-end lg:justify-start">
          <img 
            src="/images/proyectos/Quienes2.svg" 
            alt="Ilustración Paso 9" 
            className="block lg:hidden w-full max-h-[160px] object-contain mb-2"
          />
          <img 
            src="/images/proyectos/Quienes.svg" 
            alt="Ilustración Paso 9" 
            className="hidden lg:block w-full max-h-[500px] object-contain"
          />
        </div>

        {/* Right Column (Desktop) / Bottom Row (Mobile) */}
        <div className="w-full space-y-2 bg-clr7 dark:bg-dclr7 p-1 rounded-[1rem] border border-clr7 dark:border-dclr7 backdrop-blur-xs shadow-md">
          {/* Miembros Registrados */}
          <div className="space-y-2 bg-clr1 dark:bg-dclr1 p-2 rounded-2xl border dark:border-clr1">
            <span className="text-[0.8em] font-black uppercase tracking-wider text-clr3 block">Miembros del Grupo</span>
            
            <div className="flex flex-col gap-1.5">
              <input 
                type="text" 
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full p-2 rounded-xl border dark:border-clr1 bg-clr7 dark:bg-dclr7 text-[0.8em] font-bold outline-none"
              />
              <select
                value={selectedUnitFilter}
                onChange={e => setSelectedUnitFilter(e.target.value)}
                className="w-full p-2 rounded-xl border dark:border-clr1 bg-clr7 dark:bg-dclr7 text-[0.9em] font-bold tracking-tight outline-none"
              >
                <option value="">Todas las unidades</option>
                {unidades.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredMiembros.map(m => {
                const part = participantesReg.find(p => p.perfil_id === m.id)
                const isSelected = !!part
                return (
                  <div key={m.id} className="flex flex-col gap-1 p-2 bg-clr7 dark:bg-dclr7 rounded-xl border dark:border-clr1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleToggleParticipanteReg(m.id)}
                        className="rounded border-clr3 text-clr4 focus:ring-clr4"
                      />
                      <span className="text-[1em] text-clr2 dark:text-dclr2">
                        {m.nombres} {m.apellidos} <span className="opacity-65 text-[0.8em]">({m.unidades?.nombre})</span>
                      </span>
                    </label>
                    
                    {isSelected && (
                      <div className="flex flex-col gap-1">
                        <select
                          value={part.rol_en_proyecto}
                          onChange={(e) => handleUpdateParticipanteRegRol(m.id, e.target.value)}
                          className="w-full text-[0.8em] font-bold uppercase tracking-tight bg-clr1 dark:bg-dclr1 p-1.5 rounded-lg border dark:border-clr1 outline-none"
                        >
                          <option value="coordinador">Coordinador</option>
                          <option value="tesorero">Tesorero</option>
                          <option value="logistica">Logística</option>
                          <option value="comunicaciones">Comunicaciones</option>
                          <option value="participante">Participante</option>
                        </select>
                        
                        <div className="flex flex-wrap gap-1 mt-1 p-1.5 bg-clr1 dark:bg-dclr1 rounded-xl border dark:border-clr1">
                          <span className="w-full text-[0.8em] font-black uppercase text-clr3 mb-0.5 ml-1 text-left">Tareas Asignadas:</span>
                          {actividades.map(act => {
                            const actName = act.nombre || '(Sin Nombre)'
                            const assignedList = part.tarea_asignada ? part.tarea_asignada.split(',').map((t: string) => t.trim()).filter(Boolean) : []
                            const isAssigned = assignedList.includes(actName)
                            
                            return (
                              <button
                                key={act.id}
                                type="button"
                                onClick={() => {
                                  let newList
                                  if (isAssigned) {
                                    newList = assignedList.filter((t: string) => t !== actName)
                                  } else {
                                    newList = [...assignedList, actName]
                                  }
                                  handleUpdateParticipanteRegTarea(m.id, newList.join(', '))
                                }}
                                className={`px-2 py-0.5 rounded-full text-[0.8em] font-bold uppercase transition-all border ${
                                  isAssigned 
                                    ? 'text-clr1 border-transparent' 
                                    : 'bg-clr1 hover:bg-clr7 dark:bg-dclr1 dark:hover:bg-dclr1 text-clr3 dark:text-dclr3 border-clr7 dark:border-dclr7'
                                }`}
                                style={isAssigned ? { backgroundColor: themePrimary } : undefined}
                              >
                                {actName}
                              </button>
                            )
                          })}
                          {actividades.length === 0 && (
                            <span className="text-[0.8em] italic text-clr3 ml-1">No hay actividades en Paso 7.</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Colaboradores Manuales */}
          <div className="space-y-2 bg-clr1 dark:bg-dclr1 p-2 rounded-2xl border dark:border-clr1">
            <div className="flex justify-between items-center">
              <span className="text-[0.8em] font-black uppercase tracking-wider text-clr3">Externos / Colaboradores</span>
              <button 
                type="button" 
                onClick={addParticipanteManual}
                className="px-2 py-1 rounded-lg text-[0.8em] font-black uppercase hover:brightness-110 shadow-sm border-none"
                style={{ backgroundColor: themePrimary, color: themeSecondary }}
              >
                ➕ Agregar
              </button>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {participantesManuales.map((p, idx) => (
                <div key={idx} className="p-2 bg-clr7 dark:bg-dclr7 rounded-xl border dark:border-clr1 space-y-1.5 relative">
                  <button 
                    type="button" 
                    onClick={() => removeParticipanteManual(idx)}
                    className="absolute top-1 right-2 text-clr4 font-bold hover:bg-clr4 dark:hover:bg-dclr4 px-1 rounded text-[0.85em] border-none bg-transparent"
                  >
                    ✕
                  </button>
                  <input 
                    type="text" 
                    value={p.nombre || ''}
                    onChange={e => updateParticipanteManual(idx, 'nombre', e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full p-1.5 rounded-lg border dark:border-clr1 bg-clr1 dark:bg-dclr1 text-[0.8em] font-bold"
                  />
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <input 
                      type="text" 
                      value={p.telefono || ''}
                      onChange={e => updateParticipanteManual(idx, 'telefono', e.target.value)}
                      placeholder="Teléfono"
                      className="w-full sm:w-1/2 p-1.5 rounded-lg border dark:border-clr1 bg-clr1 dark:bg-dclr1 text-[0.8em] font-bold text-center"
                    />
                    <input 
                      type="email" 
                      value={p.email || ''}
                      onChange={e => updateParticipanteManual(idx, 'email', e.target.value)}
                      placeholder="Email"
                      className="w-full sm:w-1/2 p-1.5 rounded-lg border dark:border-clr1 bg-clr1 dark:bg-dclr1 text-[0.8em] font-bold"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 p-1.5 bg-clr1 dark:bg-dclr1 rounded-xl border dark:border-clr1">
                    <span className="w-full text-[0.8em] font-black uppercase text-clr3 mb-0.5 ml-1 text-left">Tareas Asignadas:</span>
                    {actividades.map(act => {
                      const actName = act.nombre || '(Sin Nombre)'
                      const assignedList = p.tarea_asignada ? p.tarea_asignada.split(',').map((t: string) => t.trim()).filter(Boolean) : []
                      const isAssigned = assignedList.includes(actName)
                      
                      return (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => {
                            let newList
                            if (isAssigned) {
                              newList = assignedList.filter((t: string) => t !== actName)
                            } else {
                              newList = [...assignedList, actName]
                            }
                            updateParticipanteManual(idx, 'tarea_asignada', newList.join(', '))
                          }}
                          className={`px-2 py-0.5 rounded-full text-[0.8em] font-bold uppercase transition-all border ${
                            isAssigned 
                              ? 'text-clr1 border-transparent' 
                              : 'bg-clr1 hover:bg-clr7 dark:bg-dclr1 dark:hover:bg-dclr1 text-clr3 dark:text-dclr3 border-clr7 dark:border-dclr7'
                          }`}
                          style={isAssigned ? { backgroundColor: themePrimary } : undefined}
                        >
                          {actName}
                        </button>
                      )
                    })}
                    {actividades.length === 0 && (
                      <span className="text-[0.8em] italic text-clr3 ml-1">No hay actividades en Paso 7.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
