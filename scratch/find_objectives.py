import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    obj_list = json.load(f)

def search(unidad=None, area=None, rango=None, keyword=None):
    results = []
    for o in obj_list:
        if unidad and o["unidad_nombre"].lower() != unidad.lower():
            continue
        if area and o["area_nombre"].lower() != area.lower():
            continue
        if rango and o["rango_edad"].lower() != rango.lower():
            continue
        if keyword and keyword.lower() not in o["texto_infantil"].lower() and keyword.lower() not in o["texto_terminal"].lower():
            continue
        results.append(o)
    return results

# Vamos a buscar algunos objetivos para Corporalidad, Sociabilidad y Creatividad
print("MANADA CORPORALIDAD:")
for o in search("Manada", "Corporalidad")[:8]:
    print(f"ID: {o['id']} | Rango: {o['rango_edad']} | Texto: {o['texto_infantil']}")

print("\nMANADA SOCIABILIDAD:")
for o in search("Manada", "Sociabilidad")[:8]:
    print(f"ID: {o['id']} | Rango: {o['rango_edad']} | Texto: {o['texto_infantil']}")

print("\nTROPA/COMPAÑIA CORPORALIDAD:")
for o in search("Tropa", "Corporalidad")[:8]:
    print(f"ID: {o['id']} | Rango: {o['rango_edad']} | Texto: {o['texto_infantil']}")
