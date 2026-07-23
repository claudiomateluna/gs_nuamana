import { PDFDocument, rgb, StandardFonts, type PDFForm, type PDFPage } from 'pdf-lib';
import { format, parseISO, differenceInYears } from 'date-fns';
import { toast } from 'sonner';

interface AuthData {
  tipo_formulario: string;
  nombre_firmante: string;
  rut_firmante: string;
  actividad_nombre: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  lugar?: string;
  firma_digital_b64?: string;
}

interface ContactoEmergencia {
  nombre: string;
  relacion: string;
  telefono: string;
}

interface PerfilData {
  fecha_nacimiento?: string;
  nombres: string;
  apellidos: string;
  rut?: string;
  nombre_social?: string;
  nacionalidad?: string;
  sexo?: string;
  unidades?: { nombre: string };
  zona?: string;
  distrito?: string;
  sistema_salud?: string;
  tipo_sangre?: string;
  alergias?: string;
  medicamentos?: string;
  detalle_sistema_salud?: string;
  contactos_emergencia?: ContactoEmergencia[];
}

interface Hospitalizacion {
  motivo: string;
  fecha: string;
}

interface Cirugia {
  nombre: string;
  fecha: string;
}

interface FichaMedicaData {
  lista_hospitalizaciones?: Hospitalizacion[];
  lista_cirugias?: Cirugia[];
  estatura_m?: number;
  peso_kg?: number;
  seguro_complementario?: string;
  intolerancia_alimentaria?: string;
  otras_cronicas?: string;
  medicamentos_detalle?: string;
  salud_mental_diagnostico?: string;
  salud_mental_medicamentos?: string;
  salud_mental_profesional?: string;
  salud_mental_contacto?: string;
  salud_mental_tratamiento?: string;
  malestares_recientes?: string;
  tratamiento_reciente_fecha?: string;
  tratamiento_reciente?: string;
  contacto_infecto?: boolean;
  contacto_infecto_detalle?: string;
  viajes_extranjero?: string;
  vacunas_al_dia?: boolean;
  vacunas_extra?: string;
  menstruaciones?: boolean;
  ciclo_regular?: boolean;
  dismenorrea?: boolean;
  embarazo?: boolean;
  embarazo_semana?: string;
  metodo_anticonceptivo?: string;
  medicamento_colicos?: string;
  ultimo_control_dental?: string;
  tratamiento_dental_detalle?: string;
  tratamiento_dental_curso?: boolean;
  necesidades_especiales?: string;
  diagnostico_relevante_detalle?: string;
  presenta_diagnostico_relevante?: boolean;
  intereses_disfrute?: string;
  situaciones_estres?: string;
  apoyo_comunicacion?: string;
  dificultades_sensoriales?: string;
  ayuda_organizacion?: string;
  otras_necesidades?: string;
  estrategias_calma?: string;
  observaciones_adicionales?: string;
  diabetes?: boolean;
  asma?: boolean;
  hipertension?: boolean;
  epilepsia?: boolean;
  enfermedad_renal?: boolean;
  enfermedad_autoinmune?: boolean;
  patologia_cardiaca?: boolean;
  hipo_hipertiroidismo?: boolean;
  tuberculosis?: boolean;
  alteraciones_sanguineas?: boolean;
  dolor_de_cabeza?: boolean;
  tiene_seguro_complementario?: boolean;
}

interface EspecialidadDefinicion {
  nombre: string;
}

interface EspecialidadData {
  nombre_personalizado?: string;
  especialidades_definiciones?: EspecialidadDefinicion;
  campo_interes?: string;
  fecha_entrega?: string;
  firma_monitor_b64?: string;
  firma_dirigente_b64?: string;
  fecha_fin?: string;
}

