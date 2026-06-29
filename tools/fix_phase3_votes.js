const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldVotoCalc = `const totalVotos = votos.filter(v => v.propuesta_id === a.id).length`;
const newVotoCalc = `const totalVotos = votos.filter(v => v.propuesta_id === a.id).reduce((acc, v) => acc + (v.cantidad || 0), 0)`;

const oldVotoCalc2 = `const totalVotos = votos.filter(v => v.propuesta_id === p.id).length`;
const newVotoCalc2 = `const totalVotos = votos.filter(v => v.propuesta_id === p.id).reduce((acc, v) => acc + (v.cantidad || 0), 0)`;

str = str.replace(oldVotoCalc, newVotoCalc);
str = str.replace(oldVotoCalc2, newVotoCalc2);

fs.writeFileSync(file, str, 'utf8');
console.log('Updated Phase 3 vote calculations');
