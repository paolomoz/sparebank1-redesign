// assemble.mjs — one document assembler for prototypes (build.mjs) AND migrate (Path A′ siblings).
// Renders a page module (stardust/scripts/proto/pages/<archetype>.mjs) against a captured page's DOM and wraps it in the
// canon chrome. The module is the family renderer: `render({doc,pj,header,router,footer,slug,archetype})` → { main, css, … }.
import path from 'node:path';
import { loadDoc, pageJson, headerData, routerData, footerData, frontendFooter } from './data.mjs';
import { favicon, skipLinks, headerHtml, routerHtml, footerHtml, navScript, cssBase, rootTokens, esc } from './chrome.mjs';

export const yaml = (o, ind = '  ') => Object.entries(o).map(([k, v]) => Array.isArray(v) ? (v.length ? `${ind}${k}:\n${v.map((x) => `${ind}  - ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n')}` : `${ind}${k}: []`) : (typeof v === 'object' && v !== null ? `${ind}${k}:\n${yaml(v, ind + '  ')}` : `${ind}${k}: ${v}`)).join('\n');

/** Load the page module for an archetype slug. */
export async function loadModule(archetypeSlug) {
  return import(path.resolve(`stardust/scripts/proto/pages/${archetypeSlug}.mjs`));
}

/** Render `slug` through `mod` (the family renderer). Returns { html, page, data }. */
export function assemble(slug, mod, { archetype = slug, provenanceHeader } = {}) {
  const doc = loadDoc(slug); const pj = pageJson(slug);
  let footer = footerData(doc); if (!footer || !footer.columns.length) footer = frontendFooter(doc) || footer;
  const data = { header: headerData(doc), router: routerData(doc), footer, doc, pj, slug, archetype };
  if (mod.patchData) mod.patchData(data);
  const page = mod.render(data); // { main, css, provenance, template, title, description, lang, router?, footer? }
  // Authoring debris at block edges: captured `&nbsp;` / whitespace runs at the START or END of a paragraph, list item, heading or cell render as an
  // extra wrapped line at narrow widths (a non-collapsible trailing space) and the delivery pipeline trims them anyway (#112) — whitespace-only, content-neutral.
  const NB = '(?:&nbsp;|&#160;|\u00a0|\\s)';
  page.main = page.main.replace(new RegExp(`${NB}+</(p|li|h[1-6]|td|th|dd|dt|figcaption|summary)>`, 'g'), '</$1>').replace(new RegExp(`<(p|li|h[1-6]|td|th|dd|dt|figcaption)([^>]*)>${NB}+(?=\\S)`, 'g'), '<$1$2>')
    .replace(/<img\b[^>]*\bsrc=""[^>]*>/g, ''); // an image without a source is not content
  const now = new Date().toISOString();
  const prov = page.provenance || {};
  const provenance = provenanceHeader ? provenanceHeader({ slug, pj, now, prov, archetype }) : `<!-- stardust:provenance
  writtenBy:         stardust:prototype (--prep; rendered through impeccable new-work against DESIGN.md; chrome = canon source stardust/scripts/proto/chrome.mjs)
  writtenAt:         ${now}
  page:              ${slug}
  pageUrl:           ${pj.url}
  againstDirection:  stardust/direction.md (Active 2026-09-14T21:10:00Z)
  readArtifacts:
    - stardust/current/pages/${slug}.json
    - stardust/current/pages/${slug}.html
    - DESIGN.md
    - DESIGN.json
    - stardust/prototypes/${slug}-shape.md
  divergenceVersion: v1.0 (stardust v2)
  fontDeck:          brand-inherited (SpareBank1-title-medium / medium / regular; static single-weight — Discipline 7 exempt)
  paletteSource:     inherited (_ffe-tokens.json), Mode A
  fidelity:          refined
  iaFidelity:        verbatim
  surprise:          low
  reflexRejectAudit: { bypassed: true, reason: "Mode A pinned families" }
  copyCadenceBypass: { rules: [em-dash-overuse, marketing-buzzword, exclamation], basis: "all copy captured-verbatim" }
${yaml(prov)}
  stardustVersion:   0.20.0
-->`;
  const html = `<!DOCTYPE html>
<html lang="${page.lang || 'nb'}">
<head>
${provenance}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title || pj.title)}</title>
<meta name="description" content="${esc(page.description || pj.metaDescription || '')}">
<meta name="template" content="${esc(page.template)}">
<meta name="theme-color" content="#002776">
${favicon()}
<style>
${rootTokens()}
${cssBase()}
${page.css || ''}
</style>
</head>
<body data-template="${esc(page.template)}">
${skipLinks()}
${headerHtml(data.header)}
${data.router && page.router !== false ? routerHtml(data.router) : ''}
<main id="main-content" tabindex="-1">
${page.main}
</main>
${footerHtml(page.footer || data.footer)}
${navScript()}
</body>
</html>
`;
  return { html, page, data };
}
