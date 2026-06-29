'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashModVincularJuegoProps {
  isOpen: boolean
  onClose: () => void
  cicloActivo: any
  onSuccess: () => void
}

export default function DashModVincularJuego({ isOpen, onClose, cicloActivo, onSuccess }: DashModVincularJuegoProps) {
  const [juegos, setJuegos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedJuegoId, setSelectedJuegoId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchJuegos()
      setSelectedJuegoId(cicloActivo.articulo_juego_id || null)
    }
  }, [isOpen])

  const fetchJuegos = async () => {
    setLoading(true)
    try {
      // Obtener el ID de la categoría "Juegos Democráticos" (es el ID 8 según la base de datos)
      // Primero, buscamos los artículos que tengan esta categoría
      const { data: relaciones } = await supabase
        .from('articulo_categorias')
        .select('articulo_id')
        .eq('categoria_id', 8) // ID de Juegos Democráticos
        
      if (relaciones && relaciones.length > 0) {
        const articleIds = relaciones.map(r => r.articulo_id)
        
        // Luego buscamos los detalles de esos artículos
        const { data: arts } = await supabase
          .from('articulos')
          .select('id, titulo, extracto, imagen_destacada')
          .in('id', articleIds)
          .eq('estado', 'publicado')
          .order('created_at', { ascending: false })
          
        setJuegos(arts || [])
      } else {
        setJuegos([])
      }
    } catch (err) {
      console.error('Error fetching juegos democráticos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVincular = async () => {
    if (!selectedJuegoId) return alert('Selecciona un juego democrático de la lista.')
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('ciclos_unidad')
        .update({ articulo_juego_id: selectedJuegoId })
        .eq('id', cicloActivo.id)
        
      if (error) throw error
      onSuccess()
      onClose()
    } catch (err: any) {
      alert('Error al vincular: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDesvincular = async () => {
    if (!confirm('¿Seguro que deseas desvincular el juego actual?')) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('ciclos_unidad')
        .update({ articulo_juego_id: null })
        .eq('id', cicloActivo.id)
        
      if (error) throw error
      setSelectedJuegoId(null)
      onSuccess()
    } catch (err: any) {
      alert('Error al desvincular: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[130] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-clr5 w-full max-w-4xl rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-8 border-b dark:border-clr4 pb-4">
          <div>
            <h2 className="text-3xl font-black font-display uppercase text-clr6 tracking-tighter">
              🗳️ Vincular Juego Democrático
            </h2>
            <p className="text-sm opacity-60 font-medium italic mt-2">
              Selecciona una dinámica de la biblioteca para guiar la votación de propuestas.
            </p>
          </div>
          <button onClick={onClose} className="text-2xl opacity-40 hover:opacity-100 transition-all">✕</button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
              ¿No encuentras el juego ideal?
            </p>
            <a 
              href="/blog/crear" 
              target="_blank"
              className="px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase rounded-xl hover:bg-blue-700 transition-all shadow-md tracking-widest"
            >
              ✍️ Redactar Nuevo Juego
            </a>
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse uppercase tracking-widest text-[0.8em]">Buscando dinámicas...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {juegos.length > 0 ? (
                juegos.map(juego => (
                  <div 
                    key={juego.id}
                    onClick={() => setSelectedJuegoId(juego.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                      selectedJuegoId === juego.id 
                        ? 'border-clr6 bg-clr6/5 shadow-md scale-[1.02]' 
                        : 'border-zinc-100 dark:border-clr4 bg-zinc-50 dark:bg-black/10 hover:border-clr6/30'
                    }`}
                  >
                    <div className="flex gap-4">
                      {juego.imagen_destacada ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={juego.imagen_destacada} className="w-full h-full object-cover" alt={juego.titulo} />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-clr4 flex items-center justify-center shrink-0">
                          <span className="text-2xl">🎲</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-black uppercase text-sm leading-tight text-clr5 dark:text-clr1">{juego.titulo}</h4>
                        <p className="text-[0.8em] opacity-60 italic line-clamp-2 mt-1">{juego.extracto}</p>
                      </div>
                    </div>
                    {selectedJuegoId === juego.id && (
                      <div className="text-center mt-2">
                        <span className="px-3 py-1 bg-clr6 text-white text-[9px] font-black uppercase rounded-full tracking-widest shadow-sm">
                          Seleccionado
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-20 text-center border-4 border-dashed rounded-[2rem] opacity-30">
                  <span className="text-5xl block mb-4">📚</span>
                  <p className="text-xl font-black uppercase">No hay juegos democráticos en la biblioteca</p>
                  <p className="font-medium italic">Debes crear uno primero en el módulo de Artículos.</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t dark:border-clr4">
            <button 
              type="button" 
              onClick={handleVincular}
              disabled={saving || !selectedJuegoId || selectedJuegoId === cicloActivo.articulo_juego_id}
              className="flex-1 py-5 bg-clr6 text-white font-black font-display uppercase rounded-[1.5rem] shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest disabled:opacity-50"
            >
              {saving ? '⌛ Guardando...' : '🔗 Vincular al Ciclo'}
            </button>
            {cicloActivo.articulo_juego_id && (
              <button 
                type="button" 
                onClick={handleDesvincular}
                disabled={saving}
                className="px-6 py-5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-sm disabled:opacity-50"
                title="Desvincular juego actual"
              >
                🗑️
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-5 bg-zinc-100 dark:bg-clr4 text-clr2 rounded-[1.5rem] font-bold uppercase tracking-widest"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
