'use client'

interface CicloFase2VotacionProps {
  perfil: any
  cicloActivo: any
  propuestas: any[]
  votos: any[]
  readOnlyOverride: boolean
  isDirectivo: boolean
  canManage: boolean
  unitColor: string
  votosTotales: number
  setVotosTotales: (val: number) => void
  votosMax: number
  setVotosMax: (val: number) => void
  votosIlimitados: boolean
  setVotosIlimitados: (val: boolean) => void
  savingRules: boolean
  guardarReglasVotacion: () => void
  setIsModVincularJuegoOpen: (open: boolean) => void
  onVoteClick: (propId: string, currentQty: number, delta: number) => Promise<void>
}

export default function CicloFase2Votacion({
  perfil,
  cicloActivo,
  propuestas,
  votos,
  readOnlyOverride,
  isDirectivo,
  canManage,
  unitColor,
  votosTotales,
  setVotosTotales,
  votosMax,
  setVotosMax,
  votosIlimitados,
  setVotosIlimitados,
  savingRules,
  guardarReglasVotacion,
  setIsModVincularJuegoOpen,
  onVoteClick
}: CicloFase2VotacionProps) {
  const filteredPropuestas = propuestas.filter(p => p.preseleccionada)

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {canManage && cicloActivo.fase_actual === 2 && (
        <div className="p-6 bg-zinc-50 dark:bg-black/20 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-clr4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <h4 className="text-sm font-black uppercase tracking-widest text-clr2">Configurar Reglas de Votación</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[1em] font-black uppercase opacity-40 leading-none">Votos por Participante</label>
              <input 
                type="number" 
                min="1"
                value={votosTotales}
                onChange={(e) => setVotosTotales(parseInt(e.target.value) || 0)}
                className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-black text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[1em] font-black uppercase opacity-40">Máx. Votos por Idea</label>
              <input 
                type="number" 
                min="1"
                value={votosMax}
                onChange={(e) => setVotosMax(parseInt(e.target.value) || 0)}
                className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-black text-sm"
              />
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-white dark:bg-clr3 rounded-xl border w-full">
                <input 
                  type="checkbox" 
                  checked={votosIlimitados}
                  onChange={(e) => setVotosIlimitados(e.target.checked)}
                  className="w-5 h-5 accent-clr7"
                />
                <span className="text-[1em] font-black uppercase tracking-wider">Votos Ilimitados</span>
              </label>
            </div>
            <button
              onClick={guardarReglasVotacion}
              disabled={savingRules}
              style={{ backgroundColor: unitColor }} 
              className="w-full py-3 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[1em] tracking-widest disabled:opacity-50 border-none text-shadow-lg"
            >
              {savingRules ? '⏳' : '💾 Aplicar Reglas'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-black font-display uppercase tracking-tight text-clr5 dark:text-clr1">Juego Democrático</h3>
          <p className="text-sm opacity-60 font-medium italic font-body">
            Es momento de decidir. Vota por tus actividades favoritas.
          </p>
          {!isDirectivo && !readOnlyOverride && (
            <div className="mt-2 flex items-center gap-2">
              <div className="px-3 py-1 rounded-full border-2" style={{ borderColor: unitColor, backgroundColor: `${unitColor}10` }}>
                <span className="text-[1em] font-bold tracking-widest">
                  Tus votos: {votos.filter(v => v.perfil_id === perfil.id).reduce((acc, v) => acc + (v.cantidad || 0), 0)} / {cicloActivo.votos_ilimitados ? '∞' : (cicloActivo.votos_totales_por_persona || 1)}
                </span>
              </div>
            </div>
          )}
        </div>
        {canManage && cicloActivo.fase_actual === 2 && (
          <button 
            onClick={() => setIsModVincularJuegoOpen(true)}
            className="px-6 py-3 bg-zinc-900 text-white font-black uppercase rounded-2xl shadow-lg hover:brightness-125 transition-all text-xs tracking-widest flex items-center gap-2"
          >
            <span>🎲</span>
            {cicloActivo.articulo_juego_id ? 'Cambiar Dinámica' : 'Vincular Dinámica'}
          </button>
        )}
      </div>

      {cicloActivo.articulo_juego && (
        <div className="p-2 bg-blue-50 dark:bg-black/20 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row items-center gap-6">
          {cicloActivo.articulo_juego.imagen_destacada ? (
            <img src={cicloActivo.articulo_juego.imagen_destacada} className="w-full md:w-32 h-32 object-cover rounded-2xl shadow-md" alt="Juego Democrático" />
          ) : (
            <div className="w-full md:w-32 h-32 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-4xl">🎲</div>
          )}
          <div className="flex-1 space-y-2 text-center md:text-left">
            <span className="text-[0.8em] font-black uppercase text-blue-600 tracking-widest">Dinámica de Votación Usada</span>
            <h4 className="text-2xl font-bold uppercase text-blue-900 dark:text-blue-300">{cicloActivo.articulo_juego.titulo}</h4>
            <p className="text-sm italic opacity-70 line-clamp-2">{cicloActivo.articulo_juego.extracto}</p>
          </div>
          <a 
            href={`/blog/actividades/juegos-democraticos/${cicloActivo.articulo_juego.slug}`}
            target="_blank"
            className="px-6 py-3 bg-blue-600 text-white font-bold uppercase rounded-xl hover:bg-blue-700 transition-all text-xs shadow-md whitespace-nowrap"
          >
            Reglas de la Dinámica
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPropuestas.map(p => {
          const userVoto = votos.find(v => v.propuesta_id === p.id && v.perfil_id === perfil.id);
          const userQty = userVoto?.cantidad || 0;
          const totalVotos = votos.filter(v => v.propuesta_id === p.id).reduce((acc, v) => acc + (v.cantidad || 0), 0);
          
          const presupuestoTotal = cicloActivo.votos_totales_por_persona || 1;
          const maxPorPropuesta = cicloActivo.votos_max_por_propuesta || 1;
          const isIlimitado = cicloActivo.votos_ilimitados || false;
          const misVotosGastados = votos.filter(v => v.perfil_id === perfil.id).reduce((acc, v) => acc + (v.cantidad || 0), 0);

          const canAdd = isDirectivo || isIlimitado || (misVotosGastados < presupuestoTotal && userQty < maxPorPropuesta);
          const canSub = isDirectivo || userQty > 0;

          return (
            <div 
              key={p.id} 
              className={`p-2 rounded-[1rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-2 relative overflow-hidden ${
                userQty > 0 ? "shadow-xl border-opacity-100" : "border-zinc-100 dark:border-clr4"
              }`} 
              style={{ 
                borderColor: userQty > 0 ? unitColor : undefined, 
                borderWidth: userQty > 0 ? "3px" : "2px" 
              }}
            >
              {(cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url) && (
                <div className="absolute -right-8 -bottom-8 opacity-[0.2] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <img 
                    src={cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url} 
                    alt="" 
                    className="w-48 h-48 object-contain" 
                  />
                </div>
              )}
              {userQty > 0 && <div className="absolute top-0 right-0 w-20 h-20 opacity-30 rounded-bl-[100%] z-0" style={{ backgroundColor: unitColor }} />}
              
              <div className="space-y-2 relative z-10 font-body">
                <span className="text-[0.8em] font-black uppercase opacity-35 tracking-widest">Idea de {p.autor?.nombres}</span>
                <h4 className="text-xl font-bold uppercase leading-tight text-clr5 dark:text-clr1">{p.titulo}</h4>
                <p className="text-sm italic opacity-60 line-clamp-3">{p.descripcion}</p>
              </div>
              
              <div className="pt-4 border-t border-zinc-50 dark:border-clr4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black" style={{ color: unitColor }}>{totalVotos}</span>
                  <span className="text-[9px] font-black uppercase opacity-40 leading-tight">Votos<br/>Totales</span>
                </div>
                
                {cicloActivo.fase_actual === 2 && !readOnlyOverride && (
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-black/40 p-1 rounded-2xl border border-zinc-200 dark:border-clr4">
                    <button 
                      disabled={!canSub || userQty === 0}
                      onClick={() => onVoteClick(p.id, userQty, -1)}
                      style={{ color: unitColor, borderColor: unitColor }} 
                      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-110 disabled:opacity-20 transition-all font-black border-2"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-lg">{userQty}</span>
                    <button 
                      disabled={!canAdd}
                      onClick={() => onVoteClick(p.id, userQty, 1)}
                      style={{ color: unitColor, borderColor: unitColor }} 
                      className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-90 disabled:opacity-20 transition-all font-black text-lg border-2"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {filteredPropuestas.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed rounded-[3rem] opacity-20">
            <span className="text-5xl block mb-4">🤫</span>
            <p className="text-xl font-black uppercase">No hay ideas preseleccionadas</p>
            <p className="font-medium italic">Los dirigentes deben seleccionar propuestas de la Fase 1 antes de votar.</p>
          </div>
        )}
        {cicloActivo.fase_actual > 2 && (
           <div className="col-span-full py-4 text-center opacity-30 text-[0.8em] font-black uppercase tracking-widest border-t border-dashed border-zinc-100 mt-4">
             🔒 Modo Lectura (Votación Finalizada)
           </div>
        )}
      </div>
    </div>
  )
}
