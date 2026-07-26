BEGIN;

-- Insert article 'asalto-a-las-cuatro-colinas'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Asalto a las Cuatro Colinas',
  'asalto-a-las-cuatro-colinas',
  'Se definen cuatro puntos elevados o bases en el terreno (las colinas), cada una defendida por dos guardianes fijos. El resto de los participantes se divide en patrullas de asalto. El objetivo de las patrullas es infiltrarse en el territorio y tocar las cuatro colinas secuencialmente sin ser avistados ni nombrados por los guardianes. Si un guardián ve a un asaltante, grita su nombre y este debe retroceder a la colina anterior.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/asalto-a-las-cuatro-colinas.webp',
  '{"duracion": "45 min", "cantidad": "15-40", "lugares": ["campo abierto"], "materiales": ["Silbato y marcas reflectantes para delimitar las colinas"], "variaciones": "Se pueden añadir ''mensajes secretos'' que los asaltantes deben llevar físicamente de una colina a otra.", "recomendaciones": "Marcar claramente las zonas seguras y peligrosas. Evitar terrenos con zanjas o piedras sueltas en campamentos.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/asalto-a-las-cuatro-colinas.webp", "areas": ["creatividad", "corporalidad"], "unidades": ["tropa"], "objetivos_educativos": [{"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan da├▒ar mi salud y la de mis compa├▒eros.", "unidad": "Tropa", "como_se_cumple": "Desarrollando la resistencia cardiovascular y la agilidad para correr y ocultarse en terrenos naturales complejos."}, {"id": "a93b3a5c-a023-4e0c-815d-c77c6700dd89", "area": "Creatividad", "texto": "Me intereso por conocer m├ís sobre lo que pasa a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "Trabajando tácticas cooperativas de distracción y avance coordinado entre las patrullas para evadir a los guardias."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Creatividad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', 'Desarrollando la resistencia cardiovascular y la agilidad para correr y ocultarse en terrenos naturales complejos.'
FROM public.articulos WHERE slug = 'asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a93b3a5c-a023-4e0c-815d-c77c6700dd89', 'Trabajando tácticas cooperativas de distracción y avance coordinado entre las patrullas para evadir a los guardias.'
FROM public.articulos WHERE slug = 'asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;