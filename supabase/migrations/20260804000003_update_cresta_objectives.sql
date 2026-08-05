SET client_encoding = 'UTF8';
BEGIN;

UPDATE articulos 
SET metadata = '{"areas": ["corporalidad", "sociabilidad", "carácter"], "lugares": ["Exterior", "Campo Delimitado", "Cancha"], "cantidad": "16 participantes", "duracion": "15 minutos", "unidades": ["manada", "compañía", "tropa"], "objetivos": ["Estimular la agilidad", "Estimular la coordinación", "Reforzar la coordinación al interior del equipo", "Trabajo en equipo"], "materiales": ["Pelota"], "variaciones": "<b>Modalidad en Interior (Gimnasio):</b> Se realiza utilizando balones de goma espuma blanda sobre colchonetas. <b>Variante con pañolines:</b> El jugador que gatea por el túnel debe llevar un pañolín en la espalda y entregarlo al llegar al frente.", "recomendaciones": "<b>Seguridad y Espaciado:</b> Mantener una distancia adecuada de 2 metros entre patrullas colindantes para evitar colisiones durante el gateo. Verificar que la superficie del suelo esté despejada de piedras u objetos punzantes.", "justificacion_areas": "Esta actividad de relevos dinámicos y agilidad física ejercita tres áreas clave del desarrollo scout:\n\n1. <b>Corporalidad:</b> Estimula el desarrollo psicomotor, la flexibilidad, la resistencia física y la coordinación óculo-manual al realizar pases aéreos y desplazamientos en cuadrupedia a gatas.\n\n2. <b>Sociabilidad:</b> Fortalece el trabajo en equipo, la sincronicidad colectiva y el apoyo mutuo en la patrulla al mantener la formación limpia durante el avance continuo de los compañeros.\n\n3. <b>Carácter:</b> Fomenta la perseverancia, la templanza bajo presión y la superación personal al mantener el ritmo del relevo sin desesperarse ni perder el control del balón.", "objetivos_educativos": [{"id": "0956c462-5ae8-4a34-8a7d-c08a9b092516", "area": "Corporalidad", "unidad": "Manada", "texto": "Trato de seguir los consejos que me dan los más grandes para tener un cuerpo fuerte y sano.", "como_se_cumple": "Siguiendo con atención los movimientos del relevo para mantener el equilibrio y la agilidad corporal."}, {"id": "626a313e-0407-4cfd-b714-c6aa6e51738c", "area": "Corporalidad", "unidad": "Manada", "texto": "Manejo cada vez mejor mis brazos, piernas, manos y pies.", "como_se_cumple": "Ejercitando la coordinación psicomotora al pasar el balón por la cresta y desplazarme a gatas por el túnel."}, {"id": "273f60b8-7953-4416-97c3-e8c83615364f", "area": "Corporalidad", "unidad": "Compañía", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "como_se_cumple": "Desarrollando la flexibilidad muscular y la resistencia física en el desplazamiento en cuadrupedia."}, {"id": "91473f71-9345-4bcf-bfc7-dea709d12361", "area": "Corporalidad", "unidad": "Compañía", "texto": "Respeto mi cuerpo y el de los demás.", "como_se_cumple": "Respetando el espacio físico de mis compañeros al avanzar velozmente por entre sus piernas."}, {"id": "5c9843d1-39fd-4298-870c-5e46f29ffbf6", "area": "Corporalidad", "unidad": "Tropa", "texto": "Participo en actividades que me ayudan a mantener mi cuerpo fuerte y sano.", "como_se_cumple": "Ejercitando la fuerza y la velocidad en la formación en columna."}, {"id": "fb56310a-a9cf-46e3-9c34-c4643f6b9035", "area": "Corporalidad", "unidad": "Tropa", "texto": "Respeto mi cuerpo y el de los demás.", "como_se_cumple": "Manteniendo el autocontrol y la solidez física al estar en la primera línea de relevo."}, {"id": "7449ad52-5047-4116-b71b-1937cca85587", "area": "Sociabilidad", "unidad": "Manada", "texto": "Cumplo las tareas de servicio que me encargan en la Manada.", "como_se_cumple": "Cumpliendo con lealtad y entusiasmo mi turno en la hilera del relevo."}, {"id": "27a71b44-9900-46e9-be75-38900c629663", "area": "Sociabilidad", "unidad": "Manada", "texto": "Ayudo siempre en las tareas de servicio que se deben hacer en la Manada.", "como_se_cumple": "Apoyando en equipo la posición de mis compañeros para facilitar el paso fluido del balón."}, {"id": "007e85ea-2b06-48c2-8ac1-873d59643aae", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Respetando con disciplina las reglas de carrera y la rotación limpia del relevo."}, {"id": "de2f5693-de4b-48f1-b870-3c62be99aea8", "area": "Sociabilidad", "unidad": "Compañía", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Promoviendo el fair play y el acatamiento riguroso de las instrucciones de partida."}, {"id": "857f21bc-db3c-4e5e-bcd5-d3d331276fad", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Conozco y respeto las principales normas de convivencia.", "como_se_cumple": "Cumpliendo con honestidad las indicaciones de espaciado e inmovilidad de la columna."}, {"id": "bbc48d53-f4aa-4de7-84d4-95614df76034", "area": "Sociabilidad", "unidad": "Tropa", "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.", "como_se_cumple": "Aceptando con madurez el arbitraje y fomentando la sana convivencia en la competición."}, {"id": "041daaea-c4a7-472b-a613-951bd25cfa85", "area": "Carácter", "unidad": "Manada", "texto": "Reconozco y acepto mis errores.", "como_se_cumple": "Aceptando con serenidad y fair play los desaciertos durante la carrera sin culpar a mi equipo."}, {"id": "4df1ba93-06fe-4f49-b273-fddc3800cf17", "area": "Carácter", "unidad": "Manada", "texto": "Le doy importancia a las cosas que hago bien.", "como_se_cumple": "Valorando el esfuerzo colectivo al completar limpiamente el ciclo de carreras."}, {"id": "2cc128e0-7cc6-49df-a7c5-825f6ab79793", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que puedo ser cada día mejor.", "como_se_cumple": "Demostrando superación personal y esfuerzo constante en el ritmo de los relevos."}, {"id": "006c5b09-47cf-4ed8-bf25-212203261a03", "area": "Carácter", "unidad": "Compañía", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Confiando en mis capacidades motrices para ejecutar pases limpios y veloces."}, {"id": "62876ebe-214f-4caf-b164-664e12fd30ae", "area": "Carácter", "unidad": "Tropa", "texto": "Me gusta participar en actividades que me ayudan a conocerme.", "como_se_cumple": "Manteniendo la calma y la concentración bajo la intensidad física de la competencia."}, {"id": "78bd48d3-5d26-4218-843a-33712bade630", "area": "Carácter", "unidad": "Tropa", "texto": "Sé que soy capaz de hacer cosas y de hacerlas bien.", "como_se_cumple": "Asumiendo el desafío con determinación y espíritu scout en cada turno del túnel."}]}'::jsonb, updated_at = NOW()
WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';

