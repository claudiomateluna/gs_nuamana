-- Proteger el campo 'estado' en perfiles para evitar auto-activación
-- 20260627000000_secure_estado_field.sql

CREATE OR REPLACE FUNCTION public.verificar_modificacion_perfil()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_my_rol int;
BEGIN
  -- Obtener rol del usuario actual
  v_my_rol := get_my_rol();

  -- Si se intenta cambiar el rol_id, la unidad_id o el estado
  IF (OLD.rol_id IS DISTINCT FROM NEW.rol_id OR 
      OLD.unidad_id IS DISTINCT FROM NEW.unidad_id OR 
      OLD.estado IS DISTINCT FROM NEW.estado) THEN
    -- Solo admin (1), dirigente (2) o guiadora (3) pueden hacerlo
    IF v_my_rol NOT IN (1, 2, 3) OR v_my_rol IS NULL THEN
      RAISE EXCEPTION 'Solo administradores, dirigentes o guiadoras pueden modificar el rol, unidad o estado de un perfil.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
