-- Limpieza total de políticas de inserción en Actas
DROP POLICY IF EXISTS "Actas insert policy" ON public.actas;
DROP POLICY IF EXISTS "Actas insert management" ON public.actas;

-- Crear una única política de inserción robusta
CREATE POLICY "Actas insert policy v2" ON public.actas
FOR INSERT 
TO authenticated
WITH CHECK (
  (SELECT rol_id FROM public.perfiles WHERE id = auth.uid()) IN (1, 2, 3) -- Staff puede crear todo
  OR (
    (SELECT rol_id FROM public.perfiles WHERE id = auth.uid()) IN (9, 10, 11, 12, 13) 
    AND tipo = 'Consejo de Unidad'
  )
  OR (
    (SELECT rol_id FROM public.perfiles WHERE id = auth.uid()) IN (4, 5, 6, 7)
    AND tipo IN ('Comité de Padres', 'Comite de Padres', 'Reunión de Apoderados', 'Reunion de Apoderados', 'Consejo de Grupo')
  )
);
