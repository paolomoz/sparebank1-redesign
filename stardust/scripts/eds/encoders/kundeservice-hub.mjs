/**
 * encoders/kundeservice-hub.mjs — hub group (worker E4): the kundeservice hub, round 01. New shared key: `hero-ask`.
 * Family overrides: `faq` (centred title, rated answers), `topic-tiles` (icon + title cards, 3-up), `promo-band` (full-bleed promo row).
 */
import * as L from '../lib.mjs';
import { hubStyle, head, hubPromo, hubFaq, hubTitle, hubCards, bentoBlock, proseExcept , hubRichText } from './category-hub.mjs';

const { q, qa, txt, inline, block, section, pic } = L;

/* ---- hero-ask: the ask card (h1 · sub-heading · lead · line · chat form) beside the photo card, then the tool cards 6 px below ----
 *      hero (hub ask): row 1 [photo][h1, h2, leads]; row 2 [field label + note][button label] (dynamics #6 interim, hero.js builds the disabled form). */
function heroAsk(root, ctx) {
  const card = q(root, '.hero-ask-card > .card-body, .hero-card > .card-body, .hero-text'); const img = q(root, '.hero-media img, figure img');
  if (!card) return null;
  const form = q(root, 'form.ask, form');
  const rows = [img ? [pic(img, ctx), proseExcept(card, null, ctx)] : [proseExcept(card, null, ctx)]];
  if (form) {
    const label = q(form, 'label'); const btn = q(form, 'button'); const note = q(form, '.ask-note, p');
    rows.push([`<p>${inline(label, ctx).trim()}</p>${note ? `<p>${inline(note, ctx).trim()}</p>` : ''}`, `<p>${L.esc(txt(btn))}</p>`]);
    ctx.notes.push('hero-ask: chat form (dynamics #6 interim — controls disabled) authored as a second two-cell row [field label + note][button label]; the textarea placeholder repeats the label (@ew-exempt in hero.js)');
  }
  const parts = [block('hero', ['hub', 'ask'], rows)]; const blocks = ['hero'];
  const tools = q(root, 'ul.tools, ul[data-slot="cards"]');
  if (tools) { const b = bentoBlock(tools, ctx, 'tools'); if (b) { parts.push(b); blocks.push('cards'); } }
  for (const p of qa(root, ':scope > .container > p')) if (!p.closest('.hero-bento, form, ul')) parts.push(/class="btn|link-more/.test(p.innerHTML) ? L.ctas(p, ctx) : `<p>${inline(p, ctx).trim()}</p>`); // e.g. the bedrift hub's "Se priser …" link under the tool cards
  return { html: section(parts, { style: hubStyle(root, tools ? 'stack' : null) }), blocks };
}

/* ---- topic-tiles: icon + title cards → cards (topics cols-3); legacy [icon][link] tiles → the same block with h3 titles ---- */
function topicTiles(root, ctx) {
  if (q(root, 'ul[data-slot]')) return hubCards(root, ctx, { variantOf: () => 'topics' });
  const ul = q(root, 'ul'); if (!ul) return null;
  const rows = qa(ul, ':scope > li').map((li) => { const img = q(li, 'img'); const a = q(li, 'a'); return [img ? pic(img, ctx) : '', a ? `<h3><a href="${L.esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></h3>` : L.prose(li, ctx)]; });
  return { html: section([head(root, ctx), block('cards', ['topics', 'cols-3'], rows)], { style: hubStyle(root) }), blocks: ['cards'] };
}

export default {
  'hero-ask': heroAsk,
  'page-title': hubTitle,
  faq: hubFaq,
  'topic-tiles': topicTiles,
  'promo-band': hubPromo,
  'rich-text': hubRichText,
};
