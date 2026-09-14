/**
 * encoders/tool.mjs — hub group (worker E4): the tool family (sperre kort …). New shared key: `steps`.
 * Family overrides: `page-title` (48px intro under the back link), `callout` (rich body).
 */
import * as L from '../lib.mjs';
import { calculator } from '../encoders.mjs';
import { hubStyle, head, hubCallout, hubFaq, hubTitle } from './category-hub.mjs';

const { q, prose, pic, block, section } = L;

/* ---- steps: h2 + numbered ledger + note + CTA + small note, illustration beside → columns (split steps): one row [text][illustration] ---- */
function steps(root, ctx) {
  const text = q(root, '.steps-text') || q(root, '.container'); const media = q(root, '.steps-media img, figure img');
  if (!text) return null;
  const body = head(root, ctx) + prose(text, ctx);
  ctx.notes.push('steps: columns (split steps) keeps the authored order (ol → paragraph → action pill → small note); the note is the trailing paragraph');
  return { html: section([block('columns', ['split', 'steps'], [[body, media ? pic(media, ctx) : '']])], { style: hubStyle(root) }), blocks: ['columns'] };
}

/* ---- page-title (tool): the plain intro keeps 48px under the lead (`tool-intro`); the intro-media shape is the shared hero (intro) ---- */
function toolTitle(root, ctx) {
  const r = hubTitle(root, ctx); if (!r) return null;
  return q(root, '.intro-grid') ? r : { ...r, html: r.html.replace('<div>intro, tight-bottom</div>', '<div>intro, tool-intro</div>') };
}
/* ---- calculator (tool): the loan shell when captured; an empty React mount (dynamics #8) has no authored content and is omitted ---- */
function toolCalculator(root, ctx) {
  if (q(root, '.calc')) return calculator(root, ctx);
  if (q(root, '.calc-mount')) { ctx.notes.push('calculator: React mount with nothing captured (dynamics #8, owner-bound) — no authored content, module omitted'); return { html: '', blocks: [] }; }
  return null;
}

export default {
  steps,
  'page-title': toolTitle,
  callout: hubCallout,
  faq: hubFaq,
  calculator: toolCalculator,
};
