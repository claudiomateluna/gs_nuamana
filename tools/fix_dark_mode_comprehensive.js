const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

// 1. Corregir Tarjetas Fase 1 (Identity)
// Buscamos el div de la propuesta en Fase 1
str = str.replace(
  /className={`p-4 rounded-\[1.5rem\] bg-white dark:bg-black\/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden \${p\.preseleccionada \|\| p\.es_grupal_global \? 'shadow-lg' : 'opacity-90'}`}/g,
  'className={`p-4 rounded-[1.5rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden ${p.preseleccionada || p.es_grupal_global ? "shadow-lg border-opacity-100" : "opacity-90 border-zinc-100 dark:border-clr4"}`}'
);

// 2. Corregir Tarjetas Fase 2 (Voting)
str = str.replace(
  /className={`p-2 rounded-\[1rem\] bg-white dark:bg-black\/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-2 relative overflow-hidden \${userQty > 0 \? 'shadow-xl' : ''}`}/g,
  'className={`p-2 rounded-[1rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-2 relative overflow-hidden ${userQty > 0 ? "shadow-xl border-opacity-100" : "border-zinc-100 dark:border-clr4"}`}'
);

// 3. Corregir Botón "Aplicar Reglas"
// Ya tiene style={{ backgroundColor: unitColor }}, pero vamos a quitarle cualquier clase que pueda estorbar
str = str.replace(
  'style={{ backgroundColor: unitColor }} className="w-full py-3.5 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[10px] tracking-widest disabled:opacity-50"',
  'style={{ backgroundColor: unitColor }} className="w-full py-3.5 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[10px] tracking-widest disabled:opacity-50 border-none"'
);

// 4. Corregir Botones del Selector de Votos (+ y -)
// Botón "-"
str = str.replace(
  'style={{ color: unitColor }} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-110 disabled:opacity-20 transition-all font-black"',
  'style={{ color: unitColor, borderColor: unitColor }} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-110 disabled:opacity-20 transition-all font-black border-2"'
);
// Botón "+" (corrigiendo el posible error de script previo)
str = str.replace(
  'style={{ color: unitColor }} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-90 disabled:opacity-20 transition-all font-black text-lg"',
  'style={{ color: unitColor, borderColor: unitColor }} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-90 disabled:opacity-20 transition-all font-black text-lg border-2"'
);

// 5. Corregir Indicador de Presupuesto (Badge)
str = str.replace(
  '<div className="px-3 py-1 rounded-full border" style={{ borderColor: `${unitColor}40`, backgroundColor: `${unitColor}10` }}>',
  '<div className="px-3 py-1 rounded-full border-2" style={{ borderColor: unitColor, backgroundColor: `${unitColor}10` }}>'
);

fs.writeFileSync(file, str, 'utf8');
console.log('Comprehensive dark mode identity fix applied');
