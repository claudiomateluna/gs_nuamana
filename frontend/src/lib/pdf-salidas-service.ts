import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface SalidaPdfData {
  distrito: string;
  fecha_inicio: string;
  fecha_termino: string;
  tipo_actividad: string;
  lugar: string;
  localidad?: string;
  comuna?: string;
  numero_dirigentes: number;
  numero_nnj: number;
  numero_apoderados: number;
  unidades_seleccionadas: {
    manada?: boolean;
    cia?: boolean;
    tropa?: boolean;
    avanzada?: boolean;
    clan?: boolean;
  };
  responsable: string;
  telefono: string;
  nombre_emergencia_1?: string;
  fono_emergencia_1?: string;
  nombre_emergencia_2?: string;
  fono_emergencia_2?: string;
  rango_edad_1?: number | string;
  rango_edad_2?: number | string;
  firma_responsable_b64?: string | null;
}

/** Formatea fecha YYYY-MM-DD a DD/MM/YYYY */
function formatearFecha(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Rellena y genera el PDF de Comunicación al Distrito
 */
export async function generarPdfComunicacionDistrito(
  data: SalidaPdfData,
  pdfBytesOrPath?: Uint8Array | string
): Promise<Uint8Array> {
  let bytes: Uint8Array;
  if (pdfBytesOrPath instanceof Uint8Array) {
    bytes = pdfBytesOrPath;
  } else if (typeof pdfBytesOrPath === 'string') {
    bytes = fs.readFileSync(pdfBytesOrPath);
  } else {
    // Por defecto en servidor lee de frontend/public/autorizacion
    const filePath = path.join(process.cwd(), 'public', 'autorizacion', 'ComunicacionAlDistritoDeSalidas.pdf');
    bytes = fs.readFileSync(filePath);
  }

  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();

  // Asignar campos de texto
  const setField = (name: string, value: string) => {
    try {
      const field = form.getTextField(name);
      if (field) field.setText(value || '');
    } catch {
      // Ignorar si no existe
    }
  };

  setField('distrito', data.distrito || '');
  setField('fecha_inicio', formatearFecha(data.fecha_inicio));
  setField('fecha_termino', formatearFecha(data.fecha_termino));
  setField('tipo_actividad', data.tipo_actividad || 'Salida');
  setField('lugar', data.lugar || '');
  setField('numero_dirigentes', String(data.numero_dirigentes ?? 0));
  setField('numero_nnj', String(data.numero_nnj ?? 0));
  setField('numero_apoderados', String(data.numero_apoderados ?? 0));

  // Unidades con "X"
  const u = data.unidades_seleccionadas || {};
  if (u.manada) setField('manada', 'X');
  if (u.cia) setField('cia', 'X');
  if (u.tropa) setField('tropa', 'X');
  if (u.avanzada) setField('avanzada', 'X');
  if (u.clan) setField('clan', 'X');

  setField('responsable', data.responsable || '');
  setField('telefono', data.telefono || '');
  setField('responsable2', data.responsable || '');

  // Los campos de director van vacíos
  setField('nombre_director', '');

  // Estampar firma digital si está presente
  if (data.firma_responsable_b64) {
    try {
      const cleanB64 = data.firma_responsable_b64.replace(/^data:image\/\w+;base64,/, '');
      const imgBytes = Buffer.from(cleanB64, 'base64');
      const pngImage = await pdfDoc.embedPng(imgBytes);

      // Coordenadas exactas obtenidas del widget firma_responsable
      // x: 59.1, y: 184.55, width: 179.9, height: 87.17
      const page = pdfDoc.getPages()[0];
      const box = { x: 59.1, y: 184.55, width: 180, height: 87.2 };

      // Mantener proporción de la firma
      const imgDims = pngImage.scale(1);
      const scale = Math.min((box.width - 10) / imgDims.width, (box.height - 10) / imgDims.height);
      const renderW = imgDims.width * scale;
      const renderH = imgDims.height * scale;
      const renderX = box.x + (box.width - renderW) / 2;
      const renderY = box.y + (box.height - renderH) / 2;

      page.drawImage(pngImage, {
        x: renderX,
        y: renderY,
        width: renderW,
        height: renderH,
      });
    } catch (e) {
      console.warn('Error estampando firma en Comunicacion al Distrito:', e);
    }
  }

  // Aplanar formulario para que no sea editable
  try {
    form.flatten();
  } catch {
    // Si falla el flatten, guardar tal cual
  }

  return await pdfDoc.save();
}

/**
 * Rellena y genera el PDF de Constancia Campamento Carabineros
 */
export async function generarPdfConstanciaCarabineros(
  data: SalidaPdfData,
  pdfBytesOrPath?: Uint8Array | string
): Promise<Uint8Array> {
  let bytes: Uint8Array;
  if (pdfBytesOrPath instanceof Uint8Array) {
    bytes = pdfBytesOrPath;
  } else if (typeof pdfBytesOrPath === 'string') {
    bytes = fs.readFileSync(pdfBytesOrPath);
  } else {
    const filePath = path.join(process.cwd(), 'public', 'autorizacion', 'ConstanciaCampCarabineros.pdf');
    bytes = fs.readFileSync(filePath);
  }

  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();

  const setField = (name: string, value: string) => {
    try {
      const field = form.getTextField(name);
      if (field) field.setText(value || '');
    } catch {
      // Ignorar si no existe
    }
  };

  setField('distrito', data.distrito || '');
  setField('fecha_inicio', formatearFecha(data.fecha_inicio));
  setField('fecha_termino', formatearFecha(data.fecha_termino));
  setField('comuna', data.comuna || 'La Granja');
  setField('lugar', data.lugar || '');
  setField('localidad', data.localidad || data.lugar || '');

  const totalAdultos = (Number(data.numero_dirigentes) || 0) + (Number(data.numero_apoderados) || 0);
  setField('numero_adultos', String(totalAdultos));
  setField('numero_nnj', String(data.numero_nnj ?? 0));

  setField('rango_edad_1', data.rango_edad_1 !== undefined ? String(data.rango_edad_1) : '7');
  setField('rango_edad_2', data.rango_edad_2 !== undefined ? String(data.rango_edad_2) : '19');

  setField('responsable', data.responsable || '');
  setField('nombre_emergencia_1', data.nombre_emergencia_1 || data.responsable || '');
  setField('fono_emergencia_1', data.fono_emergencia_1 || data.telefono || '');
  setField('nombre_emergencia_2', data.nombre_emergencia_2 || '');
  setField('fono_emergencia_2', data.fono_emergencia_2 || '');

  setField('responsable2', data.responsable || '');
  setField('telefono_responsable', data.telefono || '');

  // Estampar firma digital si está presente
  if (data.firma_responsable_b64) {
    try {
      const cleanB64 = data.firma_responsable_b64.replace(/^data:image\/\w+;base64,/, '');
      const imgBytes = Buffer.from(cleanB64, 'base64');
      const pngImage = await pdfDoc.embedPng(imgBytes);

      // Coordenadas exactas obtenidas del widget firma_responsable:
      // x: 47.06, y: 171.95, width: 179.52, height: 73.02
      const page = pdfDoc.getPages()[0];
      const box = { x: 47.06, y: 171.95, width: 179.5, height: 73.0 };

      const imgDims = pngImage.scale(1);
      const scale = Math.min((box.width - 10) / imgDims.width, (box.height - 10) / imgDims.height);
      const renderW = imgDims.width * scale;
      const renderH = imgDims.height * scale;
      const renderX = box.x + (box.width - renderW) / 2;
      const renderY = box.y + (box.height - renderH) / 2;

      page.drawImage(pngImage, {
        x: renderX,
        y: renderY,
        width: renderW,
        height: renderH,
      });
    } catch (e) {
      console.warn('Error estampando firma en Constancia Carabineros:', e);
    }
  }

  try {
    form.flatten();
  } catch {
    // Si falla el flatten, guardar tal cual
  }

  return await pdfDoc.save();
}
