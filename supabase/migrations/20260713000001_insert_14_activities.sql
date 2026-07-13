-- SQL Migration script for batch importing Nua Mana Scout Activities

BEGIN;

-- Disable triggers in this session to prevent notification spam

SET session_replication_role = 'replica';


-- Inserting activity: Cacería de Osos
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '9a728a58-349a-4fd6-8ef5-d37dfe722fc2',
  'Cacería de Osos',
  'caceria-de-osos',
  'Dinámica de acecho y trabajo en equipo para desarrollar en campamento durante la noche. Un grupo de dirigentes y/o guiadoras (que actúan como "osos") se ocultan en sectores seguros del bosque y hacen sonar sus silbatos a intervalos regulares de 1 a 2 minutos. Cada "oso" lleva consigo tarjetas o papeles especiales con su nombre. Las patrullas o equipos deben organizarse para avanzar en absoluto sigilo a través de la oscuridad, localizarlos y obtener una tarjeta de oso. Los osos pueden cambiar de posición o permanecer fijos. La patrulla que consiga reunir la mayor cantidad de tarjetas de osos distintos al finalizar el tiempo establecido será la ganadora.',
  'publicado',
  '{"areas": ["corporalidad", "creatividad"], "lugares": ["Exterior", "bosque"], "cantidad": "06 participantes", "duracion": "60 minutos", "unidades": ["tropa", "compania"], "objetivos": ["Desfogue de Energías", "Estimular la observación", "Estrategia y planificación", "Trabajo en equipo"], "materiales": ["Silbato", "Tarjetas", "Linterna"], "variaciones": "Los ''osos'' pueden cambiar de escondite constantemente o correr cuando oigan ruidos. Se puede jugar en equipos mixtos o patrullas independientes.", "recomendaciones": "Delimitar muy bien la zona de juego para evitar que los jóvenes se pierdan en la oscuridad. Los dirigentes deben llevar linternas y chalecos reflectantes para emergencias.", "justificacion_areas": "- **Corporalidad**: Fomenta el desarrollo físico, la motricidad fina/gruesa, la coordinación y el conocimiento de los propios límites corporales mediante el movimiento activo en el juego.\n- **Creatividad**: Incentiva la capacidad de idear soluciones, planificar estrategias tácticas, improvisar y expresarse libremente a través de la dinámica.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/cacera-de-osos.webp", "objetivos_educativos": [{"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeros.", "unidad": "Tropa", "como_se_cumple": "**Moviéndome** con cuidado y alerta en el bosque de noche para evitar caídas y asegurar la seguridad de mis compañeros mientras buscamos a los osos."}, {"id": "6768d60a-187e-4bbf-97b9-cdc25a316030", "area": "Corporalidad", "texto": "Ayudo a preparar los juegos, excursiones y campamentos de mi patrulla y mi Tropa.", "unidad": "Tropa", "como_se_cumple": "**Colaborando** activamente con mi patrulla en la planificación de la ruta de búsqueda de los osos escondidos, asegurando que todos tengan un rol."}, {"id": "0b23d4c8-6e40-4e8e-a476-97ed92efa152", "area": "Creatividad", "texto": "Conozco diferentes técnicas de comunicación y sé utilizar algunos de ellos.", "unidad": "Tropa", "como_se_cumple": "**Utilizando** señales silenciosas y señas acordadas con mi patrulla para coordinar el avance silencioso en la oscuridad sin alertar a los osos."}, {"id": "fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b", "area": "Creatividad", "texto": "Saco mis propias conclusiones de los hechos que pasan a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "**Analizando** la dirección y frecuencia de los sonidos de silbato en el entorno para deducir la posición de los osos y guiar a mi equipo con éxito."}, {"id": "b146e0a9-400a-484a-aff4-931528c193e2", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeras.", "unidad": "Compañía", "como_se_cumple": "**Moviéndome** con precaución en la oscuridad del bosque, cuidando mis pasos para prevenir accidentes propios y de mis compañeras de patrulla."}, {"id": "7c91a6b0-5a22-464b-b965-dd216859db69", "area": "Corporalidad", "texto": "Preparo juegos para distintas ocasiones.", "unidad": "Compañía", "como_se_cumple": "**Organizando** las tácticas de mi equipo para interceptar a los monitores que actúan como osos en movimiento, ideando estrategias antes de partir."}, {"id": "d531dd19-4d49-4342-8114-184de017ac49", "area": "Creatividad", "texto": "Conozco diferentes técnicas de comunicación y sé utilizar algunas de ellas.", "unidad": "Compañía", "como_se_cumple": "**Comunicándome** con señas manuales y gestos en la penumbra para mantener alineado el grupo de búsqueda sin revelar nuestra presencia."}, {"id": "071e6f2d-cb33-48c7-a385-4c63d873b254", "area": "Creatividad", "texto": "Me preocupo por saber cada vez más sobre los temas que me interesan.", "unidad": "Compañía", "como_se_cumple": "**Agudizando** mis sentidos para interpretar sonidos, sombras y distancias en la noche forestal, ampliando mis destrezas de exploración."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/cacera-de-osos.webp',
  'Dinámica de acecho y trabajo en equipo para desarrollar en campamento durante la noche. Un grupo de dirigentes y/o guiadoras (que actúan como "osos") se ocultan...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 9
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', '**Moviéndome** con cuidado y alerta en el bosque de noche para evitar caídas y asegurar la seguridad de mis compañeros mientras buscamos a los osos.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '6768d60a-187e-4bbf-97b9-cdc25a316030', '**Colaborando** activamente con mi patrulla en la planificación de la ruta de búsqueda de los osos escondidos, asegurando que todos tengan un rol.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0b23d4c8-6e40-4e8e-a476-97ed92efa152', '**Utilizando** señales silenciosas y señas acordadas con mi patrulla para coordinar el avance silencioso en la oscuridad sin alertar a los osos.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b', '**Analizando** la dirección y frecuencia de los sonidos de silbato en el entorno para deducir la posición de los osos y guiar a mi equipo con éxito.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b146e0a9-400a-484a-aff4-931528c193e2', '**Moviéndome** con precaución en la oscuridad del bosque, cuidando mis pasos para prevenir accidentes propios y de mis compañeras de patrulla.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7c91a6b0-5a22-464b-b965-dd216859db69', '**Organizando** las tácticas de mi equipo para interceptar a los monitores que actúan como osos en movimiento, ideando estrategias antes de partir.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'd531dd19-4d49-4342-8114-184de017ac49', '**Comunicándome** con señas manuales y gestos en la penumbra para mantener alineado el grupo de búsqueda sin revelar nuestra presencia.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '071e6f2d-cb33-48c7-a385-4c63d873b254', '**Agudizando** mis sentidos para interpretar sonidos, sombras y distancias en la noche forestal, ampliando mis destrezas de exploración.'
FROM public.articulos WHERE slug = 'caceria-de-osos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: El Asalto a las Cuatro Colinas
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '8d83761d-7758-414a-8db3-07b6ccc2f3ce',
  'El Asalto a las Cuatro Colinas',
  'el-asalto-a-las-cuatro-colinas',
  'Juego de acecho nocturno en bosque espeso y terreno accidentado. Se delimita un fuerte cuadrangular con cuatro pañoletas grandes en los vértices y faroles de luz en el centro. El grupo se divide en atacantes (dos tercios) y defensores (un tercio). Los atacantes deben infiltrarse en el perímetro del fuerte y revelar su posición mediante un silbido, sin ser reconocidos previamente. Los defensores custodian el perímetro usando linternas, debiendo identificar y llamar por su nombre a cualquier atacante descubierto fuera de los límites. El atacante avistado es enviado temporalmente a prisión.',
  'publicado',
  '{"areas": ["creatividad", "corporalidad"], "lugares": ["Exterior", "bosque"], "cantidad": "12 participantes", "duracion": "90 minutos", "unidades": ["tropa", "compania", "avanzada"], "objetivos": ["Estrategia y planificación", "Estimular la observación", "Trabajo en equipo", "Perder el miedo a la oscuridad"], "materiales": ["Pañolines", "Linterna", "Silbato"], "variaciones": "Se pueden introducir claves que los atacantes deban descifrar y entregar a los monitores del fuerte. Los defensores pueden rotar posiciones periódicamente.", "recomendaciones": "Los defensores no deben encender linternas de forma continua ni salir de sus zonas de defensa. Se debe contar con monitores neutrales para dirimir capturas dudosas.", "justificacion_areas": "- **Corporalidad**: Fomenta el desarrollo físico, la motricidad fina/gruesa, la coordinación y el conocimiento de los propios límites corporales mediante el movimiento activo en el juego.\n- **Creatividad**: Incentiva la capacidad de idear soluciones, planificar estrategias tácticas, improvisar y expresarse libremente a través de la dinámica.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-asalto-a-las-cuatro-colinas.webp", "objetivos_educativos": [{"id": "a93b3a5c-a023-4e0c-815d-c77c6700dd89", "area": "Creatividad", "texto": "Me intereso por conocer más sobre lo que pasa a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "**Investigando** las mejores rutas de sigilo y zonas de sombra en el bosque accidentado para infiltrarme en las colinas sin ser descubierto."}, {"id": "fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b", "area": "Creatividad", "texto": "Saco mis propias conclusiones de los hechos que pasan a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "**Evaluando** el rango de luz de las linternas y el movimiento de los guardianes defensores para deducir el momento idóneo para avanzar."}, {"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeros.", "unidad": "Tropa", "como_se_cumple": "**Desplazándome** con cautela en el terreno boscoso nocturno, cuidando mis articulaciones y manteniéndome alerta a desniveles para evitar lesiones en mi patrulla."}, {"id": "68add558-4b03-4105-b00d-e7f2ead6ac23", "area": "Corporalidad", "texto": "Sé qué hacer frente a una enfermedad o accidente.", "unidad": "Tropa", "como_se_cumple": "**Actuando** con responsabilidad e informando inmediatamente a los Scouters de apoyo si algún atacante tropieza o necesita asistencia en el bosque."}, {"id": "a93b3a5c-a023-4e0c-815d-c77c6700dd89", "area": "Creatividad", "texto": "Me intereso por conocer más sobre lo que pasa a mi alrededor.", "unidad": "Compañía", "como_se_cumple": "**Analizando** de manera proactiva la disposición de las pañoletas del fuerte para encontrar el flanco menos custodiado por las linternas defensoras."}, {"id": "071e6f2d-cb33-48c7-a385-4c63d873b254", "area": "Creatividad", "texto": "Me preocupo por saber cada vez más sobre los temas que me interesan.", "unidad": "Compañía", "como_se_cumple": "**Perfeccionando** mis técnicas de camuflaje y acecho nocturno utilizando elementos del bosque para ocultar mi aproximación a las colinas."}, {"id": "5c9843d1-39fd-4298-870c-5e46f29ffbf6", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "unidad": "Compañía", "como_se_cumple": "**Poniendo** a prueba mi agilidad física al gatear y moverme con rapidez a ras del suelo forestal para burlar las linternas de los guardianes."}, {"id": "68add558-4b03-4105-b00d-e7f2ead6ac23", "area": "Corporalidad", "texto": "Sé qué hacer frente a una enfermedad o accidente.", "unidad": "Compañía", "como_se_cumple": "**Siguiendo** con calma las instrucciones del equipo y deteniendo el juego si se escucha la señal de alarma o si alguna compañera se lastima en la oscuridad."}, {"id": "fe57c89e-be7b-46a1-b370-64df400355fa", "area": "Creatividad", "texto": "Trato de aprender más sobre cuestiones técnicas relacionadas con el sonido, la imagen, la mecánica, la informática y otros.", "unidad": "Avanzada", "como_se_cumple": "**Aplicando** de forma innovadora técnicas de camuflaje nocturno y uso técnico de la luz y las sombras en la planificación táctica de asalto a las colinas."}, {"id": "05f42879-f5f5-40c4-bed6-c577bf61340a", "area": "Corporalidad", "texto": "Cuido mi salud y mantengo hábitos que la protegen.", "unidad": "Avanzada", "como_se_cumple": "**Regulando** mi esfuerzo físico e hidratándome adecuadamente tras las exigentes carreras y acechos en terreno accidentado bajo el clima nocturno."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-asalto-a-las-cuatro-colinas.webp',
  'Juego de acecho nocturno en bosque espeso y terreno accidentado. Se delimita un fuerte cuadrangular con cuatro pañoletas grandes en los vértices y faroles de lu...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 9
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a93b3a5c-a023-4e0c-815d-c77c6700dd89', '**Investigando** las mejores rutas de sigilo y zonas de sombra en el bosque accidentado para infiltrarme en las colinas sin ser descubierto.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b', '**Evaluando** el rango de luz de las linternas y el movimiento de los guardianes defensores para deducir el momento idóneo para avanzar.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', '**Desplazándome** con cautela en el terreno boscoso nocturno, cuidando mis articulaciones y manteniéndome alerta a desniveles para evitar lesiones en mi patrulla.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '68add558-4b03-4105-b00d-e7f2ead6ac23', '**Actuando** con responsabilidad e informando inmediatamente a los Scouters de apoyo si algún atacante tropieza o necesita asistencia en el bosque.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a93b3a5c-a023-4e0c-815d-c77c6700dd89', '**Analizando** de manera proactiva la disposición de las pañoletas del fuerte para encontrar el flanco menos custodiado por las linternas defensoras.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '071e6f2d-cb33-48c7-a385-4c63d873b254', '**Perfeccionando** mis técnicas de camuflaje y acecho nocturno utilizando elementos del bosque para ocultar mi aproximación a las colinas.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5c9843d1-39fd-4298-870c-5e46f29ffbf6', '**Poniendo** a prueba mi agilidad física al gatear y moverme con rapidez a ras del suelo forestal para burlar las linternas de los guardianes.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '68add558-4b03-4105-b00d-e7f2ead6ac23', '**Siguiendo** con calma las instrucciones del equipo y deteniendo el juego si se escucha la señal de alarma o si alguna compañera se lastima en la oscuridad.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fe57c89e-be7b-46a1-b370-64df400355fa', '**Aplicando** de forma innovadora técnicas de camuflaje nocturno y uso técnico de la luz y las sombras en la planificación táctica de asalto a las colinas.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '05f42879-f5f5-40c4-bed6-c577bf61340a', '**Regulando** mi esfuerzo físico e hidratándome adecuadamente tras las exigentes carreras y acechos en terreno accidentado bajo el clima nocturno.'
FROM public.articulos WHERE slug = 'el-asalto-a-las-cuatro-colinas'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: El Desafío de los Magos de Teis
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  'f58731f9-1a0b-442e-b6b1-89cb7309a90b',
  'El Desafío de los Magos de Teis',
  'el-desafio-de-los-magos-de-teis',
  'Un gran juego de bases y de rol al aire libre. La historia narra que, por haber infringido las sabias normas del pueblo, unos prisioneros fueron encarcelados. Su liberación depende de que los equipos superen difíciles desafíos de los Hechiceros de la tribu para devolverles la cordura. Los participantes se dividen en equipos y recorren bases donde los guardianes/magos proponen desafíos técnicos específicos (como reescribir la leyenda histórica y crear un himno, decodificar mensajes cifrados en morse, o identificar objetos naturales misteriosos mediante el tacto y el olfato). Los Consejeros evalúan la ejecución final y otorgan pistas para ir a la siguiente estación.',
  'publicado',
  '{"areas": ["creatividad", "sociabilidad"], "lugares": ["Exterior", "campo abierto"], "cantidad": "06 participantes", "duracion": "120 minutos", "unidades": ["tropa", "compania", "avanzada"], "objetivos": ["Refuerzo de habilidades técnicas", "Estrategia y planificación", "Trabajo en equipo", "Aprender criptografía"], "materiales": ["Tiza", "retazos de tela", "cuerdas", "Mensajes cifrados en código Morse", "Materiales para disfraces o joyería", "Objetos misteriosos para pruebas sensoriales"], "variaciones": "Se puede orientar la temática hacia la historia mitológica del grupo o del escultismo local. Las pruebas de los magos pueden adaptarse a técnicas específicas.", "recomendaciones": "Establecer límites de tiempo claros para cada base (máximo 15-20 minutos por prueba) para mantener el dinamismo y evitar esperas prolongadas entre equipos.", "justificacion_areas": "- **Creatividad**: Incentiva la capacidad de idear soluciones, planificar estrategias tácticas, improvisar y expresarse libremente a través de la dinámica.\n- **Sociabilidad**: Fomenta la integración grupal, el trabajo colaborativo en patrullas o seisenas, el debate respetuoso y la cohesión comunitaria a través de un fin común.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-desafo-de-los-magos-de-teis.webp", "objetivos_educativos": [{"id": "11320fb6-98de-4725-825d-db858e3bffa2", "area": "Creatividad", "texto": "Perfecciono mis habilidades manuales.", "unidad": "Tropa", "como_se_cumple": "**Construyendo** adornos tribales y joyería scout con cuerdas y retazos de tela para cumplir con las pruebas de caracterización de la tribu."}, {"id": "fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b", "area": "Creatividad", "texto": "Saco mis propias conclusiones de los hechos que pasan a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "**Decodificando** los mensajes cifrados en Morse y resolviendo los acertijos sensoriales de los hechiceros para encontrar el cetro perdido."}, {"id": "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3", "area": "Sociabilidad", "texto": "Converso con mi patrulla sobre los derechos humanos.", "unidad": "Tropa", "como_se_cumple": "**Escuchando** y debatiendo de forma constructiva con mi patrulla las decisiones de la tribu para superar el reto sin discusiones dañinas."}, {"id": "8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Tropa", "como_se_cumple": "**Colaborando** activamente en la estación asignada por mi jefe de patrulla para resolver los retos en el tiempo acordado por el Consejo."}, {"id": "11320fb6-98de-4725-825d-db858e3bffa2", "area": "Creatividad", "texto": "Perfecciono mis habilidades manuales.", "unidad": "Compañía", "como_se_cumple": "**Elaborando** de forma creativa vestuarios temáticos utilizando cartones, retazos y tiza, demostrando ingenio técnico bajo presión."}, {"id": "071e6f2d-cb33-48c7-a385-4c63d873b254", "area": "Creatividad", "texto": "Me preocupo por saber cada vez más sobre los temas que me interesan.", "unidad": "Compañía", "como_se_cumple": "**Practicando** y expandiendo mis conocimientos de criptografía scout y técnicas de rastreo para guiar a mi patrulla en la descodificación."}, {"id": "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3", "area": "Sociabilidad", "texto": "Converso con mi patrulla sobre los derechos humanos.", "unidad": "Compañía", "como_se_cumple": "**Respetando** a todos los miembros de mi patrulla y valorando la equidad de roles durante los desafiantes juegos de bases de los Magos."}, {"id": "b3d92c8b-c7c8-42bc-bc03-4e925e019a87", "area": "Sociabilidad", "texto": "Propongo actividades de servicio de mi patrulla y Compañía y colaboro en su organización.", "unidad": "Compañía", "como_se_cumple": "**Liderando** la resolución colectiva de la prueba de reescritura de la leyenda de la tribu, fomentando la cooperación y la ayuda mutua en el juego."}, {"id": "fefc6ed0-97f8-4a71-99d9-f56729ba0a92", "area": "Creatividad", "texto": "Me informo de lo que pasa a mi alrededor y soy capaz de valorar críticamente lo que veo, leo y escucho.", "unidad": "Avanzada", "como_se_cumple": "**Analizando** de manera crítica las pistas e historias de la tribu THEIS, para proponer a mi equipo soluciones lógicas e inteligentes a los desafíos de los magos."}, {"id": "bf199285-12a9-422e-b97a-2fe99f326809", "area": "Sociabilidad", "texto": "Valoro la democracia como sistema de generación de la autoridad.", "unidad": "Avanzada", "como_se_cumple": "**Respetando** democráticamente los consensos de mi equipo para asignar roles en las diferentes bases y delegar responsabilidades de liderazgo."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-desafo-de-los-magos-de-teis.webp',
  'Un gran juego de bases y de rol al aire libre. La historia narra que, por haber infringido las sabias normas del pueblo, unos prisioneros fueron encarcelados. S...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '11320fb6-98de-4725-825d-db858e3bffa2', '**Construyendo** adornos tribales y joyería scout con cuerdas y retazos de tela para cumplir con las pruebas de caracterización de la tribu.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b', '**Decodificando** los mensajes cifrados en Morse y resolviendo los acertijos sensoriales de los hechiceros para encontrar el cetro perdido.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3', '**Escuchando** y debatiendo de forma constructiva con mi patrulla las decisiones de la tribu para superar el reto sin discusiones dañinas.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25', '**Colaborando** activamente en la estación asignada por mi jefe de patrulla para resolver los retos en el tiempo acordado por el Consejo.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '11320fb6-98de-4725-825d-db858e3bffa2', '**Elaborando** de forma creativa vestuarios temáticos utilizando cartones, retazos y tiza, demostrando ingenio técnico bajo presión.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '071e6f2d-cb33-48c7-a385-4c63d873b254', '**Practicando** y expandiendo mis conocimientos de criptografía scout y técnicas de rastreo para guiar a mi patrulla en la descodificación.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3', '**Respetando** a todos los miembros de mi patrulla y valorando la equidad de roles durante los desafiantes juegos de bases de los Magos.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b3d92c8b-c7c8-42bc-bc03-4e925e019a87', '**Liderando** la resolución colectiva de la prueba de reescritura de la leyenda de la tribu, fomentando la cooperación y la ayuda mutua en el juego.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fefc6ed0-97f8-4a71-99d9-f56729ba0a92', '**Analizando** de manera crítica las pistas e historias de la tribu THEIS, para proponer a mi equipo soluciones lógicas e inteligentes a los desafíos de los magos.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'bf199285-12a9-422e-b97a-2fe99f326809', '**Respetando** democráticamente los consensos de mi equipo para asignar roles en las diferentes bases y delegar responsabilidades de liderazgo.'
