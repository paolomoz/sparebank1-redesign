// Product archetype (Boliglån) — composition per stardust/prototypes/nb-bank-privat-lan-boliglan-html-shape.md; content verbatim from the captured DOM.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const imgSrc=i=>i?.getAttribute('data-lazy-src')||i?.getAttribute('src')||'';
const btnKind=cls=>/--action/.test(cls)?'btn-action':/--secondary/.test(cls)?'btn-secondary':/inline-button|tertiary/.test(cls)?'btn-inline':'btn-primary';

// Clean a captured FAQ answer body: unwrap AEM wrappers, strip inline styles, demote nested headings, map buttons, drop dynamic UI.
function faqBody(body,doc){
  const c=body.cloneNode(true);
  for(const x of c.querySelectorAll('.faq__feedback-box,.hr,.bank-choice-overlay,link,svg,script,source')) x.remove();
  for(const a of c.querySelectorAll('a.ffe-button')){ const cls=a.getAttribute('class')||''; const vis=/hide-phone/.test(cls)?' only-desktop':/hide-desktop/.test(cls)?' only-phone':''; const label=norm(a.textContent); const href=a.getAttribute('href'); for(const at of [...a.attributes]) a.removeAttribute(at.name); a.setAttribute('class',`btn ${btnKind(cls)}${vis}`); a.setAttribute('href',href); a.textContent=label; }
  for(const h of c.querySelectorAll('h2,h3,h4,h5,h6')){ const n=doc.createElement('h4'); n.textContent=norm(h.textContent); h.replaceWith(n); }
  for(const s of c.querySelectorAll('span.h5,span.h4')){ const b=doc.createElement('b'); b.textContent=norm(s.textContent); s.replaceWith(b); }
  for(const s of c.querySelectorAll('span.subtle-text,span.h6,span.lead-blue')){ while(s.firstChild) s.parentNode.insertBefore(s.firstChild,s); s.remove(); }
  for(const p of c.querySelectorAll('picture')){ while(p.firstChild) p.parentNode.insertBefore(p.firstChild,p); p.remove(); }
  for(const i of c.querySelectorAll('img')){ const src=imgSrc(i); for(const at of [...i.attributes]) i.removeAttribute(at.name); i.setAttribute('class','illu-wide'); i.setAttribute('src',asset(src)); i.setAttribute('alt',''); i.setAttribute('aria-hidden','true'); i.setAttribute('loading','lazy'); i.setAttribute('decoding','async'); }
  for(const r of c.querySelectorAll('.columns-grid__row')) r.setAttribute('data-keep','faq-cols');
  for(const col of c.querySelectorAll('.columns-grid__column')) col.setAttribute('data-keep','faq-col');
  let changed=true; while(changed){ changed=false; for(const d of [...c.querySelectorAll('div')]){ if(d.getAttribute('data-keep')) continue; while(d.firstChild) d.parentNode.insertBefore(d.firstChild,d); d.remove(); changed=true; } }
  for(const d of c.querySelectorAll('[data-keep]')){ const k=d.getAttribute('data-keep'); for(const at of [...d.attributes]) d.removeAttribute(at.name); d.setAttribute('class',k); }
  for(const el of c.querySelectorAll('[style],[onclick],[rel],[id]')){ el.removeAttribute('style'); el.removeAttribute('onclick'); el.removeAttribute('rel'); el.removeAttribute('id'); }
  for(const p of [...c.querySelectorAll('p')]){ if(!norm(p.textContent)&&!p.querySelector('img,a')) p.remove(); }
  // consecutive buttons → one row
  const btns=[...c.querySelectorAll(':scope > a.btn')]; if(btns.length){ const row=doc.createElement('p'); row.setAttribute('class','btn-row'); btns[0].parentNode.insertBefore(row,btns[0]); for(const b of btns) row.appendChild(b); }
  return c.innerHTML.replace(/\s+/g,' ').replace(/> </g,'><').trim();
}


// Canon gap (see stardust/prototypes/canon-requests.md #1): footerData() reads img[src] only; on this capture the footer social icons carry data-lazy-src only.
export function patchData(d){ if(!d.footer) return; const f=d.doc.querySelector('footer'); for(const col of d.footer.columns) for(const l of col.links){ if(l.icon) continue; const a=[...f.querySelectorAll('.footer-bottom__column-links li a')].find(x=>x.getAttribute('href')===l.href); const i=a?.querySelector('img'); if(i) l.icon=i.getAttribute('data-lazy-src')||i.getAttribute('src')||null; } }

const CSS=`
/* product archetype — round 01 card language */
.hero{padding-top:24px}
.hero-bento{grid-template-rows:minmax(440px,auto)}
.hero-card{grid-column:1/span 5}.hero-card .card-body{justify-content:center;padding:56px 48px}
.hero-card .backlink-row{margin:0 0 20px}.hero-card h1{font-size:var(--t-headline);line-height:1.04}.hero-card .lead{margin-top:20px}.hero-card .cta-row{margin-top:28px}
.hero-photo{grid-column:6/-1;margin:0;background:var(--frost-30)}.hero-photo img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.hero-bento:has(.hero-card:hover) .hero-photo img{transform:scale(1.03)}
.choice-grid .card-body{padding:28px 28px 32px}.choice p{color:var(--koksgraa)}
.promo-row{margin-top:var(--card-gap)}
.promo-art{grid-column:span 3;align-items:center;justify-content:center;padding:24px;transition:background-color .35s var(--ease)}
.promo-art img{max-height:180px;width:auto;max-width:100%;transition:transform .5s var(--spring)}
.promo-art:has(+.promo:hover) img{transform:scale(1.06) rotate(-2deg)}.promo-art:has(+.promo:hover){background:var(--frost-70)}
.promo{grid-column:span 9;min-height:240px}.promo .card-body{justify-content:center;padding-inline:48px}.promo p{max-width:60ch}
.q-photo{grid-column:1/span 5;margin:0;min-height:380px;background:var(--frost-30)}.q-photo img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.q-card{grid-column:6/-1}.q-card .card-body{justify-content:center;padding:56px 48px}.q-card .lead{margin-top:16px}.q-card .actions{margin-top:28px}
.q-bento:has(.q-card:hover) .q-photo img{transform:scale(1.03)}
.price-grid{grid-template-columns:repeat(5,minmax(0,1fr))}.price-card{grid-column:auto}.price-card .card-body{padding:28px 24px 32px}.price-card .card-title,.price-card h3{font-size:18px;line-height:1.2}.price-card p{color:var(--koksgraa);font-size:var(--body-sm);margin-top:8px}
.price-foot{display:grid;gap:var(--spacing-md);justify-items:start;margin-top:var(--spacing-lg)}.price-example{max-width:68ch}
.calc-card{grid-column:1/-1}.calc-card .card-body{padding:56px 48px;align-items:center}
.calc-card .section-title{margin-bottom:24px}
/* calculator — static shell (dynamics #7 interim): controls disabled, captured strings */
.calc{display:grid;gap:var(--spacing-lg);width:min(100%,44rem);justify-items:start;text-align:left}
.calc-tabs{display:inline-flex;padding:4px;background:#fff;border-radius:var(--radius-sm)}
.calc-tab{min-height:40px;padding:8px 20px;border:0;border-radius:var(--radius-sm);background:transparent;color:var(--moerkgraa);font:var(--body)/1.2 var(--title-font-family);cursor:not-allowed}.calc-tab.is-on{background:var(--frost-30);color:var(--fjell)}
.calc-groups{display:flex;flex-wrap:wrap;gap:var(--spacing-md) var(--spacing-xl)}
.calc-pills{margin:0;padding:0;border:0;display:grid;gap:8px;justify-items:start}.calc-pills legend{padding:0;margin-bottom:8px;color:var(--fjell)}
.pill-row{display:flex;flex-wrap:wrap;gap:6px}
.pill{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:var(--radius-sm);background:#fff;color:var(--moerkgraa);font-family:var(--title-font-family);cursor:not-allowed}
.pill input{position:absolute;opacity:0;width:1px;height:1px;margin:0}.pill.is-on{background:var(--fjell);color:#fff}
.calc-fields{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md);width:min(100%,32rem)}
.field{display:grid;gap:6px;text-align:left}.field .label{color:var(--fjell)}
.calc .input{text-align:right;color:var(--koksgraa)}
.calc .input:disabled{background:#fff;color:var(--koksgraa);-webkit-text-fill-color:var(--koksgraa);opacity:1;cursor:not-allowed}
.calc-result{display:grid;gap:4px;padding-top:var(--spacing-sm)}
.calc-result-label{color:var(--koksgraa)}.calc-result-value{font-family:var(--heading-font-family);font-size:var(--t-display);line-height:1;color:var(--fjell)}
.calc-ctas{display:flex;flex-wrap:wrap;gap:var(--spacing-sm) var(--spacing-md)}
.calc-note{max-width:60ch;color:var(--koksgraa)}.calc-note+.calc-note{margin-top:0}
/* faq */
.faq-wrap .faq{max-width:52rem;margin-inline:auto}
.faq-q{flex:1 1 auto;font:inherit;color:inherit;letter-spacing:inherit}
.faq .answer :is(h4){font-family:var(--title-font-family);font-size:var(--lead);color:var(--fjell);margin-top:var(--spacing-md)}
.faq .answer ul{list-style:disc;padding-left:1.25rem}.faq .answer ul{margin-top:var(--spacing-md)}
.faq .answer .btn-row{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);margin-top:var(--spacing-md)}
.faq .answer .faq-cols{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-lg);margin-top:var(--spacing-md)}.faq .answer .faq-col{display:grid;gap:8px;align-content:start}
.faq .answer .faq-col h4{margin-top:0}.faq .answer .faq-col p{margin-top:0;color:var(--koksgraa);font-size:var(--body-sm)}
.illu-wide{width:100%;height:auto;max-width:360px}
.only-phone{display:none}
.faq-more{border:0!important}.faq-more>summary{list-style:none;justify-content:flex-start;padding:16px 0 0;font:var(--body)/1.2 var(--body-font-family);color:var(--vann)}.faq-more>summary::-webkit-details-marker{display:none}
.faq-more>summary svg{stroke:currentColor}.faq-more[open]>summary svg{transform:rotate(180deg)}
.faq-more-items{margin-top:var(--spacing-md)}.faq-more-items details:first-of-type{border-top:1px solid rgba(0,39,118,.12)}
.faq > details.faq-more{border-bottom:0!important}
/* tips */
.tips-grid .card-body{padding:28px 28px 36px}.tips-grid .meta{margin-top:10px}
.feedback-btns{display:flex;gap:8px}.feedback .btn{min-width:56px;padding-inline:14px}
.compare-card{grid-column:1/span 6}.compare-card p{margin-top:12px;max-width:52ch}
@media (max-width:1024px){
  .hero-bento{grid-template-rows:auto}.hero-card{grid-column:1/-1}.hero-photo{grid-column:1/-1;aspect-ratio:16/9;order:-1}
  .promo-art{grid-column:span 4}.promo{grid-column:span 8}
  .q-photo{grid-column:1/-1;min-height:0;aspect-ratio:16/9}.q-card{grid-column:1/-1}
  .price-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .compare-card{grid-column:1/-1}
}
@media (max-width:767px){.only-phone{display:inline-flex}.only-desktop{display:none}
  .hero-card .card-body,.q-card .card-body,.calc-card .card-body{padding:36px 20px}.promo .card-body{padding-inline:20px}.promo,.promo-art{grid-column:1/-1}.promo{min-height:0}.promo-art img{max-height:140px;max-width:60%}
  .price-grid{grid-template-columns:1fr}
  .calc{justify-items:stretch}.calc-tabs{display:grid;grid-template-columns:1fr 1fr}.calc-fields{grid-template-columns:1fr}.calc-ctas .btn{flex:1 1 100%}
  .faq .answer .faq-cols{grid-template-columns:1fr}
}
`;

