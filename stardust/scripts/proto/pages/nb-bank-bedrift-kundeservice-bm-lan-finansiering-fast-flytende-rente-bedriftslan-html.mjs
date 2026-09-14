// FAQ question page (bedrift) — archetype faq, mode read. Composition per the shape brief; content verbatim from the captured DOM.
import { esc, icons, asset } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').replace(/ /g,' ').trim();
const EMPTY=/^[\s ]*$/;
function rich(el,{demote=0}={}){
  if(!el) return '';
  const c=el.cloneNode(true);
  for(const x of c.querySelectorAll('link,svg,dialog,script,style,.bank-choice-overlay,.glossary-modal,.glossary-backdrop')) x.remove();
  for(const x of c.querySelectorAll('span[class]')){ const m=(x.getAttribute('class')||'').match(/(^|\s)(h[1-6])(\s|$)/); if(m) x.setAttribute('data-h',m[2]); }
  for(const x of c.querySelectorAll('*')){ for(const a of ['style','data-rte-editelement','adhocenable','onclick','fetchpriority','itemprop','rel','target','id','role','aria-hidden','class']){ if(x.tagName!=='IMG'||a!=='class') x.removeAttribute(a); } }
  for(const s of [...c.querySelectorAll('span')]){ if(/(^|\s)h[1-6](\s|$)/.test(s.getAttribute('data-h')||'')){ const st=c.ownerDocument.createElement('strong'); st.innerHTML=s.innerHTML; s.replaceWith(st); } else s.replaceWith(...s.childNodes); }
  for(const i of c.querySelectorAll('img')){ i.setAttribute('src',asset(i.getAttribute('data-lazy-src')||i.getAttribute('src'))); i.setAttribute('alt',i.getAttribute('alt')||''); i.setAttribute('loading','lazy'); i.setAttribute('decoding','async'); for(const a of ['data-lazy-src','data-lazy-smallsrc','data-lazy-largesrc','data-lazy-breakpoint','srcset','sizes','width','height']) i.removeAttribute(a); }
  for(const b of [...c.querySelectorAll('b')]){ if(EMPTY.test(b.textContent)){ b.replaceWith(c.ownerDocument.createTextNode(' ')); continue; } const st=c.ownerDocument.createElement('strong'); st.innerHTML=b.innerHTML; b.replaceWith(st); }
  for(const x of [...c.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li')]){ if(EMPTY.test(x.textContent)&&!x.querySelector('img')) x.remove(); }
  if(demote){ for(const h of [...c.querySelectorAll('h1,h2,h3,h4,h5,h6')]){ const lvl=Math.min(6,+h.tagName[1]+demote); const n=c.ownerDocument.createElement('h'+lvl); n.innerHTML=h.innerHTML; h.replaceWith(n); } }
  for(const a of c.querySelectorAll('a')){ a.innerHTML=a.innerHTML.replace(/^(\s|&nbsp;|&#160;| )+|(\s|&nbsp;|&#160;| )+$/g,''); }
  for(const a of c.querySelectorAll('a[href^="http"]')){ if(!/sparebank1\.no/.test(a.getAttribute('href'))) a.setAttribute('rel','noopener'); }
  return c.innerHTML.replace(/(<br>\s*)+<\/p>/g,'</p>').replace(/<p>(<br>\s*)+/g,'<p>').replace(/\n\s*/g,'\n').trim();
}
// Captured button → canon button class (Skog btn-action only for relationship-starting ffe-button--action CTAs).
const btnClass=a=>/ffe-button--action/.test(a.className)?'btn btn-action':(/secondary-btn|ffe-button--secondary/.test(a.className)?'btn btn-secondary':(/tertiary|ffe-inline-button/.test(a.className)?'btn-inline':'btn btn-primary'));
const ext=a=>/^https?:/.test(a.getAttribute('href')||'')&&!/sparebank1\.no/.test(a.getAttribute('href'));
// Captured background tint → canon paper (Sand-30 / Syrin-30 / Frost-30); anything else stays Hvit.
const paper=el=>{ const bg=(el.querySelector(':scope > .background-container__wrap')?.getAttribute('style')||'').toLowerCase(); return /f8f5eb|fdf8f5|sand/.test(bg)?'paper-sand':(/f2f2f9|syrin|e9e5f5/.test(bg)?'paper-syrin':(/d8e9f2|e6f0f5|frost/.test(bg)?'paper-frost':'')); };
// Answer body = the captured component sequence of .question-page__answer, rendered IN CAPTURED ORDER (Path A′ sibling contract).
// .text → prose · .button → CTA · .background-container → tinted step block (nested .text/.image walked) · .image → figure · .hr → nothing
// (paper changes mark the steps; canon has no <hr>) · anything else → verbatim rich-text fallback.
function answerBody(answer,{depth=0}={}){
  let out=''; let fallbacks=0;
  const kids=[...answer.children].filter(c=>!/^(SCRIPT|STYLE|LINK)$/.test(c.tagName));
  for(const c of kids){
    const cl=c.classList;
    if(cl.contains('text')){ out+=rich(c.querySelector('.text-wrapper')||c); continue; }
    if(cl.contains('hr')) continue;
    if(cl.contains('button')){ const as=[...c.querySelectorAll('a[href]')]; if(!as.length) continue; out+=`<p class="answer-cta">${as.map(a=>`<a class="${btnClass(a)}" href="${esc(a.getAttribute('href'))}"${ext(a)?' rel="noopener"':''}>${esc(norm(a.textContent))}</a>`).join(' ')}</p>`; continue; }
    if(cl.contains('image')){ const img=c.querySelector('img'); if(!img) continue; const src=img.getAttribute('data-lazy-src')||img.getAttribute('src'); const cap=norm(c.querySelector('figcaption')?.textContent); out+=`<figure class="answer-figure"><img class="shot" src="${asset(src)}" alt="${esc(img.getAttribute('alt')||'')}"${img.getAttribute('width')?` width="${Math.round(+img.getAttribute('width'))}" height="${Math.round(+img.getAttribute('height'))}"`:''} loading="lazy" decoding="async">${cap?`<figcaption class="small muted">${esc(cap)}</figcaption>`:''}</figure>`; continue; }
    if(cl.contains('background-container')){ const inner=c.querySelector(':scope > .background-container__wrap > .background-container__content')||c; const r=answerBody(inner,{depth:depth+1}); fallbacks+=r.fallbacks; out+=`<div class="answer-step ${paper(c)}" data-module="background-container">${r.html}</div>`; continue; }
    if(cl.contains('aem-component-container')||cl.contains('background-container__content')||cl.contains('columns-grid')||cl.contains('columns-grid__content')||cl.contains('referance')||cl.contains('reference')||cl.contains('cq-dd-paragraph')||cl.contains('columns-grid__column')||cl.contains('columns-grid__row')||(!c.getAttribute('class')&&c.tagName==='DIV')){ /* reference (.referance → re-used .text) and grid wrappers are transparent */ const r=answerBody(c,{depth:depth+1}); fallbacks+=r.fallbacks; out+=r.html; continue; }
    // unmapped captured component → verbatim prose (nothing dropped, nothing invented)
    const html=rich(c); if(!html) continue; fallbacks++; out+=`<div class="answer-rte" data-module="rich-text">${html}</div>`;
  }
  return {html:out,fallbacks};
}
export function render({doc,pj,router}){
  // Canon router markup (routerHtml, unchanged) rendered by the page so the landscape can load eager: this page has no other image and the
  // lazy art would otherwise be the LCP (canon gap — see stardust/prototypes/canon-requests.md). Marked data-deviation.
  const routerBlock=''; // canon router injected by build.mjs (art eager in canon since 2026-09-14)
  const main=doc.querySelector('main');
  const back=main.querySelector('.to-parent a'); const h1=main.querySelector('h1')||main.querySelector('h2,h3');
  const answer=main.querySelector('.question-page__answer')||main.querySelector('.question-page__question-container')||main;
  const fb=main.querySelector('.faq__feedback-box, .feedback'); const fbQ=norm(fb?.querySelector('.feedback-question, h2')?.textContent)||fb?.querySelector('.component-root')?.getAttribute('data-question-faq')||''; const [yes,no]=fb?[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent)):[];
  const paras=answer.querySelectorAll('p').length; const items=answer.querySelectorAll('li').length;
  const body=answerBody(answer);
  const feedback=fb&&yes&&no?`<div class="faq-feedback" data-module="feedback" data-dynamics="5 (static thumbs, interim)"><span class="feedback-q" id="fb-q">${esc(fbQ)}</span><div class="feedback-btns" role="group" aria-labelledby="fb-q"><button class="btn btn-secondary btn-sm" type="button" aria-label="${esc(yes)}">${icons.thumbUp}<span>${esc(yes)}</span></button><button class="btn btn-secondary btn-sm" type="button" aria-label="${esc(no)}">${icons.thumbDown}<span>${esc(no)}</span></button></div></div>`:'';
  const mainHtml=`${routerBlock}
<article class="movement question" data-section="question" data-intent="answer one question plainly" data-layout="contained" data-module="faq-question" data-items="${paras+items}">
  <div class="container question-grid">
    ${back?`<p class="back"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}<span>${esc(norm(back.textContent))}</span></a></p>`:''}
    <h1 data-slot="heading">${esc(norm(h1.textContent))}</h1>
    <div class="prose answer-prose" data-slot="answer">${body.html}</div>
    ${feedback}
  </div>
</article>`;
  const css=`
.question{padding-block:var(--spacing-xl) var(--spacing-2xl)}
.question-grid{display:grid;grid-template-columns:minmax(0,1fr);justify-items:start}
.back{margin-bottom:var(--spacing-lg)}
.question h1{max-width:30ch;margin-bottom:var(--spacing-lg)}
.answer-prose{font-size:var(--lead);line-height:1.55}
.answer-prose p+p{margin-top:var(--spacing-lg)}
.answer-prose ul{list-style:disc;padding-left:1.25em;margin-top:var(--spacing-lg)}.answer-prose li{padding-left:.25em}.answer-prose li+li{margin-top:var(--spacing-md)}
.answer-prose ul+p{margin-top:var(--spacing-lg)}
.faq-feedback{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin-top:var(--spacing-2xl);padding-top:var(--spacing-lg);border-top:1px solid var(--lysgraa);width:min(100%,85ch)}
.feedback-q{font-family:var(--title-font-family);color:var(--fjell)}.feedback-btns{display:flex;gap:8px}.faq-feedback .btn svg{width:20px;height:20px}
@media (max-width:1023px){.question{padding-block:var(--spacing-lg) var(--spacing-xl)}}
@media (max-width:640px){.answer-prose{font-size:var(--body)}.question h1{max-width:none}}
`;
  const siblingCss=/answer-cta|answer-step|answer-figure|answer-rte|<ol|<table|<h[234]/.test(body.html)?`.answer-cta{display:flex;flex-wrap:wrap;gap:var(--spacing-sm);margin-top:var(--spacing-lg)}.answer-prose p+.answer-cta,.answer-prose ul+.answer-cta{margin-top:var(--spacing-lg)}
.answer-step{margin-top:var(--spacing-xl);padding:var(--spacing-lg);border-radius:var(--radius)}.answer-step>p:first-child,.answer-step>figure:first-child{margin-top:0}.answer-step+.answer-step{margin-top:var(--spacing-lg)}.answer-step:not(.paper-sand):not(.paper-syrin):not(.paper-frost){padding:0}
.answer-figure{margin:var(--spacing-lg) 0 0;display:grid;gap:var(--spacing-sm)}.answer-figure .shot{display:block;width:100%;height:auto;border-radius:var(--radius);border:1px solid var(--lysgraa);background:#fff}
.answer-prose ol{list-style:decimal;padding-left:1.25em;margin-top:var(--spacing-lg)}.answer-prose h2,.answer-prose h3,.answer-prose h4{margin-top:var(--spacing-xl)}.answer-prose h2+p,.answer-prose h3+p,.answer-prose h4+p{margin-top:var(--spacing-sm)}.answer-prose table{width:100%;border-collapse:collapse;margin-top:var(--spacing-lg)}.answer-prose td,.answer-prose th{padding:8px 12px;border-bottom:1px solid var(--lysgraa);text-align:left;vertical-align:top}
@media (max-width:640px){.answer-step.paper-sand,.answer-step.paper-syrin,.answer-step.paper-frost{padding:20px}}
`:'';
  return { template:'article', title:pj.title, description:pj.metaDescription, main:mainHtml, css:css+siblingCss,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html-shape.md', dominantDimension:'composition/single-answer-column', conceptSeed:'surface f4dcd196 (mode read; dealt 6,7,2; 6 built)', unsourcedContent:[], ...(body.fallbacks?{richTextFallbacks:body.fallbacks}:{}), signatureElements:['bankchoice_bg.svg in the router band (bedrift variant header injected from the captured page)'], improvementsApplied:['#1 compact router','#3 1.25 scale (H1 headline, answer at lead size 20/1.55 for reading)','#7 one movement, captured divider dropped'], dynamicsInterim:['#5 feedback thumbs static (type=button)'] } };
}
