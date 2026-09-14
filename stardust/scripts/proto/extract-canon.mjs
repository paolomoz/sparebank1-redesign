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
  "Chrome is two calm tiers on white (audience switch + one Skog action above; logo + market nav below) that collapse to one row and a hamburger at 640px; the header is never sticky on desktop.",
  "The alliance router is a compact Vann band in every first viewport it was captured on: heading, postcode field, one secondary action, the 12-bank list behind a details disclosure, the landscape illustration at reduced scale on the right.",
  "A page is 3–6 movements separated by paper changes (Hvit → Sand-30 / Frost-30 / Syrin-30) and space; dividers, card shadows at rest and eyebrow labels are not used.",
  "Photographs are content: one per module, native 3:2, one-corner-pair mask (96px hero, 48px card); type never sits on a photograph.",
  "Hierarchy is the 1.25 scale on the three single-weight brand faces; Fjell for headlines, Vann for every link, Skog reserved to the single relationship-starting action per module.",
  "Repeated content (product columns, news, promos) is set as flat tinted papers or hairline-topped tiles with the whole tile as the link and category/date as a meta line under the title.",
  "Contact channels and long verbatim lists (bank numbers, bank links) live behind native details disclosures inside the Hvit contact section above the Fjell footer."
];
const pinned={"sectionPadding.desktop":"64px","sectionPadding.tablet":"48px","sectionPadding.mobile":"32px","densityTier":"balanced","typeScale":1.25,"lineHeights.display":1.1,"lineHeights.headline":1.12,"lineHeights.body":1.55,"containerMaxWidth":"1280px","gutters":"80/48/24/20","radius.card":"16px","radius.photo":"96px / 48px one-corner-pair","radius.button":"6em","navCollapse":"640px hamburger"};
if(isAuthor||!design.extensions.canon){
  const header=document.querySelector('header'); const footer=document.querySelector('footer'); const router=document.querySelector('aside.router'); const skip=document.querySelector('nav.skip');
  const files={};
  files.header=write('stardust/canon/header.html',prov('header')+header.outerHTML+'\n');
  files.footer=write('stardust/canon/footer.html',prov('footer')+footer.outerHTML+'\n');
  if(router) files.router=write('stardust/canon/bank-router.html',prov('bank-router')+router.outerHTML+'\n');
  if(skip) files.skip=write('stardust/canon/skip-links.html',prov('skip-links')+skip.outerHTML+'\n');
  const script=(html.match(/<script>[\s\S]*?<\/script>/)||[''])[0]; files.navScript=write('stardust/canon/nav-a11y.html',prov('nav-a11y script')+script+'\n');
  files.css=write('stardust/canon/canon.css',`/* stardust:canon\n  writtenBy: stardust:prototype --prep\n  writtenAt: ${now}\n  sourceSlug: ${slug}\n  region: css (:root token contract + compound visual language: buttons, cards, papers, chrome, faq, feedback, callout)\n*/\n`+rootTokens()+cssBase());
  design.extensions.canon={sourceSlug:slug,approvedAt:now,files,pinned,compositionalMoves,history:[{at:now,from:slug,kind:'first-approval'}],notes:"Canon source of truth is stardust/scripts/proto/chrome.mjs; the files here are lifted verbatim from the approved canon-author render. Header/footer link SETS vary per audience (privat/bedrift/om-oss) and are injected from each page's captured data — structure and style are canon, link sets are content."};
} else { design.extensions.canon.history.push({at:now,from:slug,kind:'extension',added:[]}); }
// module canonical renderings present in this prototype
const added=[];
for(const m of design.extensions.modules){ if(m.canonicalRendering) continue; const el=document.querySelector(`[data-module="${m.id}"]`); if(!el) continue; const p=`stardust/canon/modules/${m.id}.html`; const r=write(p,prov('module:'+m.id)+el.outerHTML+'\n'); m.canonicalRendering=r; added.push('module:'+m.id); }
if(!isAuthor && design.extensions.canon.history.length){ design.extensions.canon.history[design.extensions.canon.history.length-1].added=added; }
fs.writeFileSync('DESIGN.json',JSON.stringify(design,null,1));
console.log(`canon ${isAuthor?'written':'extended'} from ${slug}: modules added ${added.join(', ')||'(none)'}; files ${Object.keys(design.extensions.canon.files).join(', ')}`);
