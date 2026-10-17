import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const url = process.env.TEST_URL || 'http://127.0.0.1:5180/';
const browser = await chromium.launch({ channel: 'chrome' });
const errors = [];
const context = await browser.newContext();
context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
await fs.mkdir('test-results', { recursive: true });
try {
  const home = await context.newPage();
  await home.goto(`${url}#projects`);
  await home.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
  const newPage = home.waitForEvent('popup');
  await home.locator('.project-detail-button').click();
  const detail = await newPage;
  await expect(detail.locator('.case-hero h1')).toHaveText('Run a B.');
  assert.equal(await home.locator('dialog').count(), 0);
  await detail.close();
  await home.close();

  for (const [width, height] of [[1440, 900], [390, 844], [320, 700]]) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    for (const [slug, name] of [['run-a-b', 'Run a B'], ['reply', 'Reply'], ['speaki', 'Speaki']]) {
      await page.goto(`${url}#/projects/${slug}`);
      await page.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
      await expect(page.locator('.case-hero h1')).toHaveText(`${name}.`);
      assert.equal(await page.locator('.case-section').count(), 6);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug}: overflow at ${width}`);
      await page.getByRole('button', { name: '다음 단계', exact: true }).click();
      await expect(page.locator('.case-demo-controls [role=tab]').nth(1)).toHaveAttribute('aria-selected', 'true');
      await page.locator('.case-demo-controls [role=tab]').nth(1).focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('.case-demo-controls [role=tab]').nth(2)).toHaveAttribute('aria-selected', 'true');
      await page.locator('.case-index a').nth(3).click();
      await expect(page).toHaveURL(new RegExp(`/projects/${slug}/troubleshooting$`));
      await expect.poll(() => page.locator('#case-troubleshooting').evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(110);
      await expect.poll(() => page.locator('#case-troubleshooting').evaluate(element => element.getBoundingClientRect().top)).toBeLessThanOrEqual(160);
      await page.locator('.case-issues details').nth(1).locator('summary').click();
      assert.equal(await page.locator('.case-issues details[open]').count(), 1);
      assert(await page.locator('.case-issues details').nth(1).evaluate(element => element.open));
      await page.reload();
      await page.locator('.page-loader').waitFor({ state: 'detached' });
      await expect.poll(() => page.locator('#case-troubleshooting').evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(110);
      await page.getByRole('button', { name: 'EN', exact: true }).click();
      await expect(page.locator('.case-index')).toContainText('Troubleshooting');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'English overflow');
      await page.getByRole('button', { name: 'KR', exact: true }).click();
      await page.locator('.case-index a').first().click();
      await page.screenshot({ path: `test-results/project-${slug}-${width}.png`, fullPage: true });
      await page.locator('.case-more-grid').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.case-more-grid img')].every(image => image.complete && image.naturalWidth > 0));
      assert(await page.locator('.case-more-grid img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), 'Broken project cover');
      await page.locator('.case-more-grid a').first().click();
      await expect(page.locator('.case-hero h1')).not.toHaveText(`${name}.`);
    }
    await page.locator('.case-more .case-return').click();
    await page.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
    await expect(page.locator('#projects h2')).toHaveText('문제에서 시작한 프로젝트');
    assert.equal(await page.locator('html').evaluate(element => element.classList.contains('is-project-page')), false);
    await page.goto(`${url}#/projects/missing`);
    await expect(page.locator('.case-not-found h1')).toBeVisible();
    await page.close();
    console.log(`PASS ${width}: direct URLs, sections, examples, troubleshooting, languages, project navigation`);
  }
  assert.deepEqual(errors, []);
  console.log('PASS: project details open in a new tab; no dialogs or runtime exceptions');
} finally {
  await browser.close();
}
