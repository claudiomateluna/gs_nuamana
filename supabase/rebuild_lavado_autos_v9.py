import subprocess
import json

# Python script that queries PostgreSQL table 'progresion_objetivos' directly for REAL AUTHENTIC UUIDs

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
# 2. Carácter: "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica..."
# 3. Creatividad: "Expresa lo que piensa y siente a través de distintos medios..."

raw_queries = [
    # --- UMBRELLA 1: AFECTIVIDAD ---
    ("actitud afectuosa", "Manada", "Media", "Ofreciendo palmaditas y gestos de cariño respetuoso a mis compañeros de seisena al pasar por el túnel del lavado."),
    ("actitud afectuosa", "Manada", "Tardía", "Participando con alegría y sin vergüenza al brindar y recibir las demostraciones de afecto del grupo."),
    ("actitud afectuosa", "Tropa", "11 a 13", "Brindando contacto físico fraterno y respetuoso a cada participante de la patrulla."),
    ("actitud afectuosa", "Tropa", "13 a 15", "Recibiendo con gratitud la acogida positiva de mis compañeros al recorrer la fila."),
    ("actitud afectuosa", "Compañía", "11 a 13", "Expresando muestras de afecto sinceras y cuidadosas a las integrantes de mi patrulla."),
    ("actitud afectuosa", "Compañía", "13 a 15", "Disfrutando el reconocimiento y las palabras estimulantes brindadas por mis compañeras."),
    ("actitud afectuosa", "Avanzada", "15 a 17", "Manifestando mis sentimientos y empatía abiertamente para fortalecer el clima de confianza de la comunidad."),

    # --- UMBRELLA 2: CARÁCTER ---
    ("posibilidades y limitaciones", "Manada", "Media", "Reconociéndome como un integrante valioso de la Manada al ser acogido alegremente por mis pares."),
    ("posibilidades y limitaciones", "Manada", "Tardía", "Sintiéndome seguro y querido por la seisena durante la evaluación y cierre de la dinámica."),
    ("posibilidades y limitaciones", "Tropa", "11 a 13", "Afirmando mi autoestima y confianza personal al integrarme en la fila del grupo."),
    ("posibilidades y limitaciones", "Tropa", "13 a 15", "Aceptando con madurez y alegría las expresiones de aprecio de los demás participantes."),
    ("posibilidades y limitaciones", "Compañía", "11 a 13", "Fortaleciendo mi sentido de pertenencia y valoración propia ante la patrulla de guías."),
    ("posibilidades y limitaciones", "Compañía", "13 a 15", "Valorando las demostraciones de estima como un impulso para mi crecimiento personal."),
    ("posibilidades y limitaciones", "Avanzada", "15 a 17", "Consolidando mi autoimagen positiva y seguridad personal en el entorno caminante."),

    # --- UMBRELLA 3: CREATIVIDAD ---
    ("Expresa lo que piensa y siente", "Manada", "Media", "Expresando sonrisas y gestos espontáneos durante la recreación del túnel de lavado."),
    ("Expresa lo que piensa y siente", "Manada", "Tardía", "Comunicando mi estado de ánimo alegre mediante el lenguaje corporal del juego."),
    ("Expresa lo que piensa y siente", "Tropa", "11 a 13", "Compartiendo de forma natural y transparente mis emociones al finalizar la rueda de lavado."),
    ("Expresa lo que piensa y siente", "Tropa", "13 a 15", "Dinamizando la actividad con entusiasmo para que todos se sientan acogidos."),
    ("Expresa lo que piensa y siente", "Compañía", "11 a 13", "Fomentando un canal de comunicación afectuoso entre las integrantes de la patrulla."),
    ("Expresa lo que piensa y siente", "Compañía", "13 a 15", "Aportando calidez y empatía para desinhibir y motivar a las compañeras."),
    ("Expresa lo que piensa y siente", "Avanzada", "15 a 17", "Generando un clima de distensión y encuentro auténtico al inicio de las sesiones de la comunidad.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>El Lavado de Autos</strong> es una dinámica de expresión corporal, afirmación afectiva e integración grupal. Su objetivo es romper tensiones iniciales, fortalecer la autoestima y crear un clima de acogida positiva mediante el contacto físico fraterno y respetuoso entre los participantes.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Formación del Túnel:</strong> Los participantes se dividen en dos filas paralelas colocadas frente a frente, a un metro de distancia. El espacio entre las filas representa la cinta de un túnel automático de lavado de autos.</li>
  <li><strong>Asignación de Roles:</strong> Los jóvenes ubicados en las filas representan los "cepillos y rodillos" de la máquina de lavado. El primer participante de la fila es designado como el primer "auto".</li>
  <li><strong>El Recorrido del Auto:</strong> El "auto" avanza lentamente con los ojos cerrados o entreabiertos caminando por el medio de las filas. A su paso, sus compañeros le brindan de manera suave y respetuosa palmaditas de aliento, masajes suaves en los hombros y palabras motivadoras de bienvenida.</li>
  <li><strong>Rotación Continua:</strong> Al llegar al final del túnel, el "auto" se incorpora como el último rodillo de la máquina, y la siguiente persona de la cabecera inicia su recorrido como nuevo auto.</li>
  <li><strong>Reflexión Final:</strong> La dinámica concluye cuando todos los integrantes han sido "lavados". El grupo se sienta en círculo para compartir brevemente cómo se sintieron al recibir y dar afecto.</li>
</ol>"""

variaciones_detalladas = """Lavado de Autos con Música Suave: Se utiliza una melodía relajante de fondo mientras los autos avanzan, permitiendo un ritmo pausado y profundo.

Túnel de Palabras de Aliento: Al pasar el auto, los integrantes de las filas expresan en susurros cualidades positivas del participante (ej: "eres alegre", "buen compañero", "valiente").

Lavado de Velocidad Adaptada: Para manadas pequeñas, el túnel se realiza sentado en sillas donde el niño avanza en un carrito imaginario."""

recomendaciones_detalladas = """Respeto Absoluto y Sensibilidad: La regla de oro es que el contacto físico debe ser siempre suave, cuidadoso y fraternal (palmaditas en la espalda, roce suave en hombros). Jamás se permiten empujones, cosquillas ni juegos rudos.

Participación Voluntaria: Si un integrante muestra timidez o incomodidad ante el contacto físico, se le permite ser "operador del túnel" o caminar acompañado por un dirigente sin forzar su espacio personal.

Evaluación y Cierre Emocional: Dedicar siempre unos minutos al final para que los jóvenes verbalicen sus sensaciones. Esta evaluación es clave para desinhibir al grupo y consolidar la confianza mutua."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "15 minutos",
    "cantidad": "12 participantes",
    "lugares": ["Interior", "sala"],
    "materiales": ["Sin Materiales"],
    "areas": ["Afectividad", "Carácter", "Creatividad"],
    "objetivos": [
        "Facilitar el conocimiento entre los pares",
        "Fomentar un entorno de confianza",
        "Favorecer la comunicación en el grupo",
        "Crear un clima de pertenencia"
    ],
    "justificacion_areas": "El Lavado de Autos estimula la afectividad al brindar un espacio seguro para dar y recibir muestras sinceras de afecto fraterno. Fortalece el carácter al afirmar la autoestima y autoimagen positiva de cada participante, y desarrolla la creatividad expresiva mediante la comunicación gestual y la dinamización del encuentro grupal.",
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

  DELETE FROM articulos WHERE slug = 'el-lavado-de-autos';

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
    'El Lavado de Autos',
    'el-lavado-de-autos',
    $html${contenido_html_puro}$html$,
    'Una dinámica de integración y afirmación afectiva donde los participantes recorren un túnel fraterno recibiendo palmaditas y palabras de aliento.',
    '/uploads/actividad_lavadoAutos.webp',
    'publicado',
    ARRAY['dinamica', 'integracion', 'afectividad', 'confianza', 'autoestima'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Dinámicas (ID: 10), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 10) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_lavado_autos_v9.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("V9 SQL generated cleanly with REAL AUTHENTIC DB UUIDs.")