export const ARCHETYPE='nb-bank-privat-lan-boliglan-html';
/** Family renderer: the archetype keeps its approved composition; every sibling renders through the component walker (renderSibling). */
export function render(d){ return (!d.slug||d.slug===ARCHETYPE)?renderArchetype(d):renderSibling(d,{family:'product'}); }

function renderArchetype({doc,pj}){
  const main=doc.querySelector('main');
  const back=main.querySelector('.to-parent a');
  const heroC=main.querySelector(':scope > .background-container');
  const h1=heroC.querySelector('h1'); const lead=heroC.querySelector('.text-wrapper p'); const heroBtns=[...heroC.querySelectorAll('.button-list-container a')]; const heroImg=heroC.querySelector('img');
  const choicesC=main.querySelectorAll(':scope > .background-container')[1];
  const choicesH=choicesC.querySelector('h2'); const choiceCards=[...choicesC.querySelectorAll('.card')];
  const banner=choicesC.querySelector('.banner-small'); const bImg=banner.querySelector('img'); const bH=banner.querySelector('h2'); const bP=banner.querySelector('.banner-small__infotext'); const bA=banner.querySelector('a');
  const qC=main.querySelector(':scope > .columns-grid'); const qImg=qC.querySelector('img'); const qH=qC.querySelector('h2'); const qP=qC.querySelector('.text-wrapper p'); const qA=qC.querySelector('a.ffe-button');
  const pr=main.querySelector(':scope > .prices'); const prH=pr.querySelector('h2'); const priceCards=[...pr.querySelectorAll('.price.card')]; const prA=pr.querySelector('.prices__bottom-info a'); const prP=pr.querySelector('.prices__bottom-info p');
  const calcH=main.querySelector(':scope > .text h2');
  const cfg=[...main.querySelectorAll('.calculator-loan script')].map(s=>s.textContent).find(t=>/sparebank1Config/.test(t))||'';
  const cfgStr=k=>(cfg.match(new RegExp(k+':\\s*"([^"]*)"'))||[]).slice(1).find(Boolean)||'';
  const cfgNum=(block,k)=>{ const b=cfg.slice(cfg.indexOf(block)); return (b.match(new RegExp(k+':\\s*Number\\("([\\d.]+)"\\)'))||[]).slice(1).find(Boolean)||''; };
  const nok=n=>Number(n).toLocaleString('nb-NO').replace(/ /g,' ')+' kr';
  const applyUrl=(cfg.slice(cfg.indexOf('howMuchLoan')).match(/applyForLoan:\s*"([^"]*)"/)||[]).slice(1).find(Boolean); const contactUrl=(cfg.slice(cfg.indexOf('howMuchLoan')).match(/contactLoan:\s*"([^"]*)"/)||[]).slice(1).find(Boolean);
  const faq=main.querySelector(':scope > .faq'); const faqH=faq.querySelector('.title h2'); const faqItems=[...faq.querySelectorAll('.faq-item')]; const moreBtn=faq.querySelector('button.faq-button--more');
  const rel=main.querySelector(':scope > .related-topics'); const relH=rel.querySelector('h2'); const relCards=[...rel.querySelectorAll('.card')];
  const fbH=main.querySelector(':scope > .feedback h2');
  const cmp=main.querySelector(':scope > .referance, :scope > .reference'); const cmpH=cmp.querySelector('h2'); const cmpP=cmp.querySelector('p');

  const heroCtas=heroBtns.map((a,i)=>`<a class="btn ${btnKind(a.getAttribute('class'))}"${i===0?' data-cta="primary"':''} data-slot="cta" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('');
  const choices=choiceCards.map(c=>{const img=c.querySelector('img'); const a=c.querySelector('a.card__title'); const p=c.querySelector('p'); return `<li class="card card--tint choice is-link"><img class="card-image" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}" width="1280" height="720" loading="lazy" decoding="async"><div class="card-body"><h3 class="card-title h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p>${esc(norm(p.textContent))}</p></div></li>`;}).join('');
  const prices=priceCards.map(c=>{const a=c.querySelector('a.card__title'); const p=c.querySelector('p'); return `<li class="card card--tint price-card is-link"><div class="card-body"><h3 class="card-title h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p>${esc(norm(p.textContent))}</p></div></li>`;}).join('');
  const faqItem=(it)=>{const h=norm(it.querySelector('h3').textContent); const body=it.querySelector('.ffe-accordion-item__body'); return `<details><summary><h3 class="faq-q">${esc(h)}</h3>${icons.down}</summary><div class="answer prose">${faqBody(body,doc)}</div></details>`;};
  const shown=faqItems.filter(i=>!/non-highlighted/.test(i.getAttribute('class'))); const hiddenItems=faqItems.filter(i=>/non-highlighted/.test(i.getAttribute('class')));
  const tips=relCards.map(c=>{const img=c.querySelector('img'); const a=c.querySelector('a.card__title'); const tag=norm(c.querySelector('.card__tag')?.textContent); return `<li class="card card--tint news-card is-link"><img class="card-image" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}"${img.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1280" height="720" loading="lazy" decoding="async"><div class="card-body"><h3 class="card-title h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3>${tag?`<p class="meta small"><span>${esc(tag)}</span></p>`:''}</div></li>`;}).join('');
  const cmpHtml=cmpP.innerHTML.replace(/<a\s([^>]*)>/g,'<a $1 class="link-more" rel="noopener">').replace(/<\/a>/g,`${icons.external}</a>`).replace(/\s+/g,' ').trim();

  // Calculator static shell (dynamics #7 interim). Config-script strings lifted by selector; the remaining visible strings are transcribed from the captured screenshot (see shape brief § Unsourced / excluded).
  const radio=(name,legend,vals,checked)=>`<fieldset class="calc-pills" disabled><legend class="label">${esc(legend)}</legend><div class="pill-row">${vals.map((v,i)=>`<label class="pill${v===checked?' is-on':''}"><input type="radio" name="${name}" value="${esc(v)}"${v===checked?' checked':''} disabled><span>${esc(v)}</span></label>`).join('')}</div></fieldset>`;
  const calc=`<div class="calc" data-source="captured-screenshot" data-dynamics="7" aria-disabled="true">
      <div class="calc-tabs" role="group" aria-label="${esc(norm(calcH.textContent))}"><button type="button" class="calc-tab is-on" aria-pressed="true" disabled>Hvor mye kan jeg låne?</button><button type="button" class="calc-tab" aria-pressed="false" disabled>Hvor mye koster lånet?</button></div>
      <div class="calc-groups">${radio('lantakere','Antall låntakere',['1','2'],'1')}${radio('barn','Antall barn under 18 år',['0','1','2','3','4','5+'],'0')}${radio('biler','Antall biler',['0','1','2'],'0')}</div>
      <div class="calc-fields">
        <div class="field"><label class="label" for="calc-inntekt">Samlet inntekt før skatt</label><input class="input num" id="calc-inntekt" type="text" inputmode="numeric" value="${esc(nok(cfgNum('howMuchLoan','grossAnnualIncome')))}" disabled></div>
        <div class="field"><label class="label" for="calc-gjeld">Samlet lån og gjeld</label><input class="input num" id="calc-gjeld" type="text" inputmode="numeric" value="${esc(nok(cfgNum('howMuchLoan','existingLoan')))}" disabled></div>
      </div>
      <div class="calc-result"><p class="calc-result-label">Vi tror du kan låne</p><p class="calc-result-value num" aria-live="off">1 096 100 kr</p></div>
      <p class="calc-ctas"><a class="btn btn-action" data-slot="cta" href="${esc(applyUrl)}">${esc(cfgStr('loanApply'))}</a><a class="btn btn-secondary" href="${esc(contactUrl)}">${esc(cfgStr('loanContact'))}</a></p>
      <p class="calc-note">Ved å søke kan vi gi deg et tilbud med svar på nøyaktig hvor mye du kan låne, og hva det vil koste. Det er helt uforpliktende å søke lån hos oss.</p>
      <p class="calc-note num">Priseksempel: Nominell rente 5,33 %. Effektiv rente 5,56 %. Låner du 1 096 100 over 25 år koster lånet 906 457 og du betaler totalt 2 002 557 kroner.</p>
    </div>`;

  const mainHtml=`
<section class="movement hero" data-section="hero" data-intent="name the product, one action" data-layout="bento-cells" data-media="image" data-module="product-hero">
  <div class="container"><div class="bento hero-bento">
    <div class="card card--frost hero-card"><div class="card-body">
      <p class="backlink-row"><a class="arrow backlink" href="${esc(back.getAttribute('href'))}"><span>${esc(norm(back.textContent))}</span></a></p>
      <h1 data-slot="heading">${esc(norm(h1.textContent))}</h1>
      <p class="lead" data-slot="text">${esc(norm(lead.textContent))}</p>
      <p class="cta-row">${heroCtas}</p>
    </div></div>
    <figure class="card hero-photo" data-slot="image"><img src="${asset(imgSrc(heroImg))}" alt="${esc(heroImg.getAttribute('alt')||'')}" width="1200" height="800" loading="eager" fetchpriority="high" decoding="async"></figure>
  </div></div>
</section>
<section class="movement choices" data-section="choices" data-intent="route by task" data-layout="grid" data-items="${choiceCards.length}" data-module="card-rail" data-media="image">
  <div class="container">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(choicesH.textContent))}</h2>
    <ul class="bento choice-grid grid-${Math.min(choiceCards.length,4)}" data-slot="cards">${choices}</ul>
    <div class="bento promo-row"><div class="card card--frost promo-art"><img class="promo-illu" src="${asset(imgSrc(bImg))}" alt="" aria-hidden="true" width="200" height="150" loading="lazy" decoding="async"></div>
    <article class="card card--tint promo is-link" data-module="promo-band"><div class="card-body"><h2 class="h3" data-slot="heading">${esc(norm(bH.textContent))}</h2><p data-slot="text">${esc(norm(bP.textContent))}</p><p class="actions"><a class="btn ${btnKind(bA.getAttribute('class'))} cover-link" data-slot="cta" href="${esc(bA.getAttribute('href'))}">${esc(norm(bA.textContent))}</a></p></div></article></div>
  </div>
</section>
<section class="movement questions" data-section="questions" data-intent="offer adviser contact" data-layout="bento-cells" data-media="image" data-module="split-media">
  <div class="container"><div class="bento q-bento">
    <figure class="card q-photo" data-slot="image"><img src="${asset(imgSrc(qImg))}" alt="${esc(qImg.getAttribute('alt')||'')}"${qImg.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1200" height="800" loading="lazy" decoding="async"></figure>
    <div class="card card--tint q-card is-link"><div class="card-body"><h2 class="h2-m" data-slot="heading">${esc(norm(qH.textContent))}</h2><p class="lead" data-slot="text">${esc(norm(qP.textContent))}</p><p class="actions"><a class="btn ${btnKind(qA.getAttribute('class'))} cover-link" data-slot="cta" href="${esc(qA.getAttribute('href'))}">${esc(norm(qA.textContent))}</a></p></div></div>
  </div></div>
</section>
<section class="movement prices" data-section="prices" data-intent="choose a loan variant; regulatory price example" data-layout="grid" data-items="${priceCards.length}" data-module="price-cards">
  <div class="container">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(prH.textContent))}</h2>
    <ul class="bento price-grid" data-slot="cards">${prices}</ul>
    <div class="price-foot"><p><a class="btn ${btnKind(prA.getAttribute('class'))}" data-slot="cta" href="${esc(prA.getAttribute('href'))}">${esc(norm(prA.textContent))}</a></p><p class="num price-example" data-slot="text">${esc(norm(prP.textContent))}</p></div>
  </div>
</section>
<section class="movement calculator" data-section="calculator" data-intent="estimate borrowing capacity (interim static shell)" data-layout="bento-cell" data-module="calculator" data-dynamics="7">
  <div class="container"><div class="bento"><div class="card card--frost calc-card"><div class="card-body">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(calcH.textContent))}</h2>
    ${calc}
  </div></div></div></div>
</section>
<section class="movement faq-section" data-section="faq" data-intent="answer common questions" data-layout="contained" data-items="${faqItems.length}" data-module="faq">
  <div class="container faq-wrap">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(faqH.textContent))}</h2>
    <div class="faq" data-slot="items">
      ${shown.map(faqItem).join('\n      ')}
      <details class="faq-more"><summary class="btn-inline">${esc(norm(moreBtn.textContent))}${icons.down}</summary><div class="faq faq-more-items">${hiddenItems.map(faqItem).join('\n      ')}</div></details>
    </div>
  </div>
</section>
<section class="movement related" data-section="related" data-intent="cross-link: advice" data-layout="grid" data-items="${relCards.length}" data-module="card-rail" data-media="image">
  <div class="container">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(relH.textContent))}</h2>
    <ul class="bento tips-grid grid-${Math.min(relCards.length,4)}" data-slot="cards">${tips}</ul>
  </div>
</section>
<section class="feedback" data-section="feedback" data-intent="page feedback (static)" data-layout="contained" data-module="feedback" data-dynamics="5">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(norm(fbH.textContent))}</h2><div class="feedback-btns"><button class="btn btn-secondary" type="button">${icons.thumbUp}<span class="visually-hidden">Ja</span></button><button class="btn btn-secondary" type="button">${icons.thumbDown}<span class="visually-hidden">Nei</span></button></div></div>
</section>
<section class="movement compare" data-section="compare" data-intent="regulatory: compare prices" data-layout="bento-cell" data-module="cta-band">
  <div class="container"><div class="bento"><div class="card card--frost compare-card"><div class="card-body"><h2 class="h2-s" data-slot="heading">${esc(norm(cmpH.textContent))}</h2><p data-slot="text">${cmpHtml}</p></div></div></div></div>
</section>`;

  const css=CSS;
  return { template:'program', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-lan-boliglan-html-shape.md', dominantDimension:'composition/guided-catalogue', conceptSeed:'surface 2386009b (dealt 6,3,7; 6 built)', unsourcedContent:[], calculatorInterim:'dynamics #7 — static shell; config-script strings by selector, remaining visible strings transcribed from the captured screenshot (data-source="captured-screenshot")', signatureElements:['bankchoice_bg.svg in the router band','one-corner-pair photo mask (hero 96px, cards 48px)','spot illustration on the Klar for budrunden? promo'], improvementsApplied:['#1 compact router','#2 calm two-tier header','#3 1.25 scale','#4 one card language (choices, prices, tips)','#6 hero photo at content scale','#7 movements on paper, 4 dividers dropped'] } };
}

/* ───────────────────────── Path A′ sibling engine ─────────────────────────
   Component walker over the captured <main>: flattens AEM containers (.background-container, .referance, .aem-main-container, …)
   in captured order, maps every leaf component to the archetype's renderings (same data-module values / classes / CSS) and
   falls back to a verbatim `rich-text` prose movement for anything else. Nothing dropped, nothing invented, no placeholder text.
   Shared by the theme and market-landing family modules (they import renderSibling for their siblings). */
const cl=e=>' '+(e?.getAttribute?.('class')||'')+' ';
const has=(e,c)=>cl(e).includes(' '+c+' ');
const A=(el,sel)=>el?[...el.querySelectorAll(sel)]:[];
const txt=el=>norm(el?.textContent);
const isHidden=e=>/ (hide|hidden|d-none) /.test(cl(e))||e.hasAttribute('hidden')||/display:\s*none/.test(e.getAttribute('style')||'');
const isSvg=s=>/\.svg(\?|$)/i.test(s||'');
const hrefOf=a=>esc(a?.getAttribute('href')||'#');
const LEAF=['to-parent','columns-grid','card','text','title','image','button','button-list-container','usp','price-and-terms','prices','cobranding','banner-small','tip','faq','accordion','progressive-disclosure','related-products','static-cards','related-topics','visual-nav','shortcuts','feedback','comparison','step-by-step','guide-carousel','contentfragmentlist','campaign','campaign-carousel','product-nav','video','calculator-loan','section'];
const SKIP=['send-to-bank-modal','send-to-bank__loading','base-component','bank-choice-overlay','faq__feedback-box','hr'];
function kindOf(e){ const t=e.tagName; if(/^(HR|SCRIPT|STYLE|LINK|NOSCRIPT|TEMPLATE|SVG)$/.test(t)) return 'skip'; const c=cl(e); if(SKIP.some(k=>c.includes(' '+k+' '))||isHidden(e)) return 'skip'; for(const k of LEAF) if(c.includes(' '+k+' ')) return k; const tl=t.toLowerCase(); if(/^h[1-6]$/.test(tl)) return 'heading'; if(/^(p|ul|ol|table|blockquote)$/.test(tl)) return 'inline'; if(e.children.length) return 'container'; return 'skip'; }
/** Leaves of `root` in captured order; containers are unwrapped. */
function collect(root,out=[]){ for(const ch of root.children){ const k=kindOf(ch); if(k==='skip') continue; if(k==='container'){ collect(ch,out); continue; } out.push({k,el:ch}); } return out; }
const imgTag=(i,{cls,eager=false,alt}={})=>{ if(!i) return ''; const s=imgSrc(i); const hid=i.getAttribute('aria-hidden')==='true'||i.getAttribute('role')==='presentation'; const a=alt!==undefined?alt:(hid?'':(i.getAttribute('alt')||'')); return `<img class="${cls||(isSvg(s)?'illu':'photo photo-sm')}" src="${asset(s)}" alt="${esc(a)}"${hid?' aria-hidden="true"':''}${eager?' loading="eager" fetchpriority="high"':' loading="lazy"'} decoding="async">`; };
const btnA=(a,extra='',cls)=>`<a class="btn ${cls||btnKind(cl(a))}"${extra} href="${hrefOf(a)}">${esc(txt(a))}</a>`;
const grid=(items,cls)=>`<ul class="bento ${cls} grid-${Math.min(items.length,4)}" data-slot="cards">${items.join('')}</ul>`;
/** Verbatim rich text: strip editor wrappers/attrs, keep p/h/ul/ol/li/a/strong/em/img/table/br; captured buttons → .btn; h1 → h2. */
function rte(el,doc,{inner=false,imgClass}={}){
  const w=doc.createElement('div'); if(inner){ for(const n of el.childNodes) w.appendChild(n.cloneNode(true)); } else w.appendChild(el.cloneNode(true));
  for(const x of A(w,'.bank-choice-overlay,.faq__feedback-box,.hr,script,style,svg,link,source,noscript,iframe,img.video-placeholder,img.arrow-right,img.arrow-left,[hidden],.hide,.hidden')) x.remove();
  for(const b of A(w,'button')){ if(/^(P|LI|TD|TH|H[1-6]|B|STRONG|EM|I|SPAN)$/.test(b.parentElement?.tagName||'')){ while(b.firstChild) b.parentNode.insertBefore(b.firstChild,b); } b.remove(); }
  for(const a of A(w,'a.ffe-button,a.ffe-inline-button,a.overlay-btn')){ const k=cl(a); const vis=/hide-phone/.test(k)?' only-desktop':/hide-desktop/.test(k)?' only-phone':''; const label=txt(a); const href=a.getAttribute('href')||'#'; for(const at of [...a.attributes]) a.removeAttribute(at.name); a.setAttribute('class',`btn ${btnKind(k)}${vis}`); a.setAttribute('href',href); a.textContent=label; }
  for(const h of A(w,'h1,h2,h3,h4,h5,h6')){ const n=doc.createElement(h.tagName==='H1'?'h2':h.tagName.toLowerCase()); if(!h.querySelector('a[href]')) n.textContent=txt(h); else { for(const x of A(h,'br')) x.replaceWith(doc.createTextNode(' ')); for(const x of A(h,'span,b,strong,em,i,u,font')){ while(x.firstChild) x.parentNode.insertBefore(x.firstChild,x); x.remove(); } for(const l of A(h,'a')){ const href=l.getAttribute('href')||'#'; const t=txt(l); for(const at of [...l.attributes]) l.removeAttribute(at.name); l.setAttribute('href',href); l.textContent=t; } n.innerHTML=h.innerHTML.replace(/\s+/g,' ').trim(); } h.replaceWith(n); }
  for(const p of A(w,'picture')){ while(p.firstChild) p.parentNode.insertBefore(p.firstChild,p); p.remove(); }
  for(const i of A(w,'img')){ const s=imgSrc(i); const hid=i.getAttribute('aria-hidden')==='true'||i.getAttribute('role')==='presentation'; const alt=hid?'':(i.getAttribute('alt')||''); for(const at of [...i.attributes]) i.removeAttribute(at.name); i.setAttribute('class',imgClass||(isSvg(s)?'illu':'photo photo-sm')); i.setAttribute('src',asset(s)); i.setAttribute('alt',alt); if(hid) i.setAttribute('aria-hidden','true'); i.setAttribute('loading','lazy'); i.setAttribute('decoding','async'); }
  for(const u of A(w,'ul.ffe-check-list')) u.setAttribute('data-keep','check-list');
  for(const r of A(w,'.columns-grid__row')) r.setAttribute('data-keep','cols'); for(const c of A(w,'.columns-grid__column')) c.setAttribute('data-keep','col');
  for(const s of A(w,'span,font,section,article,header,footer')){ while(s.firstChild) s.parentNode.insertBefore(s.firstChild,s); s.remove(); }
  let ch=true; while(ch){ ch=false; for(const d of A(w,'div')){ if(d.getAttribute('data-keep')) continue; while(d.firstChild) d.parentNode.insertBefore(d.firstChild,d); d.remove(); ch=true; } }
  for(const e of A(w,'*')){ const keep=e.getAttribute('data-keep'); const isBtn=e.tagName==='A'&&/^btn /.test(e.getAttribute('class')||''); for(const at of [...e.attributes]){ const n=at.name; if(n==='href'||n==='colspan'||n==='rowspan'||n==='scope') continue; if(e.tagName==='IMG'&&['class','src','alt','aria-hidden','loading','decoding'].includes(n)) continue; if(isBtn&&n==='class') continue; e.removeAttribute(n); } if(keep) e.setAttribute('class',keep); }
  for(const p of A(w,'p')){ if(!txt(p)&&!p.querySelector('img,a')) p.remove(); }
  for(const li of A(w,'li')){ if(!txt(li)&&!li.querySelector('img,a')) li.remove(); }
  const btns=[...w.children].filter(x=>x.tagName==='A'&&/^btn /.test(x.getAttribute('class')||'')); if(btns.length){ const row=doc.createElement('p'); row.setAttribute('class','cta-row'); btns[0].parentNode.insertBefore(row,btns[0]); for(const b of btns) row.appendChild(b); }
  return w.innerHTML.replace(/\s+/g,' ').trim();
}
/** One movement: `html(paper)` renders the <section> with an optional paper tint (assigned by the tint pass). */
const sec=(kind,{section,intent,layout='contained',module,items,media,extra='',cls=''},inner)=>({kind,html:paper=>`<section class="movement${paper?' paper-'+paper:''}${cls?' '+cls:''}" data-section="${esc(section||kind)}" data-intent="${esc(intent||kind)}" data-layout="${layout}"${module?` data-module="${module}"`:''}${items!=null?` data-items="${items}"`:''}${media?` data-media="${media}"`:''}${extra}>\n${inner}\n</section>`});

/* ── leaf renderers (inline HTML or movements) ── */
function cardLi(c,doc,{icon=false}={}){
  const img=c.querySelector('img:not(.arrow-right):not(.arrow-left)'); const a=c.querySelector('a.card__title')||c.querySelector('.card__container-content a')||c.querySelector('a');
  const hEl=c.querySelector('.card__title,.card__container-content h2,.card__container-content h3,.card__container-content h4'); const textC=c.querySelector('.text');
  const tag=txt(c.querySelector('.card__tag')); const date=txt(c.querySelector('.card__date')); const ps=A(c,'p').filter(p=>!p.closest('.text')); const s=imgSrc(img);
  const body=textC?rte(textC,doc).replace(/<h([2-6])>/,'<h3 class="card-title title-sm">').replace(/<\/h[2-6]>/,'</h3>'):'';
  const title=a?`<h3 class="card-title title-sm"><a href="${hrefOf(a)}">${esc(txt(a))}</a></h3>`:(hEl&&!textC?`<h3 class="card-title title-sm">${esc(txt(hEl))}</h3>`:'');
  const meta=tag||date?`<p class="meta">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time class="num">${esc(date)}</time>`:''}</p>`:'';
  const btns=A(c,'a.ffe-button,a.ffe-inline-button').filter(b=>!textC||!textC.contains(b));
  const photo=img&&!icon&&!isSvg(s); return `<li class="card card--tint is-link ${icon?'link-card':'choice'}">${photo?imgTag(img,{cls:'card-image'}):''}<div class="card-body">${img&&!photo?imgTag(img,{cls:icon?'illu card-icon':'illu card-illu'}):''}${title}${meta}${ps.map(p=>`<p>${rte(p,doc,{inner:true})}</p>`).join('')}${body}${btns.length?`<p class="cta-row">${btns.map(b=>btnA(b)).join('')}</p>`:''}</div></li>`;
}
function navLi(el,doc){ const a=el.querySelector('a.nav--wrapper')||el.querySelector('a'); const bg=(A(el,'[style*="background-image"]').map(x=>x.getAttribute('style')).join(' ').match(/url\("?([^")]+)"?\)/)); const icon=A(el,'img').find(i=>!/chevron|arrow|material-icons/.test(imgSrc(i))); const h=el.querySelector('h2,h3,h4'); const p=el.querySelector('p'); return `<li class="card card--tint is-link choice${icon&&!bg?' link-card':''}">${bg?`<img class="card-image" src="${asset(bg[1])}" alt="" loading="lazy" decoding="async">`:''}<div class="card-body">${icon?imgTag(icon,{cls:'illu card-icon'}):''}<h3 class="card-title h3"><a class="cover-link" href="${hrefOf(a)}">${esc(txt(h))}</a></h3>${p?`<p>${esc(txt(p))}</p>`:''}</div></li>`; }
function tipsLi(c,doc){ const img=c.querySelector('img:not(.arrow-right):not(.arrow-left)'); const a=c.querySelector('a.card__title')||c.querySelector('a.ffe-text-link')||c.querySelector('a'); const tag=txt(c.querySelector('.card__tag')); const date=txt(c.querySelector('.card__date')); const p=A(c,'p').find(x=>!has(x,'card__tag')); return `<li class="card card--tint news-card is-link">${img?imgTag(img,{cls:'card-image'}):''}<div class="card-body"><h3 class="card-title h3"><a class="cover-link" href="${hrefOf(a)}">${esc(txt(a))}</a></h3>${tag||date?`<p class="meta">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time class="num">${esc(date)}</time>`:''}</p>`:''}${p?`<p>${rte(p,doc,{inner:true})}</p>`:''}</div></li>`; }
const uspList=(el,doc)=>{ const items=A(el,'.icon-list__item'); if(items.length) return `<ul class="usp-list usp-icons" data-module="usp" data-items="${items.length}">${items.map(it=>{const img=it.querySelector('img'); const t=it.querySelector('.icon-list__item-text')||it; return `<li>${img?imgTag(img,{cls:'illu usp-icon'}):''}<div class="usp-text">${rte(t,doc)}</div></li>`;}).join('')}</ul>`; const plain=A(el,'.usp-item__text').map(txt).filter(Boolean); return plain.length?`<ul class="usp-list" data-module="usp" data-items="${plain.length}">${plain.map(u=>`<li>${esc(u)}</li>`).join('')}</ul>`:''; };
const videoHtml=el=>{ const f=el.querySelector('iframe'); const url=f?.getAttribute('data-video-url')||f?.getAttribute('src'); if(!url) return ''; const t=f.getAttribute('title')||url; return `<p class="video-link" data-dynamics="video"><a class="btn btn-secondary" href="${esc(url)}" rel="noopener">${icons.play}<span>${esc(t)}</span></a></p>`; };
function calloutHtml(el,doc){ const w=el.querySelector('.tip-content')||el.querySelector('.text-wrapper')||el; const h=w.querySelector('h2,h3,h4'); const rest=rte(w,doc).replace(/<h[2-6]>[^<]*<\/h[2-6]>/,''); return `<div class="callout">${icons.bulb}<div class="callout-text">${h?`<h2 class="title-sm" data-slot="heading">${esc(txt(h))}</h2>`:''}<div class="prose" data-slot="text">${rest}</div></div></div>`; }
function disclosureHtml(el,doc){ const b=el.querySelector('button'); const content=el.querySelector('.content')||el; return `<details class="disclosure"><summary class="btn-inline">${esc(txt(b))}${icons.down}</summary><div class="prose">${rte(content,doc)}</div></details>`; }
function priceTermsInner(el,doc){ const wrap=el.querySelector('.price-and-terms__wrapper')||el; const h=wrap.querySelector('.price-and-terms__title h2,.price-and-terms__title h3,.price-and-terms__title h4'); const lis=A(wrap,'.price-and-terms__terms li'); const link=wrap.querySelector('.price-and-terms__list-link a'); const rest=[]; for(const c of wrap.children){ if(has(c,'price-and-terms__title')||has(c,'price-and-terms__list-link')) continue; if(has(c,'price-and-terms__wrap-terms')){ for(const cc of c.children) if(!has(cc,'price-and-terms__terms-wrap')) rest.push(cc); continue; } rest.push(c); }
  return `${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}${lis.length?`<ul class="check-list" data-slot="items">${lis.map(li=>`<li>${rte(li,doc,{inner:true})}</li>`).join('')}</ul>`:''}${rest.map(o=>rte(o,doc)).filter(Boolean).map(x=>`<div class="prose price-note">${x}</div>`).join('')}${link?`<p class="cta-row"><a class="btn btn-secondary" data-slot="cta" href="${hrefOf(link)}">${esc(txt(link))}</a></p>`:''}`; }
