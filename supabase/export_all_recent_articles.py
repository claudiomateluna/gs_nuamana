import subprocess
import json

slugs = [
    'el-nido-de-los-recuerdos',
    'desafio-de-las-cuatro-colinas',
    'el-lavado-de-autos',
    'caza-de-panolines',
    'cazadores-de-serpientes',
    'el-abrazo-musical',
    'duelo-de-gallitos',
    'caza-globos',
    'cuatro-esquinas',
    'los-submarinos',
    'el-arbol-y-el-viento',
    'el-matamoscas',
    'el-juego-del-vampiro'
]

master_sql = ["SET client_encoding = 'UTF8';\n"]

for slug in slugs:
    # Query database for full article record
    sql_query = f"""
    SELECT 
      a.id,
      a.titulo,
      a.slug,
      a.contenido,
      a.extracto,
      a.imagen_destacada,
      a.estado,
      array_to_json(a.etiquetas)::text as etiquetas,
      a.metadata::text as metadata
    FROM articulos a
    WHERE a.slug = '{slug}';
    """
    
    cmd = ['docker', 'exec', '-i', 'supabase_db_nuamana-local', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c', sql_query]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    out = res.stdout.strip()
    if not out:
        print(f"WARNING: Article with slug {slug} not found in local DB!")
        continue

    parts = out.split('|')
    art_id = parts[0]
    titulo = parts[1]
    art_slug = parts[2]
    contenido = parts[3]
    extracto = parts[4]
    imagen_destacada = parts[5]
    estado = parts[6]
    etiquetas_raw = parts[7]
    metadata_raw = parts[8]

    # Query articulo_categorias
    cat_query = f"SELECT categoria_id FROM articulo_categorias WHERE articulo_id = '{art_id}';"
    cmd_cat = ['docker', 'exec', '-i', 'supabase_db_nuamana-local', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c', cat_query]
    res_cat = subprocess.run(cmd_cat, capture_output=True, text=True, encoding='utf-8')
    cat_ids = [c.strip() for c in res_cat.stdout.splitlines() if c.strip()]

    # Query articulo_objetivos_educativos
    obj_query = f"SELECT objetivo_id, como_se_cumple FROM articulo_objetivos_educativos WHERE articulo_id = '{art_id}';"
    cmd_obj = ['docker', 'exec', '-i', 'supabase_db_nuamana-local', 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-c', obj_query]
    res_obj = subprocess.run(cmd_obj, capture_output=True, text=True, encoding='utf-8')
    rel_objs = [l.strip().split('|') for l in res_obj.stdout.splitlines() if l.strip()]

    # Format etiquetas array for SQL
    etiquetas_list = json.loads(etiquetas_raw) if etiquetas_raw else []
    etiquetas_sql_arr = ", ".join(f"'{t}'" for t in etiquetas_list)

    # Build SQL block
    cat_inserts = "\n".join(f"  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, {cid}) ON CONFLICT DO NOTHING;" for cid in cat_ids)
    
    obj_inserts = ""
    if rel_objs:
        obj_lines = []
        for row in rel_objs:
            oid = row[0]
            csc = row[1].replace("'", "''") if len(row) > 1 else ""
            obj_lines.append(f"  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '{oid}', '{csc}') ON CONFLICT DO NOTHING;")
        obj_inserts = "\n" + "\n".join(obj_lines)

    article_sql = f"""-- ==============================================
-- ARTICLE: {titulo} ({art_slug})
-- ==============================================
DO $$
DECLARE
  v_admin_id UUID;
  v_articulo_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM perfiles WHERE rol_id = 1 LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM perfiles LIMIT 1;
  END IF;

  DELETE FROM articulos WHERE slug = '{art_slug}';

  v_articulo_id := uuid_generate_v4();

  INSERT INTO articulos (
    id,
    autor_id,
    categoria_id,
    titulo,
    slug,
    contenido,
    extracto,
    imagen_destacada,
    estado,
    etiquetas,
    metadata
  ) VALUES (
    v_articulo_id,
    v_admin_id,
    NULL,
    '{titulo.replace("'", "''")}',
    '{art_slug}',
    $html${contenido}$html$,
    '{extracto.replace("'", "''")}',
    '{imagen_destacada}',
    '{estado}',
    ARRAY[{etiquetas_sql_arr}],
    $json${metadata_raw}$json$::jsonb
  );

{cat_inserts}{obj_inserts}

END $$;
"""

    # Save individual file
    ind_path = f"supabase/scripts/production_insert_{art_slug}.sql"
    with open(ind_path, "w", encoding="utf-8") as f:
        f.write(article_sql)
    print(f"Exported individual: {ind_path}")

    master_sql.append(article_sql)

# Save master script
master_path = "supabase/scripts/deploy_production_from_el_nido.sql"
with open(master_path, "w", encoding="utf-8") as f:
    f.write("\n\n".join(master_sql))

print(f"\nSuccessfully generated master production deploy script with {len(slugs)} articles at:\n  {master_path}")
