-- Normalize unaccented values inside articulos.metadata.unidades / metadata.areas.
--
-- The blog crear/editar forms write accented values ("compañía", "carácter")
-- into articulos.metadata, so that is what the DB stores. A few historical
-- rows kept the unaccented spelling ("compania", "caracter") instead.
--
-- The blog listing filters with exact JSONB containment
-- (`metadata @> '{"unidades": ["<value>"]}'`), which is byte-exact: an
-- unaccented row is invisible to the accented filter and vice versa, so those
-- rows silently dropped out of their own filter option.
--
-- Rewrites the array element by element with jsonb_set, so only the target key
-- changes and every other metadata key is left untouched. Idempotent: once the
-- unaccented value is gone the WHERE clause matches no rows, so a second run
-- affects 0 rows. Rows whose metadata.unidades / metadata.areas is null are
-- excluded by the WHERE clause (null @> '[]' is null, not true).

UPDATE articulos SET metadata = jsonb_set(metadata, '{unidades}', (
  SELECT jsonb_agg(CASE WHEN value = '"compania"'::jsonb THEN '"compañía"'::jsonb ELSE value END)
  FROM jsonb_array_elements(metadata->'unidades')))
WHERE metadata->'unidades' @> '["compania"]'::jsonb;

UPDATE articulos SET metadata = jsonb_set(metadata, '{areas}', (
  SELECT jsonb_agg(CASE WHEN value = '"caracter"'::jsonb THEN '"carácter"'::jsonb ELSE value END)
  FROM jsonb_array_elements(metadata->'areas')))
WHERE metadata->'areas' @> '["caracter"]'::jsonb;
