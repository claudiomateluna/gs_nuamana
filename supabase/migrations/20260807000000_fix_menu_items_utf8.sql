-- ==============================================================================
-- FIX UTF-8: menu_items corruptos (caracteres acentuados reemplazados por '?')
-- Fecha: 2026-08-07
-- Causa: al insertar, los bytes UTF-8 no-ASCII (0xC3 0xB1, 0xC3 0xA9, etc.)
--        fueron reemplazados por '?' (conversión lossy).
-- Fix: restaura los títulos canónicos del seed (20260730000000_menu_items.sql).
-- Idempotente: solo actualiza filas cuyo titulo aún contenga '?'.
-- ==============================================================================

UPDATE menu_items SET titulo = 'Quiénes Somos'
WHERE href = '/acerca-de/quienes-somos' AND titulo LIKE '%?%';

UPDATE menu_items SET titulo = 'Misión y Visión'
WHERE href = '/acerca-de/mision-y-vision' AND titulo LIKE '%?%';

UPDATE menu_items SET titulo = 'Institución Patrocinante'
WHERE href = '/acerca-de/institucion-patrocinante' AND titulo LIKE '%?%';

UPDATE menu_items SET titulo = 'El Método Scout'
WHERE href = '/lo-que-hacemos/el-metodo-scout' AND titulo LIKE '%?%';

UPDATE menu_items SET titulo = 'Habilidades y Técnicas'
WHERE href = '/lo-que-hacemos/habilidades-y-tecnicas' AND titulo LIKE '%?%';

UPDATE menu_items SET titulo = 'Manada (Ahi Niho Vænga)'
WHERE href = '/unidad/manada' AND titulo LIKE '%?%';

UPDATE menu_items SET titulo = 'Compañía (Põ Vui Vaikava)'
WHERE href = '/unidad/compania' AND titulo LIKE '%?%';
