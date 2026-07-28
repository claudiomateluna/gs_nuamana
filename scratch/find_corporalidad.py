import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for o in data:
    if "corporal" in o["area_nombre"].lower():
        print(f"{o['unidad_nombre']} | {o['rango_edad']} | ID: {o['id']} | Texto: {o['texto_infantil'] if o['unidad_nombre'] != 'Clan' else o['texto_terminal']}")
