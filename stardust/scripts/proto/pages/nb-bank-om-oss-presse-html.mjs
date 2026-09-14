// Om oss / Presse (standard clientlib) — composition per stardust/prototypes/nb-bank-om-oss-presse-html-shape.md; content verbatim from the captured DOM.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
// Lift an RTE block as HTML: drop editor spans/attributes, keep p/h/ul/li/b/a/br; <b> → <strong> (medium cut).
const rte=el=>el.innerHTML.replace(/<\/?span[^>]*>/g,'').replace(/\s(data-[a-z-]+|class|style|id|title)="[^"]*"/g,'').replace(/<(\/?)b>/g,'<$1strong>').replace(/<p>\s*(&#160;|&nbsp;|<br>)?\s*<\/p>/g,'').replace(/\s+/g,' ').trim();
const btnClass=a=>/secondary-btn/.test(a.className)?'btn btn-secondary':(/ffe-button--action/.test(a.className)?'btn btn-action':'btn btn-primary');
const ext=a=>/^https?:/.test(a.getAttribute('href')||'')&&!/sparebank1\.no/.test(a.getAttribute('href'));
export function render({doc,pj}){
  const main=doc.querySelector('main');
  const camp=main.querySelector('.campaign'); const cImg=camp.querySelector('img'); const cH1=norm(camp.querySelector('h1').textContent); const cLead=norm(camp.querySelector('p').textContent);
  const bg=main.querySelector('.background-container'); const natText=bg.querySelector('.columns-grid .text-wrapper'); const natH=norm(natText.querySelector('h2').textContent);
  const natPs=[...natText.querySelectorAll('p')];
  const advisers=[...bg.querySelectorAll('.adviser-list')].map(l=>[...l.querySelectorAll('.adviser')].map(a=>({img:a.querySelector('img')?.getAttribute('src'),name:norm(a.querySelector('.adviser-name')?.textContent),role:norm(a.querySelector('.adviser-subtext.ffe-paragraph:not(.adviser-phone)')?.textContent),phone:norm(a.querySelector('.adviser-phone')?.textContent),mail:a.querySelector('a.adviser-email')})));
  const grids=[...main.querySelectorAll(':scope > .columns-grid')];
  const lok=grids[0]; const lokIllu=lok.querySelector('img'); const lokText=lok.querySelector('.text-wrapper'); const lokBtn=lok.querySelector('.button a');
  const pr=grids[1]; const prText=pr.querySelector('.text-wrapper'); const prBtns=[...pr.querySelectorAll('.button-list-container a')]; const prImg=pr.querySelector('.image img');
  const fb=main.querySelector('.feedback'); const fbH=norm(fb.querySelector('h2')?.textContent); const fbBtns=[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent));
  const advHtml=advisers.map((list,i)=>`<ul class="advisers" data-slot="advisers" data-items="${list.length}">${list.map(a=>`<li class="adviser"><img class="portrait" src="${asset(a.img)}" alt="" aria-hidden="true" width="128" height="128" loading="lazy" decoding="async"><h3 class="title-sm adviser-name">${esc(a.name)}</h3><p class="adviser-role">${esc(a.role)}</p><p class="num adviser-phone">${esc(a.phone)}</p><p><a href="${esc(a.mail.getAttribute('href'))}">${esc(norm(a.mail.textContent))}</a></p></li>`).join('')}</ul>`).join('');
  const natLead=rte(natPs[0]).replace(/^<p>|<\/p>$/g,''); const natSmall=norm(natPs[1]?.textContent);
  const prHtml=rte(prText).replace(/<h1>/,'<h2>').replace(/<\/h1>/,'</h2>');
  const mainHtml=`
<section class="movement hero" data-section="hero" data-intent="who this page is for" data-layout="split-media" data-media="image" data-module="campaign">
  <div class="container hero-grid">
    <figure class="hero-media" data-slot="image"><img class="photo" src="${asset(cImg.getAttribute('src'))}" alt="${esc(cImg.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>
    <div class="hero-text"><h1 class="display" data-slot="heading">${esc(cH1)}</h1><p class="lead" data-slot="text">${esc(cLead)}</p></div>
  </div>
</section>
<section class="movement paper-frost nasjonale" data-section="nasjonale" data-intent="reach the national press contacts" data-layout="stack" data-module="adviser-list" data-items="${advisers.flat().length}" data-media="image">
  <div class="container">
    <div class="prose nat-text"><h2 data-slot="heading">${esc(natH)}</h2><p class="lead num" data-slot="text">${natLead}</p>${natSmall?`<p class="small muted">${esc(natSmall)}</p>`:''}</div>
    ${advHtml}
  </div>
</section>
<section class="movement lokale" data-section="lokale" data-intent="route to a local bank's press contact" data-layout="split-media" data-module="promo-band" data-media="illustration">
  <div class="container lok-grid">
    <img class="illu lok-illu" src="${asset(lokIllu.getAttribute('src'))}" alt="" aria-hidden="true" width="200" height="200" loading="lazy" decoding="async">
    <div class="lok-text prose">${rte(lokText)}<p class="lok-cta"><a class="${btnClass(lokBtn)}" href="${esc(lokBtn.getAttribute('href'))}" data-slot="cta">${esc(norm(lokBtn.textContent))}</a></p></div>
  </div>
</section>
<section class="movement paper-sand presserom" data-section="presserom" data-intent="go to the press room" data-layout="split-media" data-media="image" data-module="campaign">
  <div class="container pr-grid">
    <div class="pr-text prose">${prHtml}<p class="pr-ctas">${prBtns.map((a,i)=>`<a class="${i?'btn-inline':btnClass(a)}" href="${esc(a.getAttribute('href'))}"${ext(a)?' rel="noopener"':''}>${esc(norm(a.textContent))}${ext(a)?icons.external:''}</a>`).join('')}</p></div>
    <figure class="pr-media" data-slot="image"><img class="photo" src="${asset(prImg.getAttribute('src'))}" alt="${esc(prImg.getAttribute('alt')||'')}" width="1280" height="853" loading="lazy" decoding="async"></figure>
  </div>
</section>
<section class="feedback" data-section="feedback" data-intent="rate the page" data-layout="contained" data-module="feedback">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(fbH)}</h2><div class="feedback-btns">${fbBtns.map((t,i)=>`<button type="button" class="btn btn-secondary">${i?icons.thumbDown:icons.thumbUp}${esc(t)}</button>`).join('')}</div></div>
</section>`;
  const css=`
.hero-grid,.pr-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}
.hero-media,.pr-media{margin:0}
.hero-text{display:grid;gap:var(--spacing-md);max-width:34rem}
.nat-text{display:grid;gap:var(--spacing-md);margin-bottom:var(--spacing-xl)}.nat-text .lead strong{font-family:var(--title-font-family);font-weight:400}
.advisers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-xl) var(--spacing-lg);max-width:60rem;margin-inline:auto}
.advisers+.advisers{margin-top:var(--spacing-xl)}.advisers[data-items="2"]{grid-template-columns:repeat(2,minmax(0,1fr));max-width:40rem}
.advisers[data-items="3"] .adviser-name{min-height:2.5em}
.paper-sand+.feedback{border-top:0}
.adviser{display:grid;gap:var(--spacing-xs);justify-items:center;text-align:center}
.portrait{width:128px;height:128px;border-radius:50%;object-fit:cover;background:var(--frost);margin-bottom:var(--spacing-sm)}
.adviser-role{color:var(--koksgraa)}.adviser-phone{font-family:var(--title-font-family)}
.lok-grid{display:grid;grid-template-columns:200px minmax(0,68ch);justify-content:start;gap:var(--spacing-xl);align-items:center}
.lok-illu{width:200px;height:200px}
.lok-text{display:grid;gap:var(--spacing-md)}.lok-text p+p{margin-top:0}.lok-cta{margin-top:var(--spacing-sm)}
.pr-text{display:grid;gap:var(--spacing-md)}.pr-text p+p{margin-top:0}.pr-text .pr-ctas{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);margin-top:var(--spacing-sm)}
.pr-grid .pr-text{grid-column:1}.pr-grid .pr-media{grid-column:2}.pr-grid{grid-template-columns:5fr 7fr}
.feedback .feedback-row{justify-content:flex-start}.feedback-btns{display:flex;gap:var(--spacing-sm)}
@media (max-width:1023px){
  .hero-grid,.pr-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.hero-text{max-width:none}
  .pr-grid .pr-text,.pr-grid .pr-media{grid-column:auto}.pr-media{order:-1}
  .advisers,.advisers[data-items="2"]{grid-template-columns:1fr 1fr;max-width:none}.advisers[data-items="3"] .adviser:last-child{grid-column:1/-1}
  .hero-media{max-width:600px}
}
@media (max-width:640px){
  .advisers,.advisers[data-items="2"]{grid-template-columns:1fr;gap:var(--spacing-lg)}.advisers[data-items="3"] .adviser:last-child{grid-column:auto}.advisers[data-items="3"] .adviser-name{min-height:0}.hero-media{max-width:none}.adviser{grid-template-columns:96px 1fr;grid-template-areas:"img name" "img role" "img phone" "img mail";justify-items:start;text-align:left;column-gap:var(--spacing-md);align-content:center}
  .adviser .portrait{grid-area:img;width:96px;height:96px;margin:0;align-self:center}.adviser-name{grid-area:name}.adviser-role{grid-area:role}.adviser-phone{grid-area:phone}.adviser p:last-child{grid-area:mail}
  .lok-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.lok-illu{width:140px;height:140px}
}
`;
  return { template:'static', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-presse-html-shape.md', dominantDimension:'composition/paper-movements', conceptSeed:'surface cb42046c read (dealt 6,2,1; 6 built)', unsourcedContent:[], signatureElements:['one-corner-pair photo mask 96px (hero, press room)','circle portraits','spot illustration voksen-dame-med-mobil.svg on paper'], improvementsApplied:['#3 1.25 scale','#4 no card chrome — paper is the container','#6 hero photo at content scale','#7 paper changes mark movements, no <hr>'], dynamicsInterim:['feedback thumbs static (type=button)','"Velg bank" overlay bank picker → plain links to the captured href'], canonDeviations:[] } };
}
