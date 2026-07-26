import xml.etree.ElementTree as ET

tree = ET.parse('frontend/public/images/ref/panolin_nua.svg')
root = tree.getroot()

classes = {
    "cls-1": "#c24136 (ROJO)",
    "cls-2": "#131d1e (AZUL MARINO)",
    "cls-3": "#f6c812 (AMARILLO DORADO)"
}

paths = root.findall('.//{http://www.w3.org/2000/svg}path')

print(f"Total paths in SVG: {len(paths)}\n")
for i, p in enumerate(paths):
    c = p.attrib.get('class', '')
    color_desc = classes.get(c, 'DESCONOCIDO')
    d = p.attrib.get('d', '')
    print(f"Path #{i+1:2d} | Clase: {c:<6} ({color_desc:<25}) | D: {d[:80]}...")
