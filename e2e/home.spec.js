const { test, expect } = require('@playwright/test');

test('Check Homepage', async ({ page }) => {
  await page.goto('/'); // Playwright بياخد الـ BaseURL من الإعدادات
  await expect(page).toBeVisible; 
});
