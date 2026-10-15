-- Add custom fields to unidades table for full administration from CMS
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS lema text;
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS rango_edad text;
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS marco_simbolico text;
ALTER TABLE unidades ADD COLUMN IF NOT EXISTS descripcion_larga text;

-- Seed initial values for existing units
UPDATE unidades SET
  lema = COALESCE(lema, '¡Siempre Mejor!'),
  rango_edad = COALESCE(rango_edad, '7 a 11 años'),
  marco_simbolico = COALESCE(marco_simbolico, 'El Libro de las Tierras Vírgenes (Mowgli)'),
  descripcion_larga = COALESCE(descripcion_larga, 'La Manada de Lobatos es la primera etapa del camino scout. Aquí, niños y niñas de 7 a 11 años viven la fantasía del ''Libro de las Tierras Vírgenes'' (Mowgli). Aprenden a convivir en el Pueblo Libre, guiados por Akela, Baloo y Bagheera, bajo el lema ''Siempre Mejor''. A través de juegos, talleres y el contacto con la naturaleza, los lobatos desarrollan su carácter, afectividad y sociabilidad, aprendiendo el valor de la buena acción diaria.')
WHERE id = 1;

UPDATE unidades SET
  lema = COALESCE(lema, '¡Siempre Listas!'),
  rango_edad = COALESCE(rango_edad, '11 a 15 años'),
  marco_simbolico = COALESCE(marco_simbolico, 'Sistema de Patrullas para Guiadoras'),
  descripcion_larga = COALESCE(descripcion_larga, 'La Compañía de Guías reúne a jóvenes de 11 a 15 años que se organizan en Patrullas para vivir grandes aventuras al aire libre. Guiadas por el espíritu del Escultismo, desarrollan su autonomía, liderazgo y trabajo en equipo, preparándose para ser ciudadanas activas bajo el lema ''Siempre Listas''. El sistema de patrulla les permite asumir responsabilidades reales, tomar decisiones democráticas y planificar sus propias excursiones y proyectos.')
WHERE id = 2;

UPDATE unidades SET
  lema = COALESCE(lema, '¡Siempre Listos!'),
  rango_edad = COALESCE(rango_edad, '11 a 15 años'),
  marco_simbolico = COALESCE(marco_simbolico, 'Sistema de Patrullas y Vida al Aire Libre'),
  descripcion_larga = COALESCE(descripcion_larga, 'La Tropa de Scouts es el espacio para jóvenes de 11 a 15 años donde la vida en patrulla cobra todo su sentido. A través de campamentos, excursiones, técnicas de supervivencia y especialidades, cada scout descubre su potencial y se compromete a dejar el mundo en mejores condiciones de cómo lo encontró, bajo el lema ''Siempre Listos''. La vida al aire libre es su principal aula, donde aprenden civismo, cabuyería, orientación y primeros auxilios.')
WHERE id = 3;

UPDATE unidades SET
  lema = COALESCE(lema, '¡Siempre Adelante!'),
  rango_edad = COALESCE(rango_edad, '15 a 17 años'),
  marco_simbolico = COALESCE(marco_simbolico, 'Comunidad de Pioneros y los 7 Rumbos'),
  descripcion_larga = COALESCE(descripcion_larga, 'La Avanzada de Pioneros reúne a jóvenes de 15 a 17 años en la Comunidad de Pioneros. Es una etapa de grandes desafíos, proyectos colectivos (''Aventuras'') y exploración de competencias. Los pioneros definen su propio rumbo, debaten ideas y construyen su identidad bajo el lema ''Siempre Adelante''. En esta unidad, las especialidades tradicionales se transforman en Competencias en 7 rumbos clave, impulsando el liderazgo juvenil y la participación comunitaria.')
WHERE id = 4;

UPDATE unidades SET
  lema = COALESCE(lema, 'Servir'),
  rango_edad = COALESCE(rango_edad, '17 a 20 años'),
  marco_simbolico = COALESCE(marco_simbolico, 'Remar Tu Propia Canoa y La Partida'),
  descripcion_larga = COALESCE(descripcion_larga, 'El Clan de Caminantes (o Rovers) es la etapa terminal para jóvenes de 17 a 20 años. Los caminantes se preparan para la vida adulta remando su propia canoa. A través de proyectos de servicio comunitario, metas personales y un profundo compromiso social, emprenden el viaje hacia ''La Partida'' bajo el lema ''Servir''. Su progresión se basa en proyectos individuales de 12 pasos y una agenda personal de objetivos a 6 meses para forjar ciudadanos conscientes y comprometidos.')
WHERE id = 5;
