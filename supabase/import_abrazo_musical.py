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
# 1. Afectividad: "Practica una conducta asertiva y una actitud afectuosa hacia las demás personas..."
# 2. Carácter: "Enfrenta la vida con alegría y sentido del humor."
# 3. Sociabilidad: "Vive su libertad de un modo solidario..."

raw_queries = [
    # --- UMBRELLA 1: AFECTIVIDAD ---
    ("actitud afectuosa", "Manada", "Media", "Brindando abrazos respetuosos y cariñosos a mis compañeros al detenerse la música."),
    ("actitud afectuosa", "Manada", "Tardía", "Recibiendo con alegría las muestras de afecto grupal durante la dinámica."),
    ("actitud afectuosa", "Tropa", "11 a 13", "Expresando acogida sincera al integrar a nuevos compañeros en el abrazo progresivo."),
    ("actitud afectuosa", "Tropa", "13 a 15", "Facilitando un clima de confianza fraterna donde todos se sientan valorados."),
    ("actitud afectuosa", "Compañía", "11 a 13", "Manifestando empatía y calidez en los encuentros de patrulla."),
    ("actitud afectuosa", "Compañía", "13 a 15", "Promoviendo relaciones afectivas sanas y respetuosas en la unidad."),
    ("actitud afectuosa", "Avanzada", "15 a 17", "Consolidando vínculos de confianza profunda y apoyo mutuo en la comunidad."),

    # --- UMBRELLA 2: CARÁCTER ---
    ("sentido del humor", "Manada", "Media", "Disfrutando del baile y el ritmo musical con espontaneidad y risas."),
    ("sentido del humor", "Manada", "Tardía", "Participando con entusiasmo sin sentir vergüenza al expresarme corporalmente."),
    ("sentido del humor", "Tropa", "11 a 13", "Viviendo la dinámica con sentido del humor y alegría compartida."),
    ("sentido del humor", "Tropa", "13 a 15", "Fomentando el optimismo y la buena energía al dinamizar el encuentro."),
    ("sentido del humor", "Compañía", "11 a 13", "Compartiendo momentos divertidos y distendidos con mis pares."),
    ("sentido del humor", "Compañía", "13 a 15", "Enfrentando los juegos de integración con soltura y actitud positiva."),
    ("sentido del humor", "Avanzada", "15 a 17", "Creando un espacio distendido de distensión y camaradería caminante."),

    # --- UMBRELLA 3: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Manada", "Media", "Buscando que ningún seisenero quede fuera del abrazo grupal."),
    ("libertad de un modo solidario", "Manada", "Tardía", "Incluyendo activamente a los lobatos más tímidos en el círculo."),
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Promoviendo la inclusión de todos los integrantes sin distinciones."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Asumiendo un rol activo para cohesionar a la patrulla en un abrazo común."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Fomentando el espíritu de cuerpo y la integración solidaria."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Velando por el bienestar y la comodidad emocional de las compañeras."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Generando dinámicas de integración inclusivas que fortalezcan el grupo.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>El Abrazo Musical</strong> es una dinámica de integración, rompehielos y afianzamiento afectivo grupal. A través del ritmo y el movimiento espontáneo, invita a los participantes a romper barreras de timidez, construir confianza y vivenciar el valor de la acogida colectiva.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Inicio con Música:</strong> Se reproduce una canción alegre mientras todos los participantes bailan y se desplazan libremente por el espacio.</li>
  <li><strong>Abrazos por Parejas:</strong> Cuando la música se detiene repentinamente, cada jugador debe buscar a un compañero para darse un abrazo fraternal de bienvenida.</li>
  <li><strong>Abrazos Progresivos:</strong> La música vuelve a sonar y todos continúan bailando. En las siguientes pausas, el dirigente indica aumentar el número de integrantes por abrazo (grupos de 3, luego 4, 5 y 6 personas).</li>
  <li><strong>El Gran Abrazo Colectivo:</strong> La dinámica concluye cuando toda la unidad se une en un único, cálido y gran abrazo grupal al silenciarse la música por última vez.</li>
</ol>"""

variaciones_detalladas = """Abrazos con Gestos Temáticos: En cada pausa musical, el dirigente indica una consigna de saludo antes del abrazo (ej: saludo scout, choque de codos o cara de sorpresa).

Baile en Estilos Variados: Cambiar los géneros musicales (cumbia, rock, folclore) en cada ronda para incentivar la creatividad corporal y las risas.

Abrazo a Ciegas (Ojos Cerrados): Los participantes se desplazan en silencio con los ojos cerrados hasta encontrar las manos de un compañero para abrazarse."""

recomendaciones_detalladas = """Sensibilidad y Respeto Personal: Velar siempre por que el contacto físico sea sumamente respetuoso, suave y fraterno. Jamás forzar a un participante si muestra timidez o reticencia inicial.

Clima de Acogida Inclusiva: Incentivar a los jóvenes a buscar deliberadamente a compañeros de distintas seisenas o patrullas con quienes no hayan conversado aún.

Evaluación Corta de Cierre: Dedicar dos minutos al final sentado en círculo para comentar la sensación de pertenencia y el valor de ser recibidos con alegría por el grupo."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "15 minutos",
    "cantidad": "16 participantes",
    "lugares": ["Interior", "sala"],
    "materiales": ["Parlante", "Reproductor de Música"],
    "areas": ["Afectividad", "Sociabilidad", "Carácter"],
    "objetivos": [
        "Favorecer la comunicación en el grupo",
        "Crear un clima de pertenencia",
        "Fomentar un entorno de confianza",
        "Facilitar el conocimiento entre los pares"
    ],
    "justificacion_areas": "El Abrazo Musical estimula la afectividad al brindar un entorno seguro y alegre para manifestar muestras sinceras de afecto fraterno. Desarrolla la sociabilidad al impulsar la integración inclusiva de todos los participantes sin distinciones, y fortalece el carácter al promover la autoestima y la desinhibición a través de la expresión corporal libre.",
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

  DELETE FROM articulos WHERE slug = 'el-abrazo-musical';

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
    'El Abrazo Musical',
    'el-abrazo-musical',
    $html${contenido_html_puro}$html$,
    'Una alegre dinámica de integración y afianzamiento afectivo donde el grupo baila al ritmo de la música y se une en abrazos colectivos.',
    '/uploads/actividad_abrazoMusical.webp',
    'publicado',
    ARRAY['dinamica', 'integracion', 'afectividad', 'confianza', 'interior'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Dinámicas (ID: 10), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 10) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_abrazo_musical.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for El Abrazo Musical generated cleanly with authentic UUIDs.")
