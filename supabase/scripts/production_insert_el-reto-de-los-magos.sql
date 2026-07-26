BEGIN;

-- Insert article 'el-reto-de-los-magos'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'El Reto de los Magos',
  'el-reto-de-los-magos',
  'Se eligen dos participantes para ser los ''Magos'' portando una varita. El resto corre libremente en el área delimitada. Si un mago toca a alguien con su varita diciendo ''¡Congelado!'', el participante debe quedar inmóvil de brazos abiertos. Para ser liberado, otro compañero debe pasar por debajo de sus piernas abiertas sin ser tocado por los magos. Gana el equipo de los magos si logra congelar a todo el grupo simultáneamente.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-reto-de-los-magos.webp',
  '{"duracion": "20 min", "cantidad": "10-25", "lugares": ["campo abierto", "sala"], "materiales": ["2 varitas de madera (o bastones scouts)"], "variaciones": "Se pueden incluir retos físicos o acertijos mentales que el prisionero liberado debe resolver antes de volver al juego.", "recomendaciones": "El contacto físico de los magos al congelar debe ser un toque suave en el hombro, prohibiendo agarres bruscos.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-reto-de-los-magos.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Ejercitando la velocidad de desplazamiento, esquives rápidos y destreza en movimientos de flexión corporal."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Fomentando la solidaridad y la disposición a rescatar activamente al compañero atrapado asumiendo riesgos de juego."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'el-reto-de-los-magos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Ejercitando la velocidad de desplazamiento, esquives rápidos y destreza en movimientos de flexión corporal.'
FROM public.articulos WHERE slug = 'el-reto-de-los-magos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Fomentando la solidaridad y la disposición a rescatar activamente al compañero atrapado asumiendo riesgos de juego.'
FROM public.articulos WHERE slug = 'el-reto-de-los-magos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;