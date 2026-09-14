import { el, unwrapItem } from '../../scripts/sb1.js';

/**
 * cards — the canon "one card language": flat papers / hairline tiles, the whole card is the link (Block Collection name, D11).
 * Authoring: one row per card, cells [image?] [title heading with the link, text paragraph(s), <em>meta</em> paragraph, link list].
 * Variants (the grid + card treatment): choices · tips · news · price · tiles · doors · small · popular · topics · tools · articles · advisers · rail · flat.
 * Every authored element is MOVED into its <li> (EW1); wrappers carry the classes (card-title, meta); the whole-card click is the
 * title link's ::after overlay (the authored anchor keeps its identity — EW6 not needed).
 */
const GRID = { choices: 'choice-grid', tips: 'tips-grid', news: 'news-grid', price: 'price-grid', tiles: 'tiles', doors: 'door-grid', small: 'small-grid', popular: 'pop-grid', topics: 'topics', tools: 'tools', articles: 'art-grid', advisers: 'advisers', rail: 'rail-list', featured: 'feat-grid', listing: 'listing-grid', flat: 'flat-grid', 'photo-tiles': 'card-grid', usp: 'usp-list' }; // hub additive: photo-tiles · usp
const ITEM = { choices: 'card choice', tips: 'card', news: 'card news-card', price: 'card price-card', tiles: 'tile', doors: 'door', small: 'tile small-door', popular: 'tile pop-tile', topics: 'topic', tools: 'tool', articles: 'card art-card', advisers: 'adviser', rail: 'rail-item', featured: 'feat', listing: 'news-item', flat: 'card', 'photo-tiles': 'tile card-tile', usp: 'usp-item' };
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
  const ul = el('ul', { class: `cards-list ${GRID[variant]}` });
  [...block.children].forEach((row) => {
    const li = el('li', { class: ITEM[variant] });
    [...row.children].forEach((cell) => {
      [...cell.childNodes].forEach((n) => {
        if (n.nodeType !== 1) { if (n.textContent.trim()) li.append(el('p', {}, n)); return; }
        if (n.matches('picture, img') || (n.matches('p') && n.querySelector('picture, img') && !n.textContent.trim())) {
          const img = n.matches('img') ? n : n.querySelector('img');
          if (img) img.classList.add(variant === 'tiles' || variant === 'small' || variant === 'popular' || variant === 'topics' || variant === 'usp' ? 'illu' : variant === 'advisers' ? 'portrait' : 'photo', 'photo-sm');
          li.append(el('div', { class: 'card-media' }, n.matches('picture, img') ? n : n.querySelector('picture, img')));
          return;
        }
        if (/^H[1-6]$/.test(n.tagName)) { li.append(el('div', { class: 'card-title' }, n)); return; }
        if (isMeta(n)) { li.append(el('div', { class: 'meta' }, n)); return; } // one or several <em> (tag · date), no link, no bare text
        if (n.matches('p') && n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()) { li.append(el('div', { class: 'card-link' }, n)); return; }
        if (n.matches('ul, ol')) { li.append(el('div', { class: 'card-links' }, n)); return; }
        li.append(el('div', { class: 'card-text' }, n));
      });
    });
    ul.append(li);
  });
  ul.setAttribute('data-items', String(ul.children.length));
  block.replaceChildren(ul);
}
