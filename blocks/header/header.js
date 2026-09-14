import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { el, icon, sectionsOf, isCurrent } from '../../scripts/sb1.js';

/**
 * header — the redesign's two calm tiers, template-slotted from the /nav document (canon: stardust/canon/header.html).
 *   section 1  brand:    <p><a href="/nb/bank/privat"><img logo></a></p>
 *   section 2  audience: <ul> Privat · Bedrift · Om oss            (utility row, left; active = current market)
 *   section 3  market:   <ul> the market's sections                 (main row; active = longest path prefix)
 *   section 4  tools:    <p><a>Søk</a></p> · <p><em><a>Bli kunde</a></em></p> · <p><em><strong><a>Logg inn</a></strong></em></p>
 * Authored lists/paragraphs are MOVED into the layout (EW1–EW3); the mobile action and the mobile audience list are presentational
 * clones with their instrumentation stripped (EW4). The hamburger is the canon checkbox+label pattern (≤ 1023 px) with the canon
 * keyboard handling; the desktop header is static (direction: never sticky on desktop).
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
  if (searchA) { searchA.prepend(icon('search')); }
  const searchClone = searchP ? strip(searchP.cloneNode(true)) : null;
  const bliClone = bliP ? strip(bliP.cloneNode(true)) : null;
  const loginClone = loginP ? strip(loginP.cloneNode(true)) : null;

  // utility row
  const utility = el('div', { class: 'hdr-utility' },
    el('div', { class: 'container hdr-utility-row' },
      audUl ? el('nav', { class: 'audience', 'aria-label': 'Målgruppe' }, audUl) : null,
      el('div', { class: 'hdr-actions' }, searchP ? el('div', { class: 'search-wrap' }, searchP) : null, bliP, loginP)));

  // main row: logo · mobile action · burger · nav
  const logoP = brand?.querySelector('p') || brand?.querySelector('a');
  const logo = logoP ? el('div', { class: 'logo' }, logoP) : null;
  const toggle = el('input', { type: 'checkbox', id: 'ds-nav-toggle', class: 'ds-nav-toggle', tabindex: '-1', 'aria-hidden': 'true' });
  const burger = el('label', { class: 'ds-nav-burger', for: 'ds-nav-toggle', role: 'button', tabindex: '0', 'aria-controls': 'main-menu', 'aria-expanded': 'false' }, el('span', { class: 'ds-nav-burger-icon', 'aria-hidden': 'true' }), el('span', { class: 'ds-nav-burger-label' }, 'Meny'));
  const audClone = audUl ? strip(audUl.cloneNode(true)) : null;
  if (audClone) audClone.setAttribute('aria-label', 'Målgruppe');
  const nav = el('nav', { id: 'main-menu', class: 'ds-nav', 'aria-label': 'Hovedmeny' },
    mktUl ? el('div', { class: 'market' }, mktUl) : el('div', { class: 'market market-empty' }),
    el('div', { class: 'nav-extra' }, audClone ? el('div', { class: 'audience-mobile' }, audClone) : null, el('div', { class: 'nav-extra-actions' }, searchClone ? el('div', { class: 'search-wrap' }, searchClone) : null, bliClone)));
  const main = el('div', { class: 'hdr-main' }, el('div', { class: 'container hdr-main-row' }, logo, el('div', { class: 'hdr-mobile-actions' }, loginClone), toggle, burger, nav));

  const skip = el('nav', { class: 'skip', 'aria-label': 'Hurtiglenker' }, el('a', { href: '#main-menu' }, 'Til hovedmeny'), el('a', { href: '#main-content' }, 'Til hovedinnhold'));
  block.replaceChildren(skip, utility, main);
  document.querySelector('main')?.setAttribute('id', 'main-content');

  // canon nav a11y script (keyboard toggle, Escape closes)
  const sync = () => burger.setAttribute('aria-expanded', String(toggle.checked));
  toggle.addEventListener('change', sync); sync();
  burger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.checked = !toggle.checked; sync(); } });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && toggle.checked) { toggle.checked = false; sync(); burger.focus(); } });
}
