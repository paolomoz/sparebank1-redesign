/**
 * encoders/kundeservice-hub.mjs — hub group (worker E4): the kundeservice hub. New shared key: `hero-ask`.
 * Family overrides: `faq` (side-by-side head + wide answers with per-answer rating), `topic-tiles` (icon + link tiles), `promo-band`.
 */
import * as L from '../lib.mjs';
import { cardRows } from '../encoders.mjs';
import { hubStyle, head, hubPromo, cardVariant } from './category-hub.mjs';

const { q, qa, cls, txt, inline, prose, pic, block, section, esc } = L;

/* ---- hero-ask: split hero (photo · h1 + title + lead + line) + the chat form row (label · button label · note) + the tool tiles ---- */
function heroAsk(root, ctx) {
  const img = q(root, '.hero-media img, figure img'); const h1 = q(root, 'h1'); const text = q(root, '.hero-text');
  let body = h1 ? `<h1>${inline(h1, ctx)}</h1>` : '';
  for (const n of text ? [...text.children] : []) { if (n.tagName === 'FORM') continue; body += prose({ childNodes: [n] }, ctx); }
  const form = q(root, 'form.ask, form');
  const rows = [[img ? pic(img, ctx) : '', body]];
  if (form) {
    const label = q(form, 'label'); const btn = q(form, 'button'); const note = q(form, '.ask-note, p');
    rows.push([`<p>${inline(label, ctx).trim()}</p><p>${inline(note, ctx).trim()}</p>`, `<p>${esc(txt(btn))}</p>`]);
    ctx.notes.push('hero-ask: chat form (dynamics #6 interim — controls disabled) authored as a second two-cell row [field label + note][button label]; the textarea placeholder repeats the label (@ew-exempt in hero.js)');
  }
  const parts = [block('hero', ['ask'], rows)]; const blocks = ['hero'];
  const tools = q(root, 'ul.tools, ul[data-slot="tools"]');
  if (tools) { const rows = cardRows(qa(tools, ':scope > li'), ctx); parts.push(block('cards', ['tools'], rows.some((r) => r[0]) ? rows : rows.map((r) => [r[1]]))); blocks.push('cards'); }
  return { html: section(parts, { style: hubStyle(root) }), blocks };
}

/* ---- faq (hub): sticky h2 beside the list; answers may hold a second prose column, `.cols` sub-columns, a rating row and the "read more" link ---- */
function faqHub(root, ctx) {
  const wrap = q(root, '.faq[data-slot="items"], .faq'); if (!wrap) return null;
  const item = (d) => {
    const s = q(d, 'summary'); const qEl = q(s, 'h3, h2, .faq-q') || s; const a = q(d, '.answer, .answer-wide');
    let ans = '';
    for (const c of a ? [...a.children] : []) {
      if (c.classList.contains('faq-foot-feedback')) continue; // per-answer rating = block chrome (accordion `rate`, dynamics #5 interim)
      ans += prose(c, ctx);
    }
    // "Se også:" + several links on <br> lines in ONE paragraph would read as a multi-link CTA paragraph (delivery P1) → one paragraph per line
    ans = ans.replace(/<p>((?:(?!<\/p>).)*?)<\/p>/g, (m, inner) => ((inner.match(/<a /g) || []).length > 1 && /<strong>/.test(inner) && /<br>/.test(inner) ? inner.split(/\s*<br>\s*/).map((l) => l.replace(/^(<strong>[^<]*)<\/strong>\s*$/, '$1</strong>').trim()).filter(Boolean).map((l) => `<p>${l}</p>`).join('') : m));
    return [`<h3>${inline(qEl, ctx).trim()}</h3>`, ans];
  };
  const rows = qa(wrap, ':scope > details:not(.faq-more)').map(item);
  ctx.notes.push('faq (hub): `.cols` sub-columns flattened to prose in reading order (answers are collapsed; D2 no nested blocks); the "Var dette nyttig?" rating row is accordion `rate` chrome (@ew-exempt labels, dynamics #5)');
  return { html: section([head(root, ctx), block('accordion', ['faq', 'wide', 'rate'], rows)], { style: hubStyle(root, 'faq-aside') }), blocks: ['accordion'] };
}

/* ---- topic-tiles: icon + single link per tile → cards (topics), one row [icon][link] ---- */
function topicTiles(root, ctx) {
  const ul = q(root, 'ul.topics, ul[data-slot="tiles"], ul'); if (!ul) return null;
  const rows = qa(ul, ':scope > li').map((li) => { const img = q(li, 'img'); const a = q(li, 'a'); return [img ? pic(img, ctx) : '', a ? `<p><a href="${esc(L.href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a></p>` : prose(li, ctx)]; });
  return { html: section([head(root, ctx), block('cards', [cardVariant(ul) === 'flat' ? 'topics' : cardVariant(ul)], rows)], { style: hubStyle(root) }), blocks: ['cards'] };
}

export default {
  'hero-ask': heroAsk,
  faq: faqHub,
  'topic-tiles': topicTiles,
  'promo-band': hubPromo,
};