FROM public.articulos WHERE slug = 'el-desafio-de-los-magos-de-teis'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: El Inobservable
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '6bbfe901-aa05-4199-9b86-ff38faed76ca',
  'El Inobservable',
  'el-inobservable',
  'Dinámica de acecho nocturno que entrena la observación minuciosa y la paciencia. Un dirigente (el "Inobservable") se oculta en una zona arbolada. Cuenta con una linterna y realiza acciones extrañas de tanto en tanto (emitir sonidos, interactuar de manera misteriosa con objetos, encender la linterna brevemente). Los participantes deben infiltrarse en el sector, encontrarlo y observarlo detenidamente para anotar todo lo que hace, sin revelar su propia presencia. Si el Inobservable u otras dos guiadoras y/o dirigentes  patrulleros con linternas iluminan directamente a un jugador, este debe volver a la base segura para recuperar una vida antes de continuar.',
  'publicado',
  '{"areas": ["creatividad", "corporalidad"], "lugares": ["Exterior", "bosque"], "cantidad": "04 participantes", "duracion": "45 minutos", "unidades": ["tropa", "compania"], "objetivos": ["Estimular la observación", "Perder el miedo a la oscuridad", "Trabajo en equipo", "Estimular la atención a los detalles"], "materiales": ["Linterna", "Objetos ruidosos (tarros", "campanas)"], "variaciones": "El inobservable puede dejar pistas luminosas intermitentes (como varitas de luz química). Los jugadores pueden organizarse en parejas de acecho.", "recomendaciones": "Advertir a los participantes sobre el relieve del terreno (raíces, hoyos) al moverse en la oscuridad sin linternas encendidas. Establecer una zona de base segura iluminada.", "justificacion_areas": "- **Corporalidad**: Fomenta el desarrollo físico, la motricidad fina/gruesa, la coordinación y el conocimiento de los propios límites corporales mediante el movimiento activo en el juego.\n- **Creatividad**: Incentiva la capacidad de idear soluciones, planificar estrategias tácticas, improvisar y expresarse libremente a través de la dinámica.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-inobservable.webp", "objetivos_educativos": [{"id": "a93b3a5c-a023-4e0c-815d-c77c6700dd89", "area": "Creatividad", "texto": "Me intereso por conocer más sobre lo que pasa a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "**Observando** con atención las conductas inusuales y acciones del Scouter invisible en el bosque nocturno, anotando cada detalle de forma discreta."}, {"id": "fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b", "area": "Creatividad", "texto": "Saco mis propias conclusiones de los hechos que pasan a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "**Analizando** los extraños sonidos y movimientos del inobservable para descifrar el significado de sus patrones lúdicos sin delatar mi posición."}, {"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeros.", "unidad": "Tropa", "como_se_cumple": "**Desplazándome** con sigilo por terrenos irregulares a oscuras, evitando zonas peligrosas como pendientes o ramas bajas para prevenir caídas de mi equipo."}, {"id": "68add558-4b03-4105-b00d-e7f2ead6ac23", "area": "Corporalidad", "texto": "Sé qué hacer frente a una enfermedad o accidente.", "unidad": "Tropa", "como_se_cumple": "**Manteniendo** la calma y aplicando los protocolos de emergencia del juego si algún compañero tropieza o sufre un percance físico en la penumbra."}, {"id": "a93b3a5c-a023-4e0c-815d-c77c6700dd89", "area": "Creatividad", "texto": "Me intereso por conocer más sobre lo que pasa a mi alrededor.", "unidad": "Compañía", "como_se_cumple": "**Registrando** minuciosamente los gestos y movimientos que realiza el Scouter oculto, prestando atención a los misterios propuestos en la dinámica."}, {"id": "071e6f2d-cb33-48c7-a385-4c63d873b254", "area": "Creatividad", "texto": "Me preocupo por saber cada vez más sobre los temas que me interesan.", "unidad": "Compañía", "como_se_cumple": "**Investigando** de manera detectivesca la posición del inobservable, guiándome por pequeños indicios auditivos en medio del silencio nocturno."}, {"id": "5c9843d1-39fd-4298-870c-5e46f29ffbf6", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "unidad": "Compañía", "como_se_cumple": "**Ejercitando** mi resistencia corporal al arrastrarme por el suelo y mantener posiciones estáticas para mantenerme oculta de la linterna de los guardianes."}, {"id": "68add558-4b03-4105-b00d-e7f2ead6ac23", "area": "Corporalidad", "texto": "Sé qué hacer frente a una enfermedad o accidente.", "unidad": "Compañía", "como_se_cumple": "**Auxiliando** a mi patrulla siguiendo las directrices de seguridad indicadas en caso de que alguna compañera pierda el equilibrio en la oscuridad."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-inobservable.webp',
  'Dinámica de acecho nocturno que entrena la observación minuciosa y la paciencia. Un dirigente (el "Inobservable") se oculta en una zona arbolada. Cuenta con una...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 9
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a93b3a5c-a023-4e0c-815d-c77c6700dd89', '**Observando** con atención las conductas inusuales y acciones del Scouter invisible en el bosque nocturno, anotando cada detalle de forma discreta.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b', '**Analizando** los extraños sonidos y movimientos del inobservable para descifrar el significado de sus patrones lúdicos sin delatar mi posición.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', '**Desplazándome** con sigilo por terrenos irregulares a oscuras, evitando zonas peligrosas como pendientes o ramas bajas para prevenir caídas de mi equipo.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '68add558-4b03-4105-b00d-e7f2ead6ac23', '**Manteniendo** la calma y aplicando los protocolos de emergencia del juego si algún compañero tropieza o sufre un percance físico en la penumbra.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a93b3a5c-a023-4e0c-815d-c77c6700dd89', '**Registrando** minuciosamente los gestos y movimientos que realiza el Scouter oculto, prestando atención a los misterios propuestos en la dinámica.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '071e6f2d-cb33-48c7-a385-4c63d873b254', '**Investigando** de manera detectivesca la posición del inobservable, guiándome por pequeños indicios auditivos en medio del silencio nocturno.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5c9843d1-39fd-4298-870c-5e46f29ffbf6', '**Ejercitando** mi resistencia corporal al arrastrarme por el suelo y mantener posiciones estáticas para mantenerme oculta de la linterna de los guardianes.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '68add558-4b03-4105-b00d-e7f2ead6ac23', '**Auxiliando** a mi patrulla siguiendo las directrices de seguridad indicadas en caso de que alguna compañera pierda el equilibrio en la oscuridad.'
FROM public.articulos WHERE slug = 'el-inobservable'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: El Matamoscas en Cadena
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  'bb133e6b-fbbc-4827-b2d8-838016ee1eae',
  'El Matamoscas en Cadena',
  'el-matamoscas-en-cadena',
  'Juego dinámico de persecución grupal en un área delimitada de 20x10 metros. Un jugador comienza como ''el matamoscas'' en el centro. Al silbatazo, el resto intenta correr de un extremo al otro del campo sin ser atrapados. Cada participante atrapado debe unirse de la mano al perseguidor, formando una cadena humana que crece en cada ronda. El objetivo de la cadena es organizarse para acorralar y atrapar a los corredores restantes. El juego termina cuando todos han sido integrados a la cadena. El último jugador en ser capturado es el ganador de la dinámica.',
  'publicado',
  '{"areas": ["corporalidad", "sociabilidad"], "lugares": ["Exterior", "campo delimitado"], "cantidad": "12 participantes", "duracion": "20 minutos", "unidades": ["manada", "tropa"], "objetivos": ["Desfogue de Energías", "Estimular la agilidad", "Estimular la capacidad de reacción", "Trabajo en equipo"], "materiales": ["Tiza", "Silbato"], "variaciones": "Variante ''Sin Reversa'': La cadena se mueve por líneas prefijadas en un sentido y los corredores en el opuesto. En espacios reducidos, se puede jugar caminando en lugar de corriendo.", "recomendaciones": "Tener cuidado de no tirar con demasiada fuerza de las manos de los extremos de la cadena para evitar caídas o torceduras. El terreno debe estar libre de obstáculos.", "justificacion_areas": "- **Corporalidad**: Fomenta el desarrollo físico, la motricidad fina/gruesa, la coordinación y el conocimiento de los propios límites corporales mediante el movimiento activo en el juego.\n- **Sociabilidad**: Fomenta la integración grupal, el trabajo colaborativo en patrullas o seisenas, el debate respetuoso y la cohesión comunitaria a través de un fin común.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-matamoscas-en-cadena.webp", "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "**Corriendo** con velocidad pero con cuidado dentro de los límites del campo, evitando empujones y frenadas bruscas que puedan hacernos caer a mí o a mis amigos."}, {"id": "5d2d48ed-c461-4a8e-9048-cceecd3de2e2", "area": "Corporalidad", "texto": "Me gusta jugar con otros niños y niñas y respeto las reglas de los juegos.", "unidad": "Manada", "como_se_cumple": "**Respetando** las reglas del juego al tomar de la mano a mis compañeros de cadena sin soltarme y aceptando alegremente cuando soy atrapado por el matamoscas en medio de la cancha."}, {"id": "a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808", "area": "Sociabilidad", "texto": "Participo en juegos y actividades sobre los derechos del niño.", "unidad": "Manada", "como_se_cumple": "**Incluyendo** a todos los lobatos en la cadena y asegurando que nadie se quede atrás, experimentando cómo el juego cooperativo protege y valora a todos mis pares por igual."}, {"id": "e13cc7f4-052f-476c-b068-95dc59e284b2", "area": "Sociabilidad", "texto": "Cuido los árboles y las plantas en los lugares en que juego, trabajo y vivo.", "unidad": "Manada", "como_se_cumple": "**Evitando** pisar las plantas o ramas de los bordes del campo mientras corro para salvarme, dejando la zona de juego limpia y en perfecto estado al terminar."}, {"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeros.", "unidad": "Tropa", "como_se_cumple": "**Coordinando** los giros y la velocidad de la cadena de corredores para no tirar con brusquedad de mis extremos, previniendo caídas y tirones articulares."}, {"id": "6768d60a-187e-4bbf-97b9-cdc25a316030", "area": "Corporalidad", "texto": "Ayudo a preparar los juegos, excursiones y campamentos de mi patrulla y mi Tropa.", "unidad": "Tropa", "como_se_cumple": "**Colaborando** en la delimitación segura del cuadrante de juego de 20x10 metros, retirando piedras y ramas antes de que la tropa comience a correr."}, {"id": "a3d7abdf-ca3b-42b8-92b5-403958fb537c", "area": "Sociabilidad", "texto": "Procuro que respetemos a nuestras compañeros, cualquiera sea su manera de ser.", "unidad": "Tropa", "como_se_cumple": "**Apoyando** el ritmo de carrera de todos los integrantes que entran a la cadena, adaptándome a las capacidades de velocidad de cada uno de mis compañeros."}, {"id": "8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Tropa", "como_se_cumple": "**Trabajando** en equipo con los capturados para acorralar a los últimos corredores libres mediante movimientos en bloque coordinados de nuestra patrulla."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-matamoscas-en-cadena.webp',
  'Juego dinámico de persecución grupal en un área delimitada de 20x10 metros. Un jugador comienza como ''el matamoscas'' en el centro. Al silbatazo, el resto intent...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', '**Corriendo** con velocidad pero con cuidado dentro de los límites del campo, evitando empujones y frenadas bruscas que puedan hacernos caer a mí o a mis amigos.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5d2d48ed-c461-4a8e-9048-cceecd3de2e2', '**Respetando** las reglas del juego al tomar de la mano a mis compañeros de cadena sin soltarme y aceptando alegremente cuando soy atrapado por el matamoscas en medio de la cancha.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808', '**Incluyendo** a todos los lobatos en la cadena y asegurando que nadie se quede atrás, experimentando cómo el juego cooperativo protege y valora a todos mis pares por igual.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e13cc7f4-052f-476c-b068-95dc59e284b2', '**Evitando** pisar las plantas o ramas de los bordes del campo mientras corro para salvarme, dejando la zona de juego limpia y en perfecto estado al terminar.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', '**Coordinando** los giros y la velocidad de la cadena de corredores para no tirar con brusquedad de mis extremos, previniendo caídas y tirones articulares.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '6768d60a-187e-4bbf-97b9-cdc25a316030', '**Colaborando** en la delimitación segura del cuadrante de juego de 20x10 metros, retirando piedras y ramas antes de que la tropa comience a correr.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a3d7abdf-ca3b-42b8-92b5-403958fb537c', '**Apoyando** el ritmo de carrera de todos los integrantes que entran a la cadena, adaptándome a las capacidades de velocidad de cada uno de mis compañeros.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25', '**Trabajando** en equipo con los capturados para acorralar a los últimos corredores libres mediante movimientos en bloque coordinados de nuestra patrulla.'
