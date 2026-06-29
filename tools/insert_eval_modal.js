const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetStr = `<DashModEvaluarObjetivo`;

const insertion = `      {isModEvalActividadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-clr3 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border-2 border-white dark:border-clr4 animate-in zoom-in duration-300">
            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-4xl block mb-2">📝</span>
                <h2 className="text-2xl font-black uppercase text-clr5 dark:text-white">Evaluar Actividad</h2>
                <p className="text-[0.9em] text-zinc-500 dark:text-zinc-400 italic">¿Cómo resultó "{selectedPropuesta?.titulo}"?</p>
              </div>

              <div className="space-y-2">
                <label className="text-[0.8em] font-black uppercase tracking-widest opacity-60">Resumen y Observaciones</label>
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
      `;

if (str.includes(targetStr)) {
  str = str.replace(targetStr, insertion + targetStr);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update successful');
} else {
  console.log('Target string not found');
}
