'use client';

import { deleteProject } from '@/app/actions/project';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProjectButton({ projectId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Delete this project? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteProject(projectId);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
      return;
    }

    // Refresh the page data without full reload
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || isPending}
      className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 disabled:opacity-50"
      title="Delete project"
    >
      {isDeleting || isPending ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}
