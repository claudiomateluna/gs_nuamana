BEGIN;

-- Insert article 'arrebato-de-panoleta'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Arrebato de Pañoleta',
  'arrebato-de-panoleta',
  'Se dividen los participantes en dos equipos numerados de forma idéntica, alineados frente a frente a una distancia de 20 metros. En el centro del terreno se ubica un dirigente sosteniendo una pañoleta en el aire. El dirigente grita un número (ej. ''¡Cinco!''). Los jugadores número cinco de ambos equipos corren al centro. El objetivo es tomar la pañoleta y regresar corriendo a su propia línea sin ser tocado (''manchado'') por el adversario del centro.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/arrebato-de-paoleta.webp',
  '{"duracion": "20 min", "cantidad": "10-24", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["Una pañoleta scout y tiza para dibujar líneas"], "variaciones": "Se pueden llamar a dos o tres números simultáneamente para jugar en parejas o tríos coordinados.", "recomendaciones": "Los participantes no deben hacer contacto físico violento; si el portador es tocado, el punto va al equipo rival.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/arrebato-de-paoleta.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Mejorando la velocidad explosiva de arranque, los amagues de cintura y la agilidad de reacción motora."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Cumpliendo con honestidad el toque físico en carrera y acatando de inmediato las decisiones de puntaje del dirigente."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'arrebato-de-panoleta'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Mejorando la velocidad explosiva de arranque, los amagues de cintura y la agilidad de reacción motora.'
FROM public.articulos WHERE slug = 'arrebato-de-panoleta'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Cumpliendo con honestidad el toque físico en carrera y acatando de inmediato las decisiones de puntaje del dirigente.'
FROM public.articulos WHERE slug = 'arrebato-de-panoleta'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;