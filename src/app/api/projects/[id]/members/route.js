import connectDB from "@/lib/db";
import ProjectMember from "@/models/ProjectMember";
import Project from "@/models/Project";
import User from "@/models/User";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { getUserRole } from "@/app/actions/member";
import { checkPermission } from "@/lib/permissions";

async function getSession() {
  const cookieStore = await cookies();
  const s = cookieStore.get("session")?.value;
  if (!s) return null;
  try { return await decrypt(s); } catch { return null; }
}

// GET /api/projects/[id]/members?search=amjad
// Returns members list. If ?search= is provided, searches users to add.
export async function GET(request, { params }) {
  const { id } = await params;
  
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();

  const userRole = await getUserRole(id);

  if (!checkPermission('view_board', userRole)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Mode 1: Search users to add (for autocomplete) ────────────────────────
  if (search) {
    if (!checkPermission('invite_members', userRole)) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    if (search.length < 2) {
      return Response.json({ users: [] });
    }

    // Find existing member IDs to exclude from results
    const existingMembers = await ProjectMember.find({
      projectId: id,
    }).lean();

    const project = await Project.findById(id).lean();
    const excludeIds = [
      ...existingMembers.map((m) => m.userId.toString()),
      project?.ownerId?.toString(),
      session.userId, // exclude current user too
    ].filter(Boolean);

    const users = await User.find({
      name: { $regex: search, $options: "i" },
      _id: { $nin: excludeIds },
    })
      .select("_id name email")
      .limit(6)
      .lean();

    return Response.json({ users });
  }

  // ── Mode 2: Get current members of the project ────────────────────────────

  const members = await ProjectMember.find({ projectId: id })
    .populate("userId", "name email")
    .lean();

  const project = await Project.findById(id)
    .populate("ownerId", "name email")
    .lean();

  const memberList = members.map((m) => ({
    userId: m.userId._id,
    name: m.userId.name,
    email: m.userId.email,
    role: m.role,
  }));

  // Add project owner at the top if not already listed
  const ownerListed = memberList.some(
    (m) => m.userId.toString() === project.ownerId._id.toString()
  );
  if (!ownerListed && project.ownerId) {
    memberList.unshift({
      userId: project.ownerId._id,
      name: project.ownerId.name,
      email: project.ownerId.email,
      role: "owner",
    });
  }

  return Response.json({ members: memberList });
}

// POST /api/projects/[id]/members
// Body: { userId, role }
// Directly adds a user as a project member (no invitation needed)
export async function POST(request, { params }) {
  const { id } = await params;
  
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role = "member" } = await request.json();

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  if (!["admin", "member", "guest"].includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  await connectDB();

  // Only project owner or admin can add members
  const userRole = await getUserRole(id);

  if (!checkPermission('invite_members', userRole)) {
    return Response.json(
      { error: "Only project owners and admins can add members" },
      { status: 403 }
    );
  }

  // Verify target user exists
  const targetUser = await User.findById(userId).select("name").lean();
  if (!targetUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Check if user is already a member
  const alreadyMember =
    (await ProjectMember.exists({ projectId: id, userId })) ||
    (await Project.exists({ _id: id, ownerId: userId }));

  if (alreadyMember) {
    return Response.json(
      { error: `${targetUser.name} is already in this project` },
      { status: 409 }
    );
  }

  // Add as member directly — no invitation needed
  await ProjectMember.create({
    projectId: id,
    userId,
    role: role,
    joinedAt: new Date(),
  });

  return Response.json({
    success: true,
    message: `${targetUser.name} has been added to the project as ${role}`,
  });
}

// DELETE /api/projects/[id]/members
// Body: { userId }
// Remove a member from the project
export async function DELETE(request, { params }) {
  const { id } = await params;
  
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await request.json();

  await connectDB();

  const userRole = await getUserRole(id);
  if (!checkPermission('invite_members', userRole)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Cannot remove the project owner
  const targetIsOwner = await Project.exists({ _id: id, ownerId: userId });
  if (targetIsOwner) {
    return Response.json({ error: "Cannot remove the project owner" }, { status: 400 });
  }

  await ProjectMember.deleteOne({ projectId: id, userId });

  return Response.json({ success: true, message: "Member removed from project" });
}

// PATCH /api/projects/[id]/members
// Body: { userId, role }
// Change a member's role
export async function PATCH(request, { params }) {
  const { id } = await params;
  
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role } = await request.json();

  if (!["admin", "member", "guest"].includes(role)) {
    return Response.json({ error: "Invalid role" }, { status: 400 });
  }

  await connectDB();

  const userRole = await getUserRole(id);
  if (!checkPermission('invite_members', userRole)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetIsOwner = await Project.exists({ _id: id, ownerId: userId });
  if (targetIsOwner) {
    return Response.json({ error: "Cannot change the project owner's role" }, { status: 400 });
  }

  await ProjectMember.updateOne({ projectId: id, userId }, { $set: { role } });

  return Response.json({ success: true, message: "Role updated" });
}
