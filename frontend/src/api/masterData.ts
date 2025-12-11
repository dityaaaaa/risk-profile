import apiClient from './client';

export interface RiskType {
  id: number;
  name: string;
  weight: number;
  is_uus?: boolean;
  is_lpei?: boolean;
}

export interface Period {
  id: number;
  name: string;
  year: number;
  quarter: number;
  start_date: string;
  end_date: string;
}

export const masterDataApi = {
  getRiskTypes: async (unitType: 'LPEI' | 'UUS'): Promise<RiskType[]> => {
    const response = await apiClient.get<RiskType[]>(`/master/risk-types?unit_type=${unitType}`);
    return response.data;
  },

  getPeriods: async (): Promise<Period[]> => {
    const response = await apiClient.get<Period[]>('/master/periods');
    return response.data;
  },
};
