-- Políticas de DELETE para las tablas hijas de actas
-- Permitir borrar si el usuario es el autor del acta o es un staff (rol_id 1, 2, 3)

-- 1. acta_participantes
DROP POLICY IF EXISTS "Participantes delete policy" ON "public"."acta_participantes";
CREATE POLICY "Participantes delete policy" ON "public"."acta_participantes" 
    FOR DELETE 
    TO "authenticated" 
    USING (
      (EXISTS (SELECT 1 FROM "public"."actas" WHERE "id" = "acta_id" AND "ingresado_por" = "auth"."uid"())) OR 
      ((SELECT "rol_id" FROM "public"."perfiles" WHERE "id" = "auth"."uid"()) IN (1, 2, 3))
    );

-- 2. acta_firmas
DROP POLICY IF EXISTS "Firmas delete policy" ON "public"."acta_firmas";
CREATE POLICY "Firmas delete policy" ON "public"."acta_firmas" 
    FOR DELETE 
    TO "authenticated" 
    USING (
      (EXISTS (SELECT 1 FROM "public"."actas" WHERE "id" = "acta_id" AND "ingresado_por" = "auth"."uid"())) OR 
      ((SELECT "rol_id" FROM "public"."perfiles" WHERE "id" = "auth"."uid"()) IN (1, 2, 3))
    );

-- 3. acta_acuerdos
DROP POLICY IF EXISTS "Acuerdos delete policy" ON "public"."acta_acuerdos";
CREATE POLICY "Acuerdos delete policy" ON "public"."acta_acuerdos" 
    FOR DELETE 
    TO "authenticated" 
    USING (
      (EXISTS (SELECT 1 FROM "public"."actas" WHERE "id" = "acta_id" AND "ingresado_por" = "auth"."uid"())) OR 
      ((SELECT "rol_id" FROM "public"."perfiles" WHERE "id" = "auth"."uid"()) IN (1, 2, 3))
    );
