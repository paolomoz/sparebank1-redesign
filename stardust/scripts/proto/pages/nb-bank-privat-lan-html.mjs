// Category hub (Låne) — family renderer for `category-hub` (Path A′) and the shared component library of Worker B's families
// (kundeservice-hub, tool, utility import from here). Composition per stardust/prototypes/nb-bank-privat-lan-html-shape.md;
// content verbatim from the captured DOM. The renderer WALKS the captured <main> in order (`collect` → `compose`) and maps every
// AEM component to a designed movement (`H` handlers); anything unmapped becomes a verbatim `rich-text` prose movement.
// The archetype's own output stays byte-identical through the LAN_LABELS table (section intents only).
import { esc, asset, icons } from '../chrome.mjs';
export { esc, asset, icons };
export const norm=s=>(s||'').replace(/\s+/g,' ').replace(/ /g,' ').trim();
export const EMPTY=/^[\s ]*$/;
export const imgSrc=i=>i?.getAttribute('data-lazy-src')||i?.getAttribute('src')||i?.getAttribute('data-lazy-largesrc')||i?.getAttribute('data-lazy-smallsrc')||'';
export const btnKind=cls=>/--action/.test(cls)?'btn-action':/--secondary/.test(cls)?'btn-secondary':/inline-button|tertiary|--expand|link-text/.test(cls)?'btn-inline':'btn-primary';
export const btn=(a,extra='')=>`<a class="btn ${btnKind(a.getAttribute('class')||'')}"${extra} href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a>`;
export const isSvg=s=>/\.svg(\?|$|\.)/i.test(s||'');
export const hasText=el=>!!el&&(!EMPTY.test(el.textContent)||!!el.querySelector('img'));

// Canon gap (canon-requests.md #1): footer social icons carry data-lazy-src only on some captures.
export function patchData(d){ if(!d.footer) return; const f=d.doc.querySelector('footer'); if(!f) return; for(const col of d.footer.columns) for(const l of col.links){ if(l.icon) continue; const a=[...f.querySelectorAll('.footer-bottom__column-links li a')].find(x=>x.getAttribute('href')===l.href); const i=a?.querySelector('img'); if(i) l.icon=i.getAttribute('data-lazy-src')||i.getAttribute('src')||null; } }

