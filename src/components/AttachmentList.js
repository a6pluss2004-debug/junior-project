'use client';

import { useState, useEffect } from 'react';
import { getAttachments, uploadAttachment, deleteAttachment } from '@/app/actions/attachment';

export default function AttachmentList({ taskId, projectId }) {
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadAttachments() {
      const data = await getAttachments(taskId, projectId);
      setAttachments(data);
      setIsLoading(false);
    }
    loadAttachments();
  }, [taskId, projectId]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);
    formData.append('projectId', projectId);

    const result = await uploadAttachment(formData);

    if (result?.error) {
      alert(result.error);
      setIsUploading(false);
      return;
    }

    if (result?.attachment) {
      setAttachments((prev) => [result.attachment, ...prev]);
    }

    setIsUploading(false);
    e.target.value = ''; // Reset input
  }

  async function handleDelete(attachmentId) {
    if (!confirm('Delete this file?')) return;

    setDeletingId(attachmentId);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));

    const result = await deleteAttachment(attachmentId, projectId);

    if (result?.error) {
      alert(result.error);
      setDeletingId(null);
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📎';
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
      {/* Upload Button */}
      <div>
        <label
          htmlFor="file-upload"
          className={`flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 cursor-pointer hover:border-[#3d348b] hover:bg-gray-50 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-[#3d348b] border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">Uploading...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-medium text-gray-600">
                Click to upload file (max 5MB)
              </span>
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {/* Attachments List */}
      <div className="space-y-2">
        {attachments.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No attachments</p>
        ) : (
          attachments.map((att) => (
            <div
              key={att.id}
              className="group flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{getFileIcon(att.fileType)}</span>
                <div className="flex-1 min-w-0">
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#3d348b] hover:underline truncate block"
                  >
                    {att.fileName}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{formatFileSize(att.fileSize)}</span>
                    <span>•</span>
                    <span>{att.userName}</span>
                    <span>•</span>
                    <span>
                      {new Date(att.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(att.id)}
                disabled={deletingId === att.id}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded p-1.5 transition-opacity"
                title="Delete file"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
