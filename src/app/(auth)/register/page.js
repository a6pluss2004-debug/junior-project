'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { registerUser } from '@/app/actions/auth';

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerUser, null);

  return (
    <div className="animate-fade-in-up">
      {/* Premium Logo Section */}
      <div className="text-center mb-10">
        <div className="relative mx-auto w-24 h-24 mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#3d348b] via-[#78e0dc] to-[#ff8d4c] animate-spin-slow opacity-80"></div>
          {/* Middle ring */}
          <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#1a1640] to-[#3d348b]"></div>
          {/* Inner content */}
          <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#3d348b] to-[#1a1640] flex items-center justify-center backdrop-blur-xl">
            <svg className="w-12 h-12 text-[#78e0dc] drop-shadow-[0_0_8px_rgba(120,224,220,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight bg-gradient-to-r from-white via-[#78e0dc] to-white bg-clip-text text-transparent animate-gradient-x">
          Join Us Today
        </h1>
        <p className="text-lg text-white/80 font-medium">
          Already a member?{' '}
          <Link 
            href="/login" 
            className="font-bold text-[#78e0dc] hover:text-[#8de8e4] transition-all duration-300 hover:underline underline-offset-4 inline-flex items-center gap-1.5 group relative"
          >
            <span className="relative z-10">Sign in</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="absolute inset-0 bg-[#78e0dc]/10 rounded-lg blur-xl scale-0 group-hover:scale-100 transition-transform duration-300"></span>
          </Link>
        </p>
      </div>

      {/* Premium Glass Card */}
      <div className="relative group">
        {/* Animated border gradient */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-[#3d348b]/50 via-[#78e0dc]/50 to-[#ff8d4c]/50 rounded-[28px] opacity-0 group-hover:opacity-100 blur-sm transition-all duration-700"></div>
        
        {/* Main glass card */}
        <div className="relative bg-gradient-to-br from-white/[0.15] to-white/[0.05] backdrop-blur-2xl rounded-[26px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 p-10 sm:p-12 overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-[26px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>

          {/* Error Alert */}
          {state?.error && (
            <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 p-5 animate-shake-smooth shadow-lg shadow-red-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-semibold text-red-100 flex-1 leading-relaxed">
                  {state.error}
                </p>
              </div>
            </div>
          )}

          <form action={action} className="relative z-10 space-y-6">
            {/* Name Input with Floating Label */}
            <div className="relative group/input">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder=" "
                className="peer block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 px-5 text-white text-base font-medium placeholder-transparent focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              />
              <label
                htmlFor="name"
                className="absolute left-5 -top-3 text-sm font-bold text-white/70 bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] px-2 rounded-lg transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#78e0dc] peer-focus:bg-gradient-to-r peer-focus:from-[#3d348b] peer-focus:to-[#5b4fa3]"
              >
                Full Name
              </label>
              {/* Icon */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-white/30 peer-focus-within:text-[#78e0dc] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Email Input with Floating Label */}
            <div className="relative group/input">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder=" "
                className="peer block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 px-5 text-white text-base font-medium placeholder-transparent focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              />
              <label
                htmlFor="email"
                className="absolute left-5 -top-3 text-sm font-bold text-white/70 bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] px-2 rounded-lg transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#78e0dc] peer-focus:bg-gradient-to-r peer-focus:from-[#3d348b] peer-focus:to-[#5b4fa3]"
              >
                Email Address
              </label>
              {/* Icon */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-white/30 peer-focus-within:text-[#78e0dc] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Password Input with Floating Label */}
            <div className="relative group/input">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder=" "
                className="peer block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 px-5 text-white text-base font-medium placeholder-transparent focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
              />
              <label
                htmlFor="password"
                className="absolute left-5 -top-3 text-sm font-bold text-white/70 bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] px-2 rounded-lg transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#78e0dc] peer-focus:bg-gradient-to-r peer-focus:from-[#3d348b] peer-focus:to-[#5b4fa3]"
              >
                Password
              </label>
              {/* Icon */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-5 w-5 text-white/30 peer-focus-within:text-[#78e0dc] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Premium Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="group/button relative w-full overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3d348b]"
              >
                {/* Gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#3d348b] via-[#5a4d9f] to-[#3d348b] bg-[length:200%_100%] group-hover/button:animate-gradient-x"></div>
                
                {/* Inner button */}
                <div className="relative m-[2px] rounded-[14px] bg-gradient-to-r from-[#3d348b] to-[#5a4d9f] px-8 py-5 transition-all duration-300 group-hover/button:shadow-[0_0_40px_rgba(61,52,139,0.4)]">
                  <span className="relative flex items-center justify-center gap-3 text-lg font-black text-white tracking-wide uppercase">
                    {isPending ? (
                      <>
                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg className="w-6 h-6 group-hover/button:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
