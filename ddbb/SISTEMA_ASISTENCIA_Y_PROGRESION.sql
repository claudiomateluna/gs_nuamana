-- ==========================================================
-- SISTEMA DE ASISTENCIA Y PROGRESIÓN MULTIPERSPECTIVA (RADAR 360º)
-- ==========================================================

-- 1. Tabla de Asistencia a Actividades
-- Registra qué NNJ asistió a las actividades planificadas en el ciclo
CREATE TABLE IF NOT EXISTS public.asistencia_actividades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    propuesta_id UUID REFERENCES public.ciclo_propuestas(id) ON DELETE CASCADE,
    perfil_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    asistio BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(propuesta_id, perfil_id) -- Evita duplicados de asistencia para la misma actividad
);

-- 2. Tabla de Evaluación de Objetivos (Escala 1-8)
-- Almacena las evaluaciones desde la perspectiva del NNJ, Dirigente y Apoderado
CREATE TABLE IF NOT EXISTS public.evaluacion_objetivos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    perfil_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE, -- El NNJ evaluado
    evaluador_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE, -- Quien emite la nota
    propuesta_id UUID REFERENCES public.ciclo_propuestas(id) ON DELETE SET NULL, -- Contexto de la actividad
    area VARCHAR(50) NOT NULL, -- 'Corporalidad', 'Creatividad', 'Carácter', 'Afectividad', 'Sociabilidad', 'Espiritualidad'
    objetivo_texto TEXT NOT NULL, -- El texto literal del objetivo/huella/desafío
    valor INTEGER CHECK (valor >= 1 AND valor <= 8), -- Escala 1 a 8
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices para optimizar la carga del gráfico de radar
CREATE INDEX IF NOT EXISTS idx_eval_perfil ON public.evaluacion_objetivos(perfil_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_propuesta ON public.asistencia_actividades(propuesta_id);

-- Comentarios de ayuda
COMMENT ON COLUMN public.evaluacion_objetivos.valor IS 'Escala 1-8: 1=No visto, 8=Proyectable a la vida';
