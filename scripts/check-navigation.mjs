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

async function selected(name) {
  await expect(page.getByRole('radio', { name, exact: true, includeHidden: true })).toHaveAttribute('aria-checked', 'true');
}

async function manualScroll(selector, name, wheel = false) {
  const before = await page.evaluate(() => ({ hash: location.hash, history: history.length, y: scrollY }));
  const top = await destination(selector);
  if (wheel) {
    const { width, height } = page.viewportSize();
    await page.mouse.move(width - 8, height / 2);
    await page.mouse.wheel(0, Math.round(top - before.y));
  } else await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
  await settledAt(selector);
  await selected(name);
  assert.deepEqual(await page.evaluate(() => ({ hash: location.hash, history: history.length })), { hash: before.hash, history: before.history }, 'Scroll tracking must not navigate or add history entries');
}

async function smoothNavigation(name, selector) {
  const start = await page.evaluate(() => {
    window.navigationSamples = [];
    const collect = time => {
      window.navigationSamples.push({ time, y: scrollY, hash: location.hash, selected: document.querySelector('.scroll-header [aria-checked=true]')?.textContent.trim() });
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
  await selected(name);
  const committed = samples.findIndex(sample => sample.hash === selector && sample.selected === name);
  assert(committed >= 0 && samples.slice(committed).every(sample => sample.selected === name), `${name}: selected indicator flickered during smooth navigation`);
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
    await manualScroll('#projects', '프로젝트', true);
    await manualScroll('#contact', '연락');
    await manualScroll('#reading', '논문 기록');
    await expect(page.locator('.archive')).toHaveCount(0);
    await choose('논문 기록');
    await expect(page.locator('.archive h1')).toContainText('Study Archive');
    await selected('논문 기록');
    await choose('소개');
    await settledAt('#about');
    await manualScroll('#contact', '연락');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await selected('연락');
    await manualScroll('#about', '소개');
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
    console.log(`PASS ${width}: scroll tracking without history changes, stable selection, continuous scroll, rapid selections, browser history, archive round trip`);
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${url}#about`);
  await page.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
  await settledAt('#about');
  await manualScroll('#projects', '프로젝트');
  await manualScroll('#reading', '논문 기록');
  await manualScroll('#about', '소개');
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
