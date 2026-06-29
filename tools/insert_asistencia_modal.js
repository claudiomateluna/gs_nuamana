const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetStr = `<DashModEvaluarObjetivo`;

const insertion = `<DashModAsistencia
        isOpen={isModAsistenciaOpen}
        onClose={() => setIsModAsistenciaOpen(false)}
        propuesta={selectedPropuesta}
        perfil={perfil}
        onSuccess={fetchCiclo}
      />
      `;

if (str.includes(targetStr)) {
  str = str.replace(targetStr, insertion + targetStr);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update successful');
} else {
  console.log('Target string not found');
}
