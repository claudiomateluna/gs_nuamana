# Arquitectura Tecnológica de la PWA

Para la nueva versión de Nua Mana, se ha seleccionado una arquitectura moderna, escalable y de alto rendimiento, optimizada para SEO y experiencia de usuario.

## Componentes Principales

### 1. Frontend: Next.js (React)
- **Framework:** Next.js por su capacidad de Generación de Sitios Estáticos (SSG) y Renderizado en el Lado del Servidor (SSR), lo cual es crítico para un SEO perfecto.
- **PWA:** Configuración de `next-pwa` para permitir la instalación en dispositivos móviles y uso offline de contenido esencial.
- **Estilos:** Tailwind CSS para un diseño responsivo y moderno, permitiendo una personalización rápida.
- **Componentes:** Radix UI o Shadcn/ui para componentes de interfaz accesibles y consistentes.

### 2. Backend y Base de Datos: Supabase
- **Base de Datos:** PostgreSQL para el almacenamiento estructurado de usuarios, artículos, inventario y tesorería.
- **Autenticación:** Supabase Auth para gestionar el registro e inicio de sesión de manera segura.
- **API:** Supabase genera automáticamente una API REST y real-time basada en el esquema de la base de datos.
- **Edge Functions:** Para lógica de negocio compleja que deba ejecutarse en el servidor.

### 3. Almacenamiento: Oracle Cloud (Free Tier)
- **Object Storage:** Se utilizará para almacenar imágenes de artículos, fotos de perfil y archivos de descarga, aprovechando la generosa capa gratuita de Oracle.
- **CDN:** Se recomienda pasar las imágenes por un servicio como Cloudinary o Imgix para optimización automática antes de servirlas al usuario.

### 4. Despliegue: Vercel
- **Hosting:** Vercel para el frontend Next.js, con despliegue continuo (CI/CD) conectado a GitHub.
- **Edge Network:** Para servir el contenido lo más cerca posible de los usuarios en Chile.

## Integraciones Clave
- **SEO:** Metadata dinámica en cada artículo, mapas de sitio automáticos y optimización de imágenes (WebP).
- **Notificaciones:** Web Push Notifications para avisar sobre nuevas actas o eventos.
- **PWA Service Worker:** Para cachear activos y permitir navegación rápida.
