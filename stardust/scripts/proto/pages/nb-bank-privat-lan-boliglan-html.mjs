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

export function render({doc,pj}){
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
  const cfgStr=k=>(cfg.match(new RegExp(k+':\\s*"([^"]*)"'))||[])[1]||'';
  const cfgNum=(block,k)=>{ const b=cfg.slice(cfg.indexOf(block)); return (b.match(new RegExp(k+':\\s*Number\\("([\\d.]+)"\\)'))||[])[1]||''; };
  const nok=n=>Number(n).toLocaleString('nb-NO').replace(/ /g,' ')+' kr';
  const applyUrl=(cfg.slice(cfg.indexOf('howMuchLoan')).match(/applyForLoan:\s*"([^"]*)"/)||[])[1]; const contactUrl=(cfg.slice(cfg.indexOf('howMuchLoan')).match(/contactLoan:\s*"([^"]*)"/)||[])[1];
  const faq=main.querySelector(':scope > .faq'); const faqH=faq.querySelector('.title h2'); const faqItems=[...faq.querySelectorAll('.faq-item')]; const moreBtn=faq.querySelector('button.faq-button--more');
  const rel=main.querySelector(':scope > .related-topics'); const relH=rel.querySelector('h2'); const relCards=[...rel.querySelectorAll('.card')];
  const fbH=main.querySelector(':scope > .feedback h2');
  const cmp=main.querySelector(':scope > .referance, :scope > .reference'); const cmpH=cmp.querySelector('h2'); const cmpP=cmp.querySelector('p');

  const heroCtas=heroBtns.map((a,i)=>`<a class="btn ${btnKind(a.getAttribute('class'))}"${i===0?' data-cta="primary"':''} data-slot="cta" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('');
  const choices=choiceCards.map(c=>{const img=c.querySelector('img'); const a=c.querySelector('a.card__title'); const p=c.querySelector('p'); return `<li class="card choice"><img class="photo photo-sm" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}" width="1280" height="853" loading="lazy" decoding="async"><h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p>${esc(norm(p.textContent))}</p></li>`;}).join('');
  const prices=priceCards.map(c=>{const a=c.querySelector('a.card__title'); const p=c.querySelector('p'); return `<li class="card price-card"><h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p>${esc(norm(p.textContent))}</p></li>`;}).join('');
  const faqItem=(it)=>{const h=norm(it.querySelector('h3').textContent); const body=it.querySelector('.ffe-accordion-item__body'); return `<details><summary><h3 class="faq-q">${esc(h)}</h3>${icons.down}</summary><div class="answer prose">${faqBody(body,doc)}</div></details>`;};
  const shown=faqItems.filter(i=>!/non-highlighted/.test(i.getAttribute('class'))); const hiddenItems=faqItems.filter(i=>/non-highlighted/.test(i.getAttribute('class')));
  const tips=relCards.map(c=>{const img=c.querySelector('img'); const a=c.querySelector('a.card__title'); const tag=norm(c.querySelector('.card__tag')?.textContent); return `<li class="card"><img class="photo photo-sm" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}"${img.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1280" height="853" loading="lazy" decoding="async"><h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3>${tag?`<p class="meta"><span>${esc(tag)}</span></p>`:''}</li>`;}).join('');
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
<section class="movement hero" data-section="hero" data-intent="name the product, one action" data-layout="split-media" data-media="image" data-module="product-hero">
  <div class="container">
    <p class="backlink-row"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}<span>${esc(norm(back.textContent))}</span></a></p>
    <div class="hero-grid">
      <div class="hero-text">
        <h1 data-slot="heading">${esc(norm(h1.textContent))}</h1>
        <p class="lead" data-slot="text">${esc(norm(lead.textContent))}</p>
        <p class="cta-row">${heroCtas}</p>
      </div>
      <figure class="hero-media" data-slot="image"><img class="photo" src="${asset(imgSrc(heroImg))}" alt="${esc(heroImg.getAttribute('alt')||'')}" width="1200" height="800" loading="eager" fetchpriority="high" decoding="async"></figure>
    </div>
  </div>
