# Nua Mana PWA — Sistema de Gestión Guía y Scout ⚜️

Una plataforma web progresiva (PWA) de alto rendimiento diseñada específicamente para la gestión administrativa y el seguimiento pedagógico del **Grupo Scout Nua Mana** (Chile). Este sistema unifica el control de miembros, la progresión scout por ramas, la gestión de inventario, finanzas y actas de consejo bajo una arquitectura moderna, segura y de costo cero en infraestructura.

---

## 🚀 Arquitectura Tecnológica

El sistema está construido bajo un enfoque desacoplado de alto rendimiento y excelente experiencia de usuario:

*   **Frontend (Web & PWA):** [Next.js](https://nextjs.org/) (App Router, React 19) estilizado con Vanilla CSS y Tailwind CSS. Diseñado con un sistema visual de alto impacto utilizando los colores institucionales del grupo (Rojo Nua Mana `#cb3327`, Gris Carbón `#1b1b1b`) y tipografías legibles con marcas de agua dinámicas y animaciones fluidas.
*   **Backend & Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL local a través de Docker). Cuenta con un esquema de base de datos relacional robusto, triggers automatizados para notificaciones y políticas de seguridad a nivel de fila (RLS - Row Level Security).
*   **Almacenamiento de Archivos:** Integrado con buckets de almacenamiento S3 compatibles alojados en la capa gratuita de **Oracle Cloud Infrastructure (OCI)** para la carga segura de documentos y firmas.

---

## 👥 Roles de Usuario y Permisos

El sistema implementa una matriz de roles estricta basada en el rol asignado al perfil (`rol_id`):

1.  **Administrador:** Acceso global a la gestión de usuarios, configuración del grupo, aprobación de cuentas y reportería financiera completa.
2.  **Dirigente / Guiadora (rol 14):** Gestión de la unidad asignada (Manada, Compañía, Tropa, Avanzada, Clan). Puede registrar asistencia, autorizar actas de consejo, evaluar objetivos de progresión, aprobar competencias de Pioneros y entregar insignias de caminantes.
3.  **Apoderado:** Visualización y edición de la ficha médica de sus pupilos vinculados, y firma digital de autorizaciones de actividades.
4.  **Beneficiario (Jóvenes NNJ - roles 11, 12, 13):** Acceso a su panel personal de progresión, autoevaluación de objetivos, postulación a especialidades y desarrollo de proyectos individuales o colectivos.

---

## 🛠️ Módulos y Funcionalidades Principales

### 1. Wizard de Registro y Autorizaciones (25 Pasos)
Un asistente secuencial interactivo que guía al nuevo miembro en su proceso de incorporación:
*   Validación estricta de **RUT chileno** y máscara automática para teléfono nacional (`+56 9 ...`).
*   Campos condicionales inteligentes según el tipo de cuenta (los apoderados deben vincular al menos un pupilo; los dirigentes requieren validación manual de credenciales).
*   Módulo de carga de documentos obligatorios: **Firma Digital**, **Autorización de Uso de Imagen** y **Autorización de Grabación de Voz**, con almacenamiento directo en la nube.

### 2. Gestión de Actas de Consejo y Firmas Colectivas
Flujo de trabajo digital para formalizar las decisiones y acuerdos de los consejos de unidad:
*   Creación de actas con orden del día, descripción de acuerdos y registro de asistencia.
*   **Sistema de Doble Firma Digital:** Las actas requieren la firma mutua del secretario y del dirigente/guiadora de la unidad para ser válidas.
*   Políticas RLS estrictas: Un usuario solo puede visualizar o firmar un acta si figura en la lista de asistentes de la misma o es administrador del grupo.

