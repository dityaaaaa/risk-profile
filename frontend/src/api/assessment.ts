import apiClient from './client';
import { AssessmentSubmit, AssessmentResponse } from '../types/assessment';

export const assessmentApi = {
  calculateAssessment: async (data: AssessmentSubmit): Promise<AssessmentResponse> => {
    const response = await apiClient.post<AssessmentResponse>('/assessment/calculate', data);
    return response.data;
  },
};