FROM public.articulos WHERE slug = 'el-matamoscas-en-cadena'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: El Mural Colectivo
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  'bb6e07c8-1c5d-4b27-8f46-545be63dae8e',
  'El Mural Colectivo',
  'el-mural-colectivo',
  'Dinámica artística a relevos para fomentar la expresión e integración grupal. Los equipos se alinean a 10 metros de un muro o tablero donde se ha colgado un pliego grande de papel con un plumón. A la señal del monitor, el primer integrante corre hasta el mural y dispone de 10 segundos exactos para comenzar a dibujar sobre una temática acordada previamente (como ''el campamento de patrulla'' o ''la ciudad ideal''). Pasado el tiempo, regresa corriendo para entregar el marcador al siguiente, quien continúa la idea de su compañero sin pausar. Se evalúa el trabajo en equipo, la agilidad y la coherencia expresiva final.',
  'publicado',
  '{"areas": ["creatividad", "sociabilidad"], "lugares": ["Interior", "sala"], "cantidad": "04 participantes", "duracion": "20 minutos", "unidades": ["manada", "tropa", "compania"], "objetivos": ["Estimular la creatividad", "Trabajo en equipo", "Construcción de Equipos"], "materiales": ["Papelógrafos", "Plumones", "Silbato", "Cronómetro"], "variaciones": "En lugar de dibujar un tema libre como ''la ciudad'', se les puede dar un desafío scout (ej. ''un campamento ideal'' o ''la historia del escultismo''). Se puede jugar con los ojos vendados y guías por voz.", "recomendaciones": "Asegurar que el trayecto entre la línea de salida y los papelógrafos esté despejado y libre de sillas o mesas para evitar tropiezos durante las carreras de relevo.", "justificacion_areas": "- **Creatividad**: Incentiva la capacidad de idear soluciones, planificar estrategias tácticas, improvisar y expresarse libremente a través de la dinámica.\n- **Sociabilidad**: Fomenta la integración grupal, el trabajo colaborativo en patrullas o seisenas, el debate respetuoso y la cohesión comunitaria a través de un fin común.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-mural-colectivo.webp", "objetivos_educativos": [{"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "texto": "Me gusta participar en juegos de observación.", "unidad": "Manada", "como_se_cumple": "**Identificando** de manera veloz los trazos y aportaciones que mis compañeros de seisena hacen en el papel para continuar su idea artística con coherencia."}, {"id": "418f2b77-f15b-405a-95bd-8033c0b6a4c2", "area": "Creatividad", "texto": "Puedo contar con detalles las anécdotas y aventuras que hemos tenido en la Manada.", "unidad": "Manada", "como_se_cumple": "**Explicando** al grupo con lujo de detalles la historia del mural colectivo que creamos entre todos durante los relevos."}, {"id": "a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808", "area": "Sociabilidad", "texto": "Participo en juegos y actividades sobre los derechos del niño.", "unidad": "Manada", "como_se_cumple": "**Colaborando** pacientemente en el dibujo grupal, respetando el turno de cada lobato de la fila sin acaparar el plumón ni tachar los trazos ajenos."}, {"id": "e13cc7f4-052f-476c-b068-95dc59e284b2", "area": "Sociabilidad", "texto": "Cuido los árboles y las plantas en los lugares en que juego, trabajo y vivo.", "unidad": "Manada", "como_se_cumple": "**Manteniendo** el salón de juegos ordenado al tapar los plumones y reciclar los trozos sobrantes de papel para cuidar nuestro espacio común."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "texto": "Doy mi opinión sobre las cosas que me pasan.", "unidad": "Tropa", "como_se_cumple": "**Proponiendo** ideas creativas a mi patrulla sobre los símbolos de la ciudad a dibujar, expresándome libremente en la ronda de debate previa."}, {"id": "fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b", "area": "Creatividad", "texto": "Saco mis propias conclusiones de los hechos que pasan a mi alrededor.", "unidad": "Tropa", "como_se_cumple": "**Interpretando** el sentido del mural colectivo de los otros equipos, reflexionando sobre la diversidad de visiones que tenemos sobre un mismo tema."}, {"id": "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3", "area": "Sociabilidad", "texto": "Converso con mi patrulla sobre los derechos humanos.", "unidad": "Tropa", "como_se_cumple": "**Representando** a través del dibujo colectivo conceptos de igualdad y derechos comunitarios que debatimos previamente en la patrulla."}, {"id": "8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Tropa", "como_se_cumple": "**Comprometiéndome** con el rol de relevo asignado, corriendo velozmente a plasmar mi parte del dibujo para lograr la meta colectiva de la patrulla."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "texto": "Doy mi opinión sobre las cosas que me pasan.", "unidad": "Compañía", "como_se_cumple": "**Aportando** mis ideas visuales de forma constructiva durante la planificación previa al relevo para acordar la temática artística de mi patrulla."}, {"id": "071e6f2d-cb33-48c7-a385-4c63d873b254", "area": "Creatividad", "texto": "Me preocupo por saber cada vez más sobre los temas que me interesan.", "unidad": "Compañía", "como_se_cumple": "**Desarrollando** destrezas de síntesis gráfica al tener que dibujar conceptos complejos de forma clara en apenas diez segundos."}, {"id": "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3", "area": "Sociabilidad", "texto": "Converso con mi patrulla sobre los derechos humanos.", "unidad": "Compañía", "como_se_cumple": "**Involucrándome** en el diseño de un mural que ilustre de manera gráfica temas de civismo y derechos en nuestra comunidad."}, {"id": "b3d92c8b-c7c8-42bc-bc03-4e925e019a87", "area": "Sociabilidad", "texto": "Propongo actividades de servicio de mi patrulla y Compañía y colaboro en su organización.", "unidad": "Compañía", "como_se_cumple": "**Planificando** cómo este tipo de expresiones artísticas colectivas pueden ser usadas en un proyecto de servicio real para pintar un muro de nuestra escuela."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-mural-colectivo.webp',
  'Dinámica artística a relevos para fomentar la expresión e integración grupal. Los equipos se alinean a 10 metros de un muro o tablero donde se ha colgado un pli...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', '**Identificando** de manera veloz los trazos y aportaciones que mis compañeros de seisena hacen en el papel para continuar su idea artística con coherencia.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '418f2b77-f15b-405a-95bd-8033c0b6a4c2', '**Explicando** al grupo con lujo de detalles la historia del mural colectivo que creamos entre todos durante los relevos.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808', '**Colaborando** pacientemente en el dibujo grupal, respetando el turno de cada lobato de la fila sin acaparar el plumón ni tachar los trazos ajenos.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e13cc7f4-052f-476c-b068-95dc59e284b2', '**Manteniendo** el salón de juegos ordenado al tapar los plumones y reciclar los trozos sobrantes de papel para cuidar nuestro espacio común.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', '**Proponiendo** ideas creativas a mi patrulla sobre los símbolos de la ciudad a dibujar, expresándome libremente en la ronda de debate previa.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fda4f3c9-2c6e-425d-9b86-3b37b40ddb8b', '**Interpretando** el sentido del mural colectivo de los otros equipos, reflexionando sobre la diversidad de visiones que tenemos sobre un mismo tema.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3', '**Representando** a través del dibujo colectivo conceptos de igualdad y derechos comunitarios que debatimos previamente en la patrulla.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25', '**Comprometiéndome** con el rol de relevo asignado, corriendo velozmente a plasmar mi parte del dibujo para lograr la meta colectiva de la patrulla.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', '**Aportando** mis ideas visuales de forma constructiva durante la planificación previa al relevo para acordar la temática artística de mi patrulla.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '071e6f2d-cb33-48c7-a385-4c63d873b254', '**Desarrollando** destrezas de síntesis gráfica al tener que dibujar conceptos complejos de forma clara en apenas diez segundos.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3', '**Involucrándome** en el diseño de un mural que ilustre de manera gráfica temas de civismo y derechos en nuestra comunidad.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b3d92c8b-c7c8-42bc-bc03-4e925e019a87', '**Planificando** cómo este tipo de expresiones artísticas colectivas pueden ser usadas en un proyecto de servicio real para pintar un muro de nuestra escuela.'
