/**
 * encoders/markedsnytt-listing.mjs — family encoders for `markedsnytt-listing` (one page: /nb/bank/privat/sparing/markedsnytt).
 * Round 01 (bento): campaign → breadcrumbs + hero `listing` (Frost text card 5 / photo card 7) · card-rail → cards `articles grid-3`
 * (continues the hero bento: style `bento-join`) or cards `news grid-3` (meta = <em>tag</em><em>date</em>) · content-columns → webinar rows
 * (one `video-row` section per row: default-content text card 5 + the auto-blocked `embed` as the Frost video card 7) · expert rows (columns `split expert`:
 * Syrin portrait tile 3 + text card 9) · regulatory (cards `regulatory grid-2`, style `fineprint` for the left-aligned h2-s).
 * Group CSS: blocks/hero/hero-omoss.css · blocks/cards/cards-omoss.css · blocks/columns/columns-omoss.css · styles/styles-omoss.css.
 */
import * as L from '../lib.mjs';
import { productHero, cardRail as coreCardRail, splitMedia } from '../encoders.mjs';

const { esc, q, qa, cls, inline, prose, ctas, pic, block, section, styleOf, paperOf } = L;
const backlink = (a, ctx) => block('breadcrumbs', [], [[`<p><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></p>`]]);
const head = (c, ctx) => { const h = q(c, ':scope > h2'); return h ? `<h2>${inline(h, ctx)}</h2>` : ''; };

function campaign(root, ctx) {
  if (q(root, '.hero-bento')) { // round 01: Frost text card 5 (back link · h1 · lead) + bleeding photo card 7 — the core productHero shape, variant listing
    const r = productHero(root, ctx); if (!r) return null;
    r.html = r.html.replace('<div class="hero product">', '<div class="hero listing">');
    ctx.notes.push('campaign (hero bento): breadcrumbs + hero (listing) — [photo][h1, lead]; the block moves the back link into the text card');
    return r;
  }
  const grid = q(root, '.hero-grid'); if (!grid) return productHero(root, ctx);
  const back = q(root, 'a.backlink'); const img = q(grid, '.hero-media img'); const text = q(grid, '.hero-text');
  const parts = []; if (back) parts.push(backlink(back, ctx));
  parts.push(block('hero', ['listing'], [[img ? pic(img, ctx) : '', prose(text, ctx)]]));
  return { html: section(parts, { style: styleOf(paperOf(root)) }), blocks: ['hero', ...(back ? ['breadcrumbs'] : [])] };
}

