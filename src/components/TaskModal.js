'use client';

import { useEffect } from 'react';

export default function TaskModal({ task, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700 bg-slate-900/80 p-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                {task.column === 'todo' && 'To Do'}
                {task.column === 'inprogress' && 'In Progress'}
                {task.column === 'done' && 'Done'}
              </span>
              <span className="text-xs text-slate-400">
                Created {new Date(task.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description
            </h3>
            {task.description ? (
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-slate-500 italic">No description provided.</p>
            )}
          </div>

          {/* Task Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
              <p className="text-xs font-semibold text-slate-400 mb-1">Task ID</p>
              <p className="text-sm text-slate-200 font-mono truncate">{task.id}</p>
            </div>
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4">
              <p className="text-xs font-semibold text-slate-400 mb-1">Order</p>
              <p className="text-sm text-slate-200">#{task.order}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 bg-slate-900/80 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            onClick={() => alert('Edit feature coming soon!')}
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
}
