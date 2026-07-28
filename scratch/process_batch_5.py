import json

# Cargar los objetivos reales para buscar dinámicamente y evitar IDs incorrectos
with open("C:/Users/claud/Documents/PWA/NuaMana/supabase/scripts/progresion_objetivos_clean.json", "r", encoding="utf-8") as f:
    objetivos_db = json.load(f)

def buscar_objetivo(unidad, area, rango, fragmento_texto):
    for o in objetivos_db:
        if o["unidad_nombre"].lower() == unidad.lower() and o["area_nombre"].lower() == area.lower():
            if o["rango_edad"].lower() == rango.lower():
                texto = o["texto_infantil"] or o["texto_terminal"]
                if fragmento_texto.lower() in texto.lower():
                    return o
    # Si no lo encuentra, buscar más flexiblemente
    for o in objetivos_db:
        if o["unidad_nombre"].lower() == unidad.lower() and o["area_nombre"].lower() == area.lower():
            texto = o["texto_infantil"] or o["texto_terminal"]
            if fragmento_texto.lower() in texto.lower():
                return o
    raise ValueError(f"No se encontró objetivo para {unidad} - {area} - {rango} con fragmento '{fragmento_texto}'")

# Definir la estructura de las actividades
actividades = []

# --- JUEGO 1 ---
j1 = {
    "original_title": "Fútbol Scout",
    "titulo_reescrito": "Fútbol con Obstáculos",
    "tipo": "Actividad",
    "subtipo": "juego",
    "duracion": "30 min",
    "cantidad": "12-24",
    "base_image": "juegos_carrera_base.jpg",
    "lugares": ["campo abierto", "patio"],
    "materiales": [
        "Globos de colores",
        "1 pelota atrapable",
        "Porterías pequeñas o conos",
        "Inflador de globos",
        "Camisetas o petos identificatorios"
    ],
    "variaciones": "Se puede jugar limitando la cantidad de pases entre jugadores antes de tirar a gol, o jugar en parejas tomadas de la mano para aumentar la dificultad y la necesidad de coordinación.",
    "recomendaciones": "Tener cuidado de no empujar o golpear a los rivales al intentar explotar los globos. Utilizar un terreno plano y libre de objetos punzantes que puedan causar caídas o accidentes.",
    "descripcion_reescrita": "Esta dinámica fusiona la agilidad del balonmano y del fútbol en un entorno caótico y divertido. Los jugadores se dividen en dos equipos y cada miembro debe colocarse un globo inflado bajo su camiseta, el cual representa sus 'vidas'. El objetivo es anotar goles en la portería contraria utilizando las manos o los pies según las reglas previamente establecidas por el equipo de guiadoras o dirigentes. Sin embargo, para mantener el balón en movimiento, los pases deben ser constantes y dinámicos, evitando que el rival se acerque.\n\nLa gran particularidad de este juego es la mecánica de eliminación de vidas: cualquier jugador que lleve el balón puede ser despojado de su 'vida' si un adversario logra explotar el globo que lleva bajo la camiseta mediante una palmada rápida, sin agresiones físicas. El portero tiene la potestad única de quitar vidas a cualquier oponente que ingrese a su área restringida. Si un globo se revienta, el scout afectado debe correr a la zona de reabastecimiento para inflar y colocarse un nuevo globo, permitiéndose esto hasta un máximo de tres veces. Además, cuando un equipo anota o comete falta, el equipo líder realiza una pregunta técnica sobre conocimientos scouts (nudos, primeros auxilios, historia); si la respuesta es incorrecta, el beneficio o el punto se otorga al bando contrario, asegurando un aprendizaje activo.",
    "extracto": "Una emocionante fusión de fútbol y balonmano donde cada jugador protege su 'vida' representada por un globo bajo la camiseta mientras responde preguntas scouts.",
    "areas": ["corporalidad", "creatividad", "sociabilidad"],
    "unidades": ["manada", "tropa", "compañía"],
    "objetivos_generales": [
        "Trabajo en equipo",
        "Refuerzo de habilidades técnicas",
        "Estimular la agilidad mental"
    ],
    "justificacion_areas": "El juego fomenta la Corporalidad mediante el ejercicio físico aeróbico continuo, la velocidad de reacción y la esquiva. La Creatividad se estimula a través de la toma de decisiones rápidas sobre cómo mover el balón y proteger el globo, además de la resolución de preguntas de conocimiento scout. Por último, la Sociabilidad se ve reforzada por la coordinación grupal necesaria para expresar estrategias defensivas y ofensivas, asumiendo roles claros dentro del campo de juego.",
    "objetivos_educativos_config": [
        # Manada
        {"unidad": "Manada", "area": "Corporalidad", "rango": "Infancia Media", "fragmento": "fuerte, ágil, veloz", "como": "**Participando** activamente en los partidos de fútbol con obstáculos, esforzándome por correr con agilidad y esquivar a mis compañeros de Manada para cuidar mi globo."},
        {"unidad": "Manada", "area": "Corporalidad", "rango": "Infancia Tardía", "fragmento": "brazos, piernas, manos", "como": "**Coordinando** mis movimientos al conducir y lanzar la pelota con precisión mientras controlo la posición de mis pies para no tropezar."},
        # Tropa
        {"unidad": "Tropa", "area": "Corporalidad", "rango": "11 a 13 años", "fragmento": "diferentes juegos y respeto sus reglas", "como": "**Comprendiendo** y aplicando la dinámica del balonmano modificado y acatando de buena gana cada cobro reglamentario de mis dirigentes."},
        {"unidad": "Tropa", "area": "Corporalidad", "rango": "13 a 15 años", "fragmento": "rendimiento en el deporte", "como": "**Entrenando** y aplicando mis destrezas físicas para esquivar a los rivales y aceptando con deportividad el resultado de la competencia encubierta."},
        # Compañía
        {"unidad": "Compañía", "area": "Corporalidad", "rango": "11 a 13 años", "fragmento": "diferentes juegos y respeto sus reglas", "como": "**Respetando** de manera estricta las reglas del balonmano con globos y las decisiones arbitrales de mis dirigentes para mantener un juego limpio."},
        {"unidad": "Compañía", "area": "Corporalidad", "rango": "13 a 15 años", "fragmento": "rendimiento en el deporte", "como": "**Esforzándome** al máximo en cada jugada para colaborar con mi patrulla y aceptando con madurez el resultado del partido, sin importar si ganamos o perdemos."}
    ]
}

