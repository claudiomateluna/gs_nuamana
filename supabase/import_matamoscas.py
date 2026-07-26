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
# 1. Corporalidad: "actividades deportivas y recreativas"
# 2. Sociabilidad: "libertad de un modo solidario"
# 3. Creatividad: "expresando lo que piensa" / "agilidad mental" / "conocimientos"

raw_queries = [
    # --- UMBRELLA 1: CORPORALIDAD ---
    ("actividades deportivas", "Manada", "Media", "Desarrollando velocidad, agilidad y reflejos al esquivar a la cadena atrapadora."),
    ("actividades deportivas", "Manada", "Tardía", "Ejercitando la resistencia física y la coordinación motoras en carreras continuas."),
    ("actividades deportivas", "Tropa", "11 a 13", "Aumentando la destreza cardiovascular y los reflejos de desplazamiento en el campo."),
    ("actividades deportivas", "Tropa", "13 a 15", "Fortaleciendo la agilidad corporal y el dominio de movimientos bruscos."),
    ("actividades deportivas", "Compañía", "11 a 13", "Mejorando la capacidad física y el tiempo de reacción al esquivar oponentes."),
    ("actividades deportivas", "Compañía", "13 a 15", "Canalizando la energía física en un ejercicio dinámico y saludable."),
    ("actividades deportivas", "Avanzada", "15 a 17", "Manteniendo un excelente estado físico y resistencia durante el esfuerzo intensivo."),

    # --- UMBRELLA 2: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Manada", "Media", "Tomándome de las manos con mis compañeros para atrapar en equipo sin soltarnos."),
    ("libertad de un modo solidario", "Manada", "Tardía", "Coordinando los giros de la cadena para que ningún lobato se quede atrás."),
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Actuando de manera coordinada con la patrulla para cercar a los corredores."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Fomentando el trabajo en equipo y la cooperación activa en la cadena."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Sincronizando el desplazamiento colectivo con respeto y apoyo recíproco."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Fortaleciendo la cohesión grupal y la toma de decisiones colaborativa."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Liderando con tacto estratégico el avance armónico de la cadena de captura."),

    # --- UMBRELLA 3: CREATIVIDAD ---
    ("distintos medios", "Manada", "Media", "Ideando amagos de carrera para engañar a la cadena y cruzar la línea a salvo."),
    ("distintos medios", "Manada", "Tardía", "Creando tácticas rápidas de huida o cerco según el ancho del terreno."),
    ("distintos medios", "Tropa", "11 a 13", "Buscando trayectorias innovadoras para romper la cobertura del equipo atrapador."),
    ("distintos medios", "Tropa", "13 a 15", "Diseñando maniobras en tenaza para encerrar a los corredores más veloces."),
    ("distintos medios", "Compañía", "11 a 13", "Anticipando los movimientos del oponente para ajustar la ruta de escape."),
    ("distintos medios", "Compañía", "13 a 15", "Adaptando estrategias de desplazamiento en tiempo real según el avance de la cadena."),
    ("distintos medios", "Avanzada", "15 a 17", "Optimizando la cobertura del campo mediante tácticas grupales envolventes.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>El Matamoscas</strong> es un apasionante y enérgico juego scout de persecución al aire libre. Un jugador inicial en el centro del campo intenta atrapar a los demás mientras cruzan de un extremo a otro. Cada jugador atrapado se une de la mano formando una gran cadena humana ("el matamoscas") que debe coordinarse para atrapar al resto de los participantes.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Delimitación del Campo:</strong> Se delimita un campo rectangular de aproximadamente 20 por 10 metros con dos líneas de fondo bien marcadas.</li>
  <li><strong>El Matamoscas Inicial:</strong> Todos los participantes se ubican detrás de una línea de fondo. El dirigente o animador designa al primer "matamoscas", quien se coloca en el centro del campo.</li>
  <li><strong>La Carrera y la Captura:</strong> A la señal de partida, todos los jugadores corren hacia la línea de fondo opuesta intentando no ser tocados por el matamoscas.</li>
  <li><strong>Formación de la Cadena:</strong> Cada jugador atrapado debe tomarse de la mano con el matamoscas. La cadena crece progresivamente y sólo los dos jugadores de los extremos de la cadena pueden tocar a los corredores.</li>
  <li><strong>Trabajo en Equipo:</strong> Si la cadena se rompe (se sueltan las manos), no se contabiliza ninguna captura hasta que vuelvan a unirse.</li>
  <li><strong>Ganador:</strong> El juego continúa con carreras sucesivas hasta que todos son atrapados. El último participante en ser atrapado es el ganador.</li>
</ol>"""

variaciones_detalladas = """<b>Matamoscas Sin Reversa:</b> Los corredores no pueden retroceder una vez que inician la carrera; sólo pueden avanzar hacia adelante o desplazarse lateralmente.

<b>El Matamoscas Doble:</b> Cuando la cadena alcanza los 8 participantes, se divide obligatoriamente en dos cadenas independientes de 4 personas, aumentando la agilidad y estrategia del juego.

<b>Variante con Pañolín:</b> Cada corredor lleva un <b>pañolín</b> en el cinturón. La cadena debe arrebatar los <b>pañolines</b> en lugar de sólo tocar a los participantes."""

recomendaciones_detalladas = """<b>Seguridad en el Terreno:</b> Verificar que el terreno de juego esté despejado de piedras, raíces o baches para evitar caídas durante las maniobras rápidas.

<b>Coordinación de los Extremos:</b> Recordar a los participantes de la cadena que deben correr a un ritmo parejo para evitar tirones bruscos en los brazos.

<b>Rol del Dirigente:</b> Animar el juego con dinamismo y vigilar que la cadena respete la regla de no soltarse las manos al efectuar las capturas."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "20 minutos",
    "cantidad": "16 participantes",
    "lugares": ["Exterior", "campo delimitado"],
    "materiales": ["Pañolines", "Sin Materiales"],
    "areas": ["corporalidad", "sociabilidad", "creatividad"],
    "objetivos": [
        "Agilidad física",
        "Trabajo en equipo",
        "Estrategia grupal",
        "Desarrollo de la coordinación"
    ],
    "justificacion_areas": "El Matamoscas estimula la corporalidad al exigir velocidad, resistencia cardiovascular y reflejos motoras en cada carrera. Desarrolla la sociabilidad al requerir trabajo en equipo y sincronización perfecta entre los miembros de la cadena humana, y potencia la creatividad al demandar tácticas rápidas de esquiva y cerco estratégico.",
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

  DELETE FROM articulos WHERE slug = 'el-matamoscas';

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
    'El Matamoscas',
    'el-matamoscas',
    $html${contenido_html_puro}$html$,
    'Un enérgico juego al aire libre donde los participantes atrapados forman una gran cadena humana para cercar al resto.',
    '/uploads/actividad_elMatamoscas.webp',
    'publicado',
    ARRAY['juego-de-persecucion', 'agilidad', 'panolines', 'exterior', 'trabajo-en-equipo'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos (ID: 7), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_matamoscas.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for El Matamoscas generated cleanly with authentic UUIDs and lowercase areas.")
