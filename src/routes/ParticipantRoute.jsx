import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';
import { Loader2 } from 'lucide-react';

const ParticipantRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 space-y-3 p-4">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 animate-pulse">
          Verifying Participant Permissions...
        </p>
      </div>
    );
  }

  if (!user || role !== 'participant') {
    return <Navigate state={{ from: location.pathname }} to="/forbidden" replace />;
  }

  return children;
};

export default ParticipantRoute;
