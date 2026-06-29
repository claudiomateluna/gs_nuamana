'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getBitacoraName, getBitacoraDescription } from '@/lib/bitacora-utils'

interface DashTallyProps {
  perfil: any
  onNuevaEntrada: () => void
  onEditEntrada: (entrada: any) => void
  onVerEntrada: (entrada: any) => void
  onDelete: (id: string) => void
}

export default function DashTally({ perfil, onNuevaEntrada, onEditEntrada, onVerEntrada, onDelete }: DashTallyProps) {
  const [bitacoras, setBitacoras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const unitName = getBitacoraName(perfil?.unidad_id)
  const unitDesc = getBitacoraDescription(perfil?.unidad_id)
  const unitColor = perfil?.unidades?.colores?.primario || '#cb3327'

  const fetchBitacoras = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bitacoras_unidad')
        .select('*, autor:perfiles(nombres, apellidos)')
        .order('fecha_suceso', { ascending: false })
      
      if (error) throw error
      setBitacoras(data || [])
    } catch (err: any) {
      console.error('Error fetching bitacoras:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBitacoras()
  }, [perfil?.unidad_id])

  const canManage = (entrada: any) => {
    if (perfil?.rol_id === 1) return true // Admin
    return entrada.autor_id === perfil?.id
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Estilizado */}
      <div className="relative p-4 rounded-[2rem] overflow-hidden shadow-2xl group transition-all duration-500 hover:scale-[1.01]" 
           style={{ backgroundColor: unitColor }}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-4xl md:text-6xl font-black font-display uppercase text-white tracking-tighter leading-none drop-shadow-lg">
              {unitName}
            </h2>
            <p className="text-white/80 font-body italic text-lg md:text-xl font-medium max-w-xl">
              {unitDesc}
            </p>
          </div>
          
          <button 
            onClick={onNuevaEntrada}
            className="px-8 py-4 bg-white text-clr5 font-black font-display uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest text-sm"
            style={{ color: unitColor }}
          >
            ✍️ Nueva Historia
          </button>
        </div>
      </div>

      {/* Grid de Historias */}
      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-zinc-100 dark:bg-clr3 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bitacoras.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-clr3 rounded-[2.5rem] overflow-hidden shadow-lg border border-zinc-100 dark:border-clr4 flex flex-col group hover:shadow-2xl transition-all duration-500">
              {/* Imagen Destacada o Placeholder */}
              <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => onVerEntrada(entry)}>
                {entry.imagenes && entry.imagenes.length > 0 ? (
                  <img src={entry.imagenes[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={entry.titulo} />
                ) : (
                  <div className="w-full h-full bg-zinc-100 dark:bg-clr4 flex items-center justify-center opacity-40">
                    <span className="text-6xl">📖</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-[0.8em] font-black uppercase tracking-widest border border-white/20">
                    {new Date(entry.fecha_suceso).toLocaleDateString('es-CL', { month: 'long', day: 'numeric' })}
                  </span>
                </div>
                {entry.excluir_dirigentes && (
                  <div className="absolute top-4 right-4">
                    <span className="p-2 bg-clr7 text-white rounded-full shadow-lg" title="Solo NNJ">
                      🔒
                    </span>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl font-black font-display uppercase tracking-tight line-clamp-2 leading-tight dark:text-clr1 group-hover:text-clr7 transition-colors">
                    {entry.titulo}
                  </h3>
                  <p className="text-sm text-clr2 dark:text-clr8 line-clamp-3 leading-relaxed font-body italic">
                    {entry.historia}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-clr4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-200 dark:bg-clr4 rounded-full flex items-center justify-center text-[0.8em] font-black uppercase">
                      {entry.autor?.nombres?.[0]}{entry.autor?.apellidos?.[0]}
                    </div>
                    <span className="text-[0.8em] font-bold opacity-60 uppercase truncate max-w-[100px]">
                      {entry.autor?.nombres}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => onVerEntrada(entry)} className="p-2.5 bg-zinc-50 dark:bg-clr4 rounded-xl hover:bg-clr7 hover:text-white transition-all text-sm shadow-sm" title="Leer más">
                      📖
                    </button>
                    {canManage(entry) && (
                      <>
                        <button onClick={() => onEditEntrada(entry)} className="p-2.5 bg-zinc-50 dark:bg-clr4 rounded-xl hover:bg-clr6 hover:text-white transition-all text-sm shadow-sm" title="Editar">
                          ✏️
                        </button>
                        <button onClick={() => onDelete(entry.id)} className="p-2.5 bg-zinc-50 dark:bg-clr4 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm shadow-sm" title="Eliminar">
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {bitacoras.length === 0 && (
            <div className="col-span-full py-32 text-center border-4 border-dashed border-zinc-100 dark:border-clr4 rounded-[2rem] opacity-30">
              <span className="text-6xl block mb-4">🖋️</span>
              <p className="text-2xl font-black font-display uppercase tracking-widest italic">
                Aún no hay historias en el {unitName}
              </p>
              <p className="font-body text-lg">Sé el primero en contar una aventura.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
