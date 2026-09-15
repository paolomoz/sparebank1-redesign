import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 }, locale: 'nb-NO' });
await p.goto('https://www.sparebank1.no/nb/bank/privat.html', { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.log('nav', e.message));
await p.waitForTimeout(4000);
const data = await p.evaluate(() => {
  const car = document.querySelector('.campaign-carousel') || document.querySelector('[class*=campaign]');
  const out = { text: car ? car.innerText.slice(0, 600) : null, imgs: [], links: [] };
  if (car) { car.querySelectorAll('img').forEach(i => out.imgs.push(i.currentSrc || i.src)); car.querySelectorAll('a').forEach(a => out.links.push([a.href, a.innerText.trim().slice(0, 60)])); car.querySelectorAll('[style*=background]').forEach(el => out.imgs.push('bg:' + el.getAttribute('style'))); }
  out.gnager = document.body.innerText.includes('gnager');
  return out;
});
console.log(JSON.stringify(data, null, 1));
await p.screenshot({ path: '/tmp/live-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
await b.close();
