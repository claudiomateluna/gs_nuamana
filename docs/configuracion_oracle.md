# Configuración de Oracle Cloud Storage (S3 Compatible)

Para la PWA de Nua Mana, utilizaremos el Object Storage de Oracle Cloud (Free Tier) debido a su generoso límite de almacenamiento.

## Pasos para la Configuración

1.  **Crear un Bucket:**
    *   Inicia sesión en la consola de Oracle Cloud.
    *   Ve a **Storage** > **Buckets**.
    *   Crea un bucket llamado `nua-mana-storage`.
    *   Configura el bucket como **Public** (si quieres que las fotos del blog sean accesibles directamente por URL) o manténlo privado y usa URLs firmadas.

2.  **Obtener Credenciales S3:**
    *   Ve a tu perfil de usuario (Icono de persona en la esquina superior derecha) > **User Settings**.
    *   En el menú de la izquierda, selecciona **Customer Secret Keys**.
    *   Haz clic en **Generate Secret Key**. Ponle un nombre (ej. `nua-mana-pwa`).
    *   **IMPORTANTE:** Copia la clave secreta inmediatamente, no podrás verla de nuevo.
    *   Copia también el **Access Key** que se muestra en la tabla.

3.  **Obtener el Endpoint:**
    *   El formato del endpoint de Oracle Cloud S3 es: `https://{namespace}.compat.objectstorage.{region}.oraclecloud.com`
    *   Puedes encontrar tu `namespace` en la página de detalles del Bucket.
    *   La `region` es el identificador de tu región (ej. `sa-santiago-1`).

4.  **Integración con la App:**
    *   Utilizaremos el SDK de AWS S3 (`@aws-sdk/client-s3`) en Next.js para interactuar con Oracle Cloud.
    *   Las claves obtenidas deben ir en tu archivo `.env.local`.

## Por qué Oracle Cloud y no Supabase Storage
Supabase Storage tiene un límite de 1GB en su capa gratuita. Oracle Cloud ofrece hasta **20GB** en su capa "Always Free", lo cual es ideal para un blog con muchas fotos de actividades scouts.
