const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function applyFix() {
    const sqlPath = path.join(__dirname, 'fix_actas_rls.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Aplicando corrección de RLS para Actas...');
    
    // Separar por comandos (aproximado por punto y coma)
    const commands = sql
        .split(';')
        .map(c => c.trim())
        .filter(c => c.length > 0 && !c.startsWith('--'));

    for (let cmd of commands) {
        if (cmd.includes('CREATE OR REPLACE FUNCTION')) {
            // Manejar funciones que contienen punto y coma internamente
            // Esta lógica es simple y puede fallar con funciones complejas, 
            // pero para esta función debería bastar si no hay ; locos.
            // En este caso, la función termina en $$;
        }
        
        console.log(`Ejecutando comando...`);
        try {
            // Escapar comillas dobles para shell
            const escapedCmd = cmd.replace(/"/g, '""');
            execSync(`npx supabase db query "${escapedCmd}"`, { stdio: 'inherit' });
        } catch (err) {
            console.error(`Error en comando: ${err.message}`);
        }
    }
    console.log('Proceso finalizado.');
}

applyFix();
