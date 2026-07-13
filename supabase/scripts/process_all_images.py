import os
import re
import json
import sys

# Import functions from composite_images
sys.path.append(os.path.dirname(__file__))
from composite_images import process_image, upload_to_supabase

# Directory configuration
BRAIN_DIR = r"C:\Users\claud\.gemini\antigravity-cli\brain\04fb3a46-2638-44dd-b8b8-2a7c8a546c8b"
ACTIVITIES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "docs", "actividades")
OUTPUT_JSON_PATH = os.path.join(os.path.dirname(__file__), "uploaded_images.json")

# Map of activity slug to generated base image in the brain folder
IMAGE_MAPPING = {
    "pelea-de-gallos": "pelea_de_gallos_base_1783981115104.jpg",
    "pelea-de-cangrejos": "pelea_de_cangrejos_base_1783981128507.jpg",
    "la-batalla-de-globos": "la_batalla_de_globos_base_1783981140583.jpg",
    "granjeros-y-cerditos": "granjeros_y_cerditos_base_1783981152397.jpg",
    "el-sendero-del-cuidado": "sendero_cuidado_base_1783981247995.jpg",
    "el-nido-de-los-recuerdos": "nido_recuerdos_base_1783981284537.jpg",
    "caceria-de-osos": "caceria_osos_base_1783981294281.jpg",
    "el-inobservable": "inobservable_base_1783981305040.jpg",
    "el-matamoscas-en-cadena": "matamoscas_base_1783981314553.jpg",
    "el-asalto-a-las-cuatro-colinas": "cuatro_colinas_base_1783981324658.jpg",
    "la-captura-de-las-serpientes": "captura_serpientes_base_1783981333868.jpg",
    "el-mural-colectivo": "mural_colectivo_base_1783981344774.jpg",
    "los-mensajeros-de-la-selva": "mensajeros_selva_base_1783981354656.jpg",
    "el-desafio-de-los-magos-de-teis": "magos_teis_base_1783981364806.jpg"
}

SLUG_CATEGORY_MAP = {
    "pelea-de-gallos": {"id": 7, "name": "Juegos"},
    "pelea-de-cangrejos": {"id": 7, "name": "Juegos"},
    "la-batalla-de-globos": {"id": 7, "name": "Juegos"},
    "granjeros-y-cerditos": {"id": 7, "name": "Juegos"},
    "el-sendero-del-cuidado": {"id": 10, "name": "Dinámicas"},
    "el-nido-de-los-recuerdos": {"id": 10, "name": "Dinámicas"},
    "caceria-de-osos": {"id": 9, "name": "Juegos Nocturnos"},
    "el-inobservable": {"id": 9, "name": "Juegos Nocturnos"},
    "el-matamoscas-en-cadena": {"id": 7, "name": "Juegos"},
    "el-asalto-a-las-cuatro-colinas": {"id": 9, "name": "Juegos Nocturnos"},
    "la-captura-de-las-serpientes": {"id": 7, "name": "Juegos"},
    "el-mural-colectivo": {"id": 10, "name": "Dinámicas"},
    "los-mensajeros-de-la-selva": {"id": 7, "name": "Juegos"},
    "el-desafio-de-los-magos-de-teis": {"id": 7, "name": "Juegos"}
}

def parse_markdown_metadata(file_path, slug):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Extract Frontmatter
    match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return None
        
    frontmatter = match.group(1)
    
    # Parse title
    title_match = re.search(r"^titulo:\s*[\"']?(.*?)[\"']?\s*$", frontmatter, re.MULTILINE)
    title = title_match.group(1) if title_match else ""
    
    # Resolve category based on SLUG_CATEGORY_MAP
    category = SLUG_CATEGORY_MAP.get(slug, {}).get("name", "Actividad")
            
    return {
        "title": title,
        "category": category
    }

def main():
    print("Starting processing of all 14 activities images...")
    results = {}
    
    for slug, img_name in IMAGE_MAPPING.items():
        md_file = os.path.join(ACTIVITIES_DIR, f"{slug}.md")
        if not os.path.exists(md_file):
            print(f"Warning: Markdown file not found for {slug} at {md_file}. Skipping.")
            continue
            
        metadata = parse_markdown_metadata(md_file, slug)
        if not metadata:
            print(f"Error parsing metadata for {slug}. Skipping.")
            continue
            
        base_img_path = os.path.join(BRAIN_DIR, img_name)
        if not os.path.exists(base_img_path):
            print(f"Error: Base image {img_name} not found in brain directory. Skipping.")
            continue
            
        print(f"\n--- Processing '{metadata['title']}' ---")
        processed_path = process_image(base_img_path, metadata['title'], metadata['category'])
        if processed_path:
            public_url = upload_to_supabase(processed_path)
            if public_url:
                results[slug] = public_url
                print(f"Done! {slug} -> {public_url}")
            else:
                print(f"Failed to upload processed image for {slug}")
        else:
            print(f"Failed to process image for {slug}")
            
    # Save results to JSON file
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
        
    print(f"\nProcessing complete! Uploaded mapping saved to: {OUTPUT_JSON_PATH}")

if __name__ == "__main__":
    main()
