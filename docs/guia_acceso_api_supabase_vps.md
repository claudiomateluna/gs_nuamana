# Guía de Recuperación de Credenciales para api-supabase.nuamana.cl (VPS Contabo)

Cuando el usuario pida ayuda para ingresar a `api-supabase.nuamana.cl` (Kong / Supabase Dashboard en producción), las instrucciones exactas a entregar son:

### 🔑 Pasos para ver o cambiar la contraseña de Kong / Supabase en tu VPS Contabo:

1. **Conectate a tu VPS por SSH desde PowerShell:**
   ```powershell
   ssh root@IP_DE_TU_VPS
   ```

2. **Entrá a la carpeta de Supabase Docker:**
   ```bash
   cd /var/www/supabase-docker/docker
   ```
   *(Si el despliegue lo hiciste en la carpeta del proyecto, la ruta es `/var/www/nuamana/supabase`)*.

3. **Ver las credenciales actuales configuradas:**
   Ejecutá este comando para consultar en pantalla el usuario y contraseña exactos que están guardados en tu servidor:
   ```bash
   grep -E "^DASHBOARD_USERNAME=|^DASHBOARD_PASSWORD=" .env
   ```
   *Esto te mostrará tu usuario (por defecto suele ser `supabase`) y la contraseña actual configurada.*

4. **Para modificar o resetear la contraseña:**
   * Abrí `.env` con `nano .env`.
   * Cambiá el valor de `DASHBOARD_PASSWORD`.
   * Guardá con `Ctrl + O`, `Enter`, `Ctrl + X`.
   * Aplicá los cambios ejecutando: `docker compose down && docker compose up -d`.
