# -*- coding: utf-8 -*-
import json
import os

OBJECTIVES_PATH = r"C:\Users\claud\Documents\PWA\NuaMana\supabase\scripts\progresion_objetivos_clean.json"
OUTPUT_DIR = r"C:\Users\claud\Documents\PWA\NuaMana\scratch"

# Load master objectives database
with open(OBJECTIVES_PATH, "r", encoding="utf-8") as f:
    objs = json.load(f)

# Helper to find UUID and text of objectives
def get_obj(unit_id, area_id, age_range_prefix):
    # Normalize prefixes to look for
    normalized_prefix = age_range_prefix.lower()
    if "tard" in normalized_prefix:
        normalized_prefix = "tard"
    elif "med" in normalized_prefix:
        normalized_prefix = "med"
        
    for o in objs:
        if o["unidad_id"] == unit_id and o["area_id"] == area_id:
            r_edad = o["rango_edad"].lower()
            if normalized_prefix in r_edad:
                text = o["texto_terminal"] if unit_id == 5 else o["texto_infantil"]
                return o["id"], text, o["unidad_nombre"], o["area_nombre"]
    raise Exception(f"Objective not found: Unit ID {unit_id}, Area ID {area_id}, Range matching {age_range_prefix}")

# BATCH 0 DATA DEFINITIONS
batch_0_data = [
    {
        "original_title": "Aplausos.",
        "titulo_reescrito": "Ritmo de Nombres",
        "tipo": "Actividad",
        "subtipo": "dinámica",
        "duracion": "15 min",
        "cantidad": "10-25",
        "base_image": "juegos_circulo_base.jpg",
        "lugares": ["sala", "salón", "campo abierto"],
        "materiales": ["Sin Materiales"],
        "variaciones": "Se puede aumentar la velocidad del ritmo progresivamente o realizarlo sentados en círculo golpeando rítmicamente el suelo con los pies en lugar de dar palmadas.",
        "recomendaciones": "Mantener un ritmo lento y constante al inicio para que todos los participantes se sientan cómodos e integrados, evitando burlas o exclusiones si alguien se equivoca.",
        "descripcion_reescrita": "Los participantes se colocan sentados o de pie formando un círculo amplio y despejado. El facilitador inicia marcando un ritmo constante de cuatro tiempos que todo el grupo debe seguir al unísono: primer tiempo golpeando las piernas con las palmas de las manos, segundo tiempo dando una palmada, tercer tiempo llevando la mano derecha hacia atrás sobre el hombro derecho con el pulgar apuntando hacia atrás, y cuarto tiempo haciendo el mismo movimiento con la mano izquierda sobre el hombro izquierdo.\n\nEl desafío pedagógico del juego comienza cuando, al realizar el movimiento de la mano derecha (tercer tiempo), el participante debe pronunciar en voz alta su propio nombre, y al realizar el movimiento de la mano izquierda (cuarto tiempo), debe pronunciar el nombre de otro integrante del círculo. La persona que ha sido nombrada adquiere el turno y debe continuar en el siguiente ciclo diciendo su propio nombre en el tercer tiempo y el de otro compañero en el cuarto tiempo, sin romper la sincronía rítmica del grupo. El juego continúa fluyendo por el círculo de forma dinámica hasta que todos se hayan presentado y se logre un ambiente de distensión e integración social.",
        "extracto": "Una divertida dinámica en círculo donde los scouts coordinan palmas y movimientos corporales para presentarse y memorizar los nombres de sus compañeros al ritmo de un compás constante.",
        "areas": ["sociabilidad"],
        "unidades": ["manada"],
        "objetivos_generales": ["Conocer a los demás", "Facilitar el contacto inicial", "Estímulo y desarrollo de la memoria"],
        "justificacion_areas": "Esta dinámica estimula la Sociabilidad al promover la integración y el conocimiento mutuo del grupo a través del juego. Al obligar a los participantes a memorizar y pronunciar los nombres de sus compañeros, se eliminan barreras iniciales de comunicación y se crea un sentido de pertenencia en la seisena.",
        "eval_templates": [
            (1, 5, "Infancia Media", "**Apoyando** con entusiasmo al compañero que dirige el compás en el centro del círculo, diciendo mi nombre con claridad en el tercer tiempo de la secuencia."),
            (1, 5, "Infancia Tard", "**Respetando** el turno rítmico de cada participante y ayudando de forma lúdica a integrar a los nuevos lobatos al círculo de presentación de nombres.")
        ]
    },
    {
        "original_title": "Pelota en el aire.",
        "titulo_reescrito": "Pelota al Aire",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "15 min",
        "cantidad": "10-20",
        "base_image": "juegos_carrera_base.jpg",
        "lugares": ["campo abierto", "patio", "gimnasio"],
        "materiales": ["Una pelota de goma o balón liviano"],
        "variaciones": "Se puede jugar usando un disco volador (frisbee) en lugar de una pelota para añadir dificultad, o requerir que la persona nombrada deba dar un giro completo de 360 grados antes de atrapar la pelota.",
        "recomendaciones": "Asegurar que los participantes en el círculo mantengan suficiente distancia para evitar colisiones al correr hacia el centro por la pelota.",
        "descripcion_reescrita": "Los jugadores se colocan de pie formando un gran círculo, manteniendo los brazos sueltos y alertas. Un participante se ubica en el centro sosteniendo una pelota liviana. El jugador del centro lanza la pelota con fuerza y precisión verticalmente hacia arriba mientras grita con claridad el nombre de uno de los compañeros del círculo. Inmediatamente después de lanzar la pelota, el lanzador corre a ocupar el lugar vacío que dejó el compañero nombrado en el círculo exterior.\n\nEl participante cuyo nombre fue gritado debe reaccionar con rapidez, correr hacia el centro y atrapar la pelota en el aire antes de que esta toque el suelo. Si logra atraparla, se convierte en el nuevo lanzador en el centro, lanzándola nuevamente al aire mientras grita otro nombre. Si no la atrapa a tiempo, el juego se detiene brevemente para alentar al compañero y reiniciar desde el centro. El juego fluye velozmente hasta que todos hayan sido nombrados al menos una vez, logrando que los scouts memoricen los nombres y coordinen reflejos físicos.",
        "extracto": "Un emocionante juego de agilidad y velocidad de reacción donde los scouts corren al centro para atrapar una pelota lanzada al aire al escuchar su nombre.",
        "areas": ["corporalidad", "sociabilidad"],
        "unidades": ["manada"],
        "objetivos_generales": ["Conocer a los demás", "Estimular la capacidad de reacción", "Estimular la agilidad"],
        "justificacion_areas": "Estimula la Corporalidad mediante el desarrollo de la velocidad de desplazamiento, coordinación visomotora y reflejos rápidos al atrapar la pelota. Fomenta la Sociabilidad al exigir que todos los participantes presten atención y memoricen los nombres de sus compañeros para integrarlos activamente en la dinámica.",
        "eval_templates": [
            (1, 1, "Infancia Media", "**Corriendo** con velocidad hacia el centro del círculo al oír mi nombre para atrapar la pelota antes de que toque el suelo, ejercitando mi agilidad física."),
            (1, 1, "Infancia Tard", "**Coordinando** mis brazos y manos para capturar de forma segura la pelota en el aire mientras equilibro mi cuerpo al frenar mi carrera en el centro."),
            (1, 5, "Infancia Media", "**Acatando** la regla de esperar en la línea del círculo exterior sin invadir el centro de juego hasta que sea explícitamente nombrado por el lanzador."),
            (1, 5, "Infancia Tard", "**Respetando** el reglamento de juego limpio del círculo, aceptando de buena gana cuando no alcanzo la pelota y apoyando al compañero que toma el centro.")
        ]
    },
    {
        "original_title": "Carrera de nombres.",
        "titulo_reescrito": "Carrera de Presentación",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "15 min",
        "cantidad": "10-25",
        "base_image": "juegos_carrera_base.jpg",
        "lugares": ["campo abierto", "patio", "gimnasio"],
        "materiales": ["Sin Materiales"],
        "variaciones": "El dirigente puede señalar saltando en un pie, obligando a los señalados a correr al centro diciendo su nombre de la misma forma, o girar velozmente señalando múltiples scouts al mismo tiempo.",
        "recomendaciones": "Establecer un área libre de obstáculos en el suelo para evitar tropiezos al cambiar de dirección o girar de manera rápida.",
        "descripcion_reescrita": "Los scouts forman un gran círculo con las manos atrás y los ojos puestos en el centro. Un dirigente o seisenero se ubica en el centro de pie y asume el rol de señalador. El señalador gira en el centro y, de manera repentina, extiende el brazo señalando a un participante del círculo exterior mientras grita una señal de voz. El participante señalado debe responder gritando su nombre propio en voz alta de manera instantánea.\n\nEl señalador puede variar la dinámica del juego girando lentamente, aumentando la velocidad, saltando o señalando de forma consecutiva a dos participantes en extremos opuestos del círculo. En variaciones más activas, cuando el señalador grita '¡Relevo!', todos los participantes del círculo deben buscar un nuevo puesto corriendo, mientras el señalador intenta ocupar una de las posiciones libres en el círculo exterior, dejando al scout sin puesto como el nuevo señalador en el centro. El juego fomenta la agilidad mental y física de forma integrada.",
        "extracto": "Una dinámica ágil y divertida de presentación rápida donde los scouts deben reaccionar al instante cuando el señalador del centro los apunta con el brazo.",
        "areas": ["sociabilidad"],
        "unidades": ["manada"],
        "objetivos_generales": ["Conocer a los demás", "Facilitar el contacto inicial", "Estimular la capacidad de reacción"],
        "justificacion_areas": "Este juego de presentación rápida estimula la Sociabilidad al forzar el contacto visual e interactivo de los lobatos, eliminando tensiones iniciales. Fomenta el conocimiento del grupo al asociar rostros con nombres en un clima muy activo.",
        "eval_templates": [
            (1, 5, "Infancia Media", "**Colaborando** activamente con el señalador del centro al responder de forma instantánea mi nombre cuando me apunta con el brazo extendido."),
            (1, 5, "Infancia Tard", "**Acatando** las variaciones rápidas de ritmo dispuestas por el dirigente al girar, saltar o correr hacia el centro, manteniendo el respeto del juego colectivo.")
        ]
    },
    {
        "original_title": "¿Te gustan tus vecinos?",
        "titulo_reescrito": "Vecinos Afectuosos",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "20 min",
        "cantidad": "10-25",
        "base_image": "juegos_circulo_base.jpg",
        "lugares": ["sala", "salón", "patio"],
        "materiales": ["Una silla menos que la cantidad de participantes (o pañoletas en el suelo como marcas)"],
        "variaciones": "Si se juega al aire libre, se pueden usar troncos o pañoletas en el suelo para delimitar los puestos. Se puede agregar la regla de que el vecino elegido debe gritar un lema scout antes de sentarse.",
        "recomendaciones": "Evitar movimientos bruscos al correr hacia las sillas vacías para prevenir caídas. Asegurar que las sillas sean estables y seguras.",
        "descripcion_reescrita": "Todos los participantes se sientan en círculo en sus respectivas sillas, excepto uno que comienza de pie en el centro. El participante del centro camina alrededor y se detiene frente a un compañero sentado para preguntarle formalmente: «¿Te gustan tus vecinos?». Si el participante responde «NO», debe declarar inmediatamente los nombres de dos personas de la Manada que desea tener como vecinos a su derecha e izquierda. En ese instante, los vecinos actuales del participante deben levantarse y correr a buscar un nuevo lugar, mientras los dos elegidos corren para ocupar esas dos posiciones libres al lado del participante. Durante este caótico cruce de lugares, el jugador del centro intentará sentarse en cualquiera de las sillas desocupadas, dejando a un nuevo scout sin silla, quien continuará el juego en el centro.\n\nSi el participante frente al cual se detuvo el de pie responde «SÍ», se activa una dinámica colectiva: todo el grupo en círculo debe levantarse y correr un lugar hacia la derecha. Al tercer «SÍ» que se escuche en la ronda, el grupo se levantará para correr dos lugares a la derecha; al cuarto, dos lugares a la izquierda, y así sucesivamente. Esta alternancia exige que los scouts estén en constante atención mental y reaccionen físicamente para no quedarse sin su asiento, fomentando la diversión, la agilidad mental y la risa en el grupo.",
        "extracto": "Una activa dinámica en círculo con sillas donde los participantes eligen nuevos vecinos de derecha e izquierda, desatando un veloz intercambio de lugares.",
        "areas": ["sociabilidad", "corporalidad"],
        "unidades": ["manada"],
        "objetivos_generales": ["Conocer a los demás", "Fomentar un entorno de confianza", "Estimular la agilidad"],
        "justificacion_areas": "Desarrolla la Sociabilidad al incentivar la socialización rápida y la memorización de nombres en un clima de mucha risa y confianza. Promueve la Corporalidad a través de movimientos rápidos de desplazamiento y esquiva en distancias cortas al intentar sentarse antes de que la silla sea ocupada.",
        "eval_templates": [
            (1, 5, "Infancia Media", "**Compartiendo** mi espacio de juego y mi silla con mis compañeros cuando se produce el intercambio masivo al decir NO a la pregunta de vecinos."),
            (1, 5, "Infancia Tard", "**Aceptando** con alegría cuando me quedo sin silla en la carrera del círculo exterior, asumiendo mi rol de preguntar en el centro con buena disposición."),
            (1, 1, "Infancia Media", "**Desplazándome** de forma ágil y rápida para ocupar una silla libre durante el cruce de lugares, ejercitando mi velocidad de reacción física."),
            (1, 1, "Infancia Tard", "**Controlando** la coordinación de mis piernas al correr a máxima velocidad por el círculo, frenando de manera controlada y sin chocar con mis compañeros.")
        ]
    },
    {
        "original_title": "Entrevistas mutuas.",
        "titulo_reescrito": "Entrevistas Cruzadas",
        "tipo": "Actividad",
        "subtipo": "dinámica",
        "duracion": "20 min",
        "cantidad": "10-30",
        "base_image": "juegos_mesa_base.jpg",
        "lugares": ["sala", "salón", "campo abierto"],
        "materiales": ["Hojas de papel", "Lápices para anotar"],
        "variaciones": "Se puede realizar la entrevista a ciegas (con los ojos vendados) para agudizar el sentido de la escucha y favorecer una mayor profundidad de empatía en la conversación.",
        "recomendaciones": "Fomentar una atmósfera de absoluto respeto e intimidad, impidiendo burlas y asegurando que las parejas tengan suficiente espacio físico para hablar tranquilamente.",
        "descripcion_reescrita": "Esta dinámica está orientada a la construcción de relaciones de confianza profunda en parejas. Para iniciar, el facilitador divide al grupo en parejas, emparejando de manera intencional a scouts que no conviven o interactúan habitualmente en sus seisenas o patrullas. Las parejas deben aislarse en diferentes rincones de la sala o el campo abierto para evitar distracciones. Durante los primeros 10 minutos, un integrante de la pareja entrevista al otro, escuchando con atención e interés genuino su historia personal, sus gustos, temores y metas. Al finalizar el tiempo, los roles se intercambian durante otros 10 minutos para que ambos compartan sus visiones.\n\nEl objetivo final es crear un 'mundo común' entre ambos integrantes, encontrando puntos de coincidencia y comprendiendo que las relaciones se fortalecen cuando se basan en la confianza sincera a priori en lugar de prejuicios o distancias. Al finalizar la dinámica, todo el grupo se reúne en círculo para evaluar los sentimientos experimentados, los cambios de perspectiva y el valor de ser escuchado con respeto mutuo.",
        "extracto": "Una dinámica profunda en parejas orientada a la empatía y confianza, donde los scouts se entrevistan mutuamente para derribar prejuicios y crear lazos de amistad.",
        "areas": ["afectividad", "sociabilidad"],
        "unidades": ["manada", "tropa", "compañía"],
        "objetivos_generales": ["Conocer a los demás", "Fomentar las relaciones interpersonales", "Favorecer la comunicación en el grupo"],
        "justificacion_areas": "Esta dinámica estimula la Afectividad al requerir que los participantes se abran emocionalmente y compartan su identidad, lo cual promueve la madurez y la empatía al ponerse en el lugar del otro. Favorece la Sociabilidad al establecer un canal de comunicación de calidad entre scouts de distintas procedencias o intereses, fortaleciendo el tejido del grupo.",
        "eval_templates": [
            (1, 4, "Infancia Media", "**Escuchando** con aprecio y calidez el relato de la historia personal de mi compañero durante la entrevista aislada en parejas."),
            (1, 4, "Infancia Tard", "**Compartiendo** en voz alta mis emociones personales, recuerdos de mi infancia y temores con mi pareja de juego en un clima de respeto."),
            (1, 5, "Infancia Media", "**Ayudando** a mi compañero de entrevista a sentirse cómodo expresando sus vivencias, prestando atención absoluta a sus palabras."),
            (1, 5, "Infancia Tard", "**Respetando** la opinión e ideas de mi pareja de entrevista, incluso si piensa de forma diferente a mí, valorándolo por lo que es."),
            
            (3, 4, "11 a 13 a", "**Abriéndome** con confianza para contarle a mi compañero de patrulla los temas que me confunden o me ponen triste durante nuestra entrevista."),
            (3, 4, "13 a 15 a", "**Expresando** mis sentimientos de inseguridad o rabia sin timidez, manejando mi comunicación asertiva en la charla en parejas."),
            (3, 5, "11 a 13 a", "**Dialogando** en parejas para establecer un lazo de empatía mutuo que nos permita integrarnos mejor en el trabajo de nuestra patrulla."),
            (3, 5, "13 a 15 a", "**Respetando** la intimidad y forma de pensar de mi compañero de entrevista, valorándolo sin juzgar su clase social o su vida."),
            
            (2, 4, "11 a 13 a", "**Comunicando** con sinceridad mis alegrías y dudas a mi compañera de entrevista, fortaleciendo nuestro vínculo de amistad en la patrulla."),
            (2, 4, "13 a 15 a", "**Reconociendo** mis emociones de timidez o duda al conversar de mí misma, compartiendo estas sensaciones de forma honesta con mi compañera."),
            (2, 5, "11 a 13 a", "**Acatando** la regla de confidencialidad de la entrevista cruzada, cuidando la información que mi compañera ha confiado en mí."),
            (2, 5, "13 a 15 a", "**Valorando** la diversidad y las opiniones personales de mi compañera de entrevista, fomentando una cultura de aprecio mutuo en la Compañía.")
        ]
    }
]

