'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/session';

// --- 1. REGISTER USER ---
export async function registerUser(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!name || !email || !password) {
    return { error: 'Please fill in all fields' };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email is already registered' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  redirect('/login');
}

// --- 2. LOGIN USER ---
export async function loginUser(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid email or password.' };
    }

    // --- CRITICAL FIX START ---
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({
      userId: user._id.toString(), // <--- FIX: Added .toString()
      name: user.name,
      email: user.email,
    });
    // --- CRITICAL FIX END ---

    (await cookies()).set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expires,
      path: '/',
    });

  } catch (error) {
    console.error('Login Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  redirect('/dashboard');
}

// --- 3. LOGOUT USER ---
export async function logout() {
  (await cookies()).delete('session');
  redirect('/login');
}
