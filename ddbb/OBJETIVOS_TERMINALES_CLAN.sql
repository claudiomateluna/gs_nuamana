-- Archivo para actualizar los Objetivos Terminales de la Rama Clan (Unidad 5)
-- Transforma los objetivos educativos (redactados en 1ra persona) 
-- a su forma terminal oficial (redactados en 3ra persona).

BEGIN;

-- AREA 1: CORPORALIDAD
UPDATE public.progresion_objetivos SET texto_terminal = 'Convive constantemente en la naturaleza y participa en actividades deportivas y recreativas.' WHERE id = '106e27af-ec7a-45fa-9295-fcef88fbef3d';
UPDATE public.progresion_objetivos SET texto_terminal = 'Asume la parte de responsabilidad que le corresponde en el desarrollo armónico de su cuerpo.' WHERE id = 'bc8f595b-6949-4f2e-9304-86a2306449e1';
UPDATE public.progresion_objetivos SET texto_terminal = 'Conoce los procesos biológicos que regulan su organismo, protege su salud, acepta sus posibilidades físicas y orienta sus impulsos y fuerzas.' WHERE id = '69fff91f-a493-483d-92d6-8319700236c2';
UPDATE public.progresion_objetivos SET texto_terminal = 'Valora su aspecto y cuida su higiene personal y la de su entorno.' WHERE id = '0bdd48c4-4bce-4e8e-8db1-59bddebf7ad5';
UPDATE public.progresion_objetivos SET texto_terminal = 'Mantiene una alimentación sencilla y adecuada.' WHERE id = '438c0d3d-f127-4b59-ad45-b14f5147e8ba';
UPDATE public.progresion_objetivos SET texto_terminal = 'Administra su tiempo equilibradamente entre sus diversas obligaciones, practicando formas apropiadas de descanso.' WHERE id = 'f50793ec-af57-47d1-b3dd-1c7b178dcd32';

-- AREA 2: CREATIVIDAD
UPDATE public.progresion_objetivos SET texto_terminal = 'Expresa lo que piensa y siente a través de distintos medios, creando en los ambientes en que actúa espacios gratos que faciliten el encuentro y el perfeccionamiento entre las personas.' WHERE id = '91e60eba-e267-4d1a-b27b-ef61a7b03b31';
UPDATE public.progresion_objetivos SET texto_terminal = 'Incrementa continuamente sus conocimientos mediante la autoformación y el aprendizaje sistemático.' WHERE id = '30e41a98-a04a-459f-a64c-c4fc4f15f77d';
UPDATE public.progresion_objetivos SET texto_terminal = 'Actúa con agilidad mental ante las situaciones más diversas, desarrollando su capacidad de pensar, innovar y aventurar.' WHERE id = 'ef75fbed-4a6d-49ea-bfab-f2952415e1a0';
UPDATE public.progresion_objetivos SET texto_terminal = 'Une los conocimientos teórico y práctico mediante la aplicación constante de sus habilidades técnicas y manuales.' WHERE id = '29eee8b1-a414-4df9-90e1-520a384fb9aa';
UPDATE public.progresion_objetivos SET texto_terminal = 'Elige su vocación considerando conjuntamente sus aptitudes, posibilidades e intereses; y valora sin prejuicios las opciones de los demás.' WHERE id = 'b8819a1e-93e3-473b-b6f3-cef1b9d90334';
UPDATE public.progresion_objetivos SET texto_terminal = 'Valora la ciencia y la técnica como medios para comprender y servir al hombre, la sociedad y el mundo.' WHERE id = '27935a55-2a37-46f9-b6d6-3de72592181b';

-- AREA 3: CARÁCTER
UPDATE public.progresion_objetivos SET texto_terminal = 'Enfrenta la vida con alegría y sentido del humor.' WHERE id = 'd716bdfb-2fea-4b96-9a46-b86d66692d45';
UPDATE public.progresion_objetivos SET texto_terminal = 'Conoce sus posibilidades y limitaciones, aceptándose con capacidad de autocrítica y manteniendo a la vez una buena imagen de sí mismo.' WHERE id = '8f0eb7d9-c291-44f3-9551-4330c19e0cc2';
UPDATE public.progresion_objetivos SET texto_terminal = 'Es el principal responsable de su desarrollo y se esfuerza por superarse constantemente.' WHERE id = 'dc250033-597f-4c74-8142-74a7a1cc3d13';
UPDATE public.progresion_objetivos SET texto_terminal = 'Construye su proyecto de vida en base a los valores de la Ley y la Promesa.' WHERE id = '0bdf2252-6db5-41f9-8bc7-87e4da3ee602';
UPDATE public.progresion_objetivos SET texto_terminal = 'Actúa consecuentemente con los valores que le inspiran.' WHERE id = '770a8ff3-7bb8-45dd-b114-5ae1069eff62';
UPDATE public.progresion_objetivos SET texto_terminal = 'Reconoce en su grupo de pertenencia un apoyo para su crecimiento personal y para la realización de su proyecto de vida.' WHERE id = '8df0eaed-f805-4347-881d-3d5fac18c8a5';

