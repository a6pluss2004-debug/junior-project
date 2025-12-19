'use server';

import connectDB from '@/lib/db';
import Attachment from '@/models/Attachment';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Helper: Get Session
async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  return await decrypt(sessionCookie);
}

// 1. Upload Attachment
export async function uploadAttachment(formData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const file = formData.get('file');
  const taskId = formData.get('taskId');
  const projectId = formData.get('projectId');

  if (!file || !taskId || !projectId) {
    return { error: 'Missing required fields' };
  }

  try {
    await connectDB();

    // Verify access
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

    // Save file to public/uploads folder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;

    // Save to database
    const newAttachment = await Attachment.create({
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      fileType: file.type,
      taskId,
      uploadedBy: String(session.userId),
      userName: session.name || 'User',
    });

    revalidatePath(`/dashboard/project/${projectId}`);

    return {
      success: true,
      attachment: {
        id: newAttachment._id.toString(),
        fileName: newAttachment.fileName,
        fileUrl: newAttachment.fileUrl,
        fileSize: newAttachment.fileSize,
        fileType: newAttachment.fileType,
        userName: newAttachment.userName,
        createdAt: newAttachment.createdAt,
      },
    };
  } catch (error) {
    console.error('Upload Attachment Error:', error);
    return { error: 'Failed to upload file' };
  }
}

// 2. Get Attachments for Task
export async function getAttachments(taskId, projectId) {
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

    const attachments = await Attachment.find({ taskId }).sort({ createdAt: -1 });

    return attachments.map((att) => ({
      id: att._id.toString(),
      fileName: att.fileName,
      fileUrl: att.fileUrl,
      fileSize: att.fileSize,
      fileType: att.fileType,
      userName: att.userName,
      createdAt: att.createdAt,
    }));
  } catch (error) {
    console.error('Get Attachments Error:', error);
    return [];
  }
}

// 3. Delete Attachment
export async function deleteAttachment(attachmentId, projectId) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await connectDB();

    const attachment = await Attachment.findById(attachmentId);
    if (!attachment) {
      return { error: 'Attachment not found' };
    }

    // Only uploader can delete
    if (attachment.uploadedBy !== String(session.userId)) {
      return { error: 'Access denied' };
    }

    // Delete file from disk (optional - can skip if you want to keep files)
    // const filePath = path.join(process.cwd(), 'public', attachment.fileUrl);
    // await unlink(filePath).catch(() => {});

    await Attachment.findByIdAndDelete(attachmentId);

    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete Attachment Error:', error);
    return { error: 'Failed to delete attachment' };
  }
}
