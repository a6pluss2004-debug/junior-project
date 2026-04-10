'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import Project from '@/models/Project';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import ProjectMember from '@/models/ProjectMember';
import { checkPermission } from '@/lib/permissions';

// Helper: Get Session
async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  return await decrypt(sessionCookie);
}

// Helper: Verify Project Access (Owner OR Member)
async function verifyProjectAccess(projectId, userId, userEmail) {
  // 1. Check ownership
  const project = await Project.findOne({
    _id: projectId,
    ownerId: String(userId),
  });

  if (project) return { hasAccess: true, role: 'owner' };

  // 2. Check membership
  const member = await ProjectMember.findOne({
    projectId,
    $or: [{ userId: String(userId) }, { userEmail: userEmail }],
    status: 'active',
  });

  if (member) return { hasAccess: true, role: member.role };
  return { hasAccess: false, role: null };
}

// 1. Create a Task
export async function createTask(formData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const title = formData.get('title');
  const description = formData.get('description');
  const column = formData.get('column');
  const projectId = formData.get('projectId');
  const deadline = formData.get('deadline'); // ✅ NEW

  if (!title || !projectId) {
    return { error: 'Title and Project are required' };
  }

  try {
    await connectDB();

    // Verify access
    const { hasAccess, role } = await verifyProjectAccess(projectId, session.userId, session.email);

    if (!hasAccess || !checkPermission('create_tasks', role)) {
      return { error: 'Project not found or access denied' };
    }

    // Get the highest order number in this column
    const lastTask = await Task.findOne({ projectId, column })
      .sort({ order: -1 })
      .select('order');

    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const newTask = await Task.create({
      title,
      description,
      column: column || 'todo',
      projectId,
      order: newOrder,
      deadline: deadline ? new Date(deadline) : null, // ✅ NEW
      assignedTo: session.userId, // ✅ NEW assigned to creator
    });

    revalidatePath(`/dashboard/project/${projectId}`);

    // ✅ RETURN THE CREATED TASK
    return {
      success: true,
      task: {
        id: newTask._id.toString(),
        title: newTask.title,
        description: newTask.description,
        column: newTask.column,
        order: newTask.order,
        deadline: newTask.deadline ? newTask.deadline.toISOString() : null,
        assignedTo: newTask.assignedTo ? newTask.assignedTo.toString() : null, // ✅ NEW
        assigneeName: session.name, // The creator is obviously the assignee at spawn
        createdAt: newTask.createdAt,
      },
    };
  } catch (error) {
    console.error('Create Task Error:', error);
    return { error: 'Failed to create task' };
  }
}

// 2. Get All Tasks for a Project
export async function getTasks(projectId) {
  const session = await getSession();
  if (!session) return [];

  try {
    await connectDB();

    // Verify access
    // Verify access
    const { hasAccess, role } = await verifyProjectAccess(projectId, session.userId, session.email);

    if (!hasAccess || !checkPermission('view_board', role)) return [];

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name")
      .sort({ order: 1 });

    return tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      column: task.column,
      order: task.order,
      deadline: task.deadline ? task.deadline.toISOString() : null,
      assignedTo: task.assignedTo?._id ? task.assignedTo._id.toString() : null,
      assigneeName: task.assignedTo?.name || null,
      createdAt: task.createdAt,
    }));
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return [];
  }
}

// 3. Delete a Task
export async function deleteTask(taskId, projectId) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    await connectDB();

    // Verify ownership
    // Verify access
    const { hasAccess, role } = await verifyProjectAccess(projectId, session.userId, session.email);

    if (!hasAccess || !checkPermission('delete_tasks', role)) return { error: 'Access denied' };

    await Task.findByIdAndDelete(taskId);

    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete Task Error:', error);
    return { error: 'Failed to delete task' };
  }
}

// 4. Update Task Position (for drag & drop)
export async function updateTaskPosition({ taskId, projectId, column, order }) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  // Basic validation
  if (!taskId || !projectId || !column || typeof order !== 'number') {
    return { error: 'Missing fields for updateTaskPosition' };
  }

  try {
    await connectDB();

    // Ensure user owns the project
    // Verify access
    const { hasAccess, role } = await verifyProjectAccess(projectId, session.userId, session.email);
    if (!hasAccess || !checkPermission('edit_tasks', role)) return { error: 'Access denied' };

    await Task.findByIdAndUpdate(taskId, {
      column,
      order,
    });

    return { success: true };
  } catch (error) {
    console.error('Update Task Position Error:', error);
    return { error: 'Failed to update task position' };
  }
}

// 5. Update Task (Edit title & description & deadline)
export async function updateTask({ taskId, projectId, title, description, deadline }) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  if (!title || !taskId || !projectId) {
    return { error: 'Missing required fields' };
  }

  try {
    await connectDB();

    // Verify the user owns this project
    // Verify access
    const { hasAccess, role } = await verifyProjectAccess(projectId, session.userId, session.email);

    if (!hasAccess || !checkPermission('edit_tasks', role)) {
      return { error: 'Project not found or access denied' };
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description: description || '',
        deadline: deadline ? new Date(deadline) : null,
      },
      { new: true }
    ).populate('assignedTo', 'name');

    if (!updatedTask) {
      return { error: 'Task not found' };
    }

    revalidatePath(`/dashboard/project/${projectId}`);

    return {
      success: true,
      task: {
        id: updatedTask._id.toString(),
        title: updatedTask.title,
        description: updatedTask.description,
        column: updatedTask.column,
        order: updatedTask.order,
        deadline: updatedTask.deadline ? updatedTask.deadline.toISOString() : null,
        assignedTo: updatedTask.assignedTo?._id ? updatedTask.assignedTo._id.toString() : null,
        assigneeName: updatedTask.assignedTo?.name || null,
        createdAt: updatedTask.createdAt,
      },
    };
  } catch (error) {
    console.error('Update Task Error:', error);
    return { error: 'Failed to update task' };
  }
}

// 6. Reassign Task (Update assignedTo property)
export async function reassignTask({ taskId, projectId, assignedTo }) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  if (!taskId || !projectId) {
    return { error: 'Missing required fields' };
  }

  try {
    await connectDB();

    const { hasAccess, role } = await verifyProjectAccess(projectId, session.userId, session.email);

    if (!hasAccess || !checkPermission('edit_tasks', role)) {
      return { error: "Only those with edit permissions can reassign tasks" };
    }

    if (assignedTo !== null) {
      const isMember = await ProjectMember.exists({
        projectId,
        userId: assignedTo,
      });
      const isProjectOwner = await Project.exists({
        _id: projectId,
        ownerId: assignedTo,
      });
      if (!isMember && !isProjectOwner) {
        return { error: "You can only assign tasks to existing project members" };
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, { assignedTo }, { new: true }).populate('assignedTo', 'name');
    revalidatePath(`/dashboard/project/${projectId}`);

    return {
      success: true,
      task: {
        id: updatedTask._id.toString(),
        title: updatedTask.title,
        description: updatedTask.description,
        column: updatedTask.column,
        order: updatedTask.order,
        deadline: updatedTask.deadline ? updatedTask.deadline.toISOString() : null,
        assignedTo: updatedTask.assignedTo?._id ? updatedTask.assignedTo._id.toString() : null,
        assigneeName: updatedTask.assignedTo?.name || null,
        createdAt: updatedTask.createdAt,
      }
    };
  } catch (error) {
    console.error('Reassign Task Error:', error);
    return { error: 'Failed to reassign task' };
  }
}

