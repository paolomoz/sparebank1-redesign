/**
 * encoders/category-hub.mjs — hub group (worker E4): category-hub family encoders + the helpers shared with
 * kundeservice-hub / tool / utility (they import from here). Round 01 (2026-09-15): the prototypes speak the bento card language —
 * every repeated unit is `ul.bento[data-slot="cards"] > li.card` (`.card-image` / `img.illu` then `.card-body`), heroes are a text card
 * (+ a media card) inside `div.bento.hero-bento`, section titles are `h2.h2-l.section-title` (+ `p.section-lead`), promo rows are
 * `li.card.promo` with the spot illustration beside the teaser. `bentoRows` / `hubCards` turn those into `cards (<variant> cols-N)`
 * blocks — one row per card [media?][headings, text, lists, CTAs] in authored order — and `hubTitle` into the `hero` block
 * (`text-only` = text card across 12 · `sand` fill · `tile` = illustration on a Sand tile · `portrait` = circle portrait on a tile).
 * New keys (`shortcut-row`, `cobranding`) are shared by convert.mjs; the core overrides apply to category-hub pages only.
 * Group CSS: blocks/{hero,cards,columns,callout,feedback}/<block>-hub.css · styles/styles-hub.css.
 */
import * as L from '../lib.mjs';
import { splitMedia, richText } from '../encoders.mjs';

const { q, qa, cls, txt, inline, prose, ctas, pic, block, section, styleOf, paperOf, esc } = L;

/** Section style: the movement's paper + `full-bleed` (data-layout) + explicit tokens (hub pages set their own rhythm tokens). */
export const hubStyle = (root, ...extra) => styleOf(paperOf(root), root.getAttribute && root.getAttribute('data-layout') === 'full-bleed-grid' ? 'full-bleed' : null, ...extra);

/** The movement's h2 (`.section-title` or the first h2 directly in the container / its head column) [+ the section lead] as default content. */
export function head(root, ctx, { lead = true } = {}) {
  const h = q(root, ':scope > .container > h2, :scope > .container > .directory-head > h2, :scope > .container > .faq-grid > h2, :scope > .container > .shortcut-row > h2');
  if (!h) return '';
  let out = `<h2>${inline(h, ctx)}</h2>`;
  if (lead) for (const p of qa(root, ':scope > .container > p.section-lead, :scope > .container > p.lead')) { const s = inline(p, ctx).trim(); if (s) out += `<p>${s}</p>`; }
  return out;
}
export const hasLead = (root) => !!q(root, ':scope > .container > h2 ~ p.section-lead, :scope > .container > h2 ~ p.lead');

/** lib.inline() collapses U+00A0 into a plain space (eds-requests: story/theme); keep the author's non-breaking spaces through a private-use placeholder. */
export function keepNbsp(el, fn) {
  const nodes = []; const walk = (n) => { for (const c of n.childNodes) { if (c.nodeType === 3 && c.textContent.includes('\u00a0')) nodes.push([c, c.textContent]); else if (c.nodeType === 1) walk(c); } }; walk(el);
  for (const [n, t] of nodes) n.textContent = t.replace(/\u00a0/g, '\uE000');
  const out = fn();
  for (const [n, t] of nodes) n.textContent = t;
  return out.replace(/\uE000/g, '&#160;');
}

