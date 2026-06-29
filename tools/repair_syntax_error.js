const fs = require('fs');
const file = 'frontend/src/components/dashboard/dash_ciclo.tsx';
let str = fs.readFileSync(file, 'utf8');

const badLine = 'className="w-full py-3.5 style={{ backgroundColor: unitColor }} className="w-full py-3.5 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[10px] tracking-widest disabled:opacity-50""';
const goodLine = 'style={{ backgroundColor: unitColor }} className="w-full py-3.5 text-white font-black uppercase rounded-xl shadow-lg hover:scale-105 transition-all text-[10px] tracking-widest disabled:opacity-50"';

if (str.includes(badLine)) {
  str = str.replace(badLine, goodLine);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Fixed syntax error successfully');
} else {
  console.log('Target string not found');
}
