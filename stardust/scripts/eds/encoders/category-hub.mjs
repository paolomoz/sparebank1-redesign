/**
 * encoders/category-hub.mjs — hub group (worker E4): category-hub family encoders + the helpers shared with
 * kundeservice-hub / tool / utility (they import from here). New keys (`shortcut-row`, `cobranding`) are shared by convert.mjs;
 * the core overrides below (`visual-nav`, `promo-band`) apply to category-hub pages only.
 */
import * as L from '../lib.mjs';
import { cardRows } from '../encoders.mjs';

const { q, qa, cls, inline, prose, ctas, pic, block, section, styleOf, paperOf, esc } = L;

/** Section style: the movement's paper + explicit tokens (hub pages set their own rhythm tokens, never the core guesses). */
export const hubStyle = (root, ...extra) => styleOf(paperOf(root), ...extra);

/** The movement's h2 (`.section-title` or the first h2 directly in the container / its head column) as default content. */
export function head(root, ctx) {
  const h = q(root, ':scope > .container > h2, :scope > .container > .directory-head > h2, :scope > .container > .faq-grid > h2, :scope > .container > .shortcut-row > h2');
  return h ? `<h2>${inline(h, ctx)}</h2>` : '';
}

/** A promo article → one `columns (promo …)` row [illustration][title + line + pill]. */
export function promoCells(promo, ctx) {
  const img = q(promo, 'img'); const text = q(promo, '.promo-text') || promo;
  return [img ? pic(img, ctx) : '', prose(text, ctx)];
}
const CARD_VARIANT = { 'door-grid': 'doors', 'small-grid': 'small', 'pop-grid': 'popular', topics: 'topics', tools: 'tools', tiles: 'tiles' };
export const cardVariant = (ul) => cls(ul).map((c) => CARD_VARIANT[c]).find(Boolean) || 'flat';

/* ---- visual-nav: doors (4 photo doors) + small tiles (4 icon tiles) — two cards blocks, the movement sits 16px under the intro ---- */
function visualNav(root, ctx) {
  const lists = qa(root, 'ul.door-grid, ul.small-grid, ul[data-slot="cards"], ul[data-slot="cards-small"]').filter((u, i, a) => a.indexOf(u) === i);
  if (!lists.length) return null;
  const parts = [head(root, ctx), ...lists.map((ul) => block('cards', [cardVariant(ul)], cardRows(qa(ul, ':scope > li'), ctx)))];
  return { html: section(parts, { style: hubStyle(root, cls(root).includes('doors') ? 'tight-top' : null) }), blocks: ['cards'] };
}

/* ---- shortcut-row: h2 + a list of inline chevron links → DEFAULT CONTENT with the `shortcuts` section style (D1/D5) ---- */
function shortcutRow(root, ctx) {
  const ul = q(root, 'ul'); if (!ul) return null;
  const items = qa(ul, ':scope > li').map((li) => { const a = q(li, 'a'); return a ? `<li><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></li>` : ''; }).join('');
  ctx.notes.push('shortcut-row: prose h2 + ul of links (David\'s Model D5 simple list); section style `shortcuts` paints the hairline, the inline-link row and the chevrons');
  return { html: section([head(root, ctx), `<ul>${items}</ul>`], { style: hubStyle(root, 'shortcuts') }), blocks: [] };
}

/* ---- cobranding: the LOfavør disclosure → bespoke `cobranding` block: [question][toggle label] · [logo][name + prose + CTAs] · [illustration][note] ---- */
function cobranding(root, ctx) {
  const d = q(root, 'details.cobrand, .cobrand'); if (!d) return null;
  const qEl = q(d, 'summary .cobrand-q, summary span:first-child'); const tEl = q(d, 'summary .cobrand-toggle, summary span:last-child');
  const main = q(d, '.cobrand-main') || d; const side = q(d, '.cobrand-side');
  const logo = q(main, 'img'); const name = q(main, 'h2, h3');
  let body = name ? `<${name.tagName.toLowerCase()}>${inline(name, ctx)}</${name.tagName.toLowerCase()}>` : '';
  for (const p of qa(main, 'p')) { if (q(p, 'a.btn')) continue; const s = inline(p, ctx).trim(); if (s) body += `<p>${s}</p>`; }
  for (const p of qa(main, 'p')) if (q(p, 'a.btn')) body += ctas(p, ctx);
  const rows = [[`<p>${inline(qEl, ctx).trim()}</p>`, `<p>${inline(tEl, ctx).trim()}</p>`], [logo ? pic(logo, ctx) : '', body]];
  if (side) { const illu = q(side, 'img'); rows.push([illu ? pic(illu, ctx) : '', qa(side, 'p').map((p) => `<p>${inline(p, ctx).trim()}</p>`).join('')]); }
  ctx.notes.push('cobranding: bespoke disclosure block (details/summary → head row + hidden panel, accordion.js pattern); the toggle label is authored text outside the <button>');
  return { html: section([block('cobranding', [], rows)], { style: hubStyle(root) }), blocks: ['cobranding'] };
}

/* ---- promo-band: one or two promos; family class (`switch` flush under the help columns · `invites` two side by side) rides the block ---- */
export function hubPromo(root, ctx) {
  const promos = qa(root, 'article.promo, .promo'); if (!promos.length) return null;
  const fam = cls(root).find((c) => ['switch', 'invites'].includes(c));
  const b = block('columns', ['promo', promos.length > 1 ? `promo-${promos.length}` : null, fam], promos.map((p) => promoCells(p, ctx)));
  return { html: section([head(root, ctx), b], { style: hubStyle(root, fam === 'switch' ? 'flush-top' : null) }), blocks: ['columns'] };
}

/* ---- callout (hub group): canon .callout / .callout-rich → callout (tip|info|frost [rich]); `quick` = 48px top, flush bottom ---- */
export function hubCallout(root, ctx) {
  const co = q(root, '.callout'); if (!co) return null;
  const variant = cls(co).includes('info') ? 'info' : cls(co).includes('callout-frost') ? 'frost' : 'tip';
  const body = q(co, '.callout-text, .callout-body') || co;
  return { html: section([head(root, ctx), block('callout', [variant, cls(co).includes('callout-rich') ? 'rich' : null], [[prose(body, ctx)]])], { style: hubStyle(root, cls(root).includes('quick') ? 'quick' : null) }), blocks: ['callout'] };
}

export default {
  'visual-nav': visualNav,
  callout: hubCallout,
  'shortcut-row': shortcutRow,
  cobranding,
  'promo-band': hubPromo,
};
