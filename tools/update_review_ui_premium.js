const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const startTag = '{articulo.articulo_resenas.map((res: any) => {';
const endTag = '})}'; // This is a bit risky if there are multiple maps, but I'll use the context.

// Extract the whole section between the map and the return end
const targetRegex = /\{articulo\.articulo_resenas\.map\(\(res: any\) => \{[\s\S]*?\}\)\}/;

const newRender = `{articulo.articulo_resenas.map((res: any) => {
                    const profile = res.perfiles || {};
                    // Usamos los datos históricos capturados en la reseña
                    const unitLabel = res.unidad_resena || 'Scout';
                    const age = res.edad_resena || 0;
                    const uColor = res.unidad_color_resena || '#cb3327';
                    const uLogo = res.unidad_logo_resena;
                    
                    const displayName = res.es_anonimo ? 'ANÓNIMO' : \`\${profile.nombres} \${profile.apellidos}\`;

                    return (
                      <div key={res.id} className="p-6 bg-white dark:bg-black/40 rounded-[2.5rem] border-2 shadow-sm flex flex-col gap-5 transition-all hover:shadow-2xl relative overflow-hidden group" style={{ borderColor: \`\${uColor}30\` }}>
                        
                        {/* Fondo decorativo con logo de la unidad (Snapshot) */}
                        {uLogo && (
                          <div className="absolute -right-8 -bottom-8 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110 group-hover:-rotate-12">
                            <img src={uLogo} alt="" className="w-56 h-56 object-contain grayscale" />
                          </div>
                        )}

                        <div className="flex flex-col gap-1 relative z-10 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[1em] font-black tracking-[0.1em]" style={{ color: res.es_anonimo ? '#666' : uColor }}>
                              {displayName.toUpperCase()}
                            </span>
                            <div className="flex items-center gap-2 text-[0.8em] font-black opacity-40 tracking-widest uppercase">
                              <span>— {unitLabel}</span>
                              {age > 0 && <span>— {age} AÑOS</span>}
                            </div>
                            <span className="text-[0.75em] font-bold opacity-30 tracking-widest ml-auto uppercase">
                              {format(new Date(res.created_at), 'dd/MM/yy')}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                          <div className="flex gap-1.5 items-center">
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                              <span key={n} className={\`text-2xl transition-all \${res.calificacion >= n ? 'text-orange-500 drop-shadow-sm' : 'text-zinc-100'}\`}>★</span>
                            ))}
                            <span className="ml-3 text-[11px] font-black px-3 py-1 rounded-full border shadow-inner" style={{ color: uColor, borderColor: \`\${uColor}40\`, backgroundColor: \`\${uColor}10\` }}>
                              NOTA {res.calificacion}
                            </span>
                          </div>
                          
                          {res.comentario && (
                            <div className="relative mt-2">
                              <p className="text-[1.05em] italic opacity-95 leading-relaxed dark:text-clr1 font-medium bg-zinc-50/50 dark:bg-black/30 p-6 rounded-[1.5rem] border-l-[8px] shadow-sm" style={{ borderLeftColor: uColor }}>
                                "{res.comentario}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}`;

if (targetRegex.test(str)) {
  str = str.replace(targetRegex, newRender);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update public review UI with unit identity snapshot and premium style successful');
} else {
  console.log('Target regex not found');
}
