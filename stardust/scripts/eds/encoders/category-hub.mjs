/**
 * encoders/category-hub.mjs — hub group (worker E4): category-hub family encoders + the helpers shared with
 * kundeservice-hub / tool / utility (they import from here). New keys (`shortcut-row`, `cobranding`) are shared by convert.mjs;
 * the core overrides below (`visual-nav`, `promo-band`) apply to category-hub pages only.
 */
import * as L from '../lib.mjs';
import { cardRows, splitMedia } from '../encoders.mjs';

const { q, qa, cls, txt, inline, prose, ctas, pic, block, section, styleOf, paperOf, esc } = L;

/** Section style: the movement's paper + explicit tokens (hub pages set their own rhythm tokens, never the core guesses). */
export const hubStyle = (root, ...extra) => styleOf(paperOf(root), ...extra);

/** The movement's h2 (`.section-title` or the first h2 directly in the container / its head column) as default content. */
export function head(root, ctx) {
  const h = q(root, ':scope > .container > h2, :scope > .container > .directory-head > h2, :scope > .container > .faq-grid > h2, :scope > .container > .shortcut-row > h2');
  return h ? `<h2>${inline(h, ctx)}</h2>` : '';
}

/** A promo article → one `columns (promo …)` row [illustration][title + line + pill]. */
export function promoCells(promo, ctx) {
  const img = q(promo, 'img'); const text = q(promo, '.promo-text') || promo;
  return [img ? pic(img, ctx) : '', prose(text, ctx)];
}
const CARD_VARIANT = { 'door-grid': 'doors', 'small-grid': 'small', 'pop-grid': 'popular', topics: 'topics', tools: 'tools', tiles: 'tiles' };
export const cardVariant = (ul) => cls(ul).map((c) => CARD_VARIANT[c]).find(Boolean) || 'flat';

/* ---- visual-nav: doors (4 photo doors) + small tiles (4 icon tiles) — two cards blocks, the movement sits 16px under the intro ---- */
function visualNav(root, ctx) {
  const lists = qa(root, 'ul.door-grid, ul.small-grid, ul[data-slot="cards"], ul[data-slot="cards-small"]').filter((u, i, a) => a.indexOf(u) === i);
  if (!lists.length) return null;
  const parts = [head(root, ctx), ...lists.map((ul) => block('cards', [cardVariant(ul)], cardRows(qa(ul, ':scope > li'), ctx)))];
  return { html: section(parts, { style: hubStyle(root, cls(root).includes('doors') ? 'tight-top' : null) }), blocks: ['cards'] };
}

/* ---- shortcut-row: h2 + a list of inline chevron links → DEFAULT CONTENT with the `shortcuts` section style (D1/D5) ---- */
function shortcutRow(root, ctx) {
  const ul = q(root, 'ul'); if (!ul) return null;
  const items = qa(ul, ':scope > li').map((li) => { const a = q(li, 'a'); return a ? `<li><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></li>` : ''; }).join('');
  ctx.notes.push('shortcut-row: prose h2 + ul of links (David\'s Model D5 simple list); section style `shortcuts` paints the hairline, the inline-link row and the chevrons');
  return { html: section([head(root, ctx), `<ul>${items}</ul>`], { style: hubStyle(root, 'shortcuts') }), blocks: [] };
}

/* ---- cobranding: the LOfavør disclosure → bespoke `cobranding` block: [question][toggle label] · [logo][name + prose + CTAs] · [illustration][note] ---- */
function cobranding(root, ctx) {
  const d = q(root, 'details.cobrand, .cobrand'); if (!d) return null;
  const qEl = q(d, 'summary .cobrand-q, summary span:first-child'); const tEl = q(d, 'summary .cobrand-toggle, summary span:last-child');
  const main = q(d, '.cobrand-main') || d; const side = q(d, '.cobrand-side');
  const logo = q(main, 'img'); const name = q(main, 'h2, h3');
  let body = name ? `<${name.tagName.toLowerCase()}>${inline(name, ctx)}</${name.tagName.toLowerCase()}>` : '';
  for (const p of qa(main, 'p')) { if (q(p, 'a.btn')) continue; const s = inline(p, ctx).trim(); if (s) body += `<p>${s}</p>`; }
  for (const p of qa(main, 'p')) if (q(p, 'a.btn')) body += ctas(p, ctx);
  const rows = [[`<p>${inline(qEl, ctx).trim()}</p>`, `<p>${inline(tEl, ctx).trim()}</p>`], [logo ? pic(logo, ctx) : '', body]];
  if (side) { const illu = q(side, 'img'); rows.push([illu ? pic(illu, ctx) : '', qa(side, 'p').map((p) => `<p>${inline(p, ctx).trim()}</p>`).join('')]); }
  ctx.notes.push('cobranding: bespoke disclosure block (details/summary → head row + hidden panel, accordion.js pattern); the toggle label is authored text outside the <button>');
  return { html: section([block('cobranding', [], rows)], { style: hubStyle(root) }), blocks: ['cobranding'] };
}

