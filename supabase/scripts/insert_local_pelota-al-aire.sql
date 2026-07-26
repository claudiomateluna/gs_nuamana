BEGIN;

-- Insert article 'pelota-al-aire'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Pelota al Aire',
  'pelota-al-aire',
  'Los participantes forman un gran círculo de pie. Uno de ellos se ubica en el centro sosteniendo una pelota. Al lanzarla hacia arriba en vertical, grita fuertemente el nombre de un compañero y regresa al círculo. La persona nombrada debe correr rápidamente al centro e intentar atrapar el objeto antes de que toque el suelo. Si lo logra, lo lanza de nuevo y menciona otro nombre; de lo contrario, se reinicia el juego.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelota-al-aire.webp',
  '{"duracion": "20 min", "cantidad": "10-25", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["Una pelota blanda o disco volador"], "variaciones": "Se puede jugar usando dos pelotas al mismo tiempo para grupos grandes, aumentando la alerta general.", "recomendaciones": "Utilizar una pelota blanda para evitar golpes fuertes y asegurar un terreno libre de obstáculos.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelota-al-aire.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Desarrollando reflejos rápidos, coordinación motriz y precisión al lanzar y atrapar objetos en movimiento."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Memorizando e interactuando con los nombres de todos los integrantes de la unidad de forma activa."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'pelota-al-aire'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Desarrollando reflejos rápidos, coordinación motriz y precisión al lanzar y atrapar objetos en movimiento.'
FROM public.articulos WHERE slug = 'pelota-al-aire'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Memorizando e interactuando con los nombres de todos los integrantes de la unidad de forma activa.'
FROM public.articulos WHERE slug = 'pelota-al-aire'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;