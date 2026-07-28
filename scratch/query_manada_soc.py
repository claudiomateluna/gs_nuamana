# -*- coding: utf-8 -*-
import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

for o in objs:
    if o["unidad_id"] == 1 and o["area_id"] == 5:
        print(f"[{o['rango_edad']}] ID: '{o['id']}' -> {o['texto_infantil']}")
