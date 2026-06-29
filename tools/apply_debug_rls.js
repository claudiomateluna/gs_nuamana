const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function applyFix() {
    const sqlPath = path.join(__dirname, 'debug_rls_all.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Aplicando debug_rls_all.sql...');
    
    // Ejecutar el bloque DO $$ completo como un solo comando
    const doBlock = sql.match(/DO \$\$[\s\S]*?END \$\$;/g)[0];
    const funcBlock = sql.match(/CREATE OR REPLACE FUNCTION[\s\S]*?\$\$;/g)[0];

    try {
        console.log('Ejecutando bloque DO...');
        const escapedDo = doBlock.replace(/"/g, '""');
        execSync(`npx supabase db query "${escapedDo}"`, { stdio: 'inherit' });

        console.log('Ejecutando CREATE FUNCTION...');
        const escapedFunc = funcBlock.replace(/"/g, '""');
        execSync(`npx supabase db query "${escapedFunc}"`, { stdio: 'inherit' });
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
    console.log('Proceso finalizado.');
}

applyFix();
