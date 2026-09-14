// Shared chrome + canon CSS for every Flow B prototype. Authored under DESIGN.md (target) — this file IS the canon source
// (header.html / footer.html / canon.css are lifted from the canon-author render, see canon-extraction.md).
import fs from 'node:fs';
const esc=s=>String(s??'').replace(/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export { esc };
export const ORIGIN='https://www.sparebank1.no';
export const asset=p=>!p?'':(/^https?:/.test(p)?p:ORIGIN+p);
export function favicon(){ const b=fs.readFileSync('stardust/current/assets/favicon.png').toString('base64'); return `<link rel="icon" href="data:image/png;base64,${b}">`; }
export function logoSvg(alt){ let s=fs.readFileSync('stardust/current/assets/logo.svg','utf8'); s=s.replace(/<\?xml[^>]*>|<!--[\s\S]*?-->|<!DOCTYPE[^>]*>/g,'').trim(); s=s.replace(/<svg([^>]*)>/,(m,a)=>`<svg${a.replace(/\s(width|height|x|y|enable-background|xml:space)="[^"]*"/g,'')} class="logo-svg" role="img" aria-label="${esc(alt)}" focusable="false">`); return s; }
export const icons={
  search:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
  pin:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-6-5.4-6-11a6 6 0 1 1 12 0c0 5.6-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
  phone:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 3.5h3l1.6 4-2 1.4a10 10 0 0 0 5.9 5.9l1.4-2 4 1.6v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  mail:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  office:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20.5V8.5l8-4.5 8 4.5v12M4 20.5h16M9.5 20.5v-5h5v5"/></svg>',
  chat:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5h16v10H9l-4.5 3.5v-3.5H4z"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 6 6 6-6 6"/></svg>',
  down:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>',
  back:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m15 6-6 6 6 6"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 18h6M10 21h4M8.5 13.5a5 5 0 1 1 7 0c-.9.9-1.5 1.7-1.5 2.5h-4c0-.8-.6-1.6-1.5-2.5z"/></svg>',
  up:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 15 6-6 6 6"/></svg>',
  thumbUp:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 11v9H4v-9h3zm0 0 4-7.5a2 2 0 0 1 2 2V10h5.5a1.5 1.5 0 0 1 1.5 1.7l-1.2 6.6A2 2 0 0 1 16.8 20H7"/></svg>',
  thumbDown:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 13V4h3v9h-3zm0 0-4 7.5a2 2 0 0 1-2-2V14H5.5A1.5 1.5 0 0 1 4 12.3l1.2-6.6A2 2 0 0 1 7.2 4H17"/></svg>',
  external:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};
const channelIcon={'Ring oss':'phone','Avtal møte':'calendar','Skriv til oss':'mail','Finn kontor':'office','Chat':'chat'};

export function skipLinks(){ return `<nav class="skip" aria-label="Hurtiglenker"><a href="#main-menu">Til hovedmeny</a><a href="#main-content">Til hovedinnhold</a></nav>`; }

export function headerHtml(h){
  const aud=h.audience.map(a=>`<li><a href="${esc(a.href)}"${a.active?' aria-current="page" class="is-active"':''}>${esc(a.t)}</a></li>`).join('');
  const mkt=h.market.map(a=>`<li><a href="${esc(a.href)}"${a.active?' aria-current="page" class="is-active"':''}>${esc(a.t)}</a></li>`).join('');
  const bli=h.bliKunde?`<a class="btn btn-secondary btn-sm" href="${esc(h.bliKunde.href)}">${esc(h.bliKunde.t)}</a>`:'';
  const login=`<a class="btn btn-action btn-sm" href="${esc(h.login.href)}" data-slot="login">${esc(h.login.t)}</a>`;
  return `<header data-section="header" data-intent="site navigation, audience switch, one action" data-layout="contained" data-canon data-nav-collapse="hamburger">
  <div class="hdr-utility">
    <div class="container hdr-utility-row">
      <nav class="audience" aria-label="Målgruppe"><ul>${aud}</ul></nav>
      <div class="hdr-actions">
        <a class="btn-icon" href="${esc(h.searchHref)}">${icons.search}<span>${esc(h.searchLabel)}</span></a>
        ${bli}
        ${login}
      </div>
    </div>
  </div>
  <div class="hdr-main">
    <div class="container hdr-main-row">
      <a class="logo" href="${esc(h.logoHref)}">${logoSvg(h.logoAlt)}</a>
      <div class="hdr-mobile-actions"><a class="btn btn-action btn-sm" href="${esc(h.login.href)}">${esc(h.login.t)}</a></div>
      <input type="checkbox" id="ds-nav-toggle" class="ds-nav-toggle" tabindex="-1" aria-hidden="true">
      <label class="ds-nav-burger" for="ds-nav-toggle" role="button" tabindex="0" aria-controls="main-menu" aria-expanded="false"><span class="ds-nav-burger-icon" aria-hidden="true"></span><span class="ds-nav-burger-label">Meny</span></label>
      <nav id="main-menu" class="ds-nav" aria-label="Hovedmeny">
        <ul class="market">${mkt}</ul>
        <div class="nav-extra">
          <ul class="audience-mobile" aria-label="Målgruppe">${aud}</ul>
          <div class="nav-extra-actions"><a class="btn-icon" href="${esc(h.searchHref)}">${icons.search}<span>${esc(h.searchLabel)}</span></a>${bli}</div>
        </div>
      </nav>
    </div>
  </div>
</header>`;
}

export function routerHtml(r){
  if(!r) return '';
  const banks=r.banks.map(b=>`<li><a href="${esc(b.href)}" translate="no">${b.html}</a><span class="bank-tagline">${esc(b.tagline)}</span></li>`).join('');
  return `<aside class="router" data-section="bank-router" data-intent="route the visitor to a regional bank" data-layout="contained" data-module="bank-router" data-canon aria-label="${esc(r.heading)}">
  <div class="container router-grid">
    <div class="router-text">
      <p class="router-heading" data-slot="heading">${esc(r.heading)}</p>
      <p class="router-lede" data-slot="lede">${esc(r.lede)}</p>
    </div>
    <form class="router-form" action="#alle-banker" method="get">
      <label class="router-label" for="postnummer-input" data-slot="postcode-label">${esc(r.label)}</label>
      <div class="router-controls">
        <input class="router-input" id="postnummer-input" name="postnummer" type="text" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="postal-code" placeholder="${esc(r.placeholder)}">
        <button class="btn btn-secondary btn-on-vann" type="submit" data-slot="cta-location">${icons.pin}<span>${esc(r.position)}</span></button>
      </div>
    </form>
    <details class="router-all" id="alle-banker">
      <summary class="btn-inline btn-on-vann" data-slot="cta-all-banks">${esc(r.all)}${icons.down}</summary>
      <ol class="bank-list" data-slot="banks">${banks}</ol>
    </details>
    <img class="router-art" src="${asset(r.illustration)}" alt="" aria-hidden="true" width="1250" height="368" loading="lazy" decoding="async">
  </div>
</aside>`;
}

export function footerHtml(f){
  if(!f) return '';
  const chan=f.tabs.map((t,i)=>{ const p=t.panel; let body='';
    if(p.top) body+=`<div class="panel-top"><h3 class="panel-title">${esc(p.top.heading)} <a href="${esc(p.top.tel)}" class="num">${esc(p.top.number)}</a></h3><p class="small">${p.top.info.map(esc).join('<br>')}</p></div>`;
    if(p.banks.length && p.banks[0].markets.length) body+=`<ul class="bank-numbers">${p.banks.map(b=>`<li><a class="bank-name" href="${esc(b.href)}">${esc(b.name)}</a><dl>${b.markets.map(m=>`<div><dt>${esc(m.market)}</dt> <dd><a href="${esc(m.tel)}" class="num">${esc(m.number)}</a> <span class="small">Fra utland: <a href="${esc(m.abroadTel)}">${esc(m.abroad)}</a> · ${esc(m.hours)}</span></dd></div>`).join('')}</dl></li>`).join('')}</ul>`;
    else if(p.banks.length) body+=`<ul class="bank-links">${p.banks.map(b=>`<li><a href="${esc(b.href)}">${esc(b.name)}</a></li>`).join('')}</ul>`;
    else if(p.links.length) body+=`<ul class="bank-links">${p.links.map(l=>`<li><a href="${esc(l.href)}">${esc(l.t)}</a></li>`).join('')}</ul>`;
    else if(t.name==='Finn kontor') body+=`<form class="office-search" action="${esc(f.searchHref||'?search=')}" method="get"><label for="office-q">Søk etter et kontor</label><div class="router-controls"><input id="office-q" name="search" type="search" class="router-input"><button class="btn btn-primary" type="submit">Søk</button></div></form>`;
    const ic=icons[channelIcon[t.name]||'chat']; if(p.heading && p.heading!==t.name && !body.includes(esc(p.heading))) body=`<h3 class="panel-title">${esc(p.heading)}</h3>`+body;
    return `<li class="channel"><details><summary><span class="icon-circle">${ic}</span><span class="ch-text"><span class="ch-name">${esc(t.name)}</span>${icons.down}${t.sub?` <span class="ch-sub">${esc(t.sub)}</span>`:''}</span></summary><div class="panel">${body}</div></details></li>`; }).join('');
  const cols=f.columns.map(c=>`<div class="footer-col"><h2>${esc(c.heading)}</h2><ul>${c.links.map(l=>`<li><a href="${esc(l.href)}"${l.icon?' class="with-icon"':''}>${l.icon?`<img src="${asset(l.icon)}" alt="" aria-hidden="true" width="20" height="20" loading="lazy">`:''}${esc(l.t)}</a></li>`).join('')}</ul></div>`).join('');
  const small=f.small.map(l=>`<li><a href="${esc(l.href)}">${esc(l.t)}</a></li>`).join('');
  const contact=f.tabs.length?`<section class="contact" data-section="contact-row" data-intent="five contact channels" data-layout="contained" data-module="contact-row" data-items="${f.tabs.length}">
    <div class="container">
      <div class="contact-head"><h2 data-slot="heading">${esc(f.contactHeading)}</h2>${f.contactLink?`<p><a href="${esc(f.contactLink.href)}">${esc(f.contactLink.t)}</a></p>`:''}</div>
      <ul class="channels" data-slot="channels">${chan}</ul>
    </div>
  </section>`:'';
  return `<footer data-section="footer" data-intent="contact and site map" data-layout="contained" data-canon>
  ${contact}
  <div class="footer-main"><div class="container footer-cols">${cols}</div></div>
  <div class="footer-legal"><div class="container footer-legal-row"><ul class="small-links">${small}</ul>${f.address?`<p class="address">${esc(f.address)}</p>`:''}</div></div>
</footer>`;
}

export function navScript(){ return `<script>
(() => {
  const t = document.getElementById('ds-nav-toggle');
  const b = document.querySelector('.ds-nav-burger');
  if (!t || !b) return;
  const sync = () => b.setAttribute('aria-expanded', t.checked);
  t.addEventListener('change', sync); sync();
  b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.checked = !t.checked; sync(); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && t.checked) { t.checked = false; sync(); b.focus(); } });
})();
</script>`; }

export function cssBase(){ return `
@font-face{font-family:"SpareBank1-title-medium";src:url("fonts/SpareBank1-Title-Medium-Web.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"SpareBank1-medium";src:url("fonts/SpareBank1-Medium-Web.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"SpareBank1-regular";src:url("fonts/SpareBank1-Regular-Web.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
*,*::before,*::after{box-sizing:border-box}
html{hanging-punctuation:first;-webkit-text-size-adjust:100%;scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important;animation:none!important}}
body{margin:0;background:var(--color-bg);color:var(--color-fg);font:var(--body)/var(--line-height-body) var(--body-font-family);text-wrap:pretty;-webkit-font-smoothing:antialiased}
::selection{background:var(--frost-30);color:var(--fjell)}
:focus-visible{outline:2px solid var(--sol);outline-offset:2px;border-radius:4px}
img,svg{display:block;max-width:100%}
a{color:var(--vann);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.18em;transition:color var(--dur) var(--ease)}
a:hover{color:var(--fjell)}a:visited{color:var(--lyng)}
h1,h2,h3,h4{margin:0;font-family:var(--heading-font-family);font-weight:400;color:var(--fjell);text-wrap:balance;letter-spacing:-.005em}
h1{font-size:var(--t-headline);line-height:var(--line-height-heading)}h2{font-size:var(--t-headline-sm);line-height:1.15}h3{font-size:var(--t-title);line-height:1.2}h4{font-family:var(--title-font-family);font-size:var(--title);line-height:1.25}
.display{font-size:var(--t-display);line-height:1.1;letter-spacing:-.01em}
.title-sm{font-family:var(--title-font-family);font-size:var(--title);line-height:1.25}
p{margin:0}p+p{margin-top:var(--spacing-md)}
.lead{font-size:var(--lead);line-height:1.5;max-width:60ch}.small{font-size:var(--body-sm);line-height:1.45}.label{font-family:var(--title-font-family);font-size:var(--label);line-height:1.4;letter-spacing:.01em}
.muted{color:var(--moerkgraa)}.paper .muted,.paper-sand .muted,.paper-frost .muted,.paper-syrin .muted{color:var(--koksgraa)}
.prose{max-width:68ch}.prose p+p,.prose ul,.prose ol{margin-top:var(--spacing-md)}.prose li+li{margin-top:var(--spacing-sm)}
strong,b{font-family:var(--title-font-family);font-weight:400}
.num,.tabular,td,.price{font-variant-numeric:tabular-nums}
ul,ol{margin:0;padding:0;list-style:none}
.container{width:min(100% - 2*var(--gutter),var(--max-width));margin-inline:auto}
.movement{padding-block:var(--section-padding)}
.paper-sand{background:var(--sand-30)}.paper-frost{background:var(--frost-30)}.paper-syrin{background:var(--syrin-30)}.paper-vann{background:var(--vann);color:#fff}
.visually-hidden{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
.skip a{position:absolute;left:8px;top:-100px;z-index:100;padding:10px 16px;background:var(--fjell);color:#fff;border-radius:var(--radius-sm)}.skip a:focus{top:8px}
/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:10px 24px;border-radius:var(--radius-pill);border:2px solid transparent;font:var(--body)/1.2 var(--body-font-family);text-decoration:none;cursor:pointer;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease),border-color var(--dur) var(--ease)}
.btn svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.btn-primary{background:var(--vann);color:#fff}.btn-primary:hover{background:var(--fjell);color:#fff}
.btn-action{background:var(--skog);color:#fff}.btn-action:hover{background:var(--skog-hover);color:#fff}
.btn-secondary{background:#fff;color:var(--vann);border-color:var(--vann)}.btn-secondary:hover{background:var(--frost-30);color:var(--fjell);border-color:var(--fjell)}
.btn-secondary.btn-on-vann{background:transparent;color:#fff;border-color:#fff}.btn-secondary.btn-on-vann:hover{background:#fff;color:var(--fjell);border-color:#fff}
.btn-inline{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:8px 4px;color:var(--vann);background:none;border:0;font:var(--body)/1.2 var(--body-font-family);cursor:pointer;text-decoration:none}.btn-inline:hover{text-decoration:underline;color:var(--fjell)}
.btn-inline.btn-on-vann{color:#fff}.btn-inline.btn-on-vann:hover{color:#fff}
.btn-inline svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.btn-sm{min-height:40px;padding:8px 18px;font-size:var(--body-sm)}
.btn-icon{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:6px 10px;color:var(--fjell);text-decoration:none;border-radius:var(--radius-sm);font-size:var(--body-sm)}.btn-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.btn-icon:hover{background:var(--frost-30);color:var(--fjell)}
.link-more{display:inline-flex;align-items:center;gap:4px}.link-more svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--dur) var(--ease)}.link-more:hover svg{transform:translateX(3px)}
/* header */
header[data-canon]{background:#fff;border-bottom:1px solid var(--lysgraa);position:relative;z-index:20}
.hdr-utility{border-bottom:1px solid var(--lysgraa)}
.hdr-utility-row{display:flex;align-items:center;justify-content:space-between;min-height:44px;gap:16px}
.audience ul,.audience-mobile{display:flex;gap:4px}
.audience a,.audience-mobile a{display:inline-flex;align-items:center;min-height:36px;padding:0 12px;color:var(--fjell);text-decoration:none;font-size:var(--body-sm);border-radius:var(--radius-pill);font-family:var(--title-font-family)}
.audience a.is-active,.audience-mobile a.is-active{background:var(--frost-30)}.audience a:hover,.audience-mobile a:hover{color:var(--vann)}
.hdr-actions{display:flex;align-items:center;gap:8px}
.hdr-main-row{position:relative;display:flex;align-items:center;gap:32px;min-height:64px}
.logo{display:flex;align-items:center;flex:0 0 auto;width:140px;min-height:44px}.logo-svg{width:140px;height:auto}
.hdr-mobile-actions{display:none;margin-left:auto}
.ds-nav-toggle{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
.ds-nav-burger{display:none}
.ds-nav{display:flex;align-items:center;flex:1 1 auto;gap:var(--spacing-md)}
.ds-nav .market{display:flex;flex-wrap:wrap;gap:4px 20px}
.ds-nav .market a{display:inline-flex;align-items:center;min-height:44px;color:var(--fjell);text-decoration:none;border-bottom:2px solid transparent;padding:0 2px;transition:border-color var(--dur) var(--ease)}
.ds-nav .market a:hover,.ds-nav .market a.is-active{border-bottom-color:var(--vann);color:var(--fjell)}
.nav-extra{display:none}
/* router */
.router{background:var(--vann);color:#fff}
.router-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) 38%;grid-template-areas:"text form art" "all form art";align-items:center;column-gap:32px;row-gap:0;min-height:150px;padding-block:8px}
.router-text{align-self:end}.router-all{align-self:start}.router-form{align-self:center}
.router-text{grid-area:text}.router-heading{font-family:var(--title-font-family);font-size:var(--title);line-height:1.2;margin:0}.router-lede{font-size:var(--body-sm);opacity:.92;margin:2px 0 0}
.router-form{grid-area:form;display:grid;gap:4px}.router-label{font-size:var(--label);font-family:var(--title-font-family);letter-spacing:.01em}
.router-controls{display:flex;gap:8px;flex-wrap:wrap}
.router-input{min-height:44px;width:9.5rem;padding:10px 14px;border:1px solid var(--lysgraa);border-radius:var(--radius-sm);font:var(--body)/1.2 var(--body-font-family);color:var(--color-fg);background:#fff}
.router-input:focus-visible{outline:2px solid var(--sol);outline-offset:2px;border-color:var(--vann)}
.router-all{grid-area:all}.router-all summary{list-style:none;justify-self:start}.router-all summary::-webkit-details-marker{display:none}.router-all[open] summary svg{transform:rotate(180deg)}
.bank-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px 24px;padding:8px 0 20px}
.bank-list li{padding:10px 0;border-top:1px solid rgba(255,255,255,.35)}.bank-list a{color:#fff;text-decoration:none;font-family:var(--title-font-family)}.bank-list a:hover{text-decoration:underline}.bank-list strong{display:block;font-size:var(--lead)}.bank-tagline{display:block;font-size:var(--body-sm);opacity:.9}
.router-art{grid-area:art;align-self:center;justify-self:end;width:100%;max-width:520px;height:auto;aspect-ratio:1250/368;max-height:150px;object-fit:contain;object-position:right center}
/* back link */
.backlink{display:inline-flex;align-items:center;gap:4px;font-size:var(--body-sm);text-decoration:none;min-height:44px}.backlink svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
/* cards */
.card{position:relative;display:grid;gap:12px;padding:var(--spacing-lg);background:var(--sand-30);border-radius:var(--radius);transition:box-shadow var(--dur) var(--ease),transform var(--dur) var(--ease)}
.card.frost{background:var(--frost-30)}.card.plain{background:#fff;border:1px solid var(--lysgraa)}
.card:hover,.card:focus-within{box-shadow:var(--shadow-lift)}
.card .card-title a{color:var(--fjell);text-decoration:none}.card .card-title a::after{content:"";position:absolute;inset:0;border-radius:inherit}.card:hover .card-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.15em}
.card .meta{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--koksgraa);font-size:var(--label);font-family:var(--title-font-family);letter-spacing:.01em}
.photo{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;background:var(--frost-30);border-radius:var(--radius-img) 0 var(--radius-img) 0}
.photo-sm{border-radius:var(--radius-img-sm) 0 var(--radius-img-sm) 0}
.illu{width:72px;height:72px;object-fit:contain}
.promo-illu{height:auto}
/* footer */
footer[data-canon]{margin-top:0}
.contact{padding-block:var(--section-padding);border-top:1px solid var(--lysgraa)}
.contact-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px 24px;margin-bottom:var(--spacing-lg)}
.channels{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}
.channel details{border-radius:var(--radius)}.channel summary{list-style:none;display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:16px;border-radius:var(--radius);cursor:pointer;transition:background-color var(--dur) var(--ease)}.channel summary::-webkit-details-marker{display:none}
.channel summary{position:relative;padding-right:16px}.channel .ch-text{display:grid;grid-template-columns:auto 22px;column-gap:6px;align-items:center}.channel .ch-name{grid-column:1}.channel .ch-text>svg{grid-column:2;width:22px;height:22px;fill:none;stroke:var(--vann);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--dur) var(--ease)}.channel details[open] .ch-text>svg{transform:rotate(180deg)}.channel .ch-sub{grid-column:1/-1}.channel summary:hover{background:var(--frost-30)}.channel summary:hover .ch-name{text-decoration:underline}.channel summary>svg{position:absolute;left:0;top:0;width:0;height:0;opacity:0;fill:none;stroke:var(--vann);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--dur) var(--ease)}.channel details[open] summary>svg{transform:rotate(180deg)}
.icon-circle{display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;background:var(--vann);color:#fff}.icon-circle svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.ch-text{display:grid}.ch-name{font-family:var(--title-font-family);color:var(--fjell);font-size:var(--lead)}.ch-sub{font-size:var(--body-sm);color:var(--koksgraa)}
.channel .panel{grid-column:1/-1;padding:16px 16px 8px}
.channel details[open]{grid-column:1/-1;background:var(--sand-30)}.channel details[open] summary{background:transparent}
.channels{grid-auto-flow:row dense}
.panel-title{font-family:var(--title-font-family);font-size:var(--lead);color:var(--fjell)}.panel-title .num{font-family:var(--body-font-family)}
.bank-numbers{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px 32px;margin-top:16px}
.bank-numbers li{border-top:1px solid var(--lysgraa);padding-top:12px}.bank-name{font-family:var(--title-font-family);color:var(--fjell);text-decoration:none}.bank-name:hover{text-decoration:underline}
.bank-numbers dl{margin:8px 0 0;display:grid;gap:6px}.bank-numbers dt{display:inline;font-family:var(--title-font-family)}.bank-numbers dd{display:inline;margin:0}.bank-numbers dl>div{display:flex;flex-wrap:wrap;gap:4px 8px}
.bank-links{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px 24px}.bank-links li{padding:10px 0;border-top:1px solid var(--lysgraa)}
.office-search{display:grid;gap:4px;max-width:420px}
.footer-main{background:var(--fjell);color:#fff;padding-block:var(--section-padding)}
.footer-cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
.footer-col h2{color:#fff;font-family:var(--title-font-family);font-size:var(--title);margin-bottom:12px}
.footer-col li{padding:0}.footer-col a{display:inline-flex;align-items:center;min-height:44px}.footer-col a.with-icon{gap:8px}.footer-col a.with-icon img{width:20px;height:20px}.footer-col a{color:#fff;text-decoration:none}.footer-col a:hover{text-decoration:underline;color:#fff}.footer-col a:visited{color:#fff}
.footer-legal{background:var(--natt);color:#fff;padding-block:24px;font-size:var(--body-sm)}
.footer-legal-row{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 32px}
.small-links{display:flex;flex-wrap:wrap;gap:0 24px}.small-links a{display:inline-flex;align-items:center;min-height:44px;color:#fff;text-decoration:none}.small-links a:hover{text-decoration:underline;color:#fff}.small-links a:visited{color:#fff}
.address{opacity:.9}
/* generic modules */
.faq details{border-top:1px solid var(--lysgraa)}.faq details:last-of-type{border-bottom:1px solid var(--lysgraa)}
.faq summary{list-style:none;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 0;cursor:pointer;font-family:var(--title-font-family);font-size:var(--title);line-height:1.25;color:var(--fjell)}.faq summary::-webkit-details-marker{display:none}
.faq summary svg{flex:0 0 auto;width:24px;height:24px;margin-top:4px;fill:none;stroke:var(--vann);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--dur) var(--ease)}.faq details[open] summary svg{transform:rotate(180deg)}
.faq .answer{padding:0 0 24px;max-width:68ch}
.feedback{border-top:1px solid var(--lysgraa);padding-block:var(--spacing-xl)}.feedback-row{display:flex;flex-wrap:wrap;align-items:center;gap:16px 32px}.feedback h2{font-family:var(--title-font-family);font-size:var(--title)}
.feedback .btn svg{width:22px;height:22px}
.callout{display:flex;gap:16px;padding:20px 24px;background:var(--sand-30);border-radius:var(--radius);max-width:68ch}.callout svg{flex:0 0 auto;width:28px;height:28px;fill:none;stroke:var(--sol);stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.cta-band{display:grid;gap:12px;max-width:68ch}
@media (max-width:1279px){.router-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr) 32%}}
@media (max-width:1023px){
  .ds-nav-burger{margin-left:auto}
  .router-grid{grid-template-columns:1fr 1fr;grid-template-areas:"text all" "form form" "art art";row-gap:8px;padding-block:16px 0;min-height:0}.router-all{justify-self:end;align-self:center}.router-art{max-width:none;max-height:none;aspect-ratio:auto;justify-self:stretch;height:56px;width:100%;object-fit:cover;object-position:50% 60%;margin-top:8px}
  .channels{grid-template-columns:repeat(3,minmax(0,1fr))}.footer-cols{grid-template-columns:1fr 1fr}
}
@media (max-width:1023px){
  .hdr-main-row{gap:12px;min-height:60px}
  .ds-nav-burger{display:inline-flex;align-items:center;gap:8px;cursor:pointer;min-height:40px;padding:8px 12px;font:var(--body-sm)/1 var(--body-font-family);color:var(--fjell);background:transparent;border:1px solid var(--fjell);border-radius:var(--radius-pill);user-select:none}
  .ds-nav-burger-icon{width:16px;height:12px;position:relative}.ds-nav-burger-icon::before,.ds-nav-burger-icon::after{content:"";position:absolute;left:0;right:0;height:2px;background:currentColor}.ds-nav-burger-icon::before{top:0}.ds-nav-burger-icon::after{bottom:0}
  .ds-nav{position:absolute;top:100%;left:calc(-1*var(--gutter));right:calc(-1*var(--gutter));flex-direction:column;align-items:stretch;gap:0;padding:8px var(--gutter) 24px;background:#fff;border-top:1px solid var(--lysgraa);border-bottom:1px solid var(--lysgraa);transform:translateY(-8px);opacity:0;visibility:hidden;pointer-events:none;transition:transform var(--dur) var(--ease),opacity var(--dur) var(--ease),visibility 0s linear var(--dur)}
  .ds-nav .market{display:block}.ds-nav .market a{display:flex;min-height:48px;border-bottom:1px solid var(--lysgraa);font-size:var(--lead)}.ds-nav .market a.is-active{border-bottom:1px solid var(--lysgraa);color:var(--vann)}
  .nav-extra{display:none}
  @media (max-width:640px){.nav-extra{display:grid;gap:12px;padding-top:16px}}.audience-mobile{gap:8px}.nav-extra-actions{display:flex;flex-wrap:wrap;gap:8px}
  .ds-nav-toggle:checked ~ .ds-nav{transform:translateY(0);opacity:1;visibility:visible;pointer-events:auto;transition:transform var(--dur) var(--ease),opacity var(--dur) var(--ease),visibility 0s linear 0s}
}
@media (max-width:640px){
  .hdr-utility{display:none}.hdr-mobile-actions{display:flex}.logo,.logo-svg{width:118px}
  .router-grid{grid-template-columns:1fr;grid-template-areas:"text" "all" "form" "art";row-gap:0;padding-top:10px}.router-all{justify-self:start;align-self:auto}.router-all summary{min-height:38px;padding-block:4px}.router-text{align-self:auto}.router-lede{margin-top:0}.router-label{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%)}.router-form{position:relative}.router-input{width:9rem}.router-art{height:32px;margin-top:6px}.router-heading{font-size:var(--lead)}
  .channels{grid-template-columns:1fr 1fr}.channel summary{padding:12px}.icon-circle{width:48px;height:48px}
  .footer-cols{grid-template-columns:1fr}
}
@media (max-width:400px){.channels{grid-template-columns:1fr}}
`; }

export function rootTokens(){ return `:root {
  --heading-font-family: "SpareBank1-title-medium", arial, sans-serif;
  --title-font-family:   "SpareBank1-medium", arial, sans-serif;
  --body-font-family:    "SpareBank1-regular", arial, sans-serif;

  --heading-xxl: 61px;  --heading-xl: 49px;  --heading-lg: 39px;  --heading-md: 31px;
  --title: 25px;  --lead: 20px;  --body: 16px;  --body-sm: 14px;  --label: 13px;
  --t-display: clamp(2.5rem, 1.6rem + 2.4vw, 3.8125rem);
  --t-headline: clamp(2.125rem, 1.5rem + 1.7vw, 3.0625rem);
  --t-headline-sm: clamp(1.75rem, 1.4rem + 1vw, 2.4375rem);
  --t-title: clamp(1.5rem, 1.3rem + .6vw, 1.9375rem);
  --line-height-heading: 1.12;  --line-height-body: 1.55;

  /* Hvit */ --color-bg: #ffffff;  /* Svart */ --color-fg: #020a0a;  /* Vann */ --color-accent: #005aa4;
  --fjell: #002776; --vann: #005aa4; --natt: #001032; --skog: #00754e; --skog-hover: #095139;
  --frost: #7eb5d2; --frost-30: #d8e9f2; --sand: #f8e9dd; --sand-70: #faf0e7; --sand-30: #fdf8f5; --syrin-30: #f2f2f9;
  --multe: #f8b181; --lyng: #873953; --baer: #e44244; --nordlys: #33af85; --sol: #dc8000;
  --koksgraa: #323232; --moerkgraa: #676767; --graa: #adadad; --lysgraa: #d8d8d8;

  --spacing-xs: 4px;  --spacing-sm: 8px;  --spacing-md: 16px;  --spacing-lg: 24px;  --spacing-xl: 48px;  --spacing-2xl: 64px;  --spacing-3xl: 96px;
  --section-padding: 64px;  --max-width: 1280px;  --gutter: 80px;
  --radius: 16px;  --radius-sm: 8px;  --radius-img: 96px;  --radius-img-sm: 48px;  --radius-pill: 6em;
  --shadow-lift: 0 8px 24px -12px rgba(0, 39, 118, 0.25);
  --dur: 160ms;  --ease: cubic-bezier(0.2, 0, 0, 1);
}
@media (max-width: 1439px) { :root { --gutter: 48px; } }
@media (max-width: 1023px) { :root { --section-padding: 48px; --gutter: 24px; } }
@media (max-width: 640px)  { :root { --section-padding: 32px; --gutter: 20px; } }
`; }
