'use server';

import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

// Helper: Get current user session
async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  return await decrypt(sessionCookie);
}

// 1. Create a Project - FIXED: Added prevState parameter
export async function createProject(prevState, formData) {
  const session = await getSession();
  
  if (!session || !session.userId) {
    return { error: 'Unauthorized: Please log in again' };
  }

  const title = formData.get('title');
  const description = formData.get('description');

  if (!title) return { error: 'Title is required' };

  try {
    await connectDB();

    // Fix 1: Ensure ownerId is a valid ObjectId
    const ownerId = new mongoose.Types.ObjectId(String(session.userId));

    const newProject = await Project.create({
      title,
      description,
      ownerId: ownerId,
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Project created successfully!', projectId: newProject._id.toString() };

  } catch (error) {
    console.error('Create Project Error:', error);
    return { error: 'Error: ' + error.message };
  }
}

// 2. Get All Projects (For Dashboard)
export async function getUserProjects() {
  const session = await getSession();
  if (!session || !session.userId) return [];

  try {
    await connectDB();

    // Fix 2: Explicitly convert session.userId to String to avoid CastError
    const userId = String(session.userId);

    const projects = await Project.find({ ownerId: userId })
      .sort({ createdAt: -1 });
      
    return projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      createdAt: p.createdAt
    }));
  } catch (error) {
    console.error('Fetch Projects Error:', error);
    return [];
  }
}

// 3. Get Single Project (For Board View)
export async function getProject(projectId) {
  const session = await getSession();
  if (!session) return null;

  try {
    await connectDB();
    
    // Safety check for invalid Project IDs
    if (!mongoose.Types.ObjectId.isValid(projectId)) return null;

    // Fix 3: Ensure we search with String userId
    const userId = String(session.userId);

    const project = await Project.findOne({ 
      _id: projectId,
      ownerId: userId 
    });

    if (!project) return null;

    return {
      id: project._id.toString(),
      title: project.title,
      description: project.description,
    };
  } catch (error) {
    console.error('Get Project Error:', error);
    return null;
  }
}
