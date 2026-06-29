-- 1. Eliminar duplicados en acta_participantes manteniendo solo uno
DELETE FROM public.acta_participantes a
USING public.acta_participantes b
WHERE a.id > b.id
  AND a.acta_id = b.acta_id
  AND a.perfil_id = b.perfil_id;

-- 2. Añadir restricción de unicidad para evitar que ocurra de nuevo
ALTER TABLE public.acta_participantes 
ADD CONSTRAINT acta_participantes_acta_id_perfil_id_key 
UNIQUE (acta_id, perfil_id);
