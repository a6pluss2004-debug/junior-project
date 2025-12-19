'use client';

import { useState } from 'react';
import { createColumn } from '@/app/actions/project';

export default function AddColumnForm({ projectId, onCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const title = formData.get('title');

    const result = await createColumn(projectId, title);

    if (result.error) {
      alert(result.error);
      setIsSubmitting(false);
      return;
    }

    if (onCreated && result.column) {
      onCreated(result.column);
    }

    setIsOpen(false);
    setIsSubmitting(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-full w-80 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-[#78e0dc] hover:bg-[#78e0dc]/5 hover:text-[#78e0dc] transition-all"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-semibold">Add Column</span>
        </div>
      </button>
    );
  }

  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-xl bg-white shadow-md border border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title"
          type="text"
          placeholder="Column name..."
          required
          autoFocus
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#78e0dc]"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-[#3d348b] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2a246a] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
