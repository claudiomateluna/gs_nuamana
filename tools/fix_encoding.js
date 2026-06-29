const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');
const replacements = {
  'DiagnÃ³stico y Ã‰nfasis': 'Diagnóstico y Énfasis',
  'Juego DemocrÃ¡tico': 'Juego Democrático',
  'OrganizaciÃ³n y DiseÃ±o': 'Organización y Diseño',
  'EjecuciÃ³n de Actividades': 'Ejecución de Actividades',
  'EvaluaciÃ³n y ProgresiÃ³n': 'Evaluación y Progresión',
  'GestiÃ³n': 'Gestión',
  'AÃ±adir': 'Añadir',
  'evaluaciÃ³n': 'evaluación',
  'InformaciÃ³n': 'Información',
  'PreselecciÃ³n': 'Preselección',
  'SelecciÃ³n': 'Selección',
  'OpciÃ³n': 'Opción',
  'AÃ±o': 'Año',
  'AÃ±os': 'Años',
  'aÃ±os': 'años',
  'Ã\x81rea': 'Área',
  'Ã¡rea': 'área',
  'Ãºltimo': 'último',
  'MÃ¡s': 'Más',
  'mÃ¡s': 'más',
  'TambiÃ©n': 'También',
  'tambiÃ©n': 'también',
  'SÃ­': 'Sí',
  'sÃ­': 'sí',
  'DÃ­a': 'Día',
  'dÃ­a': 'día',
  'BÃºsqueda': 'Búsqueda',
  'bÃºsqueda': 'búsqueda',
  'TÃ­tulo': 'Título',
  'tÃ­tulo': 'título',
  'ðŸ”\x8D': '🔍',
  'ðŸ—³ï¸\x8F': '🗳️',
  'ðŸ“…': '📅',
  'âšœï¸\x8F': '⚜️',
  'ðŸ“Š': '📊',
  'ðŸ’¡': '💡',
  'ðŸ—“ï¸\x8F': '🗓️',
  'ðŸ”': '🔍',
  'ðŸ—³ï¸': '🗳️',
  'âšœï¸': '⚜️'
};
for (const [bad, good] of Object.entries(replacements)) {
  str = str.split(bad).join(good);
}
fs.writeFileSync(file, str, 'utf8');
console.log('Fixed encoding.');