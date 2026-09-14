/**
 * stardust/scripts/eds/encoders/theme.mjs — theme family (archetype nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html).
 * Overrides for THIS family: page-title (intro rhythm 16/64), content-columns (sheets | index | core rail), split-media (resident flush-top),
 * card-rail (rec-grid → cards papers), callout (+ `offer` variant when it ends in a pill). New shared key: cta-row (icon · line · pill → default content with the `claim` section style).
 * Group CSS: blocks/columns/columns-theme.css (sheets · index · resident · prevention · promo-2), blocks/cards/cards-theme.css (papers),
 * styles/styles-theme.css (claim · intro-backlink).
 */
import * as L from '../lib.mjs';
import { cardRows, cardRail, splitMedia, pageTitle, callout } from '../encoders.mjs';

const { q, qa, cls, inline, prose, ctas, pic, block, section, styleOf, paperOf } = L;

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

/* ---- content-columns: sheets (two illustrated comparison sheets with link lists) ---- */
export function sheets(root, ctx) {
  const wrap = q(root, '.sheets'); if (!wrap) return null;
  const items = qa(wrap, ':scope > article, :scope > .sheet'); if (!items.length) return null;
  const cells = items.map((s) => {
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

export function contentColumns(root, ctx) { return sheets(root, ctx) || index(root, ctx) || cardRail(root, ctx); }

/* ---- card-rail: rec-grid → cards (papers): three Sand-30 photo papers ---- */
export function papers(root, ctx) {
  const ul = q(root, 'ul.rec-grid'); if (!ul) return cardRail(root, ctx);
  return { html: section([head(root, ctx), block('cards', ['papers'], cardRows(qa(ul, ':scope > li'), ctx))], { style: styleOf(paperOf(root)) }), blocks: ['cards'] };
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
function themeSplit(root, ctx) {
  const r = splitMedia(root, ctx); if (!r) return null;
  if (cls(root).includes('resident')) r.html = restyle(r.html, styleOf(paperOf(root), 'flush-top')); // canon .resident { padding-top: 0 } under the callout
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
  'card-rail': papers,
  'cta-row': ctaRow,
};