/* ---- split-media (hub): two stacked help columns [photo][h2 + line + pill] → columns (split help), one row per column ---- */
export function hubSplit(root, ctx) {
  const cols = qa(root, '.help-col'); if (!cols.length) return splitMedia(root, ctx);
  const rows = cols.map((c) => { const img = q(c, 'img'); let body = ''; for (const n of c.children) { if (n === img) continue; body += prose({ childNodes: [n] }, ctx); } return [img ? pic(img, ctx) : '', tidyProse(linkListify(body))]; });
  return { html: section([head(root, ctx), block('columns', ['split', 'help'], rows)], { style: hubStyle(root) }), blocks: ['columns'] };
}

/* ---- promo-band: one or two promos; family class (`switch` flush under the help columns · `invites` two side by side) rides the block ---- */
export function hubPromo(root, ctx) {
  const promos = qa(root, 'article.promo, .promo'); if (!promos.length) return null;
  const fam = cls(root).find((c) => ['switch', 'invites'].includes(c));
  const b = block('columns', ['promo', promos.length > 1 ? `promo-${promos.length}` : null, fam], promos.map((p) => promoCells(p, ctx)));
  return { html: section([head(root, ctx), b], { style: hubStyle(root, fam === 'switch' ? 'flush-top' : null) }), blocks: ['columns'] };
}

/* ---- callout (hub group): canon .callout / .callout-rich → callout (tip|info|frost [rich]); `quick` = 48px top, flush bottom ---- */
export function hubCallout(root, ctx) {
  const co = q(root, '.callout'); if (!co) return null;
  const variant = cls(co).includes('info') ? 'info' : cls(co).includes('callout-frost') ? 'frost' : 'tip';
  const body = q(co, '.callout-text, .callout-body') || co;
  ctx.notes.push('lint D1 callout: designed compound (canon icon + tinted paper), Block Collection-shaped single cell of prose — kept as a block like the product archetype');
  return { html: section([head(root, ctx), block('callout', [variant, cls(co).includes('callout-rich') ? 'rich' : null, q(body, 'a.btn') ? 'cta' : null], [[prose(body, ctx)]])], { style: hubStyle(root, cls(root).includes('quick') ? 'quick' : null) }), blocks: ['callout'] };
}

/* ============================== shared sibling modules (migrate workers' sibling-only vocabulary) ============================== */

/** Layout tables (a single td wrapping prose, from the source CMS) are unwrapped before serialising — never a nested table (D2). */
export function unwrapLayoutTables(el) {
  for (const t of qa(el, 'table')) { const cells = qa(t, 'td, th'); if (cells.length !== 1) continue; const td = cells[0]; while (td.firstChild) t.parentNode.insertBefore(td.firstChild, t); t.remove(); }
}
/** A paragraph of several links on <br> lines (optionally led by <strong>Label</strong>) → label paragraph + a link list (D5). */
export function linkListify(html) {
  return html.replace(/<p>((?:(?!<\/p>).)*?)<\/p>/g, (m, inner) => {
    if ((inner.match(/<a /g) || []).length < 2 || !/<br>/.test(inner)) return m;
    const lines = inner.replace(/(<br>\s*)+<\/strong>/g, '</strong><br>').split(/\s*<br>\s*/).map((l) => l.trim()).filter(Boolean);
    if (!lines.every((l, i) => /^<a [^>]*>[^<]*<\/a>\.?$/.test(l) || (i === 0 && /^<strong>/.test(l)))) return m;
    let out = ''; const items = [];
    for (const l of lines) { if (/^<strong>/.test(l)) out += `<p>${l.replace(/<br>\s*<\/strong>/, '</strong>')}</p>`; else items.push(`<li>${l}</li>`); }
    return `${out}<ul>${items.join('')}</ul>`;
  });
}
/** Run-in bold labels (`<strong>Label<br></strong> body…`) become their own paragraph; a <strong> wrapping an inline link is split around
 *  the link (same weight, no strong > a nesting) — so running text never reads as a multi-link CTA paragraph (delivery P1, D6). */
