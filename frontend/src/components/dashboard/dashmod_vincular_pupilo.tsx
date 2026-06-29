'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModVincularPupiloProps {
  isOpen: boolean
  onClose: () => void
  perfil: any
  onSuccess: () => void
}

export default function DashModVincularPupilo({ isOpen, onClose, perfil, onSuccess }: DashModVincularPupiloProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [resultados, setResultados] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [vinculando, setVincular] = useState<string | null>(null)

  useEffect(() => {
    const searchNNJ = async () => {
      if (searchTerm.length < 3) {
        setResultados([])
        return
      }
      setLoading(true)
      const { data, error } = await supabase
        .from('perfiles')
        .select('id, nombres, apellidos, rut, roles(name), unidades(nombre)')
        .in('rol_id', [9, 10, 11, 12, 13])
        .or(`nombres.ilike.%${searchTerm}%,apellidos.ilike.%${searchTerm}%,rut.ilike.%${searchTerm}%`)
        .limit(10)
      
      setResultados(data || [])
      setLoading(false)
    }

    const timer = setTimeout(searchNNJ, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleVincular = async (targetId: string) => {
    setVincular(targetId)
    const { error } = await supabase
      .from('perfiles')
      .update({ apoderado_id: perfil.id })
      .eq('id', targetId)
    
    if (error) {
      alert('Error al vincular: ' + error.message)
    } else {
      alert('¡Vínculo establecido con éxito!')
      onSuccess()
      onClose()
    }
    setVincular(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-md rounded-[2rem] p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-black font-display uppercase text-clr7 tracking-tighter">Vincular Pupilo Existente</h2>
          <button onClick={onClose} className="text-clr2 hover:text-clr7 transition-colors font-bold text-xl">✕</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[1em] font-black uppercase text-clr2 tracking-widest ml-4">Buscar por Nombre o RUT</label>
            <input 
              type="text" 
              placeholder="Ej: Juan Perez o 12.345.678-9"
              className="w-full p-4 rounded-2xl border bg-zinc-50 dark:bg-black/20 font-bold outline-none focus:border-clr7 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {loading && <p className="text-center italic opacity-40 py-4">Buscando rastros...</p>}
            
            {!loading && resultados.map(r => (
              <div key={r.id} className="p-4 bg-zinc-50 dark:bg-black/10 rounded-2xl border border-zinc-100 dark:border-clr4 flex justify-between items-center group hover:border-clr7/50 transition-all">
                <div>
                  <p className="text-[1em] font-black uppercase">{r.nombres} {r.apellidos}</p>
                  <p className="text-[0.9em] opacity-70 font-bold uppercase tracking-wider mt-1">{r.unidades?.nombre || 'Sin Unidad'} • {r.roles?.name}</p>
                  <p className="text-[0.9em] font-black opacity-60 tracking-widest">RUT: {r.rut}</p>
                </div>
                <button 
                  onClick={() => handleVincular(r.id)}
                  disabled={vinculando !== null}
                  className="px-4 py-2 bg-clr7 text-white text-[1em] font-black uppercase rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  {vinculando === r.id ? '⌛' : 'Vincular'}
                </button>
              </div>
            ))}

            {!loading && searchTerm.length >= 3 && resultados.length === 0 && (
              <p className="text-center text-lg italic opacity-40 py-4">No se encontró a nadie con ese nombre o RUT.</p>
            )}

            {searchTerm.length < 3 && (
              <p className="text-center text-[1em] uppercase font-black opacity-40 py-8 tracking-[0.2em]">Escribe al menos 3 caracteres para buscar</p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-clr4">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-zinc-100 dark:bg-black/20 text-clr2 font-black uppercase rounded-2xl tracking-widest text-[0.9em] hover:bg-clr7 hover:text-clr1 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
