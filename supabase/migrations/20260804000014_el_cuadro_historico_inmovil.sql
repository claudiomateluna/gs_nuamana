SET client_encoding = 'UTF8';
BEGIN;

DELETE FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';

INSERT INTO articulos (
  slug, 
  titulo, 
  extracto, 
  contenido, 
  imagen_destacada, 
  estado, 
  metadata, 
  created_at, 
  updated_at,
  categoria_id,
  autor_id
) VALUES (
  'el-cuadro-historico-inmovil',
  'El Cuadro Histórico Inmóvil',
  'Dinámica de dramatización congelada y representación patria donde las patrullas recrean momentos históricos o tradiciones scouts manteniéndose inmóviles como una fotografía viva.',
  '<h2>📜 Descripción de El Cuadro Histórico Inmóvil</h2>
<p><b>El Cuadro Histórico Inmóvil</b> es una dinámica de expresión artística, investigación de tradiciones y cohesión scout. En esta actividad, los grupos o patrullas reciben el desafío de escenificar una ''fotografía congelada'' en el tiempo que represente un hito patriótico o scout significativo (ej. la firma de la Independencia de Chile, el Primer Campamento Scout de la historia o una escena típica del folclore nacional). Los participantes deben mantener una inmovilidad estricta durante 60 segundos mientras el resto de las patrullas analiza las posturas y adivina el evento histórico retratado.</p>
<p>Esta dinámica combina el desarrollo del autocontrol postural con el fortalecimiento del sentido de pertenencia e identidad cultural en Manada, Compañía y Tropa.</p>

<h2>🎲 ¿Cómo se juega El Cuadro Histórico Inmóvil?</h2>
<p>Para llevar a cabo la actividad con orden y solemnidad, los dirigentes deben seguir estos pasos:</p>
<ul>
  <li><b>Asignación del Cuadro:</b> El dirigente entrega en secreto a cada patrulla una tarjeta con el hito histórico o la tradición cultural a escenificar.</li>
  <li><b>Preparación Aislada:</b> Los equipos disponen de 3 minutos para planificar la distribución espacial de sus integrantes, asignar personajes y ensayar la postura congelada.</li>
  <li><b>El Apagón o Enfoque:</b> A la señal del guía, la patrulla entra en escena y asume su postura congelada de ''foto fija'' manteniéndose inmóvil y sin pestañear durante un minuto completo.</li>
  <li><b>Análisis y Adivinanza:</b> Los espectadores observan detenidamente los gestos y herramientas representadas por los cuerpos antes de formular sus deducciones sobre el momento histórico.</li>
  <li><b>Rotación de Cuadros:</b> Cada patrulla presenta su cuadro histórico hasta completar la galería viviente del grupo.</li>
</ul>

<h2>🏆 Cómputo de Puntos y Condición de Victoria de El Cuadro Histórico Inmóvil</h2>
<p>El sistema de puntuación en el Tally reconoce el rigor expresivo y el valor educativo del montaje:</p>
<ul>
  <li><b>Fidelidad del Cuadro Histórico:</b> Otorgar 5 puntos a la patrulla o seisena que logre la caracterización más precisa y fácil de identificar.</li>
  <li><b>Mayor Autocontrol Inmóvil:</b> Otorgar 3 puntos a la unidad que mantenga la congelación postural más sólida durante los 60 segundos.</li>
  <li><b>Identidad Cultural:</b> Otorgar 3 puntos al equipo que mejor refleje los valores y símbolos de nuestra herencia histórica.</li>
</ul>',
  '/uploads/el-cuadro-historico-inmovil.webp',
  'publicado',
  '{"areas": ["sociabilidad", "carácter", "creatividad"], "unidades": ["manada", "compañía", "tropa"], "duracion": "25 minutos", "cantidad": "04 participantes", "lugares": ["Interior", "Exterior"], "materiales": ["Sin Materiales"], "objetivos": ["Fomentar el conocimiento de la historia y tradiciones", "Desarrollo de la expresión corporal", "Estimular la autodisciplina y autocontrol", "Favorecer el trabajo en equipo"], "justificacion_areas": "El Cuadro Histórico Inmóvil fortalece la sociabilidad al reconectar a los beneficiarios con los símbolos y valores culturales de nuestro país. Desarrolla el carácter al ejercitar el autodominio corporal, la contención de la risa y el compromiso con el resultado de la patrulla. Estimula la creatividad a través del diseño plástico y la composición tridimensional de escenarios narrativos.", "variaciones": "<b>Cuadro con Sombras Patrias:</b> Proyectar las siluetas de la foto fija detrás de una tela blanca utilizando linternas de campamento.<br><b>El Fotógrafo Parlante:</b> Un dirigente actúa como fotógrafo recorriendo el cuadro e interrogando a las ''estatuas''; la estatua interrogada sólo puede responder en una frase sin modificar su postura.<br><b>Galería de Tradiciones Scouts:</b> Enfocar los cuadros exclusivamente en hitos emblemáticos del Movimiento Guía y Scout.", "recomendaciones": "Promover un ambiente de respeto hacia la temática histórica abordada en las representaciones. Verificar que las posturas congeladas de los beneficiarios sean seguras y no sobrecarguen articulaciones durante el minuto de duración. Acompañar la dinamización con relatos breves al finalizar cada cuadro para reforzar el aprendizaje histórico.", "objetivos_educativos": [{"id": "cafa257b-1d05-486a-8b69-ef5695a33925", "area": "Sociabilidad", "unidad": "Manada", "texto": "Conozco los símbolos de mi país, como por ejemplo la bandera, el himno y el escudo.", "como_se_cumple": "Representando con respeto los símbolos patrios en el cuadro histórico viviente."}, {"id": "f5e2e054-9561-4132-a855-ffc9f25fac33", "area": "Sociabilidad", "unidad": "Manada", "texto": "Me gusta la cultura de mi país y las distintas formas en que se expresa.", "como_se_cumple": "Participando con entusiasmo en la escenificación de tradiciones y costumbres de nuestra patria."}, {"id": "15e0977f-8b22-4074-a6c4-7dc302a0a049", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Me gusta sentirme parte de la cultura de mi país.", "como_se_cumple": "Investigando y valorando la herencia cultural que sustenta el cuadro histórico de la patrulla."}, {"id": "66ae3385-8256-4450-a1fa-861ee5eaddd7", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Aprecio la cultura de mi país y me identifico con ella.", "como_se_cumple": "Identificándose orgullosamente con los hitos fundamentales representados en la foto fija."}, {"id": "4dcd5192-7990-43df-aee2-517dde3fc548", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Me gusta sentirme parte de la cultura de mi país.", "como_se_cumple": "Expresando con solemnidad y compromiso los valores históricos en el montaje teatral."}, {"id": "02eb45f3-b00d-41e5-8412-c7a4d962e40d", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Aprecio la cultura de mi país y me identifico con ella.", "como_se_cumple": "Promoviendo el aprecio por las gestas históricas y la identidad nacional entre los pares."}, {"id": "99c6e695-ef0b-4e36-956b-3faf15ada355", "area": "Carácter", "unidad": "Manada", "texto": "Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.", "como_se_cumple": "Acatando en grupo las instrucciones para lograr el equilibrio e inmovilidad del cuadro."}, {"id": "3a84066e-ad27-4122-9a89-4ae45844668b", "area": "Carácter", "unidad": "Manada", "texto": "Tengo amigos y amigas con los que siempre juego y me encuentro.", "como_se_cumple": "Confiando en el apoyo físico de los compañeros durante las posturas congeladas."}, {"id": "85f8abea-eb57-4f78-9e11-5c2ab5d71044", "area": "Carácter", "unidad": "Compañía", "texto": "Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.", "como_se_cumple": "Aceptando el personaje asignado en la planificación de la foto fija por la patrulla."}, {"id": "e531fa27-a4f3-46df-b559-1f08e2d03ab3", "area": "Carácter", "unidad": "Compañía", "texto": "Opino y asumo responsabilidades en el Consejo de Patrulla.", "como_se_cumple": "Proponiendo activamente ideas de composición escénica en el equipo."}, {"id": "f0bd8ba8-8b11-4988-8fb6-ad8e883c2a5b", "area": "Carácter", "unidad": "Tropa", "texto": "Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.", "como_se_cumple": "Cumpliendo con disciplina el rol asignado en la representación escénica."}, {"id": "41aec261-3a8f-4f29-9c01-f539fe589fed", "area": "Carácter", "unidad": "Tropa", "texto": "Opino y asumo responsabilidades en el Consejo de Patrulla.", "como_se_cumple": "Asumiendo el liderazgo de montaje de la escena con responsabilidad compartida."}, {"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "unidad": "Manada", "texto": "Me gusta participar en juegos de observación.", "como_se_cumple": "Observando atentamente los detalles de los cuadros presentados por las otras seisenas."}, {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "unidad": "Manada", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "como_se_cumple": "Deduciendo con agilidad los pasajes históricos a partir de las posturas observadas."}, {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "area": "Creatividad", "unidad": "Compañía", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Expresando con plasticidad dramática el significado del acontecimiento representado."}, {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "unidad": "Compañía", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Analizando la composición tridimensional de la foto para optimizar su visibilidad."}, {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "unidad": "Tropa", "texto": "Doy mi opinión sobre las cosas que me pasan.", "como_se_cumple": "Aportando soluciones creativas de caracterización con recursos de campamento."}, {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "unidad": "Tropa", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "como_se_cumple": "Sintetizando momentos históricos complejos en un solo instante congelado."}]}'::jsonb,
  NOW(),
  NOW(),
  NULL,
  NULL
);


INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 1 FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_categorias (articulo_id, categoria_id)
SELECT id, 10 FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'cafa257b-1d05-486a-8b69-ef5695a33925', 'Representando con respeto los símbolos patrios en el cuadro histórico viviente.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'f5e2e054-9561-4132-a855-ffc9f25fac33', 'Participando con entusiasmo en la escenificación de tradiciones y costumbres de nuestra patria.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '15e0977f-8b22-4074-a6c4-7dc302a0a049', 'Investigando y valorando la herencia cultural que sustenta el cuadro histórico de la patrulla.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '66ae3385-8256-4450-a1fa-861ee5eaddd7', 'Identificándose orgullosamente con los hitos fundamentales representados en la foto fija.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4dcd5192-7990-43df-aee2-517dde3fc548', 'Expresando con solemnidad y compromiso los valores históricos en el montaje teatral.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '02eb45f3-b00d-41e5-8412-c7a4d962e40d', 'Promoviendo el aprecio por las gestas históricas y la identidad nacional entre los pares.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '99c6e695-ef0b-4e36-956b-3faf15ada355', 'Acatando en grupo las instrucciones para lograr el equilibrio e inmovilidad del cuadro.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3a84066e-ad27-4122-9a89-4ae45844668b', 'Confiando en el apoyo físico de los compañeros durante las posturas congeladas.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '85f8abea-eb57-4f78-9e11-5c2ab5d71044', 'Aceptando el personaje asignado en la planificación de la foto fija por la patrulla.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e531fa27-a4f3-46df-b559-1f08e2d03ab3', 'Proponiendo activamente ideas de composición escénica en el equipo.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'f0bd8ba8-8b11-4988-8fb6-ad8e883c2a5b', 'Cumpliendo con disciplina el rol asignado en la representación escénica.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '41aec261-3a8f-4f29-9c01-f539fe589fed', 'Asumiendo el liderazgo de montaje de la escena con responsabilidad compartida.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Observando atentamente los detalles de los cuadros presentados por las otras seisenas.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Deduciendo con agilidad los pasajes históricos a partir de las posturas observadas.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 'Expresando con plasticidad dramática el significado del acontecimiento representado.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando la composición tridimensional de la foto para optimizar su visibilidad.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Aportando soluciones creativas de caracterización con recursos de campamento.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Sintetizando momentos históricos complejos en un solo instante congelado.' FROM articulos WHERE slug = 'el-cuadro-historico-inmovil';
    
COMMIT;