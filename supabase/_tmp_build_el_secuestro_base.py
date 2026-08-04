"""PIL fallback base illustration for 'El Secuestro del Botánico'.
Synthesizes a 540x540 on-brand scout camp night scene with:
  - teams of scouts following paper clues through a forested camp
  - the Nua Mana institutional uniform hint (pearl-gray shirts, dark jeans,
    bipartite pañolín red/black with golden yellow stripes)
  - night atmosphere with torches and clue markers (banderins on poles)
  - the Flag of Rapa Nui (Reimiro) as the authorized diversifying flag (Spanish)

No external assets required. Output is a JPG written to the path in argv[1].
"""
import sys
import math
import random
from PIL import Image, ImageDraw, ImageFont

random.seed(20260803)

W = H = 540
img = Image.new("RGB", (W, H), (10, 18, 38))
d = ImageDraw.Draw(img, "RGBA")


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


# 1. Night sky vertical gradient (deep indigo -> navy -> forest green base)
sky_top = (8, 14, 36)
sky_mid = (16, 30, 64)
horizon = (22, 56, 70)
for y in range(H):
    if y < 220:
        c = lerp(sky_top, sky_mid, y / 220.0)
    elif y < 340:
        c = lerp(sky_mid, horizon, (y - 220) / 120.0)
    else:
        c = horizon
    d.line([(0, y), (W, y)], fill=c)

# 2. Moon (upper right) with soft halo
moon_cx, moon_cy, moon_r = 438, 86, 34
for r in range(moon_r + 28, moon_r, -1):
    a = max(8, 40 - (r - moon_r))
    d.ellipse(
        [moon_cx - r, moon_cy - r, moon_cx + r, moon_cy + r],
        fill=(255, 246, 214, a),
    )
d.ellipse(
    [moon_cx - moon_r, moon_cy - moon_r, moon_cx + moon_r, moon_cy + moon_r],
    fill=(253, 248, 224, 255),
)
# Crater shading
d.ellipse([moon_cx - 12, moon_cy - 6, moon_cx - 2, moon_cy + 6], fill=(228, 222, 198, 255))
d.ellipse([moon_cx + 4, moon_cy - 14, moon_cx + 14, moon_cy - 4], fill=(235, 230, 206, 255))

# 3. Stars
for _ in range(70):
    x = random.randint(0, W)
    y = random.randint(0, 200)
    if math.hypot(x - moon_cx, y - moon_cy) < 70:
        continue
    b = random.randint(160, 255)
    d.ellipse([x, y, x + 1, y + 1], fill=(b, b, min(255, b + 8), 255))

