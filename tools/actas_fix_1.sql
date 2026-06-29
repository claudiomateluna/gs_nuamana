CREATE OR REPLACE FUNCTION public.puede_crear_tipo_acta(tipo_acta text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rol_id int;
BEGIN
  SELECT rol_id INTO v_rol_id FROM public.perfiles WHERE id = auth.uid();
  IF v_rol_id IN (1, 2, 3) THEN RETURN TRUE; END IF;
  IF v_rol_id IN (9, 10, 11, 12, 13) AND tipo_acta = 'Consejo de Unidad' THEN RETURN TRUE; END IF;
  IF v_rol_id IN (4, 5, 6, 7) AND tipo_acta IN ('Comité de Padres', 'Comite de Padres', 'Reunión de Apoderados', 'Reunion de Apoderados', 'Consejo de Grupo') THEN RETURN TRUE; END IF;
  RETURN FALSE;
END;
$$;
