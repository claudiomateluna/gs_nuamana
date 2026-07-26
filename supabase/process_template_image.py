import os
from PIL import Image, ImageDraw, ImageFont

def process_article_image_py(input_img_path, output_img_path, title, category):
    # 1. Load template images
    bg_path = "frontend/public/images/template/firma_background.webp"
    fg_path = "frontend/public/images/template/firma_frontal.webp"

    bg_img = Image.open(bg_path).convert("RGBA").resize((540, 540), Image.LANCZOS)
    fg_img = Image.open(fg_path).convert("RGBA").resize((540, 540), Image.LANCZOS)

    user_img = Image.open(input_img_path).convert("RGBA")
    
    # 2. Crop 1:1 centered & resize to 540x540
    width, height = user_img.size
    min_dim = min(width, height)
    left = (width - min_dim) / 2
    top = (height - min_dim) / 2
    right = (width + min_dim) / 2
    bottom = (height + min_dim) / 2
    user_cropped = user_img.crop((left, top, right, bottom)).resize((540, 540), Image.LANCZOS)

    # 3. Create canvas and composite layers
    canvas = Image.new("RGBA", (540, 540), (255, 255, 255, 255))
    canvas.paste(bg_img, (0, 0), bg_img)
    canvas.paste(user_cropped, (0, 0), user_cropped)
    canvas.paste(fg_img, (0, 0), fg_img)

    # 4. Prepare drawing context for text layers
    draw = ImageDraw.Draw(canvas)

    # Load bold fonts if available, or fallback to default bold
    try:
        font_title = ImageFont.truetype("georgiab.ttf", 20)
    except IOError:
        try:
            font_title = ImageFont.truetype("arialbd.ttf", 20)
        except IOError:
            font_title = ImageFont.load_default()

    try:
        font_cat = ImageFont.truetype("arialbd.ttf", 20)
    except IOError:
        font_cat = ImageFont.load_default()

    # Capa 4: Title text at X=79, Y=495
    title_text = title.upper()
    max_width = 460
    target_x = 79
    target_y = 485  # Offset for baseline centering in PIL

    # Truncate if exceeds max_width
    while len(title_text) > 0:
        bbox = draw.textbbox((0, 0), title_text + "...", font=font_title)
        w = bbox[2] - bbox[0]
        if w <= max_width or len(title_text) <= 3:
            break
        title_text = title_text[:-1]

    if title_text != title.upper():
        title_text += "..."

    # Draw stroke outline (red #cb3327)
    stroke_color = (203, 51, 39, 255) # #cb3327
    fill_color = (255, 255, 255, 255) # #ffffff

    # PIL stroke
    draw.text((target_x, target_y), title_text, font=font_title, fill=fill_color, stroke_width=2, stroke_fill=stroke_color)

    # Capa 5: Category badge (Fondo clr1 #ffffff, padding 2px/4px, redondeado sm 4px, texto en rojo #cb3327)
    cat_text = category.upper()
    cat_color = (203, 51, 39, 255) # #cb3327
    bg_color = (255, 255, 255, 255) # clr1 #ffffff

    bbox_cat = draw.textbbox((0, 0), cat_text, font=font_cat)
    cat_w = bbox_cat[2] - bbox_cat[0]
    cat_h = bbox_cat[3] - bbox_cat[1]

    pad_x = 6
    pad_y = 3
    cat_x = 505 - cat_w
    cat_y = 25

    bg_x0 = cat_x - pad_x
    bg_y0 = cat_y - pad_y
    bg_x1 = 505 + pad_x
    bg_y1 = cat_y + cat_h + pad_y

    # Dibujar fondo clr1 (#ffffff) redondeado (radius 4px)
    draw.rounded_rectangle([bg_x0, bg_y0, bg_x1, bg_y1], radius=4, fill=bg_color)
    draw.text((cat_x, cat_y), cat_text, font=font_cat, fill=cat_color)

    # 5. Convert to RGB & Save WebP
    canvas_rgb = canvas.convert("RGB")
    canvas_rgb.save(output_img_path, "WEBP", quality=80)
    print(f"Processed image with template saved to: {output_img_path}")

if __name__ == "__main__":
    raw_img = r"C:\Users\claud\.gemini\antigravity-cli\brain\1a6629cd-bb47-41eb-8e2a-da64d2f5d41e\el_nido_juego_1784875874733.jpg"
    out_img = r"frontend/public/uploads/actividad_elNido.webp"
    process_article_image_py(raw_img, out_img, "El Nido de los Recuerdos", "Dinámicas")
