const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldRender = `{articulo.articulo_resenas.map((res: any) => {
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

const newRender = `{articulo.articulo_resenas.map((res: any) => {
                    const profile = res.perfiles || {};
                    const unitLabel = res.unidad_resena || 'Scout';
                    const age = res.edad_resena || 0;
                    const uColor = res.unidad_color_resena || '#cb3327';
                    const uLogo = res.unidad_logo_resena;
                    
                    const displayName = res.es_anonimo ? 'ANÓNIMO' : \`\${profile.nombres} \${profile.apellidos}\`;

                    return (
                      <div key={res.id} className="p-6 bg-white dark:bg-black/40 rounded-3xl border-2 shadow-sm flex flex-col gap-4 transition-all hover:shadow-xl relative overflow-hidden group" style={{ borderColor: \`\${uColor}20\` }}>
                        
                        {/* Fondo decorativo con logo de la unidad */}
                        {uLogo && (
                          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                            <img src={uLogo} alt="" className="w-48 h-48 object-contain grayscale" />
                          </div>
                        )}

                        <div className="flex flex-col gap-1 relative z-10">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[0.85em] font-black tracking-widest" style={{ color: res.es_anonimo ? '#999' : uColor }}>
                              {displayName.toUpperCase()}
                            </span>
                            <span className="text-[0.8em] font-black opacity-40 tracking-widest uppercase"> — {unitLabel}</span>
                            {age > 0 && <span className="text-[0.8em] font-black opacity-40 tracking-widest uppercase"> — {age} AÑOS</span>}
                            <span className="text-[0.75em] font-bold opacity-30 tracking-widest ml-auto uppercase text-right"> — {format(new Date(res.created_at), 'dd/MM/yy')}</span>
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <div className="flex gap-1 items-center">
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                              <span key={n} className={\`text-xl \${res.calificacion >= n ? 'text-orange-500' : 'text-zinc-200'}\`}>★</span>
                            ))}
                            <span className="ml-2 text-[10px] font-black px-2 py-0.5 rounded-md border" style={{ color: uColor, borderColor: \`\${uColor}40\`, backgroundColor: \`\${uColor}10\` }}>
                              NOTA {res.calificacion}
                            </span>
                          </div>
                          
                          {res.comentario && (
                            <div className="relative">
                              <p className="text-[1em] italic opacity-95 leading-relaxed dark:text-clr1 font-medium bg-zinc-50/50 dark:bg-black/20 p-5 rounded-2xl border-l-[6px] shadow-inner" style={{ borderLeftColor: uColor }}>
                                "{res.comentario}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}`;

if (str.includes(oldRender)) {
  str = str.replace(oldRender, newRender);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update public review UI with unit identity snapshot successful');
} else {
  console.log('Old review UI string not found');
}
