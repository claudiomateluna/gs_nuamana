# -*- coding: utf-8 -*-
import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def print_objs(unit_id, area_id, label):
    print(f"\n=== {label} (Unit: {unit_id}, Area: {area_id}) ===")
    for o in objs:
        if o["unidad_id"] == unit_id and o["area_id"] == area_id:
            t = o["texto_terminal"] if unit_id == 5 else o["texto_infantil"]
            print(f"  [{o['rango_edad']}] ID: '{o['id']}' -> {t}")

print_objs(4, 1, "Avanzada - Corporalidad") # Avanzada = 4
print_objs(4, 3, "Avanzada - Carácter")
print_objs(4, 4, "Avanzada - Afectividad")
print_objs(4, 5, "Avanzada - Sociabilidad")

print_objs(5, 1, "Clan - Corporalidad") # Clan = 5
print_objs(5, 3, "Clan - Carácter")
print_objs(5, 4, "Clan - Afectividad")
print_objs(5, 5, "Clan - Sociabilidad")
