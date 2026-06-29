const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

// 1. Corregir botones del selector de votos (Fase 2)
// Añadir color dinámico al botón "-"
str = str.replace(
  'className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 disabled:opacity-20 transition-all font-black"',
  'style={{ color: unitColor }} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-110 disabled:opacity-20 transition-all font-black"'
);

// 2. Corregir indicador de presupuesto (Tus Monedas)
str = str.replace(
  '<div className="px-3 py-1 rounded-full border">',
  '<div className="px-3 py-1 rounded-full border" style={{ borderColor: `${unitColor}40`, backgroundColor: `${unitColor}10` }}>'
);
str = str.replace(
  'text-clr7 tracking-widest',
  'tracking-widest'
);
// Asegurar que el texto de las monedas use el color de unidad
str = str.replace(
  '<span className="text-[10px] font-black uppercase text-clr7 tracking-widest">',
  `<span className="text-[10px] font-black uppercase tracking-widest" style={{ color: unitColor }}>`
);

// 3. Reforzar visibilidad de bordes en las tarjetas (Fase 1 y 2)
// Buscamos las definiciones de bordes dinámicos y aseguramos que no tengan clases dark que los tapen cuando están activos
str = str.replace(
  'style={{ borderColor: (p.preseleccionada || p.es_grupal_global) ? unitColor : undefined }}',
  'style={{ borderColor: (p.preseleccionada || p.es_grupal_global) ? unitColor : undefined, borderWidth: (p.preseleccionada || p.es_grupal_global) ? "3px" : "2px" }}'
);

str = str.replace(
  'style={{ borderColor: userQty > 0 ? unitColor : undefined }}',
  'style={{ borderColor: userQty > 0 ? unitColor : undefined, borderWidth: userQty > 0 ? "3px" : "2px" }}'
);

// 4. Corregir el color de la nota en Fase 2
str = str.replace(
  'text-white hover:brightness-110 hover:scale-105 active:scale-95',
  'text-white hover:brightness-110 hover:scale-105 active:scale-95'
); // No change needed here, just confirming

// 5. Asegurar que el badge de votos totales en Fase 2 use color de unidad
str = str.replace(
  '<span className="text-2xl font-black">{totalVotos}</span>',
  `<span className="text-2xl font-black" style={{ color: unitColor }}>{totalVotos}</span>`
);

fs.writeFileSync(file, str, 'utf8');
console.log('Dark mode identity fixes applied successfully');
