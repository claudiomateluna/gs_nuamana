BEGIN;

-- Insert article 'carrera-de-ciempies-invertida'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Carrera de Ciempiés Invertida',
  'carrera-de-ciempies-invertida',
  'Los participantes se dividen por equipos (patrullas) formados en columnas de espaldas a la meta. Cada miembro pasa sus manos entre sus piernas para tomar las manos del compañero de atrás (o se agarran de los tobillos), formando una columna articulada de ciempiés. A la señal del dirigente, cada equipo debe avanzar de espaldas coordinando sus pasos para no soltar el enlace y llegar juntos a la línea de meta.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/carrera-de-ciempis-invertida.webp',
  '{"duracion": "20 min", "cantidad": "12-30", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["Cuerdas para marcar las líneas de salida y meta"], "variaciones": "Se puede realizar la carrera en cuadrupedia invertida (cangrejo) para cambiar el esfuerzo muscular.", "recomendaciones": "Asegurar que el césped esté libre de objetos punzantes o piedras sueltas, ya que se camina de espaldas en equipo.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/carrera-de-ciempis-invertida.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["tropa"], "objetivos_educativos": [{"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan da├▒ar mi salud y la de mis compa├▒eros.", "unidad": "Tropa", "como_se_cumple": "Mejorando la fuerza en extremidades, el equilibrio invertido y la resistencia física mediante el movimiento coordinado."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "texto": "Conozco y respeto las principales normas de convivencia.", "unidad": "Tropa", "como_se_cumple": "Fomentando la sincronía absoluta del grupo, donde la velocidad del equipo está determinada por el avance conjunto de todos."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'carrera-de-ciempies-invertida'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', 'Mejorando la fuerza en extremidades, el equilibrio invertido y la resistencia física mediante el movimiento coordinado.'
FROM public.articulos WHERE slug = 'carrera-de-ciempies-invertida'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Fomentando la sincronía absoluta del grupo, donde la velocidad del equipo está determinada por el avance conjunto de todos.'
FROM public.articulos WHERE slug = 'carrera-de-ciempies-invertida'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;