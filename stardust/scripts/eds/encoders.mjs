/**
 * stardust/scripts/eds/encoders.mjs — core ENCODE map: migrated redesign module (section[data-module]) → DA section(s).
 * Input vocabulary = the canon modules as rendered by the family renderers (stardust/scripts/proto/pages/*.mjs).
 * Block set (David's Model, D9 small library + variants): hero · breadcrumbs · cards (choices|tips|news|price|tiles|topics|tools|doors|small|advisers)
 * · columns (split|promo|help|sheets|index) · accordion (faq|more) · feedback · callout (tip|info|frost) · calculator · table · cobranding
 * · video/embed (auto-blocked from links) · fragment (router) · header · footer · bank-router.
 * Prose (page-title/intro, rich-text, cta-band, story chapters, address) is DEFAULT CONTENT with a section `style` (D1).
 * Each encoder returns { html: <section html> | [sections], blocks: [names] } or null (converter falls back to prose + logs a gap).
 */
import * as L from './lib.mjs';

const { esc, q, qa, cls, txt, inline, prose, ctaHtml, ctas, imgHtml, pic, block, section, styleOf, paperOf } = L;

/** Section style from the movement's classes + explicit modifiers. */
function styleFor(root, ...extra) {
  const c = cls(root);
  const mods = [];
  if (c.includes('feedback') && !c.includes('movement')) mods.push('feedback-band');
  if (c.includes('compare')) mods.push('flush-top');
  if (c.includes('hero') && !c.includes('campaign')) mods.push('tight-top');
  if (c.includes('intro')) mods.push('intro', 'tight-bottom');
  if (root.getAttribute && root.getAttribute('data-layout') === 'full-bleed-grid') mods.push('full-bleed');
  return styleOf(paperOf(root), ...mods, ...extra);
}

/** The section heading (h2.section-title or the first h2 directly under .container) as default content. */
function sectionHead(root, ctx, { skip = [] } = {}) {
  const h = q(root, ':scope > .container > h2.section-title, :scope > .container > .section-title, :scope > .container > h2, :scope > .container > .title, :scope > .container > .reg-title, :scope > .container > .bento > .card > .card-body > h2.section-title, :scope > .container > .bento > .card > .card-body > .section-title');
  if (!h || skip.includes(h)) return '';
  return `<${h.tagName.toLowerCase() === 'h2' ? 'h2' : 'h2'}>${inline(h, ctx)}</h2>`;
}

/* ------------------------------------------------------------- cards ------------------------------------------------------------- */
/** One DA row per card: [media?][body: title link (heading), text p's, meta]. Same shape for every row (D3). */
export function cardRows(items, ctx, { level = 'h3' } = {}) {
  return items.map((li) => {
    const img = q(li, 'img'); const title = q(li, '.card-title, .tile-title, .news-title, .feat-title, .tool-title, .rail-title, h2, h3');
    const titleLink = title ? (title.tagName === 'A' ? title : q(title, 'a')) : q(li, ':scope > a');
    const lvl = title ? (title.tagName.match(/^H[1-6]$/) ? title.tagName.toLowerCase() : level) : level;
    let body = '';
    if (title) body += titleLink ? `<${lvl}><a href="${esc(L.href(titleLink.getAttribute('href') || '', ctx))}">${inline(titleLink, ctx)}</a></${lvl}>` : `<${lvl}>${inline(title, ctx)}</${lvl}>`;
    for (const p of qa(li, 'p')) { if (title && title.contains(p)) continue; const s = inline(p, ctx).trim(); if (!s) continue; body += cls(p).includes('meta') ? `<p><em>${s}</em></p>` : /class="btn/.test(p.innerHTML) || /class="link-more/.test(p.innerHTML) ? ctas(p, ctx) : `<p>${s}</p>`; }
    for (const ul of qa(li, ':scope > ul, :scope > .tile-links, :scope > .link-list, :scope > .card-body > ul, :scope > .card-body > .link-list')) body += L.list(ul, ctx);
    if (!title && !body) body = prose(li, ctx);
    return [img ? pic(img, ctx) : '', body];
  });
}
const VARIANT = { 'choice-grid': 'choices', 'tips-grid': 'tips', 'news-grid': 'news', 'price-grid': 'price', tiles: 'tiles', 'door-grid': 'doors', 'small-grid': 'small', 'pop-grid': 'popular', topics: 'topics', tools: 'tools', 'rec-grid': 'tips', 'art-grid': 'articles', advisers: 'advisers', 'rail-list': 'rail' , news: 'news', products: 'tiles', index: 'index' };
export function cardRail(root, ctx) {
  const lists = qa(root, 'ul[data-slot="cards"], ul[data-slot="cards-small"], ul.tiles, ul.advisers, ul.topics, ul.tools, ol[data-slot="cards"]');
  if (!lists.length) return null;
  const parts = [sectionHead(root, ctx)]; const blocks = [];
  for (const ul of lists) {
    const items = qa(ul, ':scope > li'); if (!items.length) continue;
    const variant = cls(ul).map((c) => VARIANT[c]).find(Boolean) || 'flat';
    parts.push(block('cards', [variant], cardRows(items, ctx))); blocks.push('cards');
  }
  // trailing promo band inside the same movement (product choices) or a trailing CTA / paragraph
  const promo = q(root, 'article.promo, .promo'); if (promo) { parts.push(promoRow(promo, ctx)); blocks.push('columns'); }
  for (const p of qa(root, ':scope > .container > p, :scope > .container > .price-foot > p, :scope > .container > .art-more')) { const s = inline(p, ctx).trim(); if (!s) continue; parts.push(/class="btn|class="link-more/.test(p.innerHTML) ? ctas(p, ctx) : `<p>${s}</p>`); }
  return { html: section(parts, { style: styleFor(root) }), blocks: [...new Set(blocks)] };
}

