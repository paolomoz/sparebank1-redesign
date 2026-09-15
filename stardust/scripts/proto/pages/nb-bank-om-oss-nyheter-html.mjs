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
  // Round 01: featured story as a hero bento (Sand-70 text card 5 + bleeding photo card 7), the listing as a 3-up bento of news cards
  // (16:9 bleeding photo, title, meta; the whole card is the link), the page-2 link as one secondary button.
  const items=rest.map(k=>`<li class="card card--tint news-card is-link${k.src?'':' no-photo'}">${k.src?`<img class="card-image" src="${asset(k.src)}" alt="${esc(k.alt)}" width="768" height="432" loading="lazy" decoding="async">`:''}<div class="card-body"><h2 class="h3 news-title"><a class="cover-link" href="${esc(k.href)}">${esc(k.title)}</a></h2>${meta(k)}</div></li>`).join('');
  const cols=rest.length%3===0||rest.length%4!==0?3:4;
  const mainHtml=`
<section class="hero-movement featured container" data-section="featured" data-intent="the newest story" data-layout="bento-cells" data-media="image" data-module="article-header" data-items="1">
  <h1 class="h2-l page-title" data-slot="heading">${esc(h1)}</h1>
  <article class="bento feat-bento${feat.src?'':' no-media'}">
    <div class="card card--tint feat-text is-link"><div class="card-body">
      <h2 class="h2-m feat-title" data-slot="title"><a class="cover-link" href="${esc(feat.href)}">${esc(feat.title)}</a></h2>
      ${meta(feat)}
    </div></div>
    ${feat.src?`<figure class="card feat-photo" data-slot="image"><img src="${asset(feat.src)}" alt="${esc(feat.alt)}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>`:''}
  </article>
</section>
<section class="movement listing" data-section="listing" data-intent="browse all news" data-layout="grid" data-module="card-rail" data-items="${rest.length}" data-media="image">
  <div class="container">
    <ul class="bento news-grid grid-${cols}" data-slot="cards">${items}</ul>
  </div>
</section>
<section class="movement more" data-section="more" data-intent="next page of the listing" data-layout="contained" data-module="button-row">
  <div class="container more-row"><a class="btn btn-secondary btn-lg" href="${esc(more.getAttribute('href'))}" data-slot="cta">${esc(norm(more.textContent))}</a></div>
</section>`;
  const css=`
/* news listing — round 01: hero bento + news-card bento */
.hero-movement{padding-top:24px}
.page-title{margin-bottom:var(--spacing-lg)}
.feat-bento{grid-template-rows:minmax(420px,auto)}
.feat-text{grid-column:1/span 5}.feat-text .card-body{justify-content:center;padding:56px 48px}
.feat-title{max-width:18ch}.feat-text .meta{margin-top:20px}
.feat-bento.no-media .feat-text{grid-column:1/-1;min-height:0}
.feat-photo{grid-column:6/-1;margin:0;background:var(--frost-30)}
.feat-photo img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease)}
.feat-bento:has(.feat-text:hover) .feat-photo img,.feat-bento:has(.feat-text:focus-within) .feat-photo img{transform:scale(1.03)}
.card .meta{font-size:var(--body-sm)}.meta span+time::before{content:"·";margin-right:14px;color:var(--graa)}
.news-card .card-body{padding:32px 28px 40px}.news-card .meta{margin-top:12px}
.more{padding-top:var(--spacing-lg)}.more-row{display:flex;justify-content:center}
@media (max-width:1024px){
  .feat-bento{grid-template-rows:auto}.feat-text{grid-column:1/-1}.feat-text .card-body{padding:40px 32px}.feat-title{max-width:none}
  .feat-photo{grid-column:1/-1;order:-1}.feat-photo img{aspect-ratio:16/9;height:auto}
}
@media (max-width:767px){
  .page-title{margin-bottom:var(--spacing-md)}
  .feat-text .card-body{padding:36px 20px}
  .news-card .card-body{padding:28px 20px 32px}
}
`;
  return { template:'listing', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css, footer:frontendFooter(main),
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-nyheter-html-shape.md', dominantDimension:'composition/featured-spread-flat-grid', conceptSeed:'surface 5c11ed6c read (dealt 4,1,6; 4 built)', unsourcedContent:[], signatureElements:['hero bento: Sand-70 text card 5 + bleeding photo card 7','3-up news-card bento (16:9 bleeding photos, 6 px gutters)'], improvementsApplied:['round 01: featured story as a hero bento, listing as a card bento, page-2 link as one secondary button','#4 one card language, kicker → meta line','#5 featured photo beside the title, never behind it'], dynamicsInterim:['"Se flere artikler" kept as the captured page-2 link (dynamics #11 index-backed listing later)'], canonDeviations:[] } };
}
