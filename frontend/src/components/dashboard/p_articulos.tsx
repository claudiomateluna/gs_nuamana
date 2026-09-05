'use client'

import Link from 'next/link'

interface DashBitacorasProps {
  articulos: any[]
  filter: string
  setFilter: (f: string) => void
  onDelete: (id: string) => void
  isAdmin: boolean
  inactive?: boolean
}

export default function DashBitacoras({ articulos, filter, setFilter, onDelete, isAdmin, inactive }: DashBitacorasProps) {
  const filtered = articulos.filter(a => filter === 'todos' || a.estado === filter)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[1em]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['todos', 'publicado', 'borrador', 'revision'].map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`px-4 py-1 rounded-xl text-[0.9em] uppercase tracking-wider transition-all ${
                filter === s ? 'bg-pclr10 text-pclr12 shadow-md' : 'bg-pclr3 dark:bg-pdclr3 text-pclr7 opacity-60 hover:opacity-100'
              }`}
            >
              {s === 'revision' ? 'En Revisión' : s}
            </button>
          ))}
        </div>
        {!inactive && (
          <Link 
            href="/blog/crear" 
            className="px-6 py-3 bg-pclr10 text-pclr12 font-bold uppercase rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest text-[0.8em]"
          >
            🚀 Nuevo Articulo
          </Link>
        )}
      </div>

      <div className="grid gap-3">
        {filtered.map(art => (
          <div key={art.id} className="p-2 sm:p-4 bg-pclr3 dark:bg-pdclr3 rounded-2xl flex justify-between items-center group hover:bg-pclr3 dark:hover:bg-pdclr1 transition-all border border-transparent hover:border-pclr14">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-pclr1 dark:bg-pdclr1 flex items-center justify-center shrink-0 shadow-sm">
                {art.imagen_destacada ? (
                  <img src={art.imagen_destacada} className="w-full h-full object-cover rounded-lg" alt="thumb" />
                ) : (
                  <span className="text-xl">📄</span>
                )}
              </div>
              <div>
                <p className="font-bold text-[0.9em] text-pclr4 dark:text-pdclr4 uppercase truncate max-w-[200px] md:max-w-md">
                  {art.titulo}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`text-[0.8em] font-bold uppercase px-2 py-0.5 rounded-md ${
                    art.estado === 'publicado' ? 'bg-pclr6 text-pclr12 dark:bg-pdclr6 dark:text-pdclr12' : 'bg-pclr5 text-pclr12 dark:bg-pdclr5 dark:text-pdclr12'
                  }`}>
                    {art.estado}
                  </span>
                  <span className="text-[0.8em] opacity-40 font-bold uppercase">
                    {new Date(art.created_at).toLocaleDateString()}
                  </span>
                  
                  {/* Acciones para Móvil */}
                  <div className="flex sm:hidden items-center gap-3 ml-1 border-l pl-3 border-pclr13">
                    {!inactive && (
                      <>
                        <Link href={`/blog/editar/${art.id}`} className="text-[0.8em] font-black text-pclr6 uppercase underline">Editar</Link>
                        <button onClick={() => onDelete(art.id)} className="text-[0.8em] font-black text-pclr4 uppercase underline">Eliminar</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Acciones para Desktop */}
            <div className="hidden sm:flex gap-2">
              {!inactive && (
                <>
                  <Link 
                    href={`/blog/editar/${art.id}`} 
                    className="p-2 bg-pclr1 dark:bg-pdclr1 rounded-lg shadow-sm border hover:bg-pclr10 hover:text-pclr12 transition-all"
                    title="Editar"
                  >
                    ✏️
                  </Link>
                  <button 
                    onClick={() => onDelete(art.id)}
                    className="p-2 bg-pclr1 dark:bg-pdclr1 rounded-lg shadow-sm border hover:bg-pclr10 hover:text-pclr12 transition-all"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed rounded-[3rem] opacity-40">
            <p className="italic uppercase tracking-widest text-[0.8em]">No se encontraron artículos con este filtro.</p>
          </div>
        )}
      </div>
    </div>
  )
}
