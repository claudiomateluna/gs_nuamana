import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isDirectivo } from '@/lib/roles';

export async function POST(request: NextRequest) {
  try {
    const { propuestaId, articuloId } = await request.json();

    if (!propuestaId || !articuloId) {
      return NextResponse.json({ error: 'Faltan propuestaId o articuloId' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const userClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await userClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data: profile } = await userClient.from('perfiles').select('rol_id').eq('id', user.id).single();
    if (!profile || !isDirectivo(profile)) {
      return NextResponse.json({ error: 'Solo directivos pueden vincular' }, { status: 403 });
    }

    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseServiceKey || supabaseServiceKey.length < 10) {
      console.error('SUPABASE_SERVICE_ROLE_KEY no está configurada o es muy corta');
      return NextResponse.json({ error: 'Servicio no configurado' }, { status: 500 });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data, error } = await adminClient
      .from('ciclo_propuestas')
      .update({ articulo_id: articuloId })
      .eq('id', propuestaId)
      .select();

    if (error) {
      console.error('Error vinculando articulo:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Error en vincular-articulo:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
