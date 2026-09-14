/**
 * encoders/faq.mjs — faq family (question pages): the single `faq-question` movement → one section:
 *   breadcrumbs block (back link) · h1 + answer as DEFAULT CONTENT (D1) · tinted answer steps as `callout (step sand|syrin)` blocks
 *   (a captured background-container holding text + a screenshot) · CTAs as emphasis links · the inline feedback strip as `feedback (inline labels)`.
 * Section style `question` (styles/styles-story.css): 48/64 padding, answer at lead size, hairline feedback.
 */
import * as L from '../lib.mjs';

const { q, qa, txt, inline, prose, ctas, block, section, esc, paperOf } = L;

function answerParts(answer, ctx) {
  const parts = []; let buf = '';
  const flush = () => { if (buf.trim()) parts.push(buf); buf = ''; };
  for (const n of answer.children) {
    if (n.matches('.answer-step')) { flush(); const paper = (paperOf(n) || '').replace('paper-', ''); parts.push(block('callout', ['step', paper || null], [[prose(n, ctx)]])); ctx.blocks.add('callout'); continue; }
    if (n.matches('.answer-cta, .ctas')) { buf += ctas(n, ctx); continue; }
    if (n.matches('.answer-rte, .answer-figure')) { buf += prose(n.matches('figure') ? { childNodes: [n] } : n, ctx); continue; }
    buf += prose({ childNodes: [n] }, ctx);
  }
  flush(); return parts;
}

export default {
  'faq-question': (root, ctx) => {
    const back = q(root, 'a.backlink'); const h1 = q(root, 'h1'); const answer = q(root, '.answer-prose'); const fb = q(root, '.faq-feedback');
    const parts = []; const blocks = [];
    if (back) { parts.push(block('breadcrumbs', [], [[`<p><a href="${esc(L.href(back.getAttribute('href') || '', ctx))}">${inline(back, ctx).trim()}</a></p>`]])); blocks.push('breadcrumbs'); }
    if (h1) parts.push(`<h1>${inline(h1, ctx)}</h1>`);
    if (answer) parts.push(...answerParts(answer, ctx));
    if (fb) {
      const qEl = q(fb, '.feedback-q, h2'); const labels = qa(fb, 'button').map((b) => txt(q(b, 'span')) || b.getAttribute('aria-label') || txt(b));
      parts.push(block('feedback', ['inline', 'labels'], [[`<p>${inline(qEl, ctx)}</p>`, `<p>${esc(labels[0] || 'Ja')}</p>`, `<p>${esc(labels[1] || 'Nei')}</p>`]])); blocks.push('feedback');
      ctx.notes.push('lint D1 feedback: interactive widget (dynamics #5 interim — static thumbs); inline variant: question label + Ja/Nei beside the answer');
    }
    if (parts.some((p) => p.includes('class="callout'))) blocks.push('callout');
    return { html: section(parts, { style: 'question' }), blocks };
  },
};
