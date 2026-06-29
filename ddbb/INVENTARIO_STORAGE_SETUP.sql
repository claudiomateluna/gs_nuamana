-- ==========================================================
-- CONFIGURACIÓN DE STORAGE E INFRAESTRUCTURA PARA INVENTARIO
-- ==========================================================
-- Instrucciones: Ejecuta este script en tu SQL Editor de Supabase
-- ==========================================================

-- 1. CREACIÓN DEL BUCKET 'INVENTARIO'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('inventario', 'inventario', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLÍTICAS DE SEGURIDAD PARA EL BUCKET 'INVENTARIO'

-- Permitir subida (Solo usuarios autenticados)
DROP POLICY IF EXISTS "Usuarios pueden subir fotos de inventario" ON storage.objects;
CREATE POLICY "Usuarios pueden subir fotos de inventario" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'inventario' 
    AND auth.role() = 'authenticated'
);

-- Permitir lectura (Público)
DROP POLICY IF EXISTS "Fotos de inventario publicas" ON storage.objects;
CREATE POLICY "Fotos de inventario publicas" ON storage.objects
FOR SELECT USING (bucket_id = 'inventario');

-- Permitir eliminación (Solo el dueño o admin)
DROP POLICY IF EXISTS "Duenos pueden borrar fotos de inventario" ON storage.objects;
CREATE POLICY "Duenos pueden borrar fotos de inventario" ON storage.objects
FOR DELETE USING (
    bucket_id = 'inventario' 
    AND (auth.uid() = owner OR auth.uid() IN (SELECT id FROM public.perfiles WHERE rol_id = 1))
);

-- 3. ACTUALIZACIÓN DE LA TABLA INVENTARIO
-- Añadimos la columna 'imagenes' como JSONB para soportar múltiples fotos del estado del elemento.
ALTER TABLE public.inventario 
ADD COLUMN IF NOT EXISTS imagenes JSONB DEFAULT '[]'::jsonb;
