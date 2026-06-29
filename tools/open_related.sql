DO $$
BEGIN
    DROP POLICY IF EXISTS "Acuerdos manage" ON public.acta_acuerdos;
    DROP POLICY IF EXISTS "Acuerdos insert policy" ON public.acta_acuerdos;
    CREATE POLICY "Acuerdos open insert" ON public.acta_acuerdos FOR INSERT TO authenticated WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Participantes manage" ON public.acta_participantes;
    DROP POLICY IF EXISTS "Participantes insert policy" ON public.acta_participantes;
    CREATE POLICY "Participantes open insert" ON public.acta_participantes FOR INSERT TO authenticated WITH CHECK (true);
END $$;
