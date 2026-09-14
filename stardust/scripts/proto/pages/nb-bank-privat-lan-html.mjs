// Category hub (Låne) — composition per stardust/prototypes/nb-bank-privat-lan-html-shape.md; content verbatim from the captured DOM.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const imgSrc=i=>i?.getAttribute('data-lazy-src')||i?.getAttribute('src')||'';
const btnKind=cls=>/--action/.test(cls)?'btn-action':/--secondary/.test(cls)?'btn-secondary':/inline-button|tertiary/.test(cls)?'btn-inline':'btn-primary';
const btn=(a,extra='')=>`<a class="btn ${btnKind(a.getAttribute('class')||'')}"${extra} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`;

// Canon gap (canon-requests.md #1): footer social icons carry data-lazy-src only on some captures.
export function patchData(d){ if(!d.footer) return; const f=d.doc.querySelector('footer'); for(const col of d.footer.columns) for(const l of col.links){ if(l.icon) continue; const a=[...f.querySelectorAll('.footer-bottom__column-links li a')].find(x=>x.getAttribute('href')===l.href); const i=a?.querySelector('img'); if(i) l.icon=i.getAttribute('data-lazy-src')||i.getAttribute('src')||null; } }

export function render({doc,pj}){
  const main=doc.querySelector('main');
  const h1=main.querySelector('h1'); const lead=main.querySelector('.aem-main-container .text-wrapper p');
  const navs=[...main.querySelectorAll(':scope > .visual-nav .component-root')];
  const doors=navs.filter(n=>n.getAttribute('data-type')==='medium').map(n=>{ const bg=n.querySelector('.nav--med__background')?.getAttribute('style')||''; const url=(bg.match(/url\(["']?([^"')]+)/)||[])[1]||n.getAttribute('data-image-src'); const a=n.querySelector('a'); return {href:a.getAttribute('href'),title:norm(n.querySelector('h3').textContent),text:norm(n.querySelector('p').textContent),img:url,alt:n.getAttribute('data-image-alt')||''}; });
  const smalls=navs.filter(n=>n.getAttribute('data-type')==='small').map(n=>{ const a=n.querySelector('a'); const i=n.querySelector('.nav--small__card__content__icon img'); return {href:a.getAttribute('href'),title:norm(n.querySelector('h3').textContent),text:norm(n.querySelector('p').textContent),img:imgSrc(i),alt:i?.getAttribute('alt')||''}; });
  const sc=main.querySelector(':scope > .shortcuts'); const scH=sc.querySelector('h2'); const scLinks=[...sc.querySelectorAll('.shortcuts-list__item a')];
  const cb=main.querySelector(':scope > .cobranding'); const cbQ=cb.querySelector('.cobranding__header .ffe-h4'); const cbBtn=cb.querySelector('.cobranding__header button'); const cbLogo=cb.querySelector('.cobranding__image-top img'); const cbH=cb.querySelector('.cobranding__heading h2'); const cbPs=[...cb.querySelectorAll('.cobranding__column .text-wrapper p')]; const cbAs=[...cb.querySelectorAll('.cobranding__column a')]; const cbIllu=cb.querySelector('.cobranding__column2 img'); const cbP2=cb.querySelector('.cobranding__column2 .text-wrapper p');
  const cols=[...main.querySelector(':scope > .columns-grid').querySelectorAll('.columns-grid__column')].map(c=>({img:c.querySelector('img'),h:c.querySelector('h2'),p:c.querySelector('.text-wrapper p'),a:c.querySelector('a.ffe-button')}));
  const bn=main.querySelector(':scope > .banner-small'); const bnImg=bn.querySelector('img'); const bnH=bn.querySelector('h2'); const bnP=bn.querySelector('.banner-small__infotext'); const bnA=bn.querySelector('a');
  const rp=main.querySelector(':scope > .background-container .related-products'); const rpH=rp.querySelector('h2'); const rpCards=[...rp.querySelectorAll('.card')];
  const tip=main.querySelector(':scope > .tip'); const tipH=tip.querySelector('h3'); const tipP=tip.querySelector('p'); const tipA=tip.querySelector('a');
  const fbH=main.querySelector(':scope > .feedback h2');
  const cmp=main.querySelector(':scope > .referance, :scope > .reference'); const cmpH=cmp.querySelector('h2'); const cmpP=cmp.querySelector('p');
  const cmpHtml=cmpP.innerHTML.replace(/<a\s([^>]*)>/g,'<a $1 class="link-more" rel="noopener">').replace(/<\/a>/g,`${icons.external}</a>`).replace(/\s+/g,' ').trim();

  const doorHtml=doors.map((d,i)=>`<li class="door"><img class="photo photo-sm" src="${asset(d.img)}" alt="${esc(d.alt)}" width="768" height="512" loading="${i<2?'eager':'lazy'}"${i===0?' fetchpriority="high"':''} decoding="async"><h2 class="card-title title-sm"><a href="${esc(d.href)}">${esc(d.title)}</a></h2><p>${esc(d.text)}</p></li>`).join('');
  const smallHtml=smalls.map(d=>`<li class="tile small-door"><img class="illu tile-icon" src="${asset(d.img)}" alt="${esc(d.alt)}" width="40" height="40" loading="lazy" decoding="async"><h2 class="card-title title-sm"><a href="${esc(d.href)}">${esc(d.title)}</a></h2><p>${esc(d.text)}</p></li>`).join('');
  const shortcuts=scLinks.map(a=>`<li><a class="btn-inline shortcut" href="${esc(a.getAttribute('href'))}"><span>${esc(norm(a.textContent))}</span>${icons.chevron}</a></li>`).join('');
  const seen=new Set(); const cbBtns=cbAs.filter(a=>{const k=a.getAttribute('href')+norm(a.textContent); if(seen.has(k)) return false; seen.add(k); return true;}).map(a=>btn(a)).join('');
  const help=cols.map(c=>`<article class="help-col"><img class="photo photo-sm" src="${asset(imgSrc(c.img))}" alt="${esc(c.img.getAttribute('alt')||'')}" width="1200" height="800" loading="lazy" decoding="async"><h2 data-slot="heading">${esc(norm(c.h.textContent))}</h2><p data-slot="text">${esc(norm(c.p.textContent))}</p><p>${btn(c.a,' data-slot="cta"')}</p></article>`).join('');
  const popular=rpCards.map(c=>{const i=c.querySelector('img'); const a=c.querySelector('a.card__title'); return `<li class="tile pop-tile"><img class="illu tile-icon" src="${asset(imgSrc(i))}" alt="" aria-hidden="true" width="48" height="48" loading="lazy" decoding="async"><h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3></li>`;}).join('');

  const mainHtml=`
<section class="movement intro" data-section="hero" data-intent="name the category" data-layout="contained" data-module="page-title">
  <div class="container intro-text"><h1 data-slot="heading">${esc(norm(h1.textContent))}</h1><p class="lead" data-slot="text">${esc(norm(lead.textContent))}</p></div>
</section>
<section class="movement doors" data-section="doors" data-intent="route to loan products" data-layout="grid" data-items="${doors.length+smalls.length}" data-module="visual-nav" data-media="image">
  <div class="container">
    <ul class="door-grid" data-slot="cards">${doorHtml}</ul>
    <ul class="small-grid" data-slot="cards-small">${smallHtml}</ul>
  </div>
</section>
<section class="movement shortcuts" data-section="shortcuts" data-intent="self-service shortcuts" data-layout="contained" data-items="${scLinks.length}" data-module="shortcut-row">
  <div class="container shortcut-row"><h2 class="title-sm" data-slot="heading">${esc(norm(scH.textContent))}</h2><ul class="shortcut-list" data-slot="links">${shortcuts}</ul></div>
</section>
<section class="movement paper-sand membership" data-section="membership" data-intent="LO membership benefits" data-layout="contained" data-module="cobranding">
  <div class="container">
    <details class="cobrand">
      <summary><span class="title-sm cobrand-q" data-slot="heading">${esc(norm(cbQ.textContent))}</span><span class="btn-inline cobrand-toggle">${esc(norm(cbBtn.textContent))}${icons.down}</span></summary>
      <div class="cobrand-panel">
        <div class="cobrand-main">
          <img class="cobrand-logo" src="${asset(imgSrc(cbLogo))}" alt="${esc(cbLogo.getAttribute('alt')||'')}" width="120" height="60" loading="lazy" decoding="async">
          <h2 class="cobrand-name" data-slot="heading">${esc(norm(cbH.textContent))}</h2>
          <div class="prose" data-slot="text">${cbPs.map(p=>`<p>${esc(norm(p.textContent))}</p>`).join('')}</div>
          <p class="cta-row">${cbBtns}</p>
        </div>
        <aside class="cobrand-side">
          <img class="illu cobrand-illu" src="${asset(imgSrc(cbIllu))}" alt="" aria-hidden="true" width="160" height="200" loading="lazy" decoding="async">
          <p>${esc(norm(cbP2.textContent))}</p>
        </aside>
      </div>
    </details>
  </div>
</section>
<section class="movement help" data-section="help" data-intent="adviser contact; calculator" data-layout="grid" data-items="${cols.length}" data-module="split-media" data-media="image">
  <div class="container help-grid">${help}</div>
</section>
<section class="movement switch" data-section="switch" data-intent="invite: switch bank" data-layout="contained" data-module="promo-band">
  <div class="container"><article class="promo"><img class="promo-illu" src="${asset(imgSrc(bnImg))}" alt="" aria-hidden="true" width="140" height="200" loading="lazy" decoding="async"><div class="promo-text"><h2 class="title-sm" data-slot="heading">${esc(norm(bnH.textContent))}</h2><p data-slot="text">${esc(norm(bnP.textContent))}</p><p>${btn(bnA,' data-slot="cta"')}</p></div></article></div>
</section>
<section class="movement paper-sand popular" data-section="popular" data-intent="popular loan products" data-layout="grid" data-items="${rpCards.length}" data-module="related-products">
  <div class="container"><h2 class="section-title" data-slot="heading">${esc(norm(rpH.textContent))}</h2><ul class="pop-grid" data-slot="cards">${popular}</ul></div>
</section>
<section class="movement tip" data-section="tip" data-intent="Altinn consent notice" data-layout="contained" data-module="callout">
  <div class="container"><div class="callout">${icons.bulb}<div class="callout-text"><h2 class="title-sm" data-slot="heading">${esc(norm(tipH.textContent))}</h2><p data-slot="text">${esc(norm(tipP.textContent))}</p><p>${btn(tipA,' data-slot="cta" data-cta="primary"')}</p></div></div></div>
</section>
<section class="feedback" data-section="feedback" data-intent="page feedback (static)" data-layout="contained" data-module="feedback" data-dynamics="5">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(norm(fbH.textContent))}</h2><div class="feedback-btns"><button class="btn btn-secondary" type="button">${icons.thumbUp}<span class="visually-hidden">Ja</span></button><button class="btn btn-secondary" type="button">${icons.thumbDown}<span class="visually-hidden">Nei</span></button></div></div>
</section>
<section class="movement compare" data-section="compare" data-intent="regulatory: compare prices" data-layout="contained" data-module="cta-band">
  <div class="container"><div class="cta-band"><h2 class="title-sm" data-slot="heading">${esc(norm(cmpH.textContent))}</h2><p data-slot="text">${cmpHtml}</p></div></div>
</section>`;

  const css=`
.intro{padding-bottom:var(--spacing-lg)}.intro-text{display:grid;gap:var(--spacing-md)}
.doors{padding-top:var(--spacing-md)}
.door-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-lg)}
.door{position:relative;display:grid;gap:4px;align-content:start}.door .photo{margin-bottom:8px}.door .card-title a{color:var(--fjell);text-decoration:none}.door .card-title a::after{content:"";position:absolute;inset:0}.door:hover .card-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.15em}.door p{color:var(--koksgraa)}
.card-title{font-family:var(--title-font-family);font-size:var(--title)}.card p,.tile p{color:var(--koksgraa)}
.small-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg);margin-top:var(--spacing-xl)}
.tile{position:relative;display:grid;gap:8px;align-content:start;padding-top:var(--spacing-md);border-top:1px solid var(--lysgraa)}
.tile-icon{width:40px;height:40px}
.tile .card-title a{color:var(--fjell);text-decoration:none}.tile .card-title a::after{content:"";position:absolute;inset:0}.tile:hover .card-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.15em}
.shortcuts{padding-top:var(--spacing-xl);padding-bottom:var(--spacing-xl)}
.shortcut-row{display:grid;gap:var(--spacing-xs);padding-top:var(--spacing-lg);border-top:1px solid var(--lysgraa)}
.shortcut-list{display:flex;flex-wrap:wrap;gap:0 var(--spacing-lg)}
.shortcut{padding-inline:0}.shortcut svg{width:18px;height:18px;stroke-width:2}
.cobrand summary{list-style:none;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--spacing-sm) var(--spacing-lg);cursor:pointer;min-height:44px}.cobrand summary::-webkit-details-marker{display:none}
.cobrand-q{color:var(--fjell)}.cobrand-toggle{pointer-events:none}.cobrand[open] .cobrand-toggle svg{transform:rotate(180deg)}
.cobrand-panel{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:start;margin-top:var(--spacing-xl);padding-top:var(--spacing-xl);border-top:1px solid var(--lysgraa)}
.cobrand-main{display:grid;gap:var(--spacing-md)}.cobrand-name{font-size:var(--t-title);line-height:1.2}.cobrand-logo{width:120px;height:auto}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm) var(--spacing-md);margin-top:var(--spacing-xs)}
.cobrand-side{display:grid;gap:var(--spacing-md);justify-items:start;align-self:start;max-width:28rem}
.cobrand-illu{width:140px;height:auto}
.help-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl)}
.help-col{display:grid;gap:var(--spacing-md);align-content:start}.help-col .photo{margin-bottom:var(--spacing-sm)}.help-col p{max-width:44rem}
.switch{padding-top:0}
.promo{display:grid;grid-template-columns:auto 1fr;gap:var(--spacing-xl);align-items:center;padding-top:var(--spacing-xl);border-top:1px solid var(--lysgraa)}
.promo-illu{width:140px;height:auto}.promo-text{display:grid;gap:var(--spacing-sm);max-width:44rem}.promo-text .btn{margin-top:var(--spacing-xs)}
.section-title{margin-bottom:var(--spacing-lg)}
.pop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg)}
.pop-tile{grid-template-columns:48px 1fr;align-items:start;gap:var(--spacing-md)}.pop-tile .card-title{text-wrap:balance}.pop-tile .tile-icon{width:48px;height:48px}
.callout{align-items:flex-start}.callout-text{display:grid;gap:var(--spacing-sm)}.callout-text .btn{margin-top:var(--spacing-xs)}
.feedback-btns{display:flex;gap:8px}.feedback .btn{min-width:56px;padding-inline:14px}
.compare{padding-top:0}
.link-more svg{width:16px;height:16px;margin-left:2px;vertical-align:-2px;display:inline-block}
@media (max-width:1023px){
  .small-grid{grid-template-columns:1fr 1fr}
  .cobrand-panel{grid-template-columns:1fr}
  .help-grid{grid-template-columns:1fr}.help-col .photo{max-width:36rem}
  .pop-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:640px){
  .door-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}
  .small-grid{grid-template-columns:1fr;gap:var(--spacing-md);margin-top:var(--spacing-lg)}
  .small-door{grid-template-columns:40px 1fr;grid-template-areas:"icon title" "icon text";gap:2px var(--spacing-md);align-items:center}.small-door .tile-icon{grid-area:icon}.small-door .card-title{grid-area:title}.small-door p{grid-area:text}
  .shortcut-list{display:grid;gap:0}.shortcut{width:100%;justify-content:space-between}
  .promo{grid-template-columns:1fr;gap:var(--spacing-md)}.promo-illu{width:110px}
  .pop-grid{grid-template-columns:1fr;gap:var(--spacing-sm)}.pop-tile{padding-top:var(--spacing-sm)}
  .callout{flex-direction:column}
}
`;
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-lan-html-shape.md', dominantDimension:'composition/catalogue-of-doors', conceptSeed:'surface 0b575c01 (dealt 4,7,5; 4 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','one-corner-pair photo mask 48px on door and help photos','material icons + spot illustrations flat on paper'], improvementsApplied:['#1 compact router','#2 calm two-tier header','#3 1.25 scale','#4 one card language (doors as tinted papers, tiles without chrome)','#6 door photos as <img> at card scale instead of CSS background thumbs','#7 movements on paper, 2 dividers dropped'] } };
}
