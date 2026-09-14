// _probe-richli.mjs — list items in migrated pages whose body holds block content (a heading or >1 paragraph): these cannot nest in a David's-Model list (D2)
import fs from 'node:fs'; import path from 'node:path'; import { parseHTML } from 'linkedom';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []));
let tot = 0;
for (const f of walk('stardust/migrated')) {
  const { document } = parseHTML(fs.readFileSync(f, 'utf8')); let n = 0; const where = new Set();
  document.querySelectorAll('main li').forEach((li) => { const hs = li.querySelectorAll('h1,h2,h3,h4').length; const ps = li.querySelectorAll('p').length; if (hs || ps > 1) { n++; const m = li.closest('[data-module]'); where.add(m ? m.getAttribute('data-module') : '?'); } });
  if (n) { tot += n; console.log(String(n).padStart(3), [...where].join(','), f.replace('stardust/migrated/', '')); }
}
console.log('total', tot);
