-- Add ciclo_data and simbolos_data JSONB columns to unidades table
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS ciclo_data jsonb;
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS simbolos_data jsonb;

-- Seed default colors (including background and hero gradient), ciclo_data and simbolos_data for Manada (ID 1)
UPDATE unidades SET
  colores = jsonb_build_object(
    'primario', COALESCE(colores->>'primario', '#f5cd16'),
    'secundario', COALESCE(colores->>'secundario', '#2b2c77'),
    'fondo', '#fffdf0',
    'fondo_oscuro', '#121324',
    'hero_gradient_from', 'rgba(43, 44, 119, 0.95)',
    'hero_gradient_via', 'rgba(43, 44, 119, 0.8)',
    'hero_gradient_to', 'rgba(245, 205, 22, 0.4)'
  ),
  ciclo_data = COALESCE(ciclo_data, '{
    "titulo": "Las Cacerías de la Manada",
    "subtitulo": "El Ciclo de Programa en la Rama Lobatos",
    "descripcion": "Es un proyecto de corta duración estructurado a partir del juego y el marco simbólico. Toda la Manada participa activamente aportando ideas, eligiendo la cacería de forma democrática y asumiendo roles en las seisenas.",
    "fases": [
      { "nombre": "Planificación", "descripcion": "La Manada se reúne en el Cubil para proponer y votar las cacerías del ciclo." },
      { "nombre": "Preparación", "descripcion": "Los lobatos organizan tareas y aprenden las destrezas necesarias para la aventura." },
      { "nombre": "Ejecución", "descripcion": "Se vive la aventura elegida (excursiones, talleres, campamentos de manada)." },
      { "nombre": "Evaluación", "descripcion": "Se evalúan los logros individuales y grupales, registrándose en el Libro de Mohwa." },
      { "nombre": "Celebración", "descripcion": "Fiesta y reconocimiento de las insignias y huellas alcanzadas." }
    ]
  }'::jsonb),
  simbolos_data = COALESCE(simbolos_data, '{
    "titulo": "Marco Simbólico de la Manada",
    "descripcion": "El Marco Simbólico de la Manada se basa en la historia del Pueblo Libre de Seeonee, inspirada en El Libro de las Tierras Vírgenes de Rudyard Kipling.",
    "promesa_titulo": "La Promesa de la Manada",
    "promesa_texto": "Yo prometo ser siempre mejor, amar a Dios y a mi familia, ayudar a los demás y vivir la Ley de la Manada.",
    "promesa_puntos": [
      "Yo prometo: Reafirma el carácter personal y voluntario del compromiso asumido.",
      "Ser siempre mejor: Refuerza el lema e invita a la superación permanente del niño.",
      "Amar a Dios y a mi familia: Compartir y vivir los valores de la fe y el hogar.",
      "Ayudar a los demás: Fomentar la actitud solidaria para hacer del mundo un lugar mejor."
    ],
    "ley_titulo": "La Ley de la Manada",
    "ley_articulos": [
      "Dice la verdad",
      "Es alegre",
      "Comparte con su familia",
      "Escucha y ayuda a los demás",
      "Cuida la naturaleza y las cosas",
      "Busca aprender"
    ],
    "elementos": [
      { "titulo": "El Tótem", "descripcion": "Una representación en madera de la cabeza de un lobo que encarna al Pueblo Libre.", "icono": "🐺" },
      { "titulo": "El Cubil", "descripcion": "La guarida de la Manada. Es el local o rincón decorado y mantenido por los propios niños.", "icono": "🏕️" },
      { "titulo": "El Libro de Mohwa", "descripcion": "El libro histórico de la Manada donde los lobatos plasman bitácoras, anécdotas y fotos.", "icono": "📖" },
      { "titulo": "El Color Amarillo", "descripcion": "Históricamente, las primeras insignias scouts se bordaban en amarillo sobre fondo verde. Identifica a los lobatos.", "icono": "🟡" },
      { "titulo": "La Flor Roja", "descripcion": "La fiesta del fuego de la Manada. Deriva del episodio donde Mowgli busca el fuego en la aldea.", "icono": "🔥" }
    ]
  }'::jsonb)
WHERE id = 1;

