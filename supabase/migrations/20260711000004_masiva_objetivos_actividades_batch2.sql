-- Migración masiva para registrar los objetivos educativos de 11 actividades scout (Batch 2)
-- Asegura consistencia pedagógica completa: todos los objetivos pertenecen a las mismas dimensiones/objetivos terminales.

-- 1. Limpiar relaciones anteriores de los 11 artículos
DELETE FROM public.articulo_objetivos_educativos 
WHERE articulo_id IN (
  '7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', -- Conejos y Guaridas
  '4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', -- Proteger al huevo
  'bddb6314-6411-404b-9107-40c9da299291', -- Los Inversionistas
  'e999778b-cc5a-4c53-bbe7-815a64237a11', -- Juicio en la corte
  '6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', -- Completa la oración
  '18ae9052-19bf-48ca-89a3-c34f0081e7ca', -- El Epitafio
  '82610966-74e3-40cc-a789-6ec6b32af1a2', -- ¿Que animal me gustaría ser?
  '7787150d-690f-49f3-8ec0-5bd876690f09', -- Carrera de Tres Pies
  '6a2b2b30-c8f4-44d1-a766-b02bdd725658', -- Relevos Ciegos
  '77f087e8-4dab-4a7b-a25d-9ca93292014d', -- Carrera de submarinos
  '844d5d4b-743e-4ebc-a734-5e7210a3be75'  -- Carrera de Elefantes
);

