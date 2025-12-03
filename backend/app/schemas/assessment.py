from pydantic import BaseModel, Field
from typing import List

class AssessmentDetailRequest(BaseModel):
    risk_type_id: int
    inherent: float = Field(..., ge=1, le=5)
    kpmr: int = Field(..., ge=1, le=5)

class AssessmentSubmit(BaseModel):
    period_id: int
    unit_type: str # 'LPEI' atau 'UUS'
    details: List[AssessmentDetailRequest]

class AssessmentDetailResponse(BaseModel):
    risk_name: str
    weight_percent: str
    inherent_origin: float
    inherent_round: int
    kpmr: int
    risk_rating: int
    composite: float

class AssessmentResponse(BaseModel):
    id: int
    final_score: float
    final_rating: str
    table_data: List[AssessmentDetailResponse]