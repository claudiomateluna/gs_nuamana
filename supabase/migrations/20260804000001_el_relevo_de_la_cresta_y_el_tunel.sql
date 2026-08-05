SET client_encoding = 'UTF8';
BEGIN;

INSERT INTO articulos (
  autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at
)
VALUES (
  NULL,
  NULL,
  'El Relevo de la Cresta y el Túnel',
  'el-relevo-de-la-cresta-y-el-tunel',
  'Juego dinámico de relevos donde las patrullas combinan pases aéreos por encima de la cabeza y gateo veloz entre las piernas del equipo.',
  '<h2>📜 Descripción y Ambientación del Juego</h2><p><strong>El Relevo de la Cresta y el Túnel</strong> es un dinámico juego de agilidad física, coordinación psicomotora y velocidad colectiva al aire libre.</p><p>Esta prueba de relevos combina dos movimientos estratégicos continuos: la <em>Pase por la Cresta</em> (donde el balón viaja aéreamente por encima de las cabezas de los exploradores formando una cima) y el <em>Desplazamiento por el Túnel</em> (donde el participante del final de la fila recorre a gatas el espacio inferior entre las piernas de su equipo para tomar el liderazgo). Es un ejercicio idóneo para fomentar la cohesión de la patrulla y la desinhibición motriz.</p><h2>🎲 ¿Cómo se juega? Paso a Paso Detallado</h2><ol><li><strong>Formación e Inicio del Relevo:</strong><ul><li>Se organizan dos o más equipos de igual número de integrantes. Cada patrulla se ubica en columna detrás de la línea de salida, con los participantes de pie y las piernas abiertas en compás.</li><li>El primer jugador de cada columna sostiene un balón con ambas manos.</li></ul></li><li><strong>Fase 1: El Pase por la Cresta:</strong><ul><li>A la señal del dirigente arbitro, el primer jugador pasa el balón hacia atrás por encima de su cabeza. Cada integrante repite el movimiento hasta que el balón alcanza las manos del último jugador de la hilera.</li></ul></li><li><strong>Fase 2: El Avance por el Túnel:</strong><ul><li>El último jugador recibe el balón, se agacha e inicia una rápida carrera en cuadrupedia (a gatas) pasando por entre las piernas aberturadas de todos sus compañeros.</li><li>Al llegar al frente de la columna, se coloca en primera posición e inicia de inmediato un nuevo pase aéreo por la cresta. Toda la patrulla retrocede automáticamente un paso para mantener la distancia.</li></ul></li><li><strong>Continuidad del Ciclo:</strong><ul><li>El proceso se repite sucesivamente con cada integrante hasta que el capitán o primer jugador original recupera la cabeza de la columna.</li></ul></li></ol><h2>🏆 Cómputo de Puntos y Condición de Victoria</h2><p><strong>¿Cómo se gana el juego?</strong> Se proclama victorioso el primer equipo que complete el ciclo completo de carrera y logre que su capitán original retorne a la primera posición con el balón en alto.</p><p>En torneos de múltiples rondas, la puntuación se asigna de la siguiente forma:</p><ul><li><strong>Primer equipo en completar la rotación:</strong> 30 puntos.</li><li><strong>Segundo equipo en completar la rotación:</strong> 20 puntos.</li><li><strong>Fluidez del pase y mantener la formación sin soltar la pelota:</strong> 10 puntos bonus.</li></ul>',
  '/uploads/el-relevo-de-la-cresta-y-el-tunel.webp',
  'publicado',
  '{"unidades": ["manada", "compañía", "tropa"], "duracion": "15 minutos", "cantidad": "16 participantes", "lugares": ["Exterior", "Campo Delimitado", "Cancha"], "materiales": ["Pelota"], "areas": ["corporalidad", "sociabilidad", "carácter"], "objetivos": ["Estimular la agilidad", "Estimular la coordinación", "Reforzar la coordinación al interior del equipo", "Trabajo en equipo"], "justificacion_areas": "Esta actividad de relevos dinámicos y agilidad física ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Corporalidad:</b> Estimula el desarrollo psicomotor, la flexibilidad, la resistencia física y la coordinación óculo-manual al realizar pases aéreos y desplazamientos en cuadrupedia a gatas.\n\n2. <b>Sociabilidad:</b> Fortalece el trabajo en equipo, la sincronicidad colectiva y el apoyo mutuo en la patrulla al mantener la formación limpia durante el avance continuo de los compañeros.\n\n3. <b>Carácter:</b> Fomenta la perseverancia, la templanza bajo presión y la superación personal al mantener el ritmo del relevo sin desesperarse ni perder el control del balón.", "variaciones": "<b>Modalidad en Interior (Gimnasio):</b> Se realiza utilizando balones de goma espuma blanda sobre colchonetas. <b>Variante con pañolines:</b> El jugador que gatea por el túnel debe llevar un pañolín en la espalda y entregarlo al llegar al frente.", "recomendaciones": "<b>Seguridad y Espaciado:</b> Mantener una distancia adecuada de 2 metros entre patrullas colindantes para evitar colisiones durante el gateo. Verificar que la superficie del suelo esté despejada de piedras u objetos punzantes.", "objetivos_educativos": [{"id": "0956c462-5ae8-4a34-8a7d-c08a9b092516", "area": "Corporalidad", "unidad": "Manada", "texto": "Trato de seguir los consejos que me dan los más grandes para tener un cuerpo fuerte y sano.", "como_se_cumple": "Siguiendo con atención los movimientos del relevo para mantener el equilibrio y la agilidad corporal."}, {"id": "626a313e-0407-4cfd-b714-c6aa6e51738c", "area": "Corporalidad", "unidad": "Manada", "texto": "Manejo cada vez mejor mis brazos, piernas, manos y pies.", "como_se_cumple": "Ejercitando la coordinación psicomotora al pasar el balón por la cresta y desplazarme a gatas por el túnel."}, {"id": "7449ad52-5047-4116-b71b-1937cca85587", "area": "Sociabilidad", "unidad": "Manada", "texto": "Cumplo las tareas de servicio que me encargan en la Manada.", "como_se_cumple": "Cumpliendo con lealtad y entusiasmo mi turno en la hilera del relevo."}, {"id": "27a71b44-9900-46e9-be75-38900c629663", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo siempre en las tareas de servicio que se deben hacer en la Manada.", "como_se_cumple": "Apoyando en equipo la posición de mis compañeros para facilitar el paso fluido del balón."}, {"id": "041daaea-c4a7-472b-a613-951bd25cfa85", "area": "Carácter", "unidad": "Manada", "texto": "Reconozco y acepto mis errores.", "como_se_cumple": "Aceptando con serenidad y fair play los desaciertos durante la carrera sin culpar a mi equipo."}, {"id": "4df1ba93-06fe-4f49-b273-fddc3800cf17", "area": "Carácter", "unidad": "Manada", "texto": "Le doy importancia a las cosas que hago bien.", "como_se_cumple": "Valorando el esfuerzo colectivo al completar limpiamente el ciclo de carreras."}, {"id": "273f60b8-7953-4416-97c3-e8c83615364f", "area": "Corporalidad", "unidad": "Compañía", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "como_se_cumple": "Desarrollando la flexibilidad muscular y la resistencia física en el desplazamiento en cuadrupedia."}, {"id": "91473f71-9345-4bcf-bfc7-dea709d12361", "area": "Corporalidad", "unidad": "Compañía", "texto": "Respeto mi cuerpo y el de los demás.", "como_se_cumple": "Respetando el espacio físico de mis compañeros al avanzar velozmente por entre sus piernas."}, {"id": "670852e4-d07d-48f5-b39b-b0b336059600", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Converso con mi patrulla sobre los derechos humanos.", "como_se_cumple": "Fomentando el trabajo en equipo y la sincronicidad dentro de la patrulla."}, {"id": "80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Participo en actividades relacionadas con los derechos de las personas.", "como_se_cumple": "Promoviendo el respeto por las reglas de competición y la convivencia armónica."}, {"id": "2cc128e0-7cc6-49df-a7c5-825f6ab79793", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que puedo ser cada día mejor.", "como_se_cumple": "Demostrando superación personal y esfuerzo constante en el ritmo de los relevos."}, {"id": "006c5b09-47cf-4ed8-bf25-212203261a03", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Confiando en mis capacidades motrices para ejecutar pases limpios y veloces."}, {"id": "5c9843d1-39fd-4298-870c-5e46f29ffbf6", "area": "Corporalidad", "unidad": "Tropa", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "como_se_cumple": "Ejercitando la fuerza y la velocidad en la formación en columna."}, {"id": "fb56310a-a9cf-46e3-9c34-c4643f6b9035", "area": "Corporalidad", "unidad": "Tropa", "texto": "Respeto mi cuerpo y el de los demás.", "como_se_cumple": "Manteniendo el autocontrol y la solidez física al estar en la primera línea de relevo."}, {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Cumplo los compromisos que asumo.", "como_se_cumple": "Cumpliendo con precisión la recepción y entrega del balón por la cresta."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "como_se_cumple": "Apoyando a mi patrulla para mantener la columna alineada hasta recuperar al capitán."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Manteniendo la calma y la concentración bajo la intensidad física de la competencia."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Asumiendo el desafío con determinación y espíritu scout en cada turno del túnel."}]}'::jsonb,
  ARRAY['juego', 'relevos', 'habilidad', 'pelota', 'velocidad']::text[],
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
SELECT id, 1 FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 7 FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

DELETE FROM articulo_objetivos_educativos 
WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel');


INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0956c462-5ae8-4a34-8a7d-c08a9b092516', 'Siguiendo con atención los movimientos del relevo para mantener el equilibrio y la agilidad corporal.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Ejercitando la coordinación psicomotora al pasar el balón por la cresta y desplazarme a gatas por el túnel.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7449ad52-5047-4116-b71b-1937cca85587', 'Cumpliendo con lealtad y entusiasmo mi turno en la hilera del relevo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '27a71b44-9900-46e9-be75-38900c629663', 'Apoyando en equipo la posición de mis compañeros para facilitar el paso fluido del balón.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '041daaea-c4a7-472b-a613-951bd25cfa85', 'Aceptando con serenidad y fair play los desaciertos durante la carrera sin culpar a mi equipo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4df1ba93-06fe-4f49-b273-fddc3800cf17', 'Valorando el esfuerzo colectivo al completar limpiamente el ciclo de carreras.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '273f60b8-7953-4416-97c3-e8c83615364f', 'Desarrollando la flexibilidad muscular y la resistencia física en el desplazamiento en cuadrupedia.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '91473f71-9345-4bcf-bfc7-dea709d12361', 'Respetando el espacio físico de mis compañeros al avanzar velozmente por entre sus piernas.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '670852e4-d07d-48f5-b39b-b0b336059600', 'Fomentando el trabajo en equipo y la sincronicidad dentro de la patrulla.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2', 'Promoviendo el respeto por las reglas de competición y la convivencia armónica.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2cc128e0-7cc6-49df-a7c5-825f6ab79793', 'Demostrando superación personal y esfuerzo constante en el ritmo de los relevos.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '006c5b09-47cf-4ed8-bf25-212203261a03', 'Confiando en mis capacidades motrices para ejecutar pases limpios y veloces.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5c9843d1-39fd-4298-870c-5e46f29ffbf6', 'Ejercitando la fuerza y la velocidad en la formación en columna.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fb56310a-a9cf-46e3-9c34-c4643f6b9035', 'Manteniendo el autocontrol y la solidez física al estar en la primera línea de relevo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Cumpliendo con precisión la recepción y entrega del balón por la cresta.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Apoyando a mi patrulla para mantener la columna alineada hasta recuperar al capitán.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', 'Manteniendo la calma y la concentración bajo la intensidad física de la competencia.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '78bd48d3-5d26-4218-843a-33712bade630', 'Asumiendo el desafío con determinación y espíritu scout en cada turno del túnel.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    
COMMIT;