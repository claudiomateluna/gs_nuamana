const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetStr = '<section className="space-y-12">';

const insertion = `
            {metadata.objetivos_educativos && metadata.objetivos_educativos.length > 0 && (
              <div className="p-10 bg-orange-50 dark:bg-orange-900/20 rounded-[2.5rem] border-l-[12px] border-orange-500 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🎯</span>
                  <h3 className="text-2xl font-display font-bold text-orange-600 uppercase my-0">Objetivos Educativos</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {metadata.objetivos_educativos.map((o: any, i: number) => (
                    <Link href={\`/blog?obj_ed=\${encodeURIComponent(o.texto)}\`} key={i} className="group flex flex-col gap-1 p-4 bg-white dark:bg-black/20 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900/30 hover:border-orange-400 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.8em] font-black uppercase text-orange-500 tracking-widest">{o.unidad}</span>
                        <span className="text-[0.8em] font-black uppercase text-zinc-400">• {o.area}</span>
                        <span className="text-[0.7em] font-black uppercase text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">Filtrar por este objetivo →</span>
                      </div>
                      <p className="font-bold text-[1.1em] text-clr5 dark:text-white italic group-hover:text-orange-600 transition-colors">"{o.texto}"</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}`;

str = str.replace(targetStr, targetStr + '\n' + insertion);
fs.writeFileSync(file, str, 'utf8');
console.log('Replaced successfully');
