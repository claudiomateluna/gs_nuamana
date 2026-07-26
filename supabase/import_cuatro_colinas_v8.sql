SET client_encoding = 'UTF8';

DO $$
DECLARE
  v_admin_id UUID;
  v_articulo_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM perfiles WHERE rol_id = 1 LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM perfiles LIMIT 1;
  END IF;

  DELETE FROM articulos WHERE slug = 'desafio-de-las-cuatro-colinas';

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
    'Desafío de las Cuatro Colinas',
    'desafio-de-las-cuatro-colinas',
    $html$<h2>📜 Descripción del Juego</h2>
<p><strong>El Desafío de las Cuatro Colinas</strong> es un clásico e intenso juego nocturno de acecho, estrategia y observación en terreno accidentado o boscoso. La actividad contrapone a dos equipos —atacantes y defensores— en una prueba de sigilo, coordinación y control del miedo a la oscuridad.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Delimitación del Área:</strong> Se selecciona un terreno arbolado o con desnivel (una colina o bosque abierto). El perímetro central se delimita mediante 4 pañolines marcadores o linternas tenues. Un grupo reducido de árbitros o dirigentes permanece dentro de la zona central.</li>
  <li><strong>Organización de Equipos:</strong> Los participantes se dividen en dos grupos: un tercio actúa como fuerza atacante y dos tercios se despliegan como defensores alrededor del perímetro exterior.</li>
  <li><strong>Misión de los Atacantes:</strong> Los atacantes deben infiltrarse desde el exterior hacia la zona delimitada sin ser identificados. Su objetivo es ingresar al perímetro y descubrir la clave visual o el número secreto asignado al centro.</li>
  <li><strong>Misión de los Defensores:</strong> Los defensores patrullan el contorno equipados con linternas. Si un defensor avista a un atacante, debe iluminarlo y pronunciar su nombre completo en voz alta para enviarlo a la "prisión" del campamento.</li>
  <li><strong>Victoria:</strong> Gana el equipo atacante si logra ingresar al perímetro y registrar el código antes de que expire el tiempo, o el equipo defensor si elimina a la mayoría de los infiltrados.</li>
