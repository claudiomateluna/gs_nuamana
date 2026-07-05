import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, nombres, apellidos, rut, rol } = await request.json();

    if (!email || !nombres) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Utilizar la clave API de Resend (la misma guardada en SMTP_PASS en el .env)
    const resendApiKey = process.env.SMTP_PASS || process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('API Key de Resend no configurada en el servidor (SMTP_PASS o RESEND_API_KEY vacía).');
      return NextResponse.json({ error: 'Servicio de correo no configurado' }, { status: 500 });
    }

    // Formatear rol para visualización amigable
    const rolFormat: Record<string, string> = {
      'dirigente': 'Dirigente',
      'guiadora': 'Guiadora',
      'apoderado': 'Apoderado',
      'lobato (a)': 'Lobato (a)',
      'guia': 'Guía',
      'scout': 'Scout',
      'pionera (o)': 'Pionera (o)',
      'caminante': 'Caminante'
    };
    const friendlyRol = rolFormat[rol] || rol;

    // Cuerpo del correo con diseño estético e institucional
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e4e4e7; border-radius: 20px; background-color: #ffffff; color: #1b1b1b;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #cb3327; margin: 0; font-size: 1.6em; text-transform: uppercase; letter-spacing: -0.5px;">
            Guías y Scouts Nua Mana
          </h2>
          <span style="font-size: 0.85em; color: #71717a; text-transform: uppercase; font-weight: bold; tracking: 1px;">
            Notificación de Registro
          </span>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin-bottom: 25px;" />
        
        <p style="font-size: 1em; line-height: 1.6; margin-bottom: 15px;">
          Hola <strong>${nombres} ${apellidos}</strong>,
        </p>
        
        <p style="font-size: 0.95em; line-height: 1.6; color: #3f3f46; margin-bottom: 20px;">
          Tu cuenta ha sido creada exitosamente en la plataforma de Guías y Scouts Nua Mana. A continuación, te recordamos los datos para acceder al sistema:
        </p>
        
        <div style="background-color: #f4f4f5; padding: 20px; border-radius: 16px; margin: 25px 0; border: 1px solid #e4e4e7;">
          <h4 style="margin: 0 0 12px 0; font-size: 0.9em; text-transform: uppercase; color: #71717a; letter-spacing: 0.5px;">
            Datos de Acceso e Identidad:
          </h4>
          <table style="width: 100%; font-size: 0.95em; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #71717a; width: 40%;"><strong>R.U.T. de Ingreso:</strong></td>
              <td style="padding: 6px 0; color: #1b1b1b; font-family: monospace; font-size: 1.1em;"><strong>${rut}</strong></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #71717a;"><strong>Rol asignado:</strong></td>
              <td style="padding: 6px 0; color: #1b1b1b;">${friendlyRol}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #71717a;"><strong>Correo electrónico:</strong></td>
              <td style="padding: 6px 0; color: #1b1b1b;">${email}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 0.95em; line-height: 1.6; color: #3f3f46; margin-bottom: 25px;">
          <strong>¿Qué pasa ahora?</strong><br>
          Si te registraste como Dirigente o Guiadora, tu cuenta se encuentra en estado <em>Pendiente</em> de validación por seguridad. Un administrador activará tu perfil a la brevedad y recibirás una notificación cuando puedas acceder.
        </p>
        
        <p style="font-size: 0.95em; line-height: 1.6; color: #3f3f46; margin-bottom: 25px;">
          Si tienes dudas o necesitas asistencia, puedes responder directamente a este correo electrónico.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 25px 0;" />
        
        <div style="text-align: center; font-size: 0.85em; color: #a1a1aa; line-height: 1.5;">
          <strong>Siempre Listos para Servir</strong><br>
          Guías y Scouts Nua Mana<br>
          <a href="https://nuamana.cl" style="color: #cb3327; text-decoration: none; font-weight: bold;">nuamana.cl</a>
        </div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Nua Mana <contacto@nuamana.cl>',
        to: [email],
        subject: '¡Tu cuenta ha sido creada con éxito! - Nua Mana',
        html: emailHtml
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al enviar correo con Resend:', errorData);
      return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en la ruta de envío de correo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
