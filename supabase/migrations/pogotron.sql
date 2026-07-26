-- ============================================================================
-- POGOTRÓN — Juego Cooperativo-Físico
-- Fuente: G.S.Pau (https://www.gspau.es/actividades-juegos-scout/)
-- Categoría: Juegos (ID: 7) -> Actividades (ID: 1)
-- ============================================================================

-- 1. INSERTAR ARTÍCULO
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
    seo_titulo,
    seo_descripcion,
    etiquetas,
    metadata,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM perfiles WHERE rol_id = 1 LIMIT 1),
    NULL,
    'Pogotrón',
    'pogotron',
    '<h2>📜 Descripción del Juego</h2>
<p>Pogotrón es un juego de alta energía que combina la dinámica del balonmano con la emoción de proteger un globo atado al tobillo. Cada participante lleva un globo inflado como su ''vida'' y debe intentar reventar los globos de los rivales mientras maneja una pelota. Es una actividad perfecta para desfogar energías, desarrollar reflejos y fomentar la sana competencia en un ambiente de diversión grupal.</p>
<hr>
<h3>🎲 ¿Cómo se juega?</h3>
<ol>
<li><strong>Preparación:</strong> Cada participante recibe un globo inflado que se ata a su tobillo con una cuerda o elástico, dejando el globo colgando aproximadamente a 10 cm del suelo.</li>
<li><strong>Formación de equipos:</strong> Se dividen los participantes en dos equipos equilibrados. Se delimita el campo de juego con dimensiones similares a una cancha de balonmano reducida.</li>
<li><strong>Inicio del juego:</strong> El juego funciona como balonmano normal: se pasa la pelota con las manos, se avanza hacia la portería rival y se intenta marcar gol.</li>
<li><strong>Regla del globo:</strong> La particularidad es que cualquier jugador que lleve la pelota puede ser atacado por un rival intentando pisarle el globo. Si el globo se revienta, ese jugador queda eliminado temporalmente.</li>
<li><strong>Recuperación de vida:</strong> El jugador sin globo debe salir del campo, buscar un nuevo globo, inflarlo y volver a incorporarse al juego.</li>
<li><strong>Límite de vidas:</strong> Cada jugador puede recuperar su globo un máximo de tres veces. Después de la tercera eliminación, queda fuera del partido.</li>
<li><strong>Portero protegido:</strong> El portero puede intentar reventar el globo de cualquier jugador rival que entre en el área de portería, pero no puede quitarle la vida a un jugador que no lleve la pelota.</li>
<li><strong>Falta por agresión:</strong> Si un jugador revienta el globo de un rival que NO lleva la pelota, debe devolverle el globo inmediatamente como penalización.</li>
<li><strong>Victoria:</strong> Gana el equipo que logre más goles al finalizar el tiempo establecido, o el equipo que elimine a todos los rivales primero.</li>
</ol>',
    'Juego cooperativo que combina balonmano con globos atados al tobillo. Los participantes deben marcar goles mientras protegen su globo y intentan reventar los rivales.',
    '/uploads/pogotron.webp',
    'publicado',
    NULL,
    NULL,
    ARRAY['juego', 'cooperativo', 'globos', 'balonmano', 'reflejos'],
    '{
        "unidades": ["manada", "compania", "tropa", "avanzada"],
        "duracion": "30 minutos",
        "cantidad": "12 participantes",
        "lugares": ["Exterior", "Interior", "campo delimitado"],
        "materiales": ["Globos", "Pelota de balonmano o similar", "Cuerdas o elásticos", "Conos para delimitar el campo"],
        "areas": ["Corporalidad", "Creatividad", "Sociabilidad"],
        "objetivos": [
            "Desfogue de Energías",
            "Estimular la capacidad de reacción",
            "Favorecer el trabajo en equipo",
            "Fomentar la sana competencia"
        ],
        "justificacion_areas": "Pogotrón integra de manera excepcional tres áreas fundamentales del desarrollo infanto-juvenil. En el plano de la **Corporalidad**, el juego exige coordinación motriz fina y gruesa simultánea: los participantes deben correr, esquivar, lanzar y proteger su globo al mismo tiempo, lo que desarrolla reflejos, equilibrio y conciencia espacial. En la **Creatividad**, cada jugador debe inventar estrategias sobre la marcha: decidir cuándo atacar, cuándo defender, cómo proteger su globo mientras avanza con la pelota, y cómo engañar al rival. Esta toma de decisiones en tiempo real estimula el pensamiento divergente y la resolución creativa de problemas. En la **Sociabilidad**, el juego fomenta la cooperación intrínseca del equipo: los jugadores deben comunicarse, coordinar ataques, proteger a los compañeros más vulnerables y celebrar los logros colectivos. La dinámica de vidas limitadas (tres globos máximo) enseña a manejar la frustración de la eliminación temporal y a reincorporarse al grupo con motivación renovada.",
        "variaciones": "**Variación por nivel de dificultad:** Para grupos más pequeños (Manada), se puede jugar sin la pelota de balonmano, centrando el juego únicamente en la protección del globo: los participantes corren libremente por el campo intentando pisar los globos rivales mientras protegen el propio. Gana quien conserve su globo al final del tiempo. **Variación de equipos múltiples:** En lugar de dos equipos, se pueden formar tres o cuatro equipos que jueguen simultáneamente en un campo más amplio, creando alianzas temporales y traiciones estratégicas que añaden complejidad al juego. **Variación de globo compartido:** Cada pareja de jugadores comparte un globo atado entre ambos tobillos, obligándolos a coordinar sus movimientos y desplazarse juntos, lo que refuerza la comunicación no verbal y la confianza mutua. **Adaptación para clima lluvioso:** Si no se puede jugar al aire libre, se adapta a un gimnasio o salón grande reduciendo el tamaño del campo y usando globos más pequeños para mayor seguridad. **Variación nocturna:** Se puede jugar al atardecer o de noche con linternas, añadiendo el desafío de la visibilidad reducida y convirtiendo el juego en una experiencia de acecho y observación. **Variación de roles especiales:** Se pueden asignar roles como el Médico (puede devolver un globo a un compañero eliminado una vez por partido) o el Capitán (si su globo se revienta, todo el equipo pierde una vida).",
        "recomendaciones": "**Seguridad ante todo:** Es fundamental revisar el terreno de juego antes de comenzar, asegurándose de que no haya piedras, ramas, baches u objetos que puedan causar tropiezos. El campo debe ser plano y libre de obstáculos. Los participantes deben llevar calzado cerrado y adecuado para correr. **Uso correcto de los globos:** Los globos deben atarse con cuerdas o elásticos lo suficientemente largos para que no restrinjan el movimiento del tobillo, pero lo suficientemente cortos para que no se enganchen con otros jugadores. Se recomienda usar globos de colores diferentes por equipo para facilitar la identificación visual. **Reglas de contacto físico:** Debe quedar muy claro que NO se permite empujar, agarrar o hacer contacto físico agresivo con otros jugadores. La única interacción permitida es pisar el globo del rival. Si un jugador muestra conducta agresiva, se le amonesta y, en caso de reincidencia, se le expulsa del partido. **Gestión de la eliminación temporal:** Es importante que los dirigentes supervisen que los jugadores eliminados salgan del campo inmediatamente y no interfieran con el juego. Se puede designar una zona de reabastecimiento donde los jugadores inflan sus nuevos globos antes de reincorporarse. **Fomentar el espíritu deportivo:** Antes del juego, recordar a todos los participantes que el objetivo principal es divertirse. Celebrar las buenas jugadas de ambos equipos y evitar que la competencia genere rivalidades negativas. Al finalizar, hacer una breve reflexión grupal sobre qué estrategias funcionaron mejor y cómo se sintieron al proteger su pañolín simbólico (el globo). **Adaptación por edad:** Para la Manada (7-10 años), reducir la intensidad del contacto y permitir más vidas (4-5 globos). Para Avanzada (15-17 años), se puede aumentar la complejidad añadiendo reglas tácticas como zonas de inviolabilidad o tiempos de poder especial.",
        "objetivos_educativos": [
            {
                "unidad_id": 1,
                "area_id": 1,
                "rango_edad": "Infancia Media",
                "texto_terminal": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.",
                "texto_infantil": "Me gusta jugar con otros niños y niñas y respeto las reglas de los juegos.",
                "id": "5d2d48ed-c461-4a8e-9048-cceecd3de2e2",
                "como_se_cumple": "Participando activamente en Pogotrón, donde aprendo a respetar las reglas del juego mientras me divierto corriendo, esquivando y protegiendo mi globo junto a mis compañeros de Manada."
            },
            {
                "unidad_id": 1,
                "area_id": 3,
                "rango_edad": "Infancia Media",
                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                "texto_infantil": "Participo en actividades que me ayudan a descubrir lo que puedo hacer.",
                "id": "8adf65db-9e04-465f-89d3-b76d0e7f4ed6",
                "como_se_cumple": "Descubriendo mis capacidades físicas y de coordinación al correr, esquivar y proteger mi globo en Pogotrón, dándome cuenta de lo que puedo lograr con práctica y esfuerzo."
            },
            {
                "unidad_id": 1,
                "area_id": 1,
                "rango_edad": "Infancia Tardía",
                "texto_terminal": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.",
                "texto_infantil": "Practico deportes, conozco sus reglas y sé perder.",
                "id": "309c6121-94fc-43a2-b0fb-f6a975f78962",
                "como_se_cumple": "Jugando Pogotrón con entusiasmo, respetando todas las reglas del juego y aprendiendo a aceptar con deportividad tanto la victoria como la derrota cuando mi globo se revienta."
            },
            {
                "unidad_id": 1,
                "area_id": 3,
                "rango_edad": "Infancia Tardía",
                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                "texto_infantil": "Sé lo que puedo hacer y lo que no puedo hacer.",
                "id": "b66418eb-3eee-466e-9836-457b3bb922cc",
                "como_se_cumple": "Reconociendo mis límites físicos durante Pogotrón, sabiendo cuándo puedo alcanzar un globo rival y cuándo es mejor proteger el mío, aceptando mis posibilidades reales."
            },
            {
                "unidad_id": 2,
                "area_id": 1,
                "rango_edad": "11 a 13 años",
                "texto_terminal": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.",
                "texto_infantil": "Conozco y practico diferentes juegos y respeto sus reglas.",
                "id": "1427451e-b8b3-493b-8525-e53298381e07",
                "como_se_cumple": "Aprendiendo y practicando las reglas específicas de Pogotrón, combinando balonmano con protección de globos, y respetando las normas de juego limpio con mi patrulla."
            },
            {
                "unidad_id": 2,
                "area_id": 3,
                "rango_edad": "11 a 13 años",
                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                "texto_infantil": "Me gusta participar en actividades que me ayudan a conocerme.",
                "id": "fedb6bcf-2ee2-43f5-96d9-505f78284a6a",
                "como_se_cumple": "Conociéndome mejor a través de Pogotrón, descubriendo cómo reacciono bajo presión, cómo manejo la frustración de perder mi globo y cómo me relaciono con mi equipo en competencia."
            },
            {
                "unidad_id": 2,
                "area_id": 1,
                "rango_edad": "13 a 15 años",
                "texto_terminal": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.",
                "texto_infantil": "Preparo juegos para distintas ocasiones.",
                "id": "a3e5dd16-5205-4d00-b79b-e14d0492e34d",
                "como_se_cumple": "Colaborando en la organización y preparación de Pogotrón para mi Compañía, adaptando las reglas, el espacio y los materiales según las necesidades del grupo y la ocasión."
            },
            {
                "unidad_id": 2,
                "area_id": 3,
                "rango_edad": "13 a 15 años",
                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                "texto_infantil": "Soy capaz de criticarme.",
                "id": "fd91a885-6848-443b-87e0-9d2fdbca6a2d",
                "como_se_cumple": "Reflexionando sobre mi desempeño en Pogotrón, identificando cuándo fui demasiado agresivo o demasiado pasivo, y siendo capaz de reconocer mis errores para mejorar en la próxima partida."
            },
            {
                "unidad_id": 3,
                "area_id": 1,
                "rango_edad": "11 a 13 años",
                "texto_terminal": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.",
                "texto_infantil": "Conozco y practico diferentes juegos y respeto sus reglas.",
                "id": "0765469b-caef-4457-9d6b-cb739c855402",
                "como_se_cumple": "Practicando Pogotrón con mi patrulla, aprendiendo sus reglas únicas que combinan balonmano con protección de globos, y respetando el juego limpio en cada partida."
            },
            {
                "unidad_id": 3,
                "area_id": 3,
                "rango_edad": "11 a 13 años",
                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                "texto_infantil": "Me gusta participar en actividades que me ayudan a conocerme.",
                "id": "62876ebe-214f-4caf-b164-664e12fd30ae",
                "como_se_cumple": "Participando en Pogotrón y descubriendo cómo reacciono ante la competencia, cómo manejo la presión de proteger mi globo y cómo trabajo con mi patrulla bajo estrés lúdico."
            },
            {
                "unidad_id": 3,
                "area_id": 1,
                "rango_edad": "13 a 15 años",
                "texto_terminal": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.",
                "texto_infantil": "Preparo juegos para distintas ocasiones.",
                "id": "7c91a6b0-5a22-464b-b965-dd216859db69",
                "como_se_cumple": "Organizando Pogotrón para distintas reuniones de mi Tropa, adaptando el campo, las reglas y los materiales según el espacio disponible y la cantidad de participantes."
            },
            {
                "unidad_id": 3,
                "area_id": 3,
                "rango_edad": "13 a 15 años",
                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                "texto_infantil": "Pienso sobre mi manera de ser y trato cada día de mejorar.",
                "id": "9ad7086c-b056-4c28-aad6-eedb4a82ce51",
                "como_se_cumple": "Reflexionando sobre mi comportamiento en Pogotrón, analizando si fui competitivo en exceso o si me faltó iniciativa, y buscando mejorar mi equilibrio entre competencia y compañerismo."
            },
            {
                "unidad_id": 4,
                "area_id": 1,
                "rango_edad": "15 a 17 años",
                "texto_terminal": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.",
                "texto_infantil": "Participo en la organización de juegos y actividades recreativas para los demás.",
                "id": "7200435f-b020-46fc-b323-8249048b1d18",
                "como_se_cumple": "Liderando la organización de Pogotrón para mi Avanzada y unidades menores, preparando el campo, explicando las reglas y facilitando que todos disfruten de la actividad de forma segura."
            },
            {
                "unidad_id": 4,
                "area_id": 3,
                "rango_edad": "15 a 17 años",
                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                "texto_infantil": "Me acepto tal como soy, sin dejar de mirarme críticamente.",
                "id": "dea08f50-52d5-4d87-ad7f-b7dbbb2702fc",
                "como_se_cumple": "Aceptándome con mis fortalezas y debilidades en Pogotrón, reconociendo que no siempre seré el mejor jugador pero que puedo aportar al equipo con liderazgo, estrategia y espíritu deportivo."
            }
        ]
    }'::jsonb,
    NOW(),
    NOW()
);

-- 2. VINCULAR CATEGORÍA JERÁRQUICA (Juegos -> Actividades)
INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT a.id, 7
FROM articulos a
WHERE a.slug = 'pogotron'
ON CONFLICT DO NOTHING;