-- Seed Compañía (ID 2)
UPDATE unidades SET
  colores = jsonb_build_object(
    'primario', COALESCE(colores->>'primario', '#1b8a5a'),
    'secundario', COALESCE(colores->>'secundario', '#184233'),
    'fondo', '#f3faf6',
    'fondo_oscuro', '#0b1c15',
    'hero_gradient_from', 'rgba(24, 66, 51, 0.95)',
    'hero_gradient_via', 'rgba(24, 66, 51, 0.8)',
    'hero_gradient_to', 'rgba(27, 138, 90, 0.4)'
  ),
  ciclo_data = COALESCE(ciclo_data, '{
    "titulo": "Ciclo de Programa y Proyectos de Patrulla",
    "subtitulo": "Las Aventuras y Empresas de la Compañía",
    "descripcion": "En la Compañía, el juego democrático y el protagonismo de las guías organizan la vida común. A través de ciclos que ocurren tres veces al año, planificamos, preparamos, desarrollamos y evaluamos nuestras aventuras.",
    "fases": [
      { "nombre": "Fase 1: Diagnóstico de la Unidad", "descripcion": "El Consejo de Compañía y los Consejos de Patrulla analizan el clima educativo y fijan el Énfasis del Ciclo." },
      { "nombre": "Fase 2: Propuesta y Selección", "descripcion": "Las patrullas exponen ideas de proyectos y mediante Juegos Democráticos en Asamblea se eligen las favoritas." },
      { "nombre": "Fase 3: Diseño y Preparación", "descripcion": "Se arma un calendario flexible aprobado por la Asamblea, preparando recursos y objetivos claros." },
      { "nombre": "Fase 4: Desarrollo y Evaluación", "descripcion": "Se ejecutan los proyectos, se evalúa el cumplimiento de metas y se reconoce la progresión con sellos." }
    ]
  }'::jsonb),
  simbolos_data = COALESCE(simbolos_data, '{
    "titulo": "Símbolos y Mística de la Compañía",
    "descripcion": "La Compañía de Guías basa su mística en el sistema de patrulla, la hermandad de las guías y la superación personal.",
    "promesa_titulo": "La Promesa Guía",
    "promesa_texto": "Por mi honor prometo hacer cuanto de mí dependa para servir a Dios y a mi país, ayudar al prójimo en toda circunstancia y cumplir la Ley Guía.",
    "ley_titulo": "La Ley Guía",
    "ley_articulos": [
      "1. Es digna de confianza.",
      "2. Es leal.",
      "3. Sirve sin esperar recompensa.",
      "4. Comparte con todas y todos.",
      "5. Es alegre y cordial.",
      "6. Protege la vida y la naturaleza.",
      "7. Es responsable y perseverante.",
      "8. Es optimista ante las dificultades.",
      "9. Cuida las cosas y respeta el trabajo ajeno.",
      "10. Es coherente en pensamientos, palabras y acciones."
    ],
    "elementos": [
      { "titulo": "El Trébol Mundial", "descripcion": "Las tres hojas representan los tres deberes de la Promesa Guía y la llama el amor a la humanidad.", "icono": "☘️" },
      { "titulo": "El Rincón de Patrulla", "descripcion": "El espacio sagrado de cada patrulla para coordinar proyectos y resguardar sus tradiciones.", "icono": "🏕️" },
      { "titulo": "Banderín de Patrulla", "descripcion": "Emblema heráldico llevado por la guía de patrulla en todas las salidas y ceremonias.", "icono": "🚩" },
      { "titulo": "Fiesta del Trébol", "descripcion": "Encuentro tradicional de celebración y reconocimiento de etapas de la compañía.", "icono": "✨" }
    ]
  }'::jsonb)
WHERE id = 2;

