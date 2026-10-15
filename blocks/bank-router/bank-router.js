import { el, icon } from '../../scripts/sb1.js';
import config, { loadFeatureData } from '../../scripts/site-config.js';

/**
 * bank-router — the alliance router as a Vann card (canon: stardust/canon/bank-router.html), authored once as /fragments/bank-router.
 * Rows (positional, template-slotted): 1 heading · 2 lede · 3 [postcode label | placeholder] · 4 [position button label | searching
 * label? | permission tip? | lookup-failed message?] · 5 [all banks label | hide label? | rest-of-banks label? | continue-to label?] · 6..N one row per
 * bank [name link | tagline]. Heading, lede and every bank row are MOVED into the card (EW1).
 * Behaviour (dynamics #1, lifted from the source's bank-choice component): 4 digits filter the banks whose postal ranges contain the
 * postcode (one match → "Fortsett til <bank>" with its logo; several → matches first; "Se resten av bankene" reveals the rest; no match lists all); "Se alle banker" ⇄ "Skjul bankene"; each bank
 * links to the current page under that bank. Ranges and per-page link targets come from the /data/bank-choice snapshot (the source's
 * window.bankPickerlist); "Bruk min posisjon" needs the owner-bound geolocation service (#1a) and renders only when it is enabled.
 * Two renderings: `router--tile` on the market landing (body.market-landing) and `router--band` everywhere else.
 * @ew-exempt <p> postcode label / placeholder / button labels / state messages (rows 3–5) — form-control config copied into the controls
 * @ew-exempt img landscape illustration (fixed brand asset, /img root-relative)
 */
const SOURCE = 'https://www.sparebank1.no';
// the source component's own strings (data-* on .bank-choice), used when the optional cells are not authored
const DEFAULTS = {
  position: 'Bruk min posisjon',
  finding: 'Søker posisjon',
  positionAccess: 'Tips! Tillatt nettleseren å hente din stedsinformasjon.',
  positionFail: 'Vi finner ikke posisjonen din. Prøv å skriv et postnummer i stedet!',
  all: 'Se alle banker',
  hide: 'Skjul bankene',
  rest: 'Se resten av bankene',
  fortsett: 'Fortsett til',
  invalid: 'Skriv inn et gyldig postnummer (4 siffer).',
};

