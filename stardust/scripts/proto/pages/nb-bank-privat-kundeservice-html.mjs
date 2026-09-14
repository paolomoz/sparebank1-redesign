// Kundeservice hub (Privat) — archetype kundeservice-hub, mode operate; family renderer for its siblings (Path A′).
// Composition per stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md; content verbatim from the captured DOM.
// Built on the shared component walker (nb-bank-privat-lan-html.mjs): the captured <main> is walked in order; the hero
// (h1 · photo · ask text · chat field · tool cards · optional "see all" link) is composed from the consecutive captured
// components that make it up, the FAQ / topic tiles / invitations keep this archetype's own markup, everything else goes
// through the library's generic handlers (tip → callout, image → figure, …) or a verbatim rich-text prose movement.
import { esc, asset, icons, norm, hasText, imgSrc, btn, rich, faqBody, collect, renderMain, H, SIBLING_CSS, patchData as libPatch, inline } from './nb-bank-privat-lan-html.mjs';
export const patchData=libPatch;
const ARCH='nb-bank-privat-kundeservice-html';
const richK=(el,o={})=>rich(el,{brbr:true,emptyB:'remove',legacyImg:true,...o});

/** Merge intro + chat columns + tool-card columns (+ one trailing CTA) into a hero-ask item; banner + meet columns into invites. */
function pre(items){
  const out=[]; let i=0;
  while(i<items.length){ const it=items[i];
    if(it.kind==='intro'&&items[i+1]?.kind==='columns'&&items[i+1].chat){ const ask=items[i+1]; const hero={kind:'heroAsk',intro:it,ask,tools:[],ctas:[]}; let j=i+2;
      while(j<items.length&&items[j].kind==='columns'&&(items[j].cards.length||(items[j].cols.length===1&&items[j].cols[0].parts.every(p=>p.type==='cta')))){ hero.tools.push(...items[j].cards); hero.ctas.push(...items[j].cols.flatMap(c=>c.ctas)); j++; }
      out.push(hero); i=j; continue; }
    if(it.kind==='banner'&&items[i+1]?.kind==='columns'&&!items[i+1].cards.length&&items[i+1].cols.length===2&&items[i+1].cols.some(c=>c.parts.every(p=>p.type==='image'))){ out.push({kind:'invites',banner:it,meet:items[i+1]}); i+=2; continue; }
    out.push(it); i++; }
  return out;
}
const OV={
  heroAsk(it,c){ const {intro,ask}=it; const img=ask.cols.map(col=>col.img).find(Boolean)?.img; const askT=ask.cols.flatMap(col=>col.texts)[0]; const askH=askT?.hs[0]; const askPs=askT?askT.blocks.filter(b=>b.tagName==='P'&&hasText(b)):[];
    const chat=ask.chat; const chatNote=norm(chat.querySelector('[data-chat-error]')?.getAttribute('data-chat-error')); const chatLabel=norm(chat.querySelector('label')?.textContent); const chatTa=chat.querySelector('textarea'); const chatBtn=norm(chat.querySelector('button')?.textContent);
    const tools=it.tools.map(cd=>{const a=cd.querySelector('a.card__title, a.ffe-text-link'); const p=cd.querySelector('p.ffe-card-body__text, p'); const t=cd.querySelector('.card__title'); return `<li class="tool"><h3 class="title-sm tool-title">${a?`<a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`:esc(norm(t?.textContent))}</h3><p>${esc(norm(a&&p===t?'':p?.textContent))}</p></li>`;}).join('');
    c.lcp=true;
    const raw=`
<section class="movement hero" data-section="hero" data-intent="ask for help: chat first, then shortcuts" data-layout="split-media" data-media="image" data-module="hero-ask" data-items="${it.tools.length}">
  <div class="container">
    <div class="hero-grid">${img?`
      <figure class="hero-media" data-slot="image"><img class="photo" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>`:''}
      <h1 class="hero-h1" data-slot="heading">${esc(norm(intro.h1.textContent))}</h1>
      <div class="hero-text">${askH?`
        <h2 class="title hero-sub" data-slot="subheading">${esc(norm(askH.textContent))}</h2>`:''}${askPs.map((p,i)=>`
        <p${i===0?' class="lead"':''} data-slot="text">${inline(p)}</p>`).join('')}
        <form class="ask" data-module="chat-field" data-dynamics="6 (boost.ai chat — owner decision; controls disabled in the interim)"${chatNote?' aria-describedby="ask-note"':''}>
          <label class="label" for="ask-input">${esc(chatLabel)}</label>
          <div class="ask-row">
            <textarea class="ask-input" id="ask-input" name="q" rows="1" maxlength="${esc(chatTa?.getAttribute('maxlength')||'110')}" placeholder="${esc(chatTa?.getAttribute('placeholder')||'')}" disabled></textarea>
            <button class="btn btn-primary" type="submit" data-cta="primary" data-slot="cta" disabled>${esc(chatBtn)}</button>
          </div>${chatNote?`
          <p class="small muted ask-note" id="ask-note">${esc(chatNote)}</p>`:''}
        </form>
      </div>
      <ul class="tools" data-slot="tools">${tools}</ul>${it.ctas.length?`
      <p class="tools-more">${it.ctas.map(a=>btn(a)).join('')}</p>`:''}
    </div>
  </div>
</section>`;
    return {raw,kind:'heroAsk'}; },
  faq(it){ const faqHtml=it.qs.map(q=>{const qt=norm(q.querySelector('.ffe-accordion-item__heading-button-content')?.childNodes[0]?.textContent||q.querySelector('h3')?.textContent); const body=q.querySelector('.ffe-accordion-item__body'); return `<details><summary><h3 class="faq-q">${esc(qt)}</h3>${icons.down}</summary><div class="answer answer-wide">${body?faqBody(body,{demote:2,legacyImg:true}):''}</div></details>`;}).join('\n');
    return {raw:`
<section class="movement paper-frost faq-movement" data-section="faq" data-intent="answer what people ask right now" data-layout="contained" data-module="faq" data-items="${it.qs.length}">
  <div class="container faq-grid">
    <h2 class="section-title" data-slot="heading">${esc(norm(it.title?.textContent))}</h2>${(it.lead||[]).filter(hasText).map(p=>`<p class="lead">${richK(p)}</p>`).join('')}
    <div class="faq" data-slot="items">${faqHtml}</div>
  </div>
</section>`}; },
  cards(it,c){ if(it.module!=='related-products') return H.cards(it,c);
    const topics=it.cards.map(cd=>{const img=cd.querySelector('img'); const a=cd.querySelector('a.card__title, a.ffe-text-link'); return `<li class="topic">${img&&imgSrc(img)?`<img class="illu" src="${asset(imgSrc(img))}" alt="" aria-hidden="true" width="48" height="48" loading="lazy" decoding="async">`:''}<a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></li>`;}).join('');
    return {raw:`
<section class="movement topics-movement" data-section="topics" data-intent="route to a help topic" data-layout="grid" data-module="topic-tiles" data-items="${it.cards.length}">
  <div class="container">
    <h2 class="section-title" data-slot="heading">${esc(norm(it.title?.textContent))}</h2>
    <ul class="topics" data-slot="tiles">${topics}</ul>
  </div>
</section>`}; },
  invites(it,c){ const b=it.banner; const m=it.meet; const mText=m.cols.flatMap(col=>col.texts)[0]; const mH=mText?.hs[0]; const mP=mText?.blocks.find(x=>x.tagName==='P'&&hasText(x)); const mA=m.cols.flatMap(col=>col.ctas)[0]; const mImg=m.cols.map(col=>col.img).find(Boolean)?.img; const isArch=c.slug===c.archetype;
    const promo=(img,h,p,a)=>{ const src=imgSrc(img); return `
    <article class="promo" data-module="promo-band">${src||isArch?`
      <img class="promo-illu" src="${asset(src)}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="160" height="120">`:''}
      <div class="promo-text">${h?`<h2 class="title-sm">${esc(norm(h.textContent))}</h2>`:''}${p?`<p>${esc(norm(p.textContent))}</p>`:''}${a?`<p>${btn(a)}</p>`:''}</div>
    </article>`; };
    return {raw:`
<section class="movement paper-sand invites" data-section="invites" data-intent="urgent: report fraud · plan: book a meeting" data-layout="grid" data-module="promo-band" data-items="2">
  <div class="container promo-grid">${promo(b.img,b.h,b.p,b.as?.[0])}${promo(mImg,mH,mP,mA)}
  </div>
</section>`}; },
};
export function render({doc,pj,slug=ARCH,archetype=ARCH}){
  const main=doc.querySelector('main'); const isArch=slug===archetype;
  const r=renderMain(main,{slug,archetype,handlers:OV,pre});
  const css=KS_CSS+(isArch?'':SIBLING_CSS+`
.tools-more{grid-column:1/-1;margin-top:var(--spacing-md)}.tools-more .btn-inline{padding-inline:0}
.hero-grid .tools-more{grid-area:auto}
`);
  const provenance=isArch
    ? { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md', dominantDimension:'composition/counter-and-shelves', conceptSeed:'surface 6acf5792 (mode operate; dealt 7,2,4; 7 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','flat spot illustrations (topic icons, FAQ illustrations, invitations)','one-corner-pair photo mask 96px on the hero photo'], improvementsApplied:['#1 compact router','#2 calm two-tier header','#3 1.25 scale','#4 one card language (hairline tiles, no chrome)','#5 Koksgrå secondary on tints','#6 hero photo at content scale','#7 four movements, no dividers'], dynamicsInterim:['#6 chat field rendered verbatim with controls disabled (boost.ai vendor decision pending)','#5 FAQ feedback thumbs static (type=button)','#2 "Velg kontor og avtal møte" keeps its href (bank-choice dialog at rollout)'] }
    : { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md', familyRenderer:'kundeservice-hub (component walker; hero-ask composed from h1 · photo · chat · tool cards)', componentsMapped:r.used, richTextFallbacks:r.fallbacks, unsourcedContent:[], canonDeviations:[], dynamicsInterim:['#6 chat field controls disabled','#5 feedback thumbs static'] };
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:r.html, css, provenance };
}
const KS_CSS=`
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