function promoArticle(b,doc){ const img=b.querySelector('.banner-small__image img')||b.querySelector('img'); const h=b.querySelector('.banner-small__header,h2,h3'); const p=b.querySelector('.banner-small__infotext')||b.querySelector('p'); const a=b.querySelector('.banner-small__bottom a')||b.querySelector('a.ffe-button')||b.querySelector('a'); const extra=b.querySelector('.banner-small__bottom--image img'); return `<article class="promo promo-solo" data-module="promo-band">${img?imgTag(img,{cls:'promo-illu'}):''}<div class="promo-text">${h?`<h2 class="title-sm" data-slot="heading">${esc(txt(h))}</h2>`:''}${p?`<p data-slot="text">${rte(p,doc,{inner:true})}</p>`:''}${a?`<p><a class="btn ${btnKind(cl(a))==='btn-action'?'btn-action':'btn-secondary'}" data-slot="cta" href="${hrefOf(a)}">${esc(txt(a))}</a></p>`:''}</div>${extra?imgTag(extra,{cls:'illu promo-extra'}):''}</article>`; }
function quickLinksHtml(el){ const items=A(el,'.product-nav__item'); return `<ul class="quick-links" data-items="${items.length}">${items.map(it=>{const img=it.querySelector('img'); const a=it.querySelector('a'); return `<li>${img?imgTag(img,{cls:'illu ql-icon',alt:''}):''}<a href="${hrefOf(a)}">${esc(txt(a))}</a></li>`;}).join('')}</ul>`; }
/* ── movements ── */
function faqMov(el,doc,n){ const h=el.querySelector('.title h2,.title h3,.title h4'); const items=A(el,'.faq-item'); const more=el.querySelector('button.faq-button--more');
  const item=it=>{ const q=txt(it.querySelector('h2,h3,h4')); const body=it.querySelector('.ffe-accordion-item__body'); return `<details><summary><h3 class="faq-q">${esc(q)}</h3>${icons.down}</summary><div class="answer prose">${body?faqBody(body,doc):''}</div></details>`; };
  const shown=items.filter(i=>!/non-highlighted/.test(cl(i))); const hid=items.filter(i=>/non-highlighted/.test(cl(i)));
  const hidHtml=!hid.length?'':more?`<details class="faq-more"><summary class="btn-inline">${esc(txt(more))}${icons.down}</summary><div class="faq faq-more-items">${hid.map(item).join('')}</div></details>`:hid.map(item).join('');
  return sec('faq',{section:`faq-${n}`,intent:'answer common questions',module:'faq',items:items.length,cls:'faq-section'},`  <div class="container faq-wrap">${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}<div class="faq" data-slot="items">${shown.map(item).join('')}${hidHtml}</div></div>`); }