# --- JUEGO 2 ---
j2 = {
    "original_title": "Dibujo en equipo.",
    "titulo_reescrito": "Dibujo en Relevos",
    "tipo": "Actividad",
    "subtipo": "juego",
    "duracion": "25 min",
    "cantidad": "6-24",
    "base_image": "juegos_cooperativo_base.jpg",
    "lugares": ["sala", "campo abierto", "patio"],
    "materiales": [
        "Papelógrafos o cartulinas grandes",
        "Plumones de varios colores",
        "Cinta de papel para colgar el papel",
        "Cronómetro"
    ],
    "variaciones": "Se puede cambiar el tema del dibujo a conceptos abstractos o técnicos del escultismo (como la Ley Scout o una especialidad), o hacer que los participantes dibujen con la mano no dominante.",
    "recomendaciones": "Asegurarse de que el trayecto de carrera esté libre de obstáculos. Si se juega en interiores, cuidar que el piso no esté resbaladizo para evitar caídas al correr.",
    "descripcion_reescrita": "Este dinámico juego de relevos combina la expresión artística con la velocidad y la coordinación grupal. Los participantes se dividen en equipos de no más de seis integrantes y se alinean en filas paralelas detrás de una línea de salida común. A una distancia de 7 a 10 metros al frente de cada fila, se coloca y fija un pliego grande de papel sobre una pared o mesa. El primer scout de cada fila sostiene un marcador de color y espera ansiosamente la señal del director del juego.\n\nCuando se da la señal de inicio y se anuncia el tema del dibujo (por ejemplo, 'la ciudad' o 'el campamento de nuestros sueños'), el primer corredor corre a toda velocidad hacia el papel, realiza trazos correspondientes al tema durante exactamente diez segundos y, tras el aviso del líder, regresa corriendo para entregar el marcador al siguiente compañero. La dinámica se repite sucesivamente con cada miembro del equipo, quienes deben interpretar y continuar el dibujo iniciado por sus predecesores sin hablar entre sí. Al terminar el tiempo total de juego, el líder reúne a todos para apreciar las obras maestras y otorgar puntos al dibujo que mejor plasme la idea original con creatividad y cohesión de equipo.",
    "extracto": "Un veloz relevo artístico donde cada miembro del equipo tiene pocos segundos para cooperar en la creación de un dibujo temático conjunto.",
    "areas": ["creatividad", "sociabilidad", "corporalidad"],
    "unidades": ["manada", "tropa", "compañía"],
    "objetivos_generales": [
        "Trabajo en equipo",
        "Estimular la creatividad",
        "Estimular la coordinación"
    ],
    "justificacion_areas": "Este juego estimula la Creatividad mediante la expresión gráfica rápida y la necesidad de interpretar y continuar de manera innovadora la idea de un compañero sin comunicación verbal. La Sociabilidad se fomenta a través del trabajo cooperativo y el respeto por el aporte individual al logro colectivo de la patrulla o seisena. La Corporalidad se ejercita mediante las carreras de velocidad corta y la motricidad fina requerida para dibujar con rapidez bajo presión temporal.",
    "objetivos_educativos_config": [
        # Manada
        {"unidad": "Manada", "area": "Creatividad", "rango": "Infancia Media", "fragmento": "dibujar y pintar", "como": "**Dibujando** con entusiasmo y precisión durante mis diez segundos de relevo para aportar elementos significativos al dibujo grupal."},
        {"unidad": "Manada", "area": "Creatividad", "rango": "Infancia Tardía", "fragmento": "mejores con mis manos", "como": "**Mejorando** mi trazo y precisión manual al plasmar el objeto solicitado en el papelógrafo con agilidad."},
        # Tropa
        {"unidad": "Tropa", "area": "Creatividad", "rango": "11 a 13 años", "fragmento": "temas que discutimos", "como": "**Aportando** ideas visuales rápidas y coordinando de manera silenciosa mi dibujo con los trazos anteriores de mis compañeros."},
        {"unidad": "Tropa", "area": "Creatividad", "rango": "13 a 15 años", "fragmento": "distintos puntos de vista", "como": "**Interpretando** creativamente los dibujos que mis compañeros de patrulla han iniciado, adaptando mi propio trazo para mantener la coherencia del diseño."},
        # Compañía
        {"unidad": "Compañía", "area": "Creatividad", "rango": "11 a 13 años", "fragmento": "temas que discutimos", "como": "**Esforzándome** por plasmar de forma gráfica y rápida las ideas acordadas para el dibujo de mi patrulla en la carrera de relevos."},
        {"unidad": "Compañía", "area": "Creatividad", "rango": "13 a 15 años", "fragmento": "distintos puntos de vista", "como": "**Analizando** en segundos la composición artística del papelógrafo para complementar con mi marcador los detalles faltantes de forma coherente."}
    ]
}

