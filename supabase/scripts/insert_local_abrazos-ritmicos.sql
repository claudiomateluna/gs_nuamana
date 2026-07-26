BEGIN;

-- Insert article 'abrazos-ritmicos'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Abrazos Rítmicos',
  'abrazos-ritmicos',
  'Los participantes caminan o bailan por todo el espacio al compás de la música. Cuando la música se detiene, cada persona debe buscar rápidamente a otra y darle un abrazo. La música continúa y vuelven a caminar por separado (o en parejas). La próxima vez que se detiene, deben agruparse en abrazos de a tres, luego de a cuatro, aumentando progresivamente hasta que todo el grupo se una en un único y gran abrazo colectivo de integración.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/abrazos-rtmicos.webp',
  '{"duracion": "15 min", "cantidad": "10-40", "lugares": ["sala", "campo abierto"], "materiales": ["Un reproductor de música o silbato"], "variaciones": "En lugar de abrazarse, los participantes pueden formar puentes tomándose de las manos en grupos progresivos.", "recomendaciones": "Asegurar que nadie quede fuera de los abrazos; los dirigentes deben promover la inclusión rápida de los rezagados.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/abrazos-rtmicos.webp", "areas": ["afectividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Experimentando una acogida física y emocional positiva de parte de la unidad en un ambiente de alegría."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Rompiendo barreras de timidez inicial e interactuando con toda la membresía de la unidad de forma equitativa."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'abrazos-ritmicos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Experimentando una acogida física y emocional positiva de parte de la unidad en un ambiente de alegría.'
FROM public.articulos WHERE slug = 'abrazos-ritmicos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Rompiendo barreras de timidez inicial e interactuando con toda la membresía de la unidad de forma equitativa.'
FROM public.articulos WHERE slug = 'abrazos-ritmicos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;