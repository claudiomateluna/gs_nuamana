const { execSync } = require('child_process');
const cmds = [
    'ALTER TABLE public.actas DISABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.acta_acuerdos DISABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.acta_participantes DISABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.acta_temas DISABLE ROW LEVEL SECURITY',
    'DROP POLICY IF EXISTS "debug_all" ON public.actas',
    'DROP POLICY IF EXISTS "Actas insert policy" ON public.actas'
];
for (const cmd of cmds) {
    try {
        console.log(`Running: ${cmd}`);
        execSync(`npx supabase db query "${cmd}"`, { stdio: 'inherit' });
    } catch (e) {}
}
