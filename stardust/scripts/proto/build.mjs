#!/usr/bin/env node
// Assemble stardust/prototypes/<slug>-proposed.html from the shared chrome (canon) + the page module.
// Usage: node stardust/scripts/proto/build.mjs <slug>
import fs from 'node:fs'; import path from 'node:path';
import { loadDoc, pageJson, headerData, routerData, footerData } from './data.mjs';
import { favicon, skipLinks, headerHtml, routerHtml, footerHtml, navScript, cssBase, rootTokens, esc } from './chrome.mjs';
const slug=process.argv[2]; if(!slug){ console.error('slug required'); process.exit(1); }
const mod=await import(path.resolve(`stardust/scripts/proto/pages/${slug}.mjs`));
const doc=loadDoc(slug); const pj=pageJson(slug);
const data={header:headerData(doc),router:routerData(doc),footer:footerData(doc),doc,pj,slug};
if(mod.patchData) mod.patchData(data);
const page=mod.render(data);           // { main, css, provenance, template, title, description, lang }
const now=new Date().toISOString();
const prov=page.provenance||{};
const yaml=(o,ind='  ')=>Object.entries(o).map(([k,v])=>Array.isArray(v)?(v.length?`${ind}${k}:\n${v.map(x=>`${ind}  - ${typeof x==='string'?x:JSON.stringify(x)}`).join('\n')}`:`${ind}${k}: []`):(typeof v==='object'&&v!==null?`${ind}${k}:\n${yaml(v,ind+'  ')}`:`${ind}${k}: ${v}`)).join('\n');
const provenance=`<!-- stardust:provenance
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
const html=`<!DOCTYPE html>
<html lang="${page.lang||'nb'}">
<head>
${provenance}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title||pj.title)}</title>
<meta name="description" content="${esc(page.description||pj.metaDescription||'')}">
<meta name="template" content="${esc(page.template)}">
<meta name="theme-color" content="#002776">
${favicon()}
<style>
${rootTokens()}
${cssBase()}
${page.css||''}
</style>
</head>
<body data-template="${esc(page.template)}">
${skipLinks()}
${headerHtml(data.header)}
${data.router&&page.router!==false?routerHtml(data.router):''}
<main id="main-content" tabindex="-1">
${page.main}
</main>
${footerHtml(page.footer||data.footer)}
${navScript()}
</body>
</html>
`;
const out=`stardust/prototypes/${slug}-proposed.html`; fs.writeFileSync(out,html);
console.log(`${out} — ${(html.length/1024).toFixed(0)} KB`);
