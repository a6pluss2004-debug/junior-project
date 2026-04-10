import pytest
from datetime import date, timedelta
from unittest.mock import AsyncMock, MagicMock
from services.risk_service import RiskService
from models.request import TaskRiskRequest
from models.response import RiskLevel

# ─── Fixtures ───────────────────────────────────────────────────────────────

@pytest.fixture
def mock_llm_empty():
    """LLM that returns nothing — simulates failure/timeout."""
    repo = AsyncMock()
    repo.call_gemma.return_value = {}
    return repo

@pytest.fixture
def mock_llm_high():
    """LLM that returns HIGH risk."""
    repo = AsyncMock()
    repo.call_gemma.return_value = {
        "risk_level": "HIGH",
        "risk_score": 80,
        "reason": "Deadline is very close and assignee has too many tasks.",
        "suggestions": ["Reduce workload", "Add a comment"]
    }
    return repo

@pytest.fixture
def service_with_empty_llm(mock_llm_empty):
    return RiskService(llm_repo=mock_llm_empty)

@pytest.fixture
def service_with_high_llm(mock_llm_high):
    return RiskService(llm_repo=mock_llm_high)

def make_task(**overrides):
    """Factory for TaskRiskRequest with sensible defaults."""
    defaults = dict(
        task_id="task_abc_123",
        project_id="proj_xyz_456",
        title="Implement Feature X",
        description="Some description",
        deadline=date.today() + timedelta(days=10),
        today=date.today(),
        column_name="In Progress",
        assignee_name="Amjad",
        assignee_role="member",
        open_tasks_for_assignee=2,
        comments_last_7_days=2,
        status_changes_last_7_days=1,
        past_on_time_rate=0.75,
    )
    defaults.update(overrides)
    return TaskRiskRequest(**defaults)

# ─── TCA-01: Done column short-circuit ──────────────────────────────────────

@pytest.mark.asyncio
async def test_done_column_always_returns_low(service_with_empty_llm):
    task = make_task(column_name="Done")
    result = await service_with_empty_llm.predict(task)
    assert result.risk_level == RiskLevel.LOW
    assert result.risk_score == 0
    # LLM must NOT be called for Done tasks
    service_with_empty_llm.llm_repo.call_gemma.assert_not_called()

# ─── TCA-02: Overdue + stale task ───────────────────────────────────────────

@pytest.mark.asyncio
async def test_overdue_stale_task_is_high_risk(service_with_empty_llm):
    task = make_task(
        deadline=date.today() - timedelta(days=3),
        comments_last_7_days=0,
        status_changes_last_7_days=0,
    )
    result = await service_with_empty_llm.predict(task)
    assert result.risk_level == RiskLevel.HIGH
    assert result.risk_score >= 60

# ─── TCA-03: Overloaded assignee near deadline ───────────────────────────────

@pytest.mark.asyncio
async def test_overloaded_assignee_near_deadline(service_with_empty_llm):
    task = make_task(
        open_tasks_for_assignee=9,
        deadline=date.today() + timedelta(days=2),
        comments_last_7_days=0,
        status_changes_last_7_days=0,
    )
    result = await service_with_empty_llm.predict(task)
    assert result.risk_level == RiskLevel.HIGH

# ─── TCA-04: On-track task is low risk ──────────────────────────────────────

@pytest.mark.asyncio
async def test_on_track_task_is_low(service_with_empty_llm):
    task = make_task(
        deadline=date.today() + timedelta(days=20),
        open_tasks_for_assignee=1,
        comments_last_7_days=5,
        status_changes_last_7_days=2,
        past_on_time_rate=0.90,
    )
    result = await service_with_empty_llm.predict(task)
    assert result.risk_level == RiskLevel.LOW
    assert result.risk_score < 30

# ─── TCA-07: LLM failure → fallback to rule score ───────────────────────────

@pytest.mark.asyncio
async def test_llm_failure_uses_rule_score(service_with_empty_llm):
    task = make_task(deadline=date.today() + timedelta(days=2))
    # Should not raise any exception
    result = await service_with_empty_llm.predict(task)
    assert result is not None
    assert 0 <= result.risk_score <= 100
    assert result.risk_level in [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH]

# ─── TCA-08: LLM score guardrail ─────────────────────────────────────────────

@pytest.mark.asyncio
async def test_llm_score_guardrail(service_with_high_llm):
    # Rule score will be low (10 days, healthy signals)
    task = make_task(
        deadline=date.today() + timedelta(days=10),
        open_tasks_for_assignee=1,
        comments_last_7_days=3,
        past_on_time_rate=0.80,
    )
    # LLM returns score=80 but rule score is ~10
    # Guardrail: max adjustment is +15 → final should be ≤ 25
    result = await service_with_high_llm.predict(task)
    assert result.risk_score <= 35  # 10 rule + 15 max = 25, some margin

# ─── Rule engine unit tests ───────────────────────────────────────────────────

def test_rule_score_overdue():
    service = RiskService(llm_repo=MagicMock())
    task = make_task(deadline=date.today() - timedelta(days=1))
    score = service._compute_rule_score(task)
    assert score >= 50

def test_rule_score_great_history_reduces_score():
    service = RiskService(llm_repo=MagicMock())
    base_task = make_task(past_on_time_rate=0.70)
    great_task = make_task(past_on_time_rate=0.95)
    base_score = service._compute_rule_score(base_task)
    great_score = service._compute_rule_score(great_task)
    assert great_score < base_score

def test_rule_score_poor_history_increases_score():
    service = RiskService(llm_repo=MagicMock())
    base_task = make_task(past_on_time_rate=0.70)
    poor_task = make_task(past_on_time_rate=0.30)
    base_score = service._compute_rule_score(base_task)
    poor_score = service._compute_rule_score(poor_task)
    assert poor_score > base_score
