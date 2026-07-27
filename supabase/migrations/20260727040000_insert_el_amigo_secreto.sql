-- ====================================================================
-- MIGRACIÓN DEFINTIVA: EL AMIGO SECRETO SCOUT (CAMPOS 'texto' Y 'color' INCLUIDOS EN JSON)
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
                    "texto": "Trato con cariño a los demás en la Manada y me gusta que me traten igual.",
                    "texto_infantil": "Trato con cariño a los demás en la Manada y me gusta que me traten igual.",
                    "texto_terminal": "Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.",
                    "como_se_cumple": "Demostrando cariño y afecto sincero hacia su amigo secreto mediante notas de aliento.",
                    "color": "#f6c812",
                    "objetivo_id": "ab6e594f-b0a0-4e6d-96aa-7779299b02ef"
                },
                {
                    "unidad": "Manada",
                    "area": "Sociabilidad",
                    "rango_edad": "Infancia Media",
                    "texto": "Comparto lo que tengo con mis compañeros y compañeras.",
                    "texto_infantil": "Comparto lo que tengo con mis compañeros y compañeras.",
                    "texto_terminal": "Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.",
                    "como_se_cumple": "Compartiendo gestos de atención y pequeños detalles anónimos con su amigo secreto.",
                    "color": "#f6c812",
                    "objetivo_id": "59a7750e-a71e-4b25-a59c-c9594d5f2e0a"
                },
                {
                    "unidad": "Manada",
                    "area": "Carácter",
                    "rango_edad": "Infancia Media",
                    "texto": "He aprendido que en las cosas que hago con mis compañeros debo cumplir la Ley de la Manada.",
                    "texto_infantil": "He aprendido que en las cosas que hago con mis compañeros debo cumplir la Ley de la Manada.",
                    "texto_terminal": "Actúa consecuentemente con los valores que lo inspiran.",
                    "como_se_cumple": "Cumpliendo con alegría la Ley de la Manada al brindar afecto y lealtad a su compañero.",
                    "color": "#f6c812",
                    "objetivo_id": "7719fbc7-1335-430c-abce-530188ea6873"
                },
                {
                    "unidad": "Compañía",
                    "area": "Afectividad",
                    "rango_edad": "11 a 13 años",
                    "texto": "Me intereso por las demás personas y soy generosa.",
                    "texto_infantil": "Me intereso por las demás personas y soy generosa.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Demostrando generosidad y preocupación constante por las vivencias de su amiga secreta durante la dinámica.",
                    "color": "#3fb34a",
                    "objetivo_id": "1999e4c0-935b-4134-95be-92f01a5edf81"
                },
                {
                    "unidad": "Compañía",
                    "area": "Sociabilidad",
                    "rango_edad": "11 a 13 años",
                    "texto": "Conozco y respeto las principales normas de convivencia.",
                    "texto_infantil": "Conozco y respeto las principales normas de convivencia.",
                    "texto_terminal": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.",
                    "como_se_cumple": "Construyendo un ambiente de convivencia respetuoso e integrador en la patrulla.",
                    "color": "#3fb34a",
                    "objetivo_id": "007e85ea-2b06-48c2-8ac1-873d59643aae"
                },
                {
                    "unidad": "Compañía",
                    "area": "Carácter",
                    "rango_edad": "11 a 13 años",
                    "texto": "Escucho las críticas que me hacen los demás y reflexiono sobre ellas.",
                    "texto_infantil": "Escucho las críticas que me hacen los demás y reflexiono sobre ellas.",
                    "texto_terminal": "Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.",
                    "como_se_cumple": "Asumiendo una actitud madura y honesta al expresar el aprecio por sus pares.",
                    "color": "#3fb34a",
                    "objetivo_id": "3a35ddd8-f6dc-4e00-a04d-107a0825bd99"
                },
                {
                    "unidad": "Tropa",
                    "area": "Afectividad",
                    "rango_edad": "11 a 13 años",
                    "texto": "Me intereso por los demás personas y soy generoso.",
                    "texto_infantil": "Me intereso por los demás personas y soy generoso.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Observando atentamente las buenas acciones de su compañero para plasmarlas en su mensaje secreto.",
                    "color": "#2b7fff",
                    "objetivo_id": "70177516-c52f-4e19-8c59-32375c40eaac"
                },
                {
                    "unidad": "Tropa",
                    "area": "Sociabilidad",
                    "rango_edad": "11 a 13 años",
                    "texto": "Conozco y respeto las principales normas de convivencia.",
                    "texto_infantil": "Conozco y respeto las principales normas de convivencia.",
                    "texto_terminal": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.",
                    "como_se_cumple": "Fomentando la integración y el compañerismo dentro del pequeño grupo.",
                    "color": "#2b7fff",
                    "objetivo_id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad"
                },
                {
                    "unidad": "Tropa",
                    "area": "Carácter",
                    "rango_edad": "11 a 13 años",
                    "texto": "Contribuyo al ambiente de alegría de mi Tropa.",
                    "texto_infantil": "Contribuyo al ambiente de alegría de mi Tropa.",
                    "texto_terminal": "Enfrenta la vida con alegría y sentido del humor.",
                    "como_se_cumple": "Fortaleciendo su compromiso con los valores scouts al destacar el bien en los demás.",
                    "color": "#2b7fff",
                    "objetivo_id": "73b20cb5-9d12-46ba-96b1-53613aa8c58c"
                },
                {
                    "unidad": "Avanzada",
                    "area": "Afectividad",
                    "rango_edad": "15 a 17 años",
                    "texto": "Comparto y defiendo el derecho de los demás a ser valorados por lo que son y no por lo que tienen.",
                    "texto_infantil": "Comparto y defiendo el derecho de los demás a ser valorados por lo que son y no por lo que tienen.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Fomentando la empatía y la valoración auténtica de cada integrante de la avanzada.",
                    "color": "#f39c12",
                    "objetivo_id": "edfc3452-910a-4b7b-bcc5-73628cf20c0a"
                },
                {
                    "unidad": "Avanzada",
                    "area": "Sociabilidad",
                    "rango_edad": "15 a 17 años",
                    "texto": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.",
                    "texto_infantil": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.",
                    "texto_terminal": "Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.",
                    "como_se_cumple": "Promoviendo activamente la solidaridad y el respeto de los derechos de todos.",
                    "color": "#f39c12",
                    "objetivo_id": "007591fb-a2b6-4fb5-9286-acde65455f53"
                },
                {
                    "unidad": "Avanzada",
                    "area": "Carácter",
                    "rango_edad": "15 a 17 años",
                    "texto": "Reconozco en mi Avanzada una comunidad de vida y acepto las críticas y recomendaciones que mis compañeros y compañeras me hacen.",
                    "texto_infantil": "Reconozco en mi Avanzada una comunidad de vida y acepto las críticas y recomendaciones que mis compañeros y compañeras me hacen.",
                    "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                    "como_se_cumple": "Orientando sus acciones con coherencia y liderazgo positivo hacia su comunidad.",
                    "color": "#f39c12",
                    "objetivo_id": "cd69934e-f0e0-47b7-b0eb-447884b615c6"
                },
                {
                    "unidad": "Clan",
                    "area": "Afectividad",
                    "rango_edad": "17 a 20 años",
                    "texto": "Construyo mi felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "texto_infantil": "Construyo mi felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "texto_terminal": "Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.",
                    "como_se_cumple": "Viviendo la fraternidad scout como un servicio desinteresado de afecto y apoyo mutuo.",
                    "color": "#cb3327",
                    "objetivo_id": "39de3f68-3477-4c1f-8a29-170e914596d7"
                },
                {
                    "unidad": "Clan",
                    "area": "Sociabilidad",
                    "rango_edad": "17 a 20 años",
                    "texto": "Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.",
                    "texto_infantil": "Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.",
                    "texto_terminal": "Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.",
                    "como_se_cumple": "Contribuyendo a crear un ambiente comunitario justo, participativo y fraterno.",
                    "color": "#cb3327",
                    "objetivo_id": "b5a81328-5c07-41bd-a1ea-1ed401762841"
                },
                {
                    "unidad": "Clan",
                    "area": "Carácter",
                    "rango_edad": "17 a 20 años",
                    "texto": "Reconozco en mi grupo de pertenencia un apoyo para mi crecimiento personal y para la realización de mi proyecto de vida.",
                    "texto_infantil": "Reconozco en mi grupo de pertenencia un apoyo para mi crecimiento personal y para la realización de mi proyecto de vida.",
                    "texto_terminal": "Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.",
                    "como_se_cumple": "Guiando su vida con criterio propio, coherencia ética y servicio al prójimo.",
                    "color": "#cb3327",
                    "objetivo_id": "8f0eb7d9-c291-44f3-9551-4330c19e0cc2"
                }
            ]
        }'::jsonb
    ) RETURNING id INTO v_articulo_id;

    -- 3. Vincular las categorías jerárquicas (Dinámicas -> Actividades)
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_hijo_id);
    INSERT INTO public.articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, v_cat_padre_id);

    RAISE NOTICE 'Artículo "El Amigo Secreto Scout" actualizado exitosamente con campos texto y color';
END $$;
