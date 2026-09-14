import { el, icon } from '../../scripts/sb1.js';

/**
 * cobranding — the canon LOfavør membership disclosure (category hub): a head row that opens a co-branded panel.
 * Authoring (three two-cell rows):
 *   [question]        [toggle label]                  → the head row (whole row toggles; the chevron is a text-free <button>, EW7)
 *   [partner logo]    [name heading, prose, CTAs]     → the panel's main column
 *   [illustration]    [note paragraph]                → the panel's side column (optional)
 * Every authored node is MOVED into wrappers (EW1–EW3); the panel is `hidden` until opened (the canon <details> starts closed).
 */
export default function decorate(block) {
  const [headRow, mainRow, sideRow] = [...block.children];
  if (!headRow) return;
  const [qCell, tCell] = [...headRow.children];
  const btn = el('button', { type: 'button', class: 'cobrand-toggle-btn', 'aria-expanded': 'false', 'aria-controls': 'cobrand-panel', 'aria-label': 'Vis fordeler' }, icon('down'));
  const toggle = el('div', { class: 'cobrand-toggle' }, ...(tCell ? [...tCell.childNodes] : []), btn);
  const head = el('div', { class: 'cobrand-head' }, el('div', { class: 'cobrand-q' }, ...(qCell ? [...qCell.childNodes] : [])), toggle);
  const panel = el('div', { class: 'cobrand-panel', id: 'cobrand-panel', hidden: true });
  if (mainRow) {
    const [logoCell, bodyCell] = [...mainRow.children];
    const main = el('div', { class: 'cobrand-main' });
    const logo = logoCell?.querySelector('picture, img'); if (logo) main.append(el('div', { class: 'cobrand-logo' }, logo));
    const ctaRow = el('div', { class: 'cta-row' });
    [...(bodyCell?.children || [])].forEach((n) => {
      if (n.matches('p') && n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim()) { ctaRow.append(n); return; }
      main.append(n);
    });
    if (ctaRow.children.length) main.append(ctaRow);
    panel.append(main);
  }
  if (sideRow) {
    const [illuCell, noteCell] = [...sideRow.children];
    const side = el('aside', { class: 'cobrand-side' });
    const illu = illuCell?.querySelector('picture, img'); if (illu) side.append(el('div', { class: 'cobrand-illu' }, illu));
    [...(noteCell?.childNodes || [])].forEach((n) => side.append(n));
    panel.append(side);
  }
  const open = () => { const isOpen = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!isOpen)); panel.hidden = isOpen; block.classList.toggle('is-open', !isOpen); };
  head.addEventListener('click', (e) => { if (e.target.closest('a')) return; open(); });
  block.replaceChildren(el('div', { class: 'cobrand' }, head, panel));
}