/** The page path as the source names it (`/nb/bank/privat/lan/boliglan`), whatever prefix the preview copy lives under. */
const sourcePath = () => window.location.pathname.replace(/\.html$/, '').replace(/^.*?(?=\/n[bn]\/bank\/)/, '');

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 6) return;
  const cellText = (r, i = 0) => r.children[i]?.textContent.trim() || '';
  const [headingP] = rows[0].querySelectorAll('p, h1, h2, h3');
  const [ledeP] = rows[1].querySelectorAll('p');
  const label = cellText(rows[2], 0) || 'Ditt postnummer'; const placeholder = cellText(rows[2], 1) || 'Postnummer';
  const t = {
    ...DEFAULTS,
    position: cellText(rows[3], 0) || DEFAULTS.position,
    finding: cellText(rows[3], 1) || DEFAULTS.finding,
    positionAccess: cellText(rows[3], 2) || DEFAULTS.positionAccess,
    positionFail: cellText(rows[3], 3) || DEFAULTS.positionFail,
    all: cellText(rows[4], 0) || DEFAULTS.all,
    hide: cellText(rows[4], 1) || DEFAULTS.hide,
    rest: cellText(rows[4], 2) || DEFAULTS.rest,
    fortsett: cellText(rows[4], 3) || DEFAULTS.fortsett,
  };
  const heading = headingP ? el('div', { class: 'router-heading' }, headingP) : null;
  const lede = ledeP ? el('div', { class: 'router-lede' }, ledeP) : null;
  const banks = el('ol', { class: 'bank-list', id: 'alle-banker', hidden: true });
  const items = rows.slice(5).map((r) => {
    const link = r.children[0]?.querySelector('p, a'); const tag = r.children[1]?.querySelector('p');
    const li = el('li', {});
    const a = link && (link.matches('a') ? link : link.querySelector('a'));
    if (a) a.setAttribute('translate', 'no');
    if (link) li.append(link);
    if (tag) li.append(el('span', { class: 'bank-tagline' }, tag));
    banks.append(li);
    // the bank's short name is its path segment on the source host (/nb/<short>/… or /nn/<short>/…)
    const short = a ? (new URL(a.href, SOURCE).pathname.match(/^\/n[bn]\/([^/]+)\//) || [])[1] : null;
    return {
      li, a, short, tagline: tag?.textContent.trim() || '', ranges: [], logo: null,
    };
  });
  // one matching bank is featured like the source: logo, slogan, "Fortsett til <bank>" (a rendering of the authored row)
  const featured = el('li', { class: 'bank-featured', hidden: true });
  banks.prepend(featured);

  const input = el('input', {
    class: 'input', id: 'postnummer-input', name: 'postnummer', type: 'text', inputmode: 'numeric', maxlength: '4', autocomplete: 'postal-code', placeholder, 'aria-describedby': 'postnummer-msg',
  });
  const msg = el('p', { class: 'field-msg', id: 'postnummer-msg', 'aria-live': 'polite' });
  const geoOn = config.bankChoiceGeolocation.enabled && 'geolocation' in navigator;
  const posLabel = el('span', {}, t.position);
  const posBtn = geoOn ? el('button', { class: 'button on-dark', type: 'button' }, icon('pin'), posLabel) : null;
  const form = el('form', { class: 'router-form', role: 'search', action: '#alle-banker', method: 'get' },
    el('label', { class: 'field-label', for: 'postnummer-input' }, label),
    el('div', { class: 'field-row' }, input, posBtn),
    msg);
  const toggle = el('button', {
    class: 'router-toggle arrow arrow--on-dark', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'alle-banker',
  }, t.all);
  const art = el('img', {
    class: 'router-art', src: '/img/bankchoice_bg.png', alt: '', 'aria-hidden': 'true', width: '1250', height: '368', loading: 'eager', fetchpriority: 'high', decoding: 'async',
  });
  const tile = document.body.classList.contains('market-landing');
  const body = el('div', { class: 'router-body' }, el('div', { class: 'router-text' }, heading, lede), form, el('div', { class: 'router-all' }, toggle), banks);
  const aria = heading?.textContent.trim() || 'Vi er flere banker i hele Norge';
  const aside = tile
    ? el('aside', { class: 'card card--dark router router--tile', 'aria-label': aria }, body, art)
    : el('aside', { class: 'router router--band', 'aria-label': aria }, el('div', { class: 'container' }, el('div', { class: 'card card--dark router-card' }, body, art)));
  block.replaceChildren(aside);

  // state: the typed postcode + an explicit open/closed override of the automatic state — rendered like the source component
  let open = null;
  const render = () => {
    const q = input.value.trim();
    const valid = /^\d{4}$/.test(q);
    msg.textContent = q && /\D/.test(q) ? t.invalid : '';
    input.setAttribute('aria-invalid', msg.textContent ? 'true' : 'false');
    const matches = valid ? items.filter((b) => b.ranges.some((r) => r.from <= q && q <= r.to)) : [];
    const filtered = matches.length > 0;
    const shown = open ?? (valid && !filtered); // a postcode without banks lists them all
    const single = matches.length === 1 ? matches[0] : null;
    (filtered ? [...matches, ...items.filter((b) => !matches.includes(b))] : items).forEach((b) => banks.append(b.li));
    items.forEach((b) => {
      b.li.hidden = b === single || (filtered && !shown && !matches.includes(b));
      b.li.classList.toggle('is-match', filtered && matches.includes(b));
    });
    featured.hidden = !single;
    if (single) {
      featured.replaceChildren(
        single.logo ? el('img', {
          class: 'bank-logo', src: single.logo, alt: single.a?.textContent.trim() || '', loading: 'lazy', height: '32',
        }) : null,
        el('span', { class: 'bank-tagline' }, single.tagline),
        el('a', { class: 'arrow arrow--on-dark bank-continue', href: single.a?.href || '#', translate: 'no' }, `${t.fortsett} ${single.a?.textContent.trim() || ''}`),
      );
      banks.prepend(featured);
    }
    banks.hidden = !filtered && !shown;
    toggle.textContent = (shown && t.hide) || (filtered ? t.rest : t.all);
    toggle.setAttribute('aria-expanded', String(shown));
    if (posBtn) posBtn.hidden = valid;
    block.dataset.matches = String(matches.length);
  };
  input.addEventListener('input', () => { open = null; render(); });
  form.addEventListener('submit', (e) => { e.preventDefault(); render(); });
  toggle.addEventListener('click', () => { open = toggle.getAttribute('aria-expanded') !== 'true'; render(); });

  if (posBtn) {
    posBtn.addEventListener('click', () => {
      posLabel.textContent = t.finding; posBtn.setAttribute('aria-busy', 'true');
      const done = (text) => { posLabel.textContent = t.position; posBtn.removeAttribute('aria-busy'); msg.textContent = text || ''; };
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        try {
          const url = config.bankChoiceGeolocation.url.replace('{lat}', coords.latitude.toFixed(5)).replace('{lon}', coords.longitude.toFixed(5));
          const res = await fetch(url, { headers: { accept: 'application/vnd.sparebank1.v1+json' } });
          const { postnummer } = await res.json();
          if (!/^\d{4}$/.test(postnummer || '')) throw new Error('no postcode');
          done(); input.value = postnummer; open = null; render();
        } catch { done(t.positionFail); }
      }, () => done(t.positionAccess));
    });
  }

  render();
  // ranges + per-page link targets from the snapshot (off the critical path; the list works as plain links without it)
  loadFeatureData('bankChoiceData').then((res) => {
    if (!res) return;
    const { banks: data, pages, snapshotAt } = res.data;
    const page = pages?.[sourcePath()];
    const rest = sourcePath().replace(/^\/nb\/bank\//, '');
    items.forEach((b) => {
      const d = data.find((x) => x.shortName === b.short);
      if (!d) return;
      b.ranges = d.postalRange;
      b.logo = d.logo;
      if (b.a && page === 'same-path') b.a.href = `${SOURCE}${d.prefix}${rest}.html`;
      else if (b.a && page?.[b.short]) b.a.href = `${SOURCE}${page[b.short]}`;
    });
    block.dataset.snapshot = snapshotAt;
    render();
  });
}
