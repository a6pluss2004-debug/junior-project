'use client';

import { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment } from '@/app/actions/comment';

export default function CommentList({ taskId, projectId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Load comments on mount
  useEffect(() => {
    async function loadComments() {
      const data = await getComments(taskId, projectId);
      setComments(data);
      setIsLoading(false);
    }
    loadComments();
  }, [taskId, projectId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const result = await addComment({
      taskId,
      projectId,
      text: newComment.trim(),
    });

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
      return;
    }

    // Add comment to list
    if (result?.comment) {
      setComments((prev) => [result.comment, ...prev]);
    }

    setNewComment('');
    setIsSubmitting(false);
  }

  async function handleDelete(commentId) {
    if (!confirm('Delete this comment?')) return;

    setDeletingId(commentId);

    // Optimistic update
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    const result = await deleteComment(commentId, projectId);

    if (result?.error) {
      alert(result.error);
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin h-6 w-6 border-2 border-[#3d348b] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black font-medium outline-none focus:border-[#3d348b] focus:ring-2 focus:ring-[#3d348b]/20 resize-none disabled:opacity-50"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="rounded-lg bg-[#3d348b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2a246a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="group bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#3d348b] text-white text-xs flex items-center justify-center font-semibold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {comment.userName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded p-1 transition-opacity"
                  title="Delete comment"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-800">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