/* ------------------------------------------------------------- columns (split-media · promo · help) ------------------------------------------------------------- */
function textCell(el, ctx) { return prose(el, ctx); }
const promoImg = (promo) => q(promo, 'img') || (promo.previousElementSibling && promo.previousElementSibling.matches('.promo-art') ? q(promo.previousElementSibling, 'img') : null);
export function promoRow(promo, ctx) {
  const img = promoImg(promo); const text = q(promo, '.promo-text, .card-body') || promo;
  return block('columns', ['promo'], [[img ? pic(img, ctx) : '', textCell(text, ctx)]]);
}
export function promoBand(root, ctx) {
  const promos = qa(root, 'article.promo, .promo'); if (!promos.length) return null;
  const parts = [sectionHead(root, ctx), block('columns', ['promo', promos.length > 1 ? `promo-${promos.length}` : null], promos.map((p) => { const img = promoImg(p); return [img ? pic(img, ctx) : '', textCell(q(p, '.promo-text, .card-body') || p, ctx)]; }))];
  return { html: section(parts, { style: styleFor(root) }), blocks: ['columns'] };
}
/** Split media: figure + text in either order → columns (split) keeping the authored order; `reverse` when the text comes first. */
export function splitMedia(root, ctx) {
  const grids = qa(root, ':scope > .container > .bento').length ? qa(root, ':scope > .container > .bento') : qa(root, ':scope > .container, :scope > .container > .split-row, :scope > .container > .slide, :scope > .container > .help-col, :scope > .container > .rows > .split-row');
  const rowsOf = (grid) => {
    const kids = [...grid.children].filter((k) => k.tagName !== 'H2' || !k.classList.contains('section-title'));
    const media = kids.find((k) => k.matches('figure, img, .hero-media, .q-media, .q-photo, .hero-photo, .res-media, .prev-media, .slide-media, .expert, .video-frame, .reopen-media, .steps-media') || (k.querySelector('img') && !k.querySelector('h1,h2,h3,p')));
    const text = kids.find((k) => k !== media && (k.querySelector('h1,h2,h3,p,ul') || k.matches('p')));
    if (!media && !text) return null;
    const mediaHtml = media ? (media.matches('a.video-frame') ? `<p><a href="${esc(media.getAttribute('href'))}">${esc(media.getAttribute('href'))}</a></p>` : pic(q(media, 'img') || media, ctx)) : '';
    const order = media && text && media.compareDocumentPosition(text) & 2 ? 'reverse' : 'normal';
    return { cells: order === 'reverse' ? [textCell(text, ctx), mediaHtml] : [mediaHtml, textCell(text, ctx)], order };
  };
  const rows = grids.map(rowsOf).filter(Boolean); if (!rows.length) return null;
  const head = sectionHead(root, ctx);
  const variant = rows.length > 1 ? 'rows' : rows[0].order === 'reverse' ? 'text-first' : null;
  return { html: section([head, block('columns', ['split', variant, cls(root).find((c) => ['help', 'questions', 'resident', 'prevention', 'reopen', 'steps', 'lokale', 'presserom', 'slides'].includes(c))].filter(Boolean), rows.map((r) => r.cells))], { style: styleFor(root) }), blocks: ['columns'] };
}

