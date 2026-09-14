// Theme archetype (bedrift · borettslag og sameie) — composition per stardust/prototypes/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html-shape.md; content verbatim.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const imgSrc=i=>i?.getAttribute('data-lazy-src')||i?.getAttribute('src')||'';
const btnKind=(cls,skogOk=false)=>/--action/.test(cls)?(skogOk?'btn-action':'btn-primary'):/--secondary/.test(cls)?'btn-secondary':/inline-button|tertiary/.test(cls)?'btn-inline':'btn-primary';
const btn=(a,extra='',skogOk=false)=>`<a class="btn ${btnKind(a.getAttribute('class')||'',skogOk)}"${extra} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`;
// inline HTML of a captured paragraph: keep <a>/<b>/<i>/<u>, strip styles/spans/br
function inline(el){ const c=el.cloneNode(true); for(const x of c.querySelectorAll('[style]')) x.removeAttribute('style'); for(const s of [...c.querySelectorAll('span')]){ while(s.firstChild) s.parentNode.insertBefore(s.firstChild,s); s.remove(); } for(const b of c.querySelectorAll('br')) b.remove(); return c.innerHTML.replace(/\s+/g,' ').replace(/ ?<\/?(a|b|i|u)\b/g,m=>m).trim(); }

export function patchData(d){ if(!d.footer) return; const f=d.doc.querySelector('footer'); for(const col of d.footer.columns) for(const l of col.links){ if(l.icon) continue; const a=[...f.querySelectorAll('.footer-bottom__column-links li a')].find(x=>x.getAttribute('href')===l.href); const i=a?.querySelector('img'); if(i) l.icon=i.getAttribute('data-lazy-src')||i.getAttribute('src')||null; } }

export function render({doc,pj}){
  const main=doc.querySelector('main');
  const back=main.querySelector('.to-parent a'); const h1=main.querySelector('h1'); const lead=main.querySelector(':scope > .text .text-wrapper p');
  const cmpC=main.querySelector(':scope > .background-container'); const sheets=[...cmpC.querySelectorAll('.card')]; const cmpLink=cmpC.querySelector(':scope .background-container__content > .text a, .background-container__content > .text a');
  const tip=main.querySelector(':scope > .tip'); const tipH=tip.querySelector('h2'); const tipP=tip.querySelector('p'); const tipA=tip.querySelector('a');
  const refs=[...main.querySelectorAll(':scope > .referance')];
  const res=refs[0]; const resH=res.querySelector('h2'); const resPs=[...res.querySelectorAll('.text-wrapper p')]; const resBtns=[...res.querySelectorAll('a.ffe-button')]; const resImg=res.querySelector('img');
  const claimImg=main.querySelector(':scope > .image img'); const claimP=[...main.querySelectorAll(':scope > .text .text-wrapper p')].find(p=>norm(p.textContent)!==norm(lead.textContent)); const claimA=main.querySelector(':scope > .button a');
  const prev=refs[1]; const prevH=prev.querySelector('h2'); const prevPs=[...prev.querySelectorAll('.text-wrapper p')]; const prevA=prev.querySelector('a.ffe-button'); const prevImg=prev.querySelector('img');
  const rec=main.querySelector(':scope > .columns-grid'); const recH=rec.querySelector('h2'); const recCards=[...rec.querySelectorAll('.card')];
  const fbH=main.querySelector(':scope > .feedback h2');

  const sheetHtml=sheets.map((s,si)=>{ const img=s.querySelector('img'); const h=s.querySelector('h2'); const ps=[...s.querySelectorAll('.checked-list > p')]; const lis=[...s.querySelectorAll('.checked-list li')];
    const items=lis.map(li=>{ const a=li.querySelector('a'); const desc=norm(li.querySelector('.subtle-text')?.textContent); return `<li><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>${desc?` <span class="li-desc">${esc(desc)}</span>`:''}</li>`; }).join('');
    return `<article class="sheet"><img class="illu sheet-illu" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}" width="360" height="200" loading="eager"${si===0?' fetchpriority="high"':''} decoding="async"><h2 data-slot="heading">${inline(h)}</h2><div class="prose" data-slot="text">${ps.map(p=>`<p>${inline(p)}</p>`).join('')}</div><ul class="link-list" data-slot="links">${items}</ul></article>`; }).join('');
  const recHtml=recCards.map(c=>{ const img=c.querySelector('img'); const a=c.querySelector('a.card__title'); const p=c.querySelector('p'); return `<li class="card"><img class="photo photo-sm" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}"${img.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1280" height="853" loading="lazy" decoding="async"><h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p>${esc(norm(p.textContent))}</p></li>`; }).join('');

  const mainHtml=`
<section class="movement intro" data-section="hero" data-intent="name the theme" data-layout="contained" data-module="page-title">
  <div class="container intro-text"><p class="backlink-row"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}<span>${esc(norm(back.textContent))}</span></a></p><h1 data-slot="heading">${esc(norm(h1.textContent))}</h1><p class="lead" data-slot="text">${esc(norm(lead.textContent))}</p></div>
</section>
<section class="movement paper-sand compare" data-section="compare" data-intent="with vs without shared building insurance" data-layout="grid" data-items="${sheets.length}" data-module="content-columns" data-media="image">
  <div class="container"><div class="sheets" data-slot="columns">${sheetHtml}</div><p class="compare-link"><a class="btn-inline" href="${esc(cmpLink.getAttribute('href'))}"><span>${esc(norm(cmpLink.textContent))}</span>${icons.chevron}</a></p></div>
</section>
<section class="movement tip" data-section="tip" data-intent="offer: adviser review" data-layout="contained" data-module="callout">
  <div class="container"><div class="callout callout-frost" data-deviation="callout on Frost-30: Sand-30 callout would sit same-tint under the Sand-30 compare movement">${icons.bulb}<div class="callout-text"><h2 class="title-sm" data-slot="heading">${esc(norm(tipH.textContent))}</h2><p data-slot="text">${esc(norm(tipP.textContent))}</p><p>${btn(tipA,' data-slot="cta" data-cta="primary"',true)}</p></div></div></div>
</section>
<section class="movement resident" data-section="resident" data-intent="advice for residents" data-layout="split-media" data-media="image" data-module="split-media">
  <div class="container res-grid">
    <div class="res-text"><h2 data-slot="heading">${esc(norm(resH.textContent))}</h2><div class="prose" data-slot="text">${resPs.map(p=>`<p>${inline(p)}</p>`).join('')}</div><p class="cta-row">${resBtns.map((a,i)=>`<a class="btn btn-secondary"${i===0?' data-slot="cta"':''} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('')}</p></div>
    <figure class="res-media"><img class="illu res-illu" src="${asset(imgSrc(resImg))}" alt="${esc(resImg.getAttribute('alt')||'')}" width="400" height="400" loading="lazy" decoding="async"></figure>
  </div>
