import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const url = process.env.TEST_URL || 'http://127.0.0.1:5183/';
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error' && /THREE|shader|WebGL/i.test(message.text())) errors.push(message.text());
});
await fs.mkdir('test-results', { recursive: true });

async function checkLayout() {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
  const clipped = await page.locator('.contact-channels a, .project-tabs button, .rubber-segment__item').evaluateAll(elements => elements
    .filter(element => element.getClientRects().length && element.scrollWidth > element.clientWidth + 1)
    .map(element => element.textContent));
  assert.deepEqual(clipped, [], 'Clipped control text');
}

try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 700]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${url}#about`);
    await page.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
    await expect(page.locator('#about')).toHaveCSS('opacity', '1');
    await expect(page.locator('.main-links a').first()).toHaveCSS('backdrop-filter', /blur/);
    await checkLayout();
    await page.screenshot({ path: `test-results/glass-about-${width}.png` });

    await page.locator('#projects').scrollIntoViewIfNeeded();
    await expect(page.locator('#projects')).toHaveCSS('background-color', 'rgb(237, 241, 236)');
    await expect(page.locator('#projects')).toHaveCSS('background-image', 'none');
    await expect(page.locator('#projects')).toHaveCSS('padding-top', width <= 700 ? '58px' : '96px');
    await expect(page.locator('#projects h2')).toHaveCSS('font-weight', '650');
    await expect(page.locator('#projects .section-label')).toHaveCSS('margin-bottom', width <= 700 ? '27px' : '34px');
    await expect(page.locator('.project-tabs')).toHaveCSS('background-image', 'none');
    await expect(page.locator('.project-tabs button').first()).toHaveCSS('border-radius', '0px');
    await expect(page.locator('.project-detail-button')).toHaveCSS('backdrop-filter', 'none');
    await checkLayout();

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('.contact-channels')).toBeVisible();
    await expect(page.locator('.contact-linkedin')).toHaveCSS('backdrop-filter', /blur/);
    await expect(page.locator('.mail')).toHaveAttribute('href', 'mailto:mineiris@naver.com');
    await checkLayout();
    await page.screenshot({ path: `test-results/glass-contact-${width}.png` });
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await checkLayout();
    await page.getByRole('button', { name: 'KR', exact: true }).click();

    await page.goto(`${url}#/reviews`);
    await expect(page.locator('.search')).toHaveCSS('backdrop-filter', /blur/);
    await page.getByRole('textbox').fill('Flashattention');
    await expect(page.locator('.review-row')).toHaveCount(3);
    await checkLayout();
    await page.screenshot({ path: `test-results/glass-reading-${width}.png` });

    await page.goto(`${url}#/projects/run-a-b`);
    await expect(page.locator('.case-hero h1')).toHaveCSS('font-weight', '650');
    await expect(page.locator('.case-study')).toHaveCSS('color', 'rgb(28, 33, 30)');
    await expect(page.locator('.case-topbar')).toHaveCSS('backdrop-filter', 'blur(16px)');
    await expect(page.locator('.case-demo-screen')).toHaveCSS('backdrop-filter', 'none');
    await expect(page.locator('.case-demo-screen')).toHaveCSS('background-color', 'rgba(255, 255, 255, 0.95)');
    await checkLayout();
    console.log(`PASS ${width}: glass surfaces, layouts, languages, original project designs preserved`);
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
