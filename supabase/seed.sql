-- Datos Maestros de Referencia (Basado en documentación histórica)

-- Roles Scouts y Administrativos
INSERT INTO public.roles (name) VALUES 
('admin'), ('dirigente'), ('guiadora'), ('presidente'), ('tesorera'), 
('secretario'), ('representante'), ('apoderado'), ('lobato (a)'), 
('guia'), ('scout'), ('pionera (o)'), ('caminante');

-- Unidades
INSERT INTO public.unidades (nombre, descripcion, logo_unidad_url, logo_rama_url) VALUES 
('Manada', 'Niños y niñas de 7 a 11 años', '/images/logos/iconos_UnidadesManada.webp', '/images/logos/iconos_lobatos.svg'), 
('Compañía', 'Guías de 11 a 15 años', '/images/logos/iconos_UnidadesCia.webp', '/images/logos/iconos_guias.svg'), 
('Tropa', 'Scouts de 11 a 15 años', '/images/logos/iconos_UnidadesTropa.webp', '/images/logos/iconos_scouts.svg'), 
('Avanzada', 'Pioneros y pioneras de 15 a 17 años', '/images/logos/iconos_UnidadesAvanzada.webp', '/images/logos/iconos_pioneres.svg'),
('Clan', 'Rutas de 17 a 20 años', '/images/logos/iconos_UnidadesClan.webp', '/images/logos/iconos_caminantes.svg');

-- Categorías Blog Jerárquicas
INSERT INTO public.categorias (id, nombre, slug) VALUES 
(1, 'Actividades', 'actividades'),
(2, 'Técnicas', 'tecnicas'),
(3, 'Historia', 'historia'),
(4, 'Administrativo', 'administrativo'),
(5, 'Ciudadanía', 'ciudadania'),
(6, 'Reflexión', 'reflexion');

-- Resetear la secuencia para evitar errores de duplicado en los siguientes inserts
SELECT setval('public.categorias_id_seq', (SELECT MAX(id) FROM public.categorias));

INSERT INTO public.categorias (nombre, slug, parent_id) VALUES 
('Juegos', 'juegos', 1),
('Juegos Democráticos', 'juegos-democraticos', 1),
('Juegos Nocturnos', 'juegos-nocturnos', 1),
('Dinámicas', 'dinamicas', 1),
('Talleres', 'talleres', 1),
('Apoderados', 'apoderados', 4),
('Información', 'informacion', 4),
('Biografías', 'biografias', 3),
('Historia Scout', 'historia-scout', 3),
('Historias Scouts', 'historias-scouts', 3),
('Animación', 'animacion', 2),
('Cabuyería', 'cabuyeria', 2),
('Campismo', 'campismo', 2),
('Claves y Pistas', 'claves-y-pistas', 2),
('Cocina', 'cocina', 2),
('Pionerismo', 'pionerismo', 2),
('Primeros Auxilios', 'primeros-auxilios', 2);

-- Áreas de Desarrollo (como tags o categorías secundarias)
-- Se recomienda manejarlas como categorías o en una tabla aparte si se requiere lógica especial.
