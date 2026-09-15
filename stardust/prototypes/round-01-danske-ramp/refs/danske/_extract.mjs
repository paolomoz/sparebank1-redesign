import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = '/Users/paolo/stardust/2026-08/sparebank1-redesign/stardust/prototypes/round-01-danske-ramp/refs/danske/';
const URL = 'https://danskebank.dk/privat';

const measureFn = () => {
  const R = (n) => Math.round(n * 100) / 100;
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: R(r.left), y: R(r.top + scrollY), w: R(r.width), h: R(r.height) }; };
  const cs = (el, props) => { if (!el) return null; const c = getComputedStyle(el); const o = {}; for (const p of props) o[p] = c.getPropertyValue(p); return o; };
  const sel = (el) => { if (!el) return null; let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; if (typeof el.className === 'string' && el.className.trim()) s += '.' + el.className.trim().split(/\s+/).join('.'); return s; };
  const txt = (el) => (el?.innerText || '').trim().replace(/\s+/g, ' ');
  const BOX = ['display','position','top','width','max-width','height','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','background-color','background-image','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-color','border-style','border-top-left-radius','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius','box-shadow','gap','row-gap','column-gap','grid-template-columns','grid-template-rows','grid-column','grid-row','flex-direction','flex-wrap','justify-content','align-items','z-index','overflow','transform','transition','opacity','color','font-size','font-weight','line-height','text-decoration-line','text-transform','letter-spacing','aspect-ratio','object-fit'];
  const vis = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const info = (el, props = BOX) => el ? { selector: sel(el), rect: rect(el), style: cs(el, props) } : null;

  // ---------- HEADER ----------
  const header = document.querySelector('header.nav');
  const H = { selector: sel(header), rect: rect(header), style: cs(header, BOX) };
  H.menus = info(header.querySelector('.menus'));
  H.settingsBar = info(header.querySelector('.settings-bar'));
  H.settingsBarInner = info(header.querySelector('.settings-bar .section-inner'));
  H.settingsItems = [...header.querySelectorAll('.settings-menu > li')].map(li => ({ text: txt(li), active: li.classList.contains('is-active'), rect: rect(li), a: info(li.querySelector('a'), BOX) }));
  H.settingsDropdown = info(header.querySelector('#sites'));
  H.settingsDropdownText = txt(header.querySelector('#sites'));
  H.mainBar = info(header.querySelector('.menu-main-bar'));
  H.mainBarInner = info(header.querySelector('.menu-main-bar .section-inner'));
  H.mainBarBox = info(header.querySelector('.main-bar'));
  H.primaryNav = info(header.querySelector('.primary-nav'));
  const logo = header.querySelector('a.logo');
  H.logo = info(logo);
  H.logoInner = info(logo?.querySelector('.wrapper, img, svg'));
  H.logoChildren = [...(logo?.querySelectorAll('*') || [])].filter(vis).map(e => ({ selector: sel(e), rect: rect(e) }));
  H.mainMenu = info(header.querySelector('.main-menu'));
  H.mainMenuList = info(header.querySelector('.main-menu__list'));
  H.navItems = [...header.querySelectorAll('.main-menu__list > li')].map(li => { const a = li.querySelector('a, button'); return { text: txt(li), rect: rect(li), linkRect: rect(a), linkStyle: cs(a, ['font-size','font-weight','line-height','padding-left','padding-right','padding-top','padding-bottom','margin-left','margin-right','color','text-transform','letter-spacing','border-bottom-width']) , liStyle: cs(li, ['margin-left','margin-right','padding-left','padding-right']) }; });
  H.navGaps = H.navItems.slice(1).map((it, i) => R(it.rect.x - (H.navItems[i].rect.x + H.navItems[i].rect.w)));
  H.tools = info(header.querySelector('.tools'));
  H.toolsChildren = [...(header.querySelector('.tools')?.children || [])].map(c => ({ selector: sel(c), rect: rect(c), text: txt(c), style: cs(c, ['margin-left','margin-right','padding-left','padding-right']) }));
  H.language = { ...info(header.querySelector('.language')), items: [...header.querySelectorAll('.language li')].map(li => ({ text: txt(li), rect: rect(li) })) };
  H.search = info(header.querySelector('.search-site'));
  H.searchButton = { ...info(header.querySelector('.toggle-search')), text: txt(header.querySelector('.toggle-search')), aria: header.querySelector('.toggle-search')?.getAttribute('aria-label'), svg: rect(header.querySelector('.toggle-search svg, .toggle-search i, .toggle-search span')) };
  H.login = info(header.querySelector('.login'));
  H.loginDropdown = info(header.querySelector('.login-dropdown'));
  const loginBtns = [...header.querySelectorAll('.login button, .login a')].filter(vis);
  H.loginButtons = loginBtns.map(b => ({ ...info(b), text: txt(b), aria: b.getAttribute('aria-label') }));
  H.loginDropdownChildren = [...(header.querySelector('.login-dropdown')?.querySelectorAll('*') || [])].filter(vis).slice(0, 12).map(e => ({ selector: sel(e), rect: rect(e), text: txt(e).slice(0, 40), style: cs(e, ['border-top-left-radius','background-color','border-top-width','border-top-color','padding-left','padding-right','padding-top','padding-bottom','font-size','font-weight','color']) }));
  H.mobileToggleWrapper = info(header.querySelector('.mobile-menu-toggle-wrapper'));
  const mt = header.querySelector('.menu-mobile-toggle');
  H.mobileToggle = { ...info(mt), text: txt(mt), aria: mt?.getAttribute('aria-label'), title: info(mt?.querySelector('.title'), ['font-size','font-weight','text-transform','color','margin-left','margin-right']), icon: info(mt?.querySelector('.icon')), iconChildren: [...(mt?.querySelectorAll('.icon *') || [])].map(e => ({ selector: sel(e), rect: rect(e), style: cs(e, ['background-color','height','width','border-top-left-radius','margin-top','margin-bottom']) }))  };
  H.cover = info(header.querySelector('.cover'), ['display','position','background-color','opacity','z-index']);
  H.visibleHeaderChildrenAll = [...header.querySelectorAll('*')].filter(vis).filter(e => !e.closest('.cover')).map(e => ({ selector: sel(e), rect: rect(e), text: e.children.length ? '' : txt(e).slice(0, 40) }));

  // ---------- FOOTER ----------
  const footerCta = document.querySelector('.footer-cta');
  const F = {};
  F.footerCta = { ...info(footerCta), inner: info(footerCta?.querySelector('.footer-inner')), heading: { ...info(footerCta?.querySelector('h2')), text: txt(footerCta?.querySelector('h2')) }, buttons: [...(footerCta?.querySelectorAll('.button-group a, .button-group button') || [])].map(b => ({ ...info(b), text: txt(b) })), buttonGroup: info(footerCta?.querySelector('.button-group')) };
  const footer = document.querySelector('footer.footer');
  F.footer = info(footer);
  F.footerInners = [...footer.querySelectorAll(':scope > .footer-inner')].map(fi => info(fi));
  F.outerGrid = info(footer.querySelector('.outer-grid-container'));
  F.outerGridItems = [...footer.querySelector('.outer-grid-container').children].map(c => info(c));
  F.innerGrid = info(footer.querySelector('.inner-grid-container'));
  F.logo = { ...info(footer.querySelector('a.logo')), img: info(footer.querySelector('a.logo img, a.logo svg')) };
  F.columns = [...footer.querySelectorAll('.inner-grid-container > .grid-item')].filter(gi => gi.querySelector('details, summary, h2, h3, h4')).map(gi => {
    const d = gi.querySelector('details'); const s = gi.querySelector('summary, h2, h3, h4');
    return { rect: rect(gi), style: cs(gi, ['padding-left','padding-right','margin-left','margin-right']), details: { open: d?.open, style: cs(d, ['border-top-width','border-bottom-width','border-top-color','padding-top','padding-bottom']) }, heading: { text: txt(s), rect: rect(s), style: cs(s, ['font-size','font-weight','line-height','color','text-transform','margin-bottom','padding-bottom','list-style-type']) , marker: s ? getComputedStyle(s, '::after').getPropertyValue('content') + ' | ' + getComputedStyle(s, '::before').getPropertyValue('content') : null }, list: { ...info(gi.querySelector('ul'), ['margin-top','padding-top','margin-bottom']), count: gi.querySelectorAll('li').length, items: [...gi.querySelectorAll('li')].map(li => ({ text: txt(li), rect: rect(li), style: cs(li, ['margin-bottom','padding-bottom','padding-top','font-size','line-height']) })) } };
  });
  F.colGaps = F.columns.slice(1).map((c, i) => R(c.rect.x - (F.columns[i].rect.x + F.columns[i].rect.w)));
  const tc = footer.querySelector('.text-content');
  F.textContent = { ...info(tc), richtext: info(tc?.querySelector('.richtext')), children: [...(tc?.querialSelectorAll?.('.richtext > *') || tc?.querySelectorAll('.richtext > *') || [])].map(e => ({ selector: sel(e), rect: rect(e), text: txt(e).slice(0, 200), style: cs(e, ['font-size','line-height','color','margin-top','margin-bottom','display','gap','flex-wrap']) })) };
  F.allLinksInTextContent = [...(tc?.querySelectorAll('a') || [])].map(a => ({ text: txt(a), href: a.getAttribute('href'), rect: rect(a), hasImg: !!a.querySelector('img, svg'), aria: a.getAttribute('aria-label') }));
  F.imagesInFooter = [...footer.querySelectorAll('img, svg')].map(i => ({ selector: sel(i), parentSel: sel(i.parentElement), rect: rect(i), alt: i.getAttribute('alt') || i.getAttribute('aria-label'), src: (i.getAttribute('src') || '').slice(-80) }));
  F.hrs = [...footer.querySelectorAll('hr')].map(h => info(h, ['border-top-width','border-top-color','margin-top','margin-bottom','background-color','height']));
  F.separatorsCandidates = [...footer.querySelectorAll('*')].filter(e => { const c = getComputedStyle(e); return vis(e) && (parseFloat(c.borderTopWidth) > 0 || parseFloat(c.borderBottomWidth) > 0); }).slice(0, 30).map(e => ({ selector: sel(e), rect: rect(e), style: cs(e, ['border-top-width','border-top-color','border-bottom-width','border-bottom-color']) }));
  F.desktopTools = { ...info(document.querySelector('aside.desktop-tools')), items: [...document.querySelectorAll('aside.desktop-tools li')].map(li => ({ text: txt(li), aria: li.querySelector('a,button')?.getAttribute('aria-label'), rect: rect(li), style: cs(li.querySelector('a,button'), ['background-color','border-top-left-radius','width','height']) })) };

  // ---------- SECTIONS ----------
  const secs = [...document.querySelectorAll('header.nav, main > *, .footer-cta, footer.footer')];
  const S = secs.map((s, i) => {
    const inner = s.querySelector(':scope > .section-inner, :scope > .footer-inner, :scope > .menus');
    const rows = [...s.querySelectorAll(':scope > .section-inner > .row')];
    const h = s.querySelector('h1, h2, h3');
    return { index: i, selector: sel(s), rect: rect(s), style: cs(s, ['background-color','background-image','padding-top','padding-bottom','margin-top','margin-bottom']), inner: inner ? { selector: sel(inner), rect: rect(inner), style: cs(inner, ['max-width','width','padding-top','padding-bottom','padding-left','padding-right','margin-left','margin-right','background-color']) } : null, rows: rows.map(r => ({ selector: sel(r), rect: rect(r), style: cs(r, ['max-width','width','margin-left','margin-right','padding-left','padding-right','display','flex-wrap','gap']) , childCount: r.children.length })), heading: h ? { tag: h.tagName, text: txt(h).slice(0, 120), style: cs(h, ['font-size','line-height','font-weight','margin-bottom']) } : null, cardCount: s.querySelectorAll('.card').length, text: txt(s).slice(0, 160) };
  });
  const gapsBetween = S.slice(1).map((s, i) => ({ from: S[i].selector.slice(0, 60), to: s.selector.slice(0, 60), gap: R(s.rect.y - (S[i].rect.y + S[i].rect.h)) }));

  // ---------- GRIDS ----------
  const G = [...document.querySelectorAll('main .section-inner > .row')].filter(r => r.querySelector('.card')).map((row, gi) => {
    const cols = [...row.children];
    const items = cols.map(c => { const card = c.querySelector('.card'); return { colSelector: sel(c), colRect: rect(c), colStyle: cs(c, ['width','flex','flex-basis','padding-left','padding-right','padding-top','padding-bottom','margin-bottom','grid-column','grid-row','display']), card: card ? { selector: sel(card), rect: rect(card), title: txt(card.querySelector('h2, h3, h4')).slice(0, 80), hasImage: !!card.querySelector('.card-image, img, picture'), imageClass: sel(card.querySelector('.card-image')), link: txt(card.querySelector('a.arrow-link, a.button, a')).slice(0, 60), bg: getComputedStyle(card.querySelector('.card-back') || card).backgroundColor } : null, visible: vis(c) }; });
    // compute column gaps (horizontal, same row) and row gaps
    const visItems = items.filter(i => i.visible);
    const xs = [...new Set(visItems.map(i => Math.round(i.colRect.x)))].sort((a, b) => a - b);
    const ys = [...new Set(visItems.map(i => Math.round(i.colRect.y)))].sort((a, b) => a - b);
    const cardRects = visItems.filter(i => i.card).map(i => i.card.rect);
    const hGaps = []; const vGaps = [];
    for (const a of cardRects) for (const b of cardRects) { if (Math.abs(a.y - b.y) < 2 && b.x > a.x) { const g = R(b.x - (a.x + a.w)); if (g >= 0 && g < 200) hGaps.push(g); } if (Math.abs(a.x - b.x) < 2 && b.y > a.y) { const g = R(b.y - (a.y + a.h)); if (g >= 0 && g < 200) vGaps.push(g); } }
    const sectionEl = row.closest('section, article'); const inner = row.closest('.section-inner');
    return { index: gi, section: sel(sectionEl), sectionRect: rect(sectionEl), sectionStyle: cs(sectionEl, ['background-color','padding-top','padding-bottom']), innerSelector: sel(inner), innerRect: rect(inner), innerStyle: cs(inner, ['max-width','padding-top','padding-bottom','padding-left','padding-right','margin-left','margin-right']), rowSelector: sel(row), rowRect: rect(row), rowStyle: cs(row, ['display','grid-template-columns','grid-template-rows','gap','row-gap','column-gap','flex-wrap','max-width','margin-left','margin-right','padding-left','padding-right']), itemCount: cols.length, visibleItemCount: visItems.length, columnsX: xs, rowsY: ys, columnCount: xs.length, rowCount: ys.length, cardHorizontalGaps: [...new Set(hGaps)], cardVerticalGaps: [...new Set(vGaps)], minCardGapH: hGaps.length ? Math.min(...hGaps) : null, minCardGapV: vGaps.length ? Math.min(...vGaps) : null, distinctCardHeights: [...new Set(cardRects.map(r => Math.round(r.h)))], distinctCardWidths: [...new Set(cardRects.map(r => Math.round(r.w)))], items };
  });

  // ---------- CARDS (types) ----------
  const cards = [...document.querySelectorAll('.card')].filter(vis);
  const cardTypeKey = (c) => { const img = c.querySelector('.card-image'); const cls = [...c.classList].filter(x => x !== 'card').sort().join(' '); const imgPos = img ? [...img.classList].filter(x => x !== 'card-image').sort().join(' ') : 'noimg'; const hasLink = c.querySelector('a.arrow-link') ? 'arrow' : c.querySelector('a.button, .button') ? 'button' : c.querySelector('a') ? 'a' : 'nolink'; const wholeLink = c.closest('a') || c.parentElement?.tagName === 'A' ? 'wrapA' : (c.querySelector(':scope > a') ? 'innerA' : ''); const hasIcon = c.querySelector('.card-icon, svg, .icon') ? 'icon' : ''; const hasBrow = c.querySelector('.eyebrow, .label, .tag, .category, small') ? 'eyebrow' : ''; return [cls || '(plain)', imgPos, hasLink, wholeLink, hasIcon, hasBrow, c.querySelector('h2') ? 'h2' : c.querySelector('h3') ? 'h3' : c.querySelector('h4') ? 'h4' : 'noH'].join(' | '); };
  const groups = {};
  cards.forEach(c => { const k = cardTypeKey(c); (groups[k] ||= []).push(c); });
  const CT = Object.entries(groups).map(([key, els]) => {
    const c = els[0];
    const back = c.querySelector('.card-back'); const content = c.querySelector('.card-content'); const img = c.querySelector('.card-image'); const imgEl = c.querySelector('img, picture img'); const title = c.querySelector('h2, h3, h4'); const p = c.querySelector('p'); const link = c.querySelector('a.arrow-link, a.button, a'); const eyebrow = c.querySelector('.eyebrow, .label, .tag, .category, small, .card-label');
    const parentA = c.closest('a');
    const cr = rect(c); const cont = rect(content); const ir = rect(img); const tr = rect(title); const pr = rect(p); const lr = rect(link); const br = rect(back);
    const children = content ? [...content.querySelectorAll('*')].filter(vis).slice(0, 25).map(e => ({ selector: sel(e), rect: rect(e), text: e.children.length ? '' : txt(e).slice(0, 50) })) : [];
    // vertical stack of direct content blocks
    const stack = [];
    const push = (name, r) => { if (r) stack.push({ name, top: r.y, bottom: R(r.y + r.h), h: r.h }); };
    push('card', cr); push('card-back', br); push('image', ir); push('content', cont); push('eyebrow', rect(eyebrow)); push('title', tr); push('text', pr); push('link', lr);
    stack.sort((a, b) => a.top - b.top);
    const spacing = {};
    if (ir && tr) spacing.imageBottom_to_title = R(tr.y - (ir.y + ir.h));
    if (tr && pr) spacing.title_to_text = R(pr.y - (tr.y + tr.h));
    if (pr && lr) spacing.text_to_link = R(lr.y - (pr.y + pr.h));
    if (tr && lr && !pr) spacing.title_to_link = R(lr.y - (tr.y + tr.h));
    if (eyebrow && tr) spacing.eyebrow_to_title = R(tr.y - (rect(eyebrow).y + rect(eyebrow).h));
    if (cont && lr) spacing.link_bottom_to_content_bottom = R((cont.y + cont.h) - (lr.y + lr.h));
    if (cr && cont) spacing.card_to_content_inset = { top: R(cont.y - cr.y), left: R(cont.x - cr.x), right: R((cr.x + cr.w) - (cont.x + cont.w)), bottom: R((cr.y + cr.h) - (cont.y + cont.h)) };
    if (cr && br) spacing.card_to_back_inset = { top: R(br.y - cr.y), left: R(br.x - cr.x), right: R((cr.x + cr.w) - (br.x + br.w)), bottom: R((cr.y + cr.h) - (br.y + br.h)) };
    if (cr && ir) spacing.card_to_image_inset = { top: R(ir.y - cr.y), left: R(ir.x - cr.x), right: R((cr.x + cr.w) - (ir.x + ir.w)), bottom: R((cr.y + cr.h) - (ir.y + ir.h)) };
    const arrowPseudo = link ? { after: cs(link, []) && { content: getComputedStyle(link, '::after').content, width: getComputedStyle(link, '::after').width, height: getComputedStyle(link, '::after').height, bg: getComputedStyle(link, '::after').backgroundImage.slice(0, 60), display: getComputedStyle(link, '::after').display, marginLeft: getComputedStyle(link, '::after').marginLeft }, before: { content: getComputedStyle(link, '::before').content, width: getComputedStyle(link, '::before').width, height: getComputedStyle(link, '::before').height, bg: getComputedStyle(link, '::before').backgroundImage.slice(0, 60), display: getComputedStyle(link, '::before').display } } : null;
    const linkSvg = link?.querySelector('svg, i, span.icon, img');
    return { typeKey: key, count: els.length, sampleTitle: txt(title).slice(0, 80), sampleLocations: els.slice(0, 6).map(e => ({ y: rect(e).y, section: sel(e.closest('section, article')).slice(0, 60) })), wrappedInAnchor: !!parentA, parentAnchor: parentA ? { selector: sel(parentA), rect: rect(parentA), style: cs(parentA, ['display','text-decoration-line','color','border-top-left-radius','overflow']) } : null, card: info(c), cardPseudoAfter: { content: getComputedStyle(c, '::after').content, boxShadow: getComputedStyle(c, '::after').boxShadow, bg: getComputedStyle(c, '::after').backgroundColor, radius: getComputedStyle(c, '::after').borderTopLeftRadius, opacity: getComputedStyle(c, '::after').opacity, inset: [getComputedStyle(c, '::after').top, getComputedStyle(c, '::after').right, getComputedStyle(c, '::after').bottom, getComputedStyle(c, '::after').left].join(' ') }, cardPseudoBefore: { content: getComputedStyle(c, '::before').content, boxShadow: getComputedStyle(c, '::before').boxShadow, bg: getComputedStyle(c, '::before').backgroundColor, radius: getComputedStyle(c, '::before').borderTopLeftRadius }, back: info(back), backPseudoAfter: back ? { content: getComputedStyle(back, '::after').content, boxShadow: getComputedStyle(back, '::after').boxShadow, bg: getComputedStyle(back, '::after').backgroundColor, radius: getComputedStyle(back, '::after').borderTopLeftRadius, opacity: getComputedStyle(back, '::after').opacity } : null, content: info(content), image: info(img), imageEl: imgEl ? { ...info(imgEl), natural: { w: imgEl.naturalWidth, h: imgEl.naturalHeight }, ratio: imgEl.getBoundingClientRect().height ? R(imgEl.getBoundingClientRect().width / imgEl.getBoundingClientRect().height) : null, src: (imgEl.currentSrc || imgEl.src || '').slice(-90) } : null, imageBoxRatio: ir && ir.h ? R(ir.w / ir.h) : null, eyebrow: eyebrow ? { ...info(eyebrow), text: txt(eyebrow) } : null, title: title ? { ...info(title, ['font-size','line-height','font-weight','color','margin-top','margin-bottom','letter-spacing','text-transform']), text: txt(title).slice(0, 100) } : null, text: p ? { ...info(p, ['font-size','line-height','font-weight','color','margin-top','margin-bottom']), text: txt(p).slice(0, 100) } : null, link: link ? { ...info(link, ['display','font-size','line-height','font-weight','color','text-decoration-line','padding-top','padding-right','padding-bottom','padding-left','margin-top','background-color','border-top-left-radius','border-top-width','border-top-color','position','bottom','left']), text: txt(link).slice(0, 60), pseudo: arrowPseudo, svg: linkSvg ? { selector: sel(linkSvg), rect: rect(linkSvg) } : null } : null, spacing, stack, contentChildren: children };
  });

  // ---------- RADIUS CENSUS ----------
  const radii = {};
  [...document.querySelectorAll('body *')].forEach(e => {
    if (!vis(e)) return; if (e.closest('.cookie-consent-banner-modal, .cover')) return;
    const c = getComputedStyle(e);
    const r = [c.borderTopLeftRadius, c.borderTopRightRadius, c.borderBottomRightRadius, c.borderBottomLeftRadius];
    if (r.every(x => x === '0px')) return;
    const key = r.every(x => x === r[0]) ? r[0] : r.join(' ');
    const cat = e.matches('button, .button, a.button, [class*="button"]') ? 'button' : e.matches('img, picture, .card-image, [class*="image"], [class*="media"]') ? 'image' : e.matches('.card, .card-back, [class*="card"]') ? 'card' : e.matches('input, select, textarea, [class*="input"], [class*="field"], [class*="search"]') ? 'input' : e.matches('[class*="tag"], [class*="label"], [class*="badge"], [class*="pill"], [class*="chip"]') ? 'tag' : e.matches('a') ? 'link' : 'other';
    const rr = rect(e);
    (radii[key] ||= { radius: key, count: 0, categories: {}, samples: [] });
    radii[key].count++;
    radii[key].categories[cat] = (radii[key].categories[cat] || 0) + 1;
    if (radii[key].samples.length < 8) radii[key].samples.push({ selector: sel(e).slice(0, 90), size: `${Math.round(rr.w)}x${Math.round(rr.h)}`, cat, area: (e.closest('header') ? 'header' : e.closest('footer, .footer-cta') ? 'footer' : 'main') });
  });
  const RAD = Object.values(radii).sort((a, b) => b.count - a.count);

  // ---------- BUTTONS census ----------
  const BTN = {};
  [...document.querySelectorAll('button, a.button, .button')].filter(vis).filter(e => !e.closest('.cookie-consent-banner-modal')).forEach(b => { const c = getComputedStyle(b); const key = [b.className.toString().trim().split(/\s+/).slice(0, 4).join('.'), c.borderTopLeftRadius, c.height, c.backgroundColor, c.borderTopWidth].join(' | '); (BTN[key] ||= { key, classes: b.className.toString(), count: 0, sampleText: txt(b).slice(0, 40), rect: rect(b), style: cs(b, ['height','min-height','padding-top','padding-right','padding-bottom','padding-left','border-top-left-radius','border-top-width','border-top-color','background-color','color','font-size','font-weight','line-height','text-transform']) }).count++; });

  // ---------- arrow-link census ----------
  const al = document.querySelector('a.arrow-link');
  const ARROW = al ? { ...info(al, ['display','font-size','font-weight','line-height','color','text-decoration-line','padding-left','padding-right','position']), text: txt(al), after: { content: getComputedStyle(al, '::after').content, width: getComputedStyle(al, '::after').width, height: getComputedStyle(al, '::after').height, bg: getComputedStyle(al, '::after').backgroundImage.slice(0, 80), mask: getComputedStyle(al, '::after').maskImage?.slice(0, 80), display: getComputedStyle(al, '::after').display, marginLeft: getComputedStyle(al, '::after').marginLeft, position: getComputedStyle(al, '::after').position, transform: getComputedStyle(al, '::after').transform, transition: getComputedStyle(al, '::after').transition }, before: { content: getComputedStyle(al, '::before').content, width: getComputedStyle(al, '::before').width, height: getComputedStyle(al, '::before').height, bg: getComputedStyle(al, '::before').backgroundImage.slice(0, 80), display: getComputedStyle(al, '::before').display }, children: [...al.querySelectorAll('*')].map(e => ({ selector: sel(e), rect: rect(e) })) } : null;

  const body = cs(document.body, ['font-family','font-size','line-height','color','background-color']);
  const rootVars = (() => { const out = {}; try { for (const sh of document.styleSheets) { try { for (const rule of sh.cssRules) { if (rule.selectorText === ':root' || rule.selectorText === 'html') { for (const p of rule.style) if (p.startsWith('--')) out[p] = rule.style.getPropertyValue(p).trim(); } } } catch (e) {} } } catch (e) {} return out; })();

  return { viewport: { w: innerWidth, h: innerHeight, docHeight: document.documentElement.scrollHeight, dpr: devicePixelRatio }, body, rootVarsCount: Object.keys(rootVars).length, rootVarsRadiusish: Object.fromEntries(Object.entries(rootVars).filter(([k]) => /radius|gap|space|spacing|gutter|container|width|shadow/i.test(k))), header: H, footer: F, sections: S, sectionGaps: gapsBetween, grids: G, cardTypes: CT, radiusCensus: RAD, buttons: Object.values(BTN), arrowLink: ARROW };
};