</ol>$html$,
    'Un clásico juego nocturno de acecho y estrategia en bosque donde dos equipos compiten por la infiltración y defensa de un perímetro.',
    '/uploads/actividad_cuatroColinas.webp',
    'publicado',
    ARRAY['juego-nocturno', 'acecho', 'estrategia', 'exterior', 'bosque'],
    $json${"unidades": ["compañía", "tropa", "avanzada", "clan"], "duracion": "60 minutos", "cantidad": "16 participantes", "lugares": ["Exterior", "campo abierto"], "materiales": ["Pañolines", "Linternas", "Silbato"], "areas": ["Corporalidad", "Creatividad", "Carácter"], "objetivos": ["Perder el miedo a la oscuridad", "Estrategia y planificación", "Refuerzo de habilidades físicas", "Estimular la agilidad mental"], "justificacion_areas": "El Desafío de las Cuatro Colinas estimula la corporalidad a través del desplazamiento ágil y sigiloso en terreno accidentado. Desarrolla la creatividad táctica al idear rutas de camuflaje y fortalece el carácter al poner a prueba el autocontrol y la valentía frente a la penumbra nocturna.", "variaciones": "Desafío con Linterna de Destello Fijo: Los defensores solo pueden encender su linterna en ráfagas breves de 3 segundos para rastrear el terreno, lo que exige mayor atención auditiva.\n\nInfiltración por Patrullas: Los atacantes se mueven tomados por una cuerda en escuadras de 4 integrantes, exigiendo perfecta coordinación del grupo para no hacer ruido.\n\nBúsqueda de Mensaje Cifrado: En lugar de un código simple, los atacantes deben localizar 4 fragmentos de una clave morse repartidos entre los marcadores de las colinas.", "recomendaciones": "Inspección Previa del Terreno: Es indispensable que los dirigentes recorran la zona a plena luz del día para marcar huecos, ramas bajas, zanjas o zonas de riesgo con cinta reflectante.\n\nDelimitación Estricta de Límites: Definir claramente las fronteras del juego para evitar que los participantes se alejen en la penumbra. Usar silbato de emergencia (3 pitazos largos = detención inmediata).\n\nEquipamiento Obligatorio: Todos los jóvenes deben usar calzado de montaña firme, ropa oscura y llevar una linterna personal (con filtro rojo preferentemente para no perder la visión nocturna).\n\nDinamización y Árbitros: Ubicar dirigentes estratégicos en el centro y las fronteras para validar las capturas con imparcialidad y mantener el entusiasmo del juego.", "objetivos_educativos": [{"id": "39a993cd-7703-4757-8782-4f39d5e0dda2", "area": "Creatividad", "texto": "Conozco los diferentes ecosistemas de mi país.", "unidad": "Tropa", "como_se_cumple": "Aprovechando la topografía y la vegetación de la colina como elementos de camuflaje táctico."}, {"id": "8fb20cc7-537c-48c3-95dc-f1e836d576a2", "area": "Creatividad", "texto": "Aplico técnicas que me permiten mejorar el medioambiente y no dañar los lugares en que acampo.", "unidad": "Tropa", "como_se_cumple": "Diseñando rutas de avance sigilosas con mi patrulla sin alterar ni dañar el entorno boscoso."}, {"id": "658630b7-58fa-4ea9-8285-35ded35e3688", "area": "Creatividad", "texto": "Conozco los diferentes ecosistemas de mi país.", "unidad": "Compañía", "como_se_cumple": "Utilizando las sombras del bosque y el relieve de la colina para el avance de la patrulla."}, {"id": "6f041425-5479-45ee-9855-3c02fc79525a", "area": "Creatividad", "texto": "Aplico técnicas que me permiten mejorar el medioambiente y no dañar los lugares en que acampo.", "unidad": "Compañía", "como_se_cumple": "Ideando tácticas de infiltración respetuosas con la vegetación del terreno acotado."}, {"id": "7e7417a5-a16e-4ff3-843f-93e711d017d4", "area": "Creatividad", "texto": "Aplico en campamentos o proyectos específicos tecnologías que preservan o mejoran el medio ambiente.", "unidad": "Avanzada", "como_se_cumple": "Estructurando técnicas de orientación nocturna respetando la flora y fauna silvestre."}, {"id": "c4f78e61-6790-4cf4-b477-993900b5bf02", "area": "Creatividad", "texto": "Contribuyo a preservar la vida a través de la conservación de la integridad del mundo natural.", "unidad": "Clan", "como_se_cumple": "Promoviendo el cuidado ambiental y la integración ética con la naturaleza durante las actividades de campamento."}, {"id": "58b4936a-816e-4d17-8d0a-c92d0606009d", "area": "Corporalidad", "texto": "Participo en los juegos, excursiones y campamentos que organiza mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Demostrando resistencia física y agilidad al desplazarme por el terreno boscoso durante el juego nocturno."}, {"id": "6768d60a-187e-4bbf-97b9-cdc25a316030", "area": "Corporalidad", "texto": "Ayudo a preparar los juegos, excursiones y campamentos de mi patrulla y mi Tropa.", "unidad": "Tropa", "como_se_cumple": "Moviéndome con destreza y seguridad en la penumbra sin poner en riesgo mi integridad física."}, {"id": "d5b111f1-5f6f-4716-8a02-e1826d653c59", "area": "Corporalidad", "texto": "Participo en los juegos, excursiones y campamentos que organiza mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Ejercitando mi equilibrio y marcha sigilosa en terreno accidentado durante la noche."}, {"id": "2d033cc1-87bb-4990-846e-bbac8a4249fe", "area": "Corporalidad", "texto": "Ayudo a preparar los juegos, excursiones y campamentos de mi patrulla y mi Compañía.", "unidad": "Compañía", "como_se_cumple": "Coordinando el despliegue físico ágil de las guías para vulnerar el perímetro de observación."}, {"id": "7200435f-b020-46fc-b323-8249048b1d18", "area": "Corporalidad", "texto": "Participo en la organización de juegos y actividades recreativas para los demás.", "unidad": "Avanzada", "como_se_cumple": "Liderando desplazamientos físicos exigentes y dinámicas recreativas nocturnas con la comunidad caminante."}, {"id": "106e27af-ec7a-45fa-9295-fcef88fbef3d", "area": "Corporalidad", "texto": "Convivo constantemente en la naturaleza y participo en actividades deportivas y recreativas.", "unidad": "Clan", "como_se_cumple": "Ejercitando la aptitud física y la convivencia al aire libre durante las pruebas nocturnas del clan."}, {"id": "0969a204-e8c6-4ab6-ac4f-c777bae066df", "area": "Carácter", "texto": "Aprecio los consejos que me dan en mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Superando el temor a la oscuridad y manteniendo la calma bajo las indicaciones del equipo."}, {"id": "f608eb2d-613a-477a-86f9-03e769a87bf2", "area": "Carácter", "texto": "Ayudo a mis compañeros de patrulla a superarse.", "unidad": "Tropa", "como_se_cumple": "Manteniendo la disciplina del silencio y apoyando a mis compañeros durante el acecho."}, {"id": "81cd6596-30cd-40fe-83e8-c86bf12a21f2", "area": "Carácter", "texto": "Aprecio los consejos que me dan en mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Escuchando las sugerencias tácticas de la patrulla para actuar con temple en la penumbra."}, {"id": "0da6c9df-7a09-44cd-9961-e06c0173d41a", "area": "Carácter", "texto": "Ayudo a mis compañeras de patrulla a superarse.", "unidad": "Compañía", "como_se_cumple": "Brindando confianza y contención a las integrantes de la patrulla durante la infiltración."}, {"id": "04ded0fb-289b-4d90-9f5f-821ec20a56c7", "area": "Carácter", "texto": "Aporto mi experiencia personal en las reuniones de mi Comunidad.", "unidad": "Avanzada", "como_se_cumple": "Aportando serenidad, autodisciplina y toma de decisiones tácticas frente a situaciones de presión."}, {"id": "8df0eaed-f805-4347-881d-3d5fac18c8a5", "area": "Carácter", "texto": "Reconozco en mi grupo de pertenencia un apoyo para mi crecimiento personal y para la realización de mi proyecto de vida.", "unidad": "Clan", "como_se_cumple": "Coordinando con fraternidad la estrategia de acecho con mis pares de clan y fortaleciendo la confianza del grupo."}]}$json$::jsonb
  );

  -- Categoría Hija: Juegos Nocturnos (ID: 9), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 9) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
