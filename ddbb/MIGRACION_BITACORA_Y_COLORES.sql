-- ==========================================================
-- MIGRACIÓN CONSOLIDADA: SISTEMA DE BITÁCORA Y COLORES
-- ==========================================================
-- Instrucciones: Copia y pega este contenido en el SQL Editor 
-- de tu Dashboard de Supabase (http://localhost:54323)
-- ==========================================================

-- 1. CREACIÓN DE LA TABLA DE BITÁCORA
CREATE TABLE IF NOT EXISTS public.bitacoras_unidad (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unidad_id INTEGER REFERENCES public.unidades(id) ON DELETE CASCADE,
    autor_id UUID REFERENCES public.perfiles(id),
    titulo VARCHAR(255) NOT NULL,
    historia TEXT NOT NULL,
    imagenes JSONB DEFAULT '[]'::jsonb, -- Array de URLs de Storage
    fecha_suceso DATE NOT NULL DEFAULT CURRENT_DATE,
    excluir_dirigentes BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.bitacoras_unidad ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS DE SEGURIDAD (RLS)

-- Eliminar políticas previas si existen (para evitar errores en re-ejecución)
DROP POLICY IF EXISTS "Lectura selectiva de bitácoras" ON public.bitacoras_unidad;
DROP POLICY IF EXISTS "NNJ y Admins pueden crear entradas" ON public.bitacoras_unidad;
DROP POLICY IF EXISTS "Solo autor o admin actualiza" ON public.bitacoras_unidad;
DROP POLICY IF EXISTS "Solo autor o admin elimina" ON public.bitacoras_unidad;

-- Política de Lectura (Selectiva según privacidad)
CREATE POLICY "Lectura selectiva de bitácoras" ON public.bitacoras_unidad
FOR SELECT USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 1)
    OR
    (
        unidad_id = (SELECT unidad_id FROM perfiles WHERE id = auth.uid())
        AND
        (
            NOT excluir_dirigentes
            OR
            (excluir_dirigentes AND (SELECT rol_id FROM perfiles WHERE id = auth.uid()) NOT IN (2, 3))
        )
    )
);

-- Política de Inserción
CREATE POLICY "NNJ y Admins pueden crear entradas" ON public.bitacoras_unidad
FOR INSERT WITH CHECK (
    auth.uid() = autor_id
    AND
    (
        unidad_id = (SELECT unidad_id FROM perfiles WHERE id = auth.uid())
        OR
        EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 1)
    )
);

-- Política de Actualización
CREATE POLICY "Solo autor o admin actualiza" ON public.bitacoras_unidad
FOR UPDATE USING (
    auth.uid() = autor_id OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 1)
);

-- Política de Eliminación
CREATE POLICY "Solo autor o admin elimina" ON public.bitacoras_unidad
FOR DELETE USING (
    auth.uid() = autor_id OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 1)
);

-- 3. TRIGGER PARA UPDATED_AT
DROP TRIGGER IF EXISTS update_bitacoras_updated_at ON public.bitacoras_unidad;
CREATE TRIGGER update_bitacoras_updated_at BEFORE UPDATE ON public.bitacoras_unidad FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
