-- Migración para registrar los objetivos educativos de Cuerpo a Tierra (ID: c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a)

-- 1. Insertar relaciones en la tabla intermedia articulo_objetivos_educativos
INSERT INTO articulo_objetivos_educativos (articulo_id, objetivo_id, como_se_cumple)
VALUES 
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'd9ebcd96-c9cf-444f-94fb-5569110a1b99', 'Corriendo a toda velocidad hacia el dirigente, rodeándolo y volviendo a su puesto para dar continuidad al relevo con agilidad.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '626a313e-0407-4cfd-b714-c6aa6e51738c', 'Coordinando sus extremidades al lanzarse rápidamente al suelo en posición firme y al saltar de manera precisa y segura sobre los cuerpos de sus compañeros.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '1427451e-b8b3-493b-8525-e53298381e07', 'Ejecutando la dinámica de relevos con agilidad física y motora, cumpliendo la regla de lanzarse al piso y correr la distancia establecida.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '0765469b-caef-4457-9d6b-cb739c855402', 'Ejecutando la dinámica de relevos con agilidad física y motora, cumpliendo la regla de lanzarse al piso y correr la distancia establecida.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '91473f71-9345-4bcf-bfc7-dea709d12361', 'Realizando los saltos por encima de sus compañeras de patrulla con máximo cuidado y control corporal para evitar pisarlas o golpearlas.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'fb56310a-a9cf-46e3-9c34-c4643f6b9035', 'Realizando los saltos por encima de sus compañeros de patrulla con máximo cuidado y control corporal para evitar pisarlos o golpearlos.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'b69188bf-2391-43c1-a885-abd1b13912be', 'Aceptando las reglas del juego de relevos, pasando el pañolín exclusivamente por entremedio de las piernas y esperando el turno correspondiente.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', '5d2d48ed-c461-4a8e-9048-cceecd3de2e2', 'Disfrutando del juego cooperativo con su seisena, respetando el orden de la fila y la regla de no levantarse del suelo hasta que finalice el salto de su compañero.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'd737dfda-2d8d-4ca8-b650-8612d90b434e', 'Cooperando activamente en la cadena de paso del pañolín y sincronizándose con su patrulla para optimizar el tiempo del equipo.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'c6ec1a8c-37fb-441c-860c-755143523afe', 'Cooperando activamente en la cadena de paso del pañolín y sincronizándose con su patrulla para optimizar el tiempo del equipo.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'de2f5693-de4b-48f1-b870-3c62be99aea8', 'Aceptando las normas de seguridad del juego (mantener los brazos pegados al cuerpo y estirarse completamente) para resguardar la seguridad de todas.'),
  ('c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a', 'bbc48d53-f4aa-4de7-84d4-95614df76034', 'Aceptando las normas de seguridad del juego (mantener los brazos pegados al cuerpo y estirarse completamente) para resguardar la seguridad de todos.')
ON CONFLICT (articulo_id, objetivo_id) 
DO UPDATE SET como_se_cumple = EXCLUDED.como_se_cumple;