export function tidyProse(html) {
  return html
    .replace(/<p><strong>([^<]+?)\s*(?:<br>\s*)+<\/strong>\s*(?=\S)/g, '<p><strong>$1</strong></p><p>')
    .replace(/<strong>([^<]*)(<a [^>]*>[^<]*<\/a>)([^<]*)<\/strong>/g, (m, a, link, b) => `${a.trim() ? `<strong>${a}</strong>` : ''}${link}${b.trim() ? `<strong>${b}</strong>` : ''}`)
    // last resort: running text with a bold phrase AND several links → one paragraph per sentence group (verbatim text, delivery-lint P1 heuristic)
    .replace(/<p>((?:(?!<\/p>).)*?)<\/p>/g, (m, inner) => {
      if ((inner.match(/<a /g) || []).length < 2 || !/<(strong|em)\b/.test(inner) || /<br>/.test(inner)) return m;
      const sentences = inner.split(/(?<=[.!?])\s+(?=[A-ZÆØÅ])/); if (sentences.length < 2) return m;
      const paras = []; let cur = '';
      for (const sn of sentences) { const next = cur ? `${cur} ${sn}` : sn; const ok = (next.match(/<a /g) || []).length < 2 || !/<(strong|em)\b/.test(next); if (ok || !cur) cur = next; else { paras.push(cur); cur = sn; } }
      if (cur) paras.push(cur);
      return paras.map((x) => `<p>${x}</p>`).join('');
    });
}
/** Prose of a container minus the back link (the intro's `p.back` or a wrapper that holds it). */
function proseExcept(container, back, ctx) {
  let out = '';
  for (const n of container.children) {
    if (n === back) continue;
    if (back && n.contains(back)) { if (n.children.length <= 1 && !n.textContent.replace(txt(back), '').trim()) continue; out += proseExcept(n, back, ctx); continue; }
    out += prose({ childNodes: [n] }, ctx);
  }
  return out;
}
/** A table cell → block-cell HTML (several paragraphs kept, else one paragraph). */
const cellHtml = (cell, ctx) => (q(cell, 'p, ul, ol') ? prose(cell, ctx) : `<p>${inline(cell, ctx).trim()}</p>`);

/* ---- page-title (hub): back link + h1 + lead(s) [+ CTAs]; the `intro-media` shape (text left, photo right) → hero (intro) ---- */
export function hubTitle(root, ctx) {
  const back = q(root, 'a.backlink'); const parts = []; const blocks = [];
  if (back) { parts.push(block('breadcrumbs', [], [[`<p><a href="${esc(L.href(back.getAttribute('href') || '', ctx))}">${inline(back, ctx).trim()}</a></p>`]])); blocks.push('breadcrumbs'); }
  const grid = q(root, '.intro-grid');
  if (grid) {
    const img = q(grid, 'figure img, .intro-figure img'); const text = q(grid, '.intro-text') || grid;
    parts.push(block('hero', ['intro'], [[proseExcept(text, back, ctx), img ? pic(img, ctx) : '']])); blocks.push('hero');
    ctx.notes.push('page-title (intro-media): text + photo intro → hero (intro) — photo right, h1 + leads + pills left');
    return { html: section(parts, { style: hubStyle(root, back ? 'tight-top' : null, 'tight-bottom') }), blocks };
  }
  const c = q(root, ':scope > .container') || root;
  parts.push(proseExcept(c, back, ctx));
  return { html: section(parts, { style: hubStyle(root, 'intro', 'tight-bottom') }), blocks };
}

