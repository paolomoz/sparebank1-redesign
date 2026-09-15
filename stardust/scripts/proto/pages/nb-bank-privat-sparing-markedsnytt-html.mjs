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
  const textCard=(col)=>`<div class="card card--tint text-card"><div class="card-body">${textCol(col)}</div></div>`;
  const videoCard=(f)=>`<div class="card card--frost video-card">${video(f)}</div>`;
  const portraitCol=(col)=>`<figure class="card card--syrin expert">${col.img?`<img class="${/\.svg$/.test(imgSrc(col.img))?'illu illu-lg':'portrait-lg'}" src="${asset(imgSrc(col.img))}" alt="" aria-hidden="true" width="200" height="200" loading="lazy" decoding="async">`:''}${col.text.length?`<figcaption class="expert-cap">${col.text.map(t=>rte(t).replace(/^<h4>|<\/h4>$/g,'')).join('')}</figcaption>`:''}</figure>`;
  // webinars (k[3]): rows[0] heading, rows[1..] text|video
  const wRows=rows(k[3]); const wH=norm(wRows[0][0].h2?.textContent);
  const webinars=wRows.slice(1).map(r=>`<div class="bento split-row">${textCard(r[0])}${r[1].video?videoCard(r[1].video):''}</div>`).join('');
  // pensjon (k[4])
  const pH=norm(k[4].querySelector('h2')?.textContent);
  const pCards=[...k[4].querySelectorAll('.card')].map(c=>{const img=c.querySelector('img.responsive'); const a=c.querySelector('a.card__title'); const tag=norm(c.querySelector('.card__tag')?.textContent); const date=norm(c.querySelector('.card__date')?.textContent); return `<li class="card card--tint news-card is-link"><img class="card-image" src="${asset(imgSrc(img))}" alt="${esc(img?.getAttribute('alt')||'')}" width="768" height="432" loading="lazy" decoding="async"><div class="card-body"><h3 class="card-title h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p class="meta small">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time class="num">${esc(date)}</time>`:''}</p></div></li>`;}).join('');
  // ekspert (k[5]), rapporter (k[6])
  const eRows=rows(k[5]); const eH=norm(eRows[0][0].h2?.textContent);
  const ekspert=eRows.slice(1).map(r=>`<div class="bento split-row expert-row">${portraitCol(r[0])}${textCard(r[1])}</div>`).join('');
  const rRows=rows(k[6]); const rH=norm(rRows[0][0].h2?.textContent);
  const rapporter=rRows.slice(1).map(r=>`<div class="bento split-row expert-row">${portraitCol(r[0])}${textCard(r[1])}</div>`).join('');
  // what the fond (k[7])
  const fRows=rows(k[7]); const fH=norm(fRows[0][0].h2?.textContent);
  const wtf=fRows.slice(1).map(r=>`<div class="bento split-row">${textCard(r[0])}${r[1].video?videoCard(r[1].video):''}</div>`).join('');
  // feedback (k[8])
  const fb=k[8]; const fbH=norm(fb.querySelector('h2')?.textContent); const fbBtns=[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent));
  // regulatory (k[9])
  const gRows=rows(k[9]); const gH=norm(gRows[0][0].text[0]?.querySelector('h2')?.textContent);
  const regCols=gRows[1].map(col=>`<li class="card card--tint reg-card"><div class="card-body"><div class="reg-col">${col.text.map(rte).join('')}</div></div></li>`).join('');
  const mainHtml=`
<section class="movement hero" data-section="hero" data-intent="what markedsnytt is" data-layout="bento-cells" data-media="image" data-module="campaign">
  <div class="container"><div class="bento hero-bento">
    <div class="card card--frost hero-card"><div class="card-body"><p class="back"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}${esc(norm(back.textContent))}</a></p><h1 class="h2-l" data-slot="heading">${esc(norm(heroT.querySelector('h1').textContent))}</h1><p class="lead" data-slot="text">${heroLead}</p></div></div>
    <figure class="card hero-photo" data-slot="image"><img src="${asset(imgSrc(heroImg))}" alt="${esc(heroImg.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>
  </div></div>
</section>
<section class="movement articles" data-section="articles" data-intent="read the latest articles" data-layout="grid" data-module="card-rail" data-items="${cards.length}" data-media="image">
  <div class="container">
    <ul class="bento art-grid" data-slot="cards">${cards.map(c=>`<li class="card card--tint news-card art-card is-link"><img class="card-image" src="${asset(imgSrc(c.img))}" alt="" aria-hidden="true" width="1280" height="720" loading="lazy" decoding="async"><div class="card-body"><h2 class="card-title h3">${esc(c.title)}</h2><p class="art-link"><a class="link-more cover-link" href="${esc(c.a.getAttribute('href'))}">${esc(norm(c.a.textContent))}${icons.chevron}</a></p></div></li>`).join('')}</ul>
    <p class="art-more"><a class="${btnClass(moreArt)}" href="${esc(moreArt.getAttribute('href'))}" data-slot="cta">${esc(norm(moreArt.textContent))}</a></p>
  </div>
