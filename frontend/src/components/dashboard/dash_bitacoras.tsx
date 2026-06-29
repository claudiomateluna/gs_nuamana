'use client'

import Link from 'next/link'

interface DashBitacorasProps {
  articulos: any[]
  filter: string
  setFilter: (f: string) => void
  onDelete: (id: string) => void
  isAdmin: boolean
}

export default function DashBitacoras({ articulos, filter, setFilter, onDelete, isAdmin }: DashBitacorasProps) {
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
                filter === s ? 'bg-clr7 text-white shadow-md' : 'bg-zinc-100 dark:bg-black/20 text-clr2 opacity-60 hover:opacity-100'
              }`}
            >
              {s === 'revision' ? 'En Revisión' : s}
            </button>
          ))}
        </div>
        <Link 
          href="/blog/crear" 
          className="px-6 py-3 bg-clr7 text-white font-bold uppercase rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest text-[0.8em]"
        >
          🚀 Nuevo Articulo
        </Link>
      </div>

      <div className="grid gap-3">
        {filtered.map(art => (
          <div key={art.id} className="p-2 sm:p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl flex justify-between items-center group hover:bg-zinc-100 dark:hover:bg-black/20 transition-all border border-transparent hover:border-clr7/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-clr4 flex items-center justify-center shrink-0 shadow-sm">
                {art.imagen_destacada ? (
                  <img src={art.imagen_destacada} className="w-full h-full object-cover rounded-lg" alt="thumb" />
                ) : (
                  <span className="text-xl">📄</span>
                )}
              </div>
              <div>
                <p className="font-bold text-[0.9em] text-clr5 dark:text-clr1 uppercase truncate max-w-[200px] md:max-w-md">
                  {art.titulo}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`text-[0.8em] font-bold uppercase px-2 py-0.5 rounded-md ${
                    art.estado === 'publicado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {art.estado}
                  </span>
                  <span className="text-[0.8em] opacity-40 font-bold uppercase">
                    {new Date(art.created_at).toLocaleDateString()}
                  </span>
                  
                  {/* Acciones para Móvil */}
                  <div className="flex sm:hidden items-center gap-3 ml-1 border-l pl-3 border-zinc-200">
                    <Link href={`/blog/editar/${art.id}`} className="text-[0.8em] font-black text-clr6 uppercase underline">Editar</Link>
                    <button onClick={() => onDelete(art.id)} className="text-[0.8em] font-black text-red-600 uppercase underline">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Acciones para Desktop */}
            <div className="hidden sm:flex gap-2">
              <Link 
                href={`/blog/editar/${art.id}`} 
                className="p-2 bg-white dark:bg-clr4 rounded-lg shadow-sm border hover:bg-clr7 hover:text-white transition-all"
                title="Editar"
              >
                ✏️
              </Link>
              <button 
                onClick={() => onDelete(art.id)}
                className="p-2 bg-white dark:bg-clr4 rounded-lg shadow-sm border hover:bg-red-500 hover:text-white transition-all"
                title="Eliminar"
              >
                🗑️
              </button>
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
