#!/usr/bin/env node
/**
 * stardust/scripts/migrate/migrate.mjs — stardust:migrate (Flow B, hands-off).
 *
 * Path A  (approved archetype)  → the approved prototype verbatim (stardust/prototypes/<slug>-proposed.html).
 * Path A′ (directed sibling)    → the family renderer of its archetype (stardust/scripts/proto/pages/<archetype>.mjs)
 *                                 run against the sibling's captured DOM, wrapped in the canon chrome (assemble.mjs).
 * Every page: migrate provenance first in <head>, head metadata (og / canonical / JSON-LD), internal links rewritten
 * through the page map (depth-aware relative paths; non-roster internal links stay absolute to the source origin,
 * flagged data-broken-link), font URLs → assets/fonts, _meta.json sidecar, content-verbatim gate (content-check.mjs).
 * Output path mirrors the source URL literally (/nb/bank/privat.html → nb/bank/privat.html).
 *
 * Usage: node stardust/scripts/migrate/migrate.mjs [slug…] [--all] [--force] [--pin-timestamp <ISO>] [--no-check]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { assemble, loadModule, yaml } from '../proto/assemble.mjs';

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const FORCE = args.includes('--force'); const NOCHECK = args.includes('--no-check'); const NOSTATE = args.includes('--no-state'); // --no-state: workers render + gate without writing state.json/sitemap (the lead runs the full pass)
const PIN = opt('--pin-timestamp');
const OUT = 'stardust/migrated';
const ORIGIN = 'https://www.sparebank1.no';
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const fsha = (f) => (fs.existsSync(f) ? sha(fs.readFileSync(f)) : null);
const esc = (s) => String(s ?? '').replace(/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const state = JSON.parse(fs.readFileSync('stardust/state.json', 'utf8'));
const types = JSON.parse(fs.readFileSync('stardust/current/_page-types.json', 'utf8'));
const design = JSON.parse(fs.readFileSync('DESIGN.json', 'utf8'));
const canon = design.extensions.canon;
const designMdSha = fsha('DESIGN.md'); const designJsonSha = fsha('DESIGN.json');
const canonShas = { header: fsha('stardust/canon/header.html'), footer: fsha('stardust/canon/footer.html'), css: fsha('stardust/canon/canon.css') };
const chromeSha = sha(fs.readFileSync('stardust/scripts/proto/chrome.mjs') + fs.readFileSync('stardust/scripts/proto/data.mjs') + fs.readFileSync('stardust/scripts/proto/assemble.mjs'));

/* ---------- path model ---------- */
// EDS-safe delivered path: lowercase, no .html, `_`→`-`, collapse `-`, no leading/trailing `-` per segment, no `--`
export const safePath = (p) => p.toLowerCase().replace(/\.html$/, '').split('/').map((s) => s.replace(/_/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')).join('/').replace(/\/{2,}/g, '/').replace(/(.)\/$/, '$1') || '/';
const pageMap = state.pages.map((p) => { const sourcePath = new URL(p.url).pathname; return { slug: p.slug, sourceUrl: sourcePath, outputPath: sourcePath.replace(/^\//, ''), deliveredPath: safePath(sourcePath), family: p.archetypeFamily, type: p.type }; });
const byPath = new Map(); for (const m of pageMap) { byPath.set(m.sourceUrl.toLowerCase(), m); byPath.set(m.sourceUrl.toLowerCase().replace(/\.html$/, ''), m); }
const sidecarFor = (outputPath) => outputPath.replace(/\.html$/, '._meta.json');
const depthOf = (outputPath) => outputPath.split('/').length - 1;
const relTo = (fromOut, toOut) => { const r = path.posix.relative(path.posix.dirname(fromOut) || '.', toOut); return /^\.\.?\//.test(r) ? r : `./${r}`; };

/** Normalise a captured href to a site path (or null when external / non-http). */
function sitePath(h) {
  if (!h) return null; let s = h.trim();
  if (/^(#|mailto:|tel:|javascript:|sms:|data:)/i.test(s)) return null;
  if (/^\/\//.test(s)) s = `https:${s}`;
  if (/^https?:/i.test(s)) { try { const u = new URL(s); if (!/^(www\.)?sparebank1\.no$/i.test(u.hostname)) return null; s = u.pathname + u.search + u.hash; } catch { return null; } }
  if (!s.startsWith('/')) return null; // relative (?search=, #x) — leave
  s = s.replace(/^\/content\/sites\/sb1(?=\/)/i, '');
  return s;
}

/** Rewrite every <a href> for a page at `outputPath`; returns { html, broken[] , rewritten }. */
function rewriteLinks(html, outputPath) {
  const broken = []; let rewritten = 0;
  const out = html.replace(/<a\b([^>]*?)\shref="([^"]*)"([^>]*)>/g, (m, pre, href, post) => {
    const sp = sitePath(href); if (sp === null) return m;
    const [p, rest = ''] = sp.split(/(?=[?#])/);
    const hit = byPath.get(p.toLowerCase()) || byPath.get(p.toLowerCase().replace(/\/$/, ''));
    if (hit) { rewritten += 1; return `<a${pre} href="${relTo(outputPath, hit.outputPath)}${esc(rest)}"${post}>`; }
    // known-site page outside the roster: keep resolvable on the source origin (a bounce beats a 404), flagged
    if (!broken.includes(p)) broken.push(p);
    const abs = /^https?:/i.test(href) ? href : `${ORIGIN}${sp.startsWith('/') && !/^https?:/.test(sp) ? '' : ''}${p}${rest}`;
    return `<a${pre} href="${esc(abs)}" data-broken-link="true"${post}>`;
  });
  return { html: out, broken, rewritten };
}

/* ---------- head metadata ---------- */
function headMeta(pj, page, m) {
  const md = design.extensions.metadata || {};
  const og = pj.og || {};
  const rows = [
    `<link rel="canonical" href="${esc(pj.canonical || pj.url)}">`,
    `<meta property="og:site_name" content="${esc(md.siteName || 'SpareBank 1')}">`,
    `<meta property="og:locale" content="${esc(md.locale || 'nb_NO')}">`,
    `<meta property="og:title" content="${esc(og.title || pj.title)}">`,
    `<meta property="og:description" content="${esc((og.description || pj.metaDescription || '').replace(/&nbsp;|\s+/g, ' ').trim())}">`,
    `<meta property="og:image" content="${esc(og.image || md.defaultOgImage || '')}">`,
    `<meta property="og:type" content="${esc(og.type || 'website')}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="robots" content="index,follow">`,
  ];
  const ld = [{ '@context': 'https://schema.org', ...(md.organization || { '@type': 'Organization', name: 'SpareBank 1', url: ORIGIN }) }];
  if (m.family === 'news-article') ld.push({ '@context': 'https://schema.org', '@type': 'Article', headline: og.title || pj.title, image: og.image || undefined, publisher: { '@type': 'Organization', name: md.organization?.name || 'SpareBank 1', logo: md.organization?.logo }, mainEntityOfPage: pj.canonical || pj.url });
  if (m.family === 'faq') ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: pj.title.split('|')[0].trim(), acceptedAnswer: { '@type': 'Answer', text: (pj.metaDescription || '').slice(0, 500) } }] });
  rows.push(...ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`));
  return rows.join('\n');
}

/* ---------- one page ---------- */
async function migrateOne(p, log) {
  const m = pageMap.find((x) => x.slug === p.slug);
  const fam = types.types[p.archetypeFamily]; const archetype = fam?.archetype || p.slug;
  const pathA = (archetype === p.slug || p.fidelityTier === 'archetype') && fs.existsSync(`stardust/prototypes/${p.slug}-proposed.html`); // Path A = the family's approved archetype (status advances to migrated, so never key on status)
  const outFile = path.join(OUT, m.outputPath); const sideFile = path.join(OUT, sidecarFor(m.outputPath));
  const sourceCurrentSha = fsha(`stardust/current/pages/${p.slug}.html`);
  const sourceProposedSha = pathA ? fsha(`stardust/prototypes/${p.slug}-proposed.html`) : null;
  const archetypeSha = pathA ? null : sha((fsha(`stardust/prototypes/${archetype}-proposed.html`) || '') + (fsha(`stardust/scripts/proto/pages/${archetype}.mjs`) || '') + chromeSha);
  const inputs = { designMdSha, designJsonSha, sourceCurrentSha, sourceProposedSha, archetypeSha, canonShas };
  if (!FORCE && fs.existsSync(sideFile)) { try { const prev = JSON.parse(fs.readFileSync(sideFile, 'utf8')); if (JSON.stringify(prev.inputs) === JSON.stringify(inputs) && fs.existsSync(outFile) && (prev.gatesPassed || []).includes('content-verbatim')) return { slug: p.slug, status: 'unchanged' }; } catch { /* re-render */ } }
  const now = PIN || new Date().toISOString();
  let html; let page = null; let renderBranch;
  if (pathA) {
    renderBranch = 'A'; html = fs.readFileSync(`stardust/prototypes/${p.slug}-proposed.html`, 'utf8');
    if (/data-placeholder/.test(html)) throw new Error('placeholder gate: [data-placeholder] present in the approved prototype');
  } else {
    renderBranch = "A'";
    const mod = await loadModule(archetype);
    const provenanceHeader = ({ slug, pj }) => `<!-- stardust:provenance
  writtenBy:         stardust:migrate (Path A′ — family renderer stardust/scripts/proto/pages/${archetype}.mjs forked onto the sibling's captured DOM; chrome = canon)
  writtenAt:         ${now}
  page:              ${slug}
  pageUrl:           ${pj.url}
  archetype:         ${archetype}
  againstDirection:  stardust/direction.md (Active 2026-09-14T21:10:00Z)
  fidelityTier:      sibling
  iaFidelity:        verbatim
  stardustVersion:   0.20.0
-->`;
    ({ html, page } = assemble(p.slug, mod, { archetype, provenanceHeader }));
    if (page.provenance?.unsourcedContent?.length) throw new Error(`placeholder gate: unsourcedContent ${JSON.stringify(page.provenance.unsourcedContent)}`);
  }
  const pj = JSON.parse(fs.readFileSync(`stardust/current/pages/${p.slug}.json`, 'utf8'));
  // links → page map (depth-aware relative), fonts → bundled assets
  const prefix = depthOf(m.outputPath) ? '../'.repeat(depthOf(m.outputPath)) : './';
  const lr = rewriteLinks(html, m.outputPath); html = lr.html;
  html = html.replace(/url\("fonts\//g, `url("${prefix}assets/fonts/`);
  // head: migrate provenance first, metadata + JSON-LD before </head>
  const modules = [...html.matchAll(/data-module="([^"]+)"/g)].map((x) => x[1]).filter((v, i, a) => a.indexOf(v) === i);
  const mig = `<!-- stardust:migrate
  writtenBy:        stardust:migrate
  writtenAt:        ${now}
  page:             ${p.slug}
  slug:             ${p.slug}
  pagePath:         migrated/${m.outputPath}
  deliveredPath:    ${m.deliveredPath}
  renderBranch:     ${renderBranch}
  template:         ${p.archetypeFamily}
  archetypePath:    stardust/prototypes/${archetype}-proposed.html
  archetypeSha:     ${archetypeSha || sourceProposedSha}
  sourceProposed:   ${pathA ? `stardust/prototypes/${p.slug}-proposed.html` : 'null'}
  sourceCurrent:    stardust/current/pages/${p.slug}.json
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  designMd:         DESIGN.md (sha: ${designMdSha})
  designJson:       DESIGN.json (sha: ${designJsonSha})
  canonShas:        header:${canonShas.header} footer:${canonShas.footer} css:${canonShas.css}
  decisionTrace:    ${path.basename(sideFile)}
  brokenInternalLinks: ${lr.broken.length}
  stardustVersion:  0.20.0
-->`;
  html = html.replace(/<head>\n?/, `<head>\n${mig}\n`);
  html = html.replace(/<\/head>/, `${headMeta(pj, page, m)}\n</head>`);
  // mobile-adapt audit (mandatory, Path A / A′)
  const adapt = { viewport: /<meta name="viewport" content="width=device-width/.test(html), media: (html.match(/@media[^{]*max-width:\s*(\d+)px/g) || []).length, narrowest: Math.min(...[...html.matchAll(/@media[^{]*max-width:\s*(\d+)px/g)].map((x) => +x[1])) };
  if (!adapt.viewport || !adapt.media || adapt.narrowest > 640) throw new Error(`mobile-adapt audit failed ${JSON.stringify(adapt)}`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length; if (h1s !== 1) throw new Error(`h1 count ${h1s}`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true }); fs.writeFileSync(outFile, html);
  // content-verbatim gate (every captured heading / paragraph / link / image must be present)
  const gates = ['mobile-adapt', 'one-h1', 'placeholder-gate'];
  let check = null;
  if (!NOCHECK) {
    try { execFileSync('node', ['stardust/scripts/content-check.mjs', p.slug, '--file', outFile, '--out', `stardust/validation/${p.slug}/migrate-content-check.json`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); check = 'PASS'; gates.push('content-verbatim', 'content-count'); } catch (e) { check = `FAIL\n${(e.stdout || '').split('\n').slice(0, 12).join('\n')}`; }
  }
  const meta = {
    slug: p.slug, type: p.type, template: p.archetypeFamily, archetype, renderBranch, fidelityTier: pathA ? 'archetype' : 'sibling', archetypeSource: pathA ? null : archetype,
    outputPath: m.outputPath, deliveredPath: m.deliveredPath, sourceUrl: p.url, modules, chrome: { router: /data-module="bank-router"/.test(html), market: /\/nb\/bank\/bedrift/.test(p.url) ? 'bedrift' : /\/nb\/bank\/om-oss/.test(p.url) ? 'om-oss' : 'privat', clientlib: p.clientlib },
    canonShas, inputs, deviations: page?.provenance?.canonDeviations || p.canonDeviations || [], migrationDecisions: [{ kind: 'media-reuse', note: 'photos/illustrations stay on the public www.sparebank1.no DAM (Mode A image-reuse; SVG > 40 KB rasterised at rollout)' }, ...(lr.broken.length ? [{ kind: 'bounce-links', count: lr.broken.length, note: 'internal links outside the 100-page roster stay absolute to the source origin (a bounce beats a 404)' }] : [])],
    contentDeviations: [], brokenInternalLinks: lr.broken, linksRewritten: lr.rewritten,
    metadata: { title: pj.title, description: pj.metaDescription, canonical: pj.canonical, ogImage: pj.og?.image || null },
    audit: { adapt }, gatesPassed: gates, contentCheck: check, migratedAt: now, designMdSha, designJsonSha, sourceCurrentSha, sourceProposedSha, archetypeSha, assetsBundled: 3,
  };
  fs.writeFileSync(sideFile, JSON.stringify(meta, null, 1));
  return { slug: p.slug, status: check && check.startsWith('FAIL') ? 'content-fail' : 'migrated', renderBranch, check, broken: lr.broken.length };
}

/* ---------- run ---------- */
const want = args.filter((a) => !a.startsWith('--') && a !== PIN);
const inScope = state.pages.filter((p) => (want.length ? want.includes(p.slug) : (args.includes('--all') || ['directed', 'prototyped', 'approved', 'migrated'].includes(p.status))) && (args.includes('--all') || !p.stale));
console.log(`migrate: ${inScope.length} pages in scope (${inScope.filter((p) => p.status === 'approved').length} Path A, ${inScope.filter((p) => p.status !== 'approved').length} Path A′)`);
const results = [];
for (const p of inScope) {
  try { const r = await migrateOne(p); results.push(r); console.log(`${r.status.padEnd(12)} ${r.renderBranch || ''} ${p.slug}${r.broken ? ` (bounce links ${r.broken})` : ''}${r.check && r.check.startsWith('FAIL') ? `\n${r.check}` : ''}`); }
  catch (e) { results.push({ slug: p.slug, status: 'failed', error: String(e.message || e).split('\n')[0] }); console.log(`FAILED       ${p.slug}: ${String(e.message || e).split('\n')[0].slice(0, 300)}`); }
}
if (NOSTATE) { const c0 = (st) => results.filter((r) => r.status === st).length; console.log(`\nmigrate (no-state): ${c0('migrated')} migrated · ${c0('unchanged')} unchanged · ${c0('content-fail')} content-fail · ${c0('failed')} failed`); process.exit(c0('failed') + c0('content-fail') ? 1 : 0); }
// sitewide assets (fonts, logo, favicons already staged by prepare-migration Phase 4)
for (const f of ['SpareBank1-Title-Medium-Web.woff2', 'SpareBank1-Medium-Web.woff2', 'SpareBank1-Regular-Web.woff2']) { const src = `stardust/prototypes/fonts/${f}`; const dst = `${OUT}/assets/fonts/${f}`; if (fs.existsSync(src) && !fs.existsSync(dst)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); } }
// robots + sitemap
fs.writeFileSync(`${OUT}/robots.txt`, 'User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n');
const prio = { landing: '1.0', program: '0.7', static: '0.7', listing: '0.6', article: '0.5', form: '0.4' };
const ok = new Set(results.filter((r) => r.status === 'migrated' || r.status === 'unchanged').map((r) => r.slug));
fs.writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageMap.filter((m) => ok.has(m.slug) || fs.existsSync(path.join(OUT, m.outputPath))).map((m) => `  <url><loc>/${m.outputPath}</loc><priority>${prio[m.type] || '0.5'}</priority></url>`).join('\n')}\n</urlset>\n`);
// state
const now = PIN || new Date().toISOString();
for (const r of results) {
  const p = state.pages.find((x) => x.slug === r.slug); const m = pageMap.find((x) => x.slug === r.slug);
  if (r.status === 'migrated') { p.migratedPath = `${OUT}/${m.outputPath}`; if (p.status !== 'migrated') p.history.push({ status: 'migrated', at: now }); p.status = 'migrated'; p.stale = false; p.fidelityTier = r.renderBranch === 'A' ? 'archetype' : 'sibling'; p.archetypeSource = r.renderBranch === 'A' ? null : (types.types[p.archetypeFamily]?.archetype || null); p.gatesPassed = [...new Set([...(p.gatesPassed || []), 'content-verbatim', 'content-count', 'mobile-adapt'])]; }
}
state.migrate = { selfContained: true, outputDir: OUT, pageMap, totalAssetsBundled: 3, bundledAssets: ['assets/fonts/SpareBank1-Title-Medium-Web.woff2', 'assets/fonts/SpareBank1-Medium-Web.woff2', 'assets/fonts/SpareBank1-Regular-Web.woff2', 'assets/logo.svg', 'assets/favicon.png'], missingAssets: [], cleanedAssets: [], mediaPolicy: 'source-origin URLs (Mode A image-reuse); SVG > 40 KB rasterised to DA media at rollout', lastRunAt: now };
state.lastRun = { skill: 'stardust:migrate', at: now, migrated: results.filter((r) => r.status === 'migrated').length, unchanged: results.filter((r) => r.status === 'unchanged').length, failures: results.filter((r) => r.status !== 'migrated' && r.status !== 'unchanged').map((r) => ({ slug: r.slug, status: r.status, error: r.error || (r.check || '').split('\n').slice(0, 6).join(' | ') })) };
state._provenance = { ...state._provenance, writtenBy: 'stardust:migrate', writtenAt: now };
fs.writeFileSync('stardust/state.json', JSON.stringify(state, null, 1));
const c = (s) => results.filter((r) => r.status === s).length;
console.log(`\nmigrate complete: ${c('migrated')} migrated · ${c('unchanged')} unchanged · ${c('content-fail')} content-fail · ${c('failed')} failed · output ${OUT}/`);
process.exit(c('failed') + c('content-fail') ? 1 : 0);
