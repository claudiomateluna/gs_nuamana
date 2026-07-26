import subprocess
import json

# EXACT 5-WAY CROSSING MATRIX CURATED FOR "EL NIDO DE LOS RECUERDOS"
# Cruce: unidad_id - area_id - rango_edad - texto_infantil - texto_terminal
# Relevant to the game: Tablero cooperativo de conversación, vivencias, afectos familiares y relaciones interpersonales.

objetivos_educativos = [
    # =========================================================================
    # 🐾 UNIDAD: MANADA (unidad_id 1)
    # =========================================================================
    # --- AREA: AFECTIVIDAD (area_id 4) ---
    {
        "id": "a2c1bf0b-e34b-42e5-a9b1-d6474c4912e2",
        "area": "Afectividad",
        "texto": "Soy cariñoso con mis papás y demás familiares.",
        "unidad": "Manada",
        "como_se_cumple": "Compartiendo anécdotas felices sobre mi hogar y valorando a mi familia al caer en las casillas del nido."
    },
    {
        "id": "917b35da-9406-40a3-b5db-c16fcea35699",
        "area": "Afectividad",
        "texto": "Le cuento a mi familia las cosas que hacemos en la Manada.",
        "unidad": "Manada",
        "como_se_cumple": "Platicando abiertamente en el nido sobre las actividades que comparto con mi familia y mi seisena."
    },
    # --- AREA: SOCIABILIDAD (area_id 5) ---
    {
        "id": "cfa10133-c25c-4deb-aebe-a00f8fe3f7ef",
        "area": "Sociabilidad",
        "texto": "Comparto lo que tengo con mis compañeros y compañeras.",
        "unidad": "Manada",
        "como_se_cumple": "Compartiendo mis vivencias, tarjetas y respuestas de forma abierta con mi seisena durante el recorrido en el tablero."
    },
    {
        "id": "5cbe35dc-d15b-4070-9a36-5b0e652c7946",
        "area": "Sociabilidad",
        "texto": "Respeto las opiniones de los demás.",
        "unidad": "Manada",
        "como_se_cumple": "Escuchando con atención y respetando los sentimientos que mis compañeros expresan al caer en las casillas."
    },
    # --- AREA: CARÁCTER (area_id 3) ---
    {
        "id": "99c6e695-ef0b-4e36-956b-3faf15ada355",
        "area": "Carácter",
        "texto": "Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.",
        "unidad": "Manada",
        "como_se_cumple": "Demostrando escucha atenta sin interrumpir a los demás lobatos cuando comparten sus respuestas."
    },
    {
        "id": "6b8c5fb5-6730-4c61-a332-2a7e6033bd94",
        "area": "Carácter",
        "texto": "Me llevo bien con todos los lobatos de la Manada.",
        "unidad": "Manada",
        "como_se_cumple": "Fomentando un ambiente acogedor y fraterno con todos los integrantes del grupo durante la dinámica."
    },

    # =========================================================================
    # ⚜️ UNIDAD: TROPA (unidad_id 3)
    # =========================================================================
    # --- AREA: AFECTIVIDAD (area_id 4) ---
    {
        "id": "78d2d117-05c8-43a4-91c8-7ddb090f1c48",
        "area": "Afectividad",
        "texto": "Me gusta hacer cosas con mi familia y ayudo en lo que me piden para organizarlas.",
        "unidad": "Tropa",
        "como_se_cumple": "Relatando cómo colaboro con mi familia en las tareas del hogar al responder las preguntas del juego."
    },
    {
        "id": "afa62c83-7a6b-4bbb-b60f-59a6d414e241",
        "area": "Afectividad",
        "texto": "Soy cariñoso con mi familia y acepto las decisiones que se toman en mi casa.",
        "unidad": "Tropa",
        "como_se_cumple": "Reflexionando con madurez sobre la importancia de la armonía y el diálogo en el núcleo familiar."
    },
    # --- AREA: SOCIABILIDAD (area_id 5) ---
    {
        "id": "a3d7abdf-ca3b-42b8-92b5-403958fb537c",
        "area": "Sociabilidad",
        "texto": "Procuro que respetemos a nuestras compañeros, cualquiera sea su manera de ser.",
        "unidad": "Tropa",
        "como_se_cumple": "Promoviendo la inclusión activa y el respeto por las diversas opiniones de los integrantes de la patrulla."
    },
    {
        "id": "9e3ce0d2-2b56-4d1e-9135-029cfaaa0e6b",
        "area": "Sociabilidad",
        "texto": "Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.",
        "unidad": "Tropa",
        "como_se_cumple": "Demostrando tolerancia y amabilidad sin juzgar las historias compartidas en las casillas."
    },
    # --- AREA: CARÁCTER (area_id 3) ---
    {
        "id": "0969a204-e8c6-4ab6-ac4f-c777bae066df",
        "area": "Carácter",
        "texto": "Aprecio los consejos que me dan en mi patrulla.",
        "unidad": "Tropa",
        "como_se_cumple": "Recibiendo con humildad las retroalimentaciones y sugerencias expresadas por mis compañeros."
    },
    {
        "id": "f608eb2d-613a-477a-86f9-03e769a87bf2",
        "area": "Carácter",
        "texto": "Ayudo a mis compañeros de patrulla a superarse.",
        "unidad": "Tropa",
        "como_se_cumple": "Animando a los scouts más tímidos a participar con confianza en su turno de tirada de dados."
    },

    # =========================================================================
    # 🍀 UNIDAD: COMPAÑÍA (unidad_id 2)
    # =========================================================================
    # --- AREA: AFECTIVIDAD (area_id 4) ---
    {
        "id": "28520ee0-a72d-4652-ae7f-048ee028c2a3",
        "area": "Afectividad",
        "texto": "Me gusta hacer cosas con mi familia y ayudo en lo que me piden para organizarlas.",
        "unidad": "Compañía",
        "como_se_cumple": "Compartiendo experiencias de apoyo y cooperación familiar al responder las consignas."
    },
    {
        "id": "0592c035-8c25-4e7d-b569-1c4644ab304f",
        "area": "Afectividad",
        "texto": "Soy cariñosa con mi familia y acepto las decisiones que se toman en mi casa.",
        "unidad": "Compañía",
        "como_se_cumple": "Expresando afecto por mi familia y valorando el consenso en las decisiones del hogar."
    },
    # --- AREA: SOCIABILIDAD (area_id 5) ---
    {
        "id": "fce82191-77ea-444b-89d9-e33b62a323a5",
        "area": "Sociabilidad",
        "texto": "Procuro que respetemos a nuestras compañeras, cualquiera sea su manera de ser.",
        "unidad": "Compañía",
        "como_se_cumple": "Favoreciendo un ambiente seguro e inclusivo donde todas las guías puedan expresarse sin temor."
    },
    {
        "id": "ea86ecee-b201-4a49-be9d-4e55de7ffe8c",
        "area": "Sociabilidad",
        "texto": "Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.",
        "unidad": "Compañía",
        "como_se_cumple": "Defendiendo la empatía y la equidad al reflexionar sobre vivencias cotidianas."
    },
    # --- AREA: CARÁCTER (area_id 3) ---
    {
        "id": "81cd6596-30cd-40fe-83e8-c86bf12a21f2",
        "area": "Carácter",
        "texto": "Aprecio los consejos que me dan en mi patrulla.",
        "unidad": "Compañía",
        "como_se_cumple": "Valorando las recomendaciones de mis compañeras para fortalecer el espíritu de grupo."
    },
    {
        "id": "0da6c9df-7a09-44cd-9961-e06c0173d41a",
        "area": "Carácter",
        "texto": "Ayudo a mis compañeras de patrulla a superarse.",
        "unidad": "Compañía",
        "como_se_cumple": "Brindando apoyo y contención fraterna a quienes les cuesta compartir sus sentimientos."
    },

    # =========================================================================
    # 🏔️ UNIDAD: AVANZADA (unidad_id 4)
    # =========================================================================
    # --- AREA: AFECTIVIDAD (area_id 4) ---
    {
        "id": "0d15923e-f877-486d-9a1b-9c3e487f035c",
        "area": "Afectividad",
        "texto": "Logro una relación de comprensión y afecto con mis padres y mantengo permanente comunicación con ellos.",
        "unidad": "Avanzada",
        "como_se_cumple": "Reflexionando abiertamente sobre la comunicación y la empatía intergeneracional en el núcleo familiar."
    },
    # --- AREA: SOCIABILIDAD (area_id 5) ---
    {
        "id": "007591fb-a2b6-4fb5-9286-acde65455f53",
        "area": "Sociabilidad",
        "texto": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.",
        "unidad": "Avanzada",
        "como_se_cumple": "Promoviendo el principio de dignidad igualitaria y fraternidad en el diálogo del juego."
    },
    # --- AREA: CARÁCTER (area_id 3) ---
    {
        "id": "04ded0fb-289b-4d90-9f5f-821ec20a56c7",
        "area": "Carácter",
        "texto": "Aporto mi experiencia personal en las reuniones de mi Comunidad.",
        "unidad": "Avanzada",
        "como_se_cumple": "Compartiendo aprendizajes significativos de mi trayectoria para motivar a mis compañeros de comunidad."
    }
]

