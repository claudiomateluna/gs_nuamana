# Configuración de Servidor Always Free en Oracle Cloud (OCI) usando cuenta Pay-As-You-Go ☁️

Este documento describe el procedimiento paso a paso para crear un servidor de alto rendimiento de **4 OCPUs (procesadores ARM Ampere A1) y 24 GB de RAM** a **costo cero ($0 USD/mes)** en Oracle Cloud, evitando el error habitual de "Falta de capacidad" (Out of capacity).

---

## 💡 ¿En qué consiste el método?

Oracle Cloud ofrece una capa gratuita permanente muy potente (`Always Free`), pero restringe la creación de estas máquinas virtuales a los usuarios de cuentas gratuitas cuando hay alta demanda, priorizando a los clientes que pagan.

Al actualizar tu cuenta a **Pay-As-You-Go (Pago por consumo)**:
1. Adquieres **prioridad absoluta** para la asignación de hardware. Tu servidor se creará al instante.
2. Mantienes los beneficios de la capa gratuita (`Always Free`). Mientras no superes los límites gratuitos (4 OCPUs, 24 GB de RAM y 200 GB de disco total), **tu factura mensual seguirá siendo de $0 USD**.

---

## 🛠️ Paso a Paso

### Paso 1: Actualizar la cuenta a Pay-As-You-Go
1. Inicia sesión en la consola web de [Oracle Cloud](https://cloud.oracle.com/).
2. En el menú hamburguesa (esquina superior izquierda), navega a:
   **Gobernanza y administración** (Governance & Administration) > **Gestión de facturación** (Billing Management) > **Actualizar cuenta** (Upgrade Account).
3. Selecciona la opción **Pay-As-You-Go** (Pago por consumo).
4. Introduce una tarjeta de crédito válida. 
   *   *Nota: Oracle realizará una retención temporal de aproximadamente $100 USD para verificar la validez de la tarjeta. Este dinero se libera y se devuelve de inmediato a tu saldo (puede tardar de unos minutos a un par de días hábiles según tu banco).*
5. El proceso de aprobación de la actualización puede tardar entre **24 y 48 horas**. Recibirás un correo de confirmación de Oracle cuando esté lista.

---

### Paso 2: Crear la Instancia de Cómputo Gratis
Una vez confirmada tu cuenta Pay-As-You-Go, ya puedes crear el servidor de forma inmediata.

1. En el menú de la consola de Oracle, ve a **Instancias de Compute** y haz clic en **Crear Instancia**.
2. Configura los parámetros básicos:
   *   **Nombre:** `nuamana-pwa-server` (o el que prefieras).
   *   **Compartimento:** (Dejar el predeterminado).
3. En la sección **Imagen y forma** (Image and Shape), haz clic en **Editar**:
   *   **Imagen:** Selecciona una distribución estable de Linux, por ejemplo, **Ubuntu 22.04 LTS** u **Oracle Linux 8**.
   *   **Forma (Shape):** Haz clic en cambiar forma, selecciona **Ampere** (arquitectura ARM) y marca la casilla de la forma `VM.Standard.A1.Flex`.
   *   **Recursos:** Ajusta las barras deslizadoras al máximo permitido sin costo:
       *   **OCPUs:** 4
       *   **Memoria (RAM):** 24 GB
   *   *(Verás que al lado de la selección se muestra la etiqueta "Apto para siempre gratis" o "Always Free Eligible")*.
4. En la sección **Redes** (Networking):
   *   Deja que cree una nueva VCN (Virtual Cloud Network) y una subred pública de forma automática.
   *   Asegúrate de que la opción **Asignar una dirección IPv4 pública** esté activa.
5. En la sección **Agregar claves SSH**:
   *   Selecciona **Generar un par de claves para mí** y haz clic en **Guardar clave privada**. 
   *   *⚠️ IMPORTANTE: Guarda este archivo `.key` en un lugar seguro en tu computadora. Lo necesitarás para conectarte al servidor vía SSH.*
6. En la sección **Volumen de inicio** (Boot Volume):
   *   Puedes asignar hasta **200 GB** de espacio en disco de forma gratuita (el límite de la capa gratuita).
7. Haz clic en **Crear** (Create).

La máquina virtual se creará en pocos segundos y pasará a estado "En ejecución". Podrás ver su dirección IP pública asignada para comenzar el despliegue de Docker, Supabase y Next.js.
