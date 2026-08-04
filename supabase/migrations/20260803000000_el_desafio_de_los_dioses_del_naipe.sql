SET client_encoding = 'UTF8';
BEGIN;

INSERT INTO articulos (
  autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at
)
VALUES (
  NULL,
  NULL,
  'El Desafío de los Dioses del Naipe',
  'el-desafio-de-los-dioses-del-naipe',
  'Juego nocturno campestre de acecho y probabilidades donde las patrullas desafían a guardianes del bosque en duelos de cartas para capturar el As Maestro.',
  '<h2>📜 Descripción y Ambientación del Juego</h2><p><strong>El Desafío de los Dioses del Naipe</strong> es un apasionante juego nocturno de acecho, estrategia y cálculo de probabilidades al aire libre. La leyenda cuenta que en lo profundo del bosque habitan cinco antiguos Guardianes místicas (los Dioses del Naipe), quienes custodian los secretos y la riqueza del Gran As Maestro.</p><p>Cada patrulla o seisena asume el rol de una expedición de buscadores que debe incursionar sigilosamente en la penumbra del bosque, esquivar los haces de luz de las linternas de los guardianes y enfrentarse a ellos en duelos de cartas numeradas para llegar hasta el Quinto Guardián y arrebatarle el legendario As Maestro.</p><h2>🎲 ¿Cómo se juega? Paso a Paso Detallado</h2><ol><li><strong>Distribución del Campo y Posición de los Guardianes:</strong><ul><li>Se delimita un sector de bosque o parque con abundante vegetación. 5 dirigentes o competidores designados asumen el rol de <em>Guardianes del Naipe</em> y se ocultan dispersos en el terreno provistos de una linterna cada uno.</li><li>Los cuatro primeros guardianes se distribuyen en forma escalonada en el camino, mientras que el <strong>Quinto Guardián (Custodio del As Maestro)</strong> se posiciona en el punto más alejado y oculto del campo.</li></ul></li><li><strong>Mazo de Vidas y Jerarquía de las Cartas:</strong><ul><li>Los equipos se ubican en la Línea de Salida fuera del perímetro. Cada participante recibe <strong>3 cartas que representan sus vidas</strong>: 1 Carta Alta y 2 Cartas Bajas.</li><li><strong>Escala de Cartas:</strong><ul><li><strong>Cartas Altas:</strong> 10, J, Q, K, As.</li><li><strong>Cartas Medias:</strong> 6, 7, 8, 9.</li><li><strong>Cartas Bajas:</strong> 2, 3, 4, 5.</li></ul></li><li>Los Guardianes poseen mazos de cartas asignados estratégicamente (los cuatro primeros tienen cartas medias y altas, mientras que el Quinto Guardián tiene 6 cartas compuestas por cartas altas y el <strong>As Maestro</strong>).</li></ul></li><li><strong>Incursión de Acecho e Infiltración Nocturna:</strong><ul><li>Cada 3 minutos, el primer integrante de cada patrulla inicia su avance en solitario o en pareja por el bosque a oscuras, intentando avanzar en sigilo sin ser iluminado por las linternas de los guardianes.</li></ul></li><li><strong>Duelo de Cartas en Caso de Avistamiento:</strong><ul><li>Si un guardián enfoca con su linterna a un jugador, exclama <em>«¡Duelo!»</em>. El avance se detiene inmediatamente y ambos realizan el enfrentamiento:<ul><li>Cada uno roba a ciegas una carta de la mano del rival y ambas se muestran al mismo tiempo.</li><li><strong>Si la carta del Guardián es mayor o igual a la del participante:</strong> El scout pierde la carta extraída (una vida), debe regresar a la Línea de Salida y esperar el siguiente turno de su equipo para reiniciar su avance con sus cartas restantes.</li><li><strong>Si la carta del Participante es mayor a la del Guardián:</strong> El jugador vence al guardián, conserva sus cartas y obtiene el paso libre para continuar avanzando hacia el siguiente nivel.</li></ul></li><li><em>Nota de Arbitraje:</em> Los guardianes nunca pierden sus cartas; solo otorgan el pase o devuelven al jugador a la salida.</li></ul></li><li><strong>El Gran Duelo Final y Rescate del As Maestro:</strong><ul><li>El objetivo máximo es alcanzar la posición del Quinto Guardián sin perder todas las vidas.</li><li>Al llegar al Quinto Guardián, el jugador realiza el <strong>Duelo Supremo</strong> eligiendo una carta de su mazo especial de 6 cartas.</li></ul></li></ol><h2>🏆 Cómputo de Puntos y Condición de Victoria</h2><p><strong>¿Cómo se gana el juego?</strong> El primer participante que logre batir al Quinto Guardián extrayendo el <strong>As Maestro</strong> en el duelo final se proclama Vencedor Supremo y otorga la victoria definitiva a su patrulla.</p><p>En caso de que el tiempo límite (60 minutos) concluya sin que ningún jugador extraiga el As Maestro, la victoria se define por puntaje:</p><ul><li><strong>Cada Guardián derrotado y superado en el bosque:</strong> 10 puntos.</li><li><strong>Cada carta de vida conservada al final del juego:</strong> 5 puntos.</li><li><strong>Espíritu scout, sigilo y fair play durante los duelos:</strong> 10 puntos bonus.</li></ul><p>Al concluir la actividad, los guardianes y equipos se reúnen en el centro para compartir impresiones, felicitar a los campeones del duelo y cerrar la jornada con un aplauso scout.</p>',
  '/uploads/el-desafio-de-los-dioses-del-naipe.webp',
  'publicado',
  '{"unidades": ["manada", "compañía", "tropa"], "duracion": "60 minutos", "cantidad": "16 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Cartas", "Linterna"], "areas": ["carácter", "sociabilidad", "creatividad"], "objetivos": ["Estrategia y planificación", "Estimular la agilidad mental", "Perder el miedo a la oscuridad", "Trabajo en equipo"], "justificacion_areas": "Esta actividad nocturna de gran escala ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Carácter:</b> Desarrolla la valentía, el autocontrol emocional y la serenidad al tomar decisiones de acecho bajo la oscuridad y aceptar con fair play el resultado de los duelos de cartas.\n\n2. <b>Sociabilidad:</b> Fortalece el trabajo cooperativo en equipo, el respeto por las reglas de arbitraje y la fraternidad scout al coordinar salidas estratégicas con los compañeros de patrulla.\n\n3. <b>Creatividad:</b> Estimula la agilidad mental, la evaluación de probabilidades y la astucia táctica al administrar las cartas de vidas y calcular los riesgos de cada enfrentamiento.", "variaciones": "<b>Modalidad en Salón (Interior):</b> Se puede realizar en un gimnasio o salón a oscuras utilizando obstáculos de hule o colchonetas como refugio. <b>Variante con pañolines:</b> Los guardianes pueden sujetar pañolines de colores para indicar el nivel de dificultad del duelo.", "recomendaciones": "<b>Seguridad en la Oscuridad:</b> Delimitar previamente el perímetro de juego eliminando baches o alambres. Exigir el uso correcto del pañolín scout y asegurar que los guardianes utilicen linternas con luz tenue enfocada hacia el suelo.", "objetivos_educativos": [{"id": "a2b1a0ea-f0f6-42c9-8048-3a3c54f264c3", "area": "Carácter", "unidad": "Manada", "texto": "He aprendido que en las cosas que hago con mis compañeros debo cumplir la Ley de la Manada.", "como_se_cumple": "Cumpliendo con lealtad la Ley de la Manada al entregar honestamente mis cartas al ser descubierto por el guardián."}, {"id": "506b7596-cac4-48e0-88c7-942d575172db", "area": "Carácter", "unidad": "Manada", "texto": "Digo la verdad, aunque a veces no me gusten las consecuencias.", "como_se_cumple": "Diciendo siempre la verdad sobre la carta seleccionada durante los duelos nocturnos."}, {"id": "7449ad52-5047-4116-b71b-1937cca85587", "area": "Sociabilidad", "unidad": "Manada", "texto": "Cumplo las tareas de servicio que me encargan en la Manada.", "como_se_cumple": "Asumiendo con responsabilidad el turno de salida de mi seisena para adentrarme en el bosque a oscuras."}, {"id": "27a71b44-9900-46e9-be75-38900c629663", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo siempre en las tareas de servicio que se deben hacer en la Manada.", "como_se_cumple": "Apoyando con alegría a los lobatos de mi equipo en la estrategia de acecho contra los guardianes."}, {"id": "a2ef0709-ac6d-4d90-9fe8-c96eeff5cf14", "area": "Creatividad", "unidad": "Manada", "texto": "No me olvido de las cosas que me pasan.", "como_se_cumple": "Recordando con atención la ubicación de las linternas de los guardianes para evitar ser visto."}, {"id": "418f2b77-f15b-405a-95bd-8033c0b6a4c2", "area": "Creatividad", "unidad": "Manada", "texto": "Puedo contar con detalles las anécdotas y aventuras que hemos tenido en la Manada.", "como_se_cumple": "Describiendo con entusiasmo a mi seisena las rutas de avance sigiloso hacia el quinto dios."}, {"id": "075c93b1-81d2-4370-8e47-f0a4d086b20e", "area": "Carácter", "unidad": "Compañía", "texto": "Sé lo que significa ser leal.", "como_se_cumple": "Demostrando lealtad y fair play al aceptar la pérdida de vidas en los duelos de naipes."}, {"id": "7a9e143e-c837-473b-a014-e41ef5fc2ec2", "area": "Carácter", "unidad": "Compañía", "texto": "Entiendo que es importante actuar de acuerdo a lo que pienso.", "como_se_cumple": "Actuando con coherencia scout y autocontrol emocional frente a la presión de la oscuridad."}, {"id": "670852e4-d07d-48f5-b39b-b0b336059600", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Converso con mi patrulla sobre los derechos humanos.", "como_se_cumple": "Fomentando el respeto por las normas de arbitraje y los derechos de cada patrulla en el terreno."}, {"id": "80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Participo en actividades relacionadas con los derechos de las personas.", "como_se_cumple": "Coordinando con mi patrulla incursiones solidarias para avanzar hacia el Guardián del As."}, {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "area": "Creatividad", "unidad": "Compañía", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "como_se_cumple": "Proponiendo tácticas de distracción en equipo para burlar el haz de luz de las linternas."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando fríamente las probabilidades numéricas de las cartas antes de seleccionar la del guardián."}, {"id": "38f4863e-12a6-4a4b-9767-8cdf55020734", "area": "Carácter", "unidad": "Tropa", "texto": "Sé lo que significa ser leal.", "como_se_cumple": "Manteniendo la lealtad al equipo y la honestidad en cada enfrentamiento nocturno."}, {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "area": "Carácter", "unidad": "Tropa", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "como_se_cumple": "Esforzándome por mantener la calma y el temple scout ante la posibilidad de quedar eliminado."}, {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Cumplo los compromisos que asumo.", "como_se_cumple": "Cumpliendo rigurosamente los tiempos de salida de 3 minutos asignados a mi patrulla."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "como_se_cumple": "Apoyando activamente a los integrantes de la tropa en la custodia de las cartas de vidas."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando mis ideas tácticas para infiltrarme por las zonas de menor visibilidad del bosque."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Evaluando rápidamente el mapa del terreno para rodear las posiciones de los guardianes."}]}'::jsonb,
  ARRAY['juego', 'nocturno', 'estrategia', 'cartas']::text[],
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
SELECT id, 1 FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 9 FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

DELETE FROM articulo_objetivos_educativos 
WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe');


INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a2b1a0ea-f0f6-42c9-8048-3a3c54f264c3', 'Cumpliendo con lealtad la Ley de la Manada al entregar honestamente mis cartas al ser descubierto por el guardián.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '506b7596-cac4-48e0-88c7-942d575172db', 'Diciendo siempre la verdad sobre la carta seleccionada durante los duelos nocturnos.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7449ad52-5047-4116-b71b-1937cca85587', 'Asumiendo con responsabilidad el turno de salida de mi seisena para adentrarme en el bosque a oscuras.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '27a71b44-9900-46e9-be75-38900c629663', 'Apoyando con alegría a los lobatos de mi equipo en la estrategia de acecho contra los guardianes.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a2ef0709-ac6d-4d90-9fe8-c96eeff5cf14', 'Recordando con atención la ubicación de las linternas de los guardianes para evitar ser visto.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '418f2b77-f15b-405a-95bd-8033c0b6a4c2', 'Describiendo con entusiasmo a mi seisena las rutas de avance sigiloso hacia el quinto dios.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '075c93b1-81d2-4370-8e47-f0a4d086b20e', 'Demostrando lealtad y fair play al aceptar la pérdida de vidas en los duelos de naipes.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7a9e143e-c837-473b-a014-e41ef5fc2ec2', 'Actuando con coherencia scout y autocontrol emocional frente a la presión de la oscuridad.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '670852e4-d07d-48f5-b39b-b0b336059600', 'Fomentando el respeto por las normas de arbitraje y los derechos de cada patrulla en el terreno.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2', 'Coordinando con mi patrulla incursiones solidarias para avanzar hacia el Guardián del As.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '12686e7d-d6af-4c74-928d-c859d5b883d5', 'Proponiendo tácticas de distracción en equipo para burlar el haz de luz de las linternas.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando fríamente las probabilidades numéricas de las cartas antes de seleccionar la del guardián.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '38f4863e-12a6-4a4b-9767-8cdf55020734', 'Manteniendo la lealtad al equipo y la honestidad en cada enfrentamiento nocturno.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Esforzándome por mantener la calma y el temple scout ante la posibilidad de quedar eliminado.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Cumpliendo rigurosamente los tiempos de salida de 3 minutos asignados a mi patrulla.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Apoyando activamente a los integrantes de la tropa en la custodia de las cartas de vidas.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Expresando mis ideas tácticas para infiltrarme por las zonas de menor visibilidad del bosque.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Evaluando rápidamente el mapa del terreno para rodear las posiciones de los guardianes.' FROM articulos WHERE slug = 'el-desafio-de-los-dioses-del-naipe';
    
COMMIT;