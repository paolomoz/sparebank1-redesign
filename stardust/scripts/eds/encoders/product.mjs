/**
 * stardust/scripts/eds/encoders/product.mjs — product family (archetype nb-bank-privat-lan-boliglan-html, LIVE) — worker E5.
 * The archetype converts through the CORE encoders unchanged: every override below delegates to its core function unless a
 * sibling-only shape (renderSibling walker, stardust/scripts/proto/pages/nb-bank-privat-lan-boliglan-html.mjs § SIB_CSS) is present.
 * Overrides (product pages only): product-hero (`illu` · `usp` variants), page-title (intro rhythm), card-rail (grid-N · link-cards ·
 * illustration cards · lede / foot prose · CTAs in cards), content-columns (`.cols` → columns cols-N; cards / callout / disclosure
 * extraction), split-media (`media-right` → text-first · YouTube link as the media cell), promo-band (`extra` logo), rich-text
 * (disclosures → accordion disclosure), cobranding (always-open co-brand → columns cobrand), steps (numbered cards).
 * New shared keys: price-terms (default content, `price-terms` style) · shortcuts (default content, `shortcut-pills` style) ·
 * people-cards (cards bios) · table (table compare) · topic-list (default content + accordion) · guide-list (cards guide) · accordion (faq + lead).
 * Group CSS: blocks/{hero,cards,columns,accordion}/<block>-product.css · styles/styles-product.css.
 */
import * as L from '../lib.mjs';
import { cardRail, splitMedia, promoBand, productHero, pageTitle, richText, faq, calculator } from '../encoders.mjs';

const { q, qa, cls, txt, inline, prose, ctaHtml, ctas, pic, block, section, styleOf, paperOf, esc } = L;

/* ------------------------------------------------------------- helpers ------------------------------------------------------------- */
/** Section style from the movement's classes (same rules as the core styleFor, which is not exported). */
function style(root, ...extra) {
  const c = cls(root); const mods = [];
  if (c.includes('feedback') && !c.includes('movement')) mods.push('feedback-band');
  if (c.includes('compare')) mods.push('flush-top');
  if (c.includes('hero') && !c.includes('campaign')) mods.push('tight-top');
  return styleOf(paperOf(root), ...mods, ...extra);
}
/** The movement's section-title h2 as default content. */
function head(root, ctx) {
  const h = q(root, ':scope > .container > h2.section-title, :scope > .container > h2, :scope > .container > .topics > h2, :scope > .container > .steps-wrap > h2, :scope > .container > .bento > .card > .card-body > h2.section-title');
  return h ? `<h2>${inline(h, ctx)}</h2>` : '';
}
/** Add variant tokens to the first `<div class="<name>…">` of a section html (same trick as theme.mjs). */
const addVariant = (html, name, ...tokens) => { const t = tokens.filter(Boolean); return t.length ? html.replace(new RegExp(`<div class="${name}( [a-z0-9 -]+)?">`), (m, v) => `<div class="${name}${v || ''} ${t.join(' ')}">`) : html; };
/** Replace the section `style` of a section html produced by L.section(). */
function restyle(html, st) { const i = html.lastIndexOf('<div class="section-metadata">'); const body = i > -1 ? html.slice(0, i) : html.slice(0, -'</div>'.length); return `${body}${L.sectionMeta({ style: st })}</div>`; }
/** Trailing / leading <br> runs inside paragraphs (captured editor residue) → dropped; runs of &nbsp; → one space. */
const tidy = (html) => html.replace(/(?:\s|<br>|&nbsp;)+<\/(p|li|h[1-6])>/g, '</$1>').replace(/<(p|li)>(?:\s|<br>|&nbsp;)+/g, '<$1>').replace(/<p><\/p>/g, '');

/**
 * Pre-clean a sibling module root (in memory, once): the walker keeps some captured UI that is not content —
 * phone-only duplicate CTAs (lenker.sparebank1.no app deep links: the desktop URL is the canonical one), hidden `.faq-link`
 * spans, login dialogs, carousel indicators/arrows, glossary toggles (the word stays, the definition text stays as prose).
 */
