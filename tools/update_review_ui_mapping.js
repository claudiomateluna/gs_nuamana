const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldRender = `{articulo.articulo_resenas.map((res: any) => {
                    const profile = res.perfiles || {};
                    // Usamos el snapshot de la reseña si existe, si no el perfil actual
                    const unitName = res.unidad_resena || profile.unidades?.nombre || 'Independiente';
                    const age = res.edad_resena || 0;
                    
                    const displayName = res.es_anonimo ? 'ANÓNIMO' : \`\${profile.nombres} \${profile.apellidos}\`;

                    return (
                      <div key={res.id} className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-zinc-100 dark:border-clr4 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md relative overflow-hidden group">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={\`text-[0.75em] font-black tracking-widest \${res.es_anonimo ? 'text-zinc-500' : 'text-orange-600'}\`}>
                              {displayName}
                            </span>
                            <span className="text-[0.75em] font-black opacity-60 tracking-widest uppercase"> — {unitName}</span>
                            {age > 0 && <span className="text-[0.75em] font-black opacity-60 tracking-widest uppercase"> — {age} AÑOS</span>}
                            <span className="text-[0.75em] font-bold opacity-30 tracking-widest ml-auto uppercase text-right"> — {format(new Date(res.created_at), 'dd/MM/yy')}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                              <span key={n} className={\`text-lg \${res.calificacion >= n ? 'text-orange-500' : 'text-zinc-200'}\`}>★</span>
                            ))}
                          </div>
                          
                          {res.comentario && (
                            <p className="text-sm italic opacity-95 leading-relaxed dark:text-clr1 font-medium bg-zinc-50 dark:bg-black/20 p-4 rounded-xl border-l-4 border-orange-500/30">
                              "{res.comentario}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}`;

const newRender = `{articulo.articulo_resenas.map((res: any) => {
                    const profile = res.perfiles || {};
                    // Usamos los datos guardados en la reseña para que sean históricos
                    const unitLabel = res.unidad_resena || 'Scout';
                    const age = res.edad_resena || 0;
                    
                    const displayName = res.es_anonimo ? 'ANÓNIMO' : \`\${profile.nombres} \${profile.apellidos}\`;

                    return (
                      <div key={res.id} className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-zinc-100 dark:border-clr4 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md relative overflow-hidden group">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={\`text-[0.8em] font-black tracking-widest \${res.es_anonimo ? 'text-zinc-500' : 'text-orange-600'}\`}>
                              {displayName.toUpperCase()}
                            </span>
                            <span className="text-[0.8em] font-black opacity-60 tracking-widest"> — {unitLabel.toUpperCase()}</span>
                            {age > 0 && <span className="text-[0.8em] font-black opacity-60 tracking-widest"> — {age} AÑOS</span>}
                            <span className="text-[0.8em] font-black opacity-30 tracking-widest ml-auto uppercase text-right"> — {format(new Date(res.created_at), 'dd/MM/yy')}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-1 items-center">
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                              <span key={n} className={\`text-xl \${res.calificacion >= n ? 'text-orange-500' : 'text-zinc-200'}\`}>★</span>
                            ))}
                            <span className="ml-2 text-sm font-black text-orange-600 opacity-60 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-md">NOTA {res.calificacion}</span>
                          </div>
                          
                          {res.comentario && (
                            <p className="text-[1em] italic opacity-95 leading-relaxed dark:text-clr1 font-medium bg-zinc-50 dark:bg-black/20 p-5 rounded-2xl border-l-[6px] border-orange-500/40 shadow-inner">
                              "{res.comentario}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}`;

if (str.includes(oldRender)) {
  str = str.replace(oldRender, newRender);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update public review UI with mapping and better style successful');
} else {
  console.log('Old review UI string not found');
}
