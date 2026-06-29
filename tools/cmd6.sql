DROP POLICY IF EXISTS "Acuerdos insert policy" ON public.acta_acuerdos;
CREATE POLICY "Acuerdos insert policy" ON public.acta_acuerdos FOR INSERT TO authenticated WITH CHECK (true);