BEGIN;

-- Insert article 'juego-de-acechadores'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Juego de Acechadores',
  'juego-de-acechadores',
  'Se divide el grupo en dos equipos que se posicionan en extremos opuestos de un área boscosa delimitada en la noche. Cada equipo debe infiltrarse silenciosamente en el territorio del rival buscando descubrir y ''capturar'' visualmente a los adversarios. Si un jugador ve a un oponente, debe gritar su nombre en voz alta; si es correcto, el jugador detectado debe reportarse a la base. Gana el equipo que logre capturar a más oponentes o cruzar la línea enemiga sin ser detectado.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/juego-de-acechadores.webp',
  '{"duracion": "40 min", "cantidad": "12-30", "lugares": ["campo abierto"], "materiales": ["Cintas de dos colores diferentes para identificar equipos"], "variaciones": "Se puede agregar una ''bandera'' reflectante en el centro que ambos equipos deben intentar capturar en absoluto sigilo.", "recomendaciones": "Mantener apagadas todas las linternas individuales para forzar el uso de la visión nocturna natural.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/juego-de-acechadores.webp", "areas": ["creatividad", "corporalidad"], "unidades": ["tropa"], "objetivos_educativos": [{"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan da├▒ar mi salud y la de mis compa├▒eros.", "unidad": "Tropa", "como_se_cumple": "Desarrollando la agudeza sensorial auditiva y visual en condiciones de baja luminosidad natural."}, {"id": "a93b3a5c-a023-4e0c-815d-c77c6700dd89", "area": "Creatividad", "texto": "Me intereso por conocer m├ís sobre lo que pasa a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "Planificando tácticas de avance sigiloso en equipo y utilizando señales manuales silenciosas para coordinarse."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Creatividad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 9
FROM public.articulos WHERE slug = 'juego-de-acechadores'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', 'Desarrollando la agudeza sensorial auditiva y visual en condiciones de baja luminosidad natural.'
FROM public.articulos WHERE slug = 'juego-de-acechadores'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a93b3a5c-a023-4e0c-815d-c77c6700dd89', 'Planificando tácticas de avance sigiloso en equipo y utilizando señales manuales silenciosas para coordinarse.'
FROM public.articulos WHERE slug = 'juego-de-acechadores'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;