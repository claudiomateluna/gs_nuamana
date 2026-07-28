import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

comp_afec_11_13 = [o for o in objs if o["unidad_nombre"] == "Compañía" and o["area_nombre"] == "Afectividad" and o["rango_edad"] == "11 a 13 años"]
comp_afec_13_15 = [o for o in objs if o["unidad_nombre"] == "Compañía" and o["area_nombre"] == "Afectividad" and o["rango_edad"] == "13 a 15 años"]

print("Compañía 11-13:")
for o in comp_afec_11_13:
    print(f"{o['id']}: {o['texto_infantil']}")

print("Compañía 13-15:")
for o in comp_afec_13_15:
    print(f"{o['id']}: {o['texto_infantil']}")
