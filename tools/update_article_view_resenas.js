const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldImport = `import { supabase } from '@/lib/supabase'`;
const newImport = `import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'`;

const targetStr = `{articulo.etiquetas?.length > 0 &&`;

const insertion = `
            {/* SECCIÓN DE RESEÑAS SCOUTS */}
            {articulo.articulo_resenas && articulo.articulo_resenas.length > 0 && (
              <div className="p-8 bg-zinc-50 dark:bg-black/20 rounded-[2rem] border-2 border-zinc-100 dark:border-clr4 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⭐</span>
                    <h3 className="text-xl font-display font-bold text-clr5 dark:text-white uppercase my-0">Reseñas de la Actividad</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-orange-500">
                      {(articulo.articulo_resenas.reduce((acc: number, r: any) => acc + r.calificacion, 0) / articulo.articulo_resenas.length).toFixed(1)}
                    </span>
                    <span className="text-[10px] font-black uppercase opacity-40 leading-tight">Nota<br/>Media</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articulo.articulo_resenas.map((res: any) => (
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
                  ))}
                </div>
              </div>
            )}`;

if (!str.includes("from 'date-fns'")) {
  str = str.replace(oldImport, newImport);
}

str = str.replace(targetStr, insertion + '\n            ' + targetStr);

fs.writeFileSync(file, str, 'utf8');
console.log('Update public view with resenas');
