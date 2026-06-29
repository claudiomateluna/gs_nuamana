-- ==========================================================
-- INFRAESTRUCTURA PARA LA FASE 3: ORGANIZACIÓN Y DISEÑO
-- ==========================================================
-- Instrucciones: Ejecuta este script en tu SQL Editor de Supabase
-- ==========================================================

-- 1. ACTUALIZAR TABLA DE PROPUESTAS PARA CALENDARIZACIÓN
-- Añadimos la fecha en la que se realizará la actividad ganadora
ALTER TABLE public.ciclo_propuestas
ADD COLUMN IF NOT EXISTS fecha_programada DATE;

-- Nota: La columna "articulo_id" para enlazar la ficha técnica ya existe
-- en la definición original de ciclo_propuestas, al igual que "seleccionada".
