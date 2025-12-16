'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function registerUser(prevState, formData) {
  // 1. Get data from form
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  // 2. Basic Validation
  if (!name || !email || !password) {
    return { error: 'Please fill in all fields' };
  }

  try {
    // 3. Connect to DB
    await connectDB();

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email is already registered' };
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  // 7. Redirect to login on success
  // Note: We do this outside the try/catch because redirect throws an error internally in Next.js
  redirect('/login');
}

export async function loginUser(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Basic validation
  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  try {
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    // Compare password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid email or password.' };
    }

    // TODO: real app should create a session / JWT here
    // For now, just redirect to a dashboard
    
  } catch (error) {
    console.error('Login Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
  redirect('/dashboard');
}