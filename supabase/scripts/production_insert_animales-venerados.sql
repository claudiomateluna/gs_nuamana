BEGIN;

-- Insert article 'animales-venerados'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Animales Venerados',
  'animales-venerados',
  'El dirigente entrega en secreto una tarjeta a cada participante con el nombre de un animal scout (deben entregarse nombres duplicados, por ejemplo, dos leones, dos monos, dos águilas). Al comenzar la música o señal, los participantes deben desplazarse por la sala sin hablar, utilizando únicamente la mímica, gestos y posturas corporales características de su animal para localizar a su pareja de especie. Al encontrarse, se toman de las manos y se sientan.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/animales-venerados.webp',
  '{"duracion": "20 min", "cantidad": "8-24", "lugares": ["sala"], "materiales": ["Tarjetas con nombres de animales de la selva"], "variaciones": "Se puede realizar la mímica imitando también los sonidos naturales de los animales para facilitar la búsqueda.", "recomendaciones": "Fomentar un clima de soltura y respeto para que los niños realicen la expresión corporal con total libertad.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/animales-venerados.webp", "areas": ["sociabilidad", "creatividad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "8985ff05-ee84-4fba-af46-146c5374df89", "area": "Creatividad", "texto": "Participo en los talleres de manualidades que se hacen en la Manada.", "unidad": "Manada", "como_se_cumple": "Desarrollando la expresión no verbal, la creatividad corporal y las habilidades de interpretación dramática."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Superando el sentido del ridículo y comunicándose con empatía visual y gestual con el resto del grupo."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, creatividad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'animales-venerados'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8985ff05-ee84-4fba-af46-146c5374df89', 'Desarrollando la expresión no verbal, la creatividad corporal y las habilidades de interpretación dramática.'
FROM public.articulos WHERE slug = 'animales-venerados'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Superando el sentido del ridículo y comunicándose con empatía visual y gestual con el resto del grupo.'
FROM public.articulos WHERE slug = 'animales-venerados'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;