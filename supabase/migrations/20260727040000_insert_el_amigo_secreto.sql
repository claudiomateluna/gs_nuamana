-- ====================================================================
-- MIGRACIÓN ESTÁNDAR IDÉNTICA A LOS DEMÁS ARTÍCULOS DE NUAMANA: EL AMIGO SECRETO SCOUT
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

    -- Eliminar versión previa para reinserción totalmente limpia
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
                                "texto": "Converso y comparto con todas las personas.",
                                "texto_infantil": "Converso y comparto con todas las personas.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Conversando y compartiendo mi alegría con todos mis compañeros de la Manada sin hacer distinción.",
                                "objetivo_id": "b39109f4-260d-46e2-9192-2db4de116b1b"
                },
                {
                                "unidad": "Manada",
                                "area": "Afectividad",
                                "rango_edad": "Infancia Tardía",
                                "texto": "Comparto con todos mis compañeros, sin importarme su raza, en qué trabajan sus papás, o si tienen o no dinero.",
                                "texto_infantil": "Comparto con todos mis compañeros, sin importarme su raza, en qué trabajan sus papás, o si tienen o no dinero.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Acogiendo con entusiasmo a cualquier compañero que me haya tocado en el sorteo de la Manada.",
                                "objetivo_id": "b658a9a2-c0fb-4aec-b862-528eb90e07d1"
                },
                {
                                "unidad": "Compañía",
                                "area": "Afectividad",
                                "rango_edad": "11 a 13 años",
                                "texto": "Me intereso por las demás personas y soy generosa.",
                                "texto_infantil": "Me intereso por las demás personas y soy generosa.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Demostrando mi generosidad y preocupación constante por las vivencias de mi amiga secreta.",
                                "objetivo_id": "1999e4c0-935b-4134-95be-92f01a5edf81"
                },
                {
                                "unidad": "Compañía",
                                "area": "Afectividad",
                                "rango_edad": "13 a 15 años",
                                "texto": "Aprecio a las personas por lo que son.",
                                "texto_infantil": "Aprecio a las personas por lo que son.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Expresando en mi carta fraterna las virtudes auténticas de mi compañera de patrulla.",
                                "objetivo_id": "80ff5a70-cc39-4599-99b1-38aa13b44f49"
                },
                {
                                "unidad": "Tropa",
                                "area": "Afectividad",
                                "rango_edad": "11 a 13 años",
                                "texto": "Me intereso por los demás personas y soy generoso.",
                                "texto_infantil": "Me intereso por los demás personas y soy generoso.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Observando atentamente las buenas acciones de mi hermano scout para destacarlas en mi mensaje secreto.",
                                "objetivo_id": "70177516-c52f-4e19-8c59-32375c40eaac"
                },
                {
                                "unidad": "Tropa",
                                "area": "Afectividad",
                                "rango_edad": "13 a 15 años",
                                "texto": "Estoy siempre dispuesto a ayudar a mis compañeros de patrulla.",
                                "texto_infantil": "Estoy siempre dispuesto a ayudar a mis compañeros de patrulla.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Brindando mi ayuda desinteresada y servicio diario a mis compañeros durante el campamento.",
                                "objetivo_id": "28433366-23af-4d9a-a8c6-fbca64ef0c95"
                },
                {
                                "unidad": "Avanzada",
                                "area": "Afectividad",
                                "rango_edad": "15 a 17 años",
                                "texto": "Comparto y defiendo el derecho de los demás a ser valorados por lo que son y no por lo que tienen.",
                                "texto_infantil": "Comparto y defiendo el derecho de los demás a ser valorados por lo que son y no por lo que tienen.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Defendiendo el respeto mutuo y la valoración auténtica entre todos los integrantes de mi avanzada.",
                                "objetivo_id": "edfc3452-910a-4b7b-bcc5-73628cf20c0a"
                },
                {
                                "unidad": "Clan",
                                "area": "Afectividad",
                                "rango_edad": "17 a 20 años",
                                "texto": "Construyo mi felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "texto_infantil": "Construyo mi felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                                "como_se_cumple": "Viviendo la fraternidad scout como un servicio desinteresado de afecto y apoyo incondicional.",
                                "objetivo_id": "39de3f68-3477-4c1f-8a29-170e914596d7"
                },
                {
                                "unidad": "Manada",
                                "area": "Carácter",
                                "rango_edad": "Infancia Media",
                                "texto": "Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.",
                                "texto_infantil": "Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Escuchando con atención y afecto a los demás lobatos durante el círculo de revelación.",
                                "objetivo_id": "99c6e695-ef0b-4e36-956b-3faf15ada355"
                },
                {
                                "unidad": "Manada",
                                "area": "Carácter",
                                "rango_edad": "Infancia Tardía",
                                "texto": "Me llevo bien con todos los lobatos de la Manada.",
                                "texto_infantil": "Me llevo bien con todos los lobatos de la Manada.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Promoviendo el buen trato y la amistad fraterna con todos los lobatos de mi seisenas.",
                                "objetivo_id": "6b8c5fb5-6730-4c61-a332-2a7e6033bd94"
                },
                {
                                "unidad": "Compañía",
                                "area": "Carácter",
                                "rango_edad": "11 a 13 años",
                                "texto": "Aprecio los consejos que me dan en mi patrulla.",
                                "texto_infantil": "Aprecio los consejos que me dan en mi patrulla.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Apreciando las palabras de aliento y reflexiones compartidas por mis compañeras.",
                                "objetivo_id": "81cd6596-30cd-40fe-83e8-c86bf12a21f2"
                },
                {
                                "unidad": "Compañía",
                                "area": "Carácter",
                                "rango_edad": "13 a 15 años",
                                "texto": "Ayudo a mis compañeras de patrulla a superarse.",
                                "texto_infantil": "Ayudo a mis compañeras de patrulla a superarse.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Ayudando discretamente a mis compañeras de patrulla a destacar sus fortalezas personales.",
                                "objetivo_id": "0da6c9df-7a09-44cd-9961-e06c0173d41a"
                },
                {
                                "unidad": "Tropa",
                                "area": "Carácter",
                                "rango_edad": "11 a 13 años",
                                "texto": "Aprecio los consejos que me dan en mi patrulla.",
                                "texto_infantil": "Aprecio los consejos que me dan en mi patrulla.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Recibiendo con humildad y madurez las opiniones positivas de mis hermanos scouts.",
                                "objetivo_id": "0969a204-e8c6-4ab6-ac4f-c777bae066df"
                },
                {
                                "unidad": "Tropa",
                                "area": "Carácter",
                                "rango_edad": "13 a 15 años",
                                "texto": "Ayudo a mis compañeros de patrulla a superarse.",
                                "texto_infantil": "Ayudo a mis compañeros de patrulla a superarse.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Motivando a mis compañeros de patrulla a superar sus dificultades mediante gestos solidarios.",
                                "objetivo_id": "f608eb2d-613a-477a-86f9-03e769a87bf2"
                },
                {
                                "unidad": "Avanzada",
                                "area": "Carácter",
                                "rango_edad": "15 a 17 años",
                                "texto": "Reconozco en mi Avanzada una comunidad de vida y acepto las críticas y recomendaciones que mis compañeros y compañeras me hacen.",
                                "texto_infantil": "Reconozco en mi Avanzada una comunidad de vida y acepto las críticas y recomendaciones que mis compañeros y compañeras me hacen.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Reconociendo en mi avanzada un espacio seguro de crecimiento y valoración personal.",
                                "objetivo_id": "db877208-738b-4e2e-bcbc-591331f75703"
                },
                {
                                "unidad": "Clan",
                                "area": "Carácter",
                                "rango_edad": "17 a 20 años",
                                "texto": "Reconozco en mi grupo de pertenencia un apoyo para mi crecimiento personal y para la realización de mi proyecto de vida.",
                                "texto_infantil": "Reconozco en mi grupo de pertenencia un apoyo para mi crecimiento personal y para la realización de mi proyecto de vida.",
                                "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                                "como_se_cumple": "Encontrando en la comunidad de clan el testimonio fraterno para fortalecer mi proyecto de vida.",
                                "objetivo_id": "8df0eaed-f805-4347-881d-3d5fac18c8a5"
                }
]
        }'::jsonb
    ) RETURNING id INTO v_articulo_id;

    -- 3. Vincular las categorías jerárquicas (Dinámicas -> Actividades)
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_hijo_id);
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_padre_id);

    RAISE NOTICE 'Artículo "El Amigo Secreto Scout" actualizado removiendo la propiedad color para ser 100 por ciento idéntico al resto del sitio';
END $$;
