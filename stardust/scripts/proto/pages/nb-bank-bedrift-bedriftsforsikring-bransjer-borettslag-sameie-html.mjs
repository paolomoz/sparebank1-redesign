// Theme archetype (bedrift · borettslag og sameie) — composition per stardust/prototypes/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html-shape.md; content verbatim.
import { esc, asset, icons } from '../chrome.mjs';
import { renderSibling } from './nb-bank-privat-lan-boliglan-html.mjs';
export const ARCHETYPE='nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html';
/** Family renderer (theme): the archetype keeps its approved composition; siblings render through the shared Path A′ component walker. */
export function render(d){ return (!d.slug||d.slug===ARCHETYPE)?renderTheme(d):renderSibling(d,{family:'theme',archetype:ARCHETYPE}); }
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const imgSrc=i=>i?.getAttribute('data-lazy-src')||i?.getAttribute('src')||'';
const btnKind=(cls,skogOk=false)=>/--action/.test(cls)?(skogOk?'btn-action':'btn-primary'):/--secondary/.test(cls)?'btn-secondary':/inline-button|tertiary/.test(cls)?'btn-inline':'btn-primary';
const btn=(a,extra='',skogOk=false)=>`<a class="btn ${btnKind(a.getAttribute('class')||'',skogOk)}"${extra} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`;
// inline HTML of a captured paragraph: keep <a>/<b>/<i>/<u>, strip styles/spans/br
function inline(el){ const c=el.cloneNode(true); for(const x of c.querySelectorAll('[style]')) x.removeAttribute('style'); for(const s of [...c.querySelectorAll('span')]){ while(s.firstChild) s.parentNode.insertBefore(s.firstChild,s); s.remove(); } for(const b of c.querySelectorAll('br')) b.remove(); return c.innerHTML.replace(/\s+/g,' ').replace(/ ?<\/?(a|b|i|u)\b/g,m=>m).trim(); }

export function patchData(d){ if(!d.footer) return; const f=d.doc.querySelector('footer'); for(const col of d.footer.columns) for(const l of col.links){ if(l.icon) continue; const a=[...f.querySelectorAll('.footer-bottom__column-links li a')].find(x=>x.getAttribute('href')===l.href); const i=a?.querySelector('img'); if(i) l.icon=i.getAttribute('data-lazy-src')||i.getAttribute('src')||null; } }

function renderTheme({doc,pj}){
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
    const items=lis.map(li=>{ const a=li.querySelector('a'); const desc=norm(li.querySelector('.subtle-text')?.textContent); return `<li><a class="arrow" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>${desc?` <span class="li-desc">${esc(desc)}</span>`:''}</li>`; }).join('');
    return `<li class="card card--tint sheet"><div class="card-body"><img class="illu sheet-illu" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}" width="360" height="200" loading="eager"${si===0?' fetchpriority="high"':''} decoding="async"><h2 class="h2-m" data-slot="heading">${inline(h)}</h2><div class="prose" data-slot="text">${ps.map(p=>`<p>${inline(p)}</p>`).join('')}</div><ul class="link-list" data-slot="links">${items}</ul></div></li>`; }).join('');
  const recHtml=recCards.map(c=>{ const img=c.querySelector('img'); const a=c.querySelector('a.card__title'); const p=c.querySelector('p'); return `<li class="card card--tint news-card is-link"><img class="card-image" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}"${img.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1280" height="720" loading="lazy" decoding="async"><div class="card-body"><h3 class="card-title h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p>${esc(norm(p.textContent))}</p></div></li>`; }).join('');

  const mainHtml=`
<section class="movement intro" data-section="hero" data-intent="name the theme" data-layout="bento-cell" data-module="page-title">
  <div class="container"><div class="bento"><div class="card card--frost hero-card"><div class="card-body"><p class="backlink-row"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}<span>${esc(norm(back.textContent))}</span></a></p><h1 class="h2-l" data-slot="heading">${esc(norm(h1.textContent))}</h1><p class="lead" data-slot="text">${esc(norm(lead.textContent))}</p></div></div></div></div>
</section>
<section class="movement compare" data-section="compare" data-intent="with vs without shared building insurance" data-layout="grid" data-items="${sheets.length}" data-module="content-columns" data-media="image">
  <div class="container"><ul class="bento sheets" data-slot="columns">${sheetHtml}</ul><p class="compare-link"><a class="arrow" href="${esc(cmpLink.getAttribute('href'))}">${esc(norm(cmpLink.textContent))}</a></p></div>
</section>
<section class="movement tip" data-section="tip" data-intent="offer: adviser review" data-layout="bento-cell" data-module="callout">
  <div class="container"><div class="bento"><div class="card card--tint band-card tip-card is-link"><div class="card-body"><span class="band-icon" aria-hidden="true">${icons.bulb}</span><div class="band-text"><h2 class="h3" data-slot="heading">${esc(norm(tipH.textContent))}</h2><p data-slot="text">${esc(norm(tipP.textContent))}</p></div><p class="band-action">${btn(tipA,' data-slot="cta" data-cta="primary"',true).replace('class="btn ','class="btn cover-link ')}</p></div></div></div></div>
</section>
<section class="movement resident" data-section="resident" data-intent="advice for residents" data-layout="bento-cells" data-media="image" data-module="split-media">
  <div class="container"><div class="bento res-bento">
    <div class="card card--tint res-card"><div class="card-body"><h2 class="h2-m" data-slot="heading">${esc(norm(resH.textContent))}</h2><div class="prose" data-slot="text">${resPs.map(p=>`<p>${inline(p)}</p>`).join('')}</div><p class="cta-row">${resBtns.map((a,i)=>`<a class="btn btn-secondary"${i===0?' data-slot="cta"':''} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('')}</p></div></div>
    <figure class="card card--syrin res-art"><img class="res-illu" src="${asset(imgSrc(resImg))}" alt="${esc(resImg.getAttribute('alt')||'')}" width="400" height="400" loading="lazy" decoding="async"></figure>
  </div></div>
