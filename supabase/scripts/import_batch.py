# -*- coding: utf-8 -*-
import os
import sys
import json
import re
import csv
import time
import subprocess

# Ensure UTF-8 on Windows terminal
if sys.platform.startswith("win"):
    import codecs
    sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
    sys.stderr = codecs.getwriter("utf-8")(sys.stderr.detach())

SCRIPTS_DIR = os.path.dirname(__file__)
sys.path.append(SCRIPTS_DIR)

# Import the pre-processed data
try:
    from games_data import GAMES_DATA
except ImportError as e:
    print(f"Error importing games_data.py: {e}")
    sys.exit(1)

# Import composite functions
try:
    from composite_images import process_image, upload_to_supabase
except ImportError as e:
    print(f"Error importing composite_images.py: {e}")
    sys.exit(1)

# Load database category mapping
CATEGORY_MAP = {
    "juego": 7,
    "dinámica": 10,
    "juego nocturno": 9,
    "juego democrático": 8,
    "talleres": 11,
    "información": 13,
    "apoderados": 12,
    "historia scout": 15,
    "historias de scouts": 16,
    "biografías": 14,
    "animación": 17,
    "cabuyería": 18,
    "campismo": 19,
    "claves y pistas": 20,
    "cocina": 21,
    "pionerismo": 22,
    "primeros auxilios": 23,
    "reflexión": 6,
    "ciudadanía": 5
}

# Image paths mapping based on category
IMAGE_MAP = {
    "juego": "juegos_base.jpg",
    "dinámica": "dinamicas_base.jpg",
    "juego nocturno": "nocturnos_base.jpg",
    "juego democrático": "juegos_base.jpg",
    "talleres": "dinamicas_base.jpg"
}

def load_objectives():
    csv_path = os.path.join(SCRIPTS_DIR, "progresion_objetivos.csv")
    objectives = []
    if not os.path.exists(csv_path):
        print(f"Warning: progress_objectives.csv not found at {csv_path}. Dynamic matching will be limited.")
        return objectives
        
    with open(csv_path, "r", encoding="utf-16") as f:
        reader = csv.DictReader(f)
        for row in reader:
            objectives.append(row)
    return objectives

def find_objective_uuid(objectives, unidad, area, keyword):
    # Normalize inputs
    unidad_norm = unidad.lower().strip()
    area_norm = area.lower().strip()
    kw_norm = keyword.lower().strip()
    
    # 1. Exact match search
    for obj in objectives:
        obj_unit = obj.get("unidad_nombre", "").lower().strip()
        obj_area = obj.get("area_nombre", "").lower().strip()
        obj_text_inf = obj.get("texto_infantil", "").lower().strip()
        obj_text_term = obj.get("texto_terminal", "").lower().strip()
        
        # Match unit (with Tropa/Compañía equivalence)
        unit_match = (obj_unit == unidad_norm) or (unidad_norm == "tropa" and obj_unit == "tropa") or (unidad_norm == "compañía" and obj_unit == "compañía")
        
        if unit_match and obj_area == area_norm:
            if kw_norm in obj_text_inf or kw_norm in obj_text_term:
                return obj.get("id"), obj.get("texto_infantil", obj.get("texto_terminal", ""))
                
    # 2. Fallback to first objective in that area and unit if keyword match fails
    for obj in objectives:
        obj_unit = obj.get("unidad_nombre", "").lower().strip()
        obj_area = obj.get("area_nombre", "").lower().strip()
        unit_match = (obj_unit == unidad_norm) or (unidad_norm == "tropa" and obj_unit == "tropa")
        if unit_match and obj_area == area_norm:
            print(f"   [WARN] Keyword '{keyword}' not found in {unidad}/{area}. Falling back to objective ID {obj.get('id')}.")
            return obj.get("id"), obj.get("texto_infantil", obj.get("texto_terminal", ""))
            
    # 3. Hard fallback default
    return "00000000-0000-0000-0000-000000000000", "Objetivo General de Desarrollo"

def clean_sql_string(s):
    return s.replace("'", "''")

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

