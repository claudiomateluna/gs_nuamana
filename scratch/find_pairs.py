import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def find_for_unit_and_area(unit_name, area_name):
    unit_map = {
        "manada": "Manada",
        "tropa": "Tropa",
        "compañía": "Compañía",
        "compania": "Compañía",
        "avanzada": "Avanzada",
        "clan": "Clan"
    }
    
    area_map = {
        "corporalidad": "Corporalidad",
        "creatividad": "Creatividad",
        "carácter": "Carácter",
        "caracter": "Carácter",
        "afectividad": "Afectividad",
        "sociabilidad": "Sociabilidad",
        "espiritualidad": "Espiritualidad"
    }
    
    u_target = unit_map.get(unit_name.lower())
    a_target = area_map.get(area_name.lower())
    
    results = []
    for d in data:
        d_unit = d["unidad_nombre"]
        if "compa" in d_unit.lower() or "compañ" in d_unit.lower():
            d_unit = "Compañía"
            
        d_area = d["area_nombre"]
        if "car" in d_area.lower() and "ct" in d_area.lower():
            d_area = "Carácter"
            
        if d_unit == u_target and d_area == a_target:
            results.append(d)
            
    return results

out_lines = []
for area in ["Sociabilidad", "Afectividad", "Corporalidad", "Creatividad", "Carácter"]:
    out_lines.append(f"\n==================== AREA: {area} ====================")
    for unit in ["Manada", "Tropa", "Compañía", "Avanzada", "Clan"]:
        objs = find_for_unit_and_area(unit, area)
        out_lines.append(f"\n--- {unit} ---")
        for o in objs:
            text = o["texto_infantil"] if o["unidad_nombre"] != "Clan" else o["texto_terminal"]
            out_lines.append(f"ID: {o['id']} | {o['rango_edad']} | {text}")

with open("scratch/pairs_output_utf8.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))
