import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  User,
  CalendarCheck,
  ChartBar,
  CreditCard,
  User2,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import CareCampLogo from '../Shared/CareCampLogo/CareCampLogo';

const Sidebar = () => {
  const { logOut } = useAuth();
  const { role } = useUserRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const isOrganizer = role === 'organizer';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const navSections = [
    {
      title: 'General',
      items: [
        { to: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={16} />, end: true },
      ],
    },
    {
      title: isOrganizer ? 'Camp Management' : 'My Activity',
      items: isOrganizer
        ? [
            { to: '/dashboard/add-camp', label: 'Add New Camp', icon: <PlusCircle size={16} /> },
            {
              to: '/dashboard/manage-camps',
              label: 'Manage Camps',
              icon: <ClipboardList size={16} />,
            },
            {
              to: '/dashboard/manage-registered-camps',
              label: 'Registrations',
              icon: <CalendarCheck size={16} />,
            },
          ]
        : [
            { to: '/dashboard/analytics', label: 'Analytics', icon: <ChartBar size={16} /> },
            {
              to: '/dashboard/registered-camps',
              label: 'My Camps',
              icon: <ClipboardList size={16} />,
            },
            { to: '/dashboard/payment-history', label: 'Payments', icon: <CreditCard size={16} /> },
          ],
    },
    {
      title: 'Account',
      items: [
        {
          to: isOrganizer ? '/dashboard/organizer-profile' : '/dashboard/participant-profile',
          label: 'My Profile',
          icon: isOrganizer ? <User2 size={16} /> : <User size={16} />,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile toggle */}
      {!isMobileMenuOpen && (
        <button
          className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-[#495E57] dark:bg-slate-900 text-white shadow-lg border border-white/10 dark:border-slate-800"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Backdrop */}
      {isMobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen flex flex-col bg-[#495E57] dark:bg-slate-900 border-r border-white/10 dark:border-slate-800 transition-transform duration-300 ease-in-out shadow-xl ${
          isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
        {/* Mobile close */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white rounded-lg bg-white/10 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        )}

        {/* Top: Logo area */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10 dark:border-slate-800">
          <CareCampLogo />
          <p className="text-[10px] text-slate-300/60 font-medium mt-2 pl-0.5">
            {isOrganizer ? 'Organizer Portal' : 'Participant Portal'}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/35 dark:text-slate-500 px-2 mb-1.5">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end ?? false}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-white/15 dark:bg-slate-800 text-white border border-white/15 dark:border-slate-700'
                          : 'text-slate-300 dark:text-slate-400 hover:bg-white/8 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-slate-200'
                      }`
                    }
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={
                            isActive
                              ? 'text-[#F4CE14]'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-white/80'
                          }
                        >
                          {link.icon}
                        </span>
                        <span className="flex-1 truncate">{link.label}</span>
                        {isActive && <ChevronRight size={12} className="text-[#F4CE14] shrink-0" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 pt-3 border-t border-white/10 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/15 transition-all cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
