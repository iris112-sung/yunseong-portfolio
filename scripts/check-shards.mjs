import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage();
for (const width of [1440,390]) {
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:5173/');
  await page.locator('.aero-shards[data-ready="true"]').waitFor({timeout:30000});
  await page.waitForTimeout(1200);
  const canvas=page.locator('.aero-shards canvas');
  const first=await canvas.screenshot();
  const colors=await page.evaluate(async base64=>{
    const img=new Image();img.src=`data:image/png;base64,${base64}`;await img.decode();
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,c.width,c.height).data;const colors=new Set();
    for(let i=0;i<data.length;i+=64) colors.add(`${data[i]},${data[i+1]},${data[i+2]}`);
    return colors.size;
  },first.toString('base64'));
  assert(colors>30,`Blank canvas at ${width}: ${colors} colors`);
  await page.mouse.move(width*.7,300);await page.mouse.click(width*.7,300);
  await page.waitForTimeout(400);
  const second=await canvas.screenshot();assert(!first.equals(second),'Animation is frozen');
  await page.screenshot({path:`test-results/shards-${width}.png`});
  assert.equal(await page.locator('.skills').count(),0);
  console.log(`PASS ${width}px: ${colors} canvas colors, rendered animation, removed skill levels`);
}
await browser.close();
