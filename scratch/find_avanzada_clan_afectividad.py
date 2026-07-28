import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for o in data:
    if o["unidad_nombre"] == "Avanzada" and "afect" in o["area_nombre"].lower():
        print(f"Avanzada | {o['rango_edad']} | ID: {o['id']} | Texto: {o['texto_infantil']}")
    if o["unidad_nombre"] == "Clan" and "afect" in o["area_nombre"].lower():
        print(f"Clan | {o['rango_edad']} | ID: {o['id']} | Texto: {o['texto_terminal']}")
