-- Migración corregida para registrar los objetivos educativos de Dinámica de Criterios (ID: 12f2e3dc-c56d-47b8-9fb0-3779dadae69a)
-- Asegura coherencia pedagógica completa: todos los objetivos pertenecen a las mismas dimensiones/objetivos terminales.

-- 1. Limpiar relaciones anteriores de este artículo
DELETE FROM public.articulo_objetivos_educativos 
WHERE articulo_id = '12f2e3dc-c56d-47b8-9fb0-3779dadae69a';

-- 2. Insertar las relaciones corregidas y coherentes
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '2845964c-1778-4ed7-8284-c5d830ea0a0d', 'Argumentando con franqueza y honestidad sus propios puntos de vista sin ceder ante la presión de la mayoría si contraviene sus convicciones.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'f77525b1-07a3-4188-9051-4d3ba86aadfc', 'Argumentando con franqueza y honestidad sus propios puntos de vista sin ceder ante la presión de la mayoría si contraviene sus convicciones.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'c4fe900a-9641-4cad-a265-3f31073d83cb', 'Fundamentando sólidamente sus posturas críticas individuales frente a las afirmaciones polémicas planteadas durante el debate.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Fundamentando sólidamente sus posturas críticas individuales frente a las afirmaciones polémicas planteadas durante el debate.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba', 'Evaluando el sentido ético de cada criterio debatido y posicionándose honestamente a través del uso de las tarjetas de opinión.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '770a8ff3-7bb8-45dd-b114-5ae1069eff62', 'Debatiendo de manera responsable sobre las bases éticas que sustentan las opiniones comunitarias, demostrando consistencia entre sus convicciones y su argumentación.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Exponiendo sus opiniones personales y argumentando sus posturas con respecto a las temáticas propuestas de forma constructiva y asertiva.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Exponiendo sus opiniones personales y argumentando sus posturas con respecto a las temáticas propuestas de forma constructiva y asertiva.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Debatiendo con respecto a diferentes afirmaciones polémicas mediante el uso de tarjetas verdes y rojas para manifestar su postura crítica.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Debatiendo con respecto a diferentes afirmaciones polémicas mediante el uso de tarjetas verdes y rojas para manifestar su postura crítica.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Expresando de manera tolerante y fundamentada sus posturas críticas frente a diferentes enunciados y propuestas éticas planteadas durante el debate.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Analizando y discutiendo de forma responsable las bases éticas de los enunciados que regulan la vida comunitaria y formulando propuestas de cambio.');

