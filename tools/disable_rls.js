const { execSync } = require('child_process');
const tables = ['actas', 'acta_participantes', 'acta_acuerdos', 'acta_temas', 'acta_firmas', 'acta_adjuntos'];
for (const table of tables) {
    try {
        console.log(`Desactivando RLS en ${table}...`);
        execSync(`npx supabase db query "ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY"`, { stdio: 'inherit' });
    } catch (e) {}
}
