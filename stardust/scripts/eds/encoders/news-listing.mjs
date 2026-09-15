/**
 * encoders/news-listing.mjs — news-listing (om-oss/nyheter), round 01: h1 as default content + the newest story as `hero (featured)`
 * [photo][h2 link, <p><em>tag</em><em>date</em></p>] (Sand-70 link card 5 + photo card 7), section style `featured`; the listing as
 * `cards (news grid-3|grid-4)` (one row per story: [thumb][h2 link, meta]); "Se flere artikler" as ONE secondary button (section style `more-link`).
 */
import * as L from '../lib.mjs';

const { q, qa, cls, inline, pic, block, section, esc } = L;
const metaP = (el, ctx) => { if (!el) return ''; const items = [...el.children].map((c) => inline(c, ctx).trim()).filter(Boolean); return items.length ? `<p>${items.map((t) => `<em>${t}</em>`).join(' ')}</p>` : ''; };
const storyRow = (li, ctx, level) => { const img = q(li, 'img'); const a = q(li, '.feat-title a, .news-title a, h2 a, h3 a'); return [img ? pic(img, ctx) : '', `<${level}><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></${level}>${metaP(q(li, '.meta'), ctx)}`]; };

export default {
  'article-header': (root, ctx) => {
    const h1 = q(root, 'h1'); const feat = q(root, '.feat-bento, .feat-grid');
    const parts = [h1 ? `<h1>${inline(h1, ctx)}</h1>` : ''];
    if (feat) { const [media, body] = storyRow(feat, ctx, 'h2'); parts.push(block('hero', ['featured', media ? null : 'no-media'], [[media, body]])); }
    return { html: section(parts, { style: 'featured' }), blocks: feat ? ['hero'] : [] };
  },
  'card-rail': (root, ctx) => {
    const ul = q(root, 'ul.news-grid'); if (!ul) return null;
    const grid = cls(ul).find((c) => /^grid-\d$/.test(c)) || 'grid-3';
    return { html: section([block('cards', ['news', grid], qa(ul, ':scope > li').map((li) => storyRow(li, ctx, 'h2')))]), blocks: ['cards'] };
  },
  'button-row': (root, ctx) => {
    const a = q(root, 'a'); if (!a) return null;
    const h = a.getAttribute('href') || ''; const href = /^[?#]/.test(h) ? `${ctx.map.deliveredPath}${h}` : L.href(h, ctx); // the captured page-2 link is a query on the page itself
    ctx.notes.push('dynamics #11: "Se flere artikler" kept as the captured page-2 query link (index-backed listing later)');
    return { html: section([`<p><em><a href="${esc(href)}">${inline(a, ctx).trim()}</a></em></p>`], { style: 'more-link' }), blocks: [] };
  },
};
