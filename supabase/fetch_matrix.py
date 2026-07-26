import subprocess
import json

cmd = [
    "docker", "exec", "-i", "supabase_db_nuamana-local",
    "psql", "-U", "postgres", "-d", "postgres", "-t", "-A",
    "-c", "SELECT json_build_object('id', po.id, 'unidad', u.nombre, 'area', pa.nombre, 'rango_edad', po.rango_edad, 'texto_infantil', po.texto_infantil, 'texto_terminal', po.texto_terminal) FROM progresion_objetivos po JOIN unidades u ON po.unidad_id = u.id JOIN progresion_areas pa ON po.area_id = pa.id WHERE pa.nombre IN ('Sociabilidad', 'Afectividad', 'Carácter') AND u.nombre IN ('Manada', 'Tropa', 'Compañía', 'Avanzada');"
]

res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
lines = [line.strip() for line in res.stdout.splitlines() if line.strip()]
rows = [json.loads(line) for line in lines if line.startswith('{')]

from collections import defaultdict
grouped = defaultdict(list)
for r in rows:
    grouped[(r['unidad'], r['area'], r['texto_terminal'])].append(r)

# Find complete paired sets (where all age ranges of the unit are present)
complete_sets = {}
for (unidad, area, term), item_list in grouped.items():
    ranges = set(x['rango_edad'] for x in item_list)
    if unidad == 'Manada' and len(ranges) >= 2:
        complete_sets[(unidad, area)] = item_list
    elif unidad in ('Tropa', 'Compañía') and len(ranges) >= 2:
        complete_sets[(unidad, area)] = item_list
    elif unidad == 'Avanzada' and len(ranges) >= 1:
        complete_sets[(unidad, area)] = item_list

print("COMPLETE SETS FOUND:")
for (u, a), items in complete_sets.items():
    print(f"=== {u} - {a} (Items: {len(items)}) ===")
    for it in items:
        print(f"  [{it['rango_edad']}] ID: {it['id']} -> {it['texto_infantil']}")
