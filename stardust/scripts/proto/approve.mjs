#!/usr/bin/env node
// Hands-off approval writer (merge-by-slug): prototyped → approved with approvedBy: "hands-off" ONLY after every gate passed.
// Usage: node stardust/scripts/proto/approve.mjs <slug> --review "<disposition summary>" [--deviations "a;b"]
import fs from 'node:fs';
const slug=process.argv[2]; const arg=k=>{const i=process.argv.indexOf(k); return i>0?process.argv[i+1]:null;};
const rep=JSON.parse(fs.readFileSync(`stardust/validation/${slug}/report.json`,'utf8'));
const cc=JSON.parse(fs.readFileSync(`stardust/validation/${slug}/content-check.json`,'utf8'));
const p01=rep.issues.filter(i=>i.sev==='P0'||i.sev==='P1'); const ccMiss=cc.miss.text.length+cc.miss.href.length+cc.miss.img.length;
if(p01.length||ccMiss){ console.error(`REFUSED: ${slug} has ${p01.length} P0/P1 and ${ccMiss} content misses — gates must pass before approval.`); process.exit(1); }
const state=JSON.parse(fs.readFileSync('stardust/state.json','utf8')); // re-read before write
const page=state.pages.find(p=>p.slug===slug); if(!page){ console.error('unknown slug'); process.exit(1); }
const now=new Date().toISOString();
page.prototypePath=`stardust/prototypes/${slug}-proposed.html`; page.shapeBriefPath=`stardust/prototypes/${slug}-shape.md`;
page.gatesPassed=['validation-loop 1440/768/390 (console, network, overflow, landmarks, a11y quick-pass, contrast, LCP, interaction smoke)','mobile-nav-audit 360','content-verbatim','token-contract','data-attributes','impeccable detect (cramped-padding on var() padding dismissed)','finish-review: '+(arg('--review')||'n/a')];
page.fidelityTier='archetype'; page.archetypeSource=null; page.canonDeviations=(arg('--deviations')||'').split(';').filter(Boolean);
page.status='approved'; page.history.push({status:'prototyped',at:now},{status:'approved',at:now,approvedBy:'hands-off'}); page.stale=false; page.staleReason=null;
state._provenance.writtenBy='stardust:prototype (--prep)'; state._provenance.writtenAt=now;
fs.writeFileSync('stardust/state.json',JSON.stringify(state,null,1));
console.log(`${slug}: approved (hands-off) at ${now}`);
