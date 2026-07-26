BEGIN;

-- Insert article 'caceria-de-serpientes'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Cacería de Serpientes',
  'caceria-de-serpientes',
  'Cada participante se coloca un pañolín o cuerda corta metida a la mitad en la parte trasera del pantalón (la cola de la serpiente). Todos los jugadores se dispersan en un área delimitada. A la señal del dirigente, todos deben intentar arrebatar el pañolín de los demás compañeros mientras protegen su propio pañolín de ser robado. Si te roban la cola quedas eliminado del turno. Gana quien logre recolectar la mayor cantidad de colas.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/cacera-de-serpientes.webp',
  '{"duracion": "20 min", "cantidad": "12-30", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["Cuerdas cortas o pañolines (una por participante)"], "variaciones": "Se puede dar a cada patrulla un color de pañolín diferente para registrar puntuaciones por equipos.", "recomendaciones": "El juego debe realizarse sobre césped o suelo blando. Queda prohibido tirar de la ropa o agarrar físicamente al compañero.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/cacera-de-serpientes.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Mejorando la velocidad de desplazamiento, los giros de cintura rápidos y la coordinación ojo-mano."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Aceptando de buena gana la eliminación y devolviendo de inmediato las colas obtenidas al finalizar el turno."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'caceria-de-serpientes'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Mejorando la velocidad de desplazamiento, los giros de cintura rápidos y la coordinación ojo-mano.'
FROM public.articulos WHERE slug = 'caceria-de-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Aceptando de buena gana la eliminación y devolviendo de inmediato las colas obtenidas al finalizar el turno.'
FROM public.articulos WHERE slug = 'caceria-de-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;