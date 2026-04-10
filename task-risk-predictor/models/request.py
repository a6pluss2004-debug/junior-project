from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional

class TaskRiskRequest(BaseModel):
    # From tasks collection
    task_id: str = Field(..., description="MongoDB ObjectId of the task")
    project_id: str = Field(..., description="MongoDB ObjectId of the project")
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(default="", max_length=2000)
    deadline: date
    today: date
    column_name: str = Field(..., description="Current column name e.g. 'To Do', 'In Progress', 'Done'")

    # From users / projectMembers collections
    assignee_name: str = Field(default="Unassigned")
    assignee_role: str = Field(
        default="member",
        description="Must match RBAC roles: admin | owner | member | guest"
    )

    # Computed signals aggregated by Next.js before sending
    open_tasks_for_assignee: int = Field(ge=0, default=0)
    comments_last_7_days: int = Field(ge=0, default=0)
    status_changes_last_7_days: int = Field(ge=0, default=0)
    past_on_time_rate: float = Field(ge=0.0, le=1.0, default=0.75)

    @field_validator("today")
    @classmethod
    def today_cannot_be_future(cls, v):
        if v > date.today():
            raise ValueError("'today' cannot be a future date")
        return v

    @property
    def days_until_deadline(self) -> int:
        return (self.deadline - self.today).days
