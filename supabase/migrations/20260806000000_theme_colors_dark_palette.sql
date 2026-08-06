-- Dark palette corrections for theme_colors (cms-admin-fase5b)
-- Updates dclr5-8 to contrast-corrected values + adds dclr9/dclr10
UPDATE configuracion_sitio SET valor = '"#33506f"', updated_at = NOW() WHERE categoria = 'theme_colors' AND clave = 'dclr5';
UPDATE configuracion_sitio SET valor = '"#33a345"', updated_at = NOW() WHERE categoria = 'theme_colors' AND clave = 'dclr6';
UPDATE configuracion_sitio SET valor = '"#ef4b3a"', updated_at = NOW() WHERE categoria = 'theme_colors' AND clave = 'dclr7';
UPDATE configuracion_sitio SET valor = '"#ffcf33"', updated_at = NOW() WHERE categoria = 'theme_colors' AND clave = 'dclr8';
INSERT INTO configuracion_sitio (categoria, clave, valor, updated_at) VALUES ('theme_colors', 'dclr9', '"#26262b"', NOW())
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();
INSERT INTO configuracion_sitio (categoria, clave, valor, updated_at) VALUES ('theme_colors', 'dclr10', '"#3c3c3c"', NOW())
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();
