-- Migración corregida para registrar los objetivos educativos de Cuerpo a Tierra (ID: c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a)
-- Asegura coherencia pedagógica: todos los objetivos pertenecen a las mismas dimensiones/objetivos terminales.

-- 1. Limpiar relaciones anteriores de este artículo
DELETE FROM public.articulo_objetivos_educativos 
WHERE articulo_id = 'c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a';

-- 2. Insertar las relaciones corregidas y coherentes
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '4bf1e3dd-7f21-4c24-962d-9d6d64e32f25', 'Participando activamente en la carrera de relevos en espacios abiertos, disfrutando del ejercicio físico al aire libre.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '309c6121-94fc-43a2-b0fb-f6a975f78962', 'Respetando la secuencia del relevo del pañolín y aceptando deportivamente el resultado de la competencia grupal.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '1427451e-b8b3-493b-8525-e53298381e07', 'Desarrollando el juego de velocidad según el reglamento y las indicaciones de seguridad dadas por la jefatura.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '0765469b-caef-4457-9d6b-cb739c855402', 'Desarrollando el juego de velocidad según el reglamento y las indicaciones de seguridad dadas por la jefatura.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'b12da732-d736-480c-82b8-95b312316390', 'Mejorando los tiempos de paso del pañolín y del recorrido de ida y vuelta para optimizar el rendimiento de la patrulla.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '08369c53-2c02-4e9c-8bb5-f949cd092c98', 'Mejorando los tiempos de paso del pañolín y del recorrido de ida y vuelta para optimizar el rendimiento de la patrulla.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando las reglas establecidas de la dinámica, pasando el pañolín exclusivamente por entremedio de las piernas sin levantarse antes de tiempo.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '2394dd5b-87b9-4f3d-9cdd-a42649139782', 'Respetando la regla de mantenerse en el suelo estirado y con los brazos pegados al cuerpo para permitir el salto seguro del compañero.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd', 'Evaluando colectivamente en la patrulla el cumplimiento de las normas de distanciamiento seguro antes de iniciar la carrera.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '06ed2700-c963-4f13-a86a-2815b3a1530a', 'Evaluando colectivamente en la patrulla el cumplimiento de las normas de distanciamiento seguro antes de iniciar la carrera.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'e2770a37-9927-47ed-a4d6-bae9feaf691c', 'Expresando apreciaciones sobre las normas de seguridad del juego y sugiriendo variaciones al dirigente para mejorar la fluidez de la carrera.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'a594a460-1ab9-4c09-b01a-c2555163e86e', 'Expresando apreciaciones sobre las normas de seguridad del juego y sugiriendo variaciones al dirigente para mejorar la fluidez de la carrera.');