function prep(root, ctx) {
  if (root.__prepped) return; root.__prepped = true;
  const phone = qa(root, '.only-phone'); if (phone.length) { ctx.notes.push(`prep: ${phone.length} phone-only duplicate CTA(s) (app deep links, hidden ≥ 768 in the canon) dropped — the desktop link is the authored one (dynamics: app-link redirect)`); phone.forEach((n) => n.remove()); }
  // the canon's per-question article link (a.faq-link, visually-hidden label = the question) stays: like the core faq on the archetype it is
  // authored as the answer's closing link paragraph (verbatim label) — a visible "read the full answer" link, never hidden copy (D15)
  for (const n of qa(root, '.visually-hidden, dialog, .cmp-carousel__indicators, .guide__indicators, .cmp-carousel__action, .comparison__filter-button, .scroll-indicator__dot, button.textcf__fragment--close, .guide-count')) { if (n.closest('a.faq-link')) continue; n.remove(); }
  for (const b of qa(root, 'button.textcf__text-glossary')) { const s = root.ownerDocument.createElement('span'); s.textContent = txt(b); b.replaceWith(s); }
  for (const p of qa(root, 'p')) { if (!p.textContent.replace(/ /g, ' ').trim() && !p.querySelector('img, a')) p.remove(); }
}
const ARCHETYPE = 'nb-bank-privat-lan-boliglan-html';
/** Sibling-only pre-clean + tidy; the LIVE archetype bypasses both and converts through the core path (verified byte-identical). */
const wrap = (fn) => (root, ctx) => { if (ctx.slug === ARCHETYPE) return fn(root, ctx); prep(root, ctx); const r = fn(root, ctx); if (r && typeof r.html === 'string') r.html = tidy(r.html); return r; };

/* ------------------------------------------------------------- cards (product sibling shapes) ------------------------------------------------------------- */
/** One DA row per card, children in AUTHORED order: [media?][headings (link kept), paragraphs, <em>meta</em>, lists, prose, CTAs]. */
function rows(items, ctx) {
  return items.map((li) => {
    let media = ''; let body = '';
    for (const n of li.children) {
      const t = n.tagName.toLowerCase();
      if ((t === 'img' || t === 'figure' || t === 'picture') && !media) { media = pic(q(n, 'img') || n, ctx); continue; }
      if (/^h[1-6]$/.test(t)) { const a = q(n, 'a'); const tag = t === 'h2' ? 'h3' : t; body += a ? `<${tag}><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></${tag}>` : `<${tag}>${inline(n, ctx).trim()}</${tag}>`; continue; }
      if (t === 'p' && cls(n).includes('meta')) { const s = inline(n, ctx).trim(); if (s) body += `<p><em>${s}</em></p>`; continue; }
      if (t === 'p' && q(n, 'a.btn')) { body += ctas(n, ctx); continue; }
      if (t === 'a' && cls(n).includes('btn')) { body += ctaHtml(n, ctx); continue; }
      if (t === 'p') { const s = inline(n, ctx).trim(); if (s) body += `<p>${s}</p>`; continue; }
      if (t === 'ul' || t === 'ol') { body += L.list(n, ctx); continue; }
      body += prose({ childNodes: [n] }, ctx);
    }
    return media ? [media, body] : [body];
  });
}
const gridOf = (ul) => (cls(ul).find((c) => /^grid-[1-4]$/.test(c)) || '').replace('grid-', '');
/** cards block for a sibling list: variant from the list class, `cols-N` from the walker's grid-N, `illu` when every card image is an SVG illustration. */
function cardsBlock(ul, ctx, variant) {
  const items = qa(ul, ':scope > li'); if (!items.length) return null;
  const g = gridOf(ul); const imgs = qa(ul, ':scope > li > img, :scope > li > figure img');
  const nIllu = imgs.filter((i) => /\.svg(\?|$)/i.test(i.getAttribute('src') || '') || cls(i).includes('illu')).length;
  const illu = imgs.length && nIllu * 2 >= imgs.length; // majority of the card images are spot illustrations → contained, no 3:2 crop
  return block('cards', [variant, g ? `cols-${g}` : null, illu ? 'spot' : null], rows(items, ctx).map((x) => (x.length === 1 ? ['', x[0]] : x))); // always [media?][body] (D3 uniform rows)
}
const LIST_VARIANT = { 'choice-grid': 'choices', 'link-cards': 'links', 'tips-grid': 'tips', 'bio-grid': 'bios' };
const listVariant = (ul) => cls(ul).map((c) => LIST_VARIANT[c]).find(Boolean) || 'choices';

