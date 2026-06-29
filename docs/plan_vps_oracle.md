# Registro de Avance: Captura de VPS Oracle Cloud (Always Free)

## Estado Actual (16 de Mayo, 2026)
Se ha dejado un script de "caza" ejecutándose en el Cloud Shell de Oracle Cloud para obtener una instancia de procesador **Ampere A1 (4 OCPU, 24GB RAM)** en la región de **Santiago (Chile)**.

### Detalles Técnicos del Script
- **Archivo en Cloud Shell:** `caza_servidor.sh`
- **Comando de ejecución:** `nohup ./caza_servidor.sh > log.txt 2>&1 &`
- **Configuración:** Ubuntu 22.04 ARM, Subred de VCN-NuaMana.
- **Estado:** Ejecutándose en segundo plano (PID 658 o similar).

## Siguiente Fase: Configuración del Servidor
Una vez que el servidor sea "cazado" (notificación por email o visualización en el panel de Oracle), los pasos a seguir son:

### 1. Conexión SSH
Utilizar la llave privada generada en `C:\Users\claud\.oci\oci_api_key.pem`.
```bash
ssh -i C:\Users\claud\.oci\oci_api_key.pem ubuntu@<IP_DEL_SERVIDOR>
```

### 2. Apertura de Puertos (VCN Security Lists)
En el panel de Oracle, ir a la Subred y añadir Ingress Rules para:
- **80 (HTTP)** y **443 (HTTPS)**
- **8000** (Panel de Coolify)

### 3. Instalación de Coolify
Ejecutar el comando de instalación de un solo paso para gestionar el Self-Hosting:
```bash
curl -fsSL https://cdn.coolify.io/install.sh | bash
```

### 4. Despliegue de Aplicación
- Configurar Supabase (Docker) vía Coolify.
- Conectar repositorio de GitHub del frontend Next.js.

**Nota:** Toda la configuración de la OCI CLI y los scripts generados residen en `C:\Users\claud\Documents\PWA\NuaMana\`.
