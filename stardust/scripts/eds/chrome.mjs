#!/usr/bin/env node
/**
 * chrome.mjs — author the /nav*, /footer* and /fragments/bank-router DA documents from the canon chrome data
 * (stardust/scripts/proto/data.mjs over the captured pages) and write stardust/rollout/chrome-map.json (slug → { nav, footer, router }).
 *   node stardust/scripts/eds/chrome.mjs
 * /nav contract (blocks/header): section 1 brand <p><a><img logo></a></p> · section 2 audience <ul> (Privat · Bedrift · Om oss) ·
 *   section 3 market <ul> (the market's sections; may be empty on the frontend-clientlib pages that captured none — E2) ·
 *   section 4 tools: <p><a href="?search=">Søk</a></p> · <p><em><a>Bli kunde</a></em></p> · <p><em><strong><a>Logg inn</a></strong></em></p>
 * /footer contract (blocks/footer): section `contact` h2 + intro link + <ul> five channels (name link + <br> sub) · five `contact-panel`
 *   sections (verbatim captured content: h3 top line, nested bank/market lists, link lists) · section `columns` (h2 + ul ×3, social with icons)
 *   · section `small` (legal <ul>) · section `address` (<p>). Frontend-clientlib pages have no contact row (their footer carries columns only).
 * /fragments/bank-router (blocks/bank-router): heading · lede · [label | placeholder] · position · all · one row per bank [name link | tagline].
 * E1: the regional "Ring oss" bank links point at each bank's market landing (the captured hrefs were the regional alternate of the CURRENT page).
 */
import fs from 'node:fs'; import crypto from 'node:crypto';
import * as L from './lib.mjs';
import { loadDoc, headerData, routerData, footerData, frontendFooter } from '../proto/data.mjs';
const { esc, section, pageDoc, writeFile, href } = L;