/** Lift a captured rich-text wrapper verbatim: strip authoring attrs, unwrap spans, b→strong, drop empty blocks, demote headings. */
export function rich(el,{demote=0,h1To=0,brbr=false,emptyB='space',aTrim='strip',legacyImg=false}={}){
  if(!el) return '';
  const c=el.cloneNode(true);
  for(const x of c.querySelectorAll('link,svg,dialog,script,style,.bank-choice-overlay'+(brbr?',br+br':''))) x.remove();
  for(const x of c.querySelectorAll('*')){ for(const a of ['style','data-rte-editelement','adhocenable','onclick','fetchpriority','itemprop','rel','target','id','role','aria-hidden','class']){ if(x.tagName!=='IMG'||a!=='class') x.removeAttribute(a); } if(/^(TD|TH|COL)$/.test(x.tagName)){ x.removeAttribute('width'); x.removeAttribute('colspan'); } }
  for(const x of [...c.querySelectorAll('colgroup')]) x.remove();
  for(const s of [...c.querySelectorAll('span')]){ s.replaceWith(...s.childNodes); }
  for(const b of [...c.querySelectorAll('b')]){ if(EMPTY.test(b.textContent)){ if(emptyB==='remove') b.remove(); else b.replaceWith(c.ownerDocument.createTextNode(' ')); continue; } const st=c.ownerDocument.createElement('strong'); st.innerHTML=b.innerHTML; b.replaceWith(st); }
  for(const x of [...c.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li')]){ if(EMPTY.test(x.textContent)&&!x.querySelector('img')) x.remove(); }
  for(const i of c.querySelectorAll('img')){ if(legacyImg){ i.setAttribute('src',asset(i.getAttribute('data-lazy-src')||i.getAttribute('src'))); i.setAttribute('alt',i.getAttribute('alt')||''); i.setAttribute('loading','lazy'); i.setAttribute('decoding','async'); i.setAttribute('aria-hidden','true'); i.setAttribute('class','illu'); i.removeAttribute('width'); i.removeAttribute('height'); continue; } const src=asset(imgSrc(i)); for(const a of [...i.attributes]) if(/^data-/.test(a.name)) i.removeAttribute(a.name); i.setAttribute('src',src); i.setAttribute('alt',i.getAttribute('alt')||''); i.setAttribute('loading','lazy'); i.setAttribute('decoding','async'); if(!i.getAttribute('alt')) i.setAttribute('aria-hidden','true'); i.setAttribute('class',isSvg(src)?'illu':'photo photo-sm'); i.removeAttribute('width'); i.removeAttribute('height'); }
  if(demote){ for(const h of [...c.querySelectorAll('h1,h2,h3,h4,h5,h6')]){ const lvl=Math.min(6,+h.tagName[1]+demote); const n=c.ownerDocument.createElement('h'+lvl); n.innerHTML=h.innerHTML; h.replaceWith(n); } }
  if(h1To){ for(const h of [...c.querySelectorAll('h1')]){ const n=c.ownerDocument.createElement('h'+h1To); n.innerHTML=h.innerHTML; h.replaceWith(n); } }
  for(const a of c.querySelectorAll('a')){ const lead=/^(\s|&nbsp;|&#160;| )+/.test(a.innerHTML); const trail=/(\s|&nbsp;|&#160;| )+$/.test(a.innerHTML); a.innerHTML=a.innerHTML.replace(/^(\s|&nbsp;|&#160;| )+|(\s|&nbsp;|&#160;| )+$/g,''); if(aTrim==='move'){ if(lead) a.before(c.ownerDocument.createTextNode(' ')); if(trail) a.after(c.ownerDocument.createTextNode(' ')); } }
  for(const a of c.querySelectorAll('a[href^="http"]')){ if(!/sparebank1\.no/.test(a.getAttribute('href'))) a.setAttribute('rel','noopener'); }
  return c.innerHTML.replace(/(<br>\s*)+<\/p>/g,'</p>').replace(/<p>(<br>\s*)+/g,'<p>').replace(/\n\s*/g,'\n').trim();
}
export const R=(el,o={})=>rich(el,{brbr:true,emptyB:'space',h1To:2,aTrim:'move',...o});
/** Inline content of a single block (p/h) — plain text when there is no inline markup worth keeping. */
export const inline=el=>el.querySelector('a,b,strong,em,i,img')?R(el):esc(norm(el.textContent));

export const feedbackRow=(fb,cls='faq-foot-feedback')=>{ if(!fb) return ''; const q=norm(fb.querySelector('.feedback-question, h2')?.textContent); const [yes,no]=[...fb.querySelectorAll('button')].map(b=>norm(b.querySelector('title')?.textContent||b.textContent)); return `<div class="${cls}" role="group" aria-label="${esc(q)}"><span class="feedback-q">${esc(q)}</span><button class="btn btn-secondary btn-sm thumb" type="button" aria-label="${esc(yes)}">${icons.thumbUp}<span>${esc(yes)}</span></button><button class="btn btn-secondary btn-sm thumb" type="button" aria-label="${esc(no)}">${icons.thumbDown}<span>${esc(no)}</span></button></div>`; };

/** FAQ answer body: sequence of .text / .columns-grid / .image / progressive-disclosure / feedback / question-page link, in captured order. */
export function faqBody(body,ro={demote:2}){
  let out='';
  for(const ch of body.children){
    if(ch.classList.contains('text')) out+=`<div class="prose">${rich(ch.querySelector('.text-wrapper'),{brbr:true,emptyB:'remove',...ro})}</div>`;
    else if(ch.classList.contains('columns-grid')){ const cols=[...ch.querySelectorAll('.columns-grid__column')].filter(c=>norm(c.textContent)||c.querySelector('img')); out+=`<div class="cols" data-items="${cols.length}">${cols.map(col=>{ const img=col.querySelector('img'); const tw=[...col.querySelectorAll('.text-wrapper')].map(t=>rich(t,{brbr:true,emptyB:'remove',...ro})).join(''); return `<div class="col">${img?`<img class="illu illu-lg" src="${asset(imgSrc(img))}" alt="" aria-hidden="true" loading="lazy" decoding="async">`:''}<div class="prose">${tw}</div></div>`; }).join('')}</div>`; }
    else if(ch.classList.contains('image')){ const i=ch.querySelector('img'); if(imgSrc(i)) out+=`<figure class="answer-figure"><img class="${isSvg(imgSrc(i))?'illu illu-wide':'photo'}" src="${asset(imgSrc(i))}" alt="${esc(i.getAttribute('alt')||'')}" loading="lazy" decoding="async"></figure>`; }
    else if(ch.classList.contains('progressive-disclosure')){ const label=norm(ch.querySelector('button')?.textContent); const content=ch.querySelector(':scope > .content')||ch; out+=`<details class="disclose"><summary class="btn-inline">${esc(label)}${icons.down}</summary><div class="disclose-body">${[...content.querySelectorAll('.text-wrapper')].map(t=>`<div class="prose">${rich(t,{brbr:true,emptyB:'remove',...ro})}</div>`).join('')}</div></details>`; }
    else if(ch.classList.contains('faq__feedback-box')) out+=feedbackRow(ch);
    else if(ch.matches('a.faq-link')) out+=`<p class="faq-more"><a class="link-more" href="${esc(ch.getAttribute('href'))}">${esc(norm(ch.textContent))}${icons.chevron}</a></p>`;
    else if(ch.classList.contains('hr')) continue;
    else if(hasText(ch)) out+=`<div class="prose">${R(ch,ro)}</div>`;
  }
  return out;
}

/* ───────────────────────── classifier: captured <main> → ordered items ───────────────────────── */
const anchorsOf=el=>[...el.querySelectorAll('a[href]')].filter(a=>!a.closest('.bank-choice-overlay'));
function textItem(el,w){ const hs=[...w.querySelectorAll('h1,h2,h3,h4,h5,h6')]; const blocks=[...w.children].filter(x=>hasText(x)||x.tagName==='IMG'); return {kind:'text',el,w,hs,blocks,h1:w.querySelector('h1'),headingOnly:hs.length===1&&blocks.length<=2&&blocks[0]===hs[0]&&blocks.every(b=>/^H[1-6]$/.test(b.tagName)||(b.tagName==='P'&&!b.querySelector('img')))}; }
export function collect(root,ctx){ const items=[]; walk(root,items,ctx); return items; }
function walk(parent,items,ctx){
  for(const el of parent.children){
    if(/^(SCRIPT|STYLE|LINK|SVG|NOSCRIPT|HR|BR)$/.test(el.tagName)) continue;
    const c=el.classList;
    if(el.tagName==='A'&&c.contains('to-parent__link')){ items.push({kind:'back',el,a:el}); continue; }
    if(/^(H[1-6]|P|UL|OL|TABLE|BLOCKQUOTE)$/.test(el.tagName)){ if(!hasText(el)) continue; const w=el.ownerDocument.createElement('div'); w.appendChild(el.cloneNode(true)); items.push(textItem(el,w)); continue; }
    if(c.contains('to-parent')){ const a=el.querySelector('a[href]'); if(a) items.push({kind:'back',el,a}); continue; }
    if(c.contains('hr')) continue;
    if(c.contains('background-container')){ walk(el.querySelector(':scope > .background-container__wrap > .background-container__content')||el,items,ctx); continue; }
    if(c.contains('text-container')||(c.contains('text')&&!c.contains('text-and-image'))){ const w=el.querySelector('.text-wrapper, .text-overlay')||el; if(!hasText(w)) continue; items.push(textItem(el,w)); continue; }
    if(c.contains('title')){ const h=el.querySelector('h1,h2,h3,h4,h5,h6'); if(h) items.push(textItem(el,h.parentElement)); continue; }
    if(c.contains('visual-nav')){ const roots=[...el.querySelectorAll('.component-root')]; if(roots.length) items.push({kind:'nav',el,roots}); continue; }
    if(c.contains('shortcuts')){ items.push({kind:'shortcuts',el,h:el.querySelector('h1,h2,h3'),links:[...el.querySelectorAll('.shortcuts-list__item a')]}); continue; }
    if(c.contains('cobranding')){ items.push({kind:'cobranding',el}); continue; }
    if(c.contains('columns-grid')){ items.push(analyzeColumns(el,ctx)); continue; }
    if(c.contains('text-and-image')){ const it=analyzeColumns(el,ctx,'.text-and-image__grid-text > .columns-grid__content, .text-and-image__grid-media > .columns-grid__content'); it.module='text-and-image'; items.push(it); continue; }
    if(c.contains('banner-small')){ const blocks=[...el.querySelectorAll('.banner-small__content')]; const one=b=>({img:b.querySelector('.banner-small__image img'),h:b.querySelector('h1,h2,h3'),p:b.querySelector('.banner-small__infotext'),as:anchorsOf(b)}); const promos=(blocks.length?blocks:[el]).map(one).filter(x=>x.h||x.p||x.as.length); if(promos.length) items.push({kind:'banner',el,promos,...promos[0]}); continue; }
    if(c.contains('related-products')||c.contains('related-topics')||c.contains('static-cards')){ const title=el.querySelector('.title h2, .title h3, .static-cards__wrapper > .text h2, .static-cards__wrapper > .text h3'); const lead=[...el.querySelectorAll(':scope > .static-cards__wrapper > .text p')].filter(hasText); const cards=dedupeCards([...el.querySelectorAll('.card')]); if(cards.length) items.push({kind:'cards',el,cards,title,lead,module:c.contains('related-products')?'related-products':c.contains('related-topics')?'related-topics':'static-cards'}); else if(hasText(el)) items.push({kind:'prose',el,w:el}); continue; }
    if(c.contains('tip')){ const w=el.querySelector('.tip-content .text-wrapper, .text-wrapper'); if(!hasText(w)&&!hasText(el)) continue; items.push({kind:'tip',el,w:w||el,as:anchorsOf(el).filter(a=>!w||!w.contains(a)),info:!!el.querySelector('.ffe-message-box--info')}); continue; }
    if(c.contains('feedback')){ items.push({kind:'feedback',el,h:el.querySelector('h1,h2,h3,.feedback-question'),btns:[...el.querySelectorAll('button')]}); continue; }
    if(c.contains('referance')||c.contains('reference')){ if(hasText(el)) items.push({kind:'compare',el,h:el.querySelector('h1,h2,h3'),ps:[...el.querySelectorAll('p')].filter(hasText)}); continue; }
    if(c.contains('faq')||(c.contains('accordion')&&!c.contains('accordion-list-container'))){ const qs=[...el.querySelectorAll('.ffe-accordion-item')]; if(!qs.length){ if(hasText(el)) items.push({kind:'prose',el,w:el}); continue; } items.push({kind:'faq',el,title:el.querySelector('.title h2, .accordion-container > h2, h2'),lead:[...el.querySelectorAll('.accordion-container > p')].filter(hasText),qs}); continue; }
    if(c.contains('accordion-list-container')){ const lis=[...el.querySelectorAll('li.accordion-list')]; if(lis.length) items.push({kind:'accordionList',el,entries:lis.map(li=>({label:norm(li.querySelector('.accordion-title')?.textContent),id:li.querySelector('.anchor')?.id||'',body:li.querySelector('.accordion-content')}))}); continue; }
    if(c.contains('section')&&el.querySelector('.section-item')){ items.push({kind:'accordionList',el,tabs:true,entries:[...el.querySelectorAll('.section-item')].map(s=>({label:norm(s.querySelector('.section-item__button')?.textContent),id:s.querySelector('.section-item__content')?.id||'',body:s.querySelector('.section-item__content'),open:!!s.querySelector('[aria-expanded="true"]')}))}); continue; }
    if(c.contains('button')||c.contains('button-list-container')){ const as=anchorsOf(el); if(as.length) items.push({kind:'cta',el,as}); continue; }
    if(c.contains('image')||c.contains('brand-logo')){ const img=el.querySelector('img'); if(img&&imgSrc(img)) items.push({kind:'image',el,img,link:img.closest('a')||el.querySelector('a[href]')}); continue; }
    if(c.contains('progressive-disclosure')){ const label=norm(el.querySelector('button')?.textContent); const content=el.querySelector(':scope > .content')||el.children[1]; if(!content) continue; items.push({kind:'disclosure',el,label,children:collect(content,ctx)}); continue; }
    if(c.contains('step-by-step')){ items.push({kind:'steps',el,steps:[...el.querySelectorAll('.step-item__wrapper')].map((s,i)=>({n:norm(s.querySelector('.step__number')?.textContent)||String(i+1),a:s.querySelector('.step__title a'),title:norm(s.querySelector('.step__title')?.textContent),body:s.querySelector('.step-item__content')})),info:el.querySelector('.step__info')}); continue; }
    if(c.contains('currency-converter')){ items.push({kind:'converter',el}); continue; }
    if(c.contains('base-component')){ items.push({kind:'calculator',el,mount:el.querySelector('.external-component > div[id], [data-process]')}); continue; }
    if(c.contains('usp')){ items.push({kind:'usp',el,entries:[...el.querySelectorAll('.icon-list__item')].map(x=>({img:x.querySelector('img'),w:x.querySelector('.text-wrapper')}))}); continue; }
    if(c.contains('table')&&el.querySelector('table')){ items.push({kind:'table',el,t:el.querySelector('table'),title:el.querySelector('.title h2, .title h3')}); continue; }
    if(c.contains('card')){ items.push({kind:'cards',el,cards:[el],title:null,lead:[],module:'card'}); continue; }
    if(c.contains('chat-field')){ items.push({kind:'chat',el}); continue; }
    if((c.contains('aem-main-container')||c.contains('aem-component-container')||c.contains('accordion-list-wrapper')||c.contains('cq-dd-paragraph')||(el.tagName==='DIV'&&!el.getAttribute('class')))&&el.children.length){ walk(el,items,ctx); continue; }
    if(hasText(el)) items.push({kind:'prose',el,w:el});
  }
}
function dedupeCards(cards){ const seen=new Set(); return cards.filter(c=>{ const a=c.querySelector('a[href]'); const k=(a?.getAttribute('href')||'')+'|'+norm(c.querySelector('.card__title, h2, h3, h4')?.textContent||c.textContent.slice(0,80)); if(seen.has(k)) return false; seen.add(k); return true; }); }
/** A columns-grid: every .columns-grid__content becomes a column of ordered parts; cards / navs / chat are lifted. */
export function analyzeColumns(el,ctx,sel=':scope > .columns-grid__wrap > .ffe-grid > .ffe-grid__row > .columns-grid__column > .columns-grid__content'){
  let contents=[...el.querySelectorAll(sel)]; if(!contents.length) contents=[...el.querySelectorAll('.columns-grid__content')].filter(c=>!c.parentElement.closest('.columns-grid__content'));
  const it={kind:'columns',el,cols:[],cards:[],navs:[],chat:null,title:null,lead:[],h1:null,module:'columns'};
  for(const c of contents){ const col={parts:[],img:null,texts:[],ctas:[]}; const sub=collect(c,ctx);
    for(const s of sub){ if(s.kind==='cards'){ it.cards.push(...s.cards); continue; } if(s.kind==='nav'){ it.navs.push(...s.roots); continue; } if(s.kind==='chat'){ it.chat=s.el; continue; }
      if(s.kind==='image'){ if(!col.img) col.img=s; col.parts.push({type:'image',it:s}); continue; }
      if(s.kind==='text'){ if(s.h1&&!it.h1) it.h1=s; col.texts.push(s); col.parts.push({type:'text',it:s}); continue; }
      if(s.kind==='cta'){ col.ctas.push(...s.as); col.parts.push({type:'cta',it:s}); continue; }
      col.parts.push({type:'inner',it:s}); }
    if(col.parts.length) it.cols.push(col); }
  it.cards=dedupeCards(it.cards);
  if(it.cards.length||it.navs.length){ // heading text outside the cards → section title / lead
    const t=it.cols.flatMap(c=>c.texts).find(x=>x.hs.length); if(t){ it.title=t.hs[0]; it.lead=t.blocks.filter(b=>b.tagName==='P'&&hasText(b)); } it.extraTexts=it.cols.flatMap(c=>c.texts).filter(x=>x!==t); it.extraCtas=it.cols.flatMap(c=>c.ctas); it.extraImgs=it.cols.flatMap(c=>c.parts.filter(p=>p.type==='image').map(p=>p.it)); }
  return it;
}

/* ───────────────────────── post-processing: intro, pending headings, groups ───────────────────────── */
const TITLED=['doors','nav','cards','faq','steps','accordionList','disclosure','usp','table','columns','converter','calculator'];
export function compose(items,ctx){
  const out=[]; let i=0; let back=null; let intro=null;
  while(i<items.length){ const it=items[i];
    if(it.kind==='back'){ back=it; i++; continue; }
    if(it.kind==='nav'){ const roots=[...it.roots]; let j=i+1; while(j<items.length&&items[j].kind==='nav'){ roots.push(...items[j].roots); j++; } out.push({kind:'doors',roots,el:it.el,title:it.title,lead:it.lead}); i=j; continue; }
    if(!intro&&it.kind==='text'&&it.h1){ intro={kind:'intro',h1:it.h1,leads:[],ctas:[],rest:null,back}; const blocks=it.blocks; let k=blocks.indexOf(it.h1)+1; while(k<blocks.length&&blocks[k].tagName==='P'){ intro.leads.push(blocks[k]); k++; }
      if(k<blocks.length){ const c=it.w.cloneNode(true); const bl=[...c.children]; for(let z=0;z<k;z++) if(bl[z]) bl[z].remove(); intro.rest=c; }
      let j=i+1; while(j<items.length){ const n=items[j]; if(n.kind==='text'&&!n.hs.length&&!intro.ctas.length&&!intro.rest&&n.blocks.every(b=>b.tagName==='P'&&!b.querySelector('img'))){ intro.leads.push(...n.blocks); j++; continue; } if(n.kind==='cta'){ intro.ctas.push(...n.as); j++; continue; } break; }
      out.push(intro); if(intro.rest&&hasText(intro.rest)) out.push({kind:'prose',w:intro.rest}); i=j; continue; }
    if(!intro&&it.kind==='columns'&&it.h1&&!it.cards.length&&!it.navs.length&&!it.chat){ // hero grid: h1 + lead (+ cta) beside a picture
      const t=it.h1; const imgs=it.cols.flatMap(c=>c.parts.filter(p=>p.type==='image').map(p=>p.it)); intro={kind:'intro',h1:t.h1,leads:t.blocks.filter(b=>b!==t.h1&&b.tagName==='P'),ctas:it.cols.flatMap(c=>c.ctas),img:imgs[0],imgs,back,columns:it}; const others=it.cols.flatMap(c=>c.texts).filter(x=>x!==t);
      out.push(intro); for(const o of others) out.push({kind:'prose',w:o.w}); i++; continue; }
    if(it.kind==='text'&&it.headingOnly&&i+1<items.length&&TITLED.includes(items[i+1].kind)&&!(items[i+1].kind==='columns'&&items[i+1].h1)&&!items[i+1].title){ const n=items[i+1]; n.title=it.hs[0]; n.lead=[...(n.lead||[]),...it.blocks.filter(b=>b.tagName==='P')]; i++; continue; }
    if(it.kind==='text') out.push({kind:'prose',w:it.w,el:it.el}); else out.push(it);
    i++; }
  if(!intro){ // no h1 captured → promote the first heading
    const first=out.find(x=>x.kind==='prose'&&x.w?.querySelector('h1,h2,h3')); if(first){ const h=first.w.querySelector('h1,h2,h3'); const c=first.w.cloneNode(true); c.querySelector('h1,h2,h3').remove(); const idx=out.indexOf(first); out.splice(idx,1,{kind:'intro',h1:h,leads:[],ctas:[],back},...(hasText(c)?[{kind:'prose',w:c}]:[])); } }
  if(back){ const in0=out.find(x=>x.kind==='intro'); if(in0&&!in0.back) in0.back=back; }
  return out;
}

/* ───────────────────────── section frame + tint policy ───────────────────────── */
export function frame(s){
  if(s.raw) return s.raw;
  const cls=`${s.tint?s.tint+' ':''}${s.cls}`; const attrs=[`class="${s.movement===false?'':'movement '}${cls}"`,`data-section="${s.section}"`,`data-intent="${esc(s.intent)}"`,`data-layout="${s.layout||'contained'}"`];
  if(s.items!=null) attrs.push(`data-items="${s.items}"`); attrs.push(`data-module="${s.module}"`); if(s.media) attrs.push(`data-media="${s.media}"`); if(s.dyn) attrs.push(`data-dynamics="${esc(s.dyn)}"`); if(s.deviation) attrs.push(`data-deviation="${esc(s.deviation)}"`);
  return `\n<section ${attrs.join(' ')}>\n  <div class="${s.container||'container'}">${s.inner}</div>\n</section>`;
}
export const block=s=>`<div class="block ${(s.container||'container').replace(/\bcontainer\b/,'').trim()} ${s.cls}" data-module="${s.module}">${s.inner.trim()}</div>`;
/** ≤ 2 tinted movements per page, never the same tint adjacent (ARCHETYPE-BRIEF rule 4). */
export function assignTints(specs,{max=2}={}){ let n=0; let prev=null; for(const s of specs){ if(s.movement===false){ prev=null; continue; } if(s.wantTint&&n<max&&prev!==s.wantTint){ s.tint=s.wantTint; n++; } prev=s.tint||null; } }

/* ───────────────────────── generic handlers (lån-identical markup) ───────────────────────── */
const doorData=n=>{ const type=n.getAttribute('data-type')||'medium'; const a=n.querySelector('a[href]'); const h=n.querySelector('h1,h2,h3,h4'); const p=n.querySelector('p'); if(type==='small'){ const i=n.querySelector('.nav--small__card__content__icon img'); return {type,href:a?.getAttribute('href'),title:norm(h?.textContent),text:norm(p?.textContent),img:imgSrc(i),alt:i?.getAttribute('alt')||''}; } const bg=n.querySelector('.nav--med__background, .nav--big')?.getAttribute('style')||''; const url=(bg.match(/url\(["']?([^"')]+)/)||[])[1]||n.getAttribute('data-image-src'); return {type,href:a?.getAttribute('href'),title:norm(h?.textContent),text:norm(p?.textContent),img:url,alt:n.getAttribute('data-image-alt')||''}; };
const titleHtml=(it,cls='section-title')=>it.title?`\n    <h2 class="${cls}" data-slot="heading">${esc(norm(it.title.textContent))}</h2>${(it.lead||[]).filter(hasText).map(p=>`<p class="lead" data-slot="text">${inline(p)}</p>`).join('')}`:'';
const linked=(html,it)=>it?.link?`<a class="img-link" href="${esc(it.link.getAttribute('href'))}">${html}</a>`:html;
const imgTag=(i,{cls,eager=false,w,h}={})=>{ const src=imgSrc(i); const alt=i.getAttribute('alt')||''; return `<img class="${cls}" src="${asset(src)}" alt="${esc(alt)}"${alt?'':' aria-hidden="true"'}${w?` width="${w}" height="${h}"`:''} loading="${eager?'eager':'lazy'}"${eager?' fetchpriority="high"':''} decoding="async">`; };
export const H={
  intro(it,c){ const back=it.back?`<p class="back"><a class="backlink" href="${esc(it.back.a.getAttribute('href'))}">${icons.back}<span>${esc(norm(it.back.a.textContent))}</span></a></p>`:''; const leads=it.leads.filter(hasText).map(p=>`<p class="lead" data-slot="text">${inline(p)}</p>`).join(''); const ctas=it.ctas.length?`<p class="cta-row">${it.ctas.map((a,i)=>btn(a,i===0?' data-slot="cta"':'')).join('')}</p>`:'';
    const text=`${back}<h1 data-slot="heading">${esc(norm(it.h1.textContent))}</h1>${leads}${ctas}`;
    if(it.img){ const i=it.img.img; const svg=isSvg(imgSrc(i)); c.lcp=true; return {cls:'intro intro-media',section:'hero',intent:'name the page',layout:'split-media',media:svg?'illustration':'image',module:'page-title',container:'container intro-grid',inner:`<div class="intro-text">${text}</div><figure class="intro-figure" data-slot="image">${linked(imgTag(i,{cls:svg?'illu illu-xl':'photo',eager:true,w:svg?0:1280,h:853}),it.img)}${(it.imgs||[]).slice(1).map(x=>linked(imgTag(x.img,{cls:'illu illu-lg'}),x)).join('')}</figure>`}; }
    return {cls:'intro',section:'hero',intent:'name the page',module:'page-title',container:'container intro-text',inner:text}; },
  doors(it,c){ const ds=it.roots.map(doorData); const doors=ds.filter(d=>d.type!=='small'); const smalls=ds.filter(d=>d.type==='small'); const eager=!c.lcp; c.lcp=true;
    const doorHtml=doors.map((d,i)=>`<li class="door">${d.img?`<img class="photo photo-sm" src="${asset(d.img)}" alt="${esc(d.alt)}" width="768" height="512" loading="${eager&&i<2?'eager':'lazy'}"${eager&&i===0?' fetchpriority="high"':''} decoding="async">`:''}<h2 class="card-title title-sm"><a href="${esc(d.href)}">${esc(d.title)}</a></h2>${d.text?`<p>${esc(d.text)}</p>`:''}</li>`).join('');
    const smallHtml=smalls.map(d=>`<li class="tile small-door">${d.img?`<img class="illu tile-icon" src="${asset(d.img)}" alt="${esc(d.alt)}" width="40" height="40" loading="lazy" decoding="async">`:''}<h2 class="card-title title-sm"><a href="${esc(d.href)}">${esc(d.title)}</a></h2>${d.text?`<p>${esc(d.text)}</p>`:''}</li>`).join('');
    return {cls:'doors',section:'doors',intent:'route to sub-topics',layout:'grid',items:ds.length,module:'visual-nav',media:'image',inner:`${titleHtml(it)}${doors.length?`\n    <ul class="door-grid" data-slot="cards">${doorHtml}</ul>`:''}${smalls.length?`\n    <ul class="small-grid" data-slot="cards-small">${smallHtml}</ul>`:''}\n  `}; },
  shortcuts(it){ const links=it.links.map(a=>`<li><a class="btn-inline shortcut" href="${esc(a.getAttribute('href'))}"><span>${esc(norm(a.textContent))}</span>${icons.chevron}</a></li>`).join(''); return {cls:'shortcuts',section:'shortcuts',intent:'self-service shortcuts',items:it.links.length,module:'shortcut-row',container:'container shortcut-row',inner:`${it.h?`<h2 class="title-sm" data-slot="heading">${esc(norm(it.h.textContent))}</h2>`:''}<ul class="shortcut-list" data-slot="links">${links}</ul>`}; },
  cobranding(it){ const cb=it.el; const cbQ=cb.querySelector('.cobranding__header .ffe-h4, .cobranding__header h2, .cobranding__header h3, .cobranding__header p'); const cbBtn=cb.querySelector('.cobranding__header button'); const cbLogo=cb.querySelector('.cobranding__image-top img'); const cbH=cb.querySelector('.cobranding__heading h2, .cobranding__heading h3, .cobranding__column h2, .cobranding__column h3'); const cbP2=cb.querySelector('.cobranding__column2 .text-wrapper p'); const cbPs=[...cb.querySelectorAll('.cobranding__column .text-wrapper p, .cobranding__text .text-wrapper p')].filter(p=>hasText(p)&&p!==cbP2); const cbAs=[...cb.querySelectorAll('.cobranding__column a[href], .cobranding__content a[href]')].filter(a=>!a.closest('.bank-choice-overlay')); const cbIllu=cb.querySelector('.cobranding__column2 img, .cobranding__image img'); const illuPhoto=cbIllu&&!isSvg(imgSrc(cbIllu));
    const seen=new Set(); const cbBtns=cbAs.filter(a=>{const k=a.getAttribute('href')+norm(a.textContent); if(seen.has(k)) return false; seen.add(k); return true;}).map(a=>btn(a)).join('');
    const summary=`<summary>${cbQ?`<span class="title-sm cobrand-q" data-slot="heading">${esc(norm(cbQ.textContent))}</span>`:''}${cbBtn?`<span class="btn-inline cobrand-toggle">${esc(norm(cbBtn.textContent))}${icons.down}</span>`:''}</summary>`;
    return {cls:'membership',wantTint:'paper-sand',section:'membership',intent:'membership benefits',module:'cobranding',inner:`
    <details class="cobrand">
      ${summary}
      <div class="cobrand-panel">
        <div class="cobrand-main">${cbLogo&&imgSrc(cbLogo)?`
          <img class="cobrand-logo" src="${asset(imgSrc(cbLogo))}" alt="${esc(cbLogo.getAttribute('alt')||'')}" width="120" height="60" loading="lazy" decoding="async">`:''}${cbH?`
          <h2 class="cobrand-name" data-slot="heading">${esc(norm(cbH.textContent))}</h2>`:''}
          <div class="prose" data-slot="text">${cbPs.map(p=>`<p>${inline(p)}</p>`).join('')}</div>${cbBtns?`
          <p class="cta-row">${cbBtns}</p>`:''}
        </div>${cbIllu||cbP2?`
        <aside class="cobrand-side">${cbIllu&&imgSrc(cbIllu)?`
          <img class="${illuPhoto?'photo photo-sm cobrand-photo':'illu cobrand-illu'}" src="${asset(imgSrc(cbIllu))}" alt="${illuPhoto?esc(cbIllu.getAttribute('alt')||''):''}"${illuPhoto&&cbIllu.getAttribute('alt')?'':' aria-hidden="true"'}${illuPhoto?' width="768" height="512"':' width="160" height="200"'} loading="lazy" decoding="async">`:''}${cbP2?`
          <p>${inline(cbP2)}</p>`:''}
        </aside>`:''}
      </div>
    </details>
  `}; },
  columns(it,c){
    if(it.cards.length) return H.cards({...it,kind:'cards',module:it.module==='columns'?'card-grid':it.module},c);
    if(it.navs.length) return H.doors({kind:'doors',roots:it.navs,title:it.title,lead:it.lead},c);
    if(it.chat) return H.chatColumns(it,c);
    const cols=it.cols.filter(col=>col.parts.length);
    if(!cols.length) return null;
    if(cols.length===1) return H.prose({kind:'prose',col:cols[0],title:it.title,lead:it.lead},c);
    const mediaOnly=cols.filter(col=>col.parts.every(p=>p.type==='image')); const textCols=cols.filter(col=>!col.parts.every(p=>p.type==='image'));
    if(cols.length===2&&mediaOnly.length===1&&textCols.length===1) return H.split({media:mediaOnly[0],text:textCols[0],mediaFirst:cols[0]===mediaOnly[0],title:it.title,lead:it.lead,module:it.module},c);
    const help=cols.map(col=>`<article class="help-col">${colParts(col,c)}</article>`).join('');
    return {cls:'help',section:'help',intent:'help columns',layout:'grid',items:cols.length,module:it.module==='columns'?'split-media':it.module,media:cols.some(col=>col.img)?'image':undefined,container:`container help-grid${cols.length>2?' help-grid-'+Math.min(cols.length,4):''}`,inner:`${it.title?`<h2 class="section-title help-title" data-slot="heading">${esc(norm(it.title.textContent))}</h2>`:''}${help}`}; },
  split(it,c){ const im=it.media.img.img; const svg=isSvg(imgSrc(im)); const extra=it.media.parts.slice(1).filter(p=>p.type==='image').map(p=>linked(imgTag(p.it.img,{cls:'illu illu-lg'}),p.it)).join('');
    return {cls:`split${it.mediaFirst?' media-first':''}`,section:'split',intent:'text with media',layout:'split-media',media:svg?'illustration':'image',module:it.module==='columns'?'split-media':it.module,container:'container split-grid',inner:`<figure class="split-media" data-slot="image">${linked(imgTag(im,{cls:svg?'illu illu-xl':'photo',w:svg?0:1280,h:853}),it.media.img)}${extra}</figure><div class="split-text">${it.title?`<h2 data-slot="heading">${esc(norm(it.title.textContent))}</h2>`:''}${(it.lead||[]).filter(hasText).map(p=>`<p class="lead">${inline(p)}</p>`).join('')}${colParts(it.text,c)}</div>`}; },
  cards(it,c){ const photo=it.cards.some(cd=>{const i=cd.querySelector('img'); return i&&imgSrc(i)&&!isSvg(imgSrc(i));});
    const tiles=it.cards.map(cd=>cardTile(cd,c)).join('');
    const extras=(it.extraImgs||[]).map(x=>linked(imgTag(x.img,{cls:'illu illu-lg'}),x)).join('')+(it.extraTexts||[]).map(t=>`<div class="prose cards-note">${R(t.w)}</div>`).join('')+((it.extraCtas||[]).length?`<p class="cta-row">${it.extraCtas.map(a=>btn(a)).join('')}</p>`:'');
    return {cls:'popular',wantTint:'paper-sand',section:'popular',intent:'related content',layout:'grid',items:it.cards.length,module:it.module,inner:`${it.title?`<h2 class="section-title" data-slot="heading">${esc(norm(it.title.textContent))}</h2>`:''}${(it.lead||[]).filter(hasText).map(p=>`<p class="lead cards-lead" data-slot="text">${inline(p)}</p>`).join('')}<ul class="${photo?'card-grid':'pop-grid'}" data-slot="cards">${tiles}</ul>${extras}`}; },
  banner(it){ const promo=x=>{ const src=imgSrc(x.img); return `<article class="promo">${src?`<img class="promo-illu" src="${asset(src)}" alt="" aria-hidden="true" width="140" height="200" loading="lazy" decoding="async">`:''}<div class="promo-text">${x.h?`<h2 class="title-sm" data-slot="heading">${esc(norm(x.h.textContent))}</h2>`:''}${x.p?`<p data-slot="text">${inline(x.p)}</p>`:''}${x.as.length===1?`<p>${btn(x.as[0],' data-slot="cta"')}</p>`:x.as.length?`<p class="cta-row">${x.as.map(a=>btn(a)).join('')}</p>`:''}</div></article>`; }; const ps=it.promos||[it];
    if(ps.length>1) return {cls:'switch invites',section:'invites',intent:'invitations',layout:'grid',items:ps.length,module:'promo-band',container:'container promo-grid',inner:ps.map(promo).join('')};
    return {cls:'switch',section:'switch',intent:'invitation',module:'promo-band',inner:promo(ps[0])}; },
  tip(it){ const w=it.w; const blocks=[...w.children].filter(hasText); const h=blocks[0]&&/^H[1-6]$/.test(blocks[0].tagName)?blocks[0]:null; const simple=h&&blocks.length===2&&blocks[1].tagName==='P'&&!blocks[1].querySelector('a,b,strong,br')&&it.as.length<=1;
    if(simple) return {cls:'tip',section:'tip',intent:'notice',module:'callout',inner:`<div class="callout">${icons.bulb}<div class="callout-text"><h2 class="title-sm" data-slot="heading">${esc(norm(h.textContent))}</h2><p data-slot="text">${esc(norm(blocks[1].textContent))}</p>${it.as.length?`<p>${btn(it.as[0],' data-slot="cta" data-cta="primary"')}</p>`:''}</div></div>`};
    return {cls:'tip',section:'tip',intent:'notice',module:'callout',inner:`<div class="callout callout-rich" data-slot="tip">${icons.bulb}<div class="prose callout-body">${R(w)}${it.as.length?`<p class="cta-row">${it.as.map(a=>btn(a)).join('')}</p>`:''}</div></div>`}; },
  feedback(it){ const labels=it.btns.map(b=>norm(b.querySelector('title')?.textContent||b.textContent)); const yes=labels[0]||'Ja'; const no=labels[1]||'Nei'; return {cls:'feedback',movement:false,section:'feedback',intent:'page feedback (static)',module:'feedback',dyn:'5',container:'container feedback-row',inner:`<h2 data-slot="heading">${esc(norm(it.h?.textContent))}</h2><div class="feedback-btns"><button class="btn btn-secondary" type="button">${icons.thumbUp}<span class="visually-hidden">${esc(yes)}</span></button><button class="btn btn-secondary" type="button">${icons.thumbDown}<span class="visually-hidden">${esc(no)}</span></button></div>`}; },
  compare(it,c){ if(it.el.querySelector('.columns-grid, .image, .card, .button')){ return {cls:'compare',section:'compare',intent:'reference',module:'cta-band',inner:`<div class="cta-band cta-band-wide">${renderInner(collect(it.el,c),c)}</div>`}; } const ps=it.ps.map(p=>`<p data-slot="text">${p.innerHTML.replace(/<a\s([^>]*)>/g,'<a $1 class="link-more" rel="noopener">').replace(/<\/a>/g,`${icons.external}</a>`).replace(/\s+/g,' ').trim()}</p>`).join(''); return {cls:'compare',section:'compare',intent:'regulatory: compare prices',module:'cta-band',inner:`<div class="cta-band">${it.h?`<h2 class="title-sm" data-slot="heading">${esc(norm(it.h.textContent))}</h2>`:''}${ps}</div>`}; },
  faq(it,c){ const qa=it.qs.map(q=>{ const qt=norm(q.querySelector('.ffe-accordion-item__heading-button-content')?.childNodes[0]?.textContent||q.querySelector('h2,h3,h4,button')?.textContent); const body=q.querySelector('.ffe-accordion-item__body')||q.querySelector('.accordion__content, .faq-item__content'); return `<details><summary><h3 class="faq-q">${esc(qt)}</h3>${icons.down}</summary><div class="answer answer-wide">${body?faqBody(body):''}</div></details>`; }).join('\n');
    return {cls:'faq-movement',wantTint:'paper-frost',section:'faq',intent:'answers to common questions',module:'faq',items:it.qs.length,container:'container faq-grid',inner:`${it.title?`<h2 class="section-title" data-slot="heading">${esc(norm(it.title.textContent))}</h2>`:'<div></div>'}<div class="faq-body">${(it.lead||[]).filter(hasText).map(p=>`<p class="lead">${inline(p)}</p>`).join('')}<div class="faq" data-slot="items">${qa}</div></div>`}; },
  accordionList(it,c){ const entries=it.entries.map(e=>{ const inner=e.body?renderInner(collect(e.body,c),c):''; return `<details class="acc"${e.open?' open':''}${e.id?` id="${esc(e.id)}"`:''}><summary><h3 class="faq-q">${esc(e.label)}</h3>${icons.down}</summary><div class="answer answer-wide">${inner}</div></details>`; }).join('\n');
    return {cls:'accordion-list',section:'details',intent:it.tabs?'choose a topic':'grouped details',module:it.tabs?'tabs':'accordion-list',items:it.entries.length,inner:`${titleHtml(it)}<div class="faq acc-list" data-slot="items">${entries}</div>`}; },
  cta(it){ return {cls:'ctas',section:'cta',intent:'call to action',module:'cta-row',inner:`<p class="cta-row">${it.as.map(a=>btn(a)).join('')}</p>`}; },
  image(it,c){ const i=it.img; const svg=isSvg(imgSrc(i)); const img=imgTag(i,{cls:svg?'illu illu-xl':'photo',eager:!c.lcp,w:svg?0:1280,h:853}); c.lcp=true; return {cls:'figure',section:'figure',intent:'illustration',module:'image',media:svg?'illustration':'image',inner:`<figure class="figure-wrap">${it.link?`<a class="img-link" href="${esc(it.link.getAttribute('href'))}">${img}</a>`:img}</figure>`}; },
  disclosure(it,c){ return {cls:'disclosure',section:'more',intent:'optional detail, collapsed',module:'disclosure',inner:`${titleHtml(it)}<details class="disclose"><summary class="btn btn-secondary">${esc(it.label)}${icons.down}</summary><div class="disclose-body">${renderInner(it.children,c)}</div></details>`}; },
  steps(it,c){ const lis=it.steps.map((s,i)=>{ const id=(s.a?.getAttribute('href')||'').replace(/^#/,''); const body=s.body&&hasText(s.body)?s.body:(i===0?it.info:null); const inner=body?renderInner(collect(body,c),c):''; return `<li class="step"${id?` id="${esc(id)}"`:''}><h3 class="step-title title-sm">${s.a?`<a href="${esc(s.a.getAttribute('href'))}">${esc(s.title)}</a>`:esc(s.title)}</h3><div class="step-body">${inner}</div></li>`; }).join('');
    return {cls:'steps',wantTint:'paper-frost',section:'steps',intent:'do the task step by step',module:'steps',items:it.steps.length,inner:`${titleHtml(it)}<ol class="step-list" data-slot="steps">${lis}</ol>`}; },
  converter(it){ const el=it.el; const from=norm(el.querySelector('.from-currency-code')?.textContent); const to=norm(el.querySelector('.to-currency-code')?.textContent); const labels=[...el.querySelectorAll('.on-top')].map(x=>norm(x.textContent)); const input=el.querySelector('input.input-exchange-amount'); const out=norm(el.querySelector('.to-exchanged-amount')?.textContent); const rate=el.querySelector('.msg-rate-detail'); const msgs=[...el.querySelectorAll('.msg-buy, .msg-sell, .msg-cross')].map(x=>({v:(x.getAttribute('class')||'').replace('msg-',''),t:norm(x.textContent)})).filter(x=>x.t); const msg=msgs.length?`<p class="small muted conv-msg">${msgs.map((x,i)=>`<span data-rate-variant="${esc(x.v)}"${i?' hidden':''}>${esc(x.t)}</span>`).join('')}</p>`:''; const lists=[...el.querySelectorAll('.currency-rates-list')].map(ul=>[...ul.querySelectorAll('li button')].map(b=>({code:norm(b.querySelector('.currency-code')?.textContent),name:norm(b.querySelector('.currency-name')?.textContent)}))); const toggle=norm(el.querySelector('.toggle-wrapper button')?.textContent); const list=el.querySelector('.currency-list'); const listH=list?.querySelector('h2'); const table=list?.querySelector('table');
    const sel=(id,label,cur,opts)=>`<div class="conv-field"><label class="label" for="${id}-cur">${esc(label)}</label><select id="${id}-cur" name="${id}-currency" disabled>${(opts||[]).map(o=>`<option value="${esc(o.code)}"${o.code===cur?' selected':''}>${esc(o.code)} ${esc(o.name)}</option>`).join('')||`<option selected>${esc(cur)}</option>`}</select></div>`;
    const rateHtml=rate?rate.innerHTML.replace(/<span[^>]*>|<\/span>/g,'').replace(/&#160;|&nbsp;/g,' ').replace(/\s+/g,' ').trim():'';
    return {cls:'converter',section:'converter',intent:'convert an amount (static shell)',module:'currency-converter',dyn:'9 (currency converter — captured values shown, controls disabled in the interim)',inner:`<form class="conv" aria-label="${esc(labels[0]||'Fra')} ${esc(from)} – ${esc(labels[1]||'Til')} ${esc(to)}"><div class="conv-row">${sel('from',labels[0]||'Fra',from,lists[0])}<div class="conv-field"><label class="label" for="conv-amount">${esc(from)}</label><input id="conv-amount" class="conv-input num" type="tel" name="exchange-amount" value="${esc(input?.getAttribute('value')||'')}" disabled></div></div><div class="conv-row">${sel('to',labels[1]||'Til',to,lists[1])}<div class="conv-field"><span class="label" id="conv-out-l">${esc(to)}</span><output class="conv-out num" aria-labelledby="conv-out-l">${esc(out)}</output></div></div>${rateHtml?`<p class="conv-rate num">${rateHtml}</p>`:''}${msg}</form>${table?`<details class="disclose conv-list"><summary class="btn btn-secondary">${esc(toggle||norm(listH?.textContent))}${icons.down}</summary><div class="disclose-body">${listH?`<h2 class="title-sm">${esc(norm(listH.textContent))}</h2>`:''}<div class="table-wrap"><table class="data-table num">${R(table)}</table></div></div></details>`:''}`}; },
  calculator(it){ const m=it.mount; const app=it.el.querySelector('.external-component');
    if(app&&hasText(app)){ const shell=R(app).replace(/<input\b/g,'<input disabled').replace(/<(button|select|textarea)\b/g,'<$1 disabled').replace(/<a\s+href="([^"]*)">([^<]*)<\/a>/g,(m0,h,t)=>/ffe-button|Logg inn/.test(m0+t)?m0:m0); return {cls:'calculator calculator-shell',section:'calculator',intent:'calculator (static shell of the captured widget text)',module:'calculator',dyn:'8 (React calculator — captured text verbatim, controls disabled in the interim)',inner:`${titleHtml(it)}<div class="calc-shell prose"${m?.id?` id="${esc(m.id)}"`:''}>${shell}</div>`}; }
    return {cls:'calculator',section:'calculator',intent:'calculator mount (captured empty; hydrates at rollout)',module:'calculator',dyn:'8 (React calculator — nothing captured to render; mount kept)',inner:`${titleHtml(it)}<div class="calc-mount"${m?.id?` id="${esc(m.id)}"`:''}${m?.getAttribute('data-process')?` data-process="${esc(m.getAttribute('data-process'))}"`:''} aria-hidden="true"></div>`}; },
  usp(it){ return {cls:'usp',section:'usp',intent:'benefits',layout:'grid',module:'usp',items:it.entries.length,inner:`${titleHtml(it)}<ul class="usp-list" data-slot="items">${it.entries.map(e=>`<li class="usp-item">${e.img&&imgSrc(e.img)?imgTag(e.img,{cls:'illu',w:72,h:72}):''}<div class="prose">${R(e.w).replace(/^<p>([^<]{2,60})<\/p>/,'<h3 class="title-sm">$1</h3>')}</div></li>`).join('')}</ul>`}; },
  table(it){ return {cls:'table-movement',section:'table',intent:'reference table',module:'table',inner:`${titleHtml(it)}<div class="table-wrap"><table class="data-table">${R(it.t)}</table></div>`}; },
  chat(it){ const chat=it.el; const label=norm(chat.querySelector('label')?.textContent); const ta=chat.querySelector('textarea'); const b=norm(chat.querySelector('button')?.textContent); return {cls:'ask-movement',section:'ask',intent:'ask the chatbot (static shell)',module:'chat-field',dyn:'6 (boost.ai chat — controls disabled in the interim)',inner:`<form class="ask" aria-label="${esc(label)}"><label class="label" for="ask-input">${esc(label)}</label><div class="ask-row"><textarea class="ask-input" id="ask-input" name="q" rows="1" maxlength="${esc(ta?.getAttribute('maxlength')||'110')}" placeholder="${esc(ta?.getAttribute('placeholder')||'')}" disabled></textarea><button class="btn btn-primary" type="submit" disabled>${esc(b)}</button></div></form>`}; },
  chatColumns(it,c){ const cols=it.cols; const text=cols.flatMap(col=>col.texts).map(t=>R(t.w)).join(''); const img=cols.map(col=>col.img).find(Boolean); const chat=H.chat({el:it.chat},c); return {cls:'ask-movement',section:'ask',intent:'ask for help: chat first',layout:img?'split-media':'contained',media:img?'image':undefined,module:'hero-ask',dyn:chat.dyn,container:'container split-grid',inner:`${img?`<figure class="split-media">${imgTag(img.img,{cls:isSvg(imgSrc(img.img))?'illu illu-xl':'photo'})}</figure>`:''}<div class="split-text"><div class="prose">${text}</div>${chat.inner}${cols.flatMap(col=>col.ctas).map(a=>`<p>${btn(a)}</p>`).join('')}</div>`}; },
  prose(it,c){ const body=it.col?colParts(it.col,c):`<div class="prose">${R(it.w||it.el)}</div>`; return {cls:'prose-movement',section:'prose',intent:'captured content, verbatim',module:'rich-text',container:'container prose-wrap',inner:`${it.title?`<h2 class="section-title" data-slot="heading">${esc(norm(it.title.textContent))}</h2>`:''}${(it.lead||[]).filter(hasText).map(p=>`<p class="lead">${inline(p)}</p>`).join('')}${body}`}; },
};
/** One column's parts in captured order: image · text (structured h2+p when that is all there is) · CTA · nested blocks. */
export function colParts(col,c){ let out=''; let ctaBuf=[]; const flush=()=>{ if(ctaBuf.length){ out+=ctaBuf.length===1?`<p>${btn(ctaBuf[0],' data-slot="cta"')}</p>`:`<p class="cta-row">${ctaBuf.map(a=>btn(a)).join('')}</p>`; ctaBuf=[]; } };
  for(const p of col.parts){ if(p.type==='cta'){ ctaBuf.push(...p.it.as); continue; } flush();
    if(p.type==='image'){ const i=p.it.img; const svg=isSvg(imgSrc(i)); const img=svg?imgTag(i,{cls:'illu illu-lg'}):`<img class="photo photo-sm" src="${asset(imgSrc(i))}" alt="${esc(i.getAttribute('alt')||'')}" width="1200" height="800" loading="lazy" decoding="async">`; out+=p.it.link?`<a class="img-link" href="${esc(p.it.link.getAttribute('href'))}">${img}</a>`:img; continue; }
    if(p.type==='text'){ const t=p.it; const bl=t.blocks; if(bl.length===2&&/^H[2-4]$/.test(bl[0].tagName)&&!bl[0].querySelector('a,img')&&bl[1].tagName==='P'&&!bl[1].querySelector('a,b,strong,br,img')) out+=`<h2 data-slot="heading">${esc(norm(bl[0].textContent))}</h2><p data-slot="text">${esc(norm(bl[1].textContent))}</p>`; else out+=`<div class="prose">${R(t.w)}</div>`; continue; }
    out+=renderInner([p.it],c); }
  flush(); return out; }
export function cardTile(cd,c){ const i=cd.querySelector('img'); const src=imgSrc(i); const a=cd.querySelector('a.card__title, a.ffe-text-link, .card__container-content a[href]'); const tw=cd.querySelector('.card__container-content .text-wrapper'); const pt=!a?cd.querySelector('.card__title'):null; const ps=[...cd.querySelectorAll('p.ffe-card-body__text, .card__container-content-wrapper > p')].filter(x=>x!==pt&&hasText(x)); const tag=cd.querySelector('span.card__tag'); const date=cd.querySelector('span.card__date'); const ctas=[...cd.querySelectorAll('.button a[href], a.ffe-button')].filter(x=>x!==a&&!x.closest('.bank-choice-overlay'));
  const photo=src&&!isSvg(src);
  const img=!src?'':photo?imgTag(i,{cls:'photo photo-sm',w:768,h:512}):`<img class="illu tile-icon" src="${asset(src)}" alt="" aria-hidden="true" width="48" height="48" loading="lazy" decoding="async">`;
  let title=''; let body=''; let ctaHtml='';
  if(a) title=`<h3 class="card-title title-sm"><a href="${esc(a.getAttribute('href'))}">${esc(norm(a.textContent))}</a></h3>`; else if(pt) title=`<h3 class="card-title title-sm">${esc(norm(pt.textContent))}</h3>`;
  if(tw){ const h=tw.querySelector('h1,h2,h3,h4,h5,h6'); const cl=tw.cloneNode(true); if(h&&!a){ const link=ctas[0]; title=`<h3 class="card-title title-sm">${link?`<a href="${esc(link.getAttribute('href'))}">${esc(norm(h.textContent))}</a>`:esc(norm(h.textContent))}</h3>`; cl.querySelector('h1,h2,h3,h4,h5,h6')?.remove(); if(link) ctaHtml=`<p>${btn(link,' data-slot="cta"')}</p>`; } if(hasText(cl)) body+=`<div class="prose">${R(cl)}</div>`; }
  body+=ps.map(x=>`<p>${inline(x)}</p>`).join('');
  const rest=ctas.filter(x=>!ctaHtml||x!==ctas[0]); ctaHtml+=rest.map(x=>`<p>${btn(x)}</p>`).join('');
  const meta=tag||date?`<p class="meta">${tag?`<span class="card__tag">${esc(norm(tag.textContent))}</span>`:''}${date?`<span class="card__date">${esc(norm(date.textContent))}</span>`:''}</p>`:'';
  return `<li class="tile ${photo?'card-tile':'pop-tile'}">${img}${meta}${title}${body}${ctaHtml}</li>`; }
export function renderInner(items,c,handlers=H){ const specs=compose(items,c).map(it=>{ if(it.kind==='intro'){ const w=it.h1.ownerDocument.createElement('div'); w.appendChild(it.h1.cloneNode(true)); for(const p of it.leads) w.appendChild(p.cloneNode(true)); return {cls:'prose-movement',module:'rich-text',inner:`<div class="prose">${R(w)}</div>${it.ctas.length?`<p class="cta-row">${it.ctas.map(a=>btn(a)).join('')}</p>`:''}`}; } return (handlers[it.kind]||H[it.kind]||H.prose)(it,c); }).filter(Boolean); return specs.map(block).join(''); }

/* ───────────────────────── page assembly ───────────────────────── */
/** Render a captured main through `handlers` (module overrides + generic H); `labels` renames sections for the archetype. */
export function renderMain(main,{slug,archetype,handlers={},labels={},tints={max:2},css={},pre}={}){
  const c={slug,archetype,lcp:false,used:new Set(),fallbacks:0};
  let items=compose(collect(main,c),c); if(pre) items=pre(items,c)||items;
  const counts={}; const specs=items.map(it=>{ const h=handlers[it.kind]||H[it.kind]||H.prose; const s=h(it,c); if(!s) return null; s.kind=s.kind||it.kind; if(s.kind==='prose') c.fallbacks++; c.used.add(s.kind); return s; }).filter(Boolean);
  assignTints(specs,tints);
  for(const s of specs){ const k=s.kind; counts[k]=(counts[k]||0)+1; const key=`${k}${counts[k]>1?counts[k]:''}`; const lab=labels[key]||labels[k]; if(lab){ if(lab.section) s.section=lab.section; if(lab.intent) s.intent=lab.intent; if(lab.cls) s.cls=lab.cls; if(lab.tint!==undefined) s.tint=lab.tint; } if(counts[k]>1&&!(lab&&lab.section)) s.section=`${s.section}-${counts[k]}`; }
  const html=specs.map(frame).join('');
  return {html,used:[...c.used],fallbacks:c.fallbacks,specs};
}

/* ───────────────────────── CSS: archetype (verbatim) + generic shapes for siblings ───────────────────────── */
export const HUB_CSS=`
.intro{padding-bottom:var(--spacing-lg)}.intro-text{display:grid;gap:var(--spacing-md)}
.doors{padding-top:var(--spacing-md)}
.door-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-lg)}
.door{position:relative;display:grid;gap:4px;align-content:start}.door .photo{margin-bottom:8px}.door .card-title a{color:var(--fjell);text-decoration:none}.door .card-title a::after{content:"";position:absolute;inset:0}.door:hover .card-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.15em}.door p{color:var(--koksgraa)}
.card-title{font-family:var(--title-font-family);font-size:var(--title)}.card p,.tile p{color:var(--koksgraa)}
.small-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg);margin-top:var(--spacing-xl)}
.tile{position:relative;display:grid;gap:8px;align-content:start;padding-top:var(--spacing-md);border-top:1px solid var(--lysgraa)}
.tile-icon{width:40px;height:40px}
.tile .card-title a{color:var(--fjell);text-decoration:none}.tile .card-title a::after{content:"";position:absolute;inset:0}.tile:hover .card-title a{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.15em}
.shortcuts{padding-top:var(--spacing-xl);padding-bottom:var(--spacing-xl)}
.shortcut-row{display:grid;gap:var(--spacing-xs);padding-top:var(--spacing-lg);border-top:1px solid var(--lysgraa)}
.shortcut-list{display:flex;flex-wrap:wrap;gap:0 var(--spacing-lg)}
.shortcut{padding-inline:0}.shortcut svg{width:18px;height:18px;stroke-width:2}
.cobrand summary{list-style:none;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:var(--spacing-sm) var(--spacing-lg);cursor:pointer;min-height:44px}.cobrand summary::-webkit-details-marker{display:none}
.cobrand-q{color:var(--fjell)}.cobrand-toggle{pointer-events:none}.cobrand[open] .cobrand-toggle svg{transform:rotate(180deg)}
.cobrand-panel{display:grid;grid-template-columns:7fr 5fr;gap:var(--spacing-xl);align-items:start;margin-top:var(--spacing-xl);padding-top:var(--spacing-xl);border-top:1px solid var(--lysgraa)}
.cobrand-main{display:grid;gap:var(--spacing-md)}.cobrand-name{font-size:var(--t-title);line-height:1.2}.cobrand-logo{width:120px;height:auto}
.cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm) var(--spacing-md);margin-top:var(--spacing-xs)}
.cobrand-side{display:grid;gap:var(--spacing-md);justify-items:start;align-self:start;max-width:28rem}
.cobrand-illu{width:140px;height:auto}
.help-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-xl)}
.help-col{display:grid;gap:var(--spacing-md);align-content:start}.help-col .photo{margin-bottom:var(--spacing-sm)}.help-col p{max-width:44rem}
.switch{padding-top:0}
.promo{display:grid;grid-template-columns:auto 1fr;gap:var(--spacing-xl);align-items:center;padding-top:var(--spacing-xl);border-top:1px solid var(--lysgraa)}
.promo-illu{width:140px;height:auto}.promo-text{display:grid;gap:var(--spacing-sm);max-width:44rem}.promo-text .btn{margin-top:var(--spacing-xs)}
.section-title{margin-bottom:var(--spacing-lg)}
.pop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-lg)}
.pop-tile{grid-template-columns:48px 1fr;align-items:start;gap:var(--spacing-md)}.pop-tile .card-title{text-wrap:balance}.pop-tile .tile-icon{width:48px;height:48px}
.callout{align-items:flex-start}.callout-text{display:grid;gap:var(--spacing-sm)}.callout-text .btn{margin-top:var(--spacing-xs)}
.feedback-btns{display:flex;gap:8px}.feedback .btn{min-width:56px;padding-inline:14px}
.compare{padding-top:0}
.link-more svg{width:16px;height:16px;margin-left:2px;vertical-align:-2px;display:inline-block}
@media (max-width:1023px){
  .small-grid{grid-template-columns:1fr 1fr}
  .cobrand-panel{grid-template-columns:1fr}
  .help-grid{grid-template-columns:1fr}.help-col .photo{max-width:36rem}
  .pop-grid{grid-template-columns:1fr 1fr}
}
@media (max-width:640px){
  .door-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}
  .small-grid{grid-template-columns:1fr;gap:var(--spacing-md);margin-top:var(--spacing-lg)}
  .small-door{grid-template-columns:40px 1fr;grid-template-areas:"icon title" "icon text";gap:2px var(--spacing-md);align-items:center}.small-door .tile-icon{grid-area:icon}.small-door .card-title{grid-area:title}.small-door p{grid-area:text}
  .shortcut-list{display:grid;gap:0}.shortcut{width:100%;justify-content:space-between}
  .promo{grid-template-columns:1fr;gap:var(--spacing-md)}.promo-illu{width:110px}
  .pop-grid{grid-template-columns:1fr;gap:var(--spacing-sm)}.pop-tile{padding-top:var(--spacing-sm)}
  .callout{flex-direction:column}
}
`;
// Generic shapes for siblings (added after the archetype CSS; the archetype page never carries them).
export const SIBLING_CSS=`
.title{font-family:var(--heading-font-family);font-size:var(--t-title);line-height:1.2}
.back{margin-bottom:var(--spacing-md)}.intro .cta-row{margin-top:var(--spacing-sm)}.intro h1{max-width:20ch}
.intro-grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--spacing-xl);align-items:center}.intro-grid .intro-text{display:grid;gap:var(--spacing-md)}.intro-figure{margin:0;display:grid;gap:var(--spacing-md);justify-items:center}.intro-figure .illu-lg{width:auto;max-width:200px;height:auto;aspect-ratio:auto}
.illu-lg{width:112px;height:112px}.illu-xl{width:min(100%,320px);height:auto;aspect-ratio:auto;max-height:320px}.illu-wide{width:100%;max-width:40rem;height:auto}
.prose-wrap{display:grid;gap:var(--spacing-md)}.prose-movement+.prose-movement{padding-top:0}.prose h2,.prose h3,.prose h4{margin-top:var(--spacing-lg)}.prose>h2:first-child,.prose>h3:first-child{margin-top:0}.prose h2+p,.prose h3+p,.prose h4+p{margin-top:var(--spacing-sm)}.prose h3{font-family:var(--title-font-family);font-size:var(--title);line-height:1.25}.prose h4{font-size:var(--lead)}.prose ul{list-style:disc;padding-left:1.2em}.prose ol{list-style:decimal;padding-left:1.4em}.prose table{width:100%;border-collapse:collapse}.prose td,.prose th{text-align:left;vertical-align:top;padding:10px 12px 10px 0;border-bottom:1px solid var(--lysgraa)}.prose .illu{margin-bottom:var(--spacing-md)}.prose .photo{margin-block:var(--spacing-md)}
.ctas{padding-top:0}.figure{padding-bottom:0}.figure-wrap{margin:0;display:flex}.figure-wrap .illu-xl{max-height:240px}
.help-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}.help-grid-4{grid-template-columns:repeat(4,minmax(0,1fr))}.help-title{grid-column:1/-1;margin:0}.help-col .prose{max-width:none}.help-col .illu-lg{width:100%;max-width:200px;height:auto;aspect-ratio:auto}.help-col .btn-inline{padding-inline:0}
.split-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--spacing-xl);align-items:center}.split.media-first .split-media{order:-1}.split-media{margin:0;display:grid;gap:var(--spacing-md);justify-items:start}.split-text{display:grid;gap:var(--spacing-md)}.split-text .prose+.prose{margin-top:0}.split-text h2{margin:0}
.card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-lg)}.card-tile .photo{margin-bottom:8px}.card-tile .prose{max-width:none}.card-tile .prose h3,.card-tile .prose h4{margin-top:0;font-size:var(--lead)}
.meta{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--koksgraa);font-size:var(--label);font-family:var(--title-font-family);letter-spacing:.01em}.card__date{color:var(--moerkgraa)}
.cards-lead{margin:calc(-1*var(--spacing-md)) 0 var(--spacing-lg)}.cards-note{margin-top:var(--spacing-lg)}.popular .cta-row{margin-top:var(--spacing-lg)}.pop-tile .prose{max-width:none}
.faq-grid{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:var(--spacing-xl);align-items:start}.faq-grid .section-title{margin:0;position:sticky;top:var(--spacing-lg)}.faq-body{display:grid;gap:var(--spacing-md)}
.faq-movement .faq details{border-top-color:var(--frost)}.faq-movement .faq details:last-of-type{border-bottom-color:var(--frost)}.faq-q{font:inherit;color:inherit;margin:0;flex:1 1 auto;letter-spacing:inherit}
.answer-wide{max-width:none}.answer-wide .prose{max-width:68ch}.answer .prose+.prose,.answer .cols+.prose,.answer .prose+.cols,.answer .block+.block{margin-top:var(--spacing-lg)}.answer h4,.answer .prose h3{font-family:var(--title-font-family);font-size:var(--title-sm,25px);line-height:1.25;color:var(--fjell);margin-top:var(--spacing-lg)}.answer h5{font-family:var(--title-font-family);font-size:var(--lead);line-height:1.3;color:var(--fjell);margin-top:var(--spacing-lg)}.answer h6{font-family:var(--title-font-family);font-size:var(--body);line-height:1.4;color:var(--fjell);margin-top:var(--spacing-md)}.answer h4+p,.answer h5+p,.answer h6+p{margin-top:var(--spacing-sm)}
.cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--spacing-lg) var(--spacing-xl);margin-top:var(--spacing-lg)}.cols[data-items="1"]{grid-template-columns:1fr}.col{display:grid;gap:var(--spacing-md);align-content:start}.answer-figure{margin:var(--spacing-lg) 0}
.faq-foot-feedback{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:var(--spacing-lg);padding-top:var(--spacing-md);border-top:1px solid var(--frost)}.feedback-q{font-family:var(--title-font-family);color:var(--fjell);margin-right:4px}.thumb{gap:6px}.thumb svg{width:20px;height:20px}.faq-more{margin-top:var(--spacing-md)}.faq-more a{font-family:var(--title-font-family)}
.acc-list details summary{font-size:var(--lead)}.acc-list .answer .block+.block{margin-top:var(--spacing-md)}
.disclose{margin-top:var(--spacing-md)}.disclose>summary{list-style:none;width:max-content;max-width:100%;cursor:pointer}.disclose>summary::-webkit-details-marker{display:none}.disclose[open]>summary svg{transform:rotate(180deg)}.disclose-body{display:grid;gap:var(--spacing-lg);margin-top:var(--spacing-lg)}.disclose-body .help-grid{gap:var(--spacing-lg)}
.block{display:grid;gap:var(--spacing-md)}.block .cta-row{margin-top:0}.block.prose-movement{display:block}.block.feedback-row{display:flex;flex-wrap:wrap;align-items:center;gap:16px 32px}
.step-list{list-style:none;counter-reset:step;padding:0;margin-top:var(--spacing-md);display:grid;gap:0}
.step{counter-increment:step;display:grid;grid-template-columns:36px minmax(0,1fr);grid-template-areas:"n title" ". body";gap:var(--spacing-sm) var(--spacing-md);align-items:start;padding:var(--spacing-md) 0;border-top:1px solid var(--frost)}.step:last-child{border-bottom:1px solid var(--frost)}
.step::before{content:counter(step);grid-area:n;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--vann);color:#fff;font-family:var(--title-font-family);font-size:var(--body);font-variant-numeric:tabular-nums}
.step-title{grid-area:title;padding-top:6px}.step-title a{color:var(--fjell);text-decoration:none}.step-title a:hover{text-decoration:underline}.step-body{grid-area:body;display:grid;gap:var(--spacing-md)}.step-body:empty{display:none}
.usp-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--spacing-lg) var(--spacing-xl)}.usp-item{display:grid;grid-template-columns:72px minmax(0,1fr);gap:var(--spacing-md);align-items:start;padding-top:var(--spacing-md);border-top:1px solid var(--lysgraa)}.usp-item .prose h3{margin:0}.usp-item .prose h3+p{margin-top:var(--spacing-xs)}
.table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}.data-table{width:100%;border-collapse:collapse;font-size:var(--body);line-height:1.4}.data-table td,.data-table th{text-align:left;vertical-align:top;padding:12px 16px 12px 0;border-bottom:1px solid var(--lysgraa)}.data-table thead td,.data-table th{font-family:var(--title-font-family);font-weight:400;color:var(--koksgraa);font-size:var(--label)}.data-table caption{text-align:left;font-family:var(--title-font-family);margin-bottom:var(--spacing-sm)}.data-table p{margin:0}
.conv{display:grid;gap:var(--spacing-md);max-width:36rem;padding:var(--spacing-lg);background:var(--frost-30);border-radius:var(--radius)}.conv-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--spacing-md)}.conv-field{display:grid;gap:4px}.conv select,.conv-input,.conv-out{min-height:44px;padding:10px 14px;border:1px solid var(--lysgraa);border-radius:var(--radius-sm);font:var(--body)/1.2 var(--body-font-family);color:var(--color-fg);background:#fff;width:100%}.conv-out{display:flex;align-items:center}.conv select:disabled,.conv-input:disabled{background:#fff;color:var(--koksgraa);border-style:dashed}.conv-rate{font-family:var(--title-font-family)}.conv-list{margin-top:var(--spacing-lg)}
.calculator{padding:0}.calculator-shell{padding-block:var(--section-padding)}.calc-shell{display:grid;gap:var(--spacing-md);max-width:40rem;padding:var(--spacing-lg);background:var(--frost-30);border-radius:var(--radius)}.calc-shell input,.calc-shell select{min-height:44px;padding:10px 14px;border:1px dashed var(--lysgraa);border-radius:var(--radius-sm);font:var(--body)/1.2 var(--body-font-family);background:#fff;color:var(--koksgraa);max-width:12rem}.calc-shell h6,.calc-shell h5{font-family:var(--title-font-family);font-size:var(--body);color:var(--fjell);margin:0}.calc-shell .illu{width:160px;height:auto}.calc-shell a{display:inline-flex;align-items:center;min-height:44px;padding:10px 24px;border-radius:var(--radius-pill);background:var(--vann);color:#fff;text-decoration:none}
.promo-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-lg)}.promo-grid .promo{padding:0 var(--spacing-xl) 0 0;border-top:0}.promo-grid .promo+.promo{border-left:1px solid var(--lysgraa);padding:0 0 0 var(--spacing-xl)}.cobrand-photo{max-width:320px}.cta-band-wide{max-width:none}.cta-band-wide .help-grid{gap:var(--spacing-lg)}
.ask{display:grid;gap:6px;margin-top:var(--spacing-sm);max-width:36rem}.ask-row{display:flex;gap:8px;flex-wrap:wrap}.ask-input{flex:1 1 14rem;min-height:44px;padding:10px 16px;border:1px solid var(--lysgraa);border-radius:var(--radius-sm);font:var(--body)/1.35 var(--body-font-family);color:var(--color-fg);background:#fff;resize:none}.ask-input:disabled{color:var(--moerkgraa);background:#fff;border-style:dashed}.ask .btn:disabled{cursor:not-allowed;background:#fff;color:var(--moerkgraa);border-color:var(--lysgraa);opacity:1}
.callout-rich{display:grid;grid-template-columns:28px minmax(0,1fr);align-items:start;gap:var(--spacing-md);padding:var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) var(--spacing-md);max-width:calc(68ch + 84px)}.callout-body{max-width:68ch}.callout-body h2{font-family:var(--title-font-family);font-size:var(--title);line-height:1.25;margin-top:0}.callout-body h3,.callout-body h4{font-family:var(--title-font-family);font-size:var(--lead);line-height:1.3;margin-top:var(--spacing-md)}.callout-body h2+p,.callout-body h3+p,.callout-body h4+p{margin-top:var(--spacing-sm)}.callout-body .cta-row{margin-top:var(--spacing-md)}
.img-link{display:inline-block}
@media (max-width:1023px){.intro-grid{grid-template-columns:minmax(0,1fr) 40%}.promo-grid{grid-template-columns:1fr}.promo-grid .promo{padding:0}.promo-grid .promo+.promo{border-left:0;border-top:1px solid var(--lysgraa);padding:var(--spacing-lg) 0 0}.card-grid{grid-template-columns:1fr 1fr}.help-grid-3,.help-grid-4{grid-template-columns:1fr 1fr}.split-grid{grid-template-columns:1fr;gap:var(--spacing-lg)}.split.media-first .split-media{order:0}.split-media .photo{max-width:36rem}.faq-grid{grid-template-columns:1fr;gap:var(--spacing-md)}.faq-grid .section-title{position:static}.usp-list{grid-template-columns:1fr}}
@media (max-width:640px){.intro-grid{grid-template-columns:1fr}.intro-figure{justify-content:flex-start}.intro-figure .illu-xl{max-height:160px}.card-grid,.help-grid-3,.help-grid-4{grid-template-columns:1fr}.cols{grid-template-columns:1fr}.conv-row{grid-template-columns:1fr}.step{grid-template-columns:32px minmax(0,1fr)}.step::before{width:32px;height:32px}.callout-rich{grid-template-columns:24px 1fr;padding:var(--spacing-md)}.callout-rich svg{width:24px;height:24px}.faq summary{font-size:var(--lead)}}
`;

/* ───────────────────────── the category-hub module ───────────────────────── */
const ARCH='nb-bank-privat-lan-html';
const LAN_LABELS={intro:{intent:'name the category'},doors:{intent:'route to loan products'},cobranding:{intent:'LO membership benefits'},columns:{intent:'adviser contact; calculator'},banner:{intent:'invite: switch bank'},cards:{intent:'popular loan products'},tip:{intent:'Altinn consent notice'}};
const HUB_LABELS={intro:{intent:'name the category'}};
export function render({doc,pj,slug=ARCH,archetype=ARCH}){
  const main=doc.querySelector('main');
  const isArch=slug===archetype;
  const r=renderMain(main,{slug,archetype,labels:isArch?LAN_LABELS:HUB_LABELS});
  const css=HUB_CSS+(isArch?'':SIBLING_CSS);
  const provenance=isArch
    ? { shapeBrief:'stardust/prototypes/nb-bank-privat-lan-html-shape.md', dominantDimension:'composition/catalogue-of-doors', conceptSeed:'surface 0b575c01 (dealt 4,7,5; 4 built)', unsourcedContent:[], signatureElements:['bankchoice_bg.svg in the router band','one-corner-pair photo mask 48px on door and help photos','material icons + spot illustrations flat on paper'], improvementsApplied:['#1 compact router','#2 calm two-tier header','#3 1.25 scale','#4 one card language (doors as tinted papers, tiles without chrome)','#6 door photos as <img> at card scale instead of CSS background thumbs','#7 movements on paper, 2 dividers dropped'] }
    : { shapeBrief:'stardust/prototypes/nb-bank-privat-lan-html-shape.md', familyRenderer:'category-hub (component walker over the captured <main>)', componentsMapped:r.used, richTextFallbacks:r.fallbacks, unsourcedContent:[], canonDeviations:[] };
  return { template:'landing', title:pj.title, description:pj.metaDescription, main:r.html, css, provenance };
}
