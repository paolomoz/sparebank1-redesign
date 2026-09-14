// Contact page "Kontakt oss" — archetype utility, mode operate, no router (captured page carries no .bank-choice).
// Composition per stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md; content verbatim from the captured DOM.
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
// "<b>Term</b> line<br>line<br>line" paragraphs → <dt>Term</dt><dd>line<br>line</dd> pairs (text order preserved verbatim).
function addressPairs(p){
  const html=p.innerHTML.replace(/&#160;|&nbsp;/g,' ').replace(/<b(?:\s[^>]*)?>\s*<\/b>/g,'').replace(/\s+/g,' ');
  const parts=html.split(/<b(?:\s[^>]*)?>/).slice(1);
  return parts.map(seg=>{ const [term,rest='']=seg.split(/<\/b>/); const dd=rest.replace(/^(\s*<br>\s*)+/,'').replace(/(\s*<br>\s*)+$/,'').trim(); return `<div class="addr-pair">\n<dt>${norm(term.replace(/<br>/g,' '))}</dt>\n<dd>${dd.split(/<br>/).map(x=>norm(x)).filter(Boolean).join('<br>\n')}</dd>\n</div>`; }).join('\n');
}
export function render({doc,pj}){
  const main=doc.querySelector('main');
  const hero=main.querySelector(':scope > .columns-grid'); const hImg=hero.querySelector('img'); const h1=hero.querySelector('h1'); const hPs=[...hero.querySelectorAll('.text-wrapper p')]; const hBtn=hero.querySelector('a.ffe-button');
  const table=main.querySelector('table'); const caption=norm(table.querySelector('caption')?.textContent);
  const headCells=[...table.querySelectorAll('thead td, thead th')].map(td=>norm(td.textContent));
  const rows=[...table.querySelectorAll('tbody tr')].map(tr=>[...tr.querySelectorAll('td')]);
  const partnersWrap=main.querySelector('.background-container .text .text-wrapper'); const partnerPs=[...partnersWrap.querySelectorAll('p')].filter(p=>!EMPTY.test(p.textContent));
  const tip=main.querySelector('.tip .text-wrapper');
  const utv=[...main.querySelectorAll(':scope > .columns-grid')].pop(); const utvH=utv.querySelector('h3'); const utvPs=[...utv.querySelectorAll('.text-wrapper.max-width p')];
  const cell=(td,i)=>{ const a=td.querySelector('a'); const t=norm(td.textContent); if(a) return `<a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`; if(i===1&&/^\+?[\d\s]+$/.test(t)) return `<a class="num tel" href="tel:${t.replace(/\s+/g,'')}">${esc(t)}</a>`; return esc(t); };
  const trs=rows.map(tds=>`<tr>${tds.map((td,i)=>i===0?`<th scope="row">${cell(td,i)}</th>`:`<td>${cell(td,i)}</td>`).join('')}</tr>`).join('\n');
  const partners=partnerPs.map((p,i)=>i===0?`<h3 class="title-sm">${esc(norm(p.textContent))}</h3>`:`<p>${rich(p)}</p>`).join('');
  const mainHtml=`
<section class="movement hero" data-section="hero" data-intent="who we are, where to find us; route businesses" data-layout="split-media" data-media="image" data-module="hero-portrait">
  <div class="container hero-grid">
    <figure class="hero-media" data-slot="image"><img class="portrait" src="${asset(hImg.getAttribute('data-lazy-src')||hImg.getAttribute('src'))}" alt="${esc(hImg.getAttribute('alt')||'')}" width="498" height="498" loading="eager" fetchpriority="high" decoding="async"></figure>
    <div class="hero-text">
      <h1 data-slot="heading">${esc(norm(h1.textContent))}</h1>
      <p class="lead" data-slot="text">${esc(norm(hPs[0].textContent))}</p>
      <p class="lead" data-slot="text">${esc(norm(hPs[1].textContent))}</p>
      <p class="hero-cta"><a class="btn btn-secondary" data-slot="cta" href="${esc(hBtn.getAttribute('href'))}">${esc(norm(hBtn.textContent))}</a></p>
    </div>
  </div>
</section>
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
      </table>
      <div class="partners prose" data-slot="partners">${partners}</div>
    </div>
  </div>
</section>
<section class="movement quick" data-section="quick-help" data-intent="opening hours for a fast answer" data-layout="contained" data-module="callout">
  <div class="container"><div class="callout callout-rich" data-slot="tip">${icons.bulb}<div class="prose callout-body">${rich(tip)}</div></div></div>
</section>
<section class="movement utvikling" data-section="utvikling" data-intent="contact the alliance's shared company" data-layout="contained" data-module="address-block" data-items="${utvPs.length}">
  <div class="container">
    <h2 class="title" data-slot="heading">${esc(norm(utvH.textContent))}</h2>
    <dl class="addr" data-slot="address">${utvPs.map(addressPairs).join('')}</dl>
  </div>
</section>`;
  const css=`
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
  return { template:'static', title:pj.title, description:pj.metaDescription, router:false, main:mainHtml, css,
    provenance:{ shapeBrief:'stardust/prototypes/nb-bank-privat-kundeservice-kontakt-html-shape.md', dominantDimension:'composition/directory-page', conceptSeed:'surface 1876b3a6 (mode operate; dealt 7,2,1; 7 built)', unsourcedContent:[], signatureElements:['circle portrait (captured radgiver-sirkel) as the page photograph','Frost-30 help paper for the alliance directory'], improvementsApplied:['#3 1.25 scale','#4 no card chrome: directory as a table, addresses as a definition list','#5 Koksgrå secondary on tints','#7 movements on paper, captured dividers dropped'], enhancements:['bank phone numbers in the directory are tel: links (text verbatim; A4 scene: on a phone, mid-task)'] } };
}