const hash = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);
const marketOf = (p) => (/\/nb\/bank\/bedrift/.test(p.url) ? 'bedrift' : /\/nb\/bank\/om-oss/.test(p.url) ? 'om-oss' : 'privat');
const LOGO = 'https://www.sparebank1.no/content/dam/SB1/nettsider/logo.svg';
const CTX = { map: null };
const untrack = (h) => (h || '').replace(/\?icid=[^#]*/, '');
const link = (a) => `<a href="${esc(href(untrack(a.href), CTX))}">${esc(a.t)}</a>`;
const SOCIAL = { facebook: 'https://www.sparebank1.no/content/dam/SB1/ikoner/SoMe/facebook-hvit.svg', linkedin: 'https://www.sparebank1.no/content/dam/SB1/ikoner/SoMe/linkedin-hvit.svg', youtube: 'https://www.sparebank1.no/content/dam/SB1/ikoner/SoMe/youtube-hvit.svg', instagram: 'https://www.sparebank1.no/content/dam/SB1/ikoner/SoMe/instagram-hvit.svg' };
const socialIcon = (l) => l.icon || Object.entries(SOCIAL).find(([k]) => new RegExp(k, 'i').test(l.href || ''))?.[1] || null;

function navDoc(h) {
  const brand = section([`<p><a href="${esc(href(h.logoHref, CTX))}"><img src="${LOGO}" alt="${esc(h.logoAlt || 'SpareBank 1')}"></a></p>`]);
  const audience = section([`<ul>${h.audience.map((a) => `<li>${link(a)}</li>`).join('')}</ul>`]);
  const market = section([h.market.length ? `<ul>${h.market.map((a) => `<li>${link(a)}</li>`).join('')}</ul>` : '<p></p>']);
  const tools = section([
    `<p><a href="${esc(h.searchHref.startsWith('?') ? `https://www.sparebank1.no/nb/bank/privat/kundeservice.html${h.searchHref}` : href(h.searchHref, CTX))}">${esc(h.searchLabel || 'Søk')}</a></p>`,
    h.bliKunde ? `<p><em><a href="${esc(href(untrack(h.bliKunde.href), CTX))}">${esc(h.bliKunde.t)}</a></em></p>` : '',
    `<p><em><strong><a href="${esc(h.login.href)}">${esc(h.login.t)}</a></strong></em></p>`,
  ]);
  return pageDoc([brand, audience, market, tools]);
}

// E1: regional alternates → the bank's market landing on the source host
const bankHome = (h, market) => { const m = (h || '').match(/^(?:https:\/\/www\.sparebank1\.no)?\/(nb|nn)\/([a-z-]+)\//); return m ? `https://www.sparebank1.no/${m[1]}/${m[2]}/${market === 'bedrift' ? 'bedrift' : 'privat'}.html` : href(h, CTX); };
function footerDoc(f, market) {
  const secs = [];
  // frontend-clientlib footers: a heading-less column is the legal-links strip (the prototype modules filter columns to those with an h2) → it feeds `small`
  const headless = f.columns.filter((c) => !c.heading && c.links.length); if (headless.length && !f.small.length) f = { ...f, small: headless.flatMap((c) => c.links) };
  f = { ...f, columns: f.columns.filter((c) => c.heading) };
  if (f.tabs.length) {
    const chan = f.tabs.map((t, i) => `<li><a href="#kontakt-${i + 1}">${esc(t.name)}</a>${t.sub ? `<br>${esc(t.sub)}` : ''}</li>`).join('');
    secs.push(section([`<h2>${esc(f.contactHeading)}</h2>`, f.contactLink ? `<p><a href="${esc(href(f.contactLink.href, CTX))}">${esc(f.contactLink.t)}</a></p>` : '', `<ul>${chan}</ul>`], { style: 'contact' }));
    for (const t of f.tabs) {
      const p = t.panel; let body = '';
      if (p.top) body += `<h3>${esc(p.top.heading)} <a href="${esc(p.top.tel)}">${esc(p.top.number)}</a></h3><p>${p.top.info.map(esc).join('<br>')}${(p.top.links || []).map((l) => `<br>${esc(l.label)} <a href="${esc(l.tel)}">${esc(l.t)}</a>`).join('')}</p>`;
      if (p.banks.length && p.banks[0].markets.length) body += `<ul>${p.banks.map((b) => `<li><a href="${esc(bankHome(b.href, market))}">${esc(b.name)}</a><ul>${b.markets.map((m) => `<li><strong>${esc(m.market)}</strong> <a href="${esc(m.tel)}">${esc(m.number)}</a> Fra utland: <a href="${esc(m.abroadTel)}">${esc(m.abroad)}</a> · ${esc(m.hours)}</li>`).join('')}</ul></li>`).join('')}</ul>`;
      else if (p.banks.length) body += `<ul>${p.banks.map((b) => `<li><a href="${esc(bankHome(b.href, market))}">${esc(b.name)}</a></li>`).join('')}</ul>`;
      else if (p.links.length) body += `<ul>${p.links.map((l) => `<li><a href="${esc(bankHome(l.href, market))}">${esc(l.t)}</a></li>`).join('')}</ul>`;
      if (!p.top && p.heading && p.heading !== t.name) body = `<h3>${esc(p.heading)}</h3>${body}`;
      if (!body) body = '<p></p>';
      secs.push(section([body], { style: 'contact-panel' }));
    }
  }
  const cols = f.columns.filter((c) => c.links.length).map((c) => { const social = /sosiale/i.test(c.heading); return `${c.heading ? `<h2>${esc(c.heading)}</h2>` : ''}<ul>${c.links.map((l) => { const ic = social ? socialIcon(l) : l.icon; return `<li><a href="${esc(href(l.href, CTX))}">${ic ? `<img src="${esc(L.mediaUrl(ic))}" alt=""> ` : ''}${esc(l.t)}</a></li>`; }).join('')}</ul>`; });
  secs.push(section(cols, { style: 'columns' }));
  if (f.small.length) secs.push(section([`<ul>${f.small.map((l) => `<li><a href="${esc(href(l.href, CTX))}">${esc(l.t)}</a></li>`).join('')}</ul>`], { style: 'small' }));
  if (f.address) secs.push(section([`<p>${esc(f.address)}</p>`], { style: 'address' }));
  return pageDoc(secs);
}

function routerDoc(r, market) {
  const rows = [[`<p>${esc(r.heading)}</p>`], [`<p>${esc(r.lede)}</p>`], [`<p>${esc(r.label)}</p>`, `<p>${esc(r.placeholder)}</p>`], [`<p>${esc(r.position)}</p>`], [`<p>${esc(r.all)}</p>`],
    ...r.banks.map((b) => [`<p><a href="${esc(bankHome(b.href, market))}">${b.html.replace(/<br>/g, ' ')}</a></p>`, `<p>${esc(b.tagline)}</p>`])];
  return pageDoc([section([L.block('bank-router', [], rows)], { style: 'router' })]);
}

const variants = { nav: {}, footer: {} }; const pages = {}; const routers = {}; let routerFrom = null;
const order = { privat: 0, bedrift: 1, 'om-oss': 2 };
const sorted = [...L.state.pages].sort((a, b) => order[marketOf(a)] - order[marketOf(b)] || (a.fidelityTier === 'archetype' ? -1 : 1) || a.slug.localeCompare(b.slug));
for (const p of sorted) {
  const doc = loadDoc(p.slug); const market = marketOf(p); const fe = p.clientlib === 'frontend';
  const h = headerData(doc); let f = footerData(doc); if (!f || !f.columns.length) f = frontendFooter(doc) || f;
  const nd = navDoc(h); const nk = hash(nd);
  if (!variants.nav[nk]) { const base = h.market.length === 0 ? `/nav-minimal${market === 'privat' ? '' : `-${market}`}` : market === 'privat' ? '/nav' : `/nav-${market}`; variants.nav[nk] = { path: base, doc: nd, pages: [] }; }
  variants.nav[nk].pages.push(p.slug);
  const fd = footerDoc(f, market); const fk = hash(fd);
  if (!variants.footer[fk]) { const base = !f.tabs.length ? `/footer-frontend${market === 'privat' ? '' : `-${market}`}` : market === 'privat' ? (p.archetypeFamily === 'kundeservice-hub' ? '/footer-kundeservice' : '/footer') : `/footer-${market}`; variants.footer[fk] = { path: base, doc: fd, pages: [] }; }
  variants.footer[fk].pages.push(p.slug);
  const r = routerData(doc); const rm = market; // privat · bedrift · om-oss (the om-oss pages carry a different heading/lede)
  if (r) { const rd = routerDoc(r, rm); if (!routers[rm]) { routers[rm] = { doc: rd, from: p.slug }; routerFrom = routerFrom || p.slug; } else if (rd !== routers[rm].doc) console.warn(`⚠ router differs on ${p.slug} (using ${routers[rm].from})`); }
  pages[p.slug] = { nav: null, footer: null, router: r ? `/fragments/bank-router${rm === 'privat' ? '' : `-${rm}`}` : null, market, clientlib: p.clientlib };
}
for (const group of [variants.nav, variants.footer]) { const seen = {}; for (const v of Object.values(group)) { if (seen[v.path]) { seen[v.path] += 1; v.path = `${v.path}-${seen[v.path]}`; } else seen[v.path] = 1; } }
for (const [slug, o] of Object.entries(pages)) { o.nav = Object.values(variants.nav).find((v) => v.pages.includes(slug)).path; o.footer = Object.values(variants.footer).find((v) => v.pages.includes(slug)).path; }
for (const v of [...Object.values(variants.nav), ...Object.values(variants.footer)]) writeFile(`${L.CONTENT_DIR}${v.path}.html`, v.doc);
for (const [rm, r] of Object.entries(routers)) writeFile(`${L.CONTENT_DIR}/fragments/bank-router${rm === 'privat' ? '' : `-${rm}`}.html`, r.doc);
fs.mkdirSync('stardust/rollout', { recursive: true });
fs.writeFileSync('stardust/rollout/chrome-map.json', JSON.stringify({ writtenAt: new Date().toISOString(), routerFrom, variants: { nav: Object.values(variants.nav).map((v) => ({ path: v.path, pages: v.pages })), footer: Object.values(variants.footer).map((v) => ({ path: v.path, pages: v.pages })) }, pages }, null, 1));
console.log(`nav: ${Object.values(variants.nav).map((v) => `${v.path} (${v.pages.length})`).join(', ')}\nfooter: ${Object.values(variants.footer).map((v) => `${v.path} (${v.pages.length})`).join(', ')}\nrouter fragment from ${routerFrom}; ${Object.values(pages).filter((o) => o.router).length} pages carry the router`);
