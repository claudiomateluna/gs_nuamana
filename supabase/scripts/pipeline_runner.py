import os
import sys
import json
import re
import subprocess
from datetime import datetime

STATE_FILE = os.path.join(os.path.dirname(__file__), "pipeline_state.json")
SCRIPTS_DIR = os.path.dirname(__file__)
sys.path.append(SCRIPTS_DIR)

# Mapeo oficial de Categorías a IDs
CATEGORY_MAP = {
    # Actividades
    "juego": 7,
    "dinámica": 10,
    "juego nocturno": 9,
    "juego democrático": 8,
    "talleres": 11,
    # Administrativos
    "información": 13,
    "apoderados": 12,
    # Historia
    "historia scout": 15,
    "historias de scouts": 16,
    "biografías": 14,
    # Técnicas
    "animación": 17,
    "cabuyería": 18,
    "campismo": 19,
    "claves y pistas": 20,
    "cocina": 21,
    "pionerismo": 22,
    "primeros auxilios": 23,
    # Otros
    "reflexión": 6,
    "ciudadanía": 5
}

def load_state():
    if not os.path.exists(STATE_FILE):
        print("Error: Pipeline state file does not exist. Initialize it first using 'init [url]'.")
        sys.exit(1)
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def init_pipeline(url, estimated_type="Actividad"):
    state = {
        "url": url,
        "tipo_estimado": estimated_type,
        "status": "extraction_pending",
        "extractor_output": None,
        "concordance_output": None,
        "evaluator_output": None,  # Bypassed for non-activities
        "image_output": None,
        "database_inserted": False
    }
    save_state(state)
    print(f"[OK] Pipeline initialized for URL: {url} ({estimated_type})")
    print(f"State saved to: {STATE_FILE}")

def save_step(step_name, data_file):
    if not os.path.exists(data_file):
        print(f"Error: Data file '{data_file}' not found.")
        sys.exit(1)
        
    with open(data_file, "r", encoding="utf-8") as f:
        try:
            step_data = json.load(f)
        except Exception as e:
            print(f"Error parsing JSON data from '{data_file}': {e}")
            sys.exit(1)
            
    state = load_state()
    
    if step_name == "extractor":
        state["extractor_output"] = step_data
        state["status"] = "concordance_pending"
    elif step_name == "concordance":
        state["concordance_output"] = step_data
        # If it's not an activity, we bypass the curriculum evaluator
        tipo = step_data.get("tipo", "").lower()
        if tipo != "actividad":
            state["status"] = "image_pending"
            print("   [INFO] Non-activity type detected. Bypassing curricular evaluation step.")
        else:
            state["status"] = "evaluation_pending"
    elif step_name == "evaluator":
        state["evaluator_output"] = step_data
        state["status"] = "image_pending"
    else:
        print(f"Error: Unknown step name '{step_name}'. Use extractor|concordance|evaluator.")
        sys.exit(1)
        
    save_state(state)
    print(f"[OK] Step '{step_name}' saved successfully. Status: {state['status']}")

def show_status():
    if not os.path.exists(STATE_FILE):
        print("No active pipeline state found.")
        return
    state = load_state()
    print("\n=== PIPELINE STATUS ===")
    print(f"URL: {state['url']}")
    print(f"Tipo Estimado: {state['tipo_estimado']}")
    print(f"Status: {state['status']}")
    print("-----------------------")
    print(f"Extractor output:   {'✅ LOADED' if state['extractor_output'] else '❌ PENDING'}")
    print(f"Concordance output: {'✅ LOADED' if state['concordance_output'] else '❌ PENDING'}")
    print(f"Evaluator output:   {'✅ LOADED' if state['evaluator_output'] else '❌ PENDING' if state['tipo_estimado'].lower() == 'actividad' else '➖ BYPASSED'}")
    print(f"Image output:       {'✅ LOADED' if state['image_output'] else '❌ PENDING'}")
    print(f"Database local:     {'✅ INSERTED' if state['database_inserted'] else '❌ PENDING'}")
    print("=======================\n")

def process_pipeline_image(base_image_path):
    state = load_state()
    
    # We use concordance output as the source for title/subtipo
    data = state.get("concordance_output")
    if not data:
        print("Error: Concordance output not found. Process previous steps first.")
        sys.exit(1)
        
    title = data.get("titulo_reescrito", "").strip()
    subtipo = data.get("subtipo", "").strip().lower()
    
    # Capitalize category properly for the banner text
    category_name = subtipo
    for k, v in CATEGORY_MAP.items():
        if k == subtipo:
            category_name = k.title()
            break
            
    print(f"Processing image for '{title}' (Banner text: {category_name})...")
    
    # Call composite_images.py process_image and upload_to_supabase
    try:
        from composite_images import process_image, upload_to_supabase
    except ImportError as e:
        print(f"Error importing composite_images module: {e}")
        sys.exit(1)
        
    processed_path = process_image(base_image_path, title, category_name)
    if not processed_path:
        print("Error composing image layer.")
        sys.exit(1)
        
    public_url = upload_to_supabase(processed_path)
    if not public_url:
        print("Error uploading image to Supabase Storage.")
        sys.exit(1)
        
    state["image_output"] = {
        "local_image_path": processed_path,
        "imagen_destacada_url": public_url
    }
    state["status"] = "sql_pending"
    save_state(state)
    print(f"[OK] Image output saved. URL: {public_url}")