function accMov(el,doc,n){ const c=el.querySelector('.accordion-container')||el; const h=[...c.children].find(x=>/^H[2-4]$/.test(x.tagName)); const lead=[...c.children].filter(x=>x.tagName==='P'); const items=A(c,'.accordion__item,.ffe-accordion-item');
  return sec('faq',{section:`accordion-${n}`,intent:'expandable detail',module:'accordion',items:items.length,cls:'faq-section'},`  <div class="container faq-wrap">${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}${lead.map(p=>`<p class="lead">${rte(p,doc,{inner:true})}</p>`).join('')}<div class="faq" data-slot="items">${items.map(it=>{const q=txt(it.querySelector('.ffe-accordion-item__heading-button-content')||it.querySelector('h2,h3,h4,button')); const body=it.querySelector('.ffe-accordion-item__body')||it; return `<details><summary><h3 class="faq-q">${esc(q)}</h3>${icons.down}</summary><div class="answer prose">${rte(body,doc)}</div></details>`;}).join('')}</div></div>`); }
function priceTermsMov(el,doc,n){ return sec('price-terms',{section:`prices-${n}`,intent:'prices and terms',module:'price-terms',items:A(el,'.price-and-terms__terms li').length},`  <div class="container price-terms">${priceTermsInner(el,doc)}</div>`); }
function pricesMov(el,doc,n){ const h=el.querySelector('h2,h3'); const cards=A(el,'.price.card, .card'); const foot=el.querySelector('.prices__bottom-info'); const fa=foot?.querySelector('a'); const fps=A(foot,'p'); const prices=cards.map(c=>{const a=c.querySelector('a.card__title')||c.querySelector('a'); const p=c.querySelector('p'); return `<li class="card price-card"><h3 class="card-title title-sm">${a?`<a href="${hrefOf(a)}">${esc(txt(a))}</a>`:esc(txt(c.querySelector('h2,h3,h4')))}</h3>${p?`<p>${esc(txt(p))}</p>`:''}</li>`;}).join('');
  return sec('prices',{section:`prices-${n}`,intent:'choose a variant; regulatory price example',layout:'grid',items:cards.length,module:'price-cards',cls:'prices'},`  <div class="container">${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}<ul class="price-grid" data-slot="cards">${prices}</ul>${foot?`<div class="price-foot">${fa?`<p><a class="btn ${btnKind(cl(fa))}" data-slot="cta" href="${hrefOf(fa)}">${esc(txt(fa))}</a></p>`:''}${fps.map(p=>`<p class="num price-example" data-slot="text">${esc(txt(p))}</p>`).join('')}</div>`:''}</div>`); }
