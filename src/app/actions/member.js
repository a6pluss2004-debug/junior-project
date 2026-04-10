'use server';

'use server';


import connectDB from '@/lib/db';
import ProjectMember from '@/models/ProjectMember';
import Project from '@/models/Project';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import User from '@/models/User';


// Helper: Get Session
async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  return await decrypt(sessionCookie);
}


// Helper: Check if user has permission
async function checkProjectAccess(projectId, userId, userEmail, requiredRoles = ['owner', 'admin']) {
  await connectDB();

  // Check if user is project owner
  const project = await Project.findOne({
    _id: projectId,
    ownerId: String(userId),
  });

  if (project) return { hasPermission: true, role: 'owner' };

  // Check member role
  const member = await ProjectMember.findOne({
    projectId,
    $or: [{ userId: String(userId) }, { userEmail: userEmail }],
    status: 'active',
  });

  if (!member) return { hasPermission: false, role: null };

  const hasPermission = requiredRoles.includes(member.role);
  return { hasPermission, role: member.role };
}


// 1. Add Member to Project
export async function addMember({ projectId, userEmail, role = 'member' }) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };


  if (!projectId || !userEmail) {
    return { error: 'Missing required fields' };
  }

  // Normalize email
  userEmail = userEmail.toLowerCase().trim();


  try {
    // Check permission
    const { hasPermission } = await checkProjectAccess(projectId, session.userId, session.email, ['owner', 'admin']);
    if (!hasPermission) {
      return { error: 'You do not have permission to add members' };
    }


    await connectDB();


    // Check if member already exists
    const existingMember = await ProjectMember.findOne({
      projectId,
      userEmail,
    });


    if (existingMember) {
      return { error: 'User is already a member of this project' };
    }

    // Check if the user exists in the system
    const existingUser = await User.findOne({ email: userEmail });

    let newMemberData = {
      projectId,
      userEmail,
      role,
      invitedBy: String(session.userId),
    };

    if (existingUser) {
      // If user exists, add them as active immediately with their real ID
      newMemberData.userId = existingUser._id.toString();
      newMemberData.userName = existingUser.name;
      newMemberData.status = 'active';
    } else {
      // If user doesn't exist, add as pending with email as ID
      newMemberData.userId = userEmail;
      newMemberData.userName = userEmail.split('@')[0];
      newMemberData.status = 'pending';
    }

    const newMember = await ProjectMember.create(newMemberData);


    revalidatePath(`/dashboard/project/${projectId}`);


    return {
      success: true,
      member: {
        id: newMember._id.toString(),
        userEmail: newMember.userEmail,
        userName: newMember.userName,
        role: newMember.role,
        status: newMember.status,
        createdAt: newMember.createdAt.toISOString(), // ✅ Convert to ISO string
      },
    };
  } catch (error) {
    console.error('Add Member Error:', error);
    return { error: 'Failed to add member' };
  }
}


// 2. Get Project Members
export async function getMembers(projectId) {
  const session = await getSession();
  if (!session) return [];


  try {
    await connectDB();


    // Check if user has access to this project
    const { hasPermission } = await checkProjectAccess(projectId, session.userId, session.email, [
      'owner',
      'admin',
      'member',
      'guest',
    ]);


    if (!hasPermission) return [];


    // Get all members (active and pending)
    const members = await ProjectMember.find({
      projectId,
      status: { $in: ['active', 'pending'] }
    }).sort({ createdAt: 1 });


    // Also get project owner
    const project = await Project.findById(projectId);

    // ✅ FIXED: Convert all values to plain strings/primitives
    const allMembers = [
      {
        id: 'owner',
        userId: String(project.ownerId), // ✅ Convert to string
        userEmail: session.email || 'owner@example.com',
        userName: session.name || 'Owner',
        role: 'owner',
        status: 'active',
        createdAt: project.createdAt.toISOString(), // ✅ Convert Date to ISO string
      },
      ...members.map((m) => ({
        id: m._id.toString(),
        userId: String(m.userId), // ✅ Convert to string
        userEmail: m.userEmail,
        userName: m.userName,
        role: m.role,
        status: m.status,
        createdAt: m.createdAt.toISOString(), // ✅ Convert Date to ISO string
      })),
    ];


    return allMembers;
  } catch (error) {
    console.error('Get Members Error:', error);
    return [];
  }
}


// 3. Remove Member
export async function removeMember(memberId, projectId) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };


  try {
    // Check permission
    const { hasPermission } = await checkProjectAccess(projectId, session.userId, session.email, ['owner', 'admin']);
    if (!hasPermission) {
      return { error: 'You do not have permission to remove members' };
    }


    await connectDB();


    await ProjectMember.findByIdAndUpdate(memberId, { status: 'removed' });


    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Remove Member Error:', error);
    return { error: 'Failed to remove member' };
  }
}


// 4. Update Member Role
export async function updateMemberRole(memberId, projectId, newRole) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };


  try {
    // Only owner can change roles
    const { hasPermission } = await checkProjectAccess(projectId, session.userId, session.email, ['owner']);
    if (!hasPermission) {
      return { error: 'Only project owner can change roles' };
    }


    await connectDB();


    await ProjectMember.findByIdAndUpdate(memberId, { role: newRole });


    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Update Role Error:', error);
    return { error: 'Failed to update role' };
  }
}


// 5. Get User Role in Project
export async function getUserRole(projectId) {
  const session = await getSession();
  if (!session) return null;


  try {
    const { role } = await checkProjectAccess(projectId, session.userId, session.email, ['owner', 'admin', 'member', 'guest']);
    return role;
  } catch (error) {
    console.error('Get User Role Error:', error);
    return null;
  }
}