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
    ("actividades deportivas y recreativas", "Manada", "Media", "Desplegando velocidad de reacción al correr hacia la serpiente al escuchar la señal del dirigente."),
    ("actividades deportivas y recreativas", "Manada", "Tardía", "Participando con destreza física respetando las reglas de eliminación del juego."),
    ("actividades deportivas y recreativas", "Tropa", "11 a 13", "Ejercitando mi agilidad corporal y reflejos rápidos en la carrera por las cuerdas."),
    ("actividades deportivas y recreativas", "Tropa", "13 a 15", "Esforzándome por mejorar mi rendimiento físico manteniendo el juego limpio."),
    ("actividades deportivas y recreativas", "Compañía", "11 a 13", "Demostrando rapidez y flexibilidad en el terreno delimitado."),
    ("actividades deportivas y recreativas", "Compañía", "13 a 15", "Coordinando impulsos velozmente durante los duelos de desempate."),
    ("actividades deportivas y recreativas", "Avanzada", "15 a 17", "Liderando pruebas de agilidad física recreativa con entusiasmo en la comunidad."),

    # --- UMBRELLA 2: CARÁCTER ---
    ("sentido del humor", "Manada", "Media", "Tomando con alegría y risas la eliminación temporal del juego."),
    ("sentido del humor", "Manada", "Tardía", "Manteniendo un espíritu alegre y deportivo durante las distintas rondas."),
    ("sentido del humor", "Tropa", "11 a 13", "Aceptando los resultados del juego con caballerosidad y sentido del humor."),
    ("sentido del humor", "Tropa", "13 a 15", "Animando a los compañeros eliminados a continuar apoyando desde el exterior."),
    ("sentido del humor", "Compañía", "11 a 13", "Disfrutando momentos de distensión y camaradería con la patrulla."),
    ("sentido del humor", "Compañía", "13 a 15", "Afrontando las pruebas rápidas con optimismo y juego limpio."),
    ("sentido del humor", "Avanzada", "15 a 17", "Propiciando un clima grato y festivo durante las dinámicas grupales."),

    # --- UMBRELLA 3: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Manada", "Media", "Compartiendo el espacio de carrera de forma respetuosa sin empujar a mis compañeros."),
    ("libertad de un modo solidario", "Manada", "Tardía", "Respetando los derechos de todos los lobatos a participar en igualdad de condiciones."),
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Respetando las decisiones de los árbitros y dirigentes durante los desempates."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Promoviendo el respeto por el esfuerzo de cada integrante de la unidad."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Fomentando el fair play y la consideración por las compañeras."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Favoreciendo un ambiente seguro donde se respete la integridad de todos."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Asumiendo actitudes solidarias y colaborativas durante las actividades de campamento.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>La Cazadora de Serpientes: Reflejos al Acecho</strong> es un apasionante y dinámico juego scout de agilidad, atención alerta y velocidad de reacción. Los participantes orbitan en un círculo alrededor de un conjunto de cuerdas dispersas en el terreno, compitiendo velozmente por capturar una al escuchar la señal auditiva del dirigente.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Preparación:</strong> Se colocan en el centro del terreno tantas cuerdas (llamadas "serpientes") como participantes haya en el juego, menos una. Los jugadores forman un gran círculo rodeando el área a 5 metros de distancia.</li>
  <li><strong>Inicio del Desplazamiento:</strong> A la señal del dirigente (un silbatazo o aplauso), los jóvenes comienzan a correr o trotar en círculo alrededor del área delimitada sin acercarse prematuramente a las cuerdas.</li>
  <li><strong>La Captura:</strong> Cuando el dirigente grita <em>"¡Serpiente!"</em> o hace sonar dos pitazos cortos, todos los participantes deben romper el círculo y correr al centro para coger una cuerda. El jugador que no alcance a capturar una "serpiente" queda temporalmente eliminado de la ronda.</li>
  <li><strong>Prueba de Velocidad (Empates):</strong> Si dos jugadores agarran los extremos de la misma cuerda simultáneamente, el dirigente retira esa cuerda y realiza un duelo rápido colocando una cuerda neutral a mitad de camino entre ambos.</li>
  <li><strong>Ronda Final:</strong> Se retira una cuerda tras cada ronda y se repite la dinámica hasta coronar al gran cazador de serpientes de la unidad.</li>
</ol>"""

variaciones_detalladas = """Serpientes Venenosas (Variante con Nudos): Algunas cuerdas tienen nudos en las puntas ("serpientes venenosas"). Quien atrapa una cuerda con nudo debe dar 3 giros sobre su eje antes de poder cantar victoria.

Caza Nocturna con Linternas: Las cuerdas se colocan en penumbra y los participantes deben ubicarlas iluminando brevemente con sus linternas.

Serpientes en Parejas: Los integrantes corren tomados del brazo en duplas de patrulla, exigiendo coordinación física conjunta para llegar primeros a la cuerda."""

recomendaciones_detalladas = """Seguridad y Terreno Despejado: Asegurarse de utilizar cuerdas suaves sin puntas metálicas ni nudos duros que puedan golpear la cara. Jugar en césped libre de ramas o piedras.

Control del Juego Rudo: Advertir firmemente que no se permiten empujones ni jalones de manos entre compañeros. La captura se valida según quien ponga primero su mano firmemente sobre la cuerda.

Inclusividad y Animación: Animar con entusiasmo a los participantes eliminados para que asuman el rol de jueces de línea observando los empates."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "15 minutos",
    "cantidad": "16 participantes",
    "lugares": ["Exterior", "campo delimitado"],
    "materiales": ["Cuerdas"],
    "areas": ["Corporalidad", "Carácter", "Sociabilidad"],
    "objetivos": [
        "Refuerzo de habilidades físicas",
        "Estimular la agilidad mental",
        "Fomentar un entorno de confianza",
        "Favorecer el conocimiento entre los pares"
    ],
    "justificacion_areas": "La Cazadora de Serpientes estimula la corporalidad al ejercitar reflejos de reacción rápida, aceleración y agilidad física. Fortalece el carácter al promover el respeto riguroso por las reglas de eliminación y la aceptación alegre del resultado, y desarrolla la sociabilidad al afianzar la empatía y la convivencia limpia en el grupo.",
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

  DELETE FROM articulos WHERE slug = 'la-cazadora-de-serpientes-reflejos-al-acecho';

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
    'La Cazadora de Serpientes: Reflejos al Acecho',
    'la-cazadora-de-serpientes-reflejos-al-acecho',
    $html${contenido_html_puro}$html$,
    'Un apasionante juego scout de agilidad y velocidad de reacción donde los competidores corren por capturar cuerdas dispersas en el terreno.',
    '/uploads/actividad_cazadoraSerpientes.webp',
    'publicado',
    ARRAY['juego-fisico', 'agilidad', 'cuerdas', 'velocidad', 'exterior'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos (ID: 7), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_cazadora_serpientes.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for La Cazadora de Serpientes generated cleanly with authentic UUIDs.")
