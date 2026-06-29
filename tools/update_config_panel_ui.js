const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldPanel = `<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-40">Votos Totales por Socio</label>
                  <input 
                    type="number" 
                    min="1"
                    value={cicloActivo.votos_totales_por_persona || 1}
                    onChange={async (e) => {
                      const val = parseInt(e.target.value);
                      await supabase.from('ciclos_unidad').update({ votos_totales_por_persona: val }).eq('id', cicloActivo.id);
                      fetchCiclo();
                    }}
                    className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-black text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-40">Máx. Votos por Idea</label>
                  <input 
                    type="number" 
                    min="1"
                    value={cicloActivo.votos_max_por_propuesta || 1}
                    onChange={async (e) => {
                      const val = parseInt(e.target.value);
                      await supabase.from('ciclos_unidad').update({ votos_max_por_propuesta: val }).eq('id', cicloActivo.id);
                      fetchCiclo();
                    }}
                    className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-black text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-white dark:bg-clr3 rounded-xl border w-full">
                    <input 
                      type="checkbox" 
                      checked={cicloActivo.votos_ilimitados || false}
                      onChange={async (e) => {
                        await supabase.from('ciclos_unidad').update({ votos_ilimitados: e.target.checked }).eq('id', cicloActivo.id);
                        fetchCiclo();
                      }}
                      className="w-5 h-5 accent-clr7"
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider">Votos Ilimitados</span>
                  </label>
                </div>
              </div>`;

const newPanel = `<div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-40">Votos Totales por Socio</label>
                  <input 
                    type="number" 
                    min="1"
                    value={votosTotales}
                    onChange={(e) => setVotosTotales(parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl border bg-white dark:bg-clr3 font-black text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase opacity-40">Máx. Votos por Idea</label>
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
                    <span className="text-[10px] font-black uppercase tracking-wider">Votos Ilimitados</span>
                  </label>
                </div>
                <button
                  onClick={guardarReglasVotacion}
                  disabled={savingRules}
                  className="w-full py-3.5 bg-clr7 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[10px] tracking-widest disabled:opacity-50"
                >
                  {savingRules ? '⏳' : '💾 Aplicar Reglas'}
                </button>
              </div>`;

if (str.includes(oldPanel)) {
    str = str.replace(oldPanel, newPanel);
    fs.writeFileSync(file, str, 'utf8');
    console.log('Updated config panel UI successfully');
} else {
    console.log('Old panel string not found exactly');
}
