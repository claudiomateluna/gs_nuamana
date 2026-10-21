import * as XLSX from 'xlsx';
import type { Perfil } from '@/types';
import { calcularEdad } from '@/utils/date-utils';

export const COLUMNAS_NOMINA_EXCEL = [
  'R.U.T.',
  'Nombres',
  'Apellido Paterno',
  'Apellido Materno',
  'Asignación Femenina/Masculina al Nacer',
  'Fecha de Nacimiento',
  'Edad',
  'Unidad',
  'Teléfono',
  'Email',
  'Dirección',
  'Nombre del Apoderado',
  'Relación con el Apoderado',
  'Teléfono Apoderado',
  'Sistema de Salud',
  'Detalle Sist. Salud',
  'Tipo de Sangre',
  'Alergias',
  'Antecentes Medicos',
  'Tratamiento Médico',
  'Medicamentos',
  'Dieta',
] as const;

export function separarApellidos(apellidosStr?: string | null): { paterno: string; materno: string } {
  if (!apellidosStr || !apellidosStr.trim()) {
    return { paterno: '', materno: '' };
  }
  const partes = apellidosStr.trim().split(/\s+/);
  if (partes.length === 1) {
    return { paterno: partes[0], materno: '' };
  }
  return {
    paterno: partes[0],
    materno: partes.slice(1).join(' '),
  };
}

export function formatearFechaNacimiento(fechaStr?: string | null): string {
  if (!fechaStr) return '';
  // Si viene en formato YYYY-MM-DD o ISO
  const match = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, anio, mes, dia] = match;
    return `${dia}/${mes}/${anio}`;
  }
  return fechaStr;
}

export function mapearPerfilANominaRow(u: Perfil): Record<string, string | number> {
  const { paterno, materno } = separarApellidos(u.apellidos);
  const edad = calcularEdad(u.fecha_nacimiento);
  const contactoPrimario = u.contactos_emergencia?.find((c) => c.es_primario) || u.contactos_emergencia?.[0];

  const nombreApoderado = u.apoderado
    ? `${u.apoderado.nombres || ''} ${u.apoderado.apellidos || ''}`.trim()
    : (contactoPrimario?.nombre || '');

  const relacionApoderado = contactoPrimario?.parentesco || (contactoPrimario as unknown as { relacion?: string })?.relacion || (u.apoderado ? 'Apoderado/a' : '');

  const telefonoApoderado = u.apoderado?.telefono || contactoPrimario?.telefono || '';

  const direccionCompleta = [u.direccion, u.comuna].filter(Boolean).join(', ');

  const dieta = Array.isArray(u.dieta_alimentaria)
    ? u.dieta_alimentaria.join(', ')
    : (u.restricciones_alimentarias || '');

  return {
    'R.U.T.': u.rut || '',
    'Nombres': u.nombres || '',
    'Apellido Paterno': paterno,
    'Apellido Materno': materno,
    'Asignación Femenina/Masculina al Nacer': u.sexo || '',
    'Fecha de Nacimiento': formatearFechaNacimiento(u.fecha_nacimiento),
    'Edad': edad ?? '',
    'Unidad': u.unidades?.nombre || '',
    'Teléfono': u.telefono || '',
    'Email': u.email || '',
    'Dirección': direccionCompleta,
    'Nombre del Apoderado': nombreApoderado,
    'Relación con el Apoderado': relacionApoderado,
    'Teléfono Apoderado': telefonoApoderado,
    'Sistema de Salud': u.sistema_salud || u.prevision || '',
    'Detalle Sist. Salud': u.detalle_sistema_salud || u.seguro_complementario || '',
    'Tipo de Sangre': u.tipo_sangre || u.grupo_sangre || '',
    'Alergias': u.alergias || (u.tiene_alergias ? 'Sí' : 'Ninguna'),
    'Antecentes Medicos': u.antecedentes_medicos || u.comentarios_salud || '',
    'Tratamiento Médico': u.tratamientos_medicos || '',
    'Medicamentos': u.medicamentos || u.medicamentos_uso_comun || '',
    'Dieta': dieta,
  };
}

/**
 * Genera y descarga un archivo Excel con la nómina de usuarios activos.
 */
