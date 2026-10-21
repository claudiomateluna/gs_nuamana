// @vitest-environment node
import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import {
  generarPdfComunicacionDistrito,
  generarPdfConstanciaCarabineros,
  type SalidaPdfData,
} from '@/lib/pdf-salidas-service';

describe('pdf-salidas-service', () => {
  // Crear imagen transparente válida de 1x1 en base64 para probar estampado
  const dummySignatureB64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const mockData: SalidaPdfData = {
    distrito: 'La Florida',
    fecha_inicio: '2026-11-15',
    fecha_termino: '2026-11-17',
    tipo_actividad: 'Campamento',
    lugar: 'Camping El Sauce',
    localidad: 'San Alfonso, Cajón del Maipo',
    comuna: 'La Granja',
    numero_dirigentes: 4,
    numero_nnj: 28,
    numero_apoderados: 6,
    unidades_seleccionadas: {
      manada: true,
      tropa: true,
      cia: false,
      avanzada: false,
      clan: true,
    },
    responsable: 'Claudio Mateluna',
    telefono: '+56 9 1234 5678',
    nombre_emergencia_1: 'Claudio Mateluna',
    fono_emergencia_1: '+56 9 1234 5678',
    nombre_emergencia_2: 'María Pérez',
    fono_emergencia_2: '+56 9 8765 4321',
    rango_edad_1: 7,
    rango_edad_2: 20,
    firma_responsable_b64: dummySignatureB64,
  };

  const pathDistrito = path.join(
    process.cwd(),
    'public',
    'autorizacion',
    'ComunicacionAlDistritoDeSalidas.pdf'
  );
  const pathCarabineros = path.join(
    process.cwd(),
    'public',
    'autorizacion',
    'ConstanciaCampCarabineros.pdf'
  );

  it('genera correctamente el PDF de Comunicacion al Distrito con firma', async () => {
    const pdfBytes = await generarPdfComunicacionDistrito(mockData, pathDistrito);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);

    const doc = await PDFDocument.load(pdfBytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it('genera correctamente el PDF de Constancia a Carabineros con firma', async () => {
    const pdfBytes = await generarPdfConstanciaCarabineros(mockData, pathCarabineros);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);

    const doc = await PDFDocument.load(pdfBytes);
    expect(doc.getPageCount()).toBe(1);
  });
});