/* ------------------------------------------------------------- hero ------------------------------------------------------------- */
export function productHero(root, ctx) {
  const back = q(root, 'a.backlink'); const media = q(root, '.hero-media img, figure img, .campaign-media img, .hero-photo img'); const text = q(root, '.hero-text, .campaign-text > .card-body, .campaign-text, .hero-card > .card-body, .hero-card');
  const parts = [];
  if (back) parts.push(block('breadcrumbs', [], [[`<p><a href="${esc(L.href(back.getAttribute('href') || '', ctx))}">${inline(back, ctx).trim()}</a></p>`]]));
  const variant = cls(root).includes('campaign') ? 'campaign' : 'product';
  let textNode = text; if (back && text && text.contains(back)) { textNode = text.cloneNode(true); const bl = q(textNode, 'a.backlink'); (bl.closest('p, .backlink-row') || bl).remove(); } // the back link is the breadcrumbs block, not hero prose
  const body = ctx.hiddenH1 && !q(textNode, 'h1') ? `<h1>${inline(ctx.hiddenH1, ctx)}</h1>${textCell(textNode, ctx)}` : textCell(textNode, ctx);
  if (ctx.hiddenH1) { ctx.notes.push('market landing: the visually-hidden h1 is authored as the hero h1 (block hides it visually)'); ctx.hiddenH1 = null; }
  parts.push(block('hero', [variant], [[media ? pic(media, ctx) : '', body]]));
  return { html: section(parts, { style: styleFor(root) }), blocks: [...new Set(['hero', ...(back ? ['breadcrumbs'] : [])])] };
}
/** Intro / page-title movements: backlink (breadcrumbs) + h1 + lead as default content. */
export function pageTitle(root, ctx) {
  const back = q(root, 'a.backlink'); const parts = [];
  if (back) parts.push(block('breadcrumbs', [], [[`<p><a href="${esc(L.href(back.getAttribute('href') || '', ctx))}">${inline(back, ctx).trim()}</a></p>`]]));
  const c = q(root, ':scope > .container') || root;
  for (const n of c.children) { if (n === back || n.contains(back)) continue; parts.push(prose({ childNodes: [n] }, ctx)); }
  return { html: section(parts, { style: styleFor(root) }), blocks: back ? ['breadcrumbs'] : [] };
}

/* ------------------------------------------------------------- price cards · calculator · faq · feedback · callout ------------------------------------------------------------- */
export function priceCards(root, ctx) { return cardRail(root, ctx); }

export function calculator(root, ctx) {
  ctx.notes.push('lint D1 calculator: bespoke widget (dynamics #7 interim static shell — controls disabled, captured strings; labels/values are control config, @ew-exempt in the block)');
  const calc = q(root, '.calc'); if (!calc) return null;
  const rows = [];
  const tabs = qa(calc, '.calc-tab'); if (tabs.length) rows.push([`<p><strong>Faner</strong></p>`, `<ul>${tabs.map((t) => `<li>${esc(txt(t))}</li>`).join('')}</ul>`]);
  for (const fs of qa(calc, 'fieldset.calc-pills')) rows.push([`<p>${esc(txt(q(fs, 'legend')))}</p>`, `<ul>${qa(fs, '.pill span').map((s) => `<li>${esc(txt(s))}</li>`).join('')}</ul>`]);
  for (const f of qa(calc, '.field')) rows.push([`<p>${esc(txt(q(f, 'label')))}</p>`, `<p>${esc(q(f, 'input')?.getAttribute('value') || '')}</p>`]);
  const rl = q(calc, '.calc-result-label'); const rv = q(calc, '.calc-result-value'); if (rl) rows.push([`<p>${esc(txt(rl))}</p>`, `<p>${esc(txt(rv))}</p>`]);
  const cta = q(calc, '.calc-ctas'); if (cta) rows.push([ctas(cta, ctx)]);
  for (const n of qa(calc, '.calc-note')) rows.push([`<p>${inline(n, ctx)}</p>`]);
  return { html: section([sectionHead(root, ctx), block('calculator', [], rows)], { style: styleFor(root) }), blocks: ['calculator'] };
}

