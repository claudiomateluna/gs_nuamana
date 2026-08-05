-- ==============================================================================
-- CMS ADMIN FASE 1: Seed data para configuracion_sitio
-- Fecha: 2026-07-29
-- Propósito: Poblar la tabla con los valores actuales hardcodeados
-- ==============================================================================

-- BRANDING
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('branding', 'nombre_grupo', '"Guías y Scouts Nua Mana"', 'Nombre completo del grupo'),
('branding', 'nombre_corto', '"Nua Mana"', 'Nombre corto para headers y footers'),
('branding', 'pretitulo', '"Guías y Scouts"', 'Texto que aparece sobre el nombre'),
('branding', 'slogan', '"una nueva aventura"', 'Slogan/tagline del grupo'),
('branding', 'mision', '"Nuestra misión es contribuir a la educación de jóvenes para que participen en la construcción de un mundo mejor, donde las personas se desarrollen plenamente y jueguen un papel constructivo en la sociedad."', 'Texto de misión en el footer'),
('branding', 'motto', '"Educación para la vida • Empoderamiento juvenil • Un mundo mejor"', 'Motto en el footer'),
('branding', 'logo_header', '"/images/logos/logo-nuamana.webp"', 'Logo en el header'),
('branding', 'logo_footer', '"/images/logos/Iconos-logo.svg"', 'Logo en el footer'),
('branding', 'copyright', '"Guías y Scouts Nua Mana"', 'Nombre en el copyright')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- SOCIAL
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('social', 'instagram', '"https://instagram.com/gruponuamana/"', 'URL de Instagram'),
('social', 'facebook', '"https://facebook.com/gruponuamana"', 'URL de Facebook'),
('social', 'youtube', '"https://youtube.com/@gruponuamana"', 'URL de YouTube'),
('social', 'tiktok', '"https://tiktok.com/@gruponuamana"', 'URL de TikTok'),
('social', 'google', '"https://google.com/search?q=Guías+y+Scouts+Nua+Mana"', 'URL de Google'),
('social', 'whatsapp', '"https://wa.me/56966896001"', 'URL de WhatsApp'),
('social', 'email', '"mailto:contacto@nuamana.cl"', 'Email de contacto')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- CONTACT
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('contact', 'sede_nombre', '"Sede San José"', 'Nombre de la sede'),
('contact', 'direccion', '"San José de la Estrella 1004<br/>La Granja, Santiago, Chile"', 'Dirección completa'),
('contact', 'direccion_corta', '"San José de la Estrella<br/>1004, La Granja"', 'Dirección corta para visit-section'),
('contact', 'maps_embed', '"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.382796811922!2d-70.6096195!3d-33.569409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d0a6e457520d%3A0xc3892aa7fa7d74b!2sGuias%20y%20Scouts%20Nua%20Mana!5e0!1ses!2scl!4v1763171854990!5m2!1ses!2scl"', 'Google Maps embed URL (footer)'),
('contact', 'maps_embed_visit', '"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.382796811922!2d-70.6096195!3d-33.569409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d0a6e457520d%3A0xc3892aa7fa7d74b!2sGuias%20y%20Scouts%20Nua%20Mana!5e0!1ses!2scl!4v1763411447730!5m2!1ses!2scl"', 'Google Maps embed URL (visit-section)')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- HERO
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('hero', 'frases', '["SCOUTS, Educación para la Vida", "Empoderamos a niñas niños y jovenes, Con Habilidades para Crear un Mundo Mejor", "Vivimos en una Aventura, Transformadora y Llena de Crecimiento Personal"]', 'Frases del hero slider'),
('hero', 'fondo', '"/images/inicio/fondo.webp"', 'Imagen de fondo del hero'),
('hero', 'intervalo', '5000', 'Intervalo del slider en milisegundos')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- FEATURES
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('features', 'titulo_seccion', '"¿Qué hacemos?"', 'Título de la sección features'),
('features', 'subtitulo', '"Descubre las actividades que realizamos en Nua Mana para el desarrollo integral de las niñas, niños y jóvenes."', 'Subtítulo de la sección features'),
('features', 'items', '[
  {"title": "LOGRAMOS", "description": "Empoderamiento Juvenil", "image": "/images/inicio/pag_Logramos.jpg", "link": "/lo-que-hacemos/sistema-de-equipos"},
  {"title": "CREAMOS", "description": "Ciudadan@s Activ@s", "image": "/images/inicio/pag_Creamos.jpg", "link": "/lo-que-hacemos/programa-y-actividades"},
  {"title": "CULTIVAMOS", "description": "Valores y Habilidades", "image": "/images/inicio/pag_Cultivamos.jpg", "link": "/lo-que-hacemos/habilidades-y-tecnicas"},
  {"title": "ABRAZAMOS", "description": "Educación para la Paz", "image": "/images/inicio/pag_Abrazamos.jpg", "link": "/lo-que-hacemos/aprender-haciendo"}
]', 'Items de la sección features')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- FAQ
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('faq', 'titulo_seccion', '"Preguntas Frecuentes"', 'Título de la sección FAQ'),
('faq', 'subtitulo', '"Encuentra respuestas a las dudas más comunes"', 'Subtítulo de la sección FAQ'),
('faq', 'items', '[
  {"question": "¿PUEDO SER SCOUT?", "answer": "Sí, <b>todos pueden ser scouts</b>, nuestro grupo es abierto a toda la comunidad, para poder ser parte de los scouts, sólo tienes que ser mayor de 7 años y tener ganas de divertirte y jugar junto a otras personas.", "image": "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-puedoSerScout.png"},
  {"question": "¿CÓMO PUEDO PARTICIPAR?", "answer": "Para nosotros es muy importante que niñas, niños y jóvenes se sientan cómodos siendo Scout, para poder participar lo primero es ver si te gusta, por eso tenemos las puertas abiertas a todos y todas las y los que quieran asistir, entonces, ¿Cómo puedes participar? <b>sólo ven un sábado de 3 a 6 de la tarde</b> y ve si te gusta.", "image": "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-comoPuedoParticipar.png"},
  {"question": "¿HASTA QUÉ EDAD PUEDO SER SCOUT?", "answer": "Las y los niños, niñas y jóvenes que participan de las actividades <b>van desde los 7 a los 21 años</b>.", "image": "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-hastaQueEdadPuedoSerScout.png"},
  {"question": "¿HAY QUE PAGAR ALGO?", "answer": "Cómo dijimos antes lo más importante es que te guste, por lo mismo, para ir sábado a sábado a las actividades de 3 a 6 de la tarde, no hay que pagar nada.<br><br>Sin embargo, también nos preocupamos por la salud de las y los scouts, es por ello que tenemos un <b>seguro de accidentes scouts</b> que está incluido dentro de nuestra inscripción. Hay que pagar una inscripción, pero sólo una vez que estás seguro de que te sientes cómodo y que te gusta estar en los Scouts, por otra parte, las salidas por el día, los campamentos y otras actividades tienen un costo que se destina completamente a cubrir los gastos de esas actividades.<br><br>Finalmente, no queremos que el dinero sea un factor por el que no seas Scout, es por lo mismo que como grupo hacemos muchas actividades económicas durante el año, para poder financiar los campamentos y salidas, y depende de tu colaboración en esas actividades el costo que tendrán las salidas y campamentos para tí, ya que la recaudación de las actividades económicas se destina a cubrir esos gastos.", "image": "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-hayQuePagarAlgo.png"},
  {"question": "¿QUÉ INCLUYE LA INSCRIPCIÓN?", "answer": "La inscripción incluye:<br><br><b>• Seguro scout</b> (es un seguro complementario de salud, que se cobra como reembolso posterior a los gastos médicos y descuentos propios de cada niño, niña o joven)<br><b>• Credencial scout</b><br><b>• Insignia del año</b>", "image": "https://raw.githubusercontent.com/claudiomateluna/nua_mana/gh-pages/uploads/FAQ-queIncluyeLaInscripcion.png"}
]', 'Items del FAQ')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- TESTIMONIALS
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('testimonials', 'titulo_seccion', '"Lo que dicen de nosotros"', 'Título de la sección testimonios'),
('testimonials', 'widget_url', '"https://widget.taggbox.com/307862?website=1"', 'URL del widget de Taggbox')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- VISIT
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('visit', 'titulo', '"¡Únete Ahora!"', 'Título de la sección visit'),
('visit', 'fecha_fundacion', '"2005-09-23"', 'Fecha de fundación del grupo'),
('visit', 'email', '"contacto@nuamana.cl"', 'Email de contacto en visit-section'),
('visit', 'email_href', '"mailto:contacto@nuamana.cl"', 'Href del email'),
('visit', 'horario', '"Sábados 3 a 6 PM"', 'Horario de reuniones'),
('visit', 'cta_texto', '"VEN A VISITARNOS"', 'Texto del CTA en visit-section'),
('visit', 'imagen', '"/images/inicio/AndysShow.png"', 'Imagen de la sección visit')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- SEO
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('seo', 'title', '"Guías y Scouts Nua Mana - Una Nueva Aventura"', 'SEO title'),
('seo', 'description', '"Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre."', 'SEO description'),
('seo', 'theme_color', '"#cb3327"', 'Theme color para viewport')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- PWA
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('pwa', 'name', '"Guías y Scouts Nua Mana"', 'Nombre completo PWA'),
('pwa', 'short_name', '"Nua Mana"', 'Nombre corto PWA'),
('pwa', 'description', '"Portal oficial del Grupo Guía y Scout Nua Mana. Educación para la vida, empoderamiento juvenil y aventuras al aire libre."', 'Descripción PWA'),
('pwa', 'background_color', '"#ffffff"', 'Background color PWA'),
('pwa', 'theme_color', '"#cb3327"', 'Theme color PWA'),
('pwa', 'lang', '"es"', 'Idioma PWA'),
('pwa', 'icon_192', '"/icon-192x192.png"', 'Icono 192x192'),
('pwa', 'icon_512', '"/icon-512x512.png"', 'Icono 512x512'),
('pwa', 'icon_1024', '"/icon-1024x1024.png"', 'Icono 1024x1024')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();

-- NAVIGATION
INSERT INTO configuracion_sitio (categoria, clave, valor, descripcion) VALUES
('navigation', 'label_panel', '"Mi Panel"', 'Label del link al panel'),
('navigation', 'label_login', '"Acceder"', 'Label del link de login')
ON CONFLICT (categoria, clave) DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW();
