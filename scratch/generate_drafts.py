import json
import os
import re

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def slugify(title):
    t = title.lower()
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ñ': 'n', 'ü': 'u'
    }
    for k, v in replacements.items():
        t = t.replace(k, v)
    t = re.sub(r'[^a-z0-9\s]', '', t)
    t = re.sub(r'\s+', '-', t).strip()
    return t

# Cargar objetivos educativos
objectives = load_json("scratch/progresion_objetivos.json")

# Definir la configuración de las 11 actividades nuevas a procesar
activities_config = [
    {
        "titulo_original": "El nido.",
        "titulo_propuesto": "El Nido de los Recuerdos",
        "tipo": "dinámica",
        "duracion": "30 minutos",
        "cantidad": "08 participantes",
        "lugares": ["Interior", "sala"],
        "unidades": ["manada"],
        "areas_desarrollo": ["Afectividad", "Sociabilidad"],
        "materiales": ["Papelógrafo o cartulina grande", "Lápices de colores y témperas", "Un dado", "Fichas improvisadas (piedras, ramas o botones)"],
        "variaciones": "Puede jugarse al aire libre dibujando el nido en la tierra con una rama y usando piedras numeradas. En Tropa, se puede usar para la integración de patrullas nuevas introduciendo temas más profundos de debate.",
        "recomendaciones": "Mantener una atmósfera de confianza y respeto mutuo. Si un participante no desea compartir un aspecto personal muy sensible, permitirle pasar o cambiar de misión sin presión.",
        "descripcion_cruda": "Consiste en crear un recorrido a realizar con un objeto/tarjeta, expresando sentimientos y compartir experiencias. Cada uno buscará un objeto que le sirva de ficha. Colocarás esto en el papel y dibujarás alrededor del nido. El que empieza tira los dados. Si saca 4, sacará cuatro cuadrados de los nidos y colocará su ficha en el cuarto. En este recuadro tienes que poner una misión/prenda (Por ejemplo, contar un sentimiento, un episodio corto del pasado, etc.) que escribirás al lado del recuadro (por ejemplo, un viaje, me gusta,.). La prenda o misión tiene que ser tan general que todo el mundo pueda hablar de ella...",
        # Criterios para seleccionar objetivos educativos
        # {unidad_nombre: {area_nombre: [keyword_rango1, keyword_rango2]}}
        "keywords": {
            "Manada": {
                "Afectividad": ["opinión", "gusto", "alegre", "siento", "expreso", "afecto"],
                "Sociabilidad": ["amigos", "compañero", "comparto", "juego", "grupo"]
            }
        }
    },
    {
        "titulo_original": "Un oso",
        "titulo_propuesto": "La Cacería del Oso Nocturno",
        "tipo": "juego nocturno",
        "duracion": "60 minutos",
        "cantidad": "16 participantes",
        "lugares": ["Exterior", "bosque"],
        "unidades": ["tropa", "compania"],
        "areas_desarrollo": ["Corporalidad", "Creatividad"],
        "materiales": ["Silbatos para los dirigentes ('osos')", "Tarjetas o papeles con la inscripción 'OSO'", "Linternas para seguridad general (apagadas durante el juego)"],
        "variaciones": "Los 'osos' pueden cambiar de escondite constantemente o correr cuando oigan ruidos. Se puede jugar en equipos mixtos o patrullas independientes.",
        "recomendaciones": "Delimitar muy bien la zona de juego para evitar que los jóvenes se pierdan en la oscuridad. Los dirigentes deben llevar linternas y chalecos reflectantes para emergencias.",
        "descripcion_cruda": "En un campamento, se jugará un partido por la noche. Los monitores deben esconderse de vez en cuando y hacer sonar silbatos mientras sostienen papeles con la palabra «OSOS» escrita en ellos. Tras el sonido del silbato, los distintos equipos deben intentar localizarlos. Obtendrán uno de los OSOS del monitor si logran encontrarlo. Los monitores pueden estar fijos o en movimiento. Gana el que consiga más OSOS.",
        "keywords": {
            "Tropa": {
                "Corporalidad": ["físico", "juego", "ejercicio", "naturaleza", "salud"],
                "Creatividad": ["observo", "sentidos", "naturaleza", "técnica", "observación"]
            },
            "Compañía": {
                "Corporalidad": ["físico", "juego", "ejercicio", "naturaleza", "salud"],
                "Creatividad": ["observo", "sentidos", "naturaleza", "técnica", "observación"]
            }
        }
    },
    {
        "titulo_original": "Lo inobservable.",
        "titulo_propuesto": "El Acecho del Inobservable",
        "tipo": "juego nocturno",
        "duracion": "45 minutos",
        "cantidad": "16 participantes",
        "lugares": ["Exterior", "bosque"],
        "unidades": ["tropa", "compania"],
        "areas_desarrollo": ["Creatividad", "Corporalidad"],
        "materiales": ["1 linterna para el Scouter invisible", "2 linternas para los Scouters guardianes", "Tarjetas de 'vida' o cintas para los jugadores", "Objetos ruidosos (tarros, campanas)"],
        "variaciones": "El inobservable puede dejar pistas luminosas intermitentes (como varitas de luz química). Los jugadores pueden organizarse en parejas de acecho.",
        "recomendaciones": "Advertir a los participantes sobre el relieve del terreno (raíces, hoyos) al moverse en la oscuridad sin linternas encendidas. Establecer una zona de base segura iluminada.",
        "descripcion_cruda": "Será uno de los Scouters que es invisible. Al comienzo del juego, caerá en algún lugar. Además de otros artículos únicos, tiene una linterna. Luego, los otros jugadores se dispondrán a encontrar lo invisible con las siguientes instrucciones: Encuentra lo invisible; obsérvelo de cerca y lleve un registro de todo lo que hace... dos Scouters adicionales con linternas que se moverán por el área de juego y alumbrarán...",
        "keywords": {
            "Tropa": {
                "Creatividad": ["observación", "sentidos", "atención", "descubrir"],
                "Corporalidad": ["físico", "agilidad", "resistencia", "naturaleza"]
            },
            "Compañía": {
                "Creatividad": ["observación", "sentidos", "atención", "descubrir"],
                "Corporalidad": ["físico", "agilidad", "resistencia", "naturaleza"]
            }
        }
    },
    {
        "titulo_original": "Matamoscas.",
        "titulo_propuesto": "El Matamoscas en Cadena",
        "tipo": "juego",
        "duracion": "20 minutos",
        "cantidad": "12 participantes",
        "lugares": ["Exterior", "campo delimitado"],
        "unidades": ["manada", "tropa"],
        "areas_desarrollo": ["Corporalidad", "Sociabilidad"],
        "materiales": ["Cinta o tiza para delimitar el campo", "Silbato para el facilitador"],
        "variaciones": "Variante 'Sin Reversa': La cadena se mueve por líneas prefijadas en un sentido y los corredores en el opuesto. En espacios reducidos, se puede jugar caminando en lugar de corriendo.",
        "recomendaciones": "Tener cuidado de no tirar con demasiada fuerza de las manos de los extremos de la cadena para evitar caídas o torceduras. El terreno debe estar libre de obstáculos.",
        "descripcion_cruda": "Toda la unidad se sitúa en un extremo de un área previamente delimitada de 20 por 10 M. El responsable nombra a un participante que se situará en medio del campo. Al silbatazo, los participantes deben correr al otro extremo. Los atrapados se toman de la mano sin soltarse para formar una red que atrapa al resto. El último es el ganador.",
        "keywords": {
            "Manada": {
                "Corporalidad": ["juego", "ejercicio", "movimiento", "reglas"],
                "Sociabilidad": ["amigos", "reglas", "juego", "compartir"]
            },
            "Tropa": {
                "Corporalidad": ["físico", "salud", "juego", "habilidades"],
                "Sociabilidad": ["patrulla", "reglas", "compañeros", "convivencia"]
            }
        }
    },
    {
        "titulo_original": "Pelea de gallos.",
        "titulo_propuesto": "El Combate de los Cangrejos y Gallos",
        "tipo": "juego",
        "duracion": "15 minutos",
        "cantidad": "08 participantes",
        "lugares": ["Interior", "gimnasio"],
        "unidades": ["tropa", "compania"],
        "areas_desarrollo": ["Corporalidad", "Carácter"],
        "materiales": ["Colchonetas (opcional, para mayor seguridad)", "Cuerdas para delimitar el cuadrilátero"],
        "variaciones": "Se puede competir en parejas dentro de círculos pintados en el suelo. Lucha de Cangrejos: en cuatro patas invertido (boca arriba), intentando levantar una mano o pie del rival para que toque el suelo con la espalda.",
        "recomendaciones": "Prohibir estrictamente golpes, empujones en el rostro, tirones de ropa o cabellos. La actividad debe enfocarse puramente en la agilidad y la fuerza de equilibrio.",
        "descripcion_cruda": "Dos oponentes se enfrentan mientras están en cuclillas (con las piernas dobladas, no arrodilladas). El objetivo es desestabilizar al otro con las manos abiertas. Lucha de cangrejos: apoyados en manos y pies boca arriba, desestabilizar al oponente para que toque el suelo con el cuerpo.",
        "keywords": {
            "Tropa": {
                "Corporalidad": ["físico", "cuerpo", "habilidades", "agilidad"],
                "Carácter": ["esfuerzo", "superación", "reglas", "juego limpio"]
            },
            "Compañía": {
                "Corporalidad": ["físico", "cuerpo", "habilidades", "agilidad"],
                "Carácter": ["esfuerzo", "superación", "reglas", "juego limpio"]
            }
        }
    },
    {
        "titulo_original": "Las 4 colinas.",
        "titulo_propuesto": "El Asalto a las Cuatro Colinas",
        "tipo": "juego nocturno",
        "duracion": "90 minutos",
        "cantidad": "24 participantes",
        "lugares": ["Exterior", "bosque"],
        "unidades": ["tropa", "compania", "avanzada"],
        "areas_desarrollo": ["Creatividad", "Corporalidad"],
        "materiales": ["4 pañoletas de colores grandes para delimitar las colinas", "Linternas para cada defensor", "Silbatos para los árbitros", "Tarjetas identificadoras para los atacantes"],
        "variaciones": "Se pueden introducir claves que los atacantes deban descifrar y entregar a los monitores del fuerte. Los defensores pueden rotar posiciones periódicamente.",
        "recomendaciones": "Los defensores no deben encender linternas de forma continua ni salir de sus zonas de defensa. Se debe contar con monitores neutrales para dirimir capturas dudosas.",
        "descripcion_cruda": "Terreno muy accidentado y con bosque. Se marcan cuatro colinas/esquinas con pañoletas y luces. Los atacantes deben infiltrarse en el fuerte sin ser identificados por su nombre. Los defensores custodian con linternas desde el perímetro...",
        "keywords": {
            "Tropa": {
                "Creatividad": ["observación", "sentidos", "naturaleza", "acecho"],
                "Corporalidad": ["físico", "ejercicio", "agilidad", "resistencia"]
            },
            "Compañía": {
                "Creatividad": ["observación", "sentidos", "naturaleza", "acecho"],
                "Corporalidad": ["físico", "ejercicio", "agilidad", "resistencia"]
            },
            "Avanzada": {
                "Creatividad": ["agilidad mental", "observación", "naturaleza", "técnica"],
                "Corporalidad": ["físico", "salud", "naturaleza", "desafío"]
            }
        }
    },
    {
        "titulo_original": "Captura de serpientes.",
        "titulo_propuesto": "La Captura de las Serpientes Veloces",
        "tipo": "juego",
        "duracion": "15 minutos",
        "cantidad": "10 participantes",
        "lugares": ["Exterior", "campo delimitado"],
        "unidades": ["manada", "tropa"],
        "areas_desarrollo": ["Corporalidad", "Carácter"],
        "materiales": ["Cuerdas cortas de 1 metro (una menos que el total de participantes)", "Tiza o conos para delimitar el área y las metas"],
        "variaciones": "En lugar de cuerdas se pueden usar pañoletas. Para Manada, se puede tematizar como capturar serpientes traviesas en la selva de Seeonee.",
        "recomendaciones": "Asegurar que los participantes corran con cuidado de no tropezar unos con otros. En las disputas rápidas de velocidad, definir metas claras y libres de piedras o raíces.",
        "descripcion_cruda": "Habrá cuerdas esparcidas en el suelo (número de Scouts menos uno). A la señal corren a coger una cuerda. El que se queda sin cuerda es eliminado. En caso de compartir una, corren hacia ella desde una distancia igual.",
        "keywords": {
            "Manada": {
                "Corporalidad": ["juego", "movimiento", "habilidades", "ejercicio"],
                "Carácter": ["alegre", "normas", "juego", "superación"]
            },
            "Tropa": {
                "Corporalidad": ["físico", "habilidades", "coordinación", "agilidad"],
                "Carácter": ["esfuerzo", "superación", "reglas", "juego limpio"]
            }
        }
    },
    {
        "titulo_original": "La batalla de globos.",
        "titulo_propuesto": "La Gran Batalla de Globos y Granjeros",
        "tipo": "juego",
        "duracion": "30 minutos",
        "cantidad": "12 participantes",
        "lugares": ["Exterior", "campo delimitado"],
        "unidades": ["manada", "tropa"],
        "areas_desarrollo": ["Corporalidad", "Sociabilidad"],
        "materiales": ["Globos inflados (1 por participante + repuestos)", "Lana o hilo para atar los globos al tobillo", "Silbato y cronómetro"],
        "variaciones": "Juego de Cerdos y Granjeros: en una segunda fase, la mitad son granjeros y la mitad cerdos. Los granjeros deben cargar y levantar en el aire a los cerdos durante 5 segundos para eliminarlos.",
        "recomendaciones": "Evitar tirones fuertes de tobillos que puedan causar caídas o esguinces. En la fase de Granjeros, enseñar técnicas correctas de levantamiento (espalda recta) para no lastimarse.",
        "descripcion_cruda": "Se atará un globo inflado al tobillo de cada participante a 10cm. El objetivo es pisar el globo del oponente sin que pisen el propio. Cerdos y granjeros: los granjeros deben atrapar y levantar a los cerditos durante 5 segundos...",
        "keywords": {
            "Manada": {
                "Corporalidad": ["juego", "ejercicio", "movimiento", "reglas"],
                "Sociabilidad": ["compartir", "amigos", "seisena", "juego"]
            },
            "Tropa": {
                "Corporalidad": ["físico", "habilidades", "ejercicio", "movimiento"],
                "Sociabilidad": ["patrulla", "compañerismo", "reglas", "equipo"]
            }
        }
    },
    {
        "titulo_original": "Animales que son venerados.",
        "titulo_propuesto": "Los Mensajeros de la Selva",
        "tipo": "juego",
        "duracion": "45 minutos",
        "cantidad": "16 participantes",
        "lugares": ["Exterior", "bosque"],
        "unidades": ["manada"],
        "areas_desarrollo": ["Creatividad", "Corporalidad"],
        "materiales": ["Tarjetas con puntajes (del 1 al número de patrullas/seisenas) para cada animal escondido", "Silbato del Scouter para marcar el inicio y el fin"],
        "variaciones": "Los animales pueden cambiar de sonido de llamada si se ven acorralados. Se puede realizar de noche aumentando el factor del acecho con linternas.",
        "recomendaciones": "Establecer señales claras de alto al fuego (ej. un silbato largo y agudo) para que los animales puedan cambiar de escondite con seguridad. Mantenerse en el área delimitada.",
        "descripcion_cruda": "Cinco o más jugadores asumen el papel de animales (vaca, burro, oveja, gallo) y se ocultan en el bosque. Cada 30 segundos emiten un grito característico. Las seisenas salen a buscarlos para obtener tarjetas de puntaje.",
        "keywords": {
            "Manada": {
                "Creatividad": ["observación", "juegos de observación", "atención", "imaginación"],
                "Corporalidad": ["cuerpo", "sentidos", "ejercicio", "naturaleza"]
            }
        }
    },
    {
        "titulo_original": "Dibujo en equipo.",
        "titulo_propuesto": "El Mural Colectivo a Relevos",
        "tipo": "dinámica",
        "duracion": "20 minutos",
        "cantidad": "12 participantes",
        "lugares": ["Interior", "sala"],
        "unidades": ["manada", "tropa", "compania"],
        "areas_desarrollo": ["Creatividad", "Sociabilidad"],
        "materiales": ["Papelógrafos o cartulinas grandes pegadas en la pared (una por equipo)", "Plumones o marcadores de colores (uno por equipo)", "Silbato y cronómetro"],
        "variaciones": "En lugar de dibujar un tema libre como 'la ciudad', se les puede dar un desafío scout (ej. 'un campamento ideal' o 'la historia del escultismo'). Se puede jugar con los ojos vendados y guías por voz.",
        "recomendaciones": "Asegurar que el trayecto entre la línea de salida y los papelógrafos esté despejado y libre de sillas o mesas para evitar tropiezos durante las carreras de relevo.",
        "descripcion_cruda": "Equipos alineados en fila. El primero corre a 7-10 metros donde hay un papel y marcador. Dibuja durante 10 segundos sobre un tema (ej. 'la ciudad'), regresa a entregar el marcador al siguiente, y así sucesivamente.",
        "keywords": {
            "Manada": {
                "Creatividad": ["expresión", "crear", "observación", "dibujar"],
                "Sociabilidad": ["seisena", "amigos", "juego", "reglas"]
            },
            "Tropa": {
                "Creatividad": ["expresión", "opinión", "creatividad", "proponer"],
                "Sociabilidad": ["patrulla", "equipo", "compañerismo", "trabajo"]
            },
            "Compañía": {
                "Creatividad": ["expresión", "opinión", "creatividad", "proponer"],
                "Sociabilidad": ["patrulla", "equipo", "compañerismo", "trabajo"]
            }
        }
    },
    {
        "titulo_original": "Los Magos de Teis.",
        "titulo_propuesto": "El Desafío de los Magos de Teis",
        "tipo": "juego",
        "duracion": "120 minutos",
        "cantidad": "24 participantes",
        "lugares": ["Exterior", "campo abierto"],
        "unidades": ["tropa", "compania", "avanzada"],
        "areas_desarrollo": ["Creatividad", "Sociabilidad"],
        "materiales": ["Tiza, retazos de tela, cuerdas", "Mensajes cifrados en código Morse", "Materiales para disfraces o joyería", "Objetos misteriosos para pruebas sensoriales"],
        "variaciones": "Se puede orientar la temática hacia la historia mitológica del grupo o del escultismo local. Las pruebas de los magos pueden adaptarse a técnicas específicas de pionería.",
        "recomendaciones": "Establecer límites de tiempo claros para cada base (máximo 15-20 minutos por prueba) para mantener el dinamismo y evitar esperas prolongadas entre equipos.",
        "descripcion_cruda": "Tres equipos con misiones distintas en un gran juego de bases. Los Magos/Hechiceros ponen pruebas desafiantes (morse, tacto, olfato, disfraces, reescribir la leyenda) y los Consejeros revisan su cumplimiento.",
        "keywords": {
            "Tropa": {
                "Creatividad": ["técnica", "observación", "proponer", "habilidades"],
                "Sociabilidad": ["equipo", "patrulla", "compañerismo", "trabajo"]
            },
            "Compañía": {
                "Creatividad": ["técnica", "observación", "proponer", "habilidades"],
                "Sociabilidad": ["patrulla", "equipo", "compañerismo", "trabajo"]
            },
            "Avanzada": {
                "Creatividad": ["crítico", "propuestas", "liderazgo", "agilidad mental"],
                "Sociabilidad": ["normas", "democracia", "organización", "grupo"]
            }
        }
    }
]

