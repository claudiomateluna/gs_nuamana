SET client_encoding = 'UTF8';
BEGIN;

DELETE FROM articulos WHERE slug = 'el-espejo-colectivo-scout';

INSERT INTO articulos (
  slug, titulo, extracto, contenido, imagen_destacada, estado, metadata, created_at, updated_at, categoria_id, autor_id
) VALUES (
  'el-espejo-colectivo-scout', 'El Espejo Colectivo Scout', 'Dinámica de imitación síncrona y esquema corporal donde parejas y grupos de scouts duplican en tiempo real los movimientos del guía.', '<h2>📜 Descripción de El Espejo Colectivo Scout</h2>
<p><b>El Espejo Colectivo Scout</b> es una dinámica kinésica de coordinación psicomotriz, atención focalizada y desinhibición grupal. Los participantes se ubican frente a frente en parejas o en hilera frente a un ''Guía Espejo''. El guía realiza movimientos fluidos de brazos, cabeza, tronco y desplazamientos laterales a diferentes velocidades, mientras el resto del grupo debe actuar como su reflejo exacto en un cristal virtual, anticipando e imitando cada gesto en tiempo real sin romper la sincronicidad.</p>
<p>Esta actividad ejercita el control tónico postural, la percepción espacial y la relajación activa en Manada, Compañía y Tropa.</p>

<h2>🎲 ¿Cómo se juega El Espejo Colectivo Scout?</h2>
<p>Para llevar a cabo la dinámica con fluidez y entusiasmo, los dirigentes deben seguir estos pasos:</p>
<ul>
  <li><b>Formación de Parejas Espejo:</b> Los scouts se colocan frente a frente a un metro de distancia, mirándose directamente a los ojos.</li>
  <li><b>Designación del Guía Inicial:</b> Uno de los integrantes asume el rol de ''Cuerpo Real'' y el otro de ''Reflejo en el Espejo''.</li>
  <li><b>Movimiento Progresivo:</b> El guía inicia movimientos lentos de manos y rostro, aumentando paulatinamente la complejidad con giros y flexiones de piernas.</li>
  <li><b>Rotación de Roles:</b> Al toque de silbato del animador, los roles se invierten de forma instantánea sin interrumpir la secuencia de movimiento.</li>
  <li><b>Espejo Gigante de Patrulla:</b> En la etapa final, un solo guía lidera los movimientos de toda la patrulla posicionada en abanico.</li>
</ul>

<h2>🏆 Cómputo de Puntos y Condición de Victoria de El Espejo Colectivo Scout</h2>
<p>La actividad premia la sincronía y la soltura corporal en el Tally:</p>
<ul>
  <li><b>Sincronía Perfecta:</b> Otorgar 5 puntos a la pareja que logre la fluidez de movimientos más idéntica e imperceptible al cambio de guía.</li>
  <li><b>Creatividad de Gestos:</b> Otorgar 3 puntos al guía que proponga las secuencias posturales más originales e ingeniosas.</li>
  <li><b>Cohesión de Patrulla:</b> Otorgar 3 puntos al grupo que mantenga el ritmo síncrono en la modalidad de espejo gigante.</li>
</ul>', '/uploads/el-espejo-colectivo-scout.webp', 'publicado', '{"areas": ["corporalidad", "sociabilidad", "creatividad"], "unidades": ["manada", "compañía", "tropa"], "duracion": "20 minutos", "cantidad": "04 participantes", "lugares": ["Interior", "Salón", "Exterior", "Campo Abierto"], "materiales": ["Ninguno"], "objetivos": ["Conocer las capacidades corporales", "Desarrollar la motricidad", "Estimular la coordinación", "Crear un ambiente de distensión"], "justificacion_areas": "El Espejo Colectivo Scout potencia la corporalidad al afinar el esquema corporal, el equilibrio tónico y la fluidez del movimiento corporal. Desarrolla la sociabilidad al requerir una mirada atenta, empática y de absoluta confianza con la pareja de juego. Fortalece la creatividad al estimular la innovación de gestos y secuencias corporales.", "variaciones": "<b>Espejo en Descompresión:</b> Realizar los movimientos en cámara lenta extrema con música instrumental suave.<br><b>Espejo de Máquinas Scouts:</b> Cada pareja imita el movimiento de un engranaje o herramienta de construcción de campamento.<br><b>Espejo de Seisena:</b> Toda la seisena imita las gesticulaciones de Akela o del seisenero durante una danza scout.", "recomendaciones": "Generar un clima de confianza donde nadie se sienta juzgado. Adaptar la exigencia física a las capacidades del grupo.", "objetivos_educativos": [{"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "unidad": "Manada", "texto": "Me gusta practicar deportes.", "como_se_cumple": "Disfrutando de la coordinación física y la fluidez de movimientos en parejas."}, {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "unidad": "Manada", "texto": "Practico deportes, conozco sus reglas y sé perder.", "como_se_cumple": "Afinando el control tónico y el equilibrio postural en la dinámica espejo."}, {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "unidad": "Compañía", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Respetando las normas de sincronía visual y ritmo del movimiento guiado."}, {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "unidad": "Compañía", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Exigiendo precisión kinésica en la imitación de posturas complejas."}, {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "unidad": "Tropa", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Desarrollando la motricidad adaptativa en ejercicios de coordinación colectiva."}, {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "unidad": "Tropa", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Perfeccionando el control psicomotriz y la respuesta refleja en la Tropa."}]}'::jsonb, NOW(), NOW(), NULL, NULL
);

INSERT INTO articulo_categorias (articulo_id, categoria_id) SELECT id, 1 FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
INSERT INTO articulo_categorias (articulo_id, categoria_id) SELECT id, 10 FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) SELECT id, 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Disfrutando de la coordinación física y la fluidez de movimientos en parejas.' FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) SELECT id, '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Afinando el control tónico y el equilibrio postural en la dinámica espejo.' FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) SELECT id, '1427451e-b8b3-493b-8525-e53298381e07', 'Respetando las normas de sincronía visual y ritmo del movimiento guiado.' FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) SELECT id, 'b12da732-d736-480c-82b8-95b312316390', 'Exigiendo precisión kinésica en la imitación de posturas complejas.' FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) SELECT id, '0765469b-caef-4457-9d6b-cb739c855402', 'Desarrollando la motricidad adaptativa en ejercicios de coordinación colectiva.' FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple) SELECT id, '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Perfeccionando el control psicomotriz y la respuesta refleja en la Tropa.' FROM articulos WHERE slug = 'el-espejo-colectivo-scout';
COMMIT;