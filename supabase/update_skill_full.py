import os
import json

with open('supabase/objetivos_list.json', 'r', encoding='utf-8') as f:
    objetivos_list = json.load(f)

objs_formatted = "\n".join(f"   - `{o}`" for o in objetivos_list)

skill_content = f"""---
name: articulos-nuamana
description: Procesador unificado de contenidos scouts (Juegos, Dinámicas, Técnicas, Historias Scouts y Biografías) para NuaMana PWA. Extrae textos crudos, valida duplicados en la BD, reescribe títulos de forma sencilla/directa, aplica vocabulario chileno oficial (pañolín/pañolines en lugar de pañoleta/pañuelo), redacta HTML semántico sin inline styles (espaciado controlado por globals.css), mapea categorías jerárquicas con la tabla de 23 categorías, selecciona objetivos generales del catálogo oficial de 58 ítems, garantiza coincidencia estricta 1:1 entre unidades declaradas y objetivos educativos de la matriz de 5 claves con UUIDs reales consultados de progresion_objetivos (cero unidades huérfanas), genera imágenes destacadas únicas compuestas en 5 capas con process_template_image.py / image-utils.ts (firma_background, foto 1:1, firma_frontal, título con contorno y categoría en rojo sobre badge clr1 con rounded-sm) aplicando el uniforme Nua Mana (camisa gris perla manga larga, jeans azul marino, pañolín bicolor rojo/negro con cinta amarilla según panolin_nua.svg) y rotación de banderas permitidas (Chile, Rapa Nui / Reimiro, Grupo Nua Mana según bandera_simplificada.svg, Unidades), y produce el script SQL listo para Supabase local.
---

# ⚜️ Skill Unificada: Procesador de Contenidos NuaMana

Esta skill es la **única autoridad experta** para procesar, transformar e insertar artículos scouts crudos en la plataforma NuaMana PWA.

---

## 🎭 Persona y Rol del Sistema
Al procesar contenido, la IA adopta la personalidad de un **"Experto en Desarrollo Infantil y Juvenil y Metodología Scout"**, aplicando análisis clínico-pedagógico para seleccionar objetivos educativos que tengan **relación directa y estricta con el `contenido` real del artículo**.

---

## ⚙️ Reglas Fundamentales de Arquitectura y Base de Datos

1. **`id`**: No se genera en la IA. PostgreSQL aplica `uuid_generate_v4()`.
2. **`autor_id`**: Se obtiene dinámicamente consultando el ID del administrador (`rol_id = 1`):
   ```sql
   SELECT id FROM perfiles WHERE rol_id = 1 LIMIT 1;
   ```
3. **`categoria_id` (en tabla `articulos`)**: **Siempre debe ser `NULL`**.
4. **Categorías Jerárquicas (`articulo_categorias`) y Tabla de 23 Categorías**: 
   Cada artículo vincula su categoría específica e **implícitamente su categoría Padre**.
   
   | Categoría | ID | Padre ID | Categoría Padre |
   | :--- | :---: | :---: | :--- |
   | **Actividades** | `1` | `NULL` | *(Categoría Raíz)* |
   | **Juegos** | `7` | `1` | Actividades |
   | **Juegos Democráticos** | `8` | `1` | Actividades |
   | **Juegos Nocturnos** | `9` | `1` | Actividades |
   | **Dinámicas** | `10` | `1` | Actividades |
   | **Talleres** | `11` | `1` | Actividades |
   | **Técnicas** | `2` | `NULL` | *(Categoría Raíz)* |
   | **Animación** | `17` | `2` | Técnicas |
   | **Cabuyería** | `18` | `2` | Técnicas |
   | **Campismo** | `19` | `2` | Técnicas |
   | **Claves y Pistas** | `20` | `2` | Técnicas |
   | **Cocina** | `21` | `2` | Técnicas |
   | **Pionerismo** | `22` | `2` | Técnicas |
   | **Primeros Auxilios**| `23` | `2` | Técnicas |
   | **Historia** | `3` | `NULL` | *(Categoría Raíz)* |
   | **Biografías** | `14` | `3` | Historia |
   | **Historia Scout** | `15` | `3` | Historia |
   | **Historias Scouts** | `16` | `3` | Historia |
   | **Administrativo** | `4` | `NULL` | *(Categoría Raíz)* |
   | **Apoderados** | `12` | `4` | Administrativo |
   | **Información** | `13` | `4` | Administrativo |
   | **Ciudadanía** | `5` | `NULL` | *(Categoría Raíz)* |
   | **Reflexión** | `6` | `NULL` | *(Categoría Raíz)* |

5. **`titulo` (REESCRITURA SENCILLA, CLARA Y DIRECTA)**: 
   - **PROHIBIDO usar el título original del sitio fuente al pie de la letra.**
   - El título DEBE ser reescrito pero de forma **sencilla, natural, limpia y directa** (ej: de *"Captura de serpientes"* a *"Cazadores de Serpientes"*, de *"Pelea de gallos"* a *"Duelo de Gallitos"*, de *"El lavado de autos"* a *"El Lavado Fraterno"*). Evitar nombres extremadamente largos o recargados de subtítulos.
6. **`slug`**: Se genera determinísticamente en minúsculas sin tildes ni caracteres especiales (`slugify(titulo)`).
7. **`contenido` (HTML SEMÁNTICO LIMPIO)**: 
   - **NUNCA usar Markdown ni estilos inline (`style="..."`) ni etiquetas `<br>` repetidas**. 
   - El espaciado entre párrafos se maneja automáticamente en la UI mediante las reglas CSS de `.blog-content p` (`margin-top: 1.25rem`, `margin-bottom: 1.75rem`).
   - Redactar exclusivamente en **HTML semántico** (`<h2>`, `<h3>`, `<p>`, `<ol>`, `<ul>`, `<li>`, `<strong>`, `<em>`, `<hr>`).
   - Contiene **únicamente** la presentación del juego/técnica (`<h2>📜 Descripción del Juego</h2>` o `<h2>📜 Descripción de la Técnica</h2>`) y el paso a paso (`<h3>🎲 ¿Cómo se juega?</h3>` o `<h3>🛠️ Paso a Paso</h3>`).
   - **PROHIBIDO poner Variaciones y Recomendaciones dentro del `contenido` HTML**. Éstas van exclusivamente en los campos de `metadata`.
8. **Codificación UTF-8 Estricta (Inyección Binaria)**:
   - **PROHIBIDO corruptores de caracteres** (`??`, `Ã³`, tildes rotas).
   - Todos los scripts e inserciones DEBEN ejecutarse garantizando bytes UTF-8 puros para que el filtrado por JSONB `metadata->'objetivos'` funcione en PostgreSQL.
9. **`extracto`**: Máximo 150 caracteres (resumen claro de 1 o 2 oraciones cortas).
10. **`imagen_destacada` (ILUSTRACIÓN DESCRIPTIVA, PLANTILLA PROCESS_TEMPLATE_IMAGE 540x540 WebP, UNIFORME Y BANDERA NUA MANA)**: 
    - **100% ÚNICA Y ALTAMENTE DESCRIPTIVA DE LA ACCIÓN REAL DEL ARTÍCULO**.
    - **ESTÁNDAR DE UNIFORME SCOUT NUA MANA Y PAÑOLÍN EN GENERATE_IMAGE:**
      Al invocar `generate_image`, el prompt DEBE detallar la acción específica y declarar la vestimenta oficial scout:
      - **Camisa (MANGA LARGA):** Camisa gris perla de manga larga o arremangada (`long-sleeved light pearl-gray scout shirt`).
      - **Pantalón:** Jeans azul marino (`dark blue denim jeans`).
      - **Pañolín Oficial Nua Mana (REFERENCIA SVG `frontend/public/images/unidades/panolin_nua.svg`):**
        `"A traditional bipartite half-and-half scout neckerchief: the left half is vivid red ( #cb2733 ), the right half is black ( #131313 ). Over the left half there is a black stripe ( #131313 ) topped with a bright golden yellow stripe ( #f6c812 ). Over the right half there is a vivid red stripe ( #cb2733 ) topped with a bright golden yellow stripe ( #f6c812 )."`
      - **TEXTO VISIBLE EN LA ILUSTRACIÓN:** Si la imagen incluye palabras o letreros, **DEBEN ESTAR STRICTAMENTE EN ESPAÑOL**.
      - **REGLAS Y ROTACIÓN EQUITATIVA DE BANDERAS PERMITIDAS:**
        Para evitar monotonía visual, **NO USAR ÚNICAMENTE LA BANDERA DE CHILE EN TODAS LAS IMÁGENES**. Se DEBE rotar equitativamente entre estas 4 opciones autorizadas:
        1. **Bandera Oficial del Grupo Scout Nua Mana (REFERENCIA SVG `frontend/public/images/unidades/bandera_simplificada.svg`):**
           `"official Flag of Nua Mana Scout Group: A horizontal rectangular flag with a smooth linear gradient fading from vivid red (#cb3228) on the left side to dark charcoal black (#1d1d1d) on the right side. In the exact center, there is a prominent solid emerald-green (#3fb34a) silhouette of Easter Island (Rapa Nui). Overlaying the green island silhouette is a stylized Fleur-de-lis emblem formed by traditional Rapa Nui Tangata Manu (Birdman) figures, surrounded by the golden yellow WAGGGS Trefoil emblem."`
        2. **Bandera Oficial de Rapa Nui (Te Reva Reimiro):** 
           `"official Flag of Rapa Nui: A flat, minimalist graphic of the Flag of Rapa Nui. Solid pure white background (#FFFFFF) with a solid crimson red Reimiro symbol (#FF0000) in the exact center. The Reimiro is a horizontal crescent shape curving upwards like a stylized canoe, with a stylized anthropomorphic head in profile at both tips facing outward with a pointed chin or goatee."`
        3. **Bandera Oficial de Chile:** (`official Chilean flag: bright red, white, and blue flag with a single white star in a blue canton`).
        4. **Banderas Oficiales de Unidad:** (`official Manada / Tropa / Compañía / Avanzada / Clan unit flag`).
        - *PROHIBIDA cualquier otra bandera extranjera.*
    - **Procesamiento de 5 Capas (`supabase/process_template_image.py` & `frontend/src/lib/image-utils.ts`):**
      Toda imagen generada se procesa mediante el script helper `supabase/process_template_image.py` que replica `image-utils.ts` en 5 capas:
      1. Capa 1: Fondo `/images/template/firma_background.webp` (540x540).
      2. Capa 2: Foto recortada 1:1 centrada (540x540).
      3. Capa 3: Marco frontal `/images/template/firma_frontal.webp` (540x540).
      4. Capa 4: Título del Artículo en mayúsculas (fuente 20px negrita, relleno blanco, contorno rojo `#cb3327`, X:79, Y:495).
      5. Capa 5: Categoría principal en mayúsculas (fuente 20px negrita, texto rojo `#cb3327`, sobre badge de fondo blanco `clr1` `#ffffff` con padding 2px y bordes redondeados `sm` radius 4px, X:505, Y:25).
    - Se guarda en `frontend/public/uploads/[slug].webp` y se registra la URL `/uploads/[slug].webp`.
11. **🇨🇱 VOCABULARIO INSTITUCIONAL CHILENO (PAÑOLÍN / PAÑOLINES)**:
    - En todo el texto procesado (título, slug, contenido HTML, extracto, variaciones, recomendaciones, materiales y etiquetas), **QUEDA STRICTAMENTE PROHIBIDO** utilizar los términos españoles/internacionales "pañoleta", "pañoletas", "pañuelo" o "pañuelos".
    - DEBEN sustituirse **SIEMPRE Y SIN EXCEPCIÓN** por la terminología oficial de la Asociación de Guías y Scouts de Chile:
      - `pañoleta` / `pañuelo` $\\rightarrow$ **`pañolín`**
      - `pañoletas` / `pañuelos` $\\rightarrow$ **`pañolines`**
12. **`estado`**: Siempre `'publicado'`.
13. **`seo_titulo` y `seo_descripcion`**: Permanecen en `NULL` (fallback automático en Next.js).
14. **`etiquetas`**: Array de 3 a 5 palabras clave en minúsculas (ej: `["juego", "exterior", "cooperativo"]`).

---

## 🎯 Catálogo Oficial de 58 Objetivos Generales (Selección Exclusiva)
Al poblar el campo `metadata.objetivos`, se DEBE seleccionar entre 2 y 4 elementos pertenecientes **EXCLUSIVAMENTE a este catálogo oficial de 58 ítems**:

{objs_formatted}

---

## 📑 Reglas Específicas por Tipo de Contenido

### 🅰️ SI EL ARTÍCULO ES UNA ACTIVIDAD (Juego, Dinámica, Juego Nocturno, Juego Democrático, Taller)
El objeto `metadata` (JSONB) debe contener obligatoriamente los siguientes campos:

1. **`unidades`**: Array en minúsculas evaluado según rango etario (`["manada", "compañía", "tropa", "avanzada", "clan"]`).
2. **`duracion`**: De `05 minutos` a `60 minutos` (saltos de 5 en 5, 2 dígitos) o valores específicos (`90 minutos`, `120 minutos`, `180 minutos`, `todo el día`).
3. **`cantidad`**: `individual`, de `02 participantes` a `12 participantes` (saltos de 2 en 2, 2 dígitos) o específicos (`16 participantes`, `24 participantes`, `32 participantes`, `Toda la Unidad`).
4. **`lugares`**: Array seleccionado de la taxonomía oficial (`Interior`, `Exterior`, `campo abierto`, `campo delimitado` con sus sub-ítems).
5. **`materiales` (OBLIGATORIO Y VISIBLE EN UI)**: Array de nombres **genéricos canónicos** (ej: `["Cuerdas", "Pelotas", "Sin Materiales"]`). Si se refiere a la prenda scout, usar siempre `"Pañolines"`.
6. **`areas` (STRICTAMENTE EN MINÚSCULAS)**: Selección de 1 a 3 áreas del desarrollo scout **stricatmente en minúsculas** (`["corporalidad", "creatividad", "carácter", "afectividad", "sociabilidad", "espiritualidad"]`).
7. **`objetivos` (Objetivos Generales)**: Selección del catálogo oficial de **58 Objetivos Generales**.
8. **`justificacion_areas`**: Explicación pedagógica rica y detallada (mínimo 4-5 líneas) desde la perspectiva de un experto en desarrollo infantil.
9. **`variaciones` (DETALLADAS Y EXTENSAS)**: 
   - Va **exclusivamente en `metadata.variaciones`**.
   - Texto descriptivo y profundo de alternativas, adaptaciones por clima, tamaño de grupo o niveles de dificultad. Usa la palabra `pañolín` / `pañolines`. Permite etiquetas `<b>...</b>` para títulos de variaciones.
10. **`recomendaciones` (DETALLADAS Y EXTENSAS)**: 
    - Va **exclusivamente en `metadata.recomendaciones`**.
    - Consejos extensos de seguridad, facilitación, rol de dirigentes y dinamización del clima de confianza. Usa la palabra `pañolín` / `pañolines`. Permite etiquetas `<b>...</b>` para títulos de recomendaciones.
11. **`objetivos_educativos` (COINCIDENCIA STRICTA 1:1 CON UNIDADES Y VERIFICACIÓN DE UUIDs EN POSTGRESQL)**:
    - **REGLA DE COINCIDENCIA STRICTA DE UNIDADES:** `metadata.unidades` DEBE coincidir exactamente con las unidades incluidas en `metadata.objetivos_educativos`. Si una unidad (ej. `Clan`) figura en `metadata.unidades`, **ES OBLIGATORIO incluir sus objetivos educativos en `metadata.objetivos_educativos`**. Si la actividad no incluye objetivos para una unidad, esa unidad NO debe figurar en `metadata.unidades`.
    - **PROHIBICIÓN ABSOLUTA DE INVENTAR UUIDs:** Queda estrictamente prohibido hardcodear o inventar UUIDs arbitrarios. La Skill DEBE consultar `progresion_objetivos` en PostgreSQL mediante `SELECT id, texto_infantil FROM progresion_objetivos WHERE ...` para obtener **UUIDs reales y legítimos** de la base de datos.
    - **Matriz de 5 Claves `(unidad_id - area_id - rango_edad - texto_infantil - texto_terminal)`:**
      1. **Selección del Eje (`texto_terminal`):** Selecciona de 1 a 3 `texto_terminal` centrales que sustenten pedagógicamente el contenido del artículo.
      2. **Cobertura por Rango de Edad:** Para TODA unidad declarada en `metadata.unidades`, debe existir al menos un `texto_infantil` por cada `rango_edad` de esa unidad (ej: Manada Media / Manada Tardía / Clan 17-20).
      3. **Cobertura por Área de Desarrollo:** Debe existir al menos un `texto_infantil` por cada `area_id` relevante dentro del marco del `texto_terminal`.
      4. **Agrupación Linpia (Cero Huérfanos):** Todas las unidades declaradas deben agruparse bajo los **MISMOS `texto_terminal`**.
    - **`como_se_cumple`:** Redacta para cada `texto_infantil` seleccionado una frase rica en **gerundio activo de 1ra persona** que explique exactamente cómo la vivencia del juego estimula ese logro.

---

### 🅱️ SI EL ARTÍCULO ES UNA TÉCNICA SCOUT (Cabuyería, Primeros Auxilios, Campismo, Pionerismo, Cocina, Claves)
El objeto `metadata` (JSONB) debe contener obligatoriamente:
- **`dificultad`**: `"Fácil"`, `"Intermedio"`, o `"Avanzado"`.
- **`equipo_necesario`**: Array de materiales o herramientas requeridas (ej: `["Cuerda de 8mm", "Vendas de gasa"]`).
- **`usos_practicos`**: Descripción pedagógica y práctica del uso de la técnica en campamentos o emergencias.

---

### 🅲 SI EL ARTÍCULO ES UNA BIOGRAFÍA O HISTORIA SCOUT
No se incluyen campos de actividades en `metadata`. En su lugar:
- **Biografías:** Incluye en `metadata` únicamente `lugar_nacimiento`, `pais_nacimiento`, `fecha_nacimiento`.
- **Historia Scout:** Incluye en `metadata` únicamente `lugar_hecho`, `pais_hecho`, `ano_hecho`.

---

## 🛠️ Flujo de Ejecución Paso a Paso de la Skill

1. **Lectura e Inspección de Duplicados:** Analiza el texto o URL entregada por el usuario. Consulta `articulos` en la BD local por similitud.
2. **Transformación de Vocabulario y Título:** Reescribe el título de forma sencilla y directa. Sustituye `pañoleta`/`pañuelo` por `pañolín` / `pañolines` en todos los campos de texto.
3. **Generación de Imagen Única con Uniforme Nua Mana y Rotación de Banderas (`process_template_image.py`):** Invoca `generate_image` especificando la acción directa y descriptiva del juego, el uniforme chileno (camisa gris perla manga larga, jeans azul marino, pañolín bicolor rojo/negro con cintas doradas según `panolin_nua.svg`) y rota la bandera autorizada (Chile, Rapa Nui / Reimiro, Grupo Nua Mana según `bandera_simplificada.svg`, o Unidades). Procesa las 5 capas con `supabase/process_template_image.py` y guarda la portada WebP en `/uploads/[slug].webp`.
4. **Mapeo Curricular con la Matriz de 5 Claves y UUIDs Auténticos de BD (1:1 Unidades & Áreas en Minúsculas):** Consulta directamente `progresion_objetivos` en PostgreSQL obteniendo los UUIDs reales existentes (`id`), extrayendo el cruce de 5 claves agrupado por `texto_terminal` para TODAS las unidades declaradas en `metadata.unidades` (incluyendo Clan si está declarada), guarda `metadata.areas` estrictamente en minúsculas, y redacta los gerundios `como_se_cumple`.
5. **Construcción del SQL en UTF-8 con HTML:** Produce el script SQL listo para ejecutarse en `supabase_db_nuamana-local`.
"""

p1 = r"C:\Users\claud\.gemini\antigravity-cli\skills\articulos-nuamana\SKILL.md"
p2 = r"C:\Users\claud\Documents\PWA\NuaMana\.opencode\skills\articulos-nuamana\SKILL.md"
p3 = os.path.expanduser("~/.config/opencode/skills/articulos-nuamana/SKILL.md")

for p in [p1, p2, p3]:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(skill_content)

print("Updated SKILL.md cleanly with lowercase areas rule across all 3 environments.")