# --- JUEGO 3 ---
j3 = {
    "original_title": "Cuatro esquinas.",
    "titulo_reescrito": "Esquinas Cruzadas",
    "tipo": "Actividad",
    "subtipo": "juego",
    "duracion": "20 min",
    "cantidad": "10-25",
    "base_image": "juegos_carrera_base.jpg",
    "lugares": ["campo abierto", "patio"],
    "materiales": [
        "4 pañoletas scouts para marcar las esquinas",
        "1 pelota de esponja o goma blanda",
        "Conos o estacas para delimitar el cuadrado"
    ],
    "variaciones": "Se puede agrandar el tamaño del cuadrado para requerir lanzamientos más largos y carreras más extensas, o agregar una segunda pelota para aumentar la complejidad defensiva del Equipo A.",
    "recomendaciones": "La pelota utilizada debe ser blanda (tipo de esponja o goma blanda) para evitar lesiones o golpes dolorosos. Los jugadores deben evitar barridas peligrosas al intentar llegar a las bases.",
    "descripcion_reescrita": "Esta actividad de alta intensidad física enfrenta a dos equipos dentro de un cuadrado de 15 metros de lado, delimitado en sus esquinas por cuatro pañoletas scouts. El Equipo A se organiza en una fila ordenada fuera del cuadrado y en posición perpendicular a uno de sus lados, mientras que el Equipo B se distribuye libremente por todo el espacio de juego y sus alrededores. El primer jugador en la fila del Equipo B sostiene el balón en sus manos y es el encargado de iniciar la ronda de juego.\n\nEl juego comienza cuando el jugador del Equipo B lanza el balón lo más lejos y fuerte posible dentro del campo. Inmediatamente, este jugador corre a toda velocidad para pasar secuencialmente por las cuatro esquinas marcadas con las pañoletas. Al mismo tiempo, los integrantes del Equipo A deben correr a capturar la pelota y, sin dar pasos mientras la sostienen (pudiendo solo pasársela entre ellos), intentar golpear (quemar) al corredor del Equipo B antes de que logre completar el circuito de las esquinas. Cuando todos los miembros del Equipo B han tenido su turno de correr, los equipos intercambian roles. El equipo que logre que más corredores completen el circuito exitosamente se corona ganador.",
    "extracto": "Un juego de carrera y puntería donde un corredor intenta completar un circuito de esquinas antes de ser alcanzado por la pelota del equipo rival.",
    "areas": ["corporalidad", "sociabilidad", "carácter"],
    "unidades": ["manada", "tropa", "compañía"],
    "objetivos_generales": [
        "Estimular la agilidad",
        "Trabajo en equipo",
        "Estrategia y planificación"
    ],
    "justificacion_areas": "La Corporalidad se ve intensamente estimulada a través de la velocidad explosiva del corredor y la coordinación óculo-manual de los defensores para lanzar y atrapar el balón. La Sociabilidad se trabaja mediante la estrecha cooperación táctica que los defensores necesitan para pasarse el balón con rapidez sin moverse. El Carácter se desarrolla mediante la toma de decisiones rápidas bajo presión y la superación de las propias limitantes físicas en carrera.",
    "objetivos_educativos_config": [
        # Manada
        {"unidad": "Manada", "area": "Corporalidad", "rango": "Infancia Media", "fragmento": "fuerte, ágil, veloz", "como": "**Corriendo** a máxima velocidad para recorrer las cuatro esquinas marcadas con pañoletas antes de ser tocado por el balón del equipo contrario."},
        {"unidad": "Manada", "area": "Corporalidad", "rango": "Infancia Tardía", "fragmento": "brazos, piernas, manos", "como": "**Lanzando** y atrapando la pelota con precisión para colaborar con mi equipo y quemar al corredor oponente a tiempo."},
        # Tropa
        {"unidad": "Tropa", "area": "Corporalidad", "rango": "11 a 13 años", "fragmento": "diferentes juegos y respeto sus reglas", "como": "**Acatando** las limitaciones del juego, como no caminar con el balón en las manos, demostrando honestidad en cada fase."},
        {"unidad": "Tropa", "area": "Corporalidad", "rango": "13 a 15 años", "fragmento": "rendimiento en el deporte", "como": "**Esforzándome** por mejorar mi velocidad de carrera y mi puntería al lanzar el balón, aceptando con deportividad el resultado final."},
        # Compañía
        {"unidad": "Compañía", "area": "Corporalidad", "rango": "11 a 13 años", "fragmento": "diferentes juegos y respeto sus reglas", "como": "**Respetando** la regla de inmovilidad mientras sostengo el balón en mis manos, pasándolo rápidamente a mis compañeras de equipo."},
        {"unidad": "Compañía", "area": "Corporalidad", "rango": "13 a 15 años", "fragmento": "rendimiento en el deporte", "como": "**Optimizando** mi capacidad de reacción y velocidad de desplazamiento en las bases para conseguir el punto para mi patrulla."}
    ]
}

