import { el } from '../../scripts/sb1.js';

/**
 * cards — the canon "one card language": flat papers / hairline tiles, the whole card is the link (Block Collection name, D11).
 * Authoring: one row per card, cells [image?] [title heading with the link, text paragraph(s), <em>meta</em> paragraph, link list].
 * Variants (the grid + card treatment): choices · tips · news · price · tiles · doors · small · popular · topics · tools · articles · advisers · rail · flat.
 * Every authored element is MOVED into its <li> (EW1); wrappers carry the classes (card-title, meta); the whole-card click is the
 * title link's ::after overlay (the authored anchor keeps its identity — EW6 not needed).
 */
const GRID = { choices: 'choice-grid', tips: 'tips-grid', news: 'news-grid', price: 'price-grid', tiles: 'tiles', doors: 'door-grid', small: 'small-grid', popular: 'pop-grid', topics: 'topics', tools: 'tools', articles: 'art-grid', advisers: 'advisers', rail: 'rail-list', flat: 'flat-grid' };
const ITEM = { choices: 'card choice', tips: 'card', news: 'card news-card', price: 'card price-card', tiles: 'tile', doors: 'door', small: 'tile small-door', popular: 'tile pop-tile', topics: 'topic', tools: 'tool', articles: 'card art-card', advisers: 'adviser', rail: 'rail-item', flat: 'card' };

export default function decorate(block) {
  const variant = Object.keys(GRID).find((v) => block.classList.contains(v)) || 'flat';
  const ul = el('ul', { class: `cards-list ${GRID[variant]}` });
  [...block.children].forEach((row) => {
    const li = el('li', { class: ITEM[variant] });
    [...row.children].forEach((cell) => {
      [...cell.childNodes].forEach((n) => {
        if (n.nodeType !== 1) { if (n.textContent.trim()) li.append(el('p', {}, n)); return; }
        if (n.matches('picture, img') || (n.matches('p') && n.querySelector('picture, img') && !n.textContent.trim())) {
          const img = n.matches('img') ? n : n.querySelector('img');
          if (img) img.classList.add(variant === 'tiles' || variant === 'small' || variant === 'popular' || variant === 'topics' ? 'illu' : variant === 'advisers' ? 'portrait' : 'photo', 'photo-sm');
          li.append(el('div', { class: 'card-media' }, n.matches('picture, img') ? n : n.querySelector('picture, img')));
          return;
        }
        if (/^H[1-6]$/.test(n.tagName)) { li.append(el('div', { class: 'card-title' }, n)); return; }
        if (n.matches('p') && n.children.length === 1 && n.firstElementChild.tagName === 'EM' && !n.querySelector('a')) { li.append(el('div', { class: 'meta' }, n)); return; }
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
