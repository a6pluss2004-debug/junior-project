// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* تشغيل الاختبارات بشكل متوازي */
  fullyParallel: true,
  /* الفشل في الـ CI إذا نسينا test.only */
  forbidOnly: !!process.env.CI,
  /* إعادة المحاولة في الـ CI فقط */
  retries: process.env.CI ? 2 : 0,
  /* عدد العمال (Workers) */
  workers: process.env.CI ? 1 : undefined,
  /* نوع التقرير الناتج */
  reporter: 'html',
  
  use: {
    /* العنوان الأساسي للموقع */
    baseURL: 'http://localhost:3000',
    /* تسجيل خطوات الاختبار عند الفشل */
    trace: 'on-first-retry',
  },

  /* إعدادات المتصفحات */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* تم تعطيل Firefox و Webkit لتجنب أخطاء التحميل لديك */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* تشغيل السيرفر تلقائياً قبل بدء الاختبارات */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // وقت إضافي للتشغيل
  },
});