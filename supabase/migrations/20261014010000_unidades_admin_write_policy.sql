-- Add admin write policy for unidades
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'unidades_admin_write' AND polrelid = 'unidades'::regclass
  ) THEN
    CREATE POLICY "unidades_admin_write" ON "public"."unidades"
      FOR ALL
      TO authenticated
      USING (es_admin_sitio())
      WITH CHECK (es_admin_sitio());
  END IF;
END $$;
