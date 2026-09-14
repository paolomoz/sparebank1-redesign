/**
 * encoders/om-oss.mjs — family encoders for `om-oss` (archetype: presse; 7 siblings migrated by the component walker).
 * Presse modules: campaign (hero `om-oss` / the presserom split) · adviser-list (prose head + cards `advisers`) · promo-band (columns `promo lokale`)
 * · feedback (core + `hairline-none` under the Sand paper). Walker modules: columns-grid / background-container / section / cards / text / tabs
 * — one movement = one DA section; `.cols` → columns `om-oss` (illu | panel | text-first) or cards `om-oss cols-N`; `.faq` → accordion `faq`;
 * `.table-wrap` → table; `p.back` → breadcrumbs; everything else is default content. `contact-row` is the footer's contact section (chrome) → skipped.
 */
import * as L from '../lib.mjs';
import { productHero, promoBand as corePromoBand, feedback as coreFeedback, cardRows } from '../encoders.mjs';

const { esc, q, qa, cls, inline, prose, ctas, pic, block, section, styleOf, paperOf } = L;
const ARCHETYPE = 'nb-bank-om-oss-presse-html';
const one = (n, ctx) => prose({ childNodes: [n] }, ctx);
const backlink = (a, ctx) => block('breadcrumbs', [], [[`<p><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></p>`]]);

/* ---------------- presse (archetype) ---------------- */
function heroBlock(grid, ctx) {
  const img = q(grid, '.hero-media img'); const text = q(grid, '.hero-text') || grid;
  const body = prose(text, ctx);
  return block('hero', ['om-oss'], [img ? [pic(img, ctx), body] : [body]]);
}
function campaign(root, ctx) {
  if (q(root, '.pr-grid')) { // presserom: text 5 / photo 7 on Sand
    const text = q(root, '.pr-text'); const img = q(root, '.pr-media img');
    return { html: section([block('columns', ['split', 'text-first', 'presserom'], [[prose(text, ctx), pic(img, ctx)]])], { style: styleOf(paperOf(root)) }), blocks: ['columns'] };
  }
  const grid = q(root, '.hero-grid');
  if (!grid) return productHero(root, ctx);
  return { html: section([heroBlock(grid, ctx)], { style: styleOf(paperOf(root)) }), blocks: ['hero'] };
}
function adviserList(root, ctx) {
  const c = q(root, ':scope > .container') || root; const parts = []; const blocks = [];
  for (const n of c.children) {
    if (n.matches('ul.advisers')) { parts.push(block('cards', ['advisers'], cardRows(qa(n, ':scope > li'), ctx))); blocks.push('cards'); } else parts.push(one(n, ctx));
  }
  return { html: section(parts, { style: styleOf(paperOf(root), 'prose-narrow', 'contacts') }), blocks: [...new Set(blocks)] };
}
function promoBand(root, ctx) {
  const img = q(root, '.lok-illu, .illu'); const text = q(root, '.lok-text');
  if (!img || !text) return corePromoBand(root, ctx);
  return { html: section([block('columns', ['promo', 'lokale'], [[pic(img, ctx), prose(text, ctx)]])], { style: styleOf(paperOf(root)) }), blocks: ['columns'] };
}
function feedback(root, ctx) {
  const r = coreFeedback(root, ctx);
  const prev = root.previousElementSibling;
  if (ctx.slug === ARCHETYPE && prev && cls(prev).includes('paper-sand')) { r.html = r.html.replace('<div>feedback-band</div>', '<div>feedback-band, hairline-none</div>'); ctx.notes.push('presse: the feedback band under the Sand paper drops its hairline (proto .paper-sand+.feedback{border-top:0}) → style hairline-none'); }
  return r;
}

/* ---------------- walker vocabulary (siblings) ---------------- */
const isMediaCol = (col) => col.children.length === 1 && col.firstElementChild.matches('figure.fig');
const isCardsCol = (col) => col.children.length === 1 && col.firstElementChild.matches('ul.cards');
const isFaqCol = (col) => col.children.length === 1 && col.firstElementChild.matches('.faq');
const hasPanel = (col) => !!q(col, ':scope > .panel');

/** Captured answers list several document links in ONE paragraph separated by <br> (and stray empty anchors): drop the empty anchors,
 *  move a trailing <br> out of its <strong>, and split such paragraphs at the <br> — one link per paragraph (delivery-lint P1 one-cta-per-p). */
