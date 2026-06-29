const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetRegex = /\{metadata\.objetivos_educativos && metadata\.objetivos_educativos\.length > 0 && \([\s\S]*?\)\}/;

const newContent = `{metadata.objetivos_educativos && metadata.objetivos_educativos.length > 0 && (
              <div className="p-6 bg-zinc-50 dark:bg-black/20 rounded-[2rem] border-l-[8px] border-zinc-300 dark:border-zinc-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-xl font-display font-bold text-clr5 dark:text-white uppercase my-0">Objetivos Educativos</h3>
                </div>
                <div className="flex flex-col gap-6">
                  {Object.entries(metadata.objetivos_educativos.reduce((acc: any, obj: any) => {
                    const term = obj.texto_terminal || 'Objetivos Específicos'
                    if (!acc[term]) acc[term] = []
                    acc[term].push(obj)
                    return acc
                  }, {})).map(([terminal, objs]: [string, any], idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <h4 className="font-bold text-[0.95em] text-clr5 dark:text-clr2 leading-relaxed border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        🎯 {terminal}
                      </h4>
                      <div className="flex flex-col gap-2">
                        {objs.map((o: any, i: number) => (
                          <Link href={\`/blog?obj_ed=\${encodeURIComponent(o.texto)}\`} key={i} className="group flex flex-col gap-1 p-3 bg-white dark:bg-black/40 rounded-xl shadow-sm border border-zinc-100 dark:border-clr4 hover:shadow-md transition-all cursor-pointer relative overflow-hidden pl-5">
                            <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: o.color || '#ccc' }} />
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[0.75em] font-black uppercase tracking-widest" style={{ color: o.color || '#ccc' }}>{o.unidad}</span>
                              <span className="text-[0.75em] font-black uppercase text-zinc-400">• {o.area}</span>
                              {o.rango_edad && <span className="text-[0.7em] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">{o.rango_edad}</span>}
                              <span className="text-[0.7em] font-black uppercase text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">Filtrar →</span>
                            </div>
                            <p className="font-bold text-[1em] text-clr4 dark:text-white italic group-hover:opacity-70 transition-opacity">"{o.texto}"</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}`;

if (targetRegex.test(str)) {
  str = str.replace(targetRegex, newContent);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update successful');
} else {
  console.log('Regex not found');
}