</section>
<section class="movement claim" data-section="claim" data-intent="report a claim" data-layout="bento-cell" data-module="cta-row">
  <div class="container"><div class="bento"><div class="card card--frost band-card claim-card is-link"><div class="card-body"><img class="illu band-icon claim-icon" src="${asset(imgSrc(claimImg))}" alt="" aria-hidden="true" width="56" height="56" loading="lazy" decoding="async"><p class="h3 band-text claim-text" data-slot="text">${esc(norm(claimP.textContent))}</p><p class="band-action">${btn(claimA,' data-slot="cta"').replace('class="btn ','class="btn cover-link ')}</p></div></div></div></div>
</section>
<section class="movement prevention" data-section="prevention" data-intent="advice: damage prevention" data-layout="bento-cells" data-media="image" data-module="split-media">
  <div class="container"><div class="bento prev-bento">
    <div class="card card--tint prev-card is-link"><div class="card-body"><h2 class="h2-m" data-slot="heading">${esc(norm(prevH.textContent))}</h2><div class="prose" data-slot="text">${prevPs.map(p=>`<p>${inline(p)}</p>`).join('')}</div><p class="actions">${btn(prevA,' data-slot="cta"').replace('class="btn ','class="btn cover-link ')}</p></div></div>
    <figure class="card prev-photo"><img src="${asset(imgSrc(prevImg))}" alt="${esc(prevImg.getAttribute('alt')||'')}"${prevImg.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1211" height="903" loading="lazy" decoding="async"></figure>
  </div></div>
</section>
<section class="movement recommended" data-section="recommended" data-intent="related products" data-layout="grid" data-items="${recCards.length}" data-module="card-rail" data-media="image">
  <div class="container"><h2 class="h2-l section-title" data-slot="heading">${esc(norm(recH.textContent))}</h2><ul class="bento rec-grid" data-slot="cards">${recHtml}</ul></div>
</section>
<section class="feedback" data-section="feedback" data-intent="page feedback (static)" data-layout="contained" data-module="feedback" data-dynamics="5">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(norm(fbH.textContent))}</h2><div class="feedback-btns"><button class="btn btn-secondary" type="button">${icons.thumbUp}<span class="visually-hidden">Ja</span></button><button class="btn btn-secondary" type="button">${icons.thumbDown}<span class="visually-hidden">Nei</span></button></div></div>
</section>`;

  const css=`
