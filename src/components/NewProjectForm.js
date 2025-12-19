'use client';

import { useActionState } from 'react';
import { createProject } from '@/app/actions/project';

export default function NewProjectForm() {
  const [state, action, isPending] = useActionState(createProject, null);

  return (
    <div className="relative group">
      {/* Glow border */}
      <div className="absolute -inset-[2px] bg-gradient-to-r from-[#78e0dc]/50 via-[#ff8d4c]/50 to-[#3d348b]/50 rounded-[28px] opacity-0 group-hover:opacity-100 blur-sm transition-all duration-700"></div>
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-white/[0.15] to-white/[0.05] backdrop-blur-2xl rounded-[26px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 p-8 overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-[26px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>

        {/* Header */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#78e0dc] to-[#3d348b] flex items-center justify-center shadow-lg shadow-[#78e0dc]/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white">New Project</h2>
          </div>
          <p className="text-sm text-white/70 font-medium">Create something amazing</p>
        </div>

        {/* Success message */}
        {state?.message && (
          <div className="relative mb-6 rounded-2xl bg-gradient-to-r from-[#78e0dc]/20 to-[#78e0dc]/10 backdrop-blur-sm border border-[#78e0dc]/30 p-4 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-[#78e0dc]/30 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-semibold text-white flex-1">
                {state.message}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form action={action} className="relative z-10 space-y-5">
          {/* ✅ Hidden input - always use "blank" template */}
          <input type="hidden" name="templateId" value="blank" />

          {/* Title Input */}
          <div className="relative group/input">
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder=" "
              className="peer block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 pl-5 pr-12 text-white text-base font-medium placeholder-transparent focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
            />
            <label
              htmlFor="title"
              className="absolute left-5 -top-3 text-sm font-bold text-white bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] px-2 rounded-lg transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#78e0dc] peer-focus:bg-gradient-to-r peer-focus:from-[#3d348b] peer-focus:to-[#5b4fa3]"
            >
              Project Title
            </label>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="h-5 w-5 text-white/30 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="relative group/input">
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder=" "
              className="peer block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 pl-5 pr-12 text-white text-base font-medium placeholder-transparent focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] resize-none"
            />
            <label
              htmlFor="description"
              className="absolute left-5 -top-3 text-sm font-bold text-white bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] px-2 rounded-lg transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#78e0dc] peer-focus:bg-gradient-to-r peer-focus:from-[#3d348b] peer-focus:to-[#5b4fa3]"
            >
              Description (Optional)
            </label>
            <div className="absolute right-5 top-5 pointer-events-none">
              <svg className="h-5 w-5 text-white/30 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="group/button relative w-full overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78e0dc] mt-6"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#78e0dc] via-[#3d348b] to-[#78e0dc] bg-[length:200%_100%] group-hover/button:animate-gradient-x"></div>
            <div className="relative m-[2px] rounded-[14px] bg-gradient-to-r from-[#78e0dc] to-[#3d348b] px-6 py-4 transition-all duration-300 group-hover/button:shadow-[0_0_40px_rgba(120,224,220,0.4)]">
              <span className="relative flex items-center justify-center gap-2 text-base font-black text-white tracking-wide uppercase">
                {isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Project
                  </>
                )}
              </span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
