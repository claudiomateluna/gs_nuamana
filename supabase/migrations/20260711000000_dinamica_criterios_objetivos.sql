-- Migración para registrar los objetivos educativos de la Dinámica de Criterios (ID: 12f2e3dc-c56d-47b8-9fb0-3779dadae69a)

-- 1. Insertar relaciones en la tabla intermedia articulo_objetivos_educativos
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Exponiendo sus opiniones personales y argumentando sus posturas con respecto a las temáticas propuestas de forma constructiva y asertiva.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Exponiendo sus opiniones personales y argumentando sus posturas con respecto a las temáticas propuestas de forma constructiva y asertiva.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '85f8abea-eb57-4f78-9e11-5c2ab5d71044', 'Escuchando atentamente los argumentos minoritarios de sus compañeras y respetando sus puntos de vista divergentes durante los debates.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'f0bd8ba8-8b11-4988-8fb6-ad8e883c2a5b', 'Escuchando atentamente los argumentos minoritarios de sus compañeros y respetando sus puntos de vista divergentes durante los debates.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Debatiendo con respecto a diferentes afirmaciones polémicas mediante el uso de tarjetas verdes y rojas para manifestar su postura crítica.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Debatiendo con respecto a diferentes afirmaciones polémicas mediante el uso de tarjetas verdes y rojas para manifestar su postura crítica.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'c4fe900a-9641-4cad-a265-3f31073d83cb', 'Fundamentando sólidamente sus convicciones individuales frente a opiniones mayoritarias contrarias.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', '0eaaf466-0634-48b9-aca9-cf49813b8596', 'Fundamentando sólidamente sus convicciones individuales frente a opiniones mayoritarias contrarias.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'f1496221-0da5-4775-b3ba-29e65603cfee', 'Expresando de manera tolerante y fundamentada sus posturas críticas frente a diferentes enunciados y propuestas éticas planteadas durante el debate.'),
  ('12f2e3dc-c56d-47b8-9fb0-3779dadae69a', 'b5954f1c-4d0d-4bdb-97d8-821583beb77e', 'Analizando y discutiendo de forma responsable las bases éticas de los enunciados que regulan la vida comunitaria y formulando propuestas de cambio.')
ON CONFLICT (articulo_id, objetivo_id) 
DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

-- 2. Actualizar el campo metadata (JSONB) del artículo
UPDATE articulos 
SET metadata = metadata || '{
  "unidades": ["compania", "tropa", "avanzada", "clan"],
  "areas": ["caracter", "sociabilidad"],
  "justificacion_areas": "La actividad promueve la formación del juicio crítico y la asertividad (Carácter) al requerir que cada participante argumente sus opiniones personales. Al mismo tiempo, fomenta el debate democrático y el respeto por los puntos de vista minoritarios dentro de la patrulla y la unidad (Sociabilidad).",
  "objetivos_educativos": [
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
      "id": "85f8abea-eb57-4f78-9e11-5c2ab5d71044",
      "area": "Carácter",
      "texto": "Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.",
      "unidad": "Compañía",
      "como_se_cumple": "Escuchando atentamente los argumentos minoritarios de sus compañeras y respetando sus puntos de vista divergentes durante los debates."
    },
    {
      "id": "f0bd8ba8-8b11-4988-8fb6-ad8e883c2a5b",
      "area": "Carácter",
      "texto": "Respeto las decisiones tomadas en mi patrulla, aun cuando piense distinto.",
      "unidad": "Tropa",
      "como_se_cumple": "Escuchando atentamente los argumentos minoritarios de sus compañeros y respetando sus puntos de vista divergentes durante los debates."
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
      "id": "c4fe900a-9641-4cad-a265-3f31073d83cb",
      "area": "Carácter",
      "texto": "Me esfuerzo por hacer las cosas según lo que pienso.",
      "unidad": "Compañía",
      "como_se_cumple": "Fundamentando sólidamente sus convicciones individuales frente a opiniones mayoritarias contrarias."
    },
    {
      "id": "0eaaf466-0634-48b9-aca9-cf49813b8596",
      "area": "Carácter",
      "texto": "Me esfuerzo por hacer las cosas según lo que pienso.",
      "unidad": "Tropa",
      "como_se_cumple": "Fundamentando sólidamente sus convicciones individuales frente a opiniones mayoritarias contrarias."
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
