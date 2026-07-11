-- Migración corregida para registrar los objetivos educativos de ¿Quién Cuenta Mi Historia? (ID: 53cbdb8e-ffce-413b-bb9a-601fd070dc07)
-- Asegura coherencia pedagógica completa: todos los objetivos pertenecen a las mismas dimensiones/objetivos terminales.

-- 1. Limpiar relaciones anteriores de este artículo
DELETE FROM public.articulo_objetivos_educativos 
WHERE articulo_id = '53cbdb8e-ffce-413b-bb9a-601fd070dc07';

-- 2. Insertar las relaciones corregidas y coherentes
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '0d742d23-ebe1-40e6-97df-37bc03edb010', 'Expresando ideas y pistas creativas sobre el personaje misterioso a través del cuaderno de notas o registro de la patrulla para guiar al equipo.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '981fa19b-7f60-4e0e-b2fa-16123df5e37e', 'Expresando ideas y pistas creative sobre el personaje misterioso a través del cuaderno de notas o registro de la patrulla para guiar al equipo.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '9758e4f9-728b-4435-a8a3-11fd36c5e3be', 'Relatando de forma narrativa la letra o videoclip de una canción, o empleando mímicas y dramatizaciones sencillas para dar pistas sobre el personaje.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '6e910d1c-7021-49a5-9ece-637f480a1ec7', 'Relatando de forma narrativa la letra o videoclip de una canción, o empleando mímicas y dramatizaciones sencillas para dar pistas sobre el personaje.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'ed17d59c-1c64-4080-a206-bbe72eeae5a4', 'Analizando los rasgos distintivos e impacto cultural de personajes públicos y figuras históricas para narrar sus biografías con originalidad y estilo propio.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '91e60eba-e267-4d1a-b27b-ef61a7b03b31', 'Generando dinámicas de comunicación asertiva, relatos creativos y un clima de humor y esparcimiento que fortalezcan el encuentro fraterno en la comunidad.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando constructivamente al consensuar las reglas básicas y el formato de las pistas de la patrulla antes de iniciar el juego.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando constructivamente al consensuar las reglas básicas y el formato de las pistas de la patrulla antes de iniciar el juego.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando las reglas del juego (como no decir nombres propios) y expresando de buen grado su opinión técnica durante las apelaciones sobre la obviedad de las pistas.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando las reglas del juego (como no decir nombres propios) y expresando de buen grado su opinión técnica durante las apelaciones sobre la obviedad de las pistas.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Aceptando de manera madura las resoluciones arbitrales de la jefatura al dirimir los puntos disputados, sugiriendo mejoras reglamentarias al final de la actividad.'),
  ('53cbdb8e-ffce-413b-bb9a-601fd070dc07', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Promoviendo el juego limpio, el cumplimiento estricto del reglamento y la resolución pacífica y madura de cualquier controversia dentro de la comunidad.');

-- 3. Actualizar el campo metadata (JSONB) del artículo
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica grupal desafía a los participantes a idear formas creativas y alternativas de comunicación (mímicas, narrativas paralelas, canciones y biografías descriptivas) para expresar ideas, pensamientos y sentimientos en su comunidad (Creatividad). Asimismo, el formato cooperativo y el sistema de apelaciones fomenta el respeto por los reglamentos y las normas de convivencia acordados, facilitando el debate respetuoso y la resolución pacífica de discrepancias (Sociabilidad).",
  "objetivos_educativos": [
    {
      "id": "0d742d23-ebe1-40e6-97df-37bc03edb010",
      "area": "Creatividad",
      "texto": "Expreso mis pensamientos y experiencias en el Tally.",
      "unidad": "Compañía",
      "como_se_cumple": "Expresando ideas y pistas creativas sobre el personaje misterioso a través del cuaderno de notas o registro de la patrulla para guiar al equipo."
    },
    {
      "id": "981fa19b-7f60-4e0e-b2fa-16123df5e37e",
      "area": "Creatividad",
      "texto": "Expreso mis pensamientos y experiencias en el Tally.",
      "unidad": "Tropa",
      "como_se_cumple": "Expresando ideas y pistas creative sobre el personaje misterioso a través del cuaderno de notas o registro de la patrulla para guiar al equipo."
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
      "id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd",
      "area": "Sociabilidad",
      "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.",
      "unidad": "Compañía",
      "como_se_cumple": "Opinando constructivamente al consensuar las reglas básicas y el formato de las pistas de la patrulla antes de iniciar el juego."
    },
    {
      "id": "06ed2700-c963-4f13-a86a-2815b3a1530a",
      "area": "Sociabilidad",
      "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.",
      "unidad": "Tropa",
      "como_se_cumple": "Opinando constructivamente al consensuar las reglas básicas y el formato de las pistas de la patrulla antes de iniciar el juego."
    },
    {
      "id": "e2770a37-9927-47ed-a4d6-bae9feaf691c",
      "area": "Sociabilidad",
      "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.",
      "unidad": "Compañía",
      "como_se_cumple": "Respetando las reglas del juego (como no decir nombres propios) y expresando de buen grado su opinión técnica durante las apelaciones sobre la obviedad de las pistas."
    },
    {
      "id": "a594a460-1ab9-4c09-b01a-c2555163e86e",
      "area": "Sociabilidad",
      "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.",
      "unidad": "Tropa",
      "como_se_cumple": "Respetando las reglas del juego (como no decir nombres propios) y expresando de buen grado su opinión técnica durante las apelaciones sobre la obviedad de las pistas."
    },
    {
      "id": "f1496221-0da5-4775-b3ba-29e65603cfee",
      "area": "Sociabilidad",
      "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.",
      "unidad": "Avanzada",
      "como_se_cumple": "Aceptando de manera madura las resoluciones arbitrales de la jefatura al dirimir los puntos disputados, sugiriendo mejoras reglamentarias al final de la actividad."
    },
    {
      "id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e",
      "area": "Sociabilidad",
      "texto": "Cumplo las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.",
      "unidad": "Clan",
      "como_se_cumple": "Promoviendo el juego limpio, el cumplimiento estricto del reglamento y la resolución pacífica y madura de cualquier controversia dentro de la comunidad."
    }
  ]
}'::jsonb
WHERE id = '53cbdb8e-ffce-413b-bb9a-601fd070dc07';
