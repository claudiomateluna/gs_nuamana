import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  getFieldColor, 
  getFieldBgColor, 
  getFieldLogoPath, 
  getSpecialtyInsigniaPath 
} from '@/lib/progression-utils'
import type { Perfil } from '@/types'
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-utils';
import { DebouncedInput, DebouncedTextarea } from './DebouncedInputs'

interface EspecialidadDef {
  id: string
  nombre: string
  campo_interes: string
}

interface DashmodEspecialidadData {
  id: string
  perfil_id: string
  campo_interes: string
  fase: string
  nombre_personalizado?: string
  definicion_id?: string
}

interface SpecialtyWizardProps {
  isOpen: boolean
  onClose: () => void
  perfil: Perfil
  definiciones: EspecialidadDef[]
  onSaveSuccess: (newSpec: DashmodEspecialidadData) => void
}

export default function DashmodProgresionEspecialidadWizard({
  isOpen,
  onClose,
  perfil,
  definiciones,
  onSaveSuccess
}: SpecialtyWizardProps) {
  const [wizardStep, setWizardStep] = useState(1)
  const [wSelectedField, setWSelectedField] = useState<string>('arte_expresion')
  const [wSelectedDefId, setWSelectedDefId] = useState<string>('')
  const [wCustomName, setWCustomName] = useState<string>('')
  const [wDiagnostico, setWDiagnostico] = useState<string>('')

  if (!isOpen) return null

  const fieldDefs = definiciones.filter(d => d.campo_interes === wSelectedField)
  const defName = wSelectedDefId
    ? definiciones.find(d => d.id === wSelectedDefId)?.nombre
    : wCustomName

  const handleSave = async (targetPhase = 'exploracion') => {
    if (!wDiagnostico.trim()) {
      toast.warning('Por favor ingresa la exploración de tu especialidad.')
      return
    }
    if (!wSelectedDefId && !wCustomName.trim()) {
      toast.warning('Por favor selecciona una especialidad del catálogo o define una personalizada.')
      return
    }

    try {
      const payload: Record<string, unknown> = {
        perfil_id: perfil.id,
        campo_interes: wSelectedField,
        fase: targetPhase,
        meta_general: '',
        diagnostico_previo: wDiagnostico.trim(),
        monitor_nombre: '',
        monitor_perfil_id: null,
        estado: 'activo'
      }

      if (wSelectedDefId) {
        payload.definicion_id = wSelectedDefId
      } else {
        payload.nombre_personalizado = wCustomName.trim()
      }

      const { data: specData, error: specErr } = await supabase
        .from('especialidades_personales')
        .insert([payload])
        .select()
        .single()

      if (specErr) throw specErr

      toast.success(targetPhase === 'planificacion' 
        ? 'Especialidad creada y lista para iniciar su planificación.' 
        : 'Exploración de especialidad guardada para más adelante.'
      )

      onSaveSuccess(specData)
    } catch (err: unknown) {
      console.error(err)
      toast.error('Error al guardar la especialidad: ' + getErrorMessage(err))
    }
  }

  return (
    <div className="fixed inset-0 bg-clr2 backdrop-blur-md z-[150] flex items-center justify-center p-1 overflow-y-auto">
      <div className="bg-clr1 dark:bg-dclr1 w-full max-w-2xl rounded-[1rem] p-2 shadow-2xl border-2 border-clr7 dark:border-dclr7 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 border-clr7 dark:border-dclr7">
          <div>
            <span className="text-[0.8em] font-extrabold uppercase tracking-widest text-clr3">Fase 1: Exploración • Paso {wizardStep} de 2</span>
            <h3 className="text-xl font-bold uppercase tracking-tight text-clr2 dark:text-dclr2 mt-1">
              🎖️ Postulación de Especialidad
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-clr3 hover:text-clr2 dark:hover:text-dclr2 text-2xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: Selección */}
        {wizardStep === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[1em] font-bold uppercase tracking-wider text-clr3 block">1. Selecciona el Campo de Interés</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'arte_expresion', label: 'Arte y Cultura' },
                  { id: 'deportes', label: 'Deportes y Juegos' },
                  { id: 'ciencia_tecnologia', label: 'Ciencia y Tec.' },
                  { id: 'aire_libre', label: 'Aire Libre' },
                  { id: 'espiritual', label: 'Espiritual' },
                  { id: 'servicio_comunidad', label: 'Servicio' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setWSelectedField(f.id);
                      setWSelectedDefId('');
                    }}
                    className={`p-2 rounded-2xl border-2 font-bold text-[0.85em] flex flex-col items-center gap-2 transition-all ${
                      wSelectedField === f.id
                        ? 'shadow-md scale-102 font-extrabold'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                    style={wSelectedField === f.id ? { 
                      borderColor: getFieldColor(f.id), 
                      backgroundColor: `${getFieldBgColor(f.id)}15`, 
                      color: getFieldColor(f.id) 
                    } : {}}
                  >
                    <div className="w-20 h-20 flex items-center justify-center p-1.5 transition-all">
                      <img src={getFieldLogoPath(f.id)} alt="" className="w-full h-full object-contain" />
                    </div>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[1em] font-bold uppercase tracking-wider text-clr3 block">2. Selecciona del Catálogo o Propón una Especialidad</label>
              <select
                value={wSelectedDefId}
                onChange={e => {
                  setWSelectedDefId(e.target.value);
                  if (e.target.value) setWCustomName('');
                }}
                className="w-full p-2 rounded-2xl border dark:border-clr1 bg-clr7 dark:bg-dclr7 text-[0.9em] font-bold"
              >
                <option value="">-- Proponer Especialidad Personalizada (Escribe abajo) --</option>
                {fieldDefs.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>

            {!wSelectedDefId && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                <label className="text-[0.8em] font-bold uppercase tracking-wider text-clr3 block ml-1">Nombre de la Especialidad Personalizada</label>
                <DebouncedInput 
                  type="text"
                  value={wCustomName}
                  onChange={val => setWCustomName(val)}
                  placeholder="Ej: Apicultura, Astronomía Avanzada, Malabarismo..."
                  className="w-full p-4 rounded-2xl border dark:border-clr1 bg-clr7 dark:bg-dclr7 text-[0.9em] font-bold"
                />
              </div>
            )}

            {/* Muestra Insignia */}
            {defName && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-clr7 dark:bg-dclr7 border border-clr7 dark:border-dclr7">
                <img
                  src={getSpecialtyInsigniaPath(defName)}
                  alt={defName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/especialidades/generico.svg'
                  }}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <span className="text-[0.8em] font-bold text-clr3 block">Previsualización de Insignia</span>
                  <span className="text-[1.1em] font-bold text-clr2 dark:text-dclr2">{defName}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  if (!wSelectedDefId && !wCustomName.trim()) {
                    toast.warning('Por favor selecciona una especialidad o ingresa un nombre personalizado.');
                    return;
                  }
                  setWizardStep(2);
                }}
                className="px-6 py-3 text-[0.9em] font-bold uppercase tracking-wider text-clr1 rounded-2xl shadow-xl hover:brightness-110"
                style={{ backgroundColor: getFieldColor(wSelectedField) }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Exploración */}
        {wizardStep === 2 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[0.8em] font-bold uppercase tracking-wider text-clr3 block ml-1">
                Exploración de la especialidad
              </label>
              <p className="text-[0.85em] text-clr3 mb-2">
                Explica qué significa para ti esta especialidad, en qué consiste, si tienes algún conocimiento previo o por qué te llama la atención realizarla.
              </p>
              <DebouncedTextarea 
                value={wDiagnostico}
                onChange={val => setWDiagnostico(val)}
                placeholder="Escribe aquí tu exploración..."
                className="w-full p-4 rounded-2xl border dark:border-clr1 bg-clr7 dark:bg-dclr7 text-[0.9em] font-medium h-40 text-clr2 dark:text-dclr2"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                onClick={() => setWizardStep(1)}
                className="px-6 py-3 text-[0.9em] font-bold uppercase tracking-wider text-clr3 hover:text-clr2 bg-clr7 dark:bg-dclr7 rounded-2xl"
              >
                ← Atrás
              </button>
              <div className="flex-1 flex flex-col md:flex-row gap-3 justify-end">
                <button
                  onClick={() => handleSave('exploracion')}
                  className="px-6 py-3 text-[0.9em] font-bold uppercase tracking-wider text-clr2 dark:text-dclr2 bg-clr7 dark:bg-dclr7 hover:brightness-110 rounded-2xl"
                >
                  Guardar para más adelante 📂
                </button>
                <button
                  onClick={() => handleSave('planificacion')}
                  className="px-6 py-3 text-[0.9em] font-bold uppercase tracking-wider text-clr1 rounded-2xl shadow-xl hover:brightness-110"
                  style={{ backgroundColor: getFieldColor(wSelectedField) }}
                >
                  Avanzar a Planificación 🚀
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
