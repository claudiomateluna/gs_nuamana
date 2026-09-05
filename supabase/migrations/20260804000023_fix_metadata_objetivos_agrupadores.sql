SET client_encoding = 'UTF8';
BEGIN;

UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Favorecer la comunicación en el grupo", "Crear un clima de pertenencia", "Desfogue de Energías", "Fomentar un entorno de confianza"]'::jsonb)
WHERE slug = 'la-fusion-de-las-burbujas-y-palomitas';


UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Estimular la agilidad mental", "Conocer las capacidades corporales", "Trabajo en equipo", "Desarrollar la motricidad"]'::jsonb)
WHERE slug = 'el-alfabeto-humano';


UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Refuerzo de habilidades técnicas", "Estimular la agilidad mental", "Fomentar la comunicación e interpretación", "Trabajo en equipo"]'::jsonb)
WHERE slug = 'la-gran-carrera-de-la-mimica-scout';


UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Estimular la agilidad mental", "Estimular la atención a los detalles", "Reforzar la coordinación al interior del equipo", "Aprendizaje por la acción"]'::jsonb)
WHERE slug = 'el-enigma-de-los-globos-alfabeticos';


UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Desarrollar la motricidad", "Estimular la agilidad mental", "Trabajo en equipo", "Estimular la coordinación"]'::jsonb)
WHERE slug = 'geometria-corporal-en-movimiento';


UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Fomentar la comunicación e interpretación", "Fomentar un entorno de confianza", "Reforzar el conocimiento del cuerpo", "Facilitar el conocimiento entre los pares"]'::jsonb)
WHERE slug = 'el-modelado-de-las-emociones';


UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Crear un ambiente de distensión", "Estimular la agilidad mental", "Estimular la atención a los detalles", "Trabajo en equipo"]'::jsonb)
WHERE slug = 'el-relato-de-la-cueva-misteriosa';


UPDATE articulos 
SET metadata = jsonb_set(metadata, '{objetivos}', '["Fomentar la comunicación e interpretación", "Estimular la atención a los detalles", "Favorecer la comunicación en el grupo", "Conocer a los demás"]'::jsonb)
WHERE slug = 'el-lenguaje-de-los-labios';

COMMIT;