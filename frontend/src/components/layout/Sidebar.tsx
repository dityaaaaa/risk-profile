import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/user';
import { Button } from '../ui/button';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: [UserRole.USER, UserRole.ERM, UserRole.SUPER_ADMIN] },
    { path: '/assessment', label: 'Assessment', roles: [UserRole.USER, UserRole.ERM, UserRole.SUPER_ADMIN] },
    { path: '/users', label: 'Manage Users', roles: [UserRole.SUPER_ADMIN] },
    { path: '/profile', label: 'Profile', roles: [UserRole.USER, UserRole.ERM, UserRole.SUPER_ADMIN] },
  ];

  const visibleNavItems = navItems.filter((item) =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Risk Assessment
            </h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
        {user && (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-sm font-medium text-white truncate">{user.email}</p>
            <p className="text-xs text-blue-400 mt-1 capitalize">{user.role.replace('_', ' ').toUpperCase()}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {visibleNavItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </Button>
      </div>
    </div>
  );
};
