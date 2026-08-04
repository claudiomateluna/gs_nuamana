SET client_encoding = 'UTF8';
BEGIN;
DELETE FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';

INSERT INTO articulos (
  autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at
)
VALUES (
  NULL,
  NULL,
  'Alicia en el País de las Maravillas',
  'alicia-en-el-pais-de-las-maravillas',
  'Juego nocturno campestre de acecho y probabilidades donde las patrullas desafían a los Soldados Naipes de la Reina de Corazones para capturar el As Maestro.',
  '<h2>📜 Descripción y Ambientación del Juego</h2><p><strong>Alicia en el País de las Maravillas</strong> es un apasionante juego nocturno de acecho, estrategia y cálculo de probabilidades al aire libre ambientado en la mítica obra de Lewis Carroll.</p><p>La historia cuenta que los exploradores se han adentrado a través de la madriguera del conejo hacia el fantástico Reino de la Reina de Corazones. Para atravesar el Laberinto del Bosque y llegar hasta el Castillo Real, cada patrulla debe esquivar la vigilancia de los implacables Soldados Naipes y enfrentarse a ellos en duelos de cartas numeradas para arrebatarle el legendario As Maestro de Corazones a la Reina.</p><h2>🎲 ¿Cómo se juega? Paso a Paso Detallado</h2><ol><li><strong>Distribución del Campo y Posición de los Soldados Naipes:</strong><ul><li>Se delimita un sector de bosque o parque con abundante vegetación. 5 dirigentes o competidores se caracterizan como <em>Soldados Naipes de la Reina</em> y se ocultan dispersos en el terreno provistos de una linterna cada uno.</li><li>Los cuatro primeros soldados se distribuyen en forma escalonada en el camino, mientras que el <strong>Quinto Guardián (La Reina de Corazones / Custodia del As Maestro)</strong> se posiciona en el punto más alejado del campo.</li></ul></li><li><strong>Mazo de Vidas y Jerarquía de las Cartas:</strong><ul><li>Los equipos se ubican en la Línea de Salida (La Madriguera). Cada participante recibe <strong>3 cartas que representan sus vidas</strong>: 1 Carta Alta y 2 Cartas Bajas.</li><li><strong>Escala de Cartas:</strong><ul><li><strong>Cartas Altas:</strong> 10, J, Q, K, As.</li><li><strong>Cartas Medias:</strong> 6, 7, 8, 9.</li><li><strong>Cartas Bajas:</strong> 2, 3, 4, 5.</li></ul></li><li>Los Soldados Naipes poseen mazos de cartas asignados estratégicamente, mientras que la Reina posee 6 cartas compuestas por cartas altas y el <strong>As Maestro de Corazones</strong>.</li></ul></li><li><strong>Incursión de Acecho e Infiltración Nocturna:</strong><ul><li>Cada 3 minutos, el primer integrante de cada patrulla inicia su avance por el bosque a oscuras, intentando avanzar en sigilo sin ser iluminado por las linternas de los Soldados Naipes.</li></ul></li><li><strong>Duelo de Cartas en Caso de Avistamiento:</strong><ul><li>Si un soldado enfoca con su linterna a un jugador, exclama <em>«¡Duelo de Naipes!»</em>. El avance se detiene inmediatamente y ambos realizan el enfrentamiento:<ul><li>Cada uno roba a ciegas una carta de la mano del rival y ambas se muestran al mismo tiempo.</li><li><strong>Si la carta del Soldado es mayor o igual a la del participante:</strong> El scout pierde la carta extraída (una vida), regresa a la Madriguera y espera su siguiente turno para reiniciar el avance.</li><li><strong>Si la carta del Participante es mayor a la del Soldado:</strong> El scout vence al soldado, conserva sus cartas y obtiene el paso libre hacia el siguiente nivel.</li></ul></li></ul></li><li><strong>El Gran Duelo Final en el Castillo de Corazones:</strong><ul><li>El objetivo máximo es alcanzar el Castillo de la Reina de Corazones sin perder todas las vidas y batirse en el <strong>Duelo Supremo</strong> extrayendo una carta de su mazo especial de 6 cartas.</li></ul></li></ol><h2>🏆 Cómputo de Puntos y Condición de Victoria</h2><p><strong>¿Cómo se gana el juego?</strong> El primer participante que logre vencer a la Reina de Corazones extrayendo el <strong>As Maestro</strong> en el duelo final se proclama Vencedor Supremo y otorga la victoria definitiva a su patrulla.</p><p>En caso de que el tiempo límite (60 minutos) concluya sin que ningún jugador extraiga el As Maestro, la victoria se define por puntaje acumulado (10 pts por soldado vencido, 5 pts por carta conservada y 10 pts bonus de fair play).</p>',
  '/uploads/alicia-en-el-pais-de-las-maravillas.webp',
  'publicado',
  '{"unidades": ["manada", "compañía", "tropa"], "duracion": "60 minutos", "cantidad": "16 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Cartas", "Linterna"], "areas": ["carácter", "sociabilidad", "creatividad"], "objetivos": ["Estrategia y planificación", "Estimular la agilidad mental", "Perder el miedo a la oscuridad", "Trabajo en equipo"], "justificacion_areas": "Esta actividad nocturna de gran escala ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Carácter:</b> Desarrolla la valentía, el autocontrol emocional y la serenidad al tomar decisiones de acecho bajo la oscuridad y aceptar con fair play el resultado de los duelos de cartas.\n\n2. <b>Sociabilidad:</b> Fortalece el trabajo cooperativo en equipo, el respeto por las reglas de arbitraje y la fraternidad scout al coordinar salidas estratégicas con los compañeros de patrulla.\n\n3. <b>Creatividad:</b> Estimula la agilidad mental, la evaluación de probabilidades y la astucia táctica al administrar las cartas de vidas y calcular los riesgos de cada enfrentamiento.", "variaciones": "<b>Modalidad en Salón (Interior):</b> Se puede realizar en un gimnasio o salón a oscuras utilizando obstáculos como la Mesa de Té del Sombrerero Loco. <b>Variante con pañolines:</b> Los soldados naipes pueden sujetar pañolines de colores para indicar el nivel de dificultad del duelo.", "recomendaciones": "<b>Seguridad en la Oscuridad:</b> Delimitar previamente el perímetro de juego eliminando baches o alambres. Exigir el uso correcto del pañolín scout y asegurar que los guardianes utilicen linternas con luz tenue enfocada hacia el suelo.", "objetivos_educativos": [{"id": "a2b1a0ea-f0f6-42c9-8048-3a3c54f264c3", "area": "Carácter", "unidad": "Manada", "texto": "He aprendido que en las cosas que hago con mis compañeros debo cumplir la Ley de la Manada.", "como_se_cumple": "Cumpliendo con lealtad la Ley de la Manada al entregar honestamente mis cartas al ser descubierto por el soldado naipe."}, {"id": "506b7596-cac4-48e0-88c7-942d575172db", "area": "Carácter", "unidad": "Manada", "texto": "Digo la verdad, aunque a veces no me gusten las consecuencias.", "como_se_cumple": "Diciendo siempre la verdad sobre la carta seleccionada durante los duelos nocturnos."}, {"id": "7449ad52-5047-4116-b71b-1937cca85587", "area": "Sociabilidad", "unidad": "Manada", "texto": "Cumplo las tareas de servicio que me encargan en la Manada.", "como_se_cumple": "Asumiendo con responsabilidad el turno de salida de mi seisena para adentrarme en el laberinto a oscuras."}, {"id": "27a71b44-9900-46e9-be75-38900c629663", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo siempre en las tareas de servicio que se deben hacer en la Manada.", "como_se_cumple": "Apoyando con alegría a los lobatos de mi equipo en la estrategia de acecho contra los soldados naipes."}, {"id": "a2ef0709-ac6d-4d90-9fe8-c96eeff5cf14", "area": "Creatividad", "unidad": "Manada", "texto": "No me olvido de las cosas que me pasan.", "como_se_cumple": "Recordando con atención la ubicación de las linternas de los soldados para evitar ser visto."}, {"id": "418f2b77-f15b-405a-95bd-8033c0b6a4c2", "area": "Creatividad", "unidad": "Manada", "texto": "Puedo contar con detalles las anécdotas y aventuras que hemos tenido en la Manada.", "como_se_cumple": "Describiendo con entusiasmo a mi seisena las rutas de avance sigiloso hacia el Castillo de Corazones."}, {"id": "075c93b1-81d2-4370-8e47-f0a4d086b20e", "area": "Carácter", "unidad": "Compañía", "texto": "Sé lo que significa ser leal.", "como_se_cumple": "Demostrando lealtad y fair play al aceptar la pérdida de vidas en los duelos de naipes."}, {"id": "7a9e143e-c837-473b-a014-e41ef5fc2ec2", "area": "Carácter", "unidad": "Compañía", "texto": "Entiendo que es importante actuar de acuerdo a lo que pienso.", "como_se_cumple": "Actuando con coherencia scout y autocontrol emocional frente a la presión de la oscuridad."}, {"id": "670852e4-d07d-48f5-b39b-b0b336059600", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Converso con mi patrulla sobre los derechos humanos.", "como_se_cumple": "Fomentando el respeto por las normas de arbitraje y los derechos de cada patrulla en el terreno."}, {"id": "80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Participo en actividades relacionadas con los derechos de las personas.", "como_se_cumple": "Coordinando con mi patrulla incursiones solidarias para avanzar hacia el Castillo de Corazones."}, {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "area": "Creatividad", "unidad": "Compañía", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "como_se_cumple": "Proponiendo tácticas de distracción en equipo para burlar el haz de luz de las linternas."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando fríamente las probabilidades numéricas de las cartas antes de seleccionar la del soldado."}, {"id": "38f4863e-12a6-4a4b-9767-8cdf55020734", "area": "Carácter", "unidad": "Tropa", "texto": "Sé lo que significa ser leal.", "como_se_cumple": "Manteniendo la lealtad al equipo y la honestidad en cada enfrentamiento nocturno."}, {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "area": "Carácter", "unidad": "Tropa", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "como_se_cumple": "Esforzándome por mantener la calma y el temple scout ante la posibilidad de quedar eliminado."}, {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Cumplo los compromisos que asumo.", "como_se_cumple": "Cumpliendo rigurosamente los tiempos de salida de 3 minutos asignados a mi patrulla."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "como_se_cumple": "Apoyando activamente a los integrantes de la tropa en la custodia de las cartas de vidas."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando mis ideas tácticas para infiltrarme por las zonas de menor visibilidad del laberinto."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Evaluando rápidamente el mapa del terreno para rodear las posiciones de los soldados naipes."}]}'::jsonb,
  ARRAY['juego', 'nocturno', 'estrategia', 'cartas', 'alicia']::text[],
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
SELECT id, 1 FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 9 FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

DELETE FROM articulo_objetivos_educativos 
WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas');


INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a2b1a0ea-f0f6-42c9-8048-3a3c54f264c3', 'Cumpliendo con lealtad la Ley de la Manada al entregar honestamente mis cartas al ser descubierto por el soldado naipe.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '506b7596-cac4-48e0-88c7-942d575172db', 'Diciendo siempre la verdad sobre la carta seleccionada durante los duelos nocturnos.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7449ad52-5047-4116-b71b-1937cca85587', 'Asumiendo con responsabilidad el turno de salida de mi seisena para adentrarme en el laberinto a oscuras.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '27a71b44-9900-46e9-be75-38900c629663', 'Apoyando con alegría a los lobatos de mi equipo en la estrategia de acecho contra los soldados naipes.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a2ef0709-ac6d-4d90-9fe8-c96eeff5cf14', 'Recordando con atención la ubicación de las linternas de los soldados para evitar ser visto.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '418f2b77-f15b-405a-95bd-8033c0b6a4c2', 'Describiendo con entusiasmo a mi seisena las rutas de avance sigiloso hacia el Castillo de Corazones.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '075c93b1-81d2-4370-8e47-f0a4d086b20e', 'Demostrando lealtad y fair play al aceptar la pérdida de vidas en los duelos de naipes.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7a9e143e-c837-473b-a014-e41ef5fc2ec2', 'Actuando con coherencia scout y autocontrol emocional frente a la presión de la oscuridad.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '670852e4-d07d-48f5-b39b-b0b336059600', 'Fomentando el respeto por las normas de arbitraje y los derechos de cada patrulla en el terreno.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2', 'Coordinando con mi patrulla incursiones solidarias para avanzar hacia el Castillo de Corazones.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '12686e7d-d6af-4c74-928d-c859d5b883d5', 'Proponiendo tácticas de distracción en equipo para burlar el haz de luz de las linternas.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando fríamente las probabilidades numéricas de las cartas antes de seleccionar la del soldado.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '38f4863e-12a6-4a4b-9767-8cdf55020734', 'Manteniendo la lealtad al equipo y la honestidad en cada enfrentamiento nocturno.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Esforzándome por mantener la calma y el temple scout ante la posibilidad de quedar eliminado.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Cumpliendo rigurosamente los tiempos de salida de 3 minutos asignados a mi patrulla.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Apoyando activamente a los integrantes de la tropa en la custodia de las cartas de vidas.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Expresando mis ideas tácticas para infiltrarme por las zonas de menor visibilidad del laberinto.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Evaluando rápidamente el mapa del terreno para rodear las posiciones de los soldados naipes.' FROM articulos WHERE slug = 'alicia-en-el-pais-de-las-maravillas';
    
COMMIT;