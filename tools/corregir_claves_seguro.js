const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar variables desde el .env del proyecto
require('dotenv').config({ path: path.join(__dirname, '../frontend/.env.local') });
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Sobrescribir con Service Role Key local

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Error: Faltan variables de entorno (NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixPasswords() {
    console.log('--- Iniciando Corrección Segura de Contraseñas ---');
    console.log(`Apuntando a: ${SUPABASE_URL}`);
    
    const logStream = fs.createWriteStream(path.join(__dirname, 'password_fix_log.txt'), { flags: 'a' });
    const log = (msg) => {
        console.log(msg);
        logStream.write(`${new Date().toISOString()} - ${msg}\n`);
    };

    try {
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
            perPage: 1000
        });

        if (listError) throw listError;

        // Solo usuarios migrados (email termina en @nuamana.cl)
        const migrated = users.filter(u => u.email && u.email.endsWith('@nuamana.cl'));
        log(`Se encontraron ${migrated.length} usuarios migrados.`);

        for (const u of migrated) {
            // El email es el RUT completo (ej: 12.345.678-9@nuamana.cl)
            const rutPart = u.email.split('@')[0];
            // Extraer solo números antes del guion para la nueva clave
            const cleanPass = rutPart.split('-')[0].replace(/[^0-9]/g, '');
            
            if (!cleanPass) {
                log(`[!] RUT inválido para usuario ${u.email}, saltando.`);
                continue;
            }

            const { error: updateError } = await supabase.auth.admin.updateUserById(u.id, {
                password: cleanPass
            });

            if (updateError) {
                log(`[ERROR] No se pudo actualizar ${u.email}: ${updateError.message}`);
            } else {
                log(`[OK] Contraseña actualizada para ${u.email} -> (RUT sin DV)`);
            }
        }
    } catch (err) {
        log(`[FATAL] Error en el proceso: ${err.message}`);
    } finally {
        log('--- Proceso Finalizado ---');
        logStream.end();
    }
}

fixPasswords();
