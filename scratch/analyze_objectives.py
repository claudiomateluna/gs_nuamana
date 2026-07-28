import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

print(f"Total objetivos: {len(objs)}")

# Agrupar por unidad y rango de edad
grouped = {}
for o in objs:
    u = o["unidad_nombre"]
    r = o["rango_edad"]
    a = o["area_nombre"]
    grouped.setdefault(u, {}).setdefault(a, {}).setdefault(r, []).append(o)

for u, areas in grouped.items():
    print(f"\nUnidad: {u}")
    for a, rangos in areas.items():
        print(f"  Área: {a}")
        for r, list_objs in rangos.items():
            print(f"    {r}: {len(list_objs)} objetivos")