FROM public.articulos WHERE slug = 'el-mural-colectivo'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: El Nido de los Recuerdos
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '8177c7e7-fdba-43ba-9e28-f8c99d98d2eb',
  'El Nido de los Recuerdos',
  'el-nido-de-los-recuerdos',
  'Esta dinámica invita a la sección a compartir vivencias y emociones en un clima de confianza mutua. Se dibuja un tablero gigante en forma de nido en un papelógrafo, dividido en casillas numeradas. Cada participante busca una ficha natural (como una piedra pintada o un botón). El jugador en su turno lanza un dado y avanza por las casillas. En cada casilla libre, el participante redacta una "misión de honestidad" (por ejemplo: "relatar un viaje familiar", "compartir qué te hace reír", "recordar un momento difícil"). Si la casilla ya posee una misión, el jugador debe responder y hablar sobre ese tema. El circuito continúa hasta que todos hayan compartido sus experiencias y se haya tejido una red de conocimiento interpersonal.',
  'publicado',
  '{"areas": ["afectividad", "sociabilidad"], "lugares": ["Interior", "sala"], "cantidad": "04 participantes", "duracion": "30 minutos", "unidades": ["manada"], "objetivos": ["Conocer a los demás", "Facilitar el conocimiento entre los pares", "Fomentar las relaciones interpersonales"], "materiales": ["Papelógrafo", "Lápices de colores", "Témperas", "Dado", "Fichas improvisadas"], "variaciones": "Puede jugarse al aire libre dibujando el nido en la tierra con una rama y usando piedras numeradas. En Tropa, se puede usar para la integración de patrullas nuevas introduciendo temas más profundos de debate.", "recomendaciones": "Mantener una atmósfera de confianza y respeto mutuo. Si un participante no desea compartir un aspecto personal muy sensible, permitirle pasar o cambiar de misión sin presión.", "justificacion_areas": "- **Afectividad**: Estimula la expresión honesta de emociones, la empatía hacia los sentimientos de otros y el fortalecimiento de la autoestima grupal e individual.\n- **Sociabilidad**: Fomenta la integración grupal, el trabajo colaborativo en patrullas o seisenas, el debate respetuoso y la cohesión comunitaria a través de un fin común.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-nido-de-los-recuerdos.webp", "objetivos_educativos": [{"id": "054680a5-f07a-4771-8d7a-811a5db8f505", "area": "Afectividad", "texto": "Acepto separarme de mi familia cuando voy de campamento con la Manada.", "unidad": "Manada", "como_se_cumple": "**Conversando** con mi seisena sobre los sentimientos que me produce estar fuera de casa y recordando anécdotas de campamento compartidas en el tablero del nido, reforzando mi seguridad e independencia."}, {"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los demás de las cosas que me ponen alegre y también de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "**Expresando** mis sentimientos en voz alta al caer en las casillas del nido, compartiendo de forma lúdica con mis compañeros los recuerdos que me ponen alegre y los momentos tristes de mi historia."}, {"id": "cfa10133-c25c-4deb-aebe-a00f8fe3f7ef", "area": "Sociabilidad", "texto": "Comparto lo que tengo con mis compañeros y compañeras.", "unidad": "Manada", "como_se_cumple": "**Ofreciendo** mis propias experiencias e ideas a mis amigos al deambular por las casillas del tablero, permitiéndoles conocer mis historias personales y escuchando activamente las de ellos."}, {"id": "472be67d-b110-4fd9-aa16-1f0bf088067c", "area": "Sociabilidad", "texto": "Participo en actividades de intercambio con Manadas de otros Grupos.", "unidad": "Manada", "como_se_cumple": "**Compartiendo** de forma activa mis vivencias y escuchando los relatos de mis pares en este tablero de nidos, preparándome para abrirme y socializar en eventos más grandes de intercambio."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-nido-de-los-recuerdos.webp',
  'Esta dinámica invita a la sección a compartir vivencias y emociones en un clima de confianza mutua. Se dibuja un tablero gigante en forma de nido en un papelógr...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'el-nido-de-los-recuerdos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '054680a5-f07a-4771-8d7a-811a5db8f505', '**Conversando** con mi seisena sobre los sentimientos que me produce estar fuera de casa y recordando anécdotas de campamento compartidas en el tablero del nido, reforzando mi seguridad e independencia.'
