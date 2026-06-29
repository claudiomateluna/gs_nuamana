const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldStr = `<DashModAsistencia
        isOpen={isModAsistenciaOpen}
        onClose={() => setIsModAsistenciaOpen(false)}
        propuesta={selectedPropuesta}
        perfil={perfil}
        onSuccess={fetchCiclo}
      />`;

const newStr = `{cicloActivo && (
        <DashModAsistencia
          isOpen={isModAsistenciaOpen}
          onClose={() => setIsModAsistenciaOpen(false)}
          propuesta={selectedPropuesta}
          perfil={perfil}
          onSuccess={fetchCiclo}
        />
      )}`;

if (str.includes(oldStr)) {
  str = str.replace(oldStr, newStr);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Wrapped DashModAsistencia in {cicloActivo && ...}');
} else {
  console.log('DashModAsistencia string not found exactly as expected');
}
