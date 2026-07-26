import subprocess
import json
import sys
sys.path.append('supabase')
from process_template_image import process_article_image_py

# 1. Process image with the new official Chilean title
raw_img = r'C:\Users\claud\.gemini\antigravity-cli\brain\1a6629cd-bb47-41eb-8e2a-da64d2f5d41e\caza_panoleras_v2_1784936488489.jpg'
out_img = r'frontend/public/uploads/actividad_cazaPanolines.webp'
process_article_image_py(raw_img, out_img, 'Caza de Pañolines: Lucha de Exploradores', 'Juegos')

# 2. Query Postgres directly for authentic objective UUIDs
def get_real_objective(texto_terminal_like, unidad_name, rango_edad_like=None):
    sql = f"""
    SELECT po.id, po.texto_infantil, po.texto_terminal, po.rango_edad, pa.nombre as area, u.nombre as unidad
    FROM progresion_objetivos po
    JOIN progresion_areas pa ON po.area_id = pa.id
    JOIN unidades u ON po.unidad_id = u.id
    WHERE po.texto_terminal ILIKE '%{texto_terminal_like}%'
      AND u.nombre = '{unidad_name}'
    """
    if rango_edad_like:
        sql += f" AND po.rango_edad ILIKE '%{rango_edad_like}%'"
    sql += " LIMIT 1;"

    cmd = ["docker", "exec", "-i", "supabase_db_nuamana-local", "psql", "-U", "postgres", "-d", "postgres", "-t", "-A", "-c", sql]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    line = res.stdout.strip()
    if not line:
        print(f"WARNING: Objective not found for {texto_terminal_like} | {unidad_name} | {rango_edad_like}")
        return None
    parts = line.split('|')
    return {
        "id": parts[0],
        "texto": parts[1],
        "texto_terminal": parts[2],
        "rango_edad": parts[3],
        "area": parts[4],
        "unidad": parts[5]
    }

