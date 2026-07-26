BEGIN;

-- Insert article 'combate-de-globos'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Combate de Globos',
  'combate-de-globos',
  'Cada participante infla un globo y se lo amarra al tobillo usando un trozo de hilo, de modo que el globo cuelgue a unos 10 cm del suelo. Todos se distribuyen dentro de una zona de juego delimitada. A la señal del dirigente, el objetivo es intentar pisar y explotar los globos de los oponentes mientras proteges el tuyo. Quien se quede sin globo intacto es eliminado. Gana el último participante que mantenga su globo inflado.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/combate-de-globos.webp',
  '{"duracion": "15 min", "cantidad": "10-30", "lugares": ["sala", "campo abierto"], "materiales": ["Un globo de color y un trozo de hilo de 50 cm por participante"], "variaciones": "Se puede jugar delimitando el área a la mitad progresivamente para concentrar la acción del combate.", "recomendaciones": "Establecer que solo se puede pisar el globo; los empujones físicos o agarres de ropa implican descalificación.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/combate-de-globos.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Coordinando los movimientos rápidos de piernas, giros defensivos de tobillo y el control del equilibrio dinámico."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Fomentando el respeto a los límites espaciales del área de juego y acatando honestamente la eliminación al perder el globo."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'combate-de-globos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Coordinando los movimientos rápidos de piernas, giros defensivos de tobillo y el control del equilibrio dinámico.'
FROM public.articulos WHERE slug = 'combate-de-globos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Fomentando el respeto a los límites espaciales del área de juego y acatando honestamente la eliminación al perder el globo.'
FROM public.articulos WHERE slug = 'combate-de-globos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;