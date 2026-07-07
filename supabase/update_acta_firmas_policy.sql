-- Parche para la tabla acta_firmas
-- Limpiamos ambas posibles políticas para evitar colisiones en producción
DROP POLICY IF EXISTS "Firmas insert own policy" ON "public"."acta_firmas";
DROP POLICY IF EXISTS "Firmas insert policy" ON "public"."acta_firmas";

-- Crear la política corregida con el nombre estándar
CREATE POLICY "Firmas insert policy" ON "public"."acta_firmas" 
    FOR INSERT 
    TO "authenticated" 
    WITH CHECK (
      ("perfil_id" = "auth"."uid"()) OR 
      ((SELECT "rol_id" FROM "public"."perfiles" WHERE "id" = "auth"."uid"()) IN (1, 2, 3)) OR
      (EXISTS (SELECT 1 FROM "public"."actas" WHERE "id" = "acta_id" AND "ingresado_por" = "auth"."uid"()))
    );
