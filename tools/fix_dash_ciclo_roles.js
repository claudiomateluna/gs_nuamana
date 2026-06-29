const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

str = str.replace(`.eq('rol_id', 4)`, `.in('rol_id', [9, 10, 11, 12, 13])`);

fs.writeFileSync(file, str, 'utf8');
console.log('Fixed DashCiclo roles');
