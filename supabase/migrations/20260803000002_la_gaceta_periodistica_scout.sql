SET client_encoding = 'UTF8';
BEGIN;

INSERT INTO articulos (
  autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at
)
VALUES (
  NULL,
  NULL,
  'La Gaceta Periodística Scout',
  'la-gaceta-periodistica-scout',
  'Taller cooperativo de expresión y periodismo donde las patrullas rotan por salas de redacción para publicar la edición antes del cierre de imprenta.',
  '<h2>📜 Descripción y Ambientación del Juego (Marco Simbólico)</h2><p><strong>La Gaceta Periodística Scout</strong> es un apasionante taller de expresión, creatividad periodística e interpretación dramática en recintos cerrados.</p><p>La historia cuenta que el misterioso Director General de la afamada <em>Gaceta Informativa Scout</em> ha desaparecido de forma repentina poco antes del cierre de imprenta. Con el reloj corriendo en su contra, las patrullas asumen el reto de transformarse en equipos de redacción junior. Su misión es recorrer cuatro departamentos de prensa, redactar las breaking news, adivinar reporteros de voz oculta, construir una novela cooperativa y dramatizar anuncios comerciales para que la edición de la Gaceta salga a la luz a tiempo.</p><h2>🎲 ¿Cómo se juega? Paso a Paso Detallado</h2><ol><li><strong>Organización de Puestos de Redacción:</strong><ul><li>Se disponen 4 salas o estaciones contiguas identicadas con un símbolo periodístico. Cada equipo de redacción pasa 10 minutos en cada sala antes de rotar a la siguiente:<ul><li><strong>Puesto 1 (Noticias Rimadas):</strong> Inventar titulares y noticias breves disparatadas que tengan rima y ritmo pegajoso.</li><li><strong>Puesto 2 (Voces Enigmáticas):</strong> Cada integrante graba una lectura desfigurando su voz. El equipo visitante escucha las grabaciones e intenta adivinar las identidades de los reporteros.</li><li><strong>Puesto 3 (Folletín Cadáver Exquisito):</strong> Se redacta una historia cooperativa sobre papel continuo. Al terminar los 10 minutos, el equipo enrolla el papel sellándolo con clips de modo que el siguiente grupo solo pueda leer la última línea escrita.</li><li><strong>Puesto 4 (Comerciales Dramatizados):</strong> Crear y ensayar anuncios publicitarios cómicos para ser presentados en vivo al final de la jornada.</li></ul></li></ul></li><li><strong>Cierre Editorial y Noticiero en Vivo:</strong><ul><li>Una vez completada la rotación por los 4 puestos, la unidad se reúne en el Salón Principal para el <em>Noticiero Final</em>: se lee el folletín cooperativo completo, se revelan las identidades de las voces enigmáticas y se presentan los comerciales dramatizados.</li></ul></li></ol><h2>🏆 Cómputo de Puntos y Condición de Victoria</h2><p><strong>¿Cómo se determina al Equipo Ganador?</strong> El objetivo central es lograr la publicación completa de la Gaceta en equipo. El jurado de la sala de prensa otorga el Trofeo Editorial al equipo que obtenga la mayor puntuación:</p><ul><li><strong>Adivinar correctamente las voces del Puesto 2:</strong> 10 puntos por voz descubierta.</li><li><strong>Mejor titular periodístico rimado:</strong> 25 puntos.</li><li><strong>Dramatización comercial más original y divertida:</strong> 25 puntos.</li><li><strong>Espíritu de equipo y puntualidad en las rotaciones:</strong> 15 puntos bonus.</li></ul><p>Al concluir el noticiero, todos los reporteros celebran la salida a imprenta de La Gaceta cantando el himno de unidad.</p>',
  '/uploads/la-gaceta-periodistica-scout.webp',
  'publicado',
  '{"unidades": ["manada", "compañía", "tropa"], "duracion": "60 minutos", "cantidad": "24 participantes", "lugares": ["Interior", "Salón"], "materiales": ["Papel", "Lápiz", "Grabadora", "Pegamento", "Clips"], "areas": ["creatividad", "sociabilidad", "afectividad"], "objetivos": ["Estimular la creatividad", "Fomentar la comunicación en el grupo", "Fomentar la comunicación e interpretación", "Trabajo en equipo"], "justificacion_areas": "Esta actividad de expresión periodística y taller de interior ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Creatividad:</b> Estimula la imaginación, la redacción periodística rítmica y la invención de historias fantásticas cooperativas bajo la técnica del cadáver exquisito.\n\n2. <b>Sociabilidad:</b> Fortalece el trabajo en equipo, la distribución equitativa de tareas y la interacción fraterna entre patrullas al construir colectivamente la edición final del periódico.\n\n3. <b>Afectividad:</b> Desarrolla la desinhibición, el sentido del humor y la expresión de emociones mediante la dramatización de comerciales divertidos y la distorsión de voz.", "variaciones": "<b>Modalidad de Edición Digital:</b> Se puede reemplazar la grabadora física y los folios de papel por una tablet o computadora para maquetar la edición en PDF. <b>Variante con pañolines:</b> Los reporteros de cada puesto pueden sujetar pañolines de colores para representar su departamento de redacción.", "recomendaciones": "<b>Organización del Espacio:</b> Preparar 4 salas o estaciones cerradas bien iluminadas con mesas de trabajo. Asegurar que los dirigentes de cada puesto faciliten el flujo rotativo de 10 minutos por estación sin demoras.", "objetivos_educativos": [{"id": "52b5580a-7d0f-454f-b2ae-0d3318129165", "area": "Creatividad", "unidad": "Manada", "texto": "Canto, bailo y preparo actuaciones con mis amigos de la Manada.", "como_se_cumple": "Preparando representaciones divertidas de comerciales y rimas periodísticas con mis amigos de la seisena."}, {"id": "14b82459-ac31-4496-a875-8e9bd5666030", "area": "Creatividad", "unidad": "Manada", "texto": "En las actividades que hago se nota lo que pienso y siento.", "como_se_cumple": "Expresando con entusiasmo mis ideas y sentimientos en la redacción de las noticias disparatadas."}, {"id": "7449ad52-5047-4116-b71b-1937cca85587", "area": "Sociabilidad", "unidad": "Manada", "texto": "Cumplo las tareas de servicio que me encargan en la Manada.", "como_se_cumple": "Asumiendo con responsabilidad mi turno en las salas de redacción para completar la gaceta a tiempo."}, {"id": "27a71b44-9900-46e9-be75-38900c629663", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo siempre en las tareas de servicio que se deben hacer en la Manada.", "como_se_cumple": "Colaborando alegremente en el ensamblaje cooperativo del culebrón escrito en papel continuo."}, {"id": "36b44b5b-601f-4d7f-a510-8266479c9da1", "area": "Afectividad", "unidad": "Manada", "texto": "Me gusta tener nuevos amigos y amigas.", "como_se_cumple": "Integrándome con afecto y confianza a la dinámica de distorsión de voces con mi equipo."}, {"id": "9f8cdd1f-20d5-47f8-92c2-a660693c348f", "area": "Afectividad", "unidad": "Manada", "texto": "Soy cada vez más amigo de mis amigos y amigas, pero igual aprecio a mis demás compañeros.", "como_se_cumple": "Apreciando con empatía las voces grabadas y las creaciones humorísticas de mis compañeros."}, {"id": "0d742d23-ebe1-40e6-97df-37bc03edb010", "area": "Creatividad", "unidad": "Compañía", "texto": "Expreso mis pensamientos y experiencias en el Tally.", "como_se_cumple": "Redactando y expresando mis experiencias e ideas en los folios de prensa de mi patrulla."}, {"id": "9758e4f9-728b-4435-a8a3-11fd36c5e3be", "area": "Creatividad", "unidad": "Compañía", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "como_se_cumple": "Desplegando mis habilidades de redacción y expresión artística al dramatizar los anuncios publicitarios."}, {"id": "670852e4-d07d-48f5-b39b-b0b336059600", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Converso con mi patrulla sobre los derechos humanos.", "como_se_cumple": "Fomentando la conversación respetuosa y el diálogo abierto en las mesas de trabajo de la gaceta."}, {"id": "80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Participo en actividades relacionadas con los derechos de las personas.", "como_se_cumple": "Promoviendo la libertad de expresión y la cooperación solidaria al redactar la edición periodística."}, {"id": "2f8359db-221e-4a64-b2df-2b3e7b74a2db", "area": "Afectividad", "unidad": "Compañía", "texto": "Escucho las opiniones de las demás personas y si no estoy de acuerdo lo digo con respeto.", "como_se_cumple": "Escuchando con respeto las grabaciones de voz y expresando mis divergencias sin brusquedad."}, {"id": "0be7336d-2934-49dd-95c1-3d881a510463", "area": "Afectividad", "unidad": "Compañía", "texto": "Aprecio a mis amigos y amigas y no me enojo con ellos por cosas cualquier cosa.", "como_se_cumple": "Manteniendo la alegría, el buen humor y la fraternidad scout durante las rotaciones por las salas."}, {"id": "39eaf1aa-f703-4fd0-a4b3-b9756dc30539", "area": "Creatividad", "unidad": "Tropa", "texto": "Participo con entusiasmo en las actividades artísticas de mi Tropa.", "como_se_cumple": "Participando con entusiasmo en las presentaciones dramatizadas del noticiero de la tropa."}, {"id": "0136350b-c2b2-429f-8feb-2fdc57e29b8b", "area": "Creatividad", "unidad": "Tropa", "texto": "Me gusta cantar y conozco muchas canciones.", "como_se_cumple": "Interpretando jingles y anuncios publicitarios con creatividad verbal durante la muestra final."}, {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Cumplo los compromisos que asumo.", "como_se_cumple": "Cumpliendo con puntualidad la rotación de 10 minutos asignada a cada puesto de redacción."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "como_se_cumple": "Apoyando a mi patrulla en la integración fluida del culebrón escrito en papel continuo."}, {"id": "20b1ffa1-6c06-49b4-91fd-fe92628f7a19", "area": "Afectividad", "unidad": "Tropa", "texto": "Soy capaz de decir que no cuando creo que algo es incorrecto.", "como_se_cumple": "Expresando mi opinión con asertividad al adivinar las identidades de las voces grabadas."}, {"id": "3693aeed-e3ad-4ac9-878c-5874b61dc8d3", "area": "Afectividad", "unidad": "Tropa", "texto": "Aprecio a mis amigos y amigos y no me enojo con ellos por cosas cualquier cosa.", "como_se_cumple": "Valorando la amistad y la convivencia fraterna al celebrar la publicación completa de la gaceta."}]}'::jsonb,
  ARRAY['taller', 'periodismo', 'creatividad', 'expresion']::text[],
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  autor_id = NULL,
  titulo = EXCLUDED.titulo,
  extracto = EXCLUDED.extracto,
  contenido = EXCLUDED.contenido,
  imagen_destacada = EXCLUDED.imagen_destacada,
  metadata = EXCLUDED.metadata,
  etiquetas = EXCLUDED.etiquetas,
  updated_at = NOW();

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 1 FROM articulos WHERE slug = 'la-gaceta-periodistica-scout'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 11 FROM articulos WHERE slug = 'la-gaceta-periodistica-scout'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

DELETE FROM articulo_objetivos_educativos 
WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'la-gaceta-periodistica-scout');


INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '52b5580a-7d0f-454f-b2ae-0d3318129165', 'Preparando representaciones divertidas de comerciales y rimas periodísticas con mis amigos de la seisena.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '14b82459-ac31-4496-a875-8e9bd5666030', 'Expresando con entusiasmo mis ideas y sentimientos en la redacción de las noticias disparatadas.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7449ad52-5047-4116-b71b-1937cca85587', 'Asumiendo con responsabilidad mi turno en las salas de redacción para completar la gaceta a tiempo.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '27a71b44-9900-46e9-be75-38900c629663', 'Colaborando alegremente en el ensamblaje cooperativo del culebrón escrito en papel continuo.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '36b44b5b-601f-4d7f-a510-8266479c9da1', 'Integrándome con afecto y confianza a la dinámica de distorsión de voces con mi equipo.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '9f8cdd1f-20d5-47f8-92c2-a660693c348f', 'Apreciando con empatía las voces grabadas y las creaciones humorísticas de mis compañeros.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0d742d23-ebe1-40e6-97df-37bc03edb010', 'Redactando y expresando mis experiencias e ideas en los folios de prensa de mi patrulla.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '9758e4f9-728b-4435-a8a3-11fd36c5e3be', 'Desplegando mis habilidades de redacción y expresión artística al dramatizar los anuncios publicitarios.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '670852e4-d07d-48f5-b39b-b0b336059600', 'Fomentando la conversación respetuosa y el diálogo abierto en las mesas de trabajo de la gaceta.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2', 'Promoviendo la libertad de expresión y la cooperación solidaria al redactar la edición periodística.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2f8359db-221e-4a64-b2df-2b3e7b74a2db', 'Escuchando con respeto las grabaciones de voz y expresando mis divergencias sin brusquedad.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0be7336d-2934-49dd-95c1-3d881a510463', 'Manteniendo la alegría, el buen humor y la fraternidad scout durante las rotaciones por las salas.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '39eaf1aa-f703-4fd0-a4b3-b9756dc30539', 'Participando con entusiasmo en las presentaciones dramatizadas del noticiero de la tropa.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0136350b-c2b2-429f-8feb-2fdc57e29b8b', 'Interpretando jingles y anuncios publicitarios con creatividad verbal durante la muestra final.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Cumpliendo con puntualidad la rotación de 10 minutos asignada a cada puesto de redacción.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Apoyando a mi patrulla en la integración fluida del culebrón escrito en papel continuo.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '20b1ffa1-6c06-49b4-91fd-fe92628f7a19', 'Expresando mi opinión con asertividad al adivinar las identidades de las voces grabadas.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3693aeed-e3ad-4ac9-878c-5874b61dc8d3', 'Valorando la amistad y la convivencia fraterna al celebrar la publicación completa de la gaceta.' FROM articulos WHERE slug = 'la-gaceta-periodistica-scout';
    
COMMIT;