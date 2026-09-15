import { chromium } from 'playwright';
const [,, file, out, w] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto(file.startsWith('http') ? file : 'file://' + file, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
// scroll through so lazy images load, then back to top so the sticky header is in its rest state
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(600);
await p.evaluate(() => { const h = document.querySelector('.site-header'); if (h) h.style.transform = ''; });
await p.screenshot({ path: out, fullPage: true }); await b.close(); console.log('ok', out);
