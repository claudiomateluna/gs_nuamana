# -*- coding: utf-8 -*-
import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

def show(u_id, a_id, label):
    print(f"\n=== {label} ===")
    for o in objs:
        if o["unidad_id"] == u_id and o["area_id"] == a_id:
            print(f"  [{o['rango_edad']}] ID: '{o['id']}' -> {o['texto_infantil']}")

show(3, 4, "Tropa - Afectividad") # Tropa Afectividad
show(2, 4, "Compañía - Afectividad") # Compañía Afectividad
show(3, 3, "Tropa - Carácter") # Tropa Carácter
show(2, 3, "Compañía - Carácter") # Compañía Carácter