</section>
<section class="movement claim" data-section="claim" data-intent="report a claim" data-layout="contained" data-module="cta-row">
  <div class="container claim-row"><img class="illu claim-icon" src="${asset(imgSrc(claimImg))}" alt="" aria-hidden="true" width="56" height="56" loading="lazy" decoding="async"><p class="title-sm claim-text" data-slot="text">${esc(norm(claimP.textContent))}</p><p>${btn(claimA,' data-slot="cta"')}</p></div>
</section>
<section class="movement paper-frost prevention" data-section="prevention" data-intent="advice: damage prevention" data-layout="split-media" data-media="image" data-module="split-media">
  <div class="container prev-grid">
    <div class="prev-text"><h2 data-slot="heading">${esc(norm(prevH.textContent))}</h2><div class="prose" data-slot="text">${prevPs.map(p=>`<p>${inline(p)}</p>`).join('')}</div><p>${btn(prevA,' data-slot="cta"')}</p></div>
    <figure class="prev-media"><img class="photo photo-sm" src="${asset(imgSrc(prevImg))}" alt="${esc(prevImg.getAttribute('alt')||'')}"${prevImg.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1211" height="903" loading="lazy" decoding="async"></figure>
  </div>
</section>
<section class="movement recommended" data-section="recommended" data-intent="related products" data-layout="grid" data-items="${recCards.length}" data-module="card-rail" data-media="image">
  <div class="container"><h2 class="section-title" data-slot="heading">${esc(norm(recH.textContent))}</h2><ul class="rec-grid" data-slot="cards">${recHtml}</ul></div>
</section>
<section class="feedback" data-section="feedback" data-intent="page feedback (static)" data-layout="contained" data-module="feedback" data-dynamics="5">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(norm(fbH.textContent))}</h2><div class="feedback-btns"><button class="btn btn-secondary" type="button">${icons.thumbUp}<span class="visually-hidden">Ja</span></button><button class="btn btn-secondary" type="button">${icons.thumbDown}<span class="visually-hidden">Nei</span></button></div></div>
</section>`;

  const css=`
