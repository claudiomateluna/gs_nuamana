-- ==========================================================
-- INFRAESTRUCTURA PARA EL CICLO DE PROGRAMA (5 FASES)
-- ==========================================================
-- Instrucciones: Ejecuta este script en tu SQL Editor de Supabase
-- ==========================================================

-- 1. TABLA DE CICLOS DE UNIDAD
CREATE TABLE IF NOT EXISTS public.ciclos_unidad (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unidad_id INTEGER REFERENCES public.unidades(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    enfasis TEXT, -- La frase atractiva / objetivo del ciclo
    diagnostico TEXT, -- Resumen del estado inicial
    fase_actual INTEGER DEFAULT 1 CHECK (fase_actual BETWEEN 1 AND 5),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'cerrado')),
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    creado_por UUID REFERENCES public.perfiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE PROPUESTAS (LLUVIA DE IDEAS - FASE 1/2)
CREATE TABLE IF NOT EXISTS public.ciclo_propuestas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ciclo_id UUID REFERENCES public.ciclos_unidad(id) ON DELETE CASCADE,
    autor_id UUID REFERENCES public.perfiles(id),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    preseleccionada BOOLEAN DEFAULT FALSE, -- Pasa al Juego Democrático
    seleccionada BOOLEAN DEFAULT FALSE, -- Ganadora del Juego Democrático
    articulo_id UUID REFERENCES public.articulos(id), -- Vínculo opcional a la biblioteca de juegos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HABILITAR SEGURIDAD (RLS)
ALTER TABLE public.ciclos_unidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciclo_propuestas ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS PARA CICLOS DE UNIDAD
DROP POLICY IF EXISTS "Ver ciclos de la propia unidad" ON public.ciclos_unidad;
CREATE POLICY "Ver ciclos de la propia unidad" ON public.ciclos_unidad
FOR SELECT USING (
    unidad_id = (SELECT unidad_id FROM perfiles WHERE id = auth.uid())
    OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 1)
);

DROP POLICY IF EXISTS "Dirigentes gestionan ciclos" ON public.ciclos_unidad;
CREATE POLICY "Dirigentes gestionan ciclos" ON public.ciclos_unidad
FOR ALL USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id IN (1, 2, 3))
);

-- 5. POLÍTICAS PARA PROPUESTAS
DROP POLICY IF EXISTS "Ver propuestas del ciclo actual" ON public.ciclo_propuestas;
CREATE POLICY "Ver propuestas del ciclo actual" ON public.ciclo_propuestas
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM ciclos_unidad c 
        WHERE c.id = ciclo_id 
        AND (c.unidad_id = (SELECT unidad_id FROM perfiles WHERE id = auth.uid()) OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id = 1))
    )
);

DROP POLICY IF EXISTS "Todos pueden proponer ideas" ON public.ciclo_propuestas;
CREATE POLICY "Todos pueden proponer ideas" ON public.ciclo_propuestas
FOR INSERT WITH CHECK (
    auth.uid() = autor_id
);

DROP POLICY IF EXISTS "Autor o Dirigente puede borrar/editar propuesta" ON public.ciclo_propuestas;
CREATE POLICY "Autor o Dirigente puede borrar/editar propuesta" ON public.ciclo_propuestas
FOR ALL USING (
    auth.uid() = autor_id 
    OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol_id IN (1, 2, 3))
);

-- 6. TRIGGER PARA UPDATED_AT
DROP TRIGGER IF EXISTS update_ciclos_updated_at ON public.ciclos_unidad;
CREATE TRIGGER update_ciclos_updated_at BEFORE UPDATE ON public.ciclos_unidad FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