const balanced = (s) => ['strong', 'em', 'a'].every((t) => (s.match(new RegExp(`<${t}[ >]`, 'g')) || []).length === (s.match(new RegExp(`</${t}>`, 'g')) || []).length);
function tidyAnswer(html) {
  html = html.replace(/<a [^>]*>\s*<\/a>/g, '').replace(/<(strong|em)><\1>([\s\S]*?)<\/\1><\/\1>/g, '<$1>$2</$1>');
  for (let i = 0; i < 3; i += 1) html = html.replace(/<(strong|em)>\s*<\/\1>/g, '').replace(/<(strong|em)>((?:\s*<br>)+\s*)/g, '$2<$1>').replace(/((?:\s*<br>)+\s*)<\/(strong|em)>/g, '</$2>$1'); // hoist the label's own line breaks out of the emphasis
  html = html.replace(/<a ([^>]*)>([^<]*)((?:\s*<br>)[\s\S]*?)<\/a>/g, '<a $1>$2</a>$3'); // a captured link wrapping a line break (and the next label): the link ends at its own line
  for (let i = 0; i < 3; i += 1) html = html.replace(/<(strong|em)>\s*<\/\1>/g, '').replace(/<(strong|em)>((?:\s*<br>)+\s*)/g, '$2<$1>').replace(/((?:\s*<br>)+\s*)<\/(strong|em)>/g, '</$2>$1'); // and again after the cut
  return html.replace(/<p>([\s\S]*?)<\/p>/g, (m, inner) => {
    if ((inner.match(/<a /g) || []).length < 2 || !/<br>/.test(inner)) return m;
    const parts = inner.split(/\s*<br>\s*/).map((x) => x.trim()).filter(Boolean);
    return parts.every(balanced) ? parts.map((x) => `<p>${x}</p>`).join('') : m;
  });
}
function faqBlock(faq, ctx) {
  const rows = qa(faq, ':scope > details').map((d) => { const s = q(d, 'summary'); const a = q(d, '.answer'); return [`<h3>${inline(s, ctx).trim()}</h3>`, a ? tidyAnswer(prose(a, ctx)) : '']; });
  return block('accordion', ['faq'], rows);
}
function cardsBlock(lists, ctx, extra = []) {
  const items = lists.flatMap((ul) => qa(ul, ':scope > li'));
  const plain = items.some((li) => cls(li).includes('plain'));
  return block('cards', ['om-oss', plain ? 'plain' : null, ...extra], cardRows(items, ctx));
}
function tableBlock(wrap, ctx, acc) {
  const t = q(wrap, 'table'); if (!t) return;
  const cap = q(t, 'caption'); if (cap && inline(cap, ctx).trim()) acc.parts.push(`<p><strong>${inline(cap, ctx).trim()}</strong></p>`);
  const trs = qa(t, 'tr'); const hasHead = !!q(t, 'thead');
  const body = trs.slice(hasHead ? 1 : 0);
  const rowHeaders = body.length > 0 && body.every((tr) => tr.firstElementChild && tr.firstElementChild.tagName === 'TH');
  const rows = trs.map((tr) => [...tr.children].map((c) => { const s = inline(c, ctx).replace(/ /g, ' ').trim(); return s ? `<p>${s}</p>` : ''; }));
  acc.parts.push(block('table', [hasHead ? null : 'no-header', rowHeaders ? 'row-headers' : null], rows)); acc.blocks.push('table');
  ctx.notes.push('table: the caption is authored as a bold paragraph above the block (table block rows = table rows)');
}
/** The panel / card-1 / plain prose of a column as one columns cell (pictures inline as <p><img>). */
function cellOf(col, ctx) {
  let out = '';
  for (const n of col.children) {
    if (n.matches('ul.cards')) { for (const li of qa(n, ':scope > li')) out += prose(li, ctx); continue; }
    if (n.matches('.panel')) { out += cellOf(n, ctx); continue; }
    if (n.matches('figure.fig')) { const img = q(n, 'img'); if (img) out += pic(img, ctx); const cap = q(n, 'figcaption'); if (cap && inline(cap, ctx).trim()) out += `<p><em>${inline(cap, ctx).trim()}</em></p>`; continue; }
    out += one(n, ctx);
  }
  return out;
}
function encodeCols(colsEl, ctx, acc) {
  const cols = qa(colsEl, ':scope > .col');
  if (!cols.length) return;
  if (cols.length === 1) { encodeChildren(cols[0], ctx, acc); return; }
  if (cols.every(isCardsCol)) { acc.parts.push(cardsBlock(cols.map((c) => c.firstElementChild), ctx, [cols.length === 3 ? 'cols-3' : null])); acc.blocks.push('cards'); return; }
  if (cols.every(isFaqCol)) { for (const c of cols) { acc.parts.push(faqBlock(c.firstElementChild, ctx)); acc.blocks.push('accordion'); } ctx.notes.push('columns-grid: side-by-side FAQ columns are stacked accordions (one movement, two rails → two blocks)'); return; }
  if (cols.length === 2 && (isMediaCol(cols[0]) || isMediaCol(cols[1]))) {
    const m = isMediaCol(cols[0]) ? 0 : 1; const media = cols[m]; const text = cols[1 - m];
    const img = q(media, 'img'); const illu = cls(img).includes('illu-lg') || cls(img).includes('illu') || cls(media.firstElementChild).includes('fig-illu');
    const after = []; let cell = ''; let panel = null;
    for (const n of text.children) {
      if (n.matches('.faq')) { after.push(n); continue; }
      if (n.matches('ul.cards') && qa(n, ':scope > li').length === 1) { panel = q(n, 'li'); cell += prose(panel, ctx); continue; }
      if (n.matches('ul.cards')) { after.push(n); continue; }
      cell += one(n, ctx);
    }
    const plain = panel && cls(panel).includes('plain');
    acc.parts.push(block('columns', ['om-oss', illu ? 'spot' : null, panel ? 'panel' : null, plain ? 'plain' : null, m === 1 ? 'text-first' : null], [m === 0 ? [pic(img, ctx), cell] : [cell, pic(img, ctx)]])); acc.blocks.push('columns');
    for (const n of after) { if (n.matches('.faq')) { acc.parts.push(faqBlock(n, ctx)); acc.blocks.push('accordion'); } else { acc.parts.push(cardsBlock([n], ctx)); acc.blocks.push('cards'); } }
    return;
  }
  if (cols.length === 2 && (hasPanel(cols[0]) || hasPanel(cols[1]))) {
    const p = hasPanel(cols[0]) ? 0 : 1; const panelCol = cols[p]; const textCol = cols[1 - p];
    const plain = !!q(panelCol, '.panel.plain, li.card.plain');
    acc.parts.push(block('columns', ['om-oss', 'panel', plain ? 'plain' : null, p === 0 ? 'text-first' : null], [[cellOf(textCol, ctx), cellOf(panelCol, ctx)]])); acc.blocks.push('columns');
    return;
  }
  // mixed columns (text | text, text | cards…): one columns row of prose cells, ≤ 4 columns
  if (cols.length <= 4 && cols.every((c) => !q(c, '.faq, .tabs, .table-wrap'))) { acc.parts.push(block('columns', ['om-oss', 'text'], [cols.map((c) => cellOf(c, ctx))])); acc.blocks.push('columns'); return; }
  for (const c of cols) encodeChildren(c, ctx, acc);
  ctx.notes.push('columns-grid: a mixed grid was flattened to stacked content');
}
function encodeNode(n, ctx, acc) {
  if (n.matches('.cols')) return encodeCols(n, ctx, acc);
  if (n.matches('ul.cards')) { acc.parts.push(cardsBlock([n], ctx)); acc.blocks.push('cards'); return; }
  if (n.matches('.faq')) { acc.parts.push(faqBlock(n, ctx)); acc.blocks.push('accordion'); return; }
  if (n.matches('.sub, .panel, .sub-head, .tab-panel')) return encodeChildren(n, ctx, acc);
  if (n.matches('.table-wrap')) return tableBlock(n, ctx, acc);
  if (n.matches('p.back')) { const a = q(n, 'a'); if (a) { acc.parts.push(backlink(a, ctx)); acc.blocks.push('breadcrumbs'); } return; }
  if (n.matches('figure.fig')) { const img = q(n, 'img'); if (img) acc.parts.push(pic(img, ctx)); const cap = q(n, 'figcaption'); if (cap && inline(cap, ctx).trim()) acc.parts.push(`<p><em>${inline(cap, ctx).trim()}</em></p>`); return; }
  if (n.matches('.feedback-row')) return; // handled by the feedback module
  acc.parts.push(one(n, ctx));
}
function encodeChildren(parent, ctx, acc) { for (const n of parent.children) encodeNode(n, ctx, acc); }

