import os
import re
import sys
import json
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# 1. Paths configurations
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend")
ENV_FILE = os.path.join(FRONTEND_DIR, ".env.local")
TEMPLATE_BG = os.path.join(FRONTEND_DIR, "public", "images", "template", "firma_background.webp")
TEMPLATE_FG = os.path.join(FRONTEND_DIR, "public", "images", "template", "firma_frontal.webp")
FONT_PATH = "C:\\Windows\\Fonts\\georgiab.ttf"  # Default Windows Georgia Bold font

def load_env():
    env = {}
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    k, v = line.strip().split("=", 1)
                    env[k.strip()] = v.strip()
    return env

def get_glow_image(text, font, text_color, glow_color, blur_radius=4):
    # Create canvas for drawing the glow text
    dummy = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(dummy)
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0] + blur_radius * 4 + 10
    h = bbox[3] - bbox[1] + blur_radius * 4 + 10
    
    # Draw glow shadow
    glow_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_img)
    glow_draw.text((blur_radius*2, blur_radius*2), text, font=font, fill=glow_color)
    glow_img = glow_img.filter(ImageFilter.GaussianBlur(blur_radius))
    
    # Draw clean foreground text
    fg_img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fg_draw = ImageDraw.Draw(fg_img)
    fg_draw.text((blur_radius*2, blur_radius*2), text, font=font, fill=text_color)
    
    # Merge both
    return Image.alpha_composite(glow_img, fg_img), w, h, blur_radius*2

def process_image(base_img_path, title, category):
    print(f"Processing image: {base_img_path}")
    if not os.path.exists(base_img_path):
        print(f"Error: Base image not found at {base_img_path}")
        return None
        
    # Load templates
    bg = Image.open(TEMPLATE_BG).convert("RGBA").resize((540, 540))
    fg = Image.open(TEMPLATE_FG).convert("RGBA").resize((540, 540))
    user = Image.open(base_img_path).convert("RGBA")
    
    # Crop user image 1:1 centered
    w, h = user.size
    min_dim = min(w, h)
    left = (w - min_dim) / 2
    top = (h - min_dim) / 2
    right = left + min_dim
    bottom = top + min_dim
    user_cropped = user.crop((left, top, right, bottom)).resize((540, 540))
    
    # Merge layers: bg + user + fg
    merged = Image.alpha_composite(bg, user_cropped)
    merged = Image.alpha_composite(merged, fg)
    
    # Prepare Drawing context
    draw = ImageDraw.Draw(merged)
    
    # Load fonts
    try:
        font_title = ImageFont.truetype(FONT_PATH, 20)
        font_cat = ImageFont.truetype("C:\\Windows\\Fonts\\Arial.ttf", 20)
    except IOError:
        print("Warning: Standard ttf fonts not found, using default PIL font.")
        font_title = ImageFont.load_default()
        font_cat = font_title
        
    # --- 1. Draw Title (Bottom Left) ---
    title_text = title.upper()
    # Check length and crop if needed
    max_w = 460
    while len(title_text) > 0:
        bbox = draw.textbbox((0, 0), title_text, font=font_title)
        text_w = bbox[2] - bbox[0]
        if text_w <= max_w:
            break
        title_text = title_text[:-1]
    if title_text != title.upper():
        title_text += "..."
        
    target_x = 79
    target_y = 485  # Adjusted Y to align well with standard coordinates
    
    # Draw red outline (3px stroke width)
    stroke_color = (203, 51, 39, 255) # Red #cb3327
    for offset_x in [-2, -1, 0, 1, 2]:
        for offset_y in [-2, -1, 0, 1, 2]:
            draw.text((target_x + offset_x, target_y + offset_y), title_text, font=font_title, fill=stroke_color)
            
    # Draw white fill
    draw.text((target_x, target_y), title_text, font=font_title, fill=(255, 255, 255, 255))
    
    # --- 2. Draw Category (Top Right, with Glow Effect) ---
    cat_text = category.upper()
    # Generate category with red glow
    glow_color = (203, 51, 39, 180)  # Red glow
    text_color = (203, 51, 39, 255)  # Solid red
    glow_img, glow_w, glow_h, offset = get_glow_image(cat_text, font_cat, text_color, glow_color, blur_radius=3)
    
    # Position in top right (x=505 is right edge alignment)
    pos_x = 505 - (glow_w - offset * 2)
    pos_y = 35 - offset
    
    merged.paste(glow_img, (int(pos_x), int(pos_y)), glow_img)
    
    # Save output as WebP
    out_dir = os.path.join(FRONTEND_DIR, "public", "uploads", "processed")
    os.makedirs(out_dir, exist_ok=True)
    slug = re.sub(r'[^a-z0-9\s-]', '', title.lower()).replace(' ', '-')
    out_path = os.path.join(out_dir, f"{slug}.webp")
    merged.save(out_path, "WEBP", quality=80)
    print(f"Image processed successfully saved to: {out_path}")
    return out_path

def upload_to_supabase(file_path):
    env = load_env()
    url = env.get("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321")
    
    # Use the local docker Service Role Key to bypass RLS policies
    service_role_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
    
    file_name = os.path.basename(file_path)
    # Define remote storage path: blog/[filename]
    remote_path = f"blog/{file_name}"
    
    upload_url = f"{url}/storage/v1/object/articulos/{remote_path}"
    
    headers = {
        "Authorization": f"Bearer {service_role_key}",
        "x-upsert": "true"
    }
    
    print(f"Uploading {file_name} to Supabase local storage bucket 'articulos'...")
    with open(file_path, "rb") as f:
        response = requests.post(upload_url, headers=headers, files={"file": f})
        
    if response.status_code == 200 or response.status_code == 201:
        public_url = f"{url}/storage/v1/object/public/articulos/{remote_path}"
        print(f"Successfully uploaded! Public URL: {public_url}")
        return public_url
    else:
        print(f"Failed to upload: {response.status_code} - {response.text}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python composite_images.py [base_img_path] [title] [category]")
        sys.exit(1)
    img_path = sys.argv[1]
    title = sys.argv[2]
    category = sys.argv[3]
    
    processed_path = process_image(img_path, title, category)
    if processed_path:
        public_url = upload_to_supabase(processed_path)
        if public_url:
            # Output only the URL to be easily read by parent scripts/agents
            print(f"RESULT_URL={public_url}")
