import json
import collections

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    obj_list = json.load(f)

print(f"Total objetivos: {len(obj_list)}")

# Agrupar por unidad, area, rango_edad
grouped = collections.defaultdict(lambda: collections.defaultdict(lambda: collections.defaultdict(list)))
for o in obj_list:
    u = o["unidad_nombre"]
    a = o["area_nombre"]
    r = o["rango_edad"]
    grouped[u][a][r].append(o)

# Ver unidades y áreas
for u, areas in grouped.items():
    print(f"\nUnidad: {u}")
    for a, rangos in areas.items():
        print(f"  Área: {a}")
        for r, items in rangos.items():
            print(f"    Rango '{r}': {len(items)} objetivos")