/* ============================== bento cards (round 01) ============================== */
const BENTO_VARIANT = { 'door-grid': 'doors', 'small-grid': 'icons', 'pop-grid': 'popular', 'card-grid': 'tips', 'help-grid': 'help', 'promo-grid': 'promo', topics: 'topics', tools: 'tools', 'bank-grid': 'directory', addr: 'address', 'usp-list': 'usp', tiles: 'tiles' };
export const bentoVariant = (ul) => cls(ul).map((c) => BENTO_VARIANT[c]).find(Boolean) || 'flat';
export const gridOf = (ul) => (cls(ul).find((c) => /^grid-[1-4]$/.test(c)) || '').replace('grid-', '');
const CARD_MEDIA = ':scope > img, :scope > picture img, :scope > figure img, :scope > a > img, :scope > .card-image';
const isBtnPara = (p) => /^\s*<a [^>]*class="[^"]*\bbtn\b/.test(p.innerHTML.trim()) || (q(p, 'a.btn') && qa(p, 'a').every((a) => cls(a).includes('btn')));
/** Body of a bento card in authored order: headings keep their rank (link kept), <em>meta</em>, paragraphs, CTAs one per <p>, lists, prose. */
export function cardBody(container, ctx, { skipImg = true } = {}) {
  let body = '';
  for (const n of container.children) {
    const t = n.tagName.toLowerCase();
    if (t === 'img' || t === 'picture' || t === 'figure') { if (!skipImg) body += pic(q(n, 'img') || n, ctx); continue; }
    if (/^h[1-6]$/.test(t)) { const a = n.children.length === 1 && n.firstElementChild.tagName === 'A' ? n.firstElementChild : null; body += a ? `<${t}><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></${t}>` : `<${t}>${inline(n, ctx).trim()}</${t}>`; continue; }
    if (t === 'p' && cls(n).includes('meta')) { const s = inline(n, ctx).trim(); if (s) body += `<p><em>${s}</em></p>`; continue; }
    if (t === 'p' && isBtnPara(n)) { body += ctas(n, ctx); continue; }
    if (t === 'p') { const s = inline(n, ctx).trim(); if (s) body += `<p>${s}</p>`; continue; }
    if (t === 'a' && cls(n).includes('btn')) { body += L.ctaHtml(n, ctx); continue; }
    if (t === 'ul' || t === 'ol') { qa(n, '.visually-hidden').forEach((x) => x.remove()); body += L.isRichList(n) ? L.richList(n, ctx) : L.list(n, ctx); continue; }
    if (t === 'details') continue; // never nested (D2) — the caller handles disclosures
    body += tidyProse(linkListify(prose({ childNodes: [n] }, ctx)));
  }
  return body;
}
/** One DA row per `li.card`: [media?][body]. The leading photo (`.card-image`) or the spot icon (`img.illu` inside the body) is the media cell. */
export function bentoRows(items, ctx) {
  return items.map((li) => {
    const img = q(li, CARD_MEDIA) || q(li, ':scope > .card-body > img, :scope > .card-body > picture img, :scope > .card-body > figure img, :scope > .card-body > a > img');
    const body = q(li, ':scope > .card-body') || li;
    return [img ? pic(img, ctx) : '', keepNbsp(body, () => cardBody(body, ctx))];
  });
}
/** cards block for a bento list: variant from the list class, `cols-N` from grid-N, `promo-N` for several promos. */
export function bentoBlock(ul, ctx, variant = bentoVariant(ul)) {
  const items = qa(ul, ':scope > li'); if (!items.length) return null;
  const g = gridOf(ul); const rows = bentoRows(items, ctx);
  const media = rows.some((r) => r[0]);
  return block('cards', [variant, variant === 'icons' ? 'spot' : null, g ? `cols-${g}` : null, variant === 'promo' && items.length > 1 ? `promo-${items.length}` : null], media ? rows : rows.map((r) => ['', r[1]]));
}
/** A single card inside a `div.bento` (partners card, note card …) → cards block with one row. */
export function singleCard(card, ctx, variant) {
  const img = q(card, CARD_MEDIA); const body = q(card, ':scope > .card-body') || card;
  return block('cards', [variant], [[img ? pic(img, ctx) : '', cardBody(body, ctx)]]);
}
/**
 * hubCards: the generic round-01 card movement — [h2 + lead as default content] + one cards block per `ul.bento[data-slot]`, single
 * cards in a `div.bento`, trailing paragraphs / CTAs as default content. `variantOf(ul)` may override the variant; `style` extra tokens.
 */
export function hubCards(root, ctx, { variantOf = bentoVariant, style = [], singles = {} } = {}) {
  const c = q(root, ':scope > .container, :scope > .full-bleed') || root;
  const parts = [head(root, ctx)]; const blocks = new Set();
  let n = 0;
  for (const el of c.children) {
    if (el.matches('ul, ol') && el.hasAttribute('data-slot')) { const b = bentoBlock(el, ctx, variantOf(el)); if (b) { parts.push(b); blocks.add('cards'); n += 1; } continue; }
    if (el.matches('.bento') && !el.querySelector('ul[data-slot]')) { for (const card of qa(el, ':scope > .card')) { parts.push(singleCard(card, ctx, singles[[...card.classList].find((k) => singles[k])] || 'note')); blocks.add('cards'); n += 1; } continue; }
    if (el.matches('h2, .section-title') || el.matches('p.section-lead, p.lead')) continue;
    if (el.matches('p')) { const s = isBtnPara(el) ? ctas(el, ctx) : `<p>${inline(el, ctx).trim()}</p>`; if (s.trim() && s !== '<p></p>') parts.push(s); continue; }
    if (el.matches('ul, ol') && el.querySelector('li .card-body')) { const b = bentoBlock(el, ctx, variantOf(el)); if (b) { parts.push(b); blocks.add('cards'); n += 1; } continue; }
    parts.push(tidyProse(linkListify(prose({ childNodes: [el] }, ctx))));
  }
  if (!blocks.size) return null;
  return { html: section(parts, { style: hubStyle(root, hasLead(root) ? 'head-centered' : null, n > 1 ? 'stack' : null, ...style) }), blocks: [...blocks] };
}

