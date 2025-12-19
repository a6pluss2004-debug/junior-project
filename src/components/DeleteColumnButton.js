'use client';

import { deleteColumn } from '@/app/actions/project';
import { useState } from 'react';

export default function DeleteColumnButton({ columnId, projectId, columnTitle, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete column "${columnTitle}"? All tasks in this column will remain but need reassignment.`)) {
      return;
    }

    setIsDeleting(true);

    // Optimistic update: remove from UI immediately
    if (onDeleted) {
      onDeleted(columnId);
    }

    const result = await deleteColumn(columnId, projectId);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
      // If error, the page will refresh via revalidatePath to restore correct state
    }
    // If success, no need to do anything - UI already updated
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1 rounded text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Delete column"
    >
      {isDeleting ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
}
