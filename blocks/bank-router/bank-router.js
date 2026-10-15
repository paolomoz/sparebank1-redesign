import { el, icon } from '../../scripts/sb1.js';
import { siteConfig } from '../../scripts/site-config.js';

/**
 * bank-router — the alliance router as a Vann card (canon: stardust/canon/bank-router.html), authored once as /fragments/bank-router.
 * Rows (positional, template-slotted): 1 heading · 2 lede · 3 [postcode label | placeholder | invalid-postcode message] ·
 * 4 [position button label | position failed message] · 5 [all banks | hide banks | rest of the banks | continue-to prefix] ·
 * 6..N one row per bank [name link | tagline | postcode ranges "0050–1295, 2607–2658"]. Heading, lede and every bank row are
 * MOVED into the card (EW1).
 * Postcode → bank (dynamics #1, recovered from the source's filteredBankList: a bank matches when the 4-digit postcode falls in
 * one of its authored ranges, inclusive): one match → "Fortsett til <bank>", several → the matching banks with the rest behind
 * the toggle, none → every bank. Without authored ranges the field just opens the full list (the earlier interim).
 * "Bruk min posisjon" needs the source's coordinates → postcode service (siteConfig.bankChoiceGeolocation, owner-bound) and is
 * not rendered until it is enabled. Bank links follow the page: /nb/bank/<path> links to /nb/<bank>/<path>.html, like the source.
 * Two renderings: `router--tile` on the market landing (body.market-landing — the tall centred hero tile with the landscape behind)
 * and `router--band` everywhere else (the compact contained card under the header).
 * @ew-exempt <p> postcode label / placeholder / messages / button labels (rows 3–5) — form-control config copied into the controls
 * @ew-exempt <p> postcode ranges (bank rows, cell 3) — data read into the filter, not displayed
 * @ew-exempt img landscape illustration (fixed brand asset, /img root-relative)
 */

/** "0050–1295, 2607–2658, 3528" → [[50, 1295], [2607, 2658], [3528, 3528]] */
export function parseRanges(textValue) {
  return [...(textValue || '').matchAll(/(\d{4})(?:\s*[–—-]\s*(\d{4}))?/g)].map(([, from, to]) => [Number(from), Number(to || from)]);
}

/** the source's validity rule: exactly four digits */
export const isPostcode = (v) => /^\d{4}$/.test(v);

/** banks whose ranges contain the postcode (inclusive), in authored order */
export function banksFor(banks, postcode) {
  const n = Number(postcode);
  return banks.filter((b) => b.ranges.some(([from, to]) => n >= from && n <= to));
}

