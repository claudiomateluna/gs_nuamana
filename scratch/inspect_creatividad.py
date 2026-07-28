import json

with open("C:/Users/claud/Documents/PWA/NuaMana/supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

for o in objs:
    u = o["unidad_nombre"]
    a = o["area_nombre"]
    r = o["rango_edad"]
    if a.lower() == "creatividad":
        print(f"U: {u} | R: {r} | ID: {o['id']} | T: {o['texto_infantil'][:50]}")
