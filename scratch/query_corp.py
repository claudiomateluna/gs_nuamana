import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def show_corp(unit):
    print(f"\n--- Corporalidad en {unit} ---")
    sub = [o for o in objs if o["area_nombre"].lower() == "corporalidad" and o["unidad_nombre"].lower() == unit.lower()]
    for o in sub:
        txt = o["texto_infantil"] if o["unidad_nombre"] != "Clan" else o["texto_terminal"]
        print(f"ID: {o['id']} | {o['rango_edad']} | {txt}")

show_corp("Manada")
show_corp("Tropa")
show_corp("Avanzada")
show_corp("Clan")
