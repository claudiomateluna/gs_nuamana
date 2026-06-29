-- Datos Iniciales para Nua Mana

-- Roles
INSERT INTO public.roles (name) VALUES 
('Admin'), 
('Dirigente'), 
('Beneficiario'), 
('Apoderado');

-- Unidades
INSERT INTO public.unidades (nombre, descripcion) VALUES 
('Manada', 'Niños y niñas de 7 a 11 años'), 
('Compañía', 'Guías de 11 a 15 años'), 
('Tropa', 'Scouts de 11 a 15 años'), 
('Avanzada', 'Pioneros y pioneras de 15 a 17 años'),
('Clan', 'Rutas de 17 a 20 años');

-- Categorías Blog
INSERT INTO public.categorias (nombre, slug) VALUES 
('Actividades', 'actividades'),
('Técnicas', 'tecnicas'),
('Historia', 'historia'),
('Administrativo', 'administrativo');

-- Subcategorías
INSERT INTO public.categorias (nombre, slug, parent_id) VALUES 
('Dinámicas', 'dinamicas', 1),
('Juegos', 'juegos', 1),
('Talleres', 'talleres', 1),
('Cabuyería', 'cabuyeria', 2),
('Campismo', 'campismo', 2),
('Biografías', 'biografias', 3),
('Historia Scout', 'historia-scout', 3);
