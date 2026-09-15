// Market landing (Privat) — canon author. Round 01 composition (2026-09-15, variant C): a contained hero bento (alliance router
// tile on Vann across the top row; campaign text 5 cols + photo 7 cols below), 3×2 product cards, a full-width membership row
// (illustration tile + teaser, twice), 4 news cards, index + compare cards. Content verbatim from the captured DOM.
// Prototype round record: stardust/prototypes/round-01-danske-ramp/README.md (home-c.html is the approved composition).
import { esc, asset, icons, routerHtml } from '../chrome.mjs';
import { renderSibling } from './nb-bank-privat-lan-boliglan-html.mjs';
export const ARCHETYPE='nb-bank-privat-html';
/** Family renderer (market-landing): the canon archetype keeps its approved composition; the bedrift / om-oss landings render through the shared Path A′ component walker. */
export function render(d){ return (!d.slug||d.slug===ARCHETYPE)?renderLanding(d):renderSibling(d,{family:'market-landing',archetype:ARCHETYPE}); }
// Siblings only (canon gap #1: footerData() reads img[src]; some captures carry data-lazy-src only). The archetype output is untouched.
export function patchData(d){ if(!d.slug||d.slug===ARCHETYPE||!d.footer) return; const f=d.doc.querySelector('footer'); if(!f) return; for(const col of d.footer.columns) for(const l of col.links){ if(l.icon) continue; const a=[...f.querySelectorAll('.footer-bottom__column-links li a')].find(x=>x.getAttribute('href')===l.href); const i=a?.querySelector('img'); if(i) l.icon=i.getAttribute('data-lazy-src')||i.getAttribute('src')||null; } }
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const arrowList=(el)=>[...el.querySelectorAll('p a')].map(a=>`<li><a class="arrow" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></li>`).join('');
function renderLanding({doc,pj,router}){
  const main=doc.querySelector('main');
  const camp=main.querySelector('.campaign-carousel__element');
  const cImg=camp.querySelector('img'); const cH=camp.querySelector('h2'); const cPs=[...camp.querySelectorAll('.text-wrapper p')]; const cBtn=camp.querySelector('.button a');
  const productCols=[...main.querySelectorAll('.background-container .columns-grid__column')].filter(c=>c.querySelector('h2'));
  const bannerEls=[...main.querySelectorAll('.banner-small__grid')];
  const rel=main.querySelector('.related-topics'); const relH=rel.querySelector('h2'); const cards=[...rel.querySelectorAll('.card')];
  const indexCols=[...main.querySelectorAll('.columns-grid__column')].filter(c=>!c.querySelector('h2')&&c.querySelector('p a')&&[...c.querySelectorAll('p')].some(p=>!p.querySelector('a')));
  const compare=[...main.querySelectorAll(':scope > .text')].pop();
  const h1=norm(main.querySelector('h1')?.textContent)||'Privat';

  const hero=`<div class="bento hero">
${routerHtml(router,{tile:true})}
<article class="campaign" data-section="campaign" data-intent="one offer, one action" data-layout="bento-cells" data-media="image" data-module="campaign-carousel" data-items="1">
  <div class="card card--frost campaign-text is-link">
    <div class="card-body">
      <h2 class="h2-l" data-slot="heading">${esc(norm(cH.textContent))}</h2>
      <div class="campaign-copy">
        <p class="lead" data-slot="text">${esc(norm(cPs[0].textContent))}</p>
        ${cPs[1]?`<p class="small muted num">${esc(norm(cPs[1].textContent))}</p>`:''}
        <p class="actions"><a class="btn btn-action btn-lg cover-link" data-cta="primary" data-slot="cta" href="${esc(cBtn.getAttribute('href'))}">${esc(norm(cBtn.textContent))}</a></p>
      </div>
    </div>
  </div>
  <figure class="card hero-photo" data-slot="image"><img src="${asset(cImg.getAttribute('src'))}" alt="${esc(cImg.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>
</article>
</div>`;

  const tiles=productCols.map(c=>{const img=c.querySelector('img'); const h=c.querySelector('h2'); const a=h.querySelector('a'); return `<li class="card card--tint product is-link"><div class="card-body">${img?`<img class="illu" src="${asset(img.getAttribute('src'))}" alt="" aria-hidden="true" width="72" height="72" loading="lazy" decoding="async">`:''}<h3 class="h3">${a?`<a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`:esc(norm(h.textContent))}</h3><ul class="link-list">${arrowList(c)}</ul></div></li>`;}).join('');

  const fills=['card--frost','card--syrin'];
  const banners=bannerEls.map((b,i)=>{const img=b.querySelector('img'); const h=b.querySelector('h2'); const p=b.querySelector('.banner-small__infotext'); const a=b.querySelector('.button a');
    return `${img?`<div class="card ${fills[i%2]} promo-art" data-slot="image"><img class="promo-illu" src="${asset(img.getAttribute('src'))}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="160" height="120"></div>`:''}<article class="card card--tint promo is-link" data-module="promo-band"><div class="card-body"><h3 class="h3" data-slot="heading">${esc(norm(h.textContent))}</h3><p data-slot="text">${esc(norm(p.textContent))}</p>${a?`<p class="actions"><a class="btn btn-secondary cover-link" data-slot="cta" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></p>`:''}</div></article>`;}).join('');

  const newsCards=cards.map(c=>{const img=c.querySelector('img.responsive'); const a=c.querySelector('a.ffe-text-link'); const tag=norm(c.querySelector('.card__tag')?.textContent); const date=norm(c.querySelector('.card__date')?.textContent); const src=img?.getAttribute('data-lazy-src')||img?.getAttribute('src');
    return `<li class="card card--tint news-card is-link">${src?`<img class="card-image" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}" width="768" height="432" loading="lazy" decoding="async">`:''}<div class="card-body"><h3 class="h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3>${tag||date?`<p class="meta small">${tag?`<span>${esc(tag)}</span>`:''}${tag&&date?' ':''}${date?`<time class="num">${esc(date)}</time>`:''}</p>`:''}</div></li>`;}).join('');

  const index=indexCols.map(c=>{const ps=[...c.querySelectorAll('p')]; const label=ps.find(p=>!p.querySelector('a')); return `<li class="card card--tint index-card is-link"><div class="card-body"><h2 class="h2-s">${esc(norm(label?.textContent))}</h2><ul class="link-list">${[...c.querySelectorAll('p a')].map(a=>`<li><a class="arrow" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></li>`).join('')}</ul></div></li>`;}).join('');
  const cmpH=norm(compare.querySelector('h2')?.textContent); const cmpP=compare.querySelector('p');
  const cmpHtml=cmpP.innerHTML.replace(/<a\s([^>]*)>/g,'<a $1 class="link-more" rel="noopener">').replace(/<\/a>/g,`${icons.external}</a>`);

  const mainHtml=`
<h1 class="visually-hidden">${esc(h1)}</h1>
<section class="hero-movement container" data-section="hero-bento" data-intent="route to a regional bank, one offer" data-layout="grid">
${hero}
</section>
<section class="movement" data-section="products" data-intent="route to product areas" data-layout="grid" data-items="${productCols.length}" data-module="content-columns">
  <div class="container"><ul class="bento products tiles" data-slot="cards">${tiles}</ul></div>
</section>
<section class="movement" data-section="membership" data-intent="invite: switch bank, LO membership" data-layout="full-bleed-grid" data-items="${bannerEls.length}" data-module="promo-band">
  <div class="full-bleed"><div class="bento membership">${banners}</div></div>
</section>
<section class="movement" data-section="news" data-intent="cross-link: news and advice" data-layout="grid" data-items="${cards.length}" data-module="card-rail" data-media="image">
  <div class="container"><h2 class="h2-l section-title" data-slot="heading">${esc(norm(relH.textContent))}</h2><ul class="bento news news-grid" data-slot="cards">${newsCards}</ul></div>
</section>
<section class="movement" data-section="index" data-intent="secondary navigation: about and shortcuts" data-layout="grid" data-items="${indexCols.length+1}" data-module="content-columns">
  <div class="container"><ul class="bento index grid-3" data-slot="cards">${index}<li class="card card--frost compare is-link" data-section="compare" data-intent="regulatory: compare prices" data-module="cta-band"><div class="card-body"><h2 class="h2-s" data-slot="heading">${esc(cmpH)}</h2><p data-slot="text">${cmpHtml}</p></div></li></ul></div>
</section>`;

  const css=`
/* hero bento (variant C): router tile full row, campaign text 5 + photo 7 */
.hero-movement{padding-top:24px}
.hero{grid-template-rows:minmax(440px,auto) minmax(420px,auto)}
.campaign{display:contents}
.router--tile{grid-column:1/-1;grid-row:1}
.campaign-text{grid-column:1/span 5;grid-row:2}
.campaign-text .card-body{justify-content:center;padding:56px 48px}
.campaign-copy{margin-top:20px}.campaign-copy .small{margin-top:12px;max-width:46ch}.campaign-copy .actions{margin-top:28px}
.hero-photo{grid-column:6/-1;grid-row:2;margin:0;background:var(--frost-30)}
.hero-photo img{width:100%;height:100%;object-fit:cover;object-position:55% 50%;transition:transform .7s var(--ease)}
.hero:has(.campaign-text:hover) .hero-photo img,.hero:has(.campaign-text:focus-within) .hero-photo img{transform:scale(1.03)}
/* products 3 × 2 */
.product{grid-column:span 4}.product .illu{align-self:flex-start;margin-bottom:14px}.product .link-list{margin-top:18px}
/* membership: illustration tile 2 + teaser 4, twice (full width) */
.membership .card{min-height:300px}
.promo-art{grid-column:span 2;align-items:center;justify-content:center;padding:24px;transition:background-color .35s var(--ease)}
.promo-art img{max-height:190px;width:auto;max-width:100%;transition:transform .5s var(--spring)}
.promo-art:has(+.promo:hover) img,.promo-art:has(+.promo:focus-within) img{transform:scale(1.06) rotate(-2deg)}
.promo-art.card--frost:has(+.promo:hover){background:var(--frost-70)}.promo-art.card--syrin:has(+.promo:hover){background:var(--syrin-70)}
.promo{grid-column:span 4}.promo .card-body{justify-content:center;padding-inline:48px}.promo p{max-width:52ch}
/* news 4-up */
.news-card{grid-column:span 3}.news-card .card-body{padding:32px 28px 40px}.news-card .meta{margin-top:12px}
/* index + compare */
.index-card,.compare{grid-column:span 4;min-height:262px}.index-card .link-list{margin-top:20px}
.compare p{margin-top:16px;max-width:46ch}
@media (max-width:1024px){
  .hero{grid-template-rows:auto auto}.router--tile{min-height:440px}
  .hero-photo{grid-column:1/span 6;grid-row:2;aspect-ratio:4/3}.campaign-text{grid-column:7/-1;grid-row:2}
  .campaign-text .card-body{padding:40px 32px}
  .product{grid-column:span 6}.promo-art{grid-column:span 4}.promo{grid-column:span 8}.news-card{grid-column:span 6}.index-card,.compare{grid-column:span 6}
}
@media (max-width:767px){
  .hero{grid-template-rows:none}.router--tile{grid-row:auto;min-height:0}
  .hero-photo{grid-column:1/-1;grid-row:auto;aspect-ratio:16/9;order:1}.campaign-text{grid-column:1/-1;grid-row:auto;order:2}.campaign-text .card-body{padding:36px 20px}
  .membership .card{min-height:0}.promo-art{padding:20px}.promo-art img{max-height:140px;max-width:60%}.promo .card-body{padding-inline:20px}
  .index-card,.compare{min-height:0}
}
`;
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:mainHtml, css, router:false,
    provenance:{ shapeBrief:'stardust/prototypes/round-01-danske-ramp/README.md (variant C)', dominantDimension:'structure/reference-composition', conceptSeed:'round-01: Danske Bank structure × Ramp type/width/buttons, SB1 brand', unsourcedContent:[], signatureElements:['bankchoice_bg.svg landscape behind the router tile','spot illustrations on product cards (spring on hover)','Fjell / Vann / Skog on Sand-70, Frost-30, Syrin-30 card fills'], improvementsApplied:['hero bento (router tile + campaign 5/7)','2 px cards, 6 px gutters, no shadow','Ramp type scale 64/48/40/28/24','6 px borderless buttons','sticky hide/reveal header','full-width membership row (1 of 8 sections)'] } };
}
