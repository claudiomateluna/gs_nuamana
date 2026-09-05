SET client_encoding = 'UTF8';
BEGIN;

DELETE FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';

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
  'el-gran-teatro-de-las-marionetas',
  'El Gran Teatro de las Marionetas',
  'Dinámica de expresión corporal y dramatización donde los scouts se dividen en parejas de titititeros y marionetas para moldear posturas y representar escenas en equipo.',
  '<h2>📜 Descripción de El Gran Teatro de las Marionetas</h2>
<p><b>El Gran Teatro de las Marionetas</b> es una dinámica scout de motricidad fina, expresión corporal y empatía kinestésica. En esta actividad, los participantes se dividen en parejas compuestas por un <i>Titiritero</i> y una <i>Marioneta</i>. El jugador que actúa como marioneta debe mantener su cuerpo relajado y flexible, mientras el titiritero lo moldea con suavidad y respeto situando sus brazos, piernas y postura para representar un oficio scout, una emoción o una escena cómica que el grupo debe adivinar.</p>
<p>Esta dinámica potencia el autocontrol, la confianza en el compañero y la desinhibición escénica tanto en la Manada como en la Compañía y Tropa.</p>

<h2>🎲 ¿Cómo se juega El Gran Teatro de las Marionetas?</h2>
<p>Para llevar a cabo la dinámica con fluidez y resguardo del espacio personal, los dirigentes deben seguir estos pasos:</p>
<ul>
  <li><b>Formación de Parejas:</b> Se organizan los participantes en parejas y se asignan los roles iniciales de Titiritero y Marioneta.</li>
  <li><b>Consigna Secreta:</b> El dirigente muestra discretamente al Titiritero una tarjeta con el concepto a representar (ej. un cocinero de campamento revolviendo la olla, un scout encendiendo una fogata, un fotógrafo, o una emoción como sorpresa).</li>
  <li><b>Escultura de la Marioneta:</b> La Marioneta debe permanecer en silencio con la musculatura completamente relajada. El Titiritero la moldea cuidadosamente articulando sus extremidades y cabeza sin hablar.</li>
  <li><b>Presentación y Adivinanza:</b> Una vez terminada la pose, la Marioneta debe sostener la postura congelada durante 15 segundos mientras el resto del grupo o las patrullas intentan adivinar la escena representada.</li>
  <li><b>Inversión de Roles:</b> Al concluir la ronda, se intercambian los papeles para que todos los participantes vivan ambas experiencias dramáticas.</li>
</ul>

<h2>🏆 Cómputo de Puntos y Condición de Victoria de El Gran Teatro de las Marionetas</h2>
<p>Al ser una dinámica de cooperación y expresión artística, el sistema de puntuación prioriza la coordinación y el respeto en el Tally:</p>
<ul>
  <li><b>Escultura Más Expresiva:</b> Otorgar 5 puntos a la patrulla o seisena que logre la representación plástica más precisa y creativa.</li>
  <li><b>Mayor Nivel de Relajación:</b> Otorgar 3 puntos al participante que demuestre el mejor autocontrol corporal en el rol de marioneta.</li>
  <li><b>Trabajo en Equipo Fraterno:</b> Otorgar 3 puntos a la pareja que trabaje con mayor cuidado, delicadeza y respeto mutuo durante el moldeado.</li>
