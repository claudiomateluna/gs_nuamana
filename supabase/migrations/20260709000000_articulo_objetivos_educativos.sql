-- 1. Crear tabla de unión para vincular artículos con objetivos educativos de progresión
CREATE TABLE IF NOT EXISTS "public"."articulo_objetivos_educativos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "articulo_id" "uuid" NOT NULL,
    "objetivo_id" "uuid" NOT NULL,
    "como_se_cumple" "text", -- Campo opcional
    "created_at" timestamp with time zone DEFAULT "now"(),
    PRIMARY KEY ("id"),
    CONSTRAINT "articulo_obj_educativos_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos" ("id") ON DELETE CASCADE,
    CONSTRAINT "articulo_obj_educativos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "public"."progresion_objetivos" ("id") ON DELETE CASCADE,
    CONSTRAINT "unique_articulo_objetivo_educativo" UNIQUE ("articulo_id", "objetivo_id")
);

-- 2. Habilitar Seguridad de Fila (RLS)
ALTER TABLE "public"."articulo_objetivos_educativos" ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas RLS de lectura y escritura
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Lectura pública de objetivos educativos de artículos' AND tablename = 'articulo_objetivos_educativos'
    ) THEN
        CREATE POLICY "Lectura pública de objetivos educativos de artículos" ON "public"."articulo_objetivos_educativos"
            FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Escritura para dirigentes autorizados' AND tablename = 'articulo_objetivos_educativos'
    ) THEN
        CREATE POLICY "Escritura para dirigentes autorizados" ON "public"."articulo_objetivos_educativos"
            FOR ALL TO authenticated
            USING ((( SELECT perfiles.rol_id FROM perfiles WHERE perfiles.id = auth.uid()) = ANY (ARRAY[1, 2, 3])))
            WITH CHECK ((( SELECT perfiles.rol_id FROM perfiles WHERE perfiles.id = auth.uid()) = ANY (ARRAY[1, 2, 3])));
    END IF;
END
$$;

-- 4. Migración automática de datos existentes (protegida para evitar errores con JSON nulos/vacíos)
INSERT INTO "public"."articulo_objetivos_educativos" ("articulo_id", "objetivo_id", "como_se_cumple")
SELECT 
    a.id as articulo_id,
    (obj->>'id')::uuid as objetivo_id,
    NULL as como_se_cumple
FROM 
    "public"."articulos" a,
    jsonb_array_elements(
        CASE 
            WHEN jsonb_typeof(a.metadata->'objetivos_educativos') = 'array' 
            THEN a.metadata->'objetivos_educativos' 
            ELSE '[]'::jsonb 
        END
    ) obj
ON CONFLICT ("articulo_id", "objetivo_id") DO NOTHING;
