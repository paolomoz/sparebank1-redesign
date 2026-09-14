/**
 * stardust/scripts/eds/encoders/theme.mjs — theme family (archetype nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html).
 * Overrides for THIS family: page-title (intro rhythm 16/64), content-columns (sheets | index | cols | rail), split-media (resident flush-top,
 * media-right → text-first, SVG media → illu), card-rail (generic rail: every heading/CTA/meta of an item, lede, grid-N; rec-grid → papers),
 * callout (+ `offer` when it ends in a pill). New shared keys: cta-row (icon · line · pill → default content, `claim` section style), quick-links.
 * Group CSS: blocks/columns/columns-theme.css (sheets · index · resident · prevention · promo-2), blocks/cards/cards-theme.css (papers),
 * styles/styles-theme.css (claim · intro-backlink).
 */
import { parseHTML } from 'linkedom';
import * as L from '../lib.mjs';
import { cardRail, splitMedia, pageTitle, callout, promoRow } from '../encoders.mjs';

const { esc, q, qa, cls, inline, prose, ctas, ctaHtml, pic, block, section, styleOf, paperOf, list } = L;

/** Replace (or add) the section-metadata `style` of a section html produced by L.section(). */
export function restyle(html, style) {
  const i = html.lastIndexOf('<div class="section-metadata">');
  const body = i > -1 ? html.slice(0, i) : html.slice(0, -'</div>'.length);
  return `${body}${L.sectionMeta({ style })}</div>`;
}

/** The movement's section-title h2 as default content (same rule as the core sectionHead, which is not exported). */
export function head(root, ctx) {
  const h = q(root, ':scope > .container > h2.section-title, :scope > .container > .section-title, :scope > .container > h2');
  return h ? `<h2>${inline(h, ctx)}</h2>` : '';
}

/** Preserve authored non-breaking spaces as entities (lib.inline's whitespace collapse treats \u00a0 as a space). */
function keepNbsp(el) {
  const walk = (n) => { for (const c of n.childNodes) { if (c.nodeType === 3) { if (/\u00a0/.test(c.textContent)) c.textContent = c.textContent.replace(/\u00a0/g, '&nbsp;'); } else if (c.nodeType === 1) walk(c); } };
  walk(el);
}

/* ---- content-columns: sheets (two illustrated comparison sheets with link lists) ---- */
export function sheets(root, ctx) {
  const wrap = q(root, '.sheets'); if (!wrap) return null;
  const items = qa(wrap, ':scope > article, :scope > .sheet'); if (!items.length) return null;
  const cells = items.map((s) => {
    keepNbsp(s); // the sheets' verbatim trailing non-breaking spaces wrap like the prototype's (lib.inline collapses \u00a0 as whitespace)
    const img = q(s, ':scope > img, :scope > figure img, :scope > picture img');
    let out = img ? pic(img, ctx) : '';
    for (const n of s.children) { if (n === img || n.contains(img)) continue; out += prose({ childNodes: [n] }, ctx); }
    return out;
  });
  const parts = [head(root, ctx), block('columns', ['sheets'], [cells])];
  for (const p of qa(root, ':scope > .container > p')) { const s = inline(p, ctx).trim(); if (!s) continue; parts.push(/class="btn|class="link-more/.test(p.innerHTML) ? ctas(p, ctx) : `<p>${s}</p>`); }
  ctx.notes.push('content-columns (sheets): columns (sheets) — one row, one cell per sheet [illustration, h2, paragraphs, link list]; the trailing compare link is default content');
  return { html: section(parts, { style: styleOf(paperOf(root)) }), blocks: ['columns'] };
}

/* ---- content-columns: index (two link columns under a hairline — market landing) ---- */
export function index(root, ctx) {
  const cols = qa(root, '.index-grid > .index-col, .index-col'); if (!cols.length) return null;
  const cells = cols.map((c) => prose(c, ctx));
  ctx.notes.push('content-columns (index): columns (index) — one row, one cell per column [h2 label, link list]; hairline-top section');
  return { html: section([block('columns', ['index'], [cells])], { style: styleOf(paperOf(root), 'hairline-top') }), blocks: ['columns'] };
}

export function contentColumns(root, ctx) { return sheets(root, ctx) || index(root, ctx) || cols(root, ctx) || rail(root, ctx); }