# --- JUEGO 4 ---
j4 = {
    "original_title": "Una carrera de 100 pies al revés",
    "titulo_reescrito": "Carrera de Ciempiés Invertida",
    "tipo": "Actividad",
    "subtipo": "juego",
    "duracion": "15 min",
    "cantidad": "8-30",
    "base_image": "juegos_carrera_base.jpg",
    "lugares": ["campo abierto", "patio", "sala"],
    "materiales": [
        "Línea de salida y meta marcadas con tiza o cinta",
        "Silbato"
    ],
    "variaciones": "Para ramas mayores se puede realizar en terrenos con pendientes leves para exigir mayor fuerza y control de estabilidad, o jugar con los ojos vendados del primer y último miembro.",
    "recomendaciones": "Jugar preferentemente sobre césped o superficies suaves para evitar raspaduras en la espalda al acostarse. Los jugadores deben caminar con las piernas lo suficientemente abiertas para no pisar de manera accidental a sus compañeros en el suelo.",
    "descripcion_reescrita": "Esta dinámica cooperativa pone a prueba la coordinación, la flexibilidad y la confianza mutua de los equipos. Los participantes se dividen en grupos de entre dos y seis personas, alineándose de espaldas a la línea de salida. Todos los miembros de cada equipo se toman firmemente de las manos por debajo de sus piernas, adoptando una formación similar al clásico juego del elefante, lo que crea una hilera compacta y unida.\n\nA la señal del silbato del dirigente, el último miembro de la fila (que ahora lidera el retroceso) se acuesta lentamente de espaldas en el suelo sin soltar la mano de su compañero de adelante. Toda la fila comienza a caminar hacia atrás pasando con las piernas abiertas por encima de él, con sumo cuidado para no pisarlo. A medida que avanzan, cada miembro se va acostando progresivamente en el suelo cuando el compañero anterior ha pasado sobre él. Una vez que toda la hilera se encuentra acostada en cadena, los jugadores se ponen de pie rápidamente manteniendo el orden y repiten el ciclo de manera fluida. El juego finaliza y se determina el ganador cuando todos los integrantes de un ciempiés cruzan completamente la línea de meta y giran para quedar de frente.",
    "extracto": "Un desafiante juego de carrera cooperativa donde los equipos avanzan acostándose en cadena y pasando unos sobre otros de espaldas.",
    "areas": ["corporalidad", "sociabilidad", "afectividad"],
    "unidades": ["tropa", "compañía", "avanzada", "clan"],
    "objetivos_generales": [
        "Desarrollar la motricidad",
        "Trabajo en equipo",
        "Estimular la confianza"
    ],
    "justificacion_areas": "La Corporalidad se fomenta a través de la flexibilidad, la fuerza abdominal y la motricidad gruesa al acostarse y levantarse de espaldas coordinadamente. La Sociabilidad se estimula mediante la comunicación física constante y el trabajo sincronizado que exige la carrera. La Afectividad se potencia al construir un ambiente seguro de confianza física, donde los integrantes dependen del cuidado de sus compañeros para no ser pisados durante el ejercicio.",
    "objetivos_educativos_config": [
        # Tropa
        {"unidad": "Tropa", "area": "Corporalidad", "rango": "11 a 13 años", "fragmento": "diferentes juegos y respeto sus reglas", "como": "**Cuidando** de mantener mis manos sujetas al compañero y acatando la norma de no avanzar si la cadena se rompe."},
        {"unidad": "Tropa", "area": "Corporalidad", "rango": "13 a 15 años", "fragmento": "rendimiento en el deporte", "como": "**Esforzándome** por levantarme rápidamente del suelo con fuerza abdominal para agilizar el avance de toda mi patrulla."},
        # Compañía
        {"unidad": "Compañía", "area": "Corporalidad", "rango": "11 a 13 años", "fragmento": "diferentes juegos y respeto sus reglas", "como": "**Manteniendo** mis piernas abiertas al avanzar de espaldas sobre mis compañeras acostadas, respetando las dinámicas de seguridad física."},
        {"unidad": "Compañía", "area": "Corporalidad", "rango": "13 a 15 años", "fragmento": "rendimiento en el deporte", "como": "**Apoyando** físicamente a mis compañeras durante la carrera y asumiendo con alegría el esfuerzo muscular que el ciempiés requiere."},
        # Avanzada
        {"unidad": "Avanzada", "area": "Corporalidad", "rango": "15 a 17 años", "fragmento": "buen estado físico", "como": "**Utilizando** mi flexibilidad y fuerza física para acostarme de espaldas y levantarme de manera fluida y coordinada sin entorpecer el paso de mi equipo."},
        {"unidad": "Avanzada", "area": "Corporalidad", "rango": "15 a 17 años", "fragmento": "organización de juegos y actividades recreativas", "como": "**Guiando** a mis compañeros de equipo para sincronizar el momento de acostarse y levantarse, optimizando la táctica de avance."},
        # Clan
        {"unidad": "Clan", "area": "Corporalidad", "rango": "17 a 20 años", "fragmento": "actividades deportivas y recreativas", "como": "**Participando** con entusiasmo en esta demandante actividad recreativa grupal, integrando mi esfuerzo corporal al de mi equipo scout."},
        {"unidad": "Clan", "area": "Corporalidad", "rango": "17 a 20 años", "fragmento": "responsabilidad que me corresponde en el desarrollo armónico", "como": "**Asumiendo** con seriedad mi rol físico dentro de la cadena del ciempiés, protegiendo mi integridad corporal y la de mis compañeros mediante movimientos controlados."}
    ]
}

