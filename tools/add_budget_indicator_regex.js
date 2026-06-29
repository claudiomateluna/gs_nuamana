const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetRegex = /<p className="text-sm opacity-60 font-medium italic">[\s\S]*?Es momento de decidir\. Vota por tus actividades favoritas\.[\s\S]*?<\/p>/;

const insertion = `\n                  {!isDirectivo && !readOnlyOverride && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="px-3 py-1 bg-clr7/10 rounded-full border border-clr7/20">
                        <span className="text-[10px] font-black uppercase text-clr7 tracking-widest">
                          Tus Monedas: {votos.filter(v => v.perfil_id === perfil.id).reduce((acc, v) => acc + (v.cantidad || 0), 0)} / {cicloActivo.votos_ilimitados ? '∞' : (cicloActivo.votos_totales_por_persona || 1)}
                        </span>
                      </div>
                    </div>
                  )}`;

if (targetRegex.test(str)) {
  str = str.replace(targetRegex, (match) => match + insertion);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Added budget indicator with regex');
} else {
  console.log('Target regex not found');
}
