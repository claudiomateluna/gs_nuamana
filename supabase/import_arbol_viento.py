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
# 1. Afectividad: "buena imagen de sí mismo"
# 2. Sociabilidad: "libertad de un modo solidario"
# 3. Carácter: "sentido del humor"

raw_queries = [
    # --- UMBRELLA 1: AFECTIVIDAD ---
    ("buena imagen de sí mismo", "Manada", "Media", "Superando el temor inicial al soltar el control y dejarme balancear por mis hermanos lobatos."),
    ("buena imagen de sí mismo", "Manada", "Tardía", "Reconociendo mis emociones y sintiéndome seguro en el centro del círculo."),
    ("buena imagen de sí mismo", "Tropa", "11 a 13", "Aceptando mis vulnerabilidades y confiando en el sostén fraterno de la patrulla."),
    ("buena imagen de sí mismo", "Tropa", "13 a 15", "Fortaleciendo la autoestima al experimentar el cuidado y la protección de mis pares."),
    ("buena imagen de sí mismo", "Compañía", "11 a 13", "Desarrollando serenidad emocional al cerrar los ojos y confiar en la unidad."),
    ("buena imagen de sí mismo", "Compañía", "13 a 15", "Afianzando una imagen corporal y emocional positiva a través del apoyo colectivo."),
    ("buena imagen de sí mismo", "Avanzada", "15 a 17", "Profundizando la confianza interior y el autocontrol emocional ante el grupo."),
    ("buena imagen de sí mismo", "Clan", "17 a 20", "Cultivando la madurez afectiva y la aceptación serena de mis posibilidades personales."),

    # --- UMBRELLA 2: SOCIABILIDAD ---
    ("libertad de un modo solidario", "Manada", "Media", "Sosteniendo con delicadeza y responsabilidad a mis compañeros en el círculo."),
    ("libertad de un modo solidario", "Manada", "Tardía", "Velando por la seguridad de cada lobato cuando le toca ser el árbol."),
    ("libertad de un modo solidario", "Tropa", "11 a 13", "Ofreciendo un soporte firme y respetuoso a todos los miembros de la patrulla."),
    ("libertad de un modo solidario", "Tropa", "13 a 15", "Fomentando un ambiente de contención mutua y cuidado solidario."),
    ("libertad de un modo solidario", "Compañía", "11 a 13", "Participando activamente en la creación de un espacio de confianza y respeto."),
    ("libertad de un modo solidario", "Compañía", "13 a 15", "Respetando la libertad y el ritmo emocional de cada participante."),
    ("libertad de un modo solidario", "Avanzada", "15 a 17", "Liderando con empatía la contención del grupo para generar seguridad absoluta."),
    ("libertad de un modo solidario", "Clan", "17 a 20", "Ejerciendo el servicio solidario garantizando el bienestar colectivo de los caminantes."),

    # --- UMBRELLA 3: CARÁCTER ---
    ("sentido del humor", "Manada", "Media", "Disfrutando la sensación de mecerse suavemente con alegría y sin tensiones."),
    ("sentido del humor", "Manada", "Tardía", "Compartiendo las impresiones de la vivencia con entusiasmo y buen ánimo."),
    ("sentido del humor", "Tropa", "11 a 13", "Expresando lo vivido con sinceridad y sentido del humor al finalizar el ejercicio."),
    ("sentido del humor", "Tropa", "13 a 15", "Afrontando el reto de soltarse con una actitud serena y positiva."),
    ("sentido del humor", "Compañía", "11 a 13", "Viviendo la experiencia con tranquilidad y espontaneidad en el grupo."),
    ("sentido del humor", "Compañía", "13 a 15", "Fomentando un clima de distensión y apertura dialogante."),
    ("sentido del humor", "Avanzada", "15 a 17", "Aceptando la entrega con deportividad y serenidad de carácter."),
    ("sentido del humor", "Clan", "17 a 20", "Reflexionando sobre la confianza con madurez, templanza y optimismo.")
]

objetivos_educativos = []
for term_like, unidad, rango_like, como_cumple in raw_queries:
    real_obj = get_real_objective(term_like, unidad, rango_like)
    if real_obj:
        real_obj["como_se_cumple"] = como_cumple
        objetivos_educativos.append(real_obj)

print(f"Total authentic objectives fetched from Postgres DB: {len(objetivos_educativos)}")

