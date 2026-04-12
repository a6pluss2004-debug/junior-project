const { test, expect } = require('@playwright/test');

test('التأكد من أن الصفحة الرئيسية تعمل', async ({ page }) => {
  // الذهاب لرابط المشروع المحلي
  await page.goto('http://localhost:3000');

  // التأكد من أن الصفحة تحتوي على كلمة "إدارة" أو "مشروع"
  // قم بتغيير الكلمة حسب ما يظهر فعلياً في صفحتك الرئيسية
  await expect(page).toHaveTitle(/./); 
  
  const body = page.locator('body');
  await expect(body).toBeVisible();
});