/** card-rail (product): sibling grids (grid-N · link-cards · card-illu · lede / foot prose · CTAs inside cards) — else the core cardRail (archetype). */
function productCardRail(root, ctx) {
  const sib = q(root, 'ul[class*="grid-"], ul.link-cards, .section-lede, :scope > .container > .prose, .card-illu, li > .cta-row, li > ul, li > h3 + h3');
  if (!sib) return cardRail(root, ctx);
  const c = q(root, ':scope > .container') || root; const parts = []; const blocks = new Set(); let buf = '';
  const flush = () => { if (buf.trim()) parts.push(buf); buf = ''; };
  for (const n of c.children) {
    const t = n.tagName.toLowerCase();
    if (t === 'ul' && q(n, ':scope > li')) { flush(); const b = cardsBlock(n, ctx, listVariant(n)); if (b) { parts.push(b); blocks.add('cards'); } continue; }
    if ((t === 'article' && cls(n).includes('promo')) || cls(n).includes('promo-row')) { flush(); const art = t === 'article' ? n : (q(n, 'article.promo, .promo') || n); const img = q(art, 'img') || q(n, '.promo-art img') || (art.previousElementSibling && q(art.previousElementSibling, 'img')); parts.push(block('columns', ['promo'], [[img ? pic(img, ctx) : '', prose(q(art, '.promo-text, .card-body') || art, ctx)]])); blocks.add('columns'); continue; }
    if (/^h[1-6]$/.test(t)) { buf += `<h2>${inline(n, ctx)}</h2>`; continue; }
    buf += prose({ childNodes: [n] }, ctx);
  }
  flush();
  const lede = q(c, '.section-lede');
  ctx.notes.push(`card-rail (product): ${qa(c, ':scope > ul').map((u) => `${listVariant(u)}${gridOf(u) ? ` cols-${gridOf(u)}` : ''}`).join(' + ')} — one row per card [media?][headings, text, lists, CTAs] in authored order; head${lede ? ' + lede' : ''} and trailing prose are default content`);
  return { html: section(parts, { style: style(root, lede ? 'lead-first' : null) }), blocks: [...blocks] };
}

