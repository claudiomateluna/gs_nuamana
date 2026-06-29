# Documentación del Proyecto Nua Mana PWA

Este repositorio contiene la arquitectura, el diseño de base de datos y las guías necesarias para transformar el sitio WordPress de Nua Mana en una PWA moderna y de alto rendimiento.

## Estructura de Carpetas
- `docs/`: Documentación técnica y funcional en español.
  - `analisis_sitio.md`: Detalles del sitio actual y campos personalizados.
  - `arquitectura.md`: Tecnologías seleccionadas (Next.js, Supabase, Oracle, Vercel).
  - `modelo_datos.md`: Explicación detallada de las tablas y relaciones.
  - `guia_implementacion.md`: Guía paso a paso para la implementación.
- `ddbb/`: Scripts de base de datos SQL.
  - `schema.sql`: Definición de tablas, roles y triggers.

## Estado del Proyecto
- [x] **Fase 1: Cimientos y Backend (Local)** - Completado.
  - Base de datos configurada en `supabase/migrations`.
  - Proyecto Next.js inicializado en `frontend/`.
  - Conexión base Supabase establecida.
  - Documentación de Oracle Cloud preparada.
- [ ] **Fase 2: Frontend Base y Autenticación** - Pendiente.
