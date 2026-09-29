-- Add organization metadata fields (Schema.org EducationalOrganization)
-- branding: founding_date, OMMS / OSI / WAGGGS affiliations (memberOf)
-- contact: pais (Schema.org addressCountry)

INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('branding', 'founding_date', '"2005-09-23"', 'Fecha de fundación en formato ISO (Schema.org foundingDate)'),
('branding', 'omms_name', '"Organización Mundial del Movimiento Scout"', 'Nombre de la OMMS (Schema.org memberOf)'),
('branding', 'omms_url', '"https://www.scout.org/"', 'Sitio web de la OMMS (Schema.org memberOf url)'),
('branding', 'osi_name', '"Organización Scout Interamericana"', 'Departamento interamericano de la OMMS (Schema.org memberOf department)'),
('branding', 'wagggs_name', '"World Association of Girl Guides and Girl Scouts"', 'Nombre de WAGGGS (Schema.org memberOf)'),
('branding', 'wagggs_url', '"https://www.wagggs.org/"', 'Sitio web de WAGGGS (Schema.org memberOf url)'),
('contact', 'pais', '"CL"', 'Código ISO 3166-1 alfa-2 del país (Schema.org addressCountry)')
ON CONFLICT (categoria, clave) DO NOTHING;