# BATCH 2 DATA DEFINITIONS
batch_2_data = [
    {
        "original_title": "El nido.",
        "titulo_reescrito": "El Circuito del Nido",
        "tipo": "Actividad",
        "subtipo": "dinámica",
        "duracion": "30 min",
        "cantidad": "4-16",
        "base_image": "juegos_cooperativo_base.jpg",
        "lugares": ["sala", "salón"],
        "materiales": ["Papelógrafo grande o cartón continuo", "Pinturas de colores", "Lápices de colores", "Un dado", "Fichas improvisadas (piedras o botones)"],
        "variaciones": "Se puede realizar al aire libre dibujando el nido en la tierra con una rama y usando piedras numeradas como fichas para conectarlo con la naturaleza.",
        "recomendaciones": "Fomentar un clima de absoluto respeto y empatía. Si algún participante cae en una misión que toca un tema muy sensible y no desea compartirlo, permitirle pasar o cambiar la misión sin presiones.",
        "descripcion_reescrita": "Los participantes se reúnen en torno a una mesa o en el suelo donde se extiende un gran papelógrafo. En él se dibuja un tablero gigante en forma de nido, dividido en casillas o cuadrados numerados en espiral. Cada participante busca un objeto de la naturaleza (como una piedra pequeña, una hoja seca o un botón de color) que servirá como su ficha personal. El juego se inicia por turnos arrojando el dado y avanzando la ficha la cantidad de casillas correspondientes.\n\nAl caer en una casilla vacía, el participante tiene la misión de escribir al lado de la misma una 'misión de honestidad' o prenda que exprese sentimientos o relate anécdotas de su pasado (por ejemplo: 'relatar un viaje familiar especial', 'compartir qué te hace reír', 'recordar un momento difícil en el colegio'). La misión debe ser de carácter general para que todos puedan participar de ella. Si el jugador cae en una casilla que ya posee una misión o tema escrito por un compañero anterior, debe responder a ella compartiendo su experiencia. El juego continúa en un circuito cerrado hasta que todos hayan compartido sus testimonios y se haya tejido una red profunda de conocimiento mutuo.",
        "extracto": "Una dinámica cooperativa y de confianza en forma de tablero de nido donde los scouts crean casillas de honestidad y comparten recuerdos personales.",
        "areas": ["afectividad", "sociabilidad"],
        "unidades": ["manada"],
        "objetivos_generales": ["Conocer a los demás", "Fomentar las relaciones interpersonales", "Estimular la confianza"],
        "justificacion_areas": "Esta dinámica favorece la Afectividad al posibilitar un espacio de expresión honesta de emociones, recuerdos y vivencias en un clima grupal seguro, reforzando la autoestima. Estimula la Sociabilidad mediante la interacción respetuosa entre lobatos y lobeznas, la escucha atenta de las historias de los demás y el fomento de la cohesión familiar en la Manada.",
        "eval_templates": [
            (1, 4, "Infancia Media", "**Escuchando** con respeto y cariño las historias personales que mis compañeros de Manada comparten al caer en las casillas del nido, cuidando de no burlarme de sus sentimientos."),
            (1, 4, "Infancia Tard", "**Expresando** mis propios sentimientos al caer en las casillas temáticas del tablero, contándole al grupo en mi turno qué cosas me hacen sentir alegre y cuáles triste."),
            (1, 5, "Infancia Media", "**Respetando** el turno de lanzamiento de dados de mis compañeros y siguiendo las normas para escribir y responder a las misiones del tablero del nido."),
            (1, 5, "Infancia Tard", "**Acatando** las pautas de silencio y atención mientras mis compañeros relatan sus vivencias personales, comprendiendo la importancia de cuidar el ambiente de la dinámica.")
        ]
    },
    {
        "original_title": "Son vampiros.",
        "titulo_reescrito": "Vampiros en el Campamento",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "45 min",
        "cantidad": "10-30",
        "base_image": "juegos_nocturno_base.jpg",
        "lugares": ["campo abierto", "bosque", "campamento"],
        "materiales": ["Tarjetas o papeles con los nombres de los jugadores en dos colores", "Un papelógrafo continuo que representa el cementerio", "Plumas o marcadores"],
        "variaciones": "Se puede jugar durante varios días en el campamento de forma paralela a las actividades normales, o restringirlo a una hora nocturna en el bosque delimitado.",
        "recomendaciones": "Establecer límites espaciales estrictos para el bosque y prohibir correr a oscuras en terrenos pedregosos. La mordida en el cuello debe ser una simple palmada o susurro respetuoso.",
        "descripcion_reescrita": "Esta es una dinámica de sigilo e intriga que se desarrolla idealmente durante un campamento. Se dibuja en un gran papelógrafo un 'cementerio' con tantas tumbas como participantes jueguen. A cada jugador se le entrega una tarjeta secreta que tiene escrito su nombre por un lado y el nombre de otro participante (su 'víctima') por el reverso en un color diferente. El objetivo de cada participante es convertirse en un vampiro y 'matar' a su víctima susurrándole al oído o dándole un toque suave en el cuello.\n\nLa regla fundamental es que el asesinato solo puede ser ejecutado en absoluta ausencia de testigos oculares; si otro participante ve el toque, el intento queda anulado. Cuando un scout es asesinado, debe ir en silencio a registrar su nombre en el cementerio del papelógrafo y entregarle sus tarjetas al asesino, quien ahora adopta la víctima de la persona eliminada. Si dos personas tienen la misión de matarse mutuamente, se produce un duelo y ambas perecen si intentan morderse al mismo tiempo. El juego continúa hasta que solo quedan dos vampiros frente a frente, quienes eventualmente deberán saldar el duelo final.",
        "extracto": "Un emocionante juego de intriga, sigilo y acecho nocturno en campamento donde los scouts deben eliminar a sus víctimas en secreto sin ser vistos.",
        "areas": ["corporalidad", "sociabilidad"],
        "unidades": ["tropa", "compañía", "avanzada", "clan"],
        "objetivos_generales": ["Estimular la observación", "Estimular la atención a los detalles", "Estrategia y planificación"],
        "justificacion_areas": "Fomenta la Corporalidad al desarrollar el acecho silencioso, el sigilo y la velocidad de desplazamiento táctico en la naturaleza. Estimula la Sociabilidad al exigir que los scouts se organicen mentalmente para rastrear a otros y cumplan rigurosamente con las reglas éticas de no mentir sobre los avistamientos de testigos.",
        "eval_templates": [
            (3, 1, "11 a 13 a", "**Acatando** la regla del asesinato sin testigos, admitiendo honestamente cuando he sido descubierto por un compañero al intentar acechar a mi víctima."),
            (3, 1, "13 a 15 a", "**Esforzándome** por desplazarme con sigilo y agilidad por el bosque, controlando mis movimientos físicos para no hacer ruido ni alertar a otros patrulleros."),
            (2, 1, "11 a 13 a", "**Respetando** las reglas éticas del juego y las decisiones del árbitro al reportar con honestidad mis avistamientos en el cementerio de campamento."),
            (2, 1, "13 a 15 a", "**Desplegando** mis habilidades de acecho y velocidad para aproximarme sigilosamente a mi objetivo sin ser detectada por otras patrullas."),
            (4, 1, "15 a 17 a", "**Desarrollando** estrategias físicas de desplazamiento silencioso y control corporal al moverme entre las sombras en las actividades del campamento."),
            (5, 1, "17 a 20 a", "**Asumiendo** con plena responsabilidad física las exigencias del acecho nocturno, controlando mi respiración y movimientos para no delatar mi posición.")
        ]
    },
    {
        "original_title": "Ese manual.",
        "titulo_reescrito": "Cualidades al Vuelo",
        "tipo": "Actividad",
        "subtipo": "juego",
        "duracion": "20 min",
        "cantidad": "8-20",
        "base_image": "juegos_circulo_base.jpg",
        "lugares": ["campo abierto", "patio"],
        "materiales": ["Una pelota blanda y delgada"],
        "variaciones": "Se puede jugar usando dos pelotas al mismo tiempo para aumentar la dificultad y la necesidad de atención múltiple, o requiriendo nombrar dos cualidades en lugar de una.",
        "recomendaciones": "Asegurar que el lanzamiento de la pelota para tocar a los compañeros sea suave y por debajo de los hombros para evitar golpes dolorosos.",
        "descripcion_reescrita": "Los scouts se dispersan en un campo amplio y delimitado, mientras un participante inicia en el centro sosteniendo una pelota blanda. El jugador del centro lanza la pelota con fuerza verticalmente hacia arriba mientras grita en voz alta el nombre de uno de sus compañeros del círculo. En ese instante, todos los demás participantes corren a alejarse del centro tan rápido como puedan, buscando refugiarse en los extremos del campo.\n\nEl participante que fue nombrado debe correr rápidamente hacia el centro para atrapar la pelota. En el momento exacto en que logra tomarla con sus manos, debe gritar con voz firme una cualidad positiva o fortaleza del compañero que lanzó la pelota (por ejemplo: '¡Juan es muy alegre!' o '¡Sofía es muy solidaria!'). Al escuchar la cualidad, todos los scouts que huían deben congelarse en su sitio como estatuas. El jugador con la pelota en el centro tiene permitido dar hasta tres pasos y lanzar la pelota suavemente para intentar tocar a uno de los compañeros congelados. Si lo toca, ese scout pierde una vida y se reinicia el juego; si falla, el propio lanzador pierde una vida y comienza de nuevo. Es una excelente dinámica de aprecio mutuo y velocidad.",
        "extracto": "Una activa dinámica de movimiento y aprecio donde los scouts deben congelarse al oír su nombre y recibir una cualidad positiva de sus compañeros.",
        "areas": ["afectividad", "sociabilidad"],
        "unidades": ["manada", "tropa", "compañía"],
        "objetivos_generales": ["Conocer a los demás", "Fomentar un entorno de confianza", "Estimular la agilidad"],
        "justificacion_areas": "Esta dinámica estimula la Afectividad al requerir que los scouts piensen y verbalicen activamente cualidades positivas de sus compañeros bajo presión de tiempo, reforzando la autoestima y la confianza mutua. Desarrolla la Sociabilidad al exigir atención y respeto ante las características expresadas y el cumplimiento de las reglas físicas del congelamiento.",
        "eval_templates": [
            (1, 4, "Infancia Media", "**Gritando** con cariño y entusiasmo una cualidad positiva de mi compañero al atrapar la pelota en el centro, reconociendo sus fortalezas de forma lúdica."),
            (1, 4, "Infancia Tard", "**Expresando** mis sentimientos en el círculo de evaluación final, compartiendo cómo me sentí alegre al escuchar las cualidades positivas que mis compañeros me gritaron."),
            
            (3, 4, "11 a 13 a", "**Abriéndome** con confianza para contarle a mi compañero de patrulla los temas que me confunden o me ponen triste durante nuestra entrevista."), # Template fallback matching
            (3, 4, "13 a 15 a", "**Expresando** mis sentimientos de aprecio al gritar una fortaleza de mi compañero de juego al congelarse en el campo de juego."),
            
            (2, 4, "11 a 13 a", "**Comunicando** mi aprecio y valorando las cualidades de mis compañeros de juego en voz alta al tomar la pelota."),
            (2, 4, "13 a 15 a", "**Reconociendo** el valor de las fortalezas afectivas de mis pares y asumiendo con alegría las devoluciones del grupo al ser congelada en el campo.")
        ]
    },
    {
        "original_title": "Un oso",
        "titulo_reescrito": "Acecho del Oso",
        "tipo": "Actividad",
        "subtipo": "juego nocturno",
        "duracion": "45 min",
        "cantidad": "10-25",
        "base_image": "juegos_nocturno_base.jpg",
        "lugares": ["campo abierto", "bosque", "campamento"],
        "materiales": ["Silbatos para los dirigentes", "Papeles o cartulinas con la palabra 'OSOS' escrita", "Linternas para los guardianes"],
        "variaciones": "Se puede añadir un 'prisionero' (un dirigente o scout) atado a un árbol que el equipo debe rescatar y desatar en silencio en un límite de tiempo sin ser iluminados por las linternas de los guardianes.",
        "recomendaciones": "Delimitar perfectamente el área de bosque segura para el juego nocturno. Todos los scouts deben llevar silbato de emergencia propio y calzado adecuado para terreno rústico.",
        "descripcion_reescrita": "Este es un emocionante juego de acecho táctico nocturno que se realiza en un área boscosa delimitada del campamento. Varios dirigentes y guiadoras se esconden en diferentes puntos del bosque antes de comenzar, asumiendo el rol de 'osos salvajes'. Cada oso lleva consigo tarjetas con la palabra 'OSOS' escrita y un silbato. A intervalos regulares (por ejemplo, cada 3 o 5 minutos), los osos ocultos hacen sonar sus silbatos brevemente para dar una pista sonora sobre su ubicación.\n\nLos participantes se organizan en patrullas o pequeños equipos y se adentran en el bosque bajo la oscuridad total. Su objetivo es rastrear y localizar a los osos guiándose únicamente por los sonidos de los silbatos. Para lograrlo, los equipos deben moverse en absoluto silencio, usando el sigilo y el arrastre táctico para evitar ser detectados por los 'guardianes' del bosque, quienes patrullan las zonas intermedias con linternas. Si un guardián ilumina directamente a un scout que se desplaza, este debe retroceder a la base de inicio. El equipo que logre encontrar a un oso y recibir su tarjeta antes de que termine el tiempo gana el desafío, promoviendo la orientación, la audición atenta y el trabajo en equipo nocturno.",
        "extracto": "Una misteriosa aventura nocturna en el bosque donde las patrullas scouts siguen señales sonoras para capturar osos y evitar los haces de luz de las linternas.",
        "areas": ["corporalidad", "carácter"],
        "unidades": ["tropa", "compañía", "avanzada", "clan"],
        "objetivos_generales": ["Perder el miedo a la oscuridad", "Estimular la observación", "Trabajo en equipo"],
        "justificacion_areas": "Fomenta la Corporalidad al obligar a los scouts a desplazarse en la oscuridad, afinando su sentido de la audición y su control psicomotor al gatear o caminar en sigilo. Estimula el Carácter al desafiar el miedo a la oscuridad, fortaleciendo el autocontrol individual y la constancia de grupo para lograr un rescate o localización táctica.",
        "eval_templates": [
            (3, 1, "11 a 13 a", "**Desarrollando** mi agilidad y orientación espacial al desplazarme por el bosque a oscuras guiándome por pistas de silbatos."),
            (3, 1, "13 a 15 a", "**Esforzándome** por controlar mis movimientos físicos y regular mi respiración en el suelo del bosque para evitar ser iluminado por las linternas."),
            (3, 3, "11 a 13 a", "**Enfrentando** mis temores y la incertidumbre de la oscuridad del bosque con una sonrisa, colaborando en silencio con mi patrulla."),
            (3, 3, "13 a 15 a", "**Demostrando** disciplina, constancia y autocontrol corporal al mantener un silencio absoluto durante los 45 minutos de la incursión nocturna."),
            
            (2, 1, "11 a 13 a", "**Caminando** con precaución y adaptando mis movimientos corporales a la irregularidad del suelo en la penumbra del bosque nocturno."),
            (2, 1, "13 a 15 a", "**Esforzándome** por mejorar mi rendimiento físico al realizar acechos prolongados a ras de suelo sin fatigarme."),
            (2, 3, "11 a 13 a", "**Superando** de forma madura el miedo natural a la oscuridad de la noche, confiando en las capacidades colectivas de mi patrulla."),
            (2, 3, "13 a 15 a", "**Cumpliendo** de forma honesta con las normas de no encender luces artificiales ni correr a ciegas, cuidando la integridad de mi equipo."),
            
            (4, 1, "15 a 17 a", "**Afinando** mis sentidos de audición y orientación en terrenos rústicos nocturnos, dosificando mi energía en el acecho."),
            (4, 3, "15 a 17 a", "**Asumiendo** con valentía y madurez los desafíos nocturnos de orientación en el campamento, tomando decisiones rápidas en equipo."),
            
            (5, 1, "17 a 20 a", "**Conviviendo** activamente con la naturaleza rústica y desafiante del bosque por la noche, dominando mis capacidades de orientación física."),
            (5, 3, "17 a 20 a", "**Evaluando** mis límites y demostrando entereza mental al liderar a mis compañeros en el avance silencioso bajo condiciones oscuras.")
        ]
    },
    {
        "original_title": "Acecharse unos a otros.",
        "titulo_reescrito": "Juego de Acechadores",
        "tipo": "Actividad",
        "subtipo": "juego nocturno",
        "duracion": "45 min",
        "cantidad": "10-25",
        "base_image": "juegos_nocturno_base.jpg",
        "lugares": ["campo abierto", "bosque", "campamento"],
        "materiales": ["Libretas de notas", "Lápices para registrar avistamientos", "Vendas para los ojos (opcional)"],
        "variaciones": "Se puede realizar a gran escala en un terreno rural más extenso, asignando claves radiales o consignas que cada patrulla debe descifrar del rival.",
        "recomendaciones": "Definir un punto de encuentro o base central visible en todo momento (con una fogata o luz fija) en caso de que algún participante se desoriente en la noche.",
        "descripcion_reescrita": "Este es un juego táctico nocturno de acecho mutuo entre patrullas que requiere alta concentración y disciplina. Se establecen límites espaciales precisos y una duración fija de 45 minutos. Un equipo o patrulla (los Acechados) sale de la base con una ventaja de 10 a 15 minutos para adentrarse en el bosque y ocultarse de la mejor manera en un área seleccionada de antemano. Llevan consigo libretas para anotar notas tácticas.\n\nUna vez cumplido el tiempo de espera, la segunda patrulla (los Acechadores) sale de la base en busca del primer equipo. Su misión es localizarlos e identificar qué miembros del equipo rival están en cada posición, al mismo tiempo que intentan permanecer ocultos y no ser vistos por los Acechados, quienes vigilan desde sus puestos. Al finalizar el tiempo asignado, ambos equipos regresan a la base para confrontar y comparar sus libretas de notas (ej. quién vio a quién, qué ropa o rasgo se identificó, etc.). Es una excelente dinámica de observación mutua y disciplina de silencio.",
        "extracto": "Una batalla táctica en la penumbra donde dos patrullas scouts se ocultan y rastrean mutuamente en el bosque, anotando detalles del rival en sus libretas.",
        "areas": ["corporalidad", "carácter"],
        "unidades": ["tropa", "compañía", "avanzada", "clan"],
        "objetivos_generales": ["Estimular la observación", "Estrategia y planificación", "Trabajo en equipo"],
        "justificacion_areas": "Fomenta la Corporalidad mediante el dominio del cuerpo en desplazamientos terrestres lentos, gateo y posturas de acecho prolongadas en la naturaleza. Estimula el Carácter al exigir honestidad rigurosa al confrontar los avistamientos y lealtad con las reglas tácticas del juego en equipo.",
        "eval_templates": [
            (3, 1, "11 a 13 a", "**Ejercitando** mi coordinación psicomotora al desplazarme agachado y en silencio absoluto a través del follaje nocturno."),
            (3, 1, "13 a 15 a", "**Dosificando** mi resistencia cardiovascular y manteniendo posturas de acecho prolongadas sobre el suelo del bosque sin moverme."),
            (3, 3, "11 a 13 a", "**Tratando** de ser leal y honesto al confrontar mi libreta de notas al final del juego, reconociendo si fui visto por el rival."),
            (3, 3, "13 a 15 a", "**Asumiendo** con compromiso y lealtad el rol asignado en la patrulla, cuidando que mis movimientos no delaten la ubicación de mis compañeros."),
            
            (2, 1, "11 a 13 a", "**Controlando** la pisada y el equilibrio físico en la penumbra del bosque para evitar crujir ramas que puedan delatar mi posición."),
            (2, 1, "13 a 15 a", "**Esforzándome** por mejorar mis capacidades físicas de sigilo en el arrastre por el suelo, colaborando con las metas de mi patrulla."),
            (2, 3, "11 a 13 a", "**Escuchando** los consejos y estrategias de mi patrulla para distribuirnos en el bosque de forma segura e inteligente."),
            (2, 3, "13 a 15 a", "**Cumpliendo** de forma honesta con las reglas de avistamiento y asumiendo con madurez y deportividad los resultados del juego."),
            
            (4, 1, "15 a 17 a", "**Afinando** mis sentidos de audición y orientación en terrenos rústicos nocturnos, dosificando mi energía en el acecho prolongado."),
            (4, 3, "15 a 17 a", "**Asumiendo** con valentía y madurez los desafíos nocturnos de orientación en el campamento, tomando decisiones rápidas en equipo."),
            
            (5, 1, "17 a 20 a", "**Conviviendo** activamente con la naturaleza rústica y desafiante del bosque por la noche, dominando mis capacidades de orientación física."),
            (5, 3, "17 a 20 a", "**Evaluando** mis límites y demostrando entereza mental al liderar a mis compañeros en el avance silencioso bajo condiciones oscuras.")
        ]
    }
]

