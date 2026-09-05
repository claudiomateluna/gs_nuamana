SET client_encoding = 'UTF8';
BEGIN;

DELETE FROM articulos WHERE slug = 'el-desafio-del-yeti';

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
  'el-desafio-del-yeti',
  'El Desafío del Yeti',
  'Juego nocturno de expresión dramática y control de la risa donde un ''Yeti'' intenta reanimar a sus compañeros ''congelados'' en la noche de campamento.',
  '<h2>📜 Descripción de El Desafío del Yeti</h2>
<p><b>El Desafío del Yeti</b> es una dinámica nocturna scout de alta energía, teatralidad y contención cómica. En esta actividad de campamento o velada, un jugador o dirigente asume el rol del temible <i>Yeti de las Nieves</i>, quien entra rugiendo dramáticamente a la sala o zona de campamento haciendo que todos los demás scouts ''caigan congelados'' e inmóviles al suelo.</p>
<p>El objetivo del Yeti es utilizar muecas, chistes, actuaciones y dramatizaciones sin contacto físico para lograr que los jugadores congelados se muevan o se rían, ''descongelándolos'' e integrándolos a su manada de Yetitos para conquistar la noche.</p>

<h2>🎲 ¿Cómo se juega El Desafío del Yeti?</h2>
<p>Para llevar a cabo el juego de forma segura y coordinada, se deben seguir los siguientes pasos:</p>
<ul>
  <li><b>Designación del Yeti:</b> Se selecciona a un jugador o dirigente para actuar como el <i>Yeti</i> inicial, quien se retira brevemente del espacio iluminado o de la carpa.</li>
  <li><b>Entrada Dramática:</b> El Yeti regresa irrumpiendo con un rugido estruendoso y divertido. Al escucharlo, todos los participantes deben caer al suelo inmediatamente y permanecer completamente inmóviles, como estatuas congeladas.</li>
  <li><b>Intento de Reanimación:</b> El Yeti recorre la sala realizando muecas extravagantes, sonidos cómicos y actuaciones teatrales frente a los jugadores caídos.</li>
  <li><b>Prohibición de Contacto:</b> Queda <b>estrictamente prohibido tocar a los jugadores o hacerles cosquillas</b>. La reanimación debe lograrse únicamente mediante la expresión cómica y gestual.</li>
  <li><b>Transformación en Yetito:</b> En el instante en que un participante se mueve, pestañea excesivamente o se echa a reír, se convierte en un <i>Yetito</i>. El jugador se levanta, emite su propio rugido y se une al Yeti original.</li>
  <li><b>Conclusión:</b> La ronda continúa con el grupo de Yetitos rugiendo juntos en cada entrada hasta que todo el grupo ha sido ''descongelado'' y transformado.</li>
</ul>

<h2>🏆 Cómputo de Puntos y Condición de Victoria de El Desafío del Yeti</h2>
<p>La actividad prioriza la distensión y el desfogue de energía. Para introducir un espíritu de competencia fraterna por seisenas o patrullas, se pueden otorgar los siguientes reconocimientos en el Tally:</p>
<ul>
  <li><b>Último Jugador Congelado:</b> Otorgar 5 puntos a la patrulla o seisena cuyo integrante demuestre el mayor autodominio y permanezca inmóvil hasta el final.</li>
  <li><b>Mejor Actuación de Yeti:</b> Otorgar 3 puntos al participante que realice las dramatizaciones gestuales más creativas y divertidas sin tocar a sus compañeros.</li>
  <li><b>Espíritu de Equipo:</b> Otorgar 3 puntos a la unidad que mantenga la mejor actitud de fair play y respeto al espacio personal durante la noche.</li>
