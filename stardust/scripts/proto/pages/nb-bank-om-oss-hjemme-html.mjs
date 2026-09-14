// Campaign landing (om-oss/hjemme, nettsider-frontend clientlib) — composition per stardust/prototypes/nb-bank-om-oss-hjemme-html-shape.md; content verbatim.
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const btnKind=cls=>/--secondary/.test(cls)?'btn-secondary':/inline-button|tertiary/.test(cls)?'btn-inline':'btn-primary'; // captured --action here = meeting/see-more, not apply → Vann (Skog reservation)
const bgUrl=el=>{ const s=el?.getAttribute('style')||''; return (s.match(/url\(["']?([^"')]+)/)||[])[1]||''; };

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

  const slideRows=slides.map((s,i)=>{ const ctas=s.btns.map((a,j)=>`<a class="btn ${j===0?'btn-primary':'btn-secondary'}"${j===0?' data-slot="cta"':''} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('');
    const id=i===0?' id="kontakt"':i===2?' id="blikunde"':''; return `<article class="slide${i%2?' slide-rev':''}"${id} data-module="split-media" data-media="image">
      <figure class="slide-media"><img class="photo photo-sm photo-portrait" src="${asset(s.img)}" alt="" width="1280" height="1600" loading="lazy" decoding="async" data-deviation="portrait source 1280x2276 — 4:5 frame instead of canon 3:2"></figure>
      <div class="slide-text"><h2 data-slot="heading">${esc(norm(s.h.textContent))}</h2><p class="lead" data-slot="text">${esc(norm(s.p.textContent))}</p><p class="cta-row">${ctas}</p></div>
    </article>`; }).join('');

  const mainHtml=`
<section class="movement hero" data-section="hero" data-intent="campaign statement, video as content" data-layout="split-media" data-media="video" data-module="video-hero">
  <div class="container hero-grid">
    <div class="hero-text"><h1 class="display" data-slot="heading">${esc(norm(h1.textContent))}</h1></div>
    <div class="hero-media" data-slot="video">${video(hero,0,false)}</div>
  </div>
</section>
<section class="movement paper-sand chapter" data-section="chapter-1" data-intent="story: local advisers" data-layout="contained" data-module="story-text">
  <div class="container chapter-grid">
    <h2 class="chapter-title" data-slot="heading">${esc(norm(ch1H.textContent))}</h2>
    <div class="prose" data-slot="text">${ch1Ps.map((p,i)=>`<p${i===0?' class="lead"':''}>${esc(norm(p.textContent))}</p>`).join('')}</div>
  </div>
</section>
<section class="movement paper-frost slides" data-section="slides" data-intent="offers: adviser, business, switch" data-layout="grid" data-items="${slides.length}" data-module="split-media" data-media="image">
  <div class="container slide-list">${slideRows}</div>
</section>
<section class="movement chapter" id="samfunn" data-section="chapter-2" data-intent="story: sport and culture sponsorship" data-layout="contained" data-module="story-text">
  <div class="container chapter-grid">
    <h2 class="chapter-title" data-slot="heading">${esc(norm(ch2H.textContent))}</h2>
    <div class="prose" data-slot="text">${[...ch2Body.querySelectorAll('.text-content p')].map(p=>`<p>${esc(norm(p.textContent))}</p>`).join('')}<p class="cta-row"><a class="btn btn-primary" data-slot="cta" data-cta="primary" href="${esc(ch2Btn.getAttribute('href'))}">${esc(norm(ch2Btn.textContent))}</a></p></div>
  </div>
</section>
<section class="movement film" data-section="closing-video" data-intent="campaign film" data-layout="contained" data-media="video" data-module="video">
  <div class="container film-grid" data-slot="video">${video(videoBlocks[1],1)}</div>
</section>
<section class="movement closing" data-section="closing" data-intent="closing statement" data-layout="split-media" data-media="image" data-module="split-media">
  <div class="container closing-grid">
    <figure class="closing-media"><img class="photo photo-sm photo-portrait" src="${asset(closingImg)}" alt="" width="1280" height="1600" loading="lazy" decoding="async" data-deviation="portrait source 1280x2276 — 4:5 frame instead of canon 3:2"></figure>
    <h2 class="closing-title" data-slot="heading">${esc(norm(closingH.textContent))}</h2>
  </div>
</section>`;

  const css=`
.hero{padding-top:var(--spacing-xl)}
.hero-grid{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:center}
.hero-media{grid-column:1;grid-row:1}.hero-text{grid-column:2;grid-row:1}
.hero-text .display{max-width:17ch}
.video-fig{margin:0;display:grid;gap:var(--spacing-sm)}
.video{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;background:var(--frost-30);border-radius:var(--radius-img) 0 0 0}
.film .video{border-radius:var(--radius-img-sm) 0 0 0}
.video-cap{display:flex;align-items:center;gap:8px}.video-cap img{width:24px;height:24px}
.chapter-grid{display:grid;grid-template-columns:5fr 7fr;gap:var(--spacing-xl);align-items:start}
.chapter-title{font-size:var(--t-headline);line-height:var(--line-height-heading);max-width:16ch}
.prose .lead{max-width:none}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm) var(--spacing-md);margin-top:var(--spacing-sm)}
.slide-list{display:grid;gap:var(--spacing-2xl)}
.slide{display:grid;grid-template-columns:26rem minmax(0,1fr);gap:var(--spacing-xl);align-items:center}
.slide-media{margin:0;grid-column:1;grid-row:1}.slide-text{grid-column:2;grid-row:1;display:grid;gap:var(--spacing-md);max-width:38rem}
.slide-rev{grid-template-columns:minmax(0,1fr) 26rem}.slide-rev .slide-media{grid-column:2}.slide-rev .slide-text{grid-column:1;justify-self:end}

.photo-portrait{aspect-ratio:4/5;max-width:26rem}
.film-grid{display:grid;grid-template-columns:7fr 5fr}
.closing{border-top:1px solid var(--lysgraa)}
.closing-grid{display:grid;grid-template-columns:26rem minmax(0,1fr);gap:var(--spacing-xl);align-items:center}
.closing-media{margin:0}.closing-title{font-size:var(--t-headline);line-height:var(--line-height-heading);max-width:18ch}
@media (max-width:1023px){
  .hero-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.hero-text{grid-column:1;grid-row:1}.hero-media{grid-column:1;grid-row:2}.hero-text .display{max-width:none}.video{aspect-ratio:16/9}
  .chapter-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.chapter-title{max-width:none}
  .slide{grid-template-columns:20rem minmax(0,1fr)}.slide-rev{grid-template-columns:minmax(0,1fr) 20rem}.slide-text,.slide-rev .slide-text{max-width:none}
  .photo-portrait{max-width:22rem}
  .film-grid{grid-template-columns:1fr}
  .closing-grid{grid-template-columns:20rem minmax(0,1fr)}.closing-title{max-width:none}
}
@media (max-width:640px){.hero{padding-top:var(--spacing-lg)}.slide-list{gap:var(--spacing-xl)}.slide,.slide-rev{grid-template-columns:1fr;gap:var(--spacing-lg)}.slide .slide-text,.slide-rev .slide-text{grid-column:1;grid-row:1}.slide .slide-media,.slide-rev .slide-media{grid-column:1;grid-row:2}.closing-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.closing-media{grid-row:2}.photo-portrait{max-width:none;aspect-ratio:1/1}}
`;
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:mainHtml, css, router:false, footer,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-hjemme-html-shape.md', dominantDimension:'composition/split-media-story', conceptSeed:'surface d445fcf7 (dealt 7,6,2; 7 built)', unsourcedContent:[], clientlib:'nettsider-frontend — header/footer inside <main>; footer built from main > footer', signatureElements:['one-corner-pair mask on video frame (96px) and portrait photos (48px)','campaign videos at content scale'], improvementsApplied:['#2 calm header (om-oss variant)','#3 1.25 scale: one display H1, chapter h2 at headline','#4 no floating cards','#5 no type over video/photo — media beside text','#6 photos as content at 4:5','#7 movements on paper, anchors kept as ids'] } };
}
