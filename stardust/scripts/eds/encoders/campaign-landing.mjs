/**
 * encoders/campaign-landing.mjs — campaign landing (om-oss/hjemme, story clientlib).
 *   video-hero → `hero (video)`: [mp4 link] [h1] — the block builds the <video> from the link (media stays on the source origin).
 *   story-text → DEFAULT CONTENT (h2 + paragraphs + CTA), section style `chapter` (+ paper) — 5/7 chapter grid painted by CSS.
 *   split-media (slides / closing) → `columns (split slides)` one row per slide [portrait][h2, lead, CTAs] · `columns (split closing)` [portrait][h2].
 *   video → a plain mp4 link paragraph (auto-blocked `video`, D1) + the caption as <img icon><em>title</em>, section style `film`.
 */
import * as L from '../lib.mjs';

const { q, qa, inline, prose, ctas, pic, block, section, esc, styleOf, paperOf, imgHtml } = L;
const mp4 = (root) => q(root, 'video source')?.getAttribute('src') || q(root, 'video')?.getAttribute('src') || '';
const link = (src) => (src ? `<p><a href="${esc(src)}">${esc(src)}</a></p>` : '');

export default {
  'video-hero': (root, ctx) => {
    const h1 = q(root, 'h1'); const src = mp4(root);
    ctx.notes.push('hero (video): the campaign loop stays on the source origin (never content.da.live); the block renders <video controls muted loop preload=metadata> from the authored link');
    return { html: section([block('hero', ['video'], [[link(src), `<h1>${inline(h1, ctx)}</h1>`]])], { style: 'video-hero' }), blocks: ['hero'] };
  },
  'story-text': (root, ctx) => {
    const h = q(root, '.chapter-title, h2'); const pr = q(root, '.prose');
    const id = root.getAttribute('id'); const lead = !!q(pr, ':scope > p.lead:first-child'); // only chapters whose captured first paragraph is the lead
    return { html: section([h ? `<h2>${inline(h, ctx)}</h2>` : '', pr ? prose(pr, ctx) : ''], { style: styleOf(paperOf(root), 'chapter', lead ? 'lead-first' : null), ...(id ? { id } : {}) }), blocks: [] };
  },
  'split-media': (root, ctx) => {
    const slides = qa(root, '.slide');
    if (slides.length) {
      const rows = slides.map((s) => { const img = q(s, 'img'); const t = q(s, '.slide-text'); return [img ? pic(img, ctx) : '', prose(t, ctx)]; });
      ctx.notes.push('slides: captured in-page anchors (#kontakt, #blikunde) live on the individual slides; the section carries id=slides (dynamics: anchor targets per row are not authorable in one block)');
      return { html: section([block('columns', ['split', 'slides'], rows)], { style: styleOf(paperOf(root), 'slides'), id: 'slides' }), blocks: ['columns'] };
    }
    const img = q(root, 'img'); const h = q(root, '.closing-title, h2');
    return { html: section([block('columns', ['split', 'closing'], [[img ? pic(img, ctx) : '', h ? `<h2>${inline(h, ctx)}</h2>` : '']])], { style: 'hairline-top, closing' }), blocks: ['columns'] };
  },
  video: (root, ctx) => {
    const src = mp4(root); const cap = q(root, 'figcaption'); const icon = q(cap, 'img'); const title = q(cap, 'span') || cap;
    const parts = [link(src)];
    if (cap && L.txt(cap)) parts.push(`<p>${icon ? imgHtml(icon, ctx) : ''}<em>${inline(title, ctx).trim()}</em></p>`);
    ctx.notes.push('lint D1 video: authored as a plain mp4 link (auto-blocked to `video` by scripts.js); the film stays on the source origin');
    return { html: section(parts, { style: 'film' }), blocks: ['video'] };
  },
};
