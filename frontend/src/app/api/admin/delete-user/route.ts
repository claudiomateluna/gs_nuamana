import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Falta el ID del usuario a eliminar' }, { status: 400 });
    }

    // 1. Obtener la sesión del usuario actual que hace la petición
    // Para validar que sea administrador
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Crear cliente Supabase temporal con el token del usuario para verificar su rol
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // Consultar el rol del usuario que hace la petición en la base de datos
    const { data: profile, error: profileError } = await userClient
      .from('perfiles')
      .select('rol_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden eliminar usuarios' }, { status: 403 });
    }

    // 2. Crear cliente Supabase Admin usando la service_role key
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseServiceKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY no está configurada en las variables de entorno.');
      return NextResponse.json({ error: 'Servicio no configurado en el servidor' }, { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Eliminar relaciones y datos del usuario de forma segura
    
    // Primero: contactos de emergencia vinculados
    await adminClient.from('contactos_emergencia').delete().eq('perfil_id', targetUserId);
    
    // Segundo: ficha médica del perfil
    await adminClient.from('perfiles_ficha_medica').delete().eq('perfil_id', targetUserId);

    // Tercero: agendas personales
    await adminClient.from('agendas_personales').delete().eq('perfil_id', targetUserId);

    // Cuarto: notificaciones
    await adminClient.from('notificaciones').delete().eq('perfil_id', targetUserId);

    // Quinto: especialidades personales
    await adminClient.from('especialidades_personales').delete().eq('perfil_id', targetUserId);

    // Sexto: asistencia a actividades
    await adminClient.from('asistencia_actividades').delete().eq('perfil_id', targetUserId);

    // Séptimo: autorizaciones de actividades
    await adminClient.from('autorizaciones_actividades').delete().eq('perfil_id', targetUserId);

    // Octavo: perfil de la tabla perfiles
    await adminClient.from('perfiles').delete().eq('id', targetUserId);

    // Noveno: eliminar de auth.users usando la API de administración
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(targetUserId);

    if (deleteError) {
      console.error('Error al eliminar usuario en auth:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en la ruta de eliminación de usuario:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
