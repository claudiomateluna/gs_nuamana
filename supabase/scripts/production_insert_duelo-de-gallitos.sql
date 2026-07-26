-- ==============================================
-- ARTICLE: Pelea de Gallos (duelo-de-gallitos)
-- ==============================================
DO $$
DECLARE
  v_admin_id UUID;
  v_articulo_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM perfiles WHERE rol_id = 1 LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM perfiles LIMIT 1;
  END IF;

  DELETE FROM articulos WHERE slug = 'duelo-de-gallitos';

  v_articulo_id := uuid_generate_v4();

  INSERT INTO articulos (
    id,
    autor_id,
    categoria_id,
    titulo,
    slug,
    contenido,
    extracto,
    imagen_destacada,
    estado,
    etiquetas,
    metadata
  ) VALUES (
    v_articulo_id,
    v_admin_id,
    NULL,
    'Pelea de Gallos',
    'duelo-de-gallitos',
    $html$<h2>📜 Descripción de la Pelea de Gallos</h2><p><strong>Pelea de Gallos</strong> es un divertido y clásico juego scout de equilibrio, agilidad física y fuerza suave por parejas. Se realiza en terrenos blandos al aire libre donde los competidores desafían su estabilidad en posición de cuclillas sin perder el control.</p><hr><h3>🎲 ¿Cómo se juega la Pelea de Gallos?</h3><ol><li><strong>Posición Inicial:</strong> Dos participantes se ubican frente a frente a un metro de distancia dentro de un pequeño círculo marcado en el césped. Ambos se colocan en cuclillas tomándose los tobillos o cruzando los brazos sobre el pecho.</li><li><strong>El Duelo:</strong> A la señal del dirigente, ambos jugadores avanzan en cuclillas e intentan desestabilizar al oponente mediante suaves empujones con los hombros o las palmas de las manos.</li><li><strong>Condiciones de Victoria:</strong> Un jugador gana la ronda si su oponente pierde el equilibrio tocando el suelo con las rodillas o manos, se sale del círculo marcado, o suelta el agarre de los tobillos.</li><li><strong>Rotación por Rondas:</strong> Se realizan duelos cortos de un minuto y los ganadores avanzan de ronda en un torneo amistoso por patrullas.</li></ol>$html$,
    'Un divertido juego scout de agilidad, fuerza suave y equilibrio en cuclillas donde los competidores buscan desestabilizar al oponente.',
    '/uploads/actividad_dueloGallitos.webp',
    'publicado',
    ARRAY['juego-fisico', 'equilibrio', 'parejas', 'exterior', 'agilidad'],
    $json${"areas": ["corporalidad", "carácter", "sociabilidad"], "lugares": ["Exterior", "campo delimitado"], "cantidad": "02 participantes", "duracion": "15 minutos", "unidades": ["compañía", "tropa"], "descargas": [], "objetivos": ["Refuerzo de habilidades físicas", "Estimular la agilidad mental", "Fomentar un entorno de confianza", "Favorecer el trabajo en equipo"], "materiales": ["Sin Materiales"], "variaciones": "Gallitos sobre un Pie: En lugar de estar en cuclillas, los participantes se sostienen sobre un solo pie tomándose el otro tobillo con una mano.\n\nDuelo por Equipos (Todos contra Todos): Todas las parejas entran al cuadrilátero simultáneamente en cuclillas; gana el último \"gallito\" que quede en pie sin caer.\n\nDuelo de Pañolín: Cada competidor lleva un pañolín colocado en el hombro; el objetivo es quitar el pañolín del rival sin perder el equilibrio en cuclillas.", "recomendaciones": "Supervisión Directa de Seguridad: Es indispensable verificar que los participantes no utilicen cabezazos, empujones violentos ni zancadillas. Solo se permite el empuje limpio de palmas y hombros.\n\nSuperficie Adecuada: Realizar el juego exclusivamente sobre césped mullido, arena o colchonetas recreativas para amortiguar suavemente las caídas.\n\nFomento del Juego Limpio: Felicitar la caballerosidad scout y la risa compartida tras cada duelo, promoviendo el estrechamiento de manos al finalizar.", "justificacion_areas": "Duelo de Gallitos estimula la corporalidad al poner a prueba la fuerza suave, la estabilidad del centro de gravedad y el equilibrio en cuclillas. Fortalece el carácter al promover el sentido del humor ante las caídas cómicas y el respeto a las reglas, y desarrolla la sociabilidad al afianzar la caballerosidad y la convivencia limpia.", "objetivos_educativos": [{"id": "d5b111f1-5f6f-4716-8a02-e1826d653c59", "area": "Corporalidad", "texto": "Participo en los juegos, excursiones y campamentos que organiza mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Demostrando destreza corporal y coordinación motriz en los empujes de hombros."}, {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Perfeccionando el control del centro de gravedad y el equilibrio dinámico."}, {"id": "fce82191-77ea-444b-89d9-e33b62a323a5", "area": "Sociabilidad", "texto": "Procuro que respetemos a nuestras compañeras, cualquiera sea su manera de ser.", "unidad": "Compañía", "como_se_cumple": "Fomentando la solidaridad y el fair play en las actividades al aire libre."}, {"id": "117bbf3f-7e3d-4c61-b305-821609bf2e5a", "area": "Carácter", "texto": "Contribuyo al ambiente de alegría de mi Compañía.", "unidad": "Compañía", "como_se_cumple": "Riendo y viviendo la experiencia con optimismo y desinhibición."}, {"id": "25b24d3a-9d47-44af-b460-680508e644f3", "area": "Carácter", "texto": "Soy alegre.", "unidad": "Compañía", "como_se_cumple": "Enfrentando los desafíos físicos con caballerosidad y madurez emocional."}, {"id": "944660c8-0093-4181-ba2c-5f95cc74ba47", "area": "Sociabilidad", "texto": "No me gusta cuando no se respetan los derechos humanos y lo digo.", "unidad": "Compañía", "como_se_cumple": "Velando por el bienestar y el juego limpio de las oponentes."}, {"id": "58b4936a-816e-4d17-8d0a-c92d0606009d", "area": "Corporalidad", "texto": "Participo en los juegos, excursiones y campamentos que organiza mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Fortaleciendo mi resistencia y estabilidad al competir fraternalmente por parejas."}, {"id": "6768d60a-187e-4bbf-97b9-cdc25a316030", "area": "Corporalidad", "texto": "Ayudo a preparar los juegos, excursiones y campamentos de mi patrulla y mi Tropa.", "unidad": "Tropa", "como_se_cumple": "Esforzándome por superar mis capacidades físicas manteniendo el juego limpio."}, {"id": "4d66ed86-48ec-4801-bd0a-e5c8d023c8cd", "area": "Carácter", "texto": "Enfrento y resuelvo mis dificultades con alegría.", "unidad": "Tropa", "como_se_cumple": "Asumiendo los resultados de los duelos con espíritu deportivo y sentido del humor."}, {"id": "9a38e454-f93a-40a5-9f68-e500ba7e0655", "area": "Carácter", "texto": "Comparto mi alegría con mis amigos, amigos y familia.", "unidad": "Tropa", "como_se_cumple": "Fomentando el compañerismo y el respeto mutuo durante la competencia por patrullas."}, {"id": "a3d7abdf-ca3b-42b8-92b5-403958fb537c", "area": "Sociabilidad", "texto": "Procuro que respetemos a nuestras compañeros, cualquiera sea su manera de ser.", "unidad": "Tropa", "como_se_cumple": "Promoviendo el respeto y la consideración por la integridad del rival."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Tropa", "como_se_cumple": "Apoyando y animando con entusiasmo a los integrantes de la patrulla."}]}$json$::jsonb
  );

  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 7) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, 'd5b111f1-5f6f-4716-8a02-e1826d653c59', 'Demostrando destreza corporal y coordinación motriz en los empujes de hombros.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, 'b12da732-d736-480c-82b8-95b312316390', 'Perfeccionando el control del centro de gravedad y el equilibrio dinámico.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, 'fce82191-77ea-444b-89d9-e33b62a323a5', 'Fomentando la solidaridad y el fair play en las actividades al aire libre.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '117bbf3f-7e3d-4c61-b305-821609bf2e5a', 'Riendo y viviendo la experiencia con optimismo y desinhibición.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '25b24d3a-9d47-44af-b460-680508e644f3', 'Enfrentando los desafíos físicos con caballerosidad y madurez emocional.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '944660c8-0093-4181-ba2c-5f95cc74ba47', 'Velando por el bienestar y el juego limpio de las oponentes.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '58b4936a-816e-4d17-8d0a-c92d0606009d', 'Fortaleciendo mi resistencia y estabilidad al competir fraternalmente por parejas.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '6768d60a-187e-4bbf-97b9-cdc25a316030', 'Esforzándome por superar mis capacidades físicas manteniendo el juego limpio.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '4d66ed86-48ec-4801-bd0a-e5c8d023c8cd', 'Asumiendo los resultados de los duelos con espíritu deportivo y sentido del humor.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '9a38e454-f93a-40a5-9f68-e500ba7e0655', 'Fomentando el compañerismo y el respeto mutuo durante la competencia por patrullas.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, 'a3d7abdf-ca3b-42b8-92b5-403958fb537c', 'Promoviendo el respeto y la consideración por la integridad del rival.') ON CONFLICT DO NOTHING;
  INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) VALUES (v_articulo_id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Apoyando y animando con entusiasmo a los integrantes de la patrulla.') ON CONFLICT DO NOTHING;

END $$;
