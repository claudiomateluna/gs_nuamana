BEGIN;

-- Insert article 'el-lavado-de-autos'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'El Lavado de Autos',
  'el-lavado-de-autos',
  'El grupo forma dos filas largas, una frente a la otra, simulando los rodillos de un túnel de lavado. Cada participante de la fila realiza movimientos suaves de manos (masajes, palmaditas suaves, caricias en la espalda) al paso del ''auto''. Las personas del extremo de la fila ingresan una por una al túnel con los ojos cerrados, caminando despacio mientras reciben el ''lavado'' reconfortante de sus compañeros. Al salir del túnel, se incorporan a las filas para lavar al siguiente auto.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-lavado-de-autos.webp',
  '{"duracion": "15 min", "cantidad": "10-30", "lugares": ["sala", "campo abierto"], "materiales": [], "variaciones": "Se puede realizar emitiendo sonidos graciosos o imitando una máquina de lavado a presión para mayor diversión.", "recomendaciones": "Los movimientos y el contacto físico deben ser sumamente suaves, respetuosos y relajantes.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-lavado-de-autos.webp", "areas": ["afectividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Sintiéndose valorado, querido y físicamente acogido por sus pares en una atmósfera de calma y afecto."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Fomentando el respeto corporal mutuo y el cuidado empático hacia la integridad del compañero de unidad."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'el-lavado-de-autos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Sintiéndose valorado, querido y físicamente acogido por sus pares en una atmósfera de calma y afecto.'
FROM public.articulos WHERE slug = 'el-lavado-de-autos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Fomentando el respeto corporal mutuo y el cuidado empático hacia la integridad del compañero de unidad.'
FROM public.articulos WHERE slug = 'el-lavado-de-autos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;