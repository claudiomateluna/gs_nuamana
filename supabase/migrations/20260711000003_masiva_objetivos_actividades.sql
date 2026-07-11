-- Migración masiva para registrar los objetivos educativos de 8 actividades scout
-- Asegura consistencia pedagógica completa: todos los objetivos pertenecen a las mismas dimensiones/objetivos terminales.

-- 1. Limpiar relaciones anteriores de los 8 artículos
DELETE FROM public.articulo_objetivos_educativos 
WHERE articulo_id IN (
  'ff2ef89a-6073-4174-88de-cdd3435df3af', -- Dinámica Cuadro Plástico
  'cf0fce88-68dd-40ab-9a65-d684c9c28edd', -- Juego del Gato Scout
  'ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', -- Carrera del Saber
  'd87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', -- Ley con Clave Morse
  'c37832d6-9192-43e2-9886-4a7917e8e710', -- Casa Inquilino o Terremoto
  'b8daf1ee-84cd-46e5-a871-f6371673db05', -- Dos mentiras y una verdad
  'fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', -- Carrera de camillas
  'a5082bd8-22d6-4ba1-b0b2-a155f009a3e8'  -- Competencia de Nudos
);

-- 2. Insertar relaciones corregidas y pedagógicamente coherentes
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  -- Dinámica Cuadro Plástico (ff2ef89a-6073-4174-88de-cdd3435df3af)
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', 'd9ebcd96-c9cf-444f-94fb-5569110a1b99', 'Adoptando posturas ágiles y flexibles para recrear de manera corporal la escena asignada.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Controlando la quietud y posición de las extremidades al simular figuras inanimadas sin perder el equilibrio.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '0ba0d3c3-a50a-4a04-8981-601dc7746dd6', 'Seleccionando de forma realista posiciones y posturas que puedan ser sostenidas estáticamente durante el tiempo determinado.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '4946a6aa-4a9f-4e7b-89a3-cb5249db8257', 'Seleccionando de forma realista posiciones y posturas que puedan ser sostenidas estáticamente durante el tiempo determinado.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '52d9399a-4bf1-4010-a7ca-682b7d1c22a8', 'Esforzándose por mantener el equilibrio corporal y la rigidez de la postura a pesar del cansancio estático del crecimiento.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '333453ab-e111-4f06-b0e3-a3e7f06b2439', 'Esforzándose por mantener el equilibrio corporal y la rigidez de la postura a pesar del cansancio estático del crecimiento.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', 'e876d520-d14d-44f3-8baf-bf698dc08dac', 'Utilizando expresivamente su imagen y complexión física frente a su comunidad de Avanzada para dar realismo al cuadro sin complejos ni inhibiciones.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '52b5580a-7d0f-454f-b2ae-0d3318129165', 'Actuando colectivamente con los miembros de su seisena para recrear una representación dramática divertida y expresiva.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '14b82459-ac31-4496-a875-8e9bd5666030', 'Expresando de forma dramática y a través de los gestos faciales las emociones y narración del cuadro representado.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', 'd581cfa7-db1f-4b08-b4d3-525b23e418ea', 'Imaginando y escenificando con su patrulla escenas de valor histórico o cotidiano con energía y espíritu lúdico.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '39eaf1aa-f703-4fd0-a4b3-b9756dc30539', 'Imaginando y escenificando con su patrulla escenas de valor histórico o cotidiano con energía y espíritu lúdico.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '9758e4f9-728b-4435-a8a3-11fd36c5e3be', 'Proponiendo ideas de representación y elementos de utilería alternativos para mejorar el diseño artístico del cuadro.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', '6e910d1c-7021-49a5-9ece-637f480a1ec7', 'Proponiendo ideas de representación y elementos de utilería alternativos para mejorar el diseño artístico del cuadro.'),
  ('ff2ef89a-6073-4174-88de-cdd3435df3af', 'ed17d59c-1c64-4080-a206-bbe72eeae5a4', 'Estructurando escenas complejas basadas en críticas sociales o históricas que aporten originalidad y reflexión ética al cuadro representado.'),

  -- Juego del Gato Scout (cf0fce88-68dd-40ab-9a65-d684c9c28edd)
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Participando con entusiasmo en la carrera de relevos para colocar las fichas en el tablero gigante.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Corriendo a toda velocidad dentro de la pista de relevos y aceptando el resultado competitivo de la ronda.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '1427451e-b8b3-493b-8525-e53298381e07', 'Respetando la zona de largada y no saliendo antes de ser relevado por el compañero.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '0765469b-caef-4457-9d6b-cb739c855402', 'Respetando la zona de largada y no saliendo antes de ser relevado por el compañero.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'b12da732-d736-480c-82b8-95b312316390', 'Mejorando su agilidad de carrera y el tiempo de respuesta motriz en beneficio de su patrulla.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Mejorando su agilidad de carrera y el tiempo de respuesta motriz en beneficio de su patrulla.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Desplegando su velocidad y coordination física durante las fases competitivas del relevo.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '106e27af-ec7a-45fa-9295-fcef88fbef3d', 'Integrando sus capacidades físicas en la competencia grupal para alcanzar las metas deportivas del equipo.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Observando rápidamente el estado del tablero gigante antes de decidir dónde colocar su pañolín.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Buscando bloquear las combinaciones de la seisena contraria a través de movimientos rápidos.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '12686e7d-d6af-4c74-928d-c859d5b883d5', 'Colaborando verbalmente desde la fila para orientar a sus compañeras sobre la mejor casilla táctica disponible.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'e465926e-deed-4341-956f-047f56860e5e', 'Colaborando verbalmente desde la fila para orientar a sus compañeros sobre la mejor casilla táctica disponible.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Anticipando la estrategia y el posicionamiento del rival para mover sus fichas preventivamente.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Anticipando la estrategia y el posicionamiento del rival para mover sus fichas preventivamente.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '310eb631-8ca9-4eaf-ac80-232a5150d024', 'Proponiendo variaciones tácticas complejas para dinamizar el juego del gato scout.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'ef75fbed-4a6d-49ea-bfab-f2952415e1a0', 'Resolviendo situaciones lógicas y de bloqueo táctico complejas en segundos para asegurar la victoria de la comunidad.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando las normas de salida y colocación del pañolín sin cometer faltas de largada.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando el límite del tablero gigante y el turno del corredor contrario para evitar roces físicos.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando constructivamente con sus pares al acordar el orden de los corredores en la fila.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando constructivamente con sus pares al acordar el orden de los corredores en la fila.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando las reglas del juego de relevos y dialogando respetuosamente ante disputas de llegada rápida sobre la cuadrícula.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando las reglas del juego de relevos y dialogando respetuosamente ante disputas de llegada rápida sobre la cuadrícula.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Aceptando las decisiones de los árbitros o dirigentes sobre quién colocó la ficha primero en caso de empate.'),
  ('cf0fce88-68dd-40ab-9a65-d684c9c28edd', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Promoviendo el cumplimiento de las normas lúdicas y evitando actitudes antideportivas durante la carrera.'),

  -- Carrera del Saber (ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15)
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', '1427451e-b8b3-493b-8525-e53298381e07', 'Efectuando la carrera de velocidad y los obstáculos físicos de acuerdo con las reglas de relevos explicadas.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', '0765469b-caef-4457-9d6b-cb739c855402', 'Efectuando la carrera de velocidad y los obstáculos físicos de acuerdo con las reglas de relevos explicadas.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por completar los desafíos físicos de la carrera con mayor velocidad y técnica en cada turno.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por completar los desafíos físicos de la carrera con mayor velocidad y técnica en cada turno.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Desplegando sus capacidades motrices y su resistencia aeróbica en el recorrido de la carrera del saber.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', '106e27af-ec7a-45fa-9295-fcef88fbef3d', 'Integrando sus capacidades atléticas en los desafíos físicos grupales realizados al aire libre.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Dialogando con su equipo sobre el orden de salida de los competidores según las fortalezas individuales.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Dialogando con su equipo sobre el orden de salida de los competidores según las fortalezas individuales.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de no soplar o asistir a los participantes que se encuentran respondiendo las preguntas de la carrera.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de no soplar o asistir a los participantes que se encuentran respondiendo las preguntas de la carrera.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Aceptando de buen grado las decisiones y puntajes asignados por los dirigentes encargados de calificar las respuestas.'),
  ('ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Promoviendo un marco ético de juego limpio, honestidad en las respuestas y resguardo de la seguridad mutua durante la carrera.'),

  -- Ley con Clave Morse (d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc)
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', 'd531dd19-4d49-4342-8114-184de017ac49', 'Decodificando y traduciendo de manera práctica mensajes escritos en código morse con su patrulla.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '0b23d4c8-6e40-4e8e-a476-97ed92efa152', 'Decodificando y traduciendo de manera práctica mensajes escritos en código morse con su patrulla.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', 'd20cab83-3c15-4bb0-8435-a790e72b6d50', 'Asociando la clave morse con el desarrollo histórico de las telecomunicaciones y la telegrafía.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '27bc66a0-bfba-4e22-9b3e-d1d4fa6112b4', 'Asociando la clave morse con el desarrollo histórico de las telecomunicaciones y la telegrafía.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '818d8a25-549b-4e01-a830-e50d73e39025', 'Superando la inseguridad y el temor de caminar con los ojos vendados confiando en las instrucciones de sus compañeras.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '03ccaf4c-03c4-42a8-b311-47fef60f204c', 'Superando la inseguridad y el temor de caminar con los ojos vendados confiando en las instrucciones de sus compañeros.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '67a2f0fa-9b1e-4b7b-bda2-e25696c87898', 'Manteniendo la calma y el autocontrol mientras es guiado a viva voz a través de los obstáculos del terreno.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '74e6c7e0-f9f6-47d3-acdb-d6df315ef123', 'Manteniendo la calma y el autocontrol mientras es guiado a viva voz a través de los obstáculos del terreno.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Estableciendo códigos y acuerdos de guiado sonoro eficaces dentro de la patrulla antes de iniciar el juego.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Estableciendo códigos y acuerdos de guiado sonoro eficaces dentro de la patrulla antes de iniciar el juego.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Cumpliendo honestamente las restricciones de juego (no quitarse la venda y usar sólo señales permitidas) para resguardar la equidad.'),
  ('d87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Cumpliendo honestamente las restricciones de juego (no quitarse la venda y usar sólo señales permitidas) para resguardar la equidad.'),

  -- Casa Inquilino o Terremoto (c37832d6-9192-43e2-9886-4a7917e8e710)
  ('c37832d6-9192-43e2-9886-4a7917e8e710', 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Participando activamente de los desplazamientos rápidos y lúdicos propuestos en la dinámica.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Desplazándose ágilmente dentro de los límites del campo de juego y aceptando quedar sin casa o inquilino de forma deportiva.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', '1427451e-b8b3-493b-8525-e53298381e07', 'Corriendo rápidamente para formar grupos de tres (dos "casas" y un "inquilino") siguiendo los comandos del dirigente.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', '0765469b-caef-4457-9d6b-cb739c855402', 'Corriendo rápidamente para formar grupos de tres (dos "casas" y un "inquilino") siguiendo los comandos del dirigente.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por mejorar su agilidad mental y física para reaccionar al instante ante el comando "Terremoto!".'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por mejorar su agilidad mental y física para reaccionar al instante ante el comando "Terremoto!".'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Integrándose de inmediato con cualquier lobato que le toque formar casa o ser inquilino sin exclusiones.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando la prohibición de quedarse fijos en el mismo trío en cada ronda para incentivar la integración de toda la Manada.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Colaborando cordialmente al formar los nuevos tríos y ordenando los relevos físicos.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Colaborando cordialmente al formar los nuevos tríos y ordenando los relevos físicos.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Dialogando para resolver con asertividad y rapidez quién ingresa a cada refugio cuando dos inquilinos llegan al mismo tiempo.'),
  ('c37832d6-9192-43e2-9886-4a7917e8e710', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Dialogando para resolver con asertividad y rapidez quién ingresa a cada refugio cuando dos inquilinos llegan al mismo tiempo.'),

  -- Dos mentiras y una verdad (b8daf1ee-84cd-46e5-a871-f6371673db05)
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', '0d742d23-ebe1-40e6-97df-37bc03edb010', 'Escribiendo y compartiendo de forma estructurada tres afirmaciones personales para que su patrulla intente descubrir la verdad.'),
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', '9758e4f9-728b-4435-a8a3-11fd36c5e3be', 'Narrando con dramatismo y creatividad sus afirmaciones para sembrar la duda entre sus compañeras de patrulla.'),
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', 'ed17d59c-1c64-4080-a206-bbe72eeae5a4', 'Diseñando anécdotas auténticas e ingeniosas basadas en sus propias vivencias, marcando un estilo propio al hablar en público.'),
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', '91e60eba-e267-4d1a-b27b-ef61a7b03b31', 'Generando un clima de confianza y diversión compartida a través de la narración de historias personales sorprendentes.'),
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', 'fce82191-77ea-444b-89d9-e33b62a323a5', 'Escuchando respetuosamente las afirmaciones de sus compañeras sin hacer comentarios de desprecio o burla sobre sus vidas.'),
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', 'ea86ecee-b201-4a49-be9d-4e55de7ffe8c', 'Aceptando con empatía las distintas realidades y experiencias de vida expresadas por los miembros de su patrulla.'),
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', '007591fb-a2b6-4fb5-9286-acde65455f53', 'Valorando las características singulares que definen a cada miembro de su comunidad en un ambiente de igualdad y respeto.'),
  ('b8daf1ee-84cd-46e5-a871-f6371673db05', 'b5a81328-5c07-41bd-a1ea-1ed401762841', 'Promoviendo que todos los integrantes del Clan participen equitativamente y tengan la misma libertad para relatar sus experiencias.'),

  -- Carrera de camillas (fa3fe65c-fb44-46a6-9a27-6ea8bf72e246)
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', '1427451e-b8b3-493b-8525-e53298381e07', 'Participando de la carrera respetando las zonas marcadas para evitar colisiones peligrosas con otros equipos.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', '0765469b-caef-4457-9d6b-cb739c855402', 'Participando de la carrera respetando las zonas marcadas para evitar colisiones peligrosas con otros equipos.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por correr de forma sincronizada con sus compañeras de patrulla para estabilizar la carga de la camilla.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por correr de forma sincronizada con sus compañeros de patrulla para estabilizar la carga de la camilla.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Desplegando resistencia física y fuerza muscular en los brazos y piernas durante el transporte del paciente a través del recorrido.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', 'd8c45409-4dcd-4629-a764-cdf52e8b9340', 'Aplicando nudos básicos (como el rizo o ballestrinque) para amarrar los pañolines y palos que formarán la camilla.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', '2a1587b7-9b40-40e1-9113-8ccd928e1464', 'Aplicando nudos básicos (como el rizo o ballestrinque) para amarrar los pañolines y palos que formarán la camilla.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', 'b49b1e68-9cc5-4c76-9cd7-4d6f4c3c1ec6', 'Diseñando una estructura de camilla improvisada resistente y equilibrada utilizando el material disponible de manera eficiente.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', '78e8ab9b-5313-4642-8f12-8ca4e94ffa5c', 'Diseñando una estructura de camilla improvisada resistente y equilibrada utilizando el material disponible de manera eficiente.'),
  ('fa3fe65c-fb44-46a6-9a27-6ea8bf72e246', '843fda9c-6c4a-4516-b30c-23c92ef755a8', 'Improvisando soluciones estructurales de emergencia rápidas para garantizar un traslado seguro ante incidentes simulados en el campo.'),

  -- Competencia de Nudos (a5082bd8-22d6-4ba1-b0b2-a155f009a3e8)
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '1427451e-b8b3-493b-8525-e53298381e07', 'Ejecutando las amarras de forma individual respetando los tiempos y limitaciones de la competencia.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '0765469b-caef-4457-9d6b-cb739c855402', 'Ejecutando las amarras de forma individual respetando los tiempos y limitaciones de la competencia.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', 'b12da732-d736-480c-82b8-95b312316390', 'Ejercitando la rapidez manual y coordinación fina en los dedos para atar con mayor destreza en cada ronda.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Ejercitando la rapidez manual y coordinación fina en los dedos para atar con mayor destreza en cada ronda.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Sosteniendo la velocidad y la concentración física durante las pruebas de resistencia técnica grupal.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', 'd8c45409-4dcd-4629-a764-cdf52e8b9340', 'Identificando y atando nudos comunes (rizo, ballestrinque, as de guía) indicando su utilidad práctica en campamento.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '2a1587b7-9b40-40e1-9113-8ccd928e1464', 'Identificando y atando nudos comunes (rizo, ballestrinque, as de guía) indicando su utilidad práctica en campamento.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', 'b49b1e68-9cc5-4c76-9cd7-4d6f4c3c1ec6', 'Evaluando qué tipo de nudo o amarra (cuadrada, diagonal) es la más adecuada para unir los materiales presentados.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '78e8ab9b-5313-4642-8f12-8ca4e94ffa5c', 'Evaluando qué tipo de nudo o amarra (cuadrada, diagonal) es la más adecuada para unir los materiales presentados.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '843fda9c-6c4a-4516-b30c-23c92ef755a8', 'Aplicando nudos de tensión o de rescate complejos para solucionar desafíos de ingeniería básica presentados por la jefatura.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando asertivamente para organizar a su patrulla y distribuir los nudos según quién domine mejor cada técnica.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando asertivamente para organizar a su patrulla y distribuir los nudos según quién domine mejor cada técnica.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando el juicio técnico del jurado al comprobar si los nudos están bien confeccionados o si se deshacen bajo tensión.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando el juicio técnico del jurado al comprobar si los nudos están bien confeccionados o si se deshacen bajo tensión.'),
  ('a5082bd8-22d6-4ba1-b0b2-a155f009a3e8', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Aceptando los reglamentos específicos de la competencia, ayudando a fiscalizar el cumplimiento honesto de las pruebas.');

-- 3. Actualizar el campo metadata (JSONB) de cada uno de los 8 artículos con la estructura corregida y coherente

-- Dinámica Cuadro Plástico
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa", "avanzada"],
  "areas": ["corporalidad", "creatividad"],
  "justificacion_areas": "Esta actividad expresiva requiere que los participantes manejen conscientemente sus movimientos y posturas corporales (Corporalidad) para formar estatuas vivientes grupales. Del mismo modo, promueve la expresión artística alternativa y la capacidad de comunicar de forma colectiva y creativa pensamientos e ideas (Creatividad).",
  "objetivos_educativos": [
    {"id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a tener un cuerpo cada vez más fuerte, ágil, veloz y flexible.", "unidad": "Manada", "como_se_cumple": "Adoptando posturas ágiles y flexibles para recrear de manera corporal la escena asignada."},
    {"id": "626a313e-0407-4cfd-b714-c6aa6e51738c", "area": "Corporalidad", "texto": "Manejo cada vez mejor mis brazos, piernas, manos y pies.", "unidad": "Manada", "como_se_cumple": "Controlando la quietud y posición de las extremidades al simular figuras inanimadas sin perder el equilibrio."},
    {"id": "0ba0d3c3-a50a-4a04-8981-601dc7746dd6", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Compañía", "como_se_cumple": "Seleccionando de forma realista posiciones y posturas que puedan ser sostenidas estáticamente durante el tiempo determinado."},
    {"id": "4946a6aa-4a9f-4e7b-89a3-cb5249db8257", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Tropa", "como_se_cumple": "Seleccionando de forma realista posiciones y posturas que puedan ser sostenidas estáticamente durante el tiempo determinado."},
    {"id": "52d9399a-4bf1-4010-a7ca-682b7d1c22a8", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por mantener el equilibrio corporal y la rigidez de la postura a pesar del cansancio estático del crecimiento."},
    {"id": "333453ab-e111-4f06-b0e3-a3e7f06b2439", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por mantener el equilibrio corporal y la rigidez de la postura a pesar del cansancio estático del crecimiento."},
    {"id": "e876d520-d14d-44f3-8baf-bf698dc08dac", "area": "Corporalidad", "texto": "Acepto mi imagen corporal.", "unidad": "Avanzada", "como_se_cumple": "Utilizando expresivamente su imagen y complexión física frente a su comunidad de Avanzada para dar realismo al cuadro sin complejos ni inhibiciones."},
    {"id": "52b5580a-7d0f-454f-b2ae-0d3318129165", "area": "Creatividad", "texto": "Canto, bailo y preparo actuaciones con mis amigos de la Manada.", "unidad": "Manada", "como_se_cumple": "Actuando colectivamente con los miembros de su seisena para recrear una representación dramática divertida y expresiva."},
    {"id": "14b82459-ac31-4496-a875-8e9bd5666030", "area": "Creatividad", "texto": "En las actividades que hago se nota lo que pienso y siento.", "unidad": "Manada", "como_se_cumple": "Expresando de forma dramática y a través de los gestos faciales las emociones y narración del cuadro representado."},
    {"id": "d581cfa7-db1f-4b08-b4d3-525b23e418ea", "area": "Creatividad", "texto": "Participo con entusiasmo en las actividades artísticas de mi Compañía.", "unidad": "Compañía", "como_se_cumple": "Imaginando y escenificando con su patrulla escenas de valor histórico o cotidiano con energía y espíritu lúdico."},
    {"id": "39eaf1aa-f703-4fd0-a4b3-b9756dc30539", "area": "Creatividad", "texto": "Participo con entusiasmo en las actividades artísticas de mi Tropa.", "unidad": "Tropa", "como_se_cumple": "Imaginando y escenificando con su patrulla escenas de valor histórico o cotidiano con energía y espíritu lúdico."},
    {"id": "9758e4f9-728b-4435-a8a3-11fd36c5e3be", "area": "Creatividad", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "unidad": "Compañía", "como_se_cumple": "Proponiendo ideas de representación y elementos de utilería alternativos para mejorar el diseño artístico del cuadro."},
    {"id": "6e910d1c-7021-49a5-9ece-637f480a1ec7", "area": "Creatividad", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "unidad": "Tropa", "como_se_cumple": "Proponiendo ideas de representación y elementos de utilería alternativos para mejorar el diseño artístico del cuadro."},
    {"id": "ed17d59c-1c64-4080-a206-bbe72eeae5a4", "area": "Creatividad", "texto": "Trato de expresarme de un modo propio, y soy capaz de mirar críticamente tendencias e ídolos sociales.", "unidad": "Avanzada", "como_se_cumple": "Estructurando escenas complejas basadas en críticas sociales o históricas que aporten originalidad y reflexión ética al cuadro representado."}
  ]
}'::jsonb
WHERE id = 'ff2ef89a-6073-4174-88de-cdd3435df3af';

-- Juego del Gato Scout
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa", "avanzada", "clan"],
  "areas": ["corporalidad", "creatividad", "sociabilidad"],
  "justificacion_areas": "Este juego tradicional de velocidad y relevos exige una respuesta física rápida y coordinada (Corporalidad) para correr y situar los pañolines en el tablero. Asimismo, reta a los participantes a idear estrategias y tomar decisiones rápidas bajo presión analizando los posibles movimientos del oponente (Creatividad), respetando siempre el sistema de turnos, el juego limpio y las decisiones de los jueces para mantener el clima lúdico (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "texto": "Me gusta practicar deportes.", "unidad": "Manada", "como_se_cumple": "Participando con entusiasmo en la carrera de relevos para colocar las fichas en el tablero gigante."},
    {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "texto": "Practico deportes, conozco sus reglas y sé perder.", "unidad": "Manada", "como_se_cumple": "Corriendo a toda velocidad dentro de la pista de relevos y aceptando el resultado competitivo de la ronda."},
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Respetando la zona de largada y no saliendo antes de ser relevado por el compañero."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Respetando la zona de largada y no saliendo antes de ser relevado por el compañero."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Mejorando su agilidad de carrera y el tiempo de respuesta motriz en beneficio de su patrulla."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Mejorando su agilidad de carrera y el tiempo de respuesta motriz en beneficio de su patrulla."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Desplegando su velocidad y coordinación física durante las fases competitivas del relevo."},
    {"id": "106e27af-ec7a-45fa-9295-fcef88fbef3d", "area": "Corporalidad", "texto": "Convivo constantemente en la naturaleza y participo en actividades deportivas y recreativas.", "unidad": "Clan", "como_se_cumple": "Integrando sus capacidades físicas en la competencia grupal para alcanzar las metas deportivas del equipo."},
    {"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "texto": "Me gusta participar en juegos de observación.", "unidad": "Manada", "como_se_cumple": "Observando rápidamente el estado del tablero gigante antes de decidir dónde colocar su pañolín."},
    {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "unidad": "Manada", "como_se_cumple": "Buscando bloquear las combinaciones de la seisena contraria a través de movimientos rápidos."},
    {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Colaborando verbalmente desde la fila para orientar a sus compañeras sobre la mejor casilla táctica disponible."},
    {"id": "e465926e-deed-4341-956f-047f56860e5e", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Colaborando verbalmente desde la fila para orientar a sus compañeros sobre la mejor casilla táctica disponible."},
    {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Compañía", "como_se_cumple": "Anticipando la estrategia y el posicionamiento del rival para mover sus fichas preventivamente."},
    {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Tropa", "como_se_cumple": "Anticipando la estrategia y el posicionamiento del rival para mover sus fichas preventivamente."},
    {"id": "310eb631-8ca9-4eaf-ac80-232a5150d024", "area": "Creatividad", "texto": "Creo actividades y juegos para realizar con mi comunidad y soy capaz de motivarlos.", "unidad": "Avanzada", "como_se_cumple": "Proponiendo variaciones tácticas complejas para dinamizar el juego del gato scout."},
    {"id": "ef75fbed-4a6d-49ea-bfab-f2952415e1a0", "area": "Creatividad", "texto": "Actúo con agilidad mental ante las situaciones más diversas, desarrollando mi capacidad de pensar, innovar y aventurar.", "unidad": "Clan", "como_se_cumple": "Resolviendo situaciones lógicas y de bloqueo táctico complejas en segundos para asegurar la victoria de la comunidad."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Aceptando las normas de salida y colocación del pañolín sin cometer faltas de largada."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando el límite del tablero gigante y el turno del corredor contrario para evitar roces físicos."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando constructivamente con sus pares al acordar el orden de los corredores en la fila."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando constructivamente con sus pares al acordar el orden de los corredores en la fila."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando las reglas del juego de relevos y dialogando respetuosamente ante disputas de llegada rápida sobre la cuadrícula."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando las reglas del juego de relevos y dialogando respetuosamente ante disputas de llegada rápida sobre la cuadrícula."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Aceptando las decisiones de los árbitros o dirigentes sobre quién colocó la ficha primero en caso de empate."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Promoviendo el cumplimiento de las normas lúdicas y evitando actitudes antideportivas durante la carrera."}
  ]
}'::jsonb
WHERE id = 'cf0fce88-68dd-40ab-9a65-d684c9c28edd';

-- Carrera del Saber
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica exige que los participantes realicen carreras y desafíos motrices intensos (como el cuerpo a tierra) que desarrollan su resistencia física y agilidad corporal al aire libre (Corporalidad). De igual manera, promueve el respeto de las normas lúdicas y de seguridad necesarias para evitar tropiezos o lesiones físicas con sus pares, fomentando la sana convivencia competitiva (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Efectuando la carrera de velocidad y los obstáculos físicos de acuerdo con las reglas de relevos explicadas."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Efectuando la carrera de velocidad y los obstáculos físicos de acuerdo con las reglas de relevos explicadas."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por completar los desafíos físicos de la carrera con mayor velocidad y técnica en cada turno."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por completar los desafíos físicos de la carrera con mayor velocidad y técnica en cada turno."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Desplegando sus capacidades motrices y su resistencia aeróbica en el recorrido de la carrera del saber."},
    {"id": "106e27af-ec7a-45fa-9295-fcef88fbef3d", "area": "Corporalidad", "texto": "Convivo constantemente en la naturaleza y participo en actividades deportivas y recreativas.", "unidad": "Clan", "como_se_cumple": "Integrando sus capacidades atléticas en los desafíos físicos grupales realizados al aire libre."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Dialogando con su equipo sobre el orden de salida de los competidores según las fortalezas individuales."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Dialogando con su equipo sobre el orden de salida de los competidores según las fortalezas individuales."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de no soplar o asistir a los participantes que se encuentran respondiendo las preguntas de la carrera."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de no soplar o asistir a los participantes que se encuentran respondiendo las preguntas de la carrera."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Aceptando de buen grado las decisiones y puntajes asignados por los dirigentes encargados de calificar las respuestas."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Promoviendo un marco ético de juego limpio, honestidad en las respuestas y resguardo de la seguridad mutua durante la carrera."}
  ]
}'::jsonb
WHERE id = 'ee69fbc0-4bbe-4cbf-8aab-bea1e11b7e15';

-- Ley con clave morse
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa"],
  "areas": ["afectividad", "creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de descifrado técnico estimula el razonamiento lógico y el aprendizaje de la criptografía y los códigos scouts de transmisión de mensajes (Creatividad). Asimismo, el guiado a ciegas de los miembros del equipo hacia los mensajes promueve la confianza mutua, la seguridad emocional y el autocontrol frente al temor de avanzar sin ver (Afectividad), todo enmarcado en el cumplimiento estricto del reglamento de juego y la convivencia grupal (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "d531dd19-4d49-4342-8114-184de017ac49", "area": "Creatividad", "texto": "Conozco diferentes técnicas de comunicación y sé utilizar algunas de ellas.", "unidad": "Compañía", "como_se_cumple": "Decodificando y traduciendo de manera práctica mensajes escritos en código morse con su patrulla."},
    {"id": "0b23d4c8-6e40-4e8e-a476-97ed92efa152", "area": "Creatividad", "texto": "Conozco diferentes técnicas de comunicación y sé utilizar algunos de ellos.", "unidad": "Tropa", "como_se_cumple": "Decodificando y traduciendo de manera práctica mensajes escritos en código morse con su patrulla."},
    {"id": "d20cab83-3c15-4bb0-8435-a790e72b6d50", "area": "Creatividad", "texto": "Conozco cómo funcionan los servicios que uso habitualmente, como el teléfono, la electricidad, la radio, la televisión y otros.", "unidad": "Compañía", "como_se_cumple": "Asociando la clave morse con el desarrollo histórico de las telecomunicaciones y la telegrafía."},
    {"id": "27bc66a0-bfba-4e22-9b3e-d1d4fa6112b4", "area": "Creatividad", "texto": "Conozco cómo funcionan los servicios que uso habitualmente, como el teléfono, la electricidad, la radio, la televisión y otros.", "unidad": "Tropa", "como_se_cumple": "Asociando la clave morse con el desarrollo histórico de las telecomunicaciones y la telegrafía."},
    {"id": "818d8a25-549b-4e01-a830-e50d73e39025", "area": "Afectividad", "texto": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.", "unidad": "Compañía", "como_se_cumple": "Superando la inseguridad y el temor de caminar con los ojos vendados confiando en las instrucciones de sus compañeras."},
    {"id": "03ccaf4c-03c4-42a8-b311-47fef60f204c", "area": "Afectividad", "texto": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.", "unidad": "Tropa", "como_se_cumple": "Superando la inseguridad y el temor de caminar con los ojos vendados confiando en las instrucciones de sus compañeros."},
    {"id": "67a2f0fa-9b1e-4b7b-bda2-e25696c87898", "area": "Afectividad", "texto": "Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.", "unidad": "Compañía", "como_se_cumple": "Manteniendo la calma y el autocontrol mientras es guiado a viva voz a través de los obstáculos del terreno."},
    {"id": "74e6c7e0-f9f6-47d3-acdb-d6df315ef123", "area": "Afectividad", "texto": "Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.", "unidad": "Tropa", "como_se_cumple": "Manteniendo la calma y el autocontrol mientras es guiado a viva voz a través de los obstáculos del terreno."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Estableciendo códigos y acuerdos de guiado sonoro eficaces dentro de la patrulla antes de iniciar el juego."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Estableciendo códigos y acuerdos de guiado sonoro eficaces dentro de la patrulla antes de iniciar el juego."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Cumpliendo honestamente las restricciones de juego (no quitarse la venda y usar sólo señales permitidas) para resguardar la equidad."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Cumpliendo honestamente las restricciones de juego (no quitarse la venda y usar sólo señales permitidas) para resguardar la equidad."}
  ]
}'::jsonb
WHERE id = 'd87c3dc3-20b6-4400-9a8f-4dc1c9ee42cc';

-- Casa Inquilino o Terremoto
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Este juego de reacción física masiva y constante movimiento estimula la agilidad, la rapidez de reflejos y la coordinación psicomotriz gruesa (Corporalidad) al tener que correr y reagruparse rápidamente. Asimismo, fomenta la integración de todos los miembros del grupo, rompiendo barreras de timidez al forzar la integración constante con compañeros distintos en cada ronda mediante reglas claras de convivencia (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "texto": "Me gusta practicar deportes.", "unidad": "Manada", "como_se_cumple": "Participando activamente de los desplazamientos rápidos y lúdicos propuestos en la dinámica."},
    {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "texto": "Practico deportes, conozco sus reglas y sé perder.", "unidad": "Manada", "como_se_cumple": "Desplazándose ágilmente dentro de los límites del campo de juego y aceptando quedar sin casa o inquilino de forma deportiva."},
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Corriendo rápidamente para formar grupos de tres (dos \"casas\" y un \"inquilino\") siguiendo los comandos del dirigente."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Corriendo rápidamente para formar grupos de tres (dos \"casas\" y un \"inquilino\") siguiendo los comandos del dirigente."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por mejorar su agilidad mental y física para reaccionar al instante ante el comando \"Terremoto!\"."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por mejorar su agilidad mental y física para reaccionar al instante ante el comando \"Terremoto!\"."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Integrándose de inmediato con cualquier lobato que le toque formar casa o ser inquilino sin exclusiones."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando la prohibición de quedarse fijos en el mismo trío en cada ronda para incentivar la integración de toda la Manada."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Colaborando cordialmente al formar los nuevos tríos y ordenando los relevos físicos."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Colaborando cordialmente al formar los nuevos tríos y ordenando los relevos físicos."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Dialogando para resolver con asertividad y rapidez quién ingresa a cada refugio cuando dos inquilinos llegan al mismo tiempo."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Dialogando para resolver con asertividad y rapidez quién ingresa a cada refugio cuando dos inquilinos llegan al mismo tiempo."}
  ]
}'::jsonb
WHERE id = 'c37832d6-9192-43e2-9886-4a7917e8e710';

-- Dos mentiras y una verdad
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "avanzada", "clan"],
  "areas": ["creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de conocimiento interpersonal y expresión oral fomenta el ingenio y el uso estratégico del lenguaje para narrar anécdotas personales de forma atractiva e intrigante (Creatividad). Además, al revelar hechos reales y mentiras sobre su vida cotidiana, promueve el respeto a la singularidad de cada compañero, fortaleciendo la empatía grupal y valorando la diversidad personal (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "0d742d23-ebe1-40e6-97df-37bc03edb010", "area": "Creatividad", "texto": "Expreso mis pensamientos y experiencias en el Tally.", "unidad": "Compañía", "como_se_cumple": "Escribiendo y compartiendo de forma estructurada tres afirmaciones personales para que su patrulla intente descubrir la verdad."},
    {"id": "9758e4f9-728b-4435-a8a3-11fd36c5e3be", "area": "Creatividad", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "unidad": "Compañía", "como_se_cumple": "Narrando con dramatismo y creatividad sus afirmaciones para sembrar la duda entre sus compañeras de patrulla."},
    {"id": "ed17d59c-1c64-4080-a206-bbe72eeae5a4", "area": "Creatividad", "texto": "Trato de expresarme de un modo propio, y soy capaz de mirar críticamente tendencias e ídolos sociales.", "unidad": "Avanzada", "como_se_cumple": "Diseñando anécdotas auténticas e ingeniosas basadas en sus propias vivencias, marcando un estilo propio al hablar en público."},
    {"id": "91e60eba-e267-4d1a-b27b-ef61a7b03b31", "area": "Creatividad", "texto": "Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.", "unidad": "Clan", "como_se_cumple": "Generando un clima de confianza y diversión compartida a través de la narración de historias personales sorprendentes."},
    {"id": "fce82191-77ea-444b-89d9-e33b62a323a5", "area": "Sociabilidad", "texto": "Procuro que respetemos a nuestras compañeras, cualquiera sea su manera de ser.", "unidad": "Compañía", "como_se_cumple": "Escuchando respetuosamente las afirmaciones de sus compañeras sin hacer comentarios de desprecio o burla sobre sus vidas."},
    {"id": "ea86ecee-b201-4a49-be9d-4e55de7ffe8c", "area": "Sociabilidad", "texto": "Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.", "unidad": "Compañía", "como_se_cumple": "Aceptando con empatía las distintas realidades y experiencias de vida expresadas por los miembros de su patrulla."},
    {"id": "007591fb-a2b6-4fb5-9286-acde65455f53", "area": "Sociabilidad", "texto": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.", "unidad": "Avanzada", "como_se_cumple": "Valorando las características singulares que definen a cada miembro de su comunidad en un ambiente de igualdad y respeto."},
    {"id": "b5a81328-5c07-41bd-a1ea-1ed401762841", "area": "Sociabilidad", "texto": "Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo mis obligaciones y defendiendo igual derecho para los demás.", "unidad": "Clan", "como_se_cumple": "Promoviendo que todos los integrantes del Clan participen equitativamente y tengan la misma libertad para relatar sus experiencias."}
  ]
}'::jsonb
WHERE id = 'b8daf1ee-84cd-46e5-a871-f6371673db05';

-- Carrera de camillas
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada"],
  "areas": ["corporalidad", "creatividad"],
  "justificacion_areas": "Esta dinámica de primeros auxilios y destreza técnica requiere que los participantes demuestren fuerza, equilibrio y coordinación motriz gruesa (Corporalidad) al armar y correr cargando de manera segura la camilla con el paciente. Asimismo, estimula el ingenio técnico y el uso de técnicas de pionerismo y nudos básicos para construir una estructura estable que proteja la integridad física del trasladado (Creatividad).",
  "objetivos_educativos": [
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Participando de la carrera respetando las zonas marcadas para evitar colisiones peligrosas con otros equipos."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Participando de la carrera respetando las zonas marcadas para evitar colisiones peligrosas con otros equipos."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por correr de forma sincronizada con sus compañeras de patrulla para estabilizar la carga de la camilla."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por correr de forma sincronizada con sus compañeros de patrulla para estabilizar la carga de la camilla."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Desplegando resistencia física y fuerza muscular en los brazos y piernas durante el transporte del paciente a través del recorrido."},
    {"id": "d8c45409-4dcd-4629-a764-cdf52e8b9340", "area": "Creatividad", "texto": "Conozco y uso algunas técnicas de campismo y pionerismo.", "unidad": "Compañía", "como_se_cumple": "Aplicando nudos básicos (como el rizo o ballestrinque) para amarrar los pañolines y palos que formarán la camilla."},
    {"id": "2a1587b7-9b40-40e1-9113-8ccd928e1464", "area": "Creatividad", "texto": "Conozco y uso algunas técnicas de campismo y pionerismo.", "unidad": "Tropa", "como_se_cumple": "Aplicando nudos básicos (como el rizo o ballestrinque) para amarrar los pañolines y palos que formarán la camilla."},
    {"id": "b49b1e68-9cc5-4c76-9cd7-4d6f4c3c1ec6", "area": "Creatividad", "texto": "Participo en el diseño e instalación de las construcciones de campamento.", "unidad": "Compañía", "como_se_cumple": "Diseñando una estructura de camilla improvisada resistente y equilibrada utilizando el material disponible de manera eficiente."},
    {"id": "78e8ab9b-5313-4642-8f12-8ca4e94ffa5c", "area": "Creatividad", "texto": "Participo en el diseño e instalación de las construcciones de campamento.", "unidad": "Tropa", "como_se_cumple": "Diseñando una estructura de camilla improvisada resistente y equilibrada utilizando el material disponible de manera eficiente."},
    {"id": "843fda9c-6c4a-4516-b30c-23c92ef755a8", "area": "Creatividad", "texto": "Puedo resolver la mayoría de los problemas técnicos domésticos simples.", "unidad": "Avanzada", "como_se_cumple": "Improvisando soluciones estructurales de emergencia rápidas para garantizar un traslado seguro ante incidentes simulados en el campo."}
  ]
}'::jsonb
WHERE id = 'fa3fe65c-fb44-46a6-9a27-6ea8bf72e246';

-- Competencia de Nudos
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada"],
  "areas": ["corporalidad", "creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de destreza y pionerismo requiere de agilidad motora fina y coordinación física (Corporalidad) para realizar nudos de forma veloz y precisa bajo un formato competitivo. Promueve la asimilación técnica del campismo básico mediante la ejecución práctica de nudos de unión, anclaje y seguridad (Creatividad), y fomenta el respeto de las normas y el juego cooperativo al requerir el apoyo mutuo dentro de la patrulla para lograr el objetivo común (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Ejecutando las amarras de forma individual respetando los tiempos y limitaciones de la competencia."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Ejecutando las amarras de forma individual respetando los tiempos y limitaciones de la competencia."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Ejercitando la rapidez manual y coordinación fina en los dedos para atar con mayor destreza en cada ronda."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Ejercitando la rapidez manual y coordinación fina en los dedos para atar con mayor destreza en cada ronda."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Sosteniendo la velocidad y la concentración física durante las pruebas de resistencia técnica grupal."},
    {"id": "d8c45409-4dcd-4629-a764-cdf52e8b9340", "area": "Creatividad", "texto": "Conozco y uso algunas técnicas de campismo y pionerismo.", "unidad": "Compañía", "como_se_cumple": "Identificando y atando nudos comunes (rizo, ballestrinque, as de guía) indicando su utilidad práctica en campamento."},
    {"id": "2a1587b7-9b40-40e1-9113-8ccd928e1464", "area": "Creatividad", "texto": "Conozco y uso algunas técnicas de campismo y pionerismo.", "unidad": "Tropa", "como_se_cumple": "Identificando y atando nudos comunes (rizo, ballestrinque, as de guía) indicando su utilidad práctica en campamento."},
    {"id": "b49b1e68-9cc5-4c76-9cd7-4d6f4c3c1ec6", "area": "Creatividad", "texto": "Participo en el diseño e instalación de las construcciones de campamento.", "unidad": "Compañía", "como_se_cumple": "Evaluando qué tipo de nudo o amarra (cuadrada, diagonal) es la más adecuada para unir los materiales presentados."},
    {"id": "78e8ab9b-5313-4642-8f12-8ca4e94ffa5c", "area": "Creatividad", "texto": "Participo en el diseño e instalación de las construcciones de campamento.", "unidad": "Tropa", "como_se_cumple": "Evaluando qué tipo de nudo o amarra (cuadrada, diagonal) es la más adecuada para unir los materiales presentados."},
    {"id": "843fda9c-6c4a-4516-b30c-23c92ef755a8", "area": "Creatividad", "texto": "Puedo resolver la mayoría de los problemas técnicos domésticos simples.", "unidad": "Avanzada", "como_se_cumple": "Aplicando nudos de tensión o de rescate complejos para solucionar desafíos de ingeniería básica presentados por la jefatura."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando asertivamente para organizar a su patrulla y distribuir los nudos según quién domine mejor cada técnica."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando asertivamente para organizar a su patrulla y distribuir los nudos según quién domine mejor cada técnica."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando el juicio técnico del jurado al comprobar si los nudos están bien confeccionados o si se deshacen bajo tensión."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando el juicio técnico del jurado al comprobar si los nudos están bien confeccionados o si se deshacen bajo tensión."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Aceptando los reglamentos específicos de la competencia, ayudando a fiscalizar el cumplimiento honesto de las pruebas."}
  ]
}'::jsonb
WHERE id = 'a5082bd8-22d6-4ba1-b0b2-a155f009a3e8';
