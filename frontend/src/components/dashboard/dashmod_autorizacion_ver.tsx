'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateOfficialPDF } from '@/lib/pdf-service'

interface DashModAutorizacionVerProps {
  isOpen: boolean
  onClose: () => void
  auth: any
  perfil: any
  onDelete?: () => void
}

export default function DashModAutorizacionVer({ isOpen, onClose, auth, perfil: perfilProp, onDelete }: DashModAutorizacionVerProps) {
  const [fichaMedica, setFichaMedica] = useState<any>(null)
  const [perfil, setPerfil] = useState<any>(perfilProp)
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!isOpen || !perfilProp || !auth) return
    
    const loadDataAndPdf = async () => {
      setLoading(true)
      try {
        // 1. Obtener datos completos de Supabase
        const { data: pData } = await supabase
          .from('perfiles')
          .select('*, unidades(*), contactos_emergencia(*)')
          .eq('id', perfilProp.id)
          .maybeSingle()
        
        const { data: fData } = await supabase
          .from('perfiles_ficha_medica')
          .select('*')
          .eq('perfil_id', perfilProp.id)
          .maybeSingle()

        if (pData) setPerfil(pData)
        setFichaMedica(fData)

        // 2. Generar el PDF para previsualización
        const pdfBytes = await generateOfficialPDF(auth, pData || perfilProp, fData, false);
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

      } catch (err) {
        console.error('Error al cargar datos o generar PDF:', err);
      } finally {
        setLoading(false)
      }
    }

    loadDataAndPdf()

    // Cleanup URL on close
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [isOpen, perfilProp, auth])

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta autorización?')) return
    setIsDeleting(true)
    try {
      const { error, count } = await supabase
        .from('autorizaciones_actividades')
        .delete({ count: 'exact' })
        .eq('id', auth.id)
      
      if (error) throw error
      if (count === 0) throw new Error('Sin permisos o ya eliminado.')
      
      alert('Eliminado con éxito.')
      onClose()
      window.location.reload()
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="bg-zinc-900 text-white w-full h-full max-w-6xl flex flex-col shadow-2xl relative rounded-none md:rounded-3xl overflow-hidden border border-white/10">
        
        {/* HEADER */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-sm font-black uppercase tracking-widest text-clr7">Expediente Oficial Digital</h2>
            <p className="text-[0.8em] opacity-40 font-mono">{auth.actividad_nombre} • {perfil.nombres} {perfil.apellidos}</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="px-4 py-2 bg-red-950/30 text-red-500 rounded-xl font-bold uppercase text-[0.8em] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
            >
              {isDeleting ? '...' : '🗑️ Eliminar'}
            </button>
            <button 
              onClick={() => generateOfficialPDF(auth, perfil, fichaMedica, true)} 
              className="px-4 py-2 bg-clr7 text-white rounded-xl font-bold uppercase text-[0.8em] hover:brightness-110 shadow-lg shadow-clr7/20"
            >
              📥 Descargar
            </button>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENIDO: VISOR DE PDF */}
        <div className="flex-1 bg-zinc-800 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-clr7 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">Generando documento oficial...</p>
            </div>
          ) : pdfUrl ? (
            <iframe 
              src={`${pdfUrl}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              title="Previsualización de Autorización"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-red-400 font-bold uppercase text-xs">
              Error al cargar la previsualización del PDF.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
