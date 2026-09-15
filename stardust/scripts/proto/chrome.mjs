// Shared chrome + canon CSS for every Flow B prototype. Authored under DESIGN.md (target) — this file IS the canon source
// (header.html / footer.html / canon.css are lifted from the canon-author render, see canon-extraction.md).
import fs from 'node:fs';
const esc=s=>String(s??'').replace(/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export { esc };
export const ORIGIN='https://www.sparebank1.no';
export const asset=p=>(!p||p==='null'||p==='undefined')?'':(/^https?:/.test(p)?p:ORIGIN+p); // a stringified null never becomes an origin-relative URL
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
  info:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.5"/></svg>',
  play:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/></svg>',
  external:'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};
const channelIcon={'Ring oss':'phone','Avtal møte':'calendar','Skriv til oss':'mail','Finn kontor':'office','Chat':'chat'};


// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Round 01 canon (2026-09-15): Danske Bank structure (two-tier header, sticky hide/reveal, 2 px cards with 6 px gutters,
// bento rows, dark footer grid) × Ramp typography / page width / buttons (1440 container with 64 px gutters, one weight,
// 64/48/40/28/24 scale, 6 px borderless buttons) on the SpareBank 1 palette and faces. See stardust/direction.md § Active
// direction (2026-09-15) and stardust/prototypes/round-01-danske-ramp/README.md.
// ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

export function skipLinks(){ return `<nav class="skip" aria-label="Hurtiglenker"><a href="#main-menu">Til hovedmeny</a><a href="#main-content">Til hovedinnhold</a></nav>`; }

export function headerHtml(h){
  const aud=h.audience.map(a=>`<li><a href="${esc(a.href)}"${a.active?' aria-current="page" class="is-active"':''}>${esc(a.t)}</a></li>`).join('');
  const mkt=h.market.map(a=>`<li><a href="${esc(a.href)}"${a.active?' aria-current="page" class="is-active"':''}>${esc(a.t)}</a></li>`).join('');
  const bliText=h.bliKunde?`<a class="tool-text" href="${esc(h.bliKunde.href)}">${esc(h.bliKunde.t)}</a>`:'';
  const bliRow=h.bliKunde?`<ul class="service"><li><a href="${esc(h.bliKunde.href)}">${esc(h.bliKunde.t)}</a></li></ul>`:'';
  const login=`<a class="btn btn-action btn-nav" href="${esc(h.login.href)}" data-slot="login">${esc(h.login.t)}</a>`;
  return `<header class="site-header" data-section="header" data-intent="site navigation, audience switch, one action" data-layout="contained" data-canon data-nav-collapse="hamburger">
  <div class="settings-bar">
    <div class="container"><nav class="audience" aria-label="Målgruppe"><ul>${aud}</ul></nav></div>
  </div>
  <div class="main-bar">
    <div class="container main-row">
      <a class="logo" href="${esc(h.logoHref)}">${logoSvg(h.logoAlt)}</a>
      <nav id="main-menu" class="primary" aria-label="Hovedmeny">
        <div class="panel-top"><a class="panel-search" href="${esc(h.searchHref)}">${icons.search}<span>${esc(h.searchLabel)}</span></a></div>
        <ul class="audience-m" aria-label="Målgruppe">${aud}</ul>
        <ul class="market">${mkt}</ul>
        ${bliRow}
      </nav>
      <div class="tools">
        ${bliText}
        <a class="tool-search" href="${esc(h.searchHref)}" aria-label="${esc(h.searchLabel)}">${icons.search}<span class="visually-hidden">${esc(h.searchLabel)}</span></a>
        ${login}
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="menu-label">Meny</span></button>
    </div>
  </div>
</header>`;
}

/** Alliance router. `tile:true` renders the tall centred hero tile (home bento); default is the compact contained band under the header. */
export function routerHtml(r,{tile=false}={}){
  if(!r) return '';
  const banks=r.banks.map(b=>`<li><a href="${esc(b.href)}" translate="no">${b.html}</a><span class="bank-tagline">${esc(b.tagline)}</span></li>`).join('');
  const inner=`
    <div class="router-body">
      <div class="router-text">
        <p class="router-heading" data-slot="heading">${esc(r.heading)}</p>
        <p class="router-lede" data-slot="lede">${esc(r.lede)}</p>
      </div>
      <form class="router-form" action="#alle-banker" method="get">
        <label class="field-label" for="postnummer-input" data-slot="postcode-label">${esc(r.label)}</label>
        <div class="field-row">
          <input class="input" id="postnummer-input" name="postnummer" type="text" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="postal-code" placeholder="${esc(r.placeholder)}">
          <button class="btn btn-on-dark" type="submit" data-slot="cta-location">${icons.pin}<span>${esc(r.position)}</span></button>
        </div>
      </form>
      <details class="router-all" id="alle-banker">
        <summary class="arrow arrow--on-dark" data-slot="cta-all-banks">${esc(r.all)}</summary>
        <ol class="bank-list" data-slot="banks">${banks}</ol>
      </details>
    </div>
    <img class="router-art" src="${asset(r.illustration)}" alt="" aria-hidden="true" width="1250" height="368" loading="eager" fetchpriority="high" decoding="async">`;
  if(tile) return `<aside class="card card--dark router router--tile" data-section="bank-router" data-intent="route the visitor to a regional bank" data-layout="bento-cell" data-module="bank-router" data-canon aria-label="${esc(r.heading)}">${inner}
</aside>`;
  return `<aside class="router router--band" data-section="bank-router" data-intent="route the visitor to a regional bank" data-layout="contained" data-module="bank-router" data-canon aria-label="${esc(r.heading)}">
  <div class="container"><div class="card card--dark router-card">${inner}
  </div></div>
</aside>`;
}

export function footerHtml(f){
  if(!f) return '';
  const chan=f.tabs.map((t)=>{ const p=t.panel; let body='';
    if(p.top) body+=`<div class="panel-top"><h3 class="panel-title">${esc(p.top.heading)} <a href="${esc(p.top.tel)}" class="num">${esc(p.top.number)}</a></h3><p class="small">${p.top.info.map(esc).join('<br>')}${(p.top.links||[]).map(l=>`<br>${esc(l.label)} <a href="${esc(l.tel)}" class="num">${esc(l.t)}</a>`).join('')}</p></div>`;
    if(p.banks.length && p.banks[0].markets.length) body+=`<ul class="bank-numbers">${p.banks.map(b=>`<li><a class="bank-name" href="${esc(b.href)}">${esc(b.name)}</a><dl>${b.markets.map(m=>`<div><dt>${esc(m.market)}</dt> <dd><a href="${esc(m.tel)}" class="num">${esc(m.number)}</a> <span class="small">Fra utland: <a href="${esc(m.abroadTel)}">${esc(m.abroad)}</a> · ${esc(m.hours)}</span></dd></div>`).join('')}</dl></li>`).join('')}</ul>`;
    else if(p.banks.length) body+=`<ul class="bank-links">${p.banks.map(b=>`<li><a href="${esc(b.href)}">${esc(b.name)}</a></li>`).join('')}</ul>`;
    else if(p.links.length) body+=`<ul class="bank-links">${p.links.map(l=>`<li><a href="${esc(l.href)}">${esc(l.t)}</a></li>`).join('')}</ul>`;
    else if(t.name==='Finn kontor') body+=`<form class="office-search" action="${esc(f.searchHref||'?search=')}" method="get"><label class="field-label" for="office-q">Søk etter et kontor</label><div class="field-row"><input id="office-q" name="search" type="search" class="input"><button class="btn btn-primary" type="submit">Søk</button></div></form>`;
    const ic=icons[channelIcon[t.name]||'chat']; if(!p.top && p.heading && p.heading!==t.name && !body.includes(esc(p.heading))) body=`<h3 class="panel-title">${esc(p.heading)}</h3>`+body;
    return `<li class="card card--white channel"><details><summary><span class="icon-circle">${ic}</span><span class="ch-text"><span class="ch-name">${esc(t.name)}</span> ${t.sub?`<span class="ch-sub small muted">${esc(t.sub)}</span>`:''}</span><span class="chev" aria-hidden="true"></span></summary><div class="panel">${body}</div></details></li>`; }).join('');
  const cols=f.columns.map(c=>`<div class="footer-col"><h2>${esc(c.heading)}</h2><ul>${c.links.map(l=>`<li><a href="${esc(l.href)}"${l.icon?' class="with-icon"':''}>${l.icon?`<img src="${asset(l.icon)}" alt="" aria-hidden="true" width="20" height="20" loading="lazy">`:''}${esc(l.t)}</a></li>`).join('')}</ul></div>`).join('');
  const small=f.small.map(l=>`<li><a href="${esc(l.href)}">${esc(l.t)}</a></li>`).join('');
  const contact=f.tabs.length?`<section class="contact" id="kontakt" data-section="contact-row" data-intent="five contact channels" data-layout="band" data-module="contact-row" data-items="${f.tabs.length}">
    <div class="container">
      <div class="contact-head"><h2 class="h2-m" data-slot="heading">${esc(f.contactHeading)}</h2>${f.contactLink?`<a class="btn btn-primary btn-lg" href="${esc(f.contactLink.href)}">${esc(f.contactLink.t)}</a>`:''}</div>
      <ul class="channels" data-slot="channels">${chan}</ul>
    </div>
  </section>`:'';
  return `<footer data-section="footer" data-intent="contact and site map" data-layout="contained" data-canon>
  ${contact}
  <div class="site-footer"><div class="container footer-grid">
    <a class="footer-logo" href="/nb/bank/privat.html" aria-label="SpareBank 1">${logoSvg('').replace(/ id="[^"]*"/,' id="SpareBank_1_footer"').replace(/ role="img"/,' aria-hidden="true"')}</a>
    <div class="footer-cols">${cols}</div>
    <div class="footer-legal"><ul class="legal-links">${small}</ul>${f.address?`<p class="address">${esc(f.address)}</p>`:''}</div>
  </div></div>
</footer>`;
}

export function navScript(){ return `<script>
(() => {
  const hdr = document.querySelector('.site-header'); if (!hdr) return;
  const btn = hdr.querySelector('.menu-toggle'); const nav = document.getElementById('main-menu');
  const setOpen = (o) => { hdr.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', String(o)); document.documentElement.classList.toggle('no-scroll', o); };
  btn.addEventListener('click', () => setOpen(!hdr.classList.contains('is-open')));
  addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && hdr.classList.contains('is-open')) { setOpen(false); btn.focus(); } });
  nav.addEventListener('click', (ev) => { if (ev.target.closest('a') && hdr.classList.contains('is-open')) setOpen(false); });
  // Sticky: hide on scroll-down, reveal only the main bar on scroll-up (settings bar stays hidden until the top).
  let last = scrollY; const settings = () => hdr.querySelector('.settings-bar').getBoundingClientRect().height;
  addEventListener('scroll', () => { const y = scrollY; if (hdr.classList.contains('is-open')) return;
    if (y <= 0) hdr.style.transform = ''; else if (y > last && y > hdr.offsetHeight) hdr.style.transform = 'translateY(-100%)'; else if (y < last) hdr.style.transform = 'translateY(-' + settings() + 'px)';
    last = y; }, { passive: true });
})();
</script>`; }

export function cssBase(){ return `
@font-face{font-family:"SpareBank1-title-medium";src:url("fonts/SpareBank1-Title-Medium-Web.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"SpareBank1-medium";src:url("fonts/SpareBank1-Medium-Web.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"SpareBank1-regular";src:url("fonts/SpareBank1-Regular-Web.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}html.no-scroll{overflow:hidden}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{transition:none!important;animation:none!important}}
body{margin:0;background:var(--color-bg);color:var(--color-fg);font:var(--body)/var(--line-height-body) var(--body-font-family);text-wrap:pretty;-webkit-font-smoothing:antialiased}
::selection{background:var(--frost-30);color:var(--fjell)}
:focus-visible{outline:2px solid var(--vann);outline-offset:2px}
img,svg{display:block;max-width:100%}
a{color:var(--vann);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.14em;transition:color var(--dur) var(--ease)}
a:hover{color:var(--fjell)}
h1,h2,h3,h4{margin:0;font-family:var(--heading-font-family);font-weight:400;color:var(--fjell);text-wrap:balance;letter-spacing:0}
h1{font-size:var(--t-headline);line-height:var(--line-height-heading)}h2{font-size:var(--t-headline-sm);line-height:1.05}h3{font-family:var(--title-font-family);font-size:var(--t-title);line-height:1.14}h4{font-family:var(--title-font-family);font-size:var(--title);line-height:1.17}
/* type roles (Ramp scale on the brand faces; one weight, hierarchy by size, leading and two-tone) */
.display,.h1{font-family:var(--heading-font-family);font-size:var(--t-display);line-height:1;letter-spacing:0}
.h2-l{font-family:var(--heading-font-family);font-size:var(--t-headline);line-height:1.04}
.h2-m{font-family:var(--heading-font-family);font-size:var(--t-headline-sm);line-height:1.05}
.title,.h2-s{font-family:var(--title-font-family);font-size:var(--t-title);line-height:1.14;color:var(--fjell)}
.title-sm,.h3{font-family:var(--title-font-family);font-size:var(--title);line-height:1.17;color:var(--fjell)}
.hushed{opacity:.6}
p{margin:0}p+p{margin-top:var(--spacing-md)}
.lead{font-size:var(--lead);line-height:1.33;max-width:60ch}.small{font-size:var(--body-sm);line-height:1.43}.label{font-family:var(--title-font-family);font-size:var(--label);line-height:1.4}
.eyebrow{font-family:var(--title-font-family);font-size:10px;line-height:1.5;letter-spacing:.05em;text-transform:uppercase}
.muted{color:var(--moerkgraa)}.paper .muted,.paper-sand .muted,.paper-frost .muted,.paper-syrin .muted,.card .muted{color:var(--koksgraa)}
.prose{max-width:68ch}.prose p+p,.prose ul,.prose ol{margin-top:var(--spacing-md)}.prose li+li{margin-top:var(--spacing-sm)}
strong,b{font-family:var(--title-font-family);font-weight:400}
.num,.tabular,td,.price{font-variant-numeric:tabular-nums}
ul,ol{margin:0;padding:0;list-style:none}
.container{width:min(100% - 2*var(--gutter),var(--max-width) - 2*var(--gutter));margin-inline:auto}
.full-bleed{padding-inline:var(--card-gap)}
.movement{padding-block:var(--section-padding) 0}.movement:last-child{padding-bottom:var(--section-padding)}
.paper-sand{background:var(--sand-70)}.paper-frost{background:var(--frost-30)}.paper-syrin{background:var(--syrin-30)}.paper-vann{background:var(--vann);color:#fff}
.visually-hidden{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
.skip a{position:absolute;left:8px;top:-100px;z-index:100;padding:10px 16px;background:var(--fjell);color:#fff;border-radius:var(--radius-sm)}.skip a:focus{top:8px}
.section-title{text-align:center;margin:0 auto var(--spacing-lg);max-width:960px}
/* buttons (Ramp geometry: 6 px radius, no border, padding-driven height, darken on hover) */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--title-font-family);font-size:16px;line-height:1;letter-spacing:0;padding:14px 16px;border:0;border-radius:var(--radius-sm);text-decoration:none;white-space:nowrap;cursor:pointer;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease)}
.btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.btn-lg{padding:17px 20px}.btn-nav,.btn-sm{font-size:14px;padding:10px 16px}
.btn-primary{background:var(--vann);color:#fff}.btn-primary:hover{background:var(--fjell);color:#fff}
.btn-action{background:var(--skog);color:#fff}.btn-action:hover{background:var(--skog-hover);color:#fff}
.btn-secondary{background:var(--frost-30);color:var(--fjell)}.btn-secondary:hover{background:var(--frost-70);color:var(--fjell)}
.btn-on-dark,.btn-secondary.btn-on-vann{background:#fff;color:var(--fjell)}.btn-on-dark:hover,.btn-secondary.btn-on-vann:hover{background:var(--frost-30);color:var(--fjell)}
.btn-inline{display:inline-flex;align-items:center;gap:10px;min-height:40px;padding:8px 0;color:var(--vann);background:none;border:0;font:16px/1.5 var(--body-font-family);cursor:pointer;text-decoration:none}.btn-inline:hover{color:var(--fjell)}
.btn-inline.btn-on-vann,.btn-inline.btn-on-vann:hover{color:#fff}
.btn-inline svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--dur) var(--ease)}
.btn:disabled,.btn[aria-disabled="true"],button:disabled,input:disabled,select:disabled,textarea:disabled,.is-disabled{background:var(--lysgraa);color:var(--koksgraa);border-color:var(--lysgraa);cursor:not-allowed;opacity:1}
input:disabled::placeholder{color:var(--koksgraa)}
.badge,a.badge{display:inline-flex;align-items:center;min-height:28px;padding:4px 10px;border-radius:var(--radius-sm);background:var(--frost-30);color:var(--fjell);font-family:var(--title-font-family);font-size:var(--label);text-decoration:none;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease)}a.badge:hover{background:var(--vann);color:#fff}
.video-frame{position:relative;display:grid;place-items:center;aspect-ratio:16/9;background:var(--frost-30);border-radius:var(--radius);overflow:hidden;color:var(--fjell);text-decoration:none}.video-frame svg{width:64px;height:64px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.btn-icon{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:6px 10px;color:var(--fjell);text-decoration:none;border-radius:var(--radius-sm);font-size:var(--body-sm)}.btn-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.btn-icon:hover{background:var(--frost-30);color:var(--fjell)}
.link-more{display:inline-flex;align-items:center;gap:4px}.link-more svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--dur) var(--ease);display:inline-block}.link-more:hover svg{transform:translateX(3px)}
/* arrow link (Danske: no underline, chevron slides on hover) */
.arrow{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:var(--vann);line-height:1.5}
.arrow::after{content:"";width:7px;height:7px;border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;transform:rotate(45deg);transition:transform .2s var(--ease);flex:none}
.arrow:hover{color:var(--fjell)}.arrow:hover::after{transform:translateX(4px) rotate(45deg)}
.arrow--on-dark,.arrow--on-dark:hover{color:#fff}
.link-list li+li{margin-top:8px}
/* inputs */
.input,.router-input{width:100%;height:48px;padding:0 16px;border:0;border-radius:var(--radius-sm);font:inherit;font-size:16px;color:var(--svart);background:#fff}
.paper-sand .input,.card--tint .input,.card--white .input{background:var(--sand-30);box-shadow:inset 0 0 0 1px var(--lysgraa)}
.field-label{display:block;font-family:var(--title-font-family);font-size:var(--body-sm);margin-bottom:8px}
.field-row{display:flex;gap:8px;flex-wrap:wrap}.field-row .input{flex:1 1 140px}
/* header (Danske: 32 px settings bar + 80 px main bar; sticky hide / reveal) */
.site-header{position:sticky;top:0;z-index:50;background:#fff;transition:transform .35s var(--ease)}
.settings-bar{background:var(--sand-70);height:var(--settings-h)}
.audience ul{display:flex;height:var(--settings-h)}
.audience a{display:flex;align-items:center;height:100%;padding:0 20px;font-family:var(--title-font-family);font-size:13px;color:var(--fjell);text-decoration:none}
.audience a:hover{color:var(--vann)}.audience a.is-active{background:#fff}
.main-bar{height:var(--mainbar-h);background:#fff}
.main-row{display:flex;align-items:center;height:var(--mainbar-h);gap:40px}
.logo{flex:none}.logo svg,.logo-svg{height:36px;width:auto}
.primary{flex:1 1 auto;min-width:0}
.primary .panel-top,.primary .audience-m,.primary .service{display:none}
.primary .market{display:flex;gap:20px}
.primary .market a{font-size:14px;line-height:1;color:var(--svart);text-decoration:none;white-space:nowrap;transition:color .2s var(--ease)}
.primary .market a:hover,.primary .market a.is-active{color:var(--vann)}
.tools{display:flex;align-items:center;gap:20px;margin-left:auto;flex:none}
.tool-text{font-size:14px;color:var(--svart);text-decoration:none}.tool-text:hover{color:var(--vann)}
.tool-search{color:var(--svart)}.tool-search svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}.tool-search:hover{color:var(--vann)}
.menu-toggle{display:none}
/* cards (Danske: fill only, 2 px corners, no border, no shadow, 6 px gutters, images bleed) */
.bento{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--card-gap);align-items:stretch}
.bento+.bento{margin-top:var(--card-gap)}
.grid-1>*{grid-column:span 12}.grid-2>*{grid-column:span 6}.grid-3>*{grid-column:span 4}.grid-4>*{grid-column:span 3}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm) var(--spacing-md)}
.card{position:relative;display:flex;flex-direction:column;border-radius:var(--radius);overflow:hidden;background:var(--card-tint);min-width:0;transition:background-color .35s var(--ease)}
.card--tint{background:var(--card-tint)}.card--dark{background:var(--fjell);color:#fff}.card.card--dark a,.card.card--dark h2,.card.card--dark h3,.card.card--dark p,.card.card--dark .router-heading,.card.card--dark .router-lede,.card.card--dark .field-label{color:#fff}
.card--frost,.card.frost{background:var(--frost-30)}.card--syrin{background:var(--syrin-30)}.card--white,.card.plain{background:#fff}
.card-body{padding:var(--card-pad-y) var(--card-pad-x);display:flex;flex-direction:column;flex:1 1 auto;min-width:0}
.card-body>*+*{margin-top:10px}.card-body>p+p{margin-top:16px}
.card-body h3 a,.card-body h2 a,.card .card-title a{color:inherit;text-decoration:none;background-image:linear-gradient(currentColor,currentColor);background-size:0 1px;background-repeat:no-repeat;background-position:0 100%;-webkit-box-decoration-break:clone;box-decoration-break:clone;transition:background-size .4s var(--ease),color var(--dur) var(--ease)}
.card:hover .card-body h3 a,.card:focus-within .card-body h3 a,.card:hover .card-title a,.card:focus-within .card-title a{background-size:100% 1px;color:var(--vann)}
.card-image{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;transition:transform .7s var(--ease)}
.card:hover .card-image,.card:focus-within .card-image{transform:scale(1.04)}
.cover-link::after{content:"";position:absolute;inset:0;z-index:1}
.card .link-list,.card .meta,.card .actions{position:relative;z-index:2}
.card.is-link:hover,.card.is-link:focus-within{background:var(--sand)}
.card--frost.is-link:hover,.card--frost.is-link:focus-within{background:#cbe1ee}
.card--syrin.is-link:hover,.card--syrin.is-link:focus-within{background:var(--syrin-70)}
.actions{margin-top:var(--spacing-lg);display:flex;gap:16px;flex-wrap:wrap}
.card .meta{display:flex;flex-wrap:wrap;gap:6px 14px;color:var(--koksgraa);font-size:var(--body-sm)}
.photo{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;background:var(--frost-30);border-radius:var(--radius)}
.photo-sm{border-radius:var(--radius)}
.illu{width:72px;height:72px;object-fit:contain;transition:transform .5s var(--spring);transform-origin:50% 100%}
.card:hover .illu,.card:focus-within .illu{transform:translateY(-6px) rotate(-3deg)}
.promo-illu{height:auto}
/* legacy card shell used by the page modules (choice / tips / price cards): tinted paper, 2 px corners, no shadow */
.card:not(.card--dark):not(.card--white):not(.card--frost):not(.card--syrin){background:var(--card-tint)}
li.card:not(.channel):not(:has(>.card-body)){padding:var(--spacing-lg)}.card.choice:not(:has(>.card-body)),.card.price-card:not(:has(>.card-body)){display:grid;gap:12px;align-content:start}
.card .card-title a::after{content:"";position:absolute;inset:0}
/* router — band (chrome under the header) and tile (home hero cell) */
.router--band{padding-top:var(--card-gap)}
.router-card{position:relative;overflow:hidden;background:var(--vann)}
.router-body{position:relative;z-index:1}
.router--band .router-body{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1.4fr) auto;align-items:center;gap:16px 32px;padding:20px 36px;min-height:104px}
.router-heading{font-family:var(--title-font-family);font-size:var(--title);line-height:1.17;margin:0;color:#fff}.router-lede{font-size:var(--body-sm);opacity:.85;margin:2px 0 0;color:#fff}
.router .field-label{color:#fff}
.router--band .router-form{display:grid;gap:4px}.router--band .field-label{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0)}
.router--band .field-row{flex-wrap:nowrap}.router--band .input{flex:0 1 180px;height:44px}.router--band .btn-on-dark{padding:12px 16px}
.router summary{list-style:none;cursor:pointer;padding:8px 0;min-height:40px}.router summary::-webkit-details-marker{display:none}.router-all[open]>summary::after{transform:rotate(135deg)}
.router--band .router-all{justify-self:end}.router--band .router-all[open]{grid-column:1/-1}
.bank-list{margin-top:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:0 32px}
.bank-list li{padding:10px 0;border-top:1px solid rgba(255,255,255,.18);font-size:var(--body-sm);line-height:1.43;min-width:0}.bank-list a{color:#fff;text-decoration:none}.bank-list a:hover{text-decoration:underline}.bank-list strong{font-family:var(--title-font-family)}.bank-tagline{display:block;color:rgba(255,255,255,.7)}
.router-art{position:absolute;left:0;right:0;bottom:0;width:100%;height:auto;opacity:.95;pointer-events:none;transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .5s}
.router--band .router-art{left:auto;right:-3%;bottom:-46%;width:56%;opacity:.5}
.router:hover .router-art{transform:translateX(-12px);opacity:1}
.router--tile{background:var(--vann)}
.router--tile .router-body{display:flex;flex-direction:column;align-items:center;text-align:center;padding:56px 36px 64px}
.router--tile .router-body>*{max-width:520px}
.router--tile .router-heading{font-family:var(--heading-font-family);font-size:var(--t-headline-sm);line-height:1.05}.router--tile .router-lede{font-size:var(--lead);line-height:1.33;opacity:.75;margin-top:12px}
.router--tile .router-form{margin-top:24px;width:100%}.router--tile .field-label{font-size:var(--body)}
.router--tile .field-row{flex-direction:column;align-items:center;gap:12px}.router--tile .field-row .input{flex:none;width:220px;text-align:center}
.router--tile .router-all{margin-top:20px;width:100%}.router--tile summary{justify-content:center}.router--tile .bank-list{grid-template-columns:1fr;max-width:520px;margin:16px auto 0;text-align:left}
.router .input:focus{outline:2px solid var(--frost);outline-offset:2px}
/* back link */
.backlink{display:inline-flex;align-items:center;gap:4px;font-size:var(--body-sm);text-decoration:none;min-height:40px}.backlink svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
/* contact band (Danske pre-footer band + white cards) */
footer[data-canon]{margin-top:var(--section-padding)}
.contact{background:var(--sand-70);padding:var(--section-padding) 0}
.contact-head{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:var(--spacing-lg)}
.channels{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:var(--card-gap);align-items:start}
.channel details{display:block}
.channel summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:16px;padding:28px 24px;min-height:120px}.channel summary::-webkit-details-marker{display:none}
.icon-circle{flex:none;width:48px;height:48px;border-radius:50%;background:var(--frost-30);color:var(--vann);display:grid;place-items:center;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease),transform .4s var(--spring)}
.icon-circle svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.ch-text{display:flex;flex-direction:column;gap:2px;min-width:0}.ch-name{font-family:var(--title-font-family);font-size:18px;line-height:1.2;color:var(--fjell);transition:color var(--dur) var(--ease)}
.chev{margin-left:auto;width:8px;height:8px;border-right:1.5px solid var(--vann);border-bottom:1.5px solid var(--vann);transform:rotate(45deg);transition:transform .2s var(--ease);flex:none}
.channel details[open] .chev{transform:rotate(-135deg)}
.channel summary:hover .icon-circle,.channel details[open] .icon-circle{background:var(--vann);color:#fff}.channel summary:hover .icon-circle{transform:scale(1.08)}
.channel summary:hover .chev{transform:translateY(3px) rotate(45deg)}.channel details[open] summary:hover .chev{transform:translateY(-3px) rotate(-135deg)}.channel summary:hover .ch-name{color:var(--vann)}
.channel .panel{padding:0 24px 28px;font-size:var(--body-sm);line-height:1.43}
.channel .panel-title{font-family:var(--title-font-family);font-size:16px;margin-bottom:8px;color:var(--fjell)}.channel .panel-title .num{font-family:var(--body-font-family)}.channel .panel-top{margin-bottom:16px}
.channel .bank-numbers li,.channel .bank-links li{padding:10px 0;border-top:1px solid rgba(0,39,118,.1)}
.channel .bank-name{font-family:var(--title-font-family);text-decoration:none}
.channel dl{margin:6px 0 0}.channel dl div{margin-top:6px}.channel dt{display:inline;font-family:var(--title-font-family)}.channel dt::after{content:": "}.channel dd{display:inline;margin:0}
.channel .office-search .input{height:44px}
/* footer (Danske: dark, 64 px padding, 230 px logo column + link columns, legal in the same grid) */
.site-footer{background:var(--fjell);color:#fff;padding:var(--section-padding) 0}
.footer-grid{display:grid;grid-template-columns:230px 1fr;column-gap:20px;row-gap:var(--section-padding)}
.footer-logo{grid-column:1;grid-row:1;align-self:start}.footer-logo svg{height:30px;width:auto}.footer-logo svg path[fill="#002776"]{fill:#fff}
.footer-cols{grid-column:2;grid-row:1;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:20px}
.footer-col h2{font-family:var(--title-font-family);font-size:16px;line-height:1.5;color:#fff}
.footer-col ul{margin-top:22px}.footer-col li{font-size:var(--body-sm);line-height:1.43}.footer-col li+li{margin-top:8px}
.footer-col a{color:#fff;text-decoration:none;background-image:linear-gradient(currentColor,currentColor);background-size:0 1px;background-repeat:no-repeat;background-position:0 100%;transition:background-size .3s var(--ease)}.footer-col a:hover{background-size:100% 1px;color:#fff}.footer-col a:visited{color:#fff}
.footer-col .with-icon{display:inline-flex;align-items:center;gap:8px}.footer-col .with-icon img{width:20px;height:20px}
.footer-legal{grid-column:2;grid-row:2;font-size:12px;line-height:1.34;color:rgba(255,255,255,.85)}
.legal-links{display:flex;flex-wrap:wrap;gap:6px 20px}.legal-links a{color:#fff;text-decoration:underline}.footer-legal .address{margin-top:20px}
/* generic modules */
.faq details{border-top:1px solid rgba(0,39,118,.12)}.faq details:last-of-type{border-bottom:1px solid rgba(0,39,118,.12)}
.faq summary{list-style:none;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 0;cursor:pointer;font-family:var(--title-font-family);font-size:var(--title);line-height:1.2;color:var(--fjell)}.faq summary::-webkit-details-marker{display:none}
.faq summary svg{flex:0 0 auto;width:24px;height:24px;margin-top:2px;fill:none;stroke:var(--vann);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform var(--dur) var(--ease)}.faq details[open] summary svg{transform:rotate(180deg)}
.faq .answer{padding:0 0 24px;max-width:68ch}
.feedback{padding-block:var(--spacing-xl)}.feedback-row{display:flex;flex-wrap:wrap;align-items:center;gap:16px 32px;padding:32px 36px;background:var(--sand-70);border-radius:var(--radius)}.feedback h2{font-family:var(--title-font-family);font-size:var(--title)}
.feedback .btn svg{width:22px;height:22px}
.callout{display:flex;gap:16px;padding:24px 28px;background:var(--sand-70);border-radius:var(--radius);max-width:68ch}.callout svg{flex:0 0 auto;width:28px;height:28px;fill:none;stroke:var(--sol);stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}.callout.info{background:var(--frost-30)}.callout.info svg{stroke:var(--vann)}
.cta-band{display:grid;gap:12px;max-width:68ch}
/* responsive */
@media (max-width:1320px){.primary .market{gap:16px}.primary .market a{font-size:13px}.main-row{gap:28px}}
@media (max-width:1140px){
  .settings-bar{display:none}.logo svg,.logo-svg{height:30px}.main-row{gap:16px}
  .tools .tool-text,.tools .tool-search{display:none}
  .menu-toggle{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:72px;height:var(--mainbar-h);margin-right:calc(-1*var(--gutter) + 8px);padding:0;border:0;background:transparent;color:var(--fjell);cursor:pointer}
  .bars{display:block;width:19px;height:15px;position:relative}.bars i{position:absolute;left:0;width:19px;height:2px;background:var(--fjell);transition:transform .25s var(--ease),opacity .2s}
  .bars i:nth-child(1){top:0}.bars i:nth-child(2){top:6.5px}.bars i:nth-child(3){top:13px}
  .is-open .bars i:nth-child(1){transform:translateY(6.5px) rotate(45deg)}.is-open .bars i:nth-child(2){opacity:0}.is-open .bars i:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
  .menu-label{font-family:var(--title-font-family);font-size:12px;line-height:1}
  .primary{display:none;position:fixed;top:var(--mainbar-h);left:0;right:0;bottom:0;background:#fff;overflow-y:auto;z-index:60}
  .is-open .primary{display:block}
  .primary .panel-top{display:block;background:var(--sand-70);padding:24px 16px}
  .panel-search{display:flex;align-items:center;gap:12px;height:48px;padding:0 16px;border-radius:var(--radius-sm);background:#fff;color:var(--svart);text-decoration:none;font-size:16px}
  .panel-search svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;margin-left:auto;order:2}
  .primary .audience-m{display:flex;overflow-x:auto;background:var(--sand-70);padding:0 16px;scrollbar-width:none}
  .primary .audience-m a{display:flex;align-items:center;height:40px;padding:0 20px;font-family:var(--title-font-family);font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--fjell);text-decoration:none;white-space:nowrap}
  .primary .audience-m a.is-active{background:#fff}
  .primary .market{display:block;padding:8px 0 8px 24px}.primary .market li{border-bottom:1px solid rgba(0,39,118,.1)}
  .primary .market a{display:flex;align-items:center;justify-content:space-between;height:45px;padding-right:20px;font-family:var(--title-font-family);font-size:15px;color:var(--svart)}
  .primary .market a::after{content:"";width:8px;height:8px;border-top:1.5px solid var(--fjell);border-right:1.5px solid var(--fjell);transform:rotate(45deg)}
  .primary .service{display:block;background:var(--sand-30);padding:8px 0 24px 24px;margin-top:8px}
  .primary .service a{display:flex;align-items:center;height:45px;font-family:var(--title-font-family);font-size:15px;color:var(--svart);text-decoration:none}
}
@media (max-width:1024px){
  .grid-3>*,.grid-4>*{grid-column:span 6}
  .router--band .router-body{grid-template-columns:1fr auto;gap:12px 24px;padding:20px 28px}.router--band .router-form{grid-column:1/-1}.router--band .router-art{display:none}
  .channels{grid-template-columns:repeat(3,minmax(0,1fr))}.footer-cols{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (max-width:767px){
  .h1,.display{line-height:1.05}.h2-l{line-height:1.12}.h2-m{line-height:1.14}
  .bento>.card,.bento>.campaign>.card{grid-column:1/-1}
  .btn-lg{width:100%}
  .router--band .router-body{grid-template-columns:1fr;padding:20px}.router--band .router-all{justify-self:start}.router--band .field-row{flex-wrap:wrap}.router--band .input{flex:1 1 140px}
  .router--tile .router-body{padding:40px 20px 140px}.router--tile .field-row .input{width:100%}.router--tile .router-art{opacity:.9}
  .channels{grid-template-columns:1fr}.channel summary{min-height:0;padding:20px}.contact-head .btn{width:100%}
  .site-footer{padding:48px 0 60px}.footer-grid{grid-template-columns:1fr;row-gap:40px}.footer-logo,.footer-cols,.footer-legal{grid-column:1;grid-row:auto}.footer-cols{grid-template-columns:1fr;gap:32px}
  .feedback-row{padding:24px 20px}
}
@media (max-width:640px){.btn-nav{min-height:40px}.field-row .btn{width:100%}}
`; }

export function rootTokens(){ return `:root {
  --heading-font-family: "SpareBank1-title-medium", arial, sans-serif;
  --title-font-family:   "SpareBank1-medium", arial, sans-serif;
  --body-font-family:    "SpareBank1-regular", arial, sans-serif;

  /* type scale (Ramp): 64 / 48 / 40 / 28 / 24 · 18 lead · 16 / 14 / 13 body · 10 eyebrow; one weight */
  --heading-xxl: 64px;  --heading-xl: 48px;  --heading-lg: 40px;  --heading-md: 28px;
  --title: 24px;  --lead: 18px;  --body: 16px;  --body-sm: 14px;  --label: 13px;
  --t-display: clamp(2.5rem, 1.94rem + 2.29vw, 4rem);
  --t-headline: clamp(2.125rem, 1.8rem + 1.34vw, 3rem);
  --t-headline-sm: clamp(1.75rem, 1.47rem + 1.15vw, 2.5rem);
  --t-title: clamp(1.375rem, 1.24rem + .58vw, 1.75rem);
  --line-height-heading: 1.05;  --line-height-body: 1.375;

  /* Hvit */ --color-bg: #ffffff;  /* Svart */ --color-fg: #020a0a;  /* Vann */ --color-accent: #005aa4;
  --fjell: #002776; --vann: #005aa4; --natt: #001032; --skog: #00754e; --skog-hover: #095139;
  --frost: #7eb5d2; --frost-70: #a5cbe0; --frost-30: #d8e9f2; --sand: #f8e9dd; --sand-70: #faf0e7; --sand-30: #fdf8f5;
  --syrin: #d3d3ea; --syrin-70: #e0e0f0; --syrin-30: #f2f2f9;
  --multe: #f8b181; --lyng: #873953; --baer: #e44244; --nordlys: #33af85; --sol: #dc8000;
  --svart: #020a0a; --hvit: #ffffff; --koksgraa: #323232; --moerkgraa: #676767; --graa: #adadad; --lysgraa: #d8d8d8;
  --card-tint: var(--sand-70);

  --spacing-xs: 4px;  --spacing-sm: 8px;  --spacing-md: 16px;  --spacing-lg: 24px;  --spacing-xl: 48px;  --spacing-2xl: 64px;  --spacing-3xl: 128px;
  --section-padding: 64px;  --max-width: 1440px;  --gutter: 64px;
  --card-gap: 6px;  --card-pad-y: 48px;  --card-pad-x: 36px;
  --radius: 2px;  --radius-sm: 6px;  --radius-img: 2px;  --radius-img-sm: 2px;  --radius-pill: 6px;
  --shadow-lift: none;
  --settings-h: 32px;  --mainbar-h: 80px;
  --dur: 300ms;  --ease: cubic-bezier(0.4, 0, 0.2, 1);  --spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
@media (max-width: 1320px) { :root { --gutter: 32px; } }
@media (max-width: 1140px) { :root { --mainbar-h: 68px; } }
@media (max-width: 1024px) { :root { --section-padding: 48px; --card-pad-x: 28px; --card-pad-y: 40px; } }
@media (max-width: 767px)  { :root { --section-padding: 48px; --gutter: 16px; --card-pad-x: 20px; --card-pad-y: 36px; --lead: 17px; --body: 15px; } }
`; }
