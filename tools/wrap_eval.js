const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetStr = `{isModEvalActividadOpen && (`;
const newStr = `{cicloActivo && isModEvalActividadOpen && (`;

if (str.includes(targetStr)) {
  str = str.replace(targetStr, newStr);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update successful');
} else {
  console.log('Target string not found');
}