.intro{padding-top:var(--spacing-md)}.intro-text{display:grid;gap:var(--spacing-md)}.backlink-row{margin-bottom:var(--spacing-xs)}
.sheets{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto auto auto;gap:var(--spacing-2xl)}
.sheet{display:grid;grid-row:span 4;grid-template-rows:subgrid;row-gap:var(--spacing-md);align-content:start}
.sheet-illu{width:min(100%,360px);height:auto;margin-bottom:var(--spacing-sm)}
.sheet h2 u{text-decoration-thickness:3px;text-underline-offset:.12em;text-decoration-color:var(--vann)}
.link-list{display:grid;gap:var(--spacing-md);align-content:start;margin-top:var(--spacing-sm);padding-top:var(--spacing-md);border-top:1px solid var(--lysgraa)}
.link-list li{display:grid;gap:2px;margin:0!important}.link-list li a{display:inline-block;padding-block:6px;margin-block:-6px 0;font-family:var(--title-font-family);font-size:var(--lead);text-decoration:none}.link-list li a:hover{text-decoration:underline}.li-desc{color:var(--koksgraa)}
.compare-link{margin-top:var(--spacing-xl)}.compare-link .btn-inline{padding-inline:0}.compare-link svg{width:18px;height:18px;stroke-width:2}
.callout{align-items:flex-start}.callout-frost{background:var(--frost-30)}.callout-text{display:grid;gap:var(--spacing-sm)}.callout-text .btn{margin-top:var(--spacing-xs)}
.res-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}
.res-text{display:grid;gap:var(--spacing-md)}.res-media{margin:0;display:flex;justify-content:center}.res-illu{width:min(100%,400px);height:auto}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm) var(--spacing-md);margin-top:var(--spacing-xs)}
.resident{padding-top:0}.claim{padding-top:0;padding-bottom:var(--section-padding)}.claim-row{display:grid;grid-template-columns:auto 1fr auto;gap:var(--spacing-lg);align-items:center;padding-block:var(--spacing-lg);border-top:1px solid var(--lysgraa);border-bottom:1px solid var(--lysgraa)}
.claim-icon{width:56px;height:56px}.claim-text{color:var(--fjell)}
.prev-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl);align-items:center}
.prev-text{display:grid;gap:var(--spacing-md)}.prev-media{margin:0}
.section-title{margin-bottom:var(--spacing-lg)}
.rec-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-lg)}
.card-title{font-family:var(--title-font-family);font-size:var(--title)}.card p{color:var(--koksgraa)}.rec-grid .photo{margin-bottom:4px}
.feedback-btns{display:flex;gap:8px}.feedback .btn{min-width:56px;padding-inline:14px}
@media (max-width:1023px){
  .sheets{gap:var(--spacing-xl)}
  .res-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.res-media{justify-content:flex-start}.res-illu{width:min(100%,300px)}
  .prev-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.prev-media{max-width:36rem}
}
@media (max-width:1023px){.rec-grid{grid-template-columns:1fr}.rec-grid .card{grid-template-columns:40% 1fr;grid-template-rows:auto 1fr;grid-template-areas:"img title" "img text";gap:4px var(--spacing-lg);align-items:start}.rec-grid .photo{grid-area:img;margin:0}.rec-grid .card-title{grid-area:title}.rec-grid .card p{grid-area:text}}
@media (max-width:767px){.sheets{grid-template-columns:1fr}.sheet{grid-row:auto;grid-template-rows:none}}
@media (max-width:640px){.rec-grid .card{grid-template-columns:1fr;grid-template-rows:auto;grid-template-areas:"img" "title" "text"}.rec-grid .photo{margin-bottom:4px}}
@media (max-width:640px){
  .claim-row{grid-template-columns:56px 1fr;grid-template-areas:"icon text" "btn btn";gap:var(--spacing-md)}.claim-icon{grid-area:icon}.claim-text{grid-area:text}.claim-row>p:last-child{grid-area:btn}
  .cta-row .btn{flex:1 1 100%}
}
`;
  return { template:'program', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html-shape.md', dominantDimension:'composition/two-sheet-comparison', conceptSeed:'surface bedee1c8 read (dealt 4,7,5; 4 built)', unsourcedContent:[], signatureElements:['flat spot illustrations as content on Sand-30 (descriptive alts kept)','one-corner-pair mask 48px on prevention + recommended photos'], improvementsApplied:['#2 calm header (bedrift variant)','#3 1.25 scale','#4 sheets and papers instead of shadowed cards','#6 photos at content scale','#7 movements on paper, 3 dividers dropped'] } };
}