/* ---- card rows (order-preserving superset of the core cardRows: every heading, text, meta, CTA and link list of the item, in DOM order) ---- */
const linksOf = (el, ctx) => { const as = qa(el, 'a'); return as.length ? `<ul>${as.map((a) => `<li><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></li>`).join('')}</ul>` : ''; };
/** A canon disclosure (details.disclosure: summary label + a prose of links) → the label as a paragraph + a visible link list (D5; no nested widget in a cell). */
function disclosure(d, ctx) {
  const sum = q(d, 'summary'); const body = [...d.children].filter((c) => c !== sum);
  let out = sum ? `<p>${inline(sum, ctx).trim()}</p>` : '';
  for (const b of body) { if (q(b, 'a') && !q(b, 'h1, h2, h3, ul, ol') && txtOnlyLinks(b)) out += linksOf(b, ctx); else out += prose(b, ctx); }
  ctx.notes.push('disclosure: details.disclosure flattened — the summary label as text, its links as a visible list');
  return out;
}
const txtOnlyLinks = (el) => { const t = el.textContent.replace(/\s+/g, ''); const a = qa(el, 'a').map((x) => x.textContent.replace(/\s+/g, '')).join(''); return t === a; };
export function itemBody(li, ctx, { skipImg } = {}) {
  let body = '';
  for (const n of li.children) {
    const t = n.tagName.toLowerCase();
    if (t === 'img' || t === 'picture' || t === 'figure') { if (!skipImg) body += pic(q(n, 'img') || n, ctx); continue; }
    if (/^h[1-6]$/.test(t)) { const a = q(n, 'a'); body += a && txtOnlyLinks(n) ? `<${t}><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></${t}>` : `<${t}>${inline(n, ctx).trim()}</${t}>`; continue; }
    if (t === 'p') {
      if (cls(n).includes('meta')) { const runs = [...n.childNodes].map((c) => (c.nodeType === 3 ? esc(c.textContent) : inline(c, ctx)).trim()).filter(Boolean); if (runs.length) body += `<p>${runs.map((r) => `<em>${r}</em>`).join(' ')}</p>`; continue; }
      if (/class="btn|class="link-more/.test(n.innerHTML)) { body += ctas(n, ctx); continue; }
      const sTxt = inline(n, ctx).trim(); if (sTxt) body += `<p>${sTxt}</p>`; continue;
    }
    if (t === 'ul' || t === 'ol') { body += list(n, ctx); continue; }
    if (t === 'details') { body += disclosure(n, ctx); continue; }
    if (t === 'a' && /\bbtn\b/.test(n.getAttribute('class') || '')) { body += ctaHtml(n, ctx); continue; }
    body += prose(n, ctx);
  }
  return body;
}
export function itemRows(items, ctx) { return items.map((li) => { const img = q(li, ':scope > img, :scope > picture img, :scope > figure img'); return [img ? pic(img, ctx) : '', itemBody(li, ctx, { skipImg: true })]; }); }