/* ------------------------------------------------------------- content-columns: .cols → columns (cols cols-N) ------------------------------------------------------------- */
function contentColumns(root, ctx) {
  const grid = q(root, ':scope > .container > .cols'); if (!grid) return cardRail(root, ctx);
  const cols = qa(grid, ':scope > .col'); if (!cols.length) return richText(root, ctx);
  const parts = [head(root, ctx)]; const blocks = new Set(); const after = [];
  // the walker's 1-card columns (lånekalkulator): a row of title-only choice cards + a trailing link → cards (choices cols-N) + default content
  const cardCols = cols.filter((c) => q(c, ':scope > ul.choice-grid'));
  if (cardCols.length && cols.every((c) => q(c, ':scope > ul.choice-grid') || !q(c, 'h1,h2,h3,img'))) {
    const items = cardCols.flatMap((c) => qa(c, ':scope > ul.choice-grid > li'));
    parts.push(block('cards', ['choices', `cols-${Math.min(items.length, 4)}`], rows(items, ctx).map((x) => (x.length === 1 ? ['', x[0]] : x)))); blocks.add('cards');
    for (const c of cols) if (!cardCols.includes(c)) parts.push(prose(c, ctx));
    ctx.notes.push('content-columns (product): the walker\'s one-card columns are one cards (choices) block, the trailing link is default content');
    return { html: section(parts, { style: style(root) }), blocks: [...blocks] };
  }
  // D2: a callout or a disclosure inside a column cannot nest — it follows the columns block as its own block (same section)
  for (const co of qa(grid, '.callout')) { after.push(block('callout', [cls(co).includes('info') ? 'info' : 'tip'], [[prose(q(co, '.callout-text') || co, ctx)]])); blocks.add('callout'); co.remove(); ctx.notes.push('content-columns (product): a callout authored inside a column follows the columns block as a callout (D2 — no nested blocks)'); }
  for (const d of qa(grid, 'details.disclosure')) { after.push(disclosure(d, ctx)); blocks.add('accordion'); d.remove(); ctx.notes.push('content-columns (product): a disclosure inside a column follows the columns block as an accordion (disclosure) (D2)'); }
  const imgs = qa(grid, 'img'); const illu = imgs.length && imgs.every((i) => /\.svg(\?|$)/i.test(i.getAttribute('src') || ''));
  const live = cols.filter((c) => c.textContent.trim() || q(c, 'img'));
  if (live.length <= 1) { // D1: one remaining column is prose, not a one-cell block
    if (live.length) parts.push(prose(live[0], ctx));
    parts.push(...after);
    ctx.notes.push('content-columns (product): a single remaining column (the other was a callout / disclosure, now its own block) is default content (D1), the extracted block follows');
    return { html: section(parts, { style: style(root, 'prose-start') }), blocks: [...blocks] };
  }
  parts.push(block('columns', ['cols', `cols-${Math.min(live.length, 4)}`, illu ? 'spot' : null], [live.map((c) => prose(c, ctx))])); blocks.add('columns');
  parts.push(...after);
  ctx.notes.push(`content-columns (product): columns (cols cols-${Math.min(live.length, 4)}${illu ? ' spot' : ''}) — one row, one cell per authored column (verbatim prose)`);
  return { html: section(parts, { style: style(root) }), blocks: [...blocks] };
}

/* ------------------------------------------------------------- split-media: media-right → text-first · video link as media ------------------------------------------------------------- */
function productSplit(root, ctx) {
  const right = cls(root).includes('media-right'); const video = q(root, '.q-media .video-link a[href], .q-media a.video-frame');
  if (!right && !video) return splitMedia(root, ctx);
  const media = q(root, '.q-media'); const text = q(root, '.q-text');
  const textHtml = prose(text, ctx);
  if (video) {
    // D1: a video URL is never authored inside a block — plain link in default content, auto-blocked to `embed` by scripts.js;
    // the `video-split` section style lays the embed and the prose side by side (5/7, or 7/5 when the text comes first).
    const link = `<p><a href="${esc(video.getAttribute('href'))}">${inline(video, ctx).trim()}</a></p>`;
    ctx.notes.push(`split-media (product): the canon video link (${esc(video.getAttribute('href'))}) is a plain default-content link → auto-blocked embed (D1); section style \`video-split\` keeps the canon split (${right ? 'text 7 / video 5' : 'video 5 / text 7'})`);
    return { html: section([head(root, ctx), ...(right ? [textHtml, link] : [link, textHtml])], { style: style(root, 'video-split') }), blocks: ['embed'] };
  }
  const img = q(media, 'img'); const mediaHtml = img ? pic(img, ctx) : '';
  const cells = right ? [textHtml, mediaHtml] : [mediaHtml, textHtml];
  ctx.notes.push('split-media (product): canon `media-right` (text 7 / media 5) → columns (split text-first), cells in the visual order');
  return { html: section([head(root, ctx), block('columns', ['split', 'text-first'], [cells])], { style: style(root) }), blocks: ['columns'] };
}

