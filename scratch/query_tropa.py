# -*- coding: utf-8 -*-
import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def print_objs(unit_id, area_id, label):
    print(f"\n=== {label} (Unit: {unit_id}, Area: {area_id}) ===")
    for o in objs:
        if o["unidad_id"] == unit_id and o["area_id"] == area_id:
            t = o["texto_infantil"]
            print(f"  [{o['rango_edad']}] ID: '{o['id']}' -> {t}")

print_objs(3, 1, "Tropa - Corporalidad") # Tropa = 3
print_objs(3, 3, "Tropa - Carácter")
print_objs(3, 4, "Tropa - Afectividad")
print_objs(3, 5, "Tropa - Sociabilidad")

print_objs(2, 1, "Compañía - Corporalidad") # Compañía = 2
print_objs(2, 3, "Compañía - Carácter")
print_objs(2, 4, "Compañía - Afectividad")
print_objs(2, 5, "Compañía - Sociabilidad")
