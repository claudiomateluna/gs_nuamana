# Estado del Proyecto: Sistema de Autorizaciones Digitales
**Fecha de actualización:** 28 de abril de 2026

## ✅ Logros de la Sesión
1.  **Wizard de 18 Pasos Completo:**
    *   Implementados los Pasos 16, 17 y 18 con fidelidad total al documento de referencia.
    *   **Validación de RUT:** Implementada validación algorítmica y visual con bloqueo de avance en caso de error.
    *   **Firma Digital:** Integrado `react-signature-canvas` con corrección de offset y trazo profesional.
2.  **Sincronización de Datos:**
    *   El sistema ahora actualiza automáticamente el perfil del usuario (Género, Nacimiento, Previsión, etc.) al finalizar la autorización.
    *   Implementada una **Whitelist** en el guardado para evitar errores de "columna no encontrada" en Supabase.
3.  **Visualización (Expediente Digital):**
    *   Rediseño total de `DashModAutorizacionVer.tsx` replicando el diseño cuadriculado del PDF oficial.
    *   Renderizado dinámico de tablas JSONB para Cirugías y Hospitalizaciones.
    *   Corrección de formatos: Fecha (DD/MM/AAAA) y Edad calculada en tiempo real.

## ❌ Pendientes Críticos
1.  **Error de Permisos en Eliminación:**
    *   El botón de "Eliminar" en el visor lanza un error de falta de permisos, incluso para el dueño del registro.
    *   Se creó la migración `20260319000000_allow_delete_autorizaciones.sql` pero el error persiste localmente. **Causa probable:** La política RLS requiere revisión profunda o reinicio de caché de Supabase.
2.  **Visualización de Autorizaciones (Pág 1 y 6):**
    *   Falta replicar el diseño exacto de los PDFs de "Autorización de Participación" y "Uso de Imagen" (actualmente tienen el texto correcto pero diseño estándar).

## 📋 Próximos Pasos
- [ ] Resolver bloqueo de RLS para el DELETE de autorizaciones.
- [ ] Ajustar el diseño visual de las páginas de autorización de participación e imagen para que coincidan con sus respectivos PDFs en la carpeta `/autorizacion`.
- [ ] Verificar la persistencia de los campos de "Salud Mental" y "Gineco-obstétrica" en casos de borde.
