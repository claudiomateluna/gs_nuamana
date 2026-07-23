-- Migration: Create acta_acuerdo_fichas junction table
-- Links group activity compromises (acta_acuerdos) to activity fichas (articulos)

CREATE TABLE IF NOT EXISTS acta_acuerdo_fichas (
  acuerdo_id UUID REFERENCES acta_acuerdos(id) ON DELETE CASCADE,
  articulo_id UUID REFERENCES articulos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (acuerdo_id, articulo_id)
);

-- Enable RLS
ALTER TABLE acta_acuerdo_fichas ENABLE ROW LEVEL SECURITY;

-- RLS policy: allow authenticated users to read
CREATE POLICY "Allow authenticated read" ON acta_acuerdo_fichas
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS policy: allow authenticated users to insert/delete
CREATE POLICY "Allow authenticated write" ON acta_acuerdo_fichas
  FOR ALL USING (auth.role() = 'authenticated');
