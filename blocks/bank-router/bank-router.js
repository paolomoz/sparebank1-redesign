import { el, icon } from '../../scripts/sb1.js';
import siteConfig from '../../scripts/site-config.js';

/**
 * bank-router — the alliance router as a Vann card (canon: stardust/canon/bank-router.html), authored once as /fragments/bank-router.
 * Rows (positional, template-slotted): 1 heading · 2 lede · 3 [postcode label | placeholder] · 4 position button label ·
 * 5 "all banks" label · 6..N one row per bank [name link | tagline]. Heading, lede and every bank row are MOVED into the card
 * (EW1). Two renderings: `router--tile` on the market landing (body.market-landing) and `router--band` everywhere else.
 *
 * Behaviour (dynamics #1, reproduced from the source's inline bank chooser): a 4-digit postcode filters the authored banks by
 * their postal ranges (/data/bank-choice/banks.json — the source's server-rendered `bankPickerlist.postalRange`, synced by
 * stardust/scripts/dynamics/sync-bank-choice.mjs); matches list first, the rest behind "Se resten av bankene"; no match opens
 * the full list; letters or < 4 digits + Enter show the source's validation message. Bank links point at the SAME page under the
 * chosen bank (the source's per-page `url`). "Bruk min posisjon" needs the host-bound coordinates → postcode service and renders
 * only when the owner enables `bankChoiceGeolocation` in scripts/site-config.js.
 * @ew-exempt <p> postcode label / placeholder / button labels (rows 3–5) — form-control config copied into the controls
 * @ew-exempt lookup state strings (STR) — the source widget's data-* strings, verbatim; not page copy
 * @ew-exempt img landscape illustration (fixed brand asset, /img root-relative)
 */
const STR = {
  rest: 'Se resten av bankene',
  hide: 'Skjul bankene',
  continue: 'Fortsett til',
  invalid: 'Skriv inn et gyldig postnummer (4 siffer).',
  positionPlaceholder: 'Din posisjon',
  positionAccess: 'Tips! Tillatt nettleseren å hente din stedsinformasjon.',
  positionFail: 'Vi finner ikke posisjonen din. Prøv å skriv et postnummer i stedet!',
};

let ranges = null;
function loadRanges() {
  ranges ||= fetch(`${window.hlx?.codeBasePath || ''}/data/bank-choice/banks.json`)
    .then((r) => (r.ok ? r.json() : { data: [] }))
    .then(({ data = [] }) => new Map(data.map((b) => [b.bank, b.postalRange])))
    .catch(() => new Map());
  return ranges;
}

/** Bank short name + language tree from an authored link (https://www.sparebank1.no/<lang>/<bank>/…). */
function bankOf(a) {
  try { const [, lang, bank] = new URL(a.href).pathname.split('/'); return { lang, bank }; } catch { return {}; }
}

/** The current page under another bank: /nb/bank/<rest> → https://www.sparebank1.no/<lang>/<bank>/<rest>.html. */
function samePageUnder({ lang, bank }) {
  const path = window.location.pathname.replace(/^\/spike-b(?=\/)/, '').replace(/\.html$/, '').replace(/\/$/, '');
  const m = path.match(/^\/nb\/bank(\/.+)$/);
  return m && lang && bank ? `https://www.sparebank1.no/${lang}/${bank}${m[1]}.html` : null;
}

