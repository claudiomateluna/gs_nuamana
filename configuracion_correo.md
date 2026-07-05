# Guía Paso a Paso para Configurar el Correo en Nua Mana (Cloudflare + Resend)

Esta guía detalla de forma exhaustiva, clic a clic y pantalla a pantalla, cómo configurar la redirección de correos entrantes gratis usando **Cloudflare Email Routing** y el envío de correos salientes (autenticación de Supabase) usando **Resend**.

---

## PARTE 1: Configurar Redirección de Correos Entrantes (Cloudflare)

Esta parte permite que cuando alguien envíe un correo a `contacto@nuamana.cl` te llegue automáticamente a tu cuenta de Gmail personal, de forma 100% gratuita y sin servidores de correo en tu VPS.

1.  Iniciá sesión en el [Panel de Cloudflare](https://dash.cloudflare.com/).
2.  Hacé clic en tu sitio web **`nuamana.cl`** en la lista de dominios.
3.  En la barra lateral izquierda, buscá la sección **"Email"** y hacé clic en **"Email Routing"** (Direccionamiento de correo).
4.  Si es la primera vez que ingresás, verás un botón azul que dice **"Get started"** (Empezar) o **"Enable Email Routing"**. Hacé clic en él.
5.  **Paso 1: Configurar dirección de destino (Destination address):**
    *   Ingresá tu correo de Gmail personal (ej. `claudio.mateluna.g@gmail.com`).
    *   Hacé clic en **"Save"** (Guardar) o **"Verify"**.
    *   **IMPORTANTE:** Cloudflare te enviará un correo a tu cuenta de Gmail titulado *"Cloudflare Email Routing Verification"*. Abrilo y hacé clic en el enlace que dice **"Verify email address"**.
6.  **Paso 2: Crear regla de redirección (Create custom address):**
    *   Hacé clic en **"Create address"** (Crear dirección).
    *   En **Custom address (Dirección personalizada)**, escribe: `contacto` (esto creará `contacto@nuamana.cl`).
    *   En **Action (Acción)**, dejá seleccionado *Send to* (Enviar a).
    *   En **Destination address**, selecciona el Gmail que verificaste en el paso anterior.
    *   Hacé clic en **"Save"** (Guardar).
7.  **Paso 3: Activar registros DNS en Cloudflare:**
    *   Cloudflare te mostrará una advertencia diciendo que faltan los registros MX en tu zona DNS.
    *   Verás un botón azul que dice **"Add records automatically"** (Añadir registros automáticamente). **Hacé clic en ese botón**.
    *   Cloudflare se encargará de borrar cualquier registro de correo viejo y configurar los registros MX necesarios de forma transparente.
8.  ¡Listo! Ya podés hacer una prueba enviando un correo desde otra cuenta externa a `contacto@nuamana.cl` y verás cómo te llega al instante a tu Gmail.

---

## PARTE 2: Configurar Envío de Correos Salientes (Resend)

Esta parte permite que Supabase pueda despachar correos reales de confirmación de cuenta y restablecimiento de contraseña a los usuarios de la PWA de forma segura.

1.  Registrate gratis en el sitio oficial de [Resend](https://resend.com/signup).
2.  En el panel principal de Resend, ve al menú lateral izquierdo y hacé clic en **"Domains"** (Dominios).
3.  Hacé clic en el botón azul **"Add Domain"** (Añadir Dominio).
4.  Ingresá tu dominio: `nuamana.cl`.
5.  En **Region**, seleccioná la región más cercana (ej: `us-east-1` o la que prefieras).
6.  Hacé clic en **"Add"**.
7.  Resend te mostrará una pantalla con **3 registros DNS** indispensables (2 de tipo **TXT** para DKIM/SPF y 1 de tipo **MX** para rebotes).

#### Cómo agregar los registros de Resend en Cloudflare:
Abrí otra pestaña en tu navegador con el panel de Cloudflare de `nuamana.cl` y ve a **DNS** -> **Records** (Registros) -> **Add Record** (Añadir registro) para copiar y pegar cada uno:

*   **Registro DNS 1 (TXT - SPF):**
    *   **Type (Tipo):** `TXT`
    *   **Name (Nombre):** `@` (o `nuamana.cl`)
    *   **TTL:** Dejá en *Auto*.
    *   **Content (Contenido):** Copiá el valor largo que te dio Resend (suele empezar con `v=spf1...`).
    *   Hacé clic en **Save**.
*   **Registro DNS 2 (TXT - DKIM):**
    *   **Type (Tipo):** `TXT`
    *   **Name (Nombre):** Copiá el nombre que te dio Resend (por ejemplo: `resend._domainkey`).
    *   **Content (Contenido):** Copiá la firma criptográfica larga de Resend.
    *   Hacé clic en **Save**.
*   **Registro DNS 3 (MX - Feedback/Rebotes):**
    *   **Type (Tipo):** `MX`
    *   **Name (Nombre):** Copiá el nombre (por ejemplo: `bounces`).
    *   **Mail server:** Copiá el valor (ej: `feedback-smtp.us-east-1.amazonses.com` o el provisto por Resend).
    *   **Priority:** Ingresá la prioridad indicada por Resend (suele ser `10`).
    *   Hacé clic en **Save**.

8.  Volvé a la pestaña de Resend y hacé clic en el botón **"Verify"** (Verificar). *Nota: Si da error al principio, esperá 2 o 3 minutos a que Cloudflare propague los registros y volvé a intentar. Cuando esté listo, el dominio pasará a estado "Active" en verde.*
9.  En el panel lateral de Resend, hacé clic en **"API Keys"** (Claves API).
10. Hacé clic en **"Create API Key"**.
    *   **Name:** Escribí `Supabase Production`.
    *   **Permission:** Selecciona *Full Access*.
    *   **Domain:** Selecciona `nuamana.cl`.
11. Hacé clic en **"Add"**.
12. **Copia la clave API** que te muestra en pantalla (comienza con `re_...`) y guardala de forma segura. No se volverá a mostrar.

---

## PARTE 3: Aplicar Configuración de Correo en Supabase (VPS)

1.  Conectate por SSH a tu VPS de Contabo desde PowerShell:
    ```powershell
    ssh root@IP_DE_TU_VPS
    ```
2.  Abrí el archivo de configuración de variables de entorno de tu Supabase Docker:
    ```bash
    nano /var/www/supabase-docker/docker/.env
    ```
3.  Desplázate con las flechas del teclado hasta encontrar la sección de **SMTP** (o configuración de emails).
4.  Reemplazá o configurá las siguientes variables con tus credenciales de Resend:
    ```env
    # Habilitar el registro y confirmación de correos
    ENABLE_EMAIL_SIGNUP=true
    ENABLE_EMAIL_AUTOCONFIRM=true

    # Configuración SMTP con Resend
    SMTP_ADMIN_EMAIL=contacto@nuamana.cl
    SMTP_HOST=smtp.resend.com
    SMTP_PORT=587
    SMTP_USER=resend
    SMTP_PASS=re_Tu_Clave_API_De_Resend_Copiada_Anteriormente
    SMTP_SENDER_NAME="Guías y Scouts Nua Mana"
    ```
5.  Guardá el archivo presionando **`Ctrl + O`**, luego **`Enter`** para confirmar, y salí con **`Ctrl + X`**.
6.  Reiniciá los servicios de Supabase para cargar la nueva configuración:
    ```bash
    cd /var/www/supabase-docker/docker
    docker compose down && docker compose up -d
    ```

---

## PARTE 4: Pruebas de Funcionamiento

*   **Prueba de Recepción (Redirección):** Escribile un correo de prueba desde otra cuenta personal (ej. Hotmail, otra de Gmail, etc.) a `contacto@nuamana.cl`. Verificá que el correo te llegue a tu bandeja de Gmail verificada.
*   **Prueba de Envío (Supabase):** Entrá a tu PWA `https://nuamana.cl/registro`, crea un usuario de prueba con un correo real y enviá el formulario. Verificá que te llegue a tu bandeja de entrada el correo con el enlace de confirmación firmado por `contacto@nuamana.cl` sin caer en la carpeta de SPAM.

---

## PARTE 5: Configurar Gmail para "Enviar como" contacto@nuamana.cl

Para responder o redactar correos nuevos utilizando la dirección `contacto@nuamana.cl` directamente desde tu cuenta personal de Gmail (como hacías con el hosting antiguo), debés asociar el SMTP de Resend a tu Gmail:

1.  Iniciá sesión en tu cuenta de **Gmail** en la computadora.
2.  Hacé clic en el ícono del **engranaje** (Configuración) arriba a la derecha y selecciona **"Ver todos los ajustes"**.
3.  Hacé clic en la pestaña **"Cuentas e importación"** (Accounts and Import) en la barra superior.
4.  Buscá la sección **"Enviar como:"** (Send mail as) y hacé clic en **"Añadir otra dirección de correo electrónico"** (Add another email address). Se abrirá una ventana emergente de color amarillo.
5.  **Configuración de Identidad:**
    *   **Nombre:** Escribí el nombre que querés que vean los destinatarios (ej: `Guías y Scouts Nua Mana`).
    *   **Dirección de correo electrónico:** Escribí exactamente `contacto@nuamana.cl`.
    *   Desmarcala casilla **"Tratar como un alias"** (Treat as an alias).
    *   Hacé clic en **"Siguiente paso"**.
6.  **Configuración del Servidor SMTP de Resend:**
    *   **Servidor SMTP:** Escribí `smtp.resend.com`
    *   **Puerto:** Seleccioná `587`.
    *   **Nombre de usuario:** Escribí exactamente `resend` (en minúsculas).
    *   **Contraseña:** Pegá tu clave API de Resend (la que copiaste en el Paso 12 de la Parte 2, que empieza con `re_...`).
    *   Selecciona la opción **"Conexión segura mediante TLS (recomendada)"**.
    *   Hacé clic en **"Añadir cuenta"**.
7.  **Confirmación:**
    *   Gmail te indicará que envió un correo de confirmación con un código a `contacto@nuamana.cl`.
    *   Como ya configuraste **Cloudflare Email Routing** en la Parte 1, ese correo de confirmación de Gmail se redireccionará de inmediato y llegará a tu bandeja de entrada de Gmail.
    *   Abrí el correo, copiá el código numérico de confirmación, pegalo en la ventana amarilla de Gmail y hacé clic en **"Verificar"**.

¡Listo! A partir de ahora, al redactar un correo nuevo en Gmail o responder a alguien, vas a tener un menú desplegable en el campo **"De:"** que te permitirá elegir enviar el mensaje como `contacto@nuamana.cl` de forma totalmente profesional, rápida y con firmas seguras.

> [!NOTE]
> **¿Qué pasa con "Consultar el correo de otras cuentas"?**
> No necesitás configurarlo. La redirección de Cloudflare se encarga de "empujar" (forward) los correos entrantes a tu Gmail en tiempo real, lo cual es instantáneo. La opción antigua de Gmail (POP3) hacía consultas cada tanto tiempo y solía demorar hasta 30 minutos en descargar los correos nuevos. Con este nuevo esquema, te llegan al segundo.

