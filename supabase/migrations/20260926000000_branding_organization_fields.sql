-- Add Organization fields to branding config
-- These fields power the Schema.org Organization JSON-LD and admin panel

INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('branding', 'telefono', '"+56 9 6689 6001"', 'Teléfono de contacto de la organización'),
('branding', 'parent_organization_name', '"Asociación de Guías y Scouts de Chile"', 'Nombre de la organización superior'),
('branding', 'parent_organization_url', '"https://guiasyscoutsdechile.org/"', 'Sitio web de la organización padre')
ON CONFLICT (categoria, clave) DO NOTHING;
