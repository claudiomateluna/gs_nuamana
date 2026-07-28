# -*- coding: utf-8 -*-
import json
import os

EXTRACTED_PATH = r"C:\Users\claud\.gemini\antigravity-cli\brain\04fb3a46-2638-44dd-b8b8-2a7c8a546c8b\scratch\extracted_games.json"
OUTPUT_DIR = r"C:\Users\claud\Documents\PWA\NuaMana\scratch"

# Mapping of the 30 games we want to process: (Original Title, Target Rewritten Title, Base Image)
GAMES_TO_PROCESS = [
    # Aprender Nombres (Circle)
    ("Aplausos.", "Ritmo de Nombres", "juegos_circulo_base.jpg"),
    ("Pelota en el aire.", "Pelota al Aire", "juegos_carrera_base.jpg"),
    ("Carrera de nombres.", "Carrera de Presentación", "juegos_carrera_base.jpg"),
    ("¿Te gustan tus vecinos?", "Vecinos Afectuosos", "juegos_circulo_base.jpg"),
    
    # Mejorar Confianza (Mesa, Circulo, etc.)
    ("Entrevistas mutuas.", "Entrevistas Cruzadas", "juegos_mesa_base.jpg"),
    ("El amigo desconocido.", "El Amigo Secreto", "juegos_mesa_base.jpg"),
    ("Máxima eficiencia.", "Desafío de Destreza", "juegos_cooperativo_base.jpg"),
    ("Tanto el viento como el árbol.", "El Árbol y el Viento", "juegos_circulo_base.jpg"),
    ("Ese manual.", "Abrazos Rítmicos", "juegos_circulo_base.jpg", 9), # Use index 9
    
    # Integradoras (Circulo, Cooperativo, Nocturno)
    ("El lavado de autos.", "El Lavado de Autos", "juegos_circulo_base.jpg"),
    ("El nido.", "El Circuito del Nido", "juegos_cooperativo_base.jpg"),
    ("Son vampiros.", "Vampiros en el Campamento", "juegos_nocturno_base.jpg"),
    ("Ese manual.", "Cualidades al Vuelo", "juegos_circulo_base.jpg", 4), # Use index 4
    
    # Nocturnas (Nocturno)
    ("Un oso", "Acecho del Oso", "juegos_nocturno_base.jpg"),
    ("Acecharse unos a otros.", "Juego de Acechadores", "juegos_nocturno_base.jpg"),
    ("Lo inobservable.", "El Guardia Invisible", "juegos_nocturno_base.jpg"),
    
    # Físicas (Carrera, Duelo, Agua)
    ("Matamoscas.", "El Matamoscas Escurridizo", "juegos_carrera_base.jpg"),
    ("Pelea de gallos.", "Pelea de Gallos Scout", "juegos_duelo_base.jpg"),
    ("Las 4 colinas.", "Asalto a las Cuatro Colinas", "juegos_nocturno_base.jpg"),
    ("Captura de serpientes.", "Cacería de Serpientes", "juegos_duelo_base.jpg"),
    ("Competiciones de relevos.", "Relevos Scouts de Agilidad", "juegos_carrera_base.jpg"),
    ("La Pañoleta.", "Arrebato de Pañoleta", "juegos_duelo_base.jpg"),
    ("Una pañoleta y un círculo.", "Círculo y Pañoleta", "juegos_duelo_base.jpg"),
    ("La batalla de globos.", "Combate de Globos", "juegos_agua_base.jpg"),
    
    # Cooperativas (Naturaleza, Carrera, Cooperativo, Mesa)
    ("Animales que son venerados.", "Animales Venerados", "juegos_naturaleza_base.jpg"),
    ("Fútbol Scout", "Fútbol con Obstáculos", "juegos_carrera_base.jpg"),
    ("Dibujo en equipo.", "Dibujo en Relevos", "juegos_cooperativo_base.jpg"),
    ("Cuatro esquinas.", "Esquinas Cruzadas", "juegos_carrera_base.jpg"),
    ("Una carrera de 100 pies al revés", "Carrera de Ciempiés Invertida", "juegos_carrera_base.jpg"),
    ("Los Magos de Teis.", "El Reto de los Magos", "juegos_mesa_base.jpg")
]

def main():
    with open(EXTRACTED_PATH, "r", encoding="utf-8") as f:
        extracted = json.load(f)
        
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    processed = []
    for entry in GAMES_TO_PROCESS:
        orig_title = entry[0]
        target_title = entry[1]
        base_img = entry[2]
        
        # Resolve by index if specified (for duplicate original titles like 'Ese manual.')
        specific_idx = entry[3] if len(entry) > 3 else None
        
        match = None
        if specific_idx is not None:
            match = extracted[specific_idx]
        else:
            # Find by title match
            for idx, item in enumerate(extracted):
                if item["title"].strip().lower() == orig_title.lower() and idx not in [4, 9]:
                    match = item
                    break
            # Fallback if index-based search was needed
            if not match:
                for idx, item in enumerate(extracted):
                    if item["title"].strip().lower() == orig_title.lower():
                        match = item
                        break
                        
        if match:
            processed.append({
                "original_title": orig_title,
                "titulo_reescrito": target_title,
                "base_image": base_img,
                "category_original": match["category"],
                "clean_text": match["clean_text"],
                "raw_html": match["raw_html"]
            })
        else:
            print(f"Warning: Could not find raw match for '{orig_title}'")
            
    print(f"Total resolved games to process: {len(processed)}")
    
    # Split into 6 batches of 5 games
    batch_size = 5
    for i in range(6):
        batch = processed[i*batch_size : (i+1)*batch_size]
        batch_path = os.path.join(OUTPUT_DIR, f"batch_input_{i}.json")
        with open(batch_path, "w", encoding="utf-8") as f_out:
            json.dump(batch, f_out, indent=2, ensure_ascii=False)
        print(f"Generated batch {i} with {len(batch)} games in {batch_path}")

if __name__ == "__main__":
    main()
