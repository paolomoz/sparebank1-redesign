#!/usr/bin/env node
// Dump the captured "Kontakt oss" channel panels (tabs + hidden tabpanels) as JSON for verbatim reuse in the footer canon.
import fs from 'node:fs'; import { parseHTML } from 'linkedom';
const slug=process.argv[2]||'nb-bank-privat-html';
const {document}=parseHTML(fs.readFileSync(`stardust/current/pages/${slug}.html`,'utf8'));
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const tabs=[...document.querySelectorAll('.customer-action__list [role=tab]')].map(li=>({id:li.id,panel:li.getAttribute('aria-controls'),name:norm(li.querySelector('.btn-name')?.textContent),sub:norm(li.querySelector('.sub-info')?.textContent),href:li.querySelector('a')?.getAttribute('href')}));
const panels={};
for (const t of tabs){ const p=document.getElementById(t.panel); if(!p) continue;
  const out={heading:norm(p.querySelector('h3,h2')?.textContent), items:[]};
  // call panel: banks with numbers
  for (const b of p.querySelectorAll('.js-contact-bankpicker__bankInfo')){
    const bank={name:norm(b.querySelector('.contact-bankpicker__bankname')?.textContent),href:b.querySelector('.contact-bankpicker__bankname')?.getAttribute('href'),markets:[]};
    for (const m of b.querySelectorAll('.call-banks__market')){ const h=m.querySelector('h4'); const link=h?.querySelector('a'); bank.markets.push({market:norm(h?.childNodes[0]?.textContent),number:norm(link?.textContent),tel:link?.getAttribute('href'),info:norm(m.querySelector('.call-option__sub-info')?.textContent)}); }
    out.items.push(bank);
  }
  const top=p.querySelector('.call-banks__col2'); if(top) out.top={heading:norm(top.querySelector('h3')?.textContent),tel:top.querySelector('a')?.getAttribute('href'),info:norm(top.querySelector('.call-option__sub-info')?.textContent)};
  // link lists (meeting/message/chat/find office)
  out.links=[...p.querySelectorAll('a')].filter(a=>!/^tel:/.test(a.getAttribute('href')||'')&&!a.closest('.call-banks__bankname')).map(a=>({t:norm(a.textContent),href:a.getAttribute('href')})).filter(l=>l.t);
  out.text=norm(p.textContent).slice(0,600);
  panels[t.name]=out; }
console.log(JSON.stringify({tabs,panels},null,1));
