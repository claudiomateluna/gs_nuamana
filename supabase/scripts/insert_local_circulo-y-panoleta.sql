BEGIN;

-- Insert article 'circulo-y-panoleta'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Círculo y Pañoleta',
  'circulo-y-panoleta',
  'Todos los participantes se sientan en círculo en el suelo mirando hacia el centro. Un jugador (el perseguidor) camina por el exterior del círculo llevando una pañoleta. Sigilosamente, deja caer la pañoleta detrás de uno de los participantes sentados. Tan pronto como este lo note, debe levantarse con la pañoleta y correr en dirección opuesta alrededor del círculo, compitiendo por ver quién llega primero a ocupar el asiento libre.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/crculo-y-paoleta.webp',
  '{"duracion": "15 min", "cantidad": "8-20", "lugares": ["sala", "campo abierto"], "materiales": ["Una pañoleta scout"], "variaciones": "Se puede jugar a pie cojo para ralentizar el desplazamiento y aumentar el equilibrio de los corredores.", "recomendaciones": "Asegurar que el espacio esté libre de obstáculos donde los participantes puedan tropezar al correr.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/crculo-y-paoleta.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Ejercitando reflejos táctiles/visuales rápidos y la velocidad de desplazamiento en carreras de velocidad corta."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Integrando la diversión sana y la aceptación alegre del resultado de la carrera frente al resto de la unidad."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'circulo-y-panoleta'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Ejercitando reflejos táctiles/visuales rápidos y la velocidad de desplazamiento en carreras de velocidad corta.'
FROM public.articulos WHERE slug = 'circulo-y-panoleta'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Integrando la diversión sana y la aceptación alegre del resultado de la carrera frente al resto de la unidad.'
FROM public.articulos WHERE slug = 'circulo-y-panoleta'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;