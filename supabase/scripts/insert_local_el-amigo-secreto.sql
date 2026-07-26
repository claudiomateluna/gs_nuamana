BEGIN;

-- Insert article 'el-amigo-secreto'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'El Amigo Secreto',
  'el-amigo-secreto',
  'Al inicio de un campamento, cada participante saca de un saco un papel con el nombre de un compañero, quien será su amigo secreto. Durante la actividad o campamento, cada uno debe prestar especial atención a las cualidades, virtudes y necesidades de su amigo secreto, ayudándole discretamente sin revelar su identidad. Al final del campamento, cada participante escribe una carta detallando las cualidades positivas que observó en su amigo y se la entrega durante una ceremonia de cierre.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-amigo-secreto.webp',
  '{"duracion": "05-60 min", "cantidad": "10-40", "lugares": ["sala", "campo abierto"], "materiales": ["Papel y bolígrafo"], "variaciones": "Se pueden realizar pequeños gestos cotidianos de ayuda (como ordenar la carpa o servir agua) sin delatarse.", "recomendaciones": "Hacer seguimiento diario para que todos los niños reciban atención y ninguno quede excluido.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-amigo-secreto.webp", "areas": ["afectividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Fomentando la autoestima del compañero a través del reconocimiento explícito de sus virtudes y fortalezas en una carta."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Practicando el servicio desinteresado y la observación constante para el bienestar del prójimo dentro del grupo."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'el-amigo-secreto'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Fomentando la autoestima del compañero a través del reconocimiento explícito de sus virtudes y fortalezas en una carta.'
FROM public.articulos WHERE slug = 'el-amigo-secreto'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Practicando el servicio desinteresado y la observación constante para el bienestar del prójimo dentro del grupo.'
FROM public.articulos WHERE slug = 'el-amigo-secreto'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;