'use client';

import { logout } from '@/app/actions/auth';

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="group relative overflow-hidden rounded-xl px-5 py-2.5 font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8d4c]"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff8d4c] to-[#ff6b35]"></div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35] to-[#ff8d4c] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <span className="relative flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </span>
    </button>
  );
}
