import json

# Los datos de los 5 juegos con sus respectivos objetivos educativos mapeados explícitamente por UUID
juegos_finales = [
    {
        "original_title": "Lo inobservable.",
        "titulo_reescrito": "El Guardia Invisible",
        "tipo": "Actividad",
        "subtipo": "juego nocturno",
        "duracion": "45 min",
        "cantidad": "15-30",
        "base_image": "juegos_nocturno_base.jpg",
        "lugares": ["bosque", "parque", "campo abierto"],
        "materiales": [
            "Linternas de colores",
            "Cuadernos y lápices para registrar observaciones",
            "Silbato"
        ],
        "variaciones": "Se puede jugar en parejas para dar mayor seguridad a los más pequeños de la manada, o bien, los vigilantes móviles pueden portar silbatos que deben hacer sonar cada vez que detecten la silueta de algún scout.",
        "recomendaciones": "Establecer límites de juego claros y marcados con cintas reflectantes. Es indispensable que cada participante o pareja lleve un silbato de emergencia y calzado adecuado para terreno irregular en la noche.",
        "descripcion_reescrita": "Este emocionante juego de acecho nocturno comienza con la delimitación rigurosa de una zona boscosa o con suficiente vegetación para ocultarse. Uno de los dirigentes asumirá el papel del Guardia Invisible, quien se equipará con una linterna y diversos objetos extraños (por ejemplo, disfraces extravagantes o utensilios ruidosos), escondiéndose en un punto estratégico. Dos dirigentes adicionales tomarán el rol de patrullas móviles de vigilancia, equipados con linternas de alta potencia para buscar y detectar a los scouts que intenten acercarse.\n\nLos scouts, organizados individualmente o en parejas, deben adentrarse sigilosamente en el perímetro de juego con la doble misión de encontrar al Guardia Invisible y observar sus extravagantes movimientos sin ser detectados. Deberán anotar discretamente en sus libretas cada acción extraña que el Guardia realice o cada objeto que utilice. Si la linterna de un vigilante móvil los enfoca y pronuncia su nombre, quedarán 'congelados' o deberán regresar a la base inicial para recuperar su vida y reingresar al juego. El desafío concluye cuando los scouts logran regresar con su registro de observación completo antes de finalizar el tiempo establecido.",
        "extracto": "Un desafiante juego nocturno de acecho y observación donde deberás registrar los movimientos de un misterioso guardia sin ser atrapado por los focos de los vigilantes.",
        "areas": ["corporalidad", "sociabilidad"],
        "unidades": ["manada", "tropa", "compañia", "avanzada", "clan"],
        "objetivos_generales": [
            "Estimular la observación",
            "Perder el miedo a la oscuridad",
            "Aprender a seguir instrucciones"
        ],
        "justificacion_areas": "Este juego estimula la Corporalidad mediante el desplazamiento sigiloso, el control corporal y la agilidad física requeridos para moverse sin hacer ruido en la oscuridad. A nivel de Sociabilidad, promueve el respeto a las reglas del juego, la cooperación silenciosa entre compañeros y la honestidad al regresar a la base cuando son iluminados por la patrulla de vigilancia, consolidando un ambiente seguro y de mutua confianza.",
        "objetivos_educativos_mapeo": [
            # Manada
            {
                "id": "942e2a3a-b7b5-4b88-b82a-261244f3683e",
                "como_se_cumple": "**Midiendo** de forma consciente los desniveles y obstáculos del terreno boscoso durante la noche, evitando caídas mientras me aproximo sigilosamente a observar al Guardia Invisible."
            },
            {
                "id": "626a313e-0407-4cfd-b714-c6aa6e51738c",
                "como_se_cumple": "**Coordinando** el movimiento sigiloso de mis extremidades para desplazarme en cuclillas y ocultarme tras los arbustos sin hacer ruido al acechar al Guardia."
            },
            # Tropa
            {
                "id": "0765469b-caef-4457-9d6b-cb739c855402",
                "como_se_cumple": "**Respetando** la regla del silencio absoluto y los límites geográficos indicados, desplazándome con cuidado de no ser enfocado por la linterna del vigilante."
            },
            {
                "id": "08369c53-2c02-4e9c-8bb5-f949cd092c98",
                "como_se_cumple": "**Esforzándome** por mantener el control de mi respiración y postura corporal bajo la presión de ser descubierto, regresando honestamente al punto de inicio si soy iluminado."
            },
            # Compañía
            {
                "id": "1427451e-b8b3-493b-8525-e53298381e07",
                "como_se_cumple": "**Respetando** la regla del silencio absoluto y los límites geográficos indicados, desplazándome con cuidado de no ser enfocado por la linterna del vigilante."
            },
            {
                "id": "b12da732-d736-480c-82b8-95b312316390",
                "como_se_cumple": "**Esforzándome** por mantener el control de mi respiración y postura corporal bajo la presión de ser descubierto, regresando honestamente al punto de inicio si soy iluminado."
            },
            # Avanzada
            {
                "id": "e1c20419-a6d0-48b2-91e8-20a96d2b11c3",
                "como_se_cumple": "**Desplazándome** con gran resistencia y agilidad entre los arbustos de noche, manteniendo posiciones de flexión prolongadas para no ser visto por las patrullas móviles."
            },
            # Clan
            {
                "id": "bc8f595b-6949-4f2e-9304-86a2306449e1",
                "como_se_cumple": "**Gobernando** mis capacidades físicas mediante un acecho controlado y seguro, asumiendo la responsabilidad de moverme con cautela en la penumbra para evitar lesiones."
            }
        ]
    },
    {
        "original_title": "Matamoscas.",
        "titulo_reescrito": "El Matamoscas Escurridizo",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "20 min",
        "cantidad": "15-40",
        "base_image": "juegos_carrera_base.jpg",
        "lugares": ["campo abierto", "gimnasio", "patio"],
        "materiales": [
            "Cinta o tiza para delimitar el área de juego",
            "Pañoletas para marcar a los atrapados"
        ],
        "variaciones": "En la variante 'Sin Reversa', el juego se desarrolla en una línea cerrada en el suelo (como una gran circunferencia) en la que los participantes solo pueden desplazarse en sentido horario o antihorario, impidiendo retrocesos y aumentando la velocidad de decisión. Otra opción es que cuando la cadena llegue a cuatro personas, esta se divida en parejas para evitar que sea demasiado larga y peligrosa.",
        "recomendaciones": "El terreno debe ser plano y libre de obstáculos para evitar tropiezos durante las carreras. Al formar la cadena, se debe insistir en no dar tirones violentos que puedan lesionar los hombros o muñecas de los compañeros.",
        "descripcion_reescrita": "Este dinámico juego de velocidad y coordinación se realiza en un terreno plano de aproximadamente 20 por 10 metros bien delimitado. Al inicio de la actividad, toda la unidad se sitúa en uno de los extremos del campo, mientras que un participante seleccionado por el dirigente se coloca en el centro del área para asumir el rol de 'matamoscas'. A la señal de partida, todos los jugadores deben correr hacia el extremo opuesto tratando de esquivar al matamoscas central, quien intentará tocarlos para atraparlos.\n\nCada participante atrapado se une de la mano con el matamoscas central, formando una cadena humana que crece progresivamente. Los integrantes de la cadena no deben soltarse de las manos y deben coordinar sus movimientos y giros rápidos para atrapar al resto de las 'moscas' que siguen cruzando el campo. El juego se vuelve cada vez más difícil y divertido a medida que la cadena se alarga, requiriendo un gran trabajo en equipo para coordinar la carrera. El último jugador que logre cruzar de un lado a otro sin ser atrapado es el ganador del juego.",
        "extracto": "Un clásico juego de persecución grupal donde los jugadores atrapados forman una cadena humana que debe coordinarse para atrapar a las moscas restantes.",
        "areas": ["corporalidad", "sociabilidad"],
        "unidades": ["manada", "tropa", "compañia", "avanzada", "clan"],
        "objetivos_generales": [
            "Desfogue de Energías",
            "Trabajo en equipo",
            "Estimular la agilidad"
        ],
        "justificacion_areas": "Esta actividad activa la Corporalidad al demandar velocidad, agilidad física, resistencia y reflejos rápidos para esquivar al oponente o coordinar la marcha en la cadena. Desde la perspectiva de la Sociabilidad, requiere una fuerte sincronización y toma de decisiones colectivas dentro de la cadena de perseguidores, donde la comunicación corporal y verbal entre los eslabones es clave para atrapar a los corredores más rápidos.",
        "objetivos_educativos_mapeo": [
            # Manada
            {
                "id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99",
                "como_se_cumple": "**Corriendo** y esquivando velozmente al perseguidor central en el campo abierto de 20 por 10 metros para mantenerme activo y ágil."
            },
            {
                "id": "626a313e-0407-4cfd-b714-c6aa6e51738c",
                "como_se_cumple": "**Coordinando** mis pasos y el movimiento de mis brazos cuando formo parte de la cadena humana para atrapar a los demás jugadores sin caernos."
            },
            # Tropa
            {
                "id": "0765469b-caef-4457-9d6b-cb739c855402",
                "como_se_cumple": "**Aceptando** las reglas al ser atrapado y uniéndome honestamente a la cadena de persecución sin soltarme de las manos de mis compañeros."
            },
            {
                "id": "08369c53-2c02-4e9c-8bb5-f949cd092c98",
                "como_se_cumple": "**Esforzándome** por correr de forma sincronizada con la cadena y sabiendo aceptar alegremente la eliminación cuando soy tocado en el último instante."
            },
            # Compañía
            {
                "id": "1427451e-b8b3-493b-8525-e53298381e07",
                "como_se_cumple": "**Aceptando** las reglas al ser atrapado y uniéndome honestamente a la cadena de persecución sin soltarme de las manos de mis compañeros."
            },
            {
                "id": "b12da732-d736-480c-82b8-95b312316390",
                "como_se_cumple": "**Esforzándome** por correr de forma sincronizada con la cadena y sabiendo aceptar alegremente la eliminación cuando soy tocado en el último instante."
            },
            # Avanzada
            {
                "id": "e1c20419-a6d0-48b2-91e8-20a96d2b11c3",
                "como_se_cumple": "**Desarrollando** mi velocidad, resistencia aeróbica y agilidad lateral para esquivar al bloque perseguidor en el patio de juego."
            },
            # Clan
            {
                "id": "bc8f595b-6949-4f2e-9304-86a2306449e1",
                "como_se_cumple": "**Autorregulando** mi intensidad y velocidad al correr e integrarme en la cadena humana, previniendo empujones o caídas que puedan lastimar a otros scouts."
            }
        ]
    },
    {
        "original_title": "Pelea de gallos.",
        "titulo_reescrito": "Pelea de Gallos Scout",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "15 min",
        "cantidad": "8-24",
        "base_image": "juegos_duelo_base.jpg",
        "lugares": ["sala", "césped", "playa"],
        "materiales": [
            "Colchonetas (si se realiza bajo techo)",
            "Cinta para delimitar el área de combate"
        ],
        "variaciones": "Se puede jugar en formato de torneo por patrullas, donde los ganadores de cada ronda van sumando puntos para su equipo. Otra variante consiste en la 'pelea de cangrejos', donde los oponentes se sostienen apoyados sobre sus manos y pies boca arriba, intentando desestabilizar al oponente levantando una de sus extremidades.",
        "recomendaciones": "Es fundamental realizar un calentamiento previo de articulaciones, especialmente de muñecas y tobillos. El juego debe suspenderse inmediatamente si se observa una fuerza desmedida o actitudes agresivas contrarias al espíritu scout. El suelo debe ser blando, preferiblemente césped o colchonetas.",
        "descripcion_reescrita": "La Pelea de Gallos Scout es un tradicional juego de equilibrio, resistencia y fuerza controlada que enfrenta a dos participantes cara a cara. Ambos contrincantes deben colocarse en cuclillas (con las piernas dobladas, pero sin apoyar las rodillas en el suelo) dentro de un círculo previamente delimitado. Con los brazos flexionados y las palmas de las manos hacia adelante, el objetivo principal consiste en empujar suavemente las palmas del rival o esquivar sus empujes para hacerle perder el equilibrio y obligarle a apoyar las rodillas, glúteos o manos en el suelo.\n\nEn la variante de la 'pelea de cangrejos', los competidores adoptan una posición de cuadrupedia invertida (boca arriba, apoyados en manos y pies). En esta dinámica, el objetivo es tocar o enganchar las extremidades del oponente para forzarlo a tocar el suelo con la espalda o el abdomen. Ambas modalidades exigen una excelente coordinación muscular, rapidez mental para anticipar los movimientos del rival y un estricto sentido del juego limpio, finalizando el duelo en el momento en que uno de los dos toca el suelo con una parte no permitida de su cuerpo.",
        "extracto": "Un juego clásico de duelo scout en cuclillas o posición de cangrejo que pone a prueba la fuerza controlada, el equilibrio y la agilidad.",
        "areas": ["corporalidad", "caracter"],
        "unidades": ["manada", "tropa", "compañia", "avanzada", "clan"],
        "objetivos_generales": [
            "Conocer las capacidades corporales",
            "Fomentar la sana competencia",
            "Estimular la agilidad"
        ],
        "justificacion_areas": "El juego incide directamente en la Corporalidad al desarrollar la fuerza muscular de las piernas, el equilibrio dinámico y la coordinación neuromuscular fina. Asimismo, estimula el Carácter, ya que reta a los participantes a competir con honestidad, respetar las limitaciones físicas propias y del rival, y mantener un comportamiento templado frente al triunfo o la derrota.",
        "objetivos_educativos_mapeo": [
            # Manada
            {
                "id": "7fcaa85f-358b-40e2-bc67-d1445d8deee8",
                "como_se_cumple": "**Participando** con entusiasmo en la pelea de gallos en cuclillas, manteniendo el buen humor sin enojarme al perder."
            },
            {
                "id": "121c9a27-6775-4242-992f-1b361fc7b08b",
                "como_se_cumple": "**Felicitando** alegremente a mi oponente cuando logra derribarme limpiamente en la pelea de gallos, celebrando su destreza."
            },
            # Tropa
            {
                "id": "b0042e1b-f294-4e30-88e6-418a996add56",
                "como_se_cumple": "**Disfrutando** del juego y de las caídas graciosas en la pelea de cangrejos sin mofarme ni ridiculizar a mis compañeros de patrulla."
            },
            {
                "id": "71413ac6-8ae9-4034-b580-e2f1c2f9f42c",
                "como_se_cumple": "**Esforzándome** por controlar impulsos agresivos durante el duelo cuerpo a cuerpo, canalizando mi fuerza con prudencia."
            },
            # Compañía
            {
                "id": "b0042e1b-f294-4e30-88e6-418a996add56",
                "como_se_cumple": "**Disfrutando** del juego y de las caídas graciosas en la pelea de cangrejos sin mofarme ni ridiculizar a mis compañeras de patrulla."
            },
            {
                "id": "71413ac6-8ae9-4034-b580-e2f1c2f9f42c",
                "como_se_cumple": "**Esforzándome** por controlar impulsos agresivos durante el duelo cuerpo a cuerpo, canalizando mi fuerza con prudencia."
            },
            # Avanzada
            {
                "id": "dead8658-5e9c-4d29-9ffc-f12a2c3d9564",
                "como_se_cumple": "**Manteniendo** una actitud deportiva y respetuosa en la pelea de cangrejos, riéndome de mis propios desequilibrios sin reaccionar de forma agresiva."
            },
            # Clan
            {
                "id": "d716bdfb-2fea-4b96-9a46-b86d66692d45",
                "como_se_cumple": "**Asumiendo** las victorias y derrotas de la dinámica con alegría y madurez, utilizándola como espacio para reírme sanamente y fortalecer la hermandad en el Clan."
            }
        ]
    },
    {
        "original_title": "Las 4 colinas.",
        "titulo_reescrito": "Asalto a las Cuatro Colinas",
        "tipo": "Actividad",
        "subtipo": "juego nocturno",
        "duracion": "60 min",
        "cantidad": "20-50",
        "base_image": "juegos_nocturno_base.jpg",
        "lugares": ["bosque", "campo abierto"],
        "materiales": [
            "4 pañoletas para marcar las colinas o esquinas",
            "Linternas para el equipo defensor",
            "Silbatos",
            "Luz química o baliza luminosa para el centro"
        ],
        "variaciones": "Se pueden introducir 'mensajes secretos' que los atacantes deban recoger del centro y llevar de vuelta a su base sin ser nombrados. Los defensores también pueden tener limitaciones, como no poder correr y solo poder caminar rápido para buscar a los atacantes.",
        "recomendaciones": "Inspeccionar el bosque de día para retirar obstáculos peligrosos. Es obligatorio que todos los atacantes jueguen en silencio y con calzado adecuado, y que los monitores estén distribuidos estratégicamente con botiquines de primeros auxilios y luces de seguridad.",
        "descripcion_reescrita": "Este desafiante juego nocturno de gran envergadura simula el asalto táctico a un fuerte protegido por una guarnición militar. El terreno de juego debe ser boscoso, accidentado y estar delimitado por cuatro hitos o 'colinas' marcadas con pañoletas visibles, con una baliza luminosa o luz química en el centro que representa el núcleo del fuerte. Los participantes se dividen en dos equipos: los atacantes (que componen aproximadamente dos tercios del total de jugadores) y los defensores (que conforman el tercio restante y custodian el perímetro del fuerte).\n\nLos atacantes se dispersan fuera del perímetro e intentan infiltrarse sigilosamente hacia la baliza central sin ser vistos. Los defensores patrullan el borde exterior y, al detectar a un atacante, deben enfocarlo con su linterna e identificarlo por su nombre en voz alta; si la identificación es correcta, el atacante es enviado a la prisión del fuerte. Ningún defensor puede ingresar al perímetro interno del fuerte, el cual es supervisado por monitores o dirigentes. El juego finaliza cuando un número predeterminado de atacantes logra ingresar al núcleo del fuerte sin ser identificado, o cuando se agota el tiempo de juego y la mayoría de los atacantes han sido capturados.",
        "extracto": "Un gran juego nocturno de estrategia, acecho e infiltración táctica donde los atacantes intentan ingresar a un fuerte custodiado por defensores.",
        "areas": ["corporalidad", "sociabilidad", "caracter"],
        "unidades": ["manada", "tropa", "compañia", "avanzada", "clan"],
        "objetivos_generales": [
            "Estrategia y planificación",
            "Desfogue de Energías",
            "Trabajo en equipo"
        ],
        "justificacion_areas": "Esta actividad estimula la Corporalidad a través del acecho en la naturaleza, el arrastre, la marcha silenciosa y el control de la respiración. En el ámbito de la Sociabilidad y el Carácter, exige a los atacantes planificar estrategias en equipo, confiar en el sigilo mutuo, y apela a la honestidad individual para aceptar la captura cuando los defensores los descubren e identifican correctamente en la oscuridad.",
        "objetivos_educativos_mapeo": [
            # Manada
            {
                "id": "b69188bf-2391-43c1-a885-abd1b13912be",
                "como_se_cumple": "**Aceptando** las normas de seguridad del bosque y las decisiones de los dirigentes dentro del juego del fuerte sin discutir."
            },
            {
                "id": "2394dd5b-87b9-4f3d-9cdd-a42649139782",
                "como_se_cumple": "**Respetando** la regla de regresar a la prisión del fuerte de manera honesta cuando un defensor me alumbra con la linterna e identifica mi nombre."
            },
            # Tropa
            {
                "id": "c6ec1a8c-37fb-441c-860c-755143523afe",
                "como_se_cumple": "**Colaborando** con mi patrulla en la definición de la estrategia de acecho para distraer a los defensores del fuerte y lograr que otros compañeros ingresen."
            },
            {
                "id": "86784e96-688b-45d1-897f-d31527a51134",
                "como_se_cumple": "**Considerando** las opiniones y habilidades físicas de los integrantes de mi patrulla al planificar la ruta táctica de infiltración nocturna."
            },
            # Compañía
            {
                "id": "c6ec1a8c-37fb-441c-860c-755143523afe",
                "como_se_cumple": "**Colaborando** con mi patrulla en la definición de la estrategia de acecho para distraer a los defensores del fuerte y lograr que otras compañeras ingresen."
            },
            {
                "id": "86784e96-688b-45d1-897f-d31527a51134",
                "como_se_cumple": "**Considerando** las opiniones y habilidades físicas de los integrantes de mi patrulla al planificar la ruta táctica de infiltración nocturna."
            },
            # Avanzada
            {
                "id": "f1496221-0da5-4775-b3ba-29e65603cfee",
                "como_se_cumple": "**Acatando** honestamente el reglamento táctico del juego nocturno establecido por el equipo de dirigentes y reconociendo el valor de la disciplina táctica."
            },
            # Clan
            {
                "id": "b5a81328-5c07-41bd-a1ea-1ed401762841",
                "como_se_cumple": "**Ejerciendo** un juego limpio riguroso al asumir mi eliminación táctica cuando soy descubierto, enseñando con el ejemplo a los miembros más jóvenes sobre la honestidad scout."
            }
        ]
    },
    {
        "original_title": "Captura de serpientes.",
        "titulo_reescrito": "Cacería de Serpientes",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "15 min",
        "cantidad": "10-30",
        "base_image": "juegos_duelo_base.jpg",
        "lugares": ["campo abierto", "gimnasio", "patio"],
        "materiales": [
            "Cuerdas de longitud corta (una menos que el total de participantes)"
        ],
        "variaciones": "Se puede jugar formando parejas tomadas de la mano, donde cada pareja debe atrapar una cuerda, promoviendo el trabajo en equipo cooperativo. En otra variante, las cuerdas pueden estar colgadas de ramas bajas o estructuras a diferentes alturas para agregar variabilidad al movimiento.",
        "recomendaciones": "El área debe estar despejada para evitar colisiones frontales al correr hacia las cuerdas. Los jugadores deben evitar lanzarse de cabeza al suelo para agarrar las cuerdas, insistiendo en que solo se pueden recoger de pie o en cuclillas para resguardar la seguridad.",
        "descripcion_reescrita": "La Cacería de Serpientes es un juego de alta intensidad y reacción rápida que pone a prueba los reflejos y la velocidad de los scouts. Sobre el terreno de juego se esparcen de manera aleatoria varias cuerdas cortas (denominadas 'serpientes'), habiendo siempre una cuerda menos que el número de participantes activos. Al dar la señal de partida, todos los jugadores corren libremente dentro del área esquivando las cuerdas; a la siguiente señal o silbatazo, cada scout debe reaccionar de inmediato y apoderarse de una de las cuerdas, quedando eliminado quien no consiga ninguna.\n\nEn situaciones donde dos scouts alcancen y aferren una misma cuerda de forma simultánea, se resuelve mediante una prueba rápida de velocidad: el dirigente coloca la cuerda a una distancia específica de los dos contrincantes, quienes se colocan a la misma distancia de salida; al silbato, corren velozmente hacia la cuerda y el primero en atraparla asegura su permanencia. El juego avanza quitando una cuerda en cada ronda hasta que solo quede una cuerda y dos competidores, definiéndose al ganador en el último enfrentamiento.",
        "extracto": "Un juego dinámico de velocidad y reflejos rápidos donde los participantes compiten por atrapar una cuerda del suelo en rondas eliminatorias.",
        "areas": ["corporalidad", "caracter"],
        "unidades": ["manada", "tropa", "compañia", "avanzada", "clan"],
        "objetivos_generales": [
            "Estimular la capacidad de reacción",
            "Fomentar la sana competencia",
            "Estimular la agilidad"
        ],
        "justificacion_areas": "Esta dinámica de juego activa de forma directa la Corporalidad mediante el desarrollo de la velocidad de reacción y la acelaración explosiva en distancias cortas. Asimismo, favorece el Carácter al plantear situaciones competitivas directas bajo presión, donde los jóvenes deben autogestionar la frustración de la eliminación y demostrar honestidad al determinar quién tomó la cuerda primero.",
        "objetivos_educativos_mapeo": [
            # Manada
            {
                "id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99",
                "como_se_cumple": "**Reaccionando** velozmente al silbatazo para correr y atrapar una de las cuerdas sueltas del suelo, mejorando mis reflejos."
            },
            {
                "id": "626a313e-0407-4cfd-b714-c6aa6e51738c",
                "como_se_cumple": "**Coordinando** de forma precisa mi zancada y el movimiento para agacharme velozmente a recoger una cuerda sin perder el paso."
            },
            # Tropa
            {
                "id": "36321046-051e-4c14-bb1e-7045faf4f5b4",
                "como_se_cumple": "**Esquivando** los roces fuertes o disputas violentas con mis compañeros de patrulla al correr enérgicamente por la última cuerda disponible."
            },
            {
                "id": "08369c53-2c02-4e9c-8bb5-f949cd092c98",
                "como_se_cumple": "**Esforzándome** por dar mi máximo esfuerzo físico en el sprint final, aceptando la eliminación de forma alegre si mi compañero llega antes."
            },
            # Compañía
            {
                "id": "36321046-051e-4c14-bb1e-7045faf4f5b4",
                "como_se_cumple": "**Esquivando** los roces fuertes o disputas violentas con mis compañeras de patrulla al correr enérgicamente por la última cuerda disponible."
            },
            {
                "id": "b12da732-d736-480c-82b8-95b312316390",
                "como_se_cumple": "**Esforzándome** por dar mi máximo esfuerzo físico en el sprint final, aceptando la eliminación de forma alegre si mi compañera llega antes."
            },
            # Avanzada
            {
                "id": "e1c20419-a6d0-48b2-91e8-20a96d2b11c3",
                "como_se_cumple": "**Exigiéndome** físicamente en las carreras cortas y giros rápidos durante el juego eliminatorio de cuerdas, manteniendo una buena respuesta muscular."
            },
            # Clan
            {
                "id": "bc8f595b-6949-4f2e-9304-86a2306449e1",
                "como_se_cumple": "**Controlando** mi velocidad de aceleración al disputar la cuerda con otros caminantes, resguardando la integridad física colectiva de forma responsable."
            }
        ]
    }
]

