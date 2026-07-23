'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { differenceInYears } from 'date-fns'
import { validarRut } from '@/lib/validation-utils'
import type { WizardFormData, ActividadData, ApoderadoData, PerfilWizard } from '@/types/autorizacion'

import Step0_SeleccionActividad from './Step0_SeleccionActividad'
import Step1_DatosPersonales from './Step1_DatosPersonales'
import Step2_DatosGrupo from './Step2_DatosGrupo'
import Step3_ContactosEmergencia from './Step3_ContactosEmergencia'
import Step4_PrevisionSalud from './Step4_PrevisionSalud'
import Step5_AlergiasIntolerancias from './Step5_AlergiasIntolerancias'
import Step6_EnfermedadesCronicas from './Step6_EnfermedadesCronicas'
import Step7_SaludMental from './Step7_SaludMental'
import Step8_HistorialClinico from './Step8_HistorialClinico'
import Step9_CondicionesRecientes from './Step9_CondicionesRecientes'
import Step10_ContactosRecientes from './Step10_ContactosRecientes'
import Step11_AntecedentesVacunas from './Step11_AntecedentesVacunas'
import Step12_SaludGineco from './Step12_SaludGineco'
import Step13_SaludDental from './Step13_SaludDental'
import Step14_NecesidadesEspeciales from './Step14_NecesidadesEspeciales'
import Step15_RegulacionEmocional from './Step15_RegulacionEmocional'
import Step16_AutorizacionParticipacion from './Step16_AutorizacionParticipacion'
import Step17_AutorizacionImagen from './Step17_AutorizacionImagen'
import Step18_FirmaDigital from './Step18_FirmaDigital'
import { toast } from 'sonner';

interface Props {
  isOpen: boolean
  onClose: () => void
  perfil: PerfilWizard
  actividadInitial?: ActividadData
  onSuccess?: () => void
}

