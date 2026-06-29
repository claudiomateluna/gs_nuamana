'use client'

import { useState } from 'react'

interface DashInventarioProps {
  items: any[]
  isAdmin: boolean
  onEdit: (item: any) => void
  onDelete: (id: string) => void
  onNuevo: () => void
}

export default function DashInventario({ items, isAdmin, onEdit, onDelete, onNuevo }: DashInventarioProps) {
  const [filter, setFilter] = useState('todos')
  const [catFilter, setCatFilter] = useState('todas')
  const [viewingImages, setViewingImages] = useState<string[] | null>(null)

  const filtered = items.filter(i => {
    const matchEstado = filter === 'todos' || i.estado === filter
    const matchCat = catFilter === 'todas' || i.categoria === catFilter
    return matchEstado && matchCat
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Disponible': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'En Uso': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'En Reparación': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'Baja/Perdido': return 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
      default: return 'bg-zinc-100 text-zinc-600'
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[1em]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-2xl font-black font-display uppercase font-bold text-clr5 dark:text-clr1">Inventario de Materiales</h2>
        {isAdmin && (
          <button onClick={onNuevo} className="px-6 py-3 bg-clr6 text-white uppercase rounded-xl text-[0.8em] font-inika font-bold tracking-widest shadow-lg hover:brightness-110 transition-all">
            ➕ Nuevo Artículo
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-clr3 border dark:border-clr4 text-clr2 font-bold uppercase text-[0.8em] outline-none">
          <option value="todas">Todas las Categorías</option>
          {['Camping', 'Cocina', 'Material Didáctico', 'Herramientas', 'Uniformes/Mística', 'Alimentos', 'Otros'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1">
          {['todos', 'Disponible', 'En Uso', 'En Reparación', 'Baja/Perdido'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-[0.8em] uppercase font-bold tracking-widest transition-all ${filter === s ? 'bg-clr7 text-white shadow-md' : 'bg-zinc-100 dark:bg-black/20 text-clr2 opacity-60 hover:opacity-100'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => {
          const images = item.imagenes || []
          return (
            <div key={item.id} className="bg-white dark:bg-black/20 rounded-[2.5rem] border border-zinc-100 dark:border-clr4 shadow-sm hover:shadow-2xl transition-all relative group overflow-hidden flex flex-col">
              
              {/* Imagen de Cabecera */}
              <div className="relative h-48 bg-zinc-100 dark:bg-clr4 overflow-hidden">
                {images.length > 0 ? (
                  <img 
                    src={images[0]} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-700" 
                    alt={item.nombre}
                    onClick={() => setViewingImages(images)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                    <span className="text-5xl">📦</span>
                    <p className="text-[0.8em] font-black uppercase mt-2">Sin registro visual</p>
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full font-black text-[0.8em] uppercase tracking-widest shadow-lg ${getEstadoColor(item.estado)}`}>
                  {item.estado}
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-full text-[0.8em] font-black uppercase border border-white/20">
                    +{images.length - 1} fotos
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[0.8em] font-black text-clr6 uppercase tracking-tighter mb-1">{item.categoria} {item.unidad_id ? `• ${item.unidades?.nombre}` : '• ⚜️ GRUPAL'}</p>
                      <h3 className="text-xl font-bold uppercase leading-tight text-clr5 dark:text-clr1">{item.nombre}</h3>
                    </div>
                    <span className="text-2xl font-black opacity-20">x{item.cantidad}</span>
                  </div>

                  <div className="text-[0.8em] space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-clr3 rounded-full font-bold uppercase text-[0.8em] opacity-70 border dark:border-clr4">✨ {item.condicion}</span>
                      {item.tiene_garantia && <span className="px-3 py-1 bg-clr6/10 text-clr6 border border-clr6/20 rounded-full font-bold uppercase text-[0.8em]">🛡️ Garantía</span>}
                    </div>
                    <div className="space-y-1 pl-1">
                      <p className="opacity-60 font-bold uppercase flex items-center gap-2">📍 <span className="truncate">{item.ubicacion || 'Sin ubicación'}</span></p>
                      {item.origen && <p className="opacity-60 font-bold uppercase flex items-center gap-2">📦 <span>{item.origen} {item.fecha_adquisicion && `(${new Date(item.fecha_adquisicion).getFullYear()})`}</span></p>}
                      {item.fecha_caducidad && (
                        <p className={`font-bold uppercase ${new Date(item.fecha_caducidad) < new Date() ? 'text-red-600' : 'text-clr7'}`}>
                          ⌛ Caduca: {new Date(item.fecha_caducidad).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.descripcion && <p className="text-[0.85em] italic opacity-50 line-clamp-2 leading-relaxed pl-1">{item.descripcion}</p>}
                </div>

                {isAdmin && (
                  <div className="flex gap-2 pt-4 border-t border-zinc-50 dark:border-clr4/50">
                    <button onClick={() => onEdit(item)} className="flex-1 py-3 bg-zinc-50 dark:bg-clr4 rounded-xl text-[0.8em] font-black uppercase hover:bg-clr6 hover:text-white transition-all shadow-sm">Editar</button>
                    <button onClick={() => onDelete(item.id)} className="px-4 py-3 bg-zinc-50 dark:bg-clr4 rounded-xl text-[0.8em] hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑️</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Galería Simple */}
      {viewingImages && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <button onClick={() => setViewingImages(null)} className="absolute top-8 right-8 text-white text-4xl opacity-50 hover:opacity-100 transition-all">✕</button>
          <div className="w-full max-w-5xl h-[70vh] flex overflow-x-auto gap-4 snap-x scrollbar-hide">
            {viewingImages.map((img, idx) => (
              <img key={idx} src={img} className="h-full object-contain snap-center" alt="full-view" />
            ))}
          </div>
          <p className="text-white/40 mt-8 font-black uppercase tracking-widest text-xs">Desliza para ver más fotos ({viewingImages.length})</p>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-32 text-center border-4 border-dashed border-zinc-100 dark:border-clr4 rounded-[3rem] opacity-30">
          <span className="text-6xl block mb-4">📦</span>
          <p className="text-2xl font-black font-display uppercase tracking-widest italic">No hay materiales encontrados</p>
        </div>
      )}
    </div>
  )
}
