const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

// --- FASE 1 ---
const target1 = '<div key={p.id} className={`p-2 rounded-[1rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-2 ${p.preseleccionada || p.es_grupal_global ? \'border-clr6\' : \'border-zinc-100 dark:border-clr4 opacity-90\'}`}>';
const replacement1 = `<div key={p.id} className={\`p-4 rounded-[1.5rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden \${p.preseleccionada || p.es_grupal_global ? 'shadow-lg' : 'opacity-90'}\`} style={{ borderColor: (p.preseleccionada || p.es_grupal_global) ? unitColor : undefined }}>
                    {(cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url) && (
                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
                        <img src={cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url} alt="" className="w-24 h-24 object-contain grayscale" />
                      </div>
                    )}`;

if (str.includes(target1)) {
  str = str.replace(target1, replacement1);
}

// --- FASE 2 ---
const target2 = 'return (\n                    <div key={p.id} className={`p-6 rounded-[2.5rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden ${userQty > 0 ? \'border-clr7\' : \'border-zinc-100 dark:border-clr4\'}`}>';
const replacement2 = `return (
                    <div key={p.id} className={\`p-6 rounded-[2.5rem] bg-white dark:bg-black/20 border-2 transition-all shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden \${userQty > 0 ? 'shadow-xl' : ''}\`} style={{ borderColor: userQty > 0 ? unitColor : undefined }}>
                      {(cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url) && (
                        <div className="absolute -right-8 -bottom-8 opacity-[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                          <img src={cicloActivo?.unidades?.logo_unidad_url || perfil.unidades?.logo_unidad_url} alt="" className="w-48 h-48 object-contain grayscale" />
                        </div>
                      )}`;

if (str.includes(target2)) {
  str = str.replace(target2, replacement2);
}

// Ajustar colores del selector numérico
str = str.replace('style={{ backgroundColor: p.preseleccionada ? undefined : unitColor }}', 'style={{ backgroundColor: unitColor }}');
str = str.replace('bg-clr7 text-white', 'text-white'); // El badge de votos totales en fase 2
str = str.replace('className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:text-green-600', 'style={{ color: unitColor }} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-clr3 rounded-xl shadow-sm hover:brightness-90');

fs.writeFileSync(file, str, 'utf8');
console.log('Update Identity successful');
