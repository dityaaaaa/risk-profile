from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg

from app.core.db import get_db
from app.api.auth import get_current_user
from app.schemas.assessment import AssessmentSubmit, AssessmentResponse
from app.repository.assessment_repo import AssessmentRepository

router = APIRouter(prefix="/assessment", tags=["Risk Profile Calculation"])

@router.post("/calculate", response_model=AssessmentResponse)
async def calculate_risk_profile(
    data: AssessmentSubmit,
    current_user: Annotated[dict, Depends(get_current_user)],
    pool: Annotated[asyncpg.Pool, Depends(get_db)]
):
    try:
        # Submit & Langsung dapat balikan hasil hitungan
        result = await AssessmentRepository.calculate(
            pool=pool, user_id=current_user['id'], data=data
        )
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Calculation Failed")
