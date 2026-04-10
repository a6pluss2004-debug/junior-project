from fastapi import APIRouter, Depends, HTTPException, status
from models.request import TaskRiskRequest
from models.response import TaskRiskResponse
from services.risk_service import RiskService
from repositories.llm_repository import LLMRepository

router = APIRouter(tags=["Risk Prediction"])

def get_risk_service() -> RiskService:
    """Dependency injection — clean, testable, mirrors project's service layer."""
    return RiskService(llm_repo=LLMRepository())

@router.post(
    "/predict-risk",
    response_model=TaskRiskResponse,
    status_code=status.HTTP_200_OK,
    summary="Predict delay risk for a single task",
    description=(
        "Accepts task data and computed signals from Next.js. "
        "Returns a risk level (HIGH/MEDIUM/LOW), score (0-100), "
        "a human-readable reason, and actionable suggestions. "
        "Tasks in 'Done' column always return LOW with score=0."
    )
)
async def predict_risk(
    task: TaskRiskRequest,
    service: RiskService = Depends(get_risk_service)
):
    try:
        return await service.predict(task)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Risk analysis failed: {str(e)}"
        )
