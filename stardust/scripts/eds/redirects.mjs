#!/usr/bin/env node
/**
 * redirects.mjs — build the EDS redirects sheet (content/redirects.json) + stardust/redirects.tsv from the page map.
 *   / → /nb/bank/privat (the market landing is the pilot's home)
 *   every roster source URL (with .html, original case) → its delivered lowercase extensionless path
 *   plus the extensionless original-case form when it differs from the delivered path (path-safety P0 normalisation)
 * The sheet is PUT as application/json to admin.da.live/source/<org>/<repo>/redirects.json, then previewed + published (deploy-batch handles
 * .html only, so the sheet is pushed by publish.mjs).
 */
import fs from 'node:fs';
import * as L from './lib.mjs';
const rows = [{ Source: '/', Destination: '/nb/bank/privat' }];
const seen = new Set(['/']);
for (const m of L.pageMap) {
  const cands = [m.sourceUrl, m.sourceUrl.replace(/\.html$/, ''), m.sourceUrl.toLowerCase(), m.sourceUrl.toLowerCase().replace(/\.html$/, '')];
  for (const c of cands) { if (c === m.deliveredPath || seen.has(c)) continue; seen.add(c); rows.push({ Source: c, Destination: m.deliveredPath }); }
}
const sheet = { total: rows.length, offset: 0, limit: rows.length, data: rows, ':type': 'sheet' };
L.writeFile('content/redirects.json', JSON.stringify(sheet, null, 1));
fs.writeFileSync('stardust/redirects.tsv', rows.map((r) => `${r.Source}\t${r.Destination}`).join('\n') + '\n');
console.log(`redirects: ${rows.length} rows → content/redirects.json + stardust/redirects.tsv`);
