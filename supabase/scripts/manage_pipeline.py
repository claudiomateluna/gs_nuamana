import json
import re
import os
import sys

STATE_FILE = os.path.join(os.path.dirname(__file__), "pipeline_state.json")

def init_pipeline(url):
    state = {
        "url": url,
        "status": "extraction_pending",
        "extractor_output": None,
        "concordance_output": None,
        "evaluator_output": None,
        "rewriter_output": None
    }
    save_state(state)
    print(f"Pipeline initialized for URL: {url}")
    print(f"State saved to {STATE_FILE}")

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def load_state():
    if not os.path.exists(STATE_FILE):
        print("Error: Pipeline state file does not exist. Initialize it first using 'init [url]'.")
        sys.exit(1)
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

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
        state["status"] = "evaluation_pending"
    elif step_name == "evaluator":
        state["evaluator_output"] = step_data
        state["status"] = "rewriting_pending"
    elif step_name == "rewriter":
        state["rewriter_output"] = step_data
        state["status"] = "completed"
    else:
        print(f"Error: Unknown step name '{step_name}'.")
        sys.exit(1)
        
    save_state(state)
    print(f"Step '{step_name}' successfully saved. Current status: {state['status']}")

def show_status():
    state = load_state()
    print("--- PIPELINE STATUS ---")
    print(f"URL: {state['url']}")
    print(f"Status: {state['status']}")
    print("-----------------------")
    print(f"Extractor output: {'✅ LOADED' if state['extractor_output'] else '❌ PENDING'}")
    print(f"Concordance output: {'✅ LOADED' if state['concordance_output'] else '❌ PENDING'}")
    print(f"Evaluator output: {'✅ LOADED' if state['evaluator_output'] else '❌ PENDING'}")
    print(f"Rewriter output: {'✅ LOADED' if state['rewriter_output'] else '❌ PENDING'}")

def generate_markdown():
    state = load_state()
    if state["status"] != "completed" or not state["rewriter_output"]:
        print("Error: Pipeline is not completed yet. Current status:", state["status"])
        sys.exit(1)
        
    data = state["rewriter_output"]
    title = data.get("titulo_reescrito", "").strip()
    slug = re_slugify(title)
    
    # Format YAML Frontmatter
    frontmatter = {
        "titulo": title,
        "tipo": data.get("tipo", ""),
        "duracion": data.get("duracion", ""),
        "cantidad": data.get("cantidad", ""),
        "lugares": data.get("lugares", []),
        "unidades": data.get("unidades", []),
        "areas_desarrollo": data.get("areas_desarrollo", []),
        "objetivos_generales": data.get("objetivos_generales", []),
        "materiales": data.get("materiales", [])
    }
    
    # Compile markdown content
    md_content = "---\n"
    for k, v in frontmatter.items():
        if isinstance(v, list):
            md_content += f"{k}: {json.dumps(v, ensure_ascii=False)}\n"
        else:
            md_content += f"{k}: \"{v}\"\n"
    md_content += "---\n\n"
    
    md_content += f"# {title}\n\n"
    md_content += f"## 📝 Descripción\n{data.get('descripcion_reescrita', '')}\n\n"
    md_content += f"## 🔄 Variaciones\n{data.get('variaciones', '')}\n\n"
    md_content += f"## ⚠️ Recomendaciones\n{data.get('recomendaciones', '')}\n\n"
    md_content += f"## 🎯 Justificación Pedagógica de Áreas\n{data.get('justificacion_areas', '')}\n\n"
    
    md_content += "## 🎓 Objetivos Educativos y Evaluación (¿Cómo se cumple?)\n"
    md_content += "| Unidad | Área | Objetivo Educativo | ¿Cómo se cumple? |\n"
    md_content += "| :--- | :--- | :--- | :--- |\n"
    
    for obj in data.get("objetivos_educativos", []):
        unidad = obj.get("unidad", "")
        area = obj.get("area", "")
        texto = obj.get("texto", "")
        csc = obj.get("como_se_cumple", "")
        md_content += f"| {unidad} | {area} | {texto} | {csc} |\n"
        
    # Write to file in docs/actividades/
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "docs", "actividades")
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, f"{slug}.md")
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    print(f"\n✅ Markdown file generated successfully!")
    print(f"File created at: {output_file}")

