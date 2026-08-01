-- Migration for batch insertion of 3 new scout articles with real objectives UUIDs
BEGIN;

    INSERT INTO articulos (autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at)
    VALUES (
      '0d3bc18b-dbc8-4f69-994b-8959472f2f09',
      NULL,
      'Batalla de Bombardeo Táctico',
      'batalla-de-bombardeo-tactico',
      'Juego nocturno campestre de gran escala donde dos bandos compiten por plantar estacas tácticas en territorio enemigo desactivando defensas.',
      '<h2>📜 Descripción del Juego</h2>
<p>La Batalla de Bombardeo Táctico es un apasionante juego de estrategia y acecho nocturno al aire libre. Dos bandos rivales instalan su campamento defensivo en un terreno arbolado y accidentado. La misión central de cada patrulla consiste en incursionar sigilosamente en territorio enemigo para clavar una estaca de madera (bomba táctica) que lleva atada la ''vida'' o cinta del participante, mientras defienden su propia base de las incursiones contrarias.</p>

<h2>🎲 ¿Cómo se juega?</h2>
<figure class="my-6 text-center">
  <img src="/uploads/batalla-de-bombardeo-tactico-croquis.webp" alt="Esquema táctico del juego" class="mx-auto rounded-lg shadow-md max-w-full border border-gray-200" />
  <figcaption class="text-sm text-gray-500 mt-2 italic">Esquema táctico del trazado y distribución del juego.</figcaption>
</figure>

<ol>
  <li><strong>Preparación de Bases:</strong> Cada equipo establece su base en un radio de 25 metros marcado con un farol central. Cada participante lleva una estaca aguzada y una cinta (''vida'') visible en la parte posterior de su pañolín o cinturón.</li>
  <li><strong>Reglas de Combate:</strong> Para eliminar a un enemigo se le debe quitar la cinta por la espalda. Si un jugador entra en base contraria y logra clavar su estaca con la cinta atada a ella, el punto queda registrado oficialmente.</li>
  <li><strong>Coordinación del Jefe de Base:</strong> El dirigente o jefe de equipo permanece en un punto elevado de su base dirigiendo la estrategia defensiva sin salir del perímetro.</li>
  <li><strong>Cierre y Cómputo:</strong> Al finalizar el tiempo estipulado (60 minutos), se reúnen los equipos y el bando que haya clavado más estacas válidas en territorio enemigo se corona ganador.</li>
</ol>',
      '/uploads/batalla-de-bombardeo-tactico.webp',
      'publicado',
      '{"unidades": ["tropa", "avanzada", "clan"], "duracion": "60 minutos", "cantidad": "12 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Estacas", "Cintas", "Linterna"], "areas": ["carácter", "sociabilidad", "corporalidad"], "objetivos": ["Estrategia y planificación", "Promover la elaboración de estrategias", "Trabajo en equipo", "Perder el miedo a la oscuridad"], "justificacion_areas": "Este juego nocturno de gran escala estimula el carácter al exigir autocontrol y calma durante el acecho en la oscuridad. Fomenta la sociabilidad mediante el trabajo estratégico en equipo y ejercita la corporalidad en desplazamientos sigilosos sobre terrenos irregulares.", "variaciones": "<b>Modalidad TEG de Campamento:</b> Si el número de participantes supera las 40 personas, se pueden establecer 3 o 4 bandos enfrentados simultáneamente. <b>Variante con pañolines:</b> Se puede reemplazar la cinta posterior por el pañolín del equipo sujetado suavemente a la cintura.", "recomendaciones": "<b>Seguridad Nocturna:</b> Inspeccionar previamente el terreno eliminando zanjas profundas o alambres de púa. Delimitar claramente las zonas de juego con linternas de referencia. Exigir el uso correcto del pañolín y asegurar que ningún participante quede aislado.", "objetivos_educativos": [{"id": "f77525b1-07a3-4188-9051-4d3ba86aadfc", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "646d5c04-82c3-4280-b3a9-54384e21f4ac", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Participo en actividades que muestran la importancia de actuar con lealtad.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "38f4863e-12a6-4a4b-9767-8cdf55020734", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Sé lo que significa ser leal.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "835ce12d-82cb-471c-a9ed-750d21d7e61e", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Contribuyo para que en mi patrulla nos comprometamos con lo que creemos.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "5311be36-87be-40c4-ab4a-e6ce6e662183", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Entiendo que es importante actuar de acuerdo a lo que pienso.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Me esfuerzo por hacer las cosas según lo que pienso.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "d94bd61b-b8bf-4e80-a790-b5e83532a7b6", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Contribuyo para que en mi Comunidad y en la Avanzada seamos consecuentes.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "1d9d6751-4ab1-45db-9999-3f18606b4909", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Soy fiel a la palabra dada.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}]}'::jsonb,
      ARRAY['juego', 'nocturno', 'estrategia', 'bosque']::text[],
      NOW(),
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      titulo = EXCLUDED.titulo,
      extracto = EXCLUDED.extracto,
      contenido = EXCLUDED.contenido,
      imagen_destacada = EXCLUDED.imagen_destacada,
      metadata = EXCLUDED.metadata,
      etiquetas = EXCLUDED.etiquetas,
      updated_at = NOW();

    -- Category joins for batalla-de-bombardeo-tactico
    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 1 FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 9 FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;
    

    INSERT INTO articulos (autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at)
    VALUES (
      '0d3bc18b-dbc8-4f69-994b-8959472f2f09',
      NULL,
      'Rastreo del Elefante Perdido',
      'rastreo-del-elefante-perdido',
      'Gran juego de acecho y rastro donde las patrullas siguen pistas de lana de colores para rescatar a los elefantes del circo.',
      '<h2>📜 Descripción del Juego</h2>
<p>El Rastreo del Elefante Perdido es un estimulante juego de acecho y rastro al aire libre. La historia cuenta que unos simpáticos elefantes de circo se han extraviado en el bosque dejando mantas deshilachadas. Cada equipo debe seguir los vestigios de lana del color asignado a su patrulla hasta encontrar las gigantescas huellas de talco que los llevarán al refugio final.</p>

<h2>🎲 ¿Cómo se juega?</h2>
<ol>
  <li><strong>Inicio de la Búsqueda:</strong> El responsable del juego reúne a los equipos e introduce la ambientación. Cada patrulla recibe el color de rastro que debe seguir.</li>
  <li><strong>Seguimiento de Pistas:</strong> Los participantes avanzan por el bosque buscando y recolectando los hilos de lana de su color sin tocar los de otros equipos.</li>
  <li><strong>Rastro de Huellas:</strong> Al desaparecer la lana, el equipo debe ubicar las grandes huellas impresas con talco en el suelo que conducen directamente al punto de encuentro.</li>
  <li><strong>Rescate y Recompensa:</strong> En el destino final se encuentran los encargados caracterizados. Para recuperar los elefantes, el equipo junta los tokens de valor escondidos en el entorno y los entrega pacíficamente.</li>
</ol>',
      '/uploads/rastreo-del-elefante-perdido.webp',
      'publicado',
      '{"unidades": ["manada", "compañía", "tropa"], "duracion": "45 minutos", "cantidad": "12 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Lana", "Talco", "Tarjetas"], "areas": ["creatividad", "sociabilidad", "corporalidad"], "objetivos": ["Estimular la observación", "Aprender a seguir instrucciones", "Trabajo en equipo", "Reforzar el desarrollo de los sentidos"], "justificacion_areas": "Desarrolla la capacidad de atención visual y rastreo mediante la observación de pistas de lana y huellas. Estimula la creatividad y el juego simbiótico e impulsa el trabajo cooperativo al sumar recursos en equipo.", "variaciones": "<b>Adaptación en Manada:</b> Se pueden incluir desafíos físicos intermedios o preguntas sobre la Ley del Lobato en cada tramo del rastro. <b>Variante con pañolines:</b> Usar pañolines de colores para identificar a las seisenas o patrullas rastreadoras.", "recomendaciones": "<b>Cuidado Ambiental:</b> Recoger todos los trozos de lana e identificadores al concluir la actividad. Explicar con antelación el valor del respeto por la fauna y la naturaleza.", "objetivos_educativos": [{"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "unidad_id": 1, "area_id": 2, "rango_edad": "Infancia Media", "texto_infantil": "Me gusta participar en juegos de observación.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "a2ef0709-ac6d-4d90-9fe8-c96eeff5cf14", "unidad_id": 1, "area_id": 2, "rango_edad": "Infancia Media", "texto_infantil": "No me olvido de las cosas que me pasan.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "418f2b77-f15b-405a-95bd-8033c0b6a4c2", "unidad_id": 1, "area_id": 2, "rango_edad": "Infancia Tardía", "texto_infantil": "Puedo contar con detalles las anécdotas y aventuras que hemos tenido en la Manada.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "unidad_id": 1, "area_id": 2, "rango_edad": "Infancia Tardía", "texto_infantil": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "9fe305a1-531d-47b6-9aaa-e7d6b2dbd3b1", "unidad_id": 1, "area_id": 2, "rango_edad": "Infancia Tardía", "texto_infantil": "Relaciono las cosas imaginarias con las que pasan de verdad.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "4e6b0cd4-85bb-404b-9af2-36fd5b2a4f04", "unidad_id": 1, "area_id": 2, "rango_edad": "Infancia Tardía", "texto_infantil": "Saco mis propias conclusiones de los cuentos e historias que leo.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "551a36af-f5bc-46f8-9e85-fd5af16a08bd", "unidad_id": 2, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Participo en la organización de las excursiones de mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "unidad_id": 2, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Doy mi opinión sobre las cosas que me pasan.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "unidad_id": 2, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}]}'::jsonb,
      ARRAY['juego', 'rastro', 'observacion', 'exterior']::text[],
      NOW(),
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      titulo = EXCLUDED.titulo,
      extracto = EXCLUDED.extracto,
      contenido = EXCLUDED.contenido,
      imagen_destacada = EXCLUDED.imagen_destacada,
      metadata = EXCLUDED.metadata,
      etiquetas = EXCLUDED.etiquetas,
      updated_at = NOW();

    -- Category joins for rastreo-del-elefante-perdido
    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 1 FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 7 FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;
    

    INSERT INTO articulos (autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at)
    VALUES (
      '0d3bc18b-dbc8-4f69-994b-8959472f2f09',
      NULL,
      'El Enigma de los Palensilux',
      'el-enigma-de-los-palensilux',
      'Desafío estratégico territorial entre dos tribus legendarias por recuperar tesoros ancestrales ocultos usando brazaletes numerados.',
      '<h2>📜 Descripción del Juego</h2>
<p>El Enigma de los Palensilux es un juego de gran escala ambientado en la reconciliación de dos antiguas tribus (los Palen y los Silux). En este desafío de estrategia y velocidad, cada bando debe penetrar en el territorio contrario para rescatar los amuletos sagrados y banderolas ancestrales, enfrentándose mediante brazaletes de jerarquía numéricos ocultos.</p>

<h2>🎲 ¿Cómo se juega?</h2>
<ol>
  <li><strong>Despliegue de Tribus:</strong> El terreno se divide en dos campos equivalentes con una zona de arbitraje en el centro. Cada participante porta un brazalete con un número secreto del 1 al 5.</li>
  <li><strong>Incursión y Reto:</strong> Para capturar a un rival en campo enemigo se le toca y ambos revelan su número. El participante con número menor pierde el duelo y debe acudir al arbitraje a cumplir prenda antes de reingresar. En empate, ambos regresan a su campo.</li>
  <li><strong>Conquista de Amuletos:</strong> El objetivo es tomar los amuletos del campo contrario y trasladarlos con éxito hasta la mesa de arbitraje sin ser tocado.</li>
  <li><strong>Tregua y Paz:</strong> A mitad del juego se declara una tregua para intercambiar brazaletes e idear nuevas tácticas. Al finalizar la jornada, ambas tribus intercambian sus logros en señal de fraternidad scout.</li>
</ol>',
      '/uploads/el-enigma-de-los-palensilux.webp',
      'publicado',
      '{"unidades": ["compañía", "tropa", "avanzada"], "duracion": "60 minutos", "cantidad": "24 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Cartulina", "Brazaletes", "Cuerda"], "areas": ["carácter", "sociabilidad", "creatividad"], "objetivos": ["Promover la elaboración de estrategias", "Toma de Decisiones", "Trabajo en equipo", "Estimular el pensamiento lógico"], "justificacion_areas": "Estimula el pensamiento táctico y la toma de decisiones al lidiar con combates por valor numérico oculto. Refuerza la sociabilidad y el fair play en el intercambio de tesoros e integración de equipos.", "variaciones": "<b>Mesa de Estrategia:</b> A los 30 minutos se realiza una tregua obligatoria de 5 minutos para reevaluar la distribución de brazaletes numéricos. <b>Fase Nocturna:</b> Se puede realizar al anochecer empleando pañolines bicolor e identificadores reflectantes.", "recomendaciones": "<b>Arbitraje Claro:</b> Colocar una zona neutral visible atendida por guiadores o dirigentes para resolver capturas, empates numéricos y custodia de amuletos conquistados.", "objetivos_educativos": [{"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "unidad_id": 2, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Doy mi opinión sobre las cosas que me pasan.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "551a36af-f5bc-46f8-9e85-fd5af16a08bd", "unidad_id": 2, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Participo en la organización de las excursiones de mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "unidad_id": 2, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "9f30f035-9179-4ac4-acfb-bea0e169e97a", "unidad_id": 2, "area_id": 2, "rango_edad": "13 a 15 años", "texto_infantil": "Propongo temas para discutir en mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "unidad_id": 2, "area_id": 2, "rango_edad": "13 a 15 años", "texto_infantil": "Puedo analizar una situación desde distintos puntos de vista.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "e0c02bfe-4056-4d1b-b0b1-013bda1fffa6", "unidad_id": 2, "area_id": 2, "rango_edad": "13 a 15 años", "texto_infantil": "Organizo actividades novedosas para realizar con mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "4bf35d9c-ed0c-46fa-9bfd-0f5e9adff9a3", "unidad_id": 3, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Participo en la organización de las excursiones de mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "e465926e-deed-4341-956f-047f56860e5e", "unidad_id": 3, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "unidad_id": 3, "area_id": 2, "rango_edad": "11 a 13 años", "texto_infantil": "Doy mi opinión sobre las cosas que me pasan.", "texto_terminal": "Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}]}'::jsonb,
      ARRAY['juego', 'estrategia', 'tribus', 'territorio']::text[],
      NOW(),
      NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      titulo = EXCLUDED.titulo,
      extracto = EXCLUDED.extracto,
      contenido = EXCLUDED.contenido,
      imagen_destacada = EXCLUDED.imagen_destacada,
      metadata = EXCLUDED.metadata,
      etiquetas = EXCLUDED.etiquetas,
      updated_at = NOW();

    -- Category joins for el-enigma-de-los-palensilux
    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 1 FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 7 FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;
    
COMMIT;