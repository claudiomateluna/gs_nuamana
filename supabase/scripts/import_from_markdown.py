import os
import re
import json
import uuid
import subprocess
import csv
import io

# Paths configuration
SCRIPTS_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
ACTIVITIES_DIR = os.path.join(ROOT_DIR, "docs", "actividades")
UPLOADED_IMAGES_JSON = os.path.join(SCRIPTS_DIR, "uploaded_images.json")
OUTPUT_SQL_FILE = os.path.join(ROOT_DIR, "supabase", "migrations", "20260713000001_insert_14_activities.sql")

SLUG_CATEGORY_MAP = {
    "pelea-de-gallos": {"id": 7, "name": "Juegos"},
    "pelea-de-cangrejos": {"id": 7, "name": "Juegos"},
    "la-batalla-de-globos": {"id": 7, "name": "Juegos"},
    "granjeros-y-cerditos": {"id": 7, "name": "Juegos"},
    "el-sendero-del-cuidado": {"id": 10, "name": "Dinámicas"},
    "el-nido-de-los-recuerdos": {"id": 10, "name": "Dinámicas"},
    "caceria-de-osos": {"id": 9, "name": "Juegos Nocturnos"},
    "el-inobservable": {"id": 9, "name": "Juegos Nocturnos"},
    "el-matamoscas-en-cadena": {"id": 7, "name": "Juegos"},
    "el-asalto-a-las-cuatro-colinas": {"id": 9, "name": "Juegos Nocturnos"},
    "la-captura-de-las-serpientes": {"id": 7, "name": "Juegos"},
    "el-mural-colectivo": {"id": 10, "name": "Dinámicas"},
    "los-mensajeros-de-la-selva": {"id": 7, "name": "Juegos"},
    "el-desafio-de-los-magos-de-teis": {"id": 7, "name": "Juegos"}
}

