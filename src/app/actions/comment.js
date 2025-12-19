'use server';

import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Helper: Get Session
async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  return await decrypt(sessionCookie);
}

// 1. Add Comment to Task
export async function addComment({ taskId, projectId, text }) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  if (!text || !taskId || !projectId) {
    return { error: 'Missing required fields' };
  }

  try {
    await connectDB();

    // Verify user has access to this project
    const project = await Project.findOne({
      _id: projectId,
      ownerId: String(session.userId),
    });

    if (!project) {
      return { error: 'Access denied' };
    }

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return { error: 'Task not found' };
    }

    const newComment = await Comment.create({
      text,
      taskId,
      userId: String(session.userId),
      userName: session.name || 'User',
    });

    revalidatePath(`/dashboard/project/${projectId}`);

    return {
      success: true,
      comment: {
        id: newComment._id.toString(),
        text: newComment.text,
        userId: newComment.userId,
        userName: newComment.userName,
        createdAt: newComment.createdAt,
      },
    };
  } catch (error) {
    console.error('Add Comment Error:', error);
    return { error: 'Failed to add comment' };
  }
}

// 2. Get Comments for a Task
export async function getComments(taskId, projectId) {
  const session = await getSession();
  if (!session) return [];

  try {
    await connectDB();

    // Verify access
    const project = await Project.findOne({
      _id: projectId,
      ownerId: String(session.userId),
    });

    if (!project) return [];

    const comments = await Comment.find({ taskId }).sort({ createdAt: -1 });

    return comments.map((comment) => ({
      id: comment._id.toString(),
      text: comment.text,
      userId: comment.userId,
      userName: comment.userName,
      createdAt: comment.createdAt,
    }));
  } catch (error) {
    console.error('Get Comments Error:', error);
    return [];
  }
}

// 3. Delete Comment
export async function deleteComment(commentId, projectId) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await connectDB();

    // Verify ownership
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return { error: 'Comment not found' };
    }

    // Only comment owner can delete
    if (comment.userId !== String(session.userId)) {
      return { error: 'Access denied' };
    }

    await Comment.findByIdAndDelete(commentId);

    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete Comment Error:', error);
    return { error: 'Failed to delete comment' };
  }
}
