# Nua Mana PWA — Sistema de Gestión Guía y Scout ⚜️

Una plataforma web progresiva (PWA) de alto rendimiento diseñada específicamente para la gestión administrativa, el control de actividades y el seguimiento pedagógico del **Grupo Scout Nua Mana** (Chile). Este sistema unifica el control de miembros, el ciclo de programa de las unidades, la progresión scout, la bitácora de aventuras, la gestión de inventario, finanzas y actas de consejo bajo una arquitectura moderna y segura.

---

## 🚀 Arquitectura Tecnológica

El sistema está construido bajo un enfoque desacoplado de alto rendimiento y excelente experiencia de usuario:

*   **Frontend (Web & PWA):** [Next.js](https://nextjs.org/) (App Router, React 19) estilizado con Vanilla CSS y Tailwind CSS. Diseñado con un sistema visual de alto impacto utilizando los colores institucionales del grupo (Rojo Nua Mana `#cb3327`, Gris Carbón `#1b1b1b`) y tipografías legibles con marcas de agua dinámicas y animaciones fluidas.
*   **Backend & Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL local a través de Docker). Cuenta con un esquema de base de datos relacional robusto, triggers automatizados para notificaciones y políticas de seguridad a nivel de fila (RLS - Row Level Security).
*   **Almacenamiento de Archivos:** Integrado con buckets de almacenamiento S3 compatibles alojados en la capa gratuita de **Oracle Cloud Infrastructure (OCI)** para la carga segura de documentos, fotografías y firmas.

---

## 👥 Roles de Usuario y Permisos

El sistema implementa una matriz de roles estricta basada en el rol asignado al perfil (`rol_id`):

1.  **Administrador:** Acceso global a la gestión de usuarios, configuración del grupo, aprobación de cuentas y reportería financiera completa.
2.  **Dirigente / Guiadora (rol 14):** Gestión de la unidad asignada (Manada, Compañía, Tropa, Avanzada, Clan). Puede registrar asistencia, autorizar actas de consejo, evaluar objetivos de progresión, aprobar competencias de Pioneros y entregar insignias de caminantes.
3.  **Apoderado:** Visualización y edición de la ficha médica de sus pupilos vinculados, y firma digital de autorizaciones de actividades.
4.  **Beneficiario (Jóvenes NNJ - roles 11, 12, 13):** Acceso a su panel personal de progresión, autoevaluación de objetivos, postulación a especialidades y desarrollo de proyectos individuales o colectivos.

---

## 🛠️ Módulos y Funcionalidades Principales

### 1. Ciclo de Programa (Ciclo de Unidad)
El módulo de **Ciclo de Programa** permite a cada unidad (Manada, Compañía, Tropa, Avanzada, Clan) planificar de forma democrática y participativa sus actividades a lo largo del año a través de 5 fases estructuradas:
*   **Fase 1: Diagnóstico y Propuestas:** Los jóvenes y dirigentes proponen actividades ideales para el ciclo basadas en sus intereses y necesidades.
*   **Fase 2: Votación de Actividades:** Sistema de votación transparente donde los jóvenes eligen las actividades que formarán parte del calendario del ciclo.
*   **Fase 3: Organización y Planificación:** Definición de objetivos, responsables, fechas, presupuesto y logística de las actividades seleccionadas.
*   **Fase 4: Ejecución:** Fase activa donde se realizan las actividades. Se asocian registros en el Libro de Mowha/Tally/Bitácora y se documenta el progreso con fotos y reseñas.
*   **Fase 5: Evaluación:** Evaluación final de las actividades realizadas y del ciclo en general, midiendo el impacto pedagógico y el cumplimiento de metas.

### 2. Evaluación de la Progresión Personal
Seguimiento del crecimiento y desarrollo personal de los jóvenes basado en las 6 áreas de desarrollo scout:
*   **Áreas de Desarrollo:** Corporalidad, Creatividad, Carácter, Afectividad, Sociabilidad y Espiritualidad.
*   **Evaluación Dinámica:** Los jóvenes realizan su autoevaluación marcando objetivos en proceso o alcanzados. Los dirigentes y guiadoras revisan, añaden comentarios pedagógicos de retroalimentación y validan los objetivos terminales de la unidad.
*   **Cálculo Automático de Etapas:** Para Manada, Compañía y Tropa, la etapa de progresión (ej. Lobezno, Cazador, Alba, Cernícalo) se calcula de forma dinámica en base al número de objetivos logrados por el joven y su rango de edad.

### 3. Libro de Mowha / Tally / Bitácora (Diario de Aventuras)
Un espacio digital para el registro histórico y la reflexión de las vivencias de la unidad, adaptado con terminología tradicional chilena según la rama:
*   **Libro de Mowha (Manada):** Registra las historias y aventuras del Pueblo Libre en la Selva de Seeonee.
*   **Tally (Compañía / Tropa):** El registro de las patrullas, expediciones, especialidades y la vida al aire libre.
*   **Bitácora (Avanzada / Clan):** Un espacio para la reflexión personal, los desafíos y las vivencias de la ruta.
*   **Características:** Permite a jóvenes y dirigentes escribir crónicas, subir fotografías de campamentos o excursiones, y asociar las entradas a actividades específicas del Ciclo de Programa.

