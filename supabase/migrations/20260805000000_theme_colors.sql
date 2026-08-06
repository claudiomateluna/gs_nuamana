-- ==============================================================================
-- CMS ADMIN FASE 5: Seed data para theme_colors (paleta CSS editable)
-- Fecha: 2026-08-05
-- Propósito: Poblar configuracion_sitio con los 18 valores de variables CSS
--            de globals.css :root (clr1..clr10 + dclr1..dclr8) para que sean
--            editables desde el admin Global → Colores del Tema.
-- Idempotente: ON CONFLICT (categoria, clave) DO UPDATE.
-- ==============================================================================

INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('theme_colors', 'clr1', '"#FFFFFF"', 'Claro 1 — Fondo principal claro (var(--clr1))'),
('theme_colors', 'clr2', '"#95a5a6"', 'Claro 2 — Gris claro de acento (var(--clr2))'),
('theme_colors', 'clr3', '"#333333"', 'Claro 3 — Gris oscuro de texto/bordes (var(--clr3))'),
('theme_colors', 'clr4', '"#1d1d1d"', 'Claro 4 — Negro de header/footer (var(--clr4))'),
('theme_colors', 'clr5', '"#2c3e50"', 'Claro 5 — Azul noche de encabezados (var(--clr5))'),
('theme_colors', 'clr6', '"#3eb34b"', 'Claro 6 — Verde de éxito (var(--clr6))'),
('theme_colors', 'clr7', '"#cb3327"', 'Claro 7 — Acento rojo principal, botones y scrollbars (var(--clr7))'),
('theme_colors', 'clr8', '"#ffc41d"', 'Claro 8 — Dorado de destacados/badges (var(--clr8))'),
('theme_colors', 'clr9', '"#f8f9fa"', 'Claro 9 — Gris muy claro de tarjetas (var(--clr9))'),
('theme_colors', 'clr10', '"#e9ecef"', 'Claro 10 — Gris de bordes tenues (var(--clr10))'),
('theme_colors', 'dclr1', '"#121212"', 'Oscuro 1 — Fondo principal oscuro (var(--dclr1))'),
('theme_colors', 'dclr2', '"#b0b0b0"', 'Oscuro 2 — Gris claro de texto/íconos oscuros (var(--dclr2))'),
('theme_colors', 'dclr3', '"#1e1e1e"', 'Oscuro 3 — Superficie de tarjetas oscuras (var(--dclr3))'),
('theme_colors', 'dclr4', '"#0a0a0a"', 'Oscuro 4 — Negro profundo del modo oscuro (var(--dclr4))'),
('theme_colors', 'dclr5', '"#1a2a3a"', 'Oscuro 5 — Azul noche oscuro (var(--dclr5))'),
('theme_colors', 'dclr6', '"#2d8a3a"', 'Oscuro 6 — Verde de éxito oscuro (var(--dclr6))'),
('theme_colors', 'dclr7', '"#a3281f"', 'Oscuro 7 — Acento rojo del modo oscuro (var(--dclr7))'),
('theme_colors', 'dclr8', '"#e6b01a"', 'Oscuro 8 — Dorado del modo oscuro (var(--dclr8))')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();