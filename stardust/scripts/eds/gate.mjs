#!/usr/bin/env node
/**
 * gate.mjs <slug> [--widths 1440,360] [--eds http://localhost:3020 | https://main--sparebank1-redesign--paolomoz.aem.live] [--proto http://localhost:8820]
 *   [--threshold 10] [--content-only] [--tag <label>]
 * Fidelity gate of the EDS render against the APPROVED PROTOTYPE (redesign flow: the prototype is the reference):
 *   - symmetric stitched captures on both sides (stardust/scripts/replica/stitch-shot.mjs)
 *   - pixel-compare with band breakdown (bar: ≤ threshold %, |Δh| ≤ 8 px)
 *   - chrome crops: header band and footer band ≥ 98 % (crop-compare, footer offsets measured per side)
 *   - content-diff prototype ↔ EDS at 1440 (eds profile): 0 unexplained structural 🔴 (justified patterns: stardust/rollout/justified/{_global,<slug>}.json)
 * Writes stardust/rollout/gates/<slug>[-<tag>]/{proto,eds,diff}-<w>.png + gate.json; exits 2 on failure.
 */
import fs from 'node:fs'; import { execFileSync } from 'node:child_process'; import { chromium } from 'playwright';
const args = process.argv.slice(2); const slug = args.find((a) => !a.startsWith('--') && !/^(\d+,?)+$/.test(a));
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i > -1 ? args[i + 1] : d; };
const contentOnly = args.includes('--content-only'); const widths = contentOnly ? [] : opt('widths', '1440,360').split(',').map(Number);
const EDS = opt('eds', 'http://localhost:3020'); const PROTO = opt('proto', 'http://localhost:8820'); const threshold = +opt('threshold', 10); const tag = opt('tag', null);
const state = JSON.parse(fs.readFileSync('stardust/state.json', 'utf8')); const pm = state.migrate.pageMap.find((p) => p.slug === slug);
if (!pm) { console.error(`no page map entry for ${slug}`); process.exit(1); }
const edsUrl = `${EDS}${pm.deliveredPath}`; const protoUrl = `${PROTO}/${slug}-proposed.html`;
const dir = `stardust/rollout/gates/${slug}${tag ? `-${tag}` : ''}`; fs.mkdirSync(dir, { recursive: true });
const run = (cmd, a, ok = [0]) => { try { return execFileSync(cmd, a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { if (ok.includes(e.status)) return e.stdout; throw new Error(`${cmd} ${a.join(' ')} → exit ${e.status}\n${e.stderr}`); } };
const result = { slug, edsUrl, protoUrl, at: new Date().toISOString(), pixel: {}, chrome: {}, content: null, pass: true };
const browser = widths.length ? await chromium.launch() : null;
for (const w of widths) {
  run('node', ['stardust/scripts/replica/stitch-shot.mjs', protoUrl, `${dir}/proto-${w}.png`, '--width', String(w), '--settle']);
  run('node', ['stardust/scripts/replica/stitch-shot.mjs', edsUrl, `${dir}/eds-${w}.png`, '--width', String(w), '--settle']);
  const out = run('node', ['stardust/scripts/replica/pixel-compare.mjs', `${dir}/proto-${w}.png`, `${dir}/eds-${w}.png`, '--out', `${dir}/diff-${w}.png`, '--threshold', String(threshold), '--json'], [0, 2]);
  const j = JSON.parse(out.slice(out.indexOf('{')));
  const ok = j.pct <= threshold && Math.abs(j.heightDelta || 0) <= 8; if (!ok) result.pass = false;
  result.pixel[w] = { pct: j.pct, heightDelta: j.heightDelta, compared: j.compared, pass: ok, hot: (j.bands || []).filter((b) => b.pct > 15).map((b) => `${b.y0}-${b.y1}:${b.pct}%`) };
  console.log(`[${w}] pixel ${j.pct}%  Δh ${j.heightDelta}  ${ok ? 'OK' : 'FAIL'}  hot bands: ${JSON.stringify(result.pixel[w].hot.slice(0, 6))}`);
  // chrome crops: header (y 0..hh) and footer (per-side y from each page's own footer box)
  const measure = async (url) => { const p = await browser.newPage({ viewport: { width: w, height: w > 1000 ? 900 : 844 } }); await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); await p.evaluate(() => { document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }); }); await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); }); await p.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r; setTimeout(r, 4000); }))))); await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); }); await p.waitForTimeout(400); const m = await p.evaluate(() => { const f = document.querySelector('footer'); const h = document.querySelector('header'); const fr = f.getBoundingClientRect(); return { fy: Math.round(fr.y + window.scrollY), fh: Math.round(fr.height), hh: Math.round(h.getBoundingClientRect().height), doc: document.documentElement.scrollHeight }; }); await p.close(); return m; };
  const mp = await measure(protoUrl); const me = await measure(edsUrl);
  const hh = Math.min(mp.hh, me.hh); const fh = Math.max(1, Math.min(mp.fh, me.fh, mp.doc - mp.fy, me.doc - me.fy) - 2);
  const hdr = run('node', ['stardust/scripts/replica/crop-compare.mjs', `${dir}/proto-${w}.png`, `${dir}/eds-${w}.png`, '--y', '0', '--height', String(hh), '--out', `${dir}/chrome-header-${w}.png`, '--threshold', '2', '--json'], [0, 2]);
  const ftr = run('node', ['stardust/scripts/replica/crop-compare.mjs', `${dir}/proto-${w}.png`, `${dir}/eds-${w}.png`, '--y', String(mp.fy), '--y-b', String(me.fy), '--height', String(fh), '--out', `${dir}/chrome-footer-${w}.png`, '--threshold', '2', '--json'], [0, 2]);
  const jh = JSON.parse(hdr.slice(hdr.indexOf('{'))); const jf = JSON.parse(ftr.slice(ftr.indexOf('{')));
  result.chrome[w] = { header: jh.matchPct, footer: jf.matchPct, headerH: { proto: mp.hh, eds: me.hh }, footerH: { proto: mp.fh, eds: me.fh }, footerY: { proto: mp.fy, eds: me.fy }, doc: { proto: mp.doc, eds: me.doc } };
  if (jh.matchPct < 98 || jf.matchPct < 98) result.pass = false;
  console.log(`[${w}] chrome header ${jh.matchPct}% (h ${mp.hh}/${me.hh}) footer ${jf.matchPct}% (h ${mp.fh}/${me.fh}, y ${mp.fy}/${me.fy}) doc ${mp.doc}/${me.doc}`);
}
if (browser) await browser.close();
const cd = run('node', ['stardust/scripts/diff/content-diff.mjs', protoUrl, edsUrl, '--width', '1440', '--profile', 'eds'], [0, 1, 2]);
fs.writeFileSync(`${dir}/content-diff.txt`, cd);
const jfile = `stardust/rollout/justified/${slug}.json`; const jglobal = 'stardust/rollout/justified/_global.json';
const justified = [...(fs.existsSync(jglobal) ? JSON.parse(fs.readFileSync(jglobal, 'utf8')).patterns : []), ...(fs.existsSync(jfile) ? JSON.parse(fs.readFileSync(jfile, 'utf8')).patterns : [])];
const redLines = cd.split('\n').filter((l) => /^\s*🔴/.test(l));
const unjustified = redLines.filter((l) => !justified.some((p) => new RegExp(p).test(l)));
const amber = (cd.match(/🟡/g) || []).length; const orange = (cd.match(/🟠/g) || []).length;
result.content = { red: unjustified.length, justified: redLines.length - unjustified.length, amber, orange, summary: cd.trim().split('\n').filter((l) => /^\s+(prototype|eds|source|build|editable)/i.test(l)).slice(0, 3) };
if (unjustified.length) result.pass = false;
console.log(`content-diff: 🔴 ${unjustified.length} unexplained (${redLines.length - unjustified.length} justified) 🟡 ${amber} 🟠 ${orange}`); if (unjustified.length) console.log(unjustified.slice(0, 15).join('\n'));
fs.writeFileSync(`${dir}/gate.json`, JSON.stringify(result, null, 2));
console.log(result.pass ? `PASS ${slug}` : `FAIL ${slug}`); process.exit(result.pass ? 0 : 2);
