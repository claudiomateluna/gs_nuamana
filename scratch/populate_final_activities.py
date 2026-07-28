import os
import re
import json

# Mapeo de contenido definitivo para los 11 archivos de actividades
final_activities = {
    "el-nido-de-los-recuerdos": {
        "titulo": "El Nido de los Recuerdos",
        "descripcion": "Esta dinámica invita a la sección a compartir vivencias y emociones en un clima de confianza mutua. Se dibuja un tablero gigante en forma de nido en un papelógrafo, dividido en casillas numeradas. Cada participante busca una ficha natural (como una piedra pintada o un botón). El jugador en su turno lanza un dado y avanza por las casillas. En cada casilla libre, el participante redacta una \"misión de honestidad\" (por ejemplo: \"relatar un viaje familiar\", \"compartir qué te hace reír\", \"recordar un momento difícil\"). Si la casilla ya posee una misión, el jugador debe responder y hablar sobre ese tema. El circuito continúa hasta que todos hayan compartido sus experiencias y se haya tejido una red de conocimiento interpersonal.",
        "objetivos_generales": ["Conocer a los demás", "Facilitar el conocimiento entre los pares", "Fomentar las relaciones interpersonales"],
        "como_se_cumple": {
            "054680a5-f07a-4771-8d7a-811a5db8f505": "**Conversando** con mi seisena sobre los sentimientos que me produce estar fuera de casa y recordando anécdotas de campamento compartidas en el tablero del nido, reforzando mi seguridad e independencia.",
            "66de9e77-aa53-48a1-98db-9de3d3958486": "**Expresando** mis sentimientos en voz alta al caer en las casillas del nido, compartiendo de forma lúdica con mis compañeros los recuerdos que me ponen alegre y los momentos tristes de mi historia.",
            "cfa10133-c25c-4deb-aebe-a00f8fe3f7ef": "**Ofreciendo** mis propias experiencias e ideas a mis amigos al deambular por las casillas del tablero, permitiéndoles conocer mis historias personales y escuchando activamente las de ellos.",
            "472be67d-b110-4fd9-aa16-1f0bf088067c": "**Compartiendo** de forma activa mis vivencias y escuchando los relatos de mis pares en este tablero de nidos, preparándome para abrirme y socializar en eventos más grandes de intercambio."
        }
    },
    "la-caceria-del-oso-nocturno": {
        "titulo": "La Cacería del Oso Nocturno",
        "descripcion": "Dinámica de acecho y trabajo en equipo para desarrollar en campamento durante la noche. Un grupo de dirigentes (que actúan como \"osos\") se ocultan en sectores seguros del bosque y hacen sonar sus silbatos a intervalos regulares de 1 a 2 minutos. Cada \"oso\" lleva consigo tarjetas o papeles especiales con su nombre. Las patrullas o equipos deben organizarse para avanzar en absoluto sigilo a través de la oscuridad, localizarlos y obtener una tarjeta de oso. Los osos pueden cambiar de posición o permanecer fijos. La patrulla que consiga reunir la mayor cantidad de tarjetas de osos distintos al finalizar el tiempo establecido será la ganadora.",
        "objetivos_generales": ["Desfogue de Energías", "Estimular la observación", "Estrategia y planificación", "Trabajo en equipo"],
        "como_se_cumple": {
            "8cae916f-5e67-4697-b3cd-c59b5c7d1439": "**Moviéndome** con cuidado y alerta en el bosque de noche para evitar caídas y asegurar la seguridad de mis compañeros mientras buscamos a los osos.",
            "6768d60a-187e-4bbf-97b9-cdc25a316030": "**Colaborando** activamente con mi patrulla en la planificación de la ruta de búsqueda de los osos escondidos, asegurando que todos tengan un rol.",
            "0b23d4c8-6e40-4e8e-a476-97ed92efa152": "**Utilizando** señales silenciosas y señas acordadas con mi patrulla para coordinar el avance silencioso en la oscuridad sin alertar a los osos.",
            "8bbd7392-24e1-453f-bd7a-8265d57877c9": "**Analizando** la dirección y frecuencia de los sonidos de silbato en el entorno para deducir la posición de los osos y guiar a mi equipo con éxito.",
            "b146e0a9-400a-484a-aff4-931528c193e2": "**Moviéndome** con precaución en la oscuridad del bosque, cuidando mis pasos para prevenir accidentes propios y de mis compañeras de patrulla.",
            "a3e5dd16-5205-4d00-b79b-e14d0492e34d": "**Organizando** las tácticas de mi equipo para interceptar a los monitores que actúan como osos en movimiento, ideando estrategias antes de partir.",
            "d531dd19-4d49-4342-8114-184de017ac49": "**Comunicándome** con señas manuales y gestos en la penumbra para mantener alineado el grupo de búsqueda sin revelar nuestra presencia.",
            "aacee532-b682-4d8e-8c5d-d6e9396162a4": "**Agudizando** mis sentidos para interpretar sonidos, sombras y distancias en la noche forestal, ampliando mis destrezas de exploración."
        }
    },
    "el-acecho-del-inobservable": {
        "titulo": "El Acecho del Inobservable",
        "descripcion": "Dinámica de acecho nocturno que entrena la observación minuciosa y la paciencia. Un dirigente (el \"Inobservable\") se oculta en una zona arbolada. Cuenta con una linterna y realiza acciones extrañas de tanto en tanto (emitir sonidos, interactuar de manera misteriosa con objetos, encender la linterna brevemente). Los participantes deben infiltrarse en el sector, encontrarlo y observarlo detenidamente para anotar todo lo que hace, sin revelar su propia presencia. Si el Inobservable u otros dos Scouters patrulleros con linternas iluminan directamente a un jugador, este debe volver a la base segura para recuperar una vida antes de continuar.",
        "objetivos_generales": ["Estimular la observación", "Perder el miedo a la oscuridad", "Trabajo en equipo", "Estimular la atención a los detalles"],
        "como_se_cumple": {
            "a93b3a5c-a023-4e0c-815d-c77c6700dd89": "**Observando** con atención las conductas inusuales y acciones del Scouter invisible en el bosque nocturno, anotando cada detalle de forma discreta.",
            "8bbd7392-24e1-453f-bd7a-8265d57877c9": "**Analizando** los extraños sonidos y movimientos del inobservable para descifrar el significado de sus patrones lúdicos sin delatar mi posición.",
            "8cae916f-5e67-4697-b3cd-c59b5c7d1439": "**Desplazándome** con sigilo por terrenos irregulares a oscuras, evitando zonas peligrosas como pendientes o ramas bajas para prevenir caídas de mi equipo.",
            "68add558-4b03-4105-b00d-e7f2ead6ac23": "**Manteniendo** la calma y aplicando los protocolos de emergencia del juego si algún compañero tropieza o sufre un percance físico en la penumbra.",
            "1b5e42cb-c832-4c3a-8ed5-a3050b6e2285": "**Registrando** minuciosamente los gestos y movimientos que realiza el Scouter oculto, prestando atención a los misterios propuestos en la dinámica.",
            "aacee532-b682-4d8e-8c5d-d6e9396162a4": "**Investigando** de manera detectivesca la posición del inobservable, guiándome por pequeños indicios auditivos en medio del silencio nocturno.",
            "273f60b8-7953-4416-97c3-e8c83615364f": "**Ejercitando** mi resistencia corporal al arrastrarme por el suelo y mantener posiciones estáticas para mantenerme oculta de la linterna de los guardianes.",
            "57887da4-c70e-45bc-bdfb-f79db513a89c": "**Auxiliando** a mi patrulla siguiendo las directrices de seguridad indicadas en caso de que alguna compañera pierda el equilibrio en la oscuridad."
        }
    },
    "el-matamoscas-en-cadena": {
        "titulo": "El Matamoscas en Cadena",
        "descripcion": "Juego dinámico de persecución grupal en un área delimitada de 20x10 metros. Un jugador comienza como 'el matamoscas' en el centro. Al silbatazo, el resto intenta correr de un extremo al otro del campo sin ser atrapados. Cada participante atrapado debe unirse de la mano al perseguidor, formando una cadena humana que crece en cada ronda. El objetivo de la cadena es organizarse para acorralar y atrapar a los corredores restantes. El juego termina cuando todos han sido integrados a la cadena. El último jugador en ser capturado es el ganador de la dinámica.",
        "objetivos_generales": ["Desfogue de Energías", "Estimular la agilidad", "Estimular la capacidad de reacción", "Trabajo en equipo"],
        "como_se_cumple": {
            "942e2a3a-b7b5-4b88-b82a-261244f3683e": "**Corriendo** con velocidad pero con cuidado dentro de los límites del campo, evitando empujones y frenadas bruscas que puedan hacernos caer a mí o a mis amigos.",
            "5d2d48ed-c461-4a8e-9048-cceecd3de2e2": "**Respetando** las reglas del juego al tomar de la mano a mis compañeros de cadena sin soltarme y aceptando alegremente cuando soy atrapado por el matamoscas en medio de la cancha.",
            "a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808": "**Incluyendo** a todos los lobatos en la cadena y asegurando que nadie se quede atrás, experimentando cómo el juego cooperativo protege y valora a todos mis pares por igual.",
            "e13cc7f4-052f-476c-b068-95dc59e284b2": "**Evitando** pisar las plantas o ramas de los bordes del campo mientras corro para salvarme, dejando la zona de juego limpia y en perfecto estado al terminar.",
            "8cae916f-5e67-4697-b3cd-c59b5c7d1439": "**Coordinando** los giros y la velocidad de la cadena de corredores para no tirar con brusquedad de mis extremos, previniendo caídas y tirones articulares.",
            "6768d60a-187e-4bbf-97b9-cdc25a316030": "**Colaborando** en la delimitación segura del cuadrante de juego de 20x10 metros, retirando piedras y ramas antes de que la tropa comience a correr.",
            "a3d7abdf-ca3b-42b8-92b5-403958fb537c": "**Apoyando** el ritmo de carrera de todos los integrantes que entran a la cadena, adaptándome a las capacidades de velocidad de cada uno de mis compañeros.",
            "0d3af46a-d64c-4e59-a765-1f72dc41ba76": "**Trabajando** en equipo con los capturados para acorralar a los últimos corredores libres mediante movimientos en bloque coordinados de nuestra patrulla."
        }
    },
    "el-combate-de-los-cangrejos-y-gallos": {
        "titulo": "El Combate de los Cangrejos y Gallos",
        "descripcion": "Actividad de destreza física y equilibrio compuesta por dos modalidades. Pelea de Gallos: los oponentes se colocan en cuclillas (con rodillas dobladas, sin arrodillarse) dentro de un cuadrilátero delimitado. Manteniendo las manos abiertas, deben intentar empujar suavemente los brazos del rival para obligarlo a perder el equilibrio o tocar el suelo con las rodillas o glúteos. Lucha de Cangrejos: en posición cuadrúpeda invertida (boca arriba apoyados en pies y manos sin tocar el piso con la espalda), intentan levantar una de las extremidades de apoyo del rival para hacerlo tocar el suelo con la espalda.",
        "objetivos_generales": ["Conocer las capacidades corporales", "Estimular la agilidad", "Estimular la coordinación", "Fomentar la sana competencia"],
        "como_se_cumple": {
            "46d36119-8d9f-44f3-ae11-b9851a71eff1": "**Manteniendo** una postura adecuada e higiénica después del combate en cuclillas, preocupándome por lavar mis manos y sacudir mi ropa al finalizar la dinámica.",
            "fb56310a-a9cf-46e3-9c34-c4643f6b9035": "**Evitando** el uso de la fuerza desmedida o movimientos bruscos sobre mi oponente durante la lucha en cuclillas, asegurando que ambos mantengamos la integridad física.",
            "62876ebe-214f-4caf-b164-664e12fd30ae": "**Evaluando** mis límites corporales de equilibrio, fuerza y flexibilidad al intentar derribar a mi contrincante sin caer en la colchoneta.",
            "71413ac6-8ae9-4034-b580-e2f1c2f9f42c": "**Controlando** la frustración si pierdo el equilibrio y felicitando a mi rival con madurez, esforzándome por jugar limpio en todo momento.",
            "273f60b8-7953-4416-97c3-e8c83615364f": "**Ejercitando** mi musculatura central, piernas y brazos mientras mantengo la posición de cangrejo (boca arriba en cuatro apoyos) resistiendo el empuje de mi oponente.",
            "91473f71-9345-4bcf-bfc7-dea709d12361": "**Controlando** mis empujones y cuidando de no realizar llaves o presiones indebidas que puedan lastimar a mi oponente en el círculo de combate.",
            "075c93b1-81d2-4370-8e47-f0a4d086b20e": "**Jugando** bajo las reglas explícitas de la pelea de gallos, no utilizando trucos sucios ni ventajas indebidas y apoyando la honestidad mutua.",
            "c4fe900a-9641-4cad-a265-3f31073d83cb": "**Manteniéndome** firme en mi convicción de jugar limpio, incluso cuando la competencia sea muy reñida, asumiendo mis decisiones corporales con entereza."
        }
    },
    "el-asalto-a-las-cuatro-colinas": {
        "titulo": "El Asalto a las Cuatro Colinas",
        "descripcion": "Juego de acecho nocturno en bosque espeso y terreno accidentado. Se delimita un fuerte cuadrangular con cuatro pañoletas grandes en los vértices y faroles de luz en el centro. El grupo se divide en atacantes (dos tercios) y defensores (un tercio). Los atacantes deben infiltrarse en el perímetro del fuerte y revelar su posición mediante un silbido, sin ser reconocidos previamente. Los defensores custodian el perímetro usando linternas, debiendo identificar y llamar por su nombre a cualquier atacante descubierto fuera de los límites. El atacante avistado es enviado temporalmente a prisión.",
        "objetivos_generales": ["Estrategia y planificación", "Estimular la observación", "Trabajo en equipo", "Perder el miedo a la oscuridad"],
        "como_se_cumple": {
            "a93b3a5c-a023-4e0c-815d-c77c6700dd89": "**Investigando** las mejores rutas de sigilo y zonas de sombra en el bosque accidentado para infiltrarme en las colinas sin ser descubierto.",
            "8bbd7392-24e1-453f-bd7a-8265d57877c9": "**Evaluando** el rango de luz de las linternas y el movimiento de los guardianes defensores para deducir el momento idóneo para avanzar.",
            "8cae916f-5e67-4697-b3cd-c59b5c7d1439": "**Desplazándome** con cautela en el terreno boscoso nocturno, cuidando mis articulaciones y manteniéndome alerta a desniveles para evitar lesiones en mi patrulla.",
            "68add558-4b03-4105-b00d-e7f2ead6ac23": "**Actuando** con responsabilidad e informando inmediatamente a los Scouters de apoyo si algún atacante tropieza o necesita asistencia en el bosque.",
            "1b5e42cb-c832-4c3a-8ed5-a3050b6e2285": "**Analizando** de manera proactiva la disposición de las pañoletas del fuerte para encontrar el flanco menos custodiado por las linternas defensoras.",
            "aacee532-b682-4d8e-8c5d-d6e9396162a4": "**Perfeccionando** mis técnicas de camuflaje y acecho nocturno utilizando elementos del bosque para ocultar mi aproximación a las colinas.",
            "273f60b8-7953-4416-97c3-e8c83615364f": "**Poniendo** a prueba mi agilidad física al gatear y moverme con rapidez a ras del suelo forestal para burlar las linternas de los guardianes.",
            "57887da4-c70e-45bc-bdfb-f79db513a89c": "**Siguiendo** con calma las instrucciones del equipo y deteniendo el juego si se escucha la señal de alarma o si alguna compañera se lastima en la oscuridad.",
            "fe57c89e-be7b-46a1-b370-64df400355fa": "**Aplicando** de forma innovadora técnicas de camuflaje nocturno y uso técnico de la luz y las sombras en la planificación táctica de asalto a las colinas.",
            "05f42879-f5f5-40c4-bed6-c577bf61340a": "**Regulando** mi esfuerzo físico e hidratándome adecuadamente tras las exigentes carreras y acechos en terreno accidentado bajo el clima nocturno."
        }
    },
    "la-captura-de-las-serpientes-veloces": {
        "titulo": "La Captura de las Serpientes Veloces",
        "descripcion": "Juego de velocidad y reflejos rápidos. Se colocan cuerdas cortas de un metro en el suelo en el centro de un área circular, debiendo haber siempre una cuerda menos que la cantidad de participantes. Al sonar el silbato, los Scouts corren libremente alrededor y deben atrapar una de las 'serpientes'. El participante que no logre conseguir cuerda queda fuera de la ronda. En caso de que dos jugadores agarren simultáneamente los extremos de una cuerda, se dirime mediante una prueba rápida de velocidad: se sitúa la cuerda a diez metros de distancia de ambos en la línea y al silbatazo corren para ser el primero en tomarla por completo.",
        "objetivos_generales": ["Estimular la capacidad de reacción", "Estimular la agilidad", "Fomentar la sana competencia"],
        "como_se_cumple": {
            "942e2a3a-b7b5-4b88-b82a-261244f3683e": "**Moviéndome** con rapidez pero cuidando de no chocar o empujar a mis compañeros cuando corremos a atrapar una cuerda del suelo.",
            "0645e815-1412-4f5c-981c-cb5c1d94d772": "**Colaborando** al ordenar las cuerdas y materiales en su caja correspondiente una vez finalizada la cacería de serpientes en el campo.",
            "e9f10dfe-654a-46fd-95ff-5a3d21a26e00": "**Admitiendo** con honestidad si mi compañero tocó la cuerda antes que yo en la prueba de velocidad, respetando los resultados reales.",
            "3a84066e-ad27-4122-9a89-4ae45844668b": "**Divirtiéndome** al competir con alegría junto a mis compañeros y consolando afectuosamente a quien sea eliminado de la ronda de cuerdas.",
            "8cae916f-5e67-4697-b3cd-c59b5c7d1439": "**Dosificando** mi aceleración al correr para no colisionar en la disputa directa por las cuerdas en el área delimitada.",
            "68add558-4b03-4105-b00d-e7f2ead6ac23": "**Asistiendo** y aplicando primeros auxilios básicos si algún integrante de la tropa sufre un raspón o caída durante el sprint hacia la meta.",
            "62876ebe-214f-4caf-b164-664e12fd30ae": "**Comprobando** mi velocidad de reacción y agilidad mental al reaccionar instantáneamente al silbato para tomar una cuerda libre.",
            "71413ac6-8ae9-4034-b580-e2f1c2f9f42c": "**Evitando** quejas o reacciones molestas cuando me quede sin cuerda, aceptando la eliminación con deportividad scout y apoyando al resto."
        }
    },
    "la-gran-batalla-de-globos-y-granjeros": {
        "titulo": "La Gran Batalla de Globos y Granjeros",
        "descripcion": "Dinámica lúdica recreativa en dos etapas. En la primera fase (Batalla de Globos), cada participante se ata un globo inflado al tobillo, colgando unos 10 cm con un trozo de lana. El objetivo es pisar y reventar el globo de los oponentes mientras se defiende el propio dentro de un perímetro. El jugador que pierde su globo es eliminado. En la segunda fase (Cerdos y Granjeros), el grupo se divide en dos equipos en una zona acotada. Los granjeros deben coordinarse para atrapar y levantar físicamente del suelo a los 'cerditos' durante cinco segundos seguidos para eliminarlos.",
        "objetivos_generales": ["Desfogue de Energías", "Estimular la agilidad", "Fomentar la sana competencia", "Trabajo en equipo"],
        "como_se_cumple": {
            "942e2a3a-b7b5-4b88-b82a-261244f3683e": "**Cuidando** mis movimientos al intentar pisar los globos de los demás para no enredarme las piernas con el hilo o pisar fuertemente a mis compañeros.",
            "5d2d48ed-c461-4a8e-9048-cceecd3de2e2": "**Jugando** limpiamente y retirándome del cuadrante de juego con una sonrisa si mi globo es reventado por otro lobato.",
            "a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808": "**Respetando** a todos los participantes en el juego de cerdos y granjeros, asegurando que todos tengan la oportunidad de jugar en ambos roles por igual.",
            "e13cc7f4-052f-476c-b068-95dc59e284b2": "**Recogiendo** todos los pedazos de globos reventados del pasto al terminar el juego, para evitar que los animales de la zona se los traguen y mantener la naturaleza limpia.",
            "8cae916f-5e67-4697-b3cd-c59b5c7d1439": "**Realizando** de forma segura las técnicas de levantamiento de mis compañeros en el rol de granjero, protegiendo mi espalda y articulaciones al cargarlos durante cinco segundos.",
            "68add558-4b03-4105-b00d-e7f2ead6ac23": "**Auxiliando** a mi compañero si sufre una torcedura de tobillo durante la intensa batalla de globos, aplicando primeros auxilios de ser necesario.",
            "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3": "**Reflexionando** en patrulla tras el juego sobre la importancia del consentimiento y el trato digno a los demás al realizar juegos de contacto físico.",
            "0d3af46a-d64c-4e59-a765-1f72dc41ba76": "**Trabajando** en equipo con mis compañeros granjeros para rodear estratégicamente a los cerditos más veloces y levantarlos de manera segura y coordinada."
        }
    },
    "los-mensajeros-de-la-selva": {
        "titulo": "Los Mensajeros de la Selva",
        "descripcion": "Juego sensorial y de acecho nocturno o diurno en el bosque. Varios dirigentes se ocultan en diferentes puntos y representan a un animal de la selva de Seeonee, cada uno con un sonido característico (como la vaca, burro, oveja o el lobo). Cada 30 segundos, los dirigentes emiten su respectivo grito de llamada. Las seisenas de lobatos deben avanzar en sigilo y usar el oído para rastrear a los animales en el follaje. Al encontrar uno, reciben tarjetas con puntaje descendente (premiando la rapidez). El juego finaliza cuando la manada ha localizado y registrado a todos los mensajeros.",
        "objetivos_generales": ["Reforzar el desarrollo de los sentidos", "Estimular la observación", "Trabajo en equipo", "Conocer a los demás"],
        "como_se_cumple": {
            "ec280dd0-2d80-4b84-86ad-2d362da14886": "**Agudizando** mi sentido de la escucha y observando entre la maleza cada treinta segundos para localizar los escondites de los dirigentes disfrazados de animales de la selva.",
            "418f2b77-f15b-405a-95bd-8033c0b6a4c2": "**Relatando** a mi seisena con entusiasmo y precisión cómo logramos descubrir a los animales escondidos y la graciosa forma en que hacían sus sonidos en el bosque.",
            "b76e1d3e-fc1e-4956-806b-f372cd0369bb": "**Sacudiendo** la tierra de mis rodillas y lavando mis manos al terminar la búsqueda entre las ramas y hojas secas del bosque.",
            "6467298d-fe2b-4920-9b9a-e3524e4b2aef": "**Identificando** cómo mis oídos captan el sonido y cómo mis pulmones y corazón trabajan más rápido al correr con mi seisena en busca de los animales."
        }
    },
    "el-mural-colectivo-a-relevos": {
        "titulo": "El Mural Colectivo a Relevos",
        "descripcion": "Dinámica artística a relevos para fomentar la expresión e integración grupal. Los equipos se alinean a 10 metros de un muro o tablero donde se ha colgado un pliego grande de papel con un plumón. A la señal del monitor, el primer integrante corre hasta el mural y dispone de 10 segundos exactos para comenzar a dibujar sobre una temática acordada previamente (como 'el campamento de patrulla' o 'la ciudad ideal'). Pasado el tiempo, regresa corriendo para entregar el marcador al siguiente, quien continúa la idea de su compañero sin pausar. Se evalúa el trabajo en equipo, la agilidad y la coherencia expresiva final.",
        "objetivos_generales": ["Estimular la creatividad", "Trabajo en equipo", "Construcción de Equipos"],
        "como_se_cumple": {
            "ec280dd0-2d80-4b84-86ad-2d362da14886": "**Identificando** de manera veloz los trazos y aportaciones que mis compañeros de seisena hacen en el papel para continuar su idea artística con coherencia.",
            "418f2b77-f15b-405a-95bd-8033c0b6a4c2": "**Explicando** al grupo con lujo de detalles la historia del mural colectivo que creamos entre todos durante los relevos.",
            "a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808": "**Colaborando** pacientemente en el dibujo grupal, respetando el turno de cada lobato de la fila sin acaparar el plumón ni tachar los trazos ajenos.",
            "e13cc7f4-052f-476c-b068-95dc59e284b2": "**Manteniendo** el salón de juegos ordenado al tapar los plumones y reciclar los trozos sobrantes de papel para cuidar nuestro espacio común.",
            "49ae6ac6-be8f-4f2c-8b3e-6711d041181f": "**Proponiendo** ideas creativas a mi patrulla sobre los símbolos de la ciudad a dibujar, expresándome libremente en la ronda de debate previa.",
            "8bbd7392-24e1-453f-bd7a-8265d57877c9": "**Interpretando** el sentido del mural colectivo de los otros equipos, reflexionando sobre la diversidad de visiones que tenemos sobre un mismo tema.",
            "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3": "**Representando** a través del dibujo colectivo conceptos de igualdad y derechos comunitarios que debatimos previamente en la patrulla.",
            "0d3af46a-d64c-4e59-a765-1f72dc41ba76": "**Comprometiéndome** con el rol de relevo asignado, corriendo velozmente a plasmar mi parte del dibujo para lograr la meta colectiva de la patrulla.",
            "e1b7276f-4fd2-4c39-a32a-bd7fadbee702": "**Aportando** mis ideas visuales de forma constructiva durante la planificación previa al relevo para acordar la temática artística de mi patrulla.",
            "aacee532-b682-4d8e-8c5d-d6e9396162a4": "**Desarrollando** destrezas de síntesis gráfica al tener que dibujar conceptos complejos de forma clara en apenas diez segundos.",
            "670852e4-d07d-48f5-b39b-b0b336059600": "**Involucrándome** en el diseño de un mural que ilustre de manera gráfica temas de civismo y derechos en nuestra comunidad.",
            "b3d92c8b-c7c8-42bc-bc03-4e925e019a87": "**Planificando** cómo este tipo de expresiones artísticas colectivas pueden ser usadas en un proyecto de servicio real para pintar un muro de nuestra escuela."
        }
    },
    "el-desafio-de-los-magos-de-teis": {
        "titulo": "El Desafío de los Magos de Teis",
        "descripcion": "Un gran juego de bases y de rol al aire libre. La historia narra que, por haber infringido las sabias normas del pueblo, unos prisioneros fueron encarcelados. Su liberación depende de que los equipos superen difíciles desafíos de los Hechiceros de la tribu para devolverles la cordura. Los participantes se dividen en equipos y recorren bases donde los guardianes/magos proponen desafíos técnicos específicos (como reescribir la leyenda histórica y crear un himno, decodificar mensajes cifrados en morse, o identificar objetos naturales misteriosos mediante el tacto y el olfato). Los Consejeros evalúan la ejecución final y otorgan pistas.",
        "objetivos_generales": ["Refuerzo de habilidades técnicas", "Estrategia y planificación", "Trabajo en equipo", "Aprender criptografía"],
        "como_se_cumple": {
            "11320fb6-98de-4725-825d-db858e3bffa2": "**Construyendo** adornos tribales y joyería scout con cuerdas y retazos de tela para cumplir con las pruebas de caracterización de la tribu.",
            "8bbd7392-24e1-453f-bd7a-8265d57877c9": "**Decodificando** los mensajes cifrados en Morse y resolviendo los acertijos sensoriales de los hechiceros para encontrar el cetro perdido.",
            "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3": "**Escuchando** y debatiendo de forma constructiva con mi patrulla las decisiones de la tribu para superar el reto sin discusiones dañinas.",
            "0d3af46a-d64c-4e59-a765-1f72dc41ba76": "**Colaborando** activamente en la estación asignada por mi jefe de patrulla para resolver los retos en el tiempo acordado por el Consejo.",
            "103661fc-3396-4eac-9182-58b7e54d5115": "**Elaborando** de forma creativa vestuarios temáticos utilizando cartones, retazos y tiza, demostrando ingenio técnico bajo presión.",
            "aacee532-b682-4d8e-8c5d-d6e9396162a4": "**Practicando** y expandiendo mis conocimientos de criptografía scout y técnicas de rastreo para guiar a mi patrulla en la descodificación.",
            "670852e4-d07d-48f5-b39b-b0b336059600": "**Respetando** a todos los miembros de mi patrulla y valorando la equidad de roles durante los desafiantes juegos de bases de los Magos.",
            "b3d92c8b-c7c8-42bc-bc03-4e925e019a87": "**Liderando** la resolución colectiva de la prueba de reescritura de la leyenda de la tribu, fomentando la cooperación y la ayuda mutua en el juego.",
            "fefc6ed0-97f8-4a71-99d9-f56729ba0a92": "**Analizando** de manera crítica las pistas e historias de la tribu THEIS, para proponer a mi equipo soluciones lógicas e inteligentes a los desafíos de los magos.",
            "bf199285-12a9-422e-b97a-2fe99f326809": "**Respetando** democráticamente los consensos de mi equipo para asignar roles en las diferentes bases y delegar responsabilidades de liderazgo."
        }
    }
}

