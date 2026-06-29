const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldState = `const [isModRadarOpen, setIsModRadarOpen] = useState(false)`;
const newState = `const [isModRadarOpen, setIsModRadarOpen] = useState(false)
  const [isModResenaOpen, setIsModResenaOpen] = useState(false)`;

const oldModal = `<DashModBitacoraCrear`;
const newModal = `<DashModResena
        isOpen={isModResenaOpen}
        onClose={() => setIsModResenaOpen(false)}
        propuesta={selectedPropuesta}
        perfil={perfil}
        onSuccess={fetchCiclo}
      />
      <DashModBitacoraCrear`;

if (str.includes(oldState)) {
  str = str.replace(oldState, newState);
}

if (str.includes(oldModal)) {
  str = str.replace(oldModal, newModal);
}

fs.writeFileSync(file, str, 'utf8');
console.log('Registered DashModResena in DashCiclo');
