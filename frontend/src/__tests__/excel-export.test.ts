import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as XLSX from 'xlsx';
import {
  COLUMNAS_NOMINA_EXCEL,
  separarApellidos,
  formatearFechaNacimiento,
  mapearPerfilANominaRow,
  exportarNominaExcel,
} from '@/utils/excel-export';
import type { Perfil } from '@/types';

vi.mock('xlsx', async (importOriginal) => {
  const actual = await importOriginal<typeof import('xlsx')>();
  return {
    ...actual,
    writeFile: vi.fn(),
  };
});

describe('excel-export utility', () => {
  describe('COLUMNAS_NOMINA_EXCEL', () => {
    it('contains exactly the 22 columns from Formato_DatosNuaMana.xlsx', () => {
      expect(COLUMNAS_NOMINA_EXCEL).toHaveLength(22);
      expect(COLUMNAS_NOMINA_EXCEL).toEqual([
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
      ]);
    });
  });

  describe('separarApellidos', () => {
    it('handles empty or null string gracefully', () => {
      expect(separarApellidos(null)).toEqual({ paterno: '', materno: '' });
      expect(separarApellidos('')).toEqual({ paterno: '', materno: '' });
      expect(separarApellidos('   ')).toEqual({ paterno: '', materno: '' });
    });

    it('separates a single surname into paterno and empty materno', () => {
      expect(separarApellidos('Mateluna')).toEqual({ paterno: 'Mateluna', materno: '' });
    });

    it('separates two surnames correctly', () => {
      expect(separarApellidos('Pérez González')).toEqual({ paterno: 'Pérez', materno: 'González' });
    });

    it('joins remaining words into materno for compound surnames', () => {
      expect(separarApellidos('De la Fuente Pérez')).toEqual({ paterno: 'De', materno: 'la Fuente Pérez' });
    });
  });

  describe('formatearFechaNacimiento', () => {
    it('returns empty string if null or undefined', () => {
      expect(formatearFechaNacimiento(null)).toBe('');
      expect(formatearFechaNacimiento(undefined)).toBe('');
    });

    it('formats YYYY-MM-DD to DD/MM/YYYY', () => {
      expect(formatearFechaNacimiento('2012-08-25')).toBe('25/08/2012');
    });

    it('formats ISO timestamp to DD/MM/YYYY', () => {
      expect(formatearFechaNacimiento('2010-03-05T14:30:00Z')).toBe('05/03/2010');
    });
  });

  describe('mapearPerfilANominaRow', () => {
    const mockPerfil: Perfil = {
      id: 'usr-1',
      nombres: 'Claudio',
      apellidos: 'Mateluna Silva',
      rut: '12.345.678-9',
      email: 'claudio@test.cl',
      telefono: '+56912345678',
      sexo: 'Masculino',
      fecha_nacimiento: '2010-05-15',
      direccion: 'Av. Siempre Viva 742',
      comuna: 'La Granja',
      rol_id: 9,
      estado: 'activo',
      unidades: {
        id: 1,
        nombre: 'Manada',
      },
      sistema_salud: 'Fonasa',
      detalle_sistema_salud: 'Tramo B',
      tipo_sangre: 'O+',
      alergias: 'Penicilina',
      antecedentes_medicos: 'Asma leve',
      tratamientos_medicos: 'Inhalador SOS',
      medicamentos: 'Salbutamol',
      dieta_alimentaria: ['Vegetariano', 'Sin gluten'],
      apoderado: {
        id: 'apo-1',
        nombres: 'María',
        apellidos: 'Silva López',
        telefono: '+56987654321',
        email: 'maria@test.cl',
      },
      contactos_emergencia: [
        {
          id: 'con-1',
          perfil_id: 'usr-1',
          nombre: 'María Silva',
          telefono: '+56987654321',
          parentesco: 'Madre',
          es_primario: true,
        },
      ],
    };

    it('correctly maps all fields of a complete Perfil', () => {
      const row = mapearPerfilANominaRow(mockPerfil);

      expect(row['R.U.T.']).toBe('12.345.678-9');
      expect(row['Nombres']).toBe('Claudio');
      expect(row['Apellido Paterno']).toBe('Mateluna');
      expect(row['Apellido Materno']).toBe('Silva');
      expect(row['Asignación Femenina/Masculina al Nacer']).toBe('Masculino');
      expect(row['Fecha de Nacimiento']).toBe('15/05/2010');
      expect(typeof row['Edad']).toBe('number');
      expect(row['Unidad']).toBe('Manada');
      expect(row['Teléfono']).toBe('+56912345678');
      expect(row['Email']).toBe('claudio@test.cl');
      expect(row['Dirección']).toBe('Av. Siempre Viva 742, La Granja');
      expect(row['Nombre del Apoderado']).toBe('María Silva López');
      expect(row['Relación con el Apoderado']).toBe('Madre');
      expect(row['Teléfono Apoderado']).toBe('+56987654321');
      expect(row['Sistema de Salud']).toBe('Fonasa');
      expect(row['Detalle Sist. Salud']).toBe('Tramo B');
      expect(row['Tipo de Sangre']).toBe('O+');
      expect(row['Alergias']).toBe('Penicilina');
      expect(row['Antecentes Medicos']).toBe('Asma leve');
      expect(row['Tratamiento Médico']).toBe('Inhalador SOS');
      expect(row['Medicamentos']).toBe('Salbutamol');
      expect(row['Dieta']).toBe('Vegetariano, Sin gluten');
    });

    it('falls back to primary emergency contact when apoderado is not populated', () => {
      const perfilSinApoderado: Perfil = {
        ...mockPerfil,
        apoderado: null,
      };

      const row = mapearPerfilANominaRow(perfilSinApoderado);
      expect(row['Nombre del Apoderado']).toBe('María Silva');
      expect(row['Relación con el Apoderado']).toBe('Madre');
      expect(row['Teléfono Apoderado']).toBe('+56987654321');
    });
  });

  describe('exportarNominaExcel', () => {
    it('filters out inactive members and calls XLSX.writeFile with sanitized filename', () => {
      const uActivo: Perfil = {
        id: '1',
        nombres: 'Activo',
        apellidos: 'Uno',
        rut: '1-1',
        rol_id: 9,
        estado: 'activo',
      };
      const uInactivo: Perfil = {
        id: '2',
        nombres: 'Inactivo',
        apellidos: 'Dos',
        rut: '2-2',
        rol_id: 9,
        estado: 'inactivo',
      };

      exportarNominaExcel([uActivo, uInactivo], 'Nomina Manada & Lobatos', 'Manada');

      expect(XLSX.writeFile).toHaveBeenCalled();
      const lastCall = vi.mocked(XLSX.writeFile).mock.calls[0];
      const filename = lastCall[1];
      expect(filename).toMatch(/^Nomina_Manada___Lobatos_\d{4}-\d{2}-\d{2}\.xlsx$/);
    });
  });
});
