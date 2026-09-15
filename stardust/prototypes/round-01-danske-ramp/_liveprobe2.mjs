import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:844}});
await p.goto('https://main--sparebank1-redesign--paolomoz.aem.live/nb/bank/bedrift/bedriftsforsikring/bransjer/borettslag-sameie',{waitUntil:'networkidle',timeout:90000});
await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}}); await p.waitForTimeout(3000);
const r=await p.evaluate(()=>[...document.querySelectorAll('main img')].map(i=>({src:(i.currentSrc||i.src).split('/').slice(-1)[0].slice(0,40),w:Math.round(i.getBoundingClientRect().width),h:Math.round(i.getBoundingClientRect().height),complete:i.complete,nat:[i.naturalWidth,i.naturalHeight],loading:i.loading,cls:i.className.slice(0,30)})).filter(x=>x.h<20||!x.complete||x.nat[0]===0));
console.log('problem images:', JSON.stringify(r,null,1)); const secs=await p.evaluate(()=>[...document.querySelectorAll('main > .section')].map(s=>[Math.round(s.getBoundingClientRect().height), s.className.slice(0,40)])); console.log(JSON.stringify(secs)); await b.close();