/* ------------------------------------------------------------- promo-band: `extra` (second logo after the text) ------------------------------------------------------------- */
function productPromo(root, ctx) {
  const promo = q(root, 'article.promo, .promo'); const extra = q(promo, '.promo-extra');
  if (!extra) return promoBand(root, ctx);
  const img = q(promo, 'img:not(.promo-extra)');
  ctx.notes.push('promo-band (product): the trailing partner logo is a third media cell — columns (promo extra)');
  return { html: section([head(root, ctx), block('columns', ['promo', 'extra'], [[img ? pic(img, ctx) : '', prose(q(promo, '.promo-text') || promo, ctx), pic(extra, ctx)]])], { style: style(root) }), blocks: ['columns'] };
}

/* ------------------------------------------------------------- disclosures · rich-text ------------------------------------------------------------- */
/** A canon <details class="disclosure"> → accordion (disclosure): one row [label][body]; the label is authored text outside the toggle button (EW7). */
function disclosure(d, ctx) {
  const s = q(d, 'summary'); const body = q(d, ':scope > .prose, :scope > div') || d;
  return block('accordion', ['disclosure'], [[`<p>${inline(s, ctx).trim()}</p>`, prose(body, ctx)]]);
}
function productRichText(root, ctx) {
  const c = q(root, ':scope > .container') || root;
  if (!q(c, 'details.disclosure')) { const r = richText(root, ctx); if (r) r.html = restyle(r.html, style(root, 'prose-start')); return r; } // canon .prose-block is start-aligned
  const parts = []; let buf = '';
  const flush = () => { if (buf.trim()) parts.push(buf); buf = ''; };
  for (const n of c.children) {
    if (n.matches('details.disclosure')) { flush(); parts.push(disclosure(n, ctx)); continue; }
    const nested = qa(n, 'details.disclosure');
    if (nested.length) { const tail = nested.map((d) => { const h = disclosure(d, ctx); d.remove(); return h; }); buf += prose({ childNodes: [n] }, ctx); flush(); parts.push(...tail); continue; }
    buf += prose({ childNodes: [n] }, ctx);
  }
  flush();
  ctx.notes.push('rich-text (product): prose is default content (prose-narrow); each canon disclosure ("Se detaljerte vilkår") is an accordion (disclosure) — one row [label][body], collapsed like the canon <details>');
  return { html: section(parts, { style: style(root, 'prose-start') }), blocks: ['accordion'] };
}

/* ------------------------------------------------------------- hero · page-title ------------------------------------------------------------- */
function heroProduct(root, ctx) {
  const r = productHero(root, ctx); if (!r) return r;
  const illu = q(root, '.hero-media img.illu, .hero-media .hero-illu'); const usp = q(root, '.hero-text ul.usp-list');
  r.html = addVariant(r.html, 'hero', illu ? 'spot' : null, usp ? 'usp' : null);
  if (illu) ctx.notes.push('product-hero (product): SVG illustration instead of a photo → hero (product spot): contained, no 3:2 crop');
  if (usp) ctx.notes.push(`product-hero (product): the canon USP list rides the hero text cell as an authored <ul>${cls(usp).includes('usp-icons') ? ' (icon + line items)' : ''} — hero (usp) paints the check marks / icons`);
  return r;
}
function titleProduct(root, ctx) {
  const r = pageTitle(root, ctx); if (!r) return r;
  r.html = restyle(r.html, styleOf(paperOf(root), 'intro', 'tight-top')); // canon .intro: 16 top, full 64 bottom (the core adds tight-bottom for hub intros)
  return r;
}

