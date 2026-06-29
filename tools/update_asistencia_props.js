const fs = require('fs');
const file = 'frontend/src/components/dashboard/dashmod_asistencia.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldStr = `interface DashModAsistenciaProps {
  isOpen: boolean
  onClose: () => void
  propuesta: any
  perfil: any
  onSuccess?: () => void
}`;

const newStr = `interface DashModAsistenciaProps {
  isOpen: boolean
  onClose: () => void
  propuesta: any
  perfil: any
  cicloActivo?: any
  onSuccess?: () => void
}`;

if (str.includes(oldStr)) {
  str = str.replace(oldStr, newStr);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update successful');
} else {
  console.log('Target string not found');
}
