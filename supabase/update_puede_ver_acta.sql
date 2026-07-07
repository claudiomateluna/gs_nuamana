CREATE OR REPLACE FUNCTION "public"."puede_ver_acta_v2"("acta_id_param" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_rol_id int;
  v_unidad_id int;
  v_acta record;
  v_asistencia text;
BEGIN
  -- Obtener datos del usuario
  SELECT rol_id, unidad_id INTO v_rol_id, v_unidad_id FROM perfiles WHERE id = v_user_id;
  
  -- Obtener datos del acta
  SELECT * INTO v_acta FROM actas WHERE id = acta_id_param;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  -- REGLA DE SEGURIDAD ESENCIAL: El autor/creador de la acta siempre puede verla.
  -- Esto evita el error de violación de RLS en el "INSERT ... RETURNING" antes de insertar los participantes.
  IF v_acta.ingresado_por = v_user_id THEN RETURN TRUE; END IF;

  -- REGLA DE ORO: Admin ve todo. Confidencialidad "Pública" es para todos.
  IF v_rol_id = 1 OR v_acta.confidencialidad = 'Pública' THEN RETURN TRUE; END IF;

  -- Obtener asistencia del usuario en esta acta (si existe)
  SELECT asistencia INTO v_asistencia FROM acta_participantes WHERE acta_id = acta_id_param AND perfil_id = v_user_id;

  -- REGLAS POR CONFIDENCIALIDAD
  -- Confidencial: Solo Presente o Remoto
  IF v_acta.confidencialidad = 'Confidencial' THEN
    RETURN v_asistencia IN ('Presente', 'Remoto');
  END IF;

  -- Restringida: Cualquier estado de asistencia (excepto No Invitado o NULL)
  IF v_acta.confidencialidad = 'Restringida' THEN
    RETURN v_asistencia IN ('Presente', 'Remoto', 'Ausente', 'Justificado');
  END IF;

  -- Pública Interna: Según el tipo de reunión y rol
  IF v_acta.confidencialidad = 'Pública Interna' THEN
    CASE v_acta.tipo
      WHEN 'Consejo de Unidad' THEN
        RETURN v_unidad_id = v_acta.unidad_id OR v_rol_id IN (2,3); -- Miembros unidad o dirigentes
      WHEN 'Reunión de Sábado' THEN
        RETURN v_rol_id IN (2, 3); -- Solo dirigentes/guiadoras
      WHEN 'Comité de Padres' THEN
        RETURN v_rol_id IN (2, 3, 4, 5, 6, 7);
      WHEN 'Reunión de Apoderados' THEN
        RETURN v_rol_id IN (2, 3, 4, 5, 6, 7, 8);
      WHEN 'Consejo de Grupo' THEN
        RETURN TRUE; -- Visible para todos (NNJ, Apoderados, Staff) según tu regla
      ELSE
        RETURN FALSE;
    END CASE;
  END IF;

  RETURN FALSE;
END;
$$;