-- Seed Tropa (ID 3)
UPDATE unidades SET
  colores = jsonb_build_object(
    'primario', COALESCE(colores->>'primario', '#1e7e34'),
    'secundario', COALESCE(colores->>'secundario', '#155724'),
    'fondo', '#f4faf5',
    'fondo_oscuro', '#0d2312',
    'hero_gradient_from', 'rgba(21, 87, 36, 0.95)',
    'hero_gradient_via', 'rgba(21, 87, 36, 0.8)',
    'hero_gradient_to', 'rgba(30, 126, 52, 0.4)'
  ),
  ciclo_data = COALESCE(ciclo_data, '{
    "titulo": "Aventuras y Ciclo de Programa",
    "subtitulo": "La Vida en Patrulla al Aire Libre",
    "descripcion": "El ciclo de programa de la Tropa estructura el año en periodos de 3 a 4 meses donde las patrullas diseñan sus propias aventuras con criterios DURAS (Desafiantes, Útiles, Recompensantes, Atractivas, Seguras).",
    "fases": [
      { "nombre": "Fase 1: Propuesta y Selección", "descripcion": "Las patrullas proponen ideas y mediante Juegos Democráticos en Asamblea se eligen las actividades comunes." },
      { "nombre": "Fase 2: Organización y Preparación", "descripcion": "Las actividades se organizan en un calendario flexible de Tropa y se preparan los recursos necesarios." },
      { "nombre": "Fase 3: Desarrollo y Evaluación", "descripcion": "Se ejecutan los proyectos, campamentos y dinámicas evaluando el cumplimiento en 360 grados." },
      { "nombre": "Fase 4: Cambio de Ciclo", "descripcion": "Fase de transición: autoevaluación, entrega de insignias y fijación de un nuevo Énfasis de Tropa." }
    ]
  }'::jsonb),
  simbolos_data = COALESCE(simbolos_data, '{
    "titulo": "Símbolos y Tradición de la Tropa",
    "descripcion": "La Tropa Scout fundamenta su identidad en los valores legados por Baden-Powell y el honor scout.",
    "promesa_titulo": "La Promesa Scout",
    "promesa_texto": "Por mi honor prometo hacer cuanto de mí dependa para buscar a Dios, amar a mi familia, ayudar a los demás, servir a mi país, trabajar por la paz y vivir la Ley Scout.",
    "ley_titulo": "La Ley Scout",
    "ley_articulos": [
      "1. Es digno de confianza.",
      "2. Es leal.",
      "3. Sirve sin esperar recompensa.",
      "4. Comparte con todos.",
      "5. Es alegre y cordial.",
      "6. Protege la vida y la naturaleza.",
      "7. Es responsable y nada hace a medias.",
      "8. Es optimista.",
      "9. Cuida las cosas y valora el trabajo.",
      "10. Es coherente en su pensamiento, palabra y acción."
    ],
    "elementos": [
      { "titulo": "La Flor de Lis", "descripcion": "Indica la buena senda en la rosa de los vientos, recordando mantener el norte correcto.", "icono": "⚜️" },
      { "titulo": "El Color Verde", "descripcion": "Color histórico de la primera rama en crearse, representando la naturaleza y el bosque.", "icono": "🌲" },
      { "titulo": "Saludo Scout", "descripcion": "El dedo pulgar sobre el meñique (el fuerte protege al débil) y tres dedos alzados (los deberes).", "icono": "✋" },
      { "titulo": "Báculo de Patrulla", "descripcion": "Vara con el banderín de patrulla tallado con los hitos y campamentos vividos.", "icono": "🪵" },
      { "titulo": "Oración Scout", "descripcion": "Plegaria de San Ignacio que llama a dar sin medida y trabajar sin buscar recompensa.", "icono": "🙏" }
    ]
  }'::jsonb)
WHERE id = 3;

-- Seed Avanzada (ID 4)
UPDATE unidades SET
  colores = jsonb_build_object(
    'primario', COALESCE(colores->>'primario', '#1075bb'),
    'secundario', COALESCE(colores->>'secundario', '#0b4168'),
    'fondo', '#f0f7fc',
    'fondo_oscuro', '#081c2c',
    'hero_gradient_from', 'rgba(11, 65, 104, 0.95)',
    'hero_gradient_via', 'rgba(11, 65, 104, 0.8)',
    'hero_gradient_to', 'rgba(16, 117, 187, 0.4)'
  ),
  ciclo_data = COALESCE(ciclo_data, '{
    "titulo": "Las Aventuras de la Avanzada",
    "subtitulo": "Metodología de Proyectos y Competencias",
    "descripcion": "En la Avanzada de Pioneros, el método toma el nombre de Aventura. Los pioneros definen proyectos desafiantes y desarrollan competencias transversales en 7 rumbos.",
    "fases": [
      { "nombre": "Fase 1: Diagnóstico y Énfasis", "descripcion": "La Comunidad evalúa las necesidades individuales y comunitarias para trazar el rumbo." },
      { "nombre": "Fase 2: Ideación y Selección", "descripcion": "En Asamblea se presentan las propuestas de Aventura y se votan democráticamente." },
      { "nombre": "Fase 3: Planificación y Finanzas", "descripcion": "Los equipos preparan el presupuesto, la logística y las tareas específicas de la aventura." },
      { "nombre": "Fase 4: Ejecución y Evaluación", "descripcion": "Se vive la Aventura y se realiza el balance de competencias adquiridas y metas alcanzadas." }
    ]
  }'::jsonb),
  simbolos_data = COALESCE(simbolos_data, '{
    "titulo": "Mística y Símbolos de la Avanzada",
    "descripcion": "Los pioneros se caracterizan por su empuje hacia el futuro, abriendo caminos en la sociedad.",
    "promesa_titulo": "La Promesa Pionera",
    "promesa_texto": "Por mi honor prometo hacer cuanto de mí dependa para amar a Dios, servir a mi país, ayudar a los demás y vivir la Ley Scout.",
    "ley_titulo": "La Ley Scout en la Avanzada",
    "ley_articulos": [
      "1. Es digno de confianza.",
      "2. Es leal.",
      "3. Sirve sin esperar recompensa.",
      "4. Comparte con todos.",
      "5. Es alegre y cordial.",
      "6. Protege la vida y la naturaleza.",
      "7. Es responsable y nada hace a medias.",
      "8. Es optimista.",
      "9. Cuida las cosas y valora el trabajo.",
      "10. Es coherente en su pensamiento, palabra y acción."
    ],
    "elementos": [
      { "titulo": "El Color Azul", "descripcion": "El horizonte azul y el cielo abierto que invitan a explorar nuevos rumbos.", "icono": "🔵" },
      { "titulo": "La Rosa de los Vientos", "descripcion": "Simboliza los 7 rumbos de competencias y la guía personal en la toma de decisiones.", "icono": "🧭" },
      { "titulo": "El Horcón Pionero", "descripcion": "Pilar de madera que representa la base sólida de la comunidad y el trabajo en equipo.", "icono": "🪵" }
    ]
  }'::jsonb)
