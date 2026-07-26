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
# 1. Corporalidad: "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas."
# 2. Carácter: "Enfrenta la vida con alegría y sentido del humor."
# 3. Sociabilidad: "Vive su libertad de un modo solidario..."

raw_queries = [
    # --- UMBRELLA 1: CORPORALIDAD ---
    ("actividades deportivas y recreativas", "Manada", "Media", "Corriendo velozmente entre las bases para alcanzar los pañolines en el tiempo límite."),
    ("actividades deportivas y recreativas", "Manada", "Tardía", "Ejercitando mi velocidad de aceleración y puntería de lanzamiento al aire libre."),
    ("actividades deportivas y recreativas", "Tropa", "11 a 13", "Desarrollando resistencia física y velocidad de reacción en las carreras por equipo."),
    ("actividades deportivas y recreativas", "Tropa", "13 a 15", "Esforzándome por superar mi rendimiento físico respetando el fair play."),
    ("actividades deportivas y recreativas", "Compañía", "11 a 13", "Demostrando agilidad corporal y coordinación de pases con la pelota."),
    ("actividades deportivas y recreativas", "Compañía", "13 a 15", "Coordinando desplazamientos rápidos y estrategias de interceptación."),
    ("actividades deportivas y recreativas", "Avanzada", "15 a 17", "Liderando dinámicas de competencia deportiva intensa en el grupo."),

    # --- UMBRELLA 2: CARÁCTER ---
    ("sentido del humor", "Manada", "Media", "Disfrutando con alegría del juego de carreras sin importar quién gane la ronda."),
    ("sentido del humor", "Manada", "Tardía", "Manteniendo un espíritu alegre y entusiasta al recorrer las esquinas."),
    ("sentido del humor", "Tropa", "11 a 13", "Aceptando los resultados de cada carrera con sentido del humor y deportividad."),
    ("sentido del humor", "Tropa", "13 a 15", "Animando con energía a los compañeros de equipo durante sus lanzamientos."),
    ("sentido del humor", "Compañía", "11 a 13", "Viviendo la competencia fraterna con optimismo y desinhibición."),
    ("sentido del humor", "Compañía", "13 a 15", "Afrontando los momentos intensos del juego con madurez y buen ánimo."),
    ("sentido del humor", "Avanzada", "15 a 17", "Propiciando un clima festivo de camaradería y juego limpio."),

    # --- UMBRELLA 3: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Manada", "Media", "Respetando los turnos de carrera de todos los lobatos de la seisena."),
    ("libertad de un modo solidario", "Manada", "Tardía", "Apoyando y colaborando con los compañeros para completar la recolección."),
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Respetando las decisiones de los árbitros y las reglas del cuadrilátero."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Fomentando la inclusión activa y la cooperación táctica en la patrulla."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Promoviendo el trabajo en equipo y el apoyo recíproco en el campo."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Velando por el cumplimiento honesto de las reglas del juego."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Organizando el juego con sentido de justicia y respeto solidario por todos.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>Cuatro Esquinas</strong> es un vibrante juego scout de campo abierto que combina la velocidad de carrera, la estrategia de lanzamientos y la agilidad de recolección en equipo. Dos patrullas se enfrentan en un cuadrilátero delimitado para desafiar sus reflejos y coordinación.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Delimitación del Terreno:</strong> Se delimita un cuadrado de 15 metros por lado colocados en las esquinas cuatro pañolines sobre el césped.</li>
  <li><strong>Formación de Equipos:</strong> El Equipo A (corredores) se alinea fuera del cuadrado en una fila. El Equipo B (defensores) se dispersa tácticamente por el terreno.</li>
  <li><strong>Lanzamiento y Carrera:</strong> El primer corredor del Equipo A lanza la pelota lo más lejos posible dentro del campo y comienza a correr a máxima velocidad alrededor del cuadrado para tocar los cuatro pañolines de las esquinas.</li>
  <li><strong>La Interceptación:</strong> Los defensores del Equipo B deben tomar la pelota lo más rápido posible y, pasándola entre ellos sin dar pasos sosteniendo el balón, intentar quemar o tocar al corredor antes de que complete el recorrido por las cuatro esquinas.</li>
  <li><strong>Rotación:</strong> Una vez que han corrido todos los integrantes de un equipo, se intercambian los roles. Gana el equipo que logre recolectar la mayor cantidad de pañolines completando carreras limpias.</li>
</ol>"""

variaciones_detalladas = """Cuatro Esquinas por Parejas: Los corredores avanzan tomados de la mano, exigiendo una aceleración y coordinación sincronizada entre ambos participantes.

Carrera Nocturna con Linternas: Se juega al anochecer iluminando únicamente las esquinas con linternas de campamento para agudizar los sentidos.

Lanzamiento de Pañolín Lastrado: En lugar de una pelota, se utiliza un pañolín con un nudo pesado para exigir precisión en los pases."""

recomendaciones_detalladas = """Seguridad y Pases Limpios: Exigir firmemente que los lanzamientos para tocar al corredor sean suaves y dirigidos del torso hacia abajo. Jamás se permiten lanzamientos a la cabeza.

Terreno Despejado: Inspeccionar previamente que el cuadrilátero esté libre de piedras o irregularidades que puedan provocar tropezones durante la carrera.

Animación en Equipo: Motivar a los jugadores en reserva a cantar y animar a sus compañeros de fila durante cada carrera."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "20 minutos",
    "cantidad": "16 participantes",
    "lugares": ["Exterior", "campo delimitado"],
    "materiales": ["Pañolines", "Pelota"],
    "areas": ["Corporalidad", "Carácter", "Sociabilidad"],
    "objetivos": [
        "Refuerzo de habilidades físicas",
        "Favorecer el trabajo en equipo",
        "Estimular la capacidad de reacción",
        "Estrategia y planificación"
    ],
    "justificacion_areas": "Cuatro Esquinas estimula la corporalidad al ejercitar la velocidad de aceleración, la precisión de pases y la resistencia física. Fortalece el carácter al promover el sentido del humor y el fair play ante la presión de la carrera, y desarrolla la sociabilidad al afianzar la coordinación táctica y la cooperación entre compañeros.",
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

  DELETE FROM articulos WHERE slug = 'cuatro-esquinas';

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
    'Cuatro Esquinas',
    'cuatro-esquinas',
    $html${contenido_html_puro}$html$,
    'Un vibrante juego scout de campo abierto donde dos equipos compiten lanzando la pelota y corriendo por las esquinas del terreno.',
    '/uploads/actividad_cuatroEsquinas.webp',
    'publicado',
    ARRAY['juego-fisico', 'carrera', 'equipo', 'panolines', 'exterior'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos (ID: 7), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_cuatro_esquinas.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for Cuatro Esquinas generated cleanly with authentic UUIDs.")