/* theme archetype — round 01 card language */
.intro{padding-top:24px}
.hero-card{grid-column:1/-1}.hero-card .card-body{padding:48px 48px 56px}
.hero-card .backlink-row{margin:0 0 20px}.hero-card h1{max-width:20ch}.hero-card .lead{margin-top:16px}
/* compare: two sheets, 6 + 6 */
.sheet{grid-column:span 6}.sheet .card-body{padding:40px 48px 48px}
.sheet-illu{width:min(100%,300px);height:auto;align-self:flex-start;margin-bottom:22px}
.sheet h2 u{text-decoration-thickness:3px;text-underline-offset:.12em;text-decoration-color:var(--vann)}
.sheet .prose{margin-top:16px}
.sheet .link-list{display:grid;gap:18px;align-content:start;margin-top:28px}
.sheet .link-list li{display:grid;gap:2px;margin:0;justify-items:start}.sheet .link-list .arrow{font-family:var(--title-font-family);font-size:var(--lead);line-height:1.33;min-height:40px;margin-block:-8px}.li-desc{color:var(--koksgraa)}
.compare-link{margin-top:24px}
/* band cards (tip, claim): icon · text · one action */
.band-card{grid-column:1/-1}
.band-card .card-body{flex-direction:row;align-items:center;gap:28px;padding:36px 48px}
.band-card .card-body>*+*{margin-top:0}
.band-icon{flex:none;width:48px;height:48px;display:grid;place-items:center}.band-icon svg{width:32px;height:32px;fill:none;stroke:var(--sol);stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.band-text{flex:1 1 auto;min-width:0;max-width:68ch}.band-text p{margin-top:8px}
.band-action{flex:none;margin-left:auto}
.claim-icon{width:56px;height:56px;object-fit:contain}.claim-text{color:var(--fjell)}
/* resident: text 7 + illustration 5 */
.res-bento{grid-template-rows:minmax(360px,auto)}
.res-card{grid-column:1/span 7}.res-card .card-body{justify-content:center;padding:56px 48px}.res-card .prose{margin-top:16px}.res-card .cta-row{margin-top:28px}
.res-art{grid-column:8/-1;margin:0;display:flex;align-items:center;justify-content:center;padding:32px}
.res-illu{width:min(100%,360px);height:auto;transition:transform .5s var(--spring)}
.res-bento:has(.res-card:hover) .res-illu,.res-bento:has(.res-card:focus-within) .res-illu{transform:translateY(-6px) rotate(-2deg)}
/* prevention: text 5 + photo 7 */
.prev-bento{grid-template-rows:minmax(420px,auto)}
.prev-card{grid-column:1/span 5}.prev-card .card-body{justify-content:center;padding:56px 48px}.prev-card .prose{margin-top:16px}.prev-card .actions{margin-top:28px}
.prev-photo{grid-column:6/-1;margin:0;background:var(--frost-30)}.prev-photo img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.prev-bento:has(.prev-card:hover) .prev-photo img,.prev-bento:has(.prev-card:focus-within) .prev-photo img{transform:scale(1.03)}
/* recommended 3-up */
.rec-grid .news-card{grid-column:span 4}.rec-grid .card-body{padding:32px 28px 40px}.rec-grid .card p{color:var(--koksgraa)}
.feedback-btns{display:flex;gap:8px}.feedback .btn{min-width:56px;padding-inline:14px}
@media (max-width:1024px){
  .hero-card .card-body{padding:40px 32px 44px}
  .sheet .card-body{padding:32px 28px 40px}
  .band-card .card-body{padding:28px 28px}
  .res-bento,.prev-bento{grid-template-rows:auto}
  .res-card{grid-column:1/-1}.res-art{grid-column:1/-1;min-height:260px;order:-1}.res-illu{width:min(60%,300px)}
  .prev-card{grid-column:1/-1}.prev-photo{grid-column:1/-1;aspect-ratio:16/9;order:-1}
  .res-card .card-body,.prev-card .card-body{padding:40px 32px}
  .rec-grid .news-card{grid-column:span 4}.rec-grid .card-body{padding:24px 20px 32px}
}
@media (max-width:767px){
  .hero-card .card-body,.res-card .card-body,.prev-card .card-body{padding:36px 20px}
  .sheet{grid-column:1/-1}.sheet .card-body{padding:32px 20px 36px}
  .rec-grid .news-card{grid-column:1/-1}
  .band-card .card-body{flex-direction:column;align-items:flex-start;gap:16px;padding:32px 20px}.band-action{margin-left:0;width:100%}.band-action .btn{width:100%;white-space:normal;text-align:center}
  .res-art{min-height:0;padding:24px}.res-illu{width:min(60%,240px)}
  .cta-row .btn,.actions .btn{flex:1 1 100%;white-space:normal;text-align:center}
}
`;
  return { template:'program', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html-shape.md', dominantDimension:'composition/two-sheet-comparison', conceptSeed:'surface bedee1c8 read (dealt 4,7,5; 4 built)', unsourcedContent:[], signatureElements:['flat spot illustrations as content on Sand-30 (descriptive alts kept)','one-corner-pair mask 48px on prevention + recommended photos'], improvementsApplied:['#2 calm header (bedrift variant)','#3 1.25 scale','#4 sheets and papers instead of shadowed cards','#6 photos at content scale','#7 movements on paper, 3 dividers dropped'] } };
}
