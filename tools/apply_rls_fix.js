const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../frontend/.env.local') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function applyRLS() {
    const sqlPath = path.join(__dirname, '../supabase/migrations/20260612000000_fix_perfiles_rls_update.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Aplicando corrección de RLS...');
    
    // Supabase JS no tiene un método directo para ejecutar SQL arbitrario (salvo vía RPC o extensiones)
    // Pero podemos usar la API de administración si estuviera disponible.
    // Como estamos en LOCAL, lo más sencillo es usar psql o el CLI de forma atómica.
    
    // Intentaremos ejecutarlo vía npx supabase db query para cada comando
    const commands = sql
        .split(';')
        .map(c => c.trim())
        .filter(c => c.length > 0 && !c.startsWith('--'));

    for (const cmd of commands) {
        console.log(`Ejecutando: ${cmd.substring(0, 50)}...`);
        // Usamos la ejecución directa de shell para cada comando
        const { execSync } = require('child_process');
        try {
            // Escapar comillas dobles para PowerShell
            const escapedCmd = cmd.replace(/"/g, '""');
            execSync(`npx supabase db query "${escapedCmd}"`, { stdio: 'inherit' });
        } catch (err) {
            console.error(`Error en comando: ${err.message}`);
        }
    }
    console.log('Proceso finalizado.');
}

applyRLS();