async function prep(page) {
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2500);
  try { await page.click('#button-accept-all', { timeout: 5000 }); await page.waitForTimeout(800); } catch (e) { console.log('accept click failed', e.message); }
  await page.evaluate(() => { document.querryAll; document.querySelectorAll('.cookie-consent-banner-modal, .spinner').forEach(n => n.remove()); document.documentElement.style.scrollBehavior = 'auto'; });
  // scroll through to trigger lazy loads
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
}

const result = { url: URL, capturedAt: new Date().toISOString() };
const browser = await chromium.launch();

for (const vw of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vw === 1440 ? 900 : 844 }, locale: 'da-DK', deviceScaleFactor: 1, isMobile: vw === 390, hasTouch: vw === 390, userAgent: vw === 390 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
  const page = await ctx.newPage();
  await prep(page);
  console.log(`[${vw}] url`, page.url(), 'title', await page.title());
  const m = await page.evaluate(measureFn);
  result[`v${vw}`] = m;
  console.log(`[${vw}] doc height`, m.viewport.docHeight, 'sections', m.sections.length, 'grids', m.grids.length, 'cardTypes', m.cardTypes.length, 'radii', m.radiusCensus.length);

  // sticky test
  const stickyBefore = await page.evaluate(() => { const h = document.querySelector('header.nav'); const c = getComputedStyle(h); const m = document.querySelector('header.nav .menus'); const cm = getComputedStyle(m); return { headerPos: c.position, headerTop: c.top, headerRect: h.getBoundingClientRect().toJSON(), menusPos: cm.position, menusTop: cm.top, menusRect: m.getBoundingClientRect().toJSON(), menusBg: cm.backgroundColor, menusShadow: cm.boxShadow, mainBarH: document.querySelector('.menu-main-bar').getBoundingClientRect().height, settingsBarH: document.querySelector('.settings-bar').getBoundingClientRect().height, bodyClasses: document.body.className, headerClasses: h.className, mainPaddingTop: getComputedStyle(document.querySelector('main')).paddingTop, mainMarginTop: getComputedStyle(document.querySelector('main')).marginTop }; });
  await page.evaluate(() => scrollTo(0, 800)); await page.waitForTimeout(800);
  const stickyAfter800 = await page.evaluate(() => { const h = document.querySelector('header.nav'); const c = getComputedStyle(h); const m = document.querySelector('header.nav .menus'); const cm = getComputedStyle(m); return { headerPos: c.position, headerTop: c.top, headerRect: h.getBoundingClientRect().toJSON(), menusPos: cm.position, menusTop: cm.top, menusRect: m.getBoundingClientRect().toJSON(), menusBg: cm.backgroundColor, menusShadow: cm.boxShadow, mainBarH: document.querySelector('.menu-main-bar').getBoundingClientRect().height, settingsBarH: document.querySelector('.settings-bar').getBoundingClientRect().height, settingsBarRect: document.querySelector('.settings-bar').getBoundingClientRect().toJSON(), bodyClasses: document.body.className, headerClasses: h.className, transform: cm.transform, visibleInViewport: m.getBoundingClientRect().bottom > 0 && m.getBoundingClientRect().top < innerHeight, scrollY }; });
  await page.screenshot({ path: OUT + `header-scrolled-800-${vw}.png`, clip: { x: 0, y: 0, width: vw, height: 200 } });
  // scroll up a bit to test scroll-up reveal
  await page.evaluate(() => scrollTo(0, 600)); await page.waitForTimeout(800);
  const stickyAfterUp = await page.evaluate(() => { const m = document.querySelector('header.nav .menus'); const cm = getComputedStyle(m); return { menusPos: cm.position, menusRect: m.getBoundingClientRect().toJSON(), transform: cm.transform, bodyClasses: document.body.className, headerClasses: document.querySelector('header.nav').className, scrollY }; });
  await page.screenshot({ path: OUT + `header-scrolled-up-${vw}.png`, clip: { x: 0, y: 0, width: vw, height: 200 } });
  result[`v${vw}`].sticky = { atTop: stickyBefore, scrolled800: stickyAfter800, scrolledBackTo600: stickyAfterUp };
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600);

  // screenshots
  await page.screenshot({ path: OUT + `full-${vw}.png`, fullPage: true });
  const hh = m.header.rect.h;
  await page.screenshot({ path: OUT + `header-${vw}.png`, clip: { x: 0, y: 0, width: vw, height: Math.max(hh, vw === 1440 ? 120 : 80) } });
  await page.locator('footer.footer').screenshot({ path: OUT + `footer-${vw}.png` });
  await page.locator('.footer-cta').screenshot({ path: OUT + `footer-cta-${vw}.png` });
  // grids
  const gridRows = await page.locator('main .section-inner > .row').filter({ has: page.locator('.card') }).all();
  console.log(`[${vw}] grid rows`, gridRows.length);
  let bi = 1;
  for (const gr of gridRows) { const sec = gr.locator('xpath=ancestor::*[contains(@class,"section ")][1]'); try { await sec.first().scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await sec.first().screenshot({ path: OUT + (vw === 1440 ? `bento-${bi}.png` : `bento-${bi}-390.png`) }); } catch (e) { console.log('grid shot fail', bi, e.message); } bi++; }
  // single card + hover (first card with image and link, else first card)
  const cardLoc = page.locator('.card').filter({ has: page.locator('.card-image') }).first();
  const target = (await cardLoc.count()) ? cardLoc : page.locator('.card').first();
  await target.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  const hoverProps = ['transform','box-shadow','background-color','border-top-color','border-top-width','color','text-decoration-line','opacity','translate','scale'];
  const snap = () => target.evaluate((c, props) => { const g = (el, pseudo) => { if (!el) return null; const s = getComputedStyle(el, pseudo || null); const o = {}; for (const p of props) o[p] = s.getPropertyValue(p); return o; }; const link = c.querySelector('a.arrow-link, a.button, a'); const img = c.querySelector('img'); const title = c.querySelector('h2,h3,h4'); return { card: g(c), cardAfter: g(c, '::after'), cardBefore: g(c, '::before'), back: g(c.querySelector('.card-back')), backAfter: g(c.querySelector('.card-back'), '::after'), content: g(c.querySelector('.card-content')), img: img ? { ...g(img), transform: getComputedStyle(img).transform } : null, imgWrap: g(c.querySelector('.card-image')), title: g(title), link: g(link), linkAfter: g(link, '::after'), linkBefore: g(link, '::before'), parentA: g(c.closest('a')), cursor: getComputedStyle(c).cursor, cardRect: c.getBoundingClientRect().toJSON(), transitions: { card: getComputedStyle(c).transition, back: c.querySelector('.card-back') ? getComputedStyle(c.querySelector('.card-back')).transition : null, img: img ? getComputedStyle(img).transition : null, link: link ? getComputedStyle(link).transition : null, linkAfter: link ? getComputedStyle(link, '::after').transition : null } }; }, hoverProps);
  const before = await snap();
  await target.screenshot({ path: vw === 1440 ? OUT + 'card-1.png' : OUT + 'card-1-390.png' });
  if (vw === 1440) {
    await target.hover({ position: { x: 100, y: 100 } }); await page.waitForTimeout(700);
    const after = await snap();
    await target.screenshot({ path: OUT + 'card-hover.png' });
    // hover the link inside too
    const lnk = target.locator('a').first();
    let afterLinkHover = null;
    if (await lnk.count()) { await lnk.hover(); await page.waitForTimeout(700); afterLinkHover = await snap(); await target.screenshot({ path: OUT + 'card-hover-link.png' }); }
    // also hover a text-only card
    const textCard = page.locator('.card:visible').filter({ hasNot: page.locator('.card-image') }).filter({ has: page.locator('h2, h3') }).first();
    let textCardHover = null;
    try { if (await textCard.count()) { await textCard.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); const b2 = await textCard.evaluate((c) => ({ bg: getComputedStyle(c.querySelector('.card-back')||c).backgroundColor, shadow: getComputedStyle(c.querySelector('.card-back')||c).boxShadow, transform: getComputedStyle(c).transform, afterShadow: getComputedStyle(c, '::after').boxShadow, afterOpacity: getComputedStyle(c, '::after').opacity, backAfterOpacity: getComputedStyle(c.querySelector('.card-back')||c, '::after').opacity })); await textCard.screenshot({ path: OUT + 'card-2-text.png' }); await textCard.hover(); await page.waitForTimeout(700); const a2 = await textCard.evaluate((c) => ({ bg: getComputedStyle(c.querySelector('.card-back')||c).backgroundColor, shadow: getComputedStyle(c.querySelector('.card-back')||c).boxShadow, transform: getComputedStyle(c).transform, afterShadow: getComputedStyle(c, '::after').boxShadow, afterOpacity: getComputedStyle(c, '::after').opacity, backAfterOpacity: getComputedStyle(c.querySelector('.card-back')||c, '::after').opacity })); await textCard.screenshot({ path: OUT + 'card-2-text-hover.png' }); textCardHover = { before: b2, after: a2 }; } } catch (e) { console.log('text card hover failed', e.message); }
    result.v1440.hover = { before, afterCardHover: after, afterLinkHover, textCard: textCardHover };
    // diff
    const diff = {}; for (const k of Object.keys(before)) { if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) diff[k] = { before: before[k], after: after[k] }; }
    result.v1440.hoverDiff = diff;
    const diffL = {}; if (afterLinkHover) for (const k of Object.keys(before)) { if (JSON.stringify(before[k]) !== JSON.stringify(afterLinkHover[k])) diffL[k] = { before: before[k], after: afterLinkHover[k] }; }
    result.v1440.hoverLinkDiff = diffL;
    console.log('[1440] hover diff keys', Object.keys(diff), 'link hover diff keys', Object.keys(diffL));
  }
  if (vw === 390) {
    // open mobile menu
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
    const tog = page.locator('.menu-mobile-toggle');
    if (await tog.count()) {
      await tog.click(); await page.waitForTimeout(1000);
      await page.screenshot({ path: OUT + 'header-390-menu-open.png' });
      result.v390.mobileMenuOpen = await page.evaluate(() => { const R = (n) => Math.round(n * 100) / 100; const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: R(r.left), y: R(r.top), w: R(r.width), h: R(r.height) }; }; const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }; const h = document.querySelector('header.nav'); const items = [...h.querySelectorAll('.main-menu__list > li, .main-menu li, nav li')].filter(vis).slice(0, 40).map(li => ({ text: (li.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60), rect: rect(li), fontSize: getComputedStyle(li.querySelector('a,button') || li).fontSize, borderBottom: getComputedStyle(li).borderBottomWidth + ' ' + getComputedStyle(li).borderBottomColor })); const panel = h.querySelector('.main-menu, .mobile-menu, [class*="menu-open"], .menus'); return { headerClasses: h.className, bodyClasses: document.body.className, panel: panel ? { selector: panel.className, rect: rect(panel), bg: getComputedStyle(panel).backgroundColor, position: getComputedStyle(panel).position } : null, items, toggleText: (h.querySelector('.menu-mobile-toggle')?.innerText || '').trim(), visibleTexts: [...h.querySelectorAll('a, button')].filter(vis).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean).slice(0, 60) }; });
      console.log('[390] menu open items', result.v390.mobileMenuOpen.items.length);
    }
  }
  await ctx.close();
  fs.writeFileSync(OUT + 'measurements.json', JSON.stringify(result, null, 1));
}
await browser.close();
fs.writeFileSync(OUT + 'measurements.json', JSON.stringify(result, null, 1));
console.log('written', OUT + 'measurements.json', fs.statSync(OUT + 'measurements.json').size);
