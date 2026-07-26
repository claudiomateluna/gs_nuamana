BEGIN;

-- Insert article 'ritmo-de-nombres'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Ritmo de Nombres',
  'ritmo-de-nombres',
  'En círculo, el grupo sigue un ritmo constante marcado por el dirigente: una palmada en las piernas, una palmada normal, y luego levantar alternadamente la mano derecha e izquierda sobre el hombro con el pulgar hacia atrás. Al levantar la mano derecha, la persona debe decir su propio nombre; al levantar la izquierda, debe decir el nombre de otro integrante. Quien es nombrado debe continuar inmediatamente con la secuencia de ritmo y llamar a otra persona sin perder el compás de palmas.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/ritmo-de-nombres.webp',
  '{"duracion": "15 min", "cantidad": "10-20", "lugares": ["sala", "campo abierto"], "materiales": [], "variaciones": "Se puede acelerar el ritmo progresivamente o realizarlo sentados golpeando los pies para mayor dificultad física.", "recomendaciones": "Mantener un ritmo lento y constante al inicio para que todos los participantes se adapten antes de acelerar.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/ritmo-de-nombres.webp", "areas": ["creatividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Integrándose activamente con el grupo y respetando el compás establecido para permitir que todos participen."}, {"id": "8985ff05-ee84-4fba-af46-146c5374df89", "area": "Creatividad", "texto": "Participo en los talleres de manualidades que se hacen en la Manada.", "unidad": "Manada", "como_se_cumple": "Desarrollando la psicomotricidad rítmica y la velocidad de reacción mental ante el estímulo auditivo."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Creatividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'ritmo-de-nombres'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Integrándose activamente con el grupo y respetando el compás establecido para permitir que todos participen.'
FROM public.articulos WHERE slug = 'ritmo-de-nombres'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8985ff05-ee84-4fba-af46-146c5374df89', 'Desarrollando la psicomotricidad rítmica y la velocidad de reacción mental ante el estímulo auditivo.'
FROM public.articulos WHERE slug = 'ritmo-de-nombres'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;