FROM public.articulos WHERE slug = 'el-nido-de-los-recuerdos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', '**Expresando** mis sentimientos en voz alta al caer en las casillas del nido, compartiendo de forma lúdica con mis compañeros los recuerdos que me ponen alegre y los momentos tristes de mi historia.'
FROM public.articulos WHERE slug = 'el-nido-de-los-recuerdos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'cfa10133-c25c-4deb-aebe-a00f8fe3f7ef', '**Ofreciendo** mis propias experiencias e ideas a mis amigos al deambular por las casillas del tablero, permitiéndoles conocer mis historias personales y escuchando activamente las de ellos.'
FROM public.articulos WHERE slug = 'el-nido-de-los-recuerdos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '472be67d-b110-4fd9-aa16-1f0bf088067c', '**Compartiendo** de forma activa mis vivencias y escuchando los relatos de mis pares en este tablero de nidos, preparándome para abrirme y socializar en eventos más grandes de intercambio.'
FROM public.articulos WHERE slug = 'el-nido-de-los-recuerdos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: El Sendero del Cuidado
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '1c7c328d-745b-4326-9a30-6e57f7774262',
  'El Sendero del Cuidado',
  'el-sendero-del-cuidado',
  'Esta dinámica busca generar un espacio de confianza mutua, calidez y afecto colectivo a través del contacto físico respetuoso. Para comenzar, los participantes forman dos columnas paralelas, una frente a la otra, dejando un pasillo estrecho en medio que representará la ''senda''. Cada pareja de la columna simula ser una reconfortante estación de cuidado, listos para ofrecer palmaditas suaves, masajes ligeros y gestos amables en los hombros, brazos y espalda de quien cruce. Uno a uno, los integrantes transitan lentamente por esta senda con paso pausado, recibiendo el afecto y la energía positiva de sus compañeros. Al terminar el recorrido, la persona se integra al final de la columna para que un nuevo participante inicie su marcha. La actividad continúa de manera sucesiva hasta que todo el grupo haya cruzado. Al finalizar, es fundamental sentarse en círculo para reflexionar sobre cómo nos sentimos al recibir el aprecio del grupo y el valor de ser acogidos.',
  'publicado',
  '{"areas": ["afectividad"], "lugares": ["Interior", "salón"], "cantidad": "04 participantes", "duracion": "15 minutos", "unidades": ["manada", "compañía"], "objetivos": ["Facilitar el contacto inicial", "Estimular la confianza", "Fomentar un entorno de confianza", "Fomentar las relaciones interpersonales", "Permitir el contacto físico", "Crear un ambiente de distensión"], "materiales": ["Sin Materiales"], "variaciones": "El participante que hace el recorrido puede avanzar con los ojos cerrados para incrementar la confianza y concentrarse plenamente en las sensaciones táctiles y de cuidado del entorno.", "recomendaciones": "Establecer pautas claras de respeto antes de comenzar: los movimientos y el contacto deben realizarse únicamente en zonas seguras y cómodas como los hombros, brazos y espalda alta.", "justificacion_areas": "Esta actividad se centra directamente en el desarrollo de la afectividad. Al requerir un contacto físico sumamente respetuoso y cálido, promueve la empatía, el autoconocimiento corporal y la confianza colectiva. Los participantes experimentan activamente la reciprocidad al dar y recibir cuidado, lo cual fomenta la madurez en la expresión de emociones y el fortalecimiento de lazos afectivos significativos dentro del grupo.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-sendero-del-cuidado.webp", "objetivos_educativos": [{"id": "ab6e594f-b0a0-4e6d-96aa-7779299b02ef", "area": "Afectividad", "texto": "Trato con cariño a los demás en la Manada y me gusta que me traten igual.", "unidad": "Manada", "como_se_cumple": "Tratando con mucho cariño y cuidado a mis hermanos lobatos y lobeznas al hacerles masajes suaves en sus hombros y brazos mientras pasan por el pasillo estrecho del sendero, y sintiendo la alegría y el afecto de mi Manada cuando me toca a mí caminar lentamente entre ellos recibiendo sus palmaditas y gestos amables."}, {"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los demás de las cosas que me ponen alegre y también de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Expresando de forma sencilla y sincera mis sentimientos al sentarme en círculo con mis amigos de la Manada al terminar el juego, compartiendo con ellos las cosas que me dieron alegría, tranquilidad o un poquito de vergüenza al recibir el cariño de mis compañeros durante el recorrido."}, {"id": "e4184d1a-67af-43c4-a7d6-9ece26430f05", "area": "Afectividad", "texto": "Me gusta querer y que me quieran.", "unidad": "Compañía", "como_se_cumple": "Demostrando mi afecto y respeto hacia mis compañeros de Compañía al regalarles masajes ligeros y palabras de aliento en sus hombros mientras avanzan por la senda de cuidado, y aprendiendo a recibir con confianza y gratitud los gestos de contención y afecto de mi grupo cuando me toca cruzar el estrecho pasillo."}, {"id": "4deb9334-aee6-48e4-b480-c562929584ad", "area": "Afectividad", "texto": "Comparto mis sentimientos y emociones con mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Compartiendo abiertamente con mis compañeros en la ronda de conversación en círculo cómo me sentí emocionalmente al recibir el soporte físico y los masajes de mis amigos, ayudando a fortalecer la confianza y los lazos de afecto mutuo dentro de mi patrulla y de la Compañía."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/el-sendero-del-cuidado.webp',
  'Esta dinámica busca generar un espacio de confianza mutua, calidez y afecto colectivo a través del contacto físico respetuoso. Para comenzar, los participantes ...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 10
