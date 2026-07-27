-- ====================================================================
-- INSERCIÓN: EL AMIGO SECRETO SCOUT
-- ====================================================================

DO $$
DECLARE
    v_autor_id UUID;
    v_articulo_id UUID;
    v_cat_padre_id INT := 1;  -- Actividades
    v_cat_hijo_id INT := 10;  -- Dinámicas
BEGIN
    -- 1. Obtener ID del usuario administrador
    SELECT id INTO v_autor_id FROM perfiles WHERE rol_id = 1 LIMIT 1;
    IF v_autor_id IS NULL THEN
        SELECT id INTO v_autor_id FROM perfiles LIMIT 1;
    END IF;

    -- 2. Insertar el artículo principal
    INSERT INTO public.articulos (
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
        v_autor_id,
        NULL, -- Exigencia de arquitectura: categoria_id siempre NULL en articulos
        'El Amigo Secreto Scout',
        'el-amigo-secreto-scout',
        '<h2>📜 Descripción de la Dinámica</h2><p><strong>El Amigo Secreto Scout</strong> es una vivencia fraterna de integración y afectividad diseñada para fortalecer los lazos de confianza, aprecio mutuo y observación atenta entre los integrantes de la unidad. A través de gestos anónimos de constante atención, compañerismo y cartas secretas redactadas con sincero afecto, los participantes aprenden a valorar las virtudes y cualidades únicas de cada uno de sus pares.</p><h2>🎲 ¿Cómo se juega?</h2><h3>1. Asignación Secreta</h3><p>Cada participante extrae al azar el nombre de un compañero de la unidad, quien se convertirá en su <strong>Amigo Secreto</strong>. El nombre asignado se mantiene en estricto secreto durante todo el ciclo de la dinámica.</p><h3>2. Observación Atenta y Acciones Fraternas</h3><p>Durante un período determinado (varios días de campamento o entre reuniones semanales), cada participante observa con atención las virtudes, fortalezas y momentos significativos de su amigo secreto, realizando pequeños actos anónimos de servicio (como dejar notas de aliento en su pañolín o mochila).</p>3. Redacción de la Carta Fraterna</h3><p>Al finalizar el período, cada scout escribe una carta personal detallando las cualidades positivas observadas, las virtudes demostradas en el grupo y palabras sinceras de aprecio scout.</p><h3>4. Revelación y Abrazo Scout</h3><p>En un ambiente cálido en torno a la fogata o al término de una reunión de unidad, cada participante lee su carta ante el grupo y revela la identidad de su amigo secreto con un fraterno abrazo scout.</p>',
        'Dinámica fraterna para desarrollar la confianza, el aprecio mutuo y la sociabilidad mediante la observación de virtudes y cartas secretas.',
        '/uploads/el-amigo-secreto-scout.webp',
        'publicado',
        ARRAY['juego', 'cooperativo', 'confianza', 'afectividad', 'sociabilidad', 'integracion'],
        '{
            "unidades": ["manada", "compañía", "tropa", "avanzada", "clan"],
            "duracion": "30 minutos",
            "cantidad": "Toda la Unidad",
            "lugares": ["Interior", "Exterior"],
            "materiales": ["Papel", "Lápices", "Sobres"],
            "areas": ["sociabilidad", "afectividad", "carácter"],
            "objetivos": [
                "Conocer a los demás",
                "Estimular la confianza",
                "Fomentar las relaciones interpersonales",
                "Reforzar lazos sociales"
            ],
            "justificacion_areas": "Esta dinámica ejercita de manera directa y profunda el área de Afectividad y Sociabilidad. Los participantes aprenden a mirar a sus pares con empatía y atención consciente, enfocándose en descubrir las virtudes y fortalezas de los demás en lugar de sus defectos. Esto fomenta un clima de pertenencia seguro, refuerza el carácter solidario y elimina barreras de exclusión en el grupo.",
            "variaciones": "<b>Variación Campamento:</b> Durante el campamento de verano, cada amigo secreto puede dejar pequeñas sorpresas anónimas en la tienda de su compañero (como flores de campo o notas de aliento).<br><b>Variación con Pañolín:</b> Al momento de la revelación, el amigo secreto coloca suavemente el pañolín sobre el hombro de su compañero como símbolo de fraternidad scout.",
            "recomendaciones": "<b>Rol de la Jefatura:</b> Asegurar que ningún participante quede sin amigo secreto y supervisar que las cartas resalten aspectos positivos, promoviendo siempre el respeto y la autoestima.<br><b>Ambiente Cálido:</b> Realizar el cierre en un círculo acogedor, permitiendo que cada participante exprese cómo se sintió al recibir y entregar las muestras de afecto.",
            "objetivos_educativos": [
                {
                    "unidad": "Manada",
                    "area": "Afectividad",
                    "rango_edad": "Infancia Media",
                    "texto_infantil": "Converso y comparto con todas las personas.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Conversando e interesándose de manera especial por su amigo secreto asignado, descubriendo sus cualidades positivas.",
                    "objetivo_id": "b39109f4-260d-46e2-9192-2db4de116b1b"
                },
                {
                    "unidad": "Manada",
                    "area": "Afectividad",
                    "rango_edad": "Infancia Tardía",
                    "texto_infantil": "Comparto con todos mis compañeros, sin importarme su raza, en qué trabajan sus papás, o si tienen o no dinero.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Acogiendo con entusiasmo a cualquier compañero que le haya tocado en el sorteo secreto, sin hacer distinciones.",
                    "objetivo_id": "b658a9a2-c0fb-4aec-b862-528eb90e07d1"
                },
                {
                    "unidad": "Compañía",
                    "area": "Afectividad",
                    "rango_edad": "11 a 13 años",
                    "texto_infantil": "Me intereso por las demás personas y soy generosa.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Demostrando generosidad y preocupación constante por las vivencias de su amiga secreta durante la dinámica.",
                    "objetivo_id": "1999e4c0-935b-4134-95be-92f01a5edf81"
                },
                {
                    "unidad": "Compañía",
                    "area": "Afectividad",
                    "rango_edad": "13 a 15 años",
                    "texto_infantil": "Aprecio a las personas por lo que son.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Expresando en la carta fraterna las virtudes auténticas de su compañera, valorándola por su esencia.",
                    "objetivo_id": "80ff5a70-cc39-4599-99b1-38aa13b44f49"
                },
                {
                    "unidad": "Tropa",
                    "area": "Afectividad",
                    "rango_edad": "11 a 13 años",
                    "texto_infantil": "Me intereso por los demás personas y soy generoso.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Observando atentamente las buenas acciones de su compañero para plasmarlas en su mensaje secreto.",
                    "objetivo_id": "70177516-c52f-4e19-8c59-32375c40eaac"
                },
                {
                    "unidad": "Tropa",
                    "area": "Afectividad",
                    "rango_edad": "13 a 15 años",
                    "texto_infantil": "Aprecio a las personas por lo que son.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Reconociendo abiertamente el valor de su hermano scout durante el momento de revelación.",
                    "objetivo_id": "037be973-3e1a-450c-a9f4-65d053aec372"
                },
                {
                    "unidad": "Avanzada",
                    "area": "Afectividad",
                    "rango_edad": "15 a 17 años",
                    "texto_infantil": "Comparto y defiendo el derecho de los demás a ser valorados por lo que son y no por lo que tienen.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Fomentando un ambiente de respeto profundo y valoración mutua en la comunidad de la avanzada.",
                    "objetivo_id": "edfc3452-910a-4b7b-bcc5-73628cf20c0a"
                },
                {
                    "unidad": "Clan",
                    "area": "Afectividad",
                    "rango_edad": "17 a 20 años",
                    "texto_infantil": "Construyo mi felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Viviendo la fraternidad scout como un servicio desinteresado de afecto y apoyo incondicional entre comperos de ruta.",
                    "objetivo_id": "39de3f68-3477-4c1f-8a29-170e914596d7"
                }
            ]
        }'::jsonb
    ) RETURNING id INTO v_articulo_id;

    -- 3. Vincular las categorías jerárquicas (Dinámicas -> Actividades)
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_hijo_id);
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_padre_id);

    RAISE NOTICE 'Artículo "El Amigo Secreto Scout" insertado con éxito con ID: %', v_articulo_id;
END $$;
