'use client'

import { useState } from 'react'
import { getBitacoraName } from '@/lib/bitacora-utils'

interface DashModBitacoraVerProps {
  isOpen: boolean
  onClose: () => void
  bitacora: any
}

export default function DashModBitacoraVer({ isOpen, onClose, bitacora }: DashModBitacoraVerProps) {
  const [activeImg, setActiveImg] = useState(0)
  
  if (!isOpen || !bitacora) return null
  
  const unitName = getBitacoraName(bitacora.unidad_id)
  const images = bitacora.imagenes || []

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[120] flex items-center justify-center p-0 md:p-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-white dark:bg-clr5 w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Galería de Imágenes (Lado Izquierdo o Arriba) */}
        <div className="w-full md:w-3/5 h-[40vh] md:h-auto bg-black relative flex items-center justify-center group">
          {images.length > 0 ? (
            <>
              <img 
                src={images[activeImg]} 
                className="w-full h-full object-contain md:object-cover transition-all duration-500" 
                alt={bitacora.titulo} 
              />
              
              {/* Controles de Navegación */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImg(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 p-4 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❮
                  </button>
                  <button 
                    onClick={() => setActiveImg(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 p-4 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❯
                  </button>
                  
                  {/* Indicadores / Miniaturas */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                    {images.map((img: string, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveImg(i)}
                        className={`w-3 h-3 rounded-full cursor-pointer border border-white/50 transition-all ${i === activeImg ? 'bg-white scale-125 w-8' : 'bg-white/30'}`} 
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
              <span className="text-9xl">📖</span>
              <p className="font-display uppercase tracking-widest font-black mt-4">Sin fotografías</p>
            </div>
          )}
          <button onClick={onClose} className="absolute top-6 left-6 md:hidden text-white text-3xl drop-shadow-lg">✕</button>
        </div>

        {/* Contenido (Lado Derecho) */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col overflow-y-auto bg-white dark:bg-clr5">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="px-4 py-1 bg-clr7/10 text-clr7 rounded-full text-[0.8em] font-black uppercase tracking-widest border border-clr7/20">
                {unitName}
              </span>
              <p className="text-[0.8em] font-bold opacity-40 uppercase tracking-widest ml-1">
                {new Date(bitacora.fecha_suceso).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={onClose} className="hidden md:block text-2xl opacity-20 hover:opacity-100 transition-all">✕</button>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter text-clr5 dark:text-clr1 leading-tight mb-8">
            {bitacora.titulo}
          </h2>

          <div className="flex-1">
            <p className="text-lg md:text-xl font-body leading-relaxed text-clr2 dark:text-clr8 italic whitespace-pre-wrap">
              "{bitacora.historia}"
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-clr4 flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-clr4 rounded-full flex items-center justify-center text-lg font-black uppercase shadow-inner">
              {bitacora.autor?.nombres?.[0]}{bitacora.autor?.apellidos?.[0]}
            </div>
            <div>
              <p className="text-[0.8em] font-black uppercase opacity-40 tracking-widest leading-none mb-1">Relatado por</p>
              <p className="text-md font-bold text-clr5 dark:text-clr1 uppercase leading-none">
                {bitacora.autor?.nombres} {bitacora.autor?.apellidos}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
