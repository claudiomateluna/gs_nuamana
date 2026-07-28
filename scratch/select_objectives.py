import json

with open("C:/Users/claud/Documents/PWA/NuaMana/supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

grouped = {}
for o in objs:
    u = o["unidad_nombre"]
    a = o["area_nombre"]
    r = o["rango_edad"]
    if u not in grouped:
        grouped[u] = {}
    if a not in grouped[u]:
        grouped[u][a] = []
    grouped[u][a].append(o)

print("Resumen de objetivos:")
for u, areas in grouped.items():
    print(f"Unidad: {u}")
    for a, items in areas.items():
        print(f"  Área: {a} - {len(items)} ítems")
