BEGIN;

-- Insert article 'pelea-de-gallos-scout'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Pelea de Gallos Scout',
  'pelea-de-gallos-scout',
  'Dos participantes se colocan frente a frente dentro de un círculo de 3 metros dibujado en el suelo. Ambos deben ponerse en cuclillas, cruzarse de brazos sobre el pecho y sostenerse sobre la punta de los pies. El objetivo del juego es empujar al oponente usando únicamente los hombros y el torso para obligarlo a salirse del círculo, tocar el suelo con las manos o perder la posición de cuclillas. Gana el participante que mantenga el equilibrio.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelea-de-gallos-scout.webp',
  '{"duracion": "15 min", "cantidad": "6-16", "lugares": ["campo abierto", "sala"], "materiales": ["Colchonetas o terreno de césped suave"], "variaciones": "Se puede jugar en parejas tomados de los hombros en formato de justa cooperativa.", "recomendaciones": "Monitorear constantemente la actividad. Exigir mantener los brazos cruzados para evitar empujones con las manos.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelea-de-gallos-scout.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["tropa"], "objetivos_educativos": [{"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan da├▒ar mi salud y la de mis compa├▒eros.", "unidad": "Tropa", "como_se_cumple": "Desarrollando la fuerza de piernas, el equilibrio dinámico y el control del centro de gravedad corporal."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "texto": "Conozco y respeto las principales normas de convivencia.", "unidad": "Tropa", "como_se_cumple": "Compitiendo con nobleza, respetando las reglas de contacto y manteniendo el juego limpio en todo momento."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'pelea-de-gallos-scout'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', 'Desarrollando la fuerza de piernas, el equilibrio dinámico y el control del centro de gravedad corporal.'
FROM public.articulos WHERE slug = 'pelea-de-gallos-scout'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Compitiendo con nobleza, respetando las reglas de contacto y manteniendo el juego limpio en todo momento.'
FROM public.articulos WHERE slug = 'pelea-de-gallos-scout'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;