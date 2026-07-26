import subprocess
import json

objetivos_educativos = [
    # --- MANADA (Sociabilidad) ---
    {
        "id": "cfa10133-c25c-4deb-aebe-a00f8fe3f7ef",
        "area": "Sociabilidad",
        "texto": "Comparto lo que tengo con mis compañeros y compañeras.",
        "unidad": "Manada",
        "como_se_cumple": "Compartiendo mis vivencias, tarjetas y respuestas de forma abierta con mi seisena durante el recorrido en el tablero del nido."
    },
    {
        "id": "5cbe35dc-d15b-4070-9a36-5b0e652c7946",
        "area": "Sociabilidad",
        "texto": "Respeto las opiniones de los demás.",
        "unidad": "Manada",
        "como_se_cumple": "Escuchando con atención y respetando los sentimientos que mis compañeros expresan al caer en las casillas del juego."
    },
    # --- MANADA (Afectividad) ---
    {
        "id": "7ff0c343-64ea-4668-bdd1-c44e53581bdb",
        "area": "Afectividad",
        "texto": "Soy cariñoso con mis hermanos, hago cosas con ellos y trato de no pelear.",
        "unidad": "Manada",
        "como_se_cumple": "Expresando afecto y compañerismo de manera positiva al responder las preguntas familiares del nido."
    },
    {
        "id": "c7f99a9b-0b82-4d4f-9018-09bbed370a45",
        "area": "Afectividad",
        "texto": "Comparto con la familia de mis amigos e invito a que compartan con la mía.",
        "unidad": "Manada",
        "como_se_cumple": "Platicando anécdotas felices sobre mi familia y escuchando las historias de las familias de mis seiseneros."
    },
    # --- MANADA (Carácter) ---
    {
        "id": "99c6e695-ef0b-4e36-956b-3faf15ada355",
        "area": "Carácter",
        "texto": "Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.",
        "unidad": "Manada",
        "como_se_cumple": "Demostrando escucha atenta sin interrumpir a los demás lobatos cuando comparten sus anécdotas."
    },
    {
        "id": "3a84066e-ad27-4122-9a89-4ae45844668b",
        "area": "Carácter",
        "texto": "Tengo amigos y amigas con los que siempre juego y me encuentro.",
        "unidad": "Manada",
        "como_se_cumple": "Fortaleciendo los lazos de amistad con mi seisena mediante la dinámica integradora."
    },

    # --- TROPA (Sociabilidad) ---
    {
        "id": "6a42179d-752c-4624-a9db-df85e0116d1b",
        "area": "Sociabilidad",
        "texto": "Ayudo en la limpieza y el mejoramiento de los lugares en que paseo y acampo.",
        "unidad": "Tropa",
        "como_se_cumple": "Participando activamente con mi patrulla en mantener el espacio de reunión ordenado para jugar."
    },
    {
        "id": "595ef0ea-e126-4e93-8b3e-79bee8d8e1a9",
        "area": "Sociabilidad",
        "texto": "Sé cuáles son los principales problemas ambientales de mi país.",
        "unidad": "Tropa",
        "como_se_cumple": "Proponiendo temas de cuidado del entorno cuando corresponda proponer consignas en las casillas del nido."
    },
    # --- TROPA (Afectividad) ---
    {
        "id": "a4060c60-7ce9-425b-bf2a-76941a689937",
        "area": "Afectividad",
        "texto": "Escucho las opiniones de los demás personas y si no estoy de acuerdo lo digo con respeto.",
        "unidad": "Tropa",
        "como_se_cumple": "Opinando con empatía y tolerancia frente a los puntos de vista expuestos por otros scouts."
    },
    {
        "id": "4ade9c82-6b0d-4a44-8bc6-2eb47a011ffb",
        "area": "Afectividad",
        "texto": "Digo lo que pienso con respeto hacia los demás personas.",
        "unidad": "Tropa",
        "como_se_cumple": "Expresando mis pensamientos de manera honesta y constructiva en el tablero de conversación."
    },
    # --- TROPA (Carácter) ---
    {
        "id": "0969a204-e8c6-4ab6-ac4f-c777bae066df",
        "area": "Carácter",
        "texto": "Aprecio los consejos que me dan en mi patrulla.",
        "unidad": "Tropa",
        "como_se_cumple": "Recibiendo con madurez las sugerencias y retroalimentaciones brindadas por mis compañeros de patrulla."
    },
    {
        "id": "f608eb2d-613a-477a-86f9-03e769a87bf2",
        "area": "Carácter",
        "texto": "Ayudo a mis compañeros de patrulla a superarse.",
        "unidad": "Tropa",
        "como_se_cumple": "Animando a mis compañeros más tímidos a expresarse libremente en su turno del nido."
    },

    # --- COMPAÑÍA (Sociabilidad, Afectividad, Carácter) ---
    {
        "id": "04b948d1-dee0-44ba-9122-966844fd61bf",
        "area": "Sociabilidad",
        "texto": "He participado con mi patrulla en la mantención de un huerto productivo u otro proyecto similar.",
        "unidad": "Compañía",
        "como_se_cumple": "Compartiendo vivencias sobre proyectos comunitarios realizados en conjunto con la patrulla."
    },
    {
        "id": "46017e67-80b2-4334-a154-3c2d0dfda7e3",
        "area": "Sociabilidad",
        "texto": "He participado con mi patrulla en proyectos de conservación.",
        "unidad": "Compañía",
        "como_se_cumple": "Relatando mis reflexiones y aprendizajes al participar en actividades de patrulla."
    },
    {
        "id": "2f8359db-221e-4a64-b2df-2b3e7b74a2db",
        "area": "Afectividad",
        "texto": "Escucho las opiniones de las demás personas y si no estoy de acuerdo lo digo con respeto.",
        "unidad": "Compañía",
        "como_se_cumple": "Argumentando mis posturas de forma respetuosa al responder a las consignas del tablero."
    },
    {
        "id": "3621f4ae-1316-4b3e-8682-3e3c9ad381a7",
        "area": "Afectividad",
        "texto": "Mantengo mi opinión cuando estoy convencida que es correcta.",
        "unidad": "Compañía",
        "como_se_cumple": "Defendiendo mis valores con solidez y amabilidad durante el intercambio en el juego."
    },
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
        "como_se_cumple": "Apoyando con empatía a quienes les cuesta compartir vivencias personales."
    },

    # --- AVANZADA (Sociabilidad, Afectividad, Carácter) ---
    {
        "id": "c3387367-af13-4910-9d13-002a08f93627",
        "area": "Sociabilidad",
        "texto": "Desarrollo proyectos de conservación en conjunto con jóvenes que no son guías o scouts.",
        "unidad": "Avanzada",
        "como_se_cumple": "Proponiendo dinámicas de integración inclusivas que abran el diálogo con jóvenes externos al movimiento."
    },
    {
        "id": "0d15923e-f877-486d-9a1b-9c3e487f035c",
        "area": "Afectividad",
        "texto": "Logro una relación de comprensión y afecto con mis padres y mantengo permanente comunicación con ellos.",
        "unidad": "Avanzada",
        "como_se_cumple": "Reflexionando abiertamente sobre los vínculos familiares y el diálogo intergeneracional en la comunidad."
    },
    {
        "id": "04ded0fb-289b-4d90-9f5f-821ec20a56c7",
        "area": "Carácter",
        "texto": "Aporto mi experiencia personal en las reuniones de mi Comunidad.",
        "unidad": "Avanzada",
        "como_se_cumple": "Aportando reflexiones profundas de mi trayectoria personal para orientar a los caminantes más jóvenes."
    }
]