export async function generateOfficialPDF(auth: AuthData, perfil: PerfilData, fichaMedica: FichaMedicaData | null, shouldDownload = true) {
  try {
    const isMenor = auth.tipo_formulario === 'Menor de Edad';
    const pdfBaseUrl = isMenor 
      ? '/autorizacion/FichaMedicaAutorizacionesMenoresEdad.pdf' 
      : '/autorizacion/FichaMedicaAutorizacionMayoresEdad.pdf';
    
    const pdfUrl = `${pdfBaseUrl}?v=${Date.now()}`;

    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error('No se pudo cargar la plantilla PDF');
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const pages = pdfDoc.getPages();

    // 1. MAPEÓ DE TEXTOS (RESTAURADO AL 100% Y AMPLIADO)
    const fechaActual = format(new Date(), 'dd/MM/yyyy');
    const fechaNac = perfil.fecha_nacimiento ? format(parseISO(perfil.fecha_nacimiento), 'dd/MM/yyyy') : '---';
    const edad = perfil.fecha_nacimiento ? String(differenceInYears(new Date(), parseISO(perfil.fecha_nacimiento))) : '---';
    const contacts = perfil.contactos_emergencia || [];
    const hosps = fichaMedica?.lista_hospitalizaciones || [];
    const cirus = fichaMedica?.lista_cirugias || [];
    
    const fieldMapping: Record<string, string> = {
      // PÁGINA 1
      'current_date_p1': fechaActual,
      'nombre_firmante_p1': auth.nombre_firmante,
      'rut_firmante_p1': auth.rut_firmante,
      'nombre_beneficiario_p1': `${perfil.nombres} ${perfil.apellidos}`,
      'rut_beneficiario_p1': perfil.rut ?? '',
      'actividad_nombre_p1': auth.actividad_nombre,
      'actividad_fecha_inicial_p1': auth.fecha_inicio ? format(parseISO(auth.fecha_inicio), 'dd/MM/yyyy') : '',
      'actividad_fecha_final_p1': auth.fecha_fin ? format(parseISO(auth.fecha_fin), 'dd/MM/yyyy') : '',
      'actividad_lugar_p1': auth.lugar || '',
      'nombre_firmante_p1b': auth.nombre_firmante,
      'rut_firmante_p1b': auth.rut_firmante,
      'emerg_1_nom_p1': contacts[0]?.nombre || '',
      'emerg_1_par_p1': contacts[0]?.relacion || '',
      'emerg_1_tel_p1': contacts[0]?.telefono || '',
      'emerg_2_nom_p1': contacts[1]?.nombre || '',
      'emerg_2_par_p1': contacts[1]?.relacion || '',
      'emerg_2_tel_p1': contacts[1]?.telefono || '',
      'emerg_3_nom_p1': contacts[2]?.nombre || '',
      'emerg_3_par_p1': contacts[2]?.relacion || '',
      'emerg_3_tel_p1': contacts[2]?.telefono || '',

      // PÁGINA 2
      'nombre_beneficiario_p2': `${perfil.nombres} ${perfil.apellidos}`,
      'nombre_social_p2': perfil.nombre_social || '',
      'nacionalidad_p2': perfil.nacionalidad || 'Chilena',
      'sexo_p2': perfil.sexo || '',
      'rut_p2': perfil.rut ?? '',
      'fecha_nac_p2': fechaNac,
      'edad_p2': edad,
      'estatura_p2': String(fichaMedica?.estatura_m || ''),
      'peso_p2': String(fichaMedica?.peso_kg || ''),
      'grupo_p2': 'Nua Mana',
      'unidad_p2': perfil.unidades?.nombre || '',
      'zona_p2': perfil.zona || 'La Florida',
      'distrito_p2': perfil.distrito || 'Mapurayen',
      'emerg_1_nom_p2': contacts[0]?.nombre || '',
      'emerg_1_par_p2': contacts[0]?.relacion || '',
      'emerg_1_tel_p2': contacts[0]?.telefono || '',
      'emerg_2_nom_p2': contacts[1]?.nombre || '',
      'emerg_2_par_p2': contacts[1]?.relacion || '',
      'emerg_2_tel_p2': contacts[1]?.telefono || '',
      'emerg_3_nom_p2': contacts[2]?.nombre || '',
      'emerg_3_par_p2': contacts[2]?.relacion || '',
      'emerg_3_tel_p2': contacts[2]?.telefono || '',
      'detalle_salud_p2': perfil.detalle_sistema_salud || '',
      'nombre_seguro_p2': fichaMedica?.seguro_complementario || '',
      'grupo_sangre_p2': perfil.tipo_sangre || '',
      'detalle_alergias_p2': perfil.alergias || '',
      'detalle_intol_p2': fichaMedica?.intolerancia_alimentaria || '',
      'detalle_cronicas_p2': fichaMedica?.otras_cronicas || '',
      'medicamentos_gral_p2': fichaMedica?.medicamentos_detalle || perfil.medicamentos || '',

      // PÁGINA 3
      'detalle_mental_p3': fichaMedica?.salud_mental_diagnostico || '',
      'medicamentos_mental_p3': fichaMedica?.salud_mental_medicamentos || '',
      'profesional_mental_p3': fichaMedica?.salud_mental_profesional || '',
      'contacto_mental_p3': fichaMedica?.salud_mental_contacto || '',
      
      'hosp_motivo1_p3': hosps[0]?.motivo || '', 'hosp_fecha1_p3': hosps[0]?.fecha || '',
      'hosp_motivo2_p3': hosps[1]?.motivo || '', 'hosp_fecha2_p3': hosps[1]?.fecha || '',
      'hosp_motivo3_p3': hosps[2]?.motivo || '', 'hosp_fecha3_p3': hosps[2]?.fecha || '',
      
      'ciru_motivo1_p3': cirus[0]?.nombre || '', 'ciru_fecha1_p3': cirus[0]?.fecha || '',
      'ciru_motivo2_p3': cirus[1]?.nombre || '', 'ciru_fecha2_p3': cirus[1]?.fecha || '',
      'ciru_motivo3_p3': cirus[2]?.nombre || '', 'ciru_fecha3_p3': cirus[2]?.fecha || '',

      'malestar_detalle_p3': fichaMedica?.malestares_recientes || '',
      'tratamiento_fecha_p3': fichaMedica?.tratamiento_reciente_fecha || '',
      'medicamentos_tratamiento_p3': fichaMedica?.tratamiento_reciente || '',
      'infecto_detalle_p3': fichaMedica?.contacto_infecto_detalle || '',
      'viaje_pais_p3': fichaMedica?.viajes_extranjero || '',
      'otra_vacuna_detalle_p3': fichaMedica?.vacunas_extra || '',
      'med_disme_p3': fichaMedica?.medicamento_colicos || '',
      'met_anticonceptivo_p3': fichaMedica?.metodo_anticonceptivo || '',
      'embarazo_semana_p3': fichaMedica?.embarazo_semana || '',

      // PÁGINA 4-5-6
      'dental_fecha_ultimo_control_p4': fichaMedica?.ultimo_control_dental || '',
      'dental_tratamiento_detalle_p4': fichaMedica?.tratamiento_dental_detalle || '',
      'necesidades_especiales_p4': fichaMedica?.necesidades_especiales || '',
      'detalle_diag_relevante_p4': fichaMedica?.diagnostico_relevante_detalle || '',
      'situaciones_disfrute_p4': fichaMedica?.intereses_disfrute || '',
      'situaciones_estres_p4': fichaMedica?.situaciones_estres || '',
      'necesidad_especifica_comunicacion_p5': fichaMedica?.apoyo_comunicacion || '',
      'necesidad_especifica_sensorial_p5': fichaMedica?.dificultades_sensoriales || '',
      'necesidad_especifica_org_p5': fichaMedica?.ayuda_organizacion || '',
      'necesidad_especifica_otras_p5': fichaMedica?.otras_necesidades || '',
      'estrategias_calma_p5': fichaMedica?.estrategias_calma || '',
      'observaciones_adicionales_p5': fichaMedica?.observaciones_adicionales || '',
      'nombre_firmante_p5': auth.nombre_firmante,
      'telefono_firmante_p5': contacts[0]?.telefono || '',
      'fecha_firma_p5': fechaActual,
      'current_date_p6': fechaActual,
      'nombre_firmante_p6': auth.nombre_firmante,
      'rut_firmante_p6': auth.rut_firmante,
      'nombre_beneficiario_p6': `${perfil.nombres} ${perfil.apellidos}`,
      'rut_beneficiario_p6': perfil.rut ?? '',
    };

    // --- 2. MAPEÓ DE CHECKBOXES (EXTENDIDO) ---
    const checkboxMapping: Record<string, boolean | undefined> = {
      'chk_urgencia_si_p1': true,
      'chk_fonasa_p2': perfil.sistema_salud?.toUpperCase() === 'FONASA',
      'chk_isapre_p2': perfil.sistema_salud?.toUpperCase() === 'ISAPRE',
      'chk_otro_salud_p2': ['OTRO', 'PARTICULAR', 'FUERZAS ARMADAS'].includes(perfil.sistema_salud?.toUpperCase() || ''),
      'chk_seguro_si_p2': !!fichaMedica?.tiene_seguro_complementario,
      'chk_seguro_no_p2': fichaMedica?.tiene_seguro_complementario === false,
      'chk_alergia_si_p2': !!perfil.alergias && perfil.alergias !== 'Ninguna',
      'chk_alergia_no_p2': !perfil.alergias || perfil.alergias === 'Ninguna',
      'chk_intol_si_p2': !!fichaMedica?.intolerancia_alimentaria,
      'chk_intol_no_p2': !fichaMedica?.intolerancia_alimentaria,
      
      // Enfermedades
      'chk_diabetes_p2': !!fichaMedica?.diabetes, 'chk_asma_p2': !!fichaMedica?.asma,
      'chk_hiperten_p2': !!fichaMedica?.hipertension, 'chk_epilep_p2': !!fichaMedica?.epilepsia,
      'chk_renal_p2': !!fichaMedica?.enfermedad_renal, 'chk_autoimun_p2': !!fichaMedica?.enfermedad_autoinmune,
      'chk_cardiac_p2': !!fichaMedica?.patologia_cardiaca, 'chk_tiroides_p2': !!fichaMedica?.hipo_hipertiroidismo,
      'chk_tuber_p2': !!fichaMedica?.tuberculosis, 'chk_sangre_p2': !!fichaMedica?.alteraciones_sanguineas,
      'chk_dolor_p2': !!fichaMedica?.dolor_de_cabeza, 'chk_otra_cron_p2': !!fichaMedica?.otras_cronicas,

      // Salud Mental e Historial
      'chk_mental_diag_si_p3': !!fichaMedica?.salud_mental_diagnostico,
      'chk_mental_diag_no_p3': !fichaMedica?.salud_mental_diagnostico,
      'chk_mental_trata_si_p3': !!fichaMedica?.salud_mental_tratamiento,
      'chk_mental_trata_no_p3': !fichaMedica?.salud_mental_tratamiento,
      'chk_hosp_si_p3': hosps.length > 0, 'chk_hosp_no_p3': hosps.length === 0,
      'chk_ciru_si_p3': cirus.length > 0, 'chk_ciru_no_p3': cirus.length === 0,
      
      // Condiciones Recientes
      'chk_malestar_si_p3': !!fichaMedica?.malestares_recientes, 'chk_malestar_no_p3': !fichaMedica?.malestares_recientes,
      'chk_tratamiento_si_p3': !!fichaMedica?.tratamiento_reciente, 'chk_tratamiento_no_p3': !fichaMedica?.tratamiento_reciente,
      'chk_infecto_si_p3': !!fichaMedica?.contacto_infecto, 'chk_infecto_no_p3': !fichaMedica?.contacto_infecto,
      'chk_viaje_si_p3': !!fichaMedica?.viajes_extranjero, 'chk_viaje_no_p3': !fichaMedica?.viajes_extranjero,
      'chk_pni_si_p3': !!fichaMedica?.vacunas_al_dia, 'chk_pni_no_p3': !fichaMedica?.vacunas_al_dia,
      'chk_otra_vacuna_si_p3': !!fichaMedica?.vacunas_extra, 'chk_otra_vacuna_no_p3': !fichaMedica?.vacunas_extra,

      // Gineco-obstetrica
      'chk_mens_si_p3': !!fichaMedica?.menstruaciones, 'chk_mens_no_p3': !fichaMedica?.menstruaciones,
      'chk_ciclo_reg_p3': !!fichaMedica?.ciclo_regular, 'chk_ciclo_irreg_p3': fichaMedica?.menstruaciones && !fichaMedica?.ciclo_regular,
      'chk_disme_si_p3': !!fichaMedica?.dismenorrea, 'chk_disme_no_p3': !fichaMedica?.dismenorrea,
      'chk_embarazo_si_p3': !!fichaMedica?.embarazo, 'chk_embarazo_no_p3': fichaMedica?.menstruaciones && !fichaMedica?.embarazo,

      // Pág 4-5
      'chk_dental_tratamiento_si_p4': !!fichaMedica?.tratamiento_dental_curso,
      'chk_dental_tratamiento_no_p4': !fichaMedica?.tratamiento_dental_curso,
      'chk_diag_relevante_si_p4': !!fichaMedica?.presenta_diagnostico_relevante,
      'chk_diag_relevante_no_p4': !fichaMedica?.presenta_diagnostico_relevante,
      'chk_necesidad_especifica_comunicacion_p5': !!fichaMedica?.apoyo_comunicacion,
      'chk_necesidad_especifica_sensorial_p5': !!fichaMedica?.dificultades_sensoriales,
      'chk_necesidad_especifica_org_p5': !!fichaMedica?.ayuda_organizacion,
      'chk_necesidad_especifica_otras_p5': !!fichaMedica?.otras_necesidades,
      'chk_fe_publica_p5': true,
      'chk_imagen_si_p6': true,
    };

    // --- 3. PROCESAR FIRMA DIGITAL (CORREGIDO PÁGINAS) ---
    if (auth.firma_digital_b64) {
      try {
        let signatureImageBytes: ArrayBuffer;
        if (auth.firma_digital_b64.startsWith('data:image/')) {
          const base64Data = auth.firma_digital_b64.split(',')[1];
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
          signatureImageBytes = bytes.buffer;
        } else {
          signatureImageBytes = await fetch(auth.firma_digital_b64).then(res => res.arrayBuffer());
        }

        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
        const signatureFieldNames = ['firma_p1', 'firma_p5', 'firma_p6', 'Firma del Participante'];

        const allFields = form.getFields();
        for (const field of allFields) {
          const name = field.getName();
          if (signatureFieldNames.includes(name)) {
            const widgets = field.acroField.getWidgets();
            if (widgets.length > 0) {
              const rect = widgets[0].getRectangle();
              let foundPageIdx = -1;
              for (let i = 0; i < pages.length; i++) {
                const pageAnnots = (pages[i].node as unknown as PDFNodeInternal).dict.get(pdfDoc.context.obj('Annots'));
                if (pageAnnots) {
                  const annotsArray = pdfDoc.context.lookup(pageAnnots as never) as unknown as PDFDictInternal;
                  if (annotsArray.array.some(a => (pdfDoc.context.lookup(a as never) as unknown) === (widgets[0] as unknown as { dict: PDFDictInternal }).dict)) {
                    foundPageIdx = i; break;
                  }
                }
              }

              if (foundPageIdx !== -1) {
                pages[foundPageIdx].drawImage(signatureImage, {
                  x: rect.x, y: rect.y, width: rect.width, height: rect.height,
                });
                form.removeField(field);
              }
            }
          }
        }
      } catch (e) { console.error('FIRMA: Error:', e); }
    }

    // --- 4. APLICAR TEXTOS Y CHECKBOXES ---
    Object.keys(fieldMapping).forEach(key => {
      try {
        const field = form.getTextField(key);
        if (field) field.setText(String(fieldMapping[key]));
      } catch (e) { }
    });

    Object.keys(checkboxMapping).forEach(key => {
      try {
        const field = form.getTextField(key);
        if (field && checkboxMapping[key]) field.setText('X');
      } catch (e) { }
    });

    // --- 5. FINALIZAR ---
    form.flatten();
    const pdfBytes = await pdfDoc.save();

    if (shouldDownload) {
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Oficial_NuaMana_${perfil.rut}.pdf`;
      link.click();
    }
    return pdfBytes;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
}

function getSpecialtyInsigniaPath(name: string): string {
  if (!name) return '/images/especialidades/generico.svg';
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `/images/especialidades/${normalized}.svg`;
}

async function svgUrlToPngDataUrl(urls: string[], width = 400, height = 400): Promise<string> {
  const tryLoad = async (srcUrl: string): Promise<string> => {
    const resp = await fetch(srcUrl);
    if (!resp.ok) {
      throw new Error(`Failed to fetch SVG text from ${srcUrl}: ${resp.statusText}`);
    }
    const svgText = await resp.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`XML parsing error for ${srcUrl}: ${parserError.textContent}`);
    }

    const svgEl = doc.querySelector('svg');
    if (!svgEl) {
      throw new Error(`No SVG element found in ${srcUrl}`);
    }

    let w = svgEl.getAttribute('width');
    let h = svgEl.getAttribute('height');
    const viewBox = svgEl.getAttribute('viewBox');

    if (!w || !h) {
      if (viewBox) {
        const parts = viewBox.split(/\s+/);
        if (parts.length === 4) {
          const vbWidth = parts[2];
          const vbHeight = parts[3];
          if (!w) svgEl.setAttribute('width', vbWidth);
          if (!h) svgEl.setAttribute('height', vbHeight);
        }
      }
      if (!svgEl.getAttribute('width')) svgEl.setAttribute('width', String(width));
      if (!svgEl.getAttribute('height')) svgEl.setAttribute('height', String(height));
    }

    const serializer = new XMLSerializer();
    const serializedSvg = serializer.serializeToString(doc);

    return new Promise((resolve, reject) => {
      const blob = new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(blobUrl);
            resolve(dataUrl);
          } catch (e) {
            URL.revokeObjectURL(blobUrl);
            reject(e);
          }
        } else {
          URL.revokeObjectURL(blobUrl);
          reject(new Error(`Failed to get 2D context for canvas`));
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error(`Failed to load serialized SVG image from Blob URL`));
      };
      img.src = blobUrl;
    });
  };

  for (const url of urls) {
    try {
      return await tryLoad(url);
    } catch (err) {
      console.warn(`Could not process SVG (${url}), trying next fallback...`, err);
    }
  }
  throw new Error(`All SVG urls failed to load: ${urls.join(', ')}`);
}

interface PDFDictInternal {
  get(key: unknown): unknown;
  dict: PDFDictInternal;
  array: unknown[];
}

interface PDFNodeInternal {
  dict: PDFDictInternal;
}

async function drawImageOnField(pdfDoc: PDFDocument, form: PDFForm, pages: PDFPage[], fieldName: string, imageBytes: Uint8Array) {
  try {
    const field = form.getField(fieldName);
    if (!field) return;
    const widgets = field.acroField.getWidgets();
    if (widgets.length === 0) return;
    
    const rect = widgets[0].getRectangle();
    let foundPageIdx = -1;
    for (let i = 0; i < pages.length; i++) {
      const pageAnnots = (pages[i].node as unknown as PDFNodeInternal).dict.get(pdfDoc.context.obj('Annots'));
      if (pageAnnots) {
        const annotsArray = pdfDoc.context.lookup(pageAnnots as never) as unknown as PDFDictInternal;
        if (annotsArray.array.some(a => (pdfDoc.context.lookup(a as never) as unknown) === (widgets[0] as unknown as { dict: PDFDictInternal }).dict)) {
          foundPageIdx = i; break;
        }
      }
    }
    
    if (foundPageIdx !== -1) {
      const embeddedImage = await pdfDoc.embedPng(imageBytes);
      pages[foundPageIdx].drawImage(embeddedImage, {
        x: rect.x, y: rect.y, width: rect.width, height: rect.height,
      });
    }
  } catch (e) {
    console.error(`Error drawing image on field ${fieldName}:`, e);
  }
}

export async function generateSpecialtyCertificate(perfil: PerfilData, especialidad: EspecialidadData) {
  try {
    // Intentar cargar la plantilla PDF
    const pdfUrl = `/autorizacion/CertificadoEspecialidadTemplate.pdf?v=${Date.now()}`;
    const response = await fetch(pdfUrl);
    
    if (response.ok) {
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const pages = pdfDoc.getPages();
      
      const fieldLabels: Record<string, string> = {
        arte_expresion: 'Arte y Cultura',
        deportes: 'Deportes y Juegos',
        ciencia_tecnologia: 'Ciencia y Tecnología',
        aire_libre: 'Vida al Aire Libre',
        espiritual: 'Vida Espiritual',
        servicio_comunidad: 'Servicio y Comunidad'
      };
      
      const specName = especialidad.nombre_personalizado || especialidad.especialidades_definiciones?.nombre || 'Especialidad';
      const categoryName = (especialidad.campo_interes ? fieldLabels[especialidad.campo_interes] : undefined) || especialidad.campo_interes || 'Especialidad';
      const userName = `${perfil.nombres} ${perfil.apellidos}`.toUpperCase();
      let deliveryDateStr = '';
      try {
        const rawDate = especialidad.fecha_entrega || new Date().toISOString().split('T')[0];
        deliveryDateStr = format(parseISO(rawDate), 'dd-MM-yyyy');
      } catch (e) {
        deliveryDateStr = especialidad.fecha_entrega || '';
      }

      // Rellenado de campos de texto
      const fillText = (name: string, val: string) => {
        try {
          const f = form.getTextField(name);
          if (f) f.setText(val);
        } catch (e) {}
      };

      fillText('nombre_nnj', userName);
      fillText('nombre_especialidad', specName.toUpperCase());
      fillText('categoria_especialidad', categoryName.toUpperCase());
      fillText('fecha_entrega', deliveryDateStr);

      const getBytesFromB64 = (b64: string) => {
        const bin = window.atob(b64.split(',')[1] || b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        return bytes;
      };

      // Firma del Monitor
      if (especialidad.firma_monitor_b64) {
        try {
          const sigBytes = getBytesFromB64(especialidad.firma_monitor_b64);
          await drawImageOnField(pdfDoc, form, pages, 'firma_monitor', sigBytes);
        } catch (e) { console.error('Error al dibujar firma de monitor:', e); }
      }

      // Firma del Dirigente
      if (especialidad.firma_dirigente_b64) {
        try {
          const sigBytes = getBytesFromB64(especialidad.firma_dirigente_b64);
          await drawImageOnField(pdfDoc, form, pages, 'firma_dirigente', sigBytes);
        } catch (e) { console.error('Error al dibujar firma de dirigente:', e); }
      }

      // Imagen de la Insignia
      try {
        const insigniaUrls = Array.from(new Set([
          getSpecialtyInsigniaPath(specName),
          especialidad.campo_interes ? `/images/especialidades/${especialidad.campo_interes}.svg` : '',
          '/images/especialidades/generico.svg'
        ].filter(Boolean)));

        const insigniaPng = await svgUrlToPngDataUrl(insigniaUrls, 330, 330);
        const insigniaBytes = getBytesFromB64(insigniaPng);
        await drawImageOnField(pdfDoc, form, pages, 'insignia_imagen', insigniaBytes);
      } catch (e) { console.error('Error al dibujar insignia:', e); }

      form.flatten();
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Certificado_Especialidad_${specName.replace(/\s+/g, '_')}_${perfil.rut}.pdf`;
      link.click();
      return;
    }
  } catch (error) {
    console.error('Error con plantilla, usando renderizado programático alternativo:', error);
  }

  // --- RENDERIZADO PROGRAMÁTICO ALTERNATIVO (FALLBACK) ---
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([792, 612]); // Landscape Letter
    
    const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Draw background borders
    page.drawRectangle({
      x: 20,
      y: 20,
      width: 752,
      height: 572,
      borderWidth: 5,
      borderColor: rgb(0.79, 0.2, 0.15), // Rojo Nua Mana #cb3327
      color: rgb(0.98, 0.98, 0.98),
    });

    page.drawRectangle({
      x: 28,
      y: 28,
      width: 736,
      height: 556,
      borderWidth: 2,
      borderColor: rgb(0.2, 0.2, 0.2),
    });

    // Title / Institution headers
    page.drawText('ASOCIACIÓN DE GUÍAS Y SCOUTS DE CHILE', {
      x: 50,
      y: 520,
      size: 11,
      font: fontHelveticaBold,
      color: rgb(0.3, 0.3, 0.3),
    });
    
    page.drawText('GRUPO GUÍAS Y SCOUTS NUA MANA', {
      x: 50,
      y: 492,
      size: 24,
      font: fontHelveticaBold,
      color: rgb(0.79, 0.2, 0.15),
    });

    page.drawText('CERTIFICADO DE ESPECIALIDAD', {
      x: 50,
      y: 390,
      size: 28,
      font: fontHelveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText('Otorgado con orgullo a:', {
      x: 50,
      y: 340,
      size: 14,
      font: fontHelvetica,
      color: rgb(0.4, 0.4, 0.4),
    });

    const userName = `${perfil.nombres} ${perfil.apellidos}`.toUpperCase();
    page.drawText(userName, {
      x: 50,
      y: 290,
      size: 26,
      font: fontHelveticaBold,
      color: rgb(0, 0, 0),
    });

    const fieldLabels: Record<string, string> = {
      arte_expresion: 'Arte y Expresión',
      deportes: 'Deportes',
      ciencia_tecnologia: 'Ciencia y Tecnología',
      aire_libre: 'Vida al Aire Libre',
      espiritual: 'Vida Espiritual',
      servicio_comunidad: 'Servicio y Comunidad'
    };

    const fieldColors: Record<string, ReturnType<typeof rgb>> = {
      deportes: rgb(0.72, 0.54, 0.07),            // #b78913
      arte_expresion: rgb(0.87, 0.0, 0.38),        // #dd0061
      ciencia_tecnologia: rgb(0.15, 0.11, 0.31),    // #261d4e
      espiritual: rgb(0.0, 0.58, 0.77),            // #0093c4
      servicio_comunidad: rgb(0.0, 0.66, 0.27),    // #00a946
      aire_libre: rgb(0.16, 0.22, 0.49)            // #29397d
    };

    const specName = especialidad.nombre_personalizado || especialidad.especialidades_definiciones?.nombre || 'Especialidad';
    const fieldName = (especialidad.campo_interes ? fieldLabels[especialidad.campo_interes] : undefined) || especialidad.campo_interes;
    const activeColor = (especialidad.campo_interes ? fieldColors[especialidad.campo_interes] : undefined) || rgb(0.1, 0.5, 0.3);

    const descText = `Por haber demostrado constancia, dedicación y superación personal al completar\ntodas las actividades correspondientes a la especialidad de:`;
    
    page.drawText(descText, {
      x: 50,
      y: 235,
      size: 14,
      font: fontHelvetica,
      color: rgb(0.3, 0.3, 0.3),
      lineHeight: 18,
    });

    page.drawText(`${specName.toUpperCase()}`, {
      x: 50,
      y: 175,
      size: 22,
      font: fontHelveticaBold,
      color: rgb(0.79, 0.2, 0.15),
    });

    page.drawText(`En el campo de: ${fieldName}`, {
      x: 50,
      y: 145,
      size: 14,
      font: fontHelveticaBold,
      color: activeColor,
    });

    let formattedEndDate = '';
    try {
      const rawFin = especialidad.fecha_fin || new Date().toISOString().split('T')[0];
      formattedEndDate = format(parseISO(rawFin), 'dd-MM-yyyy');
    } catch (e) {
      formattedEndDate = especialidad.fecha_fin || '';
    }
    const dateText = `Fecha de finalización: ${formattedEndDate}`;
    page.drawText(dateText, {
      x: 50,
      y: 95,
      size: 12,
      font: fontHelvetica,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Signature line
    page.drawLine({
      start: { x: 500, y: 110 },
      end: { x: 700, y: 110 },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText('Firma del Responsable / Dirigente', {
      x: 505,
      y: 90,
      size: 10,
      font: fontHelvetica,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Load and embed logos
    let logoImage = null;
    let insigniaImage = null;

    try {
      const logoPng = await svgUrlToPngDataUrl(['/images/logos/LogoColor.svg'], 220, 220);
      logoImage = await pdfDoc.embedPng(logoPng);
    } catch (e) {
      console.error('Error embedding logo:', e);
    }

    try {
      const insigniaUrls = Array.from(new Set([
        getSpecialtyInsigniaPath(specName),
        especialidad.campo_interes ? `/images/especialidades/${especialidad.campo_interes}.svg` : '',
        '/images/especialidades/generico.svg'
      ].filter(Boolean)));

      const insigniaPng = await svgUrlToPngDataUrl(insigniaUrls, 330, 330);
      insigniaImage = await pdfDoc.embedPng(insigniaPng);
    } catch (e) {
      console.error('Error embedding insignia:', e);
    }

    // Draw Group Logo
    if (logoImage) {
      page.drawImage(logoImage, {
        x: 600,
        y: 450,
        width: 110,
        height: 110,
      });
    }

    // Draw Specialty Insignia
    if (insigniaImage) {
      page.drawImage(insigniaImage, {
        x: 575,
        y: 220,
        width: 160,
        height: 160,
      });
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Certificado_Especialidad_${specName.replace(/\s+/g, '_')}_${perfil.rut}.pdf`;
    link.click();
  } catch (error) {
    console.error('Error al generar certificado de especialidad:', error);
    toast.error('Error al generar PDF de certificado');
  }
}

