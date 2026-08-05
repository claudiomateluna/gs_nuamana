SET client_encoding = 'UTF8';
BEGIN;

INSERT INTO articulos (
  autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at
)
VALUES (
  NULL,
  NULL,
  'El Desafío de las Tinieblas',
  'el-desafio-de-las-tinieblas',
  'Juego nocturno de percepción sensorial y sigilo en carpa o salón cerrado a oscuras, ideal para superar el miedo a la penumbra.',
  '<h2>📜 Descripción de El Desafío de las Tinieblas</h2><p><strong>El Desafío de las Tinieblas</strong> es un clásico juego nocturno de percepción sensorial, sigilo, confianza afectiva y agudeza auditiva para veladas y campamentos scout.</p><p>La actividad se desarrolla en una carpa colectiva o salón cerrado totalmente a oscuras (penumbra controlada). Un explorador asume el rol de <em>Buscador Nocturno</em> (con los ojos vendados si la penumbra no es absoluta) e intenta localizar táctilmente a sus compañeros, quienes se desplazan con absoluto sigilo por el recinto. Es un ejercicio extraordinario para perder el temor a la oscuridad, desarrollar los sentidos no visuales y cultivar el autocontrol afectivo.</p><h2>🎲 ¿Cómo se juega El Desafío de las Tinieblas?</h2><ol><li><strong>Acondicionamiento de la Zona Segura:</strong><ul><li>Se selecciona un recinto amplio (salón de actividades o carpa colectiva) desprovisto de objetos punzantes o elementos peligrosos.</li><li>Se cierran cortinas y accesos para lograr una penumbra completa. Si ingresa luz residual, el jugador que busca debe llevar una venda sobre los ojos.</li></ul></li><li><strong>Asignación del Buscador Nocturno:</strong><ul><li>Se elige a un primer explorador para asumir el rol de buscador, ubicado en el centro de la sala con los ojos vendados.</li><li>A la señal de inicio dada por el dirigente, los demás participantes se dispersan sigilosamente por el recinto.</li></ul></li><li><strong>Búsqueda y Desplazamiento Silencioso:</strong><ul><li>El buscador se desplaza lentamente intentando tocar a algún compañero orientándose únicamente por el sonido de las pisadas y la respiración.</li><li>Los participantes pueden desplazarse libremente pero con el máximo sigilo para no ser delatados por el roce de la ropa o sus movimientos.</li></ul></li><li><strong>Captura e Inmovilidad:</strong><ul><li>En el momento exacto en que el buscador toca a un participante, este queda inmovilizado en su lugar sin emitir ruidos.</li><li>El primer jugador localizado en la ronda se convierte automáticamente en el buscador para la siguiente etapa.</li></ul></li><li><strong>Cierre de la Ronda:</strong><ul><li>La ronda concluye cuando el buscador logra localizar táctilmente a la totalidad de los participantes dispersos en la sala.</li></ul></li></ol><h2>🏆 Cómputo de Puntos y Condición de Victoria de El Desafío de las Tinieblas</h2><p><strong>¿Cómo se gana el juego?</strong> Se proclama Vencedor de la Velada el explorador que logre permanecer el mayor tiempo sin ser localizado por el buscador durante tres rondas consecutivas.</p><p>En modalidades competitivas por patrulla, la puntuación se distribuye de la siguiente manera:</p><ul><li><strong>Patrulla con el jugador con mayor tiempo de evasión limpia:</strong> 30 puntos.</li><li><strong>Buscador que complete la ronda en menor tiempo:</strong> 20 puntos.</li><li><strong>Bonus por juego limpio y honestidad estricta al ser tocado:</strong> 10 puntos bonus.</li></ul>',
  '/uploads/el-desafio-de-las-tinieblas.webp',
  'publicado',
  '{"unidades": ["manada", "compañía", "tropa"], "duracion": "30 minutos", "cantidad": "12 participantes", "lugares": ["Interior", "Salón de Actividades", "Carpa Colectiva"], "materiales": ["Vendas para Ojos"], "areas": ["carácter", "sociabilidad", "afectividad"], "objetivos": ["Desarrollar los sentidos", "Estimular la agilidad mental", "Trabajo en equipo", "Superación de temores"], "justificacion_areas": "Esta actividad de percepción sensorial e inhibición visual en penumbra ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Carácter:</b> Fomenta el autocontrol, la templanza y el manejo del miedo o la desorientación en entornos oscuros, promoviendo la serenidad y la honestidad al ser tocado.\n\n2. <b>Sociabilidad:</b> Fortalece la confianza mutua, el respeto a las reglas del juego y la convivencia fraternal durante veladas nocturnas o actividades de carpa.\n\n3. <b>Afectividad:</b> Ayuda a canalizar las emociones, superar la aprensión al contacto a ciegas y desarrollar la empatía y la seguridad afectiva entre compañeros de patrulla.", "variaciones": "<b>Modalidad con Identificación Táctil (Rompimiento de Olla):</b> El explorador que busca debe identificar por tacto o voz a la persona tocada. Si se equivoca, la patrulla exclama una consigna de reinicio y los atrapados quedan liberados. <b>Variante con pañolín:</b> Quienes la quedan llevan su pañolín scout atado en la muñeca para ser reconocidos por los capturados.", "recomendaciones": "<b>Seguridad en Penumbra:</b> Despejar totalmente el salón o carpa de sillas, mesas u objetos punzantes con los que se pueda tropezar. Exigir el uso correcto del pañolín scout y la presencia continua de dirigentes supervisores en los accesos.", "objetivos_educativos": [{"id": "041daaea-c4a7-472b-a613-951bd25cfa85", "area": "Carácter", "unidad": "Manada", "texto": "Reconozco y acepto mis errores.", "como_se_cumple": "Reconociendo y aceptando con honestidad cuando soy localizado en la penumbra."}, {"id": "4df1ba93-06fe-4f49-b273-fddc3800cf17", "area": "Carácter", "unidad": "Manada", "texto": "Le doy importancia a las cosas que hago bien.", "como_se_cumple": "Valorando mi templanza y serenidad al desplazarme con agudeza sin entrar en pánico."}, {"id": "7449ad52-5047-4116-b71b-1937cca85587", "area": "Sociabilidad", "unidad": "Manada", "texto": "Cumplo las tareas de servicio que me encargan en la Manada.", "como_se_cumple": "Cumpliendo con disciplina el rol de buscador cuando me corresponde la ronda."}, {"id": "27a71b44-9900-46e9-be75-38900c629663", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo siempre en las tareas de servicio que se deben hacer en la Manada.", "como_se_cumple": "Apoyando con respeto y juego limpio a la manada durante el desarrollo de la velada."}, {"id": "054680a5-f07a-4771-8d7a-811a5db8f505", "area": "Afectividad", "unidad": "Manada", "texto": "Acepto separarme de mi familia cuando voy de campamento con la Manada.", "como_se_cumple": "Superando temores a la oscuridad junto a mis compañeros en el ambiente seguro de la carpa."}, {"id": "05df5772-eea5-43e9-8aa5-2d777ada0402", "area": "Afectividad", "unidad": "Manada", "texto": "Acepto cuando en la Manada me dicen que no hice algo bien, aunque no siempre esté de acuerdo.", "como_se_cumple": "Aceptando con tranquilidad cuando la regla exige permanecer inmóvil tras ser tocado."}, {"id": "2cc128e0-7cc6-49df-a7c5-825f6ab79793", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que puedo ser cada día mejor.", "como_se_cumple": "Desarrollando mayor agudeza perceptiva y autocontrol en cada intento de sigilo."}, {"id": "006c5b09-47cf-4ed8-bf25-212203261a03", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Demostrando confianza en mis sentidos para orientarme sin luz artificial."}, {"id": "670852e4-d07d-48f5-b39b-b0b336059600", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Converso con mi patrulla sobre los derechos humanos.", "como_se_cumple": "Promoviendo el respeto por el espacio y la integridad de las compañeras de patrulla."}, {"id": "80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Participo en actividades relacionadas con los derechos de las personas.", "como_se_cumple": "Fomentando el cumplimiento estricto de las reglas del juego limpio en penumbra."}, {"id": "683c27f6-a692-4869-b22e-63f473395547", "area": "Afectividad", "unidad": "Compañía", "texto": "Busco apoyo en mi patrulla cuando estoy triste o algo me confunde.", "como_se_cumple": "Confiando en el grupo para sentirme segura y contenida durante la velada nocturna."}, {"id": "264d7abe-e120-43b2-9884-fade01c7f96e", "area": "Afectividad", "unidad": "Compañía", "texto": "Sé que es normal que a veces prefiera la soledad, o no me atreva a hacer algo, o sienta inseguridad o rabia; y trato de manejar estos sentimientos.", "como_se_cumple": "Manejando la aprensión o tensión propia de la oscuridad con serenidad e inteligencia."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Participando con entusiasmo en actividades que desafían mi temple y concentración."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Manteniendo la compostura y la firmeza moral sin recurrir a trampas visuales."}, {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Cumplo los compromisos que asumo.", "como_se_cumple": "Respetando el compromiso de inmovilidad al ser tocado por el buscador."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "como_se_cumple": "Colaborando con la patrulla en la preparación de la zona segura de la velada."}, {"id": "03ccaf4c-03c4-42a8-b311-47fef60f204c", "area": "Afectividad", "unidad": "Tropa", "texto": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.", "como_se_cumple": "Enfrentando y verbalizando la superación de temores a la penumbra con madurez."}, {"id": "4deb9334-aee6-48e4-b480-c562929584ad", "area": "Afectividad", "unidad": "Tropa", "texto": "Comparto mis sentimientos y emociones con mi patrulla.", "como_se_cumple": "Compartiendo reflexiones con la patrulla sobre la confianza y el autocontrol afectivo."}]}'::jsonb,
  ARRAY['juego', 'nocturno', 'veladas', 'sensorial', 'sigilo']::text[],
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
SELECT id, 1 FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 7 FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

DELETE FROM articulo_objetivos_educativos 
WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas');


INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '041daaea-c4a7-472b-a613-951bd25cfa85', 'Reconociendo y aceptando con honestidad cuando soy localizado en la penumbra.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4df1ba93-06fe-4f49-b273-fddc3800cf17', 'Valorando mi templanza y serenidad al desplazarme con agudeza sin entrar en pánico.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7449ad52-5047-4116-b71b-1937cca85587', 'Cumpliendo con disciplina el rol de buscador cuando me corresponde la ronda.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '27a71b44-9900-46e9-be75-38900c629663', 'Apoyando con respeto y juego limpio a la manada durante el desarrollo de la velada.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '054680a5-f07a-4771-8d7a-811a5db8f505', 'Superando temores a la oscuridad junto a mis compañeros en el ambiente seguro de la carpa.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '05df5772-eea5-43e9-8aa5-2d777ada0402', 'Aceptando con tranquilidad cuando la regla exige permanecer inmóvil tras ser tocado.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2cc128e0-7cc6-49df-a7c5-825f6ab79793', 'Desarrollando mayor agudeza perceptiva y autocontrol en cada intento de sigilo.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '006c5b09-47cf-4ed8-bf25-212203261a03', 'Demostrando confianza en mis sentidos para orientarme sin luz artificial.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '670852e4-d07d-48f5-b39b-b0b336059600', 'Promoviendo el respeto por el espacio y la integridad de las compañeras de patrulla.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2', 'Fomentando el cumplimiento estricto de las reglas del juego limpio en penumbra.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '683c27f6-a692-4869-b22e-63f473395547', 'Confiando en el grupo para sentirme segura y contenida durante la velada nocturna.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '264d7abe-e120-43b2-9884-fade01c7f96e', 'Manejando la aprensión o tensión propia de la oscuridad con serenidad e inteligencia.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', 'Participando con entusiasmo en actividades que desafían mi temple y concentración.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '78bd48d3-5d26-4218-843a-33712bade630', 'Manteniendo la compostura y la firmeza moral sin recurrir a trampas visuales.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Respetando el compromiso de inmovilidad al ser tocado por el buscador.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Colaborando con la patrulla en la preparación de la zona segura de la velada.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '03ccaf4c-03c4-42a8-b311-47fef60f204c', 'Enfrentando y verbalizando la superación de temores a la penumbra con madurez.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4deb9334-aee6-48e4-b480-c562929584ad', 'Compartiendo reflexiones con la patrulla sobre la confianza y el autocontrol afectivo.' FROM articulos WHERE slug = 'el-desafio-de-las-tinieblas';
    
COMMIT;