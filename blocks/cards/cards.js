import { el, unwrapItem } from '../../scripts/sb1.js';

/**
 * cards — round 01 card language: every card is a tinted fill with 2 px corners in a 12-column bento with 6 px gutters; the photo
 * bleeds to the card edge (16:9), the body carries 48/36 padding, the whole card is the link (Block Collection name, D11).
 * Authoring: one row per card, cells [image?] [title heading with the link, text paragraph(s), <em>meta</em> paragraph, link list].
 * Variants (the span + card treatment): choices · tips · news · price · tiles · doors · small · popular · topics · tools · articles · advisers · rail · flat.
 * Every authored element is MOVED into its <li> (EW1); wrappers carry the classes (card-media, card-body, card-title, meta, card-links);
 * the whole-card click is the title link's ::after overlay (the authored anchor keeps its identity — EW6 not needed).
 */
const GRID = { choices: 'choice-grid', tips: 'tips-grid', news: 'news-grid', price: 'price-grid', tiles: 'tiles', doors: 'door-grid', small: 'small-grid', popular: 'pop-grid', topics: 'topics', tools: 'tools', articles: 'art-grid', advisers: 'advisers', flat: 'flat-grid' };
const ITEM = { choices: 'card choice', tips: 'card', news: 'card news-card', price: 'card price-card', tiles: 'card tile product', doors: 'card door', small: 'card tile small-door', popular: 'card tile pop-tile', topics: 'card topic', tools: 'card tool', articles: 'card article-card', advisers: 'card adviser', flat: 'card' };
const isMeta = (n) => n.matches('p') && n.children.length > 0 && [...n.children].every((c) => c.tagName === 'EM') && !n.querySelector('a') && ![...n.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim());

/**
 * `rail` (story group, additive): the article side rail is ONE block — a one-cell row holding a heading opens a group ("Relaterte artikler",
 * "Relaterte tema"), two-cell rows [thumb][h3 link] are rail items, a one-cell row holding a list is the tag list. Every authored node is MOVED.
 */
function decorateRail(block) {
  const wrap = el('div', { class: 'rail' }); let group = null; let list = null;
  const open = (head) => { group = el('div', { class: 'rail-group' }, head); list = null; wrap.append(group); };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && cells[0].querySelector('h2, h3, h4') && !cells[0].querySelector('a, ul, ol')) { open(el('div', { class: 'rail-head' }, ...cells[0].childNodes)); return; }
    if (!group) open(null);
    if (cells.length === 1 && cells[0].querySelector('ul, ol')) { cells[0].querySelectorAll('li').forEach(unwrapItem); group.append(el('div', { class: 'tema' }, ...cells[0].childNodes)); return; }
    if (!list) { list = el('ul', { class: 'cards-list rail-list' }); group.append(list); }
    const li = el('li', { class: 'rail-item' });
    cells.forEach((cell) => [...cell.childNodes].forEach((n) => {
      if (n.nodeType !== 1) { if (n.textContent.trim()) li.append(el('p', {}, n)); return; }
      if (n.matches('picture, img') || (n.matches('p') && n.querySelector('picture, img') && !n.textContent.trim())) { const img = n.matches('img') ? n : n.querySelector('img'); if (img) img.classList.add('photo', 'photo-sm'); li.append(el('div', { class: 'card-media' }, n.matches('picture, img') ? n : n.querySelector('picture, img'))); return; }
      if (/^H[1-6]$/.test(n.tagName)) { li.append(el('div', { class: 'card-title rail-title' }, n)); return; }
      li.append(el('div', { class: 'card-text' }, n));
    }));
    list.append(li);
  });
  block.replaceChildren(wrap);
}

export default function decorate(block) {
  const variant = Object.keys(GRID).find((v) => block.classList.contains(v)) || 'flat';
  if (variant === 'rail') { decorateRail(block); return; }
  const ul = el('ul', { class: `cards-list bento ${GRID[variant]}` });
  const illuVariant = variant === 'tiles' || variant === 'small' || variant === 'popular' || variant === 'topics' || variant === 'usp' || block.classList.contains('spot');
  [...block.children].forEach((row) => {
    const li = el('li', { class: `${ITEM[variant]} card--tint is-link` });
    const body = el('div', { class: 'card-body' });
    [...row.children].forEach((cell) => {
      [...cell.childNodes].forEach((n) => {
        if (n.nodeType !== 1) { if (n.textContent.trim()) body.append(el('p', {}, n)); return; }
        if (n.matches('picture, img') || (n.matches('p') && n.querySelector('picture, img') && !n.textContent.trim())) {
          const img = n.matches('img') ? n : n.querySelector('img');
          const node = n.matches('picture, img') ? n : n.querySelector('picture, img');
          if (illuVariant) { if (img) img.classList.add('illu'); body.append(el('div', { class: 'card-media card-illu' }, node)); return; }
          if (variant === 'advisers') { if (img) img.classList.add('portrait'); body.append(el('div', { class: 'card-media card-portrait' }, node)); return; }
          if (img) img.classList.add('card-image');
          li.append(el('div', { class: 'card-media' }, node));
          return;
        }
        if (/^H[1-6]$/.test(n.tagName)) { body.append(el('div', { class: 'card-title' }, n)); return; }
        if (isMeta(n)) { body.append(el('div', { class: 'meta' }, n)); return; } // one or several <em> (tag · date), no link, no bare text
        if (n.matches('p') && n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()) { body.append(el('div', { class: 'card-link' }, n)); return; }
        if (n.matches('ul, ol')) { n.querySelectorAll('li').forEach(unwrapItem); n.querySelectorAll('a').forEach((a) => a.classList.add('arrow')); body.append(el('div', { class: 'card-links' }, n)); return; }
        body.append(el('div', { class: 'card-text' }, n));
      });
    });
    li.append(body);
    if (body.querySelector('.card-links, .cta-row, .card-link')) li.classList.remove('is-link');
    ul.append(li);
  });
  ul.setAttribute('data-items', String(ul.children.length));
  block.replaceChildren(ul);
}