/* ---- visual-nav: the doors (photo cards) + the small doors (icon cards) — one bento 6 px under the hero ---- */
function visualNav(root, ctx) {
  const r = hubCards(root, ctx, { style: [q(root, ':scope > .container > h2') ? null : 'bento-top'] });
  if (!r) return null;
  ctx.notes.push('visual-nav: cards (doors cols-4) + cards (small cols-4) — one row per door [photo | icon][h2 link, line]; section `bento-top, stack` keeps the 6 px bento gutters under the hero');
  return r;
}

/* ---- shortcut-row: h2 + a list of arrow links → DEFAULT CONTENT with the `shortcuts` section style (D1/D5): one Syrin card, links in four columns ---- */
function shortcutRow(root, ctx) {
  const ul = q(root, 'ul'); if (!ul) return null;
  const h = q(root, 'h2');
  const items = qa(ul, ':scope > li').map((li) => { const a = q(li, 'a'); return a ? `<li><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></li>` : ''; }).join('');
  ctx.notes.push('shortcut-row: prose h2 + ul of links (David\'s Model D5 simple list); section style `shortcuts` paints the Syrin card, the four-column link grid and the chevrons');
  return { html: section([h ? `<h2>${inline(h, ctx)}</h2>` : '', `<ul>${items}</ul>`], { style: hubStyle(root, 'shortcuts') }), blocks: [] };
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
  ctx.notes.push('cobranding: bespoke disclosure block (details/summary → head row + hidden panel, accordion.js pattern) painted as one Sand card (styles-hub.css); the toggle label is authored text outside the <button>');
  return { html: section([block('cobranding', [], rows)], { style: hubStyle(root) }), blocks: ['cobranding'] };
}

/* ---- split-media (hub): a bento of cards (help columns) → cards (help cols-2); otherwise the core split (media card 5 + text card 7) ---- */
export function hubSplit(root, ctx) {
  if (q(root, 'ul[data-slot="cards"]')) return hubCards(root, ctx);
  const r = splitMedia(root, ctx); if (!r) return null;
  if (q(root, '.split-card.card--frost')) r.html = r.html.replace(/<div class="columns split([^"]*)">/, '<div class="columns split$1 frost">');
  return r;
}

/* ---- promo-band: one or several `li.card.promo` → cards (promo [promo-N] cols-N); the kundeservice invites ride a full-bleed section ---- */
export function hubPromo(root, ctx) {
  const r = hubCards(root, ctx); if (!r) return null;
  ctx.notes.push('promo-band: cards (promo) — one row per promo [spot illustration][h2, line, CTA]; the illustration sits beside the teaser on the card tint (cards-hub.css)');
  return r;
}

