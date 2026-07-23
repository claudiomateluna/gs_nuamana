-- Add estado column to actividades_programadas for draft/published workflow
ALTER TABLE actividades_programadas 
ADD COLUMN IF NOT EXISTS estado varchar(50) DEFAULT 'borrador';

-- Set existing activities to 'publicado'
UPDATE actividades_programadas SET estado = 'publicado' WHERE estado IS NULL;

-- Add index for filtering by estado
CREATE INDEX IF NOT EXISTS idx_actividades_programadas_estado ON actividades_programadas(estado);
