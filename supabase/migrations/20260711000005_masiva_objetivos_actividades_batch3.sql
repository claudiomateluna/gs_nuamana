-- Migración masiva para registrar los objetivos educativos de 12 actividades scout (Batch 3)
-- Asegura consistencia pedagógica completa: todos los objetivos pertenecen a las mismas dimensiones/objetivos terminales.

-- 1. Limpiar relaciones anteriores de los 12 artículos
DELETE FROM public.articulo_objetivos_educativos 
WHERE articulo_id IN (
  '0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', -- Relevos de Botones
  '44899c38-5ae2-4250-a6d5-955ef4158bb2', -- Carrera de Cuncunas
  '349af827-90bc-47e4-9fe0-7cca4ba7302f', -- Carrera de Trenes
  '15f46795-7117-4553-beaa-dff74860a6b1', -- Carrera de Velas
  '6b441dc2-22fa-441a-87e4-b0ce49b52c45', -- Carrera de Maletas Con Carga
  '5c308bc8-970e-4321-ac02-762b44db8a19', -- El Jardinero
  '3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', -- Nuestras Cualidades
  'cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', -- Mano con mano
  '400ec7fa-74c3-4fb4-b053-c238fc8cd8db', -- ¿Eres Drácula?
  'fd254b06-1ce1-46e1-bbcd-631170b07f1b', -- Enredados
  '334dd057-0cda-4817-b473-e45367277f73', -- Una torre alta firme y hermosa
  '953f10a6-f9d4-4760-8414-2192d4ba8d48'  -- Capturar la bandera
);

