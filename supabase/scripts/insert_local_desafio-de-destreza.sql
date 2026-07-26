BEGIN;

-- Insert article 'desafio-de-destreza'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Desafío de Destreza',
  'desafio-de-destreza',
  'Se invita a salir de la sala a 6 voluntarios. El dirigente explica al grupo que la dinámica evalúa la influencia de la expectativa grupal en la autoconfianza. Se llama a los voluntarios uno por uno. A los primeros dos se les miente diciendo que el récord promedio es de solo 15 clips transferidos en 20 segundos; a los siguientes dos se les dice que el promedio es 40; y a los últimos dos se les añade presión adicional. Cada voluntario estima cuántos logrará antes de la prueba y se compara el resultado físico real con su nivel de confianza influenciado.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/desafo-de-destreza.webp',
  '{"duracion": "25 min", "cantidad": "8-25", "lugares": ["sala"], "materiales": ["Una caja ancha, un frasco angosto y 75 clips o clavos"], "variaciones": "Se puede usar semillas o porotos y cucharas pequeñas para variar el tipo de coordinación requerida.", "recomendaciones": "Mantener el silencio absoluto entre los espectadores para no sesgar las previsiones del voluntario.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/desafo-de-destreza.webp", "areas": ["afectividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Reconociendo el impacto de la opinión del grupo en el propio autoconcepto y la autoconfianza frente a un reto."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Debatiendo sobre cómo evitar presiones grupales negativas y consolidar juicios personales con criterio autónomo."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'desafio-de-destreza'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Reconociendo el impacto de la opinión del grupo en el propio autoconcepto y la autoconfianza frente a un reto.'
FROM public.articulos WHERE slug = 'desafio-de-destreza'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Debatiendo sobre cómo evitar presiones grupales negativas y consolidar juicios personales con criterio autónomo.'
FROM public.articulos WHERE slug = 'desafio-de-destreza'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;