# 4. Distant tree silhouettes (layered, behind)
def draw_pine(cx, base_y, w, h, color):
    # trunk
    d.rectangle([cx - 3, base_y - 10, cx + 3, base_y], fill=(20, 18, 26, 255))
    # tiered triangular canopy
    for i in range(4):
        ty = base_y - 10 - (h * (i + 1) // 4)
        tw = int(w * (0.55 + 0.45 * (1 - i / 4)))
        d.polygon(
            [(cx, ty), (cx - tw, ty + h // 4 + 4), (cx + tw, ty + h // 4 + 4)],
            fill=color,
        )

far = (16, 26, 38)
for x in range(-40, W + 40, 70):
    draw_pine(x, 360, 56, 130, far)
mid = (10, 22, 30)
for x in range(-30, W + 40, 95):
    draw_pine(x + 25, 398, 78, 170, mid)

# 5. Forest floor band (dark green earth)
d.rectangle([0, 392, W, H], fill=(18, 34, 26))
# texture tufts
for _ in range(120):
    x = random.randint(0, W)
    y = random.randint(400, H - 4)
    g = random.randint(20, 55)
    d.line([(x, y), (x, y - random.randint(3, 8))], fill=(g, g + 18, g + 6))

# 6. Foreground pine on left framing the scene
draw_pine(60, 470, 130, 230, (8, 16, 22))
draw_pine(496, 460, 110, 210, (8, 16, 22))

# 7. Scout team figures with Nua Mana uniform
def draw_scout(x, base_y, scale=1.0, skin=(224, 188, 150)):
    s = scale
    # jeans (dark navy blue)
    d.rectangle(
        [x - 7 * s, base_y - 26 * s, x + 7 * s, base_y],
        fill=(24, 36, 78),
    )
    # long-sleeve pearl-gray shirt
    shirt = (188, 192, 198)
    d.rectangle([x - 11 * s, base_y - 52 * s, x + 11 * s, base_y - 26 * s], fill=shirt)
    # arms
    d.rectangle([x - 14 * s, base_y - 50 * s, x - 11 * s, base_y - 30 * s], fill=shirt)
    d.rectangle([x + 11 * s, base_y - 50 * s, x + 14 * s, base_y - 30 * s], fill=shirt)
    # pañolín: bipartite red/black with golden-yellow stripes
    pw = int(14 * s)
    ph = int(10 * s)
    py = base_y - int(54 * s)
    d.polygon(
        [(x, py), (x - pw, py + ph), (x + pw, py + ph)],
        fill=(203, 39, 51),
    )  # left half red base
    d.polygon(
        [(x, py), (x, py + ph), (x + pw, py + ph)],
        fill=(19, 19, 19),
    )  # right half black
    # golden-yellow stripes (left = black stripe + yellow stripe; right = red stripe + yellow stripe)
    d.polygon(
        [(x, py + 2), (x - pw + 4, py + ph - 2), (x - pw + 1, py + ph - 2), (x - 1, py + 4)],
        fill=(19, 19, 19),
    )
    d.polygon(
        [(x - 1, py + 4), (x - pw + 4, py + ph - 2), (x - pw, py + ph), (x, py + 6)],
        fill=(246, 200, 18),
    )
    d.polygon(
        [(x + 1, py + 4), (x + pw - 4, py + ph - 2), (x + pw - 1, py + ph - 2), (x + 1, py + 4)],
        fill=(203, 39, 51),
    )
    d.polygon(
        [(x + 1, py + 4), (x + pw - 4, py + ph - 2), (x + pw, py + ph), (x, py + 6)],
        fill=(246, 200, 18),
    )
    # head
    hr = int(8 * s)
    d.ellipse([x - hr, base_y - int(66 * s) - hr, x + hr, base_y - int(66 * s) + hr], fill=skin)


scouts = [(110, 470, 1.0), (150, 480, 0.9), (200, 472, 1.05), (255, 484, 0.92)]
for x, by, sc in scouts:
    draw_scout(x, by, sc)

# 8. A scout kneeling inspecting a clue (right side)
kx, ky = 360, 478
d.rectangle([kx - 9, ky - 22, kx + 9, ky], fill=(24, 36, 78))  # jeans
d.rectangle([kx - 13, ky - 40, kx + 13, ky - 22], fill=(188, 192, 198))  # shirt
hr = 8
d.ellipse([kx - hr, ky - 56 - hr, kx + hr, ky - 56 + hr], fill=(224, 188, 150))
# pañolín smaller
pw, ph = 14, 9
py = ky - 58
d.polygon([(kx, py), (kx - pw, py + ph), (kx + pw, py + ph)], fill=(203, 39, 51))
d.polygon([(kx, py), (kx, py + ph), (kx + pw, py + ph)], fill=(19, 19, 19))

# 9. Paper clue tokens scattered (small light rectangles on ground)
for (cx, cy) in [(178, 498), (280, 516), (388, 506)]:
    d.rectangle([cx - 10, cy - 6, cx + 10, cy + 6], fill=(245, 240, 220))
    d.line([(cx - 8, cy), (cx + 8, cy)], fill=(170, 160, 140))
    d.line([(cx, cy - 4), (cx, cy + 4)], fill=(170, 160, 140))

# 10. Clue marker poles with banderins (small flag triangle markers)
def draw_marker(x, base_y, color):
    d.rectangle([x - 2, base_y - 56, x + 2, base_y], fill=(180, 160, 110))
    d.polygon([(x + 2, base_y - 56), (x + 22, base_y - 48), (x + 2, base_y - 40)], fill=color)

draw_marker(70, 510, (246, 200, 18))
draw_marker(320, 520, (203, 39, 51))
draw_marker(470, 512, (246, 200, 18))

# 11. Torch glow near the kneeling scout
for r in range(60, 8, -2):
    a = max(2, 18 - r // 4)
    d.ellipse([kx - r, ky - 70 - r, kx + r, ky - 70 + r], fill=(255, 220, 90, a))

# 12. The Flag of Rapa Nui (Te Reva Reimiro): white field, crimson Reimiro.
# Drawn on a small pole planted at the scene's right edge as a scouting marker.
fx, fy = 486, 380
d.rectangle([fx - 2, fy - 70, fx + 2, fy], fill=(170, 145, 95))  # pole
# white cloth
cloth_w, cloth_h = 64, 40
cx0, cy0, cx1, cy1 = fx + 2, fy - 70, fx + 2 + cloth_w, fy - 70 + cloth_h
d.rectangle([cx0, cy0, cx1, cy1], fill=(255, 255, 255))
# Reimiro (stylized crescent with two anthropomorphic heads at the tips)
rim_y = (cy0 + cy1) // 2
# crescent body (crimson)
d.arc(
    [cx0 + 6, rim_y - 12, cx1 - 6, rim_y + 12],
    start=200, end=340, fill=(255, 0, 0), width=4,
)
d.arc(
    [cx0 + 10, rim_y - 8, cx1 - 10, rim_y + 8],
    start=20, end=160, fill=(255, 0, 0), width=4,
)
# heads at the two tips
for hx in (cx0 + 8, cx1 - 8):
    d.ellipse([hx - 4, rim_y - 5, hx + 4, rim_y + 5], fill=(255, 0, 0))

# 13. Caption text on the illustration (Spanish only) - discreet title tag
try:
    font = ImageFont.truetype("arialbd.ttf", 18)
except IOError:
    font = ImageFont.load_default()
# Small parchment-like ribbon at top-left with the mission name
ribbon_w, ribbon_h = 270, 26
d.rectangle([14, 14, 14 + ribbon_w, 14 + ribbon_h], fill=(248, 238, 204))
d.rectangle([14, 14, 14 + ribbon_w, 14 + 4], fill=(203, 39, 51))
d.text((22, 18), "MISION: RESCATAR AL BOTANICO", font=font, fill=(20, 24, 30))

# Save as JPG
out_path = sys.argv[1] if len(sys.argv) > 1 else "el_secuestro_base.jpg"
img.convert("RGB").save(out_path, "JPEG", quality=88, progressive=True)
print(f"Saved base illustration to: {out_path}")