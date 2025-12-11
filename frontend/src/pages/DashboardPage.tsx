import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserRole } from '../types/user';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const quickLinks = [
    {
      title: 'Submit Assessment',
      description: 'Create a new risk assessment',
      path: '/assessment',
      roles: [UserRole.USER, UserRole.ERM, UserRole.SUPER_ADMIN],
    },
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove users',
      path: '/users',
      roles: [UserRole.SUPER_ADMIN],
    },
    {
      title: 'View Profile',
      description: 'View your account information',
      path: '/profile',
      roles: [UserRole.USER, UserRole.ERM, UserRole.SUPER_ADMIN],
    },
  ];

  const visibleLinks = quickLinks.filter((link) => link.roles.includes(user.role));

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.full_name || user.email}! 👋</h1>
        <div className="flex items-center gap-4 mt-4">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            {user.role.replace('_', ' ').toUpperCase()}
          </span>
          <span className="text-blue-100">
            Member since {format(new Date(user.created_at), 'MMMM d, yyyy')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleLinks.map((link, index) => (
          <Link key={link.path} to={link.path}>
            <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer h-full border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  index === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                  index === 1 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                  'bg-gradient-to-br from-green-500 to-teal-600'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {index === 0 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    ) : index === 1 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    )}
                  </svg>
                </div>
                <CardTitle className="text-xl">{link.title}</CardTitle>
                <CardDescription className="text-base">{link.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Submit a risk assessment to evaluate your organization's risk profile</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">View detailed results with risk ratings and composite scores</span>
            </li>
            {user.role === UserRole.SUPER_ADMIN && (
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Manage users and assign appropriate roles</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