def build_article_data():
    state = load_state()
    if not state["image_output"]:
        print("Error: Image processing is pending.")
        sys.exit(1)
        
    concordance = state["concordance_output"]
    evaluator = state["evaluator_output"]
    img_data = state["image_output"]
    
    tipo = concordance.get("tipo", "").strip().lower()
    subtipo = concordance.get("subtipo", "").strip().lower()
    title = concordance.get("titulo_reescrito", "").strip()
    slug = re_slugify(title)
    
    # 1. Resolve DB Category ID
    cat_id = CATEGORY_MAP.get(subtipo, CATEGORY_MAP.get(tipo, 13)) # fallback to Información
    
    # 2. Build metadata JSONB object
    metadata = {
        "imagen_destacada_url": img_data.get("imagen_destacada_url", "")
    }
    
    if tipo == "actividad":
        # Specific activity metadata fields
        metadata.update({
            "duracion": concordance["metadata_especifica"].get("duracion", ""),
            "cantidad": concordance["metadata_especifica"].get("cantidad", ""),
            "lugares": concordance["metadata_especifica"].get("lugares", []),
            "materiales": concordance.get("materiales", []),
            "variaciones": concordance.get("variaciones", ""),
            "recomendaciones": concordance.get("recomendaciones", ""),
            "objetivos": concordance.get("objetivos_generales", []),
            "areas": [a.lower() for a in evaluator.get("areas_desarrollo", [])] if evaluator else [],
            "justificacion_areas": evaluator.get("justificacion_areas", "") if evaluator else "",
            "unidades": list(set([obj.get("unidad", "").lower() for obj in evaluator.get("objetivos_educativos", []) if obj.get("unidad")])) if evaluator else [],
            "objetivos_educativos": []
        })
        if evaluator:
            for obj in evaluator.get("objetivos_educativos", []):
                metadata["objetivos_educativos"].append({
                    "id": obj.get("id"),
                    "area": obj.get("area"),
                    "texto": obj.get("texto"),
                    "unidad": obj.get("unidad"),
                    "como_se_cumple": obj.get("como_se_cumple")
                })
    elif subtipo == "biografías":
        # Specific Biography metadata
        metadata.update({
            "lugar_nacimiento": concordance["metadata_especifica"].get("lugar_nacimiento", ""),
            "pais_nacimiento": concordance["metadata_especifica"].get("pais_nacimiento", ""),
            "fecha_nacimiento": concordance["metadata_especifica"].get("fecha_nacimiento", "")
        })
    elif subtipo == "historia scout" or subtipo == "historias de scouts":
        # Specific History metadata
        metadata.update({
            "lugar_hecho": concordance["metadata_especifica"].get("lugar_hecho", ""),
            "pais_hecho": concordance["metadata_especifica"].get("pais_hecho", ""),
            "anio_hecho": concordance["metadata_especifica"].get("anio_hecho", "")
        })
    else:
        # General / Technique metadata fallback
        metadata.update({
            "materiales": concordance.get("materiales", []),
            "variaciones": concordance.get("variaciones", ""),
            "recomendaciones": concordance.get("recomendaciones", "")
        })
        
    return {
        "slug": slug,
        "title": title,
        "desc": concordance.get("descripcion_reescrita", ""),
        "cat_id": cat_id,
        "metadata": metadata,
        "tipo": tipo
    }

