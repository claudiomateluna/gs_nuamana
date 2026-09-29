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
