// Contact page "Kontakt oss" — archetype utility, mode operate; family renderer for the utility siblings (Path A′).
// No router when the captured page carries no .bank-choice. Composition per stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md;
// content verbatim from the captured DOM. Built on the shared component walker (nb-bank-privat-lan-html.mjs): this archetype's own
// shapes (circle-portrait hero, bank directory table + partners, hours callout, address definition list) are handler overrides;
// the sibling (prisliste: h1 · lead · bank-choice CTA · illustration · prose) renders through the library's generic handlers.
import { esc, asset, icons, norm, hasText, imgSrc, btn, btnKind, rich, renderMain, H, EMPTY, SIBLING_CSS, patchData as libPatch, inline } from './nb-bank-privat-lan-html.mjs';
export const patchData=libPatch;
const ARCH='nb-bank-privat-kundeservice-kontakt-html';
const richU=(el,o={})=>rich(el,{legacyImg:true,...o});
// "<b>Term</b> line<br>line<br>line" paragraphs → <dt>Term</dt><dd>line<br>line</dd> pairs (text order preserved verbatim).
function addressPairs(p){
  const html=p.innerHTML.replace(/&#160;|&nbsp;/g,' ').replace(/<b(?:\s[^>]*)?>\s*<\/b>/g,'').replace(/\s+/g,' ');
  const parts=html.split(/<b(?:\s[^>]*)?>/).slice(1);
  return parts.map(seg=>{ const [term,rest='']=seg.split(/<\/b>/); const dd=rest.replace(/^(\s*<br>\s*)+/,'').replace(/(\s*<br>\s*)+$/,'').trim(); return `<div class="addr-pair">\n<dt>${norm(term.replace(/<br>/g,' '))}</dt>\n<dd>${dd.split(/<br>/).map(x=>norm(x)).filter(Boolean).join('<br>\n')}</dd>\n</div>`; }).join('\n');
}
/** A bare captured <table> (prose item) becomes the directory; the prose that follows it (partners) rides along. */
function pre(items){
  const out=[]; for(let i=0;i<items.length;i++){ const it=items[i]; const t=it.kind==='table'?it.t:(it.kind==='prose'&&it.w?.querySelector('table')); if(t){ const dir={kind:'directory',t,partners:null}; if(items[i+1]?.kind==='prose'&&!items[i+1].w?.querySelector('table')){ dir.partners=items[i+1].w; i++; } out.push(dir); continue; } out.push(it); }
  return out;
}
const OV={
  intro(it,c){ if(!it.img){ return H.intro(it,c); } const i=it.img.img; c.lcp=true; const ctas=it.ctas;
    return {raw:`
<section class="movement hero" data-section="hero" data-intent="who we are, where to find us; route businesses" data-layout="split-media" data-media="image" data-module="hero-portrait">
  <div class="container hero-grid">
    <figure class="hero-media" data-slot="image"><img class="portrait" src="${asset(imgSrc(i))}" alt="${esc(i.getAttribute('alt')||'')}" width="498" height="498" loading="eager" fetchpriority="high" decoding="async"></figure>
    <div class="hero-text">
      <h1 data-slot="heading">${esc(norm(it.h1.textContent))}</h1>${it.leads.filter(hasText).map(p=>`
      <p class="lead" data-slot="text">${inline(p)}</p>`).join('')}${ctas.length?`
      <p class="hero-cta">${ctas.map((a,k)=>`<a class="btn ${btnKind(a.getAttribute('class')||'')}"${k===0?' data-slot="cta"':''} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`).join('')}</p>`:''}
    </div>
  </div>
</section>`}; },
  directory(it){ const table=it.t; const caption=norm(table.querySelector('caption')?.textContent); const headCells=[...table.querySelectorAll('thead td, thead th')].map(td=>norm(td.textContent)); const rows=[...table.querySelectorAll('tbody tr')].map(tr=>[...tr.querySelectorAll('td, th')]);
    const cell=(td,i)=>{ const a=td.querySelector('a'); const t=norm(td.textContent); if(a) return `<a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`; if(i===1&&/^\+?[\d\s]+$/.test(t)) return `<a class="num tel" href="tel:${t.replace(/\s+/g,'')}">${esc(t)}</a>`; return esc(t); };
    const trs=rows.map(tds=>`<tr>${tds.map((td,i)=>i===0?`<th scope="row">${cell(td,i)}</th>`:`<td>${cell(td,i)}</td>`).join('')}</tr>`).join('\n');
    const partnerPs=it.partners?[...it.partners.querySelectorAll('p')].filter(p=>!EMPTY.test(p.textContent)):[];
    const partners=partnerPs.map((p,i)=>i===0&&!p.querySelector('a')?`<h3 class="title-sm">${esc(norm(p.textContent))}</h3>`:`<p>${richU(p)}</p>`).join('');
    return {raw:`
<section class="movement paper-frost directory" data-section="directory" data-intent="find your bank: office page, phone, contact channel" data-layout="contained" data-module="bank-table" data-items="${rows.length}">
  <div class="container directory-grid">
    <div class="directory-head">
      <h2 data-slot="heading">${esc(caption)}</h2>
    </div>
    <div class="directory-body">
      <table class="bank-table" data-slot="table">
        <caption class="visually-hidden">${esc(caption)}</caption>
        <thead><tr>${headCells.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>
${trs}
        </tbody>
      </table>${it.partners?`
      <div class="partners prose" data-slot="partners">${partners}</div>`:''}
    </div>
  </div>
</section>`}; },
  tip(it){ return {raw:`
<section class="movement quick" data-section="quick-help" data-intent="opening hours for a fast answer" data-layout="contained" data-module="callout">
  <div class="container"><div class="callout callout-rich" data-slot="tip">${icons.bulb}<div class="prose callout-body">${richU(it.w)}${it.as.length?`<p class="cta-row">${it.as.map(a=>btn(a)).join('')}</p>`:''}</div></div></div>
</section>`}; },
  columns(it,c){ // text-only columns: one heading + "<b>Term</b> lines" paragraphs → address definition list
    if(!it.cards.length&&!it.navs.length&&!it.chat&&it.cols.every(col=>col.parts.every(p=>p.type==='text'))){ const texts=it.cols.flatMap(col=>col.texts); const hs=texts.flatMap(t=>t.hs); const h=hs[0]; const ps=texts.flatMap(t=>t.blocks.filter(b=>b.tagName==='P'&&hasText(b)));
      if(hs.length===1&&h&&ps.length&&ps.every(p=>p.querySelector('b')&&p.querySelector('br'))) return {raw:`
<section class="movement utvikling" data-section="utvikling" data-intent="contact the alliance's shared company" data-layout="contained" data-module="address-block" data-items="${ps.length}">
  <div class="container">
    <h2 class="title" data-slot="heading">${esc(norm(h.textContent))}</h2>
    <dl class="addr" data-slot="address">${ps.map(addressPairs).join('')}</dl>
  </div>
</section>`}; }
    return H.columns(it,c); },
};
export function render({doc,pj,slug=ARCH,archetype=ARCH}){
  const main=doc.querySelector('main'); const isArch=slug===archetype;
  const r=renderMain(main,{slug,archetype,handlers:OV,pre});
  const css=UTIL_CSS+(isArch?'':SIBLING_CSS);
  const provenance=isArch
    ? { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md', dominantDimension:'composition/directory-page', conceptSeed:'surface 1876b3a6 (mode operate; dealt 7,2,1; 7 built)', unsourcedContent:[], signatureElements:['circle portrait (captured radgiver-sirkel) as the page photograph','Frost-30 help paper for the alliance directory'], improvementsApplied:['#3 1.25 scale','#4 no card chrome: directory as a table, addresses as a definition list','#5 Koksgrå secondary on tints','#7 movements on paper, captured dividers dropped'], enhancements:['bank phone numbers in the directory are tel: links (text verbatim; A4 scene: on a phone, mid-task)'] }
    : { shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md', familyRenderer:'utility (component walker)', componentsMapped:r.used, richTextFallbacks:r.fallbacks, unsourcedContent:[], canonDeviations:[], dynamicsInterim:['#2 bank-choice CTAs keep their captured href (dialog at rollout)'] };
  const hasRouter=!!doc.querySelector('.bank-choice--inline');
  return { template:'static', title:pj.title, description:pj.metaDescription, ...(hasRouter?{}:{router:false}), main:r.html, css, provenance };
}
const UTIL_CSS=`
.title{font-family:var(--heading-font-family);font-size:var(--t-title);line-height:1.2}
.hero-grid{display:grid;grid-template-columns:340px minmax(0,1fr);gap:var(--spacing-xl);align-items:center}
.hero-media{margin:0;width:100%}.portrait{display:block;width:100%;height:auto;aspect-ratio:1;border-radius:50%;object-fit:cover;background:var(--frost-30)}
.hero-text{display:grid;gap:var(--spacing-md);max-width:44rem}.hero-text .lead{max-width:44ch}.hero-cta{margin-top:var(--spacing-sm)}
.directory-grid{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,9fr);gap:var(--spacing-xl);align-items:start}
.directory-head{position:sticky;top:var(--spacing-lg)}.directory-head h2{font-size:var(--t-headline-sm)}
.bank-table{width:100%;border-collapse:collapse;font-size:var(--body);line-height:1.4}
.bank-table th,.bank-table td{text-align:left;vertical-align:top;padding:14px 16px 14px 0;border-bottom:1px solid var(--frost)}
.bank-table thead th{font-family:var(--title-font-family);font-weight:400;color:var(--koksgraa);font-size:var(--label);letter-spacing:.01em;padding-top:0;border-bottom-color:var(--frost)}
.bank-table tbody th{font-family:var(--title-font-family);font-weight:400}.bank-table tbody th a{color:var(--vann)}.bank-table tbody th a:hover{color:var(--fjell)}
.bank-table td:nth-child(2){white-space:nowrap}.bank-table .tel{color:var(--vann)}.bank-table .tel:hover{color:var(--fjell)}
.bank-table td a{overflow-wrap:anywhere}
.partners{margin-top:var(--spacing-xl)}.partners h3{margin-bottom:var(--spacing-sm)}.partners p+p{margin-top:var(--spacing-sm)}
.callout-rich{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:start;gap:var(--spacing-md);padding:var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) var(--spacing-md);max-width:calc(68ch + 84px)}
.callout-body{max-width:68ch}.callout-body h2{font-family:var(--title-font-family);font-size:var(--title);line-height:1.25}.callout-body h2+p{margin-top:var(--spacing-sm)}
.quick{padding-block:var(--spacing-xl) 0}
.utvikling h2{margin-bottom:var(--spacing-lg)}
.addr{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg) var(--spacing-xl);margin:0}
.addr-pair{padding-top:var(--spacing-md);border-top:1px solid var(--lysgraa)}.addr-pair+.addr-pair{}
.addr dt{font-family:var(--title-font-family);color:var(--fjell)}.addr dd{margin:4px 0 0;font-variant-numeric:tabular-nums}
@media (max-width:1023px){.hero-grid{grid-template-columns:240px minmax(0,1fr);gap:var(--spacing-lg)}.directory-grid{grid-template-columns:1fr;gap:var(--spacing-md)}.directory-head{position:static}.addr{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.hero-grid{grid-template-columns:minmax(0,1fr) 38%;grid-template-areas:"h1 media" "text text";align-items:center}.hero-media{grid-area:media;justify-self:end}.hero-text{display:contents}.hero-text h1{grid-area:h1}.hero-text .lead,.hero-cta{grid-column:1/-1}.hero-text .lead{margin-top:var(--spacing-md)}.hero-cta{margin-top:var(--spacing-md)}
  .bank-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%)}.bank-table tr{display:grid;grid-template-columns:1fr auto;gap:2px 16px;padding:12px 0;border-bottom:1px solid var(--frost)}.bank-table th,.bank-table td{display:block;padding:0;border:0}.bank-table tbody th{grid-column:1/-1}.bank-table td:nth-child(3){grid-column:1/-1}.bank-table td:nth-child(3) a{display:inline-block;padding-block:4px}
  .addr{grid-template-columns:1fr;gap:var(--spacing-md)}}
`;
