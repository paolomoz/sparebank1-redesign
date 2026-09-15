// Verbatim chrome data from a captured page's rendered DOM (header · router · footer). Never rewords.
import fs from 'node:fs'; import { parseHTML } from 'linkedom';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
export function loadDoc(slug){ const html=fs.readFileSync(`stardust/current/pages/${slug}.html`,'utf8'); return parseHTML(html).document; }
export function pageJson(slug){ return JSON.parse(fs.readFileSync(`stardust/current/pages/${slug}.json`,'utf8')); }
export function headerData(doc){
  const h=doc.querySelector('header');
  const audience=[...h.querySelectorAll('.header__top-nav a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href'),active:/\bactive\b/.test(a.className)}));
  const market=[...h.querySelectorAll('nav.header__main-nav a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href'),active:/\bactive\b/.test(a.className)}));
  const logo=h.querySelector('.header__logo a'); const search=h.querySelector('.search-toggle[href]')||h.querySelector('a.header__search-mobile');
  let bli=h.querySelector('#header-bli-kunde a, .menu-actions a.ffe-button--action'); const bliBtn=!bli&&h.querySelector('.menu-actions button.ffe-button--action, #login button.ffe-button--action, .bank-buttons button');
  let bliFallback=null; if(bliBtn){ const f=[...doc.querySelectorAll('footer a, main a')].find(a=>/bli-kunde\.html/.test(a.getAttribute('href')||'')); bliFallback={t:norm(bliBtn.textContent),href:f?f.getAttribute('href'):'/nb/bank/privat/kundeservice/bestill/bli-kunde.html',sourcedFrom:f?'same-page footer link':'site-wide captured URL'}; }
  const login=h.querySelector('#login'); const loginUrl=login?.getAttribute('data-login-url')||'https://login.sparebank1.no/';
  const loginLabel=norm(h.querySelector('#login-button')?.textContent)||'Logg inn';
  return {audience,market,logoHref:logo?.getAttribute('href')||'/nb/bank/privat.html',logoAlt:norm(h.querySelector('.header__logo img')?.getAttribute('alt'))||'SpareBank 1',searchHref:search?.getAttribute('href')||'?search=',searchLabel:norm(h.querySelector('.header__search-desktop')?.getAttribute('aria-label'))||'Søk',bliKunde:bli?{t:norm(bli.textContent),href:bli.getAttribute('href')}:bliFallback,login:{t:loginLabel,href:loginUrl}};
}
export function routerData(doc){
  const r=doc.querySelector('.bank-choice--inline'); if(!r) return null;
  const banks=[...r.querySelectorAll('.bank-choice__all-list--item')].map(li=>{const a=li.querySelector('a'); return {html:norm(a.innerHTML),t:norm(a.textContent),href:a.getAttribute('href'),tagline:norm(li.querySelector('.ffe-micro-text')?.textContent)};});
  return {heading:norm(r.querySelector('.bank-choice__header')?.textContent),lede:norm(r.querySelector('.bank-choice__sublead')?.textContent),label:norm(r.querySelector('label')?.textContent),placeholder:r.querySelector('input')?.getAttribute('placeholder')||'Postnummer',position:norm(r.querySelector('.bank-choice__myposition button')?.textContent).replace(/^Pin/,''),all:norm(r.querySelector('.bank-choice__expand')?.textContent),illustration:r.querySelector('img.bank-choice__background--desktop')?.getAttribute('src'),banks};
}
export function footerData(doc){
  const f=doc.querySelector('footer'); if(!f) return null;
  const contact=f.querySelector('.contact-section');
  const tabs=[...(contact?.querySelectorAll('.customer-action__list [role=tab]')||[])].map(li=>{const id=li.getAttribute('aria-controls'); const p=id?f.querySelector('#'+id):null; const panel={banks:[],links:[],top:null,note:null};
    if(p){ const top=p.querySelector('.call-banks__col2'); if(top){ const tels=[...top.querySelectorAll('.call-option__sub-info a[href^="tel:"]')].map(a=>({t:norm(a.textContent),tel:a.getAttribute('href'),label:norm(a.previousSibling?.textContent||a.parentElement?.firstChild?.textContent||'')})); panel.top={heading:norm(top.querySelector('h3')?.childNodes[0]?.textContent),number:norm(top.querySelector('h3 a')?.textContent),tel:top.querySelector('h3 a')?.getAttribute('href'),info:[...top.querySelectorAll('.call-option__sub-text')].filter(x=>!x.querySelector('a[href^="tel:"]')).map(x=>norm(x.textContent)),links:tels}; }
      for(const b of p.querySelectorAll('.js-contact-bankpicker__bankInfo')){ const a=b.querySelector('.contact-bankpicker__bankname'); const bank={name:norm(a?.textContent),href:a?.getAttribute('href'),markets:[]}; for(const m of b.querySelectorAll('.call-banks__market')){const h4=m.querySelector('h4'); const l=h4?.querySelector('a'); bank.markets.push({market:norm(h4?.childNodes[0]?.textContent),number:norm(l?.textContent),tel:l?.getAttribute('href'),abroad:norm(m.querySelector('.call-option__sub-number')?.textContent),abroadTel:m.querySelector('.call-option__sub-number')?.getAttribute('href'),hours:norm([...m.querySelectorAll('.call-option__sub-text')].map(x=>x.lastChild?.textContent).join(' '))}); } panel.banks.push(bank); }
      if(!panel.banks.length){ const seen=new Set(); panel.links=[...p.querySelectorAll('a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')})).filter(l=>l.t&&!seen.has(l.href)&&seen.add(l.href)); }
      panel.heading=norm(p.querySelector('h2,h3')?.textContent)||null; if(!panel.banks.length&&!panel.links.length) panel.note=norm(p.textContent).slice(0,200); }
    return {name:norm(li.querySelector('.btn-name')?.textContent),sub:norm(li.querySelector('.sub-info')?.textContent),panel};});
  const columns=[...f.querySelectorAll('.footer-bottom__column-links')].filter(c=>c.querySelector('h2')).map(c=>({heading:norm(c.querySelector('h2')?.textContent),links:[...c.querySelectorAll('li a')].map(a=>({t:norm(a.textContent)||norm(a.getAttribute('title'))||norm(a.getAttribute('aria-label')),href:a.getAttribute('href'),icon:(i=>i?(i.getAttribute('src')||i.getAttribute('data-lazy-src')||i.getAttribute('data-lazy-largesrc')):null)(a.querySelector('img'))}))}));
  const small=[...f.querySelectorAll('.footer-bottom__small-links li a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')}));
  return {contactHeading:norm(contact?.querySelector('h2')?.textContent),contactLink:(()=>{const a=contact?.querySelector('.text-wrapper a'); return a?{t:norm(a.textContent),href:a.getAttribute('href')}:null;})(),tabs,columns:withSocialIcons(columns),small,address:norm(f.querySelector('.footer-bottom__address')?.textContent)};
}
const SOCIAL_ICONS={linkedin:'/content/dam/SB1/ikoner/SoMe/linkedin-hvit.svg',youtube:'/content/dam/SB1/ikoner/SoMe/youtube-hvit.svg',facebook:'/content/dam/SB1/ikoner/SoMe/facebook-hvit.svg',instagram:'/content/dam/SB1/ikoner/SoMe/instagram-hvit.svg'};
/** Social links whose capture carries no <img> (some frontend-clientlib footers) get the brand's white SoMe icon by host — parity with the site-wide footer (canon gap #1). */
export const withSocialIcons=(cols)=>{ for(const c of cols) for(const l of c.links){ if(l.icon) continue; const k=Object.keys(SOCIAL_ICONS).find(k=>new RegExp(k,'i').test(l.href||'')); if(k) l.icon=SOCIAL_ICONS[k]; } return cols; };
export function frontendFooter(doc){
  const f=doc.querySelector('main footer.footer, main .footer'); if(!f) return null;
  const columns=[...f.querySelectorAll('.footer-columns__column')].map(c=>({heading:norm(c.querySelector('h2,h3')?.textContent),links:[...c.querySelectorAll('li a, p a')].map(a=>({t:norm(a.textContent)||norm(a.getAttribute('title'))||norm(a.getAttribute('aria-label')),href:a.getAttribute('href'),icon:(i=>i?(i.getAttribute('src')||i.getAttribute('data-lazy-src')):null)(a.querySelector('img'))}))})).filter(c=>c.heading||c.links.length);
  const small=[...f.querySelectorAll('.footer-columns__bottom li a, .footer-bottom li a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')}));
  return {contactHeading:'',contactLink:null,tabs:[],columns:withSocialIcons(columns),small,address:norm(f.querySelector('.footer-info, .footer-columns__address, address')?.textContent)};
}
if (process.argv[1]===new URL(import.meta.url).pathname){ const slug=process.argv[2]||'nb-bank-privat-html'; const d=loadDoc(slug); console.log(JSON.stringify({header:headerData(d),router:routerData(d),footer:footerData(d)},null,1)); }
