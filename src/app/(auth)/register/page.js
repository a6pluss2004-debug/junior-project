'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerUser } from '@/app/actions/auth';

export default function RegisterPage() {
  // useActionState handles the form submission result
  // null is the initial state
  const [state, action, isPending] = useActionState(registerUser, null);

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Display Error Message if it exists */}
          {state?.error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="text-sm text-red-700">
                  {state.error}
                </div>
              </div>
            </div>
          )}

          <form action={action} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-3"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-3"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-3"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors disabled:bg-blue-300"
              >
                {isPending ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
