'use client'

import { useState, useEffect, Suspense, use } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import SecondaryHeader from '@/components/SecondaryHeader'
import { validarRut } from '@/lib/validation-utils'
import { toast } from 'sonner';

// --- FUNCIONES DE AYUDA ---
const aplicarMascaraTelefono = (val: string) => {
  let d = val.replace(/\D/g, '')
  if (d.startsWith('56')) d = d.slice(2)
  d = d.slice(0, 9)
  if (d.length > 0) {
    let f = '+56 ' + d.substring(0, 1)
    if (d.length > 1) f += ' ' + d.substring(1, 5)
    if (d.length > 5) f += ' ' + d.substring(5, 9)
    return f
  }
  return ''
}

// --- ESQUEMA DE VALIDACIÃ“N ---
const registroSchema = z.object({
  claveAutorizacion: z.string().min(1, 'La clave es requerida').refine(val => val === process.env.NEXT_PUBLIC_REGISTRATION_KEY, { message: 'Clave incorrecta' }),
  rol: z.enum(['lobato (a)', 'guia', 'scout', 'pionera (o)', 'caminante', 'dirigente', 'guiadora', 'apoderado']),
  nombres: z.string().min(2, 'Requerido'),
  apellidos: z.string().min(2, 'Requerido'),
  nombreSocial: z.string().optional(),
  nacionalidad: z.string().default('Chilena'),
  rut: z.string().min(8, 'RUT invÃ¡lido').refine(validarRut, { message: 'RUT invÃ¡lido' }),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().min(1, 'Requerido'),
  email: z.string().email('Email invÃ¡lido'),
  direccion: z.string().min(5, 'Requerido'),
  comuna: z.string().min(1, 'Requerido'),
  zona: z.string().default('La Florida'),
  distrito: z.string().default('Mapurayen'),
  sexo: z.enum(['femenina', 'masculina']),
  religion: z.string().min(1, 'Requerido'),
  perteneceNuaMana: z.string().optional(),
  unidad: z.string().optional(),
  colegio: z.string().optional(),
  nivelEducacional: z.string().optional(),
  nombreApoderado: z.string().optional(),
  relacionApoderado: z.string().optional(),
  telefonoApoderado: z.string().optional(),
  apoderado_id_vinculado: z.string().optional(),
  pupilos: z.array(z.object({
    nombre: z.string().optional(),
    relacion: z.string().optional(),
    unidad: z.string().optional(),
    id_vinculado: z.string().optional()
  })).optional(),
  contactosEmergencia: z.array(z.object({
    nombre: z.string().optional(),
    relacion: z.string().optional(),
    telefono: z.string().optional()
  })).optional(),
  sistemaSalud: z.string().optional(),
  detalleSalud: z.string().optional(),
  seguroComplementario: z.enum(['si', 'no']).default('no'),
  nombreSeguroComplementario: z.string().optional(),
  tipoSangre: z.string().optional(),
  tieneAlergias: z.enum(['si', 'no']).default('no'),
  alergias: z.string().optional(),
  enfermedadesCronicas: z.array(z.string()).default([]),
  antecedentesMedicos: z.string().optional(),
  tieneIntolerancia: z.enum(['si', 'no']).default('no'),
  describeIntolerancia: z.string().optional(),
  tratamientosMedicos: z.string().optional(),
  medicamentos: z.string().optional(),
  dietaAlimentaria: z.array(z.string()).optional(),
  autorizaFotos: z.enum(['si', 'no']).optional(),
  fePublica: z.enum(['si', 'no']).optional(),
  password: z.string().min(6, 'MÃ­nimo 6 caracteres'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseÃ±as no coinciden",
  path: ["confirmPassword"]
});

function RegistroContent() {
  const searchParams = useSearchParams()
  const apoderadoIdParam = searchParams.get('apoderado_id')

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registroError, setRegistroError] = useState<string | null>(null)

  const { register, handleSubmit, watch, control, setValue, formState: { errors }, trigger } = useForm<z.infer<typeof registroSchema>>({
    resolver: zodResolver(registroSchema) as never,
    mode: 'onChange',
    defaultValues: {
      contactosEmergencia: [],
      pupilos: [],
      dietaAlimentaria: [],
      enfermedadesCronicas: [],
      nacionalidad: 'Chilena',
      zona: 'Santiago Sur',
      distrito: 'La Granja',
      apoderado_id_vinculado: apoderadoIdParam || ''
    }
  })

  // Si viene apoderadoIdParam, podemos saltar el paso de selecciÃ³n de rol o pre-configurarlo
  useEffect(() => {
    if (apoderadoIdParam) {
      // Si ya viene vinculado, asumimos que se registra un beneficiario
      // No forzamos el rol para permitir flexibilidad, pero pre-llenamos el vÃ­nculo
      setValue('apoderado_id_vinculado', apoderadoIdParam)
    }
  }, [apoderadoIdParam, setValue])

  const rol = watch('rol')
  const sistemaSalud = watch('sistemaSalud')
  const zonaSeleccionada = watch('zona')
  const seguroComp = watch('seguroComplementario')
  const tieneAlergias = watch('tieneAlergias')
  const tieneIntol = watch('tieneIntolerancia')

  const { fields: pupiloFields, append: appendPupilo, remove: removePupilo } = useFieldArray({ control, name: 'pupilos' })
  const { fields: emergencyFields, append: appendEmergency, remove: removeEmergency } = useFieldArray({ control, name: 'contactosEmergencia' })

  // Listas
  const comunas = ['Cerrillos', 'Cerro Navia', 'Colina', 'ConchalÃ­', 'El Bosque', 'EstaciÃ³n Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'MaipÃº', 'Ã‘uÃ±oa', 'Padre Hurtado', 'Pedro Aguirre Cerda', 'PeÃ±aflor', 'PeÃ±alolÃ©n', 'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San JoaquÃ­n', 'San JosÃ© de Maipo', 'San Miguel', 'San RamÃ³n', 'Santiago', 'Vitacura'].sort()
  const religiones = ['No Conocido', 'No EspecÃ­fica', 'No Tiene', 'Agnostico', 'Catolico', 'Evangelico', 'Protestante', 'Bautista', 'Ãšltimos Dias', 'Testigo Jehova', 'Budista', 'Cristiana', 'Luterana', 'Creyente', 'Anglicana', 'Adventista', 'Metodista', 'Ortodoxo', 'Are Krishna', 'Musulman', 'Islam', 'Sunita', 'Chiita', 'Bahai', 'Rastafari', 'Deista', 'Hinduista', 'Sijes', 'Taoista', 'Sintoista', 'Jainista', 'Confusiano', 'Zoroastriano', 'Vedista', 'Brahmanista', 'Wicca', 'Druida', 'Asatru', 'Judio', 'Otra']
  const colegios = ['No Conocido', 'Colegio Los NavÃ­os', 'Colegio Alma Mater', 'Colegio Arzobispo Crescente ErrÃ¡zuriz', 'Colegio BahÃ­a Darwin', 'Colegio Christian Garden', 'Colegio Cardenal JosÃ© MarÃ­a Caro', 'Colegio Los Pensamientos', 'Colegio Maria Elena', 'Colegio Poeta Neruda', 'Colegio Polivalente Jorge Huneeus Zegers', 'Colegio San Alberto Magno', 'Colegio San Marcelo', 'Colegio Santo TomÃ¡s', 'Colegio TÃ©cnico Profesional Aprender', 'Escuela BÃ¡sica Profesora Aurelia Rojas Burgos', 'Escuela BenjamÃ­n Subercaseaux', 'Liceo Bicentenario Nuestra SeÃ±ora de Guadalupe', 'Liceo TÃ©cnico Profesional Patricio Aylwin AzÃ³car', 'Saint Christian College', 'Otro']
  const relaciones = ['No Aplica', 'Madre', 'Padre', 'Hermana (o)', 'TÃ­a (o)', 'Abuela (o)', 'Sobrina (o)', 'Hija (o)', 'Otra']
  const unidades = ['No Aplica', 'Manada', 'CompaÃ±Ã­a', 'Tropa', 'Avanzada', 'Clan', 'Sin Unidad']
  
  const zonasDistritos: Record<string, string[]> = {
    'CajÃ³n del Maipo': ['Camilo HenrÃ­quez', 'Las Vizcachas', 'Puente Alto Poniente'],
    'Santiago Centro': ['Cerro HuelÃ©n', 'Santiago Centro', 'Providencia'],
    'Santiago Cordillera': ['Apoquindo', 'Los Leones', 'Manquehue', 'Vitacura'],
    'La Florida': ['Bellavista', 'Mapurayen', 'PeÃ±imahuida'],
    'Maipo': ['San Bernardo', 'El Bosque', 'Valle del Maipo'],
    'Santiago Norte': ['Chacabuco', 'ConchalÃ­', 'La CaÃ±adilla', 'Quilicura', 'Renca'],
    'Santiago Oeste': ['Cerrillos', 'MaipÃº Nuevo Extremo', 'Melipilla', 'Pila del Ganso', 'Quilamapu', 'Quinta Normal-Cerro Navia', 'Talakanta'],
    'Santiago Oriente': ['La Reina', 'Macul', 'Ã‘uÃ±oa', 'Pedro de Valdivia', 'PeÃ±alolÃ©n'],
    'Santiago Sur': ['La Cisterna', 'La Granja', 'Pedro Aguirre Cerda', 'San JoaquÃ­n', 'San Miguel', 'Santa Rosa']
  }

  const enfermedadesOpciones = ['Diabetes mellitus', 'HipertensiÃ³n arterial', 'PatologÃ­a cardiaca', 'Dolor de cabeza', 'Asma', 'Tuberculosis', 'Epilepsia', 'Enfermedad renal', 'Alteraciones sanguÃ­neas', 'Enfermedad autoinmune', 'Hipo/Hipertiroidismo', 'Ninguna', 'Otra']
  const nacionalidades = ['Argentina', 'Boliviana', 'BrasileÃ±a', 'Chilena', 'Colombiana', 'Costarricense', 'Cubana', 'Ecuatoriana', 'SalvadoreÃ±a', 'Guatemalteca', 'Haitiana', 'HondureÃ±a', 'Mexicana', 'NicaragÃ¼ense', 'PanameÃ±a', 'Paraguaya', 'Peruana', 'Dominicana', 'Uruguaya', 'Venezolana', 'Otra']

  const nextStep = async () => {
    const fieldsByStep: Record<number, any[]> = {
      1: ['claveAutorizacion'], 2: ['rol'], 3: ['nombres', 'apellidos', 'nombreSocial', 'nacionalidad'], 4: ['rut'],
      6: ['fechaNacimiento'], 7: ['email'], 8: ['direccion', 'comuna'], 9: ['sexo'], 10: ['religion'],
      11: ['zona', 'distrito'], 16: ['sistemaSalud', 'detalleSalud', 'seguroComplementario', 'nombreSeguroComplementario'],
      18: ['tieneAlergias', 'alergias'], 19: ['enfermedadesCronicas', 'antecedentesMedicos'],
      22: ['tieneIntolerancia', 'describeIntolerancia', 'dietaAlimentaria']
    }
    const isValid = fieldsByStep[currentStep] ? await trigger(fieldsByStep[currentStep] as any) : true
    if (isValid) {
      let next = currentStep + 1
      if (next === 11 && rol === 'apoderado') next = 14
      if (next === 12 && (rol === 'apoderado' || rol === 'dirigente' || rol === 'guiadora')) next = 14
      if (next === 13 && (rol === 'apoderado' || rol === 'dirigente' || rol === 'guiadora')) next = 14
      if (next === 14 && (rol !== 'apoderado' && rol !== 'dirigente' && rol !== 'guiadora')) next = 15
      if (next >= 16 && next <= 22 && rol === 'apoderado') next = 23
      setCurrentStep(next); window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    let prev = currentStep - 1
    if (currentStep === 14 && (rol === 'apoderado' || rol === 'dirigente' || rol === 'guiadora')) prev = 10
    if (currentStep === 15 && (rol !== 'apoderado' && rol !== 'dirigente' && rol !== 'guiadora')) prev = 13
    if (currentStep === 23 && rol === 'apoderado') prev = 14
    setCurrentStep(prev); window.scrollTo(0, 0)
  }

  const onSubmit = async (data: z.infer<typeof registroSchema>) => {
    setIsSubmitting(true)
    setRegistroError(null)
    try {
      // 1. Crear Usuario en Supabase Auth usando el RUT como identificador (alias)
      const emailAlias = `${data.rut.toLowerCase()}@nuamana.cl`;
      
      const { data: auth, error: authE } = await supabase.auth.signUp({
        email: emailAlias,
        password: data.password,
        options: {
          data: {
            nombres: data.nombres,
            apellidos: data.apellidos,
            email_real: data.email // Guardamos el real tmb en metadata de auth por seguridad
          }
        }
      })

      if (authE) throw authE
      if (!auth.user) throw new Error("No se pudo crear la cuenta de usuario.")

      // 2. Mapear roles y unidades
      const rolMap: Record<string, number> = { 'dirigente': 2, 'guiadora': 3, 'apoderado': 8, 'lobato (a)': 9, 'guia': 10, 'scout': 11, 'pionera (o)': 12, 'caminante': 13 }
      const unidadMap: Record<string, number> = { 'Manada': 1, 'CompaÃ±Ã­a': 2, 'Tropa': 3, 'Avanzada': 4, 'Clan': 5 }

      // 3. Crear Perfil en la tabla 'perfiles' (Usando el email REAL del paso 7)
      const { error: pE } = await supabase.from('perfiles').insert([{
        id: auth.user.id,
        rol_id: rolMap[data.rol],
        unidad_id: data.unidad ? unidadMap[data.unidad] : null,
        apoderado_id: data.apoderado_id_vinculado || null, // VÃ­nculo formal guardado
        estado: (data.rol === 'dirigente' || data.rol === 'guiadora') ? 'pendiente' : 'activo',
        nombres: data.nombres,
        apellidos: data.apellidos,
        nombre_social: data.nombreSocial,
        nacionalidad: data.nacionalidad,
        rut: data.rut,
        telefono: data.telefono,
        fecha_nacimiento: data.fechaNacimiento,
        email: data.email, 
        direccion: data.direccion,
        comuna: data.comuna,
        zona: data.zona,
        distrito: data.distrito,
        sexo: data.sexo,
        religion: data.religion,
        pertenece_grupo_nua_mana: data.perteneceNuaMana === 'GuÃ­as y Scouts Nua Mana',
        nombre_grupo: data.perteneceNuaMana,
        colegio: data.colegio,
        nivel_educacional: data.nivelEducacional,
        nombre_apoderado_contacto: data.nombreApoderado,
        relacion_apoderado_contacto: data.relacionApoderado,
        telefono_apoderado_contacto: data.telefonoApoderado,
        sistema_salud: data.sistemaSalud,
        detalle_sistema_salud: data.detalleSalud,
        seguro_complementario: data.seguroComplementario === 'si',
        nombre_seguro_complementario: data.nombreSeguroComplementario,
        tipo_sangre: data.tipoSangre,
        tiene_alergias: data.tieneAlergias === 'si',
        alergias: data.alergias,
        enfermedades_cronicas_json: data.enfermedadesCronicas,
        antecedentes_medicos: data.antecedentesMedicos,
        tiene_intolerancia: data.tieneIntolerancia === 'si',
        describe_intolerancia: data.describeIntolerancia,
        tratamientos_medicos: data.tratamientosMedicos,
        medicamentos: data.medicamentos,
        dieta_alimentaria: data.dietaAlimentaria,
        autoriza_fotos: data.autorizaFotos === 'si',
        fe_publica: data.fePublica === 'si'
      }])

      if (pE) throw new Error("Error al crear perfil: " + pE.message)

      // 4. Insertar Contactos de Emergencia
      if (data.contactosEmergencia && data.contactosEmergencia.length > 0) {
        const contactos = data.contactosEmergencia
          .filter((c) => c.nombre && c.telefono)
          .map((c) => ({
            perfil_id: auth.user!.id,
            nombre: c.nombre,
            relacion: c.relacion,
            telefono: c.telefono
          }))
        
        if (contactos.length > 0) {
          const { error: ceE } = await supabase.from('contactos_emergencia').insert(contactos)
          if (ceE) console.error("Error guardando contactos:", ceE.message)
        }
      }

      // 5. Enviar correo de bienvenida al correo REAL registrado
      try {
        await fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: data.email,
            nombres: data.nombres,
            apellidos: data.apellidos,
            rut: data.rut,
            rol: data.rol
          })
        });
      } catch (emailErr) {
        console.error('Error al intentar enviar el correo de bienvenida:', emailErr);
      }

      toast.info('Â¡Datos validados con Ã©xito!')

      // Si es dirigente o guiadora, cerramos la sesiÃ³n automÃ¡tica de Supabase
      if (data.rol === 'dirigente' || data.rol === 'guiadora') {
        await supabase.auth.signOut()
        toast.success('Registro completado. Tu cuenta de ' + data.rol + ' estÃ¡ en revisiÃ³n por la directiva. Te avisaremos cuando sea activada.')
        window.location.href = '/login'
      } else {
        toast.info('Â¡Bienvenido a Nua Mana! Ya puedes acceder a tu panel.')
        window.location.href = '/panel'
      }
    } catch (e: unknown) {
      setRegistroError(e instanceof Error ? e.message : 'Error desconocido')
      toast.error('Error en el registro: ' + (e instanceof Error ? e.message : e))
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle = "w-full bg-zinc-50 dark:bg-clr3 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-2xl p-4 font-bold outline-none transition-all shadow-inner";
  const infoBoxStyle = "mt-6 text-[0.9em] text-zinc-900 dark:text-clr10 bg-zinc-50 dark:bg-clr3 p-4 border border-clr10 dark:border-clr4 rounded-2xl leading-relaxed italic";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-clr4 font-body transition-colors">
      <SecondaryHeader />
      <main className="max-w-[1080px] mx-auto px-6 py-32 flex justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-clr5 rounded-[1rem] p-2 md:p-4 shadow-2xl border border-clr10 dark:border-clr4 animate-in fade-in zoom-in duration-700">
          <div className="mb-12 space-y-4">
            <div className="flex justify-between items-end">
              <h1 className="text-2xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter leading-none">InscripciÃ³n Nua Mana</h1>
              <span className="text-[0.8em] font-black text-clr2 uppercase tracking-widest">Paso {currentStep} de 25</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-clr7 transition-all duration-700 ease-out" style={{ width: `${(currentStep / 25) * 100}%` }} />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-[#1b1b1b]">
            {currentStep === 1 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-4">Bienvenido al Registro</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Para comenzar, necesitamos la contraseÃ±a de registro que fue compartida con el grupo de apoderados.</p>
                <input type="password" {...register('claveAutorizacion')} className="w-full bg-zinc-50 dark:bg-black/20 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-2xl p-5 text-2xl tracking-[0.5em] text-center outline-none transition-all shadow-inner" />
                {errors.claveAutorizacion && <p className="mt-4 text-clr7 text-[1em] font-black uppercase text-center">{(errors.claveAutorizacion as any).message}</p>}
                <p className={infoBoxStyle}>La clave de autorizaciÃ³n de registro o clave de autorizaciÃ³n para registrarse fue compartida al grupo de apoderados en Whatsapp si tiene dudas consulte con el dirigente a cargo de la unidad de la niÃ±a, niÃ±o o joven.</p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿QuÃ© tipo de usuario eres?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Elige el tipo de usuario que estÃ¡s registrando en nuestro sitio web.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['lobato (a)', 'guia', 'scout', 'pionera (o)', 'caminante', 'dirigente', 'guiadora', 'apoderado'].map(r => (
                    <label key={r} className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${rol === r ? 'border-clr7 bg-clr7/5' : 'border-zinc-100 dark:border-clr4 hover:border-clr7/30'}`}>
                      <input type="radio" value={r} {...register('rol')} className="hidden" />
                      <span className="font-bold uppercase text-[0.8em] tracking-widest text-clr5 dark:text-dclr2">{r}</span>
                    </label>
                  ))}
                </div>

                <p className={infoBoxStyle}>Selecciona un tipo de usuario de la lista. <br></br><br></br>De acuerdo a la opciÃ³n seleccionada los campos de mÃ¡s adelante serÃ¡n diferentes, por esto es fundamental que elijas adecuadamente. <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
                {(rol === 'dirigente' || rol === 'guiadora') && (
                  <p className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-200 text-xs font-bold rounded-2xl border border-amber-100 dark:border-amber-900/40">Nota: El registro como {rol} serÃ¡ validado manualmente por la directiva.</p>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es tÃº Nombre?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">CuÃ©ntanos cuÃ¡l es tu nombre.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Nombres</label>
                    <input {...register('nombres')} placeholder="Nombres" className={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Apellidos</label>
                    <input {...register('apellidos')} placeholder="Apellidos" className={inputStyle} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Â¿CÃ³mo te dicen? (Nombre Social)</label>
                    <input {...register('nombreSocial')} placeholder="Ej: Nacho, Maite..." className={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Nacionalidad</label>
                    <select {...register('nacionalidad')} className={inputStyle}>
                      {nacionalidades.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <p className={infoBoxStyle}>Escribe el nombre completo de la persona que se estÃ¡ registrando. Si tienes un nombre social o un apodo por el cual prefieres que te llamen, indÃ­calo tambiÃ©n. <br></br><br></br><span className="font-black text-clr7">* Los campos de Nombre y Apellido son obligatorios</span></p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es tÃº R.U.N.?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">CuÃ©ntanos cuÃ¡l es tu R.U.N. o R.U.T.</p>
                <input {...register('rut')} placeholder="12345678-9" onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  let v = e.currentTarget.value.toUpperCase().replace(/[^0-9K]/g, ''); if (v.length > 1) v = v.slice(0, -1) + '-' + v.slice(-1); e.currentTarget.value = v
                }} className="w-full bg-zinc-50 dark:bg-black/20 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-2xl p-5 text-2xl tracking-[0.2em] font-bold text-center outline-none transition-all shadow-inner" />
                {errors.rut && <p className="mt-4 text-clr7 text-[0.8em] font-black uppercase text-center">{(errors.rut as any).message}</p>}
                <p className={infoBoxStyle}>Escribe el R.U.T. o R.U.N., de la persona que se esta registrando, sin puntos y con guiÃ³n y dÃ­gito verificador, por ejemplo, 12345678-9. <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es tu telÃ©fono?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Escribe el nÃºmero de telÃ©fono de la persona que estÃ¡s registrando, NO del apoderado</p>
                <input type="tel" {...register('telefono')} placeholder="+56 9..." onInput={(e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value = aplicarMascaraTelefono(e.currentTarget.value)} className={inputStyle} />
                <p className={infoBoxStyle}>Si la persona que esta registrando es un niÃ±o o niÃ±a y no tiene telÃ©fono mÃ³vil, o usted como adulta o adulto no quiere entregar esta informaciÃ³n, <span className="font-black text-clr7">NO coloque el telÃ©fono del apoderado aquÃ­</span> para esa informaciÃ³n hay un espacio mÃ¡s adelante. <br></br><br></br><span className="font-black text-clr7">* Este campo es opcional</span></p>
              </div>
            )}

            {currentStep === 6 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡ndo Naciste?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Selecciona en el cuadro tu fecha de nacimiento</p>
                <input type="date" {...register('fechaNacimiento')} className={inputStyle} />
                <p className={infoBoxStyle}>Ingrese la fecha de nacimiento de la persona que estÃ¡ registrando <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 7 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es tu Correo?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Escribe tu correo electrÃ³nico, con este correo podrÃ¡s luego restablecer tu contraseÃ±a y/o iniciar sesiÃ³n en la pÃ¡gina.</p>
                <input type="email" {...register('email')} placeholder="email@dominio.com" className={inputStyle} />
                <p className={infoBoxStyle}>Ingrese el correo electrÃ³nico de la persona que esta registrando<br></br><br></br>El correo electrÃ³nico es obligatorio ya que es necesario en caso de necesitar restablecer la contraseÃ±a de la pÃ¡gina o donde se enviaran las copias de formulario y autorizaciones que complete, el correo tiene un formato nombre@dominio.extensiÃ³n. <br></br><br></br>En caso de ser menor de edad y no tener un correo electrÃ³nico puede completar este campo con el RUT y el dominio del grupo, Ejemplo: 12345678-9@nuamana.cl <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 8 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿DÃ³nde vives?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Escribe la direcciÃ³n y comuna donde vive de la persona que estas registrando.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2"><input {...register('direccion')} placeholder="DirecciÃ³n" className={inputStyle} /></div>
                  <select {...register('comuna')} className={inputStyle}>{comunas.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
                <p className={infoBoxStyle}>Escribe la DirecciÃ³n y selecciona la Comuna de la persona que se estÃ¡ registrando en nuestro grupo, esta informaciÃ³n es necesaria para poder hacer el registro y ambos campos son obligatorios. <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 9 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es la asignaciÃ³n Femenina/Masculina entregada al nacer?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">selecciona de la lista la asignaciÃ³n que se te entrego al nacer.</p>
                <div className="flex gap-4">
                  {['femenina', 'masculina'].map(s => (
                    <label key={s} className="flex-1 p-4 border rounded-2xl text-center cursor-pointer font-bold uppercase text-xs tracking-widest hover:border-clr7 dark:text-dclr2"><input type="radio" value={s} {...register('sexo')} className="mr-2" /> {s}</label>
                  ))}
                </div>
                <p className={infoBoxStyle}>Selecciona la asignaciÃ³n femenina/masculina entregada al nacer de la persona que estÃ¡s registrando. <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 10 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CÃºal es tu CondiciÃ³n Religiosa?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Selecciona de la lista tu religiÃ³n o creencia espiritual.</p>
                <select {...register('religion')} className={inputStyle}>
                  {religiones.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <p className={infoBoxStyle}>Seleccione la creencia espiritual de la persona que estÃ¡ registrando. <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 11 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es tu informaciÃ³n Scout?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Grupo</label>
                    <div className="flex flex-col gap-2">
                      {['GuÃ­as y Scouts Nua Mana', 'Otro'].map(g => (
                        <label key={g} className="flex items-center gap-2 font-bold dark:text-dclr2 text-[1em]">
                          <input type="radio" value={g} {...register('perteneceNuaMana')} /> {g}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Unidad</label>
                    <select {...register('unidad')} className={inputStyle}>{unidades.map(u => <option key={u} value={u}>{u}</option>)}</select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Zona Administrativa</label>
                    <select {...register('zona')} className={inputStyle}>
                      {Object.keys(zonasDistritos).map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Distrito</label>
                    <select {...register('distrito')} className={inputStyle}>
                      {zonasDistritos[zonaSeleccionada || 'Santiago Sur']?.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <p className={infoBoxStyle}>Indica la Zona y Distrito administrativo de la AsociaciÃ³n de GuÃ­as y Scouts de Chile a la que pertenece tu grupo. Normalmente es Zona "La Florida" y Distrito "Mapurayen". <br></br><br></br><span className="font-black text-clr7">* Estos campos son obligatorios</span></p>
              </div>
            )}

            {currentStep === 12 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es tu informaciÃ³n Escolar?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Seleccione un colegio de la lista para fines estadÃ­sticos del grupo, y ademÃ¡s seleccione el nivel educacional en el que estÃ¡ actualmente la niÃ±a, niÃ±o o joven que se esta registrando.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <select {...register('colegio')} className={inputStyle}>{colegios.map(c => <option key={c} value={c}>{c}</option>)}</select>
                  <select {...register('nivelEducacional')} className={inputStyle}>
                    {['EducaciÃ³n BÃ¡sica', 'EducaciÃ³n Media', 'EducaciÃ³n Superior', 'Egresado'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <p className={infoBoxStyle}>Seleccione el colegio al que asiste el niÃ±o, niÃ±a o joven, e indique el nivel educacional en el que se encuentra el curso que actualmente estÃ¡ cursando.<br></br><br></br><span className="font-black text-clr7">* Estos campos son obligatorios</span></p>
              </div>
            )}

            {currentStep === 13 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es la informaciÃ³n de la apoderada (o)?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Complete la informaciÃ³n sobre la o el apoderado (a).</p>
                <div className="space-y-4">
                  <input {...register('nombreApoderado')} placeholder="Nombre Apoderado" className={inputStyle} />
                  <div className="grid grid-cols-2 gap-4">
                    <select {...register('relacionApoderado')} className={inputStyle}>{relaciones.map(r => <option key={r} value={r}>{r}</option>)}</select>
                    <input type="tel" {...register('telefonoApoderado')} placeholder="+56 9..." onInput={(e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value = aplicarMascaraTelefono(e.currentTarget.value)} className={inputStyle} />
                  </div>
                </div>
                <p className={infoBoxStyle}>Indica los datos de tu apoderada (o), un telÃ©fono donde ubicarla y selecciona la relaciÃ³n o parentesco que tiene contigo. estos datos serÃ¡n agregados a los grupos de whatsapp del grupo.<br></br><br></br><span className="font-black text-clr7">* Estos campos son obligatorios</span></p>
              </div>
            )}

            {currentStep === 14 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿QuiÃ©nes son tus pupilos?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Indica los nombres de las personas de quien eres apoderada (o)</p>
                <div className="space-y-4">
                  {pupiloFields.map((f, i) => (
                    <div key={f.id} className="p-6 bg-zinc-50 dark:bg-black/20 rounded-3xl border border-clr10 dark:border-clr4 space-y-4 shadow-inner">
                      <input {...register(`pupilos.${i}.nombre` as const)} placeholder="Nombre completo del niÃ±o/a" className={inputStyle} />
                      <div className="grid grid-cols-2 gap-4">
                        <select {...register(`pupilos.${i}.relacion` as const)} className={inputStyle}>{relaciones.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        <select {...register(`pupilos.${i}.unidad` as const)} className={inputStyle}>{unidades.map(u => <option key={u} value={u}>{u}</option>)}</select>
                      </div>
                      {i > 0 && <button type="button" onClick={() => removePupilo(i)} className="text-clr7 text-[0.8em] font-black uppercase tracking-widest ml-4">Eliminar</button>}
                    </div>
                  ))}
                  <button type="button" onClick={() => appendPupilo({})} className="w-full py-4 border-2 border-dashed border-clr10 dark:border-clr4 rounded-[2rem] text-zinc-400 font-bold uppercase text-[0.8em] tracking-widest hover:text-clr7 transition-all">+ Agregar Pupilo</button>
                </div>
                <p className={infoBoxStyle}>Indica los datos de la pupila (o) tu relaciÃ³n o parentesco con el pupilo, y la unidad a la que pertenece.<br></br><br></br>Seleccione la unidad a la que pertenece la niÃ±a, niÃ±o o joven de acuerdo a la edad del mismo.<br></br><br></br><b>Manada</b> - niÃ±os y niÃ±as entre 7 y 11 aÃ±os (unidad mixta).<br></br><b>CompaÃ±Ã­a</b> - niÃ±as y jÃ³venes mujeres entre 11 y 15 aÃ±os (unidad femenina).<br></br><b>Tropa</b> - niÃ±os y jÃ³venes entre 11 y 15 aÃ±os (unidad masculina).<br></br><b>Avanzada</b> - jÃ³venes entre 15 y 17 aÃ±os (unidad mixta).<br></br><b>Clan</b> - jÃ³venes entre 17 y 20 aÃ±os (unidad mixta).<br></br><br></br><span className="font-black text-clr7">* Estos campos son obligatorios</span></p>
              </div>
            )}

            {currentStep === 15 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿A quien llamamos en Caso de Emergencia?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">IndÃ­canos detalles de a quien avisar en caso de una emergencia</p>
                <div className="space-y-4">
                  {emergencyFields.map((f, i) => (
                    <div key={f.id} className="p-6 bg-zinc-50 dark:bg-black/20 rounded-3xl border border-clr10 dark:border-clr4 space-y-4 shadow-inner">
                      <input {...register(`contactosEmergencia.${i}.nombre` as const)} placeholder="Nombre Contacto" className={inputStyle} />
                      <div className="grid grid-cols-2 gap-4">
                        <select {...register(`contactosEmergencia.${i}.relacion` as const)} className={inputStyle}>{relaciones.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        <input type="tel" {...register(`contactosEmergencia.${i}.telefono` as const)} placeholder="+56 9..." onInput={(e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value = aplicarMascaraTelefono(e.currentTarget.value)} className={inputStyle} />
                      </div>
                      {i > 0 && <button type="button" onClick={() => removeEmergency(i)} className="text-clr7 text-[0.8em] font-black uppercase tracking-widest ml-4">Eliminar</button>}
                    </div>
                  ))}
                  <button type="button" onClick={() => appendEmergency({})} className="w-full py-4 border-2 border-dashed border-clr10 dark:border-clr4 rounded-[2rem] text-zinc-400 font-bold uppercase text-[0.8em] tracking-widest hover:text-clr7 transition-all">+ Agregar Contacto</button>
                </div>
                <p className={infoBoxStyle}>Agrega los datos de contactos de emergencia donde podamos dar aviso en caso de alguna situaciÃ³n.<br></br><br></br><span className="font-black text-clr7">* Estos campos son obligatorios</span></p>
              </div>
            )}

            {currentStep === 16 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l es tu Sistema de Salud?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">IndÃ­canos detalles de tu sistema de salud.</p>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">PrevisiÃ³n</label>
                    <select {...register('sistemaSalud')} className={inputStyle}>
                      <option value="">Selecciona...</option>
                      {['FONASA', 'Isapre', 'Particular', 'Fuerzas Armadas'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  {(sistemaSalud === 'Isapre' || sistemaSalud === 'Particular') && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-4">Nombre de la Isapre u Otro</label>
                      <input {...register('detalleSalud')} placeholder="Ej: Colmena, BanmÃ©dica..." className={inputStyle} />
                    </div>
                  )}

                  <div className="p-6 bg-zinc-50 dark:bg-black/10 rounded-3xl border border-clr10 dark:border-clr4">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-2 mb-4 block">Â¿Tienes Seguro Complementario?</label>
                    <div className="flex gap-4 mb-4">
                      {['si', 'no'].map(o => (
                        <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.8em] transition-all ${seguroComp === o ? 'border-clr7 bg-clr7/5' : 'border-zinc-200 dark:border-clr4'}`}>
                          <input type="radio" value={o} {...register('seguroComplementario')} className="hidden" /> {o}
                        </label>
                      ))}
                    </div>
                    {seguroComp === 'si' && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <input {...register('nombreSeguroComplementario')} placeholder="Nombre del Seguro" className={inputStyle} />
                        <p className="text-[0.8em] text-clr7 font-bold italic ml-2">* Debe adjuntar documentaciÃ³n del seguro complementario</p>
                      </div>
                    )}
                  </div>
                </div>
                <p className={infoBoxStyle}>Esta informaciÃ³n es necesaria para que en caso de emergencia podamos dirigirnos rÃ¡pidamente al centro de urgencia adecuado.<br></br><br></br><span className="font-black text-clr7">* Estos campos son obligatorios.</span></p>
              </div>
            )}

            {currentStep === 17 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 text-center">Â¿CuÃ¡l es tu tipo de sangre?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Este dato puede salvar tu vida</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-', 'No Sabe'].map(s => (
                    <label key={s} className="p-4 border-2 border-zinc-100 dark:border-clr4 rounded-2xl text-center font-bold cursor-pointer hover:border-clr7 dark:text-dclr2"><input type="radio" value={s} {...register('tipoSangre')} className="mr-2" /> {s}</label>
                  ))}
                </div>
                <p className={infoBoxStyle}>Indique el tipo de sangre, este es un dato vital en caso de una emergencia mÃ©dica. <br></br><br></br><span className="font-black text-clr7">* Esto es Obligatorio</span></p>
              </div>
            )}

            {currentStep === 18 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿Tienes alguna Alergia?</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    {['si', 'no'].map(o => (
                      <label key={o} className={`flex-1 p-4 border-2 rounded-2xl text-center cursor-pointer font-bold uppercase text-xs tracking-widest transition-all ${tieneAlergias === o ? 'border-clr7 bg-clr7/5' : 'border-zinc-100 dark:border-clr4'}`}>
                        <input type="radio" value={o} {...register('tieneAlergias')} className="hidden" /> {o}
                      </label>
                    ))}
                  </div>
                  {tieneAlergias === 'si' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <textarea {...register('alergias')} className={inputStyle + " h-40 resize-none"} placeholder="Describe alergias a medicamentos, alimentos u otros..." />
                    </div>
                  )}
                </div>
                <p className={infoBoxStyle}>Indique si posee alguna alergia relevante. Si marcÃ³ "NO" y luego tiene un cambio, podrÃ¡ actualizarlo en su perfil.<br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 19 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Enfermedades CrÃ³nicas</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Selecciona si tienes enfermedades crÃ³nicas o importantes.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {enfermedadesOpciones.map(e => (
                    <label key={e} className="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-zinc-50 dark:text-dclr2 text-[12px] font-bold">
                      <input type="checkbox" value={e} {...register('enfermedadesCronicas')} className="mr-2" /> {e}
                    </label>
                  ))}
                </div>
                <textarea {...register('antecedentesMedicos')} className={inputStyle + " h-32 resize-none"} placeholder="Detalle adicional o cirugÃ­as de relevancia..." />
                <p className={infoBoxStyle}>Si no presenta ninguna enfermedad ni cirugÃ­a, por favor marque "Ninguna" y escriba "NO TIENE" en el cuadro.<br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span>.</p>
              </div>
            )}

            {currentStep === 20 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿EstÃ¡ haciendo algÃºn Tratamiento MÃ©dico?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Dinos si tienes alguna informaciÃ³n medica relevante, si tienes algÃºn tratamiento especial</p>
                <textarea {...register('tratamientosMedicos')} className={inputStyle + " h-40 resize-none"} placeholder="Â¿Realiza algÃºn tratamiento mÃ©dico actualmente?" />
                <p className={infoBoxStyle}>DescripciÃ³n de cuidados mÃ©dicos necesarios. Si no tiene cuidados mÃ©dicos especiales, por favor escriba <b>NINGUNO</b>.<br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 21 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿EstÃ¡ consumiendo algÃºn medicamento?</h2>
                <p className="text-clr2 text-[1em] font-bold mb-8">Dinos si consumes algÃºn medicamento con regularidad, dinos los horarios y/o frecuencias</p>
                <textarea {...register('medicamentos')} className={inputStyle + " h-40 resize-none"} placeholder="Â¿Consume algÃºn fÃ¡rmaco regularmente? Indique horarios." />
                <p className={infoBoxStyle}>Indique si estÃ¡ consumiendo algÃºn Tipo de medicamento <br></br><br></br>(**indique cual y su horario**) <br></br><br></br>Si no consume, por favor escriba <b>No Consume</b>.<br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 22 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 text-center">Dieta e Intolerancias</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['MenÃº General', 'MenÃº Vegetariano', 'MenÃº Vegano', 'Celiaco', 'Intolerante Lactosa'].map(d => (
                      <label key={d} className="p-3 border rounded-xl font-bold cursor-pointer hover:bg-zinc-50 dark:text-dclr2 text-[12px]">
                        <input type="checkbox" value={d} {...register('dietaAlimentaria')} className="mr-2" /> {d}
                      </label>
                    ))}
                  </div>

                  <div className="p-6 bg-zinc-50 dark:bg-black/10 rounded-3xl border border-clr10 dark:border-clr4">
                    <label className="text-[0.8em] font-black uppercase text-clr2 tracking-widest ml-2 mb-4 block">Â¿Tienes Intolerancia Alimentaria?</label>
                    <div className="flex gap-4 mb-4">
                      {['si', 'no'].map(o => (
                        <label key={o} className={`flex-1 p-3 border-2 rounded-xl text-center cursor-pointer font-bold uppercase text-[0.8em] transition-all ${tieneIntol === o ? 'border-clr7 bg-clr7/5' : 'border-zinc-200 dark:border-clr4'}`}>
                          <input type="radio" value={o} {...register('tieneIntolerancia')} className="hidden" /> {o}
                        </label>
                      ))}
                    </div>
                    {tieneIntol === 'si' && (
                      <input {...register('describeIntolerancia')} placeholder="Â¿A quÃ© alimento eres intolerante?" className={inputStyle} />
                    )}
                  </div>
                </div>
                <p className={infoBoxStyle}>Selecciona el tipo de comida que consumes. Esta respuesta es fundamental para establecer el menÃº de campamento. <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            {currentStep === 23 && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8 text-center">Uso de Imagen</h2>
                <p className={infoBoxStyle}>Esto incluye el uso de la imagen y la voz de la persona registrada para promover, difundir y documentar las actividades, eventos y programas de <b>GuÃ­as y Scouts Nua Mana</b>. La imagen y voz podrÃ¡n ser utilizadas en materiales informativos, educativos, promocionales, comerciales o para cualquier otro fin que <b>GuÃ­as y Scouts Nua Mana</b> estime conveniente, sin limitaciÃ³n de tiempo o de territorios. Esto incluye, pero no se limita a, impresiones, publicaciones digitales, sitios web, redes sociales y otros medios o plataformas, actuales o futuros.<br></br><br></br>Declaro que la persona registrada ha sido informado sobre esta autorizaciÃ³n, que asiente y se encuentra de acuerdo con la utilizaciÃ³n de su imagen y voz.<br></br><br></br>Reconozco y acepto que <b>GuÃ­as y Scouts Nua Mana</b> tiene el derecho de editar, modificar, adaptar y alterar el material audiovisual y grÃ¡fico de acuerdo con sus necesidades, respetando siempre los principios de moral y buenas costumbres. Entiendo que <b>GuÃ­as y Scouts Nua Mana</b> puede optar por no utilizar el material capturado o utilizar solo una parte de este, y que no tengo derecho a recibir compensaciÃ³n econÃ³mica alguna por el uso de dicho material. Aunque la autorizaciÃ³n es amplia, tengo el derecho de solicitar la eliminaciÃ³n de la imagen y voz de la persona registrada de futuros materiales mediante notificaciÃ³n escrita a quien corresponda en <b>GuÃ­as y Scouts Nua Mana</b> (Nivel Grupal, Distrital, Zonal o Nacional), quien procederÃ¡ a efectuar la eliminaciÃ³n en un plazo razonable.<br></br><br></br>Declaro que he leÃ­do y comprendido en su totalidad el contenido de este documento y confirmo que soy la tutora o el tutor legal, de la persona registrada mencionada, con la capacidad legal para otorgar esta autorizaciÃ³n.</p>
                <div className="flex justify-center gap-10 mt-10">
                  <label className="flex items-center gap-2 font-black dark:text-dclr2"><input type="radio" value="si" {...register('autorizaFotos')} /> AUTORIZO</label>
                  <label className="flex items-center gap-2 font-black dark:text-dclr2"><input type="radio" value="no" {...register('autorizaFotos')} /> NO AUTORIZO</label>
                </div>
              </div>
            )}

            {currentStep === 24 && (
              <div className="animate-in fade-in duration-500 text-center">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">FÃ© PÃºblica</h2>
                <p className="text-lg font-bold text-clr2 mb-8 italic">Doy fe que los datos contenidos en esta Ficha son verdaderos y no he omitido ninguna informaciÃ³n importante.</p>
                <div className="flex justify-center gap-10">
                  <label className="flex items-center gap-2 font-black dark:text-dclr2"><input type="radio" value="si" {...register('fePublica')} /> SÃ</label>
                  <label className="flex items-center gap-2 font-black dark:text-dclr2"><input type="radio" value="no" {...register('fePublica')} /> NO</label>
                </div>
              </div>
            )}

            {currentStep === 25 && (
              <div className="animate-in fade-in duration-500 text-center">
                <h2 className="text-3xl font-black font-display text-clr5 dark:text-dclr2 uppercase tracking-tighter mb-8">Â¿CuÃ¡l serÃ¡ tu ContraseÃ±a?</h2>
                <div className="space-y-4">
                  <input type="password" {...register('password')} className="w-full bg-zinc-50 dark:bg-black/20 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-2xl p-5 text-2xl tracking-[0.5em] text-center outline-none transition-all shadow-inner" placeholder="â€¢â€¢â€¢â€¢" />
                  <input type="password" {...register('confirmPassword')} className="w-full bg-zinc-50 dark:bg-black/20 dark:text-dclr2 border-2 border-transparent focus:border-clr7 rounded-2xl p-5 text-2xl tracking-[0.5em] text-center outline-none transition-all shadow-inner" placeholder="â€¢â€¢â€¢â€¢" />
                  {errors.confirmPassword && <p className="text-clr7 text-[0.8em] font-black uppercase mt-2">{(errors.confirmPassword as any).message}</p>}
                </div>
                <p className={infoBoxStyle}>Crea una contraseÃ±a segura para tu cuenta.<br></br><br></br> La contraseÃ±a debe tener al menos 6 caracteres, no puede ser nÃºmeros consecutivos, y debe tener al menos una mayÃºscula y un nÃºmero. <br></br><br></br><span className="font-black text-clr7">* Este campo es obligatorio</span></p>
              </div>
            )}

            <div className="flex justify-between pt-12 border-t border-zinc-100 dark:border-clr4">
              {currentStep > 1 ? (
                <button type="button" onClick={prevStep} className="px-8 py-4 text-clr2 font-black uppercase text-[0.8em] tracking-widest hover:text-clr7 transition-colors">â† AtrÃ¡s</button>
              ) : <div />}
              <div className="ml-auto">
                {currentStep < 25 ? (
                  <button type="button" onClick={nextStep} className="px-12 py-4 bg-clr7 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-[0.8em]">Continuar â†’</button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="px-12 py-4 bg-green-600 text-white font-black uppercase rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all tracking-widest text-[0.8em]">Completar Registro</button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function RegistroPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-display uppercase italic text-clr2">Cargando formulario...</div>}>
      <RegistroContent />
    </Suspense>
  )
}

