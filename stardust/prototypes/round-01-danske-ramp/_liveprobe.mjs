import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:844}});
await p.goto('https://main--sparebank1-redesign--paolomoz.aem.live/nb/bank/om-oss/nyheter/bankkort-laget-av-resirkulert-plast',{waitUntil:'networkidle',timeout:90000}); await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const f=document.querySelector('.hero .hero-media'); const pic=f.querySelector('picture'); const img=f.querySelector('img'); const cap=f.querySelector('.caption-wrap'); const g=e=>e?{h:Math.round(e.getBoundingClientRect().height),w:Math.round(e.getBoundingClientRect().width),pos:getComputedStyle(e).position,ar:getComputedStyle(e).aspectRatio,disp:getComputedStyle(e).display,height:getComputedStyle(e).height}:null;
 return {fig:g(f),figClass:f.className,pic:g(pic),img:g(img),imgSrc:img?.currentSrc?.slice(-60),complete:img?.complete,natural:[img?.naturalWidth,img?.naturalHeight],cap:g(cap),bodyClass:document.body.className};});
console.log(JSON.stringify(r,null,1)); await b.close();
