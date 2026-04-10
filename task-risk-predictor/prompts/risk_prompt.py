from models.request import TaskRiskRequest

def build_risk_prompt(task: TaskRiskRequest, pre_score: int, pre_level: str) -> str:
    days = task.days_until_deadline
    if days < 0:
        deadline_str = f"{abs(days)} days OVERDUE"
    elif days == 0:
        deadline_str = "due TODAY"
    else:
        deadline_str = f"{days} days from now"

    return f"""You are a senior software project manager AI assistant embedded in a 
student project management system. Your job is to analyze ONE task and predict 
its delay risk.

## Task Details
- Title: "{task.title}"
- Description: "{task.description or 'No description provided'}"
- Current Column (workflow stage): "{task.column_name}"
- Deadline: {deadline_str}
- Assignee: {task.assignee_name} (Role: {task.assignee_role})

## Risk Signals
- Assignee open tasks right now: {task.open_tasks_for_assignee}
- Comments added to this task in last 7 days: {task.comments_last_7_days}
- Times this task moved between columns in last 7 days: {task.status_changes_last_7_days}
- Assignee historical on-time completion rate: {int(task.past_on_time_rate * 100)}%

## Pre-Analysis from Rule Engine
Our deterministic rule engine computed: risk_score={pre_score}/100, risk_level={pre_level}
You may adjust this score by at most +15 or -15 points based on context in the description.

## Your Response
Respond with EXACTLY this JSON. No markdown fences. No extra text outside JSON.
{{
  "risk_level": "HIGH" or "MEDIUM" or "LOW",
  "risk_score": integer between 0 and 100,
  "reason": "One specific sentence mentioning the most critical risk factor.",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"]
}}

## Risk Level Thresholds
- HIGH (score >= 60): Very likely to be delayed. Urgent action needed.
- MEDIUM (score 30-59): Moderate risk. Should be monitored closely.
- LOW (score < 30): On track. No immediate concern.

## Rules for Suggestions
- Suggestions must be specific and actionable for a student development team
- Respect user roles: 'member' can edit tasks and add comments but cannot delete the project
- 'guest' can only view — do not suggest actions a guest cannot perform
- 'owner' and 'admin' can reassign tasks, manage columns, and invite members
- Maximum 2 suggestions
"""
