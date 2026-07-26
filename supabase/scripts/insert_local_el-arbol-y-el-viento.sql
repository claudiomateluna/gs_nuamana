BEGIN;

-- Insert article 'el-arbol-y-el-viento'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'El Árbol y el Viento',
  'el-arbol-y-el-viento',
  'Un participante se coloca en el centro del círculo con los ojos cerrados, los pies juntos y el cuerpo completamente rígido (como el tronco de un árbol). Los compañeros del círculo se colocan muy juntos a su alrededor con las manos al frente. El participante central se deja caer suavemente en cualquier dirección, confiando en que el grupo lo sostendrá y lo empujará con delicadeza hacia otra parte del círculo, simulando el vaivén del viento.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-rbol-y-el-viento.webp',
  '{"duracion": "15 min", "cantidad": "8-15", "lugares": ["sala", "campo abierto"], "materiales": [], "variaciones": "Se puede realizar en pequeños grupos de 6 personas para que el círculo de apoyo sea más cerrado e íntimo.", "recomendaciones": "Exigir máxima seriedad y concentración. Los empujes deben ser suaves y controlados, sin brusquedades.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-rbol-y-el-viento.webp", "areas": ["afectividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Venciendo miedos corporales y entregando el control de su seguridad al resto de sus compañeros en un entorno protegido."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Asumiendo la responsabilidad del cuidado físico del otro, actuando con sincronía y empatía grupal."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'el-arbol-y-el-viento'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Venciendo miedos corporales y entregando el control de su seguridad al resto de sus compañeros en un entorno protegido.'
FROM public.articulos WHERE slug = 'el-arbol-y-el-viento'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Asumiendo la responsabilidad del cuidado físico del otro, actuando con sincronía y empatía grupal.'
FROM public.articulos WHERE slug = 'el-arbol-y-el-viento'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;