-- 2. Insertar relaciones corregidas y pedagógicamente coherentes
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  -- Relevos de Botones (0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6)
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', 'd9ebcd96-c9cf-444f-94fb-5569110a1b99', 'Corriendo con velocidad hacia la estación de los botones para iniciar la tarea de precisión.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Enhebrando con pulso firme el hilo en los orificios del botón sin que se deslice de los dedos.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '0ba0d3c3-a50a-4a04-8981-601dc7746dd6', 'Controlando la respiración y los movimientos finos para facilitar el enhebrado rápido bajo la presión de la carrera.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '4946a6aa-4a9f-4e7b-89a3-cb5249db8257', 'Controlando la respiración y los movimientos finos para facilitar el enhebrado rápido bajo la presión de la carrera.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '52d9399a-4bf1-4010-a7ca-682b7d1c22a8', 'Ejercitando la concentración y el control visomotor en tareas manuales que requieren paciencia e inmovilidad.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '333453ab-e111-4f06-b0e3-a3e7f06b2439', 'Ejercitando la concentración y el control visomotor en tareas manuales que requieren paciencia e inmovilidad.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Respetando el lugar de salida y entregando el turno a su compañero sin cometer faltas de largada.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Traspasando el hilo y los botones ordenadamente de acuerdo con las especificaciones acordadas en el reglamento del juego.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Acordando colectivamente qué compañero enhebrará en primer lugar para optimizar la velocidad del grupo.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Acordando colectivamente qué compañero enhebrará en primer lugar para optimizar la velocidad del grupo.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Velando porque los competidores del equipo no asistan físicamente al corredor en la mesa de enhebrado.'),
  ('0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Velando porque los competidores del equipo no asistan físicamente al corredor en la mesa de enhebrado.'),

  -- Carrera de Cuncunas (44899c38-5ae2-4250-a6d5-955ef4158bb2)
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', '1427451e-b8b3-493b-8525-e53298381e07', 'Avanzando de manera coordinada sin soltar los tobillos del compañero de adelante.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', '0765469b-caef-4457-9d6b-cb739c855402', 'Avanzando de manera coordinada sin soltar los tobillos del compañero de adelante.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', 'b12da732-d736-480c-82b8-95b312316390', 'Ejercitando la fuerza de piernas y la resistencia muscular al avanzar en cuclillas a paso rápido.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Ejercitando la fuerza de piernas y la resistencia muscular al avanzar en cuclillas a paso rápido.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Demostrando condición y destreza física para sostener el ritmo aeróbico de la cuncuna durante el trayecto de la carrera.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', '106e27af-ec7a-45fa-9295-fcef88fbef3d', 'Liderando físicamente el avance de la cadena, motivando la resistencia muscular de sus compañeros del Clan.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Proponiendo técnicas de coordinación colectiva ("izquierda, derecha...") para avanzar sin romper el ritmo de la cuncuna.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Proponiendo técnicas de coordinación colectiva ("izquierda, derecha...") para avanzar sin romper el ritmo de la cuncuna.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Acatando la regla de detenerse y rearmar la cadena si algún miembro se suelta de los tobillos.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Acatando la regla de detenerse y rearmar la cadena si algún miembro se suelta de los tobillos.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Colaborando cordialmente al avanzar coordinados, respetando el fair play de la competencia grupal.'),
  ('44899c38-5ae2-4250-a6d5-955ef4158bb2', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Asegurando que el ritmo de marcha adoptado por el Clan no ponga en riesgo de lesiones articulares a ninguno de sus integrantes.'),

  -- Carrera de Trenes (349af827-90bc-47e4-9fe0-7cca4ba7302f)
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', '1427451e-b8b3-493b-8525-e53298381e07', 'Corriendo alineados de forma constante sin soltar la cintura de la persona que antecede.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', '0765469b-caef-4457-9d6b-cb739c855402', 'Corriendo alineados de forma constante sin soltar la cintura de la persona que antecede.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por correr a alta velocidad sincronizando las zancadas con sus compañeros de patrulla.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por correr a alta velocidad sincronizando las zancadas con sus compañeros de patrulla.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Desplegando resistencia cardiovascular e intensidad de carrera durante las mangas consecutivas del juego.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando para definir el orden táctico de los corredores en el tren para evitar tropiezos de altura.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando para definir el orden táctico de los corredores en el tren para evitar tropiezos de altura.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de detener la carrera y retroceder si algún vagón de la fila se desengancha de la cintura.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de detener la carrera y retroceder si algún vagón de la fila se desengancha de la cintura.'),
  ('349af827-90bc-47e4-9fe0-7cca4ba7302f', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Acatando con madurez y espíritu scout los fallos de los jueces de pista en caso de descalificaciones.'),

  -- Carrera de Velas (15f46795-7117-4553-beaa-dff74860a6b1)
  ('15f46795-7117-4553-beaa-dff74860a6b1', '12686e7d-d6af-4c74-928d-c859d5b883d5', 'Acordando tácticas con su patrulla para cubrir la vela usando las manos o pañolines de forma segura.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', 'e465926e-deed-4341-956f-047f56860e5e', 'Acordando tácticas con su patrulla para cubrir la vela usando las manos o pañolines de forma segura.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', '0009f64a-0654-46bf-b6fc-7b9d7f278485', 'Analizando la dirección del viento y ajustando la orientación del cuerpo al caminar para salvaguardar la flama.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', '3d0dff9b-11cd-4a30-b3a6-ec011ad95062', 'Analizando la dirección del viento y ajustando la orientación del cuerpo al caminar para salvaguardar la flama.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', '310eb631-8ca9-4eaf-ac80-232a5150d024', 'Proponiendo variaciones divertidas de la dinámica (relevos, cruzar túneles de viento) para desafiar a la Avanzada.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', 'ef75fbed-4a6d-49ea-bfab-f2952415e1a0', 'Improvisando métodos de protección de cera y flama de manera inmediata ante ráfagas de aire imprevistas en la carrera.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Debatiendo qué compañero correrá en el relevo más expuesto al viento.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Debatiendo qué compañero correrá en el relevo más expuesto al viento.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la directriz de regresar a encender la vela en la zona de fósforos en caso de apagarse.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la directriz de regresar a encender la vela en la zona de fósforos en caso de apagarse.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Respetando las indicaciones de prevención y manejo seguro del fuego para evitar quemaduras accidentales en el grupo.'),
  ('15f46795-7117-4553-beaa-dff74860a6b1', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Asegurando la recolección completa de restos de cera y fósforos en el terreno tras culminar la carrera.'),

  -- Carrera de Maletas Con Carga (6b441dc2-22fa-441a-87e4-b0ce49b52c45)
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', 'a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5', 'Corriendo con entusiasmo en su turno de carrera llevando el bolso/maleta de la seisena.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Corriendo con la maleta a paso rápido y abriéndola de forma veloz para no perder tiempo de carrera.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', '1427451e-b8b3-493b-8525-e53298381e07', 'Trasladando la maleta de forma coordinada, pasándola ordenadamente a su compañera en la línea de relevo.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', '0765469b-caef-4457-9d6b-cb739c855402', 'Trasladando la maleta de forma coordinada, pasándola ordenadamente a su compañero en la línea de relevo.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por optimizar el tiempo de carrera de patrulla, asumiendo con deportividad la victoria o derrota.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por optimizar el tiempo de carrera de patrulla, asumiendo con deportividad la victoria o derrota.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Respetando la regla de vestir todas las prendas asignadas antes de retomar la carrera hacia la meta.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando el turno de largada y cooperando con el orden de las ropas en la maleta al finalizar.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Opinando para acordar con su equipo cómo empacar eficientemente las ropas en la maleta.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Opinando para acordar con su equipo cómo empacar eficientemente las ropas en la maleta.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Velando por el cuidado y la integridad física de los competidores al cruzarse en la zona de vestir.'),
  ('6b441dc2-22fa-441a-87e4-b0ce49b52c45', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Velando por el cuidado y la integridad física de los competidores al cruzarse en la zona de vestir.'),

  -- El Jardinero (5c308bc8-970e-4321-ac02-762b44db8a19)
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '818d8a25-549b-4e01-a830-e50d73e39025', 'Reconociendo y dominando el temor natural de avanzar a ciegas en un terreno desconocido.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '03ccaf4c-03c4-42a8-b311-47fef60f204c', 'Reconociendo y dominando el temor natural de avanzar a ciegas en un terreno desconocido.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '67a2f0fa-9b1e-4b7b-bda2-e25696c87898', 'Controlando la marcha y manteniendo la calma a pesar del ruido ambiental y de perder la orientación.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '74e6c7e0-f9f6-47d3-acdb-d6df315ef123', 'Controlando la marcha y manteniendo la calma a pesar del ruido ambiental y de perder la orientación.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '4a2eef1b-1971-4b0b-ac6a-f4f653988403', 'Asumiendo con buen ánimo las equivocaciones en las señales auditivas que le provocaron chocar con los árboles.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '07d61bf7-36fc-40f6-8f8e-21fe97b169f0', 'Demostrando serenidad y plena confianza en el guiado auditivo de sus compañeros de equipo.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Proponiendo la clave de sonidos que usarán los "árboles" para guiar de forma eficiente al jardinero.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Proponiendo la clave de sonidos que usarán los "árboles" para guiar de forma eficiente al jardinero.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de no soplar palabras o dar indicaciones directas si su rol es el de "árbol silencioso".'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de no soplar palabras o dar indicaciones directas si su rol es el de "árbol silencioso".'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Acatando la supervisión de seguridad de los dirigentes en la distribución de los participantes para evitar tropiezos.'),
  ('5c308bc8-970e-4321-ac02-762b44db8a19', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Asegurando que las distancias de juego y el nivelado del terreno sean evaluados responsablemente antes de vendar a los participantes.'),

  -- Nuestras Cualidades (3ba7a8ca-6f46-475c-9b6e-d9f09836b21c)
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', 'b17b867f-9ff4-43f1-ae48-d8933e29298f', 'Reconociendo qué emociones motivan su decisión de correr al centro al mencionarse determinada cualidad.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', 'bb4bbc06-8313-45b2-b06e-c2a52a3d9322', 'Expresando ante sus compañeras de patrulla por qué se identifica con el valor o cualidad propuesta.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', '81298790-d245-48c6-8b1b-266b218c69da', 'Identificando rasgos propios y diferenciadores de su carácter en el ejercicio del círculo.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', '07d61bf7-36fc-40f6-8f8e-21fe97b169f0', 'Compartiendo sus fortalezas y debilidades con plena madurez emocional ante los miembros del Clan.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', '2845964c-1778-4ed7-8284-c5d830ea0a0d', 'Asumiendo con lealtad sus virtudes y valores de manera pública en el círculo de juego.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', 'c4fe900a-9641-4cad-a265-3f31073d83cb', 'Explicando con coherencia y honestidad ejemplos reales de su vida que reflejan la cualidad asumida.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', 'ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba', 'Reflexionando sobre si sus acciones cotidianas coinciden verdaderamente con la cualidad que declara tener.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', '770a8ff3-7bb8-45dd-b114-5ae1069eff62', 'Asumiendo compromisos de coherencia ética basados en las cualidades destacadas en la plenaria del Clan.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', 'fce82191-77ea-444b-89d9-e33b62a323a5', 'Escuchando y valorando positivamente las cualidades descritas por sus compañeras sin emitir juicios o burlas.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', 'ea86ecee-b201-4a49-be9d-4e55de7ffe8c', 'Reconociendo la igual validez e importancia de las cualidades de cada integrante del grupo.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', '007591fb-a2b6-4fb5-9286-acde65455f53', 'Garantizando que todos los miembros de la Avanzada tengan el mismo espacio y tiempo para exponer sus cualidades en un marco de dignidad.'),
  ('3ba7a8ca-6f46-475c-9b6e-d9f09836b21c', 'b5a81328-5c07-41bd-a1ea-1ed401762841', 'Promoviendo que el debate del Clan destaque la complementariedad de las virtudes individuales en favor de la solidaridad grupal.'),

  -- Mano con mano (cfb5d456-9514-45e1-a62d-e47ca7d9d8e8)
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '80102a2d-bc83-41fc-85ab-d98b42dbca76', 'Expresando de forma espontánea qué sintió al tomar contacto físico con las manos de sus compañeros.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '66de9e77-aa53-48a1-98db-9de3d3958486', 'Compartiendo en el consejo de seisena su comodidad o timidez durante el desarrollo de la dinámica.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '818d8a25-549b-4e01-a830-e50d73e39025', 'Conversando abiertamente sobre el miedo o resistencia al contacto corporal cercano.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '03ccaf4c-03c4-42a8-b311-47fef60f204c', 'Conversando abiertamente sobre el miedo o resistencia al contacto corporal cercano.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '67a2f0fa-9b1e-4b7b-bda2-e25696c87898', 'Manteniendo una actitud de respeto y seriedad ante el contacto físico, evitando bromas incómodas.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '74e6c7e0-f9f6-47d3-acdb-d6df315ef123', 'Manteniendo una actitud de respeto y seriedad ante el contacto físico, evitando bromas incómodas.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '84988974-0afa-4fa1-9abc-8923a0d53451', 'Canalizando las emociones de incomodidad hacia reflexiones constructivas sobre el espacio personal.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'baa365a9-087c-4c25-b0ad-57893df5ff74', 'Siendo honesto al manifestar si alguna posición de contacto le incomoda o le agrada.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '506b7596-cac4-48e0-88c7-942d575172db', 'Declarando con sinceridad si prefirió apartarse o cambiar de pareja en el transcurso del juego.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '2845964c-1778-4ed7-8284-c5d830ea0a0d', 'Fijando y respetando sus propios límites personales frente al contacto físico de forma clara y asertiva.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'f77525b1-07a3-4188-9051-4d3ba86aadfc', 'Fijando y respetando sus propios límites personales frente al contacto físico de forma clara y asertiva.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'c4fe900a-9641-4cad-a265-3f31073d83cb', 'Respetando de forma integral las directrices del facilitador sobre el consentimiento y cuidado corporal.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Respetando de forma integral las directrices del facilitador sobre el consentimiento y cuidado corporal.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba', 'Manteniendo una conducta ética intachable frente al contacto físico de sus compañeras de Avanzada.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'cfa10133-c25c-4deb-aebe-a00f8fe3f7ef', 'Colaborando cordialmente al dar la mano a lobatos de otras seisenas.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'd15e8733-8e84-44e4-9e9c-f8090e201b6e', 'Vinculando el ejercicio al derecho de protección e intangibilidad de su propio cuerpo.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'fce82191-77ea-444b-89d9-e33b62a323a5', 'Aceptando formar pareja con cualquier integrante sin discriminar su apariencia física.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'a3d7abdf-ca3b-42b8-92b5-403958fb537c', 'Aceptando formar pareja con cualquier integrante sin discriminar su apariencia física.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', 'ea86ecee-b201-4a49-be9d-4e55de7ffe8c', 'Resguardando el espacio vital y las sensibilidades físicas expresadas por sus compañeras.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '9e3ce0d2-2b56-4d1e-9135-029cfaaa0e6b', 'Resguardando el espacio vital y las sensibilidades físicas expresadas por sus compañeros.'),
  ('cfb5d456-9514-45e1-a62d-e47ca7d9d8e8', '007591fb-a2b6-4fb5-9286-acde65455f53', 'Garantizando que las relaciones e interacciones físicas se conduzcan con absoluto respeto por la dignidad e integridad.'),

  -- ¿Eres Drácula? (400ec7fa-74c3-4fb4-b053-c238fc8cd8db)
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', 'baa365a9-087c-4c25-b0ad-57893df5ff74', 'Respondiendo con honestidad si es o no Drácula al ser consultado de forma directa en el juego.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', '506b7596-cac4-48e0-88c7-942d575172db', 'Aceptando en voz alta su transformación en vampiro de forma inmediata al recibir el toque secreto, respetando el curso del juego.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', '2845964c-1778-4ed7-8284-c5d830ea0a0d', 'Respetando las reglas del personaje secreto de Drácula, evitando hacer trampas al desplazarse con los ojos cerrados.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', 'f77525b1-07a3-4188-9051-4d3ba86aadfc', 'Respetando las reglas del personaje secreto de Drácula, evitando hacer trampas al desplazarse con los ojos cerrados.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', 'c4fe900a-9641-4cad-a265-3f31073d83cb', 'Fundamentando en el foro final qué nivel de confianza o incertidumbre le produjo estar a ciegas rodeado de amenazas.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Fundamentando en el foro final qué nivel de confianza o incertidumbre le produjo estar a ciegas rodeado de amenazas.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Acatando la regla de no abrir los ojos bajo ninguna circunstancia a menos que se declare el fin del juego.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Desplazándose lentamente con las manos al frente de forma segura para no chocar o lastimar a los lobatos.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Aportando ideas en el diseño de los límites del campo para garantizar que la zona sea segura para caminar a ciegas.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Aportando ideas en el diseño de los límites del campo para garantizar que la zona sea segura para caminar a ciegas.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Acatando el silencio estricto que debe guardar Drácula y sus víctimas antes de emitir el grito de mordida.'),
  ('400ec7fa-74c3-4fb4-b053-c238fc8cd8db', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Acatando el silencio estricto que debe guardar Drácula y sus víctimas antes de emitir el grito de mordida.'),

  -- Enredados (fd254b06-1ce1-46e1-bbcd-631170b07f1b)
  ('fd254b06-1ce1-46e1-bbcd-631170b07f1b', 'd9ebcd96-c9cf-444f-94fb-5569110a1b99', 'Flexionando el tronco y extremidades para deslizarse bajo los brazos de sus compañeros de seisena.'),
  ('fd254b06-1ce1-46e1-bbcd-631170b07f1b', '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Coordinando giros de articulaciones y pasos elevados para desenredar el círculo sin perder el equilibrio.'),
  ('fd254b06-1ce1-46e1-bbcd-631170b07f1b', 'ec280dd0-2d80-4b84-86ad-2d362da14886', 'Observando con atención qué cruces de brazos están bloqueando el nudo para idear el siguiente movimiento.'),
  ('fd254b06-1ce1-46e1-bbcd-631170b07f1b', 'dcdcce42-6b31-45f7-a135-290f0f74b5a6', 'Proponiendo de forma mental e intuitiva qué giros y secuencias de pasos ayudarán a destrabar el círculo.'),
  ('fd254b06-1ce1-46e1-bbcd-631170b07f1b', 'baa365a9-087c-4c25-b0ad-57893df5ff74', 'Manteniendo las manos bien sujetas sin soltarse disimuladamente ante posiciones complejas o incómodas.'),
  ('fd254b06-1ce1-46e1-bbcd-631170b07f1b', '506b7596-cac4-48e0-88c7-942d575172db', 'Reconociendo de forma honesta si se le resbaló el agarre de manos, solicitando reiniciar el nudo de forma transparente.'),

  -- Una torre alta firme y hermosa (334dd057-0cda-4817-b473-e45367277f73)
  ('334dd057-0cda-4817-b473-e45367277f73', '103661fc-3396-4eac-9182-58b7e54d5115', 'Doblando, enrollando y uniendo los periódicos y palos para conformar la base de la torre.'),
  ('334dd057-0cda-4817-b473-e45367277f73', '11320fb6-98de-4725-825d-db858e3bffa2', 'Doblando, enrollando y uniendo los periódicos y palos para conformar la base de la torre.'),
  ('334dd057-0cda-4817-b473-e45367277f73', '0f60be94-6de3-4c34-a6ff-5b5018f0b156', 'Cuidando que no se estropeen o desperdicien los materiales de maqueta asignados a la patrulla durante la construcción.'),
  ('334dd057-0cda-4817-b473-e45367277f73', 'fd3d3e14-e92b-4ab5-8298-9018c6e70b20', 'Cuidando que no se estropeen o desperdicien los materiales de maqueta asignados a la patrulla durante la construcción.'),
  ('334dd057-0cda-4817-b473-e45367277f73', '843fda9c-6c4a-4516-b30c-23c92ef755a8', 'Ideando empalmes y arriostramientos estables en la estructura para contrarrestar la oscilación y caídas.'),
  ('334dd057-0cda-4817-b473-e45367277f73', '29eee8b1-a414-4df9-90e1-520a384fb9aa', 'Aplicando principios básicos de física, equilibrio y centro de gravedad para que la estructura sea alta y firme.'),
  ('334dd057-0cda-4817-b473-e45367277f73', '9478b46f-6f74-4a7e-bf9c-d66caaba1381', 'Efectuando de manera puntal y concentrada el rol de soporte asignado por la patrulla (ej: cortar cinta, enrollar diario).'),
  ('334dd057-0cda-4817-b473-e45367277f73', '5ff08326-49d9-4f83-8ffd-9b4b83425a95', 'Efectuando de manera puntal y concentrada el rol de soporte asignado por la patrulla (ej: cortar cinta, enrollar diario).'),
  ('334dd057-0cda-4817-b473-e45367277f73', '8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25', 'Respetando el diseño global convenido por la patrulla, adaptando sus aportes individuales al beneficio de la estructura común.'),
  ('334dd057-0cda-4817-b473-e45367277f73', '0d3af46a-d64c-4e59-a765-1f72dc41ba76', 'Respetando el diseño global convenido por la patrulla, adaptando sus aportes individuales al beneficio de la estructura común.'),
  ('334dd057-0cda-4817-b473-e45367277f73', '5abfbe81-75e4-4444-b52d-38e59e8b6ec7', 'Colaborando activamente en la recolección, ordenamiento y limpieza del salón de trabajo una vez concluida la prueba.'),
  ('334dd057-0cda-4817-b473-e45367277f73', 'b5a81328-5c07-41bd-a1ea-1ed401762841', 'Asegurando que todas las propuestas de diseño y modelado de los integrantes del Clan sean escuchadas y evaluadas en plenaria.'),

  -- Capturar la bandera (953f10a6-f9d4-4760-8414-2192d4ba8d48)
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', '1427451e-b8b3-493b-8525-e53298381e07', 'Corriendo activamente por el terreno delimitado evitando traspasar los límites prohibidos.'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', '0765469b-caef-4457-9d6b-cb739c855402', 'Corriendo activamente por el terreno delimitado evitando traspasar los límites prohibidos.'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', 'b12da732-d736-480c-82b8-95b312316390', 'Esforzándose por diseñar y ejecutar carreras rápidas de distracción para favorecer el ingreso de su patrulla.'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Esforzándose por diseñar y ejecutar carreras rápidas de distracción para favorecer el ingreso de su patrulla.'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', 'f4c586e3-6a99-41f5-8fcb-a15886e93337', 'Demostrando óptima resistencia cardiovascular y velocidad de aceleración en las persecuciones en territorio adverso.'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Proponiendo roles tácticos dentro de la patrulla (defensores de bandera, rescatistas de la cárcel, corredores).'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Proponiendo roles tácticos dentro de la patrulla (defensores de bandera, rescatistas de la cárcel, corredores).'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Respetando la regla de marchar a la "cárcel" de manera inmediata y honesta al ser tocado por un defensor.'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Respetando la regla de marchar a la "cárcel" de manera inmediata y honesta al ser tocado por un defensor.'),
  ('953f10a6-f9d4-4760-8414-2192d4ba8d48', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Acatando los fallos de los árbitros sobre capturas simultáneas sin entablar discusiones antideportivas.');

-- 3. Actualizar el campo metadata (JSONB) de cada uno de los 12 artículos con la estructura corregida y coherente

-- Relevos de Botones
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta carrera de relevos desafía a los participantes a afinar su motricidad fina y coordinación ojo-mano (Corporalidad) al enhebrar con precisión hilos a través de pequeños botones. Asimismo, fomenta el trabajo en equipo organizado y la aceptación disciplinada de las reglas de relevos y turnos (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a tener un cuerpo cada vez más fuerte, ágil, veloz y flexible.", "unidad": "Manada", "como_se_cumple": "Corriendo con velocidad hacia la estación de los botones para iniciar la tarea de precisión."},
    {"id": "626a313e-0407-4cfd-b714-c6aa6e51738c", "area": "Corporalidad", "texto": "Manejo cada vez mejor mis brazos, piernas, manos y pies.", "unidad": "Manada", "como_se_cumple": "Enhebrando con pulso firme el hilo en los orificios del botón sin que se deslice de los dedos."},
    {"id": "0ba0d3c3-a50a-4a04-8981-601dc7746dd6", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Compañía", "como_se_cumple": "Controlando la respiración y los movimientos finos para facilitar el enhebrado rápido bajo la presión de la carrera."},
    {"id": "4946a6aa-4a9f-4e7b-89a3-cb5249db8257", "area": "Corporalidad", "texto": "Sé lo que puedo y no puedo hacer con mi cuerpo.", "unidad": "Tropa", "como_se_cumple": "Controlando la respiración y los movimientos finos para facilitar el enhebrado rápido bajo la presión de la carrera."},
    {"id": "52d9399a-4bf1-4010-a7ca-682b7d1c22a8", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Compañía", "como_se_cumple": "Ejercitando la concentración y el control visomotor en tareas manuales que requieren paciencia e inmovilidad."},
    {"id": "333453ab-e111-4f06-b0e3-a3e7f06b2439", "area": "Corporalidad", "texto": "Trato de superar las dificultades físicas propias de mi crecimiento.", "unidad": "Tropa", "como_se_cumple": "Ejercitando la concentración y el control visomotor en tareas manuales que requieren paciencia e inmovilidad."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Respetando el lugar de salida y entregando el turno a su compañero sin cometer faltas de largada."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Traspasando el hilo y los botones ordenadamente de acuerdo con las especificaciones acordadas en el reglamento del juego."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Acordando colectivamente qué compañero enhebrará en primer lugar para optimizar la velocidad del grupo."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Acordando colectivamente qué compañero enhebrará en primer lugar para optimizar la velocidad del grupo."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Velando porque los competidores del equipo no asistan físicamente al corredor en la mesa de enhebrado."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Velando porque los competidores del equipo no asistan físicamente al corredor en la mesa de enhebrado."}
  ]
}'::jsonb
WHERE id = '0ebe55c0-b9f1-487c-8b1b-ab3d131b91a6';

-- Carrera de Cuncunas
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica física en equipo desafía a los participantes a coordinar la fuerza, la resistencia física y el equilibrio dinámico grupal (Corporalidad) al desplazarse sentados o en cuclillas formando una cadena humana continua (\"cuncuna\"). Asimismo, fomenta el trabajo en equipo disciplinado, la empatía física al avanzar al ritmo del miembro más lento de la fila y el apego estricto a las normas de seguridad (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Avanzando de manera coordinada sin soltar los tobillos del compañero de adelante."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Avanzando de manera coordinada sin soltar los tobillos del compañero de adelante."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Ejercitando la fuerza de piernas y la resistencia muscular al avanzar en cuclillas a paso rápido."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Ejercitando la fuerza de piernas y la resistencia muscular al avanzar en cuclillas a paso rápido."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Demostrando condición y destreza física para sostener el ritmo aeróbico de la cuncuna durante el trayecto de la carrera."},
    {"id": "106e27af-ec7a-45fa-9295-fcef88fbef3d", "area": "Corporalidad", "texto": "Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.", "unidad": "Clan", "como_se_cumple": "Liderando físicamente el avance de la cadena, motivando la resistencia muscular de sus compañeros del Clan."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Proponiendo técnicas de coordination colectiva (\"izquierda, derecha...\") para avanzar sin romper el ritmo de la cuncuna."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Proponiendo técnicas de coordination colectiva (\"izquierda, derecha...\") para avanzar sin romper el ritmo de la cuncuna."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Acatando la regla de detenerse y rearmar la cadena si algún miembro se suelta de los tobillos."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Acatando la regla de detenerse y rearmar la cadena si algún miembro se suelta de los tobillos."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Colaborando cordialmente al avanzar coordinados, respetando el fair play de la competencia grupal."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Asegurando que el ritmo de marcha adoptado por el Clan no ponga en riesgo de lesiones articulares a ninguno de sus integrantes."}
  ]
}'::jsonb
WHERE id = '44899c38-5ae2-4250-a6d5-955ef4158bb2';

-- Carrera de Trenes
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica física consiste en realizar carreras rápidas sosteniendo la cintura del compañero de adelante, exigiendo agilidad, resistencia física y balance coordinado para correr en fila sin fragmentar la línea (Corporalidad). Asimismo, refuerza el trabajo cooperativo, la comunicación instantánea y el respeto a la velocidad y capacidades físicas de los demás integrantes del tren (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Corriendo alineados de forma constante sin soltar la cintura de la persona que antecede."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Corriendo alineados de forma constante sin soltar la cintura de la persona que antecede."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por correr a alta velocidad sincronizando las zancadas con sus compañeros de patrulla."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por correr a alta velocidad sincronizando las zancadas con sus compañeros de patrulla."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Desplegando resistencia cardiovascular e intensidad de carrera durante las mangas consecutivas del juego."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando para definir el orden táctico de los corredores en el tren para evitar tropiezos de altura."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando para definir el orden táctico de los corredores en el tren para evitar tropiezos de altura."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de detener la carrera y retroceder si algún vagón de la fila se desengancha de la cintura."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de detener la carrera y retroceder si algún vagón de la fila se desengancha de la cintura."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Acatando con madurez y espíritu scout los fallos de los jueces de pista en caso de descalificaciones."}
  ]
}'::jsonb
WHERE id = '349af827-90bc-47e4-9fe0-7cca4ba7302f';

-- Carrera de Velas
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de coordinación fina y carrera controlada reta a los participantes a idear estrategias originales de protección contra el viento para evitar que se apague la llama de su vela (Creatividad). Del mismo modo, fomenta la sana competitividad, el respeto de los carriles y límites de carrera, y el acatamiento riguroso de las medidas de seguridad de manejo de fuego convenidas (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "12686e7d-d6af-4c74-928d-c859d5b883d5", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Acordando tácticas con su patrulla para cubrir la vela usando las manos o pañolines de forma segura."},
    {"id": "e465926e-deed-4341-956f-047f56860e5e", "area": "Creatividad", "texto": "Ayudo en la preparación de los temas que discutimos en mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Acordando tácticas con su patrulla para cubrir la vela usando las manos o pañolines de forma segura."},
    {"id": "0009f64a-0654-46bf-b6fc-7b9d7f278485", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Compañía", "como_se_cumple": "Analizando la dirección del viento y ajustando la orientación del cuerpo al caminar para salvaguardar la flama."},
    {"id": "3d0dff9b-11cd-4a30-b3a6-ec011ad95062", "area": "Creatividad", "texto": "Puedo analizar una situación desde distintos puntos de vista.", "unidad": "Tropa", "como_se_cumple": "Analizando la dirección del viento y ajustando la orientación del cuerpo al caminar para salvaguardar la flama."},
    {"id": "310eb631-8ca9-4eaf-ac80-232a5150d024", "area": "Creatividad", "texto": "Creo actividades y juegos para realizar con mi comunidad y soy capaz de motivarlos.", "unidad": "Avanzada", "como_se_cumple": "Proponiendo variaciones divertidas de la dinámica (relevos, cruzar túneles de viento) para desafiar a la Avanzada."},
    {"id": "ef75fbed-4a6d-49ea-bfab-f2952415e1a0", "area": "Creatividad", "texto": "Actúo con agilidad mental ante las situaciones más diversas, desarrollando mi capacidad de pensar, innovar y aventurar.", "unidad": "Clan", "como_se_cumple": "Improvisando métodos de protección de cera y flama de manera inmediata ante ráfagas de aire imprevistas en la carrera."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Debatiendo qué compañero correrá en el relevo más expuesto al viento."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Debatiendo qué compañero correrá en el relevo más expuesto al viento."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la directriz de regresar a encender la vela en la zona de fósforos en caso de apagarse."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la directriz de regresar a encender la vela en la zona de fósforos en caso de apagarse."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Respetando las indicaciones de prevención y manejo seguro del fuego para evitar quemaduras accidentales en el grupo."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Asegurando la recolección completa de restos de cera y fósforos en el terreno tras culminar la carrera."}
  ]
}'::jsonb
WHERE id = '15f46795-7117-4553-beaa-dff74860a6b1';

-- Carrera de Maletas Con Carga
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta carrera de relevos y destreza física exige que los participantes corran con carga, coordinen movimientos rápidos para abrir la maleta y se vistan con prendas holgadas antes de correr (Corporalidad). Asimismo, promueve la diversión grupal cooperativa, la sana competencia y el apego honesto al reglamento del relevo y orden de llegada (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "a0c0e5c9-aba9-43be-8ce2-53bc4ede06b5", "area": "Corporalidad", "texto": "Me gusta practicar deportes.", "unidad": "Manada", "como_se_cumple": "Corriendo con entusiasmo en su turno de carrera llevando el bolso/maleta de la seisena."},
    {"id": "309c6121-94fc-43a2-b0fb-f6a975f78962", "area": "Corporalidad", "texto": "Practico deportes, conozco sus reglas y sé perder.", "unidad": "Manada", "como_se_cumple": "Corriendo con la maleta a paso rápido y abriéndola de forma veloz para no perder tiempo de carrera."},
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Trasladando la maleta de forma coordinada, pasándola ordenadamente a su compañera en la línea de relevo."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Trasladando la maleta de forma coordinada, pasándola ordenadamente a su compañero en la línea de relevo."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por optimizar el tiempo de carrera de patrulla, asumiendo con deportividad la victoria o derrota."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por optimizar el tiempo de carrera de patrulla, asumiendo con deportividad la victoria o derrota."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Respetando la regla de vestir todas las prendas asignadas antes de retomar la carrera hacia la meta."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Respetando el turno de largada y cooperando con el orden de las ropas en la maleta al finalizar."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Opinando para acordar con su equipo cómo empacar eficientemente las ropas en la maleta."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Opinando para acordar con su equipo cómo empacar eficientemente las ropas en la maleta."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Velando por el cuidado y la integridad física de los competidores al cruzarse en la zona de vestir."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Velando por el cuidado y la integridad física de los competidores al cruzarse en la zona de vestir."}
  ]
}'::jsonb
WHERE id = '6b441dc2-22fa-441a-87e4-b0ce49b52c45';

-- El Jardinero
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["afectividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de confianza y orientación espacial reta a los participantes no videntes a dominar sus temores e inseguridades al desplazarse a ciegas por el terreno de juego (Afectividad). Asimismo, fomenta la comunicación grupal atenta, el apego estricto a las normas de seguridad fijadas y el respeto a las directrices de guiado no verbal emitidas por los compañeros (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "818d8a25-549b-4e01-a830-e50d73e39025", "area": "Afectividad", "texto": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.", "unidad": "Compañía", "como_se_cumple": "Reconociendo y dominando el temor natural de avanzar a ciegas en un terreno desconocido."},
    {"id": "03ccaf4c-03c4-42a8-b311-47fef60f204c", "area": "Afectividad", "texto": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.", "unidad": "Tropa", "como_se_cumple": "Reconociendo y dominando el temor natural de avanzar a ciegas en un terreno desconocido."},
    {"id": "67a2f0fa-9b1e-4b7b-bda2-e25696c87898", "area": "Afectividad", "texto": "Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.", "unidad": "Compañía", "como_se_cumple": "Controlando la marcha y manteniendo la calma a pesar del ruido ambiental y de perder la orientación."},
    {"id": "74e6c7e0-f9f6-47d3-acdb-d6df315ef123", "area": "Afectividad", "texto": "Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.", "unidad": "Tropa", "como_se_cumple": "Controlando la marcha y manteniendo la calma a pesar del ruido ambiental y de perder la orientación."},
    {"id": "4a2eef1b-1971-4b0b-ac6a-f4f653988403", "area": "Afectividad", "texto": "Acepto que a veces las cosas no suceden de la forma en que las había programado; y mantengo mi buen ánimo cuando esto ocurre.", "unidad": "Avanzada", "como_se_cumple": "Asumiendo con buen ánimo las equivocaciones en las señales auditivas que le provocaron chocar con los árboles."},
    {"id": "07d61bf7-36fc-40f6-8f8e-21fe97b169f0", "area": "Afectividad", "texto": "Logro y mantengo un estado interior de libertad, equilibrio y madurez emocional.", "unidad": "Clan", "como_se_cumple": "Demostrando serenidad y plena confianza en el guiado auditivo de sus compañeros de equipo."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Proponiendo la clave de sonidos que usarán los \"árboles\" para guiar de forma eficiente al jardinero."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Proponiendo la clave de sonidos que usarán los \"árboles\" para guiar de forma eficiente al jardinero."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de no soplar palabras o dar indicaciones directas si su rol es el de \"árbol silencioso\"."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de no soplar palabras o dar indicaciones directas si su rol es el de \"árbol silencioso\"."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Acatando la supervisión de seguridad de los dirigentes en la distribución de los participantes para evitar tropiezos."},
    {"id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e", "area": "Sociabilidad", "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.", "unidad": "Clan", "como_se_cumple": "Asegurando que las distancias de juego y el nivelado del terreno sean evaluados responsablemente antes de vendar a los participantes."}
  ]
}'::jsonb
WHERE id = '5c308bc8-970e-4321-ac02-762b44db8a19';

-- Nuestras Cualidades
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "avanzada", "clan"],
  "areas": ["afectividad", "caracter", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de círculo y autoidentificación ayuda a los participantes a consolidar su autoestima, identificar sus virtudes emocionales y expresarlas con equilibrio y madurez (Afectividad). Asimismo, les insta a actuar con coherencia en base a sus valores éticos personales (Carácter) y a convivir en un ambiente de profundo respeto, reconociendo y valorando la dignidad e igualdad de cualidades en sus compañeros (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "b17b867f-9ff4-43f1-ae48-d8933e29298f", "area": "Afectividad", "texto": "Me doy cuenta por qué reacciono de la manera en que a veces lo hago.", "unidad": "Compañía", "como_se_cumple": "Reconociendo qué emociones motivan su decisión de correr al centro al mencionarse determinada cualidad."},
    {"id": "bb4bbc06-8313-45b2-b06e-c2a52a3d9322", "area": "Afectividad", "texto": "Comparto mis sentimientos y emociones con mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Expresando ante sus compañeras de patrulla por qué se identifica con el valor o cualidad propuesta."},
    {"id": "81298790-d245-48c6-8b1b-266b218c69da", "area": "Afectividad", "texto": "Me esfuerzo por encontrar mi identidad personal.", "unidad": "Avanzada", "como_se_cumple": "Identificando rasgos propios y diferenciadores de su carácter en el ejercicio del círculo."},
    {"id": "07d61bf7-36fc-40f6-8f8e-21fe97b169f0", "area": "Afectividad", "texto": "Logro y mantengo un estado interior de libertad, equilibrio y madurez emocional.", "unidad": "Clan", "como_se_cumple": "Compartiendo sus fortalezas y debilidades con plena madurez emocional ante los miembros del Clan."},
    {"id": "2845964c-1778-4ed7-8284-c5d830ea0a0d", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo misma y con las demás personas.", "unidad": "Compañía", "como_se_cumple": "Asumiendo con lealtad sus virtudes y valores de manera pública en el círculo de juego."},
    {"id": "c4fe900a-9641-4cad-a265-3f31073d83cb", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Compañía", "como_se_cumple": "Explicando con coherencia y honestidad ejemplos reales de su vida que reflejan la cualidad asumida."},
    {"id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba", "area": "Carácter", "texto": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.", "unidad": "Avanzada", "como_se_cumple": "Reflexionando sobre si sus acciones cotidianas coinciden verdaderamente con la cualidad que declara tener."},
    {"id": "770a8ff3-7bb8-45dd-b114-5ae1069eff62", "area": "Carácter", "texto": "Actúo consecuentemente con los valores que me inspiran.", "unidad": "Clan", "como_se_cumple": "Asumiendo compromisos de coherencia ética basados en las cualidades destacadas en la plenaria del Clan."},
    {"id": "fce82191-77ea-444b-89d9-e33b62a323a5", "area": "Sociabilidad", "texto": "Procuro que respetemos a nuestras compañeras, cualquiera sea su manera de ser.", "unidad": "Compañía", "como_se_cumple": "Escuchando y valorando positivamente las cualidades descritas por sus compañeras sin emitir juicios o burlas."},
    {"id": "ea86ecee-b201-4a49-be9d-4e55de7ffe8c", "area": "Sociabilidad", "texto": "Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.", "unidad": "Compañía", "como_se_cumple": "Reconociendo la igual validez e importancia de las cualidades de cada integrante del grupo."},
    {"id": "007591fb-a2b6-4fb5-9286-acde65455f53", "area": "Sociabilidad", "texto": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.", "unidad": "Avanzada", "como_se_cumple": "Garantizando que todos los miembros de la Avanzada tengan el mismo espacio y tiempo para exponer sus cualidades en un marco de dignidad."},
    {"id": "b5a81328-5c07-41bd-a1ea-1ed401762841", "area": "Sociabilidad", "texto": "Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo mis obligaciones y defendiendo igual derecho para los demás.", "unidad": "Clan", "como_se_cumple": "Promoviendo que el debate del Clan destaque la complementariedad de las virtudes individuales en favor de la solidaridad grupal."}
  ]
}'::jsonb
WHERE id = '3ba7a8ca-6f46-475c-9b6e-d9f09836b21c';

-- Mano con mano
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa", "avanzada"],
  "areas": ["afectividad", "caracter", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de contacto corporal controlado promueve la aceptación respetuosa del espacio físico del otro, el autoconocimiento y la madurez emocional (Afectividad) al experimentar contacto guiado (mano con mano, mejilla con mejilla). A su vez, ayuda a fijar límites personales basados en la honestidad consigo mismo (Carácter) y a convivir en un ambiente solidario que valora la dignidad, la igualdad y el respeto mutuo (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "80102a2d-bc83-41fc-85ab-d98b42dbca76", "area": "Afectividad", "texto": "Trato de no esconder mis alegrías, mis penas, las cosas que me gustan y las que me dan miedo.", "unidad": "Manada", "como_se_cumple": "Expresando de forma espontánea qué sintió al tomar contacto físico con las manos de sus compañeros."},
    {"id": "66de9e77-aa53-48a1-98db-9de3d3958486", "area": "Afectividad", "texto": "Puedo hablar con los demás de las cosas que me ponen alegre y también de las que me ponen triste.", "unidad": "Manada", "como_se_cumple": "Compartiendo en el consejo de seisena su comodidad o timidez durante el desarrollo de la dinámica."},
    {"id": "818d8a25-549b-4e01-a830-e50d73e39025", "area": "Afectividad", "texto": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.", "unidad": "Compañía", "como_se_cumple": "Conversando abiertamente sobre el miedo o resistencia al contacto corporal cercano."},
    {"id": "03ccaf4c-03c4-42a8-b311-47fef60f204c", "area": "Afectividad", "texto": "Me doy cuenta y puedo hablar de las cosas que me atemorizan.", "unidad": "Tropa", "como_se_cumple": "Conversando abiertamente sobre el miedo o resistencia al contacto corporal cercano."},
    {"id": "67a2f0fa-9b1e-4b7b-bda2-e25696c87898", "area": "Afectividad", "texto": "Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.", "unidad": "Compañía", "como_se_cumple": "Manteniendo una actitud de respeto y seriedad ante el contacto físico, evitando bromas incómodas."},
    {"id": "74e6c7e0-f9f6-47d3-acdb-d6df315ef123", "area": "Afectividad", "texto": "Trato de dominar mis reacciones, aún en situaciones difíciles o inesperadas.", "unidad": "Tropa", "como_se_cumple": "Manteniendo una actitud de respeto y seriedad ante el contacto físico, evitando bromas incómodas."},
    {"id": "84988974-0afa-4fa1-9abc-8923a0d53451", "area": "Afectividad", "texto": "Manejo cada vez mejor mis emociones y sentimientos y trato de mantener un estado de ánimo estable.", "unidad": "Avanzada", "como_se_cumple": "Canalizando las emociones de incomodidad hacia reflexiones constructivas sobre el espacio personal."},
    {"id": "baa365a9-087c-4c25-b0ad-57893df5ff74", "area": "Carácter", "texto": "Sé lo que significa decir la verdad.", "unidad": "Manada", "como_se_cumple": "Siendo honesto al manifestar si alguna posición de contacto le incomoda o le agrada."},
    {"id": "506b7596-cac4-48e0-88c7-942d575172db", "area": "Carácter", "texto": "Digo la verdad, aunque a veces no me gusten las consecuencias.", "unidad": "Manada", "como_se_cumple": "Declarando con sinceridad si prefirió apartarse o cambiar de pareja en el transcurso del juego."},
    {"id": "2845964c-1778-4ed7-8284-c5d830ea0a0d", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo misma y con las demás personas.", "unidad": "Compañía", "como_se_cumple": "Fijando y respetando sus propios límites personales frente al contacto físico de forma clara y asertiva."},
    {"id": "f77525b1-07a3-4188-9051-4d3ba86aadfc", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.", "unidad": "Tropa", "como_se_cumple": "Fijando y respetando sus propios límites personales frente al contacto físico de forma clara y asertiva."},
    {"id": "c4fe900a-9641-4cad-a265-3f31073d83cb", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Compañía", "como_se_cumple": "Respetando de forma integral las directrices del facilitador sobre el consentimiento y cuidado corporal."},
    {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Tropa", "como_se_cumple": "Respetando de forma integral las directrices del facilitador sobre el consentimiento y cuidado corporal."},
    {"id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba", "area": "Carácter", "texto": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.", "unidad": "Avanzada", "como_se_cumple": "Manteniendo una conducta ética intachable frente al contacto físico de sus compañeras de Avanzada."},
    {"id": "cfa10133-c25c-4deb-aebe-a00f8fe3f7ef", "area": "Sociabilidad", "texto": "Comparto lo que tengo con mis compañeros y compañeras.", "unidad": "Manada", "como_se_cumple": "Colaborando cordialmente al dar la mano a lobatos de otras seisenas."},
    {"id": "d15e8733-8e84-44e4-9e9c-f8090e201b6e", "area": "Sociabilidad", "texto": "Conozco los derechos del niño y los relaciono con situaciones que conozco o con otras de las que he oído hablar.", "unidad": "Manada", "como_se_cumple": "Vinculando el ejercicio al derecho de protección e intangibilidad de su propio cuerpo."},
    {"id": "fce82191-77ea-444b-89d9-e33b62a323a5", "area": "Sociabilidad", "texto": "Procuro que respetemos a nuestras compañeras, cualquiera sea su manera de ser.", "unidad": "Compañía", "como_se_cumple": "Aceptando formar pareja con cualquier integrante sin discriminar su apariencia física."},
    {"id": "a3d7abdf-ca3b-42b8-92b5-403958fb537c", "area": "Sociabilidad", "texto": "Procuro que respetemos a nuestras compañeros, cualquiera sea su manera de ser.", "unidad": "Tropa", "como_se_cumple": "Aceptando formar pareja con cualquier integrante sin discriminar su apariencia física."},
    {"id": "ea86ecee-b201-4a49-be9d-4e55de7ffe8c", "area": "Sociabilidad", "texto": "Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.", "unidad": "Compañía", "como_se_cumple": "Resguardando el espacio vital y las sensibilidades físicas expresadas por sus compañeras."},
    {"id": "9e3ce0d2-2b56-4d1e-9135-029cfaaa0e6b", "area": "Sociabilidad", "texto": "Respeto a todas las personas, independientemente de sus ideas, su clase social y su forma de vida.", "unidad": "Tropa", "como_se_cumple": "Resguardando el espacio vital y las sensibilidades físicas expresadas por sus compañeros."},
    {"id": "007591fb-a2b6-4fb5-9286-acde65455f53", "area": "Sociabilidad", "texto": "Creo que todas las personas somos iguales en dignidad y eso marca mis relaciones con los demás.", "unidad": "Avanzada", "como_se_cumple": "Garantizando que las relaciones e interacciones físicas se conduzcan con absoluto respeto por la dignidad e integridad."}
  ]
}'::jsonb
WHERE id = 'cfb5d456-9514-45e1-a62d-e47ca7d9d8e8';

-- ¿Eres Drácula?
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["caracter", "sociabilidad"],
  "justificacion_areas": "Este juego de misterio a ciegas reta a los participantes a actuar con honestidad intelectual y aserción de principios éticos (Carácter) al asumir el rol de Drácula en secreto o al reportar con veracidad si han sido contagiados. Asimismo, exige la aceptación estricta de las normas de desplazamiento lento y las reglas de seguridad fijadas por la jefatura para evitar tropiezos accidentales en la oscuridad (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "baa365a9-087c-4c25-b0ad-57893df5ff74", "area": "Carácter", "texto": "Sé lo que significa decir la verdad.", "unidad": "Manada", "como_se_cumple": "Respondiendo con honestidad si es o no Drácula al ser consultado de forma directa en el juego."},
    {"id": "506b7596-cac4-48e0-88c7-942d575172db", "area": "Carácter", "texto": "Digo la verdad, aunque a veces no me gusten las consecuencias.", "unidad": "Manada", "como_se_cumple": "Aceptando en voz alta su transformación en vampiro de forma inmediata al recibir el toque secreto, respetando el curso del juego."},
    {"id": "2845964c-1778-4ed7-8284-c5d830ea0a0d", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo misma y con las demás personas.", "unidad": "Compañía", "como_se_cumple": "Respetando las reglas del personaje secreto de Drácula, evitando hacer trampas al desplazarse con los ojos cerrados."},
    {"id": "f77525b1-07a3-4188-9051-4d3ba86aadfc", "area": "Carácter", "texto": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.", "unidad": "Tropa", "como_se_cumple": "Respetando las reglas del personaje secreto de Drácula, evitando hacer trampas al desplazarse con los ojos cerrados."},
    {"id": "c4fe900a-9641-4cad-a265-3f31073d83cb", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Compañía", "como_se_cumple": "Fundamentando en el foro final qué nivel de confianza o incertidumbre le produjo estar a ciegas rodeado de amenazas."},
    {"id": "0eaaf466-0634-48b9-aca9-cf49813b8596", "area": "Carácter", "texto": "Me esfuerzo por hacer las cosas según lo que pienso.", "unidad": "Tropa", "como_se_cumple": "Fundamentando en el foro final qué nivel de confianza o incertidumbre le produjo estar a ciegas rodeado de amenazas."},
    {"id": "b69188bf-2391-43c1-a885-abd1b13912be", "area": "Sociabilidad", "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.", "unidad": "Manada", "como_se_cumple": "Acatando la regla de no abrir los ojos bajo ninguna circunstancia a menos que se declare el fin del juego."},
    {"id": "2394dd5b-87b9-4f3d-9cdd-a42649139782", "area": "Sociabilidad", "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas", "unidad": "Manada", "como_se_cumple": "Desplazándose lentamente con las manos al frente de forma segura para no chocar o lastimar a los lobatos."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Aportando ideas en el diseño de los límites del campo para garantizar que la zona sea segura para caminar a ciegas."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Aportando ideas en el diseño de los límites del campo para garantizar que la zona sea segura para caminar a ciegas."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Acatando el silencio estricto que debe guardar Drácula y sus víctimas antes de emitir el grito de mordida."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Acatando el silencio estricto que debe guardar Drácula y sus víctimas antes de emitir el grito de mordida."}
  ]
}'::jsonb
WHERE id = '400ec7fa-74c3-4fb4-b053-c238fc8cd8db';

-- Enredados
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada"],
  "areas": ["corporalidad", "creatividad", "caracter"],
  "justificacion_areas": "Este juego cooperativo desafía a los lobatos a coordinar su flexibilidad y equilibrio corporal (Corporalidad) al enredarse físicamente pasando por encima y por debajo de las extremidades de sus compañeros. Asimismo, reta su agilidad mental y pensamiento estratégico grupal para desenredar el nudo sin soltar las manos (Creatividad), fomentando la perseverancia, honestidad y el cumplimiento de la palabra empeñada de no soltarse (Carácter).",
  "objetivos_educativos": [
    {"id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99", "area": "Corporalidad", "texto": "Participo en actividades que me ayudan a tener un cuerpo cada vez más fuerte, ágil, veloz y flexible.", "unidad": "Manada", "como_se_cumple": "Flexionando el tronco y extremidades para deslizarse bajo los brazos de sus compañeros de seisena."},
    {"id": "626a313e-0407-4cfd-b714-c6aa6e51738c", "area": "Corporalidad", "texto": "Manejo cada vez mejor mis brazos, piernas, manos y pies.", "unidad": "Manada", "como_se_cumple": "Coordinando giros de articulaciones y pasos elevados para desenredar el círculo sin perder el equilibrio."},
    {"id": "ec280dd0-2d80-4b84-86ad-2d362da14886", "area": "Creatividad", "texto": "Me gusta participar en juegos de observación.", "unidad": "Manada", "como_se_cumple": "Observando con atención qué cruces de brazos están bloqueando el nudo para idear el siguiente movimiento."},
    {"id": "dcdcce42-6b31-45f7-a135-290f0f74b5a6", "area": "Creatividad", "texto": "Me gustan los juegos en que tengo que usar mi agilidad mental.", "unidad": "Manada", "como_se_cumple": "Proponiendo de forma mental e intuitiva qué giros y secuencias de pasos ayudarán a destrabar el círculo."},
    {"id": "baa365a9-087c-4c25-b0ad-57893df5ff74", "area": "Carácter", "texto": "Sé lo que significa decir la verdad.", "unidad": "Manada", "como_se_cumple": "Manteniendo las manos bien sujetas sin soltarse disimuladamente ante posiciones complejas o incómodas."},
    {"id": "506b7596-cac4-48e0-88c7-942d575172db", "area": "Carácter", "texto": "Digo la verdad, aunque a veces no me gusten las consecuencias.", "unidad": "Manada", "como_se_cumple": "Reconociendo de forma honesta si se le resbaló el agarre de manos, solicitando reiniciar el nudo de forma transparente."}
  ]
}'::jsonb
WHERE id = 'fd254b06-1ce1-46e1-bbcd-631170b07f1b';

-- Una torre alta firme y hermosa
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["creatividad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica de construcción técnica y pionerismo a escala desafía a los participantes a aplicar destrezas manuales e ingenio físico-mecánico para construir una estructura vertical estable y estética con materiales limitados (Creatividad). Fomenta el trabajo cooperativo, la toma de decisiones consensuada, la distribución equitativa de roles y el cumplimiento responsable de las tareas de equipo (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "103661fc-3396-4eac-9182-58b7e54d5115", "area": "Creatividad", "texto": "Perfecciono mis habilidades manuales.", "unidad": "Compañía", "como_se_cumple": "Doblando, enrollando y uniendo los periódicos y palos para conformar la base de la torre."},
    {"id": "11320fb6-98de-4725-825d-db858e3bffa2", "area": "Creatividad", "texto": "Perfecciono mis habilidades manuales.", "unidad": "Tropa", "como_se_cumple": "Doblando, enrollando y uniendo los periódicos y palos para conformar la base de la torre."},
    {"id": "0f60be94-6de3-4c34-a6ff-5b5018f0b156", "area": "Creatividad", "texto": "Coopero en la mantención y renovación del local y materiales de mi patrulla.", "unidad": "Compañía", "como_se_cumple": "Cuidando que no se estropeen o desperdicien los materiales de maqueta asignados a la patrulla durante la construcción."},
    {"id": "fd3d3e14-e92b-4ab5-8298-9018c6e70b20", "area": "Creatividad", "texto": "Coopero en la mantención y renovación del local y materiales de mi patrulla.", "unidad": "Tropa", "como_se_cumple": "Cuidando que no se estropeen o desperdicien los materiales de maqueta asignados a la patrulla durante la construcción."},
    {"id": "843fda9c-6c4a-4516-b30c-23c92ef755a8", "area": "Creatividad", "texto": "Puedo resolver la mayoría de los problemas técnicos domésticos simples.", "unidad": "Avanzada", "como_se_cumple": "Ideando empalmes y arriostramientos estables en la estructura para contrarrestar la oscilación y caídas."},
    {"id": "29eee8b1-a414-4df9-90e1-520a384fb9aa", "area": "Creatividad", "texto": "Uno los conocimientos teórico y práctico mediante la aplicación constante de mis habilidades técnicas y manuales.", "unidad": "Clan", "como_se_cumple": "Aplicando principios básicos de física, equilibrio y centro de gravedad para que la estructura sea alta y firme."},
    {"id": "9478b46f-6f74-4a7e-bf9c-d66caaba1381", "area": "Sociabilidad", "texto": "Cumplo los compromisos que asumo.", "unidad": "Compañía", "como_se_cumple": "Efectuando de manera puntal y concentrada el rol de soporte asignado por la patrulla (ej: cortar cinta, enrollar diario)."},
    {"id": "5ff08326-49d9-4f83-8ffd-9b4b83425a95", "area": "Sociabilidad", "texto": "Cumplo los compromisos que asumo.", "unidad": "Tropa", "como_se_cumple": "Efectuando de manera puntal y concentrada el rol de soporte asignado por la patrulla (ej: cortar cinta, enrollar diario)."},
    {"id": "8bb5d75e-3033-4f5a-a1a5-d2f09b50ce25", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Compañía", "como_se_cumple": "Respetando el diseño de la estructura común acordado colectivamente en la patrulla."},
    {"id": "0d3af46a-d64c-4e59-a765-1f72dc41ba76", "area": "Sociabilidad", "texto": "Ayudo a mi patrulla en los compromisos que tomamos.", "unidad": "Tropa", "como_se_cumple": "Respetando el diseño de la estructura común acordado colectivamente en la patrulla."},
    {"id": "5abfbe81-75e4-4444-b52d-38e59e8b6ec7", "area": "Sociabilidad", "texto": "Estoy siempre disponible para ayudar a los demás, incluso cuando se trata de tareas pesadas o poco agradables.", "unidad": "Avanzada", "como_se_cumple": "Colaborando activamente en la recolección, ordenamiento y limpieza del salón de trabajo una vez concluida la prueba."},
    {"id": "b5a81328-5c07-41bd-a1ea-1ed401762841", "area": "Sociabilidad", "texto": "Vivo mi libertad de un modo solidario, ejerciendo mis derechos, cumpliendo mis obligaciones y defendiendo igual derecho para los demás.", "unidad": "Clan", "como_se_cumple": "Asegurando que todas las propuestas de diseño y modelado de los integrantes del Clan sean escuchadas y evaluadas en plenaria."}
  ]
}'::jsonb
WHERE id = '334dd057-0cda-4817-b473-e45367277f73';

-- Capturar la bandera
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Este gran juego táctico al aire libre demanda de los participantes un alto despliegue cardiovascular, agilidad física, velocidad y reflejos de evasión (Corporalidad) al ingresar al territorio contrario. Fomenta el planeamiento estratégico en equipo, la comunicación táctica, el respeto a los límites del campo (\"cárcel\", zona de bandera) y la aceptación honesta de ser capturado (Sociabilidad).",
  "objetivos_educativos": [
    {"id": "1427451e-b8b3-493b-8525-e53298381e07", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Compañía", "como_se_cumple": "Corriendo activamente por el terreno delimitado evitando traspasar los límites prohibidos."},
    {"id": "0765469b-caef-4457-9d6b-cb739c855402", "area": "Corporalidad", "texto": "Conozco y practico diferentes juegos y respeto sus reglas.", "unidad": "Tropa", "como_se_cumple": "Corriendo activamente por el terreno delimitado evitando traspasar los límites prohibidos."},
    {"id": "b12da732-d736-480c-82b8-95b312316390", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Compañía", "como_se_cumple": "Esforzándose por diseñar y ejecutar carreras rápidas de distracción para favorecer el ingreso de su patrulla."},
    {"id": "08369c53-2c02-4e9c-8bb5-f949cd092c98", "area": "Corporalidad", "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.", "unidad": "Tropa", "como_se_cumple": "Esforzándose por diseñar y ejecutar carreras rápidas de distracción para favorecer el ingreso de su patrulla."},
    {"id": "f4c586e3-6a99-41f5-8fcb-a15886e93337", "area": "Corporalidad", "texto": "Practico regularmente un deporte.", "unidad": "Avanzada", "como_se_cumple": "Demostrando óptima resistencia cardiovascular y velocidad de aceleración en las persecuciones en territorio adverso."},
    {"id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.", "unidad": "Compañía", "como_se_cumple": "Proponiendo roles tácticos dentro de la patrulla (defensores de bandera, rescatistas de la cárcel, corredores)."},
    {"id": "06ed2700-c963-4f13-a86a-2815b3a1530a", "area": "Sociabilidad", "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.", "unidad": "Tropa", "como_se_cumple": "Proponiendo roles tácticos dentro de la patrulla (defensores de bandera, rescatistas de la cárcel, corredores)."},
    {"id": "e2770a37-9927-47ed-a4d6-bae9feaf691c", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Compañía", "como_se_cumple": "Respetando la regla de marchar a la \"cárcel\" de manera inmediata y honesta al ser tocado por un defensor."},
    {"id": "a594a460-1ab9-4c09-b01a-c2555163e86e", "area": "Sociabilidad", "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.", "unidad": "Tropa", "como_se_cumple": "Respetando la regla de marchar a la \"cárcel\" de manera inmediata y honesta al ser tocado por un defensor."},
    {"id": "f1496221-0da5-4775-b3ba-29e65603cfee", "area": "Sociabilidad", "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.", "unidad": "Avanzada", "como_se_cumple": "Acatando los fallos de los árbitros sobre capturas simultáneas sin entablar discusiones antideportivas."}
  ]
}'::jsonb
WHERE id = '953f10a6-f9d4-4760-8414-2192d4ba8d48';