-- 3. Actualizar el campo metadata (JSONB) del artículo con la estructura correcta
UPDATE public.articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica física de alta energía y velocidad exige un gran despliegue de coordinación psicomotora fina y gruesa, reflejos y equilibrio (Corporalidad) al participar de actividades deportivas y recreativas al aire libre. Asimismo, fomenta la sincronización, el trabajo en equipo, la confianza y el respeto por las normas de juego y convivencia fundamentales para evitar que los participantes se pisen o se lastimen durante la carrera (Sociabilidad).",
  "objetivos_educativos": [
    {
      "id": "4bf1e3dd-7f21-4c24-962d-9d6d64e32f25",
      "area": "Corporalidad",
      "texto": "Me gusta hacer actividades al aire libre.",
      "unidad": "Manada",
      "como_se_cumple": "Participando activamente en la carrera de relevos en espacios abiertos, disfrutando del ejercicio físico al aire libre."
    },
    {
      "id": "309c6121-94fc-43a2-b0fb-f6a975f78962",
      "area": "Corporalidad",
      "texto": "Practico deportes, conozco sus reglas y sé perder.",
      "unidad": "Manada",
      "como_se_cumple": "Respetando la secuencia del relevo del pañolín y aceptando deportivamente el resultado de la competencia grupal."
    },
    {
      "id": "1427451e-b8b3-493b-8525-e53298381e07",
      "area": "Corporalidad",
      "texto": "Conozco y practico diferentes juegos y respeto sus reglas.",
      "unidad": "Compañía",
      "como_se_cumple": "Desarrollando el juego de velocidad según el reglamento y las indicaciones de seguridad dadas por la jefatura."
    },
    {
      "id": "0765469b-caef-4457-9d6b-cb739c855402",
      "area": "Corporalidad",
      "texto": "Conozco y practico diferentes juegos y respeto sus reglas.",
      "unidad": "Tropa",
      "como_se_cumple": "Desarrollando el juego de velocidad según el reglamento y las indicaciones de seguridad dadas por la jefatura."
    },
    {
      "id": "b12da732-d736-480c-82b8-95b312316390",
      "area": "Corporalidad",
      "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.",
      "unidad": "Compañía",
      "como_se_cumple": "Mejorando los tiempos de paso del pañolín y del recorrido de ida y vuelta para optimizar el rendimiento de la patrulla."
    },
    {
      "id": "08369c53-2c02-4e9c-8bb5-f949cd092c98",
      "area": "Corporalidad",
      "texto": "Me esfuerzo por mejorar mi rendimiento en el deporte que practico y sé ganar y perder.",
      "unidad": "Tropa",
      "como_se_cumple": "Mejorando los tiempos de paso del pañolín y del recorrido de ida y vuelta para optimizar el rendimiento de la patrulla."
    },
    {
      "id": "b69188bf-2391-43c1-a885-abd1b13912be",
      "area": "Sociabilidad",
      "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.",
      "unidad": "Manada",
      "como_se_cumple": "Aceptando las reglas establecidas de la dinámica, pasando el pañolín exclusivamente por entremedio de las piernas sin levantarse antes de tiempo."
    },
    {
      "id": "2394dd5b-87b9-4f3d-9cdd-a42649139782",
      "area": "Sociabilidad",
      "texto": "Comprendo y respeto las normas que se han puesto en mi casa y en la escuela, aunque no siempre esté de acuerdo con ellas",
      "unidad": "Manada",
      "como_se_cumple": "Respetando la regla de mantenerse en el suelo estirado y con los brazos pegados al cuerpo para permitir el salto seguro del compañero."
    },
    {
      "id": "78f8cd16-ebf9-4a01-9efe-6cdfd7d307fd",
      "area": "Sociabilidad",
      "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigas o en mi escuela.",
      "unidad": "Compañía",
      "como_se_cumple": "Evaluando colectivamente en la patrulla el cumplimiento de las normas de distanciamiento seguro antes de iniciar la carrera."
    },
    {
      "id": "06ed2700-c963-4f13-a86a-2815b3a1530a",
      "area": "Sociabilidad",
      "texto": "Digo mi opinión cuando establecemos normas en mi patrulla, amigos o en mi escuela.",
      "unidad": "Tropa",
      "como_se_cumple": "Evaluando colectivamente en la patrulla el cumplimiento de las normas de distanciamiento seguro antes de iniciar la carrera."
    },
    {
      "id": "e2770a37-9927-47ed-a4d6-bae9feaf691c",
      "area": "Sociabilidad",
      "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.",
      "unidad": "Compañía",
      "como_se_cumple": "Expresando apreciaciones sobre las normas de seguridad del juego y sugiriendo variaciones al dirigente para mejorar la fluidez de la carrera."
    },
    {
      "id": "a594a460-1ab9-4c09-b01a-c2555163e86e",
      "area": "Sociabilidad",
      "texto": "Opino sobre lo que me gusta o no de las normas de los distintos ambientes en que actúo.",
      "unidad": "Tropa",
      "como_se_cumple": "Expresando apreciaciones sobre las normas de seguridad del juego y sugiriendo variaciones al dirigente para mejorar la fluidez de la carrera."
    }
  ]
}'::jsonb
WHERE id = 'c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a';
