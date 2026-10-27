-- Migration: Unificar y deduplicar especialidades_definiciones
-- Las especialidades son transversales (Manada, Compañía, Tropa).
-- Se preserva 1 sola definición canónica por nombre, reasignando de forma segura
-- cualquier referencia existente en especialidades_personales.

DO $$
DECLARE
    rec RECORD;
    v_canonical_id UUID;
BEGIN
    -- 1. Iterar sobre todos los nombres de especialidad que tengan más de 1 registro
    FOR rec IN 
        SELECT nombre, COUNT(*) as total_rows
        FROM public.especialidades_definiciones
        GROUP BY nombre
        HAVING COUNT(*) > 1
    LOOP
        -- 2. Elegir el registro canónico:
        -- Prioriza el que tenga unidad_id IS NULL (si existe), o el más antiguo por created_at / id.
        SELECT id INTO v_canonical_id
        FROM public.especialidades_definiciones
        WHERE nombre = rec.nombre
        ORDER BY 
            CASE WHEN unidad_id IS NULL THEN 0 ELSE 1 END ASC,
            created_at ASC,
            id ASC
        LIMIT 1;

        -- 3. Reasignar cualquier especialidad personal que apunte a los duplicados
        UPDATE public.especialidades_personales
        SET definicion_id = v_canonical_id
        WHERE definicion_id IN (
            SELECT id FROM public.especialidades_definiciones
            WHERE nombre = rec.nombre AND id <> v_canonical_id
        );

        -- 4. Eliminar los registros duplicados sobrantes
        DELETE FROM public.especialidades_definiciones
        WHERE nombre = rec.nombre AND id <> v_canonical_id;
    END LOOP;
END $$;

-- 5. Las especialidades son transversales: asegurarse de que unidad_id sea nullable
ALTER TABLE public.especialidades_definiciones ALTER COLUMN unidad_id DROP NOT NULL;

-- 6. Establecer unidad_id = NULL para que no haya ambigüedad por rama
UPDATE public.especialidades_definiciones SET unidad_id = NULL WHERE unidad_id IS NOT NULL;

-- 7. Agregar restricción UNIQUE en nombre para evitar duplicaciones futuras
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'especialidades_definiciones_nombre_key'
    ) THEN
        ALTER TABLE public.especialidades_definiciones 
        ADD CONSTRAINT especialidades_definiciones_nombre_key UNIQUE (nombre);
    END IF;
END $$;
