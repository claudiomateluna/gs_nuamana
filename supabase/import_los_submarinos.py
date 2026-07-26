import subprocess
import json
import sys
sys.path.append('supabase')
from process_template_image import process_article_image_py

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

# 3 Core Umbrellas:
# 1. Sociabilidad: "libertad de un modo solidario"
# 2. Carácter: "sentido del humor"
# 3. Corporalidad: "actividades deportivas y recreativas"

raw_queries = [
    # --- UMBRELLA 1: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Manada", "Media", "Depositando mi confianza total en el timonel de mi seisena mientras camino a ciegas."),
    ("libertad de un modo solidario", "Manada", "Tardía", "Guiando a mis compañeros vendados con instrucciones claras y seguras."),
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Coordinando los desplazamientos de la patrulla mediante señales no verbales."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Fortaleciendo la confianza recíproca entre todos los integrantes de la patrulla."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Aceptando ser guiada a ciegas por mis compañeras en el terreno de juego."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Asumiendo con responsabilidad el liderazgo de conducción del equipo."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Fomentando un ambiente de alta confianza y cohesión en la patrulla."),
    ("libertad de un modo solidario", "Clan", "17 a 20", "Promoviendo el respeto por los derechos y la autonomía de cada caminante durante la navegación."),

    # --- UMBRELLA 2: CARÁCTER ---
    ("sentido del humor", "Manada", "Media", "Disfrutando con entusiasmo del juego a ciegas y riéndome de los encuentros cómicos."),
    ("sentido del humor", "Manada", "Tardía", "Reaccionando con alegría y serenidad ante las sorpresas de la travesía a ciegas."),
    ("sentido del humor", "Tropa", "11 a 13", "Viviendo la dinámica con deportividad y excelente ánimo en equipo."),
    ("sentido del humor", "Tropa", "13 a 15", "Demostrando templanza y buen humor durante la maniobra táctica."),
    ("sentido del humor", "Compañía", "11 a 13", "Compartiendo momentos de risa fraterna durante los giros y choques suaves."),
    ("sentido del humor", "Compañía", "13 a 15", "Manteniendo una actitud positiva y resiliente ante cualquier desorientación."),
    ("sentido del humor", "Avanzada", "15 a 17", "Promoviendo el compañerismo alegre y la autocontención en el juego."),
    ("sentido del humor", "Clan", "17 a 20", "Enfrentando los desafíos complejos con optimismo, madurez y alegría serena."),

    # --- UMBRELLA 3: CORPORALIDAD ---
    ("actividades deportivas y recreativas", "Manada", "Media", "Desarrollando la orientación espacial al desplazarme con pañolín en los ojos."),
    ("actividades deportivas y recreativas", "Manada", "Tardía", "Perfeccionando la marcha a ciegas manteniendo el equilibrio y el contacto físico."),
    ("actividades deportivas y recreativas", "Tropa", "11 a 13", "Ejercitando la percepción auditiva y táctil en el desplazamiento en fila."),
    ("actividades deportivas y recreativas", "Tropa", "13 a 15", "Coordinando la velocidad de marcha sincronizada con todo el grupo."),
    ("actividades deportivas y recreativas", "Compañía", "11 a 13", "Ajustando mi postura y pasos a las señales recibidas en los hombros."),
    ("actividades deportivas y recreativas", "Compañía", "13 a 15", "Manteniendo la estabilidad física y el ritmo al avanzar sin apoyo visual."),
    ("actividades deportivas y recreativas", "Avanzada", "15 a 17", "Liderando con destreza física el movimiento envolvente de la patrulla."),
    ("actividades deportivas y recreativas", "Clan", "17 a 20", "Manteniendo una condición física óptima al participar en actividades recreativas de alto rendimiento.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>Los Submarinos</strong> es un apasionante juego scout de confianza, comunicación no verbal y táctica de patrulla. En él, cada equipo forma una "tripulación" que debe navegar por el terreno de juego con los ojos vendados, confiando ciegamente en la guía silenciosa o verbal de su capitán posicionado al final de la fila.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Formación de la Tripulación:</strong> Cada patrulla o seisena forma una fila india tomándose firmemente de la cintura o de los hombros.</li>
  <li><strong>La Venda del Pañolín:</strong> Todos los participantes de la fila se cubren los ojos con sus <strong>pañolines</strong> para quedar completamente a ciegas, a excepción del último participante (el Capitán del Submarino).</li>
  <li><strong>Navegación y Objetivo:</strong> El objetivo de cada submarino es maniobrar por el campo para envolver o interceptar el centro de los submarinos rivales, evitando a su vez ser envuelto por los demás.</li>
  <li><strong>El Código del Capitán:</strong> El capitán guía la nave utilizando comandos de voz ("¡Avante!", "¡Virar a la derecha!", "¡Detenerse!") o mediante toques táctiles en los hombros del compañero de enfrente, quienes transmiten la señal en cadena hacia el participante que encabeza la fila.</li>
  <li><strong>Victoria:</strong> El submarino que demuestre mayor agilidad de maniobra, mantenga su fila unida y logre cercar a sus oponentes sin romper la cadena gana la ronda.</li>
</ol>"""

variaciones_detalladas = """<b>Navegación Silenciosa (Código Táctil):</b> En lugar de usar la voz, el capitán transmite las órdenes mediante toques en los hombros del penúltimo jugador, transmitiendo el código en cadena: 1 toque en el hombro derecho = girar a la derecha; 1 toque en el hombro izquierdo = girar a la izquierda; 2 toques simultáneos = detenerse.

<b>Submarino con Recolección de Torpedos:</b> Se esparcen pelotas o globos en el terreno de juego. El primer jugador a ciegas debe ser guiado para agacharse y recoger los objetos sin colisionar con otros equipos.

<b>Submarinos de Flota Mixta:</b> Se unen dos seisenas o patrullas para formar un super-submarino de 8 a 10 personas, poniendo a prueba la transmisión de señales a lo largo de una cadena más extensa."""

recomendaciones_detalladas = """<b>Inspección del Terreno:</b> Asegurar que el área de juego esté completamente libre de baches, ramas bajas u obstáculos peligrosos para evitar tropiezos de los jugadores a ciegas.

<b>Lanzamientos y Contacto Seguro:</b> Velar por que los toques entre submarinos sean siempre respetuosos y envolventes. Queda strictly prohibido empujar o correr bruscamente hacia los oponentes.

<b>Rotación del Capitán:</b> Permitir que distintos integrantes de la patrulla asuman el rol de capitán en cada ronda para que todos experimenten tanto la conducción como la confianza de dejarse guiar."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada", "clan"],
    "duracion": "25 minutos",
    "cantidad": "16 participantes",
    "lugares": ["Exterior", "campo abierto"],
    "materiales": ["Pañolines"],
    "areas": ["Sociabilidad", "Carácter", "Corporalidad"],
    "objetivos": [
        "Estimular la confianza",
        "Favorecer el trabajo en equipo",
        "Estimular la agilidad mental",
        "Fomentar la comunicación en el grupo"
    ],
    "justificacion_areas": "Los Submarinos promueve la sociabilidad al consolidar la confianza mutua y la comunicación efectiva en equipo. Desarrolla el carácter al ejercitar la serenidad, la deportividad y el liderazgo responsable ante situaciones de incertidumbre visual, y estimula la corporalidad al requerir orientación espacial, coordinación postural y marcha sincronizada.",
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

  DELETE FROM articulos WHERE slug = 'los-submarinos';

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
    'Los Submarinos',
    'los-submarinos',
    $html${contenido_html_puro}$html$,
    'Un apasionante juego scout de confianza y coordinación donde equipos a ciegas navegan guiados por su capitán.',
    '/uploads/actividad_losSubmarinos.webp',
    'publicado',
    ARRAY['juego-de-confianza', 'trabajo-en-equipo', 'panolines', 'exterior', 'patrulla'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos (ID: 7), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_los_submarinos.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for Los Submarinos generated cleanly with authentic UUIDs including Clan.")
