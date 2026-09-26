-- Add legal_name, funder_name, funder_url to branding config
-- These fields power the Schema.org EducationalOrganization JSON-LD (funder + legalName)

INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('branding', 'legal_name', '"Grupo de Guías y Scouts Nua Mana"', 'Nombre legal de la organización para Schema.org'),
('branding', 'funder_name', '"Sede Social San José de la Estrella"', 'Institución patrocinante / funder para Schema.org'),
('branding', 'funder_url', '""', 'Sitio web de la entidad patrocinante')
ON CONFLICT (categoria, clave) DO NOTHING;