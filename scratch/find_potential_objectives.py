import json

with open("C:/Users/claud/Documents/PWA/NuaMana/supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def print_objs(unidad, area, rango=None):
    print(f"\n--- {unidad} - {area} ({rango if rango else 'Todos'}) ---")
    count = 0
    for o in objs:
        if o["unidad_nombre"].lower() == unidad.lower() and o["area_nombre"].lower() == area.lower():
            if rango is None or o["rango_edad"].lower() == rango.lower():
                print(f"ID: {o['id']} | Rango: {o['rango_edad']} | Texto: {o['texto_infantil'] or o['texto_terminal']}")
                count += 1
    print(f"Total: {count}")

print_objs("Avanzada", "Corporalidad")
print_objs("Clan", "Corporalidad")
print_objs("Avanzada", "Sociabilidad")
print_objs("Clan", "Sociabilidad")
