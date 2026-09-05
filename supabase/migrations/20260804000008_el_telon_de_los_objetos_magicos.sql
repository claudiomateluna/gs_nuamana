SET client_encoding = 'UTF8';
BEGIN;

DELETE FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';

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
  'el-telon-de-los-objetos-magicos',
  'El Telón de los Objetos Mágicos',
  'Dinámica de creación narrativa y atención donde los scouts inventan una historia colaborativa basada en objetos secretos revelados bajo un telón.',
  '<h2>📜 Descripción de El Telón de los Objetos Mágicos</h2>
<p><b>El Telón de los Objetos Mágicos</b> es una dinámica scout de improvisación colectiva, agilidad mental y escucha activa. En esta actividad, los participantes se sientan en un círculo dando la espalda al centro mientras el dirigente o guía oculta un objeto cotidiano de campamento bajo una manta o telón. Al volverse, el objeto se revela brevemente y el scout de turno debe continuar una historia ficticia integrando de forma creativa el objeto descubierto.</p>
<p>Esta dinámica estimula la fluidez verbal, la memoria narrativa y la cohesión en la Manada, Compañía o Tropa, transformando elementos sencillos en detonantes de imaginación fraterna.</p>

<h2>🎲 ¿Cómo se juega El Telón de los Objetos Mágicos?</h2>
<p>Para llevar a cabo la dinámica con fluidez y dinamismo, los dirigentes deben seguir estos pasos:</p>
<ul>
  <li><b>Disposición del Círculo:</b> Todos los scouts se sientan en círculo. Antes de comenzar cada turno, los participantes se dan la vuelta quedando de espaldas al centro.</li>
  <li><b>Colocación del Objeto Secreto:</b> El dirigente coloca un objeto misterioso (ej. una brújula, una linterna, una cuchara de palo, una piña de pino, un pañolín scout) en el centro y lo cubre completamente con una manta.</li>
  <li><b>La Revelación:</b> A la señal del guía, los scouts se giran. Se levanta el telón durante tres segundos para mostrar el objeto y se vuelve a cubrir inmediatamente.</li>
  <li><b>Construcción de la Historia:</b> El jugador a quien le corresponde el turno debe continuar el relato colectivo iniciado por el participante anterior, introduciendo el nuevo objeto de forma coherente y fantástica dentro de la trama.</li>
  <li><b>Cambio de Escena:</b> Todos los participantes vuelven a dar la espalda, el dirigente sustituye el objeto por uno diferente y el siguiente scout continúa la historia con el nuevo elemento revelado.</li>
</ul>

<h2>🏆 Cómputo de Puntos y Condición de Victoria de El Telón de los Objetos Mágicos</h2>
<p>Al ser una dinámica de expresión creativa y cooperación narrativa, el triunfo radica en el éxito de la historia compartida. Se pueden otorgar reconocimientos simbólicos en el Tally bajo los siguientes criterios:</p>
<ul>
  <li><b>Integración Fantástica:</b> Otorgar 5 puntos a la patrulla o seisena que logre el giro narrativo más creativo e hilarante al incorporar el objeto.</li>
  <li><b>Continuidad y Escucha:</b> Otorgar 3 puntos al participante que demuestre la mejor atención para conectar su turno de forma fluida con el relato del compañero anterior.</li>
  <li><b>Fluidez Verbal:</b> Reconocer al equipo que mantenga el ritmo continuo de la historia sin pausas prolongadas.</li>
