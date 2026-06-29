CREATE OR REPLACE FUNCTION public.puede_ver_acta_v2(acta_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Staff (Admin, Dirigente, Guiadora) ve todo
  IF (SELECT rol_id FROM public.perfiles WHERE id = auth.uid()) IN (1, 2, 3) THEN
    RETURN TRUE;
  END IF;

  -- 2. Participantes ven su propia acta
  IF EXISTS (SELECT 1 FROM public.acta_participantes WHERE acta_id = acta_id_param AND perfil_id = auth.uid()) THEN
    RETURN TRUE;
  END IF;

  -- 3. Visibilidad pública
  IF EXISTS (SELECT 1 FROM public.actas WHERE id = acta_id_param AND (confidencialidad = 'Pública' OR confidencialidad = 'Pública Interna')) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;
