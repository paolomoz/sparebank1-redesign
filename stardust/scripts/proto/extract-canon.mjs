#!/usr/bin/env node
// Canon extraction per skills/prototype/reference/canon-extraction.md — run on approval of the canon author (first) and of
// subsequent archetypes (diff mode: net-new modules appended, conflicts logged as deviations).
// Usage: node stardust/scripts/proto/extract-canon.mjs <slug> [--author]
import fs from 'node:fs'; import crypto from 'node:crypto'; import { parseHTML } from 'linkedom';
import { rootTokens, cssBase } from './chrome.mjs';
const slug=process.argv[2]; const isAuthor=process.argv.includes('--author'); const now=new Date().toISOString();
const file=`stardust/prototypes/${slug}-proposed.html`; const html=fs.readFileSync(file,'utf8'); const {document}=parseHTML(html);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const prov=(region)=>`<!-- stardust:canon\n  writtenBy:        stardust:prototype --prep\n  writtenAt:        ${now}\n  sourceSlug:       ${slug}\n  sourcePrototype:  ${file}\n  region:           ${region}\n  stardustVersion:  0.20.0\n-->\n`;
fs.mkdirSync('stardust/canon/modules',{recursive:true});
const design=JSON.parse(fs.readFileSync('DESIGN.json','utf8')); design.extensions.canon=design.extensions.canon||null;
const write=(p,body)=>{fs.writeFileSync(p,body); return {path:p,sha:sha(body)};};
const compositionalMoves=[
  "Chrome is a Danske-style two-tier header: a 32 px Sand-70 settings bar with the audience tabs (active tab = white block) over an 80 px white bar with the logo, nine 14 px market links and the tools (Bli kunde text, search glyph, Skog Logg inn); sticky, it hides on scroll-down and reveals only the main bar on scroll-up; below 1140 px it is one 68 px bar with a Meny toggle opening a fixed panel.",
  "Every repeated or promotional unit is a card: a tinted fill (Sand-70 default, Frost-30 cool, Syrin-30 quiet, Fjell/Vann dark) with 2 px corners, no border, no shadow, 6 px gutters, 48/36 padding; photos bleed to the card edge at 16:9; rows are 12-column bentos with asymmetric spans (5/7, 2+4+2+4, 3×4).",
  "The page keeps a 1312 px content column (1440 max, 64 px gutters); at most 30 % of a page's sections may go full width, and those are minor rows (promo bands), never the primary content.",
  "Type is the Ramp scale on the three single-weight brand faces — 64 / 48 / 40 / 28 / 24 headings at 1.0–1.14 leading, 18 lead, 16 / 14 / 13 body at 1.375 — with hierarchy carried by size, leading and a two-tone (ink + 60 % hushed) split, never by weight or uppercase; the only tracked style is a 10 px uppercase eyebrow.",
  "Buttons are Ramp geometry: 6 px radius, no border, padding-driven height (nav 34, standard 44, large 50), Skog for the one relationship-starting action, Vann primary, Frost-30 fill (no outline) secondary, white on dark; hover darkens the fill over 300 ms, nothing moves.",
  "The alliance router is a Vann card: on the home page a tall centred tile with the landscape illustration behind the postcode form; on every other page a compact contained band directly under the header with the landscape at reduced opacity on the right.",
  "Hover is the distinctive layer: the card fill deepens one brand tint step, the title underline draws in and turns Vann, spot illustrations spring up 6 px with a tilt, photos breathe 3–4 %, the router landscape drifts; every effect also fires on focus-within and is off under reduced motion.",
  "Contact channels are five white cards on a Sand-70 pre-footer band with Frost-30 icon circles that invert to Vann on hover/open; the footer is a Fjell block with a 230 px logo column beside the link columns and the legal row in the same grid."
];
const pinned={"sectionPadding.desktop":"64px","sectionPadding.tablet":"48px","sectionPadding.mobile":"48px","densityTier":"balanced","typeScale":"ramp 64/48/40/28/24 · 18 · 16/14/13","lineHeights.display":1.0,"lineHeights.headline":1.04,"lineHeights.body":1.375,"containerMaxWidth":"1440px (1312 content)","gutters":"64/32/16","cardGap":"6px","cardPadding":"48/36 (40/28 tablet, 36/20 mobile)","radius.card":"2px","radius.photo":"2px (bleeds to card edge, 16:9)","radius.button":"6px","header":"32px settings bar + 80px main bar; sticky hide/reveal; 68px + Meny toggle below 1140px","fullWidthSectionBudget":"≤30% of sections, minor rows only","navCollapse":"1140px hamburger"};
const prior=design.extensions.canon; if(isAuthor||!design.extensions.canon){
  const header=document.querySelector('header'); const footer=document.querySelector('footer'); const router=document.querySelector('aside.router'); const skip=document.querySelector('nav.skip');
  const files={};
  files.header=write('stardust/canon/header.html',prov('header')+header.outerHTML+'\n');
  files.footer=write('stardust/canon/footer.html',prov('footer')+footer.outerHTML+'\n');
  if(router) files.router=write('stardust/canon/bank-router.html',prov('bank-router')+router.outerHTML+'\n');
  if(skip) files.skip=write('stardust/canon/skip-links.html',prov('skip-links')+skip.outerHTML+'\n');
  const script=(html.match(/<script>[\s\S]*?<\/script>/)||[''])[0]; files.navScript=write('stardust/canon/nav-a11y.html',prov('nav-a11y script')+script+'\n');
  files.css=write('stardust/canon/canon.css',`/* stardust:canon\n  writtenBy: stardust:prototype --prep\n  writtenAt: ${now}\n  sourceSlug: ${slug}\n  region: css (:root token contract + compound visual language: buttons, cards, papers, chrome, faq, feedback, callout)\n*/\n`+rootTokens()+cssBase());
  design.extensions.canon={sourceSlug:slug,approvedAt:prior?prior.approvedAt:now,files,pinned,compositionalMoves,history:[...(prior?prior.history:[]),{at:now,from:slug,kind:prior?'canon-update':'first-approval',reason:prior?(process.argv.find(a=>a.startsWith('--reason='))||'').slice(9)||'chrome update':undefined}],notes:"Canon source of truth is stardust/scripts/proto/chrome.mjs; the files here are lifted verbatim from the approved canon-author render. Header/footer link SETS vary per audience (privat/bedrift/om-oss) and are injected from each page's captured data — structure and style are canon, link sets are content."};
} else { design.extensions.canon.history.push({at:now,from:slug,kind:'extension',added:[]}); }
// module canonical renderings present in this prototype
const added=[];
if(isAuthor) for(const m of design.extensions.modules){ if(document.querySelector(`[data-module="${m.id}"]`)) m.canonicalRendering=null; }
else for(const m of design.extensions.modules){ const r=m.canonicalRendering; if(!r||!document.querySelector(`[data-module="${m.id}"]`)) continue; const prev=fs.existsSync(r.path)?fs.readFileSync(r.path,'utf8'):''; const from=(prev.match(/sourceSlug:\s+(\S+)/)||[])[1]; if(from===slug||from===undefined) m.canonicalRendering=null; } // re-approval of the same archetype refreshes its own renderings
for(const m of design.extensions.modules){ if(m.canonicalRendering) continue; const el=document.querySelector(`[data-module="${m.id}"]`); if(!el) continue; const p=`stardust/canon/modules/${m.id}.html`; const r=write(p,prov('module:'+m.id)+el.outerHTML+'\n'); m.canonicalRendering=r; added.push('module:'+m.id); }
if(!isAuthor && design.extensions.canon.history.length){ design.extensions.canon.history[design.extensions.canon.history.length-1].added=added; }
fs.writeFileSync('DESIGN.json',JSON.stringify(design,null,1));
console.log(`canon ${isAuthor?'written':'extended'} from ${slug}: modules added ${added.join(', ')||'(none)'}; files ${Object.keys(design.extensions.canon.files).join(', ')}`);