### 4. Sistema Completo de Especialidades
Permite a los jóvenes explorar campos de interés específicos y proponer proyectos de desarrollo personal:
*   **Campos de Interés:** Deportes, Ciencia y Tecnología, Arte y Expresión, Servicio a la Comunidad, Vida al Aire Libre, entre otros.
*   **Asistente de Postulación (Wizard):** El joven elige un campo, define un nombre personalizado para su especialidad, y redacta de 3 a 5 actividades concretas con sus metas.
*   **Flujo de Aprobación:** Los dirigentes evalúan la propuesta, sugieren modificaciones pedagógicas y aprueban el inicio de la especialidad. El joven marca sus actividades a medida que las realiza, mostrando una barra de progreso porcentual hasta su entrega final.
*   **Historial para Avanzada y Clan:** Al pasar a Avanzada (Pioneros) y Clan (Caminantes), la progresión cambia a Competencias y Proyectos Personales. Los miembros de estas unidades mantienen la visibilidad completa de sus especialidades obtenidas en ramas anteriores como parte de su historial, pero tienen bloqueada la postulación a nuevas especialidades en este módulo.

### 5. Historial de Hitos y Pasos de Crecimiento
Registro cronológico de los momentos más significativos de la vida scout de cada miembro:
*   **Hitos de Crecimiento:** Registro de hitos tradicionales como la Promesa, Investiduras, pasos de sección (ej. Paso a Tropa, Paso a Avanzada) e insignias de progresión entregadas.
*   **Historial Inmutable:** Cada hito queda guardado en la base de datos como un registro histórico que detalla la fecha de entrega y el dirigente que autorizó el hito, conformando la "historia scout" del beneficiario dentro del grupo.

### 6. Wizard de Registro y Autorizaciones (25 Pasos)
Un asistente secuencial interactivo que guía al nuevo miembro en su proceso de incorporación:
*   Validación estricta de **RUT chileno** y máscara automática para teléfono nacional (`+56 9 ...`).
*   Campos condicionales inteligentes según el tipo de cuenta (los apoderados deben vincular al menos un pupilo; los dirigentes requieren validación manual de credenciales).
*   Módulo de carga de documentos obligatorios: **Firma Digital**, **Autorización de Uso de Imagen** y **Autorización de Grabación de Voz**, con almacenamiento directo en la nube.

### 7. Gestión de Actas de Consejo y Firmas Colectivas
Flujo de trabajo digital para formalizar las decisiones y acuerdos de los consejos de unidad:
*   Creación de actas con orden del día, descripción de acuerdos y registro de asistencia.
*   **Sistema de Doble Firma Digital:** Las actas requieren la firma mutua del secretario y del dirigente/guiadora de la unidad para ser válidas.
*   Políticas RLS estrictas: Un usuario solo puede visualizar o firmar un acta si figura en la lista de asistentes de la misma o es administrador del grupo.

### 8. Sistema de Notificaciones Global en Tiempo Real
Un sistema centralizado que genera notificaciones automáticas instantáneas para:
*   Creación de nuevas cuentas (alerta a dirigentes de la unidad y administradores para activarlas).
*   Modificaciones en la ficha de un miembro (notifica al usuario, a sus dirigentes de unidad, a su apoderado y al administrador).
*   Creación y firma de autorizaciones de actividades.
*   Creación, edición y firma de actas de consejo (alerta a todos los asistentes registrados).

### 9. Inventario de Grupo
Módulo para el control de activos (carpas, herramientas, cocina de campaña, etc.):
*   Flujo de solicitud de préstamo de materiales.
*   Registro de devoluciones y estados de conservación.

### 10. Tesorería
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
│       │   └── dashboard/     # Módulos del panel (progresión, ciclo, bitácora, etc.)
│       └── lib/               # Clientes y utilidades (Supabase, validaciones, bitácora)
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
*   **Políticas de Seguridad a Nivel de Fila (RLS):** Absolutamente todas las consultas a tablas críticas (perfiles, actas, autorizaciones, bitácoras) pasan por el filtro de seguridad de PostgreSQL para evitar que usuarios no autorizados accedan a información privada.
*   **Validaciones en Dos Capas:** Los datos sensibles (como RUT y teléfonos) se validan tanto en el cliente (UI interactiva) como en la base de datos mediante constraints de PostgreSQL para asegurar la integridad de los datos.
*   **Integridad de Datos:** De acuerdo con las normas de seguridad del proyecto, el comando `supabase db reset` está prohibido en entornos de producción/desarrollo compartido para resguardar el historial de miembros migrado de WordPress.
