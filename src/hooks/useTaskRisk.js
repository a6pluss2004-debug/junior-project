// src/hooks/useTaskRisk.js
// React hook — fetches risk data for a single task
// Only runs if task has a deadline AND is not in the Done column

"use client";
import { useState, useEffect } from "react";

export function useTaskRisk(task) {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!task?.id && !task?._id) return;

    // Skip analysis for tasks without deadlines
    if (!task.deadline) return;

    // Skip analysis for done tasks — save API calls
    const col = (task.columnName || task.column || "").toLowerCase();
    if (col === "done") {
      setRisk({
        risk_level: "LOW",
        risk_score: 0,
        reason: "Task is completed.",
        suggestions: [],
        days_until_deadline: 0,
      });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/task-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task._id || task.id }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setRisk(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [task?.id, task?._id, task?.deadline]);

  return { risk, loading, error };
}
