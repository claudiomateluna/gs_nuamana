# Modelo de Datos Detallado

El sistema de base de datos está diseñado para ser flexible y robusto, utilizando PostgreSQL en Supabase. Se han definido las siguientes áreas principales:

## 1. Gestión de Usuarios y Perfiles
Se separa la autenticación (gestionada por Supabase Auth) del perfil público y privado (`perfiles`).
- **Roles:** Define los permisos dentro de la aplicación.
- **Vínculos Familiares:** Permite asociar apoderados con pupilos (beneficiarios) para una gestión centralizada.
- **Ficha de Salud:** Información crítica para actividades al aire libre, incluyendo alergias y contactos de emergencia.

## 2. Sistema de Contenido (Blog con SEO)
Los artículos soportan categorías jerárquicas y campos personalizados dinámicos mediante una columna `JSONB`.
- **SEO:** Cada artículo tiene campos dedicados para Título SEO y Descripción Meta.
- **Tipos de Artículo:** 
  - **Actividades:** Incluye materiales y recomendaciones.
  - **Historia/Biografías:** Incluye datos geográficos y temporales específicos.

## 3. Administración Scout
- **Inventario:** Permite llevar el control de equipos (carpas, herramientas, etc.) asignados a unidades o al grupo general.
- **Tesorería:** Registro de ingresos y egresos con soporte para subir comprobantes (almacenados en Oracle Cloud).
- **Actas:** Registro formal de reuniones de dirigentes y guiadoras, con lista de asistentes y acuerdos.

## 4. Progresión Personal
Basado en el método scout de Chile, el sistema permite:
- Definir etapas (Cernícalo, Halcón, etc.) por unidad.
- Definir objetivos por áreas de desarrollo (Creatividad, Corporalidad, etc.).
- Registrar el avance individual de cada joven, validado por un dirigente.

## Almacenamiento de Archivos (Oracle Cloud)
Todas las imágenes y documentos se almacenarán en Oracle Cloud Object Storage. Las URLs se guardarán en las tablas correspondientes (`imagen_url`, `comprobante_url`, etc.).