# Cargar catálogo de objetivos para inyectar áreas, textos e información oficial de forma dinámica
with open("supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objs_catalogo = json.load(f)

# Diccionario por ID para acceso rápido
catalogo_by_id = {o["id"]: o for o in objs_catalogo}

output_data = []
for j in juegos_finales:
    objs_edu_list = []
    
    for item in j["objetivos_educativos_mapeo"]:
        obj_id = item["id"]
        if obj_id not in catalogo_by_id:
            raise ValueError(f"ID de objetivo {obj_id} no encontrado en el catálogo oficial.")
            
        obj_data = catalogo_by_id[obj_id]
        
        # En Clan se usa el texto_terminal, en el resto texto_infantil
        is_clan = obj_data["unidad_nombre"].lower() == "clan"
        texto_a_usar = obj_data["texto_terminal"] if is_clan else obj_data["texto_infantil"]
        
        objs_edu_list.append({
            "id": obj_id,
            "area": obj_data["area_nombre"],
            "texto": texto_a_usar,
            "unidad": obj_data["unidad_nombre"],
            "como_se_cumple": item["como_se_cumple"]
        })
        
    juego_dict = {
        "original_title": j["original_title"],
        "titulo_reescrito": j["titulo_reescrito"],
        "tipo": j["tipo"],
        "subtipo": j["subtipo"],
        "duracion": j["duracion"],
        "cantidad": j["cantidad"],
        "base_image": j["base_image"],
        "lugares": j["lugares"],
        "materiales": j["materiales"],
        "variaciones": j["variaciones"],
        "recomendaciones": j["recomendaciones"],
        "descripcion_reescrita": j["descripcion_reescrita"],
        "extracto": j["extracto"],
        "areas": j["areas"],
        "unidades": j["unidades"],
        "objetivos_generales": j["objetivos_generales"],
        "justificacion_areas": j["justificacion_areas"],
        "objetivos_educativos": objs_edu_list
    }
    output_data.append(juego_dict)

with open("scratch/batch_output_3.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("¡JSON estructurado y verificado generado exitosamente!")
