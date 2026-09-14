/**
 * encoders/markedsnytt-listing.mjs — family encoders for `markedsnytt-listing` (one page: /nb/bank/privat/sparing/markedsnytt).
 * campaign → breadcrumbs + hero `listing` (text 5 / photo 7) · card-rail → cards `articles` (flat photo cards + chevron link, `flush-top`)
 * or cards `news cols-3` (meta = tag + date) · content-columns → webinar rows (one section per row: prose + the bare YouTube link that
 * scripts.js auto-blocks into `embed`, style `video-row`) · expert rows (columns `expert`: portrait + caption | text) · regulatory
 * (columns `text`, style `fineprint`). The section title is default content; `head-xl` gives it the page's 48px gap.
 */
import * as L from '../lib.mjs';
import { productHero, cardRail as coreCardRail, splitMedia } from '../encoders.mjs';

const { esc, q, qa, cls, inline, prose, ctas, pic, block, section, styleOf, paperOf } = L;
const backlink = (a, ctx) => block('breadcrumbs', [], [[`<p><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></p>`]]);
const head = (c, ctx) => { const h = q(c, ':scope > h2'); return h ? `<h2>${inline(h, ctx)}</h2>` : ''; };

function campaign(root, ctx) {
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
      if (cls(p).includes('meta')) { body += `<p><em>${[...p.childNodes].map((x) => inline({ childNodes: [x] }, ctx).trim()).filter(Boolean).join(' ')}</em></p>`; continue; } // tag + date as two words (the canon .meta is a flex row of two nodes)
      if (/class="(btn|link-more)/.test(p.innerHTML)) { body += ctas(p, ctx); continue; }
      const s = inline(p, ctx).trim(); if (s) body += `<p>${s}</p>`;
    }
    return [img ? pic(img, ctx) : '', body];
  });
  const h = head(c, ctx); const parts = [h, block('cards', articles ? ['articles'] : ['news', 'cols-3'], rows)];
  for (const p of qa(c, ':scope > p')) parts.push(/class="btn/.test(p.innerHTML) ? ctas(p, ctx) : `<p>${inline(p, ctx).trim()}</p>`);
  if (!articles) ctx.notes.push('news meta: the canon <span>tag</span><time>date</time> is authored as one <em>tag date</em> (the two nodes flatten without a space in the core inline())');
  return { html: section(parts, { style: styleOf(paperOf(root), articles ? 'flush-top' : null, h ? 'head-xl' : null) }), blocks: ['cards'] };
}

function captionCells(fig, ctx) {
  const cap = q(fig, 'figcaption'); if (!cap) return '';
  const clone = cap.cloneNode(true); const small = q(clone, 'small'); if (small) small.remove();
  const main = inline(clone, ctx).replace(/(\s|<br>)+$/g, '').trim(); const sub = small ? inline(small, ctx).trim() : '';
  return (main ? `<p>${main}</p>` : '') + (sub ? `<p>${sub}</p>` : '');
}
function contentColumns(root, ctx) {
  const c = q(root, ':scope > .container') || root; const h = head(c, ctx); const paper = paperOf(root);
  const hairline = ['wtf', 'regulatory'].some((k) => cls(root).includes(k)) ? 'hairline-top' : null;
  const reg = q(c, '.reg-grid');
  if (reg) {
    const cols = qa(reg, ':scope > .reg-col');
    return { html: section([h, block('columns', ['text'], [cols.map((col) => prose(col, ctx))])], { style: styleOf(paper, hairline, 'fineprint') }), blocks: ['columns'] };
  }
  const rows = qa(c, '.rows > .split-row'); if (!rows.length) return splitMedia(root, ctx);
  if (rows.some((r) => q(r, 'a.video-frame'))) {
    const secs = [section([h], { style: styleOf(paper, hairline, 'flush-bottom') })];
    rows.forEach((r, i) => {
      const text = q(r, '.col-text'); const v = q(r, 'a.video-frame');
      const link = v ? `<p><a href="${esc(v.getAttribute('href'))}">${inline(v, ctx).trim()}</a></p>` : '';
      secs.push(section([prose(text, ctx), link], { style: styleOf(paper, 'video-row', i < rows.length - 1 ? 'flush-bottom' : null) }));
    });
    ctx.notes.push('lint D1 embed: each webinar row is its own section (style video-row) — running text + the bare YouTube link that buildMediaAutoBlocks() turns into the embed block (click-to-load player; dynamics #16 interim)');
    return { html: secs, blocks: ['embed'] };
  }
  const cells = rows.map((r) => { const fig = q(r, 'figure.expert, figure'); const img = q(fig, 'img'); const text = q(r, '.col-text'); return [pic(img, ctx) + captionCells(fig, ctx), prose(text, ctx)]; });
  return { html: section([h, block('columns', ['expert'], cells)], { style: styleOf(paper, hairline, h ? 'head-xl' : null) }), blocks: ['columns'] };
}

export default { campaign, 'card-rail': cardRail, 'content-columns': contentColumns };
