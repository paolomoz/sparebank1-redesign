/**
 * encoders/news-listing.mjs — news-listing (om-oss/nyheter): h1 as default content + the newest story as `cards (featured)` [photo][h2 link, meta];
 * the listing as `cards (listing)` (one row per story: [thumb][h2 link, <p><em>tag</em><em>date</em></p>]); "Se flere artikler" as a plain link
 * paragraph (section style `flush-top, more-link` — the canon .btn-inline with chevron is painted by CSS).
 */
import * as L from '../lib.mjs';

const { q, qa, inline, pic, block, section, esc } = L;
const metaP = (el, ctx) => { if (!el) return ''; const items = [...el.children].map((c) => inline(c, ctx).trim()).filter(Boolean); return items.length ? `<p>${items.map((t) => `<em>${t}</em>`).join('')}</p>` : ''; };
const storyRow = (li, ctx, level) => { const img = q(li, 'img'); const a = q(li, '.feat-title a, .news-title a, h2 a, h3 a'); return [img ? pic(img, ctx) : '', `<${level}><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></${level}>${metaP(q(li, '.meta'), ctx)}`]; };

export default {
  'article-header': (root, ctx) => {
    const h1 = q(root, 'h1'); const feat = q(root, '.feat-grid');
    const parts = [h1 ? `<h1>${inline(h1, ctx)}</h1>` : ''];
    if (feat) parts.push(block('cards', ['featured'], [storyRow(feat, ctx, 'h2')]));
    return { html: section(parts, { style: 'featured' }), blocks: feat ? ['cards'] : [] };
  },
  'card-rail': (root, ctx) => {
    const ul = q(root, 'ul.news-grid'); if (!ul) return null;
    return { html: section([block('cards', ['listing'], qa(ul, ':scope > li').map((li) => storyRow(li, ctx, 'h2')))], { style: 'listing' }), blocks: ['cards'] };
  },
  'button-row': (root, ctx) => {
    const a = q(root, 'a'); if (!a) return null;
    const h = a.getAttribute('href') || ''; const href = /^[?#]/.test(h) ? `${ctx.map.deliveredPath}${h}` : L.href(h, ctx); // the captured page-2 link is a query on the page itself
    ctx.notes.push('dynamics #11: "Se flere artikler" kept as the captured page-2 query link (index-backed listing later)');
    return { html: section([`<p><a href="${esc(href)}">${inline(a, ctx).trim()}</a></p>`], { style: 'flush-top, more-link' }), blocks: [] };
  },
};
