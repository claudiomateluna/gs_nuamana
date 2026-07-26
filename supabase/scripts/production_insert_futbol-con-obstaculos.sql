BEGIN;

-- Insert article 'futbol-con-obstaculos'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Fútbol con Obstáculos',
  'futbol-con-obstaculos',
  'Se divide el grupo en dos equipos de fútbol. Sin embargo, para nivelar las capacidades y añadir un reto cooperativo, se establecen reglas especiales: todos los jugadores deben desplazarse tomados de la mano en parejas (o tríos), y la pelota solo puede ser conducida o pateada si la pareja mantiene la unión de manos intacta. Si una pareja se suelta al tocar el balón, se cobra tiro libre para el equipo contrario.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/ftbol-con-obstculos.webp',
  '{"duracion": "25 min", "cantidad": "10-24", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["Una pelota de esponja blanda, conos para arquerías"], "variaciones": "Se puede jugar con los participantes en parejas amarrados del tobillo (fútbol de ciempiés) para forzar la sincronización.", "recomendaciones": "Establecer arquerías pequeñas y prohibir barridas físicas al suelo para evitar lesiones accidentales.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/ftbol-con-obstculos.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["tropa"], "objetivos_educativos": [{"id": "5c9843d1-39fd-4298-870c-5e46f29ffbf6", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "unidad": "Tropa", "como_se_cumple": "Ejercitando la coordinación motriz sincronizada en pareja y el desarrollo cardiorrespiratorio mediante el fútbol adaptado."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "texto": "Conozco y respeto las principales normas de convivencia.", "unidad": "Tropa", "como_se_cumple": "Trabajando en equipo y asimilando la necesidad de comunicación constante con la pareja para avanzar hacia el arco rival."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'futbol-con-obstaculos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5c9843d1-39fd-4298-870c-5e46f29ffbf6', 'Ejercitando la coordinación motriz sincronizada en pareja y el desarrollo cardiorrespiratorio mediante el fútbol adaptado.'
FROM public.articulos WHERE slug = 'futbol-con-obstaculos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Trabajando en equipo y asimilando la necesidad de comunicación constante con la pareja para avanzar hacia el arco rival.'
FROM public.articulos WHERE slug = 'futbol-con-obstaculos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;