</section>
<section class="movement paper-sand choices" data-section="choices" data-intent="route by task" data-layout="grid" data-items="${choiceCards.length}" data-module="card-rail" data-media="image">
  <div class="container">
    <h2 class="section-title" data-slot="heading">${esc(norm(choicesH.textContent))}</h2>
    <ul class="choice-grid" data-slot="cards">${choices}</ul>
    <article class="promo" data-module="promo-band">
      <img class="promo-illu" src="${asset(imgSrc(bImg))}" alt="" aria-hidden="true" width="200" height="150" loading="lazy" decoding="async">
      <div class="promo-text"><h2 class="title-sm" data-slot="heading">${esc(norm(bH.textContent))}</h2><p data-slot="text">${esc(norm(bP.textContent))}</p><p><a class="btn ${btnKind(bA.getAttribute('class'))}" data-slot="cta" href="${esc(bA.getAttribute('href'))}">${esc(norm(bA.textContent))}</a></p></div>
    </article>
  </div>
</section>
<section class="movement questions" data-section="questions" data-intent="offer adviser contact" data-layout="split-media" data-media="image" data-module="split-media">
  <div class="container q-grid">
    <figure class="q-media" data-slot="image"><img class="photo photo-sm" src="${asset(imgSrc(qImg))}" alt="${esc(qImg.getAttribute('alt')||'')}"${qImg.getAttribute('aria-hidden')==='true'?' aria-hidden="true"':''} width="1200" height="800" loading="lazy" decoding="async"></figure>
    <div class="q-text"><h2 data-slot="heading">${esc(norm(qH.textContent))}</h2><p class="lead" data-slot="text">${esc(norm(qP.textContent))}</p><p><a class="btn ${btnKind(qA.getAttribute('class'))}" data-slot="cta" href="${esc(qA.getAttribute('href'))}">${esc(norm(qA.textContent))}</a></p></div>
  </div>
</section>
<section class="movement prices" data-section="prices" data-intent="choose a loan variant; regulatory price example" data-layout="grid" data-items="${priceCards.length}" data-module="price-cards">
  <div class="container">
    <h2 class="section-title" data-slot="heading">${esc(norm(prH.textContent))}</h2>
    <ul class="price-grid" data-slot="cards">${prices}</ul>
    <div class="price-foot"><p><a class="btn ${btnKind(prA.getAttribute('class'))}" data-slot="cta" href="${esc(prA.getAttribute('href'))}">${esc(norm(prA.textContent))}</a></p><p class="num price-example" data-slot="text">${esc(norm(prP.textContent))}</p></div>
  </div>
</section>
<section class="movement paper-frost calculator" data-section="calculator" data-intent="estimate borrowing capacity (interim static shell)" data-layout="contained" data-module="calculator" data-dynamics="7">
  <div class="container calc-wrap">
    <h2 class="section-title" data-slot="heading">${esc(norm(calcH.textContent))}</h2>
    ${calc}
  </div>
</section>
<section class="movement faq-section" data-section="faq" data-intent="answer common questions" data-layout="contained" data-items="${faqItems.length}" data-module="faq">
  <div class="container faq-wrap">
    <h2 class="section-title" data-slot="heading">${esc(norm(faqH.textContent))}</h2>
    <div class="faq" data-slot="items">
      ${shown.map(faqItem).join('\n      ')}
      <details class="faq-more"><summary class="btn-inline">${esc(norm(moreBtn.textContent))}${icons.down}</summary><div class="faq faq-more-items">${hiddenItems.map(faqItem).join('\n      ')}</div></details>
    </div>
  </div>
</section>
<section class="movement related" data-section="related" data-intent="cross-link: advice" data-layout="grid" data-items="${relCards.length}" data-module="card-rail" data-media="image">
  <div class="container">
    <h2 class="section-title" data-slot="heading">${esc(norm(relH.textContent))}</h2>
    <ul class="tips-grid" data-slot="cards">${tips}</ul>
  </div>
