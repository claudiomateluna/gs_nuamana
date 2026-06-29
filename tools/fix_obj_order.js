const fs = require('fs');

function fixFetchOrder(file) {
  let str = fs.readFileSync(file, 'utf8');
  
  const target = `.in('unidad_id', unitIds)
          .in('area_id', areaIds)`;
          
  const replacement = `.in('unidad_id', unitIds)
          .in('area_id', areaIds)
          .order('unidad_id', { ascending: true })
          .order('area_id', { ascending: true })`;

  if (str.includes(target)) {
    str = str.replace(target, replacement);
    fs.writeFileSync(file, str, 'utf8');
    console.log('Fixed order in', file);
  } else {
    console.log('Target not found in', file);
  }
}

fixFetchOrder('frontend/src/app/blog/crear/page.tsx');
fixFetchOrder('frontend/src/app/blog/editar/[id]/page.tsx');

function fixArticleView(file) {
  let str = fs.readFileSync(file, 'utf8');
  
  const target = `{Object.entries(metadata.objetivos_educativos.reduce((acc: any, obj: any) => {`;
  
  const replacement = `{Object.entries(
                    [...metadata.objetivos_educativos].sort((a: any, b: any) => {
                      const uMap: any = { 'Manada': 1, 'Compañía': 2, 'Tropa': 3, 'Avanzada': 4, 'Clan': 5 };
                      return (uMap[a.unidad] || 99) - (uMap[b.unidad] || 99);
                    }).reduce((acc: any, obj: any) => {`;

  if (str.includes(target)) {
    str = str.replace(target, replacement);
    fs.writeFileSync(file, str, 'utf8');
    console.log('Fixed sorting in article view', file);
  } else {
    console.log('Target not found in', file);
  }
}

fixArticleView('frontend/src/app/blog/[...slug]/page.tsx');
