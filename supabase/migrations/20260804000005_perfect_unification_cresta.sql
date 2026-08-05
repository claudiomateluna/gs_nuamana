SET client_encoding = 'UTF8';
BEGIN;

UPDATE articulos 
SET metadata = '{"areas": ["corporalidad", "sociabilidad", "carácter"], "lugares": ["Exterior", "Campo Delimitado", "Cancha"], "cantidad": "16 participantes", "duracion": "15 minutos", "unidades": ["manada", "compañía", "tropa"], "objetivos": ["Estimular la agilidad", "Estimular la coordinación", "Reforzar la coordinación al interior del equipo", "Trabajo en equipo"], "materiales": ["Pelota"], "variaciones": "<b>Modalidad en Interior (Gimnasio):</b> Se realiza utilizando balones de goma espuma blanda sobre colchonetas. <b>Variante con pañolines:</b> El jugador que gatea por el túnel debe llevar un pañolín en la espalda y entregarlo al llegar al frente.", "recomendaciones": "<b>Seguridad y Espaciado:</b> Mantener una distancia adecuada de 2 metros entre patrullas colindantes para evitar colisiones durante el gateo. Verificar que la superficie del suelo esté despejada de piedras u objetos punzantes.", "justificacion_areas": "Esta actividad de relevos dinámicos y agilidad física ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Corporalidad:</b> Estimula el desarrollo psicomotor, la flexibilidad, la resistencia física y la coordinación óculo-manual al realizar pases aéreos y desplazamientos en cuadrupedia a gatas.\n\n2. <b>Sociabilidad:</b> Fortalece el trabajo en equipo, la sincronicidad colectiva y el apoyo mutuo en la patrulla al mantener la formación limpia durante el avance continuo de los compañeros.\n\n3. <b>Carácter:</b> Fomenta la perseverancia, la templanza bajo presión y la superación personal al mantener el ritmo del relevo sin desesperarse ni perder el control del balón.", "objetivos_educativos": [{"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "unidad": "Manada", "texto": "Me gusta practicar deportes.", "como_se_cumple": "Desarrollando la agilidad motriz y la destreza al participar con entusiasmo en la carrera de relevos."}, {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "unidad": "Manada", "texto": "Practico deportes, conozco sus reglas y sé perder.", "como_se_cumple": "Ejercitando la coordinación psicomotora al pasar el balón por la cresta y desplazarme a gatas por el túnel."}, {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "unidad": "Compañía", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Respetando las reglas de la competición deportiva y ejecutando pases ágiles dentro de la columna."}, {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "unidad": "Compañía", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Demostrando esfuerzo motriz y superación constante para acelerar la rotación del equipo sin soltar el balón."}, {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "unidad": "Tropa", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "como_se_cumple": "Ejercitando la rapidez de reflejos y la coordinación psicomotriz en cada pase aéreo y gateo."}, {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "unidad": "Tropa", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "como_se_cumple": "Exigiendo el máximo rendimiento motriz con deportividad al recuperar la primera posición de la fila."}, {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "unidad": "Manada", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "como_se_cumple": "Aceptando y cumpliendo con alegría las reglas del juego de relevos en la Manada."}, {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "unidad": "Manada", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "como_se_cumple": "Comprendiendo y respetando las indicaciones de partida y la formación ordenada de la columna."}, {"id": "007e85ea-2b06-48c2-8ac1-873d59643aae", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Respetando con disciplina las reglas de carrera y la rotación limpia del relevo."}, {"id": "de2f5693-de4b-48f1-b870-3c62be99aea8", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Promoviendo el fair play y el acatamiento riguroso de las instrucciones de partida."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Cumpliendo con honestidad las indicaciones de espaciado e inmovilidad de la columna."}, {"id": "bbc48d53-f4aa-4de7-84d4-95614df76034", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Aceptando con madurez el arbitraje y fomentando la sana convivencia en la competición."}, {"id": "041daaea-c4a7-472b-a613-951bd25cfa85", "area": "Carácter", "unidad": "Manada", "texto": "Reconozco y acepto mis errores.", "como_se_cumple": "Aceptando con serenidad y fair play los desaciertos durante la carrera sin culpar a mi equipo."}, {"id": "4df1ba93-06fe-4f49-b273-fddc3800cf17", "area": "Carácter", "unidad": "Manada", "texto": "Le doy importancia a las cosas que hago bien.", "como_se_cumple": "Valorando el esfuerzo colectivo al completar limpiamente el ciclo de carreras."}, {"id": "2cc128e0-7cc6-49df-a7c5-825f6ab79793", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que puedo ser cada día mejor.", "como_se_cumple": "Demostrando superación personal y esfuerzo constante en el ritmo de los relevos."}, {"id": "006c5b09-47cf-4ed8-bf25-212203261a03", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Confiando en mis capacidades motrices para ejecutar pases limpios y veloces."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Manteniendo la calma y la concentración bajo la intensidad física de la competencia."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Asumiendo el desafío con determinación y espíritu scout en cada turno del túnel."}]}'::jsonb, updated_at = NOW()
WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';

DELETE FROM articulo_objetivos_educativos 
WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel');


INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Desarrollando la agilidad motriz y la destreza al participar con entusiasmo en la carrera de relevos.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Ejercitando la coordinación psicomotora al pasar el balón por la cresta y desplazarme a gatas por el túnel.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '1427451e-b8b3-493b-8525-e53298381e07', 'Respetando las reglas de la competición deportiva y ejecutando pases ágiles dentro de la columna.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b12da732-d736-480c-82b8-95b312316390', 'Demostrando esfuerzo motriz y superación constante para acelerar la rotación del equipo sin soltar el balón.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0765469b-caef-4457-9d6b-cb739c855402', 'Ejercitando la rapidez de reflejos y la coordinación psicomotriz en cada pase aéreo y gateo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Exigiendo el máximo rendimiento motriz con deportividad al recuperar la primera posición de la fila.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando y cumpliendo con alegría las reglas del juego de relevos en la Manada.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Comprendiendo y respetando las indicaciones de partida y la formación ordenada de la columna.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '007e85ea-2b06-48c2-8ac1-873d59643aae', 'Respetando con disciplina las reglas de carrera y la rotación limpia del relevo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Promoviendo el fair play y el acatamiento riguroso de las instrucciones de partida.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '857f21bc-db3c-4e5e-bcd5-d3d331276fad', 'Cumpliendo con honestidad las indicaciones de espaciado e inmovilidad de la columna.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Aceptando con madurez el arbitraje y fomentando la sana convivencia en la competición.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '041daaea-c4a7-472b-a613-951bd25cfa85', 'Aceptando con serenidad y fair play los desaciertos durante la carrera sin culpar a mi equipo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '4df1ba93-06fe-4f49-b273-fddc3800cf17', 'Valorando el esfuerzo colectivo al completar limpiamente el ciclo de carreras.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '2cc128e0-7cc6-49df-a7c5-825f6ab79793', 'Demostrando superación personal y esfuerzo constante en el ritmo de los relevos.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '006c5b09-47cf-4ed8-bf25-212203261a03', 'Confiando en mis capacidades motrices para ejecutar pases limpios y veloces.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '62876ebe-214f-4caf-b164-664e12fd30ae', 'Manteniendo la calma y la concentración bajo la intensidad física de la competencia.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '78bd48d3-5d26-4218-843a-33712bade630', 'Asumiendo el desafío con determinación y espíritu scout en cada turno del túnel.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    
COMMIT;