raw_queries = [
    # --- UMBRELLA 1: CORPORALIDAD ---
    ("actividades deportivas y recreativas", "Manada", "Media", "Desplegando agilidad y reflejos rápidos al esquivar a mis compañeros en la caza de pañolines."),
    ("actividades deportivas y recreativas", "Manada", "Tardía", "Jugando con entusiasmo respetando las reglas del juego de pañolines."),
    ("actividades deportivas y recreativas", "Tropa", "11 a 13", "Ejercitando mi resistencia física y velocidad de reacción en el torneo de pañolines."),
    ("actividades deportivas y recreativas", "Tropa", "13 a 15", "Esforzándome por mejorar mi rendimiento físico manteniendo el juego limpio al ganar y perder."),
    ("actividades deportivas y recreativas", "Compañía", "11 a 13", "Demostrando equilibrio y destreza corporal al capturar el pañolín de mis oponentes."),
    ("actividades deportivas y recreativas", "Compañía", "13 a 15", "Coordinando movimientos ágiles con mi patrulla en la modalidad de ciempiés."),
    ("actividades deportivas y recreativas", "Avanzada", "15 a 17", "Liderando dinámicas físicas de alta intensidad y competencia sana en la comunidad."),

    # --- UMBRELLA 2: CARÁCTER ---
    ("sentido del humor", "Manada", "Media", "Disfrutando alegremente del juego sin molestarme si me quitan el pañolín."),
    ("sentido del humor", "Manada", "Tardía", "Manteniendo una actitud positiva y risueña durante toda la actividad."),
    ("sentido del humor", "Tropa", "11 a 13", "Aceptando los resultados del torneo con espíritu fraterno y sentido del humor."),
    ("sentido del humor", "Tropa", "13 a 15", "Promoviendo el buen ánimo y el compañerismo en las batallas por patrulla."),
    ("sentido del humor", "Compañía", "11 a 13", "Riendo y compartiendo momentos divertidos con mis compañeras de equipo."),
    ("sentido del humor", "Compañía", "13 a 15", "Enfrentando los desafíos físicos con optimismo y respeto por las oponentes."),
    ("sentido del humor", "Avanzada", "15 a 17", "Fomentando un clima recreativo de camaradería y juego limpio."),

    # --- UMBRELLA 3: CREATIVIDAD ---
    ("agilidad mental", "Manada", "Media", "Reaccionando con rapidez de reflejos para esquivar los intentos de mis compañeros."),
    ("agilidad mental", "Manada", "Tardía", "Ideando fintas y amagos corporales sencillos durante el duelo."),
    ("agilidad mental", "Tropa", "11 a 13", "Anticipando los movimientos del rival y adaptando mi posición táctica en el terreno."),
    ("agilidad mental", "Tropa", "13 a 15", "Diseñando estrategias de defensa y ataque coordinado en la formación en cuña."),
    ("agilidad mental", "Compañía", "11 a 13", "Desarrollando agilidad de pensamiento para reaccionar velozmente en espacios reducidos."),
    ("agilidad mental", "Compañía", "13 a 15", "Proponiendo tácticas creativas de protección del pañolín en equipo."),
    ("agilidad mental", "Avanzada", "15 a 17", "Analizando patrones de movimiento del oponente para resolver situaciones complejas de competencia.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>Caza de Pañolines: Lucha de Exploradores</strong> es un vibrante y clásico juego scout de competencia física, velocidad, agilidad y reflejos. Los participantes se enfrentan en un cuadrilátero acotado intentando arrebatar el pañolín colocado en la cintura del oponente mientras protegen el suyo, fomentando el juego limpio y el trabajo en equipo.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Delimitación del Área:</strong> Se marca un espacio cuadrado en el césped o terreno plano. Todos los jugadores colocan un pañolín en la parte trasera de su cinturón, dejando colgar al menos dos tercios de la tela para que sea fácil de tomar.</li>
  <li><strong>Modalidad Individual (Todos contra Todos o Torneo):</strong> A la señal del dirigente, los jugadores se desplazan dentro del perímetro buscando quitar el pañolín de sus oponentes sin golpear ni realizar agarres bruscos. Quien pierde su pañolín queda temporalmente eliminado o entrega un punto.</li>
  <li><strong>Modalidad en Cuña (Ciempiés de Patrulla):</strong> La patrulla o equipo de 6 integrantes forma una fila tomada firmemente de la cintura. El último participante de la fila lleva el pañolín. La patrulla debe moverse como un ciempiés coordinado para intentar quitar el pañolín de la cuña rival sin desarmar su propia formación.</li>
  <li><strong>Cierre:</strong> Gana el participante o la patrulla que acumule más pañolines al finalizar el tiempo estipulado.</li>
</ol>"""

variaciones_detalladas = """Pelea de Pañolín en el Tobillo: El pañolín se ata suavemente alrededor de un tobillo. Esta variante exige mayor agilidad de piernas, giros rápidos y flexibilidad.

Desafío por Parejas Espalda con Espalda: Dos scouts se toman de los brazos por la espalda e intentan quitar los pañolines de otras parejas sin romper el agarre de sus brazos.

Batalla Nocturna con Linternas: Se realiza al atardecer utilizando pañolines fluorescentes o reflectantes para agudizar la visión periférica."""

recomendaciones_detalladas = """Seguridad y Juego Limpio: Los dirigentes deben recalcar que está strictly prohibido el juego rudo, empujones, zancadillas o agarres de ropa. Solo se permite el tirón limpio sobre la tela del pañolín.

Terreno Adecuado: Jugar siempre sobre superficies blandas (césped o arena) libres de piedras, hoyos o troncos para evitar caídas o torceduras.

Inclusividad: Ajustar el tamaño del cuadrilátero según la cantidad de participantes para asegurar dinamismo y evitar aglomeraciones complejas."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "20 minutos",
    "cantidad": "12 participantes",
    "lugares": ["Exterior", "campo delimitado"],
    "materiales": ["Pañolines"],
    "areas": ["Corporalidad", "Carácter", "Creatividad"],
    "objetivos": [
        "Refuerzo de habilidades físicas",
        "Estimular la agilidad mental",
        "Fomentar un entorno de confianza",
        "Favorecer el trabajo en equipo"
    ],
    "justificacion_areas": "La Caza de Pañolines estimula la corporalidad al desarrollar velocidad de reacción, coordinación y equilibrio en terreno abierto. Fortalece el carácter al promover el respeto riguroso a las reglas de juego limpio y la aceptación alegre del resultado, y desarrolla la creatividad táctica al idear estrategias de amago y defensa en equipo.",
    "variaciones": variaciones_detalladas,
    "recomendaciones": recomendaciones_detalladas,
    "objetivos_educativos": objetivos_educativos
}

json_str = json.dumps(metadata_json, ensure_ascii=False)

sql_script = f"""SET client_encoding = 'UTF8';

DO $$
DECLARE
  v_admin_id UUID;
  v_articulo_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM perfiles WHERE rol_id = 1 LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM perfiles LIMIT 1;
  END IF;

  DELETE FROM articulos WHERE slug IN ('caza-de-panoleras-lucha-de-exploradores', 'caza-de-panolines-lucha-de-exploradores');

  v_articulo_id := uuid_generate_v4();

  INSERT INTO articulos (
    id,
    autor_id,
    categoria_id,
    titulo,
    slug,
    contenido,
    extracto,
    imagen_destacada,
    estado,
    etiquetas,
    metadata
  ) VALUES (
    v_articulo_id,
    v_admin_id,
    NULL,
    'Caza de Pañolines: Lucha de Exploradores',
    'caza-de-panolines-lucha-de-exploradores',
    $html${contenido_html_puro}$html$,
    'Un dinámico juego físico scout de agilidad, reflejos y juego limpio donde los competidores buscan arrebatar el pañolín del oponente.',
    '/uploads/actividad_cazaPanolines.webp',
    'publicado',
    ARRAY['juego-fisico', 'agilidad', 'panolines', 'patrulla', 'exterior'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos (ID: 7), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_caza_panolines_v11.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("Chilean vocabulary update complete: SQL generated for Caza de Pañolines: Lucha de Exploradores.")
