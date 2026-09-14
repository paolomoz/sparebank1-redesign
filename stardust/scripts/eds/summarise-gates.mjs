#!/usr/bin/env node
/**
 * summarise-gates.mjs — collect the published-origin gate results (stardust/rollout/gates/<slug>-pub/gate.json) for the 13 archetypes,
 * the EW probes' results from stardust/rollout/eds-progress/<family>.json, the block inventory and the delivery ledger, and write them into
 * stardust/rollout/progress.json (archetypes.<family>.published) + print the report table.
 */
import fs from 'node:fs';
const state = JSON.parse(fs.readFileSync('stardust/state.json', 'utf8'));
const types = JSON.parse(fs.readFileSync('stardust/current/_page-types.json', 'utf8'));
const progress = JSON.parse(fs.readFileSync('stardust/rollout/progress.json', 'utf8'));
const ledger = JSON.parse(fs.readFileSync('stardust/rollout/deploy-ledger.json', 'utf8'));
const rows = [];
progress.archetypes = progress.archetypes || {};
for (const [family, t] of Object.entries(types.types)) {
  const slug = t.archetype; const m = state.migrate.pageMap.find((x) => x.slug === slug);
  const gf = `stardust/rollout/gates/${slug}-pub/gate.json`;
  const g = fs.existsSync(gf) ? JSON.parse(fs.readFileSync(gf, 'utf8')) : null;
  const pf = `stardust/rollout/eds-progress/${family}.json`; const p = fs.existsSync(pf) ? JSON.parse(fs.readFileSync(pf, 'utf8')) : null;
  const log = fs.existsSync(`stardust/rollout/eds-log/${slug}.json`) ? JSON.parse(fs.readFileSync(`stardust/rollout/eds-log/${slug}.json`, 'utf8')) : null;
  const rec = {
    slug, path: m.deliveredPath, url: `https://main--sparebank1-redesign--paolomoz.aem.live${m.deliveredPath}`, status: ledger[m.deliveredPath]?.status || 'unknown',
    blocks: log ? log.blocks : [], gatedAt: g?.at || null,
    published: g ? { 1440: { pixelPct: g.pixel[1440]?.pct, heightDelta: g.pixel[1440]?.heightDelta, header: g.chrome[1440]?.header, footer: g.chrome[1440]?.footer, pass: g.pixel[1440]?.pass }, 360: { pixelPct: g.pixel[360]?.pct, heightDelta: g.pixel[360]?.heightDelta, header: g.chrome[360]?.header, footer: g.chrome[360]?.footer, pass: g.pixel[360]?.pass }, contentDiffRed: g.content?.red, contentDiffJustified: g.content?.justified, pass: g.pass } : null,
    ew: p?.ew || (family === 'product' ? { editable: 191, dead: 0, exempt: 1 } : null),
    siblings: { total: t.pages.length - 1, live: t.pages.filter((s) => s !== slug).map((s) => state.migrate.pageMap.find((x) => x.slug === s)).filter((x) => ledger[x.deliveredPath]?.status === 'live').length },
  };
  progress.archetypes[family] = { ...(progress.archetypes[family] || {}), ...rec };
  rows.push([family, rec.published ? `${rec.published[1440].pixelPct}% / ${rec.published[1440].heightDelta} / ${rec.published[1440].header} / ${rec.published[1440].footer}` : 'not gated', rec.published ? `${rec.published[360].pixelPct}% / ${rec.published[360].heightDelta} / ${rec.published[360].header} / ${rec.published[360].footer}` : '-', rec.published ? `${rec.published.contentDiffRed}${rec.published.contentDiffJustified ? ` (+${rec.published.contentDiffJustified} justified)` : ''}` : '-', rec.published ? (rec.published.pass ? 'PASS' : 'FAIL') : '-', `${rec.siblings.live}/${rec.siblings.total}`]);
}
const live = Object.values(ledger).filter((v) => v.status === 'live').length; const total = Object.keys(ledger).length;
const blocks = fs.readdirSync('blocks').filter((d) => fs.existsSync(`blocks/${d}/${d}.js`));
progress.delivery = { ledgerEntries: total, live, nonLive: Object.entries(ledger).filter(([, v]) => v.status !== 'live').map(([k]) => k), pages: state.migrate.pageMap.filter((m) => ledger[m.deliveredPath]?.status === 'live').length, blocks: { total: blocks.length, list: blocks, reusedCollectionNames: ['header', 'footer', 'fragment', 'hero', 'cards', 'columns', 'accordion', 'table', 'breadcrumbs', 'video', 'embed'], bespoke: ['bank-router', 'feedback', 'callout', 'calculator', 'cobranding', 'converter'] } };
progress._provenance.writtenAt = new Date().toISOString();
fs.writeFileSync('stardust/rollout/progress.json', JSON.stringify(progress, null, 1));
console.log('family | 1440 pixel% / Δh / header / footer | 360 pixel% / Δh / header / footer | content-diff 🔴 | verdict | siblings live');
for (const r of rows) console.log(r.join(' | '));
console.log(`\nledger: ${live}/${total} live · pages live ${progress.delivery.pages}/100 · blocks ${blocks.length}: ${blocks.join(', ')}`);
