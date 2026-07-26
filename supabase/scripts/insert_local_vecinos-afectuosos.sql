BEGIN;

-- Insert article 'vecinos-afectuosos'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Vecinos Afectuosos',
  'vecinos-afectuosos',
  'Los participantes se sientan en círculo. El animador (sin silla) se ubica en el centro, se acerca a alguien y le pregunta: ''¿Te gustan tus vecinos?''. Si responde ''NO'', debe nombrar a dos compañeros que quiere tener a su lado. Los vecinos actuales deben abandonar sus sillas y correr a cambiarse con las personas elegidas, momento que el del centro aprovecha para sentarse. Si responde ''SÍ'', todo el grupo debe girar un asiento a la derecha; al tercer ''SÍ'' consecutivo, giran dos a la derecha, y al cuarto, dos a la izquierda.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/vecinos-afectuosos.webp',
  '{"duracion": "20 min", "cantidad": "12-30", "lugares": ["sala", "campo abierto"], "materiales": ["Sillas (una menos que el total de participantes)"], "variaciones": "En exteriores, se pueden usar marcas en el suelo (aros o mochilas) en lugar de sillas físicas.", "recomendaciones": "Tener precaución al momento de correr a ocupar los asientos para evitar colisiones fuertes.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/vecinos-afectuosos.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Ejercitando la agilidad física y los desplazamientos rápidos en distancias cortas de manera segura."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Integrando la lógica cooperativa y la atención auditiva para reaccionar ante las respuestas del círculo."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'vecinos-afectuosos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Ejercitando la agilidad física y los desplazamientos rápidos en distancias cortas de manera segura.'
FROM public.articulos WHERE slug = 'vecinos-afectuosos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Integrando la lógica cooperativa y la atención auditiva para reaccionar ante las respuestas del círculo.'
FROM public.articulos WHERE slug = 'vecinos-afectuosos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;