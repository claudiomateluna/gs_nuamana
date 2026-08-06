-- ==============================================================================
-- CMS ADMIN FASE 6: theme_colors — gradient roles (clr11/clr12, dclr11/dclr12)
-- and per-color opacity keys (clrN_opacity / dclrN_opacity, JSON number 100).
-- Fecha: 2026-08-07
-- Propósito: Poblar configuracion_sitio con los 4 roles de degradado faltantes
--            (paradas intermedia y final de globals.css :root) y las 24 claves
--            de opacidad (0-100, default 100) del modelo de 48 campos.
-- Idempotente: ON CONFLICT (categoria, clave) DO UPDATE. Solo claves NUEVAS —
--            las 20 filas existentes nunca se tocan. ATENCIÓN: re-ejecutar
--            restablece estas 28 claves a sus valores por defecto, descartando
--            cualquier valor personalizado del admin. Ejecutar UNA sola vez.
-- ==============================================================================

-- 4 roles de degradado (JSON string hex, patrón de 20260805000000)
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('theme_colors', 'clr11', '"#2c3e50"', 'Claro 11 — Degradado Intermedio (opcional, var(--clr11))'),
('theme_colors', 'clr12', '"#cb3327"', 'Claro 12 — Degradado Término (var(--clr12))'),
('theme_colors', 'dclr11', '"#33506f"', 'Oscuro 11 — Degradado Intermedio (opcional, var(--dclr11))'),
('theme_colors', 'dclr12', '"#ef4b3a"', 'Oscuro 12 — Degradado Término (var(--dclr12))')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- 24 claves de opacidad (JSON number 100 — default)
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('theme_colors', 'clr1_opacity', '100', 'Opacidad de clr1 (0-100)'),
('theme_colors', 'clr2_opacity', '100', 'Opacidad de clr2 (0-100)'),
('theme_colors', 'clr3_opacity', '100', 'Opacidad de clr3 (0-100)'),
('theme_colors', 'clr4_opacity', '100', 'Opacidad de clr4 (0-100)'),
('theme_colors', 'clr5_opacity', '100', 'Opacidad de clr5 (0-100)'),
('theme_colors', 'clr6_opacity', '100', 'Opacidad de clr6 (0-100)'),
('theme_colors', 'clr7_opacity', '100', 'Opacidad de clr7 (0-100)'),
('theme_colors', 'clr8_opacity', '100', 'Opacidad de clr8 (0-100)'),
('theme_colors', 'clr9_opacity', '100', 'Opacidad de clr9 (0-100)'),
('theme_colors', 'clr10_opacity', '100', 'Opacidad de clr10 (0-100)'),
('theme_colors', 'clr11_opacity', '100', 'Opacidad de clr11 (0-100)'),
('theme_colors', 'clr12_opacity', '100', 'Opacidad de clr12 (0-100)'),
('theme_colors', 'dclr1_opacity', '100', 'Opacidad de dclr1 (0-100)'),
('theme_colors', 'dclr2_opacity', '100', 'Opacidad de dclr2 (0-100)'),
('theme_colors', 'dclr3_opacity', '100', 'Opacidad de dclr3 (0-100)'),
('theme_colors', 'dclr4_opacity', '100', 'Opacidad de dclr4 (0-100)'),
('theme_colors', 'dclr5_opacity', '100', 'Opacidad de dclr5 (0-100)'),
('theme_colors', 'dclr6_opacity', '100', 'Opacidad de dclr6 (0-100)'),
('theme_colors', 'dclr7_opacity', '100', 'Opacidad de dclr7 (0-100)'),
('theme_colors', 'dclr8_opacity', '100', 'Opacidad de dclr8 (0-100)'),
('theme_colors', 'dclr9_opacity', '100', 'Opacidad de dclr9 (0-100)'),
('theme_colors', 'dclr10_opacity', '100', 'Opacidad de dclr10 (0-100)'),
('theme_colors', 'dclr11_opacity', '100', 'Opacidad de dclr11 (0-100)'),
('theme_colors', 'dclr12_opacity', '100', 'Opacidad de dclr12 (0-100)')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();
