// News article (nettsider-frontend clientlib) — composition per stardust/prototypes/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html-shape.md; content verbatim from the captured DOM.
import { esc, asset } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
// Lift an RTE block as HTML: keep h2/p/ul/li/strong/em/a/br, drop editor attributes and empty paragraphs.
const rte=el=>el.innerHTML.replace(/\s(data-[a-z-]+|class|style|id)="[^"]*"/g,'').replace(/<p>\s*(&#160;|&nbsp;)?\s*<\/p>/g,'').replace(/\s+/g,' ').trim();
// Frontend-clientlib footer (rendered inside <main>) → the footerData() shape (columns / small / address; no contact tabs).
export function frontendFooter(main){
  const f=main.querySelector('footer.footer'); if(!f) return null;
  const columns=[...f.querySelectorAll('.footer-columns__top .footer-columns__column')].filter(c=>c.querySelector('h2')).map(c=>({heading:norm(c.querySelector('h2').textContent),links:[...c.querySelectorAll('li a')].map(a=>({t:norm(a.textContent)||norm(a.getAttribute('title')),href:a.getAttribute('href'),icon:a.querySelector('img')?.getAttribute('src')||null}))}));
  const small=[...f.querySelectorAll('.footer-columns__bottom li a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')}));
  return {contactHeading:'',contactLink:null,tabs:[],columns,small,address:norm(f.querySelector('.footer-info')?.textContent)};
}
export function render({doc,pj}){
  const main=doc.querySelector('main'); const art=main.querySelector('.sb1-article');
  const head=art.querySelector('.sb1-article__header');
  const hero=head.querySelector('.sb1-article__header-image img'); const heroCap=norm(head.querySelector('.sb1-article__header-image figcaption')?.textContent);
  const tag=norm(head.querySelector('.tag__item')?.textContent); const h1=norm(head.querySelector('h1').textContent); const date=norm(head.querySelector('.author-text__date')?.textContent);
  const share=[...head.querySelectorAll('.some__item-button')].map(b=>{ const svg=b.querySelector('svg').outerHTML.replace(/\s(width|height|class)="[^"]*"/g,'').replace(/#005aa4/g,'currentColor').replace(/<svg/,'<svg aria-hidden="true" focusable="false"'); return `<li><button type="button" class="share-btn" aria-label="${esc(b.getAttribute('aria-label'))}">${svg}</button></li>`; }).join('');
  const blocks=[...art.querySelectorAll('.sb1-article__content > *')];
  const teaser=blocks.find(b=>b.classList.contains('sb1-article__content-teaser')); const lead=norm(teaser?.querySelector('.text-content p')?.textContent);
  let body=''; let items=0;
  for(const b of blocks){ if(b===teaser) continue; items++;
    if(b.classList.contains('infoBox')){ body+=`<aside class="factbox" aria-label="${esc(norm(b.querySelector('h2')?.textContent))}">${rte(b.querySelector('.text-content'))}</aside>`; continue; }
    if(b.classList.contains('image')){ const img=b.querySelector('img'); const cap=norm(b.querySelector('figcaption')?.textContent); body+=`<figure class="art-figure"><img class="photo photo-sm" src="${asset(img.getAttribute('src'))}" alt="${esc(img.getAttribute('alt')||'')}" width="1280" height="1280" loading="lazy" decoding="async">${cap?`<figcaption class="small muted">${esc(cap)}</figcaption>`:''}</figure>`; continue; }
    const tc=b.querySelector('.text-content'); if(tc) body+=rte(tc);
  }
  const relH=norm(art.querySelector('.related-list h2')?.textContent);
  const rel=[...art.querySelectorAll('.related-list__item a')].map(a=>{ const img=a.querySelector('img'); return `<li class="rail-item"><img class="photo photo-sm" src="${asset(img.getAttribute('src'))}" alt="${esc(img.getAttribute('alt')||'')}" width="768" height="512" loading="lazy" decoding="async"><h3 class="rail-title"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.querySelector('.related-list__text')?.textContent||a.textContent))}</a></h3></li>`; }).join('');
  const temaH=norm(art.querySelector('.tags h2')?.textContent);
  const tema=[...art.querySelectorAll('.tags a')].map(a=>`<li><a class="badge" href="${esc(a.getAttribute('href'))}" data-deviation="canon lacks .badge (DESIGN.md § Badges); local pill">${esc(norm(a.textContent))}</a></li>`).join('');
  const mainHtml=`
<article class="article">
<section class="movement art-head" data-section="article-header" data-intent="headline, meta, lead; the photo as content" data-layout="split-media" data-media="image" data-module="article-header">
  <div class="container art-head-grid">
    <div class="art-title">
      <h1 data-slot="heading">${esc(h1)}</h1>
      <p class="byline" data-slot="meta">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time>${esc(date)}</time>`:''}</p>
    </div>
    <figure class="art-media" data-slot="image">
      <img class="photo" src="${asset(hero.getAttribute('src'))}" alt="${esc(hero.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async">
      ${heroCap?`<figcaption class="small muted">${esc(heroCap)}</figcaption>`:''}
    </figure>
    <div class="art-lead">
      <p class="lead" data-slot="text">${esc(lead)}</p>
      <ul class="share" aria-label="Del artikkelen" data-slot="share">${share}</ul>
    </div>
  </div>
</section>
<section class="movement art-body" data-section="article-body" data-intent="read the story" data-layout="prose-aside" data-module="article-body" data-items="${items}">
  <div class="container body-grid">
    <div class="prose" data-slot="body">${body}</div>
    <aside class="rail" data-section="related" data-intent="cross-link: related articles and themes" data-layout="rail" data-module="card-rail" data-items="${rel.split('<li').length-1}" data-media="image" aria-labelledby="rel-h">
      <div class="rail-group"><h2 class="title-sm" id="rel-h" data-slot="heading">${esc(relH)}</h2><ul class="rail-list" data-slot="cards" data-deviation="photo mask 24px on 120px thumbnails (canon .photo-sm 48px would consume the image)">${rel}</ul></div>
      <div class="rail-group"><h2 class="title-sm" data-slot="heading">${esc(temaH)}</h2><ul class="tema" data-slot="tags">${tema}</ul></div>
    </aside>
  </div>
</section>
</article>`;
  const css=`
.art-head{padding-bottom:var(--spacing-lg)}
.art-head-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:"title media" "lead media";gap:var(--spacing-md) var(--spacing-xl);align-items:start}
.art-title{grid-area:title;display:grid;gap:var(--spacing-sm);align-content:start}.art-title h1{max-width:22ch}
.byline{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--moerkgraa);font-size:var(--body-sm);line-height:1.45}
.byline span+time::before{content:"·";margin-right:12px;color:var(--graa)}
.art-media{grid-area:media;margin:0;display:grid;gap:var(--spacing-sm)}
.art-lead{grid-area:lead;display:grid;gap:var(--spacing-lg);align-content:start;align-self:start}.art-lead .lead{max-width:60ch}
.share{display:flex;gap:var(--spacing-sm)}
.share-btn{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border-radius:50%;border:1px solid var(--lysgraa);background:#fff;color:var(--vann);cursor:pointer;transition:background-color var(--dur) var(--ease),border-color var(--dur) var(--ease)}
.share-btn svg{width:22px;height:22px}.share-btn:hover{background:var(--frost-30);border-color:var(--vann)}
.art-body{padding-top:var(--spacing-lg)}
.body-grid{display:grid;grid-template-columns:minmax(0,68ch) minmax(0,1fr);gap:var(--spacing-3xl);align-items:start}
.prose h2{margin:var(--spacing-xl) 0 var(--spacing-md);max-width:24ch}.prose>p:first-child{margin-top:0}
.prose p+h2{margin-top:var(--spacing-xl)}
.art-figure{margin:var(--spacing-xl) 0;display:grid;gap:var(--spacing-sm)}
.art-figure .photo{object-position:50% 25%}
.factbox{display:grid;gap:var(--spacing-md);margin-top:var(--spacing-xl);padding:var(--spacing-lg);background:var(--sand-30);border-radius:var(--radius)}
.factbox h2{margin:0;font-size:var(--t-title)}.factbox ul{display:grid;gap:var(--spacing-sm);margin:0;padding-left:1.2em;list-style:disc}.factbox li{margin:0}.factbox li::marker{color:var(--vann)}
.rail{display:grid;gap:var(--spacing-xl);position:sticky;top:var(--spacing-lg)}
.rail-group{display:grid;gap:var(--spacing-md)}
.rail-list{display:grid;gap:var(--spacing-md)}
.rail-item{position:relative;display:grid;grid-template-columns:120px minmax(0,1fr);gap:var(--spacing-md);align-items:center}
.rail-item .photo{margin:0;width:120px;background:var(--frost-30);border-radius:24px 0 24px 0}/* 48px mask would consume a 120px thumb — see data-deviation on .rail-list */
.rail-title{font-family:var(--title-font-family);font-size:var(--body);line-height:1.35;letter-spacing:0}
.rail-title a{color:var(--fjell);text-decoration:none}.rail-title a::after{content:"";position:absolute;inset:0}.rail-item:hover .rail-title a,.rail-item:focus-within .rail-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.12em}
.tema{display:flex;flex-wrap:wrap;gap:var(--spacing-sm)}
.badge{display:inline-flex;align-items:center;min-height:40px;padding:6px 16px;border-radius:var(--radius-pill);background:var(--frost-30);color:var(--fjell);font-family:var(--title-font-family);font-size:var(--label);letter-spacing:.01em;text-decoration:none;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease)}
.badge:hover{background:var(--vann);color:#fff}.badge:visited{color:var(--fjell)}
@media (max-width:1023px){
  .art-head-grid{grid-template-columns:1fr;grid-template-areas:"title" "media" "lead";gap:var(--spacing-lg)}.art-media{max-width:600px}
  .body-grid{grid-template-columns:1fr;gap:var(--spacing-2xl)}
  .rail{position:static}.rail-list{grid-template-columns:1fr 1fr;gap:var(--spacing-lg)}
}
@media (max-width:640px){
  .art-media{max-width:none}
  .art-figure{margin:var(--spacing-lg) 0}
  .rail-list{grid-template-columns:1fr}
  .factbox{padding:20px}
}
`;
  return { template:'article', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css, footer:frontendFooter(main),
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html-shape.md', dominantDimension:'composition/reading-room-spread', conceptSeed:'surface adc00a6a read (dealt 4,5,7; 4 built)', unsourcedContent:[], signatureElements:['one-corner-pair photo mask (hero 96px, portrait + rail 48px)'], improvementsApplied:['#3 1.25 scale headline','#4 flat related rail, kicker → meta line','#5 photo beside the headline, never behind it','#6 hero photo at content scale'], dynamicsInterim:['share buttons static type=button (captured JS share handlers, no href)'], canonDeviations:['.badge (local pill; canon lacks DESIGN.md § Badges)'] } };
}
