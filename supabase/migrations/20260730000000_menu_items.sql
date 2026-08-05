-- ==============================================================================
-- CMS ADMIN FASE 2: Tabla menu_items (navegación administrable)
-- Fecha: 2026-07-30
-- Propósito: Menú lateral editable desde /administracion
-- ==============================================================================

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    href TEXT,
    icono TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_orden ON menu_items(orden);

-- RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "menu_items_public_read"
    ON menu_items FOR SELECT USING (true);

-- Escritura solo admin (reutiliza es_admin_sitio())
CREATE POLICY "menu_items_admin_write"
    ON menu_items FOR ALL
    USING (es_admin_sitio())
    WITH CHECK (es_admin_sitio());

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_menu_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_menu_items_updated_at();

-- ==============================================================================
-- SEED: Menú actual hardcodeado → datos en DB
-- ==============================================================================

-- Nivel principal (parent_id = NULL)
INSERT INTO menu_items (id, titulo, href, icono, orden) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Inicio',       '/',          'IconoInicio',     1),
  ('a0000000-0000-0000-0000-000000000002', 'Acerca de',    NULL,         'IconoAcercaDe',   2),
  ('a0000000-0000-0000-0000-000000000003', 'Lo que hacemos', NULL,       'IconoLoQueHacemos', 3),
  ('a0000000-0000-0000-0000-000000000004', 'Blog',         '/blog',      'IconoBlog',       4),
  ('a0000000-0000-0000-0000-000000000005', 'Nuestras Unidades', NULL,   'IconoUnidades',   5);

-- Submenú: Acerca de
INSERT INTO menu_items (parent_id, titulo, href, icono, orden) VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Quiénes Somos',            '/acerca-de/quienes-somos',             'IconoAcercaDeQuienesSomos', 1),
  ('a0000000-0000-0000-0000-000000000002', 'Nuestra Historia',         '/acerca-de/nuestra-historia',          'IconoAcercaDeNuestraHistoria', 2),
  ('a0000000-0000-0000-0000-000000000002', 'Misión y Visión',          '/acerca-de/mision-y-vision',           'IconoAcercaDeMisionVision', 3),
  ('a0000000-0000-0000-0000-000000000002', 'Nuestro Equipo',           '/acerca-de/nuestro-equipo',            'IconoAcercaDeNuestroEquipo', 4),
  ('a0000000-0000-0000-0000-000000000002', 'Nuestros Apoderados',      '/acerca-de/nuestros-apoderados',       'IconoAcercaDeNuestrosApoderados', 5),
  ('a0000000-0000-0000-0000-000000000002', 'Institución Patrocinante', '/acerca-de/institucion-patrocinante',  'IconoAcercaDeInstitucionPatrocinante', 6);

-- Submenú: Lo que hacemos
INSERT INTO menu_items (parent_id, titulo, href, icono, orden) VALUES
  ('a0000000-0000-0000-0000-000000000003', 'Ley y Promesa',             '/lo-que-hacemos/ley-y-promesa',          'IconoLoQueHacemos', 1),
  ('a0000000-0000-0000-0000-000000000003', 'El Método Scout',           '/lo-que-hacemos/el-metodo-scout',        'IconoLoQueHacemosMetodoScout', 2),
  ('a0000000-0000-0000-0000-000000000003', 'Aprender Haciendo',         '/lo-que-hacemos/aprender-haciendo',      'IconoLoQueHacemosAprenderHaciendo', 3),
  ('a0000000-0000-0000-0000-000000000003', 'Sistema de Equipos',        '/lo-que-hacemos/sistema-de-equipos',     'IconoLoQueHacemosSistemaEquipos', 4),
  ('a0000000-0000-0000-0000-000000000003', 'Vida al Aire Libre',        '/lo-que-hacemos/vida-al-aire-libre',     'IconoLoQueHacemosAireLibre', 5),
  ('a0000000-0000-0000-0000-000000000003', 'Habilidades y Técnicas',    '/lo-que-hacemos/habilidades-y-tecnicas', 'IconoLoQueHacemosHabilidadesTecnicas', 6),
  ('a0000000-0000-0000-0000-000000000003', 'Vida Reflexiva',            '/lo-que-hacemos/vida-reflexiva',         'IconoLoQueHacemosVidaReflexiva', 7),
  ('a0000000-0000-0000-0000-000000000003', 'Programa y Actividades',    '/lo-que-hacemos/programa-y-actividades', 'IconoLoQueHacemosProgramasActividades', 8);

-- Submenú: Unidades
INSERT INTO menu_items (parent_id, titulo, href, icono, orden) VALUES
  ('a0000000-0000-0000-0000-000000000005', 'Manada (Ahi Niho Vænga)',    '/unidad/manada',    '/images/logos/iconos_lobatos.svg', 1),
  ('a0000000-0000-0000-0000-000000000005', 'Compañía (Põ Vui Vaikava)',  '/unidad/compania',  '/images/logos/iconos_guias.svg', 2),
  ('a0000000-0000-0000-0000-000000000005', 'Tropa (A''ata)',             '/unidad/tropa',     '/images/logos/iconos_scouts.svg', 3),
  ('a0000000-0000-0000-0000-000000000005', 'Avanzada (Rapahango)',       '/unidad/avanzada',  '/images/logos/iconos_pioneres.svg', 4),
  ('a0000000-0000-0000-0000-000000000005', 'Clan (Ahu Akivi)',           '/unidad/clan',      '/images/logos/iconos_caminantes.svg', 5);
