// Kundeservice hub (Privat) — archetype kundeservice-hub, mode operate. Composition per stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md;
// content verbatim from the captured DOM (linkedom selectors — nothing retyped).
import { esc, asset, icons } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').replace(/ /g,' ').trim();
const EMPTY=/^[\s ]*$/;

// Lift a captured rich-text wrapper verbatim: strip authoring attributes, unwrap style spans, b→strong, drop empty blocks,
// demote headings by `demote` levels (answers live under an h3 question), keep every link/href, resolve img src.
function rich(el,{demote=0}={}){
  if(!el) return '';
  const c=el.cloneNode(true);
  for(const x of c.querySelectorAll('link,svg,dialog,script,style,br+br')) x.remove();
  for(const x of c.querySelectorAll('*')){ for(const a of ['style','data-rte-editelement','adhocenable','onclick','fetchpriority','itemprop','rel','target','id','role','aria-hidden','class']){ if(x.tagName!=='IMG'||a!=='class') x.removeAttribute(a); } }
  for(const s of [...c.querySelectorAll('span')]){ s.replaceWith(...s.childNodes); }
  for(const b of [...c.querySelectorAll('b')]){ if(EMPTY.test(b.textContent)){ b.remove(); continue; } const st=c.ownerDocument.createElement('strong'); st.innerHTML=b.innerHTML; b.replaceWith(st); }
  for(const x of [...c.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li')]){ if(EMPTY.test(x.textContent)&&!x.querySelector('img')) x.remove(); }
  for(const i of c.querySelectorAll('img')){ i.setAttribute('src',asset(i.getAttribute('data-lazy-src')||i.getAttribute('src'))); i.setAttribute('alt',i.getAttribute('alt')||''); i.setAttribute('loading','lazy'); i.setAttribute('decoding','async'); i.setAttribute('aria-hidden','true'); i.setAttribute('class','illu'); i.removeAttribute('width'); i.removeAttribute('height'); }
  if(demote){ for(const h of [...c.querySelectorAll('h1,h2,h3,h4,h5,h6')]){ const lvl=Math.min(6,+h.tagName[1]+demote); const n=c.ownerDocument.createElement('h'+lvl); n.innerHTML=h.innerHTML; h.replaceWith(n); } }
  for(const a of c.querySelectorAll('a')){ a.innerHTML=a.innerHTML.replace(/^(\s|&nbsp;|&#160;| )+|(\s|&nbsp;|&#160;| )+$/g,''); }
  for(const a of c.querySelectorAll('a[href^="http"]')){ if(!/sparebank1\.no/.test(a.getAttribute('href'))) a.setAttribute('rel','noopener'); }
  return c.innerHTML.replace(/(<br>\s*)+<\/p>/g,'</p>').replace(/<p>(<br>\s*)+/g,'<p>').replace(/\n\s*/g,'\n').trim();
}
const feedbackRow=(fb,cls='faq-foot-feedback')=>{ if(!fb) return ''; const q=norm(fb.querySelector('.feedback-question, h2')?.textContent); const [yes,no]=[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent)); return `<div class="${cls}" role="group" aria-label="${esc(q)}"><span class="feedback-q">${esc(q)}</span><button class="btn btn-secondary btn-sm thumb" type="button" aria-label="${esc(yes)}">${icons.thumbUp}<span>${esc(yes)}</span></button><button class="btn btn-secondary btn-sm thumb" type="button" aria-label="${esc(no)}">${icons.thumbDown}<span>${esc(no)}</span></button></div>`; };

// FAQ answer body: sequence of .text / .columns-grid / feedback / question-page link, rendered in captured order.
function faqBody(body){
  let out='';
  for(const ch of body.children){
    if(ch.classList.contains('text')) out+=`<div class="prose">${rich(ch.querySelector('.text-wrapper'),{demote:2})}</div>`;
    else if(ch.classList.contains('columns-grid')){ const cols=[...ch.querySelectorAll('.columns-grid__column')].filter(c=>norm(c.textContent)||c.querySelector('img')); out+=`<div class="cols" data-items="${cols.length}">${cols.map(col=>{ const img=col.querySelector('img'); const tw=[...col.querySelectorAll('.text-wrapper')].map(t=>rich(t,{demote:2})).join(''); return `<div class="col">${img?`<img class="illu illu-lg" src="${asset(img.getAttribute('data-lazy-src')||img.getAttribute('src'))}" alt="" aria-hidden="true" loading="lazy" decoding="async">`:''}<div class="prose">${tw}</div></div>`; }).join('')}</div>`; }
    else if(ch.classList.contains('faq__feedback-box')) out+=feedbackRow(ch);
    else if(ch.matches('a.faq-link')) out+=`<p class="faq-more"><a class="link-more" href="${esc(ch.getAttribute('href'))}">${esc(norm(ch.textContent))}${icons.chevron}</a></p>`;
  }
  return out;
}

export function render({doc,pj}){
  const main=doc.querySelector('main');
  const h1=main.querySelector('h1');
  const heroImg=main.querySelector('.background-container img.responsive');
  const ask=[...main.querySelectorAll('.background-container .columns-grid')][0];
  const askH=ask.querySelector('h2'); const askPs=[...ask.querySelectorAll('.text-wrapper p')];
  const chat=ask.querySelector('.chat-field'); const chatNote=norm(chat.querySelector('[data-chat-error]')?.getAttribute('data-chat-error')); const chatLabel=norm(chat.querySelector('label')?.textContent); const chatTa=chat.querySelector('textarea'); const chatBtn=norm(chat.querySelector('button')?.textContent);
  const toolCards=[...main.querySelectorAll('.background-container .columns-grid .card')];
  const faq=main.querySelector('.faq'); const faqH=faq.querySelector('.title h2'); const faqItems=[...faq.querySelectorAll('.ffe-accordion-item')];
  const rel=main.querySelector('.related-products'); const relH=rel.querySelector('h2'); const relCards=[...rel.querySelectorAll('.card')];
  const banner=main.querySelector('.banner-small__grid'); const meet=[...main.querySelectorAll(':scope > .columns-grid')].pop();

  const tools=toolCards.map(c=>{const a=c.querySelector('a.card__title, a.ffe-text-link'); const p=c.querySelector('p'); return `<li class="tool"><h3 class="title-sm tool-title"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3><p>${esc(norm(p?.textContent))}</p></li>`;}).join('');
  const faqHtml=faqItems.map((it,i)=>{const q=norm(it.querySelector('.ffe-accordion-item__heading-button-content')?.childNodes[0]?.textContent||it.querySelector('h3')?.textContent); const body=it.querySelector('.ffe-accordion-item__body'); return `<details><summary><h3 class="faq-q">${esc(q)}</h3>${icons.down}</summary><div class="answer answer-wide">${faqBody(body)}</div></details>`;}).join('\n');
  const topics=relCards.map(c=>{const img=c.querySelector('img'); const a=c.querySelector('a.card__title, a.ffe-text-link'); return `<li class="topic"><img class="illu" src="${asset(img.getAttribute('data-lazy-src')||img.getAttribute('src'))}" alt="" aria-hidden="true" width="48" height="48" loading="lazy" decoding="async"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></li>`;}).join('');
  const bImg=banner.querySelector('img'); const bH=banner.querySelector('h2'); const bP=banner.querySelector('.banner-small__infotext'); const bA=banner.querySelector('a.ffe-button');
  const mH=meet.querySelector('h2'); const mP=meet.querySelector('.text-wrapper p'); const mA=meet.querySelector('a.ffe-button'); const mImg=meet.querySelector('img');

  const mainHtml=`
<section class="movement hero" data-section="hero" data-intent="ask for help: chat first, then shortcuts" data-layout="split-media" data-media="image" data-module="hero-ask" data-items="${toolCards.length}">
  <div class="container">
    <div class="hero-grid">
      <figure class="hero-media" data-slot="image"><img class="photo" src="${asset(heroImg.getAttribute('data-lazy-src')||heroImg.getAttribute('src'))}" alt="${esc(heroImg.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>
      <h1 class="hero-h1" data-slot="heading">${esc(norm(h1.textContent))}</h1>
      <div class="hero-text">
        <h2 class="title hero-sub" data-slot="subheading">${esc(norm(askH.textContent))}</h2>
        <p class="lead" data-slot="text">${esc(norm(askPs[0].textContent))}</p>
        <p data-slot="text">${esc(norm(askPs[1].textContent))}</p>
        <form class="ask" data-module="chat-field" data-dynamics="6 (boost.ai chat — owner decision; controls disabled in the interim)" aria-describedby="ask-note">
          <label class="label" for="ask-input">${esc(chatLabel)}</label>
          <div class="ask-row">
            <textarea class="ask-input" id="ask-input" name="q" rows="1" maxlength="${esc(chatTa.getAttribute('maxlength')||'110')}" placeholder="${esc(chatTa.getAttribute('placeholder')||'')}" disabled></textarea>
            <button class="btn btn-primary" type="submit" data-cta="primary" data-slot="cta" disabled>${esc(chatBtn)}</button>
          </div>
          <p class="small muted ask-note" id="ask-note">${esc(chatNote)}</p>
        </form>
      </div>
      <ul class="tools" data-slot="tools">${tools}</ul>
    </div>
  </div>
</section>
<section class="movement paper-frost faq-movement" data-section="faq" data-intent="answer what people ask right now" data-layout="contained" data-module="faq" data-items="${faqItems.length}">
  <div class="container faq-grid">
    <h2 class="section-title" data-slot="heading">${esc(norm(faqH.textContent))}</h2>
    <div class="faq" data-slot="items">${faqHtml}</div>
  </div>
</section>
<section class="movement topics-movement" data-section="topics" data-intent="route to a help topic" data-layout="grid" data-module="topic-tiles" data-items="${relCards.length}">
  <div class="container">
    <h2 class="section-title" data-slot="heading">${esc(norm(relH.textContent))}</h2>
    <ul class="topics" data-slot="tiles">${topics}</ul>
  </div>
</section>
<section class="movement paper-sand invites" data-section="invites" data-intent="urgent: report fraud · plan: book a meeting" data-layout="grid" data-module="promo-band" data-items="2">
  <div class="container promo-grid">
    <article class="promo" data-module="promo-band">
      <img class="promo-illu" src="${asset(bImg.getAttribute('data-lazy-src')||bImg.getAttribute('src'))}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="160" height="120">
      <div class="promo-text"><h2 class="title-sm">${esc(norm(bH.textContent))}</h2><p>${esc(norm(bP.textContent))}</p><p><a class="btn btn-primary" href="${esc(bA.getAttribute('href'))}">${esc(norm(bA.textContent))}</a></p></div>
    </article>
    <article class="promo" data-module="promo-band">
      <img class="promo-illu" src="${asset(mImg.getAttribute('data-lazy-src')||mImg.getAttribute('src'))}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="160" height="120">
      <div class="promo-text"><h2 class="title-sm">${esc(norm(mH.textContent))}</h2><p>${esc(norm(mP.textContent))}</p><p><a class="btn btn-primary" href="${esc(mA.getAttribute('href'))}">${esc(norm(mA.textContent))}</a></p></div>
    </article>
  </div>
</section>`;

  const css=`
.hero-grid{display:grid;grid-template-columns:7fr 5fr;grid-template-areas:"media h1" "media text" "tools tools";gap:var(--spacing-md) var(--spacing-xl);align-items:center}
.hero-media{grid-area:media;margin:0;align-self:center}.hero-h1{grid-area:h1;align-self:end;max-width:14ch}.hero-text{grid-area:text;align-self:start;display:grid;gap:var(--spacing-md)}
.title{font-family:var(--heading-font-family);font-size:var(--t-title);line-height:1.2}.hero-sub{margin-top:var(--spacing-xs)}.hero-text .lead{max-width:36ch}
.ask{display:grid;gap:6px;margin-top:var(--spacing-sm);max-width:36rem}.ask-row{display:flex;gap:8px;flex-wrap:wrap}
.ask-input{flex:1 1 14rem;min-height:44px;padding:10px 16px;border:1px solid var(--lysgraa);border-radius:var(--radius-sm);font:var(--body)/1.35 var(--body-font-family);color:var(--color-fg);background:#fff;resize:none}
.ask-input:disabled{color:var(--moerkgraa);background:#fff;border-style:dashed}.ask-input:disabled::placeholder{color:var(--moerkgraa)}.ask .btn:disabled{cursor:not-allowed;background:#fff;color:var(--moerkgraa);border-color:var(--lysgraa);opacity:1}.ask-note{margin-top:2px}
.ask-input:focus-visible{outline:2px solid var(--sol);outline-offset:2px;border-color:var(--vann)}
.tools{grid-area:tools;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg) var(--spacing-lg);margin-top:var(--spacing-md)}
.tool{position:relative;display:grid;gap:6px;align-content:start;padding-top:var(--spacing-md);border-top:1px solid var(--lysgraa)}.tool-title{text-wrap:balance}.tool-title a::after{content:"";position:absolute;inset:0}.tool:hover .tool-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.12em}
.tool-title a{color:var(--fjell);text-decoration:none}.tool-title a:hover{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.12em}.tool p{color:var(--koksgraa)}
.section-title{margin-bottom:var(--spacing-lg)}
.faq-grid{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:var(--spacing-xl);align-items:start}
.faq-grid .section-title{margin:0;position:sticky;top:var(--spacing-lg)}
.faq-movement .faq details{border-top-color:var(--frost)}.faq-movement .faq details:last-of-type{border-bottom-color:var(--frost)}
.faq-q{font:inherit;color:inherit;margin:0;flex:1 1 auto;letter-spacing:inherit}
.answer-wide{max-width:none}.answer-wide .prose{max-width:68ch}.answer .prose+.prose,.answer .cols+.prose,.answer .prose+.cols{margin-top:var(--spacing-lg)}
.answer h4{font-family:var(--title-font-family);font-size:var(--title-sm,25px);line-height:1.25;color:var(--fjell);margin-top:var(--spacing-lg)}.answer h5{font-family:var(--title-font-family);font-size:var(--lead);line-height:1.3;color:var(--fjell);margin-top:var(--spacing-lg)}.answer h6{font-family:var(--title-font-family);font-size:var(--body);line-height:1.4;color:var(--fjell);margin-top:var(--spacing-md)}
.answer h4+p,.answer h5+p,.answer h6+p,.answer h4+ol,.answer h5+ol{margin-top:var(--spacing-sm)}
.answer ol{list-style:decimal;padding-left:1.4em;margin-top:var(--spacing-sm)}.answer ol li+li{margin-top:6px}
.cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--spacing-lg) var(--spacing-xl);margin-top:var(--spacing-lg)}.cols[data-items="1"]{grid-template-columns:1fr}
.col{display:grid;gap:var(--spacing-md);align-content:start}.illu-lg{width:112px;height:112px}
.faq-foot-feedback{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:var(--spacing-lg);padding-top:var(--spacing-md);border-top:1px solid var(--frost)}
.feedback-q{font-family:var(--title-font-family);color:var(--fjell);margin-right:4px}
.thumb{gap:6px}.thumb svg{width:20px;height:20px}
.faq-more{margin-top:var(--spacing-md)}.faq-more a{font-family:var(--title-font-family)}
.topics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-md) var(--spacing-lg)}
.topic{position:relative;display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-sm) 0;border-top:1px solid var(--lysgraa);min-height:64px}.topic a::after{content:"";position:absolute;inset:0}.topic:hover a{color:var(--vann);text-decoration:underline}
.topic .illu{width:48px;height:48px}.topic a{font-family:var(--title-font-family);font-size:var(--lead);color:var(--fjell);text-decoration:none;flex:1;display:flex;align-items:center;min-height:44px}.topic a:hover{color:var(--vann);text-decoration:underline}
.promo-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-lg)}
.promo{display:grid;grid-template-columns:auto 1fr;gap:var(--spacing-lg);align-items:center;padding:0 var(--spacing-xl) 0 0}.promo+.promo{border-left:1px solid var(--lysgraa);padding:0 0 0 var(--spacing-xl)}
.promo-illu{width:150px;height:auto}.promo-text{display:grid;gap:var(--spacing-sm)}.promo-text .btn{margin-top:var(--spacing-xs)}
@media (min-width:1024px){.tool-title{min-height:2.5em}.tools{margin-top:var(--spacing-lg)}}
@media (max-width:1023px){.hero-grid{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--spacing-md) var(--spacing-lg)}.hero-text .lead{max-width:60ch}.tools{grid-template-columns:1fr 1fr;margin-top:var(--spacing-xl)}.promo-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.promo{padding:0}.promo+.promo{border-left:0;border-top:1px solid var(--lysgraa);padding:var(--spacing-lg) 0 0}.faq-grid{grid-template-columns:1fr;gap:var(--spacing-md)}.faq-grid .section-title{position:static}.topics{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.hero-grid{grid-template-columns:minmax(0,1fr) 44%;grid-template-areas:"h1 media" "text text" "tools tools";gap:var(--spacing-md)}.hero-h1{align-self:center;max-width:none}.hero-media .photo{aspect-ratio:3/2;border-radius:var(--radius-img-sm) 0 var(--radius-img-sm) 0}.tools{margin-top:var(--spacing-sm)}.tools{grid-template-columns:1fr;gap:var(--spacing-md)}.cols{grid-template-columns:1fr}.topics{grid-template-columns:1fr;gap:0}.topic{min-height:56px}.promo{grid-template-columns:1fr}.promo-illu{width:120px}.faq summary{font-size:var(--lead)}}
`;
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md', dominantDimension:'composition/counter-and-shelves', conceptSeed:'surface 6acf5792 (mode operate; dealt 7,2,4; 7 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','flat spot illustrations (topic icons, FAQ illustrations, invitations)','one-corner-pair photo mask 96px on the hero photo'], improvementsApplied:['#1 compact router','#2 calm two-tier header','#3 1.25 scale','#4 one card language (hairline tiles, no chrome)','#5 Koksgrå secondary on tints','#6 hero photo at content scale','#7 four movements, no dividers'], dynamicsInterim:['#6 chat field rendered verbatim with controls disabled (boost.ai vendor decision pending)','#5 FAQ feedback thumbs static (type=button)','#2 "Velg kontor og avtal møte" keeps its href (bank-choice dialog at rollout)'] } };
}
