'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { getBitacoraName } from '@/lib/bitacora-utils'
import type { Bitacora } from '@/types'

interface DashModBitacoraVerProps {
  isOpen: boolean
  onClose: () => void
  bitacora: any
}

const SWIPE_THRESHOLD = 50

export default function DashModBitacoraVer({ isOpen, onClose, bitacora }: DashModBitacoraVerProps) {
  const [activeImg, setActiveImg] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isSwiping = useRef(false)
  
  if (!isOpen || !bitacora) return null
  
  const unitName = getBitacoraName(bitacora.unidad_id)
  const images = bitacora.imagenes || []

  const goToPrev = () => setActiveImg(prev => (prev > 0 ? prev - 1 : images.length - 1))
  const goToNext = () => setActiveImg(prev => (prev < images.length - 1 ? prev + 1 : 0))

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current) return
    const deltaX = e.touches[0].clientX - touchStartX.current
    const deltaY = e.touches[0].clientY - touchStartY.current
    // Si el movimiento horizontal es mayor que el vertical, es un swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwiping.current = true
      e.preventDefault()
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX < -SWIPE_THRESHOLD) goToNext()
    else if (deltaX > SWIPE_THRESHOLD) goToPrev()
    touchStartX.current = 0
    isSwiping.current = false
  }, [images.length])

  // Reset image index when bitacora changes
  useEffect(() => {
    setActiveImg(0)
  }, [bitacora?.id])

  return (
    <div className="fixed inset-0 bg-pclr2 backdrop-blur-xl z-[120] flex items-center justify-center p-0 md:p-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-pclr1 dark:bg-pdclr1 w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Galería de Imágenes (Lado Izquierdo o Arriba) */}
        <div 
          className="w-full md:w-3/5 h-[40vh] md:h-auto bg-pclr2 relative flex items-center justify-center group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
                    className="absolute left-2 md:left-4 p-3 md:p-4 bg-pclr2/80 hover:bg-pclr2 text-pclr12 rounded-full backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                  >
                    ❮
                  </button>
                  <button 
                    onClick={() => setActiveImg(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 md:right-4 p-3 md:p-4 bg-pclr2/80 hover:bg-pclr2 text-pclr12 rounded-full backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                  >
                    ❯
                  </button>
                  
                  {/* Indicadores / Miniaturas */}
                  <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                    {images.map((img: string, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => setActiveImg(i)}
                        className={`w-4 h-4 md:w-3 md:h-3 rounded-full cursor-pointer border border-pclr1 transition-all ${i === activeImg ? 'bg-pclr1 scale-125 w-8 md:w-8' : 'bg-pclr1/50'}`} 
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-pclr12">
              <span className="text-9xl">📖</span>
              <p className="font-display uppercase tracking-widest font-black mt-4">Sin fotografías</p>
            </div>
          )}
          <button onClick={onClose} className="absolute top-6 left-6 md:hidden text-pclr12 text-3xl drop-shadow-lg">✕</button>
        </div>

        {/* Contenido (Lado Derecho) */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col overflow-y-auto bg-pclr1 dark:bg-pdclr1">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="px-4 py-1 bg-pclr10 text-pclr4 rounded-full text-[0.8em] font-black uppercase tracking-widest border border-pclr14">
                {unitName}
              </span>
              <p className="text-[0.8em] font-bold opacity-40 uppercase tracking-widest ml-1">
                {new Date(bitacora.fecha_suceso).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={onClose} className="hidden md:block text-2xl opacity-20 hover:opacity-100 transition-all">✕</button>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tighter text-pclr4 dark:text-pdclr4 leading-tight mb-8">
            {bitacora.titulo}
          </h2>

          <div className="flex-1">
            <p className="text-lg md:text-xl font-body leading-relaxed text-pclr7 dark:text-pdclr7 italic whitespace-pre-wrap">
              "{bitacora.historia}"
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-pclr13 dark:border-pdclr13 flex items-center gap-4">
            <div className="w-12 h-12 bg-pclr3 dark:bg-pdclr3 rounded-full flex items-center justify-center text-lg font-black uppercase shadow-inner">
              {bitacora.autor?.nombres?.[0]}{bitacora.autor?.apellidos?.[0]}
            </div>
            <div>
              <p className="text-[0.8em] font-black uppercase opacity-40 tracking-widest leading-none mb-1">Relatado por</p>
              <p className="text-md font-bold text-pclr4 dark:text-pdclr4 uppercase leading-none">
                {bitacora.autor?.nombres} {bitacora.autor?.apellidos}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
