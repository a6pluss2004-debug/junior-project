import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // مسار مشروع Next.js الخاص بك
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // الحل: تجاهل مجلد اختبارات Playwright ومجلد المكتبات
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/'
  ],
}

export default createJestConfig(config)