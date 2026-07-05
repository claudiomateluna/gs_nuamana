#!/bin/bash
# Script para sincronizar automáticamente las claves de Supabase Docker con el frontend Next.js

# 1. Leer ANON_KEY del archivo .env de Supabase Docker
anon_key=$(grep -E "^ANON_KEY=" /var/www/supabase-docker/docker/.env | cut -d'=' -f2-)

# 2. Escribir las variables en el .env.production del frontend
cat <<EOF > /var/www/nuamana/frontend/.env.production
NEXT_PUBLIC_SUPABASE_URL=https://api-supabase.nuamana.cl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon_key
EOF

echo "=========================================================="
echo " ¡Variables de entorno del frontend sincronizadas!"
echo "=========================================================="
echo "NEXT_PUBLIC_SUPABASE_URL: https://api-supabase.nuamana.cl"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: (Cargada exitosamente desde Supabase Docker)"
echo "=========================================================="
