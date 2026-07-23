-- Consolidate especialidades_definiciones: one record per specialty name instead of per unit
-- All 441 records → 156 unique names. Each definition is now a global catalog entry.

-- Step 1: Remove duplicate definitions, keeping the first definition for each unique name
DELETE FROM especialidades_definiciones a
USING especialidades_definiciones b
WHERE a.nombre = b.nombre AND a.id > b.id;

-- Step 2: Set all unidad_id to NULL (definitions are now global, not per-unit)
UPDATE especialidades_definiciones SET unidad_id = NULL WHERE unidad_id IS NOT NULL;

-- Step 3: Drop old constraints if present and add unique constraint on nombre
ALTER TABLE especialidades_definiciones
  DROP CONSTRAINT IF EXISTS especialidades_definiciones_unidad_id_nombre_key;

ALTER TABLE especialidades_definiciones
  DROP CONSTRAINT IF EXISTS uq_definicion_nombre;

ALTER TABLE especialidades_definiciones
  ADD CONSTRAINT uq_definicion_nombre UNIQUE (nombre);


-- Step 4: Make unidad_id nullable (it already is, but this confirms intent)
-- The FK to unidades is kept but unidad_id=NULL means "available to all units"