def find_best_objectives(unit, area, kw_list, count=2):
    # Filtrar objetivos por unidad y área
    pool = [o for o in objectives if o["unidad_nombre"].lower() == unit.lower() and o["area_nombre"].lower() == area.lower()]
    if not pool:
        return []
        
    # Encontrar por rango de edad si hay keywords específicas para cada rango o si es por cobertura
    # Reglas de cobertura:
    # Manada: al menos 1 Infancia Media y 1 Infancia Tardía
    # Tropa/Compañía: al menos 1 '11 a 13 años' y 1 '13 a 15 años'
    # Avanzada: '15 a 17 años'
    # Clan: '17 a 20 años' (texto_terminal)
    
    selected = []
    
    if unit.lower() == "manada":
        rangos = ["Infancia Media", "Infancia Tardía"]
    elif unit.lower() in ["tropa", "compañía"]:
        rangos = ["11 a 13 años", "13 a 15 años"]
    elif unit.lower() == "avanzada":
        rangos = ["15 a 17 años"]
    elif unit.lower() == "clan":
        rangos = ["17 a 20 años"]
    else:
        rangos = list(set(o["rango_edad"] for o in pool if o["rango_edad"]))
        
    for rango in rangos:
        rango_pool = [o for o in pool if o["rango_edad"].lower() == rango.lower()]
        if not rango_pool:
            continue
            
        # Puntuación de coincidencia con palabras clave
        scored = []
        for o in rango_pool:
            score = 0
            text = o["texto_infantil"].lower() if unit.lower() != "clan" else o["texto_terminal"].lower()
            for kw in kw_list:
                if kw.lower() in text:
                    score += 1
            scored.append((o, score))
            
        # Ordenar por mayor puntaje de keywords
        scored.sort(key=lambda x: x[1], reverse=True)
        # Tomar el mejor
        selected.append(scored[0][0])
        
    return selected

