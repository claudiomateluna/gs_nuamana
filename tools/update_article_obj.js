const fs = require('fs');
const file = 'frontend/src/app/blog/[...slug]/page.tsx';
let str = fs.readFileSync(file, 'utf8');

const oldStr = `        if (allPossiblePaths.includes(currentPath)) {
          setArticulo(art)
          const sortedCats = [...linkedCats].sort((a, b) => buildCatPathSlugs(b.id).length - buildCatPathSlugs(a.id).length)`;

const newStr = `        if (allPossiblePaths.includes(currentPath)) {
          if (art.metadata?.objetivos_educativos?.length > 0) {
            const ids = art.metadata.objetivos_educativos.map((o: any) => o.id)
            const { data: fullObjs } = await supabase
              .from('progresion_objetivos')
              .select('id, texto_terminal, rango_edad, unidad:unidades(colores)')
              .in('id', ids)
            
            if (fullObjs) {
              art.metadata.objetivos_educativos = art.metadata.objetivos_educativos.map((o: any) => {
                const full = fullObjs.find((f: any) => f.id === o.id)
                return full ? { ...o, texto_terminal: full.texto_terminal, rango_edad: full.rango_edad, color: full.unidad?.colores?.primario } : o
              })
            }
          }
          setArticulo(art)
          const sortedCats = [...linkedCats].sort((a, b) => buildCatPathSlugs(b.id).length - buildCatPathSlugs(a.id).length)`;

if (str.includes(oldStr)) {
  str = str.replace(oldStr, newStr);
  fs.writeFileSync(file, str, 'utf8');
  console.log('Update 1 successful');
} else {
  console.log('oldStr not found');
}