### 3. Progresión Scout Personalizada por Ramas
El corazón pedagógico de la plataforma, adaptado a cada grupo de edad:
*   **Manada, Compañía y Tropa:** Visualización interactiva de etapas (ej. Lobezno, Cazador, Alba, Cernícalo) calculadas automáticamente según la cantidad de objetivos terminales logrados.
*   **Avanzada (Pioneros):** Panel de **7 Rumbos de Competencias** (Cultura, Actividad Física, Trabajo en Equipo, Innovación, Comunicación, Ciudadanía, Medioambiente). Los jóvenes envían solicitudes con justificaciones y enlaces de evidencia que el Consejo de Unidad resuelve o retroalimenta. Su etapa inicial es la **Cruz del Sur**.
*   **Clan (Caminantes):** Visualización estética del Camino Simbólico utilizando las insignias oficiales (**Insignia del Caminante** como bienvenida, **Fuego**, **Antorcha** y **La Partida**) con transiciones dinámicas a color cuando se obtienen. Incluye la agenda de metas personales a 6 meses y el gestor de proyectos de 12 pasos basados en la metodología scout ("Remar tu propia canoa").
*   **Especialidades:** Los jóvenes de Avanzada y Clan pueden visualizar el historial de especialidades que completaron en sus ramas anteriores para mantener su ficha histórica, pero tienen bloqueada la postulación a nuevas especialidades, ya que su progresión se enfoca en competencias y proyectos.

### 4. Sistema de Notificaciones Global en Tiempo Real
Un sistema centralizado que genera notificaciones automáticas instantáneas para:
*   Creación de nuevas cuentas (alerta a dirigentes de la unidad y administradores para activarlas).
*   Modificaciones en la ficha de un miembro (notifica al usuario, a sus dirigentes de unidad, a su apoderado y al administrador).
*   Creación y firma de autorizaciones de actividades.
*   Creación, edición y firma de actas de consejo (alerta a todos los asistentes registrados).

### 5. Inventario de Grupo
Módulo para el control de activos (carpas, herramientas, cocina de campaña, etc.):
*   Flujo de solicitud de préstamo de materiales.
*   Registro de devoluciones y estados de conservación.

### 6. Tesorería
*   Control de ingresos y egresos del grupo y de cada unidad.
*   Gestión de presupuestos de actividades y control de cuotas mensuales.

---

## 📂 Estructura del Repositorio

```text
NuaMana/
├── docs/                      # Documentación técnica e histórica del diseño
├── frontend/                  # Aplicación Next.js (Frontend y lógica de cliente)
│   ├── public/                # Recursos estáticos (Logos de unidades, insignias de progresión)
│   └── src/
│       ├── app/               # Enrutamiento de Next.js (App Router)
│       ├── components/        # Componentes UI reutilizables y modulares
│       │   └── dashboard/     # Módulos del panel (progresión, actas, perfil, etc.)
│       └── lib/               # Clientes y utilidades (Supabase, validaciones, PDF)
└── supabase/                  # Backend de Supabase (Docker local)
    ├── migrations/            # Migraciones SQL ordenadas cronológicamente
    └── seed.sql               # Semilla de datos iniciales para desarrollo
```

---

## 🔧 Configuración y Desarrollo Local

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (v18 o superior)
*   [Docker](https://www.docker.com/) (necesario para correr Supabase de forma local)
*   [Supabase CLI](https://supabase.com/docs/guides/cli)

### Paso 1: Iniciar el Backend (Supabase Local)
1. Ve a la carpeta de Supabase e inicia el servicio:
   ```bash
   cd supabase
   supabase start
   ```
2. Esto levantará las instancias locales de PostgreSQL, Studio de Supabase, Auth y Storage en Docker. Las migraciones de `supabase/migrations/` se aplicarán automáticamente.

### Paso 2: Iniciar el Frontend (Next.js)
1. Ve a la carpeta del frontend e instala las dependencias:
   ```bash
   cd ../frontend
   npm install
   ```
2. Crea un archivo `.env.local` en la raíz de la carpeta `frontend/` y configura tus credenciales locales de Supabase (las cuales se muestran en la terminal al hacer `supabase start`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_local
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación corriendo.

---

## 🔒 Seguridad y Buenas Prácticas
*   **Políticas de Seguridad a Nivel de Fila (RLS):** Absolutamente todas las consultas a tablas críticas (perfiles, actas, autorizaciones) pasan por el filtro de seguridad de PostgreSQL para evitar que usuarios malintencionados o de otras unidades accedan a información privada.
*   **Validaciones en Dos Capas:** Los datos sensibles (como RUT y teléfonos) se validan tanto en el cliente (UI interactiva) como en la base de datos mediante constraints de PostgreSQL para asegurar la integridad de los datos.
*   **Integridad de Datos:** De acuerdo con las normas de seguridad del proyecto, el comando `supabase db reset` está prohibido en entornos de producción/desarrollo compartido para resguardar el historial de miembros migrado de WordPress.