def generate_sql():
    state = load_state()
    if state["status"] != "completed" or not state["rewriter_output"]:
        print("Error: Pipeline is not completed yet. Current status:", state["status"])
        sys.exit(1)
        
    data = state["rewriter_output"]
    
    # 1. Prepare article metadata object
    title = data.get("titulo_reescrito", "").strip()
    slug = re_slugify(title)
    
    # Format metadata json
    metadata = {
        "areas": [a.lower() for a in data.get("areas_desarrollo", [])],
        "lugares": data.get("lugares", []),
        "cantidad": data.get("cantidad", ""),
        "duracion": data.get("duracion", ""),
        "unidades": [u.lower() for u in data.get("unidades", []) if u],
        "objetivos": data.get("objetivos_generales", []),
        "materiales": data.get("materiales", []),
        "variaciones": data.get("variaciones", ""),
        "recomendaciones": data.get("recomendaciones", ""),
        "justificacion_areas": data.get("justificacion_areas", ""),
        "imagen_destacada_url": "",
        "objetivos_educativos": []
    }
    
    # Clean objectives list for JSONB
    for obj in data.get("objetivos_educativos", []):
        metadata["objetivos_educativos"].append({
            "id": obj.get("id"),
            "area": obj.get("area"),
            "texto": obj.get("texto"),
            "unidad": obj.get("unidad"),
            "como_se_cumple": obj.get("como_se_cumple")
        })
        
    # Escape quotes for SQL
    title_escaped = title.replace("'", "''")
    desc_escaped = data.get("descripcion_reescrita", "").replace("'", "''")
    meta_json_str = json.dumps(metadata, ensure_ascii=False).replace("'", "''")
    
    art_uuid_sql = "gen_random_uuid()"
    # Generate unique insert for articulos
    sql_art = f"""
-- Insert activity article
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id)
VALUES (
  {art_uuid_sql},
  '{title_escaped}',
  '{slug}',
  '{desc_escaped}',
  'publicado',
  '{meta_json_str}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f' -- Default system admin/author
)
ON CONFLICT (slug) DO NOTHING;
"""

    # Generate inserts for relation table
    sql_rel = "\n-- Insert intermediate educational objectives mappings\n"
    for obj in data.get("objetivos_educativos", []):
        obj_id = obj.get("id")
        csc_escaped = obj.get("como_se_cumple", "").replace("'", "''")
        
        sql_rel += f"""
INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '{obj_id}', '{csc_escaped}'
FROM public.articulos WHERE slug = '{slug}'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
"""

    output_sql_file = os.path.join(os.path.dirname(__file__), f"insert_activity_{slug}.sql")
    with open(output_sql_file, "w", encoding="utf-8") as f:
        f.write(sql_art)
        f.write(sql_rel)
        
    print(f"\n✅ SQL statements generated successfully!")
    print(f"SQL file created at: {output_sql_file}")
    print("You can run this file directly in your Postgres database.")

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
        print("  python manage_pipeline.py init [url]")
        print("  python manage_pipeline.py save [step_name] [json_file]")
        print("  python manage_pipeline.py status")
        print("  python manage_pipeline.py md")
        print("  python manage_pipeline.py sql")
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    if cmd == "init":
        if len(sys.argv) < 3:
            print("Error: Provide the target URL.")
            sys.exit(1)
        init_pipeline(sys.argv[2])
    elif cmd == "save":
        if len(sys.argv) < 4:
            print("Error: Provide the step name (extractor|concordance|evaluator|rewriter) and JSON data file path.")
            sys.exit(1)
        save_step(sys.argv[2], sys.argv[3])
    elif cmd == "status":
        show_status()
    elif cmd == "md":
        generate_markdown()
    elif cmd == "sql":
        generate_sql()
    else:
        print(f"Error: Unknown command '{cmd}'.")
        sys.exit(1)
