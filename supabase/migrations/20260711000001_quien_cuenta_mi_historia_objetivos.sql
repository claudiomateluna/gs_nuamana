-- Migración para registrar los objetivos educativos de ¿Quién Cuenta Mi Historia? (ID: 53cbdb8e-ffce-413b-bb9a-601fd070dc07)

-- 1. Insertar relaciones en la tabla intermedia articulo_objetivos_educativos
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'd531dd19-4d49-4342-8114-184de017ac49', 'Ideando descripciones, analogías y pistas de forma verbal para comunicar quién es el personaje oculto sin mencionar su nombre directamente.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '0b23d4c8-6e40-4e8e-a476-97ed92efa152', 'Ideando descripciones, analogías y pistas de forma verbal para comunicar quién es el personaje oculto sin mencionar su nombre directamente.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '9758e4f9-728b-4435-a8a3-11fd36c5e3be', 'Relatando de forma narrativa la letra o videoclip de una canción, o empleando mímicas y dramatizaciones sencillas para dar pistas sobre el personaje.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '6e910d1c-7021-49a5-9ece-637f480a1ec7', 'Relatando de forma narrativa la letra o videoclip de una canción, o empleando mímicas y dramatizaciones sencillas para dar pistas sobre el personaje.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'ed17d59c-1c64-4080-a206-bbe72eeae5a4', 'Analizando los rasgos distintivos e impacto cultural de personajes públicos y figuras históricas para narrar sus biografías con originalidad y estilo propio.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '91e60eba-e267-4d1a-b27b-ef61a7b03b31', 'Generando dinámicas de comunicación asertiva, relatos creativos y un clima de humor y esparcimiento que fortalezcan el encuentro fraterno en la comunidad.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'd737dfda-2d8d-4ca8-b650-8612d90b434e', 'Colaborando activamente dentro de su equipo para adivinar todos los personajes antes que los rivales, aportando ideas y escuchando pistas.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'c6ec1a8c-37fb-441c-860c-755143523afe', 'Colaborando activamente dentro de su equipo para adivinar todos los personajes antes que los rivales, aportando ideas y escuchando pistas.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Respetando las reglas del juego (como no decir nombres propios) y aceptando de buen grado las decisiones arbitrales de los dirigentes cuando hay apelaciones.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Respetando las reglas del juego (como no decir nombres propios) y aceptando de buen grado las decisiones arbitrales de los dirigentes cuando hay apelaciones.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '810efaf9-df8b-434e-9f6f-838a6e9e2a83', 'Aceptando responsablemente las resoluciones de los dirigentes encargados de dirimir las apelaciones entre equipos sobre la obviedad de las pistas.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '90b668d6-3e32-4544-ac2a-7f1348b4f37f', 'Promoviendo la resolución pacífica de discrepancias de juego mediante el respeto al arbitraje de los dirigentes, y cooperando para que la dinámica se desarrolle en un marco de orden y juego limpio.')
ON CONFLICT (articulo_id, objetivo_id) 
DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

