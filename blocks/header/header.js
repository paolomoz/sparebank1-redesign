import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { el, icon, isCurrent } from '../../scripts/sb1.js';

/**
 * header — round 01 (Danske Bank two-tier chrome), template-slotted from the /nav document (canon: stardust/canon/header.html).
 *   section 1  brand:    <p><a href="/nb/bank/privat"><img logo></a></p>
 *   section 2  audience: <ul> Privat · Bedrift · Om oss            (32 px settings bar; active = current market → white block)
 *   section 3  market:   <ul> the market's sections                 (80 px main bar, 14 px links; active = longest path prefix)
 *   section 4  tools:    <p><a>Søk</a></p> · <p><em><a>Bli kunde</a></em></p> · <p><em><strong><a>Logg inn</a></strong></em></p>
 * Authored lists/paragraphs are MOVED into the layout (EW1–EW3); the panel copies (search row, audience strip, Bli kunde row) are
 * presentational clones with their instrumentation stripped (EW4). ≤ 1140 px: one 68 px bar + a "Meny" toggle (@ew-exempt: fixed
 * chrome label) opening a fixed panel. Sticky: hides on scroll-down, reveals only the main bar on scroll-up (canon nav script).
 */
function strip(node) {
  node.querySelectorAll('[data-prose-index], [data-image-index], [data-block-index]').forEach((n) => { n.removeAttribute('data-prose-index'); n.removeAttribute('data-image-index'); n.removeAttribute('data-block-index'); });
  node.removeAttribute('data-prose-index');
  return node;
}

/** Mark the current item: audience = market prefix (`/nb/bank/privat`), market = longest matching path prefix. */
function markActive(ul, { prefix = false } = {}) {
  if (!ul) return;
  const here = window.location.pathname.replace(/\/$/, '') || '/';
  let best = null; let bestLen = -1;
  [...ul.children].forEach((li) => {
    const p = li.querySelector(':scope > p'); if (p) p.replaceWith(...p.childNodes); // the pipeline wraps list links in <p> on live (#98)
    const a = li.querySelector('a'); if (!a) return;
    let path; try { path = new URL(a.getAttribute('href'), window.location.href).pathname.replace(/\/$/, '').replace(/\.html$/, ''); } catch { return; }
    const hit = prefix ? (here === path || here.startsWith(`${path}/`)) : isCurrent(a.getAttribute('href')) || here.startsWith(`${path}/`);
    if (hit && path.length > bestLen) { best = li; bestLen = path.length; }
  });
  if (best) { const a = best.querySelector('a'); a.setAttribute('aria-current', 'page'); best.classList.add('is-active'); }
}

function sectionsOf(fragment) { return [...fragment.children].filter((s) => s.classList.contains('section')); }

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const [brand, audience, market, tools] = sectionsOf(fragment).map((s) => s.querySelector(':scope > .default-content-wrapper') || s);

  const audUl = audience?.querySelector('ul'); markActive(audUl, { prefix: true });
  const mktUl = market?.querySelector('ul'); markActive(mktUl);
  const ps = [...(tools?.querySelectorAll('p') || [])].filter((p) => p.querySelector('a'));
  const searchP = ps.find((p) => /search/.test(p.querySelector('a').getAttribute('href') || '')) || null;
  const loginP = ps.find((p) => p !== searchP && p.querySelector('a.accent, a.button.accent')) || ps.filter((p) => p !== searchP).pop() || null;
  const bliP = ps.find((p) => p !== searchP && p !== loginP) || null;
  const searchA = searchP?.querySelector('a');
  const searchClone = searchP ? strip(searchP.cloneNode(true)) : null;
  const bliClone = bliP ? strip(bliP.cloneNode(true)) : null;
  const audClone = audUl ? strip(audUl.cloneNode(true)) : null;
  if (searchA) { const label = el('span', { class: 'visually-hidden' }, ...searchA.childNodes); searchA.append(icon('search'), label); searchA.setAttribute('aria-label', label.textContent.trim()); }
  if (searchClone) { const a = searchClone.querySelector('a'); if (a) a.append(icon('search')); }
  loginP?.querySelector('a')?.classList.add('nav');

  // settings bar (audience tabs)
  const settings = el('div', { class: 'settings-bar' }, el('div', { class: 'container' }, audUl ? el('nav', { class: 'audience', 'aria-label': 'Målgruppe' }, audUl) : null));

  // main bar: logo · primary nav (inline on desktop, fixed panel ≤ 1140) · tools · Meny toggle
  const logoP = brand?.querySelector('p') || brand?.querySelector('a');
  const logo = logoP ? el('div', { class: 'logo' }, logoP) : null;
  const nav = el('nav', { id: 'main-menu', class: 'primary', 'aria-label': 'Hovedmeny' },
    searchClone ? el('div', { class: 'panel-top' }, el('div', { class: 'panel-search' }, searchClone)) : null,
    audClone ? el('div', { class: 'audience-m' }, audClone) : null,
    mktUl ? el('div', { class: 'market' }, mktUl) : el('div', { class: 'market market-empty' }),
    bliClone ? el('div', { class: 'service' }, bliClone) : null);
  const toolsEl = el('div', { class: 'tools' }, bliP ? el('div', { class: 'tool-text' }, bliP) : null, searchP ? el('div', { class: 'tool-search' }, searchP) : null, loginP ? el('div', { class: 'tool-login' }, loginP) : null);
  const toggle = el('button', { class: 'menu-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'main-menu' },
    el('span', { class: 'bars', 'aria-hidden': 'true' }, el('i'), el('i'), el('i')), el('span', { class: 'menu-label' }, 'Meny'));
  const main = el('div', { class: 'main-bar' }, el('div', { class: 'container main-row' }, logo, nav, toolsEl, toggle));

  const skip = el('nav', { class: 'skip', 'aria-label': 'Hurtiglenker' }, el('a', { href: '#main-menu' }, 'Til hovedmeny'), el('a', { href: '#main-content' }, 'Til hovedinnhold'));
  block.replaceChildren(skip, settings, main);
  document.querySelector('main')?.setAttribute('id', 'main-content');

  // menu toggle (Escape closes; a link click closes) + sticky hide / reveal
  const hdr = block.closest('header') || block;
  const setOpen = (o) => { block.classList.toggle('is-open', o); toggle.setAttribute('aria-expanded', String(o)); document.documentElement.classList.toggle('no-scroll', o); };
  toggle.addEventListener('click', () => setOpen(!block.classList.contains('is-open')));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && block.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
  nav.addEventListener('click', (e) => { if (e.target.closest('a') && block.classList.contains('is-open')) setOpen(false); });
  let last = window.scrollY;
  const settingsH = () => settings.getBoundingClientRect().height;
  window.addEventListener('scroll', () => {
    const y = window.scrollY; if (block.classList.contains('is-open')) return;
    if (y <= 0) hdr.style.transform = '';
    else if (y > last && y > hdr.offsetHeight) hdr.style.transform = 'translateY(-100%)';
    else if (y < last) hdr.style.transform = `translateY(-${settingsH()}px)`;
    last = y;
  }, { passive: true });
}
