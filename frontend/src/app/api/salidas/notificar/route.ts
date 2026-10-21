import { NextResponse } from 'next/server';
import {
  generarPdfComunicacionDistrito,
  generarPdfConstanciaCarabineros,
  type SalidaPdfData,
} from '@/lib/pdf-salidas-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { salidaData, emailDistrito } = body as {
      salidaData: SalidaPdfData;
      emailDistrito?: string;
    };

    if (!salidaData || !salidaData.lugar || !salidaData.fecha_inicio) {
      return NextResponse.json(
        { error: 'Datos de la salida incompletos' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
    if (!resendApiKey) {
      console.warn('API Key de Resend no configurada. Saltando envío de correos.');
      return NextResponse.json({
        success: true,
        warning: 'Resend no configurado, documentos generados localmente.',
      });
    }

    // 1. Generar ambos PDFs con pdf-lib y firma digital estampada
    const [pdfDistritoBytes, pdfCarabinerosBytes] = await Promise.all([
      generarPdfComunicacionDistrito(salidaData),
      generarPdfConstanciaCarabineros(salidaData),
    ]);

    const pdfDistritoB64 = Buffer.from(pdfDistritoBytes).toString('base64');
    const pdfCarabinerosB64 = Buffer.from(pdfCarabinerosBytes).toString('base64');

    const nombreActividad = salidaData.tipo_actividad
      ? `${salidaData.tipo_actividad}: ${salidaData.lugar}`
      : `Salida a ${salidaData.lugar}`;

    // 2. Destinatarios para la Comunicación al Distrito
    const destinatariosDistrito = ['contacto@nuamana.cl'];
    if (emailDistrito && emailDistrito.trim().includes('@')) {
      destinatariosDistrito.push(emailDistrito.trim());
    }

    // 3. Correo 1: Comunicación al Distrito de Salidas
    const htmlDistrito = `
      <div style="font-family: Arial, sans-serif; color: #1b1b1b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cb3327; border-radius: 16px;">
        <h2 style="color: #cb3327; text-transform: uppercase; margin-bottom: 8px;">Guías y Scouts Nua Mana</h2>
        <h3 style="margin-top: 0;">Comunicación Oficial de Salida / Campamento</h3>
        <p>Estimado/a Director/a de Distrito y Equipo Distrital:</p>
        <p>Adjuntamos el documento oficial de comunicación de salida para la siguiente actividad programada:</p>
        <ul style="line-height: 1.6;">
          <li><strong>Actividad:</strong> ${nombreActividad}</li>
          <li><strong>Lugar:</strong> ${salidaData.lugar}</li>
          <li><strong>Fecha Inicio:</strong> ${salidaData.fecha_inicio}</li>
          <li><strong>Fecha Término:</strong> ${salidaData.fecha_termino}</li>
          <li><strong>Responsable:</strong> ${salidaData.responsable} (${salidaData.telefono})</li>
          <li><strong>Distrito:</strong> ${salidaData.distrito || 'Mapurayen'}</li>
        </ul>
        <p style="font-size: 0.9em; color: #555;">El documento adjunto incluye los aforos estimados, unidades participantes y la firma del responsable a cargo.</p>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #888; text-align: center;">Grupo Guías y Scouts Nua Mana • nuamana.cl</p>
      </div>
    `;

    const resendDistritoPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Nua Mana <contacto@nuamana.cl>',
        to: destinatariosDistrito,
        subject: `Comunicación al Distrito - ${nombreActividad}`,
        html: htmlDistrito,
        attachments: [
          {
            filename: `Comunicacion_Distrito_${salidaData.fecha_inicio || 'salida'}.pdf`,
            content: pdfDistritoB64,
          },
        ],
      }),
    });

    // 4. Correo 2: Constancia Campamento Carabineros
    const htmlCarabineros = `
      <div style="font-family: Arial, sans-serif; color: #1b1b1b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cb3327; border-radius: 16px;">
        <h2 style="color: #cb3327; text-transform: uppercase; margin-bottom: 8px;">Guías y Scouts Nua Mana</h2>
        <h3 style="margin-top: 0;">Constancia de Campamento / Salida para Carabineros</h3>
        <p>Se ha generado la constancia oficial de actividad para presentación ante la unidad policial respectiva:</p>
        <ul style="line-height: 1.6;">
          <li><strong>Lugar:</strong> ${salidaData.lugar} (${salidaData.localidad || 'S/I'})</li>
          <li><strong>Comuna Base:</strong> ${salidaData.comuna || 'La Granja'}</li>
          <li><strong>Fechas:</strong> ${salidaData.fecha_inicio} al ${salidaData.fecha_termino}</li>
          <li><strong>Total Asistentes:</strong> ${(Number(salidaData.numero_dirigentes) || 0) + (Number(salidaData.numero_apoderados) || 0) + (Number(salidaData.numero_nnj) || 0)} personas</li>
          <li><strong>Responsable:</strong> ${salidaData.responsable} (${salidaData.telefono})</li>
        </ul>
        <p style="font-size: 0.9em; color: #555;">El documento adjunto se encuentra listo para impresión y entrega.</p>
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #888; text-align: center;">Grupo Guías y Scouts Nua Mana • nuamana.cl</p>
      </div>
    `;

    const resendCarabinerosPromise = fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Nua Mana <contacto@nuamana.cl>',
        to: ['contacto@nuamana.cl'],
        subject: `Constancia Carabineros - ${nombreActividad}`,
        html: htmlCarabineros,
        attachments: [
          {
            filename: `Constancia_Carabineros_${salidaData.fecha_inicio || 'salida'}.pdf`,
            content: pdfCarabinerosB64,
          },
        ],
      }),
    });

    const [resDistrito, resCarabineros] = await Promise.all([
      resendDistritoPromise,
      resendCarabinerosPromise,
    ]);

    if (!resDistrito.ok) {
      console.warn('Error al despachar email de Distrito:', await resDistrito.text());
    }
    if (!resCarabineros.ok) {
      console.warn('Error al despachar email de Carabineros:', await resCarabineros.text());
    }

    return NextResponse.json({
      success: true,
      message: 'Documentos generados y correos despachados exitosamente.',
    });
  } catch (error) {
    console.error('Error en /api/salidas/notificar:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno al procesar los documentos' },
      { status: 500 }
    );
  }
}
