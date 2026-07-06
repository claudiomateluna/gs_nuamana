const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Rutas de archivos en el VPS
const supabaseEnvPath = '/var/www/supabase-docker/docker/.env';
const frontendEnvPath = '/var/www/nuamana/frontend/.env.production';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateJWT(role, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  // Expiración a 25 años en el futuro
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + (25 * 365 * 24 * 60 * 60);

  const payload = {
    role: role,
    iss: 'supabase',
    iat: iat,
    exp: exp
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signatureInput);
  const signature = base64UrlEncode(hmac.digest());

  return `${signatureInput}.${signature}`;
}

try {
  console.log('Iniciando sincronización de llaves JWT...');

  if (!fs.existsSync(supabaseEnvPath)) {
    console.error(`Error: No se encontró el archivo de variables de Supabase en ${supabaseEnvPath}`);
    process.exit(1);
  }

  // 1. Leer el archivo .env de Supabase
  let supabaseEnv = fs.readFileSync(supabaseEnvPath, 'utf8');

  // 2. Extraer el JWT_SECRET
  const jwtSecretMatch = supabaseEnv.match(/^JWT_SECRET=(.+)$/m);
  if (!jwtSecretMatch || !jwtSecretMatch[1]) {
    console.error('Error: No se encontró la variable JWT_SECRET en el archivo .env de Supabase.');
    process.exit(1);
  }

  const jwtSecret = jwtSecretMatch[1].trim();
  console.log('JWT_SECRET obtenido con éxito.');

  // 3. Obtener o generar las llaves ANON_KEY y SERVICE_ROLE_KEY
  const anonKeyMatch = supabaseEnv.match(/^ANON_KEY=(.+)$/m);
  const serviceKeyMatch = supabaseEnv.match(/^SERVICE_ROLE_KEY=(.+)$/m);

  let finalAnonKey = anonKeyMatch ? anonKeyMatch[1].trim() : '';
  let finalServiceKey = serviceKeyMatch ? serviceKeyMatch[1].trim() : '';

  const isPlaceholder = (key) => !key || key.startsWith('your-') || key.includes('placeholder') || key.length < 50;

  if (isPlaceholder(finalAnonKey) || isPlaceholder(finalServiceKey)) {
    console.log('Generando nuevas llaves JWT (ANON_KEY y SERVICE_ROLE_KEY)...');
    finalAnonKey = generateJWT('anon', jwtSecret);
    finalServiceKey = generateJWT('service_role', jwtSecret);

    // 4. Actualizar el archivo .env de Supabase Docker con las nuevas firmas
    supabaseEnv = supabaseEnv.replace(/^ANON_KEY=.*$/m, `ANON_KEY=${finalAnonKey}`);
    supabaseEnv = supabaseEnv.replace(/^SERVICE_ROLE_KEY=.*$/m, `SERVICE_ROLE_KEY=${finalServiceKey}`);
    fs.writeFileSync(supabaseEnvPath, supabaseEnv, 'utf8');
    console.log('Archivo .env de Supabase Docker actualizado.');
  } else {
    console.log('Utilizando ANON_KEY y SERVICE_ROLE_KEY existentes de Supabase Docker.');
  }

  // 5. Crear/Actualizar el archivo .env.production del Frontend
  const frontendEnvContent = [
    'NEXT_PUBLIC_SUPABASE_URL=https://api-supabase.nuamana.cl',
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${finalAnonKey}`,
    `SUPABASE_SERVICE_ROLE_KEY=${finalServiceKey}`,
    ''
  ].join('\n');

  fs.writeFileSync(frontendEnvPath, frontendEnvContent, 'utf8');
  console.log('Archivo .env.production de Next.js actualizado.');

  console.log('\n==========================================================');
  console.log(' ¡LLAVES JWT SINCRONIZADAS Y REGENERADAS CON ÉXITO!');
  console.log('==========================================================');
  console.log('Para aplicar los cambios en Supabase, ejecutá en tu VPS:');
  console.log('  cd /var/www/supabase-docker/docker');
  console.log('  docker compose down && docker compose up -d');
  console.log('==========================================================\n');

} catch (err) {
  console.error('Ocurrió un error inesperado:', err);
  process.exit(1);
}
