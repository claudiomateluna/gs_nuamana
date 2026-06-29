-- Corrección de Políticas RLS para Actas
-- Asegura que Dirigentes, Guiadoras y Directiva puedan crear actas correctamente

-- 1. Actualizar función de validación de creación
CREATE OR REPLACE FUNCTION public.puede_crear_tipo_acta(tipo_acta text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER -- Asegura que pueda leer la tabla perfiles sin restricciones de RLS
AS $$
DECLARE
  v_rol_id int;
BEGIN
  -- Obtener el rol del usuario autenticado
  SELECT rol_id INTO v_rol_id FROM public.perfiles WHERE id = auth.uid();

  -- 1. Staff (Admin, Dirigente, Guiadora) puede crear cualquier tipo de acta
  IF v_rol_id IN (1, 2, 3) THEN 
    RETURN TRUE; 
  END IF;

  -- 2. NNJ (9-13) solo puede crear 'Consejo de Unidad'
  IF v_rol_id IN (9, 10, 11, 12, 13) AND tipo_acta = 'Consejo de Unidad' THEN
    RETURN TRUE;
  END IF;

  -- 3. Directiva de Padres (4-7) ciertos tipos (manejo de tildes y variaciones)
  IF v_rol_id IN (4, 5, 6, 7) AND tipo_acta IN ('Comité de Padres', 'Comite de Padres', 'Reunión de Apoderados', 'Reunion de Apoderados', 'Consejo de Grupo') THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

-- 2. Unificar y limpiar políticas de inserción en la tabla actas
DROP POLICY IF EXISTS "Actas insert policy" ON public.actas;
DROP POLICY IF EXISTS "Actas insert management" ON public.actas;

CREATE POLICY "Actas insert policy" ON public.actas
FOR INSERT 
TO authenticated
WITH CHECK (
  puede_crear_tipo_acta(tipo)
);

-- 3. Asegurar que los acuerdos también puedan ser insertados
-- (Esto es necesario porque el acta_crear inserta el acta y luego los acuerdos)
DROP POLICY IF EXISTS "Acuerdos manage" ON public.acta_acuerdos;
CREATE POLICY "Acuerdos insert policy" ON public.acta_acuerdos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.actas 
    WHERE id = acta_id 
    AND (ingresado_por = auth.uid() OR puede_crear_tipo_acta(tipo))
  )
);
