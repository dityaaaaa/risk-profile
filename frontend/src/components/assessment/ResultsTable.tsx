import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AssessmentResponse } from '../../types/assessment';

interface ResultsTableProps {
  results: AssessmentResponse;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const getRatingColor = (rating: number): string => {
    if (rating <= 2) return 'bg-green-100 text-green-800';
    if (rating === 3) return 'bg-yellow-100 text-yellow-800';
    if (rating === 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getRatingLabel = (rating: number): string => {
    if (rating <= 2) return 'Low';
    if (rating === 3) return 'Moderate';
    if (rating === 4) return 'High';
    return 'Very High';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Final Score</p>
              <p className="text-3xl font-bold text-blue-600">{results.final_score.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Final Rating</p>
              <p className="text-3xl font-bold text-purple-600">{results.final_rating}</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Name</TableHead>
                <TableHead>Weight %</TableHead>
                <TableHead>Inherent (Original)</TableHead>
                <TableHead>Inherent (Rounded)</TableHead>
                <TableHead>KPMR</TableHead>
                <TableHead>Risk Rating</TableHead>
                <TableHead>Composite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.table_data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.risk_name}</TableCell>
                  <TableCell>{row.weight_percent}</TableCell>
                  <TableCell>{row.inherent_origin.toFixed(2)}</TableCell>
                  <TableCell>{row.inherent_round}</TableCell>
                  <TableCell>{row.kpmr}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getRatingColor(
                        row.risk_rating
                      )}`}
                    >
                      {row.risk_rating} - {getRatingLabel(row.risk_rating)}
                    </span>
                  </TableCell>
                  <TableCell>{row.composite.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
