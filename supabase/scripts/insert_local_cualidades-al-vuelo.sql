BEGIN;

-- Insert article 'cualidades-al-vuelo'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Cualidades al Vuelo',
  'cualidades-al-vuelo',
  'Los participantes están dispersos en un área abierta. Uno de ellos lanza la pelota al aire mientras grita el nombre de un compañero. Todos los demás corren a alejarse excepto el nombrado, quien debe atrapar la pelota rápidamente y gritar una cualidad o fortaleza del compañero que la lanzó. Al oír la cualidad, todos los que huían deben congelarse en su sitio. El jugador con la pelota tiene permitido dar hasta tres pasos para intentar tocar con la pelota a uno de sus compañeros y restarle una vida de juego.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/cualidades-al-vuelo.webp',
  '{"duracion": "15 min", "cantidad": "8-20", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["Una pelota de goma blanda"], "variaciones": "Se puede usar un pañolón anudado en lugar de pelota para disminuir la velocidad y aumentar la seguridad.", "recomendaciones": "Asegurar que los lanzamientos de pelota se hagan dirigidos al cuerpo o piernas de forma controlada y sin violencia.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/cualidades-al-vuelo.webp", "areas": ["afectividad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los dem├ís de las cosas que me ponen alegre y tambi├®n de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Identificando y expresando en voz alta las virtudes y fortalezas de sus compañeros de unidad scout."}, {"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Mejorando la destreza física, los desplazamientos rápidos y la puntería segura en el campo de juego."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Afectividad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'cualidades-al-vuelo'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Identificando y expresando en voz alta las virtudes y fortalezas de sus compañeros de unidad scout.'
FROM public.articulos WHERE slug = 'cualidades-al-vuelo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Mejorando la destreza física, los desplazamientos rápidos y la puntería segura en el campo de juego.'
FROM public.articulos WHERE slug = 'cualidades-al-vuelo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;