WHERE id = 4;

-- Seed Clan (ID 5)
UPDATE unidades SET
  colores = jsonb_build_object(
    'primario', COALESCE(colores->>'primario', '#cb3327'),
    'secundario', COALESCE(colores->>'secundario', '#1b1b1b'),
    'fondo', '#fcf6f5',
    'fondo_oscuro', '#180f0e',
    'hero_gradient_from', 'rgba(27, 27, 27, 0.95)',
    'hero_gradient_via', 'rgba(27, 27, 27, 0.8)',
    'hero_gradient_to', 'rgba(203, 51, 39, 0.4)'
  ),
  ciclo_data = COALESCE(ciclo_data, '{
    "titulo": "Proyectos y Servicio Comunitario",
    "subtitulo": "Remar la Propia Canoa",
    "descripcion": "En el Clan, los caminantes planifican proyectos personales y comunitarios con impacto directo en el entorno, transitando hacia la vida ciudadana adulta y La Partida.",
    "fases": [
      { "nombre": "Fase 1: Diagnóstico Social", "descripcion": "Identificación de problemáticas reales en la comunidad y metas de desarrollo personal." },
      { "nombre": "Fase 2: Formulación del Proyecto", "descripcion": "Elaboración del plan en 12 pasos con objetivos, recursos, impacto y cronograma medible." },
      { "nombre": "Fase 3: Acción y Servicio", "descripcion": "Ejecución activa del proyecto en el territorio, asumiendo liderazgo responsable." },
      { "nombre": "Fase 4: Evaluación y Trascendencia", "descripcion": "Medición de los resultados alcanzados y sistematización de aprendizajes para la vida." }
    ]
  }'::jsonb),
  simbolos_data = COALESCE(simbolos_data, '{
    "titulo": "Marco Simbólico del Clan de Caminantes",
    "descripcion": "Tengo un proyecto para mi vida: remar la propia canoa con el lema Servir.",
    "promesa_titulo": "La Promesa Rover",
    "promesa_texto": "Por mi honor prometo hacer cuanto de mí dependa para buscar a Dios, servir a mi país, trabajar por la paz, ayudar al prójimo en toda circunstancia y vivir la Ley Scout.",
    "ley_titulo": "Nuestra Ley",
    "ley_articulos": [
      "1. Es una persona digna de confianza.",
      "2. Es leal.",
      "3. Sirve sin esperar recompensa.",
      "4. Comparte con todos.",
      "5. Es alegre y cordial.",
      "6. Protege la vida y la naturaleza.",
      "7. Es responsable y nada hace a medias.",
      "8. Es optimista.",
      "9. Cuida las cosas y valora el trabajo.",
      "10. Es coherente en su pensamiento, palabra y acción."
    ],
    "elementos": [
      { "titulo": "El Color Rojo", "descripcion": "Representa el ardor, la entrega y la pasión por el servicio activo a los demás.", "icono": "🔴" },
      { "titulo": "El Bastón Rover", "descripcion": "Vara con horqueta que sirve de apoyo para caminar, abrir paso y sostenerse en el viaje.", "icono": "🦯" },
      { "titulo": "El Fuego", "descripcion": "Símbolo de coraje, fraternidad en la vigilia y calor humano compartido con la comunidad.", "icono": "🔥" },
      { "titulo": "La Horqueta", "descripcion": "Representa la encrucijada donde el caminante debe elegir conscientemente el camino correcto.", "icono": "🔱" }
    ]
  }'::jsonb)
WHERE id = 5;