</section>
<section class="movement webinars" data-section="webinars" data-intent="watch the webinar series" data-layout="bento-cells" data-module="content-columns" data-items="${wRows.length-1}" data-media="video">
  <div class="container"><h2 class="h2-l section-title" data-slot="heading">${esc(wH)}</h2><div class="rows">${webinars}</div></div>
</section>
<section class="movement pensjon" data-section="pensjon" data-intent="cross-link: pension articles" data-layout="grid" data-module="card-rail" data-items="${k[4].querySelectorAll('.card').length}" data-media="image">
  <div class="container"><h2 class="h2-l section-title" data-slot="heading">${esc(pH)}</h2><ul class="bento news-grid" data-slot="cards">${pCards}</ul></div>
</section>
<section class="movement ekspert" data-section="ekspert" data-intent="read the expert comment" data-layout="bento-cells" data-module="content-columns" data-media="image">
  <div class="container"><h2 class="h2-l section-title" data-slot="heading">${esc(eH)}</h2><div class="rows">${ekspert}</div></div>
</section>
<section class="movement rapporter" data-section="rapporter" data-intent="download the reports" data-layout="bento-cells" data-module="content-columns" data-items="${rRows.length-1}" data-media="image">
  <div class="container"><h2 class="h2-l section-title" data-slot="heading">${esc(rH)}</h2><div class="rows">${rapporter}</div></div>
</section>
<section class="movement wtf" data-section="wtf" data-intent="watch the fund series" data-layout="bento-cells" data-module="content-columns" data-media="video">
  <div class="container"><h2 class="h2-l section-title" data-slot="heading">${esc(fH)}</h2><div class="rows">${wtf}</div></div>
</section>
<section class="feedback" data-section="feedback" data-intent="rate the page" data-layout="contained" data-module="feedback">
  <div class="container feedback-row"><h2 data-slot="heading">${esc(fbH)}</h2><div class="feedback-btns">${fbBtns.map((t,i)=>`<button type="button" class="btn btn-secondary">${i?icons.thumbDown:icons.thumbUp}${esc(t)}</button>`).join('')}</div></div>
</section>
<section class="movement regulatory" data-section="regulatory" data-intent="regulatory: returns, marketing, agreements, ESG" data-layout="grid" data-module="content-columns" data-items="4">
  <div class="container"><h2 class="h2-s reg-title" data-slot="heading">${esc(gH)}</h2><ul class="bento reg-grid" data-slot="columns">${regCols}</ul></div>
</section>`;
  const css=`
