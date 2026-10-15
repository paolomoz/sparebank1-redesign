#!/usr/bin/env node
/**
 * sync-bank-choice.mjs — dynamics #1 (bank-choice): refresh the postcode → bank snapshot the bank-router block reads.
 *
 * The source's inline bank chooser filters `window.bankPickerlist` client-side (each bank carries `postalRange: [{from, to}]`,
 * server-rendered into every page) — no API call for a typed postcode. This script reads that list from one source page and
 * writes only the NON-TEXT fields (short name, language tree, postal ranges); names, taglines and links stay authored in the
 * /fragments/bank-router document (document-first).
 *
 *   node stardust/scripts/dynamics/sync-bank-choice.mjs [--url https://www.sparebank1.no/nb/bank/privat.html] [--out data/bank-choice]
 *
 * Writes <out>/banks.json and <out>/_provenance.json. Commit both; the branch serves them from the code bus.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const arg = (name, def) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : def; };
const url = arg('url', 'https://www.sparebank1.no/nb/bank/privat.html');
const out = arg('out', 'data/bank-choice');

const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36' } });
if (!res.ok) { console.error(`source ${res.status} ${url}`); process.exit(2); }
const html = await res.text();
const banks = [...html.matchAll(/bankPickerlist\.push\(\s*(\{[\s\S]*?\})\s*\);/g)].map(([, body]) => {
  const field = (k) => (body.match(new RegExp(`"${k}"\\s*:\\s*"([^"]*)"`)) || [])[1] || '';
  const ranges = JSON.parse((body.match(/JSON\.parse\('([^']*)'\)/) || [])[1] || '[]');
  const lang = (field('url').match(/^\/(nb|nn|en)\//) || [])[1] || 'nb';
  return { bank: field('bankShortName'), lang, postalRange: ranges.map(({ from, to }) => [from, to]) };
}).filter((b) => b.bank && b.postalRange.length);
if (!banks.length) { console.error('no bankPickerlist entries found — source markup changed'); process.exit(1); }

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'banks.json'), `${JSON.stringify({ total: banks.length, data: banks })}\n`);
writeFileSync(join(out, '_provenance.json'), `${JSON.stringify({
  writtenBy: 'stardust:dynamics #1 bank-choice (stardust/scripts/dynamics/sync-bank-choice.mjs)',
  writtenAt: new Date().toISOString(),
  source: url,
  sourceField: 'window.bankPickerlist[].{bankShortName, url (language tree), postalRange}',
  note: 'Identical on every source page (checked boliglan + valutakalkulator 2026-10-15). Re-run when SpareBank 1 changes a bank\'s postal coverage.',
}, null, 1)}\n`);
console.log(`${banks.length} banks → ${join(out, 'banks.json')}`);
