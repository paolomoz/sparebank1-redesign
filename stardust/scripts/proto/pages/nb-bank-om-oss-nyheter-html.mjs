// News listing (nettsider-frontend clientlib) — composition per stardust/prototypes/nb-bank-om-oss-nyheter-html-shape.md; content verbatim from the captured DOM.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
// Frontend-clientlib footer (rendered inside <main>) → the footerData() shape (columns / small / address; no contact tabs).
function frontendFooter(main){
  const f=main.querySelector('footer.footer'); if(!f) return null;
  const columns=[...f.querySelectorAll('.footer-columns__top .footer-columns__column')].filter(c=>c.querySelector('h2')).map(c=>({heading:norm(c.querySelector('h2').textContent),links:[...c.querySelectorAll('li a')].map(a=>({t:norm(a.textContent)||norm(a.getAttribute('title')),href:a.getAttribute('href'),icon:a.querySelector('img')?.getAttribute('src')||null}))}));
  const small=[...f.querySelectorAll('.footer-columns__bottom li a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')}));
  return {contactHeading:'',contactLink:null,tabs:[],columns,small,address:norm(f.querySelector('.footer-info')?.textContent)};
}
const card=c=>{ const a=c.querySelector('a.newscard__click-area'); const img=c.querySelector('img'); return {href:a.getAttribute('href'),src:img?.getAttribute('src')||null,alt:img?.getAttribute('alt')||'',tag:norm(c.querySelector('.tag__item')?.textContent),title:norm(c.querySelector('.newscard__title')?.textContent),date:norm(c.querySelector('.newscard__date')?.textContent)}; };
const meta=k=>`<p class="meta">${k.tag?`<span>${esc(k.tag)}</span>`:''}${k.date?`<time class="num">${esc(k.date)}</time>`:''}</p>`;
export function render({doc,pj}){
  const main=doc.querySelector('main');
  const h1=norm(main.querySelector('.sb1-articles__content h1')?.textContent)||'Nyheter';
  const all=[...main.querySelectorAll('.newscards article.newscard')]; const feat=card(all[0]); const rest=all.slice(1).map(card);
  const more=main.querySelector('.newscards-footer a');
  const items=rest.map(k=>`<li class="news-item${k.src?'':' no-photo'}">${k.src?`<img class="photo photo-sm" src="${asset(k.src)}" alt="${esc(k.alt)}" width="768" height="512" loading="lazy" decoding="async">`:''}<div class="news-text"><h2 class="news-title"><a href="${esc(k.href)}">${esc(k.title)}</a></h2>${meta(k)}</div></li>`).join('');
  const mainHtml=`
<section class="movement featured" data-section="featured" data-intent="the newest story" data-layout="split-media" data-media="image" data-module="article-header" data-items="1">
  <div class="container">
    <h1 data-slot="heading">${esc(h1)}</h1>
    <article class="feat-grid">
      ${feat.src?`<img class="photo feat-photo" src="${asset(feat.src)}" alt="${esc(feat.alt)}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async" data-slot="image">`:''}
      <div class="feat-text">
        <h2 class="feat-title" data-slot="title"><a href="${esc(feat.href)}">${esc(feat.title)}</a></h2>
        ${meta(feat)}
      </div>
    </article>
  </div>
</section>
<section class="movement listing" data-section="listing" data-intent="browse all news" data-layout="grid" data-module="card-rail" data-items="${rest.length}" data-media="image">
  <div class="container">
    <ul class="news-grid" data-slot="cards">${items}</ul>
  </div>
</section>
<section class="movement more" data-section="more" data-intent="next page of the listing" data-layout="contained" data-module="button-row">
  <div class="container"><a class="btn-inline" href="${esc(more.getAttribute('href'))}" data-slot="cta">${esc(norm(more.textContent))}${icons.chevron}</a></div>
</section>`;
  const css=`
.featured{padding-bottom:var(--spacing-xl)}
.featured h1{margin-bottom:var(--spacing-xl)}
.feat-grid{position:relative;display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}
.feat-photo{margin:0}
.feat-text{display:grid;gap:var(--spacing-md);align-content:center}
.feat-title{font-size:var(--t-title);line-height:1.2;max-width:22ch}
.feat-title a,.news-title a{color:var(--fjell);text-decoration:none}
.feat-title a::after,.news-title a::after{content:"";position:absolute;inset:0}
.feat-grid:hover .feat-title a,.feat-grid:focus-within .feat-title a,.news-item:hover .news-title a,.news-item:focus-within .news-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.12em}
.meta{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--moerkgraa);font-family:var(--title-font-family);font-size:var(--label);letter-spacing:.01em}
.meta span+time::before{content:"·";margin-right:12px}
.listing{padding-top:var(--spacing-xl);padding-bottom:var(--spacing-xl)}
.news-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-xl)}
.news-item{position:relative;display:grid;gap:var(--spacing-md);align-content:start}
.news-item .photo{margin:0}
.news-item.no-photo{align-self:end}
.news-text{display:grid;gap:var(--spacing-sm)}
.news-title{font-family:var(--title-font-family);font-size:var(--lead);line-height:1.3;letter-spacing:0}
.more{padding-top:0}
@media (max-width:1023px){
  .feat-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.feat-text{align-content:start}
  .news-grid{grid-template-columns:1fr 1fr;gap:var(--spacing-xl)}
}
@media (max-width:640px){
  .featured h1{margin-bottom:var(--spacing-lg)}
  .news-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}
  .news-item{grid-template-columns:120px minmax(0,1fr);gap:var(--spacing-md);align-items:start;align-self:auto}
  .news-item .photo{width:120px;border-radius:24px 0 24px 0}
  .news-item.no-photo .news-text{grid-column:2}
  .news-title{font-size:var(--body);line-height:1.35}
}
`;
  return { template:'listing', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css, footer:frontendFooter(main),
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-nyheter-html-shape.md', dominantDimension:'composition/featured-spread-flat-grid', conceptSeed:'surface 5c11ed6c read (dealt 4,1,6; 4 built)', unsourcedContent:[], signatureElements:['one-corner-pair photo mask (featured 96px, grid 48px, mobile thumbs 24px)'], improvementsApplied:['#3 1.25 scale','#4 one flat card language, kicker → meta line','#5 featured photo beside the title, never behind it','#6 featured photo at content scale, cards native 3:2'], dynamicsInterim:['"Se flere artikler" kept as the captured page-2 link (dynamics #11 index-backed listing later)'], canonDeviations:[] } };
}
