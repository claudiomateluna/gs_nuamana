# -*- coding: utf-8 -*-
import json

with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs = json.load(f)

areas = ['Corporalidad', 'Carácter', 'Afectividad', 'Sociabilidad']
units = ['Manada', 'Tropa', 'Compañía', 'Avanzada', 'Clan']

res = {}
for o in objs:
    res.setdefault((o['unidad_nombre'], o['area_nombre']), []).append(o)

with open("scratch/grouped_objectives.txt", "w", encoding="utf-8") as f_out:
    for u in units:
        for a in areas:
            key = (u, a)
            # Try to handle spelling variations in DB
            if u == 'Compañía' and (u, a) not in res:
                key = ('Compañia', a)
            if (u, a) not in res and key not in res:
                # Check soft matching
                for k in res.keys():
                    if k[0].startswith(u[:5]) and k[1].startswith(a[:5]):
                        key = k
                        break
            
            if key in res:
                f_out.write(f"\n=== {u} - {a} ===\n")
                for o in res[key]:
                    text = o["texto_terminal"] if u == "Clan" else o["texto_infantil"]
                    f_out.write(f"  [{o['rango_edad']}] {o['id']} -> {text}\n")
            else:
                f_out.write(f"\n=== {u} - {a} (NOT FOUND) ===\n")

print("Grouped objectives written to scratch/grouped_objectives.txt")
