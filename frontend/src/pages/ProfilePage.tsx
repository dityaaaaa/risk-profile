import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="text-lg font-medium">{user.full_name || 'Not provided'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="text-lg font-medium">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                {user.role.toUpperCase()}
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-medium">
              {format(new Date(user.created_at), 'MMMM d, yyyy')}
            </p>
          </div>

          <div className="pt-4">
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
