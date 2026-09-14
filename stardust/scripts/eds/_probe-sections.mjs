#!/usr/bin/env node
// _probe-sections.mjs <url> [width] — top/height of header, router, every main section (with its first heading) and footer; for aligning EDS vs prototype top-down
import { chromium } from 'playwright';
const [url, w = '1440'] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +w > 1000 ? 900 : 844 } });
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); }); await p.waitForTimeout(500);
const rows = await p.evaluate(() => { const out = []; const add = (el, label) => { const r = el.getBoundingClientRect(); out.push({ label, top: Math.round(r.top + scrollY), h: Math.round(r.height) }); };
  add(document.querySelector('header'), 'header'); const aside = document.querySelector('aside.router'); if (aside && !aside.closest('main')) add(aside, 'router');
  document.querySelectorAll('main > section, main > article > section, main > .section, main > article').forEach((s) => { if (s.tagName === 'ARTICLE' && s.querySelector(':scope > section')) return; const h = s.querySelector('h1,h2,h3'); add(s, (s.dataset.module || s.dataset.section || [...s.classList].filter((c) => !/^(section|movement|container)$/.test(c)).slice(0, 2).join('.')) + (h ? ' "' + h.textContent.trim().slice(0, 28) + '"' : '')); });
  add(document.querySelector('footer'), 'footer'); out.push({ label: 'DOC', top: 0, h: document.documentElement.scrollHeight }); return out; });
console.log(url); for (const r of rows) console.log(String(r.top).padStart(6), String(r.h).padStart(5), r.label); await b.close();
