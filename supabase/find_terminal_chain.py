import subprocess
import json

sql = """SELECT json_build_object(
  'id', po.id,
  'unidad', u.nombre,
  'area', pa.nombre,
  'rango_edad', po.rango_edad,
  'texto_infantil', po.texto_infantil,
  'texto_terminal', po.texto_terminal
) FROM progresion_objetivos po
JOIN unidades u ON po.unidad_id = u.id
JOIN progresion_areas pa ON po.area_id = pa.id
WHERE po.texto_terminal ILIKE '%Vive su libertad%'
   OR po.texto_terminal ILIKE '%matrimonio y la familia%';"""

cmd = ["docker", "exec", "-i", "supabase_db_nuamana-local", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", sql]
res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
lines = [l.strip() for l in res.stdout.splitlines() if l.strip()]

from collections import defaultdict
chain = defaultdict(list)
for l in lines:
    if l.startswith('{'):
        r = json.loads(l)
        chain[r['texto_terminal']].append(r)

for term, items in chain.items():
    print(f"\n==========================================")
    print(f"TEXTO TERMINAL: {term}")
    print("==========================================")
    for it in sorted(items, key=lambda x: (x['unidad'], x['rango_edad'])):
        print(f"  Unidad: {it['unidad']:<10} | Rango: {it['rango_edad']:<20} | ID: {it['id']}")
        print(f"    -> {it['texto_infantil']}\n")
