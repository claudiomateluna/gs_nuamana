-- Limpiar y abrir políticas para ciclo_propuestas
DROP POLICY IF EXISTS "Cualquiera actualiza/borra propuestas" ON public.ciclo_propuestas;
DROP POLICY IF EXISTS "Lectura de propuestas" ON public.ciclo_propuestas;
DROP POLICY IF EXISTS "Cualquiera crea propuestas" ON public.ciclo_propuestas;

CREATE POLICY "propuestas_open_all" ON public.ciclo_propuestas FOR ALL TO authenticated USING (true) WITH CHECK (true);
