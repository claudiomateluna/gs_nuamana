-- Add ciudad, region, codigo_postal to contact config
-- These fields power the Schema.org PostalAddress JSON-LD (addressLocality, addressRegion, postalCode)

INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('contact', 'ciudad', '"La Granja"', 'Ciudad o comuna de la sede (Schema.org addressLocality)'),
('contact', 'region', '"Región Metropolitana"', 'Región o provincia de la sede (Schema.org addressRegion)'),
('contact', 'codigo_postal', '"8801144"', 'Código postal de la sede (Schema.org postalCode)')
ON CONFLICT (categoria, clave) DO NOTHING;