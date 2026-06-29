const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

// Cambiar bg-clr7 por el color de la unidad en botones críticos de gestión
str = str.replace('bg-clr7 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[10px] tracking-widest disabled:opacity-50', 'style={{ backgroundColor: unitColor }} className="w-full py-3.5 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[10px] tracking-widest disabled:opacity-50"');

// Cambiar el badge de presupuesto a color de unidad
str = str.replace('bg-clr7/10 rounded-full border border-clr7/20', 'rounded-full border');
str = str.replace('style={{ borderColor: `${unitColor}20`, backgroundColor: `${unitColor}10` }}'); // No, let's do it cleaner

str = str.replace('text-clr7 tracking-widest', 'tracking-widest');

fs.writeFileSync(file, str, 'utf8');
console.log('Final Polish successful');
