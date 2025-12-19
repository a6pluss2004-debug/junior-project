'use client';

import { deleteTask } from '@/app/actions/task';
import { useState } from 'react';

export default function TaskCard({ task, projectId, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Delete this task?')) {
      return;
    }

    setIsDeleting(true);

    // Optimistic update: remove from UI immediately
    if (onDeleted) {
      onDeleted(task.id);
    }

    const result = await deleteTask(task.id, projectId);

    if (result?.error) {
      alert(result.error);
      setIsDeleting(false);
      // If error, page will refresh via revalidatePath to restore correct state
    }
    // If success, no need to do anything - UI already updated
  }

  return (
    <div className="group relative rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
      <h4 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 rounded-lg p-1 hover:bg-red-50 text-red-500 transition-opacity disabled:opacity-50"
        title="Delete task"
      >
        {isDeleting ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>
    </div>
  );
}