/** /nb/<bank>/privat.html + page /nb/bank/privat/lan/boliglan → /nb/<bank>/privat/lan/boliglan.html (source bankPickerlist urls) */
function pageHref(href, pathname) {
  const page = pathname.replace(/\.html$/, '').match(/\/nb\/bank\/(.+)$/);
  if (!page) return href;
  try {
    const u = new URL(href, window.location.href);
    const [, lang, bank] = u.pathname.split('/');
    if (!lang || !bank) return href;
    u.pathname = `/${lang}/${bank}/${page[1].replace(/\/$/, '')}.html`;
    return u.href;
  } catch { return href; }
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 6) return;
  const cellText = (r, i = 0) => r.children[i]?.textContent.trim() || '';
  const [headingP] = rows[0].querySelectorAll('p, h1, h2, h3');
  const [ledeP] = rows[1].querySelectorAll('p');
  const label = cellText(rows[2], 0) || 'Ditt postnummer'; const placeholder = cellText(rows[2], 1) || 'Postnummer';
  const invalidMsg = cellText(rows[2], 2) || 'Skriv inn et gyldig postnummer (4 siffer).';
  const position = cellText(rows[3]) || 'Bruk min posisjon';
  const positionFail = cellText(rows[3], 1) || 'Vi finner ikke posisjonen din. Prøv å skriv et postnummer i stedet!';
  const all = cellText(rows[4]) || 'Se alle banker'; const hide = cellText(rows[4], 1) || 'Skjul bankene';
  const rest = cellText(rows[4], 2) || 'Se resten av bankene'; const fortsett = cellText(rows[4], 3) || 'Fortsett til';
  const heading = headingP ? el('div', { class: 'router-heading' }, headingP) : null;
  const lede = ledeP ? el('div', { class: 'router-lede' }, ledeP) : null;

  const banks = rows.slice(5).map((r) => {
    const link = r.children[0]?.querySelector('p, a'); const tag = r.children[1]?.querySelector('p');
    const a = link && (link.matches('a') ? link : link.querySelector('a'));
    if (a) { a.setAttribute('translate', 'no'); a.href = pageHref(a.getAttribute('href'), window.location.pathname); }
    const li = el('li', {}, link, tag ? el('span', { class: 'bank-tagline' }, tag) : null);
    return { li, a, tag, ranges: parseRanges(cellText(r, 2)) };
  });
  const filterable = banks.some((b) => b.ranges.length);

  const input = el('input', {
    class: 'input', id: 'postnummer-input', name: 'postnummer', type: 'text', inputmode: 'numeric', maxlength: '4',
    autocomplete: 'postal-code', placeholder, role: 'searchbox', 'aria-describedby': 'postnummer-error',
  });
  const geo = siteConfig.bankChoiceGeolocation;
  const posButton = geo?.enabled && navigator.geolocation
    ? el('button', { class: 'button on-dark router-position', type: 'button' }, icon('pin'), el('span', {}, position)) : null;
  const error = el('p', { class: 'router-error', id: 'postnummer-error', role: 'alert', hidden: true });
  const result = el('ol', { class: 'router-result', 'aria-live': 'polite', hidden: true });
  const list = el('ol', { class: 'bank-list' }, banks.map((b) => b.li));
  const summary = el('summary', { class: 'arrow arrow--on-dark' }, all);
  const details = el('details', { class: 'router-all', id: 'alle-banker' }, summary, list);
  const form = el('form', { class: 'router-form', action: '#alle-banker', method: 'get', role: 'search' },
    el('label', { class: 'field-label', for: 'postnummer-input' }, label),
    el('div', { class: 'field-row' }, input, posButton), error);

  const art = el('img', { class: 'router-art', src: '/img/bankchoice_bg.png', alt: '', 'aria-hidden': 'true', width: '1250', height: '368', loading: 'eager', fetchpriority: 'high', decoding: 'async' });
  const tile = document.body.classList.contains('market-landing');
  const body = el('div', { class: 'router-body' }, el('div', { class: 'router-text' }, heading, lede), form, result, details);
  const aside = tile
    ? el('aside', { class: 'card card--dark router router--tile', 'aria-label': heading?.textContent.trim() || 'Vi er flere banker i hele Norge' }, body, art)
    : el('aside', { class: 'router router--band', 'aria-label': heading?.textContent.trim() || 'Vi er flere banker i hele Norge' }, el('div', { class: 'container' }, el('div', { class: 'card card--dark router-card' }, body, art)));
  block.replaceChildren(aside);

  // the toggle's label follows the state, as on the source: all banks ↔ hide, or rest of the banks ↔ hide after a match
  let closedLabel = all;
  const syncSummary = () => { summary.textContent = details.open ? hide : closedLabel; };
  details.addEventListener('toggle', syncSummary);
  const showError = (on) => { error.textContent = on ? invalidMsg : ''; error.hidden = !on; input.setAttribute('aria-invalid', on ? 'true' : 'false'); };

  const render = (value) => {
    const v = value.trim();
    showError(v.length > 1 && /\D/.test(v));
    result.replaceChildren(); result.hidden = true;
    banks.forEach((b) => { b.li.hidden = false; list.append(b.li); });
    closedLabel = all; details.open = false;
    if (posButton) posButton.hidden = false;
    if (!isPostcode(v)) { syncSummary(); return; }
    if (!filterable) { details.open = true; syncSummary(); return; }
    const hits = banksFor(banks, v);
    if (posButton) posButton.hidden = true;
    if (!hits.length) { details.open = true; syncSummary(); return; }
    if (hits.length === 1) {
      const [b] = hits; b.li.hidden = true;
      result.append(el('li', { class: 'router-featured' },
        b.tag ? el('span', { class: 'bank-tagline' }, b.tag.textContent) : null,
        el('a', { class: 'router-continue', href: b.a?.href || '#', translate: 'no' }, `${fortsett} ${b.a?.textContent.trim() || ''}`)));
    } else {
      hits.forEach((b) => result.append(b.li));
    }
    result.hidden = false;
    closedLabel = rest; syncSummary();
  };

  input.addEventListener('input', () => render(input.value));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (v.length && !isPostcode(v)) { showError(true); return; }
    render(v);
    (result.hidden ? details : result).scrollIntoView({ block: 'nearest' });
  });

  if (posButton) {
    posButton.addEventListener('click', () => {
      posButton.setAttribute('aria-busy', 'true');
      const fail = () => { posButton.removeAttribute('aria-busy'); error.textContent = positionFail; error.hidden = false; };
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        try {
          const url = geo.endpoint.replace('{lat}', coords.latitude.toFixed(5)).replace('{long}', coords.longitude.toFixed(5));
          const res = await fetch(url);
          const { postnummer } = res.ok ? await res.json() : {};
          if (!postnummer) throw new Error('no postcode');
          posButton.removeAttribute('aria-busy');
          input.value = postnummer; render(postnummer);
        } catch { fail(); }
      }, fail, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
    });
  }
}