# Process and resolve objectives for a batch
def process_batch(batch_in, batch_out_path):
    output_data = []
    for game in batch_in:
        resolved_objs = []
        for (u_id, a_id, age_prefix, csc_template) in game["eval_templates"]:
            obj_id, obj_text, u_name, a_name = get_obj(u_id, a_id, age_prefix)
            resolved_objs.append({
                "id": obj_id,
                "area": a_name,
                "texto": obj_text,
                "unidad": u_name,
                "como_se_cumple": csc_template
            })
            
        # Compile clean areas and units list in lowercase
        areas_set = sorted(list(set([o["area"].lower() for o in resolved_objs])))
        unidades_set = sorted(list(set([o["unidad"].lower() for o in resolved_objs])))
        
        # Build clean activity object
        game_out = {
            "original_title": game["original_title"],
            "titulo_reescrito": game["titulo_reescrito"],
            "tipo": game["tipo"],
            "subtipo": game["subtipo"],
            "duracion": game["duracion"],
            "cantidad": game["cantidad"],
            "base_image": game["base_image"],
            "lugares": game["lugares"],
            "materiales": game["materiales"],
            "variaciones": game["variaciones"],
            "recomendaciones": game["recomendaciones"],
            "descripcion_reescrita": game["descripcion_reescrita"],
            "extracto": game["extracto"],
            "areas": areas_set,
            "unidades": unidades_set,
            "objetivos_generales": game["objetivos_generales"],
            "justificacion_areas": game["justificacion_areas"],
            "objetivos_educativos": resolved_objs
        }
        output_data.append(game_out)
        
    with open(batch_out_path, "w", encoding="utf-8") as f_out:
        json.dump(output_data, f_out, indent=2, ensure_ascii=False)
    print(f"Generated {batch_out_path} with {len(output_data)} activities.")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("Processing Batch 0...")
    batch_0_path = os.path.join(OUTPUT_DIR, "batch_output_0.json")
    process_batch(batch_0_data, batch_0_path)
    
    print("\nProcessing Batch 2...")
    batch_2_path = os.path.join(OUTPUT_DIR, "batch_output_2.json")
    process_batch(batch_2_data, batch_2_path)
    
    print("\n[OK] Both Batch 0 and Batch 2 processed successfully!")

if __name__ == "__main__":
    main()
