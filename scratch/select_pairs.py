import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def print_opt(unidad, area):
    print(f"\n=== {unidad.upper()} - {area.upper()} ===")
    for o in objs:
        if o["unidad_nombre"].lower() == unidad.lower() and o["area_nombre"].lower() == area.lower():
            t = o["texto_terminal"] if o["unidad_nombre"].lower() == "clan" else o["texto_infantil"]
            print(f"  [{o['rango_edad']}] ID: {o['id']} -> {t}")

print_opt("Manada", "Carácter")
print_opt("Tropa", "Carácter")
print_opt("Avanzada", "Carácter")
print_opt("Clan", "Carácter")
