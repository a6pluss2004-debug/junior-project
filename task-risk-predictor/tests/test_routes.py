import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app
from models.response import TaskRiskResponse, RiskLevel
from datetime import date, timedelta

client = TestClient(app)

VALID_PAYLOAD = {
    "task_id": "abc123",
    "project_id": "proj456",
    "title": "Implement Login Page",
    "description": "Build auth UI",
    "deadline": str(date.today() + timedelta(days=5)),
    "today": str(date.today()),
    "column_name": "In Progress",
    "assignee_name": "Amjad",
    "assignee_role": "member",
    "open_tasks_for_assignee": 3,
    "comments_last_7_days": 1,
    "status_changes_last_7_days": 1,
    "past_on_time_rate": 0.70,
}

MOCK_RESPONSE = TaskRiskResponse(
    task_id="abc123",
    project_id="proj456",
    risk_level=RiskLevel.MEDIUM,
    risk_score=45,
    reason="Deadline is in 5 days with moderate workload.",
    suggestions=["Monitor progress daily"],
    days_until_deadline=5,
)

# ─── TCA-09: Valid request returns 200 ───────────────────────────────────────

def test_predict_risk_valid_request():
    with patch(
        "api.v1.routes.risk.RiskService.predict",
        new_callable=AsyncMock,
        return_value=MOCK_RESPONSE,
    ):
        response = client.post("/api/v1/predict-risk", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] in ["HIGH", "MEDIUM", "LOW"]
    assert 0 <= data["risk_score"] <= 100
    assert "reason" in data
    assert isinstance(data["suggestions"], list)

# ─── TCA-10: Missing field returns 422 ───────────────────────────────────────

def test_predict_risk_missing_task_id():
    bad_payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "task_id"}
    response = client.post("/api/v1/predict-risk", json=bad_payload)
    assert response.status_code == 422

# ─── TCA-11: Health check ─────────────────────────────────────────────────────

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
