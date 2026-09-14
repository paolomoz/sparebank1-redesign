/**
 * stardust/scripts/eds/lib.mjs — shared ENCODE helpers for the sparebank1-redesign EDS conversion (stardust:rollout Phase C).
 * Input vocabulary = the MIGRATED redesign pages (stardust/migrated/<url-path>.html, generated from the canon by migrate.mjs).
 * Output = DA body-fragment HTML following David's Model: prose is default content, one block per designed repeating/bespoke
 * module, CTAs as emphasis-marked links (strong = primary Vann pill · em = secondary outline · em+strong = Skog action),
 * images stay on the public DAM origin (SVG > 40 KB → DA media PNG), internal roster links root-relative + delivery-safe.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

export const ORG = 'paolomoz';
export const REPO = 'sparebank1-redesign';
export const MEDIA_BASE = `https://content.da.live/${ORG}/${REPO}/media/`;
export const MIGRATED_DIR = 'stardust/migrated';
export const CONTENT_DIR = 'content';
export const SOURCE_ORIGIN = 'https://www.sparebank1.no';
export const LIVE_HOST = `main--${REPO}--${ORG}.aem.live`;

export const state = JSON.parse(fs.readFileSync('stardust/state.json', 'utf8'));
export const pageMap = state.migrate?.pageMap || [];
const BY_SOURCE = new Map(); for (const m of pageMap) { BY_SOURCE.set(m.sourceUrl.toLowerCase(), m); BY_SOURCE.set(m.sourceUrl.toLowerCase().replace(/\.html$/, ''), m); BY_SOURCE.set(`/${m.outputPath}`.toLowerCase(), m); }
export const pageFor = (slug) => state.pages.find((p) => p.slug === slug);
export const mapFor = (slug) => pageMap.find((m) => m.slug === slug);

export function loadMigrated(slug) {
  const m = mapFor(slug); if (!m) throw new Error(`no pageMap entry for ${slug} — run migrate first`);
  const file = path.join(MIGRATED_DIR, m.outputPath);
  const html = fs.readFileSync(file, 'utf8');
  return { document: parseHTML(html).document, file, html, map: m };
}

export function esc(s = '') { return String(s).replace(/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
export const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
export const q = (el, s) => (el ? el.querySelector(s) : null);
export const qa = (el, s) => (el ? [...el.querySelectorAll(s)] : []);
export const cls = (el) => (el ? (el.getAttribute('class') || '').split(/\s+/).filter(Boolean) : []);
export const has = (el, c) => cls(el).includes(c);

/** ENCODE context per page. */
export function makeCtx(slug, map) { return { slug, map, notes: [], gaps: [], rasterise: new Set(), assets: new Set(), blocks: new Set() }; }