-- 2. Insertar relaciones corregidas y pedagógicamente coherentes
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  -- Conejos y Guaridas (7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124)
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', '1427451e-b8b3-493b-8525-e53298381e07', 'Corriendo rápidamente para ubicarse dentro de las guaridas respetando los límites fijados por la jefatura.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', '0765469b-caef-4457-9d6b-cb739c855402', 'Corriendo rápidamente para ubicarse dentro de las guaridas respetando los límites fijados por la jefatura.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por reaccionar con agilidad y velocidad ante la señal del cambio de guaridas.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por reaccionar con agilidad y velocidad ante la señal del cambio de guaridas.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Demostrando agilidad física e intensidad cardiovascular en las fases consecutivas de persecución.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando para acordar con su pareja de guarida la mejor forma de recibir o guiar a los lobos/conejos que buscan refugio.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando para acordar con su pareja de guarida la mejor forma de recibir o guiar a los lobos/conejos que buscan refugio.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de no retener o empujar físicamente a otros competidores para dejarlos fuera de las posiciones.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de no retener o empujar físicamente a otros competidores para dejarlos fuera de las posiciones.'),
  ('7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Asumiendo los fallos de los dirigentes sobre quién logró ingresar a una guarida en caso de empates simultáneos.'),

  -- Proteger al huevo (4f0ec9d9-8b81-47d6-9e0d-003572c0fe58)
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '103661fc-3396-4eac-9182-58b7e54d5115', 'Ensamblando con cuidado las bombillas, papeles y cintas para armar el escudo protector del huevo.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '11320fb6-98de-4725-825d-db858e3bffa2', 'Ensamblando con cuidado las bombillas, papeles y cintas para armar el escudo protector del huevo.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '0f60be94-6de3-4c34-a6ff-5b5018f0b156', 'Cuidando y optimizando el uso de los materiales asignados para evitar el desperdicio durante la construcción.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', 'fd3d3e14-e92b-4ab5-8298-9018c6e70b20', 'Cuidando y optimizando el uso de los materiales asignados para evitar el desperdicio durante la construcción.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '843fda9c-6c4a-4516-b30c-23c92ef755a8', 'Ideando soluciones físicas de amortiguación frente al impacto de la gravedad usando la creatividad práctica.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '29eee8b1-a414-4df9-90e1-520a384fb9aa', 'Integrando conocimientos físicos sobre impacto y resistencia de materiales en el diseño estructural final.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '9478b46f-6f74-4a7e-bf9c-d66caaba1381', 'Asumiendo con responsabilidad la tarea específica asignada por la patrulla (medición, corte o ensamblado).'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Asumiendo con responsabilidad la tarea específica asignada por la patrulla (medición, corte o ensamblado).'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25', 'Apoyando activamente la ejecución del diseño acordado colectivamente, respetando el consenso general.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Apoyando activamente la ejecución del diseño acordado colectivamente, respetando el consenso general.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', '5abfbe81-75e4-4444-b52d-38e59e8b6ec7', 'Colaborando con la posterior limpieza y recolección de los residuos de huevos rotos sin quejas ni protestas.'),
  ('4f0ec9d9-8b81-47d6-9e0d-003572c0fe58', 'b5a81328-5c07-41bd-a1ea-1ed401762841', 'Asegurando que todos los miembros del Clan expongan libremente sus ideas de diseño antes de iniciar la construcción.'),

  -- Los Inversionistas (bddb6314-6411-404b-9107-40c9da299291)
  ('bddb6314-6411-404b-9107-40c9da299291', 'baa365a9-087c-4c25-b0ad-57893df5ff74', 'Invirtiendo honestamente sus fichas en las opciones que realmente prefiere y no por presión de sus compañeros.'),
  ('bddb6314-6411-404b-9107-40c9da299291', '506b7596-cac4-48e0-88c7-942d575172db', 'Defendiendo ante la seisena la votación efectuada a pesar de que su propuesta resulte minoritaria.'),
  ('bddb6314-6411-404b-9107-40c9da299291', '2845964c-1778-4ed7-8284-c5d830ea0a0d', 'Manteniendo sus convicciones individuales frente a las propuestas que se exponen a votación.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'f77525b1-07a3-4188-9051-4d3ba86aadfc', 'Manteniendo sus convicciones individuales frente a las propuestas que se exponen a votación.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'c4fe900a-9641-4cad-a265-3f31073d83cb', 'Exponiendo razones lógicas que fundamentan por qué invirtió su capital en determinada propuesta.'),
  ('bddb6314-6411-404b-9107-40c9da299291', '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Exponiendo razones lógicas que fundamentan por qué invirtió su capital en determinada propuesta.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba', 'Evaluando el impacto comunitario y la coherencia ética de las propuestas de inversión antes de asignar su dinero ficticio.'),
  ('bddb6314-6411-404b-9107-40c9da299291', '770a8ff3-7bb8-45dd-b114-5ae1069eff62', 'Tomando decisiones de inversión orientadas al bien común del Clan, asumiendo con coherencia sus posturas en la plenaria.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando el método democrático de distribución y las normas de mercado del juego.'),
  ('bddb6314-6411-404b-9107-40c9da299291', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando la decisión mayoritaria que resulta de la sumatoria de las inversiones de la Manada.'),
  ('bddb6314-6411-404b-9107-40c9da299291', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Proponiendo ideas o mejoras a las propuestas para captar el capital e interés de sus compañeras.'),
  ('bddb6314-6411-404b-9107-40c9da299291', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Proponiendo ideas o mejoras a las propuestas para captar el capital e interés de sus compañeros.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Debatiendo con asertividad sobre los límites de inversión impuestos a cada participante para garantizar equidad.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Debatiendo con asertividad sobre los límites de inversión impuestos a cada participante para garantizar equidad.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Aportando ideas constructivas para regular la especulación económica ficticia del juego en la asamblea de Avanzada.'),
  ('bddb6314-6411-404b-9107-40c9da299291', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Fiscalizando de forma responsable que las votaciones e inversiones se ajusten al marco ético convenido en el Clan.'),

  -- Juicio en la corte (e999778b-cc5a-4c53-bbe7-815a64237a11)
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'baa365a9-087c-4c25-b0ad-57893df5ff74', 'Aportando testimonios honestos en su rol asignado, distinguiendo la verdad de los supuestos presentados.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '506b7596-cac4-48e0-88c7-942d575172db', 'Asumiendo con franqueza la culpabilidad o responsabilidad de sus actos simulados si se le encuentra culpable.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '2845964c-1778-4ed7-8284-c5d830ea0a0d', 'Evitando falsear datos u opiniones éticas personales al estructurar los testimonios de la defensa.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'f77525b1-07a3-4188-9051-4d3ba86aadfc', 'Evitando falsear datos u opiniones éticas personales al estructurar los testimonios de la defensa.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'c4fe900a-9641-4cad-a265-3f31073d83cb', 'Debatiendo con solidez ética para fundamentar sus alegatos procesales en coherencia con sus valores.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Debatiendo con solidez ética para fundamentar sus alegatos procesales en coherencia con sus valores.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba', 'Evaluando el veredicto basándose en la justicia y equidad, por encima de las simpatías personales del grupo de Avanzada.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '770a8ff3-7bb8-45dd-b114-5ae1069eff62', 'Deliberando como juez o jurado de manera responsable, demostrando madurez y solidez ética en el juicio final.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '52b5580a-7d0f-454f-b2ae-0d3318129165', 'Interpretando su personaje (acusado, testigo) de manera dramática y lúdica en la recreación.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '14b82459-ac31-4496-a875-8e9bd5666030', 'Gesticulando y modulando la voz al presentar sus argumentos para captar la atención de la asamblea.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'd581cfa7-db1f-4b08-b4d3-525b23e418ea', 'Participando de la simulación teatral del juicio con energía y creatividad narrativa.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '39eaf1aa-f703-4fd0-a4b3-b9756dc30539', 'Participando de la simulación teatral del juicio con energía y creatividad narrativa.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '9758e4f9-728b-4435-a8a3-11fd36c5e3be', 'Estructurando discursos de apertura y alegatos convincentes mediante una retórica cuidada.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '6e910d1c-7021-49a5-9ece-637f480a1ec7', 'Estructurando discursos de apertura y alegatos convincentes mediante una retórica cuidada.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'ed17d59c-1c64-4080-a206-bbe72eeae5a4', 'Formulando contrapreguntas agudas y análisis críticos del caso judicial presentado.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '91e60eba-e267-4d1a-b27b-ef61a7b03b31', 'Moderando el debate judicial para que resulte instructivo, fluido y respetuoso de las formalidades orales.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Acatando las llamadas al orden del juez y guardando silencio cuando expone el equipo contrario.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando la formalidad procesal (pedir la palabra, levantarse para hablar) acordada en la corte.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Participando en el debate grupal interno de la fiscalía o defensa para redactar la acusación.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Participando en el debate grupal interno de la fiscalía o defensa para redactar la acusación.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Cuestionando con argumentos procesales válidos las objeciones que presente la contraparte.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Cuestionando con argumentos procesales válidos las objeciones que presente la contraparte.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Proponiendo reformas al reglamento judicial de la corte si se constatan injusticias de base en la simulación.'),
  ('e999778b-cc5a-4c53-bbe7-815a64237a11', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Garantizando que todo el proceso judicial de la corte se desenvuelva bajo el marco de los derechos humanos y la justicia democrática.'),

  -- Completa la oración (6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81)
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '52b5580a-7d0f-454f-b2ae-0d3318129165', 'Formando parte del juego expresivo grupal para armar frases divertidas de la Manada.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '14b82459-ac31-4496-a875-8e9bd5666030', 'Completando las oraciones con palabras que reflejen el sentido del mensaje scout y sus sentimientos.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', 'd581cfa7-db1f-4b08-b4d3-525b23e418ea', 'Colaborando activamente en el descifrado creativo y colocación de los fragmentos de la oración.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '39eaf1aa-f703-4fd0-a4b3-b9756dc30539', 'Colaborando activamente en el descifrado creativo y colocación de los fragmentos de la oración.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '9758e4f9-728b-4435-a8a3-11fd36c5e3be', 'Utilizando el lenguaje escrito y la redacción para dar coherencia semántica a los enunciados incompletos.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '6e910d1c-7021-49a5-9ece-637f480a1ec7', 'Utilizando el lenguaje escrito y la redacción para dar coherencia semántica a los enunciados incompletos.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', 'ed17d59c-1c64-4080-a206-bbe72eeae5a4', 'Analizando la semántica y los mensajes del texto de fondo para aportar ideas originales en la resolución del desafío lingüístico.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '91e60eba-e267-4d1a-b27b-ef61a7b03b31', 'Estructurando el repaso final del texto en plenaria para que resulte motivador y educativo para toda la unidad.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Respetando la señal de partida y el orden de la fila sin adelantarse a sus compañeros.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Colaborando cordialmente al realizar el relevo físico con los compañeros de su seisena.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando para definir de qué forma se organizará la patrulla para descifrar las oraciones en menos tiempo.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando para definir de qué forma se organizará la patrulla para descifrar las oraciones en menos tiempo.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de no ayudar ni soplar palabras a los corredores que están en la pista.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de no ayudar ni soplar palabras a los corredores que están en la pista.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Acatando la anulación de palabras si se constata que se cometió alguna falta de largada.'),
  ('6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Promoviendo que la dinámica de carrera y completación de textos mantenga siempre las reglas de juego limpio acordadas.'),

  -- El Epitafio (18ae9052-19bf-48ca-89a3-c34f0081e7ca)
  ('18ae9052-19bf-48ca-89a3-c34f0081e7ca', 'ed17d59c-1c64-4080-a206-bbe72eeae5a4', 'Escribiendo un epitafio auténtico y original que refleje sus verdaderos anhelos personales al margen de modas o presiones de la sociedad.'),
  ('18ae9052-19bf-48ca-89a3-c34f0081e7ca', '91e60eba-e267-4d1a-b27b-ef61a7b03b31', 'Compartiendo voluntariamente la lectura de su epitafio con su equipo en un clima de respeto y profunda empatía.'),
  ('18ae9052-19bf-48ca-89a3-c34f0081e7ca', '57a9f554-a5ba-48bc-913b-47e187d1513c', 'Reflexionando sobre si sus acciones y comportamiento diario son coherentes con las convicciones que desea legar.'),
  ('18ae9052-19bf-48ca-89a3-c34f0081e7ca', 'ed57439e-1d13-4cb2-ae32-ddd3978d33bd', 'Proyectando su proyecto de vida hacia trascendencia y servicio, identificando qué huella desea marcar en su comunidad.'),

  -- ¿Que animal me gustaría ser? (82610966-74e3-40cc-a789-6ec6b32af1a2)
  ('82610966-74e3-40cc-a789-6ec6b32af1a2', '81298790-d245-48c6-8b1b-266b218c69da', 'Analizando qué rasgos de su personalidad se asimilan a las características del animal que le gustaría representar.'),
  ('82610966-74e3-40cc-a789-6ec6b32af1a2', '07d61bf7-36fc-40f6-8f8e-21fe97b169f0', 'Expresando con madurez y sin timidez sus emociones profundas y temores personales en un clima grupal seguro.'),
  ('82610966-74e3-40cc-a789-6ec6b32af1a2', 'a8d2d3fc-63a7-41ed-9029-9d65b6badba1', 'Estableciendo qué cualidades y valores (fuerza, constancia, libertad, astucia) del animal desea incorporar a su conducta personal.'),
  ('82610966-74e3-40cc-a789-6ec6b32af1a2', '0bdf2252-6db5-41f9-8bc7-87e4da3ee602', 'Proyectando su vocación de servicio y el sentido de su proyecto personal asociándolo con las características protectoras o cooperativas del animal elegido.'),

  -- Carrera de Tres Pies (7787150d-690f-49f3-8ec0-5bd876690f09)
  ('7787150d-690f-49f3-8ec0-5bd876690f09', 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Participando activamente de la carrera lúdica con su compañero de seisena.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Corriendo al ritmo de su compañero y aceptando el resultado competitivo de forma lúdica.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', '1427451e-b8b3-493b-8525-e53298381e07', 'Sincronizando el paso con su pareja sin soltarse ni adelantarse antes de la largada.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', '0765469b-caef-4457-9d6b-cb739c855402', 'Sincronizando el paso con su pareja sin soltarse ni adelantarse antes de la largada.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por coordinar y perfeccionar el paso lateral acelerado para maximizar el desempeño de la patrulla.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por coordinar y perfeccionar el paso lateral acelerado para maximizar el desempeño de la patrulla.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Acatando las amarras de pañolín y manteniendo una conducta de cuidado mutuo durante la carrera.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Manteniendo su carril de carrera sin cruzarse en el camino de las otras parejas para evitar accidentes.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Acordando con su compañera verbalmente la señal o palabra clave ("uno, dos...") para avanzar en sincronía.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Acordando con su compañero verbalmente la señal o palabra clave ("uno, dos...") para avanzar en sincronía.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de comenzar nuevamente en el punto de partida en caso de desatarse la amarra.'),
  ('7787150d-690f-49f3-8ec0-5bd876690f09', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de comenzar nuevamente en el punto de partida en caso de desatarse la amarra.'),

  -- Relevos Ciegos (6a2b2b30-c8f4-44d1-a766-b02bdd725658)
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'd9ebcd96-c9cf-444f-94fb-5569110a1b99', 'Desplazándose con agilidad y soltura a pesar de no contar con la referencia visual directa.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Coordinando el paso y la zancada de manera segura al pisar sobre el terreno de juego.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '0ba0d3c3-a50a-4a04-8981-601dc7746dd6', 'Midiendo la velocidad y longitud del paso según su percepción de estabilidad física y el terreno.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '4946a6aa-4a9f-4e7b-89a3-cb5249db8257', 'Midiendo la velocidad y longitud del paso según su percepción de estabilidad física y el terreno.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '52d9399a-4bf1-4010-a7ca-682b7d1c22a8', 'Esforzándose por mantener el equilibrio corporal dinámico al desplazarse a ciegas guiado por la voz.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '333453ab-e111-4f06-b0e3-a3e7f06b2439', 'Esforzándose por mantener el equilibrio corporal dinámico al desplazarse a ciegas guiado por la voz.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'e876d520-d14d-44f3-8baf-bf698dc08dac', 'Aceptando su complexión y posibilidades motrices durante la carrera a ciegas en un marco de confianza comunitaria.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Escuchando atentamente los sonidos específicos de guía que emiten sus compañeros de seisena.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Resolviendo con rapidez mental la trayectoria a seguir ante instrucciones confusas del exterior.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '12686e7d-d6af-4c74-928d-c859d5b883d5', 'Colaborando en el acuerdo de patrulla para definir los comandos de guiado (ej: "izquierda", "alto").'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'e465926e-deed-4341-956f-047f56860e5e', 'Colaborando en el acuerdo de patrulla para definir los comandos de guiado (ej: "izquierda", "alto").'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Anticipando la posición de los rivales y de los obstáculos para guiar al compañero vendado de manera inteligente.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Anticipando la posición de los rivales y de los obstáculos para guiar al compañero vendado de manera inteligente.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '310eb631-8ca9-4eaf-ac80-232a5150d024', 'Ideando variaciones complejas de guiado (códigos de palmas o silbatos) para hacer más retadora la dinámica.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Manteniendo la venda puesta y sin tocarla o reajustarla durante su turno de carrera.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando la directriz de seguridad de avanzar sólo con pasos firmes para no chocar intencionalmente con otros corredores.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando asertivamente para definir qué corredor saldrá en cada turno del relevo.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando asertivamente para definir qué corredor saldrá en cada turno del relevo.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando las indicaciones de seguridad física fijadas por los dirigentes antes de iniciar la carrera de relevos.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando las indicaciones de seguridad física fijadas por los dirigentes antes de iniciar la carrera de relevos.'),
  ('6a2b2b30-c8f4-44d1-a766-b02bdd725658', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Colaborando de manera honesta y velando por el cumplimiento estricto del fair play (no soplar a otros equipos) durante los relevos.'),

  -- Carrera de submarinos (77f087e8-4dab-4a7b-a25d-9ca93292014d)
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', 'd9ebcd96-c9cf-444f-94fb-5569110a1b99', 'Desplazándose de manera fluida y adaptando el paso a la velocidad de la fila.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Evitando tropezar con el compañero de adelante coordinando el avance y retroceso del paso de la fila.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '0ba0d3c3-a50a-4a04-8981-601dc7746dd6', 'Adecuando su paso lateral o de giro según la longitud y ritmo que perciba físicamente en la fila.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '4946a6aa-4a9f-4e7b-89a3-cb5249db8257', 'Adecuando su paso lateral o de giro según la longitud y ritmo que perciba físicamente en la fila.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '52d9399a-4bf1-4010-a7ca-682b7d1c22a8', 'Manteniendo la postura en línea y el equilibrio dinámico a ciegas a pesar del cansancio muscular del avance.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '333453ab-e111-4f06-b0e3-a3e7f06b2439', 'Manteniendo la postura en línea y el equilibrio dinámico a ciegas a pesar del cansancio muscular del avance.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Detectando y sintiendo rápidamente las presiones en el hombro que le transmite el lobato de atrás.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Interpretando al instante el código de golpes táctiles para cambiar el rumbo del submarino.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '12686e7d-d6af-4c74-928d-c859d5b883d5', 'Colaborando con su patrulla en la definición de la clave de toques (ej: un toque avanzar, dos girar derecha).'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', 'e465926e-deed-4341-956f-047f56860e5e', 'Colaborando con su patrulla en la definición de la clave de toques (ej: un toque avanzar, dos girar derecha).'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Visualizando desde atrás (el orientador con ojos abiertos) la trayectoria y transmitiendo las órdenes anticipadamente para esquivar a los submarinos enemigos.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Visualizando desde atrás (el orientador con ojos abiertos) la trayectoria y transmitiendo las órdenes anticipadamente para esquivar a los submarinos enemigos.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Manteniendo las manos apoyadas en los hombros del compañero de adelante de forma continua.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Avanzando de forma disciplinada y atenta sin empujar o acelerar de forma desmedida que desarme el submarino.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando para acordar con sus pares la distribución de los puestos de la tripulación en el submarino.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando para acordar con sus pares la distribución de los puestos de la tripulación en el submarino.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Acatando la regla de no hablar durante el avance del submarino, forzando el uso exclusivo del código de toques.'),
  ('77f087e8-4dab-4a7b-a25d-9ca93292014d', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Acatando la regla de no hablar durante el avance del submarino, forzando el uso exclusivo del código de toques.'),

  -- Carrera de Elefantes (844d5d4b-743e-4ebc-a734-5e7210a3be75)
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Participando alegremente de la carrera lúdica en cadena con su seisena.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Desplazándose encorvado al compás de la fila sin soltar la mano de sus compañeros.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', '1427451e-b8b3-493b-8525-e53298381e07', 'Manteniendo el agarre manual de forma continua sin soltarse antes de cruzar la meta.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', '0765469b-caef-4457-9d6b-cb739c855402', 'Manteniendo el agarre manual de forma continua sin soltarse antes de cruzar la meta.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por sincronizar la marcha acelerada de su patrulla bajo una postura exigente.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por sincronizar la marcha acelerada de su patrulla bajo una postura exigente.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Integrándose a la fila de la seisena sin discriminar o rechazar el contacto físico del juego.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Caminando de forma atenta y prudente para evitar tropezar o pisar al lobato de adelante.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Conversando con su patrulla para acordar el orden de los integrantes según su altura física.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Conversando con su patrulla para acordar el orden de los integrantes según su altura física.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de regresar al punto de partida o penalizar el tiempo de carrera en caso de romperse la fila.'),
  ('844d5d4b-743e-4ebc-a734-5e7210a3be75', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de regresar al punto de partida o penalizar el tiempo de carrera en caso de romperse la fila.');

-- 3. Actualizar el campo metadata (JSONB) de cada uno de los 11 artículos con la estructura corregida y coherente

-- Conejos y Guaridas
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Este juego dinámico al aire libre desafía a los participantes a correr, esquivar y cambiar de posición de forma rápida (Corporalidad) para encontrar refugio (\"guarida\"). Del mismo modo, fomenta la integración de los participantes mediante reglas sencillas que promueven el respeto mutuo, el cuidado de la integridad física de sus compañeros y la aceptación alegre de las normas del juego (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Corriendo rápidamente para ubicarse dentro de las guaridas respetando los límites fijados por la jefatura."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Corriendo rápidamente para ubicarse dentro de las guaridas respetando los límites fijados por la jefatura."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por reaccionar con agilidad y velocidad ante la señal del cambio de guaridas."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por reaccionar con agilidad y velocidad ante la señal del cambio de guaridas."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Demostrando agilidad física e intensidad cardiovascular en las fases consecutivas de persecución."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando para acordar con su pareja de guarida la mejor forma de recibir o guiar a los lobos/conejos que buscan refugio."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando para acordar con su pareja de guarida la mejor forma de recibir o guiar a los lobos/conejos que buscan refugio."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de no retener o empujar físicamente a otros competidores para dejarlos fuera de las posiciones."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de no retener o empujar físicamente a otros competidores para dejarlos fuera de las posiciones."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Asumiendo los fallos de los dirigentes sobre quién logró ingresar a una guarida en caso de empates simultáneos."}
  ]
}'::jsonb
WHERE id = '7bc4e56d-8f9d-4dc7-8e2e-3eeeabb80124';

-- Proteger al huevo
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de diseño e ingeniería básica reta a los participantes a aplicar sus destrezas manuales para construir una estructura amortiguadora estable utilizando materiales cotidianos simples (Creatividad). Del mismo modo, promueve la distribución equitativa de roles y el cumplimiento responsable de las tareas y compromisos grupales acordados en el equipo para lograr el éxito común del proyecto (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "103661fc-3396-4eac-9182-58b7e54d5115", "area": "Creatividad", "texto": "Perfecciono mis habilidades manuales.", "unidad": "Compañía", "como_se_cumple": "Ensamblando con cuidado las bombillas, papeles y cintas para armar el escudo protector del huevo."},
    {"id": "11320fb6-98de-4725-825d-db858e3bffa2", "area": "Creatividad", "texto": "Perfecciono mis habilidades manuales.", "unidad": "Tropa", "como_se_cumple": "Ensamblando con cuidado las bombillas, papeles y cintas para armar el escudo protector del huevo."},
    {"id": "0f60be94-6de3-4c34-a6ff-5b5018f0b156", "area": "Creatividad", "texto": "Coopero en la mantención y renovación del local y materiales de mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Cuidando y optimizando el uso de los materiales asignados para evitar el desperdicio durante la construcción."},
    {"id": "fd3d3e14-e92b-4ab5-8298-9018c6e70b20", "area": "Creatividad", "texto": "Coopero en la mantención y renovación del local y materiales de mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Cuidando y optimizando el uso de los materiales asignados para evitar el desperdicio durante la construcción."},
    {"id": "843fda9c-6c4a-4516-b30c-23c92ef755a8", "area": "Creatividad", "texto": "Puedo resolver la mayoría de los problemas técnicos domésticos simples.", "unidad": "Avanzada", "como_se_cumple": "Ideando soluciones físicas de amortiguación frente al impacto de la gravedad usando la creatividad práctica."},
    {"id": "29eee8b1-a414-4df9-90e1-520a384fb9aa", "area": "Creatividad", "texto": "Uno los conocimientos teórico y práctico mediante la aplicación constante de mis habilidades técnicas y manuales.", "unidad": "Clan", "como_se_cumple": "Integrando conocimientos físicos sobre impacto y resistencia de materiales en el diseño estructural final."},
    {"id": "9478b46f-6f74-4a7e-bf9c-d66caaba1381", "area": "Sociabilidad", "texto": "Cumplo los compromisos que asumo.", "unidad": "Compañía", "como_se_cumple": "Asumiendo con responsabilidad la tarea específica asignada por la patrulla (medición, corte o ensamblado)."},
    {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "texto": "Cumplo los compromisos que asumo.", "unidad": "Tropa", "como_se_cumple": "Asumiendo con responsabilidad la tarea específica asignada por la patrulla (medición, corte o ensamblado)."},
    {"id": "8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Compañía", "como_se_cumple": "Apoyando activamente la ejecución del diseño acordado colectivamente, respetando el consenso general."},
    {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Tropa", "como_se_cumple": "Apoyando activamente la ejecución del diseño acordado colectivamente, respetando el consenso general."},
    {"id": "5abfbe81-75e4-4444-b52d-38e59e8b6ec7", "area": "Sociabilidad", "texto": "Estoy siempre disponible para ayudar a los demás, incluso cuando se trata de tareas pesadas o poco agradables.", "unidad": "Avanzada", "como_se_cumple": "Colaborando con la posterior limpieza y recolección de los residuos de huevos rotos sin quejas ni protestas."},
    {"id": "b5a81328-5c07-41bd-a1ea-1ed401762841", "area": "Sociabilidad", "texto": "Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo mis obligaciones y defendiendo igual derecho para los demás.", "unidad": "Clan", "como_se_cumple": "Asegurando que todos los miembros del Clan expongan libremente sus ideas de diseño antes de iniciar la construcción."}
  ]
}'::jsonb
WHERE id = '4f0ec9d9-8b81-47d6-9e0d-003572c0fe58';

-- Los Inversionistas
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa", "avanzada", "clan"],
  "areas": ["caracter", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de juego democrático y toma de decisiones reta a los participantes a actuar según sus convicciones personales (Carácter) al distribuir de manera honesta y meditada sus votos o capital de inversión. Asimismo, promueve la comprensión práctica de los mecanismos de votación grupal, el respeto a la voluntad mayoritaria y la evaluación crítica y constructiva de las reglas de debate de la comunidad (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "baa365a9-087c-4c25-b0ad-57893df5ff74", "area": "Carácter", "texto": "Sé lo que significa decir la verdad.", "unidad": "Manada", "como_se_cumple": "Invirtiendo honestamente sus fichas en las opciones que realmente prefiere y no por presión de sus compañeros."},
    {"id": "506b7596-cac4-48e0-88c7-942d575172db", "area": "Carácter", "texto": "Digo la verdad, aunque a veces no me gusten las consecuencias.", "unidad": "Manada", "como_se_cumple": "Defendiendo ante la seisena la votación efectuada a pesar de que su propuesta resulte minoritaria."},
    {"id": "2845964c-1778-4ed7-8284-c5d830ea0a0d", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo misma y con las demás personas.", "unidad": "Compañía", "como_se_cumple": "Manteniendo sus convicciones individuales frente a las propuestas que se exponen a votación."},
    {"id": "f77525b1-07a3-4188-9051-4d3ba86aadfc", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.", "unidad": "Tropa", "como_se_cumple": "Manteniendo sus convicciones individuales frente a las propuestas que se exponen a votación."},
    {"id": "c4fe900a-9641-4cad-a265-3f31073d83cb", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Compañía", "como_se_cumple": "Exponiendo razones lógicas que fundamentan por qué invirtió su capital en determinada propuesta."},
    {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Tropa", "como_se_cumple": "Exponiendo razones lógicas que fundamentan por qué invirtió su capital en determinada propuesta."},
    {"id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba", "area": "Carácter", "texto": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.", "unidad": "Avanzada", "como_se_cumple": "Evaluando el impacto comunitario y la coherencia ética de las propuestas de inversión antes de asignar su dinero ficticio."},
    {"id": "770a8ff3-7bb8-45dd-b114-5ae1069eff62", "area": "Carácter", "texto": "Actúo consecuentemente con los valores que me inspiran.", "unidad": "Clan", "como_se_cumple": "Tomando decisiones de inversión orientadas al bien común del Clan, asumiendo con coherencia sus posturas en la plenaria."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Aceptando el método democrático de distribución y las normas de mercado del juego."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando la decisión mayoritaria que resulta de la sumatoria de las inversiones de la Manada."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Proponiendo ideas o mejoras a las propuestas para captar el capital e interés de sus compañeras."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Proponiendo ideas o mejoras a las propuestas para captar el capital e interés de sus compañeros."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Debatiendo con asertividad sobre los límites de inversión impuestos a cada participante para garantizar equidad."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Debatiendo con asertividad sobre los límites de inversión impuestos a cada participante para garantizar equidad."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Aportando ideas constructivas para regular la especulación económica ficticia del juego en la asamblea de Avanzada."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Fiscalizando de forma responsable que las votaciones e inversiones se ajusten al marco ético convenido en el Clan."}
  ]
}'::jsonb
WHERE id = 'bddb6314-6411-404b-9107-40c9da299291';

-- Juicio en la corte
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa", "avanzada", "clan"],
  "areas": ["caracter", "creatividad", "sociabilidad"],
  "justificacion_areas": "Esta simulación judicial promueve el sentido de justicia, la honestidad intelectual y la aserción de principios éticos personales (Carácter) al defender o juzgar una causa. Estimula la expresión lingüística y la capacidad argumentativa y actoral (Creatividad) al asumir diferentes roles (abogado, fiscal, jurado). Fomenta además el conocimiento de las leyes de convivencia democrática, las normas procesales y el valor del diálogo respetuoso ante visiones divergentes (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "baa365a9-087c-4c25-b0ad-57893df5ff74", "area": "Carácter", "texto": "Sé lo que significa decir la verdad.", "unidad": "Manada", "como_se_cumple": "Aportando testimonios honestos en su rol asignado, distinguiendo la verdad de los supuestos presentados."},
    {"id": "506b7596-cac4-48e0-88c7-942d575172db", "area": "Carácter", "texto": "Digo la verdad, aunque a veces no me gusten las consecuencias.", "unidad": "Manada", "como_se_cumple": "Asumiendo con franqueza la culpabilidad o responsabilidad de sus actos simulados si se le encuentra culpable."},
    {"id": "2845964c-1778-4ed7-8284-c5d830ea0a0d", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo misma y con las demás personas.", "unidad": "Compañía", "como_se_cumple": "Evitando falsear datos u opiniones éticas personales al estructurar los testimonios de la defensa."},
    {"id": "f77525b1-07a3-4188-9051-4d3ba86aadfc", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.", "unidad": "Tropa", "como_se_cumple": "Evitando falsear datos u opiniones éticas personales al estructurar los testimonios de la defensa."},
    {"id": "c4fe900a-9641-4cad-a265-3f31073d83cb", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Compañía", "como_se_cumple": "Debatiendo con solidez ética para fundamentar sus alegatos procesales en coherencia con sus valores."},
    {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Tropa", "como_se_cumple": "Debatiendo con solidez ética para fundamentar sus alegatos procesales en coherencia con sus valores."},
    {"id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba", "area": "Carácter", "texto": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.", "unidad": "Avanzada", "como_se_cumple": "Evaluando el veredicto basándose en la justicia y equidad, por encima de las simpatías personales del grupo de Avanzada."},
    {"id": "770a8ff3-7bb8-45dd-b114-5ae1069eff62", "area": "Carácter", "texto": "Actúo consecuentemente con los valores que me inspiran.", "unidad": "Clan", "como_se_cumple": "Deliberando como juez o jurado de manera responsable, demostrando madurez y solidez ética en el juicio final."},
    {"id": "52b5580a-7d0f-454f-b2ae-0d3318129165", "area": "Creatividad", "texto": "Canto, bailo y preparo actuaciones con mis amigos de la Manada.", "unidad": "Manada", "como_se_cumple": "Interpretando su personaje (acusado, testigo) de manera dramática y lúdica en la recreación."},
    {"id": "14b82459-ac31-4496-a875-8e9bd5666030", "area": "Creatividad", "texto": "En las actividades que hago se nota lo que pienso y siento.", "unidad": "Manada", "como_se_cumple": "Gesticulando y modulando la voz al presentar sus argumentos para captar la atención de la asamblea."},
    {"id": "d581cfa7-db1f-4b08-b4d3-525b23e418ea", "area": "Creatividad", "texto": "Participo con entusiasmo en las actividades artísticas de mi Compañía.", "unidad": "Compañía", "como_se_cumple": "Participando de la simulación teatral del juicio con energía y creatividad narrativa."},
    {"id": "39eaf1aa-f703-4fd0-a4b3-b9756dc30539", "area": "Creatividad", "texto": "Participo con entusiasmo en las actividades artísticas de mi Tropa.", "unidad": "Tropa", "como_se_cumple": "Participando de la simulación teatral del juicio con energía y creatividad narrativa."},
    {"id": "9758e4f9-728b-4435-a8a3-11fd36c5e3be", "area": "Creatividad", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "unidad": "Compañía", "como_se_cumple": "Estructurando discursos de apertura y alegatos convincentes mediante una retórica cuidada."},
    {"id": "6e910d1c-7021-49a5-9ece-637f480a1ec7", "area": "Creatividad", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "unidad": "Tropa", "como_se_cumple": "Estructurando discursos de apertura y alegatos convincentes mediante una retórica cuidada."},
    {"id": "ed17d59c-1c64-4080-a206-bbe72eeae5a4", "area": "Creatividad", "texto": "Trato de expresarme de un modo propio, y soy capaz de mirar críticamente tendencias e ídolos sociales.", "unidad": "Avanzada", "como_se_cumple": "Formulando contrapreguntas agudas y análisis críticos del caso judicial presentado."},
    {"id": "91e60eba-e267-4d1a-b27b-ef61a7b03b31", "area": "Creatividad", "texto": "Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.", "unidad": "Clan", "como_se_cumple": "Moderando el debate judicial para que resulte instructivo, fluido y respetuoso de las formalidades orales."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Acatando las llamadas al orden del juez y guardando silencio cuando expone el equipo contrario."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando la formalidad procesal (pedir la palabra, levantarse para hablar) acordada en la corte."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Participando en el debate grupal interno de la fiscalía o defensa para redactar la acusación."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Participando en el debate grupal interno de la fiscalía o defensa para redactar la acusación."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Cuestionando con argumentos procesales válidos las objeciones que presente la contraparte."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Cuestionando con argumentos procesales válidos las objeciones que presente la contraparte."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Proponiendo reformas al reglamento judicial de la corte si se constatan injusticias de base en la simulación."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Garantizando que todo el proceso judicial de la corte se desenvuelva bajo el marco de los derechos humanos y la justicia democrática."}
  ]
}'::jsonb
WHERE id = 'e999778b-cc5a-4c53-bbe7-815a64237a11';

-- Completa la oración
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa", "avanzada", "clan"],
  "areas": ["creatividad", "sociabilidad"],
  "justificacion_areas": "Este juego de relevos combina la carrera física con la comprensión lectora y la redacción de mensajes grupales clave, requiriendo de los participantes la estructuración lógica de enunciados escritos para completar el pasaje conceptual (Creatividad). Asimismo, demanda una coordinación grupal y el cumplimiento del reglamento de carrera y relevos (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "52b5580a-7d0f-454f-b2ae-0d3318129165", "area": "Creatividad", "texto": "Canto, bailo y preparo actuaciones con mis amigos de la Manada.", "unidad": "Manada", "como_se_cumple": "Formando parte del juego expresivo grupal para armar frases divertidas de la Manada."},
    {"id": "14b82459-ac31-4496-a875-8e9bd5666030", "area": "Creatividad", "texto": "En las actividades que hago se nota lo que pienso y siento.", "unidad": "Manada", "como_se_cumple": "Completando las oraciones con palabras que reflejen el sentido del mensaje scout y sus sentimientos."},
    {"id": "d581cfa7-db1f-4b08-b4d3-525b23e418ea", "area": "Creatividad", "texto": "Participo con entusiasmo en las actividades artísticas de mi Compañía.", "unidad": "Compañía", "como_se_cumple": "Colaborando activamente en el descifrado creativo y colocación de los fragmentos de la oración."},
    {"id": "39eaf1aa-f703-4fd0-a4b3-b9756dc30539", "area": "Creatividad", "texto": "Participo con entusiasmo en las actividades artísticas de mi Tropa.", "unidad": "Tropa", "como_se_cumple": "Colaborando activamente en el descifrado creativo y colocación de los fragmentos de la oración."},
    {"id": "9758e4f9-728b-4435-a8a3-11fd36c5e3be", "area": "Creatividad", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "unidad": "Compañía", "como_se_cumple": "Utilizando el lenguaje escrito y la redacción para dar coherencia semántica a los enunciados incompletos."},
    {"id": "6e910d1c-7021-49a5-9ece-637f480a1ec7", "area": "Creatividad", "texto": "Expreso por distintos medios mis intereses y aptitudes artísticas.", "unidad": "Tropa", "como_se_cumple": "Utilizando el lenguaje escrito y la redacción para dar coherencia semántica a los enunciados incompletos."},
    {"id": "ed17d59c-1c64-4080-a206-bbe72eeae5a4", "area": "Creatividad", "texto": "Trato de expresarme de un modo propio, y soy capaz de mirar críticamente tendencias e ídolos sociales.", "unidad": "Avanzada", "como_se_cumple": "Analizando la semántica y los mensajes del texto de fondo para aportar ideas originales en la resolución del desafío lingüístico."},
    {"id": "91e60eba-e267-4d1a-b27b-ef61a7b03b31", "area": "Creatividad", "texto": "Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.", "unidad": "Clan", "como_se_cumple": "Estructurando el repaso final del texto en plenaria para que resulte motivador y educativo para toda la unidad."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Respetando la señal de partida y el orden de la fila sin adelantarse a sus compañeros."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Colaborando cordialmente al realizar el relevo físico con los compañeros de su seisena."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando para definir de qué forma se organizará la patrulla para descifrar las oraciones en menos tiempo."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando para definir de qué forma se organizará la patrulla para descifrar las oraciones en menos tiempo."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de no ayudar ni soplar palabras a los corredores que están en la pista."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de no ayudar ni soplar palabras a los corredores que están en la pista."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Acatando la anulación de palabras si se constata que se cometió alguna falta de largada."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Promoviendo que la dinámica de carrera y completación de textos mantenga siempre las reglas de juego limpio acordadas."}
  ]
}'::jsonb
WHERE id = '6bfd977f-b0d8-4f57-b2c2-e4a5a335ac81';

-- El Epitafio
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["avanzada", "clan"],
  "areas": ["creatividad", "espiritualidad"],
  "justificacion_areas": "Esta dinámica de introspección profunda desafía a los participantes a sintetizar y plasmar de forma creativa y simbólica mediante la palabra escrita sus pensamientos y emociones con respecto al legado de sus vidas (Creatividad). Asimismo, fomenta la reflexión sobre el sentido de su propia existencia, orientando sus decisiones y conductas diarias hacia metas y principios trascendentes de vida (Espiritualidad).",
  "objetivos_educativos": [
    {"id": "ed17d59c-1c64-4080-a206-bbe72eeae5a4", "area": "Creatividad", "texto": "Trato de expresarme de un modo propio, y soy capaz de mirar críticamente tendencias e ídolos sociales.", "unidad": "Avanzada", "como_se_cumple": "Escribiendo un epitafio auténtico y original que refleje sus verdaderos anhelos personales al margen de modas o presiones de la sociedad."},
    {"id": "91e60eba-e267-4d1a-b27b-ef61a7b03b31", "area": "Creatividad", "texto": "Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.", "unidad": "Clan", "como_se_cumple": "Compartiendo voluntariamente la lectura de su epitafio con su equipo en un clima de respeto y profunda empatía."},
    {"id": "57a9f554-a5ba-48bc-913b-47e187d1513c", "area": "Espiritualidad", "texto": "Trato que mi vida refleje aquello en que creo.", "unidad": "Avanzada", "como_se_cumple": "Reflexionando sobre si sus acciones y comportamiento diario son coherentes con las convicciones que desea legar."},
    {"id": "ed57439e-1d13-4cb2-ae32-ddd3978d33bd", "area": "Espiritualidad", "texto": "Integro mis principios religiosos a mi conducta cotidiana, estableciendo coherencia entre mi fe, mi vida personal y mi participación social.", "unidad": "Clan", "como_se_cumple": "Proyectando su proyecto de vida hacia trascendencia y servicio, identificando qué huella desea marcar en su comunidad."}
  ]
}'::jsonb
WHERE id = '18ae9052-19bf-48ca-89a3-c34f0081e7ca';

-- ¿Que animal me gustaría ser?
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["avanzada", "clan"],
  "areas": ["afectividad", "caracter"],
  "justificacion_areas": "Esta dinámica de introspección profunda promueve el autoconocimiento y la madurez emocional (Afectividad) al invitar a los participantes a identificar y verbalizar sus propios sentimientos, emociones y temores a través de la metáfora del animal elegido. Al mismo tiempo, les permite definir sus metas, fortalezas y debilidades personales, ayudando a proyectar y estructurar sus valores y su proyecto de vida (Carácter).",
  "objetivos_educativos": [
    {"id": "81298790-d245-48c6-8b1b-266b218c69da", "area": "Afectividad", "texto": "Me esfuerzo por encontrar mi identidad personal.", "unidad": "Avanzada", "como_se_cumple": "Analizando qué rasgos de su personalidad se asimilan a las características del animal que le gustaría representar."},
    {"id": "07d61bf7-36fc-40f6-8f8e-21fe97b169f0", "area": "Afectividad", "texto": "Logro y mantengo un estado interior de libertad, equilibrio y madurez emocional.", "unidad": "Clan", "como_se_cumple": "Expresando con madurez y sin timidez sus emociones profundas y temores personales en un clima grupal seguro."},
    {"id": "a8d2d3fc-63a7-41ed-9029-9d65b6badba1", "area": "Carácter", "texto": "Opto por valores personales para mi vida.", "unidad": "Avanzada", "como_se_cumple": "Estableciendo qué cualidades y valores (fuerza, constancia, libertad, astucia) del animal desea incorporar a su conducta personal."},
    {"id": "0bdf2252-6db5-41f9-8bc7-87e4da3ee602", "area": "Carácter", "texto": "Construyo mi proyecto de vida en base a los valores de la Ley y la Promesa.", "unidad": "Clan", "como_se_cumple": "Proyectando su vocación de servicio y el sentido de su proyecto personal asociándolo con las características protectoras o cooperativas del animal elegido."}
  ]
}'::jsonb
WHERE id = '82610966-74e3-40cc-a789-6ec6b32af1a2';

-- Carrera de Tres Pies
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica física requiere una excelente coordinación de movimientos, balance y sincronización motriz gruesa con su pareja (Corporalidad) al correr con una pierna amarrada a la del compañero. Promueve el trabajo en equipo y el cumplimiento estricto de las normas lúdicas y de seguridad para evitar caídas y desvíos (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "texto": "Me gusta practicar deportes.", "unidad": "Manada", "como_se_cumple": "Participando activamente de la carrera lúdica con su compañero de seisena."},
    {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "texto": "Practico deportes, conozco sus reglas y sé perder.", "unidad": "Manada", "como_se_cumple": "Corriendo al ritmo de su compañero y aceptando el resultado competitivo de forma lúdica."},
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Sincronizando el paso con su pareja sin soltarse ni adelantarse antes de la largada."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Sincronizando el paso con su pareja sin soltarse ni adelantarse antes de la largada."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por coordinar y perfeccionar el paso lateral acelerado para maximizar el desempeño de la patrulla."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por coordinar y perfeccionar el paso lateral acelerado para maximizar el desempeño de la patrulla."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Acatando las amarras de pañolín y manteniendo una conducta de cuidado mutuo durante la carrera."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Manteniendo su carril de carrera sin cruzarse en el camino de las otras parejas para evitar accidentes."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Acordando con su compañera verbalmente la señal o palabra clave (\"uno, dos...\") para avanzar en sincronía."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Acordando con su compañero verbalmente la señal o palabra clave (\"uno, dos...\") para avanzar en sincronía."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de comenzar nuevamente en el punto de partida en caso de desatarse la amarra."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de comenzar nuevamente en el punto de partida en caso de desatarse la amarra."}
  ]
}'::jsonb
WHERE id = '7787150d-690f-49f3-8ec0-5bd876690f09';

-- Relevos Ciegos
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa", "avanzada"],
  "areas": ["corporalidad", "creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de relevos ciegos exige del corredor no vidente el control y equilibrio espacial de su cuerpo (Corporalidad) al desplazarse de forma segura sin visión. Asimismo, desafía a los orientadores del equipo a inventar y afinar de forma rápida instrucciones verbales eficaces para guiar al corredor sorteando el ruido y el caos (Creatividad), respetando de forma estricta las reglas del juego y el cuidado de la seguridad del compañero (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a tener un cuerpo cada vez más fuerte, ágil, veloz y flexible.", "unidad": "Manada", "como_se_cumple": "Desplazándose con agilidad y soltura a pesar de no contar con la referencia visual directa."},
    {"id": "626a313e-0407-4cfd-b714-c6aa6e51738c", "area": "Corporalidad", "texto": "Manejo cada vez mejor mis brazos, piernas, manos y pies.", "unidad": "Manada", "como_se_cumple": "Coordinando el paso y la zancada de manera segura al pisar sobre el terreno de juego."},
    {"id": "0ba0d3c3-a50a-4a04-8981-601dc7746dd6", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Compañía", "como_se_cumple": "Midiendo la velocidad y longitud del paso según su percepción de estabilidad física y el terreno."},
    {"id": "4946a6aa-4a9f-4e7b-89a3-cb5249db8257", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Tropa", "como_se_cumple": "Midiendo la velocidad y longitud del paso según su percepción de estabilidad física y el terreno."},
    {"id": "52d9399a-4bf1-4010-a7ca-682b7d1c22a8", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por mantener el equilibrio corporal dinámico al desplazarse a ciegas guiado por la voz."},
    {"id": "333453ab-e111-4f06-b0e3-a3e7f06b2439", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por mantener el equilibrio corporal dinámico al desplazarse a ciegas guiado por la voz."},
    {"id": "e876d520-d14d-44f3-8baf-bf698dc08dac", "area": "Corporalidad", "texto": "Acepto mi imagen corporal.", "unidad": "Avanzada", "como_se_cumple": "Aceptando su complexión y posibilidades motrices durante la carrera a ciegas en un marco de confianza comunitaria."},
    {"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "texto": "Me gusta participar en juegos de observación.", "unidad": "Manada", "como_se_cumple": "Escuchando atentamente los sonidos específicos de guía que emiten sus compañeros de seisena."},
    {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "unidad": "Manada", "como_se_cumple": "Resolviendo con rapidez mental la trayectoria a seguir ante instrucciones confusas del exterior."},
    {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Colaborando en el acuerdo de patrulla para definir los comandos de guiado (ej: \"izquierda\", \"alto\")."},
    {"id": "e465926e-deed-4341-956f-047f56860e5e", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Colaborando en el acuerdo de patrulla para definir los comandos de guiado (ej: \"izquierda\", \"alto\")."},
    {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Compañía", "como_se_cumple": "Anticipando la posición de los rivales y de los obstáculos para guiar al compañero vendado de manera inteligente."},
    {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Tropa", "como_se_cumple": "Anticipando la posición de los rivales y de los obstáculos para guiar al compañero vendado de manera inteligente."},
    {"id": "310eb631-8ca9-4eaf-ac80-232a5150d024", "area": "Creatividad", "texto": "Creo actividades y juegos para realizar con mi comunidad y soy capaz de motivarlos.", "unidad": "Avanzada", "como_se_cumple": "Ideando variaciones complejas de guiado (códigos de palmas o silbatos) para hacer más retadora la dinámica."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Manteniendo la venda puesta y sin tocarla o reajustarla durante su turno de carrera."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando la directriz de seguridad de avanzar sólo con pasos firmes para no chocar intencionalmente con otros corredores."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando asertivamente para definir qué corredor saldrá en cada turno del relevo."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando asertivamente para definir qué corredor saldrá en cada turno del relevo."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando las indicaciones de seguridad física fijadas por los dirigentes antes de iniciar la carrera de relevos."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando las indicaciones de seguridad física fijadas por los dirigentes antes de iniciar la carrera de relevos."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Colaborando de manera honesta y velando por el cumplimiento estricto del fair play (no soplar a otros equipos) durante los relevos."}
  ]
}'::jsonb
WHERE id = '6a2b2b30-c8f4-44d1-a766-b02bdd725658';

-- Carrera de submarinos
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de navegación táctica requiere de control físico y equilibrio coordinado (Corporalidad) al avanzar en fila a ciegas. Demanda de los participantes el diseño y ejecución rápida de un código táctico silencioso de golpes en el hombro para indicar direcciones (Creatividad), y exige disciplina, confianza mutua y respeto estricto de las señales tácticas para evitar accidentes en la fila (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a tener un cuerpo cada vez más fuerte, ágil, veloz y flexible.", "unidad": "Manada", "como_se_cumple": "Desplazándose de manera fluida y adaptando el paso a la velocidad de la fila."},
    {"id": "626a313e-0407-4cfd-b714-c6aa6e51738c", "area": "Corporalidad", "texto": "Evitando tropezar con el compañero de adelante coordinando el avance y retroceso del paso de la fila.", "unidad": "Manada", "como_se_cumple": "Evitando tropezar con el compañero de adelante coordinando el avance y retroceso del paso de la fila."},
    {"id": "0ba0d3c3-a50a-4a04-8981-601dc7746dd6", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Compañía", "como_se_cumple": "Adecuando su paso lateral o de giro según la longitud y ritmo que perciba físicamente en la fila."},
    {"id": "4946a6aa-4a9f-4e7b-89a3-cb5249db8257", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Tropa", "como_se_cumple": "Adecuando su paso lateral o de giro según la longitud y ritmo que perciba físicamente en la fila."},
    {"id": "52d9399a-4bf1-4010-a7ca-682b7d1c22a8", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Compañía", "como_se_cumple": "Manteniendo la postura en línea y el equilibrio dinámico a ciegas a pesar del cansancio muscular del avance."},
    {"id": "333453ab-e111-4f06-b0e3-a3e7f06b2439", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Tropa", "como_se_cumple": "Manteniendo la postura en línea y el equilibrio dinámico a ciegas a pesar del cansancio muscular del avance."},
    {"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "texto": "Me gusta participar en juegos de observación.", "unidad": "Manada", "como_se_cumple": "Detectando y sintiendo rápidamente las presiones en el hombro que le transmite el lobato de atrás."},
    {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "unidad": "Manada", "como_se_cumple": "Interpretando al instante el código de golpes táctiles para cambiar el rumbo del submarino."},
    {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Colaborando con su patrulla en la definición de la clave de toques (ej: un toque avanzar, dos girar derecha)."},
    {"id": "e465926e-deed-4341-956f-047f56860e5e", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Colaborando con su patrulla en la definición de la clave de toques (ej: un toque avanzar, dos girar derecha)."},
    {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Compañía", "como_se_cumple": "Visualizando desde atrás (el orientador con ojos abiertos) la trayectoria y transmitiendo las órdenes anticipadamente para esquivar a los submarinos enemigos."},
    {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Tropa", "como_se_cumple": "Visualizando desde atrás (el orientador con ojos abiertos) la trayectoria y transmitiendo las órdenes anticipadamente para esquivar a los submarinos enemigos."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Manteniendo las manos apoyadas en los hombros del compañero de adelante de forma continua."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Avanzando de forma disciplinada y atenta sin empujar o acelerar de forma desmedida que desarme el submarino."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando para acordar con sus pares la distribución de los puestos de la tripulación en el submarino."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando para acordar con sus pares la distribución de los puestos de la tripulación en el submarino."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Acatando la regla de no hablar durante el avance del submarino, forzando el uso exclusivo del código de toques."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Acatando la regla de no hablar durante el avance del submarino, forzando el uso exclusivo del código de toques."}
  ]
}'::jsonb
WHERE id = '77f087e8-4dab-4a7b-a25d-9ca93292014d';

-- Carrera de Elefantes
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de carrera de relevos en cadena requiere flexibilidad, resistencia física e integración motora (Corporalidad) al avanzar encorvados sosteniendo la mano del compañero de adelante por entre las piernas. Fomenta la diversión grupal cooperativa, el respeto al ritmo de marcha del compañero y el cumplimiento riguroso de las reglas lúdicas y de seguridad para no lastimar a los pares (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "texto": "Me gusta practicar deportes.", "unidad": "Manada", "como_se_cumple": "Participando alegremente de la carrera lúdica en cadena con su seisena."},
    {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "texto": "Practico deportes, conozco sus reglas y sé perder.", "unidad": "Manada", "como_se_cumple": "Desplazándose encorvado al compás de la fila sin soltar la mano de sus compañeros."},
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Manteniendo el agarre manual de forma continua sin soltarse antes de cruzar la meta."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Manteniendo el agarre manual de forma continua sin soltarse antes de cruzar la meta."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por sincronizar la marcha acelerada de su patrulla bajo una postura exigente."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por sincronizar la marcha acelerada de su patrulla bajo una postura exigente."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Integrándose a la fila de la seisena sin discriminar o rechazar el contacto físico del juego."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Caminando de forma atenta y prudente para evitar tropezar o pisar al lobato de adelante."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Conversando con su patrulla para acordar el orden de los integrantes según su altura física."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Conversando con su patrulla para acordar el orden de los integrantes según su altura física."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de regresar al punto de partida o penalizar el tiempo de carrera en caso de romperse la fila."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de regresar al punto de partida o penalizar el tiempo de carrera en caso de romperse la fila."}
  ]
}'::jsonb
WHERE id = '844d5d4b-743e-4ebc-a734-5e7210a3be75';
