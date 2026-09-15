// Kundeservice hub (Privat) — archetype kundeservice-hub, mode operate; family renderer for its siblings (Path A′).
// Round 01 composition (2026-09-15): hero bento (ask card on Frost 5 cols · photo card 7 cols) with the four tool cards as a
// second bento row; FAQ centred in the container; topic tiles as a 3×3 bento of icon cards; the two invitations as one
// full-bleed promo row. Content verbatim from the captured DOM (stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md).
// Built on the shared component walker (nb-bank-privat-lan-html.mjs): the captured <main> is walked in order; the hero
// (h1 · photo · ask text · chat field · tool cards · optional "see all" link) is composed from the consecutive captured
// components that make it up, everything else goes through the library's generic handlers or a verbatim rich-text movement.
import { esc, asset, icons, norm, hasText, imgSrc, btn, rich, faqBody, renderMain, H, HUB_CSS, SIBLING_CSS, patchData as libPatch, inline, gridCls, promoRow } from './nb-bank-privat-lan-html.mjs';
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
    const tools=it.tools.map(cd=>{const a=cd.querySelector('a.card__title, a.ffe-text-link'); const p=cd.querySelector('p.ffe-card-body__text, p'); const t=cd.querySelector('.card__title'); return `<li class="card card--tint tool${a?' is-link':''}"><div class="card-body"><h3 class="h3 tool-title">${a?`<a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`:esc(norm(t?.textContent))}</h3><p>${esc(norm(a&&p===t?'':p?.textContent))}</p></div></li>`;}).join('');
    c.lcp=true;
    const raw=`
<section class="movement hero" data-section="hero" data-intent="ask for help: chat first, then shortcuts" data-layout="bento-cells" data-media="image" data-module="hero-ask" data-items="${it.tools.length}">
  <div class="container">
    <div class="bento hero-bento">
      <div class="card card--frost hero-card hero-ask-card"><div class="card-body">
        <h1 data-slot="heading">${esc(norm(intro.h1.textContent))}</h1>${askH?`
        <h2 class="h3 hero-sub" data-slot="subheading">${esc(norm(askH.textContent))}</h2>`:''}${askPs.map((p,i)=>`
        <p${i===0?' class="lead"':''} data-slot="text">${inline(p)}</p>`).join('')}
        <form class="ask" data-module="chat-field" data-dynamics="6 (boost.ai chat — owner decision; controls disabled in the interim)"${chatNote?' aria-describedby="ask-note"':''}>
          <label class="field-label" for="ask-input">${esc(chatLabel)}</label>
          <div class="ask-row">
            <textarea class="ask-input" id="ask-input" name="q" rows="1" maxlength="${esc(chatTa?.getAttribute('maxlength')||'110')}" placeholder="${esc(chatTa?.getAttribute('placeholder')||'')}" disabled></textarea>
            <button class="btn btn-primary" type="submit" data-cta="primary" data-slot="cta" disabled>${esc(chatBtn)}</button>
          </div>${chatNote?`
          <p class="small muted ask-note" id="ask-note">${esc(chatNote)}</p>`:''}
        </form>
      </div></div>${img?`
      <figure class="card media-photo hero-media" data-slot="image"><img class="media-img" src="${asset(imgSrc(img))}" alt="${esc(img.getAttribute('alt')||'')}" width="1280" height="853" loading="eager" fetchpriority="high" decoding="async"></figure>`:''}
    </div>
    <ul class="bento tools ${gridCls(it.tools.length)}" data-slot="cards">${tools}</ul>${it.ctas.length?`
    <p class="tools-more cta-row">${it.ctas.map(a=>btn(a)).join('')}</p>`:''}
  </div>
</section>`;
    return {raw,kind:'heroAsk'}; },
  faq(it){ const faqHtml=it.qs.map(q=>{const qt=norm(q.querySelector('.ffe-accordion-item__heading-button-content')?.childNodes[0]?.textContent||q.querySelector('h3')?.textContent); const body=q.querySelector('.ffe-accordion-item__body'); return `<details><summary><h3 class="faq-q">${esc(qt)}</h3>${icons.down}</summary><div class="answer answer-wide">${body?faqBody(body,{demote:2,legacyImg:true}):''}</div></details>`;}).join('\n');
    return {raw:`
<section class="movement faq-movement" data-section="faq" data-intent="answer what people ask right now" data-layout="contained" data-module="faq" data-items="${it.qs.length}">
  <div class="container faq-wrap">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(it.title?.textContent))}</h2>${(it.lead||[]).filter(hasText).map(p=>`<p class="lead section-lead">${richK(p)}</p>`).join('')}
    <div class="faq" data-slot="items">${faqHtml}</div>
  </div>
</section>`}; },
  cards(it,c){ if(it.module!=='related-products') return H.cards(it,c);
    const topics=it.cards.map(cd=>{const img=cd.querySelector('img'); const a=cd.querySelector('a.card__title, a.ffe-text-link'); return `<li class="card card--tint topic is-link"><div class="card-body">${img&&imgSrc(img)?`<img class="illu tile-icon" src="${asset(imgSrc(img))}" alt="" aria-hidden="true" width="48" height="48" loading="lazy" decoding="async">`:''}<h3 class="h3"><a class="cover-link" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3></div></li>`;}).join('');
    return {raw:`
<section class="movement topics-movement" data-section="topics" data-intent="route to a help topic" data-layout="grid" data-module="topic-tiles" data-items="${it.cards.length}">
  <div class="container">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(it.title?.textContent))}</h2>
    <ul class="bento topics ${gridCls(it.cards.length)}" data-slot="cards">${topics}</ul>
  </div>
</section>`}; },
  invites(it){ const b=it.banner; const m=it.meet; const mText=m.cols.flatMap(col=>col.texts)[0]; const mH=mText?.hs[0]; const mP=mText?.blocks.find(x=>x.tagName==='P'&&hasText(x)); const mA=m.cols.flatMap(col=>col.ctas)[0]; const mImg=m.cols.map(col=>col.img).find(Boolean)?.img;
    const promos=[{img:b.img,h:b.h,p:b.p,as:(b.as||[]).slice(0,1)},{img:mImg,h:mH,p:mP,as:mA?[mA]:[]}];
    return {raw:`
<section class="movement invites" data-section="invites" data-intent="urgent: report fraud · plan: book a meeting" data-layout="full-bleed-grid" data-module="promo-band" data-items="2">
  <div class="full-bleed">${promoRow(promos)}</div>
</section>`}; },
};
export function render({doc,pj,slug=ARCH,archetype=ARCH}){
  const main=doc.querySelector('main'); const isArch=slug===archetype;
  const r=renderMain(main,{slug,archetype,handlers:OV,pre});
  const css=HUB_CSS+KS_CSS+(isArch?'':SIBLING_CSS);
  const provenance=isArch
    ? { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md', dominantDimension:'composition/counter-and-shelves', conceptSeed:'surface 6acf5792 (mode operate; dealt 7,2,4; 7 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','flat spot illustrations (topic icons, FAQ illustrations, invitations) on the card tint','hero photo bleeding in its own bento cell'], improvementsApplied:['round 01: hero bento (ask card 5 + photo 7) with the tool cards as its second row','2 px cards, 6 px gutters, no border, no shadow, no hairline tiles','Ramp type scale 64/48/40/28/24','6 px borderless buttons','topic tiles as a 3×3 bento of icon cards','invitations as one full-bleed promo row (1 of 4 sections)'], dynamicsInterim:['#6 chat field rendered verbatim with controls disabled (boost.ai vendor decision pending)','#5 FAQ feedback thumbs static (type=button)','#2 "Velg kontor og avtal møte" keeps its href (bank-choice dialog at rollout)'] }
    : { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-html-shape.md', familyRenderer:'kundeservice-hub (component walker; hero-ask composed from h1 · photo · chat · tool cards)', componentsMapped:r.used, richTextFallbacks:r.fallbacks, unsourcedContent:[], canonDeviations:[], dynamicsInterim:['#6 chat field controls disabled','#5 feedback thumbs static'] };
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:r.html, css, provenance };
}
const KS_CSS=`
/* kundeservice hub — hero ask card + tool cards as one bento composition */
.hero-ask-card .card-body{justify-content:flex-start;padding:48px 48px 44px}
.hero-ask-card .hero-sub{margin-top:24px}.hero-ask-card .lead{margin-top:12px;max-width:44ch}.hero-ask-card p+p{margin-top:12px}
.hero-ask-card .ask{max-width:none}
.tools{margin-top:var(--card-gap)}.tool .card-body{padding:28px 28px 32px}.tool p{color:var(--koksgraa)}.tool-title{text-wrap:balance}
.tools-more{margin-top:var(--spacing-lg)}.tools-more .btn-inline{padding-inline:0}
/* faq answers */
.answer-wide{max-width:none}.answer-wide .prose{max-width:68ch}.answer .prose+.prose,.answer .cols+.prose,.answer .prose+.cols{margin-top:var(--spacing-lg)}
.answer h4{font-family:var(--title-font-family);font-size:var(--title);line-height:1.25;color:var(--fjell);margin-top:var(--spacing-lg)}.answer h5{font-family:var(--title-font-family);font-size:var(--lead);line-height:1.3;color:var(--fjell);margin-top:var(--spacing-lg)}.answer h6{font-family:var(--title-font-family);font-size:var(--body);line-height:1.4;color:var(--fjell);margin-top:var(--spacing-md)}
.answer h4+p,.answer h5+p,.answer h6+p,.answer h4+ol,.answer h5+ol{margin-top:var(--spacing-sm)}
.answer ol{list-style:decimal;padding-left:1.4em;margin-top:var(--spacing-sm)}.answer ol li+li{margin-top:6px}
.cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--spacing-lg) var(--spacing-xl);margin-top:var(--spacing-lg)}.cols[data-items="1"]{grid-template-columns:1fr}
.col{display:grid;gap:var(--spacing-md);align-content:start}.illu-lg{width:112px;height:112px}
.faq-foot-feedback{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:var(--spacing-lg);padding-top:var(--spacing-md);border-top:1px solid rgba(0,39,118,.12)}
.feedback-q{font-family:var(--title-font-family);color:var(--fjell);margin-right:4px}
.thumb{gap:6px}.thumb svg{width:20px;height:20px}
.faq-more{margin-top:var(--spacing-md)}.faq-more a{font-family:var(--title-font-family)}
/* topic tiles: icon cards */
.topic .card-body{padding:28px 28px 32px;flex-direction:row;align-items:center;gap:16px}.topic .tile-icon{margin:0;flex:none}.topic .card-body>*+*{margin-top:0}
@media (max-width:1024px){.hero-ask-card .card-body{padding:40px 32px}}
@media (max-width:767px){.hero-ask-card .card-body{padding:36px 20px}.tool .card-body,.topic .card-body{padding:24px 20px}.cols{grid-template-columns:1fr}.faq summary{font-size:var(--lead)}}
`;
