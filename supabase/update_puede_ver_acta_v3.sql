-- 1. Crear la nueva función que no consulta la tabla actas para evitar problemas de visibilidad de transacción/RLS
CREATE OR REPLACE FUNCTION "public"."puede_ver_acta_v3"(
  "v_ingresado_por" "uuid",
  "v_confidencialidad" "text",
  "v_tipo" "text",
  "v_unidad_id" "int",
  "v_acta_id" "uuid"
) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_rol_id int;
  v_user_unidad_id int;
  v_asistencia text;
BEGIN
  -- REGLA DE SEGURIDAD ESENCIAL: El autor/creador de la acta siempre puede verla.
  -- Al usar los argumentos de la fila directamente, evitamos consultar la tabla 'actas' y eliminamos cualquier delay/error de visibilidad.
  IF v_ingresado_por = v_user_id THEN RETURN TRUE; END IF;

  -- Obtener datos del usuario
  SELECT rol_id, unidad_id INTO v_rol_id, v_user_unidad_id FROM perfiles WHERE id = v_user_id;

  -- REGLA DE ORO: Admin ve todo. Confidencialidad "Pública" es para todos.
  IF v_rol_id = 1 OR v_confidencialidad = 'Pública' THEN RETURN TRUE; END IF;

  -- Obtener asistencia del usuario en esta acta (desde la tabla cruzada)
  SELECT asistencia INTO v_asistencia FROM acta_participantes WHERE acta_id = v_acta_id AND perfil_id = v_user_id;

  -- REGLAS POR CONFIDENCIALIDAD
  -- Confidencial: Solo Presente o Remoto
  IF v_confidencialidad = 'Confidencial' THEN
    RETURN v_asistencia IN ('Presente', 'Remoto');
  END IF;

  -- Restringida: Cualquier estado de asistencia (excepto No Invitado o NULL)
  IF v_confidencialidad = 'Restringida' THEN
    RETURN v_asistencia IN ('Presente', 'Remoto', 'Ausente', 'Justificado');
  END IF;

  -- Pública Interna: Según el tipo de reunión y rol
  IF v_confidencialidad = 'Pública Interna' THEN
    CASE v_tipo
      WHEN 'Consejo de Unidad' THEN
        RETURN v_user_unidad_id = v_unidad_id OR v_rol_id IN (2,3); -- Miembros unidad o dirigentes
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

-- 2. Eliminar la política anterior de lectura
DROP POLICY IF EXISTS "Actas select policy" ON "public"."actas";

-- 3. Crear la nueva política de lectura utilizando la función v3 optimizada
CREATE POLICY "Actas select policy" ON "public"."actas" 
    FOR SELECT 
    USING ("public"."puede_ver_acta_v3"("ingresado_por", "confidencialidad", "tipo", "unidad_id", "id"));
