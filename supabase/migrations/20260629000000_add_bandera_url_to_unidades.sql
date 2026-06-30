-- Add bandera_url column to unidades table
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS bandera_url text;