/* ------------------------------------------------------------- new shared keys ------------------------------------------------------------- */
/** price-terms: h2 + check list + price notes + one pill → DEFAULT CONTENT (D1), section style `price-terms` (check marks, start-aligned rhythm). */
function priceTerms(root, ctx) {
  const c = q(root, '.price-terms') || q(root, ':scope > .container') || root;
  const html = prose(c, ctx); if (!html.trim()) return null;
  ctx.notes.push('price-terms: prose composition (h2, check list, price example, pill) → default content with the `price-terms` section style (styles-product.css)');
  return { html: section([html], { style: style(root, 'price-terms') }), blocks: [] };
}
/** shortcuts: h2 + a row of secondary pills → DEFAULT CONTENT, one CTA paragraph per shortcut, section style `shortcut-pills`. */
function shortcuts(root, ctx) {
  const ul = q(root, 'ul.shortcut-list'); if (!ul) return null;
  const pills = qa(ul, ':scope > li > a').map((a) => ctaHtml(a, ctx)).join('');
  ctx.notes.push('shortcuts: h2 + one secondary CTA per shortcut as default content (D6 — pills from emphasis); the `shortcut-pills` section style lays the row out');
  return { html: section([head(root, ctx), pills], { style: style(root, 'shortcut-pills') }), blocks: [] };
}
/** people-cards: bio grid → cards (bios): [portrait][name h3, <em>role</em>, bio, "Les mer" link]. An empty list (walker artefact) emits nothing. */
function peopleCards(root, ctx) {
  const ul = q(root, 'ul.bio-grid, ul[data-slot="cards"]'); const items = qa(ul, ':scope > li');
  if (!items.length) { ctx.notes.push('people-cards: empty expert list in the migrated page (0 items) — nothing to author'); return { html: '', blocks: [] }; }
  const r = items.map((li) => {
    const img = q(li, 'img'); const name = q(li, 'h3, h2'); let body = name ? `<h3>${inline(name, ctx).trim()}</h3>` : '';
    for (const p of qa(li, ':scope > p')) { const s = inline(p, ctx).trim(); if (!s) continue; body += cls(p).includes('meta') ? `<p><em>${s}</em></p>` : q(p, 'a.btn') ? ctas(p, ctx) : `<p>${s}</p>`; }
    return [img ? pic(img, ctx) : '', body];
  });
  ctx.notes.push(`people-cards: cards (bios${gridOf(ul) ? ` cols-${gridOf(ul)}` : ''}) — one row per expert [photo][name, role as <em>, bio, "Les mer" link]`);
  return { html: section([head(root, ctx), block('cards', ['bios', gridOf(ul) ? `cols-${gridOf(ul)}` : null], r)], { style: style(root) }), blocks: ['cards'] };
}
/** table: the canon cover-comparison table → Block Collection `table` (compare): header row, then one row per cover line
 *  [row header + its detail prose][check][check]; the canon's expandable detail rows are folded into the row-header cell (no colspan, D3). */
