const fs = require('fs');
let content = fs.readFileSync('supabase/scripts/gspau_v2_batch6.json', 'utf-8');

// Find all problematic patterns and fix them
// The issue is unescaped " inside JSON string values
// Strategy: find all occurrences of " that should be escaped

// Fix specific known issues
const fixes = [
  ['por el l\u00edder (por ejemplo, "la ciudad")', 'por el l\u00edder (por ejemplo, \\"la ciudad\\")'],
  ['el l\u00edder grita "\u00a1cambio!"', 'el l\u00edder grita \\"\u00a1cambio!\\"'],
  ['si someone se quita', 'si alguien se quita'],
];

for (const [search, replace] of fixes) {
  content = content.replace(search, replace);
}

try {
  const data = JSON.parse(content);
  console.log('Fixed! ' + data.length + ' activities');
  fs.writeFileSync('supabase/scripts/gspau_v2_batch6.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('File rewritten');
} catch(e) {
  console.log('Still broken:', e.message);
}
