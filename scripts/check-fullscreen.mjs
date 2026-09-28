import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:'chrome'});
const page = await browser.newPage();
for (const [width,height] of [[1440,900],[1920,1080],[390,844],[320,568],[844,390]]) {
  await page.setViewportSize({width,height});
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
  await page.evaluate(()=>document.fonts.ready);
  const result=await page.evaluate(()=>{
    const hero=document.querySelector('.hero').getBoundingClientRect();
    const header=document.querySelector('header').getBoundingClientRect();
    const footer=document.querySelector('.hero-footer').getBoundingClientRect();
    return {height:hero.height,available:innerHeight-header.height,overflow:document.documentElement.scrollWidth>innerWidth,footerInside:footer.bottom<=hero.bottom+1};
  });
  assert(result.height>=result.available-1);
  if(height>=800) assert(Math.abs(result.height-result.available)<2);
  assert(!result.overflow && result.footerInside);
  await page.locator('.aero-shards[data-ready="true"]').waitFor();
  await page.waitForTimeout(1000);
  await page.screenshot({path:`test-results/fullscreen-${width}.png`});
  console.log(`${width}x${height}: ${JSON.stringify(result)}`);
}
await browser.close();
