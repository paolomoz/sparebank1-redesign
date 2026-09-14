// Tool page "Sperre kort" — archetype tool, mode operate; family renderer for the tool siblings (Path A′).
// Composition per stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md; content verbatim from the captured DOM.
// Built on the shared component walker (nb-bank-privat-lan-html.mjs). This archetype's own shapes (back-linked intro, numbered
// steps beside an illustration, info callout, photo + prose split, labelled feedback) are handler overrides; the siblings'
// step-by-step, progressive-disclosure tables, accordion lists, currency converter and calculator mounts come from the library
// (static shells, captured text verbatim, controls disabled — dynamics #8/#9 interim).
import { esc, asset, icons, norm, hasText, imgSrc, btn, btnKind, rich, renderMain, H, SIBLING_CSS, patchData as libPatch, inline } from './nb-bank-privat-lan-html.mjs';
export const patchData=libPatch;
const ARCH='nb-bank-privat-kundeservice-verktoy-sperre-kort-html';
const richT=(el,o={})=>rich(el,{legacyImg:true,...o});
const OV={
  intro(it,c){ if(it.img) return H.intro(it,c); const back=it.back?`
    <p class="back"><a class="backlink" href="${esc(it.back.a.getAttribute('href'))}">${icons.back}<span>${esc(norm(it.back.a.textContent))}</span></a></p>`:''; const leads=it.leads.filter(hasText).map(p=>`
    <p class="lead" data-slot="text">${inline(p)}</p>`).join(''); const ctas=it.ctas.length?`
    <p class="cta-row">${it.ctas.map((a,i)=>btn(a,i===0?' data-slot="cta"':'')).join('')}</p>`:'';
    return {raw:`
<section class="movement intro" data-section="intro" data-intent="name the task" data-layout="contained" data-module="page-title">
  <div class="container">${back}
    <h1 data-slot="heading">${esc(norm(it.h1.textContent))}</h1>${leads}${ctas}
  </div>
</section>`}; },
  columns(it,c){
    if(it.cards.length||it.navs.length||it.chat) return H.columns(it,c);
    const stepCol=it.cols.find(col=>col.texts.some(t=>t.w.querySelector('ol')));
    const img=it.cols.map(col=>col.img).find(Boolean)?.img;
    if(stepCol&&img&&it.cols.length===2){ // numbered steps beside an illustration
      const t0=stepCol.texts.find(t=>t.w.querySelector('ol')); const h=t0.hs[0]; const notes=stepCol.texts.filter(t=>t!==t0); const cta=stepCol.ctas[0]; const n=t0.w.querySelectorAll('ol li').length; c.lcp=true;
      return {raw:`
<section class="movement paper-frost steps" data-section="steps" data-intent="do the task: block the card in the bank app, one action" data-layout="split-media" data-media="illustration" data-module="steps" data-items="${n}">
  <div class="container steps-grid">${h?`
    <h2 class="steps-h" data-slot="heading">${esc(norm(h.textContent))}</h2>`:''}
    <div class="steps-text prose">
      ${richT(t0.w).replace(/<h[1-6]>[\s\S]*?<\/h[1-6]>/,'').replace(/<li>([\s\S]*?)<\/li>/g,'<li><span class="step-text">$1</span></li>')}${cta?`
      <p class="steps-cta"><a class="btn ${btnKind(cta.getAttribute('class')||'')}" data-cta="primary" data-slot="cta" href="${esc(cta.getAttribute('href'))}">${esc(norm(cta.textContent))}</a></p>`:''}${notes.map(t=>`
      <p class="small steps-note">${esc(norm(t.w.textContent))}</p>`).join('')}
    </div>
    <figure class="steps-media" data-slot="illustration"><img class="illu illu-hero" src="${asset(imgSrc(img))}" alt="" aria-hidden="true" width="280" height="280" loading="eager" fetchpriority="high" decoding="async"></figure>
  </div>
</section>`}; }
    const mediaOnly=it.cols.filter(col=>col.parts.every(p=>p.type==='image')); const textCols=it.cols.filter(col=>!col.parts.every(p=>p.type==='image'));
    if(it.cols.length===2&&mediaOnly.length===1&&textCols.length===1&&!isSvgSrc(mediaOnly[0].img.img)){ const im=mediaOnly[0].img.img; const tc=textCols[0]; const cta=tc.ctas[0];
      return {raw:`
<section class="movement reopen" data-section="reopen" data-intent="found the card: lift the block" data-layout="split-media" data-media="image" data-module="split-media">
  <div class="container reopen-grid">
    <figure class="reopen-media" data-slot="image"><img class="photo" src="${asset(imgSrc(im))}" alt="${esc(im.getAttribute('alt')||'')}" width="1280" height="853" loading="lazy" decoding="async"></figure>
    <div class="reopen-text prose">${tc.texts.map(t=>richT(t.w)).join('')}${cta?`<p class="reopen-cta"><a class="btn ${btnKind(cta.getAttribute('class')||'')}" data-slot="cta" href="${esc(cta.getAttribute('href'))}">${esc(norm(cta.textContent))}</a></p>`:''}${tc.ctas.slice(1).map(a=>`<p>${btn(a)}</p>`).join('')}</div>
  </div>
</section>`}; }
    return H.columns(it,c); },
  tip(it){ return {raw:`
<section class="movement misuse" data-section="misuse" data-intent="if the card or account was misused: what to do" data-layout="contained" data-module="callout">
  <div class="container">
    <div class="callout callout-rich" data-slot="tip">${icons.bulb}<div class="prose callout-body">${richT(it.w)}${it.as.length?`<p class="cta-row">${it.as.map(a=>btn(a)).join('')}</p>`:''}</div></div>
  </div>
</section>`}; },
  feedback(it){ const fbQ=norm(it.h?.textContent); const labels=it.btns.map(b=>norm(b.querySelector('title')?.textContent||b.textContent)); const yes=labels[0]||'Ja'; const no=labels[1]||'Nei';
    return {raw:`
<section class="feedback" data-section="feedback" data-intent="page feedback" data-layout="contained" data-module="feedback" data-dynamics="5 (static thumbs, interim)">
  <div class="container feedback-row"><h2 id="fb-q">${esc(fbQ)}</h2><div class="feedback-btns" role="group" aria-labelledby="fb-q"><button class="btn btn-secondary" type="button" aria-label="${esc(yes)}">${icons.thumbUp}<span>${esc(yes)}</span></button><button class="btn btn-secondary" type="button" aria-label="${esc(no)}">${icons.thumbDown}<span>${esc(no)}</span></button></div></div>
</section>`}; },
};
const isSvgSrc=i=>/\.svg(\?|$|\.)/i.test(imgSrc(i));
export function render({doc,pj,slug=ARCH,archetype=ARCH}){
  const main=doc.querySelector('main'); const isArch=slug===archetype;
  const r=renderMain(main,{slug,archetype,handlers:OV});
  const css=TOOL_CSS+(isArch?'':SIBLING_CSS);
  const provenance=isArch
    ? { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md', dominantDimension:'composition/procedure-sheet', conceptSeed:'surface d96f07e8 (mode operate; dealt 6,7,1; 6 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','flat spot illustration (mobilbruker-dame) beside the steps','one-corner-pair photo mask 96px on the lommebok photo'], improvementsApplied:['#1 compact router','#3 1.25 scale','#4 no card chrome: numbered ledger + callout on paper','#6 photo at content scale','#7 movements on paper, three captured <hr> dropped'], dynamicsInterim:['#5 feedback thumbs static (type=button)','#3 "Logg inn og sperr kortet" / "Åpne sperret kort" keep their nettbank hrefs (login dialog at rollout)'] }
    : { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md', familyRenderer:'tool (component walker; steps / disclosures / accordion lists / converter and calculator shells)', componentsMapped:r.used, richTextFallbacks:r.fallbacks, unsourcedContent:[], canonDeviations:[], dynamicsInterim:['#5 feedback thumbs static','#8 calculator: captured widget text verbatim, controls disabled (empty React mount kept where nothing was captured)','#9 currency converter: captured values and rate list verbatim, controls disabled'] };
  return { template:'form', title:pj.title, description:pj.metaDescription, main:r.html, css, provenance };
}
const TOOL_CSS=`
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
