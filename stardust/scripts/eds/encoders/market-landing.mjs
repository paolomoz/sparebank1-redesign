/**
 * stardust/scripts/eds/encoders/market-landing.mjs — market-landing family (archetype nb-bank-privat-html; siblings bedrift, om-oss).
 * Overrides for THIS family: content-columns (tiles via the core rail | index columns), card-rail (news meta as separate <em> runs so the
 * tag and the date stay two flex items like the canon .meta). Hero (campaign) and promo-band (promo-2) come from the core encoders.
 */
import * as L from '../lib.mjs';
import { cardRail } from '../encoders.mjs';
import { contentColumns, head } from './theme.mjs';

const { esc, q, qa, cls, inline, pic, block, section, styleOf, paperOf } = L;

/** News rows: [photo] [h3 title link, <em>tag</em> <em>date</em>]. */
function newsRows(items, ctx) {
  return items.map((li) => {
    const img = q(li, 'img'); const title = q(li, '.card-title, h3, h2'); const a = title ? (title.tagName === 'A' ? title : q(title, 'a')) : null;
    const lvl = title && /^H[1-6]$/.test(title.tagName) ? title.tagName.toLowerCase() : 'h3';
    let body = title ? (a ? `<${lvl}><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></${lvl}>` : `<${lvl}>${inline(title, ctx)}</${lvl}>`) : '';
    for (const p of qa(li, ':scope > p')) {
      if (cls(p).includes('meta')) { const runs = [...p.childNodes].map((n) => (n.nodeType === 3 ? esc(n.textContent) : inline(n, ctx)).trim()).filter(Boolean); if (runs.length) body += `<p>${runs.map((s) => `<em>${s}</em>`).join(' ')}</p>`; continue; }
      const s = inline(p, ctx).trim(); if (s) body += `<p>${s}</p>`;
    }
    return [img ? pic(img, ctx) : '', body];
  });
}
function newsRail(root, ctx) {
  const ul = q(root, 'ul.news-grid'); if (!ul) return cardRail(root, ctx);
  ctx.notes.push('card-rail (news): cards (news) — meta authored as <em>tag</em> <em>date</em> (two runs → two .meta flex items, canon gap 12px)');
  return { html: section([head(root, ctx), block('cards', ['news'], newsRows(qa(ul, ':scope > li'), ctx))], { style: styleOf(paperOf(root)) }), blocks: ['cards'] };
}

export default {
  'content-columns': contentColumns,
  'card-rail': newsRail,
};
