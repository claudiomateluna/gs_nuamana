BEGIN;

-- Insert article 'el-matamoscas-escurridizo'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'El Matamoscas Escurridizo',
  'el-matamoscas-escurridizo',
  'Los participantes se sientan en círculo en el suelo. Uno de ellos está en el centro parado con el ''matamoscas'' (un periódico enrollado). El dirigente dice el nombre de un participante del círculo. Quien está en el centro debe correr rápidamente a tocarlo con el periódico. Para salvarse, el participante nombrado debe decir rápidamente el nombre de otro compañero del círculo antes de ser tocado. Si es tocado antes de hablar, intercambia su puesto con el del centro.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-matamoscas-escurridizo.webp',
  '{"duracion": "15 min", "cantidad": "10-25", "lugares": ["sala", "campo abierto"], "materiales": ["Un periódico enrollado o pañolón anudado largo"], "variaciones": "Para círculos grandes, se pueden tener dos matamoscas activos simultáneamente.", "recomendaciones": "Prohibir golpes en la cabeza o cara. Los toques del matamoscas deben ser suaves en la espalda o piernas.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-matamoscas-escurridizo.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Ejercitando la agilidad de reflejos físicos y la velocidad de respuesta verbal instantánea."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Fortaleciendo la memorización y asociación rápida de los nombres de los integrantes de la manada."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'el-matamoscas-escurridizo'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Ejercitando la agilidad de reflejos físicos y la velocidad de respuesta verbal instantánea.'
FROM public.articulos WHERE slug = 'el-matamoscas-escurridizo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Fortaleciendo la memorización y asociación rápida de los nombres de los integrantes de la manada.'
FROM public.articulos WHERE slug = 'el-matamoscas-escurridizo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;