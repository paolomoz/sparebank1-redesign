/**
 * encoders/news-article.mjs — news-article family (nettsider-frontend articles and stories), round 01.
 *   article-header → `hero (article)`: [photo (+ <em>caption</em> → the Sand-70 caption strip)] [h1, <p><em>tag</em><em>date</em></p>, lead];
 *                    the text card is Sand-70 (5 cols), the photo card 7 cols; share buttons are block chrome. No photo → `no-media` (card spans 12).
 *   article-body   → one section, style `article`: the body as DEFAULT CONTENT in the 68ch column (h2/p/ul, figures as image + <em>caption</em>,
 *                    CTAs as emphasis links, mp4 links auto-blocked to `video`), the fact box as `callout (fact)` (Sand-70 sheet), pull quotes as
 *                    `callout (quote)` [portrait][blockquote + <em>who</em>] (Frost-30 sheet), text-and-image as `columns (split article-split)`,
 *                    story columns as `columns (article-cols)`.
 *   card-rail      → (family override) style `related`: h2 section title + `cards (news rail)` (spans from data-items, wide remainder rows) +
 *                    "Relaterte tema" as h2 + a list of links (painted as 6 px badges by the section style).
 */
import * as L from '../lib.mjs';
import { cardRows } from '../encoders.mjs';

const { q, qa, txt, inline, prose, ctas, pic, block, section, esc } = L;

// lib.inline() collapses U+00A0 with \s+ → captured "CO2&#160;-utslipp" would re-wrap at 360. Keep the nbsp: swap to a private-use char
// before serialising and back to &#160; after (the pipeline keeps the entity; eds-requests.md notes the lib behaviour).
const NB = '\uE000';
function keepNbsp(root) { const w = root.ownerDocument.createTreeWalker(root, 4); let t; while ((t = w.nextNode())) { if (t.textContent.includes('\u00a0')) t.textContent = t.textContent.replace(/\u00a0/g, NB); } return root; }
const nb = (html) => html.replace(/\uE000/g, '&#160;');
const metaP = (el, ctx) => { if (!el) return ''; const items = [...el.children].map((c) => inline(c, ctx).trim()).filter(Boolean); return items.length ? `<p>${items.map((t) => `<em>${t}</em>`).join(' ')}</p>` : ''; };

export default {
  'article-header': (root, ctx) => {
    keepNbsp(root);
    const h1 = q(root, 'h1'); const by = q(root, '.byline'); const fig = q(root, '.art-photo, .art-media'); const img = q(fig, 'img'); const cap = q(fig, 'figcaption'); const lead = q(root, '.art-title-card .lead, .art-lead .lead, p.lead');
    const video = q(fig, 'video source');
    let media = img ? pic(img, ctx) : (video ? `<p><a href="${esc(video.getAttribute('src'))}">${esc(video.getAttribute('src'))}</a></p>` : '');
    if (cap && txt(cap)) media += `<p><em>${inline(cap, ctx)}</em></p>`;
    let body = `<h1>${inline(h1, ctx)}</h1>${metaP(by, ctx)}`;
    if (lead) body += `<p>${inline(lead, ctx)}</p>`;
    if (q(root, '.share')) ctx.notes.push('hero (article): the three share buttons are block chrome (captured JS handlers, no href; aria-labels @ew-exempt)');
    return { html: nb(section([block('hero', ['article', media ? null : 'no-media'], [[media, body]])])), blocks: ['hero'] };
  },
  'article-body': (root, ctx) => {
    keepNbsp(root);
    const body = q(root, '.prose[data-slot="body"]') || q(root, '.prose');
    const parts = []; const blocks = new Set(); let buf = '';
    const flush = () => { if (buf.trim()) parts.push(buf); buf = ''; };
    for (const n of body ? body.children : []) {
      if (n.matches('aside.factbox')) { flush(); parts.push(block('callout', ['fact'], [[prose(n, ctx)]])); blocks.add('callout'); ctx.notes.push('lint D1 callout (fact): the canon fact box (Sand-70 sheet) is a designed module, not body prose'); continue; }
      if (n.matches('.pull-quote')) { flush(); const img = q(n, 'img'); const bq = q(n, 'blockquote'); const who = q(n, 'figcaption'); parts.push(block('callout', ['quote', img ? null : 'no-portrait'], [[`${img ? pic(img, ctx) : ''}<blockquote>${prose(bq, ctx)}</blockquote>${who && txt(who) ? `<p><em>${inline(who, ctx)}</em></p>` : ''}`]])); blocks.add('callout'); continue; }
      if (n.matches('.art-split')) { flush(); parts.push(block('columns', ['split', 'article-split'], [[...n.children].map((c) => prose(c, ctx))])); blocks.add('columns'); continue; }
      if (n.matches('.art-cols')) { flush(); parts.push(block('columns', ['article-cols'], [[...n.children].map((c) => prose(c, ctx))])); blocks.add('columns'); continue; }
      if (n.matches('.video-frame')) { const src = q(n, 'source')?.getAttribute('src'); if (src) { buf += `<p><a href="${esc(src)}">${esc(src)}</a></p>`; blocks.add('video'); } continue; }
      if (n.matches('.art-cta, .fact-cta')) { buf += ctas(n, ctx); continue; }
      buf += prose({ childNodes: [n] }, ctx); // p · h2 · ul · figure (image + <em>caption</em>) · story-block (image + text)
    }
    flush();
    if (!parts.length) return null;
    return { html: nb(section(parts, { style: 'article' })), blocks: [...blocks] };
  },
  'card-rail': (root, ctx) => {
    keepNbsp(root);
    const ul = q(root, 'ul.news-rail, ul[data-slot="cards"]'); const tema = q(root, '.tema-row');
    const parts = []; const blocks = [];
    if (ul) {
      const h = q(root, 'h2.section-title, .container > h2'); if (h) parts.push(`<h2>${inline(h, ctx)}</h2>`);
      parts.push(block('cards', ['news', 'rail'], cardRows(qa(ul, ':scope > li'), ctx))); blocks.push('cards');
    }
    if (tema) { const h = q(tema, 'h2'); const list = q(tema, 'ul'); parts.push(`${h ? `<h2>${inline(h, ctx)}</h2>` : ''}${list ? L.list(list, ctx) : ''}`); }
    if (!parts.length) return null;
    return { html: nb(section(parts, { style: 'related' })), blocks };
  },
};
