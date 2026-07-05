# Comando para Sincronizar Claves Supabase en el VPS

Copia el siguiente bloque de código completo y pegalo en la terminal SSH de tu VPS:

```bash
anon_key=$(grep -E "^ANON_KEY=" /var/www/supabase-docker/docker/.env | cut -d'=' -f2-) && echo -e "NEXT_PUBLIC_SUPABASE_URL=https://api-supabase.nuamana.cl\nNEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key" > /var/www/nuamana/frontend/.env.production
```

---

## Opción Alternativa (Ejecutar Script de una sola palabra)

Si la consola te deforma el comando largo al pegarlo, subí este cambio a GitHub y ejecutá este comando super corto en la consola de tu VPS:

```bash
bash /var/www/nuamana/frontend/sync_keys.sh
```