</ul>',
  '/uploads/el-desafio-del-yeti.webp',
  'publicado',
  '{"areas": ["carácter", "creatividad", "sociabilidad"], "unidades": ["manada", "compañía", "tropa"], "duracion": "30 minutos", "cantidad": "16 participantes", "lugares": ["Interior", "Exterior"], "materiales": ["Sin Materiales"], "objetivos": ["Perder el miedo a la oscuridad", "Desfogue de Energías", "Desarrollar el carácter mediante la cooperación", "Fomentar un entorno de confianza"], "justificacion_areas": "El Desafío del Yeti fomenta el carácter mediante el desarrollo del autocontrol, la capacidad de contención cómica y la superación de la inhibición ante el grupo. Estimula la creatividad a través de la improvisación teatral y la expresión gestual humorística. Fortalece la sociabilidad al crear un clima de fraternidad, confianza recíproca y distensión colectiva en las veladas de campamento.", "variaciones": "<b>El Yeti bajo Paracaídas:</b> En lugar de una habitación, el juego se realiza debajo de una estructura de paracaídas o toldo scout a la luz de linternas atenuadas.<br><b>El Yeti de las Preguntas:</b> El Yeti puede hacer preguntas absurdas a los jugadores congelados; si alguno responde sin querer, se convierte en Yetito.<br><b>Yetis Temáticos:</b> Adaptar la historia del Yeti a personajes mitológicos locales o leyendas de la zona de campamento.", "recomendaciones": "Asegurar que el espacio esté acolchado o sobre sacos de dormir para que las caídas ''congeladas'' sean suaves y seguras. Enfatizar la regla de NO contacto físico ni cosquillas para garantizar el respeto al espacio personal de cada beneficiario. Mantener una iluminación tenue adecuada para potenciar la atmósfera mágica de la velada nocturna.", "objetivos_educativos": [{"id": "041daaea-c4a7-472b-a613-951bd25cfa85", "area": "Carácter", "unidad": "Manada", "texto": "Reconozco y acepto mis errores.", "como_se_cumple": "Aceptando con alegría y autocontrol la risa involuntaria al transformarme en Yetito."}, {"id": "4df1ba93-06fe-4f49-b273-fddc3800cf17", "area": "Carácter", "unidad": "Manada", "texto": "Le doy importancia a las cosas que hago bien.", "como_se_cumple": "Valorando mi capacidad de autodominio y concentración para mantenerme inmóvil."}, {"id": "2cc128e0-7cc6-49df-a7c5-825f6ab79793", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que puedo ser cada día mejor.", "como_se_cumple": "Superando la vergüenza escénica para participar activamente en la dramatización grupal."}, {"id": "006c5b09-47cf-4ed8-bf25-212203261a03", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Demostrando seguridad y soltura al expresar personajes cómicos en la velada."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Reconociendo mis límites de contención emocional bajo la presión del juego humorístico."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Asumiendo el rol protagónico del Yeti con determinación y liderazgo en el equipo."}, {"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "unidad": "Manada", "texto": "Me gusta participar en juegos de observación.", "como_se_cumple": "Observando atentamente los gestos del Yeti para anticipar sus movimientos sin moverme."}, {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "unidad": "Manada", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "como_se_cumple": "Improvisando recursos cómicos e innovadores para hacer reír a los compañeros inmóviles."}, {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "area": "Creatividad", "unidad": "Compañía", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando emociones mediante la actuación expresiva y la personificación nocturna."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando la debilidad cómica de cada compañero para lograr su descongelamiento."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Desarrollando la agilidad de improvisación dramática en el marco de la actuación."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Diseñando estrategias teatrales efectivas para dinamizar el ambiente de la patrulla."}, {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "unidad": "Manada", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "como_se_cumple": "Respetando con disciplina la prohibición estricta de contacto físico y cosquillas."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "unidad": "Manada", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "como_se_cumple": "Acatando las reglas de inmovilidad y respetando el espacio de juego de los demás."}, {"id": "007e85ea-2b06-48c2-8ac1-873d59643aae", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Promoviendo el fair play y el respeto mutuo durante el desarrollo del juego nocturno."}, {"id": "de2f5693-de4b-48f1-b870-3c62be99aea8", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Manteniendo el comportamiento ético y fraterno en las actividades de campamento."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Cumpliendo con honestidad scout la declaración de congelamiento o descongelamiento."}, {"id": "bbc48d53-f4aa-4de7-84d4-95614df76034", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Favoreciendo la sana convivencia y la integración fraterna de todos los participantes."}]}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL
);


INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 1 FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 7 FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 9 FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 10 FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '041daaea-c4a7-472b-a613-951bd25cfa85', 'Aceptando con alegría y autocontrol la risa involuntaria al transformarme en Yetito.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4df1ba93-06fe-4f49-b273-fddc3800cf17', 'Valorando mi capacidad de autodominio y concentración para mantenerme inmóvil.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2cc128e0-7cc6-49df-a7c5-825f6ab79793', 'Superando la vergüenza escénica para participar activamente en la dramatización grupal.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '006c5b09-47cf-4ed8-bf25-212203261a03', 'Demostrando seguridad y soltura al expresar personajes cómicos en la velada.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', 'Reconociendo mis límites de contención emocional bajo la presión del juego humorístico.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '78bd48d3-5d26-4218-843a-33712bade630', 'Asumiendo el rol protagónico del Yeti con determinación y liderazgo en el equipo.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Observando atentamente los gestos del Yeti para anticipar sus movimientos sin moverme.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Improvisando recursos cómicos e innovadores para hacer reír a los compañeros inmóviles.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 'Expresando emociones mediante la actuación expresiva y la personificación nocturna.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando la debilidad cómica de cada compañero para lograr su descongelamiento.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Desarrollando la agilidad de improvisación dramática en el marco de la actuación.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Diseñando estrategias teatrales efectivas para dinamizar el ambiente de la patrulla.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b69188bf-2391-43c1-a885-abd1b13912be', 'Respetando con disciplina la prohibición estricta de contacto físico y cosquillas.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Acatando las reglas de inmovilidad y respetando el espacio de juego de los demás.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '007e85ea-2b06-48c2-8ac1-873d59643aae', 'Promoviendo el fair play y el respeto mutuo durante el desarrollo del juego nocturno.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Manteniendo el comportamiento ético y fraterno en las actividades de campamento.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Cumpliendo con honestidad scout la declaración de congelamiento o descongelamiento.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Favoreciendo la sana convivencia y la integración fraterna de todos los participantes.' FROM articulos WHERE slug = 'el-desafio-del-yeti';
    
COMMIT;