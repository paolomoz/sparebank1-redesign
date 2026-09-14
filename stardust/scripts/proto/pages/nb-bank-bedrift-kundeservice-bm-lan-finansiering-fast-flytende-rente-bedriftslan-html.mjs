// FAQ question page (bedrift) — archetype faq, mode read. Composition per the shape brief; content verbatim from the captured DOM.
import { esc, icons, routerHtml } from '../chrome.mjs';
const norm=s=>(s||'').replace(/\s+/g,' ').replace(/ /g,' ').trim();
const EMPTY=/^[\s ]*$/;
function rich(el,{demote=0}={}){
  if(!el) return '';
  const c=el.cloneNode(true);
  for(const x of c.querySelectorAll('link,svg,dialog,script,style')) x.remove();
  for(const x of c.querySelectorAll('*')){ for(const a of ['style','data-rte-editelement','adhocenable','onclick','fetchpriority','itemprop','rel','target','id','role','aria-hidden','class']){ if(x.tagName!=='IMG'||a!=='class') x.removeAttribute(a); } }
  for(const s of [...c.querySelectorAll('span')]){ s.replaceWith(...s.childNodes); }
  for(const b of [...c.querySelectorAll('b')]){ if(EMPTY.test(b.textContent)){ b.replaceWith(c.ownerDocument.createTextNode(' ')); continue; } const st=c.ownerDocument.createElement('strong'); st.innerHTML=b.innerHTML; b.replaceWith(st); }
  for(const x of [...c.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li')]){ if(EMPTY.test(x.textContent)&&!x.querySelector('img')) x.remove(); }
  if(demote){ for(const h of [...c.querySelectorAll('h1,h2,h3,h4,h5,h6')]){ const lvl=Math.min(6,+h.tagName[1]+demote); const n=c.ownerDocument.createElement('h'+lvl); n.innerHTML=h.innerHTML; h.replaceWith(n); } }
  for(const a of c.querySelectorAll('a')){ a.innerHTML=a.innerHTML.replace(/^(\s|&nbsp;|&#160;| )+|(\s|&nbsp;|&#160;| )+$/g,''); }
  for(const a of c.querySelectorAll('a[href^="http"]')){ if(!/sparebank1\.no/.test(a.getAttribute('href'))) a.setAttribute('rel','noopener'); }
  return c.innerHTML.replace(/(<br>\s*)+<\/p>/g,'</p>').replace(/<p>(<br>\s*)+/g,'<p>').replace(/\n\s*/g,'\n').trim();
}
export function render({doc,pj,router}){
  // Canon router markup (routerHtml, unchanged) rendered by the page so the landscape can load eager: this page has no other image and the
  // lazy art would otherwise be the LCP (canon gap — see stardust/prototypes/canon-requests.md). Marked data-deviation.
  const routerBlock=''; // canon router injected by build.mjs (art eager in canon since 2026-09-14)
  const main=doc.querySelector('main');
  const back=main.querySelector('.to-parent a'); const h1=main.querySelector('h1');
  const answer=main.querySelector('.question-page__answer .text-wrapper');
  const fb=main.querySelector('.faq__feedback-box'); const fbQ=norm(fb.querySelector('.feedback-question, h2')?.textContent); const [yes,no]=[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent));
  const paras=answer.querySelectorAll('p').length; const items=answer.querySelectorAll('li').length;
  const mainHtml=`${routerBlock}
<article class="movement question" data-section="question" data-intent="answer one question plainly" data-layout="contained" data-module="faq-question" data-items="${paras+items}">
  <div class="container question-grid">
    <p class="back"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}<span>${esc(norm(back.textContent))}</span></a></p>
    <h1 data-slot="heading">${esc(norm(h1.textContent))}</h1>
    <div class="prose answer-prose" data-slot="answer">${rich(answer)}</div>
    <div class="faq-feedback" data-module="feedback" data-dynamics="5 (static thumbs, interim)"><span class="feedback-q" id="fb-q">${esc(fbQ)}</span><div class="feedback-btns" role="group" aria-labelledby="fb-q"><button class="btn btn-secondary btn-sm" type="button" aria-label="${esc(yes)}">${icons.thumbUp}<span>${esc(yes)}</span></button><button class="btn btn-secondary btn-sm" type="button" aria-label="${esc(no)}">${icons.thumbDown}<span>${esc(no)}</span></button></div></div>
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
  return { template:'article', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html-shape.md', dominantDimension:'composition/single-answer-column', conceptSeed:'surface f4dcd196 (mode read; dealt 6,7,2; 6 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band (bedrift variant header injected from the captured page)'], improvementsApplied:['#1 compact router','#3 1.25 scale (H1 headline, answer at lead size 20/1.55 for reading)','#7 one movement, captured divider dropped'], dynamicsInterim:['#5 feedback thumbs static (type=button)'] } };
}