export function faq(root, ctx) {
  const wrap = q(root, '.faq[data-slot="items"], .faq, [data-slot="items"]'); if (!wrap) return null;
  const item = (d) => { const s = q(d, 'summary'); const qEl = q(s, 'h3, h2, .faq-q') || s; const a = q(d, '.answer, .answer-wide'); return [`<h3>${inline(qEl, ctx).trim()}</h3>`, a ? prose(a, ctx) : '']; }; // the question keeps the canon's heading rank (h3) — role-faithful and editable
  const shown = qa(wrap, ':scope > details:not(.faq-more)').map(item);
  const parts = [sectionHead(root, ctx), block('accordion', ['faq'], shown)];
  const more = q(wrap, ':scope > details.faq-more');
  if (more) { const label = q(more, 'summary'); parts.push(block('accordion', ['faq', 'more'], [[`<p>${inline(label, ctx).trim()}</p>`], ...qa(more, '.faq-more-items > details').map(item)])); }
  return { html: section(parts, { style: styleFor(root) }), blocks: ['accordion'] };
}

export function feedback(root, ctx) {
  ctx.notes.push('lint D1 feedback: interactive widget (dynamics #5 interim — static thumbs); the row carries the question and the two labels');
  const h = q(root, 'h2, .feedback-q'); const btns = qa(root, 'button');
  const labels = btns.map((b) => txt(q(b, 'span')) || b.getAttribute('aria-label') || txt(b));
  const level = h && /^H/.test(h.tagName) ? h.tagName.toLowerCase() : 'p';
  const visible = btns.some((b) => q(b, 'span:not(.visually-hidden)') || (!q(b, 'span') && txt(b))); // presse / markedsnytt show the labels; product pages hide them
  return { html: section([block('feedback', [visible ? 'labels' : null], [[`<${level}>${inline(h, ctx)}</${level}>`, `<p>${esc(labels[0] || 'Ja')}</p>`, `<p>${esc(labels[1] || 'Nei')}</p>`]])], { style: styleFor(root) }), blocks: ['feedback'] };
}

export function callout(root, ctx) {
  const co = q(root, '.callout'); if (!co) return null;
  const variant = cls(co).includes('info') ? 'info' : cls(co).includes('callout-frost') ? 'frost' : 'tip';
  const body = q(co, '.callout-text, .callout-body') || co;
  return { html: section([sectionHead(root, ctx), block('callout', [variant], [[prose(body, ctx)]])], { style: styleFor(root) }), blocks: ['callout'] };
}

/* ------------------------------------------------------------- prose movements ------------------------------------------------------------- */
export function ctaBand(root, ctx) {
  const c = q(root, '.cta-band') || q(root, ':scope > .container') || root;
  return { html: section([prose(c, ctx)], { style: styleFor(root, 'compare') }), blocks: [] };
}
export function richText(root, ctx) {
  const c = q(root, ':scope > .container') || root;
  const html = prose(c, ctx); if (!html.trim()) return null;
  return { html: section([html], { style: styleFor(root, 'prose-narrow') }), blocks: [] };
}

/** hero-bento (market landing): the router tile is chrome (the /fragments/bank-router section precedes the hero); the campaign cells convert as the campaign hero. */
export function heroBento(root, ctx) { const camp = q(root, '[data-module="campaign-carousel"], .campaign'); return camp ? productHero(camp, ctx) : null; }

export const ENCODERS = {
  'hero-bento': heroBento,
  'product-hero': productHero, 'campaign-carousel': productHero, campaign: productHero,
  'page-title': pageTitle,
  'card-rail': cardRail, 'price-cards': priceCards, 'related-products': cardRail, 'visual-nav': cardRail, 'topic-tiles': cardRail, 'content-columns': cardRail,
  'promo-band': promoBand, 'split-media': splitMedia,
  calculator, faq, feedback, callout,
  'cta-band': ctaBand, 'rich-text': richText,
};
