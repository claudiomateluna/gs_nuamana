import subprocess
import json

cmd = ["docker", "exec", "-i", "supabase_db_nuamana-local", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", "SELECT metadata->'objetivos_educativos' FROM articulos WHERE slug = 'el-juego-del-vampiro';"]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
objs = json.loads(res.stdout.strip())

ids = [o['id'] for o in objs]
ids_str = "','".join(ids)
sql2 = f"SELECT po.id, pa.nombre as area, u.nombre as unidad, po.texto_infantil FROM progresion_objetivos po JOIN progresion_areas pa ON po.area_id = pa.id JOIN unidades u ON po.unidad_id = u.id WHERE po.id IN ('{ids_str}');"

cmd2 = ["docker", "exec", "-i", "supabase_db_nuamana-local", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", sql2]
res2 = subprocess.run(cmd2, capture_output=True, text=True, encoding='utf-8')
found_lines = [l.strip() for l in res2.stdout.splitlines() if l.strip()]

print(f"Total requested: {len(ids)}, Total found in DB: {len(found_lines)}")
found_ids = set(l.split('|')[0] for l in found_lines)
missing = [o for o in objs if o['id'] not in found_ids]
print("\n--- MISSING / INVALID IDs ---")
for m in missing:
    print(f"  Unit: {m.get('unidad'):<10} | Area: {m.get('area'):<12} | ID: {m['id']} | {m['texto']}")
