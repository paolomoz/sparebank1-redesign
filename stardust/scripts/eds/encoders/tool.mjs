/**
 * encoders/tool.mjs — hub group (worker E4): the tool family (sperre kort …), round 01. New shared key: `steps`.
 * Family overrides: `page-title` (Sand text card + back link), `callout` (rich body), `split-media` (Frost text card), `feedback` (labels spread).
 */
import * as L from '../lib.mjs';
import { calculator, feedback } from '../encoders.mjs';
import { hubStyle, head, hubCallout, hubFaq, hubTitle, hubSplit, cardBody, keepNbsp , hubRichText } from './category-hub.mjs';

const { q, prose, pic, block, section } = L;

/* ---- steps: one Frost card (h2 · numbered ledger · note · Skog action · small note) 7 cols beside the illustration tile 5 cols
 *      → columns (split steps): one row [text][illustration]; the CTA keeps its authored place (columns.js `steps`). ---- */
function steps(root, ctx) {
  const card = q(root, '.steps-card > .card-body'); const media = q(root, '.steps-media img, figure img');
  const body = card ? keepNbsp(card, () => cardBody(card, ctx)) : head(root, ctx) + prose(q(root, '.steps-text') || q(root, '.container'), ctx);
  if (!body) return null;
  ctx.notes.push('steps: columns (split steps) — one row [h2, ol, note, Skog action, small note in authored order][spot illustration]; the numbered circles are block CSS counters (columns-hub.css)');
  return { html: section([block('columns', ['split', 'steps'], [[body, media ? pic(media, ctx) : '']])], { style: hubStyle(root) }), blocks: ['columns'] };
}

/* ---- calculator (tool): the loan shell when captured; an empty React mount (dynamics #8) has no authored content and is omitted ---- */
function toolCalculator(root, ctx) {
  if (q(root, '.calc')) return calculator(root, ctx);
  if (q(root, '.calc-mount')) { ctx.notes.push('calculator: React mount with nothing captured (dynamics #8, owner-bound) — no authored content, module omitted'); return { html: head(root, ctx) ? section([head(root, ctx)], { style: hubStyle(root) }) : '', blocks: [] }; }
  return null;
}
/* ---- feedback (tool): the labelled thumbs sit at the far end of the Sand row (`tool` variant, feedback-hub.css) ---- */
function toolFeedback(root, ctx) {
  const r = feedback(root, ctx); if (!r) return r;
  r.html = r.html.replace(/<div class="feedback( labels)?">/, '<div class="feedback$1 tool">');
  return r;
}

export default {
  steps,
  'page-title': hubTitle,
  callout: hubCallout,
  faq: hubFaq,
  calculator: toolCalculator,
  'split-media': hubSplit,
  feedback: toolFeedback,
  'rich-text': hubRichText,
};
