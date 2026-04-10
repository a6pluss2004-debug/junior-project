'use client';

import { useState, useEffect } from 'react';
import { updateTask } from '@/app/actions/task';
import CommentList from '@/components/CommentList';
import AttachmentList from '@/components/AttachmentList';
import AssigneeSelector from '@/components/AssigneeSelector';

export default function EditTaskModal({ task, onClose, onUpdated, userRole }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAssigneeId, setCurrentAssigneeId] = useState(task.assignedTo);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await updateTask({
      taskId: task.id,
      projectId: task.projectId,
      title,
      description,
      deadline: deadline && deadline.trim() !== '' ? deadline : null,
    });

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
      return;
    }

    if (onUpdated && result?.task) {
      onUpdated(result.task);
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Glass Modal */}
        <div className="relative group">
          {/* Animated border gradient */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-[#78e0dc]/50 via-[#ff8d4c]/50 to-[#3d348b]/50 rounded-[28px] blur-sm"></div>
          
          {/* Main glass card */}
          <div className="relative bg-gradient-to-br from-[#3d348b]/95 to-[#1a1640]/95 backdrop-blur-2xl rounded-[26px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#78e0dc] to-[#5bcac6] flex items-center justify-center shadow-lg shadow-[#78e0dc]/30">
                      <svg className="w-5 h-5 text-[#3d348b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Edit Task</h2>
                      <p className="text-sm text-white/70 font-medium">Update task details and settings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4">
                    <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white border border-white/20">
                      {task.column === 'todo' && '📋 To Do'}
                      {task.column === 'inprogress' && '⚡ In Progress'}
                      {task.column === 'done' && '✅ Done'}
                    </span>
                    <span className="text-xs text-white/60 font-medium">
                      Created {new Date(task.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div className="relative group/input">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                    disabled={isSubmitting}
                    placeholder=" "
                    className="peer block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 px-5 text-white text-base font-medium placeholder-transparent focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] disabled:opacity-50"
                  />
                  <label
                    htmlFor="title"
                    className="absolute left-5 -top-3 text-sm font-bold text-white/70 bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] px-2 rounded-lg transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#78e0dc] peer-focus:bg-gradient-to-r peer-focus:from-[#3d348b] peer-focus:to-[#5b4fa3]"
                  >
                    Task Title
                  </label>
                </div>

                {/* Description Textarea */}
                <div className="relative group/input">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                    placeholder=" "
                    className="peer block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 px-5 text-white text-base font-medium placeholder-transparent focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] resize-none disabled:opacity-50"
                  />
                  <label
                    htmlFor="description"
                    className="absolute left-5 -top-3 text-sm font-bold text-white/70 bg-gradient-to-r from-[#3d348b] to-[#5b4fa3] px-2 rounded-lg transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-[#78e0dc] peer-focus:bg-gradient-to-r peer-focus:from-[#3d348b] peer-focus:to-[#5b4fa3]"
                  >
                    Description (Optional)
                  </label>
                </div>

                {/* Deadline Input */}
                <div className="relative group/input">
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    disabled={isSubmitting}
                    min="2020-01-01"
                    max="2030-12-31"
                    className="block w-full rounded-2xl bg-white/5 border-2 border-white/10 py-4 px-5 text-white text-base font-medium focus:bg-white/10 focus:border-[#78e0dc] focus:ring-4 focus:ring-[#78e0dc]/20 transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] disabled:opacity-50"
                  />
                  <label className="block text-sm font-bold text-white/70 mb-2 -mt-10">
                    Due Date (Optional)
                  </label>
                  {deadline && (
                    <button
                      type="button"
                      onClick={() => setDeadline('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-400 transition-colors duration-300"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <AssigneeSelector
                  projectId={task.projectId}
                  taskId={task.id}
                  currentAssigneeId={currentAssigneeId}
                  userRole={userRole}
                  onAssigned={(updatedTask) => {
                    if (updatedTask) {
                      setCurrentAssigneeId(updatedTask.assignedTo);
                      if (onUpdated) onUpdated(updatedTask);
                    }
                  }}
                />

                {/* Task Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                    <p className="text-xs font-bold text-white/50 mb-1">Task ID</p>
                    <p className="text-xs text-white/80 font-mono truncate">{task.id}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
                    <p className="text-xs font-bold text-white/50 mb-1">Position</p>
                    <p className="text-xs text-white/80 font-semibold">Order #{task.order}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group/button relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff8d4c] to-[#ff6b35]"></div>
                    <div className="relative px-6 py-3 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm font-black text-white">Saving...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-black text-white">Save Changes</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {/* Comments Section */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#78e0dc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments
                </h3>
                <CommentList taskId={task.id} projectId={task.projectId} />
              </div>

              {/* Attachments Section */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#ff8d4c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attachments
                </h3>
                <AttachmentList taskId={task.id} projectId={task.projectId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
