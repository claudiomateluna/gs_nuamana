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
    ("actividades deportivas y recreativas", "Manada", "Media", "Ejercitando mi equilibrio corporal al mantenerme en cuclillas durante el duelo de gallitos."),
    ("actividades deportivas y recreativas", "Manada", "Tardía", "Desarrollando fuerza física controlada y reflejos ágiles en el campo de juego."),
    ("actividades deportivas y recreativas", "Tropa", "11 a 13", "Fortaleciendo mi resistencia y estabilidad al competir fraternalmente por parejas."),
    ("actividades deportivas y recreativas", "Tropa", "13 a 15", "Esforzándome por superar mis capacidades físicas manteniendo el juego limpio."),
    ("actividades deportivas y recreativas", "Compañía", "11 a 13", "Demostrando destreza corporal y coordinación motriz en los empujes de hombros."),
    ("actividades deportivas y recreativas", "Compañía", "13 a 15", "Perfeccionando el control del centro de gravedad y el equilibrio dinámico."),
    ("actividades deportivas y recreativas", "Avanzada", "15 a 17", "Promoviendo competencias físicas sanas y recreativas en el entorno caminante."),

    # --- UMBRELLA 2: CARÁCTER ---
    ("sentido del humor", "Manada", "Media", "Aceptando con risas y buena disposición las caídas sobre el césped sin enfadarme."),
    ("sentido del humor", "Manada", "Tardía", "Disfrutando alegremente del juego en cuclillas compartiendo con mis compañeros."),
    ("sentido del humor", "Tropa", "11 a 13", "Asumiendo los resultados de los duelos con espíritu deportivo y sentido del humor."),
    ("sentido del humor", "Tropa", "13 a 15", "Fomentando el compañerismo y el respeto mutuo durante la competencia por patrullas."),
    ("sentido del humor", "Compañía", "11 a 13", "Riendo y viviendo la experiencia con optimismo y desinhibición."),
    ("sentido del humor", "Compañía", "13 a 15", "Enfrentando los desafíos físicos con caballerosidad y madurez emocional."),
    ("sentido del humor", "Avanzada", "15 a 17", "Generando un clima distendido de distensión y camaradería grupal."),

    # --- UMBRELLA 3: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Manada", "Media", "Cuidando a mi compañero de duelo evitando empujones bruscos o peligrosos."),
    ("libertad de un modo solidario", "Manada", "Tardía", "Respetando las reglas del juego limpio para garantizar la seguridad de todos."),
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Promoviendo el respeto y la consideración por la integridad del rival."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Apoyando y animando con entusiasmo a los integrantes de la patrulla."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Fomentando la solidaridad y el fair play en las actividades al aire libre."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Velando por el bienestar y el juego limpio de las oponentes."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Liderando dinámicas de competencia fraterna basándose en el respeto mutuo.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>Duelo de Gallitos</strong> es un divertido y clásico juego scout de equilibrio, agilidad física y fuerza suave por parejas. Se realiza en terrenos blandos al aire libre donde los competidores desafían su estabilidad en posición de cuclillas sin perder el control.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Posición Inicial:</strong> Dos participantes se ubican frente a frente a un metro de distancia dentro de un pequeño círculo marcado en el césped. Ambos se colocan en cuclillas tomándose los tobillos o cruzando los brazos sobre el pecho.</li>
  <li><strong>El Duelo:</strong> A la señal del dirigente, ambos jugadores avanzan en cuclillas e intentan desestabilizar al oponente mediante suaves empujones con los hombros o las palmas de las manos.</li>
  <li><strong>Condiciones de Victoria:</strong> Un jugador gana la ronda si su oponente pierde el equilibrio tocando el suelo con las rodillas o manos, se sale del círculo marcado, o suelta el agarre de los tobillos.</li>
  <li><strong>Rotación por Rondas:</strong> Se realizan duelos cortos de un minuto y los ganadores avanzan de ronda en un torneo amistoso por patrullas.</li>
</ol>"""

variaciones_detalladas = """Gallitos sobre un Pie: En lugar de estar en cuclillas, los participantes se sostienen sobre un solo pie tomándose el otro tobillo con una mano.

Duelo por Equipos (Todos contra Todos): Todas las parejas entran al cuadrilátero simultáneamente en cuclillas; gana el último "gallito" que quede en pie sin caer.

Duelo de Pañolín: Cada competidor lleva un pañolín colocado en el hombro; el objetivo es quitar el pañolín del rival sin perder el equilibrio en cuclillas."""

recomendaciones_detalladas = """Supervisión Directa de Seguridad: Es indispensable verificar que los participantes no utilicen cabezazos, empujones violentos ni zancadillas. Solo se permite el empuje limpio de palmas y hombros.

Superficie Adecuada: Realizar el juego exclusivamente sobre césped mullido, arena o colchonetas recreativas para amortiguar suavemente las caídas.

Fomento del Juego Limpio: Felicitar la caballerosidad scout y la risa compartida tras cada duelo, promoviendo el estrechamiento de manos al finalizar."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "15 minutos",
    "cantidad": "12 participantes",
    "lugares": ["Exterior", "campo delimitado"],
    "materiales": ["Sin Materiales"],
    "areas": ["Corporalidad", "Carácter", "Sociabilidad"],
    "objetivos": [
        "Refuerzo de habilidades físicas",
        "Estimular la agilidad mental",
        "Fomentar un entorno de confianza",
        "Favorecer el trabajo en equipo"
    ],
    "justificacion_areas": "Duelo de Gallitos estimula la corporalidad al poner a prueba la fuerza suave, la estabilidad del centro de gravedad y el equilibrio en cuclillas. Fortalece el carácter al promover el sentido del humor ante las caídas cómicas y el respeto a las reglas, y desarrolla la sociabilidad al afianzar la caballerosidad y la convivencia limpia.",
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

  DELETE FROM articulos WHERE slug = 'duelo-de-gallitos';

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
    'Duelo de Gallitos',
    'duelo-de-gallitos',
    $html${contenido_html_puro}$html$,
    'Un divertido juego scout de agilidad, fuerza suave y equilibrio en cuclillas donde los competidores buscan desestabilizar al oponente.',
    '/uploads/actividad_dueloGallitos.webp',
    'publicado',
    ARRAY['juego-fisico', 'equilibrio', 'parejas', 'exterior', 'agilidad'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos (ID: 7), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_duelo_gallitos.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for Duelo de Gallitos generated cleanly with authentic UUIDs.")
