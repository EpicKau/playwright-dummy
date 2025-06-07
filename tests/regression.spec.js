// @ts-check
import { test, expect } from '@playwright/test';

const targetUrl = process.env.URL || 'https://parsmedia.info';

test.describe('regression tests', () => {
  test('regression test image', async ({ page }) => {
    await page.goto(targetUrl)
    await expect(page).toHaveScreenshot({fullPage: true})
  })

  test('regression test html', async ({ page }) => {
    await page.goto(targetUrl)
    const htmlContent = await page.content()
    expect(htmlContent).toMatchSnapshot('page-content.html', {
      threshold: 0.1
    })
  })

})