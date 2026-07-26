BEGIN;

-- Insert article 'esquinas-cruzadas'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Esquinas Cruzadas',
  'esquinas-cruzadas',
  'Se delimita un cuadrado de 15 metros con pañoletas en cada esquina. El equipo A (bateadores) se alinea fuera, y el equipo B (defensores) se esparce en el cuadrado. El primer bateador del equipo A lanza la pelota con la mano lo más lejos posible y corre a tocar las cuatro esquinas secuencialmente. Mientras corre, el equipo B debe recuperar la pelota y pasarse el balón hasta tocar o golpear suavemente (''quemar'') al corredor con la pelota antes de que pise la base.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/esquinas-cruzadas.webp',
  '{"duracion": "30 min", "cantidad": "10-24", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["4 pañoletas scouts para marcar las esquinas y 1 pelota blanda"], "variaciones": "Se pueden añadir obstáculos físicos o bases intermedias seguras para variar la dinámica de carrera.", "recomendaciones": "Los lanzamientos del equipo defensivo deben ser dirigidos al cuerpo de manera suave para evitar golpes dolorosos.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/esquinas-cruzadas.webp", "areas": ["sociabilidad", "corporalidad"], "unidades": ["tropa"], "objetivos_educativos": [{"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan da├▒ar mi salud y la de mis compa├▒eros.", "unidad": "Tropa", "como_se_cumple": "Desarrollando la agilidad de carrera, los giros rápidos y la coordinación visomotriz para capturar y lanzar el balón en velocidad."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "texto": "Conozco y respeto las principales normas de convivencia.", "unidad": "Tropa", "como_se_cumple": "Fomentando la estrategia colectiva de pases rápidos y la comunicación táctica dentro del equipo defensivo."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'esquinas-cruzadas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', 'Desarrollando la agilidad de carrera, los giros rápidos y la coordinación visomotriz para capturar y lanzar el balón en velocidad.'
FROM public.articulos WHERE slug = 'esquinas-cruzadas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Fomentando la estrategia colectiva de pases rápidos y la comunicación táctica dentro del equipo defensivo.'
FROM public.articulos WHERE slug = 'esquinas-cruzadas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;