/* ---- callout (hub group): canon .callout / .callout-rich → callout (tip|info|frost hub [rich] [cta]) ---- */
export function hubCallout(root, ctx) {
  const co = q(root, '.callout'); if (!co) return null;
  const variant = cls(co).includes('info') ? 'info' : cls(co).includes('callout-frost') ? 'frost' : 'tip';
  const body = q(co, '.callout-text, .callout-body') || co;
  ctx.notes.push('lint D1 callout: designed compound (canon icon + Sand sheet), Block Collection-shaped single cell of prose — kept as a block like the product archetype');
  return { html: section([head(root, ctx), block('callout', [variant, 'hub', cls(co).includes('callout-rich') ? 'rich' : null, q(body, 'a.btn') ? 'cta' : null], [[keepNbsp(body, () => tidyProse(linkListify(prose(body, ctx))))]])], { style: hubStyle(root) }), blocks: ['callout'] };
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
    .replace(/(?<!<em>)<strong>([^<]*)(<a [^>]*>[^<]*<\/a>)([^<]*)<\/strong>(?!<\/em>)/g, (m, a, link, b) => `${a.trim() ? `<strong>${a}</strong>` : ''}${link}${b.trim() ? `<strong>${b}</strong>` : ''}`)
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
export function proseExcept(container, back, ctx) {
  let out = '';
  for (const n of container.children) {
    if (n === back) continue;
    if (back && n.contains(back)) { if (n.children.length <= 1 && !n.textContent.replace(txt(back), '').trim()) continue; out += proseExcept(n, back, ctx); continue; }
    if (n.matches('form')) continue;
    out += n.matches('p') && isBtnPara(n) ? ctas(n, ctx) : prose({ childNodes: [n] }, ctx);
  }
  return out;
}
/** A table cell → block-cell HTML (several paragraphs kept, else one paragraph). */
const cellHtml = (cell, ctx) => (q(cell, 'p, ul, ol') ? prose(cell, ctx) : `<p>${inline(cell, ctx).trim()}</p>`);

/* ---- page-title (hub, round 01): the hero bento → hero block. Text-only card across 12 → `title` (+ `sand`); text card 5 + photo card 7 →
 *      the base hero; illustration on a Sand tile → `tile`; the captured circle portrait → `portrait`. The back link is the breadcrumbs block. ---- */
export function heroVariants(root) {
  const card = q(root, '.hero-card'); const media = q(root, '.hero-media');
  const v = ['hub'];
  if (!media) v.push('text-only'); else if (media.matches('.hero-portrait')) v.push('portrait'); else if (media.matches('.media-illu')) v.push('tile');
  if (card && card.matches('.card--tint')) v.push('sand');
  return v;
}
export function hubTitle(root, ctx) {
  const back = q(root, 'a.backlink'); const parts = []; const blocks = [];
  if (back) { parts.push(block('breadcrumbs', [], [[`<p><a href="${esc(L.href(back.getAttribute('href') || '', ctx))}">${inline(back, ctx).trim()}</a></p>`]])); blocks.push('breadcrumbs'); }
  const bento = q(root, '.hero-bento');
  if (bento) {
    const text = q(bento, '.hero-card > .card-body, .hero-card') || bento; const img = q(bento, '.hero-media img');
    const v = heroVariants(root);
    parts.push(block('hero', v, [img ? [pic(img, ctx), proseExcept(text, back, ctx)] : [proseExcept(text, back, ctx)]])); blocks.push('hero'); // one cell when there is no media (hero.js takes the first cell as the text cell)
    ctx.notes.push(`page-title: hero (${v.join(' ')}) — ${img ? 'text card 5 + media card 7' : 'one text card across 12'}; h1, leads and CTAs are the text cell${back ? ', the back link rides the breadcrumbs block (moved into the card by hero.js)' : ''}`);
    return { html: section(parts, { style: hubStyle(root) }), blocks };
  }
  const grid = q(root, '.intro-grid');
  if (grid) {
    const img = q(grid, 'figure img, .intro-figure img'); const text = q(grid, '.intro-text') || grid;
    parts.push(block('hero', ['hub', 'intro'], [[proseExcept(text, back, ctx), img ? pic(img, ctx) : '']])); blocks.push('hero');
    return { html: section(parts, { style: hubStyle(root, back ? 'tight-top' : null, 'tight-bottom') }), blocks };
  }
  const c = q(root, ':scope > .container') || root;
  parts.push(proseExcept(c, back, ctx));
  return { html: section(parts, { style: hubStyle(root, 'intro', 'tight-bottom') }), blocks };
}

/* ---- card-grid · related-topics · static-cards · related-products: bento card rails → cards (tips | popular | …) ---- */
export function tileGrid(root, ctx) {
  if (q(root, 'ul[data-slot]')) return hubCards(root, ctx);
  const c = q(root, ':scope > .container') || root; const parts = [head(root, ctx)]; const blocks = [];
  for (const ul of qa(c, ':scope > ul')) { const b = bentoBlock(ul, ctx, cls(ul).includes('card-grid') ? 'tips' : bentoVariant(ul)); if (b) { parts.push(b); blocks.push('cards'); } }
  for (const p of qa(c, ':scope > p:not(.lead):not(.section-lead), :scope > .cta-row')) parts.push(isBtnPara(p) ? ctas(p, ctx) : `<p>${inline(p, ctx).trim()}</p>`);
  if (!blocks.length) return null;
  return { html: section(parts, { style: hubStyle(root, hasLead(root) ? 'head-centered' : null) }), blocks: [...new Set(blocks)] };
}

/* ---- usp: icon + title + line cards → cards (usp) ---- */
function usp(root, ctx) { return hubCards(root, ctx, { variantOf: () => 'usp' }); }

/* ---- image: a lone illustration movement → DEFAULT CONTENT image with the `figure` section style (D1) ---- */
function image(root, ctx) {
  const img = q(root, 'img'); if (!img) return null;
  return { html: section([pic(img, ctx)], { style: hubStyle(root, 'figure') }), blocks: [] };
}

/* ---- text-and-image: split bento (media card + text card) → the core split; legacy figure + text → columns (split illu) ---- */
function textAndImage(root, ctx) {
  if (q(root, '.split-bento')) return hubSplit(root, ctx);
  const fig = q(root, 'figure, .split-media'); const text = q(root, '.split-text') || q(root, ':scope > .container');
  const media = qa(fig, 'img').map((i) => pic(i, ctx)).join('');
  const reverse = !!(fig && text && (fig.compareDocumentPosition(text) & 2));
  const cells = reverse ? [prose(text, ctx), media] : [media, prose(text, ctx)];
  return { html: section([block('columns', ['split', 'spot', reverse ? 'text-first' : null], [cells])], { style: hubStyle(root) }), blocks: ['columns'] };
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
  for (const d of qa(c, ':scope > details')) {
    const body = q(d, '.disclose-body') || d;
    if (q(body, 'table') && !q(body, '.help-col')) { parts.push(discloseTable(d, ctx)); blocks.push('table'); ctx.notes.push('disclosure: data table behind a toggle → table (disclose): row 1 = toggle label, row 2 = heading, then header + rows'); continue; }
    unwrapLayoutTables(body);
    let ans = '';
    for (const part of [...body.children].length ? [...body.children] : [body]) { const pc = qa(part, '.help-col, li.card'); for (const piece of pc.length ? pc : [part]) ans += prose(piece, ctx); }
    ans = tidyProse(linkListify(ans));
    parts.push(block('accordion', ['disclose'], [[`<p>${inline(q(d, 'summary'), ctx).trim()}</p>`, ans]])); blocks.push('accordion');
    ctx.notes.push('disclosure: toggle + prose → accordion (disclose), one row [label][prose] — nested cards are flattened in reading order (D2)');
  }
  if (!blocks.length) return null;
  return { html: section(parts, { style: hubStyle(root, hasLead(root) ? 'head-centered' : null) }), blocks: [...new Set(blocks)] };
}

/* ---- faq (hub, shared): h3 question rows; answers flattened (layout tables unwrapped, link lines → lists); the per-answer rating → `rate` chrome ---- */
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
  return { html: section(parts, { style: hubStyle(root, aside ? 'faq-aside' : null, hasLead(root) ? 'head-centered' : null) }), blocks: ['accordion'] };
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

/* ---- rich-text (hub): the core prose, start-aligned in the container (canon .prose-wrap) instead of the centred `prose-narrow` ---- */
export function hubRichText(root, ctx) {
  const r = richText(root, ctx); if (!r) return r;
  r.html = r.html.replace('<div>prose-narrow</div>', '<div>prose-hub</div>').replace(/<div>([^<]*), prose-narrow<\/div>/, '<div>$1, prose-hub</div>');
  return r;
}

/* ---- cta-row (sibling): a lone row of pills → default content CTAs ---- */
function ctaRow(root, ctx) { const c = q(root, ':scope > .container') || root; const html = qa(c, 'a').map((a) => L.ctaHtml(a, ctx)).join(''); return html ? { html: section([html], { style: hubStyle(root, 'flush-top') }), blocks: [] } : null; }

export default {
  'page-title': hubTitle,
  faq: hubFaq,
  'card-grid': tileGrid, 'related-topics': tileGrid, 'static-cards': tileGrid, 'related-products': tileGrid, card: tileGrid,
  usp, image, 'text-and-image': textAndImage, disclosure, 'accordion-list': accordionList, tabs: accordionList, 'currency-converter': currencyConverter, 'cta-row': ctaRow,
  'visual-nav': visualNav,
  callout: hubCallout,
  'split-media': hubSplit,
  'shortcut-row': shortcutRow,
  cobranding,
  'promo-band': hubPromo,
  'rich-text': hubRichText,
};