function compareTable(root, ctx) {
  const tb = q(root, 'table'); if (!tb) return richText(root, ctx);
  const cell = (c) => { const img = q(c, 'img'); if (img) return pic(img, ctx); const s = inline(c, ctx).trim(); return s ? `<p>${s}</p>` : ''; };
  const headCells = qa(tb, 'thead th, thead td'); const ncol = headCells.length || Math.max(...qa(tb, 'tbody tr:not(.cmp-detail)').map((tr) => tr.children.length));
  const out = []; if (headCells.length) out.push(headCells.map(cell));
  for (const tr of qa(tb, 'tbody > tr')) {
    if (cls(tr).includes('cmp-detail') || (tr.children.length === 1 && tr.children[0].hasAttribute('colspan'))) { if (out.length > (headCells.length ? 1 : 0)) out[out.length - 1][0] += prose(tr.children[0], ctx); continue; }
    const cells = [...tr.children].map(cell); while (cells.length < ncol) cells.push(''); out.push(cells.slice(0, ncol));
  }
  const cap = q(tb, 'caption'); const parts = [head(root, ctx)]; if (cap && txt(cap)) parts.push(`<p>${inline(cap, ctx)}</p>`);
  parts.push(block('table', ['compare', 'row-headers'], out)); // `row-headers` = the existing generic table.js variant (first column → <th scope="row">)
  ctx.notes.push('lint D10 table: a genuine data table (cover levels × cover lines) — the >4-column advisory is the D10 exception'); ctx.notes.push(`table: Block Collection table (compare) — ${out.length - 1} cover rows × ${ncol} columns; each canon expandable detail row is folded into its cover's row-header cell (D3: no spans), check icons stay authored images`);
  return { html: section(parts, { style: style(root) }), blocks: ['table'] };
}
/** accordion / topic-list: [illustration] h2 [lead] as default content + accordion (faq), one row per item [question h3][answer]. */
function faqItems(wrap, ctx) {
  return qa(wrap, ':scope > details').map((d) => { const s = q(d, 'summary'); const qEl = q(s, 'h3, h2, .faq-q') || s; const a = q(d, '.answer, .answer-wide'); return [`<h3>${inline(qEl, ctx).trim()}</h3>`, a ? prose(a, ctx) : '']; });
}
function accordion(root, ctx) {
  const wrap = q(root, '.faq[data-slot="items"], .faq'); if (!wrap) return faq(root, ctx);
  const c = q(root, ':scope > .container') || root; const parts = [];
  for (const n of c.children) { if (n === wrap) break; if (/^H[1-6]$/.test(n.tagName)) parts.push(`<h2>${inline(n, ctx)}</h2>`); else parts.push(prose({ childNodes: [n] }, ctx)); }
  parts.push(block('accordion', ['faq'], faqItems(wrap, ctx)));
  ctx.notes.push('accordion: h2 + lead as default content (lead-first), then accordion (faq) — one row per item [h3][answer]');
  return { html: section(parts, { style: style(root, 'lead-first') }), blocks: ['accordion'] };
}
function topicList(root, ctx) {
  const t = q(root, '.topics') || q(root, ':scope > .container') || root; const wrap = q(t, '.faq'); if (!wrap) return richText(root, ctx);
  const parts = [];
  for (const n of t.children) { if (n === wrap) break; if (/^H[1-6]$/.test(n.tagName)) parts.push(`<h2>${inline(n, ctx)}</h2>`); else parts.push(prose({ childNodes: [n] }, ctx)); }
  parts.push(block('accordion', ['faq'], faqItems(wrap, ctx)));
  ctx.notes.push('topic-list: spot illustration + h2 (+ lead) as default content with the `topic-list` section style, the feature list as accordion (faq) rows [h3][answer]');
  return { html: section(parts, { style: style(root, 'topic-list', 'lead-first') }), blocks: ['accordion'] };
}
/** guide-list: the canon feature carousel rendered as a list → cards (guide): one row per screen [screenshot][h3, <em>label</em>, prose]. */
function guideList(root, ctx) {
  const ol = q(root, 'ol.guide-list, ul.guide-list'); if (!ol) return richText(root, ctx);
  const r = qa(ol, ':scope > li').map((li) => { const img = q(li, 'img'); const t = q(li, '.guide-text') || li; let body = ''; for (const n of t.children) { if (n === img) continue; if (/^H[1-6]$/.test(n.tagName)) body += `<h3>${inline(n, ctx).trim()}</h3>`; else if (n.matches('p.meta')) body += `<p><em>${inline(n, ctx).trim()}</em></p>`; else body += prose({ childNodes: [n] }, ctx); } return [img ? pic(img, ctx) : '', body]; });
  ctx.notes.push('guide-list: cards (guide) — one row per carousel screen [screenshot][h3, <em>label</em>, text] (dynamics: carousel rendered as a stacked list; the "1 av 5" indicator is carousel chrome, not content)');
  return { html: section([head(root, ctx), block('cards', ['guide'], r)], { style: style(root) }), blocks: ['cards'] };
}
/** steps (product): numbered how-to ledger → cards (steps): one row per step [h3 title, prose]; the canon self-anchor on the title is dropped. */
function steps(root, ctx) {
  const ol = q(root, 'ol.steps'); if (!ol) return richText(root, ctx);
  const r = qa(ol, ':scope > li').map((li) => { let body = ''; for (const n of li.children) { if (/^H[1-6]$/.test(n.tagName)) body += `<h3>${inline(n, ctx).trim()}</h3>`; else body += prose({ childNodes: [n] }, ctx); } return [body]; });
  const rest = qa(q(root, '.steps-wrap') || root, ':scope > .prose').map((p) => prose(p, ctx));
  ctx.notes.push('steps (product): cards (steps) — one row per step [h3, text]; the numbered circle is block chrome (CSS counter), the canon title self-anchor (#sbs-…) is dropped (no ids in the authored document)');
  return { html: section([head(root, ctx), block('cards', ['steps'], r), ...rest], { style: style(root) }), blocks: ['cards'] };
}
/** calculator (product): the walker keeps the canon lead paragraph(s) between the h2 and the widget — default content before the block (core otherwise). */
function productCalculator(root, ctx) {
  const c = q(root, '.calc-wrap') || q(root, ':scope > .container') || root;
  const lead = qa(c, ':scope > p, :scope > .prose').filter((n) => !q(n, '.calc') && txt(n));
  const r = calculator(root, ctx); if (!r || !lead.length) return r;
  const leadHtml = lead.map((n) => prose({ childNodes: [n] }, ctx)).join('');
  r.html = r.html.replace('</h2>', `</h2>${leadHtml}`);
  ctx.notes.push('calculator (product): the canon lead paragraph under the section title is default content above the calculator block');
  return r;
}
/** cobranding (product): the always-open co-brand band [logo, h2, <em>question</em>, prose, CTAs][illustration + note] → columns (cobrand) — not the hub's disclosure. */
function cobranding(root, ctx) {
  const cb = q(root, '.cobrand'); if (!cb) return null;
  const main = q(cb, '.cobrand-main') || cb; const side = q(cb, '.cobrand-side');
  let body = '';
  for (const n of main.children) {
    if (n.matches('img')) body += pic(n, ctx);
    else if (/^H[1-6]$/.test(n.tagName)) body += `<h2>${inline(n, ctx).trim()}</h2>`;
    else if (n.matches('p.meta')) body += `<p><em>${inline(n, ctx).trim()}</em></p>`;
    else if (n.matches('p') && q(n, 'a.btn')) body += ctas(n, ctx);
    else body += prose({ childNodes: [n] }, ctx);
  }
  const cells = [body]; if (side) { const img = q(side, 'img'); let s = img ? pic(img, ctx) : ''; for (const n of side.children) { if (n === img) continue; s += n.matches('p') && q(n, 'a.btn') ? ctas(n, ctx) : prose({ childNodes: [n] }, ctx); } cells.push(s); }
  ctx.notes.push('cobranding (product): the canon co-brand band is always open (no <details>) → columns (cobrand) — one row [logo, h2, <em>member question</em>, prose, CTAs][illustration + adviser note]; not the hub cobranding disclosure');
  return { html: section([block('columns', ['cobrand'], [cells])], { style: style(root) }), blocks: ['columns'] };
}

export default {
  'product-hero': wrap(heroProduct),
  'page-title': wrap(titleProduct),
  'card-rail': wrap(productCardRail),
  'related-products': wrap(productCardRail),
  'content-columns': wrap(contentColumns),
  'split-media': wrap(productSplit),
  'promo-band': wrap(productPromo),
  'rich-text': wrap(productRichText),
  cobranding: wrap(cobranding),
  steps: wrap(steps),
  faq: wrap(faq),
  calculator: wrap(productCalculator),
  'price-terms': wrap(priceTerms),
  shortcuts: wrap(shortcuts),
  'people-cards': wrap(peopleCards),
  table: wrap(compareTable),
  accordion: wrap(accordion),
  'topic-list': wrap(topicList),
  'guide-list': wrap(guideList),
};