</ul>',
  '/uploads/el-telon-de-los-objetos-magicos.webp',
  'publicado',
  '{"areas": ["creatividad", "sociabilidad", "carácter"], "unidades": ["manada", "compañía", "tropa"], "duracion": "25 minutos", "cantidad": "14 participantes", "lugares": ["Interior", "Exterior"], "materiales": ["Manta", "Objetos Varios", "Pañolines"], "objetivos": ["Estimular la creatividad", "Fomentar la comunicación e interpretación", "Estímulo y desarrollo de la memoria", "Trabajo en equipo"], "justificacion_areas": "El Telón de los Objetos Mágicos potencia la creatividad al requerir la asociación simbólica instantánea e improvisación narrativa a partir de estímulos visuales. Fortalece la sociabilidad al ejercitar la escucha activa, la colaboración sinérgica y la construcción colectiva de significados en el grupo. Desarrolla el carácter al entrenar la confianza personal al hablar en público y la capacidad de superar la inhibición inicial.", "variaciones": "<b>Relato por Cuerdas y Claves:</b> Utilizar exclusivamente herramientas técnicas de campamento (nudos, brújulas, estacas) exigiendo que el uso del objeto en la historia esté vinculado a una función técnica scout.<br><b>El Telón Sonoro:</b> En lugar de objetos visuales, emitir un sonido oculto detrás del telón (ej. choque de piedras, chasquido de ramas) que el participante debe incorporar a la narración.<br><b>Cadena de Objetos Acumulativos:</b> A medida que avanza el juego, el scout debe recordar y nombrar todos los objetos presentados previamente en orden cronológico.", "recomendaciones": "Mantener una bolsa o caja con objetos variados y curiosos fuera de la vista del grupo para acelerar la rotación del juego. Fomentar un ambiente positivo donde todas las ideas imaginarias sean celebradas sin juzgar ni interrumpir la intervención del compañero. Adaptar la complejidad de los objetos y la temática según la edad de la unidad.", "objetivos_educativos": [{"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "unidad": "Manada", "texto": "Me gusta participar en juegos de observación.", "como_se_cumple": "Observando rápidamente las características del objeto revelado para inspirar la historia."}, {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "unidad": "Manada", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "como_se_cumple": "Demostrando rapidez mental e imaginación al vincular el objeto misterioso con la trama."}, {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "area": "Creatividad", "unidad": "Compañía", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando ideas y giros narrativos originales con fluidez e iniciativa en la patrulla."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Conectando creativamente los elementos dispares aportados por los compañeros en una sola historia."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Participando con soltura y agilidad de pensamiento en el desarrollo de la trama de la Tropa."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando las múltiples posibilidades simbólicas del objeto para resolver la narración de grupo."}, {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "unidad": "Manada", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "como_se_cumple": "Respetando con disciplina el turno de palabra y la inmovilidad al dar la espalda."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "unidad": "Manada", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "como_se_cumple": "Escuchando con atención la intervención del compañero antes de continuar la historia."}, {"id": "007e85ea-2b06-48c2-8ac1-873d59643aae", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Promoviendo el respeto por el relato ajeno y la construcción colaborativa sin interrupciones."}, {"id": "de2f5693-de4b-48f1-b870-3c62be99aea8", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Cumpliendo con honestidad las reglas del juego y enriqueciendo el trabajo en equipo."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Acatando las indicaciones de partida y respetando las ideas creativas de la patrulla."}, {"id": "bbc48d53-f4aa-4de7-84d4-95614df76034", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Fomentando la sana convivencia y la cohesión del grupo mediante el humor y la empatía."}, {"id": "041daaea-c4a7-472b-a613-951bd25cfa85", "area": "Carácter", "unidad": "Manada", "texto": "Reconozco y acepto mis errores.", "como_se_cumple": "Aceptando con serenidad las pausas o titubeos al hablar ante el grupo y corrigiendo sobre la marcha."}, {"id": "4df1ba93-06fe-4f49-b273-fddc3800cf17", "area": "Carácter", "unidad": "Manada", "texto": "Le doy importancia a las cosas que hago bien.", "como_se_cumple": "Valorando el propio aporte creativo en la construcción de la historia colectiva."}, {"id": "2cc128e0-7cc6-49df-a7c5-825f6ab79793", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que puedo ser cada día mejor.", "como_se_cumple": "Superando la timidez inicial y expresándose con mayor desenvoltura en cada turno."}, {"id": "006c5b09-47cf-4ed8-bf25-212203261a03", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Confiando en las propias habilidades de comunicación y expresión ante sus pares."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Descubriendo nuevas capacidades de improvisación e invención en el ámbito público."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Demostrando autodominio y seguridad al conducir la trama de la historia con carisma."}]}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL
);


INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 1 FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 7 FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 10 FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Observando rápidamente las características del objeto revelado para inspirar la historia.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Demostrando rapidez mental e imaginación al vincular el objeto misterioso con la trama.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 'Expresando ideas y giros narrativos originales con fluidez e iniciativa en la patrulla.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Conectando creativamente los elementos dispares aportados por los compañeros en una sola historia.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Participando con soltura y agilidad de pensamiento en el desarrollo de la trama de la Tropa.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Analizando las múltiples posibilidades simbólicas del objeto para resolver la narración de grupo.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b69188bf-2391-43c1-a885-abd1b13912be', 'Respetando con disciplina el turno de palabra y la inmovilidad al dar la espalda.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Escuchando con atención la intervención del compañero antes de continuar la historia.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '007e85ea-2b06-48c2-8ac1-873d59643aae', 'Promoviendo el respeto por el relato ajeno y la construcción colaborativa sin interrupciones.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Cumpliendo con honestidad las reglas del juego y enriqueciendo el trabajo en equipo.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Acatando las indicaciones de partida y respetando las ideas creativas de la patrulla.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Fomentando la sana convivencia y la cohesión del grupo mediante el humor y la empatía.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '041daaea-c4a7-472b-a613-951bd25cfa85', 'Aceptando con serenidad las pausas o titubeos al hablar ante el grupo y corrigiendo sobre la marcha.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4df1ba93-06fe-4f49-b273-fddc3800cf17', 'Valorando el propio aporte creativo en la construcción de la historia colectiva.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2cc128e0-7cc6-49df-a7c5-825f6ab79793', 'Superando la timidez inicial y expresándose con mayor desenvoltura en cada turno.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '006c5b09-47cf-4ed8-bf25-212203261a03', 'Confiando en las propias habilidades de comunicación y expresión ante sus pares.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', 'Descubriendo nuevas capacidades de improvisación e invención en el ámbito público.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '78bd48d3-5d26-4218-843a-33712bade630', 'Demostrando autodominio y seguridad al conducir la trama de la historia con carisma.' FROM articulos WHERE slug = 'el-telon-de-los-objetos-magicos';
    
COMMIT;