const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldRender = `{articulo.articulo_resenas.map((res: any) => (
                    <div key={res.id} className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-zinc-100 dark:border-clr4 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center font-black text-orange-600 text-sm">
                            {res.perfiles?.nombres[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold uppercase text-clr5 dark:text-clr1">{res.perfiles?.nombres} {res.perfiles?.apellidos}</p>
                            <p className="text-[10px] font-black uppercase opacity-40">{format(new Date(res.created_at), 'dd MMM yyyy', { locale: es })}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-orange-500 text-white rounded-lg font-black text-sm shadow-sm">
                          {res.calificacion}
                        </div>
                      </div>
                      {res.comentario && (
                        <p className="text-sm italic opacity-80 leading-relaxed dark:text-clr2">"{res.comentario}"</p>
                      )}
                    </div>
                  ))}`;

const newRender = `{articulo.articulo_resenas.map((res: any) => {
                    const profile = res.perfiles || {};
                    const unitName = profile.unidades?.nombre || 'Independiente';
                    const birthDate = profile.fecha_nacimiento ? new Date(profile.fecha_nacimiento) : null;
                    let age = 0;
                    if (birthDate) {
                      const today = new Date();
                      age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                    }
                    
                    const displayName = res.es_anonimo ? 'ANÓNIMO' : \`\${profile.nombres} \${profile.apellidos}\`;
                    const avatarInit = res.es_anonimo ? '?' : (profile.nombres?.[0] || 'S');

                    return (
                      <div key={res.id} className="p-6 bg-white dark:bg-black/40 rounded-2xl border border-zinc-100 dark:border-clr4 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md relative overflow-hidden group">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={\`text-[0.75em] font-black tracking-widest \${res.es_anonimo ? 'text-zinc-400' : 'text-orange-600'}\`}>
                              {displayName}
                            </span>
                            <span className="text-[0.75em] font-bold opacity-30 tracking-widest"> — {unitName.toUpperCase()}</span>
                            {age > 0 && <span className="text-[0.75em] font-bold opacity-30 tracking-widest"> — {age} AÑOS</span>}
                            <span className="text-[0.75em] font-bold opacity-30 tracking-widest ml-auto"> — {format(new Date(res.created_at), 'dd/MM/yy')}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7].map(n => (
                              <span key={n} className={\`text-lg \${res.calificacion >= n ? 'text-orange-500' : 'text-zinc-200'}\`}>★</span>
                            ))}
                          </div>
                          
                          {res.comentario && (
                            <p className="text-sm italic opacity-90 leading-relaxed dark:text-clr1 font-medium bg-zinc-50 dark:bg-black/20 p-4 rounded-xl border-l-4 border-orange-500/30">
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
  console.log('Update public review UI successful');
} else {
  console.log('Old review UI string not found');
}