function cobrandMov(el,doc,n){ const q=el.querySelector('.cobranding__header .ffe-h4,.cobranding__header h2,.cobranding__header h3,.cobranding__header div'); const content=el.querySelector('.cobranding__content')||el; const h=content.querySelector('h2,h3,h4'); const col2=content.querySelector('.cobranding__column2'); const inSide=x=>!!(col2&&col2.contains(x));
  const imgs=A(content,'img').filter(i=>!inSide(i)); const logo=imgs[0]; const extraImgs=imgs.slice(1);
  const seen=new Set(); const dedupe=a=>{const k=hrefOf(a)+'|'+txt(a); if(seen.has(k)) return false; seen.add(k); return true;};
  const mainText=A(content,'.text').filter(t=>!inSide(t)).map(t=>{ if(h&&t.contains(h)){ const c=t.cloneNode(true); const hh=c.querySelector('h2,h3,h4'); if(hh) hh.remove(); return rte(c,doc); } return rte(t,doc); }).join('');
  const mainBtns=A(content,'a.ffe-button,a.ffe-inline-button').filter(a=>!inSide(a)).filter(dedupe); const sideBtns=col2?A(col2,'a.ffe-button,a.ffe-inline-button').filter(dedupe):[];
  const c2img=col2?.querySelector('img'); const c2text=col2?A(col2,'.text').map(t=>rte(t,doc)).join(''):'';
  return sec('cobranding',{section:`cobranding-${n}`,intent:'member programme offer',layout:'split-media',media:'image',module:'cobranding'},`  <div class="container cobrand">
    <div class="cobrand-main">${logo?imgTag(logo,{cls:'illu cobrand-logo'}):''}${h?`<h2 data-slot="heading">${esc(txt(h))}</h2>`:''}${q?`<p class="meta">${esc(txt(q))}</p>`:''}<div class="prose" data-slot="text">${mainText}</div>${mainBtns.length?`<p class="cta-row">${mainBtns.map((a,i)=>btnA(a,i===0?' data-slot="cta"':'')).join('')}</p>`:''}</div>
    ${col2||extraImgs.length?`<aside class="cobrand-side">${extraImgs.map(i=>imgTag(i,{cls:'illu cobrand-illu'})).join('')}${c2img?imgTag(c2img,{cls:'illu cobrand-illu'}):''}${c2text?`<div class="prose">${c2text}</div>`:''}${sideBtns.length?`<p class="cta-row">${sideBtns.map(a=>btnA(a)).join('')}</p>`:''}</aside>`:''}
  </div>`); }
function shortcutsMov(el,doc,n){ const h=el.querySelector('h2,h3'); const lis=A(el,'.shortcuts-list__item'); return sec('shortcuts',{section:`shortcuts-${n}`,intent:'self-service shortcuts',module:'shortcuts',items:lis.length},`  <div class="container">${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}<ul class="shortcut-list" data-slot="links">${lis.map(li=>{const as=A(li,'a'); const m=as.find(a=>has(a,'hide-desktop')); const d=as.find(a=>a!==m); return `<li>${d?btnA(d,'','btn-secondary'+(m?' only-desktop':'')):''}${d&&m?' ':''}${m?btnA(m,'','btn-secondary only-phone'):''}</li>`;}).join('')}</ul></div>`); }
function linkCardsMov(el,doc,n){ const cards=A(el,'.card'); const texts=A(el,'.text').filter(t=>!t.closest('.card')); const hEl=el.querySelector('.title h2,.title h3,.title h4'); let head=hEl?`<h2 class="section-title" data-slot="heading">${esc(txt(hEl))}</h2>`:''; const all=A(el,'*'); const ci=cards[0]?all.indexOf(cards[0]):Infinity; const before=texts.filter(t=>all.indexOf(t)<ci); const after=texts.filter(t=>all.indexOf(t)>=ci);
  if(!head&&before.length&&before[0].querySelector('h1,h2,h3,h4')) head=hoistH2(rte(before.shift(),doc),'section-title').replace('<p>','<p class="lead section-lede">');
  const pre=before.map(t=>`<div class="prose">${rte(t,doc)}</div>`).join(''); const post=after.map(t=>`<div class="prose cards-foot">${rte(t,doc)}</div>`).join('');
  const small=cards.some(c=>c.querySelector('.card__container--small'))||cards.every(c=>{const i=c.querySelector('img'); return !i||isSvg(imgSrc(i));});
  return sec('cards',{section:`related-${n}`,intent:'cross-link: related products',layout:'grid',module:'card-rail',items:cards.length,media:'image'},`  <div class="container">${head}${pre}${grid(cards.map(c=>cardLi(c,doc,{icon:small})),small?'link-cards':'choice-grid')}${post}</div>`); }
