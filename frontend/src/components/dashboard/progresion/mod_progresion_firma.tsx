'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { toast } from 'sonner';

interface DashModFirmaDigitalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: (signatureB64: string) => void
}

export default function DashModFirmaDigital({
  isOpen,
  onClose,
  title,
  description,
  onConfirm
}: DashModFirmaDigitalProps) {
  const sigCanvasRef = useRef<SignatureCanvas>(null)
  const [tempSignature, setTempSignature] = useState<string | null>(null)

  if (!isOpen) return null

  const handleClear = () => {
    sigCanvasRef.current?.clear()
    setTempSignature(null)
  }

  const handleConfirm = () => {
    if (!tempSignature) {
      toast.warning('Por favor dibuja tu firma antes de confirmar.')
      return
    }
    onConfirm(tempSignature)
    setTempSignature(null)
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-pclr2 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-pclr1 dark:bg-pdclr1 p-6 rounded-[2.5rem] border border-pclr13 dark:border-pdclr13 w-full max-w-md shadow-2xl relative font-body">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-pclr7 hover:text-pclr4 dark:hover:text-pclr12 font-extrabold text-[1.1em] cursor-pointer border-none bg-transparent"
        >
          ✕
        </button>
        
        <h3 className="text-[1.25em] font-black text-pclr4 dark:text-pdclr4 uppercase tracking-tighter mb-4 text-center border-b pb-2 font-display">
          {title}
        </h3>
        
        <p className="text-[0.85em] text-pclr7 mb-4 text-center">
          {description}
        </p>

        <div className="border-4 border-dashed border-pclr13 dark:border-pdclr13 rounded-[1.5rem] bg-pclr1 overflow-hidden shadow-inner touch-none relative">
          <SignatureCanvas 
            ref={sigCanvasRef}
            penColor='#1b1b1b'
            minWidth={1.8}
            maxWidth={3.5}
            canvasProps={{
              className: 'signature-canvas w-full h-[200px] cursor-crosshair'
            }}
            onEnd={() => {
              if (sigCanvasRef.current) {
                setTempSignature(sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'))
              }
            }}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-[0.8em] font-black uppercase text-pclr4 hover:bg-pclr10 dark:hover:bg-dclr4 rounded-xl transition-colors border border-pclr14 cursor-pointer bg-transparent"
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-pclr6 hover:brightness-110 text-pclr12 rounded-xl text-[0.8em] font-black uppercase tracking-wider transition-all shadow-md cursor-pointer border-none"
          >
            Confirmar Firma
          </button>
        </div>
      </div>
    </div>
  )
}
