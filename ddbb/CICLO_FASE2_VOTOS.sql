-- ==========================================================
-- INFRAESTRUCTURA PARA LA FASE 2: JUEGO DEMOCRÁTICO
-- ==========================================================
-- Instrucciones: Ejecuta este script en tu SQL Editor de Supabase
-- ==========================================================

-- 1. ACTUALIZAR TABLA DE CICLOS PARA VINCULAR EL JUEGO DEMOCRÁTICO
ALTER TABLE public.ciclos_unidad
ADD COLUMN IF NOT EXISTS articulo_juego_id UUID REFERENCES public.articulos(id);

-- 2. TABLA DE VOTOS DE PROPUESTAS
CREATE TABLE IF NOT EXISTS public.ciclo_votos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    propuesta_id UUID REFERENCES public.ciclo_propuestas(id) ON DELETE CASCADE,
    perfil_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(propuesta_id, perfil_id) -- Un voto por usuario por propuesta
);

-- 3. SEGURIDAD (RLS) PARA VOTOS
ALTER TABLE public.ciclo_votos ENABLE ROW LEVEL SECURITY;

-- Todos en la unidad pueden ver los votos
DROP POLICY IF EXISTS "Ver votos de la unidad" ON public.ciclo_votos;
CREATE POLICY "Ver votos de la unidad" ON public.ciclo_votos
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM ciclo_propuestas p
        JOIN ciclos_unidad c ON p.ciclo_id = c.id
        WHERE p.id = propuesta_id
        AND (c.unidad_id = (SELECT unidad_id FROM perfiles WHERE id = auth.uid()) OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 1))
    )
);

-- Solo el dueño del voto puede insertarlo/borrarlo (y solo si el ciclo está en Fase 2)
DROP POLICY IF EXISTS "Gestionar propio voto" ON public.ciclo_votos;
CREATE POLICY "Gestionar propio voto" ON public.ciclo_votos
FOR ALL USING (
    auth.uid() = perfil_id
    AND EXISTS (
        SELECT 1 FROM ciclo_propuestas p
        JOIN ciclos_unidad c ON p.ciclo_id = c.id
        WHERE p.id = propuesta_id AND c.fase_actual = 2
    )
);