contenido_html_puro = """<h2>📜 Descripción del Juego</h2>
<p><strong>El Nido de los Recuerdos</strong> es una dinámica de integración en formato de tablero gigante que se dibuja directamente en un pliego grande de papel o cartulina. A través del azar de los dados y la participación colectiva, los jóvenes recorren casillas interactivas donde comparten anécdotas, reflexiones y sentimientos con sus compañeros de patrulla o seisena.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Preparación del Tablero:</strong> En el centro del pliego se dibuja un gran nido scout. Alrededor del nido se traza un camino circular dividido en casillas. Cada participante busca un objeto pequeño (una piedra bonita, una ficha o un botón) que servirá como su ficha personal.</li>
  <li><strong>Lanzamiento e Inicio:</strong> El primer jugador tira el dado y avanza tantas casillas como indique el número. Si cae en una casilla en blanco, debe escribir una consigna o pregunta amigable (por ejemplo: <em>"Cuenta tu momento más divertido en un campamento"</em> o <em>"Menciona una cualidad de tu compañero de al lado"</em>).</li>
  <li><strong>Desarrollo de la Dinámica:</strong> Si un jugador cae en una casilla que ya tiene una consigna escrita, debe responder a esa pregunta o cumplir la misión asignada antes de dar el paso al siguiente participante.</li>
  <li><strong>Conclusión:</strong> La actividad continúa de forma fluida hasta que todas las casillas hayan sido transitadas y el grupo decida hacer un cierre reflexivo.</li>
</ol>"""