export function exportarNominaExcel(
  usuarios: Perfil[],
  nombreArchivoBase: string,
  nombreHoja = 'Nómina'
): void {
  // Filtrar solo usuarios activos
  const activos = usuarios.filter((u) => u.estado === 'activo');

  const filas = activos.map(mapearPerfilANominaRow);

  const worksheet = XLSX.utils.json_to_sheet(filas, {
    header: [...COLUMNAS_NOMINA_EXCEL],
  });

  // Ajustar ancho automático de columnas
  const colWidths = COLUMNAS_NOMINA_EXCEL.map((col) => {
    let maxLen = col.length;
    for (const fila of filas) {
      const valStr = String(fila[col] ?? '');
      if (valStr.length > maxLen) {
        maxLen = valStr.length;
      }
    }
    return { wch: Math.min(Math.max(maxLen + 3, 12), 40) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);

  const fechaHoy = new Date().toISOString().split('T')[0];
  const nombreLimpio = nombreArchivoBase.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${nombreLimpio}_${fechaHoy}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

export const COLUMNAS_SALIDA_EXCEL = [
  'N°',
  'R.U.T.',
  'Participante',
  'Unidad',
  'Edad',
  'Fecha Nacimiento',
  'Estado Firma',
  'Fecha Firma',
  'Firmante (Apoderado)',
  'RUT Firmante',
  'Teléfono Firmante',
  'Contacto Emergencia',
  'Teléfono Emergencia',
  'Parentesco',
  'Previsión / Salud',
  'Grupo Sangre',
  'Alergias',
  'Antecedentes / Observaciones',
  'Medicamentos',
  'Restricciones Alimentarias',
] as const;

export interface AsistenteSalidaData {
  perfil: Perfil;
  autorizacion: {
    fecha_firma?: string | null;
    nombre_firmante?: string | null;
    rut_firmante?: string | null;
    estado?: string | null;
  };
  authOriginal?: any;
}

export interface ActividadSalidaHeader {
  nombre: string;
  tipo?: string | null;
  lugar?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  unidades?: { nombre: string } | null;
}

export function mapearAsistenteSalidaRow(
  asistente: AsistenteSalidaData,
  index: number
): Record<string, string | number> {
  const u = asistente.perfil;
  const auth = asistente.autorizacion;
  const edad = calcularEdad(u.fecha_nacimiento);
  const contactoPrimario = u.contactos_emergencia?.find((c) => c.es_primario) || u.contactos_emergencia?.[0];

  const nombreApoderado = u.apoderado
    ? `${u.apoderado.nombres || ''} ${u.apoderado.apellidos || ''}`.trim()
    : (contactoPrimario?.nombre || '');

  const telefonoApoderado = u.apoderado?.telefono || contactoPrimario?.telefono || '';

  const dieta = Array.isArray(u.dieta_alimentaria)
    ? u.dieta_alimentaria.join(', ')
    : (u.restricciones_alimentarias || '');

  let fechaFirmaFormateada = '';
  if (auth.fecha_firma) {
    try {
      const d = new Date(auth.fecha_firma);
      fechaFirmaFormateada = d.toLocaleString('es-CL');
    } catch {
      fechaFirmaFormateada = auth.fecha_firma;
    }
  }

  return {
    'N°': index + 1,
    'R.U.T.': u.rut || '',
    'Participante': `${u.nombres || ''} ${u.apellidos || ''}`.trim(),
    'Unidad': u.unidades?.nombre || '',
    'Edad': edad ?? '',
    'Fecha Nacimiento': formatearFechaNacimiento(u.fecha_nacimiento),
    'Estado Firma': auth.estado || 'Firmada',
    'Fecha Firma': fechaFirmaFormateada,
    'Firmante (Apoderado)': auth.nombre_firmante || nombreApoderado || '',
    'RUT Firmante': auth.rut_firmante || '',
    'Teléfono Firmante': telefonoApoderado,
    'Contacto Emergencia': contactoPrimario?.nombre || '',
    'Teléfono Emergencia': contactoPrimario?.telefono || '',
    'Parentesco': contactoPrimario?.parentesco || (contactoPrimario as unknown as { relacion?: string })?.relacion || '',
    'Previsión / Salud': u.sistema_salud || u.prevision || '',
    'Grupo Sangre': u.tipo_sangre || u.grupo_sangre || '',
    'Alergias': u.alergias || (u.tiene_alergias ? 'Sí' : 'Ninguna'),
    'Antecedentes / Observaciones': u.antecedentes_medicos || u.comentarios_salud || u.enfermedades_cronicas || '',
    'Medicamentos': u.medicamentos || u.medicamentos_uso_comun || '',
    'Restricciones Alimentarias': dieta,
  };
}

/**
 * Genera y descarga un archivo Excel con la nómina de participantes autorizados para una salida específica.
 */
export function exportarSalidaAutorizacionesExcel(
  actividad: ActividadSalidaHeader,
  asistentes: AsistenteSalidaData[]
): void {
  const filas = asistentes.map((asistente, idx) => mapearAsistenteSalidaRow(asistente, idx));

  const worksheet = XLSX.utils.json_to_sheet(filas, {
    header: [...COLUMNAS_SALIDA_EXCEL],
  });

  // Ajustar ancho automático de columnas
  const colWidths = COLUMNAS_SALIDA_EXCEL.map((col) => {
    let maxLen = col.length;
    for (const fila of filas) {
      const valStr = String(fila[col] ?? '');
      if (valStr.length > maxLen) {
        maxLen = valStr.length;
      }
    }
    return { wch: Math.min(Math.max(maxLen + 3, 10), 45) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  const nombreHoja = 'Asistentes Autorizados';
  XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);

  const fechaHoy = new Date().toISOString().split('T')[0];
  const nombreLimpio = (actividad.nombre || 'Salida').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Nomina_${nombreLimpio}_${fechaHoy}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
