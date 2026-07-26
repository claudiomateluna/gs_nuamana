import subprocess
import json
import sys
sys.path.append('supabase')

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
# 1. Creatividad: "distintos medios" or "pensar, innovar"
# 2. Sociabilidad: "libertad de un modo solidario"
# 3. Carácter: "sentido del humor" or "alegría"

raw_queries = [
    # --- UMBRELLA 1: CREATIVIDAD ---
    ("distintos medios", "Tropa", "11 a 13", "Creando oportunidades discretas para tocar al compañero asignado sin ser descubierto."),
    ("distintos medios", "Tropa", "13 a 15", "Planificando estrategias de distracción e imitación de conducta en el campamento."),
    ("distintos medios", "Compañía", "11 a 13", "Observando con atención el entorno para detectar movimientos sospechosos de otros vampiros."),
    ("distintos medios", "Compañía", "13 a 15", "Desarrollando la astucia y la paciencia durante las rutinas diarias de la unidad."),
    ("distintos medios", "Avanzada", "15 a 17", "Diseñando emboscadas creativas aprovechando la topografía y dinámicas de grupo."),
    ("distintos medios", "Clan", "17 a 20", "Implementando técnicas avanzadas de camuflaje social e introspección táctica."),

    # --- UMBRELLA 2: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Respetando las reglas de caballerosidad y honestidad al cantar la eliminación."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Cuidando que las acciones del juego no interfieran con las tareas de servicio de la patrulla."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Fomentando un ambiente de camaradería y deportividad ante los aciertos ajenos."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Velando por la inclusión activa y el juego limpio de todas las participantes."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Manteniendo la fraternidad y el buen ambiente en la comunidad de avanzada."),
    ("libertad de un modo solidario", "Clan", "17 a 20", "Promoviendo el respeto mudo y la responsabilidad en el servicio del campamento."),

    # --- UMBRELLA 3: CARÁCTER ---
    ("sentido del humor", "Tropa", "11 a 13", "Tomando con humor y deportividad ser eliminado en secreto por otro cazador."),
    ("sentido del humor", "Tropa", "13 a 15", "Afrontando el suspenso del juego con serenidad, alegría y entusiasmo."),
    ("sentido del humor", "Compañía", "11 a 13", "Disfrutando el misterio y las risas al revelar los nombres al final de la jornada."),
    ("sentido del humor", "Compañía", "13 a 15", "Demostrando autocontrol y templanza durante los momentos de acecho."),
    ("sentido del humor", "Avanzada", "15 a 17", "Viviendo la incertidumbre con madurez emocional y sentido del humor."),
    ("sentido del humor", "Clan", "17 a 20", "Reflexionando sobre la agudeza visual y el autocontrol con actitud abierta.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>El Juego del Vampiro</strong> es un clásico e intrigante juego de acecho e intriga scout para campamentos. Cada participante recibe en secreto una tarjeta con el nombre de su "víctima". El objetivo es tocar discretamente el hombro o cuello de la víctima pronunciando <em>"vampiro"</em> en total ausencia de testigos visuales.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>El Mural del Cementerio:</strong> En la sede o campamento se instala un mural representativo ("el cementerio") donde figuran todas las lápidas de los participantes.</li>
  <li><strong>Reparto Secreto de Tarjetas:</strong> Cada participante saca una tarjeta con el nombre del scout al que debe "cazar". Nadie debe revelar su objetivo a los demás.</li>
  <li><strong>La Caza en Solitario:</strong> A lo largo de la jornada de campamento, los participantes realizan sus actividades normales mientras observan a su víctima. Para efectuar la eliminación ("morder"), se debe tocar suavemente al objetivo cuando <strong>ningún otro scout esté mirando</strong>.</li>
  <li><strong>Registro de Eliminados:</strong> El scout "mordido" entrega su tarjeta al vampiro que lo atrapó y marca su tumba en el mural del cementerio. El cazador asume entonces a la víctima de la persona eliminada.</li>
  <li><strong>Fin del Juego:</strong> El juego termina cuando sólo queda un vampiro victorioso o al finalizar el campamento, recompensando al scout con más eliminaciones limpias.</li>
</ol>"""

variaciones_detalladas = """<b>Vampiros Nocturnos:</b> El juego se realiza exclusivamente durante el fogón o la velada nocturna en un perímetro delimitado por linternas.

<b>Variante con Pañolín:</b> En lugar de tocar el hombro, el cazador debe retirar sigilosamente el <b>pañolín</b> del cinturón de su víctima sin que nadie en el área se dé cuenta.

<b>Protección de Testigos:</b> Si la víctima está acompañada por al menos dos compañeros, es inmune al ataque hasta que quede a solas o aislada."""

recomendaciones_detalladas = """<b>Respeto a las Tareas de Campamento:</b> Establecer que no se pueden realizar eliminaciones durante momentos solemnes, ceremonias de <b>pañolín</b> ni durante la preparación de alimentos.

<b>Absoluta Honestidad:</b> Remarcar el Código de Honor Scout; si hubo un testigo mirando, la eliminación queda automáticamente anulada.

<b>Rol de Dirigentes:</b> Supervisar con discreción la entrega de tarjetas y animar el mural del cementerio con misterio y humor pedagógico."""

metadata_json = {
    "unidades": ["tropa", "compañía", "avanzada", "clan"],
    "duracion": "todo el día",
    "cantidad": "16 participantes",
    "lugares": ["Exterior", "campo abierto"],
    "materiales": ["Tarjetas de Papel", "Lápices", "Sin Materiales"],
    "areas": ["creatividad", "sociabilidad", "carácter"],
    "objetivos": [
        "Sigilo y acecho",
        "Desarrollo de la observación",
        "Introspección",
        "Crear un clima de pertenencia"
    ],
    "justificacion_areas": "El Juego del Vampiro estimula la creatividad al requerir observación sutil, astucia y planificación de emboscadas sin llamar la atención. Desarrolla la sociabilidad al afianzar la deportividad, el respeto por las reglas de honor y la convivencia fraterna, y ejercita el carácter al cultivar la paciencia, la templanza y el sentido del humor.",
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

  DELETE FROM articulos WHERE slug = 'el-juego-del-vampiro';

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
    'El Juego del Vampiro',
    'el-juego-del-vampiro',
    $html${contenido_html_puro}$html$,
    'Un clásico juego de acecho e intriga scout para campamentos donde se eliminan objetivos en secreto sin dejar testigos.',
    '/uploads/actividad_elJuegoDelVampiro.webp',
    'publicado',
    ARRAY['juego-nocturno', 'acecho', 'panolines', 'campamento', 'observacion'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos Nocturnos (ID: 9), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 9) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_vampiro.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for El Juego del Vampiro generated cleanly with authentic UUIDs including Clan and lowercase areas.")