contenido_html_puro = """<h2>📜 Descripción de la Dinámica</h2>
<p><strong>El Árbol y el Viento</strong> es una profunda dinámica scout de sensibilización y confianza grupal. En ella, un participante se ubica relajado en el centro de un círculo compacto formado por sus compañeros y se deja mecer suavemente como el tronco de un árbol mecido por la brisa, experimentando la contención y el cuidado colectivo.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>El Círculo de Protección:</strong> Los participantes forman un círculo muy compacto, hombro con hombro, con los brazos flexionados hacia adelante y las palmas de las manos listas para brindar sostén.</li>
  <li><strong>El Árbol en el Centro:</strong> Un participante se coloca en el centro con los pies firmes en el suelo, los brazos cruzados sobre el pecho o colgando relajados, y cierra los ojos. Debe mantener el cuerpo erguido pero relajado, confiando en sus compañeros.</li>
  <li><strong>El Balanceo de la Brisa:</strong> Los integrantes del círculo empujan y reciben suavemente al participante del centro con toques delicados en la espalda y los hombros, meciéndolo de un lado a otro en un movimiento continuo y rítmico.</li>
  <li><strong>Silencio y Clima de Confianza:</strong> La dinámica requiere un ambiente de silencio absoluto y respeto para permitir la concentración e introspección de quien está en el centro.</li>
  <li><strong>Cierre y Evaluación:</strong> Cada participante pasa por el centro del círculo y, al finalizar, el grupo realiza una ronda de conversación para compartir sensaciones y emociones.</li>
</ol>"""

variaciones_detalladas = """<b>El Bosque Soplado por el Viento:</b> Se forman varios círculos simultáneos de 5 a 6 participantes para que la dinámica sea más íntima y todos los scouts pasen al centro en menor tiempo.

<b>Balanceo con Pañolín:</b> El participante del centro utiliza su <b>pañolín</b> a modo de venda para reforzar la desinhibición y el abandono voluntario del control visual.

<b>Cálida Recepción:</b> Al terminar el mecido, el círculo se estrecha lentamente abrazando de forma coordinada al participante del centro antes de que abra los ojos."""

recomendaciones_detalladas = """<b>Seguridad Ante Todo:</b> Asegurar que las palmas de los compañeros del círculo estén siempre listas y firmes a la altura del pecho y espalda. Queda estrictamente prohibido hacer movimientos bruscos o soltar al participante.

<b>Silencio y Concentración:</b> Crear una atmósfera de tranquilidad previa. El tono de voz del dirigente facilitador debe ser pausado y sereno.

<b>Participación Voluntaria:</b> Respetar a aquellos participantes que sientan timidez inicial, permitiéndoles primero ser parte del círculo exterior antes de pasar al centro."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada", "clan"],
    "duracion": "15 minutos",
    "cantidad": "12 participantes",
    "lugares": ["Interior", "Exterior", "campo delimitado"],
    "materiales": ["Pañolines", "Sin Materiales"],
    "areas": ["afectividad", "sociabilidad", "carácter"],
    "objetivos": [
        "Estimular la confianza",
        "Crear un clima de pertenencia",
        "Fomentar un entorno de confianza",
        "Introspección"
    ],
    "justificacion_areas": "El Árbol y el Viento fortalece la afectividad al brindar un espacio seguro para vencer temores y elevar la confianza en uno mismo. Desarrolla la sociabilidad al afianzar la empatía y la contención cuidadosa entre iguales, y ejercita el carácter al cultivar la serenidad, la desinhibición y la desinteresada entrega al grupo.",
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

  DELETE FROM articulos WHERE slug = 'el-arbol-y-el-viento';

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
    'El Árbol y el Viento',
    'el-arbol-y-el-viento',
    $html${contenido_html_puro}$html$,
    'Una profunda dinámica scout de confianza donde un participante se deja mecer suavemente en el centro de un círculo fraterno.',
    '/uploads/actividad_elArbolYElViento.webp',
    'publicado',
    ARRAY['dinamica-de-confianza', 'afectividad', 'panolines', 'interior', 'exterior'],
    $json${json_str}$json$::jsonb
  );

  -- Categoría Hija: Juegos (ID: 7), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/import_arbol_viento.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("SQL for El Arbol y el Viento generated cleanly with authentic UUIDs including Clan and lowercase areas.")
