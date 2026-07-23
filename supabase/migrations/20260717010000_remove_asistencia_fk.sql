-- Migration: Remove foreign key constraint from asistencia_actividades
-- Allows attendance for grupal activities from actas that don't exist in ciclo_propuestas

ALTER TABLE asistencia_actividades 
  DROP CONSTRAINT IF EXISTS asistencia_actividades_propuesta_id_fkey;
