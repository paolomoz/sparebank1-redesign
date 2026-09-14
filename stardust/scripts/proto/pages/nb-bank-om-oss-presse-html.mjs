// Om oss family renderer (standard clientlib). The presse ARCHETYPE keeps its bespoke composition (renderPresse — byte-identical to the approved
// prototype); every other om-oss page goes through a component walker (renderGeneric) that maps the captured AEM components IN CAPTURED ORDER
// (.campaign · .columns-grid · .background-container · .text · .image · .button · .card/.static-cards · .tabs-component · .accordion(-list) ·
// .table · .section · .adviser-list · .feedback · .to-parent · .title) to designed movements, with a verbatim rich-text fallback for anything else.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
// Lift an RTE block as HTML: drop editor spans/attributes, keep p/h/ul/li/b/a/br; <b> → <strong> (medium cut).
const rte=el=>el.innerHTML.replace(/<\/?span[^>]*>/g,'').replace(/\s(data-[a-z-]+|class|style|id|title)="[^"]*"/g,'').replace(/<(\/?)b>/g,'<$1strong>').replace(/<p>\s*(&#160;|&nbsp;|<br>)?\s*<\/p>/g,'').replace(/\s+/g,' ').trim();
const btnClass=a=>/secondary-btn/.test(a.className)?'btn btn-secondary':(/ffe-button--action/.test(a.className)?'btn btn-action':(/tertiary|ffe-inline-button/.test(a.className)?'btn-inline':'btn btn-primary'));
const ext=a=>/^https?:/.test(a.getAttribute('href')||'')&&!/sparebank1\.no/.test(a.getAttribute('href'));
function renderPresse({doc,pj}){
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

/* ---------------- generic om-oss walker (siblings) ---------------- */
const ARCHETYPE='nb-bank-om-oss-presse-html';
const EMPTY=/^[\s\u00a0]*$/;
const slugify=s=>norm(s).toLowerCase().replace(/[^a-z0-9æøå]+/g,'-').replace(/^-+|-+$/g,'');
// Verbatim lift of a captured rich-text / table / arbitrary block: strip authoring attributes, unwrap style spans (heading-styled spans → strong),
// b → strong, drop empty blocks and UI-only nodes, resolve img src through asset(). Nothing dropped, nothing invented.
function rich(el){
  if(!el) return ''; const c=el.cloneNode(true);
  for(const x of c.querySelectorAll('script,style,link,svg,noscript,dialog,.bank-choice-overlay,.glossary-modal,.glossary-backdrop,.sticky-header,.table-config,.scroll-indicator,.hide,[hidden],button:not([href])')) x.remove();
  for(const x of c.querySelectorAll('span[class]')){ const m=(x.getAttribute('class')||'').match(/(^|\s)(h[1-6])(\s|$)/); if(m) x.setAttribute('data-h',m[2]); }
  for(const x of c.querySelectorAll('*')){ if(x.tagName==='IMG'){ x.setAttribute('src',asset(x.getAttribute('data-lazy-src')||x.getAttribute('src'))); x.setAttribute('alt',x.getAttribute('alt')||''); x.setAttribute('loading','lazy'); x.setAttribute('decoding','async'); for(const a of [...x.attributes].map(a=>a.name)){ if(!/^(src|alt|loading|decoding)$/.test(a)) x.removeAttribute(a); } continue; } for(const a of [...x.attributes].map(a=>a.name)){ if(!/^(href|colspan|rowspan|scope|data-h)$/.test(a)) x.removeAttribute(a); } }
  for(const s of [...c.querySelectorAll('span')]){ if(s.getAttribute('data-h')&&!s.closest('h1,h2,h3,h4,h5,h6')){ const st=c.ownerDocument.createElement('strong'); st.innerHTML=s.innerHTML; s.replaceWith(st); } else s.replaceWith(...s.childNodes); }
  for(const b of [...c.querySelectorAll('b')]){ if(EMPTY.test(b.textContent)){ b.replaceWith(c.ownerDocument.createTextNode(' ')); continue; } const st=c.ownerDocument.createElement('strong'); st.innerHTML=b.innerHTML; b.replaceWith(st); }
  for(const x of [...c.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li')]){ if(EMPTY.test(x.textContent)&&!x.querySelector('img')) x.remove(); }
  for(const a of c.querySelectorAll('a')){ a.innerHTML=a.innerHTML.replace(/^(\s|&nbsp;|&#160;|\u00a0)+|(\s|&nbsp;|&#160;|\u00a0)+$/g,''); if(/^https?:/.test(a.getAttribute('href')||'')&&!/sparebank1\.no/.test(a.getAttribute('href'))) a.setAttribute('rel','noopener'); }
  return c.innerHTML.replace(/(<br>\s*)+<\/p>/g,'</p>').replace(/<p>(<br>\s*)+/g,'<p>').replace(/\s+/g,' ').trim();
}
const paperOf=el=>{ const st=((el.getAttribute('style')||'')+' '+(el.querySelector(':scope > [style*="background"]')?.getAttribute('style')||'')+' '+(el.querySelector(':scope > * > [style*="background"]')?.getAttribute('style')||'')).toLowerCase(); if(/#fff(fff)?\b|transparent/.test(st)&&!/f8f5eb|fdf8f5|f2f2f9|d8e9f2|e6f0f5|e9e5f5/.test(st)) return ''; return /f8f5eb|fdf8f5|sand/.test(st)?'paper-sand':(/f2f2f9|e9e5f5|syrin/.test(st)?'paper-syrin':(/d8e9f2|e6f0f5|frost/.test(st)?'paper-frost':'')); };
const isPhoto=src=>!/\.svg(\?|$)/i.test(src||'');
const imgSrc=i=>i?(i.getAttribute('data-lazy-src')||i.getAttribute('data-lazy-largesrc')||i.getAttribute('src')):null;
function imageHtml(el,ctx,{cls=''}={}){
  const img=el.querySelector('img'); const src=imgSrc(img); if(!src) return '';
  const alt=img.getAttribute('alt')||''; const cap=norm(el.querySelector('figcaption')?.textContent);
  if(isPhoto(src)){ const eager=!ctx.eagerUsed; ctx.eagerUsed=true; return `<figure class="fig ${cls}"><img class="photo" src="${asset(src)}" alt="${esc(alt)}" width="1280" height="853" loading="${eager?'eager':'lazy'}"${eager?' fetchpriority="high"':''} decoding="async">${cap?`<figcaption class="small muted">${esc(cap)}</figcaption>`:''}</figure>`; }
  const eagerI=!ctx.eagerUsed; ctx.eagerUsed=true;
  return `<figure class="fig fig-illu ${cls}"><img class="illu-lg" src="${asset(src)}" alt="${esc(alt)}"${alt?'':' aria-hidden="true"'} width="320" height="320" loading="${eagerI?'eager':'lazy'}"${eagerI?' fetchpriority="high"':''} decoding="async">${cap?`<figcaption class="small muted">${esc(cap)}</figcaption>`:''}</figure>`;
}
const ctaHtml=(root,cls='ctas')=>{ const as=[...root.querySelectorAll('a[href]')]; return as.length?`<p class="${cls}">${as.map((a,i)=>`<a class="${btnClass(a)}" href="${esc(a.getAttribute('href'))}"${ext(a)?' rel="noopener"':''}>${esc(norm(a.textContent))}${ext(a)?icons.external:''}</a>`).join('')}</p>`:''; };
function cardHtml(card,ctx){
  const a=card.querySelector('a.card__title, .card__title a, a[href]'); const img=card.querySelector('.card__container-image img'); const src=imgSrc(img);
  const text=card.querySelector('.card__container-content .text'); const ps=[...card.querySelectorAll('.card__container-content p:not(.card__title)')].filter(p=>!text||!text.contains(p));
  const ctas=card.querySelector('.card__container-content .button');
  const title=a?`<h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}"${ext(a)?' rel="noopener"':''}>${esc(norm(a.textContent))}</a></h3>`:'';
  const media=src?(isPhoto(src)?`<img class="photo photo-sm" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}" width="768" height="512" loading="lazy" decoding="async">`:`<img class="illu" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}"${img.getAttribute('alt')?'':' aria-hidden="true"'} width="72" height="72" loading="lazy" decoding="async">`):'';
  return `<li class="card${a?'':' plain'}">${media}${title}${text?`<div class="prose">${rich(text.querySelector('.text-wrapper')||text)}</div>`:''}${ps.map(p=>`<p>${esc(norm(p.textContent))}</p>`).join('')}${ctas?ctaHtml(ctas):''}</li>`;
}
// Layout tables (accordion bodies use <table class> with .text in the cells) → walk the cells; data tables → verbatim.
const isLayoutTable=t=>!!t.querySelector('td .text, td .text-wrapper')&&!t.querySelector('th, caption');
function accordionHtml(items,ctx,{open=()=>false}={}){
  return `<div class="faq" data-module="faq" data-items="${items.length}">${items.map((it,i)=>`<details${open(it,i)?' open':''}><summary>${esc(it.title)}${icons.down}</summary><div class="answer">${it.body}</div></details>`).join('')}</div>`;
}
// One captured component → markup (inline context: inside a movement/column/panel).
function comp(el,ctx){
  if(!el||!el.classList) return '';
  const cl=el.classList; const tag=el.tagName;
  if(/^(SCRIPT|STYLE|LINK|NOSCRIPT|SVG|HR)$/.test(tag)) return '';
  if(cl.contains('hide')||cl.contains('bank-choice-overlay')||cl.contains('sticky-header')||cl.contains('table-config')||cl.contains('scroll-indicator')||el.hasAttribute('hidden')) return '';
  if(cl.contains('hr')) return '';
  if(cl.contains('to-parent')){ const a=el.querySelector('a[href]'); if(!a) return ''; return `<p class="back"><a class="backlink" href="${esc(a.getAttribute('href'))}">${icons.back}<span>${esc(norm(a.textContent))}</span></a></p>`; }
  if(cl.contains('title')&&el.querySelector('h1,h2,h3')){ const h=el.querySelector('h1,h2,h3'); return `<${h.tagName.toLowerCase()} data-slot="heading">${esc(norm(h.textContent))}</${h.tagName.toLowerCase()}>`; }
  if(cl.contains('text')&&!cl.contains('text-overlay')){ const w=el.querySelector('.text-wrapper')||el; const html=rich(w); return html?`<div class="prose">${html}</div>`:''; }
  if(cl.contains('image')&&!cl.contains('image-wrapper')) return imageHtml(el,ctx);
  if(cl.contains('button')||cl.contains('button-list-container')||cl.contains('buttongroup')) return ctaHtml(el);
  if(cl.contains('static-cards')||cl.contains('card-list')){ const cards=[...el.querySelectorAll('.card')]; return cards.length?`<ul class="cards" data-module="cards" data-items="${cards.length}">${cards.map(c=>cardHtml(c,ctx)).join('')}</ul>`:''; }
  if(cl.contains('card')&&!cl.contains('card-list')) return `<ul class="cards cards-1" data-module="cards" data-items="1">${cardHtml(el,ctx)}</ul>`;
  if(cl.contains('columns-grid')){ let cols=[...el.querySelectorAll(':scope > .columns-grid__wrap > .columns-grid--width > .columns-grid__row > .columns-grid__column, :scope > * > * > .columns-grid__row > .columns-grid__column')]; if(!cols.length) cols=[...el.querySelectorAll('.columns-grid__column')]; cols=cols.map(c=>({first:c.classList.contains('columns-grid__column--first'),html:walk(c.querySelector('.columns-grid__content')||c,ctx)})).filter(c=>c.html); if(!cols.length) return ''; cols.sort((a,b)=>(b.first?1:0)-(a.first?1:0)); return `<div class="cols" data-module="columns-grid" data-items="${cols.length}">${cols.map(c=>`<div class="col">${c.html}</div>`).join('')}</div>`; }
  if(cl.contains('background-container')){ const inner=el.querySelector(':scope > .background-container__wrap > .background-container__content')||el; const html=walk(inner,ctx); if(!html) return ''; const p=paperOf(el); return `<div class="panel${p?' '+p:''}" data-module="background-container">${html}</div>`; }
  if(cl.contains('adviser-list')){ const list=[...el.querySelectorAll('.adviser')].map(a=>({img:imgSrc(a.querySelector('img')),name:norm(a.querySelector('.adviser-name')?.textContent),role:norm(a.querySelector('.adviser-subtext.ffe-paragraph:not(.adviser-phone)')?.textContent),phone:norm(a.querySelector('.adviser-phone')?.textContent),mail:a.querySelector('a.adviser-email')})); return `<ul class="advisers" data-module="adviser-list" data-slot="advisers" data-items="${list.length}">${list.map(a=>`<li class="adviser">${a.img?`<img class="portrait" src="${asset(a.img)}" alt="" aria-hidden="true" width="128" height="128" loading="lazy" decoding="async">`:''}<h3 class="title-sm adviser-name">${esc(a.name)}</h3>${a.role?`<p class="adviser-role">${esc(a.role)}</p>`:''}${a.phone?`<p class="num adviser-phone">${esc(a.phone)}</p>`:''}${a.mail?`<p><a href="${esc(a.mail.getAttribute('href'))}">${esc(norm(a.mail.textContent))}</a></p>`:''}</li>`).join('')}</ul>`; }
  if(cl.contains('accordion-list-container')||cl.contains('accordion-list-wrapper')){ const items=[...el.querySelectorAll('li.accordion-list')].map(li=>({title:norm(li.querySelector('.accordion-title, button')?.textContent),body:walk(li.querySelector('.accordion-content')||li,ctx,{skip:'.accordion-title'})})); return items.length?accordionHtml(items,ctx):walk(el,ctx); }
  if(cl.contains('accordion')&&!cl.contains('accordion-list')){ const items=[...el.querySelectorAll('.accordion__item')].map(it=>{ const btn=it.querySelector('button, .accordion__title, .accordion__header'); const content=it.querySelector('.accordion__content'); return {title:norm(btn?.textContent||it.querySelector('h2,h3,h4')?.textContent),body:content?walk(content,ctx):rich(it)}; }).filter(i=>i.title||i.body); return items.length?accordionHtml(items,ctx):walk(el,ctx); }
  if(cl.contains('tabs-component')||cl.contains('tabs')&&!cl.contains('tabs__wrap')){ const btns=[...el.querySelectorAll('.js-tab-button, .ffe-tab-button')]; const panels=[...el.querySelectorAll('.tab.js-tab-content, .tabs__content > .tab')]; if(!panels.length) return walk(el,ctx); const ids=panels.map((p,i)=>slugify(btns[i]?.getAttribute('data-id')||p.querySelector('h2,h3')?.textContent||`tab-${i+1}`)); const nav=btns.length?`<nav class="tab-nav" aria-label="${esc(norm(el.querySelector('.tabs__content-title, h2')?.textContent)||'Faner')}" data-dynamics="11 (tabs → in-page sections, interim)"><ul>${btns.map((b,i)=>`<li><a class="badge" href="#${ids[i]||'tab-'+(i+1)}">${esc(norm(b.textContent))}</a></li>`).join('')}</ul></nav>`:''; return `<div class="tabs" data-module="tabs" data-items="${panels.length}">${nav}${panels.map((p,i)=>`<section class="tab-panel" id="${ids[i]}">${walk(p,ctx)}</section>`).join('')}</div>`; }
  if(cl.contains('table')&&el.querySelector('table')){ const t=el.querySelector('.table-wrapper table')||el.querySelector('table'); return isLayoutTable(t)?walk(t,ctx):`<div class="table-wrap" data-module="table"><table>${rich(t)}</table></div>`; }
  if(tag==='TABLE') return isLayoutTable(el)?walk(el,ctx):`<div class="table-wrap" data-module="table"><table>${rich(el)}</table></div>`;
  if(/^(TBODY|THEAD|TR|TD|TH|COLGROUP)$/.test(tag)) return tag==='COLGROUP'?'':walk(el,ctx);
  if(cl.contains('section')&&el.querySelector('.section-item')){ const h=el.querySelector('.section__title'); const sub=el.querySelector('.ffe-sub-lead-paragraph, .section__sublead'); const items=[...el.querySelectorAll('.section-item')].map(it=>({title:norm(it.querySelector('.section-item__text, .section-item__button')?.textContent),body:walk(it.querySelector('.section-item__content')||it,ctx),active:!!it.querySelector('.section-item__wrapper--active')})); const foot=el.querySelector('.section__footer'); return `<div class="sub" data-module="section">${h||sub?`<div class="prose sub-head">${h?`<h2>${esc(norm(h.textContent))}</h2>`:''}${sub?`<p class="lead">${esc(norm(sub.textContent))}</p>`:''}</div>`:''}${accordionHtml(items,ctx,{open:(it,i)=>it.active||i===0})}${foot?walk(foot,ctx):''}</div>`; }
  if(cl.contains('feedback')){ const h=norm(el.querySelector('h2, .feedback-question')?.textContent)||el.querySelector('.component-root')?.getAttribute('data-question-default')||''; const btns=[...el.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent)).filter(Boolean); if(!btns.length) return ''; return `<div class="feedback-row" data-module="feedback" data-dynamics="5 (static thumbs, interim)"><h2>${esc(h)}</h2><div class="feedback-btns">${btns.map((t,i)=>`<button type="button" class="btn btn-secondary">${i?icons.thumbDown:icons.thumbUp}${esc(t)}</button>`).join('')}</div></div>`; }
  if(cl.contains('campaign')){ const img=el.querySelector('.campaign-bg img, .campaign__wrap-bg img'); const src=imgSrc(img); const content=el.querySelector('.campaign-content')||el; const eager=src&&!ctx.eagerUsed; if(src) ctx.eagerUsed=true; return `<div class="hero-grid${src?'':' hero-noimg'}">${src?`<figure class="hero-media" data-slot="image"><img class="photo" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}" width="1280" height="853" loading="${eager?'eager':'lazy'}"${eager?' fetchpriority="high"':''} decoding="async"></figure>`:''}<div class="hero-text">${walk(content,ctx)}</div></div>`; }
  // transparent wrappers → walk
  if(cl.contains('aem-component-container')||cl.contains('aem-main-container')||cl.contains('text-overlay')||cl.contains('columns-grid__content')||cl.contains('background-container__wrap')||cl.contains('background-container__content')||cl.contains('static-cards__wrapper')||cl.contains('tabs__content')||cl.contains('tab')||cl.contains('responsive-grid')||cl.contains('section__content')||cl.contains('section__footer')||cl.contains('image-wrapper')||cl.contains('text-wrapper')||cl.contains('campaign__full-width')||cl.contains('campaign__wrap')||cl.contains('campaign__wrap-content')||cl.contains('campaign-content')||cl.contains('referance')||cl.contains('reference')||cl.contains('cq-dd-paragraph')||cl.contains('accordion-wrap')||cl.contains('accordion-container')||(tag==='DIV'&&!el.getAttribute('class'))||/^ffe-grid/.test(el.getAttribute('class')||'')||(el.getAttribute('class')||'').split(/\s+/).filter(Boolean).every(c=>/^(parbase|color-fillable|aem-|cq-|ffe-)/.test(c))) return walk(el,ctx); // ffe-*/aem-* only class lists are layout wrappers (e.g. .ffe-accordion-item__body, .ffe-accordion)
  if(cl.contains('tabs__wrap')||cl.contains('tabs__icon-wrap')) return ''; // tab buttons are rendered by the tabs handler
  if(tag==='H1'||tag==='H2'||tag==='H3'||tag==='H4'||tag==='P'||tag==='UL'||tag==='OL'||tag==='A'||tag==='IMG'||tag==='FIGURE'||tag==='BLOCKQUOTE'){ const html=rich(el.parentElement&&el.parentElement.children.length===1?el.parentElement:el); return html?`<div class="prose">${tag==='IMG'?rich(el.parentElement):(el.parentElement&&el.parentElement.children.length===1?html:el.outerHTML&&rich(wrapOne(el)))}</div>`:''; }
  // unmapped component → verbatim prose fallback
  const html=rich(el); if(!html) return ''; ctx.fallbacks++; ctx.fallbackTags.push((el.getAttribute('class')||tag).split(/\s+/)[0]); return `<div class="prose rich-fallback" data-module="rich-text">${html}</div>`;
}
const wrapOne=el=>{ const d=el.ownerDocument.createElement('div'); d.appendChild(el.cloneNode(true)); return d; };
const walk=(root,ctx,{skip}={})=>[...root.children].filter(c=>!skip||!c.matches(skip)).map(c=>comp(c,ctx)).join('');
// Top-level movement classification: `block` components open their own movement; consecutive inline components share one prose movement.
const BLOCK=['campaign','columns-grid','background-container','static-cards','tabs-component','feedback','section','adviser-list','hr'];
const kind=el=>{ const cl=el.classList; for(const k of BLOCK){ if(cl.contains(k)) return k; } return 'inline'; };
const intentOf={campaign:'who this page is for',
  'columns-grid':'text beside media: read, then act','background-container':'a grouped step of the page on paper','static-cards':'choose a topic',
  'tabs-component':'browse the reports by company',feedback:'rate the page',section:'collapsible sub-sections','adviser-list':'reach the people',inline:'read'};
function renderGeneric({doc,pj,slug}){
  const main=doc.querySelector('main');
  const ctx={eagerUsed:false,fallbacks:0,fallbackTags:[]};
  const kids=[...main.children].filter(k=>!/^(SCRIPT|STYLE|LINK|HEADER|FOOTER)$/.test(k.tagName)&&!k.classList.contains('bank-choice--inline')&&!k.classList.contains('bank-choice'));
  const groups=[]; for(const k of kids){ const kd=kind(k); if(kd==='hr'){ groups.push({kind:'hr'}); continue; } if(kd==='inline'){ const last=groups[groups.length-1]; if(last&&last.kind==='inline'){ last.els.push(k); continue; } groups.push({kind:'inline',els:[k]}); continue; } groups.push({kind:kd,els:[k]}); }
  let tinted=0, lastTint='', n=0; const movements=[];
  for(const g of groups){ if(g.kind==='hr'){ lastTint=lastTint; continue; }
    const el=g.els[0]; let inner=g.els.map(e=>comp(e,ctx)).join(''); if(!inner) continue; n++;
    let tint=''; if(g.kind==='background-container'){ tint=paperOf(el); inner=inner.replace(/^<div class="panel( paper-[a-z]+)?" data-module="background-container">([\s\S]*)<\/div>$/,'$2'); }
    if(tint&&(tinted>=2||tint===lastTint)) tint=''; if(tint) tinted++; lastTint=tint;
    const name=g.kind==='inline'?slugify(g.els.map(e=>norm(e.querySelector('h1,h2,h3')?.textContent)).find(Boolean)||'text')||'text':(slugify(norm(el.querySelector('h1,h2,h3')?.textContent))||g.kind);
    const mod={campaign:'campaign','columns-grid':'columns-grid','background-container':'background-container','static-cards':'cards','tabs-component':'tabs',feedback:'feedback',section:'section','adviser-list':'adviser-list',inline:'text'}[g.kind];
    const layout=g.kind==='campaign'?'split-media':(g.kind==='columns-grid'?'split':'contained');
    const media=el.querySelector('img')?(isPhoto(imgSrc(el.querySelector('img')))?' data-media="image"':' data-media="illustration"'):'';
    if(g.kind==='feedback'){ movements.push(`<section class="feedback" data-section="feedback" data-intent="rate the page" data-layout="contained" data-module="feedback"><div class="container">${inner.replace(/ data-module="feedback"/,'')}</div></section>`); continue; }
    movements.push(`<section class="movement${tint?' '+tint:''}${g.kind==='campaign'?' hero':''}" data-section="${esc(name)}-${n}" data-intent="${esc(intentOf[g.kind]||'read')}" data-layout="${layout}" data-module="${mod}"${media}>\n  <div class="container${g.kind==='inline'?' prose-run':''}">${inner}</div>\n</section>`);
  }
  let mainHtml='\n'+movements.join('\n');
  // exactly one <h1>: promote the first heading when none; demote extras when several
  const h1s=(mainHtml.match(/<h1[\s>]/g)||[]).length;
  if(h1s===0) mainHtml=mainHtml.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/,(m,a,t)=>`<h1${a||''}>${t}</h1>`);
  if(h1s>1){ let i=0; mainHtml=mainHtml.replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/g,(m,a,t)=>(++i===1?m:`<h2${a||''}>${t}</h2>`)); }
  // heading outline without skips where possible: if no h2 follows the h1 but h3/h4 do, lift the sub-levels
  { let prev=1; mainHtml=mainHtml.replace(/<h([1-6])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g,(m,l,a,t)=>{ let n=+l; if(n>prev+1) n=prev+1; prev=n; return `<h${n}${a||''}>${t}</h${n}>`; }); }
  const css=`
.hero-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}.hero-grid.hero-noimg{grid-template-columns:minmax(0,68ch)}
.hero-media{margin:0}.hero-text{display:grid;gap:var(--spacing-md);max-width:34rem}.hero-text .prose h1{font-size:var(--display, var(--h1))}.hero-text .prose h1+p{margin-top:var(--spacing-md);font-size:var(--lead);line-height:1.5}
.prose-run{display:grid;gap:var(--spacing-lg);max-width:none}.prose-run>.prose{max-width:68ch}.prose-run>.prose+.prose{margin-top:0}
.prose h2{margin-top:var(--spacing-xl)}.prose h3{margin-top:var(--spacing-lg);font-size:var(--title)}.prose h4{margin-top:var(--spacing-lg);font-family:var(--title-font-family);font-size:var(--body)}.prose h2+p,.prose h3+p,.prose h4+p{margin-top:var(--spacing-sm)}.prose>h2:first-child,.prose>h3:first-child,.prose>h1:first-child{margin-top:0}
.prose ul{list-style:disc;padding-left:1.25em}.prose ol{list-style:decimal;padding-left:1.25em}.prose strong{font-family:var(--title-font-family);font-weight:400}
.prose .lead{font-size:var(--lead);line-height:1.5}
.back{margin-bottom:var(--spacing-sm)}.prose-run .back{margin-bottom:0}
.ctas{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);margin-top:var(--spacing-lg)}.ctas .btn svg{width:18px;height:18px;margin-left:6px}
.fig{margin:0}.fig-illu{display:grid;justify-items:center}.illu-lg{width:min(100%,320px);height:auto;aspect-ratio:1;object-fit:contain}
.cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--spacing-xl) var(--spacing-2xl);align-items:center}
.cols[data-items="1"]{grid-template-columns:minmax(0,68ch)}.cols[data-items="3"]{grid-template-columns:repeat(3,minmax(0,1fr));align-items:start}.cols[data-items="4"]{grid-template-columns:repeat(4,minmax(0,1fr));align-items:start}
.col{display:grid;gap:var(--spacing-md);min-width:0}.col>.prose+.prose{margin-top:0}.col .cards{grid-template-columns:1fr}
.panel{display:grid;gap:var(--spacing-lg)}.panel.paper-sand,.panel.paper-frost,.panel.paper-syrin{padding:var(--spacing-lg);border-radius:var(--radius)}
.movement>.container>.panel{gap:var(--spacing-xl)}.movement.paper-sand>.container>.panel,.movement.paper-frost>.container>.panel,.movement.paper-syrin>.container>.panel{padding:0}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,16rem),1fr));gap:var(--spacing-lg);list-style:none;margin:0;padding:0}.cards.cards-1{grid-template-columns:minmax(0,24rem)}
.card{gap:var(--spacing-sm);align-content:start}.card .illu{width:56px;height:56px}.card .prose p+p{margin-top:var(--spacing-sm)}.card .ctas{margin-top:var(--spacing-sm)}.card h3{font-size:var(--title)}
.tabs{display:grid;gap:var(--spacing-xl)}.tab-nav ul{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);list-style:none;margin:0;padding:0}
.tab-panel{display:grid;gap:var(--spacing-lg);scroll-margin-top:var(--spacing-lg)}.tab-panel>h2{margin:0}
.faq .answer .prose+.prose{margin-top:var(--spacing-md)}.faq .answer .prose strong{display:block;margin-top:var(--spacing-md)}.faq .answer .prose>strong:first-child,.faq .answer .prose>p:first-child strong{margin-top:0}
.table-wrap{overflow-x:auto;max-width:100%}.table-wrap table{width:100%;min-width:32rem;border-collapse:collapse;font-size:var(--body-sm)}.table-wrap th,.table-wrap td{padding:12px 16px;border-bottom:1px solid var(--lysgraa);text-align:left;vertical-align:top}.table-wrap th{font-family:var(--title-font-family);font-weight:400;color:var(--fjell)}.table-wrap thead td,.table-wrap thead th{background:var(--frost-30)}.table-wrap caption{text-align:left;font-family:var(--title-font-family);padding-bottom:var(--spacing-sm)}
.sub,.faq,.faq details,.faq .answer,.tabs,.tab-panel,.panel,.col,.cols,.prose-run,.prose{min-width:0;max-width:100%}.prose{max-width:68ch}
.sub{display:grid;gap:var(--spacing-lg)}.sub-head{display:grid;gap:var(--spacing-sm)}.sub-head h2{margin:0}.sub .table-wrap{margin-top:var(--spacing-md)}
.feedback .feedback-row{justify-content:flex-start}.feedback-btns{display:flex;gap:var(--spacing-sm)}
.advisers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-xl) var(--spacing-lg);list-style:none;margin:0;padding:0}
.adviser{display:grid;gap:var(--spacing-xs);justify-items:center;text-align:center}.portrait{width:128px;height:128px;border-radius:50%;object-fit:cover;background:var(--frost);margin-bottom:var(--spacing-sm)}
.adviser-role{color:var(--koksgraa)}.adviser-phone{font-family:var(--title-font-family)}
.rich-fallback table{width:100%;border-collapse:collapse}.rich-fallback td,.rich-fallback th{padding:8px 12px;border-bottom:1px solid var(--lysgraa);vertical-align:top;text-align:left}
@media (max-width:1023px){
  .hero-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.hero-text{max-width:none}.hero-media{max-width:600px}
  .cols,.cols[data-items="3"],.cols[data-items="4"]{grid-template-columns:1fr;gap:var(--spacing-xl)}.col .fig{max-width:600px}
  .advisers{grid-template-columns:1fr 1fr}
}
@media (max-width:640px){
  .hero-media{max-width:none}.panel.paper-sand,.panel.paper-frost,.panel.paper-syrin{padding:20px}.cards{grid-template-columns:1fr}.advisers{grid-template-columns:1fr}
  .table-wrap table{min-width:0}.table-wrap th,.table-wrap td{padding:8px 10px}
}
`;
  return { template:'static', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-presse-html-shape.md', dominantDimension:'composition/paper-movements', conceptSeed:'surface cb42046c read (family walker)', unsourcedContent:[], richTextFallbacks:ctx.fallbacks, ...(ctx.fallbackTags.length?{richTextFallbackComponents:[...new Set(ctx.fallbackTags)]}:{}), signatureElements:['one-corner-pair photo mask 96px','circle portraits','spot illustrations on paper'], improvementsApplied:['#3 1.25 scale','#4 no card chrome beyond canon .card — paper is the container','#6 photos at content scale','#7 paper changes mark movements, no <hr>'], dynamicsInterim:['feedback thumbs static (type=button)','"Velg bank" overlay CTAs → plain links to the captured href','tabs → in-page sections with a jump nav (dynamics #11)','accordions → <details>'], canonDeviations:[] } };
}
export function render(data){
  const main=data.doc.querySelector('main');
  const isArchetype=data.slug===ARCHETYPE||(main.querySelector('.campaign')&&main.querySelector('.adviser-list')&&main.querySelectorAll(':scope > .columns-grid').length===2&&main.querySelector('.feedback'));
  return isArchetype?renderPresse(data):renderGeneric(data);
}
