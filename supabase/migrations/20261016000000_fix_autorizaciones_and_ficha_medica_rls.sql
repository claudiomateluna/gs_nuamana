-- Migración para permitir a apoderados y directivos insertar y actualizar la ficha médica de sus pupilos
-- y reforzar la seguridad en inserción de autorizaciones.

-- 1. Limpieza de políticas previas en perfiles_ficha_medica (excepto la de lectura)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'perfiles_ficha_medica' 
          AND cmd != 'SELECT'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.perfiles_ficha_medica', pol.policyname);
    END LOOP;
END $$;

-- 2. Política integral para perfiles_ficha_medica (propia, de pupilos o administradores)
CREATE POLICY "perfiles_ficha_medica_manage_policy" 
ON "public"."perfiles_ficha_medica" 
FOR ALL 
TO "authenticated" 
USING (
  ("auth"."uid"() = "perfil_id") 
  OR (EXISTS (
    SELECT 1 FROM "public"."perfiles" 
    WHERE "perfiles"."id" = "perfiles_ficha_medica"."perfil_id" 
      AND "perfiles"."apoderado_id" = "auth"."uid"()
  ))
  OR (EXISTS (
    SELECT 1 FROM "public"."perfiles" 
    WHERE "perfiles"."id" = "auth"."uid"() 
      AND "perfiles"."rol_id" <= 3
  ))
) 
WITH CHECK (
  ("auth"."uid"() = "perfil_id") 
  OR (EXISTS (
    SELECT 1 FROM "public"."perfiles" 
    WHERE "perfiles"."id" = "perfiles_ficha_medica"."perfil_id" 
      AND "perfiles"."apoderado_id" = "auth"."uid"()
  ))
  OR (EXISTS (
    SELECT 1 FROM "public"."perfiles" 
    WHERE "perfiles"."id" = "auth"."uid"() 
      AND "perfiles"."rol_id" <= 3
  ))
);

-- 3. Limpieza y creación de política de inserción en autorizaciones_actividades
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'autorizaciones_actividades' 
          AND cmd = 'INSERT'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.autorizaciones_actividades', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "autorizaciones_actividades_insert_policy" 
ON "public"."autorizaciones_actividades" 
FOR INSERT 
TO "authenticated" 
WITH CHECK (
  ("auth"."uid"() = "perfil_id") 
  OR ("auth"."uid"() = (
    SELECT "perfiles"."apoderado_id"
    FROM "public"."perfiles"
    WHERE "perfiles"."id" = "autorizaciones_actividades"."perfil_id"
  ))
  OR (EXISTS (
    SELECT 1 FROM "public"."perfiles"
    WHERE "perfiles"."id" = "auth"."uid"() 
      AND "perfiles"."rol_id" <= 3
  ))
);
