-- Migration for batch insertion of 3 new scout articles with PERFECT JUSTIFICACION_AREAS
SET client_encoding = 'UTF8';
BEGIN;

    INSERT INTO articulos (autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at)
    VALUES (
      NULL,
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
      '{"unidades": ["tropa", "avanzada", "clan"], "duracion": "60 minutos", "cantidad": "12 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Estacas", "Cintas", "Linterna"], "areas": ["carácter", "sociabilidad", "corporalidad"], "objetivos": ["Estrategia y planificación", "Promover la elaboración de estrategias", "Trabajo en equipo", "Perder el miedo a la oscuridad"], "justificacion_areas": "Esta actividad de gran escala ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Carácter:</b> Desarrolla el autocontrol emocional, la valentía y la serenidad al tomar decisiones tácticas individuales y de patrulla bajo la presión del acecho nocturno y el temor a la oscuridad.\n\n2. <b>Sociabilidad:</b> Fortalece el trabajo en equipo, la lealtad y el acatamiento consciente de las normas de fair play y arbitraje al coordinar incursiones ofensivas y la custodia colectiva de la base.\n\n3. <b>Corporalidad:</b> Estimula la agilidad física, el equilibrio y la autorregulación del esfuerzo muscular durante desplazamientos sigilosos y carrerajes sobre terrenos irregulares y arbolados.", "variaciones": "<b>Modalidad TEG de Campamento:</b> Si el número de participantes supera las 40 personas, se pueden establecer 3 o 4 bandos enfrentados simultáneamente. <b>Variante con pañolines:</b> Se puede reemplazar la cinta posterior por el pañolín del equipo sujetado suavemente a la cintura.", "recomendaciones": "<b>Seguridad Nocturna:</b> Inspeccionar previamente el terreno eliminando zanjas profundas o alambres de púa. Delimitar claramente las zonas de juego con linternas de referencia. Exigir el uso correcto del pañolín y asegurar que ningún participante quede aislado.", "objetivos_educativos": [{"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Evaluando con serenidad y autocrítica mis desplazamientos de acecho durante las incursiones nocturnas."}, {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Cumplo los compromisos que asumo.", "como_se_cumple": "Respetando con fair play las reglas del combate nocturno y acatando las indicaciones del dirigente de base."}, {"id": "36321046-051e-4c14-bb1e-7045faf4f5b4", "area": "Corporalidad", "unidad": "Tropa", "texto": "Trato de no ser agresivo en juegos y actividades.", "como_se_cumple": "Desplazándome con precaución y agilidad sigilosa sobre el terreno arbolado en la oscuridad."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Aceptando mis fortalezas físicas para orientar con autocontrol la defensa de mi base."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "como_se_cumple": "Coordinando acciones solidarias en equipo para proteger las estacas tácticas de mi patrulla."}, {"id": "333453ab-e111-4f06-b0e3-a3e7f06b2439", "area": "Corporalidad", "unidad": "Tropa", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "como_se_cumple": "Orientando mis impulsos físicos y velocidad en la carrera para evitar accidentes en el bosque."}, {"id": "33d5c450-baaa-40c2-bdde-6b354868cabd", "area": "Carácter", "unidad": "Avanzada", "texto": "Conozco mis capacidades y limitaciones y puedo proyectarlas para mi vida adulta.", "como_se_cumple": "Superando la ansiedad en la oscuridad y manteniendo el control emocional en la toma de decisiones."}, {"id": "007591fb-a2b6-4fb5-9286-acde65455f53", "area": "Sociabilidad", "unidad": "Avanzada", "texto": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.", "como_se_cumple": "Organizando a los integrantes de la avanzada con lealtad y velando por la seguridad de cada compañero."}, {"id": "05f42879-f5f5-40c4-bed6-c577bf61340a", "area": "Corporalidad", "unidad": "Avanzada", "texto": "Cuido mi salud y mantengo hábitos que la protegen.", "como_se_cumple": "Regulando el esfuerzo muscular durante las carreras continuas en la captura de zonas enemigas."}, {"id": "8f0eb7d9-c291-44f3-9551-4330c19e0cc2", "area": "Carácter", "unidad": "Clan", "texto": "Conozco mis posibilidades y limitaciones, aceptándome con capacidad de autocrítica y manteniendo a la vez una buena imagen de mí mismo.", "como_se_cumple": "Liderando con madurez las decisiones tácticas de mi bando y asumiendo con autocrítica el resultado final."}, {"id": "b5a81328-5c07-41bd-a1ea-1ed401762841", "area": "Sociabilidad", "unidad": "Clan", "texto": "Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo mis obligaciones y defendiendo igual derecho para los demás.", "como_se_cumple": "Fomentando la fraternidad scout y el sentido de pertenencia grupal en la evaluación del juego."}, {"id": "69fff91f-a493-483d-92d6-8319700236c2", "area": "Corporalidad", "unidad": "Clan", "texto": "Conozco los procesos biológicos que regulan mi organismo, protejo mi salud, acepto mis posibilidades físicas y oriento mis impulsos y fuerzas.", "como_se_cumple": "Demostrando resistencia física equilibrada y dinamismo corporal durante el juego nocturno."}]}'::jsonb,
      ARRAY['juego', 'nocturno', 'estrategia', 'bosque']::text[],
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

    -- Category joins for batalla-de-bombardeo-tactico
    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 1 FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 9 FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    -- Clean relational objectives for batalla-de-bombardeo-tactico
    DELETE FROM articulo_objetivos_educativos 
    WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico');
    
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', 'Evaluando con serenidad y autocrítica mis desplazamientos de acecho durante las incursiones nocturnas.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Respetando con fair play las reglas del combate nocturno y acatando las indicaciones del dirigente de base.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '36321046-051e-4c14-bb1e-7045faf4f5b4', 'Desplazándome con precaución y agilidad sigilosa sobre el terreno arbolado en la oscuridad.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '78bd48d3-5d26-4218-843a-33712bade630', 'Aceptando mis fortalezas físicas para orientar con autocontrol la defensa de mi base.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Coordinando acciones solidarias en equipo para proteger las estacas tácticas de mi patrulla.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '333453ab-e111-4f06-b0e3-a3e7f06b2439', 'Orientando mis impulsos físicos y velocidad en la carrera para evitar accidentes en el bosque.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '33d5c450-baaa-40c2-bdde-6b354868cabd', 'Superando la ansiedad en la oscuridad y manteniendo el control emocional en la toma de decisiones.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '007591fb-a2b6-4fb5-9286-acde65455f53', 'Organizando a los integrantes de la avanzada con lealtad y velando por la seguridad de cada compañero.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '05f42879-f5f5-40c4-bed6-c577bf61340a', 'Regulando el esfuerzo muscular durante las carreras continuas en la captura de zonas enemigas.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '8f0eb7d9-c291-44f3-9551-4330c19e0cc2', 'Liderando con madurez las decisiones tácticas de mi bando y asumiendo con autocrítica el resultado final.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, 'b5a81328-5c07-41bd-a1ea-1ed401762841', 'Fomentando la fraternidad scout y el sentido de pertenencia grupal en la evaluación del juego.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '69fff91f-a493-483d-92d6-8319700236c2', 'Demostrando resistencia física equilibrada y dinamismo corporal durante el juego nocturno.' FROM articulos WHERE slug = 'batalla-de-bombardeo-tactico'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        

    INSERT INTO articulos (autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at)
    VALUES (
      NULL,
      NULL,
      'Rastreo del Elefante Perdido',
      'rastreo-del-elefante-perdido',
      'Gran juego de acecho y rastro donde las patrullas siguen pistas de lana de colores para rescatar a los elefantes del circo.',
      '<h2>📜 Descripción y Ambientación del Juego (Marco Simbólico)</h2>
<p><strong>El Rastreo del Elefante Perdido</strong> es un apasionante juego de rastro, acecho y rescate ambientado en una intrépida historia de circo y misterio.</p>

<p>La historia cuenta que los queridísimos elefantes del Gran Circo Ambulante no solo se escaparon de su carpa, sino que fueron <strong>emboscados y secuestrados por una astuta banda de ladrones de animales</strong>, quienes los llevan encadenados hacia su guarida secreta en lo profundo del bosque. Durante la huida, las mantas de colores de los elefantes se fueron deshilachando en los arbustos y el peso de los animales dejó gigantescas huellas de talco en la tierra.</p>

<p>Cada seisena o patrulla asume el rol de una brigada de rescate scout. Su misión es seguir las pistas de lana de su color, rastrear las pisadas en el suelo, encontrar los tokens de pista robados por los ladrones y confrontar a los secuestradores en su guarida para liberar a los elefantes y llevarlos a salvo de regreso.</p>

<h2>🎲 ¿Cómo se juega? Paso a Paso Detallado</h2>
<ol>
  <li><strong>La Noticia del Secuestro y Asignación de Equipos:</strong>
    <ul>
      <li>El dirigente o Gran Cazador reúne a la unidad y lee el comunicado urgente del Circo: ¡Los ladrones han raptado a los elefantes!</li>
      <li>Se asigna a cada brigada el rastro del color de manta correspondiente a su elefante asignado (ej: Seisena Amarilla sigue lana amarilla).</li>
    </ul>
  </li>
  <li><strong>Seguimiento de Pistas de Lana y Acecho:</strong>
    <ul>
      <li>Los scouts se adentran en el bosque siguiendo los trozos de lana atados por los ladrones en ramas y matorrales.</li>
      <li><strong>Regla de Respeto:</strong> Cada brigada solo puede recolectar la lana de su propio color sin interferir con las pistas de otras patrullas.</li>
    </ul>
  </li>
  <li><strong>El Rastro de Huellas y los Tokens del Botín:</strong>
    <ul>
      <li>Al desaparecer la lana, el camino es marcado por gigantescas pisadas impresas con talco o harina.</li>
      <li>En este tramo, los ladrones dejaron caer <strong>5 tokens de botín (tarjetas o monedas de madera)</strong>. Para recoger cada token, la brigada debe resolver el desafío scout escrito en él (preguntas de naturaleza, nudos o agilidad).</li>
    </ul>
  </li>
  <li><strong>Enfrentamiento en la Guarida de los Ladrones y Rescate:</strong>
    <ul>
      <li>Las huellas de talco terminan en la <em>Guarida de los Ladrones</em> (atendida por dirigentes caracterizados con disfraces de secuestradores).</li>
      <li>Los scouts deben entregar los 5 tokens del botín recuperados y superar la prueba final de astucia exigida por los ladrones para lograr que liberen al elefante y les entreguen su tótem sagrado.</li>
    </ul>
  </li>
</ol>

<h2>🏆 Cómputo de Puntos y Condición de Victoria</h2>
<p>La victoria la obtiene la brigada de rescate que logre liberar a su elefante en primer lugar y acumule el mayor puntaje al finalizar los 45 minutos de juego:</p>
<ul>
  <li><strong>Primera brigada en rescatar a su elefante de la guarida:</strong> 30 puntos.</li>
  <li><strong>Cada token de botín recuperado y resuelto:</strong> 10 puntos.</li>
  <li><strong>Trabajo en equipo y fair play al confrontar a los ladrones:</strong> 10 puntos bonus.</li>
</ul>
<p>Al concluir el rescate, ambas brigadas y los dirigentes celebran la liberación en la Gran Danza del Circo y limpian los rastros de lana del bosque.</p>',
      '/uploads/rastreo-del-elefante-perdido.webp',
      'publicado',
      '{"unidades": ["manada", "compañía", "tropa"], "duracion": "45 minutos", "cantidad": "12 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Lana", "Talco", "Tarjetas"], "areas": ["creatividad", "sociabilidad", "corporalidad"], "objetivos": ["Estimular la observación", "Aprender a seguir instrucciones", "Trabajo en equipo", "Reforzar el desarrollo de los sentidos"], "justificacion_areas": "Esta actividad de acecho y rastro ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Creatividad:</b> Estimula la agilidad mental, la curiosidad y la resolución de problemas al interpretar pistas deshilachadas de lana e hipótesis de rastreo al desaparecer las huellas de talco.\n\n2. <b>Sociabilidad:</b> Promueve el trabajo cooperativo en equipo, la distribución equitativa de tareas y el respeto por los pares al recolectar pistas sin alterar el entorno ni interferir con seisenas rivales.\n\n3. <b>Corporalidad:</b> Ejercita la resistencia física, la atención sensorial visual y la coordinación motriz durante caminatas de exploración y observación en ambientes naturales.", "variaciones": "<b>Adaptación en Manada:</b> Se pueden incluir desafíos físicos intermedios o preguntas sobre la Ley del Lobato en cada tramo del rastro. <b>Variante con pañolines:</b> Usar pañolines de colores para identificar a las seisenas o patrullas rastreadoras.", "recomendaciones": "<b>Cuidado Ambiental:</b> Recoger todos los trozos de lana e identificadores al concluir la actividad. Explicar con antelación el valor del respeto por la fauna y la naturaleza.", "objetivos_educativos": [{"id": "36d989b6-30dd-434a-874a-70a993ed0bec", "area": "Corporalidad", "unidad": "Manada", "texto": "Conozco las principales enfermedades que me pueden dar y por qué.", "como_se_cumple": "Ejercitando mi resistencia y agilidad al recorrer los senderos del bosque buscando pistas de lana."}, {"id": "24addc27-b61b-44c5-ad5d-8bd12d1c4664", "area": "Corporalidad", "unidad": "Manada", "texto": "Arreglo mis problemas con mis compañeros sin usar la fuerza.", "como_se_cumple": "Cuidando mi equilibrio e higiene corporal durante la caminata de rastreo en la naturaleza."}, {"id": "03ee81d8-8e06-446d-82be-7d5e7fe3f392", "area": "Creatividad", "unidad": "Manada", "texto": "Leo las historias que me recomiendan mis papás, profesores y dirigentes.", "como_se_cumple": "Imaginando y descifrando en equipo la ruta fantástica trazada por las marcas de talco."}, {"id": "252e20b0-1f6a-48ff-8c52-5645b7eaebdf", "area": "Creatividad", "unidad": "Manada", "texto": "Soy capaz de contarle a los demás lo que leo y aprendo.", "como_se_cumple": "Descubriendo con ingenio las pistas escondidas para ubicar el refugio final de los elefantes."}, {"id": "201cf9be-ca1f-40c4-a20a-ee589346e863", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo en mi casa tan pronto como me lo piden.", "como_se_cumple": "Respetando la consigna de recolectar solo la lana de mi seisena y apoyando a mis compañeros."}, {"id": "3b6cf976-db3d-479e-b214-f165bf311a5f", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo siempre en las tareas que hay que hacer en mi casa y en la escuela.", "como_se_cumple": "Compartiendo las pistas encontradas y ayudando a mantener la cohesión alegre del grupo."}, {"id": "0ba0d3c3-a50a-4a04-8981-601dc7746dd6", "area": "Corporalidad", "unidad": "Compañía", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "como_se_cumple": "Desplazándome con agilidad física y precaución por el parque durante la búsqueda de rastro."}, {"id": "52d9399a-4bf1-4010-a7ca-682b7d1c22a8", "area": "Corporalidad", "unidad": "Compañía", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "como_se_cumple": "Regulando la velocidad de avance en terreno irregular para cuidar la integridad de la patrulla."}, {"id": "0fc96b82-592d-4237-9986-baeb2ba049fa", "area": "Creatividad", "unidad": "Compañía", "texto": "Busco mis propias lecturas y puedo relacionarlas con las cosas que me pasan.", "como_se_cumple": "Proponiendo hipótesis creativas de rastreo cuando los hilos desaparecen entre los arbustos."}, {"id": "aacee532-b682-4d8e-8c5d-d6e9396162a4", "area": "Creatividad", "unidad": "Compañía", "texto": "Me preocupo por saber cada vez más sobre los temas que me interesan.", "como_se_cumple": "Analizando críticamente los detalles del terreno para deducir la ruta hacia el refugio."}, {"id": "047150a7-8af8-4ecf-9495-b371dda0e598", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Sé qué hacen los bomberos, la policía, los hospitales, el municipio y otros servicios públicos de mi comunidad.", "como_se_cumple": "Fomentando el trabajo cooperativo y la distribución equitativa de responsabilidades en la patrulla."}, {"id": "5676c7f9-7ae5-4c1c-aece-adb2aa0f35cd", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Conozco las diferentes posiciones políticas que hay en mi país.", "como_se_cumple": "Sirviendo activamente a la patrulla en la recolección ordenada de los tokens sin dañar la flora."}, {"id": "36321046-051e-4c14-bb1e-7045faf4f5b4", "area": "Corporalidad", "unidad": "Tropa", "texto": "Trato de no ser agresivo en juegos y actividades.", "como_se_cumple": "Manteniendo una postura segura y agilidad de movimiento en el recorrido de observación."}, {"id": "333453ab-e111-4f06-b0e3-a3e7f06b2439", "area": "Corporalidad", "unidad": "Tropa", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "como_se_cumple": "Demostrando resistencia física y autocontrol al explorar zonas boscosas accidentadas."}, {"id": "289e03b9-f6dd-4fde-b121-82470456247e", "area": "Creatividad", "unidad": "Tropa", "texto": "Busco mis propias lecturas y puedo relacionarlas con las cosas que me pasan.", "como_se_cumple": "Analizando con atención las señales del entorno para deducir la dirección del rastro."}, {"id": "071e6f2d-cb33-48c7-a385-4c63d873b254", "area": "Creatividad", "unidad": "Tropa", "texto": "Me preocupo por saber cada vez más sobre los temas que me interesan.", "como_se_cumple": "Relacionando las pistas encontradas con el mapa del área para optimizar la búsqueda."}, {"id": "0d3b6b51-07ed-4d62-ba46-e68bab986e57", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Participo en las actividades de servicio que organiza mi patrulla.", "como_se_cumple": "Sirviendo con iniciativa a mi patrulla en la recolección ordenada de las tarjetas de pista."}, {"id": "02b90ae6-edbc-4221-a9ec-4ac50d8b8b30", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Propongo actividades de servicio de mi patrulla y Tropa y colaboro en su organización.", "como_se_cumple": "Promoviendo el trabajo en equipo y el apoyo fraterno a los scouts recién ingresados."}]}'::jsonb,
      ARRAY['juego', 'rastro', 'observacion', 'exterior']::text[],
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

    -- Category joins for rastreo-del-elefante-perdido
    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 1 FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 7 FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    -- Clean relational objectives for rastreo-del-elefante-perdido
    DELETE FROM articulo_objetivos_educativos 
    WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'rastreo-del-elefante-perdido');
    
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '36d989b6-30dd-434a-874a-70a993ed0bec', 'Ejercitando mi resistencia y agilidad al recorrer los senderos del bosque buscando pistas de lana.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '24addc27-b61b-44c5-ad5d-8bd12d1c4664', 'Cuidando mi equilibrio e higiene corporal durante la caminata de rastreo en la naturaleza.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '03ee81d8-8e06-446d-82be-7d5e7fe3f392', 'Imaginando y descifrando en equipo la ruta fantástica trazada por las marcas de talco.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '252e20b0-1f6a-48ff-8c52-5645b7eaebdf', 'Descubriendo con ingenio las pistas escondidas para ubicar el refugio final de los elefantes.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '201cf9be-ca1f-40c4-a20a-ee589346e863', 'Respetando la consigna de recolectar solo la lana de mi seisena y apoyando a mis compañeros.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '3b6cf976-db3d-479e-b214-f165bf311a5f', 'Compartiendo las pistas encontradas y ayudando a mantener la cohesión alegre del grupo.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '0ba0d3c3-a50a-4a04-8981-601dc7746dd6', 'Desplazándome con agilidad física y precaución por el parque durante la búsqueda de rastro.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '52d9399a-4bf1-4010-a7ca-682b7d1c22a8', 'Regulando la velocidad de avance en terreno irregular para cuidar la integridad de la patrulla.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '0fc96b82-592d-4237-9986-baeb2ba049fa', 'Proponiendo hipótesis creativas de rastreo cuando los hilos desaparecen entre los arbustos.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, 'aacee532-b682-4d8e-8c5d-d6e9396162a4', 'Analizando críticamente los detalles del terreno para deducir la ruta hacia el refugio.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '047150a7-8af8-4ecf-9495-b371dda0e598', 'Fomentando el trabajo cooperativo y la distribución equitativa de responsabilidades en la patrulla.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '5676c7f9-7ae5-4c1c-aece-adb2aa0f35cd', 'Sirviendo activamente a la patrulla en la recolección ordenada de los tokens sin dañar la flora.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '36321046-051e-4c14-bb1e-7045faf4f5b4', 'Manteniendo una postura segura y agilidad de movimiento en el recorrido de observación.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '333453ab-e111-4f06-b0e3-a3e7f06b2439', 'Demostrando resistencia física y autocontrol al explorar zonas boscosas accidentadas.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '289e03b9-f6dd-4fde-b121-82470456247e', 'Analizando con atención las señales del entorno para deducir la dirección del rastro.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '071e6f2d-cb33-48c7-a385-4c63d873b254', 'Relacionando las pistas encontradas con el mapa del área para optimizar la búsqueda.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '0d3b6b51-07ed-4d62-ba46-e68bab986e57', 'Sirviendo con iniciativa a mi patrulla en la recolección ordenada de las tarjetas de pista.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '02b90ae6-edbc-4221-a9ec-4ac50d8b8b30', 'Promoviendo el trabajo en equipo y el apoyo fraterno a los scouts recién ingresados.' FROM articulos WHERE slug = 'rastreo-del-elefante-perdido'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        

    INSERT INTO articulos (autor_id, categoria_id, titulo, slug, extracto, contenido, imagen_destacada, estado, metadata, etiquetas, created_at, updated_at)
    VALUES (
      NULL,
      NULL,
      'El Enigma de los Palensilux',
      'el-enigma-de-los-palensilux',
      'Desafío estratégico territorial entre dos tribus legendarias por recuperar tesoros ancestrales ocultos usando brazaletes numerados.',
      '<h2>📜 Descripción y Ambientación del Juego</h2>
<p><strong>El Enigma de los Palensilux</strong> es un juego de gran escala de estrategia territorial, acecho y velocidad. En este desafío, cada equipo debe incursionar en el campo contrario para apoderarse de la mayor cantidad posible de objetos sagrados (amuletos y banderolas) y llevarlos a su zona de arbitraje, evitando al mismo tiempo que el bando enemigo capture los objetos del campo propio.</p>
<p>Los enfrentamientos individuales entre guerreros no se deciden por la fuerza física, sino mediante un sistema de brazaletes con jerarquías numéricas secretas del 1 al 5.</p>

<h2>🎲 ¿Cómo se juega?</h2>
<ol>
  <li><strong>Delimitación del Terreno:</strong> El campo se divide en dos zonas equivalentes separadas por una Zona Neutral (Mesa de Arbitraje). Al fondo de cada campo se ubica el Santuario Tribal con 5 amuletos y 1 banderola ancestral.</li>
  <li><strong>Asignación de Brazaletes:</strong> Cada participante lleva un brazalete con un número secreto del 1 al 5. El número mayor vence al menor (5 vence a 4, 3, 2). El número 1 (Espía) vence únicamente al 5 (Jefe).</li>
  <li><strong>Incursión y Reto:</strong> Los jugadores avanzan al campo contrario buscando tomar los objetos enemigos. Si un defensor toca a un invasor exclamando <em>«¡Enigma!»</em>, ambos muestran su número. El perdedor entrega su brazalete y acude al arbitraje a cumplir una prenda antes de reingresar. En empate, ambos regresan a su campo.</li>
  <li><strong>Captura de Objetos:</strong> Cada jugador puede trasladar solo un objeto a la vez. Si cae eliminado mientras lo lleva, debe dejar el objeto en el suelo para que un defensor de su equipo lo recupere.</li>
  <li><strong>Tregua Táctica:</strong> A los 30 minutos se realiza una tregua de 5 minutos para reorganizar brazaletes e idear nuevas tácticas.</li>
</ol>

<h2>🏆 Cómputo de Puntos y Victoria</h2>
<p>El juego concluye a los 60 minutos o al capturar todos los objetos enemigos. Gana la tribu que acumule más puntos (10 pts por amuleto, 25 pts por banderola y 2 pts por brazalete trofeo). Al finalizar, se realiza el Gran Círculo de la Paz e intercambio de abrazos scouts.</p>',
      '/uploads/el-enigma-de-los-palensilux.webp',
      'publicado',
      '{"unidades": ["compañía", "tropa", "avanzada"], "duracion": "60 minutos", "cantidad": "24 participantes", "lugares": ["Exterior", "Campo Abierto", "Bosque"], "materiales": ["Cartulina", "Brazaletes", "Cuerda"], "areas": ["carácter", "sociabilidad", "creatividad"], "objetivos": ["Promover la elaboración de estrategias", "Toma de Decisiones", "Trabajo en equipo", "Estimular el pensamiento lógico"], "justificacion_areas": "Esta gran actividad territorial ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Carácter:</b> Desarrolla la honestidad, la templanza y el fair play al aceptar deportivamente las derrotas en duelos numéricos secretos y cumplir con madurez las prendas del arbitraje.\n\n2. <b>Sociabilidad:</b> Fomenta la fraternidad, el respeto por las normas comunitarias y la integración de unidades al negociar en la tregua táctica y realizar el intercambio final de trofeos.\n\n3. <b>Creatividad:</b> Estimula la astucia táctica, la toma rápida de decisiones y la capacidad de innovación al diseñar emboscadas, combinaciones de brazaletes y maniobras de distracción.", "variaciones": "<b>Mesa de Estrategia:</b> A los 30 minutos se realiza una tregua obligatoria de 5 minutos para reevaluar la distribución de brazaletes numéricos. <b>Fase Nocturna:</b> Se puede realizar al anochecer empleando pañolines bicolor e identificadores reflectantes.", "recomendaciones": "<b>Arbitraje Claro:</b> Colocar una zona neutral visible atendida por guiadores o dirigentes para resolver capturas, empates numéricos y custodia de amuletos conquistados.", "objetivos_educativos": [{"id": "075c93b1-81d2-4370-8e47-f0a4d086b20e", "area": "Carácter", "unidad": "Compañía", "texto": "Sé lo que significa ser leal.", "como_se_cumple": "Formulando tácticas de sigilo en grupo y actuando con lealtad frente a las reglas del juego."}, {"id": "7a9e143e-c837-473b-a014-e41ef5fc2ec2", "area": "Carácter", "unidad": "Compañía", "texto": "Entiendo que es importante actuar de acuerdo a lo que pienso.", "como_se_cumple": "Asumiendo con honestidad el resultado de los duelos de brazaletes y respetando la palabra dada."}, {"id": "670852e4-d07d-48f5-b39b-b0b336059600", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Converso con mi patrulla sobre los derechos humanos.", "como_se_cumple": "Cumpliendo con fair play la entrega de prendas al ser desafiado en duelos numerados."}, {"id": "80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Participo en actividades relacionadas con los derechos de las personas.", "como_se_cumple": "Cuidando los amuletos y fetiches capturados sin actuar con brusquedad sobre los rivales."}, {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "area": "Creatividad", "unidad": "Compañía", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "como_se_cumple": "Proponiendo combinaciones ingeniosas de brazaletes en mi patrulla para desorientar a la tribu contraria."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Adaptando con agilidad el plan de invasión al cambiar los números en la mesa de tregua."}, {"id": "38f4863e-12a6-4a4b-9767-8cdf55020734", "area": "Carácter", "unidad": "Tropa", "texto": "Sé lo que significa ser leal.", "como_se_cumple": "Demostrando deportividad y autocontrol al aceptar la captura en campo enemigo."}, {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "area": "Carácter", "unidad": "Tropa", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "como_se_cumple": "Manteniendo la coherencia y el espíritu scout durante los momentos de alta competencia."}, {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Cumplo los compromisos que asumo.", "como_se_cumple": "Respetando la autoridad del árbitro central y colaborando con el orden del terreno."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "como_se_cumple": "Fomentando la integración fraterna entre tribus al concluir la dinámica territorial."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Diseñando estrategias de camuflaje en la vegetación para emboscar a los corredores rivales."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando rápidamente las defensas enemigas para infiltrarme por los flancos desprotegidos."}, {"id": "1d9d6751-4ab1-45db-9999-3f18606b4909", "area": "Carácter", "unidad": "Avanzada", "texto": "Soy fiel a la palabra dada.", "como_se_cumple": "Participando con madurez en la mesa de tregua para evaluar honestamente la estrategia de la avanzada."}, {"id": "007591fb-a2b6-4fb5-9286-acde65455f53", "area": "Sociabilidad", "unidad": "Avanzada", "texto": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.", "como_se_cumple": "Promoviendo el respeto por la dignidad y los derechos de cada participante durante los retos."}, {"id": "24294fc7-bfde-4283-938e-0d16c5ce6313", "area": "Creatividad", "unidad": "Avanzada", "texto": "Reflexiono y discuto con mi Comunidad y propongo acciones para realizar en conjunto.", "como_se_cumple": "Creando señuelos tácticos e innovando en maniobras de distracción durante la ofensiva."}]}'::jsonb,
      ARRAY['juego', 'estrategia', 'tribus', 'territorio']::text[],
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

    -- Category joins for el-enigma-de-los-palensilux
    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 1 FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    INSERT INTO articulo_categorias (articulo_id, categoria_id)
    SELECT id, 7 FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

    -- Clean relational objectives for el-enigma-de-los-palensilux
    DELETE FROM articulo_objetivos_educativos 
    WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'el-enigma-de-los-palensilux');
    
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '075c93b1-81d2-4370-8e47-f0a4d086b20e', 'Formulando tácticas de sigilo en grupo y actuando con lealtad frente a las reglas del juego.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '7a9e143e-c837-473b-a014-e41ef5fc2ec2', 'Asumiendo con honestidad el resultado de los duelos de brazaletes y respetando la palabra dada.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '670852e4-d07d-48f5-b39b-b0b336059600', 'Cumpliendo con fair play la entrega de prendas al ser desafiado en duelos numerados.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '80b09c0c-3389-4fed-aaa8-ee1fc2ae8bf2', 'Cuidando los amuletos y fetiches capturados sin actuar con brusquedad sobre los rivales.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '12686e7d-d6af-4c74-928d-c859d5b883d5', 'Proponiendo combinaciones ingeniosas de brazaletes en mi patrulla para desorientar a la tribu contraria.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Adaptando con agilidad el plan de invasión al cambiar los números en la mesa de tregua.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '38f4863e-12a6-4a4b-9767-8cdf55020734', 'Demostrando deportividad y autocontrol al aceptar la captura en campo enemigo.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Manteniendo la coherencia y el espíritu scout durante los momentos de alta competencia.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Respetando la autoridad del árbitro central y colaborando con el orden del terreno.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Fomentando la integración fraterna entre tribus al concluir la dinámica territorial.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Diseñando estrategias de camuflaje en la vegetación para emboscar a los corredores rivales.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Analizando rápidamente las defensas enemigas para infiltrarme por los flancos desprotegidos.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '1d9d6751-4ab1-45db-9999-3f18606b4909', 'Participando con madurez en la mesa de tregua para evaluar honestamente la estrategia de la avanzada.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '007591fb-a2b6-4fb5-9286-acde65455f53', 'Promoviendo el respeto por la dignidad y los derechos de cada participante durante los retos.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
    INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
    SELECT id, '24294fc7-bfde-4283-938e-0d16c5ce6313', 'Creando señuelos tácticos e innovando en maniobras de distracción durante la ofensiva.' FROM articulos WHERE slug = 'el-enigma-de-los-palensilux'
    ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;
        
COMMIT;