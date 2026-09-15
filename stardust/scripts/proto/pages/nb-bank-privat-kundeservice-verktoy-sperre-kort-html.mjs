// Tool page "Sperre kort" — archetype tool, mode operate; family renderer for the tool siblings (Path A′).
// Round 01 composition (2026-09-15): text-only hero as one Sand card across 12; the numbered steps inside one Frost card (7 cols)
// beside the spot illustration on its own Sand tile (5 cols); the misuse callout as Sand sheet prose in the container; the
// "found the card" split as a photo card 5 + Frost text card 7; labelled feedback. Content verbatim from the captured DOM
// (stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md). Built on the shared component walker
// (nb-bank-privat-lan-html.mjs); the siblings' step-by-step, progressive-disclosure tables, accordion lists, currency converter
// and calculator mounts come from the library (static shells, captured text verbatim, controls disabled — dynamics #8/#9 interim).
import { esc, asset, icons, norm, hasText, imgSrc, btn, btnKind, rich, renderMain, H, HUB_CSS, SIBLING_CSS, patchData as libPatch, inline } from './nb-bank-privat-lan-html.mjs';
export const patchData=libPatch;
const ARCH='nb-bank-privat-kundeservice-verktoy-sperre-kort-html';
const richT=(el,o={})=>rich(el,{legacyImg:true,...o});
const OV={
  intro(it,c){ const s=H.intro(it,c,{fill:it.img?'card--frost':'card--tint'}); s.section='intro'; s.intent='name the task'; return s; },
  columns(it,c){
    if(it.cards.length||it.navs.length||it.chat) return H.columns(it,c);
    const stepCol=it.cols.find(col=>col.texts.some(t=>t.w.querySelector('ol')));
    const img=it.cols.map(col=>col.img).find(Boolean)?.img;
    if(stepCol&&img&&it.cols.length===2){ // numbered steps in a Frost card beside the illustration tile
      const t0=stepCol.texts.find(t=>t.w.querySelector('ol')); const h=t0.hs[0]; const notes=stepCol.texts.filter(t=>t!==t0); const cta=stepCol.ctas[0]; const n=t0.w.querySelectorAll('ol li').length; c.lcp=true;
      return {raw:`
<section class="movement steps" data-section="steps" data-intent="do the task: block the card in the bank app, one action" data-layout="bento-cells" data-media="illustration" data-module="steps" data-items="${n}">
  <div class="container"><div class="bento steps-bento">
    <div class="card card--frost steps-card"><div class="card-body">${h?`
      <h2 class="h2-m steps-h" data-slot="heading">${esc(norm(h.textContent))}</h2>`:''}
      <div class="steps-text prose">
        ${richT(t0.w).replace(/<h[1-6]>[\s\S]*?<\/h[1-6]>/,'').replace(/<li>([\s\S]*?)<\/li>/g,'<li><span class="step-text">$1</span></li>')}${cta?`
        <p class="steps-cta actions"><a class="btn ${btnKind(cta.getAttribute('class')||'')}" data-cta="primary" data-slot="cta" href="${esc(cta.getAttribute('href'))}">${esc(norm(cta.textContent))}</a></p>`:''}${notes.map(t=>`
        <p class="small steps-note">${esc(norm(t.w.textContent))}</p>`).join('')}
      </div>
    </div></div>
    <figure class="card card--tint media-illu steps-media" data-slot="illustration"><img class="illu illu-hero" src="${asset(imgSrc(img))}" alt="" aria-hidden="true" width="280" height="280" loading="eager" fetchpriority="high" decoding="async"></figure>
  </div></div>
</section>`}; }
    const mediaOnly=it.cols.filter(col=>col.parts.every(p=>p.type==='image')); const textCols=it.cols.filter(col=>!col.parts.every(p=>p.type==='image'));
    if(it.cols.length===2&&mediaOnly.length===1&&textCols.length===1&&!isSvgSrc(mediaOnly[0].img.img)){ const im=mediaOnly[0].img.img; const tc=textCols[0]; const cta=tc.ctas[0];
      return {raw:`
<section class="movement reopen" data-section="reopen" data-intent="found the card: lift the block" data-layout="bento-cells" data-media="image" data-module="split-media">
  <div class="container"><div class="bento split-bento media-first">
    <figure class="card media-photo split-media" data-slot="image"><img class="media-img" src="${asset(imgSrc(im))}" alt="${esc(im.getAttribute('alt')||'')}" width="1280" height="853" loading="lazy" decoding="async"></figure>
    <div class="card card--frost split-card${tc.ctas.length===1?' is-link':''}"><div class="card-body"><div class="prose">${tc.texts.map(t=>richT(t.w)).join('')}</div>${cta?`<p class="actions"><a class="btn ${btnKind(cta.getAttribute('class')||'')}${tc.ctas.length===1?' cover-link':''}" data-slot="cta" href="${esc(cta.getAttribute('href'))}">${esc(norm(cta.textContent))}</a></p>`:''}${tc.ctas.slice(1).map(a=>`<p class="actions">${btn(a)}</p>`).join('')}</div></div>
  </div></div>
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
  const css=HUB_CSS+TOOL_CSS+(isArch?'':SIBLING_CSS);
  const provenance=isArch
    ? { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md', dominantDimension:'composition/procedure-sheet', conceptSeed:'surface d96f07e8 (mode operate; dealt 6,7,1; 6 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','flat spot illustration (mobilbruker-dame) on its own Sand tile beside the Frost steps card','lommebok photo bleeding in its own bento cell'], improvementsApplied:['round 01: hero as one Sand card, steps in one Frost card 7 + illustration tile 5','2 px cards, 6 px gutters, no border, no shadow','Ramp type scale','6 px borderless buttons','photo 5 + text card 7 split, no type on the photo'], dynamicsInterim:['#5 feedback thumbs static (type=button)','#3 "Logg inn og sperr kortet" / "Åpne sperret kort" keep their nettbank hrefs (login dialog at rollout)'] }
    : { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-verktoy-sperre-kort-html-shape.md', familyRenderer:'tool (component walker; steps / disclosures / accordion lists / converter and calculator shells)', componentsMapped:r.used, richTextFallbacks:r.fallbacks, unsourcedContent:[], canonDeviations:[], dynamicsInterim:['#5 feedback thumbs static','#8 calculator: captured widget text verbatim, controls disabled (empty React mount kept where nothing was captured)','#9 currency converter: captured values and rate list verbatim, controls disabled'] };
  return { template:'form', title:pj.title, description:pj.metaDescription, main:r.html, css, provenance };
}
const TOOL_CSS=`
/* tool page — steps card 7 + illustration tile 5 */
.steps-bento .steps-card{grid-column:1/span 7}.steps-bento .steps-media{grid-column:8/-1}
.steps-text ol{list-style:none;counter-reset:step;padding:0;margin-top:var(--spacing-md);display:grid;gap:0}
.steps-text ol li{counter-increment:step;display:grid;grid-template-columns:36px minmax(0,1fr);gap:var(--spacing-md);align-items:start;padding:12px 0;border-top:1px solid rgba(0,39,118,.12);margin:0}.step-text{padding-top:6px}
.steps-text ol li::before{content:counter(step);display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--vann);color:#fff;font-family:var(--title-font-family);font-size:var(--body);font-variant-numeric:tabular-nums}
.steps-text ol li:last-child{border-bottom:1px solid rgba(0,39,118,.12)}
.steps-text{max-width:none}.steps-text>p{max-width:60ch}.steps-cta{margin-top:var(--spacing-lg)}.steps-note{margin-top:var(--spacing-md);color:var(--koksgraa);max-width:52ch}
.steps-media .illu-hero{width:min(70%,320px);max-height:320px;aspect-ratio:1}
.feedback-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px}
@media (max-width:1024px){.steps-bento .steps-card,.steps-bento .steps-media{grid-column:1/-1}.steps-bento .steps-media{order:-1;padding:24px}.steps-media .illu-hero{width:min(50%,200px);max-height:200px}}
@media (max-width:767px){.steps-text ol li{grid-template-columns:32px minmax(0,1fr)}.steps-text ol li::before{width:32px;height:32px}.steps-media .illu-hero{width:min(45%,160px);max-height:160px}}
`;