variaciones_detalladas = """Nido Temático de Patrulla: Las consignas del tablero se enfocan en hitos de la historia del grupo scout, anécdotas del último campamento o pasajes de la Ley y la Promesa.

Nido de Ilustración Doblada: En lugar de responder verbalmente, el participante tiene 1 minuto para hacer un dibujo rápido en el pliego que represente su respuesta, para que el resto del equipo intente adivinarlo.

Nido de la Promesa: Orientado a lobatos y scouts próximos a realizar su promesa, donde las casillas plantean situaciones éticas sobre cómo vivir la Promesa en la vida cotidiana.

Nido Nocturno con Linternas: Se realiza en la penumbra utilizando linternas para iluminar únicamente la casilla en la que aterrizó la ficha, creando una atmósfera íntima y reflexiva alrededor del fuego de campamento."""

recomendaciones_detalladas = """Clima de Confianza Impecable: Los dirigentes deben asegurar que ningún participante sea juzgado o burlado por las experiencias expuestas. La regla de oro es el respeto absoluto y la escucha empática en todo momento.

Inclusividad y Ritmo: Si algún niño muestra timidez o le cuesta expresarse en público, el dirigente o jefe de patrulla debe acompañarlo suavemente, ofreciendo opciones alternativas o preguntas facilitadoras sin forzarlo.

Seguridad Emocional: Evitar preguntas de índole privada o sensible. Las consignas del juego deben orientarse siempre hacia el crecimiento positivo, el compañerismo y los valores scouts.

Facilitación Activa: El dirigente debe actuar como un observador atento, reforzando positivamente las intervenciones valientes y asegurando que todos los participantes tengan las mismas oportunidades de tirar el dado y hablar."""

metadata_json = {
    "unidades": ["manada", "compañía", "tropa", "avanzada"],
    "duracion": "30 minutos",
    "cantidad": "06 participantes",
    "lugares": ["Interior", "sala"],
    "materiales": ["Papel", "Lápices", "Dados"],
    "areas": ["Sociabilidad", "Afectividad", "Carácter"],
    "objetivos": [
        "Conocer a los demás",
        "Facilitar el conocimiento entre los pares",
        "Fomentar un entorno de confianza",
        "Favorecer la comunicación en el grupo"
    ],
    "justificacion_areas": "El Nido fomenta la sociabilidad, el afecto y el carácter mediante la libre expresión de vivencias y el fortalecimiento de la empatía. Al compartir anécdotas personales y escuchar con respeto a sus pares, los jóvenes ejercitan la inteligencia emocional, consolidan la confianza del grupo y afianzan valores de lealtad y fraternidad scout.",
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

  DELETE FROM articulos WHERE slug = 'el-nido-de-los-recuerdos';

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
    'El Nido de los Recuerdos',
    'el-nido-de-los-recuerdos',
    $html${contenido_html_puro}$html$,
    'Un juego de tablero gigante cooperativo donde los participantes avanzan casillas compartiendo vivencias, reflexiones y anécdotas con su seisena o patrulla.',
    '/uploads/actividad_elNido.webp',
    'publicado',
    ARRAY['juego', 'cooperativo', 'integracion', 'expresion', 'confianza'],
    $json${json_str}$json$::jsonb
  );

  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 10) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
"""

with open("supabase/update_el_nido_v4.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("V4 SQL generated cleanly with 5-way crossing matrix (21 items).")
