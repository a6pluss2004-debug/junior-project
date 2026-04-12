// 1. تعريف الـ Mocks أولاً (قبل الـ imports) لمنع Jest من محاولة فتح ملف قاعدة البيانات الحقيقي
jest.mock('../src/lib/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../src/models/User', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('../src/lib/session', () => ({
  encrypt: jest.fn(() => Promise.resolve('mocked_session_token')),
}));

// 2. الآن نقوم بعمل الـ imports للدوال التي نريد اختبارها
import { registerUser, loginUser } from '../src/app/actions/auth';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

describe('اختبارات نظام المصادقة (Auth Actions)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // تنظيف المحاكاة قبل كل اختبار لضمان دقة النتائج
  });

  test('يجب أن يرفض التسجيل إذا كانت الحقول فارغة', async () => {
    const formData = new FormData(); 
    const result = await registerUser({}, formData);
    
    expect(result.error).toBe('Please fill in all fields');
  });

  test('يجب أن يرفض التسجيل إذا كان الإيميل مستخدماً مسبقاً', async () => {
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'exists@test.com');
    formData.append('password', '123456');

    // محاكاة إرجاع مستخدم موجود عند البحث عنه
    User.findOne.mockResolvedValue({ email: 'exists@test.com' });

    const result = await registerUser({}, formData);
    expect(result.error).toBe('Email is already registered');
  });

  test('يجب أن يفشل تسجيل الدخول عند إدخال كلمة سر خاطئة', async () => {
    const formData = new FormData();
    formData.append('email', 'user@test.com');
    formData.append('password', 'wrong_pass');

    // محاكاة وجود المستخدم ولكن بكلمة سر مختلفة
    User.findOne.mockResolvedValue({ email: 'user@test.com', password: 'hashed_password' });
    bcrypt.compare.mockResolvedValue(false); 

    const result = await loginUser({}, formData);
    expect(result.error).toBe('Invalid email or password.');
  });
});