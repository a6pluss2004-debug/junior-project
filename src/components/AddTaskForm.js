'use client';

import { useState } from 'react';
import { createTask } from '@/app/actions/task';

export default function AddTaskForm({ projectId, column, onCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const result = await createTask(formData);
    
    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
      return;
    }

    // Optimistic update: add task to UI immediately
    if (onCreated && result?.task) {
      onCreated(result.task);
    }

    // Reset form
    e.target.reset();
    setIsOpen(false);
    setIsSubmitting(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-gray-200 p-3 text-sm font-medium text-gray-400 hover:border-[#78e0dc] hover:text-[#78e0dc] transition-colors"
      >
        + Add Card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-gray-200 bg-white p-3">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="column" value={column} />

      {/* ✅ UPDATED: Added text-black font-medium */}
      <input
        name="title"
        type="text"
        placeholder="Task title..."
        required
        autoFocus
        disabled={isSubmitting}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black font-medium outline-none focus:border-[#78e0dc] disabled:opacity-50"
      />

      {/* ✅ UPDATED: Added text-black font-medium */}
      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        disabled={isSubmitting}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-black font-medium outline-none focus:border-[#78e0dc] resize-none disabled:opacity-50"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-[#3d348b] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2a246a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          disabled={isSubmitting}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