</ul>',
  '/uploads/el-gran-teatro-de-las-marionetas.webp',
  'publicado',
  '{"areas": ["creatividad", "corporalidad", "carácter"], "unidades": ["manada", "compañía", "tropa"], "duracion": "20 minutos", "cantidad": "02 participantes", "lugares": ["Interior", "Exterior"], "materiales": ["Sin Materiales"], "objetivos": ["Desarrollo de la expresión corporal", "Estimular la empatía y la confianza", "Desfogue de Energías", "Fomentar un entorno de confianza"], "justificacion_areas": "El Gran Teatro de las Marionetas ejercita la creatividad al requerir la sintesis plástica y simbólica de conceptos complejos mediante posturas corporales. Desarrolla la corporalidad fortaleciendo el esquema corporal, el equilibrio muscular y el tono de relajación consciente. Desarrolla el carácter al entrenar la confianza interpersonal, la superación del ridículo y el respeto afectuoso hacia el cuerpo del compañero.", "variaciones": "<b>Marionetas con Pañolines:</b> Unir los extremos de los pañolines scouts a las muñecas de la marioneta para que el titiritero la dirija a distancia sin contacto directo.<br><b>Marionetas Mecánicas Gigantes:</b> Un dirigente actua como el relojero principal dirigiendo a una patrulla completa convertida en engranajes de un gran reloj de campamento.<br><b>Teatro Mudo de Sombras:</b> Realizar las esculturas detrás de una sábana o toldo blanco iluminado con linternas para proyectar sombras kinesiológicas.", "recomendaciones": "Enfatizar previamente a los participantes que el moldeado físico debe realizarse siempre con extrema suavidad y cuidado, evitando forzar articulaciones o realizar movimientos bruscos. Mantener una música de fondo suave para facilitar la relajación muscular de las marionetas. Garantizar que todos los beneficiarios tengan la oportunidad de actuar en ambos roles.", "objetivos_educativos": [{"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "unidad": "Manada", "texto": "Me gusta participar en juegos de observación.", "como_se_cumple": "Observando minuciosamente los detalles corporales moldeados para adivinar el personaje."}, {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "unidad": "Manada", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "como_se_cumple": "Ideando soluciones físicas rápidas para representar acciones complejas en la marioneta."}, {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "area": "Creatividad", "unidad": "Compañía", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando emociones e intenciones dramáticas a través de la plasticidad del cuerpo."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando la escena desde la perspectiva del espectador para ajustar la pose de la marioneta."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Demostrando agilidad de improvisación teatral en la creación de marionetas vivientes."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Diseñando representaciones simbólicas originales que desafíen la deducción de la patrulla."}, {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "unidad": "Manada", "texto": "Me gusta practicar deportes.", "como_se_cumple": "Ejercitando la relajación muscular consciente y el dominio kinesiológico del cuerpo."}, {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "unidad": "Manada", "texto": "Practico deportes, conozco sus reglas y sé perder.", "como_se_cumple": "Afinando el equilibrio estático y la resistencia física al mantener la postura inmóvil."}, {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "unidad": "Compañía", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Respetando la elasticidad física y cuidando los límites biomecánicos del compañero."}, {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "unidad": "Compañía", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Demostrando precisión postural y flexibilidad en la ejecución de la dinámica."}, {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "unidad": "Tropa", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Desarrollando la flexibilidad muscular y la coordinación motriz fina fina en el moldeado."}, {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "unidad": "Tropa", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Exigiendo la máxima soltura articular y equilibrio para sostener posturas complejas."}, {"id": "041daaea-c4a7-472b-a613-951bd25cfa85", "area": "Carácter", "unidad": "Manada", "texto": "Reconozco y acepto mis errores.", "como_se_cumple": "Aceptando con tranquilidad y humor cuando una postura no logra comunicar el concepto deseado."}, {"id": "4df1ba93-06fe-4f49-b273-fddc3800cf17", "area": "Carácter", "unidad": "Manada", "texto": "Le doy importancia a las cosas que hago bien.", "como_se_cumple": "Valorando la confianza mutua y la entrega expresiva depositada en el compañero."}, {"id": "2cc128e0-7cc6-49df-a7c5-825f6ab79793", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que puedo ser cada día mejor.", "como_se_cumple": "Superando la vergüenza inicial para soltarse en el juego de dramatización en pareja."}, {"id": "006c5b09-47cf-4ed8-bf25-212203261a03", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Confiando en las propias aptitudes gestuales y de comunicación corporal."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Explorando las fronteras del propio esquema corporal y la capacidad de relajación."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Liderando con sensibilidad y respeto el rol de titiritero en el equipo."}]}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL
);


INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 1 FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 10 FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Observando minuciosamente los detalles corporales moldeados para adivinar el personaje.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Ideando soluciones físicas rápidas para representar acciones complejas en la marioneta.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 'Expresando emociones e intenciones dramáticas a través de la plasticidad del cuerpo.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando la escena desde la perspectiva del espectador para ajustar la pose de la marioneta.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Demostrando agilidad de improvisación teatral en la creación de marionetas vivientes.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Diseñando representaciones simbólicas originales que desafíen la deducción de la patrulla.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Ejercitando la relajación muscular consciente y el dominio kinesiológico del cuerpo.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Afinando el equilibrio estático y la resistencia física al mantener la postura inmóvil.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '1427451e-b8b3-493b-8525-e53298381e07', 'Respetando la elasticidad física y cuidando los límites biomecánicos del compañero.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b12da732-d736-480c-82b8-95b312316390', 'Demostrando precisión postural y flexibilidad en la ejecución de la dinámica.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0765469b-caef-4457-9d6b-cb739c855402', 'Desarrollando la flexibilidad muscular y la coordinación motriz fina fina en el moldeado.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Exigiendo la máxima soltura articular y equilibrio para sostener posturas complejas.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '041daaea-c4a7-472b-a613-951bd25cfa85', 'Aceptando con tranquilidad y humor cuando una postura no logra comunicar el concepto deseado.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4df1ba93-06fe-4f49-b273-fddc3800cf17', 'Valorando la confianza mutua y la entrega expresiva depositada en el compañero.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2cc128e0-7cc6-49df-a7c5-825f6ab79793', 'Superando la vergüenza inicial para soltarse en el juego de dramatización en pareja.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '006c5b09-47cf-4ed8-bf25-212203261a03', 'Confiando en las propias aptitudes gestuales y de comunicación corporal.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', 'Explorando las fronteras del propio esquema corporal y la capacidad de relajación.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '78bd48d3-5d26-4218-843a-33712bade630', 'Liderando con sensibilidad y respeto el rol de titiritero en el equipo.' FROM articulos WHERE slug = 'el-gran-teatro-de-las-marionetas';
    
COMMIT;