-- 3. Actualizar el campo metadata (JSONB) del artículo con la estructura correcta
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["caracter", "sociabilidad"],
  "justificacion_areas": "La actividad promueve la formación del juicio crítico, la asertividad y la coherencia ética (Carácter) al requerir que cada participante argumente y actúe de manera consecuente con sus propios valores éticos. Al mismo tiempo, fomenta el debate democrático, el respeto por las normas de convivencia y la asimilación responsable de las reglas que regulan la comunidad (Sociabilidad).",
  "objetivos_educativos": [
    {
      "id": "2845964c-1778-4ed7-8284-c5d830ea0a0d",
      "area": "Carácter",
      "texto": "Trato de ser leal con lo que creo, conmigo misma y con las demás personas.",
      "unidad": "Compañía",
      "como_se_cumple": "Argumentando con franqueza y honestidad sus propios puntos de vista sin ceder ante la presión de la mayoría si contraviene sus convicciones."
    },
    {
      "id": "f77525b1-07a3-4188-9051-4d3ba86aadfc",
      "area": "Carácter",
      "texto": "Trato de ser leal con lo que creo, conmigo mismo y con los demás personas.",
      "unidad": "Tropa",
      "como_se_cumple": "Argumentando con franqueza y honestidad sus propios puntos de vista sin ceder ante la presión de la mayoría si contraviene sus convicciones."
    },
    {
      "id": "c4fe900a-9641-4cad-a265-3f31073d83cb",
      "area": "Carácter",
      "texto": "Me esfuerzo por hacer las cosas según lo que pienso.",
      "unidad": "Compañía",
      "como_se_cumple": "Fundamentando sólidamente sus posturas críticas individuales frente a las afirmaciones polémicas planteadas durante el debate."
    },
    {
      "id": "0eaaf466-0634-48b9-aca9-cf49813b8596",
      "area": "Carácter",
      "texto": "Me esfuerzo por hacer las cosas según lo que pienso.",
      "unidad": "Tropa",
      "como_se_cumple": "Fundamentando sólidamente sus posturas críticas individuales frente a las afirmaciones polémicas planteadas durante el debate."
    },
    {
      "id": "ebb5f0fb-8f13-4b7b-8cde-fd47bfe349ba",
      "area": "Carácter",
      "texto": "Trato de actuar de acuerdo a mis valores en todas las cosas que hago.",
      "unidad": "Avanzada",
      "como_se_cumple": "Evaluando el sentido ético de cada criterio debatido y posicionándose honestamente a través del uso de las tarjetas de opinión."
    },
    {
      "id": "770a8ff3-7bb8-45dd-b114-5ae1069eff62",
      "area": "Carácter",
      "texto": "Actúo consecuentemente con los valores que me inspiran.",
      "unidad": "Clan",
      "como_se_cumple": "Debatiendo de manera responsable sobre las bases éticas que sustentan las opiniones comunitarias, demostrando consistencia entre sus convicciones y su argumentación."
    },
    {
      "id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd",
      "area": "Sociabilidad",
      "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.",
      "unidad": "Compañía",
      "como_se_cumple": "Exponiendo sus opiniones personales y argumentando sus posturas con respecto a las temáticas propuestas de forma constructiva y asertiva."
    },
    {
      "id": "06ed2700-c963-4f13-a86a-2815b3a1530a",
      "area": "Sociabilidad",
      "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.",
      "unidad": "Tropa",
      "como_se_cumple": "Exponiendo sus opiniones personales y argumentando sus posturas con respecto a las temáticas propuestas de forma constructiva y asertiva."
    },
    {
      "id": "e2770a37-9927-47ed-a4d6-bae9feaf691c",
      "area": "Sociabilidad",
      "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.",
      "unidad": "Compañía",
      "como_se_cumple": "Debatiendo con respecto a diferentes afirmaciones polémicas mediante el uso de tarjetas verdes y rojas para manifestar su postura crítica."
    },
    {
      "id": "a594a460-1ab9-4c09-b01a-c2555163e86e",
      "area": "Sociabilidad",
      "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.",
      "unidad": "Tropa",
      "como_se_cumple": "Debatiendo con respecto a diferentes afirmaciones polémicas mediante el uso de tarjetas verdes y rojas para manifestar su postura crítica."
    },
    {
      "id": "f1496221-0da5-4775-b3ba-29e65603cfee",
      "area": "Sociabilidad",
      "texto": "Acepto las normas de los diferentes ambientes en que actúo, sin renunciar a mi derecho de tratar de cambiarlas cuando no me parecen correctas.",
      "unidad": "Avanzada",
      "como_se_cumple": "Expresando de manera tolerante y fundamentada sus posturas críticas frente a diferentes enunciados y propuestas éticas planteadas durante el debate."
    },
    {
      "id": "b5954f1c-4d0d-4bdb-97d8-821583beb77e",
      "area": "Sociabilidad",
      "texto": "Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad and sin renunciar a cambiarlas.",
      "unidad": "Clan",
      "como_se_cumple": "Analizando and discutiendo de forma responsable las bases éticas de los enunciados que regulan la vida comunitaria y formulando propuestas de cambio."
    }
  ]
}'::jsonb
WHERE id = '12f2e3dc-c56d-47b8-9fb0-3779dadae69a';