/* markedsnytt listing — round 01 card language */
.hero{padding-top:24px}
.hero-bento{grid-template-rows:minmax(440px,auto)}
.hero-card{grid-column:1/span 5}.hero-card .card-body{justify-content:center;padding:56px 48px}
.hero-card .back{margin:0 0 20px}.hero-card h1{max-width:14ch}.hero-card .lead{margin-top:20px;max-width:none}
.hero-photo{grid-column:6/-1;margin:0;background:var(--frost-30)}.hero-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 30%}
/* articles continue the hero bento (6 px below) */
.articles{padding-top:var(--card-gap)}
.art-grid>.news-card,.news-grid>.news-card{grid-column:span 4}
.news-card .card-body{padding:32px 28px 40px}.news-card .card-title{overflow-wrap:anywhere}
.art-link{margin-top:14px}.art-link .link-more{text-decoration:none;font-family:var(--title-font-family)}.art-card:hover .link-more,.art-card:focus-within .link-more{color:var(--fjell)}
.news-card .meta{margin-top:12px}
.art-more{margin-top:24px}
/* rows of split cells: text 5 + video 7 · portrait 3 + text 9 */
.rows{display:grid;gap:var(--card-gap)}
.split-row .text-card{grid-column:1/span 5}.split-row .video-card{grid-column:6/-1}
.text-card .card-body{justify-content:center;padding:48px 48px}
.col-text{display:grid;gap:var(--spacing-md);align-content:start;max-width:none}.col-text h2{font-size:var(--t-title);line-height:1.14;max-width:24ch}.col-text h3{font-family:var(--title-font-family);font-size:var(--title);line-height:1.17;max-width:24ch}.col-text h3+h3{margin-top:calc(-1*var(--spacing-sm))}.col-text .btn-inline{padding-inline:0}.col-text p+p,.col-text ul{margin-top:0}.col-text ul{padding-left:1.2em;list-style:disc;display:grid;gap:var(--spacing-sm)}.col-text li{margin:0}.col-text li::marker{color:var(--vann)}
.col-text .ctas{display:flex;flex-wrap:wrap;gap:var(--spacing-sm) var(--spacing-md);margin-top:var(--spacing-sm);position:relative;z-index:2}.col-text .btn svg{width:18px;height:18px}
.video-card{display:flex;min-height:380px}
.video-card .video-frame{width:100%;flex:1 1 auto;aspect-ratio:16/9;border-radius:0;background:transparent}
.video-link{display:grid;place-content:center;justify-items:center;gap:var(--spacing-md);padding:var(--spacing-lg);color:var(--fjell);text-decoration:none;text-align:center}
.video-link svg{width:64px;height:64px;fill:none;stroke:var(--vann);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;transition:transform .5s var(--spring)}.video-link .video-title{font-family:var(--title-font-family);font-size:var(--lead);max-width:28ch}
.video-card:hover,.video-card:focus-within{background:#cbe1ee}.video-link:hover svg{transform:scale(1.08)}.video-link:hover .video-title{text-decoration:underline}.video-link:visited,.video-link:hover{color:var(--fjell)}
.expert-row .expert{grid-column:1/span 3;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-md);padding:32px 24px;text-align:center}
.expert-row .text-card{grid-column:4/-1}
.portrait-lg{width:160px;height:160px;border-radius:50%;object-fit:cover;background:var(--frost-30);transition:transform .5s var(--spring)}
.illu-lg{width:150px;height:150px;transition:transform .5s var(--spring)}
.expert-row:has(.text-card:hover) .portrait-lg,.expert-row:has(.text-card:hover) .illu-lg{transform:scale(1.04)}
.expert-cap{font-size:var(--body);line-height:1.45;color:var(--koksgraa)}.expert-cap strong{display:block;color:var(--fjell);font-family:var(--title-font-family)}.expert-cap small{display:block;font-size:var(--body-sm);margin-top:var(--spacing-xs)}
.feedback .feedback-row{justify-content:flex-start}.feedback-btns{display:flex;gap:var(--spacing-sm)}
/* regulatory: two text cards */
.reg-title{margin-bottom:24px}
.reg-grid>.reg-card{grid-column:span 6}.reg-card .card-body{padding:40px 48px}
.reg-col{max-width:60ch}.reg-col p+p{margin-top:var(--spacing-lg)}.reg-col p+p:has(> a:only-child){margin-top:var(--spacing-sm)}.reg-col strong{display:block;color:var(--fjell)}
@media (max-width:1024px){
  .hero-bento{grid-template-rows:auto}.hero-card{grid-column:1/-1}.hero-card .card-body{padding:40px 32px}.hero-card h1{max-width:none}.hero-photo{grid-column:1/-1;aspect-ratio:16/9;order:-1}
  .news-card .card-body{padding:24px 20px 32px}.news-card .card-title{font-size:var(--lead)}
  .split-row .text-card,.split-row .video-card{grid-column:1/-1}.split-row .video-card{order:-1;min-height:0}.text-card .card-body{padding:40px 32px}
  .expert-row .expert{grid-column:1/-1;flex-direction:row;justify-content:flex-start;text-align:left;padding:24px 28px}.expert-row .text-card{grid-column:1/-1}.portrait-lg{width:120px;height:120px}.illu-lg{width:120px;height:120px}
  .reg-grid>.reg-card{grid-column:1/-1}.reg-card .card-body{padding:32px 28px}
}
@media (max-width:767px){
  .hero-card .card-body,.text-card .card-body{padding:36px 20px}
  .art-grid>.news-card,.news-grid>.news-card{grid-column:1/-1}.news-card .card-body{padding:28px 20px 32px}
  .expert-row .expert{flex-direction:column;align-items:flex-start;padding:24px 20px}.expert-cap{text-align:left}
  .reg-card .card-body{padding:32px 20px}
  .col-text .ctas .btn{flex:1 1 100%;white-space:normal;text-align:center}.art-more .btn{width:100%;white-space:normal}
}
`;
  return { template:'listing', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-sparing-markedsnytt-html-shape.md', dominantDimension:'composition/magazine-movements', conceptSeed:'surface 45675da5 read (dealt 7,5,6; 7 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','photos bleeding in bento cells (hero 7, news cards 16:9)','circle portraits on Syrin-30 tiles','spot illustration dokument.svg','videos as Frost cards'], improvementsApplied:['round 01: hero + rows as bento cells, articles continue the hero bento','round 01: news cards 3×4 with 2 px corners and 6 px gutters','round 01: no movement tints, no <hr> — 4 captured <hr> dropped','Ramp type scale, 6 px borderless buttons'], dynamicsInterim:['#16 YouTube: captured src → lazy iframe; runtime-injected src → linked static frame (data-video-url)','#5 feedback thumbs static','#11 tema filters: none captured; index-backed listing at rollout'], canonDeviations:['.video-link (play glyph authored locally; canon lacks a play icon)'] } };
}
