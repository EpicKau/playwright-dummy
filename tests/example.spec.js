// @ts-check
import { test, expect } from '@playwright/test';


const TARGET_URL = process.env.URL || 'https://www.google.com';

const expectMetaTag = async (selector, attribute, expectedContent) => {
  const locator = page.locator(`meta[${selector}]`);
  await expect(locator, `Meta tag with selector "${selector}" should exist.`).toHaveCount(1);
  if (expectedContent) {
    await expect(locator, `Meta tag "${selector}" should have correct content.`).toHaveAttribute('content', expectedContent);
  }
};

test.describe('Generic Page Checks', () => {
  let page

  // This block runs before all tests in this describe block.
  // It navigates to the target URL and handles potential navigation errors.
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    page = await context.newPage()
    
    page.on('pageerror', (error) => {
      console.error(`Uncaught page error: ${error}`)
    });

    try {
      await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      throw new Error(`Failed to navigate to ${TARGET_URL}. Error: ${error}`)
    }
  })

  test.afterAll(async () => {
    await page.close()
  });

  test('should load successfully and have content', async () => {
    const response = await page.goto(TARGET_URL)
    expect(response?.ok(), 'Response should be OK (status 200-299)').toBe(true)
    
    // Check if the body element is not empty.
    const bodyContent = await page.locator('body').innerText()
    expect(bodyContent.trim(), 'Body should not be empty').not.toBe('')
  })

  test('has title tag', async () => {
    const title = await page.title();
    expect(title).not.toBe('');
  })

  test('should have essential meta tags', async () => {
    // Check for the 'description' meta tag
    await expectMetaTag('name="description"','content')

    //check robots?
    await expectMetaTag('name="robots"','content')

    // Check for the 'viewport' meta tag, which is crucial for responsive design
    await expectMetaTag('name="viewport"', 'content', 'width=device-width, initial-scale=1.0')
  })

  test('should have open graph tags', async () => {
    // Check for the 'title' meta tag
    await expectMetaTag('name="og:title"', 'content')

    // Check for the 'description' meta tag
    await expectMetaTag('name="og:description"', 'content')
  })

  test('should not have JavaScript errors', async () => {
    const errors = []
    page.on('pageerror', (error) => {
      errors.push(error)
    });

    // Reload the page to capture any errors that occur on load.
    await page.reload({ waitUntil: 'domcontentloaded' })

    // Assert that the errors array is empty.
    // If it's not, the test will fail and log the captured errors.
    expect(errors, `The page should have no JavaScript errors. Found: ${errors.map(e => e.message).join(', ')}`).toHaveLength(0)
  })

  test('regression test', async () => {
    await expect(page).toHaveScreenshot({fullPage: true})
  })

})