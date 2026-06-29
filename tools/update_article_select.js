const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldSelect = `.select(\`*, articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id))\`)`;
const newSelect = `.select(\`*, articulo_categorias(categoria_id, categorias(id, nombre, slug, parent_id)), articulo_resenas(*, perfiles(nombres, apellidos))\`)`;

if (str.includes(oldSelect)) {
  str = str.replace(oldSelect, newSelect);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Updated select to include resenas');
} else {
  console.log('Old select string not found exactly');
}
