"use client";
import { useState, useEffect } from "react";
import { checkPermission } from '@/lib/permissions';

export default function AssigneeSelector({ projectId, taskId, currentAssigneeId, userRole, onAssigned }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Use strict permissions matrix
  const canReassign = checkPermission('edit_tasks', userRole);

  useEffect(() => {
    if (!canReassign || !projectId) return;
    fetch(`/api/projects/${projectId}/members`)
      .then((r) => r.json())
      .then((d) => setMembers(d.members || []))
      .catch(console.error);
  }, [projectId, canReassign]);

  const handleChange = async (e) => {
    const newAssigneeId = e.target.value || null;
    setSaving(true);
    try {
      // Re-using server action conceptually via frontend or standard server endpoint if they build it?
      // Wait: the documentation relies on a PATCH to `/api/tasks/:id` to update assignee!
      // Well, I am going to make `AssigneeSelector` invoke a Server Action, or I should stick with their fetch if they added the route. 
      // I am building out the Server Actions logic. So I will change AssigneeSelector to use Next.js server actions.
      
      const { reassignTask } = await import('@/app/actions/task'); // We will add reassignTask since UpdateTask might not be cleanly exposed as an endpoint
      
      const res = await reassignTask({ taskId, projectId, assignedTo: newAssigneeId });
      if (!res.error) {
        onAssigned?.(res.task);
      } else {
        alert(res.error || "Failed to reassign task");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Find the current assignee name for display
  const currentMember = members.find(
    (m) => m.userId.toString() === currentAssigneeId?.toString()
  );

  if (!canReassign) {
    // Non-admin/owner: show read-only assignee name
    return (
      <div className="text-sm text-gray-600 mt-2">
        <span className="font-medium text-white/70">Assigned to:</span>{" "}
        <span className="text-white">{currentMember?.name || "Unassigned"}</span>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <label className="block text-sm font-bold text-white/70 mb-2">Assigned to</label>
      <select
        value={currentAssigneeId || ""}
        onChange={handleChange}
        disabled={saving || loading}
        className="w-full px-3 py-2 text-sm border-2 border-white/10 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#78e0dc] focus:border-[#78e0dc]
                   bg-white/5 text-white/90 backdrop-blur-sm disabled:opacity-60
                   appearance-none cursor-pointer"
        style={{
            "& option": { backgroundColor: "#3d348b", color: "white" }
        }}
      >
        <option value="" className="text-gray-900 bg-white">Unassigned</option>
        {members.map((m) => (
          <option key={m.userId} value={m.userId} className="text-gray-900 bg-white">
            {m.name || m.email} ({m.role})
          </option>
        ))}
      </select>
      {saving && <p className="text-xs text-[#78e0dc] mt-1">Saving...</p>}
    </div>
  );
}
