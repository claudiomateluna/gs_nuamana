-- RESET TOTAL DE RLS PARA ACTAS (MODO DEPURACIÓN)
-- Aplicar esto para eliminar cualquier bloqueo fantasma

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'acta%'
    LOOP
        EXECUTE 'ALTER TABLE public.' || t || ' ENABLE ROW LEVEL SECURITY';
        EXECUTE 'DROP POLICY IF EXISTS "debug_all" ON public.' || t;
        EXECUTE 'CREATE POLICY "debug_all" ON public.' || t || ' FOR ALL TO authenticated USING (true) WITH CHECK (true)';
    END LOOP;
END $$;

-- Asegurar que la función de validación no bloquee nada por ahora
CREATE OR REPLACE FUNCTION public.puede_crear_tipo_acta(tipo_acta text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN TRUE; END; $$;
