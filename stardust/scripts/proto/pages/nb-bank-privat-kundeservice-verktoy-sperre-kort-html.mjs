// Tool page "Sperre kort" — archetype tool, mode operate. Composition per stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md;
// content verbatim from the captured DOM (linkedom selectors — nothing retyped).
import { esc, asset, icons } from '../chrome.mjs';
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
export function render({doc,pj}){
  const main=doc.querySelector('main');
  const back=main.querySelector('.to-parent a'); const h1=main.querySelector('h1'); const lead=main.querySelector(':scope > .text p');
  const grids=[...main.querySelectorAll(':scope > .columns-grid')];
  const steps=grids[0]; const stepTexts=[...steps.querySelectorAll('.text-wrapper')]; const stepBtn=steps.querySelector('a.ffe-button'); const stepImg=steps.querySelector('img');
  const tip=main.querySelector('.tip .text-wrapper');
  const reopen=grids[1]; const rImg=reopen.querySelector('img'); const rTexts=[...reopen.querySelectorAll('.text-wrapper')]; const rBtn=reopen.querySelector('a.ffe-button');
  const fb=main.querySelector('.feedback'); const fbQ=norm(fb.querySelector('h2')?.textContent); const [yes,no]=[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent));
  const stepsH=steps.querySelector('h2');
  const mainHtml=`
<section class="movement intro" data-section="intro" data-intent="name the task" data-layout="contained" data-module="page-title">
  <div class="container">
    <p class="back"><a class="backlink" href="${esc(back.getAttribute('href'))}">${icons.back}<span>${esc(norm(back.textContent))}</span></a></p>
    <h1 data-slot="heading">${esc(norm(h1.textContent))}</h1>
    <p class="lead" data-slot="text">${esc(norm(lead.textContent))}</p>
  </div>
</section>
<section class="movement paper-frost steps" data-section="steps" data-intent="do the task: block the card in the bank app, one action" data-layout="split-media" data-media="illustration" data-module="steps" data-items="${steps.querySelectorAll('ol li').length}">
  <div class="container steps-grid">
    <h2 class="steps-h" data-slot="heading">${esc(norm(stepsH.textContent))}</h2>
    <div class="steps-text prose">
      ${rich(stepTexts[0]).replace(/<h2>[\s\S]*?<\/h2>/,'').replace(/<li>([\s\S]*?)<\/li>/g,'<li><span class="step-text">$1</span></li>')}
      <p class="steps-cta"><a class="btn btn-action" data-cta="primary" data-slot="cta" href="${esc(stepBtn.getAttribute('href'))}">${esc(norm(stepBtn.textContent))}</a></p>
      <p class="small steps-note">${esc(norm(stepTexts[1].textContent))}</p>
    </div>
    <figure class="steps-media" data-slot="illustration"><img class="illu illu-hero" src="${asset(stepImg.getAttribute('data-lazy-src')||stepImg.getAttribute('src'))}" alt="" aria-hidden="true" width="280" height="280" loading="eager" fetchpriority="high" decoding="async"></figure>
  </div>
</section>
<section class="movement misuse" data-section="misuse" data-intent="if the card or account was misused: what to do" data-layout="contained" data-module="callout">
  <div class="container">
    <div class="callout callout-rich" data-slot="tip">${icons.bulb}<div class="prose callout-body">${rich(tip)}</div></div>
  </div>
</section>
<section class="movement reopen" data-section="reopen" data-intent="found the card: lift the block" data-layout="split-media" data-media="image" data-module="split-media">
  <div class="container reopen-grid">
    <figure class="reopen-media" data-slot="image"><img class="photo" src="${asset(rImg.getAttribute('data-lazy-src')||rImg.getAttribute('src'))}" alt="${esc(rImg.getAttribute('alt')||'')}" width="1280" height="853" loading="lazy" decoding="async"></figure>
    <div class="reopen-text prose">${rTexts.map(t=>rich(t)).join('')}<p class="reopen-cta"><a class="btn btn-primary" data-slot="cta" href="${esc(rBtn.getAttribute('href'))}">${esc(norm(rBtn.textContent))}</a></p></div>
  </div>
</section>
<section class="feedback" data-section="feedback" data-intent="page feedback" data-layout="contained" data-module="feedback" data-dynamics="5 (static thumbs, interim)">
  <div class="container feedback-row"><h2 id="fb-q">${esc(fbQ)}</h2><div class="feedback-btns" role="group" aria-labelledby="fb-q"><button class="btn btn-secondary" type="button" aria-label="${esc(yes)}">${icons.thumbUp}<span>${esc(yes)}</span></button><button class="btn btn-secondary" type="button" aria-label="${esc(no)}">${icons.thumbDown}<span>${esc(no)}</span></button></div></div>
</section>`;
  const css=`
.intro{padding-bottom:var(--spacing-xl)}.back{margin-bottom:var(--spacing-md)}
.intro h1{max-width:20ch}.intro .lead{margin-top:var(--spacing-md);max-width:52ch}
.steps-grid{display:grid;grid-template-columns:minmax(0,8fr) minmax(0,4fr);grid-template-areas:"h2 media" "text media";gap:var(--spacing-md) var(--spacing-xl);align-items:start}
.steps-h{grid-area:h2}.steps-text{grid-area:text}
.steps-text ol{list-style:none;counter-reset:step;padding:0;margin-top:var(--spacing-sm);display:grid;gap:0}
.steps-text ol li{counter-increment:step;display:grid;grid-template-columns:36px minmax(0,1fr);gap:var(--spacing-md);align-items:start;padding:12px 0;border-top:1px solid var(--frost);margin:0}.step-text{padding-top:6px}
.steps-text ol li::before{content:counter(step);display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--vann);color:#fff;font-family:var(--title-font-family);font-size:var(--body);font-variant-numeric:tabular-nums}
.steps-text ol li:last-child{border-bottom:1px solid var(--frost)}
.steps-cta{margin-top:var(--spacing-lg)}.steps-note{margin-top:var(--spacing-md);color:var(--koksgraa);max-width:48ch}
.steps-media{grid-area:media;margin:0;align-self:start;display:flex;justify-content:center}.illu-hero{width:320px;max-width:100%;height:auto;aspect-ratio:1}
.callout-rich{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:start;gap:var(--spacing-md) var(--spacing-md);padding:var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) var(--spacing-md);max-width:calc(68ch + 84px)}
.callout-body{max-width:68ch}.callout-body h2{font-family:var(--title-font-family);font-size:var(--title);line-height:1.25}.callout-body h3{font-family:var(--title-font-family);font-size:var(--lead);line-height:1.3;margin-top:var(--spacing-lg)}.callout-body h2+p,.callout-body h3+p{margin-top:var(--spacing-sm)}
.reopen-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--spacing-xl);align-items:center}
.reopen-media{margin:0}.reopen-text h2{margin-bottom:var(--spacing-md)}.reopen-cta{margin-top:var(--spacing-lg)}
.feedback-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px}.feedback-btns{display:flex;gap:8px}
@media (max-width:1023px){.steps-grid{grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:var(--spacing-md) var(--spacing-lg)}.illu-hero{width:240px}.reopen-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.reopen-media .photo{aspect-ratio:2/1}}
@media (max-width:640px){.intro{padding-bottom:var(--spacing-md)}.steps-grid{grid-template-columns:minmax(0,1fr) 120px;grid-template-areas:"h2 media" "text text";gap:var(--spacing-sm) var(--spacing-md);align-items:center}.steps-media{align-self:center}.illu-hero{width:120px}.steps-text{margin-top:var(--spacing-sm)}.callout-rich{grid-template-columns:24px 1fr;padding:var(--spacing-md)}.callout-rich svg{width:24px;height:24px}.reopen-media .photo{aspect-ratio:3/2;border-radius:var(--radius-img-sm) 0 var(--radius-img-sm) 0}}
`;
  return { template:'form', title:pj.title, description:pj.metaDescription, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md', dominantDimension:'composition/procedure-sheet', conceptSeed:'surface d96f07e8 (mode operate; dealt 6,7,1; 6 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','flat spot illustration (mobilbruker-dame) beside the steps','one-corner-pair photo mask 96px on the lommebok photo'], improvementsApplied:['#1 compact router','#3 1.25 scale','#4 no card chrome: numbered ledger + callout on paper','#6 photo at content scale','#7 movements on paper, three captured <hr> dropped'], dynamicsInterim:['#5 feedback thumbs static (type=button)','#3 "Logg inn og sperr kortet" / "Åpne sperret kort" keep their nettbank hrefs (login dialog at rollout)'] } };
}
