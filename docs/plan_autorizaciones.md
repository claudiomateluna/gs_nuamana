# Plan de Implementación: Sistema de Autorizaciones Digitales Nua Mana

Este documento detalla la estrategia para implementar el proceso de generación y firma digital de las autorizaciones para actividades scouts, cumpliendo con los estándares institucionales y la normativa legal chilena.

## 1. Documentos Involucrados
El sistema generará dinámicamente tres documentos obligatorios:
1.  **Autorización de Participación en Actividades Presenciales**: (Versión Menor o Mayor de edad).
2.  **Autorización de Uso de Imagen y Voz**: (Versión Menor o Mayor de edad).
3.  **Ficha Médica y Registro de Necesidades de Regulación Emocional**: (Formato único de 4 páginas).

## 2. Arquitectura de Datos

### 2.1 Expansión del Perfil (`public.perfiles_ficha_medica`)
Para no sobrecargar la tabla principal `perfiles`, se creará una tabla relacional 1:1 con los campos técnicos faltantes:
*   **Datos Físicos**: Estatura, peso, seguro complementario.
*   **Enfermedades Crónicas**: Marcadores para Asma, Diabetes, Epilepsia, etc.
*   **Salud Mental**: Diagnósticos, tratamientos y contactos de profesionales.
*   **Historial Clínico**: Registro de hospitalizaciones y cirugías recientes.
*   **Ginecología**: Información relevante para actividades de varios días (si aplica).
*   **Regulación Emocional**: Intereses, gatillantes de estrés y estrategias de calma (Páginas 3 y 4 de la ficha).

### 2.2 Registro de Autorizaciones (`public.autorizaciones_actividades`)
Tabla para almacenar la validez de cada autorización generada:
*   `id`, `perfil_id`, `actividad_nombre`, `lugar`, `fecha_inicio`, `fecha_fin`.
*   `firmado_por` (UUID del perfil que firma: socio o apoderado).
*   `firma_digital` (Base64 de la firma o hash de validación).
*   `fecha_firma`, `estado` (Vigente, Expirada).

## 3. Flujo del Wizard (Proceso de Generación)

El usuario encontrará un botón **"Generar Autorización de Actividad"** en su Dashboard.

### Paso 1: Información de la Actividad
*   Ingreso manual (o selección de lista) del nombre de la actividad, fechas y lugar.

### Paso 2: Verificación de Datos de Identidad
*   Se muestran los datos actuales (RUT, Teléfono, Dirección).
*   Se permite editarlos si han cambiado (se actualiza `perfiles`).

### Paso 3: Actualización de Ficha Médica
*   Se cargan los datos de salud existentes.
*   Se solicitan los datos nuevos (Necesidades emocionales, condiciones en las últimas 2 semanas).

### Paso 4: Revisión Legal y Discriminación de Edad
*   El sistema calcula la edad automáticamente.
*   **Si es < 18 años**: Muestra el texto de las fichas de "Menor de Edad" y requiere que el **Apoderado** inicie sesión o esté presente para firmar.
*   **Si es >= 18 años**: Muestra el texto de "Mayor de Edad" y permite la firma del propio socio.

### Paso 5: Firma Digital y Generación
*   **Mecanismo**: Un cuadro de firma (Canvas) para dibujar la rúbrica o una declaración jurada con validación de clave.
*   **Resultado**: Se genera el documento final (HTML optimizado para impresión o PDF) y se guarda el registro en la base de datos.

## 4. Estrategia Técnica (Frontend)
*   **Componente Modular**: `DashModAutorizacionWizard.tsx`.
*   **Librerías**:
    *   `react-signature-canvas` para la captura de rúbricas.
    *   `date-fns` para cálculo preciso de mayoría de edad.
    *   Lógica de impresión idéntica a la Tesorería (CSS Media Print) para asegurar una copia fiel a los PDFs originales.

## 5. Próximos Pasos (Tras aprobación)
1.  Crear migración SQL para las nuevas tablas de salud y autorizaciones.
2.  Desarrollar el Wizard multi-paso con validación de datos.
3.  Implementar la lógica de discriminación de plantillas (Menor/Mayor).
4.  Habilitar el visualizador de documentos firmados.

---
**Nota**: Este proceso garantiza que el Grupo Nua Mana cuente con respaldos legales actualizados para cada salida, integrando la salud física y emocional en un solo flujo digital.
