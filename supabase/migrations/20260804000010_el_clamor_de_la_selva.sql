SET client_encoding = 'UTF8';
BEGIN;

DELETE FROM articulos WHERE slug = 'el-clamor-de-la-selva';

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
  'el-clamor-de-la-selva',
  'El Clamor de la Selva',
  'Dinámica de orientación auditiva y expresión donde los scouts con ojos vendados deben encontrarse en parejas emitiendo y escuchando el sonido de su animal asignado.',
  '<h2>📜 Descripción de El Clamor de la Selva</h2>
<p><b>El Clamor de la Selva</b> es una dinámica scout de desarrollo sensorial, localización espacial y expresión dramática. En esta actividad, los participantes se dividen en parejas secretas a las cuales se les asigna una especie animal característica (ej. búhos, lobos, felinos, gallos o leones). Con los ojos vendados mediante su pañolín scout, todos los jugadores se mezclan en el terreno de juego y deben localizar a su pareja correspondiente utilizando únicamente el sentido del oído mediante la emisión constante de su rugido o sonido animal.</p>
<p>Esta dinámica fomenta la escucha activa, el equilibrio kinestésico y la confianza en el entorno de la Manada, Compañía o Tropa en un ambiente de compañerismo e integración.</p>

<h2>🎲 ¿Cómo se juega El Clamor de la Selva?</h2>
<p>Para desarrollar el juego de forma segura y coordinada, los dirigentes deben seguir estos pasos:</p>
<ul>
  <li><b>Asignación de Especies:</b> El dirigente susurra al oído de cada scout el nombre del animal que le corresponde imitar. Cada animal debe estar asignado exactamente a dos participantes para formar parejas únicas.</li>
  <li><b>Vendado de Ojos:</b> Todos los participantes cubren sus ojos utilizando su pañolín scout o vendas suaves.</li>
  <li><b>Dispersión Inicial:</b> Los dirigentes guían suavemente a los jugadores vendados hacia distintos puntos del terreno de campamento previamente delimitado y libre de obstáculos.</li>
  <li><b>El Inicio del Clamor:</b> A la señal del guía, todos los scouts comienzan a desplazarse despacio mientras emiten de forma continua el sonido distintivo de su animal en voz alta.</li>
  <li><b>Encuentro por Sonido:</b> Guiándose únicamente por la dirección e intensidad de los sonidos, los jugadores deben navegar el espacio hasta encontrar a su compañero de especie y tomarse de las manos.</li>
  <li><b>Conclusión de la Ronda:</b> La primera pareja que logre identificar el sonido de su par, encontrarse y presentarse ante el animador sin quitarse el pañolín se declara ganadora de la ronda.</li>
</ul>

<h2>🏆 Cómputo de Puntos y Condición de Victoria de El Clamor de la Selva</h2>
<p>La dinámica premia la concentración y la capacidad de orientación auditiva. Se pueden otorgar los siguientes puntos en el Tally:</p>
<ul>
  <li><b>Primer Encuentro:</b> Otorgar 5 puntos a la patrulla o seisena cuyos integrantes formen la primera pareja de animales en encontrarse.</li>
  <li><b>Mejor Caracterización Vocal:</b> Otorgar 3 puntos a los participantes que logren la imitación sonora más realista o expresiva.</li>
  <li><b>Desplazamiento Seguro y Prudente:</b> Otorgar 3 puntos al grupo que demuestre el mayor cuidado espacial y respeto hacia sus compañeros vendados.</li>
