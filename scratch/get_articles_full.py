import subprocess
import json
import os

def run_query(query):
    cmd = [
        "docker", "exec", "-i", "supabase_db_nuamana-local",
        "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", query
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return None
    return result.stdout.strip()

def main():
    print("Fetching all articles with content...")
    query = "select json_agg(t) from (select id, titulo, slug, contenido, metadata from public.articulos) t"
    output = run_query(query)
    if output:
        try:
            articles = json.loads(output)
            with open("scratch/articulos_completos.json", "w", encoding="utf-8") as f:
                json.dump(articles, f, indent=2, ensure_ascii=False)
            print(f"Saved {len(articles)} full articles to scratch/articulos_completos.json")
        except Exception as e:
            print("Failed to parse:", e)

if __name__ == "__main__":
    main()
