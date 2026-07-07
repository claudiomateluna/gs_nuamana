-- Parche para la tabla acta_firmas
-- Permitir que un usuario inserte firmas si:
-- 1. Es su propia firma (perfil_id = auth.uid())
-- 2. Es un Dirigente/Guiadora/Admin (rol_id IN (1, 2, 3)) que está gestionando el acta.
-- 3. Es el autor/creador del acta (ingresado_por = auth.uid())

DROP POLICY IF EXISTS "Firmas insert own policy" ON "public"."acta_firmas";

CREATE POLICY "Firmas insert policy" ON "public"."acta_firmas" 
    FOR INSERT 
    TO "authenticated" 
    WITH CHECK (
      ("perfil_id" = "auth"."uid"()) OR 
      ((SELECT "rol_id" FROM "public"."perfiles" WHERE "id" = "auth"."uid"()) IN (1, 2, 3)) OR
      (EXISTS (SELECT 1 FROM "public"."actas" WHERE "id" = "acta_id" AND "ingresado_por" = "auth"."uid"()))
    );
