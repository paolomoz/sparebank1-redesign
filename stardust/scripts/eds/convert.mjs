#!/usr/bin/env node
/**
 * convert.mjs — migrated redesign page → DA body-fragment content page (stardust:rollout Phase C ENCODE).
 *   node stardust/scripts/eds/convert.mjs <slug> [slug…] | --all [--family <f>]
 * Writes content/<delivered-path>.html and stardust/rollout/eds-log/<slug>.json (module → block map, notes, gaps, rasterise list).
 * Every `main > section|article` of the migrated page is a module root (data-module); ENCODERS map it to one or more DA sections.
 * A module with no encoder is emitted as prose default content and logged as a gap (the page is NOT deliverable until 0 gaps).
 * Chrome: the page's nav/footer/router variant comes from stardust/rollout/chrome-map.json (metadata rows + a fragment section).
 * Family encoders: stardust/scripts/eds/encoders/<family>.mjs → `export default { '<data-module>': (root, ctx) => ({ html, blocks }) }`,
 * applied only to pages of that family (they may override core keys for their family; genuinely new keys are shared).
 */
import fs from 'node:fs';
import path from 'node:path';
import * as L from './lib.mjs';
import { ENCODERS as CORE } from './encoders.mjs';

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const FAMILY_ENCODERS = {};
const encDir = path.resolve('stardust/scripts/eds/encoders');
if (fs.existsSync(encDir)) for (const f of fs.readdirSync(encDir).filter((x) => x.endsWith('.mjs') && !x.startsWith('_')).sort()) FAMILY_ENCODERS[f.replace(/\.mjs$/, '')] = (await import(path.join(encDir, f))).default || {};
const encodersFor = (family) => {
  const out = { ...CORE };
  for (const [fam, enc] of Object.entries(FAMILY_ENCODERS)) if (fam !== family) for (const [k, v] of Object.entries(enc)) if (!(k in CORE) && !(k in out)) out[k] = v;
  Object.assign(out, FAMILY_ENCODERS[family] || {});
  return out;
};

const chromeMap = fs.existsSync('stardust/rollout/chrome-map.json') ? JSON.parse(fs.readFileSync('stardust/rollout/chrome-map.json', 'utf8')).pages : {};
const famFilter = opt('--family');
const slugs = args.includes('--all') ? L.state.pages.filter((p) => !famFilter || p.archetypeFamily === famFilter).map((p) => p.slug) : args.filter((a) => !a.startsWith('--') && a !== famFilter);
if (!slugs.length) { console.error('usage: convert.mjs <slug…> | --all [--family f]'); process.exit(1); }

function metadataBlock(pg, document, chrome, map) {
  const meta = (n) => document.querySelector(`meta[name="${n}"], meta[property="${n}"]`)?.getAttribute('content') || '';
  const title = document.querySelector('title')?.textContent.trim() || pg.title || '';
  const rows = [['title', title], ['description', meta('description')], ['image', meta('og:image')], ['template', pg.archetypeFamily], ['market', chrome.market], ['source', pg.url]];
  if (meta('og:type')) rows.push(['og:type', meta('og:type')]);
  // listings contract (dynamics #11): news articles carry category + published-time so the query index is rich at import time
  const byline = document.querySelector('.byline, .art-title .meta'); const cat = byline?.querySelector('span'); const time = byline?.querySelector('time');
  if (cat && cat.textContent.trim()) rows.push(['category', cat.textContent.trim()]);
  if (time && time.textContent.trim()) rows.push(['published-time', time.getAttribute('datetime') || time.textContent.trim()]);
  if (chrome.nav && chrome.nav !== '/nav') rows.push(['nav', chrome.nav]);
  if (chrome.footer && chrome.footer !== '/footer') rows.push(['footer', chrome.footer]);
  return L.block('metadata', [], rows.filter(([, v]) => v).map(([k, v]) => [k, L.esc(v)]));
}

let ok = 0; let gaps = 0;
for (const slug of slugs) {
  const pg = L.pageFor(slug); if (!pg) { console.error(`no page ${slug}`); continue; }
  const map = L.mapFor(slug); if (!map || !fs.existsSync(path.join(L.MIGRATED_DIR, map.outputPath))) { console.error(`${slug}: not migrated yet`); continue; }
  const { document } = L.loadMigrated(slug); const ctx = L.makeCtx(slug, map); ctx.family = pg.archetypeFamily;
  const ENCODERS = encodersFor(pg.archetypeFamily);
  const chrome = chromeMap[slug] || { nav: '/nav', footer: '/footer', router: null, market: 'privat' };
  const sections = [L.section([metadataBlock(pg, document, chrome, map)])];
  const modules = [];
  if (chrome.router && document.querySelector('aside.router')) { sections.push(L.section([L.block('fragment', [], [[`<p><a href="${chrome.router}">${chrome.router}</a></p>`]])])); modules.push({ module: 'bank-router', blocks: ['fragment', 'bank-router'] }); }
  const main = document.querySelector('main');
  const roots = [...main.children].flatMap((c) => (c.tagName === 'ARTICLE' && !c.hasAttribute('data-module') ? [...c.children] : [c]));
  for (const root of roots) {
    if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') continue;
    if (root.tagName === 'H1' && root.classList.contains('visually-hidden')) { ctx.hiddenH1 = root; continue; } // market landing: the hidden h1 rides the first block's section
    const key = root.getAttribute('data-module') || root.getAttribute('data-section') || [...root.classList].find((c) => ENCODERS[c]) || null;
    const enc = (key && ENCODERS[key]) || null;
    let r = enc ? enc(root, ctx) : null;
    if (!r) { r = ENCODERS['rich-text'](root, ctx); if (!r) { ctx.gaps.push(`module ${key || root.className} produced no content`); continue; } if (!enc) ctx.gaps.push(`no encoder for module ${key || root.className} (emitted as prose)`); }
    const list = Array.isArray(r.html) ? r.html : [r.html];
    sections.push(...list.filter(Boolean)); modules.push({ module: key || root.className, blocks: r.blocks || [] });
    for (const b of r.blocks || []) ctx.blocks.add(b);
  }
  const out = L.pageDoc(sections);
  const file = path.join(L.CONTENT_DIR, `${map.deliveredPath}.html`);
  L.writeFile(file, out);
  fs.mkdirSync('stardust/rollout/eds-log', { recursive: true });
  fs.writeFileSync(`stardust/rollout/eds-log/${slug}.json`, JSON.stringify({ slug, deliveredPath: map.deliveredPath, file, chrome, modules, blocks: [...ctx.blocks], notes: ctx.notes, gaps: ctx.gaps, rasterise: [...ctx.rasterise], writtenAt: new Date().toISOString() }, null, 1));
  const h1 = (out.match(/<h1[\s>]/g) || []).length;
  console.log(`${slug} → ${file} · ${modules.length} modules · blocks ${[...ctx.blocks].join(',')} · h1 ${h1} · gaps ${ctx.gaps.length}${ctx.gaps.length ? ` (${ctx.gaps.join('; ')})` : ''}`);
  if (ctx.gaps.length) gaps += 1; else ok += 1;
}
console.log(`\nconvert: ${ok} clean · ${gaps} with gaps`);
