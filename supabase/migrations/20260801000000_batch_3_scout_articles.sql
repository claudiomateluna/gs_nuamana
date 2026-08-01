-- Migration for batch insertion of 3 new scout articles with real objectives UUIDs
SET client_encoding = 'UTF8';
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
      '{"unidades": ["tropa", "avanzada", "clan"], "duracion": "60 minutos", "cantidad": "12 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Estacas", "Cintas", "Linterna"], "areas": ["carácter", "sociabilidad", "corporalidad"], "objetivos": ["Estrategia y planificación", "Promover la elaboración de estrategias", "Trabajo en equipo", "Perder el miedo a la oscuridad"], "justificacion_areas": "Este juego nocturno de gran escala estimula el carácter al exigir autocontrol y calma durante el acecho en la oscuridad. Fomenta la sociabilidad mediante el trabajo estratégico en equipo y ejercita la corporalidad en desplazamientos sigilosos sobre terrenos irregulares.", "variaciones": "<b>Modalidad TEG de Campamento:</b> Si el número de participantes supera las 40 personas, se pueden establecer 3 o 4 bandos enfrentados simultáneamente. <b>Variante con pañolines:</b> Se puede reemplazar la cinta posterior por el pañolín del equipo sujetado suavemente a la cintura.", "recomendaciones": "<b>Seguridad Nocturna:</b> Inspeccionar previamente el terreno eliminando zanjas profundas o alambres de púa. Delimitar claramente las zonas de juego con linternas de referencia. Exigir el uso correcto del pañolín y asegurar que ningún participante quede aislado.", "objetivos_educativos": [{"id": "f77525b1-07a3-4188-9051-4d3ba86aadfc", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "646d5c04-82c3-4280-b3a9-54384e21f4ac", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Participo en actividades que muestran la importancia de actuar con lealtad.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "38f4863e-12a6-4a4b-9767-8cdf55020734", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Sé lo que significa ser leal.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "835ce12d-82cb-471c-a9ed-750d21d7e61e", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Contribuyo para que en mi patrulla nos comprometamos con lo que creemos.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "5311be36-87be-40c4-ab4a-e6ce6e662183", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Entiendo que es importante actuar de acuerdo a lo que pienso.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Me esfuerzo por hacer las cosas según lo que pienso.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "d94bd61b-b8bf-4e80-a790-b5e83532a7b6", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Contribuyo para que en mi Comunidad y en la Avanzada seamos consecuentes.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "1d9d6751-4ab1-45db-9999-3f18606b4909", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Soy fiel a la palabra dada.", "texto_terminal": "Actúa consecuentemente with los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}]}'::jsonb,
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
      '{"unidades": ["manada", "compañía", "tropa"], "duracion": "45 minutos", "cantidad": "12 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Lana", "Talco", "Tarjetas"], "areas": ["creatividad", "sociabilidad", "corporalidad"], "objetivos": ["Estimular la observación", "Aprender a seguir instrucciones", "Trabajo en equipo", "Reforzar el desarrollo de los sentidos"], "justificacion_areas": "Desarrolla la capacidad de atención visual y rastreo mediante la observación de pistas de lana y huellas. Estimula la creatividad y el juego simbiótico e impulsa el trabajo cooperativo al sumar recursos en equipo.", "variaciones": "<b>Adaptación en Manada:</b> Se pueden incluir desafíos físicos intermedios o preguntas sobre la Ley del Lobato en cada tramo del rastro. <b>Variante con pañolines:</b> Usar pañolines de colores para identificar a las seisenas o patrullas rastreadoras.", "recomendaciones": "<b>Cuidado Ambiental:</b> Recoger todos los trozos de lana e identificadores al concluir la actividad. Explicar con antelación el valor del respeto por la fauna y la naturaleza.", "objetivos_educativos": [{"id": "b76e1d3e-fc1e-4956-806b-f372cd0369bb", "unidad_id": 1, "area_id": 1, "rango_edad": "Infancia Media", "texto_infantil": "Me preocupo porque mi cuerpo esté limpio.", "texto_terminal": "Valora su aspecto y cuida su higiene personal y la de su entorno.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "dff629b3-b399-4eb0-b2d5-c46acd2b8931", "unidad_id": 1, "area_id": 1, "rango_edad": "Infancia Tardía", "texto_infantil": "Ando siempre limpio y se nota, por ejemplo, en mi pelo, orejas, dientes y uñas.", "texto_terminal": "Valora su aspecto y cuida su higiene personal y la de su entorno.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "be23a0f1-0fa3-426a-bf45-80565066d3cb", "unidad_id": 1, "area_id": 1, "rango_edad": "Infancia Tardía", "texto_infantil": "Sé que tengo que comer los alimentos que me ayudan a crecer.", "texto_terminal": "Mantiene una alimentación sencilla y adecuada.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "59c2ff09-83c5-4ace-a5f8-54a8e86c4d9c", "unidad_id": 1, "area_id": 1, "rango_edad": "Infancia Media", "texto_infantil": "Trato de comer de todo y no digo que algo no me gusta sin haberlo probado antes.", "texto_terminal": "Mantiene una alimentación sencilla y adecuada.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "0956c462-5ae8-4a34-8a7d-c08a9b092516", "unidad_id": 1, "area_id": 1, "rango_edad": "Infancia Media", "texto_infantil": "Trato de seguir los consejos que me dan los más grandes para tener un cuerpo fuerte y sano.", "texto_terminal": "Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "27db11c9-fb4d-44a6-96a2-e64e5287f3ee", "unidad_id": 1, "area_id": 1, "rango_edad": "Infancia Tardía", "texto_infantil": "Tengo claro qué cosas ayudan a mi cuerpo a crecer fuerte y sano.", "texto_terminal": "Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "46d36119-8d9f-44f3-ae11-b9851a71eff1", "unidad_id": 3, "area_id": 1, "rango_edad": "11 a 13 años", "texto_infantil": "Me preocupo por mi aspecto personal y porque mi cuerpo esté limpio.", "texto_terminal": "Valora su aspecto y cuida su higiene personal y la de su entorno.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "96bdbf37-8f31-4b08-8583-513072761cc2", "unidad_id": 3, "area_id": 1, "rango_edad": "13 a 15 años", "texto_infantil": "Me preocupo por mi aspecto personal y siempre trato de estar limpio y ordenado.", "texto_terminal": "Valora su aspecto y cuida su higiene personal y la de su entorno.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "36321046-051e-4c14-bb1e-7045faf4f5b4", "unidad_id": 3, "area_id": 1, "rango_edad": "11 a 13 años", "texto_infantil": "Trato de no ser agresivo en juegos y actividades.", "texto_terminal": "Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}]}'::jsonb,
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
      '{"unidades": ["compañía", "tropa", "avanzada"], "duracion": "60 minutos", "cantidad": "24 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Cartulina", "Brazaletes", "Cuerda"], "areas": ["carácter", "sociabilidad", "creatividad"], "objetivos": ["Promover la elaboración de estrategias", "Toma de Decisiones", "Trabajo en equipo", "Estimular el pensamiento lógico"], "justificacion_areas": "Estimula el pensamiento táctico y la toma de decisiones al lidiar con combates por valor numérico oculto. Refuerza la sociabilidad y el fair play en el intercambio de tesoros e integración de equipos.", "variaciones": "<b>Mesa de Estrategia:</b> A los 30 minutos se realiza una tregua obligatoria de 5 minutos para reevaluar la distribución de brazaletes numéricos. <b>Fase Nocturna:</b> Se puede realizar al anochecer empleando pañolines bicolor e identificadores reflectantes.", "recomendaciones": "<b>Arbitraje Claro:</b> Colocar una zona neutral visible atendida por guiadores o dirigentes para resolver capturas, empates numéricos y custodia de amuletos conquistados.", "objetivos_educativos": [{"id": "835ce12d-82cb-471c-a9ed-750d21d7e61e", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Contribuyo para que en mi patrulla nos comprometamos con lo que creemos.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "5311be36-87be-40c4-ab4a-e6ce6e662183", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Entiendo que es importante actuar de acuerdo a lo que pienso.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "unidad_id": 3, "area_id": 3, "rango_edad": "13 a 15 años", "texto_infantil": "Me esfuerzo por hacer las cosas según lo que pienso.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "f77525b1-07a3-4188-9051-4d3ba86aadfc", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "646d5c04-82c3-4280-b3a9-54384e21f4ac", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Participo en actividades que muestran la importancia de actuar con lealtad.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "38f4863e-12a6-4a4b-9767-8cdf55020734", "unidad_id": 3, "area_id": 3, "rango_edad": "11 a 13 años", "texto_infantil": "Sé lo que significa ser leal.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "d94bd61b-b8bf-4e80-a790-b5e83532a7b6", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Contribuyo para que en mi Comunidad y en la Avanzada seamos consecuentes.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "1d9d6751-4ab1-45db-9999-3f18606b4909", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Soy fiel a la palabra dada.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}, {"id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba", "unidad_id": 4, "area_id": 3, "rango_edad": "15 a 17 años", "texto_infantil": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.", "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.", "como_se_cumple": "Participando activamente en la estrategia del juego, colaborando con mi patrulla y respetando las reglas de convivencia y fair play scout."}]}'::jsonb,
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