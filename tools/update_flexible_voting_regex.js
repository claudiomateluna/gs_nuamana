const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetRegex = /\{propuestas\.filter\(p => p\.preseleccionada\)\.map\(p => \{[\s\S]*?\}\)\}/;

const newMapBody = `{propuestas.filter(p => p.preseleccionada).map(p => {
                  const userVoto = votos.find(v => v.propuesta_id === p.id && v.perfil_id === perfil.id);
                  const userQty = userVoto?.cantidad || 0;
                  const totalVotos = votos.filter(v => v.propuesta_id === p.id).reduce((acc, v) => acc + (v.cantidad || 0), 0);
                  
                  const presupuestoTotal = cicloActivo.votos_totales_por_persona || 1;
                  const maxPorPropuesta = cicloActivo.votos_max_por_propuesta || 1;
                  const isIlimitado = cicloActivo.votos_ilimitados || false;
                  const misVotosGastados = votos.filter(v => v.perfil_id === perfil.id).reduce((acc, v) => acc + (v.cantidad || 0), 0);

                  const canAdd = isDirectivo || isIlimitado || (misVotosGastados < presupuestoTotal && userQty < maxPorPropuesta);
                  const canSub = isDirectivo || userQty > 0;

                  const handleVotar = async (delta: number) => {
                    const nuevaCant = userQty + delta;
                    if (nuevaCant <= 0) {
                      await supabase.from('ciclo_votos').delete().match({ propuesta_id: p.id, perfil_id: perfil.id });
                    } else {
                      await supabase.from('ciclo_votos').upsert({ 
                        propuesta_id: p.id, 
                        perfil_id: perfil.id, 
                        cantidad: nuevaCant 
                      }, { onConflict: 'propuesta_id,perfil_id' });
                    }
                    fetchCiclo();
                  };

                  return (
                    <div key={p.id} className={\`p-6 rounded-[2.5rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden \${userQty > 0 ? 'border-clr7' : 'border-zinc-100 dark:border-clr4'}\`}>
                      {userQty > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-clr7/10 rounded-bl-[100%] z-0" />}
                      
                      <div className="space-y-2 relative z-10">
                        <span className="text-[10px] font-black uppercase opacity-30 tracking-widest">Idea de {p.autor?.nombres}</span>
                        <h4 className="text-xl font-bold uppercase leading-tight text-clr5 dark:text-clr1">{p.titulo}</h4>
                        <p className="text-sm italic opacity-60 line-clamp-3">{p.descripcion}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-zinc-50 dark:border-clr4 flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black">{totalVotos}</span>
                          <span className="text-[9px] font-black uppercase opacity-40 leading-tight">Votos<br/>Totales</span>
                        </div>
                        
                        {cicloActivo.fase_actual === 2 && !readOnlyOverride && (
                          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-black/40 p-1 rounded-2xl border border-zinc-200 dark:border-clr4">
                            <button 
                              disabled={!canSub || userQty === 0}
                              onClick={() => handleVotar(-1)}
                              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 disabled:opacity-20 transition-all font-black"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-black text-lg">{userQty}</span>
                            <button 
                              disabled={!canAdd}
                              onClick={() => handleVotar(1)}
                              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:text-green-600 disabled:opacity-20 transition-all font-black text-lg"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}`;

if (targetRegex.test(str)) {
  str = str.replace(targetRegex, newMapBody);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update flexible voting UI with regex successful');
} else {
  console.log('Target regex not found');
}
