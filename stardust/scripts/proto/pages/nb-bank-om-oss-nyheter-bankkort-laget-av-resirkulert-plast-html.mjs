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
export function render({doc,pj}){
  const main=doc.querySelector('main'); const art=main.querySelector('.sb1-article'); const story=main.querySelector('.sb1-story__body');
  const st={fallbacks:0};
  let h1='', tag='', date='', share='', heroHtml='', lead='', body='', items=0, relH='', rel='', temaH='', tema='';
  if(art){
    const head=art.querySelector('.sb1-article__header');
    const hero=head?.querySelector('.sb1-article__header-image img'); const heroCap=norm(head?.querySelector('.sb1-article__header-image figcaption')?.textContent);
    tag=norm(head?.querySelector('.tag__item')?.textContent); h1=norm((head?.querySelector('h1')||main.querySelector('h1'))?.textContent); date=norm(head?.querySelector('.author-text__date')?.textContent);
    share=[...(head?.querySelectorAll('.some__item-button')||[])].map(b=>{ const svg=b.querySelector('svg').outerHTML.replace(/\s(width|height|class)="[^"]*"/g,'').replace(/#005aa4/g,'currentColor').replace(/<svg/,'<svg aria-hidden="true" focusable="false"'); return `<li><button type="button" class="share-btn" aria-label="${esc(b.getAttribute('aria-label'))}">${svg}</button></li>`; }).join('');
    heroHtml=hero?`<figure class="art-media" data-slot="image">
      <img class="photo" src="${asset(hero.getAttribute('data-lazy-src')||hero.getAttribute('src'))}" alt="${esc(hero.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async">
      ${heroCap?`<figcaption class="small muted">${esc(heroCap)}</figcaption>`:''}
    </figure>`:'';
    const blocks=[...art.querySelectorAll('.sb1-article__content > *')];
    const teaser=blocks.find(b=>b.classList.contains('sb1-article__content-teaser')); lead=norm(teaser?.querySelector('.text-content p')?.textContent);
    for(const b of blocks){ if(b===teaser) continue; items++; body+=block(b,st,{eager:items<=2&&b.classList.contains('image')&&!/content--(right|left)-adjust/.test(b.className)&&!st.eagerBody&&(st.eagerBody=true)}); } // a full-width .image among the first two body blocks out-sizes the hero at 1440 (it is the LCP): eager + high; floated (right/left-adjust) figures are half-width and stay lazy
    relH=norm(art.querySelector('.related-list h2')?.textContent);
    rel=[...art.querySelectorAll('.related-list__item a')].map(a=>{ const img=a.querySelector('img'); const src=img?(img.getAttribute('data-lazy-src')||img.getAttribute('src')):null; return `<li class="rail-item">${src?`<img class="photo photo-sm" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}" width="768" height="512" loading="lazy" decoding="async">`:''}<h3 class="rail-title"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.querySelector('.related-list__text')?.textContent||a.textContent))}</a></h3></li>`; }).join('');
    temaH=norm(art.querySelector('.tags h2')?.textContent);
    tema=[...art.querySelectorAll('.tags a')].map(a=>`<li><a class="badge" href="${esc(a.getAttribute('href'))}" data-deviation="canon lacks .badge (DESIGN.md § Badges); local pill">${esc(norm(a.textContent))}</a></li>`).join('');
  } else if(story){
    // Story layout: the H1 lives inside the first full-bleed block; that block's media is the hero.
    const kids=[...story.children]; const first=kids.find(k=>k.querySelector('h1'))||kids[0];
    const h1El=first?.querySelector('h1')||main.querySelector('h1'); h1=norm(h1El?.textContent);
    const m=first&&first.classList.contains('block')?mediaOf(first.querySelector('.block-media')||first):null;
    if(m) heroHtml=m.kind==='video'?`<div class="art-media" data-slot="image" data-media="video">${videoHtml(m,'hero-video')}</div>`:`<figure class="art-media" data-slot="image"><img class="photo" src="${asset(m.src)}" alt="${esc(m.alt||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>`;
    for(const k of kids){ if(k===first){ if(h1El) h1El.remove(); const rest=first.classList.contains('block')?walk(first.querySelector('.block-content')||first,st):block(first,st); if(rest){ items++; body+=rest; } continue; } const html=block(k,st); if(html){ items++; body+=html; } }
  } else {
    // Unknown frontend shape: promote the first heading, walk everything verbatim.
    const h1El=main.querySelector('h1')||main.querySelector('h2,h3'); h1=norm(h1El?.textContent); h1El?.remove();
    for(const k of [...main.children].filter(k=>!/^(HEADER|FOOTER)$/.test(k.tagName)&&!k.classList.contains('header')&&!k.classList.contains('footer'))){ const html=block(k,st); if(html){ items++; body+=html; } }
  }
  const hasRail=!!(rel||tema);
  const railHtml=hasRail?`
    <aside class="rail" data-section="related" data-intent="cross-link: related articles and themes" data-layout="rail" data-module="card-rail" data-items="${rel.split('<li').length-1}" data-media="image" aria-labelledby="rel-h">
      ${rel?`<div class="rail-group"><h2 class="title-sm" id="rel-h" data-slot="heading">${esc(relH)}</h2><ul class="rail-list" data-slot="cards" data-deviation="photo mask 24px on 120px thumbnails (canon .photo-sm 48px would consume the image)">${rel}</ul></div>`:''}
      ${tema?`<div class="rail-group"><h2 class="title-sm"${rel?'':' id="rel-h"'} data-slot="heading">${esc(temaH)}</h2><ul class="tema" data-slot="tags">${tema}</ul></div>`:''}
    </aside>`:'';
  let mainHtml=`
<article class="article">
<section class="movement art-head" data-section="article-header" data-intent="headline, meta, lead; the photo as content" data-layout="split-media" data-media="image" data-module="article-header">
  <div class="container art-head-grid${heroHtml?'':' no-media'}">
    <div class="art-title">
      <h1 data-slot="heading">${esc(h1)}</h1>
      ${tag||date?`<p class="byline" data-slot="meta">${tag?`<span>${esc(tag)}</span>`:''}${date?`<time>${esc(date)}</time>`:''}</p>`:''}
    </div>
    ${heroHtml}
    ${lead||share?`<div class="art-lead">
      ${lead?`<p class="lead" data-slot="text">${esc(lead)}</p>`:''}
      ${share?`<ul class="share" aria-label="Del artikkelen" data-slot="share">${share}</ul>`:''}
    </div>`:''}
  </div>
</section>
<section class="movement art-body" data-section="article-body" data-intent="read the story" data-layout="${hasRail?'prose-aside':'prose'}" data-module="article-body" data-items="${items}">
  <div class="container body-grid${hasRail?'':' no-rail'}">
    <div class="prose" data-slot="body">${body}</div>${railHtml}
  </div>
</section>
</article>`;
  // exactly one <h1>: demote extras when several
  const h1s=(mainHtml.match(/<h1[\s>]/g)||[]).length;
  if(h1s>1){ let n=0; mainHtml=mainHtml.replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/g,(m,a,t)=>(++n===1?m:`<h2${a||''}>${t}</h2>`)); }
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
  // Sibling-only shapes (emitted only when present so the archetype's output stays byte-identical).
  const siblingCss=(!hasRail||!heroHtml||st.eagerBody||/art-cta|fact-cta|pull-quote|art-split|art-video|hero-video|story-block|art-cols|art-illu|art-caption|prose-fallback|hide-phone|hide-desktop|<ol|<h3/.test(body))?`
.art-head-grid.no-media{grid-template-columns:minmax(0,68ch);grid-template-areas:"title" "lead"}
.body-grid.no-rail{grid-template-columns:minmax(0,68ch)}
.prose h3{margin:var(--spacing-lg) 0 var(--spacing-sm);font-size:var(--title)}.prose ol{list-style:decimal;padding-left:1.25em}.prose strong{font-family:var(--title-font-family);font-weight:400}
.art-cta,.fact-cta{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);margin-top:var(--spacing-lg)}.fact-cta{margin-top:0}
.art-caption{margin-top:var(--spacing-md)}
.art-illu{justify-items:center}.illu-lg{width:min(100%,320px);height:auto;aspect-ratio:1;object-fit:contain}
.pull-quote{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"img quote" "img who";gap:var(--spacing-xs) var(--spacing-lg);align-items:center;margin:var(--spacing-xl) 0;padding:var(--spacing-lg);background:var(--frost-30);border-radius:var(--radius)}
.pull-quote:not([data-media]){grid-template-columns:minmax(0,1fr);grid-template-areas:"quote" "who"}
.quote-portrait{grid-area:img;width:120px;height:120px;border-radius:50%;object-fit:cover;background:var(--frost)}
.pull-quote blockquote{grid-area:quote;margin:0}.pull-quote blockquote p{margin:0;font-family:var(--title-font-family);font-size:var(--lead);line-height:1.4;color:var(--fjell)}.pull-quote figcaption{grid-area:who;color:var(--koksgraa)}
.art-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:var(--spacing-xl);align-items:center;margin:var(--spacing-xl) 0;padding:var(--spacing-lg);background:var(--sand-30);border-radius:var(--radius)}
.art-split .art-figure{margin:0}.art-split h2{margin-top:0}.art-split .art-cta{margin-top:var(--spacing-md)}
.art-video,.story-video,.hero-video{margin:var(--spacing-xl) 0;width:100%;aspect-ratio:16/9}.hero-video{margin:0}.art-video video,.story-video video,.hero-video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:var(--fjell)}
.video-icon{position:relative;width:64px;height:64px;pointer-events:none}
.story-block{display:grid;gap:var(--spacing-lg);margin:var(--spacing-xl) 0}.story-photo{aspect-ratio:16/9}.story-block-text>p:first-child{margin-top:0}
.art-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:var(--spacing-xl);margin:var(--spacing-xl) 0}.art-col>:first-child{margin-top:0}.art-col .factbox,.art-col .art-figure{margin-top:0}
.art-col .art-figure+.art-figure,.art-col .art-figure+.factbox,.art-col .factbox+.art-figure{margin-top:var(--spacing-lg)}
.hide-phone{display:inline-flex}.hide-desktop{display:none}
a.badge{min-height:40px;padding:6px 16px}
@media (max-width:1023px){.art-split{grid-template-columns:1fr}}
@media (max-width:640px){.pull-quote,.pull-quote:not([data-media]){grid-template-columns:1fr;grid-template-areas:"img" "quote" "who";padding:20px}.quote-portrait{width:96px;height:96px}.art-split{padding:20px}.hide-phone{display:none}.hide-desktop{display:inline-flex}}
`:'';
  return { template:'article', title:pj.title, description:norm(pj.metaDescription), main:mainHtml, css:css+siblingCss, footer:frontendFooter(main),
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html-shape.md', dominantDimension:'composition/reading-room-spread', conceptSeed:'surface adc00a6a read (dealt 4,5,7; 4 built)', unsourcedContent:[], ...(st.fallbacks?{richTextFallbacks:st.fallbacks}:{}), signatureElements:['one-corner-pair photo mask (hero 96px, portrait + rail 48px)'], improvementsApplied:['#3 1.25 scale headline','#4 flat related rail, kicker → meta line','#5 photo beside the headline, never behind it','#6 hero photo at content scale'], dynamicsInterim:['share buttons static type=button (captured JS share handlers, no href)'], canonDeviations:['.badge (local pill; canon lacks DESIGN.md § Badges)'] } };
}
