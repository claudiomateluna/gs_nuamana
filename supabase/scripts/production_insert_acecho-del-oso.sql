BEGIN;

-- Insert article 'acecho-del-oso'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Acecho del Oso',
  'acecho-del-oso',
  'Un participante asume el rol del ''Oso'' y se ubica en una base delimitada (su cueva) de espaldas. El resto de los jugadores (los exploradores) parten desde una zona segura alejada y deben avanzar sigilosamente en la oscuridad del bosque para intentar tocar la cueva del oso. En intervalos aleatorios, el oso puede girarse rápidamente y encender su linterna en una dirección. Si alumbra directamente a un participante en movimiento, este debe regresar a la línea de partida y empezar de nuevo.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/acecho-del-oso.webp',
  '{"duracion": "30 min", "cantidad": "10-25", "lugares": ["campo abierto"], "materiales": ["Una linterna potente para el ''oso''"], "variaciones": "Se puede delimitar el área de juego con cuerdas reflectantes si el bosque tiene pendientes pronunciadas.", "recomendaciones": "Revisar el terreno a la luz del día para retirar ramas secas peligrosas, pozos o espinos antes de jugar de noche.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/acecho-del-oso.webp", "areas": ["creatividad", "corporalidad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "Entrenando la motricidad silenciosa, el equilibrio corporal y el control neuromuscular para quedarse inmóvil al instante."}, {"id": "26c3a88f-5dd1-4b71-9919-07f14ed5b61e", "area": "Creatividad", "texto": "Quiero aprender cosas nuevas.", "unidad": "Manada", "como_se_cumple": "Desarrollando la orientación espacial nocturna y el aprovechamiento inteligente del relieve del terreno para ocultarse."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Creatividad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 9
FROM public.articulos WHERE slug = 'acecho-del-oso'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', 'Entrenando la motricidad silenciosa, el equilibrio corporal y el control neuromuscular para quedarse inmóvil al instante.'
FROM public.articulos WHERE slug = 'acecho-del-oso'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '26c3a88f-5dd1-4b71-9919-07f14ed5b61e', 'Desarrollando la orientación espacial nocturna y el aprovechamiento inteligente del relieve del terreno para ocultarse.'
FROM public.articulos WHERE slug = 'acecho-del-oso'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;