/* ---- media ---- */
const SVG_SIZES = fs.existsSync('stardust/rollout/svg-sizes.json') ? JSON.parse(fs.readFileSync('stardust/rollout/svg-sizes.json', 'utf8')) : {};
export const SVG_LIMIT = 40000;
export const rasterName = (url) => `${path.basename(url.split('?')[0]).replace(/\.svg$/i, '')}.png`;
/** Authored image URL: source-origin URLs pass through; SVGs over the pipeline's 40 KB limit are authored as their DA-media PNG. */
export function mediaUrl(src, ctx) {
  if (!src) return '';
  let abs = src.startsWith('//') ? `https:${src}` : src;
  if (/^\//.test(abs)) abs = SOURCE_ORIGIN + abs;
  if (/\.svg(\?|$)/i.test(abs) && (SVG_SIZES[abs] || 0) > SVG_LIMIT) { const png = rasterName(abs); ctx?.rasterise?.add(abs); ctx?.notes?.push(`media: ${abs.split('/').pop()} is ${SVG_SIZES[abs]} B of SVG (> ${SVG_LIMIT}) — authored as DA media ${png}`); return `${MEDIA_BASE}${png}`; }
  return abs;
}
export function imgHtml(img, ctx, { alt } = {}) {
  if (!img) return '';
  const src = mediaUrl(img.getAttribute('src'), ctx); if (!src || /^data:/.test(src)) return '';
  const a = alt ?? img.getAttribute('alt') ?? '';
  return `<img src="${esc(src)}" alt="${esc(a)}">`;
}
export const pic = (img, ctx) => (img ? `<p>${imgHtml(img, ctx)}</p>` : '');

/* ---- links ---- */
/** Delivered-safe href: roster pages → root-relative delivered path; other site pages → absolute source origin (bounce); rest verbatim.
 *  The migrated pages carry RELATIVE roster links (./x.html, ../y.html) — resolved against the page's own output path. */
export function href(h = '', ctx) {
  if (!h) return h;
  let s = h.trim();
  if (/^(#|mailto:|tel:|javascript:|sms:|data:)/i.test(s)) return s;
  if (/^\$\{/.test(s) || (!/^(\/|https?:|tel:|mailto:|sms:|#|\.\.?\/|\?)/i.test(s) && /%20|\s/.test(s))) { ctx?.notes?.push(`unresolved captured href kept as a bounce to the source page: ${s.slice(0, 60)}`); return SOURCE_ORIGIN + (ctx?.map?.sourceUrl || '/'); } // AEM link templates / authoring placeholders
  if (/^\.\.?\//.test(s) && ctx?.map) { const [p, rest = ''] = s.split(/(?=[?#])/); const abs = `/${path.posix.normalize(path.posix.join(path.posix.dirname(ctx.map.outputPath), p))}`; const hit = BY_SOURCE.get(abs.toLowerCase()); if (hit) return hit.deliveredPath + rest; s = SOURCE_ORIGIN + abs + rest; }
  if (s.startsWith('//')) s = `https:${s}`;
  let u; try { u = new URL(s, SOURCE_ORIGIN); } catch { return s; }
  if (!/^(www\.)?sparebank1\.no$/i.test(u.hostname)) return s;
  const p = u.pathname.replace(/^\/content\/sites\/sb1(?=\/)/i, '');
  const hit = BY_SOURCE.get(p.toLowerCase()) || BY_SOURCE.get(p.toLowerCase().replace(/\/$/, ''));
  const search = u.search.replace(/([?&])icid=[^&#]*&?/g, '$1').replace(/[?&]$/, ''); // strip SB1 campaign tracking params on internal links
  if (hit) return hit.deliveredPath + search + u.hash;
  return `${SOURCE_ORIGIN}${p}${u.search}${u.hash}`;
}

/* ---- inline / prose serialisers over the redesign DOM ---- */
export function inline(el, ctx) {
  if (!el) return '';
  let out = '';
  for (const n of el.childNodes) {
    if (n.nodeType === 3) { out += esc(n.textContent); continue; }
    if (n.nodeType !== 1) continue;
    const t = n.tagName.toLowerCase();
    if (t === 'br') { out += '<br>'; continue; }
    if (t === 'img') { out += imgHtml(n, ctx); continue; }
    if (t === 'svg' || t === 'script' || t === 'style' || t === 'button' || t === 'input' || t === 'select' || t === 'textarea') continue;
    if (t === 'a') { out += `<a href="${esc(href(n.getAttribute('href') || '', ctx))}">${inline(n, ctx)}</a>`; continue; }
    if (['strong', 'em', 'b', 'i', 'u', 's', 'sup', 'sub', 'code', 'small', 'time'].includes(t)) {
      let inner = inline(n, ctx); const tag = t === 'time' || t === 'small' ? null : t; // small/time are presentational spans in the redesign → flatten
      inner = inner.replace(/^(\s|&nbsp;|<br>)+/, (m) => m.replace(/&nbsp;/g, ' ')).trimStart();
      if (!inner.trim()) continue;
      out += tag ? `<${tag}>${inner}</${tag}>` : inner; if (t === 'small' || t === 'time') out += ' ';
      continue;
    }
    out += inline(n, ctx); // span / div / other wrappers: flatten
  }
  return out.replace(/\s+/g, ' ');
}

/** Rich prose: block children as default content (h1-h6, p, ul/ol, table, img, blockquote). */
export function prose(el, ctx, { demote = 0 } = {}) {
  if (!el) return '';
  let out = '';
  const hTag = (t) => `h${Math.min(6, +t[1] + demote)}`;
  for (const n of el.childNodes) {
    if (n.nodeType === 3) { if (n.textContent.trim()) out += `<p>${esc(n.textContent.trim())}</p>`; continue; }
    if (n.nodeType !== 1) continue;
    const t = n.tagName.toLowerCase();
    if (/^(h[1-6]|p)$/.test(t) && !n.textContent.replace(/ /g, ' ').trim() && !n.querySelector('img, picture, a')) continue;
    if (/^h[1-6]$/.test(t)) { out += `<${hTag(t)}>${inline(n, ctx)}</${hTag(t)}>`; continue; }
    if (t === 'p') { const s = inline(n, ctx).trim(); if (s) out += /^<a [^>]*class="btn/.test(n.innerHTML.trim()) ? ctas(n, ctx) : `<p>${s}</p>`; continue; }
    if (t === 'ul' || t === 'ol') { out += list(n, ctx); continue; }
    if (t === 'img') { out += `<p>${imgHtml(n, ctx)}</p>`; continue; }
    if (t === 'picture') { const i = n.querySelector('img'); if (i) out += `<p>${imgHtml(i, ctx)}</p>`; continue; }
    if (t === 'figure') { const i = n.querySelector('img'); const cap = n.querySelector('figcaption'); if (i) out += `<p>${imgHtml(i, ctx)}</p>`; if (cap && txt(cap)) out += `<p><em>${inline(cap, ctx)}</em></p>`; continue; }
    if (t === 'table') { out += table(n, ctx); continue; }
    if (t === 'blockquote') { out += `<blockquote>${prose(n, ctx)}</blockquote>`; continue; }
    if (t === 'a' && /\bbtn\b/.test(n.getAttribute('class') || '')) { out += ctaHtml(n, ctx); continue; }
    if (t === 'a') { out += `<p><a href="${esc(href(n.getAttribute('href') || '', ctx))}">${inline(n, ctx)}</a></p>`; continue; }
    if (t === 'hr' || t === 'br' || t === 'svg' || t === 'script' || t === 'style' || t === 'form' || t === 'button' || t === 'input' || t === 'iframe') continue;
    if (['span', 'strong', 'em', 'b', 'i', 'small', 'label', 'time'].includes(t)) { const s = inline(n, ctx).trim(); if (s) out += `<p>${s}</p>`; continue; }
    if (t === 'dl') { for (const c of n.children) { if (c.tagName === 'DT') out += `<p><strong>${inline(c, ctx)}</strong></p>`; else if (c.tagName === 'DD') out += `<p>${inline(c, ctx)}</p>`; else out += prose(c, ctx); } continue; }
    out += prose(n, ctx, { demote }); // div/section/aside/article wrappers
  }
  return out;
}

export function list(ul, ctx) {
  const t = ul.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul';
  let out = `<${t}>`;
  for (const li of ul.children) {
    if (li.tagName !== 'LI') continue;
    let inner = '';
    for (const n of li.childNodes) {
      if (n.nodeType === 3) { inner += esc(n.textContent); continue; }
      if (n.nodeType !== 1) continue;
      const tt = n.tagName.toLowerCase();
      if (tt === 'ul' || tt === 'ol') inner += list(n, ctx);
      else if (tt === 'p' || tt === 'div' || tt === 'span') inner += (inner.trim() && n.textContent.trim() ? ' ' : '') + inline(n, ctx);
      else if (/^h[1-6]$/.test(tt)) inner += `<strong>${inline(n, ctx)}</strong> `;
      else inner += inline({ childNodes: [n] }, ctx);
    }
    out += `<li>${inner.replace(/\s+/g, ' ').trim()}</li>`;
  }
  return `${out}</${t}>`;
}

export function table(tb, ctx) {
  let out = '<table>';
  for (const tr of tb.querySelectorAll('tr')) {
    out += '<tr>';
    for (const c of tr.children) { const tag = c.tagName === 'TH' ? 'th' : 'td'; out += `<${tag}>${inline(c, ctx)}</${tag}>`; }
    out += '</tr>';
  }
  return `${out}</table>`;
}

/* ---- CTAs (David's Model D6) ---- */
export function ctaKind(a) {
  const c = a.getAttribute('class') || '';
  if (/btn-action/.test(c)) return 'accent';
  if (/btn-secondary/.test(c)) return 'secondary';
  if (/btn-inline/.test(c) || /link-more/.test(c) || /backlink/.test(c)) return 'link';
  if (/\bbtn\b/.test(c)) return 'primary';
  return 'link';
}
export function ctaHtml(a, ctx, kind) {
  if (!a) return '';
  const k = kind || ctaKind(a);
  const link = `<a href="${esc(href(a.getAttribute('href') || '', ctx))}">${inline(a, ctx).trim()}</a>`;
  if (k === 'accent') return `<p><em><strong>${link}</strong></em></p>`;
  if (k === 'primary') return `<p><strong>${link}</strong></p>`;
  if (k === 'secondary') return `<p><em>${link}</em></p>`;
  return `<p>${link}</p>`;
}
/** Every CTA anchor inside a container → one paragraph each (one CTA per <p>, delivery-lint P1). */
export function ctas(container, ctx) { return qa(container, 'a').map((a) => ctaHtml(a, ctx)).join(''); }

/* ---- block / section builders ---- */
export const cell = (html) => `<div>${html}</div>`;
export const row = (cells) => `<div>${cells.map(cell).join('')}</div>`;
export function block(name, variants, rows) {
  const c = [name, ...(variants || []).filter(Boolean)].join(' ');
  return `<div class="${esc(c)}">${rows.map((r) => (Array.isArray(r) ? row(r) : r)).join('')}</div>`;
}
export function sectionMeta(meta) {
  const entries = Object.entries(meta || {}).filter(([, v]) => v);
  if (!entries.length) return '';
  return block('section-metadata', [], entries.map(([k, v]) => [k, esc(v)]));
}
export const section = (parts, meta) => `<div>${parts.filter(Boolean).join('')}${sectionMeta(meta)}</div>`;
export const styleOf = (...tokens) => tokens.filter(Boolean).join(', ');

/** Section `style` tokens from a migrated movement's classes (paper + rhythm modifiers). */
export function paperOf(sec) {
  const c = cls(sec);
  return c.includes('paper-sand') ? 'paper-sand' : c.includes('paper-frost') ? 'paper-frost' : c.includes('paper-syrin') ? 'paper-syrin' : c.includes('paper-vann') ? 'paper-vann' : null;
}

export function writeFile(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
export function pageDoc(sectionsHtml) {
  return `<body>\n  <header></header>\n  <main>\n${sectionsHtml.map((s) => `    ${s}`).join('\n')}\n  </main>\n  <footer></footer>\n</body>\n`;
}
