import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, role, token } = useAuth();

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400">
          Admin authorization required to view this command center module.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg"
        >
          Switch / Login as Admin
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