-- 2. Actualizar el campo metadata (JSONB) del artículo
UPDATE articulos 
SET metadata = metadata || '{
  "unidades": ["manada", "compania", "tropa"],
  "areas": ["corporalidad", "sociabilidad"],
  "justificacion_areas": "Esta dinámica física de alta energía y velocidad exige un gran despliegue de coordinación psicomotora fina y gruesa, reflejos y equilibrio (Corporalidad) tanto para agacharse rápidamente como para saltar sobre los compañeros acostados. Asimismo, fomenta la sincronización, el trabajo en equipo, la confianza y el respeto por las normas de seguridad fundamentales para evitar que los participantes se pisen o se lastimen durante la carrera (Sociabilidad).",
  "objetivos_educativos": [
    {
      "id": "d9ebcd96-c9cf-444f-94fb-5569110a1b99",
      "area": "Corporalidad",
      "texto": "Participo en actividades que me ayudan a tener un cuerpo cada vez más fuerte, ágil, veloz y flexible.",
      "unidad": "Manada",
      "como_se_cumple": "Corriendo a toda velocidad hacia el dirigente, rodeándolo y volviendo a su puesto para dar continuidad al relevo con agilidad."
    },
    {
      "id": "626a313e-0407-4cfd-b714-c6aa6e51738c",
      "area": "Corporalidad",
      "texto": "Manejo cada vez mejor mis brazos, piernas, manos y pies.",
      "unidad": "Manada",
      "como_se_cumple": "Coordinando sus extremidades al lanzarse rápidamente al suelo en posición firme y al saltar de manera precisa y segura sobre los cuerpos de sus compañeros."
    },
    {
      "id": "1427451e-b8b3-493b-8525-e53298381e07",
      "area": "Corporalidad",
      "texto": "Conozco y practico diferentes juegos y respeto sus reglas.",
      "unidad": "Compañía",
      "como_se_cumple": "Ejecutando la dinámica de relevos con agilidad física y motora, cumpliendo la regla de lanzarse al piso y correr la distancia establecida."
    },
    {
      "id": "0765469b-caef-4457-9d6b-cb739c855402",
      "area": "Corporalidad",
      "texto": "Conozco y practico diferentes juegos y respeto sus reglas.",
      "unidad": "Tropa",
      "como_se_cumple": "Ejecutando la dinámica de relevos con agilidad física y motora, cumpliendo la regla de lanzarse al piso y correr la distancia establecida."
    },
    {
      "id": "91473f71-9345-4bcf-bfc7-dea709d12361",
      "area": "Corporalidad",
      "texto": "Respeto mi cuerpo y el de los demás.",
      "unidad": "Compañía",
      "como_se_cumple": "Realizando los saltos por encima de sus compañeras de patrulla con máximo cuidado y control corporal para evitar pisarlas o golpearlas."
    },
    {
      "id": "fb56310a-a9cf-46e3-9c34-c4643f6b9035",
      "area": "Corporalidad",
      "texto": "Respeto mi cuerpo y el de los demás.",
      "unidad": "Tropa",
      "como_se_cumple": "Realizando los saltos por encima de sus compañeros de patrulla con máximo cuidado y control corporal para evitar pisarlos o golpearlos."
    },
    {
      "id": "b69188bf-2391-43c1-a885-abd1b13912be",
      "area": "Sociabilidad",
      "texto": "Acepto las reglas que se ponen en mi casa, en la escuela y en la Manada.",
      "unidad": "Manada",
      "como_se_cumple": "Aceptando las reglas del juego de relevos, pasando el pañolín exclusivamente por entremedio de las piernas y esperando el turno correspondiente."
    },
    {
      "id": "5d2d48ed-c461-4a8e-9048-cceecd3de2e2",
      "area": "Sociabilidad",
      "texto": "Me gusta jugar con otros niños y niñas y respeto las reglas de los juegos.",
      "unidad": "Manada",
      "como_se_cumple": "Disfrutando del juego cooperativo con su seisena, respetando el orden de la fila y la regla de no levantarse del suelo hasta que finalice el salto de su compañero."
    },
    {
      "id": "d737dfda-2d8d-4ca8-b650-8612d90b434e",
      "area": "Sociabilidad",
      "texto": "Trabajo con las demás personas para lograr las metas que nos hemos propuesto.",
      "unidad": "Compañía",
      "como_se_cumple": "Cooperando activamente en la cadena de paso del pañolín y sincronizándose con su patrulla para optimizar el tiempo del equipo."
    },
    {
      "id": "c6ec1a8c-37fb-441c-860c-755143523afe",
      "area": "Sociabilidad",
      "texto": "Trabajo con los demás personas para lograr las metas que nos hemos propuesto.",
      "unidad": "Tropa",
      "como_se_cumple": "Cooperando activamente en la cadena de paso del pañolín y sincronizándose con su patrulla para optimizar el tiempo del equipo."
    },
    {
      "id": "de2f5693-de4b-48f1-b870-3c62be99aea8",
      "area": "Sociabilidad",
      "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.",
      "unidad": "Compañía",
      "como_se_cumple": "Aceptando las normas de seguridad del juego (mantener los brazos pegados al cuerpo y estirarse completamente) para resguardar la seguridad de todas."
    },
    {
      "id": "bbc48d53-f4aa-4de7-84d4-95614df76034",
      "area": "Sociabilidad",
      "texto": "Respeto las normas de convivencia de los distintos ambientes en que actúo, aunque no siempre esté de acuerdo con ellas.",
      "unidad": "Tropa",
      "como_se_cumple": "Aceptando las normas de seguridad del juego (mantener los brazos pegados al cuerpo y estirarse completamente) para resguardar la seguridad de todos."
    }
  ]
}'::jsonb
WHERE id = 'c35bbb99-0eeb-4bc0-8e2f-316fd8891f5a';
