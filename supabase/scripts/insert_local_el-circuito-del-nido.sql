BEGIN;

-- Insert article 'el-circuito-del-nido'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'El Circuito del Nido',
  'el-circuito-del-nido',
  'Los participantes dibujan en conjunto un tablero de juego en un papel afiche, partiendo de un ''nido'' central y añadiendo casillas numeradas. Cada jugador elige un objeto pequeño como ficha. Por turnos, lanzan un dado y avanzan. Si caen en una casilla vacía, deben escribir en ella una misión o pregunta (por ejemplo: ''contar un recuerdo feliz'', ''describir un hobby'', ''compartir un temor''). Quien caiga en una casilla ya escrita deberá responder o realizar la misión escrita, compartiendo y conociendo más al resto.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-circuito-del-nido.webp',
  '{"duracion": "30 min", "cantidad": "6-12", "lugares": ["sala"], "materiales": ["Un papel afiche grande, marcadores de colores, dados y fichas personalizadas"], "variaciones": "Los retos o misiones pueden incluir cantar una canción scout o imitar a un animal del Libro de las Tierras Vírgenes.", "recomendaciones": "Crear preguntas o dinámicas accesibles y seguras emocionalmente para que los niños participen con confianza.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-circuito-del-nido.webp", "areas": ["afectividad", "sociabilidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Compartiendo anécdotas o sentimientos cotidianos ante la unidad en un contexto estructurado y empático."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Escuchando con atención e interés las vivencias de sus pares, fortaleciendo el lazo fraterno de la manada."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, sociabilidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'el-circuito-del-nido'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Compartiendo anécdotas o sentimientos cotidianos ante la unidad en un contexto estructurado y empático.'
FROM public.articulos WHERE slug = 'el-circuito-del-nido'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Escuchando con atención e interés las vivencias de sus pares, fortaleciendo el lazo fraterno de la manada.'
FROM public.articulos WHERE slug = 'el-circuito-del-nido'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;