-- Agregar imágenes SVG iniciales a los símbolos principales de cada unidad
UPDATE unidades 
SET simbolos_data = jsonb_set(
  simbolos_data, 
  '{elementos,0,imagen_url}', 
  to_jsonb('/images/logos/iconos_lobatos.svg'::text)
) WHERE id = 1;

UPDATE unidades 
SET simbolos_data = jsonb_set(
  simbolos_data, 
  '{elementos,0,imagen_url}', 
  to_jsonb('/images/logos/iconos_guias.svg'::text)
) WHERE id = 2;

UPDATE unidades 
SET simbolos_data = jsonb_set(
  simbolos_data, 
  '{elementos,0,imagen_url}', 
  to_jsonb('/images/logos/iconos_scouts.svg'::text)
) WHERE id = 3;

UPDATE unidades 
SET simbolos_data = jsonb_set(
  simbolos_data, 
  '{elementos,0,imagen_url}', 
  to_jsonb('/images/logos/iconos_pioneres.svg'::text)
) WHERE id = 4;

UPDATE unidades 
SET simbolos_data = jsonb_set(
  simbolos_data, 
  '{elementos,0,imagen_url}', 
  to_jsonb('/images/logos/iconos_caminantes.svg'::text)
) WHERE id = 5;