FROM public.articulos WHERE slug = 'el-sendero-del-cuidado'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ab6e594f-b0a0-4e6d-96aa-7779299b02ef', 'Tratando con mucho cariño y cuidado a mis hermanos lobatos y lobeznas al hacerles masajes suaves en sus hombros y brazos mientras pasan por el pasillo estrecho del sendero, y sintiendo la alegría y el afecto de mi Manada cuando me toca a mí caminar lentamente entre ellos recibiendo sus palmaditas y gestos amables.'
FROM public.articulos WHERE slug = 'el-sendero-del-cuidado'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66de9e77-aa53-48a1-98db-9de3d3958486', 'Expresando de forma sencilla y sincera mis sentimientos al sentarme en círculo con mis amigos de la Manada al terminar el juego, compartiendo con ellos las cosas que me dieron alegría, tranquilidad o un poquito de vergüenza al recibir el cariño de mis compañeros durante el recorrido.'
FROM public.articulos WHERE slug = 'el-sendero-del-cuidado'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e4184d1a-67af-43c4-a7d6-9ece26430f05', 'Demostrando mi afecto y respeto hacia mis compañeros de Compañía al regalarles masajes ligeros y palabras de aliento en sus hombros mientras avanzan por la senda de cuidado, y aprendiendo a recibir con confianza y gratitud los gestos de contención y afecto de mi grupo cuando me toca cruzar el estrecho pasillo.'
FROM public.articulos WHERE slug = 'el-sendero-del-cuidado'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4deb9334-aee6-48e4-b480-c562929584ad', 'Compartiendo abiertamente con mis compañeros en la ronda de conversación en círculo cómo me sentí emocionalmente al recibir el soporte físico y los masajes de mis amigos, ayudando a fortalecer la confianza y los lazos de afecto mutuo dentro de mi patrulla y de la Compañía.'
FROM public.articulos WHERE slug = 'el-sendero-del-cuidado'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: Granjeros y Cerditos
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  'e9ca55a7-c8ca-46e5-9829-774ccbd5ad60',
  'Granjeros y Cerditos',
  'granjeros-y-cerditos',
  'En un terreno blando y delimitado que representa el "corral", los participantes se dividen en dos equipos: los granjeros y los cerditos. El objetivo de los granjeros consiste en trabajar coordinadamente para acorralar, atrapar y levantar en el aire a cada cerdito durante 5 segundos continuos (llevando la cuenta en voz alta). Un cerdito levantado queda eliminado del corral. Al atrapar a todos, se invierten los roles. Gana el equipo que resista más tiempo en su turno como cerditos.',
  'publicado',
  '{"areas": ["corporalidad", "sociabilidad"], "lugares": ["Exterior", "campo delimitado"], "cantidad": "04 participantes", "duracion": "15 minutos", "unidades": ["manada", "tropa"], "objetivos": ["Trabajo en equipo", "Estimular la agilidad", "Desfogue de Energías", "Fomentar la sana competencia"], "materiales": ["Silbato", "Cronómetro", "Conos o cuerdas para delimitar el corral"], "variaciones": "Se pueden introducir zonas de \"refugio\" temporal para los cerditos, donde los granjeros no pueden atraparlos, permitiendo el descanso estratégico por algunos segundos.", "recomendaciones": "El contacto físico debe ser controlado, estando prohibidas las zancadillas y los derribos bruscos. Los granjeros deben levantar a sus compañeros usando técnicas ergonómicas correctas (doblando rodillas, espalda recta) para evitar lesiones lumbares.", "justificacion_areas": "- **Corporalidad**: Promueve la resistencia aeróbica, la fuerza funcional en el levantamiento seguro y la agilidad para evadir oponentes.\n- **Sociabilidad**: Fomenta el trabajo en equipo coordinado para rodear objetivos y la importancia del respeto físico y la empatía en juegos de contacto estrecho.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/granjeros-y-cerditos.webp", "objetivos_educativos": [{"id": "a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808", "area": "Sociabilidad", "texto": "Participo en juegos y actividades sobre los derechos del niño.", "unidad": "Manada", "como_se_cumple": "**Respetando** a todos los participantes en el juego de cerdos y granjeros, asegurando que todos tengan la oportunidad de jugar en ambos roles por igual."}, {"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeros.", "unidad": "Tropa", "como_se_cumple": "**Realizando** de forma segura las técnicas de levantamiento de mis compañeros en el rol de granjero, protegiendo mi espalda y articulaciones al cargarlos durante cinco segundos."}, {"id": "9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3", "area": "Sociabilidad", "texto": "Converso con mi patrulla sobre los derechos humanos.", "unidad": "Tropa", "como_se_cumple": "**Reflexionando** en patrulla tras el juego sobre la importancia del consentimiento y el trato digno a los demás al realizar juegos de contacto físico."}, {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Tropa", "como_se_cumple": "**Trabajando** en equipo con mis compañeros granjeros para rodear estratégicamente a los cerditos más veloces y levantarlos de manera segura y coordinada."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/granjeros-y-cerditos.webp',
  'En un terreno blando y delimitado que representa el "corral", los participantes se dividen en dos equipos: los granjeros y los cerditos. El objetivo de los gran...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'granjeros-y-cerditos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a5c8bf0d-4e75-4f7a-89a2-9feabf5ec808', '**Respetando** a todos los participantes en el juego de cerdos y granjeros, asegurando que todos tengan la oportunidad de jugar en ambos roles por igual.'
FROM public.articulos WHERE slug = 'granjeros-y-cerditos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', '**Realizando** de forma segura las técnicas de levantamiento de mis compañeros en el rol de granjero, protegiendo mi espalda y articulaciones al cargarlos durante cinco segundos.'
FROM public.articulos WHERE slug = 'granjeros-y-cerditos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '9c8c7e3e-0d7c-45e7-9154-2dc5ed6a85e3', '**Reflexionando** en patrulla tras el juego sobre la importancia del consentimiento y el trato digno a los demás al realizar juegos de contacto físico.'
FROM public.articulos WHERE slug = 'granjeros-y-cerditos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0d3af46a-d64c-4e59-a765-1f72dc41ba76', '**Trabajando** en equipo con mis compañeros granjeros para rodear estratégicamente a los cerditos más veloces y levantarlos de manera segura y coordinada.'
FROM public.articulos WHERE slug = 'granjeros-y-cerditos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: La Batalla de Globos
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '4fdbf084-34ba-4e50-a329-3e41b591602e',
  'La Batalla de Globos',
  'la-batalla-de-globos',
  'A cada participante se le ata un globo inflado al tobillo mediante un trozo de lana o hilo de aproximadamente 10 cm. Dentro de un perímetro claramente delimitado (por ejemplo, un cuadrado de césped), el objetivo de los jugadores consiste en pisar y reventar el globo de sus contrincantes mientras protegen y esquivan los ataques sobre el suyo. Aquel participante cuyo globo explote queda inmediatamente fuera de la ronda de juego.',
  'publicado',
  '{"areas": ["corporalidad", "sociabilidad"], "lugares": ["Exterior", "campo delimitado"], "cantidad": "02 participantes", "duracion": "15 minutos", "unidades": ["manada", "tropa"], "objetivos": ["Desfogue de Energías", "Estimular la agilidad", "Fomentar la sana competencia"], "materiales": ["Globos (uno por participante)", "Lana o hilo de coser", "Cronómetro", "Silbato"], "variaciones": "Se puede jugar todos contra todos de forma individual, o bien dividiendo el grupo en equipos (como patrullas o seisenas) que se identifican por globos del mismo color, ganando el equipo que logre mantener al menos un globo inflado al final.", "recomendaciones": "Evitar saltos bruscos directos sobre los pies o tobillos de los compañeros para prevenir torceduras o pisotones dolorosos. Al finalizar el juego, es obligación ecológica del grupo recolectar de inmediato todos los trozos de plástico del suelo para cuidar el entorno.", "justificacion_areas": "- **Corporalidad**: Fomenta el desarrollo psicomotriz, los reflejos, la agilidad espacial y la aceleración en tramos cortos.\n- **Sociabilidad**: Desarrolla la conciencia ecológica y el cuidado del espacio natural de juego a través de tareas de limpieza colectivas al finalizar la dinámica.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/la-batalla-de-globos.webp", "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "**Cuidando** mis movimientos al intentar pisar los globos de los demás para no enredarme las piernas con el hilo o pisar fuertemente a mis compañeros."}, {"id": "5d2d48ed-c461-4a8e-9048-cceecd3de2e2", "area": "Corporalidad", "texto": "Me gusta jugar con otros niños y niñas y respeto las reglas de los juegos.", "unidad": "Manada", "como_se_cumple": "**Jugando** limpiamente y retirándome del cuadrante de juego con una sonrisa si mi globo es reventado por otro lobato."}, {"id": "e13cc7f4-052f-476c-b068-95dc59e284b2", "area": "Sociabilidad", "texto": "Cuido los árboles y las plantas en los lugares en que juego, trabajo y vivo.", "unidad": "Manada", "como_se_cumple": "**Recogiendo** todos los pedazos de globos reventados del pasto al terminar el juego, para evitar que los animales de la zona se los traguen y mantener la naturaleza limpia."}, {"id": "68add558-4b03-4105-b00d-e7f2ead6ac23", "area": "Corporalidad", "texto": "Sé qué hacer frente a una enfermedad o accidente.", "unidad": "Tropa", "como_se_cumple": "**Auxiliando** a mi compañero si sufre una torcedura de tobillo durante la intensa batalla de globos, aplicando primeros auxilios de ser necesario."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/la-batalla-de-globos.webp',
  'A cada participante se le ata un globo inflado al tobillo mediante un trozo de lana o hilo de aproximadamente 10 cm. Dentro de un perímetro claramente delimitad...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'la-batalla-de-globos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', '**Cuidando** mis movimientos al intentar pisar los globos de los demás para no enredarme las piernas con el hilo o pisar fuertemente a mis compañeros.'