const inRange = (zip, list = []) => list.some(([from, to]) => +zip >= +from && +zip <= +to);

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
  const items = [];
  rows.slice(5).forEach((r) => {
    const link = r.children[0]?.querySelector('p, a'); const tag = r.children[1]?.querySelector('p');
    const li = el('li', {});
    const a = link && (link.matches('a') ? link : link.querySelector('a'));
    if (a) {
      a.setAttribute('translate', 'no');
      const id = bankOf(a); const href = samePageUnder(id);
      if (href) a.href = href;
      items.push({ li, a, ...id });
    }
    if (link) li.append(link);
    if (tag) li.append(el('span', { class: 'bank-tagline' }, tag));
    banks.append(li);
  });

  const input = el('input', { class: 'input', id: 'postnummer-input', name: 'postnummer', type: 'text', inputmode: 'numeric', maxlength: '4', autocomplete: 'postal-code', placeholder, 'aria-describedby': 'postnummer-error' });
  const error = el('p', { class: 'router-error', id: 'postnummer-error', role: 'alert', hidden: true });
  const geo = siteConfig.bankChoiceGeolocation || {};
  const posBtn = geo.enabled && navigator.geolocation
    ? el('button', { class: 'button on-dark', type: 'button' }, icon('pin'), el('span', {}, position)) : null;
  const form = el('form', { class: 'router-form', action: '#alle-banker', method: 'get', role: 'search' },
    el('label', { class: 'field-label', for: 'postnummer-input' }, label),
    el('div', { class: 'field-row' }, input, posBtn),
    error);
  const matches = el('ol', { class: 'bank-list bank-matches', 'aria-live': 'polite' });
  const results = el('div', { class: 'router-results', hidden: true }, matches);
  const summary = el('summary', { class: 'arrow arrow--on-dark' }, all);
  const details = el('details', { class: 'router-all', id: 'alle-banker' }, summary, banks);
  const art = el('img', { class: 'router-art', src: '/img/bankchoice_bg.png', alt: '', 'aria-hidden': 'true', width: '1250', height: '368', loading: 'eager', fetchpriority: 'high', decoding: 'async' });
  const tile = document.body.classList.contains('market-landing');
  const body = el('div', { class: 'router-body' }, el('div', { class: 'router-text' }, heading, lede), form, results, details);
  const aside = tile
    ? el('aside', { class: 'card card--dark router router--tile', 'aria-label': heading?.textContent.trim() || 'Vi er flere banker i hele Norge' }, body, art)
    : el('aside', { class: 'router router--band', 'aria-label': heading?.textContent.trim() || 'Vi er flere banker i hele Norge' }, el('div', { class: 'container' }, el('div', { class: 'card card--dark router-card' }, body, art)));
  block.replaceChildren(aside);

  let filtered = false;
  const syncSummary = () => { summary.textContent = details.open ? STR.hide : (filtered ? STR.rest : all); };
  details.addEventListener('toggle', syncSummary);
  const showError = (on) => { error.hidden = !on; error.textContent = on ? STR.invalid : ''; input.setAttribute('aria-invalid', String(on)); };
  const reset = () => {
    items.forEach(({ li }) => { li.classList.remove('is-featured'); li.querySelector('.bank-continue')?.remove(); banks.append(li); });
    results.hidden = true; filtered = false; details.open = false; block.dataset.zip = ''; block.dataset.matches = ''; syncSummary();
  };
  const lookup = async (zip) => {
    const table = await loadRanges();
    if (input.value.trim() !== zip) return; // typed on while the snapshot loaded
    reset();
    const hits = table.size ? items.filter((b) => inRange(zip, table.get(b.bank))) : [];
    block.dataset.zip = zip; block.dataset.matches = String(hits.length);
    if (!hits.length) { details.open = true; syncSummary(); return; } // no bank for this postcode (or no snapshot): the full list, open
    hits.forEach(({ li }) => matches.append(li));
    if (hits.length === 1) {
      const [{ li, a }] = hits;
      li.classList.add('is-featured');
      li.append(el('a', { class: 'bank-continue arrow arrow--on-dark', href: a.href, translate: 'no' }, `${STR.continue} ${a.textContent.trim()}`));
    }
    filtered = true; results.hidden = false; syncSummary();
  };
  const onValue = () => {
    const v = input.value.trim();
    if (posBtn) posBtn.hidden = v !== '';
    if (!v) { showError(false); reset(); return; }
    if (/^\d{4}$/.test(v)) { showError(false); lookup(v); return; }
    showError(/\D/.test(v) && v.length > 1);
  };
  input.addEventListener('input', onValue);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (/^\d{4}$/.test(v)) lookup(v); else if (v) showError(true); else { details.open = true; syncSummary(); }
  });
  input.addEventListener('focus', loadRanges, { once: true });

  posBtn?.addEventListener('click', () => {
    posBtn.disabled = true; error.hidden = true;
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const r = await fetch(`${geo.endpoint}${coords.latitude.toFixed(5)}/${coords.longitude.toFixed(5)}`);
        const { postnummer } = r.ok ? await r.json() : {};
        if (!postnummer) throw new Error('no postcode');
        input.value = postnummer; input.placeholder = STR.positionPlaceholder; onValue();
      } catch { error.hidden = false; error.textContent = STR.positionFail; }
      posBtn.disabled = false;
    }, (err) => {
      error.hidden = false; error.textContent = err.code === err.PERMISSION_DENIED ? STR.positionAccess : STR.positionFail;
      posBtn.disabled = false;
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
  });
}
