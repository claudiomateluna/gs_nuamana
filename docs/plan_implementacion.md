# Plan de Implementación Detallado: Nua Mana PWA

Este plan detalla las fases para transformar el sitio actual en una PWA moderna, priorizando un **desarrollo local robusto** antes del despliegue en servidores de producción.

## Estrategia de Desarrollo: Local-Primero
Para garantizar la velocidad de desarrollo y la seguridad de los datos, todo el sistema se construirá y probará en el entorno local del desarrollador utilizando **Supabase CLI (Docker)** y **Next.js Dev Server**. La subida a la nube (Vercel, Supabase Cloud, Oracle Cloud) se realizará únicamente tras validar cada módulo.

---

## Fase 1: Cimientos y Backend Local (Semana 1) - COMPLETADO
**Objetivo:** Configurar la infraestructura base en la computadora del desarrollador.

1.  **Configuración de Supabase Local:**
    *   Inicializar Supabase CLI en el proyecto.
    *   Definir esquema de base de datos en `supabase/migrations/`.
    *   Cargar datos maestros (roles, unidades, categorías) vía `supabase/seed.sql`.
2.  **Preparación de Almacenamiento:**
    *   Documentar integración con Oracle Cloud Object Storage (S3 Compatible).
3.  **Estructura Frontend:**
    *   Crear proyecto Next.js en carpeta `frontend/`.
    *   Establecer conexión base con el motor local de Supabase.

## Fase 2: Frontend Base y Autenticación Local (Semana 2)
**Objetivo:** Interfaz funcional con sistema de usuarios operativo en local.

1.  **Entorno de Desarrollo:**
    *   Configurar variables de entorno locales (`.env.local`) apuntando a los contenedores Docker.
2.  **Sistema de Registro de 25 Pasos:**
    *   Implementar el flujo secuencial detallado en `old/pasos-registro.md`.
    *   Paso 1: Validación de clave de grupo.
    *   Paso 2: Lógica condicional según el rol (Beneficiario vs. Dirigente vs. Apoderado).
    *   Pasos 3-25: Captura de datos personales, escolares, de salud y autorizaciones.
3.  **Sistema de Autenticación:**
    *   Integrar Supabase Auth para registro e inicio de sesión local.
    *   Lógica de roles extendida (Presidente, Tesorera, Secretario, etc.).
4.  **Diseño UI/UX:**
    *   Implementar layout base responsivo con Tailwind CSS.

## Fase 3: Gestión de Contenidos y SEO (Semana 3)
**Objetivo:** Módulo de blog con capacidades SEO y campos dinámicos.

1.  **CRUD de Artículos:**
    *   Crear interfaz de administración para publicaciones.
    *   Implementar manejo de campos `JSONB` para Actividades y Biografías.
2.  **Optimización SEO (Pre-despliegue):**
    *   Configuración de metadatos dinámicos y esquemas JSON-LD.
3.  **Simulación de Migración:**
    *   Importar una muestra del contenido real de WordPress al Supabase local para pruebas de rendimiento.

## Fase 4: Perfiles de Usuario y Fichas de Salud (Semana 4)
**Objetivo:** Implementar la lógica compleja de los 48 campos de usuario.

1.  **Formularios Extendidos:**
    *   Construir la ficha digital con validaciones locales.
2.  **Gestión de Pupilos:**
    *   Lógica para que un Apoderado gestione múltiples Beneficiarios.
3.  **Seguridad Local:**
    *   Activar y probar Políticas de Seguridad de Filas (RLS) en la base de datos local para proteger datos sensibles.

## Fase 5: Administración Scout (Semana 5)
**Objetivo:** Digitalizar Inventario, Tesorería y Actas.

1.  **Sistema de Actas Detallado:**
    *   Implementar la estructura completa de `old/actas.md`.
    *   Entidades: Acta, Participantes (con asistencia obligatoria de dirigentes), Temas de Agenda, Acuerdos/Acciones con responsables.
    *   Flujo de trabajo: Borrador -> En Revisión -> Aprobada -> PDF con Hash.
    *   Sistema de trazabilidad: Historial de cambios en acuerdos.
2.  **Módulos Administrativos:**
    *   Desarrollar CRUDs para Inventario y movimientos de Tesorería.
3.  **Gestión de Archivos:**
    *   Pruebas de subida de comprobantes y fotos usando el SDK de Oracle Cloud.

## Fase 6: Progresión Scout (Semana 6)
**Objetivo:** Implementar el sistema de adelanto del método chileno.

1.  **Lógica de Progresión:**
    *   Cargar etapas (Cernícalo, Halcón, etc.) y objetivos en la DB local.
2.  **Seguimiento:**
    *   Interfaz de marcado de objetivos y panel de aprobación para dirigentes.

## Fase 7: Transición a Producción y Lanzamiento (Semana 7)
**Objetivo:** Mover el sistema completo de Local a la Nube.

1.  **Migración de Base de Datos:**
    *   Crear proyecto en Supabase Cloud.
    *   Usar `npx supabase db push` para subir todas las migraciones locales a la nube.
2.  **Despliegue del Frontend:**
    *   Conectar el repositorio a Vercel.
    *   Configurar variables de entorno de producción (claves reales de Supabase Cloud y Oracle).
3.  **Puesta en Marcha:**
    *   Migración final de imágenes a Oracle Cloud Bucket.
    *   Cambio de DNS para `www.nuamana.cl`.
    *   Auditoría final de PageSpeed y validación PWA.
