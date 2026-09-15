// News article (nettsider-frontend clientlib) — composition per stardust/prototypes/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html-shape.md; content verbatim from the captured DOM.
// Family renderer (Path A′): walks the captured article body IN CAPTURED ORDER and maps every frontend component (.text · .image · .infoBox ·
// .button/.buttongroup · section.quote · .text-and-image · .video · .block--full · .columns-*) to the module's shapes; two captured layouts are
// handled — `.sb1-article` (header + content + aside) and `.sb1-story__body` (story blocks, H1 inside the first full-bleed block).
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').trim();
const EMPTY=/^[\s ]*$/;
// Lift an RTE block as HTML: keep h2/p/ul/li/strong/em/a/br, drop editor attributes and empty paragraphs.
const rte=el=>el?el.innerHTML.replace(/<span class="(h[1-6])">([\s\S]*?)<\/span>/g,'<strong>$2</strong>').replace(/\s(data-[a-z-]+|class|style|id|target|rel)="[^"]*"/g,'').replace(/<p>\s*(&#160;|&nbsp;|<br>)?\s*<\/p>/g,'').replace(/<a href="(http[^"]*)"/g,(m,h)=>/sparebank1\.no/.test(h)?m:`<a href="${h}" rel="noopener"`).replace(/\s+/g,' ').trim():'';
// Verbatim fallback for an unmapped captured block: clone, drop UI-only nodes (glossary modals, svg, buttons without href), strip attributes.
function rich(el){
  if(!el) return ''; const c=el.cloneNode(true);
  for(const x of c.querySelectorAll('script,style,link,svg,noscript,.glossary-modal,.glossary-backdrop,button,.hide,[hidden]')) x.remove();
  for(const x of c.querySelectorAll('*')){ if(x.tagName==='IMG'){ x.setAttribute('src',asset(x.getAttribute('data-lazy-src')||x.getAttribute('src'))); x.setAttribute('alt',x.getAttribute('alt')||''); x.setAttribute('loading','lazy'); x.setAttribute('decoding','async'); for(const a of ['style','srcset','sizes','class','width','height','role']) x.removeAttribute(a); continue; } for(const a of [...x.attributes].map(a=>a.name)){ if(!/^(href|alt|colspan|rowspan|scope)$/.test(a)) x.removeAttribute(a); } }
  for(const s of [...c.querySelectorAll('span')]){ s.replaceWith(...s.childNodes); }
  for(const x of [...c.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,div')]){ if(EMPTY.test(x.textContent)&&!x.querySelector('img,video')) x.remove(); }
  for(const a of c.querySelectorAll('a[href^="http"]')){ if(!/sparebank1\.no/.test(a.getAttribute('href'))) a.setAttribute('rel','noopener'); }
  return c.innerHTML.replace(/\s+/g,' ').trim();
}
const btnClass=a=>/ffe-button--action/.test(a.className)?'btn btn-action':(/ffe-button--secondary/.test(a.className)?'btn btn-secondary':(/tertiary|ffe-inline-button/.test(a.className)?'btn-inline':'btn btn-primary'));
const vis=a=>/(^|\s)hide-phone(\s|$)/.test(a.className)?' hide-phone':(/(^|\s)hide-desktop(\s|$)/.test(a.className)?' hide-desktop':'');
const ext=a=>/^https?:/.test(a.getAttribute('href')||'')&&!/sparebank1\.no/.test(a.getAttribute('href'));
const ctas=(root,cls='art-cta')=>{ const as=root?[...root.querySelectorAll('a[href]')]:[]; return as.length?`<p class="${cls}">${as.map(a=>`<a class="${btnClass(a)}${vis(a)}" href="${esc(a.getAttribute('href'))}"${ext(a)?' rel="noopener"':''}>${esc(norm(a.textContent))}</a>`).join('')}</p>`:''; };
// Frontend-clientlib footer (rendered inside <main>) → the footerData() shape (columns / small / address; no contact tabs).
export function frontendFooter(main){
  const f=main.querySelector('footer.footer'); if(!f) return null;
  const columns=[...f.querySelectorAll('.footer-columns__top .footer-columns__column')].filter(c=>c.querySelector('h2')).map(c=>({heading:norm(c.querySelector('h2').textContent),links:[...c.querySelectorAll('li a')].map(a=>({t:norm(a.textContent)||norm(a.getAttribute('title')),href:a.getAttribute('href'),icon:a.querySelector('img')?.getAttribute('src')||null}))}));
  const small=[...f.querySelectorAll('.footer-columns__bottom li a')].map(a=>({t:norm(a.textContent),href:a.getAttribute('href')}));
  return {contactHeading:'',contactLink:null,tabs:[],columns,small,address:norm(f.querySelector('.footer-info')?.textContent)};
}
// Captured media inside a frontend block: <img> (src or lazy), a CSS background-image, or a <video> (poster icon + captured source).
function mediaOf(root){
  if(!root) return null;
  const video=root.querySelector('video'); const icon=root.querySelector('img.video__placeholder');
  if(video||icon){ const src=video?.querySelector('source')?.getAttribute('src')||video?.getAttribute('src'); return {kind:'video',src,title:video?.getAttribute('title')||'',icon:icon?.getAttribute('src')}; }
  const img=root.querySelector('img'); if(img){ const src=img.getAttribute('data-lazy-src')||img.getAttribute('src'); if(src) return {kind:/\.svg(\?|$)/i.test(src)?'illu':'image',src,alt:img.getAttribute('alt')||''}; }
  const bg=[...root.querySelectorAll('[style*="background-image"]')].map(e=>(e.getAttribute('style').match(/url\((?:"([^"]*)"|'([^']*)'|([^)]+))/)||[]).slice(1).find(Boolean)).find(Boolean); if(bg) return {kind:'image',src:bg,alt:''};
  return null;
}
const videoHtml=(m,cls='art-video')=>`<figure class="video-frame ${cls}" data-dynamics="video (captured source, preload none)">${m.src?`<video controls preload="none" playsinline${m.title?` title="${esc(m.title)}"`:''}><source src="${asset(m.src)}" type="video/mp4"></video>`:''}${m.icon?`<img class="video-icon" src="${asset(m.icon)}" alt="" aria-hidden="true" width="64" height="64" loading="lazy" decoding="async">`:''}</figure>`;
function figureHtml(b,{eager=false}={}){
  const m=mediaOf(b); const cap=norm(b.querySelector('figcaption')?.textContent);
  if(!m) return cap?`<p class="small muted art-caption">${esc(cap)}</p>`:''; // lazyload placeholder never hydrated in the capture: caption only
  if(m.kind==='video') return videoHtml(m);
  if(m.kind==='illu') return `<figure class="art-figure art-illu"><img class="illu-lg" src="${asset(m.src)}" alt="${esc(m.alt)}"${m.alt?'':' aria-hidden="true"'} width="320" height="320" loading="lazy" decoding="async">${cap?`<figcaption class="small muted">${esc(cap)}</figcaption>`:''}</figure>`;
  return `<figure class="art-figure"><img class="photo photo-sm" src="${asset(m.src)}" alt="${esc(m.alt)}" width="1280" height="1280" loading="${eager?'eager':'lazy'}"${eager?' fetchpriority="high"':''} decoding="async">${cap?`<figcaption class="small muted">${esc(cap)}</figcaption>`:''}</figure>`;
}
// One captured body component → module markup. `st` counts rich-text fallbacks.
function block(b,st,{eager=false}={}){
  const cl=b.classList; const tag=b.tagName;
  if(cl.contains('infoBox')){ const tc=b.querySelector('.text-content'); const label=norm(b.querySelector('h2, .text-content .h2, .text-content .h3, .text-content p')?.textContent); return `<aside class="factbox" aria-label="${esc(label)}">${rte(tc)}${ctas(b.querySelector('.buttongroup'),'fact-cta')}</aside>`; }
  if(cl.contains('image')) return figureHtml(b,{eager});
  if(cl.contains('text')&&!cl.contains('text-and-image')){ const tc=b.querySelector('.text-content'); return tc?rte(tc):''; }
  if(cl.contains('button')||cl.contains('buttongroup')) return ctas(b);
  if(cl.contains('quote')||tag==='BLOCKQUOTE'){ const m=mediaOf(b); const q=norm(b.querySelector('.quote__text')?.textContent); const who=norm(b.querySelector('.quote__name')?.textContent); if(!q&&!who) return ''; return `<figure class="pull-quote" data-module="quote"${m&&m.kind==='image'?' data-media="portrait"':''}>${m&&m.kind==='image'?`<img class="quote-portrait" src="${asset(m.src)}" alt="${esc(m.alt)}" width="160" height="160" loading="lazy" decoding="async">`:''}<blockquote><p>${esc(q)}</p></blockquote>${who?`<figcaption class="small">${esc(who)}</figcaption>`:''}</figure>`; }
  if(cl.contains('text-and-image')){ const cols=[...b.querySelectorAll('.text-and-image__col')]; return `<div class="art-split" data-module="text-and-image">${cols.map(c=>`<div class="art-split-col">${walk(c,st)}</div>`).join('')}</div>`; }
  if(cl.contains('video')){ const m=mediaOf(b); return m?videoHtml(m):''; }
  if(cl.contains('block')){ const m=mediaOf(b.querySelector('.block-media')); const content=b.querySelector('.block-content'); const inner=content?walk(content,st):''; if(!m&&!inner) return ''; return `<div class="story-block" data-module="story-block"${m?` data-media="${m.kind}"`:''}>${m?(m.kind==='video'?videoHtml(m,'story-video'):`<img class="photo story-photo" src="${asset(m.src)}" alt="${esc(m.alt||'')}" width="1280" height="853" loading="lazy" decoding="async">`):''}${inner?`<div class="story-block-text">${inner}</div>`:''}</div>`; }
  if(cl.contains('columns-noColor')||cl.contains('columns-bgColor')||cl.contains('columns')){ const cols=[...b.querySelectorAll('.columns__col')].map(c=>walk(c,st)).filter(Boolean); if(!cols.length) return ''; return `<div class="art-cols" data-items="${cols.length}">${cols.map(c=>`<div class="art-col">${c}</div>`).join('')}</div>`; }
  if(cl.contains('responsive-grid')||cl.contains('columns__row')||cl.contains('columns__col')||cl.contains('block-content')||(!b.getAttribute('class')&&tag==='DIV')) return walk(b,st);
  if(cl.contains('glossary-modal')||cl.contains('glossary-backdrop')||cl.contains('hide')||tag==='SCRIPT'||tag==='STYLE'||tag==='LINK') return '';
  const html=rich(b); if(!html) return ''; st.fallbacks++; return `<div class="prose-fallback" data-module="rich-text">${html}</div>`;
}
const walk=(root,st)=>[...root.children].map(c=>block(c,st)).join('');
// Bento spans for n related cards: ≤ 4 share one row; multiples of 4 run 4-up; otherwise rows of 3 with the remainder as wide (photo-left) cards.
function railSpans(n){ if(n<=0) return []; if(n<=4) return Array.from({length:n},()=>({span:12/n,wide:n<=2})); if(n%4===0) return Array.from({length:n},()=>({span:3})); const full=Math.floor(n/3)*3, r=n-full; return Array.from({length:n},(_,i)=>i<full?{span:4}:{span:12/r,wide:true}); }
export function render({doc,pj}){
  const main=doc.querySelector('main'); const art=main.querySelector('.sb1-article'); const story=main.querySelector('.sb1-story__body');
  const st={fallbacks:0};
  let h1='', tag='', date='', share='', heroHtml='', lead='', body='', items=0, relH='', rel='', temaH='', tema='';
  if(art){
    const head=art.querySelector('.sb1-article__header');
    const hero=head?.querySelector('.sb1-article__header-image img'); const heroCap=norm(head?.querySelector('.sb1-article__header-image figcaption')?.textContent);
    tag=norm(head?.querySelector('.tag__item')?.textContent); h1=norm((head?.querySelector('h1')||main.querySelector('h1'))?.textContent); date=norm(head?.querySelector('.author-text__date')?.textContent);
    share=[...(head?.querySelectorAll('.some__item-button')||[])].map(b=>{ const svg=b.querySelector('svg').outerHTML.replace(/\s(width|height|class)="[^"]*"/g,'').replace(/#005aa4/g,'currentColor').replace(/<svg/,'<svg aria-hidden="true" focusable="false"'); return `<li><button type="button" class="share-btn" aria-label="${esc(b.getAttribute('aria-label'))}">${svg}</button></li>`; }).join('');
    heroHtml=hero?`<figure class="card art-photo" data-slot="image">
      <img src="${asset(hero.getAttribute('data-lazy-src')||hero.getAttribute('src'))}" alt="${esc(hero.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async">
      ${heroCap?`<figcaption class="small muted">${esc(heroCap)}</figcaption>`:''}
    </figure>`:'';
    const blocks=[...art.querySelectorAll('.sb1-article__content > *')];
    const teaser=blocks.find(b=>b.classList.contains('sb1-article__content-teaser')); lead=norm(teaser?.querySelector('.text-content p')?.textContent);
    for(const b of blocks){ if(b===teaser) continue; items++; body+=block(b,st,{eager:items<=2&&b.classList.contains('image')&&!/content--(right|left)-adjust/.test(b.className)&&!st.eagerBody&&(st.eagerBody=true)}); } // a full-width .image among the first two body blocks out-sizes the hero at 1440 (it is the LCP): eager + high; floated (right/left-adjust) figures are half-width and stay lazy
    relH=norm(art.querySelector('.related-list h2')?.textContent);
    const relAs=[...art.querySelectorAll('.related-list__item a')]; const spans=railSpans(relAs.length);
    rel=relAs.map((a,i)=>{ const img=a.querySelector('img'); const src=img?(img.getAttribute('data-lazy-src')||img.getAttribute('src')):null; return `<li class="card card--tint news-card is-link${spans[i].wide?' news-card--wide':''}" style="--span:${spans[i].span}">${src?`<img class="card-image" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}" width="768" height="432" loading="lazy" decoding="async">`:''}<div class="card-body"><h3 class="h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.querySelector('.related-list__text')?.textContent||a.textContent))}</a></h3></div></li>`; }).join('');
    temaH=norm(art.querySelector('.tags h2')?.textContent);
    tema=[...art.querySelectorAll('.tags a')].map(a=>`<li><a class="badge" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></li>`).join('');
  } else if(story){
    // Story layout: the H1 lives inside the first full-bleed block; that block's media is the hero.
    const kids=[...story.children]; const first=kids.find(k=>k.querySelector('h1'))||kids[0];
    const h1El=first?.querySelector('h1')||main.querySelector('h1'); h1=norm(h1El?.textContent);
    const m=first&&first.classList.contains('block')?mediaOf(first.querySelector('.block-media')||first):null;
    if(m) heroHtml=m.kind==='video'?`<div class="card art-photo art-photo--video" data-slot="image" data-media="video">${videoHtml(m,'hero-video')}</div>`:`<figure class="card art-photo" data-slot="image"><img src="${asset(m.src)}" alt="${esc(m.alt||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>`;
    for(const k of kids){ if(k===first){ if(h1El) h1El.remove(); const rest=first.classList.contains('block')?walk(first.querySelector('.block-content')||first,st):block(first,st); if(rest){ items++; body+=rest; } continue; } const html=block(k,st); if(html){ items++; body+=html; } }
  } else {
    // Unknown frontend shape: promote the first heading, walk everything verbatim.
    const h1El=main.querySelector('h1')||main.querySelector('h2,h3'); h1=norm(h1El?.textContent); h1El?.remove();
    for(const k of [...main.children].filter(k=>!/^(HEADER|FOOTER)$/.test(k.tagName)&&!k.classList.contains('header')&&!k.classList.contains('footer'))){ const html=block(k,st); if(html){ items++; body+=html; } }
  }
  const hasRail=!!(rel||tema);
  // Round 01: related articles are a card bento below the story (16:9 bleeding photos, whole card is the link); themes are 6 px badges.
  const railHtml=hasRail?`
<section class="movement related" data-section="related" data-intent="cross-link: related articles and themes" data-layout="grid" data-module="card-rail" data-items="${rel.split('<li').length-1}" data-media="image" aria-labelledby="rel-h">
  <div class="container">
    ${rel?`<h2 class="h2-l section-title" id="rel-h" data-slot="heading">${esc(relH)}</h2><ul class="bento news-rail" data-slot="cards">${rel}</ul>`:''}
    ${tema?`<div class="tema-row"><h2 class="h2-s"${rel?'':' id="rel-h"'} data-slot="heading">${esc(temaH)}</h2><ul class="tema" data-slot="tags">${tema}</ul></div>`:''}
  </div>
</section>`:'';
  // Round 01 hero bento: text card 5 cols (H1 at Headline-L, meta, lead, share) + photo card 7 cols; no photo → the text card spans 12.
  let mainHtml=`
<article class="article">
<section class="hero-movement art-head container" data-section="article-header" data-intent="headline, meta, lead; the photo as content" data-layout="bento-cells" data-media="image" data-module="article-header">
  <div class="bento art-hero${heroHtml?'':' no-media'}">
    <div class="card card--tint art-title-card"><div class="card-body">
      <h1 class="h2-l" data-slot="heading">${esc(h1)}</h1>
      ${tag||date?`<p class="meta small byline" data-slot="meta">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time>${esc(date)}</time>`:''}</p>`:''}
      ${lead?`<p class="lead" data-slot="text">${esc(lead)}</p>`:''}
      ${share?`<ul class="share" aria-label="Del artikkelen" data-slot="share">${share}</ul>`:''}
    </div></div>
    ${heroHtml}
  </div>
</section>
<section class="movement art-body" data-section="article-body" data-intent="read the story" data-layout="prose" data-module="article-body" data-items="${items}">
  <div class="container body-grid">
    <div class="prose" data-slot="body">${body}</div>
  </div>
</section>${railHtml}
</article>`;
  // exactly one <h1>: demote extras when several
  const h1s=(mainHtml.match(/<h1[\s>]/g)||[]).length;
  if(h1s>1){ let n=0; mainHtml=mainHtml.replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/g,(m,a,t)=>(++n===1?m:`<h2${a||''}>${t}</h2>`)); }
  const css=`
/* article — round 01: hero bento (text 5 + photo 7), prose column, related cards */
.hero-movement{padding-top:24px}
.art-hero{grid-template-rows:minmax(440px,auto)}
.art-title-card{grid-column:1/span 5}.art-title-card .card-body{justify-content:center;padding:56px 48px}
.art-title-card h1{max-width:18ch}.art-title-card .byline{margin-top:16px}.art-title-card .lead{margin-top:20px;max-width:none}.art-title-card .share{margin-top:28px}
.byline span+time::before{content:"·";margin-right:14px;color:var(--graa)}
.art-photo{grid-column:6/-1;margin:0;background:var(--frost-30)}
.art-photo img{width:100%;height:100%;flex:1 1 auto;min-height:0;object-fit:cover;transition:transform .7s var(--ease)}
.art-photo figcaption{padding:12px 20px;background:var(--sand-70);color:var(--koksgraa)}
.art-hero.no-media .art-title-card{grid-column:1/-1;min-height:0}.art-hero.no-media .art-title-card h1{max-width:24ch}
.share{display:flex;gap:var(--spacing-sm)}
.share-btn{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;padding:0;border:0;border-radius:50%;background:#fff;color:var(--vann);cursor:pointer;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease)}
.share-btn svg{width:22px;height:22px}.share-btn:hover{background:var(--vann);color:#fff}
.body-grid{display:grid;grid-template-columns:minmax(0,68ch)}
.prose h2{margin:var(--spacing-xl) 0 var(--spacing-md);max-width:24ch}.prose>p:first-child{margin-top:0}
.prose p+h2{margin-top:var(--spacing-xl)}
.art-figure{margin:var(--spacing-xl) 0;display:grid;gap:var(--spacing-sm)}
.art-figure .photo{object-position:50% 25%;border-radius:var(--radius)}
.factbox{display:grid;gap:var(--spacing-md);margin-top:var(--spacing-xl);padding:36px;background:var(--sand-70);border-radius:var(--radius)}
.factbox h2{margin:0;font-size:var(--t-title)}.factbox ul{display:grid;gap:var(--spacing-sm);margin:0;padding-left:1.2em;list-style:disc}.factbox li{margin:0}.factbox li::marker{color:var(--vann)}
.news-rail>.card{grid-column:span var(--span,3)}
.news-card .card-body{padding:32px 28px 40px}
.news-card--wide{flex-direction:row}.news-card--wide .card-image{width:46%;flex:none;height:auto;aspect-ratio:16/9;align-self:stretch}.news-card--wide .card-body{justify-content:center}
.tema-row{margin-top:var(--section-padding);display:grid;gap:var(--spacing-md)}
.tema{display:flex;flex-wrap:wrap;gap:var(--card-gap)}
@media (max-width:1024px){
  .art-hero{grid-template-rows:auto}.art-title-card{grid-column:1/-1}.art-title-card .card-body{padding:40px 32px}.art-title-card h1{max-width:none}
  .art-photo{grid-column:1/-1;order:-1}.art-photo img{aspect-ratio:16/9;height:auto;flex:none}
  .news-rail>.card{grid-column:span 6}.news-card--wide{flex-direction:column}.news-card--wide .card-image{width:100%}
}
@media (max-width:767px){
  .art-title-card .card-body{padding:36px 20px}
  .art-figure{margin:var(--spacing-lg) 0}
  .news-rail>.card{grid-column:1/-1}.news-card .card-body{padding:28px 20px 32px}
  .factbox{padding:20px}
}
`;
  // Sibling-only shapes (emitted only when present so the archetype's output stays byte-identical).
  const siblingCss=(!hasRail||!heroHtml||st.eagerBody||/art-cta|fact-cta|pull-quote|art-split|art-video|hero-video|story-block|art-cols|art-illu|art-caption|prose-fallback|hide-phone|hide-desktop|<ol|<h3/.test(body))?`
.prose h3{margin:var(--spacing-lg) 0 var(--spacing-sm);font-size:var(--title)}.prose ol{list-style:decimal;padding-left:1.25em}.prose strong{font-family:var(--title-font-family);font-weight:400}
.art-cta,.fact-cta{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);margin-top:var(--spacing-lg)}.fact-cta{margin-top:0}
.art-caption{margin-top:var(--spacing-md)}
.art-illu{justify-items:center}.illu-lg{width:min(100%,320px);height:auto;aspect-ratio:1;object-fit:contain}
.pull-quote{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"img quote" "img who";gap:var(--spacing-xs) var(--spacing-lg);align-items:center;margin:var(--spacing-xl) 0;padding:36px;background:var(--frost-30);border-radius:var(--radius)}
.pull-quote:not([data-media]){grid-template-columns:minmax(0,1fr);grid-template-areas:"quote" "who"}
.quote-portrait{grid-area:img;width:120px;height:120px;border-radius:50%;object-fit:cover;background:var(--frost)}
.pull-quote blockquote{grid-area:quote;margin:0}.pull-quote blockquote p{margin:0;font-family:var(--title-font-family);font-size:var(--lead);line-height:1.4;color:var(--fjell)}.pull-quote figcaption{grid-area:who;color:var(--koksgraa)}
.art-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:var(--spacing-xl);align-items:center;margin:var(--spacing-xl) 0;padding:36px;background:var(--sand-70);border-radius:var(--radius)}
.art-split .art-figure{margin:0}.art-split h2{margin-top:0}.art-split .art-cta{margin-top:var(--spacing-md)}
.art-video,.story-video,.hero-video{margin:var(--spacing-xl) 0;width:100%;aspect-ratio:16/9}.hero-video{margin:0;flex:1 1 auto;aspect-ratio:auto;min-height:320px;border-radius:0}.art-photo--video{background:var(--frost-30)}.art-video video,.story-video video,.hero-video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:var(--fjell)}
.video-icon{position:relative;width:64px;height:64px;pointer-events:none}
.story-block{display:grid;gap:var(--spacing-lg);margin:var(--spacing-xl) 0}.story-photo{aspect-ratio:16/9;border-radius:var(--radius)}.story-block-text>p:first-child{margin-top:0}
.art-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:var(--spacing-xl);margin:var(--spacing-xl) 0}.art-col>:first-child{margin-top:0}.art-col .factbox,.art-col .art-figure{margin-top:0}
.art-col .art-figure+.art-figure,.art-col .art-figure+.factbox,.art-col .factbox+.art-figure{margin-top:var(--spacing-lg)}
.hide-phone{display:inline-flex}.hide-desktop{display:none}
@media (max-width:1024px){.art-split{grid-template-columns:1fr}}
@media (max-width:767px){.pull-quote,.pull-quote:not([data-media]){grid-template-columns:1fr;grid-template-areas:"img" "quote" "who";padding:20px}.quote-portrait{width:96px;height:96px}.art-split{padding:20px}.hide-phone{display:none}.hide-desktop{display:inline-flex}}
`:'';
  return { template:'article', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css:css+siblingCss, footer:frontendFooter(main),
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html-shape.md', dominantDimension:'composition/reading-room-spread', conceptSeed:'surface adc00a6a read (dealt 4,5,7; 4 built)', unsourcedContent:[], ...(st.fallbacks?{richTextFallbacks:st.fallbacks}:{}), signatureElements:['hero bento: Sand-70 text card 5 + bleeding photo card 7','related stories as 16:9 news cards'], improvementsApplied:['round 01: hero bento, prose reading column at 68ch, related rail → card bento, themes as 6 px badges, share as Frost-30 icon circles','#5 photo beside the headline, never behind it'], dynamicsInterim:['share buttons static type=button (captured JS share handlers, no href)'], canonDeviations:[] } };
}
