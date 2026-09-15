/**
 * encoders/utility.mjs — hub group (worker E4): the utility family (kontakt …), round 01. New shared keys: `hero-portrait`, `bank-table`, `address-block`.
 * Family override: `callout` (rich body).
 */
import * as L from '../lib.mjs';
import { hubStyle, hubCallout, hubFaq, hubTitle, hubCards, head , hubRichText } from './category-hub.mjs';

const { q, qa, inline, block, section } = L;

/* ---- hero-portrait: Frost text card (h1 · two leads · secondary pill) + the circle portrait on a Sand tile → hero (hub portrait) ---- */
function heroPortrait(root, ctx) { return hubTitle(root, ctx); }

/* ---- bank-table: h2 + lead, one card per bank [name link][phone + channel as arrow links] → cards (directory cols-4) + the Frost partners card ----
 *      legacy authored table → Block Collection `table (directory)`. */
function bankTable(root, ctx) {
  if (q(root, 'ul[data-slot="cards"]')) {
    const r = hubCards(root, ctx, { singles: { 'partners-card': 'partners' } }); if (!r) return null;
    ctx.notes.push('bank-table: cards (directory cols-4) — one row per bank [h3 name link][phone (tel:) and contact channel as a link list]; the "Telefon" / "Kontakt oss" head cells were visually-hidden prefixes in the prototype and are not authored (the tel:/mailto: links carry the meaning); the partner links close the bento as cards (partners)');
    return r;
  }
  const tb = q(root, 'table'); if (!tb) return null;
  const rows = qa(tb, 'tr').map((tr) => [...tr.children].map((c) => `<p>${inline(c, ctx).trim()}</p>`));
  const partners = q(root, '.partners'); const parts = [head(root, ctx), block('table', ['directory'], rows)];
  if (partners) parts.push(L.prose(partners, ctx));
  return { html: section(parts, { style: hubStyle(root, 'directory') }), blocks: ['table'] };
}

/* ---- address-block: h2 + one card per term [h3 term][lines] → cards (address cols-4); legacy dl → prose pairs ---- */
function addressBlock(root, ctx) {
  if (q(root, 'ul[data-slot="cards"]')) { const r = hubCards(root, ctx); if (r) ctx.notes.push('address-block: cards (address cols-4) — one row per term [h3][address lines with <br>]'); return r; }
  const dl = q(root, 'dl'); if (!dl) return null;
  const pairs = []; let dt = null;
  for (const el of qa(dl, 'dt, dd')) { if (el.tagName === 'DT') dt = el; else if (dt) { pairs.push(`<p><strong>${inline(dt, ctx).trim()}</strong><br>${inline(el, ctx).trim()}</p>`); dt = null; } }
  return { html: section([head(root, ctx), ...pairs], { style: hubStyle(root, 'address') }), blocks: [] };
}

export default {
  'hero-portrait': heroPortrait,
  'bank-table': bankTable,
  'address-block': addressBlock,
  callout: hubCallout,
  'page-title': hubTitle,
  faq: hubFaq,
  'rich-text': hubRichText,
};
