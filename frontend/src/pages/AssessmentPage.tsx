import React, { useState } from 'react';
import { AssessmentForm } from '../components/assessment/AssessmentForm';
import { ResultsTable } from '../components/assessment/ResultsTable';
import { assessmentApi } from '../api/assessment';
import { AssessmentResponse, AssessmentSubmit } from '../types/assessment';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/button';

export const AssessmentPage: React.FC = () => {
  const [results, setResults] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const handleSubmit = async (data: AssessmentSubmit) => {
    setLoading(true);
    try {
      const response = await assessmentApi.calculateAssessment(data);
      setResults(response);
      showSuccess('Assessment calculated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to calculate assessment. Please try again.';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAssessment = () => {
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
        {results && (
          <Button onClick={handleNewAssessment} variant="outline">
            New Assessment
          </Button>
        )}
      </div>

      {!results ? (
        <AssessmentForm onSubmit={handleSubmit} loading={loading} />
      ) : (
        <ResultsTable results={results} />
      )}
    </div>
  );
};
