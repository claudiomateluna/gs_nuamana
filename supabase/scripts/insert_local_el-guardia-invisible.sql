BEGIN;

-- Insert article 'el-guardia-invisible'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'El Guardia Invisible',
  'el-guardia-invisible',
  'Un dirigente se sienta en una silla en el centro de un círculo de 20 metros de diámetro sosteniendo una linterna apagada. Los participantes se dispersan fuera del círculo en la oscuridad. El objetivo es avanzar sigilosamente y depositar un objeto pequeño (como una piedra o piña) a los pies del dirigente sin que este los escuche. Si el guardia oye un ruido (pisar hojas secas, ramas, ropa), puede apuntar con su linterna en esa dirección. Si ilumina a alguien, el participante es eliminado del turno.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-guardia-invisible.webp',
  '{"duracion": "30 min", "cantidad": "8-20", "lugares": ["campo abierto", "campo delimitado"], "materiales": ["Una linterna y silbato para el guardia"], "variaciones": "El guardia puede patrullar un sendero delimitado en lugar de quedarse estático, ampliando el rango de acecho.", "recomendaciones": "Asegurar que los participantes avancen agachados o pecho a tierra con ropa oscura para camuflarse.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-guardia-invisible.webp", "areas": ["creatividad", "corporalidad"], "unidades": ["tropa"], "objetivos_educativos": [{"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan da├▒ar mi salud y la de mis compa├▒eros.", "unidad": "Tropa", "como_se_cumple": "Controlando los movimientos del propio cuerpo, regulando el peso al caminar y dominando la respiración bajo tensión."}, {"id": "a93b3a5c-a023-4e0c-815d-c77c6700dd89", "area": "Creatividad", "texto": "Me intereso por conocer m├ís sobre lo que pasa a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "Analizando la composición del suelo (hojas secas vs tierra compacta) para trazar la ruta de aproximación más silenciosa."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Creatividad, corporalidad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 9
FROM public.articulos WHERE slug = 'el-guardia-invisible'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', 'Controlando los movimientos del propio cuerpo, regulando el peso al caminar y dominando la respiración bajo tensión.'
FROM public.articulos WHERE slug = 'el-guardia-invisible'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a93b3a5c-a023-4e0c-815d-c77c6700dd89', 'Analizando la composición del suelo (hojas secas vs tierra compacta) para trazar la ruta de aproximación más silenciosa.'
FROM public.articulos WHERE slug = 'el-guardia-invisible'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;