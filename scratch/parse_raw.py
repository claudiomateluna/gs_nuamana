import json
import re
import os

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def clean_name(name):
    n = name.lower()
    # quitar articulos comunes al inicio
    n = re.sub(r'^(el|la|los|las|un|una|unos|unas)\s+', '', n)
    n = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()]', '', n)
    n = n.strip()
    return n

def main():
    raw_path = "docs/actividades_crudas.txt"
    with open(raw_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    activities = []
    # Las actividades empiezan con === ACTIVIDAD: Nombre ===
    pattern = r"===\s*ACTIVIDAD:\s*(.*?)\s*===\n(.*?)(?=\n===\s*ACTIVIDAD:|\Z)"
    matches = re.findall(pattern, content, re.DOTALL)
    
    existing = load_json("scratch/articulos_existentes.json")
    existing_cleaned = {clean_name(x["titulo"]): x for x in existing}
    
    print(f"Encontradas {len(matches)} actividades en el archivo crudo:")
    for name, text in matches:
        name_clean = clean_name(name)
        
        # Buscar similitudes en la base de datos
        match_found = None
        for k, v in existing_cleaned.items():
            # Similitud simple por coincidencia exacta del nombre limpio
            if k == name_clean or name_clean in k or k in name_clean:
                match_found = v
                break
                
        status = "DUPLICADO" if match_found else "NUEVO"
        match_info = f" (Coincide con: '{match_found['titulo']}' [{match_found['slug']}])" if match_found else ""
        print(f"- {name} -> {status}{match_info}")
        
if __name__ == "__main__":
    main()
