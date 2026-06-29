-- Asegurar que existan categorías para los selectores múltiples
INSERT INTO public.categorias (nombre, slug) VALUES
('Unidades', 'unidades-metadata'),
('Áreas de Desarrollo', 'areas-desarrollo-metadata'),
('Lugar de Actividad', 'lugar-actividad-metadata')
ON CONFLICT DO NOTHING;

-- Insertar opciones para Áreas de Desarrollo (ejemplo)
INSERT INTO public.categorias (nombre, slug, parent_id)
SELECT 'Carácter', 'caracter', id FROM public.categorias WHERE slug = 'areas-desarrollo-metadata'
ON CONFLICT DO NOTHING;
-- Repetir para otras áreas si es necesario.