export default function DashModAutorizacionWizard({ isOpen, onClose, perfil, actividadInitial, onSuccess }: Props) {
  const [step, setStep] = useState(actividadInitial ? 1 : 0)
  const [saving, setSaving] = useState(false)
  const [actividadSelected, setActividadSelected] = useState<ActividadData | null>(actividadInitial || null)
  const [apoderadoData, setApoderadoData] = useState<ApoderadoData | null>(null)
  const [formData, setFormData] = useState<WizardFormData>({
    autoriza_participacion: 'SI',
    autoriza_imagen: 'SI'
  })

  const edad = perfil?.fecha_nacimiento ? differenceInYears(new Date(), new Date(perfil.fecha_nacimiento)) : 0
  const perfilConEdad = { ...perfil, edad }

  useEffect(() => {
    if (perfil?.apoderado_id) {
      const fetchApoderado = async () => {
        const { data } = await supabase
          .from('perfiles')
          .select('nombres, apellidos, rut')
          .eq('id', perfil.apoderado_id)
          .maybeSingle()
        if (data) setApoderadoData(data)
      }
      fetchApoderado()
    }
  }, [perfil])

  if (!isOpen) return null

  const handleNext = () => { if (canAdvance && step < 18) setStep(step + 1) }
  const handleBack = () => { if (step > 0) setStep(step - 1) }

  const canAdvance = (() => {
    if (step === 0 && !actividadSelected) return false;
    
    // Validación Paso 16
    if (step === 16) {
      const rutU = formData.rut_usuario || perfil.rut;
      const nomU = formData.nombres_usuario || perfil.nombres;
      const apeU = formData.apellidos_usuario || perfil.apellidos;
      
      if (!nomU || !apeU || !validarRut(rutU)) return false;
      
      if (edad < 18) {
        const rutA = formData.rut_apoderado || apoderadoData?.rut || '';
        const nomA = formData.nombre_apoderado || apoderadoData?.nombres || perfil.nombre_apoderado_contacto || '';
        const apeA = formData.apellidos_apoderado || apoderadoData?.apellidos || '';
        if (!nomA || !apeA || !validarRut(rutA)) return false;
      }
    }

    // Validación Paso 17
    if (step === 17) {
      const rutU = formData.rut_usuario_img || perfil.rut;
      const nomU = formData.nombres_usuario_img || perfil.nombres;
      const apeU = formData.apellidos_usuario_img || perfil.apellidos;

      if (!nomU || !apeU || !validarRut(rutU)) return false;

      if (edad < 18) {
        const rutA = formData.rut_apoderado_img || apoderadoData?.rut || '';
        const nomA = formData.nombre_apoderado_img || apoderadoData?.nombres || perfil.nombre_apoderado_contacto || '';
        const apeA = formData.apellidos_apoderado_img || apoderadoData?.apellidos || '';
        if (!nomA || !apeA || !validarRut(rutA)) return false;
      }
    }

    return true;
  })();

  const handleFinalSave = async () => {
    if (!actividadSelected) { toast.warning('Debes seleccionar una actividad.'); return; }
    setSaving(true)
    try {
      // 1. Lista blanca estricta de columnas reales en perfiles_ficha_medica (según migración 20260308000000)
      const validColumns = [
        'perfil_id', 'estatura_m', 'peso_kg', 'asma', 'diabetes', 'hipertension', 
        'epilepsia', 'enfermedad_renal', 'alteraciones_sanguineas', 'enfermedad_autoinmune', 
        'patologia_cardiaca', 'hipo_hipertiroidismo', 'otras_cronicas', 
        'diagnostico_salud_mental', 'detalle_salud_mental', 'tratamiento_salud_mental', 
        'profesional_tratante_contacto', 'hospitalizaciones_previas', 'cirugias_previas', 
        'malestares_recientes', 'tratamiento_reciente', 'vacunas_al_dia', 'vacunas_extra', 
        'viajes_extranjero', 'menstruaciones', 'ciclo_regular', 'dismenorrea', 
        'medicamento_colicos', 'metodo_anticonceptivo', 'embarazo', 'ultimo_control_dental', 
        'tratamiento_dental_curso', 'necesidades_especiales', 'intereses_disfrute', 
        'situaciones_estres', 'conductas_previas_desregulacion', 'estrategias_calma', 
        'apoyo_comunicacion', 'dificultades_sensoriales', 'ayuda_organizacion', 
        'otras_necesidades', 'observaciones_adicionales',
        // Columnas añadidas en wizard_overhaul
        'tiene_seguro_complementario', 'intolerancia_alimentaria', 'medicamentos_detalle',
        'salud_mental_diagnostico', 'salud_mental_tratamiento', 'salud_mental_medicamentos',
        'salud_mental_profesional', 'salud_mental_contacto', 'lista_hospitalizaciones',
        'lista_cirugias', 'reciente_fiebre', 'reciente_diarrea', 'reciente_vomitos',
        'reciente_erupciones', 'reciente_tos', 'reciente_otros', 'contacto_infecto',
        'contacto_infecto_detalle', 'vacunas_covid', 'vacunas_observaciones',
        'presenta_diagnostico_relevante', 'diagnostico_relevante_detalle', 'updated_at'
      ];

      // Mapeo manual de campos del form que tienen nombres distintos en la DB
      const dataToSave: Record<string, unknown> = { 
        perfil_id: perfil.id,
        updated_at: new Date()
      };
      
      if (formData.cirugias) dataToSave.lista_cirugias = formData.cirugias;
      if (formData.has_cirugias) dataToSave.cirugias_previas = formData.has_cirugias;
      if (formData.hospitalizaciones) dataToSave.lista_hospitalizaciones = formData.hospitalizaciones;
      if (formData.has_hospitalizaciones) dataToSave.hospitalizaciones_previas = formData.has_hospitalizaciones;
      
      // Mapeo de seguro complementario
      if (formData.seguro_complementario !== undefined) dataToSave.tiene_seguro_complementario = formData.seguro_complementario;
      if (formData.nombre_seguro_complementario) dataToSave.seguro_complementario = formData.nombre_seguro_complementario;

      // Llenar solo lo que está en la lista blanca con saneamiento de tipos
      const finalValidColumns = [...validColumns, 'seguro_complementario'];
      finalValidColumns.forEach(col => {
        if (formData[col] !== undefined) {
          let value: unknown = formData[col];
          
          // Saneamiento de campos numéricos (Evitar numeric field overflow)
          if (col === 'estatura_m' || col === 'peso_kg') {
            if (typeof value === 'string') value = value.replace(',', '.');
            let num = parseFloat(String(value));
            
            // Inteligencia para estatura: Si el usuario ingresa cm (ej: 165), convertir a m (1.65)
            if (col === 'estatura_m' && num > 10) {
              num = num / 100;
            }

            value = isNaN(num) ? null : num;
            
            // Validar límites lógicos para evitar overflow (DECIMAL 4,2 y 5,2)
            if (col === 'estatura_m' && typeof value === 'number' && value > 9.99) value = 9.99;
            if (col === 'peso_kg' && typeof value === 'number' && value > 999.99) value = 999.99;
          }

          dataToSave[col] = value;
        }
      });

      const { error: fE } = await supabase.from('perfiles_ficha_medica').upsert(dataToSave)
      if (fE) throw fE

      // 2. Actualizar Perfil del Usuario si hubo cambios
      const profileUpdates: Record<string, unknown> = {}
      if (formData.nombres) profileUpdates.nombres = formData.nombres
      if (formData.apellidos) profileUpdates.apellidos = formData.apellidos
      if (formData.rut_usuario) profileUpdates.rut = formData.rut_usuario
      if (formData.sexo) profileUpdates.sexo = formData.sexo
      if (formData.fecha_nacimiento) profileUpdates.fecha_nacimiento = formData.fecha_nacimiento
      if (formData.nombre_social) profileUpdates.nombre_social = formData.nombre_social
      if (formData.nacionalidad) profileUpdates.nacionalidad = formData.nacionalidad
      
      // Sincronizar Salud en Perfil
      if (formData.sistema_salud) profileUpdates.sistema_salud = formData.sistema_salud
      if (formData.detalle_sistema_salud) profileUpdates.detalle_sistema_salud = formData.detalle_sistema_salud
      if (formData.tipo_sangre) profileUpdates.tipo_sangre = formData.tipo_sangre
      if (formData.alergias) profileUpdates.alergias = formData.alergias
      if (formData.medicamentos) profileUpdates.medicamentos = formData.medicamentos
      if (formData.dieta_alimentaria) profileUpdates.dieta_alimentaria = formData.dieta_alimentaria
      
      // Si es menor, actualizamos el contacto directo en su perfil
      if (edad < 18) {
        if (formData.nombre_apoderado || formData.apellidos_apoderado) {
          profileUpdates.nombre_apoderado_contacto = `${formData.nombre_apoderado || ''} ${formData.apellidos_apoderado || ''}`.trim() || perfil.nombre_apoderado_contacto
        }
      }

      if (Object.keys(profileUpdates).length > 0) {
        await supabase.from('perfiles').update(profileUpdates).eq('id', perfil.id)
      }

      // 3. Actualizar Perfil del Apoderado si está vinculado y hubo cambios
      if (perfil.apoderado_id && (formData.nombre_apoderado || formData.apellidos_apoderado || formData.rut_apoderado)) {
        const apoUpdates: Record<string, unknown> = {}
        if (formData.nombre_apoderado) apoUpdates.nombres = formData.nombre_apoderado
        if (formData.apellidos_apoderado) apoUpdates.apellidos = formData.apellidos_apoderado
        if (formData.rut_apoderado) apoUpdates.rut = formData.rut_apoderado
        
        await supabase.from('perfiles').update(apoUpdates).eq('id', perfil.apoderado_id)
      }

      // 4. Determinar datos del firmante
      const nombreFirmante = edad >= 18 
        ? `${formData.nombres_usuario || perfil.nombres} ${formData.apellidos_usuario || perfil.apellidos}` 
        : `${formData.nombre_apoderado || apoderadoData?.nombres || perfil.nombre_apoderado_contacto || ''} ${formData.apellidos_apoderado || apoderadoData?.apellidos || ''}`.trim()

      const rutFirmante = edad >= 18 
        ? (formData.rut_usuario || perfil.rut)
        : (formData.rut_apoderado || apoderadoData?.rut || 'Apoderado en Ficha')

      // 5. Registrar la Autorización (Ajustado al esquema real de autorizaciones_actividades)
      const { error: aE } = await supabase.from('autorizaciones_actividades').insert({
        perfil_id: perfil.id,
        actividad_id: actividadSelected.id,
        actividad_nombre: actividadSelected.nombre,
        lugar: actividadSelected.lugar,
        fecha_inicio: actividadSelected.fecha_inicio,
        fecha_fin: actividadSelected.fecha_fin || actividadSelected.fecha_inicio,
        tipo_formulario: edad >= 18 ? 'Mayor de Edad' : 'Menor de Edad',
        firmado_por_id: perfil.apoderado_id || perfil.id,
        nombre_firmante: nombreFirmante,
        rut_firmante: rutFirmante,
        firma_digital_b64: formData.firma, // La columna real es firma_digital_b64
        estado: 'Vigente'
      })
      if (aE) throw aE

      toast.success('¡Autorización firmada con éxito!')
      if (onSuccess) onSuccess()
      onClose()
    } catch (e: unknown) {
      toast.error('Error: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setSaving(false)
    }
  }

  const renderStep = () => {
    const props = { 
      formData, 
      setFormData, 
      perfil: perfilConEdad, 
      actividad: actividadSelected, 
      setActividadSelected, 
      actividadSelected,
      apoderadoData 
    }
    switch(step) {
      case 0: return <Step0_SeleccionActividad {...props} />
      case 1: return <Step1_DatosPersonales {...props} />
      case 2: return <Step2_DatosGrupo {...props} />
      case 3: return <Step3_ContactosEmergencia {...props} />
      case 4: return <Step4_PrevisionSalud {...props} />
      case 5: return <Step5_AlergiasIntolerancias {...props} />
      case 6: return <Step6_EnfermedadesCronicas {...props} />
      case 7: return <Step7_SaludMental {...props} />
      case 8: return <Step8_HistorialClinico {...props} />
      case 9: return <Step9_CondicionesRecientes {...props} />
      case 10: return <Step10_ContactosRecientes {...props} />
      case 11: return <Step11_AntecedentesVacunas {...props} />
      case 12: return <Step12_SaludGineco {...props} />
      case 13: return <Step13_SaludDental {...props} />
      case 14: return <Step14_NecesidadesEspeciales {...props} />
      case 15: return <Step15_RegulacionEmocional {...props} />
      case 16: return <Step16_AutorizacionParticipacion {...props} />
      case 17: return <Step17_AutorizacionImagen {...props} />
      case 18: return <Step18_FirmaDigital {...props} />
      default: return null
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-clr5 rounded-[1em] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-3 bg-clr7 text-white flex justify-between items-center">
          <div>
            <h2 className="text-[1.5em] font-bold uppercase">Autorización</h2>
            <p className="text-[0.9em] opacity-80 uppercase">Paso {step === 0 ? 'Inicial' : step} de 18 • {actividadSelected?.nombre || 'Seleccione Actividad'}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white font-bold text-2xl pr-2">×</button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {renderStep()}
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-black/20 border-t border-zinc-100 dark:border-clr4 flex justify-between items-center">
          <button onClick={handleBack} disabled={step === 0 || saving} className={`px-2 py-2 font-black uppercase text-[1em] tracking-widest transition-all ${step === 0 ? 'opacity-0' : 'text-clr2 hover:text-clr7'}`}>← Atrás</button>
          
          {step > 0 && (
            <div className="flex gap-1.5">
              {[...Array(18)].map((_, i) => (
                <div key={i} className={`h-1 w-2.5 rounded-full transition-all ${step === i + 1 ? 'bg-clr7 w-5' : 'bg-zinc-200 dark:bg-clr4'}`} />
              ))}
            </div>
          )}

          {step < 18 ? (
            <button 
              onClick={handleNext} 
              disabled={!canAdvance}
              className={`p-2 bg-clr7 text-white font-black uppercase rounded-xl shadow-lg text-[1em] tracking-widest ${!canAdvance ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'}`}
            >
              Siguiente →
            </button>
          ) : (
            <button onClick={handleFinalSave} disabled={saving || !formData.firma} className="p-2 bg-green-600 text-white font-black uppercase rounded-xl shadow-lg text-[1em] tracking-widest">✍️ FINALIZAR</button>
          )}
        </div>
      </div>
    </div>
  )
}
