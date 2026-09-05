-- ==============================================================================
-- THEME COLORS ROLES: 37 semantic roles (74 vars, 148 fields)
-- Fecha: 2026-08-12
-- Propósito: Extender la paleta de 66 variables (33 roles) a 74 variables
--            (37 roles) agregando 2 roles base (Scrollbar), 2 header gradient
--            roles nuevos, y remapeando hclr7/hclr8/hclr9/hclr10 con roles
--            semánticos refinados. Insertar SOLO las 10 claves hex + 10 claves
--            de opacidad NUEVAS; las claves preexistentes (clr9, clr10, dclr9,
--            dclr10, hclr7-hclr10, hdclr7-hdclr10) NO se actualizan.
-- Idempotente: ON CONFLICT (categoria, clave) DO NOTHING — preserva valores
--              personalizados en DB existentes.
-- ==============================================================================

-- 10 new hex keys
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
-- Base: Fondo Scrollbar + Scrollbar (derived from clr1 / clr4)
('theme_colors', 'clr9', '"#FFFFFF"', 'Base 9 — Fondo Scrollbar (scrollbar-track light, var(--clr9))'),
('theme_colors', 'clr10', '"#cb3327"', 'Base 10 — Scrollbar (scrollbar thumb + arrows light, var(--clr10))'),
('theme_colors', 'dclr9', '"#121212"', 'Base 9 — Fondo Scrollbar Oscuro (scrollbar-track dark, var(--dclr9))'),
('theme_colors', 'dclr10', '"#ef4b3a"', 'Base 10 — Scrollbar Oscuro (scrollbar thumb + arrows dark, var(--dclr10))'),
-- Header: Texto Hover + Fondo Inicial/Final gradient roles (derived from old hclr10/hdclr9)
('theme_colors', 'hclr10', '"#cb3327"', 'Header 10 — Texto Hover (link hover color, var(--hclr10))'),
('theme_colors', 'hdclr10', '"#ef4b3a"', 'Header 10 — Texto Hover Oscuro (link hover dark, var(--hdclr10))'),
('theme_colors', 'hclr11', '"#2c3e50"', 'Header 11 — Fondo Inicial (scroll gradient from-, var(--hclr11))'),
('theme_colors', 'hclr12', '"#cb3327"', 'Header 12 — Fondo Final (scroll gradient to-, var(--hclr12))'),
('theme_colors', 'hdclr11', '"#33506f"', 'Header 11 — Fondo Inicial Oscuro (scroll gradient from- dark, var(--hdclr11))'),
('theme_colors', 'hdclr12', '"#ef4b3a"', 'Header 12 — Fondo Final Oscuro (scroll gradient to- dark, var(--hdclr12))')
ON CONFLICT (categoria, clave) DO NOTHING;

-- 10 new opacity keys (JSON number 100 = default)
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('theme_colors', 'clr9_opacity', '100', 'Opacidad de clr9 (0-100)'),
('theme_colors', 'clr10_opacity', '100', 'Opacidad de clr10 (0-100)'),
('theme_colors', 'dclr9_opacity', '100', 'Opacidad de dclr9 (0-100)'),
('theme_colors', 'dclr10_opacity', '100', 'Opacidad de dclr10 (0-100)'),
('theme_colors', 'hclr10_opacity', '100', 'Opacidad de hclr10 (0-100)'),
('theme_colors', 'hdclr10_opacity', '100', 'Opacidad de hdclr10 (0-100)'),
('theme_colors', 'hclr11_opacity', '100', 'Opacidad de hclr11 (0-100)'),
('theme_colors', 'hdclr11_opacity', '100', 'Opacidad de hdclr11 (0-100)'),
('theme_colors', 'hclr12_opacity', '100', 'Opacidad de hclr12 (0-100)'),
('theme_colors', 'hdclr12_opacity', '100', 'Opacidad de hdclr12 (0-100)')
ON CONFLICT (categoria, clave) DO NOTHING;