const VARIANT = { 'choice-grid': 'choices', 'tips-grid': 'tips', 'news-grid': 'news', 'rec-grid': 'papers', 'link-cards': 'link-cards', tiles: 'tiles', 'price-grid': 'price', topics: 'topics', tools: 'tools', 'door-grid': 'doors', 'small-grid': 'small', 'pop-grid': 'popular', advisers: 'advisers', 'rail-list': 'rail', 'art-grid': 'articles', 'quick-links': 'quick-links' };
const gridOf = (ul) => cls(ul).find((c) => /^grid-[1-4]$/.test(c)) || null;
/** Section lede between the title and the first list (canon .section-lede / a .prose paragraph) as default content. */
function lede(root, ctx, before) {
  const c = q(root, ':scope > .container'); if (!c) return '';
  let out = '';
  for (const n of c.children) { if (n === before) break; if (n.matches('h2, .section-title')) continue; if (n.matches('p.lead, .section-lede, .prose, p')) out += prose({ childNodes: [n] }, ctx); }
  return out;
}
/* ---- card-rail (generic): head · lede · one cards block per list (variant from the list class, grid-N modifier) · trailing promo / paragraphs ---- */
export function rail(root, ctx) {
  const lists = qa(root, 'ul[data-slot="cards"], ol[data-slot="cards"], ul.choice-grid, ul.tips-grid, ul.news-grid, ul.rec-grid, ul.link-cards, ul.tiles, ul.quick-links');
  if (!lists.length) return cardRail(root, ctx);
  const parts = [head(root, ctx), lede(root, ctx, lists[0])]; const blocks = [];
  for (const ul of lists) {
    const items = qa(ul, ':scope > li'); if (!items.length) continue;
    const variant = cls(ul).map((c) => VARIANT[c]).find(Boolean) || 'flat';
    parts.push(block('cards', [variant, gridOf(ul)], itemRows(items, ctx))); blocks.push('cards');
  }
  const promo = q(root, 'article.promo, .promo'); if (promo) { parts.push(promoRow(promo, ctx)); blocks.push('columns'); }
  for (const p of qa(root, ':scope > .container > p:not(.lead):not(.section-lede), :scope > .container > .price-foot > p, :scope > .container > .art-more')) { if (lists[0].compareDocumentPosition(p) & 2) continue; const sTxt = inline(p, ctx).trim(); if (!sTxt) continue; parts.push(/class="btn|class="link-more/.test(p.innerHTML) ? ctas(p, ctx) : `<p>${sTxt}</p>`); }
  const hasLede = parts[1] && /<p>/.test(parts[1]);
  return { html: section(parts, { style: styleOf(paperOf(root), hasLede ? 'lead-first' : null) }), blocks: [...new Set(blocks)] };
}
export const papers = rail;

/* ---- content-columns: cols (the migrate workers' "editorial columns (verbatim)": .cols.cols-N > .col) ---- */
function colProse(col, ctx) {
  let out = '';
  for (const n of col.children) {
    if (n.matches('ul.choice-grid, ul.tips-grid, ul.link-cards')) { for (const li of qa(n, ':scope > li')) out += itemBody(li, ctx); continue; }
    if (n.matches('.cols')) { for (const c of qa(n, ':scope > .col')) out += colProse(c, ctx); continue; }
    if (n.matches('details')) { out += disclosure(n, ctx); continue; }
    if (n.matches('figure')) { const i = q(n, 'img'); if (i) out += pic(i, ctx); continue; }
    if (/^H[1-6]$/.test(n.tagName)) { const a = q(n, 'a'); out += a && txtOnlyLinks(n) ? `<${n.tagName.toLowerCase()}><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></${n.tagName.toLowerCase()}>` : prose({ childNodes: [n] }, ctx); continue; }
    out += prose({ childNodes: [n] }, ctx);
  }
  return out;
}
export function cols(root, ctx) {
  const grid = q(root, ':scope > .container > .cols'); if (!grid) return null;
  const items = qa(grid, ':scope > .col'); if (!items.length) return null;
  const n = (cls(grid).find((c) => /^cols-[2-4]$/.test(c)) || 'cols-2').replace('cols-', '');
  const parts = [head(root, ctx), lede(root, ctx, grid)]; const hasLede = /<p>/.test(parts[1] || '');
  const style = styleOf(paperOf(root), hasLede ? 'lead-first' : null);
  // (a) every column is exactly one card → one cards block (the canon choice grid)
  const single = items.every((c) => c.children.length === 1 && c.firstElementChild.matches('ul.choice-grid, ul.tips-grid') && qa(c.firstElementChild, ':scope > li').length === 1);
  if (single) { ctx.notes.push(`content-columns (cols-${n}, one card per column): cards (choices grid-${n})`); return { html: section([...parts, block('cards', ['choices', `grid-${n}`], itemRows(items.map((c) => q(c, 'li')), ctx))], { style }), blocks: ['cards'] }; }
  // (b) every column is [illustration, heading, text?, disclosure/list?] → cards (tiles): illustration + title + link list
  const tileLike = items.every((c) => q(c, ':scope > figure img, :scope > img') && q(c, ':scope > h2, :scope > h3') && !q(c, '.cols, ul.choice-grid'));
  if (tileLike) { ctx.notes.push(`content-columns (cols-${n}, illustration + heading per column): cards (tiles grid-${n}); disclosures flattened to visible link lists`); return { html: section([...parts, block('cards', ['tiles', `grid-${n}`], itemRows(items, ctx))], { style }), blocks: ['cards'] }; }
  // (c) mixed editorial columns → columns (cols cols-N), one prose cell per column
  ctx.notes.push(`content-columns (cols-${n}, mixed): columns (cols cols-${n}) — one prose cell per column (nested cards/columns flattened in order)`);
  return { html: section([...parts, block('columns', ['cols', `cols-${n}`], [items.map((c) => colProse(c, ctx))])], { style }), blocks: ['columns'] };
}