</ul>',
  '/uploads/el-clamor-de-la-selva.webp',
  'publicado',
  '{"areas": ["creatividad", "corporalidad", "sociabilidad"], "unidades": ["manada", "compañía", "tropa"], "duracion": "20 minutos", "cantidad": "04 participantes", "lugares": ["Interior", "Exterior"], "materiales": ["Pañolines"], "objetivos": ["Reforzar el desarrollo de los sentidos", "Estimular la agilidad mental", "Estimular la confianza", "Favorecer el trabajo en equipo"], "justificacion_areas": "El Clamor de la Selva ejercita la creatividad a través de la interpretación vocal y la caracterización de personajes del reino animal. Desarrolla la corporalidad mediante el equilibrio dinámico, la orientación espacial háptica y el control del cuerpo sin apoyo visual. Fortalece la sociabilidad al afianzar la confianza mutua, el respeto a las normas de seguridad y la comunicación no verbal dentro del grupo.", "variaciones": "<b>La Selva Nocturna por Seisenas:</b> Formar grupos de 4 integrantes imitando una misma manada en lugar de parejas, requiriendo que los 4 miembros se reúnan en cadena.<br><b>El Depredador Furioso:</b> Agregar a un dirigente que actúa como cazador o depredador en silencio; si un animal vendado lo toca accidentalmente, debe quedar inmóvil en el sitio hasta que su pareja lo rescate.<br><b>Clamor con Claves Morse:</b> Sustituir los sonidos de animales por ritmos o claves morse emitidas con silbatos o chasquidos.", "recomendaciones": "Delimitar estrictamente el área de juego y verificar previamente que no existan rocas, ramas bajas o desnivelaciones en el suelo que puedan provocar tropezones. Los dirigentes deben colocarse en el perímetro como ''parachoques humanos'' para guiar suavemente a los beneficiarios que se acerquen a los bordes. Recordar que las manos deben mantenerse dobladas al frente a la altura del pecho para proteger el torso durante el desplazamiento.", "objetivos_educativos": [{"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "unidad": "Manada", "texto": "Me gusta participar en juegos de observación.", "como_se_cumple": "Escuchando con atención los matices sonoros de la selva para identificar el rugido de mi compañero."}, {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "unidad": "Manada", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "como_se_cumple": "Decodificando con agilidad auditiva la dirección exacta del sonido animal entre el murmullo general."}, {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "area": "Creatividad", "unidad": "Compañía", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando con iniciativa y potencia vocal las señales de localización para mi patrulla."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando la intensidad y distancia del sonido percibido para corregir el rumbo."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Emitiendo llamados rítmicos claros que faciliten el encuentro en el terreno de juego."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Sintetizando la información acústica del entorno para converger en el punto de encuentro."}, {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "unidad": "Manada", "texto": "Me gusta practicar deportes.", "como_se_cumple": "Ejercitando la coordinación espacial y el equilibrio corporal al desplazarme a ciegas."}, {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "unidad": "Manada", "texto": "Practico deportes, conozco sus reglas y sé perder.", "como_se_cumple": "Afinando la conciencia propiaceptiva y el control de movimientos sin apoyo de la vista."}, {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "unidad": "Compañía", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Respetando las normas de seguridad corporal al desplazarme suavemente por el campo."}, {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "unidad": "Compañía", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Demostrando concentración física y agudeza auditiva para superar los obstáculos del terreno."}, {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "unidad": "Tropa", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Desarrollando la orientación espacial tridimensional y el reflejo de protección física."}, {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "unidad": "Tropa", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Exigiendo la máxima precisión auditiva e inmovilidad de protección ante el ruido ambiente."}, {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "unidad": "Manada", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "como_se_cumple": "Aceptando con honestidad mantener el pañolín sobre los ojos durante toda la dinámica."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "unidad": "Manada", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "como_se_cumple": "Respetando el espacio personal y la integridad física de los demás jugadores vendados."}, {"id": "007e85ea-2b06-48c2-8ac1-873d59643aae", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Promoviendo el fair play y el acatamiento de las indicaciones de los dirigentes."}, {"id": "de2f5693-de4b-48f1-b870-3c62be99aea8", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Fomentando un clima fraterno de confianza y cuidado recíproco en el terreno de juego."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Cumpliendo con lealtad las reglas de ceguedad y guiando con gentileza a mi pareja al encontrarnos."}, {"id": "bbc48d53-f4aa-4de7-84d4-95614df76034", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Aceptando con madurez el resultado del juego y celebrando la integración del grupo."}]}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL
);


INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 1 FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 10 FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Escuchando con atención los matices sonoros de la selva para identificar el rugido de mi compañero.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Decodificando con agilidad auditiva la dirección exacta del sonido animal entre el murmullo general.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 'Expresando con iniciativa y potencia vocal las señales de localización para mi patrulla.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando la intensidad y distancia del sonido percibido para corregir el rumbo.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Emitiendo llamados rítmicos claros que faciliten el encuentro en el terreno de juego.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Sintetizando la información acústica del entorno para converger en el punto de encuentro.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Ejercitando la coordinación espacial y el equilibrio corporal al desplazarme a ciegas.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Afinando la conciencia propiaceptiva y el control de movimientos sin apoyo de la vista.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '1427451e-b8b3-493b-8525-e53298381e07', 'Respetando las normas de seguridad corporal al desplazarme suavemente por el campo.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b12da732-d736-480c-82b8-95b312316390', 'Demostrando concentración física y agudeza auditiva para superar los obstáculos del terreno.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0765469b-caef-4457-9d6b-cb739c855402', 'Desarrollando la orientación espacial tridimensional y el reflejo de protección física.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Exigiendo la máxima precisión auditiva e inmovilidad de protección ante el ruido ambiente.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando con honestidad mantener el pañolín sobre los ojos durante toda la dinámica.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando el espacio personal y la integridad física de los demás jugadores vendados.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '007e85ea-2b06-48c2-8ac1-873d59643aae', 'Promoviendo el fair play y el acatamiento de las indicaciones de los dirigentes.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Fomentando un clima fraterno de confianza y cuidado recíproco en el terreno de juego.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Cumpliendo con lealtad las reglas de ceguedad y guiando con gentileza a mi pareja al encontrarnos.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Aceptando con madurez el resultado del juego y celebrando la integración del grupo.' FROM articulos WHERE slug = 'el-clamor-de-la-selva';
    
COMMIT;