def generate_local_sql():
    art_data = build_article_data()
    slug = art_data["slug"]
    title = art_data["title"]
    desc = art_data["desc"]
    cat_id = art_data["cat_id"]
    metadata = art_data["metadata"]
    tipo = art_data["tipo"]
    
    title_esc = title.replace("'", "''")
    desc_esc = desc.replace("'", "''")
    meta_json_str = json.dumps(metadata, ensure_ascii=False).replace("'", "''")
    
    # 1. Main article insert (ON CONFLICT DO NOTHING to prevent resets)
    sql_art = f"""
-- Insert article '{slug}'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  '{title_esc}',
  '{slug}',
  '{desc_esc}',
  'publicado',
  '{meta_json_str}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO NOTHING;
"""

    # 2. Category mapping insert
    sql_cat = f"""
-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, {cat_id}
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;
"""

    # 3. Mappings for educational objectives (activities only)
    sql_rel = ""
    if tipo == "actividad" and "objetivos_educativos" in metadata:
        sql_rel += "\n-- Map educational objectives\n"
        for obj in metadata["objetivos_educativos"]:
            obj_id = obj.get("id")
            csc_esc = obj.get("como_se_cumple", "").replace("'", "''")
            sql_rel += f"""
INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '{obj_id}', '{csc_esc}'
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
"""

    # Combine scripts
    full_sql = f"BEGIN;\n{sql_art}\n{sql_cat}\n{sql_rel}\nCOMMIT;"
    
    # Write to local file
    sql_path = os.path.join(SCRIPTS_DIR, f"insert_local_{slug}.sql")
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write(full_sql)
        
    print(f"\n[OK] Local SQL query generated and written to: {sql_path}")
    
    # Run locally via Docker
    print("Executing query on local Docker database (supabase_db_nuamana-local)...")
    cmd = [
        "docker", "exec", "-i", "supabase_db_nuamana-local", 
        "psql", "-U", "postgres", "-d", "postgres"
    ]
    try:
        result = subprocess.run(cmd, input=full_sql, capture_output=True, text=True, encoding="utf-8")
        if result.returncode == 0:
            print("   Database insertion successful!")
            print(result.stdout.strip())
            
            state = load_state()
            state["database_inserted"] = True
            state["status"] = "completed"
            save_state(state)
            
            # Print production output warning
            generate_prod_sql_file(art_data)
        else:
            print("   Database insertion failed!")
            print(result.stderr.strip())
    except Exception as e:
        print(f"   Failed to execute command: {e}")

def generate_prod_sql_file(art_data):
    slug = art_data["slug"]
    title = art_data["title"]
    desc = art_data["desc"]
    cat_id = art_data["cat_id"]
    metadata = art_data["metadata"]
    tipo = art_data["tipo"]
    
    title_esc = title.replace("'", "''")
    desc_esc = desc.replace("'", "''")
    meta_json_str = json.dumps(metadata, ensure_ascii=False).replace("'", "''")
    
    # 1. Main article insert (production safe)
    sql_art = f"""
-- Insert article '{slug}'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  '{title_esc}',
  '{slug}',
  '{desc_esc}',
  'publicado',
  '{meta_json_str}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO NOTHING;
"""

    # 2. Category mapping insert
    sql_cat = f"""
-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, {cat_id}
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;
"""

    # 3. Mappings for educational objectives (activities only)
    sql_rel = ""
    if tipo == "actividad" and "objetivos_educativos" in metadata:
        sql_rel += "\n-- Map educational objectives\n"
        for obj in metadata["objetivos_educativos"]:
            obj_id = obj.get("id")
            csc_esc = obj.get("como_se_cumple", "").replace("'", "''")
            sql_rel += f"""
INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '{obj_id}', '{csc_esc}'
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
"""

    full_sql = f"BEGIN;\n{sql_art}\n{sql_cat}\n{sql_rel}\nCOMMIT;"
    
    prod_sql_path = os.path.join(SCRIPTS_DIR, f"production_insert_{slug}.sql")
    with open(prod_sql_path, "w", encoding="utf-8") as f:
        f.write(full_sql)
        
    print(f"\n[OK] Production SQL deployment script generated at: {prod_sql_path}")
    print("   To publish this article to production, you can execute this SQL script in the production db via the Supabase SQL editor.")

def re_slugify(title):
    t = title.lower()
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ñ': 'n', 'ü': 'u'
    }
    for k, v in replacements.items():
        t = t.replace(k, v)
    t = re.sub(r'[^a-z0-9\s]', '', t)
    t = re.sub(r'\s+', '-', t).strip()
    return t

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python pipeline_runner.py init [url] [estimated_type]")
        print("  python pipeline_runner.py save [step_name] [json_file]")
        print("  python pipeline_runner.py image [base_image_path]")
        print("  python pipeline_runner.py sql")
        print("  python pipeline_runner.py status")
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    if cmd == "init":
        url = sys.argv[2]
        est_type = sys.argv[3] if len(sys.argv) > 3 else "Actividad"
        init_pipeline(url, est_type)
    elif cmd == "save":
        if len(sys.argv) < 4:
            print("Error: Provide the step name (extractor|concordance|evaluator) and JSON data file path.")
            sys.exit(1)
        save_step(sys.argv[2], sys.argv[3])
    elif cmd == "image":
        if len(sys.argv) < 3:
            print("Error: Provide the path of the base illustration image.")
            sys.exit(1)
        process_pipeline_image(sys.argv[2])
    elif cmd == "sql":
        generate_local_sql()
    elif cmd == "status":
        show_status()
    else:
        print(f"Error: Unknown command '{cmd}'.")
        sys.exit(1)