/* ---- quick-links: icon + link per item → cards (quick-links) ---- */
export function quickLinks(root, ctx) {
  const ul = q(root, 'ul.quick-links'); if (!ul) return null;
  ctx.notes.push('quick-links: cards (quick-links) — one row per entry [icon][link]');
  return { html: section([head(root, ctx), block('cards', ['quick-links'], qa(ul, ':scope > li').map((li) => { const img = q(li, 'img'); const a = q(li, 'a'); return [img ? pic(img, ctx) : '', a ? `<p><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></p>` : inline(li, ctx)]; }))], { style: styleOf(paperOf(root)) }), blocks: ['cards'] };
}

/* ---- cta-row: the "report a claim" row (icon · title line · one pill between hairlines) → default content, section style `claim` ---- */
export function ctaRow(root, ctx) {
  const c = q(root, ':scope > .container') || root;
  const html = prose(c, ctx); if (!html.trim()) return null;
  const claim = cls(c).includes('claim-row') || cls(root).includes('claim');
  if (claim) ctx.notes.push('cta-row (claim): default content (icon, title line, primary pill) with the `claim` section style (styles-theme.css) — a prose composition, not a block (D1)');
  return { html: section([html], { style: styleOf(paperOf(root), claim ? 'claim' : null, claim ? 'flush-top' : null) }), blocks: [] };
}

/* ---- overrides of core keys for the theme family ---- */
function themePageTitle(root, ctx) {
  const r = pageTitle(root, ctx); if (!r) return null;
  r.html = restyle(r.html, styleOf(paperOf(root), 'intro', 'tight-top', 'intro-backlink')); // canon .intro: 16 top / 64 bottom; backlink row 20 above the h1
  return r;
}
export function themeSplit(root, ctx) {
  const r = splitMedia(root, ctx); if (!r) return null;
  if (cls(root).includes('resident')) r.html = restyle(r.html, styleOf(paperOf(root), 'flush-top')); // canon .resident { padding-top: 0 } under the callout
  const right = cls(root).includes('media-right'); const illu = qa(root, 'figure img, .q-media img, .hero-media img').some((i) => /\.svg(\?|$)/i.test(i.getAttribute('src') || '') || cls(i).includes('illu'));
  if (right || illu) {
    const { document } = parseHTML(`<html><body>${r.html}</body></html>`); const b = document.querySelector('.columns');
    if (b) {
      if (right && !b.classList.contains('text-first')) { b.classList.add('text-first'); for (const row of b.children) if (row.children.length === 2) row.append(row.firstElementChild); ctx.notes.push('split-media (media-right): columns (split text-first) — cells swapped so the text leads and the media sits right'); }
      if (illu) { b.classList.add('illu'); ctx.notes.push('split-media (illustration): variant illu — SVG media kept at its own ratio (no 3:2 crop / paper)'); }
      r.html = document.body.innerHTML;
    }
  }
  return r;
}

/** callout that ends in an action pill → adds the `offer` variant (canon p + p rhythm before the pill; the proto's intent "offer: adviser review"). */
function themeCallout(root, ctx) {
  const r = callout(root, ctx); if (!r) return null;
  if (q(root, '.callout a.btn, .callout .btn')) { r.html = r.html.replace(/<div class="callout( [a-z-]+)?">/, (m, v) => `<div class="callout${v || ''} offer">`); ctx.notes.push('callout (offer): variant `offer` = callout with a CTA pill (callout-theme.css restores the canon p + p 16 px before the pill)'); }
  return r;
}

export default {
  'page-title': themePageTitle,
  callout: themeCallout,
  'content-columns': contentColumns,
  'split-media': themeSplit,
  'card-rail': rail,
  'cta-row': ctaRow,
  'quick-links': quickLinks,
};