function tipsMov(el,doc,n){ const h=el.querySelector('.title h2,.title h3'); const cards=A(el,'.card'); return sec('related',{section:`tips-${n}`,intent:'cross-link: advice',layout:'grid',module:'card-rail',media:'image',items:cards.length,cls:'related'},`  <div class="container">${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}${grid(cards.map(c=>tipsLi(c,doc)),'tips-grid')}</div>`); }
function feedbackMov(el){ const h=el.querySelector('h2,h3'); return {kind:'feedback',html:()=>`<section class="feedback" data-section="feedback" data-intent="page feedback (static)" data-layout="contained" data-module="feedback" data-dynamics="5">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(txt(h))}</h2><div class="feedback-btns"><button class="btn btn-secondary" type="button">${icons.thumbUp}<span class="visually-hidden">Ja</span></button><button class="btn btn-secondary" type="button">${icons.thumbDown}<span class="visually-hidden">Nei</span></button></div></div>
</section>`}; }
function compareMov(el,doc){ const h=el.querySelector('h2,h3'); const p=el.querySelector('p'); const html=rte(p,doc,{inner:true}).replace(/<a\s([^>]*)>/g,'<a $1 class="link-more" rel="noopener">').replace(/<\/a>/g,`${icons.external}</a>`); return sec('compare',{section:'compare',intent:'regulatory: compare prices',module:'cta-band',cls:'compare'},`  <div class="container"><div class="cta-band"><h2 class="title-sm" data-slot="heading">${esc(txt(h))}</h2><p data-slot="text">${html}</p></div></div>`); }
function tableMov(el,doc,n){ const t=el.querySelector('table'); if(!t) return sec('rich-text',{section:`text-${n}`,intent:'editorial content (verbatim)',module:'rich-text',cls:'prose-block'},`  <div class="container prose">${rte(el,doc)}</div>`);
  const cap=txt(t.querySelector('caption')); const headCells=A(t,'thead th').filter(th=>!has(th,'comparison--hide-desktop')); const cols=headCells.length||1;
  const cell=td=>{ const img=td.querySelector('img'); if(img) return `<img class="cmp-icon" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||txt(td.querySelector('.visually-hidden')))}" loading="lazy" decoding="async">`; return rte(td,doc,{inner:true}); };
  const body=A(t,'tbody tr').map(tr=>{ const exp=tr.querySelector('.ffe-table__cell-expandable-content'); if(exp||has(tr,'comparison-table__expandable-content')){ const c=exp||tr.querySelector('td'); return `<tr class="cmp-detail"><td colspan="${cols}"><div class="prose">${rte(c,doc,{inner:true})}</div></td></tr>`; } const cells=[...tr.children].filter(c=>!has(c,'comparison-table--expand')&&!has(c,'comparison--hide-desktop')); return `<tr>${cells.map(c=>c.tagName==='TH'?`<th scope="row">${rte(c,doc,{inner:true})}</th>`:`<td>${cell(c)}</td>`).join('')}</tr>`; }).join('');
  return sec('table',{section:`table-${n}`,intent:'compare cover levels',module:'table',items:A(t,'tbody tr').length},`  <div class="container"><div class="table-wrap"><table class="cmp-table">${cap?`<caption>${esc(cap)}</caption>`:''}<thead><tr>${headCells.map(th=>`<th scope="col">${rte(th,doc,{inner:true})}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div></div>`); }
function stepsMov(el,doc,n){ const h=el.querySelector('.step__header h2,.step__header h3,h2'); const steps=A(el,'.step-item__wrapper'); const info=el.querySelector('.step__info'); let infoUsed=false;
  const items=steps.map(s=>{const a=s.querySelector('.step__title a'); const id=(a?.getAttribute('href')||'').replace(/^#/,''); const c=s.querySelector('.step-item__content'); let body=c?rte(c,doc):''; if(!body&&info&&!infoUsed){ body=rte(info,doc); infoUsed=true; } return `<li${id?` id="${esc(id)}"`:''}><h3 class="step-title title-sm">${a?`<a href="${hrefOf(a)}">${esc(txt(a))}</a>`:esc(txt(s.querySelector('.step__title')))}</h3>${body?`<div class="prose">${body}</div>`:''}</li>`;}).join('');
  return sec('steps',{section:`steps-${n}`,intent:'how-to steps',module:'steps',items:steps.length},`  <div class="container steps-wrap">${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}<ol class="steps" data-slot="items">${items}</ol>${info&&!infoUsed?`<div class="prose">${rte(info,doc)}</div>`:''}</div>`); }
function guideMov(el,doc,n){ const h=el.querySelector('.guide-carousel__title')||el.querySelector('h2'); const ind=el.querySelector('.guide__indicators'); const labels=A(el,'.cmp-carousel__indicators li').map(txt); const items=A(el,'.cmp-carousel__item'); return sec('guide',{section:`guide-${n}`,intent:'feature walkthrough (carousel rendered as a list)',module:'guide-list',items:items.length,media:'image',extra:' data-dynamics="carousel"'},`  <div class="container">${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}${ind?`<p class="small muted num guide-count">${esc(txt(ind))}</p>`:''}<ol class="guide-list" data-slot="items">${items.map((it,i)=>{const img=it.querySelector('img'); const t=it.querySelector('.cmp-teaser__title')||it.querySelector('h3,h2'); const d=it.querySelector('.cmp-teaser__description'); return `<li class="guide-item">${img?imgTag(img,{cls:'photo photo-sm guide-shot'}):''}<div class="guide-text"><h3 class="title-sm">${esc(txt(t))}</h3>${labels[i]?`<p class="meta"><span>${esc(labels[i])}</span></p>`:''}${d?`<div class="prose">${rte(d,doc)}</div>`:''}</div></li>`;}).join('')}</ol></div>`); }
function bioMov(el,doc,n){ const bios=A(el,'.bio'); return sec('experts',{section:`experts-${n}`,intent:'people: experts',layout:'grid',module:'people-cards',items:bios.length,media:'image'},`  <div class="container">${grid(bios.map(b=>{const img=b.querySelector('.bio__image img'); const nm=b.querySelector('.bio__name'); const org=b.querySelector('.bio__org'); const d=b.querySelector('.bio__desc'); const a=b.querySelector('.bio__link a'); const orgHtml=org?[...org.childNodes].map(nd=>nd.nodeType===3?esc(nd.textContent):(has(nd,'bio__jobtitle')?`<span class="bio-job">${esc(nd.textContent)}</span>`:esc(nd.textContent))).join('').replace(/\s+/g,' '):''; return `<li class="card bio">${img?imgTag(img,{cls:'photo photo-sm'}):''}<h3 class="card-title title-sm">${esc(txt(nm))}</h3>${org?`<p class="meta">${orgHtml}</p>`:''}${d?`<p>${rte(d,doc,{inner:true})}</p>`:''}${a?`<p><a class="btn btn-inline" href="${hrefOf(a)}">${esc(txt(a))}${icons.chevron}</a></p>`:''}</li>`;}),'bio-grid')}</div>`); }
function campaignMov(el,doc,n){ const els=A(el,'.campaign-carousel__element'); const items=els.length?els:[el]; return items.map((it,i)=>{ const img=it.querySelector('img'); const hd=it.querySelector('h1,h2,h3'); const ps=A(it,'.text-wrapper p').filter(p=>txt(p)); const btn=it.querySelector('a.ffe-button,a.ffe-inline-button'); const link=it.querySelector('a.campaign-bg__img'); const lvl=hd?.tagName==='H1'?'h1':'h2';
  return sec('campaign',{section:`campaign-${n}${items.length>1?'-'+(i+1):''}`,intent:'one offer, one action',layout:'split-media',media:'image',module:'campaign',items:1,cls:'campaign'},`  <div class="container campaign-grid">
    <figure class="campaign-media" data-slot="image">${link?`<a href="${hrefOf(link)}" aria-label="${esc(txt(hd))}">${imgTag(img,{cls:'photo'})}</a>`:imgTag(img,{cls:'photo'})}</figure>
    <div class="campaign-text">${hd?`<${lvl} class="display" data-slot="heading">${esc(txt(hd))}</${lvl}>`:''}${ps.map((p,j)=>`<p class="${j===0?'lead':'small muted'}" data-slot="text">${rte(p,doc,{inner:true})}</p>`).join('')}${btn?`<p class="campaign-cta"><a class="btn ${btnKind(cl(btn))}" data-cta="primary" data-slot="cta" href="${hrefOf(btn)}">${esc(txt(btn))}</a></p>`:''}</div>
  </div>`); }); }
function topicsMov(el,doc,n){ const img=el.querySelector('.section__header img')||el.querySelector('.section__image img'); const h=el.querySelector('.section__title')||el.querySelector('h2'); const lead=el.querySelector('.section__header .ffe-sub-lead-paragraph')||el.querySelector('.section__header p'); const items=A(el,'.section-item__wrapper'); return sec('topics',{section:`topics-${n}`,intent:'feature highlights',module:'topic-list',items:items.length},`  <div class="container topics">${img?imgTag(img,{cls:'illu topics-illu'}):''}${h?`<h2 class="section-title" data-slot="heading">${esc(txt(h))}</h2>`:''}${lead?`<p class="lead">${esc(txt(lead))}</p>`:''}<div class="faq" data-slot="items">${items.map(it=>{const b=it.querySelector('.section-item__text')||it.querySelector('button'); const c=it.querySelector('.section-item__content'); return `<details><summary><h3 class="faq-q">${esc(txt(b))}</h3>${icons.down}</summary><div class="answer">${c?leavesInline(collect(c),doc):''}</div></details>`;}).join('')}</div></div>`); }
/** Calculator static shell (dynamics #7 interim) — config-script strings by selector; the widget is the same boliglån calculator as the archetype's (same basename/config), so its screenshot-transcribed visible strings apply. */
function calcMov(el,main,doc,head,n){ const cfg=A(el,'script').map(s=>s.textContent).find(t=>/sparebank1Config/.test(t))||''; if(!cfg) return null;
  const cfgStr=k=>(cfg.match(new RegExp(k+':\\s*"([^"]*)"'))||[]).slice(1).find(Boolean)||''; const cfgNum=(block,k)=>{ const b=cfg.slice(cfg.indexOf(block)); return (b.match(new RegExp(k+':\\s*Number\\("([\\d.]+)"\\)'))||[]).slice(1).find(Boolean)||''; };
  const nok=v=>Number(v).toLocaleString('nb-NO').replace(/ /g,' ')+' kr'; const applyUrl=(cfg.slice(cfg.indexOf('howMuchLoan')).match(/applyForLoan:\s*"([^"]*)"/)||[]).slice(1).find(Boolean)||'#'; const contactUrl=(cfg.slice(cfg.indexOf('howMuchLoan')).match(/contactLoan:\s*"([^"]*)"/)||[]).slice(1).find(Boolean)||'#';
  const label=(head.match(/<h2[^>]*>([^<]*)<\/h2>/)||[]).slice(1).find(Boolean)||esc(txt(main.querySelector('h1')));
  const radio=(name,legend,vals,checked)=>`<fieldset class="calc-pills" disabled><legend class="label">${esc(legend)}</legend><div class="pill-row">${vals.map(v=>`<label class="pill${v===checked?' is-on':''}"><input type="radio" name="${name}" value="${esc(v)}"${v===checked?' checked':''} disabled><span>${esc(v)}</span></label>`).join('')}</div></fieldset>`;
  const calc=`<div class="calc" data-source="captured-screenshot:${ARCHETYPE}" data-dynamics="7" aria-disabled="true">
      <div class="calc-tabs" role="group" aria-label="${label}"><button type="button" class="calc-tab is-on" aria-pressed="true" disabled>Hvor mye kan jeg låne?</button><button type="button" class="calc-tab" aria-pressed="false" disabled>Hvor mye koster lånet?</button></div>
      <div class="calc-groups">${radio('lantakere','Antall låntakere',['1','2'],'1')}${radio('barn','Antall barn under 18 år',['0','1','2','3','4','5+'],'0')}${radio('biler','Antall biler',['0','1','2'],'0')}</div>
      <div class="calc-fields">
        <div class="field"><label class="label" for="calc-inntekt">Samlet inntekt før skatt</label><input class="input num" id="calc-inntekt" type="text" inputmode="numeric" value="${esc(nok(cfgNum('howMuchLoan','grossAnnualIncome')))}" disabled></div>
        <div class="field"><label class="label" for="calc-gjeld">Samlet lån og gjeld</label><input class="input num" id="calc-gjeld" type="text" inputmode="numeric" value="${esc(nok(cfgNum('howMuchLoan','existingLoan')))}" disabled></div>
      </div>
      <div class="calc-result"><p class="calc-result-label">Vi tror du kan låne</p><p class="calc-result-value num" aria-live="off">1 096 100 kr</p></div>
      <p class="calc-ctas"><a class="btn btn-action" data-slot="cta" href="${esc(applyUrl)}">${esc(cfgStr('loanApply'))}</a><a class="btn btn-secondary" href="${esc(contactUrl)}">${esc(cfgStr('loanContact'))}</a></p>
      <p class="calc-note">Ved å søke kan vi gi deg et tilbud med svar på nøyaktig hvor mye du kan låne, og hva det vil koste. Det er helt uforpliktende å søke lån hos oss.</p>
      <p class="calc-note num">Priseksempel: Nominell rente 5,33 %. Effektiv rente 5,56 %. Låner du 1 096 100 over 25 år koster lånet 906 457 og du betaler totalt 2 002 557 kroner.</p>
    </div>`;
  const headHtml=head.replace(/<h2>/,'<h2 class="section-title" data-slot="heading">');
  return sec('calculator',{section:`calculator-${n}`,intent:'estimate borrowing capacity (interim static shell)',module:'calculator',extra:' data-dynamics="7"',cls:'calculator'},`  <div class="container calc-wrap">${headHtml}${calc}</div>`); }

/* ── columns-grid classification ── */
function classifyGrid(el){ const wrap=el.querySelector(':scope > .columns-grid__wrap')||el; const g=wrap.querySelector(':scope > .ffe-grid')||wrap; const rows=[...g.children].filter(r=>has(r,'columns-grid__row')).map(r=>[...r.children].filter(c=>has(c,'columns-grid__column')).map(c=>({el:c,leaves:collect(c)})).filter(c=>c.leaves.length)).filter(r=>r.length);
  const isHead=c=>c.leaves.every(l=>l.k==='heading'||l.k==='inline'||(l.k==='text'&&!l.el.querySelector('img,a.ffe-button,a.ffe-inline-button')))&&c.leaves.some(l=>l.k==='heading'||(l.k==='text'&&l.el.querySelector('h1,h2,h3,h4')));
  let head=null; if(rows.length>1&&rows[0].length===1&&isHead(rows[0][0])&&!rows[0][0].el.querySelector('h1')) head=rows[0][0];
  const body=(head?rows.slice(1):rows).flat(); const cols=rows.flat();
  const hasH1=cols.some(c=>c.el.querySelector('h1')); const allCards=body.length>0&&body.every(c=>c.leaves.every(l=>l.k==='card'||l.k==='visual-nav')); const isMedia=c=>c.leaves.every(l=>l.k==='image'||l.k==='video'); const split=body.length===2&&isMedia(body[0])!==isMedia(body[1]);
  return {cols,head,body,type:hasH1?'hero':allCards?'cards':split?'split':body.length===1?'single':'columns'}; }
const leavesInline=(leaves,doc)=>leaves.map(b=>leafInline(b,doc)).join('');
const colsHtml=(cols,doc)=>cols.length===1?leavesInline(cols[0].leaves,doc):`<div class="cols cols-${Math.min(cols.length,4)}">${cols.map(c=>`<div class="col">${leavesInline(c.leaves,doc)}</div>`).join('')}</div>`;
function leafInline(b,doc){ const {k,el}=b; switch(k){
  case 'image': { const img=el.querySelector('img'); if(!img) return ''; const a=img.closest('a'); const t=imgTag(img); return `<figure class="media">${a&&el.contains(a)?`<a href="${hrefOf(a)}" aria-label="${esc(img.getAttribute('alt')||a.getAttribute('href'))}">${t}</a>`:t}</figure>`; }
  case 'card': return `<ul class="choice-grid grid-1">${cardLi(el,doc)}</ul>`;
  case 'visual-nav': return `<ul class="choice-grid grid-1">${navLi(el,doc)}</ul>`;
  case 'video': return videoHtml(el);
  case 'tip': return calloutHtml(el,doc);
  case 'progressive-disclosure': return disclosureHtml(el,doc);
  case 'price-and-terms': return priceTermsInner(el,doc);
  case 'usp': return uspList(el,doc);
  case 'product-nav': return quickLinksHtml(el);
  case 'banner-small': return promoArticle(el,doc);
  case 'columns-grid': { const c=classifyGrid(el); return (c.head?leavesInline(c.head.leaves,doc):'')+colsHtml(c.body,doc); }
  default: return rte(el,doc);
} }
const hoistH2=(html,cls)=>html.replace(/<h([2-6])>/,`<h2${cls?` class="${cls}"`:''} data-slot="heading">`).replace(/<\/h[2-6]>/,'</h2>');
function cardsMov(c,doc,n){ const cards=c.body.flatMap(col=>col.leaves); const head=c.head?hoistH2(leavesInline(c.head.leaves,doc),'section-title').replace('<p>','<p class="lead section-lede">'):''; return sec('cards',{section:`cards-${n}`,intent:'route by task',layout:'grid',module:'card-rail',media:'image',items:cards.length},`  <div class="container">${head}${grid(cards.map(l=>l.k==='visual-nav'?navLi(l.el,doc):cardLi(l.el,doc)),'choice-grid')}</div>`); }
function splitMov(c,doc,n){ const [a,b]=c.body; const isMedia=x=>x.leaves.every(l=>l.k==='image'||l.k==='video'); const mediaFirst=isMedia(a); const media=mediaFirst?a:b; const text=mediaFirst?b:a; const body=hoistH2((c.head?leavesInline(c.head.leaves,doc):'')+leavesInline(text.leaves,doc));
  return sec('split',{section:`split-${n}`,intent:'explain with media',layout:'split-media',media:'image',module:'split-media',cls:mediaFirst?'':'media-right'},`  <div class="container q-grid">
    <div class="q-media" data-slot="image">${leavesInline(media.leaves,doc)}</div>
    <div class="q-text prose" data-slot="text">${body}</div>
  </div>`); }
function columnsMov(c,doc,n){ const head=c.head?hoistH2(leavesInline(c.head.leaves,doc),'section-title').replace('<p>','<p class="lead section-lede">'):''; return sec('columns',{section:`columns-${n}`,intent:'editorial columns (verbatim)',layout:'grid',module:'content-columns',items:c.body.length},`  <div class="container">${head}${colsHtml(c.body,doc)}</div>`); }
/* ── hero: the block carrying the h1 plus the absorbed intro blocks (buttons, lead text, usp, hero image) ── */
function heroMov(els,ctx){ const {doc}=ctx; const inCard=x=>x.closest('.card,.usp,.bank-choice-overlay,.visual-nav,.tip');
  const h1=els.map(e=>e.tagName==='H1'?e:e.querySelector('h1')).find(Boolean);
  const img=els.flatMap(e=>A(e,'img')).find(i=>!inCard(i)&&!/arrow|chevron/.test(imgSrc(i)));
  const seen=new Set(); const ctas=els.flatMap(e=>A(e,'a.ffe-button,a.ffe-inline-button')).filter(a=>!inCard(a)).filter(a=>{const k=hrefOf(a)+'|'+txt(a); if(seen.has(k)) return false; seen.add(k); return true;});
  const uspEls=els.flatMap(e=>has(e,'usp')?[e]:A(e,'.usp'));
  const texts=els.flatMap(e=>has(e,'text')?[e]:A(e,'.text').filter(t=>!inCard(t)));
  let lead=texts.map(t=>{ const c=t.cloneNode(true); for(const x of A(c,'h1,a.ffe-button,a.ffe-inline-button,.button,.button-list-container')) x.remove(); return rte(c,doc); }).join('');
  lead+=els.filter(e=>/^(P|UL|OL)$/.test(e.tagName)).map(e=>rte(e,doc)).join('');
  lead=lead.replace('<p>','<p class="lead" data-slot="text">');
  const back=ctx.back?`<p class="backlink-row"><a class="backlink" href="${hrefOf(ctx.back)}">${icons.back}<span>${esc(txt(ctx.back))}</span></a></p>`:''; ctx.backUsed=true;
  const ctaHtml=ctas.length?`<p class="cta-row">${ctas.map((a,i)=>btnA(a,`${i===0?' data-cta="primary"':''} data-slot="cta"`)).join('')}</p>`:'';
  const uspHtml=uspEls.map(u=>uspList(u,doc)).join('');
  const h1Html=`<h1 data-slot="heading">${esc(txt(h1))}</h1>`;
  if(img) return sec('hero',{section:'hero',intent:'name the product, one action',layout:'split-media',media:'image',module:'product-hero',cls:'hero'},`  <div class="container">${back}<div class="hero-grid"><div class="hero-text">${h1Html}${lead}${ctaHtml}${uspHtml}</div><figure class="hero-media" data-slot="image">${imgTag(img,{cls:isSvg(imgSrc(img))?'illu hero-illu':'photo',eager:true})}</figure></div></div>`);
  return sec('hero',{section:'hero',intent:'name the page',module:'page-title',cls:'hero intro'},`  <div class="container intro-text">${back}${h1Html}${lead}${ctaHtml}${uspHtml}</div>`); }

function fixH1(html){ const n=(html.match(/<h1[\s>]/g)||[]).length; if(n===0) return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/,'<h1$1>$2</h1>'); if(n>1){ let i=0; return html.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/g,(m,a,b)=>{ i++; return i===1?m:`<h2${a}>${b}</h2>`; }); } return html; }
/* ── the walker ── */
export function renderSibling(data,opts={}){
  const {doc,pj,slug}=data; const family=opts.family||'product'; const template=opts.template||(family==='market-landing'?'landing':'program');
  const main=doc.querySelector('main'); const blocks=collect(main);
  const ctx={doc,slug,family,back:null,backUsed:false,heroDone:false,rich:0,mapped:{}}; const mark=k=>{ctx.mapped[k]=(ctx.mapped[k]||0)+1;};
  const movs=[]; let prose=[]; let n=0;
  const richMov=html=>{ ctx.rich++; return sec('rich-text',{section:`text-${++n}`,intent:'editorial content (verbatim)',module:'rich-text',cls:'prose-block'},`  <div class="container prose">${html}</div>`); };
  const flush=()=>{ if(!prose.length) return; const html=leavesInline(prose,doc); for(const b of prose) mark(b.k+'-rich-text'); prose=[]; if(html.trim()) movs.push(richMov(html)); };
  for(let i=0;i<blocks.length;i++){ const b=blocks[i]; const {k,el}=b;
    if(k==='to-parent'){ ctx.back=el.querySelector('a'); mark('to-parent-backlink'); continue; }
    if(k==='heading'&&el.tagName==='H1'&&has(el,'visually-hidden')){ flush(); movs.push({kind:'h1',html:()=>`<h1 class="visually-hidden">${esc(txt(el))}</h1>`}); ctx.heroDone=true; mark('h1-visually-hidden'); continue; }
    const hasH1=el.tagName==='H1'||!!el.querySelector('h1');
    if(hasH1&&!ctx.heroDone&&k!=='campaign'&&k!=='campaign-carousel'){ flush(); const gathered=[el]; let j=i+1; let gotImg=!!el.querySelector('img');
      while(j<blocks.length){ const nb=blocks[j]; const nk=nb.k; let ok=['button','button-list-container','usp','inline'].includes(nk)||(nk==='text'&&!nb.el.querySelector('h1,h2,h3,h4'))||(nk==='image'&&!gotImg);
        if(!ok&&nk==='columns-grid'&&!nb.el.querySelector('h1,h2,h3,h4')){ const c=classifyGrid(nb.el); ok=(c.type==='split'&&!gotImg)||(c.type==='single'&&c.body[0].leaves.every(l=>['text','button','button-list-container','inline','usp'].includes(l.k))); }
        if(!ok) break; if(nb.el.querySelector('img')) gotImg=true; gathered.push(nb.el); j++; }
      movs.push(heroMov(gathered,ctx)); ctx.heroDone=true; mark(k+'-hero'); i=j-1; continue; }
    switch(k){
      case 'columns-grid': { flush(); const c=classifyGrid(el); mark('columns-grid-'+c.type);
        if(c.type==='cards') movs.push(cardsMov(c,doc,++n)); else if(c.type==='split') movs.push(splitMov(c,doc,++n)); else if(c.type==='single'){ if(c.head) prose.push(...c.head.leaves); prose.push(...c.body[0].leaves); flush(); } else if(c.body.length) movs.push(columnsMov(c,doc,++n)); break; }
      case 'visual-nav': { flush(); const group=[el]; while(i+1<blocks.length&&blocks[i+1].k==='visual-nav') group.push(blocks[++i].el); mark('visual-nav-card-rail'); movs.push(sec('cards',{section:`nav-${++n}`,intent:'route by product',layout:'grid',module:'card-rail',media:'image',items:group.length},`  <div class="container">${grid(group.map(g=>navLi(g,doc)),'choice-grid')}</div>`)); break; }
      case 'card': flush(); mark('card-card-rail'); movs.push(sec('cards',{section:`cards-${++n}`,intent:'route by task',layout:'grid',module:'card-rail',items:1},`  <div class="container">${grid([cardLi(el,doc)],'choice-grid')}</div>`)); break;
      case 'usp': flush(); mark('usp'); movs.push(sec('usp',{section:`usp-${++n}`,intent:'key selling points',module:'usp',items:A(el,'.usp-item').length},`  <div class="container">${uspList(el,doc)}</div>`)); break;
      case 'price-and-terms': flush(); mark(k); movs.push(priceTermsMov(el,doc,++n)); break;
      case 'prices': flush(); mark(k); movs.push(pricesMov(el,doc,++n)); break;
      case 'cobranding': flush(); mark(k); movs.push(cobrandMov(el,doc,++n)); break;
      case 'banner-small': flush(); mark('banner-small-promo-band'); movs.push(sec('promo',{section:`promo-${++n}`,intent:'invite',module:'promo-band',items:1},`  <div class="container">${promoArticle(el,doc)}</div>`)); break;
      case 'tip': flush(); mark('tip-callout'); movs.push(sec('tip',{section:`tip-${++n}`,intent:'offer / advice',module:'callout'},`  <div class="container">${calloutHtml(el,doc)}</div>`)); break;
      case 'faq': flush(); mark(k); movs.push(faqMov(el,doc,++n)); break;
      case 'accordion': flush(); mark(k); movs.push(accMov(el,doc,++n)); break;
      case 'related-products': case 'static-cards': flush(); mark(k+'-card-rail'); movs.push(linkCardsMov(el,doc,++n)); break;
      case 'related-topics': flush(); mark(k+'-card-rail'); movs.push(tipsMov(el,doc,++n)); break;
      case 'shortcuts': flush(); mark(k); movs.push(shortcutsMov(el,doc,++n)); break;
      case 'feedback': flush(); mark(k); movs.push(feedbackMov(el)); break;
      case 'comparison': flush(); mark('comparison-table'); movs.push(tableMov(el,doc,++n)); break;
      case 'step-by-step': flush(); mark(k+'-steps'); movs.push(stepsMov(el,doc,++n)); break;
      case 'guide-carousel': flush(); mark(k+'-guide-list'); movs.push(guideMov(el,doc,++n)); break;
      case 'contentfragmentlist': flush(); mark(k+'-people-cards'); movs.push(bioMov(el,doc,++n)); break;
      case 'campaign': case 'campaign-carousel': flush(); mark(k); movs.push(...campaignMov(el,doc,++n)); if(el.querySelector('h1')) ctx.heroDone=true; break;
      case 'product-nav': flush(); mark(k+'-quick-links'); movs.push(sec('quick-links',{section:`quick-links-${++n}`,intent:'self-service entry points',layout:'grid',module:'quick-links',items:A(el,'.product-nav__item').length},`  <div class="container">${quickLinksHtml(el)}</div>`)); break;
      case 'section': flush(); mark('section-topic-list'); movs.push(topicsMov(el,doc,++n)); break;
      case 'calculator-loan': { let head=''; if(prose.length&&prose.every(x=>x.k==='text'&&!x.el.querySelector('img,a.ffe-button'))){ head=prose.map(x=>rte(x.el,doc)).join(''); prose=[]; } else flush(); mark(k+'-calculator'); const m=calcMov(el,main,doc,head,++n); if(m) movs.push(m); else if(head) movs.push(richMov(head)); break; }
      case 'text': { const h=el.querySelector('h2,h3'); if(h&&/^Sammenlign priser$/i.test(txt(h))&&A(el,'p').length===1){ flush(); mark('text-cta-band'); movs.push(compareMov(el,doc)); break; } prose.push(b); break; }
      default: prose.push(b);
    }
  }
  flush();
  // paper tints: ≤ 2 tinted movements, never adjacent, never the same tint twice
  const prio=opts.tintPriority||(family==='market-landing'?['campaign','cards','promo','quick-links','price-terms']:['cards','price-terms','prices','calculator','cobranding','campaign','promo','guide']);
  const tints=family==='market-landing'?['syrin','sand']:['sand','frost']; const tinted=new Set();
  for(const kind of prio){ if(tinted.size>=2) break; for(let idx=0;idx<movs.length;idx++){ const m=movs[idx]; if(m.kind!==kind||tinted.has(idx)||tinted.has(idx-1)||tinted.has(idx+1)) continue; m.paper=tints[tinted.size]; tinted.add(idx); break; } }
  let mainHtml=movs.map(m=>m.html(m.paper||null)).join('\n');
  if(ctx.back&&!ctx.backUsed) mainHtml=`<section class="movement intro" data-section="intro" data-intent="back link" data-layout="contained" data-module="page-title">\n  <div class="container"><p class="backlink-row"><a class="backlink" href="${hrefOf(ctx.back)}">${icons.back}<span>${esc(txt(ctx.back))}</span></a></p></div>\n</section>\n`+mainHtml;
  mainHtml=fixH1(mainHtml); if(!/loading="eager"/.test(mainHtml)) mainHtml=mainHtml.replace(/loading="lazy"/,'loading="eager" fetchpriority="high"');
  return { template, title:pj.title, description:pj.metaDescription, main:mainHtml, css:CSS+SIB_CSS,
    provenance:{ shapeBrief:`stardust/prototypes/${opts.archetype||ARCHETYPE}-shape.md`, renderer:'Path A′ component walker (renderSibling) — captured components mapped to the archetype modules, verbatim rich-text fallback', mappedComponents:ctx.mapped, richTextFallbacks:ctx.rich, unsourcedContent:[], canonDeviations:[] } };
}
/* ── CSS for the sibling shapes (appended after the archetype CSS; never reaches the archetype output) ── */
const SIB_CSS=`
/* Path A′ sibling shapes */
.intro{padding-top:var(--spacing-md)}.intro-text{display:grid;gap:var(--spacing-md);max-width:44rem}.intro-text>*{margin-top:0}
.hero-text>*{margin-top:0}.hero-text .cta-row{margin-top:0}.hero-illu{width:min(100%,420px);height:auto;justify-self:center}
.usp-list{display:grid;gap:var(--spacing-sm);list-style:none;padding:0}.check-list{display:grid;gap:var(--spacing-sm);max-width:68ch;list-style:none;padding:0}
.usp-list li,.check-list li{position:relative;padding-left:1.75rem;color:var(--koksgraa)}
.usp-list li::before,.check-list li::before{content:"";position:absolute;left:.25rem;top:.2em;width:.45rem;height:.85rem;border:solid var(--vann);border-width:0 2px 2px 0;transform:rotate(45deg)}
.prose-block .container{display:grid;gap:var(--spacing-md)}.prose-block .container>*{margin-top:0}
.prose .media{margin:0}.prose .photo{max-width:100%}.prose .illu{max-width:360px;height:auto}.prose table{border-collapse:collapse}.prose td,.prose th{padding:8px 12px;border-bottom:1px solid var(--lysgraa);text-align:left}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm) var(--spacing-md)}
.cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--spacing-xl)}.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
.col{display:grid;gap:var(--spacing-md);align-content:start;max-width:68ch}.col>*{margin-top:0}
.section-lede{margin:calc(-1*var(--spacing-md)) 0 var(--spacing-lg);max-width:68ch}
.grid-1{grid-template-columns:minmax(0,1fr)!important;max-width:36rem}.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))!important}.grid-3{grid-template-columns:repeat(3,minmax(0,1fr))!important}
.choice>*{margin-top:0}.card-illu{width:100%;max-width:220px;height:auto;margin-bottom:8px}
.link-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-md)}
.link-card{display:grid;grid-template-columns:48px 1fr;gap:var(--spacing-sm) var(--spacing-md);align-items:center;padding:var(--spacing-md) var(--spacing-lg)}.link-card .card-icon{width:48px;height:48px}.link-card .card-title{font-size:var(--lead)}.link-card>*:not(.card-icon){grid-column:2}
.media-right .q-grid{grid-template-columns:7fr 5fr}.media-right .q-media{order:2}.q-text.prose>*{margin-top:0}.q-text.prose .cta-row{margin-top:var(--spacing-xs)}
.promo-solo{margin-top:0;padding-top:0;border-top:0}.promo-extra{width:120px;height:auto}
.cobrand{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:start}.cobrand-main{display:grid;gap:var(--spacing-md)}.cobrand-main>*{margin-top:0}.cobrand-logo{width:72px;height:auto}.cobrand-side{display:grid;gap:var(--spacing-md);align-content:start}.cobrand-side>*{margin-top:0}.cobrand-illu{width:min(100%,260px);height:auto}
.shortcut-list{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);list-style:none;padding:0}
.disclosure{border-top:1px solid var(--lysgraa);border-bottom:1px solid var(--lysgraa)}.disclosure>summary{display:flex;align-items:center;gap:8px;padding:var(--spacing-md) 0;cursor:pointer;list-style:none;color:var(--vann)}.disclosure>summary::-webkit-details-marker{display:none}.disclosure>summary svg{width:20px;height:20px;stroke:currentColor}.disclosure[open]>summary svg{transform:rotate(180deg)}.disclosure>.prose{padding-bottom:var(--spacing-lg)}
.steps{display:grid;gap:var(--spacing-lg);max-width:52rem;counter-reset:step;list-style:none;padding:0}.steps>li{display:grid;grid-template-columns:44px 1fr;gap:var(--spacing-sm) var(--spacing-md);counter-increment:step}.steps>li::before{content:counter(step);display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--frost-30);color:var(--fjell);font-family:var(--title-font-family)}.steps .step-title,.steps .prose{grid-column:2}
.guide-list{display:grid;gap:var(--spacing-xl);list-style:none;padding:0}.guide-item{display:grid;grid-template-columns:5fr 7fr;gap:var(--spacing-xl);align-items:center}.guide-text{display:grid;gap:var(--spacing-sm)}.guide-text>*{margin-top:0}.guide-shot{max-width:360px}.guide-count{margin:calc(-1*var(--spacing-md)) 0 var(--spacing-lg)}
.bio-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-lg)}.bio>*{margin-top:0}.bio-job{display:block;color:var(--fjell)}
.quick-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-md);list-style:none;padding:0}.quick-links li{display:grid;grid-template-columns:40px 1fr;gap:var(--spacing-md);align-items:center;padding:var(--spacing-md) var(--spacing-lg);background:#fff;border:1px solid var(--lysgraa);border-radius:8px}.ql-icon{width:40px;height:40px}.quick-links a{display:block;padding:10px 0;font-family:var(--title-font-family);text-decoration:none}.quick-links a:hover{text-decoration:underline}
.table-wrap{overflow-x:auto}.cmp-table{width:100%;border-collapse:collapse;min-width:640px}.cmp-table th,.cmp-table td{padding:12px 16px;text-align:left;vertical-align:top;border-bottom:1px solid var(--lysgraa)}.cmp-table thead th{font-family:var(--title-font-family);color:var(--fjell)}.cmp-table td{text-align:center}.cmp-table th[scope=row]{font-weight:normal;color:var(--koksgraa)}.cmp-icon{width:24px;height:24px;display:inline-block}.cmp-detail td{text-align:left;background:var(--sand-30)}
.topics{display:grid;gap:var(--spacing-md)}.topics>*{margin-top:0}.topics .section-title{margin-bottom:0}.topics-illu{width:120px;height:auto}.topics .faq{max-width:52rem}.faq .answer .cols{margin-top:var(--spacing-md)}.faq .answer .cta-row{margin-top:var(--spacing-md)}
.video-link .btn svg{width:20px;height:20px}
.campaign-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}.campaign-media{margin:0}.campaign-media a{display:block}.campaign-text{display:grid;gap:var(--spacing-md);max-width:34rem}.campaign-text>*{margin-top:0}.campaign-text .display{max-width:14ch}.campaign-cta{margin-top:var(--spacing-sm)}
.faq-wrap .lead{margin:calc(-1*var(--spacing-md)) 0 var(--spacing-lg);max-width:68ch}
.price-terms{display:grid;gap:var(--spacing-lg);justify-items:start}.price-terms>*{margin-top:0}.price-terms .section-title{margin-bottom:0}
.only-desktop{display:inline-flex}
.usp-icons li{display:grid;grid-template-columns:56px 1fr;gap:var(--spacing-md);padding-left:0;align-items:center}.usp-icons li::before{display:none}.usp-icon{width:56px;height:56px}.usp-text>*{margin-top:0}
.q-media .media{margin:0}.cards-foot{margin-top:var(--spacing-lg)}.price-note{color:var(--koksgraa)}
.prose table,.answer table{display:block;max-width:100%;overflow-x:auto;border-collapse:collapse}.answer td,.answer th{padding:6px 10px;border-bottom:1px solid var(--lysgraa);text-align:left;vertical-align:top}
.choice,.tips-grid .card,.link-card,.bio,.guide-item,.quick-links li,.usp-icons li{min-width:0}.card-title{overflow-wrap:anywhere}
@media (max-width:640px){.choice{grid-template-columns:38% minmax(0,1fr)}.choice.link-card{grid-template-columns:40px minmax(0,1fr)}}
.col,.choice-grid,.choice-grid>li,.tips-grid>li,.link-cards>li,.q-text,.hero-text,.cobrand-main,.cobrand-side{min-width:0}
@media (max-width:640px){.cols,.cols-3,.cols-4,.link-cards,.bio-grid,.quick-links,.choice-grid,.tips-grid{grid-template-columns:minmax(0,1fr)!important}}
@media (max-width:1023px){.cols,.cols-3,.cols-4{grid-template-columns:1fr 1fr}.link-cards,.bio-grid,.quick-links{grid-template-columns:1fr 1fr}.cobrand{grid-template-columns:1fr}.guide-item{grid-template-columns:1fr}.media-right .q-grid{grid-template-columns:1fr}.grid-3{grid-template-columns:1fr 1fr!important}}
@media (max-width:640px){.cols,.cols-3,.cols-4,.link-cards,.bio-grid,.quick-links{grid-template-columns:1fr}.grid-2,.grid-3{grid-template-columns:1fr!important}.link-card{grid-template-columns:40px 1fr}.cmp-table{min-width:560px}.steps>li{grid-template-columns:36px 1fr}.steps>li::before{width:36px;height:36px}.shortcut-list .btn{flex:1 1 100%}.campaign-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.campaign-text{max-width:none}}
`;
