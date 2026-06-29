CREATE TABLE IF NOT EXISTS public.articulo_resenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    articulo_id UUID REFERENCES public.articulos(id) ON DELETE CASCADE,
    perfil_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 7),
    comentario TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(articulo_id, perfil_id)
);

ALTER TABLE public.articulo_resenas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de reseñas" ON public.articulo_resenas;
CREATE POLICY "Lectura pública de reseñas" ON public.articulo_resenas FOR SELECT USING (true);

DROP POLICY IF EXISTS "NNJ crean sus propias reseñas" ON public.articulo_resenas;
CREATE POLICY "NNJ crean sus propias reseñas" ON public.articulo_resenas FOR INSERT TO authenticated WITH CHECK (auth.uid() = perfil_id);

DROP POLICY IF EXISTS "NNJ editan sus propias reseñas" ON public.articulo_resenas;
CREATE POLICY "NNJ editan sus propias reseñas" ON public.articulo_resenas FOR UPDATE TO authenticated USING (auth.uid() = perfil_id);
