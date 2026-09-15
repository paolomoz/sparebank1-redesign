// Contact page "Kontakt oss" — archetype utility, mode operate; family renderer for the utility siblings (Path A′).
// No router when the captured page carries no .bank-choice. Round 01 composition (2026-09-15): hero bento (text card on Frost 5
// cols · the captured circle portrait on a Sand tile 7 cols); the alliance directory as a 4-up bento of bank cards (name, phone,
// contact channel as arrow links) with the partner links in one Frost card; the hours callout as Sand sheet prose; the Utvikling DA
// addresses as a 4-up bento. Content verbatim from the captured DOM (stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md).
// Built on the shared component walker (nb-bank-privat-lan-html.mjs); the sibling (prisliste: h1 · lead · bank-choice CTA ·
// illustration · prose) renders through the library's generic handlers.
import { esc, asset, icons, norm, hasText, imgSrc, btn, btnKind, rich, renderMain, H, EMPTY, HUB_CSS, SIBLING_CSS, patchData as libPatch, inline, gridCls } from './nb-bank-privat-lan-html.mjs';
export const patchData=libPatch;
const ARCH='nb-bank-privat-kundeservice-kontakt-html';
const richU=(el,o={})=>rich(el,{legacyImg:true,...o});
// "<b>Term</b> line<br>line<br>line" paragraphs → one address card per term (text order preserved verbatim).
function addressCards(p){
  const html=p.innerHTML.replace(/&#160;|&nbsp;/g,' ').replace(/<b(?:\s[^>]*)?>\s*<\/b>/g,'').replace(/\s+/g,' ');
  const parts=html.split(/<b(?:\s[^>]*)?>/).slice(1);
  return parts.map(seg=>{ const [term,rest='']=seg.split(/<\/b>/); const dd=rest.replace(/^(\s*<br>\s*)+/,'').replace(/(\s*<br>\s*)+$/,'').trim(); return `<li class="card card--tint addr-pair"><div class="card-body">\n<h3 class="h3">${norm(term.replace(/<br>/g,' '))}</h3>\n<p class="num">${dd.split(/<br>/).map(x=>norm(x)).filter(Boolean).join('<br>\n')}</p>\n</div></li>`; });
}
/** A bare captured <table> (prose item) becomes the directory; the prose that follows it (partners) rides along. */
function pre(items){
  const out=[]; for(let i=0;i<items.length;i++){ const it=items[i]; const t=it.kind==='table'?it.t:(it.kind==='prose'&&it.w?.querySelector('table')); if(t){ const dir={kind:'directory',t,partners:null}; if(items[i+1]?.kind==='prose'&&!items[i+1].w?.querySelector('table')){ dir.partners=items[i+1].w; i++; } out.push(dir); continue; } out.push(it); }
  return out;
}
const OV={
  intro(it,c){ if(!it.img){ return H.intro(it,c); } const i=it.img.img; c.lcp=true; const ctas=it.ctas;
    return {raw:`
<section class="movement hero" data-section="hero" data-intent="who we are, where to find us; route businesses" data-layout="bento-cells" data-media="image" data-module="hero-portrait">
  <div class="container"><div class="bento hero-bento">
    <div class="card card--frost hero-card"><div class="card-body">
      <h1 data-slot="heading">${esc(norm(it.h1.textContent))}</h1>${it.leads.filter(hasText).map(p=>`
      <p class="lead" data-slot="text">${inline(p)}</p>`).join('')}${ctas.length?`
      <p class="cta-row hero-cta">${ctas.map((a,k)=>`<a class="btn ${btnKind(a.getAttribute('class')||'')}"${k===0?' data-slot="cta"':''} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('')}</p>`:''}
    </div></div>
    <figure class="card card--tint media-illu hero-media hero-portrait" data-slot="image"><img class="portrait" src="${asset(imgSrc(i))}" alt="${esc(i.getAttribute('alt')||'')}" width="498" height="498" loading="eager" fetchpriority="high" decoding="async"></figure>
  </div></div>
</section>`}; },
  directory(it){ const table=it.t; const caption=norm(table.querySelector('caption')?.textContent); const headCells=[...table.querySelectorAll('thead td, thead th')].map(td=>norm(td.textContent)); const rows=[...table.querySelectorAll('tbody tr')].map(tr=>[...tr.querySelectorAll('td, th')]);
    const cell=(td,i,cls='')=>{ const a=td.querySelector('a'); const t=norm(td.textContent); if(a) return `<a class="${cls}" href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`; if(i===1&&/^\+?[\d\s]+$/.test(t)) return `<a class="${cls} num tel" href="tel:${t.replace(/\s+/g,'')}">${esc(t)}</a>`; return esc(t); };
    const banks=rows.map(tds=>`<li class="card card--tint bank-card"><div class="card-body"><h3 class="h3 bank-name">${cell(tds[0],0,'bank-link')}</h3><ul class="link-list">${tds.slice(1).map((td,i)=>`<li>${headCells[i+1]?`<span class="visually-hidden">${esc(headCells[i+1])}: </span>`:''}${cell(td,i+1,'arrow')}</li>`).join('')}</ul></div></li>`).join('\n');
    const partnerPs=it.partners?[...it.partners.querySelectorAll('p')].filter(p=>!EMPTY.test(p.textContent)):[];
    const partnerH=partnerPs.find(p=>!p.querySelector('a')); const partnerLinks=partnerPs.filter(p=>p!==partnerH);
    const partners=it.partners?`<div class="bento"><div class="card card--frost partners-card" data-slot="partners"><div class="card-body">${partnerH?`<h3 class="h3">${esc(norm(partnerH.textContent))}</h3>`:''}<ul class="link-list link-list--row">${partnerLinks.map(p=>`<li>${richU(p).replace(/<a /,'<a class="arrow" ')}</li>`).join('')}</ul></div></div></div>`:'';
    return {raw:`
<section class="movement directory" data-section="directory" data-intent="find your bank: office page, phone, contact channel" data-layout="grid" data-module="bank-table" data-items="${rows.length}">
  <div class="container">
    <h2 class="h2-l section-title" data-slot="heading">${esc(caption)}</h2>${headCells[0]?`
    <p class="lead section-lead dir-hint">${esc(headCells[0])}</p>`:''}
    <ul class="bento bank-grid ${gridCls(rows.length)}" data-slot="cards">
${banks}
    </ul>${partners?`
    ${partners}`:''}
  </div>
</section>`}; },
  tip(it){ return {raw:`
<section class="movement quick" data-section="quick-help" data-intent="opening hours for a fast answer" data-layout="contained" data-module="callout">
  <div class="container"><div class="callout callout-rich" data-slot="tip">${icons.bulb}<div class="prose callout-body">${richU(it.w)}${it.as.length?`<p class="cta-row">${it.as.map(a=>btn(a)).join('')}</p>`:''}</div></div></div>
</section>`}; },
  columns(it,c){ // text-only columns: one heading + "<b>Term</b> lines" paragraphs → address cards
    if(!it.cards.length&&!it.navs.length&&!it.chat&&it.cols.every(col=>col.parts.every(p=>p.type==='text'))){ const texts=it.cols.flatMap(col=>col.texts); const hs=texts.flatMap(t=>t.hs); const h=hs[0]; const ps=texts.flatMap(t=>t.blocks.filter(b=>b.tagName==='P'&&hasText(b)));
      if(hs.length===1&&h&&ps.length&&ps.every(p=>p.querySelector('b')&&p.querySelector('br'))){ const cards=ps.flatMap(addressCards); return {raw:`
<section class="movement utvikling" data-section="utvikling" data-intent="contact the alliance's shared company" data-layout="grid" data-module="address-block" data-items="${ps.length}">
  <div class="container">
    <h2 class="h2-l section-title" data-slot="heading">${esc(norm(h.textContent))}</h2>
    <ul class="bento addr ${gridCls(cards.length)}" data-slot="cards">${cards.join('')}</ul>
  </div>
</section>`}; } }
    return H.columns(it,c); },
};
export function render({doc,pj,slug=ARCH,archetype=ARCH}){
  const main=doc.querySelector('main'); const isArch=slug===archetype;
  const r=renderMain(main,{slug,archetype,handlers:OV,pre});
  const css=HUB_CSS+UTIL_CSS+(isArch?'':SIBLING_CSS);
  const provenance=isArch
    ? { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md', dominantDimension:'composition/directory-page', conceptSeed:'surface 1876b3a6 (mode operate; dealt 7,2,1; 7 built)', unsourcedContent:[], signatureElements:['circle portrait (captured radgiver-sirkel) sitting on a Sand tile in the hero bento','Frost partner card closing the directory bento'], improvementsApplied:['round 01: hero bento (text card 5 + portrait tile 7)','directory as a 4-up bento of bank cards with arrow links (phone, channel)','2 px cards, 6 px gutters, no border, no shadow, no table rules','Ramp type scale','6 px borderless buttons','addresses as a 4-up bento'], enhancements:['bank phone numbers in the directory are tel: links (text verbatim; A4 scene: on a phone, mid-task)'] }
    : { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md', familyRenderer:'utility (component walker)', componentsMapped:r.used, richTextFallbacks:r.fallbacks, unsourcedContent:[], canonDeviations:[], dynamicsInterim:['#2 bank-choice CTAs keep their captured href (dialog at rollout)'] };
  const hasRouter=!!doc.querySelector('.bank-choice--inline');
  return { template:'static', title:pj.title, description:pj.metaDescription, ...(hasRouter?{}:{router:false}), main:r.html, css, provenance };
}
const UTIL_CSS=`
/* utility (kontakt) — portrait tile, bank cards, address cards */
.hero-portrait .portrait{width:min(56%,340px);height:auto;aspect-ratio:1;border-radius:50%;object-fit:cover}
.hero-card .lead+.lead{margin-top:12px}
.dir-hint{color:var(--koksgraa)}
.bank-card .card-body{padding:28px 28px 32px}.bank-name a{color:var(--fjell);text-decoration:none}.bank-name a:hover{color:var(--vann);text-decoration:underline}.bank-card .link-list{margin-top:14px}.bank-card .arrow{overflow-wrap:anywhere}
.partners-card{grid-column:1/-1}.partners-card .card-body{padding:32px 40px}.link-list--row{display:flex;flex-wrap:wrap;gap:8px 32px;margin-top:12px}.link-list--row li+li{margin-top:0}
.addr-pair .card-body{padding:28px 28px 32px}.addr-pair p{margin-top:8px;line-height:1.5}
@media (max-width:767px){.hero-portrait{padding:24px}.hero-portrait .portrait{width:min(50%,200px)}.partners-card .card-body{padding:28px 20px}.link-list--row{display:grid;gap:8px}}
`;
