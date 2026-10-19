import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';

const url = process.env.TEST_URL || 'http://127.0.0.1:5187/';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));

async function destination(selector) {
  return page.locator(selector).evaluate(element => {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = element.getBoundingClientRect().top + scrollY - padding;
    return Math.max(0, Math.min(top, document.documentElement.scrollHeight - innerHeight));
  });
}

async function settledAt(selector) {
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - await destination(selector)), { timeout: 8000 }).toBeLessThan(3);
}

async function choose(name) {
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  if (await menu.isVisible() && await menu.getAttribute('aria-expanded') === 'false') await menu.click();
  await page.getByRole('radio', { name, exact: true }).click();
}

async function smoothNavigation(name, selector) {
  const start = await page.evaluate(() => {
    window.navigationSamples = [];
    const collect = time => {
      window.navigationSamples.push({ time, y: scrollY });
      window.navigationFrame = requestAnimationFrame(collect);
    };
    window.navigationFrame = requestAnimationFrame(collect);
    return scrollY;
  });
  const end = await destination(selector);
  await choose(name);
  await settledAt(selector);
  const samples = await page.evaluate(() => {
    cancelAnimationFrame(window.navigationFrame);
    return window.navigationSamples;
  });
  const intermediate = new Set(samples.filter(sample => sample.y > Math.min(start, end) + 3 && sample.y < Math.max(start, end) - 3).map(sample => sample.y));
  assert(intermediate.size >= 4, `${name}: navigation jumped instead of scrolling (${intermediate.size} intermediate positions)`);
  const direction = Math.sign(end - start);
  assert(samples.every((sample, index) => index === 0 || (sample.y - samples[index - 1].y) * direction >= -3), `${name}: scroll reversed unexpectedly`);
  await expect(page.getByRole('radio', { name, exact: true, includeHidden: true })).toHaveAttribute('aria-checked', 'true');
}

try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844]]) {
    await page.setViewportSize({ width, height });
    const entry = new URL(url);
    entry.searchParams.set('navigation-test', String(width));
    entry.hash = 'about';
    await page.goto(entry.href);
    await page.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
    await expect(page.locator('#about')).toHaveCSS('opacity', '1');
    await settledAt('#about');
    await smoothNavigation('프로젝트', '#projects');
    await smoothNavigation('연락', '#contact');
    await smoothNavigation('소개', '#about');

    await page.goBack();
    await expect(page).toHaveURL(/#contact$/);
    await settledAt('#contact');
    await page.goForward();
    await expect(page).toHaveURL(/#about$/);
    await settledAt('#about');

    await choose('연락');
    await page.waitForTimeout(100);
    await choose('프로젝트');
    await settledAt('#projects');
    await expect(page).toHaveURL(/#projects$/);

    await choose('논문 기록');
    await expect(page.locator('.archive h1')).toContainText('Study Archive');
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page.locator('main')).toHaveCSS('opacity', '1');
    await choose('프로젝트');
    await settledAt('#projects');
    await expect(page.locator('main')).toHaveCSS('opacity', '1');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow');
    console.log(`PASS ${width}: continuous scroll, rapid selections, browser history, archive round trip`);
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${url}#about`);
  await page.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
  await settledAt('#about');
  await choose('연락');
  await settledAt('#contact');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await choose('논문 기록');
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  assert.deepEqual(errors, []);
  console.log('PASS: reduced-motion preference and no runtime errors');
} finally {
  await browser.close();
}