</section>
<section class="feedback" data-section="feedback" data-intent="page feedback (static)" data-layout="contained" data-module="feedback" data-dynamics="5">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(norm(fbH.textContent))}</h2><div class="feedback-btns"><button class="btn btn-secondary" type="button">${icons.thumbUp}<span class="visually-hidden">Ja</span></button><button class="btn btn-secondary" type="button">${icons.thumbDown}<span class="visually-hidden">Nei</span></button></div></div>
</section>
<section class="movement compare" data-section="compare" data-intent="regulatory: compare prices" data-layout="contained" data-module="cta-band">
  <div class="container"><div class="cta-band"><h2 class="title-sm" data-slot="heading">${esc(norm(cmpH.textContent))}</h2><p data-slot="text">${cmpHtml}</p></div></div>
</section>`;

  const css=`
.hero{padding-top:var(--spacing-md)}
.backlink-row{margin:0 0 var(--spacing-sm)}
.hero-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}
.hero-media{margin:0;grid-column:1;grid-row:1}.hero-text{grid-column:2;grid-row:1;display:grid;gap:var(--spacing-md);max-width:34rem}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm) var(--spacing-md);margin-top:var(--spacing-sm)}
.section-title{margin-bottom:var(--spacing-lg)}.section-title.centered{text-align:center}
.choice-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg)}
.choice{background:transparent;padding:0;border-radius:0}.choice:hover,.choice:focus-within{box-shadow:none}.choice .photo{margin-bottom:8px}
.card-title{font-family:var(--title-font-family);font-size:var(--title)}.card p{color:var(--koksgraa)}
.promo{display:grid;grid-template-columns:auto 1fr;gap:var(--spacing-lg);align-items:center;margin-top:var(--spacing-xl);padding-top:var(--spacing-xl);border-top:1px solid var(--lysgraa)}
.promo-illu{width:180px;height:auto}.promo-text{display:grid;gap:var(--spacing-sm);max-width:44rem}.promo-text .btn{margin-top:var(--spacing-xs)}
.q-grid{display:grid;grid-template-columns:5fr 7fr;gap:var(--spacing-xl);align-items:center}
.q-media{margin:0}.q-text{display:grid;gap:var(--spacing-md);max-width:38rem}.q-text .btn{margin-top:var(--spacing-xs)}
.price-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:var(--spacing-lg)}
.price-card{gap:8px;align-content:start;padding:var(--spacing-md) var(--spacing-lg)}.price-card .card-title{font-size:var(--lead);line-height:1.25;overflow-wrap:anywhere;hyphens:auto}
.price-foot{display:grid;gap:var(--spacing-md);justify-items:start;margin-top:var(--spacing-xl)}
.price-example{max-width:68ch}
/* calculator — static shell (dynamics #7 interim): controls disabled, captured strings */
.calc{display:grid;gap:var(--spacing-lg);width:min(100%,44rem);justify-items:start;text-align:left}
.calc-tabs{display:inline-flex;padding:4px;background:#fff;border:1px solid var(--graa);border-radius:var(--radius-pill)}
.calc-tab{min-height:40px;padding:8px 20px;border:0;border-radius:var(--radius-pill);background:transparent;color:var(--fjell);font:var(--body)/1.2 var(--body-font-family);cursor:not-allowed}
.calc-tab{color:var(--moerkgraa)}.calc-tab.is-on{background:var(--lysgraa);color:var(--koksgraa)}
.calc-groups{display:flex;flex-wrap:wrap;gap:var(--spacing-md) var(--spacing-xl)}
.calc-pills{margin:0;padding:0;border:0;display:grid;gap:8px;justify-items:start}
.calc-pills legend{padding:0;margin-bottom:8px;color:var(--fjell)}
.pill-row{display:flex;flex-wrap:wrap;gap:8px}
.pill{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;padding:0 12px;border:1px solid var(--graa);border-radius:var(--radius-pill);background:#fff;color:var(--moerkgraa);font-family:var(--title-font-family);cursor:not-allowed}
.pill input{position:absolute;opacity:0;width:1px;height:1px;margin:0}.pill.is-on{background:var(--lysgraa);border-color:var(--graa);color:var(--koksgraa)}
.calc-fields{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md);width:min(100%,32rem)}
.field{display:grid;gap:6px;text-align:left}.field .label{color:var(--fjell)}
.input{min-height:44px;width:100%;padding:10px 14px;border:1px solid var(--lysgraa);border-radius:var(--radius-sm);font:var(--body)/1.2 var(--body-font-family);color:var(--koksgraa);background:#fff;text-align:right}
.input:disabled{background:var(--lysgraa);border-color:var(--graa);color:var(--koksgraa);-webkit-text-fill-color:var(--koksgraa);opacity:1;cursor:not-allowed}
.calc-result{display:grid;gap:4px;padding-top:var(--spacing-sm)}
.calc-result-label{color:var(--koksgraa)}.calc-result-value{font-family:var(--heading-font-family);font-size:var(--t-headline-sm);line-height:1.15;color:var(--fjell)}
.calc-ctas{display:flex;flex-wrap:wrap;gap:var(--spacing-sm) var(--spacing-md)}
.calc-note{max-width:60ch;color:var(--koksgraa)}.calc-note+.calc-note{margin-top:0}
/* faq */
.faq-wrap .faq{max-width:52rem}
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
.faq-more-items{margin-top:var(--spacing-md)}.faq-more-items details:first-of-type{border-top:1px solid var(--lysgraa)}
.faq details:last-of-type{border-bottom:1px solid var(--lysgraa)}.faq > details.faq-more{border-bottom:0!important}
/* tips */
.tips-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg)}
.tips-grid .card{padding:0;background:transparent;border-radius:0}.tips-grid .card:hover,.tips-grid .card:focus-within{box-shadow:none}.tips-grid .photo{margin-bottom:8px}
.feedback-btns{display:flex;gap:8px}.feedback .btn{min-width:56px;padding-inline:14px}
.compare{padding-top:0}
.link-more svg{width:16px;height:16px;margin-left:2px;vertical-align:-2px;display:inline-block}
@media (max-width:1023px){
  .hero-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.hero-text{grid-column:1;grid-row:1;max-width:none}.hero-media{grid-column:1;grid-row:2}.hero-media .photo{aspect-ratio:16/9}
  .choice-grid{grid-template-columns:1fr 1fr}
  .q-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.q-media{max-width:36rem}.q-text{max-width:none}
  .price-grid{grid-template-columns:1fr 1fr}
  .tips-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:767px){.only-phone{display:inline-flex}.only-desktop{display:none}}
