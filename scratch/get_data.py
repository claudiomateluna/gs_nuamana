import subprocess
import json
import os

def run_query(query):
    # Executing psql command inside the container and capturing stdout
    cmd = [
        "docker", "exec", "-i", "supabase_db_nuamana-local",
        "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", query
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        print(f"Error executing query: {result.stderr}")
        return None
    return result.stdout.strip()

def main():
    os.makedirs("scratch", exist_ok=True)
    
    # 1. Get existing articles
    print("Fetching existing articles...")
    query_articles = "select json_agg(t) from (select id, titulo, slug from public.articulos) t"
    output = run_query(query_articles)
    if output:
        try:
            articles = json.loads(output)
            with open("scratch/articulos_existentes.json", "w", encoding="utf-8") as f:
                json.dump(articles, f, indent=2, ensure_ascii=False)
            print(f"Saved {len(articles)} articles to scratch/articulos_existentes.json")
        except Exception as e:
            print("Failed to parse articles JSON:", e)
            
    # 2. Get progression objectives
    print("Fetching progression objectives...")
    query_objectives = """
    select json_agg(t) from (
        select po.id, po.area_id, po.unidad_id, po.rango_edad, po.texto_infantil, po.texto_terminal,
               pa.nombre as area_nombre, u.nombre as unidad_nombre
        from public.progresion_objetivos po
        left join public.progresion_areas pa on po.area_id = pa.id
        left join public.unidades u on po.unidad_id = u.id
    ) t
    """
    output_obj = run_query(query_objectives)
    if output_obj:
        try:
            objectives = json.loads(output_obj)
            with open("scratch/progresion_objetivos.json", "w", encoding="utf-8") as f:
                json.dump(objectives, f, indent=2, ensure_ascii=False)
            print(f"Saved {len(objectives)} objectives to scratch/progresion_objetivos.json")
        except Exception as e:
            print("Failed to parse objectives JSON:", e)

if __name__ == "__main__":
    main()
