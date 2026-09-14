/**
 * encoders/utility.mjs — hub group (worker E4): the utility family (kontakt …). New shared keys: `hero-portrait`, `bank-table`, `address-block`.
 * Family override: `callout` (rich body, `quick` rhythm).
 */
import * as L from '../lib.mjs';
import { hubStyle, head, hubCallout } from './category-hub.mjs';

const { q, qa, inline, prose, pic, block, section } = L;

/* ---- hero-portrait: circle portrait + h1 + two leads + secondary pill → hero (portrait) ---- */
function heroPortrait(root, ctx) {
  const img = q(root, '.hero-media img, figure img'); const text = q(root, '.hero-text');
  return { html: section([block('hero', ['portrait'], [[img ? pic(img, ctx) : '', prose(text, ctx)]])], { style: hubStyle(root) }), blocks: ['hero'] };
}

/* ---- bank-table: h2 beside an authored table (header row + one row per bank) and the partners prose → `table` block (Block Collection) ---- */
function bankTable(root, ctx) {
  const tb = q(root, 'table'); if (!tb) return null;
  const rows = qa(tb, 'tr').map((tr) => [...tr.children].map((c) => `<p>${inline(c, ctx).trim()}</p>`));
  const partners = q(root, '.partners');
  const parts = [head(root, ctx), block('table', ['directory'], rows)];
  if (partners) parts.push(prose(partners, ctx));
  ctx.notes.push('bank-table: Block Collection `table` (first row = header, variant `directory` = first column as row headers, phone numbers stay tel: links); the partners prose trails as default content');
  return { html: section(parts, { style: hubStyle(root, 'directory') }), blocks: ['table'] };
}

/* ---- address-block: h2 + term/value pairs → DEFAULT CONTENT, one paragraph per pair (<strong>Term</strong><br>lines), section style `address` ---- */
function addressBlock(root, ctx) {
  const dl = q(root, 'dl'); if (!dl) return null;
  const pairs = []; let dt = null;
  for (const el of qa(dl, 'dt, dd')) { if (el.tagName === 'DT') dt = el; else if (dt) { pairs.push(`<p><strong>${inline(dt, ctx).trim()}</strong><br>${inline(el, ctx).trim()}</p>`); dt = null; } }
  ctx.notes.push('address-block: prose paragraphs <strong>Term</strong><br>value lines in an `address` section grid (D1 — no key/value block for displayed copy, D14)');
  return { html: section([head(root, ctx), ...pairs], { style: hubStyle(root, 'address') }), blocks: [] };
}

export default {
  'hero-portrait': heroPortrait,
  'bank-table': bankTable,
  'address-block': addressBlock,
  callout: hubCallout,
};
