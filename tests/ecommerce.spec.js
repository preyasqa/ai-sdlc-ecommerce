const { test, expect } = require('@playwright/test');

test('home page loads with products and cart interaction', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('AI SDLC Store');
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.locator('.product-card button').first().click();
  await expect(page.locator('#cart-count')).toHaveText('1');

  await page.click('#view-cart-button');
  await expect(page.locator('#cart-dialog')).toBeVisible();
  await expect(page.locator('.cart-item')).toHaveCount(1);
});

test('checkout flow submits order successfully', async ({ page }) => {
  await page.goto('/');
  await page.locator('.product-card button').first().click();
  await page.click('#view-cart-button');
  await page.click('#checkout-button');
  await expect(page.locator('#checkout-dialog')).toBeVisible();

  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('textarea[name="address"]', '123 Main Street');
  await page.click('#checkout-form button[type="submit"]');

  await expect(page.locator('.order-response')).toHaveText(/Thank you, Test User!/);
});

test('api checkout returns validation error for empty cart', async ({ request }) => {
  const response = await request.post('http://localhost:3000/api/checkout', {
    data: {
      cart: [],
      customer: { name: 'Test User', email: 'test@example.com' }
    }
  });
  await expect(response.status()).toBe(400);
  const body = await response.json();
  await expect(body.error).toBe('Cart cannot be empty.');
});
