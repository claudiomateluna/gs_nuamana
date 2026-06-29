const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetStr = `{/* FASE 2: JUEGO DEMOCRÁTICO */}`;

const configPanel = `{canManage && faseVisualizada === 2 && (
            <div className="p-6 bg-zinc-50 dark:bg-black/20 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-clr4 space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚙️</span>
                <h4 className="text-sm font-black uppercase tracking-widest text-clr2">Configuración de Reglas (Solo Dirigentes)</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </div>
          )}`;

if (str.includes(targetStr)) {
  str = str.replace(targetStr, targetStr + '\n          ' + configPanel);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update config panel successful');
} else {
  console.log('Target string not found');
}
