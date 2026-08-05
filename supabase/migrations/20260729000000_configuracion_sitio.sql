-- ==============================================================================
-- CMS ADMIN FASE 1: Tabla configuracion_sitio
-- Fecha: 2026-07-29
-- Propósito: Hacer configurable el contenido público del sitio sin tocar código
-- ==============================================================================

CREATE TABLE IF NOT EXISTS configuracion_sitio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    categoria TEXT NOT NULL,
    clave TEXT NOT NULL,
    valor JSONB NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(categoria, clave)
);

-- Índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_configuracion_sitio_categoria ON configuracion_sitio(categoria);

-- RLS
ALTER TABLE configuracion_sitio ENABLE ROW LEVEL SECURITY;

-- Lectura pública (cualquier usuario autenticado o anónimo puede leer)
CREATE POLICY "configuracion_sitio_public_read"
    ON configuracion_sitio
    FOR SELECT
    USING (true);

-- Escritura solo para admin (rol_id = 1)
-- Usamos una security definer function para verificar el rol
CREATE OR REPLACE FUNCTION es_admin_sitio()
RETURNS BOOLEAN AS $$
DECLARE
    user_rol_id INTEGER;
BEGIN
    SELECT p.rol_id INTO user_rol_id
    FROM perfiles p
    WHERE p.id = auth.uid()
    LIMIT 1;
    RETURN user_rol_id = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "configuracion_sitio_admin_write"
    ON configuracion_sitio
    FOR ALL
    USING (es_admin_sitio())
    WITH CHECK (es_admin_sitio());

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_configuracion_sitio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_configuracion_sitio_updated_at
    BEFORE UPDATE ON configuracion_sitio
    FOR EACH ROW
    EXECUTE FUNCTION update_configuracion_sitio_updated_at();
