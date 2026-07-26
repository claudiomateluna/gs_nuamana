import subprocess
import json

cmd = ["docker", "exec", "-i", "supabase_db_nuamana-local", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", "SELECT metadata FROM articulos WHERE slug = 'el-nido-de-los-recuerdos';"]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
data = json.loads(res.stdout.strip())
print("Areas:", data.get("areas"))
print("Justificacion:", data.get("justificacion_areas"))
print("Objetivos educativos count:", len(data.get("objetivos_educativos", [])))
print("First objective:", json.dumps(data.get("objetivos_educativos")[0], ensure_ascii=False, indent=2))
