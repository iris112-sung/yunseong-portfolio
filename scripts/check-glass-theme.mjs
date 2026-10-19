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
  const clipped = await page.locator('.contact-channels a, .contact-channels a>span, .project-tabs button, .rubber-segment__item').evaluateAll(elements => elements
    .filter(element => element.getClientRects().length && element.scrollWidth > element.clientWidth + 1)
    .map(element => element.textContent));
  assert.deepEqual(clipped, [], 'Clipped control text');
}

async function checkRoundedGlass(selector, width) {
  await expect(page.locator(selector)).toHaveCSS('border-radius', width <= 700 ? '28px' : '48px');
  const surface = await page.locator(selector).evaluate(element => {
    const style = getComputedStyle(element, '::before');
    return { content: style.content, background: style.backgroundImage, blur: style.backdropFilter, width: element.getBoundingClientRect().width };
  });
  assert.equal(surface.width, width, 'Sections should remain full-width bands');
  assert.notEqual(surface.content, 'none', 'Missing rounded glass surface');
  assert(surface.background.startsWith('linear-gradient(90deg'), 'No diagonal decoration');
  assert(surface.blur.includes('blur'), 'Glass blur should remain');
}

async function checkVisibleInk(selector) {
  const screenshot = await page.locator(selector).screenshot();
  const darkPixels = await page.evaluate(async data => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) if (Math.max(pixels[i], pixels[i + 1], pixels[i + 2]) < 140) count++;
    return count;
  }, screenshot.toString('base64'));
  assert(darkPixels > 100, `${selector}: text is obscured by a glass layer`);
}

try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844], [320, 700]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${url}#about`);
    await page.locator('.page-loader').waitFor({ state: 'detached', timeout: 15000 });
    await expect(page.locator('#about')).toHaveCSS('opacity', '1');
    await checkRoundedGlass('#about', width);
    await expect(page.locator('.main-links a').first()).toHaveCSS('backdrop-filter', /blur/);
    await expect(page.locator('.about-copy>p').last()).toHaveCSS('font-size', width <= 700 ? '15px' : width <= 1000 ? '17px' : '18px');
    await expect(page.locator('#about h2')).toHaveCSS('font-weight', '750');
    await expect(page.locator('.scroll-header')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator('.scroll-header')).toHaveCSS('background-image', 'none');
    await expect(page.locator('.scroll-header')).toHaveCSS('backdrop-filter', 'none');
    await expect(page.locator('.scroll-header')).toHaveCSS('filter', 'none');
    await expect(page.locator('.scroll-header')).toHaveCSS('will-change', 'transform');
    await expect(page.locator('.scroll-header')).toHaveCSS('box-shadow', 'none');
    await expect(page.locator('.scroll-header')).toHaveCSS('border-bottom-width', '0px');
    const floating = await page.locator('.floating-navigation').evaluate(element => {
      const style = getComputedStyle(element, '::before');
      const bounds = element.getBoundingClientRect();
      return { blur: style.backdropFilter, background: style.backgroundImage, left: parseFloat(style.left), width: bounds.width, center: bounds.x + bounds.width / 2 };
    });
    assert(floating.blur.includes('blur') && floating.background.includes('linear-gradient'), 'Missing floating glass surface');
    assert(floating.width < width - 20 && Math.abs(floating.center - width / 2) < 1, 'Glass navigation must float in the center');
    assert.equal(floating.left, width > 700 ? -16 : 0, 'Only the desktop name-side glass edge should extend to the left');
    await expect(page.locator('.scroll-header .rubber-segment__thumb')).toHaveCSS('background-color', 'rgba(105, 75, 130, 0.87)');
    await expect(page.locator('.scroll-header .rubber-segment__thumb')).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(page.locator('.rubber-segment__item').first()).toHaveCSS('font-size', width <= 700 ? '13px' : '14px');
    const typography = await page.locator('.about-copy>p').last().evaluate(element => {
      const style = getComputedStyle(element);
      return { lineHeight: parseFloat(style.lineHeight) / parseFloat(style.fontSize), spacing: parseFloat(style.letterSpacing) || 0 };
    });
    assert(typography.lineHeight <= 1.7, 'Body leading should stay compact');
    assert.equal(typography.spacing, 0, 'No added tracking');
    await checkLayout();
    await page.screenshot({ path: `test-results/glass-about-${width}.png` });
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    const name = await page.locator('#about h2').evaluate(element => {
      const style = getComputedStyle(element);
      const context = document.createElement('canvas').getContext('2d');
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      return { wordWidth: context.measureText('Yunseong').width, containerWidth: element.clientWidth };
    });
    assert(name.wordWidth <= name.containerWidth, 'The name should not break inside a word');
    await checkLayout();
    await page.screenshot({ path: `test-results/glass-about-en-${width}.png` });
    if (width <= 700) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await expect(page.locator('.scroll-header nav')).toHaveCSS('background-image', 'none');
      await expect(page.locator('.scroll-header nav')).toHaveCSS('backdrop-filter', 'none');
      await checkLayout();
      await page.screenshot({ path: `test-results/glass-navigation-en-${width}.png` });
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
    }
    await page.getByRole('button', { name: 'KR', exact: true }).click();

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
    await checkRoundedGlass('#contact', width);
    await checkVisibleInk('#contact h2');
    await expect(page.locator('.contact-linkedin')).toHaveCSS('backdrop-filter', /blur/);
    await expect(page.locator('.mail')).toHaveCSS('font-size', width <= 360 ? '20px' : width <= 1000 ? '22px' : '24px');
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