@media (max-width:640px){
  .choice-grid{grid-template-columns:1fr;gap:var(--spacing-md)}.choice{grid-template-columns:38% 1fr;grid-template-areas:"img title" "img text";gap:4px 16px;align-items:start;padding:0}.choice .photo{grid-area:img;margin:0;align-self:center;border-radius:var(--spacing-lg) 0 var(--spacing-lg) 0}.choice .card-title{grid-area:title}.choice p{grid-area:text}
  .promo{grid-template-columns:1fr;gap:var(--spacing-md)}.promo-illu{width:140px}
  .price-grid{grid-template-columns:1fr;gap:var(--spacing-sm)}.price-card{padding:var(--spacing-md) var(--spacing-lg)}
  .calc{justify-items:stretch}.calc-tabs{display:grid;grid-template-columns:1fr 1fr}
  .calc-fields{grid-template-columns:1fr}.calc-ctas .btn{flex:1 1 100%}
  .faq .answer .faq-cols{grid-template-columns:1fr}
  .tips-grid{grid-template-columns:1fr}
}
`;
  return { template:'program', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-lan-boliglan-html-shape.md', dominantDimension:'composition/guided-catalogue', conceptSeed:'surface 2386009b (dealt 6,3,7; 6 built)', unsourcedContent:[], calculatorInterim:'dynamics #7 — static shell; config-script strings by selector, remaining visible strings transcribed from the captured screenshot (data-source="captured-screenshot")', signatureElements:['bankchoice_bg.svg in the router band','one-corner-pair photo mask (hero 96px, cards 48px)','spot illustration on the Klar for budrunden? promo'], improvementsApplied:['#1 compact router','#2 calm two-tier header','#3 1.25 scale','#4 one card language (choices, prices, tips)','#6 hero photo at content scale','#7 movements on paper, 4 dividers dropped'] } };
}
