import { useLocation } from 'react-router';
import { Bell, Search, ChevronRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import ThemeToggle from '../../components/Common/ThemeToggle';

const routeLabels = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/add-camp': 'Add New Camp',
  '/dashboard/manage-camps': 'Manage Camps',
  '/dashboard/manage-registered-camps': 'Registered Camps',
  '/dashboard/organizer-profile': 'Organizer Profile',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/registered-camps': 'My Registered Camps',
  '/dashboard/payment-history': 'Payment History',
  '/dashboard/participant-profile': 'Participant Profile',
};

const DashboardTopbar = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const location = useLocation();
  const isOrganizer = role === 'organizer';

  const pageLabel = routeLabels[location.pathname] || 'Dashboard';
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Good Morning' : now.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 shadow-xs">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium min-w-0">
          <span className="shrink-0">Dashboard</span>
          {pageLabel !== 'Dashboard Overview' && (
            <>
              <ChevronRight size={14} className="shrink-0 text-slate-300 dark:text-slate-600" />
              <span className="text-slate-700 dark:text-slate-200 font-bold truncate">
                {pageLabel}
              </span>
            </>
          )}
        </div>
        <div className="hidden sm:block ml-3 px-2.5 py-1 rounded-full bg-[#495E57]/10 dark:bg-[#F4CE14]/10 text-[10px] font-black uppercase tracking-widest text-[#495E57] dark:text-[#F4CE14]">
          {isOrganizer ? 'Organizer' : 'Participant'}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-400 dark:text-slate-500 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <Search size={14} />
          <span>Quick search...</span>
          <kbd className="ml-2 px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] text-slate-400 dark:text-slate-400 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F4CE14] border-2 border-white dark:border-slate-900" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* User Greeting + Avatar */}
        <div className="hidden sm:flex items-center gap-2.5 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-none">
              {greeting},
            </p>
            <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[100px]">
              {user?.displayName?.split(' ')[0] || 'User'}
            </p>
          </div>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#495E57] dark:group-hover:border-[#F4CE14] transition-colors shadow-xs"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-900 font-black text-xs flex items-center justify-center shadow-xs border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#495E57] dark:group-hover:border-[#F4CE14] transition-colors">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
