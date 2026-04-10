import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Comment from "@/models/Comment";
import Project from "@/models/Project";
import ProjectMember from "@/models/ProjectMember";
import User from "@/models/User";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

async function getSession() {
  const cookieStore = await cookies();
  const s = cookieStore.get("session")?.value;
  if (!s) return null;
  try { return await decrypt(s); } catch { return null; }
}

export async function POST(request) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let taskId;
  try {
    const body = await request.json();
    taskId = body.taskId;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!taskId) {
    return Response.json({ error: "taskId is required" }, { status: 400 });
  }

  await connectDB();

  const task = await Task.findById(taskId).lean();
  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  // ── Resolve column name from embedded project.columns[] ──────────────────
  let columnName = "To Do";
  try {
    const project = await Project.findById(task.projectId).lean();
    if (project?.columns && task.columnId) {
      const col = project.columns.find(
        (c) => c._id.toString() === task.columnId.toString()
      );
      if (col?.name) columnName = col.name;
    }
  } catch (e) {
    console.error("[task-risk] Column lookup failed:", e.message);
  }

  // ── Resolve assignee info (now that tasks always have assignedTo) ─────────
  let assigneeName = "Unassigned";
  let assigneeRole = "member";
  let openTasksCount = 0;

  if (task.assignedTo) {
    try {
      const [assigneeUser, memberRecord, openTasks] = await Promise.all([
        User.findById(task.assignedTo).select("name").lean(),
        ProjectMember.findOne({
          projectId: task.projectId,
          userId: task.assignedTo,
        }).lean(),
        Task.countDocuments({
          projectId: task.projectId,
          assignedTo: task.assignedTo,
          _id: { $ne: task._id },
        }),
      ]);

      if (assigneeUser?.name) assigneeName = assigneeUser.name;
      if (memberRecord?.role) assigneeRole = memberRecord.role;
      openTasksCount = openTasks || 0;
    } catch (e) {
      console.error("[task-risk] Assignee lookup failed:", e.message);
    }
  }

  // ── Recent comments ────────────────────────────────────────────────────────
  let recentCommentsCount = 0;
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    recentCommentsCount = await Comment.countDocuments({
      taskId: task._id,
      createdAt: { $gte: sevenDaysAgo },
    });
  } catch (e) {
    console.error("[task-risk] Comments lookup failed:", e.message);
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const deadlineStr = task.deadline
    ? new Date(task.deadline).toISOString().split("T")[0]
    : new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  const payload = {
    task_id: task._id.toString(),
    project_id: task.projectId.toString(),
    title: task.title || "Untitled Task",
    description: task.description || "",
    deadline: deadlineStr,
    today: todayStr,
    column_name: columnName,
    assignee_name: assigneeName,
    assignee_role: assigneeRole,
    open_tasks_for_assignee: openTasksCount,
    comments_last_7_days: recentCommentsCount,
    status_changes_last_7_days: 0,
    past_on_time_rate: 0.70,
  };

  const serviceUrl = process.env.RISK_SERVICE_URL || "http://localhost:8001";

  try {
    const response = await fetch(`${serviceUrl}/api/v1/predict-risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(35000),
    });

    if (!response.ok) throw new Error(`Microservice ${response.status}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("[task-risk] Microservice failed:", error.message);

    const deadlineDate = new Date(deadlineStr);
    const daysLeft = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24));
    let fallbackLevel = "LOW", fallbackScore = 0;
    let fallbackReason = "Task is on track.";

    if (columnName.toLowerCase() === "done") {
      fallbackLevel = "LOW"; fallbackScore = 0; fallbackReason = "Task is completed.";
    } else if (daysLeft < 0) {
      fallbackLevel = "HIGH"; fallbackScore = 85;
      fallbackReason = `Task is ${Math.abs(daysLeft)} day(s) overdue.`;
    } else if (daysLeft <= 3) {
      fallbackLevel = "HIGH"; fallbackScore = 70;
      fallbackReason = `Deadline is in ${daysLeft} day(s).`;
    } else if (daysLeft <= 7) {
      fallbackLevel = "MEDIUM"; fallbackScore = 40;
      fallbackReason = `Deadline is in ${daysLeft} day(s). Monitor progress.`;
    }

    return Response.json({
      task_id: taskId,
      project_id: task.projectId?.toString() || "",
      risk_level: fallbackLevel,
      risk_score: fallbackScore,
      reason: fallbackReason,
      suggestions: [],
      analyzed_by: "rule-engine-fallback",
      days_until_deadline: daysLeft,
    });
  }
}