DELETE FROM articulo_objetivos_educativos 
WHERE articulo_id = (SELECT id FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel');


INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '0956c462-5ae8-4a34-8a7d-c08a9b092516', 'Siguiendo con atención los movimientos del relevo para mantener el equilibrio y la agilidad corporal.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Ejercitando la coordinación psicomotora al pasar el balón por la cresta y desplazarme a gatas por el túnel.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '273f60b8-7953-4416-97c3-e8c83615364f', 'Desarrollando la flexibilidad muscular y la resistencia física en el desplazamiento en cuadrupedia.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '91473f71-9345-4bcf-bfc7-dea709d12361', 'Respetando el espacio físico de mis compañeros al avanzar velozmente por entre sus piernas.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '5c9843d1-39fd-4298-870c-5e46f29ffbf6', 'Ejercitando la fuerza y la velocidad en la formación en columna.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, 'fb56310a-a9cf-46e3-9c34-c4643f6b9035', 'Manteniendo el autocontrol y la solidez física al estar en la primera línea de relevo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '7449ad52-5047-4116-b71b-1937cca85587', 'Cumpliendo con lealtad y entusiasmo mi turno en la hilera del relevo.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
SELECT id, '27a71b44-9900-46e9-be75-38900c629663', 'Apoyando en equipo la posición de mis compañeros para facilitar el paso fluido del balón.' FROM articulos WHERE slug = 'el-relevo-de-la-cresta-y-el-tunel';
    

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