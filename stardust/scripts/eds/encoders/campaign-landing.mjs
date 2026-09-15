/**
 * encoders/campaign-landing.mjs — campaign landing (om-oss/hjemme, story clientlib), round 01: every row is a bento of cards.
 *   video-hero  → `hero (video)`: [mp4 link] [h1] — Frost-30 statement card 5 + the video filling the 7-col card (hero.js builds the <video>).
 *   story-text  → `columns (split chapter dark|frost [reverse] [lead-first])`: [h2] [prose (+ CTA)] — title tile 5 + Sand-70 prose card 7.
 *   split-media → slides: `cards (slides grid-3)` one row per offer [portrait photo][h2, text, primary CTA, arrow link] · closing:
 *                 `columns (split closing)` [portrait photo][h2] — photo card 5 + Fjell statement tile 7.
 *   video       → `video (film)`: [mp4 link] [icon + <em>title</em>] — video card 8 + Syrin-30 caption card 4 (video.js moves the caption cell).
 */
import * as L from '../lib.mjs';

const { q, qa, cls, inline, prose, ctas, pic, block, section, esc, styleOf, imgHtml } = L;
const mp4 = (root) => q(root, 'video source')?.getAttribute('src') || q(root, 'video')?.getAttribute('src') || '';
const link = (src) => (src ? `<p><a href="${esc(src)}">${esc(src)}</a></p>` : '');

export default {
  'video-hero': (root, ctx) => {
    const h1 = q(root, 'h1'); const src = mp4(root);
    ctx.notes.push('hero (video): the campaign loop stays on the source origin (never content.da.live); the block renders <video controls muted loop preload=metadata> from the authored link');
    return { html: section([block('hero', ['video'], [[link(src), `<h1>${inline(h1, ctx)}</h1>`]])]), blocks: ['hero'] };
  },
  'story-text': (root, ctx) => {
    const tile = q(root, '.chapter-tile'); const h = q(root, '.chapter-title, h2'); const pr = q(root, '.chapter-text .card-body, .prose');
    const id = root.getAttribute('id'); const lead = !!q(pr, ':scope > p.lead:first-child'); // only chapters whose captured first paragraph is the lead
    const tone = cls(tile).includes('card--dark') ? 'dark' : cls(tile).includes('card--frost') ? 'frost' : null;
    const rev = !!q(root, '.chapter-bento--rev');
    return { html: section([block('columns', ['split', 'chapter', tone, rev ? 'reverse' : null, lead ? 'lead-first' : null], [[h ? `<h2>${inline(h, ctx)}</h2>` : '', pr ? prose(pr, ctx) : '']])], id ? { id } : {}), blocks: ['columns'] };
  },
  'split-media': (root, ctx) => {
    const slides = qa(root, 'li.slide, .slide');
    if (slides.length) {
      const rows = slides.map((s) => { const img = q(s, 'img'); const body = q(s, '.card-body, .slide-text'); let html = ''; for (const n of body ? body.children : []) html += n.matches('.actions') ? ctas(n, ctx) : prose({ childNodes: [n] }, ctx); return [img ? pic(img, ctx) : '', html]; });
      const grid = cls(q(root, 'ul.slide-list')).find((c) => /^grid-\d$/.test(c)) || 'grid-3';
      ctx.notes.push('slides: captured in-page anchors (#kontakt, #blikunde) live on the individual cards; the section carries id=slides (dynamics: anchor targets per row are not authorable in one block)');
      ctx.notes.push('cards (slides): portrait sources (1280×2276) framed 1:1 (prototype data-deviation) — the CSS variant, not the document');
      return { html: section([block('cards', ['slides', grid], rows)], { id: 'slides' }), blocks: ['cards'] };
    }
    const img = q(root, 'img'); const h = q(root, '.closing-title, h2');
    return { html: section([block('columns', ['split', 'closing'], [[img ? pic(img, ctx) : '', h ? `<h2>${inline(h, ctx)}</h2>` : '']])], { style: 'closing' }), blocks: ['columns'] };
  },
  video: (root, ctx) => {
    const src = mp4(root); const cap = q(root, 'figcaption'); const icon = q(cap, 'img'); const title = q(cap, 'span, .h2-s') || cap;
    const capHtml = cap && L.txt(cap) ? `<p>${icon ? imgHtml(icon, ctx) : ''}<em>${inline(title, ctx).trim()}</em></p>` : '';
    ctx.notes.push('lint D1 video (film): the campaign film as the video block with a caption cell (video card 8 + Syrin-30 caption card 4); the film stays on the source origin');
    return { html: section([block('video', ['film'], [[link(src), capHtml]])]), blocks: ['video'] };
  },
};
