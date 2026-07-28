import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def show_by_area_unit(area, unit):
    print(f"\n--- {area} en {unit} ---")
    sub = [o for o in objs if o["area_nombre"].lower() == area.lower() and o["unidad_nombre"].lower() == unit.lower()]
    for o in sub:
        txt = o["texto_infantil"] if o["unidad_nombre"] != "Clan" else o["texto_terminal"]
        print(f"ID: {o['id']} | {o['rango_edad']} | {txt}")

show_by_area_unit("Afectividad", "Compañía")
show_by_area_unit("Afectividad", "Tropa")
show_by_area_unit("Afectividad", "Avanzada")
show_by_area_unit("Afectividad", "Clan")
