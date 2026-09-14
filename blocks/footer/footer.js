import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { el, icon, sectionsOf, text } from '../../scripts/sb1.js';

/**
 * footer — the canon contact row + Fjell columns + Natt legal band, slotted from the /footer document (canon: stardust/canon/footer.html).
 *   section `contact`        <h2>Kontakt oss</h2> <p>intro link</p> <ul> five channels: <a>name</a><br>sub
 *   sections `contact-panel` the five channel panels in order (verbatim captured content: h3 top line, nested bank lists, link lists)
 *   section `columns`        <h2>…</h2><ul>…</ul> ×N (social links carry their icon image)
 *   section `small`          <ul> legal links · section `address` <p>
 * Channels are native <details> disclosures (dynamics #6 interim); the "Finn kontor" panel gets the canon office-search form (block-owned).
 * Authored elements are MOVED (EW1); the channel list keeps its <ul> (the editable unit) — its items become the disclosures.
 */
const CHANNEL_ICON = { 'Ring oss': 'phone', 'Avtal møte': 'calendar', 'Skriv til oss': 'mail', 'Finn kontor': 'office', Chat: 'chat' };

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;
  const sections = sectionsOf(fragment);
  const byStyle = (name) => sections.filter((s) => s.classList.contains(name));
  const wrapOf = (s) => s?.querySelector(':scope > .default-content-wrapper') || s;
  const root = el('div', { class: 'footer-root' });

  // contact row
  const contactSec = byStyle('contact')[0];
  if (contactSec) {
    const w = wrapOf(contactSec); const panels = byStyle('contact-panel').map(wrapOf);
    const h2 = w.querySelector('h2'); const intro = [...w.querySelectorAll('p')].find((p) => p.querySelector('a'));
    const head = el('div', { class: 'contact-head' }, h2, intro);
    const ul = w.querySelector('ul');
    if (ul) {
      ul.classList.add('channels');
      [...ul.children].forEach((li, i) => {
        li.classList.add('channel');
        const p = li.querySelector(':scope > p'); if (p) p.replaceWith(...p.childNodes);
        const a = li.querySelector('a'); const name = text(a);
        const rest = []; let seen = false;
        [...li.childNodes].forEach((n) => { if (n === a) { seen = true; return; } if (seen) { if (n.nodeType === 1 && n.tagName === 'BR') { n.remove(); return; } rest.push(n); } });
        const summary = el('summary', {},
          el('span', { class: 'icon-circle' }, icon(CHANNEL_ICON[name] || 'chat')),
          el('span', { class: 'ch-text' }, el('span', { class: 'ch-name' }, ...(a ? [...a.childNodes] : [])), icon('down'), rest.some((n) => n.textContent.trim()) ? el('span', { class: 'ch-sub' }, ...rest) : null));
        if (a) a.remove();
        const panel = el('div', { class: 'panel' });
        const src = panels[i];
        if (src) {
          if (name === 'Finn kontor') {
            const h3 = src.querySelector('h3'); if (h3) panel.append(el('h3', { class: 'panel-title' }, ...h3.childNodes));
            panel.append(el('form', { class: 'office-search', action: 'https://www.sparebank1.no/nb/bank/privat/kundeservice.html?search=', method: 'get' },
              el('label', { for: 'office-q' }, 'Søk etter et kontor'),
              el('div', { class: 'router-controls' }, el('input', { id: 'office-q', name: 'search', type: 'search', class: 'router-input' }), el('button', { class: 'button primary', type: 'submit' }, 'Søk'))));
          } else {
            [...src.children].forEach((n) => {
              if (n.tagName === 'H3') { n.classList.add('panel-title'); n.querySelectorAll('a').forEach((x) => x.classList.add('num')); panel.append(n); return; }
              if (n.tagName === 'UL') {
                const nested = n.querySelector('ul');
                n.classList.add(nested ? 'bank-numbers' : 'bank-links');
                if (nested) [...n.children].forEach((bank) => { const inner = bank.querySelector(':scope > ul'); bank.querySelector(':scope > a')?.classList.add('bank-name'); if (inner) { inner.classList.add('markets'); [...inner.children].forEach((m) => { const links = m.querySelectorAll('a'); if (links[0]) links[0].classList.add('num'); }); } });
                panel.append(n); return;
              }
              if (n.tagName === 'P') { n.classList.add('small'); panel.append(n); return; }
              panel.append(n);
            });
          }
        }
        const details = el('details', { id: `kontakt-${i + 1}` }, summary, panel);
        li.replaceChildren(details);
      });
    }
    root.append(el('section', { class: 'contact', id: 'kontakt' }, el('div', { class: 'container' }, head, ul)));
  }

  // columns
  const colsSec = byStyle('columns')[0];
  if (colsSec) {
    const w = wrapOf(colsSec); const cols = el('div', { class: 'container footer-cols' });
    let col = null;
    [...w.children].forEach((n) => {
      if (n.tagName === 'H2') { col = el('div', { class: 'footer-col' }, n); cols.append(col); return; }
      if (n.tagName === 'UL') { if (!col) { col = el('div', { class: 'footer-col' }); cols.append(col); } n.querySelectorAll('li').forEach((li) => { const p = li.querySelector(':scope > p'); if (p) p.replaceWith(...p.childNodes); if (li.querySelector('picture, img')) li.querySelector('a')?.classList.add('with-icon'); }); col.append(n); col = null; return; }
      if (col) col.append(n); else cols.append(n);
    });
    root.append(el('div', { class: 'footer-main' }, cols));
  }

  // legal band
  const small = wrapOf(byStyle('small')[0]); const addr = wrapOf(byStyle('address')[0]);
  const legalRow = el('div', { class: 'container footer-legal-row' });
  const smallUl = small?.querySelector('ul'); if (smallUl) { smallUl.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes)); legalRow.append(el('div', { class: 'small-links' }, smallUl)); }
  const addrP = addr?.querySelector('p'); if (addrP) legalRow.append(el('div', { class: 'address' }, addrP));
  if (legalRow.children.length) root.append(el('div', { class: 'footer-legal' }, legalRow));

  block.replaceChildren(root);
}
