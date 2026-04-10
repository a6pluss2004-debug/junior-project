from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class RiskLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class TaskRiskResponse(BaseModel):
    task_id: str
    project_id: str
    risk_level: RiskLevel
    risk_score: int = Field(ge=0, le=100)
    reason: str
    suggestions: List[str] = Field(default=[])
    analyzed_by: str = Field(default="gemma-4-31b")
    days_until_deadline: int
