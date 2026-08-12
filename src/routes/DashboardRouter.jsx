import OrganizerDashboard from '../pages/Dashboard/Organizer/OrganizerDashboard';
import ParticipantDashboard from '../pages/Dashboard/Participant/ParticipantDashboard';
import useUserRole from '../hooks/useUserRole';
import { Loader2 } from 'lucide-react';

const DashboardRouter = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 p-6 text-center">
        <Loader2 className="animate-spin h-10 w-10 text-[#495E57] dark:text-[#F4CE14]" />
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 animate-pulse">
          Loading your customized dashboard...
        </p>
      </div>
    );
  }

  if (role === 'organizer') {
    return <OrganizerDashboard />;
  }

  if (role === 'participant') {
    return <ParticipantDashboard />;
  }

  // Fallback if role loading or unknown
  return <ParticipantDashboard />;
};

export default DashboardRouter;