# Generar borradores de Markdown
output_dir = "docs/actividades"
os.makedirs(output_dir, exist_ok=True)

generated_files = []

for act in activities_config:
    slug = slugify(act["titulo_propuesto"])
    
    # 1. Buscar objetivos educativos
    edu_objs = []
    for unit_name, areas in act["keywords"].items():
        for area_name, kw in areas.items():
            objs = find_best_objectives(unit_name, area_name, kw)
            for o in objs:
                text_content = o["texto_infantil"] if unit_name.lower() != "clan" else o["texto_terminal"]
                edu_objs.append({
                    "id": o["id"],
                    "area": o["area_nombre"],
                    "texto": text_content,
                    "unidad": unit_name,
                    "como_se_cumple": "" # Borrador vacío para reescribir después
                })
                
    # Escribir borrador provisional del Markdown
    filepath = os.path.join(output_dir, f"{slug}.md")
    
    frontmatter = {
        "titulo": act["titulo_propuesto"],
        "tipo": act["tipo"],
        "duracion": act["duracion"],
        "cantidad": act["cantidad"],
        "lugares": act["lugares"],
        "unidades": [u.lower() for u in act["unidades"]],
        "areas_desarrollo": act["areas_desarrollo"],
        "objetivos_generales": [], # Lo asociaremos después
        "materiales": act["materiales"]
    }
    
    # Pre-cargar objetivos generales basados en palabras clave
    obj_generales_pool = [
        "Aprender a seguir instrucciones", "Conocer a los demás", "Construcción de Equipos",
        "Crear un ambiente de distensión", "Desarrollar el carácter mediante la cooperación",
        "Desarrollar la motricidad", "Desfogue de Energías", "Estimular el liderazgo",
        "Estimular el pensamiento crítico", "Estimular la agilidad", "Estimular la agilidad mental",
        "Estimular la observación", "Estimular la participación", "Estimular la confianza",
        "Estrategia y planificación", "Facilitar el conocimiento entre los pares",
        "Fomentar la sana competencia", "Fomentar las relaciones interpersonales",
        "Reforzar el desarrollo de los sentidos", "Trabajo en equipo", "Aprender criptografía"
    ]
    
    for og in obj_generales_pool:
        # Poner lógicas simples
        if "revelos" in act["titulo_propuesto"].lower() or "equipo" in act["titulo_original"].lower() or "cadena" in act["titulo_propuesto"].lower():
            if og in ["Trabajo en equipo", "Construcción de Equipos"]:
                frontmatter["objetivos_generales"].append(og)
        if "cacería" in act["titulo_propuesto"].lower() or "acecho" in act["titulo_propuesto"].lower() or "inobservable" in act["titulo_original"].lower():
            if og in ["Estimular la observación", "Estrategia y planificación"]:
                frontmatter["objetivos_generales"].append(og)
        if "nido" in act["titulo_original"].lower():
            if og in ["Conocer a los demás", "Fomentar las relaciones interpersonales", "Facilitar el conocimiento entre los pares"]:
                frontmatter["objetivos_generales"].append(og)
        if "globos" in act["titulo_original"].lower() or "combate" in act["titulo_propuesto"].lower() or "serpientes" in act["titulo_original"].lower() or "matamoscas" in act["titulo_original"].lower():
            if og in ["Desfogue de Energías", "Estimular la agilidad", "Fomentar la sana competencia"]:
                frontmatter["objetivos_generales"].append(og)
        if "mural" in act["titulo_propuesto"].lower() or "dibujo" in act["titulo_original"].lower():
            if og in ["Estimular la creatividad", "Trabajo en equipo", "Construcción de Equipos"]:
                frontmatter["objetivos_generales"].append(og)
        if "magos" in act["titulo_original"].lower():
            if og in ["Estrategia y planificación", "Trabajo en equipo", "Refuerzo de habilidades técnicas", "Aprender criptografía"]:
                frontmatter["objetivos_generales"].append(og)
                
    # Deduplicar objetivos generales y asegurarse de que tenga mínimo 1
    frontmatter["objetivos_generales"] = list(set(frontmatter["objetivos_generales"]))
    if not frontmatter["objetivos_generales"]:
        frontmatter["objetivos_generales"] = ["Trabajo en equipo"]
        
    # Crear contenido Markdown
    md_content = "---\n"
    for k, v in frontmatter.items():
        if isinstance(v, list):
            md_content += f"{k}: {json.dumps(v, ensure_ascii=False)}\n"
        else:
            md_content += f"{k}: \"{v}\"\n"
    md_content += "---\n\n"
    
    md_content += f"# {act['titulo_propuesto']}\n\n"
    md_content += f"## 📝 Descripción\n[Borrador de descripción: {act['descripcion_cruda']}]\n\n"
    md_content += f"## 🔄 Variaciones\n{act['variaciones']}\n\n"
    md_content += f"## ⚠️ Recomendaciones\n{act['recomendaciones']}\n\n"
    
    # Justificación de áreas
    md_content += f"## 🎯 Justificación Pedagógica de Áreas\n"
    if "Corporalidad" in act["areas_desarrollo"]:
        md_content += "- **Corporalidad**: Fomenta el desarrollo físico, la motricidad fina/gruesa, la coordinación y el conocimiento de los propios límites corporales mediante el movimiento activo en el juego.\n"
    if "Creatividad" in act["areas_desarrollo"]:
        md_content += "- **Creatividad**: Incentiva la capacidad de idear soluciones, planificar estrategias tácticas, improvisar y expresarse libremente a través de la dinámica.\n"
    if "Carácter" in act["areas_desarrollo"]:
        md_content += "- **Carácter**: Promueve el cumplimiento de reglas, la tolerancia a la frustración ante la eliminación, la toma de decisiones éticas y la asunción de las consecuencias en el juego limpio.\n"
    if "Afectividad" in act["areas_desarrollo"]:
        md_content += "- **Afectividad**: Estimula la expresión honesta de emociones, la empatía hacia los sentimientos de otros y el fortalecimiento de la autoestima grupal e individual.\n"
    if "Sociabilidad" in act["areas_desarrollo"]:
        md_content += "- **Sociabilidad**: Fomenta la integración grupal, el trabajo colaborativo en patrullas o seisenas, el debate respetuoso y la cohesión comunitaria a través de un fin común.\n"
    if "Espiritualidad" in act["areas_desarrollo"]:
        md_content += "- **Espiritualidad**: Conecta con los valores de la Promesa y Ley scout, invitando a la gratitud hacia la naturaleza y la vida en comunidad.\n"
    md_content += "\n"
    
    md_content += "## 🎓 Objetivos Educativos y Evaluación (¿Cómo se cumple?)\n"
    md_content += "| Unidad | Área | Objetivo Educativo | ¿Cómo se cumple? |\n"
    md_content += "| :--- | :--- | :--- | :--- |\n"
    
    for obj in edu_objs:
        md_content += f"| {obj['unidad']} | {obj['area']} | {obj['texto']} | [PLACEHOLDER_CSC:{obj['id']}:{obj['unidad']}:{obj['area']}] |\n"
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(md_content)
        
    print(f"Generated draft: {filepath}")
    generated_files.append(filepath)

print(f"\nSuccessfully generated {len(generated_files)} drafts.")
