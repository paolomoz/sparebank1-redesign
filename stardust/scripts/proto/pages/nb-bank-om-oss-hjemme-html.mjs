// Campaign landing (om-oss/hjemme, nettsider-frontend clientlib) — composition per stardust/prototypes/nb-bank-om-oss-hjemme-html-shape.md; content verbatim.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const btnKind=cls=>/--secondary/.test(cls)?'btn-secondary':/inline-button|tertiary/.test(cls)?'btn-inline':'btn-primary'; // captured --action here = meeting/see-more, not apply → Vann (Skog reservation)
const bgUrl=el=>{ const s=el?.getAttribute('style')||''; return (s.match(/url\((?:"([^"]*)"|'([^']*)'|([^)]+))/)||[]).slice(1).find(Boolean)||''; };

// Frontend-clientlib footer lives inside <main>: build footerData()-shaped data from it.
function footerFromMain(doc){
  const f=doc.querySelector('main footer'); if(!f) return null;
  const columns=[...f.querySelectorAll('.footer-columns__top .footer-columns__column')].filter(c=>c.querySelector('h2')).map(c=>({heading:norm(c.querySelector('h2').textContent),links:[...c.querySelectorAll('li a')].map(a=>({t:norm(a.textContent)||norm(a.getAttribute('title')),href:a.getAttribute('href'),icon:a.querySelector('img')?.getAttribute('src')||null}))}));
  const small=[...f.querySelectorAll('.footer-columns__bottom li a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')}));
  return {contactHeading:'',contactLink:null,tabs:[],columns,small,address:norm(f.querySelector('.footer-info')?.textContent)};
}

export function render({doc,pj}){
  const body=doc.querySelector('main .sb1-story__body');
  const blocks=[...body.children];
  const video=(v,i,cap=true)=>{ const vid=v.querySelector('video'); const src=vid.querySelector('source'); const icon=v.querySelector('img.video__placeholder'); const title=vid.getAttribute('title')||''; return `<figure class="video-fig"><video class="video" controls playsinline muted loop preload="metadata" title="${esc(title)}" width="1200" height="800"><source src="${asset(src.getAttribute('src'))}" type="${esc(src.getAttribute('type')||'video/mp4')}">${esc(norm(vid.textContent))}</video>${cap?`<figcaption class="small muted video-cap">${icon?`<img src="${asset(icon.getAttribute('src'))}" alt="" aria-hidden="true" width="24" height="24" loading="lazy" decoding="async">`:''}<span>${esc(title)}</span></figcaption>`:''}</figure>`; };
  const hero=blocks[0]; const h1=hero.querySelector('h1');
  const ch1=blocks[1]; const ch1H=ch1.querySelector('h1'); const ch1Ps=[...ch1.querySelectorAll('.text-content p')];
  const slidesC=blocks.find(b=>b.classList.contains('slidescontainer')&&b.querySelector('h2'));
  const slides=[...slidesC.children].map(s=>({img:bgUrl(s.querySelector('.image__background')),h:s.querySelector('h2'),p:s.querySelector('.text-content p'),btns:[...s.querySelectorAll('a.ffe-button')]}));
  const texts=[...body.querySelectorAll(':scope > .text')]; const ch2H=texts.find(t=>t.querySelector('h1')&&t!==ch1)?.querySelector('h1'); const ch2Body=texts.find(t=>!t.querySelector('h1')&&t.querySelector('p'));
  const ch2Btn=body.querySelector(':scope > .button a');
  const videoBlocks=[...body.querySelectorAll('video')].map(v=>v.closest('.block--full'));
  const closing=[...body.querySelectorAll(':scope > .slidescontainer')].find(s=>!s.querySelector('video')&&s!==slidesC);
  const closingImg=bgUrl(closing.querySelector('.image__background')); const closingH=closing.querySelector('h2');
  const footer=footerFromMain(doc);

  // Round 01: every row is a bento of cards. Hero = Frost-30 statement card 5 + video card 7; chapters = title tile (Fjell / Frost) + Sand-70 prose
  // card; the three offers = a 3-up card bento (portrait photo bleeding on top, one primary button, the second action as an arrow link);
  // film = video card 8 + Syrin-30 caption card 4; closing = portrait photo card 5 + Fjell statement tile 7. No section tints, no dividers.
  const slideCards=slides.map((s,i)=>{ const ctas=s.btns.map((a,j)=>j===0?`<a class="btn btn-primary" data-slot="cta" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`:`<a class="arrow" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('');
    const id=i===0?' id="kontakt"':i===2?' id="blikunde"':''; return `<li class="card card--tint slide"${id} data-module="split-media" data-media="image">
      <img class="card-image card-image--tall" src="${asset(s.img)}" alt="" width="1280" height="1280" loading="lazy" decoding="async" data-deviation="portrait source 1280x2276 — 1:1 frame instead of the 16:9 card image">
      <div class="card-body"><h2 class="h3" data-slot="heading">${esc(norm(s.h.textContent))}</h2><p data-slot="text">${esc(norm(s.p.textContent))}</p><p class="actions">${ctas}</p></div>
    </li>`; }).join('');
  const filmVid=videoBlocks[1].querySelector('video'); const filmSrc=filmVid.querySelector('source'); const filmIcon=videoBlocks[1].querySelector('img.video__placeholder'); const filmTitle=filmVid.getAttribute('title')||'';

  const mainHtml=`
<section class="hero-movement container hero" data-section="hero" data-intent="campaign statement, video as content" data-layout="bento-cells" data-media="video" data-module="video-hero">
  <div class="bento hero-bento">
    <div class="card card--frost hero-text"><div class="card-body"><h1 class="h1" data-slot="heading">${esc(norm(h1.textContent))}</h1></div></div>
    <div class="card hero-media" data-slot="video">${video(hero,0,false)}</div>
  </div>
</section>
<section class="movement chapter" data-section="chapter-1" data-intent="story: local advisers" data-layout="bento-cells" data-module="story-text">
  <div class="container"><div class="bento chapter-bento">
    <div class="card card--dark chapter-tile"><div class="card-body"><h2 class="h2-m chapter-title" data-slot="heading">${esc(norm(ch1H.textContent))}</h2></div></div>
    <div class="card card--tint chapter-text"><div class="card-body prose" data-slot="text">${ch1Ps.map((p,i)=>`<p${i===0?' class="lead"':''}>${esc(norm(p.textContent))}</p>`).join('')}</div></div>
  </div></div>
</section>
<section class="movement slides" data-section="slides" data-intent="offers: adviser, business, switch" data-layout="grid" data-items="${slides.length}" data-module="split-media" data-media="image">
  <div class="container"><ul class="bento slide-list grid-${Math.min(slides.length,4)}" data-slot="cards">${slideCards}</ul></div>
</section>
<section class="movement chapter" id="samfunn" data-section="chapter-2" data-intent="story: sport and culture sponsorship" data-layout="bento-cells" data-module="story-text">
  <div class="container"><div class="bento chapter-bento chapter-bento--rev">
    <div class="card card--frost chapter-tile"><div class="card-body"><h2 class="h2-m chapter-title" data-slot="heading">${esc(norm(ch2H.textContent))}</h2></div></div>
    <div class="card card--tint chapter-text"><div class="card-body prose" data-slot="text">${[...ch2Body.querySelectorAll('.text-content p')].map(p=>`<p>${esc(norm(p.textContent))}</p>`).join('')}<p class="actions"><a class="btn btn-primary" data-slot="cta" data-cta="primary" href="${esc(ch2Btn.getAttribute('href'))}">${esc(norm(ch2Btn.textContent))}</a></p></div></div>
  </div></div>
</section>
<section class="movement film" data-section="closing-video" data-intent="campaign film" data-layout="bento-cells" data-media="video" data-module="video">
  <div class="container"><figure class="bento film-bento" data-slot="video">
    <div class="card film-media"><video class="video" controls playsinline muted loop preload="metadata" title="${esc(filmTitle)}" width="1200" height="800"><source src="${asset(filmSrc.getAttribute('src'))}" type="${esc(filmSrc.getAttribute('type')||'video/mp4')}">${esc(norm(filmVid.textContent))}</video></div>
    <figcaption class="card card--syrin film-cap"><div class="card-body">${filmIcon?`<img class="film-icon" src="${asset(filmIcon.getAttribute('src'))}" alt="" aria-hidden="true" width="48" height="48" loading="lazy" decoding="async">`:''}<span class="h2-s">${esc(filmTitle)}</span></div></figcaption>
  </figure></div>
</section>
<section class="movement closing" data-section="closing" data-intent="closing statement" data-layout="bento-cells" data-media="image" data-module="split-media">
  <div class="container"><div class="bento closing-bento">
    <figure class="card closing-media"><img src="${asset(closingImg)}" alt="" width="1280" height="1600" loading="lazy" decoding="async" data-deviation="portrait source 1280x2276 — fills the photo cell (object-fit cover)"></figure>
    <div class="card card--dark closing-card"><div class="card-body"><h2 class="h2-l closing-title" data-slot="heading">${esc(norm(closingH.textContent))}</h2></div></div>
  </div></div>
</section>`;

  const css=`
/* campaign landing — round 01: every row a bento of cards */
.hero-movement{padding-top:24px}
.hero-bento{grid-template-rows:minmax(480px,auto)}
.hero-text{grid-column:1/span 5}.hero-text .card-body{justify-content:center;padding:56px 48px}.hero-text .h1{max-width:12ch}
.hero-media{grid-column:6/-1;background:var(--frost-30)}
.video-fig{margin:0;display:flex;flex:1 1 auto;min-height:0}
.hero-media .video,.film-media .video{display:block;width:100%;height:100%;flex:1 1 auto;min-height:0;object-fit:cover;background:var(--frost-30)}
.chapter-bento{grid-template-rows:minmax(360px,auto)}
.chapter-tile{grid-column:1/span 5}.chapter-tile .card-body{justify-content:center;padding:56px 48px}.chapter-title{max-width:14ch}
.chapter-text{grid-column:6/-1}.chapter-text .card-body{justify-content:center;padding:56px 48px;max-width:none}
.chapter-text .prose>p+p{margin-top:var(--spacing-md)}.chapter-text .lead{max-width:none}.chapter-text .actions{margin-top:var(--spacing-lg)}
.chapter-bento--rev .chapter-tile{grid-column:8/-1;grid-row:1}.chapter-bento--rev .chapter-text{grid-column:1/span 7;grid-row:1}
.card-image--tall{aspect-ratio:1/1;object-position:50% 25%}
.slide .card-body{padding:32px 28px 40px}.slide .actions{align-items:center;gap:12px 24px;margin-top:var(--spacing-lg)}.slide .actions .arrow{min-height:40px}
.film-bento{margin:0;grid-template-rows:minmax(420px,auto)}
.film-media{grid-column:1/span 8;display:flex}
.film-cap{grid-column:9/-1}.film-cap .card-body{justify-content:center;align-items:flex-start}.film-icon{width:48px;height:48px}.film-cap .h2-s{display:block;margin-top:16px}
.closing-bento{grid-template-rows:minmax(520px,auto)}
.closing-media{grid-column:1/span 5;margin:0;background:var(--frost-30)}.closing-media img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.closing-card{grid-column:6/-1}.closing-card .card-body{justify-content:center;padding:56px 48px}.closing-title{max-width:14ch}
@media (max-width:1024px){
  .hero-bento,.chapter-bento,.film-bento,.closing-bento{grid-template-rows:auto}
  .hero-text{grid-column:1/-1}.hero-text .card-body{padding:40px 32px}.hero-text .h1{max-width:none}
  .hero-media{grid-column:1/-1;order:-1}.hero-media .video{aspect-ratio:16/9;height:auto;flex:none}
  .chapter-tile,.chapter-bento--rev .chapter-tile{grid-column:1/-1;grid-row:auto;min-height:0}.chapter-tile .card-body{padding:40px 32px}.chapter-title{max-width:none}
  .chapter-text,.chapter-bento--rev .chapter-text{grid-column:1/-1;grid-row:auto}.chapter-text .card-body{padding:40px 32px}
  .slide-list>.card{grid-column:span 6}
  .film-media{grid-column:1/-1}.film-media .video{aspect-ratio:16/9;height:auto;flex:none}.film-cap{grid-column:1/-1}.film-cap .card-body{padding:28px 32px}
  .closing-media{grid-column:1/-1;aspect-ratio:16/9}.closing-media img{object-position:50% 30%}.closing-card{grid-column:1/-1}.closing-card .card-body{padding:40px 32px}.closing-title{max-width:none}
}
@media (max-width:767px){
  .hero-text .card-body,.chapter-tile .card-body,.chapter-text .card-body,.closing-card .card-body{padding:36px 20px}
  .slide-list>.card{grid-column:1/-1}.slide .card-body{padding:28px 20px 32px}.slide .actions .btn{width:100%}
  .film-cap .card-body{padding:24px 20px}.closing-media{aspect-ratio:4/5}
}
`;
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:mainHtml, css, router:false, footer,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-hjemme-html-shape.md', dominantDimension:'composition/split-media-story', conceptSeed:'surface d445fcf7 (dealt 7,6,2; 7 built)', unsourcedContent:[], clientlib:'nettsider-frontend — header/footer inside <main>; footer built from main > footer', signatureElements:['hero bento: Frost-30 statement card 5 + video card 7','Fjell statement tiles (chapter 1, closing)','3-up offer cards with bleeding portrait photos'], improvementsApplied:['round 01: every row a bento of 2 px cards with 6 px gutters; section tints and dividers removed; Ramp display H1','#2 calm header (om-oss variant)','#5 no type over video/photo — media beside text','#7 anchors kept as ids'] } };
}
