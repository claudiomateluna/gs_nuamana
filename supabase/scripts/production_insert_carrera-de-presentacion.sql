BEGIN;

-- Insert article 'carrera-de-presentacion'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Carrera de Presentación',
  'carrera-de-presentacion',
  'Todos se colocan en un círculo de pie con el dirigente en el centro. El dirigente extenderá el brazo señalando rápidamente con el dedo a un integrante del grupo de forma aleatoria. El participante señalado debe decir su nombre en voz alta de manera instantánea. El dirigente puede ir aumentando la velocidad del señalamiento, girar en su propio eje o saltar para retar la atención del grupo.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/carrera-de-presentacin.webp',
  '{"duracion": "10 min", "cantidad": "8-20", "lugares": ["sala", "campo abierto"], "materiales": [], "variaciones": "El dirigente puede girar, saltar o señalar de espaldas para añadir un factor de diversión y dinamismo.", "recomendaciones": "Asegurar que todos los participantes presten atención a las señales del dirigente para no perder el turno.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/carrera-de-presentacin.webp", "areas": ["sociabilidad", "creatividad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "26c3a88f-5dd1-4b71-9919-07f14ed5b61e", "area": "Creatividad", "texto": "Quiero aprender cosas nuevas.", "unidad": "Manada", "como_se_cumple": "Estimulando la atención focalizada y la agilidad mental para responder con rapidez bajo presión lúdica."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Fomentando el reconocimiento rápido del nombre de cada integrante dentro de la unidad scout."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, creatividad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'carrera-de-presentacion'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '26c3a88f-5dd1-4b71-9919-07f14ed5b61e', 'Estimulando la atención focalizada y la agilidad mental para responder con rapidez bajo presión lúdica.'
FROM public.articulos WHERE slug = 'carrera-de-presentacion'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Fomentando el reconocimiento rápido del nombre de cada integrante dentro de la unidad scout.'
FROM public.articulos WHERE slug = 'carrera-de-presentacion'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;