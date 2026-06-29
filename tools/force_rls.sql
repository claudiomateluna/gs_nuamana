DO $$
BEGIN
    -- 1. Limpiar políticas antiguas
    EXECUTE 'DROP POLICY IF EXISTS "Actas insert policy" ON public.actas';
    EXECUTE 'DROP POLICY IF EXISTS "Actas insert management" ON public.actas';
    EXECUTE 'DROP POLICY IF EXISTS "Actas insert policy v2" ON public.actas';
    
    -- 2. Crear nueva política unificada
    -- Nota: Usamos EXECUTE para evitar problemas de parsing dentro del DO block
    EXECUTE 'CREATE POLICY "Actas insert policy v2" ON public.actas
             FOR INSERT 
             TO authenticated
             WITH CHECK (true)'; -- Temporalmente abierta para autenticados para depurar
END $$;