function cardRail(root, ctx) {
  const ul = q(root, 'ul[data-slot="cards"]'); if (!ul) return coreCardRail(root, ctx);
  const c = q(root, ':scope > .container') || root; const articles = cls(ul).includes('art-grid');
  const rows = qa(ul, ':scope > li').map((li) => {
    const img = q(li, 'img'); const title = q(li, '.card-title, h2, h3'); const link = title && (title.tagName === 'A' ? title : q(title, 'a'));
    const tag = title && /^H[1-6]$/.test(title.tagName) ? title.tagName.toLowerCase() : 'h3';
    let body = title ? (link ? `<${tag}><a href="${esc(L.href(link.getAttribute('href') || '', ctx))}">${inline(link, ctx).trim()}</a></${tag}>` : `<${tag}>${inline(title, ctx).trim()}</${tag}>`) : '';
    for (const p of qa(li, 'p')) {
      if (title && title.contains(p)) continue;
      if (cls(p).includes('meta')) { body += `<p>${[...p.childNodes].map((x) => inline({ childNodes: [x] }, ctx).trim()).filter(Boolean).map((x) => `<em>${x}</em>`).join('')}</p>`; continue; } // tag · date as two <em> runs (the block's meta row is a flex of the runs, 14 px gap — the canon .meta)
      if (/class="(btn|link-more)/.test(p.innerHTML)) { body += ctas(p, ctx); continue; }
      const s = inline(p, ctx).trim(); if (s) body += `<p>${s}</p>`;
    }
    return [img ? pic(img, ctx) : '', body];
  });
  const n = rows.length; const grid = n >= 2 && n <= 4 ? `grid-${n}` : null;
  const h = head(c, ctx); const parts = [h, block('cards', articles ? ['articles', grid] : ['news', grid], rows)];
  for (const p of qa(c, ':scope > p')) parts.push(/class="btn/.test(p.innerHTML) ? ctas(p, ctx) : `<p>${inline(p, ctx).trim()}</p>`);
  if (articles) ctx.notes.push('card-rail (articles): cards (articles grid-3) 6 px under the hero bento (style bento-join) — [photo][h2, "Les saken her" link]; the trailing secondary pill is default content');
  else ctx.notes.push('card-rail (news): cards (news grid-3) — [photo][h3 link, <em>tag</em><em>date</em> meta]');
  return { html: section(parts, { style: styleOf(paperOf(root), articles ? 'bento-join' : null) }), blocks: ['cards'] };
}

function captionCells(fig, ctx) {
  const cap = q(fig, 'figcaption'); if (!cap) return '';
  const clone = cap.cloneNode(true); const small = q(clone, 'small'); if (small) small.remove();
  const main = inline(clone, ctx).replace(/(\s|<br>)+$/g, '').trim(); const sub = small ? inline(small, ctx).trim() : '';
  return (main ? `<p>${main}</p>` : '') + (sub ? `<p>${sub}</p>` : '');
}
function contentColumns(root, ctx) {
  const c = q(root, ':scope > .container') || root; const h = head(c, ctx); const paper = paperOf(root);
  const reg = q(c, '.reg-grid');
  if (reg) { // regulatory: two Sand text cards 6 + 6 under a left-aligned h2-s
    const cols = qa(reg, '.reg-col').length ? qa(reg, '.reg-col') : qa(reg, ':scope > li');
    ctx.notes.push('content-columns (regulatory bento): cards (regulatory grid-2) — one row per text card [paragraphs with bold run-in labels, document links]; style fineprint paints the left-aligned h2-s');
    return { html: section([h, block('cards', ['regulatory', `grid-${Math.min(4, cols.length)}`], cols.map((col) => [prose(col, ctx)]))], { style: styleOf(paper, 'fineprint') }), blocks: ['cards'] };
  }
  const rows = qa(c, '.rows > .split-row'); if (!rows.length) return splitMedia(root, ctx);
  if (rows.some((r) => q(r, 'a.video-frame'))) { // webinar rows: Sand text card 5 + Frost video card 7 — one `video-row` section per row (the section IS the bento)
    const secs = [section([h], { style: styleOf(paper, 'flush-bottom') })];
    for (const r of rows) {
      const text = q(r, '.col-text, .text-card > .card-body'); const v = q(r, 'a.video-frame');
      const link = v ? `<p><a href="${esc(v.getAttribute('href'))}">${inline(v, ctx).trim()}</a></p>` : '';
      secs.push(section([prose(text, ctx), link], { style: styleOf(paper, 'video-row') }));
    }
    ctx.notes.push('lint D1 embed: each webinar row is its own section (style video-row = the bento: default-content text card 5 + the embed card 7) — running text + the bare YouTube link that buildMediaAutoBlocks() turns into the embed block (click-to-load player, dynamics #16); the captured title is the link text');
    return { html: secs, blocks: ['embed'] };
  }
  const cells = rows.map((r) => { const fig = q(r, 'figure.expert, figure'); const img = q(fig, 'img'); const text = q(r, '.col-text, .text-card > .card-body'); return [pic(img, ctx) + captionCells(fig, ctx), prose(text, ctx)]; });
  ctx.notes.push('content-columns (expert rows): columns (split expert) — one row per comment [portrait or illustration, caption paragraphs][h3, paragraph, CTAs]; Syrin tile 3 + Sand text card 9');
  return { html: section([h, block('columns', ['split', 'expert'], cells)], { style: styleOf(paper) }), blocks: ['columns'] };
}

export default { campaign, 'card-rail': cardRail, 'content-columns': contentColumns };
