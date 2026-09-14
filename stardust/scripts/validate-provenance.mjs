#!/usr/bin/env node
// validateProvenance(page) per skills/stardust/reference/state-machine.md § Provenance validation.
// Usage: node stardust/scripts/validate-provenance.mjs [slug ...]   (no args = every page in state.json)
// Named assumption A0 (Flow B journal 2026-09-14): waitMode "slow" is admitted alongside the spec regex —
// Flow A's crawl used `slow` on all 100 pages; every other live-render condition holds.
import fs from 'node:fs';
const state = JSON.parse(fs.readFileSync('stardust/state.json','utf8'));
const want = process.argv.slice(2);
const pages = want.length ? state.pages.filter(p=>want.includes(p.slug)) : state.pages;
const earliest = Date.parse(state.site.extractedAt) - 6*3600e3;
const WAIT = /^(fast|medium|slow|spec|networkidle|domcontentloaded)(\(fallback\))?$/;
let bad = 0;
for (const p of pages) {
  const path = p.currentStatePath;
  const fail = (cond) => { bad++; console.error(`Page \`${p.slug}\` lacks live-render evidence (${cond}) — ${path}\n  → Re-extract with $stardust extract --refresh ${p.slug}`); };
  if (!fs.existsSync(path) || !fs.statSync(path).isFile()) { fail('file exists'); continue; }
  const j = JSON.parse(fs.readFileSync(path,'utf8')); const pr = j._provenance || {};
  if (pr.renderedBy !== 'playwright') fail(`renderedBy=${pr.renderedBy}`);
  const t = Date.parse(pr.fetchedAt); if (!(t>0) || t > Date.now() || t < earliest) fail(`fetchedAt=${pr.fetchedAt}`);
  if (!Number.isInteger(pr.waitMs) || !(pr.waitMs > 0)) fail(`waitMs=${pr.waitMs}`);
  if (!WAIT.test(String(pr.waitMode))) fail(`waitMode=${pr.waitMode}`);
  if (!Number.isInteger(pr.httpStatus) || pr.httpStatus < 200 || pr.httpStatus > 399) fail(`httpStatus=${pr.httpStatus}`);
}
if (bad) { console.error(`Provenance check failed on ${bad} condition(s) across ${pages.length} pages — phase aborted.`); process.exit(1); }
console.log(`Provenance OK on ${pages.length} pages.`);