# --- JUEGO 5 ---
j5 = {
    "original_title": "Los Magos de Teis.",
    "titulo_reescrito": "El Reto de los Magos",
    "tipo": "Actividad",
    "subtipo": "juego",
    "duracion": "90 min",
    "cantidad": "18-30",
    "base_image": "juegos_mesa_base.jpg",
    "lugares": ["campo abierto", "bosque", "parque"],
    "materiales": [
        "Cartones",
        "Tizas",
        "Tijeras",
        "Retazos de tela",
        "Cuerdas",
        "Cuentas para bisutería (collares y pulseras)",
        "Tarjetas con mensajes cifrados (Morse u otros)",
        "Muestras de plantas aromáticas u objetos táctiles para la prueba sensorial"
    ],
    "variaciones": "Se puede adaptar la historia fantástica a la mitología local de la región, y las pruebas se pueden enfocar más en técnicas de cabuyería (nudos) o supervivencia según las necesidades educativas del momento.",
    "recomendaciones": "Delimitar claramente el área forestal o de juego para evitar que los participantes se extravíen. Asegurar la supervisión de adultos en cada puesto o estación de los hechiceros.",
    "descripcion_reescrita": "Este es un juego de rol y estaciones a gran escala que sumerge a los jóvenes en la mística de la tribu de THEIS. Los participantes se dividen en tres roles activos: los Hechiceros de la TUAK (diseñadores de las pruebas mágicas), los Consejeros de THEIS (guardianes de la sabiduría que otorgan pistas y vigilan las leyes) y los AVENTIS (los equipos de aventureros que deben cumplir los retos para liberar a los prisioneros del pueblo). El juego se ambienta en la desobediencia histórica de las leyes de la tribu que llevó al encarcelamiento de varios miembros, y cuya única salvación es devolver la cordura a los hechiceros superando desafíos que desafían su intelecto y sus sentidos.\n\nEl desarrollo de la actividad requiere de un amplio espacio abierto con vegetación donde los hechiceros instalan sus puestos. Las pruebas duran un mínimo de 15 minutos cada una, comenzando con una reunión informativa entre los Hechiceros y los Consejeros para acordar los criterios de evaluación. Los AVENTIS deben viajar entre estaciones resolviendo retos que incluyen: reescribir la leyenda e himno de resistencia de la tribu, descifrar mensajes en código Morse para ubicar el cetro de la sabiduría y superar desafíos sensoriales reconociendo hierbas mágicas mediante el tacto y el olfato. El juego concluye con éxito cuando los AVENTIS superan todas las pruebas y rescatan a los prisioneros, reforzando la identidad comunitaria.",
    "extracto": "Un inmersivo juego de estaciones donde los aventureros resuelven acertijos, descifran códigos y superan pruebas sensoriales para salvar a su tribu.",
    "areas": ["creatividad", "sociabilidad", "carácter"],
    "unidades": ["tropa", "compañía", "avanzada", "clan"],
    "objetivos_generales": [
        "Estrategia y planificación",
        "Refuerzo de habilidades técnicas",
        "Aprender criptografía"
    ],
    "justificacion_areas": "La Creatividad se estimula profundamente al descifrar códigos criptográficos, inventar historias y resolver acertijos lógicos complejos. La Sociabilidad se fomenta a través de la toma de decisiones democrática en el equipo para abordar los retos y la interacción con los actores del juego (consejeros y hechiceros). El Carácter se fortalece mediante la perseverancia en pruebas extensas y la asunción de responsabilidades individuales y colectivas para lograr la meta grupal.",
    "objetivos_educativos_config": [
        # Tropa
        {"unidad": "Tropa", "area": "Sociabilidad", "rango": "11 a 13 años", "fragmento": "normas de convivencia", "como": "**Respetando** las leyes mágicas y de convivencia de la tribu explicadas por los dirigentes en cada base de juego."},
        {"unidad": "Tropa", "area": "Sociabilidad", "rango": "13 a 15 años", "fragmento": "distintos ambientes", "como": "**Acatando** de manera constructiva y honesta las decisiones y penalizaciones impuestas por los Consejeros durante el juego de estaciones."},
        # Compañía
        {"unidad": "Compañía", "area": "Sociabilidad", "rango": "11 a 13 años", "fragmento": "normas de convivencia", "como": "**Cumpliendo** de buena gana el reglamento de la tribu de THEIS y colaborando para que mi patrulla no cometa infracciones."},
        {"unidad": "Compañía", "area": "Sociabilidad", "rango": "13 a 15 años", "fragmento": "distintos ambientes", "como": "**Aceptando** con madurez las correcciones y sugerencias del Consejo de la tribu al revisar el avance de las pruebas de mi equipo."},
        # Avanzada
        {"unidad": "Avanzada", "area": "Sociabilidad", "rango": "15 a 17 años", "fragmento": "desarrollo de mi libertad", "como": "**Colaborando** activamente en el establecimiento de un orden grupal al interior de mi equipo de AVENTIS para superar cada estación eficientemente y respetando a los demás."},
        {"unidad": "Avanzada", "area": "Sociabilidad", "rango": "15 a 17 años", "fragmento": "normas de los diferentes ambientes", "como": "**Analizando** las instrucciones de los hechiceros en cada puesto para proponer alternativas de resolución creativas que cumplan las reglas."},
        # Clan
        {"unidad": "Clan", "area": "Sociabilidad", "rango": "17 a 20 años", "fragmento": "normas que la sociedad se ha dado", "como": "**Asumiendo** con alto sentido de la responsabilidad las reglas de participación en los roles del juego, evaluando críticamente su impacto en la convivencia comunitaria."},
        {"unidad": "Clan", "area": "Sociabilidad", "rango": "17 a 20 años", "fragmento": "modo solidario", "como": "**Solidarizando** con los scouts prisioneros al esforzarme por resolver los desafíos lógicos y sensoriales para lograr su liberación."}
    ]
}

# Procesar las actividades para inyectar los objetivos educativos completos
for j in [j1, j2, j3, j4, j5]:
    objetivos_completos = []
    for cfg in j["objetivos_educativos_config"]:
        # Buscar el objetivo correspondiente en la DB
        o = buscar_objetivo(cfg["unidad"], cfg["area"], cfg["rango"], cfg["fragmento"])
        # Formatear el objetivo educativo de salida
        obj_out = {
            "id": o["id"],
            "area": o["area_nombre"],
            "texto": o["texto_infantil"] or o["texto_terminal"],
            "unidad": o["unidad_nombre"],
            "como_se_cumple": cfg["como"]
        }
        objetivos_completos.append(obj_out)
    
    # Crear el objeto final de actividad
    actividad_out = {
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
        "objetivos_educativos": objetivos_completos
    }
    actividades.append(actividad_out)

# Escribir la salida en batch_output_5.json
with open("C:/Users/claud/Documents/PWA/NuaMana/scratch/batch_output_5.json", "w", encoding="utf-8") as f:
    json.dump(actividades, f, indent=2, ensure_ascii=False)

print("Procesamiento completado con éxito. batch_output_5.json generado.")
