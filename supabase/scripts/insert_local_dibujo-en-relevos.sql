BEGIN;

-- Insert article 'dibujo-en-relevos'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Dibujo en Relevos',
  'dibujo-en-relevos',
  'Se distribuyen a los participantes en equipos de 5 personas frente a un afiche colgado en la pared. El primer miembro de cada equipo corre con un plumón, dibuja una sola línea continua durante 10 segundos y regresa para entregar el plumón al siguiente. Cada participante debe continuar el dibujo iniciado por sus compañeros, integrando sus ideas al diseño colectivo sin hablar entre sí, creando una obra de arte grupal.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/dibujo-en-relevos.webp',
  '{"duracion": "25 min", "cantidad": "8-25", "lugares": ["sala"], "materiales": ["Hojas de papel afiche, plumones de colores"], "variaciones": "Se puede limitar el tiempo por turno a solo 5 segundos para forzar respuestas espontáneas y creativas.", "recomendaciones": "Establecer un tema scout al inicio (ej. ''un campamento ideal'' o ''el bosque de la manada'') para guiar la creación.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/dibujo-en-relevos.webp", "areas": ["sociabilidad", "creatividad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "8985ff05-ee84-4fba-af46-146c5374df89", "area": "Creatividad", "texto": "Participo en los talleres de manualidades que se hacen en la Manada.", "unidad": "Manada", "como_se_cumple": "Desarrollando la imaginación colectiva, la adaptabilidad creativa y la destreza en expresión plástica en equipo."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Valorando y acoplando la propia visión artística a la obra construida por los demás integrantes sin imponer ideas."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, creatividad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'dibujo-en-relevos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8985ff05-ee84-4fba-af46-146c5374df89', 'Desarrollando la imaginación colectiva, la adaptabilidad creativa y la destreza en expresión plástica en equipo.'
FROM public.articulos WHERE slug = 'dibujo-en-relevos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Valorando y acoplando la propia visión artística a la obra construida por los demás integrantes sin imponer ideas.'
FROM public.articulos WHERE slug = 'dibujo-en-relevos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;