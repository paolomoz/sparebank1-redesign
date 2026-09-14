// Market landing (Privat) — canon author. Composition per stardust/prototypes/nb-bank-privat-html-shape.md; content verbatim from the captured DOM.
import { esc, asset, icons } from '../chrome.mjs';
import { renderSibling } from './nb-bank-privat-lan-boliglan-html.mjs';
export const ARCHETYPE='nb-bank-privat-html';
/** Family renderer (market-landing): the canon archetype keeps its approved composition; the bedrift / om-oss landings render through the shared Path A′ component walker (campaign · tiles · promos · news · index · compare become optional and count-driven). */
export function render(d){ return (!d.slug||d.slug===ARCHETYPE)?renderLanding(d):renderSibling(d,{family:'market-landing',archetype:ARCHETYPE}); }
// Siblings only (canon gap #1: footerData() reads img[src]; some captures carry data-lazy-src only). The archetype output is untouched.
export function patchData(d){ if(!d.slug||d.slug===ARCHETYPE||!d.footer) return; const f=d.doc.querySelector('footer'); if(!f) return; for(const col of d.footer.columns) for(const l of col.links){ if(l.icon) continue; const a=[...f.querySelectorAll('.footer-bottom__column-links li a')].find(x=>x.getAttribute('href')===l.href); const i=a?.querySelector('img'); if(i) l.icon=i.getAttribute('data-lazy-src')||i.getAttribute('src')||null; } }
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const linkList=(el)=>[...el.querySelectorAll('p a')].map(a=>`<li><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></li>`).join('');
function renderLanding({doc,pj}){
  const main=doc.querySelector('main');
  const camp=main.querySelector('.campaign-carousel__element');
  const cImg=camp.querySelector('img'); const cH=camp.querySelector('h2'); const cPs=[...camp.querySelectorAll('.text-wrapper p')]; const cBtn=camp.querySelector('.button a');
  const productCols=[...main.querySelectorAll('.background-container .columns-grid__column')].filter(c=>c.querySelector('h2'));
  const bannerEls=[...main.querySelectorAll('.banner-small__grid')];
  const rel=main.querySelector('.related-topics'); const relH=rel.querySelector('h2'); const cards=[...rel.querySelectorAll('.card')];
  const indexCols=[...main.querySelectorAll('.columns-grid__column')].filter(c=>!c.querySelector('h2')&&c.querySelector('p a')&&[...c.querySelectorAll('p')].some(p=>!p.querySelector('a')));
  const compare=[...main.querySelectorAll(':scope > .text')].pop();
  const h1=norm(main.querySelector('h1')?.textContent)||'Privat';
  const tiles=productCols.map(c=>{const img=c.querySelector('img'); const h=c.querySelector('h2'); const a=h.querySelector('a'); return `<li class="tile"><img class="illu" src="${asset(img.getAttribute('src'))}" alt="" aria-hidden="true" width="72" height="72" loading="lazy" decoding="async"><h2 class="tile-title">${a?`<a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`:esc(norm(h.textContent))}</h2><ul class="tile-links">${linkList(c)}</ul></li>`;}).join('');
  const banners=bannerEls.map(b=>{const img=b.querySelector('img'); const h=b.querySelector('h2'); const p=b.querySelector('.banner-small__infotext'); const a=b.querySelector('.button a'); return `<article class="promo" data-module="promo-band">${img?`<img class="promo-illu" src="${asset(img.getAttribute('src'))}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="160" height="120">`:''}<div class="promo-text"><h2 class="title-sm">${esc(norm(h.textContent))}</h2><p>${esc(norm(p.textContent))}</p><p><a class="btn btn-secondary" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></p></div></article>`;}).join('');
  const newsCards=cards.map(c=>{const img=c.querySelector('img.responsive'); const a=c.querySelector('a.ffe-text-link'); const tag=norm(c.querySelector('.card__tag')?.textContent); const date=norm(c.querySelector('.card__date')?.textContent); const src=img?.getAttribute('data-lazy-src')||img?.getAttribute('src'); return `<li class="card news-card">${src?`<img class="photo photo-sm" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}" width="768" height="512" loading="lazy" decoding="async">`:''}<h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p class="meta">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time class="num">${esc(date)}</time>`:''}</p></li>`;}).join('');
  const index=indexCols.map(c=>{const ps=[...c.querySelectorAll('p')]; const label=ps.find(p=>!p.querySelector('a')); return `<div class="index-col"><h2 class="title-sm index-label">${esc(norm(label?.textContent))}</h2><ul class="index-links">${[...c.querySelectorAll('p a')].map(a=>`<li><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></li>`).join('')}</ul></div>`;}).join('');
  const cmpH=norm(compare.querySelector('h2')?.textContent); const cmpP=compare.querySelector('p');
  const cmpHtml=cmpP.innerHTML.replace(/<a\s([^>]*)>/g,'<a $1 class="link-more" rel="noopener">').replace(/<\/a>/g,`${icons.external}</a>`);
  const mainHtml=`
<h1 class="visually-hidden">${esc(h1)}</h1>
<section class="movement paper-syrin campaign" data-section="campaign" data-intent="one offer, one action" data-layout="split-media" data-media="image" data-module="campaign-carousel" data-items="1">
  <div class="container campaign-grid">
    <figure class="campaign-media" data-slot="image"><img class="photo" src="${asset(cImg.getAttribute('src'))}" alt="${esc(cImg.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>
    <div class="campaign-text">
      <h2 class="display" data-slot="heading">${esc(norm(cH.textContent))}</h2>
      <p class="lead" data-slot="text">${esc(norm(cPs[0].textContent))}</p>
      <p class="small num muted">${esc(norm(cPs[1].textContent))}</p>
      <p class="campaign-cta"><a class="btn btn-action" data-cta="primary" data-slot="cta" href="${esc(cBtn.getAttribute('href'))}">${esc(norm(cBtn.textContent))}</a></p>
    </div>
  </div>
</section>
<section class="movement products" data-section="products" data-intent="route to product areas" data-layout="grid" data-items="${productCols.length}" data-module="content-columns">
  <div class="container"><ul class="tiles">${tiles}</ul></div>
</section>
<section class="movement paper-sand membership" data-section="membership" data-intent="invite: switch bank, LO membership" data-layout="grid" data-items="${bannerEls.length}" data-module="promo-band">
  <div class="container promo-grid">${banners}</div>
</section>
<section class="movement news" data-section="news" data-intent="cross-link: news and advice" data-layout="grid" data-items="${cards.length}" data-module="card-rail" data-media="image">
  <div class="container">
    <h2 class="section-title" data-slot="heading">${esc(norm(relH.textContent))}</h2>
    <ul class="news-grid" data-slot="cards">${newsCards}</ul>
  </div>
</section>
<section class="movement index" data-section="index" data-intent="secondary navigation: about and shortcuts" data-layout="grid" data-items="${indexCols.length}" data-module="content-columns">
  <div class="container index-grid">${index}</div>
</section>
<section class="movement compare" data-section="compare" data-intent="regulatory: compare prices" data-layout="contained" data-module="cta-band">
  <div class="container"><div class="cta-band"><h2 class="title-sm" data-slot="heading">${esc(cmpH)}</h2><p data-slot="text">${cmpHtml}</p></div></div>
</section>`;
  const css=`
.campaign-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}
.campaign-media{margin:0}.campaign-text{display:grid;gap:var(--spacing-md);max-width:34rem}
.campaign-text .display{max-width:12ch}.campaign-cta{margin-top:var(--spacing-sm)}
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-xl) var(--spacing-lg)}
.tile{display:grid;gap:var(--spacing-md);align-content:start;padding-top:var(--spacing-lg);border-top:1px solid var(--lysgraa)}
.tile-title{font-size:var(--t-title)}.tile-title a{color:var(--fjell);text-decoration:none}.tile-title a:hover{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.12em}
.tile-links{display:grid;gap:var(--spacing-sm)}.tile-links a{text-decoration:none}.tile-links a:hover{text-decoration:underline}
.promo-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-lg)}
.promo{display:grid;grid-template-columns:auto 1fr;gap:var(--spacing-lg);align-items:center;padding:0 var(--spacing-xl) 0 0}.promo+.promo{border-left:1px solid var(--lysgraa);padding:0 0 0 var(--spacing-xl)}
.promo:not(:has(.promo-illu)){grid-template-columns:1fr}
.promo-illu{width:140px;height:auto}.promo-text{display:grid;gap:var(--spacing-sm)}.promo-text .btn{margin-top:var(--spacing-xs)}
.section-title{margin-bottom:var(--spacing-lg)}
.news-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg)}
.news-card{padding:0;background:transparent;border-radius:0}.news-card:hover,.news-card:focus-within{box-shadow:none}.news-card .photo{margin-bottom:8px}
.index{border-top:1px solid var(--lysgraa)}.index-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl)}
.index-col{display:grid;gap:var(--spacing-md);align-content:start}.index-label{color:var(--koksgraa)}
.index-links{display:grid;gap:var(--spacing-sm)}.index-links a{font-family:var(--title-font-family);font-size:var(--lead);text-decoration:none;color:var(--fjell)}.index-links a:hover{color:var(--vann);text-decoration:underline}
.compare{padding-top:0}
.link-more svg{width:16px;height:16px;margin-left:2px;vertical-align:-2px;display:inline-block}
@media (max-width:1023px){.campaign-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.campaign-text{max-width:none}.tiles{grid-template-columns:1fr 1fr}.news-grid{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.tiles{grid-template-columns:1fr;gap:var(--spacing-lg)}.tile{grid-template-columns:56px 1fr;grid-template-areas:"illu title" "links links";gap:8px 16px;align-items:center;padding-top:var(--spacing-md)}.tile .illu{grid-area:illu;width:56px;height:56px}.tile-title{grid-area:title}.tile-links{grid-area:links}.promo-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.promo{grid-template-columns:1fr;padding:0}.promo+.promo{border-left:0;border-top:1px solid var(--lysgraa);padding:var(--spacing-lg) 0 0}.promo-illu{width:110px}.news-grid{grid-template-columns:1fr}.index-grid{grid-template-columns:1fr}}
`;
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-html-shape.md', dominantDimension:'register/museum-didactic', conceptSeed:'surface 3169e2f5 (dealt 4,5,3; 4 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','spot illustrations on product tiles','one-corner-pair photo mask (campaign 96px, news 48px)'], improvementsApplied:['#1 compact router','#2 calm two-tier header','#3 1.25 scale','#4 one card language','#6 photo at content scale','#7 5 movements, no dividers'] } };
}