function movement(root, ctx) {
  const c = q(root, ':scope > .container') || root; const acc = { parts: [], blocks: [] };
  encodeChildren(c, ctx, acc);
  const html = acc.parts.filter(Boolean).join(''); if (!html.trim()) return null;
  const mods = [];
  if (cls(c).includes('prose-run') || root.getAttribute('data-module') === 'text') mods.push('prose-run', 'prose-narrow');
  else if (q(c, ':scope > .prose, :scope > .sub > .sub-head, :scope > .sub')) mods.push('prose-narrow');
  if (q(c, '.sub-head')) mods.push('lead-first');
  return { html: section(acc.parts, { style: styleOf(paperOf(root), ...mods) }), blocks: [...new Set(acc.blocks)] };
}
function tabs(root, ctx) {
  const t = q(root, '.tabs'); if (!t) return movement(root, ctx);
  const nav = q(t, '.tab-nav ul'); const panels = qa(t, ':scope > .tab-panel'); const sections = []; const blocks = new Set();
  if (nav) sections.push(section([L.list(nav, ctx)], { style: styleOf(paperOf(root), 'tabs') }));
  panels.forEach((p) => { const acc = { parts: [], blocks: [] }; encodeChildren(p, ctx, acc); acc.blocks.forEach((b) => blocks.add(b)); sections.push(section(acc.parts, { style: styleOf(paperOf(root), 'flush-top', 'prose-narrow') })); });
  ctx.notes.push('lint D1 tabs: dynamics #11 interim — the tab buttons are a jump list of badges (default content, style tabs); each panel is a following section (h2 + accordion)');
  return { html: sections, blocks: [...blocks] };
}
function contactRow(root, ctx) { ctx.notes.push('contact-row: the footer document (/footer-om-oss) carries the canon contact section — not repeated in the page'); return { html: '', blocks: [] }; }

export default {
  campaign, 'adviser-list': adviserList, 'promo-band': promoBand, feedback,
  'columns-grid': movement, 'background-container': movement, section: movement, cards: movement, text: movement, tabs,
  'contact-row': contactRow,
};
