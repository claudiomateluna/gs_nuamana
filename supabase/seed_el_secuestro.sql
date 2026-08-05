-- =====================================================================
-- Article: "El Secuestro del Botánico"
-- Activity-type (Juego / Grandes Juegos) — Adaptado a campamento scout
-- Source inspiration: juegosdetiempolibre.org 00190 El Secuestro
-- Skill: articulos-nuamana
-- Encoding: UTF-8 puro
-- Idempotencia: re-ejecutable (ON CONFLICT / DELETE por slug previo)
-- =====================================================================

BEGIN;

-- Limpieza previa por slug (idempotencia)
DELETE FROM public.articulo_objetivos_educativos
 WHERE articulo_id IN (SELECT id FROM public.articulos WHERE slug = 'el-secuestro-del-botanico');
DELETE FROM public.articulo_categorias
 WHERE articulo_id IN (SELECT id FROM public.articulos WHERE slug = 'el-secuestro-del-botanico');
DELETE FROM public.articulos WHERE slug = 'el-secuestro-del-botanico';

-- ---------------------------------------------------------------------
-- INSERT artículo
-- ---------------------------------------------------------------------
INSERT INTO public.articulos (
    titulo, slug, contenido, extracto, imagen_destacada,
    estado, seo_titulo, seo_descripcion,
    etiquetas, autor_id, metadata
) VALUES (
    'El Secuestro del Botánico',
    'el-secuestro-del-botanico',
    '<h2>📜 Descripción del Juego</h2><p>Un botánico experto en plantas medicinales ha sido capturado y retenido en un lugar oculto del campamento. Es el único que conoce las propiedades de una especie amazónica, cultivada por una tribu ya extinguida, capaz de curar una enfermedad que hasta ahora no tiene tratamiento. Los equipos deben encontrarlo siguiendo pistas, resolviendo acertijos y superando pruebas que recorren todo el terreno.</p><p>Este gran juego de pistas, pensado para tres horas de aventura, nace de un formato urbano clásico en el que los participantes recorrían una ciudad: jardines botánicos, kioscos de prensa, llamadas telefónicas y el metro. En esta versión de campamento esos elementos se adaptan al aire libre: los sectores boscosos reemplazan a las calles, los banderines y los silbatos organizan el recorrido, la bandeja de prensa del campamento reemplaza al kiosco y las fichas de campamento sustituyen al dinero. Si el grupo prefiere la versión original, puede volver a ambientarse en la ciudad.</p><p>El juego finaliza cuando los equipos encuentran al botánico.</p><h3>🎲 ¿Cómo se juega?</h3><p>Los equipos se distinguen por colores y solo pueden recoger las pistas de su color. Cada equipo recibe una cantidad limitada de fichas de campamento y no puede gastar más de lo recibido. Los sobres sellados solo se abren ante grandes dificultades; si un grupo recurre a uno, deberá pagar una prenda al final del juego, por ejemplo inventar una canción con coreografía y bailarla. Los equipos recorren las pruebas en momentos distintos, con una diferencia de 10 minutos entre cada salida.</p><ol><li><strong>Primer mensaje:</strong> se entrega a cada equipo una adivinanza cuya respuesta conduce a un sector boscoso o zona de plantas del terreno.</li><li><strong>El guardián de las especies:</strong> en ese sector, un dirigente confabulado pregunta por determinadas especies vegetales; los scouts deben reconocerlas para conseguir la siguiente pista.</li><li><strong>Línea de señales:</strong> el nuevo mensaje envía al equipo por un recorrido marcado con banderines o hitos. Durante el trayecto deben estar atentos: en algún punto los espera su contacto, identificable por un distintivo o disfraz aunque no se les diga cómo va vestido. Deben acercarse con discreción y él les entregará una cámara desechable y un sobre sellado, que solo puede abrirse una vez realizada la prueba.</li><li><strong>Misión fotográfica:</strong> deben fotografiar cinco elementos peculiares y originales del terreno que tengan relación con el mundo vegetal y entregarlos al siguiente contacto. Recién entonces abren el sobre, que contiene una indicación en cuyo reverso se advierte que es peligroso acercarse sin antes realizar la señal convenida.</li><li><strong>La bandeja de prensa:</strong> al emitir la señal, un contacto les pide buscar en la bandeja de prensa del campamento una revista determinada que oculta un mensaje: letras señaladas en el texto, un crucigrama resuelto o un collage que simboliza el siguiente paso. La localización puede ser sencilla y el descifrado más difícil, o al revés.</li><li><strong>La contraseña:</strong> el mensaje contiene una contraseña. Para acceder al escondite del botánico deben descifrarla y entregar las fotografías al guardián que custodia la puerta. Por ejemplo: con la primera, tercera y quinta sílaba de los mensajes primero, segundo y tercero se puede conocer la contraseña.</li></ol>',
    'Gran juego de pistas en etapas: descifrar mensajes, reconocer plantas y superar pruebas para rescatar a un botánico raptado.',
    '/uploads/el-secuestro-del-botanico.webp',
    'publicado',
    NULL,
    NULL,
    ARRAY['pistas', 'aventura', 'acertijos', 'trabajo en equipo', 'campamento']::text[],
    '0d3bc18b-dbc8-4f69-994b-8959472f2f09',
    '{
  "unidades": ["manada", "tropa", "compañía"],
  "duracion": "180 minutos",
  "cantidad": "24 participantes",
  "lugares": ["Exterior", "campo abierto"],
  "materiales": ["Fichas de campamento", "Cámaras desechables", "Folios y bolígrafos", "Pañolines", "Cuerdas", "Disfraces", "Sobres sellados", "Banderines", "Silbatos"],
  "areas": ["creatividad", "carácter", "sociabilidad"],
  "objetivos": ["Aprender a seguir instrucciones", "Estimular la observación", "Estimular el pensamiento lógico", "Trabajo en equipo"],
  "justificacion_areas": "Esta gran pista de aventura en etapas ejercita tres áreas clave del desarrollo scout en Manada, Tropa y Compañía. La creatividad se estimula al descifrar acertijos, registrar cinco elementos peculiares del terreno vegetal y componer la contraseña final a partir de sílabas dispersas, promoviendo el ingenio práctico, la agilidad mental y la resolución de enigmas. El carácter se fortalece mediante el autocontrol para acercarse con discreción a los contactos, cumplir la regla de no abrir los sobres sellados hasta el momento debido y asumir con honestidad la prenda cuando se recurre a una pista de emergencia, consolidando valores de fair play y lealtad. La sociabilidad se desarrolla a través del trabajo coordinado de patrulla, el respeto de los turnos diferidos entre equipos y la cooperación fraterna para liberar al botánico, incentivando el cumplimiento de reglas cooperativas y la responsabilidad compartida.",
  "variaciones": "<b>Modalidad de gran grupo:</b> Todos los participantes salen del mismo punto al mismo tiempo y durante el recorrido se van dividiendo en subgrupos; la división estará indicada en los propios mensajes, lo que conlleva adaptar los textos al número de jugadores que los van a descifrar. <b>Variante de recorridos paralelos:</b> Los diferentes equipos recorren pistas distintas y la última pista solo puede descifrarse reuniendo la información obtenida por cada uno a lo largo de su trayecto, promoviendo el intercambio final. <b>Variante con pañolines:</b> Cada equipo puede portar pañolines de su color para identificarse visualmente y distinguir sus pistas respecto a las de las demás patrullas. <b>Variante de dificultad reducida:</b> Para Manada, los acertijos pueden ilustrarse con dibujos y reducirse a tres etapas, manteniendo la ambientación de rescate. <b>Versión urbana original:</b> En la ciudad pueden reponerse los elementos clásicos del juego original: jardín botánico, estaciones con contactos, llamadas telefónicas, kioscos de prensa y compras con dinero de juguete.",
  "recomendaciones": "<b>Seguridad del terreno:</b> Recorrer el sector boscoso a la luz del día antes del juego para retirar ramas peligrosas, delimitar bordes de agua o pendientes y marcar claramente las zonas de juego, evitando que los scouts se alejen del perímetro acordado. <b>Rol de los contactos:</b> Los dirigentes confabulados deben llevar un distintivo visible y permanecer en su posto hasta ser hallados; conviene que cada contacto conozca el rumbo del siguiente para mantener el hilo narrativo. <b>Uso de sobres sellados:</b> Acordar de antemano el tipo de prendas (canción coreografiada, representación, soneto scout) para evitar frustraciones; idealmente las prendas se ejecutan en el círculo de cierre del juego. <b>Pañolín y uniforme:</b> Recordar a los scouts portar correctamente su pañolín y verificar que cada equipo lleve sus fichas de campamento, cámara desechable y sobre sellado; el buen uso del pañolín facilita la identificación de patrullas en el terreno. <b>Cierre pedagógico:</b> Realizar una breve reflexión final sobre cómo se compartió la información entre equipos, qué pistas costaron más y qué valores scouts vivieron al rescatar al botánico.",
  "descargas": [],
  "objetivos_educativos": [
    {"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "texto": "Me gusta participar en juegos de observación.", "unidad": "Manada", "como_se_cumple": "Observando con agudeza los rasgos peculiares del terreno vegetal y las pistas escondidas en cada sector boscoso del campamento para avanzar hacia el botánico."},
    {"id": "418f2b77-f15b-405a-95bd-8033c0b6a4c2", "area": "Creatividad", "texto": "Puedo contar con detalles las anécdotas y aventuras que hemos tenido en la Manada.", "unidad": "Manada", "como_se_cumple": "Registrando y narrando con detalle los cinco elementos singulares del terreno y cada peripecia del rescate del botánico."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Aceptando las reglas de color exclusivo, el uso de sobres sellados y el turno diferido entre patrullas para que el juego sea justo y seguro."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando las reglas de no abrir los sobres y de no cruzarse entre las pistas de otros colores, aunque alguna resulte tentadora."},
    {"id": "99c6e695-ef0b-4e36-956b-3faf15ada355", "area": "Carácter", "texto": "Escucho a los demás lobatos, a mis papás y a mis dirigentes y guiadoras.", "unidad": "Manada", "como_se_cumple": "Escuchando atentamente las indicaciones de los guardias, contactos y dirigentes confabulados en cada posta del recorrido."},
    {"id": "3a84066e-ad27-4122-9a89-4ae45844668b", "area": "Carácter", "texto": "Tengo amigos y amigas con los que siempre juego y me encuentro.", "unidad": "Manada", "como_se_cumple": "Cooperando estrechamente con mis compañeros de seiscena para resolver acertijos y avanzar unidos en pos del botánico."},
    {"id": "49ae6ac6-be8f-4f2c-8b3e-6711d041181f", "area": "Creatividad", "texto": "Doy mi opinión sobre las cosas que me pasan.", "unidad": "Tropa", "como_se_cumple": "Opinando con criterio sobre cada acertijo y proponiendo rutas para interpretar las pistas que guían la patrulla hacia el botánico."},
    {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Tropa", "como_se_cumple": "Analizando la contraseña final desde varias interpretaciones silábicas y los mensajes desde ángulos distintos para destrabar el acceso al botánico."},
    {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "texto": "Conozco y respeto las principales normas de convivencia.", "unidad": "Tropa", "como_se_cumple": "Cumpliendo con las reglas de color exclusivo, los turnos diferidos y el uso honrado de las fichas de campamento y los sobres sellados."},
    {"id": "bbc48d53-f4aa-4de7-84d4-95614df76034", "area": "Sociabilidad", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "unidad": "Tropa", "como_se_cumple": "Respetando el recorrido y las treguas acordadas entre patrullas, aun cuando otro equipo parezca haber hallado un atajo hacia el botánico."},
    {"id": "f0bd8ba8-8b11-4988-8fb6-ad8e883c2a5b", "area": "Carácter", "texto": "Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.", "unidad": "Tropa", "como_se_cumple": "Acogiendo con lealtad las decisiones de la patrulla sobre qué pistas seguir y cómo repartir las fichas de campamento, aun sosteniendo una lectura distinta del acertijo."},
    {"id": "41aec261-3a8f-4f29-9c01-f539fe589fed", "area": "Carácter", "texto": "Opino y asumo responsabilidades en el Consejo de Patrulla.", "unidad": "Tropa", "como_se_cumple": "Asumiendo responsabilidades concretas en la patrulla: portar las fichas, custodiar el sobre sellado o guardar las cinco fotografías para entregarlas al guardián del botánico."},
    {"id": "e1b7276f-4fd2-4c39-a32a-bd7fadbee702", "area": "Creatividad", "texto": "Doy mi opinión sobre las cosas que me pasan.", "unidad": "Compañía", "como_se_cumple": "Dando mi opinión sobre las rutas de mi unidad y proponiendo interpretaciones para cada acertijo del recorrido hacia el botánico."},
    {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Compañía", "como_se_cumple": "Analizando la contraseña final desde varias interpretaciones y comparando los mensajes desde ángulos distintos para destrabar el rescate."},
    {"id": "85f8abea-eb57-4f78-9e11-5c2ab5d71044", "area": "Carácter", "texto": "Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.", "unidad": "Compañía", "como_se_cumple": "Acogiendo con lealtad las decisiones de mi patrulla sobre qué pistas seguir y cómo gastar las fichas de campamento, aun sosteniendo una lectura distinta del acertijo."},
    {"id": "e531fa27-a4f3-46df-b559-1f08e2d03ab3", "area": "Carácter", "texto": "Opino y asumo responsabilidades en el Consejo de Patrulla.", "unidad": "Compañía", "como_se_cumple": "Asumiendo responsabilidades concretas en la patrulla: custodiar el sobre sellado, guardar las fotografías o liderar el descifrado para el guardián del botánico."},
    {"id": "007e85ea-2b06-48c2-8ac1-873d59643aae", "area": "Sociabilidad", "texto": "Conozco y respeto las principales normas de convivencia.", "unidad": "Compañía", "como_se_cumple": "Cumpliendo las reglas de color exclusivo, los turnos diferidos y el uso honrado de las fichas de campamento y los sobres sellados."},
    {"id": "de2f5693-de4b-48f1-b870-3c62be99aea8", "area": "Sociabilidad", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "unidad": "Compañía", "como_se_cumple": "Respetando los recorridos y las treguas acordadas entre equipos, aun cuando otro parezca haber hallado un atajo hacia el botánico."}
  ]
}'::jsonb
)
RETURNING id;


-- ---------------------------------------------------------------------
-- Vincular categoría (Juegos id=7) mediante CTE explícita
-- ---------------------------------------------------------------------
WITH nuevo_art AS (
  SELECT id FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
)
INSERT INTO public.articulo_categorias (articulo_id, categoria_id)
SELECT id, 7 FROM nuevo_art
ON CONFLICT (articulo_id, categoria_id) DO NOTHING;


-- ---------------------------------------------------------------------
-- Vínculo 1:1 objetivos_educativos (UUIDs reales consultados de progresion_objetivos)
--  - Manada (unidad_id=1) – Infancia Media & Tardía
--  - Tropa   (unidad_id=3) – 11 a 13 años & 13 a 15 años
--  - Compañía (unidad_id=2) – 11 a 13 años & 13 a 15 años
--  Agrupados bajo tres texto_terminal clave:
--    "Actúa con agilidad mental..." (Creatividad),
--    "Cumple las normas..."         (Sociabilidad),
--    "Reconoce en su grupo..."      (Carácter)

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Observando con agudeza los rasgos peculiares del terreno vegetal y las pistas escondidas en cada sector boscoso del campamento para avanzar hacia el botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '418f2b77-f15b-405a-95bd-8033c0b6a4c2', 'Registrando y narrando con detalle los cinco elementos singulares del terreno y cada peripecia del rescate del botánico de mi seiscena.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando las reglas de color exclusivo, el uso de sobres sellados y el turno diferido entre patrullas para que el juego sea justo y seguro.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando las reglas de no abrir los sobres y de no cruzarse entre las pistas de otros colores, aunque alguna resulte tentadora.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '99c6e695-ef0b-4e36-956b-3faf15ada355', 'Escuchando atentamente las indicaciones de los guardias, contactos y dirigentes confabulados en cada posta del recorrido.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3a84066e-ad27-4122-9a89-4ae45844668b', 'Cooperando estrechamente con mis compañeros de seiscena para resolver acertijos y avanzar unidos en pos del botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '49ae6ac6-be8f-4f2c-8b3e-6711d041181f', 'Opinando con criterio sobre cada acertijo y proponiendo rutas para interpretar las pistas que guían la patrulla hacia el botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Analizando la contraseña final desde varias interpretaciones silábicas y los mensajes desde ángulos distintos para destrabar el acceso al botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Cumpliendo con las reglas de color exclusivo, los turnos diferidos y el uso honrado de las fichas de campamento y los sobres sellados.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Respetando el recorrido y las treguas acordadas entre patrullas, aun cuando otro equipo parezca haber hallado un atajo hacia el botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'f0bd8ba8-8b11-4988-8fb6-ad8e883c2a5b', 'Acogiendo con lealtad las decisiones de la patrulla sobre qué pistas seguir y cómo repartir las fichas de campamento, aun sosteniendo una lectura distinta del acertijo.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '41aec261-3a8f-4f29-9c01-f539fe589fed', 'Asumiendo responsabilidades concretas en la patrulla: portar las fichas, custodiar el sobre sellado o guardar las cinco fotografías para entregarlas al guardián del botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e1b7276f-4fd2-4c39-a32a-bd7fadbee702', 'Dando mi opinión sobre las rutas de mi unidad y proponiendo interpretaciones para cada acertijo del recorrido hacia el botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando la contraseña final desde varias interpretaciones y comparando los mensajes desde ángulos distintos para destrabar el rescate.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '85f8abea-eb57-4f78-9e11-5c2ab5d71044', 'Acogiendo con lealtad las decisiones de mi patrulla sobre qué pistas seguir y cómo gastar las fichas de campamento, aun sosteniendo una lectura distinta del acertijo.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'e531fa27-a4f3-46df-b559-1f08e2d03ab3', 'Asumiendo responsabilidades concretas en la patrulla: custodiar el sobre sellado, guardar las fotografías o liderar el descifrado para el guardián del botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '007e85ea-2b06-48c2-8ac1-873d59643aae', 'Cumpliendo las reglas de color exclusivo, los turnos diferidos y el uso honrado de las fichas de campamento y los sobres sellados.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

INSERT INTO public.articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Respetando los recorridos y las treguas acordadas entre equipos, aun cuando otro parezca haber hallado un atajo hacia el botánico.'
FROM public.articulos WHERE slug = 'el-secuestro-del-botanico'
ON CONFLICT (articulo_id, objetivo_id) DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

COMMIT;