def execute_local_sql(sql):
    cmd = [
        "docker", "exec", "-i", "supabase_db_nuamana-local", 
        "psql", "-U", "postgres", "-d", "postgres"
    ]
    try:
        result = subprocess.run(cmd, input=sql, capture_output=True, text=True, encoding="utf-8")
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def run_batch():
    print(f"=== STARTING BATCH IMPORT OF {len(GAMES_DATA)} ACTIVITIES ===")
    objectives = load_objectives()
    
    success_count = 0
    start_time = time.time()
    
    for index, game in enumerate(GAMES_DATA):
        title = game["titulo_reescrito"]
        slug = re_slugify(title)
        subtipo = game["subtipo"].lower()
        print(f"\n[{index+1}/{len(GAMES_DATA)}] Processing '{title}' (slug: {slug})...")
        
        # 1. Resolve Category ID
        cat_id = CATEGORY_MAP.get(subtipo, 7) # Default to Juego (7)
        
        # 2. Select appropriate base image
        base_img_name = game.get("base_image", "juegos_base.jpg")
        base_img_path = os.path.join(SCRIPTS_DIR, base_img_name)
        
        # 3. Compile and compose graphic WebP cover
        category_title = subtipo.title()
        processed_img_path = process_image(base_img_path, title, category_title)
        
        image_url = None
        if processed_img_path:
            image_url = upload_to_supabase(processed_img_path)
            
        if not image_url:
            # Fallback URL format if storage upload fails
            image_url = f"http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/{slug}.webp"
            print(f"   [INFO] Storage upload skipped/failed. Using fallback public URL: {image_url}")
            
        # 4. Resolve objectives to real UUIDs from CSV
        resolved_objs = []
        areas_set = set()
        unidades_set = set()
        
        for obj_req in game["objetivos_educativos"]:
            obj_id, obj_text = find_objective_uuid(objectives, obj_req["unidad"], obj_req["area"], obj_req["keyword"])
            resolved_objs.append({
                "id": obj_id,
                "area": obj_req["area"],
                "texto": obj_text,
                "unidad": obj_req["unidad"],
                "como_se_cumple": obj_req["como_se_cumple"]
            })
            areas_set.add(obj_req["area"].lower())
            unidades_set.add(obj_req["unidad"].lower())
            
        # 5. Build metadata object
        metadata = {
            "duracion": game["duracion"],
            "cantidad": game["cantidad"],
            "lugares": game["lugares"],
            "materiales": game["materiales"],
            "variaciones": game["variaciones"],
            "recomendaciones": game["recomendaciones"],
            "imagen_destacada_url": image_url,
            "areas": list(areas_set),
            "unidades": list(unidades_set),
            "objetivos": game.get("objetivos_generales", []),
            "objetivos_educativos": resolved_objs,
            "justificacion_areas": game.get("justificacion_areas", "")
        }
        
        # 6. Escape variables for SQL
        title_esc = clean_sql_string(title)
        desc_esc = clean_sql_string(game["descripcion_reescrita"])
        extracto_esc = clean_sql_string(game.get("extracto", ""))
        meta_json_str = json.dumps(metadata, ensure_ascii=False).replace("'", "''")
        
        # 7. Generate Transactional SQL inserts
        sql_art = f"""
-- Insert article '{slug}'
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, imagen_destacada, extracto, metadata, autor_id)
VALUES (
  gen_random_uuid(),
  '{title_esc}',
  '{slug}',
  '{desc_esc}',
  'publicado',
  '{image_url}',
  '{extracto_esc}',
  '{meta_json_str}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO UPDATE SET 
  imagen_destacada = EXCLUDED.imagen_destacada, 
  extracto = EXCLUDED.extracto, 
  metadata = EXCLUDED.metadata;
"""

        sql_cat = f"""
-- Map article category
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, {cat_id}
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;
"""

        sql_rel = ""
        if resolved_objs:
            sql_rel += "\n-- Map educational objectives\n"
            for obj in resolved_objs:
                obj_id = obj["id"]
                csc_esc = clean_sql_string(obj["como_se_cumple"])
                sql_rel += f"""
INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '{obj_id}', '{csc_esc}'
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
"""

        full_sql = f"BEGIN;\n{sql_art}\n{sql_cat}\n{sql_rel}\nCOMMIT;"
        
        # 8. Save local SQL script file for review
        local_sql_path = os.path.join(SCRIPTS_DIR, f"insert_local_{slug}.sql")
        with open(local_sql_path, "w", encoding="utf-8") as f:
            f.write(full_sql)
            
        # 9. Execute locally in docker
        success, stdout, stderr = execute_local_sql(full_sql)
        if success:
            print(f"   [OK] Injected successfully into local DB!")
            success_count += 1
            
            # 10. Generate production deployment script
            prod_sql_path = os.path.join(SCRIPTS_DIR, f"production_insert_{slug}.sql")
            with open(prod_sql_path, "w", encoding="utf-8") as f:
                f.write(full_sql)
            print(f"   [OK] Production SQL script generated at: {prod_sql_path}")
        else:
            print(f"   [ERROR] Database insertion failed: {stderr}")
            
        # 11. Enforce the required 5-second delay to guarantee unique timestamps/IDs between consecutive insertions
        if index < len(GAMES_DATA) - 1:
            print("   Waiting 5 seconds for the next insertion to ensure unique timestamp sequence...")
            time.sleep(5)

    duration = time.time() - start_time
    print(f"\n=== BATCH PROCESS COMPLETED IN {duration:.2f} SECONDS ===")
    print(f"Successfully processed: {success_count}/{len(GAMES_DATA)} games.")
    print("All production deploy scripts are ready in supabase/scripts/")

if __name__ == "__main__":
    run_batch()
