-- Restricciones para Rol 14 (Sin Rol) y Seguridad contra Escalación de Privilegios
-- 20260626040000_rol_14_restrictions.sql

-- 1. Crear trigger para evitar que usuarios se escalen el rol o cambien de unidad solos
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

  -- Si se intenta cambiar el rol_id o la unidad_id
  IF (OLD.rol_id IS DISTINCT FROM NEW.rol_id OR OLD.unidad_id IS DISTINCT FROM NEW.unidad_id) THEN
    -- Solo admin (1), dirigente (2) o guiadora (3) pueden hacerlo
    IF v_my_rol NOT IN (1, 2, 3) OR v_my_rol IS NULL THEN
      RAISE EXCEPTION 'Solo administradores, dirigentes o guiadoras pueden modificar el rol o unidad de un perfil.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_verificar_modificacion_perfil ON public.perfiles;
CREATE TRIGGER trigger_verificar_modificacion_perfil
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW
  EXECUTE FUNCTION public.verificar_modificacion_perfil();

-- 2. Restringir modificación del historial de progresión (progresion_avance) para Rol 14
DROP POLICY IF EXISTS "Progresion avance access" ON public.progresion_avance;

CREATE POLICY "Progresion avance select policy" ON public.progresion_avance
  FOR SELECT 
  TO authenticated 
  USING (
    (perfil_id = auth.uid()) OR 
    ((SELECT apoderado_id FROM perfiles WHERE id = perfil_id) = auth.uid()) OR 
    (get_my_rol() IN (1, 2, 3))
  );

CREATE POLICY "Progresion avance write policy" ON public.progresion_avance
  FOR ALL 
  TO authenticated 
  USING (
    (get_my_rol() NOT IN (14) AND (
      (perfil_id = auth.uid()) OR 
      ((SELECT apoderado_id FROM perfiles WHERE id = perfil_id) = auth.uid()) OR 
      (get_my_rol() IN (1, 2, 3))
    ))
  )
  WITH CHECK (
    (get_my_rol() NOT IN (14) AND (
      (perfil_id = auth.uid()) OR 
      ((SELECT apoderado_id FROM perfiles WHERE id = perfil_id) = auth.uid()) OR 
      (get_my_rol() IN (1, 2, 3))
    ))
  );
