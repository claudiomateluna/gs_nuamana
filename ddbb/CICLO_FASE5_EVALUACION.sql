-- ==========================================================
-- INFRAESTRUCTURA PARA LA FASE 5: EVALUACIÓN DEL CICLO
-- ==========================================================
-- Instrucciones: Ejecuta este script en tu SQL Editor de Supabase
-- ==========================================================

-- Añadimos las columnas necesarias para guardar la evaluación cualitativa del ciclo
-- Esto servirá como puente para el diagnóstico del próximo ciclo.

ALTER TABLE public.ciclos_unidad
ADD COLUMN IF NOT EXISTS evaluacion_general TEXT,
ADD COLUMN IF NOT EXISTS evaluacion_enfasis TEXT;
