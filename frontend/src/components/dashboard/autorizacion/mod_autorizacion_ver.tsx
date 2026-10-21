'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { generateOfficialPDF } from '@/lib/pdf-service'
import type { Perfil, AutorizacionActividad } from '@/types'
import { toast } from 'sonner'

interface DashModAutorizacionVerProps {
  isOpen: boolean
  onClose: () => void
  auth: AutorizacionActividad | null
  perfil: Perfil | null
  onDelete?: () => void
}

export default function DashModAutorizacionVer({ isOpen, onClose, auth, perfil: perfilProp, onDelete }: DashModAutorizacionVerProps) {
  const [fichaMedica, setFichaMedica] = useState<Record<string, unknown> | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(perfilProp)
  const [resolvedAuth, setResolvedAuth] = useState<AutorizacionActividad | null>(auth)
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Sincronizar estado cuando cambian las props
  useEffect(() => {
    setPerfil(perfilProp)
  }, [perfilProp])

  useEffect(() => {
    setResolvedAuth(auth)
  }, [auth])

  useEffect(() => {
    if (!isOpen || !auth) return
    
    const targetPerfilId = perfilProp?.id || auth.perfil_id

    const loadDataAndPdf = async () => {
      setLoading(true)
      try {
        let pData: any = null
        let fData: any = null
        let currentAuth: any = auth

        // 1. Intentar consultar datos desde Supabase si hay red activa y tenemos perfil_id
        if (typeof navigator !== 'undefined' && navigator.onLine && targetPerfilId) {
          try {
            const { data: pRes } = await supabase
              .from('perfiles')
              .select('*, unidades(*), contactos_emergencia(*)')
              .eq('id', targetPerfilId)
              .maybeSingle()

            const { data: fRes } = await supabase
              .from('perfiles_ficha_medica')
              .select('*')
              .eq('perfil_id', targetPerfilId)
              .maybeSingle()

            if (pRes) pData = pRes
            if (fRes) fData = fRes
          } catch (netErr) {
            console.warn('Conexión remota fallida, buscando en caché local:', netErr)
          }
        }

        // 2. Fallback a IndexedDB (Dexie) si no se pudo cargar online o estamos desconectados
        if (!pData && targetPerfilId) {
          try {
            const offlinePerfil = await db.perfiles.get(targetPerfilId)
            const offlineContactos = await db.contactos_emergencia.where('perfil_id').equals(targetPerfilId).toArray()
            if (offlinePerfil) {
              pData = {
                ...offlinePerfil,
                contactos_emergencia: offlineContactos
              }
            }
          } catch (dbErr) {
            console.warn('Error leyendo perfil de IndexedDB:', dbErr)
          }
        }

        if (!fData && targetPerfilId) {
          try {
            const offlineFicha = await db.fichas_medicas.get(targetPerfilId)
            if (offlineFicha) {
              fData = offlineFicha
            }
          } catch (dbErr) {
            console.warn('Error leyendo ficha médica de IndexedDB:', dbErr)
          }
        }

        // 3. Si la autorización no tiene la firma en base64, buscarla en la base offline
        if (!currentAuth.firma_digital_b64) {
          try {
            const offlineAuth = await db.autorizaciones.get(auth.id)
            if (offlineAuth && offlineAuth.firma_digital_b64) {
              currentAuth = { ...currentAuth, ...offlineAuth }
            }
          } catch (dbErr) {
            console.warn('Error leyendo autorización de IndexedDB:', dbErr)
          }
        }

        // Perfil de respaldo seguro para evitar cualquier error de lectura
        const fallbackPerfil: Perfil = {
          id: targetPerfilId || 'id-desconocido',
          nombres: currentAuth?.nombre_firmante ? `Beneficiario (${currentAuth.nombre_firmante})` : 'Beneficiario',
          apellidos: '',
          rut: currentAuth?.rut_firmante || '',
          unidad_id: null,
          rol_id: null,
          unidades: { nombre: 'Grupo Scout' } as any
        }

        const finalPerfil = pData || perfilProp || fallbackPerfil
        setPerfil(finalPerfil)
        setFichaMedica(fData)
        setResolvedAuth(currentAuth)

        // 4. Generar el PDF oficial en memoria (pdf-lib) de forma completamente local
        const pdfBytes = await generateOfficialPDF(currentAuth as any, finalPerfil, fData, false)
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)

      } catch (err) {
        console.error('Error al cargar datos o generar PDF:', err)
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
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      toast.error('Para eliminar una autorización se requiere conexión a internet.')
      return
    }
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta autorización?')) return
    if (!auth) return
    setIsDeleting(true)
    try {
      const { error, count } = await supabase
        .from('autorizaciones_actividades')
        .delete({ count: 'exact' })
        .eq('id', auth.id)
      
      if (error) throw error
      if (count === 0) throw new Error('Sin permisos o ya eliminado.')
      
      // Limpiar también en IndexedDB local
      try {
        await db.autorizaciones.delete(auth.id)
      } catch (dbE) {
        console.warn('Aviso borrado local:', dbE)
      }

      toast.success('Eliminado con éxito.')
      if (onDelete) onDelete()
      onClose()
    } catch (e: unknown) {
      toast.error('Error: ' + (e instanceof Error ? e.message : e))
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  const currentPerfil = perfil || perfilProp
  const nombreActividad =
    (resolvedAuth as any)?.actividad_nombre ||
    (resolvedAuth as any)?.actividad_titulo ||
    (auth as any)?.actividad_nombre ||
    (auth as any)?.actividad_titulo ||
    'Actividad'

  const nombreParticipante = currentPerfil?.nombres
    ? `${currentPerfil.nombres} ${currentPerfil.apellidos || ''}`.trim()
    : ((resolvedAuth || auth)?.nombre_firmante || 'Participante')

  return (
    <div className="fixed inset-0 bg-pclr2 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4 w-full h-full max-w-6xl flex flex-col shadow-2xl relative rounded-none md:rounded-3xl overflow-hidden border border-pclr13 dark:border-pdclr13">
        
        {/* HEADER */}
        <div className="p-4 border-b border-pclr13 dark:border-pdclr13 flex justify-between items-center bg-pclr3 dark:bg-pdclr3 backdrop-blur-md">
          <div className="flex flex-col">
            <h2 className="text-sm font-black uppercase tracking-widest text-pclr4 dark:text-pdclr4">Expediente Oficial Digital</h2>
            <p className="text-[0.8em] opacity-60 font-mono font-bold">
              {nombreActividad} • {nombreParticipante}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="px-4 py-2 bg-pclr10 text-pclr12 rounded-xl font-bold uppercase text-[0.8em] border border-pclr14 hover:bg-pclr10/80 transition-all cursor-pointer"
            >
              {isDeleting ? '...' : '🗑️ Eliminar'}
            </button>
            <button 
              onClick={() => {
                if (currentPerfil) {
                  generateOfficialPDF((resolvedAuth || auth) as any, currentPerfil as any, fichaMedica, true)
                }
              }} 
              className="px-4 py-2 bg-pclr10 text-pclr12 rounded-xl font-bold uppercase text-[0.8em] hover:brightness-110 shadow-lg cursor-pointer"
            >
              📥 Descargar
            </button>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-pclr1 dark:bg-pdclr1 text-pclr4 dark:text-pdclr4 rounded-full flex items-center justify-center hover:scale-110 transition-all border border-pclr13 dark:border-pdclr13 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENIDO: VISOR DE PDF */}
        <div className="flex-1 bg-pclr2 dark:bg-pdclr2 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-pclr14 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-60 font-mono">Generando documento oficial...</p>
            </div>
          ) : pdfUrl ? (
            <iframe 
              src={`${pdfUrl}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              title="Previsualización de Autorización"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-pclr4 font-bold uppercase text-xs">
              Error al cargar la previsualización del PDF.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
