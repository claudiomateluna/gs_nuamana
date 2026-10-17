import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { rut } = await request.json();

    if (!rut || typeof rut !== 'string') {
      return NextResponse.json({ error: 'El R.U.T. es requerido' }, { status: 400 });
    }

    // Normalizar formato de RUT (sin puntos, con guion y mayúscula)
    let rutLimpio = rut.trim().toUpperCase().replace(/\./g, '');
    if (!rutLimpio.includes('-') && rutLimpio.length > 1) {
      rutLimpio = rutLimpio.slice(0, -1) + '-' + rutLimpio.slice(-1);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const resendApiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nuamana.cl';

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Configuración de Supabase incompleta (URL o Service Role Key)');
      return NextResponse.json({ error: 'Servicio de autenticación no disponible' }, { status: 500 });
    }

    if (!resendApiKey) {
      console.error('API Key de Resend no configurada (RESEND_API_KEY o SMTP_PASS)');
      return NextResponse.json({ error: 'Servicio de correo no configurado' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Buscar en 'perfiles' el correo real asociado al RUT
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .select('id, nombres, apellidos, email')
      .eq('rut', rutLimpio)
      .maybeSingle();

    if (perfilError) {
      console.error('Error buscando perfil por RUT:', perfilError);
    }

    // Por seguridad, si el usuario no existe retornamos éxito genérico
    if (!perfil || !perfil.email) {
      return NextResponse.json({ 
        success: true, 
        message: 'Si el R.U.T. coincide con un usuario registrado, se ha enviado un correo con las instrucciones.' 
      });
    }

    // 2. Generar token de recuperación con el email sintético de auth ({rut}@nuamana.cl)
    const syntheticEmail = `${rutLimpio.toLowerCase()}@nuamana.cl`;
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: syntheticEmail
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('Error generando token de recuperación:', linkError);
      return NextResponse.json({ error: 'No se pudo generar el enlace de recuperación' }, { status: 500 });
    }

    // 3. Construir enlace directo a nuestro frontend
    const resetUrl = `${siteUrl.replace(/\/$/, '')}/cambiar-contrasena?token_hash=${linkData.properties.hashed_token}&type=recovery`;

    // 4. Enviar correo a la casilla REAL del usuario vía Resend
    const nombreUsuario = [perfil.nombres, perfil.apellidos].filter(Boolean).join(' ') || 'Hermano Scout';
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; width: 100%; margin: 0 auto; padding: 35px 30px; border: 1px solid #cb3327; border-radius: 20px; background-color: #ffffff; color: #1b1b1b; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); box-sizing: border-box;">
        
        <!-- Encabezado con Identidad de Marca -->
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/Iconos_LogoNuaManaColorConIsla.svg" alt="Logo de Nua Mana" style="width: 100px; height: auto;" />
          <h3 style="color: #1b1b1b; margin: 0; font-size: 1.6em; line-height: 1;">
            Guías y Scouts
          </h3>
          <h1 style="color: #cb3327; margin: 0; font-size: 2em; text-transform: uppercase; font-weight: bold; line-height: 1;">
            Nua Mana
          </h1>
          <span style="font-size: 0.85em; color: #71717a; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
            Recupera tú Contraseña
          </span>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #cb3327; margin-bottom: 25px;" />
        
        <!-- Contenido y Saludo -->
        <p style="font-size: 1em; line-height: 1.6; color: #1b1b1b; margin-top: 0;">
          Hola <strong>${nombreUsuario}</strong>,
        </p>
        
        <p style="font-size: 0.95em; line-height: 1.6; color: #3f3f46;">
          Hemos recibido una solicitud para restablecer la contraseña asociada a tu R.U.T. <strong>${rutLimpio}</strong>.
        </p>
        
        <p style="font-size: 0.95em; line-height: 1.6; color: #3f3f46;">
          Para definir una nueva contraseña, haz clic en el siguiente botón:
        </p>
        
        <!-- Botón de Llamado a la Acción (CTA) -->
        <div style="text-align: center; margin: 35px 0;">
          <a href="${resetUrl}" target="_blank" style="background-color: #cb3327; color: #ffffff; text-decoration: none; padding: 14px 30px; font-weight: bold; font-size: 0.95em; border-radius: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(203, 51, 39, 0.3);">
            Restablecer Mi Contraseña
          </a>
        </div>
        
        <!-- Nota de Expiración y Seguridad -->
        <p style="font-size: 0.85em; line-height: 1.5; color: #71717a; text-align: center;">
          Este enlace es de uso único y expirará pronto por tu seguridad. Si no solicitaste este cambio, puedes ignorar este mensaje; tu cuenta continúa segura.
        </p>
        
        <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 25px 0;" />
        
        <!-- Pie Institucional -->
        <div style="text-align: center; font-size: 0.8em; color: #a1a1aa; line-height: 1.5;">
          <a href="https://nuamana.cl" target="_blank" style="color: #3f3f46; text-decoration: none;">Guías y Scouts Nua Mana</a><br>
          <strong>Una Nueva Aventura</strong><br>
          <a href="https://nuamana.cl" target="_blank" style="color: #cb3327; text-decoration: none; font-weight: bold;">nuamana.cl</a>
        </div>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Nua Mana <contacto@nuamana.cl>',
        to: [perfil.email],
        subject: 'Recuperación de Contraseña - Guías y Scouts Nua Mana',
        html: emailHtml
      })
    });

    if (!resendRes.ok) {
      const errorData = await resendRes.json();
      console.error('Error enviando email vía Resend:', errorData);
      return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Si el R.U.T. coincide con un usuario registrado, se ha enviado un correo con las instrucciones.' 
    });
  } catch (error) {
    console.error('Error en solicitar recuperación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
