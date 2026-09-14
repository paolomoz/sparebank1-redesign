/**
 * encoders/news-article.mjs — news-article family (nettsider-frontend articles and stories).
 *   article-header → `hero (article)`: [photo (+ <em>caption</em>)] [h1, <p><em>tag</em><em>date</em></p>, lead]; share buttons are block chrome.
 *   article-body   → one section, style `article` (68ch prose beside a sticky rail): the body as DEFAULT CONTENT (h2/p/ul, figures as image +
 *                    <em>caption</em>, CTAs as emphasis links, mp4 links auto-blocked to `video`), the fact box as `callout (fact)`, pull quotes as
 *                    `callout (quote)` [portrait][blockquote + <em>who</em>], text-and-image as `columns (split article-split)`, story columns as
 *                    `columns (article-cols)`; the related rail as ONE `cards (rail)` block: [h2] · [thumb][h3 link]… · [h2] · [tag links].
 */
import * as L from '../lib.mjs';

const { q, qa, cls, txt, inline, prose, ctas, pic, block, section, esc, styleOf } = L;

// lib.inline() collapses U+00A0 with \s+ → captured "CO2&#160;-utslipp" would re-wrap at 360. Keep the nbsp: swap to a private-use char
// before serialising and back to &#160; after (the pipeline keeps the entity; eds-requests.md notes the lib behaviour).
const NB = '\uE000';
function keepNbsp(root) { const w = root.ownerDocument.createTreeWalker(root, 4); let t; while ((t = w.nextNode())) { if (t.textContent.includes('\u00a0')) t.textContent = t.textContent.replace(/\u00a0/g, NB); } return root; }
const nb = (html) => html.replace(/\uE000/g, '&#160;');
const metaP = (el, ctx) => { if (!el) return ''; const items = [...el.children].map((c) => inline(c, ctx).trim()).filter(Boolean); return items.length ? `<p>${items.map((t) => `<em>${t}</em>`).join(' ')}</p>` : ''; };

export default {
  'article-header': (root, ctx) => {
    keepNbsp(root);
    const h1 = q(root, 'h1'); const by = q(root, '.byline'); const fig = q(root, '.art-media'); const img = q(fig, 'img'); const cap = q(fig, 'figcaption'); const lead = q(root, '.art-lead .lead');
    const video = q(fig, 'video source');
    let media = img ? pic(img, ctx) : (video ? `<p><a href="${esc(video.getAttribute('src'))}">${esc(video.getAttribute('src'))}</a></p>` : '');
    if (cap && txt(cap)) media += `<p><em>${inline(cap, ctx)}</em></p>`;
    let body = `<h1>${inline(h1, ctx)}</h1>${metaP(by, ctx)}`;
    if (lead) body += `<p>${inline(lead, ctx)}</p>`;
    if (q(root, '.share')) ctx.notes.push('hero (article): the three share buttons are block chrome (captured JS handlers, no href; aria-labels @ew-exempt)');
    return { html: nb(section([block('hero', ['article', media ? null : 'no-media'], [[media, body]])], { style: 'article-head' })), blocks: ['hero'] };
  },
  'article-body': (root, ctx) => {
    keepNbsp(root);
    const body = q(root, '.prose[data-slot="body"]') || q(root, '.prose'); const rail = q(root, 'aside.rail');
    const parts = []; const blocks = new Set(); let buf = '';
    const flush = () => { if (buf.trim()) parts.push(buf); buf = ''; };
    for (const n of body ? body.children : []) {
      if (n.matches('aside.factbox')) { flush(); parts.push(block('callout', ['fact'], [[prose(n, ctx)]])); blocks.add('callout'); ctx.notes.push('lint D1 callout (fact): the canon fact box (Sand-30 aside) is a designed module, not body prose'); continue; }
      if (n.matches('.pull-quote')) { flush(); const img = q(n, 'img'); const bq = q(n, 'blockquote'); const who = q(n, 'figcaption'); parts.push(block('callout', ['quote', img ? null : 'no-portrait'], [[img ? pic(img, ctx) : '', `<blockquote>${prose(bq, ctx)}</blockquote>${who && txt(who) ? `<p><em>${inline(who, ctx)}</em></p>` : ''}`]])); blocks.add('callout'); continue; }
      if (n.matches('.art-split')) { flush(); parts.push(block('columns', ['split', 'article-split'], [[...n.children].map((c) => prose(c, ctx))])); blocks.add('columns'); continue; }
      if (n.matches('.art-cols')) { flush(); parts.push(block('columns', ['article-cols'], [[...n.children].map((c) => prose(c, ctx))])); blocks.add('columns'); continue; }
      if (n.matches('.video-frame')) { const src = q(n, 'source')?.getAttribute('src'); if (src) { buf += `<p><a href="${esc(src)}">${esc(src)}</a></p>`; blocks.add('video'); } continue; }
      if (n.matches('.art-cta, .fact-cta')) { buf += ctas(n, ctx); continue; }
      buf += prose({ childNodes: [n] }, ctx); // p · h2 · ul · figure (image + <em>caption</em>) · story-block (image + text)
    }
    flush();
    if (rail) {
      const rows = [];
      for (const g of qa(rail, '.rail-group')) {
        const h = q(g, 'h2'); if (h) rows.push([`<h2>${inline(h, ctx)}</h2>`]);
        const ul = q(g, 'ul'); if (!ul) continue;
        if (cls(ul).includes('rail-list')) { for (const li of qa(ul, ':scope > li')) { const img = q(li, 'img'); const a = q(li, '.rail-title a, h3 a, a'); rows.push([img ? pic(img, ctx) : '', `<h3><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></h3>`]); } }
        else rows.push([L.list(ul, ctx)]);
      }
      parts.push(block('cards', ['rail'], rows)); blocks.add('cards'); ctx.notes.push('lint D3 cards (rail): one-cell rows are the two rail group headings ("Relaterte artikler", "Relaterte tema") and the tag list; two-cell rows are the stories — one block so the sticky rail stays one authored unit beside the body');
    }
    return { html: nb(section(parts, { style: styleOf('article', rail ? null : 'no-rail') })), blocks: [...blocks] };
  },
};
