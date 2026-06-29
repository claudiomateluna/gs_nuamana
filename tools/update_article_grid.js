const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const targetStr = `<div className="flex flex-col gap-2">
                        {objs.map((o: any, i: number) => (`;
const newStr = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {objs.map((o: any, i: number) => (`;

if (str.includes(targetStr)) {
  str = str.replace(targetStr, newStr);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update successful');
} else {
  console.log('Target string not found');
}
