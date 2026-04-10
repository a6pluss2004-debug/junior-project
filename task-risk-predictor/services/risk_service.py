import logging
from models.request import TaskRiskRequest
from models.response import TaskRiskResponse, RiskLevel
from repositories.llm_repository import LLMRepository
from prompts.risk_prompt import build_risk_prompt

logger = logging.getLogger(__name__)

class RiskService:
    """
    Service/Business Logic Layer.
    Mirrors the Service Layer in the 5-layer architecture from the project report.
    Orchestrates rule-based scoring and LLM enrichment.
    """

    def __init__(self, llm_repo: LLMRepository):
        self.llm_repo = llm_repo

    async def predict(self, task: TaskRiskRequest) -> TaskRiskResponse:
        # Step 1: Short-circuit for completed tasks
        if task.column_name.strip().lower() == "done":
            logger.info(f"[RiskService] task={task.task_id} is Done — returning LOW risk")
            return TaskRiskResponse(
                task_id=task.task_id,
                project_id=task.project_id,
                risk_level=RiskLevel.LOW,
                risk_score=0,
                reason="This task is already completed.",
                suggestions=[],
                days_until_deadline=task.days_until_deadline,
            )

        # Step 2: Rule-based pre-score (always runs, free, deterministic)
        pre_score = self._compute_rule_score(task)
        pre_level = self._score_to_level(pre_score)

        logger.info(
            f"[RiskService] task={task.task_id} | days={task.days_until_deadline} | "
            f"pre_score={pre_score} | pre_level={pre_level}"
        )

        # Step 3: LLM call for contextual reasoning and suggestions
        prompt = build_risk_prompt(task, pre_score, pre_level)
        llm_result = await self.llm_repo.call_gemma(prompt)

        # Step 4: Merge scores with guardrail (LLM can only shift ±15)
        final_score = self._merge_scores(pre_score, llm_result.get("risk_score", pre_score))
        final_level_str = llm_result.get("risk_level", pre_level)

        # Validate final level is a valid enum value
        try:
            final_level = RiskLevel(final_level_str)
        except ValueError:
            final_level = RiskLevel(pre_level)

        return TaskRiskResponse(
            task_id=task.task_id,
            project_id=task.project_id,
            risk_level=final_level,
            risk_score=final_score,
            reason=llm_result.get("reason", self._default_reason(task, pre_level)),
            suggestions=llm_result.get("suggestions", []),
            days_until_deadline=task.days_until_deadline,
        )

    def _compute_rule_score(self, task: TaskRiskRequest) -> int:
        score = 0
        days = task.days_until_deadline

        # Signal 1: Deadline proximity
        if days < 0:
            score += 50
        elif days <= 1:
            score += 45
        elif days <= 3:
            score += 35
        elif days <= 7:
            score += 20
        elif days <= 14:
            score += 10

        # Signal 2: Column status (still in To Do close to deadline)
        col = task.column_name.strip().lower()
        if col == "to do" and days <= 3:
            score += 20
        elif col == "to do" and days <= 7:
            score += 10

        # Signal 3: Assignee workload
        if task.open_tasks_for_assignee >= 8:
            score += 20
        elif task.open_tasks_for_assignee >= 5:
            score += 12
        elif task.open_tasks_for_assignee >= 3:
            score += 5

        # Signal 4: Activity (stale task)
        no_comments = task.comments_last_7_days == 0
        no_moves = task.status_changes_last_7_days == 0
        if no_comments and no_moves:
            score += 15 if days <= 7 else 5
        elif no_comments:
            score += 5

        # Signal 5: Historical performance
        rate = task.past_on_time_rate
        if rate < 0.40:
            score += 15
        elif rate < 0.60:
            score += 8
        elif rate >= 0.85:
            score -= 5

        return min(max(score, 0), 100)

    def _score_to_level(self, score: int) -> str:
        if score >= 60:
            return "HIGH"
        elif score >= 30:
            return "MEDIUM"
        return "LOW"

    def _merge_scores(self, rule_score: int, llm_score: int) -> int:
        delta = llm_score - rule_score
        clamped_delta = max(-15, min(15, delta))
        return min(max(rule_score + clamped_delta, 0), 100)

    def _default_reason(self, task: TaskRiskRequest, level: str) -> str:
        """Fallback reason when LLM is unavailable."""
        days = task.days_until_deadline
        if level == "HIGH":
            return f"Task has {days} days until deadline with high workload or low recent activity."
        elif level == "MEDIUM":
            return f"Task has moderate risk with {days} days remaining."
        return f"Task is on track with {days} days until deadline."