FROM public.articulos WHERE slug = 'la-batalla-de-globos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5d2d48ed-c461-4a8e-9048-cceecd3de2e2', '**Jugando** limpiamente y retirándome del cuadrante de juego con una sonrisa si mi globo es reventado por otro lobato.'
FROM public.articulos WHERE slug = 'la-batalla-de-globos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e13cc7f4-052f-476c-b068-95dc59e284b2', '**Recogiendo** todos los pedazos de globos reventados del pasto al terminar el juego, para evitar que los animales de la zona se los traguen y mantener la naturaleza limpia.'
FROM public.articulos WHERE slug = 'la-batalla-de-globos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '68add558-4b03-4105-b00d-e7f2ead6ac23', '**Auxiliando** a mi compañero si sufre una torcedura de tobillo durante la intensa batalla de globos, aplicando primeros auxilios de ser necesario.'
FROM public.articulos WHERE slug = 'la-batalla-de-globos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: La Captura de las Serpientes
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '865a3960-17f0-45b2-973b-19736b9be684',
  'La Captura de las Serpientes',
  'la-captura-de-las-serpientes',
  'Juego de velocidad y reflejos rápidos. Se colocan cuerdas cortas de un metro en el suelo en el centro de un circulo, debiendo haber siempre una cuerda menos que la cantidad de participantes. Al sonar el silbato, los Scouts corren libremente alrededor del circulo y deben atrapar una de las ''serpientes''. El participante que no logre conseguir cuerda queda fuera de la ronda. En caso de que dos jugadores agarren simultáneamente los extremos de una cuerda, se dirime mediante una prueba rápida de velocidad: se sitúa la cuerda a diez metros de distancia de ambos en la línea y al silbatazo corren para ser el primero en tomarla por completo.',
  'publicado',
  '{"areas": ["corporalidad", "carácter"], "lugares": ["Exterior", "campo delimitado"], "cantidad": "10 participantes", "duracion": "15 minutos", "unidades": ["manada", "tropa"], "objetivos": ["Estimular la capacidad de reacción", "Estimular la agilidad", "Fomentar la sana competencia"], "materiales": ["Cuerdas", "Tiza", "Silbato"], "variaciones": "En lugar de cuerdas se pueden usar pañoletas. Para Manada, se puede tematizar como capturar serpientes traviesas en la selva de Seeonee.", "recomendaciones": "Asegurar que los participantes corran con cuidado de no tropezar unos con otros. En las disputas rápidas de velocidad, definir metas claras y libres de piedras o raíces.", "justificacion_areas": "- **Corporalidad**: Fomenta el desarrollo físico, la motricidad fina/gruesa, la coordinación y el conocimiento de los propios límites corporales mediante el movimiento activo en el juego.\n- **Carácter**: Promueve el cumplimiento de reglas, la tolerancia a la frustración ante la eliminación, la toma de decisiones éticas y la asunción de las consecuencias en el juego limpio.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/la-captura-de-las-serpientes.webp", "objetivos_educativos": [{"id": "942e2a3a-b7b5-4b88-b82a-261244f3683e", "area": "Corporalidad", "texto": "He aprendido a medir los riesgos que tienen los juegos y las cosas que hago.", "unidad": "Manada", "como_se_cumple": "**Moviéndome** con rapidez pero cuidando de no chocar o empujar a mis compañeros cuando corremos a atrapar una cuerda del suelo."}, {"id": "0645e815-1412-4f5c-981c-cb5c1d94d772", "area": "Corporalidad", "texto": "Mantengo ordenada y limpia mi habitación y los lugares en que trabajo y juego.", "unidad": "Manada", "como_se_cumple": "**Colaborando** al ordenar las cuerdas y materiales en su caja correspondiente una vez finalizada la cacería de serpientes en el campo."}, {"id": "e9f10dfe-654a-46fd-95ff-5a3d21a26e00", "area": "Carácter", "texto": "Participo en juegos y representaciones que muestran la importancia de decir la verdad.", "unidad": "Manada", "como_se_cumple": "**Admitiendo** con honestidad si mi compañero tocó la cuerda antes que yo en la prueba de velocidad, respetando los resultados reales."}, {"id": "3a84066e-ad27-4122-9a89-4ae45844668b", "area": "Carácter", "texto": "Tengo amigos y amigas con los que siempre juego y me encuentro.", "unidad": "Manada", "como_se_cumple": "**Divirtiéndome** al competir con alegría junto a mis compañeros y consolando afectuosamente a quien sea eliminado de la ronda de cuerdas."}, {"id": "8cae916f-5e67-4697-b3cd-c59b5c7d1439", "area": "Corporalidad", "texto": "Trato de evitar situaciones que puedan dañar mi salud y la de mis compañeros.", "unidad": "Tropa", "como_se_cumple": "**Dosificando** mi aceleración al correr para no colisionar en la disputa directa por las cuerdas en el área delimitada."}, {"id": "68add558-4b03-4105-b00d-e7f2ead6ac23", "area": "Corporalidad", "texto": "Sé qué hacer frente a una enfermedad o accidente.", "unidad": "Tropa", "como_se_cumple": "**Asistiendo** y aplicando primeros auxilios básicos si algún integrante de la tropa sufre un raspón o caída durante el sprint hacia la meta."}, {"id": "fedb6bcf-2ee2-43f5-96d9-505f78284a6a", "area": "Carácter", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "unidad": "Tropa", "como_se_cumple": "**Comprobando** mi velocidad de reacción y agilidad mental al reaccionar instantáneamente al silbato para tomar una cuerda libre."}, {"id": "97f596d3-4cd2-45e2-bc4c-3a91070c1765", "area": "Carácter", "texto": "Me esfuerzo cada vez más en superar mis defectos.", "unidad": "Tropa", "como_se_cumple": "**Evitando** quejas o reacciones molestas cuando me quede sin cuerda, aceptando la eliminación con deportividad scout y apoyando al resto."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/la-captura-de-las-serpientes.webp',
  'Juego de velocidad y reflejos rápidos. Se colocan cuerdas cortas de un metro en el suelo en el centro de un circulo, debiendo haber siempre una cuerda menos que...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '942e2a3a-b7b5-4b88-b82a-261244f3683e', '**Moviéndome** con rapidez pero cuidando de no chocar o empujar a mis compañeros cuando corremos a atrapar una cuerda del suelo.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0645e815-1412-4f5c-981c-cb5c1d94d772', '**Colaborando** al ordenar las cuerdas y materiales en su caja correspondiente una vez finalizada la cacería de serpientes en el campo.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e9f10dfe-654a-46fd-95ff-5a3d21a26e00', '**Admitiendo** con honestidad si mi compañero tocó la cuerda antes que yo en la prueba de velocidad, respetando los resultados reales.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3a84066e-ad27-4122-9a89-4ae45844668b', '**Divirtiéndome** al competir con alegría junto a mis compañeros y consolando afectuosamente a quien sea eliminado de la ronda de cuerdas.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '8cae916f-5e67-4697-b3cd-c59b5c7d1439', '**Dosificando** mi aceleración al correr para no colisionar en la disputa directa por las cuerdas en el área delimitada.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '68add558-4b03-4105-b00d-e7f2ead6ac23', '**Asistiendo** y aplicando primeros auxilios básicos si algún integrante de la tropa sufre un raspón o caída durante el sprint hacia la meta.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fedb6bcf-2ee2-43f5-96d9-505f78284a6a', '**Comprobando** mi velocidad de reacción y agilidad mental al reaccionar instantáneamente al silbato para tomar una cuerda libre.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '97f596d3-4cd2-45e2-bc4c-3a91070c1765', '**Evitando** quejas o reacciones molestas cuando me quede sin cuerda, aceptando la eliminación con deportividad scout y apoyando al resto.'
FROM public.articulos WHERE slug = 'la-captura-de-las-serpientes'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: Los Mensajeros de la Selva
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '00731f9a-038d-4648-8e6d-9bcce6063bc4',
  'Los Mensajeros de la Selva',
  'los-mensajeros-de-la-selva',
  'Juego sensorial y de acecho nocturno o diurno en el bosque. Varios dirigentes se ocultan en diferentes puntos y representan a un animal de la selva de Seeonee, cada uno con un sonido característico (como el elefante, tigre, mono o el lobo). Cada 30 segundos, los dirigentes emiten su respectivo grito de llamada. Las seisenas de lobatos deben avanzar en sigilo y usar el oído para rastrear a los animales en el follaje. Al encontrar uno, reciben tarjetas con puntaje descendente (premiando la rapidez). El juego finaliza cuando la manada ha localizado y registrado a todos los mensajeros.',
  'publicado',
  '{"areas": ["creatividad", "corporalidad"], "lugares": ["Exterior", "bosque"], "cantidad": "04 participantes", "duracion": "45 minutos", "unidades": ["manada"], "objetivos": ["Reforzar el desarrollo de los sentidos", "Estimular la observación", "Trabajo en equipo", "Conocer a los demás"], "materiales": ["Tarjetas", "Silbato"], "variaciones": "Los animales pueden cambiar de sonido de llamada si se ven acorralados. Se puede realizar de noche aumentando el factor del acecho con linternas.", "recomendaciones": "Establecer señales claras de alto al fuego (ej. un silbato largo y agudo) para que los animales puedan cambiar de escondite con seguridad. Mantenerse en el área delimitada.", "justificacion_areas": "- **Corporalidad**: Fomenta el desarrollo físico, la motricidad fina/gruesa, la coordinación y el conocimiento de los propios límites corporales mediante el movimiento activo en el juego.\n- **Creatividad**: Incentiva la capacidad de idear soluciones, planificar estrategias tácticas, improvisar y expresarse libremente a través de la dinámica.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/los-mensajeros-de-la-selva.webp", "objetivos_educativos": [{"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "texto": "Me gusta participar en juegos de observación.", "unidad": "Manada", "como_se_cumple": "**Agudizando** mi sentido de la escucha y observando entre la maleza cada treinta segundos para localizar los escondites de los dirigentes disfrazados de animales de la selva."}, {"id": "418f2b77-f15b-405a-95bd-8033c0b6a4c2", "area": "Creatividad", "texto": "Puedo contar con detalles las anécdotas y aventuras que hemos tenido en la Manada.", "unidad": "Manada", "como_se_cumple": "**Relatando** a mi seisena con entusiasmo y precisión cómo logramos descubrir a los animales escondidos y la graciosa forma en que hacían sus sonidos en el bosque."}, {"id": "b76e1d3e-fc1e-4956-806b-f372cd0369bb", "area": "Corporalidad", "texto": "Me preocupo porque mi cuerpo esté limpio.", "unidad": "Manada", "como_se_cumple": "**Sacudiendo** la tierra de mis rodillas y lavando mis manos al terminar la búsqueda entre las ramas y hojas secas del bosque."}, {"id": "6467298d-fe2b-4920-9b9a-e3524e4b2aef", "area": "Corporalidad", "texto": "Sé en qué lugar de mi cuerpo están ubicados los órganos más importantes.", "unidad": "Manada", "como_se_cumple": "**Identificando** cómo mis oídos captan el sonido y cómo mis pulmones y corazón trabajan más rápido al correr con mi seisena en busca de los animales."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/los-mensajeros-de-la-selva.webp',
  'Juego sensorial y de acecho nocturno o diurno en el bosque. Varios dirigentes se ocultan en diferentes puntos y representan a un animal de la selva de Seeonee, ...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'los-mensajeros-de-la-selva'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', '**Agudizando** mi sentido de la escucha y observando entre la maleza cada treinta segundos para localizar los escondites de los dirigentes disfrazados de animales de la selva.'
