import React from 'react';
import {
  CalendarCheck,
  Users,
  BarChart2,
  PlusCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fetch organizer camps summary
  const { data: campsData = [] } = useQuery({
    queryKey: ['organizerOverviewCamps'],
    queryFn: async () => {
      const res = await axiosSecure.get('/camps');
      return res.data?.data || res.data || [];
    },
  });

  // Calculate live stats
  const totalCamps = campsData.length;
  const totalParticipants = campsData.reduce((acc, curr) => acc + (curr.participantCount || 0), 0);
  const totalRevenue = campsData.reduce(
    (acc, curr) => acc + (curr.fees || 0) * (curr.participantCount || 0),
    0
  );
  const recentCampsList = campsData.slice(0, 4);

  const quickActions = [
    {
      title: 'Add New Camp',
      description: 'Publish a new medical initiative with fee & location details.',
      icon: <PlusCircle size={20} className="text-[#495E57] dark:text-[#F4CE14]" />,
      action: () => navigate('/dashboard/add-camp'),
      badge: 'Create',
    },
    {
      title: 'Manage Camps',
      description: 'View, edit, or remove your registered medical camps.',
      icon: <CalendarCheck size={20} className="text-emerald-600 dark:text-emerald-400" />,
      action: () => navigate('/dashboard/manage-camps'),
      badge: 'Manage',
    },
    {
      title: 'Manage Registrations',
      description: 'Review participant applications, confirmation status & payments.',
      icon: <Users size={20} className="text-sky-600 dark:text-sky-400" />,
      action: () => navigate('/dashboard/manage-registered-camps'),
      badge: 'Registrations',
    },
    {
      title: 'Organizer Analytics',
      description: 'Analyze total camp revenue, participant counts & growth charts.',
      icon: <BarChart2 size={20} className="text-amber-600 dark:text-amber-400" />,
      action: () => navigate('/dashboard/organizer-analytics'),
      badge: 'Analytics',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Organizer <span className="text-[#495E57] dark:text-[#F4CE14]">Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time control panel for medical camp operations, participant signups, and financial
            metrics.
          </p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/add-camp')}
          className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2.5 px-4 h-auto rounded-xl flex items-center gap-2 border-none shadow-xs hover:opacity-90 transition cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Add New Camp</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Camps
              </span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {totalCamps}
              </h3>
            </div>
            <div className="p-3 bg-[#495E57]/10 dark:bg-slate-800 rounded-2xl text-[#495E57] dark:text-[#F4CE14]">
              <CalendarCheck size={22} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">
            Active Healthcare Drives
          </p>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Participants
              </span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                {totalParticipants}
              </h3>
            </div>
            <div className="p-3 bg-sky-500/10 dark:bg-slate-800 rounded-2xl text-sky-600 dark:text-sky-400">
              <Users size={22} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">
            Registered Attendees
          </p>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Estimated Revenue
              </span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">
                ${totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 dark:bg-slate-800 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <DollarSign size={22} />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium">
            Accumulated Camp Fees
          </p>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Organizer Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Card
              key={idx}
              onClick={action.action}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-400 group-hover:text-[#495E57] dark:group-hover:text-[#F4CE14] group-hover:translate-x-1 transition-all"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#495E57] dark:group-hover:text-[#F4CE14] transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {action.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Medical Camps Section */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarCheck size={18} className="text-[#495E57] dark:text-[#F4CE14]" />
              Recent Medical Camps
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Overview of your registered healthcare camps and current attendee counts.
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard/manage-camps')}
            variant="outline"
            className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs h-9 px-3 rounded-xl cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>

        <div className="p-6">
          {recentCampsList.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <Clock size={32} className="mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                No medical camps found.
              </p>
              <Button
                onClick={() => navigate('/dashboard/add-camp')}
                className="bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 font-bold text-xs py-2 px-4 rounded-xl border-none"
              >
                Create Your First Camp
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCampsList.map((camp) => (
                <div
                  key={camp._id}
                  className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-4 hover:border-[#495E57] transition cursor-pointer"
                  onClick={() => navigate('/dashboard/manage-camps')}
                >
                  <img
                    src={
                      camp.imageURL ||
                      camp.image ||
                      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300'
                    }
                    alt={camp.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {camp.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Fee: ${camp.fees} • {camp.participantCount || 0} Registered
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">{camp.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OrganizerDashboard;
