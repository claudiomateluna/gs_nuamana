import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def search(area, unit, query=None):
    print(f"\n=== {area} - {unit} ===")
    filtered = [o for o in objs if o["area_nombre"].lower() == area.lower() and o["unidad_nombre"].lower() == unit.lower()]
    for o in filtered:
        txt = o["texto_infantil"] if o["unidad_nombre"] != "Clan" else o["texto_terminal"]
        if query is None or query.lower() in txt.lower():
            print(f"ID: {o['id']} | Rango: {o['rango_edad']} | Texto: {txt}")

search("Afectividad", "Manada")
search("Sociabilidad", "Manada")