FROM public.articulos WHERE slug = 'los-mensajeros-de-la-selva'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '418f2b77-f15b-405a-95bd-8033c0b6a4c2', '**Relatando** a mi seisena con entusiasmo y precisión cómo logramos descubrir a los animales escondidos y la graciosa forma en que hacían sus sonidos en el bosque.'
FROM public.articulos WHERE slug = 'los-mensajeros-de-la-selva'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b76e1d3e-fc1e-4956-806b-f372cd0369bb', '**Sacudiendo** la tierra de mis rodillas y lavando mis manos al terminar la búsqueda entre las ramas y hojas secas del bosque.'
FROM public.articulos WHERE slug = 'los-mensajeros-de-la-selva'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '6467298d-fe2b-4920-9b9a-e3524e4b2aef', '**Identificando** cómo mis oídos captan el sonido y cómo mis pulmones y corazón trabajan más rápido al correr con mi seisena en busca de los animales.'
FROM public.articulos WHERE slug = 'los-mensajeros-de-la-selva'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: Pelea de Cangrejos
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  'bd9f6727-0af3-43d6-877c-a86468263f69',
  'Pelea de Cangrejos',
  'pelea-de-cangrejos',
  'Los oponentes se colocan en posición de cuadrupedia invertida (boca arriba apoyados únicamente sobre las palmas de las manos y las plantas de los pies, sin que los glúteos ni la espalda toquen el suelo). El objetivo del combate es lograr que el rival toque el suelo con la espalda o la cadera, intentando desestabilizarlo mediante un suave levantamiento o barrido de alguna de sus extremidades de apoyo (brazos o piernas).',
  'publicado',
  '{"areas": ["corporalidad", "carácter"], "lugares": ["Interior", "gimnasio"], "cantidad": "02 participantes", "duracion": "15 minutos", "unidades": ["tropa", "compania"], "objetivos": ["Conocer las capacidades corporales", "Estimular la agilidad", "Estimular la coordinación", "Fomentar la sana competencia"], "materiales": ["Colchonetas (opcional", "para mayor seguridad)", "Cuerdas para delimitar el cuadrilátero"], "variaciones": "Se puede jugar en modalidad de \"supervivencia\" grupal en un cuadrilátero donde todos los cangrejos combaten simultáneamente y los eliminados salen de la zona delimitada.", "recomendaciones": "Evitar patadas directas o empujones bruscos en las articulaciones del codo o la rodilla que puedan provocar lesiones. La superficie de juego debe ser blanda (césped o colchonetas) para resguardar las caídas de espaldas.", "justificacion_areas": "- **Corporalidad**: Fortalece de manera intensa la musculatura del torso, piernas y brazos, y promueve la coordinación motora compleja en posturas no convencionales.\n- **Carácter**: Desarrolla la fuerza de voluntad, la concentración y el sentido de juego limpio ante un esfuerzo físico demandante.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelea-de-cangrejos.webp", "objetivos_educativos": [{"id": "46d36119-8d9f-44f3-ae11-b9851a71eff1", "area": "Corporalidad", "texto": "Me preocupo por mi aspecto personal y porque mi cuerpo esté limpio.", "unidad": "Tropa", "como_se_cumple": "**Manteniendo** una postura adecuada e higiénica después del combate en cuatro apoyos invertido, preocupándome por lavar mis manos y sacudir mi ropa al finalizar la dinámica."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "unidad": "Tropa", "como_se_cumple": "**Evaluando** mis límites corporales de equilibrio, fuerza y flexibilidad al intentar derribar a mi contrincante en posición de cangrejo sin caer en la colchoneta."}, {"id": "273f60b8-7953-4416-97c3-e8c83615364f", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "unidad": "Compañía", "como_se_cumple": "**Ejercitando** mi musculatura central, piernas y brazos mientras mantengo la posición de cangrejo (boca arriba en cuatro apoyos) resistiendo el empuje de mi oponente."}, {"id": "c4fe900a-9641-4cad-a265-3f31073d83cb", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Compañía", "como_se_cumple": "**Manteniéndome** firme en mi convicción de jugar limpio en la lucha de cangrejos, incluso cuando la competencia sea muy reñida, asumiendo mis decisiones corporales con entereza."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelea-de-cangrejos.webp',
  'Los oponentes se colocan en posición de cuadrupedia invertida (boca arriba apoyados únicamente sobre las palmas de las manos y las plantas de los pies, sin que ...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'pelea-de-cangrejos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '46d36119-8d9f-44f3-ae11-b9851a71eff1', '**Manteniendo** una postura adecuada e higiénica después del combate en cuatro apoyos invertido, preocupándome por lavar mis manos y sacudir mi ropa al finalizar la dinámica.'
FROM public.articulos WHERE slug = 'pelea-de-cangrejos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', '**Evaluando** mis límites corporales de equilibrio, fuerza y flexibilidad al intentar derribar a mi contrincante en posición de cangrejo sin caer en la colchoneta.'
FROM public.articulos WHERE slug = 'pelea-de-cangrejos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '273f60b8-7953-4416-97c3-e8c83615364f', '**Ejercitando** mi musculatura central, piernas y brazos mientras mantengo la posición de cangrejo (boca arriba en cuatro apoyos) resistiendo el empuje de mi oponente.'
FROM public.articulos WHERE slug = 'pelea-de-cangrejos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'c4fe900a-9641-4cad-a265-3f31073d83cb', '**Manteniéndome** firme en mi convicción de jugar limpio en la lucha de cangrejos, incluso cuando la competencia sea muy reñida, asumiendo mis decisiones corporales con entereza.'
FROM public.articulos WHERE slug = 'pelea-de-cangrejos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Inserting activity: Pelea de Gallos
INSERT INTO public.articulos (id, titulo, slug, contenido, estado, metadata, autor_id, imagen_destacada, extracto)
VALUES (
  '2bd7353f-70b6-45b1-b852-b9953314c943',
  'Pelea de Gallos',
  'pelea-de-gallos',
  'Los dos competidores se colocan en cuclillas (con las rodillas dobladas, sin arrodillarse) dentro de un círculo o cuadrilátero delimitado en el suelo. Manteniendo los brazos flexionados y las manos abiertas, deben intentar empujar suavemente las manos o los hombros del rival para obligarlo a perder el equilibrio, obligándolo a apoyar las manos, rodillas o glúteos en el suelo o a salirse del cuadrante de combate.',
  'publicado',
  '{"areas": ["corporalidad", "carácter"], "lugares": ["Interior", "gimnasio"], "cantidad": "02 participantes", "duracion": "15 minutos", "unidades": ["tropa", "compania"], "objetivos": ["Conocer las capacidades corporales", "Estimular la agilidad", "Estimular la coordinación", "Fomentar la sana competencia"], "materiales": ["Colchonetas (opcional", "para mayor seguridad)", "Cuerdas para delimitar el cuadrilátero"], "variaciones": "Se puede realizar en formato de torneo de eliminación directa (duelos individuales rápidos) o en modalidad grupal donde varios \"gallos\" compiten todos contra todos en un espacio más amplio, ganando el último en mantenerse en pie y en cuclillas.", "recomendaciones": "Establecer reglas estrictas para evitar golpes directos, cabezazos, agarres de ropa o empujones en el rostro. El uso de colchonetas alrededor del área es altamente recomendable para amortiguar cualquier pérdida de equilibrio.", "justificacion_areas": "- **Corporalidad**: Promueve el dominio del cuerpo, el equilibrio dinámico, los reflejos y la fuerza en las piernas mediante el control corporal en posición de cuclillas.\n- **Carácter**: Desarrolla la resiliencia, la disciplina y el juego limpio al competir bajo reglas estrictas que exigen autocontrol físico para no lastimar al rival.", "imagen_destacada_url": "http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelea-de-gallos.webp", "objetivos_educativos": [{"id": "fb56310a-a9cf-46e3-9c34-c4643f6b9035", "area": "Corporalidad", "texto": "Respeto mi cuerpo y el de los demás.", "unidad": "Tropa", "como_se_cumple": "**Evitando** el uso de la fuerza desmedida o movimientos bruscos sobre mi oponente durante el combate en cuclillas, asegurando que ambos mantengamos la integridad física."}, {"id": "71413ac6-8ae9-4034-b580-e2f1c2f9f42c", "area": "Carácter", "texto": "Me esfuerzo cada vez más en superar mis defectos.", "unidad": "Tropa", "como_se_cumple": "**Controlando** la frustración si pierdo el equilibrio y felicitando a mi rival con madurez, esforzándome por jugar limpio en todo momento."}, {"id": "91473f71-9345-4bcf-bfc7-dea709d12361", "area": "Corporalidad", "texto": "Respeto mi cuerpo y el de los demás.", "unidad": "Compañía", "como_se_cumple": "**Controlando** mis empujones y cuidando de no realizar llaves o presiones indebidas que puedan lastimar a mi oponente en el círculo de combate."}, {"id": "075c93b1-81d2-4370-8e47-f0a4d086b20e", "area": "Carácter", "texto": "Sé lo que significa ser leal.", "unidad": "Compañía", "como_se_cumple": "**Jugando** bajo las reglas explícitas de la pelea de gallos, no utilizando trucos sucios ni ventajas indebidas y apoyando la honestidad mutua."}]}'::jsonb,
  'a158dbe1-5a8d-46b0-8105-4313125d746f', -- Default system admin/author
  'http://127.0.0.1:54321/storage/v1/object/public/articulos/blog/pelea-de-gallos.webp',
  'Los dos competidores se colocan en cuclillas (con las rodillas dobladas, sin arrodillarse) dentro de un círculo o cuadrilátero delimitado en el suelo. Mantenien...'
)
ON CONFLICT (slug) DO UPDATE SET 
  titulo = EXCLUDED.titulo,
  contenido = EXCLUDED.contenido,
  metadata = EXCLUDED.metadata,
  imagen_destacada = EXCLUDED.imagen_destacada,
  extracto = EXCLUDED.extracto;

INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7
FROM public.articulos WHERE slug = 'pelea-de-gallos'
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fb56310a-a9cf-46e3-9c34-c4643f6b9035', '**Evitando** el uso de la fuerza desmedida o movimientos bruscos sobre mi oponente durante el combate en cuclillas, asegurando que ambos mantengamos la integridad física.'
FROM public.articulos WHERE slug = 'pelea-de-gallos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '71413ac6-8ae9-4034-b580-e2f1c2f9f42c', '**Controlando** la frustración si pierdo el equilibrio y felicitando a mi rival con madurez, esforzándome por jugar limpio en todo momento.'
FROM public.articulos WHERE slug = 'pelea-de-gallos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '91473f71-9345-4bcf-bfc7-dea709d12361', '**Controlando** mis empujones y cuidando de no realizar llaves o presiones indebidas que puedan lastimar a mi oponente en el círculo de combate.'
FROM public.articulos WHERE slug = 'pelea-de-gallos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '075c93b1-81d2-4370-8e47-f0a4d086b20e', '**Jugando** bajo las reglas explícitas de la pelea de gallos, no utilizando trucos sucios ni ventajas indebidas y apoyando la honestidad mutua.'
FROM public.articulos WHERE slug = 'pelea-de-gallos'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;


-- Restore triggers in this session

SET session_replication_role = 'origin';

COMMIT;
