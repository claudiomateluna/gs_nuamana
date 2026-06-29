# Resumen de Desarrollo: Nua Mana PWA (Marzo 2026)

Este documento registra los hitos alcanzados, las correcciones técnicas y la implementación de los nuevos módulos de gestión institucional.

## 1. Sistema de Autorizaciones Digitales (Hito Principal)
Se ha implementado un flujo legal completo para la gestión de salidas, campamentos y datos de salud, cumpliendo con la normativa institucional.

### Infraestructura de Datos
*   **Tablas Creadas**: 
    *   `autorizaciones_actividades`: Almacena el registro legal, metadatos de la actividad y la **firma digital en Base64**.
    *   `perfiles_ficha_medica`: Extensión 1:1 del perfil para datos técnicos (Estatura, peso, salud mental, historial quirúrgico).
    *   `actividades_programadas`: Catálogo de salidas creado por dirigentes para estandarizar datos.
*   **Seguridad (RLS)**: Políticas aplicadas para que cada usuario vea su ficha, los apoderados vean a sus pupilos y los dirigentes vean a su unidad.

### Funcionalidades del Wizard (5 Pasos)
1.  **Selección**: El usuario elige una actividad pre-programada (ej: Campamento Callejones).
2.  **Identidad**: Validación y actualización de datos base (Teléfono, Dirección, Comuna, Alergias).
3.  **Ficha Médica Nacional**: Captura de enfermedades crónicas, salud mental y **Regulación Emocional** (Gatillantes y Estrategias).
    *   *Lógica Condicional*: Se habilitan campos ginecológicos solo para perfiles femeninos.
4.  **Resumen Legal**: Declaración jurada de salud (48 hrs) y aceptación de condiciones.
5.  **Firma Digital**: Cuadro de captura táctil/mouse para rúbrica electrónica.

### Visualización y Control
*   **Expediente Unificado**: Visualizador que genera 3 documentos (Participación, Ficha Médica, Imagen) en el orden solicitado, con firma estampada y optimizados para impresión (1 página por documento).
*   **Control de Dirigente**: Panel en "Mi Unidad" con semáforo de estado (Verde/Rojo) para verificar quién está autorizado antes de una salida.

## 2. Gestión de Actas Profesional
Se ajustó el sistema de actas para cumplir al 100% con el estándar `old/actas.md`.
*   **Formulario Unificado**: Visualización de todos los puntos (Temas, Asistencia, Acuerdos) en una sola vista.
*   **Flujo de Planificación**: Posibilidad de guardar actas en estado **"Borrador"** (sin asistentes) para crear la tabla antes de la reunión.
*   **Trazabilidad**: Registro de duración estimada vs. real, conclusiones separadas de la descripción y acuerdos con responsables y plazos.
*   **Firmas**: El redactor ya no firma automático; debe dar conformidad manual al finalizar el desarrollo.

## 3. Tesorería y Permisos
*   **Transparencia**: Añadida la columna **"Gestor"** en el libro de control para saber quién registró cada movimiento.
*   **Jerarquía de Roles**: 
    *   Apoderados (Rol 8): Pueden **ver** la pestaña de tesorería y documentos.
    *   Comité y Jefatura (Roles 1-7): Pueden **operar** (Registrar movimientos, emitir vales, crear rendiciones).
*   **Impresión**: Restauración de formatos oficiales DAF-FOR con estilos corregidos.

## 4. Migración de Usuarios
*   **Limpieza de Datos**: Procesamiento de CSV de WordPress eliminando 150+ columnas duplicadas de ACF.
*   **Identidad**: Migración de 77 usuarios usando el **RUT como nombre de usuario**.
*   **Acceso**: Contraseñas iniciales configuradas como el **RUT sin dígito verificador**.
*   **Sincronización**: Normalización de fechas de nacimiento al formato ISO.

## 5. Ajustes de UI/UX
*   **Scrollbar**: Restauración del scroll institucional rojo (`#cb3327`) compatible con todos los navegadores.
*   **Tipografía**: Estandarización de tamaños (mínimo 0.8em / 1em) y fuentes institucionales (`font-slab`, `font-display`).
*   **Modularidad**: Separación del Dashboard en componentes `dash_` y `dashmod_` para evitar colisiones de código.

---
**Estado del Proyecto**: Fase de Autorizaciones y Actas cerrada. Base de datos de Inventario lista para integración final de UI.