contenido_html = """<h2>📜 Descripción del Juego</h2>
<p><strong>El Nido de los Recuerdos</strong> es una dinámica de integración en formato de tablero gigante que se dibuja directamente en un pliego grande de papel o cartulina. A través del azar de los dados y la participación colectiva, los jóvenes recorren casillas interactivas donde comparten anécdotas, reflexiones y sentimientos con sus compañeros de patrulla o seisena.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Preparación del Tablero:</strong> En el centro del pliego se dibuja un gran nido scout. Alrededor del nido se traza un camino circular dividido en casillas. Cada participante busca un objeto pequeño (una piedra bonita, una ficha o un botón) que servirá como su ficha personal.</li>
  <li><strong>Lanzamiento e Inicio:</strong> El primer jugador tira el dado y avanza tantas casillas como indique el número. Si cae en una casilla en blanco, debe escribir una consigna o pregunta amigable (por ejemplo: <em>"Cuenta tu momento más divertido en un campamento"</em> o <em>"Menciona una cualidad de tu compañero de al lado"</em>).</li>
  <li><strong>Desarrollo de la Dinámica:</strong> Si un jugador cae en una casilla que ya tiene una consigna escrita, debe responder a esa pregunta o cumplir la misión asignada antes de dar el paso al siguiente participante.</li>
  <li><strong>Conclusión:</strong> La actividad continúa de forma fluida hasta que todas las casillas hayan sido transitadas y el grupo decida hacer un cierre reflexivo.</li>
</ol>

<hr>

<h3>💡 Variaciones Adaptativas</h3>
<ul>
  <li><strong>Nido Temático de Patrulla:</strong> Las consignas del tablero se enfocan en hitos de la historia del grupo scout, anécdotas del último campamento o pasajes de la Ley y la Promesa.</li>
  <li><strong>Nido de Ilustración Doblada:</strong> En lugar de responder verbalmente, el participante tiene 1 minuto para hacer un dibujo rápido en el pliego que represente su respuesta, para que el resto del equipo intente adivinarlo.</li>
  <li><strong>Nido de la Promesa:</strong> Orientado a lobatos y scouts próximos a realizar su promesa, donde las casillas plantean situaciones éticas sobre cómo vivir la Promesa en la vida diaria.</li>
</ul>

<hr>

<h3>🛡️ Recomendaciones Detalladas para Dirigentes</h3>
<ul>
  <li><strong>Clima de Confianza Impecable:</strong> Los dirigentes deben asegurar que ningún participante sea juzgado o burlado por las experiencias expuestas. La regla de oro es el respeto absoluto y la escucha empática.</li>
  <li><strong>Inclusividad y Ritmo:</strong> Si algún niño muestra timidez o le cuesta expresarse en público, el dirigente o jefe de patrulla debe acompañarlo suavemente, ofreciendo opciones alternativas o preguntas facilitadoras.</li>
  <li><strong>Seguridad Emocional:</strong> Evitar preguntas de índole privada o sensible. Las consignas del juego deben orientarse siempre hacia el crecimiento positivo, el compañerismo y los valores scouts.</li>
</ul>"""

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
    "variaciones": "Nido Temático de Patrulla (enfocado en anécdotas scouts y Promesa), Nido de Ilustración Doblada (respuestas graficadas en papel para adivinar), Nido de la Promesa (casillas con desafíos de reflexión ética).",
    "recomendaciones": "Garantizar un entorno acogedor de escucha activa sin juzgar las intervenciones de ningún participante. Acompañar amorosamente a los niños más tímidos y evitar consignas de carácter privado.",
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
    $html${contenido_html}$html$,
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

with open("supabase/update_el_nido_v2.sql", "wb") as f:
    f.write(sql_script.encode("utf-8"))

print("Generated clean UTF-8 SQL file with dollar-quoting.")
