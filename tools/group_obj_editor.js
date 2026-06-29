const fs = require('fs');

function updateFile(file) {
  let str = fs.readFileSync(file, 'utf8');

  const targetRegex = /objsDisponibles\s*\n?\s*\.filter\([\s\S]*?\)\s*\n?\s*\.map\(\s*obj\s*=>\s*\{[\s\S]*?return\s*\([\s\S]*?\n\s*\)\s*\}\s*\)/;

  const newContent = `Object.entries(
                          objsDisponibles
                            .filter(o => o.texto_infantil.toLowerCase().includes(searchObj.toLowerCase()) || o.area.nombre.toLowerCase().includes(searchObj.toLowerCase()))
                            .reduce((acc: any, obj: any) => {
                              const term = obj.texto_terminal || 'Objetivos Específicos'
                              if (!acc[term]) acc[term] = []
                              acc[term].push(obj)
                              return acc
                            }, {})
                        ).map(([terminal, objs]: [string, any], idx) => (
                          <div key={idx} className="col-span-1 md:col-span-2 flex flex-col gap-3 mt-4 first:mt-0">
                            <h4 className="font-bold text-[0.9em] text-clr5 dark:text-clr2 leading-relaxed border-b border-zinc-200 dark:border-zinc-800 pb-2 uppercase tracking-widest">
                              🎯 {terminal}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {objs.map((obj: any) => {
                                const isSelected = selectedObjsEd.find((s: any) => s.id === obj.id)
                                const unitColor = obj.unidad?.colores?.primario || '#ccc'
                                return (
                                  <div
                                    key={obj.id}
                                    onClick={() => toggleObjEd(obj)}
                                    style={{ borderLeftColor: unitColor }}
                                    className={\`p-4 rounded-2xl border-2 border-l-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex flex-col gap-2 \${isSelected ? 'bg-zinc-50 dark:bg-clr4 border-clr7' : 'bg-white dark:bg-black/10 border-zinc-100 dark:border-clr4 opacity-80 hover:opacity-100'}\`}
                                  >
                                    <div className="flex justify-between items-center relative">
                                      <span className="text-[0.9em] font-black uppercase px-2 py-0.5 rounded-md text-white shadow-sm" style={{ backgroundColor: unitColor }}>{obj.unidad.nombre}</span>
                                      <div className="flex items-center gap-2">
                                        {obj.texto_terminal && (
                                          <div className="relative group/tooltip flex items-center justify-center" onClick={(e) => { e.stopPropagation(); alert('🎯 OBJETIVO TERMINAL:\\n\\n' + obj.texto_terminal); }}>
                                            <span className="text-xl cursor-help opacity-50 hover:opacity-100 transition-opacity" title="Ver Objetivo Terminal (Clic en móvil)">🎯</span>
                                            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:group-hover/tooltip:block w-80 max-w-[90vw] p-6 bg-zinc-900 text-white text-[0.9em] font-bold rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[9999] animate-in fade-in zoom-in duration-200 pointer-events-none text-center border border-zinc-800 flex flex-col items-center gap-3">
                                              <div className="flex flex-col items-center gap-1">
                                                <span className="text-clr7 uppercase tracking-widest block opacity-90 text-[0.8em] font-black">🎯 Objetivo Terminal</span>
                                              </div>
                                              <p className="leading-relaxed">{obj.texto_terminal}</p>
                                            </div>
                                          </div>
                                        )}
                                        <span className="text-[0.9em] font-black uppercase text-zinc-400">{obj.area.nombre}</span>
                                      </div>
                                    </div>
                                    <div className="text-center space-y-2 mt-2">
                                      <p className="text-[1em] leading-relaxed font-bold dark:text-clr1 italic">"{obj.texto_infantil}"</p>
                                      {obj.rango_edad && (
                                        <span className="inline-block px-3 py-1 rounded-full text-[0.75em] font-black uppercase tracking-widest bg-zinc-100 dark:bg-black/30 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-clr4">
                                          {obj.rango_edad}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))`;

  if (targetRegex.test(str)) {
    str = str.replace(targetRegex, newContent);
    fs.writeFileSync(file, str, 'utf8');
    console.log('Update successful for', file);
  } else {
    console.log('Regex not found for', file);
  }
}

updateFile('frontend/src/app/blog/crear/page.tsx');
updateFile('frontend/src/app/blog/editar/[id]/page.tsx');