def get_objectives_db():
    print("Fetching progression objectives catalog from database via Docker...")
    cmd = [
        "docker", "exec", "-t", "supabase_db_nuamana-local", 
        "psql", "-U", "postgres", "-d", "postgres", 
        "-c", "COPY (SELECT id, texto_infantil, unidad_id FROM public.progresion_objetivos) TO STDOUT WITH CSV HEADER;"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        print(f"Error fetching objectives: {result.stderr}")
        return {}
        
    output = result.stdout.replace("\r\n", "\n")
    reader = csv.DictReader(io.StringIO(output))
    mapping = {}
    for row in reader:
        text = row["texto_infantil"].strip().lower()
        mapping[text] = row["id"]
    return mapping

def parse_list(match_text):
    if not match_text:
        return []
    # Split by comma, strip quotes and whitespace
    items = []
    for item in match_text.split(","):
        cleaned = item.strip().strip('"').strip("'")
        if cleaned:
            items.append(cleaned)
    return items

def extract_section(body, heading_name):
    # Matches heading like '## 📝 Descripción' or '## Descripción' and extracts content until the next heading.
    # [^\n]* allows additional characters on the heading line.
    pattern = rf"^##\s*(?:[^\n]*?)\s*{re.escape(heading_name)}[^\n]*\n(.*?)(?=\n##|\Z)"
    match = re.search(pattern, body, re.DOTALL | re.MULTILINE | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""

def parse_objectives_table(table_text):
    objectives = []
    if not table_text:
        return objectives
        
    lines = table_text.strip().split("\n")
    for line in lines:
        if not line.strip() or line.startswith("| :---") or line.startswith("| Unidad |") or line.startswith("| ---"):
            continue
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 5:
            unidad = parts[1]
            area = parts[2]
            obj_text = parts[3]
            como_se_cumple = parts[4]
            
            # Extract explicit ID if present (e.g. (ID: uuid))
            id_match = re.search(r"\(ID:\s*`?([a-f0-9-]+)`?\)", obj_text)
            obj_id = id_match.group(1) if id_match else None
            
            # Clean objective text
            clean_obj_text = re.sub(r"\(ID:\s*`?[a-f0-9-]+`?\)", "", obj_text).strip()
            
            objectives.append({
                "unidad": unidad,
                "area": area,
                "texto": clean_obj_text,
                "como_se_cumple": como_se_cumple,
                "id": obj_id
            })
    return objectives

def main():
    print("Reading uploaded images catalog...")
    if os.path.exists(UPLOADED_IMAGES_JSON):
        with open(UPLOADED_IMAGES_JSON, "r", encoding="utf-8") as f:
            images_map = json.load(f)
    else:
        images_map = {}
        print("Warning: uploaded_images.json not found. No image URLs will be set.")
        
    objectives_db = get_objectives_db()
    
    sql_inserts = []
    sql_inserts.append("-- SQL Migration script for batch importing Nua Mana Scout Activities\n")
    sql_inserts.append("BEGIN;\n")
    sql_inserts.append("-- Disable triggers in this session to prevent notification spam\n")
    sql_inserts.append("SET session_replication_role = 'replica';\n")
    
    activities_processed = 0
    
    # Process each markdown file in the folder
    for filename in sorted(os.listdir(ACTIVITIES_DIR)):
        if not filename.endswith(".md"):
            continue
            
        slug = filename[:-3]
        file_path = os.path.join(ACTIVITIES_DIR, filename)
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Parse Frontmatter
        fm_match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
        if not fm_match:
            print(f"Error: Frontmatter not found in {filename}")
            continue
            
        frontmatter = fm_match.group(1)
        body = content.split("---", 2)[-1].strip()
        
        # Parse frontmatter fields
        title_match = re.search(r"^titulo:\s*[\"']?(.*?)[\"']?\s*$", frontmatter, re.MULTILINE)
        title = title_match.group(1) if title_match else ""
        
        tipo_match = re.search(r"^tipo:\s*[\"']?(.*?)[\"']?\s*$", frontmatter, re.MULTILINE)
        tipo = tipo_match.group(1) if tipo_match else "dinámica"
        
        duracion_match = re.search(r"^duracion:\s*[\"']?(.*?)[\"']?\s*$", frontmatter, re.MULTILINE)
        duracion = duracion_match.group(1) if duracion_match else ""
        
        cantidad_match = re.search(r"^cantidad:\s*[\"']?(.*?)[\"']?\s*$", frontmatter, re.MULTILINE)
        cantidad = cantidad_match.group(1) if cantidad_match else ""
        
        # Lists
        lugares_match = re.search(r"^lugares:\s*\[(.*?)\]", frontmatter, re.MULTILINE)
        lugares = parse_list(lugares_match.group(1) if lugares_match else "")
        
        unidades_match = re.search(r"^unidades:\s*\[(.*?)\]", frontmatter, re.MULTILINE)
        unidades = parse_list(unidades_match.group(1) if unidades_match else "")
        
        areas_match = re.search(r"^areas_desarrollo:\s*\[(.*?)\]", frontmatter, re.MULTILINE)
        areas = parse_list(areas_match.group(1) if areas_match else "")
        
        obj_gen_match = re.search(r"^objetivos_generales:\s*\[(.*?)\]", frontmatter, re.MULTILINE)
        objetivos_generales = parse_list(obj_gen_match.group(1) if obj_gen_match else "")
        
        materiales_match = re.search(r"^materiales:\s*\[(.*?)\]", frontmatter, re.MULTILINE)
        materiales = parse_list(materiales_match.group(1) if materiales_match else "")
        
        # Parse sections from Markdown body
        desc = extract_section(body, "Descripción")
        variaciones = extract_section(body, "Variaciones")
        reco = extract_section(body, "Recomendaciones")
        justificacion = extract_section(body, "Justificación Pedagógica de Áreas")
        
        # Parse table of objectives
        table_text = extract_section(body, "Objetivos Educativos")
        objectives = parse_objectives_table(table_text)
        
        # Resolve objectives UUID
        resolved_objs = []
        for obj in objectives:
            obj_id = obj["id"]
            if not obj_id:
                # Resolve via live DB catalog lookup
                clean_text = obj["texto"].strip().lower()
                obj_id = objectives_db.get(clean_text)
                if not obj_id:
                    print(f"Warning: Objective not found in DB for text: '{obj['texto']}' (Activity: {title})")
                    continue
                    
            resolved_objs.append({
                "id": obj_id,
                "area": obj["area"],
                "texto": obj["texto"],
                "unidad": obj["unidad"],
                "como_se_cumple": obj["como_se_cumple"]
            })
            
        image_url = images_map.get(slug, "")
        
        # Prepare article UUID
        art_id = str(uuid.uuid4())
        
        # Compile metadata
        meta = {
            "areas": [a.lower() for a in areas],
            "lugares": lugares,
            "cantidad": cantidad,
            "duracion": duracion,
            "unidades": [u.lower() for u in unidades if u],
            "objetivos": objetivos_generales,
            "materiales": materiales,
            "variaciones": variaciones,
            "recomendaciones": reco,
            "justificacion_areas": justificacion,
            "imagen_destacada_url": image_url,
            "objetivos_educativos": resolved_objs
        }
        
        # Generate clean excerpt from description (first 160 chars, remove markdown formats)
        clean_desc = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', desc)  # remove markdown links
        clean_desc = re.sub(r'[\*_#`]', '', clean_desc)       # remove markdown symbols
        clean_desc = re.sub(r'\s+', ' ', clean_desc).strip()   # normalize spaces
        excerpt = clean_desc[:160] + "..." if len(clean_desc) > 160 else clean_desc
        excerpt_escaped = excerpt.replace("'", "''")

        # Escape characters for SQL insertion
        title_escaped = title.replace("'", "''")
        desc_escaped = desc.replace("'", "''")
        meta_json_str = json.dumps(meta, ensure_ascii=False).replace("'", "''")
        
        sql_inserts.append(f"\n-- Inserting activity: {title}")
        sql_inserts.append(f"""INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '{art_id}',
  '{title_escaped}',
  '{slug}',
  '{desc_escaped}',
  'publicado',
  '{meta_json_str}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  '{image_url}',
  '{excerpt_escaped}'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;
""")
        
        # Category mapping insertion
        cat_info = SLUG_CATEGORY_MAP.get(slug)
        if cat_info:
            cat_id = cat_info["id"]
            sql_inserts.append(f"""INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, {cat_id}
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;
""")
        
        # Intermediate mappings using dynamic resolution based on slug
        for obj in resolved_objs:
            obj_id = obj["id"]
            csc_escaped = obj["como_se_cumple"].replace("'", "''")
            sql_inserts.append(f"""INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '{obj_id}', '{csc_escaped}'
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
""")
            
        activities_processed += 1
        print(f"Compiled: '{title}' ({len(resolved_objs)} objectives, image={bool(image_url)})")

    sql_inserts.append("\n-- Restore triggers in this session\n")
    sql_inserts.append("SET session_replication_role = 'origin';\n")
    sql_inserts.append("COMMIT;\n")
    
    with open(OUTPUT_SQL_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_inserts))
        
    print(f"\nMigration script compiled successfully! Processed {activities_processed} activities.")
    print(f"Output SQL: {OUTPUT_SQL_FILE}")

if __name__ == "__main__":
    main()