-- AREA 4: AFECTIVIDAD
UPDATE public.progresion_objetivos SET texto_terminal = 'Logra y mantiene un estado interior de libertad, equilibrio y madurez emocional.' WHERE id = '07d61bf7-36fc-40f6-8f8e-21fe97b169f0';
UPDATE public.progresion_objetivos SET texto_terminal = 'Practica una conducta asertiva y una actitud afectuosa hacia las demás personas, sin inhibiciones ni agresividad.' WHERE id = 'd0ba748f-313b-4ffe-b2a3-fb21c1f8943f';
UPDATE public.progresion_objetivos SET texto_terminal = 'Construye su felicidad personal en el amor, sirviendo a los otros sin esperar recompensa y valorándolos por lo que son.' WHERE id = '39de3f68-3477-4c1f-8a29-170e914596d7';
UPDATE public.progresion_objetivos SET texto_terminal = 'Conoce, acepta y respeta su sexualidad y la del sexo complementario como expresión del amor.' WHERE id = '7c785c59-5116-455b-adc1-550937b56b42';
UPDATE public.progresion_objetivos SET texto_terminal = 'Reconoce a la familia como base de la sociedad, convirtiendo la suya en una comunidad de amor conyugal, filial y fraterno.' WHERE id = 'f79e2572-ab05-4256-863a-7af534aa33b1';

-- AREA 5: SOCIABILIDAD
UPDATE public.progresion_objetivos SET texto_terminal = 'Vive su libertad de un modo solidario, ejerciendo sus derechos, cumpliendo sus obligaciones y defendiendo igual derecho para los demás.' WHERE id = 'b5a81328-5c07-41bd-a1ea-1ed401762841';
UPDATE public.progresion_objetivos SET texto_terminal = 'Reconoce y respeta la autoridad válidamente establecida y la ejerce al servicio de los demás.' WHERE id = '90b668d6-3e32-4544-ac2a-7f1348b4f37f';
UPDATE public.progresion_objetivos SET texto_terminal = 'Cumple las normas que la sociedad se ha dado, evaluándolas con responsabilidad y sin renunciar a cambiarlas.' WHERE id = 'b5954f1c-4d0d-4bdb-97d8-821583beb77e';
UPDATE public.progresion_objetivos SET texto_terminal = 'Sirve activamente en su comunidad local, contribuyendo a crear una sociedad justa, participativa y fraterna.' WHERE id = 'f47192a7-6d68-4a3a-9847-8d1c29f7ba49';
UPDATE public.progresion_objetivos SET texto_terminal = 'Hace suyos los valores de su país, su pueblo y su cultura.' WHERE id = '3c89c7ee-5827-4002-9c1d-76bd26bae6fa';
UPDATE public.progresion_objetivos SET texto_terminal = 'Promueve la cooperación internacional, la hermandad mundial y el encuentro de los pueblos, luchando por la comprensión y la paz.' WHERE id = '5d199d2b-a65d-4195-8915-5f8dab0450de';
UPDATE public.progresion_objetivos SET texto_terminal = 'Contribuye a preservar la vida a través de la conservación de la integridad del mundo natural.' WHERE id = 'c4f78e61-6790-4cf4-b477-993900b5bf02';

-- AREA 6: ESPIRITUALIDAD
UPDATE public.progresion_objetivos SET texto_terminal = 'Busca siempre a Dios en forma personal y comunitaria, aprendiendo a reconocerlo en los hombres y en la Creación.' WHERE id = '0a9a9dac-0b1c-4f11-8600-291de10b1b95';
UPDATE public.progresion_objetivos SET texto_terminal = 'Adhiere a principios espirituales, es fiel a la religión que los expresa y acepta los deberes que de ello se desprenden.' WHERE id = '1c28f12c-5f38-4609-b095-215c54ec707d';
UPDATE public.progresion_objetivos SET texto_terminal = 'Practica la oración personal y comunitaria, como expresión de su búsqueda de Dios y como un medio de relacionarse con Él.' WHERE id = 'cefd7d3c-5a3c-46b9-ba94-4f3556ba68e6';
UPDATE public.progresion_objetivos SET texto_terminal = 'Integra sus principios religiosos a su conducta cotidiana, estableciendo coherencia entre su fe, su vida personal y su participación social.' WHERE id = 'ed57439e-1d13-4cb2-ae32-ddd3978d33bd';
UPDATE public.progresion_objetivos SET texto_terminal = 'Dialoga con todas las personas cualquiera sea su opción religiosa, buscando establecer vínculos de comunión entre los hombres y mujeres.' WHERE id = '5c2e103a-bea4-4e16-bf81-bc47d0ae8ad1';

COMMIT;
