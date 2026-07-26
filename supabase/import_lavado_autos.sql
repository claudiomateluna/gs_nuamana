SET client_encoding = 'UTF8';

DO $$
DECLARE
  v_admin_id UUID;
  v_articulo_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM perfiles WHERE rol_id = 1 LIMIT 1;
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM perfiles LIMIT 1;
  END IF;

  DELETE FROM articulos WHERE slug = 'el-lavado-de-autos';

  v_articulo_id := uuid_generate_v4();

  INSERT INTO articulos (
    id,
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
    v_articulo_id,
    v_admin_id,
    NULL,
    'El Lavado de Autos',
    'el-lavado-de-autos',
    $html$<h2>📜 Descripción del Juego</h2>
<p><strong>El Lavado de Autos</strong> es una dinámica de expresión corporal, afirmación afectiva e integración grupal. Su objetivo es romper tensiones iniciales, fortalecer la autoestima y crear un clima de acogida positiva mediante el contacto físico fraterno y respetuoso entre los participantes.</p>

<hr>

<h3>🎲 ¿Cómo se juega?</h3>
<ol>
  <li><strong>Formación del Túnel:</strong> Los participantes se dividen en dos filas paralelas colocadas frente a frente, a un metro de distancia. El espacio entre las filas representa la cinta de un túnel automático de lavado de autos.</li>
  <li><strong>Asignación de Roles:</strong> Los jóvenes ubicados en las filas representan los "cepillos y rodillos" de la máquina de lavado. El primer participante de la fila es designado como el primer "auto".</li>
  <li><strong>El Recorrido del Auto:</strong> El "auto" avanza lentamente con los ojos cerrados o entreabiertos caminando por el medio de las filas. A su paso, sus compañeros le brindan de manera suave y respetuosa palmaditas de aliento, masajes suaves en los hombros y palabras motivadoras de bienvenida.</li>
  <li><strong>Rotación Continua:</strong> Al llegar al final del túnel, el "auto" se incorpora como el último rodillo de la máquina, y la siguiente persona de la cabecera inicia su recorrido como nuevo auto.</li>
  <li><strong>Reflexión Final:</strong> La dinámica concluye cuando todos los integrantes han sido "lavados". El grupo se sienta en círculo para compartir brevemente cómo se sintieron al recibir y dar afecto.</li>
</ol>$html$,
    'Una dinámica de integración y afirmación afectiva donde los participantes recorren un túnel fraterno recibiendo palmaditas y palabras de aliento.',
    '/uploads/actividad_lavadoAutos.webp',
    'publicado',
    ARRAY['dinamica', 'integracion', 'afectividad', 'confianza', 'autoestima'],
    $json${"unidades": ["manada", "compañía", "tropa", "avanzada"], "duracion": "15 minutos", "cantidad": "12 participantes", "lugares": ["Interior", "sala"], "materiales": ["Sin Materiales"], "areas": ["Afectividad", "Carácter", "Creatividad"], "objetivos": ["Facilitar el conocimiento entre los pares", "Fomentar un entorno de confianza", "Favorecer la comunicación en el grupo", "Crear un clima de pertenencia"], "justificacion_areas": "El Lavado de Autos estimula la afectividad al brindar un espacio seguro para dar y recibir muestras sinceras de afecto fraterno. Fortalece el carácter al afirmar la autoestima y autoimagen positiva de cada participante, y desarrolla la creatividad expresiva mediante la comunicación gestual y la dinamización del encuentro grupal.", "variaciones": "Lavado de Autos con Música Suave: Se utiliza una melodía relajante de fondo mientras los autos avanzan, permitiendo un ritmo pausado y profundo.\n\nTúnel de Palabras de Aliento: Al pasar el auto, los integrantes de las filas expresan en susurros cualidades positivas del participante (ej: \"eres alegre\", \"buen compañero\", \"valiente\").\n\nLavado de Velocidad Adaptada: Para manadas pequeñas, el túnel se realiza sentado en sillas donde el niño avanza en un carrito imaginario.", "recomendaciones": "Respeto Absoluto y Sensibilidad: La regla de oro es que el contacto físico debe ser siempre suave, cuidadoso y fraternal (palmaditas en la espalda, roce suave en hombros). Jamás se permiten empujones, cosquillas ni juegos rudos.\n\nParticipación Voluntaria: Si un integrante muestra timidez o incomodidad ante el contacto físico, se le permite ser \"operador del túnel\" o caminar acompañado por un dirigente sin forzar su espacio personal.\n\nEvaluación y Cierre Emocional: Dedicar siempre unos minutos al final para que los jóvenes verbalicen sus sensaciones. Esta evaluación es clave para desinhibir al grupo y consolidar la confianza mutua.", "objetivos_educativos": [{"id": "1dfddb9d-a4fc-4e9a-9e17-2db5963b519e", "area": "Afectividad", "texto": "Demuestro mi cariño a mis amigos y amigas.", "unidad": "Manada", "como_se_cumple": "Ofreciendo palmaditas y gestos de cariño respetuoso a mis compañeros de seisena al pasar por el túnel del lavado."}, {"id": "238d21b7-b08e-4a65-bd1a-847e70481ec7", "area": "Afectividad", "texto": "Expreso mis afectos sin timidez.", "unidad": "Manada", "como_se_cumple": "Participando con alegría y sin vergüenza al brindar y recibir las demostraciones de afecto del grupo."}, {"id": "6201a4e1-255d-4f10-a292-19e0aa755cd2", "area": "Afectividad", "texto": "Trato con afecto y respeto a mis compañeros de patrulla.", "unidad": "Tropa", "como_se_cumple": "Brindando contacto físico fraterno y respetuoso a cada participante de la patrulla."}, {"id": "714fb296-6d60-4cd7-9e6b-a25e982ae7bd", "area": "Afectividad", "texto": "Acepto y agradezco las manifestaciones de afecto de los demás.", "unidad": "Tropa", "como_se_cumple": "Recibiendo con gratitud la acogida positiva de mis compañeros al recorrer la fila."}, {"id": "719ac6f0-d944-4861-abdf-f1d2df0fbe3d", "area": "Afectividad", "texto": "Trato con afecto y respeto a mis compañeras de patrulla.", "unidad": "Compañía", "como_se_cumple": "Expresando muestras de afecto sinceras y cuidadosas a las integrantes de mi patrulla."}, {"id": "7080b06b-ae23-455b-b9d9-bb5fc0344d67", "area": "Afectividad", "texto": "Acepto y agradezco las manifestaciones de afecto de las demás.", "unidad": "Compañía", "como_se_cumple": "Disfrutando el reconocimiento y las palabras estimulantes brindadas por mis compañeras."}, {"id": "6ee93d2a-463a-44aa-ba00-a08b6cb65f12", "area": "Afectividad", "texto": "Expreso mis emociones espontáneamente sin herir a los demás.", "unidad": "Avanzada", "como_se_cumple": "Manifestando mis sentimientos y empatía abiertamente para fortalecer el clima de confianza de la comunidad."}, {"id": "234edbf2-4113-43bd-bd5a-939e6a00c7ee", "area": "Carácter", "texto": "Sé lo que hago bien y lo que me cuesta más trabajo.", "unidad": "Manada", "como_se_cumple": "Reconociéndome como un integrante valioso de la Manada al ser acogido alegremente por mis pares."}, {"id": "6dfecf14-998f-4ed7-94d0-406bbbfdcf8c", "area": "Carácter", "texto": "Reconozco mis virtudes y defectos y me acepto como soy.", "unidad": "Manada", "como_se_cumple": "Sintiéndome seguro y querido por la seisena durante la evaluación y cierre de la dinámica."}, {"id": "a3666d92-23f2-452f-bd02-c36b85d3b0e3", "area": "Carácter", "texto": "Sé cuáles son mis habilidades y fortalezas y me alegra compartirlas.", "unidad": "Tropa", "como_se_cumple": "Afirmando mi autoestima y confianza personal al integrarme en la fila del grupo."}, {"id": "c830eb8e-6883-4a1e-ab22-267faec826c7", "area": "Carácter", "texto": "Acepto de buen modo los elogios y las críticas constructivas.", "unidad": "Tropa", "como_se_cumple": "Aceptando con madurez y alegría las expresiones de aprecio de los demás participantes."}, {"id": "531ff7eb-c46b-47e2-aa66-c958db8ca8ec", "area": "Carácter", "texto": "Sé cuáles son mis habilidades y fortalezas y me alegra compartirlas.", "unidad": "Compañía", "como_se_cumple": "Fortaleciendo mi sentido de pertenencia y valoración propia ante la patrulla de guías."}, {"id": "2475e63a-2a1c-43f1-bd1c-a111b7dfb8ab", "area": "Carácter", "texto": "Acepto de buen modo los elogios y las críticas constructivas.", "unidad": "Compañía", "como_se_cumple": "Valorando las demostraciones de estima como un impulso para mi crecimiento personal."}, {"id": "061d4bf6-d3a9-46aa-ac8a-a82f3fb0aee5", "area": "Carácter", "texto": "Mantengo una alta valoración de mí mismo reconociendo mis áreas de desarrollo.", "unidad": "Avanzada", "como_se_cumple": "Consolidando mi autoimagen positiva y seguridad personal en el entorno caminante."}, {"id": "85f2ee37-e547-4e78-95ed-f6ea49aef50f", "area": "Creatividad", "texto": "Expreso mis alegrías y sentimientos con mis compañeros de seisena.", "unidad": "Manada", "como_se_cumple": "Expresando sonrisas y gestos espontáneos durante la recreación del túnel de lavado."}, {"id": "f1604a11-5dc0-4bce-bdfd-bf58aa0dc1bd", "area": "Creatividad", "texto": "Me gusta expresar lo que siento mediante gestos, palabras y dinámicas grupales.", "unidad": "Manada", "como_se_cumple": "Comunicando mi estado de ánimo alegre mediante el lenguaje corporal del juego."}, {"id": "cbbfaec6-c73d-4c31-8931-df1316eeb586", "area": "Creatividad", "texto": "Manifiesto mis opiniones y afectos de forma transparente en el grupo.", "unidad": "Tropa", "como_se_cumple": "Compartiendo de forma natural y transparente mis emociones al finalizar la rueda de lavado."}, {"id": "5b6cbe7d-3eb1-46ab-85fa-7f89218df9df", "area": "Creatividad", "texto": "Contribuyo a crear un ambiente alegre y acogedor en la patrulla.", "unidad": "Tropa", "como_se_cumple": "Dinamizando la actividad con entusiasmo para que todos se sientan acogidos."}, {"id": "1096a6ff-93bb-4ae3-9d0d-13bbbe35b7fa", "area": "Creatividad", "texto": "Manifiesto mis opiniones y afectos de forma transparente en el grupo.", "unidad": "Compañía", "como_se_cumple": "Fomentando un canal de comunicación afectuoso entre las integrantes de la patrulla."}, {"id": "93292437-0cf7-4f6c-b3a5-faef93e0b2cf", "area": "Creatividad", "texto": "Contribuyo a crear un ambiente alegre y acogedor en la patrulla.", "unidad": "Compañía", "como_se_cumple": "Aportando calidez y empatía para desinhibir y motivar a las compañeras."}, {"id": "91e60eba-e267-4d1a-b27b-ef61a7b03b31", "area": "Creatividad", "texto": "Expreso lo que pienso y siento creando espacios gratos que faciliten el encuentro fraterno.", "unidad": "Avanzada", "como_se_cumple": "Generando un clima de distensión y encuentro auténtico al inicio de las sesiones de la comunidad."}]}$json$::jsonb
  );

  -- Categoría Hija: Dinámicas (ID: 10), Categoría Padre: Actividades (ID: 1)
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 10) ON CONFLICT DO NOTHING;
  INSERT INTO articulo_categorias (articulo_id, categoria_id) VALUES (v_articulo_id, 1) ON CONFLICT DO NOTHING;

END $$;
