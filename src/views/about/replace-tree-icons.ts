// src/scripts/replace-tree-icons.js
import fs from 'fs';

const file = 'src/views/about/dir.txt';
let lines = fs.readFileSync(file, 'utf8').split('\n');

lines = lines.map(line => {
  // 文件夹：├── xxx/ 或 └── xxx/
  if (/([├└]── )([^/\n]+)\/$/.test(line)) {
    return line.replace(/([├└]── )([^/\n]+)\/$/, '$1📁$2');
  }
  // 文件：没有 / 结尾且没有 📁 前缀
  if (/([├└]── )([^\s/][^/]*)$/.test(line) && !line.includes('📁')) {
    return line.replace(/([├└]── )([^\s/][^/]*)$/, '$1📃$2');
  }
  return line;
});

fs.writeFileSync(file, lines.join('\n'));
