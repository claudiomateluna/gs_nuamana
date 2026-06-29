# Análisis del Sitio Actual (www.nuamana.cl)

El sitio actual es un WordPress que utiliza una estructura personalizada basada en ACF (Advanced Custom Fields) y JetPlugins (Crocoblock). A continuación se detallan los hallazgos clave:

## 1. Estructura de Usuarios
El sistema cuenta con un perfil de usuario extendido con 48 campos personalizados. Estos campos cubren:
- **Información Personal:** RUT, Teléfono, Dirección, Comuna, Fecha de Nacimiento, Género, Condición Religiosa.
- **Vínculo Scout:** Grupo, Unidad, Colegio, Estudiante de.
- **Apoderados y Pupilos:** Relación con apoderados, nombres de pupilos (hasta 4), relación y unidad de los pupilos.
- **Salud:** Sistema de salud, detalle del sistema, tipo de sangre, alergias, antecedentes médicos, tratamiento médico, consumo de medicamentos, dieta alimentaria.
- **Emergencia:** Tres contactos de emergencia con nombre, número y relación.
- **Otros:** Autorización de publicación de fotos, Fe pública.

## 2. Contenido y Blog
El blog está organizado por categorías jerárquicas:
- **Actividades:** Dinámicas, Juegos, Talleres.
- **Técnicas:** Cabuyería, Campismo, Claves y Pistas, Pionerismo.
- **Historia:** Biografías, Historia Scout.
- **Administrativo:** Información.

Cada tipo de artículo tiene campos específicos:
- **Actividades:** Materiales, Variaciones, Recomendaciones.
- **Historia (Biografías):** Lugar/País de nacimiento, Fecha de nacimiento/defunción.
- **Historia Scout:** Lugar/País/Año del hecho.

## 3. Tipos de Contenido Personalizados (CPT)
- **Unidades:** Gestiona la información de las unidades (Manada, Compañía, Tropa, Avanzada). Campos: Nombre, Imágenes, Descripción, Colores.
- **Descargas:** Gestiona archivos para descargar. Campos: Tipo de descarga, Link.

## 4. SEO
El sitio utiliza **Rank Math SEO** para la optimización en buscadores. Los artículos tienen un enfoque claro en proveer información valiosa (método scout, técnicas) lo cual es excelente para el posicionamiento orgánico.

## 5. Diseño y UX
- El sitio es responsivo y utiliza un diseño limpio con colores scouts.
- La navegación es sencilla pero puede mejorar con la conversión a PWA para ofrecer una experiencia más fluida ("App-like").
- El frontend actual tiene una buena captación de nuevos scouts mediante la visibilidad de las actividades.
