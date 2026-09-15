import { el, icon } from '../../scripts/sb1.js';

/**
 * bank-router — the alliance router as a Vann card (canon: stardust/canon/bank-router.html), authored once as /fragments/bank-router.
 * Rows (positional, template-slotted): 1 heading · 2 lede · 3 [postcode label | placeholder] · 4 position button label ·
 * 5 "all banks" label · 6..N one row per bank [name link | tagline]. Heading, lede and every bank row are MOVED into the card
 * (EW1); the 12-bank list sits behind a native <details> (dynamics #1 interim — the postcode lookup is owner-bound).
 * Two renderings: `router--tile` on the market landing (body.market-landing — the tall centred hero tile with the landscape behind)
 * and `router--band` everywhere else (the compact contained card under the header).
 * @ew-exempt <p> postcode label / placeholder / button labels (rows 3–5) — form-control config copied into the controls
 * @ew-exempt img landscape illustration (fixed brand asset, /img root-relative)
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 6) return;
  const cellText = (r, i = 0) => r.children[i]?.textContent.trim() || '';
  const [headingP] = rows[0].querySelectorAll('p, h1, h2, h3');
  const [ledeP] = rows[1].querySelectorAll('p');
  const label = cellText(rows[2], 0) || 'Ditt postnummer'; const placeholder = cellText(rows[2], 1) || 'Postnummer';
  const position = cellText(rows[3]) || 'Bruk min posisjon'; const all = cellText(rows[4]) || 'Se alle banker';
  const heading = headingP ? el('div', { class: 'router-heading' }, headingP) : null;
  const lede = ledeP ? el('div', { class: 'router-lede' }, ledeP) : null;
  const banks = el('ol', { class: 'bank-list' });
  rows.slice(5).forEach((r) => {
    const link = r.children[0]?.querySelector('p, a'); const tag = r.children[1]?.querySelector('p');
    const li = el('li', {});
    if (link) { const a = link.matches('a') ? link : link.querySelector('a'); if (a) a.setAttribute('translate', 'no'); li.append(link); }
    if (tag) li.append(el('span', { class: 'bank-tagline' }, tag));
    banks.append(li);
  });
  const form = el('form', { class: 'router-form', action: '#alle-banker', method: 'get' },
    el('label', { class: 'field-label', for: 'postnummer-input' }, label),
    el('div', { class: 'field-row' },
      el('input', { class: 'input', id: 'postnummer-input', name: 'postnummer', type: 'text', inputmode: 'numeric', pattern: '[0-9]{4}', maxlength: '4', autocomplete: 'postal-code', placeholder }),
      el('button', { class: 'button on-dark', type: 'submit' }, icon('pin'), el('span', {}, position))));
  const details = el('details', { class: 'router-all', id: 'alle-banker' }, el('summary', { class: 'arrow arrow--on-dark' }, all), banks);
  const art = el('img', { class: 'router-art', src: '/img/bankchoice_bg.png', alt: '', 'aria-hidden': 'true', width: '1250', height: '368', loading: 'eager', fetchpriority: 'high', decoding: 'async' });
  const tile = document.body.classList.contains('market-landing');
  const body = el('div', { class: 'router-body' }, el('div', { class: 'router-text' }, heading, lede), form, details);
  const aside = tile
    ? el('aside', { class: 'card card--dark router router--tile', 'aria-label': heading?.textContent.trim() || 'Vi er flere banker i hele Norge' }, body, art)
    : el('aside', { class: 'router router--band', 'aria-label': heading?.textContent.trim() || 'Vi er flere banker i hele Norge' }, el('div', { class: 'container' }, el('div', { class: 'card card--dark router-card' }, body, art)));
  block.replaceChildren(aside);
  // dynamics #1 interim: a 4-digit postcode opens the bank list (the lookup service is owner-bound)
  form.addEventListener('submit', (e) => { e.preventDefault(); details.open = true; details.scrollIntoView({ block: 'nearest' }); });
}
