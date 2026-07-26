BEGIN;

-- Insert article 'relevos-scouts-de-agilidad'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Relevos Scouts de Agilidad',
  'relevos-scouts-de-agilidad',
  'Se divide a los participantes en equipos de igual número dispuestos en columnas detrás de una línea de partida. A 15 metros se coloca un cono por equipo. El primer jugador de cada columna corre hacia el cono, lo rodea y regresa para tocar la mano o entregar un testigo al siguiente de la fila, incorporándose al final. La carrera continúa de forma ininterrumpida hasta que todos los miembros del equipo hayan completado el circuito.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/relevos-scouts-de-agilidad.webp',
  '{"duracion": "20 min", "cantidad": "12-32", "lugares": ["campo abierto", "sala"], "materiales": ["Testigos de madera, conos de señalización"], "variaciones": "Incorporar diferentes modos de desplazamiento (correr hacia atrás, saltar en un pie, cuadrupedia scout).", "recomendaciones": "Delimitar carriles claros de carrera para evitar choques frontales entre los equipos participantes.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/relevos-scouts-de-agilidad.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "0956c462-5ae8-4a34-8a7d-c08a9b092516", "area": "Corporalidad", "texto": "Trato de seguir los consejos que me dan los m├ís grandes para tener un cuerpo fuerte y sano.", "unidad": "Manada", "como_se_cumple": "Fomentando el desarrollo muscular armónico, la velocidad y la resistencia anaeróbica mediante el juego activo."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Fomentando el espíritu de equipo, el aliento mutuo entre compañeros de patrulla y la tolerancia a la frustración."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'relevos-scouts-de-agilidad'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0956c462-5ae8-4a34-8a7d-c08a9b092516', 'Fomentando el desarrollo muscular armónico, la velocidad y la resistencia anaeróbica mediante el juego activo.'
FROM public.articulos WHERE slug = 'relevos-scouts-de-agilidad'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Fomentando el espíritu de equipo, el aliento mutuo entre compañeros de patrulla y la tolerancia a la frustración.'
FROM public.articulos WHERE slug = 'relevos-scouts-de-agilidad'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;