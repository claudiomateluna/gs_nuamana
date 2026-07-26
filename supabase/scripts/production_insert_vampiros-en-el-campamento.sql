BEGIN;

-- Insert article 'vampiros-en-el-campamento'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  'Vampiros en el Campamento',
  'vampiros-en-el-campamento',
  'Se dibuja un ''cementerio'' en una cartulina y se cuelga en un lugar común. Cada participante recibe una tarjeta secreta con el nombre de su víctima. Para eliminarla, debe acercarse sigilosamente por detrás y simular una ''mordida'' en el cuello diciendo ''eres mi presa'', pero esto solo es válido si no hay ningún testigo ocular cerca. La víctima eliminada debe firmar en el cementerio y entregarle sus tarjetas al asesino, quien ahora debe cazar al objetivo que tenía su víctima.',
  'publicado',
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/vampiros-en-el-campamento.webp',
  '{"duracion": "30 min", "cantidad": "10-30", "lugares": ["campo abierto", "sala"], "materiales": ["Tarjetas o cartulinas con nombres cruzados"], "variaciones": "Se puede limitar el juego a los momentos libres del campamento para no interferir con los talleres de formación.", "recomendaciones": "Establecer zonas seguras donde no se puede ''matar'' (como el comedor o el área de primeros auxilios).", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/vampiros-en-el-campamento.webp", "areas": ["sociabilidad", "creatividad"], "unidades": ["manada"], "objetivos_educativos": [{"id": "26c3a88f-5dd1-4b71-9919-07f14ed5b61e", "area": "Creatividad", "texto": "Quiero aprender cosas nuevas.", "unidad": "Manada", "como_se_cumple": "Desarrollando la observación periférica, la planificación estratégica y la paciencia para actuar en el momento idóneo."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre est├® de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando honestamente las reglas de eliminación y la veracidad de los testimonios si un asesinato es presenciado."}], "justificacion_areas": "Dinámica diseñada para el desarrollo de áreas: Sociabilidad, creatividad."}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET imagen_destacada = EXCLUDED.imagen_destacada, metadata = EXCLUDED.metadata;


-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'vampiros-en-el-campamento'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- Map educational objectives

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '26c3a88f-5dd1-4b71-9919-07f14ed5b61e', 'Desarrollando la observación periférica, la planificación estratégica y la paciencia para actuar en el momento idóneo.'
FROM public.articulos WHERE slug = 'vampiros-en-el-campamento'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando honestamente las reglas de eliminación y la veracidad de los testimonios si un asesinato es presenciado.'
FROM public.articulos WHERE slug = 'vampiros-en-el-campamento'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;