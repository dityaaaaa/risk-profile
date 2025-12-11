import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { UNIT_TYPES } from '../../utils/constants';
import { validation } from '../../utils/validation';
import type { AssessmentDetailRequest } from '../../types/assessment';
import { masterDataApi, type RiskType, type Period } from '../../api/masterData';
import { useToast } from '../../hooks/useToast';

interface AssessmentFormProps {
  onSubmit: (data: {
    period_id: number;
    unit_type: 'LPEI' | 'UUS';
    details: AssessmentDetailRequest[];
  }) => Promise<void>;
  loading: boolean;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, loading }) => {
  const { error: showError } = useToast();
  
  // State for master data from backend
  const [periods, setPeriods] = useState<Period[]>([]);
  const [riskTypes, setRiskTypes] = useState<RiskType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [periodId, setPeriodId] = useState<number>(0);
  const [unitType, setUnitType] = useState<'LPEI' | 'UUS'>('LPEI');
  const [riskValues, setRiskValues] = useState<{
    [key: number]: { inherent: string; kpmr: string };
  }>({});
  const [errors, setErrors] = useState<{
    [key: number]: { inherent?: string; kpmr?: string };
  }>({});

  // Fetch periods on mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const data = await masterDataApi.getPeriods();
        setPeriods(data);
        if (data.length > 0) {
          setPeriodId(data[0].id);
        }
      } catch (error) {
        showError('Failed to load periods');
        console.error('Error fetching periods:', error);
      }
    };
    fetchPeriods();
  }, []);

  // Fetch risk types when unit type changes
  useEffect(() => {
    const fetchRiskTypes = async () => {
      setLoadingData(true);
      try {
        const data = await masterDataApi.getRiskTypes(unitType);
        setRiskTypes(data);
      } catch (error) {
        showError('Failed to load risk types');
        console.error('Error fetching risk types:', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchRiskTypes();
  }, [unitType]);

  const handleInherentChange = (riskId: number, value: string) => {
    setRiskValues((prev) => ({
      ...prev,
      [riskId]: { ...prev[riskId], inherent: value },
    }));
    // Clear error when user types
    if (errors[riskId]?.inherent) {
      setErrors((prev) => ({
        ...prev,
        [riskId]: { ...prev[riskId], inherent: undefined },
      }));
    }
  };

  const handleKpmrChange = (riskId: number, value: string) => {
    setRiskValues((prev) => ({
      ...prev,
      [riskId]: { ...prev[riskId], kpmr: value },
    }));
    // Clear error when user types
    if (errors[riskId]?.kpmr) {
      setErrors((prev) => ({
        ...prev,
        [riskId]: { ...prev[riskId], kpmr: undefined },
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: number]: { inherent?: string; kpmr?: string } } = {};
    let isValid = true;

    riskTypes.forEach((risk) => {
      const values = riskValues[risk.id];
      const inherent = values?.inherent ? parseFloat(values.inherent) : NaN;
      const kpmr = values?.kpmr ? parseInt(values.kpmr) : NaN;

      if (!values?.inherent || isNaN(inherent)) {
        newErrors[risk.id] = { ...newErrors[risk.id], inherent: 'Required' };
        isValid = false;
      } else if (!validation.validateInherentRisk(inherent)) {
        newErrors[risk.id] = { ...newErrors[risk.id], inherent: 'Must be between 1-5' };
        isValid = false;
      }

      if (!values?.kpmr || isNaN(kpmr)) {
        newErrors[risk.id] = { ...newErrors[risk.id], kpmr: 'Required' };
        isValid = false;
      } else if (!validation.validateKPMR(kpmr)) {
        newErrors[risk.id] = { ...newErrors[risk.id], kpmr: 'Must be integer 1-5' };
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const details: AssessmentDetailRequest[] = riskTypes.map((risk) => ({
      risk_type_id: risk.id,
      inherent: parseFloat(riskValues[risk.id].inherent),
      kpmr: parseInt(riskValues[risk.id].kpmr),
    }));

    await onSubmit({
      period_id: periodId,
      unit_type: unitType,
      details,
    });
  };

  if (loadingData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading assessment form...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodId">Period</Label>
              <Select
                id="periodId"
                value={periodId.toString()}
                onChange={(e) => setPeriodId(parseInt(e.target.value))}
                disabled={periods.length === 0}
              >
                {periods.length === 0 ? (
                  <option value="">No periods available</option>
                ) : (
                  periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))
                )}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitType">Unit Type</Label>
              <Select
                id="unitType"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value as 'LPEI' | 'UUS')}
              >
                {UNIT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Risk Assessment Table</h3>
            
            {/* Excel-like Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold w-12">No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Risk Type</th>
                    {/* <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th> */}
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-40">
                      Inherent Risk
                      <div className="text-xs font-normal mt-1 opacity-90">(1-5, decimal)</div>
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold w-40">
                      KPMR
                      <div className="text-xs font-normal mt-1 opacity-90">(1-5, integer)</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {riskTypes.map((risk, index) => (
                    <tr 
                      key={risk.id} 
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                      } hover:bg-blue-100/50 transition-colors`}
                    >
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-700">
                        {risk.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                        {risk.name}
                      </td>
                      {/* <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                        {risk.description}
                      </td> */}
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          id={`inherent-${risk.id}`}
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={riskValues[risk.id]?.inherent || ''}
                          onChange={(e) => handleInherentChange(risk.id, e.target.value)}
                          placeholder="1.0 - 5.0"
                          className={`text-center font-medium ${
                            errors[risk.id]?.inherent 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          aria-label={`Inherent risk for ${risk.name}`}
                          aria-invalid={!!errors[risk.id]?.inherent}
                        />
                        {errors[risk.id]?.inherent && (
                          <p className="text-xs text-red-600 mt-1 text-center">
                            {errors[risk.id].inherent}
                          </p>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          id={`kpmr-${risk.id}`}
                          type="number"
                          min="1"
                          max="5"
                          value={riskValues[risk.id]?.kpmr || ''}
                          onChange={(e) => handleKpmrChange(risk.id, e.target.value)}
                          placeholder="1 - 5"
                          className={`text-center font-medium ${
                            errors[risk.id]?.kpmr 
                              ? 'border-red-500 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          aria-label={`KPMR for ${risk.name}`}
                          aria-invalid={!!errors[risk.id]?.kpmr}
                        />
                        {errors[risk.id]?.kpmr && (
                          <p className="text-xs text-red-600 mt-1 text-center">
                            {errors[risk.id].kpmr}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Input Guidelines
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Inherent Risk:</strong> Enter value between 1.0 - 5.0 (decimals allowed, e.g., 3.5)</li>
                <li>• <strong>KPMR:</strong> Enter integer value between 1 - 5 (whole numbers only)</li>
                <li>• All fields are required before submission</li>
              </ul>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Risk Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
