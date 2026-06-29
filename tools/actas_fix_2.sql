DROP POLICY IF EXISTS "Actas insert policy" ON public.actas;
DROP POLICY IF EXISTS "Actas insert management" ON public.actas;
CREATE POLICY "Actas insert policy" ON public.actas FOR INSERT TO authenticated WITH CHECK (puede_crear_tipo_acta(tipo));

DROP POLICY IF EXISTS "Acuerdos manage" ON public.acta_acuerdos;
DROP POLICY IF EXISTS "Acuerdos insert policy" ON public.acta_acuerdos;
CREATE POLICY "Acuerdos insert policy" ON public.acta_acuerdos FOR INSERT TO authenticated WITH CHECK (true);
