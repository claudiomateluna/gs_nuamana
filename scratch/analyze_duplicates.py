import json
import re
import os

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def clean_text(text):
    if not text:
        return ""
    text = text.lower()
    # quitar acentos
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ñ': 'n', 'ü': 'u'
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    return ' '.join(text.split())

def get_words(text):
    return set(clean_text(text).split())

import difflib

def main():
    raw_path = "docs/actividades_crudas.txt"
    with open(raw_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    pattern = r"===\s*ACTIVIDAD:\s*(.*?)\s*===\n(.*?)(?=\n===\s*ACTIVIDAD:|\Z)"
    raw_activities = re.findall(pattern, content, re.DOTALL)
    
    existing = load_json("scratch/articulos_completos.json")
    
    print("Analisis de duplicados con difflib:")
    print("=" * 60)
    
    for title, text in raw_activities:
        title_clean = clean_text(title)
        text_clean = clean_text(text)
        
        matches = []
        for ext in existing:
            ext_title_clean = clean_text(ext["titulo"])
            ext_text_clean = clean_text(ext["contenido"])
            
            # Similitud de titulo
            title_sim = difflib.SequenceMatcher(None, title_clean, ext_title_clean).ratio()
            # Similitud de texto (primeros 300 caracteres para velocidad)
            text_sim = difflib.SequenceMatcher(None, text_clean[:300], ext_text_clean[:300]).ratio()
            
            if title_sim > 0.6 or text_sim > 0.5:
                matches.append((ext["titulo"], title_sim, text_sim))
                
        if matches:
            # ordenar por la suma de similitudes o maximo
            matches.sort(key=lambda x: max(x[1], x[2]), reverse=True)
            print(f"Actividad cruda: '{title}'")
            for m in matches[:3]:
                print(f"  -> Coincide con '{m[0]}' (Titulo sim: {m[1]:.2f}, Texto sim: {m[2]:.2f})")
        else:
            print(f"Actividad cruda: '{title}' -> Sin duplicados evidentes")

if __name__ == "__main__":
    main()
