/**
 * encoders/faq.mjs — faq family (question pages), round 01: the `faq-question` movement (one article root holding three prototype sections) →
 *   1. hero section: breadcrumbs block (back link, moved into the card by hero.js) + `hero (question)` — the question as a Frost-30 text card
 *      spanning 12 columns (no lead photo); the hero rule gives the 24 px top.
 *   2. answer section, style `answer` (styles-story.css): the answer as DEFAULT CONTENT (D1) at lead size in the 68ch column; the captured tinted
 *      answer steps (background-containers holding text + a screenshot) as `callout (step sand|syrin|frost)` blocks; CTAs as emphasis links.
 *   3. feedback section: `feedback (labels)` — the Sand-70 sheet with the question and the two Frost secondary buttons (dynamics #5 interim).
 */
import * as L from '../lib.mjs';

const { q, qa, txt, inline, prose, ctas, block, section, esc, paperOf } = L;

function answerParts(answer, ctx) {
  const parts = []; let buf = '';
  const flush = () => { if (buf.trim()) parts.push(buf); buf = ''; };
  for (const n of answer.children) {
    if (n.matches('.answer-step')) { flush(); const paper = (paperOf(n) || '').replace('paper-', ''); parts.push(block('callout', ['step', paper || null], [[prose(n, ctx)]])); ctx.blocks.add('callout'); ctx.notes.push('lint D1 callout (step): a captured background-container — tinted paper grouping one step of the answer with its screenshot; the tint is design, not prose'); continue; }
    if (n.matches('.answer-cta, .ctas')) { buf += ctas(n, ctx); continue; }
    if (n.matches('.answer-rte, .answer-figure')) { buf += prose(n.matches('figure') ? { childNodes: [n] } : n, ctx); continue; }
    buf += prose({ childNodes: [n] }, ctx);
  }
  flush(); return parts;
}

export default {
  'faq-question': (root, ctx) => {
    const back = q(root, 'a.backlink'); const h1 = q(root, 'h1'); const answer = q(root, '.answer-prose'); const fb = q(root, '.faq-feedback');
    const secs = []; const blocks = ['hero'];
    const hero = [];
    if (back) { ctx.notes.push('lint D1 breadcrumbs: the canon back link is a designed navigation module (Block Collection name), not prose — hero.js moves it into the question card'); hero.push(block('breadcrumbs', [], [[`<p><a href="${esc(L.href(back.getAttribute('href') || '', ctx))}">${inline(back, ctx).trim()}</a></p>`]])); blocks.push('breadcrumbs'); }
    ctx.notes.push('lint D1 hero (question): the question is the designed hero module — a Frost-30 bento card spanning 12 columns (Block Collection name), not prose'); hero.push(block('hero', ['question'], [[h1 ? `<h1>${inline(h1, ctx)}</h1>` : '']]));
    secs.push(section(hero));
    if (answer) { const parts = answerParts(answer, ctx); if (parts.length) secs.push(section(parts, { style: 'answer' })); if (parts.some((p) => p.includes('class="callout'))) blocks.push('callout'); }
    if (fb) {
      const qEl = q(fb, '.feedback-q, h2'); const labels = qa(fb, 'button').map((b) => txt(q(b, 'span')) || b.getAttribute('aria-label') || txt(b));
      secs.push(section([block('feedback', ['labels', 'question'], [[`<h2>${inline(qEl, ctx)}</h2>`, `<p>${esc(labels[0] || 'Ja')}</p>`, `<p>${esc(labels[1] || 'Nei')}</p>`]])], { style: 'flush-bottom' })); blocks.push('feedback');
      ctx.notes.push('lint D1 feedback: interactive widget (dynamics #5 interim — static thumbs); the Sand-70 sheet carries the question (h2) and the two labels');
    }
    return { html: secs, blocks };
  },
};
