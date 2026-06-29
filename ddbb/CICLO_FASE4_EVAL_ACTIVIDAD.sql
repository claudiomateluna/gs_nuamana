-- ==========================================================
-- INFRAESTRUCTURA PARA EVALUACIÓN INDIVIDUAL DE ACTIVIDADES (FASE 4)
-- ==========================================================

-- Añadimos la columna para guardar la evaluación rápida de cada actividad
ALTER TABLE public.ciclo_propuestas 
ADD COLUMN IF NOT EXISTS evaluacion TEXT;

-- Nota: Esta evaluación se integra en la Fase 4 y sirve como insumo para la Fase 5.
