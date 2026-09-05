SET client_encoding = 'UTF8';
BEGIN;

DELETE FROM articulos WHERE slug = 'el-escultor-ciego';

INSERT INTO articulos (
  slug, 
  titulo, 
  extracto, 
  contenido, 
  imagen_destacada, 
  estado, 
  metadata, 
  created_at, 
  updated_at,
  categoria_id,
  autor_id
) VALUES (
  'el-escultor-ciego',
  'El Escultor Ciego',
  'Juego de percepción táctil y creatividad donde un escultor con los ojos vendados explora una estatua humana para recrear su postura exacta en un compañero.',
  '<h2>📜 Descripción de El Escultor Ciego</h2>
<p><b>El Escultor Ciego</b> es una dinámica scout de expresión corporal, sensibilización táctil y trabajo en equipo. En este juego, las seisenas o patrullas se organizan en tríos donde un participante actúa como modelo o estatua inmóvil, otro actúa como masa de arcilla maleable y el tercero asume el rol del escultor ciego. Mediante el uso exclusivo del sentido del tacto, el escultor debe interpretar la forma y pose del modelo para esculpir a su compañero de arcilla de forma idéntica.</p>
<p>La actividad fomenta la empatía, la concentración y el desarrollo de la percepción háptica en un ambiente de absoluta distensión y risas en la Manada, Compañía o Tropa.</p>

<h2>🎲 ¿Cómo se juega El Escultor Ciego?</h2>
<p>Para llevar a cabo la dinámica de forma ordenada, los dirigentes y guías deben seguir los siguientes pasos:</p>
<ul>
  <li><b>Formación de Tríos:</b> La Unidad se divide en grupos de 3 integrantes. En cada trío se asignan los roles de <i>Modelo (Estatua)</i>, <i>Escultor (Ciego)</i> y <i>Arcilla (Bloque)</i>.</li>
  <li><b>Vendado de Ojos:</b> El jugador que actúa como <i>Escultor</i> se coloca un pañolín cubriendo sus ojos o mantiene los ojos cerrados de forma firme.</li>
  <li><b>Petición de la Postura:</b> El dirigente o el <i>Modelo</i> adopta una postura corporal creativa, expresiva o cómica (ej. un atleta a punto de saltar, una estatua clásica, un personaje de cuento) y se queda completamente inmóvil.</li>
  <li><b>Exploración Táctil:</b> El <i>Escultor Ciego</i> palpa cuidadosamente con sus manos la posición de los brazos, piernas, inclinación del tronco y gestos del <i>Modelo</i> para formar un mapa mental de la figura.</li>
  <li><b>Proceso de Escultura:</b> Sin quitarse el pañolín, el <i>Escultor</i> se dirige hacia el jugador que hace de <i>Arcilla</i> y lo mueve suavemente moldeando sus extremidades y postura hasta lograr la réplica exacta.</li>
  <li><b>Rotación de Roles:</b> Una vez completada la escultura, se quita la venda para comparar el resultado visual. Se intercambian los roles dentro del trío para que todos experimenten la escultura háptica.</li>
</ul>

<h2>🏆 Cómputo de Puntos y Condición de Victoria de El Escultor Ciego</h2>
<p>Por ser una dinámica de integración y desarrollo sensorial, no existe un único ganador por eliminación. Sin embargo, se pueden otorgar puntos simbólicos o reconocimientos en el Tally por las siguientes condiciones:</p>
<ul>
  <li><b>Fidelidad de la Réplica:</b> Otorgar 5 puntos al equipo que logre la imitación más precisa de la inclinación y gestos del modelo original.</li>
  <li><b>Originalidad de la Estatua:</b> Otorgar 3 puntos al <i>Modelo</i> que proponga la postura más desafiante y creativa.</li>
  <li><b>Trabajo Fraterno y Cuidado:</b> Reconocer a los tríos que ejecuten el moldeado con respeto, gentileza y máxima concentración.</li>
</ul>',
  '/uploads/el-escultor-ciego.webp',
  'publicado',
  '{"areas": ["creatividad", "corporalidad", "sociabilidad"], "unidades": ["manada", "compañía", "tropa"], "duracion": "20 minutos", "cantidad": "12 participantes", "lugares": ["Interior", "Exterior"], "materiales": ["Pañolines"], "objetivos": ["Estimular la atención a los detalles", "Reforzar el desarrollo de los sentidos", "Fomentar la comunicación e interpretación", "Crear un ambiente de distensión"], "justificacion_areas": "El Escultor Ciego estimula la creatividad al requerir la representación e interpretación mental de formas a través del tacto. Desarrolla la corporalidad mediante el control propiocepcivo y la flexibilidad corporal al moldear y mantener posiciones inmóviles. Fortalece la sociabilidad al consolidar la confianza mutua, el respeto físico y la empatía en la dinámica de equipo.", "variaciones": "<b>Escultura Colectiva por Seisena:</b> En lugar de tríos, un solo escultor ciego debe moldear a toda la seisena para recrear un monumento histórico o escena completa.<br><b>El Escultor mudo:</b> El escultor ve la estatua pero no puede hablar ni tocar a la arcilla directamente, sino que debe dar indicaciones mediante golpecitos suaves de ritmo.<br><b>Esculturas con Materiales de Campamento:</b> Agregar accesorios como pañolines suplementarios o bordones para complementar la figura.", "recomendaciones": "Garantizar un espacio despejado y libre de obstáculos para evitar tropiezos de los jugadores con ojos vendados. Recordar a los beneficiarios que el moldeado corporal debe realizarse siempre con máximo respeto y delicadeza. Fomentar la risa sana y evitar tensiones musculares bruscas al mover las extremidades de los compañeros.", "objetivos_educativos": [{"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "unidad": "Manada", "texto": "Me gusta participar en juegos de observación.", "como_se_cumple": "Explorando tácticamente con atención la figura del modelo para reconocer cada detalle corporal."}, {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "unidad": "Manada", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "como_se_cumple": "Traduciendo con agilidad mental las sensaciones del tacto en una réplica física tridimensional."}, {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "area": "Creatividad", "unidad": "Compañía", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando las percepciones sensoriales e interpretando con precisión las formas descubiertas."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando la postura espacial desde la perspectiva táctil para moldear la arcilla humana."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Demostrando agilidad de interpretación háptica al guiar los brazos del compañero."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Resolviendo el desafío tridimensional mediante la síntesis y réplica precisa de la estatua."}, {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "unidad": "Manada", "texto": "Me gusta practicar deportes.", "como_se_cumple": "Ejercitando el equilibrio y el control muscular al sostener la posición inmóvil de la estatua."}, {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "unidad": "Manada", "texto": "Practico deportes, conozco sus reglas y sé perder.", "como_se_cumple": "Desarrollando la sensibilidad kinestésica y la coordinación propiaceptiva durante el moldeado."}, {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "unidad": "Compañía", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Manteniendo el dominio corporal y la soltura articular al dejarse guiar como arcilla."}, {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "unidad": "Compañía", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Demostrando autorregulación motriz y resistencia física al sostener figuras complejas."}, {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "unidad": "Tropa", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Afinando la percepción kinestésica del propio cuerpo frente al toque suave del escultor."}, {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "unidad": "Tropa", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Controlando la tensión muscular y perfeccionando la postura espacial en cada turno."}, {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "unidad": "Manada", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "como_se_cumple": "Aceptando con alegría las normas de respeto y cuidado mutuo durante el contacto táctil."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "unidad": "Manada", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "como_se_cumple": "Respetando los límites físicos del compañero y guiando con delicadeza sin forzar extremidades."}, {"id": "007e85ea-2b06-48c2-8ac1-873d59643aae", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Promoviendo un clima fraterno de confianza absoluta y cuidado recíproco dentro del trío."}, {"id": "de2f5693-de4b-48f1-b870-3c62be99aea8", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Fomentando la integración limpia y el respeto por el trabajo del compañero de patrulla."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Cumpliendo con honestidad las reglas de ceguedad y acatando el espacio personal del par."}, {"id": "bbc48d53-f4aa-4de7-84d4-95614df76034", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Fortaleciendo los lazos de fraternidad scout a través del juego limpio y la empatía compartida."}]}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL
);


INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 1 FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 7 FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 10 FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Explorando tácticamente con atención la figura del modelo para reconocer cada detalle corporal.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Traduciendo con agilidad mental las sensaciones del tacto en una réplica física tridimensional.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 'Expresando las percepciones sensoriales e interpretando con precisión las formas descubiertas.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando la postura espacial desde la perspectiva táctil para moldear la arcilla humana.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Demostrando agilidad de interpretación háptica al guiar los brazos del compañero.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Resolviendo el desafío tridimensional mediante la síntesis y réplica precisa de la estatua.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Ejercitando el equilibrio y el control muscular al sostener la posición inmóvil de la estatua.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Desarrollando la sensibilidad kinestésica y la coordinación propiaceptiva durante el moldeado.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '1427451e-b8b3-493b-8525-e53298381e07', 'Manteniendo el dominio corporal y la soltura articular al dejarse guiar como arcilla.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b12da732-d736-480c-82b8-95b312316390', 'Demostrando autorregulación motriz y resistencia física al sostener figuras complejas.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0765469b-caef-4457-9d6b-cb739c855402', 'Afinando la percepción kinestésica del propio cuerpo frente al toque suave del escultor.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Controlando la tensión muscular y perfeccionando la postura espacial en cada turno.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando con alegría las normas de respeto y cuidado mutuo durante el contacto táctil.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando los límites físicos del compañero y guiando con delicadeza sin forzar extremidades.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '007e85ea-2b06-48c2-8ac1-873d59643aae', 'Promoviendo un clima fraterno de confianza absoluta y cuidado recíproco dentro del trío.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Fomentando la integración limpia y el respeto por el trabajo del compañero de patrulla.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Cumpliendo con honestidad las reglas de ceguedad y acatando el espacio personal del par.' FROM articulos WHERE slug = 'el-escultor-ciego';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Fortaleciendo los lazos de fraternidad scout a través del juego limpio y la empatía compartida.' FROM articulos WHERE slug = 'el-escultor-ciego';
    
COMMIT;