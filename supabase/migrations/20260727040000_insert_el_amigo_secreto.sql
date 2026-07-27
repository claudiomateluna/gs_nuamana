-- ====================================================================
-- MIGRACIÓN COMPLETA: EL AMIGO SECRETO SCOUT (CON 3 ÁREAS Y OBJETIVOS COMPLETOS)
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

    -- Eliminar versión previa si existe para reinserción limpia
    DELETE FROM public.articulos WHERE slug = 'el-amigo-secreto-scout';

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
        ARRAY['juego', 'cooperativo', 'confianza', 'afectividad', 'sociabilidad', 'caracter', 'integracion'],
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
            "justificacion_areas": "Esta dinámica ejercita de manera directa y profunda tres áreas clave del desarrollo scout:\n1. **Afectividad:** Permite a los participantes expresar aprecio sincero y afecto desinteresado por sus pares mediante cartas y notas anónimas, fortaleciendo la autoestima y la salud emocional.\n2. **Sociabilidad:** Promueve la integración fraterna y el derribo de barreras de exclusión en la unidad, enseñando a valorar la convivencia, el respeto por las normas de grupo y los lazos sociales.\n3. **Carácter:** Desarrolla la empatía, la perseverancia en la atención discreta a los demás, la honestidad y la madurez personal para reconocer y felicitar las virtudes ajenas sin buscar protagonismo personal.",
            "variaciones": "<b>Variación Campamento:</b> Durante el campamento de verano, cada amigo secreto puede dejar pequeñas sorpresas anónimas en la tienda de su compañero (como flores de campo o notas de aliento).<br><b>Variación con Pañolín:</b> Al momento de la revelación, el amigo secreto coloca suavemente el pañolín sobre el hombro de su compañero como símbolo de fraternidad scout.",
            "recomendaciones": "<b>Rol de la Jefatura:</b> Asegurar que ningún participante quede sin amigo secreto y supervisar que las cartas resalten aspectos positivos, promoviendo siempre el respeto y la autoestima.<br><b>Ambiente Cálido:</b> Realizar el cierre en un círculo acogedor, permitiendo que cada participante exprese cómo se sintió al recibir y entregar las muestras de afecto.",
            "objetivos_educativos": [
                {
                                "unidad": "Manada",
                                "area": "Afectividad",
                                "rango_edad": "Infancia Media",
                                "texto_infantil": "Trato con cariño a los demás en la Manada y me gusta que me traten igual.",
                                "texto_terminal": "Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.",
                                "como_se_cumple": "Demostrando cariño y afecto sincero hacia su amigo secreto mediante notas de aliento.",
                                "objetivo_id": "ab6e594f-b0a0-4e6d-96aa-7779299b02ef"
                },
                {
                                "unidad": "Manada",
                                "area": "Sociabilidad",
                                "rango_edad": "Infancia Media",
                                "texto_infantil": "Sé cuáles son los países americanos.",
                                "texto_terminal": "Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.",
                                "como_se_cumple": "Participando alegremente con todos sus compañeros de la Manada sin hacer distinción.",
                                "objetivo_id": "85d5cef4-2483-4b79-a1e1-b7117f60fdc2"
                },
                {
                                "unidad": "Manada",
                                "area": "Carácter",
                                "rango_edad": "Infancia Media",
                                "texto_infantil": "Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Reconociendo con entusiasmo las buenas acciones y virtudes de su compañero.",
                                "objetivo_id": "99c6e695-ef0b-4e36-956b-3faf15ada355"
                },
                {
                                "unidad": "Compañía",
                                "area": "Afectividad",
                                "rango_edad": "11 a 13 años",
                                "texto_infantil": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.",
                                "texto_terminal": "Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.",
                                "como_se_cumple": "Valorando a su amiga secreta por su esencia y virtudes personales.",
                                "objetivo_id": "818d8a25-549b-4e01-a830-e50d73e39025"
                },
                {
                                "unidad": "Compañía",
                                "area": "Sociabilidad",
                                "rango_edad": "11 a 13 años",
                                "texto_infantil": "Trabajo con las demás personas para lograr las metas que nos hemos propuesto.",
                                "texto_terminal": "Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.",
                                "como_se_cumple": "Construyendo un ambiente de convivencia respetuoso e integrador en la patrulla.",
                                "objetivo_id": "d737dfda-2d8d-4ca8-b650-8612d90b434e"
                },
                {
                                "unidad": "Compañía",
                                "area": "Carácter",
                                "rango_edad": "11 a 13 años",
                                "texto_infantil": "Escucho las críticas que me hacen los demás y reflexiono sobre ellas.",
                                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                                "como_se_cumple": "Asumiendo una actitud madura y honesta al expresar el aprecio por sus pares.",
                                "objetivo_id": "3a35ddd8-f6dc-4e00-a04d-107a0825bd99"
                },
                {
                                "unidad": "Tropa",
                                "area": "Afectividad",
                                "rango_edad": "11 a 13 años",
                                "texto_infantil": "Me gusta querer y que me quieran.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Expresando fraternalmente su aprecio y respeto hacia las cualidades de su hermano scout.",
                                "objetivo_id": "e4184d1a-67af-43c4-a7d6-9ece26430f05"
                },
                {
                                "unidad": "Tropa",
                                "area": "Sociabilidad",
                                "rango_edad": "11 a 13 años",
                                "texto_infantil": "Conozco los principales productos propios de la cultura de mi país.",
                                "texto_terminal": "Hace suyos los valores de su país, su pueblo y su cultura.",
                                "como_se_cumple": "Fomentando la integración y el compañerismo dentro del pequeño grupo.",
                                "objetivo_id": "2dc9c7fe-979a-47c8-8008-fd2d11016a18"
                },
                {
                                "unidad": "Tropa",
                                "area": "Carácter",
                                "rango_edad": "11 a 13 años",
                                "texto_infantil": "Contribuyo al ambiente de alegría de mi Tropa.",
                                "texto_terminal": "Enfrenta la vida con alegría y sentido del humor.",
                                "como_se_cumple": "Fortaleciendo su compromiso con los valores scouts al destacar el bien en los demás.",
                                "objetivo_id": "73b20cb5-9d12-46ba-96b1-53613aa8c58c"
                },
                {
                                "unidad": "Avanzada",
                                "area": "Afectividad",
                                "rango_edad": "15 a 17 años",
                                "texto_infantil": "Participo en actividades destinadas a obtener igualdad de derechos y oportunidades para las personas.",
                                "texto_terminal": "Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.",
                                "como_se_cumple": "Fomentando la empatía y la valoración auténtica de cada integrante de la avanzada.",
                                "objetivo_id": "f2e77c12-e433-48c0-96a4-ab06745cec2b"
                },
                {
                                "unidad": "Avanzada",
                                "area": "Sociabilidad",
                                "rango_edad": "15 a 17 años",
                                "texto_infantil": "Cuando me corresponde ejercer autoridad lo hago sin autoritarismo ni abusos.",
                                "texto_terminal": "Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.",
                                "como_se_cumple": "Promoviendo activamente la solidaridad y el respeto de los derechos de todos.",
                                "objetivo_id": "6d98798f-014d-4bb3-940f-b0c038c6dbbb"
                },
                {
                                "unidad": "Avanzada",
                                "area": "Carácter",
                                "rango_edad": "15 a 17 años",
                                "texto_infantil": "Renuevo mi compromiso con el Movimiento.",
                                "texto_terminal": "Construye su proyecto de vida en base a los valores de la Ley y la Promesa Guía y Scout.",
                                "como_se_cumple": "Orientando sus acciones con coherencia y liderazgo positivo hacia su comunidad.",
                                "objetivo_id": "cd69934e-f0e0-47b7-b0eb-447884b615c6"
                },
                {
                                "unidad": "Clan",
                                "area": "Afectividad",
                                "rango_edad": "17 a 20 años",
                                "texto_infantil": "Conozco, acepto y respeto mi sexualidad y la del sexo complementario como expresión del amor.",
                                "texto_terminal": "Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.",
                                "como_se_cumple": "Viviendo la fraternidad scout como un servicio desinteresado de afecto y apoyo mutuo.",
                                "objetivo_id": "7c785c59-5116-455b-adc1-550937b56b42"
                },
                {
                                "unidad": "Clan",
                                "area": "Sociabilidad",
                                "rango_edad": "17 a 20 años",
                                "texto_infantil": "Hago míos los valores de mi país, mi pueblo y mi cultura.",
                                "texto_terminal": "Hace suyos los valores de su país, su pueblo y su cultura.",
                                "como_se_cumple": "Contribuyendo a crear un ambiente comunitario justo, participativo y fraterno.",
                                "objetivo_id": "3c89c7ee-5827-4002-9c1d-76bd26bae6fa"
                },
                {
                                "unidad": "Clan",
                                "area": "Carácter",
                                "rango_edad": "17 a 20 años",
                                "texto_infantil": "Conozco mis posibilidades y limitaciones, aceptándome con capacidad de autocrítica y manteniendo a la vez una buena imagen de mí mismo.",
                                "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                                "como_se_cumple": "Guíando su vida con criterio propio, coherencia ética y servicio al prójimo.",
                                "objetivo_id": "8f0eb7d9-c291-44f3-9551-4330c19e0cc2"
                }
]
        }'::jsonb
    ) RETURNING id INTO v_articulo_id;

    -- 3. Vincular las categorías jerárquicas (Dinámicas -> Actividades)
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_hijo_id);
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_padre_id);

    RAISE NOTICE 'Artículo "El Amigo Secreto Scout" actualizado exitosamente con 3 áreas e id de objetivos completos';
END $$;
