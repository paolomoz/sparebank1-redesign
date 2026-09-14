/**
 * encoders/tool.mjs — hub group (worker E4): the tool family (sperre kort …). New shared key: `steps`.
 * Family overrides: `page-title` (48px intro under the back link), `callout` (rich body).
 */
import * as L from '../lib.mjs';
import { hubStyle, head, hubCallout } from './category-hub.mjs';

const { q, inline, prose, pic, block, section, esc } = L;

/* ---- steps: h2 + numbered ledger + note + CTA + small note, illustration beside → columns (split steps): one row [text][illustration] ---- */
function steps(root, ctx) {
  const text = q(root, '.steps-text') || q(root, '.container'); const media = q(root, '.steps-media img, figure img');
  if (!text) return null;
  const body = head(root, ctx) + prose(text, ctx);
  ctx.notes.push('steps: columns (split steps) keeps the authored order (ol → paragraph → action pill → small note); the note is the trailing paragraph');
  return { html: section([block('columns', ['split', 'steps'], [[body, media ? pic(media, ctx) : '']])], { style: hubStyle(root) }), blocks: ['columns'] };
}

/* ---- page-title (tool): back link (breadcrumbs) + h1 + lead; the tool intro keeps 48px under the lead (`tool-intro`) ---- */
function toolTitle(root, ctx) {
  const back = q(root, 'a.backlink'); const parts = [];
  if (back) parts.push(block('breadcrumbs', [], [[`<p><a href="${esc(L.href(back.getAttribute('href') || '', ctx))}">${inline(back, ctx).trim()}</a></p>`]]));
  const c = q(root, ':scope > .container') || root;
  for (const n of c.children) { if (n === back || n.contains(back)) continue; parts.push(prose({ childNodes: [n] }, ctx)); }
  return { html: section(parts, { style: hubStyle(root, 'intro', 'tool-intro') }), blocks: back ? ['breadcrumbs'] : [] };
}

export default {
  steps,
  'page-title': toolTitle,
  callout: hubCallout,
};
