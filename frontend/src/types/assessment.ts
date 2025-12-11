export interface AssessmentDetailRequest {
  risk_type_id: number;
  inherent: number; // float 1-5
  kpmr: number; // integer 1-5
}

export interface AssessmentSubmit {
  period_id: number;
  unit_type: 'LPEI' | 'UUS';
  details: AssessmentDetailRequest[];
}

export interface AssessmentDetailResponse {
  risk_name: string;
  weight_percent: string;
  inherent_origin: number;
  inherent_round: number;
  kpmr: number;
  risk_rating: number;
  composite: number;
}

export interface AssessmentResponse {
  id: number;
  final_score: number;
  final_rating: string;
  table_data: AssessmentDetailResponse[];
}

export interface RiskType {
  id: number;
  name: string;
  description?: string;
}