/* ---- card-grid · related-topics · static-cards: photo tiles (h3 link, optional tag + prose) or text-only pop tiles → cards (photo-tiles | popular) ---- */
function tileRow(li, ctx) {
  const img = q(li, ':scope > img, :scope > picture img, :scope > figure img'); const title = q(li, '.card-title'); const titleLink = title ? (title.tagName === 'A' ? title : q(title, 'a')) : null;
  const meta = q(li, ':scope > p.meta'); let body = '';
  if (meta) body += `<p><em>${inline(meta, ctx).trim()}</em></p>`;
  if (title) { const lvl = /^H[1-6]$/.test(title.tagName) ? title.tagName.toLowerCase() : 'h3'; body += titleLink ? `<${lvl}><a href="${esc(L.href(titleLink.getAttribute('href') || '', ctx))}">${inline(titleLink, ctx)}</a></${lvl}>` : `<${lvl}>${inline(title, ctx)}</${lvl}>`; }
  for (const n of li.children) { if (n === title || n === meta || /^(IMG|PICTURE|FIGURE)$/.test(n.tagName)) continue; body += /class="btn/.test(n.innerHTML) ? ctas(n, ctx) : prose({ childNodes: [n] }, ctx); }
  return [img ? pic(img, ctx) : '', body];
}
export function tileGrid(root, ctx) {
  const c = q(root, ':scope > .container') || root; const parts = [head(root, ctx)]; const blocks = [];
  const lead = q(c, ':scope > p.lead, :scope > .cards-lead'); if (lead) parts.push(`<p>${inline(lead, ctx).trim()}</p>`);
  for (const ul of qa(c, ':scope > ul')) {
    const v = cls(ul).includes('card-grid') ? 'photo-tiles' : cardVariant(ul);
    const rows = qa(ul, ':scope > li').map((li) => tileRow(li, ctx));
    parts.push(block('cards', [v], rows.some((r) => r[0]) ? rows : rows.map((r) => [r[1]]))); blocks.push('cards');
  }
  for (const p of qa(c, ':scope > p:not(.lead):not(.cards-lead), :scope > .cta-row')) parts.push(/class="btn/.test(p.innerHTML) ? ctas(p, ctx) : `<p>${inline(p, ctx).trim()}</p>`);
  return { html: section(parts, { style: hubStyle(root, lead ? 'lead-first' : null) }), blocks: [...new Set(blocks)] };
}

/* ---- usp: icon + title-sm + line, three across → cards (usp) ---- */
function usp(root, ctx) {
  const ul = q(root, 'ul'); if (!ul) return null;
  const rows = qa(ul, ':scope > li').map((li) => { const img = q(li, 'img'); let body = ''; for (const n of li.children) { if (n === img) continue; body += prose({ childNodes: [n] }, ctx); } return [img ? pic(img, ctx) : '', body]; });
  return { html: section([head(root, ctx), block('cards', ['usp'], rows)], { style: hubStyle(root) }), blocks: ['cards'] };
}

/* ---- image: a lone illustration movement → DEFAULT CONTENT image with the `figure` section style (D1) ---- */
function image(root, ctx) {
  const img = q(root, 'img'); if (!img) return null;
  return { html: section([pic(img, ctx)], { style: hubStyle(root, 'figure') }), blocks: [] };
}

/* ---- text-and-image: illustration stack + h2/lead/pill → columns (split illu) ---- */
function textAndImage(root, ctx) {
  const fig = q(root, 'figure, .split-media'); const text = q(root, '.split-text') || q(root, ':scope > .container');
  const media = qa(fig, 'img').map((i) => pic(i, ctx)).join('');
  const reverse = !!(fig && text && (fig.compareDocumentPosition(text) & 2));
  const cells = reverse ? [prose(text, ctx), media] : [media, prose(text, ctx)];
  return { html: section([block('columns', ['split', 'illu', reverse ? 'text-first' : null], [cells])], { style: hubStyle(root) }), blocks: ['columns'] };
}

/* ---- disclosure: <details> behind a secondary pill — a data table → table (disclose); anything else → accordion (disclose), one row [label][prose] ---- */
function discloseTable(d, ctx) {
  const body = q(d, '.disclose-body') || d; const tb = q(body, 'table'); const h = q(body, 'h2, h3');
  const rows = [[`<p>${inline(q(d, 'summary'), ctx).trim()}</p>`]]; if (h) rows.push([`<h2>${inline(h, ctx)}</h2>`]);
  const caption = q(tb, 'caption'); if (!h && caption && txt(caption)) rows.push([`<h2>${inline(caption, ctx)}</h2>`]);
  rows.push(...qa(tb, 'tr').map((tr) => [...tr.children].map((cell) => cellHtml(cell, ctx))));
  return block('table', ['disclose'], rows);
}
function disclosure(root, ctx) {
  const c = q(root, ':scope > .container') || root; const parts = [head(root, ctx)]; const blocks = [];
  const lead = q(c, ':scope > p.lead'); if (lead) parts.push(`<p>${inline(lead, ctx).trim()}</p>`);
  for (const d of qa(c, ':scope > details')) {
    const body = q(d, '.disclose-body') || d;
    if (q(body, 'table') && !q(body, '.help-col')) { parts.push(discloseTable(d, ctx)); blocks.push('table'); ctx.notes.push('disclosure: data table behind a toggle → table (disclose): row 1 = toggle label, row 2 = heading, then header + rows'); continue; }
    unwrapLayoutTables(body);
    const cols = qa(body, '.help-col'); let ans = '';
    for (const part of [...body.children].length ? [...body.children] : [body]) { const pc = qa(part, '.help-col'); for (const piece of pc.length ? pc : [part]) ans += prose(piece, ctx); }
    ans = tidyProse(linkListify(ans));
    parts.push(block('accordion', ['disclose'], [[`<p>${inline(q(d, 'summary'), ctx).trim()}</p>`, ans]])); blocks.push('accordion');
    ctx.notes.push(`disclosure: toggle + ${cols.length ? `${cols.length} illustrated columns` : 'prose'} → accordion (disclose), one row [label][prose]${cols.length ? ' — the columns are flattened in reading order (D2), nested toggles become label + link list' : ''}`);
  }
  return { html: section(parts, { style: hubStyle(root, lead ? 'lead-first' : null) }), blocks: [...new Set(blocks)] };
}

/* ---- faq (hub, shared): h3 question rows; answers flattened (layout tables unwrapped, link lines → lists); `faq-grid` → sticky h2 beside a wide list ---- */
export function hubFaq(root, ctx, extra = []) {
  const wrap = q(root, '.faq[data-slot="items"], .faq, [data-slot="items"]'); if (!wrap) return null;
  const aside = !!q(root, '.faq-grid'); const rate = !!q(root, '.faq-foot-feedback');
  const item = (d) => {
    const s = q(d, 'summary'); const qEl = q(s, 'h3, h2, .faq-q') || s; const a = q(d, '.answer, .answer-wide'); if (a) unwrapLayoutTables(a);
    let ans = ''; for (const c of a ? [...a.children] : []) { if (c.classList.contains('faq-foot-feedback')) continue; ans += prose(c, ctx); }
    return [`<h3>${inline(qEl, ctx).trim()}</h3>`, tidyProse(linkListify(ans))];
  };
  const shown = qa(wrap, ':scope > details:not(.faq-more)').map(item);
  const variants = ['faq', aside ? 'wide' : null, rate ? 'rate' : null, ...extra];
  const parts = [head(root, ctx), block('accordion', variants, shown)];
  const more = q(wrap, ':scope > details.faq-more');
  if (more) { const label = q(more, 'summary'); parts.push(block('accordion', ['faq', 'more'], [[`<p>${inline(label, ctx).trim()}</p>`], ...qa(more, '.faq-more-items > details').map(item)])); }
  if (rate) ctx.notes.push('faq: the "Var dette nyttig?" rating row is accordion `rate` chrome (@ew-exempt labels, dynamics #5 interim)');
  return { html: section(parts, { style: hubStyle(root, aside ? 'faq-aside' : null) }), blocks: ['accordion'] };
}
const accordionList = (root, ctx) => hubFaq(root, ctx, ['list']);

/* ---- currency-converter: static shell (dynamics #9) → converter block [label][value] rows + rate + note; the rate list → table (disclose) ---- */
function currencyConverter(root, ctx) {
  const form = q(root, 'form'); const parts = [head(root, ctx)]; const blocks = [];
  if (form) {
    const rows = [];
    for (const f of qa(form, '.conv-field')) {
      const label = q(f, 'label, .label'); const sel = q(f, 'select'); const inp = q(f, 'input'); const out = q(f, 'output');
      const val = sel ? txt(q(sel, 'option[selected]') || q(sel, 'option')) : inp ? (inp.getAttribute('value') || '') : txt(out);
      rows.push([`<p>${inline(label, ctx).trim()}</p>`, `<p>${esc(val)}</p>`]);
    }
    for (const p of qa(form, ':scope > p')) { const s = inline(q(p, 'span:not([hidden])') || p, ctx).trim(); if (s) rows.push([`<p>${s}</p>`]); }
    parts.push(block('converter', [], rows)); blocks.push('converter');
    ctx.notes.push('currency-converter: dynamics #9 interim — the captured selection/amount/result are authored [label][value] rows, controls disabled; the currency option lists are the live widget\'s data (not authored)');
  }
  for (const d of qa(root, 'details')) if (q(d, 'table')) { parts.push(discloseTable(d, ctx)); blocks.push('table'); }
  return { html: section(parts, { style: hubStyle(root) }), blocks: [...new Set(blocks)] };
}

export default {
  'page-title': hubTitle,
  faq: hubFaq,
  'card-grid': tileGrid, 'related-topics': tileGrid, 'static-cards': tileGrid,
  usp, image, 'text-and-image': textAndImage, disclosure, 'accordion-list': accordionList, 'currency-converter': currencyConverter,
  'visual-nav': visualNav,
  callout: hubCallout,
  'split-media': hubSplit,
  'shortcut-row': shortcutRow,
  cobranding,
  'promo-band': hubPromo,
};
