'use client'

import { useState, useRef, useEffect } from 'react'
import { getBitacoraName } from '@/lib/bitacora-utils'

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

  const unitName = getBitacoraName(bitacora?.unidad_id)
  const images = bitacora?.imagenes || []

  // Reset image index when bitacora changes
  useEffect(() => {
    setActiveImg(0)
  }, [bitacora?.id])

  if (!isOpen || !bitacora) return null

  const goToPrev = () => setActiveImg(prev => (prev > 0 ? prev - 1 : images.length - 1))
  const goToNext = () => setActiveImg(prev => (prev < images.length - 1 ? prev + 1 : 0))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return
    const deltaX = e.touches[0].clientX - touchStartX.current
    const deltaY = e.touches[0].clientY - touchStartY.current
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwiping.current = true
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX < -SWIPE_THRESHOLD) goToNext()
    else if (deltaX > SWIPE_THRESHOLD) goToPrev()
    touchStartX.current = 0
    isSwiping.current = false
  }

  return (
    <div className="fixed inset-0 bg-pclr2/80 dark:bg-pdclr2/90 backdrop-blur-md z-[120] flex items-center justify-center p-0 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="bg-pclr1 dark:bg-pdclr1 border border-pclr13 dark:border-pdclr13 text-pclr4 dark:text-pdclr4 w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Galería de Imágenes (Lado Izquierdo o Arriba) */}
        <div 
          className="w-full md:w-3/5 h-[40vh] md:h-auto min-h-[280px] bg-pclr2 dark:bg-pdclr2 relative flex items-center justify-center group select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.length > 0 ? (
            <>
              <img 
                src={images[activeImg]} 
                className="w-full h-full object-contain md:object-cover transition-all duration-300" 
                alt={bitacora.titulo} 
              />
              
              {/* Controles de Navegación */}
              {images.length > 1 && (
                <>
                  <button 
                    type="button"
                    onClick={() => setActiveImg(prev => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 md:left-4 p-2.5 md:p-3 bg-pclr2/80 dark:bg-pdclr2/80 hover:bg-pclr2 text-pclr12 dark:text-pdclr12 rounded-full backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Anterior"
                  >
                    ❮
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveImg(prev => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 md:right-4 p-2.5 md:p-3 bg-pclr2/80 dark:bg-pdclr2/80 hover:bg-pclr2 text-pclr12 dark:text-pdclr12 rounded-full backdrop-blur-md opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Siguiente"
                  >
                    ❯
                  </button>
                  
                  {/* Indicadores */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                    {images.map((_: string, i: number) => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => setActiveImg(i)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          i === activeImg ? 'bg-pclr8 dark:bg-pdclr8 w-6' : 'bg-pclr1/60 dark:bg-pdclr1/60 w-2.5'
                        }`} 
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-pclr7 dark:text-pdclr7 py-12">
              <span className="text-8xl">📖</span>
              <p className="font-display uppercase tracking-widest font-black mt-4 text-sm text-pclr7 dark:text-pdclr7">
                Sin fotografías
              </p>
            </div>
          )}
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 left-4 md:hidden text-pclr12 dark:text-pdclr12 bg-pclr2/70 dark:bg-pdclr2/70 p-2 rounded-full text-xl leading-none drop-shadow-lg z-20"
          >
            ✕
          </button>
        </div>

        {/* Contenido (Lado Derecho) */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-pclr1 dark:bg-pdclr1">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-pclr3 dark:bg-pdclr3 text-pclr8 dark:text-pdclr8 font-bold rounded-full text-[0.8em] uppercase tracking-wider border border-pclr13 dark:border-pdclr13">
                  {unitName}
                </span>
                <p className="text-[0.8em] font-medium text-pclr7 dark:text-pdclr7 uppercase tracking-wider ml-1 mt-1">
                  {new Date(bitacora.fecha_suceso).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button 
                type="button"
                onClick={onClose} 
                className="hidden md:block text-pclr7 dark:text-pdclr7 hover:text-pclr4 dark:hover:text-pdclr4 text-2xl transition-all"
              >
                ✕
              </button>
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight text-pclr4 dark:text-pdclr4 leading-tight mb-4">
              {bitacora.titulo}
            </h2>

            <div className="text-base font-body leading-relaxed text-pclr4 dark:text-pdclr4 italic whitespace-pre-wrap">
              "{bitacora.historia}"
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-pclr13 dark:border-pdclr13 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pclr3 dark:bg-pdclr3 text-pclr4 dark:text-pdclr4 rounded-full flex items-center justify-center text-sm font-black uppercase border border-pclr13 dark:border-pdclr13">
                {bitacora.autor?.nombres?.[0]}{bitacora.autor?.apellidos?.[0]}
              </div>
              <div>
                <p className="text-[0.75em] font-bold uppercase tracking-wider text-pclr7 dark:text-pdclr7 leading-none mb-1">
                  Relatado por
                </p>
                <p className="text-sm font-bold text-pclr4 dark:text-pdclr4 uppercase leading-none">
                  {bitacora.autor?.nombres} {bitacora.autor?.apellidos}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-pclr13 dark:border-pdclr13 rounded-lg text-pclr4 dark:text-pdclr4 hover:bg-pclr3 dark:hover:bg-pdclr3 text-[0.85em] font-medium transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
