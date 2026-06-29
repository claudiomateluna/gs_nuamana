-- ==========================================================
-- CONFIGURACIÓN DE STORAGE: BUCKETS Y POLÍTICAS
-- ==========================================================
-- Instrucciones: Ejecuta este script en tu SQL Editor de Supabase
-- (http://localhost:54323) para habilitar la subida de fotos.
-- ==========================================================

-- 1. CREACIÓN DE BUCKETS
-- 'articulos': Para las imágenes destacadas y contenido del Blog/Noticias.
-- 'bitacoras': Para las fotos de las historias del Libro de Mowha/Tally/Bitácora.

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('articulos', 'articulos', true),
  ('bitacoras', 'bitacoras', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLÍTICAS DE SEGURIDAD PARA EL BUCKET 'ARTICULOS'

-- Permitir subida (Solo usuarios autenticados)
DROP POLICY IF EXISTS "Usuarios pueden subir fotos de articulos" ON storage.objects;
CREATE POLICY "Usuarios pueden subir fotos de articulos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'articulos' 
    AND auth.role() = 'authenticated'
);

-- Permitir lectura (Público)
DROP POLICY IF EXISTS "Fotos de articulos publicas" ON storage.objects;
CREATE POLICY "Fotos de articulos publicas" ON storage.objects
FOR SELECT USING (bucket_id = 'articulos');

-- Permitir eliminación (Solo el dueño o admin)
DROP POLICY IF EXISTS "Duenos pueden borrar fotos de articulos" ON storage.objects;
CREATE POLICY "Duenos pueden borrar fotos de articulos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'articulos' 
    AND (auth.uid() = owner OR auth.uid() IN (SELECT id FROM public.perfiles WHERE rol_id = 1))
);


-- 3. POLÍTICAS DE SEGURIDAD PARA EL BUCKET 'BITACORAS'

-- Permitir subida (Solo usuarios autenticados)
DROP POLICY IF EXISTS "Usuarios pueden subir fotos de bitacoras" ON storage.objects;
CREATE POLICY "Usuarios pueden subir fotos de bitacoras" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'bitacoras' 
    AND auth.role() = 'authenticated'
);

-- Permitir lectura (Público - La privacidad se maneja en la tabla bitacoras_unidad)
DROP POLICY IF EXISTS "Fotos de bitacoras publicas" ON storage.objects;
CREATE POLICY "Fotos de bitacoras publicas" ON storage.objects
FOR SELECT USING (bucket_id = 'bitacoras');

-- Permitir eliminación (Solo el dueño o admin)
DROP POLICY IF EXISTS "Duenos pueden borrar fotos de bitacoras" ON storage.objects;
CREATE POLICY "Duenos pueden borrar fotos de bitacoras" ON storage.objects
FOR DELETE USING (
    bucket_id = 'bitacoras' 
    AND (auth.uid() = owner OR auth.uid() IN (SELECT id FROM public.perfiles WHERE rol_id = 1))
);
