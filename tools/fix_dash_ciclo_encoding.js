const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../frontend/src/components/dashboard/dash_ciclo.tsx');
let str = fs.readFileSync(file, 'utf8');

const mapping = {
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã\x81': 'Á', 'Ã\x89': 'É', 'Ã\x8d': 'Í', 'Ã\x93': 'Ó', 'Ã\x9a': 'Ú',
    'Ã±': 'ñ', 'Ã\x91': 'Ñ',
    'Â¿': '¿', 'Â¡': '¡',
    'â€¢': '•',
    'â—': '●',
    'ðŸ”\x8D': '🔍',
    'ðŸ—³ï¸\x8F': '🗳️',
    'ðŸ—³ï¸': '🗳️',
    'ðŸ“…': '📅',
    'âšœï¸\x8F': '⚜️',
    'âšœï¸': '⚜️',
    'ðŸ“Š': '📊',
    'ðŸ’¡': '💡',
    'ðŸ—“ï¸\x8F': '🗓️',
    'ðŸ’¾': '💾',
    'âœ¨': '✨',
    'â­ï¸\x8F': '⏭️',
    'â­ï¸': '⏭️',
    'â\xae': '❮',
    'â\xaf': '❯',
    'ðŸ—‘ï¸\x8F': '🗑️',
    'ðŸ—‘ï¸': '🗑️',
    'ðŸŒªï¸\x8F': '🌪️',
    'ðŸ¤«': '🤫',
    'ðŸŽ²': '🎲',
    'ðŸ“‹': '📋',
    'âš ï¸\x8F': '⚠️',
    'ðŸ“': '📝',
    'âœ…': '✅',
    'ðŸ‘¥': '👥',
    'ðŸ“¸': '📸',
    'â›º': '🏕️',
    'âŒ›': '⌛',
    'â³': '⌛',
    'ðŸš§': '🚧',
    'ðŸ“œ': '📜',
    'ðŸŒ‘': '🌑',
    '🔍’': '🔒'
};

for (const [bad, good] of Object.entries(mapping)) {
    str = str.split(bad).join(good);
}

// Additional specific orthography fixes
str = str.replace(/siclo/gi, (m) => m[0] === 's' ? 'ciclo' : 'Ciclo');
str = str.replace(/Aventura:/g, 'Aventura:'); 

fs.writeFileSync(file, str, 'utf8');
console.log('Fixed encoding and orthography in dash_ciclo.tsx.');