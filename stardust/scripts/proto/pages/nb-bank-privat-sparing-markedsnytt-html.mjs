// Markedsnytt (listing, standard clientlib) — composition per stardust/prototypes/nb-bank-privat-sparing-markedsnytt-html-shape.md; content verbatim from the captured DOM.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
// Lift an RTE block as HTML. Editor spans: .h5 run-in labels → <strong>, .subtle-text → <small>, the rest unwrapped; <b> → <strong> outside headings, dropped inside them; editor attributes removed; empty paragraphs dropped.
const rte=el=>el.innerHTML
  .replace(/<span class="h5">([\s\S]*?)<\/span>/g,'<strong>$1</strong>')
  .replace(/<span class="subtle-text">([\s\S]*?)<\/span>/g,'<small class="muted">$1</small>')
  .replace(/<\/?span[^>]*>/g,'')
  .replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/g,(m,t,a,inner)=>`<${t}>${inner.replace(/<\/?b(\s[^>]*)?>/g,'')}</${t}>`)
  .replace(/<b(\s[^>]*)?>/g,'<strong>').replace(/<\/b>/g,'</strong>')
  .replace(/\s(data-[a-z-]+|class|style|id|title|onclick|rel)="[^"]*"/g,'')
  .replace(/(<br>\s*)+<\/(strong|p|h[1-6])>/g,' </$2>').replace(/<p>\s*(&#160;|&nbsp;)?\s*<\/p>/g,'').replace(/\s+/g,' ').trim();
const btnClass=a=>/secondary-btn/.test(a.className)?'btn btn-secondary':(/shortcut-btn/.test(a.className)?'btn-inline':(/ffe-button--action/.test(a.className)?'btn btn-action':'btn btn-primary'));
const isExt=h=>/^https?:/.test(h||'')&&!/www\.sparebank1\.no/.test(h);
const btn=(a,i=0)=>{ const h=a.getAttribute('href'); const cls=i&&/secondary-btn/.test(a.className)?'btn-inline':btnClass(a); return `<a class="${cls}" href="${esc(h)}"${isExt(h)?' rel="noopener"':''}>${esc(norm(a.textContent))}${isExt(h)?icons.external:''}</a>`; };
const imgSrc=i=>i?.getAttribute('src')||i?.getAttribute('data-lazy-src')||i?.getAttribute('data-lazy-largesrc')||'';
// Standard footer: the captured social icons are lazy (<img data-lazy-src>, no src) and the anchors have no text — fill icon + name (captured title attribute) so footerHtml() renders them.
export function patchData(data){ if(!data.footer) return; const f=data.doc.querySelector('footer'); for(const col of data.footer.columns) for(const l of col.links){ if(l.icon&&l.t) continue; const a=[...f.querySelectorAll('a[href]')].find(x=>x.getAttribute('href')===l.href); if(!a) continue; const img=a.querySelector('img'); if(!l.icon&&img) l.icon=img.getAttribute('src')||img.getAttribute('data-lazy-src')||img.getAttribute('data-lazy-largesrc')||null; if(!l.t) l.t=norm(a.getAttribute('title'))||norm(img?.getAttribute('alt')); } }
const play='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/></svg>';
export function render({doc,pj}){
  const main=doc.querySelector('main'); const k=[...main.children];
  const back=k[0].querySelector('a'); const heroT=k[1].querySelector('.text-wrapper'); const heroImg=k[1].querySelector('img');
  const heroLead=rte(heroT.querySelector('p')).replace(/^<p>|<\/p>$/g,'');
  // articles
  const cards=[...k[2].querySelectorAll('.card__container--featured')].map(c=>({img:c.querySelector('img'),title:norm(c.querySelector('.text-wrapper')?.textContent),a:c.querySelector('.button a')}));
  const moreArt=[...k[2].querySelectorAll('.button a')].find(a=>/secondary-btn/.test(a.className));
  // generic row parser: each .columns-grid__row → columns → content blocks
  const rows=el=>[...el.querySelectorAll('.columns-grid__row')].map(r=>[...r.children].map(col=>({text:[...col.querySelectorAll('.text-wrapper')],btns:[...col.querySelectorAll('.button a, .button-list-container a')],img:col.querySelector('.image img'),video:col.querySelector('iframe'),h2:col.querySelector(':scope > .columns-grid__content > h2')})));
  const video=(f)=>{ const src=f.getAttribute('src'); const url=f.getAttribute('data-video-url')||src; const t=norm(f.getAttribute('title'));
    // Offline ground rule (validate-prototype: no live hits) — every embed renders as a static 16:9 frame linking the captured video URL; dynamics #16 swaps in the lazy <iframe> at rollout.
    return `<a class="video-frame video-link" href="${esc(url)}" rel="noopener" data-deviation="YouTube embed rendered as a linked static frame (offline harness blocks youtube.com; ${src?'captured src':'src runtime-injected'}; dynamics #16 interim)">${play}<span class="video-title">${esc(t)}</span></a>`; };
  const textCol=(col,cls='')=>`<div class="prose col-text${cls}">${col.text.map(rte).join('')}${col.btns.length?`<p class="ctas">${col.btns.map((a,i)=>btn(a,i)).join('')}</p>`:''}</div>`;
  const portraitCol=(col)=>`<figure class="expert">${col.img?`<img class="${/\.svg$/.test(imgSrc(col.img))?'illu illu-lg':'portrait-lg'}" src="${asset(imgSrc(col.img))}" alt="" aria-hidden="true" width="200" height="200" loading="lazy" decoding="async">`:''}${col.text.length?`<figcaption class="expert-cap">${col.text.map(t=>rte(t).replace(/^<h4>|<\/h4>$/g,'')).join('')}</figcaption>`:''}</figure>`;
  // webinars (k[3]): rows[0] heading, rows[1..] text|video
  const wRows=rows(k[3]); const wH=norm(wRows[0][0].h2?.textContent);
  const webinars=wRows.slice(1).map(r=>`<div class="split-row">${textCol(r[0])}${r[1].video?video(r[1].video):''}</div>`).join('');
  // pensjon (k[4])
  const pH=norm(k[4].querySelector('h2')?.textContent);
  const pCards=[...k[4].querySelectorAll('.card')].map(c=>{const img=c.querySelector('img.responsive'); const a=c.querySelector('a.card__title'); const tag=norm(c.querySelector('.card__tag')?.textContent); const date=norm(c.querySelector('.card__date')?.textContent); return `<li class="card news-card"><img class="photo photo-sm" src="${asset(imgSrc(img))}" alt="${esc(img?.getAttribute('alt')||'')}" width="768" height="512" loading="lazy" decoding="async"><h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p class="meta">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time class="num">${esc(date)}</time>`:''}</p></li>`;}).join('');
  // ekspert (k[5]), rapporter (k[6])
  const eRows=rows(k[5]); const eH=norm(eRows[0][0].h2?.textContent);
  const ekspert=eRows.slice(1).map(r=>`<div class="split-row expert-row">${portraitCol(r[0])}${textCol(r[1])}</div>`).join('');
  const rRows=rows(k[6]); const rH=norm(rRows[0][0].h2?.textContent);
  const rapporter=rRows.slice(1).map(r=>`<div class="split-row expert-row">${portraitCol(r[0])}${textCol(r[1])}</div>`).join('');
  // what the fond (k[7])
  const fRows=rows(k[7]); const fH=norm(fRows[0][0].h2?.textContent);
  const wtf=fRows.slice(1).map(r=>`<div class="split-row">${textCol(r[0])}${r[1].video?video(r[1].video):''}</div>`).join('');
  // feedback (k[8])
  const fb=k[8]; const fbH=norm(fb.querySelector('h2')?.textContent); const fbBtns=[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent));
  // regulatory (k[9])
  const gRows=rows(k[9]); const gH=norm(gRows[0][0].text[0]?.querySelector('h2')?.textContent);
  const regCols=gRows[1].map(col=>`<div class="reg-col">${col.text.map(rte).join('')}</div>`).join('');
  const mainHtml=`
<section class="movement hero" data-section="hero" data-intent="what markedsnytt is" data-layout="split-media" data-media="image" data-module="campaign">
  <div class="container">
    <p class="back"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}${esc(norm(back.textContent))}</a></p>
    <div class="hero-grid">
      <div class="hero-text"><h1 data-slot="heading">${esc(norm(heroT.querySelector('h1').textContent))}</h1><p class="lead" data-slot="text">${heroLead}</p></div>
      <figure class="hero-media" data-slot="image"><img class="photo" src="${asset(imgSrc(heroImg))}" alt="${esc(heroImg.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>
    </div>
  </div>
</section>
<section class="movement articles" data-section="articles" data-intent="read the latest articles" data-layout="grid" data-module="card-rail" data-items="${cards.length}" data-media="image">
  <div class="container">
    <ul class="art-grid" data-slot="cards">${cards.map(c=>`<li class="card art-card"><img class="photo photo-sm" src="${asset(imgSrc(c.img))}" alt="" aria-hidden="true" width="1280" height="853" loading="lazy" decoding="async"><h2 class="card-title title-sm">${esc(c.title)}</h2><p><a class="link-more" href="${esc(c.a.getAttribute('href'))}">${esc(norm(c.a.textContent))}${icons.chevron}</a></p></li>`).join('')}</ul>
    <p class="art-more"><a class="${btnClass(moreArt)}" href="${esc(moreArt.getAttribute('href'))}" data-slot="cta">${esc(norm(moreArt.textContent))}</a></p>
  </div>
</section>
<section class="movement paper-frost webinars" data-section="webinars" data-intent="watch the webinar series" data-layout="split-media" data-module="content-columns" data-items="${wRows.length-1}" data-media="video">
  <div class="container"><h2 class="section-title" data-slot="heading">${esc(wH)}</h2><div class="rows">${webinars}</div></div>
</section>
<section class="movement pensjon" data-section="pensjon" data-intent="cross-link: pension articles" data-layout="grid" data-module="card-rail" data-items="${k[4].querySelectorAll('.card').length}" data-media="image">
  <div class="container"><h2 class="section-title" data-slot="heading">${esc(pH)}</h2><ul class="news-grid" data-slot="cards">${pCards}</ul></div>
</section>
<section class="movement paper-sand ekspert" data-section="ekspert" data-intent="read the expert comment" data-layout="split-media" data-module="content-columns" data-media="image">
  <div class="container"><h2 class="section-title" data-slot="heading">${esc(eH)}</h2><div class="rows">${ekspert}</div></div>
</section>
<section class="movement rapporter" data-section="rapporter" data-intent="download the reports" data-layout="split-media" data-module="content-columns" data-items="${rRows.length-1}" data-media="image">
  <div class="container"><h2 class="section-title" data-slot="heading">${esc(rH)}</h2><div class="rows">${rapporter}</div></div>
</section>
<section class="movement wtf" data-section="wtf" data-intent="watch the fund series" data-layout="split-media" data-module="content-columns" data-media="video">
  <div class="container"><h2 class="section-title" data-slot="heading">${esc(fH)}</h2><div class="rows">${wtf}</div></div>
</section>
<section class="feedback" data-section="feedback" data-intent="rate the page" data-layout="contained" data-module="feedback">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(fbH)}</h2><div class="feedback-btns">${fbBtns.map((t,i)=>`<button type="button" class="btn btn-secondary">${i?icons.thumbDown:icons.thumbUp}${esc(t)}</button>`).join('')}</div></div>
</section>
<section class="movement regulatory" data-section="regulatory" data-intent="regulatory: returns, marketing, agreements, ESG" data-layout="grid" data-module="content-columns" data-items="4">
  <div class="container"><h2 class="title-sm reg-title" data-slot="heading">${esc(gH)}</h2><div class="reg-grid">${regCols}</div></div>
</section>`;
  const css=`
.back{margin-bottom:var(--spacing-lg)}
.hero-grid{display:grid;grid-template-columns:5fr 7fr;gap:var(--spacing-xl);align-items:start}
.hero-media{margin:0}.hero-text{display:grid;gap:var(--spacing-md)}.hero-text h1{max-width:14ch}
.articles{padding-top:0}
.art-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-lg)}
.art-card{padding:0;background:transparent;border-radius:0;gap:var(--spacing-sm);align-content:start}.art-card:hover,.art-card:focus-within{box-shadow:none}
.art-card .photo{margin-bottom:var(--spacing-sm)}.art-card .card-title{color:var(--fjell)}
.art-card .link-more{text-decoration:none;min-height:44px}.art-card .link-more::after{content:"";position:absolute;inset:0}.art-card:hover .link-more,.art-card:focus-within .link-more{text-decoration:underline}
.art-more{margin-top:var(--spacing-xl)}
.section-title{margin-bottom:var(--spacing-xl)}
.rows{display:grid;gap:var(--spacing-2xl)}
.split-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--spacing-xl);align-items:start}
.col-text{display:grid;gap:var(--spacing-md);align-content:start}.col-text h2{font-size:var(--t-title);line-height:1.2;max-width:24ch}.col-text h3+h3{margin-top:calc(-1*var(--spacing-sm))}.col-text .btn-inline{padding-inline:0}.col-text p+p,.col-text ul{margin-top:0}.col-text h3{max-width:24ch}.col-text ul{padding-left:1.2em;list-style:disc;display:grid;gap:var(--spacing-sm)}.col-text li{margin:0}.col-text li::marker{color:var(--vann)}
.col-text .ctas{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);margin-top:var(--spacing-sm)}
.video-frame{display:block;aspect-ratio:16/9;width:100%;background:#fff;border:1px solid var(--lysgraa);border-radius:var(--radius);overflow:hidden}.paper-frost .video-frame{border-color:transparent}.video-frame iframe{display:block;width:100%;height:100%;border:0}
.video-link{position:relative;display:grid;place-content:center;justify-items:center;gap:var(--spacing-md);padding:var(--spacing-lg);color:var(--fjell);text-decoration:none;text-align:center;transition:background-color var(--dur) var(--ease)}
.video-link svg{width:56px;height:56px;fill:none;stroke:var(--vann);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.video-link .video-title{font-family:var(--title-font-family);font-size:var(--lead);max-width:28ch}
.video-link:hover{color:var(--fjell);background:var(--frost-30)}.paper-frost .video-link:hover{background:#fff}.video-link:hover .video-title{text-decoration:underline}.video-link:visited{color:var(--fjell)}
.expert-row{grid-template-columns:260px minmax(0,1fr)}
.expert{margin:0;display:grid;gap:var(--spacing-md);justify-items:start}
.portrait-lg{width:200px;height:200px;border-radius:50%;object-fit:cover;background:var(--frost-30)}
.illu-lg{width:160px;height:160px}
.expert-cap{font-size:var(--body);line-height:1.45;color:var(--koksgraa)}.expert-cap strong{display:block;color:var(--fjell)}.expert-cap small{display:block;font-size:var(--body-sm);margin-top:var(--spacing-xs)}
.news-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-lg)}
.news-card,.art-card{grid-template-columns:minmax(0,1fr);min-width:0;align-content:start}.news-card .card-title,.art-card .card-title{overflow-wrap:anywhere}
.news-card{padding:0;background:transparent;border-radius:0}.news-card:hover,.news-card:focus-within{box-shadow:none}.news-card .photo{margin-bottom:8px}
.feedback .feedback-row{justify-content:flex-start}.feedback-btns{display:flex;gap:var(--spacing-sm)}
.wtf,.regulatory{border-top:1px solid var(--lysgraa)}
.reg-title{margin-bottom:var(--spacing-lg)}
.reg-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl)}
.reg-col{max-width:60ch}.reg-col p+p{margin-top:var(--spacing-lg)}.reg-col p+p:has(> a:only-child){margin-top:var(--spacing-sm)}.reg-col strong{display:block;color:var(--fjell)}
@media (max-width:1023px){
  .hero-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.hero-text h1{max-width:none}
  .art-grid,.news-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-md)}.art-card .card-title,.news-card .card-title{font-size:var(--lead)}
  .split-row{grid-template-columns:1fr;gap:var(--spacing-lg)}.split-row .video-frame{order:-1;max-width:640px}
  .expert-row{grid-template-columns:1fr}.expert{grid-template-columns:auto 1fr;align-items:center}
  .rows{gap:var(--spacing-xl)}
}
@media (max-width:640px){
  .art-grid,.news-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.articles{padding-top:var(--spacing-lg)}
  .reg-grid{grid-template-columns:1fr}
  .expert{grid-template-columns:1fr}.portrait-lg{width:120px;height:120px}.illu-lg{width:120px;height:120px}
}
`;
  return { template:'listing', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-sparing-markedsnytt-html-shape.md', dominantDimension:'composition/magazine-movements', conceptSeed:'surface 45675da5 read (dealt 7,5,6; 7 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','one-corner-pair photo mask (hero 96px, cards 48px)','circle portraits','spot illustration dokument.svg'], improvementsApplied:['#3 1.25 scale','#4 one card language, one action per card','#6 hero photo at content scale','#7 paper movements, 4 captured <hr> dropped'], dynamicsInterim:['#16 YouTube: captured src → lazy iframe; runtime-injected src → linked static frame (data-video-url)','#5 feedback thumbs static','#11 tema filters: none captured; index-backed listing at rollout'], canonDeviations:['.video-link (play glyph authored locally; canon lacks a play icon)'] } };
}