-- 2. Actualizar el campo metadata (JSONB) del artículo
UPDATE articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica grupal desafía a los participantes a idear formas creativas y alternativas de comunicación (mímicas, narrativas paralelas, canciones y biografías descriptivas) para descifrar la identidad de personajes sin revelar sus nombres (Creatividad). Asimismo, el formato cooperativo y el sistema de apelaciones fomenta el trabajo en equipo, la honestidad, el juego limpio y el respeto por los reglamentos acordados y la toma de decisiones arbitrales por parte de la dirigencia (Sociabilidad).",
  "objetivos_educativos": [
    {
      "id": "d531dd19-4d49-4342-8114-184de017ac49",
      "area": "Creatividad",
      "texto": "Conozco diferentes técnicas de comunicación y sé utilizar algunas de ellas.",
      "unidad": "Compañía",
      "como_se_cumple": "Ideando descripciones, analogías y pistas de forma verbal para comunicar quién es el personaje oculto sin mencionar su nombre directamente."
    },
    {
      "id": "0b23d4c8-6e40-4e8e-a476-97ed92efa152",
      "area": "Creatividad",
      "texto": "Conozco diferentes técnicas de comunicación y sé utilizar algunos de ellos.",
      "unidad": "Tropa",
      "como_se_cumple": "Ideando descripciones, analogías y pistas de forma verbal para comunicar quién es el personaje oculto sin mencionar su nombre directamente."
    },
    {
      "id": "9758e4f9-728b-4435-a8a3-11fd36c5e3be",
      "area": "Creatividad",
      "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.",
      "unidad": "Compañía",
      "como_se_cumple": "Relatando de forma narrativa la letra o videoclip de una canción, o empleando mímicas y dramatizaciones sencillas para dar pistas sobre el personaje."
    },
    {
      "id": "6e910d1c-7021-49a5-9ece-637f480a1ec7",
      "area": "Creatividad",
      "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.",
      "unidad": "Tropa",
      "como_se_cumple": "Relatando de forma narrativa la letra o videoclip de una canción, o empleando mímicas y dramatizaciones sencillas para dar pistas sobre el personaje."
    },
    {
      "id": "ed17d59c-1c64-4080-a206-bbe72eeae5a4",
      "area": "Creatividad",
      "texto": "Trato de expresarme de un modo propio, y soy capaz de mirar críticamente tendencias e ídolos sociales.",
      "unidad": "Avanzada",
      "como_se_cumple": "Analizando los rasgos distintivos e impacto cultural de personajes públicos y figuras históricas para narrar sus biografías con originalidad y estilo propio."
    },
    {
      "id": "91e60eba-e267-4d1a-b27b-ef61a7b03b31",
      "area": "Creatividad",
      "texto": "Expreso lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúo espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.",
      "unidad": "Clan",
      "como_se_cumple": "Generando dinámicas de comunicación asertiva, relatos creativos y un clima de humor y esparcimiento que fortalezcan el encuentro fraterno en la comunidad."
    },
    {
      "id": "d737dfda-2d8d-4ca8-b650-8612d90b434e",
      "area": "Sociabilidad",
      "texto": "Trabajo con las demás personas para lograr las metas que nos hemos propuesto.",
      "unidad": "Compañía",
      "como_se_cumple": "Colaborando activamente dentro de su equipo para adivinar todos los personajes antes que los rivales, aportando ideas y escuchando pistas."
    },
    {
      "id": "c6ec1a8c-37fb-441c-860c-755143523afe",
      "area": "Sociabilidad",
      "texto": "Trabajo con los demás personas para lograr las metas que nos hemos propuesto.",
      "unidad": "Tropa",
      "como_se_cumple": "Colaborando activamente dentro de su equipo para adivinar todos los personajes antes que los rivales, aportando ideas y escuchando pistas."
    },
    {
      "id": "de2f5693-de4b-48f1-b870-3c62be99aea8",
      "area": "Sociabilidad",
      "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.",
      "unidad": "Compañía",
      "como_se_cumple": "Respetando las reglas del juego (como no decir nombres propios) y aceptando de buen grado las decisiones arbitrales de los dirigentes cuando hay apelaciones."
    },
    {
      "id": "bbc48d53-f4aa-4de7-84d4-95614df76034",
      "area": "Sociabilidad",
      "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.",
      "unidad": "Tropa",
      "como_se_cumple": "Respetando las reglas del juego (como no decir nombres propios) y aceptando de buen grado las decisiones arbitrales de los dirigentes cuando hay apelaciones."
    },
    {
      "id": "810efaf9-df8b-434e-9f6f-838a6e9e2a83",
      "area": "Sociabilidad",
      "texto": "Respeto la autoridad válidamente elegida, aunque no comparta sus ideas.",
      "unidad": "Avanzada",
      "como_se_cumple": "Aceptando responsablemente las resoluciones de los dirigentes encargados de dirimir las apelaciones entre equipos sobre la obviedad de las pistas."
    },
    {
      "id": "90b668d6-3e32-4544-ac2a-7f1348b4f37f",
      "area": "Sociabilidad",
      "texto": "Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.",
      "unidad": "Clan",
      "como_se_cumple": "Promoviendo la resolución pacífica de discrepancias de juego mediante el respeto al arbitraje de los dirigentes, y cooperando para que la dinámica se desarrolle en un marco de orden y juego limpio."
    }
  ]
}'::jsonb
WHERE id = '53cbdb8e-ffce-413b-bb9a-601fd070dc07';
