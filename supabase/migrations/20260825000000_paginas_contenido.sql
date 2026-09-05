-- ==============================================================================
-- CMS ADMIN FASE 3: Tabla paginas_contenido (contenido administrable)
-- Fecha: 2026-08-25
-- Propósito: Páginas estáticas de "Acerca De" y "Lo Que Hacemos" en DB
-- ==============================================================================

CREATE TABLE IF NOT EXISTS paginas_contenido (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    categoria TEXT NOT NULL CHECK (categoria IN ('acerca-de', 'lo-que-hacemos')),
    slug TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    imagen TEXT,
    contenido TEXT,
    icono TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT true,
    es_padre BOOLEAN NOT NULL DEFAULT false,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(categoria, slug)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_paginas_contenido_categoria ON paginas_contenido(categoria);
CREATE INDEX IF NOT EXISTS idx_paginas_contenido_slug ON paginas_contenido(slug);
CREATE INDEX IF NOT EXISTS idx_paginas_contenido_menu_item ON paginas_contenido(menu_item_id);

-- RLS
ALTER TABLE paginas_contenido ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "paginas_contenido_public_read"
    ON paginas_contenido FOR SELECT USING (true);

-- Escritura solo admin
CREATE POLICY "paginas_contenido_admin_write"
    ON paginas_contenido FOR ALL
    USING (es_admin_sitio())
    WITH CHECK (es_admin_sitio());

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_paginas_contenido_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_paginas_contenido_updated_at
    BEFORE UPDATE ON paginas_contenido
    FOR EACH ROW
    EXECUTE FUNCTION update_paginas_contenido_updated_at();