def process_file(filepath):
    filename = os.path.basename(filepath)
    slug = filename.replace(".md", "")
    
    if slug not in final_activities:
        print(f"Skipping {filename} (not in final list)")
        return
        
    config = final_activities[slug]
    print(f"Populating final content for {filename}...")
    
    # Leer el borrador actual
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Extraer frontmatter y tabla de objetivos
    lines = content.split("\n")
    
    new_lines = []
    in_frontmatter = False
    frontmatter_count = 0
    
    # Reconstruiremos el archivo de manera limpia
    # Primero el frontmatter
    for line in lines:
        if line.strip() == "---":
            frontmatter_count += 1
            new_lines.append(line)
            continue
            
        if frontmatter_count == 1:
            # Estamos dentro del frontmatter, actualizamos objetivos_generales
            if line.startswith("objetivos_generales:"):
                # Escribimos los objetivos generales definitivos
                new_lines.append(f"objetivos_generales: {json.dumps(config['objetivos_generales'], ensure_ascii=False)}")
            else:
                new_lines.append(line)
        else:
            # Fuera de frontmatter, procesamos el resto cuando hayamos cerrado frontmatter
            if frontmatter_count >= 2:
                break
                
    # Agregar el cuerpo estructurado final
    new_content = "\n".join(new_lines) + "\n\n"
    new_content += f"# {config['titulo']}\n\n"
    new_content += f"## 📝 Descripción\n{config['descripcion']}\n\n"
    new_content += f"## 🔄 Variaciones\n"
    
    # Extraer variaciones y recomendaciones del borrador actual
    var_section = ""
    rec_section = ""
    just_section = ""
    
    # Buscamos las secciones originales del borrador para preservarlas/completarlas
    content_body = "\n".join(lines[lines.index("---", 5)+1:]) # saltar frontmatter
    
    var_match = re.search(r"## 🔄 Variaciones\n(.*?)(?=\n## ⚠️ Recomendaciones|\Z)", content_body, re.DOTALL)
    if var_match:
        var_section = var_match.group(1).strip()
    else:
        var_section = "Variaciones de la actividad."
        
    rec_match = re.search(r"## ⚠️ Recomendaciones\n(.*?)(?=\n## 🎯 Justificación Pedagógica de Áreas|\Z)", content_body, re.DOTALL)
    if rec_match:
        rec_section = rec_match.group(1).strip()
    else:
        rec_section = "Recomendaciones de seguridad."
        
    just_match = re.search(r"## 🎯 Justificación Pedagógica de Áreas\n(.*?)(?=\n## 🎓 Objetivos Educativos|\Z)", content_body, re.DOTALL)
    if just_match:
        just_section = just_match.group(1).strip()
    else:
        just_section = "Justificación de las áreas."
        
    new_content += f"{var_section}\n\n"
    new_content += f"## ⚠️ Recomendaciones\n{rec_section}\n\n"
    new_content += f"## 🎯 Justificación Pedagógica de Áreas\n{just_section}\n\n"
    
    new_content += "## 🎓 Objetivos Educativos y Evaluación (¿Cómo se cumple?)\n"
    new_content += "| Unidad | Área | Objetivo Educativo | ¿Cómo se cumple? |\n"
    new_content += "| :--- | :--- | :--- | :--- |\n"
    
    # Procesar objetivos relacionales de la tabla
    # Buscamos en el contenido original la tabla de objetivos
    table_lines = []
    for line in lines:
        if "|" in line and not line.startswith("---") and not "Unidad" in line and not ":---" in line:
            parts = [p.strip() for p in line.split("|")][1:-1]
            if len(parts) >= 4:
                unidad, area, texto, placeholder = parts[0], parts[1], parts[2], parts[3]
                # Buscar id en el placeholder (formato: [PLACEHOLDER_CSC:id:unidad:area])
                match = re.search(r"PLACEHOLDER_CSC:([a-f0-9\-]+)", placeholder)
                if match:
                    obj_id = match.group(1)
                    csc_text = config["como_se_cumple"].get(obj_id, "[PLACEHOLDER]")
                    table_lines.append(f"| {unidad} | {area} | {texto} | {csc_text} |")
                    
    new_content += "\n".join(table_lines) + "\n"
    
    # Guardar
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Completed: {filepath}")

def main():
    act_dir = "docs/actividades"
    for filename in os.listdir(act_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(act_dir, filename)
            process_file(filepath)

if __name__ == "__main__":
    main()
