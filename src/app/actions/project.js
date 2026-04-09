'use server';

import connectDB from '@/lib/db';
import Project from '@/models/Project';
import ProjectMember from '@/models/ProjectMember';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

// NEW: import Column model
import Column from '@/models/Column';

// Helper: Get current user session
async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  return await decrypt(sessionCookie);
}

// ✅ UPDATED: create columns from template
async function createColumnsFromTemplate(projectId, templateColumns) {
  await connectDB();

  await Column.insertMany(
    templateColumns.map((col) => ({
      ...col,
      projectId,
    }))
  );
}

// ✅ UPDATED: create tasks from template
async function createTasksFromTemplate(projectId, templateTasks) {
  if (!templateTasks || templateTasks.length === 0) return;

  await connectDB();
  const Task = (await import('@/models/Task')).default;

  await Task.insertMany(
    templateTasks.map((task) => ({
      ...task,
      projectId,
    }))
  );
}

// 1. Create a Project (✅ UPDATED with template support)
export async function createProject(prevState, formData) {
  const session = await getSession();

  if (!session || !session.userId) {
    return { error: 'Unauthorized: Please log in again' };
  }

  const title = formData.get('title');
  const description = formData.get('description');
  const templateId = formData.get('templateId') || 'blank'; // ✅ NEW

  if (!title) return { error: 'Title is required' };

  try {
    await connectDB();

    // ✅ NEW: Get template
    const { getTemplate } = await import('@/lib/templates');
    const template = getTemplate(templateId);

    const ownerId = new mongoose.Types.ObjectId(String(session.userId));

    const newProject = await Project.create({
      title,
      description,
      ownerId: ownerId,
    });

    // ✅ NEW: Create columns from template
    await createColumnsFromTemplate(newProject._id, template.columns);

    // ✅ NEW: Create tasks from template
    await createTasksFromTemplate(newProject._id, template.tasks);

    revalidatePath('/dashboard');
    return {
      success: true,
      message: `Project created with ${template.name} template! 🎉`,
      projectId: newProject._id.toString(),
    };
  } catch (error) {
    console.error('Create Project Error:', error);
    return { error: 'Error: ' + error.message };
  }
}

// ✅ NEW: Get all projects (owned + member)
export async function getProjects(userId) {
  try {
    await connectDB();
    const session = await getSession();
    const userEmail = session?.email;

    // 1. Get owned projects
    const ownedProjects = await Project.find({
      ownerId: new mongoose.Types.ObjectId(String(userId))
    }).sort({ createdAt: -1 });

    // 2. Get projects where user is a member
    const memberships = await ProjectMember.find({
      $or: [
        { userId: String(userId) },
        { userEmail: userEmail }
      ],
      status: 'active'
    });

    const memberProjectIds = memberships.map(m => m.projectId);

    const sharedProjects = await Project.find({
      _id: { $in: memberProjectIds }
    }).sort({ createdAt: -1 });

    // 3. Merge and deduplicate
    const allProjects = [...ownedProjects];

    // Add shared projects if not already in list (though they shouldn't be if you're the owner)
    sharedProjects.forEach(project => {
      if (!allProjects.find(p => p._id.toString() === project._id.toString())) {
        allProjects.push(project);
      }
    });

    // Sort combined list by createdAt desc
    allProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allProjects.map((project) => ({
      id: project._id.toString(),
      title: project.title,
      description: project.description || '',
      ownerId: String(project.ownerId),
      createdAt: project.createdAt.toISOString(),
      isShared: String(project.ownerId) !== String(userId) // Add flag for UI
    }));
  } catch (error) {
    console.error('Get Projects Error:', error);
    return [];
  }
}

// 2. Get All Projects (For Dashboard) - KEPT for backward compatibility
export async function getUserProjects() {
  const session = await getSession();
  if (!session || !session.userId) return [];

  // Redirect to the new function which handles shared projects
  return getProjects(session.userId);
}

// 3. Get Single Project (For Board View)
export async function getProject(projectId) {
  const session = await getSession();
  if (!session) return null;

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(projectId)) return null;

    const userId = String(session.userId);
    const userEmail = session.email;

    // Check if owner
    const project = await Project.findOne({
      _id: projectId,
    });

    if (!project) return null;

    if (String(project.ownerId) === userId) {
      return {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        isOwner: true
      };
    }

    // Check if member
    const membership = await ProjectMember.findOne({
      projectId,
      $or: [
        { userId: userId },
        { userEmail: userEmail }
      ],
      status: 'active'
    });

    if (membership) {
      return {
        id: project._id.toString(),
        title: project.title,
        description: project.description,
        isOwner: false
      };
    }

    return null;
  } catch (error) {
    console.error('Get Project Error:', error);
    return null;
  }
}

// 4. Delete Project
export async function deleteProject(projectId) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { error: 'Unauthorized' };
  }

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return { error: 'Invalid project ID' };
    }

    const userId = String(session.userId);

    // Delete only if user owns it
    const result = await Project.deleteOne({
      _id: projectId,
      ownerId: userId,
    });

    if (result.deletedCount === 0) {
      return { error: 'Project not found or unauthorized' };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete Project Error:', error);
    return { error: 'Failed to delete project' };
  }
}

// 5. Create new column
export async function createColumn(projectId, title) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { error: 'Unauthorized' };
  }

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return { error: 'Invalid project ID' };
    }

    const userId = String(session.userId);

    // Verify user owns this project
    const project = await Project.findOne({
      _id: projectId,
      ownerId: userId,
    });

    if (!project) {
      return { error: 'Project not found or unauthorized' };
    }

    // Get max order for this project
    const existingColumns = await Column.find({ projectId }).sort({ order: -1 }).limit(1);
    const nextOrder = existingColumns.length > 0 ? existingColumns[0].order + 1 : 0;

    // Generate key from title (lowercase, no spaces)
    const key = title.toLowerCase().replace(/\s+/g, '');

    const newColumn = await Column.create({
      title,
      projectId,
      key,
      order: nextOrder,
    });

    revalidatePath(`/dashboard/project/${projectId}`);
    return {
      success: true,
      column: {
        id: newColumn._id.toString(),
        title: newColumn.title,
        key: newColumn.key,
        order: newColumn.order,
      },
    };
  } catch (error) {
    console.error('Create Column Error:', error);
    return { error: 'Failed to create column' };
  }
}

// 6. Delete column
export async function deleteColumn(columnId, projectId) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { error: 'Unauthorized' };
  }

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return { error: 'Invalid column ID' };
    }

    const userId = String(session.userId);

    // Verify user owns the project
    const project = await Project.findOne({
      _id: projectId,
      ownerId: userId,
    });

    if (!project) {
      return { error: 'Project not found or unauthorized' };
    }

    // Delete the column
    await Column.deleteOne({ _id: columnId, projectId });

    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete Column Error:', error);
    return { error: 'Failed to delete column' };
  }
}
