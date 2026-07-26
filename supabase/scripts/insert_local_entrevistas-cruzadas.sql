BEGIN;

-- Insert article 'entrevistas-cruzadas'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Entrevistas Cruzadas',
  'entrevistas-cruzadas',
  'Los participantes se distribuyen en parejas (buscando a alguien con quien no tengan una relación diaria estrecha) y se aíslan del resto. Durante 10 minutos por turno, cada uno entrevista a su compañero sobre sus gustos, historia, aspiraciones e ideas personales, con el fin de construir un entendimiento común. Finalmente, se reúne el grupo completo y cada uno presenta a su compañero en tercera persona, destacando sus valores y cualidades.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/entrevistas-cruzadas.webp',
  '{"duracion": "30 min", "cantidad": "10-30", "lugares": ["sala", "campo abierto"], "materiales": ["Papel y bolígrafos para notas opcionales"], "variaciones": "Se puede pedir a cada participante que dibuje un símbolo que represente a su pareja en lugar de escribir.", "recomendaciones": "Fomentar que se agrupen personas que no conversan habitualmente en las actividades regulares.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/entrevistas-cruzadas.webp", "areas": ["afectividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Expresando sentimientos personales y escuchando empáticamente la historia de vida de su compañero de unidad."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Superando prejuicios iniciales y conociendo de manera más profunda a los miembros de la patrulla o manada."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'entrevistas-cruzadas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Expresando sentimientos personales y escuchando empáticamente la historia de vida de su compañero de unidad.'
FROM public.articulos WHERE slug = 'entrevistas-cruzadas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Superando prejuicios iniciales y conociendo de manera más profunda a los miembros de la patrulla o manada.'
FROM public.articulos WHERE slug = 'entrevistas-cruzadas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;